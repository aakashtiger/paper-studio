# 0003 — Start with a vertical slice, not a schema

**Status:** accepted · 2026-10-25

## Context

Both owners work through LLMs. One is not a programmer. A schema-first approach produces documents neither owner can judge, and defers the first real output by weeks.

## Decision

The first artifact is a working vertical slice:

> a 30-second wedding plan generated from a hand-written brief, printable as JSON, and soon renderable as an MP4.

The schema is derived from the fixture, not invented before it.

## Consequences

- The fixture `fixtures/wedding-min/brief.json` is a first-class artifact. It is the contract.
- Every schema change updates the fixture in the same commit.
- The creative owner can judge progress by reading the plan and, in week 2, watching the film.
- Abstract architecture work is capped: docs describe the slice, not a hypothetical platform.

## Rejected alternative

Full schema and service architecture first. Rejected because it produces no observable output and no shared understanding between a non-technical and a technical owner.
