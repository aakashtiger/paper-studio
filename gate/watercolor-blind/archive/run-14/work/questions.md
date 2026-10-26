# Questions the pack did not answer

Written after the route was chosen, so each question says what it blocked and
what I did instead. Nothing here is a request to edit the pack; it is the list
the lead should read beside `treatment.md`.

## Content and slots

**1. Is a place a legal subject for `content.names`?**
`APPLICATION.md` says `names` holds "the people the film is for, or the
subject/songwriter in a non-wedding film", 18–24 characters per line. A house is
a subject but not a person and not a songwriter. The title recipe is the only
`title` beat and it requires `names`, so a place-subject film cannot leave it
empty. I used the house's name, `Wren House` (10 characters). Is a place legal,
and is a short one-line name acceptable below the 18–24 character guidance, or
should the number have been kept (`Wren House, No. 14`)? I dropped the number
because 17 characters risks a second line in the 179 px names box, and a lone
`14` on the second line would read as a caption.

**2. One caption across four plates: intended, or a combination to avoid?**
The 9:16 page contracts I selected are title, specimen, quote, mist, close. One
value per slot, so `content.caption` becomes the specimen note on both specimen
plates, the quote's note, and the close's closing line. The guide makes each of
those legal ("a repeated caption or venue is a running note", "the close may
share the caption as a refrain"), but it never says whether a 30 s page *should*
select a specimen and a quote together, given that the caption must then be an
observation, an aside and a refrain in one phrase. I wrote a caption that works
in all four places (`warm till five`) and treat the repetition as the film's
running note. Is that the intended reading, or is the pack's expectation that a
short page picks one "note-bearing" contract and lets the other be wordless?

**3. Where does a spoken quote's attribution go when the caption is a running
note?**
The guide says "a caption used as a running note is not an attribution", and
that a quote's attribution goes in `caption` or `body`. But when the caption is
already a running note and the body *is* the quote, there is no slot left. My
quote is the film's own line, so it needs no speaker and the problem did not
bind — but a film quoting a person could not be built this way. Is the
expectation that a quoted film drops the quote contract, or that the speaker is
written into the body as a lead-in (`Ada said:`), which spends words on the
attribution inside the 16-word cap? I did not test the second because it changes
the body from a line into a report.

**4. Is the card's date form a rule or an example?**
The card prints `21 JUNE 2026` in IBM Plex Mono upper case; the brief schema
says `date` is a free string and the style says measured labels are short and
one line. I copied the card's form (`14 MARCH 2026`). Is day–MONTH–year upper
case the required convention for every date label, or was the card just showing
one? A non-English month name would also need an answer, since the pack is
Latin-script-only but not English-only.

## Route and page contracts

**5. Is the page order fixed?**
`STYLE.md` calls the 1:1 page "a locked sheet: title, specimen, quote, mist and
close", which reads as an order, and the 9:16 rules only say the page "uses the
page contracts". Nothing states that a vertical page must open on `title` and
end on `close`, or that `mist` must follow a quote. I assumed title first, close
last, mist after the quote. If the order is free, a film could open on a
specimen and end on a quote — that changes what the 30 s page can argue, so it
should be stated.

**6. When is a repeat `count` and when are two beats?**
The guide says `count` repeats a shot with the same recipe and slots, two
entries are for repeats that are "not identical". But with per-shot subjects
deferred to S2, two specimen plates can only differ in the treatment: to the
resolver they are byte-identical. So by the schema's reading they are
identical (`count`), and by the film's reading they are not (two entries). I
used two beats (`plate`, `return`), both mapping to `detail`, because the
treatment names a different object for each. Which reading does the resolver
expect, and does a repeated page contract with an identical note add anything a
second quote would not?

**7. Page turn, then mist: which reading is intended?**
The guide says a mist after a specimen "would erase a blank page" because the
specimen's `page_turn` has already made a new sheet, but it also says to "treat
the turn as the page break before the erase". Those point in opposite
directions. I avoided the case by placing the mist after the quote. If a later
film wants mist-after-specimen: which is the failure, and if the turn is the
break, does the turn's duration belong to the outgoing specimen's shot, to the
mist's shot, or to neither?

**8. The quote's wipe and the mist's wipe as one erase: inside or outside the
allocation?**
"One erase" is a visual instruction with no timing. The quote's 4.667 s and the
mist's 4.500 s are allocated as two shots that sum into 30.000 s. If the erase
is shared, either the two shots overlap in time (the film is 29.x s) or the
quote's wipe finishes before the mist begins (two wipes, not one). I treated the
shared edge as a visual continuation with no overlap: the quote's wipe is the
leading edge and the mist shot takes over as that edge crosses the quote's upper
third. Is that the intended reading? The alternative — a real overlap — would
need the resolver to know about it, and it does not.

**9. Is a `transitionOut` inside the shot or between shots?**
Related to 8: the wipe at 1→2 is the title's `transitionOut`, the page turn at
2→3 is the specimen's, and the hold at the end is the close's. Is a
`transitionOut` inside the shot's seconds (the last frames of the shot) or
between shots (time that belongs to neither)? My allocation assumes inside the
shot, since the resolver only sums shots. Nothing in the pack states it.

## 9:16, type and painting

**10. How does the title's type enter?**
The authoring log says "the title is painted in", but the 1.2 s / 1.8 s rule is
written for painted forms and names the arch, the quote's object and the close's
unfinished detail — not display type. A typed fade would be a dissolve
(refused), a wipe is a transition (so not an entrance inside the plate), and
stroke-wise painting of letterforms is a different capability. I specified the
display type revealed by the same 1.8 s left-to-right mask as the arch, because
it matches the hand note's reveal. Is type revealed by mask, set instantly, or
painted? The pack should say, because a 4.667 s title plate is mostly this
question.

**11. What are the title's line-break and length rules at 9:16?**
The title box is 0.46 of a 390 px page (about 179 px) at 44 px display: roughly
nine characters a line. The author cannot control the line break, and the pack
sets no minimum or maximum title length for the vertical page. I chose a
three-word title that breaks cleanly into two lines (`A Room,` / `Measured`).
Is a three-line title acceptable, and is there a limit on how many lines a
display title may take before it stops being a title plate?

**12. `paper-gap`: the recipe's opaque shape or a stopped wash?**
The close recipe's `paper-gap` is a `paper`-coloured shape at opacity 1 in a
fixed 0.05 × 0.34 box. The guide says the gap is "the sheet showing through, not
an opaque pigment fill — a paper-coloured shape or a stopped wash is allowed."
The two produce different edges: the shape gives a hard rectangle, the stopped
wash gives a wash edge. The refusals also say "no opaque flat fill", which the
shape is, literally. Which is authoritative — the recipe's op or the guide's
preference? I specified the stopped wash as the intent and the shape as the
recipe's fallback, so the renderer needs a decision.

**13. The mist's internal timing.**
The mist shot is described as "the erase in progress, not an already-erased
hold", yet it is 4.5 s and contains both a rising wavy edge and a full-frame
`mist-full` pass. How much of the shot is the edge, how much is the final pass,
and what fills the remainder without becoming the forbidden hold? I specified
the edge travelling from the bottom of the frame to the top across the whole
shot, with `mist-full` completing on the last frame. If the edge is meant to
finish earlier, the shot needs a stated duration split, or 4.5 s of mist is
mostly a hold.

## Sound and delivery

**14. Does the music stop at the mist's first frame or at the quote's wipe?**
"Music is out from the mist through the close" is clear about the region, but
the quote's wipe and the mist's wipe are one erase. If the erase starts during
the quote, does the music stop with the wipe (inside the quote's shot) or with
the mist's first frame? I stopped it at the mist's first frame, so the quote's
last frames still carry the motif under the leading edge.

**15. Delivery loudness.**
The style says delivery loudness belongs to the format and the guide allows a
passthrough `loudness` field, but no target is given and no shape is specified
(object, string, numbers). I wrote `"-16 LUFS integrated, -1 dBTP true peak"` as
a string because the resolver ignores it. Is that the house target, and is a
string the expected shape? If the field is later validated, a string may fail.

**16. Export size and the 14 px floor.**
The 9:16 scale is authored at 390 px wide; the guide says larger frames scale
proportionally and "the 14 px floor stays", and elsewhere to "scale the widths
and the threshold together". Those two readings differ: absolute 14 px at
1080 × 1920 is about 5 px at the authoring width, i.e. far below the authored
floor; proportional scaling makes it about 39 px. I assumed proportional. What
is the delivery size for the 30 s page, and is the floor absolute or authored?

## Accent and assets

**17. Does the seal carry the date?**
`prop.stamp-seal` lists the anchors "accent mark" and "date block", and the card
draws the seal as a ruled vermilion stamp. Nothing says whether the date is ever
set inside or under the stamp. I kept the date as the separate `labelDate` /
`closeDate`, and the seal as a pure mark. Is the "date block" anchor a hint that
the seal is meant to frame the date in some films, or only a note about where
the stamp sits relative to it?

## One thing that is not a question

The walk is not used and not missed: its 12 s minimum cannot fit a 30 s
six-shot page, and this film's argument is a locked sheet read top to bottom.
The 16:9 scroll would be a different film.
