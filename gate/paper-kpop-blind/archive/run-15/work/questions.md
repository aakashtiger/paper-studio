# Questions

These are the points the pack leaves open for *Last Soundcheck*. The `paper-shadow` choice is not answered here or in the treatment; it belongs to the director.

## The open choice

1. **`paper-shadow` — Collage or Print?**
   The pack fixes the type's hard misregistered ink shadow either way, and the cut edge stays visible either way. What changes is the paper's contact shadow.
   - **Collage:** every paper layer gets a soft contact shadow. Shot 3's portrait window, Shot 4's two-cast stage, Shot 5's torn bed and sticker, and Shot 6's diorama all gain depth. Does that depth suit the rooftop, or does it make the set read as a model box rather than a poster?
   - **Print:** the layers stay flat with the same visible cut edge, and only the type keeps its hard offset shadow. In Shot 4 the two figures would then need a graphic separation from the blue stage — an ink undercut, a paper outline or a plate contrast — because they cast no contact shadow. Is that the intended flat-print read?
   - Do the lyric band and the meter sticker cast contact shadows under Collage, or do they stay printed flat on the sheet? The pack calls the HUD printed, not floating, but the band and meter are paper assets.
   - Is the halftone a printed dot screen on the sheet in both choices, or a separate layer that receives a contact shadow under Collage?
   - In the 9:16 frame, does Collage's contact shadow separate the lead and second in Shot 4 better than Print's flat cut edge? The pack does not say.
   - Shot 6 is a pull-back to a cut-paper rooftop. Collage gives the layers depth; Print makes it a flat pop-up. Which is the intended ending?

## Music, voice and delivery

2. **Which cleared track, at what tempo?** The pack fixes an 88 BPM grid with a 0.21 second offset but supplies no audio. Must the cleared track be 88 BPM, or does S2 conform the cut grid to the track? Who supplies the master, the vocal chops and the paper foley?
3. **Is there a voice performance?** The pack says voice is optional and cleared per film. Is “One more chorus” sung, spoken or silent? Is the lyric band a vocal line or an event caption? The pack allows either but does not choose.
4. **What is the delivery loudness?** The format carries `-14 LUFS`; the pack says delivery loudness belongs to the format but names no target. Is `-14 LUFS` correct for a phone-first Short, or does the director want another target?

## Content and credits

5. **Is the second performer credited?** The pack allows a one-name film with an uncredited foil in `stage_wide`. I credit only Vera Lune. If the director wants the second credited, `content.names` becomes a two-name string; how should it fit the 9:16 names box (0.8 wide, 0.07 high) at 56 px display without dropping below 14 px or breaking the one-line credit? The pack says to write “Lead and Second” when both are credited but gives no credit layout.
6. **What is the monogram?** The pack fixes Permanent Marker and a small box but does not define a monogram length. Is “V” the intended hand mark, or should it be “VL” or a short word? The eight-word limit technically allows more than the box can hold.
7. **Track title vs venue in the one subtitle slot.** The pack says a separate track title goes in subtitle, but the commission needs the venue on screen. I put “The Fold, rooftop, Friday” in subtitle and left the track title off. If the director wants a fictional track title, does the venue move to caption or body? The pack allows a date or city in subtitle or caption but does not say which wins when both are required.

## Layout and grammar

8. **Four-colour budget vs the mandated acid HUD.** `stage_wide` mandates an acid burst and an acid meter readout. If the stage is blue and the cast is red, the frame has paper, ink, blue, red and acid — five roles. The pack says drop the accent first, but the fifth role is not the accent. Should acid count as one of the two plates (so the cast and stage must share the other), or is the HUD exempt? I tinted the cast paper/ink in Shot 4 to keep four roles, but the pack does not state the rule.
9. **The 9:16 orbit envelope.** `stage_wide`'s camera is a 1.00 to 1.06 orbit. At 9:16 the two figures sit at the edges of the central 60 percent (0.20–0.42 and 0.58–0.80). Does the six percent move apply unchanged, or must it be reduced so the outer cut edges stay inside the central 60 percent? The pack says the 9:16 map is anchors, not stretch, but gives no camera envelope for the re-stage.
10. **The meter-safe zone.** `tokens.layout.safeZones` calls the meter-safe area “top right 18 percent”, but the 9:16 meter box is 24 percent wide (x 0.70, w 0.24) and the 16:9 meter is 26 percent wide (x 0.68, w 0.26). Which governs the sticker's size: the safe-zone percentage or the recipe box?

## Pack and guide contradictions

11. **Which six-shot sequence is valid?** The root `inputs/APPLICATION.md` example uses `detail` (`macro_prop_beat`) in the six-shot sequence; the sealed `pack/APPLICATION.md` example uses `formation` mapped to `list` (`stage_wide`). Only `stage_wide` carries the two-cast rig, and the grammar check requires a two-cast shot, so the `detail` example cannot pass. I used the pack's `list` route. Which document is authoritative for a blind six-shot application?
12. **Body and sticker type.** `pack/BRIEF.md` section 8 says “Archivo Black for body and stickers”; `STYLE.md`, `capabilities` (the `quote-type-exception` decision) and `sticker_slam` set the quote's `content.body` in Anton display. Which wins for Shot 5? I used the recipe and the decision: Anton display.
