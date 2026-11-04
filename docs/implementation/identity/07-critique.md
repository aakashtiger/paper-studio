# 07 — Critique and final implementation order

**Status:** critic's ruling. This document changes no code and no plan file.
**Date:** 4 November 2026
**Inputs:** `KPOP-IDENTITY.md` v1.3, `kpop-identity.proposed.json` 1.3.0, plans 01–06.
**Read against:** `src/core/style.ts`, `src/engine/style-identity.ts`,
`src/engine/treatment.ts`, `src/engine/paint-probe.js`, `src/engine/film-new.ts`,
`scripts/style-identity.ts`, `scripts/collage.ts`, `scripts/preflight.ts`,
`scripts/render-film.ts`, `scripts/gate-7.ts`, `scripts/film-review.ts`,
and the artifacts in `build/uber-model/`.

---

## 0. The verdict in one page

Seven plans were written in parallel against one research document. Individually
each is careful; together they are **three schemas for one fact, four new
commands for one question, and five gate rows for one report**. That is the
failure mode the repo's own `AGENTS.md` forbids ("a 200-field schema that no
check reads", "every feature ships with a command that proves it works").

The research is not the problem. §5.5 of the spec — *the reference must pass,
the Uber film must fail on the named axes, the surface must stay in band* — is
the right acceptance test and every plan agrees with it. The problem is that the
plans disagree on **which number the report prints**, and on **whether an old
film is allowed to be silent**. Both must be settled before a line is written.

**Ruling.** Ship a smaller core than any of the seven:

| | Plans 01–06 as written | This critique |
|---|---|---|
| New commands | 4 (`frame:report`, `identity:rules`, `identity:accept`, `--check`) | **2** (`identity:accept`, `render:film --check`) |
| New engine modules | 4 (`identity.ts`, `frame-report.ts`, `identity-rules.ts`, `frame-report.ts` again) | **2** (`identity.ts`, `frame-report.ts`) |
| Score blocks | 3 different shapes | **1** shape: 3 film blocks + 1 shot field |
| Pack blocks | 3 different shapes | **1** shape: 9 groups, ~46 leaves |
| Gate rows | +1 (04) to +4 (05) | **+1** (`preflight`) |
| Truth sources for "is this the channel" | 3 reports | **1** (`style-identity.json`) |
| Variation ledger | 4 proposed homes | **0** (review row) |
| New tests | ~52 | **~45** |

The numbers are not an argument by themselves, but the direction is: **every cut
below removes a second opinion about a fact the repo already measures.**

**Score as written: 6/10.** Implementability 6, identity coverage 8, simplicity 3.
**Score after §2–§3: 9/10**, and that is the plan this critique signs.

---

## 1. The conflicts, grouped, and the ruling on each

A conflict is not a mistake — it is where two agents measured the same thing and
named it differently. Each row below is decided once, with the reason, so the
implementer never has to choose. The eleven the brief named are all here (N1–N9,
R1, M1, M7, H1–H3); the rest were found reading the plans against the code.

### 1.1 Names

| # | Conflict | Where | Ruling | Why |
|---|---|---|---|---|
| N1 | **Two names for the same five numbers**: `bands` (06, today) vs `surfaceBands` (01, 04) | 01 §0.4, 06 §2.1 | **Neither.** Delete the delta band entirely. The film is judged on `filmBands` only; the six crops remain the *style's* surface evidence for the acceptance command. | The delta band is the source of the whole two-reference problem: the reference film fails 4/5 of its own crop bands (−44.9 luma, −30.4 contrast, −18.0 saturation, palette 48.28). 01 solves that with two band sets, 04 with a hero-frame specimen, 06 by asserting the failure. One measurement, one band set, no contradiction. |
| N2 | **`filmBands` shape**: 12 leaves (01) vs per-band `{min,max,statistic,basis,owner,gap}` objects (06) vs none (02/05) | 01 §3, 06 §2.1 | **3 leaves: `lumaMean`, `saturationMean`, `edgesMean`.** No metadata objects. | 06's own ledger marks p5/p50/p95/contrastP5/satP95 as `ref-only` — six numbers with no Uber verdict and no gap role. Provenance belongs in decision 0053, not in a schema-inside-a-schema. Three full-film means with real separation (ref 100.88 / 21.83 / 12.57; Uber 144.76 / 35.69 / 10.39) carry "the cream plate has no deep darks" at 900-frame coverage. |
| N3 | **`stagedRatio` 0.5 vs `stagedShare` 0.85 vs `presenceMin` 0.85 as a second number** | 01 §10.1, 02 §6.4, 04 §2.2, 06 §2.1 | **One field, `cast.stagedShare: 0.85`.** Delete `presenceMin`. | Two numbers for "how much of the film stages a performer" is exactly the duplication this repo's docs exist to prevent. 0.5 was an under-check; 0.85 is the spec's §3.30 presence figure. Uber stages 9/10 and passes it — which is correct: Uber's failure is not presence, it is field and placement. |
| N4 | **`maxCast: 2` vs `principals 2 + chorus 5 = 7`** | 01 §3/§6, 02 §11 risk 5, 05 §1.1, 06 §2.1 | **Principals only, max 2. No chorus in v1.** | 02's own risk 5 names the deadlock: a chorus must be `score.cast` names, and `style:identity` refuses more than 2 `score.cast` entries. There is no chorus rig, no formation system, and no song film. The reference chorus is `R`, not `I`. Park it and name it; do not ship a rule the painter cannot satisfy. |
| N5 | **Three score shapes**: top-level `performance`/`paletteScript`/`motifs` + `shots[].motif` (02); `score.identity.{performance,motifs,variation}` + `identity.contract: 1` (05); `cast[].stageRole` + `shots[].field` + `shots[].motif: string[]` (06) | 02 §3, 05 §1, 06 §2.2 | **02's shape**, reduced: `performance`, `paletteScript`, `motifs`, `shots[].motif` (one string). | 02 is the only shape that is additive, needs no version marker, and keeps the painter and `score-data.js` untouched. 05's `identity.contract` is a *second* claim mechanism; 06's `cast[].stageRole` puts one fact in two places (the pose file owns the character). |
| N6 | **Four claim mechanisms**: `score.performance` presence (02), `identity.contract: 1` (05), `identityVersion` + `capabilities.identity.styleIdentity` opt-in (06), none (04) | 02 §2, 05 §1, 06 §2.4 | **None.** The pack declares the rules; every film is judged by them. Fields are optional *at the parser* (so old scores load and `film:new` can scaffold), required *by the check*. | A claim marker exists to let an old film pass. 04 rejects that ("Uber currently passes and must fail") and the user's goal is the same. "Optional at the parser, required by the check" is already this repo's pattern, and it needs no version table, no opt-in flag, and no `unwritten` advisory that reads like a pass. |
| N7 | **`shots[].framing` (4 tiers 02/06, 5 tiers with `insert` 05)** | 02 §3.4, 05 §5.3, 06 §2.2 | **Cut.** The frame report measures height sd and tiers directly. | A declaration the paint can contradict (02's own risk 7, 06's C12) is a second truth source. If the measurement exists, do not author the claim. This also deletes 05's close-up count and its `[0.20, 0.60]` band. |
| N8 | **`identity.edit` in the pack (01/02) vs preflight owns the cut (06)** | 01 §3, 06 §3.7 | **Cut from `tokens.identity`.** Preflight already owns pacing. | Uber passes edit (median 3.0, 18 cuts/min). A band that separates nothing, in a block that already has a real owner, is the "field no check reads". |
| N9 | **`tone` required (01) vs human (05/06)** | 01 §3/§9, 05 §1.5, 06 §8.2 | **Cut from the schema.** The register lives in `STYLE.md`, which the pack contract already requires. | Seven prose fields, one machine check (a poison accent must be a role), and a group whose only reader is a human. The template would then ship three placeholders; with `tone` cut it ships **one** (`filmBands`) — which is a much sharper rule: *the only thing a new style cannot copy is its own measurement.* |

### 1.2 Required vs optional

| # | Conflict | Where | Ruling | Why |
|---|---|---|---|---|
| R1 | **Every pack must declare identity, or be DRAFT** (01) vs **opt-in / N/A / legacy marker** (06, 05) | 01 §8, 06 §2.1, 05 §0 | **Required for a pack that declares a cast** (`capabilities.limits.maxCast > 0`). A pack with no cast has no film identity to declare and is reported `identity: not applicable — no cast`. No `capabilities.legacy` field. | `styles/watercolor` and `styles/watercolor-0.2.0` both have `maxCast: 0` and `assets.rigs: notApplicable`. 01 makes both DRAFT and changes two accepted packs' evidence for zero identity benefit. The cast rule is principled (identity governs a *film*; a still-image pack stages none), keeps two accepted packs REVIEWABLE, and deletes 01's `legacy`/`legacy-conflict` rules, messages and tests. |
| R2 | **Old scores keep passing silently** (02) vs **old scores fail** (04/05) | 02 §2, 04 "Names and ownership" | **Old scores parse; old films fail.** | 02's `identity:unwritten` advisory is printed and then not enforced. The repo's rule is "a missing band is a failure, not a pass" — an advisory that reads as a pass is the exact defect 0037 and the blank-frame audit were written to kill. |
| R3 | **Nullable measurement = skip** (today, `style-identity.ts:111`) vs **finding** (06 D-list) | `src/engine/style-identity.ts:110-111` | **Finding.** `null`/`NaN`/missing is `identity:unmeasured`, naming the field. | Confirmed in the current code: `if (value === null) return;`. This is a live silent pass and the cheapest real bug in the set. |
| R4 | **`identityHash` / `identityVersion` in the report** (06) | 06 §2.4 | **Keep the hash, cut the version string.** | The hash closes a real hole: widening a band in `tokens.json` would otherwise leave an old, passing report reusable. A version string is decoration on top of a hash. Do not bump the pack version (01 is right: no frame changes). |

### 1.3 Measurement

| # | Conflict | Where | Ruling | Why |
|---|---|---|---|---|
| M1 | **Frame report: 1 sample per shot** (04) vs **1 collage / 3 video** (03) vs **3 video with `expected: 30`** (06) | 04 §1.1, 03 §4, 06 §2.5 | **One sample per shot, at the collage frame, for both stages.** | 03's own v0 prototype proves one sample per shot catches every named Uber failure (bars 10/10, cx 0/9 in band, sd 6, local 1.7, blue 9/9, luma 151.8). Three samples buy a defect at the end of a shot, and cost a confidence class ("warn at low confidence"), two aggregation rules, and 3× the decode. Cut both. The delivered-video report then re-measures **the same ten times**, which gives a free self-check: the two reports must agree within a couple of points. |
| M2 | **Grid 192×108** (04) vs **480×270** (03) | 04 §1.2, 03 §4 | **480.** | At 192 an 8 % bar is 15 px and a 2 px edge is 0.4 px; 03 measured that the bar rule cannot be stable there. 03's row histogram is also the only detector that survives the case it must catch: on Uber a title card or a character covers ~70 % of the bar, so 04's full-column sd reads the bar as "not flat". |
| M3 | **Subject box: probe v2 exact box** (03) vs **chest/head aperture + `HEAD_FRACTION`** (04) vs **anchor union + head-ornament extent** (06) | 03 §3, 04 §1.4, 06 §2.5 | **04's aperture, v1. Probe v2 is P1.** | Measured in `build/uber-model/collage/probe.json` today: `chest.m · chest.local` gives x 259.0 / 1920 = **0.135**, the number the spec itself publishes (§7, `.136`). 03's exact box gives `.055/.920` — a *different* number for the same failure. Both are out of band, so the verdict is instrument-independent; the number is not. The aperture needs **no probe change, no painter change, no new paint pass**, and reproduces the spec's own figure. 03's exact box costs a probe v2 + a pad that under-measures a flower head by up to 16 points. Not a v1 buy. |
| M4 | **Local contrast: 30 % ring** (03) vs **inside-box vs dominant** (04/06) | 03 §6, 04 §1.4, 06 §3.3 B13 | **The ring, one number, never averaged with the other.** | The question is "does the figure separate from what is behind it". On Uber 13.65 the ring reads **1.7** (Kiran) and 32.7 (Vaz on tomato); the inside-box measure reads 12.64. Both fail a ≥20 floor. The ring is harder to game (a textured figure on a flat plate still reads low) and it is the number the report can explain. Report `visible`/`maskShare` beside it so a figure *painted over* is named as hidden, not as "Δ 0". |
| M5 | **Where the frame report is written**: `frame:report` command (03 §2) vs collage (04 §1.2) vs inside `style-identity` (06 §2.5) | 03, 04, 06 | **Collage writes `build/<id>/frame-report.json`; `style:identity` reads it and re-measures the video with the same module.** No `frame:report` command. | 03's own one-page answer says "no new command" and then defines one with three input modes. Two callers, one module, one artifact. The command's other modes (`--video`, `--times`, `--frames`) are the acceptance harness's job, not a product surface. |
| M6 | **Findings: report detail codes (03) vs gate codes (04) with an alias table** | 03 App. B, 04 §2.2 | **One code set — the report's.** No alias table. | The alias table exists only because two plans wrote names in parallel. `identity:field` → `identity:bars` + `identity:fieldPlate` loses information; the gate reads `pass`, the review prints the code verbatim. One name per finding. |
| M7 | **`camera.keys`** (02 §3.6, 04 §1.4) | 02, 04 | **Cut.** | 02 admits the painter does not read keys: "a film may declare keys and the picture will still move by `from`/`to`". That is a score that lies about its own picture — the Uber defect, reintroduced as schema. Add keys and the painter read in the same change, later. |
| M8 | **`events[].with/contact/interaction`** (02 §3.8) vs **cut** (06 §8.2) | 02, 06 | **Cut.** | No instrument can see a contact point; the check would be a coordinate with no verb ("declare it and you pass"). Floating props and clipped hands stay in `audit:body` + the human row. |
| M9 | **`shots[].text.behaviour`** (02 §3.7) | 02 | **Cut.** | Unmeasurable, and `audit:type` already owns text geometry. A second text authoring field that only feeds a count is decoration. |

### 1.4 History, migration, and blast radius

| # | Conflict | Where | Ruling | Why |
|---|---|---|---|---|
| H1 | **Variation history**: `build/variation.json` (spec §3.24) vs `styles/paper-kpop/variation.json` (04 §2.2.1) vs `docs/identity/variation.json` (05 §1.3) vs 3 report-only axes (06 §8.2) | four plans | **Cut for v1.** Opening/closing/motif-set difference is a `film:review` human row. | The ledger cannot refuse anything until film 4 exists, there are zero films under the contract, and the user has parked new films. It brings a file, a writer flag (`--record`), an append-only rule, an oscillation warning, a gate tie, a preflight rule and ~6 tests — for a check that is by construction dormant. One row on the review page costs nothing and is honest. |
| H2 | **Uber migration**: applied (02 §7.1) vs deferred (02 §7.3) vs seeded ledger (05) | 02, 05 | **Not applied, and not simulated in the file.** Test fixtures build the claimed film in memory. | Confirmed against `build/uber-model/render-manifest.json`: it pins `films/uber-model/score.json`, `library/characters/kiran/poses.json` and `vaz/poses.json`. Editing either makes `inputsHashed` fail on the delivered film, and `render:film` cannot restore the manifest because the new gate would refuse the film. That is a deadlock. The acceptance must use the film **as delivered**. |
| H3 | **Kiran/Vaz archetype profile** (02 §6.3) | 02 | **Cut the edit.** The library schema gains `archetype`/`stageRoles`/`appearance`; Kiran and Vaz are not edited. The finding is "Kiran declares no stage archetype"; the next character must declare one. | Same pinned-hash reason as H2, and it keeps the delivered film's gate green on everything except identity — which is the only red that should be there. |
| H4 | **Watercolor packs become DRAFT; the sealed blind pack becomes DRAFT** (01 §8) | 01 | **Neither.** Watercolor: no cast → N/A. Sealed blind (maxCast 2, no block): **one** expected-state change, `test/paper-kpop-gate.test.ts` → DRAFT / `identity-missing`; `gate/**` untouched. | The sealed pack is a copy of a pre-contract pack, so the refusal is true and recorded. Two accepted pack families and two gate tests do not need to move for this. |
| H5 | **Gate rows**: +1 (04) vs +4 (05: `identity`, `soundContrast`, `lra`, + type/rig ties) | 04 §6, 05 §7 | **+1: `preflight`.** 24 → 25. | `preflight.json` is written by the chain and read by nothing — a real hole, and the row costs five lines. 05's sound rows are P0.9, not identity, and they turn the one green film red for a reason unrelated to this work. Park them, named. |
| H6 | **Which report the gate trusts**: `style-identity.json` (04) vs a new `identity-rules.json` (05) | 04, 05 | **`style-identity.json`.** One report, one verdict, one `pass`. | The repo's rule since 0033. A second identity report means two verdicts about one film. |

### 1.5 Two contradictions inside a single plan

Worth naming because an implementer will hit them:

1. **03 contradicts itself**: §0 says "no new command", §0.1 and §2 define
   `frame:report` with three input modes. Ruled above (M5).
2. **06's instrument check cannot pass**: A9 asserts the tile report reproduces
   centroid `.1365 ± .01`, height `57.78 ± 3`, local `12.64 ± 2`. Under 03's
   exact box the report reads `.055`/`.638`/`1.7`; under 04's aperture `.135`/
   `.603`/`1.7`. **Pin the acceptance fixture to the instrument that ships, and
   record the I-frames values as provenance, not as an assertion.** Otherwise
   step 8 fails on a correct implementation and somebody "fixes" the detector.
3. **01 puts `"film": "Y:/NewVideoTest/out/claude-pop.mp4"` in a committed
   `tokens.json`.** A machine path in a style pack, plus two rules pairing
   `film`/`sha256`. Ruled: the pack names `reference` (the six crops, in-repo);
   the reference film path and its hash live in the acceptance report and
   decision 0053. A hash checked nowhere is a claim — so let the command that
   measures it record it.

---

## 2. MUST / P1 / CUT

### 2.1 MUST — the nine things a 9/10 identity core v1 contains

| # | Must | Catches | Proof command |
|---|---|---|---|
| 1 | **`tokens.identity` schema 1** — 9 groups, closed, no defaults; `style:check` validates; the template ships it; `style:new` names the one gap | a new style starting at a shot list with no grammar | `npm run style:check -- styles/paper-kpop` · `npm run style:new -- demo --brief fixtures/wedding-min/brief.json` → `IDENTITY: 1 value is yours` |
| 2 | **`filmBands`** — lumaMean, saturationMean, edgesMean, judged on the specimen | the cream plate (144.76 vs 75–130) and a neon film | `npm run style:identity -- films/uber-model/score.json --video` |
| 3 | **`field` + `composition`** — bars ≤ 8 %, no cream plate with wings, centroid x share ≥ 80 %, height sd ≥ 15, 3 tiers, local contrast | Uber's five named failures: side bars, plate, placement, scale rhythm, contrast | `npm run collage -- …` then the frame report |
| 4 | **`cast`** — archetype, stage roles, principals ≤ 2, stagedShare 0.85, poses/expressions/anchors, appearance | a diagram with office workers | `npm run style:identity -- films/uber-model/score.json` → `identity:cast` |
| 5 | **`performance` + `paletteScript` + `motifs` in the score**, checked in `style:identity` | "the film is a deck, not a show"; one field colour; no motif language | same command → `identity:performance`, `identity:palette`, `identity:motif` |
| 6 | **`src/engine/frame-report.ts`** — one pure module, 480 grid, aperture box, row-histogram bars, ring contrast, blue-on-blue, palette families, largest flat | every pixel claim in the spec's §5.5 | `npm run collage -- films/uber-model/score.json` → `build/uber-model/frame-report.json` |
| 7 | **Preflight refuses the score half; `render:film` requires it** (`--check` proves it in seconds) | paying 12 minutes to paint a film the writing already refused | `npm run preflight -- <score>` · `npm run render:film -- <score> --check` |
| 8 | **Gate row `preflight` + `styleIdentity` tie** (picture hash, frame-report hash, identity hash) | a stale verdict reused on a different picture or a widened band | `npm run gate:7 -- <score>` → 25 checks |
| 9 | **`npm run identity:accept`** — reference passes, Uber fails, surface passes, exit 2 on a missing artifact | the plan itself: a gate that refuses the reference and accepts Uber | `npm run identity:accept -- --ref "Y:\NewVideoTest\out\claude-pop.mp4" --film films/uber-model/score.json` |

The nine must-haves are the spec's own §5.5 and §8.2, minus the fields nothing
reads. Together they cost **~2 new modules, 2 commands, 1 gate row, ~45 tests**.

### 2.2 P1 — named, not built, with the trigger that un-parks each

| P1 | Un-park when | Cost |
|---|---|---|
| Probe v2 exact character box (+ head-ornament extent, `body.headRadius`) | a film whose cast is a flower head or a creature, or an aperture box outside the frame | 0.5 d, technical-owned (`src/engine/paint-probe.js`) |
| 3 samples per shot | a real film shows a defect that one mid-shot frame missed | 0.5 d |
| Chorus 0–5 (`principals`/`chorus`, total 7) | the first song film, with a chorus rig | 2 d (rig + formation + cast rule) |
| `camera.keys` + the painter read | the first film that needs a pan with travel | 1 d (schema + painter + camera:check + determinism) |
| Variation ledger (3 films) | film 4 | 0.5 d |
| `shots[].framing` / close-up count | a film whose measured height tiers disagree with its declarations twice | 0.25 d |
| Library `visualHeadToBody` / `headOrnamentDiameterPct` bands | the probe can measure a head | 0.5 d |
| 05's P0.7 bypass guards (11) | any manual render or `--from gate` in anger | 1 d |
| 05's P0.9 sound rows (LRA, 3 s contrast) | the sound pass, not the identity pass | 1 d |
| Motif drawn-detection, tone, semantic archetype | never as a machine check; the sheet and the director | — |
| 9:16 composition bands | a 9:16 film | 0.5 d |

### 2.3 CUT — do not build, and do not re-propose

1. `surfaceBands` / the delta gate / hero-frame specimen selection.
2. `capabilities.legacy`, the DRAFT watercolor policy, `identity-legacy*` rules.
3. `tone` in the schema; `edit` in the schema; `horizonPx`, `fullBleed`,
   `noCreamPlateWithWings` as literals, `subjectWidth`, `centroidY`,
   the 5-ratio silhouette table.
4. `score.identity`, `identity.contract`, `identityVersion`,
   `capabilities.identity.styleIdentity`.
5. `camera.keys`, `shots[].framing`, `shots[].text`, `events[].with/contact/
   interaction`, `shots[].field`, `cast[].stageRole`.
6. A `frame:report` command with `--pre/--video/--times/--frames` modes.
7. A second gate code set / alias table; per-axis gate rows; `deferred` as a
   printed list; `stage: "preflight"` in the command.
8. `identity-rules.json`, `identity:rules`, the preflight import of it.
9. The 36-id forbidden catalogue as live checks. Keep **10 core ids**, cross-check
   them against `motion.transitions`, and let the frame report own bars, plate and
   blue-on-blue (they are measured, not declared).
10. Deleting `test/style-identity.test.ts` (06 §6). Extend it.

---

## 3. The final implementation order

Nine steps. Each step ends with a command that proves it and a test that keeps it
proved. Nothing later depends on anything earlier being "finished" — the gate is
not wired until step 6, so steps 1–5 cannot break a render.

### Step 1 — The pack block and its validator

**Files** `src/core/style.ts` (`StyleIdentitySchema`, the closed vocabularies,
`identityGaps`, `identityCastRule`, `TokensSchema.identity`, the `identity` layer
in `LAYERS`), `styles/paper-kpop/tokens.json` (schema 1: `reference`,
`filmBands`, `field`, `composition`, `cast`, `performance`, `motifs`,
`forbidden`; `stagedShare` 0.85; `envelope.dimension` `2.5d-layered`),
`styles/_template/tokens.json` (the same nine groups, `filmBands` omitted;
`limits.maxCast: 2` + a declared rig so the template embodies the cast path),
`scripts/style.ts` (`commandNew` prints `identityGaps`), `test/style-check.test.ts`.

**Proof**
```bash
npm run style:check -- styles/paper-kpop          # REVIEWABLE, 0 hard, 0 warnings
npm run style:check -- styles/_template           # DRAFT, 1 gap: filmBands
npm run style:check -- styles/watercolor-0.2.0    # REVIEWABLE (no cast -> N/A)
npm run style:new -- demo --brief fixtures/wedding-min/brief.json
npm run style:check -- styles/demo                # DRAFT, identity.filmBands missing
```

**Tests** the block is strict (an unknown key fails); a missing band is
`identity-band` naming the path; an inverted band is `identity-range` with both
values; a placeholder (`TODO`) is `identity-placeholder`; a cast pack with no
block is `identity-missing`; a no-cast pack is N/A and REVIEWABLE; `maxCast` and
`principals.max` must agree; `identityCastRule` maps and returns null for N/A;
`profile.length` is 11; `test/paper-kpop-gate.test.ts` expects DRAFT /
`identity-missing`.

### Step 2 — The score vocabulary and the scaffold

**Files** `src/engine/identity.ts` (new: `PERFORMANCE_MODES`, `ENTRANCES`,
`EXITS`, `MOTIFS`, `FIELD_ROLES`, `FilmPerformanceSchema`, `PaletteScriptSchema`,
`MotifSchema`, `IDENTITY_RULES`, `checkFilmIdentity` — pure, no fs),
`src/engine/treatment.ts` (optional `performance`, `paletteScript`, `motifs`,
`shots[].motif`), `src/engine/film-new.ts` (skeleton + `filmGaps`),
`test/treatment.test.ts`, `test/film-new.test.ts`, `test/identity.test.ts`.

**Proof**
```bash
node -e "for (const f of ['same-alarm','understudy','uber-model']) require('./src/engine/treatment.ts')" # via a test instead
npm run film:new -- --brief fixtures/story-min/brief.json --out build/identity-demo   # 9 named gaps
npm test
```

**Tests** all three shipped scores still parse (`performance` undefined,
`paletteScript`/`motifs` `[]`); `resolveFilm` gives the same errors and
`score-data.js` stays byte-identical; `film:new` derives `mode` from
`brief.audioMode` and invents no star, field, motif or shot; `filmGaps` names
each gap by name, not by count; each `IDENTITY_RULES` refusal fires once.

### Step 3 — The score half and the film bands fail the film

**Files** `src/engine/style-identity.ts` (input grows: cast archetype, stagedShare
0.85, `performance`, `paletteScript`, `motifs`; `delta` → `metrics`; null is a
finding), `scripts/style-identity.ts` (read the library archetype, `beats.json`,
the clock; judge `specimen` metrics on `filmBands`; write `identityHash`),
`test/style-identity.test.ts`.

**Proof**
```bash
npm run style:identity -- films/uber-model/score.json
# exit 1: identity:cast (no archetype) · identity:performance · identity:palette
#         · identity:motif · identity:luma (144.76 vs 75-130)
#         · identity:saturation (35.69 vs 12-35) · 9/10 staged passes
```

**Tests** one per code at −/at/+; a null measurement is `identity:unmeasured`
(this test fails today, which is the point); the reference fixture
(100.88/21.83/12.57) passes all three film bands; the Uber fixture
(144.76/35.69/10.39) fails luma and saturation and passes edges.

### Step 4 — The instrument: `frame-report` from the collage

**Files** `src/engine/frame-report.ts` (new: `measureBox`, `measureField`,
`measureContrast`, `measurePalette`, `summarize`, `readFrameReport` — pure;
480-wide grid; aperture box from `chest`/`head`/`solve` anchors;
4-bit quantise + 3×3 majority + 8-connected components; row-histogram bars with
jump/flat/field-distance; 30 % ring; families; largest flat),
`scripts/collage.ts` (decode each PNG once at 480, write
`build/<id>/frame-report.json`, derive the existing 32×18 flatness from it),
`test/frame-report.test.ts`, `test/fixtures/frame-report/*`.

**Proof**
```bash
npm run collage -- films/uber-model/score.json
# build/uber-model/frame-report.json:
#   bars L .190 R .195 in 10/10 · plate 8/10 · cx .135 (0/9 in band)
#   height 60.3% sd 6.0 tiers 1 · dLuma 1.7 (0/7 >= 20) · blue-on-blue 9/9
#   largest flat .247 · warm .783 · blue .173 · mean luma 151.8
# a second run is byte-identical
```

**Tests** synthetic buffers: a flat full-bleed frame has no bar; 19 % cobalt +
cream plate reads .19 with jump > 50; a 30 % luma ramp reads no bar; a 19 % bar
under a figure still reads .19; a 5 % and a 60 % bar do not; a bar equal to the
field does not; families at their hue boundaries; cream-on-blue Δ > 35 and
blue-on-cream blue-on-blue true; a bar-only box reads `visible: false`; bbox
translation/rotation; a character with no anchors is a gap, never a guessed box;
the same buffer twice is byte-identical. Golden: three Uber frames from the
committed fixture, asserting **the implementation's own** numbers (and printing
the I-frames values beside them as provenance).

### Step 5 — The frame findings fail the film, fail-closed

**Files** `src/engine/style-identity.ts` (frame findings + `readFrameReport`
contract), `scripts/style-identity.ts` (read `build/<id>/frame-report.json`,
verify `score` and `identityHash`, merge, exit 1), `test/style-identity.test.ts`,
`test/review-reuse.test.ts`.

**Proof**
```bash
npm run style:identity -- films/uber-model/score.json
# exit 1 with identity:bars · identity:fieldPlate · identity:centroidX
#   · identity:heightRhythm · identity:localContrast · identity:blueOnBlue
#   · identity:cast · identity:performance · identity:palette · identity:motif
# then: rm build/uber-model/frame-report.json && rerun -> identity:frames
```

**Tests** the report is required at this stage; a report of a different score, a
wrong row count, a duplicate shot or a NaN is `identity:frames`/`identity:unmeasured`;
the Uber fixture produces exactly the code list above and no `identity:luma`
beyond the film band; the reference fixture produces no frame finding; a reused
`pass:false` report still fails the review.

### Step 6 — Preflight refuses; render requires; one gate row

**Files** `scripts/preflight.ts` + `src/engine/preflight.ts` (identity section,
`check: "identity"`), `scripts/render-film.ts` (`requirePreflight` checks for the
identity section; `--check` runs the five requirements and paints nothing),
`scripts/gate-7.ts` (`preflight` row; `styleIdentity` tie by videoHash +
frame-report hash + `identityHash`), `test/preflight.test.ts`,
`test/gate-identity.test.ts`.

**Proof**
```bash
npm run preflight -- films/uber-model/score.json
# exit 1: FAIL [identity] identity:performance · identity:cast · identity:motif
npm run render:film -- films/uber-model/score.json --check
# exit 1, no browser: "preflight has 3 refusal(s)" then "identity has 6 finding(s)"
npm run gate:7 -- films/uber-model/score.json
# 25 checks: FAIL preflight, FAIL styleIdentity
```

**Tests** a preflight with no identity section is refused by the render; a
passing preflight with a red identity is refused; the pure `preflightGate` and
`identityGate` predicates (missing, score, stage, picture, frame hash, identity
hash, finding, pass); a probe (`--stills/--from/--to/--draft`) is still ungated.

### Step 7 — The delivered picture, and the review tie

**Files** `scripts/style-identity.ts` (`--video`: decode the ten sample times
from the MP4, re-measure with the same module, carry `videoHash`),
`scripts/film-review.ts` (style:identity gains `tie: "picture"` + its report;
`preflight` becomes a step; `describe` prints the one line),
`scripts/film-chain.mjs` (identity after collage, identity:video after deliver,
a skipped step must prove its report), `test/review-reuse.test.ts`.

**Proof**
```bash
npm run style:identity -- films/uber-model/score.json --video
# exit 1, videoHash sha256:d00badf1…, findings as step 5
npm run film:review -- films/uber-model/score.json --gate --reuse
# one page; style:identity FAIL; preflight FAIL; identity findings printed
```

**Tests** the video report equals the frames report within tolerance on the ten
shared times; a different picture is not reused; a reused `pass:false` fails; a
skipped `identity:video` with no matching `videoHash` stops the chain; `--from`
naming a nonexistent step stops with the list of names.

### Step 8 — The acceptance test is the product

**Files** `scripts/identity-accept.ts` (new), `package.json`,
`test/identity-accept.test.ts`, `docs/implementation/identity/ACCEPTANCE.md`
(one page, the two columns).

**Proof**
```bash
npm run identity:accept -- --ref "Y:\NewVideoTest\out\claude-pop.mp4" \
  --film films/uber-model/score.json
# exit 0:
#   axis            reference     uber        verdict
#   luma mean       100.88        144.76      ref pass / uber FAIL
#   saturation      21.83         35.69       ref pass / uber FAIL
#   edges           12.57         10.39       both pass
#   field/bars      n/a (no probe) .190/.195   uber FAIL
#   centroid x      (fixture .82) 0/9 in band  uber FAIL
#   height sd       (fixture 21.8) 6.0, 1 tier uber FAIL
#   local contrast  (fixture 46.6) 1.7, 0/7    uber FAIL
#   blue-on-blue    (fixture 0)   9/9 staged   uber FAIL
#   surface         crops==crops  passes       uber passes
```

**Tests** exit 2 (not 0) when either artifact is absent; every assertion prints
axis/value/band; the reference half never runs `style:identity` (no score); the
Uber half asserts **codes**, not proxy numbers; the fixture numbers are the
implementation's, with I-frames recorded as provenance.

### Step 9 — Write it down

**Files** `docs/decisions/0053-identity-is-a-schema-and-a-frame-report.md`
(the contract change, the Uber/reference numbers, the six cuts and why),
`AGENTS.md` (gate 25, the identity row), `docs/STATUS.md` (the Uber film's gate
is red on purpose; no film is rebuilt), `docs/STYLE-AUTHORING.md` (the one gap).

**Proof** `npm run typecheck && npm test` (≈520 pass); `git diff --stat` touches
no file under `gate/**`, no `films/**`, no sealed input.

---

## 4. The shape being built (one table, so nobody re-opens a name)

```
tokens.identity (schema 1, strict, no defaults)
  envelope      canvas, fps, dimension, cameraAxes
  reference     the six crops, pack-relative          (existing field, renamed)
  filmBands     lumaMean[75,130] saturationMean[12,35] edgesMean[7.5,17.5]
  field         edgeBarMax .08, largestFlat[.04,.46], warmShare[.40,.90],
                blueShareMax .20, saturatedShare[.35,.70]
  composition   subjectHeight[.129,.92], centroidX[.30,.75], centroidShare .80,
                heightSdMin 15, heightTiersMin 3,
                localContrastMin 20, localContrastMedian 35, localContrastShare .75
  cast          archetype, stageRoles[5], principals{1,2}, stagedShare .85,
                posesMin 8, expressionsMin 14, anchors[6],
                appearance{faceStyle, headLayers, hairLayers, bradMetal, fingers}
  performance   modes[3], defaultMode
  motifs        library[13], perFilm{3,5}, uses{2,5}, maxShotShare .40,
                semanticObjectMin 1
  forbidden     10 core ids + style extras

score.json  (additive, optional at the parser, required by the check)
  performance   mode, star, entrance{beat,via}, exit{beat,via}, signature{name}
  paletteScript [{beat, field}]            3-5, >=2 warm, <=1 blue, no repeat
  motifs        [{motif, kind, meaning}]   3-5
  shots[].motif one per shot              2-5 uses, <=40 %, one semantic

build/<id>/frame-report.json   one sample per shot, 480 grid, aperture box
build/<id>/style-identity/style-identity.json   the one verdict + identityHash
```

No `plane list`, no `tone`, no `edit`, no `framing`, no `keys`, no `contact`,
no `variation`, no second camera, no second palette, no second type system.

---

## 5. The riskiest assumption, and the fallback

**The assumption.** *The anchor aperture plus a 30 %-padded ring is a trustworthy
subject and contrast instrument on any film, not only on the two we have
measured.* Everything in step 4–5 rests on it: if the box is wrong, placement,
height rhythm, local contrast, blue-on-blue and figure-hidden are all wrong, and
the identity gate is back to being a palette filter with extra steps.

**Why it is risky.** It is a proxy, and it is a proxy for the *one* thing the
paint probe was never built to answer. 03 documents the failure mode precisely:
the box is a joint box, the paper extends past it, and a flower head is
under-measured by up to 16 points of height. Today's evidence is two rigs
(`worker@0.1.0`, `supervisor@0.1.0`) with a chest at −452/−466 and a head at
−462/−476 — a narrow, well-behaved family. The reference cast is a different
family: petal halo radius 146–169 against a head centre at −604.

**Fallback, in order.**
1. **Probe v2** — record the device point of every limb end, IK target and anchor
   during a `drawCharacter`, and take the min/max. It is `src/engine/paint-probe.js`,
   **technical-owned**: the painter is untouched and no `styles/**` permission is
   needed (03 mis-states this cost). Repaint the probe (30 s), keep the bands.
2. **Authored `shot.subjectBox`**, signed by the director, labelled
   `box: "authored"` in the report — 06's fallback. The gate then prints
   "human signed", not "paint measured". Do not fake a pixel detector to avoid
   the conversation.

**Second risk, with its own fallback.** *The reference film passes every band the
gate applies.* If it does not, the band is wrong — never lower the band to make
Uber pass, and never widen it to make the reference pass. Recalibrate from the
measurement, record both columns in decision 0053, and re-run step 8.

---

## 6. Score

| Axis | As written | After §2–§3 | The gap that produced the score |
|---|---|---|---|
| Implementability | **6** | 9 | 4 commands, 2 modules doing the same job, 3 score shapes, 3 pack shapes, a deadlock (chorus vs maxCast), a pinned-hash edit (Uber) and a re-seal (watercolor/blind) that no identity check needs |
| Identity coverage | **8** | 9 | The materials are excellent and every named Uber failure is covered. After the cuts, motif *drawn*, tone, variation, silhouette ratios and contact stay human — correctly, but they are still coverage |
| Simplicity | **3** | 9 | 1 schema, 1 module, 1 report, 1 verdict, 1 gate row, 1 artifact, 0 new prose fields |
| **Combined** | **6/10** | **9/10** | |

### To reach 9, change exactly these twelve things

1. Delete `surfaceBands` and the delta gate; judge the specimen on `filmBands` only.
2. Cut `filmBands` to three full-film means.
3. One staged number: `cast.stagedShare: 0.85`. Delete `presenceMin`.
4. No chorus in v1; `principals` max 2; park the 7-body rule.
5. One score shape (02's), reduced to `performance`, `paletteScript`, `motifs`,
   `shots[].motif`.
6. No claim marker of any kind (`score.identity`, `identity.contract`,
   `identityVersion`, opt-in flag). Optional at the parser, required by the check.
7. Cut `shots[].framing`, `shots[].text`, `events[].with/contact`, `camera.keys`.
8. Cut `tone`, `edit`, `horizonPx`, `fullBleed`, `noCreamPlateWithWings`,
   `subjectWidth`, `centroidY`, the silhouette ratio table.
9. Identity required for a pack with a cast; no `legacy` field; watercolor
   REVIEWABLE; one expected-state change (the sealed blind pack).
10. Uber: score and pose files untouched; the archetype finding fires on
    "declares no archetype"; the acceptance uses the film as delivered.
11. One sample per shot; 480 grid; ring contrast; aperture box; no probe change;
    no `frame:report` command — the collage writes it.
12. Cut the variation ledger, the second report, the gate alias table, the
    per-axis rows, `identity:rules`, and 05's P0.7/P0.9 from this change set.

---

## 7. SIGN

**SIGN: YES — for the nine steps in §3, with the twelve changes in §6 applied.**

A gate is only worth its cost if it can fail a film nobody wants and pass a film
somebody does. Today it passes Uber with `findings: []` and would refuse the
reference film on four of five surface bands — the check is calibrated to the
wrong picture and measures the wrong thing. The nine steps above replace it with
one declared grammar, one measured artifact and one verdict: the pack says what
the channel is, the score says what this film chose, the frame report says what
the paint actually did, and `identity:accept` proves the reference passes and the
Uber film fails on the exact axes the research named. Everything else the seven
plans propose — a chorus, a camera path the painter cannot draw, a third history
file, a fourth command — is real work on a real idea, and none of it makes this
gate better at the one job it has. Build the nine, prove them with the commands
in §3, write decision 0053 the same day, and put the rest in §2.2 where it can be
picked up when a film actually needs it.
