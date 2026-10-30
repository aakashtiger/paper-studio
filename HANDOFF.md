# Paper Studio — handoff (Oct 2026)

Paste this whole document into a new chat. It is self-contained.

## What this project is

Paper Studio: a deterministic, local-first video engine. First milestone is a
30-second animated wedding/K-pop-style film ("The Understudy") generated from an
authored `score.json`. Repo: `github.com/aakashtiger/paper-studio` (branch `main`,
HEAD `6bd9c0c`, everything committed and pushed).

Iron rules (do not violate):
1. **Determinism.** Same brief + seed = identical frames. No `Date.now()`, no
   unseeded `Math.random()`, no network in render code.
2. **The brief/score is the contract.** Every output traceable to it; never
   invent names, dates, copy.
3. **Style code stays in `styles/`; engine never hardcodes palettes or shots.**
4. Every feature ships with a command that proves it works.
5. No new dependency without a stated reason.

## What is already done (all verified by commands)

- Contract layer: film brief, audio resolver, asset manifest, pose library,
  film score. `npm run plan|treatment|film|captions|board|audit|sheet|sfx|animatic`.
- Score-driven painters per shot + deterministic CDP renderer
  (`scripts/render-film.ts`, headless Chrome, `--disable-gpu`, canvas
  `toDataURL` per frame). Two full 30 s renders (1920x1080/30fps/900 frames)
  were byte-identical.
- Frame audit (`scripts/frame-audit.ts`) on the delivered MP4: 900/900, luma
  108.8–207.4, 40 cuts, 0 missed, 0 blank, pass. Palette audit: worst outlier
  0.40% (limit 0.5%), pass.
- Mix bus (`src/engine/mix.ts`, decision doc `docs/decisions/0013-mix-bus.md`):
  pure deterministic DSP, voice highpass 75 Hz, per-cue band/send/duck,
  1–4 kHz sidechain, shared reverb, two-pass ffmpeg loudnorm. Master at
  `build/understudy/mix/master.wav` = −14.5 LUFS / −1.4 dBTP. Film re-rendered
  with real master at `films/understudy/understudy.mp4` (21,631,307 bytes).
- SFX generator (`scripts/sfx.ts`): 13 code-generated cues incl. room tone.
- 163 unit/gate tests pass; `npm run typecheck` clean.

## The two open look defects (what to fix FIRST)

Both are in the vendor paper rig code under `films/understudy/`. The rig is
plain 2D canvas code: two-bone leg IK, ankle targets, foot pitch, hip bounce.

1. **s08 duet draw fault.** Shot 8 (19.5–24.6 s, text "TWO OF THEM", duet branch
   of `stage()` in `films/understudy/backend.js` lines ~300–361) draws Nova/Mira
   with scale 1.12/0.98 and the rig breaks visually (hair fan / pleated skirt
   drawn misplaced). Investigation already proved:
   - NOT pose math: `poseA` params sane at every sampled time (`vm` probes in
     `build/understudy/probe2..4.cjs`).
   - NOT stage translate: entity transforms at rest are correct.
   - Renderer-native stills and MP4 crops break identically (also NOT encoding).
   → It is a vendor draw-path bug, prime suspects: `pleatedSkirt()` and the
   hair fan inside `idol()` in `films/understudy/vendor/characters.js`
   (hair fan ~lines 415–432, `pleatedSkirt` ~87–109, call site ~461–462),
   only mis-transforming in the duet branch. Compare against the
   single-character stage path which uses scale 1.34/1.28 at y 960/1160 and
   renders correctly.
2. **s09 empty final frame.** `films/understudy/backend.js` lines 570–573 hard-
   fill the whole frame with `PAL.paper` at `lt > d - 0.2`, stacked on top of a
   closing iris (lines 566–569, `irisOverlay` + `PAL.paper` fill → frame goes
   fully cream with visible gradient ring). The iris already closes to ~1 px.
   The end-fill was meant to guarantee a clean last frame but reads as a
   beige flash for ~6 frames. Fix: remove the fill, or make the very last
   2–3 frames a flat `PAL.paper` fill *without* the iris gradient.

## Verification loop (run after any fix)

```bash
npm run typecheck
npm test
# stills only (fast):
node --import tsx scripts/render-film.ts films/understudy/score.json --stills 21.0,22.2,29.5,29.9,29.99 --out-dir build/understudy/probe
# full re-render with master audio:
npm run render -- films/understudy/score.json --audio build/understudy/mix/master.wav --out films/understudy/understudy.mp4
npm run audit:frames -- films/understudy/understudy.mp4
npm run audit:palette -- films/understudy/understudy.mp4
npm run gate:7 -- films/understudy/score.json
```

## Environment notes (Windows)

- Shell is PowerShell; chain with `;` not `&&`.
- ffmpeg: `Y:\NewVideoTest\node_modules\ffmpeg-static\ffmpeg.exe`;
  ffprobe: `studio\node_modules\ffprobe-static\bin\win32\x64\ffprobe.exe`.
- A background render can silently die: verify no `node` process remains and
  re-run in the foreground if the MP4 timestamp is stale.
- Do not redeclare vendor globals: `vendor/core.js` owns `W`, `H`, `TAU`,
  `C.inv`; `characters.js` declares `boot` — keep those out of
  `backend.js`/`painter.js`. `initTextures()` must run before
  `paperOverlay`/`grainOverlay`.

## Roadmap after the two fixes

1. Re-render + re-run frame/palette audits + gate-7 until all pass.
2. Five critics (architect, senior dev, designer/DOP, motion, editor, sound,
   QA) review the new MP4; require 9/10.
3. Remaining non-mechanical checks where feasible: type-safe-area, rig-seam,
   ASR read-check, motion check.
4. Only then: the user's real film idea goes brief → score → board → animatic
   → assets → animation → final render. No app, no asset library, no
   watercolor until the first real film ships.
