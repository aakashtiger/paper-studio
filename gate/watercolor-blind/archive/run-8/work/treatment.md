# Treatment — House on Alder Row

## Route

A 30 s, 9:16 vertical journal page in six shots. The camera goes door → latch → stair → key → erase → window: the house is entered, read twice at arm's length, given one line, erased, and left unfinished. The page contracts carry it, with the specimen repeated once. There is no `watercolor_walk`: 12 s plus the five page minima (21 s) is 33 s before any repeat, so the walk cannot sit in a 30 s six-shot page.

**Allocation.** The six recipes' minima sum to 26 s (4 + 5 + 5 + 4 + 4 + 4) and their maxima to 50 s, so 30 s is inside the fit window. The 4 000 ms remainder is shared by remaining capacity (4 + 5 + 5 + 4 + 3 + 3 = 24 s), floored to whole milliseconds; the 2 leftover milliseconds go to the two largest fractions, the title and the quote at .667 each. The plan is 4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500, total 30.000 s.

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` | 4.667 | No vector outline — the door frame is two open ribbons, not a stroked rectangle |
| 2 | `watercolor_specimen` | `detail` | 5.833 | Annotation leader — a Caveat note on a 1.5 px leader, twice over a 12 px halo |
| 3 | `watercolor_specimen` | `detail` | 5.833 | Flying white — the broad dry tread stroke breaks into 3–9 dashes |
| 4 | `watercolor_quote` | `quote` | 4.667 | Pooled edge — three passes darken at the object wash's boundary |
| 5 | `watercolor_mist` | `transition` | 4.500 | Paper is the white — the erase is paper, never painted white |
| 6 | `watercolor_close` | `close` | 4.500 | Painting-in — the last pass stops before the window's edge |

**Shot subjects.**

- **1 · title — the front door of 14 Alder Row.** The subject is the door frame (`prop.painted-arch`), with the street as a low `horizon` wash. No hand note: a title plate carries none. The seal sits in the top-right margin, then the monogram, title, subtitle, names, venue and date.
- **2 · specimen — the front-door latch,** worn to a thumb-shaped hollow. Note "worn smooth" at `specimenNote`; label "14 ALDER ROW".
- **3 · specimen — the third stair tread,** hollowed at the nosing where every foot landed. Same note, same label.
- **4 · quote — the back-door key on its nail,** the ochre `object-wash` behind it, the line at left, the note "worn smooth".
- **5 · mist — the erase of the quote's page.** No subject, no note, no label.
- **6 · close — the kitchen window frame,** the last wash pass stopping short of the glass; the paper gap is the missing light. Seal, monogram MT, "worn smooth", "SPRING 2026".

**Director choices.**

- **Palette:** `evening-blue` — paper `#efe6d4`, ink `#262a2e`, wash `#8fa3b0`, petal `#c9a27e`, accent `#c65438` — for an interior at the end of an afternoon. At most five pigments a frame; `deep` is the wash at 2–3 passes, never a sixth tube. The key stays ink and deep; the ochre lives in the wash behind it, never as a highlight, so no metal sheen.
- **Paint-in:** 1.8 s for every painted form — the arch, the latch, the stair, the key, the window. The specimen is the reference. The card shows both speeds at the same loop; this film takes the slower hand.
- **Accent:** one mark, the same vermilion seal at the title and the close. Two appearances, no other vermilion, none in the mist.
- **Notes:** one per view with a leader (shots 2, 3, 4). The title carries none; the close's line is a closing line, not a note.
- **Camera:** as the recipes fix it — 4 % push at the title, 6 % push at each specimen, static at the quote, mist and close. The close holds.
- **Seed:** the lead's integer; neither schema carries one.

**Vertical (9:16).** Recomposed at display 44 / body 24 / caption 24 / label 14 / monogram 18 px on a 390 px page; larger frames scale proportionally and the 14 px floor holds. The title column stays left and the arch right. The title maps title / subtitle / names / arch / seal / monogram / labelVenue / labelDate; the `horizon` wash is not in that map and is placed full-bleed at y 0.58–0.86, the 1:1 fractions (Questions 1). The specimen maps specimenWash / specimen / specimenNote / label; both specimens put their named feature at (0.52, 0.31) because the repeated recipe reuses one leader path, re-anchored to run from there to the note box at (0.70, 0.26). The quote maps quote / quoteObject / quoteWash / quoteNote, with the leader re-anchored from the key's lower edge (0.70, 0.61) to the note box's right corner (0.56, 0.66). The close maps closeDetail / closeWash / closeGap / closeSeal / closeMonogram / closeNote / closeDate. The mist has no map: it is a full-frame wipe.

**Sound.** An original wordless felt-piano motif — no title, no lyric, no voice — four notes, unhurried, entering under the title's paint-in and playing through the quote. Music is out at the mist's first frame and stays out through the close; 9 s of the 30 s are paper and room only. Foley from the scene's matter: paper brush rustle for each 1.8 s paint-in, pencil scratch for the three hand notes, a soft page turn at the two specimen exits. The mist has no brush sound; it is a wipe, and it is silent. One quiet stamp thump at the close, on the seal. Delivery loudness belongs to the format, not the style.

## Invariants

- **Paper is the white:** Shot 1 is a sheet with a 35 % evening-blue horizon over it — the page's light is the paper, and nothing in the title plate is filled white. Shot 5 is the erase itself: a `paper` wash (`#efe6d4`) at full opacity, not white paint, returning the world to the sheet. Shot 6 leaves the `paper-gap` bare at x 0.82, so the close's brightest place is the sheet. The 22 % cotton fibre sits over paper in every frame.
- **Flying white:** Shot 3 is the clearest: the stair's nosing is one broad loaded horizontal stroke across the specimen's 203 px width — at 9:16 it stays far wider than the 6 px threshold, and its dry trailing edge breaks into 3–9 bristle dashes, so the wear itself is flying white. Shot 1's horizon band and shot 6's unfinished leading edge carry the same dashes. The stems, the 1.5 px leader and the mono labels stay single clean strokes, with no bristle noise.
- **Pooled edge:** Shot 2's `edge-wash` is three jittered passes; where their boundaries disagree the edge darkens and pools at the latch plate's lower side. Shot 4's `object-wash` pools under the key, and the key's own edge darkens where two passes overlap — a value, not an outline. Shot 6's wash edge pools just before the gap, which is what makes the stop read as a brush lifted rather than a crop.
- **Painting-in:** Every painted form takes 1.8 s. Shot 1's arch paints structure first (two jambs, then the head) and the type is cued with its last stroke; shot 2's latch, shot 3's stair and shot 4's key each paint from first stroke to last, with the leader drawn after; shot 6's window takes the same 1.8 s but its last pass stops before the form's edge. The push-ins begin on a form still being painted, so no camera move reveals a finished painting; there is no sway, because the forms are objects, not trees or grass.
- **Annotation leader:** Shots 2, 3 and 4 each carry one Caveat note, drawn twice over a 12 px paper halo, left to right, with a 1.5 px ink leader that grows to the subject. In shot 2 the leader runs from the latch's crown at (0.52, 0.31) to the note at (0.70, 0.26); shot 3 reuses the same re-anchored path because the recipe is repeated and both subjects are composed to that anchor; shot 4 runs from the key's lower edge (0.70, 0.61) to the note's right corner (0.56, 0.66). No note covers its subject: the specimen note sits outside the specimen box and the quote note outside the object box.
- **No vector outline:** Shot 1's door frame is two loaded ribbons with ragged, open ends — not a stroked rectangle — and the title, labels and seal have no box or rule around them. Shot 2's latch edge is a darker brush stroke where passes overlap, not a uniform contour; shot 3's stair edges are wash boundaries, not drawn lines; shot 6's window frame ends in a ragged wash edge at the gap. The only uniform lines in the film are the 1.5 px leaders and the glyphs of the mono labels.

## Questions

1. The title's `vertical` map has no entry for `horizon`, although APPLICATION says the maps include the background washes. Which 9:16 box or band takes it? (Placed full-bleed at y 0.58–0.86.)
2. Do the 9:16 boxes repaint a prop to their new width-to-height ratio (arch 0.71 → 0.48, quote object 0.63 → 0.39, close detail 0.68 → 0.44), or fit the 1:1 painted form into a different ratio?
3. `specimenNote` begins 0.02 after the specimen box, so the leader has about 8 px to run at 390 px. Is a tick-length leader acceptable, or may the note move to the wider `note` box when the specimen is tall?
4. A repeated specimen reuses one leader path, but shots 2 and 3 are different subjects. Is a per-instance leader anchor S2, or may the lead nudge the path per shot?
5. The caption rule is 16 words and 2 lines, but `specimenNote` holds roughly 15 characters at 24 px. Which limit is real at 9:16, and is a two-word note the intended register?
6. How is the erase timed? The quote's outgoing wipe and the mist's wipe are one erase, but the mist's paper wash is a static polygon at opacity 1 and neither wipe has a duration. Is the mist shot the erase in progress, or an already-erased hold?
7. What does the mist hand to the close? Its `transitionOut` is a wipe; if the close is a new sheet the wipe is paper-to-paper, and if it is the same sheet the wipe does nothing.
8. What is `names` in a non-wedding film, and how long may it be? At 9:16 it is one line in a 0.50-wide box with no character limit; a surname overflows.
9. Can `content.venue` be a bare address? The title reads it as a place and every specimen reads it as a measured label; one value must serve both.
10. May a quote stand unattributed? Its attribution can only take the caption, which is also the specimen note and the close's line.
11. Can one running note point at two different subjects, a latch and a stair? Is that a refrain, or is a repeated note only for the same feature?
12. Is `date` one date for the title and the close? A span at the title and a single date at the close cannot both be had, and the pack never says whether a range is a valid label.
13. The close's seal has no entrance op and the "one quiet stamp thump" has no cue: does the thump land at the shot's first frame or at the end of the paint-in?
14. Is the title's type painted in at 1.8 s, or set? The authoring log says the title "is painted in"; the 1.2/1.8 s rule names the arch but not the type, and the recipe has no text op.
15. Does "one readable line" mean one sentence or one typographic line? The 9:16 quote box sets about 19 characters a line, so a 12-word line is three or four lines.
16. `hashtag`, `rsvp` and `photos.*` are read by no recipe: should a brief carry them empty, or omit them?
