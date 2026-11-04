# 03 — `frame-report`: measure the identity from the drawn frame (v1)

**Status:** implementation plan. No code is changed by this document.
**Date:** 4 November 2026.
**Spec:** `docs/research/identity/KPOP-IDENTITY.md` v1.3, §3.3–3.8, §5.3–5.5.
**Scope:** one new engine module, one new command, one probe extension. No new
dependency, no new binary, no second style/score/camera model.
**The bar for v1:** it catches the Uber film's named measurable failures
(field, side bars, centroid x, height rhythm, local contrast, blue-on-blue,
mean luma) and leaves the reference film passing. Everything else is reported,
not gated.

---

## 0. The one-page answer

`npm run frame:report -- <score.json> [--video]` decodes a handful of real
frames of the film, pairs each with the paint probe at the same time, and writes
`build/<film>/frame-report.json`. It measures, per shot and per film:

1. **Character bbox** — from the probe's rig points (anchors + limb endpoints),
   mapped to device space, with a declared pad for the head/hands/feet.
2. **Field and side bars** — quantised 4-bit colour, the largest 8-connected
   component, and a per-row run from each side with a hard inner-edge test.
3. **Local contrast** — the body core vs a 30 %-padded ring: Δ luma, Δ hue,
   figure blue share, and whether the figure is visible at all.
4. **Blue-on-blue** — figure blue > .30, ring hue 195–255, |Δ luma| < 18.
5. **Palette** — role shares from the pack's palette, warm/blue/saturated/ink
   shares, mean luma, largest flat region.
6. **Text** — union area, copy blocks (lines/words), bottom band, top-right HUD,
   text-over-face from `__textBoxes`.
7. **Per-shot windows** — the score's own shots, never ffmpeg scene detection.
8. **Tie** — score hash, video-stream hash, probe hash, frame hashes.

On today's Uber collage frames (v0 prototype, 10 frames) it reads: bars
**19–23 %** each side in **10/10** shots, subject centroid x **0.055–0.137**
(and 0.885–0.920 for the second figure) in **0/9** bands, subject height
**58–74 %** in **1** tier (sd ≈ 6), local Δ luma **1.4–2.4** for the blue figure
on the cobalt bar (Vaz on tomato separates at 33–36), blue-on-blue in **9/10**
frames, mean luma **151.8**, largest flat **.247**. The reference film
(`claude-pop.mp4`, 1 fps sample) reads bars in **4/157** frames (2.5 %, none
sustained), warm **.62**, blue **.01**, saturated **.51**, mean luma **95**,
largest flat **.108** — inside the bands.

`style:identity --video` calls it and merges its findings; the pre-render and
gate wiring is phased after v1.

### 0.1 Relationship to the sibling plans

Five plans were written in parallel. This one owns the **instrument**: the probe
extension, `src/engine/frame-report.ts`, the report's content, thresholds and
expected values. `04-gate` owns the finding wiring and the five readers;
`01-schema` owns the token keys; `06-tests` owns the acceptance harness. Where
04's sketch differs, this is the resolution:

| Question | 03 (this plan) | 04-gate sketch | Resolution |
|---|---|---|---|
| Who writes the report? | `frame:report` | `collage.ts` writes it, no new command | **Collage writes the scored-film report** (it already paints the frames and the probe); `frame:report` is the thin command for the delivered video, the score-less reference and tests. Collage decodes each PNG once at 480×270 and derives its existing 32×18 flatness sample from that grid. Both call the same `measureFrame`. |
| Grid | 480×270 | 192×108 | **480.** At 192 an 8 % bar is 15 px and the outer-2 % edge sample is 4 px; the bar rule cannot be stable. 04's 192 numbers are a cross-check, not the grid. |
| Samples | 3 per shot (video), 1 (collage) | 1 per shot | **Collage writes one sample per shot** (the frames it already paints); the delivered-video path with `inspect` uses 3. The report says `samples.perShot` and `confidence`; the gate reads the middle sample's row or the shot summary. |
| BBox | probe v2 character box + pad | chest/head anchor + `HEAD_FRACTION=.25` | **Probe v2.** 04's estimate (cx .135, spec .136) is the fallback when the probe is v1, labelled `heightKind:"rig-aperture"`; the exact box gives cx .055/.920 at 13.65. The gate reads the 03 box. |
| Contrast | body vs 30 % ring (`ring`) | non-dominant inside the box vs dominant (`local`) | **The ring is measured and judged here.** 04's I-frames `local` is emitted beside it when the gate asks; it reads 12.6 on Uber against the ring's 1.7. Both are far below 20, so the verdict is the same. The report names which number it judged and never averages them. |
| Findings | descriptive codes (`identity:bars`, …) | gate codes (`identity:field`, `identity:placement`, `identity:scale`, `identity:local-contrast`, `identity:blue-on-blue`, `identity:film`, `identity:type`) | **The report keeps its detail codes; the gate maps them** (Appendix B has the mapping). One report, not two. |
| Acceptance | §13 values | §5.5 matrix | `06-tests` owns `npm run identity:accept`; it asserts the numbers in §13. |

This plan does not add a second camera, palette, type or score model; it reads
the score, `tokens.color`, `tokens.identity` and the probe.

---

## 1. What v1 measures, and what it deliberately does not

| Measured from the frame | Instrument | Gate in v1 |
|---|---|---|
| Character present / visible / occluded | probe + body mask | warn (fail on 2/3 samples) |
| Character bbox, height, width, centroid | probe | yes (height band, rhythm, centroid x) |
| Side bars, plate-with-wings | frame | **yes** |
| Figure vs ring contrast | probe + frame | **yes** |
| Blue-on-blue | probe + frame | **yes** |
| Warm / blue / saturated / mean luma | frame | **yes** (film p50) |
| Largest flat region | frame | **yes** (film p50) |
| Role count, role shares | frame + `tokens.color` | yes (p50 4–7) |
| Text blocks, lines, words, bottom band, over-face | probe | yes (blocks/lines/words/over-face) |
| Motifs | — | **no** (semantic; stays human) |
| Archetype (“is this an idol?”) | — | **no** (library + human) |
| Tone / joke / sweet-sinister | — | **no** (human) |
| Camera, edit rhythm, transitions | — | **no** (`camera:check`, preflight own them) |

The three unmeasured axes are **named gaps**, not silent passes
(`gaps: [{ code, axis, why }]`). The spec's acceptance test §5.5 is met on every
axis this tool can measure (surface, field, centroid x, height rhythm, local
contrast, blue-on-blue); **motifs** and **archetype** remain a human sign of the
film, exactly as §9.7 says.

**Not in v1:** a silhouette matte, k-means, CIEDE2000, per-pixel paper
classification, a semantic “does this read as paper” score, a generated image
path, running on every frame of a 156 s reference, or a second shot model.

---

## 2. Where it lives, and the commands

| Piece | Path | Owner |
|---|---|---|
| Pure measurement (buffers → numbers) | `src/engine/frame-report.ts` | technical |
| Command (ffmpeg, probe, score, report) | `scripts/frame-report.ts` | technical |
| Probe extension | `src/engine/paint-probe.js` (+ `scripts/render-film.ts` header) | technical |
| Probe version in the file | `scripts/render-film.ts` | technical |
| Bands (phase 2) | `styles/paper-kpop/tokens.json → identity.frameReport` | creative |

```bash
# a scored film; video + inspect probe if both exist, else collage
npm run frame:report -- films/uber-model/score.json
npm run frame:report -- films/uber-model/score.json --video
npm run frame:report -- films/uber-model/score.json --pre      # collage only, no video
```

The pre-render report for a scored film is written by `collage` (it already
paints one frame per shot and the probe); `frame:report` re-measures the
delivered video, a slice, or the score-less reference. Both write the same
artifact and share `measureFrame`.

```bash
# the reference film, with no score and no probe (frame-only metrics)
npm run frame:report -- --video Y:\NewVideoTest\out\claude-pop.mp4 --sample 1

# a test/diagnostic slice
npm run frame:report -- films/uber-model/score.json --times 1.30,13.65,19.00 \
  --probe build/uber-model/collage/probe.json \
  --frames build/uber-model/collage/frames
```

Exit codes: `0` pass, `1` one or more `fail` findings, `2` bad usage or missing
input. `--json` prints the report to stdout. Every run writes:

- `build/<film>/frame-report.json` — the machine report.
- `build/<film>/FRAME-REPORT.md` — one page, one row per shot, then findings.

Both are build artifacts (gitignored), never film inputs. The report carries no
wall-clock time, so two runs on the same inputs are byte-identical.

**Reuse, not reinvention.** `src/engine/frame-report.ts` imports `summarize`,
`median`, `percentile` and `rgbHex` from `src/engine/style-measure.ts`, and the
script uses `findFfmpeg` / `runBinary` from `src/engine/grid.ts`,
`videoStreamHash` / `fileHash` from `src/engine/video.ts`. No new dependency, no
new binary, no second percentile or summary vocabulary.

---

## 3. Probe v2 — the exact extension

The probe currently records `__textBoxes` and `__rigRecords`
(`solve` / `limb` / `anchor`). It cannot say where the character ends. Three
additive changes, no painter change:

### 3.1 Record the transform with every rig point

`limb` and `solve` are called in whatever local space the rig has in force
(torso lean, leg root, head pivot). Today the probe records the local numbers
only, so they cannot be placed on the frame. Record the matrix at the call:

```json
[
  { "kind": "limb", "character": "Kiran", "len": 92,
    "from": [-43, -448], "to": [-33.8, -356.5],
    "m": [1.0498, 0.0210, -0.0210, 1.0498, 244.14, 1076.94],
    "p0": [199.1, 606.4], "p1": [211.2, 667.5] },

  { "kind": "solve", "character": "Kiran", "side": -1,
    "hip": [14, -281], "target": [18, -8], "l1": 156, "l2": 117,
    "reach": 273.4, "hipAngle": 0.0, "kneeBend": 0.0, "shinAngle": 0.0,
    "m": [1.0498, 0.0210, -0.0210, 1.0498, 244.14, 1076.94],
    "p0": [258.8, 782.1], "p1": [262.9, 1067.9] }
]
```

`p0/p1` are the device points, rounded to 0.1 px: `x' = a·x + c·y + e`,
`y' = b·x + d·y + f`. Anchors already carry `m`; add `p` (their device point)
for symmetry. **Nothing is removed**; every existing audit reads the old fields
unchanged.

### 3.2 One character box per draw

Wrap `drawCharacter` (the probe already does) and keep a stack:

```json
{ "kind": "character", "character": "Kiran",
  "at": [240, 960], "scale": 1.0498,
  "core": { "x0": 213.2, "y0": 479.1, "x1": 300.4, "y1": 1061.0 },
  "points": 26 }
```

`core` is the min/max of **every device point attributed to that character
during that draw**: anchors (`chest`, `head`, `hair`, …), every limb endpoint,
every solve hip/target. `at`/`scale` are `arguments[1..3]` of `drawCharacter`
(diagnostics only; the box does not use them). Nested draws use a stack. A
character that publishes **no** rig points yields `core: null` and a gap — never
a guessed box.

The probe also sets `window.__probeVersion = 2`. `render-film` returns
`characterBoxes` per frame and writes the probe file as:

```json
{ "version": 2, "frames": [ { "time": 1.3, "textBoxes": [], "rigRecords": [],
  "characterBoxes": [], "sample": [] } ] }
```

A v1 probe file (no `version`) still answers field, palette and bars, but
character and text measurements are `notMeasured` (a **gap**, not a pass) and
the command says “repaint the probe with `npm run inspect`”.

### 3.3 What the box is, and is not

`core` is a **joint box**, not a silhouette. The paper extends past the joints:

| Edge | What is missing | Pad v1 |
|---|---|---|
| top | hair mass, petals, crown, halo, hat | `0.12 × core height` |
| sides | hand blob + thumb beyond the wrist, sleeve | `0.04 × core height` |
| bottom | boot/sole below the ankle | `0.02 × core height` |

The pads are ratios of the core height, so a close-up and a wide pad
proportionally. The report applies them (not the probe) so the rule is visible
and changeable without repainting:

```
box = { x0 - .04h, y0 - .12h, x1 + .04h, y1 + .02h }   // h = core.y1 - core.y0
```

**Calibration.** Office rig (`films/uber-model/vendor/office.js`): head centre
at −518, hair top at −566, ankle at 0 → hair radius ≈ 48 / 518 = **.093**;
hand blob extends 13 / 518 = .025; sole 10 / 518 = .019. Idol rig
(`characters.js`): head centre −604, petal `r1` 146 plus a halo ring at 169 →
radius **.24–.28** of the head centre. So .12 covers a human head with margin
and **under-measures a flower head by up to .16 × height**. v1 reports that:

```json
{ "uncertainty": { "top": 0.12, "sides": 0.04, "bottom": 0.02,
                   "heightShare": 0.077, "worstCase": "flower head" } }
```

`heightShareUncertainty = 0.16 × heightShare` for a flower head (a 60 % figure:
±9.6 points); `0.12 × heightShare` for a human rig (±7.2). A film within 3
points of a band edge is marked `nearBand`, never a silent pass. Phase 2: a
library character may publish `body.headRadius` (local units) and the report
uses `headRadius / coreHeight` instead of .12; until then `headPadAssumed:
true` is printed.

**Clipping.** If the padded box touches a frame edge (within 2 px), the sample
is `clipped: true` and is excluded from the film height distribution; the
report states how many were excluded. Fewer than 3 unclipped samples →
`heightMeasured: false` (a gap).

**Why not the drawn silhouette?** A colour mask from the frame cannot separate a
blue figure from a blue bar — precisely the identity failure. The rig box always
exists; the mask is used only to decide *visible* (§6), where its failure is the
finding.

---

## 4. Decoding and sampling

One grid for everything: **480 px wide**, height preserving
(480×270 at 16:9, 480×853 at 9:16). Device-space boxes and text boxes are
scaled by `480 / frameWidth`. At 480 a 19 % bar is 91 px and an 8 % bar is
38 px; a 2 px edge is 0.4 % of width. That is enough; the tool never needs
1080p.

**Samples per shot: 3 at 20 %, 50 %, 80 % of the shot**, snapped to the nearest
probe time within 0.05 s. For a 30 s / 10 shot film that is 30 frames — the same
sample count the spec's §7 uses (“25/30 frames”). The frame decoded is the
**probe's** time (so picture and box are the same frame); `phaseTime` records the
ideal and `time` the snapped one.

Which frames:

1. **Scored film, video + `build/<id>/inspect/probe.json`** (preferred): decode
   the 30 frame numbers in **one ffmpeg pass** with a `select='eq(n,…)+…'`
   expression, scaled to 480. One decode of a 30 s film, no 30 seeks.
2. **Scored film, collage only** (`--pre`, or no video): the collage's 10 frames
   and its probe; one sample per shot at the collage time (0.5). The report says
   `samples.perShot: 1`, `confidence: "low"` for sustained rules.
3. **Explicit `--probe` + `--times`**: a fixture or a diagnostic slice. The
   report names it `slice`, `reuse: false`.
4. **No score** (`--video <path> --sample <s>`): one pass at
   `fps = 1/sample` (default 1 s), `mode: "frames"`, no shot aggregation, no
   character/text. This is how the reference is measured.

Costs: video path ≈ 3–5 s (30 frames + 16 MB probe read + metrics); collage
≈ 1.5 s; reference at 1 fps ≈ 30–40 s for 156 s. All pure JS on typed arrays;
no worker needed.

**No scene detection, ever.** Shots are the score's: `shot[0].start = 0`,
`start[i] = start[i-1] + duration[i-1]`; a sample at `start + phase × duration`.
`style:measure --score` already does the same and must stay the only other
consumer of shot windows.

---

## 5. Field component and side bars

### 5.1 Largest flat region (the “field” number)

1. Quantise each pixel to **4 bits per channel**: `q = (r>>4)<<8 | (g>>4)<<4 | (b>>4)`
   (16 levels, 4 096 bins). 4 bits is deliberately coarse so paper fibre, grain
   and halftone stay in one bin.
2. **3×3 majority filter** on `q` (each pixel becomes the most common value in
   its 3×3 neighbourhood, ties to itself). This removes speckle so a component
   is a region, not a sieve. Deterministic, row-major.
3. **8-connected components** on equal `q`, iterative stack (no recursion).
4. Largest component = `field`; its share of the frame, its quantised hex, its
   device-space box, and which borders it touches.

Measured reference: p50 **.108** (p10 .044, p90 .292) on 157 samples. Uber:
p50 **.247** (.103–.450). The spec's “field colour share” (.27) and “largest
flat region” (.268) are the same measurement, so v1 has **one** number and one
band **.04–.46**. (A second band .18–.60 would contradict .04–.46 at the low
end; do not ship two.)

`field.family` = the family of that component's hex (same classifier as §8):
`warm | blue | acid | pink | teal | ink | neutral`. `field.role` = the nearest
`tokens.color.palettes[default]` role within RGB distance 90, else `other`
(informational; role names come from the pack, never from the engine).

### 5.2 Side bars — border-column profile with a hard inner edge

A side bar is a **vertical strip of one colour at a frame edge, ending in a hard
inner edge**, at least 8 % of the width wide, present in enough rows to be a
strip rather than one row's accident.

For each side:

1. `edgeColour` = median RGB of the outer 2 % of columns (`0..0.02W` or
   `0.98W..W`).
2. For **every row**, walk inward from the edge while
   `RGBdistance(pixel, edgeColour) ≤ 26`. That is the row's run.
3. Build a histogram of runs in **1 %-of-width bins**. `share` = the **highest
   bin holding at least 4 % of the rows**. (A bar under a title card or behind a
   character still has clear rows above/below; a single-row outlier cannot win.)
4. `jump` = the **largest single-column luma change** in the window
   `[share − 5 %, share + 2 %]`. A paper bar edge is a step; a vignette is a
   ramp. This is the discriminator that kills the reference's vignette false
   positives.
5. `flat` = RGB distance between the median colour at 2–4 % and at
   `share − 2 % .. share`. A flat strip is one colour; a gradient sky is not.
6. `fieldDistance` = RGB distance between `edgeColour` and the field component's
   hex. A bar is not the field.
7. `bar = share ≥ .08 && share ≤ .45 && jump ≥ 25 && flat ≤ 12 &&
   fieldDistance > 40`.

**Why a row histogram, not a column sd.** 04-gate's sketch measures each column's
flatness over the full height (`sd < 6`). On Uber a title card or a character
covers 70 % of a bar's height, so the full-column sd is large and the bar
disappears; the row-run histogram asks the same question one row at a time, so
the 30 % of clear rows are enough. If the merge prefers column statistics,
compute them on the top and bottom 20 % of rows only.

Per shot: `barPresent = samplesWithBar ≥ ceil(samples / 2)`. Per film:
`barShots` = shots with a bar on either side; `barFail = barShots ≥ 2` (one
designed set wall is a warning, not a refusal) and `barShots / stagedShots ≥
.25`. `leftShare`/`rightShare` are reported per sample and as the film p50.

**Measured.**

| Set | left | right | bar frames/shots |
|---|---|---|---|
| Uber collage | .190–.220 (p50 .200) | .190–.230 (p50 .205) | **10/10 shots** |
| Reference video, 1 fps | — | — | **4/157 frames** (f61, f77, f92, f93 = 2.5 %) |
| Reference six crops | .08–.46 | .02–.49 | **not valid** — hero crops have flat set walls at the edge; do not run the bar check on `references/frames` |

The four reference frames are a red wall (f61), a kraft wall (f77) and two
one-frame transition masks (f92/93). With 1 s sampling and no shot windows they
are reported as `candidateFrames` and the film rate (2.5 %) stays under the
`> 10 %` frames-mode threshold. A **single** candidate is never a film failure.

**Failure cases, named.**

- Soft vignette → `jump < 25` (this was 47/157 false positives before the jump
  test; it is 4 after).
- Flat set wall at the edge > 8 % → passes as a bar candidate (f61/f77). Accepted
  false positive; the film rule needs 2 shots or 25 %, and the finding names the
  shot so a person can sign it.
- A bar whose colour is the field → `fieldDistance ≤ 40`.
- Letterbox / top-and-bottom bars → **out of scope** (v1 checks left/right only);
  state it in the report.
- A 9:16 film → the same column profile works; the band is still 8 % of width.
- A bar fully covered in every row → `share` collapses to the occluder's run and
  the bar is missed (under-report, never a false pass of the film when the other
  side is visible). Reported as `undetected: true` if `jump` is high at the
  largest run but `share < .08`.

### 5.3 Plate-with-wings (the Uber failure, exactly)

`plateWithWings = bar left && bar right && field.family ∈ {warm, neutral} &&
field.share ≥ .18`, per sample. Per film: ≥ 75 % of staged shots. This is the
spec's “cream plate with two colour wings is a diagram layout” made mechanical.
Uber: **8/10** (left .20, right .21, field warm — #e0d0c0 in 8 shots, #504030
in the two map shots; those two fragment the cream into tiles and their largest
component is 11 %). A full-bleed warm field has no bars, so it passes.

---

## 6. Local contrast, visibility and the ring

### 6.1 The two regions

From the padded character box:

- **body** = the **middle 60 % of width**, from **10 % below the top** to the
  bottom. Rationale: the centre column is torso/legs; the outer thirds are arms
  and background; the top 10 % is hair/petals. This is a *body sample*, not a
  colour mask, so a blue figure on a blue bar is still sampled as blue.
- **ring** = the box expanded by **30 % of its width and height**, minus the
  box, clipped to the frame. If the ring is clipped on two sides (a figure at
  the frame edge) it is still used but `ringClamped: true`; if the ring has
  < 2 % of the frame area, `contrast: null, reason: "ringTooClose"` (a gap).

Metrics: median luma of body and ring, **Δluma = |body − ring|**; median hue of
both and circular Δhue (null when the body or ring is achromatic, e.g. a black
suit: `< 5 %` of pixels with S ≥ .20); **bodyBlue** and **ringBlue** = share of
pixels with S ≥ .25, V ≥ .10, hue 195–255. Per character, then per shot: **worst
figure** (min Δluma) is the shot's verdict; the mean is reported.

For two-handers, report every figure. Uber 13.65: Kiran Δ 1.7 (blue .88), Vaz
Δ 32.7 (blue 0) → shot 1.7.

### 6.2 Visibility

`maskShare` = share of the **core** box whose pixels are farther than 26 RGB
from the ring's median colour. `visible = maskShare ≥ .02`.

- A figure hidden behind the bar/map (Uber 10.50 and 22.10: Vaz is drawn at
  x .096–.177, the cobalt bar is painted over him) reads `maskShare .05`,
  `visible: false`, `contrast: null`. The finding is **`identity:figureHidden`**,
  not “Δ 0”. This is a real P0 the probe alone could not see.
- A genuinely blue-on-blue figure can also drop below .02; the report says
  `visible:false` **and** blue-on-blue, which is honest (it is not visible).

### 6.3 Bands and failure cases

Spec §5.3: `|ΔL| ≥ 20 in 75 % of shots; median ≥ 35`. Uber: **0/7 measured**
shots reach 20 on the ring (median 1.7; 2 shots are hidden and measure nothing)
→ fail. The spec's published 12.6 is the **I-frames** `local` (04-gate's
definition, emitted beside the ring when asked); it is also below 20 and the
finding does not depend on which is read. Reference: **not measured** (no probe)
— a gap, not a pass, and the reference is not gated on it.

- Close-up where the ring falls inside the body → `ringShare` low →
  `contrast: null` (gap), never a fake pass.
- Arms-out pose → the 60 % body inset still lands on the torso.
- Two figures overlapping → each box separately; overlap pixels are in both
  samples; report `overlap: true`.
- A figure drawn *behind* a set → visibility catches it.
- A paper-coloured character on a cream plate → low ΔL is the finding.

---

## 7. Blue-on-blue

```
blueOnBlue = bodyBlue > .30
          && ring.hue ∈ [195, 255]
          && |bodyLuma − ringLuma| < 18
```

Frame-level. Per shot: `≥ 2/3 samples` (1/1 for the collage). Per film:
`blueOnBlueShots / stagedShots ≥ .25` → fail. The spec's one-frame reference
trip does not sustain; Uber is **9/10 sampled frames (9/9 staged shots)** —
seven Kiran frames plus the two hidden Vaz frames where the body sample is the
bar. Report `bodyBlue`, `ringHue`, `deltaLuma` for every sample so the verdict
is auditable.

---

## 8. Palette: families, roles, largest flat

### 8.1 Families (the pass/fail layer)

Per pixel, in HSV, **first match wins** (ink, then the saturated hue bands, then
the low-saturation paper/neutral branch):

| Family | Rule |
|---|---|
| ink | V < .16 |
| blue | S ≥ .20 and hue 195–255 |
| warm | S ≥ .20 and (hue 0–55 or ≥ 330); **or** S ∈ [.04, .20), V ≥ .45, hue 15–70 (paper/cream) |
| acid | S ≥ .20 and hue 55–140 |
| teal | S ≥ .20 and hue 140–195 |
| pink | S ≥ .20 and hue 300–330 |
| neutral | everything else |

`saturated` = S ≥ .35 and V ≥ .15 (the spec's definition). `warmShare`,
`blueShare`, `saturatedShare`, `inkShare`, `meanLuma` per frame; film p50.
Bands: warm **.40–.90**, blue **≤ .20**, saturated **.35–.70**, mean luma
**75–130**. Reference: .62 / .01 / .51 / 95. Uber: .72–.83 / .16–.25 / .43–.60 /
151.8 → **mean luma fails** (the cream plate has no deep darks); blue p50 .17
passes (blue is a field *and* an accent, but the bars carry the field failure).

### 8.2 Roles (the informational layer)

Classify each pixel to the nearest role in `tokens.color.palettes[default]`
(six hexes) with a max RGB distance of 90; the rest is `other`. `roleShare`,
`roleCount` = roles with share ≥ 1 %. Band **4–7** (5 for a 30 s short — read
`tokens.color.maxColours` if the creative owner raises it; do not hardcode 7 in
the engine). Uber: 5 (paper .43, blue .23, red .21, accent .04, ink .05).
Reference: roles mostly map to `other`/paper because the pack palette has no
marigold/teal/kraft — that is why families, not roles, are the pass/fail layer
for a reference. The report says `roleSource: "tokens.color"` and
`roleCoverage` (share classified, Uber .96).

`other` > .35 in a scored film is a warning (the film is outside the pack
palette; the palette audit owns the hard rule).

---

## 9. Text

All boxes are `__textBoxes` in device space, scaled to the 480 grid for
geometry and kept in device units for the report.

### 9.1 Boxes and blocks

- `boxes` = every probe box; `copyBoxes` = `copy: true` (the film's own words);
  `labels` = the rest (costume tags, map labels, prop text).
- **Block grouping** (copy only): sort by y; a box joins the previous block when
  `|x0 − block.x0| ≤ .03W` and `y0 − block.y1 ≤ .5 × max(h, block.lineH)`.
  A stacked 2–3 line hook is **one block**, not three boxes. Uber 13.65: 3 copy
  boxes → 2 blocks.
- Per block: lines, words per line, union box, area share.

### 9.2 The rules

| Rule | Band | Uber |
|---|---|---|
| copy blocks per shot | ≤ 2 | 2 → pass |
| lines per block | ≤ 3 | 2 → pass |
| words per line | ≤ 8 | ≤ 3 → pass |
| bottom band text (y ≥ .88H) | warn > .06, fail > .10 | .036–.062 → warn at 1.30 only |
| top-right HUD | optional; a mono box in x > .75W, y < .15H, h ≤ .06H | 0 → pass |
| text over face | ≥ 10 % of the face box in ≥ 2/3 samples → fail | 0 (the 19.00 card covers the hair, ~4 % of the face) |
| text over figure | report only (`overFigureShare`) | true at 19.00; not gated |
| safe margin | report only (`audit:type` owns the floor) | — |

`face box` = centred on the `hair` anchor (else `head`), half-width
`.05 × coreH`, half-height `.06 × coreH` (the office face is 72×84 local of a
704 core → .051/.060). Intersection area / face area = `overFaceShare`.

**Do not gate total text area at 6 %.** Uber 13.65 is 12.2 % and legitimate: a
5.1 % display block, a 3.8 % caption and the rest prop/map labels. The spec's
2–6 % band is for **small text**, while a hook block is allowed 8–25 %; a shot
can legitimately carry both. Gate blocks/lines/words and the bottom band;
report total area and `copyAreaShare`.

**Anti-cheat:** if the score's `shot.slots` contains a `content.*` string and
the probe marks **no** copy box for that shot, fail `identity:textUnmarked`
(marking everything `copy:false` does not buy a pass). `audit:type` keeps its
own cross-check.

---

## 10. Per-shot windows and aggregation

- Shots from the score, cumulative duration; a sample at
  `phase ∈ {.2,.5,.8}`. No ffmpeg scene detection.
- Every sample carries its shot id, time, frame number, and probe time.
- Shot verdicts use the rules in §5–§9; the film verdict uses p50 over samples
  and the share over **staged** shots (a shot whose `direction.cast` is empty is
  `cast: []`, not a failure).
- A shot with no cast: `character: {present:false}`, `contrast: null` with
  `reason:"no cast"` (not a gap). Uber 16.40 is this case.
- Sample confidence: `high` with 3 samples/shot, `low` with 1. A `low` shot can
  produce `warn`, not `fail`, for **sustained** rules (blue-on-blue,
  over-face, hidden figure) unless the finding is impossible to explain
  otherwise. The collage path therefore reports Uber's two hidden figures as
  warnings; the video path (3 samples) can promote them.

---

## 11. The report JSON

Written to `build/<film>/frame-report.json`. This is the shape; values are the
v0 prototype's 13.65 sample and film summary (to be reproduced within ±1.5
points of share, ±2 luma by the implementation):

```json
{
  "$schema": "paper-studio/frame-report@1",
  "version": 1,
  "film": "uber-model",
  "style": "paper-kpop",
  "mode": "scored",
  "source": "collage",
  "score": "sha256:5f5f71f339dabdca7e59d06f95d533727d5f6d5fe528c44a087519c7054e61a9",
  "video": null,
  "videoHash": null,
  "probe": {
    "file": "build/uber-model/collage/probe.json",
    "sha256": "sha256:…",
    "version": 2,
    "score": "sha256:5f5f71f3…",
    "times": [1.3, 4.4, 7.6, 10.5, 13.65, 16.4, 19.0, 22.1, 25.2, 28.35]
  },
  "frame": { "width": 1920, "height": 1080, "aspect": "16:9" },
  "grid": { "width": 480, "height": 270, "scale": 4 },
  "sampling": { "perShot": 1, "phases": [0.5], "samples": 10, "confidence": "low" },
  "thresholds": {
    "bar": { "maxShare": 0.08, "maxBand": 0.45, "minRows": 0.04,
             "colourTolerance": 26, "edgeJump": 25, "stripFlat": 12,
             "fieldDistance": 40, "shotFail": 2, "filmShare": 0.25 },
    "contrast": { "ringPad": 0.30, "bodyInset": 0.20, "bodyTop": 0.10,
                  "figureDistance": 26, "minVisible": 0.02,
                  "deltaLuma": 20, "shareAtLeast20": 0.75, "medianMin": 35 },
    "blueOnBlue": { "figureBlue": 0.30, "hue": [195, 255], "deltaLuma": 18,
                    "shotShare": 0.25 },
    "subject": { "height": [0.13, 0.92], "centroidX": [0.30, 0.75],
                 "centroidXShare": 0.80, "heightSd": 15, "tiers": 3 },
    "palette": { "warm": [0.40, 0.90], "blueMax": 0.20,
                 "saturated": [0.35, 0.70], "meanLuma": [75, 130],
                 "largestFlat": [0.04, 0.46], "roles": [4, 7] },
    "text": { "blocks": 2, "lines": 3, "wordsPerLine": 8,
              "bottomWarn": 0.06, "bottomMax": 0.10, "overFace": 0.10 },
    "bbox": { "padTop": 0.12, "padSide": 0.04, "padBottom": 0.02,
              "heightUncertainty": 0.16 }
  },
  "shots": [
    {
      "shot": 5, "from": 12.0, "to": 15.3, "recipe": "fare_split",
      "cast": ["Kiran", "Vaz"],
      "samples": [
        {
          "time": 13.65, "phaseTime": 13.65, "frame": 410, "probeTime": 13.65,
          "character": {
            "present": true, "visible": true, "clipped": true,
            "boxes": [
              { "character": "Kiran", "core": { "x0": 59, "y0": 479, "x1": 153, "y1": 1070 },
                "box": { "x0": 35, "y0": 408, "x1": 177, "y1": 1082 },
                "heightShare": 0.624, "widthShare": 0.074,
                "centroid": { "x": 0.055, "y": 0.690 }, "points": 26 },
              { "character": "Vaz", "core": { "x0": 1718, "y0": 470, "x1": 1816, "y1": 1075 },
                "box": { "x0": 1694, "y0": 398, "x1": 1841, "y1": 1087 },
                "heightShare": 0.638, "widthShare": 0.077,
                "centroid": { "x": 0.920, "y": 0.687 }, "points": 26 }
            ],
            "subject": "Vaz", "heightShare": 0.638, "centroidX": 0.920,
            "uncertainty": { "heightShare": 0.077, "headPadAssumed": true }
          },
          "field": {
            "share": 0.197, "hex": "#e0d0c0", "family": "warm", "role": "paper",
            "box": { "x0": 408, "y0": 0, "x1": 1464, "y1": 460 },
            "familyShare": 0.717,
            "bars": {
              "left": { "share": 0.190, "jump": 116.1, "flat": 5.1,
                        "fieldDistance": 96.0, "hex": "#1e37af", "rows": 0.12 },
              "right": { "share": 0.210, "jump": 91.5, "flat": 4.2,
                         "fieldDistance": 90.0, "hex": "#c93c23", "rows": 0.23 }
            },
            "plateWithWings": true
          },
          "contrast": {
            "ringLuma": 58.3, "bodyLuma": 56.6, "deltaLuma": 1.7,
            "ringHue": 230, "bodyHue": 228, "deltaHue": 2,
            "bodyBlue": 0.88, "ringBlue": 0.71,
            "maskShare": 0.77, "visible": true, "ringClamped": false,
            "figures": [
              { "character": "Kiran", "bodyLuma": 56.6, "deltaLuma": 1.7,
                "bodyHue": 228, "deltaHue": 2, "bodyBlue": 0.88 },
              { "character": "Vaz", "bodyLuma": 55.5, "deltaLuma": 32.7,
                "bodyHue": null, "deltaHue": null, "bodyBlue": 0.00 }
            ],
            "blueOnBlue": true
          },
          "palette": {
            "warm": 0.717, "blue": 0.246, "saturated": 0.508, "ink": 0.034,
            "neutral": 0.03, "meanLuma": 146.1,
            "roles": [
              { "name": "paper", "share": 0.426 }, { "name": "blue", "share": 0.228 },
              { "name": "red", "share": 0.206 }, { "name": "accent", "share": 0.044 },
              { "name": "ink", "share": 0.053 }
            ],
            "roleCount": 5, "otherShare": 0.043
          },
          "text": {
            "boxes": 8, "copyBoxes": 3, "labels": 5,
            "blocks": [
              { "x0": 139, "y0": 109, "x1": 718, "y1": 293,
                "lines": 2, "words": 4, "wordsPerLine": 2,
                "areaShare": 0.051, "copy": true },
              { "x0": 260, "y0": 817, "x1": 795, "y1": 975,
                "lines": 1, "words": 2, "wordsPerLine": 2,
                "areaShare": 0.038, "copy": true }
            ],
            "copyWords": 6, "areaShare": 0.122, "bottomBandShare": 0.041,
            "topRightHud": false, "overFaceShare": 0.00, "overFigureShare": 0.00,
            "safe": true
          }
        }
      ],
      "summary": {
        "heightShareP50": 0.631, "centroidXP50": 0.920,
        "centroidXInBand": false, "bars": { "left": 0.190, "right": 0.210 },
        "plateWithWings": true, "deltaLumaMin": 1.7, "deltaLumaP50": 17.2,
        "blueOnBlue": true, "fieldHex": "#e0d0c0", "meanLuma": 146.1,
        "copyBlocks": 2, "samples": 1
      }
    }
  ],
  "summary": {
    "shots": 10, "stagedShots": 9, "samples": 10,
    "subject": {
      "height": { "n": 9, "p50": 0.669, "min": 0.581, "max": 0.743,
                  "sd": 0.060, "tiers": 1, "clipped": 3 },
      "centroidX": { "p50": 0.126, "inBand": 0, "pass": false },
      "centroidY": { "p50": 0.690, "note": "bbox centre; advisory in v1" }
    },
    "field": {
      "share": { "p50": 0.247, "min": 0.103, "max": 0.450 },
      "family": "warm", "distinctHex": 2, "role": "paper",
      "bars": { "leftP50": 0.200, "rightP50": 0.205, "shots": 10 },
      "plateWithWingsShots": 8
    },
    "contrast": {
      "deltaLuma": { "n": 7, "p50": 1.7, "min": 1.4, "max": 2.4 },
      "deltaHue": { "n": 7, "p50": 2 },
      "shareAtLeast20": 0.0
    },
    "blueOnBlue": { "samples": 9, "shots": 9, "shotShare": 1.0, "sustained": true },
    "palette": {
      "warmP50": 0.783, "blueP50": 0.173, "blueMax": 0.250,
      "saturatedP50": 0.447, "meanLumaP50": 151.8,
      "largestFlatP50": 0.247, "roleCountP50": 5
    },
    "text": {
      "maxCopyBlocks": 2, "maxLines": 3, "maxWordsPerLine": 4,
      "bottomBandP90": 0.062, "overFaceShots": 0, "hudShots": 0
    },
    "visibility": { "stagedFrames": 9, "visible": 7, "hiddenShots": [4, 8] }
  },
  "findings": [
    { "code": "identity:bars", "severity": "fail", "shots": 10,
      "message": "side bars in 10/10 shots: left 19-22 % (band <= 8 %), right 19-23 %" },
    { "code": "identity:fieldPlate", "severity": "fail", "shots": 8,
      "message": "a warm field between two colour wings in 8/10 shots - the cream plate layout, not a full-bleed field" },
    { "code": "identity:centroidX", "severity": "fail", "value": 0.0,
      "message": "0/9 staged shots put the subject in x .30-.75 (band: 80 %); subject x p50 .126, second figure .920" },
    { "code": "identity:heightRhythm", "severity": "fail", "sd": 0.060, "tiers": 1,
      "message": "height sd 6.0 points (band >= 15) and 1 tier (band >= 3): the size is right, the rhythm is gone" },
    { "code": "identity:localContrast", "severity": "fail", "shareAtLeast20": 0.0,
      "message": "0/7 measured shots reach 20 local luma (median 1.7; band: 75 % >= 20, median >= 35); 2 shots hidden" },
    { "code": "identity:blueOnBlue", "severity": "fail", "shots": 9,
      "message": "a blue figure on a blue ring in 9/9 staged shots (band: 0 sustained)" },
    { "code": "identity:meanLuma", "severity": "fail", "value": 151.8,
      "message": "mean luma p50 151.8 (band 75-130): a cream plate with no deep darks" },
    { "code": "identity:figureHidden", "severity": "warn", "shots": [4, 8],
      "message": "Vaz is drawn at x .096-.177 but not visible: the cobalt bar is painted over him" },
    { "code": "identity:bottomBand", "severity": "warn", "value": 0.062,
      "message": "text covers 6.2 % of the frame in the bottom 12 % band (warn > 6 %, fail > 10 %)" }
  ],
  "gaps": [
    { "axis": "motifs", "why": "semantic; not measurable from a frame in v1" },
    { "axis": "archetype", "why": "library declaration + human; see spec §9.7" },
    { "axis": "tone", "why": "human" }
  ],
  "pass": false
}
```

Notes on the shape:

- `field.share` is the **largest flat region**; the spec's “field share” and
  “largest flat region” are the same number. Do not add a second field band.
- **Without a score** (`mode: "frames"`) there are no shot windows: `shots` is
  `[]`, the samples live in a top-level `frames: [sample, …]` array, and the
  summary carries only field, palette, bars and the candidate rate. Character,
  contrast and text are absent (no probe) and listed in `gaps`; no shot verdict
  is invented.
- `summary.subject.height` uses only unclipped samples and counts **character
  boxes**, not shots (a two-hander contributes two); `n` and `clipped` are
  printed.
- `findings[].severity` is `fail` or `warn`. `style:identity` merges only
  `fail` into its own findings; the gate may treat `warn` as a note.
- `gaps` are required axes not measured. A **scored film** with a gap that the
  spec says is measurable (character, text) is a `fail`; a semantic gap is not.
- No `generatedAt`. Determinism is the report's own bytes on the same inputs.

---

## 12. Integration

### 12.1 `style:identity` is the caller

`style:identity` already resolves the score, the pack tokens, the cast and the
specimen, and it already shells out to `style:measure`. It gains one call:

1. Choose the source: `--video` → the delivered video **with the inspect probe**
   (run `frame:report --video`); else read the collage-written
   `build/<id>/frame-report.json`; if it is missing, run
   `frame:report --pre` on the collage frames + collage probe.
2. The command writes `build/<id>/frame-report.json` (the video path) or
   re-reads it; `collage` writes the same file for the pre-render check. Both
   use `measureFrame`, so there is one report shape.
3. Read `build/<id>/frame-report.json`; verify `score` and, for a video, that
   `videoHash` equals the current specimen's `videoStreamHash`. On a mismatch,
   re-run instead of reusing (decision 0033's rule).
4. Merge: `style-identity.json` gains

```json
{ "frameReport": {
    "path": "build/uber-model/frame-report.json",
    "pass": false,
    "score": "sha256:…",
    "videoHash": null,
    "findings": ["identity:bars", "…"]
} }
```

   and the findings are appended to `findings` with their messages. The
   command's exit code is `1` when either the old identity check or frame-report
   fails. `style:identity --video` on Uber now **fails**, which is the spec's
   acceptance test §5.5.2.

**Probe required.** If no probe is found, `frame-report` still measures field,
palette and bars, but character and text are `gaps`; `style:identity` reports
those as `notMeasured` and fails **only** for a scored film with a cast (a film
always has a collage before render, so this is a “repaint the probe” error, not
a silent pass). A probe whose `version < 2` is refused with:
`repaint the probe: npm run inspect -- <score>`.

### 12.2 Phasing (do not wire the gate in v1)

| Phase | What | Why |
|---|---|---|
| **v1 (this plan)** | probe v2; `frame:report`; `style:identity` calls it; tests | the report proves itself on Uber and the reference |
| Phase 2 | move thresholds into `tokens.identity.frameReport` (creative-owned); `style:identity` requires them | decisions are written; the pack owns the style |
| Phase 3 | `preflight` runs `frame:report --pre`; `render:film` requires its pass for the same score; `gate:7` re-runs it on the delivered video; `film:review` prints it | the Uber lesson: measure before the paint, not after |

`render:film`'s gate stays untouched in v1. That is deliberate: a new check that
fails the current film should be seen and signed before it can refuse a render.

### 12.3 How the frames and hashes tie

- Scored video path: `score` sha256 + `videoHash` (`videoStreamHash`, the video
  stream only, so re-cutting audio does not invalidate a frame measurement) +
  `probe.sha256` + `probe.score` from the sibling `inspect.json` /
  `collage.json`. The probe is the **same score's** paint, and frames are the
  same by purity (0023/0032); the report records both.
- Collage path: `score` + `probe.sha256` + `frames[].sha256` of each PNG.
  `videoHash: null`. It is a **pre-render** report and must not be reused for a
  delivered-video check.
- `reuse` in `style-identity.json` is true only when the score matches and, for
  a video specimen, the video hash matches. A stale report is re-run, not
  trusted (0033).

---

## 13. Expected values (measured 4 Nov 2026, v0 prototype)

These are the numbers the implementation must reproduce. The prototype used the
v1 probe and mapped limb points through the chest matrix; probe v2 is exact, so
allow ±1.5 points of share and ±2 luma.

### 13.1 Uber (`films/uber-model`, 10 collage frames at 0.5/shot)

| Metric | Value | Band | Verdict |
|---|---|---|---|
| left bar | .190–.220 (p50 .200) | ≤ .08 | **fail** |
| right bar | .190–.230 (p50 .205) | ≤ .08 | **fail** |
| bar shots | 10/10 | < 2 | **fail** |
| plate-with-wings shots | 8/10 | < 75 % | **fail** |
| largest flat p50 | .247 (.103–.450) | .04–.46 | pass |
| field family | warm (cream #e0d0c0) | — | — |
| subject centroid x | .055–.137; Vaz .885–.920 | .30–.75 in 80 % | **fail** (0/9) |
| subject height | .581–.743 (unclipped n=9 of 12 boxes); sd .060; tiers 1 | .13–.92; sd ≥ .15; tiers ≥ 3 | **fail** (rhythm) |
| local Δ luma (Kiran) | 1.4–2.4 | ≥ 20 in 75 %; median ≥ 35 | **fail** (0/7 measured; 2 hidden) |
| local Δ luma (Vaz on tomato) | 32.7–35.9 | — | separates |
| blue-on-blue | 9/10 frames, 9/9 staged shots | 0 sustained | **fail** |
| figure hidden | 2/9 staged frames (10.50, 22.10) | — | warn |
| warm share | .717–.828 (p50 .783) | .40–.90 | pass |
| blue share | .164–.246 (p50 .173) | ≤ .20 | pass (p50) |
| saturated share | .428–.601 (p50 .447) | .35–.70 | pass |
| mean luma | 124–156 (p50 151.8) | 75–130 | **fail** |
| roles ≥ 1 % | 5 | 4–7 | pass |
| copy blocks / lines / words | 2 / 3 / ≤ 4 | ≤ 2 / ≤ 3 / ≤ 8 | pass |
| bottom band | .036–.062 | warn > .06 | warn (1.30) |

### 13.2 Reference (`Y:\NewVideoTest\out\claude-pop.mp4`, 1 fps, 157 samples)

| Metric | Value | Band | Verdict |
|---|---|---|---|
| candidate bar frames | 4/157 (2.5 %) | frames mode ≤ 10 % | pass |
| largest flat p50 | .108 (p10 .044, p90 .292) | .04–.46 | pass |
| warm p50 | .62 (p10 .08, p90 .95) | .40–.90 | pass |
| blue p50 | .01 (p90 .15) | ≤ .20 | pass |
| saturated p50 | .51 | .35–.70 | pass |
| mean luma p50 | 95 | 75–130 | pass |
| character / text | not measured (no probe) | — | gap, not a pass |

The spec's canonical reference numbers from `style:measure` are luma 100.9,
saturation 21.8/255, edges 12.6, palette distance 48.3 vs the six crops (§5.2).
`frame-report` at 1 fps reads luma 95: a sampling difference, not a
contradiction. **`style:measure` remains the canonical instrument for the
surface bands**; `frame-report` is the grammar instrument and does not replace
it. The reference passes the frame bands it can measure; the three unmeasured
axes (motifs, archetype, tone) are named.

The six crops are **not** a valid input for the bar check: they are hero
close-ups with flat set walls at the edge (measured .34–.46), and the spec
itself says the film, not the crops, is the grammar reference (§5.2). The
report's `mode: "frames"` marks bars `candidate` and never fails a crop.

---

## 14. Tests and fixtures

### 14.1 Pure unit tests — `test/frame-report.test.ts`

Synthetic `Uint8Array` frames, no files, no ffmpeg. Each test names the rule it
protects.

- **Bars**
  - a flat full-bleed frame → no bar;
  - 19 % cobalt + cream plate → left .19, jump > 50;
  - a 30 % soft luma ramp at the edge (vignette) → no bar (jump < 25);
  - a 19 % bar with a 70 %-height figure over it → still .19 (run histogram);
  - a 5 % bar → no bar;
  - a 60 % bar → no bar (max band .45);
  - a bar equal to the field → no bar (fieldDistance).
- **Largest flat** — cream plate with two bars → field hex cream, share in
  .18–.60, touches top/bottom; a map of many tiles → the largest component is
  reported even when small (no invented field).
- **Families** — solid #F2E8D5 → warm 1.0; #203FD8 → blue 1.0; #171310 → ink
  1.0; #D9F24B → acid; #FF5E9C → pink; a grey → neutral; the blue band is
  195–255 (assert the boundary).
- **Body / ring** — a 40×100 blue figure on a cream field with a known box →
  ΔL > 35, blue 1.0; the same figure on a cobalt field → ΔL < 18, blueOnBlue
  true; a bar with no figure → `maskShare ≈ 0`, `visible:false`; a figure at
  the frame edge → `ringClamped:true`.
- **Bbox** — synthetic rig records: chest (0,−452), head (0,−462), hair (0,−518),
  limbs to (±43,−448) and (0,0), with an identity matrix → padded height
  `(518 + .12·518 + .02·518) / 1080`; a translated/rotated matrix → the box
  moves and grows correctly; bottom at the frame edge → `clipped:true`.
- **Text** — three stacked copy boxes at the same x → 1 block, 3 lines; two x
  positions → 2 blocks; 9 words in a line → violation; a box over the face
  ellipse → overFaceShare > .10; `copy:false` boxes are labels, not blocks.
- **Determinism** — the same frame buffer produces the same JSON number twice,
  byte for byte.

### 14.2 Probe test — `test/paint-probe.test.ts` (new or extended)

Load `src/engine/paint-probe.js` into a fake `window` with stubs for `TY.type`,
`TY.text`, `limb`, `solveLeg`, `rigAnchor`, `drawCharacter`, and a fake
`ctx.getTransform()`. Assert:

- one `character` box per draw, with the expected min/max in device space;
- a `limb` record carries `m` and `p0/p1` equal to the transform of `from/to`;
- nested character draws stack and close correctly;
- no record is written when `drawCharacter` is not called;
- `window.__probeVersion === 2`.

### 14.3 Golden Uber test — `test/frame-report-uber.test.ts`

`build/` and `*.mp4` are gitignored, so the test needs a small committed
fixture:

- `test/fixtures/frame-report/uber-probe.json` — the 3 probe frames at 1.30,
  13.65, 19.00 from the Uber `collage/probe.json`, with the source sha256 in a
  comment-free `"source"` field (a probe slice, ~40 KB).
- `test/fixtures/frame-report/t-01.30.png`, `t-13.65.png`, `t-19.00.png` —
  480×270 renders of the same three collage frames (~150 KB each), with the
  source sha256 recorded. Same `t-<time>.png` naming as the collage, so the
  script's time→file mapping is the one already used.

Run `scripts/frame-report.ts films/uber-model/score.json --probe <fixture>
--frames test/fixtures/frame-report --times 1.30,13.65,19.00 --out <tmp>` and
assert:

- `summary.field.bars.leftP50 ≈ .20`, `rightP50 ≈ .20`, `barShots == 3`;
- `plateWithWingsShots == 3`;
- `summary.subject.centroidX.inBand == 0` and `.min <= .14` (Vaz at 1.30/13.65,
  Kiran at 19.00);
- `summary.contrast.deltaLuma.p50 <= 2.5` and `shareAtLeast20 == 0`;
- `summary.blueOnBlue.shots == 3`;
- `summary.palette.meanLumaP50 >= 145`;
- `findings` contain `identity:bars`, `identity:fieldPlate`,
  `identity:centroidX`, `identity:localContrast`, `identity:blueOnBlue`,
  `identity:meanLuma`;
- `pass == false`;
- a second run produces the identical JSON (excluding path fields).

The test is self-contained: no build artifact, no MP4, no Chrome.

### 14.4 Reference test — `test/frame-report-reference.test.ts`

- The six crops are committed. Run the report in `frames` mode on
  `styles/paper-kpop/references/frames` and assert **only** the families and
  largest flat: warm ≥ .80, blue ≤ .15, saturated .07–.88, mean luma 70–194,
  largest flat .06–.34. Assert that bars are **candidates**, not findings
  (`findings` contains no `identity:bars`), because crops are surface
  references, not shots.
- The full reference video is outside the repo. `t.skip` when
  `Y:\NewVideoTest\out\claude-pop.mp4` is absent; when present, run
  `--video <path> --sample 1` and assert: candidate bar rate ≤ .10, warm p50
  .55–.70, blue p50 ≤ .03, saturated p50 .45–.58, mean luma 88–104, largest
  flat p50 .08–.14. Record the video sha256 in the test output (not in the
  assertion) so a different reference is visible.

### 14.5 Non-tests

- `npm run typecheck`, `npm test`, `npm run plan -- fixtures/wedding-min/brief.json`.
- `npm run collage` and `npm run inspect` after probe v2 (the existing
  `build/uber-model/*/probe.json` is v1; the acceptance run repaints it).
- `npm run style:identity -- films/uber-model/score.json --video` → **FAIL**,
  exit 1, with the seven fail findings above; the old identity findings stay
  empty (the film still passes the surface bands).
- `npm run frame:report -- --video Y:\NewVideoTest\out\claude-pop.mp4 --sample 1`
  → pass, exit 0.

---

## 15. Risks and open decisions

1. **The bbox is not a silhouette.** Joints + a fixed pad; a flower head is
   under-measured by up to 16 points of height. Mitigation: uncertainty in the
   report, `headPadAssumed`, and the band is on sd/tiers (which are robust) as
   well as the range. Phase 2: `body.headRadius` per library character.
2. **Bars vs flat set walls.** The jump/strip-flat/field-distance trio killed
   47 of 157 vignette false positives on the reference, leaving 4 frames (2.5 %).
   A real set wall at 10 % still registers; the film rule needs 2 shots or 25 %,
   and the finding names the shot. Accepted.
3. **The body sample is box-shaped.** A character with both arms out is still
   sampled at the torso; a character behind a prop reads `visible:false` rather
   than a fake contrast. The second is a useful P0, not a bug.
4. **Stale probe.** A probe from a different score would place the box on the
   wrong frame. Mitigation: `probe.score` must equal the report's score; a
   mismatch is a hard error, never a reuse.
5. **One sample per shot in the collage path.** Bars are static and survive
   one sample; blue-on-blue and over-face are marked `low` confidence and can
   only warn. The video + inspect path has 3 samples and can fail.
6. **Thresholds are calibrated on two films.** A third film may land near an
   edge. Mitigation: `nearBand` on every metric within 3 points, and the
   `thresholds` block in the report makes a change visible in a diff.
7. **Palette roles are the pack's six.** The reference's marigold/teal/kraft map
   to `other`; that is why families, not roles, carry the reference. A scored
   film outside the pack palette gets `otherShare > .35` as a warning.
8. **Mean luma is a gap check, not a taste check.** Uber fails at 151.8; a bright
   film that is otherwise this channel would also fail. The spec's band is
   75–130, so ship it and let the owner move the band in tokens, not in code.
9. **`copy` is painter-supplied.** The text block rules trust it; the
   `textUnmarked` cross-check against `shot.slots` is the anti-cheat, and
   `audit:type` keeps its own.
10. **The report can fail a film that is otherwise fine.** That is the point
    (the Uber film passed 24 checks and is ~25 % of the channel), but it is a
    contract change: v1 is a report + a `style:identity` merge, not yet a gate
    that refuses a render.

---

## 16. Over-engineering to refuse

- **No matte / segmentation.** A silhouette matte fails exactly when the
  identity fails (blue on blue). The rig box + a body sample is enough.
- **No k-means, no CIEDE2000, no palette learning.** 4-bit quantisation, RGB
  distance and the pack palette are enough; a new dependency is not.
- **No new binary or dependency.** ffmpeg (already found by `findFfmpeg`) and
  Node typed arrays. No PNG decoder: `ffmpeg -f rawvideo` is the decoder.
- **No scene detection.** The score owns shots; a score-less reference is
  sampled at a fixed rate and says so.
- **No per-frame analysis of a 4 699-frame reference.** 1 fps is a band, and
  `style:measure` already owns the full decode for the surface.
- **No motif/archetype/tone classifier.** Those stay human and are named gaps.
- **No new style/score/camera/type model.** Read the score, the tokens and the
  probe; do not invent a second one.
- **No MDX/HTML dashboard.** One JSON, one Markdown table, console lines.
- **No caching layer.** The report is ~5 s; `style:identity` already caches by
  hash where it matters (0033).
- **No second field band.** The spec's field share and largest flat region are
  the same measurement; one number, one band.

---

## 17. Work order and effort

| Step | Work | Effort |
|---|---|---|
| 1 | Probe v2: `m`/`p` on limb+solve, `__characterBoxes`, version in probe file | 0.5 day |
| 2 | `src/engine/frame-report.ts`: bbox, bars, components, families, contrast, text, summary, thresholds | 1.5 days |
| 3 | `scripts/frame-report.ts`: decode, sample, probe pairing, hashes, JSON + MD, exit codes | 0.5 day |
| 4 | Unit + probe + golden tests, fixtures | 0.5 day |
| 5 | `style:identity` merge + `package.json` script | 0.25 day |
| 6 | Re-run `collage` + `inspect`; record Uber/reference numbers; update `docs/STATUS.md` | 0.25 day |

Definition of done: `npm run typecheck`, `npm test`, the Uber report fails on the
seven named axes, the reference passes the frame bands it can measure, the
report is byte-identical on a second run, and every number above is reproduced
within tolerance. The slow acceptance harness is `06-tests`'
`npm run identity:accept`; this plan supplies its fixtures' expected values.

---

## Appendix A — thresholds in one table

| Key | Value | Why |
|---|---|---|
| `bar.maxShare` | 0.08 | spec §3.6/3.8 “bars <= 8 % width” |
| `bar.maxBand` | 0.45 | a field is not a bar |
| `bar.minRows` | 0.04 | a run must survive the histogram |
| `bar.colourTolerance` | 26 RGB | paper fibre + halftone inside one strip |
| `bar.edgeJump` | 25 luma/column | a step, not a vignette |
| `bar.stripFlat` | 12 RGB | one colour along the strip |
| `bar.fieldDistance` | 40 RGB | a bar is not the field |
| `bar.shotFail` | 2 shots | one designed wall is a warning |
| `bar.filmShare` | 0.25 | a layout, not an accident |
| `contrast.ringPad` | 0.30 | spec “30 %-padded ring” |
| `contrast.bodyInset` / `bodyTop` | 0.20 / 0.10 | torso, not arms/head |
| `contrast.figureDistance` | 26 RGB | visible vs the ring colour |
| `contrast.minVisible` | 0.02 | a figure smaller than 2 % of its box is not seen |
| `contrast.deltaLuma` | 20 | spec §3.6/3.7 |
| `contrast.shareAtLeast20` | 0.75 | spec “75 % of shots” |
| `contrast.medianMin` | 35 | spec §5.3 |
| `blueOnBlue.figureBlue` | 0.30 | spec §3.3.3 |
| `blueOnBlue.hue` | 195–255 | spec |
| `blueOnBlue.deltaLuma` | 18 | spec |
| `blueOnBlue.shotShare` | 0.25 | “0 sustained”; one frame is not a look |
| `subject.height` | 0.13–0.92 | spec §3.6 |
| `subject.centroidX` | 0.30–0.75 | spec §3.7 |
| `subject.centroidXShare` | 0.80 | spec “in >= 80 % of shots” |
| `subject.heightSd` | 15 points | spec §3.7 |
| `subject.tiers` | 3 | spec §3.6/3.7 |
| `palette.warm` | 0.40–0.90 | spec §3.3 |
| `palette.blueMax` | 0.20 | spec §3.3 |
| `palette.saturated` | 0.35–0.70 | spec §3.3 |
| `palette.meanLuma` | 75–130 | spec §5.3 |
| `palette.largestFlat` | 0.04–0.46 | spec §3.3/3.8 |
| `palette.roles` | 4–7 | spec §3.3 (`maxColours` may follow tokens) |
| `text.blocks` | 2 | spec §3.19 |
| `text.lines` | 3 | spec §3.19 |
| `text.wordsPerLine` | 8 | spec §3.19 |
| `text.bottomWarn` / `bottomMax` | 0.06 / 0.10 | spec “bottom band <= 6 %”; v1 warns first |
| `text.overFace` | 0.10 | a card over the hair is not over the face |
| `bbox.padTop` / `padSide` / `padBottom` | 0.12 / 0.04 / 0.02 | calibrated above |
| `bbox.heightUncertainty` | 0.16 | flower head worst case (0.12 human) |

## Appendix B — findings

| Code | Severity | Trigger |
|---|---|---|
| `identity:bars` | fail | `barShots >= 2` or `barShots/staged >= .25` |
| `identity:fieldPlate` | fail | plate-with-wings in ≥ 75 % of staged shots |
| `identity:centroidX` | fail | in-band share < .80 |
| `identity:heightRhythm` | fail | sd < 15 points or tiers < 3 |
| `identity:heightRange` | fail | any unclipped sample outside .13–.92 |
| `identity:localContrast` | fail | share ≥ 20 < .75 or median < 35 |
| `identity:blueOnBlue` | fail | sustained shot share ≥ .25 |
| `identity:figureHidden` | warn/fail | `visible:false` in ≥ 2/3 samples (warn at 1/1) |
| `identity:meanLuma` | fail | p50 outside 75–130 |
| `identity:warm` / `:saturated` / `:blueShare` | fail | p50 outside its band |
| `identity:largestFlat` | fail | p50 outside .04–.46 |
| `identity:roleCount` | fail | p50 outside 4–7 |
| `identity:textBlocks` | fail | blocks > 2, lines > 3 or words/line > 8 |
| `identity:textOverFace` | fail | ≥ 10 % of the face box in ≥ 2/3 samples |
| `identity:textBottom` | warn/fail | > .06 / > .10 |
| `identity:textUnmarked` | fail | a `content.*` slot exists but no copy box |
| `identity:probeMissing` / `:notMeasured` | gap/fail | a scored film missing a measurable axis |

**Report code → gate code (04-gate).** The report keeps the specific code so a
reader knows *why*; the gate groups them:

| Report code(s) | Gate code |
|---|---|
| `identity:bars`, `identity:fieldPlate` | `identity:field` |
| `identity:centroidX` | `identity:placement` |
| `identity:heightRhythm`, `identity:heightRange` | `identity:scale` |
| `identity:localContrast` | `identity:local-contrast` |
| `identity:blueOnBlue` | `identity:blue-on-blue` |
| `identity:meanLuma`, `:warm`, `:blueShare`, `:saturated`, `:largestFlat`, `:roleCount` | `identity:film` |
| `identity:textBlocks`, `:textOverFace`, `:textBottom`, `:textUnmarked` | `identity:type` |
| `identity:figureHidden` | `identity:performance` (drawn presence) |
| `identity:probeMissing`, `:notMeasured` | `identity:frames` / `identity:contract` |

## Appendix C — what the command prints (one page)

```
frame:report: uber-model · 10 shots · 10 samples (collage, 0.5/shot)
  shot  bars L/R     cx     height  dLuma  blue  field     luma
  5     19% 21%     .920    64%     1.7    yes   cream     146
  ...
  findings: 7 fail, 2 warn
    FAIL identity:bars            10/10 shots (band <= 8%)
    FAIL identity:fieldPlate      warm field between wings, 8/10
    FAIL identity:centroidX       0/9 in .30-.75
    ...
  gaps: motifs, archetype, tone (human)
frame: uber-model · PASS/FAIL · build/uber-model/frame-report.json
```

The Markdown page is the same table plus one paragraph per finding and the
`gaps`, so a non-programmer can see what failed by opening one file.
