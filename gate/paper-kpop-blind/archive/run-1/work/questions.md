# Questions for the director

These are the questions the pack leaves open for this film. I have not answered `paper-shadow`; that choice is the director's.

## Timing and the resolver

- **Six-shot saturation.** Every recipe in the pack has `duration.max = 5`. Six shots at 5 s is exactly 30 s, so the maximum-duration sum is always 30.0 s and the minimum-duration sum is always below it. The resolver therefore consumes all of its remainder and every shot lands at 5.0 s. Is that intended? The capacity-sharing rule never produces a short shot or a long shot in this format.
- **The beat grid cannot be met by 5.0 s cuts.** At 88 BPM one beat is 0.6818 s, so 5.0 s is 7.333 beats. Cuts at 5, 10, 15, 20 and 25 s fall roughly 0.017 s, 0.245 s, 0.210 s, 0.017 s and 0.245 s away from the nearest beat. The style says cuts land on the beat. Should the edit snap each boundary to the nearest beat (changing the shot lengths), keep the exact 5.0 s boundaries and let in-shot moves carry the beat, or is the 0.21 s offset meant to be applied differently?
- **Whole-millisecond rounding.** The guide says the remainder is shared in whole milliseconds but does not say which shot absorbs a residual millisecond when the capacity shares do not divide evenly. This route divides exactly because the remainder equals total capacity, so the rule is not tested here; a future format with a larger maximum-duration sum would test it.

## Brief, slots and content

- **The brief is invitation-shaped.** The schema offers `date`, `venue`, `rsvp`, `hashtag` and `monogram`, but no song title, release date, city or tour date, ticket link, audio cue, or voice line. Which fields are music-native, and should `rsvp` be omitted for a music Short?
- **What is `content.body`?** It is used as body copy in `type_stack`, as a lower-third line in `stage_wide`, as display type on the sticker in `sticker_slam`, and as body copy in `pullback_close`. Is it a tagline, a lyric line, a call to action or a list? A single value has to work in four different type roles.
- **Caption or lyric band, or both?** `portrait_iris` composes a `caption-line` text and also a `hud.lyric-band` image, but does not pass the caption into the band. Does the caption appear twice, is the band decorative, or is the band meant to receive the caption text?
- **Where does a voice line go?** The style allows one short voice line per idea, but the brief has no voice slot. Is it `content.body`, `content.caption`, or is voice simply not represented in this brief?
- **Photos.** The brief schema has `photos.hero` and `photos.supporting`; the style refuses pasted photographs and no selected recipe uses them. Should the fields be omitted, left empty, or used only as reference for a cut-paper portrait? If reference, how is that path passed?

## The open `paper-shadow` choice

- **Which recipes change?** Collage gives paper layers a soft contact shadow and a visible cut edge; Print keeps layers flat and gives only the type a hard offset shadow. Shots 5 and 6 are the clear cases: `sticker_slam` includes a `shadow` effect and its failure modes list a sticker without a contact shadow as a failure; `pullback_close` includes a `diorama-shadow` shape; `type_stack` also includes a `shadow` effect that may be either the fixed type shadow or a paper shadow. If the director chooses Print, are those recipe shadows suppressed, and is shot 5 then a failure? I have not chosen.
- **Which layers cast?** In Collage, does the type carry both the fixed hard ink shadow and a soft paper contact shadow, or only the hard shadow? The style says "every layer" but also says the type shadow is fixed either way.
- **Shadow at 9:16.** The light is fixed top-left, but the pack gives no paper-shadow offset, softness or angle for the 9:16 re-stage. Does the shadow re-anchor with each vertical box, and at what offset?

## HUD, palette and colour

- **The colour bars are missing.** `STYLE.md` requires a row of six small colour bars, but `capabilities.assets.starterLibrary` has `hud.lyric-band`, `hud.meter` and `hud.corner-marks` only, and no recipe composes a colour-bar row. Is the row a card-only device, or a required film HUD whose asset is absent?
- **Is the HUD global or per recipe?** The lyric band appears only in `portrait_iris`, the meter only in `stage_wide`, and the corner marks only in `pullback_close`. Does every shot carry the full HUD, or only the HUD assets named by its recipe? The style's "which HUD appears" note suggests the latter, but the HUD section reads as a fixed set.
- **Where is the accent swatch, and where is its second appearance?** `STYLE.md` calls for one flat printed accent swatch per frame and says the accent recurs at least twice in a film. No recipe uses the `accent` colour role; the shapes use `acid`, `red` and `ink`. The only explicit accent in the rigs is `character.second`'s accent sleeve, and the second appears only in `stage_wide`. Is the acid the accent, is the accent in the lead's costume, or is a separate accent op missing?
- **Where is the palette declared?** Neither the brief nor the format schema has a palette field. Is `day-stage` / `night-stage` a resolver default, a director parameter, or only a treatment note?
- **How are asset colours bound?** `character.lead`, `character.second` and `set.stage` have no colour fields. In `stage_wide`, the frame can plausibly show paper, ink, acid, blue, red and accent at once, over the four-colour limit. Which four are locked, and by what?

## Composition, 9:16 and motion

- **`stage_wide` body over the cast.** In the 9:16 map, the `body` box is y 0.43–0.59 and the `lead` / `second` boxes are y 0.18–0.62. Body copy spans both performers' torsos. Is that intended, or should the cast be re-staged around the type? The recipe only forbids body over faces.
- **`pullback_close` body position.** The 16:9 body sits at the bottom-left; the 9:16 map sends it to the mid `body` box at y 0.43–0.59, while the monogram goes to y 0.79. Is the close body meant to sit mid-frame over the diorama, or is the map wrong?
- **The 9:16 map is box-only.** Nested shapes that share a box (`paper_open`'s sunburst and core burst; `sticker_slam`'s torn bed and sticker; `pullback_close`'s diorama and shadow) and thin rules mapped to text boxes (`baseline-rule`, `stack-rule`, `slam-rule`, `close-rule`) have no inset, anchor or thickness field. Does the resolver preserve the 16:9 relative placement, or does each op fill its box and cover the other? This affects shots 1, 2, 5 and 6.
- **"One graphic event" versus the recipes.** `paper_open` composes a sunburst and a burst; `sticker_slam` composes a torn bed, a burst, a sticker slap and a flash. Are these each one composite event, or does the "at most one graphic event per shot" rule forbid them?
- **Paper fibre percentage.** `STYLE.md` fixes fibre at 18 percent; the recipes use 0.18 in `paper_open`, 0.14 in `portrait_iris` and 0.16 in `pullback_close`. Is 18 percent a default that recipes may vary, or a hard value?

## Pack inconsistencies

- **12 px or 14 px?** `BRIEF.md` section 8 says twelve pixels minimum at 390 px; `STYLE.md` and `tokens.json` say 14 px. Which governs the film?
- **`sticker_slam` puts `content.body` in display type.** The style's type mapping is closed: title and names use display, body uses body. `sticker_slam`'s `body-slam` uses `typeRole: display`. Is the sticker an allowed display exception, or is the recipe wrong? This changes whether the same body line is Anton on shot 5 and Archivo Black elsewhere.
- **`match_cut` is in the transition vocabulary but not in the brief's list.** `STYLE.md` and `tokens.json` include `match_cut`; `BRIEF.md` section 9 lists only cut, iris, wipe and hold. Is `match_cut` allowed?
- **Which example brief is the blind application meant to differ from?** `BRIEF.md` is a style brief with a one-sentence story, not a content brief. I treated its stage-assembly story as the example and chose a last rooftop soundcheck instead.
