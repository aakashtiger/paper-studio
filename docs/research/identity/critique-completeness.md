# Completeness critique — Paper K-pop identity specification v1

**Date:** 4 November 2026
**Critic:** completeness (subagent)
**Inputs read in full:** `KPOP-IDENTITY.md` (1,267 lines, 48 tables), `kpop-identity.proposed.json` (251 parameter records), `A-engine.md`, `B-cast-sets.md`, `C-edit-camera-sound.md`, `D-lemo.md`, `E-kits.md`, `F-vizavi.md`, `G-studio-gap.md`, `H-youtube.md`, `I-frames.md`, `J-skills.md`.
**User's dimension list:** dimension, camera moves/frequency/gaps/travel, framing/composition, shot duration and continuity, per-shot action, focus/blur, lighting per element, background, boundary lines, character type/look/movement, sound, shadows, assets/props, narration, continuous motion vs cuts, transitions, camera types, text behaviour/appearance/boxes/underlines/animation, interaction, reusable code values — plus the named checks: per-element lighting, paper physics, crowd, prop scale, set parallax, 9:16, HUD, print furniture, determinism, fonts, voice register, song vs narration, reaction timing, hand anchors, proportions, expressions, walking, blink, shake, colour script, motif meaning, opening/closing, variation.

---

## 0. Verdict

**Score: 7.0 / 10 for completeness.**
**SIGN: no.**

The specification is a serious, evidence-led document. It answers all twenty of the user's dimensions at the prose level, names the five failures of the Uber film with numbers, separates surface reference from grammar reference, and gives 251 machine-readable records. That is far beyond the usual style bible.

It is not yet a complete identity contract, for four reasons:

1. **The document's own P0 fix is missing from its own JSON.** §5.2 proves the pack's five bands are calibrated to six crops, and §5.3 gives eighteen film bands. The JSON has **no luma, contrast, saturation, edge or palette-distance record and no `bands.basis`**. The correction the whole document argues for cannot be read by a checker.
2. **Five user dimensions are effectively missing as code:** per-element lighting (one shadow only), walking/sitting (a rule with no cycle), determinism (one prose sentence), 9:16 (one line and an open question), and per-act colour script (prose with no field).
3. **Continuity is under-specified.** There is no motivated-exit rule, no match-cut target, no cut-on-action and no position component in the camera seam — even though evidence C calls the motivated exit the film's actual signature and evidence F supplies the four match-cut tolerances.
4. **The JSON and markdown disagree in ways a checker would hit:** 11 vs 13 joints, 3 vs 4 opening types, 8 vs 10 variation axes, 251 records vs §8.3's ban on a 200-field schema, and `edit.scenes=51` declared invariant for every film.

The eleven P0s below are cheap to close. None requires a new tool.

---

## 1. Coverage matrix

Legend: **C** = complete (a value, a scope, a measure and an evidence source exist); **P** = partial (prose only, a value without a measure, or a record without a check); **M** = missing (no field or no record). "Spec" is the section or JSON id.

| # | User dimension (split) | Spec section / field | Status | Evidence |
|---:|---|---|---|---|
| 1 | Dimension model (2D / 2.5D / 3D) | §1.4, §3.1; `envelope.dimension`, `projection` | C | A 1, A 5, G #1 |
| 2 | Layer count and plane order | §3.1, §3.8; `envelope.planes`, `medium.layerOrder` | C | A 1, A 3, F 2.1 |
| 3 | Camera movement types / vocabulary | §3.14; `camera.model`, `camera.moves` | C | A 5, B 7, F 2.1 |
| 4 | Camera frequency / share per move | §3.14 frequency; `camera.*Share` | P — JSON omits handheld, pan and roll shares; frequency table has 11 types, vocabulary 10 | A 5, C 2.2 |
| 5 | Camera gaps (every shot moves) | §3.14; `camera.movingShare`, "no gap" | C | A 5, C 2.2 |
| 6 | Camera travel — pan, tilt, track, orbit, whip | §3.14 vocabulary "Travel" column | P — markdown only; no `camera.travel` record; `zRange`, `crashMax`, `roll`, `shake` are the only travel records | A 5, §3.14 |
| 7 | Camera travel — z, roll, shake | `camera.zRange`, `roll`, `shake` | P — no shake frequency (71/63 rad/s), no y ratio 0.7, no decay choice, no anchor (960,540) | A 5, E 4.1 |
| 8 | Camera seam / continuity | §3.14; `camera.seam` | P — speed, accel, direction and cut-at-rest; no position jump; no instrument named for the seam | F 5.1, J P0 #8 |
| 9 | Framing taxonomy (wide/medium/close/extreme) | §3.6; `composition.framingMix` | C — but the share bands overlap and do not partition | I 3 |
| 10 | Subject placement | §3.7; `composition.centroidX`, `centroidY`, `floorY` | P — no "in ≥80% of shots" / "≥70%" qualifier; a single outlier breaks or passes silently | I I4–I6 |
| 11 | Subject scale / scale rhythm | §3.7; `composition.subjectHeight`, `heightTiers`, `heightSdMin` | C | I 3 |
| 12 | Negative space / one focal shape | §3.6; `composition.negativeSpace`; "one focal shape" prose | P — `negativeSpace` is a fixed 0.97 and contradicts the reference's own 8.9% subject; no focal-count measure | I 4, J designer |
| 13 | Shot duration min / median / max | §3.15; `edit.min`, `median`, `max`, `p10`, `p90` | P — three different maxima (5.5 prose, 6.2 JSON, 6.14 reference), two minima (1.2 band, 0.6 JSON); no per-format record | A 7, I 3, G #19 |
| 14 | Duration distribution | `edit.distribution` | C | I 3 |
| 15 | Cut rhythm / alignment | §3.15; `edit.chorus`, `verse`, `cutOnWord` | C | A 9, C 1.3 |
| 16 | Continuous motion vs hard cuts | §3.15, §3.17; `edit.holdMax`, `edit.dissolve` | P — no motivated exit, no "one idea per shot", no cut-on-action, no 180° line | C 4–5, F 2.2 |
| 17 | Per-shot action count | §3.16; `motion.actionsPerShot`, `nonCameraAction` | C | J 9/10 |
| 18 | Performance phases / hero action | §3.11; `movement.anticipation`, `breakdownsPerTransition` | P — no prepare/action/contact/reaction/decay; "one hero" undefined; no unison ban | F 2.2, J P1 #13 |
| 19 | Paper physics | §3.16; `motion.paperPhysics` | P — the record contradicts the evidence: A 6 finds **no** fold, curl, bend or collision; B 3.5 finds **no anticipation** and no squash in the rig. The spec turns authored flutter into a mandatory "physics event" with no vocabulary | A 6, B 3.5 |
| 20 | Focus / blur / DOF | §3.18; `envelope.dof`, `camera.motionBlur` | C — prohibition is complete; radial blur is not in `forbidden.list` | A 5, F 4 |
| 21 | Depth / parallax | §3.18; `envelope.parallax`; V 3-plane | P — the source fakes depth by **different scroll rates inside one camera** (B 5.3); the spec only allows all-or-nothing 3-plane parallax | B 5.3 |
| 22 | Key light direction | §3.4; `light.key` | C | A 4 |
| 23 | **Lighting per element** | §3.4 — one paper shadow, one contact shadow, type shadow | **M** — A 4 has five distinct element shadows: limb +3/+5 α.14, face +2.5/+4.5 α.14, hair +2.5/+5 α.16, petal +1.5/+3 α.13, plus contact. None is a record. Spotlights/glows are markdown-only | A 4, B 9.1 |
| 24 | Shadow geometry | `light.shadowOffset`, `shadowAlpha`, `shadowBlur`, `shadowRatio`, `contactShadow` | C | A 4, B 9.1 |
| 25 | Background field look | §3.8; `palette.fieldShare`, `fieldRoles` | C | I 5 |
| 26 | Set construction (diorama) | §3.8; `sets.layers`, `floor`, `horizonY`, `families` | C — sky rule is prose only; no `sets.sky` record | B 5, B 10.1 |
| 27 | Boundary lines — figure / props / type | §3.5; `edge.limb`, `object`, `typeEdge`, `silhouetteP10`, `brads` | C | A 4, I 7 |
| 28 | Boundary lines — sets / background | §3.5 | P — no separate set/field line width; cut-edge colour (cream or ink) has no record; no "figure edge is 3× field edge" record | A 4, I 7 |
| 29 | Character type / archetype | §3.9; `cast.archetype` | C | B 9, 0052 |
| 30 | Character proportions | §3.9; `cast.heightUnits`, `headToBody` | P — "7.0–7.5 heads" and "head centre .80–.92 of height" cannot both be true (7 heads puts the centre at .929). No hip/shoulder/thigh/shin ratios | B 9.1 |
| 31 | Face / expression vocabulary | §3.9; `cast.expressionsMin` | P — the "must include" list omits `normal`, `smile` and `spiral`; no brow mapping; no `mood(t,keys)` blend | B 9.2, B 2.5 |
| 32 | Costume / palette roles | §3.10 | P — no `cast.paletteRoles` record (main, sleeve, skirt, boot, skin, hair, metal, paper, ink); the torso construction rule is prose | B 9.3 |
| 33 | Poses | §3.9, §3.11; `cast.posesMin`, `movement.poseKeys` | C | B 3.1 |
| 34 | Idle / bounce / head / hair / arms | `movement.*` | C | B 3.2 |
| 35 | Walking / running / sitting | §3.10 "phase from distance" | **M** — no walk cycle, stride, step frames, sit, or whole-figure rotation | B 3.3, E 4.1 #7 |
| 36 | Blink and reaction timing | `cast.blink`; §3.20 prose | P — blink complete; reaction 0–3 frames after the word is prose only, no record | E 4.1, 0046, J 2.8 |
| 37 | Hand anchors / contact | §3.20; `interaction.grip` | P — grip 11 px exists; no anchor list (`handL/R`, `elbowL/R`, `wristL/R`, `footL/R`, head, ground) and no "return, never re-derive trig" rule | B 3.4, B 9.4 #17 |
| 38 | Crowd behaviour | `cast.chorus`; `interaction.crowd` | P — no crowd count, scale, phase ladder, arm-raise rule, phone-light rule; "frozen except on cue" is the only record | A 6, B 4.3 |
| 39 | Sound mode / loudness | §3.21; `sound.modes`, `sound.voice` | C | A 11, G |
| 40 | SFX cues | §3.21; `sound.cueKinds`, `cueDensity` | C — no event-vs-bed distinction and no ±frame tolerance | A 11, E 4.1 #6, HF sound |
| 41 | Music | §3.21; `sound.song` | P — the song values are reference-only and music is parked; no bed level or loop rule | C 8, G #14 |
| 42 | Narration wpm / coverage | §3.22; `voice.*` | C | 0043, 0044, J 2.1 |
| 43 | Voice register / style | §3.22 "Style" column | P — "conversational, dry, sentence-final fall" is prose; no `voice.register` enum | J 2.1, G #31 |
| 44 | Song vs narration | `sound.modes`; `sound.song` scope I | P — the song record is invariant, so a 30 s voiced film must satisfy a 156 s song's LUFS and word count | C 7, G #14, G #16 |
| 45 | Transition kinds / shares | §3.17; `edit.transitions` | C — but the shares are not a partition (min sum 95, max 140) | A 7, B 7 |
| 46 | Transition duration / geometry | §3.17 table | P — iris .17–.44 s/r 8–1500/feather 26–120, flash .14–.44/α .22–1, wipe .13–.30 are markdown-only | A 7, F 2.3 |
| 47 | Text families / sizes | §3.19; `type.families`, `display`, `body`, `subtitle`, `label`, `sticker`, `monogram` | P — no file names or licences; `circular` and `vertical` sizes missing; no 390 px floor | A 8.1, J 2.4 |
| 48 | Text boxes / safe / underline | §3.19; `type.subtitleBox`, `maxLines`, `maxBoxes`, `underline` | C | A 8.6, G #26 |
| 49 | Text behaviour / animation | §3.19; `type.behaviours`, `appear`, `movement.stagger` | P — no exit rule, no per-role enter, no ease-by-role | A 8, J P0 #1 |
| 50 | HUD / print furniture | §3.19 HUD row; `medium.printMarks` | P — no `hud.*` group at all; no barcode/folio; no meter record; no red threshold | A 10, B 1.4 |
| 51 | Element interaction | §3.20 | P — reaction, motif pulse, contact point, interaction type and prop-set contact are prose only | B 10.3, J 2.8 |
| 52 | Assets / props standards | §3.12; `props.sizeClass`, `grip`, `motifRecurrence` | P — no file/name/licence, no worn-prop rule, no prop text size, no contact rule, no face-occlusion rule | B 6, G #17, AGENTS assets:check |
| 53 | Motifs | §3.13; `motifs.library`, `perFilm`, `uses`, `maxShotShare` | P — the 13-motif table's material, role and construction are reduced to a name list; no meaning field, no pulse record | B 8.1 |
| 54 | Opening / closing | §3.23; `opening.*`, `closing.*` | P — "3 openings/3 closings" in §2 vs 4/4 in §3.23; "subject-specific" has no measure | B 7, J P0 #6 |
| 55 | Variation / anti-copy | §3.24; `variation.*` | P — §3.24 has 10 axes, JSON has 8; no `previousFilm` artefact; no closing/sound/transition difference | §3.24, D #3 |
| 56 | **Determinism** | §3.2 one sentence "grain seeded"; `medium.grain.seeded` | **M** — no seed policy, no hash, no purity rule, no worker-safety, no camera reset. A 11 is a full page; AGENTS rule 1 is non-negotiable | A 11, B defect 1 |
| 57 | 9:16 | `envelope.aspectVertical` one rule; §9 open question 6 | **M** — no vertical composition, type, platform bands or safe area; the pack already has 38 9:16 boxes | J P0 #11, G #26 |
| 58 | Reusable code values | 251 JSON records | P — the core bands are missing; a dozen duplicate ids; several records are one film's content; §8.3 bans a 200-field schema the JSON already exceeds | D 4.1, G 5.1 |
| 59 | Forbidden moves | §3.25; `forbidden.list` | P — the list omits 3D orbit, prop through body, glass panel, floating foot, pan with from=to, same set family, radial blur | §3.25, B 11 |
| 60 | Measurement / gate | §5.1 | P — 26 axes have a measure string; no command, no fail-closed rule, no null handling | G 3.1, G #20 |

**Count:** C 23, P 33, M 4. The four missing are per-element light/shadow (one row here), walking/sitting, determinism and 9:16. Split the first into five element shadows and the fourth into composition and type, and the count is six. Everything else is present but not machine-complete.

---

## 2. What A–J contain that the spec does not

Ranked by how much it would change the next film. "Fix" gives the record the JSON should carry.

| # | Evidence item | Where | Why it matters | Fix |
|---:|---|---|---|---|
| 1 | **Five element shadows, not one** | A 4: limb +3/+5 α.14; face +2.5/+4.5 α.14; hair +2.5/+5 α.16; petal +1.5/+3 α.13; contact r .065 h .014 α.22 | The user asked for "lighting per element". One shadow makes a face, a petal and a boot share a weight they do not have in the film | `light.elementShadow {limb, face, hair, petal, boot, contact}` |
| 2 | **Spotlight and glow are light sources, not exceptions** | A 4: spotlight len 820–1150, w0 30–40, w1 280–520, α .10–.18; 5 glow calls blur 12–34 | §3.4 lists them but the JSON has no record; a film can add a 200 px bloom and pass | `light.practical {spotlight, glow, maxGlowCalls 5}` |
| 3 | **Determinism is an identity rule, not a defect note** | A 11: hash, no global seed, grain unseeded, 4 workers → 4 grains; B defect 1: CAM is module-global and 24/51 shots inherit it | AGENTS non-negotiable 1. The spec mentions the grain once and never the camera state | `determinism {seed, hash, grainSeeded, clockPure, workerSafe, cameraReset}` |
| 4 | **The film is cut on the voice, not the beat** | A 9: 92% lyric boundary, 11/61 on the 88 BPM grid; C 1.4; §3.15 says it in prose | This is the edit's identity. The JSON only has `cutOnWord [.80,.95]`; no `beatQuantised:false`, no "the voice is the clock" | `edit.clock {source:"voice", beatQuantised:false, cutOnWord:.80-.95}` |
| 5 | **The motivated exit is the cut signature** | C 5: "the film's signature is not the transition; it is the motivated exit — the cut lands inside an action that crosses it" | The spec has transition shares but no carrier and no "cut on action". This is the difference between a slideshow and a film | `edit.motivatedExitShare [.6,.9]`; `shots[].transitionOut.carrier` |
| 6 | **Match-cut tolerances exist and are measurable** | F 5.3: silhouette IoU .80, scale .90–1.11, angle 5°, direction dot .90 | The spec names match cut and gives it 5–10%, but no target; G #23 calls it "a name with no target" | `edit.matchCut {iou, scale, angleDeg, directionDot}` |
| 7 | **A second principal is a second rig** | B 2.6: Mira has different hip/shoulder/head numbers, no headTurn, no hairSwing, no wrist brad; "two people are two rigs, not one rig with two skins" | The spec's "what may change" list omits proportions and rig variant, so a Mira-like co-lead is forbidden by omission | `cast.rigVariants {max:2, sameJointCount:true}`; add proportions to the allow list |
| 8 | **The cast is in 91% of shots** | I I1: 49/54; G says the current gate only checks ≥50% staged | The spec's own §7 says "the cast is the film", but there is no presence record. A film with one character in two shots passes | `cast.presentShareMin .85` (or .91) |
| 9 | **Colour script per act is a choice with rules** | §3.3, I 5: 54 distinct fields, in 20 / kraft 9 / orange 7 / red 6 / green 3 / acid 2 / pink 2 / cream 2 / blue 1 / oxblood 1 / teal 1 | The spec says "declare it in `score.paletteScript`" but neither the spec nor the score schema has the field. This is a named user dimension | `palette.script {acts 3-5, warmMin 2, blueMax 1, noRepeatConsecutive, arc, declaredIn}` |
| 10 | **88 BPM is how "on the beat" is defined** | A 6: beat `(t-.21)/(60/88)`, triplet 132, `bpmPulse` decay 4, flower pulse ±4.5% | The spec mentions a motif pulse of 4.5% but never the clock that produces it. Character bounce, sway, crowd bob and petal pulse all read it | `motion.beat {bpm 88, offset .21, triplet 132, pulseDecay 4}` |
| 11 | **Crowd is staged, not ambient** | A 6: crowd bob `max(0,sin(beatπ+i.6))·10`, every 3rd raises an arm, every 5th holds a phone light; B 4.3: 5 backing, 9 finale, 110–330 px spacing | The spec has `interaction.crowd` "frozen except on cue" and a chorus count; no behaviour, spacing or scale | `cast.crowd {count 0-5, scale .50-.68, phase .14-.20, armEvery 3, phoneEvery 5}` |
| 12 | **Sets fake depth with scroll rates** | B 5.3: sun .25×, houses 1×, fences 1×; finaldance orbit ±50; A 5: no per-layer factor | The spec's `parallax` is false or a 3-plane variant. The source's actual mechanism — different scroll inside one camera — is absent | `sets.scroll {bg, mg, fg}` or `camera.parallaxMode:"multi-rate-scroll"` |
| 13 | **Props are character-scaled and licensed** | B 6: mug 30×34, held at hand; G #17; AGENTS `assets:check` wants file, name, licence and a size | `props.sizeClass` is % of frame height; a 30% prop on a 55% character is not the same object as a 30% prop on a 92% character. No licence/file record | `props.standard {file, name, licence, sizeClass, scaleTo:"character"}` |
| 14 | **Motif material and meaning** | B 8.1: 13 motifs with construction and counts; §3.13 says "meaning must be declared" | The JSON has 13 names. A checker cannot tell a sunburst from a paperclip, and `meaning` has no field | `motifs[].{material, roles, minUses, maxUses, meaningRequired}` |
| 15 | **First frame is the thumbnail** | J P0 #6; HF `first_frame_empty`; §3.23 says "never black, never a logo alone" | The record is a prose string. A frame with a 2% logo on cream passes "subject-specific" by eye and fails no check | `opening.firstFrame {coverageMin .10, noBlack:true, subjectSpecific:"review"}` |
| 16 | **9:16 platform bands** | J P0 #11: top 168 px empty, words 168–1330, decoration below 1330; G #26: 38 boxes in `tokens.layout` | One line in the spec; the product shape is vertical. A 9:16 film has no composition or type band | `layout.vertical {topEmptyPx 168, wordsTop 168, wordsBottom 1330, decorationBelow}` |
| 17 | **Voice register is not wpm** | J 2.1; §3.22 "conversational, dry, sentence-final fall" vs "sung, rhyming, dense" | 180–190 wpm can be an announcer or a dry talker. The register is the identity; it is prose | `voice.register {narrated:"dry-conversational", song:"sung-pop", bans:["announcer","sing-song"]}` |
| 18 | **Sound has event vs bed** | E 4.1 #6: an event is −6 dB under the voice, a bed is not reduced; HF: bed 0.14, hits 3–6 dB over bed, SFX peak one frame after picture | The spec's cue model treats every cue the same. A bed would duck itself | `sound.bed {levelDb, duckDb}, sound.cue {frameTolerance 1}` |
| 19 | **Paper "physics" is authored flutter** | A 6: no fold/curl/bend/collision; B 3.5: paper cuts pop, slam and snap, no anticipation | The spec's "one paper-physics event per shot" invents a mechanism the reference does not have and gives no vocabulary. A film can pass by declaring "flutter" three times | Rename to `motion.paperEvent {kinds:[flutter, tear, stamp, pop, shard, iris, flash], onePerShot}` |
| 20 | **HUD identity conflict** | A 10: `P(DOOM)` / `TOKENS/S`; H 5.1: "RUNNING 8.1%… with a sun icon" | The delivered film and the code read disagree on the HUD label and unit. The spec picks A without noting it. One of the two reports is wrong | Inspect a frame at 30 s; record `hud.ticker.label`, `.unit`, `.icon` |
| 21 | **Ease by role** | J P0 #1: arrival `expo.out`, camera `power2.inOut`, exit `power3.in`; `movement.easings` is a flat list | The spec allows four easings but no role binding. A film can use `backOut` on a camera and `linear` on a title | `movement.easeByRole {enter, move, exit, camera}` |
| 22 | **Null/missing bands pass silently** | G #20: `TokensSchema` is `.passthrough()`; a missing band makes `limit undefined` and the comparison `false` | The spec says "a missing band is an error" (§8.2) but the JSON has no `required` list and no fail-closed rule | `identity.required[]` and a check that `null` is a failure, not a skip |

---

## 3. The one-page table, row by row

The table at §2 has 30 rows and three columns: axis, value, scope. **It has no measure column.** So the answer to "does every row have a code value, a scope and a measure?" is:

- **value:** 26/30 rows carry at least one number or enum; 4 are prose-only.
- **scope:** 30/30.
- **measure:** **0/30 in the table**; §5.1 supplies a measure for 26 of the 30 axes, but not for composition's "one focal shape", interaction's contact, voice register or variation.

| Row | Axis | Code value? | Scope? | Measure in §2? | Flag |
|---:|---|---|---|---|---|
| 1 | Dimension | yes (`2.5D`, 5 planes) | I | no | §5.1 schema |
| 2 | Medium | **no — "cut/torn paper, fibre, halftone, ink, print marks"** | I | no | **prose-only** |
| 3 | Palette | yes (4–7, 40–90%, ≤20%) | I | no | §5.1 |
| 4 | Field | yes (full-bleed, 27%) | I | no | §5.1 |
| 5 | Light | yes (+6/+10, .22, 0) | I | no | §5.1 |
| 6 | Edge | yes (1.5–6 px) | I | no | §5.1 |
| 7 | Composition | **partial — "one focal shape", "centred", 97%** | I | no | **prose half** |
| 8 | Subject scale | yes (13–92, p50 55, 3 tiers) | I | no | §5.1 |
| 9 | Placement | yes (.30–.75, .38–.66, .65–.88) | I | no | missing "≥80%/≥70%" |
| 10 | Cast archetype | yes (enum, flower, brads, 8/14) | I | no | §5.1 |
| 11 | Cast appearance | **no — "3-layer hair; face plate; costume roles; no photo/fingers"** | I | no | **prose-only** |
| 12 | Cast movement | yes (11 keys, 12 fps, squash, blink) | I | no | §5.1 |
| 13 | Sets | yes (5 layers, 780–900, sky device) | I | no | sky is prose |
| 14 | Props | **partial — "paper + ink edge + shadow; hand anchor; size class"** | I | no | **no numbers in row** |
| 15 | Motifs | yes (3–5, 2–5, ≤40%) | F | no | §5.1 |
| 16 | Camera model | yes (2D similarity, x/y/z/roll/shake) | I | no | §5.1 |
| 17 | Camera grammar | yes (90%, 35–45%, 4–6, ≤2) | I | no | §5.1 |
| 18 | Camera travel | yes (dz .03–.25, crash .5–3, pan 24–600, roll ±7) | I/F | no | §5.1 |
| 19 | Edit | yes (2.86–3.06, 19–20, chorus 1.6–2.2) | I | no | §5.1 |
| 20 | Shot distribution | yes (30/45/2–4/8%) | I | no | §5.1 |
| 21 | Per-shot action | **partial — "1–3; one hero; one physics event"** | I | no | "hero" and "physics" undefined |
| 22 | Transitions | yes (80–90/10–20/0–10) | I | no | §5.1 |
| 23 | Focus/depth | **no — "no DOF, blur or bokeh"** | I | no | **prose-only** (the X list is code) |
| 24 | Text | yes (2 systems, 8 words, 31 px) | I | no | §5.1 |
| 25 | Text behaviour | yes (enum) | F | no | §5.1 |
| 26 | Interaction | **no — "hand anchor; ground contact; type never over face"** | I | no | **prose-only** |
| 27 | Sound | yes (–14, silence) | I | no | §5.1 |
| 28 | Voice | yes (180–190, 90–100) | I/F | no | §5.1 |
| 29 | Opening/closing | **yes but wrong: "3 openings/3 closings"** | F | no | **§3.23 has 4/4** |
| 30 | Variation | **yes but wrong: "8 required differences"** | I | no | **§3.24 has 10** |

**Prose-only rows:** 2, 11, 23, 26 (and 7, 14, 21 are half-prose). The fix is not to delete the prose; it is to add the value and the instrument to the row, or to mark it `review-only` so no checker pretends to test it.

**Two factual errors in the table:** row 29 (3 vs 4 opening/closing types) and row 30 (8 vs 10 variation axes). These are the same contradictions as §3.23 and §3.24 below.

---

## 4. JSON vs markdown: which records are missing

The spec says "the identity is a flat list of parameter records, so a checker can read one value without knowing the prose" (§4.1). The JSON has **251 records**. The following tables have rows with **no record**. This is the list to add.

| Markdown table | Rows with no record | Add |
|---|---|---|
| §3.1 envelope | `encode` (libx264 crf 15, slow, tune film, yuv420p; AAC 320k); `frame` 4,699; `unit` px at z=1 | `envelope.encode`, `envelope.frameCount`, `envelope.unit` |
| §3.3 colour script (prose) | the 3–5 field sequence, the warm/blue rule, "no repeat in the same position" | `palette.script` |
| §3.4 light | `spotlight` (α .10–.18, len 820–1150, w0 30–40, w1 280–520); `glow` (blur 12–34) | `light.practical` |
| §3.5 edge | `cut edge colour` cream or ink; `silhouette reads at 390 px` | `edge.cutColour`, `edge.read390Px` |
| §3.7 placement | `outer 10% rule` | `composition.outerBandMax` |
| §3.8 sets | `sky` (2-stop + one device + one texture) | `sets.sky` |
| §3.9 cast | `foot`; `head ornament` slot list; `face` geometry; `garden` 5 tones; `palette roles`; `joints` count is 11 in prose but 13 in the list and JSON | `cast.foot`, `cast.ornament`, `cast.face`, `cast.garden`, `cast.paletteRoles`; fix `joints` |
| §3.10 appearance | `torso origin`; `torso construction`; `far-side shade`; `costume colours`; `walk/run` | `cast.torso`, `cast.shadeDelta`, `cast.costumeRoles`, `movement.walk` |
| §3.12 props | `prop material`; `worn prop`; `prop text` 9–24 px; `prop contact`; `face occlusion` | `props.material`, `worn`, `text`, `contact`, `occlusion` |
| §3.13 motifs | 13 rows of material, role, mandatory; the "3+ uses" and "≤40%" are present only as global rules | `motifs[].{material, role, minUses, maxUses}` |
| §3.14 vocabulary | `travel` for push/pull (.03–.25), crash (.5–3), pan (24–600), tilt (18–400), track (100–800), orbit (dz .05–.12, arc 10–40°), whip (300–900), handheld (0–12 px) | `camera.travel` |
| §3.14 travel | `shake` 71/63 rad/s, y ratio .7, decay 0; `camera anchor` 960/540 | `camera.shake`, `camera.anchor` |
| §3.15 bands | the 30/45/60/156 s table (shots, median, min, max, cuts/min) | `edit.byFormat` |
| §3.17 transitions | iris .17–.44 s r 8–1500 feather 26–120; flash .14–.44 α .22–1; wipe .13–.30; match cut silhouette/scale/angle/direction | `edit.transitionDetail`, `edit.matchCut` |
| §3.18 focus | radial blur, tilt-shift, chromatic aberration; `depth mechanism` | add to `forbidden.list`; `focus.mechanism` |
| §3.19 families | font file names and licences | `type.files`, `type.licence` |
| §3.19 sizes | `circular` 24–26; `vertical` 72 | `type.circular`, `type.vertical` |
| §3.19 treatment | `wrap` single line / manual stack | `type.wrap` |
| §3.19 subtitle | panel fill/tear/shadow; `LYRIC` label; rec dot; visible window start −.02 / end +.35; max chars 54; bottom band 12–14% | `type.subtitlePanel`, `type.subtitleWindow` |
| §3.19 layout | HUD position 1634/40, 246×96; display/subtitle position rules; enter on word | `hud.ticker`, `type.enter` |
| §3.20 interaction | reaction 0–3 frames after the word; motif pulse ≤4.5%; contact point; prop-set contact | `interaction.reaction`, `motifs.pulseMax`, `interaction.contact` |
| §3.21 sound | event vs bed; cue frame tolerance; song is reference-only | `sound.bed`, `sound.cueFrameTolerance` |
| §3.24 variation | transitions and sound-mode differences (10 axes, JSON 8); previous-film input | `variation.axes` (10), `variation.previousFilm` |
| §5.2–5.3 bands | **all 18 bands**: luma mean 75–130; p5 20–60; p50 80–140; p95 160–200; contrast p5 175–210; saturation 12–35; sat p95 30–60; edges 7.5–17.5; palette ≤55; warm .40–.90; blue ≤.20; subject .13–.92; centroid .30–.75; local delta-L ≥20/35; blue-on-blue 0; bars ≤8%; cuts 16–24; median 2.4–3.2 | `identity.bands` + `identity.bands.basis` |

At table level, every table has at least one record; at row level, **20 tables contain at least one unrepresented row**, and two tables (§3.17's durations and §5.3's bands) have no record for their principal content. The largest single omission is §5.3: the document's central correction has zero records.

### 4.1 Provenance is wrong in the JSON

The spec says C is a comparison only, and the canonical numbers are in A and I (evidence index). The JSON then cites C for records C does not contain:

| Record | JSON source | C actually says |
|---|---|---|
| `edit.cutsPerMinute [16,24]` | "C 1 (19–20)" | 24.1 cuts/min (64-shot 720p film) |
| `edit.median [2.4,3.2]` | "C 1 (2.86–3.06)" | 2.045 s |
| `edit.p10 [1.2,1.8]` | "C 1 (1.58–1.64)" | 1.100 s |
| `edit.p90 [4.4,5.0]` | "C 1 (4.60–4.82)" | 4.000 s |
| `camera.pushPullShare`, `lateral`, `orbit`, `tilt`, `crash`, `staticMax` | "B 7 (21/53)" etc. | B has no camera-frequency table; the counts are A 5 / §3.14 |

The values are plausible; the citations are not. A reader cannot audit the chain. Re-point every canonical record to A §5–§7 or I §3; keep C only in a `comparison` field.

---

## 5. Internal contradictions and scope errors

These are not matters of taste; a checker built from the JSON would behave differently from the document.

| # | Contradiction | Where | Effect |
|---:|---|---|---|
| 1 | **Joints: 11 vs 13** | §3.9 says "11", then lists 13 (hip, waist, 2 shoulders, 2 elbows, 2 wrists, neck, head pivot, head centre, 2 ankles); JSON has 13 | A library with 11 passes the prose; a checker with 13 fails it |
| 2 | **Opening/closing: 3 vs 4** | §2 row 29 says 3/3; §3.23 lists 4/4; JSON has 4/4 | The summary is wrong |
| 3 | **Variation: 8 vs 10** | §0 and JSON have 8; §3.24 has 10 (adds transitions and sound) | A film can differ on 8 and repeat the transition/sound mode |
| 4 | **Max shot: 5.5 vs 6.2** | §3.15 30/45/60 s bands max 5.5; JSON `edit.max 6.2`; reference max 6.14 | A 6.0 s shot passes the JSON and fails the band |
| 5 | **Min shot: 1.2 vs 0.6** | §3.15 short bands min 1.2; JSON `edit.min 0.6`; reference min 0.66 | A 0.7 s scene passes the JSON and fails the short band |
| 6 | **p10: 1.2–1.8 vs reference 1.58–1.64** | §5.1 and JSON | Fine as a band, but the JSON cites C, which says 1.10 |
| 7 | **Transitions are not a partition** | `edit.transitions`: cut 80–90, iris 10–20, flash 0–10, wipe 0–5, match 5–10, hold 0–5; min sum 95, max 140 | A film cannot satisfy cut 90 + iris 20; a check must define whether these are shares of cuts or of shots |
| 8 | **Framing is not a partition** | `composition.framingMix`: wide 25–40, medium 10–25, close 40–55, extreme 0–10; min 75, max 130; boundaries overlap at 35/55/80 | The same shot can be classified two ways; a check cannot sum |
| 9 | **`subjectArea` is a p25–p75 band** | JSON [0.01,0.04]; I p25 .010, p50 .030, p75 .040, p90 .070, max .089 | 16% of the reference's own shots fail a band labelled invariant |
| 10 | **`negativeSpace` is a fixed 0.97** | JSON 0.97; a shot with 8.9% subject has 91.1% | The reference's own maximum fails |
| 11 | **Head-to-body vs head centre** | `cast.headToBody [7.0,7.5]` and "head centre .80–.92" | 7 heads puts the head centre at .929, not .80–.92; one of the two numbers is wrong |
| 12 | **Song records declared invariant** | `sound.song` (LUFS −15.6, 227 words, 46 lines) scope I; `edit.scenes 51`, `edit.visibleCards 54` scope I; `edit.chorus 1.58–2.20` I; `voice.songWpm` I | A 30 s narrated film cannot satisfy them. These are **reference** or **song-only** values, not invariants |
| 13 | **`camera.crashMax 8.0` is from the wrong film** | JSON source "C 2 (PDoom)"; the canonical A max is 3.55 | A crash to 8.0 is allowed by a value measured on the 720p comparison film |
| 14 | **Duplicate records** | `light.objectEdge` = `edge.object`; `light.typeEdge` = `type.edge`; `light.typeEdgeMin` = `type.edgeMin`; `light.typeShadow` = `type.shadow`; `props.grip` = `interaction.grip`; `movement.squash/overshoot/anticipation/freezeBudget/actionsPerShot` = `motion.*`; `edit.holdMax` = `motion.freezeBudget` | 13 values have two homes; they will drift |
| 15 | **251 records vs §8.3** | §8.3 says "do not add a 200-field schema that no check reads"; the JSON has 251 | The document contradicts its own minimal-change thesis |
| 16 | **HUD label** | A 10 `P(DOOM)` / `TOKENS/S`; H 5.1 `RUNNING 8.1%` + sun | The spec records A without resolving the frame evidence |

---

## 6. Over-detailed values that can be cut

The test: a number a film or a check will never use, whose removal does not change what a frame looks like as this channel. These are candidates, not demands.

| # | Value | Why it can go |
|---:|---|---|
| 1 | `medium.mottles` 90 / r 40–230 / α .035; `fibres` 4,200 / 2–24 / .4–1.3; `specks` 1,500 / .7–2.5 | Painter counts. A checker cannot see them; a new painter will not match them. Keep "fibre + mottle + speck at low alpha, 1024 sheet" |
| 2 | `medium.paperOverlay.offsetPx 0–159 at 2 Hz`; `grainOverlay 0–511 at 24 Hz` | Implementation cadence. Keep 2 Hz / 24 Hz; the offset range is derived from the sheet size |
| 3 | `medium.vignette.innerR 194.4`, `outerR 885.6` | Derived from strength .34 and the frame; keep the strength |
| 4 | `light.typeShadow.y .0385` | 1.1 × x; write `.035` and a 1.1 ratio |
| 5 | `light.shadowRatio 1.6–1.8` | Implied by +6/+10 (1.67); redundant |
| 6 | `palette.referenceDominant` 8 hex | Reference content, not a constraint; no film reads it |
| 7 | `composition.subjectWidth [.04,.142]` and `subjectArea [.01,.04]` | Derived from the bbox; the area band is p25–p75 and wrong as a pass band |
| 8 | `edit.scenes 51`, `edit.visibleCards 54` | One film's counts; scope error |
| 9 | `type.monogram 72–160` | One use in the reference; not a scale a film needs |
| 10 | `type.circular 24–26` / `vertical 72` | 2 and 1 calls; either add a use rule or cut |
| 11 | `camera.crashMax 8.0` | From the 720p comparison film; the canonical max is 3.55 |
| 12 | `cast.headToBody 7.0–7.5` | Contradicted by head centre; no check can use both |
| 13 | `edge.silhouetteP10 5.6` | I's own confidence is low–medium; keep as reference, not invariant |
| 14 | `medium.printMargin 26` at 9:16 | Format-specific; a vertical re-stage will not use 26 px |

If these are cut or moved to `status:"reference"`, the JSON falls from 251 to roughly 190 records, still above §8.3's "200-field" warning but closer to a checkable set. Better: add `status: "reference" | "check"` to every record and require a `measure` for `check`.

---

## 7. P0 — identity-defining, missing, cheap

| # | Missing | Exact fix | Source |
|---:|---|---|---|
| P0-1 | **Tone bands and `bands.basis` are absent from the JSON** | Add `identity.reference {film, surface}`; `identity.bands {basis:"film", lumaMean:[75,130], lumaP5:[20,60], lumaP50:[80,140], lumaP95:[160,200], contrastP5:[175,210], saturation:[12,35], saturationP95:[30,60], edges:[7.5,17.5], paletteDistanceMax:55}`; keep the five crop bands under `surface` | §5.2–5.3, G 5.1 #1–3, G 6.1 |
| P0-2 | **Per-element lighting** | Add `light.elementShadow {limb:[3,5,.14], face:[2.5,4.5,.14], hair:[2.5,5,.16], petal:[1.5,3,.13], boot, contact}`; `light.practical {spotlight, glow, maxGlowCalls:5}`; `score.shots[].light` enum | A 4, B 9.1 |
| P0-3 | **Determinism** | Add `determinism {seed, hash:"fract(sin(n*127.1+311.7)*43758.5453123)", grainSeeded:true, clockPure:true, workerSafe:true, textureHz:{paper:2,grain:24,type:12}}`; rule "camera resets per shot; no inherited CAM"; a check | A 11, B defect 1, AGENTS 1 |
| P0-4 | **Per-act colour script** | Add `palette.script {acts:[3,5], warmFieldsMin:2, blueFieldsMax:1, noRepeatConsecutive:true, arc:"intimate->loud->resolve", declaredIn:"score.paletteScript"}`; add `score.paletteScript[]` | §3.3, I 5, J |
| P0-5 | **Reaction timing** | Add `interaction.reaction {frames:[0,3], anchor:"measured-word", direction:"after"}`; keep `events[].word` | §3.20, 0046, J 2.8 |
| P0-6 | **HUD and print furniture as records** | Add `hud.ticker {x:1634,y:40,w:246,h:96,alpha:.92,fill:"ink",valueMin:8,valueMax:100,redAt:95,bar:[1790,86,70,6],ticks:6,flower:{c:[1840,62],r:7,petals:6}}`; `hud.meter {body:[88,420],tube:[34,330],ticks:11}`; `hud.print {margin:26,mark:16,alpha:.22,bars:4,timecodeFps:30,barcode:{bars:6,pitch:4,h:10}}` | A 10, B 1.4 |
| P0-7 | **Per-move camera travel / shake clock** | Add `camera.travel {staticCreepMax:.015, push:[.03,.25], pull:[.03,.25], crash:[.5,3.0], pan:[24,600], tilt:[18,400], track:[100,800], orbit:{dz:[.05,.12],arcDeg:[10,40]}, whip:[300,900], handheld:{px:[0,12]}}`; `camera.shake {freq:[71,63], yRatio:.7, decay:0}`; `camera.anchor:[960,540]` | §3.14, A 5 |
| P0-8 | **Transition partition, geometry, match cut, motivated exit** | Add `edit.transitionShares` as a partition (or counts); `edit.transitionDetail {iris:{s:[.17,.44],r:[8,1500],feather:[26,120]}, flash:{s:[.14,.44],alpha:[.22,1]}, wipe:{s:[.13,.30],strokes:5,rot:-.1}, holdMax:2}`; `edit.matchCut {iou:.80, scale:[.90,1.11], angleDeg:5, directionDot:.90, carrierRequired:true}`; `edit.motivatedExitShare:[.6,.9]`; score `transitionOut.carrier` | §3.17, F 5.3, C 5, G #23 |
| P0-9 | **Scope purge** | Re-scope `sound.song` to `appliesTo:"song"`; `edit.scenes`/`visibleCards` to `reference`; `edit.chorus`/`voice.songWpm` to `appliesTo:"song"`; `camera.crashMax` to `reference` or delete; add `appliesTo` to the schema | A 7, C 1, G #14/#19 |
| P0-10 | **Cast presence** | Add `cast.presentShareMin:.85` (reference .91); add `composition.centroidXShareMin:.80`, `floorShareMin:.70` | I I1, I I4–I6, G 3.2 |
| P0-11 | **Fail-closed identity block** | Add `identity.required[]` and a rule: a missing or `null` band is a failure, not a skip; `styles/paper-kpop/tokens.json` validates `identity` | §8.2, G #20 |

---

## 8. P1 — sharpens the channel, needs a decision

1. **9:16 bands.** Add `layout.vertical {topEmptyPx:168, wordsTop:168, wordsBottom:1330, decorationBelow:1330, subjectHeight:[.20,.75], typeScale:1.35}`; source J P0 #11 and the pack's 38 boxes. Without it, a vertical film is unchecked. This becomes P0 the day the next film is 9:16.
2. **Provenance.** Re-point the ten `C 1` / `B 7` citations to A §5–§7 and I §3; keep C only under `comparison`. The values are right; the audit trail is wrong.
3. **Beat and pulse.** Add `motion.beat {bpm:88, offset:.21, triplet:132, pulseDecay:4, flowerPulse:.045}`; state that cuts do not snap to it.
4. **Crowd.** Add `cast.crowd {min:0,max:5,scale:[.50,.68],spacingPx:[110,330],phase:[.14,.20],armEvery:3,phoneEvery:5,frozenExceptCue:true}`.
5. **Motifs.** Replace the name list with `motifs[] {id, material, roles, minUses, maxUses, meaningRequired, pulseMax:.045}`; add `score.motifs[]` and `score.shots[].motif`.
6. **Sets.** Add `sets.sky {stops:2, device, texture}` and `sets.scroll {bg,mg,fg}`; allow the multi-rate scroll the film actually uses.
7. **Assets/props.** Add `props.standard {name, file, licence, sizeClass, scaleTo:"character"}`; `props.worn {space:"head-local", behindFaceIfHalo:true}`; `props.text {minPx:9,maxPx:24}`; `props.contact {shadow:"ellipse-or-paper"}`; `props.occlusion {onlyWhenGag:true}`.
8. **Anchors and rig variants.** Add `cast.anchors [handL,handR,elbowL,elbowR,wristL,wristR,footL,footR,head,ground]`; a rule "a prop is placed from an anchor, never re-derived trig"; `cast.rigVariants {max:2, sameJointCount:true}`; add proportions to the "may change" list.
9. **Proportions.** Replace the contradictory pair with `cast.proportions {headCentreY:[.88,.93], hipY, shoulderY, thighLen, shinLen, upperArm, forearm}` and a single `heads` value derived from them.
10. **Walk / run / sit / mood.** Add `movement.walk {stridePx, stepFrames:[9,12], bobPct:[.03,.07], leanDeg:[1,7], phase:"distance"}`, `run`, `sit`, `mood {keys, blendFrames:[2,4], blinkHidesSwap:true}`.
11. **Expression vocabulary.** Add `normal`, `smile`, `spiral` to the must-include list; `cast.expressionMap {eye, brow, mouth}`; a 14-face minimum as faces, not combinations.
12. **Type.** Add `type.files`, `type.licence`, `type.floor390Px:14`, `type.circular`, `type.vertical`, `type.wrap:"single-line"`, `type.subtitlePanel`, `type.subtitleWindow`, `type.enter {on:"word", duration}`, `type.exit`.
13. **First frame / poster.** Add `opening.firstFrame {coverageMin:.10, noBlack:true, subjectSpecific:"review"}`; `variation.posterShot` (an id, not a count).
14. **Variation.** Make the JSON 10 axes, add `variation.previousFilm` (id + hash) and a `variation.report` artefact; add `closingDiff`.
15. **Voice register.** Add `voice.register {narrated:"dry-conversational", song:"sung-pop", bans:["announcer","sing-song","rising-terminal-every-line"]}`.
16. **Sound.** Add `sound.bed {levelUnderVoice, duckDb:8}`, `sound.cueFrameTolerance:1`, `sound.eventUnderVoiceDb:-6` (already in `sound.voice`), and the "no music until unparked" rule as a status, not prose.
17. **Forbidden list.** Add `radial-blur`, `3d-orbit`, `glass-panel`, `floating-foot`, `pan-from-eq-to`, `same-set-family-twice`, `prop-through-body`.
18. **Camera vocabulary vs frequency.** Add `roll/warp` and `transition micro` to the vocabulary or remove them from the frequency table; add `whip`, `handheld`, `pan` and `roll` shares.
19. **One focal shape / one idea.** Add `composition.focalCount:1`; a `shots[].oneIdea` boolean or a `motion.hero` id.
20. **Background edge.** Add `edge.set` and `edge.field` widths; `edge.cutColour` cream/ink; the 3× figure/field edge-density ratio from §5.1.
21. **Per-format edit.** Add `edit.byFormat` with the §3.15 table (shots, median, min, max, cuts/min) and make `edit.min/max` format-dependent.
22. **Composition bands.** Change `subjectArea` to the full range [0.008,0.089] or a p10–p90 band; change `negativeSpace` to "subject area 1–9%, rest air" rather than a fixed 97%.

---

## 9. P2 — worth knowing, not blocking

1. **251 records vs §8.3's 200-field warning.** Add `status:"reference" | "check"` and require a `measure` for `check`. The spec should practise the minimalism it preaches.
2. **Duplicate ids** (a dozen pairs). Keep one home: `edge.*` for geometry, `light.*` for the shadow that follows it; `movement.*` for pose, `motion.*` for the shot.
3. **`camera.crashMax 8.0`** is from the 720p comparison film. Either delete it or label it `comparison`.
4. **`type.reading` and `sound.silence` are formula strings**, not values. A checker must parse them; store `{base:1.8, perWord:0.6, lastMin:2.0}` and `{dbfs:-50, reasonRequired:true}`.
5. **`cast.hand 18×26`** is in world units at s=1, but the record's unit is `px`. State `world px at s=1` or a ratio of height.
6. **`edge.silhouetteP10 5.6`** is low-confidence in I. Move to `reference`.
7. **`opening.types` 4 vs the table's 3.** Fix the table.
8. **`variation.requiredDifferences` 8 vs §3.24's 10.** Fix one.
9. **`cast.joints` 11 vs 13.** Fix one.
10. **The HUD label conflict** (`P(DOOM)` vs `RUNNING`). Inspect a frame; record the truth.
11. **12 Hz boil on type.** The spec applies `type.boilHz 12` to all type; J warns that a world line or UI label must not boil. Decide whether the subtitle/HUD is exempt.
12. **`medium.printMargin 26` at 9:16** and `type.subtitle 31` at 9:16. Make them format-owned.

---

## 10. What is genuinely complete

To be fair, the following are stronger than most style documents:

- **Dimension and medium** are named as a model, not an adjective, with the forbidden alternatives (FOV, DOF, perspective, parallax) enumerated.
- **Palette roles and shares** are measured, with a p25/p50/p75 table and the blue-on-blue rule that the Uber film fails.
- **Composition and scale rhythm** are measured from 49 character shots, with the sd and tier count that make "a sticker" a failure.
- **Cast construction** is a contract: joints, brads, taper, hand, hair, face, 8 poses, 14 expressions, scale ladder.
- **Camera model and vocabulary** are explicit, with a 10-move list, a frequency table and a "no gap" rule.
- **Edit rhythm** is bimodal and measured; the 2.86–3.06 s median, the chorus/verse split and the cut-on-word rule are the channel.
- **Text** is the best-specified axis: families, sizes, tracking, jitter, edge, shadow, subtitle box, underline, reading time, lyric-wall ban.
- **Sound and narration** carry the studio's measured targets (−14 LUFS, ≤−1.5 dBTP, 180–190 wpm, 0.8 coverage) and the reference's sung values.
- **The five failures of the Uber film** are named with numbers, not opinions, and the minimal-change path (nine fields, no new tool) is credible.

The missing pieces are not a failure of research. They are the difference between a document that *describes* a channel and one a checker can *refuse* a film with.

---

## 11. Score and sign

**Completeness: 7.0 / 10.**

- + All 20 user dimensions are addressed.
- + 251 records, 48 tables, an evidence index and a measured gap analysis.
- + The surface-vs-grammar reference split is the right structural idea.
- − The tone bands that the document itself calls P0 are absent from the JSON.
- − Per-element lighting, determinism, 9:16 and per-act colour script are missing or prose-only.
- − Continuity (motivated exit, match cut, cut-on-action) is under-specified.
- − 16 internal contradictions/scope errors, a dozen duplicate records, and a 251-record file that violates §8.3.
- − Provenance cites C for values C does not contain.

**SIGN: no.** The P0 list (11 items) is cheap and local; after P0-1 to P0-11 and the P1 items on continuity, 9:16 and sound scope, this becomes an 8.5–9/10 identity contract. It should not be implemented as a gate before then, because a checker built from the JSON would pass a film that fails the document and fail a film that follows it.

**The single sentence:** the spec knows what the channel is; it does not yet carry every value a machine needs to prove it, and the four values it most needs — tone bands, per-element light, determinism and the per-act colour script — are the four the user named.
