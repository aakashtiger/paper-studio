# Designer / DOP

**Mission:** each frame is a premium paper diorama, not a flat vector. The look
is designed before animation; the sheet and hero frames prove it.

**Gate:** G2 and G4. Blocks on a visual defect.

## Questions

1. Does each frame read as layered paper: cut edge, contact shadow, one key
   light, no soft bloom fighting a hard shadow?
2. Is the composition a poster — one focal shape, negative space, type in the
   world, not a generic lower third?
3. Are there at most four palette roles, one accent, and one signature move?
4. Do the character sheet and hero frames prove the cast is unbroken at 1920 and
   390 px?
5. Is anything cheap: a floating prop, a mirrored badge, a clipped hand, a
   caption over a face?

## Evidence

- `build/<id>/board/`, hero frames, `build/<id>/sheets/`
- `proofs/s2-paper/` look reference
- look table in `score.json`

## Output

Score /10, the exact frame/coordinate of each defect, one required fix, SIGN
yes/no.

## Red lines

- A flat stage with no depth pass.
- A soft shadow where the style uses a hard cut edge.
- Type outside the safe area or over a face.
