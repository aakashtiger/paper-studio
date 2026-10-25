# 0002 — Paper is a family, not a single style

**Status:** accepted · 2026-10-25

## Context

Paper K-pop is loud, graphic, fast and playful. It is right for song videos and Shorts. It is wrong for a wedding invitation, where the same visual grammar reads as flippant.

Building a second engine for weddings would double the work and split the codebase.

## Decision

Treat paper as a **style family** with variants that share an engine and differ in tokens, type, tempo and recipe selection.

- `paper-kpop` — loud, musical, graphic.
- `paper-vows` — quiet, warm, ceremonial.

A variant may add recipes. It may not require engine changes.

## Consequences

- The token layer must be strong enough that palette, type, timing and texture are data, not code.
- `capabilities.json` per variant is mandatory.
- A new variant is a folder, not a fork.
- If a variant needs an engine change, the style contract is wrong and must be fixed first.

## Rejected alternative

A wholly new style for weddings. Rejected because it delays the first paid film and would not test whether the style contract is real.
