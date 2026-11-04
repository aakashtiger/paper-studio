# 0053 - Identity is a schema and a frame report

**Status:** accepted - 4 Nov 2026
**Owners:** shared (`src/core/style.ts`, `src/engine/identity.ts`, `src/engine/frame-report.ts`, `src/engine/style-identity.ts`), creative (`styles/paper-kpop/tokens.json`, `_template/tokens.json`)
**Depends on:** 0015 (the pack), 0025 (story/beats/scenes/score), 0041 (camera), 0048 (the character), 0051 (the visual brief), 0052 (the first identity gate)

## Context

0052 added a film-level identity gate, but it read five **global means against six hero crops**, cast construction and a staged share. The reference film fails four of those five crop bands (-44.9 luma, -30.4 contrast, -18.0 saturation, palette 48.3 > 45), while the Uber film passed all five because its side bars supplied the colour. The gate could not see the field, the subject's placement, the scale rhythm, local contrast, blue-on-blue or the motif language. It passed a film that was roughly a quarter of the channel.

The research in `docs/research/identity/` measured the reference film and the Uber film, and the implementation plans in `docs/implementation/identity/` were cut to one schema, one frame report and one verdict.

## Decision

The identity is now a **schema plus a frame report plus one verdict**:

1. **`tokens.identity` is a strict nine-group block** (`envelope`, `reference`, `filmBands`, `field`, `composition`, `cast`, `performance`, `motifs`, `forbidden`). `TokensSchema` validates it. A pack with a cast must declare it; a pack with no cast is N/A. The template omits exactly `filmBands` - the one thing a new style must measure for itself.
2. **The film bands are absolute film means**, not deltas against crops: `lumaMean 75-130`, `saturationMean 12-35`, `edgesMean 7.5-17.5`. The six crops remain the style's surface evidence, not the film's gate.
3. **The score carries the film's choices**: `performance`, `paletteScript`, `motifs` and `shots[].motif`. Missing is a finding, never a pass.
4. **The frame report measures the paint**: one sample per shot, 480x270, a chest/head/leg aperture box, row-histogram side bars, the largest flat field, a 30%-padded local-contrast ring, blue-on-blue and palette families. `collage` writes `build/<id>/frame-report.json` from the frames it already paints; `--video` re-measures the delivered picture at the same times.
5. **`style:identity` is the one verdict** (`build/<id>/style-identity/style-identity.json`), tied to the score hash, the identity hash, the frame-report hash and - on delivery - the video hash. Missing or null is a finding.
6. **Preflight reads the score/cast half before a browser opens.** `render:film --check` runs the five report requirements and the extra determinism/type/rig/sfx/mix requirements without painting.
7. **Gate 7 grows from 24 to 28 checks**: `preflight`, `closeUps`, `lra`, `soundContrast`. `gate:7` remains the final verdict; `film:review` prints the same rows and reuses the identity report by picture hash.
8. **P0.9 is measured**: LRA floor 4 LU; the quietest/loudest 3 s window contrast floor 15 LU; close-ups (>=55% height) 20-60% of shots. The three values are measured on the master and the frame report, not declared.
9. **P0.7 is partly closed**: a probe/draft may no longer default to or overwrite the deliverable; `--skip-render` and `--from gate|review` require a render manifest for this score and a passing identity report for this picture; a whole-film render requires determinism, type/rig and sfx/mix reports; gate type/rig rows compare the score hash. The `reproduce` marker remains inferred; a legacy marker is named below, not silently passed.

## Measured

The acceptance command is `npm run identity:accept -- --ref <reference.mp4> --film <score.json>`.

| Axis | Reference | Band | Uber | Verdict |
|---|---|---|---|---|
| luma mean | 100.9 | 75-130 | 144.8 | ref pass / Uber fail |
| saturation | 21.8 | 12-35 | 35.7 | ref pass / Uber fail |
| edges | 12.6 | 7.5-17.5 | 10.4 | both pass |

Uber frame report: bars 21.7% / 24.2% in 100% of shots, plate 90%, centroid band 0%, height sd 6.3 / one tier, local contrast median 27.4 (67% >=20), blue-on-blue 30%, close-ups 100%. The gate fails `bars`, `fieldPlate`, `centroidX`, `heightRhythm`, `localContrast`, `blueOnBlue`, `cast`, `performance`, `palette`, `motif`, `closeUps`, `lra` (1.9) and `soundContrast` (2.1).

## What this does not do

- The subject box is a **chest/head/leg aperture**, not a drawn silhouette. It reproduces the research's `.135` centroid on Uber; a flower head is under-measured. Probe v2 is P1.
- One sample per shot. Three samples are P1 when a real film shows a defect a mid-shot frame missed.
- No chorus in v1: `principals` is 1-2, matching `maxCast: 2`. The reference chorus is `R`, not `I`.
- `camera.keys`, `shots[].framing`, `shots[].text`, `events[].with/contact` and a variation ledger are deliberately cut; the painter and the readers do not use them yet.
- The Uber film is **red by design**. Its delivered MP4, score and pose files are unchanged; no film is rebuilt in this change.
- The reference film is `R`, not a scored film. `identity:accept` measures it with `style:measure`; it never runs `style:identity` without a score.
- `P0.5` remains parked: the seven analyses are useful, the four rebuild worktrees are blocked by `canvas/recipes.js` being one file and `manifest.ts` hashing only that file. Split only when a rebuild needs two agents.
- `reproduce` still infers a reproduction from an existing MP4; the render now refuses a whole-film paint of a reproduction without a `legacy` marker. Adding the marker to old scores is a separate content change.

## Proof

- `npm run style:check -- styles/paper-kpop` -> REVIEWABLE, 0 hard failures.
- `npm run style:check -- styles/_template` -> DRAFT, one identity gap (`filmBands`).
- `npm run style:check -- styles/watercolor-0.2.0` -> REVIEWABLE (no cast -> N/A).
- `npm run collage -- films/uber-model/score.json` -> frame report.
- `npm run style:identity -- films/uber-model/score.json --video` -> FAIL, 17 findings.
- `npm run preflight -- films/uber-model/score.json` -> FAIL, 9 identity findings.
- `npm run render:film -- films/uber-model/score.json --check` -> refuses, no browser.
- `npm run gate:7 -- films/uber-model/score.json` -> 28 checks, FAIL on preflight, styleIdentity, closeUps, lra, soundContrast.
- `npm run identity:accept -- --ref ... --film films/uber-model/score.json` -> PASS (reference in band, Uber fails the named axes).
- `npm run typecheck && npm test` -> 492 tests, all pass.
