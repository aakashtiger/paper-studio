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
| `styles/**`, `fixtures/**`, `docs/references/**` | creative |
| `src/**`, `scripts/**`, `docs/**` | technical |
| `docs/decisions/**`, `src/core/**` | both |

The creative owner works through an LLM inside `styles/` only. The technical owner works through an LLM in `src/`. Both read `AGENTS.md` before starting.

## Read first

1. `AGENTS.md`
2. `docs/ARCHITECTURE.md`
3. `docs/SPEC.md`
4. `docs/ROADMAP.md`

## Repo setup (one-time)

CI is defined in `.github/workflows/ci.yml` but is not committed yet: the current GitHub token lacks the `workflow` scope. To enable it:

```bash
gh auth refresh -s workflow
git add .github/workflows/ci.yml
git commit -m "ci: add workflow"
git push
```

To add the second owner once their GitHub handle is known:

```bash
gh api --method PUT repos/aakashtiger/paper-studio/collaborators/<handle> -f permission=push
```

## Next slice

**Technical owner:** build `docs/specs/0002-renderer-v0.md` — three shots, 540×960, deterministic stills.

**Creative owner:** refine `styles/paper-vows/` — palette, type lockup, hero reference frames, and the remaining recipes. Run `npm run plan` after every recipe change and read the warnings.

