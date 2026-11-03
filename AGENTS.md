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
npm run film:new -- --brief films/understudy/brief.json   # scaffold story, beats, scenes and score; never invent
npm run film:review -- films/understudy/score.json        # chain the review, one page + one sheet
npm run film:review -- <score> --gate --reuse             # print audits the chain just ran, when they are tied to this film (0033)
npm run captions -- films/understudy/score.json  # generate transcript + SRT
npm run voice -- films/understudy/score.json     # capture narration + word times, derive the clock
npm run voice -- <score> --apply                 # accept the measured read: line starts, shot bounds, captions (0035)
npm run voice:story -- --story films/<id>/story.json --out films/<id>/narration.json   # speak the story before the score (0040)
npm run voice -- <score> --from-story <narration.json> --apply   # write the measured clock, captions and shot snaps into the score (0040)
npm run asr -- films/understudy/score.json       # listen to the master; the G7 ASR gate
npm run board -- films/understudy/score.json     # derive board cards (HTML + manifest)
npm run storyboard -- films/understudy/score.json   # one code-drawn frame per shot, tiled into one sheet
npm run stills -- films/understudy/score.json    # sample the film, tiled into one sheet
npm run strips -- films/understudy/score.json    # one strip per shot from the delivered MP4
npm run preflight -- films/understudy/score.json  # every cheap check, before frame 1
npm run probe:motion -- films/understudy/score.json   # does every shot move? before the paint
npm run inspect -- films/understudy/score.json    # one pass: movement, type and rig together
npm run draft -- films/understudy/score.json      # watch and listen, at 10 fps, before the film
npm run determinism -- films/understudy/score.json # twin sample: the same frames, serial and parallel (0032)
npm run collage -- films/understudy/score.json    # one frame per shot, self-checked
npm run audit -- films/understudy/score.json     # score-level audit
npm run audit:motion -- films/understudy/score.json   # per-shot motion floor
npm run audit:type -- films/understudy/score.json      # text inside the safe area
npm run audit:rig -- films/understudy/score.json       # leg solve + contact seam
npm run audit:body -- films/understudy/score.json      # arms bend, hands are hands (P0.4)
npm run audit:reaction -- films/understudy/score.json  # a reaction lands on its word, 0-3 frames (P0.4)
npm run sheet -- films/understudy/score.json     # character/pose sheet PNG
npm run sfx -- films/understudy/score.json       # code-generated SFX + mix
npm run mix -- films/understudy/score.json       # score-level master, measured
npm run render:film -- <score> --workers 4       # paint N contiguous ranges in N browsers (0023)
npm run render:workers -- <score>                # proof: 4 workers == serial, frame by frame
npm run deliver -- films/understudy/score.json   # mux the master into the frozen picture, measure the file
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
npm run style:measure -- --ref <dir|video> [--specimen <dir|video>] [--camera]   # measure a style, then our frames against it; x/y/z camera (0036, 0039)
npm run library:check -- library/characters/index.json   # reusable characters: file, rig, poses, 12+ expressions, licence (0038)
npm run library:add -- --character <id> --kind pose|expression --from <file.json>   # add one pose/expression once, reuse it
npm run library:use -- --score <score.json> --character <id> --apply   # point a film's cast and asset at a library character
npm run library:sheet                             # one sheet per library character: poses and 14 expressions
npm run camera:check -- <score>                  # every shot moves, varied, correct sign (0041)
npm run camera:plan -- <score> [--apply]         # propose dynamic moves from the beats
npm run assets:list                              # the plain-name asset catalogue
npm run assets:check                             # every asset has a file, a name, a licence; props a size
npm run assets:coverage -- <score>               # the assets the recipes name vs the film's manifest (0042)
npm run assets:new -- --score <score> [--write]  # derive the missing recipe assets, hash them (0045)
npm run style:seal
node --import tsx --test test/watercolor-gate.test.ts   # S1b pilot gate
node --import tsx --test test/paper-kpop-gate.test.ts   # S1c gate
node --import tsx --test test/watercolor-0.2.0-gate.test.ts   # S1c.1 gate
node scripts/card-audit.mjs styles/watercolor-0.2.0/card.html 900 700   # card height
npx hyperframes preview proofs/s2-paper   # S2 proof preview + timeline
npx hyperframes render proofs/s2-paper -o proofs/s2-paper/paper-proof.mp4 --fps 30
```

## Current phase

**The loop is fixed before the next film is made (decisions 0025–0035).**

The user's instruction, after *Same Alarm* was rejected: fix the whole system
first, then make another film. What was wrong was not the painter — it was the
**order** and the **cost** of the work. Nine full renders produced seven cuts a
one-second check had already rejected; the film that shipped had never been
written; the first time anyone saw the cut move was after paying for it. Eleven
decisions changed that, and the pipeline a film now takes is:

```
story.json   the spine, the tone, the narration lines, the pace band       (0025)
beats.json   what each beat is for, the share it owns, its signature sound (0025)
   → npm run voice:story  ~20 s  speak the story, measure the words (0040)
scenes.json  where it happens, who is in it, what happens, its lines       (0035)
score.json   the shots, each bound to a scene and a beat, with a reason     (0025)
   → npm run voice --apply    accept the measured read into the score (0035)
   → npm run camera:check   ~1 s   every shot moves, and the film varies it (0041)
   → npm run assets:new -- --score <score> --write   the manifest names what the recipes draw (0045)
   → npm run assets:coverage         every recipe asset is in the manifest (0042)
   → npm run audit:body              arms bend, hands are hands (P0.4)
   → npm run audit:reaction          the picture waits for the word, 0-3 frames (P0.4)
   ↓ npm run preflight     ~1 s    the writing, the scenes, the read, the cut, the sound
   ↓ npm run inspect       ~1 min  ONE pass: movement, type and rig, probe-only
   ↓ npm run determinism   ~48 s   the same 30 frames, serial and parallel (0032)
   ↓ npm run collage       ~30 s   one frame per shot, checked by the tool, not by a person
   ↓ npm run sfx / mix             the sound, generated in code, measured
   ↓ npm run draft         ~4 min  watch and listen at 10 fps, with the master
   ↓ npm run render:film   ~12 min the film, ONCE, refused without every check passing
   ↓ npm run deliver + gate        the delivered file, measured
   ↓ npm run film:review   ~1 min  one page; audits the chain just ran are not repeated (0033)
```

What each decision bought, measured on *Same Alarm* (60 s, 10 shots):

| decision | before | after |
|---|---|---|
| 0026 preflight | 70–81 min per defect, discovered after the render | **0.9 s**, 5 refusals, before a browser opens |
| 0027 collage | nine rounds of fifteen stills, ~2 h | **30 s**, one page, self-checked |
| 0028 movement probe | two whole renders lost to still shots | **50 s**, refuses `motion:still` before the paint |
| 0029 one pass | 3 passes / 871 frames / 2.4 GB of PNGs / 92.5 s | **1 pass**, 600 frames, **0 bytes**, **59.4 s** |
| 0030 front door | `film:new` wrote only the score — a film could start at its shot list | writes **story, beats, scenes, score**, in order, and names every gap |
| 0031 draft | the first moving look was the film itself | **3 min 52 s** for a 10 fps cut with the master |
| 0032 determinism | the film painted twice to prove it, 2 × ~12 min | **48 s**, 30 frames, and the twin now tests worker order |
| 0033 review reuse | the review re-ran five audits the chain had just run | **62 s**, all five printed from reports tied to this picture/score |
| 0034 frame audit | 134 s, four whole-film decodes, and a blank check that could not fail | **38.5 s** per shot, same values, and the blank rule fires |
| 0035 four documents | 0025 promised `scenes.json`; no schema read it, and `voice` only proposed | scenes authored and checked, story↔score text compared, `voice --apply` cuts to the read |

`render:film` refuses a whole-film paint without a passing preflight, collage
and movement report, each carrying the sha256 of the score it describes. Probes
(`--stills`, `--from/--to`, `--draft`) are ungated — they are the instruments.
The type and rig audits now run **before** the render, on frames identical to the
delivered ones by purity (0023).

Determinism is a twin **sample**, not a twin render: 30 frames painted once
serially and once across four browsers, compared byte for byte (~48 s, against
~24 min). It also proves what the old twin could not — that a frame is the same
whichever browser paints it — and `test/paint-purity.test.ts` keeps the paint
path free of `Math.random`, wall clocks, `requestAnimationFrame` and played
timelines, so the guarantee is structural rather than observed.
`npm run determinism:renders` still compares two complete renders when a release
wants the full proof.

**A report is trusted because it is about this film, not because it is new.**
`film:review` used to re-run the five audits the chain had just run — 363 s, two
of them repainting every frame they judged. It may now print a report it did not
write this run only when the report is *tied to this film*: a video audit by the
`videoHash` of the picture it read, a paint-probe audit by the `score` it measured
plus the mtime of the paint code. `--gate --reuse` is what the chain runs
(**62 s**, five of five reused, against 363 s); plain `--gate` still re-runs
everything. A reused report that says `pass: false` still fails the review —
reuse is about freshness, never leniency.

**ASR is no longer the manual row.** Whisper `small.en` is installed locally:
`npm run asr` heard all 26 script words (100.0% matched), and `words.json` and
`transcript.json` carry `source: "asr"` with real word times rather than a guess.
`gate:7` on *Same Alarm* was **PASS · 21 checks** before the writing row; under
**0047** it now **fails `writing`** because the delivered film has no
`story.json`, `beats.json` or `scenes.json` — it was never written, only shot.
A new film is written first and must pass the row.

**The frame audit measures per shot, and its blank check can fail.** 1,800 frames
cost **38.5 s** instead of 134.4 s, with every brightness sample and every
within-shot difference proved identical; only the diff across a cut is absent,
and a cut is not a hold. The blank rule was `YAVG < 8 || YAVG > 247`, which
cannot fire on limited-range video — legal black is 16 — so `noBlankFrames` could
never fail. It now requires a frame at either end of the video's own range **and**
uniform, and a clip with half a second of black inserted is caught (15 blank
frames, exit 1). The chain tail fell from 6.6 to **5.0 min**.

**The four documents are four now, and the voice is the clock.** 0025 promised
`scenes.json`; `film:new` printed it and nothing ever read it. Scenes are now
authored — place, cast, summary, the lines they carry, their seconds — and
checked against the beats, the measured read, and the shots that answer them.
The story's lines and the score's lines are compared word for word, so a film
cannot say something it was not written to say. `voice` no longer proposes:
`--apply` moves line starts to the measured **word** times, extends a line only
when the read runs past its window, keeps captions inside their line, and
validates the result before writing. Proven on *Same Alarm*: the old check said
"kept"; the measured clock is **0.27 s early** on the first line, 0.14 s late on
the second, 0.22 s late on the sixth, and `--apply` fixed all three after the new
score validated. **408 tests.** The narration coverage floor is now **0.8**, not
0.5, and a narrated short must speak within 1 s of its first frame.

**A style can now be measured, not just described.** The pack's 27 decisions
encode a style well; they did not come with a repeatable way to read one out of a
reference. `style:measure` measures any video or folder of frames with ffmpeg
alone — luma, contrast, saturation, edge density, movement, cuts, shot lengths
and palette — and `--specimen` measures our frames against the reference in the
same units. The first run is honest: our *Same Alarm* storyboard is **11 points
darker, 28 points lower contrast, 24 points less saturated** than the pack's
reference crops, with a palette distance of **64**. That is "ours looked dull" as
numbers instead of an opinion. It does not pass or fail a style; the style
declares its bands and the tool measures the gap.

**The camera is x/y/z, and a character is a library file.** `style:measure
--camera` tracks the camera on a 48-wide luma grid — `dx`, `dy` and `dz` per shot,
plus a per-frame path and the share of shots that move or zoom. On *Same Alarm*
it reads **|dx| 16 px/shot, |dy| 0 px/shot, dz 4.5%/shot, moving 20%**, and its
**z** moves match the score: shot 7 `+20%`, shot 8 `−3%`, shot 9 `+6%`, shot 10
`+9%`. Shot 2's `dx −120` is the corridor scroll, not a camera move, and it
dominates the `|dx|` average; the report keeps the per-shot rows so that is
visible. The shared library (`library/characters/`) makes a character a versioned pose
file with **8 poses and 14 expressions**, a rig, a source, a licence and a
`sha256`; `library:check` refuses one that is not reusable, `library:add` adds a
pose once, and `library:use` points a film's cast and asset at it. A pose event
can name an expression, and the painter maps it to the rig's eyes/brow/mouth.
**462 tests.**

**The story now speaks first, the camera is a grammar, and assets have names.**
`voice:story` reads `story.json` + `beats.json`, speaks the lines, listens with
Whisper, and writes `narration.json` **before a score exists**; `voice --
<score> --from-story <narration.json> --apply` then writes that measured clock,
its captions and its shot snaps into the score. Coverage is measured on the
**audio** now (0044), not on ASR word nuclei: `fixtures/story-long` (60 s,
189 words, 189 wpm) is **82%** voiced, last word at 59.28 s, and passes every
check. The 30 s fixture is still **refused** - its voice ends at 22.06 s and the
film stops talking - and a 30 s film with nine spoken lines cannot carry the
**180-190 wpm** band (0043): the line breaks alone are 4 s of 30. A 30 s short
in this band needs five beats, not nine.
`camera:check` refuses a still shot, a push that pulls, a move with no travel,
and a four-shot run; `camera:plan` proposes a varied sequence from the beats
(four moves, longest run 1, preserves authored cameras unless `--force`);
`assets:list` names 40 built assets in plain English, every prop now has a
declared size, and `assets:new` derives the **6** recipe assets Same Alarm's
manifest misses, hashes the file that draws each, and passes `assets:coverage`
on the copy (0045). `library:sheet` renders Kiran and Vaz with 8 unique poses
and **14 unique expressions** into `build/library/sheets/`; both characters now
stand on straight legs, their left sleeve is visible, and the 14 faces are 14
shapes (0048). Immutable library versions and the 7+4 agent workflow are parked;
ElevenLabs/other voice providers are parked too.

**The body has a check now (P0.4).** The shared pose libraries publish their arm
lengths and hand/thumb boxes; `resolvePoseLibrary` refuses a hand narrower or
shorter than 1.5× its own thumb and a pose whose two elbows are both straight.
`audit:body` reads the library character for every cast member (Same Alarm:
Kiran and Vaz hand 18×26, pass; a 5×6 hand and a 0.000/0.000 elbow fail).
`event.word` binds an event to a clock line, and `audit:reaction` requires it to
land **0–3 frames after the measured word** (12.40 s passes at +0.0, 12.30 s
fails at −3.0). The frame audit now refuses a one-frame luma pop at a cut. The
first film must author `word` events; Same Alarm has none. **462 tests.**

**The plan is `docs/PLAN-v2.md`.** It is the end-to-end process in plain English,
the video checklist, the P0/P1/P2 gap list and a ten-session build order. No new
film starts until P0.1–P0.5 and P0.7–P0.9 close: `voice:story` and
`voice --from-story` are built; the asset manifest is derived, sized and hashed
(0045); the arm/hand, word-reaction and pop checks are built (0046); still open
are the seven-analysis / four-rebuild agent workflow, the bypasses and the
sound-contrast gate.

**Still open, and named:** the style measurement is global per-frame, not
per-region (it cannot say where the ink is, which way the light falls, or whether
a hand is a plank); its contrast is still `YMAX-YMIN`, its edge density is
scale-dependent, and it has no pass/fail bands; reference and specimen are paired
by filename. The camera z is a per-shot scale proxy, not a 3D solve, its grid is
40 px on a 1920 film, and there is no roll. The library holds 14 expressions,
each a different face (0048), and 8 poses, each a different body; props and sets
are not in the library. The script
is not generated from the idea —
`film:new` scaffolds and a person (or an LLM they direct) writes; narration is
still spoken from the score rather than directly from `story.json` (the text is
proved identical, but the literal order 0025 describes is one stage away);
scenes are checked against the read, not auto-fitted; props and sets are not
derived from shot slots (cast coverage is); song films are a marker only; there
is no arm/hand audit, no
visual-reaction-to-word check, and backgrounds are not cached within a scene.
The collage and the storyboard each paint their own ten frames (they could read
the frames `inspect` already painted); `paint-match` repaints 61 frames in fresh
browsers (~73 s), which is the price of that proof rather than waste. No new film
starts until the user says so.

---

**The first real film - *Same Alarm* - and Paper K-pop 0.2.0.**

The user's own idea is a film: *the life of a corporate slave from morning to
night*, one minute, new characters (`films/same-alarm/`). It is a 10-shot, 60 s,
16:9 scored film built from the pack's painter with no hand-written animation:
seven narration lines (Kokoro, clock measured on the audio), 35 code-generated
SFX cues bound to picture events, a measured master, 1800 frames, a delivered
MP4, and `npm run film:chain` to run the whole order. The picture is a loop — the
same alarm at 06:00 opens and closes it, and the last hand does not come down.

The pack that hosts it is **0.2.0**: eight office recipes for the film's world, a
painter that honours `camera.ease`, staging derived from the film's cast
(`castIn`), `drawCharacter` dispatched by the score's `rig`, and an hour tab that
is a declared zone the label is set inside. 0.2.0 is **REVIEWABLE, not sealed**:
the evidence is the film's own gate, and the seal lands with acceptance.

Two structural rules came out of it (`docs/decisions/0020`): a **format names the
recipes it uses**, so a pack can grow without re-cutting a sealed plan; and
**`optionalSlots` counts as a declared slot**. `BEAT_ROLES` and the closed
contract are unchanged, because widening them re-validates every sealed pack in
the repository.

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
builder. **408 tests.** The sheet has a signed **9/10 design** review. The paper
rig has two-bone leg IK, ankle targets, foot pitch and a knee-driven bounce; the
leg targets are now reachable, so a planted foot bends its knee and lands on its
shadow (`test/cast-rig.test.ts`). The board animatic is **9/10 signed** (editor +
QA) with voice, captions and 13 generated SFX cues; it is a board pass, not a
stepped rough. The seven critics and gate checklist are in `critics/` and
`docs/GATES.md`. The SFX cues are now rendered by the kit
(`src/engine/sfx.ts`): six materials, named layers, modal resonators, friction,
a synthetic room, and a cue that can bind to its picture event. The score-level
mix master is **-14.1 LUFS / -1.9 dBTP** from one measured gain and a true-peak
limiter, and `gate:7` reads it; `npm run deliver` then puts it into the frozen
picture and measures the **delivered file's own** audio (**-14.4 LUFS / -1.9
dBTP**), so the MP4 carries the cut that was measured rather than an earlier one.
The painter now lives in the
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
faces from the pack's `tokens.json`, and `film:review` never printed a report it
had not written this run (0033 later allows one that is provably about this film).
`film:review --gate` was **PASS**: audit 32 events / 30 cues, 30/30 SFX,
`gate:7` **20 checks** with ASR then the one manual row — since automated —
269 tests, clean typecheck. `docs/decisions/0017` §Landed has the detail.

The **sound pass** ran three times. The first fixed what the sound critic's 6/10
named: the master's tail fade was inverted, cues were peak-normalised (so the
softest was the loudest), materials rang under 200 Hz where a phone cannot move
air, a `crowd` repeat machine-gunned, the fixture's cues were typed near their
events instead of bound to them, and the master was a normaliser rather than one
gain and a true-peak limiter.

The second pass measured instead of listening and found three fixes aimed at the
wrong quantity. Cue level moved from whole-cue RMS to the **loudest 50 ms**
(`CUE_LOUD`), because RMS normalisation drove a decaying hit's peak into the
limiter and `gain` stopped being its level; `checkCueSet` compares **all pairs**
of a kind; silences became contract surface; the generator's `rise()` attack
removes clicks; the master's reported reduction was a `volumedetect` clamp and
now comes from `ebur128=peak=true`, with a **100 ms window distribution** beside
the peak so one sample is not read as the whole film; the bus has a
`PREMASTER_CEILING` (−1 dBFS) headroom stage; and `gate:7` has a `master` row.

The third pass closed what the sound critic (7/10, no sign) and the QA critic
(6.5/10, no sign) named. **The duck is the declared duck**: the sidechain used the
film's global peak, so an 8 dB declaration arrived as 2.6 dB; it is now a
presence gate on a **local reference**, and the mix report names the depth each
cue actually got. **A cue's gain is its level again**: the resonant bandpass that
cost 1–3.4 dB inside the band is two unity edges, and the bus re-levels each cue
to `CUE_LOUD · gain` (0.00 dB drift). **Silence is measured on the master**
(≤ −50 dBFS), and a silence with narration through it or a cue ringing into it is
an error; unscored events carry their own `quiet` reason. **The tail is a measured
slope** to ≤ −60 dBFS. **`npm run deliver`** muxes the master into the frozen
picture without re-encoding it, measures the *delivered file's* loudness and true
peak (AAC overshoots: −1.9 dBTP master → −0.6 dBTP file), brings the file inside
−1.5 dBTP with a **peak limiter on the encode** — never a gain, because 1.1 dB of
gain took the film to −15.3 LUFS — and records the measurement in `deliver.json`
and the manifest. `gate:7` reads it as `deliveredAudio`. The gate also stopped
passing on missing evidence: the `master` row no longer defaults a missing
`limiterWindows` to 1, the `palette` row is tied to the video **and to clipping on
every frame**, `scoreAudit` requires the audit to name the current score, and
`inputsHashed` re-hashes the score, the generated page data, the backend and the
painter. **The render owns
the manifest**: `render:film` writes it, `audit:frames` refuses a video it does not
describe, `deliver` refuses a picture it does not describe, and the gate re-hashes
the files the render named. **The page's data is regenerated, not trusted**: the
renderer paints from `films/<id>/score-data.js`, so `src/engine/score-data.ts` is
the one implementation of it and the `scoreData` gate row rebuilds it from the
score and compares bytes — Understudy had shipped one stale, and no report could
see it because no report was about that file. **Picture and container are two
hashes**: `videoHash`
is sha256 over the video stream, so
re-cutting audio does not invalidate a frame audit, and determinism must describe
the picture the film ships — the twin sample now carries the manifest's
`videoHash` instead of painting the film twice (0032).
Understudy: −14.1 LUFS / −1.9 dBTP, gain +6.6 dB, 6.8 dB off the loudest sample,
**median window 0.02 dB**; delivered **−14.4 LUFS / −1.9 dBTP**. A narration
leveller was built, measured and **reverted** — it lowered integrated loudness
more than it raised it, and the measurement is in the decision record so nobody
rebuilds it. Still open and named in `docs/STATUS.md`: no music, narration ending
at 19.5 s, and a mono field. The word times and ASR are no longer open: local
Whisper `small.en` produced `source: "asr"` word times for both films, and
`npm run asr` passes on the master.

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
