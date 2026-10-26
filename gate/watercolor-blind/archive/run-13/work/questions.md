# Questions — Before the Keys

Written against the pack only (`STYLE.md`, `tokens.json`, `capabilities.json`,
`recipes/*.json`, `card.html`) and `APPLICATION.md`. Each item is a decision the
pack does not make. Where I had to choose, I say what I chose, so the lead can
overrule it. Numbering matches `treatment.md`.

## Slots, the caption and the quote

**1. One caption on four of six plates.** The specimen (both occurrences), the
quote and the close all read `content.caption`. The pack states one value per
slot, that a repeated caption is a running note, and that per-shot notes are S2.
It does not say whether a six-shot page is meant to carry a single refrain, or
whether the route should avoid putting the caption on four plates. I wrote one
refrain — "Only the light moved.", 21 characters, 4 words — and let the plates
argue with it. If a refrain is not intended, this route needs a different
contract mix, not a different brief.

**2. Attribution when the caption is a refrain.** The pack routes a quote's
attribution to `body` or `caption`. My caption is the running refrain and my body
is already the line (9 of the 16 allowed words). The pack does not say whether an
invented line may stand unattributed — this line is the film's own writing, not a
real person's. I left it unattributed. If an attribution mark is required in the
body, the pack should also say whether the dash and the name count toward the
16-word cap.

**3. Two specimens, one venue.** A measured place or time goes in `venue`; a
number that is prose goes in `body` or `caption`. The title and both specimen
plates share one venue value, so the hall key and the third stair cannot be
labelled "HALL" and "STAIR" on their own plates even though they are different
places in the same house. I used the address and the time as a running label
(`14 ELM ROW, 4:10`) and let the painted object name the room. Is that the
intended use, or should a film with two places expect S2?

## The title plate

**4. A title with no date or venue.** `watercolor_title` lists six slots and
every selected slot must be non-empty. A song/memory film about a person or a
room may have no event date and no venue; there is no shorter title contract, and
a real commission cannot invent one to fill a slot. I gave this film a diegetic
date and venue — the last afternoon, the address — so neither is decorative. Is
that the intended workaround, or should the title allow empty slots?

## The 9:16 page

**5. The leaders are not in the `vertical` maps.** The guide says to re-anchor
leader paths to the 9:16 boxes. Neither `watercolor_specimen` nor
`watercolor_quote` maps its `leader` op, so the 1:1 path is the only stored
geometry. Is the author's re-anchor authoritative, or should each map carry the
leader and its endpoints? I re-anchored: specimen (0.40, 0.50) → (0.28, 0.578);
quote (0.58, 0.52) → (0.46, 0.60). Both specimen subjects are painted to fill the
specimen box, so one path serves both shots.

**6. The subtitle box overlaps the arch box.** At 9:16 the subtitle box ends at
x 0.58 and the arch box begins at x 0.56 — a 0.02 overlap, about 8 px at 390 px
wide. The style forbids text over the subject. Is the arch's painted form inset
inside its box, or should the subtitle be capped at 0.56? I kept the set subtitle
short and left of the arch, but the box itself still overlaps.

**7. Line caps for the title, subtitle and body.** Only the caption (two lines)
and the names (one or two lines) have caps. The title, subtitle and quote have
boxes but no line rule: title 0.46 × 0.22, subtitle 0.5 × 0.12, quote 0.48 × 0.3.
Should the author read the box as the cap, or is there a line rule? I sized the
copy to 2 / 2 / 3 lines.

**8. Label case.** The card sets its labels in uppercase with letterspacing;
`tokens.json` and `STYLE.md` say only "measured labels" and refuse all-caps
paragraphs. Is the uppercase a rule for labels, or the card's own setting? My
date and venue follow the card and are uppercase, and the monogram is initials. If
case is a rule, it belongs in the type tokens.

## In-shot timing

**9. Transition durations and whose seconds they are.** `wipe`, `page_turn` and
`hold` have no duration in the tokens or in any recipe, and the pack does not say
whether a transition occupies the outgoing shot, the incoming shot, or is split.
On a 4.5 s shot a 0.6 s page turn is 13 % of the shot. I put the incoming
transition inside the incoming shot and the outgoing wipe in the outgoing shot's
last 0.3 s, and assumed 0.3 s wipes and 0.6 s page turns. Is there an intended
value?

**10. Paint-in: per shot or per form?** The pack says 1.2 s or 1.8 s "per painted
form", and that the choice covers the title's arch, the quote's object and the
close's unfinished detail. A title shot of 4.667 s holds a horizon wash, an arch,
a seal and six text slots. Is every painted element a separate 1.8 s form, or is
1.8 s the budget for the shot's forms? Is a wash a form? I treated the arch as the
reference form at 1.8 s, the horizon as three quick wash passes, the seal as a
stamp and the type as a write-on after them. It is the tightest decision in the
film.

**11. How does set type appear?** Hand notes are drawn twice over a paper halo
and revealed left to right; captions are hand notes. The pack does not say how
display, body, labels or the monogram appear: painted stroke by stroke, revealed
left to right, or present at frame 1? I write the display and body on left to
right and set the labels and monogram whole, as stamps. If type may not animate,
the title's 4.667 s is mostly arch.

**12. The mist's internals.** `watercolor_mist` lists `mist` (rising edge, z 1)
and `mist-full` (full sheet, z 2) both at opacity 1, with the fibre effect also
at z 2. Read at face value the full pass covers the rising edge from frame 1, and
the fibre's z-tie with the full pass is unresolved: if the full pass sits over
the fibre, the erased sheet is flat white — a paper-is-the-white failure. The pack
also does not say where the wavy edge sits at 9:16 (its points are 1:1 fractions
around y 0.5) or how long the erase takes inside a 4.5 s shot. I scheduled the
edge to rise 0–3.8 s from mid-height, the full pass 3.8–4.1 s, the fibre last, then
0.4 s of paper before the exit, so the shot is the erase in progress rather than a
held blank. Should the recipe carry that schedule and an explicit fibre order?

**13. A plate after the mist.** The guide says to put the mist after a quote and
that it ends on full paper. It does not say whether a painted plate may follow
the mist or whether the mist is only a bridge into the close. My route paints the
second specimen on the fresh sheet — the erase is what makes the new page.
Allowed, or should the mist always fall immediately before the close?

## Sound

**14. The stamp thump at the title.** "One quiet stamp thump is allowed at the
close." The title carries the same seal, so the accent's first appearance is
silent. Is the thump reserved for the close as written, or may each appearance of
the stamp carry one? I kept the title silent.

## Provenance

**15. What pins the per-shot subject?** The pack says assets are types, the
treatment names the subject, and per-shot subjects are S2; the treatment is
explicitly not a sealed input. Nothing in the brief, format, recipe or seed says
"key" rather than "latch", so a re-render with the same brief, style and seed
could paint a different object. Is the treatment plus the lead's record the
intended pin for S1a, or should the subject become a sealed field? I named the
subjects in `treatment.md` and ask the lead to record them.
