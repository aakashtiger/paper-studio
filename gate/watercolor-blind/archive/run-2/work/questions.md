# Questions the pack did not answer

Thirteen. Each one is a place where the pack states a rule, or promises one, and
then leaves the author to guess. They are ordered by how much they change a film.

---

## 1. A measured label has no slot

**What the pack establishes.** STYLE.md, "One note": a view carries one hand note
with a leader line "and, where a value matters, a measured label". Capabilities
lists the native move "palette as data", and the type mapping gives IBM Plex Mono
to "measured labels such as a date or a place".

**What it does not say.** The only label slots in any page contract are
`content.date` and `content.venue`, and both are already the date and the place.
There is no `content.measure`.

**Why it matters here.** A house before it is sold is exactly the subject that
wants numbers — a sill at 94 cm, a tread worn 9 mm, twelve paces to the kitchen.
The brief cannot carry one, so the painting cannot annotate one.

**What I did instead.** Kept `venue` as the place and let the rain-blue rigger
tick mark the worn hollow with no number beside it. It reads as a measurement
without being one; a viewer never learns the value.

---

## 2. One caption, three contracts

**What the pack establishes.** `content.caption` is a slot in `watercolor_specimen`,
`watercolor_quote` and `watercolor_close`. APPLICATION.md: "One value per slot: a
repeated caption or venue is a running note or label, not a different note."

**What it does not say.** The specimen's caption is a hand note on a leader, the
quote's is a hand note on a leader, and the close's is "a closing line" — STYLE.md
uses that phrase for a different job. Nothing says whether the close may set the
same words larger, without a leader, or whether it must match the note exactly.

**Why it matters here.** Only `watercolor_title` and `watercolor_mist` avoid
`content.caption`, so any six-shot page renders the same sentence at least three
times; in this route it lands on four plates. The pack calls that "a running
note", but four is a refrain, and a refrain is a decision the pack does not
discuss. The film either has one tune or it has one idea repeated.

**What I did instead.** Chose a sentence that is literally true in both plates and
at the close ("the light still arrives at four"), and assumed the close sets it
once, without a leader. I made the repetition explicit rather than hiding it, and
let the mist be the one silence in the round.

---

## 3. The 9:16 title box runs under the arch

**What the pack establishes.** Run 1 moved the arch to the right of the title
plate; `watercolor_title` places it at x 0.60–0.94, y 0.16–0.64. Run 2's vertical
rule says "widen the title box to the margin" (STYLE.md, Type & lettering).

**What it does not say.** At 9:16 a margin-wide title box is x 0.08–0.92 — the
arch's columns. Does the arch move, shrink, drop below the title, or does the box
stop short of it? The two fixes contradict each other on one plate.

**Why it matters here.** The title is the first frame and the branch is the only
living thing in it.

**What I did instead.** Widened the box to the left margin only and kept the
branch on the right at the recipe's fractions. If the 9:16 proof frame shows the
branch crowding the title, the box should stop at x 0.58.

---

## 4. There is no 9:16 geometry, only part of a type scale

**What the pack establishes.** `tokens.layout.aspectScale["9:16"]` gives display,
body, caption and label. STYLE.md says "recompose rather than crop".

**What it does not say.** Every box in every recipe is a 1:1 fraction
(`x`, `y`, `w`, `h`). No file gives 9:16 coordinates, safe areas or a title height
for the vertical page, and the monogram has no 9:16 size at all (1:1 gives 20 px).
"Recompose" is an instruction without a map.

**Why it matters here.** Six shots, all 9:16. I can describe intent, but two
authors reading the same fractions will place the window and the chair differently.

**What I did instead.** Reused the 1:1 fractions and judged the portrait by eye,
keeping the nine / eight / eleven percent margins and the central subject-safe
area. Kept the monogram at 20 px. A 9:16 map per contract would remove the guess.

---

## 5. Which frame width are 44 / 24 / 24 / 14 measured at?

**What the pack establishes.** "Fourteen pixels minimum at 390 px width" and, for
9:16, "display 44 px, body 24 px, caption 24 px, label 14 px".

**What it does not say.** The frame those 9:16 numbers belong to. Read at 390 px,
the label sits exactly on the floor — coherent. Read at a 1080 px export, the same
label is about 5 px on a 390 px phone, below the floor the same paragraph promises.
The card draws a 390 px phone, which hints at the first reading, but no file states
it.

**Why it matters here.** The label carries the date and the place on four of six
shots. If the reading is wrong, the smallest type is unreadable on the only screen
this format is for.

**What I did instead.** Treated 44 / 24 / 24 / 14 as the 390 px phone frame, so
the label is at the floor and may not shrink.

---

## 6. Wedding-shaped brief fields with no slot

**What the pack establishes.** The brief schema in APPLICATION.md carries `names`,
`hashtag`, `rsvp` and `photos.hero` / `photos.supporting`. The style refuses
photographs, and `capabilities.limits.maxCast` is 0.

**What it does not say.** Whether an unused field should be omitted, sent empty,
or kept so a validator sees the full shape.

**Why it matters here.** This film has no cast, no RSVP and no photograph. The
only honest values are none.

**What I did instead.** Omitted `names`, `hashtag` and `rsvp`; sent `photos` with
an empty hero and an empty supporting list, so the object exists and nothing is
invented. If the resolver expects every key, empty strings are the safe addition;
if it dislikes empty strings, omission is. The pack does not say which.

---

## 7. The mist follows a page turn into a blank sheet

**What the pack establishes.** `watercolor_specimen` exits with `page_turn`. The
1:1 page order is "a specimen, a note, a second plate, a mist, a close", so the
mist follows a plate whose exit is a turn. `watercolor_mist` declares a
paper-coloured band and a rising edge, and one camera move.

**What it does not say.** What the mist has left to erase if the turn has already
revealed a new, blank page — and whether the band animates at all.

**Why it matters here.** Shot 5 is the film's breath. A mist that erases nothing
is a card with a camera move.

**What I did instead.** Wrote a reverse-side ghost: the new page carries a pale
impression of the stair, as a real watercolour page does, and the mist takes that.
The band's edge bleeds upward through the shot; the camera only pulls back. If the
pack wants a blank sheet, the mist should follow a wipe instead, or the turn should
be a half-turn that falls back.

---

## 8. The 48 BPM grid and the allocation rule disagree

**What the pack establishes.** A 48 BPM breath grid (`offset` 0, `bar` 4): a
1.25 s beat, a 5 s bar. And an allocation rule: every shot at its minimum, the
remainder shared by capacity, in whole milliseconds.

**What it does not say.** Which one wins when they disagree. This route lands
4.667 / 5.833 / 5.833 / 4.667 / 4.5 / 4.5 s; the bars fall at 5, 10, 15, 20 and
25 s, so five of six boundaries sit between beats. No quantise step is described.

**Why it matters here.** Every wipe, page turn and paint-in in this film is placed
against that pulse.

**What I did instead.** Applied the grid inside each shot — paint-in on a beat,
note two beats later, exit from the last half-beat — and let the boundaries fall
where the resolver puts them. If the boundaries must sit on the bar, the resolver
needs a rounding rule the pack does not have.

---

## 9. "An unfinished detail" has no rule

**What the pack establishes.** The close is "an unfinished detail, a small stamp
and a hold; the page is left open" (STYLE.md, authoring log).

**What it does not say.** How unfinished. After the wash, mid-stroke, or at a
stated fraction of the paint-in? Any answer is defensible; only one is reproducible.

**Why it matters here.** The last frame is the argument of the film. Two authors
will leave two different amounts of paper.

**What I did instead.** Stopped the latch after its plate, before the screw, at
about 1.4 s of a 1.8 s pass. A number in the pack (say 60–80 percent) would make
two blind runs match.

---

## 10. Does the quote's object paint in?

**What the pack establishes.** The open choice is "1.2 s or 1.8 s per specimen".
`watercolor_quote` paints `prop.painted-specimen` but is not the specimen contract,
and its camera is static.

**What it does not say.** Whether that object paints in at all, and if so at which
speed — or whether the film's single answer to the choice covers every painted
form.

**Why it matters here.** Shot 3 is the only static shot with a painted object. If
it opens on a finished chair, the film's main motion stops for four seconds in
the middle of it.

**What I did instead.** Painted the chair in over 1.2 s, and recorded the film's
answer to the open choice as 1.8 s for specimens only.

---

## 11. Is a quote spoken?

**What the pack establishes.** "Voice is optional, warm and unhurried, one line per
idea." The quote contract holds `content.body`, a readable line.

**What it does not say.** Whether that line is set in type only or is the one line
the voice reads. Nothing marks a slot as voiced.

**Why it matters here.** Eight words of voice on the film's only static plate
would be the only words heard in a film whose words otherwise stay on the paper.

**What I did instead.** Type only, no voice, no cleared audio. If the quote is
meant to be heard, the treatment changes in one place.

---

## 12. Silence is 30 percent of a 30 s film

**What the pack establishes.** "Music out from the mist through the close; one
quiet stamp thump is allowed at the close."

**What it does not say.** Whether the share of silence is meant to hold at 30 s.
Here it is 9.0 s of 30; on the 45 s shapes the same rule is 20 percent.

**Why it matters here.** Nine seconds of room tone is a third of the film. It is
the right ending, and it is a lot.

**What I did instead.** Kept the rule exactly — music out at 21.000 s, one thump
on the stamp — rather than shorten the mist to protect the music.

---

## 13. The accent sits inside the wash's hue

**What the pack establishes.** `evening-blue`: wash `#8fa3b0`, accent `#3f7fa8`.
"One accent ... a single vermilion or rain-blue mark recurs; it is not a decorative
second palette."

**What it does not say.** Whether an accent in the same hue family as the wash is
intended. In `garden-day` the vermilion is unmistakable against sage; in
`evening-blue` the accent is separated by value and saturation only, which is the
opposite of what "one accent" usually means.

**Why it matters here.** I chose evening-blue for the October light, and the seal
is the accent. At twelve percent of the frame's width it must not read as a second
wash.

**What I did instead.** Used the accent three times only, at full strength and
always as a hard-edged stamp or a rigger tick, so value and shape do the work the
hue cannot.
