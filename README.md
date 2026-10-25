# Paper Studio

A deterministic, local-first video engine that turns a brief into a finished film in a chosen visual style.

One engine, two doors:

| Door | Who it is for | How it works |
|---|---|---|
| **Paper Vows** | couples and planners | they send a brief and photos; we produce the film |
| **Paper Studio** | creators | they pick a style, write a brief, generate and review themselves |

The engine is deterministic: the same project, style version and seed always produce the same frames.

---

## Status

**Pre-alpha, week 1.**

Working today:

- wedding brief schema and validator
- deterministic shot planner
- Paper Vows style skeleton: tokens, capabilities, 7 recipes
- fixture brief with a real Indian wedding

Not built yet: renderer, web app, review room, payments, creator studio.

## Quick start

```bash
npm install
npm run plan -- fixtures/wedding-min/brief.json
npm run typecheck
```

`npm run plan` prints the shot plan for the fixture brief. That plan is the contract the renderer will consume.

## Layout

```
docs/               specs, architecture, decisions, UAT
fixtures/           real briefs used as tests
formats/            what a deliverable is (wedding, later shorts)
genres/             research and narrative playbooks (later)
styles/             the visual system: tokens, capabilities, recipes
src/core/           schemas and shared types
src/engine/         planner, renderer, compiler
scripts/            command line entry points
```

## Who owns what

| Path | Owner |
|---|---|
| `styles/**`, `fixtures/**`, `docs/references/**` | creative |
| `src/**`, `scripts/**`, `docs/**` | technical |
| `docs/decisions/**`, `src/core/**` | both |

The creative owner works through an LLM inside `styles/` only. The technical owner works through an LLM in `src/`. Both read `AGENTS.md` before starting.

## Read first

1. `AGENTS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/SPEC.md`
4. `docs/ROADMAP.md`
