# Questions — Six Floors Up

The pack answers the grammar, the type families, the palette roles, the HUD ownership and the 9:16 re-stage. These are the questions it leaves open for this film. None of them changes the six-shot route or the 14.4–33.0 s fit.

## The open choice

### 1. `paper-shadow`: Collage or Print?

Which option does the director choose?

- **Collage:** every paper layer gets a soft contact shadow and a visible cut edge. The stage reads as a diorama.
- **Print:** the layers stay flat. Only the type carries the hard offset shadow. The stage reads as a print.

**Effect on this film.** Every shot changes: the sun/core in Shot 1, the ink card in Shot 2, the portrait/window in Shot 3, the cast/floor contact in Shot 4, the sticker/torn bed in Shot 5 and the diorama/prop in Shot 6. The route, the cream type edge, the hard ink shadow, the palette, the word count and the timing do not change.

The light block also carries `softness: 0.5` and `opacity: 0.2`. Do those values apply only under Collage? Print is described as flat, so they cannot apply there. The pack does not say.

The treatment is written to work under either option. It does not answer the choice.

## Director choices

### 2. Palette: day-stage or night-stage?

The pack defaults to day-stage. This treatment proposes night-stage for the 21:00 rooftop. Night-stage swaps the paper stock and ink set and makes the accent pink; day-stage would make it gold. Which palette should the film use?

### 3. Title, track and voice

The brief has one `content.title` and no separate song-title, BPM or audio field. Is `SIX FLOORS UP` the film title, the track title, or both? `paper_open` and `type_stack` both read the title, so it lands twice in six shots; is that intended as a refrain, or should one title beat change?

The pack supplies no audio and says music and voice are cleared per film. What is the cleared 88 BPM track, who supplies it, and is the caption performed as a voice line or printed only? Delivery loudness is also unset.

## Pack gaps

### 4. Second performer

The pack has one `content.names` slot, and only `portrait_iris` reads it. `stage_wide` shows a second figure with no second-name slot. Who is the second — a foil, a witness, a partner — and should she be named? The treatment leaves her unnamed and gives her one answering arm line.

### 5. Colour specification

The starter library gives anchors, not colours. What colours are `set.paper-card`, `set.stage`, `set.diorama`, `prop.object`, `frame.paper-window`, `character.lead` and `character.second`?

In `stage_wide`, the fixed acid burst and acid meter, the second's “one accent sleeve” and an ink-blue stage would be five roles: paper, ink, blue, acid and accent. The style says to drop the accent first, which would remove the sleeve. Is the stage meant to be ink (keeping the sleeve) or blue (dropping the accent)? The treatment chooses ink to keep the sleeve. Is that the intended reading?

The text ops also have no colour. The type treatment fixes a cream cut edge and a hard ink shadow but not the fill. Should the fill auto-contrast — ink on paper, cream on ink — or is it fixed? The treatment assumes auto-contrast so the cream lip and ink shadow stay visible on both the ink card and the paper.

Does the accent swatch attach to the type, or is the recipe's accent shape enough? The style says the type carries one flat printed accent swatch where a frame uses the accent role; the recipes put the accent in a shape.

### 6. The 9:16 safe area

`tokens.layout.margins.bottom` is `0.12`, so the safe area ends at `0.88`. But `aspectBoxes.9:16.lyric` is `y 0.86, h 0.10` (to `0.96`), and `monogram` is `y 0.84, h 0.06` (to `0.90`). The style also calls the lyric band “bottom 14%” while the box is 10% high. Which wins: the 12% margin, the 14% band or the authored boxes? As written, the lyric band and monogram extend outside the stated safe area.

`pullback_close` maps `corner-marks` to the `frame` box (`0.2, 0.12, 0.6, 0.64`), not the outer safe margins. Are the marks now a frame around the diorama, or should they stay at the outer edge?

### 7. Meter copy

The meter is a black sticker with an acid readout that “reads beat and palette”, but the pack gives no copy slot, format or update rule. Should it read `88 BPM / NIGHT`, a bar count, a level, or something else? Does it change per shot?

### 8. Duplicate camera and transition definitions

Every recipe declares the camera twice — a top-level `camera` field and a composition `camera` op — and the transition twice — `transitionOut` and a composition `transition` op. Which is authoritative?

If both apply, the moves double: `paper_open`'s `0.99 → 1.04` push becomes about 10% (over the 6% open limit) and `portrait_iris`'s `1 → 1.12` push becomes about 25% (over the 12% portrait limit). The treatment assumes the composition op is the move and the top-level field is metadata. Is that correct?

### 9. Top-level shapes in 9:16

`aspectRules.9:16` explains nested shapes but not top-level shapes. Does a top-level shape fill its 9:16 box, cover it, or keep its 16:9 scale?

`stage_wide`'s `stage-burst` maps to a `burst` box `0.84 × 0.58`, much larger than its 16:9 footprint (`0.22 × 0.18`). If it fills, it becomes a full-stage sun, not a small burst. Which is intended?

### 10. `portrait_iris` mask and effect

The recipe names both a `circle` shape `iris-mask` (stroke ink, opacity `0.35`) and an `effect: iris` (opacity `0.9`), plus a `transition: iris`. Is the circle a visible ink ring, the aperture itself, or a guide? How do the shape and effect interact, and does the effect at `z 9` sit over the names and caption at `z 8`?

### 11. `sticker_slam` flash

The recipe has a `flash` effect at `0.18` with no colour role. Is it paper, acid or accent? A white flash would add a fifth colour and read as gloss, which the style refuses.

### 12. Close object and rooftop set

The pack gives a generic `prop.object` (grip point, contact mark) and a generic `set.diorama` (back wall, cutaway edge). Is a paper roof key as the close object allowed, and may `set.diorama` carry bespoke rooftop dressing — water tank, aerial, stair door, city blocks — or is it a fixed generic set?

### 13. Venue and unread fields

The pack reads only `title`, `subtitle`, `names`, `body`, `caption` and `monogram`; it does not read `date`, `venue`, `hashtag`, `rsvp` or `photos.*`. The treatment puts the venue in `content.subtitle` (Shot 1) and the soundcheck line in `content.caption` (Shots 3–4). Is that the right split, or should the venue move to the lyric band? Should the unread fields be left empty or carried as production context?

### 14. Plan seconds and the beat grid

The treatment's seconds are plan values. The pack says S2 quantises to the 88 BPM grid but gives no frame-exact cut map. Should the six cuts be mapped to specific beats now, or left as plan values for S2? The fit is 14.4 s minimum, 33.0 s maximum; the resolver sets the exact milliseconds.
