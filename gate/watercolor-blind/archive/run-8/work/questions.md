# Questions — House on Alder Row

These are the questions that came up while resolving the 30 s, 9:16, six-shot page. Each one names what the pack says, what it leaves open, and the decision I took so the film could be written. The lead can overrule any decision. Items marked **defect** look like a gap in the pack rather than a director's choice.

## 9:16 geometry

**1. The title's horizon wash has no 9:16 box. (defect)** `watercolor_title.json`'s `vertical` array maps title, subtitle, names, arch, seal, monogram, venue and date — but not `horizon`, although APPLICATION says the maps cover "the background washes". Every other wash is mapped: the specimen's `edge-wash`, the quote's `object-wash`, the close's `unfinished-wash` and `paper-gap`. Decision: place the horizon as a full-bleed band at y 0.58–0.86, the 1:1 fractions, behind the venue and date labels. If the lead's resolver instead drops unmapped ops at 9:16, the title loses its ground wash.

**2. Do the 9:16 boxes repaint a prop or fit it?** The boxes change each prop's width-to-height ratio: the arch goes from 0.71 at 1:1 to 0.48 at 9:16, the quote object from 0.63 to 0.39, the close detail from 0.68 to 0.44. APPLICATION says "do not stretch the 1:1 boxes" and "recompose rather than crop", but each prop is one painted asset (`prop.painted-arch`, `prop.painted-specimen`). Does the lead repaint the form to the new box, or fit the same painting into a different ratio? Decision: repaint to the box — the arch is drawn taller, the key narrower — because fitting would stretch the brush.

**3. The specimen's leader has about 8 px to run.** At 9:16, `specimen` ends at x 0.68 and `specimenNote` begins at 0.70 — 0.02 of a 390 px page, about 8 px. The 1:1 leader runs 0.04 (about 15 px). Is a tick-length leader acceptable, or may the note move to the wider `note` box (x 0.12, w 0.60) when the specimen is tall? Decision: keep the mapped `specimenNote`, and start the leader on the subject at (0.52, 0.31) so the line is about 70 px long even though the boxes are adjacent. If the lead reads the map strictly, the leader is an 8 px tick and still a leader.

**4. One leader path for two specimens.** The specimen recipe is repeated, so it reuses one leader path, but shot 2 is a latch and shot 3 is a stair. Per-shot notes are declared S2; a per-instance leader anchor is not mentioned. Decision: compose both subjects so the named feature sits at the same point in the specimen box, (0.52, 0.31), so one re-anchored path touches both. If the lead allows a nudge, the stair's leader can drop 0.04 and still touch the tread.

**5. How short is the caption at 9:16?** The caption rule is 16 words and 2 lines; `specimenNote` is 0.22 wide — about 86 px at 390 px, roughly 15 characters at 24 px Caveat. APPLICATION says "shorten the caption rather than exceed the box", so the box wins, but that leaves a note of two or three words. Is that the intended register at 9:16, or should the note box widen? Decision: "worn smooth" (11 characters, two words), which sets on two lines and survives the box.

## The mist

**6. How is the erase timed? (defect)** STYLE says the quote's outgoing wipe and the mist's wipe are one erase. The quote's `transitionOut` is a wipe, the mist's composition has another `transition` op, and the mist's paper wash is a static polygon at opacity 1. The recipe gives the mist 4–7 s but no duration, easing or start for either wipe. Is the mist shot the erase in progress, or an already-erased hold? A 4.500 s mist that begins already erased is a blank sheet for a seventh of the film. Decision: one continuous erase — the quote's brush edge enters the mist shot at its first frame, and the paper wash climbs the page across the 4.500 s, so the sheet is clear at the mist's last frame and the wipe out is the final pass.

**7. What does the mist hand to the close?** The mist's `transitionOut` is `wipe`, and the close is a page contract with its own sheet. If the close is a new sheet, the wipe out of paper is paper-to-paper and invisible; if it is the same sheet, the wipe has nothing to do. STYLE says the mist "is not a fresh world", but every page contract is a sheet. Decision: the close begins on the sheet the mist has just cleared, and the wipe carries the last brush edge off the top; the close's paint-in then starts on bare paper.

## Brief slots

**8. What is `names` in a non-wedding film, and how long may it be?** The title recipe reads `content.names` into a one-line body slot. At 9:16 the box is 0.50 wide — about 195 px at 24 px, roughly 18 characters — and the pack gives no names limit. The style's own example is a wedding, where names are the couple. For a house film, is `names` the people, the house, or the expansion of the monogram? Decision: "Mira and Tomas", the two people leaving, with monogram "MT". A surname would overflow the box.

**9. Can `content.venue` be a bare address?** `content.venue` is read by the title and by every specimen. APPLICATION describes a measured label as "a measured place or time (for example KITCHEN, 11:40)"; the title's venue is a place. One value must serve both. Is "14 ALDER ROW" acceptable as a specimen's label, or does every specimen expect a measurement? Decision: the address as a running label, which is also what a field-journal plate would carry. If the lead wants a measurement, the only slot available is `venue`, and the address would move to `subtitle` or `caption`.

**10. May a quote stand unattributed?** The quote contract has no attribution slot; APPLICATION sends an attribution to the caption or the body. But the caption is also the specimen note and the close's line, so spending it on an attribution breaks the running note. Is an unattributed quote allowed? Decision: yes — the line is the house's, no speaker is named, and the caption stays the running note. If the pack expects an attribution, the film cannot have a running note and a quote in the same 30 s.

**11. Can one running note point at two different subjects?** APPLICATION: "A repeated caption or venue is a running note or label, not a different note." Shots 2 and 3 use the same caption on a latch and on a stair. Is that a sanctioned refrain, or should a repeated note only be used where it names the same feature? This decides whether shot 3 is a rhyme or a mistake. Decision: a refrain — "worn smooth" is the film's one observation, and the two plates are two places where it is true. If the lead reads the rule as "same feature only", shot 3 needs a different recipe or the note must be generic enough for both.

**12. Is `date` one date for the whole film?** The title and the close read the same `content.date`. A film that wants a span at the title (1985–2026) and the sale date at the close cannot have both; a range is a string, but the pack never says a range is a valid label. Decision: "SPRING 2026" on both, with 1985 in `body`, where a number that is prose belongs.

## Title, close and sound

**13. When does the close's stamp thump land?** The close's seal is in the composition at frame 1 (no entrance op), and the style allows "one quiet stamp thump" at the close without giving a cue. Does the thump land at the shot's first frame, with the seal, or at the end of the paint-in? Decision: at the close's first frame, with the seal, so the sound marks the page rather than the painting.

**14. Is the title's type painted in, or set?** The authoring log says "then the title is painted in", but the motion section's 1.2 s / 1.8 s rule names the arch, the quote's object and the close's detail, not the title's type, and the title recipe has no text op. If the type is also a 1.8 s painted form, the title's reading window in a 4.667 s shot is about 2.9 s, and the arch would have to paint at the same time. Decision: the arch paints in 1.8 s and the type is cued with its last stroke; the type is set, not painted. If the pack wants painted type, the title needs more than the 4.667 s the allocation gives it.

**15. Does "one readable line" mean one sentence or one typographic line?** STYLE says the quote is "one readable line and one hand note". At 9:16 the quote box sets about 19 characters a line, so any 12-word line is three or four lines. If "one line" is typographic, the quote must be about five words. Decision: one sentence, set over three or four lines; the 12-word line is the page's single argument and stays under the 16-word limit.

**16. Empty or omitted?** `hashtag`, `rsvp` and `photos.*` are read by no recipe. Should a brief carry them as empty values, or omit them? A validator that treats a present-but-empty field as provided would answer differently, and the schema says all fields are optional. Decision: present but empty, so the brief shows the whole shape and no invented content.

## Settled from the pack (not questions)

- Six shots from five page contracts means one repeat; the specimen is the only contract built for one subject, so it is the repeat.
- The walk is out by arithmetic: 12 s plus the five page minima (21 s) is 33 s, before any repeat.
- The mist follows the quote, so the quote's outgoing wipe and the mist's wipe are one erase; no page turn sits between them.
- The accent is one mark: the same vermilion seal at the title and the close, and none in the mist.
- The paint-in choice is 1.8 s, made here and recorded in `treatment.md`; the seed is the lead's.
