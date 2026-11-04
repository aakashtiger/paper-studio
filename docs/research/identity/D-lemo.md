# D - Lemo-Opuscar: how 59 style packs encode a visual identity

**Date:** 2026-11-04
**Source:** `C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles`
(59 packs plus `_template`).
**Read:** all 59 `style.json`; every `STYLE.md` section heading and the full text of
the 12 packs in section 3; their named timeline, camera, palette, material and
mix code; `_template` and `MAINTAINING.md` in full; the relevant parts of
`tools/release.py`; the demo file tree and named source constants for all 59.
No render was executed. Figures below are from the packs, not measured from
video.
**Purpose:** recover the parameter taxonomy and the code/data patterns that a
style identity spec should have. Not an implementation. No repository file was
changed except this one.

---

## 0. The honest headline

**Lemo-Opuscar has no machine-readable visual identity.** `style.json` is a
gallery record: 12 fields, none of them visual. The identity is split across
three layers, and the exact values migrate away from the prose:

| Layer | What it holds | Exact values? |
|---|---|---|
| `STYLE.md` | invariants: material, colour logic, type, motion, camera, sound, native moves, pitfalls | sometimes - 36/59 contain a hex colour |
| `DEMO.md` | one worked film: shot table, score, palette, props, build notes | usually - 58/59 contain a hex colour |
| `demo/` | executable constants, shot lists, camera keys, rigs, palettes, mix | almost always - 57/59 contain a hex colour |
| `style.json` | title, category, one-line pitch, uses, poster timestamp, duration | **never** |

The strongest packs are not the ones with the longest prose. They are the ones
where **one numeric table drives several outputs** - picture, score, subtitles
and a checker - so the identity cannot drift silently:

- `briefing-board`: the film is a JSON scene graph (81 elements) plus camera
  moves, and four tools check camera width, resolution, subtitles and cues.
- `swiss-motion`: `score.json` is simultaneously the poster layout and the
  music (column = pitch, row = onset, length = duration).
- `one-line`: one `SEGS` table holds chapter windows, line age, marks and holds;
  drawing, subtitles and sound read it, and the camera keys land on its marks.
- `paper-popup`: `story.js` holds all narration, bubbles, chapters, cover and
  page turns; a separate `SH` key table holds the camera.

Three corpus-level facts frame everything below:

1. **59/59 have a demo engine** (`demo/index.html`), 51/59 a one-command build,
   59/59 a `styleframe.jpg`, 31/59 any named check tool, and only about 6/59 a
   motion or resolution check. Identity is rendered far more often than tested.
2. **50/59 have narration, 9/59 have none (music/SFX only).** Every pack targets
   -14 LUFS; 47/59 print the same subtitle hold rule; 18/59 explicitly use a
   12 fps / on-twos rate somewhere in the motion grammar (usually the cast).
   These are global defaults repeated 59 times, not style differences.
3. **The template says 6-11 KB; the real files are 10.4-20.1 KB**, median
   12.1 KB. Prose expands to hold what the schema does not. That is the central
   argument for an executable identity file.

---

## 1. Template, required vs optional, and what is actually validated

### 1.1 The template's contract

`_template/STYLE.md` fixes **11 numbered sections** and tells the author to
delete the instruction comment:

1. Essence, and what it is not
2. Materials & rendering
3. Colour logic
4. Type & subtitles
5. Motion quality
6. Camera grammar
7. Sound palette
8. Native moves
9. Pitfalls of the medium
10. Engine
11. Variation space

The template also imposes a split that the packs honour in principle and break
in practice:

- `STYLE.md` holds only what is true for **every** film: look, material, colour
  logic, type, motion, camera vocabulary, sound palette, native moves, pitfalls.
- No story, arc, beat-by-beat shot table, prescribed opening or ending, score
  arc, BPM or key, demo durations, demo palette or props, end card or sign-off.
- "A number measured in the demo becomes a rule here; the demo's actual value
  can stay as an example in DEMO.md."
- Section numbers are fixed because other guides refer to them. Documentary
  styles do renumber or split them: `caption-news`, `news-package`,
  `telestrator`, `visual-investigation`, `kino-montage` and `countdown` all
  replace "camera grammar" with "edit grammar" or add a material/sources
  section.

`_template/DEMO.md` has six required blocks plus one conditional block:

| Block | Content |
|---|---|
| Story & structure | logline, arc, why it fits, which native moves it spends |
| Shots | the demo camera route, opening/ending included, table with times |
| Score structure | section sequence, tempo, key, cues, silences, balance |
| Palette & props | the demo's actual colours, characters, objects, design notes |
| End card | what it shows; the LemoLab sign-off belongs only here |
| Build notes | file map, build order, commands, render times, demo pitfalls |
| `content.json` fields | scene styles only: field / type / allowed / if out of range |

`_template/style.json` has 12 fields:
`slug`, `num`, `en`, `cn`, `category_en`, `category_cn`, `film`, `line`,
`line_cn`, `uses[]`, `frame_sec`, `dur`.

### 1.2 What the machine checks

`tools/release.py` (`--strict <slug>`) checks only the container, never the
look:

| Check | Rule |
|---|---|
| File layout | `style.json`, `STYLE.md`, `DEMO.md` must exist; `poster.jpg`, `demo/stills/styleframe.jpg`, `demo/CREDITS` must be committable |
| `style.json` | must be valid JSON and contain `slug`, `en`, `cn`, `category_en`, `category_cn`, `film`, `line`, `line_cn`, `frame_sec`; `slug` must match the folder |
| Sign-off | `STYLE.md` must not mention LemoLab, "Opus 5.5" or "Sign-off" (belongs to `DEMO.md`) |
| Film | if `<slug>.mp4` exists it must be ffprobe-readable (a missing film is a warning); catalog `dur` must not regress to 0 |
| Gallery | `slug` must be in `styleboard/catalog.json` |
| Subtitles | if `demo/voices/*.wav` exists, `<slug>.srt` is warned as missing |
| Evidence | still paths named in docs must exist and be committable |
| Reachability | demo files must be reached from `STYLE.md`, `DEMO.md`, `style.json`, `build.sh`, `index.html`, `CREDITS` or a named import/pattern |
| Hygiene | no local paths, secrets, oversized files, process words in committed text |

`num`, `uses` and `dur` are present in all 59 packs but are not required by
`STYLE_FIELDS`; only the fields above are enforced. The checker also does not
read `STYLE.md` sections, only the sign-off regex.

What is **not** checked anywhere:

- that the palette in `STYLE.md` matches the palette in `demo/`;
- that the declared medium, fps, step rate, outline width, font size or
  subtitle size is what the renderer uses;
- that the camera vocabulary is the one in the film, or that its travel budget
  is respected;
- that the narration is inside the style's line count or read-rate;
- that the demo stays inside the style's variation space;
- that a "style frame" is representative of the film (it is a JPEG, not an
  assertion).

The one automated identity-adjacent rule is negative: the sign-off must not
leak into `STYLE.md`.

### 1.3 If it exists, it is in the prose

All 59 `style.json` files contain all 12 fields. No pack contains a `tokens.json`,
`theme.json`, `palette.json` or `identity.json`. The only other JSON files in a
pack are per-film artefacts: `events.json`, `timeline.json`, `score.json`,
`content.json`, `lines.json`, `cues.json`.

That is the structural gap this report is about: the gallery knows the title and
duration; the renderer knows the palette and camera; **nothing in between is a
contract**.

---

## 2. Inventory: all 59 packs

Legend: **Cat** = `style.json` category. **Engine**: C2 = Canvas 2D,
GL = WebGL/GLSL compositor, 3JS = three.js, SVG = SVG DOM, FB = indexed
framebuffer, FF = real footage/ffmpeg, DOM = HTML/CSS. **P** = paper, cut-out,
collage or print-on-paper lineage (21/59). **Rhythm** is from the pack's own
shot table; `sh` = shots, `sc` = scenes, `seg` = segments, `sec` = sections.

| # | Pack | Cat | Medium | Cast | Engine | Rhythm | P |
|---:|---|---|---|---|---|---|---|
| 1 | archive-lighttable | EV | WebGL light table + annotation | archival objects, no cast | GL+C2 | 16 sh, med 2.0 s | Y |
| 2 | art-deco | GT | Canvas 2D deco | stylised figures | C2 | 20 sh, med 2.3 s | - |
| 3 | ascii-crt | GT | glyph atlas + CRT shader | machine text, no cast | C2+GL | 10 sc, 1-12 s | - |
| 4 | backrooms | CE | three.js + VHS | operator POV, no visible cast | 3JS | one take | - |
| 5 | blueprint | GT | Canvas drafting/cyanotype | technical, no cast | C2+GL | 4 camera segments | Y |
| 6 | brick-toy | M3 | three.js PBR plastic | toy figures | 3JS | 21 sh, med 2.29 s | - |
| 7 | briefing-board | EV | 2D board + photo cut-outs | no recurring cast | C2+JSON | 17 sh, med 2.5 s | Y |
| 8 | caption-news | ED | Canvas over footage | footage people | C2+FF | 19 sh, med 3.0 s | - |
| 9 | cel-anime-80s | CA | Canvas cel + CRT | anime cast | C2 | 20 sh, med 2.07 s | - |
| 10 | city-symphony | ED | real footage/ffmpeg | no cast | FF | 36 sh, 0.5-4 s | - |
| 11 | countdown | ED | Canvas + NASA footage | archival | C2+FF | 16 layouts, med 2.6 s | - |
| 12 | crayon-book | HP | WebGL crayon + wash | child + animals | GL+C2 | one take, 9 beats | Y |
| 13 | dark-keynote | IK | Canvas 2D UI | no cast | C2 | 9 beats, med 4.5 s | - |
| 14 | data-physical | EV | three.js PBR data | no cast | 3JS | one take, 9 beats | - |
| 15 | dataviz | IK | Canvas 2D charts | no cast | C2 | 11 beats, ~4.5 s | - |
| 16 | engraving | PR | Canvas burin | figures | C2 | 8 beats, med 4.4 s | Y |
| 17 | game-show | GM | SVG DOM flat | flat cast | SVG | 93 bars, 10 sets | - |
| 18 | glass-product | M3 | three.js glass | product only | 3JS | 11 sh, med 2.0 s | - |
| 19 | halftone-dossier | PR | SVG + Canvas print | mascot cat | SVG+C2 | 10 sc, med 3.0 s | Y |
| 20 | hd-2d | GM | three.js pixel art | sprite cast | 3JS | 7 seg, med 10 s | - |
| 21 | hologram-hud | IK | Canvas additive HUD | no cast | C2 | 8 seg, med 4.5 s | - |
| 22 | impasto | HP | WebGL knife paint | painted figures | GL | 9 sh, med 4.09 s | - |
| 23 | ink-wash | HP | Canvas brush + WebGL paper | ink figures | C2+GL | 7 beats, holds 5.5-8.2 s | Y |
| 24 | iso-infographic | IK | Canvas isometric | one figure | C2 | one take 58.8 s | - |
| 25 | kino-montage | ED | Canvas archive collage | archival | C2 | 17 sh, med 3.0 s | Y |
| 26 | lidar-survey | EV | WebGL points | no cast | GL | one take, 12 framings | - |
| 27 | living-screencast | IK | HTML/CSS + pixel sprite | mascot | DOM | 12 sh, med 5.0 s | - |
| 28 | lowpoly-island | M3 | three.js ortho | lowpoly cast | 3JS | 12 sh, med 2.5 s | - |
| 29 | microgame | GM | Canvas + 8 media modules | toon astronaut | C2 | 19 seg, med 2.57 s | - |
| 30 | microscope | EV | Canvas + real slide | no cast | C2 | 12 sh, med 3.0 s | - |
| 31 | midcentury-toon | CA | Canvas 2D | presenter/product | C2 | 8 sec, med 5.45 s | - |
| 32 | news-package | ED | Canvas broadcast | footage people | C2+FF | 11 sh, med 4.5 s | - |
| 33 | newsreel | ED | Canvas archive | archival | C2 | 22 sec, med 2.4 s | Y |
| 34 | one-line | HP | Canvas ink on paper | one figure | C2 | 9 chapters, med 4.2 s | Y |
| 35 | paper-lantern | EA | three.js paper layers | silhouette puppets | 3JS | 19 sh, med 5.96 s | Y |
| 36 | paper-popup | M3 | three.js + Canvas paper | paper actors | 3JS | 3 takes | Y |
| 37 | papercut-red | EA | Canvas paper rig | jointed cut-outs | C2 | 14 sh, med 2.85 s | Y |
| 38 | pictogram-motion | GT | Canvas 2D pictograms | faceless figure | C2 | 79 sh, med 1.6 s | - |
| 39 | pixel-rpg | GM | indexed framebuffer | sprite cast | FB | 8 sec, med 6.7 s | - |
| 40 | risograph | PR | Canvas + WebGL print | cartoon cast | C2+GL | 11 sh, med 3.0 s | Y |
| 41 | rubber-hose | CA | Canvas 2D | rubber-hose cast | C2 | 14 sh, med 3.33 s | - |
| 42 | satellite-briefing | EV | WebGL + Canvas map | no cast | GL+C2 | one take, 12 framings | - |
| 43 | scifi-toon | CA | Canvas 2D | toon cast | C2 | 29 sh, med 1.7 s | - |
| 44 | shadow-puppet | EA | Canvas + WebGL | jointed puppets | C2+GL | 13 sh, med 3.6 s | - |
| 45 | silent-film | CE | Canvas + WebGL print | live-action-style cast | C2+GL | 13 sections | Y |
| 46 | silkscreen-poster | PR | Canvas print | no cast | C2 | 6 sec, med 7.2 s | Y |
| 47 | spy-titles | GT | Canvas cut-paper | silhouette cast | C2 | 11 set pieces | Y |
| 48 | stained-glass | GT | Canvas glass + WebGL | knight/dragon | C2+GL | 15 sh, med 4.2 s | - |
| 49 | swiss-motion | GT | Canvas 2D type | no cast | C2 | 8 sections | - |
| 50 | teardown | EV | three.js PBR | no cast | 3JS | 13 sh, med 2.7 s | - |
| 51 | telestrator | ED | Canvas over footage | presenter | C2+FF | 23 seg, med 1.84 s | - |
| 52 | tilt-shift | M3 | three.js DOF | miniature people | 3JS | 8 sh, med 5.0 s | - |
| 53 | ukiyoe | EA | Canvas print | small figures | C2 | 5 views, med 7.5 s | Y |
| 54 | urban-sketch | HP | Canvas + WebGL | sketched figures | C2+GL | one take, 12 phases | Y |
| 55 | visual-investigation | ED | Canvas 2D | archival | C2 | 11 sec, med 6.0 s | - |
| 56 | watercolor | HP | Canvas 60 fps | painted figures | C2 | one dolly, 5 zones | Y |
| 57 | white-model | EV | three.js + overlay | no cast | 3JS | one take, 10 beats | - |
| 58 | whiteboard | HP | Canvas marker | drawn figures | C2 | one board, 44 keys | - |
| 59 | woodcut | PR | Canvas + WebGL print | carved figures | C2+GL | 17 sh, avg 3.4 s | Y |

Category totals: Graphic & Type 7, Materials & 3D 5, Evidence 8, Edit &
Documentary 8, Cartoon & Anime 4, Hand-drawn & Painting 7, Print & Printmaking
5, East Asian Traditions 4, Information & Keynote 5, Games 4, Cinema & Eras 2.
Paper lineage is 21/59, not a niche.

---

## 3. Twelve packs read in full

These include every pack whose identity is literally cut paper or paper
collage (`papercut-red`, `paper-lantern`, `paper-popup`, `spy-titles`,
`briefing-board`, `halftone-dossier`, `one-line`) plus the print cousins
(`ukiyoe`, `woodcut`) and three contrasting engines (`tilt-shift`,
`glass-product`, `swiss-motion`).

### 3.1 Comparison

| Pack | Envelope | Palette model | Material signature | Camera / text | Identity lives in |
|---|---|---|---|---|---|
| papercut-red | 49 s, 24 fps, 14 sh, 120 BPM 2/4 | 4 paper families + gold accent; 11 named hex + shadow | grain 7% at 130 px, cut edge wobble 0.35, shadow 2.6/3.6 blur 5 alpha .38 | 10 moves; subtitle 44 px on a red paper banner, 70 px up | `paper.js PAL`, `story.js T/SHOTS`, `motifs.js` |
| paper-lantern | 121.8 s, 30 fps, 19 sh, voice+GAP | 6-9 layer value ladder, one warm accent | box .56 x .33 x .16 m; trans .9 -> .05 back to front; rim 3 px | 10 moves; subtitle 38-40 px, 74 px up | `BOX`, `sheet({z, trans})`, `shots/index.js` |
| paper-popup | 133 s, 60 fps, 3 takes | one hue family per spread + recurring accents | page .44 x .30 m, actors .036-.052 m; border 12-16 px at 5200 px/m | fov 30/56, aperture 1.8-4, CoC 14; subtitle 40 px | `story.js`, `SH` key table, `cutmesh.js` |
| spy-titles | 44.09 s, 24 fps, 11 sets, 132 BPM | exactly 4 inks | cut gap 2.4 px, edge resample 9-10 px amp 1.2-2.2, shadow blur 5 alpha .30 | 12 fps puppets / 24 fps camera; subtitle 44 px strip left | `C`, `S.gap`, `rough()`, `story.js` |
| briefing-board | 40 s, 24 fps, 17 sh, 34 moves | paper ground + 4 ink meanings (graphite/blue/red/grey) | board 6400 x 3600 px; print z 6-14, props 8-26, tray 70 | one continuous wall; judgement holds 2.6-4.1 s; subtitle frosted strip | `scenes/film.json` (81 elements), `board.js` |
| halftone-dossier | 30 s, 30 fps, 10 sc, 120 BPM | paper + dark ink + 4-5 spot inks + one red | dot step 20-26, angles 15-70, maxK .6-.72; 7 px outline | dot wipe 80 px grid r 62 / 0.44 s; caption 46 px pill | `C` palette, `halftone()`, `WIPES`, `SHAKES` |
| one-line | 47.5 s, 24 fps, 9 chapters, no cuts | paper + warm black + one accent | line widths 2.0-2.9 by age, bleed 22%, min zoom 1.3 | z 4.5 -> 0.98, follow 0-.85; subtitle 46 px written on | `SEGS`, `CAM`, `ink.js` |
| ukiyoe | 44 s, 24 fps, 5 views, 72/96 BPM | 6-9 flat pigment blocks + paper white | block registration (2.2,-1.3)/(-1.8,1.9)/(1.5,2.2); key 2.4-3 px | 8 fps figures / 24 fps camera; subtitle 42 px cartouche | `print.js PAL`, `REG`, `VIEWS` |
| woodcut | 58.5 s, 24 fps, 17 sh, 60->90 BPM | ink + paper + wood + one copper plate | knife widths 1.2-2 / 2-8 / 10-22 / stab 3-8; print area 1848 x 912 | 12 fps cast / 24 fps camera; caption 42 px in 132 px margin | `INK/PAPER/COPPER`, `shape()`, `cutAlong()` |
| tilt-shift | 38 s, 24 fps, 8 sh, 120 BPM | saturated model palette, blue shadows | CoC band w .055, amp 30, mix .55-.7, aper 5000-9000 m | 40->820 m rise; speed 40x -> 1x; road-sign subtitle | `WINDOWS`/`rates`, `post.js band` |
| glass-product | 32 s, 24 fps, 11 sh, 120 BPM | neutral studio + one accent family | clear glass rough .015 / IOR 1.52 / thickness 3-4.5 / dispersion 5 | aper 70-900; no spatial continuity; frosted-glass subtitle | `product.js` materials, `story.js KICKS` |
| swiss-motion | 44 s, 24 fps, 8 sections, 120 BPM | paper + ink + greys + one signal | 12 col / 96 px margin / 24 px gutter / 24 px baseline | 2 curves only; subtitle is a layout column | `score.json`, `film.js C`, `ease.js` |

### 3.2 What each one actually encodes

**papercut-red (cut paper, jointed cast).**
`demo/paper.js` opens with `PAL`: `red #d2201f`, `nian #b00f26`, `far #7e1424`,
`mid #9c1323`, `rice #f2e8d0`, `indigo #1c2446`, `gold #d9a93f`, `sub #a8111f`,
`back #e98f86`, `shadow rgba(52,6,10,.38)`. A piece is a pre-rendered canvas in
its own units (`piece(box, draw, opt)`), then `finishPaper()` adds soft-light
grain, a 1 px light rim upper-left and a dark rim lower-right, and restores the
holes with `destination-in`. The jointed girl and Nian are code-built parts
(`girl.js`, `nian.js`), and `story.js` holds the whole film clock: `DUR`, `BEAT`,
`T` (snips, folds, unfolds, lanterns, fireworks), `VO`, `SHOTS`. The 14-shot
table is one array; the edit, captions, SFX and camera all read it. The style's
native move (`fold -> cut -> unfold`) is not a paragraph: `fold.js` splits a flap
into ~16 strips and animates 0.55 s per fold; `tuanhua.js` builds the 8-fold
rosette from one 45-degree wedge mirrored by D4.

**paper-lantern (paper lightbox, 3D layer stack).**
The style's real identity is a coordinate system and a transmission ladder.
`room.js` exports `BOX = {w:.56, h:.33, d:.16, front:.014, border:.035}`.
`paper.js` exposes `sheet({U,w,h,z,trans,glow,glowDraw,shadow,recv,...})`, where
`trans` is the backlight translucency. The S01 layer table runs
`z -.135` sky / `-.112` clouds trans .9 / `-.098` far mountains trans .7 /
`-.08` mid .45 / `-.062` village .25 / `-.046` river .3 / `-.03` tree .12 /
`-.014` foreground .05. That ladder *is* the style: back layers bright and
translucent, front layers dark and opaque. `shots/index.js` anchors each shot's
start to a measured narration line (`L('L03') - 1.2`), so the film's clock is
the voice, not a BPM. `post.js` defines `GRADE0` with cool-night lift
`[0,.005,.018]` and every shot falls back to it, which is what makes worker
order irrelevant.

**paper-popup (paper actors in a real room).**
Everything is in metres. `book.js` exports `BW/BD/PG`; `paper.js finishCut(art,
border=14)` draws a `#b9ad9c` cardboard edge at +1.5 px, an off-white border,
and a 512 px grain at alpha .85. The actors are 0.036-0.052 m tall. `story.js`
is the whole narrative contract: `VO` (15 lines with start + English + Chinese),
`BUB` (6 bubbles with who/start/end), `CHAPTERS` (4 banners), `OPEN` (cover
10.0-12.6), `TURNS` (three page turns). `main.js SH` is a list of camera takes;
each row is `[t, px,py,pz, tx,ty,tz, fov, aper, focus]`, interpolated with a
monotone cubic, and a new list is a hard cut. That one table encodes lens,
framing, focus and cut topology at once.

**spy-titles (cut-paper graphic).**
`paper.js C` is four inks and four darker variants; `S.gap = 2.4` is the cut gap
in screen pixels. `rough(pts, seed, amp=1.3, step=10)` resamples every edge and
displaces along the normal with low-frequency noise, plus a rare notch; `roughC`
caches it in local space so the edge does not crawl. Silhouette `piece()` merges
all interior shapes into one contour and cuts only joint slits. `story.js` is a
tempo grid: `BPM 132`, `BAR`, `B(n,beat)`, `HIT` (stabs = cut points) and `T`
(words landing, blinds, wipe, freeze, title). `film.js` derives every performance,
credit slide and sound event from that grid. Text is built from real glyph
outlines (`glyph.js`, opentype.js), re-cut with edge noise and jitter.

**briefing-board (the wall as data).**
`scenes/film.json` is the strongest single identity artefact in the corpus:
`dur`, `board {w:6400,h:3600,seed,texScale,ghosts}`, `light`, `cam {x,y,z,roll,
moves,shakes}`, `hand`, `elements[81]`, `subs`, `tray`, `mb` and `ev`. Each
camera move is `{t,d,dx,dy,dl,dr,a,b}` with velocity `u^a (1-u)^b`; `a,b` are
1.5-4, so speed and acceleration never jump. Element types are a closed
vocabulary: `print`, `tag`, `magnet`, `ruler`, `card`, `stamp`, `ink` with
sub-kinds `line`, `dim`, `write`, `hatch`, `ring`, `wake`. A single ink line is
data: `{type:"ink", kind:"line", points:[[1000,70],...], lw:15, color:"blue",
t:1.0, d:0.8, ea:1.6, eb:2.2}`. The film is 40 s of this data; the style is
`kit/board.js` plus the rules in `kit/README.md`. Four tools check it:
`camcheck.mjs` (visible share, judgement frames), `rescheck.mjs` (source px per
screen px), `subcheck.mjs` (one line per language), `cuecheck.py` (cues at 0 ms).

**halftone-dossier (print as a graphic system).**
`index.html` has one `C` palette (`paper #F4ECDD`, `navy #1D2340`,
`blue #2E55D6`, `pink #FF5A87`, `yellow #FFC628`, `red #E8384F`,
`night #18203F`) and one `F` font table. `halftone(parent,{x0,y0,w,h,step,angle,
color,f,maxK})` draws one SVG path of circles; step 20-26, angle 15-70,
`maxK .6-.72`. The dot wipe is a table: `WIPES = [[cutTime, colour], ...]`,
80 px grid, radius 62, 0.44 s. Shakes are `SHAKES = [t0, amplitude, duration]`
(16 px first stamp, 26 px verdict). Line boil is a filter applied only to
characters and props, never text or dots. The film is 10 `scene(t0,t1,build)`
functions; the style is the palette, the halftone function, the stamp function
and the two tables.

**one-line (continuous ink).**
`face.js` is the reverse-designed drawing as SVG path strings plus `SEGS`, the
chapter table: `{id, style, t:[t0,t1], parts:[{d,tf}], slowK, marks:[{at|f, t,
n}], holds:[{f,t,dur}]}`. That is the edit decision list, the animation timing,
the musical mark list, and the cue points the camera keys are authored against.
`ink.js` holds the material
constants: age widths `child 2.4 alpha .82`, `teen 2.5`, `adult 2.9 .96`,
`old 2.7 .93`, `kid 2.0 .76`; pressure `0.66 + 0.8*exp(-v/300)`; minimum width
zoom `1.3`; bleed alpha `.22`; ink `[29,26,23]`, paper `[244,239,228]`, accent
`[179,51,43]`. `shots.js CAM` has `{t,x,y,z,r,f}` rows, where `f` is the nib
follow weight; the same list gives composition, zoom, roll and follow.

**ukiyoe (woodblock print).**
`print.js PAL` is the pigment set, 30+ named values; `main.js REG` is the block
registration: `[[0,0],[2.2,-1.3],[-1.8,1.9],[1.5,2.2]]`. `views.js` exports five
view modules `V1..V5`, each with cached colour blocks `g0..g3` and a `paint()`
that stamps them through `stampLayer(dst, src, reveal, reg, shift)`. The sheet
frame is constant (`FR = {x0:44,y0:38,x1:1876,y1:1042}`, 3.4 px key border plus a
9 px outer line). `story.js` holds the 44 s timeline. Subtitles are a cartouche
object, not a lower third, and the view title is a vertical cartouche plus seal.

**woodcut (relief print).**
`engine/index.js` exports four material constants: `INK #111111`, `PAPER #EFE8D8`,
`COPPER #C8502A`, `WOOD #D8C29C`. The API is a mini language of the medium:
`shape(polys,{light,sp,wmax,lo,hi,dir,halo,white,tone,seg,gap,reveal})`,
`cutAlong(path,{w,kind,seg,gap,reveal})`, `hatch(region,{dir,tone,sp,wmax,...})`,
`flecks`, `rays`, `plate`, `woodcutFilter`, `makePrinter().render`. Knife classes
are a table with pixel widths (k 1.2-2, v 2-8, u 10-22, stab r 3-8). The print
frame is `36,36,1848x912` with a 132 px bottom margin for captions. `timeline.json`
is the tempo grid and every cue; `tools/cuecheck.py` checks score cues against
picture events and both silences (25 cues, max offset 0 ms).

**tilt-shift (lens + clock as identity).**
`post.js` defines the band: `bandY .5`, `bandW .08`, `bandAmp 30`, `bandMix .5`,
`bandTilt 0`, `bandPow 1.3`, CoC clamped at 30 px, 128 spiral taps. `story.js`
defines `WINDOWS`, each `{name,t0,t1,clock0,rate}`, where `rate` is the
time-lapse multiplier: dawn 4x, title 240x, intersection 24x, train 6x, jam
40x -> 1x -> 40x. The rates are pre-integrated at 1 ms into a table so the city
clock is deterministic. `main.js` steps the world at 8 Hz when rate >= 6,
12 Hz at 2-6, smooth below 2; the camera stays smooth every frame. Grade:
NeutralToneMapping, saturation 1.55, contrast 0.42, vignette 0.3.

**glass-product (material as identity).**
`product.js` is the material contract: `glass({roughness:.015, transmission:1,
thickness:3, ior:1.52, dispersion:5, attenuationColor:#f3f8fb})`; `frosted` is
`transmission:.82, roughness:.4, thickness:7, dispersion:1.5`; metals are
`metal(color, rough)` with chrome at .14 and satin at .16. `story.js` is a
120 BPM cue map shared with the score: `T` (sweeps, lid, lift, explode, hold,
snap), `SHOTS` (11 shots, every cut on a bar), `KICKS` (808 pattern `[0,.75,1,
1.5]` per bar), `MACRO_SWEEPS` (one per beat), `VO` (4 lines), `SFX` (material
events with pan and velocity). `studio.js` builds the strip-light environment
from emissive planes and bakes PMREM per frame; `post.js` uses aperture 700-900
for macro, 70 for the exploded view, 160-300 for wides.

**swiss-motion (one file is picture and score).**
`score.json` contains `bpm:120`, `key:"A dorian"`, `cols:["A","B","C","D","E",
"F#","G"]`, `midi:[57,59,60,62,64,66,67]`, `stiff` and `final` note grids
(`lead:[[col,row,len],...]`, `bass`, `circle`), `circleDiameterCols`,
`circlePitch`, and `timeline` in bars. `film.js` reads it to lay out the poster
and the playhead; `music/score.py` reads the same file to synthesize the melody.
The frame grid is 12 columns, 96 px side margins, 24 px gutters, 24 px baseline;
the artifact grid is 7 columns x 16 rows (91 x 40 px modules). Palette is
`#EAE9E5` page, `#FFFFFF` paper, `#111111` ink, `#E30613` signal. Two easing
curves only: `cubic-bezier(.7,0,.2,1)` and linear.

### 3.3 The remaining paper-lineage packs (compact read)

These are the other 12 of the 21 paper/print-on-paper packs. They were read at
section level plus their named constants; the point is to show that the same
encoding pattern recurs, not to give each a full treatment.

| Pack | Envelope | Material identity (exact) | Where encoded | What it proves |
|---|---|---|---|---|
| archive-lighttable | 40 s, 24 fps, 16 sh | emissive table ~0.97 white; glass transmission `T = .035 + .9*(1-pos)^1.25`; 2D camera centre/zoom/roll | `film.js`, `timeline.js`, `assets/tex/layers.json` | material and camera share one world transform |
| blueprint | 46.7 s, 24 fps, 4 seg | cyanotype fbm between `#18336B` / `#2A58A6`; line weights 3.2/2.0/1.25/0.9 sheet units; screen width = sheet width x zoom^0.65 | `draw.js`, `paper.js`, `machine.js` | scale-invariant line weight encoded as a law |
| crayon-book | 52 s, 24 fps, one take | paper `#f4efe3`; tooth anchored to the page; wax `tooth > 1-k*pressure`; drawing at 12 fps | `crayon.js`, `pal.js` | material physics in a shader, not a texture overlay |
| engraving | 40 s, 24 fps, 8 beats | paper `#f1e8d2`, ink `#1c1510`; tone thresholds .14/.5/.75; swell `0.2+0.8*sin(pi*u)^0.7` | `burin.js INK/PAPER`, `plate.js PAL`, `wash.js` | tone is line density; an engraving grammar in maths |
| ink-wash | 48 s, 24 fps, 7 beats | paper `#F2ECDE`; five ink tones; one red `#B02E22` seal; 12 fps figures / 24 fps camera | `ink.js`, `world.js`, `hero.js` | brush order and blank paper as data |
| kino-montage | 60 s, 24 fps, 17 sh | four elements only (bands / windows / cut-outs / type) + paper fibre; cut-out 7 px paper border; print grade | `assets/bld.json`, `assets/clips.json`, `timeline` | archive collage as a closed element vocabulary |
| newsreel | 54.6 s, 24 fps, 22 sec | 1480x1080 1.37 gate; picture layer / type layer; grade .6/99.6 percentile; output 14-238 | `timeline.json`, `events.json`, `tools/prep.py` | gate and grade as identity, not per-shot |
| risograph | 40 s, 24 fps, 11 sh | 2-3 spot inks; RGB = three plates; halftone period 6-8 px; angles >= 15 deg apart; misregistration 1-3 px | `riso.js INK/PAPER`, `draw.js`, `rider.js PAL` | channel-as-plate pipeline; fixed per-shot registration |
| silent-film | 54.2 s, 24 fps, 13 sec | grey densities ink .07 / cloth .15-.3 / wood .45-.6 / skin .8 / linen .9-.95; 5-step posterise; 45 deg hatching | `engine/redraw.js`, `cardspecs.js`, `timeline` | post-process is the house style; intertitles as data |
| silkscreen-poster | 38.4 s, 24 fps, 6 sec | 4-6 inks; one Path2D per ink; registration 1-3 px; poster 1000x1500 u; info band | `poster.js`, `silk.js`, `content.json` | ink layers and template as code |
| urban-sketch | 32.4 s, 24 fps, one take | ink 96% coverage; width 1.3-3.4 px; wobble ~1 px; overshoot 3-8 px; wash alpha .4-.65; 12 fps boil | `engine.js INK/PAPER`, `look.js`, `world.js` | line and wash stay separate, with a misregistration rule |
| watercolor | 113.6 s, 60 fps, one dolly | paper `#f3e2c8`; 3-5 hues + ink; stroke body .55-.6; 3-9 bristle tracks; 3-pass wash | `engine.js`, `scene.js`, `plants.js COL` | brush physics as a parameterised stroke generator |

---

## 4. Cross-pack parameter taxonomy

Encoding codes: **S** = `STYLE.md`, **D** = `DEMO.md`, **J** = `style.json`,
**C** = demo code/data, **T** = demo tools. **Scope**: I = invariant for every
film in the style; F = chosen per film; I/F = rule is invariant, value is a film
choice inside a declared range.

| # | Parameter | Encoding location | Type / unit | Exemplar values | Scope |
|---:|---|---|---|---|---|
| 1 | Frame / aspect / gate | S §2, C renderer | px, ratio | 1920x1080 default; 4:3 gate 1440x1080 (`rubber-hose`), 1480x1080 (`newsreel`), 4:3 pillarbox (`backrooms`) | I |
| 2 | Units and scale | S §2, C constants | m / px / world unit | `paper-popup` page .44x.30 m, actors .036-.052 m, near .004; `paper-lantern` box .56x.33x.16 m, camera z .3-.56, fov 26; `ukiyoe` 1920x1080 sheet = zoom 1 | I |
| 3 | Medium / render model | S §2, C file names | enum | Canvas2D, WebGL2 compositor, three.js PBR/ortho, SVG DOM, indexed framebuffer, real footage | I |
| 4 | Output fps and stepping | S §5, C `twos()` | fps, int | 24 fps on ones default; 30 (`paper-lantern`, `halftone-dossier`, `telestrator`); 60 (`paper-popup`); cast 12 fps vs camera 24; 8 fps figures / 12 fps rain (`ukiyoe`); 8 Hz world step (`tilt-shift`) | I (rate split), F (exact fps if style allows) |
| 5 | Palette count and roles | S §3, C `PAL/C/COL` | count, hex, role list | 4 inks (`spy`), 2-3 spot inks (`riso`), 6-9 blocks (`ukiyoe`), 5 hues x 5 tones (`pictogram`), paper+ink+1 signal (`swiss`), paper+dark+4-5 spots (`halftone`), neutral+1 accent family (`glass`) | I (roles), F (hues) |
| 6 | Value ladder / depth order | S §3, C layer table | ordered hex / scalar | `paper-lantern` trans .9/.7/.45/.25/.3/.12/.05; `papercut` near +1 step, far -1; `ukiyoe` far pale, near saturated; `midcentury` ground light, floor dark | I |
| 7 | Material / texture recipe | S §2, C texture functions | blend + scalar + space | paper grain 7% at 130 px (`papercut`); halftone step 20-26, angle 15-70, maxK .6-.72; woodgrain alpha .1-.17 (`ukiyoe`); riso misregistration 1-3 px; knife widths (`woodcut`) | I |
| 8 | Edge / outline / cut gap | S §2/§4, C edge functions | px, amplitude, resample | no stroke, 1 px rim + wobble .35 (`papercut`); cut gap 2.4 px, resample 9-10, amp 1.2-2.2 (`spy`); 2-3 px cel (`cel-anime`); 8 px (`game-show`); 7 px (`scifi`); 3-5 px with 12-25% breaks (`midcentury`); border 12-16 px (`paper-popup`) | I |
| 9 | Light / shadow / registration | S §2-3, C lighting/post | vector, blur px, alpha, offset px | shadow 2.6/3.6 blur 5 alpha .38 (`papercut`); top spot + per-layer transmission (`paper-lantern`); one window vector (`briefing`); no gradients (`halftone`); strip env + floor caustics (`glass`); block offset (2.2,-1.3) etc. (`ukiyoe`) | I |
| 10 | Background treatment | S §3, C bg functions | rule + palette | paper ground separate from hero family (`papercut`); paper is white (`ukiyoe`); black studio, no horizon (`glass`); flat page + grid (`swiss`); model town (`tilt-shift`); printed cream ground even at night (`halftone`) | I |
| 11 | Framing / composition | S §6, C layout | grid, %, safe area | 12 col / 96 px margin / 24 gutter / 24 baseline (`swiss`); cell = 1/6 frame height (`pictogram`); subject 1/3 height (`midcentury`); close-up 1/4-1/3 height (`tilt-shift`); judgement frame 28-50% wall width (`briefing`); bottom 15% reserved (`briefing`) | I |
| 12 | Camera vocabulary | S §6, D shots, C modules | list + meanings | 7-13 moves in the standard table; 10 (`papercut`, `paper-lantern`, `spy`), 9 (`ukiyoe`, `swiss`), 11 (`glass`), 12 (`shadow-puppet`); each row names what it expresses and what it can serve | I |
| 13 | Camera representation | C | keyframe struct | `[t,px,py,pz,tx,ty,tz,fov,aper,focus]` (`paper-popup`); `{t,x,y,z,r,f}` (`one-line`); `{t,d,dx,dy,dl,dr,a,b}` (`briefing`); `track([[t,[x,y,z]],...])` (`papercut`); one `aim()` with hand drift (`paper-lantern`) | F |
| 14 | Camera frequency / travel | S §6, C, T | moves/film, px/shot, % frame | 34 moves / 17 shots (`briefing`); 44 keys on one board (`whiteboard`); 19 shots each anchored to a line (`paper-lantern`); z 4.5 -> 0.98 (`one-line`); 40 -> 820 m (`tilt-shift`); orbit .2-.4 rad/shot (`glass`); 51.4% max wall width before reveal (`briefing`) | I/F |
| 15 | Lens / focus / depth | S §2/§6, C post | fov deg, aperture, CoC px | fov 26 (`paper-lantern`); fov 30/56, aperture 1.8-4, maxCoc 14 (`paper-popup`); band w .055, amp 30, mix .55-.7, aper 5000-9000 m, CoC 30 (`tilt-shift`); aperture 700-900 macro / 70 exploded (`glass`); aperture 12-26 (`paper-lantern` DEMO) | I/F |
| 16 | Shot duration distribution | D shots, C `SHOTS/WINDOWS` | s, count | median 1.6 s / 79 shots (`pictogram`); 2.0 / 11 (`glass`); 2.85 / 14 (`papercut`); 5.0 / 8 (`tilt-shift`); 5.96 / 19 (`paper-lantern`); 7.5 / 5 (`ukiyoe`); 1 take (`one-line`, `briefing`, `iso`, `whiteboard`, `watercolor`); corpus median of medians ~3.0 s, middle half 2.4-4.6 s | I (range), F (actual) |
| 17 | Action / motion per shot | S §5, D, C | beats/shot, actions/shot | `ukiyoe` one or two small actions per view; `briefing` something lands/draws/swings every 1-2 beats; `midcentury` one hand action per step; `papercut` hard 12 fps poses with 1-frame overshoot; `glass` one event per beat | I |
| 18 | Transitions | S §6, C transition functions | enum + s | paper actions only (`papercut`); dot wipe 80 px / r 62 / .44 s (`halftone`); dissolves .5-1.2 s + iris + curtain (`paper-lantern`); page turn 2.3 s / 40 segments (`paper-popup`); hard cut = new impression (`woodcut`); no dissolves (`spy`, `swiss`, `glass`) | I |
| 19 | Continuity vs cuts | S §1/§6, C shot list | rule + count | no cuts, morph only (`one-line`); handscroll slides (`ukiyoe`); one continuous wall (`briefing`); no dissolve inside the book (`paper-popup`); each shot its own stage, no spatial continuity (`glass`); 10/59 are one continuous camera, board or wall | I |
| 20 | Type roles / families / sizes | S §4, C `FONTS/F` | family, weight, px | Fraunces 44 (`papercut`); Fredoka 40 (`paper-popup`); League Spartan 44 (`spy`); Noto Serif 42 (`ukiyoe`); IM Fell 42 (`woodcut`); Caveat 46 (`one-line`); Archivo 120/980/19 (`swiss`); halftone 100-230 headline / 46 caption | I (roles), F (family within licence) |
| 21 | Text container / box / rules | S §4, C HUD | shape + anchor + rule | red paper banner (`papercut`); cream cartouche + seal (`ukiyoe`); letterpress margin (`woodcut`); caption pill + keyword in highlight ink (`halftone`); frosted glass bar (`glass`); road sign (`tilt-shift`); layout column, no box (`swiss`); no box, halo (`one-line`); red rule under a verdict (`briefing`); 1 px rule above a caption (`swiss`); 8/8 px misregistration shadow (`halftone`) | I |
| 22 | Text animation | S §4, C HUD | duration, stagger, chars/s | drop on two 12 fps steps (`papercut`); pop per char .05-.08 s (`halftone`); type 30 chars/s (`paper-popup`); write .2 s + 17 ms/char (`one-line`); slide .18 s (`spy`); ink up .1 s / fade .15 (`woodcut`); clip reveal per word (`swiss`) | I |
| 23 | Text safe area / reading time | S §4, C tools | px, s, chars | 70 px bottom (`papercut`); 74 px (`paper-lantern`); 72 px (`ukiyoe`); 100 px (`one-line`); bottom 15% (`briefing`); hold `max(1.8 s, speech + 0.6 s)` 47/59 (`+0.7` papercut, `+0.75` ukiyoe); `chars/12 + 1 s` (`silkscreen`, `midcentury`); CJK x4.5 + other x15 + 1.5 (`briefing`) | I |
| 24 | Cast archetype / construction | S §1/§5, C cast modules | rig spec | jointed cut-outs pinned at rivets (`papercut`); 7-head silhouettes (`spy`); 3-5 cm flat cards with 12-16 px white border (`paper-popup`); faceless bars + disc head (`pictogram`); held body, moving hands (`midcentury`); paper sheet + limb sheets (`paper-lantern`); roughly a dozen pure graphic/data/3D-product styles have no cast | I |
| 25 | Cast movement | S §5, C animation | fps, amplitude, phase | 12 fps steps; walk phase from distance (1.8 cm/half-step); `scale.x` flip, never `rotation.y` (`paper-popup`); blink every 3.7 s; 8-drawing run cycle (`spy`); 8 fps figures (`ukiyoe`); 1-frame overshoot 1.15x (`papercut`); no squash in paper (`paper-lantern`) | I |
| 26 | Props / sets standards | S §2/§10, C asset libs | units, z, anchors, licence | `briefing` objects carry anchors (`L/R` bridges, `bow/stern` ships), z 6-14 prints, 8-26 props, 70 tray, source/licence recorded; `papercut` motif library (sawtooth, crescent, cloud, rosette, plum, coin); `ukiyoe` motif vocabulary (mist bands, needle pads, slanted fields); `paper-popup` front/back cards, alphaTest .5, custom depth; `paper-lantern` full-bleed .558 x .328 max | I (standards), F (objects) |
| 27 | Element interaction | S §1/§2/§9, C engine | rules | holes are light and no floating islands (`papercut`); cut-out alpha shadows (`paper-popup`); 2.4 px cut gap + black backing (`spy`); prints pinned with one light vector and parallax by z (`briefing`); ink/paper only, retrace invisible (`one-line`); paper is white and border can break (`ukiyoe`); colour plate only on carved white (`woodcut`) | I |
| 28 | Sound / music / SFX | S §7, C `mix.py/music.py` | instruments, dB, LUFS | 59/59 -14 LUFS; duck 4-12 dB (papercut 9, glass 12, swiss 10); 9/59 no voice; silence is a beat; foley by material; score generated in code or a licensed track; grain 0-6 | I (mix targets), F (palette/track) |
| 29 | Narration | S §7, C `lines.json` | lines/min, voice, speed | 4-25 lines; 5-12 lines/min; Kokoro speed 0.78-1.18, paper/folklore 0.84-0.90, news 1.10-1.18; exact wpm is not encoded anywhere | I (mode/density), F (voice) |
| 30 | Clock / BPM / tempo map | S §7, D, C `story.js` | BPM, meter, mode | 60-200 BPM; 120 common; 143.55 (`brick-toy`); 132 (`spy`), 150 (`pictogram`), 200 (`newsreel`); 1 beat = 1 s (`countdown`); no BPM (`one-line`, `watercolor`); voice durations + `GAP` (`paper-lantern`); tempo map 96->144->88->60->72 (`silent-film`) | I (mode), F (tempo) |
| 31 | Variation space | S §11, D | enumerated | 3 structures, 3 openings, 3 endings, all far from the demo; explicit list of what the film may choose (cast, sets, opening, ending, camera path, palette within logic, pacing) | I (boundary), F (choice) |
| 32 | QA / proof | S §10, D build, T | command + threshold | cue offset 0 ms or +/-15 ms; ASR word match; readcheck; subtitle one-line; motion floor; source px >= 1; determinism; 31/59 any check, ~6 motion/resolution | I |

### 4.1 What the table shows

- **Invariants are mostly relational, not scalar.** "Warm paper" is not a
  parameter; `#F4EFE4`, a 1400-unit mottle, a 0.13 vignette and a 1.3 minimum
  width zoom is. "Cut paper" is a 2.4 px gap, a cached local edge, a 0.38-alpha
  shadow and a 12 fps cast.
- **The same parameter is represented at different levels.** Camera is a
  vocabulary table in `STYLE.md`, a key list in code, and a travel budget in
  `DEMO.md`; a spec must bind all three or none can be checked.
- **Per-film values are everywhere in `STYLE.md`.** The template says they
  should be promoted only deliberately, but no pack records the promotion. The
  spec needs an explicit `scope` field, not a convention.
- **The corpus fixes global defaults 59 times.** -14 LUFS, the hold formula,
  24 fps, no dissolves where forbidden, one accent. A style file should declare
  only deviations; otherwise every new pack re-litigates the same numbers.

---

## 5. Best-encoded packs: identity in data, not prose

### 5.1 Ranking

**Tier A - identity is executable and data-driven:**

1. **briefing-board** - scene JSON (element vocabulary + camera moves) and four
   checkers. The only pack where a whole film is a readable data file.
2. **swiss-motion** - one `score.json` is picture and music; the grid, palette
   and type live in a short `film.js`.
3. **paper-popup** - `story.js` narrative contract + `SH` camera key table +
   `cutmesh` material contract. Every shot is one continuous camera list.
4. **paper-lantern** - metre units, `sheet({z,trans})`, a `GRADE0` fallback,
   and shots anchored to measured voice lines.
5. **one-line** - `SEGS` (window, style, marks, holds) + `CAM` (composition,
   zoom, roll, follow) + `ink.js` material constants.
6. **papercut-red** - `PAL`, `T`, `SHOTS`, `motifs.js`, `piece()`: a material
   vocabulary and a clock, both code.
7. **ukiyoe** - `PAL`, `REG` block registration, `VIEWS` as cached print
   modules, `stampLayer()` as the print operation.
8. **halftone-dossier** - one palette, one halftone function with numeric
   parameters, `WIPES` and `SHAKES` as tables.

**Tier B - strong data, weaker binding:** `tilt-shift` (windows/rates + band),
`glass-product` (materials + shared kick list), `midcentury-toon`
(`content.json` + `PAL` + `REG`), `pictogram-motion` (EDL in beats),
`risograph` (channel-as-plate pipeline), `silkscreen-poster` (ink layers),
`woodcut` (medium API), `spy-titles` (four inks + tempo grid).

**Tier C - identity mostly prose, demo is a one-off:** `archive-lighttable`,
`caption-news`, `city-symphony`, `dataviz`, `news-package`, `newsreel`,
`visual-investigation`, `telestrator`. These are documentary/archive styles
where the material is footage and the edit is the style; the identity is
genuinely harder to encode, but the current packs do not try.

### 5.2 Concrete identity definitions

**`style.json` has no visual identity (all 59).** The actual template:

```json
{
 "slug": "my-style", "num": "99", "en": "My Style", "cn": "我的风格",
 "category_en": "Graphic & Type", "category_cn": "图形与排版",
 "film": "Title of the Demo Film",
 "line": "One sentence: what happens in the demo film.",
 "line_cn": "一句话：demo 片里发生了什么。",
 "uses": ["Use one", "Use two", "Use three"],
 "frame_sec": 12.0, "dur": 0
}
```

**Cut-paper palette and clock (papercut-red).**

```js
export const PAL = {
  red: '#d2201f',      // girl / tuanhua / houses (China red)
  nian: '#b00f26',     // Nian beast (one shade darker)
  far: '#7e1424', mid: '#9c1323',
  rice: '#f2e8d0', indigo: '#1c2446',
  gold: '#d9a93f', sub: '#a8111f', back: '#e98f86',
  shadow: 'rgba(52,6,10,.38)', light: '#ffe3a6', transmit: '#e0401c'
};
export const DUR = 49, BEAT = .5;
export const T = { snips:[.25,1,1.75], folds:[24,25,26], cut0:26.5,
  unfolds:[30,30.25,30.5], bloom:31,
  lanterns:[32,32.25,32.5,32.75,33,33.25,33.5,33.75] };
export const SHOTS = [[0,2.9,'macro'], [2.9,7.1,'title'], [7,12,'village'] /* ... 11 more rows */];
```

**Paper lightbox: units, layer z and transmission (paper-lantern).**

```js
export const BOX = { w: .56, h: .33, d: .16, front: .014, border: .035 };
// S01 layer table, schematic: [z(m), backlight trans, art]
const LAYERS = [
  [-.135, null, 'skyPanel #0a1330 -> #43598a'],
  [-.112, .90, 'xiangyun clouds #c3cbe8'],
  [-.098, .70, 'karst far #6a86c2'],
  [-.080, .45, 'karst mid #3f5a92'],
  [-.062, .25, 'village #5a70a6 / #1b284f, glow #ffb862'],
  [-.046, .30, 'river #22325e, moon trail #e9cf96'],
  [-.030, .12, 'osmanthus #17224a, flowers #d9a24a'],
  [-.014, .05, 'foreground #0e1532']
];
```

**Camera takes and narrative contract (paper-popup).**

```js
// each inner list is one continuous shot; a new list = a hard cut
const SH = [[
  [0.0, .5,.2,1.12, -.08,.12,.2, 34, 3.0],
  [4.5, .34,.3,.98, -.04,.08,.18, 32, 3.0],
  [9.8, .08,.4,.7,   .0,.03,.14,  30, 3],
  // [t, px,py,pz, tx,ty,tz, fov, aperture, focus?]
], [ /* reverse shot fov 56, focus .11 */ ]];
export const OPEN = [10.0, 12.6];
export const TURNS = [[48.6,51.4],[71.6,74.4],[86.8,89.6]];
export const VO = [['v01',1.6,'On a quiet desk...','...']];
export const BUB = [['pip',22.4,25.4,'Good morning, Papervale!','...']];
```

**The whole wall as JSON (briefing-board).**

```json
{ "dur": 40, "board": {"w":6400,"h":3600,"seed":11},
  "cam": {"x":1200,"y":330,"z":2.6,"roll":-3,
          "moves":[{"t":0,"d":0.5,"a":1.4,"b":2.8,"dx":560}]},
  "elements": [
    {"type":"ink","kind":"dim","from":[1004,300],"to":[2236,300],
     "lw":12,"color":"blue","t":-0.05,"d":0.3},
    {"type":"print","src":"objects/suspension.png","xy":[2800,1700],
     "w":900,"z":10,"arrive":{"t":28.875,"kind":"drop","d":0.6}},
    {"type":"tag","text":"2,023 m","xy":[2900,1400],"size":100,
     "arrive":{"kind":"swing"},"strike":{"t":30.175,"d":0.25}}
  ]}
```

**One file, picture and score (swiss-motion).**

```json
{ "bpm": 120, "key": "A dorian",
  "cols": ["A","B","C","D","E","F#","G"],
  "midi": [57,59,60,62,64,66,67],
  "stiff": {"lead":[[0,0,1],[1,1,1],[2,2,1]], "bass":[[0,0,16]], "circle":[5,0]},
  "final": {"lead":[[0,0,4],[1,4,1],[2,5,1]], "bass":[[0,0,8]], "circle":[-1.148,12.5]},
  "timeline": {"circleIn":20.0,"land":26.0,"breath":[30,32],"dur":44.0} }
```

**One line: the edit table is the animation table (one-line).**

```js
export const SEGS = [
  { id:'birth', style:'child', t:[1.0,4.9], slowK:3.2,
    parts:[{d:BIRTH, tf:EAR1_TF}], marks:[{at:[-314,-74], t:4.1}] },
  { id:'kite',  style:'child', t:[4.9,9.7], slowK:2.6,
    parts:[{d:DOME_L},{d:HAIR},{d:KITE,tf:KITE_TF},{d:TAIL},
           {d:reverseC(TAIL)},{d:reverseC(HAIR)},{d:DOME_R}],
    marks:[{f:.284,t:5.9},{f:.364,t:6.4},{f:.792,t:8.9}] },
  { id:'loss', style:'adult', t:[22.8,26.85],
    parts:[{d:EYE_R}], slowK:2.4, holds:[{f:.999,t:23.8,dur:3.05}] }
];
export const CAM = [{t:0,x:-272,y:-18,z:4.5,r:0,f:0},
                    {t:38.5,x:0,y:-190,z:0.98,r:0,f:0}];
```

**Registration is a four-value table (ukiyoe).**

```js
const REG = [[0,0], [2.2,-1.3], [-1.8,1.9], [1.5,2.2]];
// g0 key, g1 blues, g2 greens/secondary, g3 reds/figures
stampLayer(ctx, layer(v,name), reveal, REG[g], SHIFT[g]);
```

**The print material is a parameter object (woodcut).**

```js
export const INK='#111111', PAPER='#EFE8D8', COPPER='#C8502A', WOOD='#D8C29C';
const spark = WC.shape([star], {
  light: WC.light(.5,-.6,.6), sp: 9, halo: 8,
  reveal: { t0:0, t1:.8, key:(x,y)=>Math.hypot(x-960,y-500)/300 }
});
WC.plate(c, [star], t > .8 ? 1 : 0);   // the one colour, only on carved white
```

**Time-lapse rate is a function, not a note (tilt-shift).**

```js
export const WINDOWS = [
  {name:'dawn',  t0:0,  t1:5,  clock0:0,       rate:()=>4},
  {name:'title', t0:5,  t1:9,  clock0:15*60,   rate:()=>240},
  {name:'ix',    t0:9,  t1:14, clock0:72*60,   rate:()=>24},
  {name:'jam',   t0:19, t1:DUR + .5, clock0:118*60, rate:jamRate} // 40 -> 1 -> 40
];
// 8 Hz world step when rate >= 6, 12 Hz at 2-6, smooth below 2; camera always smooth
```

---

## 6. What 59 packs collectively prove is missing from a prose-only style bible

1. **No style-level executable identity.** 0/59 encode palette, material, lens,
   type size or motion rate in a style-level machine-readable file. `style.json`
   is a gallery card. `release.py` validates nine metadata fields and the
   sign-off; it never reads the look.

2. **The prose is not where the exact value lives.** Only 36/59 `STYLE.md`
   contain a hex colour; 58/59 `DEMO.md` and 57/59 code do. In the remaining 23,
   the look is described in words ("warm paper", "cut edge", "one accent")
   while the actual hex, threshold and alpha live in code. A reader of the
   bible cannot reproduce the style; a reader of the demo can.

3. **Invariant vs per-film is undefined in the data.** The template says a
   measured value becomes a rule only when promoted deliberately, but there is
   no promotion record, no range, no tolerance and no scope field. `papercut`
   uses 5 narration lines and 49 s; `paper-lantern` uses 25 lines and 121.8 s;
   both are "the style". The boundary is editorial memory.

4. **Medium physics cannot be written as adjectives.** The identity is a
   transmission ladder (.9 -> .05), a 2.4 px cut gap, a 0.38-alpha shadow, a
   fixed registration offset per block, a 20-26 px halftone grid at 15-70
   degrees, knife widths by tone, an 8 Hz world step against a smooth camera.
   Each is a number plus a domain of application. Prose names them; only code
   enforces them.

5. **Composition is rule-based and untested.** 12 columns / 96 px margins /
   24 px gutters; subject 1/3 frame height; judgement frame 28-50% of the wall;
   never more than 51.4% wall width before the reveal. These are testable
   constraints, but no pack has a composition checker.

6. **Camera is a vocabulary plus a budget, not a list of moves.** The packs
   offer 7-13 moves with meanings, then use 4-34 per film (`briefing` 34 in 17
   shots; `whiteboard` 44 keys on one board). Without a per-shot travel and
   frequency field, "the camera rides the line" cannot be distinguished from
   "the camera never stops".

7. **Text is in-world but has no schema.** The container changes completely:
   banner, cartouche, letterpress margin, caption pill, frosted bar, road sign,
   layout column, no box. Font size, anchor, safe area, entry animation and
   hold are all style-specific. Only the hold formula is repeated globally
   (47/59), which is evidence that the rest should be a contract, not a habit.

8. **Cast construction is code, not a reusable spec.** Rivets, joint slits,
   white borders, `scale.x` flips, 1/40 pose quantisation, blink intervals and
   walk-phase-from-distance are all in demo code. There is no portable cast/rig
   file in the corpus; every cast is a one-off module.

9. **Sound is measured but not specified.** 59/59 say -14 LUFS and most give a
   duck range; only the demo `mix.py` knows the actual cue list, duck curve,
   limiter and silence gates. Instrument and foley lists are prose; the cue
   binding is code. A style spec should carry the sound palette as data and the
   mix targets as checks, not repeat -14 LUFS 59 times.

10. **QA is partial and mostly editorial.** 31/59 have any named check tool,
    but only about 6 check motion, resolution or camera; none check palette,
    fps, outline width, subtitle size or medium. The final gate is a person
    looking at a style frame. That is exactly the gap an identity schema plus
    `style:check` should close.

11. **The template's size guidance has already failed.** It asks for 6-11 KB;
    the real files are 10.4-20.1 KB (median 12.1). The excess is not waste: it
    is the numerical material that has no schema. A structured identity file
    would shrink the prose, not grow it.

---

## 7. A proposed identity schema

This is a proposal informed by the packs, not an existing Lemo format. It is
designed for the Paper Studio situation: one style, many films, deterministic
render, and a command that proves each claim.

### 7.1 Principles

1. **One parameter, one record.** Every number that a renderer or checker needs
   has an `id`, a `value` or `range`, a `unit`, a `scope`, a `source` and
   optionally a `check`. Prose may explain why; the record is the truth.
2. **Scope is explicit.** `invariant` means every film must satisfy it.
   `film` means the film chooses inside a declared range. `invariant-rule`
   means the rule is fixed but the film supplies the instance (e.g. "one
   accent" fixed, the hue chosen).
3. **Global defaults live once.** `-14 LUFS`, the hold formula, 24 fps, the
   no-dissolve default and the 16:9 frame belong in a shared
   `style.defaults.json`; a style records only deviations.
4. **Every invariant has a check.** If it cannot be checked, it is a note, not
   an invariant. A check may be a render probe, an image measurement, a schema
   assertion or a report comparison.
5. **Provenance is part of the value.** Each record names the `STYLE.md`
   section, the `DEMO.md` table and the code constant it came from. When they
   disagree, the build fails and someone chooses.
6. **No per-film content in the style file.** No names, dates, venues, lines,
   shots, palettes of one film. The style file describes the space; the film
   file describes one point in it.

The field set follows the failure modes in section 6. `id` gives a stable name
across packs; `value` vs `range` is how the template's "promote a demo value
deliberately" becomes a real choice; `source` keeps the three-layer provenance
(`STYLE.md`, `DEMO.md`, code) visible; `check` turns a claim into a command;
`examples` holds demo values without promoting them to rules. `assets` is where
a reusable library (font, rig, motif set) is separated from per-film objects.

### 7.2 JSON shape

```json
{
  "$schema": "paper-studio/style-identity@1",
  "meta": {
    "id": "papercut-red",
    "version": "1.0.0",
    "status": "reviewable",
    "derivedFrom": ["lemo-opuscar/styles/papercut-red"],
    "licence": "CC-BY-4.0",
    "updated": "2026-11-04"
  },

  "envelope": {
    "medium": "cut-paper-2d",
    "renderer": "canvas2d",
    "frame": { "w": 1920, "h": 1080, "fps": 24, "gate": "16:9" },
    "duration": { "min": 30, "median": 49, "max": 60, "unit": "s" },
    "clock": { "mode": "bpm", "bpm": 120, "meter": "2/4" },
    "audio": { "mode": "voice+music+sfx", "voiceLines": [4, 7] },
    "units": "px"
  },

  "parameters": [
    {
      "id": "palette.hero",
      "group": "palette",
      "role": "hero material",
      "value": "#d2201f",
      "range": ["#c8102e", "#d7261e"],
      "unit": "hex",
      "scope": "invariant-rule",
      "tolerance": { "deltaE": 3 },
      "source": ["STYLE.md#3", "demo/paper.js#PAL.red"],
      "check": "palette:check",
      "examples": { "Nian": "#b00f26", "foldBack": "#de3b30" }
    },
    {
      "id": "material.grain",
      "group": "material",
      "value": { "blend": "soft-light", "amp": 0.07, "scalePx": 130 },
      "unit": "ratio/px",
      "scope": "invariant",
      "tolerance": { "amp": 0.01, "scalePx": 10 },
      "source": ["STYLE.md#2", "demo/paper.js#paperGrain"],
      "check": "material:check"
    },
    {
      "id": "motion.castFps",
      "group": "motion",
      "value": 12,
      "unit": "fps",
      "scope": "invariant",
      "tolerance": 0,
      "source": ["STYLE.md#5", "demo/main.js#st"],
      "check": "motion:check"
    },
    {
      "id": "edit.medianShot",
      "group": "editing",
      "value": 2.85,
      "range": [1.8, 4.0],
      "unit": "s",
      "scope": "film",
      "tolerance": 0.4,
      "source": ["DEMO.md#shots"],
      "check": "edit:check"
    }
  ],

  "variation": {
    "structure": "free",
    "cast": "per-film",
    "sets": "per-film",
    "palette": "within declared roles and value order",
    "opening": "free",
    "ending": "free",
    "cameraPath": "free",
    "pacing": "within edit range",
    "requiredDifferences": ["structure", "opening", "ending", "signatureShot"]
  },

  "assets": {
    "fonts": [
      { "role": "subtitle", "family": "Fraunces", "weight": 600, "licence": "OFL" },
      { "role": "subtitle", "family": "Fraunces", "weight": 800, "licence": "OFL" }
    ],
    "rigs": ["jointed-cutout@1"],
    "libraries": ["motifs/folk-cut@1"],
    "perFilm": ["cast", "sets", "props", "palette instances"]
  },

  "checks": [
    { "id": "schema:check",  "cmd": "npm run style:check -- <style>", "fails": "schema, source paths, scope" },
    { "id": "palette:check", "cmd": "npm run palette:check -- <style>", "fails": "role count, deltaE, accent budget" },
    { "id": "motion:check",  "cmd": "npm run motion:check -- <style>", "fails": "cast fps, step rate, hold" },
    { "id": "type:check",    "cmd": "npm run audit:type -- <score>", "fails": "subtitle size, safe area, hold" },
    { "id": "mix:check",     "cmd": "npm run mix -- <score>", "fails": "LUFS, true peak, duck depth" },
    { "id": "determinism",   "cmd": "npm run determinism -- <score>", "fails": "same frame, serial vs parallel" }
  ],

  "provenance": [
    { "path": "STYLE.md", "hash": "sha256:...", "role": "invariants" },
    { "path": "DEMO.md",  "hash": "sha256:...", "role": "one proof" },
    { "path": "demo/paper.js", "hash": "sha256:...", "role": "material constants" }
  ]
}
```

### 7.3 Worked excerpt: a paper-cut identity

The following values are drawn from `papercut-red` and `paper-lantern`; they
are examples of the shape, not a merged style.

```json
{
  "id": "paper-cut",
  "envelope": {
    "medium": "cut-paper",
    "renderer": "canvas2d",
    "frame": { "w": 1920, "h": 1080, "fps": 24, "gate": "16:9" },
    "units": "px",
    "clock": { "mode": "bpm", "bpm": 120, "meter": "2/4" }
  },
  "parameters": [
    { "id": "palette.paper", "value": "#f2e8d0", "unit": "hex",
      "scope": "invariant", "source": ["STYLE.md#3", "demo/paper.js#PAL.rice"] },
    { "id": "palette.hero", "value": "#d2201f", "unit": "hex",
      "scope": "invariant-rule",
      "range": ["#c8102e", "#d7261e"],
      "source": ["STYLE.md#3", "demo/paper.js#PAL.red"] },
    { "id": "palette.accentCount", "value": 1, "unit": "count",
      "scope": "invariant", "source": ["STYLE.md#3"] },
    { "id": "material.grain", "value": { "amp": 0.07, "scalePx": 130,
        "blend": "soft-light" }, "unit": "ratio/px", "scope": "invariant",
      "source": ["STYLE.md#2", "demo/paper.js#paperGrain"] },
    { "id": "edge.cutWobble", "value": 0.35, "unit": "px",
      "scope": "invariant", "tolerance": 0.05,
      "source": ["DEMO.md#build-notes", "demo/paper.js#finishPaper"] },
    { "id": "shadow.paper", "value": { "offsetPx": [2.6, 3.6],
        "blurPx": 5, "alpha": 0.38 }, "unit": "px/alpha",
      "scope": "invariant", "source": ["DEMO.md#palette", "demo/paper.js"] },
    { "id": "motion.castFps", "value": 12, "unit": "fps",
      "scope": "invariant", "source": ["STYLE.md#5", "demo/main.js#st"] },
    { "id": "motion.cameraFps", "value": 24, "unit": "fps",
      "scope": "invariant", "source": ["STYLE.md#5"] },
    { "id": "camera.moves", "value": ["ecu-track", "locked-front", "pan-parallax",
        "low-wide", "top-down", "push-pull", "page-turn", "pull-back-object",
        "rotate-rosette"], "unit": "enum[]", "scope": "invariant",
      "source": ["STYLE.md#6"] },
    { "id": "camera.maxTravel", "value": 1.5, "unit": "frameWidth",
      "scope": "film", "source": ["STYLE.md#6"] },
    { "id": "edit.medianShot", "value": 2.85, "range": [1.8, 4.0],
      "unit": "s", "scope": "film", "source": ["DEMO.md#shots"] },
    { "id": "type.subtitle", "value": { "family": "Fraunces",
        "weight": 600, "px": 44, "anchor": "bottom-center", "offsetPx": 70,
        "container": "paper-banner", "entry": "two-12fps-steps" },
      "unit": "px/enum", "scope": "invariant",
      "source": ["STYLE.md#4", "DEMO.md#palette"] },
    { "id": "type.hold", "value": "max(1.8, speech+0.7)", "unit": "s",
      "scope": "invariant", "source": ["STYLE.md#4"] },
    { "id": "sound.duck", "value": { "musicDb": 9, "foleyDb": 3 },
      "unit": "dB", "scope": "invariant", "source": ["STYLE.md#7"] },
    { "id": "mix.lufs", "value": -14, "unit": "LUFS",
      "scope": "invariant", "source": ["STYLE.md#7"] },
    { "id": "narration.linesPerMin", "value": [5, 8], "unit": "count/min",
      "scope": "film", "source": ["DEMO.md#score"] }
  ]
}
```

### 7.4 How the schema maps to checks

| Schema group | Check | What fails |
|---|---|---|
| `envelope.frame` | render probe | wrong w/h/fps/gate; a 4:3 style rendered 16:9 |
| `palette.*` | `palette:check` on a style frame + sample frames | missing role, deltaE > tolerance, accent over budget, hero used on ground |
| `material.*` | `material:check` on a flat swatch | wrong grain scale/blend, missing texture, texture in screen space |
| `edge.*` / `shadow.*` | `material:check` on a cut-out sheet | wrong wobble, gap, rim, shadow vector |
| `motion.castFps` / `cameraFps` | `probe:motion` / `camera:check` | cast smooth at 24, camera stepped at 12, still shot |
| `camera.moves` / `maxTravel` | `camera:check` | move not in vocabulary, travel over budget, four-shot run |
| `edit.medianShot` / distribution | `audit:frames` | median outside range, hold over limit |
| `type.*` | `audit:type` | subtitle outside safe area, too small, hold short |
| `sound.*` / `mix.*` | `mix` / `deliver` | LUFS/true peak out, duck depth wrong |
| `narration.*` | `asr` / `voice` | line count outside range, word timing drift |
| `variation.requiredDifferences` | `film:review` | demo clone: same structure/opening/ending/signature shot |

### 7.5 Migration from the 59

1. Extract every bold numeric in `STYLE.md`, `DEMO.md` and the named code
   constants into records. Start with palette, material, edge/shadow, fps,
   camera vocabulary, type and mix.
2. Mark each record `invariant`, `invariant-rule` or `film`. When a `STYLE.md`
   number is actually the demo's value, move it to `examples`, not `value`.
3. Add a `check` only where a command can fail. Otherwise mark `note` and keep
   it out of the gate.
4. Hash the source files into `provenance`; a build fails when the prose, the
   demo and the code disagree.
5. Keep `STYLE.md` as the human explanation. It can shrink to what the schema
   cannot say: why the medium exists, what it refuses, what a good film does
   with it.

---

## 8. Packs worth copying structurally

| Pack | Copy | Why | Do not copy |
|---|---|---|---|
| **briefing-board** | `scenes/film.json` element vocabulary; `kit/README.md` field table; `camcheck/rescheck/subcheck/cuecheck` | The only pack where the film is a readable world file, and every identity claim (camera width, source resolution, subtitle width, cue time) has a checker | The specific bridge photos, board layout, verdict, or 6,400 px board size |
| **paper-popup** | `story.js` (VO/BUB/CHAPTERS/OPEN/TURNS); `main.js SH` camera key table; `cutmesh.js` front/back/shadow contract | Narrative, camera and material are three separate, readable contracts; real units make lens and shadow behave | The book story, characters, 133 s length, licensed music |
| **paper-lantern** | `BOX` + `sheet({z,trans})` layer ladder; `shots/index.js` line-anchored starts; `post.js GRADE0` | Identity is a coordinate system and a transmission ladder; the voice is the clock; every shot has a deterministic default | The 25-line Mandarin demo, the real lightbox room, the 121.8 s length |
| **one-line** | `face.js SEGS` (window/style/marks/holds); `shots.js CAM`; `ink.js` material constants | One table is edit, animation, music marks and camera; a true continuous-time style | The face reveal, 9 chapters, the specific story |
| **swiss-motion** | `score.json` (picture+music); `film.js C`; `ease.js` two curves | The cleanest example of one data file driving two outputs, with a tiny palette/type surface | The poster subject, 5 rules, the exact grid values if the style differs |
| **papercut-red** | `paper.js PAL` + `piece/finishPaper`; `story.js T/SHOTS`; `motifs.js` | Material vocabulary and clock are both code; the native move is an engine function, not a paragraph | The Nian story, the Chinese New Year palette, 49 s |
| **ukiyoe** | `print.js PAL`; `main.js REG`; `views.js` cached block modules | Per-block registration and a print pipeline are first-class identity; views are data modules | The five views, the traveller, the Great-Wave-adjacent composition |
| **midcentury-toon** | `content.json` field contract; `PAL` + `REG`; use-case table in §11 | Best scene-style content schema: product, steps, icons, actions, measures, palette, voice | The robot vacuum, the 1950s brand, the exact palette |
| **halftone-dossier** | `C` palette; `halftone()` params; `WIPES`/`SHAKES` tables | A graphic system expressed as functions plus two timing tables; very small source | The cat case file, the Chinese copy, 30 s |
| **tilt-shift** | `story.js WINDOWS`/rates; `post.js band` | Time rate and lens band are the identity; both are parameterised and checked by the picture | The toy town, ducks, 38 s, the exact 40x rate |

Honourable mentions: `glass-product` for material constants, `pictogram-motion`
for an EDL in beats, `risograph` for channel-as-plate, `woodcut` for a medium
API, `spy-titles` for a four-ink palette + tempo grid.

---

## 9. Method and limits

- **Inventory:** all 59 `style.json`, all 59 `STYLE.md` section headings,
  demo file trees, named palette/clock/camera constants, and the existing
  `docs/research/lemo-59-survey.md` tables. Counts in this report are scripted
  from those files (`Select-String` / regex), not estimated.
- **Deep read:** 12 packs in full (`STYLE.md`, `DEMO.md`, `story.js`/timeline,
  camera, palette/material constants, mix where relevant). The other 47 were
  read at section level (essence, material, colour, type, motion, camera,
  sound, engine) plus code constants. No frame was decoded.
- **Not measured:** actual wpm, actual palette distance, actual shot durations
  from video, actual motion per shot. The numbers are the packs' declared
  values. The survey already warns that event counts are not comparable across
  packs because some count picture cues and others count sound.
- **Encoding:** several source files contain mojibake for CJK text in this
  environment. I did not rely on CJK strings, only on Latin identifiers, hex
  values, numbers and structure.
- **What is inference:** the taxonomy grouping, the tiering and the proposed
  schema are my synthesis. The individual values and code snippets are quoted
  from the packs. The proposal is not an existing Lemo format and does not
  claim to be one.

---

*End of D-lemo.md.*
