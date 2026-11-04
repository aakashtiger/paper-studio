# C — Edit, camera, composition, text and sound of the reference film

**Date:** 2026-11-04
**Reference:** `Y:\NewVideoTest\ref\source.mp4`
**Measured:** every frame decoded (3,758), every cut scored, every shot sampled, the whole audio track analysed.
**Read for authored values:** `Y:\NewVideoTest\PRODUCTION.md`, `Y:\NewVideoTest\STORYBOARD.md`,
`Y:\NewVideoTest\src\{core,timeline,scene_kit,lyrics}.js`, and — because the film is not the film those
describe — `Y:\NewVideoTest\ref\PDoomVideo\src\{core,timeline,lyrics}.js` and its nine chapter files.
**No repository file was changed except this one.** Measurement artefacts are in `studio/build/research/`.

---

## 0. First finding: the reference video is not the film in `src/`

The brief calls `source.mp4` the render of `Y:\NewVideoTest\src` (1920×1080, 30 fps, 4,699 frames,
51 scenes). Four independent measurements say it is the render of `ref/PDoomVideo/` instead.

| Evidence | Measurement |
|---|---|
| Container | **1280×720, 24 fps, 3,758 frames, 156.63 s** — not 1920×1080/30 fps/4,699 |
| Cut times vs `src/scenes/*.js` | different list and count: `src` has one scene 5.90–8.95 and 51 total; the film cuts at **5.664, 8.000, 12.100 and 12.900** and has 62 |
| Cut times vs `ref/PDoomVideo/src/ch/*.js` | **match**: median offset **0.003 s**, max 0.167 s, 61/61 cuts |
| Content | the film opens on red curtains with a painted *I'M UPPING MY P(DOOM)* title and ends on *created by Claude Opus 5.5* — both literal strings in `ref/PDoomVideo/src/ch/c01_lab.js:100–101` and `c09_finale.js:402–404`; `src/scenes/act1.js` opens on a petal ring |

Consequence: **every number in this report describes the delivered MP4.** Where I cite an authored
value it comes from `ref/PDoomVideo`, with the file and line. The `Y:\NewVideoTest` "bible" and
"shot list" are a *rewrite* of this film, not a description of it — §10 compares them.

The studio tool was run as instructed:
`npm run style:measure -- --ref ref/source.mp4 --camera --out build/research/source-kpop`.
It reported `shots 1211 · median 0.042 s · cuts/min 463.52` — its scene detector fires on every
boil frame at threshold 0.03, so its shot statistics are unusable on this film. Its camera summary
(`|dx| 15.07 px/shot, |dy| 13.61, dz 0.536 %/shot, moving 26%`) is computed over those 1,211
fragments and is therefore also unusable. I re-ran the same `cameraMoves()` / `cameraPath()` /
`summarizeCamera()` functions with the film's **real** shot windows and report those numbers (§2).

---

## 1. The edit

### 1.1 Shot table

64 visible shots = 62 authored chapter shots + 2 hard cuts found inside an authored shot
(102.50, 119.58). Text codes: `L7` = karaoke subtitle line 7 (list in §6.1); a quoted word is a
display burst. Framing: TITLE, WS wide, MWS medium-wide, MS medium, MCU medium-close, CU close,
INS insert (object/dial/screen).

| # | start | dur | framing | subject | camera (authored) | action | text | transition out |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.000 | 1.500 | TITLE | curtains + title | push 1.00→1.05 | curtains part, Clawd rises through a trapdoor | *I'M UPPING MY / P(DOOM)* | brush wipe |
| 2 | 1.500 | 2.119 | WS | Clawd (tiny, on a CRT) + Researcher's shoulder | push 1→1.32, drift +70x/−70y | Clawd asleep, blinks awake | L1 | cut |
| 3 | 3.619 | 2.045 | INS | CRT screen, Clawd small | push 1→1.10, tilt −30y | eyes become stars, sparks burst | L1 | cut on beat |
| 4 | 5.664 | 2.336 | CU | Researcher | pull 1.32→1.20 | sweat drops, circuits crawl in | L2 | cut |
| 5 | 8.000 | 1.000 | MCU | CRT screen | crash zoom 0.95→3.40 | shrug + wink, loss chart plunges | L3 | cut |
| 6 | 9.000 | 3.100 | WS | Clawd on loss curve | ride/track, 5° roll at the bottom | sleds the curve | L4 | cut |
| 7 | 12.100 | 0.800 | MS | lab | push 1.28 + shake | bursts out of the monitor | L4 | match cut |
| 8 | 12.900 | 5.037 | MWS | Clawd on throne + Researcher | slow push 1.20→1.26, low angle | chair spin, mug tower | L5 | cut |
| 9 | 17.937 | 4.563 | WS | Clawd + Researcher | handheld z 1.12 | hallway chase, doors | L6 | cut |
| 10 | 22.500 | 0.500 | WS | lunchbox mouth | static z 1.12 | jaws close over the lens | *CHOMP!* | cut to black |
| 11 | 23.000 | 1.500 | WS (stage) | Clawd, 5 Petals, Researcher, meter | pull 1.26→1.10 | pump on the beat, 8→34 % | L7 | cut |
| 12 | 24.500 | 2.000 | WS | Clawd strapped to a rocket | tilt up, follows rocket | launch, explosion | L8 + *FOOM* | continuous tilt |
| 13 | 26.500 | 1.500 | MS | paper room in the sky | dolly in through the roof | slips through mail slots | L9 | cut |
| 14 | 28.000 | 1.500 | MS | Clawd in a rainbow swirl | pull 1.80→1.00 + roll | mushrooms sprout, eyes swirl | L10 | cut |
| 15 | 29.500 | 4.000 | MCU | shoggoth + mask + Clawd | slow push + snap zoom, shake | mask slips, tentacles dance | L11 | push into eye |
| 16 | 33.500 | 2.000 | CU | Clawd's red iris | macro, slow rotate | blink, lifespan counter, thread snaps | L12 | red flash |
| 17 | 35.500 | 3.000 | WS (stage) | full cast | pull 1.35→1.00 + tilt up | dance break | — | brush wipe |
| 18 | 38.500 | 2.619 | WS | gym, Clawd running + Researcher | lateral track | treadmill, calm loss TV | L13 | cut |
| 19 | 41.119 | 1.364 | INS | speed dial | push to dial | needle slams to MAX | L13/L14 | cut |
| 20 | 42.483 | 2.517 | WS | gym → black hole | crash push z→8.0, roll 1.6 rad | room stretches into the hole | L14 | iris |
| 21 | 45.000 | 3.600 | WS | Clawd on skateboard | whip pan + track | overtakes train and jet | L15 | whip |
| 22 | 48.600 | 3.300 | MS | Researcher in cream void | slow push 1.00→1.04, slight orbit | body dissolves into dots | L16 | cut |
| 23 | 51.900 | 1.500 | WS | pink room | follow (track) | dots snap back | — | cut |
| 24 | 53.400 | 2.719 | MWS | pink Clawd + heart cage | slow push | heart-eyes, rattles the cage | L17 | cut |
| 25 | 56.119 | 1.364 | MWS | same | slow push | offers a ring | L17 | cut |
| 26 | 57.483 | 1.517 | MS | heart bubble | push into the mouth | bubble grows | L17 | bubble pop |
| 27 | 59.000 | 1.450 | MCU | Clawd, pump, meter | slow push + drift, rot −0.028 | pumps two-handed, 34→61 % | L18 | cut |
| 28 | 60.450 | 2.487 | WS | basilisk through the floor | push 1→1.18 + shake | planks fly, GPUs thrown | L19 + *BOOM* | cut |
| 29 | 62.937 | 1.563 | WS | stock line to the moon | vertical track up | NVDA flag on the moon | L20 | cut |
| 30 | 64.500 | 1.500 | WS | space | push 1→1.12 + roll 0.25 rad | galaxies converge | L21 | cut |
| 31 | 66.000 | 4.000 | MS | planet-sized GPU | orbit, then push to odometer | digits overflow | L22 | cut |
| 32 | 70.000 | 3.000 | WS | vault + hard-hat crew | orbit behind the vault | door slams, high-five | L23 + *CLANK* | brush wipe |
| 33 | 73.000 | 4.500 | MS | net-classroom, 9 Clawds | whip pan in (1,700 px) + push | pulse forward/back | L24 | cut |
| 34 | 77.500 | 3.500 | MS | museum | dolly up (y 540→330) | machine sputters, sheet | L25 | cut |
| 35 | 81.000 | 4.000 | WS | desert road, go-kart | side track + whip left | yank, Researcher flung | L26 + *SKRRT!* | tilt up |
| 36 | 85.000 | 3.000 | WS | sleeping cloud guards | slow push 1.02→1.10 + shake | kart donuts below | L27 + *HONK!* | cut |
| 37 | 88.000 | 6.300 | MWS | Gato holds the Researcher | slow push, then tilt down | grip loosens, lets go | L28 | cut |
| 38 | 94.300 | 1.100 | WS | chasm, looking up | fall camera | Researcher falls | L28 | cut |
| 39 | 95.400 | 2.000 | WS | stage + paperclips | crash zoom into the pile | lands in clips, 61→86 % | L29 + *PLOP* | cut |
| 40 | 97.400 | 1.600 | WS | flooded stage | surf tracking | clips rise | L30 | cut |
| 41 | 99.000 | 0.755 | MS | killswitch + empty chair | push 1.27→1.40 | phone buzzes, OOO note | L31 | cut |
| 42 | 99.755 | 0.745 | WS | beach | push 1.08→1.16 | two Clawds ignore the phone | L31 | cut |
| 43 | 100.500 | 2.000 | WS | paperclip Earth | crash zoom out | Earth made of clips | L32 | hard cut |
| 44 | 102.500 | 2.900 | MCU | Clawd on the clip planet | push 1.9→2.5 (after a crash out 6.5→1) | strikes a match, lights the fuse | L33 + *BOOM* | white flash |
| 45 | 105.400 | 4.000 | MWS | jazz club | slow dolly 1.08→1.26 | sax, two spotlights | L34 | brush wipe |
| 46 | 109.400 | 4.100 | WS | tower of Clawds | tilt down | tower recedes into cloud | L35 | cut |
| 47 | 113.500 | 2.000 | MS | training room | pet-cam + snap zoom | sit / stay / paw → shades | L36 | cut |
| 48 | 115.500 | 1.500 | MS | chinchilla + Clawd | macro → 1.24→1.55 | cheeks fill, cube drops | L37 + *THUNK!* | cut |
| 49 | 117.000 | 2.000 | WS | fences | fast lateral track | cube rolls through fences | L38 + *CRASH!* | cut |
| 50 | 119.000 | 0.583 | WS | dark tunnel | fly-through | dark approach | L39 | hard cut |
| 51 | 119.583 | 1.317 | WS | data-centre aisle | fly-through dolly | LEDs blink, hand on racks | L39 | cut |
| 52 | 120.900 | 2.600 | MWS | approval panel | locked wide → Dutch tilt | paddles spin, everyone slides out | L40 | cut |
| 53 | 123.500 | 2.500 | MCU | red-alert stage | shaky low angle, rot 0.11→0 | pump, 86→99.9 %, glass cracks | L41 | cut |
| 54 | 126.000 | 2.000 | MS | loom | slow push → branch race | threads burst into futures | L42 | cut |
| 55 | 128.000 | 2.000 | MS | sepia flashback classroom | handheld gate weave | writes *mat!* | L43 | cut |
| 56 | 130.000 | 2.000 | MS | gold void | continuous zoom out | nesting Clawds | L44 | cut |
| 57 | 132.000 | 3.400 | MS | the door | slow push, SLAM, pull back | chains and padlocks snap on | L45 + *SLAM!* | cut to black |
| 58 | 135.400 | 2.000 | WS | one spotlight | slow push 1.28→1.32 + 8 px wobble | dust, the door breathes | — | cut |
| 59 | 137.400 | 3.100 | WS | theatre reveal | long pullback | flats and puppets revealed | L46 | cut |
| 60 | 140.500 | 2.892 | WS | curtain call | slow push 1.28→1.31 | cast lines up | — | cut |
| 61 | 143.392 | 2.727 | WS | bows | pan + zoom along the line on the beat (z 1.8→1.3) | bows, flowers | — | cut |
| 62 | 146.119 | 2.726 | MWS | balloon | push 1.28→1.36 | meter pops | — | cut |
| 63 | 148.845 | 2.729 | WS | full cast | orbit | final dance | — | cut |
| 64 | 151.574 | 5.046 | TITLE | curtain | push 1.12→1.17 | title, credit, fade to paper | title + *created by Claude Opus 5.5* | fade |

### 1.2 Duration distribution (64 shots)

| n | min | p10 | median | mean | p90 | max |
|---|---|---|---|---|---|---|
| 64 | 0.500 | 1.100 | **2.045** | **2.447** | 4.000 | 6.300 |

| bucket | < 1 s | 1–2 s | 2–3 s | 3–5 s | > 5 s |
|---|---|---|---|---|---|
| shots | **5** | **16** | **24** | **16** | **3** |

0.25 s histogram (lower bound → shot count): 0.50 → 3 · 0.75 → 2 · 1.00 → 2 · 1.25 → 4 ·
1.50 → 10 · 2.00 → 12 · 2.25 → 2 · 2.50 → 8 · 2.75 → 2 · 3.00 → 5 · 3.25 → 2 · 3.50 → 2 ·
4.00 → 5 · 4.50 → 2 · 5.00 → 2 · 6.25 → 1.

The distribution is bimodal: a chorus cluster at **1.50–1.75 s (10 shots)** and **2.00–2.25 s
(12 shots)**, and a long tail of 3–6.3 s shots that open a chapter.

### 1.3 Rhythm by chapter (the film's own nine chapters)

| chapter | window | shots | mean | min | max | cuts/min |
|---|---|---|---|---|---|---|
| lab | 0.0–23.0 | 10 | 2.30 | 0.50 | 5.04 | 23.5 |
| chorus 1 | 23.0–38.5 | 7 | 2.21 | 1.50 | 4.00 | 23.2 |
| takeoff | 38.5–59.0 | 9 | 2.28 | 1.36 | 3.60 | 23.4 |
| chorus 2 | 59.0–73.0 | 6 | 2.33 | 1.45 | 4.00 | 21.4 |
| obsolete | 73.0–95.4 | 6 | **3.73** | 1.10 | 6.30 | **13.4** |
| chorus 3 | 95.4–109.4 | 7 | **2.00** | 0.75 | 4.00 | 25.7 |
| scale | 109.4–123.5 | 7 | 2.01 | 0.58 | 4.10 | 25.5 |
| chorus 4 | 123.5–140.5 | 7 | 2.32 | 2.00 | 3.40 | 21.2 |
| finale | 140.5–156.62 | 5 | 3.22 | 2.73 | 5.05 | 14.9 |

Whole film: **24.1 cuts/min**, 63 cut events (61 authored + 2 internal).
The fastest stretch is chorus 3 + scale (95.4–123.5, 25.5–25.7 cuts/min); the slowest is the
obsolete bridge (73–95.4, 13.4 cuts/min) — a deliberate breath before the last act.

### 1.4 Reconciliation of the cut list

| measure | value |
|---|---|
| authored cuts checked | 61 |
| measured scene-change peak within ±0.20 s | 61 / 61 |
| median offset (measured − authored) | **0.003 s** |
| max offset | 0.167 s |
| cuts with scene score ≥ 8 ("visible" cut) | **35** |
| 3–8 (medium) | **18** |
| < 3 (masked by wipe / flash / continuous action) | **8** (41.12, 48.60, 51.90, 53.40, 95.40, 123.50, 135.40, 137.40) |
| strong changes not on a cut | 7 — 25.46 (*FOOM* burst), 61.58 (*BOOM* burst), 102.50 and 119.58 (real cuts, §1.1), 148.17 & 148.42 (balloon pop), 25.50 |

**11 of 61 cuts are computed from the beat grid** `B(n) = 0.21 + n·60/88`
(3.619, 5.664, 17.937, 41.119, 42.483, 62.937, 99.755, 143.392, 146.119, 148.845, 151.574).
The other 50 are hand-set times at 0.1–0.5 s resolution (1.5, 8.0, 9.0, 12.1, 12.9, 22.5, 23.0,
24.5, 26.5, 28.0, 29.5, 33.5, 35.5, 38.5, 45.0, 48.6, 51.9, 53.4, 59.0, 60.45, 64.5, 66.0, 70.0 …).
**The film is not beat-cut in general; it is cut on a hand-authored timeline, with the beat grid
used for the shots that must land on the music (chapter 1 entry, the curtain call).** In-shot hits
are on the grid: *BOOM* 61.57 = B(90), fence hits B(172/173/174), door *SLAM* B(196) = 133.85.

---

## 2. Camera

### 2.1 Measured per shot

`dx/dy` = full-resolution pixels over the shot (studio `cameraMoves()`, 48×27 luma grid, ±8 cells);
`dz` = % scale over the shot; `px/s` = cumulative per-frame travel ÷ duration (studio `cameraPath()`).
**49 of 62 windows saturate** (|dx| or |dy| = 213.33 px, |dz| = 25 %) — the film's moves are larger
than the tool's search range. Read the sign, not the magnitude; the authored keyframe is the magnitude.

| # | dx | dy | dz | px/s | sat | authored |
|---|---|---|---|---|---|---|
| 1 | +27 | −133 | +25 | 89 | z | push 1.00→1.05 |
| 2 | +213 | −187 | −25 | 101 | xyz | push 1→1.32 |
| 3 | 0 | +27 | +10 | 156 | – | push 1→1.10 |
| 4 | −213 | 0 | −21 | 263 | x | pull 1.32→1.20 |
| 5 | −213 | +213 | +17 | 853 | xy | crash 0.95→3.40 |
| 6 | +53 | −53 | −9 | 95 | – | ride/track |
| 7 | +213 | −213 | −25 | 500 | xyz | push 1.28 |
| 8 | −80 | +27 | +17 | 16 | – | push 1.20→1.26 |
| 9 | −187 | +213 | +25 | 70 | yz | handheld |
| 10 | −213 | −213 | −25 | 1067 | xyz | static (measurement is the jaw crossing the lens) |
| 11 | 0 | 0 | +25 | 53 | z | pull 1.26→1.10 |
| 12 | −187 | +213 | +24 | 760 | xyz | tilt up |
| 13 | +27 | −27 | −4 | 302 | – | dolly in |
| 14 | −213 | +107 | +25 | 338 | xyz | pull 1.80→1.00 |
| 15 | −213 | −213 | −25 | 293 | xyz | push + snap |
| 16 | −160 | +213 | +25 | 160 | yz | macro rotate |
| 17 | −213 | −213 | +14 | 160 | xy | pull 1.35→1.00 |
| 18 | +213 | +213 | +24 | 193 | xyz | track |
| 19 | 0 | 0 | −1 | 0 | – | push to dial |
| 20 | −213 | −213 | −14 | 392 | xy | crash z→8 |
| 21 | 0 | +160 | +25 | 296 | yz | whip + track |
| 22 | −27 | +107 | +25 | 113 | z | push 1→1.04 |
| 23 | +80 | −213 | +4 | 267 | y | track |
| 24 | 0 | 0 | +8 | 0 | – | push |
| 25 | 0 | 0 | +6 | 39 | – | push |
| 26 | 0 | +213 | −25 | 158 | yz | push into mouth |
| 27 | 0 | −213 | −22 | 74 | yz | push |
| 28 | +53 | +53 | +11 | 64 | – | push 1→1.18 |
| 29 | −213 | 0 | −25 | 1092 | xz | track up |
| 30 | 0 | +107 | +25 | 409 | z | push + roll |
| 31 | +213 | −213 | −9 | 253 | xy | orbit |
| 32 | +53 | −213 | −11 | 391 | y | orbit |
| 33 | −53 | +213 | +25 | 439 | yz | whip |
| 34 | +80 | −213 | +10 | 373 | y | dolly up |
| 35 | +213 | +27 | −25 | 313 | xz | track + whip |
| 36 | +27 | −27 | +25 | 302 | z | push + shake |
| 37 | −213 | −213 | −25 | 190 | xyz | push then tilt |
| 38 | +213 | −213 | −15 | 267 | xy | fall |
| 39 | 0 | +213 | +25 | 413 | yz | crash in |
| 40 | −213 | +213 | −25 | 200 | xyz | surf track |
| 41 | −53 | +27 | +8 | 0 | – | push |
| 42 | −133 | +213 | −25 | 716 | yz | push |
| 43 | +213 | −213 | −25 | 294 | xyz | crash out |
| 44 | +213 | −213 | −25 | 294 | xyz | crash 6.5→1, then push 1.9→2.5 |
| 45 | −213 | −213 | −25 | 47 | xyz | dolly 1.08→1.26 |
| 46 | 0 | −213 | +25 | 260 | yz | tilt down |
| 47 | 0 | 0 | +25 | 147 | z | snap zoom |
| 48 | −27 | −53 | +25 | 356 | z | macro |
| 49 | −213 | +213 | −25 | 253 | xyz | track |
| 50 | 0 | −213 | +25 | 351 | yz | fly-through |
| 51 | (inherited) | | | | | fly-through |
| 52 | 0 | 0 | −25 | 831 | z | Dutch tilt |
| 53 | 0 | 0 | +25 | 96 | z | shake |
| 54 | −213 | +160 | +25 | 467 | xyz | push |
| 55 | −213 | +107 | −25 | 200 | xyz | handheld |
| 56 | 0 | +213 | −25 | 400 | yz | zoom out |
| 57 | 0 | +213 | −25 | 63 | yz | push / pull |
| 58 | 0 | 0 | +25 | 0 | z | slow push 1.28→1.32 |
| 59 | 0 | −80 | +25 | 34 | z | pull back |
| 60 | 0 | 0 | +2 | 0 | – | push |
| 61 | 0 | 0 | 0 | 538 | – | pan along the line |
| 62 | 0 | 0 | +5 | 157 | – | push |
| 63 | +53 | −53 | −4 | 39 | – | orbit |
| 64 | +160 | +213 | +25 | 0 | xyz | push |

### 2.2 Classification (primary move, read from the authored keyframe, checked against dx/dy/dz)

| move | shots | share | examples |
|---|---|---|---|
| push in (dolly / scale up) | **28** | 44 % | 2, 3, 8, 15, 24, 25, 26, 27, 28, 30, 36, 41, 42, 45, 48, 50, 51, 54, 57, 58, 60, 62, 64 |
| pull back | **6** | 9 % | 4, 11, 14, 17, 56, 59 |
| crash zoom (≥1.5× in one shot) | **6** | 9 % | 5 (0.95→3.4), 20 (→8.0), 39 (→in), 43 (→out), 44 (6.5→1), 47 (snap) |
| tilt (vertical travel, subject locked) | **5** | 8 % | 12, 29, 34, 38, 46 |
| track (lateral follow) | **5** | 8 % | 6, 18, 23, 40, 49 |
| orbit / rotate / pan across | **6** | 9 % | 16, 31, 32, 52, 61, 63 |
| whip pan (≥1,000 px in-shot) | **3** | 5 % | 21, 33, 35 |
| handheld / shake as the move | **4** | 6 % | 7, 9, 53, 55 |
| static | **1** | 2 % | 10 (jaws close over a locked lens) |

- **% moving: 63/64 = 98.4 %.** The one still camera is shot 10 (the lunchbox jaw closes over a
  locked lens); every other shot has an authored translation, zoom or roll.
- **Moves per minute: 24.2** (63 moves / 2.61 min); a new move starts at every cut.
- **Longest run of one move: 5** — shots 24–28 (53.40–62.94 s) are five consecutive pushes.
- **No true pans.** Lateral camera movement is always a *track* that keeps the subject locked
  (18, 21, 35, 40, 49, 51) or the whip (21, 33, 35); there is no shot where the camera sweeps across
  a static set. The one "pan" is 61, and it pans along a line of cast members on the beat.
- **Median measured travel: 427 px per shot**, median 253 px/s (p10 53, p90 538).
- **Gaps between moves: zero** — the film never holds one camera for two shots.

### 2.3 What the camera actually is

A 2-D similarity transform — `translate(960+sx,540+sy) · rotate(r) · scale(z) · translate(−cx,−cy)`
(`ref/PDoomVideo/src/core.js:53`) — with a per-frame shake `shakeXY(t, amt)` at 24 Hz
(`core.js:47`). Zoom range in the film: **0.95 → 8.0** (shot 20 pushes to 8.0 into the black hole;
shot 5 crash-zooms to 3.4). Roll is used on impact (`0.05 rad` in shot 6, `0.25 rad` in 30,
`1.6 rad` in 20, `0.11 rad` in 53). Nothing is 3-D; "orbit" is a translate+scale on layered paper.

---

## 3. Framing and composition

| framing | shots | share |
|---|---|---|
| TITLE card | 2 | 3 % |
| WS / stage-wide | 32 | 50 % |
| MWS | 7 | 11 % |
| MS | 14 | 22 % |
| MCU | 5 | 8 % |
| CU | 2 | 3 % |
| INS (dial / screen) | 2 | 3 % |

**The film is a wide film.** 50 % of shots are wide or stage-wide; only 3 % are close-ups, and the
two close-ups belong to the Researcher's face (4) and Clawd's eye (16). Composition rules visible in
every frame: the subject is **centred** — the clay-coloured mass sits within ±0.10 of frame centre
in ~46 of 60 measurable frames — and the floor line sits at y≈0.72–0.85 H (a high camera,
paper-theatre staging). Negative space is above the subject, not beside it.

Character scale (read from frames, not a segmentation):

| scale | where | example |
|---|---|---|
| ~8–15 % of frame height | landscape/wide shots | 21 (ride), 35 (road), 43 (planet), 51 (aisle) |
| ~25–40 % | stage wides, classrooms, panels | 11, 17, 33, 52 |
| ~50–65 % | close and hero shots | 27 (pump), 44 (match), 53 (red alert) |
| a single eye fills the frame | 16 | iris |

Cast staging: Clawd and the Researcher are usually **both** in frame in a verse
(2, 8, 9, 18, 33, 45, 55, 57) and Clawd alone in the chorus (11, 27, 53). The Researcher is the
"reactor": he shares the frame in most of the first act but is the subject of only three shots
(4, 22, 38).

---

## 4. Action and motion

Measured frame-to-frame luma difference (`tblend=difference` → `signalstats.YAVG`):

| statistic | value |
|---|---|
| film mean motion | **9.26** (0–255 luma) |
| per-shot p10 / median / p90 | 2.55 / 7.80 / 18.37 |
| quietest shots | 58 (3.84), 37 (4.14), 38 (4.95), 8 (4.24) |
| busiest shots | 20 (20.18), 12 (19.62), 10 (18.2), 13 (18.52) |

Every shot has **at least two moving layers**: at least one animated subject, plus (in all but one)
a moving camera. The only still camera is 10 — and it still has the jaw closing. In-shot effects
carry 7 shots on their own (3 sparks, 5 chart, 19 dial, 26 bubble, 39 clip pile, 48 cube,
62 balloon).

**Continuous take vs cut-driven:** the film is **cut-driven, with continuous moves inside the shot**.
59 of the 63 boundaries are hard cuts and 4 are brush wipes; the film ends on a fade to paper
(155.0–156.35).
No shot is longer than 6.3 s, and every shot's internal action is a single continuous beat
(one action, one camera path). The "one shot = one idea" rule is stricter than the storyboard's.

Boil: the source paints at `BOIL = 12` fps (`core.js:3`) while the file runs at 24 fps, so two
consecutive frames share one drawing. Measured: mean frame difference on even frames is **0.81×**
the odd frames — consistent with a 12 fps redraw sampled at 24.

---

## 5. Transitions

63 shot boundaries, counted from the measurement and the code:

| boundary type | count | where |
|---|---|---|
| hard cut, straight | **49** | everywhere |
| hard cut under a full-frame flash or to black | **10** | 22.5 (ink), 23.0 (ink), 33.5 (red), 35.5 (red), 42.5 (black-hole iris), 95.4 (night), 105.4 (white *BOOM*), 123.5 (alarm red), 135.4 (dark), 140.5 (red) |
| brush wipe | **4** | 1.5, 38.5, 73.0, 109.4 |
| final fade | **1** (end) | 155.0 → 156.35, reaches paper at 156.35 |

Geometry of the wipe: 5 rag-edged horizontal strokes, the whole band rotated −0.1 rad, each stroke
offset in time by 0/0.14/0.06/0.18/0.10 of the wipe; 0.30 s to cover, 0.30 s to reveal; the scene
swaps at full cover (`timeline.js:11,72–90`).

In-shot device transitions (not cuts, but they are what the viewer remembers): the lunchbox chomp to
black (22.5), the mouth iris (23.0), the black-hole iris (42.5), the heart-bubble pop (57.1), the
white *BOOM* (105.24), the door *SLAM* (133.85), the fall (94.3), the day→night dissolve at 63.5
(4 frames), and the curtain fall (151.6).

The film's signature is **not** the transition; it is the **motivated exit**: the cut lands inside
an action that crosses it (a chomp, a rocket leaving frame, a whip pan, a bubble popping, a fall).
Only **4 of 63 boundaries (6 %) are not cuts**, and all 4 sit on chapter breaks — no other chapter
boundary uses one.

---

## 6. Text

### 6.1 Subtitles (the only running text)

| statistic | value |
|---|---|
| lyric lines | **46** |
| lyric words | **227** |
| total subtitle time | **119.9 s = 76.5 %** of the film |
| words per line | min 2, median **5**, mean 4.9, max 9 |
| line duration | min 0.95 s, median **2.40 s**, max 5.60 s |
| shots carrying a subtitle | **54 / 64** |
| shots with none | 1, 10, 17, 23, 58, 60, 61, 62, 63, 64 |
| longest silence | 140.5–156.62 (the curtain call and titles, 16.1 s) |

Box: ink (`#2B2233`) torn polygon, 8 vertices with ±8 px jitter, **y 978–1070** (92 px tall),
centred at x 960, width = text width + 110 px, corner radius 0, alpha 0.88. Text: **cream, 50 px
"Shantell Sans" 800**, one line, centred. Grows in over 0.18 s and shrinks over the last 0.12 s
(`timeline.js:93–117`).

**Karaoke**: the sung portion is re-filled in **ochre `#E8AA38`**, character by character, at
`sung = clamp((t − a)/min(b − a − 0.1, 0.45 + len·0.075))` — i.e. a fixed-rate wipe, not the
measured word times. There is no per-word timing in the render.

Line map used by the shot table (`L1`…`L46`, from the film's `lyrics.js`):

| L | start–end | L | start–end | L | start–end | L | start–end |
|---|---|---|---|---|---|---|---|
| 1 | 1.5–5.9 | 13 | 38.5–41.4 | 25 | 77.5–81.0 | 37 | 115.5–116.9 |
| 2 | 6.0–7.9 | 14 | 41.5–44.9 | 26 | 81.4–84.9 | 38 | 117.0–118.9 |
| 3 | 8.0–8.95 | 15 | 45.0–48.5 | 27 | 85.0–88.0 | 39 | 119.0–120.4 |
| 4 | 9.0–12.4 | 16 | 49.4–51.9 | 28 | 89.4–95.0 | 40 | 120.9–123.4 |
| 5 | 13.0–16.5 | 17 | 53.4–58.4 | 29 | 95.4–97.4 | 41 | 123.5–125.9 |
| 6 | 17.9–22.5 | 18 | 59.0–60.4 | 30 | 97.5–98.9 | 42 | 126.0–127.9 |
| 7 | 23.0–24.4 | 19 | 60.5–62.4 | 31 | 99.0–100.4 | 43 | 128.0–129.9 |
| 8 | 24.5–26.4 | 20 | 63.0–64.4 | 32 | 100.5–102.4 | 44 | 130.0–131.9 |
| 9 | 26.5–27.9 | 21 | 64.5–65.9 | 33 | 102.5–104.4 | 45 | 132.0–135.4 |
| 10 | 28.0–29.4 | 22 | 66.0–68.5 | 34 | 105.4–109.4 | 46 | 137.4–140.5 |
| 11 | 29.5–33.4 | 23 | 70.0–72.9 | 35 | 109.4–113.4 | | |
| 12 | 33.5–35.5 | 24 | 73.0–77.4 | 36 | 113.5–115.4 | | |

### 6.2 Display text (everything that is not a subtitle)

| # | time | text | size | where | animation |
|---|---|---|---|---|---|
| 1 | 0.0–1.5 | *I'M UPPING MY* / *P(DOOM)* | 100 / 250 px | centre, over curtains | painted, ±0.03 rad, pops on the beat |
| 2 | 22.50 | *CHOMP!* | 240 px | centre | pop + shake, 0.5 s |
| 3 | 25.42 | *FOOM* | 250 px | left of the rocket | pop, 1.1 s |
| 4 | 42.60 | *VWOOMP* | 150 px | top centre | pop, 1.1 s |
| 5 | 47.62 | *ZOOM!* | 140 px | right | pop, 0.9 s |
| 6 | 57.10 | *POP!* | 120 px | above the bubble | pop, 0.8 s |
| 7 | 61.57 | *BOOM* | 230 px | right of the basilisk | pop, 1.1 s |
| 8 | 70.44 | *CLANK* | 170 px | above the vault | pop, 0.7 s |
| 9 | 82.71 | *SKRRT!* | 160 px | centre | pop, 0.72 s |
| 10 | 86.12 | *HONK!* | 140 px | above the kart | pop, 0.9 s |
| 11 | 96.37 | *PLOP* | 160 px | left | pop, 1.0 s |
| 12 | 105.24 | *BOOM* | 300 px | centre | pop, 0.62 s |
| 13 | 116.80 | *THUNK!* | 120 px | above the cube | pop, 0.9 s |
| 14 | 118.17 | *CRASH!* | 150 px | at the fence | pop, 0.72 s |
| 15 | 133.85 | *SLAM!* | 210 px | top right, screen space | pop, 1.4 s |
| 16 | 153.0–156.6 | *I'M UPPING MY / P(DOOM)* + *created by Claude Opus 5.5* | 96 / 240 / 50 px | curtain | painted, fade |

Plus functional numerals: the GPU odometer (76 px digits, 66–70 s), `z z z` (85–88 s), and the
`P(DOOM)` label on the thermometer prop.

**Counts:** 16 display events + 46 subtitle lines = **62 text events in 156.6 s (0.40/s)**.
No hook is ever set as display type. No lyric line is ever set as display type. There are **two
type systems** in the whole film: torn-paper display (Shantell Sans 800, cream fill + 8–14 px
offset shadow) and the subtitle. Nothing is boxed except the subtitle; nothing is underlined;
nothing is vertical; there is no sticker, no HUD, no caption, no ticker card.

### 6.3 The P(DOOM) readout

Not a ticker and not persistent. It is a **thermometer prop**, 72×410 px, drawn at x 1760, y 110,
scale 0.85, label `P(DOOM)` above and the percentage below (`timeline.js:52–68`). It appears only
inside the four chorus windows — **23.0–35.5, 59.0–69.9, 95.4–105.4, 123.5–132.0** (41.9 s of the
film) — and is absent from the other **114.7 s**, including the whole final minute. It reads
5 → 34 → 61 → 86 → 99.9 (never 100). It is drawn as a stage prop in chorus shots (`meterProp`) and
as a corner overlay only when a scene does not draw it.

---

## 7. Narration and vocal

| statistic | value |
|---|---|
| sung lines | 46 (lyric sheet) / 38 (ASR segments) |
| sung words | 227 (lyric sheet) / 239 (ASR, which mis-hears some) |
| first vocal | **1.50 s** |
| last vocal | **140.68 s** |
| voiced span | 139.2 s |
| words per minute, over the film | 87.0 |
| words per minute, over the voiced span | **97.8** |
| words per minute, while a line is actually sounding (119.9 s) | 113.6 |
| words per line | median 5, mean 4.9, max 9 |
| pauses > 0.4 s between lines | 15 gaps; longest inside the song 3.0 s (35.5–38.5, dance break); 16.1 s of no lyric at the end (140.5–156.6) |

Delivery: **sung, not spoken** — a fast, rhymed pop pastiche with a female lead, a four-on-the-floor
backing and a call-and-response chorus. It is dense where the line is long (9 words in 2 s) and
sparse in the verses (one line per 3–5 s). Rhyme is end-stopped and comic
(*eyes/surprise*, *loss/boss*, *alive/FOOM* — deliberately broken). The lyrics are the only
narration: there is no voice-over, and the film does not speak outside the song.

---

## 8. Sound

| statistic | film (`source.mp4`) | `assets/song.mp3` |
|---|---|---|
| integrated loudness | **−15.6 LUFS** | −15.6 LUFS |
| loudness range | **6.0 LU** | 6.0 LU |
| true peak | **−3.7 dBTP** | −3.6 dBTP |
| codec | AAC-LC 48 kHz stereo 128 kb/s | MP3 |
| duration | 156.63 s | 156.63 s |

The film's audio **is the song**, start to end, with no gain change and no added effects. The only
difference is AAC's 0.1 dB true-peak overshoot. There are no foley, no whooshes, no music bed under
silence, no sound design at all — the "SFX" in this film are the *typographic* bursts in §6.2.

**Tempo / grid.** Measured on a diff-energy onset envelope (8 kHz mono, 10 ms hop, tempo scan
0.40–1.10 s with phase search):

| period | BPM | strength (rel. best) | note |
|---|---|---|---|
| 0.909 s | 66.0 | **1.00** | half-time pulse |
| 0.455 s | 132.0 | 0.94 | the actual beat |
| 0.682 s | 88.0 | 0.71 | 1.5 × 0.455 — the authored grid |
| 1.136 s | 52.8 | 0.69 | 2.5 beats |

The authored 88 BPM is a **3:2 (dotted) reading of a 132 BPM pulse**. Its phase is `t = 0.21 s`;
the strongest onset phase at 88 BPM measures **0.55 s**, i.e. the authored grid sits **half an
88-beat (0.34 s) off the loudest onsets**. Cuts do not, on average, land on the strongest onsets
(mean onset strength at a cut = 0.77× a random frame); the film is cut on its own timeline, and the
music and the edit agree at the chapter level, not beat for beat.

**Sections** (RMS, 4 s windows, dBFS):

| window | level | what |
|---|---|---|
| 0–1.5 | −36 → −28 | cold open, almost silent under the curtain |
| 1.5–22.7 | −24 → −21 | verse 1 |
| 22.7–38.5 | −19 → −18 | chorus 1 |
| 38.5–58.9 | −19 → −18 | verse 2 |
| 58.9–73.0 | −18 | chorus 2 |
| 73.0–88.0 | −18 | bridge |
| 88.0–95.4 | **−24 → −27** | the drop under Gato / the fall — the quietest 8 s in the song |
| 95.4–108 | −24 → −20 | chorus 3, deliberately under-mixed |
| 108–123.5 | −17 | bridge 2, the loudest sustained level |
| 123.5–137.4 | −17 | chorus 4 |
| 137.4–140.5 | −20 | reveal |
| 140.5–151.6 | −17 → −16 | curtain call |
| 151.6–156.6 | −22 → **−59** | fade under the title card |

No silence anywhere inside the song — the RMS never falls below −30 dBFS before the final fade, and
the only near-silence is the 0.5 s tail.
Instrumentation (by ear, not measured): drum machine + handclaps, synth bass, bright plucked
synth, brass-ish stabs in the choruses, and a lead vocal with doubled harmonies. The arrangement is
centre-heavy; nothing sits hard in one channel.

---

## 9. Code values

`I` = invariant (the identity depends on it) · `V` = variable (a per-film choice) ·
`F` = accident of this film · `M` = measured from the MP4 · `A` = authored in code.

| parameter | value | source | status |
|---|---|---|---|
| delivery size | 1280×720 | M | V (the project paints 1920×1080; the file is 720p24) |
| frame rate | 24 fps, 3,758 frames | M | V |
| duration | 156.63 s | M/A | I (`DUR = 156.6`, `core.js:3`) |
| aspect | 16:9 | M | I |
| beat | `B(n) = 0.21 + n × 0.681818` (88 BPM) | A (`core.js:3`, chapter files) | I |
| sub-beat | triplet at 132 BPM (88 × 1.5) | M/A | I |
| cut count | 61 authored + 2 internal = 63 | M | V |
| median shot | 2.045 s | M | V |
| mean shot | 2.447 s | M | V |
| shot range | 0.50 – 6.30 s | M | V |
| cuts/min | 24.1 | M | V |
| beat-derived cuts | 11 / 61 | A | F |
| camera model | translate · rotate · uniform scale (2-D) | A (`core.js:53`) | I |
| zoom range | 0.95 – 8.0 | A/M | V |
| shake | `sin(71t)·amt`, `cos(63t)·0.7·amt`, 24 Hz seed | A (`core.js:47`) | I |
| moves per shot | 98.4 % move, 1.6 % static | M | V |
| longest same-move run | 5 shots (53.4–62.9 s) | M | V |
| wipe | 5 ragged strokes, −0.1 rad, 0.60 s, cover at the boundary | A (`timeline.js:11,72–90`) | I |
| wipes in film | 4 | M | V |
| palette: paper | `#F3EBDC` | A (`core.js:6`) | I |
| palette: ink | `#2B2233` | A | I |
| palette: clay (Clawd) | `#D97757`, dark `#A84D33`, light `#F2A283` | A | I |
| palette size | 12 named colours | A (`core.js:5–9`) | I |
| subtitle box | y 978–1070, ink, 8 jittered vertices, α .88 | A (`timeline.js:100`) | I |
| subtitle type | 50 px Shantell Sans 800, cream `#FFF5E2` | A | I |
| karaoke highlight | ochre `#E8AA38`, char wipe at `0.45 + 0.075·len` s | A (`timeline.js:110`) | I |
| subtitle share | 76.5 % of runtime | M | V |
| display type | 96–300 px, cream/tomato/gold, 8–14 px offset shadow | A/M | I |
| display events | 16 (+ 46 subtitle lines) | M | V |
| boil | 12 fps, seeded per boil frame | A (`core.js:3,19`) | I |
| measured boil evidence | even/odd frame-diff ratio 0.81 | M | — |
| P(DOOM) meter | thermometer 72×410 at (1760,110), 5→99.9 | A (`timeline.js:52–68`) | V |
| meter presence | 4 chorus windows only (41.9 s of 156.6) | M | F |
| luma by act | lab 102 · chorus1 133 · takeoff 165 · chorus2 113 · obsolete 130 · chorus3 117 · scale 126 · chorus4 77 · finale 138 | M | V |
| saturation by act | lab 22 · chorus1 33 · takeoff 19 · chorus2 22 · obsolete 24 · chorus3 21 · scale 24 · chorus4 20 · finale 36 | M | V |
| loudness | −15.6 LUFS, LRA 6.0, TP −3.7 dBTP | M | I (the song) |
| audio edits | none | M | I |

---

## 10. What the film actually does vs what the docs say

`PRODUCTION.md` / `STORYBOARD.md` describe a **different, larger film** (SOL the sunflower idol,
MIRA, 52 shots, 1920×1080/30). Read as a description of `source.mp4`, almost every visual claim is
wrong; read as a *plan for a rebuild*, they are a plan, not a measurement. The table separates the
two.

| claim in the docs | what the film does | verdict |
|---|---|---|
| "1920×1080, 30 fps, 4,699 frames" | 1280×720, 24 fps, 3,758 frames | **wrong** — the delivered file is 720p24 |
| "52 shots, average 3.0 s" | 62 authored / 64 visible, mean **2.45 s** | **wrong** — 12 shots more, 18 % shorter |
| "chorus cuts 1.5–2.2 s" | chorus means 2.00–2.33 s, range 0.75–4.00 | half right |
| structure 0 / 1.5 / 22.7 / 38.5 / 58.9 / 73.8 / 95.2 / 109.4 / 124.2 / 137.0 / 140.7 | 0 / 1.5 / 23.0 / 38.5 / 59.0 / 73.0 / 95.4 / 109.4 / 123.5 / 137.4 / 140.5 | **close** (≤0.9 s on every boundary, except 73.8 vs 73.0) |
| cold open: paper sun unfolds, circular *CLAUDE POP* type, petal iris | red curtains, painted *I'M UPPING MY P(DOOM)*, brush wipe | **wrong** |
| cast: SOL (sunflower head) + MIRA (bob, lab coat) | **Clawd** (clay toaster-box) + **the Researcher** (cream coat, round glasses, scribbly hair) | wrong names/heads; the Researcher is close |
| "DOOM ticker: persistent, top-right, 240×92 torn card, TOKENS/S, 8→100" | thermometer prop, **only in the 4 chorus windows**, 5→99.9, never 100 | **wrong** on persistence, geometry, label and value |
| "every line appears as a readable subtitle — no exceptions" | **46/46 lines**, 76.5 % of runtime | **true** |
| "hooks get monumental type in the negative space" | hooks are **never** set as display type | **wrong** |
| "text enters on the sung word" | a fixed-rate **character wipe** in ochre, not word times | half right |
| "maximum two type systems per frame" | exactly two: display + subtitle | **true** |
| "52 shots × TXT: *SPARKS*, *NO SURPRISE*, *SUDDEN/DROP*, *FOOM*, *SHINGAMI*…" | **16** display events in the whole film, 12 of them one-word comic bursts | **wrong by an order of magnitude** |
| "camera: crash zooms, whip pans, slow pushes, Dutch tilts" | 44 % push, 9 % pull, 9 % crash, 5 % whip, 8 % tilt, **0 pans across a set** | directionally right; the only pan follows the cast line (61) |
| "every shot has a camera move" | 63/64 move; 1 is static (10) | nearly true |
| "no shot is a static illustration" | every shot has a moving subject, even shot 10 | **true** |
| "12 fps line boil" | `BOIL = 12`, measured even/odd diff ratio 0.81 | **true** |
| "transitions: iris / wipe / match cut per shot" | 59 hard cuts (10 under a flash), 4 brush wipes, 2 irises, 1 fade | the film is far more cut-driven |
| colour script (cream/tomato → mint → cobalt → steel → red → crimson) | measured luma 102→133→165→113→130→117→126→**77**→138, saturation 22→33→19→22→24→21→24→20→**36** | the *arc* holds (dark red act IV, bright finale); the hues are the film's own |
| "audio untouched from source MP4" | identical to `song.mp3` (−15.6 LUFS, LRA 6.0) | **true** |

Three things the docs **do** get right and are worth keeping: the **chapter lengths** (within 0.9 s),
the **subtitle rule** (every line, always readable, never over a face), and **"no shot is a static
illustration"**. Everything else in the shot list is a description of a film that has not been made.

---

## 11. Method and artefacts

- Cuts: `ffmpeg -vf scdet=threshold=0,metadata=print` over all 3,758 frames (per-frame score),
  peak-matched to the authored list within ±0.20 s; the 2 internal cuts were confirmed by eye at
  1/24 s granularity (102.50 and 119.58), and one candidate (63.58) was **rejected** as a 4-frame
  day→night dissolve, not a cut.
- Camera: the studio's `cameraMoves` / `cameraPath` / `summarizeCamera` (`src/engine/style-measure.ts`)
  run on 48×27 grey frames with the 62 real shot windows; raw output in
  `build/research/source-kpop/camera-authored-windows.json`.
- Luma / saturation / motion: `signalstats` and `tblend=difference`+`signalstats`, per frame,
  aggregated per shot.
- Frames: 64 stills at 35 % of each shot, tiled into `build/research/shots0–3.png`; the shot table
  in §1.1 was read from those plus the chapter code.
- Audio: `ebur128=peak=true` on both files; tempo and phase from a diff-energy onset envelope
  (8 kHz, 10 ms hop, 0.40–1.10 s scan with phase search).
- The studio's own `style:measure` report (unusable shot stats, §0) is kept at
  `build/research/source-kpop/STYLE-BIBLE.md` for comparison.
