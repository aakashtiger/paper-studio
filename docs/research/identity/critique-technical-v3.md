# Technical critique — Paper K-pop identity specification v1.2 (third pass)

**Critic:** technical architect + QA
**Subject:** `KPOP-IDENTITY.md` (header still says v1.1) and `kpop-identity.proposed.json` v1.2.0
**Previous:** v1.0 **5/10** NO; v1.1 **6/10** NO
**Date:** 4 November 2026
**Score:** **6.5 / 10 implementability · 6.5 / 10 evidential honesty**
**SIGN:** **NO**

I read the two v1.2 documents, the four earlier critiques, `tokens.json`, `treatment.ts`, `camera-check.ts`,
`type-audit.ts`, `palette-audit.ts`, `style-measure.ts`, `style-identity.ts`, `paint-probe.js`, `camera.ts`,
`capabilities.json` and `build/research/claude-pop/bible.json`. I ran a Node validation over the JSON
(required paths, ranges, duplicate values, the 30/45/60 arithmetic, the distribution feasibility) and
checked every band against the reference measurements. No repository file was changed except this critique.

---

## 0. Verdict

v1.2 is the first revision where the arithmetic is mostly right and the film bands are in the machine file.
The three short-format rows now satisfy their own cut rate, the hero band no longer exceeds the subject
height, `identity.bands` and `identity.tones` exist, the required list exists, and the new axes
(performance, silhouette, stage roles, 12 variation axes, 9:16 bands, match-cut tolerances) are named. A
developer reading v1.2 can see where most of the work goes. That is real progress and it should not be undone.

But the things that decide whether a film passes did not move:

1. **The band block cannot be read without guessing its population.** `identity.bands` mixes film means,
   per-shot ranges and share thresholds under one `basis: "film"`. The reference passes if you read the
   percentile/share bands as film means and 75%-of-shots rules; it fails if you read them as per-shot
   minima (saturation p5 4.9, edges p5 3.7, warm p25 0.24, local contrast p10 18.0).
2. **The instruments still see the wrong thing.** The probe records text boxes, leg solves, limbs and
   anchors, not a drawn bbox or a silhouette. A 3×3 region grid cannot see an 8% side bar, a 46.6 ring or
   a field component. The new required `cast.silhouette` has no instrument at all.
3. **The signed pack reversals still ship as `I`.** Camera moves/shake/travel, seven colour roles, seven
   cast, and the 31 px television type scale still contradict the signed 0.2.0 pack. v1.2 adds more camera
   vocabulary, so this reversal is now larger, not smaller.
4. **The reference acceptance test still cannot run**, and the "surface bands" it promises do not exist.
5. **One arithmetic rule is impossible for every short format:** `edit.distribution.under1 [0.02, 0.04]`
   cannot be met by a 10–13, 14–18 or 18–23-shot film.

The result is a better proposal and still not a gate. A film that follows v1.2 as written still fails the
pack on type, colour, cast and duration; a film that follows the pack fails v1.2 on the same axes.

---

## 1. P0 ledger — the v1.1 blockers, checked

| # | v1.1 blocker | v1.2 state | Exact field / evidence |
|---|---|---|---|
| **B1** | Record shape, and `bands`/`tones` missing | **PARTIAL** | `identity.bands` (17 values) and `identity.tones` (5 value keys) are in the JSON; `required` names both. But `tones` is a **5-key duplicate** of `bands`, there is no `statistic`/`share`/`when`, and the block is named the same as the existing delta block `tokens.identity.bands` — so copying it in silently disables the five-band check (§2.2, §2.3). |
| **B2** | The instruments | **NOT FIXED** | `checks.probe` still says "paint probe records a character bbox (min/max of rig anchors) and a field/ring sample". The probe records `__textBoxes`, `__rigRecords` (solve/limb/anchor) and nothing else (`paint-probe.js:4-7,106-180`). `checks.frames` still says "3×3 region grid"; `style-measure` already computes p5/p50/p95 but `compareMetrics` only reads means (`style-measure.ts:20-23,527-540`). The new `cast.silhouette` is required and has no instrument. |
| **B3** | Signed pack reversals | **NOT FIXED, larger** | Camera: JSON 11 moves (`static, push_in, pull_back, crash_zoom, pan, tilt, track, orbit, whip, handheld, world`), `shakePx [0,12]`, `pushDz [0.03,0.25]`, `anchor [960,540]`; `tokens.motion.camera.moves` has 5, `src/core/style.ts:61-69` has 7, `STYLE.md:62` says 6 and `:87` says "No … camera shake". Type: 6 families vs the pack's 4. Colour: 7 long / 5 short vs `maxColours: 4`. Cast: 7 vs `maxCast: 2`. Duration: 156.6 vs `[30,45,60]`. |
| **B4** | Pass/fail arithmetic | **MOSTLY FIXED** | 30 s **10-13** → 18-24 cuts/min; 45 s **14-18** → 17.3-22.7; 60 s **18-23** → 17.0-22.0. All correct now (§3.1). Hero **1.10-1.25 × 580-760 = 59.1-88.0%**, inside 13-92. Inset **0.24 × 580 = 12.89%**, still 1.2 px below 13. Words **85-95** still exceed the 87.1 ceiling. The distribution `under1` is impossible for all three short formats (§3.2). |
| **B5** | Reference and acceptance test | **PARTIAL** | The expected Uber failure list is now **7** in both MD and JSON (was "exactly 5" vs "at least 7"), which is a real fix. But the reference still has no score in the repo, `reference.film` is still `Y:\NewVideoTest\out\claude-pop.mp4` with no `sha256`, `checks.acceptance.reference` points at `out/claude-pop.mp4` which does not exist under the repo root, and the surface bands (paper, halftone) do not exist. |

**Tally: 1 mostly fixed (B4), 2 partial (B1, B5), 2 not fixed (B2, B3).** The QA ledger is similar:
the shadow measure is fixed (schema/human), and QA-N3 is mostly fixed (`bands`, `tones`, `field` are now
inside `identity`); the percentile-as-invariant, the instrument gap, the 31 px conflict, the null pass and
the transition taxonomy are not.

---

## 2. JSON validation

### 2.1 `required[]` — all paths exist, but it is not the right list

All **10/10** paths resolve:

```
identity.bands               object
identity.tones               object
identity.field               object
identity.composition         object
identity.cast.archetype      string
identity.cast.silhouette     object
identity.performance         object
identity.edit                object
identity.motifs              object
identity.forbidden           array (45)
```

The paths exist; the list is wrong in three ways.

1. **It is not the §4.3 nine.** §4.3 names `tokens.identity.referenceFilm`, `bands.basis`, `tones`,
   `field`, `composition`, `edit`, `cast.archetype`, `motifs`, `forbidden`. `required` omits
   `referenceFilm` and `bands.basis` — the two fields that fix the crops-vs-film miscalibration — and adds
   `silhouette` and `performance`, which are new in v1.2 and unmeasurable. A pack can have `identity.bands`
   with no `basis` and an absolute `reference.film` elsewhere and still pass.
2. **It omits the load-bearing blocks.** `identity.camera`, `identity.type`, `identity.sound`,
   `identity.variation`, `identity.cast.performerTest`, `identity.cast.joints`, `identity.cast.heightUnits`
   are not required. A pack could drop the camera grammar, the type role map, the sound mode and the
   variation axes and still satisfy `required`. The camera is where the signed reversal is largest; the
   type is where the 31 px conflict lives; the variation axis is the anti-copy engine.
3. **It requires a duplicate.** `identity.tones` is five values copied from `identity.bands` (§2.2). A
   required list that mandates a copy is a drift generator the first time one value changes.

**Fix:** ten paths is the right size. Make them `identity.bands` (with `basis` + `statistic`),
`identity.field`, `identity.composition`, `identity.edit`, `identity.cast` (archetype + performerTest +
silhouette), `identity.performance`, `identity.camera`, `identity.type`, `identity.motifs`, `identity.forbidden` —
and either fold `tones` into `bands.surface` or drop it.

### 2.2 Bands and tones — present, calibrated, and still unreadable

The values are in the JSON and they are the §5.3 film values. That is the best addition in v1.2. Against
`bible.json` they pass the reference **as film statistics**:

| Band | JSON | Reference | Pass as film mean/median | Pass as per-shot |
|---|---|---|---|---|
| luma mean | 75-130 | 100.88 | yes | — |
| luma p5/p50/p95 | 20-60 / 80-140 / 160-200 | 39.34 / 98.74 / 175.44 | yes | yes (it is a percentile) |
| contrast p5 | 175-210 | 190 | yes | yes |
| saturation | 12-35 | mean 21.83, **p5 4.90** | yes | **no** (p5 is 4.9) |
| saturation p95 | 30-60 | 44.61 | yes | yes |
| edges | 7.5-17.5 | mean 12.57, **p5 3.70, p95 24.91** | yes | **no** (both tails) |
| palette distance | ≤55 | 48.3 | yes | — |
| warm share | 0.40-0.90 | median 0.70, **p25 0.24** | yes | **no** |
| blue share | 0.00-0.20 | median 0.01, **max 0.46** | yes | **no** |
| subject height | 0.13-0.92 | 12.96-91.85 | — | yes (at the edge) |
| centroid x | 0.30-0.75 | p10 0.33, p90 0.69; the two left-edge shots are deliberate | yes | **no** (2/49) |
| local contrast min/median | 20 / 35 | **p10 18.04**, p50 46.62 | median yes | **min no** (10% below 20) |
| cuts/min | 18-24 | 19.2-20.3 | yes | — |
| median shot | 2.4-3.2 | 2.86-3.06 | yes | — |

The same block contains **film means** (`lumaMean`), **film percentiles** (`lumaP5`), **per-shot ranges**
(`subjectHeight`, `centroidX`), **per-shot thresholds with a share in the prose only**
(`localContrastMin` 20 "in 75% of shots"), and a **distance to the crops** (`paletteDistanceMax` 55) under
one `basis: "film"`. The key names are inconsistent: `lumaMean` says mean; `saturation` and `edges` do not,
and if a reader treats them per-shot the reference fails at p5 (4.9) and at both edge tails (3.7/24.9).
`warmShare` and `blueShare` are film medians only by the prose; `blueMedianMax 0.05` in `palette` is the
median, while `blueShare [0,0.20]` is the film-wide share. A checker must guess which statistic each key is.

**`tones` is a 5-key copy of `bands`.** `lumaP5`, `lumaP50`, `lumaP95`, `contrastP5`, `saturationP95` are
identical in both blocks. The only difference is the `source` string and a `note`. The note says "use the
film for tones, the crops for surface" — but the **crops are not in the JSON at all**. The crop values
(145.8 luma, 245.8 contrast, 39.8 saturation, 10.3 edges) live only in the MD §5.2 and in the `tones.note`
as text. `reference.surfaceReference` is a folder path, not a band. So the "two references" are still one
set of numbers, twice.

**Fix (small):** make `bands` the film block and `tones`/`surface` the crop block with the four crop means
and `basis: "crops"`; add `statistic` (`mean|median|p5|p95|min|max`) and `share` (0-1) only to the values
that need them; rename `saturation` to `saturationMean` and `edges` to `edgesMean`, matching `lumaMean`.
That is ~15 lines, not a leaf schema.

### 2.3 Duplicates and contradictory values

The v1.1 list of 13 concept pairs survives, plus one new pair from the silhouette block. The top of the
list, with both paths:

| Concept | Path A | Path B | State |
|---|---|---|---|
| field share | `field.share [0.18,0.60]` | `palette.fieldShare [0.18,0.60]` | identical |
| largest flat | `field.largestFlat [0.04,0.46]` | `palette.largestFlat [0.04,0.46]` | identical |
| edge bar | `field.edgeBarMax 0.08` | `composition.edgeBarMax 0.08` | identical |
| horizon | `field.horizonPx [780,900]` | `sets.horizonPx [780,900]` | same numbers, different shape |
| cast feet | `composition.castFeetY [1000,1012]` | `sets.feetPx [1000,1012]` | same numbers, different shape |
| object edge | `light.objectEdgePx [1.5,4]` | `edge.objectPx [1.5,4]` | identical |
| grip | `props.gripPx 11` | `interaction.gripPx 11` | identical |
| motif recurrence | `props.motifRecurrence 3` | `motifs.uses [2,5]` | **2 uses allowed and refused** |
| hold | `edit.holdMaxS 0.4` | `motion.freezeBudgetS 0.4` | identical |
| creep | `camera.holdCreep 0.0002` | `motion.holdCreep 0.0002` | identical |
| overshoot / squash / anticipation | `movement.*` | `motion.*` | identical blocks |
| **hand** | `cast.hand.widthRatio [0.013,0.037]` | **`cast.silhouette.handPct [0.03,0.04]`** | **new, conflicting** |

The hand pair is the v1.2 regression. The library hand is 18 px wide; at a 700-unit character that is
**2.57%** of height. It passes `cast.hand.widthRatio` (1.3-3.7%) and **fails** `cast.silhouette.handPct`
(3.0-4.0%). It passes the silhouette only at heights **≤600 units** (18/0.03 = 600), while the declared
height class is **580-760**. Two bands for one object; one must go.

The silhouette vertical segments also do not sum to one body: head+ornament `0.22-0.28`, torso `0.30-0.35`,
legs `0.35-0.40` give **0.87-1.03**. The 13% minimum gap is a neck/hip band the record does not name; the
3% maximum overlap is not declared. A checker summing the three will pass a body with 13% missing.

The `bands` block itself duplicates **14 values in 8 pairs** with `palette`/`composition`/`edit`:
`subjectHeight`, `centroidX`, `warmShare`, `blueShare`, `localContrastMin`, `localContrastMedian`,
`cutsPerMinute`, `medianShotS`. `tones` adds **5 more**. The `required` list includes `bands` and `tones`,
so the duplication is mandatory. One path per concept, as §4.2 says, applies to the new block too.

### 2.4 Markdown vs JSON — the prose is still v1.1

| Item | Markdown | JSON | Verdict |
|---|---|---|---|
| Version | `v1.1` (header, line 1; revision line 4) | `1.2.0` | stale; the prose does not describe the v1.2 machine values |
| 9:16 platform bands | absent (`1330`, `168`, `platform` not found) | `size9x16.platformBands {topEmptyPx 168, copyTopPx 168, copyBottomPx 1330, decorationBelowPx 1330}` | JSON-only, unexplained |
| Forbidden count | 20 numbered rules (§3.25) | 45 ids | no mapping from rule to id; the prose cannot explain the 45 |
| Performer test | "seven-point" with 7 items (§3.9) | `performerTest` has **6** entries | the stage role is folded into item 2; the prose still says seven |
| Stage role names | "lead, backing, foil, creature or host" (§3.9.2) and "the star, the foil, the chorus, the creature, the host" (§3.9.7) | `["star","backing","foil","creature","host"]` | **three names for two roles**: lead/star, backing/chorus |
| Camera anchor | "moves about a declared focus point" (§3.14) | fixed `anchor [960,540]` | the focus is the frame centre, not per shot |
| Match-cut tolerances | "silhouette, scale, orientation and direction" (§3.17) | `silhouetteIou 0.80`, `scaleRatio [0.90,1.11]`, `angleDeltaDeg 5`, `directionDot 0.90` | JSON-only, no instrument |
| Status | `"research"` (§4.1 example) | `"research-proposal"` | unchanged from v1.1 |
| Frames | 4,699 (header) | 4,699 (`reference.frames`) | `bible.json` says **4,698**; 156.63 × 30 = 4,698.9 |
| Duration | 156.63 (header) / 156.62 (§3.15) / 156.60 (cards) | 156.63 | three values, no rounding note |
| 9:16 scale | prose says use the pack's mobile scale | the five `size9x16` sizes are identical to `layout.aspectScale["9:16"]`; `floorPx` and `platformBands` are the additions | duplicate; the platform bands are the only new value |
| `required` vs §4.3 | §4.3 names `referenceFilm` and `bands.basis` | `required` omits both | the minimal set is not the required set |

The version mismatch is not cosmetic. The prose is the explanation a non-programmer reads; it does not
mention the platform bands, the fixed anchor, the match-cut numbers, the 45-item list or the silhouette.
The JSON is the contract a developer reads; it has values the prose cannot explain. One of the two has to
be brought forward.

---

## 3. The arithmetic, re-run

### 3.1 What v1.2 fixed — say it plainly

`cuts/min = (shots − 1) / (duration / 60)`:

| Format | Shots | Computed cuts/min | Band | Verdict |
|---|---|---|---|---|
| 30 s | 10-13 | 18.0-24.0 | 18-24 | **fixed** |
| 45 s | 14-18 | 17.3-22.7 | 17-23 | **fixed** |
| 60 s | 18-23 | 17.0-22.0 | 17-22 | **fixed** |
| 156 s | 48-57 | 18.1-21.5 | 18-22 | inside |

Hero: `1.10 × 580 = 638 px = 59.1%`, `1.25 × 760 = 950 px = 88.0%`, inside the 13-92% subject band.
The v1.1 systematic error at the low end of all three short rows is gone. The hero/inset pair is no longer
four different bands (the v1.0 C10/C11); it is one ladder. That is the largest single improvement in v1.2.

### 3.2 What is still wrong — the contradictions that decide pass/fail

**C1. `edit.distribution.under1 [0.02, 0.04]` is impossible for every short format.** A share of 2-4% of
10-13 shots is 0.2-0.5 shots; the smallest non-zero share is **1/13 = 7.69%** (30 s), **1/18 = 5.56%**
(45 s), **1/23 = 4.35%** (60 s). Zero is 0%, below the 2% floor. So no integer count satisfies the band.
It is satisfiable only for 48-57 shots (1/57 = 1.75%, 2/57 = 3.5%). The distribution is a 156 s band wearing
an `I` scope; a 30 s film is judged by it and fails. **Fix:** make the distribution format-keyed (or delete
it and keep median/p10/p90/max, which are already there).

**C2. 85-95 words still exceeds the 1.0 s head + 1.5 s tail.** The speech window is 27.5 s; at 180-190 wpm
that is **82.5-87.1 words**. 95 words at 190 wpm runs 30.0 s (no tail); at 180 wpm it runs 31.7 s (past the
film). 95 passes `wordsPer30s` and fails `lastWordS 1.5`. The exact ceiling is **87**. The MD §3.22 already
admits "85-90 if the last word must land before the end", but 90 at 190 wpm is 28.4 s, a 0.6 s tail — still
below 1.5. The band must be `[85,87]`, or `lastWordS` must be 0.5, or the word band must go and the clock
must be wpm + coverage + first/last word.

**C3. Inset 0.24 is 12.89%, below the 13% floor.** `0.24 × 580 = 139.2 px`; `0.13 × 1080 = 140.4 px`. The
gap is **1.2 px**; it only bites at the smallest character and the smallest inset, but a strict checker
fails that corner. **Fix:** `0.245` or `subjectHeight` min `0.128`. This is a one-line fix, not a reason
to reject the ladder.

**C4. `performance.stageShareMin 0.30` contradicts its own note.** 30% of a 10-shot 30 s film is **3 shots**;
the note says ">=1 stage shot for a 30 s film" (10%). A film with one stage shot passes the note and fails
the value. The MD §3.30 has the same two rules in one cell. **Fix:** one rule — either 30% for a song film
and no separate 30 s clause, or 1 stage shot for a 30 s film and no 30% floor.

**C5. The 9:16 platform band contradicts the pack's 9:16 caption anchor.** `copyBottomPx 1330` means
nothing below 1330 px is copy, but `tokens.layout.aspectBoxes["9:16"].caption.y = 0.82` is **1574 px**, and
the lyric box at 0.86 is **1651 px**. A 9:16 film that follows the pack puts its caption in the new
"decoration" zone. Either the pack's 9:16 anchors move up (a contract change) or the platform band is
wrong. This is new in v1.2 and it is not in the prose.

**C6. The 16:9 type scale still contradicts `audit:type`.** The pack's copy floor is `type.scale.label` 14
at 390 → **68.9 px** at 1920 (`type-audit.ts:44-53,120-123`); the pack's caption 18 → **88.6 px**, body 26 →
**128 px**, monogram 36 → **177 px**. The identity's 16:9 scale is subtitle **31**, body **44-84**, label
**7-18**, monogram **72-160**. Four of five roles fail the pack's own scale. The 9:16 block matches the pack
(16/24/14/32); the 16:9 block matches the reference television. A 16:9 film cannot satisfy both. **Fix:**
choose the pack's 16:9 scale (or change the pack's scale and the audit; that is a contract change).

**C7. Three colour caps and no minimum.** `maxRolesLong 7`, `maxRolesShort 5`, `tokens.color.maxColours 4`.
A 5-role frame passes the identity and fails the pack; a 1-role frame passes all three because there is no
minimum. The MD §3.3 says "4-7 roles" and "the pack should be reconciled to one cap" — it names the
problem and does not decide it. **Fix:** one cap (4 signed, or 7 with a new painter budget and a new
STYLE.md) plus a minimum (3 or 4), enforced by a per-frame role count.

**C8. The cast limit is still 7 vs 2.** `principals [1,2] + chorus [0,5] = 7 = totalMax`; `capabilities.limits.maxCast 2`
and `tokens.identity.cast.max 2`; `style-identity.ts:73-78` reads the token, so a 7-cast film fails today.
The `performance` block now makes chorus a first-class rule (`chorus [0,5]`), so the 7 is no longer a
corner case. **Fix:** one public limit in `capabilities.limits.maxCast`, read by `resolveFilm`; if chorus
is real set it to 7, otherwise keep 2 and delete chorus.

**C9. The reference still fails its own transition bands.** `hardCutShare 0.80-0.90` vs **50/53 = 94.3%**;
`iris.share 0.08-0.15` vs **10/51 = 19.6%**; `flash.share 0.00-0.08` vs **14/50 = 28%** (opening flashes) or
**38/51 = 74.5%** (all calls). The §5.5 acceptance test says the reference must pass "the bands"; it cannot.
The "designed transition is a modifier on a cut" definition (MD §3.17) is the right idea, but the bands were
not re-derived from it. **Fix:** hard cut 80-95 (or 100 with the 2 soft + 1 melt declared defects), iris
8-20, flash 0-8 on impacts only, and state the 14/24 split.

**C10. The silhouette hand and the body sum.** `cast.hand.widthRatio [0.013,0.037]` vs
`cast.silhouette.handPct [0.03,0.04]`; the library's 18 px hand at 700 units is 2.57%, passing one and
failing the other. The vertical segments sum **0.87-1.03**, not 1.0. **Fix:** delete `handPct` and use
`cast.hand.widthRatio`; declare the neck/hip gap or make the segments sum to 1.0.

**C11. Display size, 3 lines and the 8-25% area band are not derived from each other.** `display [92,376]`,
`maxLinesDisplay 3`, `displayArea [0.08,0.25]`. A 3-line hook at the top of the size range is far above 25%
of the frame; a 2-line hook at the bottom is below 8%. The JSON has no per-shot display-area instrument, so
the relation is uncheckable. Not a P0 by itself; it becomes one if the type audit starts reading
`displayArea`. **Fix:** state the word count and line count that the area band assumes, or drop the area
band until there is a reader.

**C12. `type.maxWords 8`, `subtitleBox.maxWords 9` and the lyric-wall X ">8 words" still disagree.** A
9-word subtitle is allowed by the subtitle band and is a lyric wall by the X rule. **Fix:** one rule —
8 per slot, 9 only for the subtitle, and the X says ">9 in a subtitle or >8 elsewhere" (the v1.1 wording).

**C13. `negativeSpace 0.97` is a median, not an invariant.** The reference's subject area p90 is 7% and max
8.9%, so negative space is 93% and 91.1% in those shots. A 0.97 invariant fails the reference's larger
subjects. The MD §3.6 says "do not use subject area as a band" and then states 97% as one. **Fix:** add
`share: 0.9` or delete the value.

**C14. `performance.defaultMode: "stage-show"` vs `sound.voiceLedRequires: "presenter-show"`.** Every
narrated film is voice-led; if it does not declare a mode, the default is stage-show, which violates the
voice-led requirement. The default is invalid for the studio's main mode. **Fix:** make the default depend
on `sound.mode`, or drop `voiceLedRequires` to a recommendation.

**C15. The camera block has three unit/grammar contradictions.** `crashMax 8.0` (a scale) vs
`crashDz [0.50,3.0]` (a delta): an 8.0 scale from 1.0 is a 7.0 delta, outside 3.0. `anchor [960,540]` is one
fixed frame-centre for every shot, while the prose says "a declared focus point" — a push on a face at
x 0.65 will zoom the centre and push the face out. `byBeat.release` is `pull_back` in the JSON and `orbit`
in `tokens.motion.camera.byBeat` (line 438) and `src/engine/camera.ts:52-59`. A film using `camera:plan`
gets orbit; a film following the identity gets pull_back. **Fix:** one unit per move, a per-shot anchor (or
derive it from the subject box), and one beat table.

**C16. `framingMix` sums 0.75-1.30, `edit.distribution` sums 0.88-1.15, and the transition components max
0.37 against `designedTransitionShare` max 0.20.** A film can satisfy every band with shares that sum to
0.75, and a designed-transition set of iris 15 + flash 8 + wipe 4 + match 6 + hold 4 = 37% passes the
component bands and fails the 20% total. **Fix:** check the total, or replace each distribution with
median/p10/p90/max.

The pattern is consistent: v1.2 fixed the **first-order** arithmetic (shots vs cuts, hero vs height) and
left the **second-order** arithmetic (shares that must sum, distributions that must be integral, bands
whose source is outside them). The second-order ones are the ones a film actually trips.

---

## 4. The instruments — the five named gaps are still claims

The v1.2 `checks` block is honest that the readers are "proposed". The problem is that the acceptance test
depends on them, and the new required blocks assume them.

| Gap | Claimed instrument | What exists | Can it fail? |
|---|---|---|---|
| **Subject box** | "paint probe records a character bbox (min/max of rig anchors)" | `__rigRecords` has leg solves, limb endpoints and named anchor points; no drawn card bounds, no head top, no sole, no hair extent, no subject id | **No.** A min/max over 8 points under-reports height by the head and feet — the whole 13-92% band. |
| **Field** | "3×3 region grid" | `style:measure` decodes at 320 px and returns global means; no component, no edge-touching region, no horizon | **No.** A 3×3 cell is 640×360 at 1920; an 8% bar is 154 px, and the Uber's 19% wings are two regions, not one. The 3×3 mean dilutes both. |
| **Local contrast** | `localContrastMin 20`, `localContrastMedian 35`, "frame probe" | No figure mask, no ring; `style:identity` reads global `YMAX-YMIN` contrast | **No.** A 46.6 ring is a subject box + a dilated annulus at full resolution. A 3×3 cell is a figure/field blend. |
| **Silhouette** | `cast.silhouette` (new, required) | No silhouette probe; the library has hands and anchors, not segment shares | **No.** It is a declaration. |
| **Blue-on-blue** | `palette.blueOnBlue: false`, `figureBlueMax 0.30`, `localContrastMin 20` | `palette-audit` counts saturated pixels in a hardcoded 70-170° hue band at 160×90; blue is ~220° | **No.** The Uber's 25/30 blue-on-blue frames pass the hue row. The rule is split across three records with no predicate. |
| **Roles** | `maxRolesLong 7`, `maxRolesShort 5` | `palette-audit` has no role assignment; `palettegen` merges 6 colours across frames | **No.** A 1-role frame passes; a 7-role frame passes the identity and fails `maxColours 4`. |
| **Type role/lines/reading** | `type.size16x9`, `maxLinesDisplay 3`, `reading` | `type-audit` checks the 6% safe margin and the 69 px copy floor; no family, role, lines, boxes, systems or reading time | **No.** A 31 px subtitle fails the floor; a 69 px subtitle passes regardless of role. |
| **Camera travel** | `camera.travel`, `anchor`, `seam` | Score `{move, from, to, ease}` only; `camera:check` checks `from !== to` for push/pull and the sign; no x/y/roll; no travel for pan/orbit | **No.** A `pan` with `from 1, to 1.02` passes (it is a 2% push). A `crash_zoom` is an unknown move in the engine. |
| **Motifs** | `identity.motifs`, 3-5, 2-5 uses, ≤40% | No `shots[].motif` in `TreatmentShotSchema`; no paint record; no reader | **No.** A film can declare four motifs and draw none. |
| **Variation** | 12 axes, `historyFilms 3`, `variation:check (proposed)` | No command, no `films/<id>/variation.json`; MD says `build/variation.json`, and `build/` is gitignored | **No.** A three-film history in a generated directory does not exist on a clone or a blind run. |
| **Performance** | `performance` (new, required) | No stage classifier, no cast-role field, no entrance/exit event, no signature-move reader | **No.** `stageShareMin`, `star`, `entrance`, `exit` are declarations. |
| **Forbidden** | 45 ids | No `check` field; `transitionOut` is a free string; `TRANSITIONS` in `src/core/style.ts` still includes `dissolve` and `page_turn`; no reader for `identity.forbidden` | **No.** A dissolve is accepted by the schema. |

Two silent passes are worth naming because they are code, not proposal:

1. **`null` is skipped.** `src/engine/style-identity.ts:110-112` returns on `value === null`; a `NaN` also
   passes (`Math.abs(NaN) > limit` is false). `required[]` catches a missing **path**, not a null **value**.
2. **The new `bands` block would disable the old check.** `style-identity.ts:11-17` types the bands as
   `{luma, contrast, saturation, edges, palette}` and `:112` reads `input.bands[name]`. The v1.2 block has
   `lumaMean`, `lumaP5`, `paletteDistanceMax` — no `luma`, no `contrast`, no `palette`; `saturation` and
   `edges` are arrays. `Math.abs(value) > undefined` is **false**, so every band passes. Copying
   `identity.bands` into `tokens.identity.bands` silently turns the five-band check into a no-op. This is
   the single most dangerous line in v1.2; it is a naming collision, not a measurement.

The one command that would close five of the gaps is not a framework: **a per-shot frame report** with
(a) the subject box from the drawn card bounds, (b) the field as the largest connected near-uniform region
touching both side edges (share, role, horizon), and (c) the ring |ΔL| around the subject box at full
resolution. Sample **three frames per shot**, not every frame: 30 frames for a 10-shot film, not 4,698 × 9
crops. That is one decode and one small function, and it is the difference between the five named gaps
being pictures and being score claims.

---

## 5. The signed pack reversals — v1.2 makes the camera one larger

The identity is still a research file that reverses values the 0.2.0 pack was signed with. The table:

| Concept | Signed pack | v1.2 | Consequence |
|---|---|---|---|
| Camera moves | `tokens.motion.camera.moves`: 5; `CAMERA_MOVES`: 7; `STYLE.md:62`: 6 | **11** (adds crash, track, whip, handheld, world) | a film using the new moves is refused by `camera:check` (unknown move) |
| Shake | `STYLE.md:87`: "No … camera shake" | `shakePx [0,12]`, `shakeRadPerSec [71,63]` | a signed refusal reversed as `I` |
| Push travel | `STYLE.md:62`: "under six percent; a portrait iris or macro prop may push to twelve" | `pushDz [0.03,0.25]` | a 25% push is 2-4× the signed limit |
| Type families | 4 (Anton, Archivo, DM Mono, Permanent Marker) | **6** (adds Instrument Serif, Black Han Sans) | two fonts have no file or licence in the pack |
| Type 16:9 | caption 88.6, body 128, label 68.9, monogram 177 | subtitle 31, body 44-84, label 7-18, monogram 72-160 | four of five roles fail the pack's own audit |
| Colour | `maxColours 4` | **7 long / 5 short**, no minimum | a 5-role frame passes the identity, fails the pack |
| Cast | `maxCast 2`, `tokens.identity.cast.max 2` | **7** (2 principals + 5 chorus) | a 7-cast film fails `style:identity` today |
| Duration | `capabilities.limits.durations [30,45,60]` | **156.6** in `durationFormats` and a 156 s row | the product cannot score the format the identity describes |
| Transitions | `tokens.motion.transitions`: cut, iris, wipe, hold, match_cut; `TRANSITIONS`: adds page_turn, dissolve | **adds flash** | flash is not in either signed list; dissolve is still in the engine while the identity forbids it |

The honest route is the one the v1.0 critique named: release **paper-kpop 0.3.0** with a `contract-change`
PR, a new card, a new seal and a re-run of the gate; or adopt the signed values (6 moves with no handheld/
whip/shake, push < 6%, 4 families, 4 colours, 2 cast, 30/45/60 s, the pack's type scale). A research
document cannot reverse a signed refusal by declaring a new invariant. v1.2 has not chosen, and the new
camera/silhouette/performance blocks make the reversal more visible, not less.

---

## 6. Is block-based JSON acceptable? Yes — with three small additions

**Yes.** The block shape is the right compromise for a proposal. It is readable, it maps to `tokens.json`,
and it avoids the v1.0 failure of 251 leaf records that no command could walk. Leaf-level records would be
over-engineering; do not go back there. The v1.2 JSON is 28 blocks / ~1,314 leaves / 31 KB; a developer can
find a value. The problem is not the shape; it is that ~10 blocks restate an existing source and the blocks
that decide pass/fail have no reader.

The three additions that make the block readable without a leaf schema:

1. **A `statistic` and a `share` on the ~13 distribution bands.** `statistic: "mean" | "median" | "p5" |
   "p95" | "min" | "max"` and `share: 0-1` (the fraction of shots the rule must hold for). This is what
   separates `saturation` (mean 21.8) from `saturationP95` (44.6) and `localContrastMin` (20 in 75% of
   shots). Without it the reference fails its own `saturation`, `edges`, `warmShare`, `blueShare`,
   `centroidX` and `localContrastMin` at the tails.
2. **A `when` on the format/mode rows.** `edit.formats` already carries `scope: T` per row; the
   `distribution` above it does not. `sound.song` is `R`, `voice.songWpm` is `R`; the 16:9 px values need
   `aspect: 16:9` and the 9:16 values are in `size9x16`. One `when` per row (or a format-keyed sub-block)
   is enough; no leaf walker.
3. **A `bands` namespace that does not collide with the delta bands.** Keep
   `tokens.identity.bands = {luma:20, contrast:25, ...}` as the delta check and put the new values in
   `tokens.identity.filmBands` / `surfaceBands`, or make it `bands.delta` / `bands.film` / `bands.surface`.
   This is a one-line rename that prevents the silent no-op in §4.

A pragmatic record example, not a 251-record schema:

```json
"filmBands": {
  "scope": "I", "basis": "film", "measure": "style:measure",
  "lumaMean":   { "band": [75, 130], "statistic": "mean" },
  "saturation": { "band": [12, 35],  "statistic": "mean" },
  "warmShare":  { "band": [0.40, 0.90], "statistic": "median", "share": 0.8 },
  "localContrast": { "band": [20, null], "statistic": "per-shot", "share": 0.75 }
}
```

That is ~15 lines for the 13 values that need it, not 1,314. The rest of the block can stay as bare
ranges, because the key names already carry the operator (`Max`, `Min`, `P95`).

**What to cut, not add:** `medium` (painter constants), `palette.roles/dayStage/nightStage` (byte-identical
to `tokens.color`), `type.families/size16x9/treatment` (the pack owns the type), `sound` (the mix owns it),
`voice` (`story.json`/`preflight` own it), `hud` (reference evidence), `determinism` (`tokens.seed` + 0032),
`props` (`capabilities.assets`), `sets` (the set code). The minimal implementation is ~8 blocks: `bands`/
`surface`, `field`, `composition`, `edit`, `cast`, `motifs`, `performance`, `forbidden`, `variation`. That
is the "nine fields" the prose promises, not the 28 blocks the JSON ships.

---

## 7. The acceptance test — close, still not runnable

The test now names **seven** expected Uber failures in both the MD and the JSON (field, centroid x, height
sd, local contrast, motifs, blue-on-blue, side bars) — that is a real fix from the v1.1 "exactly 5" vs
"at least 7" mismatch. But it cannot run:

1. `style:identity` requires a **score** (`scripts/style-identity.ts:35`); the reference has no score in the
   repo. `build/research/claude-pop/bible.json` is a measurement, not a cut list. `style:measure` without
   `--score` reports **238 shots** on the reference (the 12 Hz boil), so the edit/camera rows are the
   detector's, not the film's.
2. `reference.film` is still `Y:\NewVideoTest\out\claude-pop.mp4`; `checks.acceptance.reference` says
   `out/claude-pop.mp4`, which does not exist under the repo root (the file is `../out/...`). There is no
   `sha256`. `STYLE.md:138` decision *Independence* says "no drive path".
3. `style:identity` reads five global deltas and the cast rule; it has no field, centroid, height, local
   contrast or motif row. The new `bands` block would be read only if the code is changed, and the code's
   `IdentityBands` type is the old delta shape.
4. The test says "passing the surface bands (paper, edge, palette family)". There is no paper-area band, no
   halftone band, no ink-band band. `bands` has film means and a palette distance; the crop means are only
   in the MD §5.2.
5. The §7 "five failures" list still includes **archetype**, while the acceptance test's seven exclude it
   (there is no instrument). The test should say "archetype is a human sign" rather than drop it silently.

**Fix:** add a reference cut list (or a 30-frame sample with a `sha256`) to `styles/paper-kpop/references/`,
and make `style:identity --video <file> --reference` run without a score for the five tone bands; add the
frame report for field/centroid/height/local contrast; add the crop means to a `surface` block; write the
expected-failure list **once**, with archetype marked human. The two-film run is the command that proves
the identity; without it the bands are a proposal.

---

## 8. What v1.2 gets right — keep it

- **The 30/45/60 arithmetic is fixed.** 10-13 → 18-24, 14-18 → 17.3-22.7, 18-23 → 17.0-22.0. This was the
  largest v1.1 arithmetic blocker; it is gone.
- **The hero ladder is inside the height band.** 1.10-1.25 × 580-760 = 59.1-88.0%; the old 94.3% hero is
  gone. Inset 0.24 is 1.2 px short, not the old 11.8%.
- **The film bands are in the JSON**, and they pass the reference as film means: luma 100.9, saturation
  21.8, edges 12.6, palette 48.3, and the Uber's 146.8 luma fails. That is the one measurement v1.1 had only
  in prose; it is now in the file.
- **The required list exists** and all 10 paths resolve. It is the right *mechanism*, even if the list needs
  correcting.
- **Performance, silhouette, stage roles, 12 variation axes, 9:16 scale, match-cut tolerances, the
  diagram-opener ban and 45 forbidden ids are named.** Some are unmeasurable; naming them is still better
  than the v1.1 silence.
- **The 85-95 word band is honest in the prose** ("write 85-90 if the last word must land"); the JSON needs
  the same condition.
- **The expected Uber failure set is now seven in both documents.** That is a real reconciliation.

The next revision should not undo these. It should put the same care into the second-order arithmetic, the
band population and the instruments.

---

## 9. Score, remaining P0s, sign

| Axis | v1.1 | v1.2 |
|---|---|---|
| Implementability without over-engineering | 6.0 | **6.5** |
| Evidential honesty | 6.5 | **6.5** |

**Why 6.5, not 7:** the arithmetic and the vocabulary moved; the measurement and the contract did not. The
band collision, the instrument gap, the signed reversals and the unrunnable acceptance test are the same
four blockers as v1.1, and v1.2 adds the distribution impossibility, the 9:16 caption conflict and the
silhouette hand conflict. A developer can now see where the blocks go; they still cannot write the checker
without inventing the statistic, the share and the namespace, and a film that follows the document still
fails the pack it claims to extend.

### Remaining P0s — must fix before any implementation

**P0.1 — The band block.** `identity.bands` collides with `tokens.identity.bands` (delta vs absolute) and
would silently disable the five-band check; `tones` is a 5-key copy; the block mixes film means, per-shot
ranges and a share threshold under one `basis`. **Fix:** `bands.delta` / `bands.film` / `bands.surface`,
`statistic` + `share` on the ~13 distribution values, delete `tones` or make it the crop block.

**P0.2 — The instruments.** No drawn bbox, no field component, no ring, no silhouette. The new required
`cast.silhouette` and `performance` blocks have no probe. **Fix:** one per-shot frame report (subject box
from drawn card bounds, field as the edge-touching component, ring |ΔL|, 3 frames/shot); mark silhouette and
performance `humanSign` until it exists.

**P0.3 — The signed reversals.** Camera 11 moves / shake / 25% push / fixed anchor; type 31/44-84/7-18 vs
69; colour 7/5 vs 4; cast 7 vs 2; duration 156.6. **Fix:** paper-kpop **0.3.0** with a `contract-change` PR,
new card, new seal and gate re-run; or adopt the signed values. Do not keep both.

**P0.4 — The acceptance test.** No reference score, absolute drive path, no `sha256`, no surface bands, one
expected list split across §7 and §5.5. **Fix:** a reference cut list + a 30-frame sample in the pack, a
`style:identity --video` path that works without a score, the crop means in a `surface` block, and one
expected-failure list with archetype marked human.

**P0.5 — The pass/fail arithmetic still wrong.** `edit.distribution.under1` is impossible for 10-13,
14-18 and 18-23 shots; 85-95 words exceeds the 87.1 ceiling with a 1.5 s tail; inset 0.24 is 12.89% vs 13%;
`performance.stageShareMin 0.30` vs its ">=1" note; 9:16 `copyBottomPx 1330` vs the pack's caption at 1574;
`type.maxWords 8` vs `subtitleBox.maxWords 9`; the silhouette hand 3-4% vs `cast.hand` 1.3-3.7%; the
reference's 94.3% hard cuts / 19.6% iris / 28% opening flashes vs their bands; `framingMix`/`distribution`
sums. **Fix each value, not the prose around it.**

With P0.1-P0.5 the score is 8-9 and the sign flips. Without them, v1.2 is the best-dressed version of the
same problem: the doc can name the five gaps, and the commands still cannot see them.

**SIGN: NO.**
