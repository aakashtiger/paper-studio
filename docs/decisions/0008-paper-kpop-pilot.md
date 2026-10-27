# 0008 — Paper K-pop pilot: one owned style, one pack

**Status:** frozen for the S1c gate · 2026-10-27
**Owners:** both
**Spec:** `docs/specs/0005-paper-kpop-pack.md`
**Pack:** `styles/paper-kpop/` 0.1.0, **REVIEWABLE**, `sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba`
**Blind report:** `gate/paper-kpop-blind/REPORT.md`
**Geometry audit:** `gate/paper-kpop-blind/AUDIT.md`

## Context

S1a proved a style can be a machine-checkable package. S1b converted the Lemo watercolor grammar and exposed the gap the director cares about: a pack can be mechanically clean and still have a card that is a spec sheet, not a review surface.

S1c is the opposite test. The source is the author's own 157 s paper-cut music film, not a borrowed prose bible. The film has 54 shots, a song, lyrics, characters and a stage; the pack must keep the grammar and leave all of that behind.

## Decision

Ship **one** Paper K-pop style pack, with no renderer and no video:

- Six artifacts plus eight recipes: `BRIEF.md`, `STYLE.md`, `tokens.json`, `capabilities.json`, `recipes/*.json`, `card.html`.
- `APPLICATION.md` inside the pack: brief and format shapes, resolve command, slot limits.
- Bundled fonts: Anton, Archivo Black and DM Mono under OFL 1.1; Permanent Marker under Apache 2.0. Both licence texts travel.
- Two product formats: `paper-kpop-song` (16:9, 45 s, 14 shots) and `paper-kpop-shorts` (9:16, 30 s, 8 shots).
- A prompt-isolated, byte-sealed blind application at 6 shots / 30 s / 9:16.
- A visual-first card: authored SPECIMEN, authored ANTI, 3 cropped reference stills, 3 recognition specimens, one open choice.
- A gate test that proves counts, durations, aspects, all eight recipes, hashes, self-containment, card density and no source leak.

The pack is a **cut-paper pop stage**, not a generic paper texture. It keeps: flat cream card; torn and cut edges; red, blue, acid and one accent; Anton stacks with cream edge and hard ink shadow; halftone under type; layered paper puppets; 88 BPM cuts; push, orbit, pan, tilt, pull-back; cut, iris, wipe, match-cut, hold; paper foley and electronic pop. It refuses gloss, 3D, gold-foil weddings, soft serif ceremony, photographic faces, pasted photos, more than two cast, more than four colours, more than eight words and full-frame lyric walls.

## What was excluded

No film story, lyrics, character names, scene order, audio, song, stems, voice, uncropped still or film title enters the pack. The six cropped stills are evidence only. `sources/paper-kpop/autopsy.md` records D01–D27, the source lines and the not-taken list.

No renderer, frame, MP4, 3D, 1:1, 60 s, audio file or third-party code is included. The read-only `reference/paper-kpop/` modules are not imported.

## The one open choice

`paper-shadow`:

> Does the paper cast a shadow? **Collage** adds a soft contact shadow to every paper layer and keeps a visible cut edge. **Print** keeps the layers flat with the same visible cut edge; only the type carries a hard, misregistered ink shadow.

The recipes name only the fixed type shadow. The director answers `paper-shadow`; the pack stays REVIEWABLE and unsigned.

## Gate evidence

```text
typecheck                         pass
tests                             101 / 101
ci (GitHub Actions)               success 40474575139
style:check                       REVIEWABLE, 0 hard, 1 open choice (paper-shadow)
song (two briefs)                 14 shots, 45 s, 16:9, 9/9
shorts (two briefs)               8 shots, 30 s, 9:16, 9/9
blind (final work)                6 shots, 30 s, 9:16, 9/9
pack hash                         sha256:6c5765be435bbf494bceaee6b770828c4bdd2c33d5c795287cf96435f8c211ba
pack                              30 files, circa 1.2 MB (fonts/frames dominate)
manifests                         inputs and used-inputs byte-identical; 32 files; every hash matches
geometry                          9/9; 14 px floor, no overlap, no rule crossing, paired anchors, contact
card                              no external request; 3 reference stills; 3 recognition specimens; 77 prose words / 222 visible tokens
critics                           contract 9/10 GO · creative 9/10 GO · product 9/10 GO
```

The final author worked against `cc16e1fd…`; three contract-only clarifications followed (format palette field, lyric band start, uncoloured flash removed), then the geometry batch (6 critical and 8 high findings) brought the pack to `6c5765be…`. No slot, recipe, duration or format structure changed; the work re-resolves 9/9 on the final pack. This is a **plan-valid carry-forward**, not a pristine seal; the report discloses both hashes.

## What the pilot proved

- The style is reusable across a 14-shot 16:9 song, an 8-shot 9:16 Short and a 6-shot 9:16 blind application.
- The pack is self-contained and independent of watercolor and keepsake.
- A fresh author can resolve a real short film without the source film.
- The card can be visual-first and still carry the evidence: 77 prose words, three large reference crops, three recognition specimens and a controlled Collage/Print comparison. At 390 px the phone illustration is 390 px on a mobile viewport, not 327 px.
- The box system survives a real geometry audit: 14 px floor, no text overlap, no rule crossing, margins, paired anchors and contact all pass.
- The licence register is honest: three OFL families, one Apache family, full texts in the pack.

## What it did not prove

- Pixels, motion feel, phone legibility, actual paper depth or the 88 BPM cut at frame exactness. That is S2.
- That the blind author saw the final `6c5765be…` pack. The run is a plan-valid carry-forward from `719e0582…`.
- That the 16:9 authored type scale fits every box at 390 px without auto-fit. The 14 px floor is proven; the authored 64/26 px scale is a ceiling.
- The 1.2 s floor is available but not used by the blind; the song exercises 2.7–4.3 s cuts.
- Per-shot content variation. S1a is one value per slot.
- A 30 s six-shot film as a product shape. The product shapes are 14×45 and 8×30; six shots is the blind proof.
- That the blind author never opened the repo. The seal is bytes, not isolation.

## Cost

The blind loop found one class of defect at a time. The final batch audited all recipes, boxes, z-order, text fills, transitions, licences, docs and card references before the final plan. The geometry re-audit then found 6 critical and 8 high box defects and fixed them in one batch. The pack is 8 recipes, 2 formats, 1 card, 1 application page, 30 files and 9 gate tests. No renderer.

## Next

S1c is frozen. The watercolor 0.2.0 card/process revision followed in a new pack and gate folder; see `docs/decisions/0009-watercolor-0.2.0.md`. The next build is S2: a short watercolor and Paper K-pop render test, contact sheet and motion comparison. No full film, no app, no second style until that exists. The director answers `paper-shadow` and signs.
