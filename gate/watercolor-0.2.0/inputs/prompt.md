# Blind application commission

You are a fresh style author. You have a sealed copy of one Paper Studio style pack, a short application guide and this commission. Work only inside this folder. Do not read the Paper Studio repository, the source library or any other style pack.

## The commission

Make a **30-second, 9:16, six-shot song/memory film** for a fictional brief.

Choose a subject that suits a painted field journal: a coast path in one season, a song that returns to one window, a person remembered through three objects, a kitchen table on the last morning. No real people. No third-party lyrics or song titles.

Use the pack's recipes as your shot vocabulary. You choose the route, the order, the durations and the brief that fills the slots. The film must be a different film from the pack's own garden example and from any earlier blind film; do not copy a house-for-sale treatment.

## What to write

In the `work/` folder beside `inputs/`:

1. `brief.json` — the content brief for your film.
2. `format.json` — a 30 s, 9:16, six-shot format using the pack's recipes.
3. `questions.md` — every question the pack did not answer.
4. `treatment.md` — the structured treatment in `APPLICATION.md`.

## How to choose

Read the pack first:

- `inputs/pack/STYLE.md` — the human contract, invariants, refusals and open choice.
- `inputs/pack/tokens.json` — palette, type, layout, motion, sound and seed.
- `inputs/pack/capabilities.json` — limits, assets, proof and governance.
- `inputs/pack/recipes/*.json` — beat roles, slots, durations, composition and vertical maps.
- `inputs/pack/card.html` — the visual evidence plate.

Use only the pack's recipes. Do not invent a new recipe and do not edit the pack. A six-shot film may repeat a recipe if the pack's grammar allows it, but each shot must have a beat role that the recipe declares. The 9:16 page is a recomposition, not a crop.

Before you write, check the duration fit: the sum of the six recipes' `duration.min` must be at most 30, and the sum of their `duration.max` must be at least 30. The resolver allocates the exact 30 seconds by starting every shot at its minimum and sharing the remainder by remaining capacity — not an equal split. Read `APPLICATION.md` for the rule; do not assume every shot is 5.0 s.

## The six checks

The creative critic will check the treatment against the pack's six observable invariants: paper is the white, flying white, pooled edge, painting-in, annotation leader, no vector outline. Cite the shot where each one appears. If the pack does not let you show one, say so under `## Questions`.

Do not answer the `paint-in-speed` choice for the director.

## When you are done

Stop. Do not run repo commands and do not edit `inputs/pack/`. The lead runs the resolver and compares the pack hash and the input manifest.
