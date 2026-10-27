# Questions — Rooftop Soundcheck

The pack leaves these open. I have not answered `paper-shadow` for the director.

## The open choice

1. **paper-shadow.** Collage or Print? Collage gives every cut layer a soft contact shadow and a visible cut edge; Print keeps the plates flat and leaves only the type's hard offset. Which is this film — the open sun and burst (shot 1), the portrait window and lyric band (shot 3), the wide stage and both performers (shot 4), the sticker bed (shot 5), the diorama (shot 6)? Do not answer on the director's behalf.
2. **Collage type.** Under Collage, does the soft contact shadow sit under the type and the lyric band as well as under the paper pieces? The card's Collage panel shows the type with a cream outline and a soft shadow, while Print shows the fixed hard offset; which type treatment is canonical?
3. **Print edge.** Under Print, is the cream cut lip alone enough to read the edge at 390 px in shot 4's wide stage and shot 6's diorama, with no contact shadow?
4. **The generic shadow op.** `type_stack` and `sticker_slam` each carry `effect kind: "shadow"` with no target, placed above the type in z-order. Is that the fixed type shadow, or a paper contact shadow that would pre-decide `paper-shadow`? The governance says recipes name only the type shadow, and the renderer adds paper shadow only under Collage.

## Palette and evidence

5. **Palette.** The pack defaults to day-stage; this cut names night-stage (older cream, deeper ink, oxblood, ink blue, acid, pink accent). Confirm night-stage, or should the rooftop be day-stage?
6. **Reference frames.** `macro-prop` shows more than four colour plates, and `chorus-stage` shows four performers. Are they evidence of material and formation only, with the four-colour and two-cast rules still binding?

## Content and cast

7. **Second performer.** The brief has one `names` slot, but the two-cast shot needs a second performer. Can the second stay unnamed, or does the brief need a second name?
8. **Venue and set.** The pack does not read `content.venue` and has no rooftop or skyline set. Is the subtitle plus the stage, open sun and diorama cutaway enough to carry "The Fold, rooftop"?
9. **Lyric band.** The band reads `content.caption`, not a lyric. Is an original non-lyric line allowed in the band, or must it carry a cleared lyric?
10. **Close object.** `pullback_close` uses `prop.object`, but the brief has no prop slot. May the director choose the small object (a paper cup) without a brief field?

## Timing and 9:16

11. **Resolver remainder.** The resolver shares the remainder by capacity in whole milliseconds but does not say how the final remainder is rounded or which shot gets the extra millisecond. Is the resolver's output authoritative over the plan split?
12. **Beat quantisation.** S2 quantises cuts to the 88 BPM grid with a 0.21 s offset, but the pack gives no tolerance for the 1.2 s minimum or the 5.5 s maximum after quantisation. Which bound wins if a cut lands outside the range?
13. **9:16 nested insets.** `aspectRules.9:16` gives a 0.04 inset for the sun core and 0.06 for the sticker on its torn bed, but the 16:9 recipes place the core at roughly 0.23–0.39 and the sticker at roughly 0.09–0.23 relative to their parents. Which values govern the 9:16 re-stage?
14. **9:16 type and boxes.** May display type shrink below 56 px to auto-fit a long line, and what is the floor? The caption box and monogram box overlap in x and y; which moves if a shot uses both?
15. **Meter.** The meter is a black sticker with an acid readout, but the pack gives no text format, and the card's phone shows an acid "88" sticker instead. Which is canonical, and what does the meter read?

## Sound and rights

16. **Sound and voice.** No audio is supplied. Who clears the track, confirms it is 88 BPM, and owns the optional voice line? There is no clearance field in the brief.
