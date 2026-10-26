# Questions the pack did not answer

Fourteen questions, grouped. Each states the gap, why the pack does not close it,
and what I did in `brief.json`, `format.json` and `treatment.md` so the film could
resolve without inventing a rule. None of them requires a change to the pack to
run the resolver; several would change the film if the lead answers differently.

## Slots and text

**1. One caption serves four plates.** `content.caption` is a slot on both specimen
plates (the hand note), on the quote (the note beside the line) and on the close
(the closing line). One value per slot means the same four words appear four times.
The pack allows a repeated caption as "a running note" and defers per-shot notes to
S2, but it does not say whether a four-plate refrain is the intended reading of the
format or a limitation the author should route around. I wrote the caption as a
refrain that is true of all four subjects rather than a description of any one, and
put the per-shot subjects only in the treatment. Should a route instead avoid
repetition — for example, a route whose only caption-bearing plate is the close?

**2. An attributed quote is impossible while the caption is the running note.** The
pack says the quote has no attribution slot and that attribution goes in `body` or
`caption`. Here the caption is already the note on three other plates, so an
attribution there would hang "— a name, a year" beside a key and a stool. The pack
does not say whether an unattributed line is acceptable in S1a, or whether the
caption must be spent on attribution whenever the quote is attributed at all. I
used an unattributed line, written as the film's own observation, and named no one.

**3. The close has a subject and no leader.** The style says a view with a subject
carries one hand note with a leader line, and the specimen's failure modes include
"a note without a leader line". `watercolor_close` has a subject (`detail`), a
closing caption (`closing`) and no leader op at all. Is the close exempt, as the
title is exempt from carrying a note, or is the close missing a path? I treated it
as exempt; the pack does not say so.

**4. `content.names` in a film with no cast.** The guide allows "the people the film
is for, or the subject/songwriter in a non-wedding film" and says the slot uses the
body role. It does not say whether a phrase that is a place rather than a name
("the Quillon house, 14 Orchard Row") is legal in a slot called `names`. I used the
subject and its address, two lines of 18 and 14 characters, because the person the
film remembers is deliberately never named: the only human traces are wear and two
initials.

**5. One venue value on three plates.** `content.venue` is read by the title
(`venue`) and by each specimen (`place`). With two specimens in the route, one
label has to be true on three plates. The pack calls a repeated venue a "running
note or label" but does not say whether the title plate should carry the same
measured label as the specimen pages, or carry the place while the specimens carry
a measurement. I chose a film that happens in one room so that "FRONT ROOM, 4:10"
is true everywhere and reads as the journal's header. That is a content choice
forced by a slot limit, not a rule the pack states.

## Geometry at 9:16

**6. The specimen leader is 0.02 wide.** In `aspectBoxes.9:16` the specimen box ends
at x 0.68 and `specimenNote` begins at x 0.70. Re-anchored to those boxes, the
specimen leader is 0.02 of the page — a tick, not a leader. The guide says to
re-anchor leader paths to the 9:16 boxes but does not say whether the note box may
move, or whether the leader may start inside the subject box and end inside the note
box. I ran it from the painted edge inside the specimen box to the note's first
baseline, which crosses both box edges by a few pixels. Is that the intended
re-anchor, or should the note box move left?

**7. `specimenNote` cannot hold 16–18 characters per line.** The guide says to expect
"about 16–18 characters per line" at 24 px in the 0.22-wide `specimenNote`. 0.22 of
a 390 px page is 86 px; 16 characters at 24 px need roughly 300 px in any of the
pack's four faces. The box and the character count cannot both be right. Which
binds? I treated the box as binding and wrote the caption in two lines of 13 and 8
characters, with the character count as advisory.

## Material and motion

**8. The 6 px bristle threshold moves when the frame is scaled.** `STYLE.md` fixes the
threshold "at the output frame"; the guide says `strokeWidths` are "output-frame
pixels at the 390 px authoring width; scale them with the page". At a 1080-wide
delivery a scaled `standard` 4 px becomes about 11 px and would cross the threshold,
so every standard stroke would carry bristles. Is the threshold fixed in authoring
pixels (only `wide` ever carries flying white) or in delivery pixels (`standard`
gains bristles when scaled)? I painted flying white only on `wide` strokes and kept
`standard` and the rigger clean, which holds under either reading, but the pack
should say which it means.

**9. The paper gap: a stopped wash or an overlay?** The guide describes the close's
gap as "the last wash pass stops before the form's edge, leaving one paper-coloured
gap" — an absence of paint. `watercolor_close` builds it as a `paper`-coloured shape
at opacity 1 laid over `detail` — an opaque rectangle. Those are different objects,
and the style refuses opaque flat fill. Which is the renderer to build? I read it as
the stop and composed the unfinished wash so its pooled rim sits beside the gap, but
the recipe can only be read as an overlay.

**10. May a subject return on a second plate?** The door is the quote's painted
object (4.7 s) and the close's detail (4.5 s). The pack says one hero subject per
view and that assets are types not subjects, but it does not say whether the same
painted subject may return. I used the return deliberately — the door shut, then the
same door still being painted — because it makes the last frame an argument instead
of a new object. If a subject may not return, the close needs a different detail and
the film loses its rhyme.

**11. Two page turns meet.** `watercolor_specimen` exits on `page_turn`, so a route
with two specimen plates runs page_turn, page_turn into the quote. The pack allows a
page turn between journal pages but does not say whether two consecutive turns read
as turning two pages of one journal or as a stutter a route should avoid. I kept
both: the recipe offers no other exit, and dropping the second specimen costs the
film one of its three objects.

**12. One leader path, two subjects.** The two `detail` plates share one recipe, one
note position and one leader path, but their subjects are a key (small, horizontal)
and a stool (tall). One path cannot point at both unless the subjects are composed
to meet it. I composed both to the same anchor, so the leader points at the key's bow
and at the stool's dip. Is that the intended workaround, or is a per-plate anchor
part of S2? The pack says per-shot notes are S2 but says nothing about leader
geometry.

## Sound and delivery

**13. Nine seconds of silence, and whether the motif may return.** Music is out from
the mist through the close: 4.5 s of mist plus 4.5 s of close is 9.0 s of a 30 s
film, nearly a third. The guide says the silence is structural, not a fixed
percentage, and allows one quiet stamp thump at the close. It does not say whether
the thump is the last sound or whether the motif may return under the hold after it.
I ended the film on the thump with no music after it, and stopped the phrase on the
quote's outgoing wipe so that the song and the paint leave together.

**14. Delivery loudness.** The pack says delivery loudness belongs to the format and
gives no target, and the format schema defines no field for it. I carried
`-16 LUFS integrated, -1 dBTP` as passthrough metadata for a film that ends in
silence, because a silent close needs a defined floor or it reads as a dropout. The
number is my default, not the pack's; the lead should confirm or overrule it.
