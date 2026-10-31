# 0017 — Review surface, audio sources, and the sheet rule

**Status:** accepted · 31 Oct 2026
**Owners:** shared (engine contract + creative review surface)
**Spec:** `docs/PRODUCTION-PLAN.md` (§ Step 2, § Still missing, § What not to build)
**Supersedes:** the wording of Step 2 "storyboard" and the "no sample library" line
**Source:** two creator workflow videos, the free `faceless-videos` Claude Code
skill (its `SKILL.md`, `voice.py`, `words.py`, `mix.py`, `capture.mjs`), the
user's storyboard idea, and a survey of our own commands.

## Why

Two published workflows make narrated films fast and cheap, and a survey found
the same discipline missing in three places in our own repo. This decision
records what we adopt, what we refuse, and the exact wording of the contracts
that move. It is written before the code, as the repo requires.

## 1. The image/video rule is sharpened (not "no AI")

The reference skill **bans AI images and video** and **uses local AI for voice,
word timing and music**. Our "no AI" phrasing was too broad: it would have
banned our own voice pipeline. The precise rule is:

- **Banned:** generative **images or video** anywhere in the render path, and
  per-film LLM-written animation code.
- **Allowed:** local models for **voice, word timing and music**, because the
  *picture* stays entirely code-drawn from the score.

This is the honest reason a film re-renders byte-for-byte and a generative
pipeline cannot. It is added to `PRODUCTION-PLAN` "What not to build".

## 2. Storyboard = one frame per shot, in order

`PRODUCTION-PLAN` Step 2 said a storyboard is "one frame per shot **plus any key
beat the director marks**", 1920, **plus a 390 px legibility check**. That
duplicates the board and mixes two jobs. It becomes:

- **Board** (text/cards) = every shot **and** every marked beat.
- **Storyboard** = exactly **one code-drawn frame per shot**, in order, on one
  sheet. Nothing more, nothing less.
- The **390 px legibility check** is a type check and belongs to `audit:type`.

The **"no storyboard image farm"** line stays, and is clarified: it bans an
**authored** storyboard with a target count, not a **derived** one created after
the shots exist.

## 3. One sheet rule, one sheet builder

Every batch of pictures is reviewed **on one image**, never file by file. A
single helper (`src/engine/grid.ts`) tiles labelled images; every command that
produces N pictures uses it. The sheet is a **review artifact**: it lives under
`build/`, is gitignored, and **never enters a render manifest or a frame hash**.

Three of these sheets were already **pass conditions with no command**:

| Gate | Sheet | Status before |
|---|---|---|
| G2 | board sheet, storyboard | storyboard existed; board sheet did not |
| G5 | a strip per shot every 0.5 s | no command |
| G6 | a spectrogram sheet per cue | no command |
| G7 | final 0.5 s contact sheet | no command |

A gate is only real if a command proves it. These are now commands.

## 4. Style sheet is a derived artifact

The visual style sheet (fonts, hex swatches, character lineup, hero frame, safe
zones) is **computed from the pack** and written to `build/<pack>/`. It is not
written into `styles/**`: the pack is creative-owned, and a generated file there
would have to be hashed like an authored asset. `card.html` and `CARD.md` remain
the authored pack docs.

## 5. Entry points scaffold, never invent

- `film:new` writes a **legal, empty-of-invention** score skeleton and fails
  with the precise list of fields the director must fill. It cannot invent a
  shot, a recipe or copy.
- `film:review` chains the steps, prints one page and one sheet, and **hides no
  failure**.

## 6. Voice: capture and timing are local tools; ASR is the last gate

Supersedes the "ASR is only manual" carry-forward where the tooling now exists:

- **Capture** is `recorded` (a supplied file) or `tts` with a **provider**:
  `kokoro` (local, Apache-2.0) or `elevenlabs` (cloud). A cloud voice is fetched
  **once, at authoring time**, and stored as a pinned WAV; the render never
  touches the network.
- **Word timings** come from local **Whisper** (`faster-whisper small.en`),
  re-attached to the **script's spelling** — the transcript of the actual read,
  not a guess from word length.
- **The clock** is derived from that transcript; shot boundaries snap to phrase
  beats.
- **ASR of the mixed master** is the G7 gate, the same Whisper.
- These tools are **external** (pinned by version, path-resolved like
  `ffmpeg-static`), **not npm dependencies**.

Speech needs a model; foley does not. That distinction is the rule.

## 7. Music: library first, generated fallback

`library` (with a licence) first; `generated` (ACE-Step 1.5, MIT, local)
fallback. ACE-Step is **staged** until the first film that actually uses music —
15 GB and RAM-tight on a 16 GB laptop.

## 8. SFX: generated in code, but properly — and bound to the picture

The "no sample library — SFX are generated in code" line **stands**. The
generator, not the sourcing, was the problem:

- 8 kinds built from 1–2 oscillators through a one-pole filter ignored the
  schema's own `layers`, `band`, `send` and `duck` fields.
- The upgrade is code-only and deterministic: **layered cues** (transient, body,
  tail), **modal resonators** for material (footsteps, knocks, doors, glass,
  wood), **friction/stick-slip** (creaks, cloth), **synthetic impulse responses**
  for space, and an **ambience kit** (wind, rain, water, crowd, hum).
- A cue may **bind to its picture event**, so its time is derived, not typed
  twice. This is required by §6: once the clock moves, a hand-typed absolute
  second drifts.
- Generated cues may be **promoted** to `library/sfx/` with provenance
  (generator version, seed, hash, licence) and reused. `SfxPlanSchema.source`
  gains `library` and `recorded`, **defined but unbuilt**, so a free pack can
  drop in later without a contract change.
- **Mix for phone speakers:** no ticks, clicks, hats, glitches or beeps.

## Consequences

- `PRODUCTION-PLAN` Step 2, the system table, "Still missing" and "What not to
  build" are amended in the same change.
- Three gate rows move from aspirational to provable.
- `films/understudy/score.json` is **not** touched by this decision; any score
  edit is a separate, versioned change.

## Landed

Steps `0`–`10e` are built and each ships a command: `style:sheet`, `stills`,
`strips` (G5), the spectrogram sheet written by `sfx` (G6), the final sheet
written by `gate:7` (G7), `film:new`, `film:review`, `voice`, `asr` and the SFX
kit. `gate:7` is 13 checks and names ASR as the one pending check until its
report exists.

Step `10e` landed as §8 describes: `src/engine/sfx.ts` is the kit (six
materials, named layers, modal resonators, friction, a synthetic room, ambience)
and every kind carries its own `send`, `duckDb` and `band` — the mix reads the
same table. A cue names its time once: `at`, or `event { shot, index }` resolved
by `resolveCueTimes` against the shot's direction events; the resolved list is
`plan.cues`, so the SFX renderer and the mix can never disagree. `npm run sfx`
writes one WAV per cue, a stem mix, `build/<id>/sfx/sfx.json` and the
spectrogram sheet, and exits non-zero if any cue fails a mechanical check
(on a frame, half its energy in its declared band, top ≤9 kHz, longer than a
click, clean fade, kind not banned). `library` and `recorded` SFX are in the
contract and rejected as unbuilt until a film needs them.

### The critic-fix pass on steps `10`/`10e`

Two critics (architect, developer) returned before the other five hit a usage
limit; both withheld a sign and named concrete blockers. The fixes are part of
this decision, not a follow-up:

- **A typo is not a sound.** `kindSpec` threw nothing and fell back to a generic
  impact; an unknown kind now fails at resolve (`sfx_kind_unknown`) and the
  renderer refuses it. `isKnownKind` is the one test.
- **A derived cue lands on a frame.** `toFixed(3)` cannot express 1/30 s;
  `resolveCueTimes` snaps the sum to the frame grid (`Math.round(t*fps)/fps`),
  so a bound cue is always on a frame.
- **The clock is one list.** The `sfx` clock mode carried a second cue list;
  it now reads `audio.sfx.cues` and requires an explicit `at` for a cue that
  drives the cut. One time, authored once.
- **The mix cannot mix yesterday's take.** `sfx.json` records each cue's
  `spec` fingerprint and WAV hash; `npm run mix` recomputes both and stops with
  the command to re-run. The mix report records `inputs.score`, `inputs.sfx` and
  `inputs.voice`, and `gate:7` ties them to the current score, cue set and
  master.
- **One neutral chrome.** `REVIEW_CHROME` (`grid.ts`) is the only page palette;
  the style sheet and the board no longer paint paper-kpop's hex, and the sheet
  and every grid take their faces from the pack's `tokens.json`
  (`packFontPath`), never from `proofs/`.
- **The review page cannot lie.** `film:review` summarises a step only from a
  report this run wrote; a failed step prints its own error line, and skipped
  work is printed as skipped.
- **Events and cues are counted apart** in `audit.json`.

Evidence after the pass: `sfx` 13/13 ok, `audit` 32 events / 13 cues,
`mix` -14.3 LUFS / -1.5 dBTP with tied inputs, `gate:7` PASS 13 checks / 1
pending (ASR), `film:review --gate` PASS, 242 tests, clean typecheck. A probe
(one cue moved to 1.01 s) showed `audit` and `sfx` failing on the real error and
the mix refusing the stale WAVs; a probe that changed a cue's gain after the
render made `npm run mix` stop with "changed after it was rendered".

Music (ACE-Step) stays staged until the first film that uses it.
