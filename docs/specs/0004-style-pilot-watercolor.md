# Spec 0004 — S1b pilot: convert Lemo `watercolor`

**Status:** v6 — built 2026-10-26; pack REVIEWABLE; all three post-build critics 9/10 GO
**Owner:** both
**Follows:** 0003 — Style Definition System (S1a, accepted 9/10 GO)
**Re-scopes:** S1b. The Paper K-pop pack and the `paper-vows` migration move to S1c.

## Goal

Convert **one** Lemo-Opuscar style — `watercolor` — into a Paper Studio style pack, with **no renderer and no video**, and prove five things:

1. The pack passes the S1a contract: `style:check` → **REVIEWABLE**, 0 hard failures, exactly one open director choice.
2. The pack is reusable across **two briefs and two formats**: a 1:1, 45 s, eight-shot journal page and a 16:9, 45 s, four-shot handscroll. `style:resolve` passes **9/9** for all four brief/format pairs.
3. A **prompt-isolated, byte-sealed blind author** can apply the pack to a different film — a 30 s, 9:16, six-shot piece — without editing the live pack. The pack hash is recorded before and checked after; the seal proves bytes, not that the author never opened the repo.
4. The conversion is **traceable**: a D01–D27 table points to a source line or records an author decision with a reason.
5. The conversion is **rights-clean**: Lemo's MIT notice is included, the demo is CC BY 4.0 and explicitly not reproduced, fonts are OFL with notices, and no Lemo code or media is vendored.

This is a measurement, not a library. The output is one pack and one honest cost report.

## Why `watercolor`

- 2D, romantic, universal; fits the first verticals (wedding, song).
- It is the hardest kind of Lemo style to convert honestly: a prose bible plus a bespoke Canvas film, with no tokens, recipes, validator or conformance.
- Its invariants are visual and testable — paper as the white, transparent layering, flying white, painting-in, annotation layer, one accent, no vector outline.
- A successful conversion gives us a repeatable recipe for the other 58 styles; a failed one tells us the contract is missing a dimension.

## Inputs (read-only, never vendored)

Lemo source:

```
GitHub:  https://github.com/lemomo-ai/lemo-opuscar
Archive: C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main.zip
Local:   C:\Users\Aakash\Downloads\Compressed\lemo-opuscar-main\lemo-opuscar-main\styles\watercolor\
  STYLE.md       the 11-section prose bible, SHA-256 662D57568408A7C82EF8F64980CA85798B8BB239DF3DC3A6715283D7F4555EF0
  DEMO.md        one demo film, explicitly not reusable, SHA-256 DF9AC7B2FE814F1E70F8EEFA1641D7B55480D5CC158E7CD300A52D32F203B7A6
  style.json     metadata only, SHA-256 FE64241069DE6AAF0173DE56B6FF038AE03EB131EF96C799512A5EFEA7821B47
  demo\          engine.js, plants.js, scene.js, main.js, paper.py, CREDITS
LICENSE          MIT, Copyright (c) 2026 LemoLab, at the archive root (not inside the style folder)
```

The source is read-only. The pack does not copy `demo/`, `poster.jpg`, `stills/`, `watercolor.srt`, `music/`, `voices/`, `vendor/`, `tts/`, `fonts.css` or the LemoLab end card.

Repo contract:

```
docs/specs/0003-style-definition-system.md
styles/_template/                 six artifacts (unchanged by this spec)
src/core/style.ts                 schema, validator, resolver, approval
scripts/style.ts                  CLI
docs/STYLE-AUTHORING.md           director flow
styles/_examples/keepsake/        the S1a control (not a product style)
```

## Scope decision after the pre-build critics

The critics found the first draft too large and too eager to change the shared template. This version is smaller:

| Item | Decision | Reason |
|---|---|---|
| `styles/_template` 11-section change | **Deferred** | Prove the structure in `styles/watercolor/STYLE.md` first; a template change needs its own smoke test and would change every future pack's `templateHash`. |
| `gallery.json` | **Deferred** | It is not validated by the S1a contract and would sit inside `packHash` with no command proving it. Gallery metadata belongs to the Phase 4 app, not S1b. |
| 16:9 "scroll" as an eight-shot montage | **Cut** | It was the same six recipes twice. The scroll is now four shots: title, one long walk, mist, close. The walk carries the format. |
| 1:1 "page" with a lateral walk | **Cut** | A journal page is a locked sheet. The page now uses title, specimen, quote, mist and close; no walk. |
| 60 s duration | **Deferred** | Only 30 s and 45 s are proven in this pilot. `limits.durations` is `[30, 45]`. |
| Non-Latin scripts | **Deferred, declared** | The three OFL faces are Latin. The pack says "Latin script only; a non-Latin commission needs a licensed companion face, not a fallback." |
| Third post-build critic | **Keep** | The process requires all three; the extra critic is worth it because the card is the only visual evidence. |

## Outputs

| Path | Purpose |
|---|---|
| `docs/specs/0004-style-pilot-watercolor.md` | This spec and its gate |
| `sources/lemo/watercolor-source.md` | Source autopsy: D01–D27 table, invariants vs demo content, exact extraction, exclusions |
| `sources/lemo/THIRD_PARTY.md` | Repo-level licence and provenance index |
| `sources/lemo/LICENSE-MIT.txt` | Full LemoLab MIT notice |
| `styles/_briefs/watercolor.md` | Frozen style brief (twelve answers) |
| `styles/watercolor/BRIEF.md` | Copy of the frozen brief, hash-bound |
| `styles/watercolor/STYLE.md` | 11-section human contract |
| `styles/watercolor/tokens.json` | Medium, colour, type, layout, motion, sound, seed |
| `styles/watercolor/capabilities.json` | Limits, assets, runtime, evidence, proof, bindings, governance |
| `styles/watercolor/recipes/*.json` | Six parameterized shot contracts |
| `styles/watercolor/card.html` | One-page director card, no external dependencies |
| `styles/watercolor/fonts/` | Four OFL font files, `OFL.txt`, `FONT-LICENSES.md` |
| `styles/watercolor/LICENSE-THIRD-PARTY.txt` | Self-contained MIT + OFL notices for the pack |
| `formats/watercolor-page/format.json` | 1:1, 45 s, 8 shots, locked journal |
| `formats/watercolor-scroll/format.json` | 16:9, 45 s, 4 shots, continuous walk |
| `fixtures/resolve/watercolor-garden.json` | First reuse brief |
| `fixtures/resolve/watercolor-song.json` | Second reuse brief |
| `gate/watercolor-blind/` | Sealed inputs, work output, resolve evidence, pack hash, report |
| `test/watercolor-gate.test.ts` | Executable gate: counts, durations, aspects, hash, regression |
| `docs/decisions/0007-watercolor-pilot.md` | What was converted, what was not, and what it cost |

## The 11-section `STYLE.md`

`styles/watercolor/STYLE.md` uses exactly these top-level `##` headings, in this order. The first seven merge Lemo's human-brief structure; the last four are required by the S1a validator.

1. `## Intent` — essence, what it is, what it is not.
2. `## Materials & surface` — paper, brush, wash, flying white, depth, annotation; includes `### Pitfalls` written runtime-neutral.
3. `## Colour logic` — six roles, two palettes, five-colour frame budget, one accent.
4. `## Type & lettering` — Cormorant Garamond, Caveat, IBM Plex Mono; role mapping; 14 px floor.
5. `## Composition & framing` — margins, one subject, one note, safe zones.
6. `## Motion & camera` — painting-in, sway, camera grammar, transitions; includes `### Native moves`.
7. `## Sound & silence` — acoustic palette, paper foley, silence, optional voice; no delivery loudness.
8. `## Signature` — the required `- **Shot:**`, `- **Transition:**`, `- **Texture:**` lines.
9. `## Refusals` — at least five observable bans.
10. `## Not for` — at least three registers, including Latin-script and photo-led limits.
11. `## Questions` — the authoring log, plus `### Variation space` and `### Decisions`.

There is no `## Engine` section. The source's "Engine" and "Pitfalls" material is rewritten as craft rules, not code.

The template is **not** changed in S1b. If the watercolor pack proves the structure, a later doc-only change may adopt it, with a template smoke test. That is recorded in `0007`.

## The style contract

The pack is a **watercolour field journal**, not a generic paper pack. These invariants are fixed; the author may change wording, palette hexes or type files only with a recorded decision.

### Medium

- One sheet of warm, fibrous cotton paper under every frame. Paper is the white; pure white is never painted.
- Every form is individual brush strokes: a variable-width ribbon at partial opacity. Bristle tracks (3–9, breaking into dashes) are used only on strokes wider than about 6 px; thin stems get one clean stroke, not noise. That is flying white.
- Washes are 3 passes with jittered vertices; edges darken where passes disagree. **Value** comes from more passes, not a darker tube colour. **Depth** comes from parallax layers plus smaller, lighter, less saturated distant forms.
- Forms paint themselves in as they enter, stroke by stroke, structure before detail. In a walk, progress is a function of screen position or a cue; a pan never reveals a finished painting. Finished forms are cached and only sway.
- Sway is small: about 0.006 for trees, 0.01–0.03 for grass; no jitter.
- One annotation layer in a hand the painter would write with: a leader line, a short note, a measured label. The note never covers the subject.
- Layer order: paper → far wash (parallax 0.25) → mid wash (0.55) → main form (1.0) → foreground (1.55) → annotation → grain. Paper-coloured mist bands sit between the washes.

### Colour

Six role names, but at most **five distinct pigments** in a frame: paper, ink, one dominant wash, one second hue, one accent. The sixth role, `deep`, is the wash at 2–3 passes, not a darker tube colour.

| Palette | paper | ink | wash | petal | accent | deep |
|---|---|---|---|---|---|---|
| `garden-day` (default) | `#f3ead9` | `#2f2a24` | `#9fb7a4` | `#d9a6a0` | `#c65438` | `#9fb7a4` |
| `evening-blue` | `#efe6d4` | `#262a2e` | `#8fa3b0` | `#c9a27e` | `#c65438` | `#8fa3b0` |

- Frame budget: paper + ink always; one dominant wash; one of `petal` or `deep`; `accent` only on the recurring stamp/marker. That is five.
- `deep` is labelled on the card as "wash ×3", not a separate pigment.
- Colour may carry data or mood, but it never becomes a continuous software ramp; quantise into 3–6 painted bands.
- No cast shadow on forms. The only light is ambient paper white and a soft paper vignette.

### Type

- Display (titles): **Cormorant Garamond Italic** variable, OFL 1.1.
- Body (subtitles, readable prose, quotes): **Cormorant Garamond** regular variable, OFL 1.1.
- Hand notes: **Caveat** variable, OFL 1.1.
- Measured labels: **IBM Plex Mono** regular, OFL 1.1.
- Monogram: Cormorant Garamond regular.
- No fourth family. Italic is a style, not a family.
- Closed role mapping:
  - `content.title` → `display`
  - `content.subtitle`, `content.body` → `body`
  - `content.caption` → `caption` (Caveat hand note)
  - `content.date`, `content.venue` → `label` (Plex Mono)
  - `content.monogram` → `monogram`
- Hand notes are drawn twice over a paper-coloured halo, revealed left to right, with a leader line that grows to the subject.
- **16 words maximum** per content slot; 14 px minimum at 390 px width.
- Latin script only. A non-Latin commission needs a licensed companion face; the style never falls back silently.

### Composition and camera

- Generous paper margins; one hero subject and one note per view; labels never cover the subject.
- The native move is a long lateral pan across one continuous painted world. A vertical tilt measures one object; a slow push-in leans into a detail; a pull-back re-frames the whole sheet.
- The 1:1 page is a locked sheet: specimen plates, a note, a mist and a close. The 16:9 scroll is one continuous walk: title, one long pan, mist, close.
- Cutting is rare. Allowed transitions: `wipe` (brush edge), `page_turn` (new sheet), `hold` (close). No `cut`, no `dissolve`.
- Mist erases: paper-coloured layers with a wavy rising edge wash the world back to paper. The mist is silent; no caption sits on it.
- Motion is calm: `easeOut` / `easeInOut`, no bounce, no overshoot, no camera shake.

### Sound

- Acoustic and gentle: felt piano, fingerpicked guitar, light strings, glockenspiel or kalimba; no drums.
- Foley made from the scene's matter: paper brush rustle for each paint-in, pencil scratch for notes, a soft page turn, a quiet stamp thump.
- Silence is a colour: the brush lifted, music out, paper and room only.
- Voice optional: warm, unhurried documentary read, one line per idea. Music and voice are cleared per film; the style supplies no audio files.
- Mix character: voice forward, music ducked about 4 dB, short soft reverb. Delivery loudness belongs to the format, not the style.

### Voice and register

Calm, curious, precise. The film is a field journal, not a fairy tale and not a greeting card. Numbers are real if the brief supplies them; the style never invents a fact.

## The 27 decisions

N/A is used only for **D11 rigs**. No other decision is N/A.

| ID | Where in the pack | Watercolor decision | Source |
|---|---|---|---|
| D01 | `medium.brush` | one loaded round brush + a rigger; bristles only on wide strokes; no pencil, no vector outline | STYLE.md §2, DEMO.md engine table |
| D02 | `medium.material` | warm cotton paper, visible fibre; paper is the white | STYLE.md §1–2 |
| D03 | `medium.light` | ambient top-left daylight, softness 0.95, opacity 0.08; paper vignette only, no cast shadow | author decision, from §1/§3 |
| D04 | `color` | two palettes, six roles, default `garden-day`, max 5 pigments | §3 |
| D05 | `medium.texture` | 0.22 paper grain + pigment granulation | §2 |
| D06 | `medium.layerOrder` | paper, far, mid, main, foreground, annotation, grain; mist bands | §2, DEMO.md layers |
| D07 | `layout.shapes` | paper, wash, blob, stroke, rule, seal, label | §1–2 |
| D08 | `layout` | margins 8–11 %, 16-word cap, subject/caption safe zones | §4, §6 |
| D09 | `type` | Cormorant Garamond italic/regular, Caveat, IBM Plex Mono; role map | §4 |
| D10 | `motion.camera` | static, pan, tilt, push_in, pull_back, parallax; default pan | §6 |
| D11 | `capabilities.assets.rigs` | N/A — no cast, painted props only | §1, §5 |
| D12 | `motion.timing` | 48 BPM, bar 4, offset 0; a breath grid, not a music cut | author decision |
| D13 | `motion` | easeOut/easeInOut/linear; physics ease/none; sway amplitudes | §5 |
| D14 | `motion.transitions` | wipe, page_turn, hold; minShot 4 s | §6 |
| D15 | `sound` | acoustic palette, paper foley, silence, optional voice; no LUFS | §7 |
| D16 | `STYLE.md` Signature | a specimen painted in with a hand note; a brush-edge `wipe`; paper fibre and pooled wash edges | §1, §5 |
| D17 | `STYLE.md` Refusals | ≥ 5 observable bans; includes vector-with-texture, pure white, gloss, hard cut, impasto, calligraphic gesture | §1, §9 |
| D18 | `STYLE.md` Not for | ≥ 3 registers; includes ink-wash, children's book, photo-led, non-Latin | §1, §11 |
| D19 | `capabilities.limits` | 1:1/16:9/9:16; 30/45 s; maxCast 0; maxWords 16 | author decision |
| D20 | `capabilities.assets` | one-sheet grammar + seven starter assets, all used | §2 |
| D21 | `recipes/*.json` | six recipes for the six roles the formats use | §5, §6 |
| D22 | `runtime`, `seed` | all eight primitives; seeded stroke/fibre/wash jitter; fixed palette/type/order | §2, §5 |
| D23 | `costClass` | standard: many strokes, sprite-cacheable; no 3D | DEMO.md pitfalls |
| D24 | `evidence.sources` | Lemo bible, botanical plates, handscrolls, watercolour technique | §1–3 |
| D25 | `proof` | declared; title, specimen, close at 1:1/16:9/9:16 | author decision |
| D26 | `identity`, `governance` | Paper Studio; own text; Lemo credited; OFL fonts; no demo media | LICENSE, CREDITS |
| D27 | `bindings`, `BRIEF.md` | frozen brief; hashes; questions/decisions log | S1a |

The source autopsy must expand every row with either a source line or "author decision + reason".

## Recipes

Six reusable shot contracts. They are parameterized by slots; no demo content, no literal copy, no bespoke shot. The `mist` recipe deliberately has **no text slot**.

| Recipe | Beat role | Slots | What it must prove |
|---|---|---|---|
| `watercolor_title` | `title` | title, subtitle, names, date, venue, monogram | a world begins: a horizon wash, an arch, a stamp, then the title is painted in; the plate leaves on a wipe. Not a blank card. |
| `watercolor_walk` | `portrait` | caption, venue | one continuous lateral pan; forms paint in by screen position; no cut. |
| `watercolor_specimen` | `detail` | caption, venue | a hero specimen paints in; a leader line and a hand note; no vector outline. |
| `watercolor_quote` | `quote` | body, caption | a painted object with a readable line and a hand note; not a wash rectangle behind text. |
| `watercolor_mist` | `transition` | none | a silent paper-coloured erase; no caption, no hard cut. |
| `watercolor_close` | `close` | monogram, caption, date | an unfinished detail, a small stamp, a hold; not a framed end card. |

Every recipe has `transitionOut` in `wipe` / `page_turn` / `hold`, a camera move allowed by tokens, a duration inside `minShot`, and failure modes that name observable failures. Each page recipe carries a `vertical` array mapping its op ids to `tokens.layout.aspectBoxes.9:16`; the mist has none because it is a full-frame wipe. The resolver ignores the map, and a renderer uses it to recompose the vertical page.

## Formats

### `watercolor-page` — 1:1, 45 s, 8 shots, locked journal

Sequence: title 1, specimen 3, quote 2, mist 1, close 1 = 8. No walk. This is the handover's 8-shot/45 s/1:1 target.

### `watercolor-scroll` — 16:9, 45 s, 4 shots, continuous walk

Sequence: title 1, walk 1, mist 1, close 1 = 4. The walk has `duration.min 12`, `max 30`; the resolver gives it 25.5 s. This is intentionally four shots: an eight-shot montage is not a handscroll. The scroll proves a second aspect and a different structure, not a second repetition of the page.

Both formats use only `BEAT_ROLES` and `beatRoleMap`. The resolver allocates durations inside every recipe range. No format edits the pack.

**Known S1a limitation:** the resolver selects one recipe per beat role and reuses the same slot values on repeats. It proves structural reuse and determinism, not per-shot content variation. Per-instance slot selection is S2. The spec does not claim otherwise.

## Card evidence plate

The card is the only visual evidence in S1b, so it must not be decoration. It is a static, authored HTML/SVG plate, built from the pack's own parameters and labelled **"card evidence, not the film renderer."** It does not render frames from a brief and does not preview a video.

The hero and the six-frame strip must demonstrate six observable tests, each labelled on the card:

1. **Paper is the white.** The hero and specimen strip ground is the `paper` hex; no pure-white fill in the SPECIMEN. The ANTI deliberately shows pure white as a refusal.
2. **Flying white.** A wide stroke carries 3–9 thin bristle gaps; a thin stem carries one clean stroke.
3. **Pooled edge.** A wash shows three overlapping passes and a darker edge where they disagree.
4. **Painting-in.** The motion loop reveals the specimen from first stroke to last; the static strip shows the same specimen at four progress points.
5. **Annotation leader.** A Caveat note sits beside the specimen with a leader line that grows to it, over a paper-coloured halo.
6. **No vector outline.** The specimen has no uniform outline; its edge is a darker brush stroke.

The card also shows a visible parameter block: `paper #f3ead9`, `wash 3 passes`, `bristles 3–9 on wide strokes`, `halo 12 px`, `leader 1.5 px`, `accent one recurring mark`. The six-frame strip covers `title`, `walk`, `specimen`, `quote`, `mist`, `close`. The REFERENCE panel is described, not reproduced; the ANTI panel is an authored flat vector flower with a watercolour texture overlay, pure white, gloss and a hard cut, labelled with those five refusals.

The card is checked by `style:check` for sections, name/version, all six default palette hexes, `@font-face` resolution, `data-status`, `data-waiting` and `data-signoff`. The six evidence labels and the six-frame strip are checked by the gate test. The creative critic judges whether the evidence actually shows the medium.

## Product positioning

- **Paper Vows (wedding service):** 1:1 journal page and 16:9 handscroll; no photographic likeness, no on-camera cast. The couple appears as names, monogram and painted motifs.
- **Paper Studio / song and memory:** 9:16 vertical page, proven by the blind run. The blind commission is a song/memory film, not a wedding.
- A 9:16 **wedding** invitation is a plausible assembly, but the pilot does not run it and does not claim it. If Paper Vows needs 9:16 first, add a 9:16 wedding fixture and format in a follow-up.
- **Non-Latin scripts:** not supported by the OFL trio. A brief that needs Devanagari, Arabic, CJK or another script needs a licensed companion face; the style never falls back silently.
- **Photographs:** the style paints its subjects. A client photo may be reference for a painted portrait, never pasted in. Photo-led weddings stay with `paper-vows`.

## Fixtures

Two briefs, both full-slot for the recipes they exercise:

- `watercolor-garden.json` — a garden wedding: title, subtitle, names, date, venue, body, caption, monogram. 16-word ceiling respected.
- `watercolor-song.json` — a song/memory film: different title, names, date, venue, body, caption, monogram. 16-word ceiling respected.

All names, dates and venues are fictional specimen copy. They are test inputs, not style facts. The pack itself contains no real name, date, venue or family detail.

## Blind application (sealed, outside the repo)

The actual blind loop took **fifteen runs**. Early runs each found a contract
defect and changed the pack; the final run applied it without an edit. Runs 1–14 are
archived; run 15 is live. The report is
`gate/watercolor-blind/REPORT.md`. This section describes the final protocol.

The blind run is a folder, not an honour system. The author works **outside the repo**, in a temp copy of the sealed inputs. The byte seal proves the author did not edit the inputs; it does not prove the author never opened the repo. The author is a fresh sub-agent prompted to work only in the temp folder; the harness has no sandbox.

```
gate/watercolor-blind/
  PACK-HASH.txt              the live pack hash, written by the lead before the author starts
  inputs/
    prompt.md                the commission and rules
    APPLICATION.md           brief and format schemas, a worked schema example, duration budget, treatment template
    MANIFEST.json            sha256 of every file in inputs/ except MANIFEST.json itself
    pack/                    a byte copy of styles/watercolor at the recorded hash
  used-inputs/
    prompt.md                the author's temp copy, copied back after the run
    APPLICATION.md           the author's temp copy
    MANIFEST.json            the author's temp manifest, byte-compared with inputs/MANIFEST.json
    pack/                    the author's temp pack copy
  work/
    brief.json               written by the author
    format.json              written by the author
    questions.md             every question the pack did not answer
    treatment.md             structured: route, invariants, questions
  resolve.txt                the lead's resolver output
  REPORT.md                  the lead's pass/fail report
```

1. Copy `styles/watercolor/` to `gate/watercolor-blind/inputs/pack/`.
2. Write `inputs/prompt.md` and `inputs/APPLICATION.md`; write `inputs/MANIFEST.json` with the sha256 of every file in `inputs/` except `MANIFEST.json` itself.
3. Copy the whole `gate/watercolor-blind/inputs/` folder to a fresh temp folder **outside the repo** (for example `%TEMP%\watercolor-blind\inputs\`). The author works only in `%TEMP%\watercolor-blind\`, never in `Y:\NewVideoTest\studio`. Create `%TEMP%\watercolor-blind\work\` for the output.
4. The commission: a **30 s, 9:16, six-shot** song/memory film for a fictional brief. The author writes `brief.json`, `format.json`, `questions.md` and `treatment.md` in the temp `work/`. No edits to the temp `inputs/pack/`. The 30 s page uses the page contracts — title, specimen, quote, mist, close — and may repeat one; the walk is the 16:9 scroll's move and its 12 s minimum cannot fit the 30 s page.
5. After the author finishes, copy the temp `inputs/` back to `gate/watercolor-blind/used-inputs/` and the temp `work/` back to `gate/watercolor-blind/work/`. The lead runs the resolver against the **live** pack with the blind brief/format and one fixture with the same format. 6 shots, 30 s, 9:16, 9/9.
6. The gate test:
   - asserts `inputs/MANIFEST.json` and `used-inputs/MANIFEST.json` are byte-identical;
   - reads that manifest and recomputes every entry against **both** `inputs/` and `used-inputs/`;
   - computes `computePackHash("gate/watercolor-blind/used-inputs/pack")` and compares it with `PACK-HASH.txt`;
   - computes `computePackHash("styles/watercolor")` and compares it with `PACK-HASH.txt`;
   - asserts the blind resolve is 6 shots / 30 s / 9:16 and 9/9.
   Any mismatch fails the gate. The author cannot edit the live pack, and cannot edit the temp input copy without breaking the manifest and the byte comparison.
7. The treatment is structured, not a free essay:
   - `## Route` — six shots, each with recipe id, beat role, duration and the invariant it proves.
   - `## Invariants` — six observable checks: paper as white, flying white, pooled edge, painting-in, annotation leader, no vector outline.
   - `## Questions` — every question the pack did not answer.
8. The **creative post-build critic** scores the treatment against those six checks. A missing answer is a pack defect, not an author failure.

`APPLICATION.md` contains the generic brief schema, the format schema, one schema example with generic beats, the fit check `sum(duration.min) <= target <= sum(duration.max)`, a note to read `inputs/pack/recipes/*.json` for recipe ids/beat roles/slots, and the treatment template. It contains no style content and no Lemo material. The author does **not** get `docs/STYLE-AUTHORING.md`: that guide is the repo's pack-authoring flow and points at `gate/blind/`, so it would be misleading. The pack's own `STYLE.md`, `card.html` and recipes are the style guide.

## Gate

Run from the repo root. PowerShell-friendly one-line commands:

```powershell
npm run typecheck
npm test
npm run style:check -- styles/watercolor
npm run style:check -- styles/_examples/keepsake
npm run style:check -- styles/_template
node --import tsx --test test/watercolor-gate.test.ts
```

`npm test` includes `test/watercolor-gate.test.ts`. That test is the executable gate:

- `styles/watercolor` is REVIEWABLE, 0 hard failures, exactly one open choice (`paint-in-speed`).
- `watercolor-page` with garden and with song: 8 shots, 45 s, 1:1; 9/9 including assertion 4.
- `watercolor-scroll` with garden and with song: 4 shots, 45 s, 16:9; 9/9 including assertion 4.
- Blind run: 6 shots, 30 s, 9:16; 9/9.
- Sealed inputs: `inputs/MANIFEST.json` and `used-inputs/MANIFEST.json` are byte-identical; every manifest entry hashes against both copies; `computePackHash("used-inputs/pack")` equals `PACK-HASH.txt`; the live pack hash equals `PACK-HASH.txt`.
- `keepsake` is still REVIEWABLE with 0 hard failures.
- `_template` is still DRAFT, exit 0.
- Card has no external `http(s)` URLs, no Lemo media file is inside the pack, the six evidence labels and six-frame strip are present, and the parameter block contains `paper #f3ead9`, `wash 3 passes`, `bristles 3–9`, `halo 12 px`, `leader 1.5 px`.
- `STYLE.md` has the 11 headings in order; `sources/lemo/watercolor-source.md` has D01–D27 rows.
- `capabilities.identity.licence` names the proprietary pack and OFL fonts.

The two resolve commands, one per format (the CLI compares each pair after the first with the first pair, so a four-pair mixed-format command would compare a garden/scroll pair with a garden/page pair and correctly fail assertion 4):

```powershell
npm run style:resolve -- --style styles/watercolor --seed 42 --brief fixtures/resolve/watercolor-garden.json --format formats/watercolor-page/format.json --brief fixtures/resolve/watercolor-song.json --format formats/watercolor-page/format.json
npm run style:resolve -- --style styles/watercolor --seed 42 --brief fixtures/resolve/watercolor-garden.json --format formats/watercolor-scroll/format.json --brief fixtures/resolve/watercolor-song.json --format formats/watercolor-scroll/format.json
```

Expected: page 8 shots · 45 s · 1:1, two plans; scroll 4 shots · 45 s · 16:9, two plans; 9/9 in each command. The gate test performs the full 2×2 with same-format comparisons.

The blind resolve command, one line:

```powershell
npm run style:resolve -- --style styles/watercolor --seed 7 --brief gate/watercolor-blind/work/brief.json --format gate/watercolor-blind/work/format.json --brief fixtures/resolve/watercolor-garden.json --format gate/watercolor-blind/work/format.json
```

Expected: 6 shots · 30 s · 9:16; 9/9.

A temporary approval test may be run on a copy with a unique id, never on the pilot. The pilot stays **REVIEWABLE** with one open taste choice; the LLM does not approve it.

The one open choice:

> **Paint-in speed: 1.2 s or 1.8 s per painted form? A specimen is the reference.** Definition: the time from the first to the last stroke on one painted form. In a walk, progress follows screen position or camera, not this timer. The card shows both at the same 7 s loop.

## Non-goals

- Renderer, frames, pixels, MP4, audio mix.
- Web app, review room, payments, auth.
- Paper K-pop pack, `styles/paper-vows` migration, a second product style.
- Converting the other 58 Lemo styles.
- Vendoring Lemo code, demo films, stills, music, voices, vendor data or the source archive (about 100 MB extracted).
- Pixel conformance (S2).
- A new npm dependency. Font files are assets, not packages.
- Changing the S1a schema, validator vocabulary, resolver semantics or `styles/_template`. If the pilot needs a schema change, stop and write a contract-change spec first.

## Deferred, with reasons

| Item | Why deferred |
|---|---|
| `gallery.json` | Unvalidated by S1a, enters `packHash`, and serves a Phase 4 app. `capabilities.identity` and the card carry the presentation metadata for now. |
| Template-wide 11-section `STYLE.md` | Prove the structure in one real pack first; adopt later with a scaffold smoke test. |
| 60 s duration | Not proven by a format in this pilot; `limits.durations` is `[30, 45]`. |
| Non-Latin scripts | The OFL trio is Latin; adding Devanagari/Chinese is a type-system decision, not a fallback. |
| Paper K-pop and `paper-vows` | S1c, after the pilot measures the conversion cost. |
| Lemo `core/` renderer | Study for S2; not integrated. |

## Rights and provenance

- **Lemo docs:** MIT, Copyright (c) 2026 LemoLab. `sources/lemo/LICENSE-MIT.txt` contains the full notice. The pack's `LICENSE-THIRD-PARTY.txt` repeats it because the pack may travel alone.
- **Lemo demo film/stills:** CC BY 4.0, LemoLab. **Not reproduced.** No `poster.jpg`, stills, `.srt`, music, voices, vendor data or demo code enters the repo. The card's REFERENCE is described, not reproduced.
- **Fonts:** Google Fonts OFL 1.1 files, downloaded from upstream `google/fonts`, not copied from the Lemo demo subset:
  - `CormorantGaramond[wght].ttf`, `CormorantGaramond-Italic[wght].ttf`
  - `Caveat[wght].ttf`
  - `IBMPlexMono-Regular.ttf`
  Each family's copyright and OFL text go in `styles/watercolor/fonts/OFL.txt` and `FONT-LICENSES.md`. The source URLs and SHA-256 are recorded there.
- **Public-domain references:** botanical plates and handscrolls are categories, not reproduced works. The card and autopsy name the category and say "described, not reproduced." If a specific work is ever reproduced, its source URL/accession and licence go in `THIRD_PARTY.md` first.
- **Fixtures and blind brief:** all names, dates and venues are fictional specimen copy. No third-party lyrics, song titles, voice or music files.
- **Pack licence:** `Proprietary — Paper Studio internal pilot; third-party notices in LICENSE-THIRD-PARTY.txt`. Legal review before commercial sale.
- **Credit:** `capabilities.identity.lineage` and the card's proof section credit Lemo-Opuscar watercolor as the source grammar, and state that the demo story, characters and assets were not used.

## Docs to change for the S1b re-scope

These are part of the build, not afterthoughts. Wave 0/1 is not done until they are consistent.

| File | Exact change |
|---|---|
| `AGENTS.md` | Current phase becomes S1b watercolor pilot; Paper K-pop and `paper-vows` move to S1c; add `sources/**` (shared), `gate/**` (technical), `formats/**` (creative) to ownership; add the watercolor gate command to Commands. |
| `docs/specs/0003-style-definition-system.md` | Header "Followed by: S1b — watercolor pilot (0004); Paper K-pop S1c"; paper-vows lines say S1c; out-of-scope "Paper K-pop (S1c)"; add a "Superseded by 0004 for the next phase; S1a contract unchanged" note. |
| `docs/ROADMAP.md` | Phase 0b becomes "Watercolor pilot (S1b)" with the gate; a following S1c entry covers Paper K-pop and `paper-vows`; Phase 0c vertical slice stays after. |
| `README.md` | Status says S1a complete, S1b watercolor pilot; Next slice points to 0004, not the renderer. |
| `HANDOVER.md` | Add a top "S1b re-scope" note: read 0004; Paper K-pop S1c; rest is the S1a record. |
| `CONVERSATION-HANDOVER.md` | Same top note; §6 next step points to 0004. |
| `docs/STYLE-AUTHORING.md` | Add a short "Converting a source style" section: autopsy first, separate invariants from demo, rights file, 11-section headings. No template change. |
| `docs/decisions/0007-watercolor-pilot.md` | New decision record: conversion, exclusions, cost, deferred items, template recommendation. |

The PR/commit set carries the `contract-change` label because it re-scopes the phase and adds ownership rows. The S1a schema and validator do not change.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| The pack becomes a generic paper style | The invariants and refusals name watercolour-specific tests: paper as white, flying white on wide strokes only, pooled edges, painting-in tied to entry, annotation leader, no vector outline, no hard cut. The creative critic scores fidelity, not just validity. |
| The pack smuggles in the demo | The autopsy separates invariants from demo content. No Australia, rainfall map, specific plants/animals, 113.6 s timing, music, voice or LemoLab end card. The recipes are content-free and use only the 12 slots. |
| The prose bible is not machine-repeatable | Six recipes, two formats and a prompt-isolated, byte-sealed blind run are the machine surface. The blind run is the proof, not the prose. |
| The 1:1 and 16:9 plans are the same film | The page is a locked 8-shot journal; the scroll is a 4-shot continuous walk. The gate test asserts different counts and aspects. |
| The blind run is contaminated | Byte-sealed inputs, a manifest and a pack hash before/after; the author is given only the copied pack and the application guide. The seal proves bytes, not that the author never opened the repo. |
| Licence or provenance is vague | Full MIT notice, OFL notices, source hashes, a D01–D27 table, and an explicit not-reproduced list. |
| The template change breaks `keepsake` | No template change. `keepsake` is checked in the gate test. No `style:seal` during S1b. |
| The pilot overfits the wedding vertical | The two fixtures are a garden wedding and a song/memory; the blind commission is a song/memory at 9:16. |
| The card is decoration | The card is a parameter-built SVG evidence plate with six observable tests and a six-frame recipe strip; it is labelled "card evidence, not the renderer." |
| The resolver repeats one slot value | Declared as an S1a limitation; the pilot proves structural reuse, not per-shot content variation. |

## Build waves

| Wave | Work | Who |
|---|---|---|
| 0 | Revise spec; three pre-build critics; loop until 9/10 GO | lead + 3 critics |
| 1 | Docs re-scope table; no template change | lead |
| 2 | Source autopsy, D01–D27 table, licence files | sub-agent A |
| 3 | Freeze brief; scaffold `styles/watercolor`; pack core (STYLE, tokens, capabilities) | lead + sub-agent B |
| 4 | Six recipes, two formats, two fixtures | sub-agent B + lead |
| 5 | Card evidence plate, fonts, licence notices | sub-agent C + lead |
| 6 | Check/resolve loop until REVIEWABLE and 9/9 | lead |
| 7 | Prompt-isolated, byte-sealed blind run; pack hash unchanged; 6/30/9:16 | sub-agent D |
| 8 | `test/watercolor-gate.test.ts`; three post-build critics; fix and re-run until 9/10 GO | lead + 3 critics |
| 9 | Decision record, final gate evidence, commit | lead |

## Definition of done

- `npm run typecheck` passes.
- `npm test` passes, including `test/watercolor-gate.test.ts`.
- `npm run plan -- fixtures/wedding-min/brief.json` still produces a valid plan (AGENTS definition of done).
- `styles/watercolor` is REVIEWABLE, 0 hard failures, exactly one open choice.
- The 2×2 resolve passes 9/9: page 8/45/1:1; scroll 4/45/16:9.
- The prompt-isolated, byte-sealed blind run passes 6/30/9:16; the baseline and used input manifests are byte-identical and every hash matches; the live pack hash is unchanged; the author was prompted to work outside the repo.
- `keepsake` is REVIEWABLE with 0 hard failures; `_template` is DRAFT, exit 0.
- The card opens with no external requests, shows the name/version, all six default palette hexes, the hero, REFERENCE/SPECIMEN/ANTI, the six labelled evidence tests, the parameter block, the six-frame strip, the 390 px phone, and both paint-in speeds.
- The product positioning is stated: Paper Vows 1:1/16:9; Paper Studio/song 9:16; 9:16 wedding is not claimed; Latin-only and no-photo limits are explicit.
- `STYLE.md` has the 11 headings in order and the four required sections.
- `sources/lemo/watercolor-source.md` has D01–D27 rows; `THIRD_PARTY.md`, `LICENSE-MIT.txt`, `fonts/OFL.txt` and `LICENSE-THIRD-PARTY.txt` exist.
- No Lemo code or media in the repo; no new npm dependency; `package.json` unchanged.
- The docs re-scope table is complete.
- `docs/decisions/0007-watercolor-pilot.md` records what was converted, what was excluded, the cost, and the deferred items.
- All three post-build critics return **9/10 GO**.
