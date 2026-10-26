# Treatment — The House, Measured

A last walk-through of an empty house, painted as a field journal: the door arch, the key in its saucer, three worn treads, a folding rule on the sill, an erase, and the keyhole left unfinished. The film measures the house in labelled plates, then lets one remembered line say what the measurements missed.

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | title | 4.667 | Painting-in: the door arch paints in over 1.8 s; the seal's first appearance. |
| 2 | `watercolor_specimen` | detail | 5.833 | Annotation leader: the key's note on a 1.5 px rigger over a 12 px paper halo. |
| 3 | `watercolor_specimen` | detail | 5.833 | Flying white on the wide tread nosings; pooled edge in the three-pass `edge-wash`. |
| 4 | `watercolor_quote` | quote | 4.667 | Painting-in: the rule paints in on a static camera, structure before detail. |
| 5 | `watercolor_mist` | transition | 4.500 | Paper is the white: the erase ends on the sheet, not on white paint, and carries no caption. |
| 6 | `watercolor_close` | close | 4.500 | No vector outline: the plate's edge is paint; paper is the white in the `paper-gap`; the seal returns. |

Fit: the six minima sum to 26.000 s (≤ 30 s) and the six maxima to 50.000 s (≥ 30 s). Allocation by the stated rule: 4.000 s is shared by remaining capacity (4 / 5 / 5 / 4 / 3 / 3 s; 24 s in total). Exact shares are 666.667 / 833.333 / 833.333 / 666.667 / 500 / 500 ms; floors are 666 / 833 / 833 / 666 / 500 / 500 (3,998 ms); the 2 leftover ms go to the largest fractions, title and quote (0.667 each; the earlier shot first). Totals: 4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500 = 30.000 s. No shot is an assumed 5.0 s.

The format writes the plate once with `count: 2`, which the resolver expands to shots 2 and 3. Both are the same recipe and the same slot values; only the painted subject differs, and the subject lives here, not in the format.

**Director choices**

- **Paint-in — 1.8 s per painted form.** The slower of the pack's two options, chosen because the film is a last look. It covers the arch (shot 1), the key (2), the stair (3), the rule (4) and the keyhole plate (6). The mist (5) is a wipe, not a paint-in. The hand note is drawn, not painted, so it is revealed by pencil scratch after its form is finished.
- **Palette — `garden-day`.** paper `#f3ead9`, ink `#2f2a24`, wash `#9fb7a4` sage, petal `#d9a6a0` rose, accent `#c65438` vermilion; `deep` is the sage at three passes, not a second tube. No frame carries more than five pigments. The mist is paper and fibre only. The card's `evening-blue` row is a record of the blind film, not used here.
- **Per-shot subjects.** Assets are types; the treatment names what is painted. 1 — the fanlight arch of the front door at No. 9 (`prop.painted-arch`). 2 — the front-door key in a rose saucer on the hall table (`prop.painted-specimen`). 3 — the bottom three treads of the stair, seen side-on and stepping up the page, the nosing worn into a shallow dip (`prop.painted-specimen`). 4 — a half-open wooden folding rule on the kitchen sill, light behind it as bare paper (`prop.painted-specimen`). 5 — the erase. 6 — the front door's keyhole plate, its right edge left as paper (`prop.painted-specimen`). The seal is one `prop.stamp-seal` at shots 1 and 6.
- **9:16 recomposition.** display 44 px, body 24 px, caption 24 px, label 14 px, monogram 18 px. Every box comes from `tokens.layout.aspectBoxes["9:16"]`, op by op through each recipe's `vertical` map:
  - title → `title`, `subtitle`, `names`, `arch`, `horizonWash`, `seal`, `monogram`, `labelVenue`, `labelDate`;
  - specimen → `specimenWash`, `specimen`, `specimenNote`, `label`;
  - quote → `quoteWash`, `quoteObject`, `quote`, `quoteNote`;
  - close → `closeDetail`, `closeWash`, `closeGap`, `closeSeal`, `closeMonogram`, `closeNote`, `closeDate`;
  - mist → no map; full-frame wipe.

  The title stays in the left column and the arch on the right. Leader paths re-anchor: the specimen's leader runs from the key's bow (shot 2) or the stair's nosing (shot 3) to `specimenNote`; the quote's leader runs from the rule's hinge to `quoteNote`.
- **Camera.** As the recipes carry it: the title pushes in 4 %, the specimen pushes in 6 % (the pack's ceiling, not beyond), and the quote, mist and close are static. No walk: the 12 s minimum belongs to the 16:9 scroll.
- **Stroke widths.** `wide` 8 px at the output frame for the broad masses that carry bristles: the stair's nosings, the rule's faces, the arch's jambs. `rigger` 1.5 px for the three leaders. `standard` (4 px) and `hairline` (1 px) are not used, so no stroke can be read as an outline. The 6 px bristle threshold is at the output frame; 8 > 6 and 4 < 6.
- **Mist end state.** The wavy `mist` edge rises from the bottom over the outgoing quote page — the rule, the line and the note go under paper, not to a new sheet. `mist-full` completes on the final frame. The shot is the erase in progress and ends on full paper with fibre only: no caption, no ghost, no hard edge. The quote's outgoing wipe and the mist's first pass are one brush edge, and the close paints on the sheet the mist leaves.
- **Accent.** One seal, two appearances: the top-right margin on the title (`seal`, 0.8 / 0.04) and the left margin on the close (`closeSeal`, 0.1 / 0.18). The monogram ND sits under it on both plates. The mist carries none.
- **Pace.** The 48 BPM grid is a breath reference, not a beat lock; the six shots fall at 4.5–5.8 s and are not quantised to the bar.
- **Sound.** Solo felt piano, unhurried. Paper brush rustle for each paint-in; pencil scratch as each hand note is drawn; a soft page turn at the end of each plate; one brush-edge paper sweep for the quote's wipe and the mist's continuing edge; music out from the mist through the close; one quiet stamp thump as the seal prints on the close. No drums, no voice, no third-party music.
- **Seed.** The lead chooses the integer. It seeds stroke phase, fibre offset, wash-edge jitter, paint-in order and sway phase; palette, type, recipe order and camera direction are fixed by this treatment.
- **Brief shape.** Only the eight content slots the selected contracts read are written: title, subtitle, names, date, venue, body, caption, monogram. `hashtag`, `rsvp` and `photos.*` are omitted; no recipe reads them and the style refuses photographs.
- **Fiction.** Every name, place, date and the quoted line is invented for this film. No third-party lyric, song title, music, voice or image is used.

## Invariants

- **Paper is the white:** The sheet is `#f3ead9` in all six shots. Shot 5's `mist-full` is a paper wash, not white paint, and the erase ends on blank sheet; shot 6's `paper-gap` is the same sheet showing through, and the plate's wash stops at it. No op paints `#ffffff`.
- **Flying white:** Shot 3's stair nosings and shot 4's rule faces are `wide` 8 px strokes, above the 6 px threshold at the output frame, and break into 5–7 bristle dashes with paper showing between them. The 1.5 px leaders and all type stay clean.
- **Pooled edge:** Every wash is three passes with jittered vertices. Shot 3's `edge-wash` pools along the stair's left edge where the passes disagree; shot 6's `unfinished-wash` pools at the edge that stops short of the plate; shot 4's `object-wash` pools under the rule in the same way.
- **Painting-in:** 1.8 s per form, structure before detail: the arch (1) builds its jambs before its fanlight; the key (2) builds bow and shaft before the wards; the stair (3) builds the treads before the wear; the rule (4) builds the faces before the hinge; the plate (6) builds the mass before the keyhole. The mist (5) is a wipe, not a paint-in.
- **Annotation leader:** Shots 2 and 3 carry the Caveat note "left as it was" on a 1.5 px rigger from the key's bow and the stair's nosing to `specimenNote`, over a 12 px paper halo; shot 4 carries the same note on a leader from the rule's hinge to `quoteNote`. The title carries no note.
- **No vector outline:** The only `path` ops in the selected recipes are the three leaders, and no stroke closes a form. The key (2), stair (3), rule (4) and plate (6) end on the darker third wash pass; shot 6's edge stops before the form's edge and leaves paper. Nothing is outlined and filled.

## Questions

- One caption serves three views (plate note, quote note, close refrain); the pack does not say how a note stays true over two different painted subjects. I used a subject-neutral running note.
- A quote's attribution has no slot; putting it in `body` spends the sixteen-word cap. Is that the intended trade?
- The 9:16 `specimenNote` box is 86 px wide at 390 px, so the two-line limit holds about 16–18 characters at 24 px Caveat. What is the tested fit, and is 24 px right in that box?
- Are `wide` 8 px and `standard` 4 px output-frame pixels or 390 px authoring pixels? If they scale, `standard` crosses the 6 px bristle threshold at a 1080-wide delivery, which contradicts the pack.
- No page recipe has a stroke-width op, so which op is expected to carry the `wide` brush? I assumed the painted form's ribbon.
- The 18–24 characters per line given for `names` at 9:16 does not fit the 0.46-wide box at 24 px. Which limit governs?
- `content.date` is read by title and close; a walk date and a sale date cannot both appear. Is one date for the whole film intended?
- Repeat a page contract: two `sequence` entries or one entry with `count: 2`? I used `count: 2`; the guide documents both and does not say which the resolver prefers.
- A specimen exits on a `page_turn`; a mist placed after it would follow a blank sheet. What does the mist erase if a director wants it after a second plate?
- When does `mist-full` land? The shot must be the erase in progress, but the last op is full paper.
- `BRIEF.md` says italic for subtitles; `STYLE.md` and the title recipe say `body`. I followed the recipe and STYLE.md.
- The same seal is boxed at 0.1 × 0.056 on the title and 0.12 × 0.0675 on the close. May one mark scale between plates, or should it only move?

Full detail is in `questions.md`.
