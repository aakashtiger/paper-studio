# Treatment — Last Inventory

A 30-second vertical page for a front room on the afternoon it is emptied. There is
no cast: the room is argued by three objects and the wear on them, and the song is
the only thing that passes through. The register is an inventory taken with
appetite — counting what is there, not mourning what is leaving. The doorway is the
film's spine: an arch at the title, the key that opens it, the stool worn where
someone sat to play, the door shut at the quote, and the same door's edge unfinished
at the close.

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` | 4.667 | **Flying white** — the doorway's broad band is laid with the `wide` 8 px loaded brush; three to nine bristle tracks break into dashes where the paper pulls the pigment. |
| 2 | `watercolor_specimen` | `detail` | 5.833 | **No vector outline** — the key is the most outline-tempting silhouette in the film and is built only from ribbon strokes; nothing is stroked around it. |
| 3 | `watercolor_specimen` | `detail` | 5.833 | **Painting-in** — the seat ring and the legs arrive first, the grain and the worn dip last, over 1.2 s under a six percent push-in. |
| 4 | `watercolor_quote` | `quote` | 4.667 | **Annotation leader** — a rigger line grows from the door's worn edge to the hand note at the foot of the line. |
| 5 | `watercolor_mist` | `transition` | 4.500 | **Paper is the white** — paper is the eraser; the shot ends on the blank sheet, and that sheet is the whitest thing in the film. |
| 6 | `watercolor_close` | `close` | 4.500 | **Pooled edge** — the last wash pass stops short and pools at its own stopping edge, with one paper-coloured gap left beside it. |

**Allocation.** Minimums 4 + 5 + 5 + 4 + 4 + 4 = 26.000 s. The remainder, 4.000 s,
is shared by remaining capacity 4 + 5 + 5 + 4 + 3 + 3 = 24.000 s, so the shares are
0.6667 / 0.8333 / 0.8333 / 0.6667 / 0.5000 / 0.5000 s. Floored to whole
milliseconds the six sum to 29 998, so the two spare milliseconds go to the two
largest remainders (0.6667, shots 1 and 4; with two spare milliseconds and two tied
shots, no earlier-shot tie-break was needed). Resolved: 4667 / 5833 / 5833 / 4667 /
4500 / 4500 ms = 30.000 s exactly. The specimens take the most because they have the
most headroom; the mist and the close take the least. This is not an equal split.

**What is painted, shot by shot.**

| # | Plate | The subject | The note, and where its leader points |
|---|---|---|---|
| 1 | title | the doorway into the front room and a horizon wash of the wall's shade; the seal stamped in the top margin | none — a title plate carries no hand note |
| 2 | specimen | the front-door key, iron, the bow worn bright where a thumb turned it | "worn where it was held" — leader to the bow |
| 3 | specimen | the piano stool, the seat dipped where someone sat | the same note — leader to the dip |
| 4 | quote | the door, painted shut, its edge worn where hands pushed it; ochre wash pooled on the floor at its foot | the same note — leader to the worn edge |
| 5 | mist | nothing; paper rising over the room | none — the mist is silent |
| 6 | close | the same door's edge, unfinished, one paper-coloured gap left at the hinge side where the light comes through | the same note as a refrain, beside the seal and the date |

**Director decisions.** The two schemas carry none of these; the lead records them.

- **Paint-in speed: 1.2 s** for every painted form — the title's door arch, the key,
  the stool, the door, and the close's last pass. On a 5.8 s specimen that leaves
  about 3.5 s of looking after the form is finished, which is where the note, the
  sway and the six percent push-in live; at 1.8 s the note would arrive two-thirds of
  the way into the page. The slowness is carried by the erase and the hold, not by
  the brush, and no form ever fades in.
- **Palette: `evening-blue`** (blue-grey wash, ochre petal, vermilion accent) on the
  warm sheet. The room faces north and the inventory is taken at 4:10, so the wall's
  shade is blue-grey and the light pooled at the door's foot is ochre; the wear on the
  wood is the same ochre laid in more passes, never a darker tube. Frame budget:
  paper, ink, wash, petal, accent — five at most. No brass anywhere: the key is iron,
  the door furniture is painted wood, so no metallic sheen can enter the film.
- **Accent:** one seal, 0.1 × 0.056, stamped top right at the title and top left at
  the close. One mark, two appearances; the mist carries none.
- **Monogram:** QH, the house's own mark in the monogram face — under the seal on the
  title plate, above the closing line at the close, 18 px at 9:16. The film names no
  one; the initials belong to the house, like a bookplate on an inventory.
- **Labels:** one date, one venue, shared as the slots require — the date on the title
  plate and the close, the venue on the title plate and both specimen pages. That is
  why the film happens in one room: "FRONT ROOM, 4:10" has to be true on every plate
  that carries it, and a label that was only true on one page would be a lie.
- **Camera:** push-in 4 percent at the title, 6 percent at each specimen, static at
  the quote, the mist and the close. `easeOut` throughout. No pan: the walk belongs
  to the 16:9 scroll and would be a lie at 9:16.
- **Transitions:** wipe out of the title; a page turn between the two specimen pages;
  a page turn into the quote; then the quote's wipe and the mist's wipe are one
  erase, with no page turn between them; a wipe from cleared paper to the close's
  paper, which is the same sheet; and a hold.
- **Sound:** one felt-piano phrase, four bars, unhurried, turning over three times —
  under the title, under the key, under the stool. At the quote it thins to two notes
  and stops on the outgoing wipe, so the song and the paint leave together; the mist
  and the close are silent. Foley: paper-brush rustle at five paint-ins (arch, key,
  stool, door, close edge), pencil scratch for the four hand-drawn lines (two
  specimen notes, the quote note, the close refrain), two soft page turns, and one
  quiet stamp thump when the close's seal lands — the only thump and the last sound
  in the film. No drums, no voice, no sung line, no lyric.
- **Seed:** the lead's integer; this treatment fixes none of the seeded surfaces
  (stroke phase, paper-fibre offset, wash-edge jitter, paint-in order, sway phase).
- **Voice:** none. The body line is read on the page, not spoken over it.

## Invariants

- **Paper is the white:** never a painted white. Shot 1 is a sheet with a horizon wash
  and a doorway on it — the light in the page is unpainted paper, and no white
  pigment is loaded. Shot 5's mist is `paper` and ends on full paper, so the eraser
  and the white are one value: the room goes back to the sheet it was painted on.
  Shot 6's gap is the sheet showing at the door's hinge edge, not a white stroke.
- **Flying white:** shot 1's doorway band, painted with the `wide` 8 px loaded brush —
  three to nine bristle tracks that break into dashes as the stroke dries. Shot 2's
  key bow and shot 3's seat carry the same wide brush on their broad passes only; the
  shafts, stems, leader lines and labels stay on the rigger at 1.5 px and are one
  clean stroke, so nothing under 6 px is asked to show bristle.
- **Pooled edge:** shot 2's `edge-wash` is three passes of one polygon with jittered
  vertices, so the edge darkens where the passes disagree; the key's shadowless
  underside is the same overlap laid twice. Shot 4's ochre `object-wash` pools at the
  door's foot, and shot 6's last pass stops mid-form and leaves a darker rim where the
  pigment settled — the close's paper gap sits inside that rim.
- **Painting-in:** every painted form arrives stroke by stroke in 1.2 s: shot 1's
  arch, shot 2's bow before its bit, shot 3's seat before its grain, shot 4's door
  before its worn edge, shot 6's last pass. Structure precedes detail in each. No
  camera move reveals a finished painting — the three push-ins are 4, 6 and 6 percent,
  and nothing pans.
- **Annotation leader:** one note per view, never over the subject. Shot 2 and shot 3
  carry the note in `specimenNote` with a rigger leader from the key's bow and the
  stool's dip; shot 4's leader runs from the door's worn edge to `quoteNote` at the
  foot of the line. At 9:16 both leaders are re-anchored to the 9:16 boxes and start
  at the painted edge inside the subject box, ending on the note's first baseline, so
  the leader reads as a line and not as a gap between two boxes. The title carries no
  note because it is a title plate; the mist is silent.
- **No vector outline:** every edge in the film is a ribbon edge, a wash stop or a
  bristle break. Shot 2 is the test: a key drawn as an outline would be a vector
  illustration, so the bow is a ribbon with a hole in it and the bit is three loaded
  strokes that overlap. The seal in shots 1 and 6 is stamped pigment with a broken
  edge, not a ring; the mist has no drawn edge at all — its wavy top is a rising wash,
  and the shot resolves to plain sheet.

## Questions

Numbered as in `questions.md`, where each one is stated in full with what I did
instead. None changes the pack.

1. One caption serves four plates (two specimen notes, the quote's note, the close's
   closing line).
2. An attributed quote is impossible while the caption is the running note.
3. The close has a subject and a closing line but no leader path.
4. `content.names` in a film with no cast.
5. One venue value on the title and both specimens.
6. At 9:16 the specimen leader is only 0.02 of the page wide.
7. `specimenNote` cannot hold the 16–18 characters per line the guide predicts.
8. The 6 px bristle threshold moves when the frame is scaled.
9. The paper gap: a stopped wash, or a paper-coloured rectangle over the detail?
10. May the same subject return on a second plate?
11. Two page turns meet between the two specimens.
12. One leader path has to serve two different subjects in a repeated recipe.
13. Music is out for 9.0 s of 30 s; may the phrase return after the stamp thump?
14. Delivery loudness has no target in the pack.
