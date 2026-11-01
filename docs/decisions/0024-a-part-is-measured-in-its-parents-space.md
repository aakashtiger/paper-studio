# 0024 — A part is measured in the space of the thing it hangs from

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`scripts/rig-audit.ts`, `src/engine/rig.ts`)
**Found by:** `audit:rig` refusing the accepted cut with 18 findings, all one part

## Context

`audit:rig` check 5 exists for a real defect: a body part drawn **outside** the
transform it hangs from. The long hair was once drawn at the rig root, so it kept
the upright head's place and read as a second, detached head the moment a
character bowed — every still that looked at the head alone passed.

The check published three anchors per character (`chest`, `head`, `hair`) and
required **all three to hold a fixed place in chest space**. For the chest and the
head pivot that is right: a neck pivot that slides against the chest is a seam.

For the hair it is not. The hair is drawn *inside the head's transform*, so a head
that turns 30° carries the hair through 30° of arc:

- hair hangs 56 units above the neck pivot, in a film drawn through a 1.65 camera
  zoom, so the arc is ~92 device units of radius;
- a head drop of 0.11 rad per 0.1 s is ~6 units of chest-space motion per sample;
- the seam tolerance is 1.5 units per 0.1 s.

So the check could not tell *a head turning* from *a part coming off*. It passed
every earlier cut only because nothing had turned the head that fast: the numbers
sat under the tolerance. The `Same Alarm` s07 restructure — a declared hold and a
real head drop, which is what took that shot from 0.597 to 0.754 motion — turned
the head at 6–8° per 0.1 s and produced 18 findings on a rig that was correct.

The proof that the rig was correct came from the probe, not from an argument.
Across eight frames of the beat (37.6–39.3 s), the hair's position **in head
space** is `(0.00, −518.00)` in every single frame — it is rigid inside the head —
while its position in chest space travels an arc. `build/hair-check.mjs` is that
measurement.

## Decision

**Each anchor is held still in the space of the part it hangs from**, declared
once:

```ts
export const ANCHOR_SPACE = { head: "chest", hair: "head" };
```

The chest is the root, so a part with no entry is measured against the chest.
`anchorsInSpace()` in `src/engine/rig.ts` is the single implementation;
`scripts/rig-audit.ts` calls it instead of unplacing every anchor against the
chest.

This is the check's **stated purpose restored**, not relaxed: measured in head
space, the hair anchor is a constant of the rig *if and only if* the hair is drawn
inside the head's transform. That is exactly the defect the number is for.

### The proof it still bites

`test/rig.test.ts` carries three cases built from the film's own numbers (56-unit
radius, 1.65 zoom, neck pivot at −462, hair at −518):

| case | old rule | new rule |
|---|---|---|
| correct rig, head turns 17° in 0.1 s | **16.74 units** — fails | 0 (< 1e-9) |
| hair drawn at the rig root (the real defect) | 16.74 — fails | 16.74 — **fails** |
| head pivot sliding 4 units against the chest | 4 — fails | 4 — **fails** |

The first row is the false positive; rows two and three are the defects, and both
still fail. The 16.74 computed by the test is the same number the audit measured
on the film to two digits, which is why the test is a miniature of the finding and
not a story about it.

## What this does not change

- **The fit threshold.** 1.5 units per 0.1 s is untouched, so a part that drifts
  inside its parent still fails.
- **The cut/pose-key attribution.** A shift at a declared cut or pose key is still
  counted and reported rather than called a defect.
- **The picture.** No rendered pixel moves: nothing in the render path changed, the
  `videoHash` of the accepted cut stands, and the audit re-runs against the same
  delivered file.
