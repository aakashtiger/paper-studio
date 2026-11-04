# E — Two code-first animation kits: how they encode identity and motion

Research note, 2026-11-04. Read-only study: no engine, style or fixture was changed.
The only artefact is this file.

**Sources**

| Kit | Path | What I read |
|---|---|---|
| A — cartoon-short-kit | `C:\Users\Aakash\Downloads\Compressed\_research\cartoon-short-kit` | every code file: `engine/main.js`, `motion.js`, `paint.js`, `roman.js`, `index.html`; `example/soldier/story.js`, `audio.py`; `tools/timing.py`, `render.mjs`, `sheet.py`, `finish.sh`, `setup.sh`; `README.md` |
| B — claude-animated-shorts | `C:\Users\Aakash\Downloads\Compressed\_research\claude-animated-shorts\claude-animated-shorts-main` (same tree as github.com/mromidev/claude-animated-shorts, MIT, 2 commits) | `SKILL.md`, `README.md`, `references/STYLE_BIBLE.md`, `references/reports/{motion,characters,depth,grade,textures}.md`, `templates/bridge/{story,lights,shade,cardshade,ink,lensblur,grade,cast,toon,paint,build,world}.ts`, `Bridge.tsx`, `templates/audio/{timeline,sfx,mix}.py`, `templates/scripts/{short_qa.py,bridge-stills.mjs}`, `templates/SCRIPT_example.md` |

Line references are `file:line` and point at the copy above. Kit A vendors Kit B's `toon.ts`
as `toonbase.js` (`tools/setup.sh`: `git clone … mromidev/claude-animated-shorts`), so the two
kits share one character-drawing library and differ in everything around it.

Every engine, story, tool and template file listed was read in full, except the large files where
this note cites a range (`toon.ts`, `build.ts`, `paint.ts`, `world.ts`, `ink.ts`) and the seven
`references/reports/*.md`, which were read in the cited sections rather than cover to cover. The 20
contact sheets and 38 reference frames were not read as images; the numbers in §2 come from the
reports, not from my own measurement.

---

## 0. Verdict

- **Neither kit is generative.** Both are 100% code-drawn: Canvas2D character cards, procedural
  Canvas2D textures, three.js primitives. There is no image model and no video model anywhere in
  either render path. Kit B's only non-code assets are Kenney CC0 GLB props and fonts; Kit A's only
  binary asset is the recorded voice. The only model in Kit B is a *reviewer*
  (`SKILL.md:74`, an Opus verifier scores stills), never a pixel source.
- **Kit A is a compact executable film.** 8 shots, 592 frames (19.73 s), one `story.js` that exports
  shots, lights, camera keys, DOF, world state, actors and effects. Its schema is a 10-name
  import surface.
  Its median shot is **2.57 s**, within 15% of Paper K-pop's 3.0 s median.
- **Kit B is a deep look system.** 15 shots, 2025 frames (67.5 s), a 29-field light preset, a
  7-knot colour grade, ink widths measured in pixels at distances, a cue sheet with distance
  modelling. Its median shot is **4.33 s**, 44% longer than the pack's.
- **What transfers in full:** shot span + camera keys, hold creep, the 7-frame sign-flipping kick,
  the cast construction constants, blink/idle/walk as frame functions, the cue model
  (event vs bed, −6 dB under voice, distance gain/low-pass/send, duck), and the 0.4 s freeze budget.
- **What does not transfer:** the whole 3D stack (perspective camera in metres, physical sun,
  shadow maps, normal/depth ink pass, thin-lens DOF, HDR bloom, tone-map inversion), the human
  3.5-head-height proportions, and "the film is a TypeScript file".
- **Best shape for us:** three layers — `tokens.json` (invariant identity), `score.json` (per-film
  data: keys, enums, measured units), `library/characters` (cast). No functions in a film file.
  Both kits violate this in the same place: `story.js`/`story.ts` contains per-film *code*, not data.

---

## 1. Kit A — cartoon-short-kit

### 1.1 Architecture

`README.md` describes it as "audio in, finished vertical cartoon short out. 2D bean-head cards in an
inked, painted 3D world (three.js in headless Chromium, no Remotion and no GPU needed), with a
synthesized music bed and SFX."

The render is five passes, all inside `window.renderFrame(f)` (`engine/main.js:401-427`):

1. **State.** `shotAt(f)` → `lightFor(S,f)` → `camAt(f)`; `worldAt(f)` → `worldState()`; `placeSun()`;
   `drawActors([...actorsAt(f,T), ...fxAt(f,T)], camera)`.
2. **Colour pass** into `rtColor` (MSAA 4, half float), `PCFSoftShadowMap`, no tone mapping
   (`main.js:10-12`).
3. **Normal + depth pass** into `rtNd`: every mesh's material is swapped for a normal/depth shader;
   fog and shadow maps are disabled; sky and clouds are hidden (`main.js:387-399`).
4. **Ink + grade pass** into `rtInk` (`main.js:276-303`).
5. **Lens pass** to screen (`main.js:304-316`), then `canvas.toDataURL('image/jpeg')` in
   `tools/render.mjs:19`.

`tools/render.mjs` drives one Chromium (`--use-angle=swiftshader`, 1080×1920 viewport), renders an
explicit frame list, supports `RESUME` by skipping existing `f%04d.jpg`, and logs s/frame. There is
no timeline object: **the frame index is the only clock**.

The world itself (bridge, temple, houses, trees, clouds, helmet) is built by ~200 lines of
`main.js:90-245` from boxes, cylinders, spheres and extrusions, with world-scaled UVs (`tbox`,
`main.js:64-69`). Constants: `DECK = 6`, `HALF = 26`, `BW = 2.3` (`main.js:91`), camera `fov 40,
near 0.08, far 1500` (`main.js:15`).

### 1.2 `story.js` schema — every field

`story.js` is the film. `main.js:4` imports exactly these names:

```js
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt } from './story.js';
```

| Name | Type | Controls | Example |
|---|---|---|---|
| `FPS` | number | frame rate; every duration is frames | `30` |
| `TOTAL` | int | last frame + 1; the render loop's upper bound | `592` |
| `DECK` | number | world height re-exported for actor placement | `6` |
| `SHOTS` | array | shot list: `{id, a, b, light}`; `a`/`b` **inclusive** | `{id:'hook', a:0, b:87, light:'day'}` |
| `shotAt(f)` | fn | linear scan, first match wins; overlapping boundaries belong to the earlier shot | `SHOTS.find(s => f>=s.a && f<=s.b)` |
| `LIGHTS` | object | named light presets (2 here), 18–21 fields each | `day`, `golden` |
| `lightFor(S,f)` | fn | preset + per-shot overrides | hook animates `shadowExt` 8→45 |
| `CAMS` | object | **internal**; per-shot camera key arrays `{f,pos,look,fov,roll?}` | 4 keys for `hook` |
| `KICKS` | array | **internal**; impact shakes `{f,a}` | `{f:121,a:0.05}` |
| `camAt(f)` | fn | key interpolation + kicks + `flash` + `shadowAt` | returns `{pos,look,fov,roll,flash}` |
| `dofAt(f)` | fn | lens: `{focus,cinf,near}` per shot | `{focus: dist(C.pos, eye), cinf: 11}` |
| `worldAt(f)` | fn | world state flags | `{collapse, banner, bannerFall, old, braceFall, helmet}` |
| `actorsAt(f,T)` | fn | card placements, each with a **draw function** | `{key, draw, x,y,z, s, flip, yaw, roll, tint, alpha, order, blob, shadow, ground}` |
| `fxAt(f,T)` | fn | 2D effect cards | `{key, draw, x,y,z, s, blob:false, shadow:false, order:5, roll, tint}` |

`CAMS` and `KICKS` never leave `story.js`; `main.js` sees only `camAt`, so the key format is a
private implementation detail rather than a contract.

**What the schema does not have:** no `text`, no `sound`, no `transition`, no per-shot `duration`,
no `scene`, no `beat`, no `line`, no `why`, no `seed` at film level. Sound lives in `audio.py`, and
the voice is an external `voice.mp3`. Text exists only inside painted textures.

The inclusive `b` is a real porting hazard: shot `hook` ends at 87 and `refuse` starts at 88, but
`shotAt` would return `hook` for frame 87 only because `find` returns the first match. Kit B uses
half-open `a <= f < b` (`story.ts:67`). Ours is half-open. Do not copy the inclusive form.

### 1.3 Camera, easing, transitions (`motion.js` + `story.js`)

`motion.js` is 49 lines and is **not imported by the example film** — `story.js` re-implements
`smooth`, `lerp`, `lerp3`, `ramp`, `blinkAt` and its own `camAt`. Two consequences worth recording:

- `motion.js:23-37` `camFromKeys` implements a hold creep (`fov *= 1 - creep*(f-f0)*0.15`,
  `creep=0.0012`) and kicks. The shipped `story.js:86-102` `camAt` has **no creep at all** — its
  holds are truly static. The file header (`story.js:42`) claims "every hold creeps", but the
  implementation does not. The library and the film disagree.
- `blinkAt` is duplicated verbatim at `motion.js:45` and `story.js:134`. Any change to one is a
  silent divergence in the other.

**Easing library** (`motion.js:8-14`), all clamped to `[0,1]`:

| Name | Formula | Character |
|---|---|---|
| `smooth` | `t³(t(6t−15)+10)` | quintic smootherstep; symmetric, peak speed 1.875× mean |
| `easeOut` | `1−(1−t)³` | cubic, fast start |
| `easeIn` | `t³` | cubic, slow start |
| `back(t, s=1.7)` | `(t−1)²((s+1)(t−1)+s)+1` | overshoot ≈ 9.6% at `s=1.7` |
| `anticip(t, s=0.12)` | first 25%: `−s·sin(πt/0.25)`; then `back` | wind-up then go |
| `spring(t, freq=3, damp=5)` | `1 − e^(−damp·t)·cos(2π·freq·t)` | settle wobble, `t` in **seconds** |

**Camera model.** A perspective camera at `pos`, looking at `look`, `fov` in degrees, `roll` in
degrees (`main.js:404`: `camera.rotateZ(rx(C.roll))`). Keys are linear in position/target/fov/roll
with a smootherstep on the segment parameter; optional `b.path` inserts control points and switches
to a centripetal Catmull-Rom spline (`motion.js:16-20, 30-32`).

**Hold creep** (`motion.js:34`): `c.fov *= 1 − 0.0012·max(0, f−K[0].f)·0.15`. That is
**0.018 %/frame = 0.54 %/s** — very gentle. Kit B uses 0.15–0.35 %/frame (4.5–10.5 %/s), 8–19× more.

**Kicks** (`motion.js:35`, `story.js:96`): for `0 ≤ d < 7`, `s = ±a·(1−d/7)`; then
`look.y += s·3`, `look.z += s·2`, `roll += s·20` (degrees). Sign flips every frame; gone in 7 frames.
With `a=0.05` that is 0.15 m of look offset and 1° of roll — small. Note the unit clash with Kit B,
whose kick roll is radians.

**Transitions.** Kit A has **no crossfades**. Shot changes are hard cuts; two time jumps are white
flashes computed inside `camAt` (`story.js:98`) and read as `C.flash` in `main.js:421`:

- frames 278–283 (6 f): `0.85·(1−(f−278)/6)`
- frames 456–458 (3 f): `0.35·(1−(f−456)/3)`

**DOF** (`story.js:106-119`): per shot, `focus` = camera distance to a named world point (the
soldier's eye `[-21.5,7.32,0]`), `cinf` 4–14 px, `near` 1. The shader (`main.js:304-316`) uses
`k = 1 − focus/d`, `coc = k>0 ? cinf·k : min(−k·cinf·near, cinf·1.4)`, a 48-tap Vogel disc at the
golden angle 2.39996, no per-pixel noise.

### 1.4 Paint: palette, outlines, shadows, textures (`paint.js` + `main.js`)

**Determinism.** `rng(seed)` is a 32-bit LCG: `s = (s*1664525 + 1013904223) >>> 0`, value
`s/2^32` (`paint.js:4`). Every texture takes a seed and is generated once at module load.

**Texture set** (all Canvas2D, all deterministic):

| Function | Canvas | Content | Key values |
|---|---|---|---|
| `planks(seed,rot)` | 512² | 8 planks, grain, knots, cut line | `hsl(30–36, 42, 52–62)`; shadow lines `hsl(H−4,40,L−10)`; knots `#2b2620` r2.6 |
| `beam(seed,base)` | 256×512 | 40 grain strokes | default `hsl(30,40,40)` |
| `rotten(seed)` | 256×1024 | wet base, moss, rot holes, fungus | gradient `#6b4a2e→#4f3722→#33281c→#22231a`; 260 moss ellipses `hsl(85–110,45,26–40)` |
| `stone(seed,hue=36,sat=14,lig=66,bw=128,bh=64)` | 512² | coursed blocks | block `hsl(hue±4, sat, lig−6..+6)`, 6 px radius, top highlight +7 L, bottom −12 L |
| `mossy(c0,seed,amt)` | source size | 500·amt moss blobs + 8·amt ivy strands | ivy `hsl(100–120,45,30–45)` |
| `grass(seed)` | 512² | base + 90 patches + 1400 blades + 30 flowers | base `#6fa04a`; blades `hsl(80–110,45,30–55)`; flowers `#f3e27a/#ffffff/#e8a0c0` |
| `dirt(seed)` | 512² | 300 ellipses | base `#a88a62` |
| `plaster(seed,hue=40)` | 256² | 40 soft patches + skirt | `hsl(hue,40,86)` |
| `roof(seed)` | 256² | 8×8 tiles | `#7b2e1c`, tile `hsl(12–20,58,42–52)`, specular strip `rgba(255,220,180,.25)` |
| `marble(seed)` | 256×512 | 8 columns + 10 veins | `#efe7d6`, veins `rgba(150,140,130,.35)` |
| `banner()` | 256×512 | red field, gold border, SPQR, laurel, swallowtail | `#b8282b`, `#8a1c22`, `#e6b84a`, `bold 66px DejaVu Serif` |
| `helmetInside(reveal)` | 1024² | rusty interior + carved message | `#6d675e→#3a352f`; 3 lines at y 400/530/670, sizes 104/112/150 px |
| `radial(col,a)` | 128² | soft blob for contact shadows | `rgba(20,14,30,.6)` centre → 0 |

**Carved text** (`paint.js:131-144`) is the only "typography" in the render: each character is drawn
three times — lit lower lip `#d6cdbd` at `(+3,+4)`, groove `#16120f` at `(0,0)`, mid `rgba(70,60,50,.9)`
at `(−2,−3)` — with per-character rotation `±0.06 rad` and `±5 px` vertical jitter from the LCG.

**Palette.** Materials are a fixed table, not tokens (`main.js:22-33`): `plank`, `beam`, `rot`,
`stone`, `stoneMoss`, `grass`, `dirt`, `plaster`, `roof`, `marble`, `trunk #6a4a32`, `cypress #3f6b36`,
`pine #5c8a3c`, `bush #6c9a42`, `hill #7aa64c`, `hillFar #86ad60`, `mount #8fa7b8`, `snow #f4f6fa`,
`iron #5c5a57`, `bronze #b08a4a`, `wood #7a5434`, `door #5a3a24`, `window #2b2430`, `red #b8282b`.
The film's colour identity is therefore **the paint.js functions plus this table**, both hardcoded in
the engine, not in the story.

**Toon shading** is a 2-value gradient map: `DataTexture([90,90,90,255, 255,255,255,255], 2,1,
NearestFilter)` (`main.js:19`). Every lit material is `MeshToonMaterial` with that ramp. This is the
paper-cut look's ancestor: flat field + one shadow step.

**Ink contract** (`main.js:39-55`): `NOINK` is a `userData` flag; world meshes get `ndMat` (normal +
1/view-Z), character cards get `cardNd` (alpha mask + depth only, normal = 0), water gets `waterNd`.
The ink shader (`main.js:280-293`):

- 16 taps, radius `r·clamp(7/d, 0.62, 1.25)`, `r = 2.5 px` at `main.js:421`;
- depth jump: `smoothstep(0.006, 0.02, (ds−d)/d)` — near side only, **0.6–2% relative depth**;
- crease: same-depth neighbours with `dot(n,ns) < 0.88…0.72`, ×0.9 — **~28–44°**;
- cards: `if (card && ds > 0) continue` — the world ink never outlines a card; cards carry their own
  plum outline from the Pen;
- fade: `× (1 − smoothstep(140, 520, d)·0.8)` — 80% gone by 520 m;
- ink colour `vec3(.012,.01,.014)` — near-black with a violet bias;
- grade in the same pass: `sat 1.08`, per-light `gain`/`lift`, elliptical vignette `0.22`
  (`q·(1,.75)`, ×2.2), `flash` to white.

**Shadows.** Sun `DirectionalLight` with a 2048² PCFSoft map, `bias −0.0006`, `normalBias 0.03`,
`radius 2` (`main.js:85-87`); `shadowExt` 18 m (day), animated 8→45 in the hook. Cards cast real
shadows (`castShadow = true`, `customDepthMaterial` with `alphaTest 0.5`, `main.js:256-257`) and also
get a painted contact blob (`radial('20,14,30',0.6)`, scale `0.95s × 0.6s`, `main.js:378`) only when
`y < DECK+0.5`.

**Sky** (`main.js:73-80`): a 1200 m back-side sphere; `mix(hor, top, pow(h, .55))`; sun disc as
`smoothstep(1−sunSize, 1−0.6·sunSize, dot)` plus `0.35·pow(max(dot,0),24)`; sun colours per preset.

### 1.5 Character construction (`roman.js` on the shared Pen base)

`romanFront(p, key, opts)` (`roman.js:61-222`) draws on a **600×1000 design canvas** (the card canvas
is 1200×2000 and scaled ×2, `main.js:248, 264`). Signature:

```
opts = { expr, blink, look, facing, seed, L, R, tilt, headTilt, bob, nohelmet, light, web, step }
```

| Constant | Value | Meaning |
|---|---|---|
| `sole` | 975 | ground line in design units |
| `legsL` | 1.38 | leg length in head-heights |
| `torsoL` | 1.08 (stout 1.12) | torso length in head-heights |
| total | `(1+1.08+1.38)·HH = 3.46 HH` | ≈ 3.5 head-heights |
| head | `headBlob(seed,118,facing)` | W 236, H ≈ 222 (H/W 0.94) |
| `u` | `W/100` | all face metrics are in % of head width |
| outline | `ow = 5u` | 5% of head width |
| leg stroke | `5.8u`; foot `7.5u` | stick limbs |
| arm stroke | `5.2u`; hand dot `5.5u` | ink-dot hands |
| hip | `torsoBot − 0.12·HH` | |

**Outfits** (`roman.js:7-16`) are the character identity unit — 8 entries, each a flat colour set:

| id | tunic | cape/dress | skin | extras |
|---|---|---|---|---|
| `legion` | `#b8322f` | `#8f2228` | `SKIN` | helmet, armor, spear, shield |
| `old` | `#9c4a3c` | `#6e3330` | `#f3d6bb` | beard `#f4f1ea`, brows `#f4f1ea`, helmet `"old"`, no shield |
| `toga` | `#f1ead8` | toga `#6b3c8f` | `#f5c9a0` | hair `#3b2a20`, stout |
| `civA` | `#4f7fb8` | — | `#f5c9a0` | hair `#5a3b2a` |
| `civB` | `#d9a441` | dress `#c25a7a` | `SKIN` | hair `#2b211c` |
| `civC` | `#5d8a3a` | — | `#c99067` | hair `#1e1714`, stout |
| `workA` | `#8a5d3b` | apron `#d8c9a6` | `#f5c9a0` | cap `#c2733a` |
| `workB` | `#3f6a6f` | — | `#ecd0b6` | cap `#5b4a8a`, moustache `#4a3020` |

**Arm poses** are a closed enum of 14 (`roman.js:96-111`): `hang`, `spear`, `point`, `up`, `wave`,
`hip`, `belly`, `temple`, `lift`, `shield`, `cross`, `reach`, `cheek`, `thumb`. Each is a 3-point
cubic through shoulder/elbow/hand with `front` z-order and optional `finger`/`thumb`/`swirl`.

**Faces** are `{eye:[back,front], brow:[inner,outer], mouth}` in `FACE` (`roman.js:1-3` extends the
shared table with `snore`, `stubborn`, `squint`). The base library has 14 expressions (Kit B,
`toon.ts:234-249`). Eyes shift by `look·3u`; brows sit 20u above the eye line; the mouth 20u below;
everything slides toward `facing`.

**Card placement** (`main.js:367-379`): `rotation.y = atan2(cam.x − x, cam.z − z) + yaw` — a
yaw-only billboard, so a card always faces the lens but keeps a chosen offset. `s` scales, `flip`
mirrors X, `tint` multiplies colour (warm `#ffe2c8` in golden light, `story.js:140`), `alpha`
fades, `order` is the draw layer (default 2, props 3–5).

**Character effects** are also code: `fxZ` (three Zs at 900 weight Arial Black), `fxLeaf` (diamond
+ midrib), `fxDust` (7 puffs, `1−k²` fade), `fxDrip`, `fxWood`, plus the shared `fxPuff`, `fxCreak`,
`fxSplash`.

### 1.6 Typography, HUD, text

There is **none on screen**. No captions, no titles, no lower thirds, no HUD. Text appears only as
painted matter: the `SPQR` banner and the carved helmet message. This is a deliberate identity
choice and it matches Kit B's user rule ("No captions or labels in the video", `SKILL.md:19`).

The only type decisions are therefore physical: banner `bold 66px DejaVu Serif`, carving
104/112/150 px on a 1024² texture. Both are **world objects**, not a type layer.

### 1.7 Shot timing and audio sync (`tools/timing.py`)

`timing.py` produces `words.json` and `phrases.json` from a voice file:

1. **ASR first.** `faster_whisper` `base.en` (`int8`) or `openai-whisper` `base.en`, word timestamps,
   rounded to 3 decimals (`timing.py:41-54`).
2. **Fallback:** `ffmpeg silencedetect=n=−35dB:d=0.12`; segments shorter than 0.08 s are dropped
   (`timing.py:29-39`).
3. **Phrase split** at `, . ; : ! ?` plus closing quotes (`timing.py:58`).
4. **DP alignment** (`timing.py:56-90`): phrase groups of 1–3 are matched to 1–2 speech segments;
   cost = `(d − syllables/rate)² / max(d,0.3)`, plus `0.35` for every sentence end that falls inside
   a segment, plus `1.5 × gap` for every gap swallowed by a merge. Words inside a phrase are spread
   **by syllable count**, not by measured word time.
5. **Syllables** (`timing.py:15-21`): vowel groups; silent final `e` dropped unless `-le`; digits
   count as 2.

Output: `words.json` `[{w,s,e}]`; `phrases.json` `{duration, frames30, source, segments,
phrases:[{text,s,e}]}`. There is **no retiming**: the story must be rewritten to the measured phrase
times by hand — the soldier's header comment lists the phrase windows and the shot cuts sit on them.

Nothing in the pipeline snaps a cut to a word. The author does it by reading the printed phrase
table and choosing `a`/`b`. That is the weakest part of Kit A and the part our `voice --apply`
already does better.

### 1.8 Worked example: *The Soldier Who Never Left*

`example/soldier/story.js:1-5` states the phrase windows; `FPS 30`, `TOTAL 592` (19.73 s), 8 shots.

| # | id | frames | s | light | camera keys (fov, roll) | what happens |
|---|---|---|---|---|---|---|
| 1 | `hook` | 0–87 | 2.93 | day | 34→33 (0–16), pull back to 46→44.5 (60–87) | eye-level CU of the guard, then crane out to the bridge |
| 2 | `refuse` | 88–149 | 2.07 | day | 40→38 | slow push; the passer-by thumbs, then shocks |
| 3 | `collapse` | 150–227 | 2.60 | golden | 22→20.5 (150–196), jump to 30→28.5 (214–227) | wide on the temple, whip to the soldier |
| 4 | `crazy` | 228–277 | 1.67 | golden | 42→40 | push; three townsfolk laugh/point |
| 5 | `workers` | 278–353 | 2.53 | day | 33→32 | **flash 278–283**; time jump; helmet lifted |
| 6 | `inside` | 354–455 | 3.40 | day | 40→33, roll 0→−4.5 | push + roll into the carved message |
| 7 | `shock` | 456–482 | 0.90 | day | 30→29 | **flash 456–458**; the two workers recoil |
| 8 | `under` | 483–591 | 3.63 | day | 42→39, y 7.2→2.35, roll +3 | crane under the deck; brace snaps; splash |

Duration distribution: 88, 62, 78, 50, 76, 102, 27, 109 frames → **mean 74.0 f (2.47 s), median
77 f (2.57 s), min 27 f (0.90 s), max 109 f (3.63 s)**; longest/shortest = 4.0. Three shots are under
2.1 s; two are over 3.3 s. That is a **short-shot grammar** — much closer to a 30 s short than
Kit B's 4.33 s median.

Camera: 23 keys total (2–4 per shot). Every move is a **fov change** (a zoom), not a dolly — fov
40→38 ≈ ×1.057 scale. Rolls appear only in `inside` (−3, −4.5) and `under` (+3). Six kicks
(`121, 186, 466, 474, 548, 582`) mark the spear stamp, rumble, two recoils, the brace snap and the
splash. Two white flashes mark the two time jumps. No crossfades.

Text: none. Sound: `audio.py` — 104 BPM, Am–F–G–E, plucked arps + brass + kick/snare; 20 SFX cues
placed by frame (`whoosh` at 18, `leaves` at 62, `thunk` at 120, `rumble` at 176, `sting` at 14.18 s,
…), a 50 ms envelope follower ducking the bed by up to 45%, `tanh` soft clip, then `loudnorm
I=−14 TP=−1.5 LRA=7` and x264 `crf 17` in `finish.sh`.

### 1.9 Determinism

- Every texture is seeded (`paint.js:4`); every character pose is a pure function of
  `(seed, expr, blink, step, …)`.
- No `Math.random`, `Date.now`, `performance.now` or `requestAnimationFrame` in `engine/` or
  `story.js`; the only `Date.now` in the kit is the s/frame log in `render.mjs:16`.
- Time enters only as the integer frame `f`; `waterU.t = f/30` is the only clock (`main.js:364`).
- Card canvases are redrawn only when the pose key changes: `draw(key, fn)` early-returns if
  `key === this.key` (`main.js:262-266`), and keys are quantised with `q(x,n)` (`motion.js:49`).
- Frames are independent, so `render.mjs` can render any subset in any order and `RESUME` is safe.

This is the strongest part of Kit A and the part our engine already shares.

---

## 2. Kit B — claude-animated-shorts

### 2.1 The prescribed pipeline (`SKILL.md:29-80`)

1. **Topic and facts** — one surprising true story with a physical cause and effect, plus an
   everyday analogy; sources at the top of `SCRIPT.md`.
2. **Script** at **~3.7 words/s, 55–70 s**, with a fixed beat formula: hook (absurd fact, one line),
   setting, 3–4 escalating beats, snap, deadpan double line ("Luckily / Unluckily"), explanation by
   analogy, consequence, callback twist. Never describe what the viewer sees.
3. **Voice** → `voice.wav`; **word timings** → `words.json`; "everything is timed to words.json";
   hand-fix the timings.
4. **Shot plan** in `story.ts`: `SHOTS` (id, a/b, light, crowd, `tau`), `XFADE`, `FLASH_AT`,
   `CAMS`, `KICKS`, `DOF`, `FOREGROUND`. "Every visual reaction lands 0-3 frames before its word"
   (`SKILL.md:53`).
5. **World** — `lights.ts`, `shade.ts`, `build.ts`, `paint.ts`, `world.ts`.
6. **Characters** — `toon.ts`, `cast.ts`, `cardshade.ts`.
7. **Post** — ink → lens pre → lens main → bloom → neutral tone map → grade, MSAA 4; every pixel
   parameter scales with `output height / 1920`.
8. **Sound** — event table → synthesized SFX + original score ducked under voice; `mix.wav` at
   48 kHz with exact length, stems and `cues.md`. "Lock the picture's time constants before the
   sound is made. Any later timing change means re-running the sound."
9. **Look checks** — stills, side-by-side sheets, an Opus verifier with a ≤200-word verdict.
10. **Final render** — `--codec h264 --crf 16 --scale 1.3333` (1440×2560), mux, `short_qa.py`.
11. **Deliver.**

### 2.2 `story.ts` schema

| Name | Type | Controls | Example |
|---|---|---|---|
| `FPS`, `TOTAL` | int | 30, 2025 (67.5 s) | — |
| `D0`, `HALF`, `FILES`, `ROW_GAP`, `COUNT` | numbers | world/physics constants (deck 6 m, towers ±27, 4 files ±1.65/±0.55, 1.3 m row gap, 74 men) | — |
| `SHOTS` | `{id,a,b,light,crowd,tau,towns?}` | **half-open** spans; `tau(t)` maps screen time to story time | shot 1 `tau = 29.5 + t` (flash-forward); shot 13 `tau = t − 31` (flashback) |
| `XFADE` | `{shotId: frames}` | crossfades at place/time changes | `{9:6, 11:8, 12:8, 13:8, 14:8, 15:8}` |
| `FLASH_AT` | int | white flash start | `130`, 4 frames `[1,.75,.45,.2]` |
| `layersAt(f)` | fn | base shot + incoming shot during a fade, alpha | `[{id:8,alpha:1},{id:9,alpha:0.4}]` |
| `bridgeState(id,t)` | fn | physics state | `{bounce, drop, snap, collapsed}` |
| `CAMS` | `{[shot]: Key[]}` | **internal**; `{f, dur?, cut?, s:(f)=>Shot}`; `Shot = {pos,look,fov,roll}` | 36 keys over 15 shots |
| `kickAt(t)` | fn | 7-frame sign-flipping impact | `[[34.62,1],[36.95,1.6],…]` |
| `camAt(id,f)` | fn | runs keys, applies kick in metres computed from 3 px at 640 | `m = (3/640)·tan(fov/2)·L·a` |
| `DOF` / `dofAt` | array/fn | `{f,dur?,cInf,focus?}`; `focus` is a world point | `cInf 0,5,7,10,12,14,15,16` |
| `FOREGROUND` | array | `{a,b,kit,pos,s,yaw}` near framing props | bush at 0.3–0.5× focus |

**Story-time remap (`tau`) is the single best idea in either kit.** A shot can replay a different
moment of the story than its screen time implies: the hook is a flash-forward (+29.5 s), the golden
march is a flashback (−31 s). The world physics (`front(tau)`, `marchPhase(tau)`, `amp(tau)`) is
computed from `tau`, while the camera is computed from `f`. This decouples **narrative time** from
**screen time** without duplicating state — and it is per-shot data, not code.

**The physics is also a pure function of tau**: `front = 26 − 1.6(tau−4.4)` (marching speed 1.6 m/s),
`marchPhase = tau % 1` (1 Hz = 2 steps/s, footfalls at 0 and 0.5), `amp` is a piecewise-linear
envelope 0 → 0.55 m, `dropU` is quadratic, `DROP_H = 6.6 m`.

### 2.3 Camera grammar (`story.ts:88-282`)

- **Glide** is symmetric smootherstep (`glide(u)`, `story.ts:99`) over **18–40 frames**; peak speed
  is `1.875 × distance / duration`, so a move's duration is chosen to keep peak ≤ 25 px/f at 720p.
- **Cuts** are explicit: a key with `cut: true` snaps instead of blending. "A reframe bigger than
  about half a frame width or 40% zoom is a hard cut."
- **Holds creep**: `pushK(f, f0, rate, punch, n)` returns `exp(−s)` scale; `rate` 0.0015–0.003/frame,
  `punch` 0.006/frame for 35 frames with 8-frame soft edges on a stressed word.
- **Two push mechanisms**: `dolly()` moves the camera toward the look point; `zoom()` changes fov by
  `tan(fov/2)·k` and is used when the lens is next to a wall. The paper equivalent is one scale.
- **Rolls** 4–8° over ≥18 frames on emphasis beats; a "rolled" variant layers a roll-only move.
- **Kicks**: `camAt` converts a 3 px offset at 640 wide into metres at the look distance and adds
  `roll + a·0.004 rad`; the offset flips sign every frame and decays as `(1−n/7)^1.5`.
- **Curved paths**: the final crane is an explicit quadratic Bézier through `[[0,18,−16],
  [17,15,−44], [0,7,2]]` (`story.ts:191-196`).

The header comment (`story.ts:89-94`) is the compressed grammar: symmetric smootherstep 18–40 f,
cuts on big reframes, creep 0.15–0.35%/f, punch 0.6%/f, rolls 4–8°, no hand-held float.

**Transitions** are a table, not a function: 15 shots give 14 boundaries — **6 crossfades** of 6–8
frames (0.20–0.27 s) at place/time changes (`XFADE`), and 8 hard cuts. One of those hard cuts
(shot 9 → 10) is invisible because both shots share `CAMS[9]`, so the camera continues across the
boundary. A crossfade is centred on the cut (`layersAt`), so the incoming shot starts `frames/2`
before `a` and fades in over `frames`. The hook ends on a 4-frame white flash at frame 130.

### 2.4 Light and look (`lights.ts`, `shade.ts`, `cardshade.ts`)

A light preset has **29 fields**, not a colour:

```
az, el, lit[3], shade[3], lift[3], lambert, sideK, term,
charTint[3], charShade, charGrad, bodyGrad, sideTint[3],
blob[3], actorShadow,
top, hor, skyCurve[3], fog, fogNear, fogFar, sunDisc,
sunCol, sunI, sky, ground, hemiI, bias, normalBias
```

Day: `az 75, el 48`, `lit [1.58,1.5,1.33]`, `shade [.30,.29,.36]`, `lift [.05,.06,.11]`, `lambert
.35`, `sideK .84`, `term .2`, `charTint [1,.94,.92]`, `charShade .86`, `charGrad .07`, `bodyGrad .2`,
`sideTint [.92,.90,.96]`, `blob [.62,.58,.58]`, `top #3e7fd2`, `hor #b8d0ec`, `fog #b8d0ec 25→300`,
`sunI 2.8`, `hemiI .55`. Golden: `az 6, el 7`, `lit [1.5,.68,.24]`, `shade [.15,.15,.3]`, `top
#6a4f8c`, `hor #ffd08a`, `fog #efb489 50→380`, `sunCol #ffab5e`, `sunI 5.5`.

`LOOK` (`lights.ts:38-63`) adds 5 sky stops by elevation (`["#b8d0ec","#9cbfea","#6a9fe0","#4f8cdb",
"#3373cc"]` at `[0,3,8,16,40]°`), 6 water colours plus a shade vector, a bounce vector, a world
saturation (1.08/1.1), and a 3-colour cloud palette.

**Two-tone world shading** (`shade.ts:27-43`): `albedo × mix(shadeCol, litCol·mix(1,NdL,lambert),
sunTerm)` where `sunTerm = shadowMap × smoothstep(0, term, NdL)`, plus `skyK`, a bounce term on
shaded faces turned to the lens, and a lift. `untone()` (`shade.ts:63-77`) inverts the Neutral tone
map for self-lit colours that are *measured targets* (sky, fog, river) — an unusually rigorous idea:
if you measured the on-screen colour, write the linear value that lands on it.

**Character cards** (`cardshade.ts`): tint at `TINT_K 0.55`, shadow floor `0.86`, head gradient
`charGrad × 5.5` capped at 0.4, body gradient `bodyGrad × 1.6`, side tint on the far edge, a warm
**inner** rim on the sun side only (never an offset copy), overall gain `1.03`, rim width in output
pixels (`uPx = height/1920`). Cards receive shadows but cast them only in golden light.

### 2.5 Ink, lens, grade

**Ink** (`ink.ts`): world only, on layer `NOINK = 3` for cards/sky/clouds/smoke. A dedicated
normal+depth re-render feeds a full-res edge mask:

- width **5.1 px at 6 m → 3.3 px at 90 m** (1080×1920), crease width ×0.8;
- depth jump from **1%** (full at 3%); crease angle **35–50°**; concave gain 0.7;
- colour `#030303`, far opacity 0.95, fade 150→450 m;
- 3×3 tent anti-aliasing; own pass before DOF so lines blur with their surface.

**Lens** (`lensblur.ts`): thin lens, `CoC = cInf·|1 − focus/depth|` × `nearScale 1.2` in front,
clamped to `maxCoC 24 px` at 1080. 16-tap pre-gather (0.29×CoC) + 64-tap Vogel main (0.96×CoC) +
32-tap near field; occlusion rules so sharp subjects keep clean silhouettes. `cInf` per shot:
15–16 hook/CU, 12–14 close, 10–12 medium, 7 park, 5 golden sway, 0 wide/aerial. "Focus on the eyes
of the front row."

**Grade** (`grade.ts`): 7-knot monotone cubic tone curve at `x = 0,.1,.25,.5,.75,.9,1`; per-zone
saturation (shadows/mids/highlights); 3-way tint as zero-luma Cb/Cr offsets; elliptical vignette.
Fitted presets `GRADE_DAY` / `GRADE_GOLDEN`, then gentler round-2 presets
`day ky [0,.1,.28,.6,.835,.945,1]`, `sat [1,1.05,1]`, `vig [.12,.45]`;
`golden ky [0,.09,.245,.54,.8,.93,1]`, `sat [1,1.12,1.15]`, `vig [.2,.4]`. The grade comes after tone
mapping and works on display-referred values, so it is blended per shot/crossfade.

**Bloom** (`Bridge.tsx:32-38`): emissive only, threshold 1.0, intensity 0.5, 6 mip levels, radius 0.6,
ADD blend; the mip chain is pinned to 1920 tall so the glow is scale-invariant.

### 2.6 Cast (`toon.ts`, `cast.ts`)

Design space **600×1000**, soles at `y=975`, `SU = 0.00216 m/unit` (1000 units = 2.16 m). Building
blocks: `BUILD = {adult:{a118,torso1.1,legs1.4,tw0.8}, stout:{1.15,1.32,0.92}, kid:{a112,0.85,1.0,
0.72}}` (`toon.ts:429-433`).

Head (`headBlob`, `toon.ts:216-222`): `H/W 0.94 ± 0.04`, crown exponent `1.75 ± 0.15`, jaw `2.3 ±
0.15`, egg/chin taper `−0.12 ± 0.03`, side bulge `6–10%` toward the facing side, rotation `±4°`,
noise `0.008`. Outline is a thick-thin ring: `w(θ) = w0(1 + 0.45·cos(θ − thickAngle))`,
`w0 = 5u`, thickest **away from the light and pulled 0.8 toward the ground** (`thickAngle`,
`toon.ts:225`).

Face (`faceFront`, `toon.ts:306-324`): `u = W/100`; eyes **26u apart**, brows 20u up, mouth 20u
down, all shifted 7–8u toward facing; 14 expressions (`neutral, stern, grin, laugh, whistle, nervous,
shock, relief, relief_open, dazed, pained, smile, smile_closed, lick`), 10 eye kinds, 12 mouth kinds.
No blush, no catchlights. `FACE` is the whole expression system: two eye kinds, two brow offsets,
one mouth kind (`toon.ts:234-249`).

Life (`cast.ts:168-185`): `LEAD = 2/FPS` — expression/action change lands **2 frames before** the
word onset; `LID = [0.5,1,1,0.5]` — a 4-frame blink; the next blink is `15 + 54·hash` frames later,
i.e. **0.5–2.3 s**; a blink is forced across every expression swap so the shut frames hide the
change. `SWAPS` is a per-shot list of swap times.

Crowd (`cast.ts:242-284`): 74 men, 4 files, 1.3 m rows, 7 head seeds × 4 outfits so shared canvases
still differ; 2 steps/s at 0.8 m; bob 5% of height, lean 1–7°; contact blob day `[.2,.21,.33]` with
a sun-tail `min(2.4, max(.5, 1.6/tan(el)))`, golden `[.24,.2,.33]`.

Drawing resolution by distance (`cast.ts:130-131`): `<3.2 m → 1800×3000 (×3.0)`, `<6.5 m →
1080×1800 (×1.8)`, `<16 m → 480×800 (×0.8)`, else `240×400 (×0.4)`. It is a mip-like LOD for
vector art, keyed by distance.

### 2.7 Sound (`templates/audio/`)

`timeline.py` mirrors the picture read-only: shots, `tau`, march phase, amp/stomp, snap/drop, swing
pushes, hammer hits, tourist phases, camera-to-column distance. `dist_fx(d)` (`timeline.py:102-108`):

```
gain = −14 · log10(d/3.5) dB
lpf  = clip(17000 · (3.5/d)^0.55, 1800, 17000) Hz
send = 0.06 + 0.45 · clip(log(d/3.5)/log(25), 0, 1)
```

`sfx.py`: `Cue(t, name, desc, generator, naive, kind="event"|"bed", pan, extra, lpf, send, group,
cut)`. Every **event** is placed `SFX_DB = −6.0` under its "naive" level, measured as the event's
max momentary loudness **relative to the voice stem**; **beds** are not reduced. Footfalls are
generated from the march phase, one cue per footfall while the column is on screen.

`mix.py`: music targets per section `−9.5 … −12 LU under the voice`; duck `−3 dB`, `pre 80 ms`,
`post 120 ms`, `attack 70 ms`, `release 450 ms`, keyed from `words.json` not from the audio; master
`−15 LUFS`, ceiling `−1.2 dBTP` with a 4× oversampled look-ahead limiter. `cues.md` reports per
section loudness, the music map, rides, and stems.

Kit A's equivalent is simpler: a numpy music bed at 104 BPM with a 50 ms envelope-follower duck
(`1 − 0.45·clip(ve/(ve.max()·0.25),0,1)`), `mix = voice + music·duck·1.4 + sfx·0.5`, `tanh`, then
`loudnorm −14/−1.5`. Both kits converge on "duck by measurement, not by a fixed fader".

### 2.8 QA (`scripts/short_qa.py`)

Every frame at 180×320: luma mean/std/p2/p98, saturation, frame diff. Thresholds:

- black `mean < 0.04`; white `mean > 0.93`; **frozen** `diff < 0.02` for **≥12 frames** (0.4 s);
- **pop** `diff > 3× local median + 1.0`;
- planned flashes, crossfades and cut frames are excluded;
- loudness `ebur128`, silence `−45 dB / 0.3 s`, per-shot colour medians, 2 s contact sheets.

`finish.sh` (Kit A) uses the same idea with ffmpeg: `freezedetect=n=0.0005:d=0.4`,
`blackdetect=d=0.05`, `ebur128`, a 2 fps sheet.

### 2.9 Fixed vs left to the film

**Fixed by the kit** (invariant identity): light presets and `LOOK`, ink widths/colour/creases,
lens model and `cInf` bands, grade curve and presets, bloom, character construction (head ratios,
eye spacing, limb widths, outline taper, 14 expressions), card shading, contact shadows, the camera
grammar (glide length vs distance, kick shape, creep), QA thresholds.

**Left to the film** (variables): topic, facts, script, voice, `words.json`, shot list (`id, a, b,
light, crowd, tau, towns`), camera keys, kick times/amplitudes, DOF table and focus points,
foreground props, crowd staging, cue table, music sections.

That split — **look values fixed, story values per film** — is the same split Paper K-pop's
`tokens.json` vs `score.json` makes. Kit B is the better model because the fixed half is a *value
set*, not a class hierarchy.

---

## 3. Merged taxonomy

Legend for **transferable?**: `yes` = port the parameter; `retune` = port the mechanism, change the
number for 2D paper at 88 BPM; `partial` = only the rule survives, not the value; `no` = belongs to
the 3D stack; `review` = conflicts with a studio decision, needs an explicit call.

| parameter | kit | encoding | type/unit | example | transferable? |
|---|---|---|---|---|---|
| `format` | A+B | constants | fps × px | 30 fps, 1080×1920; B final 1440×2560 | yes |
| `duration` | A+B | derived from last shot | frames | A 592 (19.73 s); B 2025 (67.5 s) | yes |
| `shot.span` | A `{a,b}` inclusive; B `{a,b}` half-open | frame range | frames | A `0–87`; B `0–130` | yes (use half-open) |
| `shot.light` | A+B | preset name | enum | `day`, `golden` | yes |
| `shot.staging` | B | enum | `march/fall/water/bank/tourists/none` | `crowd:"water"` | yes |
| `shot.tau` | B | fn screen→story | s | `t => t − 31` | yes as `storyOffset` |
| `shot.count / median` | A 8 / 2.57 s; B 15 / 4.33 s | derived | s | pack: 10 / 3.0 s | yes as a band |
| `camera.model` | A+B | 3D `pos/look/fov/roll` | m, deg | `[-19.35,7.42,1.55]`, fov 34 | **no** |
| `camera.keys` | A `{f,pos,look,fov,roll,ease?}`; B `{f,dur,cut,s(f)}` | array | frame | 23 keys A, 36 keys B | yes as 2D keys |
| `camera.glide` | A+B | smootherstep | function | `t³(t(6t−15)+10)` | yes |
| `camera.hold.creep` | A 0.018 %/f; B 0.15–0.35 %/f | multiplier | %/frame | B `0.002` | retune (0.02–0.07) |
| `camera.punch` | B | word burst | %/f × frames | 0.6 %/f for 35 f | retune |
| `camera.kick` | A deg; B px | 7 f sign flip | deg / px | A `{f:121,a:0.05}`; B 3 px @640 | yes (px) |
| `camera.roll` | A −4.5…+3°; B 4–8° / ≥18 f | degrees over frames | deg | A `−4.5`, B `roll:-0.04 rad` | yes |
| `camera.path` | A Catmull-Rom; B quadratic Bézier | control points | m | B `[[0,18,-16],[17,15,-44],[0,7,2]]` | yes as 2D Bézier |
| `transition.cut` | A+B | boundary | — | 7 cuts A; 8 B | yes |
| `transition.xfade` | B | centred on the cut | frames | 6–8 f (0.2–0.27 s) | yes |
| `transition.flash` | A 6 f / 3 f; B 4 f | alpha ramp | frames | `[1,.75,.45,.2]` | yes |
| `lens.dof` | A `cinf 4–14`; B `cInf 0–16 px` | per shot | px | B 0 wide / 15 CU | **no** (paper) |
| `light.preset` | A 18–21 fields; B 29 fields | object | mixed | B day `az 75 el 48 lit [1.58,1.5,1.33]` | partial |
| `light.sun` | A world az/el; B camera-relative, frozen per shot | azimuth/elevation | deg | B shot 12 `az −30 el 18` | **no** |
| `palette` | A 28 named materials; B 8 house + 8 albedo families | colour table | hex / hsl | A `roof #7b2e1c`; pack roles | yes as roles |
| `sky / fog` | A 2 stops + fog 70→900; B 5 stops + fog = horizon 25→300 | colour stops + fog range | hex / deg / m | B `e[0,3,8,16,40]` | **no** (keep 2-stop 2D gradient) |
| `outline.width` | A 2.5 px; B 5.1→3.3 px at 6→90 m | px at distance | px | A 2.5; B 5.1 near / 3.3 far | partial (cut edge) |
| `outline.rule` | A `cardNd`; B `NOINK` layer | layer flag | — | cards never receive the world line | yes |
| `shade.world` | A 2-step toon ramp; B two-tone | two-tone multiplier | multiplier | B `shade [.3,.29,.36]` | **no** (paper is flat) |
| `shade.character` | B tint `.55`, shade `.86`, grad `.07/.2`, gain `1.03` | tint + gradient + rim | multiplier | A painted crescent only | partial |
| `shadow.contact` | A blob `.95×.6`; B `.52×.4` + `1.6/tan(el)` tail | blob + directional tail | m | A `0.95s × 0.6s`; B `0.52s × 0.4s` | yes |
| `cast.build` | A torso `1.08` / legs `1.38`; B `1.1/1.4`, kid `.85/1.0` | head-height ratios | HH | A 3.46 HH total | partial |
| `cast.head` | A+B | superellipse parameters | ratio | `H/W .94`, crown `1.75`, jaw `2.3`, chin `−.12` | yes as recipe |
| `cast.face` | A `FACE` + 3; B 14 expr / 10 eyes / 12 mouths | expression table | enum | eyes `.26 W` | yes |
| `cast.pose` | A 14 arm poses; B 6 body modes + props | pose enum | enum | `shield`, `temple`, `push` | yes |
| `cast.blink` | A period `38+(seed·17)%31` f; B `15–69` f, `LID [.5,1,1,.5]` | frame schedule | frames | 4 f shut, 0.5–2.3 s apart | yes |
| `cast.idle` | A bob `.6 %`, tilt `1.2°`, head `1.5°` | sine offsets | % / deg | `bob 0.006`, `tilt 1.2` | yes |
| `cast.walk` | A `1.1 m/s`, `.8 m` stride; B `2 steps/s`, `.8 m` | speed + stride | m, Hz | A `stride 0.8`, B `0.8 m / 2 Hz` | yes |
| `cast.reaction` | B `LEAD 2 f` **before** the word; studio `0–3 f` **after** | lead / lag | frames | `LEAD = 2/FPS` | **review** |
| `text.captions` | A+B none | rule | — | none | yes |
| `text.diegetic` | A banner 66 px, carving 104–150 px; B sign | prop text | px | `66px DejaVu Serif` | yes |
| `music` | A 104 BPM Am–F–G–E; B 120 BPM Bb + section LU | tempo + section levels | BPM / LU | A 104; B −9.5…−12 LU under voice | yes as section map |
| `sfx` | A frame→generator; B `Cue(naive LU, kind, pan, send)` | cue list | event | B −6 dB under voice | yes |
| `sfx.distance` | B | gain / lpf / send | dB / Hz | `−14·log10(d/3.5)` | yes |
| `duck` | A follower `.45`; B `−3 dB`, 80/120/70/450 ms | sidechain | dB / ms | `depthDb:-4` | yes |
| `master` | A `−14 / −1.5`; B `−15 / −1.2` | loudness target | LUFS / dBTP | `−14 LUFS, −1.5 dBTP` | yes |
| `determinism` | A LCG; B `sin(seed·127.1+k·311.7)` hash | seeded function | function | `1664525/1013904223` | yes |
| `qa.freeze` | A `d=0.4 s`; B `12 f`; pack `0.4 s` | frame-diff rule | s / frames | 0.4 s | yes |

---

## 4. Paper K-pop: what transfers

### 4.1 Fits without change

1. **Shot span as frames, half-open, with `duration` derived.** Both kits agree; the pack's
   `duration: 2.6` in seconds is the same field with a unit. Keep seconds in the score and derive
   frames, but store `startFrame/endFrame` at build time so the painter and the audio share one grid.
2. **A closed camera vocabulary with per-shot from/to.** The pack already has
   `moves: static/push_in/pull_back/pan/orbit` and `from/to`; both kits show that `from/to` must be
   **the same unit** (scale multiplier), and that a move is *one* interpolation, not a function.
3. **Hold creep.** Paper's `requireMove: true` already forbids a still shot; the kits explain why:
   a flat hold reads as a freeze in QA at 12 frames. A creep of **0.02–0.07 %/frame** (0.6–2.1 %/s)
   is enough to clear the freeze test without visible drift on a 2.5 s shot.
4. **Impact kicks as data.** A 7-frame sign-flipping offset, amplitude in **pixels**, decay
   `(1−n/7)^1.5`, plus a tiny roll. This is exactly the kind of thing a paper style can use on a
   sticker slam or a tear; it belongs in `camera.kicks` as `{at, px, rollDeg, frames: 7}`.
5. **Blink and idle as frame functions.** 4-frame blink, 0.5–2.3 s apart, forced across an
   expression swap; idle bob 0.6% of height, tilt 1.2°, head 1.5°. Deterministic, cheap, and it
   removes "dead puppet" from every shot.
6. **Cue model.** `kind: event|bed`, an event level measured against the voice and placed −6 dB
   under it, a bed that is not reduced, distance gain/low-pass/send, duck keyed from `words.json`.
   Our SFX kit already has `CUE_LOUD`; the missing piece is the **event vs bed** distinction and the
   distance triplet.
7. **`tau` (story time vs screen time).** A shot can replay a moment: `storyOffset: -31` for a
   flashback. This is one number and it removes a whole class of duplicated state.
8. **Freeze budget 0.4 s.** All three sources (Kit A `freezedetect d=0.4`, Kit B 12 f, our rough)
   independently land on 0.4 s. Treat it as a style invariant, not a tool default.

### 4.2 Transferable but must be retuned (with the arithmetic)

| Parameter | Kit value | Why it does not fit as-is | Paper value |
|---|---|---|---|
| hold creep | B 0.15–0.35 %/f | a 2.5 s shot would grow 11–26%; the pack's own moves are 5–9% per shot | **0.02 %/f** for a hold, **0.06 %/f** for a deliberate push (=0.6%/s and 1.8%/s) |
| punch | B 0.6 %/f × 35 f | 21% in one second; too much for a 2D card | **0.15 %/f × 12 f** (≈1.8%) on a stressed word |
| glide length | B 18–40 f | sized for 4.3 s shots | **12–24 f** (0.4–0.8 s) for a 2.6–3.0 s shot |
| shot median | B 4.33 s | 44% longer than the pack's 3.0 s | keep **2.5–3.0 s** (Kit A's 2.57 s is the closest) |
| crossfade | B 6–8 f | the pack's vocabulary has no `crossfade` | either add `crossfade` or map to `hold`/`match_cut`; duration 6 f (0.2 s) |
| kick amplitude | B 3 px @640 | output is 1080 wide and paper cuts are harder | **6–10 px at 1080**, 7 f |
| cast build | B 3.5 HH | Paper K-pop's cast is a paper puppet, not a bean human | use only as a **sanity band**, never as a constraint |
| contact shadow | B `.52×.4` + tail | paper's shadow token is `opacity .2`, `softness .5`, offset down-right | keep the pack's token, use the kit's **shape rule** (tight pool + directional tail) |

The creep arithmetic is worth writing down because it is the easiest number to get wrong:
`scale after n frames = (1 + creep)^n`. At 0.002/frame over 78 frames that is **+16.9%**; at
0.0002/frame it is **+1.6%**. The pack's current `push_in` 1.0→1.05 over 2.6 s is 1.9%/s, i.e.
0.00064/frame — between Kit A and Kit B, and already correct for the pack.

### 4.3 Does not transfer

- **Perspective camera in metres.** Paper is a 2D stage. `pos/look/fov` must be projected to
  `{scale, x, y, rot}` about a focus point. Conversion if a kit value must be reused:
  `scale = tan(fov0/2) / tan(fov1/2)`; `x,y` = the look point in normalised frame coordinates;
  `rot` = roll. A dolly and a zoom collapse into the same 2D scale.
- **Physical sun, shadow maps, two-tone Lambert, sky gradient by elevation, fog.**
  Paper has one light token (direction, softness, opacity). Depth is carried by overlap, scale,
  torn edge, shadow offset and halftone density — not by a lens.
- **Normal/depth ink pass.** Paper's line is a **cut edge**, already in the drawing. The transferable
  rule is negative: *the world's line never outlines a character card*; each layer carries its own
  edge weight.
- **Thin-lens DOF, HDR bloom, tone-map inversion.** No lens in a collage. `dof` should not appear in
  the paper schema; if focus is needed, use contrast/sharpness of the foreground layer, not blur.
- **Per-film code.** `story.js`/`story.ts` are programs. A film that can compute anything cannot be
  validated. Our `score.json` is the right shape; the kits are a warning, not a model.
- **Human proportions.** 3.46 HH is a Kit A/B house style. The pack's cast is defined by anchors,
  8 poses, 14 expressions, not by head counts.
- **System fonts** (`DejaVu Serif`, `Arial Black`). Licensing and identity drift; the pack has
  Anton / Archivo Black / DM Mono / Permanent Marker with licences.

### 4.4 Convergences worth treating as invariants

Two independent kits, built by different authors, agree on:

| Invariant | Kit A | Kit B | Paper K-pop |
|---|---|---|---|
| no hold beyond 0.4 s | `freezedetect d=0.4` | `diff<0.02` for 12 f | `no hold over 0.4 s` |
| blink | 4 frames, 1.27–2.3 s | 4 frames, 0.5–2.3 s | (cast token) |
| ink depth threshold | 0.6–2% relative | 1–3% | cut edge, not ink |
| ink crease angle | 28–44° | 35–50° | — |
| ink fade | 140–520 m | 150–450 m | — |
| no captions | yes | yes (user rule) | HUD only, no captions |
| text is diegetic | banner, carving | sign, banner | type is a layer, but not a caption |
| master loudness | −14 LUFS / −1.5 dBTP | −15 LUFS / −1.2 dBTP | format-owned |
| duck by measurement | envelope follower | −3 dB keyed from words | mix token |

The pattern: **the numbers that survive are the ones tied to a perceptual threshold** (0.4 s, 4
frames, 1% depth, 30–45°, −14 LUFS). The numbers that do not survive are tied to a camera or a
renderer. That is the test to apply to any new parameter.

---

## 5. Proposed minimal JSON schema

### 5.1 Shape

Three layers, matching what both kits actually do but making the boundary explicit:

| Layer | File | Holds | Who owns it |
|---|---|---|---|
| Invariant identity | `styles/paper-kpop/tokens.json` | palette roles, type, camera vocabulary, easings, transitions, physics constants, bands, cast minimums | creative + technical |
| Per-film data | `films/<id>/score.json` | shots, camera choice, lens, transitions, text, motion events, sound cues, cast staging | creative |
| Cast | `library/characters/<id>.json` | poses, expressions, anchors, rig, licence, hash | shared |

Rules the schema enforces:

1. Every number has a **unit** in its key or its type (`frames`, `px`, `lu`, `db`, `deg`, `pct`).
2. Every choice is an **enum** from `tokens.json` or a **reference** to a brief/scene/line id.
3. **No functions.** A move is `{move, from, to, ease}`; a key list is only allowed when a shot
   genuinely needs two moves, and then `camera:check` still enforces vocabulary and `maxRun`.
4. Time is **frames at 30 fps**, and every second value is derived, never authored twice.

### 5.2 The schema

One shot is shown; the `shots` array must tile the whole film (`0 … duration·fps`).

```json
{
  "kit": "paper-kpop/identity@1",
  "film": {
    "id": "uber-model",
    "fps": 30,
    "aspect": "9:16",
    "duration": 30,
    "seed": "uber-model-01",
    "style": "paper-kpop",
    "styleVersion": "0.2.0"
  },

  "palette": {
    "name": "day-stage",
    "roles": {
      "paper": "#F2E8D5",
      "ink": "#171310",
      "red": "#E8452A",
      "blue": "#203FD8",
      "acid": "#D9F24B",
      "accent": "#F5B93F"
    },
    "maxColours": 4
  },

  "light": {
    "preset": "day",
    "direction": [-0.6, -0.8],
    "shadow": { "offset": [0.035, 0.035], "alpha": 0.26, "hard": true }
  },

  "camera": {
    "model": "2d-keys",
    "unit": "frame",
    "vocabulary": ["static", "push_in", "pull_back", "pan", "orbit"],
    "default": "push_in",
    "limits": { "requireMove": true, "minDistinct": 3, "maxRun": 2, "minShot": 1.2 },
    "hold": { "creepPctPerFrame": 0.02 },
    "kicks": [
      { "at": 44, "px": 8, "rollDeg": 0.3, "frames": 7 }
    ]
  },

  "shots": [
    {
      "id": "s01",
      "scene": "sc01",
      "beat": "b01",
      "line": "v01",
      "start": 0,
      "end": 78,
      "storyOffset": 0,
      "recipe": "network_web",

      "camera": {
        "move": "orbit",
        "from": 1.0,
        "to": 1.05,
        "ease": "easeInOut",
        "focus": [0.5, 0.46],
        "keys": null
      },

      "lens": { "dof": 0, "focus": [0.5, 0.46] },

      "transitionOut": {
        "kind": "wipe",
        "frames": 6,
        "direction": "left",
        "centred": true
      },

      "text": {
        "display": {
          "role": "display",
          "text": "THE NETWORK",
          "anchor": "title",
          "maxWords": 4
        },
        "caption": null
      },

      "cast": [
        {
          "id": "kiran",
          "pose": "stand",
          "expression": "stern",
          "at": [0.5, 0.55],
          "scale": 1.0,
          "facing": "front",
          "layer": "character"
        }
      ],

      "motion": {
        "events": [
          {
            "at": 0.0,
            "kind": "enter",
            "target": "title",
            "ease": "backOut",
            "params": { "overshoot": 0.18 }
          },
          {
            "at": 1.2,
            "kind": "draw",
            "target": "route",
            "params": { "from": 0, "to": 1 }
          }
        ]
      },

      "sound": {
        "cues": [
          {
            "at": 0.0,
            "kind": "event",
            "name": "paper_slap",
            "levelLu": -18,
            "pan": 0.1
          },
          {
            "at": 0.4,
            "kind": "bed",
            "name": "room_tone",
            "levelLu": -30,
            "pan": 0.0
          }
        ]
      }
    }
  ],

  "sound": {
    "sampleRate": 48000,
    "channels": 2,
    "targetLufs": -14,
    "ceilingDbtp": -1.5,
    "duck": {
      "depthDb": -4,
      "preMs": 80,
      "postMs": 120,
      "attackMs": 70,
      "releaseMs": 450
    },
    "cueRule": {
      "eventUnderVoiceDb": -6,
      "bedUnreduced": true,
      "distance": {
        "refM": 3.5,
        "gainDbPerDecade": -14,
        "lpfRefHz": 17000,
        "sendMax": 0.51
      }
    }
  },

  "cast": {
    "max": 2,
    "characters": [
      {
        "id": "kiran",
        "library": "library/characters/kiran.json",
        "anchors": ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"],
        "posesMin": 8,
        "expressionsMin": 14,
        "proportions": {
          "note": "optional sanity band from the kits; the library's own values win",
          "headRatio": 0.94,
          "eyeSpacing": 0.26,
          "limbWidth": 0.055,
          "inkWidth": 0.05
        },
        "blink": { "frames": 4, "minS": 0.5, "maxS": 2.3, "hideSwap": true },
        "idle": { "bobPct": 0.6, "tiltDeg": 1.2, "headTiltDeg": 1.5 }
      }
    ]
  },

  "determinism": {
    "time": "frame-index-only",
    "rng": "seeded-hash",
    "seeded": ["fibre", "tear", "halftone", "stickerRot", "grain", "typeJitter", "cameraPhase"],
    "fixed": ["palette", "type", "recipeOrder", "cameraDirection"],
    "jitterHz": 12,
    "freezeBudgetFrames": 12
  }
}
```

### 5.3 Field status against today's `score.json`

| Proposed field | Status | Note |
|---|---|---|
| `film.fps/aspect/duration/seed/style/styleVersion` | exists | same names |
| `palette`, `light` | new at film level | today they live in `tokens.json`; the film may pin a palette name |
| `camera.vocabulary/limits` | exists in `tokens.json` | move into the identity kit; `score.json` reads it |
| `camera.hold.creepPctPerFrame` | new | replaces "every hold creeps" as a hope with a number |
| `camera.kicks` | new | 7-frame, px-based, per film |
| `camera.keys` | new, optional | only for a two-move shot; `null` otherwise |
| `shots[].start/end/storyOffset` | new | today `duration` only; `start` derived by accumulation |
| `shots[].lens` | new | omit for paper unless a focus effect is declared |
| `transitionOut` | **change** | today a string; propose `{kind, frames, direction, centred}` with a string shorthand in the parser |
| `text` | new | today `slots` are free key/value; this makes role/anchor/maxWords explicit |
| `motion.events` | exists as `direction.events` | keep `direction` for prose; events gain `ease`/`params` |
| `sound.cues` | new | today `audio` holds the master; cues are generated per film |
| `cast.characters[].blink/idle` | new | library-level behaviour, referenced per film |
| `determinism` | new | pulls the `seed` block's spirit into the score |

### 5.4 Validation rules the schema makes possible

- `start/end` must tile `[0, duration·fps)` with no gap or overlap (half-open).
- `duration = (end − start)/fps` must be within `pace.medianShot` of the current film.
- `camera.move` ∈ vocabulary; `from/to` in `[0.9, 1.2]`; no four-shot run; `maxRun` respected.
- `hold.creepPctPerFrame × duration_frames ≤ 3%` (a creep, not a move).
- `kicks[].frames == 7` and `px ≤ 12`; a kick must sit on an event, not on the first frame.
- `transition.frames ≤ 8`; `kind` ∈ the pack's transition list.
- `text.display.maxWords ≤ 8`; `caption` must be `null` unless the format declares captions.
- every `line`/`scene`/`beat` id must exist in `story.json`/`scenes.json`/`beats.json`.
- every `sound.cues[].name` must exist in the asset catalogue; every event has a level **relative
  to the voice**, never an absolute peak.
- `freezeBudgetFrames == 12`; `jitterHz == 12`.

---

## 6. Forbidden / non-transferable techniques

| Technique | Where | Why not |
|---|---|---|
| three.js / WebGL renderer / headless Chromium (A) | `main.js`, `render.mjs` | our render path is code-drawn canvas; a second renderer doubles the determinism surface |
| Remotion + `@remotion/three` + `EffectComposer`/`postprocessing` (B) | `Bridge.tsx` | framework dependency; the composer owns the look, not our painter |
| Perspective camera `pos/look/fov` in metres | both | 2D stage; project to `scale/x/y/rot` |
| Physical sun `az/el`, shadow maps, `PCFSoftShadowMap`, 2048/4096 maps | both | paper has one light token; a shadow map is not a cut-paper shadow |
| Normal+depth ink pass (`ndMat`, `swapForNd`, `NOINK` layer) | A `main.js:39-55,387-399`; B `ink.ts` | the line is a cut edge in the drawing |
| Two-tone Lambert / `ShaderChunk.lights_fragment_begin` patching | B `shade.ts` | paper is flat; two-tone re-introduces a 3D light model |
| Thin-lens DOF (`cInf`, CoC, 64-tap Vogel) | A `main.js:304-316`; B `lensblur.ts` | no lens; focus must be compositional, not optical |
| HDR bloom + Neutral tone mapping + tone-map inversion (`untone`) | B `Bridge.tsx`, `shade.ts` | HDR pipeline; the pack grades in display space |
| Kenney CC0 GLB props, `GLTFLoader`, `loadKit()` | B `world.ts`, `build.ts` | third-party 3D assets; not code-drawn and not 2D |
| 3.5-head-height human proportions, bean torsos, stick limbs | A `roman.js`; B `toon.ts` | the pack's cast is a paper puppet with its own anchors, 8 poses, 14 expressions |
| Per-film JavaScript/TypeScript that computes camera/actors | A `story.js`; B `story.ts` | a film that can compute anything cannot be validated; data only |
| Reference frames/sheets from the private channel | B `references/frames`, `references/sheets` | study only, never shipped, never traced |
| System fonts `DejaVu Serif`, `Arial Black` | A `paint.js:118`, `roman.js:241` | licensing + identity drift; the pack has licensed fonts |
| `Math.random`, `Date.now`, `performance.now`, `requestAnimationFrame` in paint | — | both kits avoid them; keep it structural, not observed |
| A second audio stack (numpy/scipy synth) | A `audio.py`; B `templates/audio` | the studio already has a measured SFX/mix kit; do not import a second one |
| Absolute QA thresholds `mean<0.04` / `>0.93` copied verbatim | B `short_qa.py:48-49` | those are full-range RGB numbers; our frame audit reads limited-range YUV (legal black 16) — copying them would make the blank rule unable to fire |
| "Opus max verifier" as a look gate | B `SKILL.md:74` | an LLM may **review** frames; it may never **make** pixels or be the only proof |

**Generative vs code-drawn, explicitly:** no file in either kit calls an image or video model. Kit A
is Canvas2D + three.js; Kit B is Canvas2D + three.js + Remotion. The only binary inputs are fonts,
Kenney GLBs (B), a voice recording (A), and the private reference frames (B, study only). Both kits
are therefore *architecturally* compatible with a code-drawn path; what is not compatible is their
**3D renderer**, not their provenance.

---

## 7. What neither kit answers

1. **2D parallax.** Both get depth from a real 3D scene, so neither encodes layer parallax. Paper
   needs `{layer, z, parallax}` explicitly, or the camera move will slide the whole collage flat.
2. **Cut edges as a lighting surface.** Both treat the outline as ink over a fill. A torn paper edge
   catches light and casts a micro-shadow; that is a per-edge parameter neither kit has.
3. **Type as a layer.** Both put text in the world or omit it. The pack's display/body/caption/
   label/monogram system with jitter, hard shadow and 12 Hz boil is more developed than either kit.
4. **A caption policy.** Kit B's reference uses one-word captions; its user rule bans them. The pack
   bans them too. Neither kit has a *schema* for when a caption is allowed, only a rule.
5. **Per-shot audio stems.** B has a section-level music map and a cue sheet; A has one cue list.
   Neither ties a cue to a *shot id* (only to a time), so a re-cut silently moves the sound.
6. **A machine-checkable story.** Both scripts are prose plus `words.json`; neither validates that
   the voice says what the story wrote. Our `story ↔ score` text comparison is ahead of both.

---

## 8. Recommendation in one line

Take **Kit A's compactness and pacing** (8–10 shots, 2.5–3.0 s median, 23 camera keys) and **Kit B's
parameter depth** (light preset as 29 values, ink as px-at-distance, cue as level-relative-to-voice),
but express both as **data keys with closed enums and measured units** — never as a per-film
`story.js`. The four numbers to adopt first are the 0.4 s freeze budget, the 7-frame kick, the
4-frame blink (0.5–2.3 s), and the −6 dB event-under-voice rule.
