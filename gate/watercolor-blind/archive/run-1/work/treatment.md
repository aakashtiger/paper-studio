# Treatment — The Last Inventory

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` — the gate | 5.0 | Paper is the white: the sheet is the ground and the horizon wash fades into paper, never into white paint |
| 2 | `watercolor_specimen` | `detail` — the kitchen window latch | 5.0 | Pooled edge: one polygon, three passes, darker only where the three edges disagree |
| 3 | `watercolor_quote` | `quote` — twelve stairs | 5.0 | Annotation leader: the line grows from the note to the worn nosing |
| 4 | `watercolor_specimen` | `detail` — the front-door key | 5.0 | Flying white: five bristle tracks break into dashes on the bow; the string stays one clean stroke |
| 5 | `watercolor_mist` | `transition` — the erase | 5.0 | Paper is the white, again: the world is misted back to the sheet with paper at 80%, not white |
| 6 | `watercolor_close` | `close` — the keyhole | 5.0 | Painting-in withheld: the escutcheon stops one pass short and the edge ends mid-stroke, with no outline to close it |

The route is the pack's own vertical page — a specimen, a note, a second plate, a mist, a close — with a title page in front. The repeat is the specimen, which is the native repeat: the pack's page skeleton already asks for "a second plate".

30.0 s = six 5.0 s shots = six bars of the pack's 48 BPM grid (one 4-beat bar is 5.0 s, so 30 s is six bars). Fit: the six minima sum to 26 s and the six maxima to 50 s, and 5.0 s sits inside every recipe's own range (4–8, 5–10, 4–8, 5–10, 4–7, 4–7). Paint-in is 1.2 s, so each plate paints for 1.2 s and is looked at for 3.8 s.

Palette `garden-day`, spent as two hues and a stamp: sage wash, `deep` as the same wash at three passes, ink, and one vermilion mark — the removal dot on the gatepost (shot 1), on the key (shot 4) and on the close (shot 6). The only rose in the film is the quote's wash in shot 3, painted as the late light on the stair wall: three irregular passes whose edge stops short of the text's line ends, so the words sit on paper and not on a panel. No other frame carries `petal`, so the film cannot be mistaken for the pack's rose-and-sage wedding page.

Sound: solo felt piano under shots 1–4, out at 20.0 s; the mist is paper and room only; the close carries one quiet stamp thump and no music.

## Invariants

- **Paper is the white:** Shots 1 and 5. Shot 1 sits on the sheet itself (#f3ead9); the horizon wash is sage at 35% and its lower edge fades into paper-coloured mist, never into a white shape. Shot 5 is the proof: the mist is `paper` at 80% with a paper stroke at 90%, so the erase is the sheet itself. No frame contains pure white paint.
- **Flying white:** Shot 4. The key's bow is a single wide stroke (well over 6 px) carrying five bristle tracks that break into dashes as the brush lifts; the key's string is a rigger line, one clean stroke with no tracks. Shot 1's garden arch carries three to seven tracks across its wide leaf masses.
- **Pooled edge:** Shot 2. The wash behind the sash is the same polygon three times with jittered vertices, so the plate has a wet dark border on one side and a dry thin one on the other, and the edge darkens only where the passes disagree. Shot 3's rose wash takes the same three passes at 18%.
- **Painting-in:** Shot 2, in order: sash bar, brass plate, two screws, then the pooled edge — 1.2 s from first stroke to last, structure before detail. Shot 4 repeats the order. Shot 6 repeats it a third time and stops one pass short, which is the whole point of the close.
- **Annotation leader:** Shot 2. The leader grows out of the note at (0.80, 0.26) to the latch at (0.62, 0.32), then the Caveat note is written left to right over its 12 px paper halo; the note sits in the right margin and never crosses the plate. Shot 3's leader runs from the note to the worn nosing at the stair's edge.
- **No vector outline:** Shots 2, 4 and 6. Every edge is a darker brush stroke whose width changes along its length: the latch plate's edge thickens at the corner and thins to nothing along the top run. In shot 6 the edge simply stops mid-stroke where the painting is left unfinished — there is no uniform line anywhere to close it.

## Questions

The full list is in `questions.md`. The six that bear on this film:

- **The walk cannot fit.** `watercolor_walk` needs 12 s minimum; the six recipe minima sum to 33 s, so no 30 s six-shot film can use all six contracts. My route repeats the specimen instead. Is that the intended reading of "six shot contracts"?
- **Allocation.** The recipe defaults sum to 36 s, so the resolver cannot use them raw. Is an equal 5.0 s split guaranteed? The treatment depends on it, and it is the only split that also lands on the bar grid.
- **A repeated beat role.** I need `detail` twice. Is a duplicate role legal in `sequence`, and does it reuse `watercolor_specimen` with its own 5.0 s?
- **One caption for every note.** Specimen, quote, walk and close all bind `content.caption`, so the same two words are the note in shots 2, 3, 4 and 6. I wrote them as a refrain; the pack never says a note may repeat.
- **9:16 type.** The boxes and type scale are authored once, but the 9:16 page is "a different composition". At 390 × 693 the title box is 226 × 125 px and the subtitle box 195 × 55 px, which cannot hold this subtitle at a 64 px display size. This treatment assumes the resolver recomposes the boxes and drops the display size; if it does not, shot 1 fails on legibility.
- **Title against the arch.** In `watercolor_title` the garland runs x 0.02–0.38, y 0.12–0.62, straight under the title and subtitle boxes at 0.9 opacity, against "no text over the subject". One of the two must move.
