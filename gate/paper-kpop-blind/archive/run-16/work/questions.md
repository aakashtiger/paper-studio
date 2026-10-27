# Questions — FOLD THE LIGHT

The pack answers most of the grammar. These are the points it leaves open, including the one open choice. The route is designed to hold in either `paper-shadow` option; no option is chosen here.

## Open choice — paper-shadow

**Collage or Print?** The director has not answered this. In this film the choice would show in every shot:

- **Shot 1, `paper_open`:** Collage puts a soft contact shadow under the acid sunburst and the gold core; Print keeps both flush on the cream card. The cut edge and the hard type shadow are unchanged.
- **Shot 2, `type_stack`:** Collage lifts the red title card off the paper; Print prints it flat. The cream cut edge stays visible in both.
- **Shot 3, `portrait_iris`:** Collage gives the blue window, the lead's hair/arm plates and the torn red lyric band a contact shadow; Print keeps them flat. The band still sits on the portrait in both.
- **Shot 4, `stage_wide`:** Collage separates the two puppets, the stage floor and the riser; Print relies on silhouette and plate edges. The black meter sticker is HUD; see the HUD question below.
- **Shot 5, `sticker_slam`:** Collage lifts the torn bed and the sticker before the slam; Print lands the sticker flush. The squash and the hard type shadow are unchanged.
- **Shot 6, `pullback_close`:** Collage makes the diorama read as a shallow box; Print makes it a flat cut-out. The torn strip and corner marks are unchanged.

Follow-ups on the choice:

- Does it apply to the HUD? The lyric band is a paper strip, the meter is a sticker and the corner marks are printed ink. The pack says Collage shadows every layer; the HUD is a layer in the layer order. Confirm whether the band and meter cast, and whether the corner marks stay flat ink.
- Does the contact shadow count against the four-colour budget? It is a shadow, not a palette role, but the metric “palette count per frame” needs a ruling.
- Is the choice film-level or per-shot? The governance entry reads as one choice for the film; confirm.
- Where does the contact shadow sit in the layer order? The order lists no shadow layer. Is it a property of each paper layer, or a separate pass under the paper?
- Does the shadow offset scale with the frame or stay in pixels? This film is 9:16 only, so a 9:16 offset would be enough, but the pack does not say.

## Layout and recipe gaps

- **9:16 `names` box.** The box is 0.06 h; at 390 px wide that is 41.6 px. The 9:16 display is 56 px at 0.85 line-height, or 47.6 px. One line does not fit at 56 px. A two-name billing (“Vera Lune and Rhea Voss”, or the pack's own “Lead and Second”) must auto-fit well below display size: roughly 30 px on one line or 24 px on two. Is the box meant to be taller, or is the names line meant to auto-fit below display scale?
- **Close z-order.** `pullback_close` puts the corner marks at z 6.5 and the monogram at z 6. The global layer order is `. . . HUD, type . . .`, so type should be above HUD. They do not overlap in this route, but the contract is inconsistent. Which wins?
- **Sticker fill.** `sticker_slam` sets `body-slam` to paper fill but does not name a fill for `prop.paper-sticker`. A paper-tinted sticker would make the paper type disappear. Is the sticker meant to be red (as planned), blue, acid or accent? Also, in 9:16 the body box is 0.48 w while the nested sticker asset is about 0.35 w; should the body overhang onto the torn bed, or should the sticker fill the 0.60 w box?
- **`stage_wide` body over stage.** In the 16:9 recipe the body line is y 0.76–0.86 and the stage is y 0.20–0.82, so the top of the body sits on the stage. If the stage is blue or red, ink body copy is low contrast. The 9:16 map puts the body below the stage, so this does not hit the film, but the 16:9 composition still carries it. Is the stage meant to be paper under the body, or should the body sit fully below it?
- **`pullback_close` body and strip.** In 16:9 the body is 0.56 w and the torn strip is 0.50 w; in 9:16 both map to `bodyLower`. If the higher-z body nests inside the strip, it becomes 112% of the strip and overflows the 0.88 safe width; if both fill the box, the overhang is lost. Which is intended?
- **Monogram margin.** The 9:16 monogram box is y 0.84–0.90; the bottom margin is 12%, so the safe bottom is 0.88. The monogram is type, not a HUD exception. Is it allowed to sit in the bottom margin as a hand mark, or should the box move up?
- **`stage_wide` burst scale.** The 16:9 `stage-burst` is 0.22 × 0.18; the 9:16 `burst` box is 0.84 × 0.58, and top-level shapes fill their box. Is the burst meant to become a full-stage sun in 9:16, or should it keep its relative scale inside the stage?
- **Halftone precedence and units.** `tokens.medium.halftone.alpha` is 0.5; the recipes set `opacity` 0.18–0.24 and `amount` 0.5–0.6. Do these multiply, or does the recipe override? Are `cellMin`/`cellMax` (14–22) in pixels at 390 width? That is a very coarse screen; is it intended at 9:16?
- **Camera limits.** STYLE limits the open push to under 6% and allows 12% for portrait/macro. `pullback_close` pulls back 12%, `side_scroll_chase` pans 12% and `stage_wide` orbits 6%. Do the push limits apply to pull-back, pan and orbit? Is the 12% pull-back allowed?
- **Iris in.** `paper_open` exits on an iris with a sun; the next shot (`type_stack`) is a rectangular card with no circle. Does the iris need a circular motif in the incoming shot, or is the outgoing sun enough?
- **Match-cut shape.** `type_stack` exits on a `match_cut`; the pack says it repeats a shape but does not name one. The route plans the red title card's rectangle → the portrait's window aperture. Is the aperture a valid match, or should the red field match the red lyric band instead?
- **Body and caption values.** `content.body` is one value across `type_stack` (body), `stage_wide` (lower-third), `sticker_slam` (display) and `pullback_close` (close line). `content.caption` is one value across the portrait lyric band and the stage caption. Is one value per slot intended even when the type role and HUD change? This film uses the same words.

## Brief and delivery gaps

- **`date` and `venue`.** The brief schema has both, but the pack reads only `title`, `subtitle`, `names`, `body`, `caption` and `monogram`. This brief fills both and also puts “The Fold, rooftop, 14 Nov” in `subtitle` so the film can show them. Is that the intended workaround? Should a filled-but-unread `venue` stay in the brief, or be omitted? The same question applies to `date`; `hashtag`, `rsvp` and `photos` are omitted.
- **Billing and cast.** `content.names` is one billing string; this film credits two performers. The portrait is one lead by the pack's rule, the stage has both and the close has no performer. Is a two-name billing over a one-lead portrait correct, or should the portrait show only the lead's name? Does the second rig's “one accent sleeve” use the accent role (making five colours in the stage) or is it role-tinted paper, as planned?
- **Loudness and audio.** The pack says delivery loudness belongs to the format but names no target. Is `-14 LUFS` the intended value, and is there a true-peak ceiling? The pack supplies no audio: is the music an original cleared track, and is the vocal a separate performance track? Who clears the paper foley and the room tone?
- **Caption and voice.** `content.caption` may be a lyric-band line or an event caption, never a third-party lyric. This film uses an original line in both the portrait band and the stage caption. Is it meant to be sung, or only printed? If sung, does the lyric band sync to it? The pack refuses karaoke highlight; is the band a static print in both cases?
- **Sound cue.** The cut into shot 5 can take one beat of silence before the sticker slam; the close can hold on room tone. Are those cues part of the format, or does the director set them per film?

## Four-colour count

- Does the black meter sticker count as `ink` or as a fifth neutral? Does the halftone dot screen count as a colour? Does a Collage contact shadow? The pack's rule is paper + ink + two loud plates; this film uses paper, ink, red, blue, acid and accent across the film but never more than four in a frame. Confirm the count for the meter, halftone and shadow.
