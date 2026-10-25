# Spec 0001 — Wedding v0

**Status:** in progress · week 1
**Owner:** both
**Depends on:** none

## User story

As a couple, I want to send my names, dates, venue and text, so that I can see a plan for a 30-second invitation film before anything is rendered.

## Inputs

`fixtures/wedding-min/brief.json`, validated by `WeddingBriefSchema`.

## Output

A `RenderPlan` printed to stdout:

```json
{
  "projectId": "demo-wedding-001",
  "style": "paper-vows",
  "styleVersion": "0.1.0",
  "seed": "demo-001",
  "aspect": "9:16",
  "fps": 30,
  "duration": 30,
  "frames": 900,
  "shots": [
    {
      "id": "s01",
      "recipe": "invitation_unfold",
      "start": 0,
      "duration": 4,
      "slots": { "couple.namesLine": "Ananya & Rohan" },
      "transitionOut": "cut"
    }
  ],
  "warnings": []
}
```

## Acceptance criteria

- [ ] Schema rejects a brief with a missing name, an invalid duration, or an unsupported palette.
- [ ] Planner selects a coherent sequence for 30, 45 and 60 seconds.
- [ ] Planner substitutes a text shot when no photos are supplied, and warns.
- [ ] Every slot required by a recipe is present in the plan.
- [ ] Shot durations sum exactly to the requested duration.
- [ ] Two runs produce byte-identical output.
- [ ] No recipe id, palette or font is hardcoded in engine code.
- [ ] `npm run typecheck` passes.

## Edge cases

| Case | Expected |
|---|---|
| No photos | substitute `blessing_text`, warn |
| No blessing text | fall back to quote, then invite line, warn |
| Two events on the same day | primary event is the ceremony |
| Hindi locale | English date formatting for now, warn |
| Unknown palette | throw with the supported list |
| Unknown motif | throw with the supported list |
| Duration 45 | valid, durations scaled |
| Duration 31 | validation error |

## Out of scope

- rendering
- photo processing
- audio
- the web app
- multiple styles

## Tasks

- [x] Brief schema
- [x] Fixture brief
- [x] Paper Vows tokens and capabilities
- [x] 7 recipes
- [x] Planner
- [x] CLI
- [ ] Golden test
- [ ] Renderer handoff spec
