# 0001 — Two doors, one engine

**Status:** accepted · 2026-10-25

## Context

Wedding buyers and creators want different products.

A couple does not want a studio. They want a form, a review link, and a finished film. They will not learn a tool. They will not bring an LLM key.

A creator does want a studio. They will learn the tool, bring their own LLM, and make videos weekly.

Trying to serve both with one interface would produce a product that is too complex for couples and too shallow for creators.

## Decision

Build one engine with two front doors.

- **Door A — Paper Vows:** service. We operate the engine, charge per film.
- **Door B — Paper Studio:** self-serve. The creator operates the engine, pays a subscription.

Both doors share: brief schema, planner, renderer, review room, asset registry, export pipeline.

## Consequences

- The engine must be usable headlessly (Door A) and interactively (Door B). That argues for a CLI-first core and a thin UI.
- Two pricing models, two support models, two onboarding flows.
- Door A generates revenue before Door B is built.
- Every feature must be evaluated twice: does it help production, and does it help self-serve?

## Rejected alternative

One product for both. Rejected because the intake and review needs are genuinely different, and a compromise would make the first paid film slower to deliver.
