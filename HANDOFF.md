# Paper Studio — handoff (Oct 2026)

Paste this whole document into a new chat. It is self-contained.

## What this project is

Paper Studio: a deterministic, local-first video engine. First milestone is a
30-second animated wedding/K-pop-style film ("The Understudy") generated from an
authored `score.json`. Repo: `github.com/aakashtiger/paper-studio` (branch `main`).

Iron rules (do not violate):
1. **Determinism.** Same brief + seed = identical frames. **A frame is a function
   of its time alone** — no painter state may survive `clearRect`.
2. **The brief/score is the contract.** Every output traceable to it; never
   invent names, dates, copy.
3. **Style code stays in `styles/`; engine never hardcodes palettes or shots.**
4. Every feature ships with a command that proves it works.
5. No new dependency without a stated reason.

## The lesson that cost a day (read this first)

A still frame that looks right proves nothing about the video. The delivered MP4
was broken for 17.5–21.5 s while every sampled still was perfect, because the
bug was a function of **draw history**: `poseFor()` returned the live object
from `window.POSES` and `stage()` mutated it in place, so `sway` grew 3 px per
painted frame (15 px at 17 s → 237 px at 20 s). The character drifted into a
spin. See `docs/decisions/0014-paint-determinism.md`.

Two consequences, both now enforced:
- `test/painter-history.test.ts` — the library must stay byte-identical over
  630 frames, and 19 s must paint identically cold and after 600 frames.
- `npm run audit:paint` — paints sampled times, extracts the MP4 frame at the
  same time, compares with PSNR. Correct ≈ 36–42 dB, mismatched ≈ 19–21 dB.
  This is the only check that catches "the video is not what the painter draws".

## What is built and verified

- Contract layer: film brief, audio resolver, asset manifest, pose library, film
  score. `npm run plan|treatment|film|captions|board|audit|sheet|sfx|animatic`.
- Score-driven painters per shot + deterministic CDP renderer
  (`scripts/render-film.ts`: headless Chrome, `--disable-gpu`, canvas
  `toDataURL` per frame, verifies `drawnAt === requested`).
- Audits: `audit:frames` (900/900, 0 blank, 0 missed cuts, no hold > 0.4 s),
  `audit:palette` (worst outlier 0.40% vs 0.5% limit), `audit:paint`.
- Mix bus (`src/engine/mix.ts`, `docs/decisions/0013-mix-bus.md`): deterministic
  DSP, voice highpass 75 Hz, per-cue band/send/duck, shared reverb, two-pass
  loudnorm. Master `build/understudy/mix/master.wav` = −14.5 LUFS / −1.4 dBTP.
- SFX generator (`scripts/sfx.ts`): 13 code-generated cues incl. room tone.
- 165 tests pass; `npm run typecheck` clean.
- The s09 beige end-flash is fixed (hard paper fill removed from
  `pullback_close`); the film now closes on paper with one gold dot.

## Commands

```bash
npm run typecheck
npm test
# stills (fast, but remember: stills do not prove the video)
node --import tsx scripts/render-film.ts films/understudy/score.json --stills 19.0 --out-dir build/understudy/probe
# full render with the mixed master
npm run render:film -- films/understudy/score.json --audio build/understudy/mix/master.wav --out films/understudy/understudy.mp4 --keep-frames build/understudy/frames-a
# the delivery chain, in order
npm run audit:paint   -- films/understudy/score.json --video <mp4>
npm run audit:frames  -- films/understudy/score.json --video <mp4>
npm run audit:palette -- films/understudy/score.json --video <mp4>
npm run audit         -- films/understudy/score.json
npm run determinism   -- build/understudy/frames-a build/understudy/frames-b
npm run gate:7        -- films/understudy/score.json
```

## Environment notes (Windows)

- Shell is PowerShell; chain with `;` not `&&`.
- ffmpeg: `Y:\NewVideoTest\node_modules\ffmpeg-static\ffmpeg.exe`;
  ffprobe: `studio\node_modules\ffprobe-static\bin\win32\x64\ffprobe.exe`.
- A background render can silently die: check the log tail and the MP4
  timestamp, and re-run in the foreground if stale.
- Do not redeclare vendor globals: `vendor/core.js` owns `W`, `H`, `TAU`,
  `C.inv`; `characters.js` declares `boot` — keep those out of
  `backend.js`/`painter.js`. `initTextures()` must run before
  `paperOverlay`/`grainOverlay`.
- Render rate ≈ 1.0–1.2 fps, so a 30 s film takes 12–15 minutes.

## Still open

1. Determinism proof for the current build: two renders with `--keep-frames`,
   then `npm run determinism` (must be 0 mismatches).
2. Critic panel (architect, developer, designer/DOP, motion, editor, sound, QA):
   9/10 required, no warnings. Motion was the weakest score.
3. Four G7 checks are still judged by hand, not measured: type-safe-area,
   rig-seam, ASR read-check, motioncheck. Turning these into commands is the
   next quality investment; until then "9/10 every run" is a promise, not
   a gate.
4. Then, and only then: the user's real film idea goes brief → score → board →
   animatic → assets → animation → final render. No app, no asset library, no
   watercolor until the first real film ships.
