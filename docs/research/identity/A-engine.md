# A — Paper K-pop: the visual identity as code values

**Date:** 2026-11-04
**Film:** `Y:\NewVideoTest` — 1920×1080, 30 fps, 156.62 s, 4,699 frames.
**Engine read in full:** `src/core.js` (339 lines), `src/type.js` (224), `src/timeline.js` (133), `src/lyrics.js` (85), `render.mjs` (129), `serve.mjs` (12), `studio.html` (126), `package.json` (18). The scene layer was also read and machine-searched: `src/scene_kit.js` (634), `src/characters.js` (928), `src/props.js` (464), `src/scenes/act1–5.js` (2,782).
**Read-only copies:** `studio/reference/paper-kpop/core.js` and `type.js` are byte-identical to the source (`sha256 EA0B8131…CB47`, `E0D1638C…A8B4`).
**Method:** every line of core/type/timeline/lyrics read; every constant grepped; all call sites extracted with a script: 51 scenes, 27 `setCam`, 78 `TY.type`, 171 `TY.text`, 20 `TY.sticker`, 2 `TY.circular`, 1 `TY.vertical`, 10 `irisOverlay`, 38 `flash`, 45 lyric lines, 213 words.
**Status key:** **I** = invariant (fixed by the engine or true in every shot); **V** = variable (authored per shot); **F** = forbidden by the engine’s construction or absent from it; **U** = defined but unused.
**Scope:** values, not judgement. §13 is a schema proposal; everything before it is what the code does.

---

## 0. The headline

The identity is a **fixed stage, finish and type grammar** with an authored scene inside it. Six numbers carry most of the look: paper `#F2E8D5`, ink `#171310`, shadows at `(+6, +10)` at 22%, object edges 2 px, type edge `0.055 × size`, and a 12 Hz per-glyph boil. The rest is a 38-colour riso base, a 2 Hz paper-texture jump, a 24 Hz grain jump, an 88 BPM body pulse, and hard cuts on lyric boundaries.

| # | Finding | Value | Evidence |
|---|---|---|---|
| 1 | Canvas | 1920×1080, 16:9, DPR 1 | `core.js:5`, `render.mjs:53` |
| 2 | Clock | 30 fps, 156.62 s, 4,699 frames | `render.mjs:10–11`, `core.js:6` |
| 3 | Paper base | `#F2E8D5`; every frame begins with a full fill | `core.js:55`, `timeline.js:19` |
| 4 | Ink | `#171310`; 799 references, the most-used colour | `core.js:57` |
| 5 | Paper shadow | flat copy at `(+6, +10)`, alpha `.22`, **no blur** | `core.js:280–297` |
| 6 | Object edge | 2 px default; 1.5–4 px in practice | `core.js:290` |
| 7 | Type boil | 12 Hz, per glyph, ±0.0175 rad default | `type.js:48,59` |
| 8 | Type edge | `max(2, size × 0.055)` px | `type.js:44` |
| 9 | Body pulse | 88 BPM, downbeat at `t = 0.21 s` | `core.js:48–49` |
| 10 | Cut grammar | 51 shots, hard cuts, **92% on a lyric boundary** | `timeline.js:50–55`; scene data |
| 11 | Camera | optional: 27 of 51 shots; z `0.84–3.55` | `core.js:307`; 27 call sites |
| 12 | Determinism | pure except the grain texture, which uses `Math.random` | `core.js:120,122` |

> The single most important structural fact: the film is **not** beat-cut and **not** parallax. The cuts follow the lyric line, and the camera is a 2-D similarity transform that 24 of 51 shots do not use at all (some use a local `ctx.scale` instead).

---

## 1. Medium, clock and coordinate system

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Canvas width | 1920 | px | `core.js:5`; `studio.html:25` | **I** |
| Canvas height | 1080 | px | `core.js:5`; `studio.html:25` | **I** |
| Aspect | 16:9 | ratio | `studio.html:11` | **I** |
| FPS | 30 (default; `--fps` overrides) | frames/s | `render.mjs:10` | **I** |
| Duration | 156.62 | s | `core.js:6`; `render.mjs:11` | **I** |
| Frame count | 4,699 (0…4698) | frames | `round(156.62 × 30)` | **I** |
| Last sampled time | 156.60 | s | `4698 / 30` | **I** |
| Preview loop end | 156.6 (wraps to 0) | s | `studio.html:90` | **I** |
| Device pixel ratio | 1 (forced) | ratio | `render.mjs:49,53` | **I** |
| Canvas backing store | 1920×1080, `alpha:false` at boot | px | `studio.html:102` | **I** |
| Colour space | canvas default sRGB; encode tagged bt709 | — | `render.mjs:39` | **I** |
| Coordinate origin | top-left, x right, y down | — | `core.js:5`; all draw code | **I** |
| World unit | 1 output px at camera `z = 1` | px | `core.js:313–319` | **I** |
| Camera anchor | screen `(960, 540)` | px | `core.js:306,315` | **I** |
| Ground line | y ≈ 938–1012 for cast | px | `act5.js:231,300`; `act1.js:107` | **V** |
| Character scale | 0.20–1.18 (`Sol`), 0.42–1.02 (`Mira`) | × | `scene_kit.js:281`; acts | **V** |
| Render seek | absolute `t = i / 30`; no accumulation | — | `render.mjs:97` | **I** |
| Preview loop | `requestAnimationFrame`, delta time, wraps at 156.6 | — | `studio.html:86–96` | **I** |
| Frame format | JPEG q 0.95 (PNG for stills) | — | `render.mjs:97,77` | **I** |
| Encode | libx264, CRF 15, preset slow, tune film, yuv420p, bt709 | — | `render.mjs:38–39` | **I** |
| Audio encode | AAC 320 kbps, source WAV untouched | — | `render.mjs:40` | **I** |
| Workers | 4 default, each a separate page | pages | `render.mjs:83,105` | **V** |
| External assets | fonts and song only | — | `core.js:3`; `studio.html:50–70` | **I** |
| Global seed | absent | — | no seed parameter anywhere | **F** |
| Device scale trick | `--force-device-scale-factor=1`, `--use-angle=d3d11` | — | `render.mjs:49` | **I** |

The frame count is `round(156.62 × 30) = 4699`; `render.mjs:85` renders indices `0 … round(156.62×30)−1`. The final 0.02 s is not sampled. `studio.html` labels the duration `02:36.60`, while `core.js` says 156.62 s.

**Coordinate rule:** world objects are drawn through `beginCam` in world px; subtitles, HUD, hero type and print marks are drawn after `endCam` in screen px. There is no scene graph, no z-index and no layer list: each scene is a painter’s-algorithm function, back to front (`timeline.js:22–25`).

---

## 2. Palette

38 named colours in `PAL` (`core.js:54–70`). Usage counts are `PAL.<name>` references across `core`, `scene_kit`, `characters`, `props` and acts 1–5.

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| `paper` | `#F2E8D5` | hex | `core.js:55` | **I** · substrate · 4 refs |
| `paper2` | `#E8DAC0` | hex | `core.js:55` | **I** · substrate · 8 |
| `paper3` | `#DCCBAF` | hex | `core.js:55` | **I** · substrate · 4 |
| `cream` | `#FBF4E6` | hex | `core.js:56` | **I** · highlight · 455 |
| `bone` | `#F6EEDC` | hex | `core.js:56` | **U** · 0 |
| `ink` | `#171310` | hex | `core.js:57` | **I** · ink/shadow · 799 |
| `ink2` | `#382D25` | hex | `core.js:57` | **I** · ink 2 · 5 |
| `ink3` | `#5A4A3C` | hex | `core.js:57` | **I** · ink 3 · 1 |
| `red` | `#E8452A` | hex | `core.js:58` | **I** · impact/danger · 159 |
| `redD` | `#B92A16` | hex | `core.js:58` | **I** · impact dark · 35 |
| `redL` | `#FF755A` | hex | `core.js:58` | **I** · impact light · 17 |
| `blue` | `#203FD8` | hex | `core.js:59` | **I** · tech/cool · 59 |
| `blueD` | `#122A9B` | hex | `core.js:59` | **I** · tech dark · 21 |
| `blueL` | `#4E6BFF` | hex | `core.js:59` | **I** · tech light · 6 |
| `acid` | `#D9F24B` | hex | `core.js:60` | **I** · signal/HUD · 63 |
| `lime` | `#A8D63A` | hex | `core.js:60` | **U** · 0 |
| `pink` | `#FF5E9C` | hex | `core.js:61` | **I** · pop · 35 |
| `pinkD` | `#D62E70` | hex | `core.js:61` | **I** · pop dark · 5 |
| `pinkL` | `#FFA6C4` | hex | `core.js:61` | **I** · pop light · 9 |
| `gold` | `#F5B93F` | hex | `core.js:62` | **I** · idol/brass · 152 |
| `goldD` | `#C98A1E` | hex | `core.js:62` | **I** · gold dark · 24 |
| `goldL` | `#FFD884` | hex | `core.js:62` | **I** · gold light · 115 |
| `mint` | `#A8E6C9` | hex | `core.js:63` | **I** · calm/gym · 25 |
| `teal` | `#0D6C6C` | hex | `core.js:63` | **I** · calm dark · 6 |
| `tealD` | `#064A4A` | hex | `core.js:63` | **I** · calm darker · 1 |
| `violet` | `#5B3FD8` | hex | `core.js:64` | **I** · cosmic · 6 |
| `violetD` | `#321F8C` | hex | `core.js:64` | **I** · cosmic dark · 1 |
| `silver` | `#C9CED6` | hex | `core.js:65` | **I** · metal · 32 |
| `silverD` | `#8D97A6` | hex | `core.js:65` | **I** · metal dark · 20 |
| `chrome` | `#E8EDF3` | hex | `core.js:65` | **I** · metal light · 12 |
| `sky` | `#9CCBEA` | hex | `core.js:66` | **I** · sky · 5 |
| `skyD` | `#5C93B8` | hex | `core.js:66` | **U** · 0 |
| `orange` | `#F08A2E` | hex | `core.js:67` | **I** · earth · 6 |
| `ochre` | `#D9A441` | hex | `core.js:67` | **I** · earth dark · 1 |
| `terracotta` | `#C96A45` | hex | `core.js:67` | **U** · 0 |
| `green` | `#1FA36B` | hex | `core.js:68` | **I** · nature/money · 17 |
| `greenD` | `#0B6B45` | hex | `core.js:68` | **I** · green dark · 3 |
| `black` | `#0C0A09` | hex | `core.js:69` | **U** · 0 |

**Role rules that the data supports**

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Palette size | 38 named colours | entries | `core.js:54–70` | **I** |
| Closed palette? | No — acts add 296 distinct off-palette hex literals | colours | grep of acts 1–5 | **V** |
| Most-used roles | ink 799, cream 455, red 159, gold 152, goldL 115 | refs | — | **I** |
| Accent hierarchy | red = impact; blue = tech; gold = idol; acid = status | — | usage + scene context | **I** |
| Metal role | silver/silverD/chrome only for brads, paperclips, laptop, GPU | — | `characters.js:19–25`; `scene_kit.js:237` | **I** |
| Shading method | additive RGB offset `C.shade(h, k)`, k −40…+34 | RGB steps | `core.js:35` | **I** |
| Colour mixing | `C.mix(a, b, t)` only; no HSL | — | `core.js:25–28` | **V** |
| Max colours per frame | no cap; observed 3–15 named roles + 0–48 literals | colours | per-scene count | **V** |
| Median named roles/shot | 6 | roles | per-scene count | **V** |
| Max combined/shot | 58 (the `gato` scene: 10 named + 48 literal) | colours | `act3.js:1064–1489` | **V** |
| Day/night variant | absent as a system; every scene passes its own two-stop gradient | — | `scene_kit.js:6–15`; `props.js:7–11` | **V** |

**Day / night bands actually used** (`kitBg` / `paperBg` top → bottom, relative luma):

| family | top → bottom | luma top→bottom | code ref | status |
|---|---|---|---|---|
| day paper | `#F8F0DE → #E4D0AC` | .876 → .646 | `act1.js:85` | **V** |
| day lab | `#EDE0C8 → #D9C4A2` | .755 → .568 | `act1.js:162` | **V** |
| day loss | `#F4EBD8 → #E5D3B5` | .836 → .666 | `act1.js:233` | **V** |
| day warm | `#F6E9CB → #E0BE83` | .822 → .543 | `act4.js:1377` | **V** |
| desert | `#FFD98E → #F08739` | .728 → .361 | `act3.js:758` | **V** |
| road | `#F6C877 → #E89B5A` | .622 → .413 | `props.js:363` | **V** |
| gym | `#C8EBDD → #A6D9C6` | .769 → .618 | `props.js:285` | **V** |
| pink | `#FFA6C4 → #E84578` | .525 → .228 | `act2.js:600` | **V** |
| stage red | `#B92A16 → #6E130B` | .120 → .038 | `act1.js:314` | **V** |
| night space | `#0B0A22 → #1B0E38` | .004 → .008 | `props.js:395` | **V** |
| night teal | `#06282B → #061416` | .017 → .006 | `act2.js:898` | **V** |
| night green | `#06170F → #0A3325` | .007 → .026 | `act2.js:810` | **V** |
| night violet | `#0B0720 → #25114E` | .003 → .013 | `act2.js:854` | **V** |
| data | `#070B0D → #0B1416` | .003 → .006 | `props.js:440` | **V** |
| desk night | `#191512 → #0B0908` | .008 → .003 | `act5.js:48` | **V** |

The `PAL` table is a base, not a closed set. 296 of the 304 distinct hex literals in the acts are off-palette one-offs (sets, skin, wood, metal, screens). Anything that must be reusable should be promoted into `palette.entries`; anything scene-specific stays a literal.

---

## 3. Paper material and texture

All of this is in `core.js`; the scene kit only calls it.

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| `paper()` shadow offset default | `sx 6`, `sy 10` | px | `core.js:284` | **I** |
| `paper()` shadow alpha default | `.22` | 0–1 | `core.js:285` | **I** |
| `paper()` shadow blur | none — a filled copy of the same path | — | `core.js:282–287` | **I** |
| `paper()` fill default | `PAL.paper` = `#F2E8D5` | hex | `core.js:289` | **I** |
| `paper()` edge default width | `2` | px | `core.js:290` | **I** |
| `paper()` gloss | implemented, **never used**: white `.25` → transparent over `100` px | — | `core.js:291–296` | **U** |
| `tornRectPath` default tear | `amt 6` → ±6 px per vertex | px | `core.js:227` | **V** |
| `tornRectPath` edge points | top 14, right 10, bottom 14, left 10 | vertices | `core.js:239–242` | **I** |
| `tornRectPath` tear in use | 3–10 (sticker 3.5, HUD 3.5, panels 4–5, wipes 10) | px | acts, `type.js:125`, `timeline.js:46` | **V** |
| `blobPath` default | 14 points, jitter `.06` | points / ratio | `core.js:210` | **V** |
| `starPath` | 5 points, inner `.45`, rotation −π/2 | — | `core.js:245` | **I** |
| `sparkPath` | 8 points, inner `.28` | — | `core.js:253` | **I** |
| `heartPath` | cubic radii 1.35 / .6 / 1.03 / .42 | × r | `core.js:261–266` | **I** |
| `petalPath` | quadratic, width at mid, tip at `r1` | — | `core.js:267–277` | **I** |
| Fibre texture size | 1024 × 1024 | px | `core.js:86` | **I** |
| Fibre base / dark / light | `#F2E8D5` / `#C9B896` / `#FFFDF4` | hex | `core.js:86` | **I** |
| Large mottles | 90, radius 40–230, alpha `.035` | count / px / α | `core.js:90–97` | **I** |
| Fibres | 4,200, length 2–24, width `.4–1.3`, alpha `.05–.14` | count / px | `core.js:99–107` | **I** |
| Specks | 1,500, size `.7–2.5`, alpha `.06–.14` | count / px | `core.js:109–113` | **I** |
| Grain texture size | 512 × 512 | px | `core.js:116` | **I** |
| Grain value | grey 0–255, per pixel | 8-bit | `core.js:120` | **I** |
| Grain alpha | `Math.random() × 34` → 0–34 (0–13.3%) | 8-bit | `core.js:122` | **I** |
| Halftone default | cell 14, dot `.55`, alpha `.5`, angle `.2` | px / ratio / rad | `core.js:158` | **V** |
| Halftone in film | cell 14–24, dot `.4–.55`, alpha `.05–.18`, angle `.2–.7` | — | 7 calls | **V** |
| `HALFTONE` prebuilt canvas | 64 × 64, dot r 13, **never used** | px | `core.js:132–134` | **U** |
| Paper overlay blend | `multiply` | — | `core.js:140` | **I** |
| Paper overlay alpha | `.5` in `renderAt` (default `.5`) | 0–1 | `timeline.js:68` | **I** |
| Paper overlay offset | `hash(floor(t×2)) × 160` → 0–159, integer | px | `core.js:143–144` | **I** |
| Paper overlay rate | 2 Hz | jumps/s | `core.js:143` | **I** |
| Grain overlay blend | `soft-light` | — | `core.js:150` | **I** |
| Grain overlay alpha | `.45` in `renderAt` (default `.55`) | 0–1 | `timeline.js:69` | **I** |
| Grain overlay offset | `hash(floor(t×24)) × 512` → 0–511 | px | `core.js:153–154` | **I** |
| Grain overlay rate | 24 Hz | jumps/s | `core.js:153` | **I** |
| Vignette strength | `.34` in `renderAt` (default `.3`) | 0–1 | `timeline.js:70` | **I** |
| Vignette geometry | centre `(960, 486)`, inner r `194.4`, outer r `885.6` at `(960,540)` | px | `core.js:169` | **I** |
| Vignette stops | transparent at 0 and .72; `ink` at strength at 1 | — | `core.js:170–171` | **I** |
| Flash default colour | `#FFF7E4` | hex | `core.js:174` | **I** |
| Flash alpha | `clamp(k)`, 0–1 | 0–1 | `core.js:176` | **V** |
| Speed lines | n 18–44, len 40–220, width 1–5, alpha `.24–.4` | px / α | `core.js:178–189`; calls | **V** |
| Paper shards | n 20–30, spread 260–520, rect 14–28 × 12–28 | px | `scene_kit.js:132–144`; calls | **V** |
| Confetti | n 55–160, fall 129–219 px/s, 8–13 × 13 | px | `props.js:58–72` | **V** |

The texture stack is global and identical in every shot: paper multiply `.5` → grain soft-light `.45` → vignette `.34`, in that order (`timeline.js:68–70`). It is not scene-authored.

---

## 4. Light and shadow

The film has one light direction and no lighting model. Every drop shadow falls down-right; no `sx` or `sy` is negative anywhere in the source.

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Global light direction | `(+x, +y)` = down-right | — | every `paper()` call | **I** |
| Paper shadow offset | `(+6, +10)` default; `(+4,+7)`, `(+5,+8)`, `(+8,+12)`, `(+10,+16)` common | px | `core.js:284`; scene calls | **V** |
| Shadow offset ratio | common pairs: `sy ≈ 1.6–1.8 × sx`; some `sx 0` with `sy 5` | ratio | distribution of `sx`,`sy` | **V** |
| Paper shadow alpha | `.22` default; `.12–.60` observed | 0–1 | `core.js:285` | **V** |
| Type shadow | offset `size × .035` x, `.0385` y; alpha `.26` | px / α | `type.js:45–46,72` | **I** |
| Type shadow explicit | alpha `.12–.60`, offset 2–20 px | — | 78 `TY.type` calls | **V** |
| Character limb shadow | `(+3, +5)`, alpha `.14` | px / α | `characters.js:39–41` | **I** |
| Face-plate shadow | `(+2.5, +4.5)`, alpha `.14` | px / α | `characters.js:183–185` | **I** |
| Hair shadow | `(+2.5, +5)`, alpha `.16` | px / α | `characters.js:319` | **I** |
| Petal shadow | `(+1.5, +3)`, alpha `.13` | px / α | `characters.js:154–156` | **I** |
| Contact shadow (Sol) | ellipse 46s × 10s at ground, alpha `.22` | px / α | `characters.js:395` | **I** |
| Contact shadow (Mira) | ellipse 40s × 9s, alpha `.22` | px / α | `characters.js:582` | **I** |
| Contact shadow (mascots) | paperclip 34×10 α`.18`; shoggoth 120×26 α`.25`; chinchilla 70×16 α`.20` | px / α | `characters.js:774,798,857` | **V** |
| Contact shadow construction | radial gradient `ink α → 0`, scaled `ry/rx` | — | `core.js:298–303` | **I** |
| Object edge width | 2 px default; 1.5–4 px props; 1.2–2.6 px garments | px | `core.js:290`; call data | **V** |
| Hero type edge | 4–18 px; default `size × .055` | px | `type.js:44`; calls | **V** |
| Edge colour | solid ink, or `rgba(ink, .2–.8)`; type edge cream or ink | — | call data | **V** |
| Spotlight shape | quadrilateral, alpha `α × 1.5` at source → 0 at `len` | — | `props.js:74–81` | **I** |
| Spotlight values | `len 820–1150`, `w0 30–40`, `w1 280–520`, alpha `.10–.18` | px / α | `props.js:162–163`; `act4.js:598`; `act5.js:284` | **V** |
| Sunburst | 26–40 wedges, alternating colour, radius 900–1600, alpha `.12–.5` | rays / px | `props.js:13–24`; `scene_kit.js:12` | **V** |
| Glow (real blur) | 5 calls only: `shadowBlur 12, 18, 26, 30, 34` px | px | `act3.js:339,430,1467`; `act4.js:669,1011` | **V** |
| Glow colour | `goldL`, `red`, `blueL` | hex | same | **V** |
| Halation / bloom | absent | — | closest: the 5 glow calls | **F** |
| Ambient occlusion | absent | — | closest: contact ellipses | **F** |
| Blur on paper shadows | forbidden by construction | — | `core.js:282–287` | **F** |
| Shadow on flat fills | none — flat paths drawn directly get no shadow | — | e.g. `act1.js:436–438` | **I** |

**What gets a shadow:** every `paper()` call that passes `shadow` — props, cards, garments, faces, hair, petals, stickers, HUD cards, subtitle panels. **What does not:** background gradients, floor fills, grids, mountains, confetti, sparks, speed lines, spotlight polygons, and anything drawn with `fillRect`/`fill` directly. Type gets a separate hard-copy shadow, not `paper()`.

---

## 5. Camera

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| `CAM` fields | `x, y, z, r, sx, sy, ox, oy` | px / × / rad | `core.js:306` | **I** |
| Initial state | `x 960, y 540, z 1, r 0, sx 0, sy 0, ox 0, oy 0` | px / × / rad | `core.js:306` | **I** |
| `setCam(x, y, z=1, r=0, shake=0, t=0)` | sets all six live fields | — | `core.js:307–312` | **I** |
| Shake x | `sin(t × 71) × shake` | px | `core.js:309` | **I** |
| Shake y | `cos(t × 63) × shake × .7` | px | `core.js:310` | **I** |
| Shake frequency | 71 and 63 rad/s ≈ 11.3 and 10.0 Hz | Hz | `core.js:309–310` | **I** |
| Shake per frame | phase step 2.37 and 2.10 rad at 30 fps; it alternates almost every frame | rad | derived | **I** |
| Shake decay | none; constant for the whole shot | — | `core.js:307–312` | **I** |
| Shake range in film | 0–12 | px | 27 calls | **V** |
| Roll | `r` radians; observed `−0.07 … +0.13` (−4.0°…+7.5°) | rad | calls | **V** |
| Zoom | `z`; observed `0.84 … 3.55`; typical `1.00–1.06` | × | calls | **V** |
| Camera x | observed `760 … 1430` | px | calls | **V** |
| Camera y | observed `330 … 668` | px | calls | **V** |
| Transform order | translate `(960+sx, 540+sy)` → rotate `r` → scale `z` → translate `(−x, −y)` | — | `core.js:315–318` | **I** |
| `worldToScreen` | defined, **never used** | — | `core.js:321–325` | **U** |
| `ox`, `oy` | zeroed, never read | — | `core.js:311` | **U** |
| Parallax per layer | absent | — | no per-layer factor exists | **F** |
| FOV / lens | absent; `z` is the only proxy | — | `core.js:317` | **F** |
| Depth of field | absent | — | — | **F** |
| Perspective / roll beyond 2-D | absent; similarity transform only | — | `core.js:313–319` | **F** |
| Camera limits / clamps | none; no guard on z, r or shake | — | `core.js:307–312` | **F** |
| Camera use | 27 of 51 shots (53%) | shots | 27 `setCam` calls | **V** |
| Act I use | 5 of 7 shots | shots | `act1.js` | **V** |
| Act II use | 15 of 17 | shots | `act2.js` | **V** |
| Act III use | 6 of 6 | shots | `act3.js` | **V** |
| Act IV use | 1 of 17 | shots | `act4.js:456` | **V** |
| Act V use | 0 of 4 | shots | `act5.js` | **V** |
| Local zoom bypass | `ctx.scale` in scene space, `2.25×` mugs, `2.6→1.0` desk, `1.55→1.0` reveal | × | `act1.js:403`; `act5.js:342` | **V** |
| Screen-space drift | final dance `translate(sin(lt×.7)×50, 0)` | px | `act5.js:268–269` | **V** |
| Stale camera | `CAM` is global and persists; scenes without `setCam`/`beginCam` ignore it | — | `core.js:306`; `timeline.js:12` | **I** |

**Representative moves**

| shot | camera | code ref |
|---|---|---|
| cold open | `x 960, y 512, z .84→1.05`, roll `sin(lt×.7)×.012` | `act1.js:41` |
| sparks | keyframed `(1430,330,3.55) → (1370,430,1.55) → (960,535,1.0) → (960,540,1.04)` over 4.4 s | `act1.js:95–96` |
| chorus 1 | `(1370→960, 570)`, `z 1.7→1.0` in .45 s, shake 7→1 | `act2.js:25–26` |
| loss | `z 1.0→1.16`, roll `0→−.07`, shake 2→8 | `act1.js:268` |
| canyon | `(1040,560,1.03)`, roll `−.045×whip`, shake `10×whip` | `act3.js:800` |
| gato | `x 1140→1164`, `y 548→668`, `z 1.06→1.11`, roll `.012×rel` | `act3.js:1144` |

The pattern is: Act I–III use the camera as a grammar (push, pull, whip, roll); Act IV–V abandon it for flat screen-space graphics and local `ctx.scale`. There is no parallax factor anywhere; “2.5D” in `PRODUCTION.md:18` is not implemented as a camera feature.

---

## 6. Motion

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| `ease` | quadratic in-out: `t<.5 ? 2t² : 1−(−2t+2)²/2` | — | `core.js:15` | **I** |
| `easeOut` | cubic `1−(1−t)³` | — | `core.js:16` | **I** |
| `easeIn` | cubic `t³` | — | `core.js:17` | **I** |
| `backOut` | `c = 1.70158` | — | `core.js:18` | **I** |
| `elasticOut` | standard, period `2π/3` | — | `core.js:19` | **U** |
| `expoOut` | `1−2^(−10t)` | — | `core.js:20` | **U** |
| `smooth` | smoothstep `t²(3−2t)` | — | `core.js:14` | **V** |
| `kf(t, keys, e)` | per-segment eased interpolation; default `ease` | — | `core.js:36–46` | **I** |
| Beat | `(t − 0.21) / (60/88)` | beats | `core.js:48` | **I** |
| BPM | 88 | BPM | `core.js:47–48` | **I** |
| Downbeat offset | `.21` | s | `core.js:48` | **I** |
| Triplet grid | `(t − .21) / (60/132)` = 132 BPM | BPM | `core.js:50` | **I** |
| Bar / 4-4 assumption | absent; no bar helper, no bar phase | — | `core.js:47–51` | **F** |
| `bpmPulse` | `exp(−frac(beat) × decay)`, default decay 5 | — | `core.js:49` | **I** |
| Pulse decay in flower | 4 | — | `characters.js:137` | **I** |
| Flower pulse amplitude | `±4.5%` | ratio | `characters.js:137` | **I** |
| Idle bounce | `−abs(sin(beat×π)) × 4…20` | px | `characters.js:395`; acts | **V** |
| Idle sway | `sin(beat×π) × 3…10` | px | acts | **V** |
| Head tilt | `±.02…±.12` | rad | acts | **V** |
| Hair swing | `−8…20` | px | acts | **V** |
| Petal drift | `sin(t×.6…8) × .03…05` | rad | acts | **V** |
| Crowd bob | `max(0, sin(beat×π + i×.6)) × 10` | px | `props.js:100` | **I** |
| Confetti fall | 129–219 px/s, rotation 1–4 rad/s | px/s | `props.js:61–64` | **V** |
| Dust drift | `.012–.038 W/s`, `.008–.024 H/s` | screen/s | `act4.js:13–14`; `act5.js:9–10` | **V** |
| Speed streaks | 500–1,800 px/s, 1–5 px tall | px/s | `scene_kit.js:125` | **V** |
| Spring / physics | absent | — | closest: sine/loop | **F** |
| `lerpPose` | defined, **never called** | — | `core.js:332–339` | **U** |
| Pose interpolation | none; every frame is computed from `sin`/`ease` | — | `characters.js:372–554` | **F** |
| `loop(v,a,b)` | wrapped linear; used for confetti, speed streaks, paperclips | — | `core.js:51` | **V** |
| `wob`, `wob2`, `three`, `mix` | defined; `three`/`wob`/`wob2`/`mix` unused | — | `core.js:23–28,50` | **U** |

There is no physics engine. “Paper physics” is authored trigonometry: bounces at 88 BPM, sways, petal drift, confetti loop, dust drift. No fold, curl, bend or collision simulation exists.

---

## 7. Edit and timeline

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Scene model | flat array; `sceneAt(t)` returns the last scene with `start ≤ t` | — | `timeline.js:4–9` | **I** |
| Shot count | 51 | shots | scene data | **I** |
| Total duration | 156.62 (sum of 51 contiguous spans) | s | scene data | **I** |
| Cuts | 50 | cuts | derived | **I** |
| Mean shot | 3.07 | s | derived | **I** |
| Median shot | 3.06 | s | derived | **I** |
| Shortest shot | .66 (`chair`, 73.80–74.46) | s | `act3.js:158` | **V** |
| Longest shot | 6.14 (`cage`, 52.80–58.94) | s | `act2.js:598` | **V** |
| Shot distribution | <1 s: 1; 1–2: 15; 2–3: 7; 3–4: 16; 4–5: 7; ≥5: 5 | shots | derived | **V** |
| Shot in beats | 0.97–9.01 beats at 88 BPM; median 4.49 | beats | derived | **V** |
| Cut type | hard cut at the exact boundary; no overlap, no gap | — | `timeline.js:6–8` | **I** |
| Cut on lyric boundary | 47 of 51 starts (92%) | shots | scene starts vs lyric starts/ends | **I** |
| Unmatched starts | 0, 35.5, 146, 151 | s | scene data | **V** |
| Beat-quantised cuts | no | — | scene starts do not snap to 88 BPM | **F** |
| Crossfade / dissolve | absent | — | no blend in `renderAt` | **F** |
| `GLOBAL_TRANS` | declared as an empty array | — | `timeline.js:28–30` | **U** |
| `drawPaperWipe` | implemented, never called | — | `timeline.js:42–48` | **U** |
| Paper-wipe geometry (if used) | width `W×k` centred, y −30…H+60, torn 10, edge `ink .3` 3 px, shadow `.25` at `(+10,0)` | px | `timeline.js:42–48` | **U** |
| Iris transitions | 10 shots; end-of-shot close to a flat colour | — | 10 calls | **V** |
| Iris duration | .17–.44 | s | calls | **V** |
| Iris radius | start 900–1,500 → end 8–60 | px | calls | **V** |
| Iris feather | 26–120 | px | calls | **V** |
| Iris colours | `#050302`, `#0B0706`, `#050403`, `#070303`, `#120C08`, `#160F09`, `#2A1608`, `#D8B273`, `blueD`, `pink` | hex | calls | **V** |
| Flash transitions | 38 calls: 14 open a shot, 24 mark a hit or close | calls | all acts | **V** |
| Flash duration | .14–.44 | s | calls | **V** |
| Flash alpha | .22–1.0 | 0–1 | calls | **V** |
| Flash colours | cream, `#FFF4E4`, `#FFF3D6`, `#FFEAD0`, `#FFE6B0`, `#FFC978`, `#FFD88C`, `goldL`, `redL`, `red`, `mint` | hex | calls | **V** |
| `renderAt` order | reset → paper fill → scene → transitions → subtitle → HUD → print marks → paper → grain → vignette | — | `timeline.js:50–71` | **I** |
| Frame reset | setTransform identity, alpha 1, source-over, shadowBlur 0, clear, fill paper | — | `timeline.js:14–19` | **I** |
| Duration maths | `first=round(a×30)`, `last=min(ceil(b×30)−1, round(156.62×30)−1)` | frames | `render.mjs:85` | **I** |
| Last frame | index 4698 at t 156.60 | frame | derived | **I** |

Compositing order is fixed and is the same in `renderAt` and the preview `draw` (`studio.html:73–85`). The only scene-level transition is the iris, authored inside the outgoing shot; the next shot begins with a hard cut.

---

## 8. Type

### 8.1 Families and files

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Default family | `Anton`, weight 400, normal | — | `type.js:8,29` | **I** |
| Font stack | `${style} ${weight} ${size}px "${family}", "Arial Black", sans-serif` | CSS | `type.js:8` | **I** |
| Anton | `assets/fonts/Anton-Regular.ttf`, 170,812 B | file | `studio.html:52` | **I** |
| Archivo Black | `ArchivoBlack-Regular.ttf`, 90,988 B | file | `studio.html:53` | **I** |
| Instrument Serif | `InstrumentSerif-Regular.ttf` + `-Italic.ttf`, 70,012 / 71,592 B | file | `studio.html:54–55` | **I** |
| DMMono | `DMMono-Regular.ttf` + `-Medium.ttf`, 49,744 / 50,360 B | file | `studio.html:56–57` | **I** |
| Permanent Marker | `PermanentMarker-Regular.ttf`, 74,632 B | file | `studio.html:58` | **I** |
| Black Han Sans | `BlackHanSans-Regular.ttf`, 998,424 B | file | `studio.html:59` | **I** |
| Space Grotesk | `SpaceGrotesk.ttf`, 136,676 B — **loaded, never used** | file | `studio.html:60` | **U** |
| Weight 500 | `DMMono-Medium` loaded, **no call uses 500**; everything is 400 | — | grep | **U** |
| Explicit family refs | DMMono 152, Archivo Black 49, Instrument Serif 31, Permanent Marker 8, Anton 5, Black Han Sans 2 | refs | all files | **I** |
| Italic | Instrument Serif only; 20 calls | — | acts | **V** |

`TY.type` defaults to Anton and `TY.text` defaults to DMMono, so the explicit counts above understate both: most of the 78 type calls are Anton without a `family` field, and most of the 171 text calls are DMMono without one.

### 8.2 `TY.type` — per-character paper type

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Signature | `type(ctx, str, x, y, size, opts)`; x,y = baseline | — | `type.js:28` | **I** |
| Tracking | `size × .01` default | em | `type.js:31` | **I** |
| Align | left / center / right via total width | — | `type.js:37–39` | **I** |
| Appear | `clamp(appear)`; scale `0.55 + 0.45a`; alpha `a` | × / α | `type.js:40,62,67` | **I** |
| Per-char stagger | `.012–.06` in scenes; default none | s | calls | **V** |
| Per-char duration | `.14–.40` | s | calls | **V** |
| Seed | `0` default; explicit 3–12 common | int | `type.js:41` | **V** |
| Colour | `PAL.ink` default | hex | `type.js:42` | **I** |
| Edge colour | `PAL.cream` default | hex | `type.js:43` | **I** |
| Edge width | `max(2, size × .055)` | px | `type.js:44` | **I** |
| Shadow offset | `size × .035` x, `.0385` y | px | `type.js:45,72` | **I** |
| Shadow colour | `rgba(ink, .26)` default | — | `type.js:46` | **I** |
| Jitter multiplier | `.6` default | × | `type.js:47` | **I** |
| Boil | `floor(time × 12)`; 12 Hz; opt-out `boil:false` | Hz | `type.js:48` | **I** |
| Char rotation | `(o.rot) + h1 × (charRot ?? .035) × jitter`; h1 ∈ −.5…+.5 | rad | `type.js:59` | **I** |
| Char rotation observed | `.008–.10` | rad | calls | **V** |
| Char y jitter | `h2 × (charY ?? size × .012)`; h2 ∈ −.5…+.5 | px | `type.js:60` | **I** |
| Glow | optional `shadowBlur = size × .22` | px | `type.js:68` | **V** |
| Chrome fill | 4-stop vertical gradient `−.8size … +.12size`, stops 0/.45/.55/1 | — | `type.js:80–83` | **V** |
| Gradient fill | stops from `−.9size` to `+.1size` | — | `type.js:84–87` | **V** |
| Top highlight | optional, alpha ×.5, y `−size × .015` | px | `type.js:91–93` | **V** |
| Size range | 26–376; median 128; hooks 92–376 | px | 71 numeric calls | **V** |
| Longest display string | 14 chars (`you're my boss`) | chars | `act1.js:383` | **V** |
| Wrapping | `TY.wrap` defined at `type.js:15`, **never called**; type is single-line | — | grep | **U** |
| Line height | absent; multiple calls are positioned manually | — | — | **F** |
| Font weight axis | none; 400 only | — | `type.js:8` | **I** |

### 8.3 `TY.text` — one-line mono/serif

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Signature | `text(ctx, str, x, y, size, opts)` | — | `type.js:103` | **I** |
| Default family | `DMMono` | — | `type.js:105` | **I** |
| Default align / baseline | left / alphabetic | — | `type.js:106` | **I** |
| Fill default | `PAL.ink`, alpha 1 | hex | `type.js:107` | **I** |
| Letter spacing | `opts.letter` px; observed 0.4–6 | px | `type.js:108` | **V** |
| Stroke | optional `stroke` + `strokeW` default 2 | px | `type.js:109` | **V** |
| Shadow | **not supported** in `TY.text` | — | `type.js:103–112` | **F** |
| Wrap | no | — | `type.js:110` | **F** |
| Size range | 7–108; median 13; HUD 10–34; credits 14–24 | px | 171 calls | **V** |
| Colour roles | ink on paper; cream on dark; red/blue for labels; acid for telemetry | — | calls | **V** |

### 8.4 `TY.sticker` — torn paper label

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Signature | `sticker(ctx, str, x, y, size, opts)`; x,y = centre | — | `type.js:115` | **I** |
| Default family | `Archivo Black` | — | `type.js:116` | **I** |
| Padding x / y | `size × .38` / `size × .28` | px | `type.js:117` | **I** |
| Height | `size × 1.12 + 2 × padY` | px | `type.js:120` | **I** |
| Rotation | `−.05` rad default | rad | `type.js:121` | **I** |
| Fill / ink | `PAL.acid` / `PAL.ink` | hex | `type.js:122` | **I** |
| Tear | 3.5; seed 7 | px / int | `type.js:125` | **I** |
| Edge | 2.2 px, ink | px | `type.js:126` | **I** |
| Shadow | `rgba(ink,.28)` at `(+5,+8)` | px / α | `type.js:126` | **I** |
| Tape | 76 × 20 at `(.5w, −.18h)`, rot `.08`, alpha `.55` | px / rad | `type.js:128–131` | **V** |
| Barcode | 6 bars, width 1–3, pitch 4, 10 tall, at `w−padX−22, h−18`, alpha `.8` | px | `type.js:138–142` | **V** |
| Label type | charRot `.012`, jitter 1, seed 7, no edge/shadow by default | — | `type.js:133–137` | **I** |
| Size range | 12–62; median 30 | px | 20 calls | **V** |

### 8.5 `TY.circular` and `TY.vertical`

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Circular step | `(span ?? TAU) / length` | rad | `type.js:151` | **I** |
| Circular start | `−π/2` default (top) | rad | `type.js:152` | **I** |
| Circular spin | `opts.spin` added per char | rad | `type.js:155` | **V** |
| Circular radius | 310 / 320 in the two calls | px | `act1.js:73`; `act2.js:881` | **V** |
| Circular size | 24 / 26 | px | same | **V** |
| Circular family | `DMMono` default | — | `type.js:158` | **I** |
| Circular charRot | `.01` | rad | `type.js:160` | **I** |
| Vertical step | `size × .92` default; `step:76` used | px | `type.js:170`; `act2.js:327` | **V** |
| Vertical drift | `i × drift` | px | `type.js:175` | **V** |
| Vertical curve | `sin(i × .5 + time) × curve` | px | `type.js:175` | **V** |
| Vertical edge | `PAL.cream`, `size × .05` | px | `type.js:177` | **I** |
| Vertical shadow | `rgba(ink,.25)` at `size × .03` | px / α | `type.js:177–178` | **I** |
| Vertical charRot | `.05` | rad | `type.js:179` | **I** |
| Vertical orientation | glyphs stay upright, stacked; no 90° rotation | — | `type.js:175` | **I** |
| Calls | 2 circular, 1 vertical | calls | acts | **V** |

### 8.6 `TY.subtitle` — the caption band

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Default x / y | `84` / `992` | px | `type.js:189` | **I** |
| Default size | `31` | px | `type.js:190` | **I** |
| Width | `min(1300, textWidth + 96)` | px | `type.js:192–193` | **I** |
| Height | `62` | px | `type.js:193` | **I** |
| Panel | at `x−18, y−44`, size `w+20 × h` | px | `type.js:195` | **I** |
| Panel tear / seed | 3.5 / 31 | px / int | `type.js:195` | **I** |
| Panel fill | `rgba(ink,.92)` | — | `type.js:196` | **I** |
| Panel shadow | `rgba(ink,.28)` at `(+5,+8)` | px / α | `type.js:196` | **I** |
| Rec dot | r 5 at `(x+8, y−13)`; red when a word is active, silver otherwise | px | `type.js:199–200` | **I** |
| Label | `LYRIC`, 11 px, `rgba(cream,.55)`, letter 1.5, at `(x+20, y−7)` | px | `type.js:201` | **I** |
| Words start | `x + 64` | px | `type.js:203` | **I** |
| Word gap | `+9` per word | px | `type.js:208` | **I** |
| Active word lift | `−5` | px | `type.js:212` | **I** |
| Active / inactive colour | `PAL.acid` / `PAL.cream` | hex | `type.js:213` | **I** |
| Active underline | `rgba(acid,.25)`, 3 px, `ww−5` wide, at `y+7` | px | `type.js:215` | **I** |
| Fade in | `clamp((t − (line.start − .12)) × 4)` → 0.25 s, starts .12 s early | — | `type.js:209` | **I** |
| Progress hairline | `(x+8, y+11)`, `w−40 × 2`; background `cream .16`, fill `red` | px | `type.js:221–222` | **I** |
| Visible window | `t ∈ [start − .02, end + .35]` | s | `lyrics.js:65` | **I** |
| Scene override | `gato` uses `subX 56, subY 1048` | px | `act3.js:1065` | **V** |
| Calls in acts | 0 direct; `renderAt` calls it for 40 `lyric:'sub'` shots | — | `timeline.js:60` | **I** |

### 8.7 Observed type sizes

| function | min | median | max | common band |
|---|---|---|---|---|
| `TY.type` | 26 | 128 | 376 | hooks 92–304; labels 26–76 |
| `TY.text` | 7 | 13 | 108 | telemetry 10–17; credits 14–24; numerals 34–108 |
| `TY.sticker` | 12 | 30 | 62 | 22–34 |
| `TY.circular` | 24 | — | 26 | 24–26 |
| `TY.vertical` | 72 | — | 72 | 72 |

Largest: `FOOM` at 376 (`act2.js:146`), `ALIVE` at 336 (`act1.js:544`), `DROP` at 304 (`act1.js:295`). Smallest display: 26 in the P(DOOM) balloon (`act5.js:202`).

### 8.8 Fixed strings (identity lexicon)

| string | role | code ref |
|---|---|---|
| `CLAUDE POP` | brand / title | `act5.js:250`; `timeline.js:104` |
| `a paper singularity` | subtitle brand | `act5.js:252`; `studio.html:26` |
| `P(DOOM)` | HUD meter | `timeline.js:80`; `characters.js:921` |
| `TOKENS/S` | HUD unit | `timeline.js:82` |
| `LYRIC` | caption label | `type.js:201` |
| `© 2026 PAPER SINGULARITY` | print mark | `timeline.js:105` |
| `SHEET 01 / SOL` | registration mark | `act1.js:148` |
| `FRAGILE`, `SERVANT`, `BOSS`, `THANK YOU`, `WE ARE SO BACK` | sticker copy | acts |

---

## 9. Lyrics and captions

`lyrics.js` is the clock source; the score is not derived from it at runtime.

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| Data shape | `{ id, start, end, section, text, words: [[w, t], …] }` | — | `lyrics.js:6–52` | **I** |
| Lines | 45 | lines | `lyrics.js` | **I** |
| Words | 213 | words | derived | **I** |
| Sung span | 1.50–140.68 | s | `lyrics.js` | **I** |
| Line durations | 1.05–6.14 | s | derived | **V** |
| Word gap | min .06, median .46, max 3.42 | s | derived | **V** |
| Word `d` | `max(.18, next − t)`; .18 floor | s | `lyrics.js:58` | **I** |
| Line text | canonical lyric, not ASR | — | `lyrics.js:2–4` | **I** |
| `big` | text with trailing comma/period removed | — | `lyrics.js:60` | **I** |
| Max words / line | 9 (`l28`) | words | `lyrics.js:36` | **V** |
| Max chars / line | 54 (`l28`) | chars | `lyrics.js:36` | **V** |
| Sections | verse1, chorus1, verse2, chorus2, bridge1, chorus3, bridge2, chorus4, reveal | 9 | `lyrics.js` | **I** |
| Active word | first `w` with `t ≥ w.t` and `t < w.t + d` | — | `type.js:188` | **I** |
| Highlight | acid fill, `−5 px` lift, 3 px acid underline at 25% | — | `type.js:212–215` | **I** |
| Progress | `(t − start) / max(.1, end − start)` | — | `type.js:220` | **I** |
| Line visibility | start − .02 … end + .35 | s | `lyrics.js:65` | **I** |
| Relation to beat | none; absolute seconds, no snapping | — | no `C.beat` in `lyrics.js` | **F** |
| Relation to cuts | 92% of scene starts land on a line start/end | shots | derived | **I** |
| DOOM keys | `0:8, 22.7:12, 23.0:34, 58.9:48, 59.5:61, 95.2:74, 95.6:86, 124.2:96, 124.6:99.9, 137:100, 156.6:100` | % | `lyrics.js:71–74` | **I** |
| DOOM interpolation | `lerp(v0,v1, ease(clamp((t−t0)/(t1−t0))))` | — | `lyrics.js:75–85` | **I** |
| Audio analysis | absent; picture never listens | — | no FFT/analysis code | **F** |

The lyric timings are the only content clock. The 88 BPM grid drives bodies and flowers, not cuts and not words.

---

## 10. HUD, print furniture, safe zones and layout

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| HUD ticker origin | `x = W − 286 = 1634`, `y = 40` | px | `timeline.js:76` | **I** |
| HUD ticker size | 246 × 96 | px | `timeline.js:76` | **I** |
| HUD ticker fill | `PAL.ink`, no edge, torn 3.5 seed 9 | — | `timeline.js:79` | **I** |
| HUD ticker shadow | `rgba(ink,.25)` at `(+4,+6)` | px / α | `timeline.js:79` | **I** |
| HUD ticker alpha | `.92` | 0–1 | `timeline.js:78` | **I** |
| HUD title | `P(DOOM)`, 15 px Archivo Black, cream, letter `.5`, at `(1650, 64)` | px | `timeline.js:80` | **I** |
| HUD value | 34 px DMMono, letter `−1`, at `(1650, 106)`; acid, red when >95 | px / hex | `timeline.js:81` | **I** |
| HUD unit | `TOKENS/S`, 10 px, `cream .5`, letter 1, at `(1650, 124)` | px | `timeline.js:82` | **I** |
| HUD bar | `(1790, 86)`, 70 × 6; background `cream .16`; fill acid/red | px | `timeline.js:84–85` | **I** |
| HUD ticks | 6 ticks, 1 × 5, 14 px pitch, from `(1790, 96)` | px | `timeline.js:87` | **I** |
| HUD flower | 6 gold petals 3 × 6 at r 7 around `(1840, 62)`; red centre r 3 | px | `timeline.js:89–90` | **I** |
| HUD hiding | `noDoom` on 3 shots: cold, mugs, desk | shots | `act1.js:31,396`; `act5.js:340` | **V** |
| Diegetic meter | body 88 × 420; tube 34 × 330; 11 tick marks (10 intervals); bulb 76 × 68 | px | `characters.js:905–928` | **I** |
| Meter gradient | `redD → red (.55) → gold` | — | `characters.js:912–914` | **I** |
| Meter usage | 5 calls at 34, 48, 61, 68, 99.9 | % | `act2.js:43,373,711,931`; `act4.js:1201` | **V** |
| Print margin | 26 | px | `timeline.js:97` | **I** |
| Corner mark length | 16, 1 px, `ink .22` | px | `timeline.js:96–99` | **I** |
| Colour bars | 4 patches: blue, red, gold, ink; 11 × 5 at `(1820 + i×15, 1046)` | px | `timeline.js:102–103` | **I** |
| Timecode | `CLAUDE POP · 00000`, 11 px, `ink .5`, letter 1, at `(1576, 1050)`, 30 fps counter | px | `timeline.js:104` | **I** |
| Copyright | `© 2026 PAPER SINGULARITY`, 11 px, `ink .5`, at `(44, 1050)` | px | `timeline.js:105` | **I** |
| Subtitle band | panel `66 … 1386` × `948 … 1010` at default x/y | px | `type.js:195` | **I** |
| Subtitle text baseline | 992; words from 148 | px | `type.js:189,203` | **I** |
| Hero type left margin | 74–116 | px | e.g. `act2.js:46`; `act1.js:130` | **V** |
| Hero type right edge | right-aligned at 1712 or 1840 | px | `act1.js:383`; `act4.js:805` | **V** |
| Hero baseline | 236–930; labels 90–176 | px | acts | **V** |
| Lowest text baseline | 1030 (diagram label) | px | `act4.js:1416` | **V** |
| Cast ground | 938–1012 | px | acts | **V** |
| Safe-zone constants | absent | — | no `SAFE`/`margin` constant | **F** |
| Declared safe rule | faces/key action above `y=960` when subtitle active | px | `PRODUCTION.md:86` | **F** |
| Declared type floor | subtitles ≥28 px, hooks ≥120 px | px | `PRODUCTION.md:85` | **F** |
| Enforcement | none; a machine cannot fail either rule | — | — | **F** |

The only hard keep-outs are the 26 px print margin and the HUD panel. `PRODUCTION.md` declares a 240×92 ticker and 52 shots; the code ships 246×96 and 51 shots. The code is the contract. The declared 28 px subtitle floor is already broken by the 26 px `P(DOOM)` balloon (`act5.js:202`), which is one more reason the declaration cannot be a gate.

---

## 11. Determinism

| parameter | exact value | unit | code ref | status |
|---|---|---|---|---|
| `hash(n)` | `fract(sin(n × 127.1 + 311.7) × 43758.5453123)` | — | `core.js:21` | **I** |
| `hash2(a,b)` | `hash(a × 12.9898 + b × 78.233)` | — | `core.js:22` | **I** |
| Global seed | none; time is the only axis | — | `renderAt(t)` | **F** |
| `makeRng(seed)` | LCG `s = (s×1664525 + 1013904223) mod 2³²`, **never called** | — | `core.js:192–195` | **U** |
| Object seeds | per call: type 0, sticker 7, circular `i×7`, vertical `i×9`; scenes pass 3–12 | int | `type.js:41,136,160,178` | **V** |
| Texture randomness | `fiberCanvas` uses `hash` only | — | `core.js:91–112` | **I** |
| Grain randomness | `Math.random()` for value and alpha, once per page | — | `core.js:120,122` | **F** |
| Grain determinism | same page: fixed after init; different worker/page: different grain | — | `core.js:128–131` | **F** |
| Wall clock in paint | none | — | grep | **I** |
| `performance.now` | only measures sheet render time | — | `timeline.js:118,126` | **U** |
| `requestAnimationFrame` | preview only; renderer seeks absolutely | — | `studio.html:95` | **I** |
| State between frames | none intended; `beginShot` resets transform, alpha, composite, shadowBlur, clears and fills | — | `timeline.js:12–20` | **I** |
| State not reset | `lineDash`, `lineCap`, `font`, `letterSpacing`, `textAlign` rely on `save/restore` | — | `timeline.js:14–19` | **V** |
| Texture cadence | paper 2 Hz, grain 24 Hz, type boil 12 Hz | Hz | `core.js:143,153`; `type.js:48` | **I** |
| Frame purity | same page + same `t` = same JPEG | — | by construction | **I** |
| Cross-page purity | false because of grain | — | `core.js:120` | **F** |
| Worker-safe | no | — | 4 pages, 4 grains | **F** |
| Output sampling | JPEG q .95; x264 CRF 15 | — | `render.mjs:38,97` | **I** |
| `Math.sin` portability | last-bit differences possible across JS engines; same Chrome build is stable | — | `core.js:21` | **V** |

> `grainCanvas` is the one place the paint path is not seeded (`core.js:120,122`). Everything else — fibre texture, paper offset, grain offset, type boil, character jitter, confetti, dust — is a pure function of integer seeds and `t`.

---

## 12. Absent, declared-only, or dead

| mechanism | status | closest thing in code |
|---|---|---|
| Per-layer parallax factor | **F** | static multi-plane art, manual offsets (`props.js:366`; `act5.js:268`) |
| 2.5D camera / perspective / FOV / DOF | **F** | 2-D similarity transform (`core.js:313–319`) |
| Camera limits or clamps | **F** | none |
| Halation / bloom | **F** | 5 `shadowBlur` glows (`act3.js:339` etc.) |
| Paper fold / curl / bend / collision | **F** | sine flutter, static torn paths |
| Spring / physics / IK | **F** | absolute angles, sine bounce |
| Pose interpolation | **U** | `lerpPose` defined but unused (`core.js:332`) |
| Beat-quantised cuts | **F** | lyric-boundary cuts |
| Crossfade / dissolve | **F** | hard cut |
| Paper wipe | **U** | `GLOBAL_TRANS` empty (`timeline.js:28`) |
| Auto text wrap | **U** | `TY.wrap` unused (`type.js:15`) |
| Font weights other than 400 | **U** | Medium loaded, never selected |
| Gloss on paper | **U** | `paper()` supports it; no call uses it |
| Prebuilt halftone tile | **U** | `HALFTONE` built, never used |
| `makeRng` | **U** | LCG, no callers |
| `worldToScreen` | **U** | no callers |
| `drawCanvasRot` | **U** | no callers |
| Offscreen canvas cache `OFF` | **U** | `off()` defined, no callers |
| Day/night palette variant | **F** | authored gradient pairs |
| Colour cap per frame | **F** | 3–15 named roles observed |
| Safe-zone enforcement | **F** | 26 px print margin only |
| Audio-reactive picture | **F** | hardcoded 88 BPM grid |
| Seeded grain | **F** | `Math.random` |
| 52-shot structure | **V** · declared | code has 51 (`PRODUCTION.md:80`) |
| 240×92 ticker | **V** · declared | code has 246×96 (`PRODUCTION.md:63`) |

---

## 13. Machine schema

Proposed field names, types, units and ranges. **Basis:** `code` = literal in the engine; `obs` = observed band in this film (not enforced); `prop` = a proposal for a reusable schema, not present in the original. A reusable identity should treat `code` as hard, `obs` as the default band, and `prop` as a declared choice.

### 13.1 `medium`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `medium.canvas.width` | int | px | 1920 | code |
| `medium.canvas.height` | int | px | 1080 | code |
| `medium.canvas.aspect` | string | ratio | `"16:9"` | code |
| `medium.canvas.unit` | string | — | `"px at z=1"` | code |
| `medium.fps` | int | frames/s | 30 | code |
| `medium.duration_s` | float | s | 156.62 | code |
| `medium.frames` | int | frames | 4699 | code |
| `medium.dpr` | float | ratio | 1 | code |
| `medium.background` | hex | — | `#F2E8D5` | code |
| `medium.colour_space` | string | — | `"sRGB / bt709"` | code |
| `medium.encode.codec` | string | — | `"libx264"` | code |
| `medium.encode.crf` | int | — | 15 | code |
| `medium.encode.preset` | string | — | `"slow"` | code |
| `medium.encode.tune` | string | — | `"film"` | code |
| `medium.encode.pix_fmt` | string | — | `"yuv420p"` | code |
| `medium.encode.audio` | string | — | `"aac 320k"` | code |
| `medium.render.workers` | int | pages | 4 | code |
| `medium.render.seek` | string | — | `"absolute t=i/fps"` | code |
| `medium.cast.sol.height_units` | float | world px | 706 | code |
| `medium.cast.sol.head_y` | float | world px | −604 | code |
| `medium.cast.sol.hip_y` | float | world px | −300 | code |
| `medium.cast.sol.shoulder_y` | float | world px | −500 | code |
| `medium.cast.sol.petals` | int | petals | 22 | code |
| `medium.cast.sol.petal_r0` | float | px | 24 | code |
| `medium.cast.sol.petal_r1` | float | px | 146 | code |
| `medium.cast.mira.height_units` | float | world px | 610 | code |
| `medium.cast.mira.head_y` | float | world px | −536 | code |
| `medium.cast.mira.hip_y` | float | world px | −270 | code |
| `medium.cast.mira.shoulder_y` | float | world px | −452 | code |
| `medium.cast.skin` | hex | — | `#F0C9A4` | code |
| `medium.cast.hair` | hex | — | `#171319` | code |
| `medium.cast.brad` | hex | — | `#C68E2E` | code |
| `medium.cast.shadow` | float | α | 0.22 | code |

### 13.2 `palette`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `palette.entries` | array | — | 38 `{name, hex, role}` | code |
| `palette.entries[].role` | enum | — | substrate, highlight, ink, impact, tech, signal, pop, idol, calm, cosmic, metal, sky, earth, nature, void | code |
| `palette.closed` | bool | — | false | obs |
| `palette.off_palette_literals` | bool | — | true; 296 distinct in this film | obs |
| `palette.max_named_roles_per_frame` | int | roles | 3–15; median 6 | obs |
| `palette.max_combined_per_frame` | int | colours | 58 (observed) | obs |
| `palette.shading` | string | — | `"additive RGB; -40…+34"` | code |
| `palette.mixing` | string | — | `"component-wise sRGB"` | code |
| `palette.day_pairs` | array | hex pair | warm cream → ochre; luma .54–.88 | obs |
| `palette.night_pairs` | array | hex pair | near-black → violet/teal; luma .003–.026 | obs |
| `palette.variant_system` | bool | — | false | code |

### 13.3 `light`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `light.direction` | vector | — | `[+1, +1]` | code |
| `light.paper_shadow.offset_x` | float | px | 6 | code |
| `light.paper_shadow.offset_y` | float | px | 10 | code |
| `light.paper_shadow.alpha` | float | 0–1 | 0.22 | code |
| `light.paper_shadow.blur` | float | px | 0 | code |
| `light.paper_shadow.ratio_yx` | float | ratio | 1.6–1.8 | obs |
| `light.object_edge_px` | float | px | 1.5–4 | obs |
| `light.type_shadow.offset_em` | float | em | 0.035 | code |
| `light.type_shadow.alpha` | float | 0–1 | 0.26 | code |
| `light.type_edge_em` | float | em | 0.055 | code |
| `light.type_edge_min_px` | float | px | 2 | code |
| `light.contact_shadow.alpha` | float | 0–1 | 0.12–0.25 | obs |
| `light.spotlight.alpha` | float | 0–1 | 0.10–0.18 | obs |
| `light.spotlight.len_px` | float | px | 820–1150 | obs |
| `light.spotlight.w0_px` | float | px | 30–40 | obs |
| `light.spotlight.w1_px` | float | px | 280–520 | obs |
| `light.glow.blur_px` | float | px | 12–34 | obs |
| `light.flash.alpha` | float | 0–1 | 0.22–1.0 | obs |
| `light.halation` | bool | — | false | code |
| `light.ambient_occlusion` | bool | — | false | code |

### 13.4 `texture`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `texture.paper.size_px` | int | px | 1024 | code |
| `texture.paper.base` | hex | — | `#F2E8D5` | code |
| `texture.paper.dark` | hex | — | `#C9B896` | code |
| `texture.paper.light` | hex | — | `#FFFDF4` | code |
| `texture.paper.mottles` | int | count | 90 | code |
| `texture.paper.mottle_r_px` | range | px | 40–230 | code |
| `texture.paper.mottle_alpha` | float | 0–1 | 0.035 | code |
| `texture.paper.fibers` | int | count | 4200 | code |
| `texture.paper.fiber_len_px` | range | px | 2–24 | code |
| `texture.paper.fiber_width_px` | range | px | 0.4–1.3 | code |
| `texture.paper.fiber_alpha` | range | 0–1 | 0.05–0.14 | code |
| `texture.paper.specks` | int | count | 1500 | code |
| `texture.paper.speck_px` | range | px | 0.7–2.5 | code |
| `texture.paper.speck_alpha` | range | 0–1 | 0.06–0.14 | code |
| `texture.grain.size_px` | int | px | 512 | code |
| `texture.grain.alpha_max` | int | 0–255 | 34 | code |
| `texture.grain.blend` | string | — | `"soft-light"` | code |
| `texture.grain.seeded` | bool | — | false | code |
| `texture.paper_overlay.blend` | string | — | `"multiply"` | code |
| `texture.paper_overlay.alpha` | float | 0–1 | 0.5 | code |
| `texture.paper_overlay.offset_px` | range | px | 0–159 | code |
| `texture.paper_overlay.rate_hz` | float | Hz | 2 | code |
| `texture.grain_overlay.blend` | string | — | `"soft-light"` | code |
| `texture.grain_overlay.alpha` | float | 0–1 | 0.45 | code |
| `texture.grain_overlay.offset_px` | range | px | 0–511 | code |
| `texture.grain_overlay.rate_hz` | float | Hz | 24 | code |
| `texture.halftone.cell_px` | range | px | 14–24 | obs |
| `texture.halftone.dot` | range | ratio | 0.4–0.55 | obs |
| `texture.halftone.alpha` | range | 0–1 | 0.05–0.18 | obs |
| `texture.halftone.angle_rad` | range | rad | 0.2–0.7 | obs |
| `texture.vignette.strength` | float | 0–1 | 0.34 | code |
| `texture.vignette.inner_r_px` | float | px | 194.4 | code |
| `texture.vignette.outer_r_px` | float | px | 885.6 | code |
| `texture.torn.amt_px` | range | px | 3–10 | obs |
| `texture.torn.edge_points` | tuple | count | 14, 10, 14, 10 | code |
| `texture.blob.jitter` | float | ratio | 0.06 | code |
| `texture.gloss.enabled` | bool | — | false | code |

### 13.5 `camera`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `camera.enabled` | bool | — | per shot; 27/51 true | obs |
| `camera.anchor` | vector | px | `[960, 540]` | code |
| `camera.x` | float | px | 760–1430 | obs |
| `camera.y` | float | px | 330–668 | obs |
| `camera.z` | float | × | 0.84–3.55 | obs |
| `camera.roll_rad` | float | rad | −0.07…+0.13 | obs |
| `camera.shake_px` | float | px | 0–12 | obs |
| `camera.shake_freq_x` | float | rad/s | 71 | code |
| `camera.shake_freq_y` | float | rad/s | 63 | code |
| `camera.shake_y_ratio` | float | ratio | 0.7 | code |
| `camera.shake_decay` | float | — | 0 | code |
| `camera.parallax` | bool | — | false | code |
| `camera.fov` | bool | — | false | code |
| `camera.dof` | bool | — | false | code |
| `camera.perspective` | bool | — | false | code |
| `camera.limits` | object | — | none | code |
| `camera.local_zoom_max` | float | × | 2.6 | obs |
| `camera.use_by_act` | array | shots | 5/7, 15/17, 6/6, 1/17, 0/4 | obs |

### 13.6 `motion`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `motion.easing` | enum | — | ease, easeOut, easeIn, backOut, elasticOut, expoOut, smooth | code |
| `motion.backOut.c` | float | — | 1.70158 | code |
| `motion.keyframe.default_easing` | string | — | `"ease"` | code |
| `motion.beat.bpm` | float | BPM | 88 | code |
| `motion.beat.offset_s` | float | s | 0.21 | code |
| `motion.beat.triplet_bpm` | float | BPM | 132 | code |
| `motion.beat.bar_length_beats` | null | beats | null (no bar) | code |
| `motion.pulse.decay_default` | float | — | 5 | code |
| `motion.pulse.decay_flower` | float | — | 4 | code |
| `motion.pulse.flower_amplitude` | float | ratio | 0.045 | code |
| `motion.bounce_amp_px` | range | px | 4–20 | obs |
| `motion.sway_px` | range | px | 3–10 | obs |
| `motion.head_tilt_rad` | range | rad | 0.02–0.12 | obs |
| `motion.hair_swing_px` | range | px | −8…20 | obs |
| `motion.confetti_fall_px_s` | range | px/s | 129–219 | code |
| `motion.dust_drift_w_s` | range | screen/s | 0.012–0.038 | code |
| `motion.speed_streak_px_s` | range | px/s | 500–1800 | code |
| `motion.spring` | bool | — | false | code |
| `motion.physics` | bool | — | false | code |
| `motion.pose_interpolation` | bool | — | false | code |

### 13.7 `edit`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `edit.shots` | int | shots | 51 | code |
| `edit.cuts` | int | cuts | 50 | code |
| `edit.shot_s.mean` | float | s | 3.07 | obs |
| `edit.shot_s.median` | float | s | 3.06 | obs |
| `edit.shot_s.min` | float | s | 0.66 | obs |
| `edit.shot_s.max` | float | s | 6.14 | obs |
| `edit.cut` | string | — | `"hard"` | code |
| `edit.crossfade` | bool | — | false | code |
| `edit.beat_quantised` | bool | — | false | code |
| `edit.lyric_boundary_share` | float | ratio | 0.92 | obs |
| `edit.transition.iris.count` | int | shots | 10 | obs |
| `edit.transition.iris.duration_s` | range | s | 0.17–0.44 | obs |
| `edit.transition.iris.r_px` | range | px | 8–1500 | obs |
| `edit.transition.iris.feather_px` | range | px | 26–120 | obs |
| `edit.transition.flash.count` | int | calls | 38 | obs |
| `edit.transition.flash.duration_s` | range | s | 0.14–0.44 | obs |
| `edit.transition.flash.alpha` | range | 0–1 | 0.22–1.0 | obs |
| `edit.transition.paper_wipe` | bool | — | false | code |
| `edit.compositing_order` | array | — | reset, paper, scene, transitions, subtitle, HUD, print, paper overlay, grain, vignette | code |

### 13.8 `type`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `type.families` | array | — | Anton, Archivo Black, Instrument Serif, DMMono, Permanent Marker, Black Han Sans | code |
| `type.family_default` | string | — | `"Anton"` | code |
| `type.weight` | int | — | 400 only | code |
| `type.italic` | bool | — | Instrument Serif only | code |
| `type.track_em` | float | em | 0.01 | code |
| `type.size_px.display` | range | px | 26–376; median 128 | obs |
| `type.size_px.hook` | range | px | 92–376 | obs |
| `type.size_px.label` | range | px | 7–108 | obs |
| `type.size_px.serif` | range | px | 11–250 | obs |
| `type.size_px.sticker` | range | px | 12–62 | obs |
| `type.char_rot_rad` | range | rad | 0.008–0.10; default 0.035 | code |
| `type.char_y_em` | float | em | 0.012 | code |
| `type.edge_em` | float | em | 0.055 | code |
| `type.edge_min_px` | float | px | 2 | code |
| `type.shadow_em` | float | em | 0.035 | code |
| `type.shadow_alpha` | float | 0–1 | 0.26 | code |
| `type.boil_hz` | int | Hz | 12 | code |
| `type.appear_scale_min` | float | × | 0.55 | code |
| `type.appear_scale_max` | float | × | 1.0 | code |
| `type.stagger_s` | range | s | 0.012–0.06 | obs |
| `type.wrap` | bool | — | false | code |
| `type.max_words_subtitle` | int | words | 9 | obs |
| `type.max_chars_subtitle` | int | chars | 54 | obs |
| `type.sticker.pad_x_em` | float | em | 0.38 | code |
| `type.sticker.pad_y_em` | float | em | 0.28 | code |
| `type.sticker.rot_rad` | float | rad | −0.05 | code |
| `type.sticker.tear_px` | float | px | 3.5 | code |
| `type.subtitle.x` | int | px | 84 | code |
| `type.subtitle.y` | int | px | 992 | code |
| `type.subtitle.size_px` | int | px | 31 | code |
| `type.subtitle.w_max` | int | px | 1300 | code |
| `type.subtitle.h` | int | px | 62 | code |
| `type.subtitle.lift_px` | int | px | 5 | code |
| `type.subtitle.gap_px` | int | px | 9 | code |

### 13.9 `hud`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `hud.ticker.enabled` | bool | — | per shot; 48/51 true | obs |
| `hud.ticker.x` | int | px | 1634 | code |
| `hud.ticker.y` | int | px | 40 | code |
| `hud.ticker.w` | int | px | 246 | code |
| `hud.ticker.h` | int | px | 96 | code |
| `hud.ticker.alpha` | float | 0–1 | 0.92 | code |
| `hud.ticker.fill` | hex | — | `#171310` | code |
| `hud.ticker.value_range` | range | % | 8–100 | code |
| `hud.ticker.red_threshold` | float | % | 95 | code |
| `hud.ticker.bar` | rect | px | `[1790, 86, 70, 6]` | code |
| `hud.ticker.ticks` | int | count | 6 | code |
| `hud.ticker.flower` | object | px | centre `[1840, 62]`, r 7, 6 petals | code |
| `hud.print.margin_px` | int | px | 26 | code |
| `hud.print.mark_len_px` | int | px | 16 | code |
| `hud.print.mark_alpha` | float | 0–1 | 0.22 | code |
| `hud.print.colour_bars` | array | hex | blue, red, gold, ink | code |
| `hud.print.timecode_fps` | int | frames/s | 30 | code |
| `hud.meter.body_px` | vector | px | `[88, 420]` | code |
| `hud.meter.tube_px` | vector | px | `[34, 330]` | code |
| `hud.meter.bulb_px` | vector | px | `[76, 68]` | code |
| `hud.meter.ticks` | int | count | 11 marks (10 intervals) | code |

### 13.10 `layout`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `layout.margin_screen_px` | range | px | 26 (print) to 116 (hero type) | obs |
| `layout.safe_area_declared` | bool | — | false | code |
| `layout.ground_y` | range | px | 938–1012 | obs |
| `layout.subtitle_band` | rect | px | `[66, 948, 1320, 62]` | code |
| `layout.hud_box` | rect | px | `[1634, 40, 246, 96]` | code |
| `layout.hero_x` | range | px | 74–116 | obs |
| `layout.hero_y` | range | px | 236–930 | obs |
| `layout.hero_right_px` | int | px | 1712 or 1840 | obs |
| `layout.cast_scale` | range | × | 0.20–1.18 | obs |
| `layout.print_keepout_px` | int | px | 26 | code |
| `layout.faces_above_y` | int | px | 960 (declared, not enforced) | prop |

### 13.11 `determinism`

| field | type | unit | allowed / default | basis |
|---|---|---|---|---|
| `determinism.hash` | string | — | `"fract(sin(n*127.1+311.7)*43758.5453123)"` | code |
| `determinism.hash2` | string | — | `"hash(a*12.9898+b*78.233)"` | code |
| `determinism.global_seed` | null | — | null | code |
| `determinism.rng` | string | — | `"LCG 1664525/1013904223 (unused)"` | code |
| `determinism.grain_seeded` | bool | — | false | code |
| `determinism.clock_pure` | bool | — | true | code |
| `determinism.state_between_frames` | bool | — | false | code |
| `determinism.texture_cadence_hz` | object | Hz | paper 2, grain 24, type 12 | code |
| `determinism.worker_safe` | bool | — | false | code |
| `determinism.frame_sample` | string | — | `"t=i/30"` | code |
| `determinism.output` | string | — | `"jpeg q0.95"` | code |
| `determinism.cross_page_equal` | bool | — | false (grain) | code |

---

## 14. Source index

| file | lines | what it owns |
|---|---|---|
| `src/core.js` | 339 | canvas, palette, texture, paper, shadow, camera, easing, hash |
| `src/type.js` | 224 | type, sticker, circular, vertical, subtitle |
| `src/timeline.js` | 133 | scene registry, frame reset, compositing, HUD, print marks |
| `src/lyrics.js` | 85 | 45 lines, word times, DOOM curve |
| `src/scene_kit.js` | 634 | sets, props, iris, speed streaks, stamps |
| `src/characters.js` | 928 | paper dolls, faces, flowers, brads, doom meter |
| `src/props.js` | 464 | stage, lab, gym, road, space, data sets |
| `src/scenes/act1–5.js` | 2,782 | 51 shots |
| `render.mjs` | 129 | frame loop, workers, ffmpeg |
| `studio.html` | 126 | canvas, fonts, preview, render hook |
| `PRODUCTION.md` | 88 | declared intent; several values differ from code |

**The contract in one sentence:** a 1920×1080 paper stage with a 38-colour riso base and 296 scene literals, flat down-right shadows at 22% with no blur, 2 px object edges, a 12 Hz glyph boil over 2 Hz paper and 24 Hz grain, an 88 BPM body pulse, hard cuts on lyric lines, and a CAM used in half the shots with no `setCam` at all in the last act.
