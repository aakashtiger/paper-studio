# Watercolor Brush — style contract

**Family:** paper
**Version:** 0.1.0
**Status:** reviewable

## Intent

Watercolor Brush is a reusable style for short films that should look like a page
from a naturalist's field journal being painted in front of you. It is not a
greeting card, a children's book, an ink-wash pastiche or a vector illustration
with a watercolour texture laid on top. It is for a garden wedding invitation, a
song/memory film, or any subject that rewards close looking: a plant, a table, a
room, a coastline, a room remembered through objects.

It should feel calm, curious and hand-made. The paper is the white; the paint is
transparent; the hand is visible; the note is short. The style must never feel
glossy, cute, rustic-craft, software-made or ceremonially grand.

1. **One sheet.** Every frame sits on one warm cotton paper sheet; nothing floats
   and nothing shines.
2. **Transparent pigment.** Values come from more passes, not a darker tube
   colour. Overlapping strokes darken.
3. **Flying white.** Wide strokes carry 3–9 bristle tracks that break into dashes;
   thin stems get one clean stroke, not noise.
4. **Painting-in.** Forms appear stroke by stroke, structure before detail, as
   they enter or are cued. A pan never reveals a finished painting.
5. **One note.** A view with a subject carries one hand note with a leader line
   and, where a value matters, the date or venue label carries it; the mist is
   silent and the close may carry a closing line and a date. The note never covers
   the subject.
6. **One accent.** A single vermilion mark recurs; it is not a decorative second palette.
7. **Cut rarely.** Brush-edge wipes, a page turn, a silent mist and a hold; no
   hard cut and no dissolve.

## Materials & surface

Warm cotton watercolour paper, 300 gsm, visible fibre and slight buckling. The
paper is drawn first in every frame and is also the eraser: paper-coloured mist
washes the world back to blank sheet.

A form is a variable-width ribbon at partial opacity. A wash is three passes of
the same polygon with jittered vertices, so the edge darkens where the passes
disagree. Depth comes from parallax layers, not from a darker pigment: far forms
are smaller, lighter and less saturated. The layer order is paper, far wash, mid
wash, main form, foreground, annotation, grain. Paper-coloured mist bands sit
between the washes in wet scenes.

Sway is small and only after a form is finished: about 0.006 for trees, 0.01–0.03
for grass. Finished forms are cached and only sway. Nothing jitters.

Assets are types, not subjects. One `prop.painted-specimen` can carry a latch, a
stair or a key; the treatment names the subject. The pack never ships a bespoke
asset per film.

### Pitfalls

- A wash that stops at the edge of its surface leaves a hard seam; extend it
  below the frame and fade to paper.
- A strip too short flattens a tall form on a tilt; make the strip longer than the
  camera move.
- Any stroke built during a frame must be seeded, or two renders of the same frame
  will disagree. The style's seed block names the seeded surfaces.
- Thousands of strokes per frame are too slow; cache finished forms.
- Beat-locked motion must be re-derived when a music edit changes. This style uses
  a 48 BPM breath grid, not a music cut, so it does not depend on a track.

## Colour logic

Six role names, at most five pigments in a frame:

| Role | Use |
|---|---|
| `paper` | the sheet and the mist; never pure white |
| `ink` | lines, text, edges, stems |
| `wash` | the dominant transparent hue |
| `petal` | the second hue: petal, ochre, skin, weather |
| `accent` | one recurring stamp or marker |
| `deep` | the wash at 2–3 passes; not a separate tube colour |

Two palettes: `garden-day` (sage, rose, vermilion) and `evening-blue` (blue-grey,
ochre, vermilion). The default is `garden-day`. The frame budget is paper + ink +
one dominant wash + one of petal/deep + one accent. Colour may carry data or mood,
but it never becomes a continuous software ramp; quantise into 3–6 painted bands.
The accent recurs across the film, not in every frame; "recurs" means at least
twice, and the mist may carry none. The same seal at the title and the close is one
recurring accent, not two new marks; it may move between the two plates.
There is no cast shadow on forms; the only light is ambient paper white and a soft
paper vignette.

## Type & lettering

- **Display:** Cormorant Garamond Italic, for titles.
- **Body:** Cormorant Garamond regular, for subtitles, readable prose and quotes.
- **Caption:** Caveat, for hand notes.
- **Label:** IBM Plex Mono, for measured labels such as a date or a place.
- **Monogram:** Cormorant Garamond regular.

The mapping is closed: title uses display; subtitle, names and body use body; caption
uses the hand; date and venue use the label; monogram uses the monogram. Names is
one or two short lines. No fourth family, and italic is a style, not a family.

Hand notes are drawn twice over a paper-coloured halo, revealed left to right,
with a leader line that grows to the subject. Captions sit on the paper, not in a
box. Sixteen words maximum per content slot; fourteen pixels minimum at 390 px
width. The 6 px bristle threshold is at the 390 px authoring width; scale the
widths and the threshold together. `standard` is 4 px and never carries bristles;
`wide` is 8 px and does. A caption is two lines maximum; at 9:16, shorten it rather
than exceed the box. The close may share the caption as a refrain; a quote's
attribution goes in the caption or the body, because there is no separate
attribution slot. Measured labels are short and one line. At 9:16, recompose rather than crop: display 44 px,
body 24 px, caption 24 px, label 14 px, monogram 18 px; keep the title in the left
column and the arch on the right. The boxes are in
`tokens.layout.aspectBoxes.9:16`; each recipe's `vertical` array maps its op ids to
those boxes. Use them instead of stretching the 1:1 boxes, and re-anchor leader
paths to the 9:16 boxes. The scale is authored for a 390 px page; larger frames
scale proportionally, and the 14 px floor stays. Latin script only in this pilot;
a non-Latin commission needs a licensed companion face, never a silent fallback.

## Composition & framing

Generous paper margins: nine percent top, eight percent left and right, eleven
percent bottom. One hero subject and one note per view. Labels never cover the
subject. The title lives in the top-left quiet zone; the caption sits in the
bottom safe zone. The bottom safe zone is a maximum for text, not a required
position; a note may sit higher if it does not cover the subject. A seal may sit in
the top or right margin as a stamp; text stays inside the margins. The subject-safe
area is the central 84 percent.

The 1:1 page is a locked sheet: title, specimen, quote, mist and close. A page
contract may repeat. The 16:9 scroll is one continuous world read laterally. The
9:16 page is a vertical journal page, not a crop of the scroll; it uses the page
contracts and may repeat a page contract. The walk belongs to the 16:9 scroll; its
twelve-second minimum cannot fit a 30 s six-shot page. Never stretch a page to fit
a new aspect; recompose it, using `tokens.layout.aspectBoxes` for 9:16.

An unfinished detail means the last wash pass stops before the form's edge, leaving
one paper-coloured gap. The gap is the sheet showing through, not an opaque pigment
fill; a paper-coloured shape or a stopped wash is allowed. It is not a sketch, a
fade or a blank; the form is simply still being painted when the film ends.

## Motion & camera

Painting-in is the main motion. In a specimen, progress runs from the first
stroke to the last over 1.2 s or 1.8 s, the director's choice. The choice applies
to every painted form, including the title's arch, the quote's object and the
close's unfinished detail; the mist is a wipe. In a walk, progress is a
function of screen position or a cue, so a form is already painting as it enters;
the camera never pans over a finished painting. Sway begins only after a form is
finished.

The camera grammar is a vocabulary, not a route: a locked sheet for a specimen, a
long lateral pan for a walk, a vertical tilt to measure one object, a slow push-in
to lean into a detail, a pull-back to re-frame the whole sheet. Easings are
`easeOut`, `easeInOut` and `linear`; no bounce, no overshoot, no camera shake.
Allowed transitions are `wipe`, `page_turn` and `hold`; no `cut`, no `dissolve`.

### Native moves

- **Painting-in as reveal.** A new form appears stroke by stroke as it enters.
- **Specimen + note.** One hero object, one leader line, one short hand note. The
  title is a title plate, not a specimen; it may carry no hand note.
- **Palette as data.** A sky, ground or background blends by a measured value.
- **Mist erase.** The world washes back to paper; silent, no caption. The mist
  erases the shot before it; it has no slot because its source is whatever
  precedes it. It composites over the outgoing shot; it is not a fresh world. The
  quote's outgoing wipe and the mist's wipe are one erase; do not put a page turn
  between them. The mist ends on full paper; the wavy edge is the rising pass, not
  the final state.
- **Painted transformation.** A form cross-fades to a burnt, wet or aged state and
  regrows, never as a photographic dissolve.
- **Handscroll.** One continuous lateral world; the camera move is the argument.

## Sound & silence

Acoustic and gentle: felt piano, fingerpicked guitar, light strings, glockenspiel
or kalimba; no drums. Foley is made from the scene's matter: paper brush rustle for
each paint-in, pencil scratch for notes, a soft page turn, a quiet stamp thump.
Silence is a colour: the brush lifted, music out from the mist through the close,
paper and room only; one quiet stamp thump is allowed at the close. Voice is
optional, warm and unhurried, one line per idea. The style supplies no audio
files; music and voice are cleared per film. Mix character: voice forward, music
ducked about 4 dB, a short soft reverb. Delivery loudness belongs to the format,
not the style.

## Signature

- **Shot:** a specimen paints in from first stroke to last, with a Caveat note on a leader line; a slow push-in of six percent or less.
- **Transition:** a brush-edge `wipe` between plates, a `page_turn` between journal pages, and a `hold` at the close; no cut and no dissolve.
- **Texture:** cotton paper fibre at twenty-two percent, pooled wash edges, and dry-brush flying white on wide strokes; no digital grain and no gloss.

Paint-in speed is the director's choice: 1.2 s or 1.8 s per painted form. A
specimen is the reference; a quote's object paints in by the same rule. The card
shows both at the same seven-second loop. The choice lives in
`capabilities.governance.choices` as `paint-in-speed`.

## Refusals

- No vector outline, and no vector shape filled with a watercolour texture.
- No pure white paint; paper is the white.
- No opaque flat fill, no impasto, no calligraphic brush-as-gesture.
- No gloss, foil, gold, brass or metallic sheen.
- No cast shadow on a painted form; no hard drop shadow.
- No hard cut and no dissolve between unrelated pictures.
- No more than five pigments in a frame.
- No text over the subject and no caption over sixteen words.
- No photographic likeness, no stock-photo smiles, no pasted photo layer.
- No children's-book cuteness, no greeting-card sentiment, no rustic-craft props.
- No ink-wash pastiche: this is colour, not ink tones.
- No type below fourteen pixels at 390 px width.

## Not for

- Photo-led weddings and family archives built from photographs.
- Memorial cards and formal ceremony films that need a solemn register.
- Children's books, cute animal stories and greeting-card messages.
- Corporate explainers, product launches and advertorials.
- Briefs that need Devanagari, Arabic, CJK or another non-Latin script.
- Fast-cut music videos, trend edits and 3D camera spectacle.

## Questions

### Variation space

The director decides the subject, the route, what gets painted, the palette
logic, whether anything is measured, the opening, the ending and the camera. The
proven structures are a locked journal page, a continuous handscroll and a
vertical page. The style does not fix the story, the number of specimens beyond
the format's sequence, or the music.

### Decisions

- **Source.** Lemo-Opuscar `watercolor` is the source grammar. The pack text is
  written for Paper Studio; no demo story, code, still, music, voice or end card is
  reused. MIT and OFL notices travel with the pack.
- **Palette roles.** `paper`, `ink`, `wash`, `petal`, `accent`, `deep`. `deep` is
  the wash at more passes, not a darker pigment. At most five pigments per frame.
- **Type trio.** Cormorant Garamond italic/regular, Caveat, IBM Plex Mono. Latin
  only in this pilot.
- **Transitions.** `wipe`, `page_turn`, `hold`. No cut, no dissolve.
- **Formats.** 1:1 locked page, eight shots; 16:9 continuous walk, four shots;
  9:16 vertical page, six shots in the blind run.
- **Photo stance.** No photographic likeness and no on-camera cast. A photo may be
  reference for a painting, never a pasted layer.
- **Deferred.** `gallery.json`, the template-wide 11-section change, 60 s duration,
  non-Latin scripts, Paper K-pop and the `paper-vows` migration.

### Blind application

The pack has been applied by fresh authors outside the repo. Early runs changed
the contract; the final run resolved a 6-shot, 30 s, 9:16 film without an edit.
The findings, fixes and residual questions are in
`gate/watercolor-blind/REPORT.md` and `docs/decisions/0007-watercolor-pilot.md`.
One value per slot means a repeated caption or venue is a running note or label;
per-shot notes are S2.

### Authoring log

- **Q: Is the title a series of paragraph cards?** **A:** No. The title is a world
  beginning: a horizon wash, an arch, a stamp, then the title is painted in; the
  plate leaves on a wipe.
- **Q: Is the quote a wash rectangle behind text?** **A:** No. A painted object
  holds the eye; one readable line and one hand note sit beside it, with a leader
  line.
- **Q: Can the mist carry a caption?** **A:** No. The mist is silent; a caption on
  the erase turns a breath into a card.
- **Q: Is the close a framed end card?** **A:** No. An unfinished detail, a small
  stamp and a hold; the page is left open.
- **Q: Does the style allow a photograph?** **A:** No. A photo may be reference for
  a painted portrait, never a pasted layer.
- **Q: Which paint-in speed should the director choose?** **A:** 1.2 s or 1.8 s per
  specimen. Both are shown on the card at the same seven-second loop.
