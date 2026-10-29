# Gates

A gate is a command plus an artifact plus a pass condition. If it cannot be
checked, it is not a gate. **Current status is marked.** No gate may pass on a
warning.

| Gate | Artifact | Command | Pass condition | Critics | Status |
|---|---|---|---|---|---|
| G0 brief | `brief.json` | `npm run film -- <score>` | fields complete; style, aspect, duration, fps and audio mode match the score | architect, editor | ready |
| G1 audio | voice, `transcript.json`, `captions.srt`, cue list | `npm run captions -- <score>` | files exist and hash; transcript covers the script; SRT cues match; read-time holds | editor, sound, QA | ready |
| G2 direction + look | score, `build/<id>/board/`, hero frames | `npm run board -- <score>` | all shots inside the envelope; median in band; board covers every shot and marked beat; look table complete | designer, editor | ready |
| G3 animatic | board pass + stepped rough | pending builder | every cue on frame; no camera-only shot; no undeclared hold >0.4 s; ≥2 breakdowns per transition | motion, editor, QA | **pending** |
| G4 assets | `build/<id>/sheets/*.png` | `npm run sheet -- <score>` | seam gap 0; feet planted; contact shadow; 8 poses + 4 expressions; joint map; hand/foot/coat panels | designer, developer, QA | ready |
| G5 shots | animated shots, contact sheets | pending painter | entry/exit match; ≥3 events; no floating part; motion floor met | motion, editor | **pending** |
| G6 mix | master + SFX | pending `scripts/sfx.ts` | layers, space, ducking, −14 LUFS ±1, true peak ≤ −1 dBTP | sound, editor, QA | **pending** |
| G7 final | MP4 + SRT + score + stills + audit | `npm run audit -- <score>` | score-level checks pass; frame checks pending the painter; seven critics sign | all seven + director | **partial** |

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
