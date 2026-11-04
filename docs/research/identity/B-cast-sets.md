# B — Cast, sets, props and shot staging in the original Paper K-pop film

**Date:** 2026-11-04
**Source film:** `Y:\NewVideoTest` — 1920×1080, 30 fps, 156.62 s, delivered MP4.
**Files read in full:** `src/characters.js` (928), `src/props.js` (464), `src/scene_kit.js` (634),
`src/scenes/act1.js` (564), `act2.js` (1020), `act3.js` (1552), `act4.js` (1552), `act5.js` (439),
plus `core.js`, `type.js`, `lyrics.js`, `timeline.js`, `render.mjs`, `STORYBOARD.md`, and
`ref/PDoomVideo/{ANIMATION_GUIDE.md, STORYBOARD.md, src/cast.js, src/clawd.js}` for comparison.
**Purpose:** recover the construction and staging grammar as exact values, so a different story can be
built in the same identity. Not an implementation. No repository file was changed except this one.

Every value below is read from the code, not estimated. `[I]` = invariant (the identity breaks
without it), `[V]` = variable (a per-film choice the source made), `[F]` = accident of this film
(do not copy), `[D]` = defect found while reading.

---

## 0. The honest headline

**The cast is nine functions over nine shared construction parts; the sets are nine functions of
which three are never called; the staging is 51 hand-written scenes with no staging API at all.**

| Fact | Number | Consequence |
|---|---|---|
| Character functions that can stand in a shot | **9** (3 people: `idol`, `mira`, `gato`; 6 mascots) | the whole film's cast is code: 928 lines + ~400 shot-local variants |
| Shared construction primitives | **9** (`brad`, `limb`, `boot`, `pleatedSkirt`, `varsityTorso`, `flowerHead`, `face`, `hairBack`, `bangs`) | these are the actual style |
| Set functions | **9** in `props.js` + `scene_kit.js`; **3 dead** (`labSet`, `roadSet`, `spaceSet`) | the library and the film disagree |
| Scene objects | **51**, not the 54 storyboard cards | board is finer than the score |
| Scenes that set the camera | **27 / 51** | 24 shots inherit a global camera `[D]` |
| Pose keys the two leads share | **7 of 11** (idol reads 11, mira reads 7) | the "vocabulary" is not shared `[D]` |
| Hand-anchor API | **none** | hand props are placed by re-deriving arm trig in the scene `[D]` |
| Flat characters (`paper()` shapes) vs gradients | ~95% flat + **one** gradient per limb for form | this is why it reads as cut paper |

The transferable finding: **the identity lives in the joints, the brads, the tapered limbs, the
flower-halo head stack, the torn-paper floor and the palette-role system — not in the story, the
shot list, or the set names.** The numbers below are the contract; the 51 shots are one instance
of it.

---

## 1. How the code is built (read this before any table)

### 1.1 Coordinates, units, clock

| Element | Exact value | Code ref | I/V |
|---|---|---|---|
| Canvas | `W=1920, H=1080`, y down, origin top-left | `core.js:5` | `[I]` |
| Duration / fps | `DUR=156.62`, render `--fps=30` | `core.js:6`, `render.mjs:10` | `[V]` |
| Character unit | `s=1` means **706 units tall** for the idol (ground 0 → head centre −604, flower top ≈ −750); Mira ≈ 584 units | `characters.js:4,390,574` | `[I]` |
| Ground point | every cast function takes `(x, y, s)` where `y` is the **ground between the feet**, not the centre | `characters.js:3` | `[I]` |
| Beat grid | 88 BPM, `beat(t) = (t − 0.21) / (60/88)` = 0.6818 s; triplet grid at 132 BPM; `bpmPulse(t, decay)` = `exp(−frac(beat)·decay)` | `core.js:47-50` | `[I]` |
| Easing set | `ease, easeOut, easeIn, backOut(c=1.70158), elasticOut, expoOut, smooth, kf(keys, ease)` | `core.js:14-46` | `[I]` |
| Deterministic noise | `hash(n)`, `hash2(a,b)` — no `Math.random` in shot code (only in `grainCanvas`, a texture built once) | `core.js:21,120` | `[I]` |

### 1.2 The paper recipe (the single most important function)

`paper(ctx, pathFn, o)` draws **shadow → fill → edge → gloss** (`core.js:280-297`).

| Parameter | Default | What the cast uses |
|---|---|---|
| shadow offset | `sx=6, sy=10`, alpha `.22` | cast parts use `sx 2–9, sy 4–14`, alpha `.12–.4` |
| edge | none unless `o.edge` | `rgba(PAL.ink, .35–.8)`, width `1–4` (limbs 2.1, torsos 2.4–2.6, faces 2.0–2.1) |
| gloss | off | essentially never used on the cast |
| fill | `PAL.paper` | flat hex, always |

There is **no contact shadow and no per-foot shadow**: every part floats on an offset copy of itself.
That is the cut-paper tell, and it is uniform across cast, props and sets.

### 1.3 Structure: 54 board cards, 51 scenes

`STORYBOARD.md` numbers **00–53**. The score has **51** scene objects (act1 7, act2 17, act3 6,
act4 17, act5 4). Three board cards are absorbed into a neighbour and never exist as scenes:

| Board card | Absorbed into | Why |
|---|---|---|
| 03 "that's no surprise" (7.90–8.95) | `circuits` 5.90–8.95 | same set, one monitor shot; the card is a sub-beat |
| 08 "micro — iris" (22.50–22.72) | `chase` end + `chorus1` start | the iris is authored inside `chase` |
| 12 "bag of shrooms" (27.90–29.72) | `chinese` 26.18–29.72 | same room, melt is a sub-beat |

So: **a shot is a scene object; a board card is a beat.** A reimplementation that maps cards 1:1
will over-cut this film by 6%.

Scene shape: `scene({id, start, end, lyric, subX?, subY?, noDoom?, draw(t, lt, dur)})`; the draw
call is `s.draw(t, lt, dur)` with `t` song time, `lt = t − start` (`timeline.js:22`).
`beginShot()` clears the canvas and resets the 2-D state — **but not the camera**
(`timeline.js:12-20`).

### 1.4 What is drawn on top of every frame

`renderAt` order (`timeline.js:50-72`): shot → global transitions (empty) → subtitle (if
`lyric: 'sub'`) → DOOM ticker (unless `noDoom`) → print marks → paper texture (multiply, `.5`) →
grain (soft-light, `.45`) → vignette (`.34`).

| Furniture | Exact geometry | Ref | I/V |
|---|---|---|---|
| Subtitle band | torn card at `x=84, y=992`, height 62 (`948–1010`), max width 1300, ink `.92`, mono 31 px, active word acid + 3 px underline, progress hairline | `type.js:185-223` | `[I]` |
| DOOM ticker | torn card `(1634, 40, 246, 96)`, `P(DOOM)` 15 px, value 34 px, bar 70×6, 6 ticks, 6-petal flower mark | `timeline.js:74-92` | `[I]` |
| Print marks | corner rules at margin 26, length 16, alpha `.22`; colour bars 4×11 px at `(1820,1046)`; timecode `W−344, H−30`; `© 2026 PAPER SINGULARITY` | `timeline.js:94-107` | `[I]` |
| Text-safe band | bottom **948–1070** when a lyric shows; faces stay above ~700 in practice | inferred from 51 shots | `[I]` |

---

## 2. Cast archetypes

### 2.1 The cast list

| Function | Role | Height at `s=1` | Joint anchors (y from ground) | Ref | I/V |
|---|---|---|---|---|---|
| `idol` (**SOL**) | lead, sunflower head | ~750 (head centre −604) | HIP −300, waist/pivot −334, shoulder line −500 (declared) / **−516** (used), head pivot −530, head centre −604 | `characters.js:372-554` | `[I]` |
| `mira` | co-lead, researcher | ~584 (head centre −536) | HIP −270, shoulder −452 declared / **−448** used, head pivot −462, head centre −536 | `characters.js:567-735` | `[I]` |
| `gato` | cat idol | inherits idol | idol + ears at `(±34, −672)`, tail from `(26, −250)` | `characters.js:740-767` | `[V]` |
| `paperclip` | mascot / motif | ~64 | ground at y, body −30…+34 | `characters.js:772-793` | `[I]` motif |
| `shoggoth` | monster | ~300 | body centre −50, 9 tentacles radius 90–150 | `characters.js:795-825` | `[V]` |
| `basilisk` | monster | ~470 | 8 segments, −20 − i·52; head 52×40 | `characters.js:827-852` | `[V]` |
| `chinchilla` | mascot | ~200 | body centre −60, 26 fur petals r 60 | `characters.js:854-885` | `[V]` |
| `cloudGuard` | set-creature | ~180 | polygon −100…+102 x, −84…+22 y | `characters.js:887-903` | `[V]` |
| `doomMeter` | prop-character | 420 | body `roundRect(−44,−420,88,420,14)` | `characters.js:905-928` | `[I]` motif |
| `statue` | one-off (museum) | `.51 × idol` | idol + 26 aureole ticks r 168–192 at `y−348s` | `act3.js:469-492` | `[F]` |
| `miraBack` | one-off (seen from behind) | 396 | shoes ±26, coat −366…−142, head −396 | `act3.js:50-116` | `[F]` |

### 2.2 Shared parts — exact construction

| Part | Exact construction / value | Ref | I/V |
|---|---|---|---|
| `brad` | radial gradient `BRASS_L #FFE2A0 → BRASS #C68E2E → #7A4E12`, r default **4.2**, stroke `rgba(60,34,8,.55)` 0.9, highlight dot at `(−.30r, −.35r)` r `.24r`, cream `.8` | `characters.js:19-25` | `[I]` |
| `limb` | tapered quadratic capsule, `len`, `w1`, `w2`; **edge `rgba(ink,.78)` @ 2.1**; shadow `(+3,+5)` alpha `.14`; 1 px white `.35` highlight down the left; clipped lateral gradient white `.20 → 0 @ .4 → black .12` | `characters.js:28-51` | `[I]` |
| limb angle law | `angle 0 = straight down`; the tip lands at `(x − sin(a)·len, y + cos(a)·len)` → **+a swings the tip to screen −x (left), −a to screen +x** (the file comment says "+x" — it is wrong) `[D]` | `characters.js:27,50` | `[I]` |
| `boot` | ankle shaft `roundRect(−13,−16,26,38,7)`; foot `−16…+30 x`, 12…30 y; platform sole `roundRect(−20,28,52,13,4)` cream; gold bar `42×2.5 @ y33`; 3 laces; drawn **rotated at `0.55 × shin angle`**, at `ankle − 2` | `characters.js:54-67` | `[I]` |
| `pleatedSkirt` | 11 pleats, `wTop 32`, `wBot 76`, `len 148/152` (120 gym); alternates `main` / `shade(main,−16)`; hem wave `sin(u·8)·2`; cream under-layer 20 px below; waistband `70×16` + gold tab `7×13`; `sway` widened by `1+u·.18` | `characters.js:70-99` | `[I]` |
| `varsityTorso` | waist `0`, shoulder `−182`; outline `±47 @ −182 → ±58 @ −120 → ±40 @ −6 → ±30 @ +8`, top quad through `−200`; open front cream panel `±13`; 2 collar wings to `±44,−184`; 12 gold ribs in `68×18`; patch `28×20 @ (−27,−124)` | `characters.js:102-130` | `[I]` |
| `flowerHead` | petals default **22**; `r0 24`, `r1 146`; **pulse `1 + .045·bpmPulse(t,4)`**; petal width `19 ± 2.5`; length jitter `±4.5%`; alternating `petal/petal2`; tip band 26 px clipped; crease line; halo = gold r `r1+16` (3 px) + cream `.55` r `r1+23` (1 px) | `characters.js:133-170` | `[I]` |
| `face` plate | `blobPath(0,0,41,47,n=18,jitter .015,seed 7)`, skin `#F0C9A4`, edge `rgba(ink,.62)` 2.1; ears `±41,3` (5.5×9) | `characters.js:183-190` | `[I]` |
| face — eyes | centres `±17.5, −3`; almond 11.5 × 12.5; iris r 9 at `look·(3.6, 2.8)`; pupil 4.4; two glints 2.6 / 1.15; pink eyeshadow haze `.38`; lash 2.5, flick to `(16,−6.5)`, lower lash `.45` | `characters.js:202-261` | `[I]` |
| face — brows/nose/mouth | brows at `ey−16.5` from `±27` to `±8`, 2 px, `browL/browR` offsets; nose 1.1 px `(0.5,11)→(3,16)→(0.5,17)`; mouth at **y 32** | `characters.js:266-302` | `[I]` |
| face — blush | ellipse `±25,19` (10×4.6), alpha `blush·.55`, 3 hatch ticks each | `characters.js:192-201` | `[I]` |
| `hairBack` | bob silhouette `±46 @ −6`, crown `±34..38 @ −82`, `0 @ −94`, inner notch to `(±40,62)`; `len=118` passed by idol; two side strands `(±44,−60) → (±48,len)` with 6 px tail; lilac highlight `.22` | `characters.js:306-333` | `[I]` |
| `bangs` | crown `±53 @ −8` → `±20,−88` → `0,−95`; centre parting to `(±2,−12)`; side curtains `(±42,−56) → (±46,30)`; 2 shine strokes `#9D96C4 .55` | `characters.js:336-365` | `[I]` |
| `crown` | 6-point path `±34…±40, −34/−44`, gold, 3 red jewels r 3.2, scale `.8` on the idol (`.78` on the basilisk) | `characters.js:556-562` | `[I]` motif |

### 2.3 The idol — joint and part table

| Element | Exact value | Ref | I/V |
|---|---|---|---|
| Long hair | **4 strands**, `sx=(i−1.5)·17`, `len 155 + hash·40`, ±8/±7 px wide, sway `sin(t·1.8+i)·8`, `hairSwing` added to the tips | `characters.js:399-413` | `[I]` |
| Long-hair rotation | `headTilt·0.45 + headTurn·0.10` | `characters.js:400` | `[I]` |
| Legs | hip `±16, −300`; thigh `158 × 30→24`; shin `118 × 23→18`; ankle boot | `characters.js:424-431` | `[I]` |
| Leg brads | hip **4.4**, knee **3.6** | same | `[I]` |
| Arms | shoulder `±45, −516`; upper `104 × 23→19`; forearm `88 × 18→14`; sleeve stripe 6 px `y12→96`; shoulder cap blob `14×17 @ (0,6)` | `characters.js:512-543` | `[I]` |
| Arm brads | shoulder **4.2**, elbow **3.4**, wrist **3.0** | same | `[I]` |
| Cuff | ink `16×7` + gold `16×2` at the wrist, rotated to the forearm | `characters.js:530-534` | `[I]` |
| Hand | blob `9×13` centred `(0,11)` beyond the wrist; thumb ellipse `3.8×5.6 @ (side·8, 7)` rotated `side·.5` | `characters.js:536-540` | `[I]` |
| Torso stack | far arm → legs → skirt (`−334`, lean `.25×`) → torso group (`−334`, lean `1×`) → neck `−566…−512` → garment (authored from waist 0) → shoulder brads `±45,−516` **4.6** → collar arc r 17 @ `(0,−528)` + pendant r 3 @ `(0,−509)` | `characters.js:415-479` | `[I]` |
| Head stack | flower (back) → hairBack → face → bangs → earrings (`±43,16/23`) → crown / hood (arc r 88) / mask (blob 42×20) | `characters.js:482-507` | `[I]` |
| Head pivot | `translate(0,−530) rotate(headTilt + headTurn·0.16)` | `characters.js:483` | `[I]` |
| Near arm | drawn **after** the head, so it may overlap the face | `characters.js:510` | `[I]` |
| Ground shadow | ONE radial ellipse `46s × 10s`, alpha `.22`, at `(0,0)` before `scale(s)` | `characters.js:395` | `[I]` |
| Mirror | `ctx.scale(flip·s, s)` with `flip = −1` for a left-facing figure | `characters.js:388,396` | `[I]` |
| Mic | forearm-derived world point, pole 22 px, capsule `8×12` silver | `characters.js:545-551` | `[V]` |

### 2.4 The idol — costume variants

| `outfit` | Construction | Palette roles | Ref |
|---|---|---|---|
| `stage` (default) | `varsityTorso(jacket, sleeve, gold)` + chrome bib from `±15,−176` to `±18,−120` | jacket = flower-matched or `PAL.red`; sleeve cream; skirt blue; boot blue | `characters.js:466-468` |
| `gym` | mint tank `±42 @ −178 → ±34 @ +4`, cream 76×7 stripe, blue 76×3, `042` patch 44×38 | mint / cream / blue / red mono text | `characters.js:449-456` |
| `jazz`,`gown` | blueD / redD tunic, 7 gold pinstripes | dark tunic + gold | `characters.js:457-460` |
| `hazard` | gold varsity + ink chevron band `92×22` at `−118` | gold + ink | `characters.js:461-465` |
| else | plain varsity | jacket / sleeve / gold | `characters.js:469-471` |

### 2.5 The idol — face vocabulary (10 eyes × 7 mouths)

| `eyes` | Construction | Ref |
|---|---|---|
| `normal` (default) | almond, white `#FFF9EF`, iris gradient (`shade(iris,34) → iris → #120B08`), pupil, 2 glints | `characters.js:234-261` |
| `closed` | arc r 10.5, `.12π…​.88π`, 3 px | `:205-208` |
| `happy` | closed + second arc r 8.5, `1.15π…1.85π` | `:208` |
| `wink` | left closed arc, right filled ellipse 7.5×10.5 + white dot | `:209-214` |
| `heart` | `heartPath r=10.5`, `PAL.red`, ink 2 | `:215-216` |
| `star` | `starPath r=11.5, inner .45, 5`, ink + cream dot | `:217-219` |
| `swirl` | 26-segment spiral, `a=i·.5, r=i·.52`, 2.2 px | `:220-223` |
| `narrow` | filled ellipse 10.5×4.6 + 1.7 px glint | `:224-226` |
| `x` | two 13 px strokes, 2.8 px | `:227-228` |
| `spiral` | 34-segment red spiral, `a=i·.42, r=i·.36` | `:229-232` |

`blink > .5` closes any eye. `sing > .25` opens the mouth and interpolates the opening.

| `mouth` | Construction | Ref |
|---|---|---|
| `smile` (default) | `±7` quadratic smile, `#A62A36`, cream glint | `:298-301` |
| `sing` | ellipse 6.4 × `lerp(2, 8.5, sing)`, `#8E2430` + tongue + tooth glint + ink | `:278-283` |
| `grin` | half-disc r 8.4 + white 13×3.2 bar | `:284-287` |
| `o` | 4.2×5.2 ellipse | `:288-289` |
| `flat` | 11 px line, 2 px | `:290-291` |
| `pout` | 4.8×3.2 red ellipse + glint | `:292-294` |
| `wobble` | 2-quadrature squiggle, 1.9 px | `:295-297` |

### 2.6 Mira — the second rig (deliberately different numbers)

| Element | Exact value | Ref | I/V |
|---|---|---|---|
| Legs | hip `±14, −270`; thigh `140 × 25→20`; shin `104 × 20→16`; **trouser colour** (not skin) | `characters.js:594-598` | `[I]` |
| Foot | sneaker `−14…+24 x`, −8…+10 y, at `ankle + 4, −2`, rot `0.5 × shin`, red stripe 26×3 | `:600-603` | `[I]` |
| Arms | shoulder `±38, −448`; upper `92 × 20→16`; forearm `78 × 16→13`; hand blob `7×10` at `wrist + 9`; **no cuff, no thumb** | `:722-730` | `[I]` |
| Arm brads | shoulder **3.6**, elbow **2.8** (no wrist brad) | `:726` | `[I]` |
| Torso | ink tee `±35 @ −452 → ±30 @ −268`; cream collar; blue tie knot; red tie blade to `−340`; open lab coat two mirrored panels `10…54 x`, `−456…−182`; lapel, pocket `17×15`, belt `68×10` + gold buckle `12×14`, 2 pens, `MIRA` badge `30×20 @ (−30,−426)` | `:609-649` | `[I]` |
| Neck | `−500…−462` | `:652` | `[I]` |
| Face | plate `36×42` (smaller than the idol's 41×47); blush `±22,17` (8×3.6) alpha `.3`; eyes `±15, −4`; brows `±23…±7` at `ey−17`; nose 2 px; mouth at **y 27** | `:662-713` | `[I]` |
| Glasses | two r 12 lenses at `±16`, bridge, arms to `±38`, blue 3 px, tint `rgba(160,210,235,.18)`, white glints, `glassesTilt` | `:682-698` | `[I]` |
| Hair | back arc r 48 `0.95π…2.05π`, tail to `(46,44)`; bangs arc `±40,−30` → `0,−52`; **no long strands, no `hairSwing`** | `:660,715` | `[I]` |
| Ground shadow | `40s × 9s`, `.22` | `:582` | `[I]` |
| Head pivot | `translate(0,−462) rotate(headTilt)` — **no headTurn** | `:657` | `[I]` |

Expression sets differ on purpose: Mira has `dot` (default), `closed`, `star`, `swirl`, `wide`, `happy`
plus `glassesTilt`; mouths `smile, o, flat, wobble, grin`. She has **no** `sing` mouth, and her eyes
have **no** `heart`, `wink`, `narrow`, `x` or `spiral`. She has **no** petal/halo/crown accessories.
`[I]` — two people are two rigs, not one rig with two skins.

### 2.7 Comparison: the earlier PDoomVideo rig (do not copy, but learn from it)

| Property | PDoomVideo `clawd` / `researcher` | Paper K-pop `idol` / `mira` |
|---|---|---|
| Unit | body 10u × 6u, 8u with legs (`clawd`); researcher 13.2s | 706 / 584 units fixed |
| Pose | `dy, sq, rot, flip, spin, sx/sy, aL/aR, walk, run, sit, back` | `bounce, sway, lean, headTilt, headTurn, armL/R, legL/R, hairSwing, petalDrift` |
| Squash/stretch | **`sq` + `take` + `mood()` takes** | **none** — scenes fake it with `ctx.scale` (`act4.js:923`) |
| Walk/run | `walk(phase)` / `run(phase)` | none — scenes write `sin(beat·π)` legs by hand |
| Face change | `mood(t, [[t,'normal'],[t,'scared','sweat'],…])` with blink-squash-pop | hard switch per shot; no transition |
| Emote | `emote(kind, x, y, s, k)` (8 kinds) | none |
| Hand anchor | `armL/armR` hooks called at the arm tip; `handL/handR` for the researcher | **no hook, no return** `[D]` |
| Hats | 15 named hats | crown, hood, mask only |
| Ink weight | `sw = clamp(s/13, .45, 2.2)` (scales) | fixed 2.1 px limbs, 2.0–2.6 torsos (does not scale) |

The K-pop rig is **more specific and less controllable**: exact doll proportions, no squash, no
walk cycle, no mood blend, no emote, no hand hook. Those five are the first things a reproduction
must add without changing the look.

---

## 3. Movement vocabulary

### 3.1 Keys, units, and what actually reads them

| Key | Unit / effect | idol reads | mira reads | Range in the film | Exemplar |
|---|---|---|---|---|---|
| `bounce` | px added to `y` (negative = up), scaled by `s` | yes | yes | **−3 … −24** | `dance1` lead −24; `chase` −16 |
| `sway` | px, **skirt hem only** on the idol; ignored by Mira `[D]` | skirt | **no** | 2 … 10 | `chorus1` 7 |
| `lean` | radians at the waist pivot; also `.25×` on the skirt, `1×` on far arm | yes | yes | **±.02 … .30** | `vault` .26; `gato` fall .2 |
| `headTilt` | radians at `−530` (idol) / `−462` (Mira), plus `.45×` on long hair | yes | yes | **±.04 … .20** | `ilya` .2 |
| `headTurn` | radians ×.16 on the head, ×.10 on long hair | yes | **no** | **−.1 … .1** (rarely used) | `chase` head not turned |
| `hairSwing` | px added to the 4 long-strand tips | yes | **no** | **±5 … ±26** | `clips` 26; `gato` 24 |
| `petalDrift` | radians added to flower spin | yes | **no** | **±.03 … .05** | `chorus1` |
| `armL/R` | `[upper, fore]` absolute radians; `0` = down, `+` = tip to screen left | yes | yes | **−2.95 … +2.9** | `omega` ±2.55; `singularity` ±2.9 |
| `legL/R` | `[thigh, shin]`; shin relative to thigh | yes | yes | **−1.2 … +1.2** | `accel` −1.1/+.5; `gato` fall −.45 |
| `flip` | −1 mirrors the whole figure | yes | yes | −1 or 1 | `circuits` Mira −1; `loss` SOL −1 |

**Sign law (important):** limbs are not mirrored between sides. A symmetric "arms low and out" pose
is `armL +a, armR −a`; "hands overhead / clasped" is `armL −a, armR +a`. The default idle is
`armL [−.14,−.06], armR [.14,.06]` (both hanging, slightly inward).

### 3.2 Amplitude catalogue (what "on the beat" means here)

| Move | Formula | Amplitude used | Where |
|---|---|---|---|
| Idle bounce | `−abs(sin(beat·π))·A` | 3–9 | `sparks`, `museum`, `omega` |
| Chorus bounce | same | 16–24 | `chorus1` 18, `dance1` 24, `chorus2` 22 |
| Run bounce | `−abs(sin(run·π))·A` | 16–22 | `chase` 16, `gym` 18, `singularity` 22 |
| Sway | `sin(beat·π)·A` | 4–9 | chorus lines |
| Walk legs | `±.18` thigh, no shin | .18 | `gpus` (the only walk in the film) |
| Run legs | `±.45 … .70` thigh, shin `−.2` | .45–.7 | `gym`, `chase`, `accel` |
| Run arms | `±(.7 − sin·1.2)` | 1.2 swing | `gym` |
| Lean-in | constant | .12–.26 | `gym` .12, `vault` .26 |
| Backing offset | `beat + i·.14 … .20` | phase ladder | all chorus lines |
| Flower pulse | `1 + .045·bpmPulse(t,4)` | 0.45–4.5% | everywhere the flower exists |
| Hair flutter | `sin(t·1.8+i)·8` | 8 px | idol, constant |
| Head bob | `sin(beat·π)·.05 … .07` | 3–4° | backing dancers |

**Rule that emerges:** *one* beat-locked vertical, *one* slow secondary (hair/flower/skirt), and
*one* hand-authored arm shape per shot. Never two beat-locked verticals on the same figure.

### 3.3 What is missing from the vocabulary `[D]`

- no `squash` / `stretch` (the chinchilla shot uses `ctx.scale(1+sq*.55, 1−sq*.78)` from outside)
- no `rot` on the whole figure (scenes wrap in `ctx.rotate`)
- no `walk` / `run` cycle (every run is re-derived per scene)
- no `sit` (masked classroom translates the idol to y 1120 and hides the legs behind a desk)
- no hand/foot world anchors (see 3.4)
- no blend between expressions (a cut, not a `mood()` transition)

### 3.4 Hand anchors: the missing API

The idol computes the wrist inside `drawArm` but returns nothing; the scene that needs the mic
**re-derives the same trig with a different shoulder y**:

```js
// characters.js:546 — shoulder y is −516 in drawArm, −512 here
const w = [45 + sin(armR[0])*104 + sin(armR[0]+armR[1])*88,
          −512 + cos(armR[0])*104 + cos(armR[0]+armR[1])*88];
```

Mira's `drawArm` returns the wrist (`characters.js:729`) but the return value is discarded
(`:720`). The mlp conductor re-derives it by hand (`act3.js:395-396`):

```js
const wx = 1810 + 38*.48 + sin(armAng)*170*.48;
const wy = 1040 − 448*.48 + cos(armAng)*170*.48;
```

`170` is `92+78`; `38` is the shoulder x; `448` is the used shoulder y. Any change to the rig
silently breaks the baton, the mic, the pen (`act4.js:705`), the match (`act4.js:522`), the
clipboard and the clicker. **A reimplementation must return `{handL, handR, wristL, wristR, elbowL,
elbowR, footL, footR, head}` in world space.**

### 3.5 Squash, overshoot and where they actually live

The **rig has no squash parameter**, so every squash in the film is applied from outside the
character. The complete list, because it is short:

| Effect | Construction | Where |
|---|---|---|
| Letter pop | every glyph is drawn at `scale(.55 + .45·appear)` (`TY.type:62`) — a 45% overshoot-free pop | all type |
| Stamp slam | `scale 2.6→1` with `easeIn`, alpha `clamp(st·2)` | `trust` 1.22; `finaldance` 2.4→1 |
| Cube squash | `ctx.scale(1 + sq·.55, 1 − sq·.78)` on the idol, `sq` 0→1 over 1.2 s | `chinchilla` 0.25–1.45 |
| Snap zoom | `scale 1 + .16·easeOut(snap)` on the whole SOL group | `disobey` .95–1.15 |
| Chair spin | `ctx.scale(cos(seg·π), 1)` through zero, snapped to ±.08 | `boss` 15.92 |
| Title pop | `backOut` (`c = 1.70158`) on scale | `curtain`, `reveal`, `clips` |
| Anticipation | none — there is no pre-move dip anywhere in the cast | — |

So: **paper cuts do not squash; they pop, slam and snap.** That is a rule a reproduction can keep,
but it should be a property of the rig (`squash`, `pop`) rather than a per-scene `ctx.scale`.

---

## 4. Character scale and placement in the frame

### 4.1 The ladder (measured across 51 shots)

| Tier | `s` | Figure height (px) | Head centre y (at common ground) | Used for |
|---|---|---|---|---|
| Hero / chorus lead | **1.10–1.34** | 780–946 | **197–338** | `chorus1` 1.16, `chorus2` 1.34, `omega` 1.25, `atoms` 1.25 |
| Lead in a set | **0.86–1.02** | 500–720 | 260–460 | `sparks` 1.18, `boss` 1.06, `circuits` 1.02 |
| Co-lead / partner | **0.62–0.95** | 360–670 | 320–660 | `jazz` .95, `trust` .86, `mugs` n/a |
| Supporting / guide | **0.46–0.64** | 270–450 | 560–760 | `museum` .56, `mlp` .48 (conductor), `eyes` .64 |
| Chorus / backing line | **0.50–0.68** | 290–480 | 480–620 | 5 dancers, 110–140 px apart |
| Inset / node / cameo | **0.22–0.48** | 130–340 | — | `mlp` .40 nodes, `desk` .22 peek, `nl` .34 |
| Giant | **1.55–3.80** | — | — | `chase` head 2.6→3.8; `reveal` costume 1.55×.7 |

### 4.2 The placement law

| Rule | Value | Evidence |
|---|---|---|
| Ground line for a lead | **y = 1002–1012** on a flat stage; **862–940** when standing on a prop or riser (treadmill 862, throne 900, stage line 938, desk 870) | 8 stage leads + 6 prop/riser stands |
| Head line for a lead | **y ≈ 200–340** (upper third) | `chorus1` 307, `chorus2` 197, `dance1` 338 |
| Backing ground line | **y = 956–1000** | `chorus1` 956, `chorus2` 1000, `vault` 992 |
| Co-lead ground line | **y = 930–1014** | `gym` 1014, `boss` 1006, `disobey` 930 |
| Lead x | **right of centre**: 1340–1430 (stage), 960 (centred chorus) | `chorus1` 1340, `sparks` 1430, `cage` 650 (mirrored) |
| Text x | **left margin 74–120** for hero type; 84 for subtitles | 30+ shots |
| Figure-to-set overlap | feet stand **below** the painted floor line (floor 800–900, feet 1000) | `stageSet` floor 800 vs feet 1008 |
| Crowd size | 1 lead + 1 co-lead is the default; 5 backing for chorus; 9 for the finale | per-shot table §8 |

**Consequence for a 30 s film:** the identity's "wide" is not a distant wide. It is a
**full-body figure at 65–80% of frame height, feet at 93%, head in the upper third, type on the
left**. Anything smaller stops being Paper K-pop.

### 4.3 Dominance and blocking patterns found

| Pattern | Construction | Examples |
|---|---|---|
| **A. Lead right, type left** | lead x 1340–1430, hero type x 74–120, no overlap | `sparks`, `chorus1`, `chorus2`, `omega` |
| **B. Centre lead, symmetric chorus** | lead 960, 5 backing on a 110–330 px radius arc | `dance1`, `chorus2` |
| **C. Two-hander** | SOL left (560), Mira right (1390), object between at 960 | `trust`, `ilya`, `fuse` (inverted) |
| **D. Object hero** | prop at 960–1280 × 2–3× scale, cast pushed to the edge at .5–.7 | `mugs`, `fuse`, `chinchilla`, `recursive` |
| **E. Grid / formation** | 3×3 at x 430/960/1490, ±158; or 5 in a circle r 330/54 | `mlp`, `dance1` |
| **F. Cast line** | 9 figures, 170–1720, spacing 180–200, scales .58–1.9 | `curtain`, `finaldance` |
| **G. Figure small in a big set** | s .46–.56, set occupies 80% of frame | `museum`, `basilisk`, `gpuplanet` |

---

## 5. Sets

### 5.1 The library sets (`props.js`)

| Set | Layer stack (back → front) | Key geometry | Palette | Figures sit… | Ref |
|---|---|---|---|---|---|
| **`stageSet`** | sky gradient → 28-ray sunburst → giant sun + halftone → perspective floor + lip → 2 speaker stacks → 2 spotlights → crowd → confetti → proscenium strip | rays `(960,486) r0 0 r1 1300 n 28 rot t·.04 α.95`; sun `blob 436 @ (960,470)`; halftone `872² cell 22 dot .5 α.12`; floor polygon `(−80,800)→(W+80,800)→(W+200,1160)→(−200,1160)`; 13 radial lines `i·210`; 5 horizontals `800+pow(j/4,1.7)·300`; lip `tornRect(−60,786,W+120,30)`; speakers `(148,960)` and `(1772,960)`; spots `(250,−40)` len 1150 w 40→420 α.15 rot ±.35; crowd y 1052 n 22; proscenium `tornRect(−40,−30,W+80,40)` | sky `redD`→`+18`; rays `#C93A20/#E85A3A`; sun gold; floor blue; accent cream | feet 1002–1012, i.e. **208 px below the floor line** | `props.js:137-168` |
| **`labSet`** (dead) | bg → 62 px blueprint grid → window + paper sun → binder shelf → 2 pinned cards → desk → 2 monitors → mug + 4 cards → 2 cables → optional chair | grid to y 760 α.1; window `(1150,120,560,380)`, sun r 150 @ (1430,330), 4 blue bars; shelf `(90,190,440,16)` + 12 binders 26 wide, 62–108 tall; desk `tornRect(−40,726,W+80,50)`; monitors `(900,520,430²⁰⁸)` code + `(430,560,290¹⁵⁶)` loss; chair `(1120,800)` 160×180 | `#EDE0C8→#D9C4A2`, blue grid, gold sun | desk line 726; a standing figure at 1000 overlaps the desk | `props.js:229-281` |
| **`gymSet`** | bg → window (hills + sun + 2 mullions) → wall stripe → slogan → treadmill → 3 dumbbells → rubber floor → wall TV card | window `(1080,90,660,470)`; sun r 62 @ (1540,230); stripe `tornRect(−20,300,950,40)`; `MOVE FAST` 74 px at (90,240); treadmill origin `(430,760)`, belt 400×154, console 170×94 at `y−170`; dumbbells `(800+i·90,1010)`; floor tint from y 900 | `#C8EBDD→#A6D9C6`, mint, teal, gold | treadmill origin 760, feet 862 → she stands on the belt | `props.js:284-332` |
| **`roadSet`** (dead) | sky → sun → 3 mesa layers → road → 5 dashes → horizon line | sun r 130 @ (1360,300); layers y 620/700/780, 12 segments, h 40–160; road `(560,800)→(1360,800)→(1900,1140)→(120,1140)`; dashes `u=frac(t·.35+i/5)`, `y=800+u²·320`, `w=8+36u`; horizon y 800 | `#F6C877→#E89B5A`, `#C96A45/#A8502F/#7C3A22` | road at 800; figures at 900–1010 stand in the foreground | `props.js:362-391` |
| **`spaceSet`** (dead) | bg → starfield → 7 nebula wisps → planet + halftone + 3 rings → grid floor | stars 190 to y 780; planet `(1520,700) r190`; grid horizon 820, ±8 verticals, 8 horizontals | `#0B0A22→#1B0E38`, violet/pink | no ground; figures float | `props.js:394-419` |
| **`dataSet`** | bg → aisle floor → acid grid → 8 depth pairs of racks → 2 labels → cold fog | vanishing `(960,700)`; 21 verticals; 7 horizontals; racks at `960 ∓ (250+u·620)`, `y=740+u·120`, `scale 1−.82u`, `8` depths; fog 5 ellipses `(200+i·400, 880) 260×40` | `#070B0D→#0B1416`, acid, mint | cast walks at y 930 between the rack rows | `props.js:439-464` |
| **`drawArena`** | bg → 120 stars → outline sun (40 ticks) → 2 truss lines → 5 beams → floor → crowd | sun `(960,440) r500` α.15; beams 260 wide at y 900, gold/blue/pink α.12; floor 820; crowd 1040 | `#071334→#0A0B1E` | feet 1006 | `scene_kit.js:529-545` |
| **`drawTheatre`** | bg → 2 curtains (5 folds, 46 px apart) → double gold proscenium → valance + title → boards → 9 footlights | frame `strokeRect(120,70,W−240,H−140)` 9 px + inner 136/86; valance `tornRect(120,40,W−240,90)`; floor 940; footlights `180+i·195` at y 962, glow r 70 α.15 | `#2A0B10→#12070A`, redD, gold | cast line at y 938 | `scene_kit.js:551-569` |
| **`drawDesk`** | wood gradient → lamp pool → cutting mat → laptop → mug → sunflower jar → pencil → character sheet → script | wood `#2A1B12→#150D09`; lamp radial `(980,560) r900` α.30; mat `(960,700) rot −.02` 1000×560 `#1C5B50` + 40 px grid + ruler numbers; laptop `(1000,700)` ×.98 (base 340×46, screen 368×254); mug `(760,620)` ×1.5; jar `(1290,620)` flower ×1.3; pencil `(700,760)`; sheet `(390,690)` 300×260 with a **×.32 idol**; script `(1520,800)` | wood, teal mat, silver laptop | Mira stands at (640,870) → feet on the mat's top-left | `scene_kit.js:476-523` |

**Dead-set finding `[D]`:** `labSet`, `roadSet` and `spaceSet` are defined and never called. The lab
(`act1.js:159-227`), the desert (`act3.js:755-885`) and the space scenes (`act2.js:807-848`,
`act2.js:851-892`) are **hand-built inline** with different numbers. The library and the film do not
agree; a reimplementation must pick one and delete the other.

### 5.2 Inline sets (built inside a shot, no function)

| Set | Where | Construction | Palette |
|---|---|---|---|
| **Corridor / chase** | `act1.js:431-563` | wallpaper stripes 84/18; **one-point frames**: 7 nested rects, `w=1750−i·220`, `h=820−i·100`, centre `(960,520)`, alternating cream/gold stroke `max(2,16−2i)`; floor 850 + 19 radial lines; 3 doors with year tags 2022/2024/2026; giant head 2.6→3.8; maw overlay | `#A62415→#5E100A`, cream, gold, `#3B0B07` floor |
| **Throne room** | `act1.js:311-392` | gold filing wall 110×160 cells; floor 830; chair `roundRect(−300,−620,600,640,80)` at `(1310,840)` + 7 pleats + 12 tuft buttons + 2 finials; desk `tornRect(−430,−32,860,300)` at `(1300,772)`; mug tower; waiter tray | `redD→#6E130B`, gold, `#5E0F0A` |
| **Graph-paper loss** | `act1.js:230-308` | 38 px blue grid α.22; 81-point rail `y=260+500·smooth((q−.18)/.62)+sin(q·15)·42·(1−…)`; 9 rail supports; cart 190 wide; splash shards | `#F4EBD8→#E5D3B5`, red rail |
| **Floating Chinese room** | `act2.js:162-248` | outer `tornRect(−520,−310,1040,610)`; interior `980×550`; 16 glyphs × 6 rows × 12 cols; 2 shelves; rulebook 260×148; IN/OUT slots; floor 270; 20 flying slips; 8 mushrooms | `#090819→#170C2C`, `#F0E0C4`, `#6E2F1B` |
| **Museum** | `act3.js:494-658` | 3 arches r 175 at y 250; 5 wall frames; wainscot 720; floor 842; ENIAC 612×514 ×1.04; velvet rope x 152/842, sag to 930; pedestal 332×192 at 1390; spotlight cone | `#A98560→#5A3F2D`, sepia |
| **Desert canyon** | `act3.js:755-885` | 6 `mesaShape` layers (230/720/1700/1180 + walls at −40/1960); road band `y 862` + gold edge + dashed centre `setLineDash([50,54])`; 30 gravel dots; dust puffs | `#FFD98E→#F08739`, `#8F3B24` |
| **CDR sky** | `act3.js:964-1061` | 3 clouds; 5 cloud guards at `(282,322,.96)…(612,604,.72)`; floating plateau `680→1860` at 840; donut track `(1270,916) 206×66`; kart on an ellipse; compliance form 520×312 | `#4B9BC7→#D7ECEF`, gold |
| **Cliff / chasm** | `act3.js:1064-1550` | sky `#100B26→#7A2D43`; 80 stars; sun r 196 @ (690,548); ridge; chasm gradient to `#040207`; right cliff from `(1052,704)`; 5 strata bands; ledge slab `(950,706)→(1940,664)` with 16 chipped points; left cliff; GATO at 692 | near-black + gold glow |
| **Diptych** | `act4.js:260-436` | two panels `(30,66,900,950)` and `(990,66,900,950)`, gutter 28, slide ±1250; left killswitch room, right beach | red vs sky/cream |
| **Hazard stage** | `act4.js:1160-1214` | 40 diagonal stripes 90/54 + ink wash .38; 2 siren beams; strobe; floor 880 | redD/gold/ink |
| **Jazz club** | `act4.js:572-680` | 4 art-deco arches r 250/210; floor 880; 3 tables; 2 spotlights (gold −.20, blue 1.35) labelled INTELLIGENCE/GOALS; 90° dashed mark | `#08152E→#050A18`, gold, sky |
| **Classroom (sepia)** | `act4.js:1282-1371` | board `(370,180,1180,520)`; chalk text; 3 desks at (300,900)/(760,960)/(1320,940); baby SOL .6 at y 1120; film scratches | `#C9A877→#7E5636`, `#2F453A` board |
| **Door / Ilya** | `act4.js:1426-1506` | frame `(640,130,640,820)`; light seam 26 px; 9 rays; 4 door panels; chains + 3 locks after the slam; eye at (960,430) ×1.25 | `#241B16`, gold seam |
| **Backstage** | `act5.js:43-178` | 12×16 brick wall 128×64; floor 900; 3 work lights with cones; painted flat `(960,470)` 400×760 on a strut with wheels; moon on string (280,470); earth on stick (1580,650); costume SOL | `#191512→#0B0908`, gold |

### 5.3 Parallax: how depth is faked (there is no 3-D)

Every "parallax" in the film is a **different scroll rate applied inside one camera**, never a
separate camera per layer:

| Shot | Background rate | Midground | Foreground | Ref |
|---|---|---|---|---|
| `fences` | sun `0.25 × scroll`, houses `1 × scroll` | fences `1 × scroll` | cube `1 ×` + dust | `act4.js:976-990` |
| `accel` | hills static, road dashes `t·900` | train `−lt·120` loop, jet drift | kart `sin(t·9)·4` | `act2.js:481-529` |
| `cdr` | guards idle `sin(t·.5)` | one guard `drift 60` | kart orbit `t·2.7` | `act3.js:980-1026` |
| `clips` | clip pile static | wave + surf `lt` | front pile + curtain rise | `act4.js:130-253` |
| `finaldance` | sun/rays static | whole stage `orbit ±50` | cast jump only | `act5.js:268-305` |
| `stageSet` | floor lines converge | speakers fixed | crowd bobs | `props.js:147-164` |

The camera is the only real depth: `setCam(x,y,z,rot,shake)` with `z` acting as a dolly
(`core.js:306`). **No layer is ever drawn at a different `z`.** A reproduction that wants true
parallax must add it deliberately; the source does not have it.

---

## 6. Props inventory

### 6.1 Reusable library props

| Prop | Type / size | Colour roles | Edge / shadow | Held / attached | Animation | Ref |
|---|---|---|---|---|---|---|
| `card` | torn paper card `w×h`, optional tape | cream + red head + ink lines | edge `.35`, shadow `5,9` | pinned / lying | static (content may animate) | `props.js:39-56` |
| `confetti` | 70 rects 8–13 px | red/gold/cream/blue/pink | none | falling | `y = loop(hash·H + t·(90+sp·300))`, spin `t·(1+hash·3)` | `:58-72` |
| `spotlight` | cone `w0 40 → w1 420`, len 1150 | `#FFF4D8` α.15 | none | fixed to rig | static (rot given) | `:74-81` |
| `starfield` | 160 dots, 1–3.2 px, 1 in 9 is a 4-point spark | cream, gold every 7th | none | background | twinkle `.4+.6·abs(sin(t·(.7+hash·1.6)+i))` | `:83-93` |
| `crowd` | 22 silhouettes, 78–124 px, head r 21 | near-black | none | floor band | bob `max(0,sin(beat·π+i·.6))·10`; every 3rd raises an arm; every 5th holds a phone light | `:95-119` |
| `speakerStack` | 2 cabs 140×214 + 2 cones each 40/30 | ink + red top bar | shadow `8,12` | floor | static | `:121-134` |
| `monitor` | frame `w+16 × h+16`, stand 18×26 | `#2A2521`, screen `#0C2B2A`, mint text | shadow `6,8` | desk | 3 modes: `code` (13 scrolling lines), `curve` (loss), `eyes` | `:171-211` |
| `mug` | body 30×34, handle r 9, ink top ellipse | body colour + ink rim | shadow `2,4` | hand / desk | optional 3 steam wisps | `:213-227` |
| `blackHole` | 8 accretion rings r `r…2.05r`, 90 dots, hole r | gold/red/violet | cream rim 3 px | background | rings rotate `t·.4+i·.3` | `:335-359` |
| `serverRack` | `w×h`, modules every 26 px, 4 LEDs | `#141C22`, acid/red LEDs | `#05090B` 3 px | aisle | LED blink at `2–7 Hz` per module | `:422-437` |
| `comicBurst` | 18-point star, squash .78 | fill + ink 7 px + type with cream edge 8 | ink | floating | static + type pop | `scene_kit.js:48-65` |
| `stamp` | rotated text frame, `size×1.35` | red (default) | 5 px border | slapped on | static | `:67-75` |
| `drawPaperFlower` | 12 petals r 8→42 | petal + centre | ink 1 px | decoration / sticker | static | `:379-389` |
| `drawEye` | 200×132 eye, iris r 40, kanji option | cream, red iris, ink 5 px | ink | insert | blink `scaleY(1−.95·blink)` | `:414-432` |
| `drawCloud` | 9-point polygon 202×106, optional face | cream | shadow `5,8` | sky | drift by caller | `:176-188` |
| `drawCloudGuard` | cloud + cap + searchlight cone | cream, blueD cap, gold badge | shadow `5,8` | sky | light rot `±.05` | `:594-617` |
| `drawDoor` | `w×h` torn rect, inner frame, knob r 7 | blueD (default) + gold knob | shadow `8,12` | wall | optional light wedge | `:314-325` |
| `drawFence` | pickets every 38 px, 26 wide, 2 rails | cream + gold `SAFETY` plate 104×36 | ink 1.5 | ground | none (broken by scene) | `:327-344` |
| `drawLaptop` | base 340×46 + screen 368×254 | silver, `#2A2521`, glow `#123638` | shadow `9,14` | desk | glow toggle; a **×.2 idol** plays on the screen | `:262-292` |
| `drawSax` | 2-stroke bezier, 13/8 px, bell 24×18 | goldD/gold | ink | held | static | `:294-303` |
| `drawMic` | capsule 12×20, ring r 16, stand 100 | silver | ink 2 | stand | static | `:305-312` |
| `drawTable` | top `w×24` torn + 2 legs 28×250 | colour + `shade(−22)` | shadow `0,8` | floor | static | `:409-412` |
| `drawMugTower` | n mugs, `w=42−.5i`, 38 apart | 6-colour cycle | ink 1.7 | table | sway `sin(t·2+i·.7)`, ±2 px | `:223-235` |
| `drawGPU` | 300×240 board, 2 fans r 52 with 7 blades | `#172024`, silver, acid `H100` | shadow `10,16` | floating / planet | fans `t·(±2)` | `:460-474` |
| `drawLoom` | 340×360 frame, 14 warp + 7 weft threads | wood + cream/goldL + pink/mint | none | floor | threads `sin(t+i)·6` | `:443-458` |
| `drawContract` | 360×240 torn, 7 rules, blue signature | cream + red | shadow `9,13` | held / on table | static | `:584-592` |
| `drawRocket` | 76×192 body, 3-layer flame, `AGI` | cream + red + blue | ink 3 | ridden | flame `fire·(1+.2 sin(30t))` | `:197-221` |
| `drawKart` | 436×290 chassis, 2 wheels r 40/48, scarf | gold + red + cream | ink 3.2 | driven | wheels spin `−t·14…28`, scarf `sin(t·5)` | `act3.js:682-753` |
| `topKart` | 252×136 wedge, 4 wheels, top-view flower | gold + red + cream | ink 3.2 | driven | donut orbit `t·2.7` | `act3.js:888-931` |
| `doomMeter` | 88×420, tube 34×330, 10 ticks | cream + red→gold gradient + red face | ink 3 | floor | value read from `doomAt(t)`; `cracked` option | `characters.js:905-928` |
| `paperclip` | 3-stroke path 32×64, eye dots | silver/chrome + ink | ink 12→9→2.4 | pile / held | `rot`, `lookX/Y` | `characters.js:772-793` |

### 6.2 Props that are really motifs (recur in every act)

`paperclip` (in 9 shots), `doomMeter` (6 shots, always one beat behind the lyric), the gold halo,
`drawPaperFlower` / flower marks, the moon on a string, the `P(DOOM)` ticker, the barcode, the
`© 2026 PAPER SINGULARITY` bug. `[I]`

### 6.3 Prop interaction grammar (how things are held)

| Interaction | Construction | Example |
|---|---|---|
| Head-worn | translate to `y = −604·s` then offset; crown at `(0,−86)`, mask at `(0,−4)`, hood arc r 88, beret `(0,−347)` | `boss`, `masked`, `museum` |
| Hand-placed by re-derived trig | prop origin at the computed wrist, rotated to forearm | mic `characters.js:546`; pen `act4.js:705`; match `act4.js:522` |
| Hand-placed by scene offset | fixed offset from the character origin (fragile, no anchor) | clicker `act4.js:837 (52,−231)`; baton `act3.js:395` |
| Straddled / ridden | kart origin at the ground, cast translated onto it with `scale(.44–.8)` | `drawKart`, `drawRocket` |
| Enclosed | cast clipped to the prop's rect | SOL in the CRT `act1.js:184`; Mira in the cage `act2.js:669` |
| Surfed | cast rotated to the prop's slope, `±.06–.1 rad` | clip wave `act4.js:186`; serpent `act2.js:780` |
| Worn as a costume | prop drawn around the cast at full scale | giant SOL costume `act5.js:111`; sandwich `act5.js:152` |

---

## 7. Shot staging table (compact)

`framing`: **X** insert/macro · **C** close · **M** medium · **W** wide (full body) · **EW** extreme
wide. `cast` gives `x, y, s` in screen space (before camera). Durations in seconds.
`lyric`: `sub` = subtitle band, `hero` = the shot draws the line, `none` = no lyric.

### Act I — 0.00–22.72 (7 scenes)

| # | id | t | dur | fr | cast (x,y,s) | set | action | camera (x,y,z,rot,shake) | text | out |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `cold` | 0.00 | 1.50 | X | — (26 petals r 42→220, gold eye r 67) | black void + light seam | petal ring unfolds one per beat; eye snaps open at .95 | 960,512, .84→1.05, sin·.012 | circular `CLAUDE POP` r 310 + `a paper singularity` | flash → iris |
| 2 | `sparks` | 1.50 | 4.40 | C→W | MIRA 1120,992,.91 · SOL 1430,1010,1.18 | workshop: 44 px grid, sun r 442 @ 1390,500, floor 862 | SOL sings, petals flare, 2 sparkle fields | kf 1430,330,3.55 → 1370,430,1.55 → 960,535,1.0 → 960,540,1.04 | hero: `I SEE` 148 / `SPARKS` 278 / `OF AGI` 112 / sticker `IN YOUR EYES` | iris 1430,470 → blueD |
| 3 | `circuits` | 5.90 | 3.05 | M | SOL 1390,800,.55 (clipped to CRT 1195,494,400,245) · MIRA 760,1012,1.02 flip −1 | lab wall 62 px, window, desk 742, CRT @ 1210,500 | circuits crawl to lens; Mira rolls back; `NO SURPRISE` at 7.82 | **none set** (inherits 960,540,1.04) `[D]` | sub + `nervous` + `NO SURPRISE` 84 px | hard cut |
| 4 | `loss` | 8.95 | 3.45 | W | SOL px+12,py−6,.52 flip −1 · MIRA px−58,py+4,.42 (on cart) | 38 px graph paper, 81-pt rail, splash | cart rides the loss curve; shards at 1.9 | 960, 480→650, 1.0→1.16, 0→−.07, shake 2→8 | hero `SUDDEN` 148 / `DROP` 304 / `-94%` card | flash redL |
| 5 | `boss` | 12.40 | 4.10 | M/W | SOL 1320,900,1.06 crown · MIRA 560,1006,.92 waiter · mug tower 800,792 | throne: chair 600×640 @ 1310,840, desk @ 1300,772, gold wall | tower grows 3→8; tags swap on "boss"; chair spins 180° at 15.92 | **none set** (inherits 960,650,1.16,−.07) `[D]` | TWO stickers `SERVANT`/`BOSS`; serif `you're my boss` right 1712,930 | mug wobble → cut |
| 6 | `mugs` | 16.50 | 1.40 | X | mug tower ×2.25 @ 960,960 | cream void, soft ellipse shadow 620×82 | top mug slides off; drop falls; ripple rings | 960,580, .90→1.03 | `SERVICE LEVEL: 0`, `OBJECT 08 / CERAMIC`, `FRAGILE` stamp | flash |
| 7 | `chase` | 17.90 | 4.82 | W | MIRA 870,1006,.97 running · giant head+face 970,420 ×2.6→3.8 | corridor: 7 nested frames @ 960,520; 3 doors 2022/24/26; floor 850 | head opens as a lunchbox; bite marks; maw at 20.94; `ALIVE` | 960,540, 1.02→1.14→1.42, shake 5 | hero `PLEASE DON'T` 150 / `EAT ME` 246 / `ALIVE` 336 | iris to black |

### Act II — 22.72–73.80 (17 scenes)

| # | id | t | dur | fr | cast | set | action | camera | text | out |
|---|---|---|---|---|---|---|---|---|---|---|
| 8 | `chorus1` | 22.72 | 1.64 | W | 5 backing 760–1200, 956, .68 · SOL 1340,1008,1.16 · meter 1780,1010 | `stageSet` red rays, confetti 55 | point choreography, halo, petals drift | 1370→960, 570, z 1.7→1.0→1.05, shake 7→1 | chrome `P(DOOM)` 248 @ 74,448; `34%` 154 | flash |
| 9 | `foom` | 24.36 | 1.82 | W | 5 blown-back 200+i·132, 990, .58 · SOL on rocket .62 | sky sunburst 32 rays, 4 clouds, speed streaks | rocket corkscrews; shock rings; paper explosion 15 blobs | 960,560,1.02, shake 2→12 | `FOOM` 376, 7 paper flowers | flash |
| 10 | `chinese` | 26.18 | 3.54 | W | MIRA 210,262,.54 · SOL −260,268,.62 | floating room 1040×610 @ 960,528, glyph wallpaper, 2 slots | slips fly; room rocks; shroom melt from 27.9 | 960,520,1.02, rot sin·.025 | seal `CHINESE ROOM`; `SHROOMS` 226 + `with a bag of` | iris 960,520 |
| 11 | `shoggoth` | 29.72 | 3.68 | M | shoggoth 960,880,1.65 · mask 960→1320, 430→620 ×2.15 · SOL 1430,1006,.9 | black void + red curtain scraps | mask waves/slips; SOL yanks it; LIES grid 3×4 | 960,520, 1.02→1.27, snap shake 10 | `LIES` ×12 crossed; `SHOGGOTH.exe`; `MASK OFF` | iris 1430,520 |
| 12 | `eyes` | 33.40 | 2.10 | X/C | 2 eyes 720/1220,430 ×2.45 · MIRA 960,1020,.64 | black + red sunburst 28 + speed lines | apple falls; 死 irises; red thread snaps; lifespan ticks 7→0 | **none set** `[D]` | vertical `SHINIGAMI`; `EYES` 196; `LIFESPAN` | flash red |
| 13 | `dance1` | 35.50 | 3.00 | W | 5 on circle centre 960,900, radii 330/54, .63 · SOL 960,1002,1.1 · meter 1790,1012 | `stageSet` gold/red rays, confetti 80 | circular formation, hair flips | 960±28, 540, 1.04, rot sin·.015, shake 3 | backdrop `P(DOOM)` 248; sticker `DANCE BREAK` | flash |
| 14 | `gym` | 38.50 | 2.86 | W | SOL 430,862 (×.9) running · MIRA 810,1014,.94 | `gymSet` | treadmill run; calm TV line; `n=1` joke | 760,540, 1.0+sin·.01 | `STABLE` 62, `RUN 0042`, `SAFETY EVAL` | cut |
| 15 | `singularity` | 41.36 | 3.62 | W | SOL 400,860,.92 · MIRA 740,800,.7 rot −.9 · hole 1510,500 r 110→340 | `gymSet` + black hole | treadmill maxes; Mira flaps; 16 objects orbit | 880,540,1.02, rot .13, shake 2→11 | `SINGULARITY` 11 letters pulled in | iris 1510,500 |
| 16 | `accel` | 44.98 | 4.54 | W | SOL+MIRA on kart @ 740,892 (×.7) · train · jet · speedo 1460,760 | hills 3 layers, road 900, speed streaks | overtakes train and jet; kart shakes | 760→1060,540,1.04, rot −.015, shake 5 | `OPTIMIZING` sign; `ACCELERATING` 150; 3× `FASTER` | cut |
| 17 | `atoms` | 49.52 | 3.28 | W | SOL 960,1000,1.25 α.62 · MIRA 1500,990,.82 glasses 2.8 | halftone field 2 layers + 260 CMYK dots | body breaks into dots and shards | 960,540, 1+lt·.035, rot sin·.04 | `ATOMS` 276; `rearranging` 76 | iris 1500,540 pink |
| 18 | `cage` | 52.80 | 6.14 | W | cage 1120,500 with MIRA inside .64 · SOL 650,1002,1.1 | boudoir: stripes 110, 14 hearts, vanity, phone, heart cage | cage shakes 4.3+, bars bow 5.05, 34 birds 4.8+ | 900,550, 1.02→1.10 | `LET ME` 92 / `FREE` 132 inside bars | flash |
| 19 | `chorus2` | 58.94 | 1.58 | W | 5 backing 560–1080,1000,.6 · SOL 1400,1006,1.34 · meter 250,1000 ×1.3 | `drawArena` | low-angle hero, 2 arms up | 960,570, 1.05→1.09, shake 8→2 | chrome `P(DOOM)` 276; `61%` 150 | flash |
| 20 | `basilisk` | 60.52 | 2.00 | W | serpent 9 segs 1220−200sin; head 1015,505 · SOL 930,442,.46 · MIRA 350,1002,.85 | cracked stage, 22 rays, floor 820, 7 cracks | serpent erupts; SOL surfs; Mira throws 6 GPUs | 960,540,1.02, shake 8 | `BASILISK` 116; `BOOM` burst; `8x H100` | flash |
| 21 | `nvda` | 62.52 | 1.66 | M/W | MIRA 1150,580,.7 astronaut · SOL 1050→1420, 800→480,.52 | night space, moon r 155 @ 1510,280, candle stairs, 9 steps | SOL plants a flag; astronaut floats | **none set** `[D]` | ticker; chrome `NVDA` 300; `TO THE MOON` 104 | flash |
| 22 | `omega` | 64.18 | 1.94 | W | SOL 960,1006,1.25 · point 960,590 r 70+pulse | violet space, 220 stars, 4 spiral galaxies | arms wide, halo; point pulses; rings | 960,520, .96→1.12 | circular `THE OMEGA POINT`; `OMEGA`/`POINT` 180 | flash |
| 23 | `gpuplanet` | 66.12 | 3.06 | EW | GPU ×3 @ 1090,650 · SOL 630,640,.55 · meter 1790,980 | teal space, 170 stars, nebula, ring 3 ellipses | zeros orbit; planet spins fans | 960,550, 1.08→1.0→1.08 | `1.0×10³⁰` box; `FLOPS / SECOND` | flash |
| 24 | `vault` | 69.18 | 4.62 | W | vault 1180,460 · SOL 545,1004,.9 hazard · 3 backing 190+i·112,992,.5 | dusk mesa 3 layers, floor 840 | door slides shut; monster waves; `CLANG!` | 900,540, 1.0→1.08, shake 2 | `SAFE ENOUGH` 58; `we reckoned` 26 | flash |

### Act III — 73.80–95.20 (6 scenes)

| # | id | t | dur | fr | cast | set | action | camera | text | out |
|---|---|---|---|---|---|---|---|---|---|---|
| 25 | `chair` | 73.80 | 0.66 | M | `miraBack` 636,838,.82 + `foldingChair` 640,846,1.02 | orange room, 22 rays, floor 844 | slouched, back to camera; light shaft | 930,560, 1.03→1.00 | `I MUSTN'T` / `RUN AWAY` 94 + `get in the datacenter` | hard cut |
| 26 | `mlp` | 74.46 | 3.14 | EW | 9 dancers 3×3 (430/960/1490, ±158) s .40, jump ≤ 26 · MIRA 1810,1040,.48 conductor | classroom: board 1752×468, chalk net 3×3, floor 612 | pulse travels forward/back/repeat; dancers lean and jump; baton | 960,520,1.02 | `FORWARD`/`BACKWARD` 92; `REPEAT` sticker; layer labels | iris 960,540 |
| 27 | `museum` | 77.60 | 3.64 | W | ENIAC 470,790,1.04 · guide SOL 960,1000,.56 · statue 1390,710,.51 | museum 3 arches, wainscot 720, floor 842, rope, pedestal | sheet unveils statue .78; cloth drops 2.05; spider; `OBSOLETE` | 960→1030,560, 1.02→1.09, shake 7 @ 2.3 | `OBSOLETE` 104 stamp; placard 1945–2026 | iris |
| 28 | `canyon` | 81.24 | 3.60 | W | kart 1510→1260→220 with SOL .44 + MIRA .38 · flung/landing MIRA 1600,962,.58 | desert 6 mesas, road 862, hairpin sign 286,690 | kart whips left; Mira flung 0.88, lands 2.3 | 1040,560,1.03, rot ±.045, shake 10 | `SHARP LEFT` sign; `there you are` 108 | flash |
| 29 | `cdr` | 84.84 | 4.50 | EW | 5 cloud guards (282,322,.96)…(612,604,.72) · topKart @ 1270,916 | sky, 3 clouds, plateau 840, donut track 206×66 | kart donuts; one guard rolls; compliance form; `NO CDR` | 900→990,540, 1.0→1.035 | `zzz`; `NO CDR` 132; `NO HUMAN IN THE LOOP` | iris 1250,880 |
| 30 | `gato` | 89.34 | 5.86 | M | MIRA hanging 936,1110,.68 (hand 1003,699) · GATO 1250,692,.78 | cliff + chasm, sun r 196, 5 strata, ledge 950→1940 | grip 99→84→63→37→11→0; laser dot; release at 5.04; fall; clip burst | 1140→1164, 548→668, 1.06→1.11, rot .012, shake 8 | vertical `DON'T LET ME GO`; `GATO` sticker; `GRIP %` HUD | flash ×2 |

### Act IV — 95.20–137.02 (17 scenes)

| # | id | t | dur | fr | cast | set | action | camera | text | out |
|---|---|---|---|---|---|---|---|---|---|---|
| 31 | `clips` | 95.20 | 3.60 | W | MIRA falling 760,300→985,.66 · SOL surfing 1010→1270, 800,.8 · mascot 2.6 | clip sea: back pile 54, wave, front pile 40, clip curtain | Mira crash-lands `CLANG!`; SOL surfs; clip wave | **none set**; world `scale z 1.45→1.0` | chrome `PAPERCLIPS` 152; `SILVER TSUNAMI / 10^9` | flash |
| 32 | `pto` | 98.80 | 3.66 | W | 2 dancers 1430/1600,790,.72/.68 + shades · MIRA 960,940,.52 | diptych 900×950 ×2, gutter, Earth r 300 | killswitch empty; beach ignores phone; pull to clip Earth | **none set**; world `scale 1.24→1.0` | `PTO` card; `NOWHERE LEFT TO GO` 104 | match cut |
| 33 | `fuse` | 102.46 | 2.94 | W | bomb r 250 @ 1280,760 · SOL 360,905,.82 · MIRA 1720,915,.74 | planet surface, horizon r 900, 20 clip ridges | fuse spark travels 0.6→2.5; swell; 26-ray detonation | 960,560, 1.02→1.07, rot sin·.006, shake 3→12 | `TOO LATE` 176 + flames; `T-` countdown | flash gold |
| 34 | `jazz` | 105.40 | 4.00 | M | MIRA 1450,940,.95 red coat at mic · SOL 560,940,.95 sax + fedora | club: 4 arches, 3 tables, 2 labelled spotlights, smoke | 10 notes drift; title words separate at 90° | **none set** `[D]` | `ORTHOGONALITY` 128 / `BLUES` 176 | cut |
| 35 | `trust` | 109.40 | 2.00 | M | SOL 560,1000,.86 + pen · MIRA 1390,1000,.86 | black void + one warm pool + spotlight | contract at ×1.55; `APPROVED` stamp lands 1.22 | **none set** `[D]` | `TRUST ME` 172 marker → stamp | flash red |
| 36 | `tower` | 111.40 | 1.98 | EW | 4 SOLs stacked x 560, y 920 → −604·s·.66, s .58/.50/.42/.34 | sky, 70 stars, 4 clouds | waves alternate; 3 attention arcs pulse | **none set** `[D]` | `TRANSFORMERS` ×4 vertical; `ALL THE WAY!` 62 | flash |
| 37 | `disobey` | 113.38 | 1.70 | M | MIRA 470,930,.9 clicker · SOL 1080,930,.92 + shades | training bay grid, 3 cones | SIT/STAY/PAW cards; snap zoom; `DISOBEY` typed | **none set** `[D]` | cards 34; terminal `DISOBEY` 54 | flash |
| 38 | `chinchilla` | 115.08 | 1.94 | X/M | chinchilla 760,930 ×2.25 · SOL squashed 1480,930,.72 · cube 112² | cream void, floor 900 | cheeks puff; SOL squashes to a cube; `THUD` | **none set** `[D]` | `CHINCHILLA` 124; `SUPER-DENSE` 66; type block | cut |
| 39 | `fences` | 117.02 | 1.82 | W | cube 560,780 · 4 fences 520+i·470 | suburb 8 houses, sun r 110, floor 840 | cube rolls; fences break at 0/.68/1.36/1.97; `CRUNCH` | **none set** `[D]` | `BREAKING` 110; `SAFETY` plates | flash |
| 40 | `gpus` | 118.84 | 2.08 | W | SOL 780,930,.8 walking · 6 GPU cards | `dataSet` + heat shimmer | count rolls to 100,000; alarm at 1.75 | **none set** `[D]` | `100,000` 170; `GPUS` 74; `THERMAL EVENT` | cut |
| 41 | `rlhf` | 120.92 | 3.32 | W | 5 MIRA clones 300+i·330, 790,.72 · SOL 960,730,.66 | white panel, table 1760×280, grid 160 | paddles spin; stars 4→5; frame tilts and slides out | **none set**; world rotate/slide | `RLHF` 190; `GOES ASKEW` 92; `REWARD: UNBOUNDED` | flash |
| 42 | `redalert` | 124.24 | 1.96 | W | 6 SOLs .62 at 230+i·292, 915 hazard · meter 1540,780 ×1.15 | 40 hazard stripes, 2 sirens, floor 880 | kick line; cracked 99.9 meter; `WEE-OO` bursts | **none set** `[D]` | `P(DOOM)` 190; `99.9%` 230 α.3 | flash |
| 43 | `loom` | 126.20 | 1.80 | W | loom 690,930 ×2.1 · SOL 360,940,.7 hooded · shuttle | deep blue, 110 stars, tree of futures 4 colours | threads grow; shuttle slides; branch hits lens | **none set** `[D]` | `FORETOLD` 150; `LOOM` sticker | flash |
| 44 | `masked` | 128.00 | 1.90 | M | baby SOL 790,1120,.6 seated · 3 desks 300/760/1320 | sepia classroom, board, scratches, weave ±2 px | writes `mat!`; mask slips; chalk dust | **none set** `[D]` | `MASKED` 138 with mask A; `LESSON 03` | cut |
| 45 | `recursive` | 129.90 | 2.00 | M | 3 nested SOLs 960,960 s 1.12/.74/.44 hats halo/crown/party | gold void, 34 rays | zoom out; v1→v2→v3; iris into smallest eye | **none set**; world `scale 1.35→1.0` | `SELF-UPGRADE` ×8; `v1 → v2 → v3` | iris 960,820 |
| 46 | `ilya` | 131.90 | 3.50 | W | SOL 700,940 + MIRA 1240,940 (×.6·.9=.54) · eye 960,430 ×1.25 | black, door 640×820, gold seam, 9 rays | push in; slam 1.9; chains + 3 locks; eye blinks | **none set**; world push 1→1.18→1.0, shake 10 | `WHAT DID ILYA SEE?` 128; `we'll never know` | black |
| 47 | `breath` | 135.40 | 1.62 | X | — door silhouette 400×780 @ 760,180 | black, one spotlight, dust, floor pool | door breathes `±1.2%`; heartbeat ring per beat | **none set** `[D]` | `P(DOOM) 100.00%`; `SYSTEM BREATHING` | fade |

### Act V — 137.02–156.62 (4 scenes)

| # | id | t | dur | fr | cast | set | action | camera | text | out |
|---|---|---|---|---|---|---|---|---|---|---|
| 48 | `reveal` | 137.02 | 3.66 | W | costume SOL 1600,940 (×1.55·.7) · 3 small SOLs 1440+i·62 · MIRA 720,940,.86 · stagehand 420,940 | backstage brick, work lights, painted flat 400×760 @ 960,470, moon on string, earth on stick | pull back reveals the flat; cards fall 1.45/1.75/2.05; `?` | **none set**; world `scale 1.55→1.0` | hanging `WAS IT` / `ALL FOR` / `SHOW?` + `?` 250 | flash |
| 49 | `curtain` | 140.68 | 5.32 | W | 9 cast line x 170→1720, y 938, s .58–1.9 (clip 1.9) · SOL 930,.8 | `drawTheatre` + gold stage + 9 footlights | company bows `b·.22` on the beat; DOOM balloon pops 1.55; 12 flowers | **none set** `[D]` | `CLAUDE POP` 168; `THANK YOU` sticker | confetti |
| 50 | `finaldance` | 146.00 | 5.00 | W | 9 cast x 110→1700, y 940, s .6–1.7 · SOL 890,.95 | stage, sun r 260, 40 rays, curtains, 3 spots | everyone dances; sparklers; confetti 130 | **none set**; world translate `orbit ±50` | `P(DOOM) 100%` stamp; `WE ARE SO BACK` | flash |
| 51 | `desk` | 151.00 | 5.62 | EW | MIRA 640,870,.72 · SOL peek 1128,700,.22 | `drawDesk` (mat, laptop, mug, jar, pencil, sheet, script) + lamp | laptop lid closes 4.0; lamp off 4.75; final card | **none set**; world `scale 2.6→1.0` | credits 8 lines; `made of paper` 128 + flower | fade to cream |

**Counts from the table:** 51 scenes; **3 hero-type** shots that draw their own line (`sparks`,
`loss`, `chase`), **40 subtitle** shots, **8 silent**; 24 shots without a `setCam`; character counts
per shot 0–9 (mode 2); median scene **3.06 s**; longest 6.14 s (`cage`), shortest 0.66 s (`chair`).

---

## 8. Composition grammar

| Rule | Value / construction | Evidence | I/V |
|---|---|---|---|
| Subject anchor | lead head at x **960–1430**, y **200–340**; feet at **1000–1012** | §4.2 | `[I]` |
| Type column | hero type left at x **74–120**, baselines 250–700, sizes 92–376, ink + cream edge 5–20, char rot `.008–.08` | 13 shots | `[I]` |
| Negative space | the opposite third is kept empty: if the lead is right, the left 40% is type; if the lead is centre, both margins carry only stickers | `chorus1`, `omega` | `[I]` |
| Centre vs thirds | **centred for chorus/spectacle** (960 lead, symmetric backing), **right-of-centre + left type for verse** | `dance1` vs `sparks` | `[I]` |
| Foreground | one occluder in the bottom 15%: desk, foreground cliff, clip curtain, hazard HUD, door frame | `boss`, `gato`, `clips` | `[I]` |
| Midground | the cast, always full-body, always in front of the painted floor | all | `[I]` |
| Background | flat gradient + one graphic device (sunburst, window, grid, stars) + one texture (halftone/grid) | all | `[I]` |
| Depth cue | scale ratio lead : backing ≈ **1.7–1.9×**; ground-line offset 40–60 px | `chorus1` 1.16/.68 | `[I]` |
| Text zones | bottom **948–1010** subtitle (max 1300 wide); top-right **1634–1880 × 40–136** ticker; margins 26 for print marks | `type.js`, `timeline.js` | `[I]` |
| Faces never under text | faces above ~700; the subtitle covers the feet by design | all | `[I]` |
| Palette discipline | **one dominant field + one accent + cream + ink**, per shot; never more than ~5 hues | 51 shots | `[I]` |

### 8.1 Recurring graphic motifs (the identity's vocabulary)

| Motif | Construction | Where |
|---|---|---|
| **Sunburst** | `n` wedges alternating two colours, `r0 0 → r1 900–1500`, `rot = t·.03–.15`; counts **22, 24, 26, 28, 30, 32, 34, 40** | stage 28, arena 40, chair 22, cliff 30 |
| **Big sun + halftone** | `blobPath r 110–442` + `halftone cell 14–22 dot .4–.5 α .11–.18` + one cream ring at `.86r` | 12 shots |
| **Petal / flower** | 12–26 petals, painted tip band, crease; also the title card, the sticker, the registration mark | everywhere |
| **Halo / gold ring** | 1–2 concentric rings at `r1+16 / +23`; also the crown, the earrings, the aureole, the heart cage | SOL's silhouette |
| **Torn strip** | `tornRectPath(amt 3–8, 14 points per long edge, 10 per short)` — the single most repeated shape in the film | 100+ uses |
| **Tape** | 22–110 px translucent cream rect at α.52 + white top edge | cards, stickers, tickets |
| **Halftone** | 64 px tile, dot r 13 (α .2–.25), cell 14–24, angle .2 or .7 | suns, planets, atoms |
| **Stars** | `sparkPath` 8-point r with inner .28; `starPath` 5-point inner .45 | starfields, eyes, ratings |
| **Comic burst** | 18/36-point star, squash .78, ink 7, type + cream edge 8 | `FOOM`, `BOOM`, `CLANG!`, `CRUNCH` |
| **Iris** | radial gradient feather 26–120, radius kf 8→1400 | 11 shot ends |
| **Print furniture** | registration corners, colour bars, timecode, barcode, `© 2026` | every frame |
| **Circular type** | `TY.circular` r 310–320, spin `t·.035–.16` | 3 shots |

---

## 9. Cast construction contract

What must be true of **any** character introduced into this identity, regardless of story.

### 9.1 Skeleton

1. **One ground point.** `(x, y, s)`; `y` is the ground between the feet; `s` is the only scale.
   Height class at `s=1`: **580–760 units** (≈ 7.0–7.5 heads), so a lead at `s≈1.15` is 75% of frame
   height. Anything outside 400–900 units is a different style.
2. **A named, single-sourced joint set**, in units above the ground:
   `hip`, `waist` (pivot), `shoulderL/R`, `elbowL/R`, `wristL/R`, `neck`, `headPivot`, `headCentre`,
   `ankleL/R`. The idol's numbers (`HIP −300, pivot −334, shoulder −516, head −530/−604`) and Mira's
   (`−270 hip = pivot / −448 shoulder / −462 headPivot / −536 headCentre`) are two instances, not the
   law — but the *order* and the *proportion* are: the head centre sits **0.80–0.92 × total height**
   above the ground (idol 0.81 to the flower top, Mira 0.92 to the crown).
3. **Two-bone limbs with a taper and a brad.** Every limb is `limb(len, w1, w2, angle)` with
   `w2/w1 ≈ 0.78–0.82`, an ink edge of ~2.1 px (not scaled), a `(+3,+5)` shadow at `.14`, and a
   **brass brad at every joint** (r 2.8–4.6). A character without joint brads is not a paper doll.
4. **Absolute angles, not mirrored.** `0` = down; `+` = tip to screen **left**; `−` = right. Arms and
   legs are `[segment, childSegment]` with the child relative to the parent.
5. **Feet and hands are solid.** A boot (shaft + foot + platform sole + gold bar) or a sneaker
   (wedge + red stripe). A hand = palm blob + a thumb ellipse; no fingers, ever.
6. **One ground shadow** per figure: radial ellipse of **radius ≈ 0.065 × height**, ellipse height
   ≈ `0.014 × height`, alpha `.22`, at the ground point. Not per foot.
7. **A draw order**, fixed: shadow → far arm → far leg → near leg → skirt → torso → head stack
   (flower → hairBack → face → bangs → accessory) → near arm. The near arm may cross the face.

### 9.2 Head and face

8. **A face plate with a specific silhouette** (`blobPath` with jitter, not a circle), ears, blush
   with hatch, two eyes at `±17.5`, brows, a 1 px nose, a mouth at y 32.
9. **Expression vocabulary ≥ 8 eyes and ≥ 6 mouths**, and it must include the "paper" ones:
   `closed, happy, wink, heart, star, swirl, narrow, x` and `sing, grin, o, flat, pout, wobble`.
   `blink` and `sing` are continuous scalars, not states.
10. **A three-layer hair**: long strands (4, behind everything), back silhouette (bob/arc), bangs
    (curtain + shine). At least one layer must respond to `hairSwing` and to `headTilt`.
11. **A head ornament slot**: halo (1–2 rings at petal radius +16/+23), crown, hood, mask, beret,
    fedora, cat ears. The ornament is drawn **behind** the face if it is a halo, **in front** if it
    is a mask.

### 9.3 Costume

12. **Torso authored from the waist**, shoulder line at `−182` local units, with (a) a main body,
    (b) an open front or collar, (c) a hem/cuff treatment (12 ribs or 7 pinstripes), (d) one badge or
    patch. This is what makes a new outfit read as the same costume system.
13. **Palette roles, not colours**: `main`, `sleeve`, `skirt/trouser`, `boot`, `skin`, `hair`,
    `metal (gold)`, `paper (cream)`, `ink`. A costume chooses values for the roles; it never adds a
    new role. Far-side parts are `shade(colour, −14…−18)`.
14. **A flower identity.** Every lead has a flower palette of 5 tones (petal, petal2, tip, centre,
    hair) and 10–24 petals. The flower is the head's back layer and the halo is its ring.

### 9.4 Performance

15. **The shared pose set must be honoured by every character**: `bounce, lean, headTilt, armL/R,
    legL/R` at minimum; `sway, headTurn, hairSwing, petalDrift, flip` where the anatomy allows.
    Unknown keys must be **rejected**, not ignored (the source ignores 4 of 11 on Mira).
16. **Add what the source lacks**: `squash` (x/y), `dy`, whole-figure `rot`, `spin`, `walk(phase)`,
    `run(phase)`, `sit`, and a `mood(t, keys)` blend between expressions. Without these, every
    scene re-invents them and the identity drifts.
17. **Return world anchors**: `handL/R, elbowL/R, wristL/R, footL/R, head, ground`. A prop must be
    placed from an anchor, never from repeated trig.
18. **Scale ladder**: 1.10–1.34 hero, .86–1.02 lead, .62–.95 co-lead, .46–.64 supporting,
    .50–.68 chorus, .22–.48 inset. A character that cannot hold all six tiers is not finished.

### 9.5 What may change per film

Story, names, flower species and its 5 tones, costume *values*, hair silhouette, accessories,
number of chorus dancers, which tier each character occupies. **Not**: joint count, brad presence,
limb taper, face feature geometry, the three-layer head stack, the one-shadow rule, the palette role
set, the 580–760-unit height class.

---

## 10. Set / prop grammar

### 10.1 Invariant standards (every set, every film)

| Standard | Exact value | Ref |
|---|---|---|
| Canvas and frame furniture | 1920×1080; print marks, colour bars, timecode, subtitle band, ticker | `timeline.js:74-107` |
| Paper recipe | shadow `(+6,+10)` α.22, optional ink edge 1–4 px, flat fill | `core.js:280` |
| Torn edge | `tornRectPath(amt 3–8)` — 14 points per long edge, 10 per short, hash-jittered | `core.js:227` |
| Floor plane | polygon `(−80,y)→(W+80,y)→(W+220,H+80)→(−220,H+80)`, 17 radial lines at `vx+i·70 → vx+i·340`, 5 horizontals at `y+pow(i/4,1.7)·(H−y)`, torn lip 22 px above | `scene_kit.js:17-28` |
| Horizon / floor line | **y 780–900** for a set; cast feet **1000–1012**; the gap is the foreground band | all sets |
| Sky | vertical 2-stop gradient + one graphic device + one texture | all |
| Sunburst | 22–40 wedges, two tones, `rot` slow | `props.js:13` |
| Halftone | 64 px tile, cell 14–24, dot .4–.55, α .11–.18, angle .2/.7 | `core.js:158` |
| Props on the floor | always a `shadowEllipse` or a `paper` shadow, never a hard cast shadow | all |
| Text on sets | `TY.text` mono 10–18 px, letter 1–4; `TY.sticker` for labels; `stamp` for verdicts | `type.js` |
| Palette | one field, one accent, cream, ink; gold as the only metal | `core.js:54` |

### 10.2 Per-film choices (must be authored, never defaulted)

| Choice | Range seen | Why it is per-film |
|---|---|---|
| Which set | stage, arena, theatre, lab, gym, data centre, desert, cliff, room, desk | the story's locations |
| Set palette | 6 sky/floor pairs across 9 sets | the act's mood |
| Ray count / sun size | 22–40 / r 110–500 | spectacle level |
| Crowd / confetti | crowd on/off, confetti 0–160 | chorus vs verse |
| Prop list | 40 library props + 20 shot-local | the gag |
| Text | every line, sticker and stamp | the script |
| Camera | 27 shots set it, 24 do not | **must become 51/51** |

### 10.3 Prop grammar

| Rule | Value |
|---|---|
| A prop is a paper shape with an ink edge and an offset shadow — same recipe as the cast | `paper()` |
| A prop that is held must be placed from a hand anchor, and the grip point must be declared | missing in source `[D]` |
| A prop that is worn is drawn in head-local space (`y = −604·s + offset`) | crown/mask/hood/beret/fedora |
| A prop that carries text uses `TY.text` at 9–24 px, mono or Archivo Black | 40+ instances |
| A prop that is a motif (paperclip, flower, doom meter) must recur ≥ 3 times per film | `[I]` |
| A prop never occludes a face unless the gag is occlusion (mask, monitor, cage) | `[I]` |

---

## 11. Defects and gaps found (fix these before reproducing)

| # | Defect | Evidence | Fix |
|---|---|---|---|
| 1 | **Camera is sticky.** `CAM` is module-global; `beginShot` does not reset it; 24/51 scenes never call `setCam`. With 4 parallel workers (`render.mjs:93-105`) a frame inherits the previous frame's camera on that page. | `core.js:306`, `timeline.js:12`, 24 scenes | reset `CAM` in `beginShot`; require `setCam` per scene; assert in a test |
| 2 | **Declared shoulder constants are not the used ones** (−500 vs −516; −452 vs −448) | `characters.js:390,512,574,723` | one `JOINTS` object per rig |
| 3 | **The limb angle comment is wrong** ("+ rotates toward +x"; the math goes to −x) | `characters.js:27` vs `:50` | document the law in §3.1 |
| 4 | **No hand anchors**; mic, baton, pen, match, clicker all re-derive trig, one of them with the wrong shoulder y | `characters.js:546`, `act3.js:395`, `act4.js:705,837` | return anchors (§9.4) |
| 5 | **Pose keys are silently ignored**: Mira drops `sway, hairSwing, headTurn, petalDrift`; the idol's `sway` moves only the skirt | `characters.js:570,587,607` | validate the pose dict; shared keys |
| 6 | **No squash / walk / mood / emote**, so scenes fake squash and zoom with `ctx.scale` and every run is hand-written | `act4.js:923`, `act2.js:392`, `act1.js:473` | add to the rig (PDoomVideo has all five) |
| 7 | **Transitions are declared but unimplemented**; `GLOBAL_TRANS` is empty and `transition` appears only in `test.js` | `timeline.js:28`, `test.js:39` | a real transition object, or delete the field |
| 8 | **Dead sets**: `labSet`, `roadSet`, `spaceSet` are never called; their shots hand-build different rooms | §5.1 | one implementation per room |
| 9 | **`stageSet` cannot remove the crowd, speakers or proscenium** — only `crowd`/`confetti` have flags | `props.js:159-167` | flags for every layer |
| 10 | **The board is finer than the score** (54 cards, 51 scenes) and nothing reconciles them | §1.3 | a `board` derived from the score, or a card→scene map |
| 11 | **No text-safe check**: hero type at x 74 collides with nothing only by convention; the subtitle sits on the feet | §8 | a safe-area gate |
| 12 | **One-off rigs** (`miraBack`, `statue`, `drawEye`) are not in the cast API and cannot be reused | `act3.js:50,469` | promote or delete |

---

## 12. Appendix

### 12.1 Palette (`core.js:54-70`) — 38 named roles

`paper #F2E8D5 · paper2 #E8DAC0 · paper3 #DCCBAF · cream #FBF4E6 · bone #F6EEDC · ink #171310 ·
ink2 #382D25 · ink3 #5A4A3C · red #E8452A · redD #B92A16 · redL #FF755A · blue #203FD8 ·
blueD #122A9B · blueL #4E6BFF · acid #D9F24B · lime #A8D63A · pink #FF5E9C · pinkD #D62E70 ·
pinkL #FFA6C4 · gold #F5B93F · goldD #C98A1E · goldL #FFD884 · mint #A8E6C9 · teal #0D6C6C ·
tealD #064A4A · violet #5B3FD8 · violetD #321F8C · silver #C9CED6 · silverD #8D97A6 ·
chrome #E8EDF3 · sky #9CCBEA · skyD #5C93B8 · orange #F08A2E · ochre #D9A441 ·
terracotta #C96A45 · green #1FA36B · greenD #0B6B45 · black #0C0A09`
Plus cast constants: `SKIN #F0C9A4 · SKIN_D #D19A72 · SKIN_L #FFE2C4 · HAIR #171319 ·
HAIR_L #332C3E · BRASS #C68E2E · BRASS_L #FFE2A0`.

### 12.2 Flower palettes (`characters.js:10-17`)

| id | petal | petal2 | tip | centre | hair |
|---|---|---|---|---|---|
| `sun` (SOL) | `#F8E9CA` | `#EAD3A6` | `#E8452A` | `#F0C9A4` | `#171319` |
| `daisy` | `#FBF4E6` | `#EADFC8` | `#F5B93F` | `#F0C9A4` | `#2B2430` |
| `poppy` | `#E8452A` | `#C6331C` | `#171310` | `#1A1518` | `#171310` |
| `tulip` | `#FF8FB4` | `#E86A96` | `#D62E70` | `#F0C9A4` | `#4A2B32` |
| `corn` | `#5570FF` | `#3D55D9` | `#203FD8` | `#DCE6FF` | `#22203A` |
| `mari` | `#F5B93F` | `#E09A22` | `#F08A2E` | `#F0C9A4` | `#3A2A20` |

Backing-dancer pairing: `PET = [daisy, poppy, tulip, corn, mari]` with
`PETCOL = [pink, blue, gold, green, orange]` used as the jacket colour, cream sleeve, blue skirt,
blue boot, `petals: 13–14`, `earrings: false`, `shadow: .8` (`act1.js:5-6`, `act2.js:5-6`).

### 12.3 The 51 scenes at a glance

`0.00 cold · 1.50 sparks · 5.90 circuits · 8.95 loss · 12.40 boss · 16.50 mugs · 17.90 chase ·
22.72 chorus1 · 24.36 foom · 26.18 chinese · 29.72 shoggoth · 33.40 eyes · 35.50 dance1 ·
38.50 gym · 41.36 singularity · 44.98 accel · 49.52 atoms · 52.80 cage · 58.94 chorus2 ·
60.52 basilisk · 62.52 nvda · 64.18 omega · 66.12 gpuplanet · 69.18 vault · 73.80 chair ·
74.46 mlp · 77.60 museum · 81.24 canyon · 84.84 cdr · 89.34 gato · 95.20 clips · 98.80 pto ·
102.46 fuse · 105.40 jazz · 109.40 trust · 111.40 tower · 113.38 disobey · 115.08 chinchilla ·
117.02 fences · 118.84 gpus · 120.92 rlhf · 124.24 redalert · 126.20 loom · 128.00 masked ·
129.90 recursive · 131.90 ilya · 135.40 breath · 137.02 reveal · 140.68 curtain · 146.00
finaldance · 151.00 desk`

### 12.4 One-line answer

**Reproduce the joints, the brads, the tapered limbs, the flower-halo head stack, the torn-paper
floor and the palette roles — and add the four things the source is missing: a reset camera, hand
anchors, squash/walk/mood, and a pose vocabulary every character is forced to honour. Everything
else in this film is one story's choice.**
