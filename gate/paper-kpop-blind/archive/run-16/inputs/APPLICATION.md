# Applying the Paper K-pop style pack

You have a sealed copy of one Paper Studio style pack. This guide gives you the two JSON shapes and the treatment template. It does not tell you what the style looks like; the pack does.

## What you may read

- `inputs/pack/` — `STYLE.md`, `tokens.json`, `capabilities.json`, `recipes/*.json`, `card.html`, `BRIEF.md`, `SOURCES.md`, `references/frames/`.
- `inputs/APPLICATION.md` — this guide.
- `inputs/prompt.md` — the commission.

Do not read the Paper Studio repository, the source film, `docs/`, `sources/` or any other style. Do not edit `inputs/pack/`.

## Write your answer in `work/`

Write exactly four files:

- `brief.json`
- `format.json`
- `questions.md`
- `treatment.md`

The lead runs the resolver. You do not run repo commands.

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

All fields are optional in the schema, but every slot listed in a selected recipe must be non-empty. Read `inputs/pack/recipes/*.json` and check each recipe's `slots` array.

The word limit is the smaller of `capabilities.limits.maxWords` and `tokens.layout.maxWords`. Every `content.*` slot in a selected recipe must be within it. This pack allows 30 and 45 seconds and 16:9 and 9:16.

## Format JSON

```json
{
  "id": "lower-case-id",
  "name": "Human name",
  "beatRoleMap": {
    "opening": "open",
    "title": "title",
    "portrait": "portrait",
    "formation": "list",
    "quote": "quote",
    "closing": "close"
  },
  "sequence": [
    { "beat": "opening", "role": "open", "count": 1 },
    { "beat": "title", "role": "title", "count": 1 },
    { "beat": "portrait", "role": "portrait", "count": 1 },
    { "beat": "formation", "role": "list", "count": 1 },
    { "beat": "quote", "role": "quote", "count": 1 },
    { "beat": "closing", "role": "close", "count": 1 }
  ],
  "durations": [30],
  "aspects": ["9:16"],
  "primaryAspect": "9:16",
  "loudness": "-14 LUFS"
}
```

`loudness` is optional passthrough metadata. The style's delivery loudness belongs to the format; the resolver ignores it.

- `beatRoleMap` keys are your beat names. Values must be one of the closed beat roles: `open`, `title`, `portrait`, `detail`, `list`, `quote`, `transition`, `close`.
- `sequence` is optional. If you use it, each entry's role must be a beat role, and the recipe chosen for that role must have every one of its slots filled.
- `durations` must overlap `capabilities.limits.durations`; `aspects` must overlap `capabilities.limits.aspects`; `primaryAspect` must be one of `aspects`.
- The resolver takes the smallest common duration. Every shot starts at its recipe `duration.min`; the remainder is shared in proportion to each recipe's remaining capacity, in whole milliseconds. It is not an equal split. Read the plan output for the actual seconds.

Fit check before you write:

```text
sum(recipe.duration.min for each shot) <= target duration <= sum(recipe.duration.max for each shot)
```

The resolver works in whole milliseconds: every shot starts at its minimum, the remainder is shared in proportion to remaining capacity and floored, and any leftover milliseconds go to the largest fractional remainders, ties to the earlier shot.

## One value per slot

A repeated recipe reuses its composition and slot values. Per-shot content is S2. The pack reads only the slots listed in the selected recipes.

## 9:16 is a re-stage

The pack recomposes for 9:16 rather than cropping the 16:9 stage. Each recipe has a `vertical` array mapping its op ids to `tokens.layout.aspectBoxes.9:16`. Use that map. Keep the hero inside the central 60 percent, stack type, and re-stage the cast. The 16:9 stage is not the same frame with the sides removed.

## The open choice

`capabilities.governance.choices` contains one undecided taste choice, `paper-shadow`. Do not answer it for the director. You may design with both options possible; write the question under `## Questions` if it affects your treatment.

## Treatment template

Write `treatment.md` with exactly these sections:

```markdown
# Treatment — <your film>

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... |
| 4 | ... | ... | ... | ... |
| 5 | ... | ... | ... | ... |
| 6 | ... | ... | ... | ... |

## Grammar check

- **Cut-paper edge:** <where the film shows it>
- **Cream type edge and hard ink shadow:** <where>
- **Torn fibre or sticker:** <where>
- **Halftone:** <where>
- **Two-cast rig:** <where>
- **Beat cut or beat-locked move:** <where>
- **9:16 re-stage:** <where>

## Questions

- <every question the pack did not answer>
```

## Rules

- All names, dates, places and stories are fictional. No real people or real artists.
- No third-party lyrics, song titles, music, voice or images.
- No source-film character names, title, lyrics or scenes.
- No new recipes and no edits to `inputs/pack/`.
- Do not run repo commands. Write the four files and stop.
