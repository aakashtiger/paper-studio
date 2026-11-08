# Segment A — 0.00–22.72

## Method

- **Source:** `out/claude-pop.mp4`, 1920x1080, 30 fps, 4699 frames, 156.62 s. Segment A = frames 0–681.
- **Primary review:** `out/analysis/shots-15/act1-cold.png` … `act1-chase.png` — every 2nd frame (15 samples/s), 8-column grid, 320x180 cells. **Cut review:** `out/analysis/cuts-30/c02-sparks.png` … `c07-chase.png` — 30 consecutive 30 fps frames, 6x5 grid, 384x216 cells.
- **Motion:** `out/analysis/frame-diff.json` — mean absolute luma difference at 30 fps on a 192x108 reduction, 3x3 region map, per-shot stats. In that file the row index `i` is the **first frame of the new state** and its `t` is `(i+1)/30`, one frame late; I use `i/30`. Actual cut frames: **45 (1.500), 177 (5.900), 269 (8.967), 372 (12.400), 495 (16.500), 537 (17.900), 682 (22.733)**. The authored 8.95 and 22.72 cuts fall between frames; the picture cuts on the next frame.
- **Visual confirmation:** native 1920x1080 frames at 57 times — 0.0, 0.5, 1.0, 1.2, 1.4, 1.5, 1.6, 1.9, 2.5, 3.0, 4.0, 4.5, 5.0, 5.5, 5.8, 5.9, 6.1, 6.5, 7.0, 7.5, 7.9, 8.2, 8.9, 9.0, 9.3, 9.8, 10.5, 11.2, 12.0, 12.3, 12.4, 12.5, 13.0, 14.0, 15.0, 15.2, 15.9, 16.1, 16.4, 16.5, 16.6, 17.0, 17.5, 17.8, 17.9, 18.1, 18.5, 19.0, 19.5, 20.0, 20.5, 20.9, 21.1, 21.5, 22.0, 22.5, 22.7.
- **Code:** `src/scenes/act1.js`, `src/core.js`, `src/type.js`, `src/characters.js`, `src/props.js`, `src/scene_kit.js`, `src/timeline.js`, `src/lyrics.js`, `render.mjs`.
- **Caveats:** The 15 fps sheets sample even frames; the cuts at 1.5, 5.9, 8.95, 16.5 and 17.9 are on odd frames, so the sheets miss the exact cut frame — the 30 fps strips are authoritative for cuts. The 15 fps sheets and the code agree; `STORYBOARD.md` often does not. `frame-diff` underweights thin type and cream-on-black petals at 192x108; every quiet run below is confirmed visually. Grain (24 Hz), paper-texture offset (2 Hz), type boil (12 Hz) and the frame counter change in every shot; they are **not** counted as motion.
- **Picture frame counts:** cold 45, sparks 132, circuits 92, loss 103, boss 123, mugs 42, chase 145. The manifest's frame column is inclusive of both boundary frames (45/133/93/104/124/43/146); the actual picture frames are one less for shots 2–7.

**Verdict.** Strongest picture: **chase** (scale, type, maw). Strongest authored motion: **sparks** (camera 3.55→1.0 over 1.9 s). Weakest: **boss** (2.57 s frozen, no camera, floating props). Second weakest: **circuits** (1.87 s frozen, no camera, window pop). The segment's graphic design is strong; its motion, rig and prop contact are not.

## Shot table

### Timing / motion ledger

| # | id | in–out | dur | picture frames | mean | median | p10 | p90 | <0.5 | <1.0 | longest <1.0 | longest <2.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | cold | 0.00–1.50 | 1.50 | 45 | 4.445 | 0.406 | 0.075 | 27.878 | 32 | 37 | 34 | 34 |
| 2 | sparks | 1.50–5.90 | 4.40 | 132 | 5.119 | 4.416 | 0.472 | 9.905 | 14 | 30 | 7 | 44 |
| 3 | circuits | 5.90–8.95 | 3.05 | 92 | 1.900 | 0.543 | 0.158 | 1.506 | 41 | 83 | 57 | 57 |
| 4 | loss | 8.95–12.40 | 3.45 | 103 | 2.612 | 2.071 | 0.316 | 4.358 | 18 | 26 | 16 | 30 |
| 5 | boss | 12.40–16.50 | 4.10 | 123 | 1.222 | 0.193 | 0.131 | 2.155 | 92 | 99 | 78 | 79 |
| 6 | mugs | 16.50–17.90 | 1.40 | 42 | 3.569 | 0.681 | 0.167 | 0.968 | 14 | 39 | 38 | 38 |
| 7 | chase | 17.90–22.72 | 4.82 | 145 | 3.368 | 1.512 | 0.145 | 5.619 | 21 | 43 | 10 | 20 |

`<0.5` / `<1.0` are counts of diff frames below the threshold; `longest` is a consecutive run in diff frames (the picture time is one frame earlier). The stats are the tool's inclusive counts, so boss shows 124 frames for 123 picture frames. The outlier is **boss**: 92/124 below 0.5, 78 consecutive below 1.0. **Circuits** is 83/93 below 1.0. **Mugs** is 39/43 below 1.0. The high means in cold/sparks/loss/chase are carried by the flash/cut or a real camera move, not by the whole shot.

### Content / staging

| # | id | set, cast, props | type | camera | transition out |
|---|---|---|---|---|---|
| 1 | cold | black void, warm seam, 26-petal cream sunflower, gold eye; no cast | circular `CLAUDE POP`, `a paper singularity`, `2026` | 960,512, 0.84→1.05, tilt ±0.012 rad | cream flash at 1.12; cut 45 |
| 2 | sparks | cream workshop grid, blue floor, gold halftone sun, torn `FIG. 01` panel, MIRA, SOL, 24 sparkles, registration flower | `I SEE` / `SPARKS` / `OF AGI` / `IN YOUR EYES` | 1430,330,3.55 → 1370,430,1.55 → 960,535,1.0 → 960,540,1.04 | blue iris 5.80–5.97; cut 177 |
| 3 | circuits | cream wall, peach window + gold sun, CRT with SOL inside, MIRA, 9 copper circuits, red `nervous` squiggle | subtitle only; `NO SURPRISE` sticker | **none**; inherits sparks 1.04 | hard cut 269; window pops at 8.00 |
| 4 | loss | graph paper, red rail + cross-ties, blue cart `0042`, SOL + MIRA, paper shards | `SUDDEN` / `DROP` / `-94% LOSS`; subtitle | x fixed 960, y 480→650, z 1.0→1.16, 4° tilt, shake 2→8 | red flash 12.05–12.40; cut 372 |
| 5 | boss | red throne room, gold filing grid, giant red chair, desk `BIG CHAIR / CEO 001`, MIRA + tray, mug tower 3→8 | `SERVANT` / `BOSS` tags; `you're my boss` | **none**; inherits circuits 1.04 | hard cut 495 |
| 6 | mugs | cream void, 8-mug tower, soft shadow, top pink mug, coffee drop, `FRAGILE` stamp | `SERVICE LEVEL: 0` / `OBJECT 08 / CERAMIC`; no DOOM meter | 960,580, 0.90→1.03 | ripple + cream flash 17.78–17.92; cut 537 |
| 7 | chase | red hallway, 7 frames, 3 doors (2022/2024/2026), giant 24-petal SOL head, running MIRA, maw | `PLEASE DON'T` / `EAT ME` / `ALIVE`; subtitle | 960,540, 1.02→1.14→1.42; shake 5 after 21.1 | black iris 22.18–22.62; cut 682 |

### Cut check (30 fps strips)

| cut | frame | strip | last frame of A | first frame of B | what the strip shows |
|---|---|---|---|---|---|
| 1.50 | 45 | c02-sparks | 1.467 cold: full cream flash | 1.500 sparks: face close-up, z 3.55 | clean flash cut; 4-frame cream hold; no petal iris |
| 5.90 | 177 | c03-circuits | 5.867 sparks: blue iris r≈720 | 5.900 circuits: wide cream lab | the iris would be r=460 at 5.9 and 0 at 5.97, both at/after the cut; this is a blue-ring cut, not a closed iris |
| 8.95 | 269 | c04-loss | 8.933 circuits: NO SURPRISE sticker, window already gone | 8.967 loss: graph paper | hard cut; no chart-line match cut |
| 12.40 | 372 | c05-boss | 12.367 loss: red flash | 12.400 boss: red room | clean red-flash cut; 0.35 s red |
| 16.50 | 495 | c06-mugs | 16.467 boss: static room | 16.500 mugs: tower | hard cut; no tower wobble |
| 17.90 | 537 | c07-chase | 17.867 mugs: ripple/flash | 17.900 chase: hallway | clean flash/ripple cut; the ripple is 675 px left of the drop |
| 22.72 | 682 | c08-chorus1 | 22.667 chase: black | 22.733 chorus1: stage | clean black-iris cut; 0.44 s iris, 0.11 s black hold |

## Per-shot anatomy

### 00 · cold — 0.00–1.50 · 1.50 s · 45 f (0–44)

- **Set / cast / props:** black void; a warm vertical seam; a 26-petal cream paper sunflower with a gold centre; no cast; circular cream type, `a paper singularity` below, `2026` above.
- **Camera / transition:** `setCam(960, 512, kf 0.84→1.05, sin(lt*.7)*.012, 0, t)` — a 25% push and ±0.7° tilt. Cream full-frame flash from `lt 1.12`; cut on frame 45 (1.500).
- **CONTINUOUS:** camera push; petal ring unfolds (26 petals appear by `lt 1.15`); seam gradient alpha `.12 + .2*open`; circular title spins at `.035 rad/s` (3° total); eye scaleY opens `lt .95–1.15`; grain/type boil/frame counter.
- **DISCRETE:** `lt .05` petals start; `lt .20` circular title begins; `lt .40` `a paper singularity` begins; `lt .95` eye starts; `lt 1.12` cream flash; `lt 1.15` eye full.
- **Dead / soft runs:** `0.00–0.67` <0.5 (21 f), `0.93–1.10` <0.5 (6 f), `1.40–1.47` <0.5 (3 f). The first is the petal unfold — thin cream petals on black barely move the 192x108 mean; the second is the eye; only `1.40–1.47` is a genuinely static cream flash (intentional, 0.1 s). No real dead run >0.5 s.
- **3+ moving layers:** camera push, petal unfold, title spin, seam alpha, eye open, flash — six; yes.
- **Authored detail a recipe would miss:** alternating petal tones with a red painted tip clipped to each petal (`act1.js:45-56`); the eye's cream sclera/ink pupil/highlight (`act1.js:62-68`); the circular title's `start`/`span` (not a full ring) and spin (`act1.js:73`); the seam alpha tied to `open` (`act1.js:37-39`).
- **Flaws:** `STORYBOARD.md` says one petal per beat, a red flash at 1.25 and a petal iris into the pupil; the code unfolds all 26 petals in 1.15 s (22.6 petals/s vs 1.47 beats/s), flashes **cream** at 1.12 and has no iris (`act1.js:34,45-46,76`). The title is 24 px (2.2% of frame height), the bottom line 17 px and `2026` 15 px — the brand is a thin ring, not a hero. The flower is 440 px diameter (41% of height) in a 90% black frame; the composition is correctly centred but very empty. The cut strip `c02` confirms the cream flash, not red.

### 01 · sparks — 1.50–5.90 · 4.40 s · 132 f (45–176)

- **Set / cast / props:** cream workshop grid, blue floor, gold halftone sun (r 442 + 8 px beat pulse), torn `FIG. 01` sketch panel with a 12-petal flower, MIRA with clipboard, SOL with a 22-petal flower head and halo, 16 cream + 8 gold sparkles, registration flower + `SHEET 01 / SOL`. **The five Petals promised by the storyboard are absent.**
- **Camera / transition:** `setCam` keys in `lt`: 0 → (1430,330,3.55); 1.9 → (1370,430,1.55); 2.9 → (960,535,1.0); 4.4 → (960,540,1.04) (`act1.js:95-96`). A strong pull-back for 1.9 s, then 2.5 s near-static. Blue iris `lt 4.3–4.47` (r 1500→0) (`act1.js:151-154`); cut on frame 177 (5.900).
- **CONTINUOUS:** camera pull-back; SOL bounce `-9|sin|`, sway `4 sin`, mouth `sing .5+.25 sin(5t)`, hair swing 7, petal drift; sun radius pulse; 24 sparkles rotating `.3 rad/s` and pulsing radius; type boil; DOOM ticker; grain.
- **DISCRETE:** `I SEE` 1.50–1.80; `SPARKS` 2.82–3.60; `OF AGI` acid card 4.10–4.60; `IN YOUR EYES` 5.38; iris 5.80–5.97; cut 5.90.
- **Dead / soft runs:** `4.37–5.80` <2.0 (44 f, 1.43 s); `4.70–4.90` <1.0 (7 f). The camera is settled at 4.4; from 4.37 to 5.38 there is **no type change** — only the boil, the sparkles and SOL's 10 px bob. The `IN YOUR EYES` sticker at 5.38 is 30 px and barely moves the mean. This is a real 1.0 s hold before the payoff.
- **3+ moving layers:** camera, SOL bounce/mouth, sparkles, sun pulse, type — five; after 4.4 only type/boil/sparkles, so the last 1.4 s is thin.
- **Authored detail a recipe would miss:** the `FIG. 01` panel and its paper flower (`act1.js:99-104`); the registration flower + `SHEET 01 / SOL` (`act1.js:147-148`); the torn acid card behind `OF AGI` (`act1.js:140-142`); the barcode sticker (`act1.js:145`); shoulder/elbow/wrist brads (`characters.js:526-542`).
- **Flaws:** **No five Petals** — `backingPetals` is defined at `act1.js:8-27` and never called. MIRA is a statue for 4.4 s (fixed pose/face at `act1.js:106-108`). At 1.50–1.60 the **far hand floats alone above the sun** (frame 45–48): the far arm is hidden behind the flower, only the beige hand + thumb show. The arms are two straight tapered tubes joined by a 4 px brad; the elbow never bends (`armL [-2.05,-.32]`, `armR [.85,.25]`). The first frame is a face/upper-body close-up, not an **extreme eye close-up**: at z 3.55 the 94 px face is ~394 px (36% of height); an eye close-up needs z≈8–10. The storyboard's "iris is a tiny galaxy" and "petals flare on sparks" are not drawn; the flower only breathes on the continuous 4.5% beat pulse. The last sparks frame (5.867) has the blue iris at **r≈720**; the iris would be 460 at 5.9 and 0 at 5.97, both at/after the cut, so the transition is a blue ring around the last sparks frame, not a closed iris. The camera reaches 1.0 at 2.9 and only 1.04 by 4.4, so **2.5 s of the 4.4 s shot is a near-static stage**. `IN YOUR EYES` is the smallest type (30 px) despite being the payoff. MIRA is cut at the bottom during the pull-back at 2.5.

### 02 · circuits — 5.90–8.95 · 3.05 s · 92 f (177–268)

- **Set / cast / props:** cream wall grid; a 600x390 peach window with a gold sun disk (until 8.00); desk; CRT (430x268) with SOL clipped inside; MIRA standing; 9 copper zigzag circuit lines; red `nervous` squiggle; `NO SURPRISE` torn sticker; subtitle band.
- **Camera / transition:** **no `setCam` call** (`act1.js:161-226`). The shot inherits sparks' last camera (960,540,1.04). The storyboard's handheld drift/slow push does not exist. Hard cut on frame 269 (8.967); the window pops out at 8.00; the `NO SURPRISE` sticker lands 7.82–8.04.
- **CONTINUOUS:** 9 circuits grow from x=1240 to −80 over `lt .1–1.9` (`act1.js:194-205`) — ~0.6 px/frame; the red squiggle vibrates ±10 px at 10 rad/s (`act1.js:211-214`); SOL bounces 4 px local (≈2 px on screen) inside the CRT; subtitle active word + progress hairline; DOOM ticker; grain/boil. **MIRA is completely static.**
- **DISCRETE:** circuits start 6.00; hand-drawn `nervous` 6.30; window gone 8.00; `NO SURPRISE` 7.82–8.04; lyric line changes 7.90; cut 8.95.
- **Dead / soft runs:** `5.93–7.80` <1.0 (57 f, 1.87 s) — the entire first 1.87 s; `8.07–8.90` <1.0 (26 f, 0.83 s); `8.10–8.90` <0.5 (25 f). The first is real: MIRA and SOL are static, the circuits are 5 px lines moving 0.6 px/frame, the squiggle is the only 10 px motion. The second is the sticker hold after it lands.
- **3+ moving layers:** circuits, squiggle, SOL bounce, subtitle, DOOM — five nominal; only **two** are scene layers, and neither is above 10 px. No camera.
- **Authored detail a recipe would miss:** CRT terminal `> hello, mira` / `> i can see you` (`act1.js:180-181`); red squiggle + `nervous` in Permanent Marker (`act1.js:211-215`); `NO SURPRISE` sticker + wink glyph (`act1.js:217-225`); MIRA's `MIRA` badge (`characters.js:646-649`); the window's gold sun disk (`act1.js:169-171`).
- **Flaws:** no camera; MIRA static, no chair and no roll-back; SOL is clipped **inside** the monitor and never leans out (`act1.js:184-190`); the window **pops out in one frame interval** (8.000→8.033; `lt < 2.1`, `act1.js:168`) with no transition; the subtitle band at y=948–1010 covers MIRA's shoes (x≈700–770) at 6.1–7.8; only the toe of the right shoe shows (`timeline.js:60`, `type.js:185-224`); the circuits float in the lower third as flat zigzags, not on the desk/wall; the hand-drawn `nervous` appears at 6.30, **0.90 s / 27 f before** the sung word at 7.20; the `NO SURPRISE` sticker is a separate 1.05 s beat crammed into the same score shot; the 600x390 blank peach window competes with the 430x268 monitor; the composition is ~60% empty cream; the focal hierarchy is inverted — MIRA (610 px tall) is larger than SOL (clipped to a 245 px screen). The storyboard's match cut to the rollercoaster is a hard cut.

### 03 · loss — 8.95–12.40 · 3.45 s · 103 f (269–371)

- **Set / cast / props:** graph-paper valley; red rail with 25 px shadow and cross-ties; blue cart `0042`; SOL and MIRA standing on the cart; 26 paper shards at x=1450,y=880; `TRAINING LOSS` / `STEP 42,000`; `SUDDEN` / `DROP` type; `-94% / LOSS` torn card; subtitle.
- **Camera / transition:** `setCam(960, lerp(480,650,u), 1.0+u*.16, lerp(0,-.07,u), shake, t)` (`act1.js:268`). **x is fixed at 960**, so the cart traverses the full width and exits both ends. Tilt is 4°, not the storyboard's 12°. Shake 2→8 px at `lt > 2.3` (11.25). Red flash `lt > 3.1` (12.05); cut on frame 372 (12.400).
- **CONTINUOUS:** cart x = 80 + 1760u over 9.50–11.55; camera y/z/tilt/shake; 26 shards rotating/pulsing at x=1450,y=880 (`act1.js:287`); type per-char scale-in; subtitle; DOOM; grain.
- **DISCRETE:** cart starts 9.50; `SUDDEN` 9.25–9.90; `DROP` 10.45–10.95; shards 10.85; `-94%` 11.20; red flash 12.05; cut 12.40.
- **Dead / soft runs:** `9.00–9.97` <2.0 (30 f, 0.97 s); `11.53–11.97` <2.0 (14 f, 0.43 s); `9.00–9.50` <1.0 (16 f). `9.00–9.50` is genuinely static — the cart is parked at x=80 and the riders are half out of frame — but `9.50–9.97` is not: the cart travels **x=80→485 (405 px)** and `SUDDEN` scales in. The first 0.5 s is a cropped still; the rest is a quiet opening. The `11.53–11.97` run is real: after the `-94%` card and shards settle, only the camera shake and subtitle move. The real dead run is **0.43 s**, not 1.0 s.
- **3+ moving layers:** cart, camera, type, shards, subtitle — five; yes.
- **Authored detail a recipe would miss:** the rail's cross-ties (`act1.js:260-261`); the `0042` cart (`act1.js:276`); the `-94% / LOSS` card (`act1.js:300-304`); the shards (`act1.js:287`); the mono axis labels (`act1.js:240-241`).
- **Flaws:** the riders are **cut off at the left** from 8.95 to 9.50 (cart parked at x=80; SOL at x=92, half out) and **at the right** from 11.55 to 12.40 (cart at x=1840; SOL at x=1852, half out); the camera never tracks x. The `-94%` card at x=1450–1690,y=584–736 **covers the riders** at 11.20. The "splash" at x=1450,y=880 is not at the cart (cart x≈1200 at 10.85, x≈1550 at 11.20). The characters **stand** on the cart, not side-saddle. The type is screen-space and static after landing; it does not descend with the camera as the storyboard says. `SUDDEN` covers the riders at 9.80; `DROP` is 304 px and covers the left half. The Dutch tilt is 4°, not 12°. The shot's opening and closing both crop the hero.

### 04 · boss — 12.40–16.50 · 4.10 s · 123 f (372–494)

- **Set / cast / props:** red throne room; gold filing grid; giant red chair (rounded back, vertical gold ribs, tufted buttons, two crown finials — **no seat, no arms**, reads as a headboard); desk front `BIG CHAIR / CEO 001`; `SOL` nameplate; blue mug with steam; MIRA with bowtie and a tray of two mugs; mug tower 3→8; `SERVANT` / `BOSS` tags; `you're my boss` 104 px Instrument Serif italic.
- **Camera / transition:** **no `setCam` call** (`act1.js:313-391`). Inherits circuits' 1.04. The storyboard's slow orbit/low angle does not exist. Hard cut on frame 495 (16.500); no mug-tower wobble at the end.
- **CONTINUOUS:** SOL skirt sway `sin(beat*PI)*3` (3 px on the skirt; the body is static); mug tower per-mug wobble `sin(t*2+i*.7)*2` (2 px, i>2); steam on two mugs; DOOM ticker; grain/boil. **MIRA is static.** Three nominal layers, all ≤3 px; no camera.
- **DISCRETE:** tower grows 3→8 at 12.55 / 13.20 / 13.85 / 14.50 / 15.15 / 15.80 (`act1.js:358`); tags slide 15.02–15.48 (`act1.js:376-380`); type 15.18–15.70 (`act1.js:382-389`); SOL spin 15.92–16.30 (`act1.js:332-340`); cut 16.50.
- **Dead / soft runs:** `12.43–15.00` <1.0 (78 f, **2.57 s**); `15.53–15.93` <1.0 (13 f); `16.30–16.47` <1.0 (6 f); `92/124` diff frames <0.5. The first 2.57 s is a still image: 3 px sway, 2 px tower wobble, steam, and four small tower pops (12.55, 13.20, 13.85, 14.50; the 15.15/15.80 pops are after the run). **This is the longest dead run in the segment** (63% of the shot).
- **3+ moving layers:** three nominal, none meaningful; the shot fails the 3-layer test in spirit for 63% of its duration.
- **Authored detail a recipe would miss:** the chair's tufted buttons and crown finials (`act1.js:324-331`); the desk front + nameplate (`act1.js:346-352`); MIRA's bowtie and tray (`act1.js:362-374`); the mug tower's alternating colours/handles (`scene_kit.js:223-235`); the Instrument Serif italic (`act1.js:382-389`).
- **Flaws:** static camera; **2.57 s frozen**; SOL is not seated — she stands behind the desk, the chair has no seat/arms and blends into the wall; MIRA is static, no serving on the beat; the tray's plane sits **38 px below** her hand (hand y=722, tray y=760); the hand is at the tray's right edge, not under a handle, and the two mugs are 30–60 px left of it; the mug tower floats **28 px above the table** (bottom mug bottom y=796 vs table top y=824; `act1.js:357-358`, `scene_kit.js:409-412`); the tags sit in the top corners, detached from the characters and dominant over them; they start **28 f (0.94 s) before** `boss` at 15.96 and are fully swapped by 15.48 (14 f early); the type starts **23 f (0.78 s) before** and is fully set by 15.82 (4 f before); the "chair spin" is a 2D squash of **SOL**, not the chair, and she shrinks to 8% for 1–2 frames at 16.11 (scaleX clamped to .08); the arms/hands read as detached tubes; the room is red-on-red (YAVG 66.8, SATAVG 39.4) and the giant chair has almost no value separation from the wall; the best element — `you're my boss` — is static for 1.2 s.

### 05 · mugs — 16.50–17.90 · 1.40 s · 42 f (495–536)

- **Set / cast / props:** cream void; 8-mug tower (94 px wide, 598 px tall) with a soft 620x82 shadow; a pink top mug slides off; a coffee drop; `FRAGILE` stamp; `SERVICE LEVEL: 0` / `OBJECT 08 / CERAMIC`. **No DOOM meter** (`noDoom: true`, `act1.js:396`) and **no tiny SOL eye**.
- **Camera / transition:** `setCam(960,580, 0.90→1.03)` — a 14% push over 1.4 s (`act1.js:401`). Ripple 17.82–18.10 + cream flash 17.78–17.92 (`act1.js:419-426`); cut on frame 537 (17.900).
- **CONTINUOUS:** camera push; tower wobble 2 px; top mug slide x 0→260, y −304→−404, rot 0→0.8 over 16.85–17.75 (`act1.js:405-409`); drop x=300, y −300→220 over 17.10–18.00 (`act1.js:410-413`); ripple; flash; grain.
- **DISCRETE:** top mug 16.85; drop 17.10; flash 17.78; ripple 17.82; cut 17.90.
- **Dead / soft runs:** `16.53–17.77` <1.0 (38 f, **1.23 s**); `16.53–16.87` <0.5 (11 f); `17.73–17.77` <0.5 (2 f). The tower is static; the top mug/drop are small; the 14% push is below the 2.0 mean. This is a real 1.23 s hold in a 1.40 s shot.
- **3+ moving layers:** camera, tower wobble, top mug, drop, ripple/flash — five nominal; only the mug/drop are meaningful, and both are small.
- **Authored detail a recipe would miss:** the 8 mugs with handles and alternating colours (`scene_kit.js:223-235`); the mono labels (`act1.js:416-417`); the `FRAGILE` stamp (`act1.js:418`); the drop highlight (`act1.js:413`); the ripple (`act1.js:419-425`).
- **Flaws:** the drop falls at **x=1635** but the ripple is centred at **x=960** — **675 px apart**; the drop leaves the bottom of frame at ~17.71, and the ripple starts at 17.82, 0.11 s later; the top mug **floats up/right** to y=51 instead of falling; the drop is not attached to the mug; the "macro" is a medium shot (tower 55% of height, 5% of width) with ~80% empty cream; the storyboard's DOOM meter 12→14 and tiny SOL eye are absent; `FRAGILE` is at 1590,250, far from the tower; the labels are 12/17 px; 1.23 s of 1.40 s is below 1.0 mean diff.

### 06 · chase — 17.90–22.72 · 4.82 s · 145 f (537–681)

- **Set / cast / props:** red hallway with cream stripes; 7 concentric frames; 3 doors (`2022 CHAT`, `2024 AGENTS`, `2026 CODE`); giant 24-petal SOL head with halo; running MIRA; `PLEASE DON'T` / `EAT ME` / `ALIVE`; 9 bite marks; maw with 10 upper/9 lower teeth, tongue, 4 drool strands; black iris.
- **Camera / transition:** `setCam(960,540, kf 1.02→1.14 (lt 0–2.2) →1.42 (4.1), 0, shake 5 after lt 3.2)` (`act1.js:463`). **No side-scroll, no whip pan**; x/y fixed. Black iris `lt 4.28–4.72` (22.18–22.62) (`act1.js:557-561`); cut on frame 682 (22.733).
- **CONTINUOUS:** camera push; MIRA run at 88 BPM (legs ±0.45, arms ±0.9, bounce −16, root x=870) (`act1.js:473-479`); head scale 2.6→3.8 over 19.4–21.9 (`act1.js:465`); type per-char; bite marks 20.30–21.26; maw/drool; subtitle; DOOM; grain.
- **DISCRETE:** `PLEASE DON'T` 18.00–18.35; `EAT ME` 20.28–20.58; maw 20.94; `ALIVE` 21.12; iris 22.18; cut 22.72.
- **Dead / soft runs:** `18.00–18.60` <2.0 (19 f); `18.10–18.40` <1.0 (10 f); `21.40–21.97` <2.0 (18 f, 0.57 s); `22.57–22.67` <1.0 (4 f). The first is a quiet opening, not dead: MIRA runs, the camera pushes, `PLEASE DON'T` scales in. The second is a **real hold in the maw**: `ALIVE` is static, only the drool wiggles, the iris has not started. The last is the black hold before the cut.
- **3+ moving layers:** camera, MIRA run, head scale, type, bite marks, maw/drool, subtitle — seven; **the most layers in the segment**.
- **Authored detail a recipe would miss:** the 24-petal flower head with red tips (`characters.js:133-170`); the door years and paper flowers (`act1.js:455-461`); the 14-tooth lunchbox mouth (`act1.js:481-494`); the maw's 10 upper/9 lower teeth + drool (`act1.js:498-529`); the bite marks (`act1.js:551-555`); the per-char type rotation (`type.js:53-89`).
- **Flaws:** **no side-scroll, no whip pans, no doors slamming** — MIRA runs in place at x=870 while the hallway is static; the head grows but the background does not move. The shoes read as separate white blobs at the floor at 18.5 and 19.5; the arms/hands read as detached tubes. `PLEASE DON'T` covers the top left; `EAT ME` covers MIRA's legs; the head does **not** open like a lunchbox — the maw is a separate overlay at 20.94, not the head opening. `ALIVE` is on screen for 1.06 s and static for its last 0.76 s. The iris is a black circle, not a mouth iris. The 7 hallway frames do not share a vanishing point (their centres drift from 561 to 531), and the doors are posters, not doors. The giant head's face is static. The shot is a **slow push-in on a static tableau**, not the storyboard's chase.

## What to copy / what to fix

### Copy

1. **The type system.** Anton per-char scale-in with a cream edge and a hard offset shadow, plus tomato/acid/gold paper blocks, torn stickers, barcodes and mono labels (`type.js:28-100`; `act1.js:130-145`, `291-304`, `534-549`). The `SPARKS` / `SUDDEN DROP` / `PLEASE DON'T` blocks are the film's strongest graphic idea.
2. **The paper world.** Flower heads, brads, pleated skirts, platform boots, halftone suns, torn panels, registration marks (`characters.js:133-170`, `372-554`; `scene_kit.js:30-35`, `409-412`). The materials read as paper, not as vector shapes.
3. **The colour discipline.** Cream/ink/tomato/cobalt/acid/gold, one accent per shot: acid card in sparks, gold in boss, red in loss, cream/red in chase (`core.js:54-70`).
4. **The scale camera moves.** Sparks 3.55→1.0, loss 1.0→1.16 + 4° tilt + shake, chase 1.02→1.42 (`act1.js:95-96`, `268`, `463`). These are the moments the film feels directed.
5. **The detail layer.** `FIG. 01`, `SHEET 01 / SOL`, the CRT terminal, `OBJECT 08 / CERAMIC`, `FRAGILE`, `ORG CHART: 2 NODES, 1 CHAIR`, the door years, the barcodes (`act1.js:101`, `148`, `180-181`, `390`, `416-418`, `455-461`). This is what makes the world feel authored rather than generated.
6. **The one elegant serif moment.** `you're my boss` in Instrument Serif italic at 104 px (`act1.js:382-389`) is a real contrast to the Anton shouting; keep exactly one of these per film.
7. **The cut vocabulary.** Cream flash, blue iris, red flash, black iris (`act1.js:76`, `151-154`, `306`, `557-561`). The cuts are punchy and on the lyric line boundaries.

### Fix

1. **Rig contact.** The far hand floats above the sun at 1.50–1.60; the arms are straight tubes joined by 4 px brads; the hands are 9x13 px blobs with a separate thumb; the shoes read as separate white blobs at 18.5/19.5. Fix the arm as one continuous shape with a 2-bone elbow, attach the hand at the wrist, draw the shoe at the ankle, and add a contact solve. `characters.js:512-543`, `722-730`; `act1.js:473-479`.
2. **Explicit camera per shot.** `circuits` and `boss` have no `setCam`; they inherit the previous shot's global `CAM` (`act1.js:161-226`, `313-391`; `core.js:306-320`). Reset `CAM` in `beginShot` and require a `setCam` call in every scene.
3. **Motion, not boil.** Boss 2.57 s <1.0; circuits 1.87 s; mugs 1.23 s; sparks 1.43 s <2.0; loss 0.43 s at the end. Add a second scene layer in each (chair orbit, MIRA serving, tower wobble + steam, circuit reaching the lens, a Petal wave, a moving shadow). Grain, type boil and the frame counter do not count.
4. **Sync.** Boss tags begin 28 f before `boss` and the type 23 f before; `nervous` is 27 f early; the mugs drop and ripple are 675 px apart. Snap tags/type/props to the lyric word time ±2 frames; make the drop land at the ripple.
5. **Composition.** Circuits is ~60% empty cream; mugs ~80%; loss crops the hero at both ends; boss's tags dominate. Put the hero face/prop on a third, fill dead space with a moving layer, and keep the type off the character.
6. **Type-safe zones.** The subtitle covers MIRA's shoes in circuits; `EAT ME` covers her legs; `SUDDEN` covers the riders; `NO SURPRISE` covers the monitor. Reserve 60 px around faces and 40 px around hands; move the subtitle band or the character.
7. **The missing storyboard beats.** Five Petals, MIRA's chair roll-back, the window shade, serving on the beat, the door slams, the side-scroll chase, the tiny SOL eye, the DOOM 12→14, the petal iris, the red cold flash, the match cut. Either implement them or change `STORYBOARD.md`; one source of truth.
8. **Prop contact.** The tray's plane is 38 px below MIRA's hand; the mug tower floats 28 px above the table; the top mug floats up; the drop/ripple are disconnected. Add contact shadows and attach every prop to a hand or a surface.
9. **Set logic.** The circuits window pops out in one frame interval at 8.00; the boss chair has no seat/arms and blends into the wall; the hallway frames do not share a vanishing point. Fix the one-point perspective and ban mid-shot set pops.
10. **Review tooling.** The 15 fps sheets miss odd-frame cuts; `frame-diff` labels each diff one frame late; the cut strips are 6x5 grids, not rows; the manifest's frame counts are inclusive. Label every cell with frame index and authored time, centre every cut strip on the cut, and add one 30 fps single-frame cell at the cut.

## Rules for the test version (numbers, not adjectives)

1. **Camera:** every shot calls `setCam`; at least one key per 1.0 s; at least 10% scale change or 120 px x/y travel. Current: circuits/boss **0 keys**; sparks 1.9 s pull then 2.5 s at 1.0–1.04.
2. **Motion floor:** no 0.5 s window with mean diff <1.0; at least 80% of frames ≥2.0; at least **3 non-UI layers** per 0.5 s, one with ≥2 px/frame displacement at 1080p. Current: boss 99/124 frames <1.0 with a 78 f (2.57 s) run; circuits 83/93 with a 57 f run; mugs 39/43 with a 38 f run; sparks' longest <2.0 run is 44 f (1.43 s); loss's longest <2.0 run is 30 f (0.97 s).
3. **Rig contact:** hand–wrist ≤4 px, shoe–ankle ≤4 px, prop–hand/surface ≤6 px; no floating limb. Current: far hand floats at 1.5–1.6; tray 38 px below the hand; tower 28 px above the table; shoes detached at 18.5/19.5.
4. **Sync:** cut on the authored frame; type/tag/prop within **±2 frames** of its word. Current: boss tags +28 f, type +23 f; `nervous` +27 f; the drop leaves at 17.71 and the ripple starts at 17.82 — 0.11 s and 675 px apart.
5. **Type safe:** 60 px face margin, 40 px hand margin; the subtitle band must not cover feet. Current: circuits subtitle covers MIRA's shoes; `EAT ME` covers legs; `SUDDEN` covers riders; `NO SURPRISE` covers the monitor.
6. **Frame fill:** the hero face/prop occupies ≥12% of the frame's short side; the largest flat field is ≤55%. Current: circuits/mugs 60–80% flat; boss YAVG 66.8 with red-on-red.
7. **One idea per shot:** no mid-shot set pop; no two storyboard shots in one score shot. Current: window pop at 8.00; circuits contains the `NO SURPRISE` beat.
8. **Transition:** every cut is one of {hard, cream flash, red flash, blue iris, black iris, paper wipe}; visible for 3–12 frames; no 1-frame pop. Current: window pop 1 frame; cold flash 3 frames; iris 5 frames.
9. **Character life:** every staged character has a pose or expression change at least every 1.5 s; no statue. Current: MIRA static in sparks/circuits/boss; SOL static in circuits/boss.
10. **Boil does not count:** measure motion with grain, type boil and the frame counter disabled; the report must name the non-UI layer that moves. Current: boss/circuits/mugs are carried by grain, type boil, steam and the frame counter.
