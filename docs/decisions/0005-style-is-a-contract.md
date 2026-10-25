# 0005 — A style is a contract

**Status:** accepted · 2026-10-25

## Context

A style is easy to mistake for a mood board: a palette, a font, a few reference
frames. That version cannot be checked, versioned or reused. Every film becomes
a new negotiation, and the engine quietly absorbs decisions that belong to the
look.

## Decision

A style is a package, not a picture. It has five parts:

1. **Spec** — `STYLE.md`: intent, invariants, signature, refusals, not-for.
2. **Runtime contract** — `tokens.json`, `capabilities.json` and `recipes/*.json`:
   what the style can render, what it needs, and what it refuses.
3. **Evidence** — `capabilities.evidence.sources`: references with what to take,
   what not to take, and the rights.
4. **Conformance** — `capabilities.proof`: the frames, aspects and metrics that
   would prove a render belongs to the style.
5. **Method** — `BRIEF.md`, `bindings` and the questions log: how the style was
   authored, frozen and signed.

Assets are evidence of how the style behaves, not the style itself. The
constraints are the style: what it refuses is as load-bearing as what it adds.

A style is versioned and reusable. It is authored once, checked by machine,
judged by the director on one card, signed, and then reused across briefs and
formats without being rebuilt. The resolver consumes a generic content brief, so
one style can carry different families and different stories.

## Consequences

- A style change is a version change. Projects pin the version.
- The card is the human artifact; the rest is the machine contract.
- A style that only works for one brief is not a style.
- Approval is a hash-bound signature, not a comment in chat.

## Rejected alternatives

- **A style as a lookbook.** Rejected: it cannot be checked, versioned or reused.
- **A style per film.** Rejected: it cannot be sold, tested or improved.
- **A style as code.** Rejected: an engine change would silently change the look.
