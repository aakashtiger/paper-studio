# Questions — Rooftop Soundcheck

The pack leaves these open for this film. I have not answered the director's `paper-shadow` choice.

## The open choice: paper-shadow

1. **Collage or Print?** The route is drawn to work under either. Collage gives the card, the window, the two-cast stage, the sticker and the diorama soft contact shadows and a visible cut edge. Print keeps the layers flat and gives only the type its fixed hard offset shadow. Which does the director want?

2. **Is this the intended difference?** Under Collage, shot 1's sun and core lift off the card, shot 3's window and face separate, shot 4's cast and stage gain depth under the orbit, shot 5's sticker lands with a contact shadow, and shot 6's pull-back reveals a physical diorama. Under Print, the same six shots read as a flat printed poster with only the type shadow separating the layers. Is that the intended read, or does the pack expect a different change?

3. **Does Print keep the cream cut edge?** The signature lists torn cut edges as fixed, but the choice text attaches a "visible cut edge" to Collage. In Print, is the cream lip still on the paper card, cast, sticker and diorama, or only on the type?

4. **How do contact shadows re-anchor at 9:16?** The vertical maps move the layers into new boxes. Under Collage, does the soft contact shadow follow the re-staged layer, keep the hard top-left direction, and scale with the layer? The vertical map has no shadow anchors.

5. **Does the close still read as a diorama under Print?** If the pull-back has no contact shadows, is it still a diorama or a flat poster? If it flattens, should the close use another depth cue?

6. **Does the sticker slam survive Print?** The type shadow is fixed, so the body still reads; but without a contact shadow, is the sticker's landing still a slam or a printed patch?

7. **Has the director signed?** The pack says the director opens the card at 900 x 700 and at 390 px, checks the three proof frames, answers `paper-shadow`, then signs. The treatment is not locked until that happens.

## 9:16 re-stage and the vertical maps

8. **Which op is the parent?** `paper_open` sends `open-sun` and `core-burst` to the same `openSun` box; `sticker_slam` sends `torn-bed` and `sticker-slam` to the same `sticker` box; `side_scroll_chase` sends `corridor-run` and `chase-arrow` to `corridor`. The aspect rules say nested shapes keep their 16:9 relative inset, but the map does not name the parent. I read the lower-z op as the parent and the upper-z op as the inset child. Is that the intended rule?

9. **Does the torn bed keep its size?** In 16:9 the torn bed is 70 percent high; in the 9:16 `sticker` box it is 28 percent high. Is that re-stage intended, or should the bed keep its larger extent and the sticker sit inside it?

10. **Is the sticker too wide?** The 9:16 `sticker` box is 68 percent wide (.16-.84), outside the central 60 percent (.2-.8). Is a graphic event exempt from the central-60 hero rule, or should the sticker be inset?

11. **Is the title inside its card?** `type_stack`'s 9:16 `title` box starts at .18, above its `titleCard` at .2. With paper type on the red card, can the top of the title fall on the paper field? Should the title box be inset inside the card?

12. **Are the corner marks inside the safe margins?** `pullback_close`'s `screen` box runs to .94, below the 12 percent bottom margin (.88). Does the corner-mark asset carry internal padding, or should the box stop at .88?

## Timing, beat and the resolver

13. **How is the whole-ms remainder rounded?** The resolver starts at each recipe minimum and shares the remainder by capacity in whole milliseconds, but the pack does not say how to round or break ties. The route table uses a largest-remainder split. A cumulative split would move a shot by 1 ms. Which does the lead's resolver use?

14. **Which beat does each cut land on?** The plan seconds are about 4.85-5.19; at 88 BPM a bar is 2.727 s, so the cuts are not on whole bars. Does S2 quantise to the nearest beat, the nearest bar, or a beat map? Does the 0.21 s offset start beat 0 or shift the phase? At 30 s, 44 beats from 0.21 end at 30.21, past delivery; how should the close hold resolve?

15. **How long is a transition?** The recipes name iris, cut, wipe and hold, but not their durations or easings. How long is the iris on the sun and the face, and how long is the final hold?

16. **What carries the slam physics?** `sticker_slam` names the sticker and a flash but no animation op. Which op gets the squash 0.12 and overshoot 0.18, and on which beat?

17. **Is the flash a colour plate?** Is the `sticker_slam` flash a paper-white light hit, or an acid plate? If acid, the shot would carry five roles with the red bed and the accent sticker.

18. **May a recipe repeat?** The prompt allows a repeat if the pack's grammar allows it, but the pack does not say whether a recipe may repeat in the six-shot blind application. My route uses six distinct recipes, so this is not a blocker; is a repeat allowed if the lead wants a different route?

## Six-shot sequence and roles

19. **Is `list` a valid substitute for `detail`?** The pack's example six-shot sequence is opening / title / portrait / detail / quote / closing. The only two-cast recipe is `stage_wide`, whose role is `list`. My route is open / title / portrait / list / quote / close so it can prove the two-cast rig. Is that valid, or must the six shots keep `detail` and waive the two-cast check? If the latter, the pack cannot prove two-cast in six shots.

20. **Is the second cast allowed to be unnamed?** The brief has one `names` slot. The two-cast shot has Vera plus an unnamed second paper drummer. Is the second a foil or witness with no credit, or is a second-name slot missing?

21. **Does the second's accent sleeve count as a fifth role?** The second rig has one accent sleeve. In `stage_wide` with the acid burst and the meter, that would be paper, ink, blue, acid and accent. I tinted the sleeve blue under "drop the accent first." Is that the intended reading?

## Type contrast

22. **Stage caption on paper:** `stage_wide` sets `caption-line` in the `paper` role at y .8 in 16:9 and maps it to the 9:16 `caption` box at y .76. The `stage` box ends at .82 in 16:9 and .74 in 9:16, so the caption sits mostly or entirely on the cream paper card. Paper type on paper has no fill contrast, and the cream cut edge disappears; only the hard ink shadow remains. The same pattern appears in `side_scroll_chase`: its caption is paper, the corridor ends at .8 in 16:9 and .68 in 9:16, and the caption sits below it. Should the caption be re-filled ink, moved onto the stage, or given a torn strip? This is the one place the route's type legibility depends on a pack decision.

## HUD and type

23. **What does the meter read?** The style says the meter reads beat and palette, but the recipe has no slot or format for the readout. Is it generated from the 88 BPM and day-stage tokens, or authored per film? What exact text and label size?

24. **Does the HUD carry the type shadow?** The type always carries a hard ink shadow, but the meter's acid readout sits on a black sticker, where an ink shadow would disappear. Is the HUD an exception to the fixed type shadow, or should the meter be re-coloured?

## Sound and delivery

25. **Must the track be 88 BPM?** The edit grid is 88 BPM. Is the cleared music track required to be 88 BPM, or is 88 only the edit grid and the track can be another tempo?

26. **Where do the audio and loudness live?** The format schema has no audio or loudness field, and the brief has no audio slot. Who supplies the cleared track, the optional voice line, and the delivery loudness?

27. **Which foley lands on which cut?** The style names paper snap, tear, slap and whoosh, but the recipes do not assign them. Does shot 2's cut get a snap, shot 5's slam a slap, the iris a whoosh, and the close room tone?

28. **Is there a voice line?** Voice is optional, one short line per idea, and not a brief slot. Is there one, who performs it, and is it cleared?

29. **Does the close hold on room tone?** The style allows it. How long, and does the music stop on the last beat or under the hold?
