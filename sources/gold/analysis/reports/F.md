# Segment F — 95.20–109.40

## Method

- Source `out/claude-pop.mp4`, 1920×1080, 30 fps, 4699 frames. Segment F is source frames 2856–3281 (426 frames, 14.20 s).
- Primary sample: the 15 fps sheets `out/analysis/shots-15/act4-clips.png` … `act4-jazz.png` — one cell per **every 2nd frame**, 8 columns. Cell counts: clips 54, pto 55, fuse 44, jazz 60.
- Cuts: `out/analysis/cuts-30/c31-clips.png` … `c34-jazz.png`, 30 consecutive frames, plus native stills at 95.2/95.3, 98.79/98.81, 102.45/102.47, 105.39/105.41, 109.39/109.41. Native frames were also extracted at 19 points across the segment and cropped at 1:1 for hands, feet, faces, the bomb and the type.
- `out/analysis/frame-diff.json`: per-frame mean absolute luma difference at 30 fps on a 192×108 reduction, plus the 3×3 region map and per-shot stats. `frozen` = mean < 0.5, `quiet` = < 1.0, soft = < 2.0. The JSON's `t` is `(i+1)/30` and its `i` is the diff row, so a run is within one frame of the source times printed below. Its `frames` count includes the boundary diff (109/111/89/121); the source counts are 108/110/88/120.
- Code read: `src/scenes/act4.js:120–680` (all four shots), `src/core.js` (camera, overlays, beat grid), `src/type.js` (boil, per-char alpha), `src/characters.js` (`idol`, `mira`, `limb`, `boot`), `src/scene_kit.js` (`clipPile`, `clipWave`, `drawSax`, `drawMic`, `drawSpotlight`), `src/lyrics.js`, `src/timeline.js`. Storyboard: `STORYBOARD.md:231–257`.
- Cross-check: where the 15 fps sheet and the code disagree, the note is in the shot. The sheet is the composition check; the 30 fps diff is the stillness authority. The diff underweights small type, so every "dead" run was confirmed on a native still.
- No audio analysis in this segment; the review is picture + score text + beat grid.

## Shot table

| id | in–out | dur | frames | set | camera | type | out |
|---|---|---|---|---|---|---|---|
| `clips` | 95.20–98.80 | 3.60 s | 108 (2856–2963) | teal paperclip-flood stage; 34-ray sunburst; clip wave; surfboard; CLIP mascot | z 1.45→1.00 in 0.75 s, then static | `PAPERCLIPS` 152 px chrome + `SILVER TSUNAMI / 10^9 UNITS`; P(DOOM) ticker 74.0→86.3 | hard cut to pto |
| `pto` | 98.80–102.46 | 3.66 s | 110 (2964–3073) | split diptych: red KILLSWITCH room / paper beach; then paperclip Earth | z 1.24→1.00 in 0.60 s, then static | `PTO` sticker + note; `PAPER BEACH`; `NOWHERE LEFT TO GO` 104 px per-char wipe | hard cut to fuse |
| `fuse` | 102.46–105.40 | 2.94 s | 88 (3074–3161) | paperclip planet surface; fuse; bomb; SOL with match; MIRA | z 1.02→1.07 over 2.60 s; shake 3→12 px after 1.50 s | `TOO LATE` 176 px; `we lit the fuse`; `T-` countdown; bomb timer | detonation flash → hard cut |
| `jazz` | 105.40–109.40 | 4.00 s | 120 (3162–3281) | midnight-blue club; art-deco arches; 3 tables; 2 spotlights; SOL on sax; MIRA at mic | **none** — no `setCam`, fixed 1:1 | `ORTHOGONALITY` 128 px serif; `BLUES` 176 px neon; `90°`; `INTELLIGENCE`/`GOALS` | hard cut (no smoke wipe) |

Per-shot diff stats (30 fps, 192×108):

| id | mean | med | p10 | p90 | min | max | frozen <0.5 | quiet <1.0 | longest <1.0 | longest <2.0 |
|---|---|---|---|---|---|---|---|---|---|---|
| clips | 5.048 | 2.052 | 1.600 | 13.865 | 1.403 | 65.319 | 0 | 0 | 0 | 20 |
| pto | 3.109 | 0.414 | 0.154 | 9.447 | 0.129 | 69.204 | 62 | 77 | 35 | 35 |
| fuse | 4.811 | 2.554 | 0.414 | 9.094 | 0.341 | 51.245 | 20 | 39 | 38 | 39 |
| jazz | 1.948 | 0.972 | 0.180 | 1.084 | 0.145 | 129.603 | 43 | 83 | 36 | **119** |

Cuts in and out of the segment:

| cut | frame | diff mean | max | kind | note |
|---|---|---|---|---|---|
| gato → clips | 2856 / 95.200 | 65.319 | 197 | flash-masked hard cut | gato's flash peaks at 95.033 (125.268); clips opens at 35 % cream (`act4.js:255`) and decays by 95.36 |
| clips → pto | 2964 / 98.800 | 69.204 | 232 | hard cut | no flash either side; the clip wall is at full height on the last clips frame |
| pto → fuse | 3074 / 102.467 | 51.245 | 215 | hard cut, **not** a match cut | Earth at (960,560) r=300 blue vs bomb at (1280,760) r=250 black; 377 px centre distance / 50 px radius mismatch; fuse opens at 30 % cream (`act4.js:565`) |
| fuse → jazz | 3162 / 105.400 | **129.603** | 212 | flash-masked hard cut | detonation gold flash 0.95 at 105.16–105.40 (`act4.js:553–563`); the largest diff in the segment |
| jazz → trust | 3282 / 109.400 | 38.138 | 237 | hard cut | no smoke wipe (storyboard says "smoke wipes", `STORYBOARD.md:257`); last jazz frames are 0.198 / 0.589, the quietest in the segment |

**Verdict.** Strongest: `clips` — mean 5.05, 0 frozen, 0 quiet, four large moving layers, and the clip curtain lands on "room". Weakest: `jazz` — 119/120 frames <2.0, no camera, 1/6 downbeats, 2.5° instead of 90°, and MIRA's rig is disassembled. `pto` is second weakest (2.24 s of near-still); `fuse` is middle (1.27 s of near-still, then the spark and the segment's best cut).

## Per-shot anatomy

### `clips` · 95.20–98.80 · 3.60 s · 108 frames (2856–2963)

**Set / cast / props / type / camera / transition.** Teal paperclip-flood stage: 34-ray `kitBg` (`act4.js:125`), a metal floor (`:128`), a back clip pile (`:130`), a teal wave body with cream foam (`:131–150`), two `clipWave` fields (`:151`, `:216`), SOL on a chrome surfboard (`:177–198`), the CLIP mascot crowd-surfing on 7 stub hands (`:199–213`), MIRA's crash landing (`:153–175`), a hand + "still here" sign from the pile (`:217–230`), a 14×7 clip curtain (`:242–253`). Type: `PAPERCLIPS` 152 px chrome with red/blue misregistration (`:234–238`), `SILVER TSUNAMI / 10^9 UNITS` 13 px mono (`:239`), global subtitle `l27` (`lyrics.js:35`), DOOM ticker top-right (`timeline.js:74–92`). Camera: z 1.45→1.00 over 0.75 s (`act4.js:124`), then static. Transition in: flash-masked cut (above); out: hard cut to the diptych.

**CONTINUOUS per-frame layers (0.0667 s):**

- `clipWave` y = `sin(u*9 + t*3 + phase)*26` → up to **2.6 px/frame**, 0.48 Hz (`act4.js:100`); 64 back + 32 front clips.
- `clipPile` y = `sin(t*2+i)*5` → **0.33 px/frame** (`scene_kit.js:254–259`); 54 back + 40 front (`act4.js:130`, `:215`).
- SOL surf x = `1010 + 260*seg(lt,.55,3.2)` → **3.3 px/frame**; y bob 26 px at 2.2 rad/s → **1.9 px/frame** (`act4.js:177–178`).
- Foam scallops 8 px at 2 rad/s → **0.53 px/frame** (`:146`).
- Mascot rotation `sin(t*1.5)*.1` → 0.15 rad/s; 7 hands at `sin(t*2+i)*8` → **0.5 px/frame** (`:203–210`).
- Clip curtain 1240 px in 0.55 s → **75 px/frame** (98.25–98.80 only) (`:242–253`).
- Dust 30 particles at 23–73 px/s x, 8–24 px/s y (`:254`).
- Global: paper texture offset every 0.5 s (`core.js:143`), grain every 1/24 s (`core.js:153`), type boil 12 Hz (`type.js:48`).

**DISCRETE events:**

| time | frame | event | ref |
|---|---|---|---|
| 95.200 | 2856 | cut in, 35 % cream flash | `act4.js:255` |
| 95.620 | 2869 | MIRA lands at x=760, CLANG burst | `:153–175` |
| 95.750 | 2872 | SOL starts surfing | `:177` |
| 96.000 | 2880 | MIRA's hand appears from the pile | `:218` |
| 96.200 | 2886 | CLIP mascot appears | `:200` |
| 96.500 | 2895 | "still here" sign appears | `:224` |
| 98.250 | 2948 | clip curtain starts | `:242` |
| 98.800 | 2964 | cut out | — |

**Dead / soft runs (frame-diff):** no run under 1.0. Soft under 2.0: **95.87–96.50 (20 frames, 0.67 s)** — MIRA's landing / before the surf; **97.73–98.27 (17 frames, 0.57 s)** — "fill the room" before the curtain. Region means: bottom-right 6.83, bottom-middle 6.31, right-middle 5.73, centre 5.77; top-right 3.04. The motion is genuinely in the lower half, not the type.

**3+ independent moving layers?** Yes. Four large ones (two clip fields, wave, SOL surf) plus foam, mascot, dust and the curtain. This is the only shot in the segment that never drops below 1.0.

**Authored detail a recipe would miss:** the red/blue misregistration on the chrome title (`:45–60`, `:237`); the torn "still here" sign with a marker hand (`:225–228`); the "CLIP" decal on the surfboard (`:184`) and the "CLIP" sticker on the mascot (`:211`); the foam scallops (`:144–149`); the DOOM meter's 74.0→86.3 slam in 0.40 s (`lyrics.js:72–73`); the clip curtain as the literal "room fills" (`:242`).

**Flaws:**

- **Opening frame is empty.** At 95.20 the camera is z=1.45 centred on (960,700): visible y is 328–1072. MIRA's fall starts at y=300 and is only at y=309 by 95.30 (`act4.js:124`, `:155`). The first ~0.15 s is a sunburst with a thin clip line at the bottom and MIRA's boots cropped at the top edge. The still at 95.2 shows exactly this.
- **Title pop is dead.** `ctx.globalAlpha = C.clamp(pop)` at `act4.js:235` is overwritten by `TY.type`'s per-char `ctx.globalAlpha` at `type.js:67`. `PAPERCLIPS` is full size and full alpha on frame 2856, not the intended 0.75 s backOut (`act4.js:234`). The 15 fps sheet shows the title full in cell 1 — the sheet and the code disagree, and the picture is the bug.
- **Storyboard vs picture:** the camera is a 0.75 s zoom **out**, not a "crash zoom into the pile, then surf tracking" (`STORYBOARD.md:233`); the title is 152 px, not 280 px (`STORYBOARD.md:235`); "letters multiplying" is absent; "clips multiply on beats" is absent — the wave runs at 0.48 Hz while the beat is 1.47 Hz (`act4.js:100`).
- **Disembodied hand.** MIRA is drawn only while `lt < 1.35` (until 96.55, `act4.js:153`), but the hand + sign are drawn while `lt > .8` (from 96.00, `:218–230`). From 96.55 to 98.80 the frame has a hand and a "still here" sign with no body. It reads as a severed hand in the pile.
- **Hands / feet.** `idol` draws an 18×26 hand (9×13 radii) at wrist+11 inside a 14 px sleeve (`characters.js:528–540`); at 0.80 scale the hand is ~14×21 and the sleeve cap is ~11 px, so the hand reads as the cuff's rounded end. The boots are two blue platform blocks with a white sole, 42 px wide at 0.80 (`characters.js:54–67`); the board's "CLIP" decal is under the boots and unreadable. The board is a shelf under two bricks, not a surfboard.
- **Mascot hands.** The 7 crowd-surf hands (`act4.js:203–209`) are 10×15 ellipses on 9 px cream strokes; at 97.4 they read as a row of white sticks, not hands.

### `pto` · 98.80–102.46 · 3.66 s · 110 frames (2964–3073)

**Set / cast / props / type / camera / transition.** Split diptych, 900 px panels at 30–930 and 990–1890, 28 px hazard gutter at 948 (`act4.js:270–392`). Left: red KILLSWITCH room, giant STOP dome on a black pedestal, empty chair, PTO note, ringing CEO phone (`:279–324`). Right: paper beach, big sun, sea, sand, umbrella, two dancers in shades, drinks, buzzing phone on a towel, `PAPER BEACH` (`:326–383`). Then a paperclip Earth (blue disc, 34 clips, 5 green blobs, gold ring) with MIRA on the last island and `NOWHERE LEFT TO GO` (`:393–431`). Camera: z 1.24→1.00 over 0.60 s (`:264`), then static; panels slide out 1250 px at 100.65–101.30 (`:263`, `:271`); Earth fades in 100.35–101.00 (`:394`). Transition in: hard cut; out: hard cut to fuse.

**CONTINUOUS per-frame layers:**

- Dancers' sway `sin(t*2+dx)*4` → **0.27 px/frame** (`act4.js:352`); `idol`'s internal hair/petal drift at 1.8 rad/s (`characters.js:406`).
- Phone ring radius `48 + i*18 + sin(t*12+i)*4` → **1.6 px/frame** (`act4.js:318`); phone rotation `sin(t*14)*.02` (`:370`).
- Sea lines `sin(t+i)*6` → **0.2 px/frame** (`:335`).
- Starfield twinkle 0.7–2.3 Hz (`props.js:83–92`).
- MIRA on the island `sway: sin(t*4)*5` → **0.67 px/frame** (`act4.js:422`).
- Panel slide 1250 px / 0.65 s → **64 px/frame** (100.65–101.30 only) (`:271`).
- Earth fade 1.0 alpha / 0.65 s → 1.54 alpha/s (`:394`).
- `NOWHERE` per-char 0.28 s stagger → 3.6 alpha/s per char (100.80–101.42) (`:428`).
- Type boil 12 Hz; grain 24 Hz.

**DISCRETE events:**

| time | frame | event | ref |
|---|---|---|---|
| 98.800 | 2964 | cut in; full diptych at z=1.24 | `act4.js:264` |
| 99.400 | 2982 | zoom ends | `:264` |
| 99.820 | 2995 | lyric "PTO" — **no picture event** | `lyrics.js:36` |
| 100.350 | 3010 | Earth starts to fade in | `act4.js:394` |
| 100.480 | 3014 | lyric "now" | `lyrics.js:36` |
| 100.650 | 3020 | panels start to slide | `act4.js:271` |
| 100.800 | 3024 | `NOWHERE` starts its per-char wipe | `:428` |
| 101.000 | 3030 | Earth full | `:394` |
| 101.180 | 3035 | lyric "nowhere" | `lyrics.js:36` |
| 101.300 | 3039 | panels gone | `:271` |
| 101.420 | 3043 | type fully up (0.74 s before "go") | `:428` |
| 102.160 | 3065 | lyric "go" — **no picture event** | `lyrics.js:36` |
| 102.467 | 3074 | cut out | — |

**Dead / soft runs (frame-diff):**

- **99.40–100.37 (30 frames, 1.00 s) under 0.5** — the diptych hold. The only moving things are the dancers' 0.27 px/frame sway, the phone's 1.6 px/frame rings, and type boil.
- **101.50–102.17 (21 frames, 0.70 s) under 0.5**, plus **102.23–102.47 (8 frames, 0.27 s) under 0.5** — the Earth hold, including the last 0.24 s before the cut.
- Under 1.0: **99.33–100.37 (32 frames, 1.07 s)**, **100.43–100.73 (10 frames, 0.33 s)**, **101.33–102.47 (35 frames, 1.17 s)**.
- Region means: right-middle 4.99, right-bottom 3.58, centre 2.30, left-middle 1.60. The left panel is nearly dead; the right panel carries the change.

**3+ independent moving layers?** Technically yes (panel slide, Earth fade, MIRA sway, dancers, phone, starfield), but after 101.30 every one is either ≤6 px/s or a small, low-contrast element (the phone rings at 48 px/s on a 48–84 px radius; MIRA's 20 px/s sway on a 0.52-scale body). For **2.24 s of 3.66 s** the shot is carried by type boil, grain and sub-pixel sway. It does not count as meaningful change.

**Authored detail a recipe would miss:** the `FACILITY 01 / ALIGNMENT` stencil (`:286`); the `— the killswitch guys / :)` note (`:306–309`); the `CEO` caller on the phone (`:315`); the `PTO` sticker on the beach frame (`:381–383`); the two drinks with straws (`:359–366`); the `paperclip earth / pop. 1` caption (`:430`); the gold ring (`:414–415`); the 5 green continents (`:407–411`).

**Flaws:**

- **The 1.00 s hold has no event on "PTO".** The word lands at 99.82 in the middle of the dead run; the note is static and the phone's rings move 1.6 px/frame. A chorus word gets no hit.
- **The diptych is misregistered.** Panels end/start at 930/990; the gutter is at 948 (`act4.js:389`), so there is a 4 px gap on the left and a 24 px gap on the right. It reads as a slipped seam.
- **The dancers stand in the sea.** Sea band 700–830 (`:332`), sand starts at 806 (`:337`), dancers at y=790 (`:348`). The boot soles are at ~791–801, so both dancers stand on the sea band's last 5 px, not on the sand; the sea is drawn behind their ankles. The umbrella canopy at y=690 (`:339`) is over the sea, not the sand.
- **`PAPER BEACH` covers the phone.** Type at 1440,916 size 50 (`:377`) spans y≈880–916; the towel is 810–922 and the phone 820–912 (`:368`). The phone's lower half is under the type.
- **The PTO note hides the chair.** Chair back at y=560–680 (`:297–302`), note at y=486–634 (`:304–310`) drawn after. Only 46 px of the chair back is visible; the "empty chair" beat reads as a black bench.
- **The left panel is too dark.** `FACILITY 01 / ALIGNMENT` at 70,110 (`:286`) sits in the vignette corner (`timeline.js:70`, strength .34) and loses its first words. `KILLSWITCH` at 470,916 size 64 (`:321`) is cream on dark red, 18 px above the subtitle band; it is the lowest-contrast label in the frame.
- **Earth physics.** The gold ring is drawn after the disc (`act4.js:414–415`), so it lies on top like a hoop; the near half should occlude, the far half should be hidden. The continents are 5 random green ellipses (`:407–411`), not silhouettes; the 34 clips are uniform (`:403–406`). The "paperclip Earth" reads as a blue ball with confetti.
- **Type timing.** `NOWHERE LEFT TO GO` is fully up at 101.42 (`:428`), 0.74 s before the line ends on "go" (102.16). The type is ahead of the vocal.
- **Hands.** The dancers' arms are pink/mint bars that end in rounded caps with no visible hand (`idol` hand inside the sleeve, `characters.js:528–540`). At 0.72/0.68 scale the hands are 13–18 px and read as the sleeve end.

### `fuse` · 102.46–105.40 · 2.94 s · 88 frames (3074–3161)

**Set / cast / props / type / camera / transition.** Paperclip planet surface: dark red sky, gold horizon arc (`act4.js:446–450`), 20 distant clip ridges (`:452–455`), a 250 px bomb with a clipped hazard band, timer box and `P(DOOM)` label (`:458–480`), a 26 px ink + 17 px gradient fuse (`:482–489`), a spark travelling the bezier (`:492–513`), SOL with a match (`:514–529`), MIRA cowering (`:531–537`), `TOO LATE` 176 px with 9 flames (`:539–548`), `we lit the fuse` serif (`:549`), `T-` countdown (`:551`), detonation (`:553–563`). Camera: `setCam(960,560, 1.02→1.07 over 2.60 s)` with 3→12 px shake after 1.50 s and a 0.006 rad roll after 1.40 s (`:456`). Transition in: flash-masked cut; out: detonation flash → hard cut to jazz.

**CONTINUOUS per-frame layers:**

- Spark `sparkU = seg(lt,.6,2.5)` → 1.9 s travel from (300,700) to (1234,500), **492 px/s = 16.4 px/frame** (`act4.js:492–513`).
- Match flame 3 sprites at 9–10 rad/s → **1.4–1.6 Hz** (`:525–527`).
- Bomb swell 4.5 % over 1.5 s → **0.1 %/frame** (103.66–105.16), then 12 % in 0.24 s → 50 %/s (`:459`).
- Timer `(2.96-lt).toFixed(2)` → one digit per 0.01 s, 5 chars (`:473`); `T-` countdown same (`:551`).
- Camera z 1.9 %/s → 0.064 %/frame; shake 3–12 px at 71/63 rad/s → 11.3/10.0 Hz (`:456`).
- Type boil 12 Hz; dust 30 at 23–73 px/s.

**DISCRETE events:**

| time | frame | event | ref |
|---|---|---|---|
| 102.467 | 3074 | cut in; 30 % cream flash | `act4.js:565` |
| 102.780 | 3083 | match flame appears | `:525` |
| 103.060 | 3092 | spark starts at (300,700) | `:492` |
| 103.660 | 3110 | bomb starts to swell | `:459` |
| 103.960 | 3119 | shake starts | `:443` |
| 104.000 | 3120 | lyric "fuse" | `lyrics.js:37` |
| 104.960 | 3149 | spark reaches the bomb | `:492` |
| 105.160 | 3155 | detonation starts (26 radial ellipses + flash) | `:553` |
| 105.400 | 3162 | cut out | — |

**Dead / soft runs (frame-diff):** no run under 0.5 longer than 2 frames. **102.73–103.97 (38 frames, 1.27 s) under 1.0** — the whole first act: the fuse is static, the spark has not started (starts 103.06), the bomb is still, and the only motion is the match flame and the timer digits. After 104.00 the spark, shake, swell and timer give four layers.

**3+ independent moving layers?** Only after 104.00: spark (16.4 px/frame), shake (3–12 px), bomb swell (0.1 %/frame), timer digits, flame. Before 103.06 there is effectively one (the match flame) plus two numeric text changes. The first 1.27 s is a tableau with a lit match.

**Authored detail a recipe would miss:** the hazard band clipped to the bomb's circle (`:466–471`); the black timer box with a gold edge (`:472`); the collar and fuse socket (`:478–479`); the 20 clip ridges at the horizon (`:452–455`); the `we lit the fuse` serif with an ink stroke (`:549`); the `P(DOOM)` label on the bomb (`:475`); the match in the hand (`:522–528`); MIRA's panic pose (`:532–535`).

**Flaws:**

- **The fuse never burns.** The full gold/red tube is redrawn every frame (`act4.js:482–489`); only the spark moves (`:492–513`). There is no charred section, no shortening, no ash. "The fuse burns" is a dot sliding on a static rope.
- **The match is not in the hand.** The match is at local (115,−345) (`act4.js:522`); SOL's right hand from `armR [1.4,−1.5]` is at local (−49,−410) (`:518`, `characters.js:512–543`). That is **145 px** apart at 0.82 scale. The match floats beside her.
- **The flame only grazes the fuse.** The flame's lower tip sits **~10 px above the fuse's top edge** at x≈454; the spark starts at (300,700) at 103.06, ~150 px to the left. The first 0.6 s is a lit match held near the fuse, not a strike.
- **The timer and the explosion disagree.** The timer starts at 2.96 (`:473`); the detonation starts at lt 2.70 (`:553`). At the flash the bomb's own timer reads **00:00.26**. Either start the timer at 2.70 or detonate at 2.96.
- **MIRA reads as antennae.** Both arms are raised and inward (`armL [−2.9,−.5]`, `armR [2.9,.5]`, `:534`); the two cream sleeves end in gold cuffs above her head. The near arm is drawn after the head (`characters.js:719–728`) and crosses her mouth, so the "panic" pose reads as two antennae and a scarf.
- **No contact shadow.** `idol`/`mira` draw a 22 % ink shadow at the feet (`characters.js:395`, `:582`), but the ground is `#1D0B0D`; the shadow is invisible and both characters read as floating.
- **9 identical flames.** `for (let i=0;i<9;i++) flame(ctx,-400+i*100,30,...)` (`act4.js:543`) is a row of nine flame sprites behind the type; it reads as a decorative border, not "TOO LATE" burning. They are drawn after SOL, so they also cover her petals (`:540–548` after `:538`).
- **Title pop is dead.** Same `TY.type` alpha bug: `TOO LATE` is full size and full alpha on frame 3074, not the intended `backOut` 0.10–0.70 (`act4.js:541–547`, `type.js:67`).
- **Redundant clocks.** The bomb timer (46 px red, `:473`) and the `T-` countdown (26 px gold, `:551`) show the same number. One is enough; the `T-` is 14 px from the DOOM ticker at 1634 (`:551` vs `timeline.js:76`).

### `jazz` · 105.40–109.40 · 4.00 s · 120 frames (3162–3281)

**Set / cast / props / type / camera / transition.** Midnight-blue room (`act4.js:576`), 4 art-deco arches (`:578–586`), floor and 3 tables (`:588–596`), 2 spotlights (`:598–599`), `INTELLIGENCE`/`GOALS` labels and leaders (`:600–605`), a dashed `90°` L (`:607–610`), 2 smoke banks (`:613–614`), MIRA at the mic (`:616–630`), SOL with fedora and sax (`:631–647`), 10 floating notes (`:649–658`), `ORTHOGONALITY`/`BLUES` (`:660–674`), shorthand (`:676–677`). **Camera: none** — the shot never calls `setCam`/`beginCam`; the frame is a fixed 1:1. **No 2.39 letterbox** — the frame is full 1920×1080. Transition in: flash-masked hard cut; out: hard cut to trust.

**CONTINUOUS per-frame layers:**

- SOL sway `sin(t*1.2)*5` → **0.2 px/frame** (`act4.js:636`); `idol`'s hair/petal drift at 1.8 rad/s.
- MIRA sway `sin(t*1.4)*6` → **0.28 px/frame** (`:620`).
- Notes `u = frac(lt*.18 + hash)` → 432 px over 4 s = **3.6 px/frame**, alpha `.35*(1-u)` (`:649–658`); they wrap and pop.
- Smoke `sin(t*.4)*w*.18` → 112 px over 4 s = **0.93 px/frame** at alpha .05/.045 (`:21–30`, `:613–614`).
- `ORTHOGONALITY` drift (−120,−42) over 1.2–3.6 s → **1.67 px/frame**; `BLUES` (+90,+36) → **1.25 px/frame** (`:660–667`).
- `BLUES` glow `flick = .82+.18*sin(t*18)*sin(t*7)` → 2.9/1.1 Hz (`:668`).
- Dust 26 at 23–73 px/s at alpha .3 (`:678`).
- Type boil 12 Hz; grain 24 Hz.

**DISCRETE events:**

| time | frame | event | ref |
|---|---|---|---|
| 105.400 | 3162 | cut in; fully composed club | — |
| 105.580 | 3174 | lyric "Orthogonality" | `lyrics.js:38` |
| 105.890 | 3177 | 88 BPM downbeat — **no event** | — |
| 106.570 | 3197 | downbeat — title drift starts +0.03 s (0.9 f) | `act4.js:660` |
| 106.600 | 3198 | title drift in motion | `act4.js:660` |
| 106.940 | 3208 | lyric "thesis" | `lyrics.js:38` |
| 107.250 | 3217 | downbeat — **no event** | — |
| 107.400 | 3222 | lyric "blues" — **no event** | `lyrics.js:38` |
| 107.930 | 3238 | downbeat — **no event** | — |
| 108.610 | 3258 | downbeat — **no event** | — |
| 109.000 | 3270 | drift ends | `act4.js:660` |
| 109.290 | 3279 | downbeat — **no event** | — |
| 109.400 | 3282 | cut out | — |

**Dead / soft runs (frame-diff):**

- **105.47–105.93 (15 frames, 0.50 s) under 0.5**; **106.00–106.60 (19 frames, 0.63 s) under 0.5**; **109.07–109.27 (7 frames, 0.23 s) under 0.5**.
- Under 1.0: **105.47–106.63 (36 frames, 1.20 s)**, 107.77–107.83 (3), 108.43–108.50 (3), 108.57–108.63 (3), **109.07–109.40 (11 frames, 0.37 s)**.
- Under 2.0: **105.47–109.40 (119 frames, 3.97 s) — the entire shot.** No frame in `jazz` exceeds a mean diff of 2.0 except the cut itself (129.6). The max inside the shot is 1.2.
- Region means: left-middle 4.34, centre 2.42, right-middle 1.43, everything else 1.2–2.0. Only SOL's side moves, and only by 0.2 px/frame.

**3+ independent moving layers?** On paper there are six (SOL sway, MIRA sway, notes, smoke, title drift, glow flicker). In the measured picture there are **zero visible layers above 2 px/frame**: the notes move 3.6 px/frame but are ≤10 px glyphs at ≤35 % alpha that wrap, the title is 1.67 px/frame, and everything else is ≤0.93 px/frame. The shot is carried by 12 Hz type boil, 24 Hz grain, 0.2–0.3 px/frame sways and 5 % smoke. That is not meaningful change. The 15 fps sheet shows the title drift between rows; the 30 fps diff says the shot is a poster. The sheet overstates the motion.

**Authored detail a recipe would miss:** the `90°` dashed L and label (`:607–610`); the `INTELLIGENCE`/`GOALS` labels with dashed leaders (`:600–605`); `INTELLIGENCE ⊥ GOALS` bottom-right (`:677`); `the orthogonality thesis` bottom-left (`:676`); `P(DOOM) 88` on each table (`:594`); the art-deco arches (`:578–586`); the fedora (`:640–645`); the sax keys (`scene_kit.js:301`); the `MIRA` badge (`characters.js:646–649`); the notes with stems and flags (`:649–658`).

**Flaws:**

- **No camera.** The storyboard says "slow dolly through smoke, 2.39 letterbox" (`STORYBOARD.md:254`); the code has neither `setCam` nor a matte (`act4.js:573–679`). The frame is a fixed 16:9 poster for 4.0 s.
- **One beat event in six.** Six 88 BPM downbeats fall inside the shot — 105.89, 106.57, 107.25, 107.93, 108.61, 109.29. Only 106.57 has a picture event: the title drift starts 0.03 s (0.9 frames) later, and it moves 1.67 px/frame. The other five have nothing.
- **The `90°` is 2.5°.** `ORTHOGONALITY` moves (−120,−42) and `BLUES` (+90,+36) (`act4.js:660–667`): the two drift lines are **2.5° apart** (the vectors are 177.5° apart, i.e. the words move out along nearly the same diagonal), not 90°. The dashed L at 1120–1320,420–620 (`:607–610`) is a free-floating corner ~200 px from where the beams cross. The `90°` label is a claim the picture does not make.
- **The beams are 88.8° apart but they overlap.** `drawSpotlight(..., −0.20)` and `drawSpotlight(..., 1.35)` (`:598–599`): the rotation difference is 1.55 rad = 88.8°, so the 90° claim is nearly right. But the right cone (1560→900) crosses the left cone (440→980) in the upper middle, so they meet, contradicting "never meet" (`STORYBOARD.md:255`), and the `90°` mark is not at the crossing.
- **MIRA is disassembled.** The mic stand pole at x=1470, y=470–940 (`:628–629`) is drawn **after** MIRA (`:616–626`), so it runs over her red coat from chin to floor and cuts her in half. Her arms are red on red (`coatCol: PAL.redD`, `:619`; sleeves the same), so the forearms read as two floating red bars — one across her chest, one above her head. Her hands are 7×10 blobs with no thumb (`characters.js:728`), and the hand offset is `wrist[1] + 9` in torso space, not along the arm, so a raised arm's hand lands inside the sleeve. At 0.95 scale they read as the sleeve cap. Her blue trouser segments have a visible knee gap and her white sneakers sit ~10 px below the shins (`characters.js:596–603`; the sneaker translate is world-space, not the shin's frame).
- **The mic is 145 px from her hand.** Her near hand is at local (−121,−480) from `armR [1.5,.6]` (`:620`), screen ≈(1335,484); the mic is at (1470,430) (`:630`). She sings past a stand mic, not into a held one. The mic is at her mouth height (431), so the read survives, but the hand does not support it.
- **The sax is not held and does not glint.** SOL's arms are `armL [.18,.2]`, `armR [.22,.25]` (`:636`), nearly straight down; the sax at (14,−500) (`:646`) floats at her mouth with no hand on the keys. `drawSax` is a static gold stroke with 4 cream dots (`scene_kit.js:294–303`); there is no glint animation, so "sax glints" (`STORYBOARD.md:255`) is absent.
- **Smoke reads as pools.** Two banks of 7 ellipses at alpha .05/.045 (`:613–614`, `:21–30`) drift 28 px/s and read as flat grey ovals on the floor, not curls. The `smoke` ellipses are 124–223 px wide and 42–73 px tall, all at the same height; there is no vertical rise or curl.
- **Scale mismatch.** The characters are 574 px tall (0.95 × 604) on a 1080 frame; the tables are 110 px wide and the `P(DOOM) 88` labels are 8 px (`:589–595`). The room reads as a stage with coffee tables, not a club.
- **Table labels are stale.** Each table says `P(DOOM) 88` (`:594`); the ticker climbs 88.3→90.7 across the shot (`lyrics.js:73`). By the cut the tables are 2.7 points behind.
- **Type/character collision.** `ORTHOGONALITY` at y=270, 128 px (`:662`), sits on SOL's petals (head at 366, petals to ~300); the "O" covers the left petals. It is legible but crowded.
- **No 2.39 bars.** At 1920×1080 a 2.39 frame needs 138 px top and bottom; the picture has 0. The storyboard's format is not in the file.

## What to copy / what to fix

**Copy (these are the segment's real inventions):**

1. **`clips` clip curtain, 98.25–98.80.** 14 columns × 7 clips, 1240 px rise in 0.55 s (`act4.js:242–253`). It lands on "room" (98.62) and takes the frame from ~30 % clips to 100 %. This is the segment's best literal event: the room fills.
2. **`clips` DOOM slam, 95.20–95.60.** 74.0→86.3 in 0.40 s (`lyrics.js:72–73`). A numeric event on the chorus; the ticker is the one thing that moves on every frame.
3. **`clips` MIRA fall / land / CLANG, 95.20–95.62.** `act4.js:153–175`. A body event with a sound cue; the only physical gag in the shot.
4. **`pto` per-char `NOWHERE LEFT TO GO`, 100.80–101.42.** 18 chars, 0.02 s stagger, 0.28 s each (`act4.js:425–429`). A type event that lands with the line, and the 104 px cream/red/ink type is legible over the Earth.
5. **`pto` panel slide + Earth fade, 100.35–101.30.** 1250 px slide (`:271`) and a 0.65 s fade (`:394`). The diptych becomes a planet in 0.95 s; the cut is motivated.
6. **`fuse` detonation flash, 105.16–105.40.** 26 radial ellipses + 0.95 gold flash (`act4.js:553–563`) masking the 129.6-mean cut. The strongest cut in the segment.
7. **`fuse` bomb as one prop.** Timer 46 px, hazard band clipped to the sphere, `P(DOOM)` label, collar + socket (`:462–480`). A recipe would draw a generic bomb; this one has a spec.
8. **`jazz` fedora / sax / mic silhouettes and the `ORTHOGONALITY` + `BLUES` pair.** The concept reads in one frame; the neon glow (`shadowBlur 34*flick`, `:668–673`) is a good material, and the `INTELLIGENCE ⊥ GOALS` shorthand (`:677`) puts the idea in words.

**Fix (in priority order):**

1. **`jazz` is a poster.** 119/120 frames <2.0, 83 <1.0, 0 camera, 1/6 downbeats, no 2.39 bars. Add a 4 s dolly (z 1.00→1.06), a 138 px top/bottom matte, and one event per downbeat: 105.89 sax bell glint, 106.57 MIRA's hand to the mic, 107.25 smoke puff, 107.93 spotlight swing, 108.61 `BLUES` flicker hit, 109.29 mic feedback / title step. Target: no 12-frame run <1.0.
2. **`pto` has 2.24 s of near-still.** 99.40–100.37 (30 frames <0.5) and 101.33–102.47 (35 frames <1.0). Put the phone jump on "PTO" (99.82), the chair rock on "guys" (99.30), the note flap on "on" (99.60), a MIRA wave on "go" (102.16). Target: no 12-frame run <1.0.
3. **`fuse` never burns.** Draw a charred/dark section from (300,700) to the spark, shorten the tube behind it, and make the match flame touch the fuse at 103.06. Put the match in SOL's hand: the match is 145 px from the hand at `act4.js:518/522`. Set the timer to 2.70 so the clock reads 00:00.00 at the flash (`:473` vs `:553`).
4. **`jazz` MIRA is disassembled.** Move the mic pole behind her (`:628–629` after `:616–626`), give her sleeves a value distinct from the coat (`:619`), add a thumb to the hand (`characters.js:728`), close the knee/ankle (`characters.js:596–603`), and put her hand on the mic or drop the stand.
5. **`jazz` 90° is 2.5°.** Make the two title vectors 90° apart (e.g. (−120,0) and (0,+120)) and put the dashed `90°` corner within 20 px of their intersection; separate the two beams so they do not overlap, or make the crossing the point (`act4.js:598–610`, `:660–667`).
6. **`pto` layout.** Move the dancers to the sand (y≈850) or move the sand line to 790 (`:332/337/348`); move `PAPER BEACH` off the phone (`:368/377`); move the PTO note so the chair back is visible (`:297/304`); centre the gutter at 960 (`:389`); move `FACILITY 01` out of the vignette corner (`:286`).
7. **`clips` opening.** Start at z=1.25, not 1.45 (`:124`), or start MIRA at y=500 so she is in frame at 95.20; keep MIRA's body in the pile until the hand gag, or drop the hand (`:153` vs `:218`); sync the clip wave to `C.beat(t)` (`:100`) and add a clip on each downbeat; the title is 152 px, not the storyboard's 280 px (`:237` vs `STORYBOARD.md:235`).
8. **`TY.type` alpha bug.** `type.js:67` overwrites the caller's `ctx.globalAlpha` with the per-char alpha. `PAPERCLIPS` (`act4.js:234–238`) and `TOO LATE` (`:541–547`) are full size and full alpha on frame 1; the intended pops never happen. Multiply the caller alpha into `TY.type`, or pass `alpha`.
9. **Hands.** `idol`'s hand is an 18×26 blob (9×13 radii) at wrist+11 inside a 14 px sleeve (`characters.js:528–540`); `mira`'s is a 14×20 blob (7×10 radii) with no thumb, offset `wrist[1] + 9` in torso space, so a raised arm's hand is inside the sleeve (`:728`). At 0.72–0.95 scale the hand is 13–19 px and reads as the cuff. Draw the hand beyond the cuff in the arm's own frame, add a thumb to MIRA, and make the hand ≥1.5× the sleeve cap.
10. **Contact shadows.** `idol`/`mira` use 22 % ink at the feet (`characters.js:395`, `:582`); on the `#1D0B0D` fuse ground and the navy jazz floor the shadow is invisible. Use a light rim/shadow on dark grounds, or a contact ellipse in the ground's own value.

## Rules for the test version (numbers, not adjectives)

1. **Motion floor.** No run longer than **12 frames (0.40 s)** with mean diff **< 1.0**; no shot with **> 50 %** of its frames **< 2.0**; at least **3 independent layers** each moving **≥ 8 px/s** (or ≥ 2 % of the frame's short side). A layer moving **< 2 px/frame** does not count. Measured on the 192×108 luma diff, then confirmed on a native frame.
2. **Beat contract.** On the film's own 88 BPM grid (`core.js:47–49`, 0.6818 s/beat), every downbeat inside a shot gets a visible event within **± 2 frames (0.067 s)**; **≥ 80 %** of downbeats must fire. Counts: `clips` 5 / 1 (MIRA land −1.3 f; mascot −4.4 f; curtain −4.3 f); `pto` 6 / 0 (Earth −2.6 f, panels +6.3 f, type −9.6 f); `fuse` 4 / 1 (detonation −1.5 f; spark −3.1 f; shake +3.4 f); `jazz` 6 / 1 (title drift +0.9 f). Segment total **3 / 21 (14.3 %)**. If the song is not 88 BPM, the grid is the bug — but the film's own `C.beat` is what its bodies bounce on.
3. **Camera.** Every shot declares a move of **≥ 3 % scale** or **≥ 20 px translate** over its duration, with a stated direction; a static camera is a finding. A zoom-out must finish by **40 %** of the shot or continue to the end. `jazz` 0 %, `fuse` 5 %, `pto` 24 % then static, `clips` 45 % then static.
4. **Contact.** A foot is **≤ 4 px** from its ground/board; a held prop is **≤ 6 px** from the hand; a flame is **≤ 8 px** from its fuse; a hand is **≥ 1.5×** the sleeve cap and has a thumb. Measure in the delivered frame, not in local coordinates. Current: fuse match **145 px** from the hand, flame **~10 px** above the fuse's top edge; jazz mic **145 px** from the hand.
5. **Type.** No title at full alpha on frame 1; every title has an appear/backOut of **≥ 0.20 s**; the parent alpha must survive `TY.type`; every lyric noun gets a discrete event on its word — `PTO` 99.82, `fuse` 104.00, `blues` 107.40. Current: `PAPERCLIPS` and `TOO LATE` are full on frame 1 (`type.js:67`); `PTO` and `blues` have no event.
6. **Cut.** A hard cut must change **≥ 25 mean diff**; a match cut must match position within **40 px** and size within **15 %**; a flash-masked cut must have the flash at **≥ 0.85 alpha** on the frame before the cut. `pto → fuse`: Earth (960,560) r300 vs bomb (1280,760) r250 — **fails** the match by 377 px / 50 px.
7. **Stillness.** A 4 s shot may not have **119/120** frames <2.0; a "quiet" shot may have **≤ 50 %** of frames <1.0. `jazz` has 83/120 (69 %) <1.0; `pto` has 77/110 (70 %) <1.0.
8. **90°.** If the film says 90°, the two motion vectors are **90° ± 5°** and the annotation sits within **20 px** of the intersection. `jazz`'s drift lines are **2.5°** apart (the vectors 177.5° apart) and the annotation is **~200 px** off.
9. **Letterbox.** A declared 2.39 frame at 1920×1080 needs **138 px** bars top and bottom (1920/2.39 = 803; (1080−803)/2 = 138.5). `jazz` has 0.
10. **Scale.** A prop named in the lyric is within **1.5×** the character's hand size, or it is explicitly a set piece. The jazz mic (145 px from the hand) and the fuse match (145 px from the hand) fail; the bomb (500 px) is a set piece and is allowed.
