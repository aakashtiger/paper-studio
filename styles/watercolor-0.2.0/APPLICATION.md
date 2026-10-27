# Applying this pack

This is the operator handoff. It gives the brief and format schemas, the
resolver fit math and the treatment template. It does not tell you what the
style looks like; `STYLE.md`, `tokens.json`, `capabilities.json` and `card.html`
do that.

## What you may read

- `STYLE.md` — the human contract, refusals and open choice.
- `tokens.json` — palette, type, layout, motion, sound and seed.
- `capabilities.json` — limits, assets, proof and governance.
- `recipes/*.json` — six recipes, their slots, durations and vertical maps.
- `card.html` — the visual index.
- `APPLICATION.md` — this page.

Do not edit the pack. Do not read another style pack, the source film or the
repository when this pack is used as a blind input.

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

All fields are optional in the schema. Every slot listed in a selected recipe
must be non-empty. Read `recipes/*.json` and check the `slots` array. The word
limit is the smaller of `capabilities.limits.maxWords` and
`tokens.layout.maxWords`; every `content.*` slot in a selected recipe must be
within it. This pack reads `title`, `subtitle`, `names`, `date`, `venue`,
`body`, `caption` and `monogram`. It does not read `hashtag`, `rsvp` or
`photos.*`.

## Format JSON

```json
{
  "id": "lower-case-id",
  "name": "Human name",
  "beatRoleMap": {
    "opening": "title",
    "plate": "detail",
    "line": "quote",
    "breath": "transition",
    "closing": "close"
  },
  "sequence": [
    { "beat": "opening", "role": "title", "count": 1 },
    { "beat": "plate", "role": "detail", "count": 1 },
    { "beat": "line", "role": "quote", "count": 1 },
    { "beat": "breath", "role": "transition", "count": 1 },
    { "beat": "closing", "role": "close", "count": 1 }
  ],
  "durations": [30],
  "aspects": ["9:16"],
  "primaryAspect": "9:16",
  "loudness": "-16 LUFS"
}
```

`beatRoleMap` values are the closed roles `open`, `title`, `portrait`, `detail`,
`list`, `quote`, `transition` and `close`. `sequence` is optional; each entry's
role must be a beat role, and the recipe chosen for that role must have every
slot filled. `durations` must overlap `capabilities.limits.durations`;
`aspects` must overlap `capabilities.limits.aspects`; `primaryAspect` must be
one of `aspects`. `loudness` is passthrough metadata; the resolver ignores it.

## Resolver fit math

The resolver takes the smallest common duration. Every shot starts at its
recipe `duration.min`. The remainder is shared in proportion to each recipe's
remaining capacity (`max - min`), in whole milliseconds; leftover milliseconds
go to the largest fractional remainders, ties to the earlier shot. It is not an
equal split.

```text
sum(recipe.duration.min for each shot) <= target duration
target duration <= sum(recipe.duration.max for each shot)
```

A repeated recipe reuses its composition and slot values. One value per slot;
per-shot content is S2. `sequence[].count` repeats a shot; two entries can map
two beats to the same recipe.

## 9:16

At 9:16 the pack recomposes; it does not crop. Each recipe's `vertical` array
maps its op ids to `tokens.layout.aspectBoxes.9:16`, and the 9:16 type sizes are
in `tokens.layout.aspectScale.9:16`. Use those boxes and sizes. The scale is
authored for a 390 px-wide page; larger frames scale proportionally and the
14 px floor holds. The 30 s vertical page uses the page contracts `title`,
`specimen`, `quote`, `mist` and `close`; `watercolor_walk` is the 16:9 scroll's
move and its 12 s minimum cannot fit a 30 s six-shot page.

Palette and sound are not fields in these two schemas; name them in
`treatment.md`. One value per slot; per-shot notes are S2.

## The open choice

`capabilities.governance.choices` contains one undecided taste choice,
`paint-in-speed`: 1.2 s or 1.8 s. Do not answer it for the director. The card
shows both speeds; write the question under `## Questions` if it affects the
treatment.

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

The six invariants are the creative critic's check. If the pack does not let you
show one, say so under `## Questions`.

## Rules

- All names, dates, places and stories are fictional. No real people.
- No third-party lyrics, song titles, music, voice or images.
- No source-film title, character, scene or audio.
- Do not edit the pack. A pack change invalidates a blind run.
- Do not run repo commands. Write the four files and stop.
