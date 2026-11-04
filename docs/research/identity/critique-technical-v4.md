# Technical critique — Paper K-pop identity specification v1.3 (final pass)

**Critic:** technical architect + QA
**Subject:** `KPOP-IDENTITY.md` v1.3 and `kpop-identity.proposed.json` 1.3.0
**Previous:** v1.0 **5/10** NO; v1.1 **6/10** NO; v1.2 **6.5/10** NO
**Date:** 4 November 2026
**Score:** **7.0 / 10 implementability · 6.5 / 10 evidential honesty**
**SIGN:** **NO**

I read the two v1.3 documents, `critique-technical-v3.md`, `critique-qa-v2.md`, the six named checks
(`style-identity.ts`, `style-measure.ts`, `type-audit.ts`, `camera-check.ts`, `preflight.ts`, `paint-probe.js`),
`tokens.json`, `capabilities.json`, `I-frames.json`, `STYLE.md` and the Uber report. I parsed the JSON with Node,
resolved every `required[]` path, counted the forbidden ids, recomputed the distributions, cuts/min, words, scale
ladder, silhouette and type arithmetic, and replayed the 49 character shots in `I-frames.json` against every
per-shot band. No repository file was changed except this critique.

---

## 0. Verdict

v1.3 is the first revision that fixes the **key** collision: the new block is `filmBands`, `tones` is gone, and all
ten `required[]` paths resolve. The hand band is fixed, the inset is fixed, `under1` is feasible for every short
format, and the cuts/min arithmetic is right. Those are real improvements and should not be undone.

But the four things that decide whether a film passes did not move:

1. **The reference still fails its own bands.** Read as per-shot bands, every one of the 12 composition/palette/field
   bands is outside its range on at least one of the 49 character shots; ten are outside on 7–30 shots. The
   block-level `statistic`/`share` does not say which values are means, medians or per-shot shares. A film that looks
   exactly like the reference is still refused.
2. **The instruments still do not exist.** The paint probe records text boxes and rig records, not a drawn subject box;
   `style:measure` computes p5/p50/p95 but `compareMetrics` reads only means; there is no field component, no ring and
   no silhouette probe. The new required `cast.silhouette` and `performance` blocks have no reader.
3. **The signed pack reversals are unchanged.** Camera 11 vs 6/5/7, handheld/shake vs “no handheld, no shake”, type
   31 vs 69, colour 5/7 vs 4, cast 7 vs 2, duration 156.6 vs 30/45/60, flash/dissolve. A film cannot pass both the
   identity and the pack.
4. **The acceptance test cannot run.** `out/claude-pop.mp4` is not under the repo root (the file is `../out/...`),
   there is no `sha256`, `style:identity` cannot fail the Uber on field/centroid/height/local/motifs/blue-on-blue
   (it passes it today), and the “surface bands” do not exist.

The data model is implementable. The gate is not.

---

## 1. P0 ledger — the v1.2 blockers, checked

| # | v1.2 blocker | v1.3 state | Exact evidence |
|---|---|---|---|
| **B1** | Band block collides with `tokens.identity.bands`; `tones` is a copy; no statistic/share | **PARTIAL** | The **name** collision is fixed: the block is `filmBands` and `tones` is gone. But the old delta bands are still live and still gate (§2.3); `statistic`/`share` are block-level strings, not per-value records (§2.4); the reference still fails 10/12 per-shot bands (§3). |
| **B2** | Instruments: no drawn bbox, no field, no ring, no silhouette | **NOT FIXED** | `paint-probe.js:4–7,106–180` still records only `__textBoxes` and `__rigRecords`; `style-measure.ts:521–541` still compares means; no field component, no ring, no silhouette. The new `cast.silhouette` is required and has no probe. |
| **B3** | Signed pack reversals | **NOT FIXED, larger** | Camera: `STYLE.md` 6 moves, `tokens.motion.camera.moves` 5, `CAMERA_MOVES` 7, identity **11** (adds handheld/shake; drops `parallax`). Type 31 vs 69; colour 5/7 vs 4; cast 7 vs 2; duration 156.6 vs 30/45/60; flash/dissolve. Table in §5. |
| **B4** | Pass/fail arithmetic | **PARTIAL** | Fixed: inset 0.25 = 13.43%, hand 1.3–3.7%, `under1` 0–8%, cuts/min. Not fixed: words 84–90 vs 87.1 ceiling, 31 vs 69, cast 7 vs 2, colour 5/7 vs 4. New: 30 s `overFive` vs `maxS 5`, head 22–28% vs 4.2–5.2 heads, silhouette sum 0.87–1.03. Table in §7. |
| **B5** | Acceptance test | **NOT FIXED** | `reference.film` is still an absolute drive path with no `sha256`; `checks.acceptance.reference` says `out/claude-pop.mp4` which does not exist; `style:identity` still requires a score and reads only the five deltas; the Uber **passes** today (`build/uber-model/style-identity/style-identity.json`, `pass: true`, findings `[]`). The surface bands do not exist. §6. |

**Tally: 1 partially fixed (B1, name only), 1 partially fixed (B4), 3 not fixed (B2, B3, B5).** The QA ledger is the
same: the null pass, the missing H scope, the missing readers and the `referenceFilm` path are unchanged.

---

## 2. JSON validation

### 2.1 Parse, shape, `required[]`

The file parses (47,536 bytes, 12 top-level keys, version `1.3.0`, status `research-proposal`). All **10/10**
`required[]` paths resolve:

```
identity.filmBands               object (23 keys)
identity.field                   object
identity.composition             object
identity.cast.archetype          string
identity.cast.silhouette         object
identity.performance             object
identity.edit                    object
identity.motifs                  object
identity.forbidden               array (45, all unique)
identity.tone                    object
```

No reversed numeric ranges exist except the intended coordinate tuples (`canvas [1920,1080]`, `anchor [960,540]`,
`shakeRadPerSec [71,63]`). The JSON is structurally valid. The list is still the wrong list.

### 2.2 `required[]` is now a third list, and none of the three agree

| List | Where | Contents | Problem |
|---|---|---|---|
| **A** | MD §4.3 | `referenceFilm`, `bands.basis`, `filmBands`, `field`, `composition`, `edit`, `cast.archetype`, `motifs`, `forbidden` | No `silhouette`, no `performance`, no `tone`. Names `bands.basis`, which does not exist in the JSON (`filmBands.basis` does). |
| **B** | MD §8.2 | `referenceFilm`, `bands.basis`, **`tones`**, `field`, `composition`, `edit`, `cast.archetype`, `motifs`, `forbidden` | Stale v1.2 text: still requires `tones` (removed) and still omits `filmBands` (added). |
| **C** | JSON `required` | `filmBands`, `field`, `composition`, `cast.archetype`, `cast.silhouette`, `performance`, `edit`, `motifs`, `forbidden`, `tone` | No `referenceFilm`; no `bands.basis`; adds `silhouette`/`performance` (unmeasurable) and `tone` (human). |

A developer cannot tell which nine or ten fields are the minimum. More importantly, all three lists still omit
**`identity.camera`, `identity.type`, `identity.sound` and `identity.variation`** — the camera is where the largest
signed reversal lives, the type is where 31 vs 69 lives, the sound is the mode rule, and the variation block is the
anti-copy engine. A pack can drop all four and satisfy every published list. The v1.2 critique asked for these; v1.3
did not add them.

`referenceFilm` is still not inside `identity`: it is `reference.film` at the top level. §4.3 names
`tokens.identity.referenceFilm`; a `style:check` over `tokens.identity` will not see it. `bands.basis` does not exist;
`filmBands.basis` does. The prose path and the machine path still disagree.

### 2.3 `filmBands` vs `tokens.identity.bands` — key collision fixed, enforcement collision not

The rename is correct: `tokens.identity.bands` remains the five **delta** bands (`luma 20`, `contrast 25`,
`saturation 10`, `edges 5`, `palette 45`), and `identity.filmBands` is a separate key. Copying it into
`tokens.identity` no longer overwrites the delta block. That is a real fix.

But `scripts/style-identity.ts:47,122` still reads `identity.bands` and `src/engine/style-identity.ts:110–124` still
checks only the five deltas. The new `filmBands` has **no reader**. The consequence is the inversion that started
this work:

| Film | Δ luma | Δ sat | Δ contrast | palette | Old five bands | `filmBands` |
|---|---|---|---|---|---|---|
| Reference | **−44.9** | **−18.0** | −30.4 | **48.3** | **fails 4/5** | passes means/medians |
| Uber | −1.0 | −4.1 | −18.0 | 43.0 | **passes 5/5** | fails luma 146.8 |

The reference-like film is refused by the gate that exists; the Uber passes it. The new block does not replace the
old one, so the acceptance test's “the reference must pass” is false **with the code as it is**. The palette is the
sharpest case: `filmBands.paletteDistanceMax` is **55** (reference 48.3 passes), while `tokens.identity.bands.palette`
is **45** (reference 48.3 fails). Same quantity, two bands, both live. A film at 50 passes the identity and fails the
pack.

**Fix:** either retire the five delta bands for film-level checks (keep them as `surfaceBands` for the six crops) or
make `style:identity` read `filmBands` and stop reading `bands`; then say which block owns which reference. A one-line
rename is not enough.

### 2.4 `statistic` and `share` are in the wrong place

The block ends with two strings:

```json
"statistic": "per-film mean / percentile",
"share": "film"
```

That is a label, not a per-value record. `filmBands` contains at least three populations:

| Value | True population | `share: "film"` correct? |
|---|---|---|
| `lumaMean 75–130`, `saturation 12–35`, `edges 7.5–17.5` | **film means** | yes |
| `lumaP5/P50/P95`, `contrastP5`, `saturationP95` | **film percentiles** | yes |
| `warmShare 0.40–0.90`, `blueShare 0–0.20` | **film medians** (reference 0.70, 0.01; p25 0.24, max 0.46) | yes, if labelled median |
| `subjectHeight 0.13–0.92`, `centroidX 0.30–0.75` | **per-shot ranges** | **no** |
| `localContrastMin 20` | **per-shot threshold in 75% of shots** | **no** |
| `cutsPerMinute`, `medianShotS` | film statistics | yes |
| `paletteDistanceMax 55` | **distance to the six crops** (`basis: "crops"` on the value) | **no** |

`filmBands` also repeats existing paths: `palette.warmShare`/`blueShare`, `palette.localContrastMin`/`Median`,
`composition.subjectHeight`/`centroidX`, `edit.cutsPerMinute`/`medianS`, and `field.share`/`largestFlat` (the last two
also in `palette`). Two paths for one value, no owner. §4.2's “one path per concept” applies to the new block too.

`centroidX` is the clearest failure: the evidence (`I-frames.json`, I4) says **“0.30–0.75 in ≥80% of shots”**. The
JSON drops the `≥80%` and keeps the range. Read per shot, the reference has 42/49 inside (86%, which would pass an
80% share) but **7 shots outside** — including shot 36 at x 0.138 and shot 45 at x 0.130, which are *exactly* the
Uber's 0.136. The band cannot tell one deliberate left-edge shot from ten. That is the placement gap, and the
quantifier that fixes it is already written in the evidence file.

`localContrastMin` is the same: the evidence says **“≥20 in ≥75% of shots”**; the JSON keeps `20` and drops the 75%.
The reference has 41/49 (84%) at or above 20, so the share passes; a bare minimum fails 8 shots.

`warmShare` and `saturatedShare` are the opposite: the evidence’s medians are 0.70 and 0.50, inside the bands, but
their p25 values are 0.24 and 0.17, far outside. A per-shot reading fails 59% and 61% of the reference. The block-level
`“per-film mean / percentile”` does not say “median”; a reader can choose the wrong one.

**Fix (small, ~15 lines):** give every value its own `{ "band": [...], "statistic": "mean|median|p5|p50|p95|share",
"share": 0.75 }` record, or split the block into `filmSummary` (means/medians/percentiles) and `perShot` (ranges with
shares). The prose already has the numbers; the contract needs them.

### 2.5 Markdown vs JSON — the load-bearing mismatches

| Item | Markdown | JSON / code | Verdict |
|---|---|---|---|
| Version | v1.3 (header) | 1.3.0 | **fixed**; §4.1 example still says 1.1.0 / `research` |
| Pose keys | §2 row 12 and §3.11 say **11**; §3.11 lists **12** names | `poseKeys` has **12** | count still wrong |
| Variation | §0 says “ten axes”; §0/§3.24 say **12** | 12 | “ten” stale |
| Stage role | §3.9.2 “lead”; §3.9.7 “star” | `stageRoles` has `star` | two names for one role |
| Camera anchor | “a declared focus point” (§3.14) | fixed `[960,540]` | a push on a face at x 0.65 zooms the centre |
| 9:16 type note | — | “31 px is 16:9; the 69 px audit floor is the 9:16 equivalent” | **backwards**: 69 is the 1920 (16:9) floor; the 1080 (9:16) floor is 39 |
| Words | 84–90 per 30 s (§3.22) | `wordsPer30s [84,90]` | 90 words at 190 wpm = 28.42 s, tail 0.58 s < 1.5 |
| Head | “head 22–28% of height” (§3.9) | `visualHeadToBody 4.2–5.2` = 19.2–23.8% | the two bands disagree at the top |
| 30 s max | `max 5.0` (§3.15) | `overFive [0.05,0.15]` | a strict “>5 s” is impossible with a 5.0 s max |
| Duration | 156.63 header, 156.62/156.60 §3.15 | 156.63 | three values, no rounding note |
| Frames | 4,699 | 4,699, `framesNote: 4698-4699` | delivered is 4,698 (`bible.json`) |
| Forbidden | 20 numbered rules (§3.25) | 45 string ids | no mapping from rule to id |
| Expected Uber failures | §7 **five** (archetype, field, placement, local, motifs) | §5.5 **seven** (field, centroid x, height sd, local, motifs, blue-on-blue, bars) | two lists; archetype is human and absent from the test |
| `maxWords` | 8 per slot (§3.19) | `maxWords 8`, `maxWordsSubtitle 9`, lyric-wall `>8` | a 9-word subtitle is a lyric wall |
| Motif recurrence | “2–5 uses; at least one 3+” (§3.13) | `motifs.uses [2,5]` vs `props.motifRecurrence 3` | two names for one rule; if `motifRecurrence` is read as every motif, a 2-use motif passes `uses` and fails `recurrence` |
| Stage / sound | 60% song; ≥1 per act presenter | `defaultMode stage-show` vs `sound.voiceLedRequires presenter-show` | the default is invalid for the studio's main (voice-led) mode |
| 9:16 caption | `subtitleBand9x16 y 0.34` | pack `aspectBoxes["9:16"].caption.y 0.82` (1574 px); identity `copyBottomPx 1330` | the pack's caption is in the identity's “decoration” zone |

The version and the `filmBands` key are the two mismatches that were fixed. The rest are the same or new.

---

## 3. The reference still fails its own bands (the headline)

The evidence file already contains the per-shot data and, for several bands, the correct quantifier. I replayed the
49 character shots against each band **as the JSON writes it** (a bare range, every shot):

| Band | JSON | Reference inside | Evidence's own rule | Verdict as written |
|---|---|---|---|---|
| subject height | 0.13–0.92 | **48/49** (shot 25 at 12.96%) | hero 55–90 / wide 13–35 (§3.6) | fails 1 by 0.04 percentage points |
| centroid x | 0.30–0.75 | **42/49 = 86%** | **≥80%** (I4) | bare range fails 7 |
| centroid y | 0.38–0.66 | **40/49 = 82%** | p10/p90 0.38/0.66 (I5) | bare range fails 9 |
| floor / horizon | 0.65–0.88 | **31/49 = 63%** | **≥70%** (I6) | **the evidence fails its own share** |
| warm share | 0.40–0.90 | **20/49 = 41%** | median 0.70 (I9) | bare range fails 29 |
| blue share | 0–0.20 | **47/49 = 96%** | p90 0.17, median 0.01 (I10) | bare max fails 2 |
| saturated share | 0.35–0.70 | **19/49 = 39%** | median 0.50 (I12) | bare range fails 30 |
| colour roles | 4–7 | **42/49 = 86%** | p25 4, p50 5, p75 6; max 8 (I11) | bare range fails 7 |
| largest flat | 0.04–0.46 | **41/49 = 84%** | **p10–p90** (I8) | bare range fails 8 |
| field colour share | 0.18–0.60 | **34/49 = 69%** | p10 0.16, p50 0.27, p90 0.57 | band too tight at 0.18 |
| local |ΔL| | ≥20 | **41/49 = 84%** | **≥75%** (I13) | bare min fails 8 |
| small text area | 0.02–0.06 | **37/49 = 76%** | p50 0.031, p90 0.045 (I15) | bare range fails 12 |

**Every one of the 12 bands is outside its range on at least one shot; ten are outside on 7–30 shots.** Only the
film means/medians (luma 100.9, saturation 21.8, edges 12.6, palette 48.3, warm median 0.70, local median 46.6,
cuts/min 19–20, median shot 2.86–3.06) pass. The reference is not a film that passes both the film summary and the
per-shot composition. The acceptance test's first rule — “if the film fails a film band, the band is wrong” — is
triggered ten times.

Two of these are **evidence bugs, not contract bugs**:

- **I6 floor.** The `invariants` block says “y 0.65–0.88 in ≥70% of shots”; the per-shot array satisfies it in
  **31/49 = 63%**. The reference fails the rule it wrote. Either the band is 0.37–0.95, the share is 0.60, or the
  floor detector is wrong. This cannot be fixed by copying a share; it needs a re-derivation.
- **I4 centroid x.** The rule is correct (`≥80%`; 42/49 = 86%), but the JSON keeps only the range. The evidence and the
  contract disagree; the contract is the one a developer reads.

The right reading is **mixed**: film means for luma/saturation/edges, film medians for warm/saturated/blue/roles,
per-shot ranges **with a share** for centroid/floor/local/subject height, and p10–p90 for largest flat. One
block-level `share: "film"` cannot express that. The v1.2 critique asked for `{statistic, share}` on the ~13 values;
v1.3 put two strings at the bottom of the block. That is why the score does not move on honesty.

---

## 4. The instruments — still claims

The `checks` block is honest at the top (“Proposed readers”), but the required blocks and §5.5 treat the readers as
existing. They do not.

| Gap | Claimed instrument | What exists | Can it fail? |
|---|---|---|---|
| Subject box | paint probe bbox (min/max of rig anchors) | `paint-probe.js` records `__textBoxes` and `__rigRecords` (solve/limb/anchor); no card bounds, head top, sole, hair or ornament extent | **No.** A min/max over joints under-reports height by the head and feet — the whole 13–92% band. |
| Field | 3×3 region grid | `style-measure` decodes at 320 px and returns global means; no component, no edge-touching region, no horizon | **No.** A 3×3 cell is 640×360 at 1920; an 8% bar is 154 px, and the Uber's 19% wings are two cells, not one. |
| Local contrast | `localContrastMin 20`, `localContrastMedian 35` | `style-identity` reads global `YMAX−YMIN`; no figure mask, no ring | **No.** The 46.6 is a subject-box-minus-dilated-annulus at full resolution; a cell mean blends figure and field. |
| Silhouette | `cast.silhouette` (required) | no silhouette probe; library has arm/hand lengths, not head/torso/leg shares | **No.** It is a declaration. |
| Performance | `stageShareMin`, `performerPresenceMin`, `stageShotPerAct`, `giantObject`, `entrance`, `exit`, `signatureMove` | `style-identity` reads `stagedRatio` from `shot.direction.cast` (`scripts/style-identity.ts:79`), not the paint; the pack threshold is 0.5, not 0.85 | **No.** The Uber's 0.9 is 9/10 declared, not 9/10 drawn. |
| Motifs | 3–5, 2–5 uses, ≤40% | no `shots[].motif` in `FilmScoreSchema`; Uber score has no motif; no paint record | **No.** A film can declare four and draw none. |
| Variation | 12 axes, history 3, `variation:check` | no command; `checks.variation` points at `build/variation.json`, and `build/` is generated | **No.** A fresh clone has no history; a blind run cannot use it. |
| Forbidden | 45 ids | array of strings, no `{id, check}`; `TRANSITIONS` still includes `page_turn` and `dissolve` (`src/core/style.ts:40–48`); `RecipeSchema.transitionOut` accepts them | **No.** A dissolve is a valid recipe transition. |
| Roles | `maxRolesLong 7`, `maxRolesShort 5`, pack 4 | `palette-audit.ts:27–29,114` counts saturated pixels in a hardcoded 70–170° hue band; no role assignment, no minimum | **No.** Blue is ~220°, so the Uber's blue-on-blue passes; a 1-role frame also passes. |
| Type role/lines/reading | `type.size16x9`, `maxLines`, `reading`, `displayArea` | `type-audit.ts` checks the 6% safe margin and the 69 px copy floor; no family, role, lines, boxes, systems, reading time or display area | **No.** A 31 px subtitle fails the floor; a 69 px label passes regardless of role. |
| Camera travel | `camera.travel`, `anchor`, `seam` | score `{move, from, to, ease}` only; `camera:check` checks `from !== to` for push/pull and the sign (`camera.ts:108–128`); no x/y/roll; no pan/orbit travel | **No.** A `pan` with `from 1, to 1.02` passes (it is a 2% push). `crash_zoom` is an unknown move. |
| Null / NaN | “no silent pass” (§5.5.5) | `src/engine/style-identity.ts:111` `if (value === null) return;`; `Math.abs(NaN) > limit` is false | **No.** A missing measurement passes. |
| `style:check` identity | “validates tokens.identity” (`checks.schema`) | `TokensSchema` has no `identity` key (passthrough); `style:check` validates `capabilities.identity`, not `tokens.identity` | **No.** A pack can drop `filmBands` and still pass. |

The **creature branch is prose, not a schema.** `PoseLibrarySchema` has no `archetype`, `stageRole`, `creature`
flag or `signatureMove`; `BodySchema` requires `thumbW` and `thumbH` to be positive (`src/engine/pose.ts:35–40`), so a
thumbless creature cannot pass `resolvePoseLibrary` even though `cast.thumbOptional` is `true`. The identity says
“thumb optional for Mira-type humans and creatures”; the library says a thumb is mandatory. Add the fields and the
optional-thumb rule to the schema, or mark the creature branch `humanSign`.

Two factual notes in the `checks` block are wrong in the present tense:

- `checks.frames` says “`style:measure` adds p5/p50/p95” — they already exist (`style-measure.ts:18–26,36–46`). The
  missing piece is the **reader**: `compareMetrics` (`:521–541`) and the report (`scripts/style-measure.ts:408–424`)
  read means only. The 3×3 grid is not implemented and would not be a field/ring instrument.
- `checks.schema` says “`style:check` validates tokens.identity (missing band = error, not a pass)” — it does not. The
  required list has no enforcer.

**The one report that would close five gaps** is the same one v1.2 named: one per-shot frame report with
(a) the subject box from the **drawn card bounds** (not the rig anchors), (b) the field as the largest connected
near-uniform region **touching both side edges** (share, role, horizon), and (c) the ring |ΔL| around the subject box
at full resolution. Sample **three frames per shot**, not every frame: 30 frames for a 10-shot film. That is one
decode and one function. It is not a framework; it is the difference between the five named gaps being pictures and
being score claims. v1.3 still does not specify it.

---

## 5. The signed pack reversals — unchanged

The identity is still a research file that reverses values the 0.2.0 pack was signed with. The table:

| Concept | Signed pack | v1.3 | Consequence |
|---|---|---|---|
| Camera moves | `STYLE.md`: static, push, pull, pan, tilt, orbit = **6**; `tokens.motion.camera.moves` = **5**; `CAMERA_MOVES` = **7** | **11** (adds crash_zoom, track, whip, handheld, world; **drops parallax**) | A film using the new moves is refused by `camera:check` as unknown; a `parallax` move is allowed by the code/envelope but absent from the identity's list. |
| Shake / handheld | `STYLE.md`: “No handheld, no wobble, no shake.” | `shakePx [0,12]`, `shakeRadPerSec`, `handheld` move | A signed refusal reversed as an invariant. |
| Push travel | `STYLE.md`: “under six percent”; portrait/macro to twelve | `pushDz [0.03,0.25]` | A 25% push is 2–4× the signed limit. |
| Type families | 4 unique (Anton, Archivo, DM Mono, Permanent Marker), files and licences present | **6** (adds Instrument Serif, Black Han Sans) | Two fonts have no file or licence in `styles/paper-kpop/fonts/`; a film using them cannot render. |
| Type 16:9 | `type-audit` floor 69 px at 1920 | subtitle **31**; body 44–84; label 7–18 | Four of five roles are below the pack's own scale; a 16:9 film following the identity fails `audit:type`. |
| Colour | `maxColours 4`; “at most four colours in a frame” | **7** long / **5** short; no minimum | A 5-role frame passes the identity and fails the pack; a 1-role frame passes both. |
| Cast | `capabilities.limits.maxCast 2`; “up to two performers” | 2 principals + 5 chorus = **7** | A 7-cast film fails `style-identity.ts:73–78` today; the score has no `chorus` field, so a chorus cannot be declared without extra cast entries. |
| Duration | `capabilities.limits.durations [30,45,60]` | `durationFormats` includes **156.6** and a 156 s row | The product cannot score the format the identity describes. |
| Transitions | `tokens.motion.transitions` = cut, iris, wipe, hold, match_cut; `TRANSITIONS` adds page_turn, dissolve | adds **flash**, forbids dissolve/page_turn | `flash` is in no pack list, so a recipe cannot express it; dissolve is still a valid `RecipeSchema.transitionOut`. |
| Words | `layout.maxWords 8` | `maxWordsSubtitle 9` | A 9-word subtitle exceeds the pack's slot. |
| 9:16 caption | `aspectBoxes["9:16"].caption.y 0.82` (1574 px) | `copyBottomPx 1330`; `subtitleBand9x16 y 0.34` | The pack's caption is in the identity's “decoration” zone; the identity's own anchor is a third position. |

The honest route is unchanged: release **paper-kpop 0.3.0** with a `contract-change` PR, a new card, a new seal and a
gate re-run; or adopt the signed values (6 moves, no handheld/shake, push < 6%, 4 families, 4 colours, 2 cast,
30/45/60 s, the pack's type scale, five transitions). A research document cannot reverse a signed refusal by
declaring a new invariant. v1.3 still does not choose, and the status line (“not implemented”) does not excuse the
gate. This is the largest remaining blocker to a film that passes both.

---

## 6. The acceptance test — still not runnable

§5.5 is the right shape: reference without a score, Uber with a score, surface vs film bands, no silent pass. It cannot
run as written.

1. **The reference command is wrong in three ways.** `checks.acceptance.reference` says
   `style:measure --ref out/claude-pop.mp4`. The file is at `../out/claude-pop.mp4`; `out/claude-pop.mp4` does not exist
   under the repo root (I checked; `../out/claude-pop.mp4` exists). There is no `sha256` anywhere in `reference`. And a
   command with only `--ref` measures the film; it cannot produce “palette ~48.3 against the six crops”. That number is
   a **distance** and needs `--ref styles/paper-kpop/references/frames --specimen ../out/claude-pop.mp4`. The luma
   100.9, saturation 21.8 and edges 12.6 can be reproduced from the film; 48.3 cannot with the command written.
2. **The Uber command cannot produce the seven failures.** `style:identity` requires a score; the reference has none.
   The Uber command runs today and **passes**: `build/uber-model/style-identity/style-identity.json` has
   `pass: true`, `findings: []`, Δ luma −0.99, palette 42.95. The command has no field, centroid, height sd,
   local-contrast, motif or blue-on-blue row. It cannot fail the Uber on the named axes; it reads the five old deltas
   and the 0.5 staged ratio. §5.5 step 2 is therefore false today.
3. **The surface bands do not exist.** `identity.medium` has paper hexes and fibre counts, not measured bands;
   `identity.edge` has `limbPx 2.1`, `objectPx [1.5,4]` and a `silhouetteP10Px` reference value, not a band. The only
   crop-referenced value is `filmBands.paletteDistanceMax` 55. “The six crops pass the surface bands” cannot be run.
4. **The film-band reader does not exist.** `filmBands` is unread; `style:identity` reads `bands`. Step 4 cannot run.
5. **No silent pass is prose only.** The null skip is still in `style-identity.ts:111`; `NaN` also passes. Any new
   `filmBands` reader must replace the helper, not copy it. The spec does not say so.
6. **The expected-failure list is still two lists.** §5.5 names seven; §7 names five (archetype, field, placement,
   local, motifs). Archetype is the one gap that is human, and it is absent from §5.5. §5.5's “field” is not the field
   share: the Uber's `fieldColourShare` is 0.20–0.47 (inside 0.18–0.60) and `largestFlatFieldShare` is 0.11–0.45
   (inside 0.04–0.46), so **both field bands pass the Uber**. The robust field failure is the 19% side bar (and the
   cream-plate-with-wings boolean, which has no reader). The spec's own rule says a band the Uber passes is not a gap
   check; on that rule, the field share is not one. One list, with “field” defined as bars + plate, and archetype
   marked human.

**Fix:** add a reference score (or a 30-frame sample with a `sha256`) under `styles/paper-kpop/references/`; copy the
film to a repo-relative path or use `../out/...` consistently; write the two exact commands; add a `surface` block with
the crop means and the paper/halftone/ink bands; add the seven rows to `style:identity` (or a `--reference` path that
works without a score); make null/NaN a finding; write one expected list.

---

## 7. The arithmetic, re-run

| Item | v1.2 | v1.3 | Computed | Verdict |
|---|---|---|---|---|
| Distribution `<1 s` | 0.02–0.04 (impossible) | 0–0.08; 30 s 0–0 | 10–13 shots: 0 or 1 under 1 s; feasible | **fixed** |
| Distribution sums | 0.88–1.15 | 0.82–1.23; 30 s 0.80–1.20 | still not 1.0; 2/10 shots can fall in no band | **not fixed**; it is a target, not a partition |
| 30 s `overFive` | 0.06–0.10 | 0.05–0.15; `maxS 5` | at least 1 shot >5 s is impossible with max 5.0 | **new contradiction** |
| Words per 30 s | 85–95 | 84–90 | window 27.5 s → 82.5–87.1 words; 90 at 190 wpm = 28.42 s, tail 0.58 < 1.5 | **not fixed**; ceiling is 87 |
| Inset | 0.24 = 12.89% | 0.25 = 13.43% | 0.25 × 580 = 145 px = 13.43% | **fixed** |
| Hero | 59.1–88.0% | 59.1–88.0% | inside 13–92 | **fixed** |
| Stage 30/60 | 0.30 vs “≥1” note | 0.60 + note; `stageShotPerAct 1` | 60% of 10 = 6; presenter ≥1/act = 3–5; no `when` | **partial**; mode is prose |
| Type 31 vs 69 | 31 vs 69 | 31 vs “69 is 9:16” | 1920 floor = 69; 1080 floor = 39; 31 fails 16:9 | **not fixed, note wrong** |
| Cast 7 vs 2 | 7 vs 2 | 2 principals + 5 chorus; pack 2 | `style-identity.ts:73` fails >2; score has no chorus | **not fixed** |
| Colour 5 vs 4 | 7 long / 5 short vs 4 | same; no minimum | 5-role frame passes identity, fails pack; 1-role passes both | **not fixed** |
| Silhouette hand | 0.03–0.04 vs 0.013–0.037 | both 0.013–0.037 | 18 px hand at 700 = 2.57%, passes | **fixed** |
| Head | 22–28% | 22–28% vs 4.2–5.2 heads | 4.2–5.2 heads = 19.2–23.8%; at 28% it is 3.57 heads | **new conflict** |
| Silhouette sum | 0.87–1.03 | 0.87–1.03 | head + torso + legs ≠ 1.0; no neck/hip band | **not fixed** |
| Framing mix | 0.75–1.30 | 0.75–1.30 | not a partition | **not fixed** |
| Transition components | 0.10–0.37 | 0.10–0.37 vs designed 0.10–0.20 | a film can satisfy each and exceed the total | **not fixed** |
| Hard cut / iris / flash | 80–90 / 8–15 / 0–8 | same | reference 50/53 = 94.3; 10/51 = 19.6; 14/50 = 28 (or 38/51 = 74.5) | **reference fails all three** |
| Subtitle words | 9 vs 8 | 9 vs 8 | a 9-word subtitle is a lyric wall | **not fixed** |
| 9:16 copy bottom | 1330 vs pack caption 1574 | same | pack caption/lyric below the copy zone | **not fixed** |
| Cuts/min 30/45/60/156 | 18–24 / 17.3–22.7 / 17.0–22.0 / 18.1–21.5 | same | all inside their rows | **fixed** |
| Height sd / tiers | 15 / 3 | 15 / 3 | reference 21.8 / 4 | **fixed** |

The first-order arithmetic is now right: cuts/min, hero/inset, hand, under-1s, height sd. The **second-order**
arithmetic is still wrong: distributions that must sum, a 30 s row whose `overFive` cannot coexist with its `maxS`, a
word band whose top exceeds its own tail rule, a head ratio that contradicts its own visual-head band, a 9:16 note
that is dimensionally backwards, and transition bands the reference still fails. These are the values a film actually
trips.

---

## 8. Is it implementable with the 9 P0 additions, without a second framework?

**Storage: yes.** `TokensSchema` is a `.passthrough()` object (`src/core/style.ts:752–762`) with no `identity` key, so
`tokens.identity.filmBands`, `.field`, `.composition`, `.performance`, `.motifs`, `.tone`, `.variation` will load
without a second schema engine. The score is a separate document; optional `motif`, `framing`, `camera.keys` and
`events[].contact` can be added. The block shape is the right compromise; do not go back to 251 leaf records.

**Gate: no.** The nine blocks need **one per-shot frame report** (subject box from drawn card bounds, field as the
edge-touching component, ring |ΔL|, 3 frames/shot) and **six readers**:

1. `filmBands` (with per-value statistic/share) — extend `style-identity`.
2. `field` + `composition` + `localContrast` — read the frame report.
3. `edit` — `preflight` (currently reads `tokens.pace`, median/max only).
4. `camera` — `camera:check` (move vocabulary, x/y travel, seam, byBeat).
5. `type` — `type-audit` (role map, lines, boxes, reading, display area, 16:9/9:16).
6. `variation` / `forbidden` — new commands, or one `film:compare` and a `check` field per forbidden id.

That is not a second framework — do **not** add an `identity:check` that duplicates `style:identity`/`style:measure`.
It is one report plus six extensions. The phrase “nine fields, no new tool” is false; the true phrase is “nine blocks,
one report, six readers”. The v1.2 critique said the same; v1.3 did not change it.

**Contract: no.** Until the signed pack is 0.3.0 or the identity adopts the signed values, the readers will encode a
contradiction: a film that passes the identity fails `camera:check`/`audit:type`/`maxCast`/`maxColours`, and a film
that passes the pack fails the identity. Choose the contract before writing the readers.

**Order of work:** (1) per-value bands and re-derive them so the reference passes; (2) the frame report + `filmBands`
reader + null/NaN refusal; (3) retire the delta bands or re-scope them to the crops; (4) the pack 0.3.0 contract
change; (5) the acceptance test on the reference and the Uber. That is five bounded steps, not a redesign.

---

## 9. What v1.3 gets right — keep it

- **The key collision is fixed.** `filmBands` cannot overwrite `tokens.identity.bands`; `tones` is gone. This was the
  single most dangerous line in v1.2.
- **The required list resolves.** 10/10 paths exist; the mechanism is right, even if the list is wrong.
- **The hand band is fixed.** `cast.hand.widthRatio` and `cast.silhouette.handPct` are both 0.013–0.037; the 2.57%
  reference hand passes both. The v1.2 conflict is gone.
- **The inset is fixed.** 0.25 × 580 = 13.43%, inside 13–92.
- **`under1` is feasible.** 0–8% top-level and 0–0 for 30 s; the reference's 4% passes.
- **The cuts/min and hero/inset arithmetic are right.** 10–13 → 18–24; 14–18 → 17.3–22.7; 18–23 → 17.0–22.0; 48–57
  → 18.1–21.5; hero 59.1–88.0%.
- **`referenceValues` is clean.** 100.9 luma, 215.4 contrast, 21.8 saturation, 12.6 edges, 48.3 palette, 46.6 local,
  0.01 blue median, 0.70 warm median, 0 side bars. These are the numbers the acceptance test needs.
- **Performance, silhouette, the eight tone beats, the 9:16 scale and the match-cut tolerances are named.** Several
  are unmeasurable, but naming them is better than silence. The 9:16 scale matches the pack's `aspectScale` (56/24/14/32).
- **The 45 forbidden ids are unique; the status is honest; the JSON parses; the `checks` block is labelled
  “proposed”.** Keep that honesty.

---

## 10. Score, remaining P0s, sign

| Axis | v1.1 | v1.2 | v1.3 |
|---|---|---|---|
| Implementability without over-engineering | 6.0 | 6.5 | **7.0** |
| Evidential honesty | 6.5 | 6.5 | **6.5** |

**Why 7.0, not higher:** the data model is now copyable, the required paths resolve, the key collision is gone, and
the arithmetic is better. A developer can start writing the schema. But the gate still has no instrument, the contract
is unresolved, and the required list is still a third list.

**Why 6.5, not 7:** the reference still fails its own bands, the acceptance test is still unrunnable, `statistic`/`share`
is a label rather than a record, and the signed reversals are unchanged. The v1.3 is more honest about its status and
its block names, but the central proof is still a claim.

### Remaining P0s — must fix before any implementation

**P0.1 — The band population.** Replace the block-level `statistic`/`share` with per-value `{band, statistic, share}`;
re-derive the 12 per-shot bands so the reference passes by construction. Specifically: `centroidX` is `≥80% of shots`
(I4), `localContrastMin` is `≥75%` (I13), `floor` needs a re-derived share (I6 currently fails at 63%), `subjectHeight`
needs 0.129 or a 0.98 share (shot 25 = 12.96%), `warmShare`/`saturatedShare` are medians, `blueShare` is a p90,
`largestFlat` is p10–p90, `roles` needs a minimum (4) and a p90. **Test:** a table that prints the reference pass/fail
per band, the Uber pass/fail per band; the reference passes every I band; the Uber fails centroid x, height sd, local
contrast and side bars.

**P0.2 — The instruments.** One per-shot frame report: subject box from **drawn card bounds** (not min/max of rig
anchors), field as the largest connected near-uniform region touching both edges (share, role, horizon), ring |ΔL| at
full resolution, 3 frames/shot; a `filmBands` reader; null/NaN is a finding. Mark `silhouette`, `performance` and `tone`
`humanSign` until they have probes. **Test:** the report on the reference reproduces 46.6 median local contrast; the
report on the Uber returns 12.6 and 19% bars; a null is a failure.

**P0.3 — The signed reversals.** Choose **paper-kpop 0.3.0** with a `contract-change` PR (new card, seal, gate re-run)
or adopt the signed values. Camera must be one vocabulary (6 or 11, not 5/7/11), with or without handheld/shake; type
must be one scale (31 role-aware or 69); colour one cap and a minimum; cast 2 or 7 with a `score.chorus`; duration
30/45/60 or 156.6; transitions one list with flash/dissolve decided. **Test:** `style:check`, `camera:check`,
`audit:type` and a 7-cast chorus score all pass the same film.

**P0.4 — The acceptance test.** A reference score or 30-frame sample in the repo with a `sha256`; the correct
`../out/...` path; the exact two commands (`style:measure --ref styles/paper-kpop/references/frames --specimen <film>`
for the palette distance; `style:identity` on the Uber); a `surface` block with the crop means and paper/halftone/ink
bands; the seven rows in `style:identity`; one expected list with archetype marked human; null/NaN a finding.
**Test:** the two commands run on a fresh clone and print the expected pass/fail; the Uber is refused on field
(bars/plate), centroid x, height sd, local contrast, motifs, blue-on-blue and side bars.

**P0.5 — The readers.** `variation:check` with a git-tracked history (not `build/`); `forbidden` as `{id, check}` with
a reader (a dissolve must fail); `motifs`/`performance`/`silhouette` as score/paint readers or `H`; `style:check`
validates `tokens.identity`; the null/NaN pass removed. **Test:** a film with a dissolve, a four-motif score that draws
none, and a 7-cast film each fail with a named finding; a 2-cast film passes.

**P0.6 — The remaining arithmetic.** 30 s `overFive` vs `maxS 5` (make `maxS 5.2` or `overFive [0,0.15]`); words
84–90 vs the 87.1 ceiling; 9:16 `copyBottom 1330` vs the pack's caption 1574; head 22–28% vs 4.2–5.2 heads; silhouette
segments 0.87–1.03; framing mix 0.75–1.30; transition components 0.10–0.37 vs 0.10–0.20; hard cut 80–90 vs 94.3, iris
8–15 vs 19.6, flash 0–8 vs 28; subtitle 9 vs `maxWords 8`. **Test:** a validator that sums the distributions and
prints the reference pass/fail, so no band can be satisfied only by violating another.

With P0.1–P0.6 the score is 8–9 and the sign flips. Without them, v1.3 is the best-dressed version of the same
problem: the document has learned to rename the block, and the commands still cannot see the film.

**SIGN: NO.**
