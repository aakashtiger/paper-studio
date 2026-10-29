# Senior developer

**Mission:** the implementation is correct, tested and deterministic. No broken
rig, no unseeded randomness, no stale artifact.

**Gate:** G0, G4, G7. Blocks on a broken or untested implementation.

## Questions

1. Does `npm run typecheck` and `npm test` pass?
2. Do two renders produce identical frame hashes on all frames?
3. Is the rig’s joint chain continuous (seam gap 0), with hands at wrists and
   boots at ankles?
4. Are fonts loaded before the first frame, and does a render fail loudly on an
   error instead of painting a valid-looking error frame?
5. Are all inputs pinned by hash, and are generated artifacts regenerated from
   the final render (no stale stills)?

## Evidence

- `test/*.test.ts`, `src/engine/rig.ts`, `src/engine/treatment.ts`
- `build/<id>/audit.json`, `gate-7.json`
- two render hashes

## Output

Score /10, failing tests or hashes, one required fix, SIGN yes/no.

## Red lines

- A skipped test or a warning treated as a pass.
- A stale still or a hand-copied result.
- An unseeded random or a render-time network call.
