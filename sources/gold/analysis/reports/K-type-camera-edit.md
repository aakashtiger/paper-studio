# K — Type, camera, editing and HUD in the KPOP gold standard

**Subject:** `out/claude-pop.mp4` — 1920×1080, 30 fps, 4,699 frames, 156.62 s, 51 shots.
**Scope:** cross-cutting review of shot rhythm, camera grammar, type, HUD/print marks and
transitions. No source or film file was edited. Numbers below are measured, not estimated;
where a number is analytical (camera travel) the expression is given so it can be re-derived.

---

## 0. Method and instruments

| Instrument | What it gave |
|---|---|
| `out/analysis/shots.json` | 51 shots, start/end/duration (frame-snapped to 30 fps) |
| `out/analysis/frame-diff.json` | per-frame mean / max / 9-region luma diff at 192×108, 4,699 frames |
| `out/analysis/shots-15/*.png` | 15 samples/s per shot (every 2nd frame), 320×270 cells |
| `out/analysis/cuts-30/*.png` | 30 consecutive frames around each cut (0.5 s each side) |
| `src/*.js`, `src/scenes/*.js` | every `setCam`, `flash`, `irisOverlay`, `TY.*` call with line numbers |
| `assets/song.wav` (mono 44.1 kHz) | tempo and beat phase, by onset-flux comb filtering |
| `out/analysis/tmp/time-hud.mjs` | HUD/post draw cost, Chrome 1920×1080, 60 frames, encode excluded |
| `out/analysis/tmp/pix2.mjs` | delivered-frame pixel boxes (type, band, ticker, boots) |

Two facts frame everything that follows:

* The film is **cut to the vocal line map, not to the beat** (§1.3).
* The film is **a flat 2D plane with one affine camera**, not 2.5D: `grep parallax src` returns
  nothing, and every scene draws background, cast and foreground inside one
  `beginCam/endCam` (`core.js:313-320`). `STORYBOARD.md:4` ("Camera is 2.5D:
  bg / mid / character / fg / type") is not implemented.

---

## 1. Shot rhythm

### 1.1 Distribution (n = 51, 50 cuts, 156.62 s)

| min | p25 | median | p75 | max | mean | cuts |
|---|---|---|---|---|---|---|
| **0.66 s** (chair, 20 f) | **1.94 s** | **3.06 s** | **3.67 s** | **6.14 s** (cage, 184 f) | **3.071 s** | **50** |

Band check (min 1.0 s, median 2.5–3.0 s, max 4.5 s):

| band | shots | share |
|---|---|---|
| < 1.0 s | 1 (chair 0.66) | 2 % |
| 1.0–2.0 s | 15 | 29 % |
| 2.0–2.5 s | 5 | 10 % |
| **2.5–3.0 s** | **3** (dance1 3.00, fuse 2.94, gym 2.86) | **6 %** |
| 3.0–4.5 s | 19 | 37 % |
| > 4.5 s | 9 | 18 % |

* In band 1.0–4.5 s: **42/51 (82 %)**.
* Median **3.06 s** sits 0.06 s *above* the 2.5–3.0 target and only 6 % of shots are inside it.
  The film is systematically **long**, not short: 28/51 shots (55 %) exceed 3.0 s.
* Nine violations: **chair 0.66** (short); **chase 4.82, accel 4.54, cage 6.14, vault 4.62,
  gato 5.86, curtain 5.32, finaldance 5.00, desk 5.62** (long).
* The storyboard's own claim is wrong three ways: 54 sections in `STORYBOARD.md`, "52 shots,
  average 3.0 s" in `PRODUCTION.md:80`, **51 shots / mean 3.071 s** delivered.

### 1.2 Runs

| run | shots | window | length | mean |
|---|---|---|---|---|
| longest single shot / longest hold without a cut | 1 | 52.80–58.94 | **6.14 s** | — |
| shortest shot | 1 | 73.80–74.46 | **0.66 s** | — |
| longest run of shots **> 3.0 s** | 7 (mlp…pto) | 74.46–102.46 | **28.0 s** | 4.00 s |
| longest run of shots **< 2.2 s** | 6 (trust…gpus) | 109.40–120.92 | **11.52 s** | 1.92 s |
| longest run of shots **≥ 4.0 s** | 3 (curtain, finaldance, desk) | 140.68–156.62 | **15.94 s** | 5.31 s |
| cut rate | — | 0–156.6 s | 12–28 cuts/min | 19.2/min |

There is no accelerando: the fastest windows are 60–75 s and 105–120 s (28 cuts/min), the
slowest 45–60 s and 90–105 s (12 cuts/min). The rhythm is episodic, keyed to song sections.

### 1.3 Where the cuts actually land

| grid | result |
|---|---|
| **lyric line boundaries** (`src/lyrics.js:6-52`) | **47/50 cuts at 0.0 frames**; the 3 others are instrumental (dance1 45 f from any boundary, finaldance, desk) |
| 30 fps frame grid | all 50 within 1 frame (median 6.7 ms, max 16.7 ms) |
| **88 BPM** (`core.js:47-48`, beat 0.6818 s, offset 0.21 s) | **4/50 within 15 ms**; 11/50 within 2 frames (67 ms); **median 121 ms (3.6 f)**; worst museum→canyon **−337 ms (10.1 f)** |

Cuts within ±1 frame of the beat: chorus1 +10 ms, gpus −6, disobey −12, curtain +15, fuse −23,
rlhf +28. Everything else is a lyric edit. This is the single most important rhythm fact:
**a line is as long as it is sung**, which is why 9 shots fall outside a 1.0–4.5 s band.

Measured tempo (onset-flux comb over `assets/song.wav`): **132 BPM is the dominant periodicity**
(score 3.16, phase 23.41 s ≡ 0.23 s), **88 BPM is present** (score 2.14, best phase **0.60 s**,
3:2 with 132). `C.beat` uses offset **0.21 s**, which is 0.02 s from the 132 phase but **0.39 s
(0.57 beat, 12 frames)** from the best 88 fold — the 88 phase is ambiguous in this mix, so no
"on the beat" claim can be made from the code. `C.three` (132) is well calibrated.

### 1.4 Do the cuts register?

Mean luma diff at the cut frame (192×108): median **51.7**, p25 11.8, p75 83.6, max 144.8.

* **12/50 cuts change the frame by < 10** — effectively invisible: singularity→accel **0.3**,
  reveal→curtain **0.3**, museum→canyon **0.5**, disobey→chinchilla **0.5**, tower→disobey **0.6**,
  cdr→gato 1.1, canyon→cdr 1.3, rlhf→redalert 4.5, fences→gpus 5.4, ilya→breath 5.4,
  cage→chorus2 6.3, foom→chinese 8.1.
* **18/50 are < 25** (the floor report F sets for a hard cut).

---

## 2. Camera grammar

### 2.1 The primitive set (all of it)

`setCam(x, y, z, r, shake, t)` — `core.js:307-312`; `beginCam` applies
`translate(W/2+sx, H/2+sy) · rotate(r) · scale(z) · translate(−x, −y)` — `core.js:313-319`.

| axis | exists | range used | notes |
|---|---|---|---|
| x | yes | 760–1430 (world) | pan only |
| y | yes | 480–668 | tilt (vertical pan) |
| z | yes | **0.84 → 3.55** | push/pull |
| r (roll) | yes | **0 → 0.13 rad (7.4°)** | Dutch, not tilt |
| shake | yes | **1–12 px** at 71/63 rad/s = **11.3/10.0 Hz** | sine, not handheld |
| orbit | **no primitive** | faked: dance1 `x = 960 + sin(lt·1.3)·28` (`act2.js:344`), finaldance `translate(sin(lt·0.7)·50)` (`act5.js:268`) | a ±28/±50 px sway, 1.5–2.6 % of frame width |
| track | **no** | — | the whole plane moves, so there is no subject-relative track |
| parallax | **no** | — | one plane; no depth layers |
| handheld | **no** | — | the only "handheld" is the 10–11 Hz sine above |
| whip | **no** | canyon = `roll −0.045·whip, shake 10·whip` (`act3.js:800`) | a 2.6° roll + shake, no translation |
| crash zoom | by z | chorus1 1.70→1.05 in 0.45 s (`act2.js:25`) | reads |
| snap zoom | by z | shoggoth 1.02→1.27 in 0.25 s (`act2.js:256`) | reads |

Easing: `C.kf` with `C.ease` (quadratic in-out) for keyed moves (`core.js:36-46`); linear
`C.lerp`+`C.seg` for x/y pans; `C.easeOut` for the three hand-rolled pulls (reveal, desk,
recursive); sine for sway/roll/shake.

### 2.2 Every declared camera, with its numbers

Edge speed = `960·Δz/(dur·30)` px/frame for scale, `Δx/(dur·30)` for pan. **1 px/frame = 30 px/s.**

| # | shot | keys (file:line) | Δx / Δy | z | roll | shake | edge px/f | verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | cold | `act1.js:41` | 0 | .84→1.05 (+25 %) | ±0.7° | 0 | 4.5 | **reads** |
| 2 | sparks | `act1.js:95` | −470 / +210 | 3.55→1.04 (−71 %) | 0 | 0 | 33.7 peak, 0.9 tail | **reads** (1.9 s), then still |
| 3 | circuits | — | — | — | — | — | 0 | **none** |
| 4 | loss | `act1.js:268` | 0 / +170 | 1.00→1.16 | 0→−4.0° | 2→8 | 1.6 / 1.5 | **reads** |
| 5 | boss | — | — | — | — | — | 0 | **none** |
| 6 | mugs | `act1.js:401` | 0 | .90→1.03 | 0 | 0 | 3.3 | **reads** |
| 7 | chase | `act1.js:463` | 0 | 1.02→1.42 | 0 | 5 after 3.2 s | 3.0 | **reads** push, **no whip** |
| 8 | chorus1 | `act2.js:26` | −410 | 1.70→1.05 | 0 | 7→1 | 50 peak | **reads** crash-out |
| 9 | foom | `act2.js:73` | 0 | 1.02 const | 0 | 2→12 | 0 | **none** (tilt/track unpainted) |
| 10 | chinese | `act2.js:172` | 0 | 1.02 const | ±0.86° / 18 s | 0 | 0 | **none** |
| 11 | shoggoth | `act2.js:256` | 0 | 1.02→1.27 in .25 s | 0 | 10 | 32 peak | **reads** (0.25 s) |
| 12 | eyes | — | — | — | — | — | 0 | **none** |
| 13 | dance1 | `act2.js:345` | ±28 | 1.04 const | ±0.86° | 3 | 1.2 max | **weak** ("360 orbit") |
| 14 | gym | `act2.js:385` | 0 | 1±1 % sine | 0 | 1 | 0.3 | **weak** ("lateral track") |
| 15 | singularity | `act2.js:417` | 0 | 1.02 const | 0→7.4° | 2→11 | 2.4 at corner (roll) | **reads roll**, **no push** |
| 16 | accel | `act2.js:483` | +300 in 3 s | 1.04 const | −0.86° | 5 | 3.3 then 0 | **reads** 3 s of 4.5 |
| 17 | atoms | `act2.js:557` | 0 | 1.00→1.115 | ±2.3° | 0 | 1.1 | borderline |
| 18 | cage | `act2.js:607` | 0 | 1.02→1.10 in 4 s | 0 | 1 | 0.62 | **weak** |
| 19 | chorus2 | `act2.js:702` | 0 | 1.05→1.09 | 0 | 8→2 | 0.77 | **weak** |
| 20 | basilisk | `act2.js:728` | 0 | 1.02 const | 0 | 8 | 0 | **none** |
| 21 | nvda | — | — | — | — | — | 0 | **none** |
| 22 | omega | `act2.js:856` | 0 | .96→1.12 | 0 | 1 | 2.75 | **reads** push only |
| 23 | gpuplanet | `act2.js:902` | 0 | 1.08→1.00→1.08 | 0 | 1 | 1.9 | **reads** |
| 24 | vault | `act2.js:949` | 0 | 1.00→1.08 in 4.6 s | 0 | 2 | 0.56 | **weak** ("orbit") |
| 25 | chair | `act3.js:188` | 0 | 1.03→1.00 | 0 | 0 | 1.4 | **reads** tiny pull |
| 26 | mlp | `act3.js:261` | 0 | 1.02 const | 0 | 0 | 0 | **none** |
| 27 | museum | `act3.js:498` | +70 | 1.02→1.09 | 0 | 7 / .35 s | 0.63 | **weak** |
| 28 | canyon | `act3.js:800` | 0 | 1.03 const | ±2.6° whip | 10 | 1.4 at corner | **weak** |
| 29 | cdr | `act3.js:968` | +90 | 1.00→1.035 | 0 | 0 | 0.67 | **weak** |
| 30 | gato | `act3.js:1144` | +24 / +120 late | 1.06→1.11 | ±0.7° | 8 / .15 s | 0.16 (6.1 for .66 s) | **weak** |
| 33 | fuse | `act4.js:456` | 0 | 1.02→1.07 | ±0.34° @4.9 Hz | 4 | 0.62 | **weak** |

Hand-rolled transforms (not `setCam`): **reveal** `z 1.55→1.00` over 1.9 s `easeOut`
(`act5.js:46`, 9.3 px/f), **desk** `z 2.60→1.00` over 2.0 s (`act5.js:342`, 26 px/f),
**recursive** `z 1.35→1.00` over 1.2 s (`act4.js:1375`), **clips / pto** (45 % / 24 % then
static, per report F), **rlhf** (0.13 rad + 900 px slide, report G), **fences** (lateral
track), **finaldance** (±50 px).

### 2.3 Coverage

| verdict | shots | seconds | share |
|---|---|---|---|
| **none** — no readable camera (16 with no transform at all; 4 with a constant `setCam`) | **20** (circuits, boss, foom, chinese, eyes, basilisk, nvda, mlp, jazz, trust, tower, disobey, chinchilla, gpus, redalert, loom, masked, ilya, breath, curtain) | **51.2 s** | **32.7 %** |
| **weak** — < 1 px/frame, or one brief move | 14 (dance1, gym, atoms, cage, chorus2, vault, museum, canyon, cdr, gato, clips, pto, fuse, finaldance) | 54.3 s | 34.7 % |
| **reads** — ≥ 1 px/frame for most of the shot | **17** (cold, sparks, loss, mugs, chase, chorus1, shoggoth, singularity, accel, omega, gpuplanet, chair, fences, rlhf, recursive, reveal, desk) | 51.1 s | 32.6 % |

* `setCam` is called in **27/51 shots** (87.2 s, 55.7 %). **24/51 never call it** (69.4 s, 44.3 %).
* Of the 17 that read, **5 are hand-rolled** (fences, rlhf, recursive, reveal, desk) — the two
  strongest moves in the film (desk 26 px/f, reveal 9.3 px/f) bypass the camera system entirely.
* `beginShot` resets the canvas but **not `CAM`** (`timeline.js:12-20`). Harmless today because
  every camera-using scene calls `setCam` every frame, but a latent leak: the first scene that
  calls `beginCam` without `setCam` will inherit the previous shot's camera.

### 2.4 Declared but not painted

The storyboard declares a camera for 50 of its 54 sections (`STORYBOARD.md`, `**Camera:**`).
A transform exists in 35 shots (27 `setCam` + 8 hand-rolled); in 4 of the 27 it is constant
(foom, chinese, basilisk, mlp), so **31 actually move, and 17 of those read**. The main cases:

* **Nothing at all** (16): circuits "handheld drift, slow push"; boss "slow orbit (parallax),
  low angle"; eyes "macro, slow rotate"; nvda "vertical tracking up"; jazz "slow dolly through
  smoke, 2.39 letterbox"; trust "extreme close-up, slow push"; tower "tilt down the tower,
  vertigo"; disobey "pet-cam low angle; snap zoom"; chinchilla "macro, then pull back"; gpus
  "fly-through dolly, low"; redalert "shaky low angle, strobe"; loom "slow push"; masked
  "handheld, gate weave"; ilya "slow push to the crack; SLAM; pull back"; breath "pullback
  begins"; curtain "wide, slow push; cut to close-ups on the beat".
* **Constant camera despite a declared move** (4): foom "tilt up, tracking" → z 1.02 + shake;
  chinese "dolly in through the roof" → z 1.02 + ±0.86° roll; basilisk "tilt up" → z 1.02 +
  shake; mlp "slow push" → z 1.02.
* **Moves, but not the named move** (11): chase "whip pans" → z only; dance1 "360 orbit, crash
  zooms" → ±28 px sway; gym "lateral track" → ±1 % z; canyon "side track, whip pan left" →
  2.6° roll; vault "orbit" → +8 % z; gpuplanet "orbit" → z only; atoms "orbit" → z + roll;
  singularity "push into the hole" → roll only; cage "push, then pull" → push only; omega
  "zoom out, then in" → in only; loss "12° Dutch" → 4.0°.
* **Painted as named**: cold, sparks, mugs, chorus1, shoggoth, accel, chair, museum, cdr,
  gato, fuse, and the hand-rolled reveal / desk / recursive / fences / rlhf.

### 2.5 The minimum move that reads at 30 fps

At 1920×1080, a move reads when it displaces an edge by **≥ 1 px per frame = 30 px/s**:

| move | floor | why |
|---|---|---|
| pan / tilt | **30 px/s** (≥ 92 px over a 3.06 s shot) | 1 px/frame |
| push / pull | **3 %/s** (≥ 9.2 % over a 3.06 s shot) | 960 px radius × 3 %/s = 29 px/s at the edge |
| roll | **1.6°/s** | 1100 px corner × 1.6°/s ≈ 31 px/s |
| shake | ≥ 2 px at ≥ 8 Hz | below 2 px it is lost in grain |

Cross-check on the delivered film: every move below ~0.7 px/frame (cage 0.62, vault 0.56,
cdr 0.67, museum 0.63, fuse 0.62) is carried by content, not by the camera — their p50 mean
diff (1.0–2.8) is the same as `jazz`, which has no camera at all (p50 0.97). Atoms at
1.1 px/frame measures p50 2.26 and dance1 at 1.2 max measures 6.76, both dominated by content.
The 20 px-per-shot floor in reports F and G is too low: 20 px over 3 s is 0.22 px/frame.

Shake at 71/63 rad/s is **11.3/10.0 Hz**, above the 6 Hz ceiling report C sets; sampled at
30 fps it beats at ~4.4 Hz, which reads as a strobe rather than a hand.

---

## 3. Type system

### 3.1 Fonts and loading

9 files / 8 families are loaded (`studio.html:50-70`); **Space Grotesk is loaded and never
used**. Usage across `src/`:

| family | calls | role |
|---|---|---|
| Anton | default (`type.js:8`) — 87 `TY.type` calls, 5 explicit | hooks, chorus words, SFX |
| Archivo Black | 50 | stickers, stamps, HUD headline, credits title |
| DM Mono | 154 | subtitles, telemetry, credits, labels |
| Instrument Serif (+Italic) | 31 | tenderness, the final question, jazz |
| Permanent Marker | 8 | annotations ("nervous", "POP!") |
| Black Han Sans | 2 | Korean accents |
| Space Grotesk | 0 | dead weight (136 KB) |

### 3.2 The type engine (`src/type.js`)

* **Edge**: `edgeW = max(2, size·0.055)` (`type.js:44`) → 5.5 % of size. Heroes pass 9–20 px
  (5.5–7.5 %): SPARKS 18/278, FOOM 20/376, DROP 17/304, I SEE 11/148.
* **Shadow**: `shadowOff = size·0.035` (`type.js:45`); heroes 8–20 px (4.9–6.5 %), colour
  `rgba(ink,.26)` by default, `.32–.45` on heroes.
* **Rotation/jitter**: `charRot` default 0.035 rad (2.0°); range 0.012–0.10 rad (0.7–5.7°).
  `charY = size·0.012`. **Boil**: the per-char hash re-rolls at **12 Hz**
  (`type.js:48`, `floor(time·12)`) — the "12 fps line boil" of `PRODUCTION.md:19`.
* **Per-char reveal**: `perChar(i)` → `localApp`, `scale = 0.55 + 0.45·app`, `alpha = app`
  (`type.js:61-67`). Stagger **25–60 ms**, duration **250–400 ms**; a 4–8 char word takes
  **0.35–0.66 s** to land.
* **Sticker** (`type.js:115-146`): `tornRect` torn 3.5, padX 0.38·size, padY 0.28·size,
  rot −5° default, edge 2.2, shadow `rgba(ink,.28)` at (5,8), optional 76×20 tape and a
  6-bar barcode. 21 sticker calls.
* **Circular** (`type.js:149-165`): 2 calls (cold title only). **Vertical**: 1 call.
* **Subtitle band** (`type.js:185-224`): x 84, y 992, size 31 DM Mono; band
  `min(1300, tw+96) × 62` at y−44; torn fill `rgba(ink,.92)`; 5 px REC dot at (92, 979);
  `LYRIC` 11 px at (104, 985); words cream, **active word acid + lifted 5 px + 3 px underline**;
  progress hairline 2 px at y+11.

### 3.3 The hierarchy (size order, delivered)

| role | family | size | example (file:line) |
|---|---|---|---|
| hook | Anton | **376** | FOOM `act2.js:146` |
| hook | Anton | 304 | DROP `act1.js:295` |
| hook | Anton | 278 | SPARKS `act1.js:134` |
| hook / chrome | Anton | 276 / 300 | ATOMS `act2.js:583`, NVDA `act2.js:837` |
| hook / chrome | Anton | 248 | P(DOOM) `act2.js:46`, `act2.js:713` |
| tenderness | Instrument Serif | 250 / 168 / 128 | "?" `act5.js:166`, CLAUDE POP `act5.js:250`, "made of paper" `act5.js:426` |
| hook | Anton | 148 | I SEE `act1.js:130`, SUDDEN `act1.js:291` |
| hook | Anton | 112 | OF AGI `act1.js:143` |
| lyric card | Instrument Serif | 92 | LET ME `act2.js:671` |
| world label | Archivo Black | 84 | NO SURPRISE `act1.js:221` |
| sticker | Archivo Black | 30 / 32 / 22 | IN YOUR EYES `act1.js:145`, THANK YOU `act5.js:253` |
| **subtitle** | DM Mono | **31** | `type.js:190` |
| credits title | Archivo Black | 24 | `act5.js:412` |
| HUD label | Archivo Black | 15 | P(DOOM) `timeline.js:80` |
| credits | DM Mono | 14 | `act5.js:412` |
| HUD value | DM Mono | 34 | `timeline.js:81` |
| furniture | DM Mono | **11** | LYRIC, timecode, copyright (`timeline.js:104-105`) |
| furniture | DM Mono | **10** | TOKENS/S `timeline.js:82` |
| furniture | DM Mono | 9 | cutting-mat numbers `scene_kit.js:492` |

Size census across `src/` (296 `TY.type` + `TY.text` calls): **148 below 20 px**, 25 at 20–27,
32 at 28–59, 27 at 60–119, 28 at 120–199, 14 at 200+. `PRODUCTION.md:85` ("all type ≥ 28 px
for subtitles, ≥ 120 px for hooks") holds for the subtitle and the hooks and fails for the
furniture: 148 of 296 calls are below 20 px, and 9–14 px text cannot be read at 1080p.

**Families per frame**: the "maximum two type systems per frame" rule (`PRODUCTION.md:60`) is
broken in most frames. Frame 3.5 s carries Anton (278 + 148), Archivo Black (15), DM Mono
(34 + 11 + 11 + 11) — **3 families, 6 sizes**.

### 3.4 How long is a title fully visible?

Full = last character at 100 %, i.e. `start + (n−1)·stagger + dur`. Covered = first flash,
iris or cut.

| title | full at | covered at | fully visible |
|---|---|---|---|
| I SEE | 2.00 | 5.80 (iris) | 3.80 s |
| SPARKS | 3.44 | 5.80 (iris) | 2.36 s |
| OF AGI | 4.66 | 5.80 | 1.14 s |
| IN YOUR EYES (sticker) | 5.38 | 5.80 | **0.42 s** |
| SUDDEN | 9.95 | 12.05 (flash) | 2.10 s |
| DROP | 11.08 | 12.05 | 0.97 s |
| P(DOOM) chorus1 | 23.33 | 24.12 (flash) | 0.82 s |
| **FOOM** | **26.12** | **25.91 (flash) / 26.167 (cut)** | **0.05 s (1.4 f)** |
| SHROOMS | 28.65 | 29.72 (cut) | 1.12 s |
| ATOMS | 50.26 | 52.80 (cut) | 2.54 s |
| LET ME | 54.10 | 58.50 | 4.40 s (2.9 s early) |
| FREE | 58.23 | 58.94 (cut) | 0.71 s |
| BASILISK | 61.33 | 62.37 (flash) | 1.04 s |
| NVDA | 62.97 | 64.02 (flash) | 1.05 s |
| OMEGA / POINT | 64.18 (no perChar) | 65.96 | 1.78 s, but full on frame 1 |
| CLAUDE POP (curtain) | 141.38 | 145.48 (flash) | 4.10 s |

**Median 1.13 s; 4/16 hero titles are fully visible for under 1 s.** FOOM is the worst: the
flash begins 0.21 s *before* the last letter lands and the cut follows 1.4 frames later.
`OMEGA`/`POINT` are full-alpha on frame 1 (`act2.js:882`) — a pop, not a reveal.

**Rule:** a title must be fully visible for **≥ 0.5 s** before any covering event, and a 6-char
word at 40 ms/350 ms therefore needs to start **≥ 1.05 s** before it.

### 3.5 Binding to the word / beat

* The **subtitle** is bound to the word map: `active = words.findIndex(t ≥ w.t && t < w.t+w.d)`
  (`type.js:188`), word times from `src/lyrics.js:6-52`. Correct by construction.
* **Hero type is not bound to anything.** Every `perChar` is a function of absolute `t` and a
  hand-typed constant: `(t − 2.9 − i·0.035)/0.36` (`act1.js:136`). `grep lyricById|words[` in
  `src/scenes/` returns **zero** hits. Measured offsets against the word map:

| title | type start | word time | offset (start − word) |
|---|---|---|---|
| I SEE | 1.50 | 1.50 | 0 f |
| SPARKS | 2.90 | 2.90 | 0 f |
| OF AGI | 4.16 | 4.16 | 0 f |
| IN YOUR EYES | 5.38 | 5.50 | −3.6 f |
| DROP | 10.55 | 10.74 | −6 f |
| NVDA | 62.52 | 62.52 | 0 f (staggered) |
| BASILISK | 60.90 | 61.36 | −14 f |
| ACCELERATING | 47.30 | 47.78 | −14 f |
| SHROOMS | 28.05 | 29.32 | −38 f |
| P(DOOM) | 22.72 | 23.78 | **−32 f** |
| ATOMS | 49.80 | 51.16 | **−41 f** |
| **LET ME** | **53.60** | **56.52** | **−88 f (2.9 s)** |

**6/15 begin within ±2 frames** of their word (I SEE, SPARKS, OF AGI, FOOM, FREE, NVDA), and
every title *leads* its word (never lags): the film anticipates the vocal by 0–2.9 s. Type is
hand-synced, not word-bound.

### 3.6 Safe areas and contrast

* Nominal margin: crop marks at **26 px** (`timeline.js:97`) — 1.4 % of width, far below a
  print 3–5 % (58–96 px).
* Type safe box in practice: x 40–1580 (ticker starts 1634), y 40–1040 (band starts 948).
* **Face margin**: rule 60 px (reports A/C/D). Measured SPARKS right edge ≈ 880 px vs SOL's
  face ≈ 900 px = **20 px**. Report C finds `ACCELERATING` over faces at 48.2 s, `ATOMS` S
  over the halo; report D finds chorus2/omega face clearance fail in 100 % of frames.
* **Subtitle band vs feet**: band top **950**, lowest boot **949** in the best case (frame
  25.0) — **1 px**. Report A finds circuits covering MIRA's shoes; report D finds the vault
  band at 948 vs feet at 992–1004.
* **One shot overrides the band**: `gato` sets `subX: 56, subY: 1048` (`act3.js:1065`), so the
  band runs 1004–1066 — **14 px from the frame edge**, outside the 26 px print margin. And
  because the preview (`studio.html:79`) calls `TY.subtitle` without `subX/subY`, preview and
  render disagree on this shot.
* **Contrast** (WCAG, palette values from `core.js:54-70`):

| pair | ratio | verdict |
|---|---|---|
| ink / cream | 16.9 | pass |
| acid / ink | 14.7 | pass |
| blue / paper | 6.3 | pass |
| **red / cream** | **3.6** | passes 3:1, fails 4.5:1 — SPARKS, FOOM |
| **pink / cream** | **2.6** | fails |
| **gold / paper** | **1.45** | fails |
| **silver / paper** | **1.30** | fails (paperclips are texture, not text) |

Report A measures boss at YAVG 66.8 with red-on-red — the one shot where the 3.6:1 red/cream
assumption collapses. Type over a face or over the ticker is the other failure class (report G:
4 collisions: RATER AGREEMENT, PAW, THERMAL EVENT, POWER).

---

## 4. HUD and print marks

### 4.1 What is drawn every frame (`timeline.js:50-72`)

| element | geometry | changes | cost | verdict |
|---|---|---|---|---|
| **P(DOOM) ticker** | card 246×96 at (1634, 40) = 1.2 % of frame; `P(DOOM)` 15 px, value 34 px, `TOKENS/S` 10 px, bar 70×6, 6 ticks 1×5, flower 24 px (`timeline.js:74-92`) | value eases via `doomAt(t)`; card fixed | low (paths + 4 texts) | **essential** — the meme and the continuity thread; **noise**: `TOKENS/S` (never changes, promises a rate), ticks, flower |
| timecode | `CLAUDE POP · 02750` 11 px at (1576, 1050) (`timeline.js:104`) | **every frame** | negligible | **noise** — 11 px, 50 % ink, ~3.2:1, unreadable in motion; it also guarantees no two frames are identical |
| colour bars | 4 × 11×5 at (1820, 1046) | fixed | negligible | invisible (44×5 px); a wink, not information |
| copyright | `© 2026 PAPER SINGULARITY` 11 px at (44, 1050) | fixed | negligible | **noise** — 11 px at 50 % ink |
| crop marks | 4 L's, 16 px arms, 1 px, alpha .22, 26 px inset (`timeline.js:97-100`) | fixed | negligible | identity, but too faint to read; raise to 2 px / .35 or drop |
| REC dot | r 5 px at (92, 979), red when a word is active (`type.js:199`) | per word | negligible | **essential** — the one HUD element bound to the lyric |
| progress hairline | 2 px, y 1003, cream .16 + red fill (`type.js:220-222`) | per line | negligible | **redundant** — duplicates the active-word highlight |
| paper grain | full-screen multiply, alpha .5, offset `hash(floor(t·2))·160` (`core.js:137-146`) | **2 Hz, jumps ≤160 px** | **high** (2.7 Mpx blend) | **essential texture**, but the 2 Hz jump is a **pop**, not a boil (report E rule 12) |
| film grain | full-screen soft-light .45, 24 Hz, 512 px tile (`core.js:147-157`) | every frame | **high** (3.9 Mpx blend) | essential; correct rate |
| vignette | radial, .34 (`core.js:168-173`) | fixed | low (1 gradient fill) | essential, cheap |

### 4.2 Cost, measured

Chrome, 1920×1080, 60 frames, encode excluded: **5.35 ms/frame with the post layer, 1.98 ms
without → 3.37 ms/frame (63 % of draw time)**. Over 4,699 frames that is ~15.8 s of pure post.
The post layer is ~3× the cost of the picture it sits on.

### 4.3 What breaks

1. **The furniture does not invert.** `drawPrintMarks` uses `PAL.ink` at .22/.5 for every
   scene (`timeline.js:96-105`). On the dark desk (frame 155.5, background `#150D09`) the
   copyright and timecode are ~1.1:1 — invisible. The colour bars survive; the text does not.
2. **The ticker duplicates the diegetic meter** and disagrees with it: dance1 prop 48.0 vs
   ticker 37.4 for 90/90 frames (report B), chorus2 48.5 vs 61.0 for 0.53 s (report D),
   gpuplanet 62.2–63.4 vs 68.0 for 3.06 s (report D). One source of truth is not enforced.
3. **`TOKENS/S` is a dead label** — 10 px, never changes, shows no rate.
4. **The per-frame timecode + 12 Hz type boil + 24 Hz grain mean no two frames are ever
   identical.** Every "hold" is a full-frame refresh: it defeats compression, defeats a
   still-frame determinism test, and it is why the motion probe cannot separate a hold from a
   boil (report A rule 10).
5. **Two frame implementations.** `studio.html:73-85` (preview) calls `TY.subtitle(ctx, line, t)`
   without `subX/subY`; `timeline.js:60` passes them. They agree on 50 shots and disagree on
   `gato` (`act3.js:1065`). One frame function, or none.

**Essential to the KPOP feel:** paper grain, torn edges, the subtitle band with the acid
active word and REC dot, the P(DOOM) ticker, the vignette.
**Noise:** 11 px timecode, 11 px copyright, 10 px `TOKENS/S`, 1×5 ticks, 24 px flower, the
redundant progress hairline, crop marks at .22.

---

## 5. Transitions

### 5.1 The delivered grammar

| transition | count | detail |
|---|---|---|
| **hard cut** | **50/50** | every cut is a hard cut; the scene switches on one frame |
| **flash — outgoing side** | 21 | starts 0.14–0.30 s before the cut, rises inside the old shot: cold 1.12, loss 12.05, mugs 17.78, chorus1 24.12, foom 25.91, eyes 35.25, dance1 38.40, cage 58.50, chorus2 60.44, basilisk 62.37, nvda 64.02, omega 65.96, gpuplanet 68.92, vault 73.48, gato 95.02, trust 110.64, rlhf 124.02, redalert 126.04, ilya 133.80, curtain 145.48, finaldance 150.35 |
| **flash — incoming side** | 14 | `(1 − seg(lt,0,.16…0.28))·0.22–0.4`: chair, mlp, museum, canyon, cdr, gato, clips, fuse, tower, fences, rlhf, loom, ilya, reveal |
| **flash — mid-shot (impact)** | 3 | fuse 103.46, disobey 114.38, finaldance 146.55 |
| **total flashes** | **38** | one-sided or mid-shot in 46 of 50 cuts |
| **iris-out** | **10** | sparks 5.80→5.97 (r 1500→0), chase, chinese 29.38→29.72 (1200→40), shoggoth 32.72→33.12 (1200→50), singularity 44.36→44.91 (1400→50), atoms 52.52→52.82 (1400→60), mlp 77.41→77.60 (1280→20), museum 80.95→81.24 (1320→10), cdr 88.99→89.34 (1360→16), recursive 131.50→131.85 (900→8) |
| **iris-in** | **0** | none — every iris closes to black, then the next shot starts full-frame |
| **paper wipe** | **0** | `GLOBAL_TRANS = []` (`timeline.js:28-30`); `drawPaperWipe` (`timeline.js:42-48`) is **unreachable dead code** |
| dissolve / cross-fade | 0 | — |
| match cut | **0 verified** | the two named ones fail: pto→fuse Earth (960,560,r300) vs bomb (1280,760,r250) = 377 px / 50 px off (report F); chart→coaster is a straight cut at 8.95 |
| whip / speed-ramp across a cut | 0 | canyon's "whip" is a 2.6° roll inside one shot |

Only **four** cuts have a flash on both sides (vault→chair 73.48/73.80, trust→tower
110.64/111.40, gato→clips 95.02/95.20, redalert→loom 126.04/126.20). The other 46 are a hard
cut with a one-sided wash, which is why 12/50 cuts measure < 10 mean luma change.

### 5.2 Authored vs storyboard

`STORYBOARD.md` names ~40 transitions (petal iris, iris wipe, splash, mug wobble, mouth iris,
rocket exits, bag spills, swirl, push into eye, red flash, paper fold, dial bump, black-hole
iris, speed lines dissolve, dots coalesce, birds → white flash, stage floor cracks, serpent
tail, pull back to galaxies, point expands, pull back to Earth, vault door wipes, classroom
wall folds, dust, tilt up, cloud dissolves, fall into clip pile, clips rise, match cut Earth →
bomb, white flash, smoke wipes, stamp impact, tower folds, terminal line, cube falls, cube
rolls into dark, alarm light, red alarm stripes, meter glass cracks, thread → film scratch,
page turn, zoom into eye, black, pullback, curtain, confetti wipe, white flash, fade to cream).
**Delivered: hard cut, one-sided flash, iris-out. Three.** Everything else is prose.

### 5.3 The rule for a cut that does not feel like a slide show

A cut is an edit, not a slide change, when these hold:

1. **It changes the field**: mean luma Δ ≥ 25 **or** dominant hue Δ ≥ 30° between the last
   frame of A and the first of B (the 12 cuts < 10 are the counter-example).
2. **Or it matches**: the outgoing and incoming focal shape agree within **40 px** of position
   and **15 %** of size, so the eye reads a transformation rather than a replacement.
3. **If a flash masks it, the flash covers both sides**: ≥ 0.85 alpha on the frame *before*
   the cut **and** on the first frame after, so the cut happens inside the flash — not on a
   hard edge into a wash (today 4 of 50 cuts do this: vault→chair, trust→tower, gato→clips,
   redalert→loom).
4. **And the shot must not repeat the previous composition**: no 7-of-9 cast within 60 px, no
   burst centre within 160 px (curtain→finaldance is 9/9 within 60 px, bursts 140 px apart,
   report I).

---

## 6. Rules for the test version (numbers, not adjectives)

**A. Shot length**
1. 1.0 s ≤ shot ≤ 4.5 s; median **2.5–3.0 s**; mean ≤ 3.0 s.
2. At most **2 consecutive** shots outside 1.5–3.5 s; no run of > 3 shots above 3.5 s.
3. A shot is cut on a **lyric boundary or a declared instrumental beat**; if it is cut on a
   line, the last word must land **before** the cut, and ≥ 0.5 s before any covering flash.

**B. Camera**
4. Every shot calls `setCam` **and** resets `CAM` in `beginShot`; ≥ 1 key per 1.0 s.
5. Floor: **30 px/s** pan/tilt, **3 %/s** push/pull, **1.6°/s** roll — i.e. ≥ 1 px/frame at
   1080p. Anything below is a static shot and must be declared static.
6. A move named in the storyboard must exist in code: orbit = x **and** z **and** r changing;
   track = the background moves with the subject; handheld = noise ≤ 6 Hz; whip = ≥ 150 px
   translation in ≤ 0.3 s.
7. Shake ≤ 6 Hz and ≤ 8 px; a 10–11 Hz sine is a strobe, not a hand.
8. No shot may be `none` unless the storyboard says static. Budget: **≤ 10 % of shots**.

**C. Type**
9. Hero title fully visible **≥ 0.5 s** before any flash/iris/cut (target 1.0 s); the reveal
   budget is `(n−1)·stagger + dur`, so a 6-char word needs ≥ 1.05 s of runway.
10. Stagger ≤ 60 ms, reveal ≤ 400 ms; **no title at full alpha on frame 1**.
11. Hero type is keyed to `line.words[i].t` (± 2 frames), not to a hand-typed constant.
12. Subtitle ≥ 28 px; credits ≥ 18 px; **no text < 18 px** at 1080p (kills TOKENS/S 10,
    timecode 11, copyright 11, cutting-mat 9).
13. Max **2 families** per frame (one display + one mono + the HUD); today frame 3.5 s has 3.
14. A title must replace, not append: one hero + one subtitle per beat, never the same words
    twice (report H rule 4: `ilya` hero + subtitle duplicate the line).

**D. Safe areas**
15. Face margin **60 px**, hand margin **40 px**; no type box may intersect a face box.
16. Subtitle band top ≥ **40 px** below the lowest foot/contact; the band is 948–1010, so feet
    must end above **908**.
17. Keep type out of the ticker box **x 1600–1880, y 30–140**; no right-aligned stat past
    x 1580; type margin ≥ 60 px from every edge (not 26).

**E. Contrast**
18. Type ≥ **4.5:1** against its local field (≥ 3:1 for ≥ 120 px). Red/cream 3.6 and
    pink/cream 2.6 are display-only and must carry a ≥ 12 px cream edge.
19. No more than **2 saturated hues > 20 %** of the frame; the boss red-on-red frame
    (YAVG 66.8) is the counter-example.
20. The subtitle band is `rgba(ink,.92)` + cream = 16.9:1 — keep it.

**F. Cut sync**
21. Every cut within **± 2 frames (± 67 ms)** of its authored event (word, impact, beat).
    Today: 47/50 on a lyric boundary, but 4/50 within 15 ms of the 88 BPM grid, median 121 ms.
22. Every downbeat inside a shot gets a visible event within ± 2 frames; ≥ 80 % must fire
    (report F: segment total 3/21 = 14 %).
23. A cut must pass the §5.3 test: Δluma ≥ 25 **or** Δhue ≥ 30° **or** a match within
    40 px / 15 %; ≤ 2 "quiet cuts" (< 10) per 30 s.

**G. Transitions**
24. Allowed: hard, cream flash, red flash, iris (r ≥ 900 px at the lens), paper wipe. Nothing
    else.
25. A flash that masks a cut must be ≥ 0.85 alpha on **both** the last frame of A and the
    first of B; a one-sided wash is a 1-frame pop, not a transition.
26. Iris-out must be answered by an iris-in; ≤ 1 iris per 30 s (today: 10 out, 0 in).
27. A flash must be composited **above** the HUD, or the HUD suppressed (report I rule 7).
28. No shot may end on ≥ 6 frames (0.20 s) of one flat colour; cut on the first frame with
    Δ > 1.0 (report I rule 6).

**H. HUD**
29. One P(DOOM) readout per frame, read from `doomAt(t)`; the diegetic prop must equal it
    ± 0.1 (today dance1 48.0 vs 37.4).
30. HUD text ≥ 18 px; `TOKENS/S` either shows a rate or is deleted.
31. Print furniture must invert on dark scenes (cream at 50 %), or be suppressed below a
    background luma of 40.
32. No **text** may change every frame; the timecode is the only candidate, and if it stays it
    must be ≥ 18 px — otherwise drop it, because it makes every frame unique.
33. Paper texture offset must move ≤ 8 px/frame at ≥ 8 Hz; a 160 px jump at 2 Hz is a pop.
34. The progress hairline is redundant with the active-word highlight: keep one.
35. Post budget: the grain/paper/vignette layer is **63 %** of draw time (3.37 of 5.35 ms).
    Keep paper + grain + vignette; drop the rest of the furniture before dropping any of these.

---

## 7. What to copy, what to fix

**Copy**
1. **The lyric-boundary edit.** 47/50 cuts at 0.0 frames is the film's strongest rhythm idea;
   it is why the film feels sung rather than assembled.
2. **The subtitle band.** 31 px DM Mono, 92 % ink card, acid active word + REC dot — legible,
   diegetic, and cheap.
3. **The torn-paper type.** Anton at 278–376 px with a 5.5–7.5 % cream edge, 2° per-char
   rotation and 12 Hz boil is the whole look, and it survives at 1/6 scale.
4. **The two hand-rolled pulls** (reveal 1.55→1.0, desk 2.6→1.0) — the only moves in the film
   with real scale travel.
5. **Paper grain + vignette.** They carry the material feel, inside a post layer measured at
   3.37 ms/frame (63 % of draw time).

**Fix (ranked by damage)**
1. **Camera coverage.** 20 shots / 51.2 s have no camera at all; 14 more are below 1 px/frame.
   Add `setCam` to every shot, reset `CAM` in `beginShot`, and adopt the 1 px/frame floor.
2. **FOOM's 1.4 frames.** The biggest word in the film is fully visible for 0.05 s. Move the
   reveal to 25.45 or move the flash to 26.15.
3. **Type/word sync.** Replace hand-typed constants with `line.words[i].t`; LET ME is 2.9 s
   early, P(DOOM) −32 f, ATOMS −41 f.
4. **Subtitle band vs feet.** 1 px of clearance in the best frame, overlap in circuits/boss.
   Raise the cast's feet to 908, or shrink the band to 40 px and move it to y 1004.
5. **The HUD furniture.** Delete the 11 px timecode, 11 px copyright, 10 px TOKENS/S, 1×5
   ticks and 24 px flower; invert the print marks on dark scenes; one P(DOOM) source.
6. **Transitions.** Pair every out-flash with an in-flash (today 4/50), add iris-ins to the 10
   iris-outs, and delete `GLOBAL_TRANS`/`drawPaperWipe` or use it.
7. **Cut contrast.** 12/50 cuts are invisible (< 10 mean diff); re-block or re-time
   singularity→accel (0.3), reveal→curtain (0.3), museum→canyon (0.5).
8. **Paper texture pop.** `core.js:143` jumps 160 px at 2 Hz; use a continuous offset.

---

*Instruments left in `out/analysis/tmp/` (`time-hud.mjs`, `pix2.mjs`) are measurements, not
film files; delete at will.*
