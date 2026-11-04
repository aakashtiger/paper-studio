# 06 — Identity tests: the acceptance test is the product

**Status:** implementation plan, not implemented. No code, pack, score or gate has been changed.
**Date:** 4 November 2026
**Spec:** `docs/research/identity/KPOP-IDENTITY.md` v1.3, sections 5.5 and 8.
**Depends on:** 0052 (identity is a film gate), 0033 (a report is trusted because it is about this film), 0037 (the checks measure the film, not the promise).

> No `01`–`05` file exists in this tree at the time of writing. This plan states
> the shape it tests in §2 so that the test names, fixtures and assertions do not
> depend on an unseen document. If `01`–`05` disagree with §2, the fixtures in §4
> and the ledger in §4.4 are the part that must survive; the module names are not.

---

## 0. What this plan decides

1. **The acceptance test is the test.** The reference film must pass the film
   bands; the Uber film must fail the named axes while still passing the surface
   bands. A unit test that only checks the Uber failure is half a test.
2. **Fixtures are the fast half; one script is the slow half.** `npm test` gets
   ~50 pure tests (< 1 s). `npm run identity:accept` runs the two real artifacts
   and is the release gate (minutes), not a PR gate.
3. **Four new test files, two modified, one deleted.** Not one test per band.
4. **A missing, null or NaN measurement is a finding, never a pass.** This is the
   single rule that the current 476 tests do not cover.
5. **The frame report is the only new instrument.** It measures bars, local
   contrast, figure-blue, field colours and the drawn subject box. A 3×3 grid, a
   silhouette probe, drawn-motif detection and a 12-axis variation report are
   cut (§8).

---

## 1. Baseline, verified

Run on 4 November 2026, in this tree:

| Check | Result |
|---|---|
| `npm run typecheck` | clean, no output |
| `npm test` | **476 pass, 0 fail**, 8.9 s, 45 test files + 1 helper (46 files in `test/`) |
| `style:identity` on the Uber film | **pass**, `findings: []` (`build/uber-model/style-identity/style-identity.json`) |
| Uber vs the six crops | Δ luma −0.99 · Δ contrast −17.99 · Δ sat −4.15 · Δ edges +0.10 · palette 42.95 — inside the surface bands |
| The reference film vs the six crops | Δ luma −44.87 · Δ contrast −30.43 · Δ sat −18.01 · Δ edges +2.27 · palette 48.28 — **fails 4/5** |
| The reference film, absolute | luma **100.88** · contrast p5 **190** · sat **21.83** · edges **12.57** · palette **48.28** |

The current test that is supposed to guard this is
`test/style-identity.test.ts`: five tests with invented deltas. It asserts that a
delta inside invented bands passes, and that a delta outside them fails. It never
loads the reference film, never loads the Uber film, and never asserts that the
Uber film **passes** anything. That is why a gate can pass a film the spec calls
~25% of the channel.

---

## 2. The shape under test

The test matrix is only meaningful against a concrete contract. This is the
smallest shape that covers the spec's §5.5 and stays inside its §8.2.

### 2.1 Pack: `styles/paper-kpop/tokens.json`

`tokens.identity` keeps the existing surface block and gains one film block:

```
identity
  dimension: "2.5d-layered"
  reference: "references/frames"       # the six crops (surface)
  bands: { luma:20, contrast:25, saturation:10, edges:5, palette:45 }
  filmBands: { <field>: { min?, max?, statistic, basis, owner, gap } }
  field:       { edgeBarMax, coloursPerFilm:[3,5] /* the script, not pixels */, sameConsecutiveActs:false }
  composition: { subjectHeight:[0.129,0.92], centroidX:[0.30,0.75],
                 centroidShare:0.80, heightSdMin:15, heightTiersMin:3 }
  palette:     { warmShare:[0.40,0.90], blueShareMax:0.20,
                 localContrastP50Min:35, localContrastShareMin:0.75,
                 blueOnBlue:{ figureBlueMin:0.30, hue:[195,255], deltaLumaMax:18 } }
  cast:        { max:2, chorusMax:5, totalMax:7, stagedRatio:0.5,
                 posesMin:8, expressionsMin:14, anchors:[...],
                 archetype:"paper-pop-performer", featuresMin:3,
                 stageRoles:[star,backing,foil,creature,host], thumbOptional:true }
  performance: { modes:[stage-show,presenter-show,creature-show], modeRequired:true,
                 starRequired:true, entranceBy:0.20, exitAfter:0.80, signatureShots:1 }
  motifs:      { library:[13 ids], perFilm:[3,5], uses:[2,5],
                 atLeastOneUses:3, maxShotShare:0.40, semanticObjectMin:1 }
  forbidden:   [45 ids, each with an owner (§3.5 C11)]
```

Every `filmBands` entry must answer four questions in the file itself:
**what statistic** (`mean`, `p5`, `p50`, `p95`, `sd`, `share-in-band`, `max`),
**what basis** (`film`, `target`, `code`), **who owns the check** (`identity`,
`preflight`, `camera:check`, …), and **is it a gap check** (`yes`, `no`,
`incidental`, `ref-only`). A band that cannot answer them is a schema error.

`bands` stays exactly as it is: a **surface** delta against the six crops. It is
not renamed and not merged. The two references are the point.

### 2.2 Score: `films/<id>/score.json`

Optional additions, so every old score still parses:

```
cast[]:        stageRole: "star"|"backing"|"foil"|"creature"|"host"
shots[]:       framing: "wide"|"medium"|"close"|"extreme"
               field:   a palette role
               motif:   string[]
paletteScript: string[]                 # 3-5 roles, no consecutive repeat
motifs:        [{ id, kind:"semantic"|"formal", meaning }]
performance:   { mode, star, entrance, exit, signatureShot }
```

No `camera.keys`, no `events[].with/contact/interaction`, no second palette, no
second type system. Those are cut in §8.2.

### 2.3 Library: `library/characters/*/poses.json`

```
archetype: "paper-pop-performer"
stageRole: "star"|"backing"|"foil"|"creature"|"host"
appearance: { features: [3+ strings], face: "plate"|"mask" }
body.hand.thumbW / thumbH: optional or 0
```

`resolvePoseLibrary` skips the 1.5× thumb rule only when the thumb is absent or
0. A hand that has a thumb still has to be 1.5× it. A creature may have a mask
face and no thumb; it still needs 8 poses, 14 expressions, a stage role and a
head feature.

### 2.4 Report: `build/<id>/style-identity/style-identity.json`

```
id, mode:"claims"|"frames"|"video", identityVersion, identityHash,
score, videoHash|null, specimen, sampler:{ perShot, samples, expected },
surface:{ luma, contrast, saturation, edges, palette },
measure:{ lumaMean, lumaP5, lumaP50, lumaP95, contrastP5, saturation,
          saturationP95, edges, palette, warmShare, blueShare },
frame:{ centroidXShare, centroidXP50, heightMin, heightMax, heightP50,
        heightSd, heightTiers, barsLeft, barsRight, barsMax,
        localContrastP50, localContrastShare, blueOnBlueShots,
        blueOnBlueSamples, fieldColours, subjectShots },
claims:{ stagedShots, framing:{shot:kind}, field:{shot:role}, motifUses:{id:n} },
samples:[{ t, shot, box, bars, localContrast, figureBlue, localBgHue,
           fieldColour, fieldShare }],
findings:[{ code, field?, shot?, message }],
unverified:[{ field, owner, reason }],
delegated:[{ field, command }],
pass
```

`pass` is a convenience for humans. The gate recomputes it from `findings` and
`unverified`; a report whose `pass` disagrees with its findings is refused.

The finding codes are closed (the report schema uses a `z.enum`, so a typo cannot
pass):

| Code | Raised by |
|---|---|
| `identity:block` | pack has no `identity` block but opts in |
| `identity:band` | a required band or key is missing |
| `identity:band-meta` | a band lacks `statistic`, `basis`, `owner` or `gap` |
| `identity:legacy` | v0.2.0 block (surface only) |
| `identity:range` | reversed or out-of-share range |
| `identity:dimension` | not `2.5d-layered` |
| `identity:forbidden-list` / `identity:forbidden-owner` | pack list is missing/duplicated/ownerless |
| `identity:cast` / `identity:staged` | library/construction/staged ratio |
| `identity:surface` | a surface delta outside the crop band (`field` names it) |
| `identity:luma` / `identity:contrast` / `identity:saturation` / `identity:edges` / `identity:palette` | absolute film bands |
| `identity:side-bars` / `identity:centroid-x` / `identity:height-rhythm` | field and placement |
| `identity:local-contrast` / `identity:blue-on-blue` | figure separation |
| `identity:field-script` / `identity:motifs` / `identity:motif-share` | film choices |
| `identity:performance` | mode/star/entrance/exit/signature |
| `identity:claim` | a score claim the paint contradicts |
| `identity:unmeasured` | a band had no number |
| `identity:report` | the gate refused a report (missing/stale/mode/incomplete) |
| `identity:forbidden` | an identity-owned forbidden move |

### 2.5 Code

| Unit | Responsibility |
|---|---|
| `src/engine/style-identity.ts` | `parseIdentityTokens`, `checkFilmBands`, `checkClaims`, `checkFrameRollup`, `checkIdentityEvidence`; pure, no ffmpeg |
| `scripts/style-identity.ts` | reads the score/pack/library, samples frames, writes the report; `--claims`, `--frames`, `--video`, `--out` |
| `scripts/identity-acceptance.ts` | runs the reference and Uber halves, asserts §5.2, writes `build/identity/acceptance/` |

Keep it in `style-identity.ts` unless it passes ~600 lines; only then split a
`frame-report.ts`. Fewer files is the house style.

**Sampling is fixed, not random.** `--frames` takes one sample per shot at the
collage tile's time and reads its box from `build/<id>/collage/probe.json`.
`--video` takes three samples per shot at 25/50/75%, snaps them to the `inspect`
probe's 0.1 s grid, reads the boxes from `build/<id>/inspect/probe.json`, and
measures the pixels on the delivered frame at the same times. The box is the
union of the rig anchors **and the head-ornament extent**, in frame pixels: a
body-only box would understate the character the height band is about. Both modes
record the times and the box source in `samples[]`; a staged sample with no box is
`identity:unmeasured`, not a skip. Both read the probe's own report
(`collage.json`, `inspect.json`) and refuse a probe whose score hash is not this
score. The 10-frame report is the instrument check; the 30-frame report is the
gate.

---

## 3. Test matrix

Rows are behaviours, not files. `Δ` means a surface delta; all others are
absolute film values.

### 3.1 Pack schema (`test/identity-schema.test.ts`)

| # | Case | Fixture | Expected |
|---|---|---|---|
| S1 | valid pack | the real `styles/paper-kpop/tokens.json` | 0 findings; every band has statistic/basis/owner/gap |
| S2 | missing `identity` block, pack opts in | `capabilities.identity.styleIdentity: true`, token block deleted | `identity:block` |
| S3 | missing block, pack does not opt in | watercolor shape | no identity finding; pack still passes |
| S4 | missing `filmBands` | v0.2.0 block | `identity:legacy` + `identity:band filmBands`; parses |
| S5 | one band missing | delete `centroidX` | `identity:band centroidX` |
| S6 | placeholder | `lumaMean:{min:0,max:0}`, `archetype:"TODO"`, `motifs.library:[]`, `forbidden:[]` | four findings, one per field; no crash |
| S7 | reversed / out-of-share range | `subjectHeight:{min:0.92,max:0.13}`, `warmShare:{min:0.9,max:0.4}` | `identity:range` |
| S8 | band without metadata | delete `statistic` / `owner` / `gap` | `identity:band-meta` ×3, naming each key |
| S9 | legacy dimension | `dimension:"2d"` | `identity:dimension` |
| S10 | forbidden list | duplicate `dissolve`, remove `blue-on-blue` | `identity:forbidden-list` |
| S11 | unknown band key | `filmBands.centroidY` | `identity:band` (strict object) |
| S12 | ownerless forbidden id | one id with no owner in the map | `identity:forbidden-owner` |

### 3.2 Score and library (`test/identity-schema.test.ts`)

| # | Case | Fixture | Expected |
|---|---|---|---|
| L1 | old score still parses | `films/uber-model/score.json` | `FilmScoreSchema.parse` succeeds |
| L2 | old score, claims mode | Uber | explicit `identity:motifs`, `identity:performance`, `identity:field-script`; no crash |
| L3 | new fields parse | all §2.2 fields | no schema error |
| L4 | unknown stage role | `stageRole:"intern"` | schema error naming the enum |
| L5 | cast count | 2 principals + 5 backing | pass; 3 principals fail; 8 bodies fail |
| L6 | creature branch | mask face, creature role, no thumb, 8 poses/14 expressions | pass |
| L7 | creature missing a test | 7 expressions / no stage role | `identity:cast` |
| L8 | thumb optional | hand 18×26, thumb 0 | pass; `audit:body` silent |
| L9 | thumb present, hand too small | hand 5×6, thumb 8×12 | `body:hand` still fails |
| L10 | performer features | 2 features vs 3 features + star role | fail / pass (declaration only; human signs the quality) |

### 3.3 Frame report and bands (`test/identity-bands.test.ts`, `test/identity-report.test.ts`)

| # | Case | Fixture | Expected |
|---|---|---|---|
| B1 | reference passes film bands | reference fixture §4.1 | 0 film findings |
| B2 | ledger is complete | real `filmBands` keys | every key has a ledger row and vice versa |
| B3 | every gap separates | ledger `gap:"yes"` | reference inside, Uber outside |
| B4 | every non-gap passes both | ledger `gap:"no"` | reference and Uber inside |
| B5 | reference fails the surface | reference vs crops | 4 surface findings: luma, contrast, saturation, palette; edges passes |
| B6 | Uber passes the surface | Uber vs crops | 0 surface findings |
| B7 | palette direction | crops→film 48.28, film→crops 32.76 | the checker uses crops→film; a swap test fails |
| B8 | null / NaN / undefined | each band in turn | `identity:unmeasured`, never a skip |
| B9 | boundary inclusive | centroid .30/.75, bars .08, sd 15, share .75 | pass at the boundary, fail one step outside |
| B10 | centroid is a share | reference .82, Uber 0 | band is `share-in-band`, not p50 |
| B11 | height floor tolerance | reference min 12.96 | passes `[0.129,0.92]`; fails `[0.13,0.92]` |
| B12 | blue-on-blue is sustained | 1 frame in 1 of 49 vs 7 of 10 | 1 frame passes; 2 frames in one shot fails; 25/30 fails |
| B13 | local contrast is inside-box | Uber 12.64 vs ring −150 | the ring value is not used |
| B14 | edit is not a film band | reference video scene detector 90.8/min | identity never reads it; preflight reads the score |
| B15 | bars instrument | synthetic 96×54 grid: 19 cobalt cols at the left (19.8%), 20 tomato at the right (20.8%), 57 cream between | bars 19.8% / 20.8%; a soft ramp gives 0 |
| B16 | local/figure instrument | synthetic box: cream figure on a cobalt field; cobalt figure on cream | cream-on-blue: \|ΔL\| 76, figureBlue 0; cobalt-on-cream: \|ΔL\| 76, figureBlue .8 |
| B17 | rollup | 10 synthetic tiles, height .5778, centroid .1365, 7 blue-on-blue | sd 0, tiers 1, share 0, blueOnBlueShots 7 |
| B18 | report determinism | the same 10 tiles twice | byte-identical report JSON |

### 3.4 Gate and evidence (`test/identity-report.test.ts`)

| # | Case | Fixture | Expected |
|---|---|---|---|
| G1 | no report | missing file | `identity:report` "no report" |
| G2 | stale score | report.score ≠ current | `identity:report` "different score" |
| G3 | stale video | report.videoHash ≠ frozen | `identity:report` "different picture" |
| G4 | frames mode at the gate | `mode:"frames"`, `videoHash:null` | `identity:report` "collage frames are not the delivered video" |
| G5 | stale rules | `identityHash` ≠ current tokens.identity | `identity:report` "different identity rules" |
| G6 | stale version | `identityVersion:"1.2.0"` | `identity:report` "different style version" |
| G7 | `pass:true` with findings | one finding | `identity:report` "pass disagrees with findings" |
| G8 | `pass:false` | one finding | fail, message quotes it |
| G9 | null measurement | `measure.lumaMean:null` | `identity:report` "unmeasured lumaMean" |
| G10 | sample count | `samples:10`, `expected:30` | `identity:report` "10 of 30 samples" |
| G11 | valid video report | §2.4 | pass |
| G12 | valid frames report, pre-render | `render:film` contract | pass; the gate still refuses it |

### 3.5 Performance, motifs, variation, forbidden (`test/identity-claims.test.ts`)

| # | Case | Fixture | Expected |
|---|---|---|---|
| C1 | performance valid | mode + star + entrance 5% + exit 90% + signature | pass |
| C2 | missing mode | block present, no mode | `identity:performance` |
| C3 | star not in cast / entrance at 50% / no signature | three fixtures | three findings, one each |
| C4 | motifs valid | 4 motifs, uses 4/3/2/2, max 40% | pass |
| C5 | motif count | 2 or 6 | `identity:motifs` |
| C6 | motif uses | one used once; one used six times | `identity:motif-share` |
| C7 | one motif over 40% | 5 of 10 shots | `identity:motif-share` |
| C8 | no semantic object | four formal motifs | `identity:motifs` "one semantic object" |
| C9 | variation | same opener / same closer / motif diff < 2 / no history | three findings; no history is `unverified`, not pass |
| C10 | forbidden | `transitionOut:"dissolve"`, `gloss:true`, unknown id | `identity:forbidden` / schema error / schema error |
| C11 | forbidden ownership | every pack id has an owner | no duplicate checks; camera/type/rig ids are `delegated` |
| C12 | claim vs paint | framing close vs height 18%; staged 10/10 vs 0 boxes; field cobalt vs cream | `identity:claim`, one per contradiction |
| C13 | paint without claim | box in a shot with no cast | warning, not a gate failure |
| C14 | matching claims | declarations equal the report | pass |

### 3.6 Determinism and no silent pass (`test/identity-report.test.ts`)

| # | Case | Expected |
|---|---|---|
| D1 | same report input twice | `deepEqual` |
| D2 | sample times | 10 shots × 3 = 30, fixed midpoints 25/50/75%, no random |
| D3 | source scan | `src/engine/style-identity.ts`, `scripts/style-identity.ts`, `scripts/identity-acceptance.ts` contain no `Math.random`, `Date.now`, `new Date`, `performance.now` |
| D4 | unknown finding code | report schema refuses it (z.enum) |
| D5 | every identity field has an owner | no ownerless field in `filmBands`, `forbidden`, `claims` |
| D6 | an empty report cannot pass | `findings:[]` but `samples:0` / `unverified` non-empty → fail |

### 3.7 Edit (`test/preflight.test.ts`)

Edit is a **preflight** band, not an identity band: the reference video's scene
detector reads 90.8 changes/min (paper boil), while the annotated cut is 20.3.
`tokens.identity.edit` is read by `preflight`, which already owns the cut shape.

| # | Case | Expected |
|---|---|---|
| E1 | reference-shaped cut | median 2.86 s / 20.3 cuts/min passes |
| E2 | slow cut | median 3.4 s fails `pacing:median` |
| E3 | fast cut | 25 cuts/min fails `pacing:cuts` |

---

## 4. Fixtures and exact values

All fixtures are inline constants in the test files. No test reads a video; the
values below are the ground truth the acceptance script must reproduce.

### 4.1 Reference film — `build/research/claude-pop/bible.json`, 4,698 frames

| Field | Value |
|---|---|
| luma mean / p5 / p50 / p95 | **100.88** / 39.34 / 98.74 / 175.44 |
| contrast mean / p5 / p50 / p95 | 215.41 / **190** / 218 / 232 |
| saturation mean / p95 | **21.83** / 44.61 |
| edges mean | **12.57** |
| palette distance vs crops | **48.28** |
| warm share p50 | .70 |
| blue share p50 | .01 |
| character height min / p50 / max / sd | 12.96 / 55.19 / 91.85 / **21.8 points** |
| height tiers | 4 (16 wide, 8 medium, 23 close, 2 extreme) |
| centroid x p50 / share in .30–.75 | .55 / **.82** (derived: p10 .33, p90 .69) |
| local \|ΔL\| p50 / share ≥ 20 | **46.62** / **.79** (derived from p25 27.59) |
| blue-on-blue | 1 frame of 49; **not sustained** |
| side bars | 0 designed |
| field colours | 54 values in 54 shots (R, not a band) |
| motifs | 5 (sunburst, petal, halo, stamp, iris) — R, no score |
| performance | presenter-show with a stage finale — R, no score |
| edit | median 2.86 s (cards) / 3.06 (scenes); **20.3 cuts/min** (cards) |

**Do not** take the edit values from `bible.json`: it reports **237 scene
changes, 90.79/min**, because paper boil fires the detector. The 20.3 is the
annotated 54-card cut. This is the calibration trap in §4.4.

### 4.2 Surface reference — the six crops

| luma | contrast | saturation | edges | palette |
|---|---|---|---|---|
| 145.75 | 245.83 | 39.84 | 10.29 | `#1d38ba #2c1e23 #955b49 #c44026 #e09a4b #ecc385` |

The reference film, measured against these, gives the 4/5 failure in §1. The
same crops compared with themselves give Δ 0 and pass, which is the only
meaningful "crops pass the surface" assertion.

### 4.3 Uber film — tile report plus video report

**Ten collage tiles** (`docs/research/identity/I-frames.json`, `.uber.collageTiles`):

| Field | Value |
|---|---|
| character height | **57.78% in 10/10 tiles** → sd **0**, 1 tier |
| centroid x | **.1365** (one .1363) → share in .30–.75 **0/10** |
| side bars left / right | **19.0% / 19.5%** (`barProfile`); worst tile **22.08%** |
| local \|ΔL\| | median **12.64**; ≥ 20 in **2/10** |
| figure-blue | median .83 (max .98) |
| local background hue | ~220 (cobalt) |
| blue-on-blue | **7/10 tiles** |
| largest flat | tile median .25, max .45 → inside .04–.46 |
| blue share | tile median .17 → inside ≤ .20 |
| warm share | tile median .78 → inside .40–.90 |
| field colours | **1** (cream plate) |
| motifs | **0** |
| performance | none |
| surface (video) | Δ luma −0.99 · Δ contrast −17.99 · Δ sat −4.15 · Δ edges +0.10 · palette **42.95** — **all pass** |
| film luma (final sheet / video) | 145.41 / 144.76 → fails 75–130 |
| film saturation (video) | 35.69 → fails 12–35 by 0.69 (**incidental**, not a named gap) |
| edit | 9 cuts / 18 min · median 3.0 → passes |

**Thirty video frames** (`I-frames.json`, `.uber.finalSheet`): local \|ΔL\| p50
**10.38** (mean 11.65), blue-on-blue **25/30**, figure-blue median .83, mean luma
145.41, largest flat p50 .29. The 30-frame report is the gate; the 10-tile report
is the pre-render check. Both fail; the acceptance pins one and records the other.

### 4.4 The band ledger

This table is the contract of the spec's §5.5 in one place. It flattens
`filmBands` and the four blocks that carry a band (`composition`, `palette`,
`field`, `edit`); the test reads the real `tokens.identity` and asserts every
band path appears here, so a new band cannot be added without a reference and an
Uber verdict.

| Field | Statistic | Band | Reference | Uber | Gap? | Owner |
|---|---|---|---|---|---|---|
| lumaMean | mean | 75–130 | 100.88 ✓ | 145.41 ✗ | incidental | identity |
| lumaP5 | p5 | 20–60 | 39.34 ✓ | — | ref-only | identity |
| lumaP50 | p50 | 80–140 | 98.74 ✓ | — | ref-only | identity |
| lumaP95 | p95 | 160–200 | 175.44 ✓ | — | ref-only | identity |
| contrastP5 | p5 | 175–210 | 190 ✓ | — | ref-only | identity |
| saturation | mean | 12–35 | 21.83 ✓ | 35.69 ✗ | incidental | identity |
| saturationP95 | p95 | 30–60 | 44.61 ✓ | — | ref-only | identity |
| edges | mean | 7.5–17.5 | 12.57 ✓ | 10.39 ✓ | no | identity |
| paletteDistance | distance | ≤ 55 | 48.28 ✓ | 42.95 ✓ | no | identity |
| warmShare | p50 | .40–.90 | .70 ✓ | .78 ✓ | no | identity |
| blueShare | p50 | ≤ .20 | .01 ✓ | .17 ✓ | no | identity |
| subjectHeight | min/max | .129–.92 | 12.96%–91.85% ✓ | 57.78% ✓ | no | identity |
| centroidX | share-in-band | ≥ .80 | .82 ✓ | 0 ✗ | **yes** | identity |
| heightSd | sd | ≥ 15 | 21.8 ✓ | 0 ✗ | **yes** | identity |
| heightTiers | count | ≥ 3 | 4 ✓ | 1 ✗ | **yes** | identity |
| localContrastP50 | p50 | ≥ 35 | 46.62 ✓ | 12.64 ✗ | **yes** | identity |
| localContrastShare | share ≥ 20 | ≥ .75 | .79 ✓ | .20 ✗ | **yes** | identity |
| sideBarsMax | max | ≤ .08 | 0 ✓ | .2208 ✗ | **yes** | identity |
| blueOnBlueShots | sustained | 0 | 0 ✓ | 7 ✗ | **yes** | identity |
| fieldColours | paint floor | ≥ 3 | 54 ✓ | 1 ✗ | **yes** | identity |
| medianShotS | median | 2.4–3.2 | 2.86 ✓ | 3.0 ✓ | no | preflight |
| cutsPerMinute | mean | 18–24 | 20.3 ✓ | 18 ✓ | no | preflight |

The 3–5 `field.coloursPerFilm` band is on the **score's `paletteScript`**, not on
the pixel count: the reference uses 54 field *values* mixed from six roles, and a
value count would refuse its own reference. The paint floor (≥ 3 distinct field
colours) is the anti-cream-plate check; the script band is the declared choice.

**Traps this ledger exists to stop:**

1. **`largestFlat .25` (tiles) / `.29` (sheet) is inside `.04–.46`.** The
   spec's §7 cites `.268` as a gap; the band passes the Uber film. Report it; do
   not gate on it.
2. **`blueShare .17` is inside `≤ .20`.** The Uber film passes the film-wide blue
   band. The failure is **figure-blue × local hue × local ΔL**, not the share.
3. **`height .578` is inside `.13–.92`.** The size is right; the **sd** is the
   gap. Do not refuse a fixed-height film on height alone.
4. **`saturation 35.69` vs `35`** is a 0.69 miss. Treat it as incidental; do not
   widen the band to 36 and do not name it a gap.
5. **The spec cites `fieldShare .61` vs the `.60` ceiling; the tile report's
   `fieldColourShare` median is .34.** They are different measures. Report both;
   do not gate on either. The bars and the one field colour are the gap.
6. **`centroidX` is a share, not a p50.** The reference's p50 .55 is not the
   rule; 80% of shots in `.30–.75` is. Uber's 0/10 is the failure.
7. **The reference height floor is 12.96, not 13.00.** A band of `.13` exactly
   refuses its own reference. Use `.129` with a note.
8. **The reference fails its own R values**: hard cuts 94% (band 80–90), iris
   20% (band 8–15), warm p25 .24 (band floor .40), centroidY min .24. They are
   **R**, not **I**. They must not enter `filmBands`.
9. **The reference video's scene detector reads 90.8 cuts/min.** The annotated
   edit is 20.3. Never feed `style:measure.cuts` (no `--score`) to the edit band.
10. **Palette distance is asymmetric.** Crops→film is 48.28; film→crops is
    32.76. A refactor that swaps arguments would make the reference pass the old
    45 band for the wrong reason.
11. **Local contrast is the inside-box measure.** Using the ring on the Uber
    figure reports −150 (the bar vs the cream plate), not 12.6.

---

## 5. The acceptance test

### 5.1 Command

```
npm run identity:accept -- --ref "Y:\NewVideoTest\out\claude-pop.mp4" --film films/uber-model/score.json
```

It runs four measurements, in this order. The reference has **no score**, so
`style:identity` is never run on it; `style:measure` is the reference instrument.
The Uber film has a score and a delivered video, so `style:identity` is.

The spec's item 1 command (`style:measure --ref <film> --camera`) cannot produce
the palette distance: it has no specimen. The two reference commands below are
the correction. They are two commands because `--camera` with a frames reference
throws ("a frame set has no motion to measure"); one run makes the film bible,
the other compares the crops to the film.

1. **Reference, live means**
   ```
   npm run style:measure -- --ref "Y:\NewVideoTest\out\claude-pop.mp4" --camera \
     --out build/identity/acceptance/reference-film
   ```
   Asserts: 1920×1080, 30 fps, 156.6 s, 4,698 frames; luma 100.88 ± 0.5;
   saturation 21.83 ± 0.5; edges 12.57 ± 0.5. Records camera (moving 26%) as
   evidence, **does not band it**.
2. **Reference vs crops, palette**
   ```
   npm run style:measure -- --ref styles/paper-kpop/references/frames \
     --specimen "Y:\NewVideoTest\out\claude-pop.mp4" \
     --out build/identity/acceptance/reference-match
   ```
   Asserts `specimen.luma.mean` 100.88 ± 0.5, `specimen.saturation.mean`
   21.83 ± 0.5, `specimen.edges.mean` 12.57 ± 0.5, `delta.palette` **48.28 ± 2**.
   Asserts **the reference fails 4/5 surface bands** and passes the live film
   bands (luma mean/p5/p50/p95, contrast p5, saturation/p95, edges, palette). The
   script applies `checkFilmBands` to the `specimen` metrics directly; it does not
   run `style:identity` on the reference (there is no score). The composition
   bands (height sd 21.8, centroid share .82, local 46.62, bars 0, blue-on-blue
   1 frame) are asserted from the §4.1 fixture, not the live command;
   `style:measure` does not measure them. The reference's `cuts`/`shots` are
   **not asserted** (trap 9).
3. **Uber, live video**
   ```
   npm run style:identity -- films/uber-model/score.json --video \
     --out build/identity/acceptance/uber-video
   ```
   Asserts exit 1, `mode:"video"`, `videoHash` = the film's hash, and the
   findings include each named axis:
   `identity:side-bars` (19.0 / 19.5, max 22.1),
   `identity:centroid-x` (median .1365, 0/10 in band),
   `identity:height-rhythm` (sd 0, 1 tier),
   `identity:local-contrast` (p50 12.6 on tiles / 10.4 on video; only 20% of
   shots reach 20),
   `identity:blue-on-blue` (7/10 tiles; 25/30 frames),
   `identity:motifs` (0 declared),
   `identity:field-script` (no palette script; 1 field colour measured).
   Asserts **no `identity:surface` finding** and that the surface deltas are
   −0.99 / −17.99 / −4.15 / +0.10 / 42.95.
4. **The instrument check** (the guard the spec did not have)
   ```
   npm run style:identity -- films/uber-model/score.json --frames \
     --out build/identity/acceptance/uber-frames
   ```
   Asserts the report on `build/uber-model/collage/frames` reproduces the
   published I-frames tile values: centroid .1365 ± .01, height 57.78 ± 3,
   bars 19.0 / 19.5 ± 1, local p50 12.64 ± 2, blue-on-blue **7/10 exact**. If
   this fails, the new instrument is not measuring the same thing as the
   research and the bands are not comparable. **Stop, do not tune the band.**

### 5.2 Assertions (one table, printed by the script)

| # | Half | Assertion | Pass |
|---|---|---|---|
| A1 | reference | luma / sat / edges reproduce | ±0.5 each |
| A2 | reference | palette distance vs crops | 48.28 ± 2 |
| A3 | reference | every declared film band with a ref value | inside |
| A4 | reference | surface bands | **fails exactly 4/5** (edges passes) |
| A5 | Uber | surface bands | **0 findings** |
| A6 | Uber | named gap axes | all present (§5.1.3) |
| A7 | Uber | bars / centroid / local / blue-on-blue | ±1 pt / ±.01 / ±1 / exact count |
| A8 | Uber | no film finding outside the ledger | 0 unknown codes |
| A9 | instrument | 10 tiles reproduce I-frames | §5.1.4 |
| A10 | both | video/score/rules hashes recorded | non-null |

The asymmetry is the test: A3+A4 are the reference side, A5+A6 the Uber side.
If either side is skipped, the script exits **2**, not 0.

### 5.3 Exit codes and evidence

- **0** — both halves ran and every assertion held.
- **1** — an assertion failed; print the axis, the value, the band.
- **2** — an artifact is missing (`out/claude-pop.mp4`, the Uber MP4, the
  collage). **Not a pass.** The message names the missing file.
- Writes `build/identity/acceptance/acceptance.json` and `REPORT.md` with the
  reference sha256, the Uber video hash, the score hash, the identity hash, the
  four measurements and a three-column table (axis · reference · Uber). A
  non-programmer can read `REPORT.md` and see the sign.

### 5.4 What the reference cannot prove

The reference has no score, so it cannot prove motifs, performance, the field
script or the cast archetype. Those are **claim** checks with no reference side;
the script prints them as `unverified (no score)` and does not count them as
passing. The reference's composition values (height sd 21.8, centroid share .82,
local 46.62) are fixtures from `I-frames.json`, not a live report. If a later
version can run the frame report on a score-less video (using the 54 annotated
boundaries), the fixtures can be replaced; that is P1, not this plan.

---

## 6. Test files

| File | Status | Tests | Covers |
|---|---|---|---|
| `test/identity-schema.test.ts` | new | ~14 | S1–S12, L1–L10: pack schema, score schema, library, creature, thumb, forbidden ownership |
| `test/identity-bands.test.ts` | new, **replaces** `test/style-identity.test.ts` | ~10 | B1–B14: reference/Uber ledger, surface vs film, null, boundaries, palette direction, blue-on-blue, local measure, edit ownership |
| `test/identity-report.test.ts` | new | ~12 | B15–B18 + D1–D6 + G1–G12: synthetic grid, rollups, determinism, evidence gate |
| `test/identity-claims.test.ts` | new | ~10 | C1–C14: performance, motifs, variation, forbidden, claim vs paint |
| `test/preflight.test.ts` | modified | +3 | E1–E3: `tokens.identity.edit` (median 2.86 pass, 3.4 fail, 25 cuts/min fail) |
| `test/style-check.test.ts` | modified | +3 | opt-in pack with no block fails; valid pack passes; watercolor without opt-in passes |
| `test/style-identity.test.ts` | **deleted** | −5 | its API is gone; the cases are subsumed by `identity-bands` |

Roughly **+52 tests, −5 old**, total ~523. All are pure; the suite stays under
10 s. No test opens ffmpeg, a video or a browser. The slow proof is the script.

**Names that matter** (the three in §9 are among them):

- `the reference film passes every declared film band and the Uber film fails every declared gap band`
- `a missing, null or NaN measurement is a finding, never a pass`
- `the Uber tile report reproduces the published 57.78 / .1365 / 19.0 / 19.5 / 12.64 / 7-of-10`
- `a score claim the paint does not show is refused`
- `a frames-mode report cannot satisfy the video gate`
- `the palette distance is crops to film, not film to crops`

---

## 7. Commands, CI and `film:chain`

### 7.1 `package.json`

Add one script; keep the existing one:

```json
"style:identity": "tsx scripts/style-identity.ts",
"identity:accept": "tsx scripts/identity-acceptance.ts"
```

Do **not** add `test:identity` (the `npm test` glob covers it) or a second
`style:measure` wrapper.

### 7.2 `film:chain.mjs`

Three explicit identity steps, at the three moments the evidence changes:

| After | Step | Why |
|---|---|---|
| `audit` | `style:identity -- <score> --claims` | score/library/motifs/performance/forbidden; < 1 s; refuses the Uber failure mode before any frame is painted |
| `collage` | `style:identity -- <score> --frames` | writes the report `render:film` already requires; the collage frames are the specimen |
| `deliver` | `style:identity -- <score> --video` | writes the report `gate:7` requires; tied to the delivered hash |

`render:film` keeps its current refusal: a `frames` report with the current score.
`gate:7` accepts only a `video` report with the current score, video, identity
hash and version. `film:review --gate --reuse` may print the video report only
when those four ties hold.

Cost: claims < 1 s, frames ~10 s, video ~30 s on the Uber film. Against a ~12 min
chain that is 0.5%; it removes the manual `style:identity` run that the Uber film
needed.

### 7.3 CI

`.github/workflows/ci.yml` adds:

```yaml
- run: npm run style:check -- styles/paper-kpop
```

The acceptance is **not** PR CI. `out/claude-pop.mp4` is 289 MB and outside the
repo; a CI job that "skips when absent" is a silent pass. The unit ledger and the
Uber fixture verdict run in CI on every PR through `npm test`; the live Uber video
half and the reference half run in `npm run identity:accept` on the machine that
holds the reference, as a release gate. Attach
`build/identity/acceptance/REPORT.md` to the PR.

### 7.4 Runtime budget

| Step | Budget |
|---|---|
| `npm test` | 9–10 s (was 8.9 s) |
| `style:check` paper-kpop | < 5 s |
| `identity:accept` full | 3–6 min (reference `--camera` over 4,698 frames) |
| `film:chain` identity steps | +40 s on 30 s; +90 s on 60 s |

---

## 8. Architecture review: keep, cut, park

The spec's §8.2 says "nine fields, no new tool". The critiques say that is not
true: the named gaps need a frame report. Both are half right. The table is the
line I would draw.

### 8.1 Keep (do not let these be cut)

| Keep | Why |
|---|---|
| `bands` (surface) + `filmBands` (film) | the only fix for "the reference fails its own gate"; the reference fails 4/5 surface bands by 44.9/30.4/18.0/3.3 |
| every band carries statistic/basis/owner/gap | otherwise a mean is compared to a p5 and no one can tell |
| the frame report | bars, centroid, height sd, local contrast and blue-on-blue have no other instrument |
| the **probe subject box** | the research's own note says colour-region detection merged figure/props or lost a blue figure in a blue bar; the painter knows the anchors. This is the one painter change worth its ownership cost |
| the inside-box local contrast | the ring measure reports −150 on the Uber film; 12.6 is the honest number |
| evidence tied to score + video + rules + version | 0033; a band change must invalidate the report |
| null-is-failure | the current code returns on null (`style-identity.ts:111`) |
| claims vs paint | the Uber film passed 24 checks because every check read a claim |

### 8.2 Cut

| Cut | Why | Replaced by |
|---|---|---|
| 3×3 region grid | nine numbers with no owner or band; not the bar/local instrument | column bars + inside-box ring |
| `cast.silhouette` numeric bands (head 22–28%, boot 8–12%, …) | no probe; would need the painter to publish 8 more numbers | library declaration + `audit:body` |
| `performance` audience/spotlights/formation/detail share | unmeasurable and not a named gap | mode, star, entrance, exit, signature |
| `identity.tone` machine check | human | one `sign:"human"` line in the report |
| 12-axis variation | needs a history file nobody maintains | 3 report-only axes (opening, closing, motif set) |
| `opening`/`closing` frame detection | `visual:check` already refuses the default opener | keep visual:check |
| drawn-motif detection | no instrument; a motif is a semantic judgement | declared motifs + counts + human sign |
| `forbidden` as 45 checks | the other 32 belong to camera/type/rig/motion/sound/licence | one ownership map; identity checks only the subset it can measure (dissolve, 3D/gloss/bevel/DOF, bars, cream plate, blue-on-blue, archetype, same opener/closer/motif set) |
| `camera.keys` / camera travel bands | `camera:check` owns them; the reference fails its own 90% target | camera:check |
| `edit` in the identity report | preflight owns the cut; a video scene detector reads 90.8/min on the reference | `tokens.identity.edit` read by preflight |
| a new `identity.json` | spec §4.5 says no | `tokens.identity` |
| the `H` scope code | a new taxonomy for one boolean | `sign:"human"` per field |
| per-field `basis` objects on the surface block | all five are the same basis | one `basis:"crops"` at block level |

### 8.3 Park (not this change)

- A frame report on a score-less video (would let the reference prove its own
  composition, not just its means).
- 9:16 composition bands; do not crop the 16:9.
- A semantic archetype check; the library declares, a human signs.
- Motif drawn-detection; the sheet and the director.
- The 45-id forbidden catalogue as live checks for the other commands; the
  ownership map is the contract until each command reads its own ids.

### 8.4 The one risk that can stop the plan

The probe subject box is a **painter change** in `styles/**`, which is
creative-owned. It is instrumentation (an anchor extent), not a palette, shot or
recipe. It needs a `contract-change` PR with both owners. If it is refused, the
fallback is an authored `shot.subjectBox` per shot (10 boxes) signed by the
director, with `box:"authored"` in the report. The bands still work, the
instrument check still compares to I-frames, but the gate must say **human
signed**, not **paint measured**. Do not fake a pixel detector to avoid the
conversation; the research already tried and failed.

---

## 9. The 9/10 bar: three tests the current 476 would miss

### 1. `the reference film passes every declared film band and the Uber film fails every declared gap band`

One parameterised test over the §4.4 ledger, plus a completeness assertion that
reads the real `tokens.identity` band paths.

**Regression it catches:** a band calibrated to the crops, or a "gap" band that
Uber passes (largestFlat, blueShare, height, cuts), or a band the reference fails
(warm p25, hard cuts, iris, centroidY). The current suite has no reference
fixture at all; `test/style-identity.test.ts` uses invented bands and deltas, so
it would pass a gate that refuses the reference and accepts Uber.

### 2. `a missing, null or NaN measurement is a finding, never a pass`

Loop every numeric band, replace it with `null` / `NaN` / `undefined`, assert
`identity:unmeasured` with the field name.

**Regression it catches:** `src/engine/style-identity.ts:111` returns silently on
`null`. A failed `style:measure` that writes a `match.json` without `contrast`
passes today. No current test passes a null; every fixture is a number. This is
the exact silent-pass class that 0037 and the blank-frame audit were written to
kill.

### 3. `a score claim the paint does not show is refused`

A score that declares `framing:"close"` but measures 18% height, or cast in 10/10
shots but has 0 probe boxes, or `field:"cobalt"` on a cream plate, must fail
`identity:claim`.

**Regression it catches:** the Uber film's 24-check pass. `stagedRatio` today is
`score.shots.filter(direction.cast.length > 0)`, a score claim; every old test
validates declarations against schemas, never a declaration against a
measurement. This test is the difference between "the film says it is the
channel" and "the film is the channel".

---

## 10. What this plan does not do

- It does not implement the painter box, the frame report or the pack block.
- It does not touch the 45 forbidden ids beyond the ownership map.
- It does not test the reference's R values as bands (54 field colours, 94% hard
  cuts, 20% iris, p25 warm .24, centroidY min .24).
- It does not test 9:16, music, tone, "is the joke funny" or "is the character an
  idol". Those stay human signs; the report prints them so they are not mistaken
  for machine passes.
- It does not add a new dependency. Everything is `node:test`, `node:assert`,
  the existing ffmpeg path and the existing JSON reporters.

---

## Appendix A — the current test tree (45 test files + 1 helper, 476 tests)

```
asset-catalog      audit              board              camera-plan
captions           cast-rig           collage            contracts
cut                determinism        film               film-new
frame-audit-split  grid               library            manifest
mix                motion             painter-history    paint-purity
paper-kpop-0.2.0-gate  paper-kpop-gate  plan            preflight
reaction           review-reuse       rig                rig-drift
sampling           scenes             score-data         sfx
sheet              story              style-check        style-geometry (helper)
style-identity     style-measure      style-sheet        treatment
visual             voice              voice-activity     watercolor-0.2.0-gate
watercolor-gate    words
```

`style-geometry.ts` is a helper, not a test file; the 45 count is the `.test.ts`
files (46 files in `test/`). New files in §6 slot beside `style-identity`
(replaced) and `style-measure`; no test area is duplicated.
