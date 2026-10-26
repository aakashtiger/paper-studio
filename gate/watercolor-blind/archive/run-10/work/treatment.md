# Treatment — The Room in Blue

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | watercolor_title | title | 4.667 | Painting-in |
| 2 | watercolor_specimen | detail | 5.833 | Annotation leader |
| 3 | watercolor_specimen | detail | 5.833 | Flying white |
| 4 | watercolor_quote | quote | 4.667 | Pooled edge |
| 5 | watercolor_mist | transition | 4.500 | Paper is the white |
| 6 | watercolor_close | close | 4.500 | No vector outline |

**How the 30 s is shared.** The six minima sum to 26 s, so 4 s remains. It is shared by remaining capacity — 4 / 5 / 5 / 4 / 3 / 3 s of headroom, 24 s in total — floored to whole milliseconds, with the two spare milliseconds going to the largest fractional remainders (shots 1 and 4). The result is 4667 + 5833 + 5833 + 4667 + 4500 + 4500 = 30000 ms. Nothing is an equal 5.0 s split: the specimens are the longest shots and the mist and close the shortest.

**What is painted, shot by shot.** One plate per page; the second specimen is a second page, not a second panel.

1. **Title.** The arch of the blue door at the right of the sheet, a horizon wash behind it at 0.55, the vermilion seal stamped in the top margin, the monogram under it. The title, subtitle, names, place and date are set in the left column. The arch paints first, then the lettering; the push-in (1.0 to 1.04) is already running.
2. **Specimen — the latch.** The brass window latch, the 11:40 light pooled on the lever. The wash sits behind it; the leader is re-anchored from the 1:1 path to run from the specimen's right edge into the `specimenNote` box at 0.70, and the note is written there. The page turns out.
3. **Specimen — the key.** The key left on the window sill, bow turned to the room. The broad wash along the sill and across the key's bow is the wide stroke that carries flying white; the key's shaft and the leader stay one clean rigger line. Same page, same running note, new subject: the film looks once at the lock and once at what was left in it.
4. **Quote — the chair.** The empty chair at the window, back to the room, painting in at the right; the wash under it; the line at 0.08/0.24; the note below the line; the leader from the chair's lower-left into `quoteNote`. No attribution: the line is the owner's, written into the treatment, not spoken.
5. **Mist.** The quote plate is erased, not replaced: the chair, the line and the note go back to paper under the rising wavy edge, which crosses the whole frame across the shot's 4.5 s, with `mist-full` landing on the last frame. It is the erase in progress, never an erased hold. No caption. Music is already out.
6. **Close.** The curtain hem at the window edge, unfinished: the last wash pass stops short and the 0.82 paper gap is the bare sheet, not a sketch and not a fade. The seal returns at the left margin, then the monogram, the closing refrain and the date, then the hold. The seal is the same mark as the title's, moved, not a second stamp.

**Director choices (for the lead to record).** Palette `evening-blue` — blue-grey wash, ochre petal, one vermilion accent; paper stays #efe6d4 and is never replaced with pure white. Paint-in **1.8 s** per painted form, so the arch, both specimens, the quote's chair and the close's hem all take the same slow speed. Camera is exactly what each recipe fixes — push-in 1.0 to 1.04 on the title, 1.0 to 1.06 on each specimen, a static quote, a static frame for the mist's wipe, a static hold for the close; no move is overridden and no move exceeds six percent. Sound: a wordless three-note felt-piano motif, unhurried, riding the 48 BPM breath grid but not locked to it; paper-brush rustle at every paint-in, pencil scratch for the three hand notes, one soft page turn between shots 2 and 3; music out at the mist and absent through the close; one quiet stamp thump as the seal presses in shot 6; no voice, because the film's words are lettering and a voice would fight the hand. Seed: the lead's integer, recorded at resolve, not a brief or format field. All names, dates and places are fictional.

## Invariants

- **Paper is the white:** every frame is the sheet, and the film never paints white — the mist's final pass is a paper-coloured wash (`mist-full`) that returns the whole frame to #efe6d4 (shot 5), and the close's gap at 0.82 is bare sheet showing through the unfinished wash (shot 6). The sheet is also the ground the title's horizon sits on (shot 1) and the white every paint-in plate is read against.
- **Flying white:** the broad sill wash and the key's bow in shot 3 are wide strokes at the output frame and carry the 3–9 bristle tracks broken into dashes; the title's full-width horizon wash in shot 1 is the second wide stroke. The key's shaft, the stems and every leader line are rigger strokes and stay clean — one line, no noise. (Which ops clear 6 px at 390 px is a pack gap; see Questions 4.)
- **Pooled edge:** the `quoteWash` under the chair is three passes of the same jittered polygon, so its edge darkens where the passes disagree (shot 4), and the `specimenWash` behind the latch does the same (shot 2). The mist's rising edge in shot 5 is a wet paper edge with the same pooled darkening, not a soft vector cloud.
- **Painting-in:** the arch and lettering build stroke by stroke in shot 1, the latch in shot 2, the key in shot 3, the chair in shot 4 and the curtain hem in shot 6, each over 1.8 s, structure before detail. No pan runs over a finished painting: the walk is not in this format, and the three pushes are six percent or less and uncover nothing new.
- **Annotation leader:** the Caveat note sits on a leader line in shot 2 (to the latch lever), shot 3 (to the key's bow) and shot 4 (to the chair's back), re-anchored from the 1:1 paths to the 9:16 `specimenNote` and `quoteNote` boxes; each note is written twice over a paper halo, left to right, with pencil scratch. The title carries no hand note, the mist carries none, and the close's line is lettering rather than a leadered note.
- **No vector outline:** nothing in the film has a stroked contour. The latch, the key and the chair end on the darkest wash pass, not on a line; the close's last pass stops before the hem's edge so the boundary is a loaded-brush edge with the paper gap beside it (shot 6). The seal is a stamp, and the type is type.

## Questions

- The 9:16 `specimenNote` box is 0.22 wide by 0.18 high — about 86 px at 390 px — which is roughly 8 characters per line at caption 24 px, so the two-line rule caps the note near 16 characters while the pack states only a 16-word cap. Which limit binds, and may a note use the wider `note` box instead?
- `names` is one line in a 0.5 by 0.06 box — about 18 characters at body 24 px — but the pack gives no character budget and the 16-word cap cannot bite there. Is `names` allowed two lines or two people?
- The pack allows a repeated page contract but gives one value per slot, and it says per-shot subjects live only in the treatment because per-instance subjects are S2. What is the second specimen expected to paint in a sealed run, and does the gate accept one note appearing four times (two specimens, quote, close)?
- The 6 px bristle threshold is defined at the output frame, but no stroke widths are authored in tokens or recipes, so an author cannot compute which strokes carry flying white at 390 px. Which ops are wide strokes and which are rigger lines?
- The quote's note slot is `content.caption`, the same slot as the running note, so a film with specimens and a quote cannot also attribute the line unless attribution goes in `body`. Is an unattributed line allowed?
- The mist recipe draws its own `paper` layer at z0 and an opaque `mist` above it, yet the pack says the mist composites over the outgoing shot. How is the outgoing frame carried under the mist, and is the recipe's own paper layer suppressed?
- The quote and the mist each end on `wipe`, and the pack says those two wipes are one erase. Are they merged into one transition, and how does the author declare that when neither schema has a per-shot transition field?
- Should the mist's rising edge fill its whole allocated 4–7 s, and where exactly does `mist-full` land? A 4.5 s erase is slow, but an early `mist-full` would leave the already-erased hold the guide forbids.
- When does the close's one quiet stamp thump land — as the seal appears, as it presses, or on the hold — and how long is it?
- Does the title's lettering paint in at the same 1.8 s as the arch, and does the push-in begin before the title is legible?
- The monogram role is mapped to Cormorant but the pack does not say whether the value is initials, a name or a mark; and the card shows the seal rotated −4° while the recipe carries no rotation. Is the monogram a mark or words, and does the seal keep one angle and opacity when it moves between title and close?
