# Treatment — The Last Inventory

## Route

A 30-second, 9:16 page for an emptied house on Elm Row, measured at 06:40 on the morning of its last inventory. Six shots: the door, the stair, the latch, the key and its line, the erase, the keyhole. It is not the pack's garden wedding — no garden, no table, no couple, no invitation — and it carries no song title, lyric, voice or photograph.

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | title | 4.667 | Pooled edge — the horizon wash is three passes and darkens where they disagree |
| 2 | `watercolor_specimen` | detail | 5.833 | Flying white — the wide treads carry 3–9 bristle tracks that break into dashes |
| 3 | `watercolor_specimen` | detail | 5.833 | Annotation leader — the leader grows from the latch to the hand note |
| 4 | `watercolor_quote` | quote | 4.667 | Painting-in — the key paints in over 1.8 s, structure before detail |
| 5 | `watercolor_mist` | transition | 4.500 | Paper is the white — the erase is the sheet, not white paint |
| 6 | `watercolor_close` | close | 4.500 | No vector outline — the last wash stops short and leaves a paper gap |

**Allocation.** The sum of the six minima is 4 + 5 + 5 + 4 + 4 + 4 = 26 s. The remaining capacity is 4 + 5 + 5 + 4 + 3 + 3 = 24 s. The 4 s remainder is shared by capacity, not equally: 4000 × 4/24 = 667 ms, × 5/24 = 833, × 5/24 = 833, × 4/24 = 667, × 3/24 = 500, × 3/24 = 500. Added to the minima: 4.667 + 5.833 + 5.833 + 4.667 + 4.500 + 4.500 = 30.000 s. After flooring, the 2 ms left go to shots 1 and 4, the two .667 remainders.

**Transitions.** wipe → page_turn → page_turn → wipe → wipe → hold. No cut and no dissolve. The mist follows the quote and erases its line; no page turn is asked to erase a specimen.

**Director choices.** Paint-in 1.8 s for every form that paints in: the slower of the pack's two, which gives each plate a breath between structure and detail. Palette `evening-blue` — blue-grey wash, ochre petal, vermilion accent, paper #efe6d4 — for a house at first light. The accent is the vermilion seal, twice only, at the title and the close; the mist carries none. No voice: the body line is read by the eye. Score: solo felt piano, cleared per film, out at the mist's first frame and silent to the end, with one quiet stamp thump in the close. Loudness is left to delivery. Seed: the lead's choice, not set here.

**What is painted.** 1 — the front door's arch, the light across the doorstep, the seal. 2 — the sixth stair tread, worn in the middle, six risers. 3 — the iron thumb-latch on the door's edge, its paint worn to ochre. 4 — the key on its nail beside the door: bow and shank first, wards last. 5 — nothing; the mist is paper. 6 — the keyhole plate, its last wash stopping short of the plate's edge. No person, no hand, no photograph. E.H. is the fictional journal keeper's monogram (Elias Hale in the brief); he is never shown and never named on screen.

## Invariants

- **Paper is the white:** Every shot grounds on the evening-blue sheet #efe6d4 and no frame paints white. Shot 1 lets the sheet be the light above the horizon wash and inside the door arch; shot 5 is the proof — the mist is a paper-coloured wash that returns the quote's page to the sheet. In shots 2 and 4 the highlight on the sixth tread's nosing and on the key's bow is unpainted paper, not white pigment.
- **Flying white:** Shot 2. The stair's treads are laid with the loaded round brush in wide horizontal strokes; each tread carries 3–9 bristle tracks that break into dashes at the nosing. The thin riser lines, the leader and the label stay single clean strokes, with no noise.
- **Pooled edge:** Shot 1. The horizon wash is three passes of the same polygon with jittered vertices, and its lower edge darkens where the passes disagree. Shot 6 repeats the logic at the unfinished wash, which pools at the stopped edge and leaves one paper-coloured gap rather than closing the keyhole plate.
- **Painting-in:** Shot 4. The key appears stroke by stroke over 1.8 s — bow and shank first, the wards and the nail's shadow last — and it is already painting as the page turn lands, never panned over finished. Shots 1, 2 and 3 use the same 1.8 s rule for the arch, the stair and the latch. After the mist nothing paints: the close's plate arrives painted and only its last wash is unfinished. The mist is a wipe, not a paint-in.
- **Annotation leader:** Shot 2 grows the leader from the worn dip of the sixth tread to the Caveat note on its 12 px paper halo; shot 3 grows it from the latch's worn thumb-plate; shot 4 grows it from the hanging key. Each subject is composed into the left of the plate so the note sits on open paper and never crosses the form; the leader reaches it across that paper.
- **No vector outline:** Shot 6. The keyhole plate's edge is a loaded-brush edge of varying width that stops at the unfinished gap; no uniform line closes the form. Shots 2 and 3 close their forms by pigment accumulation and a darker brush edge, never by a constant-width stroke. The leader is the only drawn line, and it is an annotation, not a silhouette.

## Questions

- Where do the close's monogram, refrain, date and seal sit at 9:16? The aspect boxes define only closeDetail and closeWash.
- The title has two labels (venue, date) and 9:16 has one label box: which is above, and does the venue move to the 1:1 y 0.78?
- The specimen's leader starts at a fixed point; with a stair and a latch, may it be re-aimed per shot?
- A repeated specimen repeats its note verbatim; is the pair meant to read as a diptych with one running note?
- Does anything paint after the mist, and is the close's unfinished wash painted during the hold or already on the sheet?
- The mist is a 0.8 paper wash over a line starting at y 0.24: does 0.8 erase it, or does the director add passes?
- Does the score stop at the mist's first frame, as the rising edge crosses, or at the mist's end?
- With one caption shared by the quote and the close, where would a quote's attribution go?
- Are the seal (y 0.08) and the label (to y 0.90) exempt from the 9% top and 11% bottom paper margins?
