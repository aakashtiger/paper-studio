# Questions — Last Light, The Fold

## The open choice

- **`paper-shadow`: Collage or Print?** The pack leaves it open. Collage gives every paper layer a soft contact shadow and a visible cut edge; Print keeps the layers flat and gives only the type a hard offset shadow. The director has not chosen, so the treatment keeps both possible.
  - **Shot 1, `paper_open`:** Collage lifts the sunburst, core burst and title off the card; Print flattens them into one printed sheet. The type shadow is fixed; what happens to the cut lip under Print is a separate question below.
  - **Shot 3, `portrait_iris`:** Collage gives the portrait, paper window and torn lyric band contact shadows; Print keeps the face and band flat. The iris reads as a paper aperture under Collage and as a printed vignette under Print.
  - **Shot 4, `stage_wide`:** Collage makes the stage, risers and two puppets a shallow diorama; Print makes a flat formation. The two-cast rig does not change.
  - **Shot 5, `sticker_slam`:** Collage lifts the torn bed and the sticker; Print makes the sticker a flat print. The slam itself is unchanged.
  - **Shot 6, `pullback_close`:** Collage reveals a layered diorama; Print reveals a flat cutaway. The pull-back's depth cue changes most here.
  - **Shot 2, `type_stack`:** A type card either way; its ink-card shadow problem is separate (see below).
- **Does the HUD cast under Collage?** The lyric band (shot 3), meter (shot 4) and corner marks (shot 6) are "printed, not floating," but Collage says "every layer." Are the HUD and the type stickers exempt, or do they cast?
- **What keeps the cut edge visible under Print?** The style requires a cream lip and an ink undercut; the card's Print panel shows flat layers and only the type shadow. Is the cream lip still drawn under Print, or does the ink undercut alone carry the edge?

## Content and slots

- **Where does the venue go?** The brief schema has `content.venue`, `date`, `hashtag`, `rsvp` and `photos.*`, but the pack reads only `title`, `subtitle`, `names`, `body`, `caption` and `monogram`. The commission needs "The Fold, rooftop"; is the caption the intended read path, or should the pack read `content.venue`? The brief keeps `venue` as metadata and puts "The Fold" in the caption.
- **Where does a track title go?** The pack says a separate track title goes in `content.subtitle`, but `paper_open` uses the subtitle as a second line and `portrait_iris` uses `content.names` for the artist. With one subtitle and one caption, which gets the track title, the artist and the venue/date? This film leaves the track untitled: subtitle = artist/time, caption = venue/time.
- **Can the lyric band carry a non-lyric?** The commission forbids lyrics; the pack calls the band a lyric band but says it carries `content.caption`. Is a printed venue/time line acceptable in the band, or does the band require a lyric-like line?
- **Is `content.names` for one name or two?** The slot is plural and set in display; the style allows up to two performers. Is a single name ("Vera Lune") acceptable?
- **Is `content.body` a tagline?** The pack says a short printed line, tagline or CTA, one value per film. Is "One take only." acceptable in the `type_stack` body, the `stage_wide` lower third, the `sticker_slam` display and the `pullback_close` close line?

## Format, roles and timing

- **Is `stage_wide` a `list` beat?** It is the only recipe with both `character.lead` and `character.second`, and its only declared beat role is `list`. Is a chorus/formation shot a `list` beat, or is a `stage`/`chorus` role missing from the closed set? The two-cast check is only reachable through a list beat in this route.
- **Is a `transition` beat optional?** The closed roles include `transition`, but the only transition recipe (`side_scroll_chase`) carries one caption slot. Is a transition beat optional in a six-shot route? This route uses `open, title, portrait, list, quote, close` and relies on each recipe's `transitionOut`.
- **Which whole-millisecond tie-break?** The allocation has ties: `paper_open` and `portrait_iris` both have 3.3 s capacity; `type_stack` and `sticker_slam` both have 4.0 s. Does the resolver break ties by sequence order, largest remainder, or cumulative rounding? The application says "in whole milliseconds" but not the tie-break; the treatment's table uses largest remainder and may differ by 1 ms.
- **Where is the first beat?** The grid is 88 BPM with a 0.21 s offset. Does the first beat land 0.21 s after the first frame, or is 0.21 s the offset from the bar line? The treatment plans cuts on the bar; the exact first beat changes the cut placement.
- **Does the plan need beat quantisation before the resolver?** The plan seconds (4.855–5.193 s) are not on the 0.6818 s beat grid. The pack says S2 quantises; confirm the resolver output is deliberately approximate and the lead should not pre-quantise.

## 9:16 re-stage

- **Close corner marks.** `pullback_close` maps `hud.corner-marks` to the `frame` box (x 0.2, y 0.12, w 0.6, h 0.64), not the screen margins. The style says corner marks sit inside the safe margins; is the close meant to frame the diorama or the screen? This changes shot 6.
- **Shared boxes for parent and child.** `sticker_slam` maps both the torn bed and the sticker to the same `sticker` box; `paper_open` maps both the sunburst and the core burst to the same `openSun` box. Are these parent/child pairs handled by the "nested shapes preserve their 16:9 relative inset" rule, or do they collapse? The vertical map has no parent field.
- **Type stack box overlap.** `type_stack` maps the title to y 0.18 h 0.15 and the ink card to y 0.2 h 0.4; the title box starts above the ink card. Does the paper title spill onto the paper field, or should the ink card extend to 0.18? The glyphs may fit, but the boxes overlap.
- **Stage_wide feet.** `stage_wide` maps the stage to y 0.2..0.74 and the two figures to y 0.18..0.62; the feet end 0.12 above the stage box bottom. Is the stage floor at 0.62, or do the figures float? The stage asset has a floor/riser anchor but no separate 9:16 box.

## Type, HUD and colour

- **Type on an ink card.** `type_stack` sets paper type on an ink card. The fixed hard ink shadow has no contrast on the ink field, and the cream lip has little contrast against the paper fill. Is the shadow supposed to switch to paper on ink cards, or should the card be a different role? The style says the shadow is always ink; shot 2 cannot show it. The same applies to the paper caption on the torn ink lyric band in shot 3.
- **Iris and flash timing.** `portrait_iris` has an `effect` kind `iris` at 0.9 and a `transitionOut` of `iris`; `paper_open` also transitions out with `iris`. Is the effect a static vignette/aperture, or does shot 3 carry two irises? `sticker_slam` has a `flash` effect at 0.18; is it a one-frame flash on the slam or a held overlay? The pack says one move and one transition but gives no effect timing.
- **Sticker rotation.** `sticker_slam` rotates the torn bed −3° and the sticker +4°, but the body text and rule carry no rotation. Are they printed on the sticker and rotate with it, or are they separate straight layers over it? The style's sticker is a paper object; the text must not float off its edge.
- **Meter readout.** `stage_wide`'s meter is a black sticker with an acid readout; the pack says it reads "beat and palette" but gives no string. Should it read "88 / DAY", "88 BPM / DAY-STAGE", or a beat count? It is HUD, not a content slot.
- **Second cast plate.** The four-colour budget counts paper and ink plus two loud plates. In shot 4, a red lead and a blue second would make five with the acid burst; the treatment tints the second paper/ink and uses red + acid. Is a second performer allowed to be a non-loud plate, or does the two-cast rig require a distinct costume plate?
