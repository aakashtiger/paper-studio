# 0029 — One pass, every picture check

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`scripts/inspect.ts`, `src/engine/motion.ts`)
**Depends on:** 0023 (a frame is pure), 0026 (checks run before the render), 0028 (the movement probe)

## Context

After 0028 the chain asked three picture questions of a score before painting it:

| command | frames painted | what it did with them |
|---|---|---|
| `probe:motion` | 150 (15 per shot) | read a 48×27 sample, measured travel |
| `audit:type` | 120 (0.5 s steps) | read the text boxes |
| `audit:rig` | 601 (0.1 s steps) | read the rig records |

All three paint the *same* frames, through the same painter, from the same
score — a frame is a pure function of time (0023), so each command was
re-deriving a picture the other two had already drawn. And every one of them
wrote a PNG for every frame: a rig pass wrote **601 files, 2.0 GB**, a type pass
120 files, 409 MB. Neither audit ever opens one. The pictures were pure cost:
encode to PNG (in the browser), base64, ship over the debugging protocol, decode,
write to disk.

Measured on *Same Alarm*: three passes took **92.5 s**, of which the rig pass
alone was 56.8 s and 2 GB of the 2.4 GB written.

## Decision

**`npm run inspect -- <score>` paints one grid of frames, probe-only, and asks
all three questions of that one probe.**

Two changes, both mechanical:

1. **`render-film --no-png`.** A stills pass can draw a frame, measure it and
   never encode it. Same probe data, byte for byte — verified on 50 frames
   (`probe data identical: true`) — **2.11× faster** (21.2 s → 10.0 s) and no
   bytes on disk. The display probe (`collage`, `storyboard`, `stills`) still
   asks for PNGs; only the auditors are probe-only.
2. **`--probe <file>` on `audit:type` and `audit:rig`.** Given a probe, they
   skip painting and read it, keeping only the frames **on their own grid**
   (`time / step` is an integer). So a verdict is exactly the verdict they would
   have reached alone: type still judges 120 frames, rig still judges 600 and
   reports the same 1,030 legs — only the painting is shared.

The movement report is written in the shape the renderer's gate already reads
(`build/<id>/motion-probe/motion-probe.json`, `motionReportFor()` in
`src/engine/motion.ts`), so a gate does not care which command painted the
frames it trusts. `probe:motion` keeps working as the cheap standalone check;
`inspect` supersedes it in the chain.

**The type and rig audits now run *before* the render.** They never read the
delivered film — they paint their own frames and judge those — so running them
after the render was the 0026 defect again: two 0.1 s-per-frame checks waiting
behind a ten-minute paint to report something a frame would have said. A frame
is pure (0023), so a still painted before the render *is* the frame the film will
deliver. Only `audit:motion`, `paint`, `palette`, `frames`, `strips`, `asr` and
`deliver` need the file that exists.

## Measured

*Same Alarm*, 60 s, 10 shots, 600 frames at 0.1 s steps, four workers:

| | before 0029 | after |
|---|---|---|
| passes | 3 browsers | **1** |
| frames painted | 871 | **600** |
| PNGs written | 2.4 GB | **0** |
| wall clock | 92.5 s (and ~195 s before `--no-png`) | **59.4 s** |
| verdicts | motion PASS · type PASS · rig PASS | motion PASS · type PASS · rig PASS |

The same run also proves the refusal path: `--step 8` (too coarse to measure
movement) exits 1 and names all three failures — `motion:unmeasured`,
`NO-COPY-MARKED`, `rig … not instrumented`.

## What this does not change

- The three checks are the same three checks, with the same thresholds. No
  measurement was weakened to make a pass cheaper; the movement probe actually
  sees **more** of each shot (40–75 frames per shot instead of 15).
- The collage and the storyboard still paint PNGs, because they are pages for a
  human to look at. They are five frames' worth of work, not six hundred.
- No new dependency, no network.

## Landed

- `scripts/render-film.ts` — `--no-png` on a stills pass; `drawFrame(cdp, time, png)`.
- `scripts/inspect.ts` — `npm run inspect -- <score> [--step 0.1] [--workers]`;
  one probe-only pass, the movement report the gate reads, then `type` and `rig`
  on the shared probe; writes `build/<id>/inspect/inspect.json`.
- `scripts/type-audit.ts`, `scripts/rig-audit.ts` — `--probe <file>`, grid filter.
- `src/engine/motion.ts` — `motionReportFor()`, `MotionReportFile`.
- `scripts/film-chain.mjs` — `inspect` replaces `probe:motion` + `audit:type` +
  `audit:rig`, and all three now run before the first render.
- `test/motion.test.ts` — one more case: the report file's shape and score hash.
