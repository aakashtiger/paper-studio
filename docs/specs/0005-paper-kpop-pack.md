# Spec 0005 — S1c Paper K-pop pack

**Status:** v4 frozen — S1c gate green, 9/9 plus geometry
**Follows:** 0003 (S1a style system), 0004 (S1b watercolor pilot)
**Owner:** both
**Final pack:** `styles/paper-kpop` 0.1.0, `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`

## Goal

Convert the completed CLAUDE POP film into a reusable **Paper K-pop style pack**, using the same six-artifact contract as watercolor.

**No renderer. No MP4.** The six film frames are reference evidence; the pack is the recipe. The video is S2.

## What changed in v4

- **Geometry re-audit.** 6 critical and 8 high box findings fixed in one batch; `gate/paper-kpop-blind/AUDIT.md` holds the findings and coordinates.
- **Paired 9:16 anchors.** `openCore`, `lyricText`, `stickerBed`, `stickerText`, `stickerRule`, `stickerBurst`, `stageBurst`, `chaseArrow`, `closeStrip` and `closeBody` are explicit. A box-only renderer cannot collapse a bed, sticker, copy and rule.
- **Text fit.** Six 16:9 lower-thirds were below the 14 px floor at 390 px; they now measure 14.5–18 px. No text enters the bottom 12% except the portrait lyric band.
- **Card mobile.** Below 640 px the board is full-bleed and the motion section drops its side padding; the phone illustration is 390 px on a mobile viewport instead of 327 px.
- **Gate.** The gate is now **9 tests** (the geometry test added); the full suite is **101 tests**.
- **Blind.** The live run is a disclosed plan-valid carry-forward from `719e0582…`, not a pristine seal; the final plan re-resolves 9/9 on `6c5765be…`.

## What changed in v3

- 8 recipes, one per beat role; the song and Shorts formats repeat roles, so all 8 are used.
- Song 14 shots / 45 s / 16:9. Shorts 8 shots / 30 s / 9:16. Blind 6 shots / 30 s / 9:16.
- Duration range 1.2–5.5 s; the 1.2 s floor is reachable through `macro_prop_beat` and `side_scroll_chase`.
- Authored SPECIMEN + ANTI + 3 cropped lyric-free reference stills; recognition specimens; visible paper-shadow comparison.
- 9:16 is a re-staged format with its own anchors and contain rules, not a crop.
- The `paper-shadow` choice is neutral in the recipes; the type shadow is fixed.
- `APPLICATION.md` is inside the pack so a fresh operator can use the format/brief shapes without the gate folder.
- Fonts: three OFL families and Permanent Marker under Apache 2.0, both notices bundled.
- The v3 gate was 8 tests; the full suite was 100 tests.

## Inputs (read-only)

`Y:\NewVideoTest\src\core.js`, `type.js`, `characters.js`, `scene_kit.js`, `props.js`, `timeline.js`; `Y:\NewVideoTest\STORYBOARD.md`; `Y:\NewVideoTest\out\frames`; `Y:\NewVideoTest\assets\fonts`.

The film's song, lyrics, story, names and 54 shots are **evidence and content**, not style. The pack uses slots and grammar names only.

## Deliverables

```
styles/paper-kpop/
  BRIEF.md                 a 12-answer style brief, not the film
  STYLE.md                 11-section human brief + Signature/Refusals/Not for/Questions
  tokens.json              medium (incl. HUD), colour, type (incl. treatment), layout, motion, sound, seed
  capabilities.json        limits, assets, rigs, runtime, evidence, proof, bindings, governance
  APPLICATION.md           brief/format shapes and resolve handoff
  recipes/*.json           8 grammar recipes
  card.html                SPECIMEN + ANTI + 3 references + recognition + open choice
  fonts/                   Anton, Archivo Black, DM Mono Regular/Medium, Permanent Marker, OFL + Apache notices
  references/frames/       6 cropped, lyric-free film frames
  SOURCES.md               frame provenance, film rights, no audio
  LICENSE-THIRD-PARTY.txt  OFL and Apache notices; film frames owned by the author
sources/paper-kpop/autopsy.md   D01-D27, palette, type, rigs, assets, recipes, frame crops
formats/paper-kpop-song/format.json     16:9, 45 s, 14 shots, palette field
formats/paper-kpop-shorts/format.json   9:16, 30 s, 8 shots, palette field
fixtures/resolve/paper-kpop-a.json      first brief
fixtures/resolve/paper-kpop-b.json      second brief
gate/paper-kpop-blind/                  sealed 6-shot/30 s/9:16 run, report, hash
test/paper-kpop-gate.test.ts            executable gate + self-containment
docs/decisions/0008-paper-kpop-pilot.md
```

## The 8 recipes (one per beat role)

| Recipe | Role | Slots | Assets | Camera | Out |
|---|---|---|---|---|---|
| `paper_open` | open | title, subtitle | set.paper-card, texture.paper-fibre | push_in | iris |
| `type_stack` | title | title, body | set.paper-card, texture.halftone | static | match_cut |
| `portrait_iris` | portrait | names, caption | set.paper-card, character.lead, frame.paper-window, hud.lyric-band | push_in | iris |
| `macro_prop_beat` | detail | caption | set.paper-card, prop.object, set.tabletop, texture.halftone | push_in | cut |
| `stage_wide` | list | body, caption | set.paper-card, set.stage, character.lead, character.second, hud.meter, texture.halftone | orbit | cut |
| `sticker_slam` | quote | body | set.paper-card, prop.paper-sticker, texture.halftone | static | cut |
| `side_scroll_chase` | transition | caption | set.paper-card, set.corridor, texture.halftone | pan | wipe |
| `pullback_close` | close | monogram, body | set.paper-card, set.diorama, prop.object, texture.paper-fibre, hud.corner-marks | pull_back | hold |

Every recipe has a duration range inside 1.2–5.5 s, at least four failure modes, and only closed ops/slots. The formats repeat roles; every recipe appears in the song or Shorts plan.

## Formats

- **Song:** 16:9, 45 s, 14 shots: open, title, portrait, detail, list, quote, portrait, detail, list, quote, transition, title, detail, close.
- **Shorts:** 9:16, 30 s, 8 shots: open, title, portrait, detail, list, quote, transition, close.
- **Blind:** 9:16, 30 s, 6 shots: open, title, portrait, list, quote, close.
- 9:16 is a **re-stage**: background plates may bleed; characters, props and dioramas are contain-staged; type and HUD re-anchor. 1:1 is not claimed.

## Card

Eleven sections, visual-first: `hero`, `legend`, `visuals`, `palette`, `type`, `motion`, `sound`, `rules`, `fit`, `proof`, `signoff`.

- Hero: an authored SPECIMEN from pack parameters, labelled `SPECIMEN - pack layout, not a render`.
- Reference strip: 3 film stills, cropped to remove the lyric band and film title, labelled with timecodes.
- Recognition: type edge, torn edge and halftone specimens.
- ANTI: an authored glossy 3D/gold wedding panel.
- Palette, type, motion, sound, rules, fit, proof, signoff.
- Open choice: `paper-shadow` Collage vs Print on the same composition; both keep the cut edge and the fixed type shadow.
- Body copy <=150 words. No OUTPUT label and no MP4.

The six film frames are evidence only, in `references/frames`; they are never labelled OUTPUT.

## The one open choice

`paper-shadow`:

> Does the paper cast a shadow? **Collage** — every paper layer has a soft contact shadow and a visible cut edge. **Print** — layers are flat with the same visible cut edge; only the type gets a hard, misregistered offset shadow.

The card shows both at 390 px. No answer is pre-filled.

## The 27 decisions

The autopsy expands D01–D27 with a source line or an author decision + reason. Key values:

- **D01 medium:** flat cut-paper, torn edges, no soft brush.
- **D02 material:** warm cream paper, ink, halftone print, fibre.
- **D03 light:** top-left; paper contact shadow is the open choice; hard type shadow fixed.
- **D04 colour:** six roles `paper, ink, red, blue, acid, accent`; palettes `day-stage`, `night-stage`; max 4 per frame.
- **D05 texture:** paper fibre 0.18, halftone, grain 12 Hz at 30 fps.
- **D06 layers:** paper, background, midground, character, foreground, halftone, HUD, type, fibre, grain, vignette.
- **D09 type:** Anton display and quote sticker, Archivo Black body/lower-third, DM Mono caption/label, Permanent Marker monogram; per-char jitter, cream edge, ink shadow, 12-step boil at 30 fps.
- **D10 camera:** static, push_in, pull_back, pan, tilt, orbit; no handheld.
- **D12 timing:** 88 BPM, offset 0.21, bar 4; frame-exact beats are S2.
- **D13 motion:** easeOut/easeInOut/backOut/easeIn/linear; squash, overshoot, anticipation.
- **D14 edit:** cut, iris, wipe, match_cut, hold; minShot 1.2.
- **D15 sound:** electronic pop, synth bass, brass, vocal chops; paper SFX; optional voice. No audio files.
- **D19 limits:** 16:9 + 9:16, 30/45 s, maxCast 2, maxWords 8.
- **D23 cost class:** heavy.
- **D25 proof:** declared; all 8 recipe ids; 16:9 + 9:16; metrics.
- **D27 blind:** byte-sealed final inputs, pack hash `6c5765be…`, 6/30/9:16. The live run is a disclosed plan-valid carry-forward from `719e0582…`; a fresh blind on the final hash is the strict proof and is not claimed.

## Gate

```powershell
npm run typecheck
npm test
npm run style:check -- styles/paper-kpop
```

- Pack REVIEWABLE, 0 hard, exactly one open choice (`paper-shadow`).
- Song with two briefs: 14 shots / 45 s / 16:9, 9/9.
- Shorts with two briefs: 8 shots / 30 s / 9:16, 9/9.
- Blind: 6 shots / 30 s / 9:16, 9/9, final pack hash `6c5765be…`; inputs and used-inputs match; 32 manifest files.
- Geometry: every content slot holds a 14 px line at 390 px in both aspects; no text/text overlap, no rule crossing, no bottom-margin leak outside the lyric band; paired anchors and contact checks pass.
- All 8 recipes appear across the song and Shorts plans.
- Self-containment test: no `http(s)`, `../`, drive paths, `watercolor`, `keepsake`, `src/`, `assets/`, `out/frames`; local fonts/frames; card references inside pack.
- Banned-token test: no film title, character names, `P(DOOM)` or lyric lines in the pack or blind work.
- No signoff. `resolve.txt` is UTF-8 without BOM. Three post-build critics **9/10 GO**.
- Full suite **101/101**. No MP4.

## Non-goals

Renderer, new frames, MP4, audio, 3D, 1:1, 60 s, other Lemo styles, changing `styles/_template`, S1a schema, watercolor or keepsake.

## Build waves

0. Pre-build review — complete.
1. Autopsy D01–D27, palette, type treatment, rigs, assets, 8 recipes, frame crops — complete.
2. Pack core: STYLE, tokens, capabilities, fonts — complete.
3. 8 recipes, 2 formats, 2 briefs — complete.
4. Card + sources/licences + APPLICATION — complete.
5. Check/resolve loop to REVIEWABLE + 9/9 — complete.
6. Blind 6/30/9:16; gate test; three critics; docs; CI — complete.
7. Geometry re-audit, one-batch fix, 9-test gate, 101-test suite — complete.

## Definition of done

- REVIEWABLE, one open choice.
- Song 14/45/16:9, Shorts 8/30/9:16, blind 6/30/9:16; 9/9 each.
- Geometry 9/9: 14 px floor, no text overlap, no rule crossing, margins, paired anchors, contact.
- All 8 recipes used; no cross-style dependency; pack self-contained.
- CI green; critics 9/10 GO; no video.
