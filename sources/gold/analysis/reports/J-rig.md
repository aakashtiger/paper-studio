# J — Rig review: the KPOP gold-standard cast and rig

**Scope.** The delivered film (`out/claude-pop.mp4`, 25 Oct 2026, 1920×1080, 30 fps, 156.62 s), the current source (`src/characters.js`, 29 Oct), the clean vendor (`studio/films/understudy/vendor/characters.js`, 5 Nov), the office rig (`studio/films/same-alarm/vendor/office.js`), the Nova/Mira pose libraries, the 15 fps sheets and the act reports A–I. No source or film file was edited.

**Verdict.** The delivered film's arms and legs are **dismembered by a broken limb chain** in the delivered build — primarily the mirrored `limb` endpoint, with a rotation signature consistent with a leaked shoulder transform. The current source fixed the endpoint and balanced the shoulder/cuff blocks, and the **idol** hands now attach; four structural defects remain: (1) the **sign convention is inverted** in the source defaults and in many scene poses, so arms cross the chest/face; (2) the idol **hip is 9 px too low** for its leg + boot, so every standing knee bends ~0.49–0.51 rad outward (the frog); (3) the **boot toe is not mirrored**, so both feet point screen-right; (4) the **Mira/office hand is drawn in torso space**, not the forearm frame. The clean upper body is the Understudy `idol`; the clean legs are the Same Alarm `officeFigure`. A new film should use those constants, not `src/characters.js`.

**Method.** Read the files above; extracted native frames at sparks 3.0, loss 10.0, boss 14.0, chorus1 23.4, foom 25.2, dance1 36.6, curtain 143.0, finaldance 148.0; re-rendered the **current** source at the same times (`out/analysis/tmp/current/`); rendered `pose:{}` on source and vendor side by side (`J-defaults.png`, `J-vendor.png`); rendered Nova + proposed poses on the vendor (`J-poses.png`). The delivered MP4 (25 Oct) predates the current source (29 Oct) and the vendor (5 Nov), so "delivered" and "current" are different builds.

---

## 1. Anatomy contract — exact numbers and conventions

### 1.1 The three human rigs

| | `idol` (Understudy/Nova) | `mira` (Understudy) | `officeFigure` (Same Alarm) |
|---|---|---|---|
| Ground / hip / shoulder / head | 0 / **−306** / −500 / −604 | 0 / **−272** / −452 / −518 | 0 / **−281** / −452 (boss −466) / −518 (boss −530) |
| Hip joints | x = ±16 | x = ±14 | x = ±14 (boss ±16) |
| Thigh / shin | **158 / 118** | **156 / 117** | **156 / 117** |
| Boot / shoe sole below ankle | **41** (sole 28…41) | **10** | **10** |
| Foot target in the library | y = **−39** | y = **−8** | y = **−8** |
| Shoulder joints | (±45, −516) | (±38, −448) | (±38/40, SHOULDER+4) |
| Upper arm / forearm | **104 / 88** | **92 / 78** | **92 / 78** |
| Hand | **22×32** at local (0, 12); finger 10×16 at (9, 18); thumb 7.6×11.2 at (side·8, 7); cuff 16×7 | 18×26 at `wrist + (0,10)` in **torso space**; no thumb | 18×26 + finger 8×12 at `wrist + (0,10)` in **torso space**; no thumb |
| Face plate | 82×94; eyes ±17.5,−3; mouth y=32 | 72×84; eyes ±15,−4; mouth y=27 | 72×84; eyes ±15,−4; mouth y=27 |
| Waist / neck pivot | −334 / −530 | −270 / −462 | HIP+2 / SHOULDER−10 |

Sources: `films/understudy/vendor/characters.js:399-604` (idol), `:617-803` (mira); `films/same-alarm/vendor/office.js:45-404`; `src/characters.js:372-554` (idol), `:567-735` (mira). The old source uses HIP −300 (idol) and −270 (mira), which is worse; see §3.

### 1.2 Rest pose (vendor, radians)

| Rig | `armL` | `armR` | `legL` | `legR` |
|---|---|---|---|---|
| `idol` | **[+0.14, +0.06]** | **[−0.14, −0.06]** | [+0.035, +0.015] | [−0.035, −0.015] |
| `mira` | **[+0.16, +0.08]** | **[−0.16, −0.08]** | [+0.03, +0.01] | [−0.03, −0.01] |
| `office` | **[+0.16, +0.08]** | **[−0.16, −0.08]** | [+0.03, +0.01] | [−0.03, −0.01] |

The **source** `idol` and `mira` defaults are the exact opposite (`src/characters.js:385-386`, `:571-572`): `armL` negative, `armR` positive. With the real math that means both arms swing **inward across the body** (see `J-defaults.png`: one arm hidden behind the torso, one arm across the chest, a one-armed silhouette). The vendor defaults show both arms out (`J-vendor.png`). This is the default trap a new film must not inherit.

### 1.3 Angle signs — the one convention

- `limb` local +y is **down**; `ang = 0` points straight down.
- **Positive `ang` rotates toward local −x (screen-left); negative toward local +x (screen-right).** The endpoint is `(x − sin(ang)·len, y + cos(ang)·len)` — `characters.js:50`, and the single source of truth is `src/engine/rig.ts:15`.
- The comment at `src/characters.js:27` says “+ rotates toward +x”. It is **wrong**, and it is the origin of the sign inversion in the scenes. `src/engine/rig.ts:1-17` records the same bug: the paper proof shipped `x + sin(ang)·len`, so “every elbow, wrist, knee, ankle and boot after the first segment was placed on the wrong side of its joint. The hands looked detached.”
- Therefore, for a front-facing rig (`flip=+1`): **left/far arm outward = positive `armL`; right/near arm outward = negative `armR`.** The vendor rest pose follows this. The source defaults and `act2.js:35/708/874`, `act1.js:116`, `act4.js:160/1121` use the opposite, so the arms cross the chest/face.
- `armL` is the **far** arm (drawn before the torso, at x=−45); `armR` is the **near** arm (drawn after the head, at x=+45). L/R are screen-side/far-near, not anatomical left/right. `flip=−1` mirrors the whole rig, so the same pose appears on the opposite screen side.
- `a2` is a **delta** added to `a1`; the forearm angle is `a1+a2`. A positive `a2` on a raised left arm bends the forearm further left/over the head; a positive `a2` on a raised right arm bends it inward toward the face. Symmetric poses need **opposite** `a2` signs.
- `solveLeg` (`vendor:55-68`, `rig.ts:60-88`) returns `hipAngle`, `kneeBend = shinAngle − hipAngle`, `shinAngle`; it places the knee **outward** (`side<0 ? +bend : −bend`). `kneeBend` is therefore mirrored per side. The boot angle is `shinAngle + footPitch`, and `boot` then rotates by `ang·0.55` (`vendor:71-84`).
- `bounce` is added to the hip, chest, head and arms, **not** to the root; the shadow stays at y=0 and the foot targets stay planted (vendor `:420-423`, `:450-455`, `:460-474`, `:481-483`). The **source** root translate includes bounce (`src:394`), so the shadow and feet bounce with the body.
- `lean` rotates the torso/head/arms about the waist; the legs do **not** lean. `headTilt`/`headTurn` rotate about the neck; `headTurn` is a 2D rotation (`·0.16`), not a yaw. `sway` is passed to `pleatedSkirt` only (`vendor:478`); it is **not** a body sway, and `mira`/`office` ignore it entirely.
- `flip` is ±1; `s` scales about the ground point; the shadow is at local (0,0).

### 1.4 Safe functions to reuse

| Function | Where | Use |
|---|---|---|
| `limbEnd`, `resolveChain`, `solveLeg`, `chainSeamGap`, `placePoint`, `unplacePoint`, `anchorsInSpace` | `src/engine/rig.ts:15-165` | **The single source of truth.** Import these; do not re-derive. |
| `limb` | vendor `:28-51` | Safe; returns the true endpoint. |
| `solveLeg` | vendor `:55-68` | Safe math; feed the **office** leg constants, and add a `kneeOut` policy. |
| `boot` | vendor `:71-84` | Shape safe, but **not mirrored**; wrap in `ctx.scale(side,1)`. For the `mira`/office shoe, use `ankle + side·4`, not `+4`; the idol boot is centred on the ankle. |
| `idol` | vendor `:399-604` | Safe upper body, hand and bounce hierarchy; legs need the hip fix (§3). |
| `mira` | vendor `:617-803` | Body safe; **hand is world-space and has no thumb**; fix before reuse. |
| `rigAnchor` | vendor `:390-392` | Safe no-op; the paint probe wraps it. Publish hand/foot/elbow/knee, not only hair/chest/head. |
| `officeFigure` | `office.js:45-404` | **The clean leg reference**; hand is world-space, fix before reuse. |
| `pleatedSkirt`, `varsityTorso`, `flowerHead`, `face`, `hairBack`, `bangs`, `crown` | vendor | Decorative, no anatomy. |

`drawArm`/`drawLeg` are inner functions; they are not exported. Copy the pattern, not the call.

---

## 2. The defects — delivered MP4 vs current source

### 2.1 The delivered build: broken limb chain (mirror endpoint, rotation signature)

**Observed.** The delivered film has forearms and hands 70–240 px from the sleeve end, and shins/boots detached from the thighs. The table lists the delivered symptoms; the detached/offset rows are the limb chain, the across-chest rows are the sign inversion (§2.2), and the far-hand row is the occlusion order (§3.7).

| Shot / time / frame | What is seen | Report |
|---|---|---|
| sparks 1.50–1.60 / f45–48 | far hand floats alone above the sun; far arm hidden behind the flower | A.md:77 |
| boss 14.0 / f420 | both arms read as detached tubes; hands at the waist | A.md:110 |
| chase 18.5, 19.5 / f555, f585 | shoes separate white blobs; arms/hands detached | A.md:132 |
| chorus1 23.4 / f702 | one arm across the chest, hand at the opposite hip; other arm invisible | delivered frame; D.md:65 (chorus2) |
| chorus2 58.94–60.52 / f1768–1816 | white sleeve with red stripe over the mouth in **100 %** of frames; hand hidden | D.md:65 |
| omega 64.18–66.12 / f1925–1984 | right sleeve from right shoulder to left cheek; hand behind hair | D.md:160 |
| gym 39.0, 40.6 / f1170, f1218 | forearms floating at hip height; shins and boots separate on/beside the treadmill | C.md:49 |
| foom 25.2 / f756 | boots flying off the rocket; legs bare sticks; arms crossed | delivered frame; B.md:328 |
| trust 109.75 / f3292 | MIRA hand 70 px from cuff; SOL far hand 70 px off | G.md:47 |
| disobey 114.90 / f3447 | SOL T-pose, hands 120–240 px **inside** the sleeves | G.md:94 |
| rlhf 121.0, 122.55 / f3630, f3676 | all 10 MIRA hands missing | G.md:184 |
| finaldance 148.0 / f4440 | forearms cross the face; hands float beyond the cuffs | delivered frame |

**Cause.** The delivered build's limb chain was broken. The frames show two signatures. (a) **The mirrored `limb` endpoint** (`x + sin(ang)·len`): every second segment (forearm, shin) and terminal part (hand, boot) started at the mirror of its joint. This is the **offset/parallel signature**: the forearm is parallel to the intended forearm but displaced by `2·sin(a1)·104`; for a raised arm at `a1=2.5` that is ~124 px at the elbow (and more at the hand), exactly the observed 70–240 px in gym/trust. `src/engine/rig.ts:1-17` records this exact bug in the paper proof (“every elbow, wrist, knee, ankle and boot after the first segment was placed on the wrong side of its joint. The hands looked detached”). (b) **A rotation signature** — the upper arms are out but the forearms cross the face (finaldance/curtain) — is consistent with the shoulder block leaking its `translate(sx,sy); rotate(a1)` (a missing `restore`), which would give the forearm an extra `a1` (`2a1+a2`) and the hand two extra (`3a1+2a2`). The delivered frames cannot tell which signature contributed per shot, but both paths are absent from current source: the endpoint is `x − sin(ang)·len` (`characters.js:50`), the racing-stripe/shoulder-cap and cuff blocks are balanced (`:518-525`, `:530-541`), and `debug6.mjs` reports depth 0. Current renders at t=3, 14, 23.4, 36.6, 143, 148 show attached idol hands. **This is a delivered-build defect, fixed in current source.**

### 2.2 Current source: the sign inversion (arms across chest/face)

**Observed in current renders.** At t=23.4 (chorus1), t=25.2 (foom), t=14 (boss), every idol has one arm folded across the chest and the other hidden behind the torso. At t=36.6 (dance1) the chorus line reads as linked arms, not a dance. The finale at t=143/148 uses the **correct** signs (`act5.js:115/291`: `armL +2.3…2.6`, `armR −2.3…−2.6`) and the arms are out.

**Cause.** `armR` positive sends the right/near arm toward −x, i.e. across the body. The scenes that use the wrong sign are `act1.js:116` (`armL −2.05`, `armR +.85`), `act2.js:35` (`−1.9 / +1.9`), `act2.js:708` (`−2.5 / +2.5`), `act2.js:874` (`−2.55 / +2.55`), `act4.js:160` (`−2.3 / +2.4`), `act4.js:1121` (`−2.2 / +2.2`). D.md:248 already names it: “the `armR` sign is inverted: `+2.5` sends the right arm up-left across the mouth. Use `armR: −2.5`, `armL: +2.5` for a V.” The source defaults (`src:385-386`, `:571-572`) are inverted too, so any pose that omits an arm inherits the cross-body swing (`J-defaults.png`).

**Delivered?** Yes in the same scenes (the delivered frames show the sleeve over the mouth), and **still in current source** because the scene data was not changed.

### 2.3 Current source: frog knees / twisted shins

**Observed.** At t=36.6 (dance1), t=148 (finaldance), t=23.4 (chorus1), every planted leg has the knee bent **outward** ~30 px and the shin angled **inward**; the silhouette is bow-legged. The delivered gym at 39.0/40.6 is worse (dismembered), but the frog is present even when the limbs are attached.

**Cause.** The idol hip is −306 and the leg is 158+118 = 276, so full extension reaches y = −30. The library foot target is y = −39, 9 px **beyond** reach; `solveLeg` clamps and spends the 9 px of slack by swinging the knee outward: `kneeBend = −0.513 rad` (29°) for the left leg at the Nova idle target. The boot sole is 41 below the ankle, so at rest the boot also **sinks** ~9 px below the shadow. `office.js:61-66` documents the exact fix for the office rig: “the hip sits 273 above the feet and the leg is 156+117=273 long, so a standing foot is straight. The old 258 left 15 units of slack, and the 2D solver spent it by swinging the knee 60 px sideways: a clean front view read as a frog.” The office rig uses HIP −281; the idol needs HIP **−315** (leg 276 + boot sole 41 − boot draw offset 2 = 315), not −306.

**Delivered?** The delivered film has the same geometry plus the mirrored limb; current source still has the frog because the hip was only raised 6 px (source −300 → vendor −306), not 9 more.

### 2.4 Current source: floating feet / no contact solve

**Observed.** Delivered: SOL floats 25 px above the basilisk head (D.md:94), 12 px above the kart (C.md:71), MIRA 62 px above the cage floor (C.md:93), foom boots inside the rocket (B.md:328), boss tray 38 px below the hand (A.md:110). Current: the finale lead's boots sit on the floor, but the chorus boots at t=36.6 tilt and one edge lifts; the source root bounce moves the shadow with the body.

**Cause.** Foot targets are world-space arrays, not attached to the moving surface; `boot` rotates the whole boot by `shinAngle·0.55`, so a bent shin tilts the sole and lifts one edge; there is no sole-contact solve. The source root translate `y + bounce` (`src:394`) moves the shadow and the feet together; the vendor fix applies bounce to the body only (`vendor:420-423`) and keeps the shadow at (0,0). Scene-level contacts (basilisk, kart, cage, rocket) are separate: the character's `y` is not derived from the surface.

**Delivered?** Yes; current source still for the rig-level tilt and the source root bounce; scene contacts are per-shot.

### 2.5 Current source: the boot toe is not mirrored

**Observed.** In local space, both boots point +x. For a `flip=+1` character that is screen-right; for `flip=−1` it is screen-left. Either way the **pair is not mirrored**: the left boot's toe points inward toward the right foot, the right boot's toe points outward. `J-vendor.png` shows it clearly at rest.

**Cause.** `boot` draws the toe at local +x (`vendor:76`: `quadraticCurveTo(30,16,30,30)`), and `drawLeg` calls it for both sides with no `side`/`scale(side,1)` (`vendor:473`). The `mira` sneaker and the office shoe also shift the ankle `+4` for both feet (`mira:662`, `office:121`), which is inward for the left foot and outward for the right; the idol boot has no `+4` but the same unmirrored toe.

**Delivered?** Yes; current source still.

### 2.6 Current source: Mira and office hands are in torso space

**Observed.** Delivered: MIRA's hand 70 px from the cuff (G.md:47), 7×10 px with no thumb (F.md:240), 97 px from the laptop lid (I.md:174). Current: at rest the hand overlaps the cuff because the arm is vertical; on a raised arm the hand is offset **down** 10 px, not along the forearm, and can detach.

**Cause.** Vendor `mira:795-796` draws `blobPath(wrist[0], wrist[1] + 10, …)` **outside** the cuff's `translate/rotate` frame; source `mira:728` is the same. The office rig does the same (`office.js:393-398`). Only the vendor `idol` draws the hand **inside** the cuff frame (`vendor:577-591`): `translate(wrist); rotate(a1+a2)`, hand at (0,12), finger at (9,18), thumb at (side·8,7). That is the clean construction.

**Delivered?** Yes; current source still for `mira`/`office`; the `idol` hand is fixed.

### 2.7 Other current-source / integration defects

| Defect | Evidence | Cause |
|---|---|---|
| **Idol mic prop is mirrored** | latent; no scene uses `o.mic` | `vendor:596` / `src:546` computes `45 + sin(a1)·104 + sin(a1+a2)·88`, but the wrist is `45 − sin(a1)·104 − sin(a1+a2)·88`; the mic is drawn on the opposite side of the shoulder, up to 300 px from the hand. |
| **Idol finger is not mirrored** | all idol hands | `vendor:584` finger at `(9,18)` for both sides; thumb at `side·8` mirrors. The right hand has thumb and finger on the same side (a two-thumb mitten). |
| **Expressions do not reach the idol face** | Nova/Mira 4 expressions | `recipes.js:1459-1493` maps `open/brow` to `eyes: wide/dot/closed` + `browLift` + `mouth`; the idol `face` reads `eyes: normal/closed/happy/wink/heart/star/swirl/narrow/x/spiral`, `mouth: smile/grin/o/flat/pout/wobble/sing`, `browY`, and ignores `browLift`/`wide`. Nova `smile` (brow .2) maps to a **flat** mouth; `surprise` (brow .9) maps to a **smile**; `neutral`/`smile` collapse to the same face. |
| **Hand/foot anchors are declared but never published** | `nova.poses.json` anchors; `assets.ts:53` | `rigAnchor` is called only for `hair`, `chest`, `head` (`vendor:432/483/530`; office `:138/222/225`). `ANCHOR_SPACE` has only `head: chest`, `hair: head` (`rig.ts:140-143`). The paint probe cannot measure hand–wrist or foot–shadow from the rig. |
| **Rig-drift guard is incomplete** | `test/rig-drift.test.ts:7-10` | It checks `proofs/s2-paper/vendor/characters.js` and `../src/characters.js` only; it does not check `films/*/vendor/characters.js` or `office.js`. A film-local vendor can drift back to the mirrored endpoint. |
| **Source hair does not ride the lean** | current source; not observed in the sampled delivered frames | `src:400` draws the hair at the rig root with only `headTilt`; vendor `:428-448` draws it inside the torso lean and head pivot. On a bow, the source hair keeps the upright head position and reads as a second head (the `rig-audit.ts:18-26` comment). |
| **Source root bounce moves the shadow** | current source; visible as a bobbing shadow | `src:394` translates the root by `y + bounce`; the shadow at (0,0) moves with it. Vendor `:420-423` keeps the shadow at the ground. |
| **`sway` is not a body sway** | all pose libraries | `idol` passes `sway` only to `pleatedSkirt` (`vendor:478`); `mira` declares it and never uses it (`vendor:620`); `office` does not read it. A `sway` of 4–12 moves the skirt hem, not the hips. |

---

## 3. The clean rig — how a new film should call it

### 3.1 The call

```js
// score.json cast entry
{ "character": "Nova", "rig": "idol@0.2.0", "poses": "cast/nova.poses.json" }

// painter (styles/paper-kpop/canvas/recipes.js:323)
drawCharacter("nova", x, groundY, s, poseName, flip, poseOverride, t);
```

- `drawCharacter` resolves the rig from the **score cast** (`rigFor`, `recipes.js:300-314`), the pose from the **library** (`poseFor`, `:159-178`), the colours through the pack palette (`colorsFor`, `:286-292`), and the living hold (`livingPose`, `:414-422`). Do not call `idol()` directly in a recipe.
- `poseName` must exist in the library; a missing name is a loud error, not a fallback.
- `poseOverride` must be a **complete** pose: both `armL`/`armR`, both `legL`/`legR`, both `footL`/`footR` when the feet are planted. A partial dict inherits the rig default, and the source default is inverted.
- `flip` must be **+1 or −1**; `s` positive; `t` is the shot-local time. Do not add a second `Math.sin` to the arms in the scene; that breaks the pose contract and can cross the face.
- `y` is the ground point; the shadow is at (0,0); the character is drawn in world coordinates inside `beginCam`/`endCam`.

### 3.2 The constants a new film must use

- **Idol:** `HIP = −315` (not −306, not −300), thigh 158, shin 118, foot target y = −39, boot sole 41, boot drawn at `ankle[1] − 2`. This makes the standing leg straight and the sole at ground 0. If the boot geometry changes, re-solve the hip; do not mix a new sole with the old hip.
- **Mira:** `HIP = −281` (not −272, not −270), thigh 156, shin 117, foot y = −8, sneaker sole 10. This is exactly the office geometry.
- **Office:** `HIP = −281` already correct (`office.js:66`).
- **Shoulder/arm:** idol ±45,−516, 104+88, hand 22×32; mira ±38,−448, 92+78, hand 18×26 + thumb. Do not change limb lengths for cast variation.
- **Boot:** mirror with `ctx.scale(side, 1)`; toe at local +x inside the mirrored frame; for the `mira`/office shoe use `ankle + side·4`, not `+4`; the idol boot is centred on the ankle; sole bottom at ground 0.
- **Hand:** draw inside `translate(wrist); rotate(a1+a2)`, hand at (0,12), finger at (9,18), thumb at `side·8,7` (mirror the whole hand, not only the thumb). The hand's near edge must overlap the cuff by 4 px.

### 3.3 Safe ranges (radians unless stated)

| Parameter | Safe range | Notes |
|---|---|---|
| `armL[0]` | **+0.05 … +2.55** | + = out-left; rest +0.14; T +1.57; V +2.0…+2.45; overhead max +2.55. Never negative for the left arm unless the pose is deliberately cross-body. |
| `armR[0]` | **−2.55 … −0.05** | − = out-right; rest −0.14; T −1.57; V −2.0…−2.45; overhead max −2.55. Never positive for the right arm unless cross-body. |
| `armL[1]` / `armR[1]` | **−2.2 … +2.2** | Elbow delta. For a raised arm (`|a1| > 1.8`) keep `|a2| ≤ 0.55`; for a cross-body pose (clap/heart/mic) `|a2|` can reach 1.8–2.2 but the hand must stay **below the chin** (y ≥ −480) and outside the face box. |
| `legL[0]` / `legR[0]` | **−0.9 … +0.9** | Only when no `footL`/`footR`; with a target, `solveLeg` overrides. |
| `legL[1]` / `legR[1]` | **−1.2 … +1.2** | Shin delta; a kick can reach 1.8 with a foot target. |
| `footL`/`footR` | within `l1+l2−1` of the hip | Idol 275, mira 272, office 272. A target beyond reach clamps silently and lifts the foot. |
| `footPitchL/R` | **−0.35 … +0.25** | Added to `shinAngle`; the boot then rotates `·0.55`, so the visible sole tilt is ≤0.19 rad. |
| `lean` | **−0.25 … +0.65** | Torso/head/arms; a stage bow is 0.4, a deep bow 0.65. The hair must ride it. |
| `headTilt` | **−0.25 … +0.30** | Roll about the neck. |
| `headTurn` | **−0.35 … +0.35** | 2D rotation, not a yaw; use `look` for the eyes. |
| `bounce` | **−40 … +12** | Body only; shadow and planted feet stay. A jump is −30…−40 with both feet lifted. |
| `sway` | **−12 … +12** | Skirt hem only; **not** a hip shift. Use `lean` + a root x offset for weight. |
| `s` | 0.5 … 1.5 | Full figure; the shadow scales with it. |
| `flip` | **−1 or +1** | Never 0. |

### 3.4 Elbow floor

- **Every visible arm: `|a2| ≥ 0.175 rad` (10°).** The library's `body.minElbow` is 0.02 rad (1.1°) — too low for a readable elbow; the delivered sparks reads as “two straight tapered tubes” (A.md:77) even with `a2 = 0.25–0.32`, because the bend is buried in a long sleeve. Use 10° as the hard floor and 15–20° for a raised arm.
- **Both elbows < 0.02 rad is a plank** (`pose.ts:191-196`); a new test should raise that to 0.175 for a visible arm.
- Never let `a2` cross 0 inside a blend; a straight elbow between two bent poses is a snap. Add a keyframe or keep the sign.

### 3.5 Hands

- **Idol:** hand 22×32, finger 10×16, thumb 7.6×11.2; hand center 12 units beyond the wrist along the forearm; near edge overlaps the cuff by 4 px. Thumb on the **inner** edge for a palm-forward wave; mirror the whole hand with `side`.
- **Mira/office:** move the hand into the cuff frame; add a thumb; use the same 12-unit offset. A world-space `wrist + (0,10)` hand is only correct when the arm is vertical.
- **Every visible arm ends in a hand.** A cuff with no hand is a fail; a hand with no sleeve is a fail.

### 3.6 Feet

- A planted foot has a **foot target**; the sole's lowest point is within 2 px of the shadow/ground; the boot is mirrored; the toe points along the foot's travel.
- The boot's `ang·0.55` rotation means a bent shin tilts the sole. For a planted foot with a bent knee, either set `footPitch` to cancel the tilt or keep `|kneeBend| ≤ 0.12 rad`.
- A jump/lift has **no** foot target (or a lifted target) and both feet ≥20 px above the shadow; the shadow stays at the ground.

### 3.7 The far arm / near arm

- **Far arm (`armL`, side −1)** is drawn before the torso, skirt and head (`vendor:450-455`). It cannot cover the face, but its **hand can float above the flower** if the arm is hidden and the hand extends beyond the halo (A.md:77). Rule: the far hand is either fully outside the torso+head silhouette **with the arm visible**, or fully hidden. No hand-only.
- **Near arm (`armR`, side +1)** is drawn after the head (`vendor:557`), so it can cover the face. Rule: the near arm's sleeve polygon must not intersect the face box `x ±49, y [−670, −538]` for >0.1 s; the mouth pixel (0,−572) must be visible in ≥90 % of frames.
- For a deliberate cross-body pose (clap/heart/mic), keep the hand **below the chin** (y ≥ −480) and the forearm outside the face box; if the pose needs the hand at the mouth, draw the near arm **before** the head or split the arm at the elbow so only the hand crosses the face.
- The `wave`/`point`/`turn`/`lift` poses keep the hands at x ≈ ±200, y ≈ −600 — outside the face box. The `clap`/`heart`/`mic` hands are at x ≈ 0, y ≈ −400…−440 — below it.

---

## 4. Pose vocabulary

### 4.1 Nova — 8 poses, 4 expressions

| Pose | What it is for | Key params |
|---|---|---|
| `idle` | neutral stand, breath | lean −0.02, headTilt .03, arms ±0.25, feet ±36,−39 |
| `reach` | right arm up/out, left down; reaching to the right | `armR [−1.43,−0.12]`, `armL [0.2,0.05]`, headTurn −0.18 |
| `point` | left arm up/out, right down; pointing left/up | `armL [1.85,0.45]`, `armR [−0.35,0.25]`, lean .06 |
| `turn` | both arms up/out (V), body sway; spotlight/turn | `armL [2.15,0.2]`, `armR [−2.15,−0.2]`, sway −8 |
| `lift` | left arm overhead, right foot lifted; step/lift | `armL [2.35,0.1]`, `armR [−0.45,0.35]`, `footR [32,−99]`, pitch −0.35 |
| `duet-left` | left arm up, right down; duet facing left | `armL [2.4,0.3]`, `armR [−0.5,0.35]`, sway 8 |
| `duet-right` | left down, right arm up; duet facing right | `armL [0.5,0.35]`, `armR [−2.4,−0.3]`, sway −8 |
| `bow` | stage bow (23°) | lean .4, headTilt .22, arms ±0.15 with elbow ±0.55 |

Expressions: `neutral` (open .85, brow 0), `smile` (open .9, brow .2, smile .6), `surprise` (open 1.2, brow .9, mouthOpen .4), `tender` (open .7, brow .4, smile .5). **These are office-rig params, not idol face params**; see §2.7. Author idol expressions directly in `eyes`/`mouth`/`browY`/`look`/`sing`.

### 4.2 Mira — 8 poses, 4 expressions

| Pose | What it is for | Key params |
|---|---|---|
| `idle` | neutral stand | lean .02, arms ±0.3, feet ±28,−8 |
| `step` | right foot forward/lifted; walk | `footR [32,−26]`, pitch −0.3, `armL [0.6,0.2]` |
| `point` | left arm up/out | `armL [1.75,0.4]`, `armR [−0.4,0.2]` |
| `turn` | both arms out; turn | `armL [1.2,0.1]`, `armR [−1.2,−0.1]`, sway −8 |
| `listen` | left hand up/out, head tilt; listening | `armL [0.9,1.2]`, `armR [−0.3,0.4]`, headTilt .15 |
| `duet-left` | left arm up, right down | `armL [2.2,0.3]`, `armR [−0.55,0.3]` |
| `duet-right` | left down, right arm up | `armL [0.55,0.3]`, `armR [−2.2,−0.3]` |
| `bow` | stage bow (23°) | lean .4, headTilt .2, arms ±0.15/±0.55 |

Expressions: `neutral`, `smile`, `alarm` (open 1.3, brow .9, mouthOpen .5), `tender`. Mira's `face` supports `wide`, `o`, `grin`, so the office adapter works better here.

### 4.3 What is missing for a KPOP performance

The basic reach/point/turn/lift/duet/bow are present. Missing: **wave, clap, mic-hold, heart-hands, hand-on-hip, kick, jump, crouch, look-back, hair-flip, arms-crossed (below the face), deep bow, point-down/up, finger-gun, sing, wink, star, pout, determined, laugh.** There is no group/formation pose (the duet is a mirrored pair, not a 3–5 body formation), no seated/chair pose, no fall/land, and no prop-hold pose (mic, phone, lightstick).

### 4.4 A minimal added set (vendor convention, radians)

These are proposals, validated visually on the vendor (`J-poses.png`); the new test must still pass them. They keep the hands out of the face box and the elbows within the rig.

| Pose | Params | Use / check |
|---|---|---|
| `wave` | `armL [2.05, 0.30]`, `armR [−0.18, 0.08]`, `headTilt 0.05`, `headTurn −0.08`, `footL [−34,−39]`, `footR [36,−39]` | hand above the left shoulder, out-left; elbow 17°; face clear |
| `clap` | `armL [0.50, −1.80]`, `armR [−0.50, 1.80]`, `lean 0.04`, `headTilt 0.02`, `footL [−34,−39]`, `footR [36,−39]` | forearms cross the **chest**, hands meet at (0,−401); below the chin; elbows 103° |
| `mic` | `armR [−0.35, 1.60]`, `armL [0.15, 0.08]`, `headTilt −0.04`, `footL [−34,−39]`, `footR [36,−39]` | right hand at the centre chest (0,−390); the mic prop angles up to the mouth; no face cross |
| `heart` | `armL [0.35, −2.20]`, `armR [−0.35, 2.20]`, `headTilt 0.08`, `footL [−34,−39]`, `footR [36,−39]` | hands meet at (0,−439), below the chin; elbows 126° |
| `hip-hand` | `armL [0.55, −1.25]`, `armR [−0.15, 0.08]`, `sway 3`, `footL [−34,−39]`, `footR [36,−39]` | left hand at the waist (−43,−360), elbow out; gap to torso ≥20 px |
| `kick` | `armL [1.40, 0.20]`, `armR [−0.60, 0.10]`, `lean −0.08`, `footR [60,−110]`, `footPitchR −0.20`, `footL [−34,−39]` | right foot forward/up, knee bend ~1.7 rad; left foot planted |
| `jump` | `bounce −40`, `legL [0.25,−0.80]`, `legR [−0.25,0.80]`, `armL [2.0,0.2]`, `armR [−2.0,0.2]` | both feet off the ground; shadow stays; knees tucked |
| `bow-deep` | `lean 0.65`, `headTilt 0.30`, `armL [0.20,0.15]`, `armR [−0.20,−0.15]`, `footL [−33,−39]`, `footR [33,−39]` | 37° stage bow; hair/head ride the lean; head–chest ≤2 px |

Expressions (idol vocabulary, not `open/brow`): `wink` `{eyes:'wink', mouth:'smile', blush:.6, browY:-1}`; `sing` `{eyes:'closed', mouth:'sing', sing:.7, blush:.5}`; `star` `{eyes:'star', mouth:'grin', blush:.7}`; `pout` `{eyes:'narrow', mouth:'pout', blush:.4, look:[0,-.2]}`.

---

## 5. Cast construction — 2–3 distinct characters from one clean rig

### 5.1 Vary only cosmetics

| | Lead | Foil | Third |
|---|---|---|---|
| `s` | 1.00 | 0.94 | 1.06 |
| `headScale` (new, about the head centre) | 1.00 | 0.96 | 1.04 |
| `colors.jacket` | red | teal | gold |
| `colors.sleeve` | cream | cream | ink |
| `colors.skirt` | blue | ink | cream |
| `colors.boot` | red | teal | gold |
| `colors.hair` | ink | `#2B2430` | `#4A2B32` |
| `colors.skin` | `#F0C9A4` | `#D9A87E` | `#E8B98F` |
| `hairStyle` (new) | long bob | high ponytail | short crop |
| `outfit` | `stage` | `gym` | `jazz` |
| `flower` | sun | daisy | tulip |
| `flowerR1` | 146 | 120 | 100 |
| `petals` | 22 | 16 | 12 |
| default face | normal / smile | narrow / flat | star / grin |

- **Height** is `s`; the ground point and shadow scale with it.
- **Head/body ratio** is `headScale` about the head centre (or the neck, with a ≥6 px neck overlap); the face, eyes, mouth, hair, earrings and crown scale together because they are in the head group. The rig does not expose `headScale` today; add it as a cosmetic wrapper, never scale the face plate alone (the eyes/mouth would detach).
- **Hair silhouette** needs a `hairStyle` switch (`long`, `pony`, `crop`) that selects among the existing `hairBack`/`bangs`/office hair shapes. The rig has one long bob today; colour alone is not a silhouette.
- **Distinctness**: at 1080p, at least **two** of: height differs ≥6 %, head/body ratio ≥0.2 heads, hair bounding box ≥10 %, torso hue ≥25°. No two characters share rig + hair + outfit.

### 5.2 What must never be randomized per frame

- Identity: `rig`, `poses` library, `colors`, `hairStyle`/hair length, `outfit`, `s`, `headScale`, `flower`/`petals`/`flowerR1`, `face` defaults, `seed`.
- Anatomy: limb lengths, joint positions, shoulder/hip x, foot targets, boot sole, hand size, head pivot.
- Contact: shadow position/alpha, ground line, held-prop offset, foot target.
- Only **time-driven deterministic** params may change: `bounce`, `sway` (skirt), `lean`, `headTilt`, `headTurn`, `hairSwing`, `petalDrift`, `blink`, `sing`, `look`. They must be functions of `t`/`lt`, never `Math.random`, `Date.now` or `requestAnimationFrame`.
- `C.hash` is deterministic; the paper texture/flower seeds are fine. The `paint-purity` test already bans the rest.

---

## 6. Test-version rules — hard checks and thresholds

A new `rig:check` (extend `scripts/rig-audit.ts`; reuse `src/engine/rig.ts`, `pose.ts`, `paint-probe.js`) must pass all of these on **painted frames**, not only on library data.

1. **Hand–wrist.** Every visible arm ends in a hand. The hand's near edge is ≤**4 px** from the cuff end at 1080p (≤3 px at s<0.8); the hand centre is **12 ± 3 rig units** (×s px) beyond the wrist along the forearm. A cuff with no hand is a fail; a hand with no sleeve is a fail. Delivered failures: 70 px (G.md:47), 120–240 px (G.md:94), 10 missing (G.md:184).
2. **Elbow seam and bend.** Upper-arm end to forearm start ≤**0.5 px**; the elbow brad covers the seam (no gap >2 px). Every visible arm `|a2| ≥ 0.175 rad` (10°); a raised arm `0.175–0.55 rad`; a cross-body pose ≤2.2 rad with the hand below the chin. Both elbows <0.02 rad = plank. (A.md:77, C.md:123.)
3. **Foot–shadow.** For a planted foot, the lowest sole pixel is within **2 px** of the shadow/ground line at s=1 (scale by s); the highest sole pixel is ≤6 px above; no foot below the ground >2 px. For a jump/lift, both feet ≥**20 px** above the shadow and the shadow stays at the ground. (A.md:163, C.md:129, D.md:264.)
4. **Knee.** For a planted foot, `|kneeBend| ≤ 0.12 rad` (7°); for a step, `0.15–0.8 rad`; for a kick, `0.3–1.8 rad` and the knee is on the travel side; never >1.8 rad for a planted foot or >2.2 rad for a lifted kick. No knee sign flip within a pose. (The current idol standing knee is ~0.49 rad — fail; office.js:61-66.)
5. **Face clearance.** The near arm's sleeve polygon must not intersect the face box `x ±49, y [−670,−538]` (idol) for >**0.1 s**; the mouth pixel (0,−572) is visible in ≥**90 %** of frames. A hand may enter the face box only for a mic/heart contact and ≤0.15 s. (D.md:263; chorus2/omega fail 100 %.)
6. **Silhouette.** At rest, the arm–torso gap is ≥**8 px** at the elbow and ≥**12 px** at the wrist; the far limb is ≥**12 RGB** darker than the near limb; the near limb edge is ≥**2 px**; the character is one connected alpha component (props excepted). No limb merges into the torso for >0.2 s. (J-defaults.png fails: one arm hidden; source a1=0.05 gives a 3 px gap.)
7. **No limb popping.** Between consecutive 30 fps frames, wrist/ankle position changes ≤**12 px** (except at a cut/pose key); elbow angle changes ≤**0.08 rad/frame**; no `a2` sign flip inside a blend; no limb scale change >5 %/frame. At a cut, the new pose must re-pass checks 1–6. (Use `resolveChain` at 0.1 s steps; `rig-audit.ts:111-120` already has the leg tolerances.)
8. **Foot direction.** In the rig's local space before `flip`, the left and right boot toes mirror within **10°**; the left toe points left of its ankle, the right toe right of its ankle. Both boots pointing +x is a fail (current). (J-vendor.png.)
9. **Hand size.** Hand width ≥**1.5×** thumb width and ≥**0.8×** the cuff; at s=1 the hand is ≥**14×20 px**; at s=0.55 ≥**8×11 px**, or the hand is not shown. The source hand is 18×26 at s=1, 10×14 at 0.55; the vendor is 22×32. (H.md:139, F.md:240.)
10. **Prop contact.** A held prop's centre is ≤**8 px** from the palm centre for ≥**6 frames**; a mic at the mouth ≤12 px. No floating prop. (Delivered: mask 232–380 px, match 145 px, mic 145 px, lid 97 px; B.md:202, F.md:181/241, I.md:174.)
11. **Anchors.** Head centre to chest ≤**2 px** in chest space; hair to head ≤**2 px**; publish `hand-left/right`, `foot-left/right`, `elbow-left/right`, `knee-left/right` from the rig and add them to `ANCHOR_SPACE` (`rig.ts:140-143`). A missing anchor is a finding, not a skip. (Current rig publishes only hair/chest/head; `assets.ts:53` expects hands/feet.)
12. **Determinism.** Same score + seed + t → wrist/ankle ≤**0.5 px** across two workers; no `Math.random`/`Date.now`/`requestAnimationFrame` in the rig path; `paint-purity` passes.
13. **Library.** 8–12 poses, all unique; every pose has both arms and both feet (or a documented partial); silhouette distance ≥**0.12** (`pose.ts:205`); every visible elbow ≥0.175 rad; every foot target within `l1+l2−1` of the hip. (`PoseLibrarySchema`, `pose.ts:93-99`.)
14. **Cast distinctness.** For 3 characters, at least two of: height ≥**6 %**, head/body ratio ≥**0.2 heads**, hair silhouette ≥**10 %**, torso hue ≥**25°**. No two share rig + hair + outfit.

---

## 7. Copy / fix / never

| | Item | Why |
|---|---|---|
| **Copy** | `src/engine/rig.ts` `limbEnd`, `resolveChain`, `solveLeg`, `chainSeamGap`, `placePoint`, `unplacePoint`, `anchorsInSpace` | Single source of truth; the mirrored-endpoint bug is documented there. |
| **Copy** | Vendor `idol` upper body, hand-in-cuff frame, bounce hierarchy, hair-in-lean | The only clean arm/hand construction; the only correct bounce/lean hierarchy. |
| **Copy** | Office `officeFigure` leg constants: HIP −281, 156+117, foot −8, shoe sole 10 | A standing leg is straight; the frog fix. |
| **Copy** | `pose.ts` body/hand/plank checks; `paint-probe` anchor records | Already measured; extend, don't duplicate. |
| **Fix** | Source defaults `armL/armR/legL/legR` (inverted) | Use vendor +0.14/−0.14, +0.035/−0.035. |
| **Fix** | Scene pose signs (`act1.js:116`, `act2.js:35/708/874`, `act4.js:160/1121`) | `armL` positive, `armR` negative for a V; D.md:248. |
| **Fix** | Idol HIP −306 → **−315**; Mira −272 → **−281** | Straight standing leg, sole at ground. |
| **Fix** | Source root bounce (394) and hair (400) | Shadow stays; hair rides the lean. |
| **Fix** | Boot mirror; `mira`/office ankle `side·4` | Both toes currently point +x. |
| **Fix** | Mira/office hand into the cuff frame; add thumb | World-space hand detaches on a raised arm. |
| **Fix** | Idol mic `+sin` → `−sin`; finger mirror | Prop/hand on the correct side. |
| **Fix** | Idol expression adapter / explicit `eyes`/`mouth` | `browLift`/`wide` do not reach the idol face. |
| **Fix** | Hand/foot anchors; `ANCHOR_SPACE`; `test/rig-drift` for every vendor | The test cannot measure what the rig does not publish. |
| **Never** | `Math.random`, `Date.now`, `requestAnimationFrame` in the rig | Determinism; `paint-purity`. |
| **Never** | Per-frame colours, hair, proportions, seed, rig, pose library | Identity must not flicker. |
| **Never** | Partial pose (one arm/foot) | Inherits the inverted source default. |
| **Never** | `flip=0`, negative `s`, `|a1|>2.6`, `|a2|>2.2` | Degenerate transforms / folded limbs. |
| **Never** | Foot target beyond `l1+l2−1` | Silent clamp → floating foot. |
| **Never** | Near arm across the face; far hand without the far arm | The two occlusion failures. |
| **Never** | Use `src/characters.js` defaults or the old mirrored `limb` | The default trap and the delivered dismemberment. |
| **Never** | Use `sway` as a hip shift | It is a skirt-hem parameter. |

---

## 8. Evidence index

- Source: `src/characters.js:27/28-51/54-67/372-554/567-735`; `src/engine/rig.ts:1-165`; `src/engine/pose.ts:28-53/169-196/205-242`.
- Vendor: `studio/films/understudy/vendor/characters.js:28-51/55-68/71-84/390-392/399-604/617-803`.
- Office: `studio/films/same-alarm/vendor/office.js:45-404`, especially `:61-66`, `:101-131`, `:368-400`.
- Painter: `studio/styles/paper-kpop/canvas/recipes.js:159-178/300-352/366-371/414-422/1459-1541`.
- Audit: `studio/scripts/rig-audit.ts:1-26/111-120`; `studio/src/engine/paint-probe.js:286-315`; `studio/test/rig-drift.test.ts:7-20`; `studio/src/engine/assets.ts:53`.
- Pose libraries: `studio/films/understudy/cast/nova.poses.json`, `mira.poses.json`; `studio/films/same-alarm/cast/kiran.poses.json`, `vaz.poses.json`.
- Delivered frames: `out/analysis/tmp/sparks-3.0.png`, `boss-14.0.png`, `chorus1-23.4.png`, `foom-25.2.png`, `dance1-36.6.png`, `curtain-143.0.png`, `finaldance-148.0.png`.
- Current re-renders: `out/analysis/tmp/current/t3_00.png` … `t148_00.png`.
- Rig comparisons: `out/analysis/tmp/J-defaults.png` (source defaults), `J-vendor.png` (vendor defaults), `J-poses.png` (Nova + proposed poses).
- Act reports: A.md:77/110/132/148/163; B.md:202/328; C.md:49/71/93/110/123/129; D.md:65/94/160/248/263/264; E.md:42/153/156; F.md:181/184/240/241/280; G.md:47/94/184/211; H.md:139; I.md:174/180.
