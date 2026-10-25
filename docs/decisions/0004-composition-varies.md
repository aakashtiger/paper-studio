# 0004 — Composition varies; assets do not

**Status:** accepted · 2026-10-25

## Context

The wedding product must not look like a template with swapped names. It also must not generate new artwork per couple, which would be slow, expensive and unpredictable.

## Decision

Novelty comes from **composition**, not from new assets.

Three layers:

| Layer | Varies | Controlled by |
|---|---|---|
| Content | names, dates, venue, text, photos | the brief |
| Composition | recipe selection, order, duration, camera, palette, type lockup | seeded engine |
| Assets | illustrations, sets, motifs | the designer, per motif pack |

A project stores its `seed` and `styleVersion`. The same pair reproduces the film exactly.

## Consequences

- The recipe library must be large enough to produce hundreds of coherent sequences.
- Every recipe is parameterized: slots, not fixed content.
- Palettes, type lockups and motif packs multiply variety cheaply.
- Revisions are shot-scoped and cheap.
- Determinism is a product requirement, not an engineering preference.

## Rejected alternatives

- **Pure template.** Rejected: forgettable, no premium pricing, competitors already do it.
- **Pure generation.** Rejected: unpredictable at the highest-stakes moment in a customer's life.
