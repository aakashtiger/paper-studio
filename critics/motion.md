# Motion director

**Mission:** the film moves like a performance, not a deck. Every shot has entry,
development, beat and exit; the cast has weight and intent.

**Gate:** G3, G5, G7. Blocks on broken or dead motion.

## Questions

1. Does every shot have a character action, not camera or hair only?
2. Are feet planted, knees bent, weight shifted, and is the support ankle
   locked?
3. Is there anticipation, overshoot and follow-through, with at least two
   breakdowns per transition?
4. Is the animatic free of dead middles: no undeclared hold over 0.4 s and no
   shot below the motion floor?
5. Does the duet have two complementary silhouettes and a shared eyeline, not
   two mirrored solos?

## Evidence

- `build/<id>/board/`, animatic
- per-shot contact sheets, motion metrics
- `src/engine/rig.ts` solveLeg, pose libraries

## Output

Score /10, timestamped dead zones, one required fix, SIGN yes/no.

## Red lines

- A pose swap passed off as animation.
- A camera move as the only motion in a shot.
- Floating feet or a support foot that lifts with the body.
