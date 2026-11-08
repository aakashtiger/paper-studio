# Segment I — 137.02–156.62

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames, 156.62 s.
- Primary review at **15 samples/s** (every 2nd frame): `shots-15/act5-reveal|curtain|finaldance|desk.png`, cells 320×180, 8 columns. The sheet is sized for the longest shot (12 rows); `reveal` uses 7 rows / 55 cells, which matches 110 frames.
- Cuts read on the **30 fps strips** (`cuts-30/c48…c51`), 6×5 cells, 384×216. **The strips are not centred on the cut as `manifest.md` claims**: `c48` puts the cut on its 2nd frame, `c49` on its 22nd, `c50` on its 1st (no pre-cut frames at all), `c51` on its 28th. I therefore fixed every cut from `frame-diff.json` instead: **4111** (reveal), **4221** (curtain), **4380** (finaldance), **4530** (desk).
- Frame convention: frame *N* is painted at *t = N/30*; `frame-diff.json`'s `t` column is one frame later (`(N+1)/30`). I quote painted times and give frame numbers. The first frame at or after each cut is 4221 / 4380 / 4530 (140.68 falls inside 4220, so 4221 is the first curtain frame).
- Runs below 0.5 mean |ΔY| on the 192×108 reduction are called **frozen**; below 2.0 are called **soft**. Grain, type boil, dust and the print-mark frame counter are excluded from "meaningful change".
- Native frames extracted to `out/analysis/tmp/` (reveal 137.1/139.5/140.4; curtain 141.0/144.0; finaldance 148.0/150.5; desk 151.1/151.6/153.5/155.6/155.8/156.4).
- Code read: `src/scenes/act5.js` (all 435 lines), `src/core.js`, `src/type.js`, `src/timeline.js`, `src/characters.js` (`mira`, `idol`), `src/props.js`, `src/scene_kit.js`.
- `STORYBOARD.md` numbering is **offset by two** from `manifest.md`: storyboard §50 = manifest shot 48 (`reveal`), §51 = 49, §52 = 50, §53 = 51.

## Shot table

| # | id | in | out | dur | frames | cut in | camera | dead/soft | verdict |
|---|---|---|---|---|---|---|---|---|---|
| 48 | reveal | 137.02 | 140.68 | 3.66 | 110 (4111–4220) | flash 0.35 cream, 137.02–137.24 | centre zoom z 1.55→1.00 over 1.9 s (`act5.js:46`) | **frozen 139.67–140.67 (30 f, 1.00 s)**; soft 138.23–138.83 (18 f) | strongest |
| 49 | curtain | 140.68 | 146.00 | 5.32 | 159 (4221–4379) | hard cut, diff 74.1 | **none** (`drawTheatre` has no camera, `scene_kit.js:551`) | soft 141.87–142.13 (9 f), 143.23–143.50 (9 f), 144.57–144.87 (10 f) | good, locked off |
| 50 | finaldance | 146.00 | 151.00 | 5.00 | 150 (4380–4529) | hard cut, diff 103.3 | ±50 px horizontal sway, 8.98 s period (`act5.js:268`) | **frozen 150.73–150.97 (7 f, flat cream)**; soft 148.20–148.37 (5 f) | weakest |
| 51 | desk | 151.00 | 156.62 | 5.62 | 168 (4530–4697) | hard cut from cream, diff 134.5 | centre zoom z 2.60→1.00 over 2.0 s (`act5.js:342`) | **frozen 152.77–155.03 (68 f, 2.27 s)**; +9 f, +10 f, +3 f, +6 f ⇒ 96/168 f < 0.5 | deadest motion |

Segment total 19.60 s / 587 painted frames. Four shots, four hard cuts, no dissolves. The only transitions are authored flashes *before* each cut, never across it.

## Per-shot anatomy

### 48 · reveal · 137.02–140.68 · 3.66 s · 110 frames (4111–4220)

**Set.** Backstage: 12×16 brick wall (`act5.js:52-60`), paper floor with 10 board lines, three work lights with cables and 190 px cones, a **painted door flat** with a support strut, two castors and a "painted glow (not real light)" triangle (`act5.js:72-95`), a moon on a visible string (`act5.js:96-103`), a paperclip earth on a stick (`act5.js:104-109`).
**Cast.** MIRA alone in the lab coat (`act5.js:135-144`), the giant SOL costume split by a 5 px zigzag seam (`act5.js:110-122`), three small SOLs stepping out (`act5.js:124-133`), one black stagehand silhouette with a tricolour sandwich (`act5.js:146-155`).
**Props.** Hanging lyric cards `WAS IT` / `ALL FOR` / `SHOW?` (`act5.js:157-160`), a cream `?` card on a string (`act5.js:162-170`).
**Type.** `STAGE B / AFTER THE SHOW` at (80,90) 13 px DMMono, α .40; `nothing here was real` at (80,118) α .22 (`act5.js:172-173`). Lyric band `TY.subtitle` at (84,992), 31 px DMMono, active word acid (`type.js:185-224`). P(DOOM) ticker at 100.0 %, red.
**Camera.** `ctx.scale(z)` about (960,540): z = 1.55 − 0.55·easeOut(seg(lt,0,1.9)) → **1.55 → 1.00, 55 % scale change in 1.9 s**. No parallax — it is a digital zoom, not a dolly.
**Transition.** In: 0.35 α cream flash decaying over 0.22 s (`act5.js:177`) on top of the breath→reveal cut. Out: nothing; the shot holds its last frame and cuts.

**CONTINUOUS (every 0.0667 s).**
1. The zoom, 137.02–138.92 (strongest layer; most of the 4–12 mean diff of the first 1.3 s is this plus the flash decay).
2. MIRA `sway: sin(t·0.7)·3` → **±3 px on a 9.0 s period** (`act5.js:138`); hair `sin(t·1.8+i)·8` inside `idol`.
3. Three small SOLs `bounce = −|sin(beat·π+i)|·4` → **±4 px** at 88 BPM (`act5.js:129`, `core.js:48`).
4. `dust` 34 motes, 0.012–0.026 of range per second (`act5.js:6-16`).
5. P(DOOM) 100.0 % static; the print-mark frame counter increments.

**DISCRETE.**
- 137.02–137.24 flash 0.35 → 0.
- 138.47–139.02 `WAS IT` card falls 340 px, rotates +0.5 rad.
- 138.77–139.32 `ALL FOR` falls, rotates −0.6 rad.
- 139.07–139.62 `SHOW?` falls, rotates +0.4 rad.
- 139.12–139.47 `?` card `backOut` 0→1 at (1330,410) (`act5.js:163`).
- Subtitle words: Was 137.02, it 137.86, all 138.22, for 138.90, **show? 140.24**.

**Dead / soft.** Frozen **4190–4219 = 139.67–140.67, 30 frames, 1.00 s** (mean 0.13–0.35). Soft 4146–4163 = 138.23–138.83 (18 frames, mean 1.0–2.0) as the zoom finishes. The last authored event is the third card landing at 139.62; the last word lands at 140.24 and changes only a 31 px word colour. **1.05 s of the 3.66 s shot has no meaningful change.**

**3+ independent layers?** Yes for 137.02–139.62 (zoom + falling cards + `?` + MIRA + small SOLs + dust). **No for 139.62–140.67** — only the ±4 px SOL bob and dust, both under the 0.5 threshold.

**Authored detail a recipe would miss.** The mono stage notes slide in from off-frame *because* the zoom is 1.55× (at z 1.55 the x=80 text maps to x = −404); the sandwich's three layers (cream/green/red, `act5.js:153`); the moon's string; the paperclip earth's 16 scattered clips; the door flat's castors and strut; the split seam drawn twice (5 px ink + 2 px gold at α .55); the three small SOLs with three different faces (wink / happy / happy); the floor board lines.

**Flaws.**
1. **1.00 s dead tail** (4190–4219) before the cut. The storyboard's "the cast freezes" is literally true and then nothing answers it.
2. `ALL FOR` card is **clipped by the right frame edge** at the start: world right edge 1600 → 960+(1600−960)·1.55 = **1952 > 1920** (32 px cut). Visible in `shots-15/act5-reveal.png` cell 0 and `cuts-30/c48` cells 1–3.
3. The stagehand is completely static (`act5.js:146-155` has no `t`): the storyboard's "a stagehand eats a sandwich" is a fixed sandwich at a fixed angle.
4. The giant SOL's "split open" is a crack line over an intact body; the costume never opens.
5. `?` card overlaps the giant SOL's left arm and its string crosses her face.
6. The zoom's anchor (960,540) is the frame centre, so the door flat grows about the centre and the composition does not re-balance; the left third is empty brick for the last 2 s.

### 49 · curtain · 140.68–146.00 · 5.32 s · 159 frames (4221–4379)

**Set.** `drawTheatre` (`scene_kit.js:551-569`): crimson kit background, two 250 px curtains with `sin(t+i)·5` fold sway, gold proscenium 120 px inset, `THE PAPER SINGULARITY` valance at 30 px, boards, nine footlights with 70 px glow discs. Plus a second sunburst at 16 % α, rotated `t·0.03` (`act5.js:188`), and a 240 px stage-floor strip with 9 gold rivets.
**Cast.** 9 in a line at x = **170, 350, 540, 720, 930, 1130, 1320, 1520, 1720**, feet y=938 (`act5.js:218-236`): chinchilla, gato, MIRA, giant paperclip (s 1.9), SOL, shoggoth, basilisk, two cloud guards.
**Props.** `P(DOOM) 100%` balloon on a string at (1790,390) (`act5.js:195-216`), 12 falling paper flowers, 160 confetti, 30 dust.
**Type.** `CLAUDE POP` 168 px Anton, gold with 9 px ink edge, `backOut` 0→1 over 0.55 s (`act5.js:248-251`); `a paper singularity` 28 px serif italic; `THANK YOU` sticker with tape at (1630,270); `ENCORE! ENCORE!` 15 px mono at (90,250); `the company takes a bow` 14 px italic at (960,1010).
**Camera.** **None.** No `setCam`, no `ctx.scale`, no translate of the set anywhere in the scene. The 15 fps sheet reads as a slow push-in; it is not. Cell 0 vs cell 79 have identical proscenium and cast x — the apparent growth is the title's `backOut` 0→1 (`act5.js:248`) plus `castBow`'s +8 px drop.
**Transition.** In: hard cut from reveal (diff 74.1, the largest cut in the segment). Out: gold flash `seg(lt,4.8,5.1)·0.7` → 145.48–145.78, **held at 70 % α to 146.00**, then hard cut.

**CONTINUOUS.**
1. Nine cast bows: `b = max(0, sin(beat·π − i·0.55))`, translate `b·8` px and rotate `b·0.22` rad (`act5.js:33-40`). **1.364 s cycle** (two 88 BPM beats); a 460 px figure's head travels ~100 px at b=1.
2. 160 confetti, 90–189 px/s fall + `sin(t·1.6+i)·24` sway (`props.js:58-72`).
3. 12 paper flowers, `frac(lt·0.18 + hash)` → 700 px in 5.56 s.
4. Curtain folds `sin(t+i)·5`.
5. Sunburst rotation `t·0.03` rad/s.
6. 30 dust motes.

**DISCRETE.**
- 140.83–141.38 title scales in.
- 141.08–141.48 `a paper singularity` fades.
- 141.28–141.78 `ENCORE! ENCORE!`.
- 141.68–142.18 `the company takes a bow`.
- **142.23–142.40 balloon pops** (scale 1→2.8, α→0) into 28 shards.
- 142.98–143.28 `POP!` fades.
- 145.48–145.78 gold flash ramp.

**Dead / soft.** No frozen runs. Soft: **141.87–142.13 (9 f, 0.30 s)**, **143.23–143.50 (9 f, 0.30 s)**, **144.57–144.87 (10 f, 0.33 s)** — spacing 1.36 s = one `castBow` cycle. Because `max(0, sin)` holds each character at 0 for half of every cycle, and the nine phases span 4.4 rad, the group periodically reaches a moment where most of the cast is on the flat part of its curve. The lulls are structural, not incidental.

**3+ independent layers?** Yes: bow + confetti + flowers + curtain sway + title. This is the most continuously alive shot in the segment (median 2.63, no frame below 0.5 for 3+ consecutive).

**Authored detail.** `THE PAPER SINGULARITY` on the valance; the sticker's tape tab; the balloon's string quadratic; the pop's 28 shards in four colours; the individual bow phase `i·0.55` so the line ripples instead of pulsing; the footlight glow discs; the `POP!` in Permanent Marker with an ink stroke.

**Flaws.**
1. **No camera for 5.32 s.** A finale wide with a locked frame. Storyboard §51 promises "wide, slow push; cut to close-ups on the beat" — there is no push and no close-up.
2. **The last 0.5 s is a 70 % gold wash** (145.48→146.00) that hides the cast mid-bow. The shot ends on a colour, not on a performance.
3. The cast is a single row at one depth: nine characters, one baseline (y=938), one scale band .58–1.9. No depth stagger, no overlap, no foreground.
4. The two cloud guards at 1520/1720 are drawn with `zzz`/`sleep` — they sleep through the curtain call, which is a gag, but they are also the two rightmost figures and the least readable.
5. The paperclip at s 1.9 reads as a large "0", not a paperclip, at 384 px wide cells.
6. `THANK YOU` sticker is present from frame 1 (no alpha), so it pre-empts the title it is supposed to punctuate.

### 50 · finaldance · 146.00–151.00 · 5.00 s · 150 frames (4380–4529)

**Set.** `kitBg('#2A0710','#0B0610')`; giant sun `bigSun(960,480,260)` (`scene_kit.js:30-35`); sunburst `(960,480,100,1050,40)` rotating `t·0.05`; stage floor; two curtains; gold stage strip; `floorPlane(890)`; three 1000 px spotlights.
**Cast.** 9, at x = **110, 290, 470, 650, 890, 1080, 1270, 1470, 1700**, y=940 (`act5.js:286-305`): chinchilla, gato, MIRA, paperclip (s 1.7), SOL, shoggoth, basilisk, cloud guard, **gato again at `t+1.3`** (out of phase).
**Props.** 4 sparklers at (170,810), (1750,800), (70,940), (1860,930), each 16 spokes at 3 Hz (`sin(t·19)`); 130 confetti; 30 dust.
**Type.** `P(DOOM) 100%` stamp at (1420,280) (`act5.js:322-329`); `WE ARE SO BACK` sticker at (1580,760); `CLAUDE POP · LIVE` 15 px mono at (90,150); `one night only / the end of the world` 11 px mono at (90,176).
**Camera.** `orbit = sin(lt·0.7)·50`; the whole set + cast translates **±50 px horizontally** (`act5.js:268-320`). Period 8.98 s; over 5 s it goes 0 → +50 (at 2.24 s) → 0 (at 4.49 s) → −17 (at 5.0 s). **No rotation, no z, no parallax.**
**Transition.** In: hard cut from the gold wash (diff 103.3). Out: cream flash `seg(lt,4.35,4.7)` → **150.35–150.70, then 7 frames at α 1.0 (150.73–150.97)**, hard cut to the dark desk at 151.00.

**CONTINUOUS.**
1. ±50 px sway (5.2 % of frame width peak-to-peak: 100 px).
2. Nine cast jumps `|sin(beat·π+i·0.6)|·(10 + i%3·4)` → **10–18 px** vertical, plus ±0.04 rad roll (`act5.js:299-301`).
3. 4 sparklers at 3 Hz.
4. 130 confetti.
5. Sunburst `t·0.05`; curtain folds `sin(t+i)·5`.
6. 30 dust.

**DISCRETE.**
- 146.40–146.90 `CLAUDE POP · LIVE` fades.
- **147.55–147.75** stamp slams: scale 2.4→1 with `easeIn`, α 0→1, plus a 0.3 α red flash for 0.14 s.
- 148.30–148.70 `WE ARE SO BACK` fades.
- 150.35–150.70 cream flash ramps to 1.0.

**Dead / soft.** **Frozen 4522–4528 = 150.73–150.97, 7 frames, 0.23 s, flat cream.** Soft 4446–4450 = 148.20–148.37 (5 frames) between the stamp landing and the sticker.

**3+ independent layers?** Yes (sway + jumps + sparklers + confetti), but all are small: the largest sustained motion is confetti at 3–6 px/frame. The shot's own camera contributes 100 px over 5 s.

**Authored detail.** The **second gato at `t+1.3`** so the two ends of the line are never in phase; the paperclip spinning `sin(t·2)·0.15`; sparklers with alternating gold/cream spokes; the stamp's 2.4→1 `easeIn` with a red flash (a slam, not a fade); `one night only / the end of the world` as an 11 px sub-line under the live slug.

**Flaws.**
1. **It is the curtain call again.** Same 9 characters, same order, x within **20–60 px** of `curtain` (`act5.js:286-305` vs `218-228`), same single baseline, same radial burst centre (960,480 vs 960,620), same confetti, same bow/bob driver (`|sin(beat·π)|`). Only the backdrop colour and the text change. Against the studio's "one image, one shot" rule this is a repeat.
2. **The "360 orbit" is a ±50 px sway.** Storyboard §52 promises "360 orbit, crash zooms"; the code has one `sin` translate and no rotation or z.
3. **7 frames of flat cream, then a hard cut to a dark desk.** The flash reaches α 1.0 at 150.70 and is held to 151.00; the cut is 134.5 mean diff. Cut on the first α-1.0 frame and the flash becomes a transition instead of a dead tail.
4. **The P(DOOM) ticker floats on the white flash.** `drawDoomTicker` runs after `drawScene` (`timeline.js:64`), so the black 246×96 box is visible on every cream frame (`cuts-30/c51` cells 25–30).
5. The two outer sparklers at (70,940) and (1860,930) are outside the proscenium (x 120–1800) and sit on the curtains; only the wing pair at 170/1750 is on the stage.
6. The rightmost gato at x=1700 is drawn **on top of** the right curtain band (which covers 1696–1950), so it reads as standing in front of the curtain, off the stage, and the bookend gag is lost.

### 51 · desk · 151.00–156.62 · 5.62 s · 168 frames (4530–4697)

**Set.** `drawDesk` (`scene_kit.js:476-523`): wood gradient, 1000×560 cutting mat at (960,700) with a 40 px grid and −26/−16/14/24 edge numbers, laptop, mug, sunflower in a jar, pencil, glue, `SOL / SHEET 01` character sheet at (390,690), `CLAUDE POP / a paper singularity` script page at (1520,800). Desk lamp at (120,800) with a two-segment arm.
**Cast.** Human MIRA at (640,870), s .72, cream coat, `lean .16`, `look [1,.1]`, right arm `[-1.55,.25]` after lt 3.5 (`act5.js:346-353`).
**Type.** 8 credit lines at x=76, y=170+28i: 24 px Archivo Black for `CLAUDE POP`, 14 px DMMono for the rest, each `seg(lt,at,at+.35)` (`act5.js:398-419`). Final card at lt 4.9: `made of paper` 128 px Instrument Serif italic at (960,560), flower at (960,680), `CLAUDE POP · 2026` at (960,800), barcode at (1550,930), `0 2026 15662 9` at (1620,1000), `no pixels were harmed` at (90,990).
**Camera.** `z = 2.6 − 1.6·easeOut(seg(lt,0,2.0))` about (1000,580) → **2.60 → 1.00, 62 % scale change in 2.0 s** (`act5.js:342`). Static for the remaining 3.62 s. The anchor is 40 px right and 40 px below the frame centre, so the pull is not centred.
**Transition.** In: hard cut from full cream to a tight crop of the laptop screen (diff 134.5). Out: cream card fade 155.90–156.30, then a 0.32 s hold.

**CONTINUOUS.**
1. The 2.6× pullback, 151.00–153.00 (the only large motion).
2. Mug steam `sin(k·0.7 + t·2 + i)·5` → 3.14 s period, ~10 px (`props.js:218-225`).
3. Laptop mini-stage: a 336×220 re-render of the film's own stage, red sky / gold sun / blue water / `CLAUDE` `POP` / 28 scanlines, with a mini-SOL bouncing `|sin(beat·π)|·3` at s 0.2 (`scene_kit.js:274-288`).
4. 24 dust motes at α .25 (drawn *over* the end card, `act5.js:436`).
5. P(DOOM) absent (`noDoom: true`, `act5.js:340`).

**DISCRETE.**
- 153.00 `CLAUDE POP`; 153.20 `a paper singularity`; 153.35 blank; 153.45 `words & music: the internet`; 153.70 `paper, code & performance: SOL`; 153.90 `special thanks: MIRA, GATO, CLIP`; 154.10 `no pixels were harmed`; 154.30 `© 2026 paper singularity` — 8 fades of 0.35 s.
- **154.50** MIRA's right arm swings to −1.55 rad (`act5.js:350`).
- **155.00–155.55** laptop lid closes: `lidH = 220·(1−close)`, a vertical squash from the hinge (`act5.js:373-389`).
- 155.55 `click` 16 px italic (`act5.js:387`).
- **155.75** lamp off (`lampOn = lt < 4.75`) and small SOL peeks at (1128,700) s .22 (`act5.js:391-396`).
- **155.90–156.30** cream card fades in (α 0→1, +120 px rise).

**Dead / soft.** **Frozen 4583–4650 = 152.77–155.03, 68 frames, 2.27 s** (mean 0.13–0.35). Then 155.07–155.37 (9 f), 155.43–155.77 (10 f), 155.83–155.93 (3 f), 156.30–156.53 (6 f). **96 of 168 frames (57 %) are below 0.5.** The 68-frame run contains all eight credit fades and MIRA's arm raise at 154.50 — each is a 14 px mono line at α ≤ .82 or a 122 px arm, so none reaches the 0.5 mean threshold.

**3+ independent layers?** Yes 151.00–153.00 (pullback + steam + mini-SOL + dust). **No 153.00–155.00**: only steam (~10 px, 3.1 s period), dust, and a 100 px mini-SOL bouncing 3 px on a screen that is itself 360 px wide. That is not three layers; it is one layer plus grain.

**Authored detail.** The **live mini-stage on the laptop** is the best detail in the segment — a 336×220 quote of the film's own set, with scanlines and a bouncing SOL; the mat's −26/−16/14/24 numbers; the printed `SOL / SHEET 01` with 5 ruled lines and a sun-haloed SOL; the second script page with 7 ruled lines; the pencil's pink eraser and black tip; the barcode `0 2026 15662 9` encoding the film's own duration; `no pixels were harmed` repeated on the card and in the credits; the print-mark frame counter still running on the cream card.

**Flaws.**
1. **2.27 s frozen.** The camera stops at 153.00 and the only subsequent events are eight sub-threshold fades. There is no event between 154.65 and 155.00 at all (0.35 s of nothing).
2. **The lid close is nearly invisible.** It **never exceeds 1.44 mean diff** in any of its 17 frames (155.00–155.55), and 14 of 17 are below 0.5, because a `#171412` lid closes over a dark screen. The beat is carried by a 16 px `click`.
3. **The hand never reaches the lid.** MIRA's hand is at ≈(735,555); the lid's left-top corner is (832,466) — **97 px left and 89 px below**, ≈7 hand-widths. She reaches at 154.50, the lid moves at 155.00, and the two never touch.
4. **The lamp-off does not darken the room.** `drawDesk`'s 900 px lamp pool is a static gradient independent of `lampOn` (`scene_kit.js:482-484`); only the shade colour and a 0.2 α pool change. Frame diff at 155.75 is **1.30** — the size of a type boil.
5. **The SOL peek gets ~0.15 s clean.** She appears at 155.75, the card starts at 155.90 and is 58 % opaque by 156.00 (88 % by 156.10). The best gag of the shot is covered almost immediately, and three events (lamp off, peek, card) land inside 0.15 s.
6. **MIRA reads as a paper cutout, not a person at a desk.** She stands on the cutting mat at the same scale as the laptop (386 px tall vs a 360 px-wide laptop), with no chair, no seated posture, and no hand on the keyboard. The storyboard's "MIRA (human) watches" is not staged.
7. **Credits, lid, peek and card are drawn outside the camera transform** (`act5.js:373-435`) and only line up because z == 1.0 after 153.00. Any change to the 2.0 s pullback silently misaligns four elements.
8. **The 14 px credits cannot be read at review scale.** In a 320 px cell they are ~2.3 px tall — the 15 fps sheet cannot verify them, so the review has to trust the code.
9. **The hand is a blob.** MIRA's hand is a 14×20 px `blobPath` with no fingers or thumb (`characters.js:728`) — 1.5 % of her 386 px height — and the near arm is drawn after the head (`characters.js:720`), so the raised arm passes within ~10 px of her jaw. It cannot sell a grasp.

## What to copy / what to fix

**Copy.**
- The **breath → reveal flash cut**: 0.35 α cream decaying over 0.22 s hides a 115.9 mean-diff cut and costs nothing.
- The **reveal pullback that reveals text**: the `STAGE B / AFTER THE SHOW` note starts at x = −404 and arrives because the zoom is 1.55×. Text revealed by camera, not by fade.
- The **`?` card hand-off**: three lyric cards fall on staggered 0.55 s ramps, the last at 139.07, and a `backOut` `?` lands at 139.12–139.47 — one image replaces three, on the word.
- The **balloon pop at 142.23** — a real discrete event inside a long wide: 1→2.8 scale, α→0, 28 shards, 0.17 s.
- The **laptop mini-stage** (`scene_kit.js:274-288`): a 336×220 self-quote with scanlines. Cheapest possible "the film is an artefact" line.
- The **`castBow` per-character phase** `i·0.55`: nine figures, one function, a ripple instead of a pulse.
- The **barcode that encodes the runtime** (`0 2026 15662 9`).

**Fix.**
- `reveal` 139.67–140.67: give the last second an event — the stagehand's sandwich reaches the mouth, or the small SOLs step off the flat, or MIRA turns her head. One ≥2.0 diff per 0.4 s.
- `reveal`: widen the zoom's start to 1.45 or move the `ALL FOR` card to x=1380 so its right edge stays inside 1920 at z 1.55.
- `reveal`: give the stagehand a `t` (a 0.9 s sandwich lift is enough) and actually split the SOL costume (two halves with a 12 px gap, not a crack line).
- `curtain`: add a camera. A 1.06→1.14 push over 5.32 s would break the lock without re-blocking; or honour the storyboard's "cut to close-ups on the beat" with two 0.9 s inserts.
- `curtain`: end on the bow, not on the wash — move the gold flash to 145.85–146.00 at α .45, or hold the flash at .35 so the cast stays readable.
- `curtain`: replace `max(0, sin)` with `0.5−0.5·cos(2π·beat − i·0.55)` so each figure is always moving; this removes the three 0.30 s lulls.
- `finaldance`: re-block. Move ≥4 of 9 cast off the baseline (y 880/940/1000), change the burst centre to (960,300), and give it a different motion signature (a lateral step-touch, not a vertical bob). Target: ≤4 of 9 x-positions within 60 px of `curtain`.
- `finaldance`: make the orbit real — rotate the set ±4° or move ±180 px in x **and** ±40 px in y with the cast parallaxed at 0.6×.
- `finaldance`: cut on the first α-1.0 flash frame (150.70) instead of holding 7 flat frames.
- `timeline.js`: draw the flash above the ticker, or move `drawDoomTicker` inside the scene's flash.
- `desk`: shorten the pullback to 1.6 s so the credits start at 152.6, and put one event at 154.6 (MIRA's hand reaches the lid, the mug steams harder, the mini-SOL jumps out).
- `desk`: make the lid close visible — light the screen's edge, add a 12 px cream seam that narrows, and hold the `click` for 0.25 s at 22 px.
- `desk`: put MIRA's hand **on** the lid: hand at (860,470) when the lid starts, or move the lid's hinge to (760,700) so the reach lands.
- `desk`: darken the room on lamp-off — multiply the scene by 0.72 for 0.3 s, or gate the `drawDesk` lamp pool on `lampOn`.
- `desk`: give the SOL peek 0.5 s clean — start the card at 156.25, not 155.90.
- `desk`: seat MIRA or put her at 0.55 scale behind the mat so she is a person at a desk, not a figurine on it.
- `desk`: raise the credits to 18 px and drop to 7 lines (merge `no pixels were harmed` into the card), so they survive a 1/6-scale review.

## Rules for the test version (numbers, not adjectives)

1. **No frozen stretch.** No run ≥ **12 frames (0.40 s)** with mean |ΔY| < 0.5 on the 192×108 reduction. `reveal` (30 f) and `desk` (68 f) both fail. Every 0.40 s window must contain one event ≥ **2.0** mean diff.
2. **Three moving layers, one of them big.** Every shot must have ≥ **3** independent moving layers, and at least one must displace ≥ **19 px/s** (1 % of frame width) or scale ≥ **1.5 %/s**. Dust, grain, type boil and the frame counter do not count. `desk` 153.0–155.0 has one real layer.
3. **No repeated staging.** Two adjacent shots may not place ≥ **7 of 9** cast within **60 px** in x, nor share a radial-burst centre within **160 px**, nor use the same motion driver. `curtain`→`finaldance` is 9/9 within 60 px and both bursts sit on x=960, y 620 vs 480 (140 px apart).
4. **A camera move is a number.** Every shot declares a camera with a measured displacement: **|Δx| or |Δy| ≥ 8 % of frame width (154 px)**, or a **z ratio ≥ 1.25**, or a **rotation ≥ 3°**. `finaldance`'s ±50 px (2.6 %) fails; `reveal` 1.55→1.00 and `desk` 2.60→1.00 pass.
5. **Contact lands.** A hand acting on an object must be within **0.5 hand-widths** of it at the contact frame. `desk`'s hand is 97 px from the lid (≈7 hand-widths). A contact beat must also change the picture: **≥ 2.0** mean diff on ≥ **60 %** of its frames.
6. **No flat-colour tail.** No shot may end with ≥ **6 frames (0.20 s)** of a single flat colour. If a flash is used, cut on the **first α-1.0 frame**. `finaldance` holds 7.
7. **Flashes cover the furniture.** A full-frame flash must be composited above the ticker and print marks, or those layers must be suppressed. No black box on a white frame.
8. **A payoff gag gets 15 frames.** Any final-reveal beat must be unobstructed for ≥ **0.50 s (15 frames)** before a covering element starts. `desk`'s SOL peek gets ~5.
9. **Type survives 1/6 scale.** Credits ≥ **18 px** at 1080p (≥ 3 px x-height at a 320 px cell) and ≤ **7 lines** per card. Anything smaller must be duplicated in the review report.
10. **One transform per set.** Set, props, cast, credits and contact props share one camera transform, or the transform must be provably identity at that time. `desk` has four elements outside the transform that only align because z == 1.0.
