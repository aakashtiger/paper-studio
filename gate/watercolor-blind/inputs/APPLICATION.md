# Applying a style pack

You have a sealed copy of one Paper Studio style pack. This guide gives you the
two JSON shapes you need and the treatment template. It does not tell you what the
style looks like; the pack does that.

## What you may read

- `inputs/pack/` — the whole style pack: `STYLE.md`, `tokens.json`,
  `capabilities.json`, `recipes/*.json`, `card.html`, `BRIEF.md`.
- `inputs/APPLICATION.md` — this guide.
- `inputs/prompt.md` — the commission.

Do not read the Paper Studio repository, the Lemo source library, `docs/`, or any
other style. Do not edit `inputs/pack/`.

## Write your answer in `work/`

The folder around `inputs/` also contains `work/`. Write exactly four files there:

- `brief.json`
- `format.json`
- `questions.md`
- `treatment.md`

The lead runs the resolver; you do not run repo commands.

## Brief JSON

```json
{
  "content": {
    "title": "string",
    "subtitle": "string",
    "names": "string",
    "date": "string",
    "venue": "string",
    "body": "string",
    "caption": "string",
    "hashtag": "string",
    "rsvp": "string",
    "monogram": "string"
  },
  "photos": {
    "hero": "string",
    "supporting": ["string"]
  }
}
```

All fields are optional in the schema, but **every slot listed in a selected
recipe must be non-empty**. Read `inputs/pack/recipes/*.json` and check each
recipe's `slots` array. If a recipe you want uses `content.caption`, your brief
must have a caption. If it uses `photos.hero`, your brief must have a hero photo.

The style's `capabilities.limits` gives the allowed durations and aspects. The
word limit is the smaller of `capabilities.limits.maxWords` and
`tokens.layout.maxWords`; every `content.*` slot in a selected recipe must be
within it.

## Format JSON

```json
{
  "id": "lower-case-id",
  "name": "Human name",
  "beatRoleMap": {
    "opening": "title",
    "plate": "detail",
    "breath": "transition",
    "closing": "close"
  },
  "sequence": [
    { "beat": "opening", "role": "title", "count": 1 },
    { "beat": "plate", "role": "detail", "count": 1 },
    { "beat": "breath", "role": "transition", "count": 1 },
    { "beat": "closing", "role": "close", "count": 1 }
  ],
  "durations": [30],
  "aspects": ["9:16"],
  "primaryAspect": "9:16"
}
```

- `beatRoleMap` keys are your beat names; values must be one of the closed beat
  roles: `open`, `title`, `portrait`, `detail`, `list`, `quote`, `transition`,
  `close`. Every key in `beatRoleMap` must be covered by at least one recipe's
  `beatRoles`.
- `sequence` is optional. If you use it, each entry's `role` must be a beat role,
  and the recipe chosen for that role must have every one of its slots filled.
- `durations` must overlap `capabilities.limits.durations`; `aspects` must overlap
  `capabilities.limits.aspects`; `primaryAspect` must be one of `aspects`.
- The resolver takes the **smallest common duration**. Every selected shot starts
  at its recipe `duration.min`. The remaining target is shared in proportion to
  each recipe's remaining capacity (`max - min`), in whole milliseconds; ties go to
  the earlier shot. This is **not** an equal split. Read the plan output for the
  actual seconds; do not assume every shot is 5.0 s.

Fit check before you write:

```text
sum(recipe.duration.min for each shot) <= target duration <= sum(recipe.duration.max for each shot)
```

If the target is too short, use fewer shots or shorter recipes. If it is too long,
use more shots or longer recipes. Read the actual numbers from
`inputs/pack/recipes/*.json`.

## Page contracts and the walk

The 16:9 scroll uses `watercolor_walk`. The 30 s 9:16 page uses the page
contracts: `title`, `specimen`, `quote`, `mist`, `close`. It may repeat a page
contract. The walk's 12 s minimum cannot fit a 30 s six-shot page, and the page is
a locked sheet, not a handscroll. `open` and `list` have no recipe in this pack.

A beat role may appear more than once in `sequence`; each occurrence is a separate
shot and gets its own allocation, using the same recipe and slot values. One value
per slot: a repeated caption or venue is a running note or label, not a different
note. Per-shot notes are S2.

## Director choices and subjects

The two schemas do not carry director choices (paint-in speed, palette, sound
plan, seed) or per-shot subject names. Write those in `treatment.md`; the lead
records them. The pack's open paint-in choice remains open for the director.

The subject of a plate lives in `content.title`, `content.body` or
`content.caption`; the treatment can name what is painted. Do not add fields to
the two schemas.

## The 9:16 page

At 9:16, the pack recomposes rather than crops: display 44 px, body 24 px, caption
24 px, label 14 px, monogram 18 px; keep the title in the left column and the arch
on the right. The boxes are in `tokens.layout.aspectBoxes.9:16`. Each recipe's
`vertical` array maps its op ids to those boxes (for example `["note",
"specimenNote"]`); use it instead of stretching the 1:1 boxes, and re-anchor leader
paths to the 9:16 boxes. The scale is authored for a 390 px-wide page; larger
frames scale proportionally, and the 14 px floor stays. The page contracts are
`title`, `specimen`, `quote`, `mist`, `close`.

The accent recurs, not every frame; the mist may have none. Music is out from the
mist through the close; one quiet stamp thump is allowed at the close. The silence
is structural, not a fixed percentage of the film.

## Remaining S1a limits and conventions

- **Labels.** The only label slots are `content.date` and `content.venue`. A
  measured place or time goes in `venue` (for example `KITCHEN, 11:40`); a number
  that is prose goes in `body` or `caption`. There is no separate measured-value
  slot in S1a.
- **Unused fields.** The brief fields are optional. The pack reads only the slots
  listed in the selected recipes; `hashtag`, `rsvp` and `photos.*` are not read by
  any recipe. `names` is read by the title recipe.
- **Safe zones.** The bottom safe zone is a maximum for text, not a required
  position. A note can sit higher on the page as long as it does not cover the
  subject.
- **One value per slot.** A repeated caption or venue is a running note or label,
  not a different note. The close may share the caption as a refrain; a quote's
  attribution goes in the caption or the body. Per-shot notes are S2.
- **Caption length.** Sixteen words maximum and two lines maximum. At 9:16, the
  specimen note sits below the specimen, 0.6 of the page wide. The two-line limit
  binds before the word cap; expect about 24–30 characters per line. Shorten the
  caption to fit two lines. Measured labels are short and one line.
- **Mist.** The mist erases the shot before it; it has no slot because its source
  is whatever precedes it. It composites over the outgoing shot; it is not a fresh
  world.
- **Seed.** The seed is an integer chosen by the lead; it is not a field in the
  brief or format.
- **Rounding.** Each shot starts at its minimum. The remainder is shared by
  remaining capacity, floored to whole milliseconds; the leftover milliseconds go
  to the largest fractional remainders, ties to the earlier shot. This is the
  resolver's rule; do not use a different rounding.
- **Repeated recipe.** A repeated page contract reuses its composition and slot
  values. Per-shot subjects live only in the treatment; per-instance subjects are
  S2.
- **Vertical maps.** Each recipe's `vertical` array maps its op ids to the 9:16
  boxes, including washes that move. A full-width wash such as the title's horizon
  can stay. The mist has no `vertical` array because it is a full-frame wipe.
- **Margins.** The seal may sit in the top or right margin as a stamp; text stays
  inside the 9 / 8 / 11 / 8 percent margins. The label boxes end at 0.89.
- **Title note.** The title is a title plate, not a specimen; it may carry no hand
  note. Its names use body; its date and venue use labels.
- **Bristles.** The 6 px threshold is at the 390 px authoring width. Scale the
  widths and the threshold together. `tokens.medium.strokeWidths` gives the names:
  `wide` is 8 px and carries bristles; `standard` is 4 px and does not. No recipe
  carries a stroke-width op: the width is a property of the painted asset, and the
  renderer reads `strokeWidths`.
- **Names.** `content.names` uses the body role, not the label role. It is one or
  two short lines (about 18–24 characters per line at 9:16): the people the film is
  for, or the subject/songwriter in a non-wedding film.
- **9:16 captions.** The two-line limit binds before the 16-word cap. The word cap is
  a ceiling; shorten the caption to fit two lines in the narrow `specimenNote` box.
- **Repeat syntax.** `sequence[].count` repeats a shot with the same recipe and
  slots; two sequence entries can map two different beats to the same recipe. Both
  are legal; use `count` when the repeats are identical, two entries when they are
  not.
- **Mist placement.** Put the mist after a quote. After a specimen, the specimen's
  `page_turn` has already made a new sheet; a mist there would erase a blank page.
- **Mist end state.** The mist has no paper base; it composites over the outgoing
  shot. `mist-full` is the final full-paper pass; the renderer reveals it over the
  shot. The wavy `mist` shape is the rising edge. The shot is the erase in progress,
  not an already-erased hold.
- **Paper gap.** The close's `paper-gap` is the sheet showing through, not an
  opaque pigment fill. A paper-coloured shape or a stopped wash is allowed.
- **Seal.** The same seal may move and must stay the same size: 0.1 × 0.1 at 1:1 and
  0.1 × 0.056 at 9:16. It is one recurring mark, not a fixed position.
- **Labels.** `content.date` and `content.venue` are one value each; the title and
  close share the date. If a film needs two dates, that is a per-shot slot change
  for S2.
- **Quote attribution.** The quote has no attribution slot; put it in `body` or
  `caption`. A caption used as a running note is not an attribution.
- **Treatment.** `treatment.md` is the author's output, not a sealed input. It is
  evidence for the creative critic.
- **Card palette.** The card's `evening-blue` row is a record of the blind film's
  palette, not a recommendation for every film.
- **Assets are types, not subjects.** One `prop.painted-specimen` can carry a
  latch, a stair or a key; name the subject in the treatment. Do not add an asset
  per film.
- **Accent.** "Recurs" means at least twice across the film, not every frame; the
  mist may carry none.
- **Mist source.** The mist erases the shot before it; it has no slot because its
  source is whatever precedes it.
- **Paint-in.** The 1.2 s / 1.8 s choice applies to any painted form; a specimen is
  the reference. It covers the title's arch, the quote's object and the close's
  unfinished detail. The mist is a wipe, not a paint-in.
- **Accent.** The same seal at the title and the close is one recurring accent with
  two appearances; it does not become a new mark each time.
- **Wipes.** The quote's outgoing wipe and the mist's wipe are one erase: the quote
  leaves on a brush edge and the mist continues it. Do not put a page turn between
  them.
- **Song/memory.** A wordless felt-piano motif is enough; the style never requires a
  sung vocal or a lyric.
- **Counts.** `sequence[].count` repeats a shot; each repeat is a separate shot and
  gets its own allocation.
- **Loudness.** A format may carry a `loudness` field as passthrough metadata; the
  resolver ignores it, and delivery loudness is not a style rule.
- **Body text.** `content.body` is type; a voice reading it is a film/format
  decision, not a style rule.
- **Mist after a specimen.** A specimen exits with `page_turn`. If you place the
  mist after a specimen, the turn has already given you a new sheet; either place
  the mist after a quote or treat the turn as the page break before the erase.
- **BPM.** The 48 BPM grid is a breath reference, not a beat lock. Shot lengths do
  not have to land on a beat.
- **Unfinished close.** The last wash pass stops before the form's edge, leaving
  one paper-coloured gap. It is not a sketch, a fade or a blank.

## Treatment template

Write `treatment.md` with exactly these sections:

```markdown
# Treatment — <your film>

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... |
| 4 | ... | ... | ... | ... |
| 5 | ... | ... | ... | ... |
| 6 | ... | ... | ... | ... |

## Invariants

- **Paper is the white:** <where the film shows it>
- **Flying white:** <where the film shows it>
- **Pooled edge:** <where the film shows it>
- **Painting-in:** <where the film shows it>
- **Annotation leader:** <where the film shows it>
- **No vector outline:** <where the film shows it>

## Questions

- <every question the pack did not answer>
```

The six invariants are the check the creative critic will use. If the pack does
not give you enough to answer one, write that under `## Questions`; that is a
pack defect, not a failure by you.

## Rules

- All names, dates, places and stories are fictional. No real people.
- No third-party lyrics, song titles, music, voice or images.
- Do not edit `inputs/pack/`. The input manifest and the live pack hash are
  checked after you finish.
- Do not run repo commands. Write the four files and stop.
