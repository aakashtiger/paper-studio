# Questions — Number Nine, Alder Row

The film is a 30 s, 9:16, six-shot page: `watercolor_title` (title), `watercolor_specimen` twice (detail), `watercolor_quote` (quote), `watercolor_mist` (transition) and `watercolor_close` (close). The brief is fictional. The points below are the ones the pack did not settle.

## 9:16 composition

1. **The 9:16 boxes are partial.** `tokens.layout.aspectBoxes["9:16"]` gives `title`, `subtitle`, `arch`, `specimen`, `note` and `closeDetail`. It gives no box for the quote's text, object or note; no box for `content.date`, `content.venue`, `content.monogram` or the seal; and no box for the close's `unfinished-wash`. At the recipes' 1:1 coordinates, the title monogram (`x 0.84, y 0.22, w 0.12, h 0.05`) overlaps the 9:16 arch box's top-right corner (`x 0.58–0.92, y 0.22–0.62`); the seal and monogram reach `x 0.96` and the quote's object reaches `x 0.94`, past the 8% right margin (`0.92`). The seal is a square prop, but its `0.12 × 0.12` box becomes 47 × 83 px at 9:16; the quote's object box becomes 117 × 333 px, which would stretch a key. Is the 9:16 page meant to be hand-composed around the four boxes, with the seal pinned square and the key redrawn, or does the pack need boxes for the remaining marks?

2. **The specimen's leader has no 9:16 path.** In `watercolor_specimen` the leader runs from `(0.62, 0.32)` to `(0.80, 0.26)`. The 9:16 `note` box is `(0.12, 0.70, 0.60, 0.12)`. If the note moves below the specimen, the authored leader ends in the right margin, not at the note — a "note without a leader line" failure. Which anchor should the leader grow to at 9:16, the specimen's upper right or the note below? The quote's leader (`0.60, 0.54` to `0.50, 0.62`) still reaches its note's right edge, so only the specimen is affected.

3. **The caption's home is stated twice, differently.** STYLE.md says "the caption sits in the bottom safe zone." `watercolor_specimen` puts its note at `y 0.28`, `watercolor_quote` at `0.60`, `watercolor_close` at `0.46`, and only `watercolor_walk` at `0.76`. The 9:16 `note` box is at `0.70`. Which governs the hand note on the 9:16 page?

## Text contracts

4. **One caption, three contracts.** `content.caption` is the specimen's note, the quote's hand note and the close's closing line. One value per slot means a film that uses all three writes the same words four times (two specimens). Is a refrain the intended reading of "a running note", or is the 9:16 page meant to avoid using the specimen, quote and close together? If a refrain is intended, is there a recommended maximum number of repeats?

5. **The quote has no attribution slot.** `watercolor_quote` reads `content.body`; the brief has no source or attribution field. Can the line be the film's own, as here, or does the contract expect a quotation with a source? The commission forbids third-party lyrics, so an invented line is the only legal option; the pack does not say whether an unattributed line is allowed.

6. **The 16-word cap and the two-line cap conflict at 9:16.** `capabilities.adaptation.captions` says "Sixteen words maximum per content slot, two lines maximum." At 9:16 the caption is 24 px and the note box is 0.60 × 390 = 234 px; Caveat at 24 px fits roughly 40 characters (7–8 words) over two lines. A 16-word note would need about four lines. Which limit wins — the word cap or the line cap? Is the 16-word cap meant for the 1:1 body, not the 9:16 hand note? (The five-word note in this brief fits both.)

7. **There is no label length rule and no 9:16 label box.** `content.date` and `content.venue` are the only label slots. The specimen's 1:1 place box is 0.40 wide — about 18 mono characters at 390 px — so a longer place name (`THE WALLED GARDEN, 11:40`) would overflow, while the style's own example is short. At 9:16 there is no label box at all. Is there a character limit for a label, and where do the date and venue sit on the vertical page?

## Subject and assets

8. **The monogram is authored for people.** BRIEF.md says "the couple appears as names, a monogram and painted motifs"; the monogram is 18 px at 9:16 and is used by the title and the close. Can it carry a house number (`N9`), or is a non-person subject left unmarked? If a house can be marked, is a number acceptable in a slot named for initials?

9. **The title's arch is hardcoded as a garland.** `watercolor_title` uses `prop.painted-garland` for the arch, and the pack's example is a garden wedding. May the garland carry the porch's ivy in a house film, or is a garland reserved for a wedding? The "assets are types, not subjects" principle names only `prop.painted-specimen` as an example, so the garland's subject range is unstated.

## Motion and sequence

10. **The specimen's push-in is exactly 6%, not "under six percent."** STYLE.md's signature says "a slow push-in under six percent"; `watercolor_specimen` goes `1.00 → 1.06`, which is 6%. The title is `1.00 → 1.04`. Which is the contract — the signature text or the recipe's `to: 1.06`? If the recipe wins, is 6% "under six percent" by rounding?

11. **Is the mist a standalone shot or an overlap?** The guide says the mist "erases the shot before it"; the recipe is a 4–7 s shot whose composition starts on a fresh paper layer. If it is standalone, 4.5 s of the 30 s film is near-blank paper; if it carries the previous shot's last frame, its first part is the quote's key being washed away. Which does the resolver composite? The guide says the silence is structural, not a fixed percentage, but gives no upper bound for the 9 s silent tail (mist + close).

12. **Two page turns in a row.** Every specimen exits with `page_turn`; two consecutive specimens turn the page twice, 5.8 s apart. Is that the intended journal rhythm, or should a repeated specimen have an alternative exit? The pack allows a repeated page contract but does not say how its transition behaves when repeated.

## Production

13. **The seed has no value or range.** `tokens.seed` names the seeded surfaces (stroke phase, paper fibre offset, wash-edge jitter, paint-in order) and the fixed surfaces, but gives no default seed or bounds. The guide says the seed is a director's choice recorded in the treatment. Is any integer legal, and is `419` acceptable?

---

The brief carries only the seven slots the selected recipes read. `names`, `hashtag`, `rsvp` and `photos.*` are omitted because no selected recipe reads them and the film has no photograph; the guide says every brief field is optional.
