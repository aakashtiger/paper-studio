# 0025 — A film is written before it is shot

**Status:** accepted · 2 Nov 2026
**Owners:** shared (`src/engine/**` contract, `films/**` authored)
**Supersedes:** the part of 0017 that treated the `score.json` shot list as the first authored artifact

## Context

*Same Alarm* was delivered, gated, and rejected by the person it was made for in
four sentences:

> no story · very slow to nil movement · rig was kind of broken, hands specially
> · sound effects were just not there, it was continuous hissing, hardly any
> narration

All four are true, and all four are visible in the artifacts before a frame is
painted:

| the note | the number | where it was knowable |
|---|---|---|
| no story | 10 shots, no turn: alarm → walk → desk → boss → desk → desk → desk → alarm | the shot list itself |
| hardly any narration | 7 lines, **21 words**, 17.8 s of speech in 60 s, then 16.4 s of nothing | the narration file, before voice |
| continuous hissing | the master sits at **−15.2 LUFS in its gaps** vs −13.8 in speech — one `sfx-room` cue **58.9 s** long | the cue list, before the mix |
| slow to nil movement | **10 shots, 6.0 s average** (4.0–7.5 s) | the shot list itself |

The film still passed **21 gate checks**. That is not a paradox: every one of
those checks measures the film that exists, and none of them can say whether the
film that *should* exist was written. A production can be perfectly executed
against a script that has nothing in it, and that is what happened.

The **tooling** for the missing steps existed — `board`, `storyboard`, `strips`,
the pose sheet, six audits. What did not exist is the **order**: nothing refused
to render a film whose script had twenty-one words, whose shots averaged six
seconds, or whose sound never stops. Commands that run are not a process.

## Decision

One film is four authored documents, each smaller than the last, and each one is
checked against the one above it **before the next is written**. The engine
refuses to advance while a stage is red.

```
idea
 1  story.json    the script: spine, tone, pace, every narrated line, in seconds
 2  beats.json    the turns: purpose, energy, share of the film, what it sounds like
     ↓  narration is generated here — voice captured, word times measured
 3  scenes.json   where it happens, who is in it, which lines it carries
 4  score.json    the shots: framing, camera move, staging, motion, cues, timing
     ↓  the collage: one frame per shot + the character/pose sheet, approved
 5  assets        derived from the shots: recipes, cast, props, type
 6  render, mix, deliver, gate
```

### Why narration is made at stage 2 and the shots at stage 4

The narration is the clock. It is generated once the writing and the beat map are
settled, because the delivery decides how long a line really is — and the scenes
and shots are cut to the **measured** word times, not to a guess. A line that
runs 0.4 s long moves one shot, not the film. This is also why scenes and shots
come after the voice rather than beside it: the film is cut to what was said.

A song film says the same thing with a lyric and follows the identical order; the
lyric's syllables play the part of words.

### The two numbers a style owns

These are declared in the film's `story.json` `pace` block today and belong in
the style pack (`tokens.json`) in the next pack version — rule 7, the engine must
not own a tempo any more than it owns a palette.

| rule | value | why this value |
|---|---|---|
| **median shot length** | **2.5 s**, band 2.5–3.0 | what a Short or a Reel in this idiom actually cuts at. A minute at six seconds a shot is a slideshow, and the film that taught us this measured exactly 6.0. |
| **narration density** | **140–150 words per minute** | a narrated short has no holes in it. The film that taught us this had 21 words in 60 s — 21 wpm. |

Both are *bands*, not targets, and the film declares which band it is in so that
a different style may declare a different one without touching the engine.

### What each stage refuses

A refusal is an error, not a warning. These are in `src/engine/story.ts` today:

| code | refuses |
|---|---|
| `story:wpm` | narration inside 140–150 wpm for the film's length |
| `story:silent` | a film with no narration and no song |
| `story:orphan` / `story:beat-empty` | a line on a beat that does not exist, or a beat with nothing said in it |
| `story:turn` | a beat map with no turn, or two |
| `story:hook` / `story:button` | a film that does not open on a hook or land on a button |
| `story:flat` | an energy curve that never lifts or drops (span < 2 of 4) |
| `story:share` | beats that do not add up to the film |
| `story:balance` | **a beat that owns more time than it has words for** — the 16.4 s hole, as an error |
| `story:air` | **a film where no beat is allowed to be quiet** — the 58.9 s noise bed, as an error |
| `story:must-say` | a promised phrase the film never says |
| `story:id` | a story and a beat map that are not the same film |

Stages 3–6 add their own, and they are the ones that make the *rest* of the day
cheap:

- **scenes**: every scene has a beat, a place, and the lines it carries; every
  line is in exactly one scene; a scene's declared duration matches the measured
  narration inside it (± 0.3 s).
- **shots**: median shot length inside the declared band; every shot names the
  scene and beat it belongs to and **one reason it exists**; no shot longer than
  2× the median; every beat's signature sound is realised by at least one cue;
  every shot's staging uses only assets declared in the manifest.
- **collage**: every shot rendered as a still through its real recipe and cast;
  the character/pose sheet beside it; **approved by the client** in a written
  seal, which the renderer refuses to proceed without. One page, one look, before
  the expensive step — this is the step that was skipped, and it is the one that
  would have shown a plank arm in ten seconds.
- **assets**: derived from the shots, never written first; a prop is an asset with
  a declared size, and a chair wider than the man in it is an error.
- **sound**: no bed over the whole film; the quietest 3 s sits ≥ 15 LU under the
  loudest 3 s, measured on the delivered file.

### Ordering is the speed

The sixteen-hour day was not sixteen hours of work; it was nine full renders, of
which seven were cuts a cheap check had already rejected. Every one of the checks
above costs under a second and sits **before** the render. The target is 30–60
minutes end to end, and the way there is this document: a film that cannot pass
stage 1 does not reach stage 6.

Parallel painting (0023) is already measured — 4 workers, 60/60 frames
byte-identical — and takes the picture from ~33 min to ~10. The rest of the gap
is the ordering, not the machine.

## What this does not change

- **`score.json` stays the render contract.** The score is stage 4, not a fifth
  document; the renderer, the audits and the gate keep reading it.
- **The four documents are checked for agreement, not compiled into each other.**
  A compiler would silently invent the missing half of a disagreement. A check
  names it.
- **No new dependency.** Zod, as everywhere else.

## Landed

- `src/engine/story.ts` — `StorySchema`, `BeatsSchema`, `checkStory()`, pure.
- `scripts/story.ts` — `npm run story -- films/<id>/story.json`, prints the spine,
  the beats with their seconds, energy and sound, the narration with per-line
  seconds, and the time/word balance; writes `build/<id>/story-report.json`.
- `fixtures/story-min/` — a 30 s film written to the rules: 70 words, 5 beats,
  one quiet turn, a button. The model for the next film.
- `test/story.test.ts` — 12 cases, one per refusal. The film that shipped is a
  test: *21 words in a minute is refused*, *a beat that owns time but says
  nothing is refused*, *a film scored wall to wall is refused*.

**Next, in order:** scenes, shots, the collage seal, assets-from-shots, the
sound-air row, and `film:new` scaffolding all four documents so a new film cannot
start at the shot list.
