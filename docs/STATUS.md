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

Evidence (this build, one `npm run film:chain -- films/understudy/score.json`):
`sfx` 28/28 ok, every cue at its own level · `audit` **36 events / 27 scored / 9
bare** (each bare one carries its own `quiet` reason) / **28 cues** / 1 declared
silence / 9 shots / 900 frames / 6 captions · `mix` **−14.1 LUFS / −1.9 dBTP**,
gain +9.1 dB, every declared duck reached at the depth it declared, cue level
drift **0.00 dB**, no undeclared hole, no room bed under a line · `deliver`
**−14.2 LUFS / −2.0 dBTP measured on the delivered file**, one encode pass, the
picture stream unchanged · `asr` **93.1 %** of the script (27/29; "cue" is heard
as "Q") · `gate:7` **PASS, 21 checks, nothing manual** · `film:review --gate`
**PASS** · **272 tests**, typecheck clean. The determinism comparands are
`build/understudy/deliverable.mp4` and `build/understudy/det-e.mp4`: identical
bytes, same picture as the delivered film.
The numbers above were re-measured by that run; where they drift, the run is the
source of truth (`build/understudy/deliver.json`, `build/understudy/gate-7.json`).
Still open: no music, narration ending at 19.5 s (the brief's copy ends there), a
mono field, and a `crowd` bed that has to be declared 10 dB under a line before it
can be heard over one. The MP4's earlier audio cut is **closed**: the delivered
MP4 carries the measured master, not an earlier one.
One quality gap is named rather than fixed: `audit:motion` measures frame
difference per shot, so a pose change that moves one limb is legal and quiet —
there is no per-character centre-of-mass metric yet. The type audit samples
rather than reading every frame (151 of 900 here), so a sub-sample overflow could
still hide; the copy floor it enforces applies to the film's own words only.

**The counts above are the current ones; the blocks before this were written
against earlier builds.** Where an older block says "13 checks" or "237 tests",
it is describing the state on that date, not today's. The gate now has **21
checks** — the ASR row is present rather than pending — and the suite **272
tests**; the commands are the source of truth
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

**Update 2026-11-01 — the hair bug: a defect found by looking at delivered frames.**
Inspecting the delivered MP4 at 26.00 s showed a **vertical black slab** standing
behind Nova's head. It was not a stray prop or a camera artifact: it was her
**long hair**, drawn at the rig root instead of under the head, so it never
inherited the torso's lean. Standing still the two coincided; on the film's
closing bow the face swung ~95 units sideways and left the hair behind, which
reads as a **detached head** for about two seconds of the last shot.

What is worth recording is why every existing check passed. `audit:frames` saw no
blank frame and no long hold; `audit:paint` saw a 37 dB match; `audit:palette`
saw no clipping; `audit:type` saw the copy inside the safe area; `audit:rig`
checked the legs, and the legs were perfect. **Every check asked whether something
was wrong where it looked. None asked whether a part was where it hangs.** The
character sheet did not catch it either, because the sheet was reviewed from a
distance at which a lean looks like a lean.

The fix moves the hair under the head, inside the lean transform, and keeps its
draw order (hair behind the torso). The new evidence is mechanical:

- `audit:rig` now wraps a new `rigAnchor` helper. Each rig publishes the chest,
  the head pivot and the hair, and the audit holds each of them to a **fixed
  place in the space of the part it hangs from** (1.5 rig units) across every
  sampled frame — a part in the wrong transform drifts, a part in the right one
  cannot. Understudy: **435 anchor samples, 0.00 units worst shift, pass.**
  *(0024: the row measured everything against the chest until the first real film
  turned a head at 6–8° per 0.1 s, which put the hair's arc over the tolerance and
  produced 18 findings on a correct rig. The probe read the hair at
  `(0.00, −518.00)` in head space in every frame of the beat.)*
- `npm run audit:rig:proof` proves the row catches the defect rather than
  describing it: it puts the hair back at the rig root, and on that placement the
  hair moves **96.9 units in one 0.1 s step** at 25.0 s against a 1.5 limit, while
  the fixed rig reads **0.0**. It restores the rig byte-identically in a
  `finally`.
- The pose edit that was made while hunting this (`mira`'s `bow.headTilt: 0.2 → 0`)
  was an experiment that proved head tilt was *not* the cause; it is reverted to
  the authored `0.2`.

`docs/GATES.md` has the row and the numbers, `docs/decisions/0011` has the
invariant ("a part that hangs from a part inherits every transform between it and
the root"), and `gate:7` now refuses a rig report with no anchors or no adjacent
pairs — an empty anchor set is not a pass, it is a check that proved nothing.

**Update 2026-11-01 — the voice ignored its own clock.** The score places six
lines at 0.5 / 5.1 / 8.9 / 12.0 / 15.4 / 18.5 s; the captions name those seconds;
the cut puts line 4 over `s04`, which starts at 12.0 s. The capture **butted the
reads end to end**, so the WAV was 14.41 s long and line 4 was spoken at 8.2 s.
The narration lived in different seconds than the film that contained it, by up to
3.8 s, and no audit could see it: the mix proves the voice is present and ducks
correctly, and the ASR proves the words are the script's — both true of a voice in
the wrong place.

The fix is placement, not a patch: `VoiceLine` carries `start`, the bridge pads
silence to that second and **refuses** a read that would overrun the next line.
`npm run voice` then checks the clock **on the audio** — the first sample above
−40 dBFS within ±0.25 s of each authored start, tolerance **0.1 s** — because
Whisper's onsets wobbled 0.32 s early on a read that measures 0.53 s. Understudy:
lines at 0.50/5.10/8.90/12.00/15.40/18.50, measured 0.53/5.13/8.93/12.03/15.43/
18.53, **worst +0.03 s, clock kept**; 28/29 words timed.

The same pass found the master's bound written twice — 8 dB in `scripts/mix.ts`
and 8 dB restated in `scripts/gate-7.ts`. The correctly-placed narration dropped
the premaster to −22.0 LUFS and needed **+9.1 dB**: the mix accepted it, the gate
would have refused it, and the mix's loudness condition could fail while printing
nothing at all. The bounds now live once, in `src/engine/loudness.ts`
(`MASTER_MAX_GAIN` **12**, `LIMITER_MAX_REDUCTION` **8**), both files import them,
and every failing condition prints its own sentence. Master: **−14.1 LUFS /
−1.9 dBTP**. Decision `0019` has the numbers.

**Update 2026-11-01 — a pack cannot grow without re-cutting its own film.**
*Same Alarm* is the first film with a **world**: a bedroom before dawn, a
corridor, a desk under a fluorescent bar, a window at dusk, a card. The painter
lives in the pack (decision 0015), so the world was painted there — eight office
recipes in `styles/paper-kpop/recipes/`. Adding them silently re-cut the pack's
own accepted films: `paper-kpop-song` picks a recipe **by beat role**, so
`alarm_close` took the `open` beat because `a` sorts before `p`, and the sealed
blind resolved with the alarm twice at the front. Every audit stayed green,
because every audit was about the pack as it is and none was about the pack as it
was accepted.

Three fixes, one decision (`docs/decisions/0020`):

- **A format names the recipes it uses** (`format.recipes`). `paper-kpop-song`
  and `paper-kpop-shorts` now name their eight, so a recipe added to a pack can
  never re-cut a sealed plan. Proven, not asserted: both formats resolve against
  the live 0.2.0 pack to exactly the sealed 0.1.0 shot lists, recipe for recipe.
- **`optionalSlots` is part of the slot contract.** The validator read
  `recipe.slots` only, so `loop_card` — which declares `content.caption` optional,
  as `plan.ts` and `treatment.ts` both honour — was refused as DRAFT. One rule,
  one reading.
- **The hour tab is a zone the label is set inside.** Eight recipes declared the
  tab as a one-line box; the geometry proof feeds every recipe the pack's widest
  caption ("I hear the crowd through the wall"), which needs three lines at the
  14 px floor. The tab now wraps (16 → 14 phone-scale px, never below), is
  clipped to its declared box (`x 0.062, y 0.078, w 0.34, h 0.27`), and an hour
  still sets on one line exactly as before.

`BEAT_ROLES` is unchanged on purpose: it is hashed into every pack's
`contractHash`, so widening it would have re-validated every sealed pack in the
repository (the watercolor gates went DRAFT when it was tried, which is how the
blast radius was found). The tie-break costs nothing outside a format.

Evidence: **276 tests, 276 pass**, typecheck clean, `paper-kpop-gate` 9/9 against
the sealed 0.1.0 pack, `paper-kpop-0.2.0-gate` 4/4 against the live pack,
`style:check` REVIEWABLE with one open taste choice, `audit:type` 150 boxes /
150 copy / pass. 0.2.0 is **not sealed** and has **no fresh blind**: the pack is
still moving under the film, and its evidence is the film's gate.

**The staging pass (same day, after judging full-size frames).** The desk shots
were not wrong in the recipe list; they were wrong in depth. The supervisor was
drawn *after* the desk at `1.32` while the man behind it was `1.5` — a figure in
front of the furniture, a hundred pixels below the floor, with the stack behind
his coat; he now stands where his colleague sits, behind the same desk, at the
same scale. A seated figure's hands sat **10 px above the desk over nothing**, so
`OFFICE.seated` is now measured from the rig rather than nudged
(`772 + 279 × 1.5 = 1191`), and `officeSheet()` puts the form he is filling in
flat on the surface — the first version carried a lift shadow and read as an
envelope pasted on the desk front. `deskWide`/`windowDusk` monitors moved off the
actor and the chair back was narrowed from `1.95` to `1.45`. The rule is in
`docs/decisions/0020` §6: **a recipe may stage depth with position and scale, but
two characters in one shot stand on one floor at one scale.**

Two instruments came out of it. `render:film --from <s> --to <s>` renders a
window of frames and writes **no** manifest, so a 3.5-minute slice can be
judged before a 30-minute render is paid for; `build/slice-motion.mjs` measures
that slice with `audit:motion`'s own metric and reproduced the audit (0.533 on
the slice, 0.555 on the full shot). s06 was fixed with them: its camera pull-back
was widened to `1.12 → 1.0` **and** the shot got a real acting beat — a 0.1 s
slump, `wake` at 4.7 s, `look` at 5.6 s with no breakdown, so the body starts
before it turns and the head lift takes most of a second. Slice median
**0.677** against a floor of **0.6**, where it had been 0.533.

**Then the chain stopped at `audit:rig`, and it was right to.** 209 findings on
a delivered cut: 111 knees locked at 0.005 rad, 78 ankles 3–10 px short of their
targets, 20 seam shifts. One cause, arithmetic: the office rig drew the hip
**272** above the floor on a `156 + 117 = 273` leg — straight by construction in
every pose — the supervisor's hip floated 14 units above the same legs so no pose
of his could reach the floor at all, and the walking recipes *raise* the hip by up
to 10 more (`−2` pose bounce, `−2.2` breathing, `6` step bob). A target past the
leg is not drawn longer: the solver clamps, the knee locks, the foot hangs above
its shadow. That is `docs/decisions/0022`; `HIP` is now `−258` for both men, the
supervisor is taller in the torso, and `test/cast-rig.test.ts` reads the bob
allowance out of the painter so a faster walk fails a test instead of a film.
The 20 seam shifts are all at a declared cut or pose key (worst 24.96 units at
28.50 s, the s05→s06 cut); the audit now attributes those and reports how many
it attributed, so a legal cut is not a rig defect while a dropped transform
still is. **`audit:rig` passes: 209 findings → 0, worst undeclared shift 0.00.**

**The chair is an asset now, not a number at four call sites (`0021`).** It was
`192` wide at `1.45` — **278 px** behind a man whose shoulders are **108** — and
nothing tied it to him, which is why it stayed where the old floor was when
`OFFICE.seated` moved. `PROPS` declares one footprint and one anchor per prop,
`placeProp()` throws on an unknown id, and `officeSeated()` places chair and man
as one unit from the rig's own hip height. `test/paper-kpop-0.2.0-gate.test.ts`
holds the footprint to the shoulders (mutation-checked: `w: 192` fails). The same
pass gave a dark garment a light rim (a black coat outlined in black has no
contour), a cuff and a visible hand to the pointing arm, and the supervisor a
crop instead of Kiran's bob.

**The renderer paints in parallel now, and the proof is byte equality (`0023`).**
A frame is a pure function of `(time, score, assets)`, so `--workers N` hands N
contiguous frame ranges to N browsers and then encodes them through the **same**
ffmpeg call (`-start_number`, absolute 6-digit frame names): parallelism changes
who paints, never what is encoded. `npm run render:workers --
films/same-alarm/score.json` renders a 2 s window twice and compares every PNG —
**60 of 60 identical bytes**, same picture hash, 67.3 s → 28 s on 4 workers *while
a third render was already using the machine*. That is a 2.4× floor, not a
ceiling: four Chrome launches and two encodes are most of the 28 s.
`film:chain` picks `min(6, threads / 2)` workers and prints the count, and
`--workers 1` restores the serial render for a machine short of memory.

**Purpose:** an honest inventory of what exists, what is weak, and what is
missing, with a deliberately small build plan. No new architecture unless it
removes a real blocker.

**Update 2026-11-02 — the loop is fixed before the next film.** The user's
instruction after *Same Alarm* was rejected: fix the whole system first, then make
another film. What was wrong was the **order** and the **cost** of the work, and
decisions 0025–0034 changed both. A film is now written `story.json` →
`beats.json` → `score.json`, each generated from the one above, and every stage is
checked before a frame is painted:

| step | what it removed | measured |
|---|---|---|
| `preflight` (0026) | defects found after a render | **0.9 s**, 5 refusals before a browser opens |
| `collage` (0027) | nine rounds of stills and a human seal | **30 s**, self-checked; the render refuses it |
| `probe:motion` (0028) | whole renders lost to still shots | **50 s**, refuses `motion:still` |
| `inspect` (0029) | 3 passes / 871 frames / 2.4 GB | **1 pass**, 600 frames, **0 bytes**, 59.4 s |
| `film:new` (0030) | a film could start at its shot list | writes **story, beats, score**, names every gap |
| `draft` (0031) | the first moving look was the film | **3 min 52 s** at 10 fps with the master |
| `determinism` (0032) | the film painted twice, 2 × ~12 min | **48 s**, 30 frames, and it tests worker order |
| `review --gate --reuse` (0033) | five audits re-run seconds after the chain | **363.5 s → 62.0 s**, all five reused |
| `audit:frames` (0034) | four whole-film decodes | **134.4 s → 38.5 s**, same values |

The chain tail with the render reused fell from **745 s to 297 s (5.0 min)**, so
the whole loop is about **19–20 minutes** including a ~12-minute render — inside
the 30–60 minute idea→video target, with no human seal anywhere in it.

Two claims in the verdict below are now false and are superseded here: **ASR is
not pending** (local Whisper `small.en` heard all 26 script words, 100.0% matched;
`words.json` and `transcript.json` say `source: "asr"`), and **determinism is not
two renders** (a 30-frame twin sample across one and four browsers, byte for byte,
plus a guard test that keeps the paint path free of wall clocks and randomness).
`gate:7` on *Same Alarm* is **PASS · 21 checks · nothing pending**, **408 tests**,
typecheck clean.

**Update 2026-11-02 — the four documents are four (0035).** 0025 promised
`scenes.json`; `film:new` printed it and nothing read it. The stage now exists:
scenes are authored (beat, place, summary, cast, lines, seconds), checked
against the beats and the measured read, and every shot names the scene it
answers. The story's lines and the score's lines are compared word for word.
`voice --apply` moves line starts and shot boundaries to the measured word
times, extends a line only when the read runs past it, keeps captions inside
their line, and validates before writing. On *Same Alarm* the old clock check
said "kept" while the measured read is 0.27 s early on the first line; the new
check catches it. **The script is still not generated from the idea** —
`film:new` scaffolds and a person writes — and narration is still spoken from
the score, not directly from `story.json`.

Still open and named: the collage and the storyboard each paint their own ten
frames (they could read the frames `inspect` already painted); `paint-match`
repaints 61 frames in fresh browsers (~73 s), which is the price of that proof;
props and sets are not yet derived from shot slots (cast coverage is); song
films are a marker only; there is no arm/hand audit and no
visual-reaction-to-word check. The measured style bible exists (`style:measure`);
per-region measurement and declared bands do not. No new film starts until the
plan in `docs/PLAN-v2.md` P0.1–P0.6 closes.

**Update 2026-11-04 — the plan, and the checks measure the film (0037).** The
video audit found six places where a check measured the promise, not the film,
and they are fixed: narration coverage/holes now come from the measured word
times (Same Alarm: **13% / 7.5 s**, not the 23% / 13.6 s the authored windows
claimed); story and score lengths are compared; shots must land on the frame
grid; the chain runs `tests → voice → embed`, so the page data cannot be one cut
old; `render:film` refuses a stale `score-data.js` before a browser opens; and
`style:measure --score` separates the score's 10 authored shots from the 12 raw
scene changes it used to call 13 shots. **440 tests**, typecheck clean.

`docs/PLAN-v2.md` is the full end-to-end plan in plain English: the video
checklist, every process stage, the P0/P1/P2 gap list, the seven-analysis /
four-rebuild agent workflow, and a ten-session build order. P0 is `voice
--story` + song clock, the asset pipeline (the shared library v1 is built:
8 poses, 14 expressions, `library:check/add/use`), per-region/bands measurement
(the x/y/z camera is built), the arm/hand + word-reaction + pop checks, and the
agent workflow. Still open in the library: the 14 names do not draw 14 unique
faces, props/sets are not in it, and versions are not immutable.

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

*(This table is from 2026-10-24 and is kept as history. The updates above it are
the current state; several rows here are no longer true — audio is measured, the
rig is fixed in the source, and the renderer paints from the score.)*

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
