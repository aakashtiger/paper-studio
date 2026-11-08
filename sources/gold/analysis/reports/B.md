# Segment B — 22.72–38.50

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames, 156.62 s.
- Primary review at **15 samples/s** (every 2nd frame): `shots-15/act2-chorus1|foom|chinese|shoggoth|eyes|dance1.png`, 8 columns × 12 rows, 320×180 cells. The sheets are sized for the longest shot; chorus1 uses 25 cells, foom 28, chinese 54, shoggoth 56, eyes 32, dance1 46. **At the chorus1 boundary the sheet is one frame ahead of the video**: its first cell is the stage at 22.72, while the video’s frame at 22.72 is still the black iris (the cut lands at 22.733). All cut times below are from the video.
- Cuts read on the **30 fps strips** (`cuts-30/c08…c13`), 6×5 cells, 384×216. **The strips are not centred on the cut** (c08 puts the cut near cell 23, c09 near 11, c10 near 2, c13 near 3), so every cut was fixed from `frame-diff.json` instead: **682, 731, 786, 892, 1001, 1065**. The manifest times are 0–2 frames early: 22.72→22.733, 24.36→24.367, 26.18→26.200, 29.72→29.733, 33.40→33.400, 35.50→35.500. The strips are used only to inspect the frames around the measured cut.
- Frame convention: frame *N* is painted at *t = N/30*; `frame-diff.json`’s `t` is one frame later (`(N+1)/30`). I quote painted times and frame numbers. The diff at t=22.767 is the change into frame 682 (22.733).
- Thresholds: **<0.5** mean |ΔY| on the 192×108 reduction = frozen; **<2.0** = soft. Grain (24 Hz), paper texture (2 Hz), type boil (12 Hz) and the print-mark counter are not meaningful change. Means include the cut frame unless stated; excluding it, the means are chorus1 10.83, foom 6.57, chinese **1.29**, shoggoth 2.37, eyes 2.05, dance1 6.53.
- Code read: `src/scenes/act2.js` (the six scenes, lines 22–379; file 1020 lines), `src/core.js`, `src/type.js`, `src/characters.js` (`idol`, `mira`, `shoggoth`, `doomMeter`), `src/props.js` (`stageSet`, `crowd`, `confetti`, `starfield`), `src/scene_kit.js` (`drawCloud`, `drawEye`, `irisOverlay`), `src/timeline.js`, `src/lyrics.js`.
- Storyboard numbering is offset by 2: manifest #8 chorus1 = storyboard §09; #9 foom = §10; #10 chinese = §11 (26.18–27.90) + §12 (27.90–29.72); #11 shoggoth = §13; #12 eyes = §14; #13 dance1 = §15.
- Native frames extracted to `out/analysis/tmp/` at 22.733, 23.10, 23.50, 23.78, 24.367, 24.90, 25.40, 25.75, 26.200, 26.80, 28.00, 28.60, 29.40, 29.733, 30.60, 31.30, 32.60, 33.400, 34.30, 35.10, 35.50, 36.20, 37.00, 38.467.
- **Sheet vs code.** The 320×180 cells cannot resolve the 12–38 px type (Chinese wallpaper, `GLOBAL RISK`, `SHOGGOTH.exe`, `FORMATION`, `RED THREAD`); every type judgement below was checked at 1920. The sheet’s first 3 chorus1 cells make the crash zoom look like a 3-cell move; it is 0.45 s / 7 cells. The sheet makes the foom petals look grounded because the subtitle band covers their feet; the code has no floor. The sheet’s first 13 chinese cells show the seal as white text; the red plate appears at cell 13 because of an alpha bug. The shoggoth LIES build is a real 0.56 s event that the 192×108 diff underweights. The eyes’ first 3 cells are identical except the counter; the first blink is at cell 13. The dance1 sheet cannot resolve the 48.0 vs 37.4 mismatch; the native frame can.

## Shot table

| # | id | in | out | dur | frames | mean | median | p90 | <2.0 | dead / soft | camera | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | chorus1 | 22.733 | 24.333 | 1.600 | 49 (682–730) | 12.85 | 5.06 | 28.33 | 3/49 | no run; single-frame dips 23.40, 23.80, 24.07 | crash zoom 1.70→1.00 + pan 1370→960 in 0.45 s; z 1.00→1.05 | strong motion, weak first frame |
| 9 | foom | 24.367 | 26.167 | 1.800 | 55 (731–785) | 7.25 | 4.63 | 11.77 | 0/55 | none (min 3.48) | static z=1.02, shake 2→12 after 25.47; no tilt | alive, composition weak |
| 10 | chinese | 26.200 | 29.700 | 3.500 | 106 (786–891) | 2.61 | 0.69 | 1.52 | **99/106** | **45 f <1.0 26.23–27.70**; 98 f <2.0 26.23–29.47 | static 1.02, roll ±0.86°; no dolly | deadest motion |
| 11 | shoggoth | 29.733 | 33.367 | 3.633 | 109 (892–1000) | 2.52 | 1.24 | 6.29 | **78/109** | **43 f <2.0 29.77–31.17**; 23 f 31.97–32.70; 9 frozen | static 1.02; snap 1.02→1.27 at 31.17–31.42 | weakest story |
| 12 | eyes | 33.400 | 35.467 | 2.067 | 64 (1001–1064) | 2.83 | 1.55 | 4.07 | **52/64** | 26 f <2.0 33.43–34.27; 16 f 34.43–34.93 | locked; sunburst rotates 8.6°/s | strong poster, two events |
| 13 | dance1 | 35.500 | 38.467 | 3.000 | 90 (1065–1154) | 7.01 | 6.70 | 9.23 | **0/90** | none (min 2.19) | ±28 px sway, z=1.04, roll ±0.86° | strongest |

Segment total **15.767 s / 473 painted frames**, six hard cuts. No dissolves. The flashes/irises are authored *before* each cut, never across it. The largest cut is foom→chinese **141.4**; the smallest is shoggoth→eyes **19.0** (black-to-black).

## Per-shot anatomy

### 08 · chorus1 · 22.733–24.333 · 1.600 s · 49 frames (682–730)

**Set.** `stageSet` (`props.js:137-168`): 28-ray sunburst at (960,486) r=1300, rot `.1 + t·.04`; giant sun r=436; blue perspective floor; torn proscenium; speaker stacks at x=148/1772; two 1150 px spotlights; 22 crowd; 55 confetti.
**Cast.** SOL at (1340,1008) s1.16, stage outfit, halo, happy eyes, sing mouth; five petals at x=760/870/980/1090/1200, y=956, s.68, flower/jacket pink/blue/gold/green/orange, 13 petals, one T-pose.
**Props.** Doom meter at (1780,1010) s1.0, value `doomAt(t)`; `P(DOOM)` chrome type at (74,448) 248 px; `34%` at (112,620) 154 px after 23.72; `GLOBAL RISK ASSESSMENT / LIVE` 12 px at (86,682); ticker top right.
**Type.** `P(DOOM)` 248 px, chrome cream/redL/red/redD, ink edge 10, shadow 14, per-char build 0.035 s stagger / 0.4 s; `34%` acid 154 px; subtitle 31 px DMMono.
**Camera.** `setCam(lerp(1370,960,seg(lt,0,.55)), 570, kf(lt,[[0,1.7],[.45,1.0],[1.64,1.05]]), 0, lt<.4?7:1, t)` (`act2.js:26`): crash zoom 1.70→1.00 in 0.45 s, pan 1370→960 in 0.55 s, roll 7°→1°, then z 1.00→1.05 over 1.19 s.
**Transition.** In: hard cut from black/iris at frame 682, diff **109.7**. Out: cream flash `seg(lt,1.4,1.64)·0.6` → 24.13–24.33, **last frame 50%** (code max 60% at 24.36), hard cut to foom at 731, diff **43.9** (softened by the shared sunburst).

**CONTINUOUS (every 0.0667 s).**
1. Camera zoom/pan 682–699 (18 frames, 0.60 s), then push 1.00→1.05 700–730. The strongest layer: the first 18 frames are the zoom/pan.
2. Sunburst rotation `t·.04` = **2.29°/s**, 28 rays.
3. 55 confetti, 90–390 px/s fall, ±24 px sway, 1–4 rad/s rotation (`props.js:58-72`).
4. 22 crowd, bob `max(0,sin(beat·π+i·.6))·10` = **0–10 px** at 88 BPM (`props.js:95-119`).
5. Five petals `bounce=-|sin(beat·π+i·.14)|·12` = **0–12 px**, sway 4 px, head tilt .07 (`act2.js:8-18`).
6. SOL `bounce=-|sin(beat·π)|·18` = **0–18 px**, sway 7 px, hairSwing 10, petalDrift .05 (`act2.js:31-41`).
7. Ticker 12.5→34.0 over 682–690 (0.27 s), then 34.0.
8. Type per-char build 682–700; `34%` at 712 (23.733).

**DISCRETE.**
- **682 (22.733)** cut. First frame is a cropped close-up: flower/forehead top is ~140–195 px above the frame at z=1.7; the first petal is 77 px off-frame left; the meter value is ~290 px below frame; the title is at **3.3% alpha** (per-char build).
- **690 (23.000)** meter and ticker reach 34.0.
- **700 (23.333)** title fully built (last char starts 22.93, 0.4 s build).
- **712 (23.733)** `34%` slab appears (`t>23.72`), 0.73 s after the meter reached 34; it lands on the sung “P(doom)” at 23.78.
- **726–730 (24.20–24.33)** cream flash 0→50% (last frame; code max 60% at 24.36).

**Dead / soft.** No run ≥2 frames under 2.0. The three single-frame dips at 23.40, 23.80, 24.07 (1.62–1.9) are grain/type boil. The shot is alive for its 1.6 s. The first frame is a crop, not a dead run.

**3+ independent layers?** Yes: camera + rays + confetti + crowd + five petals + SOL + type. After 23.3 there are still six.

**Authored detail a recipe would miss.** The five flower/jacket colours; the doom meter’s face and gauge; the acid `34%` slab; the sun’s 22 px halftone; the torn proscenium; the speaker stacks; the crowd’s phone lights; the `GLOBAL RISK ASSESSMENT / LIVE` microcopy; the chrome type’s four-stop gradient.

**Flaws.**
1. **First frame is a bad crop.** At z=1.7 the flower top is ~195 px above frame, the first petal is 77 px off left, and the meter value is off-screen. `z=1.7` is neither an eye macro nor a full figure; z≤1.25 is needed to fit the flower (`characters.js:133-146`). The storyboard says “crash zoom from SOL’s eye”; the code starts on her torso.
2. **No bicycle pump.** The storyboard’s pump action is absent; the meter rises by `doomAt` interpolation 12→34 in 0.27 s (`lyrics.js:71-73`), then holds. `act2.js:31-43` has no pump prop or arm pump.
3. **Five petals are clones.** One arm pose `[-.85,-.25]/[.85,.25]`, one head tilt, one face; only flower/jacket colour differs (`act2.js:13-16`). At 23.5 their white sleeves and batons overlap into a frieze.
4. **`GLOBAL RISK ASSESSMENT / LIVE` is illegible.** 12 px cream at (86,682) over cream sleeves and an orange sun; <2:1, and the petals’ arms cross it. Visible in the native frame as “GL… RISK ASSESSMENT / LIVE”.
5. **The meter’s value is off-screen at the cut** (camera y=570, z=1.7: y=1058 → 1370). The gauge is visible; the number is not until the zoom settles.
6. **Type size is 248 px, not the storyboard’s 320 px** (−22.5%). It still fits, but the title is less monumental than specified.
7. **The subtitle band covers the petals’ feet.** Band is y=948–1010 (`type.js:189-196`); the petals’ base at y=956 maps to 938 at z=1.03, and the boot sole sits at y≈960–973, so the feet are behind the band.
8. **Shadow/sole contact.** `idol` draws the shadow at `(0,0)` inside the `y+bounce` translate (`characters.js:394-395`), so the shadow rises 12–18 px with the bounce; the boot sole is 17 px below the shadow plane. The contact is soft in every bouncing shot.
9. **The type boil is doing some of the “alive” work.** `TY.type` jitters every 1/12 s (`type.js:48`); at 192×108 it reads as motion. The camera/confetti/crowd are the real layers.

### 09 · foom · 24.367–26.167 · 1.800 s · 55 frames (731–785)

**Set.** `kitBg('#F8D07E','#E15834')`; sunburst (700,880) r=1400, 32 rays, rot `t·.1`, α .5; four clouds at x=150+i·540, y=760/800, s1.5, cream .5; 36 speed streaks; three shock rings at (610,820); nine exhaust circles; six smoke arcs.
**Cast.** SOL on the rocket at (rx,ry), s.62, arms V, star eyes, grin; five petals at x=200+i·132, y=990, s.58, lean −.22, T-pose.
**Props.** Rocket at (rx,ry) s1.28, fire `.8+u·.7`, `AGI` label; 15-blob explosion + 5 arcs at (960,540); `FOOM` 376 px at (960,536); seven paper flowers after 25.70.
**Type.** `FOOM` 376 px red/cream edge 20, shadow 20, per-char 0.04 s stagger / 0.3 s; subtitle 31 px; `AGI` 17 px on the rocket.
**Camera.** `setCam(960,560,1.02,0,lt>1.1?12:2,t)` (`act2.js:73`): static, shake 2→12 after 25.47. No tilt, no track.
**Transition.** In: hard cut from chorus1 flash, diff **43.9**. Out: cream flash `seg(lt,1.55,1.82)` → 25.92–26.17, **last frame 93%** (code max 100% at 26.187), hard cut to chinese at 786, diff **141.4** (largest in the segment).

**CONTINUOUS.**
1. Rocket path: `rx=610+210·easeOut(u)+sin(lt·3.4)·66·launch`, `ry=830−640·easeIn(launch)`; **x 610→820 (peak) →771, y 830→190 over 1.6 s** (`act2.js:68-72`); rotation `−.52+sin(u·9)·.14`.
2. Nine exhaust circles, 34–115 px radius, `tr=(launch−i·.045)·2.4` (`act2.js:97-101`).
3. Five petals `bounce=-|sin(bp·π)|·8` = 0–8 px, lean −.22, arms T (`act2.js:84-95`).
4. 36 speed streaks, 500–1800 px/s (`scene_kit.js:121-130`).
5. Three shock rings, r=120+i·170+u·350, α .28−i·.06 (`act2.js:76-80`).
6. Six smoke arcs, `a=i/6·TAU+t`, r=50+i·12 (`act2.js:113-118`).
7. Camera shake 12 after 25.47.
8. Explosion 15 blobs, `eu=seg(lt,1.26,1.62)` (`act2.js:121-141`).
9. `FOOM` per-char 25.70–26.12 (0.3 s build + 0.04 s stagger); seven flowers after 25.70.

**DISCRETE.**
- **731 (24.367)** cut; first frame: rocket at (610,830), petals at left, clouds right, no `FOOM` title.
- **745 (24.833)** launch starts (`launch=seg(lt,.45,1.6)`).
- **764 (25.467)** camera shake 2→12.
- **769 (25.633)** explosion starts (`lt>1.26`).
- **771 (25.700)** `FOOM` starts; seven flowers.
- **774 (25.800)** F 33%, O1 20%, O2 7%, M 0 — the word is not readable.
- **780 (26.000)** F 100%, O1 87%, O2 73%, M 60%; cream flash 31%.
- **783 (26.100)** M 93%; cream flash 68%; the word is washed out.
- **784 (26.133)** last char full; **785 (26.167)** cut. The title is fully built for **1.4 frames**, at 80–93% cream flash.

**Dead / soft.** None: **0/55 <2.0**, min 3.48, mean 7.25, median 4.63. The shot is continuously moving; the problem is composition, not motion.

**3+ independent layers?** Yes, nine: rocket + exhaust + petals + streaks + rings + smoke + explosion + type + shake.

**Authored detail a recipe would miss.** The rocket’s `AGI` label, blue porthole, red nose and fins; the five petal colours; the three shock rings; the nine-circle exhaust; the six smoke arcs; the 15-blob explosion; the seven paper flowers; the `FOOM` per-char slam.

**Flaws.**
1. **Floating cast.** The stage floor, crowd, speakers and proscenium are gone, but the five petals stay at y=990 with no ground. The subtitle band (y=948–1010) covers their feet at y≈978. They read as a chorus line standing in mid-air behind the lyric bar (`act2.js:84-95`; `timeline.js:60`). The storyboard says “Petals blown back in a wave”; lean −.22 is only 12.6°, x fixed.
2. **Rocket/SOL attach is wrong.** SOL is translated to the rocket’s local `(0,50)`, inside the 192 px body, then counter-rotated `+0.7·rot` (`act2.js:102-111`). The rocket tilts −23°; SOL is rotated +16°, a **39–51° mismatch**. Her feet are inside the rocket, her body covers its upper half; she reads as standing on/behind the rocket, not riding it.
3. **Explosion is offset and reads as balloons.** At 25.62 the rocket is at ~(776,612); the blast centre is (960,540) — **184 px right, 72 px up** (`act2.js:128`). At 25.76 the rocket is ~(765,470), the blast ~195 px right, 70 px down. The 15 blobs are flat circles with seven daisies on them; at 26.0 they read as a bunch of balloons, not “layered paper curlicues.”
4. **The clouds have faces.** `drawCloud` defaults to `face:true` (`scene_kit.js:182-186`); four smiling clouds read as characters, not explosion curlicues. The storyboard says “explosion cloud made of layered paper curlicues.”
5. **`FOOM` is built too late and washed out.** The type starts at 25.70, but the 0.3 s per-char build + 0.04 s stagger means the M is still 60% at 26.0 and the last char is not full until **26.12**; the cream flash starts at 25.92 and is 68% at 26.1. The word is fully built for **1.4 frames**, at 80–93% flash, so it never holds at full contrast. The storyboard’s payoff is undercut. Fix: start the build at 25.52 or shorten it to 0.18 s, and delay the flash to 26.05.
6. **No tilt/track.** The rocket rises 640 px while the camera stays at y=560; by 26.0 the rocket’s nose is at y≈5 (top edge, mostly cut) while the blast stays at centre. The storyboard promises “tilt up, tracking.”
7. **The five petals’ arms are still T-pose.** Their small hands and white sleeves read as batons; they do not react to the launch.
8. **The rocket’s `AGI` label is 17 px × 1.28 = 22 px**; it is readable only in the native frame, lost in the 15 fps sheet.

### 10 · chinese · 26.200–29.700 · 3.500 s · 106 frames (786–891)

**Set.** `kitBg('#090819','#170C2C')`; 150 stars, maxY 840; 12 gold score lines at α .18; torn room 1040×610 at (960,528+float), fill `#F0E0C4`, ink edge 5, shadow 14/20; interior `#D9B98C`; 16 Chinese glyphs in a 6×12 grid, 38 px, α .38; two shelves, seven books, `RULES` card 260×148, five rule lines; `IN`/`OUT` slots; floor `#8C5A35`.
**Cast.** SOL at (−260,268) s.62, swirl eyes, flat mouth, arm shove `sin(t·9)·.25`; MIRA at (210,262) s.54, wide eyes, wobble mouth, arm .7/−.3. **No desk.**
**Props.** 20 paper slips 36×16, `x=-420+frac(t·.35+hash)·840`, `y=-40+sin(a)·120`; eight mushrooms at x=−430+i·118, y=300+sin(t·2.4+i)·22; six melt ellipses 140×220 at y=−120, α `sh·.55`; `SHROOMS` 226 px at (960,780); `with a bag of` 24 px at (960,700); red seal 260×84 at (1520,190), rot .12.
**Type.** `CHINESE ROOM` 28 px cream on red; `SHROOMS` 226 px pink/cream edge 14; `with a bag of` 24 px Instrument Serif cream; Chinese wallpaper 38 px; subtitle 31 px.
**Camera.** `setCam(960,520,1.02,sin(t·.35)·.015,0,t)` (`act2.js:172`): **static**, roll ±0.86°. No dolly, no top-down.
**Transition.** In: hard cut from foom flash, diff **141.4**. Out: iris `seg(lt,3.2,3.54)` r=1200→72 at (960,520) → 29.40–29.70 (code min 40 at 29.74); hard cut to shoggoth at 892, diff **19.0** (black-to-black).

**CONTINUOUS.**
1. 150 stars twinkle 0.7–2.3 Hz, maxY 840 (`props.js:83-93`).
2. Room float `sin(t·.7)·8` = **±8 px**, rotate `sin(t·.29)·.025` = **±1.43°** (`act2.js:171-174`).
3. 20 slips: x 294 px/s, y ±120 px, rotate `a` (`act2.js:209-214`).
4. SOL arm shove `sin(t·9)·.25` = **±0.25 rad** at 1.43 Hz; sway 4 px (`act2.js:203-207`).
5. MIRA arm .7/−.3, head tilt .05, face wobble (`act2.js:201`).
6. Melt six ellipses, α `sh·.55`, `y=-120+sin(t·2+i)·90` (`act2.js:216-223`).
7. Eight mushrooms bounce `sin(t·2.4+i)·22`, rot `sin(t+i)·.2` (`act2.js:224-227`).
8. `SHROOMS` per-char build 28.05–28.70.
9. Iris 29.40–29.70.

**DISCRETE.**
- **786 (26.200)** cut; first frame; seal text full, red plate **0% alpha**.
- **795 (26.500)** red plate starts (`lt=.3`); **810 (27.000)** plate full (`lt=.8`).
- **833 (27.767)** melt starts (`sh=seg(lt,1.55,2.2)`); mushrooms appear.
- **839 (27.967)** `with a bag of` starts; **846 (28.200)** full.
- **842 (28.067)** `SHROOMS` first char starts (`t>28.05`).
- **861 (28.700)** `SHROOMS` full (last char 28.40 + 0.30).
- **882 (29.400)** iris starts; **891 (29.700)** r≈72, cut (code min 40 at 29.74).

**Dead / soft.** **45 frames <1.0 at 26.23–27.70 (1.50 s)** and **98 frames <2.0 at 26.23–29.47 (3.27 s)** — the whole shot except the iris. The 45-frame run is carried by starfield twinkle, ±8 px room float, 20 slips and SOL’s ±0.25 rad arm; no character action. The 98-frame run includes the `SHROOMS` reveal, but the 192×108 mean stays low because the type is ~25% of the frame and the rest is static. **This is the deadest shot in the segment.**

**3+ independent layers?** Technically seven (stars, float, slips, arms, melt, mushrooms, type), but the float is ±8 px, the slips are 36×16, the melt is low-contrast, and the camera is static; the 192×108 mean stays <2.0 for 98/106 frames. It fails the spirit of the rule.

**Authored detail a recipe would miss.** The 16-glyph wallpaper; the `RULES` card; `IN`/`OUT` slots; 20 slips with ink edges; the torn room edge and shadow; the red seal; eight mushrooms with different caps; the `with a bag of` serif line; the gold score lines; the starfield.

**Flaws.**
1. **Static camera.** 3.5 s at z=1.02, roll ±0.86°; the storyboard’s dolly through the roof / top-down is absent. 45 frames <1.0, 98 <2.0. Fix: z 1.02→1.18 over 3.5 s or a 40 px push; a 0.5 s top-down at the end.
2. **No desk.** MIRA stands in the open (`act2.js:201`); the storyboard’s “trapped behind a tiny desk” is not staged. The “trapped” idea is only the floating room.
3. **The `RULES` card is 260×148**, not a giant rulebook; it is blank except five lines. Fix: 420×260 with rules text.
4. **Mushrooms grow outside the room.** At y=300 their caps sit on the floor line (y≈292) and their stems hang to y≈346, **46 px below the room’s bottom edge** (`act2.js:224-227`). They read as growing off the card into the starfield.
5. **`with a bag of` is inside `SHROOMS` and illegible.** At (960,700) it sits inside the 226 px word (baseline 780, top 554); cream on cream/tan is <2:1. Fix: y=520, cream on an ink card.
6. **The seal’s text and plate use different alpha.** `TY.text` sets `globalAlpha=1` (`type.js:107`), while the red rect uses `seg(lt,.3,.8)` (`act2.js:234`). For **0.78 s** the label is white on the starfield without its red stamp. Fix: pass the same alpha to `TY.text`.
7. **The seal straddles the room’s right edge** (x=1390–1650 vs room edge 1480); it reads as a floating label, not a stamp on the room. Fix: x=1380 or put it on the room.
8. **The melt is six translucent ellipses**, not “walls drip into petals”; no drips, no swirl, no fisheye. The storyboard’s §12 action is largely absent.
9. **The slips are 36×16 at 294 px/s**; they cross faces and the `RULES` card. At 26.8 a slip covers SOL’s face.
10. **The iris is a radial darkening**, not a circular iris: at 29.4 the corners darken while the room is still visible; the last frame is a ~72 px dot (the code’s 40 px min is at 29.74, after the cut). It works as a fade-to-black, not as an iris.

### 11 · shoggoth · 29.733–33.367 · 3.633 s · 109 frames (892–1000)

**Set.** `#080706`; eight red curtain ellipses 180×70 at y=80/120, α .16; shoggoth at (960,880) s1.65; mask at (960,430) s2.15; 12 sparkles at (960,700) maxR 420; 4×3 `LIES` grid; labels.
**Cast.** Shoggoth body 95×80, nine tentacles, **11** acid eyes; gold smiley mask 90×84 on an 8 px stick; SOL at (1430,1006) s.9, narrow eyes, grin, arm 1.45→.55.
**Props.** `LIES` 62 px ×12 at x=104+c·168, y=132+r·92; red X 6 px; `SHOGGOTH.exe` 15 px; `AN ACTUAL SMILE` 12 px; `MASK OFF` sticker 26 px at (1430,780).
**Type.** `LIES` 62 px cream/ink edge 4; `SHOGGOTH.exe` 15 px acid + red offset; `AN ACTUAL SMILE` 12 px cream .5; `MASK OFF` 26 px acid; subtitle 31 px.
**Camera.** `setCam(960,520,1.02+snap·.25,0,snap>0&&snap<1?10:1,t)` (`act2.js:256`): **static 29.73–31.17**, snap zoom 1.02→1.27 at 31.17–31.42, shake 10. No slow push.
**Transition.** In: hard cut from black iris, diff **19.0**. Out: iris `seg(lt,3.0,3.4)` r=1200→50 at (1430,520) → 32.73–33.13; hard cut to eyes at 1001, diff **51.7**.

**CONTINUOUS.**
1. Nine tentacles, `sin(t·2+i)·.08` rad, len 90–150, width 22−i px (`characters.js:799-807`).
2. Mask bob `sin(t·1.3)·.12` rad = **±6.9°** (`act2.js:266`).
3. 12 sparkles, `a=hash+t·.3`, `r=hash·420·(.7+.3·sin(t·2.2+i))` (`scene_kit.js:146-156`).
4. SOL sway 3 px, arm 1.45→.55 (`act2.js:276-279`).
5. Ticker 34.2→36.3.
6. `LIES` build 29.73–30.29 (12 words over 0.56 s).
7. Snap zoom 31.17–31.42.
8. Mask slide 31.40–31.93.
9. Iris 32.73–33.13.

**DISCRETE.**
- **892 (29.733)** cut; first frame: **one** `LIES`, mask at (960,430), SOL right.
- **897 (29.875)** second `LIES`; **900 (30.000)** five; **909 (30.300)** all 12.
- **939 (31.300)** `MASK OFF` sticker appears (`lt>1.55`).
- **936–943 (31.200–31.433)** snap zoom 1.02→1.27.
- **942–958 (31.400–31.933)** mask slides to (1320,620), rotates .55.
- **982 (32.733)** iris starts; **988 (33.133)** r=50.

**Dead / soft.** **43 frames <2.0 at 29.77–31.17 (1.43 s)** and **23 frames at 31.97–32.70 (0.73 s)**; 9 frozen (8-frame iris run 33.13–33.37 + 1 isolated). The 43-frame run includes the `LIES` build (29.73–30.29), but the 62 px words are too small to lift the 192×108 mean; the true near-hold is **30.30–31.17 (0.87 s)**. The 23-frame run is the mask-over-SOL hold. **This is the weakest shot in the segment: the key reveal is a dark near-hold.**

**3+ independent layers?** Before 31.17: tentacles + mask bob + sparkles + SOL sway + ticker = five, but all are ≤6.9° or 3 px, and the mean stays <2.0. After 31.37: mask slide + zoom + arm + tentacles + sparkles = five.

**Authored detail a recipe would miss.** The 12 `LIES` with red Xs; the glitch-duplicated `SHOGGOTH.exe` (acid + red offset 4 px); `AN ACTUAL SMILE`; the mask’s paper edge/shadow; the 11 acid eyes with pupils; the red curtain scraps; the sparkles; the `MASK OFF` sticker.

**Flaws.**
1. **The mask covers SOL instead of being yanked.** At 31.93 the mask is at (1320,620); SOL’s right hand is at ~(1535,709), **232 px away** (at 32.0 it is ~380 px). The stick is still attached and runs to y≈1136 (`act2.js:265-274`). The `MASK OFF` sticker is on SOL’s waist (`act2.js:299`), 0.1 s before the mask moves. It reads as the mask sliding onto her, not her pulling it off.
2. **The shoggoth is black on black.** Body `#1B171E` on `#080706` (≈**1.2:1**), edge `#0C0A09`; only the 11 acid eyes read (`characters.js:808`). The storyboard says 12 eyes; the code has **11** (`i<11`). The tentacles are 22 px strokes with a 12% white highlight, barely visible.
3. **Near-holds.** 43 frames <2.0 at 29.77–31.17 (1.43 s), 23 frames at 31.97–32.70 (0.73 s); no slow push. The storyboard says “slow push; snap zoom on the reveal.” Only the snap exists.
4. **`LIES` is 3×4=12, not 5×3=15**, and covers x=104–576 (≈25% of width), top-left only (`act2.js:286-295`). The storyboard says “LIES repeated in a 5×3 grid” across the frame.
5. **The mask is 386 px and hides the shoggoth’s top.** It reads as a lollipop in front of a black lump, not a mask on a monster. The mask’s stick is a plain brown line into the body.
6. **The red curtain scraps are eight dark ellipses** at y=80/120, α .16; they read as a garland, not a curtain. They add noise behind the first `LIES` row.
7. **The first frame has one `LIES`.** The grid builds over 0.56 s; the first 4 frames are a single word, and the grid is complete only at 30.30. It is a weak opening for the reveal.
8. **The snap zoom crops SOL’s feet.** At z=1.27, camera y=520, SOL base 1006 → screen 1157, off-frame. The “yank” is a full-body action; the crop cuts her legs.
9. **`MASK OFF` pre-empts the action.** It appears at 31.30; the mask starts moving at 31.40. The label says the action before it happens.
10. **The shoggoth has 9 tentacles and 11 eyes**; the storyboard’s “12 eyes and ribbon tentacles” is met only in the tentacle idea, not the count. The tentacles are 22 px strokes with a 12% white highlight, barely visible on `#080706`.

### 12 · eyes · 33.400–35.467 · 2.067 s · 64 frames (1001–1064)

**Set.** `#0A0607`; sunburst (960,460) r=1100, 28 rays, `redD`/`#3A0A0A`, α .25, rot `t·.15`; 44 speed lines at (960,470) r=280–820, red .26; apple at (1510, `kf(.6,−100,1.7,1100)`) r44; two eyes at (720,430)/(1220,430) s2.45, iris `redD`, kanji 死; red thread; MIRA at (960,1020) s.64; type.
**Cast.** Two eyes (left blink .88–1.0, right 1.55–1.7); MIRA wide eyes, o mouth, arm .9/−.5; apple.
**Props.** Apple r44, stem 5 px, leaf 16×7; red thread 5 px from (0,650) to (1920,620); cream tag 40×20 at (960,650); `LIFESPAN` card 380×88 at (1430,860); `EYES` 196 px at (100,900); `SHINIGAMI` 72 px vertical at (1600,250), step 76; `RED THREAD / SEVERED` 13 px at (92,116).
**Type.** `EYES` 196 px cream/red edge 10; `SHINIGAMI` 72 px red/cream edge 4; `LIFESPAN` 13/43 px; `RED THREAD` 13 px cream .5; subtitle 31 px.
**Camera.** **None**; screen-space composition. The sunburst rotates `t·.15` = 8.6°/s; the eyes do not rotate. The storyboard’s “macro, slow rotate” is only the background.
**Transition.** In: hard cut from black, diff **51.7**. Out: red flash `seg(lt,1.85,2.1)·0.75` → 35.25–35.47, **last frame 65%** (code max 75% at 35.50), hard cut to dance1 at 1065, diff **50.0**.

**CONTINUOUS.**
1. Sunburst 28 rays, rot `t·.15` = 8.6°/s.
2. 44 speed lines, `a=hash·TAU+t·(hash−.5)·.6`, `rr=280+frac(hash+t·(.2+hash·.5))·540` (`core.js:178-189`).
3. Apple fall 34.00–35.10, y=−100→1100, rot `lt·2` (`act2.js:312-316`).
4. Left blink 34.28–34.40; right blink 34.95–35.10.
5. Lifespan 7→3, tick every 0.5 s (`act2.js:329`).
6. MIRA arm .9/−.5, head tilt .06, hair `sin(t·1.8+i)·8`.
7. Red thread static.
8. Type boil at 12 Hz.

**DISCRETE.**
- **1001 (33.400)** cut; first eyes frame; lifespan 7.
- **1028 (34.267)** left eye closes (4 frames, 34.28–34.40); lifespan 6.
- **1043 (34.767)** lifespan 5.
- **1048 (34.933)** right eye closes (5 frames, 34.95–35.10).
- **1051–1053 (35.033–35.100)** apple exits.
- **1058 (35.267)** red flash starts; **1064 (35.467)** 65% red (code max 75% at 35.50).

**Dead / soft.** **26 frames <2.0 at 33.43–34.27 (0.87 s)**, **16 frames at 34.43–34.93 (0.53 s)**, 4 frames at 35.13–35.23; **52/64 <2.0**. The first 0.87 s is a held poster; the only change is the sunburst/speed lines (sub-threshold) and the counter (13 px text). The apple enters at 34.0 but is an 88 px disc at x=1510, outside the right eye; it does not lift the mean until it is large. The blink is the first big change.

**3+ independent layers?** Yes (sunburst, speed lines, apple, blink, counter, MIRA), but the amplitudes are small; it is a poster with two events. The 15 fps sheet’s first three cells are identical except the counter.

**Authored detail a recipe would miss.** The 死 kanji in each iris; the two-eye symmetry; the `EYES` slab; the vertical `SHINIGAMI`; the `LIFESPAN` card’s torn edge and red edge; the red thread with cream tag; the apple stem/leaf; MIRA tiny at centre; the red/orange palette.

**Flaws.**
1. **The thread never snaps.** One continuous path from x=0 to 1920 (`act2.js:322`); the cream tag at (960,650) is a label, not a gap. `RED THREAD / SEVERED` is a lie. No frame has a break.
2. **The lifespan counter runs 7→3 over 2.1 s** (2 ticks/s) and stops at 3 when the shot cuts (`act2.js:329`); it never reaches 00:00:00. The storyboard’s `00:00:07` implies a countdown; the payoff is missing.
3. **The blink is a binary wink.** `drawEye` scales y by `1−blink·.95` (`scene_kit.js:417`); the left eye is a 5% sliver for 4 frames at 34.28, the right for 5 frames at 34.95. The two never blink together; it reads as two winks, not a blink.
4. **`SHINIGAMI` collides with the `LIFESPAN` card.** Vertical type at x=1600, step 76, nine letters → bottom “I” baseline at y≈858; card x=1240–1620, y=816–904. The bottom “I” overlaps the card’s top-right corner by ~20 px horizontally and ~42 px vertically (`act2.js:327-334`).
5. **The thread is low contrast.** `#E8452A` on `#B92A16`/`#3A0A0A` is ≈1.6–2.9:1; it is a faint line. The `RED THREAD / SEVERED` 13 px cream .5 label is <3:1. Fix: cream/gold thread with a 2 px edge; 14 px label on an ink card.
6. **The apple is isolated.** It falls at x=1510, outside the right eye (centre 1220, radius ~200); it never crosses the eye or the thread. It reads as a red ball, not a death-note apple.
7. **No camera.** The eyes are locked; the storyboard’s “macro, slow rotate” is only the sunburst. Fix: rotate the pair ±2° or scale 1.00→1.06 over 2.1 s.
8. **The first 0.87 s is a held poster.** The 15 fps sheet’s first three cells are identical except the counter. Fix: start the apple at 33.4 or add a slow push.

### 13 · dance1 · 35.500–38.467 · 3.000 s · 90 frames (1065–1154)

**Set.** `stageSet` with `rayA:'#D94728'`, `rayB:'#F5B93F'`, floor blue, rot −.2, 80 confetti, crowd; `P(DOOM)` backdrop 248 px at (960,340), α .55; five petals on ellipse r=330, y=900+sin(a)·54, s.63; SOL at (960,1002) s1.1; meter at (1790,1012) s1.0, **v=48**; `DANCE BREAK` sticker 28 px at (120,860); `FORMATION: FLOWER / 6` 12 px at (92,944).
**Cast.** SOL star eyes, sing mouth, bounce 24 px, sway 8 px, hairSwing 12; five petals bounce 16 px, sway 9 px, arms alternating up/out, flower colours.
**Props.** Meter 88×420 with a face, `48.0%`; 80 confetti; 22 crowd; two speaker stacks; backdrop type; sticker with barcode.
**Type.** `P(DOOM)` 248 px `redD`/cream edge 9 at 55% alpha; `DANCE BREAK` 28 px acid; `FORMATION` 12 px ink .55; meter `P(DOOM)` 17 px / `48.0%` 22 px; ticker 37.4→39.2.
**Camera.** `setCam(960+sin(lt·1.3)·28, 540, 1.04, sin(lt·.7)·.015, 3, t)` (`act2.js:344-345`): **±28 px sway** (period 4.83 s), roll ±0.86°, z=1.04. No 360 orbit, no low angle, no crash zooms.
**Transition.** In: hard cut from eyes red flash, diff **50.0**. Out: cream flash `seg(lt,2.9,3.2)·0.5` → 38.40–38.47, **last frame 11%** (code max 50% at 38.53), hard cut to gym at 1155 (38.50).

**CONTINUOUS.**
1. Camera sway ±28 px, period 4.83 s; roll ±0.86°.
2. Sunburst rotation `t·.04` = 2.29°/s.
3. 80 confetti, 90–390 px/s, ±24 px sway, 1–4 rad/s.
4. 22 crowd, bob 0–10 px at 88 BPM.
5. Five petals orbit `a=i/5·TAU+t·.9·.35`, x=960+cos(a)·330, y=900+sin(a)·54; bounce 16 px, sway 9 px, arms alternating.
6. SOL bounce 24 px, sway 8 px, hairSwing 12.
7. Ticker 37.4→39.2.
8. Meter static 48.0.
9. Backdrop type static.

**DISCRETE.**
- **1065 (35.500)** cut; first frame; meter 48.0, ticker 37.4.
- **1154 (38.467)** last frame; cream flash **11%** (code max 50% at 38.53).
- No other discrete events; the shot is a continuous loop.

**Dead / soft.** **None: 0/90 <2.0**, min 2.19, mean 7.01, median 6.70. The most continuously alive shot in the segment. The motion is concentrated in the cast: the 3×3 map is centre 12.6 / bottom-centre 10.1 vs sides 3.5–6.8.

**3+ independent layers?** Yes, seven: camera + rays + confetti + crowd + five petals + SOL + ticker.

**Authored detail a recipe would miss.** The `P(DOOM)` backdrop at 55%; the `DANCE BREAK` sticker with barcode; the `FORMATION` label; the giant meter with a face; the speaker stacks; the crowd’s light sticks; the confetti; the five flower colours; SOL’s star eyes; the torn proscenium.

**Flaws.**
1. **Two P(DOOM) numbers.** The meter reads **48.0% for 90/90 frames**; the ticker reads **37.4→39.2%**. `act2.js:373` hardcodes 48; `timeline.js:74-92` uses `doomAt(t)`. The storyboard says the meter rises 34→48; it jumps at the cut and stays. Fix: meter=`doomAt(t)`, animate 34→48 over 3.0 s, ticker matches ±0.1.
2. **Formation overlap.** At 36.2 the left pair is at x=640/683 (**43 px apart**) with ~130 px-wide bodies; faces overlap. The orbit r=330 with five bodies needs ≥150 px spacing; the projected spacing varies. Fix: fixed V with 150 px spacing or depth stagger.
3. **`DANCE BREAK` is at the left edge.** `TY.sticker` centres at x=120; width ~206 → left edge x≈17, inside the frame but **outside a 40 px safe margin** (`type.js:123-124`; `act2.js:375`). At 320×180 it reads as clipped.
4. **`FORMATION: FLOWER / 6` is illegible.** 12 px ink .55 on blue `#203FD8` is ≈1.5:1 (`act2.js:376`). Fix: 14 px cream on an ink card.
5. **No 360 orbit / low angle / crash zooms.** Camera is ±28 px sway, z=1.04 (`act2.js:344-345`); the storyboard promises an orbit. Fix: ±60 px orbit or a 1.04→1.08 push.
6. **The five petals are clones.** Same face/body; only flower/jacket colour and two arm poses. At 36.2 the left pair overlaps; at 37.0 the V reads. Fix: three poses, two head tilts, 150 px spacing.
7. **The backdrop type is low contrast.** `redD` at 55% on orange/gold; the cream edge 9 px helps, but the “OO” behind SOL is muddy. Fix: 70% alpha or a darker red.
8. **The crowd hides the stage lip.** 22 silhouettes at y=1052 form a solid band y≈996–1080; SOL’s feet are at y=1002, inside it, while the five petals’ feet are at y=846–954, above it. SOL’s contact is hidden; the stage floor is a strip.
9. **The meter’s `48.0%` sits at y=1058**, 22 px above the frame bottom, on the crowd line; it is legible only at native resolution.
10. **The `DANCE BREAK` label is static while the stage moves.** It is screen-space, so it does not sway with the camera; it reads as a sticker on the lens, not on the stage.
11. **The out-flash is only 11% at the cut.** The code ramps `seg(lt,2.9,3.2)·0.5` to 50% at 38.53, but the shot ends at 38.467 (lt=2.967), where the flash is 11%. The storyboard’s “paper fold → gym” is a near-hard cut, not a 50% flash.

## What to copy / what to fix

### Copy
1. **Dance1’s full-stage kit.** Centred star, five-colour chorus, giant backdrop type, physical meter, crowd, confetti, speaker stacks, torn proscenium. It fills the frame and has seven layers; 90/90 frames >2.0.
2. **Chorus1’s 0.45 s crash zoom + 0.55 s pan and the 34% slab on the sung “P(doom)”** (23.72 vs 23.78). The number lands on the word. Copy the timing, not the crop.
3. **Foom’s `FOOM` type — the idea, not the build.** 376 px, 20 px cream edge, per-char 0.04 s stagger; the strongest type idea in the segment. But the 0.3 s build makes the M 60% at 26.0 and full only at 26.12, and the flash starts at 25.92. Copy the size/edge and the on-word timing; use a 0.18 s build and delay the flash to 26.05.
4. **Eyes’ graphic composition.** Two eyes + 死 + `EYES` slab + vertical `SHINIGAMI` + `LIFESPAN` card + red thread; it fills the frame and reads as a graphic at 320×180 (the type needs native). Copy “one graphic idea, four type blocks.”
5. **Chinese room’s paper texture.** 16 glyphs, `RULES` card, `IN`/`OUT` slots, 20 slips, torn edge/shadow, starfield/score lines. Copy the diorama detail, not the static camera.
6. **Shoggoth’s `LIES` grid with red Xs.** A strong graphic block. Copy “the word repeated and crossed out,” but 5×3 and across the frame.
7. **The cut grammar.** Hard cuts on the beat, flashes/irises before the cut, no dissolves; the foom→chinese cut (141.4) is the strongest. Copy the bright→dark cut and the iris.

### Fix
1. **Shoggoth (weakest).** Hand contact, body contrast, 12 eyes, slow push, `LIES` 5×3, mask size/position, remove stick. This shot fails its story beat.
2. **Chinese (deadest).** Camera move, desk, rulebook, mushrooms inside, small line above `SHROOMS`, seal alpha/position, melt drips.
3. **Dance1 (strongest, but two numbers).** One P(DOOM) source, meter 34→48, formation spacing, sticker margin, `FORMATION` legibility, orbit.
4. **Foom.** Floating petals, rider attach, explosion centre, cloud faces, tilt/track, first-frame composition.
5. **Eyes.** Thread snap, counter to 0, blink ramp, `SHINIGAMI`/card collision, thread contrast, apple interaction.
6. **Chorus1.** First-frame crop, pump action, petal variety, microcopy contrast, meter value in frame, type size 320.
7. **Global.** Subtitle/picture cut sync, shadow/sole contact, strip centring, native-resolution type checks.

## Rules for the test version (numbers, not adjectives)

1. **Motion floor.** No shot may contain **≥12 consecutive frames (0.40 s)** with mean |ΔY| < 2.0 on the 192×108 reduction. Fail: chinese **98 f** (45 f <1.0), shoggoth 43 f + 23 f, eyes 26 f + 16 f. Pass: chorus1, foom, dance1.
2. **Layer count.** Every shot must have **≥3 independent layers with amplitude ≥4 px or ≥2% scale**, and at least one layer must move **≥20 px or ≥4%** over the shot. Fail: chinese (five layers, all <2.0 for 98/106), eyes (four layers, 52/64 <2.0). Pass: chorus1 (zoom 700 px), foom (rocket 640 px), dance1 (orbit 56 px + confetti). Shoggoth has five layers but fails the contrast/readability rule below.
3. **Hold cap.** A held title or last frame may not exceed **0.50 s** without a new event. **A title must reach 100% at least 0.25 s before the shot ends or the flash begins.** Fail: chinese `SHROOMS` 28.7–29.4 (0.7 s), shoggoth mask hold 31.97–32.70 (0.73 s), eyes first 0.87 s, **foom full at 26.12 / cut 26.167 (0.05 s) and flash from 25.92**.
4. **Camera floor.** A camera must move **≥20 px or ≥4% scale** over the shot, or the shot must have **≥5 layers with ≥10 px amplitude**. Fail: chinese (0 px/0%), shoggoth (0 until 31.17), eyes (0). Pass: chorus1, dance1.
5. **Crash-zoom start.** Start on a complete head or an eye macro: head top **≥20 px inside** the frame, or z≥3.0 on the eye. Fail: chorus1 (flower top ~195 px above frame at z=1.7).
6. **Contact.** A staged character’s sole must be **within 2 px** of its shadow plane; the shadow must not translate with bounce. Fail: `idol` sole +17 px, shadow at `y+bounce` (`characters.js:394-395`).
7. **Held prop.** Hand-to-prop centre **≤10 px for ≥6 frames**; the support stick must be gone after the yank. Fail: shoggoth mask 232–380 px, stick remains; foom SOL feet inside the rocket, 39–51° counter-rotation.
8. **Explosion source.** Blast centre **within 60 px** of the source. Fail: foom 184–195 px.
9. **Formation spacing.** **≥20 px** between adjacent faces/bodies. Fail: dance1 43 px body spacing, face overlap at 36.2.
10. **One P(DOOM) source.** Prop = ticker = `doomAt(t)` **±0.1**. Fail: dance1 48.0 vs 37.4.
11. **Meter rise.** The dance meter must animate **34→48 over 3.0 s**; no hardcoded value. Fail: dance1 static 48 for 90/90.
12. **Countdown payoff.** The lifespan counter must reach **00:00:00** or the thread must snap at its zero; a countdown must tick at **1.0 s/s**. Fail: eyes 7→3 at 2 ticks/s, no snap.
13. **Type contrast.** Type must have **≥3:1** against its local background; no cream on cream/tan. Fail: chinese `with a bag of` <2:1; dance1 `FORMATION` ≈1.5:1; eyes `RED THREAD` <3:1; chorus1 `GLOBAL RISK` <2:1.
14. **Type margin.** No type clipped by the frame edge; **40 px safe margin** for stickers. Fail: dance1 `DANCE BREAK` left edge x≈17 (not clipped, but outside 40 px).
15. **Type size.** Match the storyboard **±10%**: chorus1 248 vs 320 (−22.5%), foom 376 vs 420 (−10.5%), chinese 226 vs 220 (+2.7%). Fail: chorus1.
16. **Counted type.** `LIES` must be **5×3=15**, not 3×4=12; shoggoth **12 eyes**, not 11; dance1 **6 dancers + SOL**, not 5 + SOL. Fail: all three.
17. **Cut sync.** Cuts land on the score frame **±1**; subtitles must not change before the picture cut. Fail: foom +0.007 (731), chinese +0.020 (786), shoggoth +0.013 (892); subtitle **l06 at 22.700 (frame 681)**, one frame before chorus1; **l08a at 26.167 (frame 785)**, one frame before chinese; **l09 at 29.700 (frame 891)**, one frame before shoggoth. l07/l10 land on their cuts.
18. **Cut strength.** A cut must have a measured diff **≥30** unless it is a deliberate black-to-black iris; black-to-black cuts need a **1-frame overlap**. Fail: shoggoth→eyes 19.0 (no overlap); pass: foom→chinese 141.4, chorus1 109.7, eyes 51.7, dance1 50.0.
19. **Strip centring.** The 30 fps strips must be **15 frames before / 15 after** the cut. Fail: c08/c09/c13 are not; fix the strip generator.
20. **Native type check.** The 15 fps sheet is 320×180/8 columns; any type **<16 px** must be judged at 1920, not the sheet. Fail: the sheet cannot resolve the 12–38 px labels.
21. **Authored maxima.** A flash whose declared max is after the last frame is a defect if the last frame is **>10 points** below the max; a title must hold full for **≥0.25 s**. Fail: dance1 out-flash 11% vs 50% (−39); foom title full at 26.12 vs cut 26.167 (0.05 s). Pass: chorus1 50% vs 60%, eyes 65% vs 75%, foom flash 93% vs 100% (all within 10 points).
