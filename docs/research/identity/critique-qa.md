# QA / skeptic critique — Paper K-pop identity specification v1

**Date:** 4 November 2026
**Critic:** QA / skeptic (subagent)
**Inputs read:** `KPOP-IDENTITY.md`; `kpop-identity.proposed.json`; `A-engine.md`; `B-cast-sets.md`; `C-edit-camera-sound.md`; `G-studio-gap.md`; `I-frames.md` and `I-frames.json`; `J-skills.md`; `D-lemo.md`, `E-kits.md`, `F-vizavi.md` (searched for the values cited); `build/research/claude-pop/bible.json`; `build/uber-model/gate-7.json`; `build/uber-model/style-identity/style-identity.json`; `build/uber-model/final-sheet.png`; the six reference crops; `src/engine/style-identity.ts`, `scripts/style-identity.ts`, `scripts/style-measure.ts`, `scripts/camera-check.ts`, `src/engine/camera.ts`, `scripts/preflight.ts`, `scripts/frame-audit.ts`, `Y:\NewVideoTest\src\lyrics.js`.
**Scope:** this is not a completeness review. `critique-completeness.md` already lists the missing fields, the JSON/markdown contradictions and the provenance of the C citations; where I agree I say so and do not re-argue it. This review asks three questions only: **is each number traceable, can each invariant fail, and does the minimal change close the gap it names?**

---

## 0. Verdict

**Evidential honesty: 6.0 / 10.**
**SIGN: no.**

The method is honest. The evidence reports are measured, the spec separates surface reference from grammar reference, it admits the cast shadow is unmeasurable, and it admits the archetype has no machine test. That is rare and it is the reason this is not a lower score.

The synthesis is not yet honest enough to gate a film, for five reasons:

1. **The three failures the spec actually measured — side bars, blue-on-blue, local contrast — have no proposed instrument.** The minimal change adds a 3×3 region grid, which cannot see an 8% bar and cannot measure a figure-vs-ring contrast. The spec names the Uber film's largest failure and then proposes a tool that is blind to it.
2. **The spec sometimes measures the comparison film.** 46 lyric lines / 227 words / 97.8 wpm / 11-of-61 beat cuts / crash z 8.0 / 98.4% moving are C, the 720p PDoom film, not the canonical `claude-pop.mp4`. The evidence index itself says C is a comparison only.
3. **Percentiles are written as invariants.** Warm 40–90%, saturated 35–70%, roles 4–7, field 18–60%, largest flat 4–46%, centroid y 0.38–0.66 are p10–p90 / p25–p75 bands. The reference itself fails them at the tails (warm p25 = 0.24; saturated p25 = 0.17; roles min 3 / max 8; centroid y min 0.24 / max 0.83). Without a `share` or `basis`, a checker either fails the reference or passes a bad frame.
4. **The minimal change declares the five gaps; it does not close them.** Field and motif are score/token declarations; archetype is a string; placement is a rig-anchor box, not the painted silhouette; contrast is a 3×3 cell mean, not the 46.6 ring measure; edit is a token `preflight` does not read. The nine fields are necessary, not sufficient.
5. **Several checks silently pass.** `style:identity` skips a `null` measurement; `stagedRatio` reads the score, not the paint; `palette-audit` does not know what blue-on-blue is; `typeSafeArea` checks 69 px while the identity demands 31 px; `camera:check` proves a label, not a move. These are named in §3.

---

## 1. Claim-by-claim trace

Verdict key: **S** supported by the cited evidence; **M** misattributed (a real number from another film, another source, or another object); **I** invented / no source; **P** percentile-as-invariant; **C** contradicted by the cited evidence; **U** unmeasurable by the named instrument.

### 1.1 Envelope, edit and camera

| Claim | Spec value | Evidence value | Verdict |
|---|---|---|---|
| Canvas / fps / duration | 1920×1080 / 30 / 156.63 s | A 1; `bible.json` 1920×1080 / 30 / 156.63 | **S** |
| Frame count | 4,699 | A derives 4,699 (0…4698); `bible.json` has `frames: 4698`, `n: 4698`; the extracted folder has 4,699 JPEGs | **M** — state which is the delivered count; the measured video is 4,698 |
| Scene / card count | 51 scenes / 54 cards | B 1.3: 51 scenes, 54 board cards; A 7: 51 shots; I: 54 cards | **S** |
| Median shot | 2.86–3.06 s | A: 3.06 (51 scenes); I: 2.86 (54 cards); C: 2.045 (other film) | **S** for the canonical; C must not be cited |
| Cuts/min | 19–20 | A: 19.2; I: 20.3; C: 24.1 | **S** |
| Hard-cut share | 80–90% | I §2: 50 of 53 storyboard boundaries are hard cuts = **94%**; 2 soft, 1 melt. A: every cut is hard; the 10 iris closes are authored inside the outgoing shot | **C** — the reference is above the band, and the denominator (cuts vs iris closes) is undefined |
| Iris share | 10–20% | A: 10 iris calls / 51 scenes = 19.6%; if irises are in-shot closes and the denominator is 50 cuts, 20% | **S only with a definition**; the spec does not give one |
| Flash share | 0–10% | A §7: 38 flash calls — **14 open a shot, 24 mark a hit or close**. 14/50 boundaries = 28% | **C** — 38 is not 38 transitions; the band excludes the source |
| No dissolve | 0 | I §2: 2 soft boundaries and 1 melt (27.90); C §10: a 4-frame day→night dissolve in the comparison film; A: no crossfade in the canonical | **C / nuance** — the canonical has soft transitions; "no dissolve" is a policy, not a measured fact |
| Cut on lyric boundary | 92% | A: 47/51 starts = 92% | **S** |
| Beat-grid cuts | 11 of 61 | C §1.4: 11/61 — the **720p comparison film**; A: 88 BPM drives bodies, not cuts | **M** — a canonical sentence using C's count |
| Moving camera | 90%+ | A §5: 27 of 51 shots set the camera = **53%**; B 1.3/11: 24/51 inherit, called a defect; C §2.2: 63/64 = 98.4% (other film) | **C** — the single largest load-bearing number in the camera axis is contradicted by its own cited source (A 5). The 90% comes from C or from the 54-card authored table, not from the canonical camera |
| Distinct moves | 4–6 | §3.14's own frequency table has **11** labels; 9 if `roll/warp` and `transition micro` are excluded; A has push/pull/tilt/roll/whip/orbit/static | **C** — the reference exceeds "4–6"; if the band means primary moves, say so |
| Push/pull share | 35–45% | 15 + 6 / 54 = 39% (table); C: 34/64 = 53% | **S** for the canonical; C would fail |
| z range | 0.84–3.55; crash to 8.0 | A: 0.84–3.55; C §2.3: 0.95–8.0 (other film) | **S** for 3.55; **M** for 8.0 |
| Roll | −4 to +7.5° | A §5: −0.07…+0.13 rad = −4.0…+7.5° | **S** |
| Shake | 0–12 px; 71/63 rad/s; no decay | A §5 | **S** |
| Camera seam | speed jump .35, accel .50, 90° | F 5.1 / J P0, a kit rule; no command measures speed/accel at a cut | **I / U** — a good rule with no instrument |
| Cut at rest | 50–80% | F 5.1 / J; C reports 63/64 moving, i.e. cuts are mid-move; no canonical measurement | **I** — the source's value is not in A–J |
| Lyric lines / words / wpm | 46 / 227 / 97.8 | A §9: **45 lines / 213 words**; my count of `lyrics.js` is 45 texts / 230 words; C §6.1/7: **46 / 227 / 97.8** (other film); G #14: 29 / 141 / 54–60.8 | **M** — the spec uses C's count for the canonical film. Three reports disagree; the spec picks the one from the comparison film |
| Song loudness / LRA / TP | −15.6 / 6.0 / −3.7 | C §8: measured on `source.mp4`; A §1 says the canonical uses "the song" but does not measure the delivered audio | **U on the canonical** — likely the same asset, but the spec does not prove it |
| Narration / song rate | 180–190 narrated; 90–100 sung | 0043 (studio voice-led); C 97.8 (other film); A 213/138.18 = 92.5; G 60.8 | **M** — the one-line mixes the studio's spoken mode with the reference's sung mode |
| Colour roles per frame | 4–7 | I §3: min 3, max 8, p25 4, p50 5, p75 6, p90 7 | **P** — the reference fails at both tails (2/49 shots); a film mean of 5.2 passes |
| Centroid y | 0.38–0.66 | I §3: min 0.24, max 0.83, p10 0.38, p90 0.66 | **P** — about 20% of the reference's own shots are outside; the spec gives no `share` |

### 1.2 Palette, field, composition, cast, type

| Claim | Spec value | Evidence value | Verdict |
|---|---|---|---|
| Warm share | 0.40–0.90 | I: p10 0.08, p25 **0.24**, p50 0.70, p75 0.89, p90 0.97 | **P** — ≥25% of the reference's shots are below 0.40 |
| Blue share | ≤0.20 | I: p50 0.01, p90 0.17, max 0.46 (arena shot 21); shot 45 is 0.21 | **P** — 1–2 shots fail; film mean 0.044 passes |
| Saturated share | 0.35–0.70 | I: p25 **0.17**, p50 0.50, p75 0.69, p90 0.89 | **P** — roughly a third of the reference's shots are outside |
| Field share | 0.18–0.60 | I: p10 0.16, p50 0.27, p90 0.57, min 0.12, max 0.78 | **P** — about 10–15% outside |
| Largest flat region | 0.04–0.46 | I: p10 0.04, p50 0.14, p90 0.46, max 0.76 | **P** — the max is a real shot |
| Frame mean luma | 70–130 (film) | I: p25 53, p50 91, p75 147; `bible.json`: mean 100.88, p5 39.34, p50 98.74, p95 175.44 | **S** as a film mean; **P** if read per shot — the spec does not say which |
| Local contrast | 46.6; ≥20 in 75%; median ≥35 | I: n=47, p10 18.04, p25 27.59, p50 **46.62**, p90 103.74 | **S**; the 75% rule is calibrated. The instrument is the problem (§3) |
| Blue-on-blue | 1/49; 7/10 tiles; 25/30 frames; +81 pts | I: 1/49; 7/10 collage tiles; 25/30 final-sheet frames; I's own delta is **+68** (it uses 70%, not 83%) | **S** for the rates; the delta is inconsistent between reports (81 vs 68) — say which sample |
| Side bars | 0 left, 0 designed right; ≤8% | I: 0 left, 1 right (shot 45's 44% lighting falloff), 0 designed | **S** with "designed"; a naive 8% check will flag the falloff |
| Subject height | 13–92%; p50 55.2 | I: 12.96–91.85, p50 55.19 | **S** |
| Subject area | p50 3.0; "97% negative space" | I: p50 0.030, p25 0.010, p75 0.040, p90 0.070, max 0.089 | **P** — the JSON `[0.01, 0.04]` is p25–p75; the fixed 0.97 negative-space invariant fails the reference's 8.9% subject shot |
| Height sd / tiers | ≥15 points; ≥3 tiers | I: sd 21.8; 4 height bands | **S** |
| Hand | 18×26, thumb 8×12 | B 2.3: idol hand blob **9×13**, thumb **3.8×5.6**; Mira hand **7×10**, **no thumb**; G 65: the library Kiran is 18×26 / 8×12 | **M** — the spec's number is the studio's library character, not the reference's construction |
| Brad radius | 3.0–4.6 | B 9.1: **2.8–4.6**; B 2.3: wrist 3.0, elbow 3.4, knee 3.6, shoulder 4.2/4.6, hip 4.4 | **S** except the low end; 3.0 trims 2.8 |
| Joints | 11 | The spec's own list has 13; B 9.1 lists 13; the JSON has 13 | **Internal contradiction** — a checker cannot know which to read |
| Pose keys | 11 | The spec's own list has 12 (adds `flip`); B 3.1 says the idol reads 11, Mira 7 | **Internal contradiction** |
| Expressions | ≥14; 10 eyes × 7 mouths; must include closed, happy, wink, heart, star, swirl, narrow, x; sing, grin, o, flat, pout, wobble | B 9.2: **≥8 eyes and ≥6 mouths** (14 part variants), with that list; B 2.6: Mira has 6 eyes (dot, closed, star, swirl, wide, happy) and 5 mouths (smile, o, flat, wobble, grin), no heart/wink/narrow/x/spiral, no sing/pout | **M / C** — the spec's "14 expressions" is the library's count, not the source's 8+6; applied per character, the list **fails the source's co-lead** |
| Squash / overshoot / anticipation | 0.96–1.04 / 1.03–1.06 / 2–4 frames | B 3.5: the rig has **no squash** and **no anticipation**; the only squash is `ctx.scale(1+sq*.55, 1−sq*.78)` (0.22–1.8) in the chinchilla shot; J/PRODUCTION-PLAN proposes a 2-frame anticipation, not B | **I** — a proposed rig addition cited to a report that says it does not exist |
| Paper physics | fold / tear / curl / flutter / stack, one per shot | A §6: **no fold, curl, bend or collision**; the "physics" is sine/trig; B 3.5: paper cuts **pop, slam and snap**, no anticipation; only flutter exists | **I** — the vocabulary is invented; the source's event is a pop/slam/snap, not a fold/tear |
| Set layers | 5: bg, mid, character, fg, type | B 5.1 `stageSet`: sky, sunburst, sun, halftone, floor, speakers, spotlights, crowd, confetti, proscenium = **10 painted layers**; the pack's compositing order is 11; A says there is **no layer list** | **I / simplification** — "5 conceptual planes" is fine; "5 layers" as the source's count is not |
| 2.5D | layered, orthographic, 5 planes | A §5: 2-D similarity, **no per-layer factor**, no parallax; B 5.3: depth is different scroll rates inside one camera; F 2.1: 2.5D is panels with relative motion | **Declared model, not measured** — the spec's own §3.1 admits the source does not move layers relative to each other; call it "2.5D look, 2D camera" |
| Prop size classes | handheld 8–30%, body 30–50%, hero 40–90% of frame height | B 6.1 gives px sizes (mug 30×34, etc.), not frame %; no source for the % bands | **I** — plausible, but mark proposed |
| Grip | 11 px below wrist | B 2.3: the hand blob is centred `(0,11)` **beyond** the wrist; B 3.4: **no hand anchor API**, props re-derive trig | **M** — a hand centre is not a grip point |
| Type subtitle | 31 px | A 8.6: 31 px; the pack's caption is 18 @390 = **88.6 px** at 1920; `type-audit` enforces a **69 px** copy floor | **C** — the invariant contradicts the current pack and the current gate. A 31 px subtitle fails the gate's type row |
| Type families | Anton, Archivo Black, Instrument Serif, DM Mono, Permanent Marker, Black Han Sans | A 8.1 has all six; the pack has **four** (no Instrument Serif, no Black Han Sans); G 18 | **C** — the pack cannot satisfy the family list without two new font files |
| Type body | 44–84, common 56 | A 8.7: `TY.text` 7–108, median 13; `TY.type` 26–376, median 128; no 44–84 body band | **I** |
| Type monogram | 72–160, common 96 | A has no monogram function; D has a passing "monogram" mention, no 72–160; the JSON's "autopsy D09" does not exist anywhere in A–J | **I** — an invented value with a fabricated citation |
| Type boxes | max 2 per shot | A/B show 3–5 text elements in many shots (hero + 2 stickers + subtitle + HUD); the source's `boss` shot has two stickers, a serif line, a subtitle and the HUD | **I** — a 2-box cap is a product rule, not the channel |
| Field roles | 13 in the JSON; 9 in §3.8 | B's fields include green, pink, cream (I-frames: 3, 2, 2 shots); the §3.8 enum omits them | **Internal inconsistency** |
| Motif uses | 2–5 per motif | B 6.2: paperclip **9 shots**, doomMeter **6**, halo many | **C** — the reference's motifs exceed the band |
| Motifs per film | 3–5 | The source has paperclip, meter, halo, sunburst, petals, stamps, iris (6–7) | **Product choice**, not the channel |
| Openings / closings | 3 / 3 | §3.23 lists **4 / 4**; the JSON has 4 / 4 | **Internal contradiction** |
| Variation axes | 8 | §3.24 has **10** (adds transitions, sound); the JSON has 8 | **Internal contradiction** |

### 1.3 The bands, the crops and the gap

| Claim | Spec value | Evidence value | Verdict |
|---|---|---|---|
| Film luma | 100.9 | `bible.json` mean 100.88 | **S** |
| Crop luma | 145.8 | G #1; the six crops are **not all 720×720**: 720×720, 280×240, 700×760, 320×480, 635×740, 560×600; two are props | **S** for the mean; **wrong description** — "six hero close-ups" is false |
| Film contrast | 215.4 | `bible.json` mean 215.41, p5 190 | **S** |
| Crop contrast | 245.8 | G #1 | **S** |
| Film saturation | 21.8 | `bible.json` mean 21.83, p95 44.61 | **S** |
| Crop saturation | 39.8 | G #1 | **S** |
| Film edges | 12.6 | `bible.json` mean 12.57 | **S** |
| Palette distance | 48.3 | G #1; the `style:measure` run on the film vs crops | **S** |
| Luma p5 / p50 / p95 | 20–60 / 80–140 / 160–200; film 39 / 99 / 175 | `bible.json`: 39.34 / 98.74 / 175.44; **the spec rounds without saying so** | **S** — cite `bible.json`; say rounded |
| Contrast p5 | 175–210; film 190 | `bible.json`: p5 190 | **S** |
| Sat p95 | 30–60; film 45 | `bible.json`: 44.61 | **S** — rounded |
| Palette ≤55 | film 48.3 | G #1 | **S** |
| Warm / blue / subject / centroid / local / bars / cuts / median | §5.3 rows | I / A / `bible.json` | **S**, except the per-shot caveats above |
| 25% of the channel | "~25%" | The only arithmetic that yields 25% is **3 of 12 invariants** (field, placement, contrast). The spec lists **five** failures; 5/12 = 42%. 5 of 30 axes = 17%. No row in §7 is a percentage | **Unexplained / inconsistent** — the number is recoverable only by excluding the two human-judged failures, which the spec also counts |
| 24 checks | 24 | `build/uber-model/gate-7.json` has exactly 24 keys | **S** |
| Gate does not prove style | §5.4 list | The gate's `styleIdentity` row is the five crop means; `palette` is a 70–170° hue/clipping row; `motionFloor` is whole-frame; `typeSafeArea` is 69 px | **S / fair**, with the caveats in §4 |
| Dominant hexes | #EDAE3A, #CF4224, #5B0D09, #F3E7D1, #1F3CC4, #1C5648, #CCB490, #0C0805 | Not in A–J or `I-frames.json`; G §6.3 gives different field hexes (#E09A4B, #C44026, #ECC385, #100C0F); `bible.json`'s six palette colours are #100c0f, #2c2120, #564043, #995d49, #b88f6f, #dfc8a1 | **I / untraceable** — save the k-means artifact or delete |
| Paper area / halftone share | ≥60% paper; halftone 5–40% | No report measures either on the film; I-frames measures ink 27.3%, cream 1.5%, etc. | **I** — no source; and "paper area" is ambiguous when 20/54 shots have an ink field |
| Shadow by frame probe | +6/+10, .22, blur 0, `frame probe` | A 4 has the code defaults; I §7: **0 of 44 high confidence**, median −0.4; the spec itself says "do not build a shadow rule from the photograph" | **C / U** — a frame probe cannot check the value the spec says not to measure from frames. It is a code/render rule or a human sign |
| 156.6 s as a product format | 30 / 45 / 60 / 156.6 | `capabilities.limits.durations` 30/45/60; G #19: the score cannot score 157 s (minShot 1.2, median band, 5.5 prose) | **C** — 156.6 is the reference, not a scoreable format |
| Min / max shot | 1.2 / 6.2 | A: 0.66 / 6.14; STYLE.md: max 5.5; `tokens.motion.minShot`: 1.2; JSON: min 0.6, max 6.2 | **Internal inconsistency** — four maxima and two minima across three files |
| 38 flashes | 38 | A: 38 calls, **14 open a shot, 24 in-shot hits** | **M** — a call count is not a transition count |
| Mean luma 146.8 (Uber) | 146.8 | I: 10 collage tiles; the 30-frame sheet has different values (blue .175, flat .276, |ΔL| 10.4) | **S for the tile sample** — label the sample |

---

## 2. Invariants that cannot fail — demote, or add a command

The spec's own scope code says **I** = "can a check refuse? Yes". The following cannot be refused by any current or proposed command. They should be split out of `I` into a **human sign** list, or given the named instrument.

### 2.1 Demote to human sign (semantic, no instrument possible today)

| Invariant | Why no command can decide it | What to do |
|---|---|---|
| Cast archetype `paper-pop-performer` | A worker with 8 poses / 14 expressions / the six anchors passes every mechanical check; the spec's open question 7 admits this | `humanSign: archetype` — or a structural test that a worker fails (flower/ornament slot, performer costume roles, petal count) — but the source's Mira has no petals, so a flower test would fail the co-lead |
| Motif meaning / "signature shot unlike the last film" | Semantic; no motif asset is bound to the paint | `humanSign`; if a motif is a declared asset, bind it to `assets` and check the draw |
| "One focal shape" | No focal detector; a bbox is not a salience map | `humanSign` |
| "Paper is drawn as paper, not a JPEG overlay" | A photo collage passes a palette/luma test; `assets:check` checks file/name/licence, not content | `humanSign` + a banned-asset type (`image` with a provenance) |
| "The figure is the detail / sharpest" | Local contrast is a proxy; a figure can be high-contrast and still unreadable | `humanSign`; keep local |dL| as the proxy |
| "Type is a paper layer" | `type-audit` checks boxes and size, not the type's edge/shadow; a UI caption passes | `humanSign`, or extend the paint probe to record the type edge/shadow options |
| Feet planted / weight shifted / shared eyeline / extras frozen | `audit:rig` checks the leg solve, not weight or eyeline; extras have no probe | `humanSign`; keep the rig seam as the mechanical part |
| Prop contact / floating prop / clipped hand / mirrored badge | No prop probe; the rig has no prop anchors | `humanSign`, or add `events[].contact` + a prop anchor record |
| "Pose swap is not animation" | The motion probe cannot tell a cut from a hold | `humanSign` |
| First frame is subject-specific | The frame audit checks blank, not subject; a 2% logo on cream passes | `humanSign` + a coverage floor |
| Office-worker lead | Semantic | `humanSign` |
| Default sunflower / banner / lamp opener | `visual:check` refuses the default `paper_open` recipe, not a sunflower drawn in another recipe | `humanSign`; or a content/asset check |
| Same opener / closer / set family / motif set as the previous film | There is no previous-film record | Add `variation.previousFilm {id, hash}` + `film:compare`; the sign is human |
| Shadow direction / key light | A frame probe cannot recover a key direction from a flat paper frame (I: 0/44 confidence) | Code/render rule (`paper()` call) or `humanSign` |
| 2.5D vs 2D vs 3D | Schema declaration; no geometry check | `schema` only; say "declared" |
| Gloss / photo face / 3D | Schema + asset type; a pasted photo is not stopped by a pixel check | `schema` + `assets:check` asset type; human for the rest |
| "Does it feel like the channel?" | Human | `humanSign` — the 10 questions are correctly a person's sign |

### 2.2 Measurable, but no command exists — keep **I**, add the command

| Invariant | The measurement that exists | The command to add |
|---|---|---|
| Field share / side bars / cream plate | I §1's edge-bar detector; largest 8-connected component | `audit:frame-composition` (or `style:identity --frames`) with a column/row profile and a component, not a 3×3 grid |
| Local contrast (figure vs immediate surround) | I §1's `deltaLumaVsRing` / `localLumaDelta` | The same command, using the subject box + a 30%-padded ring |
| Blue-on-blue | I §6: figure-blue >0.30, field hue 195–255, |ΔL| <18 | The same command; the current `palette-audit` hue ban (70–170°) is unrelated |
| Per-frame colour roles / accent | I §1's k-means (k=14, merge ΔE<9) | A per-frame cluster count + accent role; `palettegen` 6 colours is not enough |
| Motif recurrence as drawn | B 6.2 counts; `collage`'s `drew` records characters, not motifs | Bind `shots[].motif` to an asset id the paint probe records |
| Camera travel (pan/orbit) | A 5's setCam; C's `cameraMoves` | A score `dx/dy` field or a paint measurement; `from/to` is a single scalar and cannot express a pan |
| Camera motion share from the paint | `style:measure --camera`; C's camera report | Use the measured `movingShare` on the film, not the score labels — otherwise "90% moving" is 100% of any film that passes `camera:check` |
| Character action vs camera-only motion | `motion-probe` gives whole-frame difference | A subject-only difference (bbox mask) or a pose-event record; the current floor cannot separate them |
| Cut on the word | `words.json` + shot starts | `preflight` or `audit:cut` compares each cut to the nearest word; the current `audit:reaction` checks events, not cuts |
| Text over face | Paint probe has text boxes + rig anchors | A face box and a text-box intersection; no current command |
| Text lines / boxes / systems / families | Paint probe has text boxes; score has roles | `type-audit` reads `maxLines`, `maxBoxes`, `maxSystems`, `roleMap`; today it checks 6% safe and the 69 px floor |
| Subtitle 31 px | A 8.6 | Add a `subtitle` role at 31 px and check it; today the 69 px floor refuses it |
| Edit distribution (p10/p90/cuts) | A / I | `preflight` reads `tokens.identity.edit`; today it reads `tokens.pace` and only median/max |
| Variation 8 axes | — | `film:compare --last <score>`; the sign is human |

### 2.3 Measurable only as a share — keep **I**, add `share`/`basis`

`warm 0.40–0.90`, `blue ≤0.20`, `saturated 0.35–0.70`, `roles 4–7`, `field 0.18–0.60`, `largest flat 0.04–0.46`, `centroid x 0.30–0.75`, `centroid y 0.38–0.66`, `floor 0.65–0.88`, `negative space 0.97`, `subject area [0.01,0.04]`.

Each of these is a percentile band. The evidence's own tails fail them. A record needs `{band, basis: "per-shot"|"per-film", share: 0.8}`. Without it, a checker can choose the interpretation that passes.

---

## 3. Checks that would silently pass

1. **A `null` measurement is skipped, not failed.** `src/engine/style-identity.ts:110–119`: `if (value === null) return;`. A missing `bands.palette` makes `limit` `undefined`, and `Math.abs(value) > undefined` is `false`. The spec's §8.2 item 2 validates the identity block in `style:check`, but that only catches a missing **key**, not a `null` returned by `style:measure`. The Uber report already carries `movement: null`, `shotMedian: null`, `cutsPerMinute: null`, `camera*: null`; a new field measured by the same path will pass the same way. **Fix:** a `null`/NaN is a finding, and `identity.required[]` is checked before the comparison.
2. **`stagedRatio` is a score claim.** `scripts/style-identity.ts:79` counts `shot.direction.cast?.length`, not whether the painter drew the character. `collage.json` already records `cast` vs `drew`; `style:identity` does not read it. **Fix:** read the collage/probe `drew` (or a bbox that is only recorded when the character is drawn) and fail "declared but not drawn".
3. **The paint probe's "bbox" is a rig box.** The spec's §8.2 item 4 says "min/max of the rig anchors", which is a box of anchor points, not the painted silhouette. For a flower-headed character the petal tips and hair are outside the six anchors, so the height is underestimated. The I-frames' 55.2% is an annotated silhouette with ±3 points. **Fix:** call it a rig bbox and re-derive the band from the rig bbox, or record the painted alpha/contour.
4. **`camera:check` proves the label, not the move.** `src/engine/camera.ts:108` checks `from === to` only for `push_in`/`pull_back`. A `pan` or `orbit` with `from = to` passes. The score's camera block is `{move, from, to, ease}` — one scalar, which is z/scale, not x/y travel. The spec's §8.2 item 5 says "checks travel for pan/orbit", but there is no field to hold that travel. **Fix:** add `dx/dy` to the camera block or measure the film; do not claim the gap is closed with the current schema.
5. **"90% moving" is a tautology after `camera:check`.** The check refuses a shot with no dynamic move, so every passing film is 100% moving by construction. The 90% floor can never fail unless the measurement is taken from the paint. The current `style:measure --camera` on the reference reports 26% moving over its 1,211 boil fragments (G §3.1) — unusable. **Fix:** measure the film with the authored shot windows, or drop the 90% claim.
6. **The gate's `palette` row is not a blue-on-blue row.** It checks a 70–170° hue ban and clipping ≤2%. Blue is ~220°. The Uber film's 25/30 blue-on-blue frames pass this row. **Fix:** a figure-blue/field-hue/|ΔL| row.
7. **The gate's `motionFloor` is not a character-action row.** It is a whole-frame luma difference; a camera move with a static character, a 12 Hz boil, or a paper fibre shimmer passes; a slow character action below 0.6 fails. **Fix:** a subject-mask difference or a pose-event floor.
8. **The gate's `typeSafeArea` is the wrong type proof.** It checks 6% safe and the **69 px** copy floor. The identity's 31 px subtitle would fail it; a film that sets everything at 69 px passes the gate and fails the identity. **Fix:** the role map must own the size, and `type-audit` must read it.
9. **`visual:check` proves the recipe, not the picture.** It refuses the default `paper_open` recipe and matches subject words to recipe `subjects`. A sunflower drawn in a non-default recipe passes; a network/map diagram whose subject is "map" passes. **Fix:** a content/asset check for the banned opener, or a human sign.
10. **`library:check` proves construction, not archetype.** A worker with 8 poses / 14 expressions / the six anchors passes. `cast.archetype` is a string the film declares. **Fix:** human sign, or a structural test that a worker fails.
11. **Motif and variation are score claims.** `shots[].motif` and `variation.requiredDifferences` have no reader. A film can declare four motifs and draw none. **Fix:** bind the motif to a drawn asset; a previous-film diff for variation.
12. **`preflight` reads `tokens.pace`, not `tokens.identity.edit`.** `scripts/preflight.ts:63–76` reads story → `tokens.pace` → `DEFAULT_PACE`. The new `tokens.identity.edit` band would be a token no command reads unless `preflight` is changed. **Fix:** read `identity.edit` in `readPace` (or make `tokens.pace` an alias).
13. **`style:measure`'s `p5/p50/p95` already exist but are not printed.** `Summary` carries p5/p50/p95, and `match.json` has them; `style:identity` reads only `match.delta` (means), and `MATCH.md` does not print the percentiles. The spec's "style:measure adds p5/p50/p95" is wrong; it must say "style:identity reads the existing `match.json` percentiles". **Fix:** read them; print them.
14. **The pre-render report is a different test.** `style:identity` defaults to the 10 collage frames; `film:review --gate` re-runs on the 4,698-frame video (G §3.2). A film can pass the first and fail the second. The spec's "the film is still the channel" needs to say which specimen it means.
15. **The scene detector makes any measured edit/camera band wrong.** `style:measure` uses `select='gt(scene,0.03)'`; on the reference it reports **238 shots, median 0.1 s, 90.79 cuts/min** (`bible.json`). If the new `style:identity` reads the film's cut/camera numbers from that path, it will compare 238 shots to a 51-scene score. The spec's §5.1 uses `preflight` for edit — good — but the proposed `style:identity` "edit" row must not use the measured film without fixing the threshold.

---

## 4. The gap analysis (section 7)

### 4.1 The Uber numbers

The 13-row table is the strongest part of the spec. **Eleven rows are exact to I-frames §10**: 57.8% height in all samples, centroid x 0.136, bars 19.0/19.5, blue 0.179, figure-blue 0.783, 7/10 collage tiles, 25/30 final-sheet frames, local |ΔL| 12.6, largest flat 0.268, mean luma 146.8, canonical 91.1, 54 field colours vs 1 plate. The "57.8 vs 55.2 is +2.6, not smaller" and "the range is gone" are exactly I-frames' reading.

**Two rows are visual, not I-frames:** archetype (office worker) and motifs (network/map diagrams). They are supported by `build/uber-model/final-sheet.png` (a suited figure with a tie in a cobalt bar; network nodes and app tiles) and by G's "none" for motif language. I-frames explicitly says it does not measure archetype or motif; the spec's §10 evidence index should not attribute them to I-frames. That is a labelling fix, not a factual one.

**One row is unexplained: the 25%.** The arithmetic:
- 5 named failures / 12 invariants = **42%**;
- 5 / 30 axes in §2 = **17%**;
- 3 measured failures (field, placement, contrast) / 12 = **25%**.

The only 25% is 3/12, which excludes archetype and motifs — the two the spec also calls failures. If the intended sentence is "the three measured failures are 25% of the invariants", write that; if it is "the film is 25% of the channel", the five-failure list contradicts it. As written, the number is a slogan, not a measurement.

### 4.2 The 24-check claim

The 24 keys are real: `scoreAudit, scoreData, frames, oneHash, paintMatch, inputsHashed, writing, visual, styleIdentity, determinism, mix, master, duck, cueLevels, silence, tail, deliveredAudio, palette, motionFloor, typeSafeArea, rigSeam, finalSheet, asr, briefSaid`.

The claim "it proved 24 checks but not style" is **fair** if "style" means the five named axes (field, placement, contrast, motifs, archetype). It is imprecise in three places:
- The gate has a `styleIdentity` row; it is a **five-global-means-vs-six-crops** row. The Uber film passes with Δluma −0.99, Δcontrast −17.99, Δsat −4.15, Δedges +0.10, palette 42.95. That proves the film is as bright as the crops, not that it is the channel; the reference film itself would fail the same row at −44.9 luma. The spec's §5.4 says this correctly; the "not style" shorthand should say "not the five named axes".
- The `palette` row is a 70–170° hue/clipping row, not a blue-on-blue row. The Uber film passes it with 25/30 blue-on-blue frames. The spec should name this as a **wrong** instrument, not a missing one.
- The `typeSafeArea` row enforces 69 px; the identity demands 31 px. The gate is not neutral on type; it enforces a different rule.

So: **the 24-check claim is fair; the 25% is not; the "palette" and "type" rows are not merely absent, they are the wrong checks for this identity.**

---

## 5. The minimal change (section 8)

### 5.1 Does it close the five named gaps?

| Gap | Proposed change | Closes? | Why |
|---|---|---|---|
| **Field** | `tokens.identity.field` + `style:measure` 3×3 region grid | **No** | An 8% side bar is 154 px; a 3×3 cell is 640 px wide and dilutes it. The field share is the largest 8-connected component, not a cell mean. The "cream plate + wings" is a layout, not a mean. Needs a column/row profile + a component, as I-frames §1 already has. |
| **Archetype** | `library.archetype` string + compare | **No** | A worker can declare `paper-pop-performer`. The spec's open question 7 says this stays human; §8.2 item 8 presents it as a check. Resolve: human sign, or a structural test (performer costume roles, ornament slot, petal count) — and the source's Mira has no petals, so a flower test fails the co-lead. |
| **Placement** | paint-probe bbox from rig anchors | **Partial** | The bbox is a rig box, not the painted silhouette; the flower/hair extend beyond the anchors; the bands are calibrated to the annotated silhouette. It does measure "was a character drawn" if a bbox is only recorded when drawn. Needs a painted extent or a re-derived band. |
| **Contrast** | 3×3 region grid | **No** | The 46.6 is a subject-box-minus-field vs a 30%-padded ring, not a 640×360 cell mean. The 3×3 grid will report mostly field and understate the figure. Needs the ring measure. |
| **Motifs** | `tokens.identity.motifs` + `shots[].motif` | **No** | A score claim. A film can declare four motifs and draw none. Needs the motif bound to an asset the paint probe records, or a human sign. |
| **Edit** | `tokens.identity.edit` | **No** | `preflight` reads `tokens.pace`, not `identity.edit`; and `preflight` has no p10/p90/distribution reader. The token would be unread. |
| **Text** | type-audit reads bottom 12%, role map, reading | **No** | It still would not read the 31 px subtitle, the families, `maxLines`, `maxBoxes`, `maxSystems`, or the paint's type edge/shadow. |
| **Camera** | camera:check reads `tokens.motion.camera`, checks pan/orbit travel | **No** | The token has 5 moves (no tilt/crash/whip/handheld); the score has one `from/to` scalar and no x/y travel. Reading the token would reject tilt, which the identity requires. |
| **Forbidden** | `tokens.identity.forbidden` string list | **No** | No film check reads the list. It is a wish until each id has a `check` field. |
| **Variation** | none | **No** | No previous-film record, no compare command; the spec honestly says "review", but keeps it in `I`. |

**Verdict:** the nine fields **declare** the five gaps and add two measurements (a cell grid and a rig bbox). They do not close field, contrast, archetype, motifs, edit, text, camera, forbidden or variation. The spec's sentence "Nine fields close the five named gaps" is false. The honest sentence is: "nine fields make five gaps named; four of them still need an instrument."

### 5.2 Is it over-engineered?

Yes, in the same document that warns against a 200-field schema:
- The JSON has **251 records**; §8.3 says "do not add a 200-field schema that no check reads". The spec is 25% over its own limit before implementation.
- §4.4's P1 adds ~28 fields (light, depth, opening/closing, `color.field/share`, camera `travelPx/movingShare/gapShotsMax/forbidden`, type `roleMap/maxLines/maxBoxes/underline/reading`, library `archetype/appearance`, score `motif/with/contact/interaction/framing`). Most have no reader. That is the "schema no check reads" failure mode in the same section that forbids it.
- The 3×3 grid on every frame is 9 crops per frame on a 4,698-frame film; the current `style:measure` already decodes every frame. The spec does not say "sample 3 frames per shot" or give a cost. The repo's 0029 "one pass" discipline makes this a real risk.
- The "two references" (surface crops, grammar film) has no surface measurement: `paper area`, `halftone share`, `edge` are all "none" in §5.1. The split is a good idea with only one half implemented.
- The 11-row camera frequency table has 11 labels for a 10-move vocabulary; `roll/warp` is an axis, `transition micro` is a transition. The table is not a vocabulary.
- The 13-item motif library is not B's 13 (B includes halftone, stars, comic burst, print furniture, circular type); the spec's 13 is a different list. "13" is an accident of both lists, not a shared contract.

### 5.3 The minimum that would actually close the gaps

1. One per-shot frame report on the delivered video (or the 3 sampled frames per shot): subject box (painted extent), centroid x/y, height, floor, side-bar width, field share, figure-blue, field hue, ring |ΔL|. This is one command and it closes field, placement, contrast, blue-on-blue and (with the rig records) the "declared but not drawn" check. It is more than a 3×3 grid, but it is the only shape that matches I-frames' measures.
2. `preflight` reads `tokens.identity.edit` and checks p10/median/p90/cuts/min from the score.
3. `type-audit` reads a `subtitle` role at 31 px, the role map, `maxLines`, `maxBoxes`, `maxSystems`, and the font family from the paint/score.
4. `camera:check` gets `dx/dy` (or a paint measurement) for pan/orbit; the token vocabulary is extended to the 10 moves the spec names.
5. `film:compare --last <score>` lists the 8/10 variation axes side by side; the sign is human.
6. `forbidden` becomes `[{id, check: "schema"|"frame"|"score"|"human", command?}]`.
7. `library:check` gets a structural archetype test or the spec marks archetype `humanSign`.

That is one new report + five readers + one schema field; it is still "no new framework", but it is not "nine fields".

---

## 6. The forbidden list and the variation grammar — enforceable or wishes?

### 6.1 Forbidden moves

| Rule | Current / proposed command | Verdict |
|---|---|---|
| Glossy 3D, bevel, chrome, photoreal | Schema; no pixel check; `assets:check` does not inspect an image's content | **Wish**; a pasted photo passes unless the asset type is banned |
| Photo faces, fingers | `audit:body` checks hand size/elbow, not fingers; the library has no fingers | **Partial** — construction, not the painted hand |
| Soft cast shadow / AO / halation | Schema + render; the contact shadow is itself a radial gradient (soft) | **Contradiction** — the rule and the contact shadow disagree |
| DOF / bokeh / motion blur / tilt-shift / radial blur | Schema; the render has no effects, but a future effect can be added | **Partial** — enumerate the effects in `EFFECTS` and refuse |
| Dissolve / page turn / star wipe | `TRANSITIONS` closed list; score | **Machine** (score), not the paint |
| Side bars / cream plate + wings | No command | **Wish** — the spec's largest failure; needs the frame report |
| Blue-on-blue / figure within 18 luma of field | No command | **Wish** — needs the frame report |
| Office-worker lead | Human | **Wish** — human sign |
| Static shot / camera-only motion / no character action | `camera:check` (labels), `motionFloor` (whole frame) | **Partial** — labels and whole-frame, not subject |
| Text over face / hands / feet | No command | **Wish** — needs a face box/text intersection |
| Lyric wall >8 words, >2 lines, >2 boxes, >2 systems | `type-audit` checks 6% safe and 69 px; no lines/boxes/systems | **Partial** — words only in `layout.maxWords`, not per shot |
| >7 roles / >5 short | No per-frame role count | **Wish** — needs the frame report |
| Default sunflower / banner / lamp | `visual:check` refuses the default `paper_open` recipe | **Partial** — recipe id, not content |
| Same opener / closer / set / motif | No previous-film record | **Wish** — human |
| Three same camera moves | `camera:check` maxRun 2 | **Machine** (labels) |
| Pan `from = to` | `camera:check` does not check pan/orbit | **Wish** — no x/y field |
| 3D orbit | Schema / closed camera vocabulary | **Machine** if the vocabulary is closed |
| Floating prop / clipped hand / mirrored badge / prop through body | No prop probe | **Wish** |
| Pose swap as animation | Human | **Wish** |
| Dead hold >0.4 s | `frame-audit` luma diff <0.35 | **Partial** — a boil passes; a slow action fails |
| Generic underline / rounded UI card / glass panel / soft drop shadow | `type-audit` no; recipe shapes | **Wish** |
| Unlicensed font / track | `assets:check` / `style:check`; no content licence check for a new image/font | **Partial** |
| Meme sound | `sfx` closed cue kinds | **Machine** if the kinds are closed |
| Unverified claim | Human / QA | **Wish** (process, not a film rule) |

**Count:** ~5 machine (score/schema), ~7 partial, ~13 wishes. The spec's one string list with `measure: "schema + review"` hides that split. Split it.

### 6.2 Variation grammar

| Axis | Can a command check the *difference* from the last film? | What is missing |
|---|---|---|
| Story / structure | No | A previous film's story and beat order |
| Set family | No | A registry of the last film's set families |
| Field script | Partly: the film's own 3–5 roles and no consecutive repeat can be checked; "different from last film" cannot | `paletteScript[]` + the last film |
| Cast instance | No | Names/faces/species comparison |
| Motif set | No | The last film's motif ids |
| Camera sequence | Partly: 4–6 moves, no run >2; "different opening/closing" cannot | The last film's move list |
| Text behaviour | Partly: 2–3 behaviours; "no repeated layout" cannot | The last film's behaviours |
| Signature shot | No | Human |
| Transitions (in §3.24, not in the 8) | Partly: 2–3 kinds; "different act-boundary transition" cannot | The last film's transitions |
| Sound mode (in §3.24, not in the 8) | Partly: mode enum; "different if the last was the other" cannot | The last film's mode |

**Verdict:** the grammar is a **wish list with counts**, not a check. The counts (3–5 motifs, 3–5 fields, 4–6 moves, 2–3 behaviours/transitions) are checkable within one film. The "different from the last film" half needs a previous-film record and a `film:compare`; the sign is human. The spec already says "review" in §5.1 — it should move the whole axis to `humanSign` and stop calling it `I` in §2/§30.

---

## 7. P0 / P1 / P2

### P0 — the spec cannot be signed until these are fixed

1. **The 90% camera number is contradicted by its own source.** A 5 says 27/51 set the camera (53%); B 11 says 24/51 inherit and calls it a defect; C says 98.4% for the 720p comparison film. Either define "moving" as picture movement (subject + camera + local scroll) and measure it, or state that the canonical has 24 static cameras and make 90% an aspiration. Do not cite A 5 for 90%.
2. **Provenance: the comparison film is used for canonical numbers.** 46/227/97.8 (C 6–7), 11/61 (C 1.4), crash 8.0 (C 2.3), 98.4% (C 2.2). The canonical `lyrics.js` has 45 lines / 230 words by count (A says 213); its rate is 92.5–99.1 wpm. Re-point every canonical record to A/I; keep C under `comparison`. Measure the canonical audio or cite the artifact.
3. **Percentile bands are written as invariants.** Add `{basis: "per-shot"|"per-film", share}` to warm, blue, saturated, roles, field, flat, centroid x/y, floor, negative space, subject area. The reference fails warm (p25 .24), saturated (p25 .17), roles (min 3/max 8), centroid y (min .24/max .83) at its own tails. A checker must not treat a p10–p90 band as a per-shot rule.
4. **The three measured Uber failures have no instrument.** Side bars, blue-on-blue and local contrast are the diagnosis; the minimal change offers a 3×3 grid that cannot see an 8% bar and cannot measure a ring. Add the frame report (subject box, bars, field, figure-blue, ring |ΔL|) or change the claim to "declared, not measured".
5. **The 31 px subtitle contradicts the pack and the gate.** The pack's caption is 88.6 px at 1920; `type-audit` enforces a 69 px floor. Decide: add a 31 px `subtitle` role and change the audit, or change the invariant to the pack's size and admit the reference is out of style.
6. **The hand 18×26 is the library's, not the reference's.** B 2.3: idol 9×13 / thumb 3.8×5.6; Mira 7×10, no thumb. Replace with the source's values or label 18×26 as a library choice, not the channel's construction.
7. **The shadow is measured by a frame probe the spec says cannot measure it.** A 4 has the code defaults; I §7 has 0/44 confidence. Change the measure to `render`/code (`paper()` args) or `humanSign`; do not list `frame probe`.
8. **Null and score claims silently pass.** `band()` skips `null`; `stagedRatio` reads the score; `motifs`/`variation`/`forbidden` have no reader. Make `null` a finding, read `collage`/probe `drew`, and give each new field a reader or a `humanSign`.
9. **The 25% is inconsistent with the five failures.** Either write "3 measured failures = 3/12 = 25%; two more are human-judged" or delete the percentage. The 24-check claim itself is fair; the "25%" is the unsupported clause.
10. **The hard-cut / iris / flash taxonomy is undefined.** I-frames: 50/53 hard (94%), 2 soft, 1 melt; A: 10 iris closes, 38 flash calls, 14 open a shot. The spec's 80–90% hard / 0–10% flash excludes the source under one denominator and fits it under another. Define transition kind vs overlay, and the denominator.

### P1 — important, not blocking

- **Roles:** 4/5/7 for one rule; the pack's `maxColours` is 4, the source is 3–8. Pick one and state per-shot vs film mean.
- **Reference-exceeding bands:** motifs 2–5 uses vs paperclip 9 / meter 6; 3–5 motifs vs the source's 6–7; 4–6 moves vs 9–11.
- **Expressions:** the must-include list fails Mira (6 eyes, 5 mouths, no heart/wink/narrow/x/sing/pout); "14 expressions" is the library, "8 eyes + 6 mouths" is the source.
- **Squash/overshoot/anticipation and paper physics:** B 3.5 says the rig has no squash/anticipation; A 6 says no fold/curl/bend. Mark them as a proposed rig addition (J/PRODUCTION-PLAN), not the source.
- **Layers/2.5D:** "5 layers" vs B's 10-layer `stageSet` and the pack's 11 compositing layers; "2.5D" is a declared look, not a camera feature (A 5: no per-layer factor).
- **Type:** two families (Instrument Serif, Black Han Sans) are not in the pack; body 44–84 and monogram 72–160 have no source (and "autopsy D09" does not exist); max 2 boxes vs the source's 3–5.
- **The hard shadow is not settled.** §7 says "the hard shadow" is already in the channel, but the pack's `tokens.medium.light.paperShadow` is an **open choice** (Collage vs Print), and G #16 says the reference reads as Collage, not as an open choice. The identity cannot claim "hard shadow" while the pack leaves the choice open; answer the `paper-shadow` choice or scope the rule to type only.
- **Counts:** 4,699 vs 4,698; 156.63 vs 156.62; 11 joints vs 13 names; 11 pose keys vs 12 names; 3 openings vs 4; 8 variation axes vs 10.
- **Durations:** 1.2 min / 6.2 max / 5.5 prose / 0.66 reference; 156.6 is not a scoreable format.
- **Kit rules cited as source:** cut-at-rest 50–80, seam .35/.50/90°, exit 40–50% shorter, overlap 30–50%, stagger 1 frame/60–120 ms/40–80 ms, hold creep .02%/frame, push creep .06%/frame, kick 6–10 px. These are F/J/E, not A/B; mark them "proposed".
- **The `measure` column names instruments that do not exist.** `cast.blink`, `cast.idle`, `movement.*`, `movement.boilHz`, `props.*`, `sets.sunburst`, `opening.firstFrame` all say "probe" or "frame probe"; no probe records blink, expression swaps, pose amplitude, prop contact, ray count or a subject-specific first frame. Either add the probe or change the measure to `library`/`humanSign`.
- **Props:** 8–30 / 30–50 / 40–90% are invented; "grip 11 px" misreads the hand centre; "paper area 60% / halftone 5–40%" have no source.
- **Crops/hexes:** the six crops are 720/280/700/320/635/560, two props, not "six hero close-ups"; the eight dominant hexes are not in A–J, and G gives different field hexes.
- **3×3 grid cost:** 9 crops × 4,698 frames; sample 3 frames per shot and say so.
- **`style:measure` p5/p50/p95 already exist**; the spec's "adds" is wrong; the reader is what is missing.

### P2 — worth fixing, not signable

- Sample labels: Uber mean luma 146.8 is the 10-tile mean; the 30-frame sheet has different values; the +81 vs +68 blue-on-blue delta uses 83% vs 70%.
- Rounding: 100.9 / 21.8 / 12.6 / 99 / 175 / 190 / 45 are rounded; say so and cite `bible.json`.
- "19–20 cuts/min" vs the JSON 16–24; "4–7 roles" vs "5 for a short"; "6 crops" vs 2 props.
- Bottom text band: I-frames p90 is 7.0%, the spec's 5.1 says ≤6%; the 19% outlier includes the meter/confetti.
- Edge: the spec's "1.5–6 px" mixes the object edge (1.5–4) and the silhouette p10 (5.6); the median is 12. Say which statistic.
- `cast.hand` unit: px at s=1 vs world units; `type.reading` and `sound.silence` are formula strings, not values.
- The 251 records vs §8.3's 200-field warning; duplicate ids (light/edge/type, props/interaction, movement/motion, edit/motion) will drift.
- The `sound.song` content values (46 lines, 227 words, LRA 6.0) are the reference song, not a style invariant; scope them `appliesTo:"song"`.
- The `edit.scenes 51` / `visibleCards 54` scope I is a category error; a 30 s film has 8–12 shots. (Completeness P0-9.)
- The HUD label conflict (A: `P(DOOM)` / `TOKENS/S`; H: `RUNNING` + sun) is unresolved.

---

## 8. Score and sign

**Evidential honesty: 6.0 / 10.**

- **+** The evidence reports are measured and reproducible; the spec separates surface and grammar references; it admits the shadow is unmeasurable and the archetype is semantic; the Uber gap is 11/13 exact to I-frames; the I/F/X/V codes and the "research, not implemented" status are honest.
- **−** The 90% camera contradicts A 5; the song/lyrics/beat/crash provenance is C; the percentile bands are written as invariants; the three measured failures have no instrument; the 31 px subtitle contradicts the pack; the hand is the library's; the 25% is inconsistent with its own five failures; the minimal change declares rather than closes.
- **−** The spec's own JSON has 251 records and §8.3 warns against 200; the P1 list adds 28 more with no readers.

**SIGN: no.** This is a strong research document and a weak gate. The P0 fixes are local (re-point provenance, add `basis/share`, add the frame report, fix the type role, fail-closed nulls, split forbidden/variation into human vs machine). After those, it becomes an 8/10 identity contract; it should not be implemented as a gate before then, because a checker built from it would fail the reference film on its own percentile tails and pass the Uber film on its bars and blue.

**The one sentence:** the spec has the right method and the wrong denominator — it measures the film, then writes the film's percentiles as invariants, and fills the provenance gaps with the comparison film.
