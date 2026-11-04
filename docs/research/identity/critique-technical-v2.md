# Technical critique — Paper K-pop identity specification v1.1

**Critic:** technical architect (subagent), second pass
**Subject:** `KPOP-IDENTITY.md` v1.1 and `kpop-identity.proposed.json` v1.1
**Previous:** `critique-technical.md` — v1.0, **5/10**, SIGN **NO**
**Date:** 4 November 2026
**Score:** **6 / 10** for implementability without over-engineering
**SIGN:** **NO**

v1.1 is a real revision, not a re-typeset. The JSON fell from 251 records to 25 blocks and
24.6 KB, `range` is now used where the prose says "band", the reference facts moved into
`referenceValues`, the scope vocabulary exists, and section 0.1 finally separates the reference
from the target. A developer reading v1.1 will put the blocks in `tokens.identity` instead of
creating a second file. That was the central failure of v1.0 and it is mostly gone.

What did not move is the part that decides whether a film passes: the record shape that lets a
command read a band, the two instruments that see the field and the local contrast, and the
handful of numbers that contradict each other. **None of the eleven P0s is fully closed: five
are partial, six stand.** The two records that would make this an extension rather than a copy —
`identity.bands` (with `bands.basis`) and `identity.tones` — are in the prose and missing from
the JSON.

---

## 1. P0 ledger — v1.0 critique, checked one by one

| P0 | State | Exact field, and why |
|---|---|---|
| **P0.1** Two sources of truth | **PARTIAL** | 25 blocks / 24,585 bytes / 535 lines (was 251 records). But `palette.roles`, `palette.dayStage`, `palette.nightStage` and `medium.layerOrder` are **byte-identical** to `tokens.color.roles`, `tokens.color.palettes.day-stage`, `.night-stage` and `tokens.medium.layerOrder` (script-verified). `type.size9x16` is byte-identical to `tokens.layout.aspectScale["9:16"]` minus `floorPx`. Ten of 25 blocks still restate an existing source (section 4). |
| **P0.2** Signed pack reversals labelled invariants | **NOT FIXED** | `identity.camera.moves` has 11 (adds `crash_zoom`, `tilt`, `track`, `whip`, `handheld`, `world`); `STYLE.md:62` says "static, push_in, pull_back, pan, tilt and orbit … No handheld, no wobble, no shake". `identity.camera.crashMax: 8.0` with `basis: "reference-comparison"` and `identity.camera.shakePx [0,12]`; `STYLE.md:87` "No dissolve, camera shake, handheld drift or wobble". `§3.14` push travel `dz .03-.25` against `STYLE.md:62` "The open push is under six percent; a portrait iris or macro prop may push to twelve percent" — a 25% push is 4× the signed limit. `type.families` has 6; `STYLE.md:48` "There is no fifth family". `palette.maxRolesLong: 7`; `STYLE.md:11,89` "Four colours in a frame". `cast.totalMax: 7`; `STYLE.md:11` "Up to two performers". `envelope.durationFormats` includes 156.6; `capabilities.limits.durations = [30,45,60]`. The prose now *admits* one of these ("the pack should be reconciled to one cap", §3.3.5) and parks another (§9 Q2), but every value still ships as `I`. |
| **P0.3** One colour cap | **NOT FIXED** | Three caps remain and the doc now states all three explicitly: `tokens.color.maxColours: 4`, `identity.palette.maxRolesShort: 5`, `identity.palette.maxRolesLong: 7`. §3.3 rule 5: "Max 5 roles in a 30-60 s film; 4-7 in a long film. The pack's `maxColours: 4` is the default, not the ceiling". `forbidden` carries both `more-than-7-roles` and `more-than-5-roles-in-a-short`. There is also no **minimum**: §3.3 says "4-7 roles" and "4-5", the JSON has only `maxRolesLong`/`maxRolesShort`, so a one-role diagram passes. |
| **P0.4** Static: decide once | **PARTIAL** | The spec decided: `identity.camera.moves` keeps `static`, `staticMax: 0.10`, `movingShare [0.90,1.0]`, and §3.14 requires "a 0.02%/frame creep **or** a character action". That is a coherent grammar. But (i) `camera:check` still refuses every `static` (`src/engine/camera.ts:87-93`, `camera:static`), so the identity cannot be implemented without changing it; (ii) `identity.camera.holdCreep: 0.0002` = 0.02%/frame → **1.8% over a 3 s shot**, above the 1.5% per-shot cap in §3.14 (2.5 s is the break-even, and the edit median is 2.8 s); (iii) the escape hatch ("or a character action") has no `when` in the record, so a checker cannot express it. |
| **P0.5** One cast limit | **PARTIAL** | The arithmetic is fixed: `principals [1,2]` + `chorus [0,5]` = 7 = `totalMax: 7`. But `capabilities.limits.maxCast: 2` and `tokens.identity.cast.max: 2` both still exist, `resolveFilm` reads neither, `style:identity` reads the token (so a 7-cast film fails today), and §9 Q2 leaves the count as an open product decision. Two limits plus an open question is not one limit. |
| **P0.6** Camera axes not in the score | **PARTIAL** | `identity.camera.keys: {value:["t","x","y","z","roll"], scope:"F"}` now names the extension, and §3.14 has a schema note. But it is a **list of key names**, not a schema: no type, no unit per key, no per-move mapping (`pan` → which key moves how far), and `scope: "F"` says a film may *choose not to have keys*. `treatment.ts:69-76` is unchanged `{move, from, to, ease}`, and three units still share the name `dz`: score `from/to` is a scale multiplier (`1 → 1.08`), md travel is a fraction (`.03-.25`), `style:measure` reports **percent over the shot** (`CameraMove.dz`). A 20% push is 0.20, 20 or 1.20 depending on the reader. |
| **P0.7** One type scale | **NOT FIXED** | `identity.type.size16x9` = subtitle **31**, body **44-84**, label **7-18**, monogram **72-160**. `scripts/type-audit.ts:123` sets the floor from `tokens.type.scale.label` (14) authored at 390 px, scaled to the film: **14 × 1920/390 = 68.9 px**. So the spec's subtitle is 2.2× below the floor, its body 1.5-2.9× below the pack's 128 px, its label 3.8-9.8× below the pack's 69 px. `size9x16` is the only part that matches. The doc now explains the 9:16 side and leaves the 16:9 side contradicting `audit:type`. |
| **P0.8** Arithmetic impossibilities | **NOT FIXED** | (a) `voice.wordsPer30s [90,95]` with `firstWordS 1.0` + `lastWordS 1.5` → 27.5 s of speech = **82.5-87.1 words**; 90 words at 190 wpm runs 28.4 s (film ends 29.4 s), 95 words at 180 wpm runs 31.7 s. (b) `edit.formats.30s.shots [9,12]` with `cutsPerMin [18,24]`: 9 shots = **16.0** cuts/min. See §2.4 — all three short rows are off by one, on both ends. (c) hero `1.10-1.34` × `cast.heightUnits 580-760` = up to **1,018 px = 94.3%**, above `composition.subjectHeight` max 0.92; inset `0.22 × 580 = 127.6 px = 11.8%`, below min 0.13. (d) `composition.floorLine [0.65,0.88]` (702-950 px) vs `field.horizonPx [780,900]` vs `composition.castFeetY [1000,1012]` — three lines, two objects, no discriminator. |
| **P0.9** Subject and field instruments | **NOT FIXED** | `checks.probe`: "paint probe records a character bbox (min/max of rig anchors)". The probe records `__rigRecords` (leg IK solves and limb endpoints) and `__textBoxes`; the library's 8 anchors are *points* (`face`, `hair`, `hand-left/right`, `foot-left/right`, `chest`, `waist`) with no head top, hair extent or sole. A min/max over 8 landmarks under-reports height by the head and feet — the whole band. `checks.frames`: "style:measure adds p5/p50/p95 + 3x3 region grid", which my v1 critique showed cannot measure local contrast, field share or horizon. |
| **P0.10** Variation and archetype unprovable | **PARTIAL** | `identity.variation` now has `requiredDifferences` (10), `historyFilms: 3`, `motifDiff: 2` and a fourth-use rule in §3.24 — a real grammar. But the record lives at **`build/variation.json`** (§3.24 "History"), and `.gitignore` contains `build/`: the history that must survive three films is in a directory the repo deletes. `variation:check` is `"variation:check (proposed)"`. `cast.archetype` is still one string and `cast.performerTest` is six prose sentences; the library has no `archetype`, `heightClass`, `headToBody` or `hairLayers`. |
| **P0.11** Reference path pack-relative | **NOT FIXED** | `reference.film: "Y:\\NewVideoTest\\out\\claude-pop.mp4"` (JSON line 9) and the md header line 6, 1445. `STYLE.md:138` decision *Independence*: "no other style, no external asset, no network and **no drive path**". `surfaceReference` is repo-relative and correct; the film is not, and there is no `sha256`. |

**Tally: 0 fixed, 5 partial, 6 not fixed.** Two things did get fixed cleanly and should be said:
`composition.subjectArea` is deleted and §3.6 now says "Do not use subject area as a band" (C13);
and the 13-vs-11 joint count is now 13 in both the prose and `cast.joints` (C34, half).

---

## 2. Re-checks

### 2.1 Duplicate concepts

Fourteen concept pairs survive inside the extension, plus ten blocks that duplicate an existing
source (section 6). The pairs, with both paths:

| Concept | Path A | Path B |
|---|---|---|
| field share | `identity.field.share [0.18,0.6]` | `identity.palette.fieldShare [0.18,0.6]` |
| largest flat | `identity.field.largestFlat [0.04,0.46]` | `identity.palette.largestFlat [0.04,0.46]` |
| edge bar | `identity.field.edgeBarMax 0.08` | `identity.composition.edgeBarMax 0.08` |
| horizon | `identity.field.horizonPx [780,900]` | `identity.sets.horizonPx [780,900]` |
| cast feet | `identity.composition.castFeetY [1000,1012]` | `identity.sets.feetPx [1000,1012]` |
| object edge | `identity.light.objectEdgePx [1.5,4]` | `identity.edge.objectPx [1.5,4]` |
| type edge | `identity.light.typeEdge {ratio .055, minPx 2}` | `identity.edge.typeEdgeRatio .055 / .typeEdgeMinPx 2` |
| grip | `identity.props.gripPx 11` | `identity.interaction.gripPx 11` |
| motif recurrence | `identity.props.motifRecurrence 3` | `identity.motifs.uses [2,5]` (2 allowed, 3 required) |
| hold | `identity.edit.holdMaxS 0.4` | `identity.motion.freezeBudgetS 0.4` |
| creep | `identity.camera.holdCreep 0.0002` | `identity.motion.holdCreep 0.0002` |
| overshoot | `identity.movement.overshoot [1.03,1.06]` | `identity.motion.overshoot [1.03,1.06]` |
| squash | `identity.movement.squash` | `identity.motion.squash` |
| anticipation | `identity.movement.anticipationFrames` | `identity.motion.anticipationFrames` |

`movement.*` / `motion.*` is still the same block twice under two names, exactly as flagged in
v1. `freezeBudgetS` appears a **third** time in `identity.determinism.freezeBudgetS`, and `boilHz`
three times (`movement.boilHz`, `type.treatment.boilHz`, `determinism.textureHz.type`).

The script also found 7 exact numeric duplicate groups; only `0.08` (edge bar) is a true concept
collision — the rest (`2`, `7`, `8`, `0.05`, `1`, `3`) are coincidences between unrelated values.

### 2.2 The scope system

It exists and is the best new idea in v1.1, but it has three structural holes.

1. **It is block-level, and the blocks are mixed.** `hud` is one block whose records are `R`
   (`hud.box`), `I` (`hud.recurrence`) and `F` (`hud.mode`) in §3.27. The JSON gives the block
   `scope: "F"` and no per-field scope, so a checker reads a reference box as a film choice.
   Same for `sound` (`sound` block `I`, `sound.song` `R`, `sound.voice` unmarked) and `cast`
   (`cast` `I`, `chorus` `F`).
2. **`scope` sits at three different levels.** Sometimes it is on the block (`palette` is `I`, with
   `maxRolesShort` overriding to `T`), sometimes on a row object beside its values
   (`edit.formats.30s` has `"scope": "T"` as a sibling of `shots`, `medianS`, `minS`, `maxS`,
   `cutsPerMin`), sometimes per record (`palette.blueOnBlue`). A leaf walker has to know the
   convention, and §4.1 does not state one. The three short-format rows — the only place the
   30/45/60 bands exist — carry their five values as **bare arrays with no `unit`**; the script
   finds only **2 records in the whole file whose own object carries `scope` at the leaf**
   (`envelope.durationFormats`, `palette.maxRolesShort`). Same for `type.size9x16`,
   `props.sizeClass`, `camera.byBeat`.
3. **`scope` is not on 310 leaves.** 77 records use `value`, 55 use `range`, **310 leaves are
   bare** (numbers, arrays, strings). §4.1 says "Each record has an id, a value or range, a unit, a
   scope, a basis, a measure and a source." The file has **no `measure` field, no `source` field,
   and no per-record `id`** anywhere (script-verified). A generic reader would have to know that
   `medium.mottles` is a record and `medium.paper` is a colour and `edit.formats.30s.shots` is a
   count, from the key name alone.

`basis` vocabulary is also not closed. §1.1 lists six values; the file uses `"code/target"`,
`"code/film"`, `"reference"` (`hud`), `"reference-comparison"` (`camera.crashMax`) — four
non-conforming values, two of them composites.

### 2.3 JSON size and structure

| Measure | v1.0 | v1.1 |
|---|---|---|
| bytes | 251 records, second document | **24,585** / 535 lines |
| top-level blocks | flat `parameters[]` | **25** named blocks |
| `value` records | 251 mixed | 77 |
| `range` records | 0 (used `value: [min,max]`) | **55** — the prose/schema mismatch is fixed |
| bare leaves | 0 (every leaf in a record) | **310** |
| `measure` / `source` per record | absent | absent |
| `op` / `when` / `tolerance` / `share` | absent | **absent** |
| prose or formula values inside the block | ~13 | ~20 (`type.reading "max(1.8, speech + 0.6)"`, `palette.script`, `interaction.feet/.eyeline/.crowd`, `tone.*` ×6, `opening.firstFrame`, `hud.mode`, `determinism.clock/.rng`, `cast.performerTest` ×6) |
| `$schema` | `paper-studio/style-identity@1` | same — **still no such file in the repo** |
| `status` | `research` (md) vs `research-proposal` (json) | **same mismatch** |

The compact block shape is the right direction. The label "schema" is still wrong: it is a
well-organised catalogue of values, not something a validator can walk. The example in §4.1
(`id`, `value`, `unit`, `scope`, `basis`, `measure`, `source`) is still not the shape of any record
in the file.

### 2.4 The 30 s arithmetic

The formula is `cuts/min = (shots − 1) / (duration/60)`. Run it against every row in §3.15:

| Format | Row says shots | Row says cuts/min | Shots that satisfy both | Error |
|---|---|---|---|---|
| 30 s | 9-12 | 18-24 | **10-13** | low end 9 → **16.0** |
| 45 s | 13-17 | 17-23 | **14-18** | low end 13 → **16.0** |
| 60 s | 17-22 | 17-22 | **18-23** | low end 17 → **16.0** |
| 156 s | 48-57 | 18-22 | 48-58 | ok |

All three short rows are shifted down by one at both ends. The error is systematic, not a typo:
the shot counts were copied from the reference's distribution and the cut rate was derived
separately. One formula fixes all three.

The word ceiling is separate and unchanged: 27.5 s of speech at 180-190 wpm is **82.5-87.1**
words; `wordsPer30s` says 90-95. And the `distribution` still sums 0.88-1.15 while every band
looks satisfied, and `framingMix` sums **0.75-1.30**.

### 2.5 Camera schema — keys vs `from`/`to`

- `from/to` is and remains **the only implemented schema** (`treatment.ts`, `camera:check`,
  the painter's `shotCam`). `camera.keys` is a list of five key names with `scope: "F"` and no
  type, no units and no per-move mapping.
- The unit ambiguity is unresolved in three places at once: score `from: 1, to: 1.08` (scale),
  md "dz .03-.25" (fraction), `style:measure` `dz` (**percent over the shot**, e.g. `+20`).
- `camera.seam` (`speedJump .35`, `accelJump .50`) still has **no unit and no baseline** — ratio
  of px/frame, px/s or scale/s? §3.14 labels it `ratio/deg`, which is not a unit for either number
  and is a composite even if it were.
- `camera.byBeat` is a grammar table with `scope: "F"`, so a film may choose to ignore it; and
  `release: "pull_back"` still disagrees with `tokens.motion.camera.byBeat.release: "orbit"` and
  with `src/engine/camera.ts:52-59` (`release: "orbit"`), which the JSON does not cite.
- `tokens.motion.camera.moves` has 5 (`static, push_in, pull_back, pan, orbit`) while
  `STYLE.md:62` has 6 (adds `tilt`) and `camera:check` uses the engine's 6 (`src/core/style.ts`).
  The pack is already inconsistent before the spec adds five more.

### 2.6 The one colour cap

`tokens.color.maxColours: 4` (read by `style:check`), `identity.palette.maxRolesShort: 5`,
`identity.palette.maxRolesLong: 7`, and the prose now names all three. There is no min, so
"4-7 roles" cannot fail a 2-role frame. `palette.fieldRoles` lists **13** names of which **7**
have no hex in `tokens.color` (`kraft`, `teal`, `oxblood`, `orange`, `green`, `pink`, `cream`) — a
role without a value is not a role. The measurement the cap needs (per-pixel nearest role within a
deltaE threshold) still does not exist; `palette-audit` counts a hardcoded 70-170° hue band.

### 2.7 The one cast limit

`cast.totalMax: 7` vs `capabilities.limits.maxCast: 2` and `tokens.identity.cast.max: 2`. The
`resolveFilm` schema does not read `maxCast`; `style:identity` reads `tokens.identity.cast.max`,
so the pack refuses a 3-person film while the identity permits 7. §9 Q2 postpones it.

### 2.8 The one type scale

Quantified in P0.7. At 1920 the pack sets caption **88.6 px**, body **128 px**, label **68.9 px**,
monogram **177 px**; the spec sets subtitle **31**, body **44-84**, label **7-18**, monogram
**72-160**. Only `display` overlaps (pack 315 px; spec 92-376). The two scales differ by a
**constant factor of ~2.9×**: the pack sets type at 4.6% of frame width, the reference at 1.6%.
That is the actual decision — is the channel's type large (pack) or television-small (reference)?
The doc does not make it, and it is not in the nine P0 fields.

### 2.9 The one static decision

Decided in prose (static ≤10%, with creep **or** a character action), not in the machine:
`camera:check` still errors on `static`, `holdCreep` still yields 1.8% at 3 s against a 1.5% cap,
and the "or a character action" disjunction has no field. §8.2 item 5 asks `camera:check` to read
the token vocabulary — which would make the check accept `static` without ever measuring the creep.

### 2.10 The probe bbox

Still `min/max of rig anchors`. The anchors are 8 named **points**; the rig records are limb
endpoints and leg solves. There is no drawn-card bound, no head top, no sole, no hair extent. A
character 57.8% tall measured this way reads short by the head and the boots — the exact band
`composition.subjectHeight [0.13,0.92]` is calibrated to. `checks.probe` names the instrument,
but the instrument named sees the wrong thing.

### 2.11 Field / role classifier

Absent. `checks.frames` proposes the 3×3 region grid; §5.1's Field and Composition rows say
"frame probe", which is not a command in this repository. A 3×3 grid on 1920×1080 gives 640×360
cells; a subject at 3% of the frame is ~27% of one cell, so the cell mean is a blend, not the
field. The field must be the **largest connected near-uniform region touching both side edges**,
with its share, role (nearest role hex within deltaE) and horizon (top edge). None of that is
specified as an instrument. Without it the headline fix — "no side bars, no cream plate" — can
still pass the Uber film's 19% wings, because `largestFlat` measures the *plate* (26.8%), not the
bars.

### 2.12 Local contrast ring

Absent. `identity.palette.localContrastMin: 20` and `.localContrastMedian: 35` have `unit:
"luma"` and no instrument. The only proposal is the 3×3 grid. The measurement is a subject box
plus a dilated ring at **full resolution**, per shot; that is one small function and it is the
difference between invariant 7 being a picture and being a score claim.

### 2.13 `variation.json`

`build/variation.json`. `.gitignore` contains `build/`. A three-film history in a generated
directory is a history that does not exist on a fresh clone or in a blind run. It also has no
record shape (previous id, score hash, the ten axes, the signature shot), so "a fourth use of the
same value" cannot be computed — only four booleans can. `variation:check` is still `(proposed)`.

### 2.14 The acceptance test

It is now written (§5.5, `checks.acceptance`) — that is a genuine addition and it is the right
test. It still cannot be run, for four reasons:

1. `style:identity` **requires a score** (`FilmScoreSchema`, `scripts/style-identity.ts:35`). The
   reference film has no `score.json`; §5.5 says "Run `style:identity` on both films". The
   reference has no cut list in the repo, and `style:measure` without `--score` reports **238
   shots** on it (12 Hz boil). So the reference cannot be scored today.
2. `style:identity` reads five global means and the cast rule. It has no field, centroid, height
   sd, local-contrast or motif check, so none of the five named gaps is measured.
3. The reference itself **fails its own rules**: `centroidX` requires "`.30-.75` in >=80% of
   shots" (§3.7) while §3.6 measures **38/49 = 77.6%** in the centre third; and `blueOnBlue: false`
   (X) against §3.3 "The reference trips this in 1/49 shots". §5.3's "0 sustained" is a predicate
   defined nowhere in the JSON.
4. The expected failure set is stated **three different ways**: md §5.5 "at least field, centroid
   x, height sd, local luma contrast and motifs — and on blue-on-blue/side bars" (7); JSON
   `checks.acceptance.uber` "must fail **exactly** field, centroid x, height sd, local contrast,
   motifs" (5); md §7 "archetype, field, placement, local contrast, motifs" (5, a different 5).
   An acceptance test with three expected outcomes is not an acceptance test.

---

## 3. Markdown vs JSON, and inside each

Stated once, with the exact field. These are the ones that make a checker guess.

1. **`tones` is missing from the JSON.** §4.3 item 3 and §8.2 item 1 require
   `tokens.identity.tones` (luma p5/p50/p95, contrast p5, saturation p95); §5.3 publishes the film
   bands (luma 75-130, p5 20-60, p50 80-140, p95 160-200, contrast p5 175-210, saturation 12-35,
   sat p95 30-60, edges 7.5-17.5, palette ≤55). **None of these numbers is in the companion.** The
   JSON has `referenceValues.referenceMeanLuma` (a fact) and no band. The one thing that fixes the
   crops-vs-film miscalibration — the most valuable idea in the document — is prose only.
2. **`bands.basis` is missing.** §4.3 item 2. The JSON has no `bands` at all, so the existing
   `tokens.identity.bands` (±20/±25/±10/±5/±45, calibrated to the six crops) is untouched and the
   JSON cannot say which reference a band belongs to. Seven of the nine P0 blocks exist; these two
   do not.
3. **`camera.byBeat.release`** = `pull_back` (JSON) vs `orbit` (`tokens.motion.camera.byBeat`) vs
   `orbit` (`src/engine/camera.ts:57`) vs "pull_back or hold" (§3.14). Unchanged from v1.0.
4. **Halftone alpha is now three values.** `identity.medium.halftone.alpha [0.11,0.18]` vs
   `tokens.medium.halftone.alpha 0.5` vs the painter (`canvas/recipes.js` calls
   `halftone(..., 0.13 / 0.2 / 0.09 / 0.07 / 0.05 / 0.09)`). The JSON is *closer to the painter*
   than the token is — which is the drift my v1 critique predicted, now measurable.
5. **Words per slot.** `type.maxWords: 8`, `type.subtitleBox.maxWords: 9`, and §3.19's
   `lyric wall | >8 words / >2 lines / >2 boxes` (X). A 9-word subtitle is allowed and forbidden.
6. **Three shot minima and two maxima in one block.** `edit.minS: 0.6` (I), `edit.formats.30s.minS:
  1.2` (T), `tokens.motion.minShot: 1.2`; `edit.maxS: 6.2` vs `formats.30s.maxS: 5.0`. The `T`
   sits on the row and the `I` sits one level above it, with no precedence rule; a reader must
   guess which one a 30 s film is checked against.
7. **`accentPerFrame: 1`** vs `STYLE.md:38` "it recurs at least twice in a film, **not in every
   frame**". §3.3 rule 4 still reads "One accent per frame, at least two per film". The record has
   no `op`, so it cannot be checked either way.
8. **Pose keys: 11 or 12.** §2 #12 and §3.11's count column say **11**; the list beside it has
   **12** (`bounce, sway, lean, headTilt, headTurn, hairSwing, petalDrift, armL, armR, legL, legR,
   flip`); the JSON has 12. Kiran's poses use `footL`/`footR`, which are in neither list.
9. **Joints: 13 now matches itself, not the rig.** `cast.joints` 13 = §3.9's 13, but
   `capabilities.assets.rigs.lead.joints` has **11** different names (no wrist, waist, head pivot
   or head centre; hyphenated `shoulder-left`). A check against either list fails the other.
10. **`variation.requiredDifferences` has 10 entries; §3.24's table has 12.** The JSON drops
    "sound mode" and the separate closing difference. §0's "ten things" and §3.24's twelve rows
    are also not the same list.
11. **Centre third: 78% observed, 80% required, 100% implied.** §3.6 says 38/49 = 78%;
    §3.7 says "`.30-.75` in **>=80%** of shots"; `identity.composition.centroidX.range [0.30,0.75]`
    has no `share`, so it means every shot. The reference fails the 80% rule.
12. **`blueOnBlue`.** X false, but the reference trips it 1/49. §5.3 writes "0 sustained", a
    predicate that exists in no record. There is no `allowedShare` and no `sustainedFrames`.
13. **`headToBody [7.0,7.5]` vs "head centre .80-.92 of height".** 7.0-7.5 heads puts the head
    centre at **0.929-0.933**; 0.80 implies a 2.5-head figure. No origin is stated for the
    percentage. One of the two is wrong (the heads value is the one the library can hold).
14. **Motif library vs anti-copy list.** `motifs.library` still contains `paperclip` and `meter`;
    §3.24: "What must never be copied from the reference film: … the DOOM meter, the paperclip".
    `props.motifRecurrence: 3` still outranks `motifs.uses [2,5]`, so a 2× motif is allowed and
    refused.
15. **`warmShare` has no membership list.** §3.3 defines warm as "red, oxblood, orange, kraft,
    cream, gold, **teal**"; the JSON has the band and no list, so the metric cannot be computed.
    Teal is cool; the reference's teal rooms are why the band is 0.40-0.90.
16. **Field ≤ largest flat is still unstated.** `field.share` max 0.60 > `field.largestFlat` max
    0.46. The field *is* the largest flat colour region, so the extra 0.14 is dead and the
    inequality should be a checked relation, not two bands.
17. **Negative space + text + subject.** `negativeSpace 0.97` + `textArea [0.02,0.06]` + subject
    >100%. §3.6 says negative space is "not subject", so text is inside it; the three are not
    independent shares and the JSON does not say which population each counts.
18. **`props.sizeClass` overlap.** handheld `[0.08,0.30]`, body `[0.30,0.50]`, hero `[0.40,0.90]`:
    a 0.30 prop is handheld *and* body; a 0.45 prop is body *and* hero.
19. **`type.maxSystems: 2` vs six families / five roles.** "One display + one mono" is not a
    membership list; `body` (Archivo Black) is neither, so a poster with hook + body + label is
    three families and a style break, or two systems and a third family. Undefined.
20. **`156.6` is five numbers.** `envelope.durationFormats 156.6`, `edit.formats."156s"`,
    `referenceValues.durationS 156.63`, md header 156.63, md §3.15 156.62, reference frames 4,699
    vs `G-studio-gap.md` 4,698 (156.63 × 30 = 4,698.9).
21. **`status`** `research` (md §4.1) vs `research-proposal` (JSON line 5). Unchanged.
22. **`edit.distribution`** sums 0.88-1.15; **`transitions`** designed share can reach 0.37
    against a 0.10-0.20 band (iris 15 + flash 8 + wipe 4 + match 6 + hold 4); **`framingMix`**
    sums 0.75-1.30; **`pushPullShare [0.30,0.45]`** vs its own components, push 25-35 + pull 8-15 =
    **0.33-0.50**.
23. **`palette.fieldRoles`** lists 13, 7 without hex.
24. **`basis: "reference"`** on `hud` and **`"reference-comparison"`** on `camera.crashMax` are not
    in the six-value vocabulary; `"code/film"` and `"code/target"` are composites.
25. **`medium.paper`** and three neighbours are bare strings — the only records in `medium` that
    are not objects — so `medium` cannot be validated uniformly.

That is 25. Six are new in v1.1 or newly measured (1, 4, 10, 11, 13, 24); the rest are v1.0
findings that have not moved. Most are one-line fixes. None of them can be fixed by a reader.

---

## 4. Is the compact extension really an extension?

**Mostly no — it is an extension in size and naming, not yet in ownership.** Ten of the 25 blocks
restate a source that already exists, and two blocks restate each other. The two blocks that would
make it an extension are the two that are missing (items 1 and 2 in §3).

**Cut — the source already owns it:**

| Field to cut | Move to |
|---|---|
| `identity.medium.*` (paper/paper2/paper3/ink, `fibre`, `grain`, `paperOverlay`, `grainOverlay`, `halftone`, `vignette`, `tornEdge`, `layerOrder`, `print`) | `canvas/recipes.js` + `tokens.medium`. The identity needs a *measured* band (`paperAreaMin`, `edgePx`, `halftoneShare`), not the painter's constants. `layerOrder` is byte-identical to the token. |
| `identity.palette.roles`, `.dayStage`, `.nightStage` | `tokens.color` — byte-identical today. `referenceDominant` → evidence. |
| `identity.type.families`, `.size16x9`, `.treatment` | `tokens.type`. `size9x16` → `tokens.layout.aspectScale["9:16"]` (identical minus `floorPx`). |
| `identity.camera.model`, `.moves`, `.byBeat`, `.zRange`, `.rollDeg`, `.shakePx`, `.motionBlur` | `tokens.motion.camera` — one move list, one beat table. |
| `identity.sound.*` | `tokens.sound` + `docs/GATES.md` + `src/engine/sfx.ts`. |
| `identity.voice.*` | `story.pace` (0043) + `preflight` (0044). |
| `identity.sets.*` | `envelope.planes` + `field.horizonPx` + the set code. `sets.layers` is a **third** copy of the layer stack. |
| `identity.props.*` | `capabilities.assets` + recipe props. |
| `identity.hud.*` | reference evidence (all R). |
| `identity.envelope.canvas/.fps/.durationFormats` | `capabilities.limits` + the score. |
| `identity.type.maxWords`, `.maxBoxes`, `cast.totalMax` | `capabilities.limits`. |
| `identity.determinism.*` | `tokens.seed` + decision 0032. |

**Merge inside the extension:** `movement.*` → `motion.*`; `field.share` → `palette.fieldShare`;
`field.largestFlat` → `palette.largestFlat`; `field.edgeBarMax` → `composition.edgeBarMax`;
`field.horizonPx` → `sets.horizonPx`; `composition.castFeetY` → `sets.feetPx`;
`light.objectEdgePx` → `edge.objectPx`; `light.typeEdge` → `edge.typeEdgeRatio`;
`props.gripPx` → `interaction.gripPx`; `props.motifRecurrence` → `motifs.uses`;
`edit.holdMaxS` → `motion.freezeBudgetS`; `cast.scaleLadder` → `composition`;
`composition.floorLine` and `field.horizonPx` need names that say which line is which.

**Add — the extension that is actually missing:**

1. `identity.bands` (crops) + `identity.tones` (film) + `bands.basis`, carrying §5.3's values.
2. `identity.localContrast { min, median, share, instrument }`.
3. `identity.field { fullBleed, share, largestFlat, edgeBarMax, allowedRoles (13 with hexes) }`
   with the field defined as the edge-touching component.
4. `identity.motifs` minus the reference-only two, with one `uses` rule.
5. `films/<id>/variation.json` as a durable record (previous id, score hash, ten axes, signature).
6. `cast.performerTest` as six checkable fields (construction, stageRole, face, head,
   performance, scale), not six sentences.

After that the extension is ~12 blocks, ~60 records, one path per concept — which is the document
§4.2 says it is.

---

## 5. What v1.1 gets right

Worth recording, because the next pass should not undo it.

- **§0.1 reference vs target.** `R / T / I / F / V / X`, one sentence each, and "if a band fails the
  reference film, the band is wrong". That is the correct frame and it is new.
- **The JSON is no longer a second document.** 251 → 132 typed records, 25 named blocks, a
  `referenceValues` side-table for the observed facts. `range` replaces `value: [min,max]`.
- **Cast arithmetic closed** (2 + 5 = 7 = `totalMax`), and `subjectArea` deleted with a rule that
  says why.
- **Camera grammar is now defensible.** `movingShare 0.90-1.0`, `staticMax 0.10`, `maxRun 2`,
  `distinctMoves 4-8`, and §3.14's "the share bands are independent budgets, not a partition; a
  world move may also be a push, and a crash may also be a track" resolves my C5 — a 4-move film
  *can* cover five categories if `crash` counts as lateral. (The JSON carries the five bands
  without the overlap rule, so a checker reading only the JSON would still refuse it.)
- **§5.5 exists.** The two-film test was the missing acceptance criterion; it is now written, and
  the shape of it is right even though it cannot run yet.
- **The open questions are honest.** Music, cast count, 9:16, archetype detection and tone are
  parked by name, not papered over.

---

## 6. Score

**6 / 10** for implementability without over-engineering.

The prose is 8-9 and the JSON's *shape* is now 5-6 (was 3). The gap is entirely in three places:
a record shape no command can read generically, two instruments pointed at the wrong data, and a
handful of pass/fail numbers that still contradict each other. A developer can now see where the
blocks go; they still cannot write the checker without inventing `op`, `when`, `tolerance` and
`share`, and they cannot make the reference pass the bands the document calibrates to it.

### Blocking issues — must fix before any implementation

**B1. The record shape, and the two missing blocks.** Add `op` (`min|max|eq|in`), `when`
(`aspect|format|mode`), `share` (0-1) and `tolerance` to every scalar and percentile; add
`measure` and `source` per record (or delete the claim in §4.1); and put `identity.bands`,
`identity.tones` and `bands.basis` in the JSON with §5.3's values. Without this the 132 records are
notes — the same failure as v1.0, smaller.

**B2. The instruments.** A subject box from the **drawn card bounds** (head, hair, torso, hands,
feet), not 8 anchors; the field as the **largest connected near-uniform region touching both side
edges** with share, role and horizon; local contrast as the subject box plus a dilated ring at full
resolution. Delete "3x3 region grid" and "frame probe" from §5.1 and `checks.frames`. Until these
exist, invariant 4 and invariant 7 are score claims, and the acceptance test cannot run.

**B3. Signed-pack reversals.** Either paper-kpop **0.3.0** (contract-change PR, new card, new
seal, gate re-run) or adopt the signed values: 6 moves (no handheld, whip or shake; push < 6%),
5 families, 4 colours, 2 cast, 30/45/60 s, the pack's type scale. The document cannot keep
declaring a reversal as `I` and also call itself an extension.

**B4. The pass/fail arithmetic.** One colour cap (4, 5 or 7 — and add the minimum); one type
scale (decide 1.6% or 4.6% of frame width and change `tokens.type.scale` or the spec); one cast
limit; the three short-format rows corrected to 10-13 / 14-18 / 18-23; `wordsPer30s` to
`[75,87]` or deleted; hero/inset rebased (`hero ≤ 1.29`, `inset ≥ 0.25`, or `subjectHeight` to
`[0.11,0.95]`); `holdCreep` to `0.0001667` (1.5%/90) or the cap to 2%/s; the distribution and
transition sums checked as totals.

**B5. The reference and the acceptance test.** The film in the pack
(`styles/paper-kpop/references/film/…` or a 30-frame sample) with a `sha256`; a reference cut list
in the repo so `style:measure --score` and `style:identity` can run on it; one expected-failure
list, not three; and a blue-on-blue predicate with a stated `allowedShare` that the reference's
1/49 passes.

With B1 and B2 the score is 7. With B3-B5 it is 8-9 and the sign flips.

## 7. Sign

**NO.**

v1.1 is the right diagnosis with a much better-shaped artefact, and it is close. It is still not
implementable as written: the bands cannot be read, the two instruments see the wrong thing, and a
film that follows the document fails the pack it claims to extend on colour, type, cast, camera,
transitions and duration. Fix B1-B5 and this becomes a contract. Ship it as-is and the next agent
will build a twelfth block called `identity` that duplicates `tokens.json` and a checker that
compares a number to itself.
