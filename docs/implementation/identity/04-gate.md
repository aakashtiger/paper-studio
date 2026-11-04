# 04 — The identity gate, wired end to end

**Status:** implementation plan. This document changes no code.
**Spec:** `docs/research/identity/KPOP-IDENTITY.md` v1.3, §3.14–3.25 and §5.
**Decision:** to be recorded as `docs/decisions/0053-identity-is-measured-on-the-drawn-frame.md`
(0052 is amended, not deleted).
**Owns:** the findings in `src/engine/style-identity.ts`, the report in
`scripts/style-identity.ts`, and the five readers: preflight, render, gate-7,
film-review, film-chain.
**Does not own:** the token/schema additions (plan 01), the score/library
vocabulary (plan 02), the calibrated bands and acceptance fixtures (plans 01,
06), or any new palette, camera vocabulary or type system.

### Names and ownership, against the sibling plans

Four plans were written in parallel. This document uses the **axis** names; the
**keys** are theirs, and the reader must use their keys or fail closed.

- **01-schema** owns `tokens.identity`: `surfaceBands` (today's `bands`),
  `filmBands`, `field` (`share`, `largestFlat`, `edgeBarMax`, `noBlueOnBlue`),
  `composition` (`subjectHeight`, `centroidX`, `centroidY`, `heightSdMin`,
  `heightTiersMin`, `localContrastMin`, `localContrastMedian`), `edit`
  (`medianS`, `minS`, `maxS`, `cutsPerMinute`), `cast` (`stagedShare`, not
  `stagedRatio`), `performance` (`stageShareMin`), `motifs` (`perFilm`, `uses`,
  `maxShotShare`, `defaultOpener`), `forbidden` (ids, not an object). Camera and
  type stay in the existing `tokens.motion.camera` and `tokens.type`; this plan
  does not add a second camera or type block.
- **02-score-library** owns the zod vocabulary in `src/engine/identity.ts` and
  the score fields: `performance`, `paletteScript`, `motifs`, `shots[].motif`,
  `shots[].framing`, `shots[].text`, `camera.keys`. This plan reads them. The
  film **check** stays in `src/engine/style-identity.ts` (the task's named
  file); it imports the vocabulary, it does not duplicate it.
- **02's legacy policy is rejected for the gate.** 02 proposes that an unclaimed
  film print `identity:unwritten` and pass. That cannot satisfy this task: Uber
  currently passes and must fail. Old scores still **parse** (the fields are
  optional), but a missing `performance`/`motifs`/`variation` is a **finding**,
  not a claim exemption. This is the one deliberate conflict; 0053 records it.
- **05-rules-pending** owns the bypass list and the detailed rule prose; where
  its messages differ, its wording wins. The codes here are the wiring names.
- **06-tests** owns the acceptance script and the exact fixture values; §9 here
  is the wiring matrix, not a second acceptance harness. If 06 lands first and
  uses `identity:field-script` / `identity:motifs` / `identity:motif-share`, use
  those names; the axes and refusals are the same.

---

## 0. The one-page answer

The identity check stays **one command, one report, one gate row**. The change is
that the report stops reading five whole-film deltas and starts reading the
**drawn frame**:

```
story/beats/scenes/score
   ↓
preflight      score + library half (§4)          refusals before a browser opens
   ↓
collage        one frame per shot + frame-report.json
   ↓
style:identity frames + film bands (§3)            refusals before the paint
   ↓
render:film    requires preflight, collage, motion, visual, identity
   ↓
deliver
   ↓
style:identity --video                            the delivered picture, videoHash
   ↓
gate:7         25 checks (adds `preflight`)        ties every report to score/picture
   ↓
film:review    one page; reuses identity by picture hash
```

- **One new artifact:** `build/<id>/frame-report.json`, written by the existing
  `scripts/collage.ts` from frames it already paints. No new command.
- **One new module:** `src/engine/frame-report.ts`, the only frame-report
  reader/measurer. It is pure: pixels + probe records in, numbers out.
- **No new probe pass.** The existing paint probe already records the chest/head
  anchors, their device matrices and the foot IK targets. Applied to the current
  Uber probe, the derivation in §1.4 gives **cx 0.135** (spec 0.136) and
  **cy 0.680** (spec 0.678). The instrument exists; it was never read.
- **Twelve requested findings, plus `identity:film` (§5.3) and two contract
  codes (`identity:contract`, `identity:frames`)**, all inside the existing
  `styleIdentity` gate row. One new gate row exists because one report was
  written and never read: `preflight`.
- **Uber fails** on field (side bars), placement (centroid x), scale (height sd
  and tiers), local contrast, blue-on-blue and motifs, as §5.5 requires. Its
  surface deltas still pass, so the check is not a palette filter.

---

## 1. The instrument: one frame report

### 1.1 Why one frame per shot

The spec's own evidence is per-shot: 49 character shots, 54 cards, 10 Uber
tiles. `collage` already paints exactly one frame per shot at 50% through the
shot, through the real painter, and already attaches the paint probe. The
identity check should read that page's numbers, not a second pass.

The report is a **sample**, not the film. Its limits are named in §11 and in the
report itself (`heightKind`, `grid`, `at`). The gate's `frames`/`motionFloor`/
`paintMatch` rows still measure the delivered film.

### 1.2 Producer: extend `scripts/collage.ts` (no new CLI)

After the frames are painted and before the collage page is written, collage
writes `build/<id>/frame-report.json`:

1. keep the **full** `rigRecords` for each chosen frame (today it keeps only the
   character names);
2. decode each PNG once at **192×108** RGB (today it decodes 32×18), one
   `ffmpeg -vf scale=192:108:flags=area` call per frame;
3. call `measureFrame()` from `src/engine/frame-report.ts` with the probe
   records, text boxes, pixels and the pack's `paper` role;
4. write the report, and keep writing `collage.json` exactly as it does now.

The collage's existing 32×18 flatness sample is derived from the 192×108 grid
(6×6 block means), so nothing else changes. A failed decode writes a row with
`null` measurements and the identity check fails closed; the collage still
refuses the blank frame on its own.

### 1.3 Report shape

`build/<id>/frame-report.json`

```json
{
  "film": "uber-model",
  "score": "sha256:5f5f…",
  "specimen": "build/uber-model/collage/frames",
  "at": 0.5,
  "width": 1920,
  "height": 1080,
  "grid": { "width": 192, "height": 108 },
  "rows": [
    {
      "shot": "s01",
      "time": 1.3,
      "cast": ["Kiran", "Vaz"],
      "drew": ["Kiran", "Vaz"],
      "draws": [
        {
          "character": "Kiran",
          "cx": 0.135,
          "cy": 0.680,
          "height": 0.603,
          "scale": 1.08,
          "heightKind": "rig-aperture",
          "box": { "x": 0.087, "y": 0.398, "w": 0.081, "h": 0.603 }
        }
      ],
      "field": {
        "share": 0.268,
        "largest": 0.268,
        "sideBars": { "left": 0.190, "right": 0.195 },
        "cream": 0.550,
        "roles": 6
      },
      "contrast": { "figure": 146.2, "surround": 158.8, "local": 12.6, "ring": 12.6 },
      "colour": { "warm": 0.783, "blue": 0.179, "saturated": 0.477, "figureBlue": 0.783, "fieldHue": 220 },
      "text": { "count": 4, "families": ["Anton", "DMMono"], "overSubject": false }
    }
  ]
}
```

Rules:

- `score` is the sha256 of the score file, `sha256:`-prefixed like every other
  report.
- `rows.length === score.shots.length`, one row per shot, in shot order.
- `draws` is one entry per character the probe actually drew, sorted tallest
  first. `draws[0]` is the **lead aperture**: `contrast` and
  `colour.figureBlue` are measured inside it. Placement and scale judge every
  draw; `text.overSubject` is true when a text box intersects **any** draw box.
  A cast member with no record is `drew`-absent and fails
  `identity:performance`; a drawn character with no chest/head anchor has
  `box: null` and fails `identity:frames`.
- Every measured number is finite. `null` is only legal where the spec has no
  subject (no cast, no text). A null where a value is required is a finding, not
  a pass.
- The report records **numbers only**; it never stores pixels.

### 1.4 How each number is obtained

| Field | Instrument | Definition |
|---|---|---|
| `cx`, `cy` | probe `anchor` + `solve` | `cx = transform(chest.m, chest.local).x / width`; `cy = (footY − heightPx/2) / height`; foot = transform(chest.m, solve.target) |
| `height` | same | `span = |footY − transform(head.m, head.local).y|`; `heightPx = span / (1 − HEAD_FRACTION)`; `HEAD_FRACTION = 0.25` is a module constant from §3.9 (the head is 22–28% of height), not a token |
| `scale` | probe `m` | `|m.d|` (camera z × character scale) |
| `box` | derived | top = headY − HEAD_FRACTION·heightPx; bottom = footY; width = `FIGURE_WIDTH · heightPx` (`FIGURE_WIDTH = 0.25`, a module constant); all in frame ratios |
| `field.share` / `largest` | 192×108 grid | dominant 5-bit-quantised colour share, and its largest 8-connected component |
| `sideBars` | grid | a run from the left/right edge whose columns span ≥85% of height, are flat (column luma sd <6, ΔE≤10 from the edge colour) and are 3–45% wide; report width / frame width |
| `cream` | grid | share within ΔE 10 of the pack's `paper` role |
| `roles` | grid | quantised colours with share ≥1% |
| `contrast.local` | grid | absolute luma distance: non-dominant pixels inside `box` vs the dominant colour inside `box` (the I-frames definition, the one that survives a bar) |
| `contrast.ring` | grid | absolute figure vs a 30%-padded ring of field pixels; reported, not judged |
| `colour.*` | grid | warm = red+oxblood+orange+gold+cream+kraft+teal; blue = hue 195–255, S>0.35; `figureBlue` inside `box`; `fieldHue` = hue of the dominant inside `box` |
| `text` | probe | count, `families`, and whether any box intersects `box` |

The probe change is **one field**, not a new pass: record
`family: options.family || default` on every text box (`Anton` for `TY.type`,
`DMMono` for `TY.text`). Without it the 2-system rule cannot be checked and the
report says so; it is cheaper to record it than to explain the hole.

### 1.5 The reader is one module

`src/engine/frame-report.ts` exports:

```ts
export type FrameRow, FrameReport, FrameSummary;
export function measureFrame(input: {
  shot: string; time: number; cast: string[];
  rigRecords: ProbeRecord[]; textBoxes: TextBox[];
  pixels: Uint8Array; gridWidth: number; gridHeight: number;
  frameWidth: number; frameHeight: number;
  headFraction?: number; figureWidth?: number; // module constants, overridable for tests
  paper: string; blueHue?: [number, number];  // blueHue 195-255 per §3.3
}): FrameRow;

export function readFrameReport(path: string, input: {
  score: string; shots: number;
}): { report: FrameReport | null; errors: string[] };

export function summarizeFrames(rows: FrameRow[]): FrameSummary;
```

`readFrameReport` is fail-closed: missing file, bad JSON, a different score, a
row count that is not the shot count, a duplicate/missing shot id, a non-finite
number — each is an error string, never a silent pass. `measureFrame` is pure;
`summarizeFrames` computes height percentiles/sd/tiers, centroid shares, local
median/share, bar maxima, blue-on-blue count and motif-independent counts.

Nothing in this module knows a palette, a font, a shot id or a recipe.

---

## 2. Findings in `src/engine/style-identity.ts`

### 2.1 Signature

The existing name and export stay; the input grows and the result grows two
fields. One function, two completeness levels.

```ts
export type IdentityStage = "preflight" | "frames" | "video";

export type IdentityInput = {
  stage: IdentityStage;
  film: string;
  duration: number;
  aspect: string;
  fps: number;
  shots: IdentityShot[];          // id, start, duration, cast, camera, transitionOut,
                                  // motif, stage, hooks, typeSystems, typeWords, typeBoxes
  cast: CastLibraryFact[];        // + archetype, stageRoles, appearance (02)
  frames: FrameReport | null;     // required at "frames" and "video"
  variation: VariationHistory | null; // null = missing file
  rules: IdentityRules;           // identity + motion.camera + type
  surface: { delta: IdentityDelta; specimen: StyleMetrics } | null;
  filmMetrics: { metrics: StyleMetrics } | null;
};

export type IdentityFinding = {
  code:
    | "identity:cast" | "identity:staged"
    | "identity:luma" | "identity:contrast" | "identity:saturation"
    | "identity:edges" | "identity:palette"          // surface deltas (existing)
    | "identity:film"                                // §5.3 film bands
    | "identity:field" | "identity:placement" | "identity:scale"
    | "identity:local-contrast" | "identity:blue-on-blue"
    | "identity:performance" | "identity:motif" | "identity:edit"
    | "identity:camera" | "identity:type" | "identity:variation"
    | "identity:forbidden"
    | "identity:contract" | "identity:frames";
  message: string;
  shot?: string;
};

export type IdentityResult = {
  findings: IdentityFinding[];
  deferred: string[];             // empty at "frames"/"video"
  summary: IdentitySummary;
};
```

`identity:contract` and `identity:frames` are the two extra codes the spec's
"no silent pass" rule needs. `identity:film` is §5.3; it is separate from the
surface deltas because the crops are not the film's reference (§5.2).

### 2.2 Rules, inputs and messages

Every rule is inclusive at its bound unless the spec says "max" / "at least".
A rule reads only its named input; no rule re-derives another's number.

| Code | Stage | Input | Rule | Message (first failing case) |
|---|---|---|---|---|
| `identity:cast` | all | `CastLibraryFact[]` | ≤2 principals, ≤5 chorus, ≤7 total; anchors, body, 8 poses, 14 expressions; `archetype === "paper-pop-performer"`; `stageRoles` non-empty; `appearance` with `visualHeadToBody` 3.4–4.5 and `headOrnamentDiameterPct` .45–.65 for the performer | `Kiran declares archetype "office-worker"; the channel's cast is a paper-pop-performer` |
| `identity:staged` | all | shots, staged | ≥ `cast.stagedShare` (now **0.85**, superseding 0.5) | `6/10 shots stage a character (60%); this style needs 85% — a diagram is not the channel` |
| `identity:luma/contrast/saturation/edges/palette` | frames/video | `surface.delta` | `surfaceBands` ±20/25/10/5/45 | unchanged |
| `identity:film` | frames/video | `filmMetrics` | `filmBands`: luma 75–130, p5 20–60, p50 80–140, p95 160–200; contrast p5 175–210; sat 12–35, p95 30–60; edges 7.5–17.5; palette ≤55 | `luma mean 146.8 (band 75–130) — a cream plate, not a stage` |
| `identity:field` | frames/video | per-shot `field` | share .18–.60; largest .04–.46; each side bar ≤ `field.edgeBarMax` (.08); `cream ≥ .35` with any bar fails as a plate | `s01: side bars 19.0% left, 19.5% right; the field must reach every edge (max 8%)` |
| `identity:placement` | frames/video | per-shot `draws` | every draw x ∈ `composition.centroidX` (.30–.75); ≥80% of staged shots have a draw in band; cy ∈ `.centroidY` (.38–.66); no draw in the outer 10%; `box` present for every cast member | `s01: the cast stands at x 0.135 (band 0.30–0.75) — the subject is in the side bar, not the frame` |
| `identity:scale` | frames/video | per-shot `height` | `composition.subjectHeight` (.13–.92, inclusive, 0.001 rounding tolerance); ≥ `heightTiersMin` (3) tiers ([.13,.35) [.35,.55) [.55,.80) [.80,.92]); height sd ≥ `heightSdMin` (15) points | `the cast is 60.3% tall at the widest; height sd 6.2 (needs 15) and 2 tiers (needs 3) — a fixed height is a sticker` |
| `identity:local-contrast` | frames/video | per-shot `contrast.local` | \|local\| ≥ `composition.localContrastMin` (20) in ≥75% of staged shots; median ≥ `localContrastMedian` (35) | `the figure is 12.6 luma from what is behind it (median needs 35); 1/10 shots separate at 20 (needs 75%)` |
| `identity:blue-on-blue` | frames/video | per-shot `colour` | fail a shot when `figureBlue > .30` AND `fieldHue ∈ 195–255` AND \|local\| < 18; allow ≤1 shot; film blue median ≤.05, mean/p90 ≤.20; `field.noBlueOnBlue` is the opt-in | `s01, s03, s05, s07, s09: a blue figure on a blue field (figure-blue 0.78, field hue 220, \|ΔL\| 12.6); 7/10 shots — blue is an accent, not a ground` |
| `identity:performance` | all | `score.performance` (02), cast, frames | mode declared; star ∈ cast; chorus 0–5; `stage.beat`/`entrance.beat`/`exit.beat` are beats; `signature.name` non-empty; stage share ≥ `performance.stageShareMin` (.60); drawn presence ≥.85; every staged cast member drawn | `no performance block; the channel is a show — name the mode, the star, the entrance, the exit and the signature move` |
| `identity:motif` | all | `score.motifs` + `shots[].motif`, `motifs.*` | `perFilm` 3–5; `uses` 2–5 each; one ≥3; none > `maxShotShare` (.40); set differs ≥2 from the last film; no `defaultOpener` on shot 1 | `0 motifs declared; the channel chooses 3–5 and gives each a meaning` |
| `identity:edit` | all | shot durations | format shot count (30 s 10–13, 45 s 14–18, 60 s 18–23); `edit.medianS` 2.4–3.2; min ≥ `minS`; max ≤ `maxS`; `cutsPerMinute` 18–24 | `median shot 3.4s (band 2.4–3.2) on a 30s film` |
| `identity:camera` | all | resolved camera + `tokens.motion.camera` | every shot has a move/creep; short 4–8 distinct, long 6–10; no run >2; moving share ≥.90; push 25–35%, pull 8–15%; pan/track/tilt/whip/orbit require `camera.keys` | `s04 calls this a pan but declares only a z change (1.00 → 1.02); a pan needs keys — or call it a push` |
| `identity:type` | all | score slots + frame `text` + `tokens.type` | ≤8 words/slot; ≤2 systems; ≤2 boxes/shot; hooks 2–5 (display 8–25% area, 1–4 words); no text over the subject box | `s02 has 3 text boxes (max 2) and 9 words in one slot (max 8)` |
| `identity:variation` | all | `variation` history + score choices | 12 axes; ≥2 motif differences from each prior film; opening/closing differ from the previous film; no 4th repeat of any value; missing/malformed history fails | `no variation history at styles/paper-kpop/variation.json; the anti-copy rule needs the last three films` |
| `identity:forbidden` | all | score + `tokens.identity.forbidden` ids | each id maps to an engine predicate: dissolve/page/star/3D wipe; fov/dof/blur/focus keys; forbidden opener recipe; ≤7 roles (≤5 short); lyric wall; text over face | `s03 declares a dissolve; a paper cut is the default` |
| `identity:contract` | all | tokens + measurements | any missing block/band, any null delta, any NaN | `tokens.identity.field is missing; a missing band is a failure, not a pass` |
| `identity:frames` | frames/video | `frames` | missing/malformed/different score/wrong row count/no box for a cast member | `no frame report at build/uber-model/frame-report.json — run \`npm run collage\`` |

Shot-bearing findings set `shot`; film-level findings do not. Findings are
grouped by code and capped at **3 examples + "and N more"** per code in the
message, so a 40-shot film cannot produce a 200-line report.

Three codes have a score half and a frame half. At `preflight`,
`identity:performance` checks the block/presence/stage share but not drawn
presence; `identity:type` checks words but not boxes/systems/hooks/over-subject;
`identity:forbidden` checks score fields but not text over a face. Those halves
are in `deferred` and are judged at frames/video. A code can fire on its score
half before the paint; it never passes its frame half by being deferred.

### 2.2.1 Variation, exactly

`styles/paper-kpop/variation.json` (tracked; `build/` is gitignored):

```json
{
  "$schema": "paper-studio/variation@1",
  "films": [
    {
      "id": "same-alarm",
      "choices": {
        "structure": ["hook", "turn", "button"],
        "setFamily": "office",
        "fieldScript": ["ink", "kraft", "cream"],
        "cast": ["Kiran", "Vaz"],
        "motifs": ["clock", "lamp", "door", "chair"],
        "camera": ["hold", "push_in", "pan", "pull_back"],
        "textBehaviour": ["stack", "slide"],
        "transitions": ["cut", "iris"],
        "opening": "office_day",
        "closing": "office_day",
        "soundMode": "narration",
        "signature": "the last hand does not come down"
      }
    }
  ]
}
```

The current film's choices are **derived; no new score block**:

| Axis | From |
|---|---|
| structure | `beats.json` purpose sequence (`hook`, `turn`, `button`) |
| setFamily | `score.performance.stage.family` |
| fieldScript | `score.paletteScript` |
| cast | `score.cast[].character` |
| motifs | `score.motifs[].motif` |
| camera | resolved move sequence |
| textBehaviour | distinct `shots[].text.behaviour` |
| transitions | distinct `transitionOut` |
| opening / closing | first / last shot `recipe` |
| soundMode | `clock.mode` |
| signature | `score.performance.signature.name` |

A missing field on a **claimed** film is a finding naming that axis; it is not
guessed from prose. The signature **shot** (the poster frame only this film has)
is a review row, not a machine axis; 02's `signature` is a repeatable gesture.

Rules: for each of the 12 axes, a value that appears in **all three** prior films
is a 4th repeat and fails; `motifs` must differ by ≥2 from each prior film;
`opening` and `closing` must differ from the immediately previous film;
`signature` must be new. `films: []` passes with `films: 0` printed — the first
film under the rule. A missing file, a malformed file, or a film with no
`choices` fails.

### 2.3 What runs where

| Check | preflight | frames | video |
|---|---|---|---|
| cast construction, archetype, role, height | ✅ | ✅ | ✅ |
| staged share (0.85) | ✅ | ✅ | ✅ |
| motifs, edit, camera, variation, forbidden (score) | ✅ | ✅ | ✅ |
| performance block, presence, stage share, entrance/exit | ✅ | ✅ | ✅ |
| surface deltas | deferred | ✅ | ✅ |
| film bands (§5.3) | deferred | ✅ (collage sample) | ✅ (delivered video) |
| field, placement, scale, blue-on-blue | deferred | ✅ | ✅ |
| local contrast | deferred | ✅ | ✅ |
| drawn presence, every staged cast member drawn | deferred | ✅ | ✅ |
| text over subject, text boxes/systems/hooks | partial | ✅ | ✅ |

At `preflight`, `deferred` is exactly:

```
["surface bands", "film bands", "field", "placement", "scale",
 "local contrast", "blue-on-blue", "text over subject"]
```

It is printed and written to the report. **Deferred is not pass.** The render
still refuses without the frame report; the gate still refuses without the video
report.

### 2.4 Summary for the page and the gate

```ts
export type IdentitySummary = {
  shots: number; staged: number; drawn: number;
  height: { min: number; median: number; max: number; sd: number; tiers: number };
  centroidX: { median: number; inBand: number; worst: number };
  local: { median: number; atLeast20: number };
  field: { share: number; largest: number; barsL: number; barsR: number; cream: number };
  blue: { median: number; mean: number; onBlueOnBlue: number };
  motifs: { declared: number; maxShare: number };
  edit: { shots: number; median: number; cutsPerMinute: number };
  camera: { moves: number; distinct: number; longestRun: number; movingShare: number };
  type: { systems: number; hooks: number; maxBoxes: number };
  performance: { mode: string | null; presence: number };
  variation: { films: number; axesChanged: number };
};
```

This is one line on the review page and six numbers in the gate detail. No
second report, no second page.

---

## 3. `scripts/style-identity.ts`

### 3.1 Stages

`npm run style:identity -- <score>` → `stage: "frames"`, specimen = the collage
frames (explicit `--specimen build/<id>/collage/frames` in the chain).
`npm run style:identity -- <score> --video` → `stage: "video"`, specimen = the
delivered MP4.

The script measures **two** things:

- **surface**: the **hero frames** of the collage — the rows whose frame-report
  `height >= .55` (the close/hero tier), or the tallest three if fewer than
  three qualify — copied to `build/<id>/style-identity/surface-frames`. Then
  `style:measure --ref styles/<style>/<identity.reference> --specimen
  build/<id>/style-identity/surface-frames --out
  build/<id>/style-identity/surface` → `delta` (crops vs the film's hero
  frames). The five surface codes read this. The six crops are a hero-scale
  reference; comparing them to the whole film is the error §5.2 names.
- **film**: the specimen's raw `luma`, `contrast`, `saturation`, `edges` and
  `delta.palette` against the §5.3 bands. `identity:film` reads this. At
  `frames`, the specimen is **all** collage frames (the film's sampled tone);
  at `video`, it is the delivered file.

At `frames`, the surface run and the film run use different specimens (hero
frames vs all frames), so they are two `style:measure` runs. At `video`, the
surface run is the same hero-frame run; the film run is the delivered file. The
report names the shots and the specimen each section used.

### 3.2 Reads

| Input | Path | Required |
|---|---|---|
| score | argv | yes |
| tokens | `styles/<style>/tokens.json` → `identity` | yes |
| library | each `cast[].poses` | yes |
| frame report | `build/<id>/frame-report.json` | yes at frames/video |
| surface match | `build/<id>/style-identity/surface/match.json` | yes at frames/video |
| film match | `build/<id>/style-identity/film/match.json` | yes at frames/video |
| variation | `styles/<style>/variation.json` | yes (missing = finding) |
| video | `films/<id>/<id>.mp4` | only at `--video` |

No other report is read. It never reads `preflight.json`, `gate-7.json` or
`collage.json`; those read it.

### 3.3 Report shape

`build/<id>/style-identity/style-identity.json`

```json
{
  "film": "uber-model",
  "style": "paper-kpop@0.2.0",
  "score": "sha256:5f5f…",
  "stage": "video",
  "specimen": "films/uber-model/uber-model.mp4",
  "videoHash": "sha256:d00b…",
  "dimension": "2.5d-layered",
  "pass": false,
  "findings": [
    { "code": "identity:field", "message": "s01: side bars 19.0% left, 19.5% right; …", "shot": "s01" }
  ],
  "summary": { "shots": 10, "staged": 9, "drawn": 9, "height": { "sd": 6.2, "tiers": 2, "median": 0.55 }, "…": "…" },
  "cast": [ { "character": "Kiran", "archetype": "office-worker", "stageRoles": ["foil"], "appearance": true, "poses": 8, "expressions": 14, "anchors": ["…"], "body": true, "errors": [] } ],
  "surface": { "specimen": "build/uber-model/style-identity/surface-frames", "shots": ["s01", "s04", "s05", "s09"], "delta": { "luma": 1.2, "contrast": -18.8, "saturation": -4.1, "edges": 0.1, "palette": 43.0 }, "bands": { "luma": 20, "contrast": 25, "saturation": 10, "edges": 5, "palette": 45 } },
  "film": { "specimen": "films/uber-model/uber-model.mp4", "metrics": { "luma": { "mean": 146.8, "p5": 148, "p50": 147, "p95": 155 }, "contrast": { "p5": 180 }, "saturation": { "mean": 35.7, "p95": 60 }, "edges": { "mean": 12.6 }, "palette": 43.0 }, "bands": { "luma": [75, 130], "…": "…" } },
  "frames": { "path": "build/uber-model/frame-report.json", "sha256": "sha256:…", "score": "sha256:5f5f…", "rows": 10, "at": 0.5 },
  "variation": { "path": "styles/paper-kpop/variation.json", "sha256": "sha256:…", "films": 0 },
  "deferred": []
}
```

Every path is repo-relative with forward slashes. `deferred` is empty at
frames/video. `videoHash` is null at `frames`.

### 3.4 Fail-closed rules

The script writes a report **and** exits 1 in every one of these cases. It never
crashes without a report and never writes `pass: true` with a hole.

| Condition | Finding | Exit |
|---|---|---|
| `tokens.identity` or any required block missing | `identity:contract` | 1 |
| `style:measure` fails or writes no `match.json` | `identity:contract` | 1 |
| a delta is null | `identity:contract` (one per metric) | 1 |
| frame report missing | `identity:frames` | 1 |
| frame report is a different score | `identity:frames` | 1 |
| frame report rows ≠ shots | `identity:frames` | 1 |
| a staged character has no chest/head anchor | `identity:frames` (per shot) | 1 |
| variation file missing/malformed | `identity:variation` | 1 |
| `--video` and no delivered file | `identity:contract` | 1 |
| findings non-empty | all | 1 |

`pass` is `findings.length === 0`. A report that fails is still written; the
gate and the review read the failure, not a missing file.

### 3.5 Ties

- `score` = `sha256:` + sha256 of the score file (existing).
- `videoHash` = `videoStreamHash()` when the specimen is the MP4 (existing).
- `frames.sha256` = sha256 of `frame-report.json`; `frames.score` must equal
  `score`.
- `variation.sha256` = sha256 of the history file; the gate re-hashes it.
- `surface.delta` and `film.metrics` are numbers, not hashes; the report is the
  measurement. The gate does not re-run `style:measure`; it checks the picture
  hash and the inputs.

A report whose score/frame/variation hashes do not match what is on disk is not
reused, not printed, and not gated — the reader itself refuses.

---

## 4. Preflight — what runs before a browser opens

`scripts/preflight.ts` builds the identity input from the score, the resolved
plan, the library and the variation history, and calls
`checkStyleIdentity({ stage: "preflight", frames: null, … })`. No
`style:measure`, no browser, no build artifact.

**Runs now (refuses):**

- cast construction, archetype, role, height, poses/expressions/anchors/body;
- staged share 0.85;
- motifs (count, uses, max share, opener, history difference);
- edit (shots, median, min/max, cuts/min);
- camera (move, distinct, run, moving share, travel, pan-without-keys);
- performance block, mode, star, chorus, entrance/exit, signature, stage share;
- variation (history file + 12 axes);
- forbidden (transitions, lens keys, opener recipe, role cap, lyric wall);
- the identity contract itself (missing block/band = error).

**Waits for frames (deferred, printed, not passed):**

surface deltas, film bands, field, placement, scale, local contrast,
blue-on-blue, text over subject, drawn presence.

### 4.1 Report and output

`preflight.json` gains:

```json
"identity": {
  "stage": "preflight",
  "pass": false,
  "findings": [ { "code": "identity:motif", "message": "0 motifs declared; …" } ],
  "deferred": ["surface bands", "film bands", "field", "placement", "scale", "local contrast", "blue-on-blue", "text over subject"],
  "summary": { "motifs": { "declared": 0 }, "camera": { "distinct": 5 }, "edit": { "median": 3.0 }, "…": "…" }
}
```

`preflightFilm()` maps each finding to `errors` with `check: "identity"` and the
message `"<code>: <message>"`, so the existing print is:

```
FAIL [identity] identity:motif: 0 motifs declared; the channel chooses 3-5 and gives each a meaning
FAIL [identity] identity:performance: no performance block; the channel is a show — name the mode, the star, the entrance, the exit and the signature move
FAIL [identity] identity:variation: no variation history at styles/paper-kpop/variation.json; the anti-copy rule needs the last three films
preflight: 3 refusal(s) — the film is not ready to paint
```

On a pass, one new line before the warnings:

```
  identity  cast 2 · motifs 4 · 5 moves · 3.0s median · 18/min
            deferred to frames: surface bands, film bands, field, placement, scale, local contrast, blue-on-blue, text over subject
```

Exact refusal messages are the finding messages; no second wording exists.

**Reproduction is not an exemption.** `reproduce` softens a missing `scenes.json`
today; it does not soften identity. An old film that fails the new contract
fails, which is the point of §5.5.

---

## 5. Render — which reports are required, and how a stale one is refused

`render:film` keeps the existing `require*` pattern: a whole-film paint runs
all five requirements before `serve()`/Chrome; probes
(`--stills`, `--from/--to`, `--draft`) skip all five and write no manifest.

| Requirement | Report | Tie |
|---|---|---|
| preflight | `build/<id>/preflight.json` | `score` + `identity.pass` |
| collage | `build/<id>/collage.json` | `score` |
| motion | `build/<id>/motion-probe/motion-probe.json` | `score` |
| visual | `build/<id>/visual-check.json` | `score` + `pass` |
| identity | `build/<id>/style-identity/style-identity.json` | `score` + `pass` + `frames.sha256` + stage |

The frame report (`build/<id>/frame-report.json`) is not a sixth requirement; it
is hashed by the identity report, so a render cannot use a stale identity
verdict with a fresh frame report or the reverse.

### 5.1 Exact refusals

New/changed messages, in the order the checks run:

```
refusing to paint uber-model: no preflight report. Run `npm run preflight -- films/uber-model/score.json` first
refusing to paint uber-model: build/uber-model/preflight.json has no identity section — it predates the identity check. Run `npm run preflight -- films/uber-model/score.json` again
refusing to paint uber-model: preflight has 3 refusal(s):
  identity  identity:motif: 0 motifs declared; ...
  see build/uber-model/preflight.json · films/uber-model/score.json
refusing to paint uber-model: no style-identity report. Run `npm run style:identity -- films/uber-model/score.json` first
refusing to paint uber-model: build/uber-model/style-identity/style-identity.json describes a different score. Run `npm run style:identity -- films/uber-model/score.json` again
refusing to paint uber-model: the identity report was measured before the frames (stage "preflight"). Run `npm run collage` then `npm run style:identity`
refusing to paint uber-model: no frame report at build/uber-model/frame-report.json — the identity report has nothing to measure placement from. Run `npm run collage`
refusing to paint uber-model: the identity report read a different frame report (sha256:… ≠ sha256:…). Run `npm run style:identity` again
refusing to paint uber-model: 7 style-identity finding(s):
  identity:field      s01: side bars 19.0% left, 19.5% right; the field must reach every edge (max 8%)
  identity:placement  s01: the cast stands at x 0.135 (band 0.30-0.75) — the subject is in the side bar, not the frame
  ...
  see build/uber-model/style-identity/style-identity.json
```

`requirePreflight` adds the `identity` section check **before** `ok`, so an old
passing preflight cannot buy a render. `requireStyleIdentity` adds the stage and
frame-report checks **before** `pass`, so a video-stage report from an earlier
delivery is allowed only when the score and frame report are current; the paint
purity argument and `paintMatch` cover the picture.

### 5.2 `--check` — prove the gate without painting

Add one flag to the existing renderer:

```
npm run render:film -- films/<id>/score.json --check
```

It runs the same five requirements, prints one line each, writes nothing, opens
no browser and exits 0/1. This is the command that proves the render wiring in
seconds; it is not a second gate and not a new script.

```
render:check uber-model · preflight PASS · collage PASS · motion PASS · visual PASS · identity PASS (frames)
render:check PASS — the film may be painted
```

---

## 6. Gate 7 — exact new rows and ties

Today: **24 checks**. After: **25**. One row is added because `preflight.json`
is written by the chain and read by nothing; every identity axis is already in
the `styleIdentity` row, so adding per-axis rows would read the same file five
times.

### 6.1 The one new row: `preflight`

```ts
preflight: {
  ok:
    report?.ok === true &&
    report?.score === `sha256:${hashFile(scorePath)}` &&
    report?.identity?.pass === true &&
    Array.isArray(report?.identity?.deferred),
  detail: report?.identity
    ? `${report.identity.summary?.motifs?.declared ?? 0} motifs · ` +
      `${report.identity.summary?.camera?.distinct ?? 0} moves · ` +
      `${report.identity.summary?.edit?.median ?? "?"}s median · ` +
      `${report.identity.deferred.length} deferred to frames`
    : "preflight predates the identity check — run `npm run preflight -- <score>`",
}
```

Refusals:

| Condition | Detail |
|---|---|
| no report | `no preflight report — run \`npm run preflight -- <score>\`` |
| different score | `preflight describes a different score` |
| no `identity` section | `preflight predates the identity check — run it again` |
| `identity.pass === false` | `<n> identity refusal(s): <code> <message>` |
| pass | `5 identity checks before the paint · 8 deferred to frames` |

The row is tied by **score only**. Preflight does not paint, so the paint mtime
is not part of its tie; a changed painter does not change the score-level
verdict. The identity row re-reads the library at video time, so a library change
is still caught there.

### 6.2 The grown row: `styleIdentity`

Existing tie: `score` + `videoHash === frozenHash`. Added:

```ts
const framePath = resolve(dir, "frame-report.json");
const variationPath = resolve(root, "styles", score.style, "variation.json");
ok:
  report?.pass === true &&
  report?.stage === "video" &&
  report?.score === currentScore &&
  report?.videoHash === frozenHash &&
  existsSync(framePath) &&
  report?.frames?.sha256 === `sha256:${hashFile(framePath)}` &&
  report?.frames?.score === currentScore &&
  report?.frames?.rows === score.shots.length &&
  existsSync(variationPath) &&
  report?.variation?.sha256 === `sha256:${hashFile(variationPath)}`
```

Detail on pass:

```
stage video · staged 90% · height sd 6.2 · x 0.135 · local 12.6 · bars 19/20% · motifs 0 · film luma 146.8
```

Detail on fail:

```
7 identity finding(s): identity:field — s01: side bars 19.0% left, 19.5% right; …
```

Refusals:

| Condition | Detail |
|---|---|
| no report | `no style-identity report — run \`npm run style:identity -- <score> --video\`` |
| different score | `the identity report measured a different score` |
| not video stage | `the identity report was measured before the delivery — run \`style:identity --video\`` |
| different picture | `the identity report measured a different picture` |
| no frame report | `no frame report — run \`npm run collage -- <score>\`` |
| frame report changed | `the identity report read a different frame report` |
| variation missing | `no variation history at styles/paper-kpop/variation.json — the identity verdict cannot be tied` |
| variation changed | `the variation history changed after the identity report` |
| findings | `<n> identity finding(s): <first code> — <first message>` |

### 6.3 Rows deliberately **not** added

| Would-be row | Why not |
|---|---|
| `field`, `placement`, `scale`, `contrast`, `blueOnBlue`, `motif`, `performance`, `edit`, `camera`, `type`, `variation`, `forbidden` | All read `style-identity.json`. One file, one tie, one row. Twelve rows would be twelve copies of one verdict. |
| `cameraGrammar` | `scripts/camera-check.ts` writes no report. Adding a report and a row to restate what `preflight` and `styleIdentity` already prove is the over-engineering this plan avoids. Camera is refused pre-render by `camera:check` and again by the identity findings. |
| `frameReport` | The frame report is hashed **inside** the identity row. A separate row would read a file that only the identity row knows how to judge. |
| `variation` | Same; the history hash is checked in the identity row. |
| `surface` / `film` | The surface deltas and film bands are findings in the identity row. |

Every row that exists reads a report some step writes:

| Row | Writer |
|---|---|
| `preflight` | `scripts/preflight.ts` |
| `styleIdentity` | `scripts/style-identity.ts` |
| `frames`, `paintMatch`, `palette`, `motionFloor`, `typeSafeArea`, `rigSeam` | existing audits |
| `writing`, `scoreData`, `visual` | existing steps |

---

## 7. `film-review` — rows, reuse, one page

### 7.1 Rows

Add `preflight` to the base steps, after `visual:check`:

```ts
{ name: "preflight", script: "scripts/preflight.ts", detail: "the writing, the read, the cut, the sound, identity" }
```

It runs every review (~1 s) rather than reusing, because its report uses `ok`
rather than `pass` and because a fresh score-level identity verdict is cheap.
`style:identity` stays where it is (after `deliver`, before `gate:7`) with
`args: ["--video"]`.

### 7.2 Reuse tie

`style:identity` becomes reusable by **picture**. It is pushed explicitly in the
`--gate` block today, so add the tie to that step (do not also add it to the
`GATE_TIES` loop, or it runs twice):

```ts
steps.push({
  name: "style:identity",
  script: "scripts/style-identity.ts",
  detail: "the picture is still this channel",
  args: ["--video"],
  tie: "picture",
  report: `build/${id}/style-identity/style-identity.json`,
});
```

`mayReuse` already refuses a missing `videoHash`, a different picture, or no
frozen hash. A reused report that says `pass: false` still fails the review
(0033). The gate is stricter (it also re-hashes the frame report); the review's
job is to print the verdict, not to re-measure it.

The `preflight` step is not tied; it runs.

### 7.3 One page

`describe("style:identity")` reads `summary`:

```
  ok   style:identity  video · 10 shots · height 55.2% sd 6.2 · x 0.135 · local 12.6 · bars 19/20% · motifs 0
  FAIL style:identity  FAIL · identity:field — s01: side bars 19.0% left, 19.5% right; …
```

`describe("preflight")` reads `identity.deferred`:

```
  ok   preflight       5 identity checks before the paint · 8 deferred to frames
  FAIL preflight       FAIL · identity:motif: 0 motifs declared; …
```

The page stays one screen: one line per step, the gate line, the skipped lines,
one sheet. On failure the last 20 lines of the failing step's own output are
printed below, as today; the full findings are in the report file named there.

---

## 8. `film-chain` — the order, probes, and proved reports

### 8.1 Where identity sits

The chain today **cannot render a fresh film**: `render:film` requires
`visual-check.json` and `style-identity/style-identity.json`, and the chain runs
neither before `render`. Both are added. The order becomes:

| # | Step | Why here |
|---|---|---|
| 1 | tests | checked-in score data |
| 2 | voice | narration is the clock |
| 3 | embed | the page's data |
| 4 | audit | score-level contracts |
| 5 | camera | every shot moves, varied |
| 6 | assets | recipe assets covered |
| 7 | **visual** | every shot has a drawable visual brief (**new**) |
| 8 | preflight | score + library identity, writing, read, cut, sound |
| 9 | inspect | one probe pass: motion, type, rig |
| 10 | determinism | 30-frame twin |
| 11 | sheet | character/pose sheet |
| 12 | collage | one frame per shot + **frame report** |
| 13 | **identity** | frames + film bands; refuses before the paint (**new**) |
| 14 | sfx | cues |
| 15 | mix | master |
| 16 | render | the film, once |
| 17 | frames | frame audit |
| 18 | paint | paint-match |
| 19 | palette | palette audit |
| 20 | motion | motion audit |
| 21 | deliver | master into the picture |
| 22 | **identity:video** | the delivered picture + `videoHash` (**new**) |
| 23 | asr | the G7 ASR gate |
| 24 | gate | 25 checks |
| 25 | review | `--gate --reuse` |

`identity` must run **after** `collage` (it reads the frame report) and **before**
`render` (it is a pre-paint refusal). `identity:video` must run **after**
`deliver` (it hashes the delivered file) and **before** `gate` (the gate requires
`stage: "video"`).

### 8.2 Probes

`render:film --stills`, `--from/--to` and `--draft` remain ungated. They paint no
whole film and write no manifest; they are instruments. `--check` is the
opposite: it proves the requirements and paints nothing. The chain never passes
probe flags to the render; `inspect` and `collage` use `--stills` internally and
are the instruments that produce the reports.

### 8.3 `--skip-render` and `--from` must prove the reports they skip

The chain's rule becomes: **a skipped step is not a passed step; its report must
be proved, or the chain stops.**

```js
const needsProvedIdentity =
  skipRender ||
  (from !== undefined && indexOf(from) >= indexOf("identity:video"));

if (needsProvedIdentity) {
  const manifest = readJson(`${build}/render-manifest.json`);
  const identity = readJson(`${build}/style-identity/style-identity.json`);
  const scoreHash = `sha256:${sha256(readFileSync(resolve(root, score)))}`;
  if (!manifest) stop(`--skip-render/--from needs ${build}/render-manifest.json; render once or start earlier`);
  if (
    !identity ||
    identity.stage !== "video" ||
    identity.score !== scoreHash ||
    identity.videoHash !== manifest.videoHash
  ) {
    stop(
      `--from ${from} skips \`identity:video\`, and the identity report is not about this picture ` +
      `(${identity?.videoHash ?? "no hash"} ≠ ${manifest.videoHash}).\n` +
      `chain: run \`npm run style:identity -- ${score} --video\`, or start from \`identity:video\``
    );
  }
}
```

Exact messages:

```
chain: --skip-render needs build/uber-model/render-manifest.json; render once or start earlier
chain: --from gate skips `identity:video`, and the identity report is not about this picture (sha256:9f… ≠ sha256:d0…).
chain: run `npm run style:identity -- films/uber-model/score.json --video`, or start from `identity:video`
chain: --from review skips `gate`, and build/uber-model/gate-7.json is not a passing gate for this picture. Run the gate first.
```

`--skip-render` still requires the deliverable as it does today; the addition is
the manifest + identity tie. `--from gate` now proves identity; `--from review`
also proves the gate report (`pass: true`, `frozenVideoHash === manifest.videoHash`).
`--from deliver` and earlier run `identity:video` normally.

The same rule covers `preflight`: when `preflight` is skipped and its report has
no `identity` section, the chain stops before `gate` with
`preflight predates the identity check — run \`npm run preflight -- <score>\``
rather than letting the gate report it one step later. A skipped report is
proved, not assumed.

If `from` names a step that does not exist, the chain stops with the list of
step names; today it silently runs nothing and prints PASS. This is a one-line
fix in the same loop.

---

## 9. Test matrix

### 9.1 Automated (unit)

| Wiring point | Test file | Cases |
|---|---|---|
| findings | `test/style-identity.test.ts` (extend) | one per code; every bound at −/at/+; `identity:contract` for a missing block/null; `identity:frames` for a missing report; no `pass` with a deferred frame axis |
| Uber fixture | same | `test/fixtures/identity/uber.json` (score + frames rows from the spec's measured values) → findings include `identity:field`, `identity:placement`, `identity:scale`, `identity:local-contrast`, `identity:blue-on-blue`, `identity:motif`; **no** `identity:luma/contrast/saturation` (surface passes) |
| reference fixture | same | `test/fixtures/identity/reference.json` (I-frames p50s: height 55.2, sd 21.8, cx .55, local 46.6, bars 0, motifs 4, archetype/performance/variation present) → **no film-band or frame-axis findings**. Its surface is the six crops against themselves (delta 0); the reference **film** vs the crops fails surface by design (06 B5) and is not asserted here. |
| frame report | `test/frame-report.test.ts` (new) | measure the Uber probe at t=1.3 → cx ≈ .135, cy ≈ .680, height ≈ .60 (the spec's 0.136/0.678); reader: missing, bad JSON, different score, 8/10 rows, duplicate shot, NaN |
| preflight | `test/preflight.test.ts` (extend) | identity findings become `check:"identity"` errors; `deferred` is exact; a passing preflight with frames absent is `ok:true` but `identity.deferred.length === 8`; missing identity block → error |
| gate rows | `test/gate-identity.test.ts` (new) | pure `identityGate(report, ties)` cases: missing, score, stage, picture, frame hash, variation hash, finding, pass; `preflightGate(report, score)` same |
| review reuse | `test/review-reuse.test.ts` (extend) | identity report reused on this picture; re-run on a different picture/null; a reused `pass:false` still fails |
| schema | `test/treatment.test.ts`, `test/style-check.test.ts` (extend) | new optional score fields parse; missing `identity.*` is a `style:check` error; `camera.keys` round-trips |
| camera keys | `test/camera-plan.test.ts` (extend) | pan/track/tilt/whip/orbit with only `from/to` is a finding; with `keys` it is not |

The pure gate predicate lives in `src/engine/style-identity.ts` (like
`checkTwinEvidence` in `determinism.ts`), so the gate row is a unit test rather
than something only a full gate can exercise.

### 9.2 Commands (acceptance, run once per change)

| Command | Expected |
|---|---|
| `npm run style:identity -- films/uber-model/score.json --video` | exit 1; prints the six named failures + performance/variation/film |
| `npm run style:identity -- films/uber-model/score.json` | exit 1 before the paint; same frame findings |
| `npm run preflight -- films/uber-model/score.json` | exit 1 with `[identity]` motif/performance/variation; `deferred` line printed |
| `npm run render:film -- films/uber-model/score.json --check` | exit 1; refuses on preflight/identity; **no Chrome** |
| `npm run gate:7 -- films/uber-model/score.json` | FAIL `preflight`, `styleIdentity`; `25 checks` |
| `npm run film:review -- films/uber-model/score.json --gate` | one page; `style:identity  FAIL · identity:field — …`; exit 1 |
| `npm run style:measure -- --ref Y:\NewVideoTest\out\claude-pop.mp4 --camera` | luma ≈100.9, sat ≈21.8, edges ≈12.6, palette ≈48.3; record the video sha256 |
| `npm run film:chain -- films/<new>/score.json` | `identity` runs after collage, `identity:video` after deliver, gate 25 |

The Uber acceptance asserts **codes**, not exact proxy numbers. The fixture
asserts the numbers. This is deliberate: a proxy that drifts by 2% must not
change the verdict; a proxy that stops separating the reference from Uber must be
fixed, and the fixture is where that shows.

### 9.3 Calibration gate (before wiring the gate)

1. Run `scripts/collage.ts` on a reference-derived frame set (the six crops are
   not enough for field/bars; use a 10-frame set from the reference or the
   `I-frames.json` rows). The reference must pass field/placement/scale/local/
   blue-on-blue/motifs.
2. Run it on Uber's collage. Uber must fail the six named axes.
3. If either fails, change the **measurement** (grid, aperture, bar detector),
   never the band. Record both reports in the decision.

The spec's rule: "if the reference film fails a film band, the band is wrong; if
Uber passes a field/placement/motif band, the band is not a gap check."

---

## 10. Over-engineering — what this plan deliberately does not build

- **No second identity command or report.** One `style:identity`, one JSON, one
  gate row. The frame report is an input, not a second verdict.
- **No per-axis gate rows.** Twelve rows over one file would be twelve copies of
  one tie and would slow the gate without adding evidence.
- **No new paint pass.** The probe already has the anchors; the collage already
  paints the frames. The frame report is a reader, not a renderer.
- **No silhouette segmentation, no ML vision.** The box is the rig aperture; the
  field/bars are a coarse grid; motifs and narrative are score declarations. Each
  is named as a proxy where it is used.
- **No re-measuring the delivered video frame by frame.** The frame axes come
  from the collage, protected by paint purity (0023) and `paintMatch`; the gate
  ties the report to `videoHash`.
- **No camera report/row.** `camera:check` already refuses; the identity camera
  finding is score-level and lives in preflight/identity.
- **No variation writer.** History is a tracked product record, updated when a
  film is accepted. A script that appends to it on a pass would let a film sign
  its own variation.
- **No acceptance script in the chain.** 06 may add
  `scripts/identity-acceptance.ts` as a test harness (reference + Uber halves);
  it is not a gate step and no production report depends on it.
- **No new dependency.** The grid math is arithmetic; ffmpeg already exists.

---

## 11. Risks and open questions

1. **The frame report is one frame per shot.** A blue-on-blue that appears only
   at the end of a shot is missed. The final sheet (30 frames) is the visual
   cross-check; P1 is three frames per shot. The report names `at: 0.5` so no one
   reads it as the whole shot. 06's B12 counts two frames in one shot; until the
   3-frame sample, the gate's tile rule is "≤1 shot", and B12's frame rule is a
   stricter test-only check.
2. **The height/centroid are rig apertures, not silhouettes.** They reproduce the
   spec's 0.136/0.678 on the current Uber probe, but a painter that draws a
   character away from its anchor would fool them. The frame report names
   `heightKind: "rig-aperture"`; the acceptance is the reference/Uber split.
3. **The side-bar detector is a heuristic.** A designed set feature (a wall, a
   lighting falloff) can trip the 8% rule. The message names the width; a `V`
   variant for a designed bar is a later, signed decision, not a silent pass.
4. **`build/` is gitignored.** `build/variation.json` from the spec would be lost
   on clone. The history must live in a tracked file; this plan proposes
   `styles/paper-kpop/variation.json` and records its hash in the report. An
   **empty but present** history passes with `films: 0` printed — a first film
   under the rule is a fact, not a missing measurement. If the owner wants a
   hard refusal until three films exist, that is a one-line band change, not a
   silent pass.
5. **Uber's existing reports are stale** after the change. `gate:7` will fail
   with "preflight predates the identity check" until the chain is rerun. That is
   intended; do not hand-edit reports.
6. **Contract change.** Raising `cast.stagedShare` 0.5 → 0.85, the two-reference
   split, and the new score fields (`performance`, `paletteScript`, `motifs`,
   `shots[].motif`, `shots[].framing`, `shots[].text`, `camera.keys`) change
   signed values. Both owners must sign decision 0053.
7. **Cost.** `style:identity --video` adds one video decode (~10–20 s on 30 s);
   the frame report adds ten PNG decodes (<2 s). No render is repeated.
8. **A film with no anchors** (a diagram, a new rig that does not publish chest/
   head) gets `identity:frames`, not a placement number. That is the honest
   failure: the instrument cannot see a performer it was not told about.

---

## 12. Files and order of work

| File | Change | Owner |
|---|---|---|
| `styles/paper-kpop/tokens.json` | (01) `identity`: `surfaceBands`, `filmBands`, `field`, `composition`, `edit`, `cast` (`stagedShare` 0.85, `archetype`, `stageRoles`, `silhouette`), `performance`, `motifs`, `forbidden`; camera stays in `tokens.motion.camera`, type in `tokens.type` | creative + shared |
| `styles/paper-kpop/variation.json` | tracked history, `{ "films": [] }` to start | creative |
| `src/engine/identity.ts` | (02) zod vocabulary and the score/library types this plan imports; no second identity file | shared |
| `src/engine/treatment.ts` | (02) optional `performance`, `paletteScript`, `motifs`, `shots[].motif`, `shots[].framing`, `shots[].text`, `camera.keys` | shared |
| `src/engine/pose.ts` | (02) optional `archetype`, `stageRoles`, `appearance` on the library | shared |
| `src/engine/paint-probe.js` | record `family` on text boxes (one field) | technical |
| `src/engine/frame-report.ts` | **new**: measure, read, summarize | technical |
| `src/engine/style-identity.ts` | findings, stage, summary, `identityGate` | shared |
| `src/engine/preflight.ts` | `identity` section in the report + `check:"identity"` | shared |
| `scripts/style-identity.ts` | stages, two measurements, report, fail-closed | shared |
| `scripts/collage.ts` | write `frame-report.json`; keep `rigRecords`; 192×108 grid | technical |
| `scripts/preflight.ts` | build the identity input, print | technical |
| `scripts/render-film.ts` | require identity/preflight; `--check` | technical |
| `scripts/gate-7.ts` | `preflight` row; grow `styleIdentity` | technical |
| `scripts/film-review.ts` | `preflight` step; identity tie + describe | technical |
| `scripts/film-chain.mjs` | `visual`, `identity`, `identity:video`; prove skipped reports | technical |
| `test/*` | §9 | technical |
| `docs/decisions/0053…` | the decision + the Uber/reference numbers | shared |
| `AGENTS.md`, `docs/STYLE-IDENTITY.md`, `docs/decisions/0052` | the new gate count and the amended contract | shared |

Order:

1. Tokens + score/library schema (01, 02).
2. `frame-report.ts` + probe `family` + collage writer; prove 0.135/0.680.
3. Findings + summary + `identityGate`; fixtures and unit tests.
4. `style:identity` stages/report; preflight; render `--check`.
5. Gate row + review + chain; the chain order test.
6. Acceptance on Uber; reference measurement; decision 0053.

---

## 13. What the Uber run must print

After the change, the six named axes fail, and the surface still passes:

```
identity: Kiran  worker@0.1.0  8 poses · 14 expressions · body · archetype office-worker (foil)
identity: Vaz    supervisor@0.1.0  8 poses · 14 expressions · body · archetype office-worker (foil)
identity: 9/10 staged · surface Δ luma +1.2 · Δ sat -4.1 · Δ contrast -18.8 · palette 43.0
identity: film luma 146.8 (75-130) · height sd 6.2 · x 0.135 (worst) · local 12.6 · bars 19/20% · motifs 0
  FAIL identity:cast           Kiran and Vaz are office-workers; the channel's cast is a paper-pop-performer
  FAIL identity:field          s01: side bars 19.0% left, 19.5% right; the field must reach every edge (max 8%)
  FAIL identity:placement      s01: the cast stands at x 0.135 (band 0.30-0.75) — the subject is in the side bar, not the frame
  FAIL identity:scale          height sd 6.2 (needs 15) and 2 tiers (needs 3) — a fixed height is a sticker
  FAIL identity:local-contrast the figure is 12.6 luma from what is behind it (median needs 35); 1/10 shots separate at 20 (needs 75%)
  FAIL identity:blue-on-blue   7/10 shots: a blue figure on a blue field (figure-blue 0.78, field hue 220, |ΔL| 12.6)
  FAIL identity:motif          0 motifs declared; the channel chooses 3-5 and gives each a meaning
  FAIL identity:performance    no performance block; the channel is a show — name the mode, the star, the entrance, the exit and the signature move
  FAIL identity:variation      no variation history at styles/paper-kpop/variation.json
  FAIL identity:film           luma mean 146.8 (band 75-130) — a cream plate, not a stage
identity: FAIL · 10 finding(s) shown · build/uber-model/style-identity/style-identity.json
```

The exact proxy values will differ by a few points; the **codes** are the
contract. The acceptance test is §5.5, read correctly: the **six reference
crops** pass the surface bands and the **reference film** passes the film bands;
**Uber** passes the surface bands (its cream plate matches the bright crops) and
fails the named gap axes and the film bands; a missing band, a null measurement
or a score claim the paint does not show is a failure, never a pass.
