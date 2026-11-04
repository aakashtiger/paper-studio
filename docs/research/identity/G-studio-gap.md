# G — What the studio already encodes for Paper K-pop identity, and what is missing

**Date:** 4 November 2026
**Scope:** `styles/paper-kpop`, `src/engine`, `src/core`, `scripts`, `films/uber-model`, `library/characters`.
**Reference:** `Y:\NewVideoTest\out\claude-pop.mp4` (1920×1080, 30 fps, 156.63 s, 4,698 frames) and its code `Y:\NewVideoTest\src`.
**Method:** `npm run style:measure -- --ref <dir|video> --camera`; `style:identity` read; every audit script read; the delivered Uber reports read. No repository file was changed except this one. Measurement artefacts are in `build/research/`.

> **Two measurement cautions.**
> 1. `style:measure` on the reference video reports **238 "shots"** (median 0.1 s, 90.8 cuts/min). The 12 Hz paper boil trips its `scene > 0.03` detector. The authored cut list in `src/scenes/*.js` is **51 scenes, 156.62 s**; that list is used for duration and rhythm below. The global luma / contrast / saturation / edge / palette numbers are unaffected.
> 2. There is a second reference film in the workspace (`Y:\NewVideoTest\ref\source.mp4`, 1280×720/24, analysed in `C-edit-camera-sound.md`). This report uses only the file named in the brief, `out/claude-pop.mp4`, which is the 1920×1080/30 render of `src/`.

---

## 0. The answer in one paragraph

The pack is strong on **look declarations** and **cast construction**, and weak on **identity grammar**. `tokens.json` describes medium, palette, type, layout, motion, sound and five identity bands; `style:identity` reads only the five bands, the cast rule and the staged share. Of the 35 dimensions in the brief, **2 are proved end to end** (cast count and mechanical construction), **28 are partial** (declared, proxied or checked only at score level), and **5 are absent** (background field, archetype, focus/depth, text underline, motif language). The reference film is **outside the pack's own bands on 4 of 5 metrics** (luma −44.9, contrast −30.4, saturation −18.0, palette distance 48.3 against limits 20 / 25 / 10 / 45; edges passes at +2.3). That is not because the film is off-style; it is because the bands were calibrated to **six bright crops**, not to the film. The smallest honest fix is to extend `tokens.identity` and the score schema, validate the identity block, and measure the drawn frame — no new framework.

---

## 1. Existing inventory

Every field that can carry identity, its exact path, its value, and whether anything reads it.

| # | Area | Path | Value / range | Read by |
|---|---|---|---|---|
| 1 | Medium | `tokens.medium.brush` | string: “no brush; every mark is a cut, a tear, a printed edge or a halftone dot” | `style:check`; no film check |
| 2 | Material | `tokens.medium.material` | string: flat cut-paper collage on warm cream card; no gloss, 3D or photoreal | prose only |
| 3 | Light | `tokens.medium.light.direction` | string: hard top-left key, no ambient fill | prose only |
| 4 | Light numbers | `tokens.medium.light.softness`, `.opacity` | `0.5`, `0.2` | `style:check`; painter does not read them |
| 5 | Shadow choice | `tokens.medium.light.paperShadow` | string: Collage vs Print, open choice | prose; recipes name only type shadow |
| 6 | Type shadow | `tokens.medium.light.typeShadow` | string: hard misregistered ink shadow, fixed offset | prose; painter hardcodes |
| 7 | Texture | `tokens.medium.texture` | `0.18` (fibre opacity) | prose; painter hardcodes |
| 8 | Halftone | `tokens.medium.halftone` | `cellMin 14`, `cellMax 22`, `angle 0.2`, `dot 0.55`, `alpha 0.5` | prose; painter hardcodes |
| 9 | Layer order | `tokens.medium.layerOrder` | 11 layers: paper → background → midground → character → foreground → halftone → hud → type → fibre → grain → vignette | prose |
| 10 | HUD | `tokens.medium.hud.lyricBand` | bottom 14%, torn ink/red strip, one caption ≤ 8 words | portrait recipe |
| 11 | HUD | `tokens.medium.hud.meter` | top right, black sticker, beat + four-role bar in DM Mono | `stage_wide` |
| 12 | HUD | `tokens.medium.hud.cornerMarks` | ink, 1.5 px, 16 px arms, inside safe margin | `pullback_close` |
| 13 | Palette | `tokens.color.palettes.day-stage` | `paper #F2E8D5`, `ink #171310`, `red #E8452A`, `blue #203FD8`, `acid #D9F24B`, `accent #F5B93F` | painter `PAL`; `style:check` |
| 14 | Palette | `tokens.color.palettes.night-stage` | `paper #E8DAC0`, `ink #0C0A09`, `red #B92A16`, `blue #122A9B`, `acid #D9F24B`, `accent #FF5E9C` | painter; `style:check` |
| 15 | Palette | `tokens.color.roles` | 6: paper, ink, red, blue, acid, accent | `style:check` |
| 16 | Palette | `tokens.color.default` | `day-stage` | `style:check` |
| 17 | Palette | `tokens.color.maxColours` | `4` | `style:check` only; **no film check** |
| 18 | Type families | `tokens.type.families` | 5 roles, 4 unique families: Anton, Archivo Black, DM Mono ×2, Permanent Marker | `style:check`; painter |
| 19 | Type scale | `tokens.type.scale` | display 64, body 26, caption 18, label 14, monogram 36; line 0.85 / 1.05 / 1.2 | painter `TS()`; `type-audit` reads **label 14** only |
| 20 | Type treatment | `tokens.type.treatment` | cream edge, hard ink shadow, seeded jitter, 12-step boil, flat accent, ragged stack | painter |
| 21 | Type metrics | `tokens.type.treatment.metrics` | `charRot 0.035`, `charY 0.012`, `edge 0.055`, `shadow 0.035`, `shadowAlpha 0.26`, `boilHz 12` | painter `TY.type` |
| 22 | Layout shapes | `tokens.layout.shapes` | 9: card, torn-strip, sticker, sunburst, circle, rule, frame, arrow, burst | recipes |
| 23 | Margins | `tokens.layout.margins` | top .06, right .06, bottom .12, left .06 | prose; `type-audit` reads title-safe **.06** for all edges |
| 24 | Safe zones | `tokens.layout.safeZones` | 5 strings: title-safe 6%, subject-safe central 88%, lyric-safe bottom 14%, meter-safe top-right 26%, 14 px floor | `type-audit` parses only “title-safe 6 percent” |
| 25 | Words | `tokens.layout.maxWords` | `8` | `resolveTreatment` (`min` with `capabilities.limits.maxWords`) |
| 26 | 9:16 scale | `tokens.layout.aspectScale.9:16` | display 56, body 24, caption 16, label 14, monogram 32 | `style:check`; recipes |
| 27 | 9:16 boxes | `tokens.layout.aspectBoxes.9:16` | 38 named boxes `{x,y,w,h}` in 0–1 | recipes' `vertical` maps; `card-audit` |
| 28 | 9:16 rules | `tokens.layout.aspectRules.9:16` | anchors, contain/cover, rules 1.5–2 px, nested insets | prose |
| 29 | Clock | `tokens.motion.timing` | BPM 88, offset 0.21 s, bar 4, 30 fps | `style:check`; no film check |
| 30 | Camera grammar | `tokens.motion.camera.moves` | 5: static, push_in, pull_back, pan, orbit | `style:check` for **recipes**; `camera:check` ignores this list |
| 31 | Camera grammar | `tokens.motion.camera.default` | `push_in` | `style:check` |
| 32 | Camera grammar | `tokens.motion.camera.requireMove`, `.minDistinct`, `.maxRun` | `true`, `3`, `2` | `camera:check` |
| 33 | Camera by beat | `tokens.motion.camera.byBeat` | hook orbit, setup pan, escalate push_in, turn pull_back, release orbit, button push_in | `camera:plan` (table in `src/engine/camera.ts`) |
| 34 | Easings | `tokens.motion.easings` | 5: easeOut, easeInOut, easeIn, backOut, linear | `style:check`; `camera:check` uses engine list (6, includes `ease`) |
| 35 | Physics | `tokens.motion.physics` | 4: ease, squash, overshoot, anticipation | `style:check`; painter |
| 36 | Transitions | `tokens.motion.transitions` | 5: cut, iris, wipe, hold, match_cut | `style:check`; `treatment.ts` has its own 5-item list |
| 37 | Min shot | `tokens.motion.minShot` | `1.2` s | `style:check`; **not read by `preflight`/`resolveFilm`** |
| 38 | Paper motion | `tokens.motion.paper` | squash .12, overshoot .18, anticipation .1, fibreBoilHz 12 | prose; painter hardcodes |
| 39 | Sound | `tokens.sound` | 6 prose keys: music, foley, silence, voice, mix, assets | prose; no film check |
| 40 | Seed | `tokens.seed` | seeded 7, fixed 4, jitterHz 12 | prose; determinism uses score seed |
| 41 | Identity | `tokens.identity.dimension` | `"2d"` | `style:identity` copies to report; **not checked** |
| 42 | Identity | `tokens.identity.reference` | `references/frames` | `style:identity` → `style:measure` |
| 43 | Identity | `tokens.identity.bands` | luma 20, contrast 25, saturation 10, edges 5, palette 45 | `style:identity` |
| 44 | Identity | `tokens.identity.cast` | max 2, stagedRatio 0.5, posesMin 8, expressionsMin 14, anchors 6 | `style:identity` |
| 45 | Pack identity | `capabilities.identity` | id `paper-kpop`, version `0.2.0`, family `paper`, status `reviewable`, 3 bindings | `resolveFilm` (id/version), `style:check` |
| 46 | Limits | `capabilities.limits` | aspects 16:9/9:16, durations 30/45/60, maxCast 2, maxWords 8 | `resolveFilm` reads aspects/durations; `maxWords` read; **maxCast not read** |
| 47 | Adaptation | `capabilities.adaptation` | 8 prose keys: aspects, vertical, type, photographs, captions, scripts, sound, slots | `style:check`; prose |
| 48 | Assets | `capabilities.assets.starterLibrary` | 18 entries: set 5, prop 5, frame 1, texture 2, character 2, hud 3 | `assets:*` |
| 49 | Rigs | `capabilities.assets.rigs` | lead + second: construction prose, 11 joints, 8 anchors | `style:check`; `style:identity` reads pose files, not this |
| 50 | Runtime | `capabilities.runtime.primitives` | 8: layer, shape, path, text, image, camera, effect, transition | `style:check` |
| 51 | Proof | `capabilities.proof` | status `declared`, 22 frame ids, 2 aspects, 17 prose metrics | `style:check` validates the shape only; **no command checks the claims** |
| 52 | Governance | `capabilities.governance` | 1 open choice (`paper-shadow`), 17 decisions | `style:check`, review |
| 53 | Score | `score.id/.style/.styleVersion/.aspect/.fps/.duration/.seed` | — | `resolveFilm` |
| 54 | Score | `score.edit` | `minShot`, `medianShot`, `maxShot` in seconds | `resolveFilm` (median ±25%) |
| 55 | Score | `score.clock` | music / narration / sfx / realtime / reading / free | `resolveFilm`, `preflight`, `audit` |
| 56 | Score | `score.audio` | narration, music, sfx `{cues, silences}` | `resolveAudio`, `audit`, `mix` |
| 57 | Score | `score.captions` | source + lines `{id,text,start,end}` | `checkCaptions`, `audit`, `asr` |
| 58 | Score | `score.assets` | `AssetRef {id,type,version,hash,source,anchors,path,character?}` | `resolveAssets`, `assets:coverage` |
| 59 | Score | `score.cast` | `{character, poses, rig?}` | `resolveFilm`, `style:identity`, `audit:body` |
| 60 | Score | `score.shots[]` | `beat?`, `scene?`, `visual?`, `recipe`, `duration`, `slots`, `camera?`, `motion?`, `transitionOut?`, `direction` | `resolveFilm`, all audits |
| 61 | Score | `score.shots[].visual` | `shows`, `action`, `focus`, `link`, `why` (all strings) | `visual:check` |
| 62 | Score | `score.shots[].camera` | `move`, `from`, `to`, `ease` | `camera:check`, painter `shotCam` |
| 63 | Score | `score.shots[].direction` | `entry`, `exit`, `spine`, `cast?`, `events` (≥3) | `checkDirection`, `preflight` |
| 64 | Score | `score.shots[].direction.events[]` | `t`, `kind` (free string), `note`, `quiet?`, `who?`, `pose?`, `expression?`, `breakdown?`, `word?` | `checkDirection`, `audit:reaction`, SFX binding |
| 65 | Library | `library/characters/<id>/poses.json` | character, rig, body (e.g. Kiran: arm upper 92 / fore 78 / minElbow .02; hand 18×26, thumb 8×12), 8 anchors, 4 colours, 8 poses, 14 expressions | `resolvePoseLibrary`, `style:identity`, `audit:body`, painter |
| 66 | Library index | `library/characters/index.json` | id, name, rig, poses path, version, source, licence, hash | `audit:body`, `library:*` |
| 67 | Recipes | `styles/paper-kpop/recipes/*.json` | 22 files: `id`, `beatRoles`, `duration {min,max,default}`, `camera`, `slots`, `optionalSlots?`, `assets`, `composition[]`, `vertical[]`, `transitionOut`, `failureModes`, `motion?`, `subjects?` | `style:check`, resolver, painter |

There is **no `capabilities.recipes` block**. The recipe list is the directory (`recipes/*.json`, 22 files); `capabilities.proof.frames` repeats 22 recipe ids. That is the only place the pack enumerates recipes, and it can drift from the directory.

---

## 2. Coverage matrix — 35 identity dimensions

**Legend:** `full` = a check reads the field and can refuse a film; `partial` = a field exists but is prose, a proxy, or only checked at score level; `none` = no field and no check.

| # | Dimension | Existing field / check (exact path) | Coverage | What is missing | Where it should live |
|---|---|---|---|---|---|
| 1 | Dimension: 2D / 2.5D / 3D | `tokens.identity.dimension: "2d"`; `medium.material`; `capabilities.runtime.primitives` | partial | `dimension` is copied to the report, never checked; `image` primitive could paste a photo; no 3D/photo scan | `tokens.identity.dimension` + a forbidden check |
| 2 | Medium / material | `tokens.medium.material`, `.brush`, `.layerOrder`; `capabilities.assets.grammar` | partial | declared, not measured: paper area, cut edge, halftone share, no gloss/3D | `tokens.medium` + `style:measure` regions |
| 3 | Palette roles | `tokens.color.palettes.*`, `.roles`, `.default`, `.maxColours`; `scripts/palette-audit.ts`; `style:measure` palette | partial | no role share; no field role; `maxColours` unenforced; palette-audit uses a hardcoded 70–170° hue ban, not the tokens | `tokens.color` + palette-audit |
| 4 | Background field | none; `bgPaper()` in `canvas/recipes.js` fills `PAL.paper`; `layout.safeZones` | none | no field role, coverage share, horizon or pattern; the reference uses gold, red, cream and black fields | `tokens.identity.field` |
| 5 | Light | `tokens.medium.light.{direction,softness,opacity,paperShadow,typeShadow}` | partial | one prose key, no per-shot light, no measured key direction | `tokens.identity.light` (+ optional `score.shots[].light`) |
| 6 | Contrast / tonal distribution | `style:measure.contrast` (`YMAX−YMIN` mean); `tokens.identity.bands.contrast ±25` | partial | global range proxy only; no p5/p50/p95, no local contrast; band calibrated to 6 crops | `tokens.identity.tones` + `style:measure` percentiles |
| 7 | Shadows | `medium.light.paperShadow`, `.typeShadow`; `type.treatment.metrics.shadow/.shadowAlpha`; recipe `paper()` shadow args | partial | no shadow offset/alpha/colour tokens; no contact-shadow audit; reference is Collage, pack leaves it open | `tokens.identity.light.shadow` |
| 8 | Outlines / edges | `medium.material` “visible cut edges”; `type.treatment.edge`; `metrics.edge .055`; `style:measure` edges ±5 | partial | no per-layer edge width/colour; global edge density only | `tokens.identity.material` / `medium` |
| 9 | Texture | `medium.texture 0.18`; `medium.halftone`; `layerOrder` fibre/grain/vignette; `motion.paper.fibreBoilHz 12` | partial | grain/fibre/vignette levels not in tokens; no per-shot texture or halftone share; painter hardcodes | `tokens.medium` |
| 10 | Composition / framing | `layout.margins`, `.safeZones`, `.shapes`; recipe `composition` ops; `aspectBoxes.9:16` | partial | no framing taxonomy (wide/medium/close shares), horizon/ground line, one-cluster rule or negative-space rule; no check | `tokens.identity.composition` |
| 11 | Subject placement / scale | recipe JSON `composition` x/y/w/h for 9 legacy recipes; procedural recipes hardcode positions (`portrait` x1000 y1160 scale1.30; `stage` leadX 560/300); `collage` only records `drew` | partial | no subject box, centre tolerance or height-share band; no probe bbox | `tokens.identity.composition` + paint-probe bbox |
| 12 | Character archetype | none; `STYLE.md` prose “paper performer”; `capabilities.assets.rigs` construction prose; `tokens.identity.cast.anchors` | none | no archetype/silhouette/head/role; a worker, a robot and a flower all pass the anchors | `tokens.identity.cast.archetype` + library `archetype` |
| 13 | Character construction | `tokens.identity.cast.{anchors, posesMin 8, expressionsMin 14}`; `capabilities.assets.rigs.{construction,joints,anchors}`; `style:identity`; `audit:body`; `audit:rig`; `library:check` | full (mechanical) | visible eyelets, layer count and head/hair anchors are prose, not measured | library + `tokens.identity.cast` |
| 14 | Character appearance | library `colors {shirt,trouser,hair,skin}`; 14 expressions; rig draw | partial | no costume-role mapping, hair/head contract, proportions or no-photo rule | library `appearance` + `tokens.identity.cast` |
| 15 | Character movement | `score.shots[].direction.events` pose/expression/breakdown; `tokens.motion.physics`; `livingPose`; `audit:rig`; `audit:reaction`; `audit:motion` | partial | no gesture vocabulary, per-character movement band or contact; `kind` is free text | `tokens.identity.cast.movement` + score events |
| 16 | Cast count | `capabilities.limits.maxCast 2`; `tokens.identity.cast.max 2`; `style:identity` | full | `resolveFilm` does not read `maxCast`; two duplicate limits; reference chorus has 4+ | one limit (`capabilities.limits.maxCast`) read by resolver |
| 17 | Props / sets standards | `capabilities.assets.starterLibrary` (18); recipe `assets`; `assets:list/check/coverage/new`; `placeProp`, `office*` | partial | no style standard for prop scale/role, set field role or set anchors | `capabilities.assets` + `tokens.identity.props` |
| 18 | Camera vocabulary | `tokens.motion.camera.moves` (5); `src/core/style.ts CAMERA_MOVES` (7: adds tilt, parallax); `camera:check`; `camera:plan`; painter `shotCam` | partial | token omits tilt that `STYLE.md` promises; score can use tilt/parallax because `camera:check` reads the engine list, not the token; no crash/whip/track/roll | `tokens.motion.camera` + score |
| 19 | Camera frequency / gaps / travel | `motion.camera.requireMove`, `.minDistinct 3`, `.maxRun 2`, `.byBeat`; `camera:check`; `style:measure --camera` dx/dy/dz/movingShare; `style:identity` ignores camera | partial | travel is checked only for push/pull; a pan/orbit with `from = to` passes; no travel px, gap or measured reconciliation | `tokens.motion.camera` bands + `camera:check` |
| 20 | Shot duration min/median/max/distribution | `tokens.motion.minShot 1.2`; recipe `duration.min/max` (1.2–10); `score.edit`; `preflight.pacing` (median [2.5,3], max 2× median, <0.4 warn, grid); `resolveFilm` median ±25% | partial | no p10/p90 or distribution shares; style `minShot` not read; three different max values (5.5 prose / 8–10 recipe / 6.2 reference) | `tokens.identity.edit` + `score.edit` |
| 21 | Per-shot action / motion amount | `score.shots[].direction.events` ≥3 and one after 1/3; `motion.note`; `probe:motion`; `audit:motion` floor 0.6; `inspect` | partial | floor only, no upper band; subject vs camera motion not separated; no action-count or “one continuous action” rule | `tokens.identity.edit.motion` + audits |
| 22 | Focus / blur / depth | none; no blur in `EFFECTS`; only `vignette` | none | no declaration that there is one plane and no blur; a future blur effect would pass | `tokens.identity.depth` + forbidden |
| 23 | Continuity vs hard cuts | `tokens.motion.transitions`; `score.shots[].transitionOut`; `treatment.ts TRANSITIONS`; `frame-audit` cuts on shots | partial | no cut share, match-cut target, 180° line or cut-on-action; `match_cut` is a name with no target | `tokens.identity.continuity` + score |
| 24 | Transitions | same fields; `checkRecipe` validates the 5; `frame-audit`; `style:check` | partial | no duration/geometry (wipe 0.6 s, iris radius), no share band; no dissolve is enforced | `tokens.motion.transitions` objects |
| 25 | Text behaviour | `tokens.type.families`, `.scale`, `.treatment`; `layout.maxWords 8`; `capabilities.limits.maxWords 8`; `type-audit`; `checkCaptions` | partial | role→family and role→size not enforced (only the 14 px floor); no max lines, tracking, case or lyric-wall check | `tokens.type` + `type-audit` |
| 26 | Text box | `layout.aspectBoxes.9:16` (38); recipe `text` ops x/y/w/h; `type-audit` safe area; `STYLE.md` lyric band | partial | no 16:9 box map; no padding/rotation/edge per role; bottom 12% not enforced (audit uses 6% all edges) | `tokens.type.box` / `layout` |
| 27 | Text underline | none; `layout.shapes` has `rule`; `aspectBoxes` has *Rule boxes | none | no underline/progress hairline role, width, offset or animation; reference subtitle has a progress hairline | `tokens.type.underline` |
| 28 | Text animation | `type.treatment.jitter`, `.boil`, `.metrics`; recipe per-char `appear`; `motion.easings` | partial | no per-role enter/exit, stagger or hold; no check | `tokens.type.animation` |
| 29 | Element interaction | `score.shots[].direction.events` (`kind` free, `note`, `who`, `pose`, `expression`, `word`, `quiet`); `audit:reaction` | partial | no `with`, `contact` or interaction type; a typo in `kind` is accepted; no hand–prop contact check | score `events[].with/contact/interaction` |
| 30 | Sound / music / SFX | `tokens.sound` (6 prose keys); `motion.timing` 88 BPM; `score.audio`; `scripts/sfx.ts`; `audit.ts`; `mix.ts`; gate rows | partial | music is prose only (no music path); no style cue-kind allowlist or cue density; tokens say 4 dB duck, score uses 8 dB | `tokens.sound` + score |
| 31 | Narration wpm / style | `story.json` pace `wpm [180,190]`, coverage 0.8, hole 2.5; `preflight.narration`; decision 0043 | partial | no token; film-level only; no voice register (spoken vs sung) or first-word rule | `tokens.identity.voice` + story |
| 32 | Edit rhythm | `motion.timing` (88/0.21/4/30); `score.edit`; `preflight.pacing`; `frame-audit`; `style:measure` cuts/min | partial | no cuts/min or cut-share band; scene detector fails on the 12 Hz boil; no beat-quantisation check | `tokens.identity.edit` |
| 33 | Opening / closing | `visual:check` `visual:opening` (refuses default `paper_open`); recipes `paper_open`, `loop_card`, `pullback_close`; `STYLE.md` “first image from subject” | partial | no closing rule (resolve/loop/hold); the check only sees the recipe id, not whether the opening is subject-specific | `tokens.identity.opening` / `.closing` |
| 34 | Motif language | none in tokens; `docs/STYLE-IDENTITY.md` prose list (banner, sticker, window, lamp, clock, stack); `recipes:list --subject`; `visual:check` subjects | none | no motif table, recurrence, meaning, mandatory/optional or per-shot limit; no check | `tokens.identity.motifs` + `score.shots[].motif` |
| 35 | Forbidden moves | `STYLE.md` §Refusals (13); `BRIEF.md` §11; `capabilities.governance.decisions`; mechanical: `TRANSITIONS` (no dissolve), `camera:check` (no static), `maxWords`, `maxCast`, `palette-audit` hue ban | partial | no machine-readable list; gloss/3D/photo/lyric-wall/serif not checked; the hue ban is a separate hardcoded rule | `tokens.identity.forbidden` + one check |

**Count:** 2 full, 28 partial, 5 none. The five `none` are the ones the user named as unproven: background field, archetype, focus/depth (a declaration gap), text underline and motif language.

---

## 3. What the gate actually proves

### 3.1 The check inventory

| Command | What it actually proves | What it cannot prove |
|---|---|---|
| `preflight` | story, beats and scenes parse; median shot in the story band; longest shot ≤ 2× median; frame grid; narration wpm/coverage/hole; one cue does not own the film; cast asset exists; shot bound to beat/scene/reason | duration distribution; camera; style; field; placement; motif |
| `audit` | score-level contracts: events/cues/captions; known SFX kinds; cue frames; silences; caption read time; SRT count | anything visual |
| `camera:check` | every shot names a **dynamic** move; move/ease are in the **engine** vocabulary; push/pull sign and delta; ≥3 distinct moves; run ≤2 | travel for pan/orbit; measured camera; tilt/roll/crash/whip; reference camera |
| `visual:check` | every shot has a visual brief; recipe `subjects` match the brief; scene link; default opening refused; one recipe ≤ 40% of shots | whether the picture matches the brief; archetype; motif |
| `style:identity` | cast construction; cast count; ≥50% staged (score claim); 5 global means vs 6 crops | archetype, field, placement, local contrast, motif, camera, edit, text, sound, opening/closing |
| `audit:body` | arm lengths; hand/thumb ratio; elbow bend | eyelets, layers, appearance, archetype |
| `audit:reaction` | `event.word` within 0–3 frames of the measured line start | visual contact/interaction |
| `probe:motion` / `audit:motion` | per-shot motion floor 0.6; dead seconds; travel | upper band; subject vs camera split |
| `inspect` | motion + type + rig in one probe pass | style |
| `determinism` | 30 sampled frames serial vs parallel byte-identical | style; the whole film |
| `collage` | one frame per shot; `cast` vs `drew`; flatness colour count/stddev; text box count; no blank/duplicate | placement, field, archetype |
| `storyboard` | one frame per shot | style |
| `audit:type` | text boxes inside 6% safe area; copy at the 69 px floor; copy matches the score | role family/size; bottom 12%; max lines; box; underline |
| `audit:rig` | leg solve vs draw; foot landing; knee bend/direction; ankle pop; anchor seam | arms (body audit); appearance; performance |
| `audit:palette` | no saturated hue 70–170°; clipping ≤ 2%; every frame | token palette roles; field; `maxColours`; the acid role sits at 69° |
| `audit:frames` | 900 frames; no blank; cuts on shots; no long holds; no pop; manifest | style |
| `paint-match` | 31 frames in fresh browsers match the delivered picture | style |
| `mix` / `gate:7` | loudness, duck, cue level, silence, tail, delivered audio; reports tied to the video hash | music; style |
| `asr` | 100% of script words heard | delivery/style |
| `gate:7` | 24 checks; every reused report tied to the frozen video | the identity axes |

Not in the table: `assets:coverage` (every recipe asset is in the manifest), `sheet` (character/pose sheet; human review), `strips`/`board`/`storyboard` (review images), `sfx` (cue generation), `deliver` (mux and measure), `film:review` (summary and report reuse), `rough`/`draft`/`animatic` (review aids). None of them reads `tokens.identity`; `sheet` and `strips` are where a person sees the look, not where a command proves it.

### 3.2 `style:identity`, line by line

What it reads:

- `tokens.identity.dimension` → copied to the report, **never compared**.
- `tokens.identity.bands` → five means; a missing key or a `null` measurement is **skipped, not failed**.
- `tokens.identity.cast` → `max`, `stagedRatio`, `posesMin`, `expressionsMin`, `anchors`.
- `score.cast` → pose file exists, is for the character, has `body`, ≥8 poses, ≥14 expressions, the six anchors; `resolvePoseLibrary` errors.
- `score.shots[].direction.cast` → staged count (a **score claim**, not a paint claim).
- `style:measure` → the five deltas against `references/frames`.

What it proves:

1. The cast is built to the mechanical paper-puppet contract: `style:identity` checks anchors, body, 8 poses and 14 expressions; `audit:body` checks arms/hands; `audit:rig` checks legs and anchors.
2. At most two cast members.
3. At least half the shots **declare** a cast.
4. Five global means are within the declared bands of six reference crops, if the measurement returned a number.

What it does not prove, in the user's terms:

| Axis | Verdict | Why |
|---|---|---|
| **Archetype** | **No** | It checks anchors, body, pose/expression counts. A worker, a robot and a flower all pass. Nothing records silhouette, head construction, hair, costume roles or role (lead/foil). |
| **Background field** | **No** | There is no field token. `bgPaper()` fills cream. The reference uses gold, red, cream and black fields; no check sees the field. `collage` records a colour count, not where the field is. |
| **Placement** | **No** | `type-audit` checks **text** placement; `collage` checks the cast was drawn, not where. No subject box, centre tolerance or height share. |
| **Contrast** | **Only as a global mean** | `style:measure` contrast is `YMAX−YMIN` per frame, averaged, compared ±25. It cannot see local contrast, a flat mid-tone film, or deep darks. The reference film is 30.4 below the crops and would fail. |
| **Motif language** | **No** | No motif token, no score field, no recurrence rule. `visual:check` checks subject words against recipe `subjects`, not motifs. |

Three additional facts the gate does not advertise:

- **The identity block has no schema.** `TokensSchema` has `.passthrough()`; `tokens.identity` is not validated. A typo in `identity.bands.palette` makes `limit` `undefined` and `Math.abs(value) > undefined` is `false` — a **silent pass**. A `null` palette/edges measurement is also a silent pass.
- **`stagedRatio` is a score claim.** A shot that declares `cast: ["Kiran"]` but whose recipe never draws the character counts as staged. `collage` catches that for one frame per shot; `style:identity` does not read `collage`.
- **The pre-render and post-render reports are different tests.** `style:identity` defaults to the collage frames (one per shot; 10 for Uber); `film:review --gate` re-runs it on the 4,698-frame video. A film can pass the first and fail the second. The gate's `videoHash` row forces the video report, so the pre-render report is only an early warning.

---

## 4. Duplication and over-engineering risks

1. **Camera is in five places.** `tokens.motion.camera` (grammar), each recipe's top-level `camera`, each recipe's `composition` camera op, `score.shots[].camera`, and the painter's `shotCam` (which invents 14 px orbit drift and 46 px pan). Adding `identity.camera` would be a sixth. **Extend `motion.camera` and make `camera:check` read it; do not add a second camera block.**
2. **Shot duration is in five places.** `tokens.motion.minShot`, recipe `duration`, `score.edit`, story `pace.medianShot`, and `preflight`'s constants. Adding a sixth is the failure mode. **One `tokens.identity.edit` band; `preflight` defaults to it; `score.edit` is the film's narrower choice.**
3. **Palette is in four places.** `tokens.color`, the painter's `PAL`, `palette-audit`'s hardcoded 70–170° hue ban, and `style:measure`'s palette distance. **Make `palette-audit` read `tokens.color`; derive the forbidden hue from the roles; do not add a second palette check.**
4. **Characters are described in five places.** `tokens.identity.cast` (rule), `capabilities.assets.rigs` (pack rigs), `capabilities.assets.starterLibrary` (character entries), `library/characters/<id>/poses.json` (the character) and `score.cast` (the film). **The library file is the character; `tokens.identity.cast` is the rule; `capabilities.assets.rigs` is the pack's named rig set. Add archetype once, in the library, and compare it to the rule.**
5. **Type is in four places.** `tokens.type.scale`, `tokens.layout.aspectScale`, recipe literal `TS(64)`/`TS(18)`, and `type-audit`'s label floor. **Extend `tokens.type` with role map and max lines; do not add a text system.**
6. **`capabilities.proof.metrics` is a prose duplicate of the checks.** It claims “no gloss/3D”, “banned-token scan”, “all eight recipes” (there are 22), “transition on beat”, “cast count”. Only some are implemented. **Replace it with `proof.checks: [{id, script, what}]` or delete the unproven claims.**
7. **`docs/STYLE-IDENTITY.md` restates values that live in `tokens`** (median 2.5–3 s, palette roles, camera list). It will drift. **Keep it as rationale and link to the token paths; do not make it a second source of numbers.**
8. **`maxCast` and `maxWords` are duplicated** between `capabilities.limits` and `tokens.identity.cast` / `tokens.layout`. The style resolver reads both word limits and takes the min; `resolveFilm` reads `capabilities.limits.maxWords` only; **`maxCast` is read by neither** (only `style:identity` reads `tokens.identity.cast.max`). **One public limit in `capabilities.limits`, read by the resolver; tokens carry the style detail.**
9. **`capabilities.proof.frames` is a duplicate recipe list.** It has 22 ids and the recipe directory has 22; a new recipe can be added and the proof list silently stale. **Read the recipe directory, or say `proof.recipes: "all"`.**

---

## 5. Minimal addition proposal

The proposal is deliberately small: **extend `tokens.identity`, `tokens.color`, `tokens.motion.camera` and `tokens.type`; add a few optional score fields; add two fields to the library character; no new file and no new tool.** `style:identity` reads the new fields; `style:measure` gains percentiles and a 3×3 region grid; `paint-probe` gains a character bounding box. Those are extensions of existing measurements, not a framework.

### 5.1 P0 — the nine additions that close the five named gaps

| # | File / path | Type, unit | Default | What it proves |
|---|---|---|---|---|
| 1 | `tokens.identity.referenceFilm` | string path | `null` | a film-level reference exists, not only six crops |
| 2 | `tokens.identity.bands.basis` | `"frames" \| "film"` | `"frames"` | which reference the bands describe |
| 3 | `tokens.identity.tones` | object of `[min,max]` pairs, luma 0–255 and saturation 0–255 | see below | tonal distribution: deep darks, midtone, highlights, colour punch, local range |
| 4 | `tokens.identity.field` | `{ roles: string[], share: Record<role,[min,max]> 0–1, horizonY: [min,max] 0–1 }` | `{roles:["paper","accent","red","ink"], share:{"paper":[.3,.7]}, horizonY:[.62,.86]}` | background field role and dominance |
| 5 | `tokens.identity.composition` | `{ subjectCentre: number 0–1 of width, subjectHeight: [min,max] 0–1 of height, framingShare: {wide:[..],medium:[..],close:[..]} 0–1 }` | `{subjectCentre:.10, subjectHeight:[.20,.65], framingShare:{wide:[.4,.6],medium:[.2,.35],close:[.05,.15]}}` | subject placement, scale and framing mix |
| 6 | `tokens.identity.edit` | `{ minShot: s, p10: s, median: [min,max] s, p90: s, maxShot: s, cutsPerMinute: [min,max], cutShare: [min,max] 0–1 }` | `{minShot:1.2,p10:1.1,median:[2.5,3.2],p90:4.8,maxShot:6.2,cutsPerMinute:[18,26],cutShare:[.85,1]}` | duration distribution and edit rhythm |
| 7 | `tokens.identity.cast.archetype` | `string[]` | `["paper-doll"]` | the construction class a new character must share |
| 8 | `tokens.identity.motifs` | `{ id: string, minShots: int, maxShots: int, roles?: string[] }[]` | `[]` | motif language and recurrence |
| 9 | `tokens.identity.forbidden` | `string[]` | `["dissolve","shake","handheld","gloss","3d","photo-face","lyric-wall","more-than-4-colours"]` | forbidden moves, in one machine-readable list |

Suggested `tones` defaults, derived from the reference film's own percentiles (luma p5 39 / p50 99 / p95 175; contrast p5 190; saturation p95 45):

```json
"tones": {
  "lumaP5": [20, 60],
  "lumaP50": [80, 140],
  "lumaP95": [160, 200],
  "contrastP5": [175, 210],
  "saturationP95": [30, 60]
}
```

These defaults are the **reference film's** distribution, not the crops'. They will fail the accepted Uber film, and that is the point: Uber's luma p5 is **125** (reference 39, crops 77), p50 **148** (reference 99), p95 **153** (reference 175), contrast p5 **221** (reference 190). The mean-only band passed a film with no deep darks. If the owner chooses the six crops as the target, the p5 test still fails Uber (77 vs 125), so the finding survives the choice of reference; only the p50/p95/contrast bounds change.

Why these nine: they are the fields that make the user's five named gaps **checkable** — `field` (field), `composition` (placement), `tones` (contrast), `archetype` (archetype), `motifs` (motif) — plus `edit` (duration/rhythm, the other unproven axis), `forbidden` (the cheapest guard against the prose refusals), and the two reference fields that stop the bands being calibrated to six crops.

### 5.2 P1 — the fields that make the rest of the list machine-readable

| # | File / path | Type, unit | Default | What it proves |
|---|---|---|---|---|
| 10 | `tokens.identity.cast.appearance` | `{ head: string[], hair: string[], costumeRoles: string[], headToBody: [min,max] 0–1 }` | `{head:["round","flower"],hair:["long","short"],costumeRoles:["red","blue","accent"],headToBody:[.18,.26]}` | character appearance, not only anchors |
| 11 | `tokens.identity.cast.movement` | `{ gestureKinds: string[], minPoseEvents: int }` | `{gestureKinds:["bounce","sway","reach","point","walk","turn","slump"],minPoseEvents:1}` | performance vocabulary |
| 12 | `tokens.identity.light` | `{ key: "top-left"\|"top-right"\|"front"\|"practical", shadowAlpha: [min,max] 0–1, contact: boolean \| "open" }` | `{key:"top-left",shadowAlpha:[.12,.30],contact:"open"}` | light direction and shadow weight; the `paper-shadow` answer is recorded when the director gives it |
| 13 | `tokens.identity.depth` | `{ planes: int, blurPx: number }` | `{planes:1,blurPx:0}` | focus/depth declaration (the reference has no blur) |
| 14 | `tokens.identity.opening` / `.closing` | `{ first: "subject", defaultCard: boolean }` / `{ last: "resolve"\|"loop"\|"hold" }` | `{first:"subject",defaultCard:false}` / `{last:"loop"}` | opening and closing grammar |
| 15 | `tokens.type.maxLines` | integer | `2` | lyric-band line count |
| 16 | `tokens.type.maxBoxesPerShot` | integer | `2` | no lyric wall |
| 17 | `tokens.type.roleMap` | `Record<role, family>` | the existing 5-role mapping | family per role, enforced |
| 18 | `tokens.type.underline` | `{ enabled: boolean, role: string, width: number px, offset: number px, animate: "none"\|"progress" }` | `{enabled:false}` or the reference's progress hairline | text underline |
| 19 | `tokens.type.animation` | `{ enter: "pop"\|"drop"\|"slide", exit: "none"\|"shrink", staggerMs: number }` | `{enter:"pop",exit:"none",staggerMs:35}` | text animation |
| 20 | `tokens.color.field` | string role | `"paper"` | the field role, one name |
| 21 | `tokens.color.share` | `Record<role,[min,max]> 0–1` | `{paper:[.3,.7],ink:[.02,.15],red:[0,.25],blue:[0,.25],acid:[0,.06],accent:[0,.08]}` | role budget per frame |
| 22 | `tokens.motion.camera.travelPx` | `[min,max]` px/shot at 1920 | `[120,600]` | camera travel |
| 23 | `tokens.motion.camera.movingShare` | `[min,max] 0–1` | `[.9,1]` | camera frequency |
| 24 | `tokens.motion.camera.gapShotsMax` | integer | `0` | no camera gaps |
| 25 | `tokens.motion.camera.forbidden` | `string[]` | `["shake","handheld"]` | forbidden camera |
| 26 | `capabilities.limits.maxColours` | integer | `4` | one public frame budget |
| 27 | `library/characters/<id>/poses.json .archetype` | string | `"paper-doll"` | the character's construction class |
| 28 | `library/characters/<id>/poses.json .appearance` | `{ head, hair, skin, costume, headToBody }` | — | the character's appearance, checkable against the rule |

### 5.3 P2 — optional score fields (author only what cannot be measured)

| # | File / path | Type, unit | Default | What it proves |
|---|---|---|---|---|
| 29 | `score.shots[].motif` | string | absent | which motif this shot uses; checked against `identity.motifs` |
| 30 | `score.direction.events[].with` | string (character or prop id) | absent | who/what the event interacts with |
| 31 | `score.direction.events[].contact` | `"hand-left"\|"hand-right"\|"foot-left"\|"foot-right"\|"chest"\|{x,y}` | absent | the contact point |
| 32 | `score.direction.events[].interaction` | `"grab"\|"point"\|"tap"\|"hit"\|"release"` | absent | the interaction type |
| 33 | `score.shots[].framing` | `"title"\|"wide"\|"medium"\|"close"\|"insert"` | absent | framing, if it is not derived from the subject height |
| 34 | `score.shots[].light` | `"top-left"\|"top-right"\|"front"\|"practical"` | absent | per-shot light, only if the style allows variation |

**Prefer measurement over authoring.** `score.shots[].framing` and `.staging` are not needed if the paint probe records a character bounding box (min/max of the rig anchors); framing can be derived from the subject height share, and placement from the box centre. That is one small probe change, not 51 authored fields.

### 5.4 The check changes (no new tool)

- `src/core/style.ts`: put `identity` into `TokensSchema` (required keys: `dimension`, `reference`, `bands`, `cast`, plus the new blocks). A missing band must be an error, not a pass.
- `src/engine/style-identity.ts`: add findings for `identity:field`, `identity:placement`, `identity:tones`, `identity:archetype`, `identity:motif`, `identity:edit`, `identity:forbidden`, `identity:camera`, `identity:text`. Keep the existing five findings; do not rewrite them.
- `scripts/style-measure.ts`: add `p5/p50/p95` for luma, contrast and saturation, and a 3×3 region grid (plus a border band) so the field and placement can be measured. No new binary.
- `src/engine/paint-probe.js`: add a `bbox` per drawn character (from the rig anchors already recorded); no new probe.
- `scripts/camera-check.ts`: read `tokens.motion.camera.moves` as the film vocabulary, and check travel for `pan`/`orbit`, not only push/pull.
- `scripts/type-audit.ts`: read `layout.margins.bottom` (12%) and `layout.safeZones` lyric band, not only title-safe 6%; check `type.roleMap` and `type.maxLines`.
- `scripts/palette-audit.ts`: read `tokens.color` (roles, shares, `maxColours`) instead of the hardcoded 70–170° ban.
- `scripts/film-chain.mjs`: add `visual:check` and `style:identity` before `render`; today a fresh chain stops at `render:film` because the render requires reports the chain never wrote.

---

## 6. Conflicts with the original film (and two process gaps)

The pack's values, the reference's measured values, and what each conflict costs.

| # | Conflict | Pack value | Reference / measurement | Consequence |
|---|---|---|---|---|
| 1 | **The reference film fails the pack's own identity bands** | luma ±20, contrast ±25, saturation ±10, edges ±5, palette ≤45 vs six crops | luma **100.9** vs 145.8 → **−44.9**; contrast **215.4** vs 245.8 → **−30.4**; saturation **21.8** vs 39.8 → **−18.0**; palette distance **48.3**; edges 12.6 vs 10.3 → +2.3 | 4 of 5 fail. A film that looks like the reference would be refused by `style:identity`. |
| 2 | **The six reference frames are bright crops, not a film sample** | `tokens.identity.reference = references/frames` | 6 images, mixed sizes (720×720, 280×240, 700×760, 320×480, 635×740, 560×600), `aspect: mixed`; the film is 4,698 frames | The bands describe six chosen crops; the crop set is the whole statistical reference, and `style:measure` compares global means, not shot pairs. |
| 3 | **Palette roles do not describe the field** | default field `paper #F2E8D5`; roles paper/ink/red/blue/acid/accent; `maxColours 4` | fields are **gold #E09A4B, red #C44026, cream #ECC385, black #100C0F**; six crops measure **6** colours; macro-prop has ~7; a film painted exactly in the six declared colours measures **50.0 > 45** against the crops | A cream-field film is on-style by token and off-style to the eye. The declared six colours cannot pass the pack's own palette band. |
| 4 | **Acid has no reference support and sits on the audit's edge** | `acid #D9F24B`, hue **69.0°** | nearest reference colour **77**; `palette-audit` bans hue **70–170°**; the source film's `PAL.lime` `#A8D63A` is **77.7°** and its `PAL.mint` `#A8E6C9` is **151.9°** | The token acid passes by 1°; a slightly greener acid, or the film's own green, fails. The hue ban is a second palette system. |
| 5 | **`maxColours 4` is not the reference** | `tokens.color.maxColours: 4` | 6 colours in the six-crop palette; 7 in `macro-prop.jpg` | The budget is declared but never checked on a film; the reference frames break it. |
| 6 | **`maxCast 2` is not the reference chorus** | `tokens.identity.cast.max: 2`; `capabilities.limits.maxCast: 2` | `chorus-stage.jpg` has **4** performers; `src/scenes/act1.js` `backingPetals` draws 5 idols plus SOL and MIRA | The pack cannot reproduce the reference's chorus; `resolveFilm` does not read `capabilities.limits.maxCast`. |
| 7 | **Duration limits reject the reference film** | `capabilities.limits.durations: [30,45,60]`; `tokens.motion.minShot: 1.2`; `STYLE.md` “may run to 5.5 s”; recipes allow 8/9/10 s | **156.63 s**, 51 shots; min **0.66 s**, max **6.14 s** | A 157 s film cannot be scored; a 0.66 s shot is refused; the reference's 6.14 s shot is refused by the 5.5 s prose but allowed by `alarm_close` (8 s). Three different maxima. |
| 8 | **The default median band rejects the reference's median** | `DEFAULT_PACE.medianShot: [2.5,3]`; `pacing:long` at 2× median | median **3.06 s**; p10 **1.64**, p90 **4.82**, max **6.14**; 2× median = **6.12** | The reference median is 0.06 s outside the band; its longest shot is 0.02 s over the 2× rule. The band is narrower than the reference. |
| 9 | **Camera vocabulary is internally inconsistent** | `tokens.motion.camera.moves`: static, push_in, pull_back, pan, orbit; `STYLE.md` adds **tilt**; `src/core/style.ts` has **tilt, parallax**; `camera:check` reads the engine list, not the token | the source film uses roll, shake and tilt (`src` `setCam` roll/shake; manual `ctx.rotate` tilts), plus orbit and lateral scroll | A score can use `tilt`/`parallax` and pass even though the token omits them; the pack cannot name roll or shake, and `camera:check` rejects them as unknown moves; shake/handheld are refused by prose, not by the token. |
| 10 | **`camera:check` does not check pan/orbit travel** | it checks `from = to` only for `push_in`/`pull_back` | a `pan` or `orbit` with `from = to` passes; the painter still adds 46 px pan / 14 px orbit drift | The score can say “no travel” and the picture moves; the check proves the label, not the move. |
| 11 | **Type scale is much larger than the reference's** | caption 18 at 390 → **88.6 px** at 1920; body 26 → **128 px**; display 64 → **315 px** | `src/type.js` subtitle default **31 px**; display bursts **100–300 px**; body text ~10–34 px | Pack caption is ~2.9× the reference subtitle; the reference's subtitle would fail the pack's 69 px floor. `type-audit` only checks the floor, so a film can set everything at 69 px. |
| 12 | **The bottom 12% is not enforced** | `layout.margins.bottom: .12`; lyric-safe bottom 14%; `type-audit` reads only “title-safe 6 percent” | the source film's subtitle band is drawn at y≈948–1010 of 1080 (bottom 0.88–0.94) | Text can sit at 6% from the bottom and pass; the lyric-band exception is not checked. |
| 13 | **`maxWords 8` vs the reference lyric** | `layout.maxWords: 8`; `checkRecipe`/`checkCaptions` | `src/lyrics.js`: 29 lines, median 5, max **9** words; 141 words over 156.6 s | The reference's longest line (9 words) is refused; the pack's 8-word cap is a product choice, not the reference. |
| 14 | **Narration pace is 3× the reference** | default 180–190 wpm (0043) | 141 words / 156.6 s = **54 wpm** over the film; **60.8 wpm** over the 139.2 s voiced span; sung, not spoken | The pack's dense spoken explainer is a different register. The reference's song cannot be represented: `clock.mode: music` has no lyric track, and `voice` is TTS narration. |
| 15 | **Sound mix contradicts itself** | `tokens.sound.mix` “music ducked about 4 dB” | `films/uber-model/score.json` cues use `duckDb: 8`; gate reports 8 dB | Two values for the same rule; the mix report measures 8, the token says 4. The reference's audio is a song; the studio has no music path (`tokens.sound.assets: none`). |
| 16 | **Light is declared as a hard top-left key; the reference is flat** | `medium.light.direction: “hard top-left key with no ambient fill”`; `softness .5`, `opacity .2`; `paper-shadow` open | the portrait/chorus faces are evenly lit with soft drop shadows; the reference reads as **Collage**, not an open choice | The light token is aspirational; no check measures key direction or shadow weight. |
| 17 | **`capabilities.proof.metrics` claims checks that do not exist** | 17 prose metrics incl. “no gloss/3D”, “banned-token scan”, “all eight recipes”, “transition on beat” | there are **22 recipes**; no gloss/3D or banned-token command; transition-on-beat is not checked | The proof page overstates the gate; a reader trusts claims no command can fail. |
| 18 | **`style:measure`'s cut/camera stats fail on this style** | `style:measure` scene detector `scene > 0.03` | reference video → **238 shots**, median **0.1 s**, **90.8 cuts/min**, 149 camera moves; authored film → **51 shots**, median **3.06 s**, **19.2 cuts/min** | Any edit-rhythm or camera band measured with the current detector would be wrong. Use authored shots or raise the threshold above the 12 Hz boil. |
| 19 | **The chain does not run two reports the render requires** | `film-chain.mjs` runs audit/camera/assets/preflight/inspect/determinism/sheet/collage/sfx/mix/render… | `render:film.ts` refuses without `visual-check.json` and `style-identity/style-identity.json` | A fresh film's “one command” stops at render with “no visual check” / “no style-identity report”. |
| 20 | **The identity block is unvalidated and can pass silently** | `TokensSchema` `.passthrough()`; `checkStyleIdentity` skips `null` and missing bands | a missing `bands.palette` makes `limit` undefined → `false`; a `null` palette distance → skipped | A typo or a failed measurement weakens the gate without a finding. |

---

## 7. What this does not decide

- **Whether the reference's look or the pack's crops are the target.** The two disagree by 45 luma and 18 saturation. The owner has to choose: re-sample the reference (30–50 frames across the film, or the film's own percentiles), or state that the six crops are the target look and the film's dark chapters are outside the style. The current code assumes the crops and does not say so.
- **Whether the pack is a 30–60 s product or a 157 s film grammar.** The duration limits, the median band and the 5.5 s prose all assume a short; the reference is 157 s. The identity spec can describe both, but the score schema cannot yet score the long one.
- **Whether two performers is a style rule or a product limit.** The reference chorus has four. If two is a product limit, say it in `capabilities.limits` and stop calling it identity; if it is identity, the chorus is out of style.
- **Whether the pack wants the reference's sung register.** The narration model is spoken TTS at 180–190 wpm; the reference is a 54–61 wpm song. A lyric clock is a different pipeline, not a token.

The smallest next move is P0: add `identity.field`, `.composition`, `.tones`, `.edit`, `.cast.archetype`, `.motifs`, `.forbidden`; validate the block; teach `style:identity` to read them; add the probe bbox and the `style:measure` percentiles. That turns the five opinions into numbers without adding a sixth camera or a second palette.
