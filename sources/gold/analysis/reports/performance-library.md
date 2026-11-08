# Performance library — the face and pose vocabulary the short is missing

**Scope.** Read: `films/understudy/vendor/characters.js` (`idol` 399–604, `mira` 617–803, `face` 190–320, `drawArm` 559–593, `drawLeg` 460–474, `solveLeg` 55–68), `films/understudy/cast/nova.poses.json`, `mira.poses.json`, `films/same-alarm/cast/kiran.poses.json`, `vaz.poses.json`, `proofs/kpop-test/test-scenes.js` (all 9 scenes), `proofs/kpop-test/test-words.js`, `sync.json`, the gold `src/characters.js` and `src/scenes/act1.js`–`act5.js`, the gold sheets `out/analysis/shots-15/` and the short's `proofs/kpop-test/out/shots-15/`, and reports A–L (especially J-rig). No source or film file was edited.

**Verdict.** The short does not have a density problem in the face keys — it has a **vocabulary** problem and a **staging** problem. It writes 2–4 face keys per shot, but **10 of those keys use expressions the rig does not have** (`wide` and `tender` on Nova, `narrow` and `tender` on Mira), so they silently fall back to the default face. It uses **0 of the 16 named poses**; every pose is an inline edit of `IDLE_NOVA`/`IDLE_MIRA`. The blink is passed to the wrong object in 6 places and never renders. The walk slides because the feet never leave `y = −39`. Seven of nine shots contain a staged character static for more than 1.5 s in face or pose, against the gold's stated 0.5–1.5 s standard.

**Density is a rate, and it only counts if it is readable.** The gold's benchmark, from the act reports, is one pose or expression change every **0.5–1.5 s per staged character** (A.md:169, C.md:131, L.md:35/236). The short's mean shot is 2.77 s against the gold's 3.07 s, so 2–4 face changes and 2–3 pose changes per shot is the right budget. But a face beat only reads when the head is at least ~70 px tall on the 1080 frame. In the short the head is 60 px in s2 (the stage is drawn at 0.58 inside a 1.06 camera) and ~95 px in s9; in the gold's dance1 it is ~200 px. s2 and s9 should promote face beats to body beats or push in.

| | gold | short |
|---|---|---|
| shots / seconds / mean | 51 / 156.62 / 3.07 | 9 / 24.90 / 2.77 |
| face keys per shot (lead) | 1–2 authored + continuous bounce/blink | 2–4 authored, 10 invalid |
| pose changes per shot (lead) | 1–2 authored + continuous bounce | 0–3, **0 named** |
| change interval | 0.5–1.5 s | 0.4–3.7 s; **7/9 shots > 1.5 s** |
| named poses used | inline by design | **0 of 16** |
| head height on 1080 | 150–250 px | 60–157 px |

---

## 1. The clean rig's face vocabulary

`face()` reads only `o.face`. The idol and Mira are different faces; a value that exists on one may not exist on the other. There is **no validation**: an unknown `eyes` falls through to the almond eye, an unknown `mouth` falls through to the smile. That is why `wide` on Nova looks like `normal`, and `tender` looks like `normal`.

### 1.1 Idol (`Nova`, `idol`) — `eyes`

| value | what it looks like | use |
|---|---|---|
| `normal` (default) | almond sclera, brown iris (`f.iris`, default `#4A2A18`), black pupil, two highlights, pink eyeshadow haze, upper lash + flick, lower lash | neutral, listening |
| `closed` | one downward arc per eye (`‿ ‿`), 3 px ink | breath, bow, held note, sleep |
| `happy` | the closed arc plus a second arc below it — a `^ ^` squint | joy, laugh, applause |
| `wink` | screen-left eye closed arc; screen-right eye a filled ink almond with a white dot | mischief, "you", a shared joke |
| `heart` | a red heart with an ink outline, 10.5 units | love, the star, a reunion |
| `star` | a 5-point ink star with a cream dot | awe, stage light, the name lands |
| `swirl` | an ink spiral, 26 segments, ~13 units | dizzy, panic, overwhelm |
| `narrow` | a flat ink ellipse with a white glint — a slit | suspicion, deadpan, "really?" |
| `x` | an ink cross | fainted, dead, a joke beat |
| `spiral` | a red-brown spiral (`PAL.redD`), 34 segments, tighter than `swirl` | hypnotised, losing it |

`blink > 0.5` **overrides any of the above** with the closed arc for that frame. That is the only way to blink a `star` or `heart` eye.

### 1.2 Idol (`Nova`) — `mouth`

| value | what it looks like | use |
|---|---|---|
| `smile` (default) | small filled smile with a white lower-lip glint | warm, default |
| `grin` | wide open half-circle with a white tooth bar | big laugh, cheer, "yes" |
| `o` | small round open mouth, 4.2×5.2 | surprise, "oh", the light |
| `flat` | a straight 11 px line | deadpan, waiting, reading |
| `pout` | small red oval with a highlight | sulk, mock anger |
| `wobble` | a wavy line | upset, about to cry, worry |
| `sing` | open ellipse, height `lerp(2, 8.5, sing)`, dark red with a pink tongue and a white glint | singing |

### 1.3 Safe numeric ranges (idol and Mira)

| key | range | what it does | failure mode |
|---|---|---|---|
| `blink` | **0 or 1** | `> 0.5` closes the eye; 0.5 is still open (strict `>`) | 0.51 and 1 are identical; use 1 for 2–3 frames at 30 fps |
| `sing` | **0 … 1** | `mouth:'sing'` or `sing > .25` opens the mouth; `open = lerp(2, 8.5, sing)` | below .25 no effect unless `mouth:'sing'`; >1 clamps |
| `look` | **−1 … +1** each | iris offset `[x·3.6, y·2.8]` inside a 9 px iris | only the almond eye reads it; beyond ±1.4 the iris clips at the lash |
| `blush` | **0 … 0.9** | `globalAlpha = blush·0.55`; 0 turns it off | not clamped by the rig; >1.2 washes the cheeks |
| `browY` | **−3 … +3** px | moves both brows; **positive = down** (determined), **negative = up** (surprised) | the short never uses it |
| `browL`, `browR` | **−3 … +3** px | one brow only; a wink or a question | — |
| `browW` | **1.6 … 2.6** | brow weight | — |
| `iris` | any CSS colour | iris colour | — |
| `brows:false` | boolean | removes the brows | — |

### 1.4 Mira's face is smaller and different

Mira's `face` supports only **`dot` (default), `closed`, `star`, `swirl`, `wide`, `happy`**. She has **no** `normal`, `wink`, `heart`, `narrow`, `x`, `spiral`; `normal` and `narrow` fall to `dot`. `look` only moves the iris in **`wide`**. Her mouth supports **`smile` (default), `o`, `flat`, `wobble`, `grin`** — she has **no `sing` and no `pout`**, and her mouth code never reads `sing`. A Mira "singing" is a smile. If Mira must sing, use `mouth:'o'` and a small head bob; do not write `sing`.

The short gets this wrong at s3:1040 (`eyes:'narrow'` on Mira → `dot`) and s4:1122 and s5:1189 (`eyes:'tender'` on Mira → `dot`).

### 1.5 The idol has no `wide`

`wide` is Mira's white-circle eye. On the idol it is **not a case**, so it falls to the almond `normal`. The short writes `eyes:'wide'` on Nova at s1:875, s2:954, s4:1104, s5:1178, s6:1269, s8:1409 — six keys that were meant to widen her eyes and do not. Use **`star`** for "the light finds her", **`heart`** for "the star", **`narrow`** for "suspicious", **`closed`** for "breath".

---

## 2. The pose vocabulary

### 2.1 Nova — 8 poses (P1–P8)

All numbers are radians, `[a1, a2]`, in the vendor convention: **`armL` positive = out-left, `armR` negative = out-right**. Hand positions are computed from shoulder (±45, −516), upper 104, lower 88, hand +12 along the forearm; they are in rig space, ground = 0, head centre −604. The face box is `x ±49, y [−670, −538]`.

| # | name | params (arms / feet) | hands | what it is for | 30 s reel? |
|---|---|---|---|---|---|
| P1 | `idle` | armL `[.25,.05]`, armR `[−.25,−.05]`, footL `[−36,−39]`, footR `[36,−39]` | L −100,−320 · R 100,−320 | neutral stand, breath | **yes** |
| P2 | `reach` | armR `[−1.43,−.12]`, armL `[.2,.05]`, headTurn −.18 | R 248,−499 | right hand up/out, reaching right | **yes** |
| P3 | `point` | armL `[1.85,.45]`, armR `[−.35,.25]`, lean .06 | L −220,−611 | left arm up/out, pointing left/up | **yes** |
| P4 | `turn` | armL `[2.15,.2]`, armR `[−2.15,−.2]`, sway −8 | L −203,−643 · R 203,−643 | both arms up in a V | **yes** |
| P5 | `lift` | armL `[2.35,.1]`, armR `[−.45,.35]`, footR `[32,−99]`, footPitchR −.35, bounce −26 | L −183,−666 | left arm overhead, right knee up — a jump/step | **conditional**: knee 1.46 rad, foot 60 px up; one shot only |
| P6 | `duet-left` | armL `[2.4,.3]`, armR `[−.5,.35]`, sway 8 | L −158,−683 | left arm overhead, right out — the duet half | **yes** |
| P7 | `duet-right` | armL `[.5,.35]`, armR `[−2.4,−.3]`, sway −8 | R 158,−683 | right arm overhead — the mirrored half | **yes** |
| P8 | `bow` | lean .4, headTilt .22, armL `[.15,.55]`, armR `[−.15,−.55]` | L −125,−337 · R 125,−337 | 23° stage bow | **yes** (a bow, not a floor reach) |

### 2.2 Mira — 8 poses (P1–P8)

Shoulder (±38, −448), upper 92, lower 78, hand +12; face box `x ±36, y [−560, −476]`.

| # | name | params (arms / feet) | hands | what it is for | 30 s reel? |
|---|---|---|---|---|---|
| P1 | `idle` | armL `[.3,.1]`, armR `[−.3,−.1]`, footL `[−28,−8]`, footR `[29,−8]` | L −100,−277 · R 100,−277 | neutral stand | **yes** |
| P2 | `step` | armL `[.6,.2]`, armR `[−.4,−.2]`, footR `[32,−26]`, footPitchR −.3 | L −155,−309 · R 125,−289 | right foot forward/lifted — the walk | **yes** (knee 0.90) |
| P3 | `point` | armL `[1.75,.4]`, armR `[−.4,.2]` | L −204,−514 | left arm up/out | **yes** |
| P4 | `turn` | armL `[1.2,.1]`, armR `[−1.2,−.1]`, sway −8 | L −210,−391 · R 210,−391 | both arms out | **yes** |
| P5 | `listen` | armL `[.9,1.2]`, armR `[−.3,.4]`, headTilt .15, headTurn .15 | L −188,−436 | left hand out at chest height, head tilt — the best reaction | **yes** |
| P6 | `duet-left` | armL `[2.2,.3]`, armR `[−.55,.3]` | L −166,−574 | left arm overhead | **yes** |
| P7 | `duet-right` | armL `[.55,.3]`, armR `[−2.2,−.3]` | R 166,−574 | right arm overhead | **yes** |
| P8 | `bow` | lean .4, headTilt .2, armL `[.15,.55]`, armR `[−.15,−.55]` | L −110,−288 · R 110,−288 | 23° stage bow | **yes** |

### 2.3 Safe arm / leg / foot ranges

From J-rig §3.3, adjusted for the **shipped** vendor hips (idol −306, Mira −272, not the proposed −315/−281):

| parameter | safe range | notes |
|---|---|---|
| `armL[0]` | **+0.05 … +2.55** | + = out-left; rest +0.14; T +1.57; V +2.0…+2.45 |
| `armR[0]` | **−2.55 … −0.05** | − = out-right; positive is a cross-body pose only |
| `armL[1]`, `armR[1]` | **−2.2 … +2.2** | elbow delta; `|a2| ≥ 0.175` always; if `|a1| > 1.8` keep `|a2| ≤ 0.55` |
| `legL[0]`, `legR[0]` | **−0.9 … +0.9** | only when there is no foot target; `solveLeg` overrides |
| `legL[1]`, `legR[1]` | **−1.2 … +1.2** | a kick can reach 1.8 with a foot target |
| `footL`, `footR` | within **275** of the hip (idol), **272** (Mira) | a target beyond reach clamps silently and lifts the foot |
| planted foot y | **−39** (idol), **−8** (Mira) | keeps the sole on the shadow |
| `footPitchL/R` | **−0.35 … +0.25** | the boot then rotates `·0.55`; visible sole tilt ≤ 0.19 rad |
| `lean` | **−0.25 … +0.65** | 0.4 = stage bow, 0.65 = deep bow |
| `headTilt` | **−0.25 … +0.30** | roll about the neck |
| `headTurn` | **−0.35 … +0.35** | 2-D rotation, not a yaw; use `look` for the eyes |
| `bounce` | **−40 … +12** | body only; shadow and planted feet stay |
| `sway` | **−12 … +12** | **skirt hem only**, not a hip shift |
| `s` | 0.5 … 1.5 | shadow scales with it |
| `flip` | −1 or +1 | never 0 |

**The shipped rig bends every standing knee ~28°.** The idol hip is −306 and the leg is 158 + 118 = 276, so the library foot at y = −39 is 9 px beyond reach; `solveLeg` spends the slack by swinging the knee outward. Measured: **kneeBend = ±0.496 rad** on Nova `idle`, **±0.510** on Mira `idle`. This is the J-rig "frog", not a pose choice. The performance library keeps every planted foot at the library's own `y` and `|x| ≤ 40`, so it does not add to it. If the rig is fixed to HIP −315 / −281, the same targets become straight with no library change.

**Two reach limits the library must respect:**
- The idol's lowest hand is **−312** (shoulder −516 + 104 + 88 + 12); Mira's is **−266**. The idol **cannot touch the floor**. A pickup prop must sit at least **312 units above the ground** (screen y ≤ 632 at s = 1.05 on GROUND 960). The short's s3 star lands at screen y 900 and s4's vanity is at 745 — both below the hand; the current code floats the star up to the hand, which is a magic lift, not a pickup.
- The idol's near arm (`armR`) is drawn **after** the head and can cover the face. The far arm (`armL`) is drawn before the torso and can hide. Cross-body hands must stay **below the chin** (`y ≥ −480`); raised hands must stay **outside** `x ±49`.

### 2.4 The poses the short actually needs (P9–P15, proposed)

The 8-pose library predates J-rig §4.4 and has no clap, mic, heart, wave, hip-hand, self-point or deep bow. These are validated against the same math; hands are clear of the face box.

| # | name | params | hand(s) | used at |
|---|---|---|---|---|
| P9 | `wave` | armL `[2.05,.30]`, armR `[−.18,.08]`, headTilt .05, headTurn −.08 | L −208,−634 | s1, s6, s9 |
| P10 | `clap` | armL `[.50,−1.80]`, armR `[−.50,1.80]`, lean .04 | meet (0,−398) | s7 |
| P11 | `mic` | armR `[−.35,1.60]`, armL `[.15,.08]`, headTilt −.04 | R −14,−387 | s7 |
| P12 | `heart` | armL `[.35,−2.20]`, armR `[−.35,2.20]`, headTilt .08 | meet (0,−446) | s2, s5 |
| P13 | `hip-hand` | armR `[−.55,1.25]`, armL `[.15,.08]`, sway 3 | R 35,−351 (near arm, visible) | s6, s8 |
| P14 | `self-point` | armR `[.20,.80]`, armL `[.15,.08]`, headTilt .04, headTurn −.10 | R −60,−360 | s8 |
| P15 | `bow-deep` | lean .65, headTilt .30, armL `[.20,.15]`, armR `[−.20,−.15]` | ±125,−337 | s9 (optional; P8 is enough) |

`hip-hand` uses the **near** arm, not J's far arm: the far hand at (−35,−351) is hidden behind the torso and the gesture does not read. The near hand at (35,−351) is drawn on top of the torso with the elbow out at (99,−428).

### 2.5 What is still missing (and is not needed for this short)

`kick`, `jump`, `crouch`, `look-back`, `hair-flip`, `arms-crossed`, `finger-gun`, `laugh`, a seated pose, a fall/land, and a prop-hold other than `mic`. `crouch` matters for a floor pickup; without it, keep pickups at waist height. No formation system exists; the duet poses are mirrored pairs, not a 3–5 body formation.

---

## 3. What the short currently uses, per shot

Counts are authored keys on the lead (and support), not continuous bounce. "Invalid" = a value the rig does not have, so it renders as the default.

| shot | s | lead face keys | lead pose | support face / pose | gestures | root | static > 1.5 s |
|---|---|---|---|---|---|---|---|
| s1 | 3.68 | NOVA 3 (1 invalid `wide`) | 1 inline + walk | MIRA 2 (1 invalid `wide`) / 1 inline | clipboard | NOVA 1350→1200 | NOVA face 2.72; MIRA pose 3.68 |
| s2 | 2.74 | NOVA 3 (1 invalid `wide`) | 1 + 1 arm key | MIRA 2 (1 invalid `wide`) / 1 + head keys | — | NOVA 1350→1290 | MIRA pose 2.74 |
| s3 | 4.02 | MIRA 3 (1 invalid `narrow`) | 1 + 2 arm keys | NOVA absent | star fall/land | MIRA 1380→1120 | MIRA face + pose 1.60 |
| s4 | 1.82 | NOVA 3 (1 invalid `wide`); MIRA 3 (1 invalid `tender`) | both 1 + 2–3 keys | — | star grip | MIRA 1470→1250 | none (NOVA face 1.42) |
| s5 | 1.64 | NOVA 3 (2 invalid `wide`/`tender`); MIRA 2 (1 invalid `tender`) | both 1 + 4 arm keys | — | star pass, both grips | none | both pose 1.64 |
| s6 | 3.54 | NOVA 3 (1 invalid `wide`); MIRA **1** | both 1 + 3 arm keys | 2 backups, 1 constant | stamp, list | NOVA 260→960; MIRA 430→750 | MIRA face + pose 3.54; backups 3.54; NOVA pose 1.62 |
| s7 | 1.42 | NOVA 2; MIRA **1** | both 1 + arm/clap keys | — | clap, mic | none | none |
| s8 | 1.66 | NOVA 2 (1 invalid `wide`); MIRA 3 (1 duplicate) | both 1 + keys | — | card, self-point | none | NOVA pose 1.66 |
| s9 | 4.38 | NOVA 2; MIRA 2 | both 1 + 3 arm keys | — | star, bouquet | **none** (`novaStep9` declared, never used) | both face 3.32; pose 2.94 |

**Total invalid keys: 10** — Nova `wide` at 875, 954, 1104, 1178, 1269, 1409; Nova `tender` at 1179, 1189; Mira `narrow` at 1040; Mira `tender` at 1122. Some still change the mouth (so the key is not a complete no-op), but the **eye** change never happens.

### 3.1 What is unused

- **All 16 named poses** (Nova P1–P8, Mira P1–P8): 0 used. Every shot re-declares `IDLE_NOVA`/`IDLE_MIRA` and edits arms with `C.kf`.
- **Nova eyes**: `wink`, `heart`, `swirl`, `x`, `spiral` (5 of 10). **Nova mouth**: `grin`, `pout` (2 of 7).
- **Mira eyes**: `swirl` (1 of 6). **Mira mouth**: `wobble` (1 of 5); she has no `sing`/`pout`.
- **`browY`, `browL`, `browR`, `browW`, `iris`, `brows:false`**: 0 uses.
- **`sing` modulation**: 0. `sing` is a constant 0.5/0.6/0.7/0.9; the mouth is a still open ellipse.
- **`blink`**: 0 effective uses on Nova; 2 shots on Mira (s6:1282, s7:1355). The 6 calls that pass `{ blink }` as `extra` are ignored (see §6.2).
- **`footPitch`**: 0 uses. **`step`/`lift`**: 0 uses, so the walk slides (`walkPose` keeps `footL/footR` y at −39).
- **`flip`**: 0 uses (all +1). **`petalDrift`**: 0 (petals: 0). **`sway`**: used, but only as a skirt value.
- **`mouth:'sing'` on a held note**: used, but static. **`look`**: used in 3 shots, always ±1 or 0; no small glances.

---

## 4. Per-shot performance library, s1–s9

Every row is `{time, word, layer, character, what, params}`. Times are the measured word starts from `test-words.js`. The first pose row is the character's entrance pose, not necessarily the shot's first frame. Pose names are from §2; the numbers are the library's, not new ones. No arm crosses the face; every cross-body hand is below the chin; every planted foot stays on its shadow.

### s1 — 0.00–3.68 — "Every night the cue lamp calls one name"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 2.72 | one | face | NOVA | the beam snaps on: eyes closed→**star**, mouth flat→**o** | `eyes:'star', mouth:'o', blush:.55, look:[0,-.2]` |
| 3.10 | name | face | NOVA | the name lands: a grin | `eyes:'happy', mouth:'grin', blush:.65, look:[0,0]` |
| 3.28 | name | face | NOVA | settle to a smile | `eyes:'happy', mouth:'smile', blush:.6` |
| 2.72 | one | pose | NOVA | waiting in the wing, weight back | **P1 `idle`**, blend .18 |
| 3.10 | name | pose | NOVA | points at the lamp with the far arm | **P3 `point`**, blend .22 |
| 3.44 | name | pose | NOVA | settles | **P1 `idle`**, blend .22 |
| 3.10 | name | gesture | NOVA | open palm to the light (hand −220,−611, outside the face) | `hand:'L', contact:'open', at:[-220,-611]` |
| 3.30 | name | gesture | MIRA | the pencil closes on the clipboard | `hand:'R', prop:'clipboard', contact:'grip'` |
| 3.10 | name | root | NOVA | steps into the light | `fromX:1350, toX:1200, dur:.45, ease:'out'` |
| 2.72 | one | face | MIRA | looks up from the list | `eyes:'wide', mouth:'o', blush:.4` |
| 3.30 | name | face | MIRA | back to the list | `eyes:'dot', mouth:'flat', look:[-1,0]` |
| 2.72 | one | pose | MIRA | leans in, head tilt | **P5 `listen`**, blend .2 |
| 3.30 | name | pose | MIRA | sits back | **P1 `idle`**, blend .2 |

### s2 — 3.68–6.42 — "and every night the stage holds its breath"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 3.68 | and | face | NOVA | watches the house | `eyes:'normal', mouth:'flat', look:[0,-.5]` |
| 4.52 | the | face | NOVA | a small glance | `eyes:'narrow', mouth:'flat', look:[-.6,0]` |
| 5.12 | holds | face | NOVA | inhale: eyes shut | `eyes:'closed', mouth:'flat', blush:.5` |
| 5.96 | breath | face | NOVA | exhale: mouth opens | `eyes:'happy', mouth:'o', blush:.6` |
| 3.68 | and | pose | NOVA | stands | **P1 `idle`** |
| 5.12 | holds | pose | NOVA | both hands to the chest | **P12 `heart`**, blend .25 |
| 5.96 | breath | pose | NOVA | drops the hands, bounce +6 | **P1 `idle`**, `bounce:6, lean:-.04`, blend .25 |
| 5.12 | holds | gesture | NOVA | hands meet at the sternum (0,−446) | `hands:'both', contact:'press', at:[0,-446]` |
| 4.52 | the | gesture | MIRA | pencil taps the sheet | `hand:'R', prop:'clipboard', contact:'tap'` |
| 3.68 | and | root | NOVA | walks to centre | `fromX:1350, toX:1290, dur:1.44, ease:'out'` |
| 3.68 | and | face | MIRA | head down | `eyes:'dot', mouth:'flat', look:[-1,0]` |
| 4.52 | the | face | MIRA | looks up | `eyes:'wide', mouth:'o'` |
| 5.72 | its | face | MIRA | a small smile | `eyes:'happy', mouth:'smile'` |
| 3.68 | and | pose | MIRA | leans over the sheet | **P5 `listen`** |
| 4.52 | the | pose | MIRA | sits up, headTurn .12 | **P1 `idle`** |
| 5.96 | breath | pose | MIRA | leans back in | **P5 `listen`** |

### s3 — 6.42–10.44 — "but tonight the lamp called Nova, and the wings were empty"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 6.42 | but | face | MIRA | reads the sheet, determined | `eyes:'dot', mouth:'flat', look:[-1,0]` |
| 8.02 | Nova | face | MIRA | the mark is empty: eyes wide, mouth o | `eyes:'wide', mouth:'o', look:[0,0]` |
| 9.06 | wings | face | MIRA | worry: eyes drop to dot, wobble mouth | `eyes:'dot', mouth:'wobble', look:[0,0]` |
| 9.66 | empty | face | MIRA | looks down | `eyes:'closed', mouth:'flat', blush:.3` |
| 6.42 | but | pose | MIRA | walks to the mark | **P2 `step`**, blend .2 |
| 8.02 | Nova | pose | MIRA | stops at the empty mark | **P5 `listen`**, blend .22 |
| 9.66 | empty | pose | MIRA | bends to the flight case | **P8 `bow`**, blend .25 |
| 8.02 | Nova | gesture | MIRA | lowers the call sheet | `hand:'L', prop:'call-sheet', contact:'release'` |
| 9.85 | empty | gesture | MIRA | the hand closes on the star | `hand:'R', prop:'star', contact:'grip', at:[-94,-329]` |
| 6.42 | but | root | MIRA | walks to the empty mark | `fromX:1380, toX:1120, dur:1.60, ease:'out'` |

**Staging fix:** the star must land on the **flight case at screen y ≈ 638**, not the floor at 900. Mira's `bow` hand is at rig (−94,−329), screen 638 at s 0.98; her lowest hand is −266 (screen 699). The current s3 landing at 900 is 262 px too low, and the s4 vanity at 745 is 46 px below her lowest hand. Move both surfaces to 638; the star then lifts 180 px to `point`, not 230 px to a hand that is not there.

### s4 — 10.44–12.26 — "so Mira picked up the star"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 10.44 | so | face | MIRA | searching | `eyes:'dot', mouth:'flat', look:[-1,0]` |
| 11.18 | picked | face | MIRA | sees it | `eyes:'wide', mouth:'o', look:[-.6,-.4]` |
| 11.86 | star | face | MIRA | lifts it | `eyes:'happy', mouth:'smile', blush:.5` |
| 12.11 | star | face | MIRA | it glows | `eyes:'star', mouth:'grin', blush:.6` |
| 10.44 | so | pose | MIRA | stands at the vanity | **P1 `idle`** |
| 11.18 | picked | pose | MIRA | bends to the vanity | **P8 `bow`**, blend .25 |
| 11.86 | star | pose | MIRA | lifts the star to chest height | **P3 `point`**, blend .22 |
| 12.11 | star | pose | MIRA | holds it overhead | **P6 `duet-left`**, blend .25 |
| 11.86 | star | gesture | MIRA | grip on the star | `hand:'L', prop:'star', contact:'grip'` |
| 10.44 | so | face | NOVA | head down at the vanity | `eyes:'closed', mouth:'flat'` |
| 11.86 | star | face | NOVA | feels it | `eyes:'narrow', mouth:'wobble'` |
| 12.11 | star | face | NOVA | looks up | `eyes:'star', mouth:'o', look:[1,0]` |
| 10.44 | so | pose | NOVA | bent over the vanity | **P8 `bow`**, blend .2 |
| 11.86 | star | pose | NOVA | straightens | **P1 `idle`**, blend .25 |
| 12.11 | star | pose | NOVA | startled, arms out | **P4 `turn`**, blend .2 |
| 12.11 | star | gesture | NOVA | hand to the chest | `hand:'R', contact:'press', at:[-15,-446]` |

No root: 1.82 s is under 2 s. If the shot is extended, add MIRA 1470→1250 over 0.8 s.

### s5 — 12.26–13.90 — "and put it in her hand"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 12.26 | and | face | NOVA | guarded | `eyes:'narrow', mouth:'flat', look:[1,0]` |
| 13.08 | her | face | NOVA | the star is in her hand | `eyes:'star', mouth:'o', blush:.5` |
| 13.26 | hand | face | NOVA | accepts | `eyes:'happy', mouth:'smile', blush:.65` |
| 12.26 | and | pose | NOVA | hands at her sides | **P1 `idle`** |
| 13.08 | her | pose | NOVA | both hands close on the star | **P12 `heart`**, blend .22 |
| 13.50 | hand | pose | NOVA | lowers it | **P1 `idle`**, blend .25 |
| 12.26 | and | face | MIRA | offering | `eyes:'happy', mouth:'smile'` |
| 13.26 | hand | face | MIRA | lets go | `eyes:'happy', mouth:'grin', blush:.6` |
| 13.60 | hand | face | MIRA | watches her | `eyes:'dot', mouth:'smile'` |
| 12.26 | and | pose | MIRA | left hand offers at chest height | **P5 `listen`**, blend .2 |
| 13.26 | hand | pose | MIRA | withdraws | **P1 `idle`**, blend .22 |
| 13.60 | hand | pose | MIRA | leans in | **P5 `listen`**, blend .22 |
| 13.26 | hand | gesture | BOTH | the star passes; both hands close | `hands:'L+R', prop:'star', contact:'pass'` |

No root: 1.64 s. The offer must use Mira's **far** (`armL`) hand; she is at 1280, Nova at 700, so the offer is screen-left. `reach` (P2, `armR`) is the wrong side.

### s6 — 13.90–17.44 — "and the crowd saw a girl who was never on the list"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 13.90 | and | face | NOVA | determined | `eyes:'narrow', mouth:'flat', look:[1,0]` |
| 14.52 | saw | face | NOVA | a small breath | `eyes:'normal', mouth:'flat'` |
| 15.18 | girl | face | NOVA | the light finds her | `eyes:'star', mouth:'o', blush:.55` |
| 16.80 | list | face | NOVA | sings to the house | `eyes:'happy', mouth:'sing', sing:.6, blush:.6` |
| 13.90 | and | pose | NOVA | walks out of the wing | **P2 `step`**, blend .2 |
| 15.18 | girl | pose | NOVA | arms out to the crowd | **P4 `turn`**, blend .25 |
| 16.26 | on | pose | NOVA | one arm up | **P6 `duet-left`**, blend .22 |
| 16.80 | list | pose | NOVA | points at the list | **P3 `point`**, blend .22 |
| 15.90 | never | gesture | MIRA | the NOT ON LIST stamp lands | `hand:'R', prop:'stamp', contact:'press'` |
| 16.80 | list | gesture | MIRA | the list goes overhead | `hand:'L', prop:'call-sheet', contact:'lift'` |
| 14.52 | saw | root | NOVA | crosses to centre | `fromX:260, toX:960, dur:1.80, ease:'out'` |
| 14.52 | saw | root | MIRA | follows | `fromX:430, toX:750, dur:1.60, ease:'out'` |
| 13.90 | and | face | MIRA | follows, pleased | `eyes:'happy', mouth:'smile'` |
| 15.90 | never | face | MIRA | the stamp lands: sly grin | `eyes:'dot', mouth:'grin', blush:.5` |
| 16.80 | list | face | MIRA | holds the list up | `eyes:'happy', mouth:'grin'` |
| 13.90 | and | pose | MIRA | walks after Nova | **P2 `step`** |
| 16.26 | on | pose | MIRA | stops, holds the sheet | **P5 `listen`** |
| 16.80 | list | pose | MIRA | the sheet overhead | **P6 `duet-left`** |
| 15.18 | girl | face | BACKUP 0/1 | the light: grin | `eyes:'happy', mouth:'grin', blush:.6` |
| 16.26 | on | pose | BACKUP 0/1 | a V | **P4 `turn`**, blend .25 |

The backups are 0.88 scale and 200 px apart; give them the same 2 changes so the back line is not a statue. They must not use `sing` (they are idols, so they can, but a held grin reads better at that size).

### s7 — 17.44–18.86 — "and the light found her"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 17.44 | and | face | NOVA | eyes shut, singing | `eyes:'closed', mouth:'sing', sing:.55, blush:.5` |
| 17.94 | found | face | NOVA | the light: star eyes | `eyes:'star', mouth:'sing', sing:.9, blush:.6` |
| 18.34 | her | face | NOVA | a happy note | `eyes:'happy', mouth:'sing', sing:.7` |
| 17.44 | and | pose | NOVA | hands at her sides | **P1 `idle`** |
| 17.94 | found | pose | NOVA | arms out in a V | **P4 `turn`**, blend .22 |
| 18.34 | her | pose | NOVA | one arm up | **P3 `point`**, blend .22 |
| 17.44 | and | gesture | NOVA | the hand comes to the mic | **P11 `mic`**, blend .2 |
| 17.44 | and | gesture | MIRA | clap 1 | **P10 `clap`**, blend .12 |
| 17.89 | found | gesture | MIRA | clap 2 | **P10 `clap`**, `bounce:-4` |
| 17.44 | and | face | MIRA | starts clapping | `eyes:'happy', mouth:'grin'` |
| 17.68 | light | face | MIRA | watches Nova | `eyes:'dot', mouth:'smile'` |
| 18.34 | her | face | MIRA | cheers | `eyes:'star', mouth:'grin', blush:.6` |
| 17.44 | and | pose | MIRA | claps | **P10 `clap`** |
| 17.94 | found | pose | MIRA | stops, hands apart | **P1 `idle`** |
| 18.34 | her | pose | MIRA | arms up | **P4 `turn`**, blend .22 |

No root: 1.42 s.

### s8 — 18.86–20.52 — "and the lamp called again"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 18.86 | and | face | NOVA | still singing | `eyes:'happy', mouth:'sing', sing:.5` |
| 19.42 | called | face | NOVA | the card says MIRA | `eyes:'star', mouth:'o', look:[1,0]` |
| 19.88 | again | face | NOVA | turns to Mira, grinning | `eyes:'happy', mouth:'grin'` |
| 18.86 | and | pose | NOVA | in the doorway | **P1 `idle`** |
| 19.42 | called | pose | NOVA | arms out, surprised | **P4 `turn`**, blend .22 |
| 19.88 | again | pose | NOVA | offers the stage | **P7 `duet-right`**, blend .25 |
| 19.42 | called | gesture | NOVA | the MIRA card drops (prop) | `prop:'cue-card', contact:'drop'` |
| 18.86 | and | face | MIRA | at the desk | `eyes:'dot', mouth:'flat', look:[-1,0]` |
| 19.42 | called | face | MIRA | her name | `eyes:'star', mouth:'o'` |
| 19.88 | again | face | MIRA | points at herself, grinning | `eyes:'happy', mouth:'grin', blush:.55` |
| 18.86 | and | pose | MIRA | sits at the desk | **P1 `idle`** |
| 19.42 | called | pose | MIRA | leans in | **P5 `listen`**, blend .2 |
| 19.88 | again | pose | MIRA | self-point | **P14 `self-point`**, blend .18 |
| 19.88 | again | gesture | MIRA | the hand touches her chest (−60,−360) | `hand:'R', contact:'press', at:[-60,-360]` |

No root: 1.66 s. The duplicate face key at 1425/1426 (`wide,o` twice) is removed.

### s9 — 20.52–24.90 — "and the curtain opened on a stage that had been waiting all night"

| time | word | layer | who | what | params |
|---|---|---|---|---|---|
| 20.52 | and | face | NOVA | sings to the house | `eyes:'happy', mouth:'sing', sing:.5` |
| 21.22 | opened | face | NOVA | the held note | `eyes:'closed', mouth:'sing', sing:.8, blush:.55` |
| 23.46 | waiting | face | NOVA | the bow | `eyes:'happy', mouth:'smile', blush:.6` |
| 24.32 | night | face | NOVA | the night sky: star eyes | `eyes:'star', mouth:'grin', blush:.7` |
| 20.52 | and | pose | NOVA | arms out | **P4 `turn`** |
| 21.22 | opened | pose | NOVA | one arm up | **P6 `duet-left`**, blend .22 |
| 23.46 | waiting | pose | NOVA | bows | **P8 `bow`**, blend .3 |
| 24.32 | night | pose | NOVA | rises, arms out | **P4 `turn`**, blend .3 |
| 24.32 | night | gesture | NOVA | lifts the star | `hand:'L', prop:'star', contact:'lift'` |
| 21.80 | on | root | NOVA | steps forward | `fromX:820, toX:880, dur:.88, ease:'out'` |
| 20.52 | and | face | MIRA | smiles | `eyes:'happy', mouth:'smile'` |
| 23.46 | waiting | face | MIRA | the bow | `eyes:'happy', mouth:'grin'` |
| 24.32 | night | face | MIRA | the sky | `eyes:'star', mouth:'grin'` |
| 20.52 | and | pose | MIRA | arms out | **P4 `turn`** |
| 23.46 | waiting | pose | MIRA | bows | **P8 `bow`**, blend .3 |
| 24.32 | night | pose | MIRA | the bouquet goes up | **P6 `duet-left`**, blend .3 |
| 24.32 | night | gesture | MIRA | lifts the bouquet | `hand:'L', prop:'bouquet', contact:'lift'` |

The root is the missing `novaStep9` (declared in `sync.json` at "stage" 22.26 but never implemented). Put it at 21.80–22.68 so it lands on "stage" 22.26. 4.38 s needs it.

---

## 5. A compact schema the scene can read

```json
{
  "film": "kpop-test",
  "cast": { "NOVA": "idol@0.1.0", "MIRA": "mira@0.1.0" },
  "shots": [
    {
      "shot": "s3",
      "start": 6.42,
      "end": 10.44,
      "beats": [
        { "shot": "s3", "time": 8.02, "word": "Nova", "character": "MIRA",
          "layer": "face", "what": "the mark is empty: eyes wide, mouth o",
          "params": { "eyes": "wide", "mouth": "o", "blush": 0.4, "look": [0, 0] } },

        { "shot": "s3", "time": 8.02, "word": "Nova", "character": "MIRA",
          "layer": "pose", "what": "stops at the empty mark",
          "params": { "pose": "listen", "blend": 0.22 } },

        { "shot": "s3", "time": 9.85, "word": "empty", "character": "MIRA",
          "layer": "gesture", "what": "the hand closes on the star",
          "params": { "hand": "R", "prop": "star", "contact": "grip", "at": [-136, -524] } },

        { "shot": "s3", "time": 6.42, "word": "but", "character": "MIRA",
          "layer": "root", "what": "walks to the empty mark",
          "params": { "fromX": 1380, "toX": 1120, "dur": 1.6, "ease": "out" } }
      ]
    }
  ]
}
```

**Required:** `shot`, `time`, `word`, `layer` (`face|pose|gesture|root`), `what`, `params`.
**Optional:** `character` (defaults to the shot's lead), `until` (hold end), `ease` (`0` for a snap, `out`/`inOut`), `blend` (pose seconds).

**Validator rules** (one `performance-check` command):
1. `time` is inside `[start, end]`; `word` is in the shot's line; `time` is within **±0.15 s** of the word's measured start (or a declared `offset`).
2. `layer:face` — `eyes` ∈ the character's set, `mouth` ∈ the character's set; `blush` 0–0.9, `sing` 0–1, `look` ±1, `blink` 0/1, `browY` ±3. An unknown value is an **error**, not a fallback.
3. `layer:pose` — `pose` is a name in that character's library; `blend` 0.12–0.35; no two pose rows closer than **0.30 s**; the first pose is within **0.25 s** of the character's entrance (not the shot's first frame if the character is offstage).
4. `layer:gesture` — `prop` exists; `contact` ∈ `grip|press|tap|lift|drop|pass|open|release`; a grip holds ≥ **6 frames**; the prop's centre is ≤ **8 px** from the palm.
5. `layer:root` — `fromX/toX` inside the frame; `dur` 0.3–2.0; a shot > 2 s has **at least one** root row; a root never moves a planted foot (move the root, keep `footL/footR` world targets).
6. Per shot: the lead has **2–4 face** rows and **2–3 pose** rows; every staged character has a face or pose change at least every **1.5 s**; a face beat is only allowed if the head is ≥ **70 px** tall at that instant, otherwise it must be a pose/gesture row.
7. No `layer:pose` hand may enter `x ±49, y [−670, −538]` (idol) or `x ±36, y [−560, −476]` (Mira); a cross-body hand must have `y ≥ −480` (idol) / `y ≥ −430` (Mira).

---

## 6. The exact code changes

### 6.1 Replace `faceAt` (test-scenes.js:69–73) with a validated version

```js
const EYES  = ['normal','closed','happy','wink','heart','star','swirl','narrow','x','spiral'];
const MOUTH = ['smile','grin','o','flat','pout','wobble','sing'];
const MIRA_EYES  = ['dot','closed','star','swirl','wide','happy'];
const MIRA_MOUTH = ['smile','o','flat','wobble','grin'];

function faceAt(t, keys, base = {}, who = 'NOVA') {
  let f = { ...base };
  for (const k of keys) if (t >= k.t) f = { ...f, ...k.f };
  const E = who === 'MIRA' ? MIRA_EYES : EYES;
  const M = who === 'MIRA' ? MIRA_MOUTH : MOUTH;
  if (!E.includes(f.eyes))  throw new Error(who + ': eyes "' + f.eyes + '" is not on the rig');
  if (!M.includes(f.mouth)) throw new Error(who + ': mouth "' + f.mouth + '" is not on the rig');
  f.blush = C.clamp(f.blush ?? .45, 0, .9);
  f.sing  = C.clamp(f.sing ?? 0, 0, 1);
  f.blink = (f.blink ?? 0) > .5 ? 1 : 0;
  f.look  = [C.clamp(f.look?.[0] ?? 0, -1, 1), C.clamp(f.look?.[1] ?? 0, -1, 1)];
  f.browY = C.clamp(f.browY ?? 0, -3, 3);
  return f;
}
```

The `who` argument is the one change that catches the Mira/Nova difference. The throw is deliberate: a proof should fail loudly on a word the rig cannot draw, not silently render the default. (If a soft path is wanted for a draft, log and substitute, but the proof build must throw.)

### 6.2 Fix the blink wiring (6 call sites)

The rig reads `o.face.blink`, but `nova()`/`mira()` take `face` as the **7th** argument and `extra` as the **8th**. Every call of the form

```js
nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [ ... ]), { blink: blinkAt(t, 1) })
```

puts `blink` on `o.blink`, where `face()` never looks. Change it to pass blink through the `faceAt` base and delete the 8th argument:

```js
nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [
  { t: 0, f: { eyes: 'narrow', mouth: 'flat', blush: .35, look: [1, -.1] } },
  { t: spotNova, f: { eyes: 'star', mouth: 'o', blush: .45, look: [1, -.1] } },
  { t: novaStep, f: { eyes: 'happy', mouth: 'grin', blush: .55, look: [0, 0], sing: .55 } },
], { blink: blinkAt(t, 1) }, 'NOVA'));
```

The six sites: **s1:877** (Nova), **s1:889** (Mira), **s2:957** (Nova), **s2:968** (Mira), **s5:1180** (Nova), **s5:1191** (Mira). The two correct sites are s6:1282 and s7:1355, where `blink` is already inside the face object; leave them. Add blink to s3, s4, s8, s9 — a 2-frame blink every 2.6 s, seeded per character.

### 6.3 Replace the pose edits with `poseAt` + `mixPose`

The short has 9 `P(IDLE_*, { ... })` calls and ~20 `C.kf` arm keys. A named pose is a complete pose; blending two complete poses is what keeps the elbow from snapping through zero.

```js
// window.NOVA_POSES / window.MIRA_POSES are the pose libraries (generated copy, not hand-typed)
const LIB = { NOVA: window.NOVA_POSES, MIRA: window.MIRA_POSES };

function poseOf(who, p, base) {
  return typeof p === 'string' ? P(base, LIB[who][p].params) : P(base, p);
}

function mixPose(a, b, u) {
  const m = (x, y) => x + (y - x) * u;
  const v = (x, y) => [m(x[0], y[0]), m(x[1], y[1])];
  return { ...b,
    armL: v(a.armL, b.armL), armR: v(a.armR, b.armR),
    legL: v(a.legL, b.legL), legR: v(a.legR, b.legR),
    footL: v(a.footL, b.footL), footR: v(a.footR, b.footR),
    bounce: m(a.bounce || 0, b.bounce || 0), lean: m(a.lean || 0, b.lean || 0),
    headTilt: m(a.headTilt || 0, b.headTilt || 0), headTurn: m(a.headTurn || 0, b.headTurn || 0),
    hairSwing: m(a.hairSwing || 0, b.hairSwing || 0) };
}

function poseAt(lt, keys, base, who) {
  let prev = base, next = base, at = -1, blend = .18;
  for (const k of keys) {
    if (lt < k.t) continue;
    prev = next; next = poseOf(who, k.pose, base); at = k.t; blend = k.blend ?? .18;
  }
  const u = blend > 0 ? C.easeInOut(C.clamp((lt - at) / blend)) : 1;
  return mixPose(prev, next, u);
}
```

Call-site shape:

```js
// s1 Nova, replaces lines 865–871
const np = poseAt(lt, [
  { t: 2.72, pose: 'idle' },
  { t: 3.10, pose: 'point', blend: .22 },
  { t: 3.44, pose: 'idle',  blend: .22 },
], IDLE_NOVA, 'NOVA');
```

Do **not** blend `footL/footR` from a planted pose to a lifted one across a cut; at a cut, use the new pose's own targets (the first frame of the new shot is allowed to snap). Inside a shot, `mixPose` keeps the foot target on the ground because both poses share `y = −39`; only `x` moves.

### 6.4 The 10 invalid keys — exact replacements

| line | current | replace with | why |
|---|---|---|---|
| s1:875 | `eyes:'wide'` | `eyes:'star'` | the idol has no wide; star is the light |
| s2:954 | `eyes:'wide'` | `eyes:'star'` | same |
| s3:1040 | `eyes:'narrow'` (Mira) | `eyes:'dot'` + `browY:1.5` | Mira has no narrow; a dot + a low brow is suspicion |
| s4:1104 | `eyes:'wide'` (Nova) | `eyes:'star'` | same |
| s4:1122 | `eyes:'tender'` (Mira) | `eyes:'happy'` + `blush:.6` | Mira has no tender; happy + blush is the same read |
| s5:1178 | `eyes:'wide'` (Nova) | `eyes:'star'` | same |
| s5:1179 | `eyes:'tender'` (Nova) | `eyes:'happy'` + `blush:.65` | the idol has no tender |
| s5:1189 | `eyes:'tender'` (Mira) | `eyes:'happy'` + `blush:.6` | same |
| s6:1269 | `eyes:'wide'` (Nova) | `eyes:'star'` | same |
| s8:1409 | `eyes:'wide'` (Nova) | `eyes:'star'` | same |

Also **s8:1425–1426** is the same `wide,o` twice, 0.46 s apart; the second row is a no-op. Replace 19.88 with `eyes:'happy', mouth:'grin', blush:.55`.

### 6.5 Make the walk lift its feet (test-scenes.js:141–154)

Current: `footL: [x + 12*step, −39]`, `footR: [x − 12*step, −39]` — both feet stay on the ground, so the walk is a slide. Add the lift and the pitch:

```js
function walkPose(base, lt, speed = 9, stride = 1, phase = 0) {
  const u = lt * speed + phase, step = Math.sin(u);
  return P(base, {
    bounce: -Math.abs(step) * 6,
    sway: 2.5 * step,
    lean: (base.lean || 0) + 0.02 * step,
    armL: [0.3 - 0.16 * step, 0.06],
    armR: [-0.3 - 0.16 * step, -0.06],
    footL: [base.footL[0] + 12 * stride * step, base.footL[1] - 18 * Math.max(0, step)],
    footR: [base.footR[0] - 12 * stride * step, base.footR[1] - 18 * Math.max(0, -step)],
    footPitchL: -0.18 * Math.max(0, step),
    footPitchR: -0.18 * Math.max(0, -step),
    headTilt: (base.headTilt || 0) + 0.02 * step,
  });
}
```

The lifted target `y = −57` is 249 from the hip, inside 275, so `solveLeg` does not clamp. The planted foot stays at −39 and on its shadow.

### 6.6 Modulate `sing` and use `browY`

`sing` is a constant today, so a held note is a still ellipse. Add:

```js
const sung = (f, t) => f.mouth === 'sing'
  ? { ...f, sing: 0.5 + 0.3 * Math.sin(t * 11) }
  : f;
```

Call `nova(..., sung(faceAt(lt, keys, { blink }, 'NOVA'), t))`. At 30 fps the mouth moves at ~1.75 Hz — a vibrato, not a flicker. For the brow: `browY: -2` on the light/star beats (surprise), `browY: +1.5` on "never"/"empty" (determination). The idol face reads `browY`; the short never sets it.

### 6.7 The per-shot call-site map

| shot | line | replace the pose block with |
|---|---|---|
| s1 | 865–871 | `poseAt(lt, [{2.72:'idle'},{3.10:'point'},{3.44:'idle'}], IDLE_NOVA, 'NOVA')` |
| s1 | 879–884 | `poseAt(lt, [{2.72:'listen'},{3.30:'idle'}], IDLE_MIRA, 'MIRA')` |
| s2 | 946–951 | `poseAt(lt, [{3.68:'idle'},{5.12:'heart'},{5.96:'idle'}], IDLE_NOVA, 'NOVA')` |
| s2 | 958–963 | `poseAt(lt, [{3.68:'listen'},{4.52:'idle'},{5.96:'listen'}], IDLE_MIRA, 'MIRA')` |
| s3 | 1028–1035 | `poseAt(lt, [{6.42:'step'},{8.02:'listen'},{9.38:'point'},{9.66:'bow'}], IDLE_MIRA, 'MIRA')` |
| s4 | 1090–1099 | `poseAt(lt, [{10.44:'bow'},{11.86:'idle'},{12.11:'turn'}], IDLE_NOVA, 'NOVA')` |
| s4 | 1108–1117 | `poseAt(lt, [{10.44:'idle'},{11.18:'listen'},{11.86:'point'},{12.11:'duet-left'}], IDLE_MIRA, 'MIRA')` |
| s5 | 1170–1175 | `poseAt(lt, [{12.26:'idle'},{13.08:'heart'},{13.50:'idle'}], IDLE_NOVA, 'NOVA')` |
| s5 | 1181–1187 | `poseAt(lt, [{12.26:'listen'},{13.26:'idle'},{13.60:'listen'}], IDLE_MIRA, 'MIRA')` |
| s6 | 1257–1265 | `poseAt(lt, [{13.90:'step'},{15.18:'turn'},{16.26:'duet-left'},{16.80:'point'}], IDLE_NOVA, 'NOVA')` |
| s6 | 1275–1280 | `poseAt(lt, [{13.90:'step'},{16.26:'listen'},{16.80:'duet-left'}], IDLE_MIRA, 'MIRA')` |
| s7 | 1333–1339 | `poseAt(lt, [{17.44:'idle'},{17.94:'turn'},{18.34:'point'}], IDLE_NOVA, 'NOVA')` |
| s7 | 1347–1353 | `poseAt(lt, [{17.44:'clap'},{17.94:'idle'},{18.34:'turn'}], IDLE_MIRA, 'MIRA')` |
| s8 | 1397–1405 | `poseAt(lt, [{18.86:'idle'},{19.42:'turn'},{19.88:'duet-right'}], IDLE_NOVA, 'NOVA')` |
| s8 | 1412–1421 | `poseAt(lt, [{18.86:'idle'},{19.42:'listen'},{19.88:'self-point'}], IDLE_MIRA, 'MIRA')` |
| s9 | 1481–1487 | `poseAt(lt, [{20.52:'turn'},{21.22:'duet-left'},{23.46:'bow'},{24.32:'turn'}], IDLE_NOVA, 'NOVA')` |
| s9 | 1493–1499 | `poseAt(lt, [{20.52:'turn'},{23.46:'bow'},{24.32:'duet-left'}], IDLE_MIRA, 'MIRA')` |

`s8:19.88` uses `self-point`, which is **P14**, not in the current library; add it (or keep the current `armR:[0.5,1.4]` as a gesture override, which is also safe: hand −95,−451, below the chin).

### 6.8 The missing root in s9

`sync.json` declares `novaStep9` at "stage" 22.26 but no scene code moves Nova. Add after line 1487:

```js
const step9 = C.easeOut(C.clamp((lt - 21.80) / 0.88));
const nx9 = 820 + 60 * step9;   // 820 → 880, lands on "stage" 22.26
```

and use `nx9` in `nova()` and `contactShadow()`. This is the only shot over 2 s with no root.

---

## 7. Safety and verification

**The library is safe by construction:** every planted foot keeps the library's own target (`±36/−39` Nova, `±28/−8` Mira, `|x| ≤ 40`); every raised arm is outside the face box; every cross-body hand is below the chin (`heart` −446, `clap` −398, `mic` −387, `self-point` −360); every pose has both arms, both legs and both feet; every visible elbow has `|a2| ≥ 0.175`.

**Do not:** use `eyes:'wide'` or `'tender'` on Nova; use `eyes:'narrow'`/`'tender'` or `mouth:'sing'`/`'pout'` on Mira; put a prop below 312 units above the ground for the idol (266 for Mira); use `sway` as a hip shift; write a partial pose (it inherits the rig default); pass `blink` as `extra`; let a pose blend cross `a2 = 0`.

**Verify with one command each:**
```bash
node scripts/performance-check.mjs proofs/kpop-test   # 9 shots × the §5 rules; must print 0 findings
node scripts/rig-check.mjs proofs/kpop-test           # hands, elbows, feet on shadows, no face cross
node scripts/motion-check.mjs                         # no static run > 0.4 s (already exists)
```
`performance-check` should print one row per shot: `s1 NOVA 3 face / 2 pose / 1 root / max gap 1.22 s`. A shot with a gap > 1.5 s or a missing layer is a failure, not a warning.

**Sources.** `films/understudy/vendor/characters.js:190-320` (face), `:399-604` (idol), `:617-803` (mira); `cast/nova.poses.json`, `mira.poses.json`; `proofs/kpop-test/test-scenes.js:69-154` (faceAt, walkPose), `:873-1503` (all call sites); `test-words.js` (word clock); `sync.json` (events); `src/characters.js:173-303` (gold face), `src/scenes/act1.js`–`act5.js` (gold vocabulary); `out/analysis/shots-15/` and `proofs/kpop-test/out/shots-15/` (sheets); reports A.md:169, C.md:131, J-rig §1–§4, L.md:35/236.
