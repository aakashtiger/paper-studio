# Identity implementation - index

**Status:** implemented in decision 0053. The research definition is
`docs/research/identity/KPOP-IDENTITY.md` v1.3.

## What shipped

| Item | Where |
|---|---|
| Strict nine-group identity schema | `src/core/style.ts` (`StyleIdentitySchema`, `identityGaps`, `identityCastRule`), `styles/paper-kpop/tokens.json`, `styles/_template/tokens.json` |
| Score vocabulary | `src/engine/identity.ts`, `src/engine/treatment.ts` (`performance`, `paletteScript`, `motifs`, `shots[].motif`) |
| Painted frame report | `src/engine/frame-report.ts`, `scripts/collage.ts` -> `build/<id>/frame-report.json` |
| One identity verdict | `src/engine/style-identity.ts`, `scripts/style-identity.ts` -> `build/<id>/style-identity/style-identity.json` |
| Preflight score/cast half | `scripts/preflight.ts`, `src/engine/preflight.ts` |
| Render `--check` and report requirements | `scripts/render-film.ts` |
| Gate rows | `scripts/gate-7.ts` - 28 checks, including `preflight`, `closeUps`, `lra`, `soundContrast` |
| Review row and reuse tie | `scripts/film-review.ts` |
| Chain order | `scripts/film-chain.mjs` - visual, identity, identity:video |
| Acceptance | `scripts/identity-accept.ts`, `npm run identity:accept` |
| Tests | `test/identity.test.ts`, `test/frame-report.test.ts`, updated `test/style-identity.test.ts`, `test/style-check.test.ts`, `test/film-new.test.ts`, `test/paper-kpop-gate.test.ts` |

## What is not shipped

- Probe v2 (drawn silhouette); the frame report uses a chest/head/leg aperture.
- Three samples per shot; v1 uses one.
- Chorus/formation.
- `camera.keys` and the painter read.
- Variation ledger.
- P0.5 analysis/rebuild workflow.
- The `reproduce` legacy marker for old scores.
- Music and semantic vision.

## Read the plans

`01-schema.md` ... `07-critique.md` are the implementation plans and the critic's
ruling. Where they disagree with the code, the code and decision 0053 win.
