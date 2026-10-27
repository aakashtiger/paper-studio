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

**Pre-alpha. S1a, S1b, S1c and S1c.1 complete; Paper K-pop 0.1.0 and Watercolor 0.2.0 are REVIEWABLE.**

Working today:

- wedding brief schema and validator
- deterministic shot planner
- the S1a style definition system: 27 decisions, six artifacts, validator, resolver, approval, seal
- the `keepsake` control style
- the S1b watercolor pilot and the S1c.1 Watercolor 0.2.0 card/process revision
- the S1c Paper K-pop pack: 8 recipes, 2 formats, geometry gate, plan-valid blind
- 110 tests, including the geometry and card-height gates

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

## Style system

A style is a reusable package: `STYLE.md`, `tokens.json`, `capabilities.json`,
recipes and a one-page card. The contract is
`docs/specs/0003-style-definition-system.md`; start from `styles/_template/`.
The director-facing guide is `docs/STYLE-AUTHORING.md`.

```bash
npm run style:new -- <id> --brief <file>
npm run style:check -- <path>
npm run style:approve -- <id> --by "<name>"
npm run style:resolve -- --style <path> --seed <n> --brief <file> --format <file>
npm run style:seal
```

## Who owns what

| Path | Owner |
|---|---|
| `styles/**`, `fixtures/**`, `formats/**` | creative |
| `src/**`, `scripts/**`, `test/**`, `gate/**` | technical |
| `src/core/**`, `docs/**`, `sources/**` | shared |

The creative owner works through an LLM inside `styles/` only. The technical owner works through an LLM in `src/`. Both read `AGENTS.md` before starting.

## Read first

1. `AGENTS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/SPEC.md`
4. `docs/ROADMAP.md`

## Repo setup (one-time)

CI runs on every push: typecheck, tests and the wedding plan. The latest S1c.1
push is green (run `40474161734`).

To add the second owner once their GitHub handle is known:

```bash
gh api --method PUT repos/aakashtiger/paper-studio/collaborators/<handle> -f permission=push
```

## Next slice

**S2 — visual proof.** A short watercolor and Paper K-pop render test, contact
sheet and motion comparison. No full film, no app, no second style yet.

The definition gates are:

```bash
npm run style:check -- styles/paper-kpop
node --import tsx --test test/paper-kpop-gate.test.ts
npm run style:check -- styles/watercolor-0.2.0
node --import tsx --test test/watercolor-0.2.0-gate.test.ts
node scripts/card-audit.mjs styles/watercolor-0.2.0/card.html 900 700
```

Evidence: `docs/decisions/0008-paper-kpop-pilot.md`,
`docs/decisions/0009-watercolor-0.2.0.md`, `gate/paper-kpop-blind/` and
`gate/watercolor-0.2.0/`.

