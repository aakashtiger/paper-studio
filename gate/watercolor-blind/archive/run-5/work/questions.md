# Questions — The Last Inventory

Nine questions the pack does not answer. For each I record the reading I used, so the film can be resolved before the pack changes; if the pack answers differently, the workaround should be replaced, not defended.

1. **Where do the close's four slots sit at 9:16?**
   `tokens.layout.aspectBoxes["9:16"]` defines `closeDetail` and `closeWash` but no close boxes for `content.monogram`, `content.caption` (the refrain), `content.date` or the seal. The 1:1 close sets them in the left column (seal 0.10/0.18, monogram 0.10/0.38, caption 0.10/0.46, date 0.10/0.70). If the close instead borrows the generic `monogram` box (0.84/0.20) and `seal` box (0.84/0.08), the monogram overlaps `closeDetail` (0.52–0.88) across 0.84–0.88, and the seal sits in the top margin.
   *What I did:* left the close's placement open. The close is 4.5 s of hold, so it can be set once the answer is known; the closing line does not move during the shot.

2. **The title carries two labels and 9:16 gives one box.**
   `content.venue` and `content.date` both use `typeRole: label`. At 9:16 there is one `label` box (0.08/0.84, 0.6 × 0.06 — about 42 px tall). Two 14 px lines need about 34 px, so a stack fits, but the pack does not say which line comes first or whether the venue moves up to the 1:1 position at y 0.78.
   *What I did:* assumed the venue above the date, both inside the label box. The venue is short ("ELM ROW, 06:40"), so a two-line stack stays one block at the foot.

3. **The specimen's leader starts at a fixed point.**
   The specimen recipe's leader runs (0.62, 0.32) → (0.80, 0.26), and the guide says to re-anchor leader paths to the 9:16 boxes, not to the painted form. My two specimen plates are a low, wide stair and a small, high latch; one fixed start point cannot touch both.
   *What I did:* kept the leader as the recipe draws it and composed each subject so the start point lands on it. If the leader may be re-aimed per shot, shot 2's leader should start at the sixth tread's worn dip and shot 3's at the latch's thumb-plate.

4. **A repeated `detail` plate repeats its note verbatim.**
   The guide allows a role to appear twice with the same recipe and slot values, and calls a repeated caption a running note. It does not say whether a two-plate run is meant to read as one note for the pair, or whether a six-shot page should avoid repeating a captioned recipe and repeat an uncaptioned one (title or mist) instead.
   *What I did:* read it as a refrain. "six steps to the door" is a measurement of the house, not of one object, so it can stand beside the stair and the latch and return at the close. A note per plate is S2 and out of scope.

5. **Does the brush move after the mist?**
   "Silence is a colour: the brush lifted, music out from the mist through the close, paper and room only" reads as no painting in the silent stretch. But the foley list has "paper brush rustle for each paint-in", and the close's detail is itself a painted form. The pack does not say whether the close's unfinished wash is painted during the hold or already on the sheet.
   *What I did:* nothing paints after the mist. The close's keyhole plate arrives painted and only its last wash is unfinished; the only sounds in the silence are the mist's wash and one stamp thump. That is also why I did not put a specimen after the mist, where a silent paint-in would have depended on this answer.

6. **The mist is a 0.8 paper wash over a dark line.**
   The mist shape is one paper-coloured wash at 0.8 opacity from y 0.20 to the bottom; the quote's body starts at y 0.24 and its note at y 0.60. At 0.8, a fifth of the ink remains. The style says the mist washes the world back to blank sheet, and its failure mode is "a mist that leaves a hard edge", not a ghost, but the recipe's opacity is fixed.
   *What I did:* read 0.8 as the first pass and expected the director to add passes until the line is gone. If the opacity is sealed, the mist needs a second pass in the recipe, not in the film.

7. **When does the score stop?**
   "Music out from the mist" does not name a frame. The mist has a 2% pull-back and a rising edge, so the stop could be the mist's first frame, the moment the edge crosses the page's middle, or the mist's end.
   *What I did:* chose the mist's first frame (21.000 s). It is the only cue that does not depend on how the wash is animated.

8. **Where does a quote's attribution go when the caption is shared?**
   The guide says a quote's attribution goes in the caption or the body. The caption is one value across both specimens, the quote and the close, so an attribution would print four times and turn the running note into a credit.
   *What I did:* used an original line with no attribution. If a borrowed line is ever allowed, the pack needs a rule here; this is the one place where the shared-slot rule removes a slot rather than duplicating one.

9. **Do marks and labels sit inside the paper margins?**
   `tokens.layout.margins` are 9% top and 11% bottom, but the title's seal is at y 0.08 and the 9:16 seal box matches; the title's date and the 9:16 `label` box run 0.84–0.90, past the 11% bottom margin (0.89). The seal and the label are the two marks that make the page feel stamped rather than typed, so the question is whether they are exempt or the recipes are 1% out.
   *What I did:* kept the recipe positions. The seal reads as a stamp pressed into the margin; the label reads as a printed line at the foot. If the margins are hard, both recipes need the 0.01.
