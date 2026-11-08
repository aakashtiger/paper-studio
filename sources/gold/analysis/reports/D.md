# Segment D — 58.94–73.80

## Method

- **Source:** `out/claude-pop.mp4`, 1920x1080, 30 fps, 4699 frames, 156.62 s. Segment D is authored 58.94–73.80 = **14.86 s**, six shots.
- **Primary review:** `out/analysis/shots-15/act2-chorus2.png` … `act2-vault.png` — every 2nd frame (15 samples/s), 8-column grid, one cell per sampled frame. Cell counts: 24 / 30 / 25 / 29 / 46 / 69. **Cut review:** `out/analysis/cuts-30/c19-chorus2.png` … `c24-vault.png` — 30 consecutive 30 fps frames at each cut.
- **Motion:** `out/analysis/frame-diff.json` — mean absolute luma difference at 30 fps on a 192x108 reduction, 3x3 region map, per-shot stats. The row index `i` is the **first frame of the new state** and its `t` is `(i+1)/30`, one frame late; I use `i/30` as picture time (the convention in `reports/A.md`). The authored cuts at 58.94, 60.52, 62.52, 64.18, 66.12 and 69.18 fall between frames; the picture cuts on **1769, 1816, 1876, 1926, 1984 and 2076** (58.967, 60.533, 62.533, 64.200, 66.133, 69.200). The frame-diff stats include one frame before each cut because their `t` is one frame late; the counts are unchanged, the ranges are shifted +1.
- **Visual confirmation:** 42 native 1920x1080 frames at 58.94, 59.20, 59.60, 60.00, 60.40, 60.52, 60.60, 61.00, 61.40, 61.80, 62.20, 62.52, 62.60, 62.80, 63.10, 63.40, 63.70, 64.00, 64.18, 64.30, 64.60, 65.00, 65.50, 65.90, 66.12, 66.20, 66.60, 67.20, 68.00, 68.80, 69.18, 69.60, 70.20, 70.90, 71.60, 72.30, 72.50, 72.80, 73.10, 73.40, 73.70, 73.79; plus 4 nearest-neighbour crops (`crop_omega_face.png`, `crop_chorus_face.png`, `crop_basilisk_head.png`, `crop_sub_65.png`). Sheets were not overwritten.
- **Code:** `src/scenes/act2.js` (all six shots), `src/scenes/act3.js` (the chair transition), `src/core.js`, `src/type.js`, `src/characters.js`, `src/props.js`, `src/scene_kit.js`, `src/timeline.js`, `src/lyrics.js`.
- **Caveats.** (1) The 15 fps sheets sample even frames; the cuts are on the frame after the authored time, so the sheets miss the exact cut frame — the 30 fps strips are authoritative for cuts. (2) `frame-diff` underweights small type and small figures: a 100 px figure moving 22 px per 15 fps sample can read as a mean of 1.5 on a 192x108 reduction. Every quiet run below is confirmed visually. (3) The grain floor depends on the background: ~2.5–3.0 in the bright vault, ~1.3 in the dark omega. A 2.9 median in vault is **not** 2× the motion of 1.3 in omega; the sheet is the authority. (4) Grain (24 Hz, `core.js:147-157`), paper-texture offset (2 Hz, `core.js:137-146`), type boil (12 Hz, `type.js:48`), the frame counter (`timeline.js:104`) and the subtitle active-word progress (`type.js:185-224`) change in every shot. They are **not** counted as motion. (5) `STORYBOARD.md` and the code disagree on several camera moves and set events; I list those per shot. The 15 fps sheets and the code agree on the actual motion.
- **Frame counts.** Picture frames: 47 / 60 / 50 / 58 / 92 / 138 = 445, ranges **1769–1815 / 1816–1875 / 1876–1925 / 1926–1983 / 1984–2075 / 2076–2213**. The stats' intervals are one frame earlier (1768–1814 … 2075–2212) because their `t` is one frame late; the counts are the same. The manifest's frame column is 49 / 61 / 50 / 60 / 92 / 140 = 451 (inclusive/rounded). I use the true ranges and the stats' counts.

**Verdict.** Strongest: **basilisk** (60.50–62.50). Median 7.25, p10 5.11, **no frame below 2.5**; six H100 cards on a 1.18 s loop move ~33 px per 15 fps sample, with the serpent sway, sunburst rotation, shards and shake behind them. It is the only shot where continuous motion is also causally tied to the lyric (BOOM at 61.867, one frame before “boom” at 61.88). Weakest: **vault** (69.167–73.80). 4.62 s, 138 frames, **3.2 s of frozen cast**; the `push` variable at `act2.js:995` is computed and never used; the only local motion before 72.4 is the monster's **detached** arm; the 2.9 median is the grain floor, not the cast. The door close (72.4–73.233) and CLANG (72.9) are the only large events, and the CLANG is **10 frames early**. Second weakest: **nvda** — no camera block at all, a static flat composition, and the payoff title is fully visible for only 0.30 s.

## Shot table

### Timing / motion ledger

| # | id | in–out | dur | picture frames | mean | median | p10 | p90 | <0.5 | <1.0 | longest <1.0 | longest <2.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 19 | chorus2 | 58.94–60.52 | 1.58 | 47 (1769–1815) | 10.341 | 5.612 | 3.154 | 16.655 | 0 | 0 | 0 | 0 |
| 20 | basilisk | 60.52–62.52 | 2.00 | 60 (1816–1875) | 8.519 | 7.247 | 5.111 | 9.419 | 0 | 0 | 0 | 0 |
| 21 | nvda | 62.52–64.18 | 1.66 | 50 (1876–1925) | 4.805 | 1.787 | 0.334 | 11.387 | 6 | 10 | 8 | 14 |
| 22 | omega | 64.18–66.12 | 1.94 | 58 (1926–1983) | 4.641 | 1.336 | 0.832 | 11.774 | 0 | 16 | 2 | 23 |
| 23 | gpuplanet | 66.12–69.18 | 3.06 | 92 (1984–2075) | 4.710 | 2.502 | 2.226 | 3.000 | 0 | 0 | 0 | 1 |
| 24 | vault | 69.18–73.80 | 4.62 | 138 (2076–2213) | 3.505 | 2.910 | 1.532 | 5.535 | 0 | 4 | 1 | 2 |

`<0.5` / `<1.0` are counts of diff frames below the threshold; `longest` is a consecutive run in diff frames (picture time is one frame earlier). Two shots never drop below 2.0: **chorus2** and **basilisk**. Two shots spend most of their length below 2.0: **nvda** (34/50) and **omega** (50/58). **gpuplanet** is the opposite failure: 46/92 frames sit in a narrow 2.0–2.5 band — a constant low-level hum, no contrast. **vault** looks “alive” at 2.9 only because the grain floor is high; the cast is frozen.

### Content / staging

| # | id | set, cast, props | type | camera | transition out |
|---|---|---|---|---|---|
| 19 | chorus2 | arena: cobalt sky, 120 stars, outline sun, truss, 5 beams, floor at 820, 22 crowd silhouettes; SOL 1.34 at 1400,1006; 5 backing idols at 560–1080, scale .6; doom thermometer at 250,1000 | `P(DOOM)` 276 px chrome-gold at 300,480; `61%` 150 px acid at 940,640; `LOW-ANGLE HERO SHOT` 13 px; subtitle | 960,570; z 1.05→1.09 (4%); shake 8 px for lt<.35 then 2; **no low angle** | cream flash 60.44–60.52; cut 1816 |
| 20 | basilisk | cracked red stage, sunburst, 7 cracks, gold lip; 9-segment crowned serpent, head at 1015,505; SOL .46 at 930,442; MIRA .85 at 350,1002; 6 H100 cards; 20 shards | `BASILISK` 116 px at 92,300; `SERPENT / 9 SEGMENTS / CROWNED`; `BOOM` burst at 720,730; `OFFERING: 8x H100` | 960,540; z 1.02; shake 8 px; **no tilt** | cream flash 62.37–62.52; cut 1876 |
| 21 | nvda | green space, 120 stars, moon at 1510,280 r=155; 20-candle chart 220,300,1300x480; 9 green stair parallelograms; ticker; MIRA astronaut .7 at 1150,580; SOL .52 climbs 1050,800→1420,480 | `NVDA` 300 px chrome-green at 100,420; `TO THE MOON` 104 px acid at 112,570; `NVDA +420.69% ▲ MKT CAP: MOON` | **none** — no `setCam` / `beginCam` / `endCam`; static flat composition | mint flash 64.02–64.18; cut 1926 |
| 22 | omega | violet space, 220 stars; 4 spiral galaxies (120 dots each) at 960,590; glowing point at 960,590; SOL 1.25 at 960,1006 | `OMEGA` / `POINT` 180 px at 100,288/448; circular text r=320, 26 px; `it's coming soon` 30 px | 960,520; z 0.96→1.12 (16.7%, **in only**); r=0 | cream flash 65.96–66.12; cut 1984 |
| 23 | gpuplanet | teal space, 170 stars, 5 nebula blobs; H100 planet 3.0 at 1090,650; 3 gold ring ellipses; SOL .55 at 630,640; 22 orbiting zeros; counter card 100,260,580x200; doom meter at 1790,980 | `1.0 × 10³⁰` 108 px; `FLOPS / SECOND`; `SPEC SHEET: GPU-Ω / 1.21 GW`; `ORBIT 04 / INFERENCE` | 960,550; z 1.08→1.0→1.08; **no orbit**, no push to the counter | cream flash 68.92–69.18; cut 2076 |
| 24 | vault | dusk mesa, 3 layers, floor at 840; vault body 1180,460 760x650, door r=330; monster at 1180,480; SOL .9 at 545,1004; 3 dancers .5 at 190/302/414, y=992; sticker, captions, disclaimer | `SAFE ENOUGH` 58 px; `we reckoned` 26 px; `DO NOT OPEN. WE MEAN IT.`; `CLANG!` 62 px | 900,540; z 1.0→1.08 (8% over 4.62 s); **no orbit**, no back-wall reveal | gold flash 73.48–73.80; cut 2214 (chair) |

## Per-shot anatomy

### 19 · chorus2 — 58.94–60.52 · 1.58 s · 47 f (1769–1815)

- **Set / cast / props:** arena (`drawArena`, `scene_kit.js:529-545`): navy gradient `#071334→#0A0B1E`, 120-star field, outline sun at 960,440 r=500, two trusses, five light beams, floor at 820, 22 crowd silhouettes (`props.js:95-119`). SOL at 1400,1006 scale 1.34; five backing idols at 560/690/820/950/1080, y=1000, scale .6 (`act2.js:705`); paper doom thermometer at 250,1000 scale 1.3 (`characters.js:905`). No pyro, no pumps, no confetti — the storyboard's “pyro” and “two pumps” are absent.
- **Camera / transition:** `setCam(960, 570, 1.05 + seg(lt,0,1.58)*.04, 0, lt<.35?8:2, t)` (`act2.js:702`) — a 4% push, no rotation, no low angle. In: the cage's cream flash (`act2.js:694`, 58.50–58.94) then hard cut at 1769 (58.967). Out: cream flash from lt>1.5 = 60.44 (`act2.js:720`), last chorus2 frame 1815 (60.500), first basilisk 1816 (60.533). The `c19` strip shows the cage's cream wash over frames 2–15 and a clean cut into the arena; the `c20` strip shows the last chorus2 frames (13–15) washed cream.
- **CONTINUOUS (per 0.0667 s):**
  1. Main idol bounce `-22|sin(beat·π)|` + sway `8 sin(beat·π)`; 88 BPM = 0.6818 s, so the bounce peaks ~2.3 times in 1.58 s; 22 px at the peak, ~11 px/sample.
  2. Five backing idols bounce 12 px / sway 4 px, phase +.14 beat each (`act2.js:8-19`); their flower heads pulse 4.5% at the beat (`characters.js:137-138`).
  3. Crowd bob 10 px on 22 silhouettes, phase +.6 rad; phone lights on every 5th (`props.js:100-115`).
  4. Doom ticker `48.5%→61.0%` over 58.94–59.5, then 61.0; the bar fills; the tiny flower is static (`timeline.js:74-92`).
  5. Camera push 4% (1.05→1.09).
  6. 120-star twinkle (0.7–2.3 Hz) and 12 Hz type boil on `P(DOOM)`/`61%`.
  7. Grain 24 Hz + paper offset 2 Hz (not counted).
- **DISCRETE:**
  - 58.967 (1769): cut in; the cut itself is diff **161.4** (the largest change in the shot). `P(DOOM)` type-on starts; `61%` is already on at full scale — a hard pop.
  - 59.000–59.300 (1770–1778): the type-on spikes 16–18, the largest **within-shot** changes; the dance median is 5.6.
  - 59.42: `P(DOOM)` fully on (7 chars, 6 × .03 + .3 s).
  - 60.44 (1814): cream flash starts.
  - 60.50 (1815): last chorus2 frame; first basilisk 1816 (60.533).
- **Dead / soft runs:** none under 2.0; one frame at 59.5 under 2.5; two frames at 59.9–59.93 under 3.0. Median 5.61, p10 3.15 — the only shot with no quiet run. The 15 fps sheet shows the dance in every cell; the largest changes are the cut (1769), the type-on (59.0–59.4) and the flash (60.44).
- **3+ moving layers:** yes — main idol, five backing idols, crowd, ticker, camera, type boil. The dance is the floor; the type-on is the ceiling.
- **Authored detail a recipe would miss:** five flower/color pairings (daisy/pink, poppy/blue, tulip/gold, corn/green, mari/orange, `act2.js:5-6`); the gold chrome `P(DOOM)` gradient with per-character scale .55→1.0 (`type.js:61-89`, `act2.js:713-717`); the paper thermometer's red column, tick marks and “61.0%” label (`characters.js:905-950`); the “LOW-ANGLE HERO SHOT” caption as a meta joke; the crowd phone lights; the truss/beams.
- **Flaws:**
  - **The near arm crosses the face.** `armR: [2.5, .2]` (`act2.js:708`) sends the right upper arm up-left across the mouth/nose; the forearm disappears behind the hair and the hand is never visible. The `crop_chorus_face.png` shows the white sleeve with the red racing stripe over the mouth in every frame. The star eyes are visible, the “sing” mouth is not. This is the strongest single flaw in the segment: the hook shot hides the singer's mouth for 1.58 s.
  - **`61%` covers two backing singers' faces.** `TY.type(ctx, '61%', 940, 640, 150, …)` (`act2.js:718`) spans x≈940–1200, y≈520–640; the 4th/5th singers' heads are at x≈950/1080, y≈560–680. The 15 fps sheet shows the acid type over both faces. `audit:type` in this repo would refuse text over a face; the gold standard does not.
  - **Two doom numbers disagree.** The thermometer is hardcoded `61` (`act2.js:711`); the ticker is `doomAt(t)` (`lyrics.js:71-85`). At 58.967 the ticker says **48.5%**, the meter and `61%` say **61.0%**; the ticker catches up at 59.5. For 0.53 s the frame shows a 12.5-point contradiction.
  - **The storyboard's camera and props are missing.** No low angle (r=0), no pyro, no “two pumps”; the push is 4% (1.05→1.09), which is ~0.57% per sample and reads as a static frame. `STORYBOARD.md:151-153` promises all three. It also says `P(DOOM)` is 340 px; the render is 276 px (`act2.js:713`).
  - The five backing singers are identical except color; their arms overlap the neighbours' shoulders and their hands are hidden, so the line reads as linked arms, not five dancers.
  - The main idol's red shoulder cap + white sleeve at the mouth reads as a rolled paper/mic; because the arm crosses the face, the silhouette is ambiguous.

### 20 · basilisk — 60.52–62.52 · 2.00 s · 60 f (1816–1875)

- **Set / cast / props:** red cracked stage (`act2.js:730-736`): gradient `#B92A16→#5A0D09`, 24-ray sunburst rotating `t*.1`, floor at 820, 7 black cracks, gold stage lip. Nine-segment crowned serpent (`act2.js:738-778`): body from 1220,1000 to 1020,500, alternating green/greenD blobs, mint belly arcs, head at 1015,505 rotated −.2, gold eye, three fangs, red forked tongue, gold crown at 1079,429. SOL .46 at 930,442; MIRA .85 at 350,1002; six H100 cards; 20 paper shards (`paperShards`, `scene_kit.js:132-144`).
- **Camera / transition:** `setCam(960, 540, 1.02, 0, 8, t)` (`act2.js:728`) — fixed x/y/z, 8 px shake at 71/63 rad/s, **no tilt**. In: hard cut from chorus2's cream flash at 1816 (60.533); the first frame diff is 44.1. Out: cream flash from lt>1.85 = 62.37 (`act2.js:802`), last basilisk 1875 (62.500), first nvda 1876 (62.533); the last three frames diff 19.6/20.9/20.4. The `c20` strip shows the hard cut at frame 15; `c21` shows the cream wash at frames 11–15.
- **CONTINUOUS (per 0.0667 s):**
  1. Six H100 cards: `u = frac(lt*.85 + i/6)` (`act2.js:786-790`); each card travels (390,850)→(980,560) in 1.176 s, six staggered; ~33 px/sample horizontally, 16 px/sample vertically, rotating `u*7` (~23°/sample). **The strongest layer in the segment.**
  2. Serpent body sway `sin(t*.55 + i*.7)*12` (`act2.js:741`); ±12 px at 0.55 rad/s, ~0.9 px/sample; the head itself is static.
  3. Sunburst rotation `t*.1` (`act2.js:732`); 0.76°/sample; the rays at r=1200 move ~16 px/sample at the edge.
  4. 20 paper shards pulse `sin(t*2+i)` radial (`scene_kit.js:136`); 2 rad/s, ~10–20 px/sample.
  5. Camera shake 8 px at 71/63 rad/s; aliases at 15 fps but visible as a jitter.
  6. SOL's hair sway and halo pulse; her pose is static. MIRA is completely static.
  7. 12 Hz type boil on `BASILISK` / `BOOM`.
- **DISCRETE:**
  - 60.533 (1816): cut in; no title yet.
  - 60.900–61.325: `BASILISK` types on (8 chars, 7 × .025 + .25 s); at 60.9 only the first char.
  - 61.867 (1856): `BOOM` burst pops at 720,730 r=155 (`act2.js:800`); the lyric “boom” starts 61.88 — **one frame early**, excellent word sync.
  - 62.370 (1872): cream flash starts.
  - 62.500 (1875): last basilisk frame; first nvda 1876 (62.533).
- **Dead / soft runs:** none under 2.5; two single frames at 61.533 and 61.933 under 3.0. Median 7.25, p10 5.11, p90 9.42 — the most consistent motion in the segment. The 15 fps sheet shows a card in a different position in every cell.
- **3+ moving layers:** yes — six cards, serpent sway, sunburst, shards, shake, type boil. The cards are the only strong layer; the rest are 1–3 px/sample.
- **Authored detail a recipe would miss:** the nine-segment body with alternating green/mint belly arcs (`act2.js:738-751`); the gold crown with red jewels (`characters.js:556-562`); the forked red tongue and three fangs (`act2.js:769-775`); the single gold eye with a black slit and cream catchlight (`act2.js:765-767`); the H100 cards with two 7-blade rotors and acid “H100” (`scene_kit.js:460-474`); the “SERPENT / 9 SEGMENTS / CROWNED” and “OFFERING: 8x H100” captions; the 7 cracks; the gold lip.
- **Flaws:**
  - **SOL floats above the head.** `idol(ctx, 930, 442, .46, …)` (`act2.js:780`) places her feet at 442; the head is rotated −.2 and its visible top is ~433–440, but the `crop_basilisk_head.png` shows a ~25 px gap between her boots and the green skull, with no shadow and no contact. She is also not parented to the head, so as the body sways she stays fixed. The storyboard says “SOL surfs the serpent's head”; the render is a hover.
  - **The crown floats above the skull.** `ctx.translate(64, -76)` (`act2.js:777`); the head's top is at local −72, the crown's base at −76, and the −.2 rotation opens a visible ~20 px gap. The crop shows the gold crown detached above the head.
  - **A GPU card covers the serpent's eye for most of the shot.** The card path passes through (980,560), the eye is at ~(964,497); the cards are drawn after the head (`act2.js:786-790`), so the H100 card sits on the eye. The `crop_basilisk_head.png` (61.80) shows the eye completely hidden. The basilisk's defining feature — its gaze — is never clearly visible; the cards are always crossing it.
  - **`OFFERING: 8x H100` vs 6 cards.** The loop is `i < 6` (`act2.js:786`); the caption says 8x (`act2.js:801`). A count contradiction on screen for the whole shot.
  - **The `BOOM` is in empty space.** The burst is at 720,730 (`act2.js:800`), between MIRA (350) and the serpent (950+); it is not on the serpent's head or on a card impact. It reads as a floating comic sound effect, not a hit.
  - **The storyboard's camera and set are missing.** No tilt, no crowd, no “BASILISK spelled along the serpent's body” (the type is horizontal at 92,300, `act2.js:795`), no tail whip into the stock chart (the transition is a flash). `STORYBOARD.md:156-161` promises all four.
  - MIRA's throw is not causal: the cards loop independently; her arm is static; no card leaves her hand (`act2.js:785-790`).
  - The serpent's head is a flat green blob with a single eye; the jaw/fangs are thin and partly hidden by the card. At 15 fps the head reads as a green mass.

### 21 · nvda — 62.52–64.18 · 1.66 s · 50 f (1876–1925)

- **Set / cast / props:** green space `#06170F→#0A3325`, 120-star field, moon at 1510,280 r=155 (`scene_kit.js:190-195`), 20-candle chart at 220,300,1300x480 (`scene_kit.js:346-357`), nine green stair parallelograms at 250…1400 (`act2.js:817-822`), ticker at 80,100,620 (`monoStrip`, `scene_kit.js:99-103`). MIRA “astronaut” at 1150,580 scale .7; SOL at 1050,800→1420,480 scale .52; flag pole/pennant.
- **Camera / transition:** **no camera block.** `act2.js:806-848` has no `setCam`, `beginCam` or `endCam`; the shot is drawn in screen space and inherits nothing. The storyboard's “vertical tracking up” does not exist. In: hard cut from basilisk's cream flash at 1876 (62.533); first frame diff 114.2 (the cut + the NVDA type). Out: mint flash from lt>1.5 = 64.02 (`act2.js:846`), last nvda 1925 (64.167), first omega 1926 (64.200); last frames diff 11.4–11.5. The `c21` strip shows the cream wash at frames 8–9 and the type-on over the next 15 frames; `c22` shows the mint wash at frames 11–15.
- **CONTINUOUS (per 0.0667 s):**
  1. SOL climbs `(1050,800)→(1420,480)` over 62.62–63.72 (`u = seg(lt,.1,1.2)`, `act2.js:830-831`); 370 px right, 320 px up in 1.1 s = ~22 px/sample right, 19 px/sample up. **After 63.72 she is static.**
  2. 120-star twinkle.
  3. Halo pulse 4.5% at 88 BPM, hair sway `sin(t*1.8+i)*8` on SOL; her pose is static.
  4. Doom ticker 61.3→61.6.
  5. `NVDA` type-on 62.52–62.97; `TO THE MOON` type-on 63.30–63.85; 12 Hz boil.
  6. Grain 24 Hz (not counted).
- **DISCRETE:**
  - 62.533 (1876): cut in; `NVDA` type-on starts; the ticker is already on.
  - 62.620 (1879): SOL starts climbing.
  - 62.970: `NVDA` fully on.
  - 63.300: `TO THE MOON` type-on starts.
  - 63.720 (1911): SOL reaches 1420,480; the climb ends.
  - 63.850 (1916): `TO THE MOON` fully on; only **0.30 s / 9 frames** before the cut (1916–1924).
  - 64.020 (1921): mint flash starts.
  - 64.167 (1925): last nvda frame; first omega 1926 (64.200).
- **Dead / soft runs:** 34/50 frames under 2.0; 42/50 under 2.5; longest under 2.0 is **63.000–63.433 (14 f, 0.43 s)**; longest under 1.0 is **63.800–64.033 (8 f, 0.23 s)**. The 192x108 diff underweights the climb: the figure is ~100 px tall at full res, ~5 px at 192x108, so a 22 px/sample translation reads as a mean of 1.5. The 15 fps sheet shows the climb (row 1 centre-left → row 3 right). The last 0.23 s is a near-freeze after the flag is planted.
- **3+ moving layers:** yes during the climb (SOL, stars, halo/hair, ticker, type-on); after 63.72 only stars/halo/ticker/boil — the composition is static for 0.45 s.
- **Authored detail a recipe would miss:** the 20-candle chart with red/green bodies and wicks (`scene_kit.js:346-357`); the nine stair parallelograms; the moon's five crater circles; the red pennant with “NVDA”; the `NVDA +420.69% ▲ MKT CAP: MOON` ticker; the chrome-green `NVDA` wordmark; the acid `TO THE MOON`; MIRA's silver hair/trousers/glasses.
- **Flaws:**
  - **No camera block.** `act2.js:806-848` never calls `setCam`/`beginCam`/`endCam`. The shot is a flat side view; the storyboard's vertical track is absent. The character climbs, but the camera does not, so the composition never changes except for the figure.
  - **Two staircases.** The candle chart bars (y 570–825) and the green stair overlay (y 344–760, `act2.js:817-822`) are two separate rising floors. SOL stands on the chart bars, not the overlay; the overlay is an empty, misaligned second staircase. At 15 fps it reads as a staircase behind a staircase.
  - **The flag is not planted on the moon.** SOL ends at 1420,480; the moon is at 1510,280 r=155 (bottom 435); the pole bottom is 480, **45 px below the moon**; the chart bar at x=1420 is at y≈399. The flag floats between the chart and the moon.
  - **MIRA is called “astronaut” but has no helmet/suit.** `coat:false` makes `mira` draw black stick arms (`characters.js:724`), silver trousers/hair and glasses; she reads as a woman in a black tee standing on a candle bar, not a paper astronaut floating. The storyboard says “a paper astronaut MIRA floats” (`STORYBOARD.md:166`).
  - **`TO THE MOON` is fully visible for only 0.30 s.** The type-on starts 63.30, 11 chars × .025 + .3 = 63.85; the cut is 64.167. The payoff title is on screen for 9 frames; at 15 fps that is 4–5 cells, and the last cell is washed by the mint flash.
  - **`NVDA` is incomplete for the first 0.45 s** (62.52–62.97); at the cut-in only the first char is at 0 alpha, so the shot opens on a static ticker and a climbing figure with no readable wordmark.
  - **No paper clouds.** `STORYBOARD.md:164` promises paper clouds; the render has a gradient + stars only.
  - The ticker `+420.69%` is static; no price motion. The `NVDA` wordmark is a stock-chart pun but the chart behind it is static.

### 22 · omega — 64.18–66.12 · 1.94 s · 58 f (1926–1983)

- **Set / cast / props:** violet space `#0B0720→#25114E`, 220-star field, four spiral galaxies of 120 dots each at 960,590 (`act2.js:860-870`), glowing point at 960,590 r=70+8·pulse (`act2.js:877-879`), SOL at 960,1006 scale 1.25, circular text at 960,590 r=320 26 px, `OMEGA`/`POINT` 180 px at 100,288/448, `it's coming soon` 30 px at 100,540.
- **Camera / transition:** `setCam(960, 520, kf(lt, [[0,.96],[1.94,1.12]]), 0, 1, t)` (`act2.js:856`) — a single 16.7% push **in**, no zoom out. The storyboard says “slow zoom out, then in” (`STORYBOARD.md:172`). In: hard cut from nvda's mint flash at 1926 (64.200); first frame diff 69.0 (the cut + the type pop). Out: cream flash from lt>1.78 = 65.96 (`act2.js:890`), last omega 1983 (66.100), first gpuplanet 1984 (66.133); last frames diff 28.7/28.0/28.5. The `c22` strip shows the mint wash at frames 6–7, then the full `OMEGA`/`POINT` on the first omega frame; `c23` shows the cream wash at frames 11–15.
- **CONTINUOUS (per 0.0667 s):**
  1. Camera push 0.96→1.12 (16.7% over 1.94 s); 0.57%/sample; the character's edge moves ~4 px/sample.
  2. Four galaxy spirals rotate `t*.15` (`act2.js:861`); 0.15 rad/s, ~0.57°/sample; at r=300, ~3 px/sample.
  3. Circular text spins `t*.16` (`act2.js:881`); 0.16 rad/s, ~0.61°/sample; at r=320, ~3.4 px/sample.
  4. Halo pulse 4.5% at 88 BPM; the point pulses 8 px at 88 BPM; hair sway.
  5. Doom ticker 61.6→62.2.
  6. Expanding rings 65.70–66.10 (`act2.js:885-889`): four rings, radius `u*(200+i*130)`, 15–30 px/sample.
  7. 220-star twinkle.
  8. 12 Hz boil on the type; `it's coming soon` fades in 65.38–65.98.
- **DISCRETE:**
  - 64.200 (1926): cut in; `OMEGA`/`POINT` are **fully on** at the cut — no per-character type-on, unlike `P(DOOM)`, `BASILISK`, `NVDA`. A hard pop.
  - 64.58–64.76: lyric “Omega” active; 64.68–65.26 “Point's”.
  - 65.38: `it's coming soon` starts fading in; fully 65.98.
  - 65.70 (1971): expanding rings start.
  - 65.96 (1979): cream flash starts.
  - 66.100 (1983): last omega frame; first gpuplanet 1984 (66.133).
- **Dead / soft runs:** 50/58 frames under 2.0; 52/58 under 2.5; longest under 2.0 is **64.267–65.000 (23 f, 0.73 s)**; under 1.0 there are 16 frames. The body is static; the push/halo/galaxies/circular text are real but slow. The 15 fps sheet looks nearly identical because the push is 0.57%/sample. This is a slow push on a static poster, not a freeze — but it is the least eventful of the three space shots.
- **3+ moving layers:** yes — camera, galaxies, circular text, halo/point pulse, rings, stars; all are slow; the body is static.
- **Authored detail a recipe would miss:** the 480-dot galaxy field (4 colors, 120 each, radii 20–686 across four arms, alpha .22–.72, `act2.js:862-867`); the circular text at r=320 with `start:-π*.9`, `span:TAU*.94` (`act2.js:881`); the `OMEGA`/`POINT` two-line type with violet/cream edges; the pink serif `it's coming soon`; the expanding rings; the 220-star field.
- **Flaws:**
  - **The near arm crosses the face.** `armR: [2.55, .2]` (`act2.js:874`) sends the right arm up-left across the mouth/nose; the `crop_omega_face.png` shows the white sleeve with the red racing stripe from the right shoulder to the left cheek, the hand hidden behind the hair. The “arms wide” pose is an X across the chest/face; the closed-eye, singing face is half-covered. This is the same sign-convention bug as chorus2.
  - **The camera only pushes in.** `act2.js:856` has no zoom-out key; the storyboard's “zoom out, then in” is not implemented. The 15 fps sheet shows a continuous growth, not a pull-back then push.
  - **The galaxies rotate but do not spiral into the point.** The dots are at fixed radii (`act2.js:862-867`); there is no inward motion. The storyboard says “spiral into a single point” (`STORYBOARD.md:171`); the render is a rotating dust cloud around the torso.
  - **The glowing point is at the waist, not the chest.** `py=590` (`act2.js:859`); the character's chest is ~430–500, the waist ~672. The point reads as a glowing belt buckle.
  - **The circular text is illegible over the head/halo.** 26 px letters at r=320, cream on a cream halo/hair; the ring is 640 px wide. At 15 fps it reads as scattered letters, not “THE OMEGA POINT”.
  - **The type language is inconsistent.** `OMEGA`/`POINT` pop on at the cut with no type-on, while `P(DOOM)`, `BASILISK` and `NVDA` type on. The film's signature effect is missing from the shot that most needs a reveal.
  - The storyboard's “hair floating” is a subtle sway; the body is static. The “point expands → GPU planet” is a set of rings + a flash, not the point itself expanding.

### 23 · gpuplanet — 66.12–69.18 · 3.06 s · 92 f (1984–2075)

- **Set / cast / props:** teal space `#06282B→#061416`, 170-star field, five teal nebula blobs, H100 planet at 1090,650 scale 3.0 (`act2.js:905-907`), three gold ring ellipses (`act2.js:909-912`), SOL .55 at 630,640, 22 orbiting zeros, counter card at 100,260 580x200, `ORBIT 04 / INFERENCE` at 1500,260, doom thermometer at 1790,980 scale .9.
- **Camera / transition:** `setCam(960, 550, kf(lt, [[0,1.08],[1.2,1.0],[3,1.08]]), 0, 1, t)` (`act2.js:902`) — pull back then push in (8% each), **no orbit**, no push to the counter. The storyboard says “orbit, then push to the odometer” (`STORYBOARD.md:179`). In: hard cut from omega's cream flash at 1984 (66.133); first frame diff 120.8 (the cut + the counter). Out: cream flash from lt>2.8 = 68.92 (`act2.js:932`), last gpuplanet 2075 (69.167), first vault 2076 (69.200); last frames diff 12.9/12.7/12.1/11.9. The `c23` strip shows the omega frames 0–9, cream wash 10–15, then the GPU planet; `c24` shows the GPU frames 0–7, cream wash 8–15, then the vault.
- **CONTINUOUS (per 0.0667 s):**
  1. Two GPU fan rotors at `t*±2` rad/s (`scene_kit.js:468-470`); seven blades each; 7.6°/sample; the blade tips (r=96 px) move ~13 px/sample. **The only strong layer.**
  2. 22 zeros orbit `t*.3` (`act2.js:918-921`); 0.3 rad/s, ~1.15°/sample; at r=720, ~14 px/sample.
  3. Camera pull back then push in (8% each).
  4. 170-star twinkle.
  5. Doom ticker 62.2→63.4.
  6. SOL's hair sway/halo pulse; she is otherwise static.
  7. Grain 24 Hz (not counted).
- **DISCRETE:**
  - 66.133 (1984): cut in; the counter card and GPU are fully on.
  - 67.333 (2020): camera reaches z=1.0 (the widest); the only frame under 2.0.
  - 68.920 (2068): cream flash starts.
  - 69.167 (2075): last gpuplanet frame; first vault 2076 (69.200).
  - **No other discrete events.** No digit spin, no zero overflow, no pose change, no type-on. The shot is a still image with spinning fans.
- **Dead / soft runs:** 46/92 frames under 2.5; one frame under 2.0 (67.333); the diff sits in a narrow 2.0–3.0 band for 82/92 frames. The fans are real, but the composition is static. The 15 fps sheet shows the fan blades in different angles and the package zooming; the counter, ring, `H100` and SOL do not change.
- **3+ moving layers:** yes — fans, zeros, camera, stars, ticker, halo; the fans are the only strong layer; the zeros are 14 px/sample but low-contrast.
- **Authored detail a recipe would miss:** the 3.0-scale H100 package with two 7-blade rotors, silver ring and acid `H100` (`scene_kit.js:460-474`); the three gold ellipses; the 22 zeros; the torn counter card with `1.0 × 10³⁰`, `FLOPS / SECOND`, `SPEC SHEET: GPU-Ω / 1.21 GW` (`act2.js:924-929`); `ORBIT 04 / INFERENCE`; the glass thermometer at 68%; the five nebula blobs.
- **Flaws:**
  - **The counter card decapitates SOL.** The card spans x=100–680, y=260–460 (`act2.js:924-929`); SOL is at 630,640, scale .55, so her head centre is at ~630,308. The card covers her head and torso for the whole 3.06 s; the 15 fps sheet shows only her skirt and legs below the card. This is the worst layout collision in the segment.
  - **`1.0 × 10³⁰` overflows its card.** 108 px DMMono at x=34 (`act2.js:926`); the string is ~650 px wide, the card 580 px. The last `0` sits at x≈690, on the GPU package, outside the torn edge. A card audit (text width ≤ inner width) would fail it.
  - **SOL is not sitting on the edge.** Her feet are at 640; the GPU's left edge is ~640–700; her legs are spread but static (no swing). The storyboard says “sits on the edge swinging legs” (`STORYBOARD.md:180`); the render is a static floating pose, half-hidden by the card.
  - **The ring passes over the fans.** The ring is drawn after the GPU (`act2.js:909-912`), so all three ellipses are on top of the package; there is no back-half occlusion. It reads as a wireframe ellipse stuck on the fans, not a planet ring.
  - **The counter is static.** No digit spin, no zero overflow; the “odometer” is a still number. The storyboard's “digits spin; zeros overflow like gumballs” (`STORYBOARD.md:180`) is not implemented.
  - **The doom meter says 68.0% while the ticker says 62.2–63.4%.** The meter is hardcoded `68` (`act2.js:931`); the ticker is `doomAt(t)` (`lyrics.js:71-85`). A 5–6 point contradiction for 3.06 s.
  - **No orbit, no push to the counter.** `act2.js:902` only changes z; x/y/r are fixed. The storyboard's camera move is absent.
  - The GPU package is cut off at the right edge; the composition is right-heavy, the card left-heavy, and the character is lost between them.

### 24 · vault — 69.18–73.80 · 4.62 s · 138 f (2076–2213)

- **Set / cast / props:** dusk mesa `#F6B56B→#7A3C5E`, three mesa layers, floor at 840, gold floor lines; vault body at 1180,460 760x650, door circle r=330 (`act2.js:952-989`); monster at 1180,480 (black blob, four acid eyes, three-finger hand); SOL .9 at 545,1004; three hard-hat dancers .5 at 190/302/414, y=992; `SAFE ENOUGH` sticker at 332,176; caption at 96,266; `we reckoned` at 96,318; `DO NOT OPEN. WE MEAN IT.` card at 1320,900; `CLANG!` at 1000,690.
- **Camera / transition:** `setCam(900, 540, 1.0 + seg(lt,0,4.6)*.08, 0, 2, t)` (`act2.js:949`) — an 8% push over 4.62 s, **no orbit**, no behind-the-vault reveal. The storyboard says “orbit behind the vault: no back wall” (`STORYBOARD.md:186`). In: hard cut from gpuplanet's cream flash at 2076 (69.200); first frame diff 49.2 (the cut). Out: gold flash from lt>4.3 = 73.48 (`act2.js:1017`), last vault 2213 (73.767), cut to chair at 2214 (73.80); last frames diff 6.6/6.1. The `c24` strip shows the GPU frames 0–5, cream wash 6, then the vault.
- **CONTINUOUS (per 0.0667 s):**
  1. Camera push 8% over 4.62 s; 0.11%/sample; ~1 px/sample at the vault edge. **Very slow.**
  2. Monster arm wave `rotate(-.55 + sin(t*5)*.22)` (`act2.js:965`); 5 rad/s, period 1.26 s; 19°/sample; the hand moves ~30 px/sample. **The only strong local motion before 72.4.**
  3. Doom ticker 63.4→65.6.
  4. Grain 24 Hz (not counted); 12 Hz boil on `CLANG!` after 72.9.
  5. The `SAFE ENOUGH` sticker, caption, `we reckoned` and disclaimer are **static** (no time passed to `TY.text`/`TY.sticker`).
- **DISCRETE:**
  - 69.200 (2076): cut in; the door is open; the monster is visible.
  - 70.900 (2127): `we reckoned` starts fading in (`lt>1.7`); fully 71.38.
  - 72.400 (2172): door close starts (`lt=3.2`, `C.easeIn` over 0.85 s).
  - 72.900 (2187): `CLANG!` pops (`lt>3.72`) while the door is only ~23% closed.
  - 73.233 (2197): door fully closed (`lt=4.05`).
  - 73.500 (2205): gold flash starts.
  - 73.767 (2213): last vault frame; cut to chair at 73.80.
- **Dead / soft runs:** 27/138 frames under 2.0; 48/138 under 2.5; the longest under 2.0 is only 2 frames. The diff's median 2.91 is **the grain floor plus the 8% push**, not the cast: SOL and the three dancers do not change pose for 3.2 s. The 15 fps sheet rows 1–6 (the first 3.2 s) are nearly identical; only the monster's arm and the `we reckoned` fade change. The door close/CLANG is the only large event (diff 7.36 at 73.233).
- **3+ moving layers:** before 70.9: arm wave, camera push, ticker, grain — the cast is frozen. After 72.4: door, arm, camera, CLANG, flash. The shot has 3+ layers but only one strong local layer before the door.
- **Authored detail a recipe would miss:** the vault door's 20 hazard blocks, 12 silver bolts, 8 spokes, 4 concentric rings, gold hub and `VAULT 07` label (`act2.js:972-989`); the monster's four acid eyes and three-finger hand; the `SAFE` / `VAULT 07` labels; the three mesa layers; the `DO NOT OPEN. WE MEAN IT.` card with a 9 px legal line (`act2.js:1003-1006`); the `SAFE ENOUGH` sticker; the `we reckoned` serif echo; the three dancers' flower heads; the gold floor lines.
- **Flaws:**
  - **The first 3.2 s are a frozen tableau.** 69.167–72.400 (96 frames) — SOL and the three dancers never change pose. The `push` variable is computed at `act2.js:995` and **never used**; the door moves independently and her hands lose contact as it slides. The 15 fps sheet rows 1–6 are the same cast with a waving arm. The only local motion is the monster's arm; the 2.9 diff is the grain floor plus the 8% push.
  - **The monster's arm is detached.** The arm is drawn at `translate(210,-30)` (`act2.js:965`), starting at 1390,580; the blob is at 1180,480 radius ~90, so its right edge is ~1270 — a **120 px gap**. It reads as a floating black stick with a hand, not an arm on the monster. At 73.1 it is still visible outside the closing door.
  - **The three dancers are half SOL's scale.** `.5` vs `.9` at the same ground line (`act2.js:996-1001`); they read as children/mini-SOLs, not backup dancers. A 44% scale difference at the same depth is a staging error.
  - **The subtitle band cuts the cast's ankles.** `TY.subtitle` is at y=992, height 62 (`timeline.js:60`, `type.js:185-224`); the dancers' ground is 992, SOL's 1004. The band (948–1010) covers their ankles; their blue shoes peek out below it, detached. The contact with the floor — the point of the push — is hidden in every frame.
  - **`CLANG!` is 0.33 s early.** It triggers at `lt>3.72` = 72.900 (`act2.js:1012-1016`); the door closes at `lt=4.05` = 73.233. At 72.9 the `easeIn` close is only ~23%, so the burst pops while the door is still mostly open. It should be within ±2 frames of 73.233.
  - **The `SAFE` label migrates onto the door.** `TY.text('SAFE', 0, 250, …)` is drawn after the door inside the vault body (`act2.js:992`); at 69.167 it sits on the open interior, at 73.7 it sits on the closed door. A static label appears to move with the door.
  - **The storyboard's camera and action are missing.** No orbit, no behind-the-vault/no-back-wall reveal, no high-five, no unrolling disclaimer (the card is static). `STORYBOARD.md:186-188` promises all four. The `we reckoned` is 26 px, not the storyboard's 18 px legal type.
  - The door handle at 930,460 (close=0) is 140 px right of the door centre, away from SOL's hands at ~700; the push contact is on the rim, not the handle.
  - The monster is a black blob with four acid dots and no pupils; it reads as cute, not threatening. The “glowing monster” is an interior radial glow, not the monster itself.
  - The dancers' arms overlap the next dancer's face; their hands are hidden. The line reads as linked arms, not three pushers.

## What to copy / what to fix

### Copy (the parts that are doing real work)

1. **Per-character type-on with a chrome gradient** (`type.js:28-100`; `act2.js:713-717`, `837-845`). `P(DOOM)` types on from .55 scale/0 alpha to 1.0 over 0.3 s per char, 0.03 s stagger, gold chrome, 12 Hz boil. It is the film's signature and the largest **within-shot** change in chorus2 (16–18 at 59.0–59.3, against a 5.6 median; the cut itself is 161.4). Copy the timing and the chrome.
2. **One rig, five palettes** (`act2.js:5-19`, `705`). Five backing singers share one idol rig but swap flower + jacket color. The silhouette is unified, the color varies; it makes a chorus line from one asset.
3. **A diegetic doom meter** (`characters.js:905-950`; `act2.js:711`, `931`). The paper thermometer is a prop in the world, not a HUD; it carries the film's thesis. Copy the prop, but drive it from `doomAt(t)`.
4. **The segmented paper creature** (`act2.js:738-778`). Nine green blobs with alternating mint belly arcs, a crown, a forked tongue, three fangs and a single gold eye. Copy the “blob segments + belly arc + head detail” construction; fix the crown/eye contact.
5. **The spinning rotor as a motion engine** (`scene_kit.js:460-474`). A 7-blade rotor at 2 rad/s is a cheap, strong continuous layer; it makes the GPU planet move without a character. Copy it for any prop that needs idle motion.
6. **The chart-as-staircase** (`scene_kit.js:346-357`; `act2.js:815-821`). A 20-candle chart becomes a rising floor. Copy the concept, but use **one** staircase and put the character on it.
7. **The layered vault door** (`act2.js:952-992`). 20 hazard blocks, 12 bolts, 8 spokes, 4 rings, a gold hub and a `VAULT 07` label make a prop with a real mechanical read. Copy the layer order (body → rim → rings → spokes → bolts → label) and the hazard pattern.
8. **The torn card + 9 px legal line** (`act2.js:1003-1006`). `DO NOT OPEN. WE MEAN IT.` with a 9 px `legal disclaimer · 6 pt · non-binding` is a strong graphic joke. Copy the torn edge and the tiny secondary line.
9. **Large motion per 15 fps sample.** The motions that survive the 15 fps review are the ones at ≥10 px/sample: the idol bounce (22 px amplitude, ~11 px/sample), the H100 cards (33 px), the door (59–92 px/sample near the end), the fan tips (13 px). The 4–8% pushes and the small arm waves read as static. Copy the “≥10 px per 0.0667 s” rule.

### Fix (ranked by damage)

1. **Arm across the face** (`act2.js:708`, `874`). The `armR` sign is inverted: `+2.5` sends the right arm up-left across the mouth. Use `armR: -2.5`, `armL: +2.5` for a V, or clamp the elbow outside the face box. Affects chorus2 (1.58 s) and omega (1.94 s), 100% of both shots.
2. **Type/card over faces/heads** (`act2.js:718`, `924`). Move `61%` off the 4th/5th singers; move the counter card off SOL's head. No type/card box may intersect a face box.
3. **Contact** (`act2.js:777`, `780`, `965`, `831`, `914`). SOL's feet float 25 px above the basilisk head; the crown floats 20 px above the skull; the monster's arm starts 120 px outside its body; the NVDA flag is 45 px below the moon; SOL is not on the GPU edge. Solve the contacts; no floating.
4. **Camera/storyboard** (`act2.js:806-848`, `856`, `902`, `949`). NVDA has no camera block; omega only pushes in; gpuplanet/vault have no orbit. Either implement the named moves or rewrite the storyboard to the render's actual 4–8% push + shake.
5. **Timing** (`act2.js:1012`, `842`, `800`). CLANG at 72.900 vs door shut 73.233 (10 frames early); `TO THE MOON` fully on for only 0.30 s; `BOOM` at 720,730 is not on the serpent. Tie the burst to the contact/closure; give the payoff title ≥0.7 s.
6. **Dead hold** (`act2.js:995`). Vault 69.167–72.400 is a frozen cast. Use the `push` variable to animate the cast, add the high-five, or cut the shot to ~2.5 s.
7. **Scale** (`act2.js:1000`). Vault dancers are .5 vs SOL .9 at the same ground line; use .72–.78 or move them back.
8. **Subtitle band** (`timeline.js:60`; `act2.js:996-1004`). The band at 948–1010 cuts the cast's ankles. Move it to y=1030 for this shot, or raise the cast to y=960.
9. **Number continuity** (`act2.js:711`, `931`; `lyrics.js:71-85`). Drive the doom meter from `doomAt(t)`; at 58.967 the ticker is 48.5% while the meter/type are 61.0%; at 66.6 the ticker is 62.3% while the meter is 68.0%.
10. **Card overflow** (`act2.js:926`). `1.0 × 10³⁰` is ~650 px wide in a 580 px card; the last `0` sits on the GPU. Reduce to 96 px or widen the card to 650.
11. **Ring depth** (`act2.js:909-912`). Draw the ring's back half before the GPU and the front half after, or mask it.
12. **Storyboard gaps** (`STORYBOARD.md:151-188`). Add or drop: chorus2 low angle/pyro/two pumps; basilisk tilt/crowd/type along the body/tail whip; nvda clouds/vertical track; omega zoom out-then-in/spiral convergence; gpuplanet orbit/digit spin/zero overflow/sitting; vault orbit/no back wall/high-five/unroll/door wipe. The current storyboard promises a camera-driven film; the render is a flat stage with simple zooms.

## Rules for the test version (numbers, not adjectives)

1. **Face clearance.** Face box = head centre ±0.6 × head width. No arm segment, type box or prop may intersect it. The mouth pixel must be visible in **≥90%** of frames. Fail if an arm intersects the face box for **>0.1 s**. (chorus2 and omega fail at 100%.)
2. **Contact tolerance.** Foot-to-surface ≤**2 px**; limb root-to-body ≤**2 px**; prop base-to-surface ≤**2 px**; flag pole base-to-ground ≤**2 px**. No floating. (basilisk SOL 25 px, crown 20 px, monster arm 120 px, NVDA flag 45 px, GPU SOL at the edge but with no seat/contact pose — all fail.)
3. **Motion floor per 15 fps sample.** ≥**3** independent layers; at least one layer moves ≥**10 px** per 0.0667 s; no run **>0.5 s** where the only change is grain/type boil. (vault 69.167–72.400 fails: only the arm + grain; omega passes only during the 0.4 s ring expansion — the first 1.5 s has no ≥10 px layer.)
4. **Camera contract.** Every shot declares a camera path with x/y/z/r keys. A static camera is allowed only if the storyboard says static. Orbit = x/y/r change; track = y change; push = z change **≥8%**. The path must match the named move. (nvda fails: no camera; omega fails: no out-then-in; gpuplanet/vault fail: no orbit.)
5. **Impact and title timing.** A burst/word must land within **±2 frames** of the contact/closure it names. A title must be fully visible for **≥0.7 s** before the cut. (CLANG at 72.900 vs 73.233 fails by 10 frames; `TO THE MOON` 0.30 s fails; `BOOM` is on time but not on the serpent.)
6. **Type fit.** Card text width ≤ card inner width − 2 × padding; no text over a face; a card may not cover a character's head. (`1.0 × 10³⁰` overflows by ~70 px; the GPU card covers SOL's head for 3.06 s.)
7. **Cast scale.** Two characters on the same ground line must be within **20%** scale unless the shot declares a depth difference. (vault .5 vs .9 = 44% difference, fail; chorus2's .6 backing line is a declared chorus, not a same-depth pair.)
8. **Subtitle safe area.** The subtitle band's top must be ≥**40 px** below the lowest foot/contact. (vault band at 948 vs feet at 992–1004, fail.)
9. **One source of truth per number.** Every on-screen number (doom %, count, score) must be read from the same clock as the ticker; no literal duplicate. (chorus2 48.5 vs 61.0 for 0.53 s; gpuplanet 62.2–63.4 vs 68.0 for 3.06 s; basilisk “8x” vs 6 cards.)
10. **One staircase, one floor.** A set may not contain two competing floors at different heights unless the depth is declared. (nvda chart bars + stair overlay; vault body + floor lip are close but readable.)
