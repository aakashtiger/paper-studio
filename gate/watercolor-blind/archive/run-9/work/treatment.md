# Treatment — Notes on Leaving

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` | 4.667 | Painting-in |
| 2 | `watercolor_specimen` | `detail` | 5.833 | Annotation leader |
| 3 | `watercolor_specimen` | `detail` | 5.833 | Flying white |
| 4 | `watercolor_quote` | `quote` | 4.667 | No vector outline |
| 5 | `watercolor_mist` | `transition` | 4.500 | Paper is the white |
| 6 | `watercolor_close` | `close` | 4.500 | Pooled edge |

**The film in one line.** Two tenants clear the last week out of the rented house on Alder Row, and the film is a field journal of the objects that keep its warmth.

**Why this route.** It is a page, not a walk. The 30 s 9:16 film uses the page contracts only — `title`, `specimen`, `quote`, `mist`, `close` — and repeats `specimen` once, which the page contract allows. `watercolor_walk` is not used: its 12 s minimum belongs to the 16:9 scroll, and a locked sheet is not a handscroll. The order is a walk through the house without a walking camera: front door, stair, window, back-door key, erase, back door. The mist is shot 5, after the quote, so the quote's outgoing wipe and the mist's wipe are one erase; no page turn sits between them, and the mist never has to erase a sheet that has already turned. The two specimen shots are separate shots with separate allocations; they share the recipe and the slot values, as S1b requires, and the treatment names the different subjects. The format's beat names are `opening`, `stair`, `window`, `door`, `erase`, `closing`; they map to the closed roles `title`, `detail`, `detail`, `quote`, `transition`, `close`.

**Allocation.** The six recipes start at their minima: 4 + 5 + 5 + 4 + 4 + 4 = 26 s. The remaining capacity is (8−4) + (10−5) + (10−5) + (8−4) + (7−4) + (7−4) = 4 + 5 + 5 + 4 + 3 + 3 = 24 s. The 4 s remainder (4000 ms) is shared by remaining capacity: title 4/24 = 666.667 ms, each specimen 5/24 = 833.333 ms, quote 666.667 ms, mist 3/24 = 500 ms, close 500 ms. Floored to whole milliseconds: 666 + 833 + 833 + 666 + 500 + 500 = 3998 ms. The 2 ms left go to the two largest fractional remainders, the title and the quote (.667 each), one each. The resolved shots are 4.667, 5.833, 5.833, 4.667, 4.500, 4.500 s; they sum to 30.000 s and every shot is inside its recipe's range. This is the resolver's rule, not an equal split.

**Direction (the lead records these).**

- **Paint-in:** 1.8 s per painted form, film-wide. The director's choice is the pack's open `paint-in-speed`; 1.8 s suits a memory film and lets each form be read as it is built. The title's arch and horizon, both specimens, the quote's key and the close's stile each take 1.8 s from first stroke to last. The mist is a wipe, not a paint-in.
- **Palette:** `evening-blue` — paper #efe6d4, ink #262a2e, wash #8fa3b0, petal #c9a27e, accent #c65438. The default `garden-day` belongs to the garden wedding's register; this film is the end of a day in a house, so the blue-grey wash and the ochre light are the right weather. At most five pigments in a frame: paper, ink, wash, petal, accent. `deep` is the wash at two or three passes, never a sixth tube. The accent is the one seal, on the title and the close only.
- **Sound:** an original wordless felt-piano motif — four notes rising, no drums, no vocal, no lyric — on the pack's 48 BPM breath grid (a reference, not a beat lock). Foley: paper brush rustle at each 1.8 s paint-in; pencil scratch as each hand note is written; a soft page turn at 10.500 s (shot 2→3) and 16.333 s (shot 3→4); a paper press, not a thump, when the title's seal lands under the music. Music out at 21.000 s, when the mist begins, and silent through the close; one quiet stamp thump at 25.700 s as the close's seal lands. No voice: the quote is read as type, not spoken.
- **Seed:** the lead chooses one integer and records it; it is not a field in `brief.json` or `format.json`.
- **Caption:** "kept warm" is the film's one running note. It is the note on both plates, the quote's note and the close's closing line. It is not a per-plate description; per-shot notes are S2. At 9:16 it fits the 0.22 × 0.18 specimen note box as two lines, "kept" and "warm".
- **Leader anchors (9:16):** the specimen's leader grows from the note's left edge (0.70, 0.26) to the worn rail (0.62, 0.34); the quote's leader grows from the note's top-right (0.56, 0.60) to the key's bow (0.66, 0.22). These are the intended re-anchors; the pack does not say where an author records them (question 4).
- **Names:** "Ida and Sam" are the two tenants who rented 6 Alder Row together. The film does not make them a couple and it is not a wedding; the names line is the household, and the date is the month the keys go back.

**Subjects, shot by shot.**

1. **Title — the front door.** The arch asset is the door frame of 6 Alder Row; a low horizon wash of the street hedge; the seal stamped top right; the monogram "AR" beneath it. "Notes on Leaving" is painted in the left column, with the subtitle and names in body type and the address and date as labels. The title is a title plate, not a specimen; it carries no hand note.
2. **Specimen — the stair newel and its handrail.** The rail is worn pale where hands turned; the edge-wash is three passes behind it. The note "kept warm" sits to the right, twice over a 12 px paper halo; its leader grows left to the worn rail. The note never covers the newel.
3. **Specimen — the kitchen window.** One sash is blue-grey, the sill ochre, the paint sealed shut at the latch. The sash's wide dry-brush wash carries the film's flying white: 3–9 bristle tracks break into dashes; the thin latch stem stays one clean stroke. The same note "kept warm" and a leader to the latch.
4. **Quote — the back-door key on its nail.** The key paints in over 1.8 s. The quote "The house was never ours. We only kept it warm." is set in the body face at the left; the note "kept warm" sits below it with a leader to the key's bow. The object-wash is beside the key, not behind the text. The quote is unattributed; the title's names label carries the speakers.
5. **Mist — the erase.** A paper-coloured wash rises from the bottom edge and takes the key and the kitchen back to the sheet. Silent, no caption, no seal. The quote's outgoing wipe is the same erase; the mist is not a fresh world.
6. **Close — the back door.** The stile around the key standing in the lock; the last wash pass stops short of the stile's edge, leaving the 0.05-wide paper gap at 0.82–0.87. The seal is top left, the monogram "AR", the closing line "kept warm", the date "MAY 2026". The page holds to 30.000 s; the close does not turn.

**Transitions.** Title → specimen: `wipe` at 4.667 s. Specimen → specimen: `page_turn` at 10.500 s. Specimen → quote: `page_turn` at 16.333 s. Quote → mist: `wipe` at 21.000 s, the one erase. Mist → close: `wipe` at 25.500 s. Close: `hold` to 30.000 s. No cut, no dissolve.

**What the film refuses.** No photograph and no on-camera person; no vector outline; no pure white paint (the paper is the white); no opaque fill; no gloss, foil, gold or brass; the key is painted grey-iron with no metallic sheen; no cast shadow; no caption on the mist; no music under the close; no more than five pigments; no text over the subject; no hand note on the title.

## Invariants

- **Paper is the white:** Shot 5, the mist, and shot 6, the paper gap. The mist is a paper-coloured wash (#efe6d4) at full opacity; it takes the kitchen and the key back to the sheet, and the sheet is the only white in the film. In shot 6 the 0.05-wide gap at the stile's edge is unpainted paper, not white paint. Every frame's ground is the paper; the title's margins and the specimens' margins are the same sheet.
- **Flying white:** Shot 3, the window sash. The sash is a wide dry-brush wash; 3–9 bristle tracks break into dashes across it, while the thin latch stem stays one clean stroke. The same rule shows on the stair rail (shot 2) and on the close's last pass (shot 6). At 9:16 only strokes that remain wider than 6 px at the output frame carry bristles.
- **Pooled edge:** Shot 6, the stile, and shot 3, the sill. The stile's last pass is three jittered passes; where their edges disagree the edge darkens and pools, and the pass stops early at the paper gap. The sill's wash pools the same way at the frame's bottom edge. Shot 2's edge-wash is the third example.
- **Painting-in:** Shot 1, the arch and the horizon, then every painted form. The arch and the horizon paint in structure-first over 1.8 s each; the title type follows. The stair (shot 2), the window (shot 3), the key (shot 4) and the stile (shot 6) each paint in over 1.8 s, structure before detail. Nothing is panned over a finished painting, and no form arrives as a fade.
- **Annotation leader:** Shot 2, the stair, and shot 4, the key. The Caveat note "kept warm" sits at the right of the newel, twice over a 12 px paper halo; its leader grows left to the worn rail, and the note never covers the newel. In shot 4 the note sits below the quote and its leader grows to the key's bow. The title carries no hand note, per the title contract; the mist is silent.
- **No vector outline:** Shot 4, the key, and every painted form. The key's edge is a darker brush edge, not a uniform line; its form is built from strokes, and the leader is a 1.5 px rigger line, not a border. The stair, the window and the stile have the same brush edge. The close's unfinished edge never closes, so there is no outline to close. No frame has a vector shape filled with a watercolour texture.

## Questions

The full evidence for each is in `questions.md`; these are the same fourteen questions in brief.

1. Is `content.names` body type or label type? `APPLICATION.md` says the title's names, date and venue are labels and that the only label slots are date and venue; `watercolor_title.json` sets `names` to body. This film used the recipe (body).
2. What is the intended caption length at 9:16? The `specimenNote` box is 0.22 × 0.18, about 10–16 characters at 24 px and two lines, not the 16 words the slot allows. This film used a 9-character note.
3. Where does the title's `horizon` wash go at 9:16? It is missing from the recipe's `vertical` array even though the guide says background washes are mapped. This film left it at its 1:1 coordinates.
4. What are the 9:16 leader endpoints? The specimen and quote leaders are 1:1 coordinates and neither path appears in `vertical`. This film records the intended anchors in the Direction above; the pack does not say where they live.
5. Is the mist half-frame or full-frame? The recipe's shape covers y 0.5–1.0; the guide calls it a full-frame wipe. This film treated it as a rising wipe ending on a blank sheet.
6. Does the seal move between the title and the close? The 9:16 boxes put it top right on the title and top left on the close, while the guide says it is one recurring mark. This film kept both boxes.
7. May a quote be unattributed when the caption is a running refrain? The one-value-per-slot rule leaves no separate attribution slot. This film left the quote unattributed.
8. At which frame is the 6 px bristle threshold measured? The pack gives no 9:16 delivery frame. This film assumes the 390 px authored page.
9. Is one `venue` enough for the whole film? The title and the specimen share the slot, so two measured places cannot be labelled. This film used one address and measured nothing.
10. What does `names` mean in a non-wedding film — people, household or house name? This film used the two tenants.
11. Is the per-shot subject part of the sealed input? The schemas have no subject field and the treatment names the subjects. If the treatment is not hashed, the same brief and format could render different subjects.
12. How does an architectural subject anchor and sway? `prop.painted-specimen` is anchored at "hero subject" and "stem root", and sway values exist only for trees and grass. This film kept the architecture still.
13. Is `evening-blue` a recommendation or a record? The card labels it "the blind film's palette"; the pack's default is `garden-day`. This film chose evening-blue.
14. Does the 9:16 title box overlap the arch on purpose? The title box ends at 0.58 and the arch begins at 0.56. This film kept the title short so the 0.02 overlap is not visible.
