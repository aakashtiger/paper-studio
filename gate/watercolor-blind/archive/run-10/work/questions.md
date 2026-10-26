# Questions — what the pack did not answer

The pack answered the route (five page contracts, repeat one), the allocation rule,
the 9:16 boxes and vertical maps, the names slot, the mist's end state and the
one-value-per-slot limit. These are the gaps that mattered while making *The Room
in Blue* at 30 s / 9:16 / six shots. They are in the order they bit.

1. **The caption box is narrower than the stated limit.** At 9:16 the
   `specimenNote` box is 0.22 × 0.18 of the frame — about 86 × 125 px on a 390 px
   page. At caption 24 px a Caveat line holds roughly eight characters, so the
   two-line rule caps a note near sixteen characters, while the pack's only stated
   limit is sixteen *words* and the guide says "shorten rather than exceed the
   box" without saying how far. Which limit binds? Is a specimen note allowed to
   use the wider `note` box (0.12 / 0.70 / 0.60 / 0.12), or must every specimen
   note be a haiku? This film's note is sixteen characters including spaces.

2. **`names` has a one-line box and no character budget.** The 9:16 `names` box
   is 0.5 × 0.06 — about 195 × 42 px, one line at body 24 px, roughly eighteen
   characters. The guide calls `names` "one short line", but the only written cap
   is sixteen words, which cannot bite in that box. May `names` take two lines, or
   must it be one person? Two names joined by "and" will not fit. This brief uses
   one name and a "for" phrase.

3. **A repeated page contract cannot name a second subject.** The pack permits a
   repeat and says the repeat reuses the composition and slot values; it also says
   per-shot subjects live only in the treatment, because per-instance subjects are
   S2. So the sealed inputs cannot tell the resolver that shot 2 is a latch and
   shot 3 is a key. What is the second specimen expected to paint in a sealed run?
   Is the lead expected to carry the treatment's subject into the render by hand?
   And does the gate accept one running note appearing four times (two specimens,
   the quote, the close)? This route relies on a specimen repeat because the walk
   is out and the other four contracts repeat worse.

4. **No stroke widths are authored, so the 6 px bristle rule cannot be checked.**
   Flying white is defined by strokes wider than 6 px at the output frame, and the
   pack warns that at 9:16 only strokes that stay wider than 6 px carry bristles.
   But `tokens.json` gives no stroke widths, and no recipe says which form is a
   wide wash and which is a rigger line. Which ops are wide strokes and which are
   clean? This film assumes the horizon wash, the sill wash and the unfinished hem
   wash are wide, and the stems and leaders are thin.

5. **The quote cannot be attributed when the caption is a running note.** The
   quote's note slot is `content.caption`, which is the same slot that carries the
   specimen note. The pack says a quote's attribution goes in the caption or the
   body, but not what to do when the caption is already committed as the film's
   running note. Is an unattributed line allowed? This film's line is unattributed
   and the missing attribution is stated in the treatment, not the film.

6. **The mist recipe draws its own paper, but the mist must composite over the
   outgoing shot.** The mist composition opens with a `paper` layer at z0 and an
   opaque `mist` above it; the guidance says the mist erases the shot before it and
   composites over the outgoing shot. Rendered as a standalone shot, the recipe
   would be an opaque sheet and no erase would be visible. How is the previous
   frame carried under the mist, and is the recipe's paper layer suppressed in that
   composite?

7. **Two wipes are described as one erase, but both recipes carry a wipe.** The
   quote ends on `wipe` and the mist ends on `wipe`, and the guide says the quote's
   outgoing wipe and the mist's wipe are one erase with no page turn between them.
   Are the two transitions merged, or does the film show two wipe events? Neither
   schema has a per-shot transition field, so the author cannot declare the merge;
   the route only puts the mist directly after the quote and hopes the resolver
   treats the pair as one.

8. **The mist has no time budget inside its shot.** The mist gets 4–7 s from the
   resolver, but the guide also says the shot is the erase in progress and not an
   already-erased hold. Does the rising edge travel for the whole allocated time,
   and does `mist-full` land on the last frame? This film gives the mist 4.5 s and
   lets the edge cross the frame across all of it, which is slow but honest; a
   shorter wipe would leave a paper hold the guide forbids. If the intended wipe is
   around 1.5 s, the allocation rule will always overrun it on a 30 s page.

9. **The close's stamp thump has no timing.** One quiet stamp thump is allowed at
   the close, but the pack does not say whether it lands as the seal appears, as it
   presses, or on the hold, nor how long it is. This film puts it on the press, at
   the top of shot 6, and leaves the hold silent.

10. **The title's lettering paint-in is unspecified.** The authoring log says the
    title is painted in and the paint-in choice covers the arch, but not whether the
    lettering takes the same 1.8 s or whether the push-in starts before the title is
    legible. This film paints the arch first, then the lettering, both inside 1.8 s,
    with the push-in already running — a reading the pack neither confirms nor
    forbids.

11. **The two recurring marks have no rules beyond "same mark".** The monogram role
    is mapped to Cormorant, but the pack does not say whether the value is initials,
    a name or a mark; and the card shows the stamp rotated −4°, while the recipe
    carries no rotation. Is the monogram a mark or words, and does the seal keep one
    angle and opacity when it moves from the title margin to the close's left
    margin? This brief uses two initials and one fixed seal angle.

No invariant was unshowable on this route: all six — paper is the white, flying
white, pooled edge, painting-in, annotation leader, no vector outline — are cited
by shot in `treatment.md`.
