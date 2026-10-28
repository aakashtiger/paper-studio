# Architect review — S2 proof v0

**Verdict:** one-engine + style-backends is the right direction; this proof is
not that architecture yet. It is a Paper K-pop renderer with copied primitives
and hand-authored scenes.

## Blockers

1. **No boundary.** `vendor/core.js`, `type.js`, `characters.js`, `props.js`,
   `scene_kit.js` are copies of the source paper renderer. They hardcode the
   paper palette, 88 BPM grid and paper type. Watercolor cannot reuse them.
2. **Creative direction is still in code.** `scenes.js` hardcodes
   `open/sticker/stage`; it does not read a plan or a treatment.
3. **Plan gap.** The resolver plan omits composition ops, camera from/to/ease,
   effects, vertical maps, motion and asset bindings. A renderer has to re-read
   the pack and invent the bindings.
4. **No treatment contract.** `CREATIVE.md` is prose; there is no typed motion
   sheet or beat grid in the plan.
5. **Determinism.** `grainCanvas` used `Math.random()`.

## Fixed in this pass

- Seeded grain; two snapshot runs now hash identically.
- The proof is explicitly labelled authored scenes, not plan-driven.
- The creative direction is written down in `CREATIVE.md` as the input model.

## Still open

- Engine/style backend split.
- Plan + treatment contract.
- Port the paper backend into `studio/src/engine`; add watercolor as a backend.
- Keep HyperFrames as preview/render host, not as the engine.

## Next 3 steps

1. Freeze a minimal plan/treatment contract (shots, ops, camera, motion notes,
   duration validation).
2. Port the engine boundary; render this same 15 s from the plan.
3. Add watercolor recipes under the same engine; do not add another pack first.
