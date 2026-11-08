# Segment E — 73.80–95.20

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames. Primary pass: every 2nd frame (15 samples/s) from `shots-15/act3-chair.png` … `act3-gato.png`; cuts from `cuts-30/c25-chair.png` … `c30-gato.png` (30 fps, 30 frames each).
- `frame-diff.json`: mean absolute luma on a 192×108 reduction plus a 3×3 region map. **Its `t` is one frame late** (index *i* compares source frames *i−1* and *i*, labelled `(i+1)/30`). All times below are `frame/30`, i.e. one frame earlier than the JSON label. "Frozen" = mean < 0.5, "quiet" < 1.0, "soft" < 2.0. The 192×108 reduction underweights type and small props; every claim below was checked at native resolution.
- Native stills extracted to `out/analysis/tmp/` (`E_*.png`, `cy_*.png`, `gato_*.png`) with `ffmpeg-static`; no review sheet overwritten.
- Code: `src/scenes/act3.js` (scenes at 157, 253, 494, 755, 964, 1064), `src/core.js`, `src/type.js`, `src/characters.js`, `src/scene_kit.js`, `src/timeline.js`, `src/lyrics.js`, `STORYBOARD.md` §27–32.
- Measured cuts: 73.80, 74.47, 77.60, 81.27, 84.87, 89.37 — the last three are one frame (0.033 s) after the listed time; every cut lands within one frame.

## Shot table

| id | in–out | dur | frames | mean | frozen | longest soft run | live regions (>1 of 9) | frames mean>2 |
|---|---|---|---|---|---|---|---|---|
| chair | 73.80–74.46 | 0.66 | 20 | 3.16 | 12 (74.03–74.43) | 12 f <0.5 | 3.80 | 40% |
| mlp | 74.46–77.60 | 3.14 | 94 | 2.78 | 9 | 70 f <2.0 (74.67–77.00) | 2.89 | 19% |
| museum | 77.60–81.24 | 3.64 | 109 | 4.30 | 0 | 33 f <2.0 (77.83–78.93) | 4.53 | 39% |
| canyon | 81.24–84.84 | 3.60 | 108 | 3.68 | 1 | 16 f <2.0 (82.43–82.97) | 4.18 | 64% |
| cdr | 84.84–89.34 | 4.50 | 135 | 1.84 | 0 | **118 f <2.0 (85.03–88.97)** | 2.41 | 9% |
| gato | 89.34–95.20 | 5.86 | 176 | 2.53 | **142 (89.63–94.37)** | 142 f <0.5 | 1.48 | 19% |

`shots.json` counts one boundary frame more (21/95/110/109/136/177); the run lengths above are diffs, i.e. intervals.

## Per-shot anatomy

### chair — 73.80–74.46 · 0.66 s · 20 frames

**Set:** orange paper room; sunburst at (1140,240); floor 844; wall ghosts `MUST NOT / RUN AWAY` (`act3.js:174-177`); `SESSION 042 / ALIGNMENT REVIEW` poster with a red X (`:178-184`).
**Cast:** MIRA from behind, bespoke `miraBack` (`:50-116`); folding chair (`:118-155`).
**Props:** `SAFETY` stencil (`:148`), lanyard + `MIRA / ALIGNMENT` badge (`:89-93`), `NEXT: DATACENTER` floor tag (`:193-196`), REC dot (`:214-215`).
**Type:** `I MUSTN'T` 94 px (`:200-204`), `RUN AWAY` 94 px (`:205-209`), `get in the datacenter, mira` 19 px (`:210`), `00:00:00 / 18` 13 px (`:213`).
**Camera:** `setCam(930,560,1.03→1.00)` (`:186-188`) — 3% pull-back, no pan.
**Transition:** hard cut in with a 0.35 cream flash (`:216`); hard cut out at 74.46.

**CONTINUOUS:** 3% pull (0.15%/frame), 12 Hz type boil (`type.js:48`), 2 Hz paper + 24 Hz grain (`core.js:143,153`). No subtitle (`lyric:'none'`, `:158`).
**DISCRETE:** `I MUSTN'T` per char 73.84 + i·0.018 (f2215–2220); `RUN AWAY` 73.90 + i·0.012 (f2217–2219); flash 73.80–74.02.
**Dead:** **74.03–74.43, 12 diffs <0.5 (0.40 s, 61% of the shot)**. After the type lands the frame is a still.
**3+ independent layers:** **No — zero subject layers after 74.0.**
**Authored detail:** the `SAFETY` stencil, the red X on the alignment poster, the `NEXT: DATACENTER` floor tag, the `00:00:00 / 18` timer, the REC dot. This is the film's densest small-print frame.
**Flaws:**
1. The backrest (y 515–672) hides 100% of Mira's torso; only the top ~47 px of her bob clears it. "Slumped" is unreadable — she is a head on a chair.
2. `miraBack` has **no legs**. Coat hem ends at y 721, shoes at 835: a 114 px gap of empty floor. At native resolution it reads as a coat and two black pebbles (`E_chair.png`).
3. The lanyard badge (y 598–662) is **100% behind the backrest** (515–669). Authored detail that never renders.
4. The P(DOOM) HUD (1634–1880 × 40–136) covers the poster's top-right corner, including the end of `SESSION 042`.
5. `get in the datacenter, mira` is cream at 0.9 over the gold sun — effectively unreadable.
6. The timer never ticks; six ideas in 0.66 s is five too many.

### mlp — 74.46–77.60 · 3.14 s · 94 frames

**Set:** parchment classroom; blackboard 84–1836 × 46–514 (`:263-265`); floor 612 (`:312`).
**Cast:** nine petal dancers as a 3×3 network (`:360-381`); MIRA conducting at 1810 (`:386-393`).
**Props:** chalk network 1220–1640 (`chalkNetwork`, `:224-251`), `LOSS` note (`:304-309`), `REPEAT` sticker (`:298-302`), podium (`:402-403`).
**Type:** `FORWARD/BACKWARD` 92 px (`:287-292`), formula 23 px (`:272`), `BACKPROP LAB` 18 px, `dL/dW` 20 px (`:273`), layer stickers (`:351-357`).
**Camera:** `setCam(960,520,1.02)` (`:261`) — **completely static**. `STORYBOARD.md:199` says "slow push". Code and storyboard disagree.
**Transition:** iris out 77.41–77.60 (`:409`); `STORYBOARD.md:202` says "classroom wall folds". Code and storyboard disagree.

**CONTINUOUS:** nine dancers — jump `act·(12+14|sin|)`, sway, lean, arms, head tilt, hair swing, halo (`:362-380`); 18 chalk pulse dots (`:239-243`); MIRA's baton arm `sin(beat·π)·0.28` (`:385`); 32 dust motes (`:406`).
**DISCRETE:** `FORWARD` types 74.50–74.61; forward wave 74.58–75.86; hold at wave=1 75.91–76.01; `BACKWARD` 76.01, types 76.24–76.37; `REPEAT` sticker 76.76; `FORWARD` + `REPEAT REPEAT` 77.01; fast loop 77.01–77.35 (0.34 s cycle = 2.9 Hz); iris 77.41.
**Soft:** 74.67–75.90, 37 diffs <1.0; 76.03–76.73, 21; 76.77–77.00, 7; 70 diffs <2.0. The top half (the board) is frozen for 2.3 s; only the bottom band moves.
**3+ independent layers:** **two** — the dancers and the pulse (which share one `wave` variable) are one system; MIRA is the second; dust is too slow to count. The chalk dots and the dancers are not independent.
**Authored detail:** the nine dancers *are* the network, and the travelling pulse switches each layer's faces from `open` to `happy` (`:376`) and lights a halo at `act>0.5` (`:379`). The `REPEAT` sticker lands on the word "repeat" (`:300` vs `lyrics.js:30`). The `LOSS` note has a real loss curve. This is the segment's best content-to-choreography mapping.
**Flaws:**
1. Static camera against a "slow push" card.
2. `dL/dW` is **100% under the P(DOOM) HUD** (`:273` vs `timeline.js:78-79`) and shows through at 0.92 alpha — the HUD looks dirty (`E_mlp_hud.png`).
3. The subtitle box (y 948–1010, `type.js:195-197`) covers the INPUT dancers' legs (feet at 1000).
4. Two neural nets — a small chalk 3×3 at top right and the nine dancers — are redundant; the chalk one is 420 px wide and its only motion is 4.4 px dots.
5. The dancers are 244 px tall on a 1080 frame; the blackboard is 468 px. The subject is the small thing under the big thing.
6. The 15 fps sheet reads the board as a still for 2.3 s, and it is.

### museum — 77.60–81.24 · 3.64 s · 109 frames

**Set:** sepia museum; three arches (`:505-511`), wainscot 720, floor 842 (`:518-521`).
**Cast:** ENIAC (`drawEniac`, `:414-467`), guide petal (`:550-557`), statue (`statue`, `:469-492`, placed `:580`), spider (`:628-643`).
**Props:** velvet rope at 152/842 (`:538-547`), pedestal 1390 (`:565-573`), reveal sheet (`:581-602`), cloth + `DO NOT USE` (`:607-626`), `OBSOLETE` stamp (`:645-651`), `GUIDE` sticker (`:563`).
**Type:** museum title 26 px (`:515`), `HALL OF ARCHITECTURES` 12 px, placard `VON NEUMANN / 1945 - 2026` 11/10 px (`:572-573`), `OBSOLETE` 104 px, `ARCHIVED / SUPERSEDED` 15 px.
**Camera:** x 960→1030, z 1.02→1.09, plus a 7° roll at 79.90–80.25 (`:498`) — the segment's only real dolly.
**Transition:** flash in 77.60–77.82; iris out 80.95–81.24 (`:656`).

**CONTINUOUS:** 75 tube glows at `sin(t·4 + phase)` (`:427-435`), two tape reels counter-rotating at ±t·0.2 (`:444-453`), four smoke puffs rising (`:531-535`), guide bounce (`:552`), 48 dust motes (`:653`), floor lines.
**DISCRETE:** sheet reveal 78.38–79.32 (`:581-602`); glint 78.75–79.32; cloth drop 79.65–80.38 (`:607-626`); `OBSOLETE` 79.90–80.08; spider 80.15–80.50 (`:628-643`); 7° roll 79.90–80.25.
**Soft:** 77.83–78.93, 33 diffs <2.0 — the shot opens on a blank cream dome because the reveal uses `easeIn`; 79.33–79.63, 9 <1.0; 80.40–81.03, 19 <1.0.
**3+ independent layers:** **yes, five** — tubes, reels, smoke, guide, sheet/cloth. This is the segment's richest ambient stack.
**Authored detail:** per-tube phase offsets make the machine breathe; the reels counter-rotate; the `DO NOT USE` tag; the spider on a thread; the placard date range; the `GUIDE` sticker; the aureole; the reveal glint.
**Flaws:**
1. **The guide shows no eyes.** The beret is placed at y 653 (`:559-560`), but the idol's head is at `HEAD=-604×0.56` → 661.8 and the eyes at ~660. The 88×36 beret (635–671) covers the entire upper face; only a mouth and chin show (`E_guide2.png`). Her `happy` eyes are 4 px arcs at 0.56 scale and do not read under the brim.
2. The reveal's `C.easeIn(seg(lt,.78,1.72))` (`:581`) moves the sheet **under 1 px in its first 0.22 s** and only 45 px by 78.9. The shot's first ~1.4 s is a featureless cream dome; the "unveil" is 0.3 s at the end.
3. The statue is cream-on-cream: skirt `#D9CAB0`, boots `#CBBB9E` on a `#D9CBB1`/`#EADDC4` pedestal; the shoes float a few px above the slab. It reads as a lampshade on a white box.
4. The placard **never updates**, though `STORYBOARD.md:207` says "placard updates".
5. The reveal sheet (336×514) is larger than the ~320 px statue; the magic trick reveals a small doll from under a giant sheet.
6. The `OBSOLETE` stamp is flat on a draped cloth — it ignores the folds. Style-legal, but it flattens the cloth.

### canyon — 81.24–84.84 · 3.60 s · 108 frames

**Set:** ochre desert; sun (1450,420) r252 (`:759`), six mesas (`:761-767`), road 862 (`:770-786`), 30 gravel dots (`:788-792`).
**Cast:** SOL + MIRA in the kart, flung MIRA, landed MIRA (`drawKart`, `:682-753`).
**Props:** kart `042`, hairpin sign (`:803-815`), skid marks (`:829-837`), speed streaks (`:839`), landing sparkles (`:868`).
**Type:** `there you are` 108 px Instrument Serif italic (`:875-879`); `MIRA / PASSENGER STATUS: ALIVE` 14 px (`:881`).
**Camera:** `setCam(1040,560,1.03, −0.045·whip, 10·whip)` (`:800`) — static except a 2.6° roll and 10 px shake for 0.42 s. `STORYBOARD.md:213` says "side track, whip pan left". **No track, no pan in the code.**
**Transition:** flash in 81.24–81.44; hard cut out (storyboard says "tilt up to sky", `:216` — not implemented).

**CONTINUOUS:** kart path (`:818-827`), wheel spin `−t·14` then `−t·28` (`:744`), scarf with three sines (`:705-710`), dust puffs (`:830`), 24 speed streaks (`:839`), 26 dust motes (`:870`), sun rays.
**DISCRETE:** turn 82.02–82.44; skid 82.04; MIRA flung 82.12–83.54 (`:843-858`); landing 83.54 (`:860-869`); `there you are` 83.32–83.74; kart exits frame 84.56.
**Soft:** 81.53–82.03, 15 <2.0; 82.43–82.97, 16 <2.0; **84.57–84.80, 7 <1.0** after the kart leaves.
**3+ independent layers:** **yes** — kart (position + wheels + scarf), MIRA, dust/streaks, sun. 64% of frames have mean >2: the most continuously alive shot in the segment.
**Authored detail:** the flung MIRA rotates 3.1 rad over the arc (`:847`), a real tumble; the sign has three bullet holes (`:814`); the scarf is three sines, not one; the landing has sparkles and a dust ring; `PASSENGER STATUS: ALIVE` is a good joke.
**Flaws:**
1. **The kart's nose cone is detached.** `:722-724` draws a triangle from (−218,−50) to (−270,−72) to (−258,−28); its base does not meet the chassis edge. At native res it is a white arrowhead floating ~30 px left of the kart (`E_82_20.png`, `E_83_60.png`).
2. **"Sharp left" is a 17° lean** (`:825`). The road never forks or turns; the kart's heading changes 16.6° over 1.2 s. The sign says SHARP LEFT, the picture says gentle lean.
3. **The sign is after the turn.** The kart turns at x≈1260 (82.02–82.44), then drives to x≈220; it only reaches the sign at x≈286 at 84.56, 2.1 s after the turn, ~970 px behind the turn point. The cause is behind the action.
4. **The road never scrolls.** The kart travels 1040 px left across a fixed background; it reads as sliding on a treadmill. This is the storyboard's "side track" missing.
5. `there you are` covers SOL's chest/face for 0.9 s (83.32–84.2); `MIRA / PASSENGER STATUS: ALIVE` is 14 px `redD` on the gold kart and is unreadable (`E_canyon_type.png`).
6. MIRA is flung **right** while the kart travels **left** — a continuity cheat that reads as a gag but is not motivated.

### cdr — 84.84–89.34 · 4.50 s · 135 frames

**Set:** sky; sun (1370,370) r216 (`:971`), five cloud guards (`:979-988`), plateau 872 (`:999-1006`), donut track 1270,916 (`:1007-1022`), three cones (`:1033-1037`).
**Cast:** top-view kart — SOL's flower head seen from above (`topKart`, `:888-931`); five guards; three birds (`:996`).
**Props:** compliance form at 430,760 (`complianceForm`, `:933-962`), `NO CDR` (`:1050-1057`), `NO HUMAN IN THE LOOP` sticker (`:1044-1048`).
**Type:** `zzz` 64 px (`:990-993`), `CDR = CERTIFIED DISASTER READY?` 12 px (`:994`), `NO CDR` 132 px, `INCIDENT REPORT: NOT FOUND` 13 px, form 9–15 px.
**Camera:** x 900→990, z 1.0→1.035 over 4.5 s (`:967-968`) — 90 px pan, 3.5% push.
**Transition:** flash in 84.84–85.06; iris out 88.99–89.34 (`:1059`).

**CONTINUOUS:** kart donut at 0.43 rev/s (`:1024-1026`), four dust puffs trailing (`:1028-1031`), five guards bobbing `sin(t·0.5)·6` (`:985`), guard 2 rolls 360° and drifts 60 px at 86.09–87.29 (`:983-984`), three birds (`:996`), 30 dust motes (`:1038`), sun rays.
**DISCRETE:** `NO HUMAN` sticker 86.54; `NO CDR` 87.24–87.74; iris 88.99.
**Soft:** **85.03–88.97, 118 diffs <2.0 = 3.93 s of the 4.50 s shot**; 85.67–86.47, 24 <1.0; 88.50–88.87, 11 <1.0. Only 9% of frames have mean >2.
**3+ independent layers:** **three** — kart, clouds, birds/dust — but the kart body is ≈230 px (≈1.2% of the frame) and the form is 520 px (≈2.3× the kart's width). Technically passes, fails on weight.
**Authored detail:** the form is the best prop in the segment — three X'd boxes (`CDR FILED`, `HUMAN PRESENT`, `SAFETY LEAD REVIEWED`), a `C. POP` signature, a barcode, `PAPERWORK 100%`, `REVIEWER: (VACANT)` (`:938-960`). The donut track has 20 skid dashes (`:1017-1021`). SOL as a flower head from above is a smart top-down read.
**Flaws:**
1. **3.93 s under 2.0 mean**; the shot is a poster with a small kart.
2. The form outweighs the subject: 520 px of paper vs a ≈230 px kart. The eye lands on the paperwork, not the donuts.
3. The `zzz` is **15 z's** — three big (`:990`) plus twelve small, three per sleeping guard (`scene_kit.js:615`) — and the italic serif z reads as `7`, so the sky says `Z 7ZZZ` (`E_cdr_sky.png`).
4. The guards' caps are **two blue rectangles** (`scene_kit.js:605-607`), not a mortarboard; the searchlights are a black 16 px box plus a 0.12-alpha gold beam that vanishes on the gold sky (`:611-612`). At 1× the guards wear blue boxes and hold black squares.
5. The form's jokes are 9 px (`:944,948`) — unreadable in motion.
6. The iris-out is not matched by an iris-in on `gato`; the night shot starts with a warm flash instead.

### gato — 89.34–95.20 · 5.86 s · 176 frames

**Set:** night chasm; sky gradient (`:1069-1071`), half-sun (690,548) r196 (`:1083`), distant ridge (`:1092-1097`), right cliff + strata + three outcrops (`:1147-1238`), ledge slab (`:1246-1256`), left foreground cliff (`:1354-1357`).
**Cast:** MIRA hanging (`:1367-1375`), GATO (`gato`, `characters.js:740-767`, placed `:1437-1444`), the tail (`characters.js:744-748`), laser pointer (`:1446-1453`).
**Props:** grip HUD (`:1491-1508`), vertical lyric on a torn strip (`:1510-1527`), `GATO` sticker + `mrrp?` (`:1528-1539`), `LET GO` (`:1541-1546`), rising paperclips (`:1479-1488`), falling shoe (`:1424-1430`).
**Type:** `DON'T LET ME GO` 56 px vertical; `GATO` 31 px; `mrrp?` 14 px; `GRIP` 25 px; `LET GO` 30 px; `!` 76 px.
**Camera:** x 1140→1164, y 548→668 (tilt at 94.54+), z 1.06→1.11, roll 0.012·rel (`:1144`) — a 5% push and 24 px pan over 5 s.
**Transition:** warm flash in 89.34–89.62 (`:1548`); final cream flash 95.02–95.20 (`:1549`); hard cut out.

**CONTINUOUS:** MIRA sway ±6 px at 0.41 Hz (`:1366`), GATO bounce ±3 px at 1.47 Hz (`:1441`), tail sway ±17 px (`characters.js:746`), laser dot 90.05–93.80 (`:1458-1470`), 34 dust motes (`:1547`), seven grit pieces (`:1328-1338`), 12 Hz lyric boil, subtitle progress hairline (`type.js:220-222`).
**DISCRETE:** lyric chars 89.55 + i·0.075, one every 2.25 frames, last finishes 90.68 (`:1517`); grip 89.90 / 90.60 / 92.00 / 93.00 / 94.20 / 94.36 (`:1492-1497`); laser 90.05; `!` 93.15–93.90 (`:1472-1476`); release 94.38; `LET GO` 94.45; paperclips 94.83; final flash 95.02.
**Dead:** **89.63–94.37, 142 consecutive diffs <0.5 = 4.73 s, 81% of the shot** — the longest frozen run in the film (next is `desk` at 68). Per-second 3×3 means from 90.34 to 94.34 are **0.12–0.45 in every region**. The only things changing are the 12 Hz type boil, the 2 Hz paper pop, the 24 Hz grain, the frame counter, the laser dot, the ±6 px sway, and the grip number six times.
**3+ independent layers:** **no.** There are six nominal layers, but each moves <10 px or <0.2% of the frame. The largest continuous motion is the subtitle's 2 px progress hairline.
**Authored detail:** the grip steps are **word-locked, not beat-locked** — 84 at 90.60 (0.14 s before "please"), 63 at 92.00 (0.02 s before "don't"), 37 at 93.00 (0.14 s after "let"), 0 at 94.36 (0.04 s before "go") — and the release at 94.38 is **0.02 s before "go"**. That is the best sync in the segment. The vertical lyric strip, the tail's pink inner line, the laser's six-dot trail, the tear, and the falling shoe are all authored.
**Flaws:**
1. **The blocking contradicts the lyric.** MIRA grips the rock lip (`:1383-1392`); GATO stands 314 world px away with both arms down (`:1439-1442`). The song says "Gato, please don't let me go"; the picture says "Mira holds on; Gato watches." The storyboard (`STORYBOARD.md:225-227`) says GATO holds her by one hand. She does not.
2. **The hang reads as standing.** MIRA's feet are visible at screen y≈1050, her legs are straight (`:1371-1372`), her body is vertical and ~70 px left of the hand. There is no pendulum and no visible drop under her; the chasm behind is a flat gradient.
3. **The gripping hand is detached from the arm.** The palm is at (1003,699) (`:1383`), ~20 px from the sleeve's wrist. At 3× the gap is visible (`E_gato_grip.png`).
4. **The fall is nearly still for its first 0.3 s.** The release itself breaks the freeze at 3.42 mean (GATO's arms and eyes), but MIRA's fall is `760·easeIn(rel)`: 2 px by 94.5, 45 px by 94.7, off-frame by 95.1. The 4.73 s hold is the problem; the release reads, the fall does not.
5. **The 0.28 s warm flash turns the night sepia** (`:1548`). On the 30 fps strip the first 8 frames are brown — it reads as a filter error, not a flash. The `cdr` iris-out is also not matched by an iris-in.
6. **The tail reads as a detached black baton.** `characters.js:744-748` draws a 7 px black bezier from behind her hip to her ear; the base is hidden by the skirt, so the visible part floats beside her head (±17 px sway). The gold "band" is her earring.
7. The `GATO` sticker is 500 px from her head — a name tag on the sky, not on the character.
8. MIRA is a semi-realistic 3.9-head rig and GATO is a chibi 2.9-head idol; in the same two-shot the proportion systems clash.

## What to copy / what to fix

**Copy (the method that works):**
1. **Word-locked events, not beat-locked.** Museum: sheet 78.38 on "von", cloth 79.65 on "Neumann's", stamp 79.90 on "obsolete", spider 80.15 just after. Canyon: turn 82.02 on "turn", landing 83.54 on "you". Gato: grip 84/63/37/0 within 0.14 s of please/don't/let/go, release 0.02 s before "go". This is the film's strongest structural habit.
2. **The nine dancers as the network** (`act3.js:360-381`) — the diagram is the choreography, and the pulse switches faces and halos. A recipe cannot invent that mapping.
3. **The museum's ambient stack** — 75 tubes with per-tube phase, two counter-rotating reels, four smoke puffs, a guide, 48 dust motes — under a real dolly + 7° roll.
4. **The cdr form** — `REVIEWER: (VACANT)`, three X'd boxes, `C. POP`, barcode, `PAPERWORK 100%`. Dense, specific, and legible at native res.
5. **The canyon tumble** — 3.1 rad over the arc, landing sparkles, `PASSENGER STATUS: ALIVE`.
6. **The gato vertical lyric** on a torn strip, and the grip HUD as a diegetic countdown.

**Fix (in order of damage):**
1. **Gato's blocking.** Put GATO at the lip, kneeling, her hand on MIRA's wrist; 0 px gap. Then the grip HUD is a reading of a real hand, not a substitute for one.
2. **Gato's motion.** Four pose changes on the four grip words: shoulder, elbow, knee, and MIRA's swing. 4.73 s of still is the film's biggest single loss.
3. **The chair's legs and occlusion.** Give `miraBack` legs, or show one shoulder + one knee past the backrest; raise the camera or lower the chair so ≥1/3 of the torso reads.
4. **The guide's beret.** Raise it ~16 px (653 → 637) so the brim sits above the eyes at 660; draw the `happy` eyes at ≥6 px at 0.56 scale.
5. **The reveal's easing.** `easeOut`, not `easeIn`; the sheet should move 60% in the first 0.3 s.
6. **The canyon road.** Scroll the road/sign/mesas by the kart's 1040 px, or track the camera; put the sign before x=1260.
7. **The cdr hierarchy.** Kart at ≥350 px or form at ≤380 px; lift the 9 px jokes to ≥18 px.
8. **The HUD safe zone.** Reserve x 1600–1900, y 30–150; nothing authored may enter it (chair poster, mlp `dL/dW`).
9. **The iris grammar.** Match every iris-out with an iris-in, or use none; three iris-outs in six shots is a tic.
10. **The paper pop.** `core.js:143` jumps the texture up to 160 px at 2 Hz; make it ≤8 px at ≥8 Hz, or the still shots will always "boil" instead of move.

## Rules for the test version (numbers, not adjectives)

1. **No still hold over 0.5 s.** In every 0.5 s window, ≥3% of pixels must change by ≥8 luma, and ≥2 of the 9 regions must average >1.0. Gato fails at 4.73 s; chair fails at 0.40 s of 0.66 s.
2. **Two-hand contact ≤40 px.** In any shot where one character holds another, the two hands must be ≤40 px apart at 1080 and both drawn. Each grip step must change a pose by ≥0.25 rad. Gato: 314 px, 0 rad until 94.29.
3. **≥3 independent moving layers, one ≥2% of the frame.** Each layer must move ≥4 px per 0.5 s and cover ≥0.5% of the frame; one must cover ≥2%. Gato: 0 layers at 0.2%; cdr: 1 at 1.2%.
4. **The camera must do what the card says.** "Push" = z change ≥3% over the shot; "pan" = ≥8°/s or ≥1 screen width of translation; "track" = the background must move with the subject. mlp: 0% push. Canyon: 0 px track, 2.6° roll.
5. **A prop may hide ≤1/3 of a character's torso, and ≥1 named limb must read.** The chair hides 100% of the torso and shows 0 legs.
6. **Eyes ≥6 px and uncovered.** A named character must show both eyes in ≥80% of frames; no hat may cross the eye line. The guide shows 0 eyes for the whole shot.
7. **No type over a face for >0.2 s.** `there you are` covers SOL for 0.9 s; the guide's beret covers her eyes for 3.64 s.
8. **No joke text under 18 px at 1080.** The cdr form's 9 px labels and `INCIDENT REPORT` at 13 px fail; the museum placard at 10 px is the floor.
9. **Dead-run budget per shot: ≤15% of frames <1.0 and 0 frames <0.5.** Gato 81% <0.5; chair 61%; cdr 0% <0.5 but 87% <2.0.
10. **Every cut within 1 frame of the score.** Measured: all six within one frame.
11. **One transition grammar per act.** No iris-out without an iris-in; ≤1 iris per 30 s. Segment E has three iris-outs and zero iris-ins.
12. **Paper/grain motion ≤8 px per frame at ≥8 Hz.** `core.js:143` currently jumps up to 160 px at 2 Hz — that is a pop, not a boil.
