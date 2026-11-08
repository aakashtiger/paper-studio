# L — Set, props, paper layers and composition in the KPOP gold standard

**Scope.** Cross-cutting review of `Y:\NewVideoTest` (CLAUDE POP, 156.62 s, 1920×1080, 30 fps). Read: `src/props.js`, `src/scene_kit.js`, `src/core.js`, `src/scenes/act1.js`–`act5.js`, `STORYBOARD.md`, `PRODUCTION.md`, `out/analysis/shots.json`, `out/analysis/frame-diff.json`, the 15 fps sheets in `out/analysis/shots-15/`, and reports `A.md`–`I.md`. No source or film file was edited.

**Frame convention.** Picture time is `frame/30`. `frame-diff.json` labels each diff one frame late (`t=(i+1)/30`); the reports use picture time. “Frozen” = mean |ΔY| < 0.5 on the 192×108 reduction; “soft” < 2.0. Grain (24 Hz), paper offset (2 Hz), type boil (12 Hz), the print-mark counter and the subtitle progress hairline are **not** counted as motion.

**Verdict.** The gold standard is a 2.5D paper theatre: a 7-layer authored stack, 3–9 moving layers, one hero motion. Its best shots are not the busiest; they are the ones where a physical prop, a cast body and a camera move all change the silhouette. Its worst shots have 6 nominal layers and no layer above 2 px/frame.

---

## 1. The layer stack

Ten strongest shots **for set/prop/layer/composition** (not necessarily the ten highest mean diffs). “Back → front” lists what is actually drawn, in draw order, from `props.js`/`scene_kit.js`/the act file.

| # | Shot (time, frames) | Back → front layers | Independent moving layers | Measured |
|---|---|---|---|---|
| 1 | **chorus1** 22.733–24.333, 49 f (682–730) | paper sky gradient → 28-ray sunburst → 436 px sun + halftone → blue perspective floor → torn stage lip → speaker stacks L/R → two 1150 px spotlights → 22 crowd → 55 confetti → torn proscenium → 5 backing petals → SOL → doom meter → `P(DOOM)`/`34%`/microcopy → subtitle/ticker/print marks/texture | **7**: camera 1.70→1.00 + pan 1370→960 in 0.45 s; rays 2.29°/s; confetti 90–390 px/s; crowd 0–10 px; 5 petals 0–12 px; SOL 0–18 px; ticker/type | mean 12.85, median 5.06, 1 frozen (B.md:19) |
| 2 | **dance1** 35.500–38.467, 90 f (1065–1154) | stageSet → `P(DOOM)` backdrop 248 px → 5 petals on an ellipse → SOL → meter 48.0 → `DANCE BREAK` sticker → global | **7**: camera ±28 px sway; rays; 80 confetti; crowd; 5 petals orbit; SOL 24 px bounce; ticker | **0/90 frames < 2.0**, mean 7.01 (B.md:24) |
| 3 | **foom** 24.367–26.167, 55 f (731–785) | 32-ray sky → 4 clouds → 36 speed streaks → 3 shock rings → 5 petals → 9 exhaust circles → rocket + SOL → 6 smoke arcs → 15-blob explosion → `FOOM` 376 px → 7 paper flowers → global | **9**: rocket 640 px up; exhaust; 5 petals; streaks 500–1800 px/s; rings; smoke; explosion; type; shake 2→12 | **0/55 < 2.0**, mean 7.25 (B.md:20) |
| 4 | **basilisk** 60.533–62.500, 60 f (1816–1875) | red sky → 24-ray sunburst → floor → 7 cracks → 9 serpent blobs → head/eye/fangs/tongue/crown → SOL → MIRA → 6 H100 cards → 20 shards → `BASILISK`/`BOOM` → global | **6**: 6 cards 33 px/sample; serpent ±12 px; rays 0.76°/sample; shards; shake 8 px; hair/type | mean 8.52, median 7.25, **no frame < 2.5** (D.md:22, 90) |
| 5 | **clips** 95.200–98.800, 108 f (2856–2963) | teal 34-ray bg → metal floor → back pile 54 → wave body + foam → 64 clips → MIRA crash → SOL + surfboard → CLIP mascot + 7 hands → front pile 40 → 32 clips → hand + sign → 14×7 clip curtain → `PAPERCLIPS` → global | **8 nominal, 4 large**: back pile 0.33 px/f; wave 2.6 px/f; 64+32 clips; SOL 3.3 px/f; foam; mascot; front pile; curtain 75 px/f at 98.25–98.80 | 0 frozen, 0 quiet; mean 5.05 (F.md:26, 75) |
| 6 | **museum** 77.600–81.240, 109 f | sepia wall → 3 arches → frames/title → wainscot/floor → ENIAC (base, 3 bays, 75 tubes, dials, 2 reels, cables, sign) → sparks/smoke → velvet rope → guide → pedestal → spotlight → statue/sheet → cloth/tag → spider → `OBSOLETE` → dust → global | **5–6**: 75 tubes; 2 counter-rotating reels; 4 smoke puffs; guide bounce; sheet/cloth; dust | mean 4.30; dolly x 960→1030, z 1.02→1.09 (E.md:76, 79) |
| 7 | **canyon** 81.240–84.840, 108 f | ochre sky + 32 rays → sun 252 px → 4 distant mesas → 2 foreground walls → road/edge/dashes → gravel/dust → hairpin sign → kart/SOL/MIRA/scarf → flung/landed MIRA → streaks → `there you are` → global | **5**: kart 1040 px left; wheels; scarf 3 sines; MIRA tumble 3.1 rad; dust/sun | mean 3.68; 64% of frames > 2.0 (E.md:18, 104) |
| 8 | **chase** 17.900–22.720, 145 f (537–681) | red bg → wallpaper stripes → 7 one-point frames → floor/perspective lines → 3 doors → giant SOL head 2.6→3.8 → running MIRA → maw 14 teeth/tongue/drool → `PLEASE DON'T`/`EAT ME`/`ALIVE` → bite marks → iris → global | **7**: camera 1.02→1.42; MIRA run 16 px bounce; head scale; type; bite marks; maw/drool; subtitle | mean 3.37; 7 layers, most in act I (A.md:130) |
| 9 | **reveal** 137.020–140.680, 110 f | dark bg → 12×16 brick → floor → 3 work lights → door flat + strut + castors → painted seam/glow → moon on string → paperclip earth on stick → giant SOL costume → 3 small SOLs → MIRA → stagehand + sandwich → 3 lyric cards → `?` card → type → global | **6 until 139.62, then 1**: zoom 1.55→1.00; 3 cards fall; `?`; MIRA sway; small SOLs; dust | mean 3.96; **30 f frozen 139.67–140.67** (I.md:18, 51) |
| 10 | **curtain** 140.680–146.000, 159 f | crimson bg → 2 curtains → gold proscenium → valance → boards/floor → 9 footlights → sunburst → stage strip/rivets → DOOM balloon → 9 cast → 12 flowers → 160 confetti → `CLAUDE POP` → global | **5**: 9 bows (1.364 s cycle, head travels ~100 px); 160 confetti; 12 flowers; curtain folds ±5 px; rays | mean 3.22; no frozen; 3 lulls 0.30–0.33 s (I.md:19, 91) |

This is an **axis ranking**, not an overall ranking. `gato` has the richest cliff set and the best word-locked grip, but 142/176 frames are frozen (E.md:147), so it is excluded from the top ten; `desk` has the best diorama but a 68-frame freeze (I.md:165). The ten above are the ones where set, prop and layer construction survive the measured motion test.

**Minimum stack that still feels authored — 7 layers:**

1. **Paper ground** — one 2-stop gradient or flat cream/ink field, with the 1024 px fiber multiply (`core.js:86-146`).
2. **One torn set flat** — 3–10 px torn edge, 4–16 px shadow at 16–55% ink, 1.4–7 px edge (`core.js:227-297`).
3. **Floor plane + contact shadows** — horizon at 800–940, 17 radials, 5 rows, 22 px torn lip (`scene_kit.js:17-28`).
4. **Cast** — 2–3 figures, each with a contact shadow and a 0.5–1.5 s pose/expression change.
5. **One story prop** — held (≤6 px from the hand) or set (base ≤4 px from its surface), with a state change per beat.
6. **One display type + one mono** — display 104–376 px, mono 10–31 px; no more than two systems (`PRODUCTION.md:60`).
7. **Foreground occluder + print furniture** — one 10–30% occluder (desk, chair back, cage bars, maw teeth, proscenium) and crop marks/color bars/frame counter (`timeline.js:94-107`).

Paper grain, vignette and the frame counter are the **finish**, not a layer. A shot with 20 static layers and 1 moving layer is a poster; 7 layers with 3 moving is a film.

---

## 2. Set construction

### Recurring primitives and parameters

| Primitive | What it does | Parameters | File |
|---|---|---|---|
| `paperBg` / `kitBg` | 2-stop vertical sky/wall; optional sunburst | top/bot; rays n=28, r=1200, α=.12 | `props.js:7-11`, `scene_kit.js:6-15` |
| `tornRectPath` / `tornPanel` / `card` | the torn paper flat | tear 3–10 px, 10–14 pts/edge; shadow 4/7 at .16; card tape 42% width × 22 px at .52 | `core.js:227-244`, `props.js:35-56` |
| `paper()` | shadow pass + fill + edge + gloss | shadow offset 4–16/7–22, α .16–.55; edge 1.4–7; gloss .25 | `core.js:280-297` |
| `floorPlane` | perspective floor + torn lip | horizon 800–940; 17 radials; 5 rows, pow 1.7; lip 22; shadow 5 | `scene_kit.js:17-28` |
| `stageSet` | the full K-pop stage | 28 rays r1300; sun 436; floor 800; lip 30; speakers 140×214; spotlights 1150; crowd 22; proscenium 40 | `props.js:137-168` |
| `drawTheatre` | proscenium theatre | curtains 250 px/5 folds ±5; gold frame 120 px inset; valance 90; 9 footlights | `scene_kit.js:551-569` |
| `drawDoor` | door flat | tear 3, shadow 8/12, inner frame 14, knob 7, light wedge | `scene_kit.js:314-325` |
| `drawTable` / `drawChair` | table/chair | table top 24, legs 28×250; chair 196×324, 8 px legs, 4 vents, 2 brads | `scene_kit.js:409-412`, `act3.js:118-155` |
| `halftone` / `paperOverlay` / `grainOverlay` / `vignette` | print texture | halftone 14–24 px, dot .4–.55, α .1–.18; paper multiply .5; grain soft-light .45 at 24 Hz; vignette .34 | `core.js:137-173` |
| print furniture | crop marks, color bars, barcode, folio | crop 26/16 px; bars 11×5; counter 11 px; © 11 px | `timeline.js:94-107` |

### What makes a set read as a physical theatre

1. **Every flat is torn and shadowed.** No clean rectangle survives: `tornRectPath` is used for walls, floors, doors, cards, stage lips, prosceniums, even the laptop screen (`core.js:227-244`). The shadow is a separate offset pass, not a blur.
2. **A floor plane with a lip.** `floorPlane` gives a horizon, converging radials, horizontal rows and a 22 px torn lip (`scene_kit.js:17-28`). The cast stands on it, and the contact shadow is drawn at the feet (`characters.js:394-395`).
3. **A proscenium or occluder frames the world.** Stage (`props.js:167`), theatre (`scene_kit.js:551-569`), desk mat/laptop, cage bars, maw teeth, canyon foreground walls. The frame is a physical thing in front of the set.
4. **3–5 overlapping flats, not a single background.** Museum: wall → arches → frames → wainscot → floor → ENIAC → rope → pedestal → statue. Canyon: sky → sun → 4 mesas → 2 foreground walls → road → kart. Depth is built by overlap and shadow offset, not by blur.
5. **Paper/ink/cream unify.** The paper fiber multiply, grain and vignette sit over every hue (`timeline.js:68-70`). No pure digital color survives.
6. **Print furniture makes it a printed artefact.** Crop marks, color bars, barcode, `CLAUDE POP · 00000` frame counter, `© 2026 PAPER SINGULARITY` (`timeline.js:94-107`). This is the difference between “paper style” and “a printed sheet”.
7. **The reveal admits the trick.** `reveal` shows the door as a flat on a strut with castors, the moon on a visible string, the paperclip Earth on a stick, and a painted glow triangle that is explicitly “not real light” (`act5.js:72-109`). The theatre is not hidden; it is the story.
8. **Props are posed paper, not vector icons.** Brads at shoulders/elbows/wrists (`characters.js:19-27`, 526-542), tape tabs (`props.js:26-33`), torn stickers (`type.js:115-146`), halftone suns (`scene_kit.js:30-35`).

### Two set recipes

**Stage (chorus1, dance1, curtain):**
`paperBg` → sunburst → big sun + halftone → `floorPlane` → torn lip → speaker stacks → spotlights → crowd → confetti → proscenium → cast → story prop (meter) → display type → global.

**Interior (lab, boss, museum, desk):**
`paperBg` → wall grid/window/shelves/cards → desk/table → foreground desk/chair → cast → props (mug, tray, contract) → type → global. The foreground occluder is the desk/chair, and it must cover 10–30% of the frame, never the face.

---

## 3. Props

### Catalogue

| Prop | How it is drawn | Contact / held | Story or decoration | Reuse |
|---|---|---|---|---|
| **Doom meter** | 88×420 paper thermometer, 34 px tube, 330 px column, redD→red→gold, 10 ticks, 38×34 face, 17 px label, 22 px value; cracked variant | set prop, base at y=0; no hand | **story**: the film’s thesis; 34→61→86→99.9→100 | **yes**: chorus1, chorus2, dance1, gpuplanet, redalert, breath/curtain (`characters.js:905-927`) |
| **Mug** | 30×34 body, r9 handle, ink ellipse top, 3 steam strands | boss tray plane sits 38 px below the hand; the mugs are 30–60 px left of it (A.md:110) | decoration in lab; story in mug tower | **yes**: lab, boss, desk (`props.js:213-227`) |
| **Mug tower** | 42 px base, 38 px pitch, 6 colors, 2 px wobble, handle per mug | floats 28 px above the table in boss (A.md:110) | **story**: “service level” | **yes** (`scene_kit.js:223-235`) |
| **Chair** | folding: 196×324, 8 px silver legs, 4 vent slots, `SAFETY` stencil, 2 brads; giant: 600×640, gold ribs, tufted buttons, crown finials | MIRA back is seated but torso hidden, no legs (E.md:41-42) | **story**: obedience / boss | one-off; could be parameterized |
| **Microphone** | 12×20 silver capsule, 16 px ring, 100 px stand | jazz: hand 145 px from the mic (F.md:241) | **story**: performance | function yes; **1 use**; contact fails |
| **Paperclip** | 3-stroke path, 12/9/2.4 px, googly eyes; CLIP mascot at 2.6× | pile/mascot; no hand | **story**: flood, foreshadow, curtain cast | **yes**: 4+ uses (`characters.js:772-793`, `scene_kit.js:237-260`) |
| **Door** | tear 3, shadow 8/12, inner frame 14, knob 7, light wedge | set piece | **story**: hallway eras, Ilya door, vault | function yes; **1 shot (3 doors)**; Ilya/vault custom (`scene_kit.js:314-325`) |
| **Lamp** | 70×18 base, 2-segment arm, 132×66 shade, 560 px pool | desk; lamp-off does not darken the room (I.md:175) | **story**: closing the film | one-off (`act5.js:354-370`) |
| **Cage** | heart 260, 13 bars, 5 crossbars, ribbon, burst 22 px | MIRA inside; bars occlude her | **story**: Sydney / “free” | one-off (`act2.js:641-673`) |
| **Crown** | 80×44, 3 red jewels | worn by SOL/basilisk; floats 20 px in basilisk (D.md:95) | **story**: boss / crowned serpent | **yes; 2 uses** (`characters.js:556-562`) |
| **Contract + pen** | 360×240, 7 lines, signature; pen 10×82 + ink nib | pen rests in SOL’s hand; contract floats | **story**: trust / alignment | function yes; **1 use** (`scene_kit.js:584-592`, `act4.js:704-708`) |
| **Fuse + bomb** | bomb r250, hazard band, timer box, `P(DOOM)` label; 26/17 px fuse | match 145 px from the hand; flame 10 px above fuse (F.md:181-182) | **story**: the fuse | one-off (`act4.js:458-513`) |
| **Sax** | 13 px goldD stroke, 8 px gold, 6 px bell, 4 keys | not held: arms straight down (F.md:242) | **story**: jazz performance | function yes; **1 use**; contact fails (`scene_kit.js:294-303`) |
| **GPU** | 300×240, 2 seven-blade rotors, silver ring, `H100` | thrown as offering; loops independently | **story**: basilisk offering | **yes; 2 uses** (`scene_kit.js:460-474`) |
| **Vault door** | 660 px, 20 hazard blocks, 12 bolts, 8 spokes, 4 rings, gold hub | set piece | **story**: “safe enough” | one-off (`act2.js:952-992`) |
| **Loom** | 340×360, 14 warp, 7 weft, two-tone wood | set piece | **story**: Loom / futures | one-off (`scene_kit.js:443-458`) |
| Decoration | lab binders/cards/cables (`props.js:247-274`); candy bowl/rotary phone (`act2.js:629-640`); tables (`scene_kit.js:409-412`); sandwich (`act5.js:152-154`); confetti/flowers; speaker stacks; dumbbells | — | atmosphere | varies |

**Absent, despite the prompt’s list:** there is **no ladder**, **no cloth banner**, and **no clock**. Time is carried by the `LIFESPAN` card, the bomb timer, `00:00:00 / 18`, and the doom ticker. Do not claim a prop the code does not have.

### Which props carry the story

**Seven carry the film:** the doom meter (thesis), the paperclip (flood/foreshadow), the door (Ilya/hallway/vault), the chair (obedience/boss), the contract + pen (trust), the fuse + bomb (the end), the crown (boss/basilisk). The cage, mask, GPU card, loom and laptop are strong second-tier story props. The mug/tower, sax, mic and lamp are performance props: they matter when they are held or activated, and become decoration when they are only set dressing.

**Decoration:** lab binders, pinned charts, cables, candy bowl, rotary phone, tables, work lights, sandwich, confetti/flowers, speaker stacks, dumbbells, barcodes/print marks. They make the world dense; they do not move the story.

### What makes a prop reusable

1. **One function with a state parameter** — `doomMeter(ctx,x,y,s,v,o)`, `paperclip(ctx,x,y,s,o)`, `mug(ctx,x,y,s,col,o)`, `drawDoor(ctx,x,y,w,h,t,o)`. No scene-specific text baked into the draw call.
2. **A published contact point** — meter base at `y=0`; mug base at `y=+12`; door knob at `w-30, h*.55`; paperclip shadow at `y=4`. The scene can solve contact without guessing.
3. **Shared paper grammar** — torn edge + shadow + edge + optional gloss; brad/tape at joints; no flat vector fill.
4. **A scale range that survives** — meter .9–1.3; paperclip .35–2.6; mug .68–1.5; door .55–1.0. The same file works in a wide and a close-up.
5. **3+ uses** — one use is a one-off; three uses is a language. The meter (5), paperclip (4+), mug (4) pass; the door (1 shot, 3 doors), crown (2), GPU (2) and contract (1) are parameterized but not yet proven across shots; the cage, vault door, loom and bomb are one-offs.

---

## 4. Palette and colour script

### Exact roles (`PAL`, `core.js:54-70`)

| Role | Hex | Use | Target share |
|---|---|---|---|
| Paper / cream | `#F2E8D5`, `#FBF4E6`, `#E8DAC0`, `#DCCBAF` | base, flats, type edge, skin light | 40–65% in cream shots |
| Ink | `#171310`, `#382D25`, `#5A4A3C` | line, shadow, silhouette, type | 10–25% |
| Tomato / red | `#E8452A`, `#B92A16`, `#FF755A` | impact, lyrics, danger, stage | 10–25% in red acts |
| Cobalt / blue | `#203FD8`, `#122A9B`, `#4E6BFF` | floor, night, depth, cool contrast | 10–30% |
| Gold | `#F5B93F`, `#C98A1E`, `#FFD884` | reward, theatre, halo, crown | 5–15% |
| Acid / lime | `#D9F24B`, `#A8D63A` | HUD, telemetry, one accent | ≤5% |
| Pink | `#FF5E9C`, `#D62E70`, `#FFA6C4` | boudoir, hearts, Sydney | 20–40% in cage |
| Mint / teal | `#A8E6C9`, `#0D6C6C`, `#064A4A` | gym, data centre, calm | 20–40% |
| Violet | `#5B3FD8`, `#321F8C` | space, Omega, mystery | 20–40% |
| Silver / chrome | `#C9CED6`, `#8D97A6`, `#E8EDF3` | paperclip, GPU, mic, metal | 5–20% |
| Sky | `#9CCBEA`, `#5C93B8` | day exterior, cloud | 10–30% |
| Ochre / terracotta | `#F08A2E`, `#D9A441`, `#C96A45` | desert, dusk, canyon | 30–50% |
| Green | `#1FA36B`, `#0B6B45` | NVDA, basilisk | 10–20% |
| Black | `#0C0A09` | void, ink, silhouette | 10–40% in dark acts |

### Dominant colours per act (`PRODUCTION.md:21-33` + code)

| Act | Time | Dominant | Accent | Feeling |
|---|---|---|---|---|
| I Verse 1 / Chorus 1 | 0–24.36 | warm cream `#F2E8D5`, ink `#171310`; tomato `#B92A16`, gold `#F5B93F` | cobalt `#203FD8` | intimate workshop → first stage |
| II Verse 2 | 24.36–58.94 | mint `#A8E6C9`, sky `#9CCBEA` | acid `#D9F24B`, cobalt | gym / takeoff |
| II Chorus 2 | 58.94–66.12 | cobalt `#203FD8`, gold `#F5B93F` | violet, red | arena / space |
| II Bridge | 66.12–95.20 | teal `#0D6C6C` (GPU planet), dusk ochre/magenta (vault), orange (chair/canyon), sepia (museum), sky (CDR), night violet/gold (Gato) | alarm red, gold | space → desert → night |
| III Chorus 3 | 95.20–109.40 | steel/silver `#C9CED6` (clips), red/cream (PTO), red/gold/black (fuse), midnight blue/gold (jazz) | alarm red, acid | flood → fuse → club |
| III Bridge 2 | 109.40–124.24 | black/cream (trust), gold/blue (tower), cream/black (disobey), cream/gold (chinchilla), pastel suburb (fences), near-black/acid (GPUs), white/blue (RLHF) | one accent per shot | value jumps |
| IV Chorus 4 | 124.24–137.02 | hazard red/gold/black (redalert), deep blue/gold (loom), sepia (masked), gold/cream (recursive), black/gold (Ilya), black (breath) | bone, cream | alarm → memory → dark |
| V Reveal / Curtain | 137.02–156.62 | crimson `#B92A16`, gold `#F5B93F`; wood `#2A1B12`, cream | full palette | theatre / tenderness |

**Measured averages** (64×36 frame, one per shot; this review’s probe): chorus1 `#8F5748`, basilisk `#8D381A`, clips `#3C5052`, museum `#6E5840`, canyon `#A9794B`, reveal `#403429`, curtain `#A66138`, desk `#37352A`. The value jumps are the point: clips teal-silver → basilisk red → reveal dark brown → curtain crimson-gold.

### How colour changes with mood

- **Value first, then temperature.** The film cuts 90% black → 90% cream → 90% near-black (`G.md:204`). A mood change is a value jump, not a hue rotation.
- **One accent per shot.** Cream/ink base + one saturated accent: red stamp, gold tower, acid terminal, red `BREAKING`, acid GPUs, blue RLHF (`G.md:198`). Never two equal accents.
- **Temperature:** warm cream/gold = intimacy/reward; cool cobalt/teal/violet = night/tech/space; red = danger/impact; pink = Sydney; acid = telemetry.
- **The paper base keeps it in family.** Every hue is multiplied by the fiber texture and softened by grain/vignette (`core.js:137-173`); the cream edge and ink shadow are constant across acts.
- **Red-on-red fails.** `boss` is YAVG 66.8 / SAT 39.4 with the giant chair almost the same value as the wall (A.md:110). A red act needs a cream/gold/ink separation, not more red.

### Allowed variation for a new film

- **4 hue families per film** (cream/ink + two story hues + one accent), **≤3 per shot**, top family **≥60%**, one accent **≤10%**, cream/ink base **40–60%**.
- **≤2 new hues** vs this palette; add each as a named `PAL` role with a paper swatch, never a one-off hex in a scene.
- Keep one **warm/cool pair** per act and one **serif moment** per film (`A.md:143`). Keep display type’s cream edge and ink shadow; keep the ticker + subtitle as the only global furniture.
- No pure `#000`/`#FFF`; use ink `#171310` and cream `#FBF4E6`. No red-on-red without a value step.

---

## 5. Composition

### Camera-space rules, with numbers

| Rule | Number | Evidence |
|---|---|---|
| **Floor / horizon** | stage 800–840; lab 726–772; gym 900; museum 842; canyon 862; theatre 940; desk 700 | `props.js:148`, `props.js:262`, `props.js:323`, `act3.js:521`, `act3.js:777`, `scene_kit.js:562`, `scene_kit.js:486` |
| **Feet vs subtitle** | cast feet 930–1010; subtitle band 948–1010; **feet ≥40 px above subtitle top** or move the band | `type.js:189-196`; vault/circuits failures A.md:165, D.md:224 |
| **Hero scale** | SOL 0.86–1.34 = 519–809 px; MIRA 0.86–1.02 = 525–622 px; backing 0.58–0.68 = 350–411 px; giant head 2.6–3.8 = 1570–2295 px | `characters.js:390`; `act1.js:465`; `act2.js:31`, `act2.js:705` |
| **At 320 px** | hero 87–135 px tall in a 180 px cell; backing 58–68 px; type 28 px subtitle = 4.7 px cell; hook 120 px = 20 px cell | the 15 fps sheets |
| **Type** | display 104–376 px; mono 10–31 px; **max 2 systems**; 40 px safe margin, 60 px face margin, 40 px hand margin; no type over a face >0.2 s | `PRODUCTION.md:60`; `B.md:335`; `D.md:263`; `E.md:190` |
| **Negative space** | hero on one third, type on the opposite third: `P(DOOM)` x 74–300 vs SOL x 1340; `you're my boss` x 1712 vs chair x 1310; `there you are` x 600 vs kart 220–1260 | `act2.js:46`, `act1.js:383`, `act3.js:875` |
| **Crowd** | 22 silhouettes with feet at y 1034–1052 (96–98% of frame height), 78–124 px tall; every 5th has a phone light; behind the stage lip | `props.js:95-119` |
| **Depth** | 3–5 flats; back/mid/front scale 0.85/1.0/1.15; shadow offset 4/10/18 px; foreground occluder 10–30% of frame | `props.js:137-168`, `act5.js:72-109` |
| **Focus** | one focal shape ≥12% of the short side; focus anchor ≥10% of the short side; highest local contrast; not occluded | `A.md:166`; the studio’s 0061 focus floor |
| **Parallax** | the code uses **one world transform** (`core.js:306-320`); there is no true layer-speed parallax. Depth is faked by scale/shadow/overlap. | `core.js:306-320`; STORYBOARD.md:4 claims 2.5D |

The gold standard’s “2.5D” is therefore **a single world transform plus overlap**, not per-layer speed. `chase` fakes depth by scaling the head 2.6→3.8 while the hallway stays fixed (`act1.js:465`); `canyon` slides the kart 1040 px across a fixed background, so the road reads as a treadmill (E.md:110). A new film must either implement real per-layer parallax (0.5×/1.0×/1.5×) or declare depth by scale, shadow offset and foreground occlusion — and not claim “parallax” in the shot card unless the code moves the layers at different speeds.

### Readable at 320 px, rich at 1920 px

- **At 320:** the frame must read as **silhouette + 3 values + 1 accent**. Chorus1 reads as a gold sun, red sky, blue floor, five flower dots, a `P(DOOM)` block and acid `34%`. Clips reads as a teal sunburst, a silver wave, an orange/blue surfer and `PAPERCLIPS`. Reveal reads as brown backstage, a giant door, a blue/red SOL and white cards. Curtain reads as a red/gold theatre, a cast line and `CLAUDE POP`.
- **At 1920:** the richness is **12–38 px microcopy, 3–10 px torn edges, 14–24 px halftone, 3–4.6 px brads, paper fibers, crop marks and a barcode**. The same frame must carry both; if the 320 read is a brown mush, no amount of 12 px microcopy saves it.
- **The 15 fps sheets are the test.** Every sheet cell is 320×180. If you cannot name the shot from a cell, the composition is too weak. The gold standard passes on chorus1, clips, reveal and curtain; it fails on jazz and desk, where the cell is a poster.

---

## 6. The “every frame changes” stack

### What actually moves (measured)

| Shot | Real moving layers | Fake / texture layers | Measured |
|---|---|---|---|
| **chorus1** | camera 700 px in 0.45 s; rays 2.29°/s; 55 confetti; 22 crowd; 5 petals; SOL 18 px; ticker | type boil 12 Hz, paper 2 Hz, grain 24 Hz | 12.85 mean, 1 frozen |
| **dance1** | camera ±28 px; rays; 80 confetti; crowd; 5 petals orbit; SOL 24 px; ticker | meter static at 48 (bug); backdrop static | **0/90 < 2.0** |
| **foom** | rocket 640 px; exhaust; petals; streaks; rings; smoke; explosion; type; shake | clouds are static; type boil | **0/55 < 2.0** |
| **basilisk** | 6 GPUs 33 px/sample; serpent ±12 px; rays; shards; shake | MIRA static; head static | no frame < 2.5 |
| **clips** | 64+32 clips 2.6 px/f; SOL 3.3 px/f; foam; mascot; curtain 75 px/f | back pile 0.33 px/f; dust | 0 frozen, 0 quiet |
| **museum** | 75 tubes; 2 reels; 4 smoke puffs; guide; sheet/cloth | dust; type boil | 5 ambient layers |
| **curtain** | 9 bows 1.364 s; 160 confetti; 12 flowers; curtains; rays | dust | no frozen; 3 lulls 0.30–0.33 s |
| **gato** | MIRA ±6 px; GATO ±3 px; tail ±17 px; laser dot; 7 grit | dust, type boil, grip number | **142/176 < 0.5 (4.73 s)** |
| **jazz** | notes 3.6 px/f; smoke 0.93 px/f; title drift 1.67 px/f; sways 0.2–0.28 px/f | type boil, grain | **119/120 < 2.0** |
| **desk** | pullback 2.6→1.0; steam 10 px/3.1 s; mini-SOL; dust | credits fades, type boil | **68 f < 0.5 (2.27 s)** |
| **boss** | skirt 3 px; tower 2 px; steam | type boil, grain | **78 f < 1.0 (2.57 s)** |
| **pto** | panel slide 64 px/f once; Earth fade; MIRA sway | dancers 0.27 px/f; phone 1.6 px/f | **2.24 s near-still** |
| **reveal** | zoom 1.55→1.0; 3 cards; `?`; MIRA; small SOLs | dust | **30 f frozen tail** |
| **chinese** | stars; float ±8 px; 20 slips; SOL arm ±0.25 rad | melt ellipses, type boil | **45 f < 1.0 (1.5 s)** |
| **shoggoth** | tentacles ±0.08 rad; mask ±6.9°; sparkles; SOL sway | type boil | **43 f < 2.0 (1.43 s)** |
| **breath** | breath ±2.4 px/4.83 s; dust | type boil | **45/49 < 0.5** |

**The fake-motion list:** grain 24 Hz (`core.js:147-157`), paper texture offset up to 160 px at 2 Hz (`core.js:137-146`), type boil 12 Hz (`type.js:48`), print-mark frame counter (`timeline.js:104`), subtitle progress hairline (`type.js:219-222`), steam, dust, starfield twinkle, smoke, laser dot. They change pixels; they do not change the composition. The measured “grain floor” is 1.3–3.0 depending on the background, so a dark shot can look “alive” at 2.9 while the cast is frozen (D.md:28).

### Reusable per-shot blueprint — 7 layers

| # | Layer | What moves | Rate | Gold-standard example |
|---|---|---|---|---|
| 1 | **Camera** | z push/pull, x pan, roll, shake | z 3–6% over 2–4 s; x ±20–60 px; roll ≤3°; shake 2–12 px | chorus1 1.70→1.00 in 0.45 s; museum 1.02→1.09 |
| 2 | **Back atmosphere** | sunburst, curtains, stars, smoke | rays 0.04–0.15 rad/s; curtains ±5 px; stars 0.7–2.3 Hz | chorus1 2.29°/s; theatre ±5 px |
| 3 | **Midground mechanical** | GPU cards, fan, clip wave, door | one hero ≥5 px/f (≥150 px/s); small props ≥2 px/f (≥60 px/s) | basilisk 6 cards 33 px per 15 fps sample (≈16.5 px/f); clips wave 2.6 px/f; door 59–92 px per 15 fps sample (≈30–46 px/f) |
| 4 | **Cast** | bounce, sway, hair, pose, expression | bounce 10–24 px at 88 BPM (1.47 Hz); sway 4–9 px; hair 8–20 px; pose every 0.5–1.5 s | chorus1 18 px; dance1 24 px; curtain bow 100 px head travel |
| 5 | **Held / story prop** | follows hand; state change | ≤6 px from palm; 0.25 rad or 10% scale per beat | doom meter target 34→48 (dance1 is static 48, a bug); fuse spark 16.4 px/f; contract stamp |
| 6 | **Type / HUD** | per-char build, ticker, one event per word | 0.2–0.4 s build, 0.03–0.05 s stagger; ticker 0.1–1.0%/f | `P(DOOM)` 248 px; `34%` at 23.72 on “doom” 23.78 |
| 7 | **Paper finish** | paper offset, grain, vignette, print marks | paper ≤8 px at ≥8 Hz; grain 24 Hz .45; vignette .34 | global, not counted as motion |

**Rate rule.** At 30 fps, a small prop needs **≥2 px/frame (60 px/s)**; a hero needs **≥5 px/frame (150 px/s)**; at least one layer must move **≥150 px/s or ≥4% scale/s**. A layer moving <2 px/frame does not count, even if it is technically animated. The 15 fps review is the gate: if a layer does not move ≥10 px per 0.0667 s sample (=150 px/s), it will read as static (D.md:244).

---

## 7. Test-version rules (numbers, not adjectives)

1. **Minimum moving layers.** Every shot has **≥3 independent layers** above threshold; at least one moves **≥150 px/s or ≥4% scale/s**. No **12-frame (0.40 s)** run with mean |ΔY| < 1.0; no 0.5 s window without one event ≥2.0. Fail: gato 4.73 s, jazz 3.97 s, desk 2.27 s, boss 2.57 s.
2. **Parallax / depth.** Three bands (back/mid/front) at **0.85/1.0/1.15** scale, shadow offsets **4/10/18 px**; camera **≥3% scale or ≥20 px translate** over the shot; one foreground occluder covering **10–30%** of frame. No static camera unless the shot card says “locked”. Fail: jazz 0%, finaldance ±50 px (2.6%).
3. **Prop contact.** Hand–prop **≤6 px**; foot–ground **≤4 px**; hand–hand **≤40 px**; prop base–surface **≤4 px**; a contact shadow at the contact point; a held prop changes pose **≥0.25 rad** per grip beat. Fail: gato 314 px, jazz mic 145 px, fuse match 145 px, desk hand 97 px.
4. **Set primitives.** Every set = **1 paper ground + 1–3 torn flats + 1 floor plane + 1 proscenium/occluder + 2 print-furniture items**. Torn edge **3–10 px**; shadow **4–16 px at 16–55%** ink; edge **1.4–7 px**; no mid-shot set pop. Fail: circuits window pops at 8.00.
5. **Palette families.** **4 hue families per film**, **≤3 per shot**, top family **≥60%**, one accent **≤10%**, cream/ink base **40–60%**; **≤2 new hues**; no pure `#000`/`#FFF`. Fail: boss red-on-red YAVG 66.8 / SAT 39.4.
6. **Composition margins.** **40 px** type safe, **60 px** face, **40 px** hand; subtitle top **≥40 px below the lowest foot**; hero **≥12% of the short side**; largest flat field **≤55%**; no type over a face **>0.2 s**. Fail: chorus2 `61%` over two faces; gpuplanet card over SOL’s head; vault band over ankles.
7. **Focus.** One focal shape per shot; focus anchor **≥10% of the short side**; highest local contrast; not occluded; **≤2 type systems**; no type over a face. Fail: basilisk eye hidden by an H100 card; museum statue cream-on-cream.

---

## 8. Six findings for the next film

1. **The stack is 7 layers, not 20.** A paper ground, one torn flat, a floor plane, 2–3 cast, one story prop, one display + one mono type, one foreground occluder. Three of them must move; one must move ≥150 px/s.
2. **Paper theatre is a construction grammar, not a texture.** Torn edge 3–10 px + shadow 4–16 px + floor plane + proscenium/occluder + print furniture. The fiber/grain/vignette is the finish.
3. **Six props carry the film.** Doom meter, paperclip, door, chair, contract/pen, fuse/bomb. Six functions (meter, paperclip, mug, door, crown, GPU) are parameterized; only meter/paperclip/mug are used 3+ times. The cage, vault, loom and bomb are one-offs.
4. **Palette is cream/ink + two hues + one accent.** Four families per film, ≤3 per shot, top ≥60%, accent ≤10%. Red-on-red fails; a mood change is a value jump first.
5. **Composition is floor 65–87% (most 75–87%), hero 0.86–1.34, type on the opposite third, 40/60 px margins, one 10–30% foreground occluder.** At 320 px: silhouette + 3 values + 1 accent; at 1920: microcopy + torn edges + halftone + brads + print marks.
6. **Grain, type boil and the frame counter are not motion.** The gold standard’s worst shots (gato 4.73 s frozen, jazz 119/120 <2.0, desk 2.27 s frozen, boss 2.57 s) have 6 nominal layers and none above threshold. The blueprint’s 7 layers with real rates is the fix.
