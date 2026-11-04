# Completeness critique - Paper K-pop identity specification v1.1 (second pass)

**Date:** 4 November 2026
**Critic:** completeness (subagent, second pass)
**Inputs read in full:** `KPOP-IDENTITY.md` (v1.1, 1,449 lines), `kpop-identity.proposed.json` (v1.1.0, 25 identity blocks), `critique-completeness.md` (my v1.0 review), `A-engine.md`, `B-cast-sets.md`, `C-edit-camera-sound.md`, `D-lemo.md`, `E-kits.md`, `F-vizavi.md`, `G-studio-gap.md`, `H-youtube.md`, `I-frames.md`/`.json`, `J-skills.md`.
**Method:** every v1.0 P0 checked against the v1.1 section and the JSON leaf; every user dimension re-checked; the JSON walked programmatically (665 named fields, 134 explicit value/range records, 0 `measure` keys, 0 `source` keys).

---

## 0. Verdict

**Completeness: 7.5 / 10 (was 7.0).**
**SIGN: no.**

v1.1 is a real revision, not a re-shuffle. The scope system (R/T/I/F/V/X) fixes the class of error that produced most of v1.0's contradictions; determinism, tone, HUD, reference defects, reaction timing and the 9:16 type scale are now sections rather than sentences; joints, openings, variation and the song scope are corrected; the one-page table grew from 30 to 32 rows and gained a Basis column. That is worth +1.0.

It still cannot be signed as a completeness contract, for one old reason and one new one. The old reason: **the tone bands are still not in the JSON**, for the second revision, and they are the document's own P0 and the basis of its acceptance test (§5.5). The new reason: **the JSON's shape is not the shape §4.1 promises** - it has 0 `measure` and 0 `source` keys, so "a checker can read one value without knowing the prose" is still false, and the file has grown to 665 named fields while §4.5 still says "9 blocks will do".

Eleven P0s: **2 fixed, 8 partial, 1 not fixed.** The partials are mostly 70-90% done; the keystone is the 0%.

---

## 1. The eleven P0s from v1.0, verified

| P0 | v1.0 ask | v1.1 evidence (exact) | Verdict |
|---|---|---|---|
| **P0-1** | Tone bands + `bands.basis` in the JSON; film vs crops | §4.3 items 2-3 name `tokens.identity.bands.basis` and `tones`; §5.3 lists 18 bands; `identity` has **no `bands` and no `tones` key**. Only `referenceValues.referenceMeanLuma: 100.9` and `palette.localContrastMin: 20`, which are not the band set | **NOT FIXED** |
| **P0-2** | Five element shadows + practicals | §3.4 "Per-element lighting / shadow table" (7 rows) + JSON `light.paperShadow`, `contactShadow`, `spotlight`, `glow`. The table gives **no per-element offset or alpha**; A 4's limb `+3,+5` α.14, face `+2.5,+4.5` α.14, hair `+2.5,+5` α.16, petal `+1.5,+3` α.13 are absent from both files | **PARTIAL** (practicals added, elements not) |
| **P0-3** | Determinism block + camera reset | §3.28 table; JSON `determinism {clock, rng, seeded[7], fixed[4], cameraResetPerShot, workerSafe, textureHz, freezeBudgetS}` | **FIXED** (missing the hash string, the seed input, and a §5.1 row; `npm run determinism` not named) |
| **P0-4** | Per-act colour script as values | §3.3 "Colour script per act (F)" bullets; JSON `palette.script` is **one prose sentence**, plus `field.fieldColoursPerFilm [3,5]`, `field.sameFieldConsecutiveActs:false`. No `acts`, `warmFieldsMin:2`, `blueFieldsMax:1`, `arc`, `declaredIn` | **PARTIAL** |
| **P0-5** | Reaction 0-3 frames after the measured word | §3.11 reaction row "0-3 frames after the word"; §3.20 `character <-> character` row; JSON `movement.reactionFrames [0,3]` | **FIXED** (misfiled under `movement`, not `interaction`; sign is prose-only) |
| **P0-6** | HUD + print furniture as records | §3.27 table; JSON `hud {mode, box, titlePx, valuePx, unitPx, bar, ticks, recurrence, copyTheLabel:false}`; `medium.print {marginPx, markPx, markAlpha, colourBars, timecodeFps}`. The meter is now deliberately a motif, not a HUD rule (§3.13); still missing `hud.flower`, `hud.redAt`, `hud.valueMin/Max`, `print.barcode/folio` | **PARTIAL** |
| **P0-7** | Per-move travel + shake clock + anchor | §3.14 vocabulary "Travel" column (crash .5-3, pan 24-600, tilt 18-400, track 100-800, orbit dz .05-.12/arc 10-40, whip 300-900, handheld 0-12); JSON has only `zRange`, `rollDeg`, `shakePx`, `holdCreep`, `pushCreep`, `kick`, `seam`. No `camera.travel`, no 71/63 rad/s, no yRatio .7, no decay 0, no anchor (960,540) | **PARTIAL** |
| **P0-8** | Transition partition, geometry, match cut, motivated exit | §3.17 model + JSON `edit.transitions` with shares and durations; `match_cut` has **no tolerances** (F 5.3: IoU .80, scale .90-1.11, 5 deg, direction dot .90); no `edit.motivatedExitShare`; no `transitionOut.carrier`; C 5's motivated exit appears nowhere in v1.1 | **PARTIAL** (durations now good; the cut signature is missing) |
| **P0-9** | Scope purge | `sound.song` scope `R` ✓; `edit.scenes`/`visibleCards` moved to `referenceValues` ✓; `camera.crashMax` scope `V`/`reference-comparison` ✓; `voice.songWpm` scope `R` ✓. Still `edit.chorusS` and `edit.verseS` scope I, and `edit.minS .6`/`maxS 6.2` scope I conflict with every T format | **PARTIAL** (4 of 6) |
| **P0-10** | Cast presence + placement shares | §3.7 "centroid x .30-.75 **in >=80% of shots**" and "outer 10% rule" are prose; JSON has `centroidX.centreThirdShare: .78` but **no `presentShareMin`**, no `centroidXShareMin`, no `floorShareMin` | **PARTIAL** |
| **P0-11** | Fail-closed identity block | §8.2 item 2 and JSON `checks.schema` both say "missing band = error, not a pass"; but there is **no `identity.required[]`** and every record has no `measure`, so "missing" cannot be enumerated | **PARTIAL** |

**Count:** FIXED 2, PARTIAL 8, NOT FIXED 1. The two fixed are the two cheapest (determinism, reaction). The one unfixed is the one the document itself calls the correction that matters.

---

## 2. The user's dimensions, v1.0 -> v1.1

Status: **C** complete (value + scope + measure + source), **P** partial, **M** missing. "v1" is my first-pass grade.

| Dimension | v1 | v1.1 | Where | What still blocks a check |
|---|---|---|---|---|
| Camera moves / frequency | P | **C** | §3.14 table; `camera.moves[11]`, six `*Share` bands, `distinctMoves`, `maxRun`, `byBeat` | shares are budgets (stated); `distinctMoves [4,8]` contradicts the reference's 8-10 |
| Camera travel / shake | P | **P** | §3.14 "Travel" column; `camera.zRange/rollDeg/shakePx/kick/seam` | no per-move travel, no 71/63 rad/s, no yRatio .7, no decay, no anchor (see P0-7) |
| Framing / composition | P | **P** | §3.6 table; `composition.framingMix`, `heightTiers`, `heightSdMin` | `framingMix` sums 0.75-1.30, still not a partition, no link to the height bands |
| Shot distribution | P | **P** | §3.15; `edit.distribution` | JSON min .88/max 1.15; §2 row 20 **omits the 2-3 s band** |
| Continuity | P | **P** | §3.17 "designed with both scenes", same-location rule, `camera.seam.cutOnMotionMin .4` | no motivated exit, no match-cut tolerances, no 180 deg line, no `carrier` |
| Per-shot action | C | **C** | §3.16; `motion.actionsPerShot [1,3]`, `nonCameraAction` | - |
| Focus / blur | C | **C** | §3.18; `forbidden` dof/bokeh/motion-blur/tilt-shift | `radial-blur` is in §3.25 but **not** in the JSON list |
| **Lighting per element** | M | **P** | §3.4 element table; `light.*` | one offset/alpha (6,10/.22) for every element; A 4 has four more |
| Background field | C | **C** | §3.8; `field.*`, `sets.*` | sky device is prose only |
| Boundary lines | C | **C** | §3.5; `edge.*` | cut edge colour and the 390 px read rule are markdown-only |
| Characters | P | **P** | §3.9 six-point test; `cast.*` | `headToBody 7.0-7.5` still contradicts "head centre .80-.92"; no face/torso/foot/palette-role records |
| Sound | C | **C** | §3.21; `sound.*` | no bed level, no cue frame tolerance (music parked, so P2) |
| Shadows | C | **P** | §3.4; `light.paperShadow`, `contactShadow` | the single I constant is applied to limbs, faces and petals that the reference offsets differently |
| Assets / props | P | **P** | §3.12; `props.*` | still no file, name or licence (`assets:check` needs all three); no `worn`/`contact`/`occlusion` in JSON |
| Narration | C | **C** | §3.22; `voice.*` | register still prose |
| Continuous motion vs cuts | P | **P** | §3.16, §3.17 | no one-idea-per-shot field, no motivated exit |
| Transitions | P | **C** | §3.17; `edit.transitions` durations/shares | partition sentence contradicts itself (see 4.7) |
| Camera types | C | **C** | §3.14 vocabulary; `camera.moves` | - |
| Text appearance / boxes / underline / animation | P | **P** | §3.19 tables; `type.*` | no files/licence/wrap/panel/window/enter/exit in JSON; no exit rule anywhere; `reading` is still a formula string |
| Interaction | P | **P** | §3.20; `interaction.*` | no anchor list, no contact point enum, reaction filed in `movement` |
| Reusable code values | P | **P** | 25 blocks, 665 fields | 0 `measure`, 0 `source`; bands absent; 19 duplicated values |
| Tone | - | **P** | §3.26; `tone` | 9 of 11 leaves are prose; two are checkable (`tenderBeat`, `poisonAccent`). Honest, but not code |
| HUD | P | **P** | §3.27; `hud` | geometry R, block scope F; meter/barcode/red threshold absent |
| Determinism | M | **C** | §3.28; `determinism` | no §5.1 row, no seed input |
| Reference defects | - | **C** | §0.1, §3.29 (9 rows) | - (one extra: world moves not listed) |
| Palette script | M | **P** | §3.3, `palette.script` | string, no arc/min counts |
| Reaction timing | P | **C** | §3.11/§3.20, `reactionFrames` | misfiled; no `audit:reaction` named |
| 9:16 | M | **P** | §3.19 paragraph; `type.size9x16` (display 56, body 24, caption 16, label 14, floor 14) | no platform bands, no vertical composition, no vertical edit bands; §9 Q6 still parked |
| Variation history | P | **P** | §3.24 history; `variation.historyFilms:3` | no artefact schema (`build/variation.json` has no shape), 10 vs 12 axes |
| Walking / sitting | M | **P** | §3.11 "phase from distance; 8-drawing cycle" | still no stride, step frames, bob %, lean, or sit |
| Crowd | P | **P** | §3.11/§3.20 "frozen except on cue"; `interaction.crowd` | no count, spacing, phase, arm/phone rule; and it **contradicts** A 6's beat-bobbing crowd without declaring the deviation |

**Count:** C 12, P 19, M 0 (was C 23 / P 33 / M 4 on the finer 60-row split). The four v1.0 missing axes are no longer *absent*; three are still not machine-complete.

---

## 3. The new sections - are they load-bearing?

| Section | Record | Measure in §5.1? | Verdict |
|---|---|---|---|
| §3.26 Tone | `tone` (11 leaves, 9 prose) | **yes** ("review / human") | Good. Honest: tone is a human sign. `tenderBeat` is countable. |
| §3.27 HUD | `hud` (15 leaves) | **no** | Half. The block is R geometry at F scope; `copyTheLabel:false` says do not copy, yet a checker could require 1634/40. Should be `scope R` or `if used`. |
| §3.28 Determinism | `determinism` (12 leaves) | **no** | Strong content, weak wiring: the repo already has `npm run determinism` (twin sample, manifest `videoHash`) and `paint-purity.test.ts`; neither is named. |
| §3.29 Reference defects | 9-row table | n/a | Complete and accurate. Best new section. |
| §3.4 Per-element light | 7-row table, no numbers | **no** | The table re-states one shadow rule per role; it does not carry A 4's five element shadows. The user's named dimension is still answered in prose. |
| §3.3 Palette script | one sentence + 2 fields | **no** | Missing the values that make it a script (act count, warm min, blue max, arc, `declaredIn`). |
| §3.11/§3.20 Reaction | `movement.reactionFrames [0,3]` | **no** (no row; `audit:reaction` exists) | Content correct, home wrong. |
| §3.19 9:16 | `type.size9x16` | **no** | Type only. Composition, field, safe area, platform bands all absent; §9 parks them. |
| §3.24 Variation history | `historyFilms:3`, `check` string | **no** | The 3-film idea is right; the artefact has no fields, so `variation:check` is unimplementable from the spec. |

**The finding:** §5.1 is the measurement matrix, and v1.1 added **one** row (Tone) while six axes it now specifies have no row at all: per-element light, determinism, HUD, palette script, reaction and 9:16. The document now describes more than it can measure, which is the exact failure v1.0 named.

---

## 4. JSON vs markdown

### 4.1 Are the 25 blocks enough?

Yes for the *containers* - every user axis can be placed in one of `envelope, medium, palette, light, edge, composition, field, cast, movement, sets, props, motifs, camera, edit, motion, type, interaction, sound, voice, tone, opening, variation, hud, determinism, forbidden` - with **three exceptions**:

1. **No measurement block.** There is no `bands`/`tones`/`measures` anywhere. The 18 bands of §5.3 and the 25 measures of §5.1 have no home. This is the block that turns a style bible into a gate, and it is the one block missing.
2. **No layout/format block.** `type.size9x16` and `hud.box` exist, but safe zones, platform bands (168/1330), the 16:9 box map, margins and the 390 px floor live in `tokens.layout` in the pack (G #26-28) and have no identity record. A vertical film has no composition or safe-area contract.
3. **No per-record `measure`/`source`.** §4.1 promises seven keys per record; the JSON delivers `value`, `unit`, `scope`, `basis` and drops the other three. Programmatic check: **0 `measure` keys, 0 `source` keys, 95 `scope`, 28 `basis`, 82 `unit`.**

### 4.2 Axes with no code value at all

| Axis | Field | Why |
|---|---|---|
| Tone (register) | `tone.surface/subject/character/violence/cynicism/ending` | sentences; only `tenderBeat` and `poisonAccent` are machine-readable |
| Interaction (contact) | `interaction.feet`, `.eyeline`, `.crowd` | sentences; `contactRequired` is a boolean with no anchor list |
| Palette script | `palette.script` | one sentence; no act count, warm min, blue max, arc |
| First frame | `opening.firstFrame` | sentence; no `coverageMin`, no `subjectSpecific` test |
| Reading time | `type.reading` | formula string `max(1.8, speech + 0.6)`; my v1 P2 asked for `{base, perWord, lastMin}` - still not done |

### 4.3 The missing leaves, by block

| Block | Missing (markdown has it, JSON does not) |
|---|---|
| `envelope` | `encode` (libx264 crf 15 ...), `frame` formula, `unit` px at z=1, colour space |
| `medium` | `blobJitter .06`, `print.barcode/folio` |
| `cast` | `face` geometry (eyes ±17.5, nose 1 px, mouth y 32), `torso` origin/construction, `foot`, `ornament` slot list, `paletteRoles`, `costumeRoles`, expression names |
| `sets` | `sky` (2-stop + one device + one texture), `scroll`/multi-rate parallax |
| `props` | `worn`, `contact`, `occlusion`, `file`, `name`, `licence` |
| `camera` | `travel` per move, `shake` clock (71/63 rad/s, yRatio .7, decay 0), `anchor [960,540]`, `gapShotsMax`, `staticAdjacent` |
| `edit` | `matchCut` tolerances, `motivatedExitShare`, `carrier`, `cutOnAction` |
| `type` | `files`, `licence`, `wrap`, `subtitlePanel`, `label`, `activeWord`, `progress`, `visibleWindow`, `enter`, `exit` |
| `sound` | `bed {levelDb, duckDb}`, `cueFrameTolerance`, hit-over-bed |
| `voice` | `register {narrated, song, bans}` |
| `opening` | `firstFrame.coverageMin`, `subjectSpecific` |
| `variation` | `previousFilm {id, hash}`, artefact shape, `closingDiff` |
| `palette` | `script` values (acts, warm min, blue max, arc, declaredIn) |
| `layout` | **no block**: platform bands, vertical composition, safe zones |

### 4.4 Duplicates - they got worse, not better

v1.0 had ~13 duplicate pairs; v1.1 has ~19 duplicated values in 13 groups, some 3-4 deep:

| Value | Homes |
|---|---|
| freeze budget 0.4 s | `movement.freezeBudgetS`, `motion.freezeBudgetS`, `determinism.freezeBudgetS`, `edit.holdMaxS` |
| hold creep .0002 | `camera.holdCreep`, `motion.holdCreep` |
| texture cadence 2/24/12 | `determinism.textureHz` + `medium.paperOverlay.hz` + `medium.grain.hz` + `type.treatment.boilHz` |
| field share / largest flat | `palette.fieldShare` + `field.share`; `palette.largestFlat` + `field.largestFlat` |
| edge bar | `composition.edgeBarMax` + `field.edgeBarMax` |
| object edge | `light.objectEdgePx` + `edge.objectPx` |
| type edge | `light.typeEdge` + `edge.typeEdgeRatio/Min` |
| type shadow | `light.typeShadow` + `type.treatment.shadowX/Y/Alpha` |
| grip | `props.gripPx` + `interaction.gripPx` |
| overshoot / anticipation / squash | `movement.*` + `motion.*` |
| horizon | `sets.horizonPx` + `field.horizonPx` (+ `composition.floorLine` as a ratio) |
| song wpm | `sound.song.wpm` + `voice.songWpm` |
| blue-on-blue | `palette.blueOnBlue` + `forbidden` entry |

A checker written by two people reads two values. One home per value, or delete the duplicate.

### 4.5 The minimalism claim is now further from the file

§4.3: "Nine fields close the five named gaps." §4.5: "Do not add a 251-record schema where 9 blocks will do." §8.3: "Do not add a 200-field schema that no check reads."

The JSON: **25 blocks, 665 named fields, 134 explicit value/range records, 41 forbidden strings.** It is not the "proposal for the 9 P0 blocks" §4.2 calls it; it is a full identity. Either the JSON shrinks to the nine, or §4.5/§8.3 change. As written, the document's minimalist thesis is contradicted by its own attachment - the same defect as v1.0, larger.

Also: of §4.3's own nine fields, **7 are in the JSON and 2 are not** - `bands.basis` and `tones`. The two missing are the two that make the gate valid.

### 4.6 Contradictions a checker would hit

| # | Contradiction | Where | Effect |
|---|---|---|---|
| 1 | **`negativeSpace .97` fails the reference** | JSON `composition.negativeSpace` I; §3.6 row; reference max subject area .089 -> 91.1% negative | §0.1 says a band that fails the reference is wrong. This one does, and §3.6's own rule says "do not use subject area as a band" |
| 2 | **`edit.minS .6` vs `microShotS .22-.66`** | JSON `edit` | Every micro-shot (iris/flash, 0.22 s in the reference) is below the declared minimum. No exemption stated |
| 3 | **`distinctMoves [4,8]` vs "the reference uses 8-10"** | §3.14 text + `camera.distinctMoves` | The reference is outside the invariant |
| 4 | **world move <=10% vs reference 15%** | §3.14 table + `camera` | Same class; no "tightened" note |
| 5 | **`headToBody 7.0-7.5` vs "head centre .80-.92"** | §3.9 | 7 heads puts the centre at .929; the prose band excludes both ends. Unchanged from v1.0 |
| 6 | **Pose keys 11 vs 12** | §2 row 12 and §3.11 value column say 11; §3.11 list and JSON `poseKeys` have 12 | New count error, same family as the old joints error (which is fixed) |
| 7 | **Transitions: "do not sum to 100" then "base + designed = 100"** | §3.17 partition paragraph, adjacent sentences | The model is a modifier on a cut, so base + designed cannot both be 100 and a modifier. `hardCutShare .80-.90` + `designed .10-.20` = 90-110 |
| 8 | **Per-kind transition maxima exceed the total** | `iris .08-.15 + flash 0-.08 + wipe 0-.04 + match .02-.06 + hold 0-.04` = .10-.37 vs `designedTransitionShare .10-.20` | A film can satisfy every sub-band and violate the total |
| 9 | **`edit.chorusS` / `verseS` scope I** | JSON `edit` | Song-only bands declared invariant for a 30 s narrated film |
| 10 | **`edit.minS/maxS` scope I vs T formats** | `.6/6.2` at block I; formats 1.2-5.0/1.2-5.2/1.2-5.5 | The 156 s film's values promoted to invariant; every format contradicts them |
| 11 | **Variation 10 vs 12** | `variation.requiredDifferences` 10; §3.24 has 12 rows (separate opening/closing, plus Sound) | A film may repeat the sound mode and still pass the JSON |
| 12 | **HUD scope** | `hud.scope F`, `basis reference`, `copyTheLabel:false`, exact 1634/40 geometry | A checker cannot tell rule from example |
| 13 | **§2 row 20 omits 2-3 s** | §2 shot distribution vs §3.15 distribution | The one-page table cannot sum; JSON has `twoToThree` |
| 14 | **forbidden list vs §3.25** | JSON 41 entries; prose 20 rules | Missing: `radial-blur`, `3d-wipe`, `split-screen`, `pan-from-eq-to`, `3d-orbit`, `prop-through-body`, `floating-foot`, `glass-panel`. A floating foot is called "a P0" in §3.11 but is not in the machine list |
| 15 | **Light offset I vs A 4's V** | `light.paperShadow +6,+10 .22` scope I | A 4 marks offsets/alpha V with (+4,+7), (+5,+8), (+8,+12) common; the I constant fails the reference's own character shadows |
| 16 | **`light.paperShadow.ratio 1.6-1.8`** | JSON | Redundant with 10/6 = 1.67; kept as a second way to say it |
| 17 | **Reference luma 91.1 vs 100.9** | §7 and §3.3 p50 91.1; §5.2/§5.3/`referenceValues` 100.9 | I 3 reports mean 96.9 / p50 91.1; 100.9 is unexplained. The band covers both, so it is an audit-trail defect, not a gate failure |

---

## 5. Over-detail that should be cut

The test is unchanged: a value a film or check will never use, whose removal does not change what a frame looks like as this channel.

| # | Value | Why |
|---|---|---|
| 1 | `medium.fibre` counts (90 mottles, 4,200 fibres, 1,500 specks, lengths, alphas) | Painter counts. Keep "fibre + mottle + speck at low alpha, 1024 sheet"; a new painter will not match the numbers |
| 2 | `medium.vignette.innerR 194.4 / outerR 885.6` | Derived from strength .34 and the frame |
| 3 | `camera.crashMax 8.0` | Still from the 720p comparison; now V-labelled but still not a channel value. Move to `referenceValues` |
| 4 | `edit.chorusS`, `verseS` | Song-only; move to `appliesTo:"song"` or delete from edit |
| 5 | `composition.subjectWidth` | Derived from the bbox |
| 6 | `palette.referenceDominant` (8 hex) | Reference content; no film reads it. Belongs in `referenceValues` |
| 7 | `type.size16x9.monogram/circular/vertical` | 1-2 calls in 51 scenes; either add a use rule or mark R |
| 8 | `tone` as 9 JSON strings | Prose in a JSON value field. Keep `mode`, `tenderBeat`, `poisonAccent`, `ending` |
| 9 | `hud` geometry as F | If `copyTheLabel:false`, do not encode the label's box as a rule |
| 10 | `motion` block | It duplicates the six `movement` values it shares (overshoot, anticipation, squash, freeze, creep, action count); keep one home for each |
| 11 | `determinism.textureHz` | Duplicates three existing Hz values |

Cutting 1-11 takes the file from 665 fields toward ~500 without losing an axis. It still will not be "9 blocks"; change the prose or the file.

---

## 6. Under-detail that must be added (ranked)

| # | Add | Source | Priority |
|---|---|---|---|
| 1 | `identity.bands` + `basis:"film"` + `tones` (the 18 bands of §5.3, with the five crop bands under `surface`) | §5.2-5.3, G 5.1, P0-1 | **P0** |
| 2 | `measure` + `source` per record (or a block-level measure map referenced from §4.1) | §4.1, G 3.1 | **P0** |
| 3 | `identity.required[]` and a fail-closed null rule | §8.2, G #20, P0-11 | **P0** |
| 4 | `light.elementShadow {limb:[3,5,.14], face:[2.5,4.5,.14], hair:[2.5,5,.16], petal:[1.5,3,.13], boot, contact}` | A 4, B 9.1, P0-2 | **P0** |
| 5 | `edit.matchCut {iou:.80, scale:[.90,1.11], angleDeg:5, directionDot:.90}`, `edit.motivatedExitShare [.6,.9]`, `score.shots[].transitionOut.carrier` | F 5.3, C 5, P0-8 | **P0** |
| 6 | `camera.travel` per move, `camera.shake {freq:[71,63], yRatio:.7, decay:0}`, `camera.anchor [960,540]`, `camera.gapShotsMax:0` | §3.14, A 5, P0-7 | **P0** |
| 7 | `layout.platformBands.9:16 {topEmptyPx:168, wordsTop:168, wordsBottom:1330, decorationBelow:1330}`, vertical composition bands, 9:16 edit bands | J P0 #11, G #26-28 | **P0** (the product is vertical) |
| 8 | `palette.script {acts:[3,5], warmFieldsMin:2, blueFieldsMax:1, noRepeatConsecutive:true, arc:"intimate->loud->resolve", declaredIn:"score.paletteScript"}` + score field | §3.3, I 5, P0-4 | **P0** |
| 9 | `movement.walk {stridePx, stepFrames:[9,12], bobPct:[.03,.07], leanDeg:[1,7], phase:"distance"}`, `sit`, `mood {keys, blendFrames, blinkHidesSwap}` | B 3.3, E 4.1 #7, J P1 | **P1** |
| 10 | `cast.crowd {countMax, scale:[.50,.68], spacingPx:[110,330], phase:[.14,.20], armEvery:3, phoneEvery:5, frozenExceptCue}` - or declare "frozen" as a deliberate deviation from A 6 | A 6, B 4.2-4.3 | **P1** |
| 11 | `cast.face`, `cast.torso`, `cast.foot`, `cast.paletteRoles`, `cast.ornament` | B 9, §3.9-3.10 | **P1** |
| 12 | `props.standard {file, name, licence, scaleTo:"character"}`, `worn`, `contact`, `occlusion` | B 6, AGENTS `assets:check`, G #17 | **P1** |
| 13 | `type.files/licence/wrap/subtitlePanel/visibleWindow/enter/exit`, `type.reading {base, perWord, lastMin}` | A 8, J P0 #1/#4 | **P1** |
| 14 | `voice.register {narrated:"dry-conversational", song:"sung-pop", bans:[...]}` | J 2.1 | **P1** |
| 15 | `sound.bed {levelDb, duckDb}`, `sound.cueFrameTolerance:1` | E 4.1 #6, J P1 #21 | **P1** |
| 16 | `variation.previousFilm {id, hash}`, artefact shape for `build/variation.json`, `closingDiff` | §3.24, my v1 P1 #14 | **P1** |
| 17 | `opening.firstFrame {coverageMin:.10, noBlack:true, subjectSpecific:"review"}` | J P0 #6, §3.23 | **P1** |
| 18 | `sets.sky {stops:2, device, texture}`, `sets.scroll {bg,mg,fg}` | B 5.3, my v1 P1 #6 | **P2** |
| 19 | `edge.cutColour`, `edge.read390Px`, `edge.set`/`edge.field`, `composition.focalCount:1`, `composition.outerBandMax` | A 4, I 7, my v1 P1 #19-20 | **P2** |
| 20 | `motion.easeByRole {enter, move, exit, camera}` | J P0 #1 | **P1** |

Items 1-8 are cheap and local (no new tool). 1-3 are the ones that stop the gate from existing.

---

## 7. What is genuinely complete now

- **The scope system.** R/T/I/F/V/X is the right fix and it is applied consistently in prose. Every table now carries a Basis column; the reference film and its crops are separate references (§5.2); a value measured on the wrong film is demoted (`crashMax`, `sound.song`).
- **Determinism** is a section, not a sentence, and it names the failure modes the repo cares about (seeded texture, per-shot camera reset, worker safety).
- **Reference defects** (§0.1, §3.29) are explicit and accurate: sticky `CAM` 24/51, unseeded grain, re-derived hand anchors, dead set functions, 54 cards vs 51 scenes, unenforced safe zones, 31 px at 9:16, -15.6 song LUFS, no paper simulation.
- **The corrected counts:** joints 13 (list and JSON agree), openings/closings 4/4, variation 10 in the summary and the JSON, `subjectArea` removed as a band and replaced by height/width.
- **The edit durations and transition geometry are now records**, with per-format bands for 30/45/60/156.
- **Tone and HUD exist**, and both are honest about being human-signed / reference content.
- **9:16 has a type scale and a 14 px floor**, taken from the pack rather than invented.
- **The one-page table is 32 rows with a Basis column**, and the two v1.0 factual errors in it are gone.

The problem is no longer that the spec does not know the channel. It does. The problem is that the machine file still cannot prove it.

---

## 8. Score, blockers, sign

**Completeness: 7.5 / 10.** (+1.0 for the scope system, the new sections and the corrected counts; -0.5 for the missing bands and the new schema/prose mismatch.)

**Blocking issues, in fix order:**

1. **B1 - The bands are not in the JSON.** No `bands`, no `basis`, no `tones`. §5.5's acceptance test ("the reference must pass; Uber must fail on five axes") cannot be run from the machine file. This is the document's own P0, for the second revision. Copy §5.3 into `identity.bands` and `identity.tones`; keep the crop bands under `surface`.
2. **B2 - The JSON is not the shape §4.1 promises.** 0 `measure`, 0 `source`, no `required[]`. Either add them or change §4.1 to say measure lives per axis in §5.1 and source lives in the evidence index. As written, "a checker can read one value without the prose" is false.
3. **B3 - Four invariants the reference itself fails**, which §0.1 says are therefore wrong: `composition.negativeSpace .97` (reference 91.1%), `edit.minS .6` against `microShotS .22-.66` (no exemption), `camera.distinctMoves [4,8]` against the reference's 8-10, and world `<=10%` against its 15%. Any one of these makes the acceptance test fail the reference.
4. **B4 - The cut signature is absent.** No match-cut tolerances (F 5.3 supplies them) and no motivated exit or `carrier` (C 5 calls it the film's signature). The doc specifies transition kinds but not the thing that makes the cut a film cut.
5. **B5 - Camera travel and the shake clock are still markdown-only.** The JSON has shares but no per-move travel, no 71/63 rad/s, no anchor; §3.14 itself admits the score schema cannot express a pan. `camera.keys` is proposed, not specified.
6. **B6 - 9:16 is half a format.** Type scale and floor only; no platform bands, no vertical composition, no vertical edit bands, and no §5.1 row. The product is vertical-first (J P0 #11, G #26). This is one film away from being the blocker.

**Non-blocking but should be fixed in the same pass:** the ~19 duplicate values (freeze budget has four homes), the 8 forbidden moves missing from the JSON list (`floating-foot`, `glass-panel`, `3d-orbit`, `prop-through-body` ...), the pose-key 11/12 count, `headToBody` vs head centre, `chorusS` scope, the transition partition sentence, and §2's missing 2-3 s band.

**SIGN: no.** After B1-B3 alone the score is 8.5; after B1-B6 it is 9/10 and worth signing. Every fix is a field copy or a scope change; none needs a new tool.

**The single sentence:** v1.1 now knows what it does not know - but the two values that turn the knowing into a gate, the bands and the measure, are still the two that did not make it into the file.
