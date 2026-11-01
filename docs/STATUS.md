# Paper Studio — status audit

**Date:** 2026-10-29
**Update 2026-10-31 (historical — the counts and the audio cut here are
superseded by the 2026-11-01 blocks below):** The core system is now real. The
contract layer, audio resolver, asset manifest, pose library, film score, derived
**board**, score-level **audit**, character/pose **sheet** and board **animatic**
all exist.
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
**237 tests passed on that date**, typecheck was clean, and `gate:7` passed 13
checks. The SFX
kit is built (`src/engine/sfx.ts`): six materials, layered shapes, one
`send`/`duckDb`/`band` table shared with the mix, and a cue that can bind its
time to its picture event; `npm run sfx` writes one WAV per cue, a stem mix and
`sfx.json`, and fails on a click, a banned kind or a cue outside its band
(`test/sfx.test.ts`). The score-level master measured **-14.3 LUFS / -1.5 dBTP**
then; **both the master and the delivered MP4 have been re-cut since** (see the
third-pass block below). The voice
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

**Update 2026-11-01 — the third sound pass, and the review-surface close.** The
second sound pass fixed real things; the sound critic still withheld the sign at
**7/10**, because two of the fixes described the wrong quantity and the QA critic
found the final gate described a master, not the film. Both reviews were right on
the substance. This pass measures everything it claims:

- **The duck is real.** The sidechain was the voice envelope normalised by the
  film's single loudest sample. Only 257 ms of a 29.5 s take reach that peak, so
  an 8 dB declaration arrived as **2.6 dB** at the hit it was written for, and at
  9.0 s the slam sat 2.3 dB *above* the word. The key is now a presence gate on a
  **local reference** (the voice's own presence within ±1 s), and the mix report
  names, per cue, the duck it applied, where, and how the cue sat against the
  word. Understudy: **16 cues meet speech, every one at its declared depth** (the
  slam gets its full 8 dB).
- **A cue's gain is its level again.** One resonant bandpass centred on
  `sqrt(lo·hi)` cost 1–3.4 dB at the loudest moment, so the score's `gain` stopped
  being the level the cue reached. The band is now a highpass and a lowpass at
  unity inside it, and the bus **re-levels** each cue to
  `20·log10(CUE_LOUD · gain)`: **0.00 dB drift** across all 30 cues.
- **Silence means silent, and it is measured on the master.** `silences` used to
  be satisfied by "no cue starts here", so 4 of 5 declared windows carried a
  voice or a reverb tail. A declared silence is now a claim about the master
  (peak ≤ −50 dBFS) and the audit refuses one with narration through it or a cue
  ringing into it. The fixture now declares **2** windows that are actually silent
  (0–0.5 s, 19.55–19.85 s), and each unscored picture event carries its own
  `quiet` reason instead.
- **The tail is a measured slope.** The last 0.5 s must be monotonic and end
  ≤ −60 dBFS; the master measures −48.4 → −180 dBFS.
- **The film's audio is finally the film's audio.** `npm run deliver` copies the
  video stream (no re-encode), encodes the master beside it, and measures the
  **delivered file's own** loudness and true peak. The AAC encoder overshoots
  (−1.9 dBTP master → −0.6 dBTP file at unity), and the first fix for that was a
  gain walk — which passed the peak check by turning the film down: 1.1 dB of gain
  took Understudy to −15.3 LUFS, outside −14 ± 1. The overshoot is a *peak*
  problem, so it now gets a peak solution: `alimiter` on the encode, tightened by
  the measured overshoot, touching only the loudest samples. `deliver.json` and
  the render manifest carry the measurement and the limit, and `gate:7` reads it
  as `deliveredAudio`. Understudy delivers **−14.4 LUFS / −1.9 dBTP**.
- **The gate can no longer pass on missing evidence.** The `master` row required
  a `limiterWindows` median defaulting to 1 ("passes"); the `palette` row had no
  video tie (its report was 26 minutes older than the MP4); `inputsHashed` never
  re-hashed the files; `scoreAudit` accepted an audit of a different score; the
  final contact sheet was labelled with the manifest's hash rather than the hash
  of the file it tiled. Now: no default, `videoHash` in every audit report,
  score + backend + painter re-hashed at gate time, `audit.json` naming the score
  it audited, and a sheet that hashes what it decodes. Clipping, which had no
  command at all, is counted in the palette decode over **every frame**.
- **The render owns the manifest.** `audit:frames` used to write
  `render-manifest.json` by hashing the files on disk *at audit time* — a perfect
  report of the wrong thing, because a painter edited after a render was then
  described beside a picture it never touched. `render:film` writes it now
  (`src/engine/manifest.ts`), `audit:frames` fails `describedByRender` when the
  video is not the picture the manifest names, and `deliver` refuses a source
  picture the manifest does not describe. Probed, not assumed: a false
  `videoHash` stopped `deliver`; a missing manifest failed `audit:frames`.
- **Picture and container are two hashes.** `videoHash` is sha256 over the video
  *stream*; the container hash is recorded beside it. A re-cut audio no longer
  invalidates a frame audit for a change not one of them measured, and the
  determinism row requires two renders with **identical bytes and the same
  picture** as the delivered film — not two copies of one file.
- **The page's score data is generated and regenerated.** The renderer paints
  from `films/<id>/score-data.js`, and Understudy's had gone stale: the score had
  gained five `quiet` reasons and the cue → event bindings, and the page still
  carried the older plan. No report saw it, because no report was about that
  file. `src/engine/score-data.ts` is now the one implementation, `npm run embed`
  writes it, and the `scoreData` gate row rebuilds it from the score and compares
  byte for byte. A manifest naming the old data failed `inputsHashed` and said
  which file had moved; re-rendered, both pass, picture hash unchanged. Probing
  the row itself: one line appended to `score-data.js` failed both rows, and
  `npm run embed` restored the same bytes and the PASS. That is the point: a
  stale data file is invisible in the pixels.

Evidence: `sfx` 30/30 ok, all −14 dBFS loud · `audit` 32 events / 27 scored / 5
bare / 30 cues / 2 silences / longest hole 1.07 s · `mix` **−14.1 LUFS / −1.9
dBTP**, gain +6.6 dB, limiter 6.8 dB at the peak, **median window 0.02 dB**
(33/293 over 3 dB) · `deliver` **−14.4 LUFS / −1.9 dBTP measured on the file** ·
`gate:7` **PASS, 20 checks · 1 manual (ASR)** · **269 tests**, typecheck clean.
Still open: no music, narration ending at 19.5 s (the brief's copy ends there), a
mono field, guessed word times, and ASR pending the local speech models. The
MP4's earlier audio cut is **closed**: the delivered MP4 now carries the measured
master.

**The counts above are the current ones; the blocks before this were written
against earlier builds.** Where an older block says "13 checks" or "237 tests",
it is describing the state on that date, not today's. The gate now has **19
checks** and the suite **269 tests**; the commands are the source of truth
(`npm run gate:7 -- films/understudy/score.json`, `npm test`).

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

**Verdict in one paragraph (as of 2026-11-01).** We have a strong **look** and a
**production pipeline proven end to end on one fixture**: a scored film
(`films/understudy/score.json`) becomes a derived board, an audited cue sheet,
generated SFX, a measured master, 900 code-drawn frames, a delivered MP4 whose
audio is measured on the file, and a gate that reads 20 checks — with two
byte-identical renders behind it. What we do not have is a **real film** (the
brief/idea is the user's, and `The Understudy` is a fixture), **music**, **ASR**
(the command exists; the local speech model is not installed), or the **app**
that a non-programmer would use in place of the commands. The gap is now
direction and audience surface, not the engine.

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
