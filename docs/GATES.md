# Gates

A gate is a command plus an artifact plus a pass condition. If it cannot be
checked, it is not a gate. **Current status is marked.** No gate may pass on a
warning.

| Gate | Artifact | Command | Pass condition | Critics | Status |
|---|---|---|---|---|---|
| G0 brief | `brief.json` | `npm run film -- <score>` | fields complete; style, aspect, duration, fps and audio mode match the score | architect, editor | ready |
| G1 audio | voice, `transcript.json`, `captions.srt`, cue list | `npm run captions -- <score>` | files exist and hash; transcript covers the script; SRT cues match; read-time holds | editor, sound, QA | ready |
| G2 direction + look | score, `build/<id>/board/`, hero frames | `npm run board -- <score>` | all shots inside the envelope; median in band; board covers every shot and marked beat; look table complete | designer, editor | ready |
| G3 animatic | board pass + stepped rough | `npm run animatic -- <score>` + `npm run rough -- <score>` | board pass signed 9/10; stepped rough paints the score at 10 fps; every board time paired to its frame; every shot's median frame-to-frame change ≥ 0.6 and no hold >0.4 s; no camera-only shot; ≥2 breakdowns per transition | motion, editor, QA | **board pass signed; stepped rough measures pass** |
| G4 assets | `build/<id>/sheets/*.png` | `npm run sheet -- <score>` | seam gap 0; feet planted; contact shadow; 8 poses + 4 expressions; joint map; hand/foot/coat panels | designer, developer, QA | ready |
| G5 shots | animated shots, contact sheets | `npm run render:film -- <score>` + `npm run audit:motion -- <score>` | entry/exit match; ≥3 events; no floating part; every shot's median frame-to-frame change ≥ 0.6 and no dead stretch > 0.1 s | motion, editor | **measured** |
| G6 mix | master + SFX | `npm run mix -- <score>` | 13 cues generated; voice highpassed at 75 Hz; the 1–4 kHz band ducked against the voice; one shared reverb return; tail faded; master −14.0 LUFS / ≤ −1.5 dBTP | sound, editor, QA | **master ready** |
| G7 final | MP4 + SRT + score + stills + `gate-7.json` | `npm run gate:7 -- <score>` | one frozen MP4 hash; score audit, frames, paint-match, motion floor, type safe area, rig seam, one-hash, hashed inputs, determinism, mix and palette all pass; only ASR is still judged by hand | all seven + director | **partial** |

## Paint match

`npm run audit:paint -- <score> [--video <mp4>] [--step 1] [--min 30]` paints a
sample of times through the same path as the renderer's `--stills`, extracts the
MP4 frame at the same time and compares them with PSNR. A correct frame survives
H.264 at about 40 dB; a frame that does not match the painter lands near
10–20 dB. Luma and cut audits cannot see this class of defect — a video can be
well-formed and still contain frames the current code would never draw.

## Motion floor

`npm run audit:motion -- <score> [--video <mp4>] [--floor 0.6]` measures the mean
absolute difference between consecutive frames inside each shot with
`tblend=all_mode=difference`. A slideshow shot sits near 0.2; an acted shot sits
well above the floor. It reports a median and the longest dead stretch per shot
and writes `motion-audit.json`, tied to the video hash it measured. This is the
number behind "no dead middles".

## Stepped rough

`npm run rough -- <score> [--fps 10] [--floor 0.6]` is G3's second pass, after the
board pass. It paints the score through the same painter as the final render
(three-frame holds at 10 fps), then pairs every board time with its rough frame, so
a card and its acted frame sit side by side on one contact sheet
(`build/<id>/rough/contact-sheet.png`). It burns the captions from the score, muxes
the mix, and measures each shot's frame-to-frame change the same way
`audit:motion` does. `build/<id>/rough/rough.json` fails if any board time is
unpaired, any shot's median change is below the floor, any hold runs past 0.4 s, or
a shot carries no event except a camera move. This is a board pass with the cast on
screen; the look pass is still to come.

## Type safe area

`npm run audit:type -- <score> [--step 0.5] [--margin 0.06]` paints sampled times
through the renderer with `src/engine/paint-probe.js` attached. The probe records
the box of every text run a frame draws, mapped through the canvas transform, so
a label on a rotated sticker is measured as the rectangle it covers. The safe
margin is read from the style pack (`tokens.json` `layout.safeZones`, e.g.
`title-safe 6 percent`), so a film inherits it and never hardcodes a number. A
box more than 1 px outside the safe rectangle fails `type-audit.json`.

## Rig seam

`npm run audit:rig -- <score> [--step 0.5]` wraps `solveLeg`, `limb` and
`drawCharacter` so every painted frame reports its leg solves and the two limb
segments each solve drew. It checks, per leg:

1. the drawn thigh and shin are the lengths the solver used;
2. the knee is a seamless joint;
3. the drawn ankle lands on the pose's foot target (within 3 px);
4. the knee bends and bends the way its side owns (a sign flip is a backwards
   knee), between 0.03 and 2.6 rad;
5. no ankle teleports between adjacent samples.

`test/cast-rig.test.ts` proves the same reachability statically, in a second,
without a browser, so bad pose data fails before a render.

## Current audit

`npm run audit -- films/understudy/score.json` checks:

- every shot event, narration line, caption and SFX cue on the frame grid;
- caption count, read-time holds and SRT cue count;
- the score-level contracts (brief, audio, assets, poses, shots).

It does **not** check rendered frames, ASR or mix. Those are G5–G7. The
mechanical parts of G7 that are not score-level are their own commands:
`audit:motion` (motion floor), `audit:type` (safe area) and `audit:rig` (rig
seam); ASR is still pending.

The render manifest hashes the score, the generated score data, the style
backend (`styles/<style>/canvas/recipes.js`), the film page, the captions, the
vendor scripts and **each cast pose library**. A pose edit is a film change, so
it invalidates the manifest the same way a code edit does; `gate-7.json` checks
the pose hashes with the `poseHashes` row.

## Rule

A failed gate writes the failure and sends the film back one step. “Almost” is a
no. The director signs only after the full panel at G7.

ASR is the one G7 item with no command yet. It is deferred to the voice pipeline
(the fixture voice is scratch), not skipped; see
`docs/decisions/0016-voice-and-asr.md`.
