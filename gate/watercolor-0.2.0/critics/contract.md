# Contract critic — Watercolor 0.2.0

**Pack:** `sha256:196fd31501fe029f20da6c79fd1629864581182e22c59802b47a0b741c236e05`
**Date:** 2026-10-27
**Score:** **9 / 10 — GO**
**Scope:** pack contract, gate, exact manifests, UTF-8, card/application audit, historical 0.1.0.

## Evidence

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run style:check -- styles/watercolor-0.2.0` | REVIEWABLE, 0 hard, 1 open choice (`paint-in-speed`) |
| `node --import tsx --test test/watercolor-0.2.0-gate.test.ts` | 9 / 9 pass |
| `npm test` | 110 / 110 pass |
| Pack hash | `196fd315…` |
| Inputs / used-inputs | 24 files, exact set, byte-identical, every hash matches |
| Resolve | UTF-8, no BOM, 9 PASS, no mojibake |
| Blind | final run-2 *A Small Inventory*, 6/30/9:16 |
| 0.1.0 evidence | untouched at `31b804d0…` |
| Media | no raster, video, audio or signoff |

## Findings

No blocking defect.

- **Text-proof honesty.** 1:1 and 16:9 text fit is labelled unverified/S2; the 9:16 page is the proof. The pack does not overclaim.
- **Run-1 correction.** The first run exposed a card type-scale error and a missing `aspectRules` key; both were fixed before run-2. Run-1 is archived, not the live answer.
- **Scope.** 0.2.0 is card/process-only; the recipes and semantics are unchanged. That is exactly the declared scope, not a hidden limitation.
- **No renderer.** Pixels and motion remain S2.

## Why 9 and not 10

The contract is clean and the final blind is sealed on the final hash, but 1:1/16:9 text and the 16:9 walk coordinates are explicitly unverified, and there is no renderer. Those are S2 limits, not contract failures.

## What would raise it

A narrow geometry patch with rendered 1:1/16:9 text proof, or an S2 contact sheet that verifies the boxes and leader endpoints.
