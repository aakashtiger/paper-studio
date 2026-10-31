# Paper Studio — status audit

**Date:** 2026-10-29
**Update 2026-10-31:** The core system is now real. The contract layer, audio
resolver, asset manifest, pose library, film score, derived **board**,
score-level **audit**, character/pose **sheet** and board **animatic** all exist.
The paper rig has two-bone leg IK with ankle targets, foot pitch and a
knee-driven bounce; every foot target is reachable, so a planted foot bends its
knee and lands on its shadow. The film renderer paints from the score and the
painter now lives in the style pack (`styles/paper-kpop/canvas/recipes.js`,
decision 0015). Four mechanical G7 audits are built — `audit:motion`,
`audit:type`, `audit:rig`, plus `audit:paint` — and `gate:7` ties the score
audit, frames, one-hash, paint-match, motion floor, type safe area, rig seam,
hashed inputs, determinism, mix, palette and the one-image final contact sheet to
a single frozen MP4. The review surface is one look per artifact: a board sheet,
a derived style sheet, a stills sheet, the storyboard (one frame per shot), a
per-shot strips sheet from the delivered MP4, and a spectrogram sheet per cue.
**237 tests pass**, typecheck is clean, and `gate:7` passes 13 checks. The SFX
kit is built (`src/engine/sfx.ts`): six materials, layered shapes, one
`send`/`duckDb`/`band` table shared with the mix, and a cue that can bind its
time to its picture event; `npm run sfx` writes one WAV per cue, a stem mix and
`sfx.json`, and fails on a click, a banned kind or a cue outside its band
(`test/sfx.test.ts`). The score-level master measures **-14.3 LUFS / -1.5 dBTP**;
the delivered MP4 still carries the earlier audio cut, and the final master
re-cut belongs to the look pass. The voice
pipeline is built (`npm run voice`, `npm run asr`): capture is a recording or
Kokoro TTS, word times come from local Whisper re-attached to the script's
spelling (`src/engine/words.ts`), the clock is derived and the shot boundaries a
snap would move are proposed; ASR of the master is a **hard** G7 check once its
report exists, and is **named as pending, with the command**, until the local
speech models are installed (one-time ~1 GB — see `tools/README.md`, decisions
0016, 0017). The
**stepped rough** is built (`npm run rough`): the score painted at 10 fps through
the same painter, every board time paired to its frame on one contact sheet, every
shot measured for motion — all nine shots pass the 0.6 floor with no hold over
0.4 s. The fixture film *The Understudy* is the test artifact; the user's own film
is next, after the look pass. See `docs/PRODUCTION-PLAN.md` v1.4 and
`docs/decisions/0014`–`0016`.

**Update 2026-11-01 — the critic-fix pass on steps 10/10e.** Two critics
(architect 6/10, developer 7.5/10) withheld a sign and named blockers; the other
five hit a usage limit before they could answer, so this pass is the two returned
reviews plus my own, recorded honestly as such. Fixed: an unknown SFX kind is a
contract error instead of a silent paper thud; a cue derived from a picture event
is snapped to the frame grid (`toFixed(3)` cannot express 1/30 s); the `sfx` clock
mode no longer carries a second cue list; `sfx.json` records a spec fingerprint
and WAV hash per cue, `npm run mix` recomputes both and refuses a stale take, and
`gate:7` ties the mix report's `inputs` to the current score, cue set and master;
review chrome is one neutral `REVIEW_CHROME` and every sheet takes its faces from
the pack's `tokens.json` (`packFontPath`), never from `proofs/`; `film:review`
summarises a step only from a report this run wrote, so a failure can no longer
print last week's "ok"; `audit.json` counts `events` and `cues` apart. Evidence:
`sfx` 13/13 ok, `audit` 32 events / 13 cues, `mix` **-14.3 LUFS / -1.5 dBTP** with
tied inputs, `gate:7` **PASS 13 checks / 1 pending (ASR)**, `film:review --gate`
**PASS**, **242 tests**, typecheck clean. Two probes proved the failure paths: a
cue moved to 1.01 s made `audit`/`sfx` fail on the real error, and a gain changed
after the render made `npm run mix` stop with "changed after it was rendered".
Still open: the delivered MP4 carries the earlier audio cut (the re-cut is the
look pass), and `npm run asr` waits on the local speech models.

**Update 2026-11-01 — the sound pass.** The sound critic then scored the film
**6/10, no sign**, with ten defects. Every engine fault it named is fixed: the
master tail fade was inverted (`0.5 − 0.5cos` muted the start of the fade and
swelled the last breath — a 42 dB hole at 29.5 s); cues were peak-normalised, so
the film's softest cue was its loudest, and every cue is now normalised to one
RMS (`CUE_RMS = 0.12`) with `gain` as the only level; the materials rang at
85–190 Hz where a phone speaker cannot move, and every mode is now above ~180 Hz
with a `≥60% at or above 200 Hz` check behind it; three `crowd` cues in eight
seconds read as a stutter, and `checkCueSet` now fails a repeat within 0.3 s of
the previous one ending; the fixture's cue sheet was re-bound to picture events
(17 cues), so its foley lands on the gesture it belongs to instead of 1.8 s
beside it; and the master is no longer a normaliser — it is **one measured gain
and a true-peak limiter**, both recorded (gain +6.3 dB, ceiling −2.0 dBFS). The
spectrogram tiles now carry each cue's measured dBFS, because a spectrogram
normalises its own colour scale. Evidence: `sfx` **17/17 ok**, `audit` 32 events
/ 17 cues, `mix` **−14.2 LUFS / −1.9 dBTP** with tied inputs, `gate:7` **PASS 13
checks / 1 pending (ASR)**, `film:review --gate` **PASS**, **246 tests**,
typecheck clean. Not fixed, and named: the MP4's earlier audio cut (look pass),
no music and narration that stops at 19.5 s (the brief's copy ends there; music
is staged), a mono field (the fixture's events carry no screen position), and
transcript word times that still say `source: "guess"` until Whisper is installed.

**Update 2026-11-01 — the second sound pass.** The first pass fixed what the
critic named; a second pass read the artifacts with meters and found several
fixes were true statements about the wrong quantity. The cue level rule moved
from whole-cue RMS to the **loudest 50 ms** (`CUE_LOUD = 0.2`, −14 dBFS) under a
soft knee: RMS normalisation made a decaying hit measure quiet, drove its peak
into the limiter and cost up to 11 dB, so `gain` stopped being the only level.
`checkCue` fails a cue more than 2 dB under the kit's level; `checkCueSet`
compares **all pairs** of a kind, not adjacent rows. Silences became contract
surface (`audio.sfx.silences` with a `why`, validated and read by the audit):
an unscored event, a cue in a silence, a hole over 2.5 s, a cue inside the tail
fade or an unducked cue under narration is an error. The generator stopped
clicking (a `rise()` attack per layer, transients scaled to their body). The
master's reported reduction was an artefact of `volumedetect` clamping to 16-bit;
both peaks now come from `ebur128=peak=true`, and the report carries the same
reduction as a **100 ms window distribution** so one sample cannot be read as the
whole film. The bus gained a `PREMASTER_CEILING` (−1 dBFS) headroom stage, and
`gate:7` gained a `master` row that reads gain, reduction, window median and
`converged` against the mix contract's bounds. A narration leveller was built,
measured and **reverted**: at 2:1 over −18 dBFS the premaster fell from −18.3 to
−21.4 LUFS, and at 3:1 over −24 dBFS the limiter's reduction rose from 7.0 to
8.9 dB, because peak-restoring makeup cannot beat crest physics. Evidence: `sfx`
**30/30 ok, all −14 dBFS loud**, `audit` 32 events / 27 scored / 5 bare / 30 cues
/ 5 silences / longest hole 1.07 s, `mix` **−14.1 LUFS / −1.7 dBTP**, gain
+7.5 dB, limiter 7.5 dB at the peak but a **median window of 0.03 dB** (47/293
over 3 dB), `gate:7` **PASS 14 checks / 1 manual (ASR)**, `film:review --gate`
**PASS**, **254 tests**, typecheck clean. Still open: the MP4's earlier audio cut
(look pass), no music, narration ending at 19.5 s, a mono field, guessed word
times, and ASR pending.

**Update:** `docs/PRODUCTION-PLAN.md` v1.4 is accepted. The contract layer and
the first generators exist: film brief, audio resolver (recorded/TTS narration,
library/generated music, generated SFX), asset manifest, pose library, film
score, derived **board**, score-level **audit** and the **character/pose sheet**
generator. **158 tests pass.** The sheet has a signed **9/10 design** review.
The paper rig now has two-bone leg IK, ankle targets, foot pitch and a hip-based
bounce; the pose set is still **7/10 motion** pending a better weight shift. The
board animatic is **9/10 signed** (editor + QA) with voice, burned captions and
13 generated SFX cues; it is a board pass, not a stepped rough. The seven
critics are in `critics/`, the gate checklist in `docs/GATES.md`. Next:
stepped rough/painter, look pass, final mix. No film render before those.

**Update (decision 0017):** the review surface is being closed. One grid helper
(`src/engine/grid.ts`) and a board sheet land first, then a derived style sheet,
a stills sheet, the storyboard as exactly one frame per shot, and the three gate
sheets G5–G7 already required but had no command for. `film:new` (scaffolds,
never invents) and `film:review` become the front door. The voice pipeline is
known tooling — Kokoro (TTS) or a recorded file, word timings from local Whisper
re-attached to the script's spelling, and ASR of the mixed master as the G7 gate
— so step 10 unblocks without waiting for a human read. The SFX generator is
upgraded to a real kit (layers, modal resonators, friction, synthetic IR reverb,
ambience) with each cue bound to its picture event, still generated in code;
music (ACE-Step) stays staged. Banned: generative images or video in the render
path. Allowed: local models for voice, word timing and music.

**Purpose:** an honest inventory of what exists, what is weak, and what is
missing, with a deliberately small build plan. No new architecture unless it
removes a real blocker.

## Verdict in one paragraph

We have a strong **look** and a working **single-film proof**: the Paper K-pop
style, a 15-second 1080p film, a preview timeline, a deterministic renderer, a
repaired character rig, a treatment validator, 122 tests and green CI. We do not
have the **production system** that turns a script into a scored film, builds
per-film assets, renders from that score, and audits every frame. The gap is
process, not paint.

## 1. What we have

| Area | What exists | Evidence |
|---|---|---|
| **Paper K-pop style** | Pack 0.1.0: palette, type, 8 recipes, 2 formats, card, fonts, references, 6 crops | `styles/paper-kpop/`; hash `sha256:6c5765be…`; gate 9/9 |
| **Watercolor style** | Pack 0.2.0: card/process revision, 2 formats, exact manifests, 1 blind | `styles/watercolor-0.2.0/`; hash `sha256:196fd315…`; gate 9/9 |
| **S1 gates** | Sealed evidence for paper and watercolor, blind runs, critics | `gate/paper-kpop-blind/`, `gate/watercolor-0.2.0/` |
| **Paper proof** | 15 s, 1920×1080, 30 fps, 450 frames, three shots 4/5/6 s, silent | `proofs/s2-paper/paper-proof.mp4` |
| **Preview timeline** | HyperFrames Studio: play, scrub, shot timing | `npx hyperframes preview proofs/s2-paper` |
| **Determinism** | Two snapshot runs hash-identical on all sampled frames; seeded grain | `proofs/s2-paper/snapshots/` |
| **Character rig** | Joint chain repaired; hands, elbows, knees, boots connected; far arm follows torso | `proofs/s2-paper/vendor/characters.js` |
| **Rig contract** | Pure geometry + tests that would catch the mirrored-joint bug | `src/engine/rig.ts`, `test/rig.test.ts` |
| **Treatment contract** | Shot recipes, durations, slots, camera, motion notes, transitions; validator + CLI | `src/engine/treatment.ts`, `scripts/treatment.ts`, `proofs/s2-paper/plan.json` |
| **Research** | All 59 Lemo styles read; K-pop and watercolor autopsies; scored-film model | `docs/research/lemo-59-survey.md`, `docs/decisions/0012…` |
| **Tests / CI** | 122 tests, typecheck, GitHub Actions green | `npm test`, `npm run typecheck`; run `40738741602` |
| **Review record** | Architect, motion, design/DOP, QA on the proof; known defects written down | `proofs/s2-paper/reviews/` |

## 2. What needs improvement

These exist but are not yet good enough to sell.

| Area | Current state | Gap | Improvement |
|---|---|---|---|
| **Proof look** | Design 7/10 | Stage reads flat; some palette drift; contact shadows are weak | Stage depth pass: shadows, four roles, set layers |
| **Proof motion** | 5.5/10 | Shot 2 has a dead middle; dance is pose swaps; formation shift is small | Choreograph 8 counts with anticipation/overshoot; one continuous action in shot 2 |
| **Rig in the source** | Fixed only in the proof copy | `Y:\NewVideoTest\src\characters.js` still has the mirrored joint and far-arm defect | Port the rig fix; make the source consume `src/engine/rig.ts` |
| **Plan-driven render** | `plan.json` validates but `scenes.js` ignores it | The renderer is still hand-authored | Make the renderer read the score; delete hardcoded shot ids |
| **Treatment coverage** | Shots, slots, camera, motion, transitions | No events, clock, audio or asset manifest | Extend to `film.score.json`; keep one contract, not two |
| **Style duration** | Recipe min/max only; proof uses a 6 s stage over a 5.5 s recipe max | No min/median/max envelope or clock modes | Add `durationEnvelope` and `clockModes` to each style |
| **Asset flow** | Proof vendor copies; no manifest | No per-film cast/sets/props stage; no library promotion | Add project asset manifest + character/prop sheets |
| **QA depth** | Stills, manual checks, 122 unit tests | No every-frame audit, cue check, read check or golden frames | Add `film-audit`; run it in CI |
| **Critic process** | Six roles agreed in writing | Not implemented as gates with pass/fail | Gate A–D checklists tied to artifacts |
| **Docs hygiene** | Some handover headers are stale | Confusing for the next agent | Refresh the header and current-phase block |
| **Proof legality** | 6 s stage is a `proof: true` warning | A real film would fail | Either 5.5 s stage or a style envelope change, decided once |

## 3. What we do not have

These are missing, not weak.

| Missing | Why it matters | Build now? |
|---|---|---|
| **`film.score.json`** | The film is a timed score: shots, events, voice, SFX, captions; the renderer must read it | **Yes — first** |
| **Per-film asset stage** | Cast, poses, sets, props are made per film; the library grows by promotion | **Yes — second** |
| **Pose / expression library** | The proof has 16 hand-written poses; no named, reusable set | **Yes — second** |
| **Engine / backend boundary** | One engine, paper and watercolor backends; no copies of primitives | **Yes — third** |
| **Renderer that reads the score** | Today `scenes.js` hardcodes `open/sticker/stage` | **Yes — third** |
| **`film-audit`** | Every-frame rig, clipping, blank, palette, type, cue, determinism | **Yes — fourth** |
| **Audio** | No music, narration, SFX or mix; the proof is silent | Later (schema now) |
| **SFX generated in code** | You want this; it needs a cue list first | Later |
| **Watercolor video backend** | Only the pack and card exist | After the paper score render |
| **45 s film / 9:16 re-stage** | No full film, no vertical output | After the S2 gate |
| **Delivery + library** | No approved asset library, no delivery package | After the first scored film |
| **CI render / golden frames** | CI runs unit tests only | With `film-audit` |

## 4. Status at a glance

| Layer | Status |
|---|---|
| Style / look | ✅ strong |
| Single proof | 🟡 watchable, not 9/10 |
| Rig | 🟡 fixed in proof, not in source |
| Contracts | 🟡 treatment only, not a score |
| Assets | ❌ per-film flow and library |
| Engine | ❌ boundary, plan-driven render |
| Audio | ❌ silent |
| QA | 🟡 tests and stills, no every-frame audit |
| Delivery | ❌ no full film, no 9:16, no package |

## 5. The simple build order

### Must do next — the S2 gate

1. **Score schema + validator.** Extend the treatment; do not create a second
   system. Add clock modes (`music`, `narration`, `sfx`, `realtime`, `reading`,
   `free`), events, shots, assets, audio plan.
2. **Project asset manifest + character sheet.** Nova and Mira: named poses,
   expressions, wardrobe, props; create-or-reuse; approve the sheet.
3. **Renderer reads the score.** Replace `scenes.js` hardcoding with a painter
   that dispatches by shot and backend. Keep the paper primitives.
4. **`film-audit` + CI.** Cue alignment, rig seams, blank/clipped frames,
   palette, read time, determinism.

Then: **re-cut the 15 s proof through the score with a non-music clock**
(narration or SFX-only). This proves the system is not a music-video one-trick.

### Should do

- Watercolor backend on the same engine.
- Pose library promoted to the library after the film.
- Style `durationEnvelope` + `clockModes`.
- Golden-frame check in CI.

### Later

- 45 s film, 9:16 re-stage, delivery package.
- Music/narration mix and code-generated SFX.
- More styles.

### Never (to avoid over-engineering)

- A timeline editor or app.
- A plugin system or node graph.
- All 59 styles as products.
- A generic 3D engine.
- Hand-authoring every frame.
- Two parallel engines.
- A DAW.

## 6. What not to touch

- The Paper K-pop look and the style pack hashes.
- HyperFrames as preview/render host.
- Canvas2D as the paper backend.
- Determinism and seeded randomness.
- The 122-test suite and green CI.
- The six-critic roster and the four gates.

## 7. Definition of done for the next milestone

A 15-second film that:

- has **5 variable shots** inside the Paper K-pop envelope, not a fixed count;
- runs on a **narration or SFX clock**, not music;
- has a **per-film asset manifest** and approved Nova/Mira character sheets;
- is **rendered from the score**, with no hardcoded shot ids;
- passes **`film-audit`**: cues on frame, no rig seam, no blank/clipped frame,
  palette and type checks, deterministic hash;
- is signed by the **seven critics** and the director;
- ships with the score, audit report and stills.

That is the S2 gate. The 45 s film comes after it, not before.
