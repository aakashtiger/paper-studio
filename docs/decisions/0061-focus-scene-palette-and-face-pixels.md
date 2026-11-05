# 0061 — The focus has a floor, scenes have families, faces have pixels

**Status:** accepted, 2026-11-05. This closes the three follow-ups named by 0060.

## Focus-size floor

- A shot may declare `visual.focusAnchors` as `{ name, kind }`:
  - `object` — the name the recipe passes to `focusAnchor`;
  - `face` / `body` — the cast member's exact name.
- The pack owns a no-op `focusAnchor(ctx, name, x, y, w, h)`. The probe wraps it
  and records the **device-space** box through the painter's transform. The
  recipe passes the solid object, never its glow or shadow: the proof's diya
  box is `68 × 74` local, while the glow is `48` radius and is excluded.
- `collage` resolves the boxes into `frame-report.json`. A box is clipped to the
  frame; `shortSideShare = min(clipped width, clipped height) / min(frame width, frame height)`.
  A face uses the rig's `face` anchor; a body uses the existing aperture.
- `tokens.identity.composition.focus.minShortSide` is **0.10** (108 px at 1080).
  `style:identity` refuses a declared focus with no measured box or a box below
  the floor. The proof:
  - s01 `diya` — **12.8%**, pass
  - s01 `Child` face — **13.1%**, pass
- `visual:check` refuses a duplicate anchor, an empty list, a face/body that is
  not in the shot's cast, and an object whose name is not in the focus/device
  words.
- This is a **size** floor, not an occlusion proof. The box is the painter's
  claim; a large object can still be hidden by a hand. The one-sample-per-shot
  collage is not a whole-shot minimum; the video scene rows are full windows,
  but the focus box is still the sample's box.
- The collage report is tied to the current score and its file hash
  (`collageHash`); the identity report refuses a stale collage, and the gate
  re-hashes it. The video report copies the collage focus box by design, so that
  copy is only as fresh as the hash.

## Per-scene palette families

- `src/engine/palette.ts` owns the one family rule: 12 hue bins, `SAT_MIN 0.3`,
  five families, 85% coverage. `hueFamilyStats` is used by the film-level and
  scene-level audits; there is no second palette arithmetic.
- `sceneFrameMap` assigns each decoded frame to a shot's scene through half-open
  `[from, to)` spans, so a frame on a cut belongs to exactly one shot.
- `audit:palette` accumulates the same hue bins per scene in the existing
  decode loop and writes `scenePalette`. A scene with no frames fails; any
  unassigned frame fails; the film-level numbers are unchanged.
- The proof:
  - sc01 — **4 families / 99.1%**, 177 frames
  - sc02 — **3 / 99.5%**, 222 frames
  - sc03 — **2 / 99.9%**, 117 frames
  - film — **4 / 98.6%**, clipping 0.03%
- The policy is read from `tokens.identity.palette`; the report carries
  `paletteCode` (the hash of `src/engine/palette.ts`) and the effective policy.
  `gate:7` checks both. The review chain now runs `audit:palette` as a
  picture-tied step, so `--gate --reuse` can reuse it by the delivered hash.
- `gate:7` ties the scene section to the current score, `scenesHash` and the
  palette code; an old report without it fails and is re-run.

## Face-pixel audit

- The paint probe samples the face box in **face-local space** after each
  `drawCharacter`: an 8×8 grid over the inner face window
  `u ∈ [-0.85, 0.85]`, `v ∈ [-0.72, 0.95]`. The inverse matrix removes camera
  and head motion; a hand crossing the window is visible in the report rather
  than silently averaged away.
- `audit:face` finds consecutive different expression events in a shot, takes
  the sample before the blend and at the event, and requires:
  - the strongest-cell delta above `max(0.02, 1.5 × post-hold noise)`;
  - at least 3 changed cells;
  - at least one in-between sample;
  - no one-frame step carrying 85% of the signal.
- The proof has two real changes (the other expression events are openings or
  same-name repeats):
  - s03 `awe → kind` — signal **0.115**, 15 cells, 3 in-between, max step 0.077
  - s04 `blessing → giving` — signal **0.128**, 12 cells, 3 in-between, max step 0.055
- The top-level report is `pass` only when **every** change has `changedCells`
  at least the floor and its own `pass`; a high delta confined to two cells is
  `face:changed-cells`, not a pass.
- `inspect` now paints one probe and runs motion, type, rig and face from it.
  `render:film` refuses a whole-film paint without a passing face report.
  `gate:7` has a **thirtieth** row, `faceMotion`, tied to the score, the probe
  file hash and the probe source hash. `film:review --gate --reuse` prints it.

## Evidence

`films/lakshmi-proof/` (17.2 s, 6 shots, 3 lines, 47 words):

- picture `sha256:a35472f3def7…` (delivered)
- `gate:7` **PASS, 30 checks**; `film:review --gate --reuse` **PASS**
- focus 12.8% / 13.1%; scene palette 4/99.1, 3/99.5, 2/99.9
- face 2/2 measured, 0 findings
- **539 tests**, typecheck clean

## Still open

- The focus box is a painter claim; occlusion is not measured. A future
  multi-sample focus audit is the honest extension.
- The face audit has no direct picture hash: it paints probe frames, like the
  type and rig audits. A delivered-video face mode would need looser thresholds
  for compression.
- `focusAnchors` is optional; a shot can omit it. Making it film-wide is a
  visual-contract change, not this one.
