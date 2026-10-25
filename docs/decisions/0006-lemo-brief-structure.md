# 0006 — Adopt the Lemo 11-part human brief, keep our machine contract

**Status:** accepted · 2026-10-26

## Context

Lemo-Opuscar publishes 59 styles. Each is a prose `STYLE.md` (6–18 KB, 11 sections) plus a `DEMO.md` and a bespoke demo film. Their `_template` explicitly separates style invariants from demo specifics, and their `style.json` is gallery metadata only.

That library is repeatable by a strong agent: a Claude Opus 5.5 agent reads the bible, writes a new treatment and new code, and makes a new film. It is not repeatable by a machine: there are no tokens, parameterized recipes, validator, conformance frames, or versioned pack.

We already have the machine: a 27-decision contract, a validator, a resolver, a seal, and a human approval flow. The Lemo library is an excellent source of style bibles and reference films, not a replacement.

## Decision

Adopt the **11-section human brief** and optional **`style.json` gallery metadata** into our style packs.

Keep the 27-decision machine contract, the validator, the resolver, and the seal unchanged.

Apply the new brief first to the living `keepsake` example. Do not change `styles/_template`, the spec, or the frozen `gate/blind/pack` in this step.

## Consequences

- `styles/_examples/keepsake/STYLE.md` now uses the 11-section structure, plus the validator-required `Signature`, `Refusals`, `Not for` and `Questions` sections.
- `styles/_examples/keepsake/style.json` carries gallery metadata.
- The machine contract and the sealed blind proof are untouched; the gate pack remains the historical output of the blind run.
- The watercolor pilot can use the new human-brief structure without changing the validator.
- Human brief structure is adapted from Lemo-Opuscar (MIT); demo films and stills remain CC BY 4.0 and are not copied into our pack.
- No Lemo demo story, imagery, code or palette is reused.

## Rejected

- Forking or vendoring the 145 MB Lemo repo into the product.
- Using the Lemo prose as the runtime contract.
- Copying demo code into our renderer.
- Converting all 59 styles before proving one pilot.
