# Questions — A Tune for the Back Room

Route: `title` · `specimen` · `specimen` · `quote` · `mist` · `close` — 30 s, 9:16, six shots.
Fit: Σmin = 26 s ≤ 30 s ≤ Σmax = 50 s.
Allocation: 4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500 s (30.000 s).

All names, dates, places and stories in this film are fictional. There is no
lyric, no song title, no music file, no voice and no photograph.

## 1. Rounding to the last millisecond

The rule shares 30 000 − 26 000 = 4 000 ms in proportion to each recipe's
remaining capacity (4, 5, 5, 4, 3, 3 s = 24 000 ms). The shares are 666.667,
833.333, 833.333, 666.667, 500 and 500 ms. That lands on exactly 30 000 ms only if
the two .667 shares round up. The pack says "whole milliseconds" and gives a
tie-break but not the rounding rule. I rounded to the nearest millisecond; the
plan output should settle it. If the resolver floors and passes the remainder
forward, the seconds above move by a millisecond or two and the treatment table
is out by a thousandth.

## 2. A repeated page contract

The guide allows a page contract to repeat and counts each repeat as a separate
shot with the same slot values, and it says per-shot subjects live only in the
treatment. Shots 2 and 3 are both `watercolor_specimen` under one running note.
Does the resolver paint the second sheet fresh (the key) or repeat the first page
(the geranium)? If the subject is not carried per shot, a repeat renders the same
picture twice. Is that the intended reading of "may repeat a page contract", or
should a repeat be reserved for a recipe that differs by its own text?

## 3. `content.names` outside a wedding

The title recipe reads `content.names`; the pack defines the field only for a
couple. I used the tune's author, "Iona Vell". Is that the intended register, or
is `names` for the subject, a pair, an attribution, or better left empty on a
non-wedding film?

## 4. `specimenNote` overlaps `specimen` at 9:16

The note box runs x 0.54–0.92 and the specimen box x 0.20–0.80, so the note sits
over the right third of the subject's own box, while the recipe's failure mode
forbids a caption over the specimen. How much of its box may a painted form fill?
I keep each form left of x 0.54 and hang the leader into the note's paper, but the
pack states no fill rule, and a wide subject (a door, a table) would collide.

## 5. One note or two on the quote page

The quote recipe carries both `content.body` (the quote) and `content.caption` (a
hand note on a leader), and the style says one note per view. Is the body quote
outside the note count, so the page has one quote and one note? Or is the caption
meant to be the attribution, which would leave two notes on the page? I treated
the body as the quote and the caption as the note.

## 6. Background washes missing from `vertical`

`vertical` maps the hero ops but not the wash behind them: the title's `horizon`,
the specimen's `edge-wash`, the quote's `object-wash`. The horizon is full-bleed
and the specimen's wash sits on its subject's box, so I left those as authored. The
quote's `object-wash` (1:1 y 0.50–0.66) would fall below the 9:16 object (y
0.16–0.62), so I re-anchored it under the cup at y 0.50–0.62. Is a re-anchor
expected, and to which box — the object's or a page-relative band?

## 7. The mist has no `vertical` array

All five other page contracts have one; the mist's paper polygon is page-relative
(y 0.5 to the bottom). I used it as authored at 9:16. Is that correct, or should
the mist band be recomposed for the vertical page?

## 8. Two wipes in a row at the quote → mist seam

Both recipes declare `wipe`, and the guide says the quote's outgoing wipe and the
mist's wipe are one erase. Does the resolver merge two consecutive wipes, or play
both — which would erase twice and add a beat? And does the quote's outgoing wipe
spend part of the quote's own 4.667 s, or is it drawn over the mist's first frame?

## 9. The silence the mist forces

Music is out from the mist through the close. With the mist in fifth place that is
9.0 s of 30 s (30%): 4.5 s of erase plus the 4.5 s close. An earlier mist only
lengthens the silence, because every shot after it is silent too (fourth place
would give 13.667 s, 46%). The only way to shorten it is to drop the mist from the
route. The style says the silence is structural, not a fixed percentage, but gives
no ceiling. Is ~30% the intended register for a 30 s page, or is a mist too costly
on a page this short?

## 10. Who chooses the seed

APPLICATION lists the seed among the director choices to write in the treatment;
the S1a notes say the integer is chosen by the lead and is not a brief or format
field. I left it to the lead. Which is it?

## 11. The 6 px bristle threshold

Flying white starts on strokes "wider than about 6 px", but every other pixel
figure is pinned to the 390 px page. Is 6 px page pixels (about 9 px in a 585
px-wide 9:16 output) or output pixels? It decides whether the door frame and the
leaf carry bristle tracks at all.

## 12. The seal crosses the margins

At 9:16 the `seal` box runs x 0.84–0.96 and y 0.08–0.1475; the page margins are
8% left and right and 9% top. The stamp sits 4% past the right margin and 1% above
the top one. The 1:1 title recipe does the same. Is that a stamp bleed by design,
or should the box be pulled to 0.84 × 0.92?

## 13. Display line-height at 9:16

The 9:16 scale gives 44 px display and a title box 0.5 wide × 0.22 high, but no
line-height. "A Tune for the Back Room" sets in three lines at 44 px, which uses
most of the box. Is three lines the expected use, or should a 9:16 title be kept
to two?

## 14. The title has no note

The style says a view with a subject carries one hand note with a leader line; the
title recipe has labels (`date`, `venue`) but no leader and no caption. Is the
title exempt from the one-note rule, or are its two measured labels meant to stand
in for the note?

## 15. Unused brief fields

I wrote only the eight content slots the six recipes actually read, and left out
`photos`, `hashtag` and `rsvp` entirely. Should the brief carry them present but
empty instead?
