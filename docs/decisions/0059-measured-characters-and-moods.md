# 0059 — A character is a construction with measured proportions; a film is a mood

**Status:** accepted, 2026-11-05. This changes the identity schema, the cast
libraries and the proof. It does not change the Paper K-pop medium.

## What the proof exposed

0057 made the identity a construction rather than a fixed cast; 0058 made the
voice one level and the short shot 4.5 s. The 17.2 s proof still showed four
gaps that no check could see:

1. **A head was not measured.** The proof's mortals were seven heads tall in one
   file and the declared `visualHeadToBody` was 3.4–4.5. The rig, the library and
   the identity report disagreed, and nothing compared them. A character could
   change shape between films and still pass.
2. **A mood had no band.** `filmBands` was one absolute luma/saturation range.
   A blue night at luma 80 passed; a white snowfield at luma 190 would not, even
   though both are Paper K-pop. The band was a measurement of one reference,
   not a grammar for the channel.
3. **A pose could snap.** `visual:check` counted actions but not their spacing.
   Two pose events 0.1 s apart, or a shot that opened neutral and snapped into
   character at 1.4 s, both passed contract 3.
4. **Hands were not the cast's skin.** The floating hands in the proof were dark
   brown while every face was light tan. The viewer saw two different people.

## Decision

### Proportions are published and checked

- A pose library publishes `body.height`, `body.head` and the existing
  `body.hand` box. `visualHeadToBody` is the library's own measured doll ratio.
- `tokens.identity.cast.proportions` declares, **per construction archetype**, a
  `visualHeadToBody` band and a `handToHead` band.
- `style:identity` computes `body.height / body.head.h` and
  `body.hand.h / body.head.h` for every cast member and refuses a library whose
  drawn ratio is outside its declared band, a pack band that does not contain
  the drawn figure, a missing body measurement, or an archetype with no band.
- The Paper K-pop bands: `paper-human` 3.3–4.2 heads and hand 0.16–0.26 of the
  head; `paper-divine` 4.4–5.4 heads and hand 0.16–0.28. The proof's mortals are
  **3.70 heads**, the goddess **4.89**, both inside their bands.
- The mortal rig now draws a **2× head** (26% of the figure), a **24×35 hand**
  and thicker arms. The rig, the film-local library and the shared library all
  publish the same numbers; `audit:body` and `style:identity` read the same
  construction.

### A film declares a mood, the pack owns the bands

- `identity.filmBands.moods` may carry named bands; the score's `mood` selects
  one. The absolute band remains the fallback, so an old score still resolves.
- Paper K-pop declares `night`, `day`, `snow` and `mixed`. Night is 55–115 luma /
  12–38 sat / 7–18 edges; snow is 165–235 luma / 3–20 sat / 4–16 edges. A green
  grassland and a white snowfield are both legal; the palette-family audit still
  requires 5 hue families and 85% coverage.
- The proof declares `mood: "night"` and measures 78.8 / 22.2 / 10.7 on the
  delivered picture.

### A change must blend

- `identity.motion` declares `minPoseGapSeconds: 0.3` and
  `maxFirstPoseSeconds: 0.25`.
- `visual:check` refuses a staged character whose first pose lands after 0.25 s
  or whose consecutive pose changes are closer than 0.3 s
  (`visual:pose-continuity`). This is the floor; the painter still eases the
  actual body between poses (`blendAt`/`blendPose`), and the rig probe refuses a
  part that leaves its parent's transform.
- The proof's s01 child is in `watch` before the cut; s02 is a procedural walk
  cycle (the rig phases legs and arms from the clock, not from pose events);
  s03 rise→open; s04 the giving hand rises continuously with a lotus; s05
  hold→place; s06 hold→offer/accept.

### Hands are the cast's hands

- The floating hands in s01, s05 and s06 use the cast skin `#F0C9A4`, not a
  second, darker skin. A hand is a body part, not a prop.

### The palette row reports the family

- `audit:palette` prints the hue-family count and the top-family share, not the
  historical "worst outlier" (which was always zero). `gate:7` reads the same
  two numbers. The proof is **4 families, top 98.6%**.

## Evidence

`films/lakshmi-proof/` (17.2 s, 6 shots, 3 lines, 47 words):

- picture `sha256:ac4cb75f259f…` (the delivered file, current run)
- `gate:7` **PASS, 29 checks**; `film:review --gate --reuse` **PASS**
- 6/6 staged shots (stage-show), mood night, luma 78.9 / sat 22.2 / edges 10.8
- palette 4 hue families, top 98.6%, clipping 0.03%
- motion floor 6/6, longest hold 0.00 s; `inspect` motion/type/rig PASS
- ASR 97.9% (47/47; `rangoli` → `Rangali`)
- **519 tests**, typecheck clean

## Consequences

- Pre-0059 film scores with cast members but no `body.height`/`body.head` will
  fail `style:identity` if they are re-run; they are historical and are not
  re-rendered. New films must publish the measured boxes.
- The shared `Householder` and `Child` libraries are version **1.1.0**; `Child`
  is **1.2.0** with the `watch` pose. Their hashes and the film's asset hashes
  move together.
- The mood is a **film** declaration, not a scene declaration. A film that
  genuinely crosses day and night uses `mixed`; per-scene bands are still open.
