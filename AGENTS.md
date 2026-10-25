# AGENTS.md

Single source of truth for any AI agent working in this repository.
`CLAUDE.md` points here. OpenCode, Claude Code, Codex and Cursor all read this file.

## What we are building

Paper Studio: a deterministic, local-first video engine with two front doors.

- **Paper Vows** — wedding invitation films, sold as a service.
- **Paper Studio** — a self-serve studio for creators, sold as a subscription.

The first milestone is a 30-second wedding invitation film generated from `fixtures/wedding-min/brief.json`.

## Non-negotiables

1. **Determinism.** Same brief + same style version + same seed = identical frames.
   No `Date.now()`, no unseeded `Math.random()`, no network access in render code.
2. **The brief is the contract.** Every output must be traceable to a field in the brief.
   If a value is missing, surface a warning; never invent it.
3. **No invented facts.** Names, dates, venues, family details and RSVP values come only from the brief.
4. **Every feature ships with a command that proves it works.** If an agent cannot verify it, it does not exist.
5. **Boring technology.** Every dependency is a liability when two agents maintain the repo. Justify new dependencies in the PR.
6. **Decisions are written.** Anything structural goes in `docs/decisions/` the same day. If it lives only in chat, it will be contradicted next week.
7. **Style code stays in `styles/`.** Engine code never hardcodes a palette, a font, a shot or a recipe id.

## The three axes

| Axis | Question | Lives in |
|---|---|---|
| Style | How does it look and move? | `styles/` |
| Format | What is the deliverable? | `formats/` |
| Genre | What is the content, and how is it argued? | `genres/` |

Style and format are independent. Genre applies mainly to long-form YouTube.

## Ownership

| Path | Owner | Rule |
|---|---|---|
| `styles/**`, `fixtures/**` | creative | engine changes never happen here |
| `src/**`, `scripts/**` | technical | no palette or shot ids here |
| `src/core/**`, `docs/**` | shared | change only with both owners aware |

Do not refactor across an ownership boundary without a PR labelled `contract-change`.

## Commands

```bash
npm install            # install
npm run plan -- fixtures/wedding-min/brief.json   # print a shot plan
npm run typecheck      # TypeScript check
```

Planned, not built yet:

```bash
npm run style:check <style>    # validate tokens, capabilities, recipes
npm run style:reel <style>     # contact sheet of every recipe
npm run render -- <project>    # frames + encode
```

## Current phase

**Week 1 — vertical slice.**

Build only:

- wedding brief schema
- deterministic planner
- Paper Vows tokens, capabilities and recipes
- fixture brief

Do not build: the web app, the renderer, payments, auth, a second style, long-form YouTube.

## How to make a change

1. Read the relevant spec in `docs/specs/`.
2. Change the schema first if the contract moves.
3. Update the fixture in the same commit.
4. Implement.
5. Run `npm run typecheck` and `npm run plan`.
6. Update `docs/decisions/` if the change is structural.
7. Small commit, conventional message.

## Definition of done

- `npm run typecheck` passes.
- `npm run plan -- fixtures/wedding-min/brief.json` produces a valid plan.
- Fixture updated if the schema changed.
- Docs updated if behaviour changed.
- No new dependency without a stated reason.

## Note on the two owners

The creative owner is not a programmer. They direct an LLM and judge output by looking at it.
The technical owner is a programmer and directs a different LLM.

Write code and docs so that a non-programmer can tell whether the result is correct by running one command and looking at the output. Prefer explicit, boring, readable code over clever abstraction.
