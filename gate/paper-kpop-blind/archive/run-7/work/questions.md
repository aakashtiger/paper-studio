# Questions — Rooftop Fold

The pack fixes the grammar; these are the decisions it leaves open. No answer is assumed, and the `paper-shadow` choice is not made here.

## Open choice: `paper-shadow`

1. **Collage or Print?** The pack leaves this undecided. The route is designed to hold under either option; the difference is depth, not layout.
2. **What Collage would do to this route.** Every paper layer gains a soft contact shadow (tokens: softness 0.5, opacity 0.2) and keeps the visible cut edge. Shot 3's portrait and window, shot 5's torn bed and sticker, and shot 6's diorama gain separation; the film reads as a diorama.
3. **What Print would do to this route.** Layers stay flat, and only the type keeps its hard offset ink shadow. Shot 5's sticker sits flush and shot 6's diorama reads as a flat cutaway; the film reads as a printed poster. The cut edge remains, but there is no contact shadow.
4. **Does the choice reach the HUD?** Are the lyric band, the meter sticker and the corner marks printed flat under both options, or do they lift with the paper under Collage?
5. **Does the choice reach the effects?** Do the fibre, halftone and grain overlays cast or receive shadows, or is the choice confined to the layer stack?
6. **What happens to the dark ink line under the cut edge under Print?** The style promises a cream lip and a dark ink line. Is that line part of the cut edge (kept) or part of the contact shadow (dropped)?
7. **Are `medium.light.softness` 0.5 and `opacity` 0.2 Collage-only?** The tokens give the values, but the pack does not say they are ignored under Print.

## Content and performance

8. **Palette sign-off.** The treatment names `night-stage`. Is that approved, or does the director want the default `day-stage`? The choice changes the paper stock and makes the accent pink rather than gold.
9. **Second performer.** `stage_wide` needs two cast members, but the brief has one `names` value and no second name. Is the second an unnamed foil, a bandmate, or a named performer? I staged an unnamed foil with no extra content slot.
10. **Venue in a read slot.** `content.venue` is not read by the pack. I put "The Fold, rooftop" in `content.caption` so it appears. Is that acceptable, or should the caption carry an original line and the venue stay metadata?
11. **Is the caption a lyric?** The HUD is called a lyric band, but `content.caption` is a brief slot and the pack does not require a lyric. My line is a place line, not a lyric. Does the director want an original lyric line instead? No third-party lyrics are used.
12. **Track title and clearance.** I invented "Nine Flights to the Roof" for `content.subtitle`. Is that the track title, and is it cleared as original? Who supplies the music and the optional voice line?
13. **Loudness and delivery.** The pack says delivery loudness belongs to the format, but the format schema has no loudness field. Where is the target recorded?
14. **Date, hashtag, RSVP.** These are in the brief but not read by the pack. Should any appear on screen? If so, which read slot absorbs them, and do they stay within eight words?
15. **HUD meter.** `stage_wide` carries a black sticker meter with an acid readout. What should it read? The pack says beat and palette, not a second paragraph. Is the readout generated from tokens, or does it need a brief value?
16. **End line.** `content.body` is one value across the title card, stage lower third, sticker and close. It is "One roof, one take." Is that the close line, or should it be a CTA/RSVP line? There is no second body slot.

## Motion and timing

17. **88 BPM offset.** Does the 0.21 s offset set the first downbeat at 00:00.210, or is it an offset applied to the music track? Which beat does shot 1 start on?
18. **Type drop and sticker slam.** `type_stack` and `sticker_slam` declare static cameras, while the style's native moves are a stacked type drop and a sticker slam. Where are the entrance beats, squash and anticipation authored — in the recipe, in S2, or missing? The recipes contain no type or sticker animation op.
19. **Double iris.** `portrait_iris` has an `effect` iris at 0.9 and a `transition` iris. Is the effect a static window mask or an animated iris? If animated, does it double the transition? The camera-precedence decision covers camera and transition, not effects.
20. **9:16 rule anchors (pack defect).** In `paper_open`, `type_stack`, `macro_prop_beat`, `side_scroll_chase` and `pullback_close`, the separator rule sits above its copy in 16:9. Each maps to the same 9:16 box as that copy, and `aspectRules.9:16` aligns a rule to the lower edge of its box, so the rule flips below the copy. `sticker_slam` already has its rule below and is consistent. Should the vertical rule stay above its copy, or is the lower-edge placement intended? As written, the order flips.
21. **Cut quantisation.** The resolver gives plan seconds; S2 quantises to 88 BPM. Should the six cuts land on the nearest beat or the nearest bar? The pack says cuts are planned on the beat but does not define the snap for a six-shot 30 s film.
22. **9:16 cast re-stage.** `stage_wide` maps lead and second to the `lead` and `second` boxes. Should the second stay wholly inside the central 60 percent, or may the silhouette touch the edge? The boxes place it at 0.58–0.80.
23. **Two-cast close.** The pack says a two-cast portrait is a future recipe. Is the second allowed only in shot 4, or should the close hold both performers? I kept the close to the diorama and prop.

## Pack gaps

24. **No six-shot order with the two-cast rig.** The application's example six-shot order uses `detail` and no `list`, so it cannot show the two-cast `stage_wide` rig. Is open/title/portrait/list/quote/close acceptable for this commission, or should a detail beat replace the title or quote?
25. **One body value, four jobs.** The pack says `content.body` is one value per film, but it is used as body, lower third, display quote and close line. Is one line expected to carry all four? I designed "One roof, one take." to do so.
26. **Meter content has no brief slot.** The meter needs a readout, but the brief schema has no field for it. Is it generated from `tokens` (BPM/palette) or supplied as content?
