# Questions — Last Soundcheck

## The open choice: `paper-shadow`

**1. Collage or Print?** I have not chosen, and the treatment is written to hold under either. The choice changes the paper contact shadows, not the cut edge or the fixed type shadow.

- **Collage:** the acid sun and accent core lift off the card in shot 1; the red title card lifts in shot 2; both figures cast onto the stage in shot 3; the paper window casts onto the portrait in shot 4; the sticker lifts off its torn bed in shot 5; the diorama layers gain depth in shot 6. The cut edge stays visible.
- **Print:** those layers sit flush; only the type carries the hard ink shadow. Shot 5 reads as a printed sticker on a torn strip, not a lifted object; shot 6 reads as a flat cut-away. The cut edge still separates the layers.

Which reading does the director want?

**2. Under Collage, does the type card also take a contact shadow?** The pack says every layer gets a contact shadow and, separately, that type always carries a hard ink shadow. If both apply, the type may show a hard shadow plus a soft contact shadow. Is that intended, or does type stay on the fixed shadow only?

**3. Does the contact shadow follow the top-left key in the 9:16 re-stage?** The 9:16 cast is more frontal; does the shadow vector stay top-left, or re-anchor to the new stage? The pack fixes the key direction but not a per-aspect shadow vector.

**4. How soft is Collage's contact shadow before it reads as gloss?** `tokens.medium.light` gives softness 0.5 and opacity 0.2; the style refuses soft studio light and gloss. Is that the contract, or should the contact shadow be tighter?

**5. Is the printed HUD exempt from Collage's contact shadow?** The lyric band, meter sticker and corner marks are printed HUD, but the layer order includes HUD. Does every layer's contact shadow include the HUD, or does "printed, not floating" keep it flush in both choices?

## Pack defects and ambiguities

**6. `portrait_iris` shared `lyric` box order (defect).** `caption-line` and `lyric-band` both map to `lyric`. The vertical array lists the caption first and the band second, but the band is the background (z7) and the caption is the foreground (z8). Under `aspectRules.9:16` ("the later op is nested inside the earlier op"), the band would nest inside the smaller caption, which inverts the HUD and cannot preserve the band's larger 16:9 box. Should the band be the parent, with the two entries swapped? I cannot edit the sealed pack.

**7. `sticker_slam` sticker fill (gap).** `body-slam` is fixed to paper, but `prop.paper-sticker` has no colour role. I assign the sticker ink so the paper line reads. Is that the intended fill, or should the sticker be red or accent with the body a different role? A paper sticker would erase the line.

**8. `stage_wide` is the only two-cast recipe and declares only `list`.** Is a two-cast formation a list beat? The pack's example maps `formation` to `list`, so the format follows it; but if the director wants the two-cast rig on a portrait or open beat, the pack has no recipe. Is `list` the intended home for the formation?

**9. The six-shot route is forced by the grammar.** Open, title, formation, portrait, quote and close are the six recipes that carry the required grammar; repeating one reuses its composition and slot values. Is that the intended route choice, or should the blind application allow a seventh shot or a different role sequence? The pack's own decision says the six-shot route sits near the 5.5 s ceiling.

**10. `caption` is overloaded.** It is the lyric band, the stage lower-third and the macro caption. For this film it is the venue line, "The Fold, rooftop". If the director wants an original vocal line in the band, the same line will appear as the stage lower-third. Which job should `caption` do? Is an event caption acceptable in the lyric band?

**11. `body` is overloaded.** It is the title-card body, the stage lower-third, the sticker quote and the close line. "Live at moonrise" fits all four at display/body scale. If the director wants a separate hook and CTA, the pack cannot. Which single line should carry all four?

**12. Brief shape and the dead slots.** The pack reads only six content slots; `date`, `venue`, `hashtag`, `rsvp` and `photos.*` are in the schema but ignored. I wrote a brief with only the six read slots and put the venue in `caption`. Does the lead's schema check accept that, or must the brief carry the full shape even though the pack ignores the extra fields?

**13. Uncredited foil and the gate.** The pack allows an uncredited foil in `stage_wide`, but `content.names` credits only Vera Lune. Does the lead's cast check accept a visible second performer without a second credit, or must the credit string name both?

**14. The type shadow offset is not quantified.** The pack says one fixed offset down-right but gives no value; the card uses 3×3, 4×4 and 7×8 in different places. Which is the contract at 390 px and at 9:16? If the card is evidence only, the treatment cannot specify the geometry.

**15. The 9:16 delivery raster and frame rate are not specified.** The pack gives 9:16 boxes and 30 s but no output raster or fps. Is delivery 1080×1920 at 30 fps, or another raster?

**16. 88 BPM quantisation versus the 30.000 s plan.** 30.000 s is exactly 44 beats at 88 BPM, but the documented allocation gives 4.968/4.855/5.161/4.968/4.855/5.193, which are not beat multiples. Which 44-beat map should S2 use? The nearest is 7/7/8/7/7/8. Does the 0.21 s offset put the first cut at 0.21 s and the last at 30.21 s, or is it a phase within 30 s?

**17. Loudness.** I include "-14 LUFS" as optional metadata. Is that the intended delivery target, or should the Short follow a platform spec? The pack says loudness belongs to the format but gives no number.

**18. Seed.** Which seed should the lead use? The pack's example uses 42; the brief and format have no seed slot, and fibre, torn edge, halftone phase, sticker rotation, grain, type jitter and camera phase are seeded. Is 42 the house seed?

**19. Audio and voice clearance.** Who supplies the cleared 88 BPM track and the one vocal chop? The pack supplies no audio and the brief has no audio slot. Is the track a placeholder for the artist's cleared master, or is the film silent in this phase?

**20. Title line break.** "Last Soundcheck" at 9:16 display 56: does it break as "Last / Soundcheck" (two lines, auto-fit) or "Last / Sound / Check" (three lines, keeps 56)? The pack says display breaks where the paper would cut, but gives no rule for a long word. The two-line version may auto-fit below 56.

**21. The venue's look.** The Fold, rooftop: is The Fold a folded-paper architecture, a club, or just the roof? I staged a folded card roof edge and a paper city; the pack does not describe the venue. Is that the right read?

**22. The second cast's identity.** Is the foil a mirror double, a bandmate or a witness? I staged a mirror-cut double in the same costume so the two-cast rig reads as a doubling, not a second artist. The pack allows a foil but does not define the relationship.
