# 0028 — A shot is measured before it is painted, not after

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/motion.ts`, `scripts/motion-probe.ts`)
**Depends on:** 0023 (a frame is pure · render in parallel), 0026 (checks run before the render)

## Context

Three of the nine renders that produced *Same Alarm* were spent on the same
defect: a shot that did not move.

| the report said | what it cost | what would have said it |
|---|---|---|
| "scene 6 is a still photograph" — motion 0.533 against a 0.6 floor | one full render, 70 min | twelve frames of shot 6 |
| "scene 7 is a still photograph" — motion 0.597 | one full render, 72 min | twelve frames of shot 7 |
| the same, again, from a viewer | a third paint | the same twelve frames |

`npm run audit:motion` measures this correctly and is not the problem: it reads
the **delivered** picture frame by frame, which is the right measurement for the
final gate and useless before a render — it needs the film to exist. The film
that does not move cannot be caught by the instrument that reads the film.

What was missing is the cheap question. A shot that is a still photograph is a
photograph from its first frame to its last; you do not need the film to know
that, you need two pictures of the shot.

## Decision

**`npm run probe:motion -- <score>` paints a short window inside every shot
through the film's real painter and measures, per shot, how far it travels from
its first sampled frame to its last. A shot under `STILL_TRAVEL` (0.5) is
refused; a shot under `WEAK_TRAVEL` (1.5) is named as weak.**

`scripts/render-film.ts` refuses a **whole-film** paint without a passing
movement report for the same score (it carries the score's sha256, like
preflight and the collage). Probes (`--stills`, `--from/--to`) stay ungated, as
before: a stills pass is the instrument, not the film.

### How it measures without decoding anything

The paint probe already returns a coarse **48×27 RGB sample** of every frame it
draws — added in this change to `drawFrame`, only while the probe is attached,
so the film render pays nothing for it. Three numbers per shot:

- `mean` — the mean absolute channel difference between consecutive frames;
- `peak` — the largest single step;
- `travel` — the mean absolute channel difference between the **first and last**
  sample.

`travel` is the one that decides. A still photograph scores ~0 however long it
sits there; a slow push still scores above zero because the whole frame drifts.
It is deliberately coarse: it answers *did anything change at all*, not *is the
motion good*. The delivered film's ten shots score 11.56–31.13, so the 0.5 floor
has an order of magnitude of headroom against a real edit and only a genuinely
frozen shot lands under it.

### Cost, measured

Same-alarm, 10 shots, 15 frames each — **150 frames in 50 s** at the stills
default of four workers (`stillWorkers()` = explicit `--workers` or
`min(4, cores/2)`). That is one to one-and-a-half minutes against the 70–72
minutes a single missed still shot cost. The stills pass got the same
parallelism as the film render in this change; on 40 frames it went from 43.5 s
serial to 19.2 s, and **40/40 frames were byte-identical**, so a parallel stills
pass is the same picture as a serial one.

## What this does not change

- `audit:motion` keeps its job on the delivered film. The probe asks "will this
  move?"; the audit asks "did it move, frame by frame, at the floor?".
- No new dependency, no network, no LLM in the render path.
- Two gates now sit on the same cheap instrument. That is the shape of the next
  change — one stills pass feeding movement, type and rig in a single
  inspection — and this module is the first column of it.

## Landed

- `src/engine/motion.ts` — pure `motionOf()`, `checkMotion()`, `STILL_TRAVEL`,
  `WEAK_TRAVEL`; refusals `motion:still`, `motion:unmeasured`, warning
  `motion:weak`.
- `scripts/motion-probe.ts` — `npm run probe:motion -- <score.json> [--step] [--max]`;
  paints a window inside every shot via `render-film --stills --probe`, writes
  `build/<id>/motion-probe/motion-probe.json` with the score's sha256.
- `scripts/render-film.ts` — `requireMotion()` beside `requirePreflight()` and
  `requireCollage()`; `drawFrame()` returns the coarse sample; `stills` passes
  are painted across `stillWorkers()` browsers with `splitEven()`.
- `scripts/film-chain.mjs` — `probe:motion` runs after `preflight`, before the
  collage and the first render.
- `test/motion.test.ts` — 6 cases: a frozen shot, a moving shot, a barely-moving
  shot, frames outside every shot, fewer than two frames, and the boundary frame
  belonging to the next shot.
