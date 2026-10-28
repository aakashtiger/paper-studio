# S2 Paper K-pop proof — HyperFrames

**Output:** `paper-proof.mp4` · 15 s · 1920 × 1080 · 30 fps
**Shots:** open 4.0 s · sticker 5.0 s · stage 6.0 s
**Film:** *Last Cue* — fictional Nova Kim
**Creative direction:** `CREATIVE.md`

This is the first real S2 proof on the HyperFrames engine. It uses the existing
Paper K-pop paper primitives (cut edges, puppets, halftone, fibre, type) with a
new three-shot scene file. It is not the final plan renderer and not a full film.

## Commands

Run from `Y:\NewVideoTest\studio`:

```powershell
# preview with a timeline in HyperFrames Studio
npx hyperframes preview proofs/s2-paper

# render the 15 s MP4
npx hyperframes render proofs/s2-paper -o proofs/s2-paper/paper-proof.mp4 --fps 30

# snapshots / check
npx hyperframes snapshot proofs/s2-paper --at 1,3,6,8,11,14 --output proofs/s2-paper/snapshots
npx hyperframes check proofs/s2-paper
```

HyperFrames needs FFmpeg and FFprobe. On this machine they are:

```text
Y:\NewVideoTest\node_modules\ffmpeg-static\ffmpeg.exe
Y:\NewVideoTest\studio\node_modules\ffprobe-static\bin\win32\x64\ffprobe.exe
```

Add those directories to `PATH` before running the CLI.

## Preview timeline

`npx hyperframes preview proofs/s2-paper` opens HyperFrames Studio with the
composition, play/scrub and shot timing. It is a single-sequence review
timeline, not a multi-track editor.

## Reviews

- `reviews/ARCHITECT.md` — one engine + style backends; this proof is not the
  plan-driven engine yet.
- `reviews/MOTION.md` — first pass 4.5/10; the motion fixes applied after it.
- `reviews/QA.md` — first pass FAIL; determinism, palette, boot, snapshots and
  README fixes applied.

## What this proves

- The paper style can hold a real 15-second motion piece: open, sticker impact
  and a two-cast stage, with live camera, type, halftone, fibre, confetti and
  performer motion.
- Shot lengths can differ (4 / 5 / 6 s); five seconds is not a rule.
- HyperFrames gives a preview timeline and a deterministic seek/render path.
- The proof is authored from fictional content, not the source film's story.

## QA fixes in this pass

- Grain is seeded, not `Math.random()`; two fresh snapshot runs produced identical hashes at all six sampled times.
- The gold core was `PAL.accent`, which does not exist; it now uses `PAL.gold`.
- The left performer’s blue boot on the blue floor is now red.
- The open and close irises now resolve to red/cream paper, not off-palette blue.
- The stale snapshot set was regenerated after the final render; the contact sheet matches the MP4.
- The README commands now say `studio/`, not the repository root.

## What it does not prove

- It is not plan-driven. The three scenes are authored HTML/Canvas, not a generic
  renderer reading a resolver plan and a full asset library.
- It is not the watercolor backend.
- It is not the final S2 gate: a plan-driven 15 s / 3-shot MP4 with golden-frame
  checks and a production asset library.
- It is silent. Sound is a later cue.
- It uses the existing paper rig primitives; the final engine still needs the
  style-backend boundary and a plan/treatment contract.

## Files

| File | Purpose |
|---|---|
| `index.html` | HyperFrames composition + timeline |
| `scenes.js` | three-shot paper scene renderer |
| `vendor/` | local GSAP, paper primitives, fonts |
| `assets/fonts/` | bundled Paper K-pop fonts |
| `CREATIVE.md` | detailed creative direction / beat sheet / shot sheet |
| `snapshots/` | review stills and contact sheet |
| `paper-proof.mp4` | 15 s output |

## Next

Review the motion, then build the watercolor backend and the plan-driven
renderer contract. Do not add more style packs before the engine and preview are
solid.
