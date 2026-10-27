# Questions — ROOFTOP SOUNDCHECK

The pack answers the recipe grammar, the slot limits and the 9:16 anchor rules. These are the questions it leaves open for this film. I have not chosen the `paper-shadow` option.

## The open choice: paper-shadow

1. **Which option should the film use, Collage or Print?** Collage gives every layer a soft contact shadow and a visible cut edge; Print keeps the layers flat with the same cut edge and gives only the type a hard offset shadow. The choice changes the read of Shot 1's acid sun, Shot 3's paper window, Shot 4's paper-on-paper stage and Shot 6's diorama. I have designed the route so both options are possible, but I have not chosen one.

2. **Under Collage, do the printed HUD layers cast contact shadows too?** The pack says Collage gives "every layer" a contact shadow, but also that the HUD is printed, not floating. Should the lyric band in Shot 3, the meter sticker in Shot 4 and the corner marks in Shot 6 stay flat, or do they cast a paper shadow like the set?

3. **Under Print, do the paper-on-paper stage (Shot 4) and diorama (Shot 6) separate on the cut edge alone?** The cream lip and the ink line are fixed in both choices, but without a contact shadow a cream stage on a cream sheet may merge. Is that the intended print look, or should those plates take a second colour when the director chooses Print?

## Palette, HUD and review

4. **Who signs off the palette?** `STYLE.md` says the director decides `day-stage` or `night-stage`, but also that the palette is named by the treatment and is not a second sign-off choice. Is the treatment's `night-stage` a proposal for the director, or the author's final choice?

5. **The card shows only `day-stage` swatches.** If the treatment names `night-stage`, is the card still the review evidence, or should the director see a night-stage specimen before signing?

6. **How does the `stage_wide` meter get its four-role bar?** The meter is "generated from the plan," but the palette is not a plan field and neither the brief nor the format carries palette roles. Does the plan carry the treatment's per-shot roles, or does the bar show only the recipe's fixed colours? And does the bar read the current frame's four roles or the film's palette? Shot 4 uses paper/ink/red/acid; the film also uses blue and the accent elsewhere.

## Brief and content

7. **Is the release date required on screen?** The pack does not read `content.date`; a date can go in `subtitle` or `caption`. I put the venue in `subtitle`, so the subtitle is already carrying the event line. Is the date needed in the film, or is the brief's `date` enough?

8. **`content.body` is one value across four type roles.** It is the body line in Shot 2, the lower-third in Shot 4, the display sticker in Shot 5 and the close line in Shot 6. Is a per-shot override allowed in S2, or must one phrase carry all four? The pack says one value per film; it also says per-shot content is S2.

9. **Is the caption printed only, or also performed?** `content.caption` may be an original vocal line, but voice is a performance track, not a content slot. Should “Hold the sky up with me” be printed in the lyric band only, or also sung? Who clears the vocal?

10. **Which seed is canonical for the blind pass?** The pack lists seeded fields but no default seed; the plan command takes `--seed`. Which seed should the lead use?

## 9:16 re-stage

11. **Do the anchor maps also change poses?** `stage_wide` moves the foil from x0.62 to x0.58 at 9:16, but the map gives boxes, not poses. Does the foil turn in, does the lead shift weight, or do the bodies keep their 16:9 poses? The pack says "re-stage both performers," not only move the anchors.

12. **Which lyric-band geometry is authoritative?** `STYLE.md` and `tokens.hud.lyricBand` say bottom 14%; `portrait_iris` places the band at 84–96% in 16:9, and the 9:16 `lyric` box is 86–96%. That is 12% high in 16:9 and 10% high in 9:16, not 14%. Is the 14% a zone for the caption, or the band's height?

## HUD, type and colour

13. **What colour is the `sticker_slam` flash?** The recipe has a `flash` effect with no colour; `STYLE.md` assigns “one flash” to acid. But the recipe already uses paper, ink, red and accent. Is the flash paper (a bleach) or acid? If acid, which of paper/ink/red/accent drops to keep four colours?

14. **Is the `second` rig's “one accent sleeve” fixed to the accent role?** If it is, `stage_wide` with a red lead, acid burst and ink meter would be five colours. Is the sleeve a tintable costume plate, or a fixed accent?

## Sound and delivery

15. **Is -14 LUFS the house target?** The pack leaves delivery loudness to the format but gives no target. I have put `-14 LUFS` in the format as a proposal.

16. **Where is the one-beat silence/drop, and how long is the close hold?** The pack allows one beat of silence before a drop; the loudest hit in this route is Shot 5's sticker slam. Should Shot 5 take the silence, or is there another drop? `pullback_close` ends on a hold and the plan gives it 5.193 s; does that time include the pull-back and the hold, or does the hold sit after the move? The pack does not say how long the final frame holds.
