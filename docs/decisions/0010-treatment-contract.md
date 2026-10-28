# 0010 — The treatment is the creative input

**Status:** accepted for S2
**Date:** 2026-10-28

## Context

The S2 paper proof is authored scenes. `scenes.js` hardcodes shot ids, copy,
timings and camera moves. That proves the look can move, but it does not prove
the workflow the product needs: a detailed script and shot sheet arrive *before*
anything is rendered, and the renderer consumes them instead of inventing them.

The resolver already has a style contract (`capabilities.json`, `recipes/`) and a
wedding planner (`src/engine/plan.ts`). Neither carries a film's creative
direction.

## Decision

Add a **treatment**: one authored JSON file per film.

```ts
type Treatment = {
  id: string;
  style: string;
  styleVersion: string;
  aspect: string;
  fps: number;
  duration: number;
  seed: string | number;
  proof?: boolean;
  shots: {
    recipe: string;
    duration: number;
    slots: Record<string, string>;
    camera?: { move: string; from: number; to: number; ease: string };
    motion?: { beat?: string; note: string };
    transitionOut?: string;
  }[];
};
```

`resolveTreatment` (`src/engine/treatment.ts`) checks it against the pack:

- the style id and version match `capabilities.identity`;
- the aspect is in `limits.aspects`;
- the duration is a declared format duration unless `proof: true`;
- every recipe exists and is a declared proof frame (warning if not);
- every shot duration is inside the recipe's `min`–`max` (a proof gets a warning
  instead of an error, and the warning is printed);
- every required recipe slot is present, no slot exceeds `maxWords`;
- the transition is one of `cut, iris, wipe, hold, match_cut`;
- the shot durations sum to the treatment duration.

The output is a resolved plan with absolute starts, frames and defaults filled
from the recipe.

## What this does not decide

- Geometry, palette, fonts and shot choreography stay in the style pack.
- A treatment narrows the pack; it cannot invent a recipe, a colour or a font.
- The renderer that consumes the resolved plan is still to be built. The paper
  proof is authored scenes; `proofs/s2-paper/plan.json` is the contract it will
  be migrated onto.

## Command

```bash
npm run treatment -- proofs/s2-paper/plan.json
```

Exit code 1 on any error; warnings print to stderr and do not fail the run.
