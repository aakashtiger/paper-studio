# Treatment — Last Light, The Fold

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` (2.2–5.5) | open | 4.968 | Cut-paper edge; open sun; iris; accent #1 |
| 2 | `type_stack` (1.5–5.5) | title | 4.855 | Stacked type drop; halftone; hard cut |
| 3 | `portrait_iris` (2.2–5.5) | portrait | 4.968 | Torn lyric band; iris; 9:16 portrait |
| 4 | `stage_wide` (3.4–5.5) | list | 5.161 | Two-cast rig; stage orbit; meter; halftone |
| 5 | `sticker_slam` (1.5–5.5) | quote | 4.855 | Torn bed + sticker; accent #2; type shadow |
| 6 | `pullback_close` (3.6–5.5) | close | 5.193 | Diorama cutaway; corner marks; pull-back/hold |

Plan allocation: minima 14.400 s, target 30.000 s, remainder 15.600 s, capacity 18.600 s. Each shot starts at its minimum and takes 15.600 × (max − min)/18.600, rounded to whole ms. The lead's resolver output governs.

Palette: day-stage. Four roles per shot: 1 paper/ink/acid/accent; 2 paper/ink/acid; 3 paper/ink/red/blue; 4 paper/ink/red/acid; 5 paper/ink/red/accent; 6 paper/ink/blue/acid. Accent only in 1 and 5. HUD: shot 3 lyric band, shot 4 meter, shot 6 corner marks; no other HUD. Light: hard top-left key, no ambient fill; the type shadow is fixed and contact shadows remain the open `paper-shadow` choice. Sound: electronic pop, paper snap/tear/slap/whoosh foley, one beat of silence before the drop, room tone under the close; no audio embedded.

## Grammar check

- **Cut-paper edge:** Shot 1 (`paper_open`) — the open sunburst, core burst and title are separate flat cards with a cream lip and an ink undercut; shot 6 repeats the cut edge on the diorama cutaway.
- **Cream type edge and hard ink shadow:** Shot 1 (`paper_open`) — the display title is ink on the paper card with a cream lip and a hard offset ink duplicate; shot 5 (`sticker_slam`) repeats it with paper display type on the red sticker. Shot 2 (`type_stack`) stacks the type, but its ink card suppresses the ink shadow; see Questions.
- **Torn fibre or sticker:** Shot 5 (`sticker_slam`) — the red torn bed and the sticker's torn edge; shot 3 (`portrait_iris`) carries the torn ink lyric band. Fibre sits at 18% and steps at 12 Hz.
- **Halftone:** Shot 4 (`stage_wide`) — the fixed-angle dot screen under the stage burst and the two figures; shot 2 and shot 5 carry it too. It is a dot screen, not an airbrush.
- **Two-cast rig:** Shot 4 (`stage_wide`) — `character.lead` and `character.second` share the stage, both layered paper puppets with visible eyelet joints, re-staged into the 9:16 `lead` and `second` boxes. No third figure.
- **Beat cut or beat-locked move:** Shot 3 (`portrait_iris`) enters on the hard cut from shot 2, planned on the 88 BPM grid; shot 4's orbit is a flat stage move with no handheld drift. The plan seconds are approximate; S2 quantises.
- **9:16 re-stage:** Shot 4 (`stage_wide`) is the clearest — the 16:9 stage is re-staged into the 9:16 `stage`, `lead`, `second`, `bodyLower` and `meter` boxes, not cropped. Shot 2 re-stacks title and body in the 9:16 column; shot 6 re-anchors the monogram and corner marks.

## Questions

- **`paper-shadow`: Collage or Print?** The pack leaves it open. Collage gives every paper layer a soft contact shadow and a visible cut edge; Print keeps the layers flat and gives only the type a hard offset shadow. Effect: shot 1 lifts the sunburst and title; shot 3 lifts the portrait, window and band; shot 4 makes a diorama stage; shot 5 lifts the bed and sticker; shot 6 reveals a layered diorama; shot 2 is a type card either way. The director has not chosen. Does the HUD also cast under Collage, and under Print is the cream cut lip still drawn or only the ink undercut?
- **Venue and track title.** The brief has `content.venue`, `date`, `hashtag`, `rsvp` and `photos.*`, but the pack reads only title, subtitle, names, body, caption and monogram. Is the caption the intended read path for "The Fold, rooftop," or should the pack read `content.venue`? Where does a track title go when the subtitle already carries the artist and the caption carries the venue?
- **Lyric band, names and body.** Is a printed venue/time line acceptable in the "lyric band" when the commission forbids lyrics? Is `content.names` acceptable for one performer, and is "One take only." acceptable as the one `content.body` value in four different type roles?
- **Two-cast role.** `stage_wide` is the only recipe with both `character.lead` and `character.second`, and its only declared beat role is `list`. Is a chorus/formation shot a `list` beat, or is a `stage`/`chorus` role missing from the closed set? Is a `transition` beat optional in a six-shot route, given that the only transition recipe carries one caption slot?
- **Whole-millisecond allocation.** The allocation has ties: `paper_open` and `portrait_iris` both have 3.3 s capacity; `type_stack` and `sticker_slam` both have 4.0 s. Does the resolver break ties by sequence order, largest remainder, or cumulative rounding? The application says "in whole milliseconds" but not the tie-break; the table uses largest remainder and may differ by 1 ms.
- **Beat grid.** The grid is 88 BPM with a 0.21 s offset. Does the first beat land 0.21 s after the first frame, or is 0.21 s the offset from the bar line? The plan seconds are not on the 0.6818 s grid; does the resolver output need beat quantisation before S2, or is it deliberately approximate?
- **Close corner marks.** `pullback_close` maps `hud.corner-marks` to the `frame` box (x 0.2, y 0.12, w 0.6, h 0.64), not the screen margins. The style says corner marks sit inside the safe margins; is the close meant to frame the diorama or the screen? This changes shot 6.
- **Shared 9:16 boxes.** `sticker_slam` maps both the torn bed and the sticker to the same `sticker` box, and `paper_open` maps both the sunburst and the core burst to the same `openSun` box: are these parent/child pairs handled by the "nested shapes preserve their 16:9 relative inset" rule, or do they collapse?
- **Type stack box overlap.** `type_stack` maps the title to y 0.18 h 0.15 and the ink card to y 0.2 h 0.4, so the title box starts above the ink card: does the paper title spill onto the paper field, or should the ink card extend to 0.18?
- **Stage_wide feet.** `stage_wide` maps the stage to y 0.2..0.74 and the figures to y 0.18..0.62, so the feet end 0.12 above the stage box bottom: is the stage floor at 0.62, or do the figures float?
- **Type on an ink card.** `type_stack` sets paper type on an ink card. The fixed hard ink shadow has no contrast on the ink field, and the cream lip has little contrast against the paper fill. Is the shadow supposed to switch to paper on ink cards, or should the card be a different role? The style says the shadow is always ink; shot 2 cannot show it. The same applies to the paper caption on the torn ink lyric band in shot 3.
- **Iris, flash and meter.** `portrait_iris` has an `effect` kind `iris` at 0.9 and a `transitionOut` of `iris`; `paper_open` also transitions out with `iris`. Is the effect a static vignette/aperture, or does shot 3 carry two irises? `sticker_slam` has a `flash` effect at 0.18: one-frame flash on the slam or held overlay? The `stage_wide` meter reads "beat and palette" but has no string format: is it "88 / DAY", "88 BPM / DAY-STAGE", or a beat count?
- **Sticker rotation.** `sticker_slam` rotates the torn bed −3° and the sticker +4°, but the body text and rule carry no rotation. Are they printed on the sticker and rotate with it, or are they separate straight layers over it? The style's sticker is a paper object; the text must not float off its edge.
- **Second cast plate.** The four-colour budget counts paper and ink plus two loud plates. In shot 4, a red lead and a blue second would make five with the acid burst; the treatment tints the second paper/ink and uses red + acid. Is a second performer allowed to be a non-loud plate, or does the two-cast rig require a distinct costume plate?
