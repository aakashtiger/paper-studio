# 0011 — Rig and asset quality: how a 9/10 is held

**Status:** accepted for S2
**Date:** 2026-10-28

## Why this decision exists

The first paper proof looked designed but the cast was broken: hands floated a
hand-width from the sleeves, boots missed the ankles, and one arm stayed still
while the torso leaned. It was not a taste problem. It was four rig defects:

1. `limb()` returned `x + sin(ang)*len` while it drew the capsule at
   `x - sin(ang)*len`. Every joint after the first segment was mirrored, so the
   forearm, hand, shin and boot were placed on the wrong side of their joint.
2. The far arm was drawn outside the torso lean group, so it did not follow the
   shoulders; the near arm did.
3. The arm root was at `-512` while the shoulder eyelet was at `-516`.
4. Poses had been authored against the broken chain, so their sign convention
   was inverted; every limb crossed inward.

The fix is in `proofs/s2-paper/vendor/characters.js`; the geometry contract is
now `src/engine/rig.ts` and `test/rig.test.ts`.

## The rule

A paper puppet is an **asset**, not a drawing routine that each scene calls
with ad-hoc numbers. It has a fixed construction, fixed proportions, a named
anchor set and a pose library. A scene may choose a pose; it may not invent an
arm.

### Rig invariants (hard)

- One continuous chain per limb: shoulder → elbow → wrist → hand, hip → knee →
  ankle → boot.
- A joint is exactly the end of the previous segment; the seam is covered by an
  eyelet, not left open.
- A hand is drawn at the wrist anchor; a boot is drawn at the ankle anchor.
- A limb that hangs from the torso inherits the torso's lean, head and shoulders.
- The feet carry a contact shadow at the sole; the character never hovers.
- Poses are clamped: elbows and knees cannot fold through the body.

`chainSeamGap(chain) === 0` is the assertion. `test/rig.test.ts` proves the
geometry and the sign; a future renderer that imports `resolveChain` cannot
silently mirror a limb again.

### Asset library (per style)

- `character.lead`, `character.second`: construction, proportions, wardrobe
  roles, anchor set. No per-shot colour literals.
- A pose sheet per character: at least 8 counts, both feet planted, hair and
  skirt lag authored as offsets, not left to the scene.
- Props and sets expose named anchors (`sticker centre`, `stage floor`,
  `sunburst centre`) so a shot places them by anchor, not by guess.
- A character-sheet render (every character × every pose, 1:1 crop) is reviewed
  before any shot is animated.

### Per-shot QA (hard gates)

Every shot render is checked for:

1. **Rig**: no floating part, no joint gap, both feet planted, contact shadow.
2. **Frame**: no clipping at the edge unless deliberate and marked; title and
   body inside the safe area.
3. **Palette**: at most four colour roles per frame.
4. **Type**: eight words per content slot, no overflow, contrast checked.
5. **Depth**: every layer drifts by 2–6 px with the camera; no single-plate shot.
6. **Motion**: no hold longer than 0.7 s without a beat event.
7. **Determinism**: two snapshot runs hash-identical.

A shot that fails 1 or 2 is not reviewable as "good"; it is broken.

### What 9/10 means, and how it stays there

Score against anchors, not mood:

- **9 — production**: a viewer cannot find a broken joint, a floating prop, a
  cropped line or a dead hold in a normal viewing pass. The cast reads as one
  coherent paper world. Motion has weight and intent.
- **10 — reference**: indistinguishable from the source film at the same
  duration, including choreography, camera language and sound.
- **7 — designed**: the frames are strong but the cast or the motion has a
  visible weakness on inspection.

Consistency comes from the gates above, not from a better critic. Once a shot
passes the rig, frame, palette, type, depth, motion and determinism checks, it
can only be judged on direction. That is the only part that should vary.

## Known gap

The proof's `vendor/characters.js` is a copy of the source renderer. The source
`Y:\NewVideoTest\src\characters.js` still has the mirrored joint and the far-arm
defect. When the engine is ported, it must consume `src/engine/rig.ts`; the two
must not drift. The pose tables in `scenes.js` are the first draft of the pose
library, not the library itself.
