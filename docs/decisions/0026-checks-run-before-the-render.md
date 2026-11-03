# 0026 — Checks run before the render, and the renderer refuses without them

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/preflight.ts`, `scripts/`)
**Depends on:** 0023 (parallel paint), 0025 (a film is written before it is shot)

## Context

The day that produced *Same Alarm* painted the whole film **nine times**. Two of
those films are the delivered cut. Seven were cuts that an inspector rejected, or
duplicates run to prove an edit was harmless. The record of what each refusal
cost is in `docs/RETRO-same-alarm.md`:

| refused because | cost | how long the check that would have caught it takes |
|---|---|---|
| scene 6 was a still photograph (motion 0.533 vs 0.6) | one render, 70 min | a 4-second strip, 12 min |
| 111 locked knees, 78 ankles in the air | one render, 81 min | `test/cast-rig.test.ts`, **0.2 s** |
| scene 7 was a still photograph (0.597) | one render, 72 min | a 4-second strip, 20 min |
| the score contradicted itself (a `quiet` event with a cue bound to it) | one render, ~69 min | `npm run audit`, **0.4 s** |

Every check was correct. Every one of them ran **after** the expensive step. The
unit suite that already knew about the locked knees had been in the repository
the whole time; nothing ran it before painting, so its knowledge was worth
exactly as much as a comment.

The second lesson is from the delivered film itself. *Same Alarm* passed **21
gate checks** and was rejected in four sentences. Every row of that gate measures
the film that exists. None of them can say that the film which *should* exist was
never written — 10 shots averaging 6.0 s, 26 words of narration in 60 s, a
17.0 s hole, one 58.9 s room bed under all of it.

## Decision

**One command, `npm run preflight -- films/<id>/score.json`, answers every
question that can be answered from the film's own documents, in about a second,
and writes `build/<id>/preflight.json`.** `scripts/render-film.ts` refuses to
paint a **whole film** without a report that is both passing and about *this*
score (it carries the score's sha256). Probes — `--stills`, `--from/--to` — are
not films and are not gated; they are the cheap instruments the day actually
needed.

The report refuses, with the numbers a viewer uses:

| check | code | refuses |
|---|---|---|
| writing | `story:missing` and every `story:*` from `checkStory()` | a film that begins at the shot list — unless it is a **reproduction** (it already has a delivered file), which is recorded as a warning |
| cut | `pacing:median` | a median shot outside the declared band, and says how many shots the band wants |
| cut | `pacing:long` | a shot longer than 2× the median, by name |
| voice | `narration:wpm` | words a minute outside the declared band |
| voice | `narration:hole` | more than 2.5 s with no narration, and where it starts |
| voice | `narration:coverage` | a narrated film that speaks for less than half of itself |
| sound | `sound:bed` | any single cue owning more than a quarter of the film |
| cast | `cast:rig` / `cast:poses` | a rig the film's own vendor does not register, or a cast member with no pose library |

Measured on the rejected film, from its own score through the same resolver the
renderer uses:

```
shots     10 · median 6.3s · 4–7.5s
narration 7 lines · 26 words · 26 wpm · speaks 23% · longest hole 17.0s at 38.8s
sound     35 cues · longest 58.9s (98%) "sfx-room"
```

Five refusals, and the whole command takes **0.9 s** instead of the 70 minutes
each of those defects used to cost.

### Where the two bands come from

A style owns its tempo. The order is the film's own `story.json` `pace` block,
then the style pack's `tokens.json` `pace` (not yet declared by any pack), then
`DEFAULT_PACE` - 2.5-3.0 s median and 180-190 wpm (0043; 140-150 historically),
the numbers this idiom is cut at. The report names which of the three it used, because a number that decides a
refusal must not be anonymous.

### The legacy films are refused, on purpose

`films/same-alarm/score.json` and `films/understudy/score.json` both fail this
gate with five refusals each — the same five, because *Understudy* is the fixture
whose defects *Same Alarm* inherited: a 28.5 s room bed, 29 words in 30 s, a
10.5 s hole, a median shot outside the band. `npm run film:chain` on either of
them now stops at `preflight`, and that is the honest outcome: the chain means
"make a film", and a film that could not be written to the rules cannot be
painted by this repository any more. Reproducing a delivered film is a different
act, and `render:film` still performs it — it just will not do it blind.

## What this does not change

- No new dependency, no network, no new measurement of a rendered frame.
- The existing audits keep their jobs. Preflight asks the *writing*; the audits
  ask the *picture*, and both are needed because they catch different lies.
- The score is still the render contract (0025).

## Landed

- `src/engine/preflight.ts` — pure `preflightFilm()` plus `median()`,
  `longestHole()`, `DEFAULT_PACE`, `MAX_CUE_SHARE`, `LONGEST_SHOT_FACTOR`,
  `NARRATION_HOLE_MAX`, `NARRATION_COVERAGE_MIN`.
- `scripts/preflight.ts` — `npm run preflight -- <score.json>`; resolves the film,
  reads the story and beats if present, gathers the cast facts (pose files, vendor
  rig registrations), writes `build/<id>/preflight.json` with the score's hash.
- `scripts/render-film.ts` — `requirePreflight()` before the browser starts.
- `scripts/film-chain.mjs` — `preflight` runs after the audit and before the
  first render.
- `test/preflight.test.ts` — 11 cases, including the delivered film refused for
  the four things its viewer said, and a film written to the band passing.

**Next:** the scenes and shots contracts (stage 3–4), the collage that inspects
itself, and assets derived from the shots — then the render-time wins (movement
probe, draft preview, background reuse).
