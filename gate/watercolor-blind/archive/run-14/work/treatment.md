# Treatment — A Room, Measured

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` | `title` (beat `opening`) | 4.667 | Pooled edge — the horizon's three passes |
| 2 | `watercolor_specimen` | `detail` (beat `plate`) | 5.833 | Painting-in — the latch, first stroke to last |
| 3 | `watercolor_quote` | `quote` (beat `line`) | 4.667 | Annotation leader — note to the chair |
| 4 | `watercolor_mist` | `transition` (beat `erase`) | 4.500 | Paper is the white — the erase is the sheet |
| 5 | `watercolor_specimen` | `detail` (beat `return`) | 5.833 | Flying white — the key's wide shaft |
| 6 | `watercolor_close` | `close` (beat `closing`) | 4.500 | No vector outline — the unfinished reveal |

**Subject.** A south room in Wren House, measured and noted the week before the sale. No people. The film is the page, the objects and the light; the light is the one thing the tape cannot hold.

**Allocation.** Minimums 4 + 5 + 4 + 4 + 5 + 4 = 26 s; maximums 8 + 10 + 8 + 7 + 10 + 7 = 50 s; 30 s fits. The 4.000 s remainder is shared by remaining capacity 4 : 5 : 4 : 3 : 5 : 3 (24 units) — 666.667, 833.333, 666.667, 500, 833.333, 500 ms — floored to 666, 833, 666, 500, 833, 500; the two leftover milliseconds go to the largest remainders, title then quote. Totals 4.667 / 5.833 / 4.667 / 4.500 / 5.833 / 4.500 = 30.000 s. No shot is 5.0 s; the two specimen plates are the longest.

**What is painted.**

- **1 · title · 4.667 s — outside the south window.** `prop.painted-arch` is a bare March branch at the right; its main limb is one wide dry stroke, its twigs riggers. The horizon wash is the wall's light line behind it. The branch paints in over 1.8 s, structure then detail, then sways at 0.006 for the rest of the shot. The vermilion seal sits in the top margin with `WH` beneath it; title, subtitle and names set in the left column; venue and date are one-line labels. No hand note: the title is a title plate, not a specimen.
- **2 · specimen · 5.833 s — the window latch.** `prop.painted-specimen` carries the window's iron latch, worn pale at the thumb. Plate and barrel first, then the turn and the worn patch, over 1.8 s. The leader grows from the top of `specimenNote` to the latch's lower edge; the note is the running note; the label is the room and the hour. Out on a page turn.
- **3 · quote · 4.667 s — the chair.** `prop.painted-specimen` carries a rush-seated chair turned to the window; `object-wash` is the light pooled on the boards at its feet, not a panel behind the words. The chair paints in over 1.8 s and the wash pools in three passes. The line sets in `quote` at body size; the note sits in `quoteNote` with a leader growing to the seat rail. The line is the film's own, so it needs no attribution — which is why the running note can serve this plate. Out on a wipe.
- **4 · mist · 4.500 s — the erase.** The wavy `mist` edge rises through the chair plate from the bottom of the frame for the whole shot, and `mist-full` completes on its last frame, so the shot is the erase in progress and never a hold on erased paper. Silent, no caption, no accent, no music. Out on a wipe.
- **5 · specimen · 5.833 s — the key on the sill.** A fresh sheet after the mist. `prop.painted-specimen` carries a small iron key left on the sill; its shaft is one wide 8 px drag with 3–9 bristle tracks, its bow and bit are rigger strokes. The same running note and the same label; the composition is the recipe's, the subject lives here (per-shot subjects are S2). Out on a page turn.
- **6 · close · 4.500 s — the window's edge.** `prop.painted-specimen` is the window's reveal; `unfinished-wash` is the last pass of its shadow and it stops short of the form's right edge, so `closeGap` is the sheet showing through, not a painted strip. The seal moves to the left at the same 0.1 × 0.056; `WH`, the closing line and the date sit under it, inside the 9 / 8 / 11 / 8 percent margins. Hold. Music out; one quiet stamp thump as the seal lands.

**Transitions.** wipe (1→2), page turn (2→3), wipe (3→4, the quote's wipe continued by the mist as one erase), wipe (4→5), page turn (5→6), hold (6). No cut, no dissolve, and no page turn between the quote and the mist.

**Director's choices.**

- **Paint-in speed: 1.8 s** per painted form — the branch, the latch, the chair, the key and the close's reveal. In a 5.833 s specimen plate that leaves 4.0 s of finished form and sway; 1.2 s would read as a flourish and leave the plate finished too early. The mist is a wipe, not a paint-in.
- **Palette: `garden-day`** — paper `#f3ead9`, ink `#2f2a24`, wash `#9fb7a4`, petal `#d9a6a0`, accent `#c65438`. Shots 1 and 6 carry paper, ink, wash and accent (4); shot 3 carries paper, ink, wash and petal (4); shots 2 and 5 carry paper, ink and wash (3); shot 4 is paper and fibre only. Never five pigments.
- **Accent:** the one seal, twice — shot 1 in the top margin, shot 6 in the left, same size, moved. No other frame carries it.
- **Sound:** a four-note felt-piano motif, no drums, no voice, no lyric — the style never requires a sung line. It runs under shots 1–3 and stops at the mist's first frame. Shots 4–6 are paper and room: paper brush rustle at every paint-in (1, 2, 3, 5, 6), pencil scratch at every hand note (2, 3, 5, 6), a soft page turn at 2→3 and 5→6, one quiet stamp thump as the close's seal lands. Nothing under the close but paper, the scratch of the closing line and that thump.
- **Seed:** an integer for the lead, as the pack requires. This treatment fixes none; it relies on the pack's five seeded surfaces — stroke phase, fibre offset, wash-edge jitter, paint-in order, sway phase.
- **Camera:** the recipes' own — push 1.0→1.04 (title), push 1.0→1.06 (each specimen), static (quote, mist, close). No added move.

**9:16 recomposition.** Display 44, body 24, caption 24, label 14, monogram 18 px at the 390 px authoring width, scaled proportionally with the frame and the 14 px floor with them. Title in the left column, branch and window on the right. Each recipe's `vertical` map is used as written — `title`/`title`, `subtitle`, `names`, `arch`, `horizonWash`, `seal`, `monogram`, `labelVenue`, `labelDate`; `specimenWash`, `specimen`, `specimenLeader`, `specimenNote`, `label`; `quoteWash`, `quoteObject`, `quoteLeader`, `quote`, `quoteNote`; `closeDetail`, `closeWash`, `closeGap`, `closeSeal`, `closeMonogram`, `closeNote`, `closeDate`. The leader paths are re-anchored to `specimenLeader` and `quoteLeader`, not the 1:1 points. The mist has no map: it is a full-frame wipe. Text stays inside the margins; the seal is the only mark in a margin.

**Stroke widths (390 px).** `wide` 8 px on the branch's main limb and the key's shaft, which carry 3–9 bristle tracks; `standard` 4 px on the chair's crest rail and the latch's plate, no bristles; `rigger` 1.5 px on the leaders, the branch's twigs and the key's bow and bit, clean. The 6 px bristle threshold scales with the frame.

**Type and copy checks.** Title 3 words (2 lines), subtitle 5 words (2 lines), names 2 words (1 line), venue 5 words (1 line), date 3 words (1 line), body 9 words (4 lines), caption 3 words (14 characters: one line in `specimenNote`, `quoteNote` and `closeNote`), monogram 1. Every slot is under 16 words and the caption is inside the two-line limit at 9:16. Roles follow the closed mapping: display, body, body, label, label, body, caveat, monogram.

## Invariants

- **Paper is the white:** shot 4 is the proof — both mist shapes are the `paper` role `#f3ead9` at full opacity, and the shot ends on the bare sheet, so the eraser is the paper and not a white paint. In shots 1–3 and 5–6 the same sheet is the z0 layer and every wash is a transparent pass over it; no frame paints pure white. Shot 6's `paper-gap` is the same sheet again.
- **Flying white:** shot 5 — the key's shaft is one `wide` 8 px drag whose 3–9 bristle tracks break into dashes and let the sheet through, while its bow and bit are rigger strokes that stay clean; the contrast sits inside one plate. Shot 1 carries the same tracks on the branch's main limb. No thin stem or leader is given noise.
- **Pooled edge:** shot 1 — the horizon wash is three passes of the same polygon with jittered vertices, so its lower edge darkens where the passes disagree, and the branch's limb ends in a darker dry edge rather than a drawn line. The same three-pass construction is in shot 3's `object-wash` and shot 6's `unfinished-wash`.
- **Painting-in:** shot 2 — the latch runs from the first stroke (plate, barrel) to the last (the turn, the worn patch) in 1.8 s, structure before detail, with paper rustle. The branch (1), the chair (3), the key (5) and the close's reveal (6) paint in by the same rule; the mist (4) is a wipe, not a paint-in, and is never counted as one.
- **Annotation leader:** shot 3 — the leader grows from the note's first stroke to the chair's seat rail, and the Caveat note is drawn twice over a 12 px paper halo, revealed left to right. Shots 2 and 5 use the same leader to the latch and the key. The title (1) carries no hand note, the mist (4) is silent, and the close (6) carries a closing line with no leader.
- **No vector outline:** shot 6 — the reveal's last wash stops before the form's edge and leaves the paper gap, so the form has no closed contour and no uniform line. In shots 2, 3 and 5 every edge is a darker brush stroke or a pooled wash edge, and each leader is a 1.5 px rigger line, never an outline.

## Questions

Full detail in `questions.md`; the short list:

1. Is a place (a named house) a legal value for `content.names`, which the guide describes as people or a songwriter?
2. Is one caption across four plates — specimen note twice, quote note, close refrain — the intended use, or should a 30 s page avoid selecting both a specimen and a quote?
3. With the caption spent as a running note, where does a *spoken* quote's attribution go when the body is the quote?
4. Is the card's `21 JUNE 2026` a required label form or an example?
5. Is the page order fixed (title first, close last, mist after a quote), or free?
6. When the only difference between two repeats is a per-shot subject the schema cannot carry, is that `count` or two beats?
7. If a page turn is "the page break before the erase", which shot owns the turn's time — and does the mist then erase an already-blank sheet?
8. The quote's wipe and the mist's wipe are "one erase": is the overlap inside the 30 s or outside it?
9. Is a recipe's `transitionOut` inside its own seconds or between shots? The resolver only sums shots.
10. Is display type painted in at 1.8 s, masked, or simply set? The speed rule names forms, not type, but the authoring log says the title "is painted in".
11. What are the title's line-break and length rules at 9:16? The author cannot control the break.
12. Is `paper-gap` the recipe's opaque paper-coloured shape or the guide's stopped wash? The two give different edges.
13. Inside a 4.5 s mist shot, how much is the rising edge and how much the `mist-full` pass, with no hold on erased paper?
14. Does the music stop at the mist's first frame or at the quote's wipe, since those wipes are one erase?
15. What is the delivery loudness target, and is a string the expected shape of the passthrough `loudness` field?
16. Is the 9:16 export 1080 × 1920, and does the 14 px floor scale to ~39 px or stay 14 px absolute?
17. The seal's anchors include "date block": does the seal ever carry the date, or is the date always the separate label?
