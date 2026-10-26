# Watercolor source autopsy

**Status:** read-only source study for S1b.
**Source:** Lemo-Opuscar style `watercolor` (“Watercolor Brush”).
**Read on:** 2026-10-26.
**Pack:** `styles/watercolor/` (Paper Studio).
**Rule:** no Lemo code, image, audio, still, subtitle or vendor data is vendored. Short quotations are locators, not excerpts.

This autopsy does three things. It records what the source actually says, separates the reusable style grammar from the one demo film, and expands every one of the 27 decisions in spec 0004 with either a source line or an author decision and its reason.

The pack column is the decision in spec 0004, not the demo’s implementation. Where the pack adds a number the source does not state — margins, word cap, seven assets, 48 BPM — that number is a **pack parameter** chosen inside a source principle. It is not a demo fact.

---

## 1. Source identity

| Field | Value |
|---|---|
| Upstream repository | `https://github.com/lemomo-ai/lemo-opuscar` |
| Style path upstream | `https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/watercolor` |
| Archive name | `lemo-opuscar-main.zip` |
| Archive path | `C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main.zip` |
| Archive size | 89,502,699 bytes |
| Archive SHA-256 | `E7B4FB2F05327A5F7E1697AE31E1CE91637CA58E67A7B08CAFF749AC0F10E2AC` |
| Extracted root | `C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\` |
| Local style path | `C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles\watercolor\` |
| Read on | 2026-10-26 |
| Source file timestamp | 2026-10-24 02:36:30 (local) |
| MIT notice | repo-root `LICENSE`, 1,064 bytes |

The archive contains no `.git` directory. No commit SHA can be asserted from the snapshot. The file hashes below are the identity of what was read.

### 1.1 Exact file hashes

| File | Bytes | SHA-256 |
|---|---:|---|
| `STYLE.md` | 11,099 | `662D57568408A7C82EF8F64980CA85798B8BB239DF3DC3A6715283D7F4555EF0` |
| `DEMO.md` | 23,549 | `DF9AC7B2FE814F1E70F8EEFA1641D7B55480D5CC158E7CD300A52D32F203B7A6` |
| `style.json` | 506 | `FE64241069DE6AAF0173DE56B6FF038AE03EB131EF96C799512A5EFEA7821B47` |
| `LICENSE` (repo root) | 1,064 | `14C9FF6F14BFB2391E74FEDB01C256891D2A3BBA1C2ACF5789901BDF77E54E33` |
| `demo/CREDITS` | 2,421 | `F6853A6BE52E259299D58E0D99F4C3F2AADB574AD7AED6ECB634383B3323504A` |

**Path note.** Spec 0004 records `LICENSE` at the archive root. The snapshot has one MIT `LICENSE` at the repo root and no style-local copy. The hash above is the root notice; `LICENSE-MIT.txt` copies it.

`STYLE.md` is the prose bible: 11 sections, no tokens, no recipes, no validator. `DEMO.md` is the record of one film, explicitly not reusable. `style.json` is gallery metadata: slug `watercolor`, number `02`, English title “Watercolor Brush”, film “Follow the Rain”, duration `113.6`, frame reference `68.16`. It is not a style contract.

### 1.2 What the source is

Lemo-Opuscar is a library of 59 film styles. Each style is a prose bible plus a bespoke demo film, not a parameterised pack. `watercolor` is a 2D Canvas2D film called *Follow the Rain*: 113.6 s, 1920×1080, 60 fps, one continuous painted walk across an Australian rainfall gradient, then a pull-out to a painted map.

The source’s own warning is the reason this autopsy exists: the demo is “one example among many” and its story, arc, shots, props and timings must not be reused. The style grammar is the reusable part; the film is evidence that the grammar can carry a film.

### 1.3 What the source is not

- It is not machine-checkable. There are no tokens, no recipe files, no closed vocabularies, no validator, no conformance frames and no versioned pack.
- It is not deterministic as a library. The demo has a fixed paper seed, a global RNG and a per-render seeding convention; determinism is an implementation discipline, not a contract.
- It is not a palette system. It has a paper colour, two inks, two accents, five zone palettes and per-species colour sets. The six-role palette is the pack’s invention.
- It is not a general plant library. `plants.js` is a set of demo generators for Australian species; the pack does not copy it.

---

## 2. How to read the 27 rows

- **Source** means the decision has a locator in `STYLE.md`, `DEMO.md`, `LICENSE` or `demo/CREDITS`, followed by a quotation fragment under 12 words.
- **Author decision** means no Lemo line states the decision. The row gives a one-line reason.
- **Pack parameter** means a number chosen by Paper Studio inside a source principle. It is not presented as a source fact.
- **N/A** is used only for D11 rigs. The source paints creatures from strokes, so there is no skeleton to convert.

Five rows have no Lemo source line: **D03, D12, D19, D25, D27**. D27 is the S1a authoring contract, not a Lemo feature. D11 is a source-derived N/A. Every other row has a source locator.

**Section key:** §1 Essence, and what it is not · §2 Materials & rendering · §3 Colour logic · §4 Type & subtitles · §5 Motion quality · §6 Camera grammar · §7 Sound palette · §8 Native moves · §9 Pitfalls of the medium · §10 Engine · §11 Variation space.

---

## 3. The 27 decisions

| ID | Decision | What the pack will do | Basis | Source line or author reason |
|---|---|---|---|---|
| D01 | Brush | One loaded round brush and one rigger. The source’s five width profiles become stroke roles, not five tools. Bristles only on strokes wider than about 6 px; thin stems get one clean stroke. No pencil, no vector outline. | Source | `STYLE.md §1–2` — “individual brush strokes ... no vector outlines”. |
| D02 | Material and surface | Warm, fibrous cotton paper under every frame; visible fibre. Paper is the white and the eraser; pure white is never painted. “Cotton” is the pack’s named stock; the source says warm fibrous paper. | Source | `STYLE.md §2` — “warm base ... short curved fibres”. |
| D03 | Light and shadow | Ambient top-left daylight, softness 0.95, opacity 0.08; a soft paper vignette only. No cast shadow, no gloss, no second light. | Author decision | The source gives paper-white ambient light and a 5 % vignette, but no direction, softness or opacity. The pack fixes all three so the light is repeatable. |
| D04 | Colour system | Two palettes, six roles, default `garden-day`. At most five distinct pigments in a frame: paper, ink, one wash, one second hue, one accent. `deep` is the wash at 2–3 passes, not a sixth tube colour. The source allows 3–5 hues plus ink; the pack tightens to five total. | Source | `STYLE.md §3` — “Keep 3–5 hues per scene plus ink”. |
| D05 | Texture and finish | 0.22 paper grain plus pigment granulation. Grain is paper fibre, not a video overlay; granulation sits in the wash, not on top. Granulation is a pack addition; the source paper has fine grain. | Source | `STYLE.md §2` — “fine grain, light vignette”. |
| D06 | Compositing order | paper → far wash (parallax 0.25) → mid wash (0.55) → main form (1.0) → foreground (1.55) → annotation → grain. Paper-coloured mist bands sit between the washes. No cast-shadow layer. | Source | `STYLE.md §2` — “parallax layers ... mist bands between layers”. |
| D07 | Shape and geometry | Seven layout shapes: paper, wash, blob, stroke, rule, seal, label. A seal is a stamped accent, not a logo. A rule is a measured line, not a border. The seven-shape vocabulary is the pack’s; the source uses paper, wash, stroke, stamp and label. | Source | `STYLE.md §1` — “individual brush strokes”; `DEMO.md` — “stamped like a seal”. |
| D08 | Composition and safe zones | Margins 8–11 %; one hero subject and one note per view; a 16-word cap per content slot; subject and caption safe zones. Labels never cover the subject. The margins and word cap are pack parameters. | Source | `STYLE.md §6` — “generous paper margins ... labels never cover the subject”. |
| D09 | Typography and lettering | Cormorant Garamond Italic (display), Cormorant Garamond regular (body), Caveat (hand notes), IBM Plex Mono (measured labels); Cormorant regular also the monogram. Closed role map. No fourth family. Italic is a style, not a family. 14 px minimum at 390 px width; Latin only. | Source | `STYLE.md §4` — “An elegant serif ... a handwriting face ... a small mono”. |
| D10 | Camera and depth | Allowed moves: static, pan, tilt, push_in, pull_back, parallax; default pan. The native move is a long lateral pan across one continuous painted world. A vertical tilt measures one object; a push-in leans into a detail; a pull-back re-frames the sheet. The source’s “change in time on a locked view” is not a camera move in the S1a vocabulary; if used, it is a content state change on a static shot. | Source | `STYLE.md §6` — “Long lateral dolly over a continuous world”. |
| D11 | Rig and character construction | N/A. No cast, no skeleton, no rigged character. Creatures and people are painted props made of strokes; they can sway or hop as a whole, but they are not rigged. | Source (N/A) | `STYLE.md §1` — “Everything is individual brush strokes”. |
| D12 | Timing and beat grid | 48 BPM, bar 4, offset 0. A breath grid, not a music cut. The pack does not inherit the demo’s 103.4 BPM score or its beat constants. | Author decision | The only beat grid in the source belongs to the licensed demo score; a style cannot depend on a film’s music edit. 48 BPM is the pack’s calm breath. |
| D13 | Motion and physics | Easings: easeOut, easeInOut, linear. Physics: ease or none. Sway about 0.006 for trees, 0.01–0.03 for grass; no jitter. Painting-in is the main motion; finish, then sway. No bounce, no overshoot, no camera shake. | Source | `STYLE.md §5` — “0.006 for trees, 0.01–0.03 for grass”. |
| D14 | Edit and transitions | Allowed: wipe (brush edge), page_turn (new sheet), hold (close). Minimum shot 4 s. No cut, no dissolve. Mist is a recipe/effect that erases to paper, not a transition kind; a mist shot ends on a hold or a wipe. | Source | `STYLE.md §6` — “brush-edge wipes, mist, a page turn ... no hard video cuts”. |
| D15 | Sound and silence | Acoustic and gentle: felt piano, fingerpicked guitar, light strings, glockenspiel or kalimba; no drums. Foley from the scene’s matter: paper brush rustle per paint-in, pencil scratch for notes, soft page turn, quiet stamp thump. Silence is a colour. Voice optional, warm and unhurried, one line per idea. Mix character only: voice forward, music ducked about 4 dB, short soft reverb. No delivery loudness, no audio files. | Source | `STYLE.md §7` — “felt piano, fingerpicked guitar ... glockenspiel, kalimba”. |
| D16 | Signature | A specimen painted in stroke by stroke, a Caveat note on a paper halo with a leader line that grows to it, and a brush-edge wipe. Paper fibre and pooled wash edges are visible in the same frame. The signature is a shot, a transition and a texture, not a logo. | Source | `STYLE.md §1` — “labels with pen leader lines”; `§5` — “brush-edge wipes”. |
| D17 | Refusals | At least five observable bans: vector shape with a watercolour texture on top; pure white paint; gloss or plastic sheen; hard cut; impasto or thick paint; calligraphic brush-as-gesture. Each is visible in a frame, not a mood. | Source | `STYLE.md §1` — “not impasto ... not vector illustration”; `§3` — “Never paint pure white”. |
| D18 | Not for | At least three registers: ink-wash, children’s picture book, photo-led wedding, non-Latin script. The first two are source refusals; photo-led and Latin-only are pack limits. A client photo can be reference for a painted portrait, never pasted in. A non-Latin commission needs a licensed companion face, not a fallback. | Source | `STYLE.md §1` — “not ink wash ... not a children’s picture book”. Photo-led and Latin-only are pack limits. |
| D19 | Capabilities and limits | Aspects 1:1, 16:9, 9:16; durations 30 s and 45 s; maxCast 0; maxWords 16. 60 s is deferred. The 9:16 wedding is not claimed; the blind run proves a 9:16 song/memory film. | Author decision | The source proves one 113.6 s, 16:9 film. The pack’s aspects and durations are product limits, not source facts; 60 s is not proven. |
| D20 | Assets and registry | One-sheet grammar plus seven starter assets, all used by the six recipes. They are painted forms and marks, not rigs. The exact seven are fixed in `capabilities.assets`; every one must appear in a recipe. No Lemo plant library is copied. | Source | `STYLE.md §2` — “Cache finished objects as sprites”. |
| D21 | Recipes and shot contracts | Six parameterised shot contracts for the six roles the formats use: title, walk, specimen, quote, mist, close. Each has slots, a camera move allowed by tokens, a duration inside `minShot`, a `transitionOut` in wipe/page_turn/hold, and observable failure modes. No demo content, no literal copy, no bespoke shot. The mist recipe has no text slot. | Source | `STYLE.md §6` — “A vocabulary, not a route”. |
| D22 | Runtime and seed | All eight primitives: layer, shape, path, text, image, camera, effect, transition. Seeded stroke, fibre and wash jitter. Fixed palette, type and layer order. A frame is a pure function of brief, style version, seed and time; no render-history dependence. | Source | `STYLE.md §2` — “pure function of t ... under a fixed seed”. |
| D23 | Cost class | Standard: many strokes per frame, but finished forms are sprite-cacheable. No 3D; no heavy simulation. The cost is brush-stroke count and cache misses, not polygons. | Source | `DEMO.md · Pitfalls` — “Thousands of strokes per frame are too slow”. |
| D24 | Reference media | Four evidence sources: the Lemo watercolor bible; naturalist field journals and botanical plates; long horizontal handscroll panoramas; watercolour technique manuals. Each is a category, not a reproduced work. The pack records what it takes and what it does not. | Source | `STYLE.md §1` — “Borrow the grammar, never a specific artwork”. |
| D25 | Conformance protocol | Declared conformance: title, specimen and close at 1:1, 16:9 and 9:16; six shots at 30 s for the blind run; eight shots at 45 s for the page; four shots at 45 s for the scroll. Metrics are named; no pixels are rendered in S1b. | Author decision | The source has no conformance protocol; it has one demo film. The pack declares a testable proof at the three formats it claims. |
| D26 | Identity and governance | Paper Studio; own text, tokens and recipes. Lemo-Opuscar watercolor credited as the source grammar. OFL fonts with notices. No demo media, no LemoLab end card, no *Follow the Rain* story or characters. Pack licence: proprietary internal pilot; third-party notices in `LICENSE-THIRD-PARTY.txt`. | Source | `LICENSE` — “MIT License ... Copyright (c) 2026 LemoLab”. The pack licence itself is a Paper Studio decision. |
| D27 | Bindings and brief | Frozen brief with a hash; template, contract and pack hashes in `capabilities.bindings`; `BRIEF.md` is a byte copy of the frozen brief; `## Questions` records the authoring log; variation space and decisions are explicit. A pack change after approval is visible in `packHash`. | Author decision | The source has no bindings, brief hash or questions log. This is the S1a authoring contract, not a Lemo feature. |

### 3.1 The author rows

Five rows have no Lemo source line:

1. **D03 — light.** The source has paper white and a vignette, not a directional light rig.
2. **D12 — timing.** The source’s beat grid belongs to the demo score, not to the style.
3. **D19 — limits.** The source proves one 16:9, 113.6 s film, not 30 s, 45 s, 1:1 or 9:16.
4. **D25 — proof.** The source has no conformance protocol.
5. **D27 — bindings.** The source has no brief hash, pack hash or authoring log; this is the S1a contract.

D11 is not an author invention. It is a source-derived N/A: the source paints every creature from strokes, so there is no skeleton or rig to convert.

---

## 4. Invariants vs demo content

### 4.1 Invariants — the style grammar

These must hold in every film the pack carries. They are the part the pack converts.

- **Paper is the white.** One sheet of warm, fibrous paper sits under every frame. The sheet is also the eraser. Pure white is never painted; light is unpainted paper.
- **Transparent layering.** Every form is individual brush strokes at partial opacity. Strokes overlap and darken where they cross. Darker means more passes, not a darker tube colour.
- **Flying white.** A wide stroke carries 3–9 thin bristle tracks that break into dashes and stop early. A thin stem gets one clean stroke, not noise. The gap is the paper showing through.
- **Painting-in.** Forms paint themselves in stroke by stroke, structure before detail. Progress follows screen position or a cue. A pan never reveals a finished painting. Finished forms are cached and only sway.
- **Annotation layer.** One hand-written note with a leader line, a short measured label, a quiet title. The note never covers the subject. It sits in the painter’s hand, not a UI font.
- **One accent.** A single recurring stamp or marker carries the accent colour. Everything else is paper, ink and washes. The accent is not a second decorative palette.
- **Camera grammar.** The picture is one painted sheet. A long lateral pan crosses one continuous world; a tilt measures one object; a push-in leans into a detail; a pull-back re-frames the sheet. Cutting is rare.
- **Mist.** Paper-coloured layers with a wavy rising edge wash the world back to paper. The mist is the erase, not a white fade. It is silent and carries no caption.
- **Sound palette.** Acoustic and gentle: felt piano, fingerpicked guitar, light strings, glockenspiel or kalimba; no drums. Foley is made from the scene’s matter. Silence is a colour. Voice is optional and unhurried.
- **Pitfalls are craft rules.** Extend washes beyond the frame; never end a wash at a canvas edge; seed every random mark; cache finished forms; do not lock the style to a music edit; do not silently fall back for a script the fonts do not cover.

### 4.2 Demo content — everything specific to *Follow the Rain*

This is evidence, not grammar. None of it is carried into the pack.

- **Story and title.** *Follow the Rain*; “Australia’s vegetation, from dry heart to green edge”; the naturalist field-journal frame; the five-zone walk; the 50 Ma → today rewind.
- **Place and geography.** Australia; the red centre; mulga country; eucalypt woodland; tall wet forest; rainforest; Uluru; the coastline; Tasmania; the painted continent; the “our walk” route.
- **Data.** The rainfall gradient 150–4,000 mm; the hand-typed station values; the five rainfall bands; the 26 fire spots; the “schematic” disclaimer; the ≈100 m tree measurement.
- **Species and props.** Spinifex (*Triodia*), desert oak, mulga, saltbush, wattle, tussock, gum (*Eucalyptus*), mountain ash (*Eucalyptus regnans*), tree fern, ground fern, rainforest tree, fan palm, vine, shrub, clouds, the vermilion sun seal, the fire front, the ash band, epicormic shoots, the rain drops, the gauge, the biome card, the legend.
- **Characters and animals.** Kangaroos, budgerigars, a koala, a cassowary, a tiny human for scale.
- **Film spec.** 113.6 s; 1920×1080; 60 fps; 6,816 frames; Canvas2D; four parallax layers; five zones of roughly 10–18 s each; no cuts.
- **Shot list and timings.** Title 0–10.9 s; walk 10.3–73 s; tall tree 54.2–60.9 s; mist 70.3–73.6 s; map 73.3–113.6 s; end card 101.6–113.4 s.
- **Voice.** Kokoro TTS, voice `af_heart`, speed 0.93, `en-us`; 13 lines of 1.7–7.4 s; English/Chinese bilingual subtitles; Noto Serif SC subset.
- **Music.** Scott Buckley — *Wildflowers*, CC BY 4.0; 322 s cut to 117.8 s; 103.4 BPM; one beat-aligned jump 61.23 → 265.61 s; `BEAT0 = 11.865`, `BEAT = 0.5805`; kangaroo hops on the beat.
- **Sound effects.** 46 budgie chirps, 14 raindrop plinks, fire roar and crackle, whipbird calls, mist swell, map-fire crackle; all synthesised in `mix.py`.
- **End card.** “LemoLab × Claude Opus 5.5”; music, voice, coastline and “rainfall bands are schematic” credits; the faded map under the title block.
- **Demo assets.** `poster.jpg`, `demo/stills/styleframe.jpg`, `watercolor.srt`, `demo/fonts.css`, `demo/fonts/`, `demo/aus.js`, `demo/vendor/`, `demo/music/`, `demo/voices/`, `demo/tts/`, `demo/paper.jpg`.

The demo’s own recipe — a gradient, 4–6 zones, a palette and a hero specimen per zone — is also demo-specific advice. The pack does not require a gradient, zones, specimens or animals. It requires the grammar above.

---

## 5. Exact extraction

Values below are extracted for interoperability and traceability. No source code is copied. Demo-specific numbers are marked as demo content and are not pack defaults.

### 5.1 Core palette

The source has one paper, two inks, two accents and a burnt silhouette. It has no named six-role palette; that is the pack’s contract.

| Source token | Hex | Source use | Source |
|---|---|---|---|
| paper | `#f1e9da` | the sheet, the white, the mist | `STYLE.md §2`; `DEMO.md · Palette & props` |
| ink | `#2b2520` | lines, text, trunk edges | `DEMO.md · Palette & props` |
| ink2 | `#3d3129` | branches, stems | `DEMO.md · Palette & props` |
| vermilion | `#cf4f2c` | the sun seal | `DEMO.md · Palette & props` |
| vermilion bar | `#b8401f` | 7 dry-brush bars on the sun | `DEMO.md · Palette & props` |
| rain blue | `#3f7fa8` | drops, gauge fill | `DEMO.md · Palette & props` |
| burnt | `#2a2320` | fire silhouettes | `DEMO.md · Palette & props` |

The pack translation is:

| Pack role | `garden-day` | `evening-blue` | Relation to the source |
|---|---|---|---|
| paper | `#f3ead9` | `#efe6d4` | Source paper `#f1e9da`, warmed and lightened by the pack. |
| ink | `#2f2a24` | `#262a2e` | Source ink `#2b2520`, adjusted by the pack. |
| wash | `#9fb7a4` | `#8fa3b0` | New dominant wash; not a source zone colour. |
| petal | `#d9a6a0` | `#c9a27e` | New second hue; not a source zone colour. |
| accent | `#c65438` | `#c65438` | Source vermilion, adjusted and used as the recurring marker in both palettes; the source rain blue is not carried. |
| deep | `#9fb7a4` | `#8fa3b0` | The wash at 2–3 passes, not a sixth tube colour; the hex repeats the wash. |

The only repeated pack hex is `deep`, which equals `wash`: it is the same pigment
at 2–3 passes, not a second tube colour. No pack hex is identical to a source zone
or palette hex. The pack's paper and ink are warmed/adjusted; the wash and petal
are new; the accent is the source vermilion adjusted to `#c65438`; the source rain
blue is not carried. This is a new palette written for Paper Studio, not a copy of
the demo's data ramp.

`STYLE.md §3` also gives three illustrative palettes (arid-to-wet, a harbour at dawn, a vegetable garden). They illustrate the colour logic; they are not the demo’s palette and are not carried. The garden example’s accent `#d9632e` is not the pack accent.

### 5.2 Zone palette — demo content, not carried

The demo blends five zone palettes by camera position. This is the clearest example of “colour as data”; it is also the most demo-specific thing in the source.

| Zone | Sky | Far hills | Mid ground | Main ground |
|---|---|---|---|---|
| desert | `#f0d6b8` | `#dcae8e` | `#dba47e` | `#dda27a` |
| mulga | `#efdcc6` | `#c89b8c` | `#d0ae80` | `#dbb584` |
| wood | `#ece2cd` | `#bdb99c` | `#cbc28f` | `#dccb92` |
| wet | `#dfe3dc` | `#9fb1b8` | `#98aa8a` | `#a7b48e` |
| rain | `#dbe3d8` | `#9ab19f` | `#6f8d6d` | `#6e8b69` |

Source: `DEMO.md · Zone palettes`; `scene.js` `ZCOL`.

The map’s rainfall ramp is six stops, quantised into five bands:

| Rainfall | Hex |
|---:|---|
| 150 mm | `#cf7c4f` |
| 300 mm | `#cda35f` |
| 650 mm | `#b3b07a` |
| 1,150 mm | `#7f9a6c` |
| 2,000 mm | `#46705a` |
| 4,000 mm | `#2f5a45` |

Source: `DEMO.md · Palette & props`; `main.js` `MSTOP`.

The pack carries the principle — colour may carry data, quantised into painted bands — but not the zones, the ramp or the geography. Spec 0004 sets the frame budget at 3–6 painted bands; the source says 4–6. The pack follows the spec.

The source’s per-species colour sets live in `plants.js` `COL` (straw, mulga, salt, gum, gold, ash, fern, rain, rainLite, palm, wattle). They are demo content and are not reproduced here or carried into the pack.

### 5.3 Type

Source sizes are at 1920×1080. The pack uses role-relative sizes and one hard floor: 14 px at 390 px width.

| Role | Family | Source size and weight | Pack role | Source |
|---|---|---|---|---|
| Title | Cormorant Garamond Italic | 500 124 px; end title 118 px | display | `DEMO.md · Titles & end card` |
| Biome title | Cormorant Garamond | 500 52 px | display | `DEMO.md · Titles & end card` |
| Subtitle | Cormorant Garamond Italic | 500 36 px; 2 lines maximum; 1400 px wrap | display | `STYLE.md §4`; `DEMO.md · Titles & end card` |
| Hand note | Caveat | 500/600, 26–42 px; 12 px paper halo; drawn twice | caption | `STYLE.md §4`; `DEMO.md · Titles & end card` |
| Measured label | IBM Plex Mono | 400, 14–17 px; 3 px tracking | label | `STYLE.md §4`; `DEMO.md · Titles & end card` |
| Map year | Cormorant Garamond | 500 150 px; italic 104 px for “today” | display | `DEMO.md · Titles & end card` |
| Chinese line | Noto Serif SC | 400 24 px; subset to used characters | not carried | `STYLE.md §4`; `DEMO.md · Titles & end card` |

The pack drops Noto Serif SC and declares Latin-only. It does not silently fall back. The 14 px floor and the 16-word cap are pack limits.

### 5.4 Motion

| Behaviour | Source value | Source |
|---|---|---|
| Paint-in progress | `clamp((reveal(t) − screenX) / (span × max(0.55, parallax)))` | `DEMO.md · Painting in` |
| Stroke share | Each stroke takes `clamp(4/N, 0.12, 0.5)` of the list’s progress | `DEMO.md · Painting in` |
| Reveal sweep | −300 → 1650 px over 10.2–13.4 s; afterwards about 380 px of travel per form | `DEMO.md · Painting in` |
| Sway | `sway × (sin(1.15t + φ) + 0.4 sin(2.7t + 2φ))`; 0.006 trees, 0.01–0.03 grass | `STYLE.md §5`; `DEMO.md · Painting in` |
| Wash | 3 passes; alpha `a/3 × 1.6`; jittered vertices | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Stroke body | `a × rib`; rib 0.62 with bristles, 0.92 without | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Bristles | 3–9 when width ≥ 6 px; opacity 0.30–0.85; dash runs 18–90 px; gaps up to about w/2; early end 0.72–1.0 | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Width roughness | ±22 % | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Easings | `ss`, `eio`, `eo`, `ei`; no jitter | `STYLE.md §5`; `DEMO.md · Painting in` |
| Demo beat lock | 103.4 BPM; `BEAT0 = 11.865 s`; `BEAT = 0.5805 s`; one kangaroo hop per 2 beats | `DEMO.md · Score structure`; `scene.js` |
| Pack timing | 48 BPM, bar 4, offset 0; no beat lock | Spec 0004 D12 |

The reveal sweep, the 10.2–13.4 s window and the 380 px travel are demo values. The pack uses screen position or a cue, not those timings. The two open paint-in speeds are 1.2 s and 1.8 s per specimen; that is the one director choice left open.

The source’s `ss` and `eio` are both ease-in-out; `eo` is ease-out; `ei` is ease-in. The pack uses only easeOut, easeInOut and linear, so the source’s ease-in is not a default.

### 5.5 Camera

| Source move | What it expresses | Pack equivalent | Carried? |
|---|---|---|---|
| Long lateral dolly over a continuous world | a gradient, a journey, cause and consequence | `pan` | Yes. |
| Vertical tilt along one object | scale, measurement | `tilt` | Yes. |
| Locked sheet, things painted in | study, attention | `static` | Yes. |
| Slow push into a detail | the observer leaning in | `push_in` | Yes. |
| Pull-back to a map or diagram | the whole re-framed | `pull_back` | Yes. |
| Mist wash to blank paper | chapter end, time passing | mist recipe, ending on `wipe` or `hold` | Yes, as a recipe. |
| Page turn / new sheet slides over | a new entry in the journal | `page_turn` | Yes. |
| Change in time on a locked view | growth, decay, history | none | No; not in `CAMERA_MOVES`. |
| Parallax layers | depth | `parallax` | Yes. |

Source: `STYLE.md §6`; `DEMO.md · Shots`.

The source says cutting is rare and bans hard video cuts and dissolves between unrelated pictures. The pack bans `cut` and `dissolve` entirely; `wipe`, `page_turn` and `hold` are allowed. That is a tightening, not a contradiction.

### 5.6 Sound

| Layer | Source | Pack |
|---|---|---|
| Music | Felt piano, fingerpicked guitar, woodwinds, light strings, glockenspiel, kalimba, soft pads. | Same acoustic family; no drum kit. |
| Foley | Paper brush rustle for each paint-in; pencil scratch for notes; soft stamp thump; page flips; nature beds and creatures of the subject. | Paper rustle, pencil scratch, page turn, stamp thump; nature only when the brief supplies it. |
| Silence | The brush lifted: music out, paper and room only. | Silence as a colour; no filler. |
| Voice | Warm, unhurried documentary read, one line per idea. | Optional; no audio files. |
| Mix | Voice forward; music ducked about 4 dB; short soft reverb; final −14 LUFS. | Character only; delivery loudness belongs to the format. No LUFS value in the style. |
| Demo specifics | Kokoro `af_heart`, speed 0.93, 13 lines; Scott Buckley *Wildflowers*; 103.4 BPM. | Not carried. |

Source: `STYLE.md §7`; `DEMO.md · Score structure`.

### 5.7 Layer order

The source draw order is:

| # | Layer | Parallax | Note |
|---:|---|---:|---|
| 1 | Paper image | — | Drawn first every frame; also the mist. |
| 2 | Sky gradient | — | Zone colour, blended by camera position. |
| 3 | Far wash strip | 0.25 | Hills; strip extends well beyond the frame. |
| 4 | Far plants | 0.25 | Smaller, lighter, less saturated. |
| 5 | Mist band 1 | — | Paper-coloured band between washes. |
| 6 | Mid wash strip | 0.55 | Midground ground. |
| 7 | Mid plants | 0.55 | |
| 8 | Mist band 2 | — | Paper-coloured band between washes. |
| 9 | Ground strip | 1.0 | Main ground. |
| 10 | Horizon | 1.0 | Ink strokes. |
| 11 | Ash band | 1.0 | Fire event. |
| 12 | Main plants | 1.0 | Hero forms. |
| 13 | Animals | 1.0 | Painted, not rigged. |
| 14 | Fire | 1.0 | Event. |
| 15 | Foreground plants | 1.55 | Larger, darker. |
| 16 | Rain | — | Weather. |
| 17 | Annotations | — | Hand notes, leader lines, measured labels. |
| 18 | Mist overlay | — | Paper-coloured erase, drawn after the landscape. |
| 19 | Map | — | The painted continent and its time change. |
| 20 | HUD | — | Biome card, gauge. |
| 21 | Title / end card | — | |
| 22 | Subtitles | — | Bilingual. |

Source: `DEMO.md · Layers`; `scene.js` `LAY`; `drawLandscape`.

Layer parameters:

| Layer | Parallax | Ground y | Scale | Alpha |
|---|---:|---:|---:|---:|
| far | 0.25 | 640 | 0.38 | 0.50 |
| mid | 0.55 | 690 | 0.62 | 0.78 |
| main | 1.00 | 745 | 1.00 | 1.00 |
| foreground | 1.55 | 1,115 | 1.75 | 0.95 |

Source: `DEMO.md · Layers`; `scene.js` `LAY`.

The pack keeps the order and the parallax ratios 0.25 / 0.55 / 1.0 / 1.55. It does not keep the demo’s pixel positions, ground heights or scales; those are format-relative. The pack adds a separate grain layer; the source’s grain lives in the paper image. The map, HUD, subtitles and end card are demo layers and are not in the pack.

### 5.8 Stroke rules

| Rule | Value | Source |
|---|---|---|
| Stroke is a variable-width ribbon at partial opacity | Default alpha 0.92 | `STYLE.md §1–2`; `DEMO.md · Engine reference` |
| Width profiles | `brush`, `leaf`, `even`, `tip`, `trunk` | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Bristles | 3–9 only when width ≥ 6 px; otherwise 0 | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Bristle opacity | 0.30–0.85 | `STYLE.md §2` |
| Dash pattern | Runs 18–90 px; gaps up to about w/2; early end 0.72–1.0 | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Body opacity with bristles | 0.62 factor, about 0.57 total at alpha 0.92 | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Width roughness | ±22 % | `STYLE.md §2` |
| Wash | 3 passes; alpha `a/3 × 1.6`; jittered vertices | `STYLE.md §2`; `DEMO.md · Palette & props` |
| Pooled edge | Darker where passes disagree | `STYLE.md §2` |
| Edge line | A darker stroke along one side; no vector outline | `STYLE.md §1–2`; `DEMO.md · Story & structure` |
| Paint-in order | Structure before detail; each stroke gets a slice of progress | `STYLE.md §1, §5` |
| Sway | Only after a form is finished | `STYLE.md §5` |
| Sprite cache | Finished forms cached; only painting or burning forms drawn stroke by stroke | `STYLE.md §2`; `DEMO.md · Pitfalls` |

The source’s five profiles are shape variants inside one stroke engine. The pack exposes one round brush and one rigger, and maps stroke roles to them. That is a simplification of the tool surface, not a copy of the engine.

---

## 6. Pitfalls the pack must avoid

The source’s pitfalls are engine-specific. The pack rewrites them as craft rules that hold in any runtime.

| Source symptom | Pack rule |
|---|---|
| **Strip seams.** Offscreen wash strips too short flatten tall shapes into flat tops and expose seams on tilts. | Every offscreen wash extends beyond the frame on all sides. Strip height is derived from the camera travel and the tallest form, not from a fixed canvas. Test the tallest tilt at the widest framing. |
| **Translucent wash edges.** A wash that ends at its canvas edge shows a hard seam under another layer. | No wash terminates at a layer or canvas edge. Extend it below the frame and fade to paper before the edge. Check the composite at partial opacity, where seams show first. |
| **Global scope and RNG determinism.** Classic scripts share one global scope; a `const` touched before its declaration can leave `READY` false. The stroke builder consumes the global RNG, so strokes made inside a frame must be seeded. | No global mutable state. Every random value derives from the pack seed plus a stable identifier (shot id, layer id, stroke index). A frame is a pure function of brief, style version, seed and time. No render-history dependence. Test A/B, repeat and parallel renders. |
| **Sprite cache.** Thousands of strokes per frame are too slow; finished plants are cached. | Cache finished forms keyed by seed, geometry and palette. Only forms with progress < 1 are drawn stroke by stroke. Invalidate the cache on style version or seed change. Test cache-hit and cache-miss frames for equality. |
| **Beat-locked animation.** Animation phased to the demo score must be re-derived when the music edit changes. | The style has no beat lock. 48 BPM is a breath grid, not a music cut. A film may lock to its own cleared music; that is a format/film decision, never a pack constant. |
| **CJK subset.** New Chinese characters render in a fallback until the subset is rebuilt. | Latin only, declared. No silent fallback. A non-Latin commission needs a licensed companion face. Check every content slot against the Latin repertoire. |

---

## 7. What we did not take

| Lemo path or asset | What it is | Status |
|---|---|---|
| `styles/watercolor/STYLE.md` | The 11-section prose bible. | Read; short quotations only. Not copied. |
| `styles/watercolor/DEMO.md` | The demo record, engine table and pitfall log. | Read; short quotations and extracted values. Not copied. |
| `styles/watercolor/style.json` | Gallery metadata. | Read; hashes recorded. Not copied. |
| `LICENSE` (repo root) | MIT notice, Copyright (c) 2026 LemoLab. | Copied as `sources/lemo/LICENSE-MIT.txt`, as the licence requires. |
| `demo/engine.js` | RNG, easing, noise, stroke engine, sprite cache. | Read for values. Not copied. |
| `demo/plants.js` | Australian plant and prop generators. | Read for values. Not copied. |
| `demo/scene.js` | Timeline, zones, layers, camera, world build, animals, notes. | Read for values. Not copied. |
| `demo/main.js` | Canvas, map, mist, HUD, subtitles, title and end card. | Read for values. Not copied. |
| `demo/paper.py` | Paper generator. | Read for values. Not copied. |
| `demo/index.html`, `demo/render.mjs`, `demo/mix.py`, `demo/asr.py`, `demo/sheet.py` | Demo build, render, mix and transcribe scripts. | Not copied. |
| `demo/fetch_fonts.mjs`, `demo/fonts.css`, `demo/fonts/` | Demo font downloader and font subset. | Not copied. Pack fonts come from `google/fonts`. |
| `demo/extract_aus.mjs`, `demo/aus.js` | Coastline extraction and data. | Not copied. |
| `demo/mux.sh` | Demo mux script. | Not copied. |
| `demo/CREDITS` | Asset sources and licences. | Read; facts used in `THIRD_PARTY.md`. Not copied. |
| `demo/**` | The whole demo source tree. | Not copied. |
| `poster.jpg` | Demo poster. | Not copied. |
| `demo/stills/**` (including `styleframe.jpg`) | Demo stills. | Not copied. |
| `watercolor.srt` | Burned-in subtitle file. | Not copied. |
| `demo/music/**` | Music prep, beat analysis, edit scripts, beat JSON, any audio. | Not copied. |
| `demo/voices/**` | Voice durations and any voice audio. | Not copied. |
| `demo/vendor/**` | Natural Earth countries, topojson client and licence texts. | Not copied. |
| `demo/tts/**` | Kokoro generation script and voice lines. | Not copied. |
| `watercolor.mp4` | The demo film, referenced by `DEMO.md` but not present in the archive. | Not copied. |
| The LemoLab end card | The “LemoLab × Claude Opus 5.5” sign-off and credits block. | Not copied. |
| The *Follow the Rain* story, shot list, timings, characters, species, map, rainfall data, voice script, music edit and sound effects. | Demo content. | Not copied. |

No Lemo code, image, audio, still, subtitle or vendor data is vendored in this repository. The only Lemo text in the repo is the MIT licence and the short quotations in this autopsy and `THIRD_PARTY.md`. The pack’s fonts are downloaded from `google/fonts`, not from `demo/fonts/`. The pack’s palette and type roles are re-derived; the one exact hex overlap is noted in §5.1.

---

## 8. What the pack must prove

This is the S1b gate in one list. It is written so a non-programmer can check the result.

1. **The contract passes.** `npm run style:check -- styles/watercolor` returns REVIEWABLE, 0 hard failures, and exactly one open director choice: paint-in speed, 1.2 s or 1.8 s per specimen.
2. **Reuse is real.** Two briefs and two formats resolve 9/9: `watercolor-page` at 1:1, 45 s, 8 shots; `watercolor-scroll` at 16:9, 45 s, 4 shots. The page is a locked journal; the scroll is one continuous walk.
3. **The blind run is sealed.** A 30 s, 9:16, six-shot song/memory film resolves 9/9. The pack hash is recorded before and unchanged after. The input and used-input manifests are byte-identical.
4. **The card is evidence, not decoration.** It shows the six observable tests: paper is the white, flying white, pooled edge, painting-in, annotation leader, no vector outline. It also shows the six-frame recipe strip and the parameter block.
5. **The human brief is complete.** `STYLE.md` has the 11 headings in order, plus Signature, at least five Refusals and at least three Not-for registers.
6. **The rights are clean.** The MIT notice is present, the OFL fonts and notices are present, no Lemo media is in the pack, and no new npm dependency was added.
7. **The conversion is traceable.** This file has D01–D27 rows; `THIRD_PARTY.md` and `LICENSE-MIT.txt` exist; every source hash matches.
8. **The old packs still work.** `keepsake` is still REVIEWABLE with 0 hard failures; `_template` is still DRAFT and exits 0.

---

## 9. Deliberate differences from the source

These are not accidents. In every case the pack follows spec 0004, not the demo.

| Source value | Pack value | Why |
|---|---|---|
| Paper `#f1e9da` | `#f3ead9` | The pack warms and lightens the sheet for the Paper Studio palette. |
| Ink `#2b2520` | `#2f2a24` | The pack adjusts the ink for the same palette. |
| Vermilion `#cf4f2c` | `#c65438` | The pack uses a less orange brick accent. |
| Rain blue `#3f7fa8` | Not carried | The pack uses the source vermilion for both accent roles; the rain blue is not carried. |
| 3–5 hues plus ink | At most 5 pigments total | Spec 0004 tightens the frame budget; paper and ink count. |
| 4–6 painted bands | 3–6 painted bands | Spec 0004 widens the band range; the pack still quantises, never a continuous ramp. |
| 113.6 s, 16:9 | 30 s and 45 s; 1:1, 16:9, 9:16 | The source proves one film; the pack proves formats. |
| 103.4 BPM demo score | 48 BPM breath grid | A style must not depend on a licensed music edit. |
| −14 LUFS | No delivery loudness | Loudness belongs to the format, not the style. |
| Chinese subtitles | Latin only | The OFL trio is Latin; no silent fallback. |
| 1.6 px leader line | 1.5 px leader line | The card parameter block in spec 0004 specifies 1.5 px. |
| 8 camera moves, including time-change | 6 closed moves | `CAMERA_MOVES` has no time-change move; a time change is content, not camera. |
| 5 zone palettes | 2 named palettes | The pack must serve two unrelated briefs without demo geography. |
| No cut, no dissolve between unrelated pictures | No cut, no dissolve at all | The pack’s transition set is deliberately narrower. |

The 1.6 px to 1.5 px change is the smallest. The source’s leader is 1.6 px; the card’s parameter block says 1.5 px. The pack follows the card. If the difference matters visually, change the card and the tokens together, not one alone.

---

## 10. A note on the source’s own licence

The repo-root `LICENSE` is the MIT text with `Copyright (c) 2026 LemoLab`. The README’s licence section says code and docs are MIT and demo films and their stills are CC BY 4.0. The demo’s `CREDITS` lists the music, voice, map data and fonts separately. `THIRD_PARTY.md` records all of that, and `LICENSE-MIT.txt` carries the full MIT notice.

The pack does not copy Lemo software. It converts a prose style grammar and records the source. The MIT notice is included anyway because the source docs are MIT and because the pack may travel alone. The pack’s own licence is proprietary; the third-party notices travel with it.
