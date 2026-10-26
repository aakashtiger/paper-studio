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
room, a coastline, a face remembered through objects.

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
5. **One note.** One hand annotation per view, with a leader line and a measured
   label; the note never covers the subject.
6. **One accent.** A single vermilion or rain-blue mark recurs; it is not a
   decorative second palette.
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

### Pitfalls

- A translucent wash that stops at its canvas edge leaves a hard seam; extend it
  below the frame and fade to paper.
- A strip too short flattens a tall form on a tilt; make the strip longer than the
  camera move.
- Any stroke built during a frame must be seeded, or parallel workers disagree.
  The style's seed block names the seeded surfaces.
- Thousands of strokes per frame are too slow; cache finished forms as sprites.
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
ochre, rain blue). The default is `garden-day`. The frame budget is paper + ink +
one dominant wash + one of petal/deep + one accent. Colour may carry data or mood,
but it never becomes a continuous software ramp; quantise into 3–6 painted bands.
There is no cast shadow on forms; the only light is ambient paper white and a soft
paper vignette.

## Type & lettering

- **Display:** Cormorant Garamond Italic, for titles and subtitles.
- **Body:** Cormorant Garamond regular, for readable prose and quotes.
- **Caption:** Caveat, for hand notes.
- **Label:** IBM Plex Mono, for measured labels such as a date or a place.
- **Monogram:** Cormorant Garamond regular.

The mapping is closed: title and subtitle use display; body uses body; caption
uses the hand; date and venue use the label; monogram uses the monogram. No fourth
family, and italic is a style, not a family.

Hand notes are drawn twice over a paper-coloured halo, revealed left to right,
with a leader line that grows to the subject. Captions sit on the paper, not in a
box. Sixteen words maximum per content slot; fourteen pixels minimum at 390 px
width. Latin script only in this pilot; a non-Latin commission needs a licensed
companion face, never a silent fallback.

## Composition & framing

Generous paper margins: nine percent top, eight percent left and right, eleven
percent bottom. One hero subject and one note per view. Labels never cover the
subject. The title lives in the top-left quiet zone; the caption sits in the
bottom safe zone. The subject-safe area is the central 84 percent.

The 1:1 page is a locked sheet: a specimen, a note, a second plate, a mist, a
close. The 16:9 scroll is one continuous world read laterally. The 9:16 page is a
vertical journal page, not a crop of the scroll. Never stretch a page to fit a new
aspect; recompose it.

## Motion & camera

Painting-in is the main motion. In a specimen, progress runs from the first
stroke to the last over 1.2 s or 1.8 s, the director's choice. In a walk, progress
is a function of screen position or a cue, so a form is already painting as it
enters; the camera never pans over a finished painting. Sway begins only after a
form is finished.

The camera grammar is a vocabulary, not a route: a locked sheet for a specimen, a
long lateral pan for a walk, a vertical tilt to measure one object, a slow push-in
to lean into a detail, a pull-back to re-frame the whole sheet. Easings are
`easeOut`, `easeInOut` and `linear`; no bounce, no overshoot, no camera shake.
Allowed transitions are `wipe`, `page_turn` and `hold`; no `cut`, no `dissolve`.

### Native moves

- **Painting-in as reveal.** A new form appears stroke by stroke as it enters.
- **Specimen + note.** One hero object, one leader line, one short hand note.
- **Palette as data.** A sky, ground or background blends by a measured value.
- **Mist erase.** The world washes back to paper; silent, no caption.
- **Painted transformation.** A form cross-fades to a burnt, wet or aged state and
  regrows, never as a photographic dissolve.
- **Handscroll.** One continuous lateral world; the camera move is the argument.

## Sound & silence

Acoustic and gentle: felt piano, fingerpicked guitar, light strings, glockenspiel
or kalimba; no drums. Foley is made from the scene's matter: paper brush rustle for
each paint-in, pencil scratch for notes, a soft page turn, a quiet stamp thump.
Silence is a colour: the brush lifted, music out, paper and room only; use it at
the mist and before the close. Voice is optional, warm and unhurried, one line per
idea. The style supplies no audio files; music and voice are cleared per film.
Mix character: voice forward, music ducked about 4 dB, a short soft reverb.
Delivery loudness belongs to the format, not the style.

## Signature

- **Shot:** a specimen paints in from first stroke to last, with a Caveat note on a leader line; a slow push-in under six percent.
- **Transition:** a brush-edge `wipe` between plates, a `page_turn` between journal pages, and a `hold` at the close; no cut and no dissolve.
- **Texture:** cotton paper fibre at twenty-two percent, pooled wash edges, and dry-brush flying white on wide strokes; no digital grain and no gloss.

Paint-in speed is the director's choice: 1.2 s or 1.8 s per specimen. The card
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

### Authoring log

- **Q: Is the title a series of paragraph cards?** **A:** No. The title is a world
  beginning: a horizon wash, an arch, a stamp, then the title wiped in.
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
