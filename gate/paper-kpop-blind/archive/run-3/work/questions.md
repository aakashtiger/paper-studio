# Questions — Last Light Check

The pack leaves the questions below open. None of them changes the six-shot route; several change the look, the cut, the copy or the proof.

## Open choice: `paper-shadow`

- **Collage or Print?** `capabilities.governance.choices[paper-shadow]` is undecided. The treatment is written to work under either, but the choice changes:
  - **Shot 1:** the cut-paper sun and accent core either cast a soft contact shadow on the card (Collage) or sit flat with only the type shadow (Print).
  - **Shot 3:** the paper window, portrait layers and torn lyric band either lift off the sheet or print flush. The torn edge is visible in both; the contact shadow is Collage only.
  - **Shot 4:** the two performers and stage floor either read as a tabletop diorama with contact shadows, or as a flat printed stage.
  - **Shot 5:** the sticker and torn bed either sit on the sheet with a contact shadow, or are flush.
  - **Shot 6:** the pull-back either reveals physical depth in the diorama (Collage) or a flat printed sheet whose only depth cue is the type shadow (Print). This is the shot where the choice is most visible.
- **Does Collage's “every layer” include type and HUD?** STYLE says Collage gives every layer a soft contact shadow and a visible cut edge; it also says the type always carries its hard misregistered ink shadow. Does the type sticker and the HUD also get a paper contact shadow under Collage, or only the paper layers?
- **Is the card's Print type shadow a mistake?** STYLE says the type shadow is hard, misregistered ink in either choice. The card's Print panel sets a red type shadow (`text-shadow: 6px 6px 0 var(--red)`). Which is authoritative?
- **Does Collage's soft contact shadow conflict with the hard top-left key and “no ambient fill”?** The style asks for a hard key with no fill; Collage adds a soft contact shadow. Is that shadow a contact shadow only (allowed), or does it read as the soft studio light the pack refuses?

## Director choices the pack leaves open

- **Palette:** day-stage or night-stage? The treatment proposes day-stage for last light. If night-stage, the accent becomes pink and the rooftop reads as a night stage; the route still works. Confirm.
- **Second cast:** `stage_wide` stages `character.lead` and `character.second`, but the brief has one `names` value and no second-name or second-role slot. Is the second an unnamed mirror double, a stage hand, or a credited performer? The treatment uses an unnamed double.
- **Colour plates / accent sleeve:** the second rig has “one accent sleeve”; `stage_wide` also carries an acid stage burst and an acid meter readout. If Vera's jacket is a red plate, shot 4 would carry paper, ink, red, acid and accent (five roles). The budget says drop the accent first. Do we drop the second's accent sleeve in shot 4, drop Vera's red, or keep five? The brief has no costume or colour field.
- **Music and voice:** the pack supplies no audio. Which cleared 88 BPM track, and is there a voice line? The cuts are planned at 88 BPM; the actual track must match or be conformed. Is the one-line voice optional here, or is the caption the only spoken-adjacent text?
- **Venue and date on screen:** `content.venue` and `content.date` are not read by any recipe. The route puts the venue in `subtitle` and keeps the date in the brief only. Is that enough, or should the date replace or augment `body` or `caption`?
- **Type line breaks and case:** the brief has no line-break or case field. The 9:16 title box cannot hold a three-line 56 px stack; the treatment breaks the title as “LAST LIGHT / CHECK” and the sticker as “DOORS AT / EIGHT”. Confirm those breaks and the all-caps display.
- **Meter readout:** `stage_wide` carries a black sticker meter with an acid readout, but no text slot or format. Should it read the BPM, the palette name, a bar count, or a level? The pack says “beat and palette” but not the string.
- **Beat grid:** where does the 0.21 s offset land, and which shot absorbs the 30 s rounding? The plan seconds are not frame-exact; S2 quantises to 88 BPM. Confirm the first beat and the final hold.
- **Sequence grammar:** the pack defines closed roles but no required order. Is open → title → portrait → list → quote → close valid, or is there a preferred order? The route omits `detail` and `transition`; confirm those roles are optional for a six-shot film.
- **Accent recurrence:** STYLE requires the accent at least twice; only `paper_open` and `sticker_slam` carry it. The route includes both, so the accent lands in shots 1 and 5. If the palette changes to night-stage, is the pink accent still required twice?
- **Lead appearance:** the lead is a fictional paper performer. Does the director want a specific fictional hair and costume silhouette, or leave it to the paper build? The brief has no appearance field.
- **Rights:** who clears the music, voice and any real-world reference? The pack supplies no audio or third-party assets. This is production, not style, but it blocks delivery.

## Pack defects and contradictions found

- **Lyric band position.** STYLE says the band is the bottom 14%. `portrait_iris` places it at y 0.82, h 0.10 in 16:9 (bottom 18%, with an 8% bottom margin), while its 9:16 map uses the `lyric` box at y 0.86, h 0.11. Which is authoritative for the 16:9 composition?
- **Lyric band width.** The 9:16 `lyric` box is x 0.05, w 0.90 (5% side margins), wider than the safe 6% margin. `portrait_iris` itself lists “a lyric band … wider than the safe margin” as a failure. Should the 9:16 box be x 0.06, w 0.88?
- **Corner marks vs safe margins.** STYLE says four corner marks inside the safe margins. `pullback_close` places them at x/y 0.03, w/h 0.94 in 16:9 (outside the 6% top and side margin), and its 9:16 map sends them to the `frame` box (the central 60%), not the outer safe margins. Which is intended?
- **`sticker_slam` shadow target.** The recipe's shadow effect references `id: "type-shadow"`, but no op with that id exists in `sticker_slam`. `type_stack` has a `type-shadow` rule; `sticker_slam` does not. Is the effect meant to target `body-slam`, or is it a no-op?
- **`type_stack` shadow target.** The `type_stack` shadow effect also references `id: "type-shadow"`, which is a rule shape at y 0.22, not the `title-display` text. If the id is an op target, the title gets no shadow and a rule does. Is the id a named shadow style rather than an op target?
- **Where is the type shadow in the other recipes?** `paper_open` and `portrait_iris` set display type with no shadow effect; `pullback_close` sets a monogram and body with none. Is the hard type shadow applied globally by the renderer, or must every recipe name it? If it is global, why do `type_stack` and `sticker_slam` name it?
- **`pullback_close` rule/body order.** In 16:9 the acid `close-rule` is above `body-line` (y 0.71 vs 0.75). In the 9:16 map both go to `bodyLower`; the rule aligns to the box's lower edge (y 0.71) while the body auto-fits from the top (y 0.64), so the rule flips below the body. `type_stack` has the same pattern: `stack-rule` and `body-copy` both map to `body`, and the rule lands on the lower edge. Is that intended, or should each rule get its own anchor?
- **Venue/date fields unread.** `capabilities.adaptation.slots` says `date`, `venue`, `hashtag`, `rsvp` and `photos.*` are not read, but the brief schema includes them. The commission asks for the venue; the route puts it in `subtitle`. Is that the intended workaround, or should the pack add a venue slot?
- **`list` is a closed role but stage_wide has no list content.** `stage_wide` declares the `list` beat role but its slots are `content.body` and `content.caption`; there is no list field. Is “list” meant as a formation beat, or is the role name a leftover from a tour-date list recipe?
