# Paper K-pop - identity specification v1.3

**Status:** research specification, not implemented. No pack, score, renderer or check has been changed.
**Date:** 4 November 2026
**Revision:** v1.3 after four critic passes and three blind tests. The scope system separates the reference film (R), the format (T), the invariant (I), the film choice (F), the signed variant (V) and the forbidden (X). The machine file uses `filmBands` (not `bands`) so it cannot collide with the existing delta bands.
**Reference film:** `Y:\NewVideoTest\out\claude-pop.mp4` - 1920x1080, 30 fps, 4,699 frames, 156.63 s.
**Reference evidence:** `docs/research/identity/A-engine.md` ... `J-skills.md`, `I-frames.json`.
**Companion:** `docs/research/identity/kpop-identity.proposed.json` - a compact extension, not a second identity document.
**Critiques:** `critique-creative.md`, `critique-technical.md`, `critique-motion.md`, `critique-qa.md`, `critique-completeness.md`.

---

## 0. The one-page answer

Identity is not a list of things to copy. It is **a fixed grammar plus a declared space of variation**.

- **Fixed grammar (I):** the things that make a frame recognisably this channel - the paper medium, the 2.5D flat-layer camera, the palette roles and their shares, the hard registration shadow, the cast construction and performer archetype, the full-bleed illustrated field, the subject/field contrast, the scale rhythm, the poster type, the cut rhythm, the motif material, and the mix.
- **Declared variation (F):** the things a film must choose for itself - the story, the set family, the field colour script, the characters' names/species/costumes, the props, the motif selection, the camera sequence, the opening and closing, the text behaviour, the sound mode. The film **must** differ on twelve axes from the previous film; it may never differ on the invariants.
- **Hard bans (X):** the moves that break the channel - 3D/gloss/photo faces, soft shadows where the style is a hard cut, depth of field, dissolves, side bars, blue-on-blue, office-worker archetypes, a static shot with no creep or action, camera-only motion, text over a face, a lyric wall, a default sunflower/banner/lamp opener, the same opener or closer twice.

### The twelve invariants

| # | Invariant | K-pop value |
|---|---|---|
| 1 | Dimension | 2.5D layered flat paper; orthographic x/y/z/roll camera; no perspective, FOV, DOF or true parallax |
| 2 | Medium | Cut/torn paper on warm stock; visible fibre, halftone, ink contour, hard registration shadow, print furniture |
| 3 | Palette | 4-7 roles per frame, warm earth dominant, blue as accent, one accent rationed, never blue-on-blue |
| 4 | Field | Full-bleed illustrated world; no side bars; a different field colour per shot/act, not a cream plate |
| 5 | Cast | Paper-pop performer on a stage: bradded construction, ornament slot, star/chorus, entrance/exit |
| 6 | Placement | Subject in the central 30-75% of width, 13-92% of height, feet on the set floor, 3% of frame area |
| 7 | Contrast | Figure vs immediate surround >=20 luma in 75% of shots; local median >=35; figure is the detail |
| 8 | Camera | A 2D similarity move or a world move every shot; target 90%+ moving; push/pull dominant; 4-8 distinct moves; no run >2 |
| 9 | Edit | Median 2.4-3.2 s; chorus 1.6-2.2 s; hard cuts 80-90%; no dissolve; 30 s film 10-13 shots |
| 10 | Motion | Every shot has a character action; 1-3 actions; one authored paper event; no hold >0.4 s |
| 11 | Type | Anton/Archivo/Instrument Serif/DM Mono; poster hooks; one subtitle band; 8 words max; 2 systems max |
| 12 | Sound | Song-led or voice-led; -14 LUFS +/-1 / <=-1.5 dBTP; declared silence; cues bound to picture events |

### The twelve things that must change per film

1. **Story and structure** - a different spine, not the same act order.
2. **Set family** - at least one set family the previous film did not use.
3. **Field colour script** - a different sequence of field roles; no repeated field colour in the same position.
4. **Cast instance** - different names, faces, species, costume values; construction fixed.
5. **Motif set** - 3-5 motifs chosen from the library; not the same five as the last film.
6. **Camera sequence** - a different order of moves; opening and closing moves must differ.
7. **Text behaviour** - 2-3 behaviours chosen (stack, stamp, slide, fold, eaten, scatter); no repeated layout.
8. **Transitions** - a different act-boundary transition; no repeated iris/flash pattern.
9. **Opening** - a different first image; not the same cold open.
10. **Closing** - a different last image; not the same desk pullback or curtain.
11. **Sound mode** - song-led or voice-led; if the last film was one, choose the other or change the song/voice register.
12. **Signature shot** - one shot that exists only in this film, the poster frame.

### The K-pop numbers in one line

`1920x1080 / 30 fps / 2.5D paper / 4-7 roles / full-bleed field / subject 55% median height, 13-92% range / centroid x 0.55 / local 46.6 luma contrast / 90%+ moving camera target / 2.4-3.2 s median shot / 18-24 cuts per minute / 8 words / -14 LUFS / 180-190 wpm narrated or 90-100 wpm sung`.

---

## 0.1 Reference vs target - read this before using any number

The original film is the evidence, not the law. It contains real defects. The identity is the grammar the film was **trying** to use, with the defects removed.

| Kind | Meaning | Example |
|---|---|---|
| **R - reference** | observed in the reference film or its code; not a rule for a new film | 51 scenes, 156.6 s, 31 px subtitle at 16:9, -15.6 LUFS, 97.8 wpm sung, 27/51 `setCam` calls |
| **T - format** | owned by the deliverable (30/45/60 s, 16:9/9:16), not by the style | 30 s film -> 10-13 shots; 9:16 -> 14 px subtitle floor at 390 px |
| **I - invariant** | every film in this style must satisfy it | subject height 13-92%; no side bars; no blue-on-blue; hard cut default |
| **F - film choice** | the film picks inside a declared range | field script, motif set, camera sequence, set family |
| **V - variant** | allowed only when declared and signed | 3-plane parallax, squash, crash zoom to 8.0 |
| **X - forbidden** | never allowed | 3D, DOF, dissolve, office-worker lead |

**Reference defects - do not copy:**

- 24 of 51 scenes never call `setCam`; they inherit the previous camera (sticky `CAM`). This is a bug, not a grammar. The identity requires every shot to declare a camera or world move.
- The grain uses `Math.random`; it is not worker-safe. The identity requires a seeded grain.
- Hand anchors are re-derived from arm trigonometry in the scenes; the mic even uses the wrong shoulder y. The identity requires a hand anchor.
- `labSet`, `roadSet` and `spaceSet` are dead code while their shots hand-build different rooms. The identity requires a set function or a declared inline set.
- The storyboard has 54 cards, the code has 51 scenes. Three cards are sub-beats. This is a bookkeeping mismatch, not a style rule.
- Safe zones and the 28 px subtitle floor are declared but not enforced. The identity makes them checks.
- The source's 31 px subtitle is a 16:9 television scale. It is **not** a 9:16 phone scale. Do not compare them.

**What this means for the numbers:** `R` values are evidence and may be cited; they may not be used as a pass/fail band for a different format. `I` values are bands with a tolerance. If a band fails the reference film, the band is wrong; if a band passes the failing Uber film, the band is not a gap check. The acceptance test is in section 5.5.

---

## 1. How to read this specification

### 1.1 Scope codes

| Code | Meaning | Who chooses | Can a check refuse? |
|---|---|---|---|
| **I** | Invariant. Every film in this style must satisfy it. | The style owner | Yes |
| **F** | Film choice. The film picks a value inside a declared range. | The film's director | Yes, if outside the range |
| **T** | Format. The deliverable owns the value. | The format | Yes, if the format is wrong |
| **R** | Reference. Observed in the reference film; evidence, not a rule. | Nobody | No |
| **V** | Variant. Allowed only when the film declares it and the style owner signs it. | Director + owner | Yes, if undeclared |
| **X** | Forbidden. Never allowed in this style. | Nobody | Yes |

A parameter without a range is an invariant value. A parameter with a range is either F (the film chooses) or I-rule (the rule is fixed, the instance is chosen). Every value also has a **basis**: `code`, `film`, `crops`, `target`, `proposal`, `format`.

### 1.2 Units

- Time in seconds, frames at 30 fps (`frame = round(t * 30)`).
- Space in pixels at 1920x1080, z=1; percentages are of frame width/height.
- Colour in sRGB hex; palette distance in CIELAB delta-E (0-441 scale used by `style:measure`).
- Luma 0-255 legal video range; contrast is `YMAX - YMIN` per frame unless stated as local.
- Loudness LUFS integrated; true peak dBTP; cue level dBFS.

### 1.3 What identity is not

- It is not the story, the script, the song, the names or the dates. Those come from the brief.
- It is not a template. There is no mandatory sunflower, banner, lamp or opener.
- It is not a colour filter. A frame can be inside the global colour band and still fail identity (the Uber film proved it).
- It is not library membership. A new character is allowed if it is the same **archetype and construction**.
- It is not a copy of the reference's defects. Sticky cameras, unseeded grain and missing hand anchors are not style.

### 1.4 Dimension models - 2D, 2.5D, 3D

The identity must say which model it uses, because the camera, light, shadow and focus rules follow from it.

| Model | What it is | Camera | Depth | K-pop? |
|---|---|---|---|---|
| **2D flat** | One plane; no layers; no z | x/y only | None | No - too flat for the stage |
| **2.5D layered** | 5-11 flat paper layers; orthographic camera with x/y/z/roll | Similarity transform: translate, scale, rotate | Scale, overlap, layer order, hard shadow | **Yes - this is Paper K-pop** |
| **3D** | Modelled volume, perspective camera, physical light | FOV, dolly, orbit in 3D | Perspective, DOF, shadow maps | No - forbidden |

The source is **2.5D layered**, not 3D and not a single flat plane. The camera has `x`, `y`, `z` (scale), `roll` and `shake`; it has **no** FOV, perspective, DOF, parallax or physical light. Depth is carried by overlap, scale, cut edges and shadow offset. This distinction is the first identity parameter: a film that renders a perspective room or a focus pull is a different style.

---

## 2. The identity at a glance

| # | Axis | K-pop value | Scope | Basis |
|---|---|---|---|---|
| 1 | Dimension | 2.5D layered, orthographic, 5 planes | I | code |
| 2 | Medium | Cut/torn paper, fibre, halftone, ink, print marks | I | code |
| 3 | Palette | 4-7 roles; warm 40-90%; blue <=20%; one accent | I | film |
| 4 | Field | Full-bleed; no bars; per-shot field colour; 27% median share | I | film |
| 5 | Light | Flat print; registration shadow +6/+10 at .22, blur 0 | I | code |
| 6 | Edge | Ink contour 1.5-6 px; cut edge; no bevel | I | code/film |
| 7 | Composition | One focal shape; subject centred; 97% negative space | I | film |
| 8 | Subject scale | 13-92% height; p50 55%; three tiers per film | I | film |
| 9 | Subject placement | x 0.30-0.75; y 0.38-0.66; feet on the set floor | I | film |
| 10 | Cast archetype | Paper-pop performer; brads; ornament slot; 8 poses/14 faces | I | code |
| 11 | Cast appearance | 3-layer head; face plate; costume roles; no photo/fingers | I | code |
| 12 | Cast movement | 12 pose keys; 12 fps boil; overshoot; blink | I | code |
| 13 | Sets | 5-layer diorama; floor plane; horizon 780-900; sky device | I | code |
| 14 | Props | Paper + ink edge + shadow; hand anchor; size class | I | code |
| 15 | Motifs | 3-5 per film; 2-5 uses; no motif >40% shots | F | film |
| 16 | Camera model | 2D similarity; x/y/z/roll/shake; no FOV/DOF | I | code |
| 17 | Camera grammar | 90%+ moving target; push/pull 30-45%; short 4-6 moves, long 6-10; run <=2 | I | target |
| 18 | Camera travel | dz .03-.25; crash .5-3; pan 24-600 px; roll +/-7 deg | I/F | code |
| 19 | Edit | 2.4-3.2 s median; 18-24 cuts/min; chorus 1.6-2.2 | I | film |
| 20 | Shot distribution | 1-2 s 28-35%; 3-5 s 40-48%; <1 s 2-4%; >5 s 6-10% | I | film |
| 21 | Per-shot action | 1-3 actions; one hero; one authored paper event | I | target |
| 22 | Transitions | Hard cut 80-90%; designed 10-20%; no dissolve | I | film |
| 23 | Focus/depth | No DOF, blur or bokeh; depth by scale/overlap | I | code |
| 24 | Text | 2 systems; 8 words; 31 px at 16:9; poster hooks | I/T | film |
| 25 | Text behaviour | Enter on the word; stack/stamp/slide/fold/eaten/scatter | F | film |
| 26 | Interaction | Hand anchor; ground contact; type never over face | I | code |
| 27 | Sound | Song-led or voice-led; -14 LUFS; declared silence | I | code |
| 28 | Voice | 180-190 wpm narrated; 90-100 wpm sung | I/R | film |
| 29 | Tone | Sweet-sinister pop; cute-in-danger; one tender beat | I | film |
| 30 | Performance | A stage, a star, a chorus, a song/beat, an entrance and an exit | I | code |
| 31 | Opening/closing | Subject-specific; no default card; 4 openings/4 closings; frame story | F | film |
| 32 | Variation | 12 required differences; 12 invariants | I | product |
| 33 | Determinism | frame-index clock; seeded; worker-safe; camera reset | I | code |

---

## 3. Axis specifications

### 3.1 Envelope and dimension

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| canvas | 1920 x 1080 | px | I | code | score/render |
| aspect | 16:9; 9:16 re-stage | ratio | T | format | score |
| fps | 30 | fps | I | code | score/render |
| frame | `duration * fps` | frames | T | format | score |
| colour space | sRGB / bt709 | - | I | code | render |
| unit | px at z=1 | - | I | code | schema |
| dimension | `2.5d-layered` | enum | I | code | schema |
| projection | orthographic | enum | I | code | schema |
| planes | 5: bg, mid, character, fg, type | count | I | code | schema |
| camera axes | x, y, z, roll, shake | enum | I | code | schema |
| perspective | false | bool | X | code | schema |
| fov | false | bool | X | code | schema |
| dof | false | bool | X | code | schema |
| parallax | false in the source; 3-plane variant only if declared | bool | V | code | schema |
| duration formats | 30, 45, 60, 156.6 | s | T | format | score |
| encode | libx264 crf 15, slow, tune film, yuv420p; AAC 320k | - | I | code | render |

**Why:** the source camera is a 2D similarity transform. `CAM` holds `x`, `y`, `z`, `roll`, `shake`; the renderer applies `translate`, `scale`, `rotate` about a focus point. There is no FOV, no perspective matrix, no depth of field, no physical light. A 3D camera cannot reproduce the flat cut-paper stage; it produces a different style.

**Variant:** a film may declare `parallax: true` with three planes at 1.0 / 0.6 / 0.3 travel. This is a declared variant, not the default, and the style owner must sign it. The source itself does not move layers relative to each other; it moves the whole stage.

---

### 3.2 Medium and surface

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| paper base | `#F2E8D5` | hex | I | code | palette |
| paper 2 | `#E8DAC0` | hex | I | code | palette |
| paper 3 | `#DCCBAF` | hex | I | code | palette |
| ink | `#171310` | hex | I | code | palette |
| fibre sheet | 1024 x 1024 | px | I | code | render |
| mottles | 90, radius 40-230, alpha .035 | count/px | I | code | render |
| fibres | 4,200, length 2-24, width .4-1.3, alpha .05-.14 | count/px | I | code | render |
| specks | 1,500, size .7-2.5, alpha .06-.14 | count/px | I | code | render |
| grain | 512 px, alpha max 34, soft-light, 24 Hz, seeded | px/Hz | I | code | render |
| paper overlay | multiply, alpha .5, offset 0-159, 2 Hz | -/Hz | I | code | render |
| grain overlay | soft-light, alpha .45, offset 0-511, 24 Hz | -/Hz | I | code | render |
| halftone | 64 px tile, cell 14-24, dot .4-.55, alpha .11-.18, angle .2/.7 | px/ratio | I | code | render |
| vignette | strength .34, inner r 194.4, outer r 885.6 | ratio/px | I | code | render |
| torn edge | 3-10 px amplitude; 14 points long edge, 10 short; **accent only** | px/count | I | code | render |
| edge mode | cut edge default; torn edge <=10% of layers | rule | I | code | render |
| blob jitter | .06 | ratio | I | code | render |
| gloss | false | bool | X | code | schema |
| layer order | paper, bg, mid, character, fg, halftone, hud, type, fibre, grain, vignette | list | I | code | render |
| print margin | 26 px; corner marks 16 px at .22 | px | I | code | render |
| print furniture | 4 colour bars, timecode 30 fps, barcode/folio | - | I | code | render |

**Rules:**
- No pure white `#FFFFFF` or pure black `#000000`. Paper is warm; ink is near-black.
- Every mark is a cut, a tear, a printed edge or a halftone dot. No brush, no airbrush, no gradient mesh, no bevel, no gloss.
- The grain in the source is unseeded (`Math.random`), which is a determinism defect. The identity requires the grain seeded; the look is otherwise identical.
- Texture is a **surface**, not a filter over a photograph. The paper must be drawn as paper, not a JPEG overlay.
- The reference is a **flat printed card** with a clean cut edge, not a heavily torn collage. Use a torn edge as an accent (a strip, a poster, a reveal), not on every layer. The pack's fibre and grain are subtle; they should not turn the frame into a scrapbook.

---

### 3.3 Palette and colour script

#### Roles

| Role | Day stage | Night stage | Source name |
|---|---|---|---|
| paper | `#F2E8D5` | `#E8DAC0` | paper, paper2 |
| ink | `#171310` | `#0C0A09` | ink, black |
| red | `#E8452A` | `#B92A16` | red, redD |
| blue | `#203FD8` | `#122A9B` | blue, blueD |
| acid | `#D9F24B` | `#D9F24B` | acid, lime |
| accent | `#F5B93F` | `#FF5E9C` | gold, pink |

The source `PAL` has 38 named colours. The six pack roles are the **budget**; the extra colours are scene values mixed from them. The reference film's dominant measured colours are:

| Hex | Name | Where it dominates |
|---|---|---|
| `#EDAE3A` | marigold | sun, stage field, petals |
| `#CF4224` | tomato | red fields, stage, costumes |
| `#5B0D09` | oxblood | throne, dark red rooms |
| `#F3E7D1` | cream | paper stock, close-ups |
| `#1F3CC4` | cobalt | skirt, floor, arena sky |
| `#1C5648` | teal | lab, night interior |
| `#CCB490` | kraft | desk, cardboard, workshop |
| `#0C0805` | ink | voids, line, hair |

#### Shares (measured on 49 character shots; basis: film)

| Metric | p25 | p50 | p75 | p90 | Band | Scope |
|---|---|---|---|---|---|---|
| warm earth share (red, oxblood, orange, kraft, cream, gold, teal) | .24 | **.70** | .89 | .97 | .40-.90 | I |
| blue share | .00 | **.01** | .03 | .17 | <=.20 (median <=.05) | I |
| saturated share (S>.35, V>.15) | .17 | **.50** | .69 | .89 | .35-.70 | I |
| colour roles >=1% | 4 | **5** | 6 | 7 | 4-7 (long); 4-5 (short) | I/T |
| largest flat colour region | .07 | **.14** | .26 | .46 | .04-.46 | I |
| field colour share | .19 | **.27** | .41 | .57 | .18-.60 | I |
| frame mean luma | 53 | **91** | 147 | 180 | 75-130 | I |

#### Rules

1. **Field colour is chosen per shot or per act, not defaulted to cream.** The source uses 54 distinct field colours in 54 shots. Ink is the field in 20/54, kraft 9, orange 7, red 6, green 3, acid 2, pink 2, cream 2, blue 1, oxblood 1, teal 1.
2. **Blue is an accent, not a field.** A blue field is allowed only when the figure is red/cream and the local contrast is >=20. The reference's one blue field (arena, 46%) has a red/cream figure. **One act may be blue-dominant (up to 60%)** as a designed stage colour, but the figure must be warm and the local contrast >=20; the film-wide median blue share still stays <=.20.
3. **No blue-on-blue.** Fail if `figure-blue > .30` and `field hue 195-255` and `|deltaL| < 18`. The reference trips this in 1/49 shots for one frame; the Uber film trips it in 7/10 tiles and 25/30 frames.
4. **One accent per frame, at least two per film.** The accent is gold, acid or pink; it marks the payoff, not the background.
5. **Max 5 roles in a 30-60 s film; 4-7 in a long film.** More than 7 is a colour salad; fewer than 4 is a diagram. The pack's `maxColours: 4` is the default, not the ceiling; the identity allows a fifth role when the frame needs it, and the pack should be reconciled to one cap.
6. **The field reaches every edge.** No vertical side bars. A designed bar is allowed only if it is part of the set (a wall, a lighting falloff) and never a UI frame.

#### Colour script per act (F)

The film chooses a sequence of 3-5 field colours, one per act/beat. The sequence must:
- use at least two warm fields and at most one blue field;
- not repeat the same field colour in consecutive acts;
- move from intimate (cream/kraft/ink) to loud (tomato/marigold/cobalt) to resolve (cream/ink/gold) when the story is a rise-and-fall;
- declare the script in `score.paletteScript` (proposed), not leave it to the recipes.

#### Tone tension (I)

The palette is bright; the subject may be dark. The channel's signature is **sweet-sinister**: a warm, cute paper surface carrying a threat, a bad idea or a joke. Use one poison accent (acid or pink) at the threat, and keep the rest warm. No gore. No cynical grey. The character is sincere; the world is the joke.

---

### 3.4 Light and shadow

**Model: flat print, not a lit 3D scene.** The paper is a flat colour; there is no directional key, no ambient fill, no gradient. The only "light" is the registration shadow: a hard copy of the card, offset down-right, with no blur. This is why the style reads as print, not as a puppet theatre under a lamp.

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| light model | flat print; no key, no ambient | enum | I | code | schema |
| shadow direction | down-right | vector | I | code | schema |
| paper shadow offset | +6, +10 at 1080p | px | I | code | schema |
| paper shadow alpha | .22 | 0-1 | I | code | schema |
| paper shadow blur | 0 | px | I | code | schema |
| shadow ratio y/x | 1.6-1.8 | ratio | I | code | schema |
| object edge | 1.5-4 | px | I | code | frame probe |
| type edge | max(2, size x .055) | px | I | code | type audit |
| type shadow | size x .035 x, .0385 y at .26 | px/alpha | I | code | type audit |
| contact shadow | ellipse r .065 x height, h .014 x height, alpha .22 | ratio | I | code | schema + human |
| spotlight | alpha .10-.18, length 820-1150, w0 30-40, w1 280-520 | px | F | film | frame probe |
| glow | blur 12-34 | px | F | film | frame probe |
| ambient occlusion | false | bool | X | code | schema |
| halation | false | bool | X | code | schema |
| soft cast shadow | false | bool | X | code | schema |

#### Per-element lighting / shadow table

| Element | Treatment |
|---|---|
| paper layer (set, prop, character) | flat fill + ink edge + hard offset copy; no soft shadow |
| type | cream edge + hard ink shadow at .26; always crisp |
| character on the ground | one ground ellipse at .22, radius .065 x height |
| held prop | the prop's own offset shadow; no separate cast shadow on the hand |
| practical (lamp, monitor, stage spot) | a flat pool or cone of colour, alpha .10-.18; it does not light the character volumetrically |
| impact | a paper flash or a 1-3 px riso offset, not a bloom |
| background | no vignette gradient except the global .34 paper vignette |

**Rules:**
- One shadow direction. The far side of a limb or costume is `shade(colour, -14 to -18)`; there is no second light.
- A shadow is a **copy of the card**, offset, not a blurred blob. The only soft edge is the paper fibre, not the shadow.
- The reference frame measurement could not reliably detect the cast shadow (median -0.4 luma, 0/44 high confidence). That means: **do not build a shadow rule from the photograph; build it from the code**. Use the code value, and let a person sign the frame.
- A shot may be lit by a practical (a lamp, a monitor, a stage spot) but the flat print and the hard registration shadow remain.

---

### 3.5 Edge, outline and registration

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| limb edge | 2.1 | px | I | code | frame probe |
| object edge | 1.5-4 | px | I | code | frame probe |
| silhouette ink band | p10 5.6; median 12 where hair crosses | px | R | film | frame probe |
| type edge | 5.5% of size, min 2 | px | I | code | type audit |
| sticker edge | 2.2 | px | I | code | render |
| brads | 3.0-4.6 radius | px | I | code | rig audit |
| cut edge colour | cream or ink | hex | I | code | palette |
| riso misregistration | 1-3 px on hits, optional | px | V | code | frame probe |
| bevel/gloss | false | bool | X | code | schema |

**Rules:**
- The contour is a **cut edge**, not a cel outline drawn on top. A paper layer carries its own edge; the world's line never outlines a character card.
- The silhouette must read at 390 px: the ink band is at least 3 px at 1080p (0.28% of height).
- No outer glow, no drop-shadow blur, no emboss.
- Riso misregistration is allowed only as a 1-3 px colour offset on an impact, not as a permanent chromatic aberration.

---

### 3.6 Composition and framing

| Framing | Subject height | Share of shots (long film) | Use |
|---|---|---|---|
| wide / insert | 13-35% | 25-40% | establish the world, a prop, a chase |
| medium | 35-55% | 10-25% | two-shot, action, travel |
| close / hero | 55-80% | 40-55% | the performer, the face, the poster |
| extreme close | 80-92% | 0-10% | a single emotional beat, a macro prop |

The share column is a **target mix**, not a strict partition: a 30 s film may use 30% close and 10% extreme; a long film may use 40% wide. The only hard rules are at least three tiers and the height band.

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| subject height | p50 55.2, p25 28.9, p75 71.1, range 13.0-91.9 | % | I | film | frame probe |
| subject width | p50 7.1, range 4.0-14.2 | % | I | film | frame probe |
| centroid x | p50 .55, p10 .33, p90 .69 | ratio | I | film | frame probe |
| centroid y | p50 .52, p10 .38, p90 .66 | ratio | I | film | frame probe |
| centre-third share | 38/49 = 78% | ratio | I | film | frame probe |
| floor line (strongest boundary) | p50 .778, p25 .64, p75 .83 | ratio | I | film | frame probe |
| cast feet | 1000-1012 px = .926-.937 | px/ratio | I | code | frame probe |
| field edge bar | 0 left, 0 designed right; <=8% width if a set feature | % | I | film | frame probe |
| negative space | 97% of frame is not subject | ratio | I | film | frame probe |
| text area | 2-6% small text; bottom band <=6% (p90) | % | I | film | frame probe |
| relationship | solo, duet, lead+chorus, crowd | enum | F | film | frame probe |
| duet/chorus minimum | at least one two-hander or chorus shot in a song film | count | I | film | frame probe |

**Rules:**
- **One focal shape per frame.** The subject, a prop, or a type block - one, not three. The other elements support it.
- **The subject is in the middle, not at the edge.** 78% of shots put the cast in the centre third. The two left-edge exceptions are deliberate one-offs (the club singer, the seer) with the rest of the frame empty; they are not a layout system.
- **Scale is the rhythm.** A film must use at least three height tiers (wide, medium, close) and its height standard deviation must be >=15 points. A fixed 57.8% in every frame is not a composition; it is a sticker.
- **The field is full-bleed.** A cream plate with two colour wings is a diagram layout, not a paper stage. The field must be the world.
- **Text sits in the negative space**, opposite the subject: display upper-left or upper-right, subtitle bottom-left, HUD top-right. Never over the face, hands or feet.
- **Do not use subject area as a band.** Height and width are the measurable axes; area is a consequence. A 90%-tall close-up is a small area but a hero shot; a 3%-area diagram is not a composition.
- **A song film is a performance, not a portrait.** At least one shot must stage a relationship: a duet, a lead with chorus, or a crowd. A film of one figure against one field for every shot is a poster set, not a stage.

---

### 3.7 Subject placement and scale

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| centroid x | .30-.75 in >=80% of shots | ratio | I | film | frame probe |
| centroid y | .38-.66 | ratio | I | film | frame probe |
| cast feet | 1000-1012 px; the set floor is 780-900 | px | I | code | frame probe |
| outer 10% rule | cast centroid never in the outer 10% for a whole shot | ratio | I | film | frame probe |
| scale ladder | hero 1.10-1.25, lead .86-1.02, co-lead .62-.95, support .46-.64, chorus .50-.68, inset .25-.48 | scale | F | code | score/probe |
| height tiers per film | >=3 | count | I | film | frame probe |
| height sd per film | >=15 points | points | I | film | frame probe |

**Placement law (from the source):**
- Lead: scale 1.10-1.25, feet y 1002-1012, head y 197-338.
- Backing: scale .50-.68, feet y 956-1000.
- Backing-to-lead ratio: 1.7-1.9x.
- The painted floor sits at 800-900; the cast stands 100-200 px in front of it. That gap is the foreground band.
- A close-up may clip the feet; a wide may clip the head; a medium may not clip either.

**No side-bar staging.** The Uber film put the cast at x 0.136 inside a 19% cobalt bar. That is the single largest identity failure. The fix is not to move the character a little; it is to remove the bar and stage the character in the field.

---

### 3.8 Background field and set treatment

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| layers | bg, mid, character, fg, type | 5 | I | code | render |
| floor plane | polygon from -80 to W+80, W+220 to H+80 | px | I | code | render |
| horizon / set floor | 780-900 | px | I | code | frame probe |
| cast feet | 1000-1012 | px | I | code | frame probe |
| sky | vertical 2-stop gradient + one graphic device + one texture | rule | I | code | frame probe |
| sunburst | 22-40 wedges, two tones, slow rotation | count | F | film | frame probe |
| halftone | 14-24 cell, .4-.55 dot, .11-.18 alpha | px | I | code | frame probe |
| field role | one of paper, ink, red, blue, acid, accent, kraft, teal, oxblood | enum | F | film | palette |
| field share | .18-.60 | ratio | I | film | frame probe |
| largest flat region | .04-.46 | ratio | I | film | frame probe |
| set families | stage, arena, theatre, lab, gym, data centre, desert, cliff, room, desk, void | enum | F | film | score |
| default cream plate | forbidden | - | X | film | frame probe |
| side bars | forbidden | - | X | film | frame probe |

**Set grammar (invariant):**
- A set is a **diorama**, not a backdrop: a floor plane, a horizon, a midground object, a foreground band, and one graphic device (sun, window, screen, arch, sunburst).
- The floor is a polygon with perspective lines and a torn lip; the cast stands in front of the painted floor, not on it.
- A set has **one field colour** and **one accent**, plus cream and ink. No fifth colour.
- Sets may be built inline, but every set must expose: field role, horizon y, floor y, one graphic device, one texture.

**Per-film choice:** which set family, which field colour, which device, how many rays, crowd/confetti, props. The film must not reuse the previous film's set family as its only world.

---

### 3.9 Cast archetype and construction

**Archetype: paper-pop performer.** Not an office worker, not a robot, not a generic mascot. The cast is a performer made of paper: a bradded paper body, a stage costume, a face with a readable expression, and a head-ornament slot.

The reference cast is **not one fixed flower head**. It is a family:
- SOL, the idol: a face plate, a petal halo behind the head (22 petals), long black hair, red jacket, pleated skirt, cobalt boots, gold halo.
- MIRA, the human researcher: a different rig, bob hair, round glasses, lab coat, red tie, trousers.
- THE PETALS: five dancers with daisy, poppy, tulip, cornflower and marigold ornament heads, identical rig, different palettes.
- GATO: a cat-eared idol in a black catsuit.
- CLIP, SHOGGOTH, BASILISK, CHINCHILLA: paper creatures with stage roles.

So the invariant is the **performer construction and silhouette**, not "a sunflower". The ornament slot may be a flower, a halo, a crown, a hood, a mask, a hat or cat ears.

#### The seven-point performer test

A new character is a Paper K-pop performer if and only if:

1. **Construction:** bradded two-bone paper limbs, 580-760 units, 7-7.5 heads, ink edge 2.1 px, one ground shadow.
2. **Character specificity:** at least **three distinguishing features** (silhouette, hair, face, ornament, costume shape, glasses, prop) and a declared stage role: lead, backing, foil, creature or host. A generic office worker has one feature (a suit) and no stage role; it fails here.
3. **Face:** a drawn cartoon face with the 10-eye x 7-mouth vocabulary, or a mask/creature face with an equivalent readable expression set. A geometric dot-face is not enough.
4. **Head:** a three-layer head stack and a **performance feature** - an ornament (petal, halo, crown, hood, mask, hat, ears), stage makeup, or a signature hair/glasses silhouette. The feature must be recognisable from 390 px and must be specific to the character, not a generic slot.
5. **Performance:** 8+ poses and 14+ expressions, including 4 poses that are **performance poses** (a point, a hair flip, a mic hold, a bow), not only idle/stand.
6. **Scale:** can hold the hero, lead, support and inset tiers without breaking.
7. **Stage role:** the film declares who the character is to the audience - the star, the backing, the foil, the creature, the host (an MC, not a narrator). A character with no relationship to the performance is a prop with a face.

Mira passes because her bob, round glasses, lab coat and red tie are four features, her role is the human foil, and her face is drawn. A generic worker in a suit with no distinguishing features fails 2 and 7. A creature passes through the **creature branch**: it may have a mask instead of a face plate, a non-human body, and no thumb, but it must still have a stage role, 8 poses, 14 expressions and a head feature.

**Creature branch:** CLIP, SHOGGOTH, BASILISK and CHINCHILLA are allowed even though they are not humanoid. They must have a readable face/mask, a stage role, a signature move, and the same paper construction (edge, shadow, brads where the body has joints).

#### Construction values

| Parameter | Value | Unit | Scope | Basis | Measure |
|---|---|---|---|---|---|
| archetype | `paper-pop-performer` | enum | I | code | library/schema |
| principals | 1-2 | count | I | code | score |
| chorus | 0-5, identical rig, different palette | count | F | code | score |
| total cast | <=7 | count | I | code | score |
| height class at s=1 | 580-760 | units | I | code | library |
| head-to-body | construction 7.0-7.5 heads; **visual doll** 3.4-4.5; head 22-28% of height; head-ornament diameter 45-65% of height | ratio | I | film | frame probe |
| silhouette | head + ornament 22-28% of height; torso 30-35%; legs 35-40%; shoulder width 18-22%; hand 1.3-3.7%; boot/platform 8-12% | ratio | I | film | frame probe |
| face style | drawn cartoon: lashes, irises, lips, blush; not geometric dots or photo | rule | I | film | library + human |
| joints | hip, waist, shoulder L/R, elbow L/R, wrist L/R, knee L/R, neck, head pivot, head centre, ankle L/R (15 names) | count | I | code | library |
| brads | at every joint, r 3.0-4.6 | px | I | code | rig audit |
| limb | two-bone, taper .78-.82, ink edge 2.1 | ratio/px | I | code | library |
| hand | palm + thumb, no fingers; width .013-.037 of height; thumb .4-.5 of hand; **thumb optional for Mira-type humans and creatures** | ratio | I | code | body audit |
| foot | boot/sneaker, platform sole, gold bar | - | I | code | library |
| ground shadow | ellipse r .065 x height, h .014 x height, alpha .22 | ratio | I | code | schema + human |
| head ornament | flower/petals 10-24 (22 default), halo, crown, hood, mask, hat, cat ears | slot | F | code | library |
| hair | 3 layers: 4 long strands, back mass, bangs | layers | I | code | library |
| face | blob plate, ears, blush, eyes at +/-17.5, brows, 1 px nose, mouth y 32 | px | I | code | library |
| expressions | >=14: 10 eyes x 7 mouths; must include closed, happy, wink, heart, star, swirl, narrow, x; sing, grin, o, flat, pout, wobble | count | I | code | library |
| poses | >=8; must include bounce, lean, headTilt, armL/R, legL/R | count | I | code | library |
| palette roles | main, sleeve, skirt/trouser, boot, skin, hair, metal, paper, ink | roles | I | code | library |
| skin | 2-3 values, e.g. `#F0C9A4`, `#D9A06B`, `#8C5A3C` | hex | F | code | library |
| hair | 2-3 values, e.g. `#171319`, `#3B2416`, `#C9B896` | hex | F | code | library |
| brad metal | `#C68E2E` | hex | I | code | library |
| photo face / 3D / fingers | forbidden | - | X | code | schema |

**What may change per film:** name, species/flower, face, hair silhouette, costume values, accessories, number of chorus dancers, which tier each character occupies.

**Cast count:** the pack's `maxCast: 2` applies to **principals**; the chorus is a separate 0-5. A film with two principals and five backing dancers is 7 bodies but 2 cast members in the story sense. The resolver should read `principals` and `chorus` separately, not one `maxCast`.

**What may not change:** joint count, brad presence, limb taper, face geometry, 3-layer head stack, one-shadow rule, palette roles, 580-760 unit height class.

---

### 3.10 Character appearance and costume

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| skin | 2-3 values; `#F0C9A4` is an instance | hex | F | code |
| hair | 2-3 values; `#171319` is an instance | hex | F | code |
| brad metal | `#C68E2E` | hex | I | code |
| torso origin | waist; shoulder line -182 local | px | I | code |
| torso construction | main body + open front/collar + hem/cuff (12 ribs or 7 pinstripes) + one badge/patch | rule | I | code |
| far-side shade | -14 to -18 | delta | I | code |
| costume colours | palette roles only; no new role | rule | I | code |
| blink | 4 frames, every .5-2.3 s, hides an expression swap | frames/s | I | code |
| idle | bob .6% height, tilt 1.2 deg, head 1.5 deg | ratio/deg | I | code |
| walk/run | phase from distance, not wall clock | rule | I | code |
| no fingers / no photo / no 3D | forbidden | - | X | code |

**Rule:** a costume is a set of **role values**, not a new palette. The lead's red jacket, cream shirt, blue skirt and gold halo are instances of `main`, `paper`, `skirt`, `metal`. A new film may change the values; it may not add a sixth role.

---

### 3.11 Character movement and performance

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| pose keys | bounce, sway, lean, headTilt, headTurn, hairSwing, petalDrift, armL, armR, legL, legR, flip | 12 | I | code |
| bounce | -3 to -24 | px | F | code |
| lean | +/- .02-.30 | rad | F | code |
| head tilt | .02-.12 | rad | F | code |
| hair swing | +/- 5-26 | px | F | code |
| arms | -2.95 to +2.9 | rad | F | code |
| paper boil | 12 | Hz | I | code |
| overshoot | 1.03-1.06 from `backOut` | ratio | I | code |
| anticipation | 2-4 | frames | V | proposal |
| squash | .96-1.04 | ratio | V | proposal; the source does not squash the body |
| easing | easeOut, easeInOut, backOut, easeIn; no elastic/spring | enum | I | code |
| blink | 4 frames, .5-2.3 s | frames/s | I | code |
| hair/petal lag | 2-4 frames behind the body | frames | I | proposal |
| gesture count | 1-3 per shot, one hero | count | I | code |
| breakdowns | 1-2 per transition | count | I | code |
| feet | planted, knees bent, weight shifted, support ankle locked | rule | I | code |
| eyeline | shared between speakers; looks at the target | rule | I | code |
| extras | frozen except on cue | rule | I | code |
| reaction | 0-3 frames after the word | frames | I | 0046 |
| walk/run | phase from distance; 8-drawing cycle | rule | I | D/E |

**Performance grammar:**
- A pose change is a **key**, not a per-frame re-rig. Use 2-4 anticipation frames, a 2-4 frame contact, and a follow-through.
- One arm moves at a time unless the action is a two-handed hold, a push, or a dance hit.
- A blink hides an expression swap; never swap eyes in the open.
- Hair and petals follow the body by 2-4 frames, not physics.
- The character's feet own the ground; a floating foot is a P0.
- No "pose swap as animation": a still frame between two poses is a cut, not a performance.
- The paper event is **authored**, not simulated: a drawn fold, tear, curl or flutter on the beat. One per act is the target; the source draws static shapes, so this is a proposal, not an observation.

---

### 3.12 Props and sets - standards

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| prop material | paper + ink edge + offset shadow | rule | I | code |
| held prop | placed from a hand anchor; grip 11 px below wrist | px | I | code |
| worn prop | head-local space; behind the face if halo, in front if mask | rule | I | code |
| prop text | 9-24 px, mono or Archivo Black | px | I | code |
| prop size - handheld | 8-30% of frame height | % | F | code |
| prop size - body | 30-50% | % | F | code |
| prop size - hero/macro | 40-90% | % | F | code |
| prop contact | shadow ellipse or paper shadow; never a hard cast shadow | rule | I | code |
| motif recurrence | a motif prop appears >=3 times per film | count | I | code |
| face occlusion | only when the gag is occlusion (mask, monitor, cage) | rule | I | code |
| floating prop / clipped hand / mirrored badge | forbidden | - | X | code |

**Set standard:** a set is not a background image. It is a stack of paper layers with a floor, a horizon, one device and one texture. A set that cannot name its field role, horizon, floor and device is not finished.

**Per-film choice:** the set family, the props, the device, the ray count, the crowd/confetti, the prop palette. No film may reuse the previous film's full prop list.

---

### 3.13 Motif language

A motif is a **recurring graphic idea**, not a required asset. The identity owns the vocabulary; the film chooses 3-5 and gives them meaning.

| Motif | Material | Typical role | Mandatory? |
|---|---|---|---|
| sunburst | 22-40 paper wedges, two tones | field/energy | No |
| paper sun | circle + rays, 110-500 r | focus/opening | No |
| petal/flower | 10-24 petals, 5 tones | character/identity | No |
| halo / gold ring | 1-2 rings at petal r +16/+23 | character/hero | No |
| torn strip | 3-8 px tear, 14/10 points | divider/transition | No |
| tape | 76 x 20, rot .08, alpha .55 | sticker/annotation | No |
| stamp/seal | torn label, 2.2 px edge, rot -.05 | verdict/text | No |
| barcode / print marks | 6 bars, 26 px margin, timecode | HUD/credits | No |
| iris | radial mask, 8-1500 r, 26-120 feather | transition | No |
| confetti | 0-160 pieces, 129-219 px/s | chorus/celebration | No |
| speed lines | 500-1800 px/s | chase/acceleration | No |
| paperclip | a paper clip with googly eyes | film-specific recurrence | No |
| meter | thermometer, 11 ticks, 8-100 | film-specific continuity | No |

**Rules:**
- A film chooses **3-5 motifs**, not all of them.
- Each chosen motif appears **2-5 times**; at least one appears **3+ times**.
- No motif appears in **more than 40%** of shots. The cast ornament is exempt (it is part of the character, not a shot motif).
- The motif set must differ from the previous film's set by at least two motifs.
- **No default opener motif.** A sunflower, banner or lamp is allowed only if the story earns it; it is not the channel's signature.
- A motif may carry meaning (a paperclip = a bad idea that recurs; a meter = the stakes), but the meaning must be declared in the score, not inferred.
- Separate **formal devices** (sunburst, iris, halftone) from **semantic objects** (paperclip, meter, coin, phone). A film needs at least one semantic object with a transformation arc, not just formal decoration.

---

### 3.14 Camera - model, vocabulary, frequency, travel

#### Model

`x`, `y` (translate), `z` (scale), `roll` (rotate), `shake` (offset). No perspective, FOV, DOF or true parallax. A "dolly" is a z change; a "truck" is an x change; a "tilt" is a y change. The camera always moves about a declared focus point.

#### Vocabulary

| Move | What it does | Typical use | Travel |
|---|---|---|---|
| static | no move, or a 0.02%/frame creep | a held poster, a breath | creep <=1.5% per shot |
| push_in | z up | reveal, intimacy, escalation | dz .03-.25 |
| pull_back | z down | reveal the world, close | dz .03-.25 |
| crash_zoom | z fast | impact, joke, drop | dz .50-3.0 |
| pan | x translate | lateral travel, chase | 24-600 px |
| tilt | y translate | scale, tower, fall | 18-400 px |
| track | x/y translate with the subject | chase, walk, drive | 100-800 px |
| orbit | x/y arc + z | hero, chorus, stage | dz .05-.12; arc 10-40 deg |
| whip | fast pan/track | chase, transition | 300-900 px |
| handheld | low-frequency x/y/roll noise | documentary beat, panic | 0-12 px, 71/63 rad/s |
| world | scale/translate the whole set | a zoom the camera cannot do | 1.0-2.6x |

#### Frequency

The reference code calls `setCam` in 27/51 scenes; 24 inherit the previous camera, and 8 of those 24 move the whole world instead. That is a **defect**, not a grammar. The identity's target is:

| Move | Target share | Reference (54 authored cards) |
|---|---|---|
| push_in | 25-35% | 28% |
| pull_back | 8-15% | 11% |
| track / pan | 15-25% | 17% |
| orbit | 10-20% | 13% |
| tilt | 5-15% | 7% |
| crash / whip | 5-15% | 7% |
| static with creep | <=10% | 9% |
| handheld | <=5% | 4% |
| world move | <=10% | 15% |

- **Moving share target >=90%.** Static <=10%, never two static shots in a row, and a static shot must have a 0.02%/frame creep or a character action.
- **4-8 distinct moves for a short; 6-10 for a long film.** The reference uses 8-10; a 30 s film can use 4-6; a 60 s film can use 6-8. The 11-move vocabulary is the **allowed list**, not a requirement to use all 11.
- **No run of the same move >2.** A third push in a row is a camera tic.
- **No gap:** every shot declares a camera move, a world move, or a creep.
- **One primary move per shot**; a secondary move is allowed only if it is motivated by the action (a push that becomes an orbit after a reveal). The share bands are independent budgets, not a partition; a world move may also be a push, and a crash may also be a track.

#### Travel and seam

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| z range | .84-3.55; crash up to 8.0 | scale | F | code |
| roll | -4 to +7.5; max 8 without impact | deg | I | code |
| shake | 0-12 px; 71/63 rad/s; no decay in the source | px | F | code |
| hold creep | .02%/frame | %/frame | I | proposal |
| push creep | .06%/frame | %/frame | I | proposal |
| kick | 6-10 px, 7 frames, sign-flipping, decay (1-n/7)^1.5 | px/frames | F | proposal |
| camera seam | max speed jump .35, accel jump .50, direction turn 90 deg | ratio/deg | I | target |
| cut at rest | <=50% of cuts; >=40% cut on motion | ratio | I | target |
| motion blur | 0 | - | X | code |

**Camera grammar by beat role (F):**

| Beat role | Move |
|---|---|
| hook / chorus | orbit or crash, one hero move |
| setup / verse | pan or track, let the world breathe |
| escalation | push_in, increasing travel |
| turn / bridge | pull_back, reveal the context |
| release / close | pull_back or hold, settle |
| button / last frame | push_in or a 7-frame kick |

**Forbidden:** 3D orbit/fly-around, FOV, DOF, Dutch tilt >8 deg without an impact, shake on type, camera-only motion, a static shot with no creep or action, the same move three times in a row, a pan with `from = to`.

**Schema note:** the current score camera is `{move, from, to, ease}` - a z-scale shorthand. A pan or tilt needs `keys: [{t, x, y, z, roll}]`. The identity proposes `camera.keys` for non-z moves and keeps `from/to` for a push/pull. Without it, a "pan" is a 2% push.

---

### 3.15 Shot duration and edit rhythm

#### The reference edit (R)

| Metric | 51 scene objects | 54 visible cards |
|---|---|---|
| count | 51 | 54 |
| duration | 156.62 s | 156.60 s |
| min | .66 s | .22 s (micro) / .66 s (scene) |
| p10 | 1.64 s | 1.58 s |
| p25 | 1.94 s | 1.82 s |
| median | **3.06 s** | **2.86 s** |
| mean | 3.07 s | 2.90 s |
| p75 | 3.66 s | 3.66 s |
| p90 | 4.82 s | 4.60 s |
| max | 6.14 s | 6.14 s |
| cuts/min | 19.2 | 20.3 |

**Distribution (54 cards):** <1 s 2 (4%), 1-2 s 18 (33%), 2-3 s 8 (15%), 3-5 s 22 (41%), >5 s 4 (7%). The 4% under-1 s share is a 156 s film value; a 10-13 shot short cannot have 4% (one shot is 7.7-10%), so short formats use 0-8% for <1 s and shift the difference into 1-2 s.

**The rhythm is bimodal, and that is the signature:**
- **Chorus:** 1.58-2.20 s, fast cuts, 1-2 shots per lyric line (not 2-4).
- **Verse/bridge:** 3.0-5.0 s, one idea per shot.
- **Finale/curtain:** 5.0-5.6 s, long holds.
- **Micro-shots:** 0.22-0.66 s, only as a graphic device (iris, flash, a single object), never as a scene.
- The middle band (2.2-3.0 s) is under-used (15%); do not flatten the film into a uniform 2.9 s.

#### Bands for a new film (T/I)

| Format | Shots | Median | Min | Max | Cuts/min |
|---|---|---|---|---|---|
| 30 s Short | 10-13 | 2.4-3.2 | 1.2 | 5.0 | 18-24 |
| 45 s | 14-18 | 2.5-3.2 | 1.2 | 5.2 | 17-23 |
| 60 s | 18-23 | 2.6-3.2 | 1.2 | 5.5 | 17-22 |
| 156 s song | 48-57 | 2.8-3.1 | 0.6 | 6.2 | 18-22 |

**Cut alignment:** 80-95% of cuts land on a word, line or musical phrase boundary. The source is 92% on a lyric boundary and only 11/61 on the 88 BPM grid; the cut follows the **voice**, not the metronome. For a narrated film, cut on the word; for a song film, cut on the sung line or the downbeat of a phrase.

**Transitions:** see 3.17. Hard cut 80-90%; designed transitions 10-20% (iris, flash, wipe, match, hold). A designed transition is a **modifier on a cut**, not a separate share; the base is always a cut.

**Holds:** no undeclared hold >0.4 s. The last shot may hold up to 2 s. A "breath" shot is a shot with a micro-move, not a freeze.

---

### 3.16 Per-shot action and motion

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| actions per shot | 1-3; one hero | count | I | target |
| non-camera action | at least one per shot | count | I | code |
| paper event | one per act (target); authored fold/tear/curl/flutter | event | F | proposal |
| motion floor | 0.6 (existing audit) | ratio | I | code |
| freeze budget | 0.4 s / 12 frames | s | I | code |
| hold creep | .02%/frame | %/frame | I | proposal |
| squash | .96-1.04 | ratio | V | proposal |
| overshoot | 1.03-1.06 | ratio | I | code |
| anticipation | 2-4 frames | frames | V | proposal |
| exit | 40-50% shorter than enter | ratio | I | target |
| overlap | 30-50% | ratio | I | target |
| stagger | letters 1 frame, words 60-120 ms, items 40-80 ms | frames/ms | I | proposal |

**Action types:** pose, gesture, prop, set, type, camera. A shot must have at least one of the first five; camera alone is not motion.

**The paper event** is the channel's signature: a drawn fold, tear, curl, flutter, stack, peel or stamp. It must be motivated by the action, not decorative. The source draws static paper shapes; the event is an authored proposal, not a simulation. One per act is enough; three is noise.

**Motion is not bounce:** a character that bobs but does not act is a puppet idling. The action changes the world (a prop moves, a line lands, a set reacts).

---

### 3.17 Transitions and continuity

| Transition | Share | Duration | Use | Forbidden |
|---|---|---|---|---|
| hard cut | 80-90% | 0 | default | - |
| iris | 8-15% | .17-.44 s; r 8-1500; feather 26-120 | act/chapter boundary, a closing eye | iris that cuts a face/hand |
| flash | 0-8% | .14-.44 s; alpha .22-1 | impact, reveal, joke | flash on every cut |
| wipe | 0-4% | .13-.30 s | lateral travel, a torn edge | star wipe, page turn |
| match cut | 2-6% | 0 | object transformation | overlay after the cut |
| hold | 0-4% | <=2 s | close, breath | hold through a dead frame |
| dissolve | 0 | - | - | always |

**Partition:** the base is always a cut. Iris, flash, wipe, match and hold are **modifiers on a cut**, so the shares do not sum to 100; the base cut share plus the designed-transition share is 100. A designed transition may also be a hard cut at the boundary (the iris closes the outgoing shot and the next shot begins hard). This is how the source works: 10 iris closes and 38 flashes, but 50/53 boundaries are hard cuts.

**Rules:**
- A transition is designed with **both** scenes: the outgoing silhouette, direction and speed must set up the incoming one. A match cut needs silhouette, scale, orientation and direction.
- A mask must contain the next scene; a post-cut overlay is a lie.
- Same location: preserve pose, perspective, light and speed.
- No cut on every beat; no same whoosh for every transition.
- No dissolve, no page turn, no 3D wipe, no star wipe.

---

### 3.18 Focus, blur and depth

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| depth of field | false | bool | X | code |
| motion blur | 0 | - | X | code |
| bokeh / lens blur | false | - | X | code |
| radial blur | false | - | X | code |
| tilt-shift | false | - | X | code |
| chromatic aberration | only riso 1-3 px on a hit | px | V | code |
| depth mechanism | scale, overlap, layer order, hard shadow | rule | I | code |
| plane parallax | 1.0 / 0.6 / 0.3 only if declared | ratio | V | proposal |
| vignette | .34 | ratio | I | code |

**Rule:** a paper collage is photographed flat. There is no lens, so there is no focus pull, no bokeh and no motion blur. "Focus" in this style means **contrast and edge**: the subject is the sharpest, highest-contrast, most detailed thing in the frame. If a film needs to separate a foreground, it uses a paper layer, a halftone density or a shadow, not a blur.

---

### 3.19 Text and type behaviour

#### Families

| Role | Family | File | Use |
|---|---|---|---|
| display / hook | Anton | `Anton-Regular.ttf` | chorus words, hooks, sound effects |
| body / label | Archivo Black | `ArchivoBlack-Regular.ttf` | stickers, stamps, UI headlines |
| tenderness | Instrument Serif Italic | `InstrumentSerif-Italic.ttf` | the final question, jazz, a quiet line |
| caption / HUD | DM Mono Regular / Medium | `DMMono-Regular.ttf` | subtitles, telemetry, credits |
| annotation | Permanent Marker | `PermanentMarker-Regular.ttf` | arrows, "trust me" |
| Korean accent | Black Han Sans | `BlackHanSans-Regular.ttf` | only when the brief is Korean |

#### Sizes at 1080p (16:9)

| Role | Range | Common | Notes |
|---|---|---|---|
| display/hook | 92-376 | 128 | one word per frame; never body/caption |
| body | 44-84 | 56 | 2-3 lines max |
| subtitle | 28-34 | 31 | one line, 8-9 words, 54 chars max |
| label/HUD | 7-18 | 13 | mono, caps, tracking 1-4 px |
| sticker | 12-62 | 30 | Archivo Black, torn label |
| monogram | 72-160 | 96 | Permanent Marker, once per close |
| circular | 24-26 | 25 | open/close only, max 24 chars |
| vertical | 72 | 72 | max 10 chars, upright glyphs |

**9:16 is a different scale.** The 31 px subtitle is a 16:9 television size. At 390 px wide, 31 px at 1920 is 6.3 px, below the pack's 14 px floor. The 9:16 re-stage uses the pack's mobile scale (caption 16, label 14) and the 14 px floor; it does not inherit the 16:9 subtitle size. Do not crop the 16:9 frame. The pack's 69 px `type-audit` floor is the 1920-wide equivalent of 14 px at 390 (14 x 1920/390 = 68.9); on a 1080-wide 9:16 frame the equivalent is 38.8 px, not 69. Use the format's own scale; do not compare a 16:9 floor to a 9:16 frame.

#### Type as composition (not decoration)

The reference uses type as a **poster element**: a hook can occupy 8-25% of the frame area, stacked in 2-3 lines, opposite the performer. It is not a caption with a bigger font. A film must have at least one **hook shot** where the display type is a primary shape, not a label.

| Parameter | Value | Unit | Scope |
|---|---|---|---|
| display area in a hook shot | 8-25% of frame | % | I |
| hooks per film | 2-5 | count | F |
| hook lines | 1-3 | lines | I |
| hook position | opposite the subject; never over the face | rule | I |
| hook words | 1-4 per line | words | I |
| subtitle vs hook | subtitle is one line, 8-9 words; hook is 1-4 words, 2-3 lines | rule | I |

#### Treatment

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| tracking | size x .01 | em | I | code |
| char rotation | +/- .035 | rad | I | code |
| char y jitter | +/- .012 | em | I | code |
| edge | max(2, size x .055) | px | I | code |
| shadow | size x .035 / .0385 at .26 | px/alpha | I | code |
| boil | 12 | Hz | I | code |
| appear | .55 -> 1.0 | scale | I | code |
| stagger | .012-.06 per char; default 0 | s | I | code |
| wrap | single line; manual stack | rule | I | code |

#### Subtitle band

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| x / y | 84 / 992 at 16:9; 0.12 / 0.34 at 9:16 | px/ratio | T | code |
| size | 31 (16:9); 16 at 9:16 | px | T | code |
| width | min(1300, text + 96) | px | I | code |
| height | 62 | px | I | code |
| panel | ink .92, torn 3.5, shadow +5/+8 at .28 | - | I | code |
| label | `LYRIC`, 11 px, cream .55, letter 1.5 | px | I | code |
| words start | x + 64 | px | I | code |
| word gap | 9 | px | I | code |
| active word | acid, lift -5, 3 px underline at .25 | px | I | code |
| progress hairline | 2 px red at y+11, width w-40 | px | I | code |
| visible | start - .02 to end + .35 | s | I | code |
| max words / chars | 9 / 54 | count | I | code |
| bottom band | 12-14% reserved | % | I | code |

#### Layout and behaviour

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| max words per slot | 8 (subtitle 9) | words | I | code |
| max lines | 3 display (1-4 words per line); 1 subtitle | lines | I | code |
| max type systems per frame | 2 (one display + one mono) | count | I | code |
| max text boxes per shot | 2 | count | I | code |
| display position | upper-left/right third, opposite the subject; never over face | rule | I | code |
| subject priority | the performer is always more important than the type; if they compete, move the type | rule | I | code |
| subtitle position | bottom-left, 12-14% band | rule | I | code |
| HUD position | top-right, 246 x 96 at 1634/40 | px | I | code |
| reading time | max(1.8 s, speech + 0.6 s); last line >=2 s | s | I | code |
| box | display no box; sticker torn label; subtitle torn ink band | rule | I | code |
| underline | hand-drawn red squiggle or 3 px active-word rule; no generic underline | rule | F | code |
| enter | display on the sung/spoken word; subtitle line fades .12 s early but the word highlight is word-timed | rule | I | code |
| behaviours | stack, stamp, slide, fold, eaten, scatter, drop | enum | F | code |
| lyric wall | >8 words of narrative copy, or >3 display lines of different words; a repeated single word as a graphic pattern (e.g. LIES x12) is a texture, not a lyric wall | - | X | code |
| text over face/hands/feet | forbidden | - | X | code |
| rounded UI cards / soft drop shadow | forbidden | - | X | code |

**Type behaviour:** the type is a **paper layer in the world**, not a caption overlay. It can be stamped, torn, folded, bitten, swallowed, stacked or scattered. It always carries an edge and a hard shadow. It never sits in a rounded rectangle or a glass panel.

**Two systems max:** one display (Anton/Serif) and one mono (DM Mono). A third family is a style break. The HUD counts as the mono system.

---

### 3.20 Element interaction

| Interaction | Rule |
|---|---|
| character <-> prop | prop is placed from a hand anchor; grip 11 px below wrist; the hand closes around the grip |
| character <-> ground | feet on the floor line; one ground shadow; no floating |
| character <-> character | shared eyeline; one speaker at a time; a reaction lands 0-3 frames after the word |
| type <-> subject | text never covers the face, hands or feet; text sits in negative space |
| type <-> type | max two systems; display and mono never compete for the same anchor |
| foreground <-> background | foreground paper occludes; depth by overlap and scale; no blur |
| prop <-> set | a prop on the floor has a contact shadow; a prop on a wall is pinned |
| crowd <-> cue | extras freeze except on a declared cue; no ambient loop |
| motif <-> beat | a motif may pulse on the beat, but never more than 4.5% scale |
| paper <-> impact | a hit folds, tears, curls or flutters; one authored event per act |

**The contact rule:** every held or worn object must name its contact point. "Near the hand" is not a contact. A prop that floats 10 px from the palm is a P0.

---

### 3.21 Sound, music and SFX

#### Two modes

| Mode | What it is | When |
|---|---|---|
| **song-led** | a licensed song is the film; the picture cuts to the vocal; no added foley | a music film, a song drop, a tour announce |
| **voice-led** | narration + code-generated SFX; music optional/parked | an explainer, a story short |

#### Song-led values (R)

| Parameter | Value |
|---|---|
| integrated loudness | -15.6 LUFS |
| LRA | 6.0 |
| true peak | -3.7 dBTP |
| lyric lines | 46 (transcript); 45 authored |
| words | 227 (transcript); 213 authored |
| voiced span | 1.50-140.68 s |
| sung rate | 97.8 wpm over the voiced span |
| added foley/SFX | none; the typography is the SFX |
| master | the song, untouched |

#### Voice-led values (I)

| Parameter | Value | Unit | Scope |
|---|---|---|---|
| integrated loudness | -14 +/-1 | LUFS | I |
| true peak | <=-1.5 | dBTP | I |
| duck depth | 4-8, declared and measured | dB | I/F |
| event under voice | -6 | dB | I |
| silence | <=-50 dBFS, declared with a reason | dBFS | I |
| tail | monotonic to <=-60 dBFS over .5 s | dBFS | I |
| cue kinds | paper, wood, metal, glass, cloth, crowd | enum | I |
| cue binding | to a picture event (word, contact, transition) | rule | I |
| cue density | <=1 per 1.5 s; no machine-gun repeats | count | I |
| room tone | present under a quiet scene; <=-38 dBFS | dBFS | F |
| meme sounds / musical stings | forbidden | - | X |

**Rules:**
- A cue is bound to a picture event, not typed near it.
- A cue has layers, a band, a send and a duck depth.
- Silence is designed, not left over: one beat before a drop; no narration through it.
- No music until the music decision is unparked; do not fake a score with SFX.
- The delivered file is measured, not the master alone.
- The song mix is the reference's own; a new song film may master to -14 LUFS +/-1, but it must not add foley over the vocal.

---

### 3.22 Narration and voice

| Mode | Rate | Lines | Words | Coverage | Style |
|---|---|---|---|---|---|
| narrated short | 180-190 wpm | 5 per 30 s | 84-87 per 30 s | >=.80 voiced | conversational, dry, sentence-final fall |
| song | 90-100 wpm over voiced span | 46 per 156 s (17.6/min) | 5-9 per line | song is the clock | sung, rhyming, dense |

**Narrated rules:**
- First word within 1 s of frame 1.
- Last word at least 1.5 s before the end.
- No announcer voice, no sing-song, no rising terminal on every line.
- A line is a thought, not a sentence fragment; 5 lines carry a 30 s film.
- 84-87 words is the honest band for 30 s with a 1.5 s tail at 180-190 wpm (180 x 28.5/60 = 85.5; 190 x 28.5/60 = 90.25, so 84-87 is the conservative side). Write 87-90 only if the tail is shorter; 90-95 only if the film speaks to the last second.
- The text of the narration and the text of the score are compared word for word; no invented facts.

**Song rules:**
- The lyric is the narration; no separate VO.
- The cut follows the sung line, not the metronome.
- The lyric appears at least once as a readable subtitle, unless the line is physically destroyed on screen.
- Hooks get monumental type in the negative space opposite the idol; never over the face.

---

### 3.23 Opening and closing

| Parameter | Value | Scope | Basis |
|---|---|---|---|
| first frame | the thumbnail; never an empty black frame; a lit paper event or the subject | I | target |
| opening types | object birth, mid-action, question, world reveal | F | film |
| default title card | forbidden unless the story earns it | X | 0051 |
| closing types | pullback reveal, loop, hold, curtain | F | film |
| last shot | resolve, loop or hold; <=2 s hold | I | code |
| repeated opener/closer | forbidden in consecutive films | X | product |

**The source's cold open** (a paper sunflower unfolds one petal per beat, a circular title) is an **instance**, not the identity. A new film may open on a performer, a hand, a door, a coin, a question - as long as the first frame is subject-specific, lit as paper, and not an empty black frame. The source's cold open is a lit paper event on a dark field, which is allowed; a black frame with a logo is not.

**The source's close** (a desk pullback revealing the film is a diorama on a laptop) is also an instance. A new film may close on a loop, a held poster, a curtain call, or a pullback to its own smallest object. It may not close on the same desk.

#### Frame story (song films)

A song film is **bookended**: a title object at the start and a credits/reveal at the end. The object may be a paper sun, a ticket, a stage curtain, a cassette, a phone, a door - anything the film's world owns. The frame is not a generic title card; it is the smallest object of the film's world, opened and closed.

| Parameter | Value | Scope |
|---|---|---|
| title object | 1, from the film's world; no default card | I |
| credits/reveal | 1, at the end; mono, small, left | I |
| bookend relation | the last image returns to the first object or its world | I |
| diagram opener | forbidden: a map, chart, network or UI screen may not be the first frame | X |
| performance opener | the first frame must contain a performer or a performance object | I |

---

### 3.24 Variation grammar - the anti-copy engine

This is the part that keeps the channel recognisable without repeating the same film.

| Axis | The film must choose | Range / menu | Required difference |
|---|---|---|---|
| Structure | 3-5 acts; 5-9 beats | rise/fall, loop, question/answer, chase, descent | different spine from last film |
| Set family | 1-3 families | stage, arena, theatre, lab, gym, data centre, desert, cliff, room, desk, void | at least one new family |
| Field script | 3-5 field roles, one per act | ink, kraft, orange, red, green, acid, pink, cream, blue, oxblood, teal | no repeated field in the same position |
| Cast | 1-2 principals + 0-5 chorus | paper-pop performer variants | different names/faces/species/costumes |
| Motifs | 3-5 | 13-item library | at least two different from last film |
| Camera | short 4-6 moves, long 6-10, assigned by beat | 11-move vocabulary | different opening and closing move |
| Text | 2-3 behaviours | stack, stamp, slide, fold, eaten, scatter, drop | no repeated layout |
| Transitions | 2-3 kinds | cut, iris, flash, wipe, match, hold | different act-boundary transition |
| Opening | 1 of 4 | performance object, mid-action, question, title object | different from last film; no map/chart/network as the first frame |
| Closing | 1 of 4 | pullback, loop, hold, curtain | different from last film |
| Sound | song-led or voice-led | - | different mode if the last film was the other |
| Signature shot | 1 | any | must be unlike any shot in the last film |

**History:** the variation check needs the **last three films**, not one. A single "different from last" rule can oscillate between two templates. Store `build/variation.json` with the last three films' choices; `variation:check` refuses a fourth use of the same value on any axis.

**The same-channel test (10 questions):**
1. With the sound off, does the frame read as cut paper, not vector or 3D?
2. Is there a performer, and is it a paper-pop performer rather than an office worker?
3. Is the field full-bleed, with no side bars?
4. Is the subject in the middle third and large enough to read?
5. Does the subject separate from its field by at least 20 luma?
6. Is the palette warm-earth dominant with blue as an accent?
7. Does the shot move, and does the character act?
8. Is the type a paper layer with an edge and a shadow, not a UI caption?
9. Is the cut on the word/phrase, with a chorus/verse rhythm?
10. Is there one motif that recurs and means something?

If any answer is no, the film is not this channel yet.

**What must never be copied from the reference film:** the cold-open sunflower, the desk pullback, the DOOM meter, the paperclip, the exact stage layout, the exact character names, the exact act order. Those are the reference film's content. The identity is the grammar that produced them.

---

### 3.25 Forbidden moves

1. Glossy 3D, bevel, chrome, photoreal material.
2. Photo faces, realistic hands, fingers.
3. Soft cast shadows where the style is a hard cut.
4. Depth of field, bokeh, motion blur, tilt-shift, radial blur.
5. Dissolve, page turn, star wipe, 3D wipe.
6. Side bars, split-screen wings, a cream plate framed by colour bars.
7. Blue figure on a blue field (or any figure within 18 luma of its field).
8. Office-worker / corporate-deck archetype as the lead.
9. A static shot with no creep and no character action; camera-only motion.
10. Text over a face, hands or feet.
11. A lyric wall: >8 words, >2 lines, >2 boxes, >2 type systems.
12. More than 7 colour roles, or more than 5 in a short.
13. A default sunflower, banner or lamp opener; a map, chart, network or UI screen as the first frame.
14. The same opener, closer, set family or motif set as the previous film.
15. A camera move three times in a row; a pan with from = to; a 3D orbit.
16. A floating prop, a clipped hand, a mirrored badge, a prop through the body.
17. A pose swap passed off as animation; a floating foot; a dead hold >0.4 s.
18. A generic underline, a rounded UI card, a glass panel, a soft drop shadow.
19. An unlicensed font, an unlicensed track, a meme sound.
20. A claim not traceable to the brief.

---

### 3.26 Tone and register

The original is a **sweet-sinister pop** film: a bright, cute paper surface carrying a dark joke about AI doom. This is not a neutral explainer and not a cynical rant. The tone is part of the identity.

| Parameter | Value | Scope |
|---|---|---|
| tone.mode | `sweet-sinister-pop` | I |
| surface | bright, warm, handmade, cute | I |
| subject | a real threat, a bad idea, a doom, a joke about power | I |
| character | sincere, deadpan, never mugging | I |
| violence | paper slapstick; no gore; no real harm | I |
| cynicism | none; the joke is on the situation, not the audience | I |
| tender beat | one per film, near the end | I |
| poison accent | acid or pink, used at the threat, not everywhere | F |
| ending | resolve, loop or hold; no cruel punchline | I |

#### The eight tone beats (I)

A film must contain all eight, in this order, at any scale:

| # | Beat | What it does |
|---|---|---|
| 1 | bright surface | the first 20% is warm, cute and legible; the audience lowers its guard |
| 2 | first threat | one wrong detail: a shadow, a number, a crack, a smile that is too wide |
| 3 | cute-in-danger | the performer is sweet while the threat is real; the contrast is the joke |
| 4 | comic escalation | the threat grows and the performer keeps performing; the world does not care |
| 5 | dark act | one act drops the warm field to ink/oxblood; the palette tells the truth |
| 6 | tender beat | one quiet shot, one line, no joke; the character is alone or with one other |
| 7 | resolve or loop | the threat is contained, repeated, or revealed as a show |
| 8 | button | a final joke, a held image, or a wink; no cruel punchline |

A film that is only cute is a children's craft project; a film that is only dark is a corporate warning deck. The channel is both at once.

---

### 3.27 HUD and print furniture

The HUD is **optional and diegetic**. The reference's P(DOOM) meter is a film-specific prop, not a channel requirement. The identity requires only that a recurring readout, if used, behaves like a printed object.

| Parameter | Value | Unit | Scope |
|---|---|---|---|
| hud.mode | diegetic readout, max 1 box | rule | F |
| hud.box | 246 x 96 at 1634/40 | px | R |
| hud.title | 15 px Archivo Black, cream, letter .5 | px | R |
| hud.value | 34 px DM Mono, acid/red | px | R |
| hud.unit | 10 px DM Mono, cream .5 | px | R |
| hud.bar | 70 x 6, background cream .16 | px | R |
| hud.ticks | 6 ticks, 14 px pitch | count | R |
| hud.flower | 6 gold petals r 7, red centre r 3 | px | R |
| hud.recurrence | if used, >=3 appearances and one meaning | rule | I |
| print margin | 26 px; corner marks 16 px at .22 | px | I |
| print bars | 4 patches: blue, red, gold, ink | count | R |
| timecode | 30 fps, 11 px | px | R |
| credits | mono 14-24 px, left, small | px | F |

**Rule:** do not copy the P(DOOM) label, the 8-100 range or the sunflower bulb. Those are the reference film's content. Copy the **behaviour**: a small printed readout that recurs, changes on the beat, and carries the film's stakes.

---

### 3.28 Determinism

Determinism is part of the style: the same brief, style version and seed must produce identical frames.

| Parameter | Value | Scope |
|---|---|---|
| clock | `t = frame / 30`; no wall clock | I |
| random | seeded hash; no unseeded `Math.random` | I |
| seeded | fibre, tear, halftone, sticker rotation, grain, type jitter, camera phase | I |
| fixed | palette, type, recipe order, camera direction | I |
| texture cadence | paper 2 Hz, grain 24 Hz, type 12 Hz | I |
| camera reset | every shot declares a camera or world move; no inherited `CAM` | I |
| worker safety | a frame is identical whichever browser paints it | I |
| freeze budget | 0.4 s | I |
| output | one manifest, one picture hash, one delivered file | I |

**Reference defects:** the source grain is unseeded and the camera is sticky. Do not copy either.

---

### 3.29 Reference defects - do not copy

| Defect | Evidence | Identity rule |
|---|---|---|
| 24/51 scenes never call `setCam`; camera inherits | B 11 | every shot declares a camera/world move |
| grain uses `Math.random` | A 11 | seeded grain |
| hand anchors re-derived from trig; mic uses wrong shoulder y | B 3.4 | hand anchor, grip point |
| `labSet`, `roadSet`, `spaceSet` dead; shots hand-build rooms | B 5.1 | a set function or a declared inline set |
| 54 storyboard cards vs 51 scene objects | B 1.3 | one count, declared |
| safe zones and 28 px floor declared, not enforced | A 10 | checks |
| 31 px subtitle is 16:9, not 9:16 | A 8.6 | format scale |
| the song is -15.6 LUFS, not -14 | C 8 | song mode is R; voice mode is -14 |
| the source has no paper physics simulation | B 3.5 | authored event, not simulation |

---

### 3.30 Performance frame and stage grammar

The channel is a **show**, not a fable, a diagram or a scrapbook. The reference is a K-pop performance: a star, a stage, a chorus, a song, an audience, an entrance and an exit. A film that uses the paper grammar but has no performance frame is a Paper Studio short, not Paper K-pop. This is the gap the blind test found.

#### Performance modes

| Mode | What it is | When | Must still have |
|---|---|---|---|
| **stage-show** (default, I for a song film) | a song performance on a stage | music film, song drop, tour announce | star, stage, chorus, song, entrance/exit |
| **presenter-show** (V, signed) | a host performs an idea on a set | narrated explainer, business model, story short | a host (an MC, not a narrator), a stage/desk, a chorus/audience, a curtain |
| **creature-show** (V, signed) | a paper creature performs a turn | a short gag, a character piece | a stage, a spotlight, an entrance/exit |

A pure fable (a town, a market, a drought) with no stage, host or performance is **not** this style. It may be a Paper Studio film; it is not Paper K-pop. A presenter-show is not a licence for a slide deck: it must still have a stage, a host who performs, and a curtain.

#### Stage grammar (invariant)

| Parameter | Value | Unit | Scope | Basis |
|---|---|---|---|---|
| stage share | >=60% of shots for a song film; >=1 stage shot and >=1 stage shot per act for a 30 s presenter show | ratio | I | film |
| reference mode | the reference is a presenter-show with a stage finale; the default for a new **song** film is stage-show | enum | R | film |
| bpm | 88, offset .21 s, bar 4 | BPM/s | I | code |
| stage shot per act | 1 | count | I | film |
| performer presence | >=85% of shots contain a performer or a performance object | ratio | I | film |
| detail/diagram share | <=40% of shots; a diagram is never the first or last shot | ratio | I | film |
| giant stage object | 1 per film: a sun, a moon, a meter, a tower, a door, a screen; it is the world's scale anchor | count | I | film |
| stage device | proscenium, sunburst, spotlight, LED backdrop, riser, curtain, trapdoor, mic stand | enum | F | code |
| star | 1 lead who addresses the audience, holds a prop/mic, has a signature move | count | I | code |
| chorus | 0-5, identical rig, formation change every 2-4 beats | count | F | code |
| audience | 0-160 silhouettes/confetti; frozen except on cue | count | F | code |
| spotlight | 1-2 practical pools/cones; a duet crosses at 90 deg | count | F | code |
| entrance | the star enters from a door, trapdoor, fold, curtain or the back of the frame | 1 | I | code |
| exit | bow, curtain, pullback or loop; not a freeze | 1 | I | code |
| signature move | one repeatable gesture the star owns (a point, a hair flip, a mic hold) | 1 | I | code |
| performance beat | a pose/formation change every 2-4 beats | rule | I | code |
| show test | remove the story: is there still a performance? | rule | I | human |

#### The show test

Cover the narration and the plot. If the film is still a performance - a star, a stage, a chorus, a song, an audience - it is Paper K-pop. If it becomes a set of diagrams with characters at the edges, it is not.

#### The Uber lesson

The Uber film was a **diagram with office workers in the side bars**. The fix is not "add more colour"; it is "make the business model a performance": the rider and driver are a duo on a paper stage, the fare split is a chorus, the map is a backdrop, the coin is the hook, the audience is the crowd. The diagram can appear, but the performer is the subject. A narrated explainer still has a host and a stage; it is not a slide deck.

#### What may change per film

The stage design, the song, the star's species, the chorus size, the devices, the audience, the entrance/exit, the signature move, the performance mode. The **presence** of a performance frame is invariant.

### 4.1 Shape

The identity is a **compact extension** of the existing pack, not a second document. Each record has an id, a value or range, a unit, a scope, a basis, a measure and a source.

```json
{
  "$schema": "paper-studio/style-identity@1",
  "id": "paper-kpop",
  "version": "1.1.0",
  "status": "research",
  "parameters": [
    {
      "id": "identity.field",
      "value": { "share": [0.18, 0.60], "edgeBarMax": 0.08, "noCreamPlate": true },
      "unit": "ratio",
      "scope": "I",
      "basis": "film",
      "measure": "frame probe",
      "source": "I 3-5"
    }
  ]
}
```

- `value` is a scalar, array or object. `range` is used when the film chooses inside a band.
- `scope` is `I`, `F`, `T`, `R`, `V` or `X`.
- `basis` is `code`, `film`, `crops`, `target`, `proposal` or `format`.
- `measure` names the instrument; `source` names the evidence section.
- No functions, no prose in the value. The prose lives in this document.

**Implementation note:** the companion JSON is **block-based** for readability. Each block carries `scope`, `basis`, `measure` and `source`; the implementation maps the block to the existing `TokensSchema` (leaf-level types, defaults and validation live there). The JSON is a proposal for the nine P0 blocks and the P1 additions, not a second schema engine. If a leaf needs a unit, it is written as `{ "value": ..., "unit": ... }`; if a block is a map of values, the block's unit applies to all leaves.

### 4.2 Where it lives - extend, do not duplicate

| Block | Proposed location | Why |
|---|---|---|
| envelope, medium, palette, light, composition, field, edit, motifs, forbidden | `styles/paper-kpop/tokens.json` -> `identity` | the pack owns the style |
| camera model, vocabulary, travel, seam | `tokens.motion.camera` | camera already lives there; do not add a sixth camera block |
| type roles, sizes, underline, reading, max lines/boxes | `tokens.type` / `tokens.layout` | type already lives there |
| cast archetype, appearance, movement | `library/characters/<id>/poses.json` + `tokens.identity.cast` | the library owns the character; tokens own the rule |
| per-film field script, motif set, framing, camera plan, text behaviour | `films/<id>/score.json` | the film owns its choices |
| measurement | `style:measure` percentiles + region grid; `style:identity` reads them; paint probe bbox | reuse the existing tools |

**Do not create a second identity file, a second camera vocabulary, a second palette or a second type system.** The current pack already has the right containers; they are under-filled, not wrong. The companion JSON is a **proposal for the 9 P0 blocks**, not a 251-field framework.

### 4.3 The minimal additions (P0)

Nine fields close the five named gaps (field, archetype, placement, contrast, motifs) plus edit and forbidden:

1. `tokens.identity.referenceFilm` - the film, not only the crops.
2. `tokens.identity.bands.basis` - `"film"` or `"crops"`.
3. `tokens.identity.filmBands` - luma p5/p50/p95, contrast p5, saturation p95.
4. `tokens.identity.field` - roles, share, horizon, no-bar rule.
5. `tokens.identity.composition` - subject height, centroid, floor, framing mix.
6. `tokens.identity.edit` - min, p10, median, p90, max, cuts/min, cut share.
7. `tokens.identity.cast.archetype` - `paper-pop-performer` plus appearance.
8. `tokens.identity.motifs` - id, min/max shots, roles.
9. `tokens.identity.forbidden` - one machine-readable list.

### 4.4 The P1 additions

- `tokens.identity.light` - model, shadow offset/alpha, contact.
- `tokens.identity.depth` - planes, blur 0.
- `tokens.identity.opening/closing`.
- `tokens.color.field` and `tokens.color.share`.
- `tokens.motion.camera.travelPx`, `movingShare`, `gapShotsMax`, `forbidden`.
- `tokens.type.roleMap`, `maxLines`, `maxBoxesPerShot`, `underline`, `reading`.
- `library.poses.archetype`, `.appearance`.
- score `shots[].motif`, `events[].with/contact/interaction`, `shots[].framing`, `camera.keys`, `paletteScript`.

### 4.5 What not to add

- A new `identity.json` file.
- A second `camera` block.
- A second palette.
- A second type system.
- A generative image/video path.
- A 3D camera.
- A machine-readable "story" inside the style file.
- A 251-record schema where 9 blocks will do.

---

## 5. Measurement and acceptance criteria

### 5.1 Axis-by-axis

| Axis | Measure | Pass band | Tool | Current coverage |
|---|---|---|---|---|
| Dimension | schema | `2.5d-layered`, no 3D keys | style check | partial (declared only) |
| Medium | paper area, edge, halftone share | >=60% paper-coloured; edge 1.5-6 px; halftone 5-40% | frame probe | none |
| Palette | role shares | warm .40-.90; blue <=.20; sat .35-.70; 4-7 roles | frame probe / palette audit | partial (global) |
| Field | largest region, edge bars | field .18-.60; bars <=8%; no cream plate + wings | frame probe | none |
| Light | schema + shadow | +6/+10, .22, blur 0 | schema + human | none |
| Edge | ink band | p10 3-6 px; figure 3x field edge density | frame probe | partial |
| Composition | subject bbox | height .13-.92; centroid .30-.75; floor/cast feet | frame probe | none |
| Scale rhythm | height sd, tiers | sd >=15; >=3 tiers | frame probe | none |
| Cast archetype | library field + performer test | `paper-pop-performer`; 6/6 test | library check | partial (construction only) |
| Cast movement | events | >=1 pose event per shot; 1-3 actions; no dead hold | probe/audit | partial |
| Camera model | score keys | x/y/z/roll/shake or keys; no FOV/DOF | schema | none |
| Camera grammar | move counts | 90% moving target; short 4-6, long 6-10; run <=2; travel bands | camera check | partial |
| Edit | durations | median 2.4-3.2; p10 1.2-1.8; p90 4.4-5.0; cuts 18-24/min | preflight | partial |
| Action | per-shot motion | >=1 non-camera action; floor .6; freeze <=.4 s | motion probe | partial |
| Transitions | counts | cut 80-90%; designed 10-20%; no dissolve | score audit | partial |
| Focus | schema | dof/blur false | schema | none |
| Text | role, size, safe, words, lines, reading | 31 px at 16:9; 8 words; 2 systems; 2 boxes; read time | type audit | partial |
| Text behaviour | score | 2-3 behaviours; enter on word; no lyric wall | score + probe | none |
| Interaction | events | contact anchors; no float | score + probe | partial |
| Sound | LUFS/TP/duck/silence | -14 +/-1; <=-1.5; 4-8 dB; <=-50 | mix/gate | full |
| Voice | wpm/coverage | 180-190; >=.80; first <=1 s | preflight | full |
| Opening/closing | first/last frame | subject-specific; no default; no repeat | frame + score | partial |
| Motifs | recurrence | 3-5; 2-5 uses; <=40% shots | score + probe | none |
| Variation | difference report | 12 axes differ from last 3 films | review | none |
| Tone | review | 8 tone beats; sweet-sinister; one tender beat | human | none |

### 5.2 The two references

The pack currently measures against six **crops** (hero close-ups). The film itself is darker and less saturated:

| Metric | Six crops | The film | Current band | Film fails? |
|---|---|---|---|---|
| luma | 145.8 | 100.9 | +/-20 | -44.9 -> FAIL |
| contrast | 245.8 | 215.4 | +/-25 | -30.4 -> FAIL |
| saturation | 39.8 | 21.8 | +/-10 | -18.0 -> FAIL |
| edges | 10.3 | 12.6 | +/-5 | +2.3 -> pass |
| palette distance | - | 48.3 | <=45 | FAIL |

**Conclusion:** the bands are calibrated to the crops, not the film. A film that looks exactly like the reference would be refused by the current gate. The identity must declare **two references**:
- **surface reference:** the six crops, for material, edge, close-up palette;
- **grammar reference:** the film, for tones, field, composition, edit, camera.

Use the film for luma/contrast/saturation/field/composition/edit; use the crops for the paper surface at hero scale. Do not compare a whole film's mean luma to a hero crop's mean luma.

### 5.3 Proposed film bands

| Metric | Band | Basis |
|---|---|---|
| luma mean | 75-130 | film 100.9 |
| luma p5 | 20-60 | film 39 |
| luma p50 | 80-140 | film 99 |
| luma p95 | 160-200 | film 175 |
| contrast p5 | 175-210 | film 190 |
| saturation | 12-35 | film 21.8 |
| sat p95 | 30-60 | film 45 |
| edges | 7.5-17.5 | film 12.6 |
| palette distance | <=55 | film 48.3 |
| warm share | .40-.90 | film .70 |
| blue share | <=.20 | film .01 |
| subject height | .13-.92 | film 13-92 |
| centroid x | .30-.75 | film .55 |
| local |dL| | >=20 in 75%; median >=35 | film 46.6 |
| blue-on-blue | 0 sustained | film 1/49 one frame |
| side bars | <=8% width | film 0 |
| cuts/min | 18-24 | film 19-20 |
| median shot | 2.4-3.2 | film 2.86-3.06 |

### 5.4 What the current 24-check gate actually proves

It proves: cast construction (anchors, body, 8 poses, 14 expressions), <=2 cast, >=50% shots declare a cast, five global means vs six crops, text safe area, motion floor, rig, sound, ASR, determinism.

It does **not** prove: archetype, background field, subject placement, local contrast, motif language, camera travel, edit distribution, text behaviour, interaction, opening/closing, variation, tone. That is why a film can pass 24 checks and still be ~25% of the channel.

### 5.5 The acceptance test the spec must pass

The test uses the tools that exist, not a hypothetical one:

1. **Reference, no score:** `npm run style:measure -- --ref Y:\NewVideoTest\out\claude-pop.mp4 --camera` must produce luma ~100.9, saturation ~21.8, edges ~12.6, palette distance ~48.3 against the six crops. Record the video sha256. If the measurement does not reproduce, the tool or the reference is wrong.
2. **Uber, with a score:** `npm run style:identity -- films/uber-model/score.json --video` must:
   - pass the **surface** bands (paper, edge, palette family, type);
   - fail **field** (cream plate + 19% side bars), **centroid x** (0.136), **height sd** (fixed 57.8%), **local luma contrast** (12.6), **motifs** (network diagrams, no motif language), and **blue-on-blue** (7/10 tiles);
   - record the video sha256.
3. **Reference, bands:** the six reference crops must pass the **surface** bands. The film must pass the **film** bands. If the film fails a film band, the band is miscalibrated.
4. **Uber, bands:** if Uber passes a field/placement/motif band, the band is not a gap check. If Uber fails a surface band that the crops pass, the surface band is too tight.
5. **No silent pass:** a missing band, a null measurement, or a score claim must be a failure, not a pass.

This is the test the first draft lacked. It is deliberately asymmetric: the reference must pass; the failing film must fail on the named axes; the surface must stay in the band.

---

## 6. Applying the identity to a new film

### 6.1 The eleven choices

1. **Performance frame:** stage-show, presenter-show or creature-show; name the star, the chorus, the entrance and the exit.
2. **Story:** 5-9 beats, 3-5 acts; write the spine before the shots.
3. **Set family:** choose 1-3; at least one new.
4. **Field script:** 3-5 field roles, one per act; no repeat in the same position.
5. **Cast:** 1-2 principals + 0-5 chorus; design new characters to the performer test; do not reuse the office pair by default.
6. **Motifs:** choose 3-5; give each a meaning; no default sunflower/banner/lamp.
7. **Camera:** choose 4-6 moves for a short, 6-10 for a long film; assign by beat; write the opening and closing moves first.
8. **Edit:** set the median (2.4-3.2), the chorus/verse split, the min/max, the cut alignment.
9. **Text:** choose 2-3 behaviours; set the subtitle band and the display zone; no lyric wall.
10. **Transitions:** choose 2-3; iris at act boundaries; flash on impacts; no dissolve.
11. **Sound:** song-led or voice-led; measure the master; bind cues to events.

### 6.2 Worked example - a 30 s Uber film, without copying

| Axis | Choice | Why it is the channel |
|---|---|---|
| Performance | presenter-show (V): the rider (MC) hosts a split performance by the driver; 3 paper-coin chorus | a business model performed, not diagrammed; the MC is a performer, not a narrator |
| Story | rider, driver, platform, split, arrival (5 beats) | a rise-and-fall with a hook |
| Set family | stage, city, desk | three worlds, one paper grammar |
| Field script | kraft -> marigold -> cobalt stage (one act) -> cream | a warm rise, one blue act, a resolve |
| Cast | 2 new paper-pop performers: a rider with a helmet-flower (the MC) and a driver with a cap-petal; 3 paper-coin chorus | two principals, not three; the rider hosts the show |
| Motifs | coin, route line, paper phone, fare stamp | 4 motifs; the coin is the hook and recurs 4x |
| Camera | push, track, crash, pull, orbit (5) | a varied sequence, not one move |
| Edit | 10 shots, median 2.8, 1.2-5.0 | a 30 s Short; 9 cuts = 18/min |
| Text | one hook (`THE SPLIT`), three labels; stack and stamp | poster type, not UI |
| Transitions | cut, one iris at the turn, one flash on the split | native paper transitions |
| Sound | voice-led, 5 lines, 88 words, 182 wpm script rate | the narration is the clock; the host performs it |
| Signature | the coin splits into two paper layers and the duo steps through the split | a shot only this film has |

**What this fixes:** the performers are the subject, the business model is the act, the map is a backdrop (never the first frame), the field is full-bleed, the subject is centred, the palette is warm, there are no bars, no blue-on-blue, and the motifs are this film's (coin, route, phone, stamp), not the reference's (sunflower, lamp, banner).

### 6.3 The same-channel test

Run the ten questions in 3.24 on the final sheet and on the delivered video. A machine can measure the numbers; a person must answer "does it feel like the channel?".

---

## 7. The gap - why the Uber film is ~25%

The user's "~25%" is a judgement. Measured against the reference on 12 axes, the Uber film fails five: **archetype, field, placement, local contrast, motifs**. The three largest measurable gaps are placement, field and blue-on-blue.

| Metric | Canonical | Uber | Delta | What it means |
|---|---|---|---|---|
| character height | 55.2% median; 13-92% range | 57.8% fixed in all 30 samples | +2.6 median, **no range** | the size is right; the rhythm is gone |
| centroid x | .55 | .136 | **-.40** | the cast is pinned inside the left bar |
| side bars | 0 | 19.0% left + 19.5% right | **+38.5 pts** | 38.5% of every frame is a UI frame |
| blue share | .01 median / .044 mean | .179 | **+.135** | blue is a field, not an accent |
| figure-blue | .03 | .783 | **+.75** | the character is blue on blue |
| blue-on-blue | 1/49 (2%) | 7/10 tiles; 25/30 frames (83%) | **+81 pts** | the character disappears |
| local |dL| | 46.6 | 12.6 | **-34.0** | the figure does not separate |
| largest flat field | .14 | .268 | **+.128** | the plate is flatter and emptier |
| mean luma | 91.1 | 146.8 | +55.7 | cream plate, no deep darks |
| field colours | 54 in 54 shots | 1 plate | - | no colour script |
| motifs | sunburst, petals, halo, stamps, iris | network/map diagrams | - | the motif language is absent |
| archetype | paper-pop performer | office worker | - | the cast is the wrong type |

**The five failures:**
1. **Archetype.** Kiran and Vaz are the right construction, wrong performer type. The gate checked anchors, not archetype.
2. **Field.** A cream plate with cobalt/tomato wings is a diagram layout. The reference is a full-bleed world with 54 field colours.
3. **Placement/scale.** The cast is at the far left, fixed at 57.8% height. The reference is centre-right, 13-92%, with a scale rhythm.
4. **Contrast.** The blue figure sits inside a blue bar at 12.6 local luma; the reference separates at 46.6.
5. **Motifs.** The Uber film has route maps and revenue tiles; the reference has sunbursts, petals, halos, stamps and irises. The diagram is the subject, the performer is decoration.

**What would need rebuilding (not implementing now):** the cast archetype and costume, the field/set system, the composition/placement, the motif language, the palette script and the camera plan. The story, the narration, the 30 s structure and the Uber facts can stay.

**What would not:** the paper material, the type families, the subtitle band, the hard shadow, the cut rhythm, the mix. Those are already in the channel.

---

## 8. What already exists, and the minimal change

### 8.1 Existing

- `styles/paper-kpop/tokens.json`: medium, colour, type, layout, motion, identity (5 bands, cast rule), sound, seed.
- `styles/paper-kpop/STYLE.md`: the written contract.
- `capabilities.json`: rigs, assets, limits, proof.
- `library/characters/*/poses.json`: 8 poses, 14 expressions, body, anchors.
- `score.json`: cast, shots, camera, direction, visual, slots, events.
- Checks: `style:identity`, `style:measure`, `camera:check`, `audit:type`, `audit:motion`, `audit:rig`, `audit:body`, `audit:reaction`, `audit:palette`, `preflight`, `collage`, `inspect`, `determinism`, `mix`, `gate:7`.

The containers are right. The values are incomplete and the gate reads only five global means.

### 8.2 The minimal change (P0, nine fields, no new tool)

1. Extend `tokens.identity` with `referenceFilm`, `bands.basis`, `tones`, `field`, `composition`, `edit`, `cast.archetype`, `motifs`, `forbidden`.
2. Validate the identity block in `style:check` (a missing band is an error, not a silent pass).
3. `style:measure` adds p5/p50/p95 and a 3x3 region grid; `style:identity` reads the new fields.
4. The paint probe records a character bbox (min/max of the rig anchors) so placement/height can be measured from the drawn frame, not the score.
5. `camera:check` reads `tokens.motion.camera` for the move vocabulary and checks travel for pan/orbit as well as push/pull.
6. `type-audit` reads the bottom 12% band, the role map and the reading time.
7. `palette-audit` reads `tokens.color` (roles, shares) instead of a hardcoded hue ban.
8. `library` gains `archetype` and `appearance`; `style:identity` compares them to the rule.
9. `score` gains optional `motif`, `framing`, `events[].with/contact/interaction`.

No new framework, no new identity file, no second camera/type/palette. This is an extension of the existing system, not a replacement.

### 8.3 What not to do

- Do not add a 200-field schema that no check reads.
- Do not add a second camera vocabulary.
- Do not add a second palette.
- Do not add a generative image/video path.
- Do not gate on prose.
- Do not compare a whole film's mean luma to a hero crop.
- Do not freeze the reference's instances (its subtitle band, its P(DOOM) meter, its sunflower).

### 8.4 Supersedes (contract change)

The spec is not a pure extension: it changes values the pack has signed. Those changes are a **contract change** and must be reviewed by both owners.

| Existing field | Current value | Proposed value | Why |
|---|---|---|---|
| `tokens.color.maxColours` | 4 | 5 for a short, 7 for a long film | the reference uses 4-7 roles; 4 rejects its own cast |
| `capabilities.limits.maxCast` | 2 | 2 principals + 0-5 chorus, total 7 | the reference chorus has 5 |
| `tokens.motion.camera.moves` | 5 | 11 allowed; a film uses 4-6 short / 6-10 long | crash, whip, track, tilt, roll, handheld, world are missing |
| `tokens.motion.transitions` | 5 | 6, adding `flash` | the reference uses 38 flashes; the pack has no name for them |
| `tokens.type.scale` | 18 caption | 31 px at 16:9; 16 px at 9:16; 14 px floor at 390 | the source's subtitle is 31 px at 1080 |
| `tokens.motion.minShot` | 1.2 s | 0.6 s scene / 0.22 s micro | the reference has 0.66 s scenes and 0.22 s graphic devices |
| `tokens.identity.bands` | delta bands vs six crops | keep as **surface** bands; add `filmBands` for the film | the reference fails the crop bands 4/5 |
| `tokens.identity.dimension` | `2d` | `2.5d-layered` | the source has a z/roll camera and five layers |

**This is not implemented.** The current `style:identity` still uses the five crop-delta bands and still passes the Uber film. The spec's acceptance test (5.5) is the target; the current gate is the thing it replaces.

---

## 9. Open questions

1. **2.5D parallax variant:** the source has no true parallax; a three-plane variant is allowed only if declared. The style owner must decide whether the channel wants it.
2. **Cast count:** the reference chorus has 4-5; the pack limits 2. The identity proposes 1-2 principals + 0-5 chorus, total <=7. This is a product decision.
3. **Music:** parked. A song film uses a licensed track; a narrated film has no score yet.
4. **Semantic vision:** a machine can measure the field, placement, contrast and motifs; it cannot judge whether the joke lands or the character reads as an idol. The sheet and the director remain the final sign.
5. **Props/sets library:** the source has 40 props and 9 sets; the pack has 18 assets. The identity defines the standard, not the full library.
6. **9:16:** the source is 16:9; the pack has a 9:16 re-stage. The 9:16 composition bands need a separate measurement; do not crop the 16:9.
7. **Exact face/archetype detection:** the current probe can measure a bbox, not "is this an idol?". Archetype stays a library declaration + human review until a semantic check exists.
8. **Tone:** "sweet-sinister" is a human judgement. A machine can check the palette tension and the tender beat, not the joke.

---

## 10. Evidence index

| File | What it proves |
|---|---|
| `A-engine.md` | every engine constant: paper, palette, light, camera, motion, edit, type, HUD, determinism |
| `B-cast-sets.md` | cast construction, movement, sets, props, 51-scene staging table, contracts |
| `C-edit-camera-sound.md` | the 720p PDoom edit, used only as a comparison; the canonical numbers are in A and I |
| `D-lemo.md` | how 59 style packs encode identity; the schema lesson: prose is not enough |
| `E-kits.md` | two code-first kits; camera/transition/sound schema; what transfers to paper |
| `F-vizavi.md` | motion/camera/transition/storyboard/sound taxonomy; what is code-encodable |
| `G-studio-gap.md` | the current pack/score/check inventory; 2 full, 28 partial, 5 missing |
| `H-youtube.md` | the two YouTube links are tutorials for a different channel; the pack's source is `out/claude-pop.mp4` |
| `I-frames.md` / `.json` | 162 frames measured: height, centroid, field, palette, contrast, blue-on-blue, Uber gap |
| `J-skills.md` | HyperFrames/critics/prompts; the 9/10 identity bar and the P0 gap list |
| `critique-creative.md` | creative director: tone, archetype, variation, bands |
| `critique-technical.md` | architect: duplication, scope, arithmetic, measurability |
| `critique-motion.md` | editor: camera shares, edit maths, transitions, type/sound |
| `critique-qa.md` | QA: provenance, silent passes, 25% claim |
| `critique-completeness.md` | completeness: missing records, per-element lighting, determinism, HUD |
| `styles/paper-kpop/references/frames` | the six hero crops: surface reference, not the film's average |
| `Y:\NewVideoTest\out\claude-pop.mp4` | the canonical film: 1920x1080, 30 fps, 156.63 s, 4,699 frames |

---

**One sentence:** Paper K-pop is a 2.5D cut-paper pop **performance** where a paper performer is the star, the field is a full-bleed illustrated stage, the palette is warm earth with rationed blue, the camera is a 2D similarity move every shot, the cut follows the voice at a 2.4-3.2 s median, and the type is a paper layer - and every new film must change its story, set, field script, cast instance, motifs, camera sequence, text behaviour, transitions, opening, closing, sound mode and signature shot while keeping those twelve things fixed.
