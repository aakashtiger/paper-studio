# Questions — What the Room Kept

The pack answers most of this route. These are the places where two pack files disagree, or where the contract stops at the 9:16 page. Each entry names the file, says what changes in this film, and records the assumption I used so the four files resolve. None of these is a request to edit the pack.

## 1. Is `content.names` read by any recipe?

**Conflict.** `inputs/pack/recipes/watercolor_title.json` lists `content.names` in `slots` and places a `names` text op at x 0.08, y 0.56. `APPLICATION.md` says under “Unused fields” that `names`, `hashtag`, `rsvp` and `photos.*` are not read by any recipe. Both statements cannot be true.

**Effect.** If the title recipe is authoritative, the title shows “Nora Vale” and the 9:16 `names` box is used. If the application is authoritative, the brief's `names` value is ignored and the `names` box stays empty.

**Assumption.** The recipe is authoritative. `brief.json` fills `content.names` with “Nora Vale.” The format does not depend on the answer; only the title's name line does.

## 2. How do the 1:1 recipe compositions map to the 9:16 boxes?

**Conflict.** The recipes carry 1:1 coordinates. `tokens.layout.aspectBoxes.9:16` defines a different set of boxes, and `APPLICATION.md` says to use them instead of stretching the 1:1 boxes and to re-anchor leader paths. No recipe states which 9:16 box each op should use. Three concrete gaps:

- The specimen's `place` op is at y 0.82. Is that the `label` box (0.08, 0.82, 0.6, 0.05) or the `labelVenue` box (0.08, 0.76, 0.6, 0.05)?
- The 9:16 `specimenNote` (y 0.3) and `quoteNote` (y 0.6) sit above the style's “caption sits in the bottom safe zone.” Which is the 9:16 contract for a hand note—the named note box or the bottom safe zone?
- The title's `arch` box (x 0.58–0.92, y 0.22–0.62) and `monogram` box (x 0.84–0.96, y 0.20–0.25) overlap. Is the monogram meant to sit on the arch, or should the arch be composed away from it?

**Assumption.** I used these boxes: title = `title`, `subtitle`, `names`, `arch`, `seal`, `monogram`, `labelVenue`, `labelDate`; specimen = `specimen`, `specimenNote`, `label`; quote = `quote`, `quoteObject`, `quoteNote`; close = `closeDetail`, `closeWash`, `closeSeal`, `closeMonogram`, `closeNote`, `closeDate`. The monogram sits on the upper right jamb of the window, not in the opening. The note boxes win over the generic bottom safe zone because the application names them for the 9:16 page.

**Open.** Does the resolver apply this mapping automatically, or must the lead remap each recipe op by hand? If the latter, the mapping in `treatment.md` is the instruction I would give.

## 3. Is the close's `paper-gap` fixed, or does it follow the form's edge?

**Conflict.** `inputs/pack/recipes/watercolor_close.json` fixes `paper-gap` at x 0.62, y 0.18, w 0.06, h 0.34. `STYLE.md` says the unfinished detail's last wash pass stops before the form's edge, leaving one paper-coloured gap. A fixed rectangle is not the same thing as the form's edge.

**Effect.** If the gap is fixed, the cup handle must be composed so its unfinished join lands under the rectangle. If the gap follows the form, it can be placed wherever the handle stops.

**Assumption.** I kept the recipe's rectangle and composed the cup handle's join to it. The gap is the sheet showing through, not a white shape. The treatment states this so the lead can see the choice.

## 4. Does the 1.2 s / 1.8 s paint-in choice cover every painted form?

**Question.** `capabilities.governance.choices` has a single `paint-in-speed` choice: 1.2 s or 1.8 s “per painted form; a specimen is the reference.” Does that cover the title's window arch and the close's unfinished cup handle, or only the specimen and the quote's object?

**Assumption.** I chose 1.8 s for every painted form: the violet, the latch, the cup, the close's cup handle and the title's window arch. The mist is a wipe, not a paint-in; the seal is a stamp, not a painted form. If the title arch and close detail are outside the choice, their timing is still set to 1.8 s for consistency, but the pack has not said so.

## 5. Does the same seal twice count as one recurring accent?

**Question.** `STYLE.md` says “a single vermilion mark recurs” and defines “recurs” as at least twice. The title and the close both use `prop.stamp-seal`, at different positions. Does that count as one mark recurring, or two marks?

**Assumption.** One mark, twice: the title's stamp and the close's stamp are the same vermilion seal. The mist carries none. No other accent is used. If the critic counts two marks, the film would need to drop one seal or use a different recurring mark.

## 6. How do the quote's wipe and the mist's wipe compose?

**Conflict.** `inputs/pack/recipes/watercolor_quote.json` has `transitionOut: wipe`. `watercolor_mist.json` is also a wipe and composites over the outgoing shot. `APPLICATION.md` permits the mist after a quote but does not say how the two wipes compose.

**Assumption.** The quote's wipe is the handoff; the mist is the erase. The mist has no caption and no accent. If the quote must hold for the mist to have something to erase, the quote's exit needs a `hold` or the mist needs a different entry; the pack does not say which.

## 7. Is a wordless instrumental enough for a “song/memory film”?

**Question.** `STYLE.md` says voice is optional. The commission forbids third-party lyrics, song titles, music, voice and images. The pack does not define what makes a film a “song/memory film” rather than a memory film with music.

**Assumption.** The song is a wordless solo felt-piano motif, unhurried, no drums. There is no vocal and no lyric. The only words are the brief's line and note. If the commission expects a sung hook or a lyric, that is a brief change, not a style rule. An original vocal would also need a performer and a clearance; the pack supplies no audio.

## 8. How are the last whole milliseconds rounded? (minor)

**Question.** The allocation rule shares the remainder in proportion to remaining capacity, in whole milliseconds, with ties to the earlier shot. It does not say whether whole milliseconds are rounded to nearest, floored with the residual distributed by largest remainder, or carried.

**Effect.** For this route the exact shares are 666.667 / 833.333 / 833.333 / 666.667 / 500 / 500 ms. To whole milliseconds that is 667 / 833 / 833 / 667 / 500 / 500 ms, which sums to 30.000 s. There is no .5 tie, so the six seconds are stable under any of the three methods.

**Assumption.** 4.667 / 5.833 / 5.833 / 4.667 / 4.500 / 4.500 s, as stated in `treatment.md`.
