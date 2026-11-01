# 0027 — The collage checks itself

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/collage.ts`, `scripts/collage.ts`)
**Depends on:** 0025 (a film is written before it is shot), 0026 (checks run before the render)

## Context

Two things were true at the same time, and they contradicted each other:

1. Decision 0025 made the collage a hard stop: one page of every shot, looked at
   before the expensive step, because that is the step *Same Alarm* skipped —
   the page that would have shown a plank arm in ten seconds.
2. The user's answer to the proposal to seal it by hand was: **"no manual
   approval — the point of this tool being built is that it provides an end to
   end video from one idea."**

A stop that needs a signature is a stop a solo creator cannot use at 2 a.m., and
a tool that demands one has not been automated — it has been gated by its owner.
So the stop has to be a verdict the machine reaches by itself.

The `storyboard` command already painted exactly the right pictures — one frame
per shot, in order, through the same painter — and checked only that the files
existed. It could not say that a frame was blank, that two shots were the same
picture, or that a character the score staged was never drawn.

## Decision

**`npm run collage -- <score>` paints one frame per shot, inspects the frames it
painted, writes the page and a verdict, and `render:film` refuses a whole film
without a passing verdict for the same score.** No approval is typed by anyone.
The page is still written — a person can look at one image and see the film — but
the pass is the tool's claim about what it can measure, not a signature standing
in for what it cannot.

What the machine checks, and why each one is a defect with a film behind it:

| code | refuses | the film it comes from |
|---|---|---|
| `collage:missing` | a shot with no frame | a shot that was listed and never painted |
| `collage:blank` | a frame that is one flat colour (luminance spread < 2 and < 8 colours over a 32×18 sample) | a recipe that drew nothing |
| `collage:duplicate` | two shots with the same PNG hash | a shot reused instead of staged — the "same beat ten times" defect, as pixels |
| `collage:cast` | a character the score stages that the frame did not draw | a character dropped by staging |
| `collage:text` | a text box painted off the frame | a word off the edge |
| `collage:crowd` (warning) | text closer than 3% of the frame to its edge | the type audit holds the real margin; this only names crowding |

The cast check reads the **paint probe**, not the score: the renderer instruments
the page's rig helper and records every character it actually drew, so "the frame
painted without them" is measured from the picture, and a rig that silently
declines to draw a character cannot pass by being declared.

## What it deliberately does not claim

That the film is good. A machine cannot see that an arm is a plank. The collage
does not replace judgment — it makes the *mechanical* half of review automatic,
so the human half is spent on one page instead of nine rounds of fifteen stills.

On the delivered film the page reads exactly as the viewer described it: ten
frames, nine of them the same desk, the alarm twice, and in `s01` and `s08` a blue
plank with a pebble on the end of it. The verdict passes, because every shot is
present, drawn, distinct and cast-correct. The *page* is what tells the truth
about the arm.

## Cost

Ten frames, one page: **~30 s**, against the day's nine rounds of fifteen
separate stills (~2 h). The frames stay on disk at full resolution, so a tile that
looks wrong is opened, not guessed at.

## Landed

- `src/engine/collage.ts` — pure `checkCollage()`, `flatness()`,
  `BLANK_STDDEV`, `BLANK_COLOURS`, `TEXT_CROWD`.
- `scripts/collage.ts` — `npm run collage -- <score.json> [--at] [--tile] [--cols]`;
  paints via `render-film --stills --probe`, hashes and samples each PNG with
  ffmpeg, writes `build/<id>/collage/collage.png` and `build/<id>/collage.json`
  (with the score's sha256).
- `scripts/render-film.ts` — `requireCollage()`, beside `requirePreflight()`, for
  whole-film paints only.
- `scripts/film-chain.mjs` — `sheet` and `collage` run after `preflight` and
  before the first render.
- `test/collage.test.ts` — 8 cases, one per refusal.
