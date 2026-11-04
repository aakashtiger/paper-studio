# QA / skeptic critique — Paper K-pop identity specification v1.1

**Date:** 4 November 2026
**Critic:** QA / skeptic (second pass)
**Inputs read:** `KPOP-IDENTITY.md` (v1.1); `kpop-identity.proposed.json` (v1.1); `critique-qa.md`; `A-engine.md`; `B-cast-sets.md`; `C-edit-camera-sound.md`; `G-studio-gap.md`; `I-frames.md` / `I-frames.json`; `H-youtube.md`; `scripts/style-identity.ts`; `src/engine/style-identity.ts`; `scripts/style-measure.ts`; `src/engine/style-measure.ts`; `scripts/preflight.ts`; `src/engine/preflight.ts`; `scripts/type-audit.ts`; `src/engine/camera.ts`; `scripts/camera-check.ts`; `src/core/style.ts`; `styles/paper-kpop/tokens.json`; `build/research/claude-pop/bible.json`; `build/uber-model/gate-7.json`; `build/uber-model/style-identity/style-identity.json`.
**Scope:** not a completeness review. This asks three questions: is each number traceable, can each invariant fail, and does the new acceptance test (§5.5) actually catch the Uber film and pass the reference?

---

## 0. Verdict

**Evidential honesty: 6.5 / 10.**
**SIGN: no.**

v1.1 is a real revision, not a cosmetic one. The scope system (R/T/I/F/V/X), the "reference vs target" section, the 27/51 disclosure, the shadow demotion, the removal of 98.4% and the hand 18×26, the two-reference diagnosis and the explicit "the user's ~25% is a judgement" are improvements. The status line ("research specification, not implemented") is honest.

But the three load-bearing problems from v1.0 are untouched:

1. **The percentile bands are still written as invariants** (P0-3). `warmShare`, `saturatedShare`, `maxRolesLong`/`maxRolesShort`, `field.share`, `largestFlat`, `centroidY`, `negativeSpace` are ranges with no `share` and no per-shot/per-film basis. The spec's own table shows the reference at warm p25 = .24 against a .40 floor.
2. **The three measured Uber failures still have no instrument** (P0-4). Side bars, blue-on-blue and local contrast are named as the diagnosis; §8.2 offers a 3×3 cell grid and a rig-anchor bbox, neither of which is a column profile or a subject-minus-ring measure.
3. **New fields still have no reader, and a null still passes** (P0-8). `style-identity.ts` returns on `null`; `stagedRatio` reads the score; `identity.edit`, `identity.motifs` and `identity.forbidden` have no command that reads them.

And the new acceptance test is not runnable: `style:identity` takes a **score**, the reference film has no score, the command measures only five global means, and the "at least" list is not the five named gaps — it omits archetype and splits placement into two.

The result is a document that is more honest about what it does not know, and still not honest enough to gate a film.

---

## 1. The P0 ledger

| # | v1.0 P0 | v1.1 status | Exact field / evidence |
|---|---|---|---|
| 1 | 90% camera contradicted A 5 | **FIXED (provenance)** | §3.14 now states 27/51 `setCam`, 24 inherit, 8 of those move the world. `identity.camera.movingShare` has `basis: "target"`. Residual: it is still `scope: "I"`; the reference is 53%; §5.5 says the reference must pass "the bands", and the scope table has no target exemption. |
| 2 | C values used as canonical | **PARTIAL** | `identity.sound.song.lines/words/wpm/lufs` and §3.15's "11/61" are still the 720p C film. 27/51, 10 iris / 38 flash, 31 px and 45/213 are correct. |
| 3 | Percentiles written as invariants | **NOT FIXED** | `identity.palette.warmShare`, `saturatedShare`, `blueShare`, `maxRolesLong`/`maxRolesShort`, `identity.field.share`, `identity.field.largestFlat`, `identity.composition.centroidY`, `floorLine`, `negativeSpace` are ranges with no `share` and no "per-shot" or "per-film" basis. §3.3's own table: warm p25 .24 vs band .40; saturated p25 .17 vs .35; roles min 3/max 8 vs 4–7; centroid y min .24/max .83 vs .38–.66; field min .12/max .78 vs .18–.60; largest flat max .76 vs .46; luma p25 53 / p75 147 vs 75–130; floor p25 .64 vs .65. The reference fails each at its tails. |
| 4 | No instrument for the measured Uber failures | **NOT FIXED** | `identity.field`, `identity.palette.blueOnBlue`, `identity.palette.localContrastMin/Median` still say `measure: "frame probe"`. The only new measures are a 3×3 region grid (§8.2 item 3) and a rig-anchor bbox (§8.2 item 4). A 3×3 cell is 640 px wide and an 8% bar is 154 px; the 46.6 is a subject-box-minus-ring, not a cell mean. |
| 5 | 31 px subtitle contradicts the pack and gate | **PARTIAL** | `identity.type.size16x9.subtitle` = 31. `scripts/type-audit.ts:45–55` takes the floor from `type.scale.label` (14 at 390) → **69 px** at 1920. The 9:16 note is now correct; the 16:9 conflict is not. |
| 6 | Hand 18×26 is the library's | **PARTIAL** | `identity.cast.hand.widthRatio` .013–.037: idol 9/706 = .0127, Mira 7/584 = .0120; `thumbRatio` requires a thumb Mira does not have (B 2.3). The 18×26 is gone, but the ratio still encodes the library, not the source. |
| 7 | Shadow measured by a frame probe | **FIXED** | `identity.light.paperShadow` measure is `schema`; §3.4 says "do not build a shadow rule from the photograph; build it from the code" and cites 0/44 confidence. |
| 8 | Null and score claims silently pass | **NOT FIXED** | `src/engine/style-identity.ts:111` `if (value === null) return;`; `scripts/style-identity.ts:79` counts `shot.direction.cast`, not the paint; `identity.edit` has no `preflight` reader (`scripts/preflight.ts:63–76` reads `tokens.pace`); `identity.motifs` / `identity.forbidden` have no reader; `identity.variation` is `scope: "I"` but its measure is `review`. |
| 9 | 25% inconsistent with the five failures | **PARTIAL** | §7 now says "the user's ~25% is a judgement", which is honest. But the §7 title and §5.4 still assert it; 5 failures / 12 axes = 42%, 3 measured / 12 = 25%, and the two human-judged failures are not named in the arithmetic. |
| 10 | Hard-cut / iris / flash taxonomy undefined | **PARTIAL** | §3.17 now defines "a designed transition is a modifier on a cut" and states 50/53 hard boundaries. But `identity.edit.hardCutShare` .80–.90 vs 50/53 = .943; `identity.edit.transitions.iris.share` .08–.15 vs 10/51 = .196; `identity.edit.transitions.flash.share` 0–.08 vs 14/50 = .28 (opening flashes, A 362) or 38/51 = .745 (all calls). The 14/24 split is not stated. |

### New in v1.1

**N1 — §5.5 is not a runnable test.** `style:identity` requires a `score.json` (`scripts/style-identity.ts:27–35`); the reference film has no score. It reads only five `delta` values (`src/engine/style-identity.ts:110–124`); it has no field, centroid, height, local-contrast or motif row. It calls `style:measure` without `--score` (`scripts/style-identity.ts:92–99`), so the shot/cut rows are the scene detector's, not the score's. The reference film is also outside the repository (`Y:\NewVideoTest\out\claude-pop.mp4`, 289 MB), so a fresh clone cannot reproduce the test. This is the single most important new blocker: the spec's central proof cannot be run as written.

**N2 — the scope code `I` still does not distinguish a machine check from a human sign.** §1.1 says `I` = "Can a check refuse? Yes". But `tone`, `archetype`, `variation`, "one focal shape", "paper is drawn as paper", eyeline, contact and first frame are `I` with `measure: "human"` or `review`. The JSON has `identity.variation.scope = "I"` and `check: "variation:check (proposed)"`. There is no `H` (human sign) code. A schema validator cannot tell which `I` values are gates; a reader cannot either.

**N3 — the nine P0 fields are not all in the JSON under the paths the prose names.** §4.3 names `tokens.identity.referenceFilm`, `tokens.identity.bands.basis` and `tokens.identity.tones`. The JSON `identity` block has **no** `referenceFilm`, **no** `bands` object and **no** `tones`. The film sits at top-level `reference.film`; the means sit in `referenceValues`; `bands.basis` does not exist. A `style:check` that validates `tokens.identity` would not see three of the nine fields. This is a schema/prose mismatch, not a wording issue.

---

## 2. Provenance re-check

### 2.1 Every R value tagged?

Partly. The scope columns are much better than v1.0, and the `referenceValues` block is a clean R block. But the machine schema tags scope at **block** level, so R values inside an `I` block inherit `I`:

- `identity.edit` is `scope: "I"`, but `minS` 0.6 / `maxS` 6.2 and the 54-card `distribution` are the **156 s reference**. The `formats.30s` block says min 1.2 / max 5.0 (T). A 30 s film can be judged by either; the spec does not say which wins. The 0.6 / 6.2 values are R, not I.
- `identity.palette` is `scope: "I"`, but `referenceDominant` is an R list. The eight hexes are still not in A–J, `H` or `bible.json`; they appear in `blind-test.md`, a different document. `bible.json`'s six palette colours are `#100c0f`, `#2c2120`, `#564043`, `#995d49`, `#b88f6f`, `#dfc8a1`. The R value is untraceable.
- `identity.hud` is `scope: "F"`, basis `reference`; the box, title, value, unit, bar, ticks and flower are R values. The markdown §3.27 tags them R; the JSON does not.
- `identity.type.size16x9` has no per-key scope. The display/body/subtitle are A (R); the monogram 72–160 is still unsourced, and the "autopsy D09" citation was removed rather than replaced.
- `identity.camera.distinctMoves` 4–8 is `I`, but the reference uses 8–10 (§3.14 says so). The JSON omits the `world` share (the table says 15% against a ≤10% band). The reference exceeds both.

So: the prose is better tagged than v1.0, but the machine schema is still not a reliable record of what is evidence and what is law.

### 2.2 The 720p comparison vs the canonical film

The canonical is `out/claude-pop.mp4`: 1920×1080, 30 fps, 156.63 s, **4,698** delivered frames (G 5, H 285, `bible.json`). The spec's header and `reference.frames` say **4,699**. The extracted folder has 4,699 JPEGs; the delivered count is 4,698. This is an off-by-one that has survived two revisions.

C is a **different film**: `Y:\NewVideoTest\ref\source.mp4`, 1280×720, 24 fps, 3,758 frames, 64 shots, 61 cuts (C §0). G §10 says explicitly that it uses only `out/claude-pop.mp4`, the 1920×1080/30 render of `src/`; C is "a second reference film in the workspace". H proves `claude-pop.mp4` is the pack's source film. Therefore C's values cannot be R for the canonical.

v1.1 §10 says C is "used only as a comparison; the canonical numbers are in A and I". That sentence is false in three places:

- §3.15: "The source is 92% on a lyric boundary and only **11/61** on the 88 BPM grid." The 92% is A (47/51); the 11/61 is C §1.4 (the 720p film). A says the 88 BPM grid drives bodies and flowers, not cuts. One sentence uses two films.
- §3.21: `sound.song.lines = 46`, `words = 227`, `wpm = 97.8`, `lufs = -15.6`. All are C (§6.1, §7, §8). The canonical's authored lyrics are 45/213 (A 539–540); its rate over the voiced span is 213/139.18 × 60 = **91.8 wpm**; its delivered audio is not measured.
- §3.22: "song | 90–100 wpm | **46 per 156 s (17.6/min)**". The canonical's authored rate is 45/156.63 = 17.2/min. The 46 is C.

The 27/51 and 10/38 values are correctly from A/B. The 31 px is correctly from A 485.

### 2.3 46/227 vs 45/213

v1.1 now states both: "46 (transcript); 45 authored" and "227 (transcript); 213 authored". That is an improvement in visibility, but the label is wrong. C §6.1 calls 46/227 the **lyric sheet**, not a transcript; its ASR is 38 segments / 239 words. The canonical's lyrics.js is 45/213. So:

| Value | What it is | Source |
|---|---|---|
| 45 / 213 | canonical authored lyrics | A 539–540 |
| 46 / 227 | 720p film's authored lyric sheet | C 458–459 |
| 38 / 239 | 720p film's ASR | C 458–459 |
| canonical ASR | not measured | — |

The spec's "transcript" is C's lyric sheet. The canonical's ASR is not measured. The correct sentence is: "the canonical authors 45 lines / 213 words; the 720p comparison's lyric sheet is 46 / 227; the 720p ASR is 38 / 239; the canonical ASR is not measured."

### 2.4 -15.6 LUFS

C §8 and §10 measure `source.mp4`; C says the audio is identical to `song.mp3`. The canonical's delivered audio is not measured (no audio row in `bible.json`, no loudness in H). The JSON note is honest: "loudness measured on the 720p comparison, verify on canonical". The markdown §3.21 is not: it lists -15.6 under "(R)" with no caveat, and §0.1 uses it as an R example. A likely-same-asset inference is not a measurement. Tag it `R(comparison)` or measure `claude-pop.mp4`'s audio.

### 2.5 97.8 wpm

97.8 is C's 227 words over 139.18 s. The canonical's 213 words over the same span is 91.8. The spec's band 90–100 contains both, so the band is fine; the **R value** is C's. §3.21 and §0.1 present 97.8 as the reference's sung rate. Replace with 91.8 (canonical) and keep 97.8 under `comparison`.

### 2.6 27/51 setCam

Correct. A 271: 27 of 51 shots (53%); B 29: 27/51 set, 24 inherit; B's staging table has eight "none set; world" shots. v1.1 §3.14 states this and calls it a defect. This P0 is fixed on provenance.

### 2.7 10 iris / 38 flashes

The counts are correct as **call counts**: A 7 and 362, 851. The interpretation is only partly fixed:

- A 362: "38 calls: **14 open a shot, 24 mark a hit or close**." v1.1 §3.17 says "10 iris closes and 38 flashes" without the 14/24 split. A reader will read 38 as 38 transitions.
- If only the 14 opening flashes are boundaries, 14/50 = 28% of cuts; if all 38 are counted, 38/51 = 74.5%. The `flash` band is 0–8%. Neither denominator fits.
- The 10 iris closes are in-shot overlays; the next shot begins hard. If the base cut is 50/53 = 94%, the `hardCutShare` band .80–.90 excludes the source. If the base is 100% (the iris is an overlay), the hard-cut band is 100%, above .90.

The "modifier on a cut" definition is the right idea. The bands were not re-derived from it. This is still P0-10.

### 2.8 31 px subtitle

The value is correct (A 8.6/485: default 31 px). The format note is now correct: 31 px at 1920 is 6.3 px at 390, below the pack's 14 px floor; 9:16 uses the mobile scale. But the **16:9** gate is unchanged: `type-audit`'s copy floor is `type.scale.label` 14 at 390 → 69 px at 1920 (`scripts/type-audit.ts:45–55, 123`), and the pack's caption is 18 at 390 → **88.6 px** at 1920 (G 323). The identity's 31 px is 35% of the pack's own caption and under half the gate's floor. A 31 px subtitle in a 1920 film is `SMALL` (line 283). The spec cannot both require 31 px and pass the current gate. The minimal change (§8.2 item 6) adds a role map but never says the floor becomes role-aware or that a `subtitle` role is exempt.

---

## 3. Silent passes, re-checked

1. **A null measurement is still skipped, not failed.** `src/engine/style-identity.ts:111`: `if (value === null) return;`. A `NaN` also passes (`Math.abs(NaN) > limit` is false). `match.json` already carries nulls for movement, shot median, cuts, camera. The spec's §8.2 item 2 validates a missing **key**, not a null **value**. A new field measured by the same path will pass the same way.
2. **`stagedRatio` is still a score claim.** `scripts/style-identity.ts:79` counts `shot.direction.cast`. `collage.json` records `cast` vs `drew`; `style:identity` does not read it. §8.2 item 4 adds a bbox for placement/height, not a "was the character drawn" check for staged. The Uber report's `stagedRatio: 0.9` is 9/10 declared, not 9/10 painted.
3. **Global means are still global.** `style:identity` reads `match.delta` (luma, contrast, saturation, edges, palette) — five global means. The identity's local contrast is 46.6; the gate's contrast is global. The spec's §5.2 diagnoses this, but the fix is a 3×3 grid, which is a cell mean, not the subject-box-minus-ring measure I-frames uses.
4. **Crops vs film is still one reference in code.** `style:identity` reads `identity.reference` (`references/frames`, the six crops) and `identity.bands` (the five deltas). The new `referenceFilm` and `bands.basis` are not read by any command. The "two references" are a paragraph, not a schema: there is one `bands` object and one `reference` path.
5. **The `style:measure` edit numbers are the detector's, not the score's.** `scripts/style-identity.ts:92–99` calls `style:measure` without `--score`; `scripts/style-measure.ts:212–220` uses `select='gt(scene,0.03)'`. On the canonical, `bible.json` reports 238 scene changes, median 0.1 s, 90.79/min. If `identity.edit` is read from that path, it compares 238 detector shots to a 51-scene score. The spec's §3.15 says use `preflight`; §8.2 never wires it.
6. **`preflight` does not read `tokens.identity.edit`.** `scripts/preflight.ts:63–76` reads `story.pace`, then `tokens.pace`, then `DEFAULT_PACE`; `src/engine/preflight.ts:294–317` checks median and max only. A new `tokens.identity.edit` is an unread token: no min, p10, p90, cuts/min or distribution. This is P0-8, unchanged.
7. **`forbidden` and `variation` still have no reader.** The JSON has 41 forbidden strings and no `check` field; §5.1 has no forbidden row. `identity.variation` is `scope: "I"`, `check: "variation:check (proposed)"`; §5.1's tool is `review`. A film can declare four motifs, draw none, and pass every command.
8. **`camera:check` still proves the label, not the move.** `src/engine/camera.ts:108–114` checks `from === to` only for `push_in`/`pull_back`. `cameraOptionsFromTokens` (`:163–172`) reads only `requireMove`, `minDistinct`, `maxRun` — not a move vocabulary and not x/y travel. `CAMERA_MOVES` in `src/core/style.ts:61–67` has **6** moves (static, push_in, pull_back, pan, tilt, orbit); the identity has **11** (adds crash_zoom, track, whip, handheld, world). §8.2 item 5 says camera:check "reads tokens.motion.camera for the move vocabulary and checks travel for pan/orbit" — it does neither. A `pan` with `from = to` passes; a `crash_zoom` is an unknown move. `identity.camera.keys` is `scope: "F"` and unread.
9. **`dimension` is written, never checked.** `style:identity` writes `dimension: identity.dimension ?? "2d"` (`scripts/style-identity.ts:129`); the pack's `tokens.identity.dimension` is **"2d"**; the spec's first invariant is `2.5d-layered`. Nothing compares them. The no-3D rule is a declaration, not a check.
10. **`style:measure`'s p5/p50/p95 already exist.** `src/engine/style-measure.ts:21–23, 36–46` defines and fills them; `match.json` has them. §8.2 item 3 says "`style:measure` adds p5/p50/p95" — false. The missing piece is a reader: `MATCH.md` prints only means (`scripts/style-measure.ts:408–412`), and `style:identity` reads only `delta`. The spec's "minimal change" is misdescribed in the one place it claims a new measurement.
11. **The "surface bands" have no instrument and two unsourced values.** §5.1 Medium says paper area ≥60% and halftone 5–40%, coverage "none"; the current `style:identity` has no paper, ink-band or role reader. The acceptance test's "pass the surface bands (paper, edge, palette family)" cannot be run. "Edge" is global edge density, not the 1.5–6 px ink band; "palette family" is a distance to six crops, not the role shares.
12. **The 3×3 grid is not a field/contrast instrument and its cost is unstated.** Nine crops × 4,698 frames on every frame, in a repo whose 0029 rule is "one pass". The spec does not say "sample three frames per shot". A cell mean cannot report an 8% bar's width or a ring's |ΔL|; the spec never says how a column profile or a ring is derived from the grid.
13. **The type families still exceed the pack.** `identity.type.families` includes Instrument Serif and Black Han Sans; the pack has Anton, Archivo Black, DM Mono and Permanent Marker (`tokens.type.families`). The source uses all six (A 391), so the reference passes and the pack cannot. §8.2 item 6 does not add the fonts or mark them F/V.
14. **The pose-key count still disagrees with itself.** §2 row 12 says **11** pose keys; §3.11 lists **12** names (bounce … flip); the JSON `poseKeys` has **12**. The joints are now 13/13, and openings/closings are 4/4 — those two v1.0 contradictions are fixed.

---

## 4. The acceptance test (§5.5)

### 4.1 Does it catch the Uber film on the five named gaps?

The five named gaps in §7 are **archetype, field, placement, local contrast, motifs**. §5.5's list is **field, centroid x, height sd, local luma contrast, motifs** — a different five. It omits archetype (the one gap the spec says has no machine test) and splits placement into centroid x and height sd.

| Gap | Current / proposed catch | Can it run? | Verdict |
|---|---|---|---|
| Archetype | `identity.cast.archetype` string; `library` construction | No command distinguishes a worker from a performer; §9 Q7 says human | **Omitted from §5.5**; should be a human sign |
| Field | `field.share .18–.60`; `field.largestFlat .04–.46`; `edgeBarMax .08`; `noCreamPlateWithWings` | `field.largestFlat` .268 is inside .04–.46; `field.share` .61 (I-frames line 350) is a 1-point miss; the bars are `edgeBarMax`, listed separately as "side bars"; the boolean has no reader | **Not a distinct catch.** §7 cites `largestFlat .268` (passes) and "1 plate", not the .61. |
| Placement (centroid x) | `composition.centroidX .30–.75`; paint bbox | No bbox exists in the tree (no `bbox`/`centroid` in `*.ts`); §8.2 item 4 proposes one | **Proposed only** |
| Placement (height sd) | `composition.heightSdMin 15`; `heightTiers 3` | Same: no bbox; the Uber is 57.8% in every sample → sd 0 | **Proposed only** |
| Local contrast | `palette.localContrastMin 20` / `median 35`; "frame probe" | No command measures local abs dL; `style:identity`'s global contrast passes the Uber at −18.0 vs crops | **No instrument** |
| Motifs | `identity.motifs` 3–5, 2–5 uses, ≤40% | No reader; the Uber score has no `motif`; a score count would catch a missing declaration, not a drawn motif | **No reader** |
| Blue-on-blue / side bars | `palette.blueOnBlue` rule; `edgeBarMax .08` | The rule is stated (figure-blue > .30, field hue 195–255, abs dL < 18); no command; the `palette` row is a 70–170° hue ban (blue is ~220°) | **No instrument for blue**; bars would need a column profile |

At best the test catches **two** of the five once the proposed bbox exists (centroid x and height sd); field, local contrast, motifs and archetype have no command. The test's own text says "if Uber passes a band that is supposed to catch it, the band is not a gap check" — but it never names the band for field, local contrast or motifs, so there is nothing to pass or fail.

### 4.2 Does it pass the reference film?

No, if the bands are read as written. §5.5 says `out/claude-pop.mp4` must pass the bands, and "if the reference fails a band, the band is wrong". The reference fails at least these:

| Field | Band | Reference | Source |
|---|---|---|---|
| `identity.edit.hardCutShare` | .80–.90 | 50/53 = .943 | I-frames §2; §3.17 |
| `identity.edit.transitions.iris.share` | .08–.15 | 10/51 = .196 | A 851; §3.17 |
| `identity.edit.transitions.flash.share` | 0–.08 | 14/50 = .28 (opening) or 38/51 = .745 (all calls) | A 362 |
| `identity.palette.warmShare` | .40–.90 | p25 .24 | I-frames §3; §3.3 |
| `identity.palette.saturatedShare` | .35–.70 | p25 .17 | I-frames §3; §3.3 |
| `identity.palette.maxRolesLong` / `maxRolesShort` (and §3.3's 4–7) | 4–7 | min 3 / max 8 | I-frames §3 |
| `identity.palette.blueShare` | ≤.20 | max .46 (arena) | I-frames §3 |
| `identity.composition.centroidY` | .38–.66 | min .24 / max .83 | I-frames §3; §3.6 |
| `identity.composition.floorLine` | .65–.88 | p25 .64 | I-frames §3; §3.6 |
| `identity.field.share` | .18–.60 | min .12 / max .78 | I-frames §3; §3.3 |
| `identity.field.largestFlat` | .04–.46 | max .76 | I-frames §3 |
| `identity.composition.negativeSpace` | .97 | 8.9%-area subject = .911 | I-frames §3; §3.6 says do not use area |
| `identity.camera.distinctMoves` | 4–8 | 8–10 | §3.14's own sentence |
| `identity.camera.movingShare` | .90–1.0 (target) | 27/51 = .53 | A 271 |
| `identity.camera` world share | ≤.10 (table, not JSON) | 15% | §3.14 |

The spec's only defense is "the reference is evidence, not law" and "the identity is the grammar the film was trying to use, with the defects removed". That defense works for the sticky camera and the unseeded grain — both are declared defects. It does not work for hard cuts, iris/flash rates, warm/saturated tails, role counts, centroid y, field share or largest flat: none is declared a defect. If the spec means these are **film-level medians/means**, it must say so per field and add `{basis: "per-film", share}`. It does not. As written, §5.5's first line contradicts §3.3 and §3.15.

### 4.3 Is "at least" the right wording?

No. "Must fail on at least [list]" is the wrong quantifier for three reasons:

1. The list is not the five named gaps: it omits archetype and splits placement. The sentence says "the five named gaps" while listing a different five.
2. "At least" allows a degenerate band set that fails the Uber on everything; the reference-pass clause is supposed to constrain that, but the reference-pass clause is itself broken (§4.2).
3. It hides that archetype is a human sign. §9 Q7 says archetype "stays a library declaration + human review until a semantic check exists". The acceptance test should say so, not drop it from the list and still call the list "the five".

The honest wording is: **"the reference passes every I band and every surface band it declares; the Uber film fails each of these named I fields — field share, centroid x, height sd, local |ΔL| — and is signed as failing archetype and motifs by a human; if any named field passes, the spec is not accepted."** And it must name the command that measures each field.

### 4.4 Can the test run at all?

No, not with the named command. `style:identity` needs a score (`scripts/style-identity.ts:27–35`); the reference has none. It measures five global means; it has no field/centroid/height/local/motif rows. It calls `style:measure` without `--score`. The reference film is outside the repository, so the test is not reproducible from a clone. The spec should say:

- `style:measure --ref out/claude-pop.mp4 --specimen <film>` for the five means — and record `bible.json` / the video hash in the pack;
- a new frame report for the subject box, centroid, height, bars, field share, figure-blue, field hue and ring |ΔL|;
- `preflight` for `identity.edit` and `type-audit` for the type role;
- a `collage`/paint-probe `drew` reader for staged, and a score reader for motifs;
- a human sign for archetype.

That is one new report plus several readers — not "nine fields, no new tool".

---

## 5. The 25% and the 24 checks

### 5.1 The 25%

v1.1 §7 now opens: "The user's '~25%' is a judgement." That is the right move. But the document still titles §7 "why the Uber film is ~25%" and says in §5.4 "a film can pass 24 checks and still be ~25% of the channel". The arithmetic is still not shown:

- 5 named failures / 12 axes = **41.7%**;
- 3 measured failures (placement, field, contrast/blue-on-blue) / 12 = **25%**;
- 5 / 32 axes in §2 = **15.6%**;
- 3 / 12 is the only 25%, and it excludes archetype and motifs — the two failures the spec also counts.

The fair sentence is: "the user judged the film ~25%; on the 12 axes it fails five (42%), three of which are measurable (25%) and two are human-judged." The §7 intro also says "the three largest measurable gaps are placement, field and **blue-on-blue**", but the five failures list **contrast**, not blue-on-blue; blue-on-blue is a sub-case of contrast. The sentence renames a failure and then counts it as a third.

### 5.2 The 24 checks

The count is real: `build/uber-model/gate-7.json` has exactly 24 keys (scoreAudit, scoreData, frames, oneHash, paintMatch, inputsHashed, writing, visual, styleIdentity, determinism, mix, master, duck, cueLevels, silence, tail, deliveredAudio, palette, motionFloor, typeSafeArea, rigSeam, finalSheet, asr, briefSaid).

The claim "it proved 24 checks but not style" is **fair in count** and now better itemised in §5.4. It is still imprecise in two places:

- The `styleIdentity` row is a five-global-means-vs-six-crops row. The Uber passes at Δ luma −0.99, Δ contrast −17.99, Δ sat −4.15, Δ edges +0.10, palette 42.95. The **reference film would fail the same row** at −44.9 luma (G 313). So the gate's one "style" row is calibrated to the crops, not the channel.
- The `palette` row is a 70–170° hue ban plus clipping; blue is ~220°. The Uber's 25/30 blue-on-blue frames pass it. The `typeSafeArea` row enforces 69 px; the identity demands 31 px. These are **wrong instruments**, not missing ones. §5.4 calls the gate's "text safe area" a proof; it is a different type rule.

So: the 24-check claim is fair if "style" means "the five named axes"; it is not fair if it implies the gate is neutral on palette or type. The spec should say "the gate's palette row cannot see blue-on-blue, and its type row refuses the identity's subtitle".

---

## 6. What would actually change the sign

1. **Add `{basis: "per-shot"|"per-film", share}` to every distribution band** (warm, blue, saturated, role count, field, largest flat, centroid x/y, floor, negative space, luma, height). Re-derive each band so the reference passes by construction; delete any band the reference cannot pass unless it is a declared defect.
2. **Build one frame report** — subject box, centroid, height, side bars, field share, figure-blue, field hue, ring |ΔL|, role count — and make it the single instrument for field, placement, contrast and blue-on-blue. A 3×3 cell grid is not that report.
3. **Make null/NaN a finding.** A missing or null measurement must fail, not pass. Read `collage`/probe `drew` for `stagedRatio`. Wire `identity.edit` into `preflight`, `identity.motifs` into a score/paint reader, `identity.forbidden` into `{id, check}` entries, and `identity.variation` into a human sign or a `film:compare`.
4. **Re-point every R value.** Use the canonical's 45/213 and 91.8 wpm; tag 46/227, 97.8, -15.6 and 11/61 as `comparison` (C) or delete them. Measure the canonical's audio or cite the song hash. Say 4,698 frames.
5. **Resolve 31 px vs 69 px.** Add a `subtitle` role at 28–34 px and make `type-audit` role-aware, or change the invariant to the pack's caption and admit the reference's subtitle is out of style. Do not leave both.
6. **Re-derive the transition bands from the source's definition.** Hard cut 80–95 (or 100 with the 2 soft + 1 melt declared defects), iris 8–20, flash 0–8 on impacts only with the 14 opening flashes declared a defect. State 14/24; do not say "38 flashes" without it.
7. **Fix the cast rules to the source's family.** Hand width .010–.037 (or label the .013 floor a library choice), thumb optional, and either an "equivalent readable set" for Mira's 6 eyes / 5 mouths or exempt the co-lead. The performer test must not fail the character the spec calls the second lead.
8. **Rewrite §5.5** to name the exact fields and commands, include archetype as a human sign, and say "each named gap", not "at least". Record the reports and the video/score hashes in the repo; do not depend on `Y:\NewVideoTest\out\claude-pop.mp4` being present.
9. **Add an `H` scope** (or a `measure: human` flag), and re-scope tone, variation, archetype, focal shape, paper-as-paper, eyeline, contact and first frame. The `I` cell "Can a check refuse? Yes" must be true.
10. **Fix the counts and the schema:** 4,698 frames; 12 pose keys; 10 vs 12 variation axes; `referenceFilm`/`bands.basis`/`tones` inside `identity` or the prose path corrected; the eight dominant hexes sourced or deleted.

---

## 7. Score and sign

**Evidential honesty: 6.5 / 10.**
**SIGN: no.**

**What improved:** the scope system and the reference/target split; the 27/51 disclosure; the shadow demoted to schema + human; 98.4% and the hand 18×26 removed; 45/213 added; the two-reference diagnosis; the 25% labelled a judgement; the status line.

**What still blocks:**

- P0-3: the reference fails its own percentile bands; no `share`/per-film basis.
- P0-4: no instrument for side bars, blue-on-blue or local contrast; the 3×3 grid is not it.
- P0-8: nulls pass; `stagedRatio` is a score claim; `edit`/`motifs`/`forbidden`/`variation` have no reader.
- N1: §5.5 cannot be run; the reference has no score; the tool has no field/centroid/height/local/motif row.
- P0-2: 11/61, 46/227, 97.8 and -15.6 are the 720p film; §10 says C is comparison only.
- P0-5: 31 px vs the 69 px gate is unresolved.
- P0-6: the hand ratio still excludes both reference hands; Mira has no thumb.
- P0-10: the reference's 94% hard cuts, 20% iris and 28% opening flashes are outside the bands.
- N2/N3: `I` still includes human signs; three of the nine P0 fields are not in `identity` in the JSON.

The method is still honest. The framing is better. The load-bearing evidence is not yet a gate.

**The one sentence:** v1.1 has learned to label its guesses, but it has not learned to measure the three failures it is built on, and its new acceptance test cannot run.
