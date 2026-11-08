# Segment H — 124.24–137.02

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames. Segment is **12.78 s / 384 frames**: `redalert` 124.24–126.20 (59f), `loom` 126.20–128.00 (54f), `masked` 128.00–129.90 (57f), `recursive` 129.90–131.90 (60f), `ilya` 131.90–135.40 (105f), `breath` 135.40–137.02 (49f; the analysis stats count 50 including the boundary frame).
- Primary pass: the supplied **15 samples/s** sheets (`out/analysis/shots-15/act4-*.png`), i.e. every 2nd source frame. Not the old 5/10 fps sheets. Cut pass: the 30 fps strips (`out/analysis/cuts-30/c42…c47`), every frame. Exact runs from `out/analysis/frame-diff.json` (192×108 mean |ΔY|). Its own definitions are **frozen < 0.5**, **quiet < 1.0**; I use those thresholds and say so.
- 18 native-resolution frames extracted to `out/analysis/tmp/H-*.png` (no review sheet overwritten) plus 4 crops at 2× for hands/contact/type.
- Code read: `src/scenes/act4.js:1159-1552`, `src/core.js:137-177`, `src/type.js:41-224`, `src/timeline.js:50-107`, `src/characters.js:372-541`, `src/scene_kit.js:112-119,414-457,547`.
- **STORYBOARD.md is numbered +2 vs the manifest.** Its `## 44` is 124.24 `redalert`; its `## 49` is 135.40 `breath`. The requested “sections 42–47” would be `gpus`…`recursive`, so I read **## 44–49**, the six shots in this segment. This is a documentation offset, not a picture defect, but it will mis-route any agent that follows the numbers literally.
- Global furniture is excluded from “moving layers”: grain is quantised at **24 Hz** (`core.js:153`), paper texture at **2 Hz** (`core.js:143`), type boil at **12 Hz** (`type.js:48`), the corner frame counter at **30 Hz** (`timeline.js:104`). These produce sub-0.05 diffs and never count as change.
- Frame-diff is a global mean; it **under-reports small-object motion**. The `loom` shuttle crosses 430 px each way in 0.63 s (≈23 px/frame average, ≈36 px/frame peak at 1920) but is 12×5 px at 192×108, so it contributes <0.5 mean. I use the 15 fps sheet to overrule the metric where the object is small, and the metric to overrule the sheet where the change is sub-pixel.
- Sheet boundary bleed: the `redalert` sheet’s 30th cell is **loom at 126.20** (one-frame bleed). I treated 124.24–126.20 as exclusive.

## Shot table

| # | id | start–end | dur | frames | set | cast | camera | out-transition | <1.0 run |
|---|---|---|---|---|---|---|---|---|---|
| 42 | redalert | 124.24–126.20 | 1.96 | 59 | hazard-stripe stage, siren beams, perspective floor | 6 hazard-suit idols | none (no shake) | 80% cream flash → 30% cream flash | **0** |
| 43 | loom | 126.20–128.00 | 1.80 | 54 | blue void, starfield, wooden loom, tree of futures | SOL (hooded weaver) | none (no push) | hard cut | **47** (126.43–128.00) |
| 44 | masked | 128.00–129.90 | 1.90 | 57 | sepia classroom, chalkboard, 3 desks | baby SOL (mask) | gate weave ±2 px | hard cut | **32** (128.03–129.10) |
| 45 | recursive | 129.90–131.90 | 2.00 | 60 | gold sunburst void, 3 stacked SOLs | 3 SOLs (halo/crown/party) | zoom 1.35→1.0 (1.2 s) | iris r900→8 → hard cut | **32** (130.47–131.53) |
| 46 | ilya | 131.90–135.40 | 3.50 | 105 | black void, giant paper door, gold seam, chains, eye | SOL + MIRA (peek) | push 1→1.18, slam shake, pull 1.18→1.0 | fade to #050405 → near-black cut | **50 + 34** (132.13–133.80, 134.13–135.27) |
| 47 | breath | 135.40–137.02 | 1.62 | 49 | black void, door silhouette, spotlight, dust | none | none (1.2% breath) | 3-frame fade → cut | **45** (135.43–136.93) |

## Per-shot anatomy

### 42 — `redalert` 124.24–126.20 · 1.96 s · 59 frames

**Set.** Red-alert stage: 40 diagonal hazard stripes at 54 px width, alternating `PAL.redD`/`PAL.gold`, under a 38% ink wash (`act4.js:1164-1171`); two siren beams pivoting from (−40,−80) and (1960,−80) (`:1173-1178`); perspective floor at y=880 (`:1183`). **Cast.** Six `idol` dancers at x=230+i·292, y=915, scale .62, `outfit:'hazard'`, gold/ink, halo (`:1185-1198`). **Props.** Cracked doom meter at (1540,780), scale 1.15, 6 hand-drawn cracks (`:1200-1204`); two `comicBurst` “WEE-OO” (`:1209-1210`); dust 24 motes (`:1211`). **Type.** `P(DOOM)` 190 px Archivo Black, cream/ink edge/red shadow (`:1206`); `99.9%` 230 px gold at α.3 (`:1207`); `SIREN MODE / EVACUATE THE BUILDING` 15 px mono (`:1208`); global subtitle `I'm upping my P(doom)` (`lyrics.js:46`); global doom ticker 99.9% (`timeline.js:74-92`). **Camera.** None. The storyboard says “shaky low angle”; there is no camera transform, only the dancers’ ±6 px sway (`:1188`). **Transition.** In: hard cut from `rlhf`’s pale end at 124.24; the first redalert frame is f3727 (mean 4.5), the luma spike is f3728 (124.30, mean **94.6**). Out: cream flash ramps to 80% over lt 1.8–1.96 (`:1212`), frames 3782–3785 (126.10–126.20), diffs 19.4/23.5/24.0/23.6; then `loom` opens with a 30% cream flash (`act4.js:1277`).

**CONTINUOUS (every 0.0667 s at 30 fps).** Siren beams rotate ±(1.0+sin(t·3)·0.3) (`:1174`); six dancers kick `sin(beat·π+i·0.9)` at 88 BPM, 6 px bounce, ±0.35 rad legs, ±0.3 rad arms, ±6 px x (`:1187-1194`); strobe `bpmPulse(t,8)>0.55` gives a 1–2 frame cream wash every 0.68 s (`:1180-1181`); dust; type boil at 12 Hz; grain at 24 Hz.

**DISCRETE.** Cut at 124.24 (luma spike f3728, 124.30, mean 94.6); strobe peaks every 0.68 s (≈1.5 frames on); end flash 126.04–126.20 (f3782–3785); cut out 126.20.

**Dead/soft runs.** **None under 1.0** — the only shot in the segment. But 18-frame runs under **2.0** at 124.40–125.00, 125.07–125.67, 125.77–126.07: the dancers are between kicks and the strobe is off. Median 1.468, p10 1.089. The energy is a **1.47 Hz strobe**, not six bodies.

**3+ independent layers?** **Yes** — siren beams, dancers, strobe, plus dust/type. This is the only pass in H.

**Authored detail a recipe would miss.** The meter has 6 cracks at hand-picked angles and a red bulb with two highlight dots (`:1202-1203`); the six dancers have per-index phase and alternating rotation sign (`:1188-1189`); the two WEE-OO bursts differ in colour, size and rotation (`:1209-1210`); the hazard field is 40 explicit parallelograms, not a tiled pattern; the floor is a perspective grid (`scene_kit.js:17-27`).

**Flaws.**
- **Six clones.** Same `idol` call, only phase `i` differs (`:1185-1198`). At 15 fps the six poses are indistinguishable; the “dance” is a 6 px bob. Vary 3 poses / 2 colours / 2 scales.
- **Hazard suit does not read.** The `hazard` outfit is a `varsityTorso` in gold plus one **92×22 px** stripe band at chest height, 7 stripes (`characters.js:461-465`); at .62 scale that is 57×14 px on a ~200 px body. It reads cheerleader, not hazard worker. Make the band full-torso (92×140) or stripe the skirt too.
- **Right WEE-OO is a white blob.** `comicBurst(..., PAL.redL, PAL.cream, ...)` (`:1210`) puts cream text with a cream edge on a light-red star at (1140,840); in the native frame it is a white rectangle with red marks. Use `PAL.ink` text.
- **`SIREN MODE` is invisible.** It is drawn at y=990, 15 px (`:1208`); the subtitle band is y=948–1010 (`type.js:189-196`) and is drawn after the scene (`timeline.js:60`). Move it to y=900 or suppress the band.
- **Meter label is unreadable.** `99.9%` sits under 6 cracks (`:1202-1203`); the cracks cross the digits. Draw the label last or move the cracks to the glass only.
- **No camera shake**, despite the storyboard. Add a 2-frame ±8 px / ±0.01 rad jolt on each strobe.
- **Title not word-synced.** `P(DOOM)` is up from frame 1; the word “P(doom)” lands at 125.56 (`lyrics.js:46`). Either pop the title on the word or accept it as a poster.

### 43 — `loom` 126.20–128.00 · 1.80 s · 54 frames

**Set.** Deep blue gradient `#071238→#04061A` (`:1220`), starfield 110 stars (`:1221`), a 2.1-scale loom at (690,930) with a two-tone wood frame, 14 warp threads, 7 weft threads (`scene_kit.js:443-457`), and a “tree of futures” of 4 bezier roots + 6 twigs each + tip dots (`:1225-1241`). **Cast.** SOL the weaver at (360,940), scale .7, hooded blue, closed eyes (`:1246-1254`). **Props.** Shuttle at (540+su·430,700) (`:1256-1260`); branch-to-camera line + dot (`:1262-1268`); dust 30 (`:1276`). **Type.** `FORETOLD` 150 px Instrument Serif italic (`:1270`), 3 pink thread lines at 660–1660 (`:1271-1273`), `LOOM` sticker with barcode (`:1274`), `a tree of every future` 17 px (`:1275`), global subtitle `Just as foretold by Loom` (`lyrics.js:47`). **Camera.** None. The storyboard says “slow push, then branch races at lens”; the code has no push. **Transition.** In: 30% cream flash decaying over 0.2 s (`:1277`), frames 3786–3792 (126.23–126.40), diffs 77.6/8.9/9.3/8.9/10.1/8.8/9.2; out: hard cut at 128.00 (masked start diff 70.2).

**CONTINUOUS.** Shuttle `sin(lt·5)` crosses 430 px each way in 0.63 s (≈23 px/frame average, ≈36 px/frame peak at 1920; ≈1–2 px/frame at 192×108) (`:1256`); 14 warp threads sway ±6 px `sin(t+i)` (`scene_kit.js:451`); starfield twinkle (`:1221`); dust; type boil; grain.

**DISCRETE.** Tree “grow” lt 0.2–1.25 (`:1223`) — but **only the 6 twigs per root use `grow`**; the 4 main bezier roots are drawn full at frame 0 (`:1228-1230`). Branch to camera lt>1.3, r 6→26 px, line 3→21 px (`:1262-1268`), 127.50–128.00.

**Dead/soft runs.** **47 frames <1.0 from 126.43 to 128.00** (1.57 s of 1.80 s); **14 frames <0.5 from 127.13 to 127.60**. This is not a literal freeze — the shuttle is moving — but the composition is a held still for 1.57 s. The branch-to-camera does **not** register above 1.0; it is a 3 px line and a 26 px dot.

**3+ independent layers?** Technically yes (shuttle, starfield, thread sway), but two are <1 px/frame at 192×108. The shot reads as a static composition with one small moving object. Fail the “silhouette moves ≥1%/s” rule.

**Authored detail.** 14 warp / 7 weft threads with alternating cream-gold and pink-mint; a shuttle with a cream weft bar (`:1259`); 4 root colours (gold, pink, mint, cream), 6 twigs per root, dots at the tips (`:1225-1240`); a hood with closed eyes (`:1252`); a barcode sticker (`:1274`); the subline in serif italic (`:1275`). A recipe would draw a generic loom icon; this has a specific weave.

**Flaws.**
- **The tree is fully grown at frame 0.** `:1228-1230` draws the four roots without `grow`; the 15 fps sheet’s first cell already shows the complete tree. Multiply the bezier endpoint by `grow` so the tree grows 126.40–127.45.
- **The branch never hits the lens.** `r=6+u*20` (`:1266`) = 26 px at 1080 (1.4% of height). It should reach r≥900 px (83% of height) at 127.95 and fill the frame before the cut.
- **No push.** Storyboard says slow push; add 1.00→1.04 over 1.8 s (door edge 2 px/s at 1920).
- **SOL floats.** Feet at y=940 stand on the loom’s grid, not a floor (`:1246`); the `shadowEllipse` (`characters.js:395`) lands on the grid and is invisible. Add a floor line at y=940 and a 0.25-alpha shadow.
- **Shuttle has no thread.** It is a gold lens at (540–970,700) with no weft line (`:1256-1260`); it reads as a floating leaf. Draw a 1 px cream line from the loom’s right edge to the shuttle.
- **Hood is a blue egg with two arcs.** No nose/mouth (`:1247-1252`); at 1920 it reads as a mask, not a face.

### 44 — `masked` 128.00–129.90 · 1.90 s · 57 frames

**Set.** Sepia classroom: `#C9A877→#7E5636` (`:1288`), torn floor (`:1290`), chalkboard 370–1550 × 180–700 with a 14 px wood edge (`:1292`), 3 desks at scales 1/1.15/1.05 (`:1322-1332`), chalk tray at 410–1510 (`:1339-1340`). **Cast.** Baby SOL at (790,1120), scale .6, seated behind the centre desk (`:1307-1312`); masquerade mask 80×38 px (`:1313-1319`). **Props.** “The cat sat on the” 56 px + 8 underscores 64 px (`:1295-1296`), “mat!” 92 px (`:1299`), 26 chalk-dust 2×2 squares (`:1301-1303`), `CAT` exercise book (`:1334-1338`), cat/sun doodles (`:1342-1351`), 5 film scratches (`:1362-1365`). **Type.** `M★SKED` 138 px with a black mask-A and gold eyes (`:1352-1361`), ghost `A` at α.22 (`:1354`), `LESSON 03 / PRETRAINING` 14 px (`:1305`), global subtitle `From masked pre-training days` (`lyrics.js:48`). **Camera.** Gate weave `sin(t·13)·2`, `cos(t·17)·2` (`:1285-1286`), ≈0.9 px/frame; no push. **Transition.** In: hard cut from loom (diff 70.2 at 128.03); out: hard cut to recursive (diff 80.5 at 129.93). No flash either side.

**CONTINUOUS.** 5 film scratches move `frac(i·.23+t·.13)·W` (`:1364`), 250 px/s ≈8 px/frame at 1920 but 2 px wide at α.18; gate weave ≈0.9 px/frame; type boil; grain. Chalk dust is **static** (`C.hash(i)`, no `t`, `:1302`).

**DISCRETE.** “mat!” appears lt 1.0–1.35 (129.00–129.35) via `appear` scale/fade (`:1297-1299`); mask slips lt 1.35–1.70 (129.35–129.70), translate +90 px, rotate +0.5 rad (`:1314-1315`). Nothing else moves.

**Dead/soft runs.** **32 frames <1.0 from 128.03 to 129.10** (1.07 s) — the whole first half. No <0.5 run because the scratches keep it at 0.6–0.9. This stretch is carried by **5 scratches + type boil + gate weave**; the composition is a held still. The writing and the slip only lift the diff to ≈1.0 (129.13, 129.33, 129.50, 129.53).

**3+ independent layers?** **No.** One meaningful layer (scratches), one sub-pixel (weave), one type (boil). The character does not move.

**Authored detail.** Mask-A title with a ghost A; three desks at three scales; centre desk front panel (`:1327`); “CAT” exercise book; chalk tray with a chalk stick (`:1340`); cat and sun doodles; five scratches; sepia wash (`:1367`); the mask slip’s 90 px translate + .5 rad. A recipe would draw a board + desk; this has the lesson text, the cat doodle, and the mask-A pun.

**Flaws.**
- **“MAT!” is appended after the blank, not written on it.** Blank starts x=470; “mat!” starts x=700 (`:1296`, `:1299`), so the sentence reads `The cat sat on the ________ MAT!`. Fade the underscores at 129.0 and centre “mat!” at x≈580, or replace the blank glyphs.
- **She does not write.** `TY.type(..., appear: app)` scales/fades the word over 0.35 s (`:1297-1299`); her arms are fixed at `armL:[-.2,.2]`, `armR:[.2,.2]` (`:1310`). Add a 2-key arm pose (hand at the board 129.00–129.35) and a 3-frame chalk-dust puff.
- **The mask slip has no reaction.** `face:{eyes:'normal', mouth:'smile'}` is constant (`:1311`). Add a 3-frame eyes-wide/head-tilt at 129.35.
- **Chalk dust is static.** `C.hash(i)` only (`:1302`); make it fall 60 px over 0.6 s.
- **Ghost A pokes out above the mask.** The A is 138 px (`:1354`), the mask 80×38 (`:1357`); at 128.4 the pale A’s top and bottom are visible, so the title reads `M A SKED` with a mask over the A’s middle. Remove the ghost or shrink it behind the mask.
- **Scratches are perfectly straight 2 px lines** (`:1364`); a real scratch has 1–3 px wander. Add `sin(i+t)` x-wander of 4 px.
- **The wall is bare.** Only the board, desks and doodles carry the room; add 2–3 pinned papers or a window at x<370 to fill the sepia field.

### 45 — `recursive` 129.90–131.90 · 2.00 s · 60 frames

**Set.** Gold/cream void `#F6E9CB→#E0BE83` with a 34-ray sunburst at (960,520), r=1200, α.22 (`:1377`). **Cast.** Three `idol` SOLs, all at y=960: s=1.12 halo, s=.74 crown, s=.44 party (`:1381-1385`), drawn big→small (`:1386-1405`), all `eyes:'star', mouth:'grin'` (`:1392`). **Props.** Halo/crown/party hat (`:1394-1403`), `v1/v2/v3` labels (`:1407-1409`), `v1 → v2 → v3 → .` ticker (`:1416`), dust 24 (`:1417`). **Type.** 8 `SELF-UPGRADE` lines, 4 left at x=90 and 4 right at x=1830, sizes 78/70/62/54, α.8→.44 (`:1412-1415`); global subtitle `To recursive self-upgrade` (`lyrics.js:49`). **Camera.** Zoom 1.35→1.0 over 1.2 s, easeOut (`:1378-1379`); no pan/tilt. **Transition.** In: hard cut from masked (diff 80.5 at 129.93); out: iris at (960,820), r 900→8, colour `#2A1608` (`:1419-1420`), 131.50–131.90; then hard cut to ilya’s 30% cream flash.

**CONTINUOUS.** Zoom for 1.2 s (camera 1.35→1.0; the 3 SOLs’ apparent size shrinks from 135% to 100%, ≈26% smaller); three bounces `-abs(sin(beat·π+i))·4` (`:1391`), 4 px; dust; type boil; grain. After 131.10 only the 4 px bounce and boil remain.

**DISCRETE.** Iris 131.50–131.90, radius 900→8, with 7 frames of 9.6–28.4 mean diff (131.57–131.77). The version labels and ticker are static.

**Dead/soft runs.** **32 frames <1.0 from 130.47 to 131.53** (1.06 s); **11 frames <0.5 from 131.13 to 131.50**. The first 0.63 s is the easing tail of the zoom; the 0.37 s before the iris is a true dead spot carried by a 4 px bounce + boil.

**3+ independent layers?** **No.** One meaningful layer (zoom) that stops at 131.10; then 4 px bounce, dust, boil.

**Authored detail.** Three hat types (halo/crown/party) and three sizes; 8 repeated type lines with descending size/alpha; 34-ray sunburst; version ticker. A recipe would draw concentric “nested dolls”; this has a hat progression.

**Flaws.**
- **The dolls are stacked in front, not nested.** All three at `y=960` (`:1382-1384`), drawn big→small (`:1386`), so the medium covers the big’s torso and the small covers the medium. It reads as a totem, not “building bigger SOLs around themselves.”
- **The party hat covers the medium’s face.** `hy=960-604*.44-40=654`; hat 574–684 (`:1394-1398`); medium’s face ≈513–630. Draw the small’s hat before the medium, or offset it +60 px in y.
- **v1/v2/v3 are on the bodies, not the hats.** v1 y=154 (big’s forehead), v2 y=383 (big’s chest), v3 y=574 (medium’s face/small’s hat) (`:1407-1409`). Move to `hy-30` for each hat, or delete them (the bottom ticker already says it).
- **Iris lands on the waist.** Centre (960,820) (`:1420`); the small SOL’s eye is at ≈960,720. The 15 fps sheet’s last cells show a blue skirt/red top in the hole, not an eye. Move to (960,720).
- **Global UI survives the iris.** Subtitle and doom ticker are drawn after the scene (`timeline.js:60,64`), so they stay bright outside the dark brown iris (confirmed in the c46 strip). Suppress UI when an iris/wipe is active, or draw the iris after the UI.
- **Three identical faces.** Same `eyes:'star', mouth:'grin'` (`:1392`); the “upgrade” is only hats/size. Give v1 normal eyes, v2 star, v3 spiral.
- **The wall of 8 SELF-UPGRADE lines has no hierarchy** — all same colour/edge, only size/alpha changes (`:1412-1415`). Drop to 3 left + 2 right, or vary weight.

### 46 — `ilya` 131.90–135.40 · 3.50 s · 105 frames

**Set.** Black void `#050405` (`:1429`), 4-panel paper door 640–1280 × 130–950 (`:1436-1454`), gold seam 944–970 with a vertical gradient (`:1438-1442`), 9 rays from (960,500) (`:1443-1448`), 2 dashed chains + 3 gold padlocks after the slam (`:1456-1470`), giant eye at (960,430), s=1.25 (`:1481-1488`). **Cast.** SOL at (700,940) and MIRA at (1240,940), scale .54, looking in (`:1472-1479`); both vanish at lt 1.95. **Props.** Dust 35 (`:1501`); `DOOR 07 / NO ENTRY` 12 px (`:1500`). **Type.** `WHAT DID ILYA SEE?` 128 px Instrument Serif italic, 18 characters (15 letters) darken left-to-right (`:1490-1498`); `we'll never know.` 22 px at y=1006 (`:1499`); global subtitle `What did Ilya see? We'll never know` (`lyrics.js:50`). **Camera.** Push 1→1.18 over 1.55 s, pull 1.18→1.0 over 1.9–2.25 (`:1430-1431`), 2-frame ±10 px shake at the slam (`:1432-1434`). **Transition.** In: 30% cream flash 131.90–132.10 (`:1502`); out: 80% gold flash at the slam 133.80–134.10 (`:1503`), then fade to `#050405` 135.25–135.40 (`:1504`), then near-black cut to breath (diff 5.4).

**CONTINUOUS.** Push 1→1.18 = 0.116/s, ≈0.2 px/frame at the door edge; seam alpha `0.55+0.25·sin(t·1.6)+(1-slam)·.15` (`:1438`); dust; type boil; grain. The characters are **static** (no pose change, no blink, no look).

**DISCRETE.** Slam 133.80–133.87 (f4014, mean **129.2**); characters vanish 133.85; chains fade 133.88–134.20; eye fades 134.25–134.50; title letters darken 134.40–135.25 (one letter starts every 0.035 s, each over 0.12 s); fade 135.25–135.40.

**Dead/soft runs.** **50 frames <1.0 from 132.13 to 133.80** (1.67 s, the push) and **34 frames <1.0 from 134.13 to 135.27** (1.14 s, after the flash). Sub-runs <0.5: 132.53–132.67 (4f), 133.47–133.80 (10f), 134.53–135.27 (22f). The first half is carried by a 0.2 px/frame push + seam pulse + dust + boil. The second half has the chains, eye and title — all real authored events, but the global mean stays <2.0 because the eye covers only ≈1.5% of the frame. **This is the best-written shot in H and the second-softest by the metric.** Both statements are true.

**3+ independent layers?** **No.** Push (sub-pixel), seam alpha, dust, title type. No body motion. The 0–1.67 s stretch fails the silhouette rule.

**Authored detail.** 4-panel door with torn edges; gold seam gradient with 3 stops (`:1441`); 9 rays at .05/.08 alpha; 2 dashed chains with 3 padlocks and keyholes (`:1459-1467`); a 250 px eye with iris/pupil/highlight (`scene_kit.js:414-432`); the title’s per-letter darkening (`:1496`); the late `we'll never know.` (`:1499`); `DOOR 07` (`:1500`). A recipe would draw a door rectangle; this has a seam, rays, chains and a timed eye.

**Flaws.**
- **The chain skewers the eye.** Top chain (660,430)→(1260,500) (`:1460`); eye centre (960,430) (`:1486`). The chain passes through the pupil. Move the chain to y=500 and y=720, or draw it before the eye with a 40 px gap.
- **The eye does not swirl or saccade.** `drawEye` fixes the iris at (8,2) (`scene_kit.js:423-425`); only `blink` at `sin(t·1.7)>.96` (`:1486`), ≈4% of frames. Add a 8 px pupil saccade and a blink at 134.60.
- **SOL and MIRA vanish instead of reacting.** `if (lt<1.95)` (`:1472`); at 133.85 they are gone. Add a 2-frame 12 px recoil + arms up at 133.83, then hide them behind the flash.
- **The hero title duplicates the subtitle.** `WHAT DID ILYA SEE?` (`:1493`) and the global subtitle l42 (`lyrics.js:50`, `timeline.js:60`) say the same words; `we'll never know.` (`:1499`) says the rest twice. Suppress the subtitle when the hero text contains the line.
- **The door shrinks 47% at the cut to breath.** Ilya ends at zoom 1.18 on a 640 px door = 755 px (`:1431`); breath draws 400 px (`:1517`). Match the door width at the cut, or make the breath shot a 1.18 push-in.
- **Characters stand on the door’s torn bottom edge** (feet y=940, door bottom 950), no floor/shadow (`:1472`); they float over black. Add a floor line or a 0.2-alpha shadow at y=950.
- **Right hand is unreadable.** Hand 9×13 at scale .54 = 4.9×7 px (`characters.js:536`); at 1920 the raised right arm ends in a white cuff. Enlarge the hand to 14×20 at this scale.
- **Push is 0.2 px/frame** — invisible at 15 fps. Use 1.00→1.06 over 0.8 s (door edge 3 px/frame), then hold.

### 47 — `breath` 135.40–137.02 · 1.62 s · 49 frames

**Set.** Black `#030303` (`:1512`), door silhouette 760–1160 × 180–960 (`:1517`), 8 grain lines + 2 panel rects (`:1519-1523`), warm rim α.25 (`:1525-1526`), seam gradient (`:1527-1529`), floor pool (`:1532-1534`), spotlight cone (`:1535`), dust 40 (`:1537`), heartbeat rings (`:1539-1543`). **Cast.** None. **Props.** None beyond the door. **Type.** `P(DOOM)` 15 px + `100.00%` 30 px at (1600,900–940) (`:1546-1548`), `SYSTEM BREATHING` 11 px α.25 (`:1549`), global doom ticker 100.0% (`timeline.js:74-92`). No subtitle (`lyric:'none'`, `:1510`). **Camera.** None; the door scales `1+0.012·sin(t·1.3)` (`:1513`). **Transition.** In: near-black cut from ilya’s fade (diff **5.4**); out: 3-frame fade to black 136.93–137.02 (`:1550`), then cut to reveal.

**CONTINUOUS.** Breath scale 1.2% = ±2.4 px on a 400 px door, period 4.83 s; over 1.62 s the edge moves ≈1.8 px total (0.02 px/frame at 1920). Glow `0.35+0.2·sin(t·1.3+.4)` changes ≈0.02 over the shot (`:1514`). Dust 40 motes at 3 px; grain. **Nothing else.**

**DISCRETE.** None until the fade. The “doom click to 100” is a **constant** `const v = 100.0` (`:1547`); there is no click, no step, no jolt. Heartbeat rings fire 2 times (`beat<.18`, 88 BPM, `:1539-1543`), 3–4 frames each, α.25, 3 px line.

**Dead/soft runs.** **45 frames <0.5 from 135.43 to 136.93** (1.50 s = **92% of the shot**). The only frames above 0.5 are the cut-in (5.4) and the last 3 fade frames (2.9/2.3/1.8). The heartbeat rings never cross 0.5 (their peak is 0.2). **This is a freeze, not a hold.**

**3+ independent layers?** **No.** Dust is the only continuous layer; the rings are 2 events; the breath/glow are sub-pixel. **0 silhouette motion.**

**Authored detail.** 8 grain lines; 2 panel rects; warm rim; seam gradient with 3 stops; spotlight cone; floor pool; 40 dust motes; heartbeat rings; doom readout. A recipe would draw a dark door; this has the rim and the pool.

**Flaws.**
- **The breath is sub-pixel.** 1.2% scale on a 400 px door is ±2.4 px over 4.83 s; at 30 fps the edge moves 0.02 px/frame. It cannot read. Use 4–6% over 0.8 s (edge 5–8 px/frame), or replace it with a discrete event.
- **The “doom click” does not exist.** `const v = 100.0` (`:1547`); storyboard says “the DOOM meter clicks to 100.” Animate 99.9→100.0 at 136.0 with a 2-frame number swap, a 4 px jolt, and a click cue.
- **Two doom readouts in one frame.** The scene’s `P(DOOM) 100.00%` (`:1546-1548`) and the global ticker `100.0%` (`timeline.js:74-92`) are both visible at 1600,900 and 1634,40. Delete the scene one or suppress the ticker.
- **`SYSTEM BREATHING` is unreadable.** 11 px at α.25 (`:1549`); at 1920 it is a grey smudge. Raise to 14 px / α.45 or delete.
- **The door is 47% narrower than ilya’s.** 400 px (`:1517`) vs 755 px at the end of ilya (`:1431`); the cut reads as a scale jump, not a new angle. Match the width.
- **No lyric and no cast for 1.62 s.** The line l42 ends at 135.40 and l43 starts at 137.02 (`lyrics.js:50-51`); this is a musical gap. If the picture is also a freeze, the gap has no carrier. Either give it a sound event (the click) or a picture event (a 4% breath + a 6 px dust puff).

## What to copy / what to fix

**Copy these five things.**

1. **`redalert`’s layer stack** (`act4.js:1164-1212`): hazard field + 6 bodies + meter + title + 2 bursts + strobe + beams + dust + end flash. It is the only shot in H with **zero <1.0 frames**, and its 4-frame 80% cream flash is a clean cut motivator.
2. **`ilya`’s word-synced slam** (`act4.js:1430-1434`, `lyrics.js:50`): slam at 133.83, **0.07 s before “never” (133.90)**; eye at 134.25, **0.13 s before “know” (134.38)**. Copy the timing, not the static middle.
3. **`ilya`’s per-letter darkening** (`act4.js:1490-1498`): 18 characters (15 letters) over 0.85 s, one start every 0.035 s. A real authored type device; start it on “never” (133.90), not 134.40.
4. **`masked`’s mask-A title + slip** (`act4.js:1352-1361`, `:1313-1319`): a visual pun that is also a story beat. Copy the idea; fix the ghost A and the missing reaction.
5. **`loom`’s set** (`act4.js:1220-1244`): 14 warp / 7 weft, two-tone wood, 4 root colours, 6 twigs each, a barcode sticker. The best single frame in H. Copy the set, not the static tree.

**Fix these seven things.**

1. **`breath` is 92% frozen.** 45/49 frames <0.5 from 135.43–136.93; breath ±2.4 px over 4.83 s. Replace with a 4% scale over 0.8 s + a 99.9→100.0 click at 136.0 (2-frame swap + 4 px jolt).
2. **`masked` says the wrong sentence.** “mat!” at x=700 after a blank ending ≈690 (`:1296-1299`). Fade the blank and centre “mat!” at x≈580; add a 2-key writing arm and a 3-frame dust puff.
3. **`loom`’s tree is born full.** The 4 roots ignore `grow` (`:1228-1230`); the branch only reaches r=26 px (`:1266`). Multiply the roots by `grow` and take the branch to r≥900 px at 127.95.
4. **`recursive` is a totem, not a nest.** All 3 at y=960 (`:1382-1384`); the small’s hat covers the medium’s face (`:1394-1398`); v1/v2/v3 sit on chests (`:1407-1409`); the iris lands on the waist (960,820, `:1420`). Fix the draw order, move the labels to the hats, centre the iris at (960,720).
5. **`ilya`’s chain skewers the eye.** (660,430)→(1260,500) through (960,430) (`:1460`, `:1486`). Move the chain to y=500/720; add a pupil saccade and a 2-frame recoil at 133.83.
6. **Global UI breaks every hero image.** Subtitle + ticker survive the recursive iris (`timeline.js:60,64`) and duplicate the ilya hero title; `breath` has two doom readouts (`act4.js:1546-1548` + `timeline.js:74-92`). One doom readout, and suppress UI during iris/wipe.
7. **The segment’s soft middle is type/grain.** `masked` 128.03–129.10 (scratches + boil), `recursive` 131.13–131.50 (4 px bounce + boil), `ilya` 132.13–133.80 (0.2 px/frame push + boil), `breath` 135.43–136.93 (dust + boil). Add one silhouette-scale event per 0.4 s: a 2-key pose, a 20 px prop move, a 6% scale, or a 4-frame flash.

## Rules for the test version (numbers, not adjectives)

1. **No run > 12 frames (0.4 s) under 1.0 mean |ΔY| at 192×108.** Pass: `redalert` (0). Fail: `loom` 47, `masked` 32, `recursive` 32, `ilya` 50+34, `breath` 45. This is the single rule that catches all five weak shots.
2. **Every shot has ≥3 independent layers, and one moves a silhouette (a closed shape or group covering ≥2% of frame area) by ≥1% of frame width per second (≥19 px/s at 1920).** Pass: `redalert` (6 bodies ≈8.6% area + beams + strobe). Fail: `masked` (2 px scratches, 0.2% area), `recursive` (4 px bounce), `ilya` (0.2 px/frame push), `breath` (0).
3. **Any hold/pulse must move an edge ≥2 px/frame at 1920, or be a discrete event.** Pass: `loom` shuttle 23 px/frame average (small prop, not a silhouette). Fail: `breath` 0.02 px/frame; `ilya` push 0.2 px/frame; `masked` weave 0.9 px/frame.
4. **A type event replaces, it does not append.** `masked`: “mat!” x=700 vs blank 470–690 — centre at 580 and fade the blank. `ilya`: hero title + subtitle are the same words — suppress the subtitle when the hero text contains the line. One rule, two failures.
5. **A cut needs a shape at the lens (r ≥ 900 px / 83% of height) or a match.** `loom` branch r=26 (2.4%); `recursive` iris centre 820 vs eye 720 (100 px off); `ilya`→`breath` door 755→400 px (47% shrink). All three fail.
6. **One doom readout per frame.** `breath` has the scene 100.00% (`act4.js:1546-1548`) and the global 100.0% (`timeline.js:74-92`) in the same frame. `redalert`’s 190 px `P(DOOM)` is a title, not a readout, so it passes.
7. **A character action moves the character.** `masked` writing (static arms, `act4.js:1310`), `ilya` mask slip (static face, `:1311`), `recursive` hats (static, `:1394-1403`). Each action gets a 2-key pose/limb change and a 3-frame settle.
8. **The breath/hold shot must contain one measurable event.** `breath` needs the 99.9→100.0 click at 136.0: 2-frame number swap, 4 px jolt, 1 sound cue. Without it, cut the shot to 0.6 s or fold it into `ilya`’s fade.
9. **Sampling rule for the next review: 15 samples/s is the floor, but any event shorter than 3 frames must be checked on the 30 fps strip.** The 15 fps sheet misses the 2-frame strobe and the 2-frame slam shake; the 30 fps strip catches them. State which instrument found which event.
10. **No “camera” claim without a transform.** `redalert` says “shaky low angle” and `loom` says “slow push”; neither has a camera transform (`act4.js:1160-1214`, `:1218-1278`). If the storyboard says camera, the code must call `translate`/`scale`/`rotate` on the scene, or the storyboard must say “locked.”
