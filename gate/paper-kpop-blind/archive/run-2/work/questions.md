# Questions — Understudy Check

The pack answers the grammar. These are the points it leaves open. The `paper-shadow` choice is deliberately not answered here.

## 1. The open choice: `paper-shadow`

- **Collage or Print?** The pack offers both and does not choose. Which one does the director want?
- **Effect on this film.** Collage gives every paper layer a soft contact shadow, so Shot 4's two performers and Shot 6's diorama read as a stacked set with depth. Print keeps the layers flat and gives only the type its hard offset shadow, so the same shots read as a printed poster. The choice changes the depth of all six shots but not the cut geometry or the fixed type shadow.
- **Print and the cut edge.** The style says the cut edge is visible, with a lighter cream lip and a dark ink line. The choice text says Print keeps the layers flat. Does Print remove the contact shadow only, or also flatten the cream lip and ink line? This is not stated.
- **The lyric band.** Under Collage, does the torn ink band lift off the portrait with a contact shadow, or is it printed flat in both choices? The recipe names the band but no shadow.

## 2. Timing and format

- **The six-shot route is forced to six 5.000 s shots.** Every recipe has `duration.max` 5.0 s. Six shots at a 30.0 s target therefore leave no remaining capacity: the resolver starts at the minima (14.4 s total), then distributes the 15.6 s remainder across 15.6 s of capacity, so every shot reaches its maximum. Is that intentional, or should at least one recipe max be below 5.0 s so the blind format can show non-uniform timing?
- **Does the delivered film stay exactly 30.000 s after beat quantisation?** At 88 BPM with the 0.21 s offset, a 5.000 s shot is about 7.02 beats, not a whole number. S2 quantises the cuts to the grid; the pack does not say which shot absorbs the drift or whether the final duration may move off 30.000 s.
- **Is 30 s the plan duration or the delivered duration?** The resolver works in plan seconds; the style says the renderer quantises later. Which value does the lead compare against the brief?

## 3. 9:16 geometry

- **Which edge of a 9:16 box do rules align to?** `aspectRules.9:16` says rules "align to the box edge", but not top or bottom. In `sticker_slam`, `slam-rule` maps to the `body` box (y 0.43–0.59) while `body-slam` maps to `stickerText` (y 0.38–0.54); top-edge alignment crosses the display type, bottom-edge alignment sits below it. In `pullback_close`, `close-rule` maps to `body` and `body-line` to `bodyLower`; top-edge alignment leaves the rule 21% above the body, while bottom-edge alignment restores the 16:9 proximity. Which is canonical?
- **Is `stage_wide`'s lead inside the central 60%?** The vertical map puts `lead` at x 0.08–0.36 and `second` at 0.58–0.86. The stated central 60% is x 0.20–0.80. Is the rule about the hero's face, the hero's full rig, or the pair's formation? If it is the full rig, the map is outside it and needs an inset.
- **Does "images fill with cover" crop paper cut-outs?** `aspectRules.9:16` says images fill their box with cover. For a character or set cut-out, cover could crop a hand, foot or cut edge. Do paper assets contain within the box, or is cover literal?
- **Is "bottom 14%" a 9:16-only rule?** The 9:16 lyric box is y 0.86–0.97, close to the bottom. The 16:9 `portrait_iris` band is y 0.82–0.92, which is not the bottom 14%. Which geometry is authoritative for the 16:9 stage?

## 4. Brief slots and copy

- **Dead brief slots.** `content.date`, `content.venue`, `content.hashtag`, `content.rsvp`, `photos.hero` and `photos.supporting` are in the brief schema, but no recipe has a slot or asset for them. Should they be omitted, carried inside `content.body`, or does a later pass read them? This route cannot use the dedicated date, venue, hashtag or RSVP slots; the venue appears only as subtitle copy.
- **Photos.** The style refuses pasted photographs but allows a photograph as reference for a cut-paper portrait. For a fictional artist with no real likeness, is `photos.hero: "none"` correct, or is a reference image still expected?
- **One caption, two registers.** `content.caption` is the portrait lyric-band line and the stage lower-third. Should it read as a lyric, a caption, or a line that works as both? The pack fixes one value per slot, not its register.
- **One body, four contexts.** `content.body` is a type-stack body, a stage lower-third, a sticker display and a close line. Is it a CTA, a tagline or a show announcement? The pack fixes one value per film, not its tone.
- **Date format.** `content.date` has no locale or format. Is `14 NOV 2026` correct, or should it be `NOV 14`, `2026-11-14` or another house style?
- **Sticker display fit.** `sticker_slam` sets `content.body` in display at 9:16. The sticker text box is 0.64 × 0.16. Does the 8-word limit still hold for a display line that has to auto-fit, or should the sticker body be capped shorter than 8 words to keep the display scale?

## 5. Cast and colour

- **The second rig's accent sleeve versus four colours.** The rig calls for "one accent sleeve"; `stage_wide` already carries an acid burst, a meter and two costume plates. At four colours, may the sleeve be a darker oxblood plate in the same role, or must it be the `accent` role, which would add a fifth plate?
- **Does `content.names` need both performers?** The film has Vera Lune and her paper understudy, but the names slot carries only Vera. Is the understudy allowed to remain unbilled, or must the names slot list both?

## 6. Sound and delivery

- **Voice.** Voice is optional, one short line per idea, and explicitly not a brief slot. Does the director want a voice line, and if so where is it written and cleared?
- **Music and loudness.** No audio is embedded; the mix character is specified, but delivery loudness "belongs to the format." This format schema has no loudness field. What delivery spec should the lead use?
- **Foley cues.** The style names paper snap, tear, slap and whoosh. Which cue belongs to the iris, the cut and the sticker slam? The style does not map cues to transitions.

## 7. Palette

- **Night-stage or day-stage?** I chose night-stage for the pre-doors rooftop: older cream, deeper ink, oxblood, ink blue, acid and pink accent. The pack default is day-stage. Is night-stage the intended read, or should the default hold? The four-colour budget changes with the answer.
