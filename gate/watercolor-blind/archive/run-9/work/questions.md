# Questions — Notes on Leaving

Sealed blind run 9, pack `watercolor` 0.1.0, film *Notes on Leaving* (30 s, 9:16, six shots). These are the questions the pack and `APPLICATION.md` leave open after the film was written. Each says what this film did so the lead can see the cost of the gap.

## 1. Is `content.names` body type or label type?

`APPLICATION.md` ("Title note") says "Its names, date and venue are labels", and the same guide ("Remaining S1a limits") says "The only label slots are `content.date` and `content.venue`." But `watercolor_title.json` sets the `names` op to `typeRole: "body"`, and `STYLE.md`'s closed type mapping does not mention `names` at all. Which is authoritative: the recipe's body role, or the guide's "labels" sentence?

**What this film did:** used the recipe — `names` is body type. A label would set "Ida and Sam" in 14 px IBM Plex Mono under the title, which is a different title plate. If the guide is right, the recipe needs a one-word change.

## 2. What is the intended caption length at 9:16?

`tokens.layout.aspectBoxes.9:16.specimenNote` is 0.22 × 0.18, about 86 × 125 px on the 390 px page. At the 9:16 caption size of 24 px and two lines, that box holds roughly 10–16 characters, not the 16 words the pack allows per content slot. The guide says "shorten the caption rather than exceed the box" but does not give the 9:16 limit. May the note use the wider `note` box (0.6 × 0.12), run to the 8% margin, or is 0.22 the hard note width? The card does not answer it: its phone specimen sets "the first warm day" at x 246 in a 358-wide frame, wider than any note box.

**What this film did:** used a 9-character running note, "kept warm", which sets as two lines ("kept" / "warm") and fits the 0.22 box. The 16-word caption limit is unreachable in that box at 24 px.

## 3. Where does the title's `horizon` wash go at 9:16?

`watercolor_title.json` has a `horizon` wash at x 0, y 0.58, w 1, h 0.28. Its `vertical` array maps title, subtitle, names, arch, seal, monogram, venue and date, but not `horizon`. The guide says the `vertical` array maps the op ids "including the background washes". There is no `horizon` box in `aspectBoxes.9:16`. Is the horizon left at its 1:1 coordinates, stretched to the 9:16 page, or re-anchored to a box the pack does not name?

**What this film did:** left it at its recipe coordinates (y 0.58, h 0.28), which reads as a low street hedge under the arch. If the resolver re-anchors it, the plate may change.

## 4. What are the 9:16 leader endpoints?

The specimen's leader is `[0.6, 0.32] → [0.64, 0.3]`; the quote's is `[0.6, 0.54] → [0.5, 0.62]`. Both are 1:1 coordinates, and neither `leader` path appears in its recipe's `vertical` array. The guide says "re-anchor leader paths to the 9:16 boxes" but gives no endpoints or rule. Is the re-anchor the resolver's job, or must the author supply it?

**What this film intends:** the specimen leader grows from the note's left edge (about 0.70, 0.26) to the worn rail (about 0.62, 0.34); the quote leader grows from the note's top-right (about 0.56, 0.60) to the key's bow (about 0.66, 0.22). If these are author coordinates, the pack should say where they live — neither schema has a leader field.

## 5. Is the mist half-frame or full-frame?

`watercolor_mist.json`'s `mist` shape covers y 0.5–1.0 only. The guide calls the mist a "full-frame wipe" and says it has no `vertical` array because it is full-frame; the card's mist frame also shows a half-frame wash. Is the half-frame polygon a snapshot of a rising wipe whose end state is the full frame, or is the top half of the outgoing shot never erased?

**What this film did:** treated the mist as a rising wipe that ends on a blank sheet, with the polygon as its leading edge. If the polygon is the final state, the top half of the key and the window would remain under the mist, which is not an erase.

## 6. Does the seal move between the title and the close?

The title's 9:16 seal box is top right (0.80, 0.04); the close's is top left (0.10, 0.18). The guide says the same seal at the title and the close is one recurring accent and "does not become a new mark each time"; it also says the seal may sit in the top or right margin as a stamp. Is the seal meant to move, or should the close's seal be re-anchored to the title's top-right position so it reads as one mark?

**What this film did:** kept both boxes as authored, so the seal appears top right on the title and top left on the close. If the move reads as two marks, the close box is the one to change.

## 7. May a quote be unattributed when the caption is a running refrain?

The quote recipe's only note slot is `content.caption`. The one-value-per-slot rule makes that caption the same value as the specimen's note and the close's closing line. The guide says a quote's attribution "goes in the caption or the body", but when the caption is a refrain, the only place for a speaker is inside `body` — which is already the quote. Is an unattributed quote allowed, or must the attribution be folded into `body` even when that makes the body a quote plus a credit?

**What this film did:** left the quote unattributed. The title's names label carries the speakers; the body is the line alone.

## 8. At which frame is the 6 px bristle threshold measured?

The pack says the 6 px threshold is "at the output frame", but the page is authored at 390 px and the pack does not name a 9:16 delivery frame. At 1080 × 1920, a stroke that is 6 px at 390 px is about 17 px, so more strokes would carry bristles than at 390 px. At which frame is the test made?

**What this film assumes:** the 390 px authored page is the frame the threshold is tested at. If delivery is 1080 × 1920, the bristle count and the note's legibility change.

## 9. One `venue` for the whole film?

The title plate uses `content.venue` as a place label; the specimen uses the same slot as its measured `place` label. Because there is one value per slot, a film cannot label the stair and the window with different measured places or times (for example "STAIR, 07:20" and "KITCHEN, 07:40"). Is `venue` meant to be a single film-wide place — an address — with any measured time in `body` or `caption`? Or is the specimen's `place` label meant to be a different kind of value?

**What this film did:** used one address, "6 ALDER ROW", as a running label on the title and both plates. It measures nothing, so no time is lost.

## 10. What does `names` mean in a non-wedding film?

The slot is called `names`, the title recipe is its only reader, and the pack's examples are a wedding couple. For a house film, is `names` the people (the tenants), the household, or even a house name? The slot must be non-empty. Is there a form rule — two names, an ampersand, no place names — that the pack does not state?

**What this film did:** used the two tenants, "Ida and Sam". The treatment says they are not a couple and the film is not a wedding. If `names` is meant only for a couple, a house film has no correct value for it.

## 11. Is the per-shot subject part of the sealed input?

The pack says assets are types, not subjects, and the treatment names the subject; the guide says the lead records the choices. Neither `brief.json` nor `format.json` has a subject field. If the same brief and format are resolved twice, how does the renderer know the first specimen is the stair and the second is the window? Is `treatment.md` part of the hashed input set, or is the subject a lead's note outside the hash?

**What this film did:** named both subjects in the treatment. If the treatment is not hashed, this is the one place where the same brief and format could produce different films.

## 12. How does an architectural subject anchor and sway?

`prop.painted-specimen` is anchored at "hero subject" and "stem root". A stair newel, a window sash and a key have no stem root. Does an architectural subject need an anchor override, and where does it live if the pack ships no per-subject asset? The same question applies to `tokens.motion.sway`: values are given for trees (0.006) and grass (0.01–0.03) only. Should a painted architectural form be static by default, or does it need an explicit zero-sway declaration?

**What this film did:** used the specimen asset as the type for all three subjects and kept the architecture still; only the paper fibre moves. If sway needs a declaration, the newel and the window are the shots to check.

## 13. Is `evening-blue` a recommendation or a record?

`card.html` labels the evening-blue palette "the blind film's palette"; `tokens.json` calls `garden-day` the default. Is evening-blue a recommendation for blind song/memory films, or a record of a previous blind run? A new blind film choosing it may repeat an earlier film's palette, and the pack does not say which reading is intended.

**What this film did:** chose evening-blue to stay out of the garden wedding's register. If the label is a record, this film repeats a prior blind film's palette and should perhaps use `garden-day`.

## 14. Does the 9:16 title box overlap the arch on purpose?

At 9:16, `title` is x 0.08, w 0.5 — it ends at 0.58. `arch` starts at x 0.56. The boxes overlap by 0.02. Is that intentional, on the assumption that a left-aligned title never reaches its right edge, or should the title box end at 0.56? A longer title would collide.

**What this film did:** kept the title to two short lines ("Notes on" / "Leaving"), which stay well left of 0.56. The overlap is not visible, but the box still contains it.
