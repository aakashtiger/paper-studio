# 0030 — The front door writes the whole film

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/film-new.ts`, `scripts/film-new.ts`)
**Depends on:** 0025 (a film is written before it is shot), 0026 (checks run before the render)

## Context

Decision 0025 says a film is written in order — story, beats, then scenes and
shots — and `preflight` refuses a film that begins at its shot list unless it is
a reproduction. That refusal works: *Same Alarm* is refused for it today.

But the front door still offered only the last document. `npm run film:new`
wrote `score.json` and nothing else, so the **only** way to start a film with the
tool was to scaffold a shot list — the exact shape 0025 refuses. The order was
enforced at the gate and ignored at the door, which left the editor to invent the
two files by hand from a decision record. A rule that lives only in a document is
a rule the next person contradicts.

## Decision

**`npm run film:new` writes all the documents a film is made of, in the order it
is made of them: `story.json`, then `beats.json`, then `score.json`.** Every one
of them is a scaffold with nothing invented, and the command then fails with the
precise list of what is missing in each.

| document | what the scaffold carries | what it refuses to write |
|---|---|---|
| `story.json` | id, duration, and the **pace band** the film will be judged against (the style's, else the default) | title, audience, tone, logline, all four spine sentences, every narration line |
| `beats.json` | id | every beat: title, purpose, share, energy, sound world, signature sound |
| `score.json` | everything it already wrote: identity, style, aspect, duration, fps, seed, brief path | the edit envelope, the clock, the audio, the copy, the assets, the shots |

The pace band is the one creative-shaped fact the scaffold states, and it does so
because decision 0026 made that band the thing a film is refused against: a band
that lives only inside a check is a number nobody can see. Writing it into the
story makes it a stated fact of the film — and it is the band `preflight` would
have assumed anyway, so declaring it changes no verdict.

### A scaffold is a state of the work, not an error

`preflight` used to `StorySchema.parse()` the two files, so a scaffold produced a
zod path (`title: String must contain at least 1 character(s)`) and a stack. It
now `safeParse`s them and reports:

```
FAIL  [story] story.json is not a story yet — title: String must contain at least 1 character(s)
              (8 field(s) to fill; see `npm run film:new`)
FAIL  [story] beats.json is not a beat map yet — beats: Array must contain at least 1 element(s)
              (1 field(s) to fill)
```

Three sentences a director can act on, and the rest of the preflight still runs.

## What this does not change

- `film:new` still invents nothing, and still exits non-zero while anything is
  missing. It is a front door, not a generator.
- The score remains the render contract. `story.json` and `beats.json` are
  contracts for the *writing*, checked by `checkStory` (0025) and `checkCut`.
- **Scenes are still derived, not authored.** Decision 0025's "four documents"
  is three files plus the scenes `preflight` prints from the cut: a contiguous
  run of shots serving one beat cannot disagree with the shots, which is the
  whole reason it is not a fourth file to keep in sync.

## Landed

- `src/engine/film-new.ts` — `storySkeleton()`, `beatsSkeleton()`, `storyGaps()`
  beside `filmSkeleton()` / `filmGaps()`; the pace comes from the style's
  `tokens.json` or the default band.
- `scripts/film-new.ts` — writes the three documents into `--out` (default
  `films/<id>/`), refuses to overwrite without `--force`, and prints the order to
  write them in and the gaps in each.
- `scripts/preflight.ts` — a story or beat map that is not yet legal is a
  refusal with a sentence (`story:invalid`, `beats:invalid`), not an exception.
- `test/film-new.test.ts` — 10 cases, including the guarantee that `storyGaps` is
  **silent** on `fixtures/story-min` (the one film written to the rules), so the
  scaffold's checklist and the written film agree.
