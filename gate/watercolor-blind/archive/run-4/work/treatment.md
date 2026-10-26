# Treatment — Number Nine, Alder Row

*A house on its last afternoon before the sale, remembered through a latch, a stair and a key.*

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | title | 4.667 | Paper is the white |
| 2 | `watercolor_specimen` | detail | 5.833 | Annotation leader |
| 3 | `watercolor_specimen` | detail | 5.833 | Flying white and pooled edge |
| 4 | `watercolor_quote` | quote | 4.667 | Painting-in |
| 5 | `watercolor_mist` | transition | 4.500 | Paper is the white (returned) |
| 6 | `watercolor_close` | close | 4.500 | No vector outline (the unfinished edge) |

**Fit.** The six minima sum to 4 + 5 + 5 + 4 + 4 + 4 = 26.0 s; the six maxima sum to 8 + 10 + 10 + 8 + 7 + 7 = 50.0 s; the 30 s target lies between. Every shot starts at its minimum and the remaining 4.0 s is shared by remaining capacity (4, 5, 5, 4, 3, 3 of 24), in whole milliseconds: 4667 + 5833 + 5833 + 4667 + 4500 + 4500 = 30 000 ms. This is not an equal split.

**What is painted, shot by shot.** 1. The street edge and the porch arch, seen from outside; the title plate carries the title, subtitle, date, running label and monogram. 2. The kitchen window's latch: an iron lever worn smooth at the thumb, the painted frame, a shadow wash under it (ambient shade, not a cast shadow). 3. The third stair: the tread's worn nosing, the riser, the joint where the tread wash and the riser shadow disagree. 4. The front-door key on its nail, a thin form against the paper. 5. The erase itself: paper-coloured mist from the top, the rising edge extended below the frame and faded to paper, so no hard edge; no subject and no text. 6. The same stair's nosing, left unfinished: the last wash pass stops before the edge and leaves one paper-coloured gap.

**Text on the page.** Title `Number Nine`; subtitle `Alder Row, before the sale`; date `24 OCT 2026`; running venue `ALDER ROW, 16:10`; monogram `N9`; hand note `the third stair still answers` (four times); quote `The house keeps its sounds after the furniture leaves.` No other words, no attribution, no voice.

**Director choices.** Paint-in 1.8 s per painted form — the title's ivy, the latch, the stair and the key; the mist is a wipe, not a paint-in. Palette `evening-blue`: paper #efe6d4, wash #8fa3b0 for the cool rooms and the street, petal #c9a27e for the worn wood and the quote's base wash, deep #5c6f7a for the latch, the key and the riser (the wash at three passes, not a darker tube colour); the iron is matte, with no metallic sheen. Accent #c65438 for the two seals. The accent recurs twice only, at the title and the close; the mist carries none. Seed 419. No photograph; the brief omits the unread `photos` fields.

**9:16 recomposition.** Title left, ivy arch right; specimen centred with its note below; quote text left, key right; close text left, unfinished nosing right. The title, subtitle and arch use `tokens.layout.aspectBoxes["9:16"]`; the specimen uses the specimen and note boxes; the close uses `closeDetail`. The quote, the labels, the monogram and the close's unfinished wash have no 9:16 boxes, so their positions are the recipes' 1:1 placements (question 1). The seal has no box either; it is pinned square (47 × 47 at 390 px), not the recipe's 0.12 × 0.12 box, which would be 47 × 83 at 9:16. The key is redrawn to the taller quote box, not stretched. The specimen's leader has no 9:16 path (question 2). Type follows the 9:16 scale: display 44, body 24, caption 24, label 14, monogram 18. The film never crops the 1:1 page.

**Sound.** An original felt-piano motif, no drums, cleared for this film; no library track and no voice. Paper brush rustle at each paint-in; pencil scratch as each hand note is written (four times); two soft page turns; the title's seal is pressed without a thump. Music is out from the mist through the close: the close's detail paints in with paper and room only, the closing line is written, and the one quiet stamp thump is the seal. Delivery is carried by the format's `loudness` passthrough: −16 LUFS integrated, −1 dBTP; loudness belongs to the format, not the style.

## Invariants

- **Paper is the white:** Shot 1 lays the sheet first; the horizon wash leaves the top and left margins as bare paper and no shape is pure white. Shot 5 returns the field to the same paper, and shot 6's gap is the sheet showing through, not a white fill.
- **Flying white:** Shot 3, the stair's tread: one broad loaded stroke, 6–9 bristle tracks that break into dashes at the dry end. The latch lever (shot 2) and the key shaft (shot 4) are thin forms and get one clean stroke, no bristle noise.
- **Pooled edge:** Shot 3, where the tread wash and the riser's shadow wash meet: three jittered passes, and the edge darkens where the three disagree. Shot 2's shadow wash under the latch pools the same way.
- **Painting-in:** Shot 2's latch, shot 3's stair, shot 4's key and shot 1's ivy arch each reveal structure before detail over 1.8 s; no pan reveals a finished painting. The mist (shot 5) is a wipe, not a paint-in.
- **Annotation leader:** Shot 2: the note is drawn twice over a 12 px paper-coloured halo, revealed left to right, and its leader grows to the latch. Shots 3 and 4 repeat the leader to the nosing and the key. The note never covers the subject.
- **No vector outline:** Shot 2's window bars and latch are rigger strokes of varying weight with wet edges; there is no uniform contour and no vector shape filled with texture. Shot 3's stair edge is the last wash pass, not a line; shot 6's unfinished edge is a wash that stops, not an outline.

## Questions

- **Q1. The 9:16 boxes are partial.** No boxes for the quote's text, object or note, the date, venue, monogram or seal, or the close's unfinished wash; the seal's square 0.12-box becomes 47 × 83 at 9:16, the monogram sits on the arch's top-right, and the seal and monogram reach x .96 and the quote's object x .94, past the 8% right margin. Hand-place or add boxes?
- **Q2. The specimen's leader has no 9:16 path.** The recipe's leader ends at (.80, .26); the 9:16 note is at (.12, .70). Which anchor?
- **Q3. The caption's home is stated twice.** STYLE.md says the caption sits in the bottom safe zone; the specimen note is at y .28, the quote at .60, the close at .46; the 9:16 note box is at .70. Which governs?
- **Q4. One caption, three contracts.** The same caption is the specimen note, the quote note and the close's closing line; a film using all three writes the same words four times. Is the refrain intended?
- **Q5. The quote has no attribution slot.** Can `content.body` be the film's own line, or does the quote need a source?
- **Q6. The 16-word cap and the two-line cap conflict at 9:16.** At 24 px in a .60-wide box, two lines hold about 7–8 words, not 16. Which limit wins?
- **Q7. There is no label length rule and no 9:16 label box.** The 1:1 venue box is about 18 mono characters; a longer place name overflows. Where do the labels sit at 9:16?
- **Q8. The monogram is authored for people.** BRIEF.md calls it the couple's mark; can a house carry `N9`?
- **Q9. The title's arch is hardcoded as a garland.** May `prop.painted-garland` carry porch ivy in a non-wedding film?
- **Q10. The specimen's push-in is exactly 6%.** The signature says "under six percent"; the recipe says 1.00 → 1.06. Which is the contract?
- **Q11. Is the mist a standalone shot or an overlap?** The recipe starts on a fresh paper layer; the guide says it erases the shot before it. Does the first frame carry the quote's key?
- **Q12. Two page turns in a row.** Every specimen exits with `page_turn`; two consecutive specimens turn the page twice, 5.8 s apart. Intended?
- **Q13. The seed has no value or range.** `tokens.seed` names the seeded surfaces but no default; is 419 legal?
