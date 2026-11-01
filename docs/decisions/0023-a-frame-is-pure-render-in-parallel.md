# 0023 — A frame is pure, so render frames in parallel

**Status:** accepted · 1 Nov 2026 · implementation after the current cut
**Owners:** technical (`scripts/render-film.ts`)
**Measured cost today:** 2008 s and 2071 s for one 60 s film (1800 frames at 30 fps)
**Machine:** i7-12700H, 14 cores / 20 threads, 15.7 GB

## Context

The renderer serves the composition over HTTP, drives one headless Chrome over
CDP, and paints frames **one at a time**:

```
for (offset…) { const frame = await drawFrame(cdp, index / fps); writePng(frame); }
```

then encodes the PNG sequence with ffmpeg. It measures ~1.0 fps, so a one-minute
film is 33 minutes, and an acceptance chain renders the film **twice** (deliverable
+ determinism twin), so a full chain is ~70 minutes of painting.

Nothing about that is necessary. The painter is already written to be a pure
function of absolute film time — that is what `paint-match`, `--from/--to`
slices and the determinism row all rely on — and `render-film.ts` sets the time
and paints, carrying no state from frame to frame. One Chrome painting 1800
frames is 1800 independent problems solved by one process.

## Decision

**The render loop takes `--workers N` (default 1) and paints N contiguous frame
ranges in N Chrome instances.**

Four rules, because a parallel renderer that is not provably identical to the
serial one is worse than a slow one:

1. **Contiguous ranges, absolute numbering.** Worker `w` paints
   `[first + w·chunk, first + (w+1)·chunk)` and writes
   `frame-<absolute index, 1-based, 6 digits>.png` into the *same* directory the
   serial renderer uses. The encode step is then **byte-for-byte the same code
   path**: one `-i frame-%06d.png -start_number <first+1>`. No segment files, no
   concat demuxer, no second encoder invocation, nothing that can shift
   timestamps. Parallelism changes only *who paints*, never *what is encoded*.
2. **Frames are the unit, not time.** Chunk boundaries land on frame indices, so
   every frame is painted at exactly the time the serial render painted it,
   `index / fps`, with no floating-point drift between workers.
3. **One server, N browsers.** The static file server serves all workers; each
   worker gets its own Chrome process, its own `--user-data-dir` and its own CDP
   socket. Nothing is shared but the bytes on disk.
4. **Failure is a failure.** If any worker throws, the render fails and deletes
   its frame directory: a picture with a hole in it must never reach the encoder.

### The proof

A parallel renderer is only acceptable if it produces the serial renderer's film.
The test renders a short window twice — once with `--workers 1`, once with
`--workers 4` — and asserts:

- every frame's PNG is byte-identical (not just visually equal);
- `videoHash` over the two encoded streams is identical.

`videoHash` is already the engine's definition of "the same picture"
(`docs/decisions` on the render manifest), so this reuses the existing language
rather than inventing a second one. Where the two disagree, the parallel renderer
is wrong, not the hash.

## What this does not change

- **Determinism.** Frames were always independent; the twin render's job is to
  prove the *painter* is pure, and it still does. Rendering in parallel does not
  weaken that claim, because each frame is still painted from `(time, score,
  assets)` and nothing else.
- **The manifest.** Still written by the step that painted the frames, still
  hashing the same inputs. `--workers` is a speed knob, not a new contract, so it
  does not enter `contractHash`.
- **The engineer's ability to read it.** One function, one loop, one comment
  explaining why the ranges are contiguous.

## Expected cost

Painting is CPU-bound in Chrome (canvas 2D + PNG encode), and one worker leaves
most of 20 threads idle. At 4 workers expect the picture in **8–10 min**; at 6,
6–7 min, with the encoder as a fixed ~1–2 min tail. Both numbers are estimates
until measured, and the first measurement goes in this file, not in a chat
message.

## Landed · first measurement

`npm run render:workers -- films/same-alarm/score.json` renders the same 2 s
window twice and compares it:

```
window: 20s–22s of same-alarm · serial then 4 workers
frames: 60 vs 60 · IDENTICAL BYTES
picture: same · sha256:314be94b320001a61...
time: 67.3s serial → 28s on 4 workers · 2.4×
```

**Identical PNG bytes for every one of the 60 frames**, and the same encoded
picture hash. That is the claim the decision asked for, at frame resolution, and
it holds while a *third* render was already using the machine — so the 2.4× is a
floor, not a ceiling: 67 s of that window is 60 frames of paint plus two process
starts and two encodes, and the 28 s includes four Chrome launches that a
1800-frame render pays once.

## Consequences

- An acceptance chain drops from ~88 min to ~30 min before any other change.
- The 4-minute iteration slice becomes ~1 minute, which changes the working
  loop: a shot can be measured almost as fast as it can be judged.
- `--workers` must be absent from the default, so a machine that cannot afford N
  browsers still renders correctly; `npm run film:chain` will pass a worker count
  derived from `os.cpus().length` with a stated cap.
