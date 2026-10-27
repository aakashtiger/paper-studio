# Treatment — Understudy Check

## Route

Vera Lune's last soundcheck at The Fold, rooftop, before the doors open. Her paper understudy holds the second position: same silhouette, no separate billing. Night-stage palette under a hard top-left key, no fill; six shots, 30.000 s, 9:16 re-stage. Sound: 88 BPM electronic pop and paper foley, one beat of silence before the Shot 5 slam, room tone under the Shot 6 hold.

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 5.000 | Acid sun and cut-paper sheet; 9:16 title stack. |
| 2 | `type_stack` | title | 5.000 | Cream type edge, hard ink shadow, halftone; hard cut out. |
| 3 | `portrait_iris` | portrait | 5.000 | Cut-paper portrait, torn lyric band, 9:16 re-stage. |
| 4 | `stage_wide` | list | 5.000 | Two-cast rig, beat-locked orbit, meter. |
| 5 | `sticker_slam` | quote | 5.000 | Torn bed and sticker, display slam, accent. |
| 6 | `pullback_close` | close | 5.000 | Diorama pull-back, corner marks, hold. |

**Timing.** The six minima sum to 14.400 s and the six maxima sum to 30.000 s. The 30.000 s target leaves 15.600 s, and the recipes have exactly 15.600 s of remaining capacity, so every shot receives 100% of its capacity and lands at its 5.000 s maximum. This is the capacity rule, not an equal split; with every maximum at 5.000 s, the six-shot target consumes all of it.

**Palette.** Night-stage. At most four roles in a frame: Shot 1 paper+ink+acid+accent; 2 paper+ink+acid; 3 paper+ink+oxblood; 4 paper+ink+acid+oxblood; 5 paper+ink+oxblood+accent; 6 paper+ink+acid+ink blue. Accent appears only in Shots 1 and 5. In Shot 4 Vera and the understudy share the oxblood plate; the understudy's sleeve is a darker cut of the same plate, not a fifth colour.

**Type and HUD.** At 9:16: Anton display 56, Archivo Black body 24, DM Mono caption 16 and label 14, Permanent Marker monogram 32. HUD is printed into the sheet and only where the recipe names it: the torn lyric band in Shot 3, the acid meter in Shot 4, the corner marks in Shot 6.

**Cut.** Shot 1 is the poster: the acid sun cuts over cream, the title and subtitle stack. Shot 2 repeats the title on an ink card, stacks it line by line, and lands the body line. Shot 3 is Vera in the paper window, lyric band below. Shot 4 opens to the rooftop stage with both figures. Shot 5 slams the body line as a display sticker and lands flat with a squash, no bounce. Shot 6 pulls back to the rooftop diorama, the folded setlist at its centre, and holds on the monogram.

## Grammar check

- **Cut-paper edge:** Shot 1 (`paper_open`): the acid sunburst and its accent core are separate cut plates with a lighter cream lip and a dark ink line; the cream card is the sheet behind them. The edge is authored, not feathered; the open `paper-shadow` choice only changes whether it also casts a contact shadow.
- **Cream type edge and hard ink shadow:** Shot 2 (`type_stack`): `UNDERSTUDY CHECK` and `Doors at eight.` sit on the ink card with cream cut edges and one fixed down-right ink shadow. The shadow is identical under either paper-shadow choice.
- **Torn fibre or sticker:** Shot 5 (`sticker_slam`): the oxblood bed is a torn strip; the sticker lands with its peel edge, cut edge and hard type shadow. Shot 3's lyric band is the torn ink strip with paper fibre at 18%.
- **Halftone:** Shot 2 (`type_stack`): a fixed-angle dot screen at 0.22 opacity / 0.55 amount over the card; it repeats in Shot 4 at 0.18, never as airbrush.
- **Two-cast rig:** Shot 4 (`stage_wide`): Vera (lead) and her paper understudy (second) are two layered puppets with visible eyelet joints and different shoulder and hair plates; no third figure. Both wear oxblood; the understudy's sleeve is a darker plate, not the accent role.
- **Beat cut or beat-locked move:** Shot 4 (`stage_wide`): the orbit runs 1.00→1.06 on easeInOut against the 88 BPM bar. The hard cuts at 2→3, 4→5 and 5→6 are beat cuts; the irises at 1→2 and 3→4 and the close hold are the other transitions. S2 quantises the 5.000 plan values to the grid.
- **9:16 re-stage:** Shot 3 (`portrait_iris`): portrait 0.17/0.15/0.66/0.60, names 0.61, lyric band 0.86; the window and figure are re-composed taller, not centre-cropped. Shot 4 uses the separate lead 0.08–0.36 and second 0.58–0.86 anchors, with the meter at 0.70/0.06 and body at 0.64; the pair is re-staged, not a crop of the 16:9 stage.

## Questions

- **`paper-shadow` is open.** Collage gives every layer a soft contact shadow, so Shots 4 and 6 read as a stacked set; Print keeps them flat and gives only the type its hard offset shadow. This changes depth in all six shots. Which one? Under Print, does the cut edge still keep the cream lip and ink line, or only the type gets an edge?
- **The six-shot timing is forced.** Every recipe maximum is 5.000 s, so six shots at 30.000 s leave no capacity for variation; all six land at 5.000 s. Is that intended, or should a recipe maximum be below 5.000 s?
- **Which box edge do 9:16 rules align to?** `aspectRules.9:16` says "align to the box edge" but not top or bottom. `sticker_slam`'s `slam-rule` mapped to `body` crosses the sticker text on top-edge alignment; `pullback_close`'s `close-rule` sits far above its body. Bottom-edge alignment fixes both. Which is canonical?
- **Is `stage_wide`'s lead inside the central 60%?** The 9:16 map puts lead at x 0.08–0.36 and second at 0.58–0.86; the central 60% is 0.20–0.80. Is the rule about the hero's face or the full rig? If the full rig, the map is outside it.
- **Dead brief slots.** `content.date`, `content.venue`, `content.hashtag`, `content.rsvp` and both `photos` fields exist in the brief schema, but no recipe has a slot or asset for them. Should they be omitted, or carried inside `content.body`? This route cannot use the dedicated date, venue, hashtag or RSVP slots; the venue appears only as subtitle copy.
- **One caption, two registers.** `content.caption` is the portrait lyric-band line and the stage lower-third. Should it read as a lyric, a caption, or a line that works as both? The pack fixes one value, not the register.
- **One body, four contexts.** `content.body` is a type-stack body, a stage lower-third, a sticker display and a close line. Is it a CTA, a tagline or a show announcement? The pack fixes one value, not its tone.
- **The second rig's accent sleeve.** The rig calls for "one accent sleeve"; `stage_wide` already carries an acid burst, a meter and two costume plates. At four colours, may the sleeve be a darker oxblood plate, or must it be the `accent` role, which would add a fifth plate?
- **Voice and music.** Voice is optional and not a brief slot; the pack supplies no audio and says delivery loudness belongs to the format, but this format schema has no loudness field. Is there a voice line, who clears it, and what delivery spec applies?
- **Beat quantisation versus 30.000 s.** At 88 BPM with the 0.21 s offset, 5.000 s is about 7.02 beats. After S2 quantises the cuts, does the film stay exactly 30.000 s, and which shot absorbs the drift?
- **Palette sign-off.** I chose night-stage for the pre-doors rooftop; the pack default is day-stage. Is night-stage the intended read, or should the default hold?

The full list, including date format, image fit, lyric-band height, sticker display fit and photo-reference questions, is in `questions.md`.
