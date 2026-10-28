# QA/UAT review — first pass

**Verdict:** FAIL (narrow) at the time of review: the MP4 was valid, but the
committed evidence was stale and the proof was not deterministic.

## Evidence

- `hyperframes lint` 0/0; `hyperframes check` passed.
- MP4: H.264, 1920×1080, 30 fps, 450 frames, 15.000 s, silent.
- `hyperframes preview` is a real Studio server with a timeline, not a static
  page.
- Two snapshot runs had different hashes; cause: `Math.random()` in the grain
  texture. Pixel diff was small but real.

## Defects found

1. Stale snapshots: four of seven frames were from a bare sunburst.
2. `PAL.accent` was undefined, so the gold core fell back to paper.
3. The left performer’s blue boot disappeared against the blue floor.
4. The README said “from the repository root”; commands only work from `studio/`.

## Fixed

- Seeded grain: two fresh snapshot runs now produce identical SHA-256 hashes at
  all six sampled times.
- Gold core now uses `PAL.gold`.
- Left boot is red.
- Snapshots were regenerated after the final render; contact sheet updated.
- README commands now say `studio/`.

## Remaining for the S2 gate

- Plan-driven 15 s / 3-shot render.
- Production asset library.
- Deterministic frame check in CI, not only a local snapshot comparison.
