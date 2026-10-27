# Treatment — FOLDLIGHT

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 4.968 | Night-stage cut-paper roof: acid sunburst and accent core; ink title with cream edge and hard offset shadow; 0.99→1.04 push; iris out on the sun. |
| 2 | `type_stack` | title | 4.855 | Red title card; stacked Anton title and body; acid rule; halftone at 22%; static beat cut. |
| 3 | `portrait_iris` | portrait | 4.968 | Vera Lune in a cut-paper window; layered hair and eyelet joints; red lyric band with caption; iris out; 9:16 portrait anchors. |
| 4 | `stage_wide` | list | 5.161 | Two-cast stage: lead and second on separate 9:16 anchors; blue stage, acid burst, black sticker meter; orbit 1→1.06; beat cut. |
| 5 | `sticker_slam` | quote | 4.855 | Torn red bed, ink paper sticker, accent burst; paper body in display; halftone at 24%; sticker slam; cut. |
| 6 | `pullback_close` | close | 5.193 | Diorama pull-back 1.12→1; monogram VL; ink corner marks; acid rule; hold. |

Fit: 14.400 s minima, 33.000 s maxima; 15.600 s shared by capacity. Palette: night-stage. Cast: Vera Lune plus one unnamed second. Accent: shots 1 and 5.

## Grammar check

- **Cut-paper edge:** Shot 1's sun and title, shot 4's stage and both figures, and shot 6's diorama all show the cream lip and dark ink cut line; no soft edge.
- **Cream type edge and hard ink shadow:** Shot 2's stacked FOLDLIGHT and body, shot 5's display body, and the same fixed offset on shot 3's names and shot 6's monogram.
- **Torn fibre or sticker:** Shot 5: torn red bed, ink paper sticker with a peel corner and accent burst; shots 1 and 6 keep the 18% fibre boil.
- **Halftone:** Shot 2 at 22%, shot 4 at 18%, shot 5 at 24%; fixed dot screen under the type.
- **Two-cast rig:** Shot 4: lead and second are two separate eyelet-jointed paper rigs, mapped to the lead/second boxes inside the central 60%; no third figure.
- **Beat cut or beat-locked move:** Shot 4's 88 BPM orbit and cut into shot 5's sticker slam; shot 1's push ends on an iris.
- **9:16 re-stage:** Shot 4: `stage_wide`'s vertical map re-stages both cast into the central 60% and re-anchors the meter to the top-right box; not a crop. Shot 3's portrait, frame and lyric boxes are the other re-stage.

## Questions

- **`paper-shadow` (open choice).** Collage would give every cut layer a soft contact shadow and make the rooftop read as a built diorama; Print would keep the same visible cut edges but only the type would cast, so the film reads as a printed poster. The choice changes the depth of shots 1, 3, 4, 5 and 6, and whether the HUD (lyric band, meter sticker, corner marks) also casts. The hard type shadow is fixed either way. The director has not answered, and this treatment does not choose.
- **Palette carriage.** The treatment names night-stage, but `day-stage`/`night-stage` is a director choice and not a resolver field. Is a line in the treatment enough, or must the brief or format carry it? If not, how does the resolver know which paper stock to use?
- **Sequence validity and `list`.** The pack closes the eight roles but gives no order, repetition or completeness rule. Is `open → title → portrait → list → quote → close` valid, and may `list` be a two-cast stage? `stage_wide` declares `list` but has no list slot; its `content.body` and `content.caption` are single values.
- **Recipe literals vs treatment tinting.** `STYLE.md` says the treatment assigns the four palette roles per shot and assets are role-tinted, but recipes hardcode colours (for example `paper_open` has an acid sunburst and accent core; `stage_wide` has an acid burst). Which wins if a treatment wants a different plate?
- **Colour budget.** Is the meter's acid readout a frame colour, and is its black sticker `ink`? Does a role count once or once per asset? Is the accent's “at least twice” counted by shot or by visible swatch, and is a route without `paper_open` or `sticker_slam` invalid?
- **Transition seam.** Does a shot play its own `transitionOut`, the next recipe's entrance `effect`, or both? `portrait_iris` carries both an `effect` of kind `iris` and `transitionOut: "iris"`; `paper_open` also exits on an iris. The precedence decision covers camera and transition ops, not effect-vs-transition.
- **Beat quantisation.** The resolver's seconds are plan values and the 88 BPM grid is S2. Are the returned seconds pre- or post-quantisation? Where does the 0.21 s offset land, and is rounding cumulative across six cuts?
- **Word counting.** What counts as a word for the eight-word limit: punctuation-attached tokens, numerals, slashes, hyphenated names, the monogram? Is `THE FOLD, ROOFTOP` three words or four?
- **Slot reuse.** One `content.caption` must serve the portrait's lyric band and the stage lower-third; one `content.body` is body, lower-third, display and close line across four recipes. Must each line be short enough for the tightest box (the sticker's 0.6 × 0.16 display box), or may auto-fit shrink it below the display scale while holding the 14 px floor?
- **Meter readout.** “Beat count and four-role bar … generated from the plan”: is the count per shot or global, and does the bar show the roles in that frame or the film's palette?
- **Loudness.** The format carries `-14 LUFS`. The pack says delivery loudness belongs to the format but gives no integrated target, true-peak ceiling or measurement method. Is -14 LUFS the intended value, and is the metadata advisory only?
- **9:16 orbit.** `stage_wide` keeps the 16:9 orbit 1→1.06 on the 9:16 re-stage. Should the orbit centre on the two-cast pair in the central 60% or on the stage box, and does the orbit preserve the “no handheld” rule at that scale?
- **Card/SOURCES mismatch (pack defect).** `SOURCES.md` says the card uses portrait, chorus-stage and macro-prop; `card.html` actually shows portrait-paper-cast (00:03), throne-orbit (00:14) and open-sunflower (00:00). Which set is the evidence of record? The card's own aria-label agrees with its images, not with `SOURCES.md`.
- **Date/venue type mapping (pack inconsistency).** `STYLE.md` says date, venue and meter use label, but `capabilities.slots` says date and venue are not read and no recipe has those slots. Is the mapping stale, or is there an unlisted date/venue slot?
