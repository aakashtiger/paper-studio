# 0035 — The four documents are four, and the voice is the clock

**Status:** accepted · 2 Nov 2026
**Owners:** shared (`src/engine/**` contract, `films/**` authored)
**Implements:** 0025, which described this order but only shipped two of its four documents

## Context

Decision 0025 said a film is written as four documents, each checked against the
one above it:

```
idea
 1  story.json    spine, tone, pace, every narrated line
 2  beats.json    purpose, energy, share, what it sounds like
     -> narration is generated here
 3  scenes.json   place, cast, what happens, which lines it carries
 4  score.json    shots: framing, camera, staging, motion, cues
 5  assets        derived from the shots
```

The repository shipped stages 1, 2 and 4. Stage 3 did not exist: no schema, no
command, no check ever read `scenes.json`, while `story.ts` and `film:new` both
*printed* that it was the next document. Scenes were derived from the shots —
the reverse of the order — so the shot list was free to invent the film's shape.
`film:new` wrote three files and told the director to write a fourth that nothing
read.

Two more claims in 0025 were not enforced:

- **narration is generated at stage 2 and the cut follows it.** `npm run voice`
  existed, was not in the chain, read the *score's* clock lines rather than
  `story.json`, and wrote a **proposal** (`derived, not applied: edit the score
  to accept a moved boundary`). A person retyped times.
- **staging uses only assets declared in the manifest.** Assets were a
  hand-written list, checked for their own paths and hashes. Nothing checked
  that the cast the shots stage had a character asset at all.

And the two documents that did exist could disagree: nothing compared
`story.json`'s narration with the score's `clock.lines`, so a film could speak a
line the story never wrote.

## Decision

### 1. `scenes.json` is an authored document (stage 3)

`src/engine/scenes.ts` defines it:

```json
{ "id": "film", "scenes": [
  { "id": "sc01", "beat": "b01", "title": "the alarm",
    "place": "a bedroom before dawn",
    "summary": "A man silences the same alarm he has silenced for a decade.",
    "cast": ["Kiran"], "lines": ["v01"], "duration": 5.55 }
]}
```

`checkScenes()` refuses, before a shot exists:

| code | refuses |
|---|---|
| `scene:orphan` | a scene on a beat that does not exist |
| `scene:beat-empty` | a beat with no scene |
| `scene:line-unknown` / `scene:line-beat` | a line that is not in the story, or is on another beat |
| `scene:line-twice` / `scene:line-unplaced` | a line in two scenes, or in none |
| `scene:short` | a scene shorter than the words spoken in it |
| `scene:air` | a scene carrying more than one narration hole (2.5 s) of air beyond its words, unless its beat is declared quiet |
| `scene:lead` | a measured first line starting more than 1 s after its scene begins |
| `scene:total` | scenes that do not cover the film |
| `scene:cast` | a name that is not in the film's cast |

`film:new` now writes **story → beats → scenes → score**, and `sceneGaps` names
every missing field in the new document.

### 2. Shots answer scenes

`score.json` shots gain an optional `scene` field. When `scenes.json` exists,
`checkCut()` refuses a shot with no scene (`cut:scene-unbound`), a scene with no
shot (`cut:scene-empty`), a shot whose beat is not its scene's beat
(`cut:scene-beat`), and a scene whose declared seconds are not its shots'
seconds (`cut:scene-duration`).

### 3. The story and the score say the same words

`checkNarrationSync()` compares `story.json`'s narration with the score's
`clock.lines` by id and text. A line missing from either, said twice, or changed
between the two is a refusal (`story:score-missing`, `story:score-line`,
`story:score-text`). Preflight runs it.

### 4. The measured read is the clock — `voice --apply`

`npm run voice` now:

- judges the clock on the **measured word times** from `words.json`, not on a
  rise found near the authored time. The old scan looked in a window around the
  score's time, so *Same Alarm*'s first line — actually 0.27 s early — read as
  `+0.04 s` and passed;
- with `--apply`, moves the score's line starts to the measured times, extends a
  line only when the read runs **past** its window (never shortens an authored
  hold), moves captions inside their line's new window, and moves shot
  boundaries within 0.35 s of a phrase beat;
- **validates the result before writing it** (`FilmScoreSchema` + `resolveFilm`),
  so a refused application cannot leave a half-timed score on disk;
- writes nothing when no value changes, so a re-run cannot move a hash for
  nothing.

The chain runs `voice --apply` before `audit` and `preflight`, but only for a
film that has `scenes.json`. A legacy film (no scenes) is a reproduction: its
picture was cut to the old clock, and the chain must not rewrite it on every run.

### 5. The cast has assets

`assets[]` entries of type `character` may declare `character`. Preflight, when
the film has authored scenes, refuses a cast member with no character asset
(`cast:asset`). Legacy films are not retro-fitted. `filmGaps` names the missing
asset for a new score.

### 6. A narrated short speaks immediately

Preflight refuses a first line that starts more than **1 s** in
(`narration:start`). The reference reads open on frame 1–4; one second is the
outside of a visual hook that still has the voice in it.

## Measured

- **408 tests** pass (from 388): 12 scene cases, 6 preflight cases, 3 front-door
  cases, plus the existing suite. Typecheck clean.
- `film:new` on `films/understudy/brief.json` wrote four files and named the
  scenes gap: `scenes: at least one scene (id, beat, title, place, summary,
  duration, lines)`.
- `voice` on *Same Alarm* without `--apply` now says **FAILED on 3 line(s)**:
  v01 starts at 0.53 s, not 0.80 (−0.27); v02 at 6.54, not 6.40 (+0.14); v06 at
  37.72, not 37.50 (+0.22). The old check said **kept**.
- `voice --apply` on the same film applied **6 line starts and 5 captions, 0
  shot boundaries**, validated, and exited 0. The film was then reverted: it is
  a legacy reproduction, not a new cut.
- `preflight` on *Same Alarm* still refuses it with the same five defects
  (median 6.3 s, 26 wpm, 17.0 s hole, 23% coverage, a 58.9 s cue at 98%).
- `films/` is clean; no new dependency.

## What this does **not** do, and is named

- **The script is not generated from the idea.** `film:new` scaffolds and
  refuses; a person (or an LLM directed by one) writes the story, beats and
  scenes. "One idea in, one film out" is not automated.
- **Narration is still spoken from the score, not from `story.json` alone.** The
  text is proved identical by `checkNarrationSync`, but the order is story →
  beats → scenes → score → voice, not story → beats → voice → scenes → score.
  A `voice --story` mode is the next step if the user wants the literal order.
- **Scenes are checked against the read, not rewritten by it.** `voice --apply`
  moves line and shot times; a scene whose duration no longer fits is refused
  and must be re-authored. Auto-fitting scenes would be inventing.
- **Props and sets are not derived from shot slots.** Cast coverage is enforced;
  a house, a desk or a phone in `slots` is not yet mapped to an asset.
- **Song films are not implemented.** `story.song` is a marker; there is no
  lyric or syllable clock.
- **No arm/hand audit.** The office rig was fixed by hand (elbow, brad, cuff,
  hand) but nothing refuses a new film's plank arm.
- **No reference style bible or side-by-side look loop.** The pack has tokens
  and a card; it does not measure 20 reference shorts into numbers.
- **No visual-reaction-to-word check.** Events carry their own `t`; they are not
  bound to the word they illustrate.
- **Backgrounds are not cached within a scene.**
- **The motion floor is not a viewer unit** (0.6 units, not seconds or
  centimetres).
