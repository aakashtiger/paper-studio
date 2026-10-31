# AGENTS.md

Single source of truth for any AI agent working in this repository.
`CLAUDE.md` points here. OpenCode, Claude Code, Codex and Cursor all read this file.

## What we are building

Paper Studio: a deterministic, local-first video engine with two front doors.

- **Paper Vows** — wedding invitation films, sold as a service.
- **Paper Studio** — a self-serve studio for creators, sold as a subscription.

The first milestone is a 30-second wedding invitation film generated from `fixtures/wedding-min/brief.json`.

## Non-negotiables

1. **Determinism.** Same brief + same style version + same seed = identical frames.
   No `Date.now()`, no unseeded `Math.random()`, no network access in render code.
2. **The brief is the contract.** Every output must be traceable to a field in the brief.
   If a value is missing, surface a warning; never invent it.
3. **No invented facts.** Names, dates, venues, family details and RSVP values come only from the brief.
4. **Every feature ships with a command that proves it works.** If an agent cannot verify it, it does not exist.
5. **Boring technology.** Every dependency is a liability when two agents maintain the repo. Justify new dependencies in the PR.
6. **Decisions are written.** Anything structural goes in `docs/decisions/` the same day. If it lives only in chat, it will be contradicted next week.
7. **Style code stays in `styles/`.** Engine code never hardcodes a palette, a font, a shot or a recipe id.

## The three axes

| Axis | Question | Lives in |
|---|---|---|
| Style | How does it look and move? | `styles/` |
| Format | What is the deliverable? | `formats/` |
| Genre | What is the content, and how is it argued? | `genres/` |

Style and format are independent. Genre applies mainly to long-form YouTube.

## Ownership

| Path | Owner | Rule |
|---|---|---|
| `styles/**`, `fixtures/**`, `formats/**` | creative | engine changes never happen here |
| `src/**`, `scripts/**`, `test/**` | technical | no palette or shot ids here |
| `src/core/**`, `docs/**`, `sources/**` | shared | change only with both owners aware |
| `gate/**` | technical | sealed evidence; never edit a sealed input |

Do not refactor across an ownership boundary without a PR labelled `contract-change`.

## Commands

```bash
npm install            # install
npm run plan -- fixtures/wedding-min/brief.json   # print a shot plan
npm run treatment -- proofs/s2-paper/plan.json    # validate a creative treatment
npm run film -- films/understudy/score.json      # validate a scored film
npm run film:new -- --brief films/understudy/brief.json   # scaffold a score, never invent one
npm run film:review -- films/understudy/score.json        # chain the review, one page + one sheet
npm run captions -- films/understudy/score.json  # generate transcript + SRT
npm run voice -- films/understudy/score.json     # capture narration + word times, derive the clock
npm run asr -- films/understudy/score.json       # listen to the master; the G7 ASR gate
npm run board -- films/understudy/score.json     # derive board cards (HTML + manifest)
npm run storyboard -- films/understudy/score.json   # one code-drawn frame per shot, tiled into one sheet
npm run stills -- films/understudy/score.json    # sample the film, tiled into one sheet
npm run strips -- films/understudy/score.json    # one strip per shot from the delivered MP4
npm run audit -- films/understudy/score.json     # score-level audit
npm run audit:motion -- films/understudy/score.json   # per-shot motion floor
npm run audit:type -- films/understudy/score.json      # text inside the safe area
npm run audit:rig -- films/understudy/score.json       # leg solve + contact seam
npm run sheet -- films/understudy/score.json     # character/pose sheet PNG
npm run sfx -- films/understudy/score.json       # code-generated SFX + mix
npm run animatic -- films/understudy/score.json  # board animatic + voice/SFX/SRT
npm run rough -- films/understudy/score.json     # stepped rough at 10 fps + board contact sheet
npm run doctor         # preflight: node, ffmpeg, ffprobe, chrome, fonts (--render smoke-tests a frame)
npm run typecheck      # TypeScript check
npm test               # unit and mutation tests
```

Style commands, built in S1a:

```bash
npm run style:new -- <id> --brief <file>
npm run style:check -- <path>
npm run style:approve -- <id> --by "<name>"
npm run style:resolve -- --style <path> --seed <n> --brief <file> --format <file>
npm run style:sheet -- styles/paper-kpop          # derived style sheet into build/
npm run style:seal
node --import tsx --test test/watercolor-gate.test.ts   # S1b pilot gate
node --import tsx --test test/paper-kpop-gate.test.ts   # S1c gate
node --import tsx --test test/watercolor-0.2.0-gate.test.ts   # S1c.1 gate
node scripts/card-audit.mjs styles/watercolor-0.2.0/card.html 900 700   # card height
npx hyperframes preview proofs/s2-paper   # S2 proof preview + timeline
npx hyperframes render proofs/s2-paper -o proofs/s2-paper/paper-proof.mp4 --fps 30
```

## Current phase

**S1c — Paper K-pop — complete, accepted 9/10 GO.**

S1a is complete and accepted **9/10 GO**. S1b converted watercolor into a real pack.
S1c converted the author's own paper-cut film into the Paper K-pop pack, with no
renderer and no video.

The Paper K-pop pack is **REVIEWABLE** with one open director choice (`paper-shadow`).
The final pack hash is `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`.
The full evidence is in `docs/decisions/0008-paper-kpop-pilot.md`,
`gate/paper-kpop-blind/REPORT.md` and `gate/paper-kpop-blind/AUDIT.md`.

Proven in S1c:

- `styles/paper-kpop/` — 8 recipes, 2 formats, card, bundled fonts, licence notices
- song 14 shots / 45 s / 16:9, Shorts 8 shots / 30 s / 9:16, blind 6 / 30 / 9:16
- 9/9 resolver assertions, 9/9 gate tests, 110/110 full suite
- geometry: 14 px floor, no text overlap, no rule crossing, paired 9:16 anchors,
  margins, contact; 6 critical and 8 high findings fixed in one batch
- a fresh blind, *Last Cue* (run-18), on the final `6c5765be…` hash; the old *Rooftop Soundcheck* run is archived
- contract 9/10 GO, creative 9/10 GO, product 9/10 GO

**S1c.1 — Watercolor 0.2.0 — complete, accepted 9/10 GO.**

The 0.1.0 evidence stays historical and is not edited. The new pack is
`styles/watercolor-0.2.0/` 0.2.0, **REVIEWABLE**, one open choice
(`paint-in-speed`), `sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05`.
The new gate is `gate/watercolor-0.2.0/` with `REPORT.md`, `AUDIT.md`, `CARD.md`,
critics and one final blind (*A Small Inventory*, 6/30/9:16, 9/9).

- 0.2.0 is a card/process revision: visual-first card, stripped `APPLICATION.md`,
  exact 24-file manifests, UTF-8 resolve, density/height checks, one final blind.
- Page 8/45/1:1 and scroll 4/45/16:9 resolve 9/9; full suite 110/110.
- 9:16 is the text proof; 1:1 and 16:9 are labelled **unverified/S2** with box
  diagrams. The 16:9 walk leader/entry alignment is unverified/S2.
- Card: 78 prose / 237 visible words; 4,158 px at 900, 4,691 px at 390; phone
  390 px, 9:16 screen.
- Critics: contract 9/10 GO, creative 9/10 GO, product 9/10 GO.

**Next: the core system, before any film render.** `docs/PRODUCTION-PLAN.md`
v1.4 is accepted. *The Understudy* is a **fixture** for contract tests, not the
first real film; the user will provide the idea. The board is derived from the
score, not a fixed count; SFX are generated in code; audio resolves before shot
timing. The source rig is patched and `test/rig-drift.test.ts` guards it.

The **contract layer and the first generators are implemented**: film brief,
audio resolver (recorded/TTS narration, library/generated music, generated SFX),
asset manifest, pose library, film score, derived **board**, score-level
**audit**, the **character/pose sheet** generator and the **board animatic**
builder. **246 tests.** The sheet has a signed **9/10 design** review. The paper
rig has two-bone leg IK, ankle targets, foot pitch and a knee-driven bounce; the
leg targets are now reachable, so a planted foot bends its knee and lands on its
shadow (`test/cast-rig.test.ts`). The board animatic is **9/10 signed** (editor +
QA) with voice, captions and 13 generated SFX cues; it is a board pass, not a
stepped rough. The seven critics and gate checklist are in `critics/` and
`docs/GATES.md`. The SFX cues are now rendered by the kit
(`src/engine/sfx.ts`): six materials, named layers, modal resonators, friction,
a synthetic room, and a cue that can bind to its picture event. The score-level
mix master is **-14.3 LUFS / -1.5 dBTP** and `gate:7` reads it; the delivered
MP4 still carries the earlier audio cut — the look pass and the final master
re-cut are next. The painter now lives in the
style pack (`styles/paper-kpop/canvas/recipes.js`, decision 0015); the film
renderer and three mechanical G7 audits are built (`audit:motion`, `audit:type`,
`audit:rig`). The **stepped rough** is built (`npm run rough`): the score painted
at 10 fps through the pack painter, every board time paired to its frame on one
contact sheet, every shot measured — all nine shots pass the motion floor with no
hold over 0.4 s. The voice pipeline is built (`npm run voice`, `npm run asr`);
ASR waits only for the local speech model install (decisions 0016, 0017). Only
then does the user's idea become a film. No film render before the core is fixed.
No app, no asset library, no watercolor until the first film ships.

**The review surface is being closed (decision 0017).** Two creator workflows and
a survey found three gate rows that required a review sheet with no command, and
two contracts that drifted. The change set, in order: `0` reconcile docs → `1`
one grid helper (`src/engine/grid.ts`) + board sheet → `2` `doctor` (built) → `3`
style sheet PNG derived into `build/` → `4` stills sheet → `5` storyboard as
exactly one frame per shot, in order → `6–7` the G5 per-shot strips, the G6
spectrogram sheet and the G7 final sheet, each a command → `8` `film:new`
(scaffolds, never invents) → `9` `film:review` → `10` voice-as-clock (**built**:
`npm run voice` captures a recording or Kokoro TTS and derives the clock from
local Whisper word times re-attached to the script's spelling; `npm run asr`
listens to the master and is the G7 gate) → `10e` the SFX kit (**built**:
`src/engine/sfx.ts` renders layers over a material, one `send`/`duckDb`/`band`
table shared with the mix; a cue can name its time once by binding to its picture
event, and `npm run sfx` fails on a click, a banned kind, an unknown kind or a
cue outside its band) — still generated in code. Music (ACE-Step) is **staged**
until the first film that uses it. Banned: generative **images or video** in the
render path, and per-film LLM-written animation code. Allowed: local models for
voice, word timing and music, because the picture stays entirely code-drawn.

The change set is **complete and reviewed once**. The two critics that answered
(architect, developer) named real blockers; the other five could not answer, and
that gap is recorded rather than papered over. The blockers are fixed: an unknown
SFX kind is a contract error, a derived cue snaps to the frame grid, the `sfx`
clock has no second cue list, the mix refuses a stale cue by spec fingerprint and
WAV hash, review chrome is one neutral `REVIEW_CHROME`, every sheet takes its
faces from the pack's `tokens.json`, and `film:review` never prints a report it
did not write this run. `film:review --gate` is **PASS**: audit 32 events /
17 cues, 17/17 SFX, mix -14.2 LUFS / -1.9 dBTP, `gate:7` 13 checks with **ASR the
one pending row**, 246 tests, clean typecheck. `docs/decisions/0017` §Landed has
the detail.

The **sound pass** followed the sound critic's 6/10: the master's tail fade was
inverted, cues were peak-normalised (so the softest was the loudest), materials
rang under 200 Hz where a phone cannot move air, a `crowd` repeat machine-gunned,
the fixture's cues were typed near their events instead of bound to them, and the
master was a normaliser rather than one gain and a true-peak limiter. All six are
fixed and each has a command or a test behind it: `CUE_RMS`, `phoneAudible` /
`PHONE_FLOOR`, `checkCueSet`, `event`-bound cues, and a mix report that records
`master.gainDb` and `master.limiterCeiling`. Still open and named in
`docs/STATUS.md`: the MP4's earlier audio cut (the look pass re-cuts it), no music
and narration that ends at 19.5 s (the brief's copy ends there), a mono field,
transcript word times that say `source: "guess"` until Whisper is installed, and
ASR pending.

Do not build: the renderer in this phase, a video, the web app, a second product
style, or a conversion of the other 58 Lemo styles. `styles/paper-vows` remains
legacy and is not expected to pass the S1a validator.

## How to make a change

1. Read the relevant spec in `docs/specs/`.
2. Change the schema first if the contract moves.
3. Update the fixture in the same commit.
4. Implement.
5. Run `npm run typecheck` and `npm run plan`.
6. Update `docs/decisions/` if the change is structural.
7. Small commit, conventional message.

## Definition of done

- `npm run typecheck` passes.
- `npm run plan -- fixtures/wedding-min/brief.json` produces a valid plan.
- Fixture updated if the schema changed.
- Docs updated if behaviour changed.
- No new dependency without a stated reason.

## Note on the two owners

The creative owner is not a programmer. They direct an LLM and judge output by looking at it.
The technical owner is a programmer and directs a different LLM.

Write code and docs so that a non-programmer can tell whether the result is correct by running one command and looking at the output. Prefer explicit, boring, readable code over clever abstraction.
