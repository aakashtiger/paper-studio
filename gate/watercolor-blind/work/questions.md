# Questions — Before the Keys

Everything below is a place the pack was silent or ambiguous while I applied it.
All six invariants are reachable on this route; none is missing. Ordered by how
much the answer would change the film.

## Route, repeats and the page contracts

**1. Which contract should a six-shot page repeat?**
The 30 s page has five page contracts (`title`, `specimen`, `quote`, `mist`,
`close`) and six shots, so exactly one must repeat. The pack says a page contract
may repeat and that a beat role may appear twice, but it gives no rule for
*choosing* which one. The choice changes the film's grammar: a second `specimen`
buys a second close look at the price of one caption under two different painted
subjects; a second `quote` buys a second line but the same note and the same
object asset; a second `mist` buys two erases in 30 s. I repeated `detail`
because a field journal looks twice, and wrote the caption so that it is literally
true at both subjects. Is there an intended repeat, or is this a director's
choice the pack deliberately leaves open?

**2. Two page turns arrive 5.833 s apart.**
Shots 2 and 3 are both `specimen`, so the film has a page turn at 10.500 s and
another at 16.333 s — two in under six seconds, in a 30 s film. The style says
"cut rarely" and allows `page_turn`, but nothing states a maximum frequency, a
minimum spacing, or whether two adjacent specimens are supposed to sit behind one
page turn rather than two. Does the pack have an intended answer, or should a
long film budget its page turns?

**3. Four appearances of one caption.**
The pack says the close "may share the caption as a refrain", and one value per
slot means the two specimen notes and the quote's note are the same string too.
In this route `content.caption` therefore appears four times in 30 s. Is four
still a refrain, or does the pack intend the close's refrain to be the caption's
*second* appearance, with the quote and specimens on their own slots (which S1a
cannot provide)? Put another way: is a single caption carrying three registers —
a specimen note, a note beside a quote's object, and a closing line — meant to
work, or is it a shape the format should avoid?

## The 9:16 page, the seeds of an erase

**4. The quote's wipe and the mist's wipe are "one erase" — where is the handover?**
The guide says the quote leaves on a brush edge and the mist continues it, and
that no page turn goes between them. But the mist "erases the shot before it" and
is "the erase in progress, not an already-erased hold". If the quote has already
left on its own wipe, the mist has nothing left to erase. How much of the frame
does the quote's wipe clear before the mist takes over: a brush edge crossing the
plate with most of the quote still standing, or the whole plate? And how long may
`mist-full` hold before the close begins? At 4.500 s the mist can plausibly erase
in 1.5 s and leave three seconds of blank sheet. Is a blank-paper hold allowed
inside the mist shot, or should the close's first form already be arriving?

**5. Flying white has no op.**
`tokens.medium.strokeWidths` says `wide` is 8 px and carries 3–9 bristle tracks,
and `standard` is 4 px and carries none. But no recipe carries a stroke-width op,
the guide says the width "is a property of the painted asset", and neither JSON
schema has a field for it. So an author can name the wide-brush forms in the
treatment — I named shot 2's door stile, shot 3's sill and shot 6's unfinished
wash — but cannot fix them in the format. Does the renderer read that from the
treatment, or should each recipe declare which of its forms are `wide`? As it
stands, flying white is the one invariant a blind author can only request.

**6. Does the 14 px floor travel?**
The scale is authored for a 390 px page and "larger frames scale proportionally,
and the 14 px floor stays". At 390 px the label is 14 px; at a 1080-wide delivery,
proportional scaling makes it about 39 px. "The floor stays" could mean the floor
is fixed at 14 px absolute — which would let a scaled page carry text far below
the intended ratio — or that 14 px @ 390 is itself the ratio that scales. Which is
the contract, and what is the page height a 9:16 delivery should assume
(390 × 693, and not a 19.5:9 phone)?

## Sound and silence

**7. Where exactly does the music go out?**
"Music is out from the mist through the close." My mist runs 21.000–25.500 s, so
the silent tail is 9.000 s — 30 percent of the film. Is the cue measured from the
mist's first frame, from the moment `mist-full` completes, or from the end of the
quote's wipe? The difference is up to 4.5 s of score, and in a 30 s film that is
a lot of silence to place by guess. (The guide says silence is structural, not a
fixed percentage, so I have taken the whole mist and close as silent — but the
exact in-point is not stated.)

**8. Which stamp gets the thump?**
The title and the close both carry `prop.stamp-seal`, and the same seal is one
recurring accent with two appearances. The sound section says "one quiet stamp
thump is allowed at the close". Does that mean the title's seal arrives silently
(which is what I have done), or that a thump is allowed only near the close and
the title's seal should be dry, or that one thump total should be placed at
whichever stamp the director prefers?

## Text, slots and the brief

**9. `names` for a non-wedding subject duplicates `venue`.**
`content.names` is required by the title recipe. STYLE.md says it carries "the
people the film is for, or the subject/songwriter in a non-wedding film". For a
house, the subject's name and the `venue` label are nearly the same string: I have
`names: "a house measured for sale"` and `venue: "A HOUSE MEASURED FOR SALE, 4 PM"`. Is that duplication
intended, or should a non-wedding film put the *person* in `names` and the house
only in `venue`? The pack shows no example of `names` without a couple, and the
two slots sit 20 percent of the page apart.

**10. `monogram` for a place, not a couple.**
The 9:16 monogram box is 0.1 × 0.05 — about 39 × 35 px at 390 px — which holds
two characters at 18 px. I have used `H/M` for a house measured for sale. Is a place or object
monogram in grammar (the card only calls it "the small mark"), and is two
characters the intended ceiling? A couple's initials are already at the edge of
that box; a three- or four-letter place mark will not fit.

**11. May `body` be the film's own line?**
The quote recipe's slot is `content.body` and the style calls it "one readable
line". The pack never says whether a memory film may write its own line or
whether the slot is reserved for an attributed quotation. There is no attribution
slot, and the caption is already the running note, so an attributed quotation
would have nowhere to name its source. I have written an original line
(*"The rooms are empty; the light still arrives at four."*) and left it
unattributed. Is that the intended use for a song/memory film?

**12. One `venue` for two rooms.**
The guide's example label is `KITCHEN, 11:40`, which reads as the measured place
of *that* plate. But `venue` is one value, shared by the title (as `labelVenue`)
and by both specimens (as `label`), and my two specimens are at the front door and
at the kitchen window. I have used a house-and-hour label, `A HOUSE MEASURED FOR SALE, 4 PM`, as a
running label. Is that the intended use, or is a specimen's label supposed to be
its own measured place — which S1a cannot express for two specimens?

**13. May unused brief fields be omitted entirely?**
No recipe reads `content.hashtag`, `content.rsvp` or `photos.*`, and the style
refuses photographs outright. I have left all three out of `brief.json` rather
than fill them with dead values, on the reading that the fields are optional. Does
the resolver accept an absent `photos` object, or does the brief schema expect an
empty one?

## A note on what I did not ask

The seed is the lead's, per the guide, and appears in neither JSON file. The
paint-in speed is the director's, and I have answered it in the treatment (1.8 s)
rather than leaving it open, because the film needed a decision to be timed.
