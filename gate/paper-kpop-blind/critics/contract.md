# Contract critic — Paper K-pop 0.1.0

**Pack:** `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`
**Date:** 2026-10-27
**Score:** **9 / 10 — GO**
**Scope:** machine contract, gate, manifests, geometry, evidence, docs.

## Evidence

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run style:check -- styles/paper-kpop` | REVIEWABLE, 0 hard, 1 open choice (`paper-shadow`) |
| `node --import tsx --test test/paper-kpop-gate.test.ts` | 9 / 9 pass |
| `npm test` | 101 / 101 pass |
| Pack hash | `6c5765be…` |
| Inputs / used-inputs | 33 files, byte-identical, every manifest hash matches |
| `resolve.txt` | UTF-8, no BOM, 9 / 9 assertions |
| Geometry audit | 0 blockers after the batch; 3 accepted notes in `AUDIT.md` |
| Source leak scan | no film title, character, lyric, meter or Lemo token in pack or blind work |
| Self-containment | no external URL, parent path, drive path, other style, media file or signoff |
| Card | 77 prose words / 222 visible tokens; 3 reference stills; 3 recognition specimens; both shadow panels |

## Findings

No blocking defect.

- **Carry-forward, not a seal.** The author worked on `719e0582…`; the frozen pack is `6c5765be…`. The route, slots, durations and format structure survive, and the plan re-resolves 9/9, but the 9:16 boxes changed after the author. This is disclosed in `REPORT.md`; it is weaker than a fresh blind and is not presented as one.
- **One open choice.** `paper-shadow` is the only director choice; the card does not pre-fill it.
- **16:9 authored scale.** The 14 px floor is proven; the authored 64/26 px scale auto-fits down in tight boxes. This is the declared `text auto-fits` rule, not a contract failure. A future renderer must honour it.

## Why 9 and not 10

The contract is clean and the evidence is reproducible, but the blind is a plan-valid carry-forward rather than a pristine seal, and the 16:9 authored scale is not a pixel proof. Both are S2/historical limits, not defects in the frozen contract.

## What would raise it

A fresh blind author on `6c5765be…`, and a rendered S2 contact sheet that proves the auto-fit sizes and phone legibility in pixels.
