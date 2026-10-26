# Treatment — Before the Keys

A 30-second, 9:16 page film for a house in its last week. **a house measured for sale** is
fictional: an empty 1930s semi-detached house, sold on 22 June 2026, walked
through once on the afternoon of 21 June. The film looks only at the places
where the paint stopped short of the edge — around a latch, along a sill, around
a hook, at the corner of a jamb. Two written lines, one hand note, one stamp.

Nothing here is the pack's garden wedding: no couple, no long table, no roses.
There is no on-camera cast and no photograph; the house appears as painted
forms, a name, a stamp and a monogram.

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` | 4.667 | Painting-in — the arch and its fanlight bars paint in at 1.8 s over the sheet |
| 2 | `watercolor_specimen` | `detail` | 5.833 | Annotation leader — a 1.5 px rigger from the hairline of bare wood to the note |
| 3 | `watercolor_specimen` | `detail` | 5.833 | Flying white — the wide stroke runs dry on the sill and breaks into bristle dashes |
| 4 | `watercolor_quote` | `quote` | 4.667 | No vector outline — the key is two pooled ink passes, never a contour |
| 5 | `watercolor_mist` | `transition` | 4.500 | Paper is the white — the film's only empty frame ends on the sheet |
| 6 | `watercolor_close` | `close` | 4.500 | Pooled edge — the last wash stops and pools at the jamb, leaving the paper gap |

**Duration fit.** Minimums 4 + 5 + 5 + 4 + 4 + 4 = **26 s**; maximums
8 + 10 + 10 + 8 + 7 + 7 = **50 s**; 26 ≤ 30 ≤ 50, so the route fits. Every shot
starts at its minimum (26.000 s). The 4.000 s remainder is shared by remaining
capacity 4 / 5 / 5 / 4 / 3 / 3 = 24 s, at one sixth of each shot's capacity:
title +0.667, specimen +0.833, specimen +0.833, quote +0.667, mist +0.500,
close +0.500. The floors total 3 998 ms; the remaining 2 ms go to the two
largest fractions, shot 1 and shot 4 (both .667 — two milliseconds are
available, so both receive one). Final allocation:

`4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500 = 30.000 s`

This is not an equal split: the two specimens carry the most paint and take the
most time, the mist and the close take the least. Timecodes: 0.000 · 4.667 ·
10.500 · 16.333 · **21.000** · 25.500 · 30.000.

**Why this route.** There are five page contracts and six shots, so exactly one
contract repeats; `detail` repeats because a field journal looks twice, at the
front door and at the kitchen window. `watercolor_walk` is not used: it is the
16:9 scroll's move, its 12 s minimum cannot fit a 30 s page, and this is a
locked sheet, not a handscroll. `open` and `list` have no recipe. The mist sits
directly after the quote, so the quote's outgoing wipe and the mist's wipe are
one erase; there is no page turn between them. Shots 2 and 3 are one
`sequence` entry with `count: 2`, so the six shots come from five entries.

**Director choices.**

- **Paint-in speed: 1.8 s** per painted form — the arch, both specimens, the
  quote's key, the close's unfinished wash. 1.8 s is the slower of the pack's two
  options and it is what a last walk-through feels like. The mist is a wipe, not
  a paint-in, and takes no paint-in time.
- **Palette: `garden-day`** — paper `#f3ead9`, ink `#2f2a24`, wash `#9fb7a4`
  (the hedge, the hall), petal `#d9a6a0` (the front door, the sill, the object
  wash), accent `#c65438` (the seal). `deep` is the wash at three passes, never a
  sixth tube. Pigments per frame: shot 1 five (the ceiling, stated openly), shots
  2–4 four, shot 5 one at the end, shot 6 four.
- **Sound.** Solo felt piano, an original five-note motif, in under the title and
  out at 21.000 s. Foley: paper brush rustle on each of the five paint-ins;
  pencil scratch as each hand note reveals (shots 2–4); a soft page turn at
  10.500 s and 16.333 s; one quiet stamp thump at 26.100 s when the close's seal
  lands. The title's seal arrives with paper only — the pack allows one thump and
  it is spent at the close. No voice: the film already carries two written lines
  and one note, and a read would double them. Nine seconds of paper and room
  from the mist through the close.
- **Seed** is the lead's, as the guide requires; no seed appears in either JSON
  file.
- **Camera** is the recipes' own, nothing added: title push-in to 1.04, both
  specimens to 1.06, quote, mist and close static. No pan, no tilt, no walk. The
  48 BPM grid is used only as a breath reference; no shot boundary is cut to it.
- **Scale.** Authored at 390 px wide (390 × 693). Type at 44 / 24 / 24 / 14 / 18.

**9:16 recomposition.** Every op follows its recipe's `vertical` array into
`tokens.layout.aspectBoxes.9:16`; no 1:1 box is stretched. Shot 1 uses `title`,
`subtitle`, `names`, `arch`, `horizonWash`, `seal`, `monogram`, `labelVenue`,
`labelDate` — title and words in the left column, the arch on the right, the
seal in the top margin, the horizon full width (allowed to stay full width). The
two specimens use `specimenWash`, `specimen`, `specimenLeader`, `specimenNote`,
`label`; the note sits below the specimen at 0.6 of the page width. The quote
uses `quoteWash`, `quoteObject`, `quoteLeader`, `quote`, `quoteNote`. The close
uses `closeDetail`, `closeWash`, `closeGap`, `closeSeal`, `closeMonogram`,
`closeNote`, `closeDate`. The mist has no `vertical` array: it is a full-frame
wipe.

Both 1:1 leader paths were checked against the 9:16 leader boxes rather than
redrawn, because they already land inside them: the specimen leader runs
(0.43, 0.50) → (0.40, 0.60) inside `specimenLeader` (0.40–0.43 × 0.50–0.60), and
the quote leader runs (0.60, 0.54) → (0.50, 0.62) across `quoteLeader`
(0.50–0.60 × 0.54–0.62). What changes is what the leader points *at*, not where
it is drawn.

**What is painted, shot by shot.**

- **1 · title · 0.000–4.667.** a house measured for sale's front. A full-width horizon wash for
  the hedge and the road; the arched fanlight and the front door on the right in
  petal; the vermilion seal in the top margin with `H/M` beneath it. Painted:
  the hedge line (three wash passes), then the arch and its four fanlight bars,
  then the door. Reads *Before the Keys* / *a house, one last afternoon* / *the
  a house measured for sale* in the left column; `A HOUSE MEASURED FOR SALE, 4 PM` and `21 JUNE 2026` at
  the foot. The title is a title plate: no hand note.
- **2 · specimen · 4.667–10.500.** The front door's latch and the hairline of
  bare wood where the brush stopped short of it. The stile is one stroke of the
  wide brush; it runs dry before the latch plate, leaving the hairline and six
  bristle tracks that break into dashes behind it. Then the rail, then the
  cut-in round the latch — the latch is ink-grey at two passes, no highlight and
  no metal sheen. The hand note sits below the specimen and its leader ends on the
  hairline, not on the latch. Note: `the paint stops short here`.
- **3 · specimen · 10.500–16.333.** The kitchen window's sill, its paint
  stopping short of the edge, the bare wood gone grey. Painted: the sill's
  length with the wide brush (dry at the far end), then the shallow dip where
  someone leaned, then the grain in the washed area. The edge-wash is three
  passes of one polygon; the pooled line is the deepest value and is wash ×3,
  not a darker tube colour. Leader to the bare edge. Same note, same label — a
  running note, not a second one.
- **4 · quote · 16.333–21.000.** The back door's hook and the key still on it,
  with the small ring of unpainted wall the brush left around the hook. The key
  is two passes of ink — bow, shank, bit — with a pooled edge and no highlight,
  no foil, no brass. Petal object-wash behind it, a band of hall sage below.
  Left: *The rooms are empty; the light still arrives at four.* Right, on the
  leader: `the paint stops short here`.
- **5 · mist · 21.000–25.500.** No subject. A paper-coloured wavy edge rises
  from the lower third, passes over the key and the hook, and `mist-full`
  finishes the pass. The shot is the erase in progress, not an erased hold; it
  ends on blank sheet with no ghost, no caption, no accent and no music.
- **6 · close · 25.500–30.000.** The hall's skirting and door jamb. The last
  wash runs the length of the skirting, pools at its edge and stops before the
  corner, leaving the paper gap at the right (`closeGap`) — the sheet showing
  through, not pigment. Seal top-left, `H/M`, the closing note
  `the paint stops short here` as the refrain, `21 JUNE 2026`. Held to 30.000 s.

## Invariants

- **Paper is the white:** Every frame sits on the warm cotton sheet, and no white
  paint appears anywhere. The proof is shot 5: `mist-full` covers the last of the
  quote's pigment and the film's only completely empty frame is paper, not white,
  with no ghost through it. Shot 6 completes the argument — the `paper-gap` at the
  jamb is the sheet itself, not an opaque fill — and shot 1 shows the same sheet
  under a horizon wash that is three passes of transparent sage.
- **Flying white:** Shot 2. The door's stile is one stroke of the `wide` brush
  (8 px at the 390 px authoring width, above the 6 px bristle threshold), and it
  runs dry before the latch plate: six bristle tracks break into dashes and the
  stroke ends in the hairline the note points at. The film's subject and its
  brushwork are the same event. Shot 3 repeats it at the far end of the sill and
  shot 6 on the leading edge of the unfinished wash. By contrast the leader lines
  are 1.5 px rigger and the stems of the hedge are one clean stroke — no bristles
  on thin marks. *Honest limit:* no recipe carries a stroke-width op, so the pack
  lets this be requested in the treatment but not fixed in the format; see
  Questions.
- **Pooled edge:** Shot 3's sill edge is three passes of one polygon with
  jittered vertices, so the edge darkens where the passes disagree; the deepest
  value is wash ×3 (`deep`), not a darker pigment. Shot 6's last wash pools the
  same way where it stops. Shot 1's horizon carries the same three-pass edge
  along the hedge. No edge in the film is a uniform line.
- **Painting-in:** Every painted form, at the director's 1.8 s. Shot 1's arch
  paints opening, then jambs, then fanlight bars; shot 2's door paints stile,
  then rail, then the cut-in round the latch; shot 3's sill paints length, then
  dip, then grain; shot 4's key paints bow, then shank, then bit; shot 6's wash
  runs until it stops. Structure before detail in every case, and no form is
  revealed finished. There is no walk in this format, so nothing pans over a
  completed painting.
- **Annotation leader:** Shots 2, 3 and 4. Each note is Caveat drawn twice over a
  12 px paper-coloured halo, revealed left to right, with a 1.5 px rigger leader
  that grows to the subject. Shot 2's leader ends on the hairline between paint
  and latch plate; shot 3's on the sill's bare edge; shot 4's on the ring around
  the hook. The notes sit in `specimenNote` and `quoteNote`, below or beside the
  subject, and never cover it; the labels stay at 0.82 and touch nothing. Shot 6
  carries the closing note without a leader — the close recipe has no leader op,
  so the leader-bearing annotation layer is shots 2–4 only.
- **No vector outline:** The door edge (shot 2), the sill edge (shot 3) and the
  key (shot 4) all end in a darker brush stroke of the same pigment that varies in
  weight and stops; the key is two pooled ink passes with no contour. Shot 1's
  arch is an image asset, not a stroked path. Shot 5 is a wavy paper shape with a
  soft rising edge, not a vector cloud. Nothing in the film is a vector shape
  filled with a watercolour texture, and nothing carries a uniform outline.

## Questions

All six invariants are reachable on this route; none is missing. Flying white is
the one the pack only lets me request, not fix. Full detail in `questions.md`.

- Which of the five page contracts should a six-shot page repeat? The pack allows
  a repeat but gives no rule for choosing one; `detail` is my choice and its cost
  is one caption under two different subjects.
- Two page turns arrive 5.833 s apart (10.500 s and 16.333 s). No rule limits how
  often a page turn may occur.
- The caption appears four times — two specimen notes, the quote's note, the
  close's refrain. Is that still a refrain?
- Where does the quote's wipe hand over to the mist, and how long is `mist-full`
  held? At 4.500 s the mist could erase in 1.5 s and leave three seconds of blank
  sheet; the pack does not say whether that hold is allowed.
- Neither schema names which forms are painted with the 8 px `wide` brush, so
  flying white can be asked for but not guaranteed.
- Does the 14 px floor scale with the page, or stay 14 px absolute on a larger
  frame?
- Is "music out from the mist" measured from the mist's first frame or from
  `mist-full`? Here it decides up to 4.5 s of score.
- The title and the close both carry the seal, but only one stamp thump is
  allowed. Which one?
- `names` is required by the title recipe; for a house subject it nearly
  duplicates `venue`. Is that duplication intended?
- `monogram` for a place rather than a couple: is it in grammar, and is
  0.1 × 0.05 really a two-character box?
- `body` as the film's own line, with no attribution slot: is an original line
  allowed in the quote?
- One `venue` for two rooms: the guide's example (`KITCHEN, 11:40`) reads
  per-plate, but S1a cannot hold two values. Is a house-and-hour label the
  intended use?
- May `photos`, `hashtag` and `rsvp` be omitted from the brief entirely? No
  recipe reads them and the style refuses photographs.
