# Treatment — The Halyard Tune

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | watercolor_title | title | 4.667 | Flying white |
| 2 | watercolor_specimen | detail | 5.833 | Annotation leader |
| 3 | watercolor_quote | quote | 4.667 | Pooled edge |
| 4 | watercolor_mist | transition | 4.500 | Paper is the white |
| 5 | watercolor_specimen | detail (return) | 5.833 | Painting-in |
| 6 | watercolor_close | close | 4.500 | No vector outline |

A field-journal memory of the boat Elin and Tam left at Slipway 3 in late October. Six locked vertical pages, no walk. Page 1 is the shed door open on the water: the title, subtitle, names, place and date in the left column, the door frame and near water laid in wide dry-brush strokes, the vermilion seal and monogram in the top-right margin. Page 2 is the halyard rope coiled on the bench, painted from the outer loop to the frayed end, with the hand note "the wind keeps the tune" on a leader. Page 3 is the tune's line, "Three notes on the halyard, every Sunday," beside a boat block on a petal wash, with the same note on a second leader. Page 4 is the paper mist: it rises through the quote and ends on full sheet, so the quote's outgoing wipe and the mist's wipe are one erase. Page 5 is the same bench plate after the erase: the same composition, the same note and label, the rope a month drier and salt-stiff. Page 6 is an unfinished oar blade on the right, its last wash stopping short of the tip; on the left, the seal, monogram, closing refrain and date, then a hold.

Fit: the six minima are 4 + 5 + 4 + 4 + 5 + 4 = 26 s; the six maxima are 8 + 10 + 8 + 7 + 10 + 7 = 50 s. The resolver starts each shot at its minimum and shares the 4 s remainder by remaining capacity (4 + 5 + 4 + 3 + 5 + 3 = 24 units), giving 4.667 / 5.833 / 4.667 / 4.500 / 5.833 / 4.500 s — not an equal split; the six sum to 30.000 s. The page uses the 9:16 boxes; the walk is not used because its 12 s minimum cannot fit a 30 s six-shot page. The paint-in speed is not set here; it is the director's choice.

## Invariants

- **Paper is the white:** Shot 4, the mist. The paper-coloured wash rises through the quote and ends on full sheet; the final state is the warm sheet, never a pure-white fill. Shot 6 repeats the proof as the paper gap at the oar's tip: the last wash stops short and the sheet shows through, not a painted highlight. Every light value in the film is the paper, not white paint.
- **Flying white:** Shot 1, the title. The shed's door frame and the near-water band are wide dry-brush strokes; five bristle tracks break into dashes across the upright and the water's edge. The rope's thin edge in shot 2 gets one clean rigger stroke, not noise, so the wide-versus-thin contrast is visible.
- **Pooled edge:** Shot 3, the quote. The petal object-wash under the boat block is three passes of the same polygon with jittered vertices; its lower edge pools dark where the passes disagree. The wash reads as light on the bench, not a cast shadow. Shot 2's edge-wash pools the same way behind the rope.
- **Painting-in:** Shot 2 is the reference: the rope coil builds from the first outer loop to the last frayed end, structure before detail, and the note and leader follow the form. Shot 5 repeats the same rule on the return plate, the rope a month drier. The title's arch and the quote's block paint in by the same rule; the mist is a wipe, not a paint-in. The speed is the director's choice (1.2 s or 1.8 s); this treatment does not set it.
- **Annotation leader:** Shot 2, the specimen. The Caveat note is drawn twice over a paper-coloured halo, revealed left to right, and the rigger leader grows from the note to the rope's coil. Shot 3 repeats the device: the same note on a leader to the boat block. Shot 6's closing line is a closing line, not a leader note; the pack allows the close to carry a closing line and a date.
- **No vector outline:** Shot 6, the close. The unfinished oar blade is built from wet strokes; its edge is a pooled wash edge, not a drawn contour, and the paper gap is a sheet-coloured gap, not an outline or a filled shape. The same is true of the door frame, the rope, the block and the wash edges in shots 1–5; the only lines are the rigger leaders and the hand note.

## Questions

- **Paint-in speed:** 1.2 s or 1.8 s per painted form? The title's door frame, the first rope, the quote's block, the return rope and the oar all paint in. The treatment defers to the director and does not choose.
- **Palette:** the brief and format schemas have no palette field. This treatment assumes the default `garden-day`; if the director wants `evening-blue` for the dusk slipway, where is the palette declared or overridden?
- **Repeated specimen, different state:** can the return plate carry the same rope a month drier, or does the repeated recipe resolve to the identical image until per-shot content is S2? The format has no per-shot subject field.
- **One caption across three page contracts:** `content.caption` is a leader note in the specimen and quote and a closing line in the close. Is one value allowed to do both jobs, and is the quote's note allowed to be the same refrain rather than an attribution?
- **Venue repetition:** `content.venue` appears on the title and both specimen plates. Is that a running label, or should the return plate carry a second place label? One value per slot; per-shot labels are S2.
- **`aspectRules`:** `APPLICATION.md` points to `tokens.layout.aspectRules.9:16`, but `tokens.json` has `aspectScale` and `aspectBoxes` and no `aspectRules`. Are the boxes plus the margins and safe zones the rules, or is a key missing?
- **Title size at 9:16:** `tokens` and `STYLE.md` say 44 / 24 / 24 / 14 / 18; the card's phone SVG draws the title at 32 px, names at 16 px and the date at 8 px, below the 14 px floor. Which is normative, and is a three-line "The Halyard Tune" acceptable in the 0.22 h title box?
- **Names and labels over the horizon wash:** the 9:16 `names` box and the venue label sit inside the `horizonWash` box; the date label overlaps its lower edge. Is text over a background wash allowed without a paper halo, or should it be haloed like a hand note?
- **Quote object-wash:** is the petal wash under the quote's object a ground/light wash or a cast shadow? The style refuses cast shadows; this treatment paints it as reflected light.
- **Second plate after the mist:** the mist follows the quote so the two wipes are one erase, then the return specimen paints on the fresh sheet and the close holds. Does "music out from the mist through the close" allow a painted plate after the mist if it is paper and brush only, or should the mist be the penultimate page?
- **Sound:** the pack supplies no audio. The treatment proposes a cleared felt piano with a three-note halyard motif, paper/brush foley for each paint-in, pencil scratch for the hand notes, one soft page turn and one stamp thump at the close; music out from the mist through the close, paper and room only; no voice. Does the director want a voice, and is the three-note motif score or foley?
