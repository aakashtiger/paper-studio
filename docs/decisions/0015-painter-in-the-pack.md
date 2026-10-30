# 0015 — The style pack carries its painter

**Status:** accepted · 31 Oct 2026
**Owners:** both (this crosses the `src/**` / `styles/**` boundary)
**Label:** `contract-change`
**Supersedes:** the “no renderer” clause of `docs/decisions/0008-paper-kpop-pilot.md`
**Pack:** `styles/paper-kpop/` 0.1.0 · `sha256:a2089bd7af2d5c2e08615b9783fd431fb3e8edd7bb596b4ffaf003483be7eb27`

## Context

S1c froze `styles/paper-kpop` at `sha256:6c5765be...` as a pack **with no
renderer and no video** (0008). The core system then needed to paint for real, so
the fixture film grew a painter at `films/understudy/backend.js`.

A painter is style code. It draws a specific cut-paper pop stage in a specific
palette. It belongs with the style, not with the film and not in the engine.

## Decision

Move the recipe implementations into the pack they describe:

```
films/understudy/backend.js  →  styles/paper-kpop/canvas/recipes.js
```

Why the pack and not `src/`:

- **Rule 7** — engine code never hardcodes a palette, a font, a shot or a recipe
  id. `recipes.js` is a map of recipe id → how that recipe looks; that is the
  style’s business.
- The pack already owns the palette (`tokens.json`) and the recipe ids
  (`recipes/*.json`). Splitting the paint from the recipe it paints separates two
  halves of one contract.
- A second paper film reuses the file unchanged; a second product style supplies
  its own `canvas/`.

This is the only cross-boundary move: an implementation file enters a
creative-owned folder. The label is `contract-change`.

## What does not change

The **authoring surface is byte-identical**. The blind author read `BRIEF.md`,
`STYLE.md`, `tokens.json`, `capabilities.json`, `recipes/*.json`, `card.html`,
`APPLICATION.md`, `SOURCES.md`, the bundled fonts and the six reference frames —
none of it changed. The pack only **gains** `canvas/recipes.js`.

That is why the frozen S1c blind (*Last Cue*, run-18) still stands: the blind
proves a fresh author can read the brief, style, tokens, recipes and card and
resolve a plan, and every one of those files is unchanged. No new author run is
needed, and none was invented.

The style’s **identity version stays 0.1.0**. The style *contract* did not move;
the pack gained the backend that draws it. A contract revision (a card, a token,
a recipe) would take a new pack, the way watercolor 0.2.0 did.

## Evidence

| | |
|---|---|
| pack hash, frozen S1c (0.1.0, no renderer) | `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba` |
| pack hash, this revision | `sha256:a2089bd7af2d5c2e08615b9783fd431fb3e8edd7bb596b4ffaf003483be7eb27` |
| only pack change | `+ canvas/recipes.js` (28 insertions, 12 deletions against the film copy it came from) |
| blind re-seal | `gate/paper-kpop-blind/{inputs,used-inputs}` refreshed with `make-inputs.ts`; `PACK-HASH.txt` updated |
| blind resolve | unchanged: 6 shots · 30 s · 9:16 · 9/9 |
| contract / brief / template hashes | unchanged (`capabilities.json` untouched) |

Because the painter now lives *inside* the pack, the revision hash moves with
every painter edit (it was `55e994e8...` when this decision was written, then
`a2089bd7...` after the duet and bow-pose passes). The frozen `6c5765be...`
hash and the sealed blind inputs are the stable reference; the revision hash is
re-sealed with `make-inputs.ts` whenever the painter changes.

The old hash is recorded here and in `docs/decisions/0008-paper-kpop-pilot.md`;
`gate/paper-kpop-blind/REPORT.md` carries both.

## Consequences

- The S1c gate test still proves the shipped pack matches the sealed blind, and
  now scans the pack’s `.js` for the same self-containment bans as the text
  files, so the new file cannot smuggle in a network or parent path.
- `scripts/assets-hash.ts` refreshes the fixture’s asset hashes after a rig edit;
  the painter is not an asset, so it is not hashed in the score.
- If the director answers `paper-shadow` with **Collage**, the painter grows the
  contact shadow the recipes deliberately omitted; that change is a paint change
  inside `canvas/recipes.js`, not a contract change, and will re-run `audit:paint`.
