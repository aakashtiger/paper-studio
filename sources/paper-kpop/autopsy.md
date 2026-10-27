# Paper K-pop autopsy (S1c)

## 1. Source note

The source is the author's own **CLAUDE POP** film: 156.62 s (157 s), 1920x1080, 30 fps, 4,699 frames, read-only. Evidence frames are reference only, not output or shot plan. No song, lyric, name, story, audio or film title enters the pack; they appear here only as proof, never in `styles/paper-kpop/`.

Citations use `file:line`. Unless stated, files are in `Y:\NewVideoTest\src`.

## 2. Decisions D01-D27

| ID | Decision | Source line / observed value | Pack rule |
|---|---|---|---|
| D01 | Medium & brush | `core.js:280` `paper()`: shadow, fill, 2 px edge, clipped gloss; `core.js:227` `tornRectPath()`: 14/10-point deckles. No brush. | Flat cut-paper, torn deckle, no soft brush; closed paths, 1.5-3 px ink edge, offset shadow. |
| D02 | Material & surface | `core.js:54-70` `PAL`: `paper #F2E8D5`, `paper2 #E8DAC0`, `paper3 #DCCBAF`; `core.js:86` `fiberCanvas()`: 4,200 fibres, 1,500 specks; `core.js:158` `halftone()`. | Warm cream sheet, ink print, halftone, fibre. No pure white or black. |
| D03 | Light & shadow | Author: spec 0005:106, top-left, softness 0.5, opacity 0.2. Source `paper()` shadow 6/10 px at .22; `type.js:45-46` type shadow .035em at .26. | Top-left key, ambient 0.5, opacity 0.2. The hard type shadow is fixed; the paper contact shadow is conditional on the open Collage choice. |
| D04 | Colour system | `core.js:54-70` `PAL` supplies paper, ink, red, blue, acid, and the gold/pink/mint accents plus scene colours. | Six roles: `paper`, `ink`, `red`, `blue`, `acid`, `accent`. Two palettes, `day-stage` and `night-stage`; max 4 colours per frame. |
| D05 | Texture & finish | `fiberCanvas()` 4,200 fibres/1,500 specks; `type.js:48` boil `floor(time*12)`; `core.js:153` grain 24 Hz. | Fibre 0.18, halftone 14-22 px cell, grain 12 Hz seeded. Source 24 Hz grain reduced to 12 Hz to match boil (author). |
| D06 | Compositing order | `timeline.js:50-71` `renderAt`: paper fill, scene (bg/mid/character/fg/type), transition, subtitle, HUD, print marks, fibre, grain, vignette; `STORYBOARD.md:4`. | Layer order: `paper, bg, mid, character, fg, type, HUD, fibre, grain, vignette`. |
| D07 | Shape & geometry | `core.js:196-277`: `roundRectPath`, `blobPath`, `tornRectPath`, `starPath`, `sparkPath`, `heartPath`, `petalPath`. | Shape vocabulary: `card, torn-strip, sticker, sunburst, circle, rule, frame, arrow, burst`; ink edge, no smooth vector gloss. |
| D08 | Composition & safe zones | `core.js:5` 1920x1080; `timeline.js:97` print marks at 26 px; `type.js:189` subtitle origin x=84, y=992; `timeline.js:76` HUD 246x96 at x=W-286, y=40. | Margins 0.06 top/left/right and 0.12 bottom; lyric-safe bottom 14%; meter top-right; maxWords 8; at most two text zones. |
| D09 | Typography & lettering | `type.js:28` `TY.type`: Anton, jitter .035 rad, dy .012em, cream edge, ink shadow .26, 12 Hz boil. | Anton display, Archivo Black body, DM Mono Reg/Med label/caption, Permanent Marker monogram; refuse Instrument Serif and Black Han Sans (author: four-family lock). |
| D10 | Camera & depth | `core.js:306-325` `CAM`/`setCam`: z, roll, shake; `STORYBOARD.md:4` 2.5D `bg/mid/character/fg/type`; source uses handheld drift (shot 02). | `static, push_in, pull_back, pan, tilt, orbit`; no handheld. Open push 0.99 to 1.04; portrait and macro push 1.00 to 1.12; orbit 1.00 to 1.06; 2.5D only. |
| D11 | Rig & character construction | `characters.js:372` `idol`, `564` `mira`, `28` `limb`, `19` `brad`, `133` `flowerHead`, `173` `face`, `306` `hairBack`, `336` `bangs`, `70` `pleatedSkirt`, `102` `varsityTorso`. | Two rigs, `character.lead`/`character.second`: 11 joints, brads, layered hair, petal collar, hand anchors, pose keys, 2.5D. MaxCast 2. |
| D12 | Timing & beat grid | `core.js:48` `C.beat = (t-0.21)/(60/88)`; `core.js:49` `bpmPulse`; `core.js:50` `three` at 132. Measured 88 BPM, offset 0.21. | 88 BPM, offset 0.21, bar 4; minShot 1.2; recipe ranges 1.2-5.5 s. Frame-exact beats are S2. |
| D13 | Motion & physics | `core.js:16-20` `easeOut`, `backOut` with c=1.70158, `elasticOut`; `core.js:49` `bpmPulse`; `core.js:332` `lerpPose`; `flowerHead` pulse 1+.045. | Easings `easeOut, easeInOut, backOut`; physics `squash, overshoot, anticipation, ease, none`. Elastic and spring are refused. Author decision: paper, not jelly. |
| D14 | Edit & transitions | `timeline.js:42-48` `drawPaperWipe`; `scene_kit.js:112-119` `irisOverlay`; `timeline.js:28` `GLOBAL_TRANS`; STORYBOARD uses iris, wipe, match cut and hold. | Allowed: `cut, iris, wipe, match_cut, hold`; minShot 1.2; a paper tear maps to `wipe`; no dissolve or page_turn. |
| D15 | Sound & silence | Author: spec 0005:115; film audio read-only, not in pack. | Electronic pop, synth bass, brass, vocal chops, paper SFX, optional voice. Brief only; no audio files (rights, portability). |
| D16 | Signature | `core.js:280` paper edge/shadow; `core.js:158` halftone; `type.js:28` type edge/shadow; `timeline.js:42` wipe; `STORYBOARD.md:4`. | Signature: a paper stage snaps into place around one or two cut-paper performers; the display stack lands line by line on the beat; one flat accent; camera holds or pushes; a cut, iris, wipe or hold carries the exit. |
| D17 | Refusals | Author: spec 0005:87 names the ANTI as glossy 3D/gold wedding; source paper is flat, no bevel. | Refuse glossy 3D, gold foil wedding, soft airbrush, photoreal faces, neon bloom, 3D bevel, lens flare, stock UI. Minimum six. |
| D18 | Register & fitness | Author: high-chroma comedic paper and maxCast 2 do not fit somber, luxury or photoreal. | Not for photoreal product, luxury beauty, somber memorial, 3D game trailer, corporate SaaS. Minimum three. |
| D19 | Capabilities & limits | `core.js:5-6` 1920x1080, `DUR 156.62`; 4,699 frames at 30 fps. | 16:9 and 9:16; 30/45 s; maxCast 2; maxWords 8. 9:16 is a re-stage at centre 60%, not a crop. |
| D20 | Assets & registry | `ASSET_TYPES` 0003:100: character, prop, set, frame, texture, type, hud; source draws all seven. | 15 starter ids, each id/type/anchors; no film set names. See section 6. |
| D21 | Recipes & shot contract | STORYBOARD: 54 shots; 0005:58 freezes eight recipes, one per `BEAT_ROLE`. | Exactly eight, closed slots/ops, 1.2-5.5 s, 3-5 failure modes. Formats repeat roles; no ninth. |
| D22 | Runtime contract & seed | `core.js:21` `C.hash`, `core.js:192` `makeRng` deterministic; `core.js:120` `grainCanvas` uses `Math.random` (source exception). | Primitives subset `PRIMITIVES`; seed grain, paper shift, type jitter, camera phase; fix palette, type, order; seed required. No unseeded random. |
| D23 | Cost class | 1920x1080 at 30 fps, 4,699 frames; `renderAt` recomposites fibre, grain and vignette every frame. | `costClass` is `heavy`. Reason: full-frame texture and 2.5D layers at 1080p. |
| D24 | Reference media | Evidence: six frames, `type.js`, `scene_kit.js`, `props.js`. Take paper/type/staging; not story/lyrics/set names; rights author. | `evidence.sources` >=3, each take/notTake/rights. No third-party reference. |
| D25 | Conformance protocol | Author: spec 0005:118, 129-133; S1c renders nothing. | `declared`; eight recipe ids; 16:9 + 9:16; metrics palette, words, duration, cast, banned tokens. |
| D26 | Provenance, rights & lineage | Film is author's own, read-only; `reference/paper-kpop/README.md` says do not import; fonts OFL. | Author-owned identity; no redistribution without permission; lineage 0003 to 0005; sources/rights recorded. No third-party code. |
| D27 | Authoring protocol | Author: spec 0005:119, 0003:90; blind sealed 6 shots/30 s/9:16. | Frozen brief, `## Questions`, binding hashes, unchanged pack hash; no post-seal edits. |

## 3. Palette

The six pack roles are `paper, ink, red, blue, acid, accent`. Both palettes use only values from `PAL`.

| Role | `day-stage` | `night-stage` | Source `PAL` names mapped |
|---|---|---|---|
| paper | `#F2E8D5` | `#E8DAC0` | `paper`, `paper2` |
| ink | `#171310` | `#0C0A09` | `ink`, `black` |
| red | `#E8452A` | `#B92A16` | `red`, `redD` |
| blue | `#203FD8` | `#122A9B` | `blue`, `blueD` |
| acid | `#D9F24B` | `#D9F24B` | `acid`, `lime` |
| accent | `#F5B93F` | `#FF5E9C` | `gold`, `pink` |

`night-stage` is a second warm paper stock with deeper ink, oxblood red, ink blue, the same acid and a pink accent. It is not an inversion and it does not change the role names.

Rules:

1. Max 4 roles per frame, including `paper` and `ink`. A frame selects at most four of the six.
2. The HUD reuses one of the four selected roles; it does not add a fifth.
3. `accent` is one slot. Its pack fills are gold `#F5B93F` in day-stage and pink `#FF5E9C` in night-stage. Mint is a source observation, not a pack role.
4. `teal`, `violet`, `silver`, `chrome`, `sky`, `orange`, `ochre`, `terracotta` and `green` are source scene colours. They are not pack roles; mix from the six or omit them.
5. The treatment declares the palette and may not exceed four. A reference crop must not be used to justify a fifth colour.

## 4. Type treatment

| Role | Face | File | Pack use |
|---|---|---|---|
| display | Anton | `Anton-Regular.ttf` | 120-320 px at 1080p, caps, tracking .01em |
| body | Archivo Black | `ArchivoBlack-Regular.ttf` | 44-84 px, sentence case, 2-3 lines |
| label | DM Mono Medium | `DMMono-Medium.ttf` | 14-18 px, caps, tracking .08em |
| caption | DM Mono Regular | `DMMono-Regular.ttf` | 28-32 px, one line, max 8 words |
| monogram | Permanent Marker | `PermanentMarker-Regular.ttf` | 96-160 px, once per close |

Source behaviour:

- `type.js:28` `TY.type`: per-character hash, `charRot .035` rad, `charY .012` em, cream edge `max(2, size*.055)`, ink shadow `size*.035` at .26, 12 Hz boil (`floor(time*12)`), appear scale .55-1.0. Reproduce these values; no flat text block.
- `type.js:80-83` chrome is a four-stop gradient; one display word per frame, never body or caption.
- `type.js:115` `TY.sticker`: Archivo Black, padX .38em, padY .28em, rot -.05, 2.2 px edge, 5/8 shadow, optional 76x20 tape/barcode. One per quote.
- `type.js:149` `TY.circular`: one char per step, DM Mono, span `TAU`, start `-PI/2`; source open radius 310, size 24, start `-.82*PI`, span `.96*TAU`, spin .035 rad/s (`act1.js:73`). Ring only in open/close, max 24 chars, never the film title.
- `type.js:168` `TY.vertical`: .92em steps, .05 rad char rotation, cream edge, ink shadow. One column, max 10 chars, drift 0.
- `type.js:185` `TY.subtitle`: x=84, y=992, size 31, width `min(1300, text+96)`, height 62, ink .92, red dot, `LYRIC` 11 px, active word acid, red hairline. Keep geometry; label `CAPTION`; max 8 words; never a song line.
- Permanent Marker is author: source has no monogram; use once in `pullback_close` to sign without a film title.

## 5. Rig and staging

The two source rigs, `idol()` and `mira()`, prove the construction below. The pack uses `character.lead` and `character.second`; source names appear only in this autopsy.

| Construction | Source evidence | Pack rule |
|---|---|---|
| Joints | `characters.js:28` `limb()`: 2.1 px edge, 3/5 px shadow, white edge; `brad()` 19 marks hip, knee, shoulder, elbow, wrist. | 8 visible joints, brass brads 3.0-4.6, no hidden IK or rubber hose. |
| Layered hair | `hairBack()` 306, `bangs()` 336, `idol` 398-413 four long strips. | 3 layers: back mass, side strands, front bangs; swing is a pose key, not physics. |
| Petal collar | `flowerHead()` 133: 22 alternating petals, clipped tip, 1+.045 beat pulse. | 18-24 petals, two paper tones, one accent tip, pulse <=4.5%, no gradient mesh. |
| Hand anchors | `mira()` `drawArm()` returns wrist (716-724); `idol` derives the mic hand from arm angles (542-548); held props use hand positions (726). | `handL`/`handR`, grip 11 px below wrist; props attach to grip. |
| Pose changes | Pose keys bounce, sway, lean, headTilt, headTurn, hairSwing, petalDrift, armL/R, legL/R (372-390); `core.js:332` `lerpPose`. | Closed keys; easeOut/backOut; no per-frame re-rig. |
| Squash and overshoot | `flowerHead` pulse 1+.045 and `backOut` c=1.70158; body squash is author addition. | Squash 0.96-1.04, overshoot 1.03-1.06, 2-4 frame anticipation. |
| 2.5D layers | `STORYBOARD.md:4` bg/mid/character/fg/type; `idol` 415-549 draws far arm, legs, skirt, torso, head, near arm; ground shadow 395. | Sorted 2.5D layers, ground contact, no 3D rotation; depth is scale/offset. |

Port these staging patterns: `props.js:137 stageSet` 28-ray sunburst, 436 px sun, floor y=800, speakers, two spotlights, crowd, torn proscenium; `props.js:229 labSet` 62 px grid, cards, desk, monitors; `props.js:362 roadSet` three mesa layers and perspective road; `props.js:439 dataSet` receding rack aisle; `scene_kit.js:476 drawDesk` 1000x560 mat, 40 px grid, 368x254 laptop, lamp pool. These are grammars, not set names.

## 6. Asset grammar

All assets register in `capabilities.assets.starterLibrary` with an id, a type from `ASSET_TYPES`, and anchors.

| Asset id | Type | Anchors |
|---|---|---|
| `set.paper-card` | set | paper edge, cut edge, sheet centre |
| `prop.paper-sticker` | prop | peel corner, sticker centre, slam edge |
| `frame.paper-window` | frame | window aperture, torn lip |
| `texture.paper-fibre` | texture | fibre grain, deckle edge |
| `texture.halftone` | texture | dot field, screen angle |
| `character.lead` | character | face, hair, hand-left, hand-right, foot-left, foot-right |
| `character.second` | character | face, hair, hand-left, hand-right, foot-left, foot-right |
| `set.stage` | set | stage floor, riser, sunburst centre |
| `set.tabletop` | set | table edge, prop mark |
| `set.corridor` | set | corridor mouth, vanishing point |
| `set.diorama` | set | back wall, cutaway edge |
| `prop.object` | prop | grip point, contact mark |
| `hud.lyric-band` | hud | band edge, baseline |
| `hud.meter` | hud | readout, sticker corner |
| `hud.corner-marks` | hud | top-left mark, bottom-right mark |

No film-specific set names. A recipe may use only these ids; a new id needs a new anchor row and a type.

## 7. Recipe grammar

These are the only recipes. `BEAT_ROLES` is closed at eight, and spec 0005 freezes one recipe per role. A ninth recipe would map to no unused role and would never be selected. The song and shorts formats repeat roles through their sequences, so all eight are exercised. The range and failure notes below are source-era; the recipe JSON and its `failureModes` are authoritative where they differ.

**`paper_open`** | role: open. Slots: `content.title`, `content.subtitle`. Assets: `set.paper-card`, `texture.paper-fibre`. Camera: `push_in` 0.99 to 1.04, easeOut. Out: `iris`. Range: 2.2-5.5 s.
Fails: two entry moves; title inside the 6% margin; fibre reads as digital noise; shadow detached from the cut edge; more than 0.8 s before the first shape moves.

**`type_stack`** | role: title. Slots: `content.title`, `content.body`. Assets: `set.paper-card`, `texture.halftone`. Camera: `static`. Out: `cut`. Range: 1.2-5.5 s.
Fails: more than 8 words; more than 3 lines; two display sizes compete; type sits on a busy halftone without contrast; the block enters with bounce instead of a cut.

**`portrait_iris`** | role: portrait. Slots: `content.names`, `content.caption`. Assets: `set.paper-card`, `character.lead`, `frame.paper-window`, `hud.lyric-band`. Camera: `push_in` 1.00 to 1.12, easeOut. Out: `iris`. Range: 2.2-5.5 s.
Fails: iris cuts the face or a hand; character floats without a ground line or cut edge; hair and petal layers merge; pose change slides; caption covers the face.

**`macro_prop_beat`** | role: detail. Slots: `content.caption`. Assets: `set.paper-card`, `prop.object`, `set.tabletop`, `texture.halftone`. Camera: `push_in` 1.00 to 1.12, easeOut. Out: `cut`. Range: 1.2-5.5 s.
Fails: object under 40% of frame height; object has no contact point or cut edge; fibre scale too large; caption overlaps the object; camera drifts instead of pushing.

**`stage_wide`** | role: list. Slots: `content.body`, `content.caption`. Assets: `set.paper-card`, `set.stage`, `character.lead`, `character.second`, `hud.meter`, `texture.halftone`. Camera: `orbit` 1.00 to 1.06, easeInOut. Out: `cut`. Range: 3.4-5.5 s.
Fails: more than two articulated characters; feet off the floor line; horizon tilted without intent; type covers the lead's face; orbit speed uneven.

**`sticker_slam`** | role: quote. Slots: `content.body`. Assets: `set.paper-card`, `prop.paper-sticker`, `texture.halftone`. Camera: `static`. Out: `cut`. Range: 1.2-5.5 s.
Fails: sticker over 35% of frame; more than 8 words; clean vector edge; lands with ease instead of backOut; a second sticker appears.

**`side_scroll_chase`** | role: transition. Slots: `content.caption`. Assets: `set.paper-card`, `set.corridor`, `texture.halftone`. Camera: `pan` 0.94 to 1.06, easeInOut. Out: `wipe`. Range: 1.2-5.5 s.
Fails: corridor perspective reverses; feet slide without a leg cycle; pan speed varies; wipe starts before the corridor exits; no foreground parallax.

**`pullback_close`** | role: close. Slots: `content.monogram`, `content.body`. Assets: `set.paper-card`, `set.diorama`, `prop.object`, `texture.paper-fibre`, `hud.corner-marks`. Camera: `pull_back` 1.12 to 1.00, easeOut. Out: `hold`. Range: 3.6-5.5 s.
Fails: a third articulated character appears; diorama scale jumps; monogram unreadable at the end; hold exceeds 2 s; table edge crosses the type.

## 8. Evidence frames

All crops are in 1920x1080 source coordinates. The card uses three; all six live in `styles/paper-kpop/references/frames` as evidence. Each crop removes the lyric band and the film title.

| Frame | Timecode | Crop x,y,w,h | What it proves | Banned text removed |
|---|---|---|---|---|
| `f00027.jpg` | 00:00:00.900 | 800,300,320,480 | Open/sun: 32-petal fan, gold centre, concentric layers, dark ground. | Circular film title, `a paper singularity`, `2026`, subtitle, bottom mark. |
| `f00105.jpg` | 00:00:03.500 | 925,160,635,740 | Portrait: layered hair, petal collar, brad joints, hand anchor, cream edge, offset shadow. | `I SEE`, `SPARKS`, `OF AGI`, `IN YOUR EYES`, red S edge, subtitle band, `SHEET 01 / SOL`, film title. |
| `f00700.jpg` | 00:00:23.333 | 920,100,720,720 | Stage-wide: sunburst, giant sun, repeated cast, blue floor, confetti, costume rhythm. | Giant display word, 34% meter, HUD meter, `GLOBAL RISK ASSESSMENT / LIVE`, lyric band, film title. |
| `f00426.jpg` | 00:00:14.200 | 900,100,560,600 | Prop-portrait: paper chair, seated lead, halo, red room, limited palette. | `BOSS`, `SERVANT`, `SOL` tag, `CEO / 001 BIG CHAIR`, lyric band, HUD meter, film title. |
| `f00516.jpg` | 00:00:17.200 | 600,160,700,760 | Macro prop: eight stacked cylinders, cut rims, contact shadow, negative space. | `SERVICE LEVEL: 0`, `OBJECT 08 / CERAMIC`, `FRAGILE`, film title. |
| `f04590.jpg` | 00:02:33.000 | 280,600,280,240 | Desk diorama: paper figure on ruled sheet, cutting mat, tabletop scale. | `SOL / SHEET 01`, `MIRA` badge, laptop and script film title, `a paper singularity`. |

Inspected, not recommended: `f00252` (8.400 s) has a readable lyric sticker; `f03900` (130.000 s) is dominated by repeated `SELF-UPGRADE` and a lyric band. Neither crops cleanly. `f01500`, `f03000`, `f04200` cover texture, split staging and pullback.

## 9. Banned tokens

These may appear in this autopsy as evidence, never in `styles/paper-kpop/`, its card, tokens, recipes, fonts or reference crops.

- Film title: `CLAUDE POP`.
- Character names: `SOL`, `MIRA`.
- Meter and title strings: `P(DOOM)`, `a paper singularity`.
- Lyric fragments and scene copy: `I'm upping`, `I see sparks`, `FOOM`, `SELF-UPGRADE`, `NO SURPRISE`, `SERVANT`, `BOSS`, `BIG CHAIR`, `SHEET 01`, `FRAGILE`, `SERVICE LEVEL`, `OBJECT 08 / CERAMIC`.
- Content tokens: `shoggoth`, `paperclip`, `basilisk`, `GPT`, `Sydney`, `NVDA`.
- Lineage token: `Lemo`.
- Any named lyric or on-screen film copy not listed here.

Gate: case-insensitive. Use word boundaries for short tokens (`SOL`, `MIRA`, `GPT`, `NVDA`, `FOOM`, `Lemo`), substring for phrases. The text gate cannot read images, so the crop table is the manual on-image check.

## 10. Rights and licence

- Fonts: Anton, Archivo Black and DM Mono are OFL 1.1; Permanent Marker is Apache 2.0. Four families, five files: `Anton-Regular.ttf`, `ArchivoBlack-Regular.ttf`, `DMMono-Regular.ttf`, `DMMono-Medium.ttf`, `PermanentMarker-Regular.ttf`. DM Mono ships two weights. Bundle both licence texts with the fonts and in `LICENSE-THIRD-PARTY.txt`.
- Film frames are the author's own. They are evidence, not output. No frame is relicensed for reuse outside the pack without the author's permission.
- No audio is included: no song, stems, vocals, instrumentation or SFX. The sound block is descriptive only.
- No third-party code is copied. Ideas are ported from the read-only `reference/paper-kpop/core.js` and `type.js`; those files are not imported.
- `reference/paper-kpop/` is read-only reference. Do not edit it, import it or make the pack depend on it.
- The pack must be self-contained: local fonts, local crops, no `http(s)`, no drive paths, no `src/`, no `assets/`, no `out/frames`.
