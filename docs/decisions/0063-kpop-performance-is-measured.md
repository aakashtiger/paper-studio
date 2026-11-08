# 0063 — The KPOP performance gate is measured, not authored

**Date:** 6 Nov 2026
**Status:** accepted
**Scope:** `proofs/kpop-test/`, `scripts/quality-check.mjs`,
`studio/docs/references/kpop-system-spec.md`,
`studio/docs/references/kpop-9-10-rubric.md`

## Context

The 25 s KPOP test had a ten-check gate. Nine checks read a file the renderer
or a measurement tool wrote. The performance check read `performance.json`, a
table written by the author. It said every shot had 3–4 poses and 2 gestures.

The picture said otherwise. The 30 fps every-2nd-frame sheets showed s7 as a
T-pose, s6 as a lineup behind a curtain, and s3/s4 as arms-out dolls. The table
could not fail because the author was the one claiming the poses. A gate that
reads its own opinion is not a gate.

## Decision

1. **The renderer records the cast.** `nova()`, `mira()` and `backup()` push
   `who, x, y, s, pose, face` into `window.KPOP_CAST` from the same call that
   paints the character. `render-test.mjs --measure` paints every frame and
   writes `measured.json`.
2. **The gate computes the performance from that record.** Per shot:
   - **poses** — five samples across the shot, bucketed at 0.2 rad;
   - **changes** — transitions between those samples;
   - **gestures** — hand travel > 28 px over 0.16 s, by forward kinematics;
   - **faces** — distinct eye/mouth pairs;
   - **face px** — the drawn head width at the shot's scale;
   - **longest still** — the longest span under 0.2 rad/s;
   - **T-pose** — both arms near horizontal with elbows under 0.35 rad.

   A shot fails on <3 poses, <2 changes, no gesture, <2 faces, a still run over
   1.2 s, a T-pose, or a lead face under 90 px (audience POV excepted).
3. **`performance.json` is deleted.** The gate never reads a hand-written
   performance table again.
4. **`poseAt` holds, then moves.** It inserts a hold key 0.32 s before each
   event. Without the hold key the rig drifted across the whole shot and read as
   a statue sliding; with it the body is still, changes on the word, and holds.

## Consequences

The new gate **fails the picture that shipped before this pass**: s1 had no
gesture and a 3.67 s still, s5 had no gesture, s8 had 2 poses, s9 had no gesture
and a 2.63 s still. After the performance pass the test reads:

| shot | poses | changes | gestures | faces | face px | longest still |
|---|---:|---:|---:|---:|---:|---:|
| s1 | 5 | 4 | 3 | 3 | 132 | 0.70 s |
| s2 | 4 | 3 | 2 | 3 | 126 | 0.50 s |
| s3 | 5 | 4 | 2 | 3 | 108 | 1.07 s |
| s4 | 3 | 2 | 1 | 3 | 134 | 1.13 s |
| s5 | 3 | 2 | 2 | 3 | 186 | 0.67 s |
| s6 | 5 | 4 | 4 | 3 | 154 | 0.63 s |
| s7 | 5 | 4 | 2 | 2 | 156 | 0.37 s |
| s8 | 5 | 4 | 2 | 2 | 123 | 0.63 s |
| s9 | 4 | 4 | 4 | 3 | 138 | 1.03 s |

The gate is **10/10**; the self-score is **9/10**. The remaining point is the
**drawing** — a flat torso, stick legs and simple hands — not the timing. The
gate does not measure drawing quality, and this decision does not pretend it
does. It measures the two failures that were being hidden: a T-pose and a still
shot.

## What this does not solve

- The gate measures what the rig was **told** to draw, not what the pixels show.
  The frame-diff and the reviewed sheets are the pixel evidence.
- A pose can be distinct and still be a bad pose. The T-pose check is one named
  bad pose, not a classifier for all of them.
- The drawing gap is named in the report and the rubric; it is not a check.
