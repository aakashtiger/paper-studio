# Treatment — A Small Inventory

*30 s · 9:16 · six shots. Mara's field page of the kitchen on Alder Row, 14 March: a darning egg, a cup and a spool of thread, collected in morning light. The caption is the refrain; the quote is the one line of speech. One warm cotton sheet; one hand note per specimen and quote view; the close carries a closing line and a date; one vermilion seal, the same stamp at the title and the close; no cast shadow, no gloss, no pure white. Palette: evening-blue — paper #efe6d4, ink #262a2e, wash #8fa3b0, petal #c9a27e, accent #c65438; deep is the wash at two or three passes. Type at 9:16: Cormorant Garamond italic 44 px for the title, regular 24 px for the subtitle, names and quote; Caveat 24 px for the notes; IBM Plex Mono 14 px for the date and venue; Cormorant 18 px for the monogram; the 14 px floor holds. Sound: solo felt piano and fingerpicked guitar, music forward with a short soft reverb; brush rustle on each paint-in, pencil scratch on the notes, soft page turns, a quiet stamp thump at the close; music out from the mist through the close, paper and room only; no voice-over. The camera stays on the sheet: slow push-in on the title and both specimens, static quote, mist and close; the 48 BPM breath grid, not a music cut. All names, places and words are fictional and original; no lyric or song title is quoted.*

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | title (opening) | 4.667 | Pooled edge |
| 2 | `watercolor_specimen` | detail (plate) | 5.833 | Flying white |
| 3 | `watercolor_quote` | quote (line) | 4.667 | No vector outline |
| 4 | `watercolor_mist` | transition (breath) | 4.500 | Paper is the white |
| 5 | `watercolor_specimen` | detail (reprise) | 5.833 | Annotation leader |
| 6 | `watercolor_close` | close (closing) | 4.500 | Painting-in |

**Fit.** Mins 4 + 5 + 4 + 4 + 5 + 4 = 26 s; maxes 8 + 10 + 8 + 7 + 10 + 7 = 50 s; the 4.000 s remainder is shared by remaining capacity 4 + 5 + 4 + 3 + 5 + 3 = 24 s. Whole-ms allocation: 4667 + 5833 + 4667 + 4500 + 5833 + 4500 = 30 000 ms. The 12 s `watercolor_walk` is not used: its minimum cannot fit a 30 s six-shot page.

**Fill.** Title: title, subtitle, names, date, venue, monogram. Specimen (twice): caption, venue. Quote: body, caption. Mist: no slots. Close: monogram, caption, date. Every value is non-empty and within 16 words. The two specimen entries share the composition and the caption/venue; the subject changes from the darning egg to the spool because the asset is a type, not a subject.

**Transitions.** Wipe 1→2; page turn 2→3; the quote's outgoing wipe and the mist's wipe are one erase 3→4; wipe 4→5; page turn 5→6; hold 6. No cut, no dissolve.

## Invariants

- **Paper is the white:** Shot 4's mist erases the quote page to the full sheet and ends on bare paper; shot 6's `paper-gap` leaves the cup's right edge as the sheet (#efe6d4), not white paint; the title's sky/table is the same sheet. No frame paints a white fill.
- **Flying white:** Shot 2's darning egg carries 3–9 dry-brush bristle tracks that break into dashes along its broad side; shot 1's doorframe does the same on its wide upright. Shot 5's spool thread is a thin rigger stroke with one clean edge, below the 6 px bristle threshold.
- **Pooled edge:** Shot 1's horizon wash is three passes of the same polygon with jittered vertices, so the edge darkens where the passes disagree; shot 2's edge wash and shot 6's unfinished wash show the same pooled edge against paper.
- **Painting-in:** Shot 1's doorframe and horizon, shot 2's egg, shot 3's cup, shot 5's spool and shot 6's unfinished cup build stroke by stroke, structure before detail, at the director's chosen 1.2 s or 1.8 s per form. The mist in shot 4 is a wipe, not a paint-in; the close's cup is still being painted when the film ends.
- **Annotation leader:** Shot 2's egg note, shot 3's quote note and shot 5's spool note each sit on a paper-coloured halo with a leader line growing to the subject. The close's line is a closing line, not an annotation; it sits in the left column, clear of the cup.
- **No vector outline:** No form is outlined: the doorframe, egg, cup, spool, close detail and mist are brush strokes, washes and stopped edges. The leader lines are single rigger strokes, and the type is set, not stroked. Shots 2 and 3 are the clearest proof.

## Questions

- **paint-in-speed (open):** 1.2 s or 1.8 s per painted form? The route and the 30 s fit hold at either speed; the director chooses. Not answered here.
- **Mist at 9:16:** The mist recipe has no `vertical` map. Should its full-frame paper shapes be used as authored, or does the mist need a 9:16 box? This treatment uses them full-frame.
- **`names` in a memory film:** Does `content.names` mean the remembered person, the rememberer, or both? This treatment reads "Ines & Mara" as both; the monogram is "IM".
- **Caption and venue recurrence:** The caption runs as the two specimen notes, the quote note and the close; the venue runs on the title and both specimens. Is the four-time refrain and running label intended, or is per-shot content S2?
- **Seed:** The brief and format have no seed field. Which seed should the resolver use? This treatment assumes one seed for the whole film.
