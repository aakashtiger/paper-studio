# Segment G — 109.40–124.24

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames. Segment is **14.84 s / 445 frames**: `trust` 109.40–111.40 (60f), `tower` 111.40–113.38 (59f), `disobey` 113.38–115.08 (51f), `chinchilla` 115.08–117.02 (58f), `fences` 117.02–118.84 (55f), `gpus` 118.84–120.92 (62f), `rlhf` 120.92–124.24 (100f). The `frame-diff.json` shot stats count one boundary frame more (61/60/52/60/55/64/100); sheet counts are exclusive.
- Primary pass: the supplied **15 samples/s** sheets `out/analysis/shots-15/act4-trust.png` … `act4-rlhf.png` (every 2nd source frame, 8 columns). Cut pass: the 30 fps strips `out/analysis/cuts-30/c35-trust.png` … `c41-rlhf.png`, every frame. Not the old 5/10 fps sheets.
- Exact runs from `out/analysis/frame-diff.json` (192×108 mean |ΔY|, 30 fps). The file's own definitions: **frozen < 0.5**, **quiet < 1.0**; I use those thresholds and say so.
- 40 native-resolution frames extracted to `out/analysis/tmp/f*.png` (no review sheet overwritten) plus 7 crops at 2×/4× for hands, stamp and header collisions.
- Code read: `src/scenes/act4.js:682-1157` (the seven scenes), `src/core.js:137-177,305-325`, `src/type.js:28-224`, `src/timeline.js:50-107`, `src/characters.js:372-554,567-735,854-885`, `src/props.js:83-93,422-464`, `src/scene_kit.js:48-75,327-344,584-592`, `src/lyrics.js:39-45,71-85`.
- **STORYBOARD.md is numbered +2 vs the manifest.** Its `## 37` is 109.40 `trust`, `## 41` is 117.02 `fences`, `## 42` is 118.84 `gpus`, `## 43` is 120.92 `rlhf`. The prompt's “sections 37–41” covers trust…fences only; I also read `## 42–43` because `gpus`/`rlhf` are in the segment. The times in the storyboard are correct.
- Global furniture is excluded from “moving layers”: grain is quantised at **24 Hz** (`core.js:153`), paper texture at **2 Hz** (`core.js:143`), type boil at **12 Hz** (`type.js:48`), the corner frame counter at **30 Hz** (`timeline.js:104`), the doom ticker's text at ≈**3.5 Hz** (0.35 %/s, `lyrics.js:71-85`). These produce the 0.2–0.4 floor in the quiet runs and never count as change.
- **Frame-diff caveats, confirmed visually.** (1) It under-reports small type/objects: the `disobey` cards (164×68 px = 0.5 % of frame) appear and get crossed at 113.43/113.65/113.80/114.02/114.16/114.38 while the metric stays < 0.5. (2) It is a **luma** mean, so the `fences` house-colour wrap at 117.91 swaps every house's hue in one frame but reads only **4.9** because cream/pink/mint/gold have similar luma. (3) It cannot see the `rlhf` paddle spin because a rotating circle is rotation-invariant; only the 20×30 thumb moves.
- **The delivered film does not match the current source in four places that matter.** `act4.js:842` ends the CLICK burst at lt 1.15 (114.53), but the film keeps it to 115.07. `act4.js:853-854` poses SOL's arms crossed ([1.2,−1.7]/[−1.2,1.7]), but the film shows a T-pose. `characters.js:535-541`/`:727-728` put the hand at the wrist, but the film's hands sit 70–240 px away. `act4.js:720` scales TRUST ME .55→1 on appear, but the film only fades at full size. Treat the **film** as the evidence and the source as intent; I flag each mismatch where it changes the reading.
- One-frame sheet bleed: each sheet's last cell is the next shot's first frame (e.g. `chinchilla` cell 30 is `fences` at 117.02). Treated as exclusive.

## Shot table

| # | id | start–end | dur | frames | set | cast / props | type | camera | in / out | quiet <1.0 | median / p90 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 35 | `trust` | 109.40–111.40 | 2.00 | 60 | black void, one warm pool + spotlight cone, floating paper contract | SOL (left), MIRA (right); pen, APPROVED stamp, 14 particles | `TRUST ME` 172 Permanent Marker; `just` 36 serif; `APPROVED` 64; `PAGE 1 OF 1` 12 mono | **none** (no push) | hard cut from `jazz`; red stamp flash, hard cut out | **48/60 (80 %)** | 0.41 / 6.81 |
| 36 | `tower` | 111.40–113.38 | 1.98 | 59 | navy void, gold 30-ray sunburst, 4 clouds, 70-star field, 4-SOL totem at x=560 | 4 SOLs; 3 attention arcs | `TRANSFORMERS` ×4, 112→67 Anton; `ALL THE WAY!` 62; `ATTENTION` 16 mono; `layer 01 → 04` 13 mono | **none** (no tilt) | 25 % cream flash in; hard cut out | **53/59 (90 %)** | 0.45 / 6.23 |
| 37 | `disobey` | 113.38–115.08 | 1.70 | 51 | cream training bay, perspective floor grid, 3 orange cones, `TRAINING BAY 07` | SOL (right), MIRA (left); clicker, 3 command cards, CLICK burst, shades, terminal | `SIT`/`STAY`/`PAW` 34; `DISOBEY` 54 mono; `policy: overridden` 11 | **none** (no snap camera; SOL scales 1→1.16 locally) | 35 % cream flash in; hard cut out | **41/51 (80 %)** | 0.23 / 2.33 |
| 38 | `chinchilla` | 115.08–117.02 | 1.94 | 58 | cream/gold 30-ray sunburst, floor plane, giant chinchilla at (760,930) | chinchilla, SOL (squash); 14 TOKEN cards, SUPERDENSE block, 10^13 cube, THUD | `CHINCHILLA` 124 Instrument Serif; `SUPER-DENSE` 66; `SUPERDENSE` 9×5 at 10 | **none** (no macro/pull-back) | hard cut in; hard cut out | **47/58 (81 %)** | 0.92 / 1.08 |
| 39 | `fences` | 117.02–118.84 | 1.82 | 55 | pastel suburb, 8 houses at 420 px pitch, green ground, sun at (1500,300) | the dense cube (v3 flag); 4 picket fences, 7 splinters each, CRUNCH bursts | `BREAKING` 110 Archivo Black; `SAFETY` 15 on each fence; subtitle | **internal lateral track** 320→660 px/s (10.7→22 px/f) | 25 % cream flash in; hard cut out | **0/55 (0 %)** | 3.60 / 4.66 |
| 40 | `gpus` | 118.84–120.92 | 2.08 | 62 | near-black data-centre aisle, 16 racks (8 depths × 2 sides), green floor grid | SOL; 6 floating GPU cards, giant counter | `100,000` 170 DMMono; `GPUS` 74; `POWER 1.21 GW` 15; `THERMAL EVENT` 30 | **none** (no dolly) | hard cut in; red wash, hard cut out | **17/62 (27 %)** | 1.72 / 3.36 |
| 41 | `rlhf` | 120.92–124.24 | 3.32 | 100 | clinical white panel, 160 px grid, 1760 px table, 5 stars | SOL (on table), 5 MIRA clones; 5 paddles, 8 checks, 5 name tags | `RLHF` 190 Archivo Black; `GOES ASKEW` 92; `REWARD: …` 16; `RATER AGREEMENT` 13 | **tilt** 0.13 rad 122.54–123.07; **slide** 900 px 123.02–123.92 | 35 % cream flash in; 60 % red flash out | **45/100 (45 %)** | 1.80 / 9.07 |

**Segment totals.** 251 of 445 frames (56.4 %) are under 1.0 mean; 172 (38.7 %) are under 0.5. Four of seven shots are 80–90 % quiet. `fences` is the only shot with a continuous motion floor (min 1.58). **No shot uses the camera rig (`setCam`); `fences` and `rlhf` move the world locally instead.** The largest frame changes are the cuts (14.7–151.8), the trust stamp (40.1), and the RLHF tilt/slide (9.6–10.0).

## Per-shot anatomy

### 35 — `trust` 109.40–111.40 · 2.00 s · 60 frames

**Set.** Black `#080607` void with one radial pool at (960,610), r=620, alpha .22→0, and a spotlight cone from (960,−80), length 820, width 30→520, alpha .16 (`act4.js:687-691`). A cream paper contract floats at (960,650), rotated −0.02, scaled 1.55 (`:693-695`). **Cast.** SOL at (560,1000), scale .86, leaning .1, right arm raised to the page, happy eyes/smile (`:697-709`); MIRA at (1390,1000), scale .86, leaning −.06, right arm out, wide eyes, wobble mouth, look [−1,.2] (`:711-717`). **Props.** A gold/ink pen at (746,632), rotation −.9, 82 px long (`:705-708`); `APPROVED` stamp at (1030,820), rotation −.19, 64 px (`:731-732`); 14 red 8×3 px particles (`:736-739`). **Type.** `TRUST ME` 172 px Permanent Marker, cream fill, 3 px ink edge, 4 px shadow, charRot .04 (`:720-724`); `just` 36 px Instrument Serif italic at (960,176) (`:726`); `ALIGNMENT AGREEMENT / PAGE 1 OF 1` 12 px mono at (962,930) (`:743`); contract header 19 px + 11 px (`scene_kit.js:587-588`). **Camera.** None. The storyboard says “extreme close-up, slow push”; the contract's bbox is identical at 109.75 and 110.35. **Transition.** In: hard cut from `jazz` (frame 3282, Δ 38.1), no in-flash; the frame opens near-black with the title at low alpha. Out: hard cut at 111.40; the red flash is at 110.64–110.90, 0.50 s *before* the cut.

**CONTINUOUS (every 0.0667 s).** SOL's flower petals pulse 4.5 % on the 88 BPM beat (`characters.js:137`); her four hair strands sway ±8 px `sin(t·1.8+i)` (`:406-408`); MIRA's hair/head tilt are fixed, only the mouth wobble is drawn once (no `t`); 20 dust motes drift 20–60 px/s (`act4.js:10-20`, call `:744`); the doom ticker's text ticks every ≈0.29 s; grain 24 Hz + paper 2 Hz + type boil 12 Hz. **The bodies do not bounce or breathe** — only petals/hair.

**DISCRETE.** 109.45–109.75 title alpha-in (film; source scales .55→1). 110.06 lyric `Just`; 110.74 `trust`; 111.24 `me`. **110.62–110.82** stamp: `st = seg(lt,1.22,1.42)`, scale `lerp(2.6,1,easeIn(st))`, alpha `st·2`, 14 particles at radius 120→420 px, red flash 0.4→0 at 110.64–110.90 (`:728-745`). The frame-diff spike is **110.70 (40.1)** and **110.80 (8.7)**.

**Dead/soft runs.** <0.5: 109.47–109.60 (5f), 109.87–110.00 (5f), **110.07–110.43 (12f, 0.40 s)**, 110.50–110.63 (5f), **111.07–111.37 (10f, 0.33 s)**. <1.0: 109.47–109.73 (9f), **109.87–110.63 (24f, 0.77 s)**, **110.97–111.37 (13f, 0.40 s)**. The 0.77 s run is the title fade + contract hold; the 0.40 s tail is the settled stamp. Both are carried by grain/boil + the ticker.

**3+ independent moving layers?** **No, not meaningfully.** Petal pulse (4.5 % of a 100 px flower), hair sway (±8 px), dust (20 sub-3 px motes). All are below the 192×108 threshold; the shot is a held still with one 0.2 s stamp event.

**Authored detail a recipe would miss.** The contract's torn edges are 3 px amplitude with 14/10/14/10 points (`core.js:227-244`), 7 ruled lines, and a blue signature arc from (40,86) to (120,90) (`scene_kit.js:590`) — a specific page, not a generic “contract” icon. The stamp is rotated −0.19 rad and its 14 particles are at 14 explicit angles, 8×3 px bars, not a radial gradient. The pen is 82 px with a 10 px gold barrel and a 16 px ink nib. SOL/MIRA are staged as an offer/hesitation: SOL leans in, MIRA leans away with `look:[-1,.2]` and a wobble mouth. The `PAGE 1 OF 1` mono line at 12 px is the joke.

**Flaws.**
- **Rig, P0: both visible hands are detached.** At 109.75 MIRA's extended hand is a 6×8 px egg at (1547,675), **≈70 px** from the sleeve end at (1485,640); SOL's far hand is **≈70 px** off her cuff at (482,660) (35 px lateral, 60 px down). At 110.70 the same two blobs are visible. `characters.js:535-541` draws the hand at `wrist + (0,11)`, so the delivered rig does not match the source.
- **Rig, P0: the pen is not in a hand.** It sits at (746,632), 20 px past a rounded cuff with no hand at all (`act4.js:705`). It reads as a floating pencil pointing at the signature line.
- **Type, P1: `just` is swallowed by `TRUST ME`.** `just` is at y=176, inside the 172 px title whose baseline is y=272; both are cream. It is visible at 109.45 (dark title) and gone from 109.60 onward. Move it to y=120 or make it ink.
- **Type, P1: the signature is a smile.** `drawContract` draws one static blue quadratic arc, 80 px wide, no nib, no ink variation, no animation (`scene_kit.js:590`). A human signature is the one detail this shot is about.
- **Layout, P1: the stamp is 2.5× at 110.70.** It spans 470–1590, covering SOL's legs and MIRA's body, then shrinks onto the page by 110.82. A stamp impact should start at ~1.3× and land, or be clipped to the contract.
- **Motion, P0: no push, 0.77 s under 1.0.** The storyboard promises an extreme close-up push; the contract bbox is pixel-identical across the shot.
- **Continuity, P2: the red flash is 0.5 s before the cut.** It reads as a stamp flash, not a transition; the cut itself is a hard dark→teal jump.

### 36 — `tower` 111.40–113.38 · 1.98 s · 59 frames

**Set.** `kitBg('#071B3B','#0A0F26')` with a 30-ray sunburst centred (760,400), r=1000, goldL .35→#0A0F26, alpha .12 (`act4.js:752`); 70-star field (`:753`, `props.js:83-93`); 4 clouds at (260,300,1.2), (1500,250,1.5), (1180,420,.9), (430,170,.8), cream .14 (`:755-757`). **Cast.** 4 SOLs at x=560, y=920/688/495/330, scales .58/.50/.42/.34, stacked on each other's heads (`:758-777`); each has a beat-driven arm snap and a 3 px sway. **Props.** 3 quadratic attention arcs from each shoulder to the head above, with 17 px arrowheads, goldL, pulse .45–1.0 (`:779-795`); `ATTENTION` 16 px mono, rotated −.42 (`:796`). **Type.** 4× `TRANSFORMERS`, right-aligned x=1840, y=280/418/556/694, sizes 112/97/82/67, alternating cream/sky, 5 px ink edge, alpha .95→.65 (`:798-803`); `ALL THE WAY!` 62 px gold at (1840,840) (`:804`); `layer 01 → 04 / attention is all you need` 13 px mono (`:805`). **Camera.** None. The storyboard says “tilt down the tower, vertigo”; there is no `setCam` and no y translate. **Transition.** In: 25 % cream flash 111.40–111.60 (`:807`), diff 83.6 at the cut then 7.1/6.5/6.5/6.3/6.2 as it decays. Out: hard cut at 113.38.

**CONTINUOUS.** 70 stars twinkle at 0.7–2.3 Hz (`props.js:87`); 3 arcs pulse at 88 BPM (`act4.js:782`); 4 SOLs' arms snap between 2.3 and 0.2 rad at each `sin(beat·π+i·1.7)` zero crossing, **staggered 0.37 s per layer** (i·1.7 phase) — a wave travelling down the totem; dust 25; ticker; grain/boil. **No body bounce**: `bounce` is `−abs(sin(beat·π+i·.8))·5`, 0–5 px, and `sway` ±3 px (`:773`).

**DISCRETE.** Arm snaps at `t = 0.21 + n·0.6818` for the bottom SOL (111.71, 112.39, 113.07), each layer offset by −0.369 s (i=1), −0.738 s (i=2), −1.107 s (i=3). No other event. The cream flash (111.43–111.63) is the only >1.0 change after the cut; after 111.67 nothing reaches 1.0.

**Dead/soft runs.** **111.67–113.37: 52 of 59 frames under 1.0 (1.73 s)** — 87 % of the shot. Four <0.5 runs: 111.83–112.00 (6f), 112.23–112.43 (7f), 112.73–112.93 (7f), 113.17–113.33 (6f). This is not a literal freeze (the arms snap, the stars twinkle), but at 192×108 it is a held still.

**3+ independent layers?** **No.** The only layers are 8 small hands (10–15 px at the top of the stack) and 3 thin arcs. The background, title and tower positions are fixed. The shot reads as a poster.

**Authored detail a recipe would miss.** The 0.37 s stagger per layer makes the arm wave travel down the totem rather than all four wave at once — a specific puppet behaviour. The attention arcs are not straight: each is a quadratic from `(baseX+118·s, y0)` to `(baseX+112·s, y1)` with a control point at `(baseX+330, mid)` (`:783-787`), so they bow outward like attention weights. The four `TRANSFORMERS` shrink 112→67 px and fade .95→.65, a real depth cue. The 4 clouds are at 4 scales. The 70-star field has 3.2 px sparkles every 11th star.

**Flaws.**
- **Camera, P0: no tilt.** The storyboard's “tilt down the tower, vertigo” is absent (`act4.js:751-808`). A 0.10 rad tilt + 120 px y translate over 1.8 s would have lifted the whole shot.
- **Motion, P0: 1.73 s under 1.0.** The arms snap but the hands are 10–15 px; the arcs are 5 px lines. The shot is 87 % “quiet” by its own metric.
- **Story, P1: 4 SOLs, not infinite.** The title says `layer 01 → 04`, so it is internally consistent, but the storyboard's “infinite vertical tower … receding into clouds” is reduced to a 4-high totem.
- **Type, P2: `ATTENTION` is unreadable.** 16 px mono at −.42 rad on a gold sunburst (`:796`); at 1920 it is 16 px tall and low contrast. The arcs already say it.
- **Contrast, P2: gold arcs on a gold sunburst.** The arcs are `PAL.goldL` at .8 pulse over a goldL .35 sunburst; at 111.9 the middle arc is nearly invisible.
- **Layout, P2: the top SOL is 70 px from the frame edge.** Its petals are at y≈70; a 1.98 s held frame with that little headroom feels accidental.

### 37 — `disobey` 113.38–115.08 · 1.70 s · 51 frames

**Set.** Cream `#F4EBD9→#E4D4B8` (`act4.js:815`); an 18-line perspective floor grid from y=780 to the bottom, blue .16 (`:817-820`); 3 orange cones at (250,940,1), (1690,935,.9), (430,860,.55), each with a cream band and an ink base (`:824-829`); `TRAINING BAY 07` 16 px + `ALIGNMENT DIV. / CLICKER PROTOCOL` 11 px (`:821-822`). **Cast.** MIRA at (470,930), scale .9, lean .12, arms down, clicker at (522,699) (`:831-841`); SOL at (1080,930), scale .92, arms up before 114.33 then out after, shades after 114.36 (`:843-866`). **Props.** 3 torn command cards at x=760/950/1140, y=250, 164×68, red X after 0.22–0.32 s (`:868-877`); `CLICK` burst at (600,650), r=64 (`:842`); `DISOBEY` terminal at (1480,540), 460×200, black with acid edge (`:879-891`). **Type.** `SIT`/`STAY`/`PAW` 34 px Archivo Black; `DISOBEY` 54 px DMMono, 44 px letter spacing, typed at 0.04 s/char (`:883-887`); `> _` 16 px, `policy: overridden` 11 px, `reward model: confused` 12 px (`:882,889,892`). **Camera.** None. The storyboard says “pet-cam low angle; snap zoom on shades”; the film has a 1.16× local scale on SOL at 114.33–114.53 (`:844-846`), not a camera. **Transition.** In: 35 % cream flash 113.38–113.54 (`:893`), diff 140.0 at the cut. Out: hard cut at 115.08.

**CONTINUOUS.** SOL's bounce `−abs(sin(beat·π))·8` and sway ±5 px (`:851-852`); MIRA's idle (lean fixed, head tilt fixed); dust; ticker; grain/boil. The `CLICK` burst is **static** — `comicBurst` has no per-frame animation, only type boil (`scene_kit.js:48-65`). The terminal's underline is static.

**DISCRETE.** 113.43 SIT in; 113.65–113.75 SIT crossed; 113.80 STAY in; 114.02–114.12 STAY crossed; 114.16 PAW in; 114.38–114.48 PAW crossed. 114.16–114.28 terminal fades in (alpha 0→1); 114.22/114.26/114.30/114.34/114.38/114.42/114.46 the 7 letters of `DISOBEY`; 114.36–114.48 shades drop 220 px; 114.33–114.53 SOL scale 1→1.16; 114.38–114.54 35 % cream flash (source; not measurable in the film, max Δ 3.6 at 114.47); 114.56 lyric `disobey`. The frame-diff's biggest post-cut change is only **3.6** at 114.47.

**Dead/soft runs.** **113.47–114.17: 22 of 51 frames under 1.0 (0.73 s)**, including 113.57–114.00 (14f, 0.47 s) under 0.5; **114.60–115.07: 15 frames under 1.0 (0.47 s)**, 114.63–115.07 under 0.5. The first run is *not* visually dead — the SIT card is crossed at 113.65 and STAY appears at 113.80 — but those events are 0.5 % of the frame and the metric cannot see them. The second run is genuinely dead: the terminal is fully typed, the shades have landed, and nothing new happens for 0.44 s.

**3+ independent layers?** **No, not continuously.** Discrete layers are strong (cards, terminal, shades, snap), but the continuous layers are SOL's 8 px bounce, MIRA's fixed pose, and dust. The shot is a sequence of 5 discrete events on a held stage.

**Authored detail a recipe would miss.** The three cards are torn at 3 px and rotated −.04/+0.00/+.02, with red X's at ±65 px (`:873-875`). The clicker is a 28×30 red box with a cream button (`:838-839`). The shades drop 220 px in 0.12 s (`:860-864`). The terminal's typing cadence is 0.04 s per character, and `policy: overridden` is 11 px mono (`:885-889`). The cones have a cream band and an ink base, and the floor grid converges to a vanishing point below the frame (`:817-820`). `reward model: confused` at 12 px is the joke.

**Flaws.**
- **Layout, P0: PAW is behind SOL's head.** `x = 760 + i·190` gives 1140 for i=2 (`:872`); SOL is at 1080 with a 180 px head (`:846`). At 114.45 and 114.90 the card's cream body is completely hidden; only the letters peek out either side of her hair. Move PAW to x=1320 or SOL to x=1200.
- **Continuity, P0: the CLICK burst never ends in the film.** Source `if (lt < 1.15)` (`:842`) = ends 114.53; the delivered frames show it at 114.65 and 114.90. It competes with the DISOBEY terminal for the last 0.5 s.
- **Rig, P0: SOL's arms are a T-pose with the hands on her torso.** At 114.90 both sleeves are horizontal, ending in rounded white caps at x=930/1230; the two skin blobs are at (1050,520) and (1080,640), **120–240 px** from the cuffs. The storyboard's “crosses arms” is not readable.
- **Rig, P1: MIRA's clicker floats.** It is at (522,699); her hand is at ≈(500,650), a 50 px gap. The click reads as a floating red box.
- **Type, P1: the left cone's SAFETY label is under the subtitle.** It is at y=968 (`:828`); the subtitle band is y=948–1010 (`type.js:189-196`) and is drawn after the scene (`timeline.js:60`). Only the right cone's label survives.
- **Camera, P1: the “snap zoom” is a 16 % local scale.** `z = 1 + .16·easeOut(snap)` (`:845`) over 0.2 s; it moves SOL's head 30 px. The storyboard's pet-cam low angle is absent.
- **Motion, P1: 0.44 s dead at 114.63–115.07.** After the terminal and shades land, nothing new happens before the cut.

### 38 — `chinchilla` 115.08–117.02 · 1.94 s · 58 frames

**Set.** Cream/gold `kitBg('#F7EEDC','#E8D4AE')` with a 30-ray sunburst at (900,500), r=1100, goldL .7, alpha .22 (`act4.js:901`); a floor plane at y=900 with a 0.1-alpha grid (`:902`). **Cast.** The chinchilla at (760,930), scale 2.25, x-puff 1±.1 at 88 BPM (`:904-907`, `characters.js:854-885`); SOL at (1480,930), scale .72, squashed x 1→1.55 / y 1→0.22 over lt .25–1.45 (`:920-937`). **Props.** 14 TOKEN cards at x=300–1150, y=390–690, each rotated `hash·.8 + u·2`, looping `u = frac(lt·.55 + hash)` (`:910-918`); a 9×5 `SUPERDENSE` block at (1450,690), 10 px mono, alpha .5→.18 (`:960-964`); a glowing 10^13 cube at (1480, cy), 112 px, 6 vent slots (`:939-950`); 3 impact rings + `THUD` burst after lt 1.78 (`:951-957`). **Type.** `CHINCHILLA` 124 px Instrument Serif, cream, 5 px ink edge, 7 px shadow (`:908`); `SUPER-DENSE` 66 px Archivo Black, gold, 5 px ink edge (`:965`); subtitle `Post-Chinchilla, super-dense`. **Camera.** None. The storyboard says “macro, then pull back”; there is no camera. **Transition.** In: hard cut from `disobey` (diff 24.1), no flash — a cream→gold value jump. Out: hard cut at 117.02.

**CONTINUOUS.** 14 TOKEN cards rise and fall on `sin(u·π)·260` with a 0.55/s loop (`:911-913`) — the strongest layer; the chinchilla's whole body scales x by 1±.1 at 1.47 Hz (`:904-905`); SOL's squash is continuous 115.33–116.53 (`:920-923`); the cube falls 116.63–116.83 (`:940-941`); dust 22; ticker; grain/boil. The sunburst is **static** for 1.94 s.

**DISCRETE.** 115.33–116.53 SOL squash (x 1→1.55, y 1→0.22); 116.38 cube appears (source; the film's cube is not visible until ≈116.70); 116.53 squashed SOL disappears (`if (sq < 1)`, `:921`); 116.63–116.83 cube falls 870→1050; 116.86 THUD + 3 rings (`:956`); 116.00 lyric `super-dense`. The only post-cut frame that reaches 1.5 is the THUD at **116.90**.

**Dead/soft runs.** **The whole shot after the cut is under 1.5 mean.** 56 of 58 frames are under 1.5 (115.17–117.00). <1.0: 115.17–115.43 (9f), 115.73–116.00 (9f), 116.23–116.40 (6f), 116.47–116.67 (7f), 116.73–116.83 (4f), 116.93–117.00 (3f). Max after the cut = 1.5 (THUD). This is the softest shot in the segment by peak change, even though it has the most moving objects.

**3+ independent layers?** **Yes** — 14 cards, chinchilla puff, SOL squash/cube, dust. But every layer is small or slow; the metric's p90 is **1.08**, the lowest in the segment. It passes the count, fails the “meaningful” bar.

**Authored detail a recipe would miss.** The chinchilla is a 26-petal collar (alternating cream/paper2) around a 52×60 body, with pink inner ears and two 5.5 px eyes (`characters.js:858-876`) — a specific paper stuffie, not a generic rodent. The 14 TOKEN cards each have a hash-chosen x, phase and rotation (`act4.js:911-914`), so they do not move as a grid. The 9×5 `SUPERDENSE` block is 45 separate 10 px lines with alpha falling .5→.18 (`:960-964`) — a density texture, not a repeated word. The cube has 6 vent slots and a `10^13` label (`:946-949`); the THUD has 3 concentric rings (`:951-955`).

**Flaws.**
- **Story, P0: the chinchilla has no mouth or cheeks.** `characters.js:854-885` draws a body blob, 2 ears, 2 eyes and a nose; no mouth, no cheek pouches. The 14 cards occupy y=390–690, the mouth would be y≈730, so **no card ever reaches the face**. “Stuffs token cards into its cheeks; cheeks inflate” is not depicted; the cards are confetti and the puff is a whole-body x-scale.
- **Continuity, P0: 0.2 s hole at 116.50–116.68.** The squashed SOL vanishes at lt 1.45 (116.53); the cube is not visible in the film until ≈116.70. At 116.52 the lower right is empty except the type block. The “squash into a cube” reads as a disappearance, then a cube drops in from nowhere.
- **Layout, P1: the SUPERDENSE block is drawn over SOL.** Block at (1450,690), 300×150 (`:960`); squashed SOL at (1350–1500, 700–780) (`:922-923`). The block's last rows cross her face and body. Move the block to (1700,600) or draw it before SOL.
- **Story, P1: it reads as a bunny.** 2 upright ears with pink inners, a round body, no tail, no chinchilla muzzle (`characters.js:866-876`). At 1080p the silhouette is a rabbit in a flower.
- **Motion, P1: the sunburst is static for 1.94 s.** The 30 rays are the dominant background; a 2°/s rotation or a 4 % scale breath would cost nothing.
- **Rig, P2: SOL's arms are two straight spikes.** `armL:[2.5,.2]`, `armR:[−2.5,.2]` (`:927`) at the squash; with the y-scale .22 they become 2 px lines. The squash reads as a crushed bug, not a character compressing.

### 39 — `fences` 117.02–118.84 · 1.82 s · 55 frames

**Set.** Pastel suburb: `kitBg('#BFE0EE','#F6E6C8')` (`act4.js:975`); a sun at (1500−scroll·.25, 300), r=110, gold/orange (`:976`, `scene_kit.js:30-46`); 8 houses at 420 px pitch, colours cream/pinkL/mint/goldL, each 260×200 with a 44×90 door and two 40×36 windows (`:978-985`); a green floor plane at y=840 with a 0.1-alpha grid (`:986`). **Cast.** The dense cube at (560, 780+sin(scroll·.03)·20), 96×96, rotating `scroll·.022` rad, with a 62 px flag pole and a red `v3` flag (`:1008-1020`). **Props.** 4 white picket fences at `fx = 520 + i·470 − scroll`, 280×150, each with a gold `SAFETY` sticker (`:989-1006`, `scene_kit.js:327-344`); 7 splinters per broken fence, 16×70, pushed 80–260 px and rotated `hash·5−2` (`:998-1004`); 4 `CRUNCH` bursts at x=760/1060/1360/1660 (`:1026-1028`); 8 static speed lines at y=720–760 (`:1029-1031`). **Type.** `BREAKING` 110 px Archivo Black, red, 6 px cream edge, 8 px shadow, at (90+sin(t·2)·6,250) (`:1021-1024`); `SAFETY` 15 px on each fence; `v3` 11 px on the flag; subtitle `Breaking through each safety fence`. **Camera.** No `setCam`; the lateral track is an internal scroll `320·lt + 170·lt²` (`:974`), 10.7→22 px/frame at 1920. **Transition.** In: 25 % cream flash 117.02–117.18 (`:1033`), diff 14.7. Out: hard cut at 118.84.

**CONTINUOUS.** The whole world scrolls left at 320→660 px/s: 8 houses, 4 fences, 4 debris clouds, the cube (which also rotates 0.022·scroll = 14.5 rad over the shot, 2.3 turns), the flag, and the sun at 0.25× parallax (`:974-1010`). 7 splinters per broken fence move with their fence and then hold a fixed offset (`:998-1004`). Dust 20; ticker; grain/boil. The ground grid is **static** — `floorPlane(..., t)` uses `t`, not `scroll` (`:986`) — so the grass lines do not travel with the houses.

**DISCRETE.** 117.02 fence 0 break (beats[0]=0, `:988`); 117.70 fence 1; 118.38 fence 2; 118.99 fence 3 (beyond the end, never breaks). CRUNCH windows: 117.02–117.32 (x=760), 117.70–118.00 (x=1060), 118.38–118.68 (x=1360), 119.06 (x=1660, beyond). 117.40 lyric `through`; 117.80 `each`; 118.02 `safety`; 118.44 `fence`. **117.91 house-wrap:** `frac(scroll/420)` wraps at scroll=420; every house jumps +420 px and every screen position changes hue in one frame (`:979`).

**Dead/soft runs.** **None.** 0 of 55 frames under 1.5; min 1.58, median 3.60, p90 4.66, max 14.7 (the in-flash). This is the only shot in G with a continuous motion floor.

**3+ independent layers?** **Yes, 5** — house scroll, sun parallax, cube roll, debris/splinters, dust. This is the motion engine to copy.

**Authored detail a recipe would miss.** The 4-colour house cycle with a 420 px pitch and a 260×200 gable, door and two windows (`:978-985`); the sun's 0.25× parallax (`:976`); 7 splinters per fence, each with a hash-chosen push (80–260 px), fall (60–220 px) and rotation (`:998-1004`); the cube's `v3` flag on a 62 px pole (`:1017-1019`); the 8 speed lines at y=720–760 (`:1029-1031`); the `BREAKING` marquee's ±6 px sway and −.02 rad (`:1022`).

**Flaws.**
- **Loop, P0: the house wrap is a one-frame 420 px teleport + full hue swap.** `frac(scroll/420)` at 117.91 (`:979`): the pink house at x=−93 becomes a cream house at x=−113, the mint at 327 becomes pink at 307, etc. The shapes are identical, so the luma diff is only **4.9**; the hue changes by 60–120°. Use a 1680 px colour period (4×420) or draw 10 houses and wrap at 1680, or hide the wrap behind `BREAKING`.
- **Contact, P0: CRUNCH is 200–800 px ahead of the cube.** `comicBurst(..., 760 + i·300, 720)` (`:1027`); the cube is at x=560. At 117.90 the burst is at x=1060, over an **intact** fence, while the cube is 500 px left. Put the burst at the cube's x (560) or at the fence's contact point.
- **Contact, P0: the fences break before the cube reaches them.** Fence 1 at lt .68 is at x=694–974; the cube's right edge is 608 — an **86 px gap**. Fence 2 at lt 1.36 is at x=711–991 — a **103 px gap**. The beat grid, not the contact, triggers the break (`:988`).
- **Continuity, P1: the flag rotates with the cube.** The flag is inside the cube's `ctx.rotate(scroll·.022)` group (`:1010-1019`); at 117.90 it points down-right and the `v3` is upside down. A flag should stay upright.
- **Set, P1: all 4 fences are the same white picket.** `drawFence` is called for all four (`:994`); the storyboard promises picket, traffic barrier, SAFETY tape and chain-link. The four `SAFETY` stickers are identical.
- **Parallax, P1: the ground grid is static.** `floorPlane(..., t)` (`:986`) uses the clock, not `scroll`; the grass lines stay put while the houses slide. At 22 px/frame this is visible in the near field.
- **Continuity, P2: the first fence is already broken at 117.02.** `beats[0]=0` and `broken = lt > 0` (`:988,992`), so the shot opens on debris and a CRUNCH. There is no intact first fence to break.
- **Type, P2: `BREAKING` is static.** The storyboard says “BREAKING scrolling”; the film only sways ±6 px (`:1022`). It is the largest type in the shot and it does not move.

### 40 — `gpus` 118.84–120.92 · 2.08 s · 62 frames

**Set.** `dataSet` (`props.js:439-464`): near-black `#070B0D→#0B1416`, a vanishing aisle at (960,700), a green floor grid (21 radial + 7 horizontal lines, alpha .2), 16 racks (8 depths × 2 sides) at scales 1→.18, each with 4 LEDs per row blinking at 2–7 Hz (`props.js:422-436`). **Cast.** SOL at (780+sin(lt·1.3)·26, 930−abs(sin(beat·π))·5), scale .8, star eyes/grin, right arm raised with a 16 px acid hand glow (`act4.js:1046-1056`). **Props.** A giant counter at (960,360), 170 px DMMono acid with 6 px ink edge (`:1058-1059`); `GPUS` 74 px at (960,470) (`:1060`); `POWER 1.21 GW / CLUSTER 001` 15 px at (960,520) (`:1061`); 6 floating GPU cards at x=160+i·320, y=700−u·220, scale .16, alpha .5 (`:1062-1068`); 6 heat-shimmer lines at y=900–1010, alpha .1 (`:1042-1045`); `THERMAL EVENT` 30 px at (960,640) after lt 1.75 (`:1070-1074`). **Type.** `CLUSTER 001` / `POWER 1.21 GW` 16 px at (60,70/96) (`props.js:458-459`); subtitle `Hundred thousand GPU`. **Camera.** None. The storyboard says “fly-through dolly, low”; the racks are static. **Transition.** In: hard cut from `fences` (diff 151.8), no flash. Out: red wash 0→.35 over 120.59–120.92 (`:1071-1072`), then hard cut at 120.92.

**CONTINUOUS.** The counter `n = floor(100000·easeOut(seg(lt,0,1.2)))` (`:1058`) — fast at first, decelerating into 100,000 at 120.04; SOL's ±26 px sway and 5 px bounce; 6 floating GPU cards rising 220 px on a 0.2/s loop (`:1063-1066`); 6 heat-shimmer sine lines (`:1044`); 16 racks' LEDs blinking (`props.js:429`); dust 22; ticker; grain/boil.

**DISCRETE.** 118.84–120.04 counter 0→100,000 (easeOut); **120.04–120.92 counter holds exactly 100,000 for 0.88 s / 26 frames**; 120.59 `THERMAL EVENT` + red wash 0→.35; 118.84 `Hundred`; 119.38 `thousand`; 119.78 `GPU`. The only post-cut diff above 4 is 120.10 (4.0).

**Dead/soft runs.** **120.13–120.60: 15 frames under 1.0 (0.47 s)**, split by single-frame blips at 120.30/120.47: 120.13–120.27 (5f), 120.33–120.43 (4f), 120.50–120.60 (4f). The 100,000 hold is 120.04–120.92, so 0.47 s of it is “quiet”; the red wash only starts at 120.59. 13 frozen frames.

**3+ independent layers?** **Yes, 5** — counter, SOL sway, 6 cards, shimmer, LEDs. But during the hold, the only new thing is the red wash; the counter, the largest object, is frozen.

**Authored detail a recipe would miss.** The 16-rack perspective is 8 explicit depths with `sc = 1−u·.82` and y = 700+40+u·120 (`props.js:450-456`), so the aisle has a real vanishing point, not a repeated texture. Each rack has 4 LEDs per row blinking at a per-row hash rate (`:428-432`). The 6 GPU cards have a snowflake icon and a `0.16` scale (`scene_kit.js:460`). The trailing hand glow is a 16 px acid dot at (126,−360) from SOL (`act4.js:1055`). The counter's easeOut is a real deceleration: 0→100,000 in 1.2 s, with the last 0.3 s moving <1,000. `POWER 1.21 GW` is the Back to the Future joke.

**Flaws.**
- **Motion, P0: the payoff is frozen for 0.88 s.** The counter reaches 100,000 at 120.04 and holds to 120.92 (26 frames). The only change is the red wash at 120.59. A count that overshoots (100,000→100,042→100,000), a digit glitch, or a 2-frame flicker would keep the hero alive.
- **Type, P1: `THERMAL EVENT` loses its T.** Centred at 960 (`:1073`), width ≈270 px → x=825–1095; SOL's petals reach x=870. At 120.85 the frame reads **`HERMAL EVENT`**. Move it to (1180,640) or draw it after SOL with a 20 px offset.
- **Type, P1: `POWER 1.21 GW / CLUSTER 001` is 40 % hidden.** Centred at 960 (`:1061`), width ≈500 px → x=710–1210; SOL's head/hair covers x=740–870. At 118.90 the frame reads **`ER 1.21 GW / CLUSTER 001`**. Move it to (1250,520) or split it left/right.
- **Layout, P2: the counter crosses SOL's hair/petals.** The number is drawn after `idol` (`:1059` after `:1049`), so it wins, but the `4`/`6` collide with her petals at 118.90 and the `0` with her hair at 120.3. A 40 px y offset would clear it.
- **Camera, P1: no dolly.** The storyboard says “fly-through dolly, low”; the racks are pixel-identical at 118.90 and 120.30. A 1.00→1.04 push or a 40 px x dolly over 2 s would sell the aisle.
- **Motion, P2: the LEDs are 5×3 px.** 64 LEDs per rack × 16 racks, but at 192×108 they average out; the rack wall reads as static even though it is blinking.

### 41 — `rlhf` 120.92–124.24 · 3.32 s · 100 frames

**Set.** Clinical `#F7F5EF→#DCD7CB` (`act4.js:1083`); a 12×7 grid at 160 px, blue .08 (`:1085-1088`); a 1760×60 cream table top at y=730 and a 1760×220 front at y=790 (`:1093-1094`). **Cast.** 5 MIRA clones at x=300+i·330, y=790, scale .72, alternating happy/normal eyes, arms out, name tags `MIRA-1…5` (`:1096-1115`); SOL on the table at (960,730), scale .66, bounce 14 px, sway 8 px, arms out (`:1117-1124`). **Props.** 5 paddles at (mx+86, 370), r=56, cream with a 6 px thumb icon, spinning ±8 rad over lt 1.0–1.9 (`:1105-1112`); 5 stars at (680+i·120, 180), r=120, 4 gold + 1 outline, 5th at glitch>.5 (`:1131`); 8 green checks at (120+i·230, 420±60), alpha .55, appearing at .12 s intervals (`:1145-1152`). **Type.** `RLHF` 190 px Archivo Black, blue, 8 px cream edge, 9 px shadow, at (300,640), backOut kick (`:1135-1138`); `GOES ASKEW` 92 px red at (1360+glitch·60,980), rotation .18+.1·glitch (`:1139-1143`); `REWARD: 4.8 / 5.0` → `REWARD: UNBOUNDED` 16 px at (960,240) (`:1133`); `RLHF REVIEW / SESSION 0042` 15 px at (70,80); `RATER AGREEMENT: 5/5` 13 px at (1860,80) (`:1127-1128`). **Camera.** Tilt 0.13 rad around (960,620) over lt 1.62–2.15 (122.54–123.07); slide 900 px left over lt 2.1–3.0 (123.02–123.92) (`:1089-1091`). This is the only authored camera-like move in G, and it is a local transform, not `setCam`. **Transition.** In: 35 % cream flash 120.92–121.08 (`:1154`), diff 144.8. Out: 60 % red flash 124.02–124.22 (`:1155`), then hard cut at 124.24.

**CONTINUOUS.** SOL's dance: bounce `−abs(sin(beat·π))·14`, sway `sin(t·2.3)·8` (`:1121`); 5 paddles spin ±8 rad at 1.0–1.9 (`:1106`); the 5 stars rotate ±.1 rad `sin(t·3+i)` (`scene_kit.js:622`); the 8 checks appear; dust 20; ticker; grain/boil. The MIRAs' bodies, heads and tags are **fixed** — only the paddles move.

**DISCRETE.** 120.97–121.47 `RLHF` backOut kick (`:1135`); 121.22/121.34/…/122.06 the 8 checks (`:1146`); 121.92–122.82 paddle spin (`:1098`); 122.32–122.82 glitch (`:1129`); 122.52 `REWARD: UNBOUNDED` (`:1133`); 122.57 5th star fills (`:1131`); 122.47 `GOES ASKEW` in (`:1139`); 122.54–123.07 tilt; 123.02–123.92 slide; 124.02–124.22 red flash. 120.92 `RLHF`; 121.66 `goes`; 121.96 `askew`.

**Dead/soft runs.** **121.13–122.50: 42 of 100 frames under 1.0 (1.40 s)** — the whole first half. Three <0.5 runs: 121.17–121.50 (11f), 121.57–122.00 (14f), 122.07–122.33 (9f). The tilt/slide lifts the second half to 9.6–10.0 at 123.60–123.83. 35 frozen frames total.

**3+ independent layers?** **Yes after 122.3** — SOL dance, 5 paddles, 8 checks, stars, tilt/slide. **No before 122.3**: the MIRAs are T-posed statues, the paddles are rotation-invariant circles, and the only readable motion is SOL's 14 px bounce.

**Authored detail a recipe would miss.** The 5 name tags `MIRA-1…5` (`:1114`); the paddles counter-spin ±8 rad alternating by index (`:1106`); the star row's `sin(t·40)·glitch·8` x-jitter (`:1130`); the 8 checks at .12 s intervals with per-index y (`:1148`); the table's torn edges (`:1093-1094`); the tilt+slide is staged so the **UI stays upright while the world tilts** — a specific metaphor, not a generic “shake”. `REWARD: UNBOUNDED` is the joke.

**Flaws.**
- **Type, P0: `RATER AGREEMENT: 5/5` is invisible.** Right-aligned at (1860,80), 13 px (`:1128`); the doom ticker is at x=1634–1880, y=40–136 (`timeline.js:76-79`) and is drawn after the scene (`timeline.js:64`). The crop shows only an 8 % ghost through the black paper. This is the one line that tells us all five raters agree; it is lost.
- **Rig, P0: all 10 MIRA hands are missing.** At 121.0 and 122.55 each clone's two sleeves end in rounded white caps; there is no skin hand anywhere. `characters.js:727-728` draws a 7×10 hand at the wrist, so the delivered rig does not match the source. The paddles therefore float at (mx+86,370), not in a hand.
- **Type, P1: `RLHF` covers MIRA-1 and MIRA-2.** 190 px at (300,640) (`:1136`) spans x=290–830; the clones are at x=300 and 630. At 121.0 their bodies from waist to chest are blue type. The title is the hero, but it hides 2/5 of the panel.
- **Type, P1: `GOES ASKEW` covers MIRA-4/5 name tags.** 92 px at (1360,980) (`:1141`) spans x=1050–1720, y=870–1030; the tags are at (1290,856) and (1620,856) and are crossed by the word. Move it to y=1030 or x=1500.
- **Continuity, P1: the checks detach when the panel slides.** The 8 checks are drawn **after** the tilt/slide group is restored (`:1125` restore, `:1145` checks), so they are screen-fixed while the clones slide 900 px left. At 124.20 four checks hang in the empty left half. Draw them inside the group (before `:1125`) or move them with `slide`.
- **Layout, P1: the 5th clone is hidden.** MIRA-3 at x=960 is behind SOL at x=960 (`:1097,1118`); only 4 of 5 are visible. The storyboard says five.
- **Motion, P0: 1.40 s under 1.0.** The first half is a held wide; the paddles' circular symmetry hides the spin. Add a 1.00→1.03 push from 120.92 or start the tilt at 121.4.
- **Continuity, P2: the 5th star lags `UNBOUNDED` by 1.5 frames.** Text at 122.52, star at 122.57 (`:1131,1133`); at 122.55 the frame says UNBOUNDED with 4 stars. Swap the thresholds.

## What to copy / what to fix

### Copy

1. **One idea, one giant object, one giant word.** Each shot is a single readable proposition: contract + `TRUST ME` + `APPROVED`; totem + `TRANSFORMERS`; terminal + `DISOBEY`; chinchilla + `CHINCHILLA`; suburb + `BREAKING`; aisle + `100,000`; panel + `RLHF`/`GOES ASKEW`. A viewer can name the shot from any frame.
2. **The type system.** One display voice per shot (Permanent Marker, Anton, Archivo Black, Instrument Serif) at 66–190 px, plus one mono (DMMono) at 10–16 px for texture. The size jump is 6:1–12:1; that is the film's signature. A second face is used only as a small counterpoint (`just` in Instrument Serif italic, `GPUS` in Archivo Black). Keep `TY.type`'s per-character boil at 12 Hz (`type.js:48`) — it makes paper type feel printed, not vector.
3. **The paper palette with one accent per shot.** Cream/ink as the base, one saturated accent: red stamp, gold tower, acid terminal, gold chinchilla, red `BREAKING`, acid GPUs, blue RLHF. Never two accents of equal weight.
4. **Hard cuts with a 1-frame flash.** 4 of 7 ins have a 25–35 % cream flash for 0.16–0.20 s; the cuts read as impacts, not edits. The three without an in-flash (`trust`, `chinchilla`, `gpus`) are value jumps (jazz blue→black, cream→gold, green→black) that do not need one.
5. **The subtitle as a paper sticker.** A torn ink card at (66,948), 62 px tall, with a `LYRIC` label, a red rec dot, the active word in acid, and a progress hairline (`type.js:185-224`). It is word-synced to 0.02 s and never covers a face.
6. **The doom ticker as a continuous global layer.** `P(DOOM)` at 1634,40, 3.5 Hz text, a 70 px bar, a tiny flower (`timeline.js:74-92`). It gives every shot a changing number for free — but it owns x>1600/y<140 (see fix 2).
7. **The lateral scroll engine.** `fences` is the best motion in G: 320→660 px/s, 8 houses at 420 px pitch, a 0.25× sun parallax, a rolling cube, 7 splinters per fence. Copy the **structure** (world scroll + parallax + one rolling hero) even if you change the content.
8. **The tilt-and-slide metaphor.** `rlhf` tilts the world 0.13 rad while the UI stays upright, then slides the world 900 px out from under the stars. It is a better “goes askew” than a shake, and it is one transform (`act4.js:1089-1091`).
9. **The per-shot palette/value jump.** `trust` is 90 % black, `disobey` is 90 % cream, `gpus` is 90 % near-black, `rlhf` is 90 % white. The cuts land because the values are far apart.
10. **The small mono jokes.** `PAGE 1 OF 1`, `policy: overridden`, `reward model: confused`, `layer 01 → 04`, `POWER 1.21 GW`, `RATER AGREEMENT: 5/5`. They are 10–13 px and reward a second look; keep them, but keep them out of collisions.

### Fix

**P0 — the film is not shippable without these**

1. **Hands.** In `trust`, MIRA's extended hand is ≈70 px from the cuff and SOL's far hand ≈70 px; in `disobey`, SOL's two hands are 120–240 px inside her T-posed sleeves; in `rlhf`, all 10 MIRA hands are absent. Target: hand center ≤8 px from the cuff, elbow gap ≤2 px, every visible arm ends in a hand. Check at 2× on `trust` 109.75, `disobey` 114.90, `rlhf` 121.00.
2. **Type safe areas.** Reserve x=1600–1880, y=30–140 for the doom ticker; move `RATER AGREEMENT: 5/5` to x≤1580. No display type over a face: `PAW` (1140) is behind SOL's head; `THERMAL EVENT` loses its T; `POWER 1.21 GW` loses `POW`; `RLHF` covers MIRA-1/2. Target: zero text pixels inside a face box, zero text under the ticker.
3. **The house wrap.** `fences` 117.91: 420 px teleport + full hue swap in one frame. Use a 1680 px colour period, or 10 houses with a 1680 px wrap, or hide the wrap behind `BREAKING`. Target: no hue change >10° and no translation >1 px between consecutive frames except a cut.
4. **Impact contact.** `fences` CRUNCH is 200–800 px ahead of the cube; the fences break 86–103 px before the cube reaches them. Put the burst at the cube's x (560) and trigger the break when `fx` overlaps 512–608. Target: burst center ≤80 px from contact, break frame = contact frame.
5. **The chinchilla's mouth.** Add a mouth and two cheek pouches at (760,730); route the 14 cards to end within 30 px of the mouth; inflate the cheeks 1.0→1.25 over 0.4 s. The current shot has no mouth and the cards never reach the face.
6. **The 0.2 s hole at 116.50–116.68.** Keep the squashed SOL until the cube is visible, or start the cube at lt 1.35 and cross-fade 0.1 s. Target: no frame with neither SOL nor cube in the lower right.

**P1 — the film reads soft without these**

7. **Camera.** 5/7 shots are locked (`trust`, `tower`, `disobey`, `chinchilla`, `gpus`); `fences` has a lateral track and `rlhf` a tilt/slide. Add: `trust` push 1.00→1.06 over 2 s; `tower` tilt 0.10 rad + y 540→760 over 1.8 s; `disobey` snap 1.00→1.16 at 114.33 (promote the local scale to a camera); `chinchilla` pull 1.06→1.00 over 1.9 s; `gpus` dolly x 960→1040 or z 1.00→1.04. `fences` already has a lateral track; `rlhf` already has tilt/slide.
8. **The 100,000 hold.** 0.88 s of a frozen hero number. Overshoot to 100,042 at 120.30, settle to 100,000 at 120.45, then a 2-frame digit flicker at 120.70. Target: no numeric hold >0.3 s.
9. **The trust stamp.** Start at 1.35×, land at 1.0 in 0.10 s, and clip to the contract (680–1250, 460–860). At 110.70 the 2.5× stamp covers both characters.
10. **`just`.** Move it to y=120, ink, 36 px; it is currently inside the 172 px title and invisible after 109.60.
11. **The `CLICK` lifetime.** End the burst at 114.53 (source) or 114.60; it currently survives to 115.07 and competes with `DISOBEY`.
12. **The RLHF checks.** Draw them inside the tilt/slide group so they travel with the clones; at 124.20 four checks are in the empty left half.
13. **The fences set.** Build the 4 promised fence types (picket, traffic barrier, SAFETY tape, chain-link); all 4 are currently the same white picket.
14. **The fences ground grid.** Pass `scroll` to `floorPlane`, not `t`; the grass lines are static while the houses move.
15. **The chinchilla silhouette.** Add a tail and a muzzle; the current 2-ear round body reads as a bunny.

**P2 — polish**

16. **`ATTENTION`** 16 px at −.42 rad is unreadable; delete it or make it 24 px ink.
17. **`BREAKING`** is static; scroll it 40 px/s or type it on.
18. **The tower's top SOL** has 70 px of headroom; either crop it deliberately or pull the tower down 40 px.
19. **The flag** should not rotate with the cube; draw it after the cube's restore, upright.
20. **The 5th star** should fill on the same frame as `REWARD: UNBOUNDED` (122.52, not 122.57).

## Rules for the test version (numbers, not adjectives)

1. **Motion floor.** Per shot, at 192×108/30 fps: **p50 ≥ 1.2**, **p90 ≥ 3.0**, **no run > 0.4 s with mean |ΔY| < 1.0**. G's failures: `tower` 1.73 s, `rlhf` 1.40 s, `trust` 0.80 s (all <1.0); `chinchilla` p50 0.92. `fences` passes with p50 3.6 / min 1.58 / 0 quiet.
2. **Camera in every shot.** At least one of: scale change ≥3 %, translation ≥20 px, rotation ≥0.05 rad, over ≤2 s. Only `rlhf` has a camera-like transform (0.13 rad tilt + 900 px slide) and `fences` a full-frame lateral track; the other 5 have none. `tower` must tilt ≥0.10 rad; `trust` must push ≥1.04.
3. **Hands.** Hand center ≤8 px from the cuff; elbow gap ≤2 px; no T-pose without a hand; a held prop ≤12 px from the palm. G: 2 detached hands in `trust`, 2 in `disobey`, 10 missing in `rlhf`.
4. **Type safe areas.** No text in x=1600–1880, y=30–140 (ticker); no text inside a face box (probe it); no right-aligned stat past x=1580; display type ≥60 px; mono texture ≥10 px. G: 4 collisions (`RATER AGREEMENT`, `PAW`, `THERMAL EVENT`, `POWER`).
5. **Loops and impacts.** A scrolling tile must wrap on a multiple of its colour period: no hue change >10° and no translation >1 px between consecutive frames except a cut. An impact burst must be ≤80 px from the contact, and the break frame must equal the contact frame. G: 420 px/120° house wrap at 117.91; CRUNCH 500 px off at 117.90; fence breaks 86–103 px early.
6. **Number holds.** A numeric hero may hold ≤0.3 s; then it must change (overshoot, flicker, or a second number). G: `100,000` holds 0.88 s.
7. **Cut rhythm.** One hard cut every 1.5–3.5 s; each cut changes mean luma by ≥20 or dominant hue by ≥30°; one 2-frame flash ≤0.35 alpha at each cut. G: 7 cuts in 14.84 s (mean 2.12 s), all hard, 4/7 with an in-flash; all pass on the luma-or-hue test.
8. **Layer count.** Per shot, 3 independent layers that each move ≥1 px per 0.1 s, at least one covering ≥2 % of the frame. G: `fences` 5, `gpus` 5, `rlhf` 5 after 122.3, `chinchilla` 4, `trust` 2, `tower` 1, `disobey` 1 continuous.
9. **Palette discipline.** Base cream/ink + one accent per shot; no more than 2 saturated hues >20 % of the frame; the doom ticker and subtitle are the only global furniture. G passes this (each shot has one accent).
10. **Story-to-picture.** Every storyboard verb must appear as a visible change: “stuffs into cheeks” → a card enters the mouth; “crosses arms” → forearms cross within 0.2 s; “tilts down the tower” → a tilt. G fails 4/7 (`trust` push, `tower` tilt, `disobey` arms, `chinchilla` stuffing).

**The five that matter most:** motion floor (1), camera in every shot (2), hands (3), type safe areas (4), loops/impacts (5).
