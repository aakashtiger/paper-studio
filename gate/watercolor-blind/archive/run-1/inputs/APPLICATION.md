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
- The resolver takes the **smallest common duration** and allocates it across the
  selected recipes. Every shot must stay inside its recipe's `duration.min` and
  `duration.max`.

Fit check before you write:

```text
sum(recipe.duration.min for each shot) <= target duration <= sum(recipe.duration.max for each shot)
```

If the target is too short, use fewer shots or shorter recipes. If it is too long,
use more shots or longer recipes. Read the actual numbers from
`inputs/pack/recipes/*.json`.

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
