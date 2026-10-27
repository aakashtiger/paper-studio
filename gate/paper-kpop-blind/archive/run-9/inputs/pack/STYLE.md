# Paper K-pop - style contract

**Family:** paper
**Version:** 0.1.0
**Status:** reviewable

## Intent

Paper K-pop is a style for short music films that treat a pop stage as a hand-cut diorama. It is for a song drop, a tour or release announcement, a vertical Short, or any brief that needs a loud graphic hit on a handmade surface. It is not a glossy 3D render, a gold-foil invitation, a clean vector explainer, a scrapbook of nostalgia or a children's craft project.

The film should feel loud, witty, handmade and kinetic: precise cutting, cheap materials, expensive timing. The paper performs. The humour is dry and graphic, never cute. Up to two performers. Eight words per content slot. Four colours in a frame. A 16:9 stage and a 9:16 re-stage. The style does not invent a story, a name, a date, a song line or a venue; those come from the content brief.

## Materials & surface

Flat cut-paper collage on warm cream card. Torn fibres, visible cut edges, halftone dots and printed ink. No brush, no gloss, no 3D, no gradient mesh, no photoreal material. A layer is a flat card with a cream cut edge; a shadow, when it exists, is the shadow of that card. The paper is not a texture map laid over a photograph.

Assets are types, not subjects. A set, character or prop is a role-tinted paper shape, not fixed-colour art: the treatment assigns the four palette roles per shot and the renderer tints the paper, ink and costume plates from them. Drop the accent first if a fifth would appear. One asset can carry a different subject in every film.

The layer order is paper, background, midground, character, foreground, type, HUD, fibre, grain, vignette. Paper fibre sits at eighteen percent. Paper fibre and torn edges step at twelve frames per second, never smoothly, so the surface has a printed boil rather than a video shimmer. Halftone is a dot screen with a fixed angle, not a soft airbrush. Ink is opaque and slightly out of register.

The light is a hard key from the top-left with no ambient fill. The paper may cast a contact shadow if the director chooses Collage; that is the open `paper-shadow` choice. The type always carries a hard misregistered ink shadow, in either choice. There is no soft studio light and no glossy highlight. The cut edge is visible: a lighter cream lip along the cut, a dark ink line under it.

The HUD is per recipe and printed, not floating. `portrait_iris` carries the lyric band in the bottom fourteen percent as a torn ink or red strip, with the caption inside it. `stage_wide` carries the meter top right as a black sticker with an acid readout. `pullback_close` carries four corner marks inside the safe margins. A shot carries only the HUD its recipe names. There is no colour-bar row and no other HUD.

## Colour logic

Six roles: `paper`, `ink`, `red`, `blue`, `acid`, `accent`. Two palettes: `day-stage` and `night-stage`. The default is `day-stage`. At most four colours in a frame.

| Role | Use |
|---|---|
| `paper` | the sheet, the cut edge and the lyric band's reverse |
| `ink` | type, cut lines, torn edges and the type shadow |
| `red` | one loud plate: a jacket, a sun, a burst |
| `blue` | the second plate: a shadow side, a corridor or a stage wall |
| `acid` | the meter readout, one flash or one sticker edge |
| `accent` | a rotating third: gold, pink or a second paper stock |

The frame budget is paper and ink plus two of red, blue, acid and accent. Day-stage is warm cream, tomato red, cobalt blue and acid green-yellow. Night-stage is older cream, deeper ink, oxblood red, ink blue, the same acid and a pink accent. Night is not a filter over day; it is a second paper stock and ink set. The palette is a director choice, default `day-stage`; it is not a resolver field, so the treatment names it. The accent recurs at least twice in a film, not in every frame; `paper_open` and `sticker_slam` carry it. The four-colour budget counts paper, ink and the two loudest plates; character costumes and stage paint are part of those plates, not extra roles. If a fifth would appear, drop the accent first. Colour is cut, never blended: four flat plates, clean edges, no gradient.

## Type & lettering

- **Display:** Anton, for titles and huge stacked words.
- **Body:** Archivo Black, for subtitles, names, readable prose and stickers.
- **Caption:** DM Mono Regular, for lyric band, caption and timecode.
- **Label:** DM Mono Medium, for measured labels and meter text.
- **Monogram:** Permanent Marker, for the hand mark.

The mapping is closed: title and names use display; subtitle and caption use caption; body uses body, except `sticker_slam` may set `content.body` in display for the quote; date, venue and meter use label; monogram uses monogram. There is no fifth family. The type is a paper object: a cream cut edge, a hard misregistered ink shadow, per-character seeded jitter, a twelve Hz step boil and one flat printed accent swatch where a frame uses the accent role. The accent uses the `accent` role, never a bevel, never a reflection, never a second gloss. Display is ragged and stacked; each line breaks where the paper would cut, not where a text box ends.

Scale at 16:9: display 64, body 26, caption 18, label 14, monogram 36; display line 0.85, body line 1.05, caption line 1.2. At 9:16: display 56, body 24, caption 16, label 14, monogram 32. The scale is authored for a 390 px-wide frame; larger frames scale proportionally and the 14 px floor holds. Eight words maximum per content slot, two lines maximum in the lyric band. No full-frame lyric wall, no karaoke highlight, no all-caps paragraph. Latin script only in this pilot; a non-Latin commission needs a licensed companion face, never a silent fallback.

## Composition & framing

Margins: six percent top, six percent left and right, twelve percent bottom. The safe area is the central eighty-eight percent. Shapes are `card`, `torn-strip`, `sticker`, `sunburst`, `circle`, `rule`, `frame`, `arrow` and `burst`. A frame has one stage, one subject and one graphic event. The stage can be `set.stage` for a wide formation, `set.tabletop` for a macro prop, `set.corridor` for a lateral chase or `set.diorama` for a pull-back close.

Title and body stack centrally. At 9:16, use the boxes in `tokens.layout.aspectBoxes.9:16`; title sits at the upper centre and body below it, with subtitle, names, caption and monogram following in the same column. The 9:16 map is a set of anchors, not stretch boxes: images fill with cover, text auto-fits, rules align to the lower edge of their box and keep 1.5-2 px thickness, and nested shapes keep their 16:9 relative inset. The rules are in `tokens.layout.aspectRules.9:16`. The 9:16 frame is a re-stage, not a crop. Centre sixty percent, re-stage both performers, keep the type stack in the middle and re-anchor the HUD. The 16:9 stage is wider and lower; the 9:16 stage is taller and more frontal. Never stretch a 16:9 composition into 9:16.

The HUD lives inside the print: the lyric band in the bottom fourteen percent, the meter top right, corner marks in the margins. The lyric band is a HUD exception to the 12% bottom text margin; its caption still obeys the eight-word limit. The lyric band never covers a face. The meter is a sticker, not a glass panel. Corner marks are short L marks, not a full frame. A graphic event is one cluster: an open sun (sunburst, core and rule), a sticker slam (torn bed, sticker and burst), a type drop or a stage formation. One cluster per shot; the cluster may contain the shapes it needs.

## Motion & camera

The grid is 88 BPM with a 0.21 second offset and a four-beat bar. Cuts are planned on the beat; the resolver's shot lengths are approximate plan values, and S2 quantises them to the 88 BPM grid. The camera moves are static, push_in, pull_back, pan, tilt and orbit; the default is static. No handheld, no wobble, no shake. The open push is under six percent; a portrait iris or macro prop may push to twelve percent. An orbit goes around a paper stage, not around a modelled body.

The recipe's top-level `camera` and `transitionOut` are the resolved shot contract. The composition `camera` and `transition` ops repeat the same values as render hints; the renderer applies one move and one transition, never both. A recipe whose two values differ is invalid.

Easings are easeOut, easeInOut, easeIn, backOut and linear. Physics are ease, squash, overshoot and anticipation. Paper squashes on impact, overshoots the beat by a few frames, anticipates before a snap and settles. The `motion.paper` block fixes squash 0.12, overshoot 0.18, anticipation 0.1 and fibreBoilHz 12. Transitions are cut, iris, wipe, hold and match_cut. The minimum shot is 1.2 seconds; a recipe may run to 5.5 seconds for a music cut. A paper tear is a wipe, not a dissolve. An iris opens on a face, a sun or a circle; a match_cut repeats a shape across two stages; a hold lets the last frame sit.

The native moves are a paper snap, a sticker slam, a stacked type drop, a stage orbit, a lateral chase and a diorama pull-back. A snap is one frame of anticipation and one frame of contact. A sticker slam lands flat with a squash and no bounce. A type drop stacks from the bottom line up. An orbit keeps the stage flat and moves the camera, never the paper. A chase is a lateral scroll with a wipe. A pull-back reveals the diorama and ends on a hold.

## Sound & silence

Electronic pop: synth bass, clipped drums, brass stabs, vocal chops and a bright top line. The foley is paper: a snap, a tear, a slap and a whoosh. The foley is the material, not a cartoon sweetener. A cut may be silent for a frame; a drop may take one beat of silence first. The close may hold on room tone. Voice is optional, one short line per idea, never a lyric wall; it is a performance track, not a brief slot. The style supplies no audio files; music and voice are cleared per film, and delivery loudness belongs to the format. Mix character: voice forward, music ducked about 4 dB, short bright reverb. No audio is embedded in this pack.

## Signature

- **Shot:** a paper stage snaps into place around one or two cut-paper performers; the display stack lands line by line on the beat, one flat accent catches the key, and the camera holds or pushes with the style's open and portrait limits.
- **Transition:** a hard `cut` on the beat, an `iris` on a face or a sun, a torn `wipe` between stages, a `match_cut` on a repeated shape and a `hold` at the close.
- **Texture:** paper fibre at eighteen percent, torn cut edges, a fixed halftone dot and a hard misregistered ink shadow; no gloss and no 3D.

Paper shadow is the one open choice, `paper-shadow`: Collage gives every layer a soft contact shadow and a visible cut edge; Print keeps the layers flat and gives only the type a hard offset shadow. This brief does not answer it. The card shows both at 390 px. The type shadow is fixed either way.

## Refusals

- No glossy 3D, bevel, reflective chrome, metal or soft studio light. One flat printed accent swatch is allowed.
- No gold foil, lace, serif wedding type or ceremonial layout.
- No soft brush, airbrush, gradient mesh or clean vector illustration.
- No dissolve, camera shake, handheld drift or wobble.
- No more than two performers.
- No more than four colours in a frame.
- No more than eight words in a content slot.
- No full-frame lyric wall and no karaoke highlight.
- No photographic faces, stock-photo smiles or pasted photographs.
- No cute children's craft, pom-poms, googly eyes or scrapbook nostalgia.
- No type smaller than 14 px at 390 px width.
- No paper texture laid over a 3D scene.
- No style that needs a renderer before it can be judged.

## Not for

- Photo-led weddings, family archives and memorial films.
- Corporate explainers, product launches and advertorials.
- Civic ceremony films and formal institutional work.
- Children's books, cute animal stories and classroom craft.
- Briefs that need Devanagari, Arabic, CJK or another non-Latin script.
- Long-form documentary, slow cinema or a quiet acoustic register.

## Questions

### Variation space

The director decides the subject, the song, the cast, the palette (day-stage or night-stage), which HUD appears, the cut pattern, the opening and the close. The pack fixes the grammar, not the story. The proven structures are a 16:9 stage, a 9:16 re-stage and a sealed 9:16 blind application. The two-cast grammar is the `stage_wide` formation; the portrait and close are one lead. A two-cast portrait is a future recipe, not a silent variant of this one.

### Questions for the director

1. Is the paper a diorama or a print? The `paper-shadow` choice is open: Collage or Print. A paper stage with contact shadows and visible cut edges reads as a diorama; a flat layer with only the type shadow reads as a print.
2. Can a photograph stand in for a face? No. A photograph may be reference for a cut-paper portrait, never a pasted layer.
3. How much can the HUD say? One caption line in the lyric band, eight words maximum. The meter reads beat and palette, not a second paragraph.
4. What is `content.body`? A short printed line, tagline or call to action. `type_stack` sets it as body, `stage_wide` as a lower-third, `sticker_slam` as display and `pullback_close` as a close line. It is one value per film, not four different lines.
5. Where does voice go? Voice is a performance track, not a content slot; it is cleared per film and mixed against the same brief.
6. Which brief fields does this pack read? `title`, `subtitle`, `names`, `body`, `caption` and `monogram`. `date`, `venue`, `hashtag`, `rsvp` and `photos.*` are not read; a release date or city goes in `subtitle` or `caption`, and there is no photo slot. `content.title` is the film title; a separate track title goes in `subtitle`. BPM and loudness live in `tokens.json` and the format, not the brief.
7. What colour is the text? The treatment fixes the cream edge and hard ink shadow; the fill is a palette role per recipe. On a red field the fill is paper; on paper it is ink. An ink field is not used behind paper type, because the ink shadow would disappear. The recipe names the fill.

### Decisions

- **Source exclusion.** The author's film is read-only evidence. No story, lyrics, character names, audio or shot order is reused. The six cropped stills are visual evidence only, never a rendered asset.
- **Palette roles.** `paper`, `ink`, `red`, `blue`, `acid` and `accent`; day-stage and night-stage; at most four colours in a frame.
- **Type quartet.** Anton, Archivo Black, DM Mono and Permanent Marker across five fixed roles.
- **Transition set.** `cut`, `iris`, `wipe`, `hold` and `match_cut`. No dissolve.
- **Format structure.** 16:9 at 45 s and 14 shots; 9:16 at 30 s and 8 shots; a 9:16 blind application at 30 s and 6 shots.
- **9:16 re-stage.** Centre sixty percent, stack title and body, re-stage both performers and re-anchor the HUD.
- **HUD.** Per recipe: the portrait carries a torn ink or red lyric band with the caption inside it, the stage carries a black sticker meter with an acid readout, the close carries corner marks. No colour-bar row and no other HUD.
- **Shadow neutrality.** Recipes carry no contact shadow; the fixed hard type shadow is the only shadow they name. The renderer adds a paper contact shadow only under Collage.
- **Timing.** The resolver's seconds are plan values; the 88 BPM grid and frame-exact cut quantisation are S2.
- **Independence.** The pack is self-contained: no other style, no external asset, no network and no drive path.
- **Deferred renderer.** No renderer, frame or MP4 in this pack. Proof is definition-level.
- **Blind protocol.** A fresh author carries out a sealed 6-shot, 30 s, 9:16 application without editing the pack.

### Authoring log

- **Q:** Is a paper performer a puppet or a 3D model? **A:** A layered paper puppet on visible eyelet joints. The face, hair, hands and feet are anchors, not modelled geometry.
- **Q:** How does the type sit on the paper? **A:** As a printed sticker with a cream cut edge, a hard misregistered ink shadow, a seeded per-character jitter and a twelve Hz step boil.
- **Q:** Is the accent a render? **A:** No. It is one flat printed swatch in the accent role where a frame uses it, never a bevel or a reflection.
- **Q:** Can the lyric band carry a full lyric? **A:** No. One line, eight words maximum, in the caption slot, on a torn ink or red strip.
- **Q:** Can the paper cast a shadow? **A:** The director chooses Collage or Print. This brief leaves `paper-shadow` open. The recipes name only the fixed type shadow; a paper contact shadow is added only under Collage.
- **Q:** Can a photograph appear? **A:** No. A photograph may be reference for a cut-paper portrait, never a pasted layer.
