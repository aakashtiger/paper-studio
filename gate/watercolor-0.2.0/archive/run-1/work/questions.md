# Questions — The Halyard Tune

The pack answers the page contracts, the 9:16 boxes, the transition set and the fit math; the route is this film's choice. These are the questions the pack leaves open for this film. None of them answers the director's paint-in-speed choice.

## 1. Paint-in speed

**1.2 s or 1.8 s per painted form?** The title's door frame, the first rope, the quote's block, the return rope and the close's oar all paint in. The choice changes the film's breath: the same six pages read alert or deliberate. The card shows both speeds at the same seven-second loop. The treatment describes the paint-in and defers the speed to the director.

## 2. Where is the palette declared?

The brief and format schemas have no palette field. The style offers `garden-day` (sage, rose, vermilion) and `evening-blue` (blue-grey, ochre, vermilion), with `garden-day` as the default. This treatment assumes `garden-day`: sage water, rose light on the bench, a vermilion seal. A dusk slipway could also justify `evening-blue`. If the director wants that palette, where is it set — a format field, a brief field or a resolver override?

## 3. Can a repeated specimen carry a different painted state?

The return plate is the same specimen composition, the same slots and the same label, but the rope is a month drier and salt-stiff. The format has no per-shot subject field; a repeated recipe reuses its composition and slot values, and per-shot content is S2. Will the resolver paint the aged rope on the return, or will both specimen plates be identical until S2? If identical, the return is a literal page return; the "month drier" survives only in this treatment.

## 4. One caption across three page contracts

`content.caption` is the running note in the specimen and the quote and the closing line in the close. Is one value allowed to serve all three: a leader note on the first two and a closing line on the close? The pack says the close may share the caption as a refrain; it does not say the quote's note may be the same refrain rather than an attribution. The quote here is an original line, so no attribution is needed, but the note's job changes from page to page.

## 5. Venue repeated on the return plate

`content.venue` appears on the title and on both specimen plates. Is that a running label, as the pack allows for a repeated venue, or should the return plate carry a second place label? One value per slot; per-shot labels are S2.

## 6. `aspectRules` is referenced but absent

`APPLICATION.md` says the 9:16 rules are in `tokens.layout.aspectRules.9:16`. `tokens.json` has `layout.aspectScale.9:16` and `layout.aspectBoxes.9:16`, but no `aspectRules`. Are the boxes plus `safeZones` and `margins` the intended rules, or is a key missing from the pack? The treatment uses the boxes and the `aspectScale` sizes.

## 7. Which title size is normative at 9:16?

`tokens.layout.aspectScale.9:16.display` and `STYLE.md` say 44 px, with body and caption at 24 px and labels at 14 px; the card's 9:16 phone SVG draws the title at 32 px, names at 16 px and date at 8 px, below the 14 px floor. The card may be illustrative, but the difference decides whether "The Halyard Tune" sets in two lines or three inside the 0.22 h title box. The treatment assumes the tokens — 44 / 24 / 24 / 14 / 18 — and accepts a two-to-three-line title.

## 8. Names and labels over the horizon wash

In the 9:16 title, the `names` box (y .56–.65) and the venue label (y .76–.81) sit inside the `horizonWash` box (y .55–.85); the date label (y .82–.87) overlaps its lower edge. Is text over a background wash allowed without a paper halo, or should the names and labels be haloed like a hand note? The style refuses text over the subject; the wash is background, but the text and the wash are authored to overlap.

## 9. Is the quote's object-wash a ground or a cast shadow?

The quote recipe puts a petal wash (`object-wash`, opacity .18) under the painted object. The style allows a wash but refuses a cast shadow on a painted form. The treatment paints it as the light pooling on the bench, not a shadow. Confirm that reading.

## 10. A second plate after the mist

The route places the mist directly after the quote, so the quote's outgoing wipe and the mist's wipe are one erase. Then the return specimen paints on the fresh sheet, and the close holds. The sound direction says music is out from the mist through the close, paper and room only. Does that silence allow a painted plate after the mist (paper brush rustle only), or should the mist be the penultimate page with only the close after it? The treatment uses the second plate as the silent return.

## 11. Voice and the halyard motif

The pack supplies no audio. The treatment proposes a cleared felt piano with a three-note halyard motif, paper and brush foley for each paint-in, pencil scratch for the hand notes, one soft page turn and one stamp thump at the close; music out from the mist through the close, paper and room only; no voice. Does the director want a voice, and should the halyard's three notes be score or foley? The style says voice is optional and music is cleared per film.
