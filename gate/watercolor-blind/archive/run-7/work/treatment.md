# Treatment — A Tune for the Back Room

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` | 4.667 | Flying white — the door frame's wide timber strokes break into bristle dashes |
| 2 | `watercolor_specimen` | `detail` | 5.833 | Painting-in — the geranium, pot rim to leaf tip, over 1.8 s |
| 3 | `watercolor_specimen` | `detail` | 5.833 | Annotation leader — the note grows on a rigger to the key's bow |
| 4 | `watercolor_quote` | `quote` | 4.667 | Pooled edge — three passes disagree at the cup's rim and base |
| 5 | `watercolor_mist` | `transition` | 4.500 | Paper is the white — the paper-coloured erase returns the sheet |
| 6 | `watercolor_close` | `close` | 4.500 | No vector outline — the unfinished leaf has no terminal edge |

**The film.** Not the pack's garden wedding: no garden, no couple, no long table,
no weather. One back room at 4:10 in October, read as six field plates. A fictional
songwriter, Iona Vell, has left the room as it was; the tune was never written
down, so the film looks at the room instead of the song. No person on camera, no
instrument, no notation, no lyric, no song title. Shot 1 is the way in, shots 2 and
3 are two plates on a spread (the living thing, the key), shot 4 is the line about
the room, shot 5 is the erase, shot 6 is the unfinished last mark.

**Allocation (not an equal split).** Σ min = 4 + 5 + 5 + 4 + 4 + 4 = 26 s; target
30 s; remainder 4 000 ms. Capacity = (8−4) + (10−5) + (10−5) + (8−4) + (7−4) +
(7−4) = 4 + 5 + 5 + 4 + 3 + 3 = 24 000 ms. Share = 4 000 × capacity / 24 000 =
666.667, 833.333, 833.333, 666.667, 500, 500 ms; to the nearest millisecond
667 / 833 / 833 / 667 / 500 / 500 = 4 000 ms. Shots: 4.667, 5.833, 5.833, 4.667,
4.500, 4.500 s = 30.000 s. The two plates take the largest share, the title and the
quote next, and the mist and the close the smallest. The walk is not used: its 12 s
minimum belongs to the 16:9 scroll and cannot fit a 30 s six-shot page. The timing
is not beat-locked to the 48 BPM grid, which the style allows.

**9:16 boxes.** The page is composed on `tokens.layout.aspectBoxes.9:16` (44 / 24 /
24 / 14 / 18 px on a 390 px page), not stretched from the 1:1 boxes.

- Title: `title`→`title`, `subtitle`→`subtitle`, `names`→`names`, `arch`→`arch`
  (right column, door standing open), `seal`→`seal`, `monogram`→`monogram`,
  `venue`→`labelVenue`, `date`→`labelDate`. The title box ends at x 0.58 and the
  arch begins at 0.58, so the left column and the right arch do not overlap; the
  `horizon` wash has no 9:16 box and is used as authored as a page-relative floor
  line at y 0.58.
- Specimen: `specimen`→`specimen`, `note`→`specimenNote`, `place`→`label`. Each
  form is painted left of x 0.54 so the note sits on paper; the leader is
  re-anchored from the note's left edge (≈0.55, 0.40) to the painted stem
  (≈0.45, 0.52).
- Quote: `object`→`quoteObject`, `quote`→`quote`, `note`→`quoteNote`. The leader
  runs from the note's upper right (≈0.50, 0.60) to the cup's lower left
  (≈0.62, 0.56). The `object-wash` has no 9:16 box; it is re-anchored under the cup
  at y 0.50–0.62 so it does not fall below the object.
- Mist: no `vertical` array and no slots; the paper wash is used as authored.
- Close: `detail`→`closeDetail`, `unfinished-wash`→`closeWash`,
  `paper-gap`→`closeGap`, `seal`→`closeSeal`, `monogram`→`closeMonogram`,
  `closing`→`closeNote`, `date`→`closeDate`. The gap crosses the leaf at x 0.82.

**Painted subjects (assets are types, not subjects).**

- `prop.painted-arch` (shot 1): the back room's door frame, the door standing open,
  the room beyond left as bare paper.
- `prop.painted-specimen` (shot 2): a geranium in a chipped pot on the window sill;
  the pot's rim is one wide band, the stem one clean rigger stroke.
- `prop.painted-specimen` (shot 3): the back-door key on a blank paper tag, hung on
  its nail; the string is the "stem", the tag is left unpainted paper.
- `prop.painted-specimen` (shot 4): the cup with its teaspoon, left on the sill;
  the cup is the wide form, the spoon handle the clean stroke.
- `prop.painted-specimen` (shot 6): one geranium leaf, unfinished — the last wash
  pass stops before the tip, leaving the paper-coloured gap.
- `prop.stamp-seal` (shots 1 and 6): one seal, the same mark twice, top right on
  the title and top left on the close.
- `hud.hand-label` (shots 2, 3, 4): the Caveat note "left where it was" on a
  rigger leader, drawn twice over a paper halo, revealed left to right.

**Director choices (not carried by the two schemas; for the lead to record).**

- **Paint-in speed: 1.8 s** per painted form (the pack's open choice), applied to
  the door frame, both plates, the cup and the close's leaf. The mist is a wipe,
  not a paint-in. 1.2 s is not used anywhere in the film.
- **Palette: `garden-day`** (the default): paper `#f3ead9`, ink `#2f2a24`, wash sage
  `#9fb7a4`, petal rose `#d9a6a0`, accent vermilion `#c65438`. Five pigments at
  most in a frame; `deep` is the sage wash at 2–3 passes, not a sixth tube colour.
- **Accent:** the vermilion seal appears exactly twice, shots 1 and 6 — one mark,
  two appearances. No other frame carries it; the mist carries none.
- **Camera:** all six moves are the recipes' own — title push-in 1.0→1.04,
  specimens 1.0→1.06, quote, mist and close static. No move is invented and
  nothing pans over a finished painting.
- **Transitions:** wipe (1→2), page_turn (2→3), page_turn (3→4), wipe (4→5, the
  quote's wipe and the mist's wipe read as one erase), wipe (5→6), hold (6). No
  page turn is placed between the quote and the mist.
- **Sound:** solo felt piano, one wordless five-note motif, no drums, no voice, no
  lyric and no song title. The motif enters under the title's first stroke and
  plays through shot 4. Paper brush rustle on each of the five paint-ins; pencil
  scratch for the three hand notes; two soft page turns; one quiet stamp thump as
  the close's seal lands. Music is out from the mist (21.000 s) through the close;
  paper and room only, with the thump the one event. No audio file ships.
- **Sway:** the geranium sways at 0.01 only after it is finished (shot 2); the
  close's leaf never finishes, so it never sways. No trees.
- **Seed:** left to the lead; see Questions 10.
- **Words:** title 6, subtitle 7, names 2, date 2, venue 4, body 14 (13 words and
  the attribution dash), caption 4, monogram 1 — every slot inside the 16-word
  limit; the caption is four words and sets in two lines at worst.

## Invariants

- **Paper is the white:** Shot 5 is the proof — the mist is a paper-coloured wash,
  not white paint, and it returns the world to the sheet the film is drawn on. The
  base sheet is drawn first in shot 1 before any pigment; the geranium's highlights
  in shot 2 are paper left unpainted; the close's gap in shot 6 is bare paper. No
  frame contains pure white paint.
- **Flying white:** Shot 1 — the door frame's wide timber strokes carry 3–9 bristle
  tracks that break into dashes toward the jamb, and the floor wash's wide edge
  does the same. Shot 6 repeats it at the top of the leaf blade. The thin forms stay
  clean: the geranium's stem (shot 2), the key's string (shot 3) and the spoon
  handle (shot 4) are one stroke each, with no noise.
- **Pooled edge:** Shot 4 — the cup is three passes of the same polygon with
  jittered vertices, so the rim and the base darken where the passes disagree, and
  the wash behind pools at its lower edge. Shot 1's floor wash and shot 6's leaf
  wash pool the same way. No wash stops at the edge of its surface with a hard
  seam.
- **Painting-in:** Shot 1 the door frame, shot 2 the geranium from pot rim to leaf
  tip, shot 3 the key from bow to tag, shot 4 the cup from the ellipse to the
  handle, shot 6 the leaf — each over 1.8 s, structure before detail. Nothing is
  already painted when the camera arrives, and the only camera move after paint is
  the recipes' small push-in.
- **Annotation leader:** Shots 2 and 3 — one Caveat note, "left where it was",
  drawn twice over a paper halo and revealed left to right, with a rigger leader
  that grows to the stem (shot 2) and the key's bow (shot 3). Shot 4 repeats it to
  the cup. The note stays on paper and never crosses the painted form; the close
  carries the same words as a refrain, with no leader.
- **No vector outline:** No form is closed by a line. The specimen's edge is a
  pigment boundary, not a contour (shot 2); the key's bow is a wash edge, not a
  stroked circle, and the tag's edge is the end of the wash (shot 3); the cup's rim
  is where two passes meet, not a drawn ellipse (shot 4); the close's leaf has no
  terminal edge at all because the wash stops short (shot 6). The only lines in the
  film are the rigger leaders at 0.7 opacity and the type.

## Questions

Full wording and the arithmetic are in `questions.md`.

1. **Whole-millisecond rounding** — the 4 000 ms remainder does not divide evenly
   (666.667 / 833.333 / … ms); the pack does not say whether to round to nearest,
   floor with a remainder pass, or force the last shot. I rounded to the nearest
   millisecond.
2. **A repeated page contract** — shots 2 and 3 are both `watercolor_specimen`; the
   guide says a repeat gets its own allocation and per-shot subjects live in the
   treatment, but not whether the resolver paints a fresh second sheet or repeats
   the same picture.
3. **`content.names` outside a wedding** — the field is defined only for a couple;
   I used the tune's author, "Iona Vell".
4. **`specimenNote` overlaps `specimen` at 9:16** (0.54–0.92 against 0.20–0.80)
   while a caption over the specimen is a failure mode; no fill rule is stated.
5. **One note or two on the quote page** — the recipe carries a body quote and a
   caption note on a leader, against the style's "one note per view".
6. **Background washes missing from `vertical`** — title `horizon`, specimen
   `edge-wash`, quote `object-wash`; I re-anchored only the quote's under the cup.
7. **The mist has no `vertical` array** — I used its 1:1 page-relative polygon as
   authored at 9:16.
8. **Two wipes at the quote → mist seam** — does the resolver merge consecutive
   wipes into one erase, or play both, and which shot's time pays for it?
9. **The silence the mist forces** — 9.0 s of 30 s (30%) with the mist fifth;
   is that within the style's "structural, not a fixed percentage"?
10. **Who chooses the seed** — APPLICATION lists it as a director choice, the S1a
    notes give it to the lead.
11. **The 6 px bristle threshold** — page pixels or output pixels?
12. **The seal crosses the margins** — x to 0.96 against a 0.92 margin (and y to
    0.08 against 0.09): bleed by design or box error?
13. **Display line-height at 9:16** — 44 px with a 0.22-high title box and no
    line-height; the title sets in three lines.
14. **The title has no note** — the title recipe has labels but no leader; is the
    title exempt from the one-note rule?
15. **Unused brief fields** — I omitted `photos`, `hashtag` and `rsvp`; should they
    be present but empty?
