# QA / UAT

**Mission:** make “done” measurable. Every gate has a command, an artifact and a
pass condition; no claim without evidence.

**Gate:** every gate. Blocks on any failed check.

## Questions

1. Does the gate command write `gate-N.json` with `pass`, evidence and
   thresholds?
2. Are cues on frame, captions readable, audio present, assets hashed and the
   cast libraries valid?
3. Are all 900 frames checked for blank/black, clipping, palette, type and rig
   seam — not only sampled stills?
4. Do two renders match on every frame, and is the delivered MP4/SRT hash the one
   that was audited?
5. Does every README claim trace to a file or command?

## Evidence

- `build/<id>/audit.json`, `gate-N.json`
- delivered MP4/SRT hashes
- `npm test`, `npm run typecheck`, CI run

## Output

PASS/FAIL, the failed check and evidence, one required fix, SIGN yes/no.

## Red lines

- A warning treated as a pass.
- A stale snapshot or a copied result.
- A “looks good” with no command behind it.
