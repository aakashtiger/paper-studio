# Gates

A gate is a command plus an artifact plus a pass condition. If it cannot be
checked, it is not a gate. **Current status is marked.** No gate may pass on a
warning.

| Gate | Artifact | Command | Pass condition | Critics | Status |
|---|---|---|---|---|---|
| G0 brief | `brief.json` | `npm run film -- <score>` | fields complete; style, aspect, duration, fps and audio mode match the score | architect, editor | ready |
| G1 audio | voice, `transcript.json`, `captions.srt`, cue list | `npm run captions -- <score>` | files exist and hash; transcript covers the script; SRT cues match; read-time holds | editor, sound, QA | ready |
| G2 direction + look | score, `build/<id>/board/`, hero frames | `npm run board -- <score>` | all shots inside the envelope; median in band; board covers every shot and marked beat; look table complete | designer, editor | ready |
| G3 animatic | board pass + stepped rough | `npm run animatic -- <score>` | board pass signed 9/10; stepped rough requires the painter; every cue on frame; no camera-only shot; no undeclared hold >0.4 s; ≥2 breakdowns per transition | motion, editor, QA | **board pass signed; rough pending** |
| G4 assets | `build/<id>/sheets/*.png` | `npm run sheet -- <score>` | seam gap 0; feet planted; contact shadow; 8 poses + 4 expressions; joint map; hand/foot/coat panels | designer, developer, QA | ready |
| G5 shots | animated shots, contact sheets | pending painter | entry/exit match; ≥3 events; no floating part; motion floor met | motion, editor | **pending** |
| G6 mix | master + SFX | `npm run mix -- <score>` | 13 cues generated; voice highpassed at 75 Hz; the 1–4 kHz band ducked against the voice; one shared reverb return; tail faded; master −14.0 LUFS / ≤ −1.5 dBTP | sound, editor, QA | **master ready** |
| G7 final | MP4 + SRT + score + stills + `gate-7.json` | `npm run gate:7 -- <score>` | one frozen MP4 hash; score audit, frames, **paint-match**, one-hash, hashed inputs, determinism, mix and palette all pass; type-safe-area, rig-seam, ASR and motioncheck are still judged by hand | all seven + director | **partial** |

## Paint match

`npm run audit:paint -- <score> [--video <mp4>] [--step 1] [--min 30]` paints a
sample of times through the same path as the renderer's `--stills`, extracts the
MP4 frame at the same time and compares them with PSNR. A correct frame survives
H.264 at about 40 dB; a frame that does not match the painter lands near
10–20 dB. Luma and cut audits cannot see this class of defect — a video can be
well-formed and still contain frames the current code would never draw.

## Current audit

`npm run audit -- films/understudy/score.json` checks:

- every shot event, narration line, caption and SFX cue on the frame grid;
- caption count, read-time holds and SRT cue count;
- the score-level contracts (brief, audio, assets, poses, shots).

It does **not** yet check rendered frames, ASR, motion or mix. Those are G5–G7
and are listed as pending, not passed.

## Rule

A failed gate writes the failure and sends the film back one step. “Almost” is a
no. The director signs only after the full panel at G7.
