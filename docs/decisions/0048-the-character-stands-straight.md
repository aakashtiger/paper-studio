# 0048 — The character stands straight, and every pose and face is its own

**Status:** accepted · 4 Nov 2026
**Owners:** creative (`films/same-alarm/vendor/office.js`, `library/characters/**`), shared (`src/engine/pose.ts`, `src/engine/sheet.ts`)
**Depends on:** 0038 (the character library), 0024 (the rig), 0046 (the body audit)

## Context

The library sheet showed four defects the earlier sheet had hidden:

1. **The legs bent outward like a frog.** The office hip was 258 above the feet
   while the leg was 273 long. The 15 units of slack became a 16° bend in the
   flat 2D solver, which swings the knee sideways by ~60 px. Every standing pose
   had it.
2. **The left arm was almost invisible.** The far arm was drawn at ±38 while the
   shirt is 72 wide; its sleeve was behind the torso with only a sliver showing.
3. **Poses repeated.** `idle`, `look`, `wake` and `type` differed by a few
   numbers; three of them read as the same silhouette.
4. **Expressions repeated.** The library stored `open/brow/lookX/lookY`, but the
   office rig reads `eyes/browLift/look/mouth`. The sheet's own mapper only knew
   the four-number vocabulary, so 14 names drew about 5 faces.

## Decision

- **The hip is 281 and the ankle target is −8.** 281 − 8 = 273 = the leg
  (156 + 117), so a planted foot stands straight; the shoe (drawn 8 below the
  ankle) lands on the ground. A bent knee in this flat rig is a lifted foot, not
  a standing default.
- **The far arm is five units further out** (`−43` worker, `−45` supervisor),
  so its sleeve has a silhouette instead of hiding behind the shirt.
- **The office rig has a face vocabulary**: `dot`, `wide`, `closed`, `happy`,
  `half`, `squint`, `blank`, `glance`; mouths `flat`, `smile`, `o`, `O`,
  `wobble`, `frown`, `smirk`, `grit`; `browTilt` for worried/angry brows; a
  `tear`. The library expressions carry explicit `eyes`/`mouth`/`browLift`/
  `browTilt`/`look`/`tear` values, and both the film painter and the sheet pass
  them through. The old four-number fallback still works.
- **The 8 poses are authored as 8 silhouettes**, not 8 names: idle, asleep,
  wake (arms up), reach, type (elbows in), slump, walk (leg angles, no IK), look
  (hand to brow). Vaz keeps his own names (enter, point, turn, crossed, nod,
  leave, listen) because Same Alarm's score names them.
- **`resolvePoseLibrary` refuses two poses with the same body and two
  expressions with the same face**, even under different names. `library:check`
  is the command; the sheet is the visual proof.
- **The Kiran body metadata is corrected** from the `characters.js` worker
  (104/88, 22×32) to the office rig that actually draws her (92/78, 18×26,
  thumb 8×12).

## Measured

- `npm run library:sheet`: Kiran and Vaz, 8 poses and 14 expressions each; the
  legs stand straight, the left sleeve is visible, and the 14 faces are
  different shapes (tired closed, alarm wide/o, laugh happy/grin, cry
  closed/wobble + tear, angry squint/frown, shocked wide/O, sad half/frown,
  suspicious glance/smirk, relieved happy/smile, confused dot/wobble,
  determined squint/grit, bored half/flat).
- `npm run audit:body`: Kiran and Vaz **18×26** hand, **8×12** thumb, 8 poses,
  **pass**.
- `test/cast-rig.test.ts`: every library foot target reaches the ground at its
  own bounce; every planted sole touches the ground and none passes through it.
- `test/contracts.test.ts`: a copied pose body and a copied expression face are
  refused.
- **465 tests**, typecheck clean.

## What this does not do

- **The film's old cast copies are not rewritten.** Same Alarm's
  `films/same-alarm/cast/*.poses.json` keep their old foot targets, so its
  delivered picture is unchanged except for the office-rig hash. New films use
  the library files.
- **The walk is a stylised paper stride**, not a true 3D walk. The flat solver
  cannot bend a knee toward camera; the walk pose uses leg angles and lifts the
  feet instead of swinging the knees sideways.
- **The sheet's `pose_similar` warning still uses a loose 0.12 distance.** The
  hard duplicate rule is exact body equality; two merely close poses warn but do
  not fail.
