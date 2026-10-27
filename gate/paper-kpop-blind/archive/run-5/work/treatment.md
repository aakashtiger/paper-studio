# Treatment — Six Floors Up

## Route

A last rooftop soundcheck at The Fold: the stage assembles, Vera Lune's portrait lands, the two-cast formation holds, the tagline slams and the diorama pulls back on a paper roof key.

- **Palette:** night-stage (proposed; the pack default is day-stage).
- **Grid:** 88 BPM, four-beat bar, 0.21 s offset; two performers.
- **Sequence:** opening → title → portrait → formation → tagline → closing; roles open → title → portrait → list → quote → close.
- **Colour:** Shot 4 holds four roles (paper, ink, acid, pink accent) by making the stage an ink plate; the oxblood plate is the portrait window (3) and the sticker bed (5); the diorama back wall is ink blue (6). The pink accent recurs in Shots 1, 4 and 5.
- **HUD:** lyric band (Shot 3), meter (Shot 4), corner marks (Shot 6); Shots 1, 2 and 5 carry none.
- **Refrain:** body “ONE MORE PASS” as body copy (2), lower third (4), display slam (5), close line (6).
- **Sound:** electronic pop at 88 BPM; paper snap/tear/slap on the cuts; one beat of silence before Shot 5's slam; room tone under the close.
- **Fit:** minimums 14.4 s, maximums 33.0 s; the 15.6 s remainder is shared by capacity (3.3 / 4.0 / 3.3 / 2.1 / 4.0 / 1.9). Seconds are plan values; the resolver sets exact milliseconds, and S2 quantises to the beat.

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 4.97 | Paper sun and cut title; cream edge, hard ink shadow; iris out. |
| 2 | `type_stack` | title | 4.85 | Stacked title on an ink card; halftone; hard cut. |
| 3 | `portrait_iris` | portrait | 4.97 | Vera's paper portrait in a window; torn lyric band; 12% push; iris out. |
| 4 | `stage_wide` | list | 5.16 | Two-cast formation; beat-locked orbit; meter; lower third. |
| 5 | `sticker_slam` | quote | 4.85 | Torn bed, sticker slam, display body, burst; hard cut. |
| 6 | `pullback_close` | close | 5.19 | Rooftop diorama pull-back; paper roof key; monogram, corner marks, hold. |

Rounded to 0.01 s; the unrounded plan sums to 30.000 s.

## Grammar check

- **Cut-paper edge:** Shot 4. The lead and second are built from flat cards — back plate, torso, head, cut hair, arm and leg chains — each with a cream cut lip and a dark ink line. The stage floor is a torn cut plate, not a painted gradient; Shot 1's paper sun shows the same cut ray edge.
- **Cream type edge and hard ink shadow:** Shots 1 and 2. The title “SIX FLOORS UP” is a paper object: a cream cut edge on every letter and one hard misregistered ink shadow, fixed down-right for the whole stack. Shot 2 repeats it on the ink card and on the body line “ONE MORE PASS”.
- **Torn fibre or sticker:** Shot 5. The oxblood torn-strip bed shows fibre and a deckled edge; the paper sticker lands flat with a squash and no bounce. Shot 3's lyric band is a torn ink strip, so the fibre language carries into the portrait.
- **Halftone:** Shot 2. A fixed-angle halftone dot field at 22% sits under the title on the ink card; Shot 5 repeats it at 24% under the sticker. It is a printed screen, not a soft airbrush.
- **Two-cast rig:** Shot 4. The lead and second share the stage; the second has the narrower shoulder plate, longer hair plate and one accent sleeve. Both are layered paper puppets with visible eyelets, and there is no third figure. The second answers Vera's arm line a beat late. The orbit goes around the paper stage, not a modelled body.
- **Beat cut or beat-locked move:** Shots 2→3, 4→5 and 5→6 are hard cuts planned on the 88 BPM grid; Shot 2's type drop lands line by line on the beat. Shot 4's orbit is locked to the four-beat bar (1.00→1.06, easeInOut), so the move breathes with the bar and does not drift.
- **9:16 re-stage:** Shot 3. The portrait is re-anchored to the 9:16 `portrait` box, the window to `frame`, the names to `names`, and the caption and lyric band to `lyric`; the cast sits in the central 60%, not cropped from the 16:9 stage. Shot 4 re-stages the stage, lead and second into `stage`, `lead` and `second`, with the meter in `meter` and the body in `bodyLower`. Shot 6 re-anchors the corner marks to the 9:16 `frame` box and the monogram to the `monogram` box.

## Questions

- **`paper-shadow` (open choice):** Collage or Print? Collage gives every layer a contact shadow and a diorama cut edge; Print keeps the layers flat with only the type shadow. It changes the layer separation and contact in all six shots, not the route, type edge, palette, timing or word count. The light block's softness 0.5 / opacity 0.2 may be Collage-only; the pack does not say. The treatment does not answer the choice.
- **Palette:** day-stage or night-stage? Night-stage is proposed; the pack default is day-stage.
- **Title, track and voice:** Is “SIX FLOORS UP” the film title, the track title, or both? It lands twice (Shots 1 and 2) because both recipes read `content.title`; is that intended? The brief has no song-title or audio field; what is the cleared 88 BPM track, and is the caption voiced or printed only? Loudness is unset.
- **Second performer:** Who is she, and should she be named? The pack has one `names` slot; `stage_wide` has no second-name slot. The treatment leaves her unnamed.
- **Colour specification:** What colours are the starter assets and the text fill? In Shot 4, the fixed acid burst/meter, the second's accent sleeve and an ink-blue stage would be five roles; the style says drop the accent first, which would remove the sleeve. The treatment keeps the sleeve by making the stage ink. Is that intended? It assumes auto-contrast type fill (ink on paper, cream on ink). Does the accent swatch attach to type, or is the recipe's accent shape enough?
- **9:16 safe area:** The lyric box runs to 0.96 and the monogram to 0.90, outside the 12% bottom margin (safe 0.88); the style also calls the lyric band bottom 14% while the box is 10% high. Which wins? `pullback_close` maps corner marks to the `frame` box, not the outer margins; is that the intended position?
- **Meter copy:** What does the meter read, in what format, and does it change per shot?
- **Duplicate camera/transition:** The recipes declare a top-level field and a composition op for both; which is authoritative? The treatment reads the composition op as the move. If both apply, the moves double and exceed the 6%/12% limits.
- **Top-level shapes in 9:16:** Do they fill, cover or keep their 16:9 scale? Shot 4's burst box is much larger than its 16:9 footprint.
- **`portrait_iris` mask vs effect:** Is the `iris-mask` circle a visible ring, the aperture, or a guide? How does it relate to the `effect: iris`?
- **`sticker_slam` flash:** What colour is the 18% flash? A white flash adds a fifth colour and reads as gloss.
- **Close object and set:** Is a paper roof key allowed, and may `set.diorama` carry bespoke rooftop dressing?
- **Venue and unread fields:** Venue in `subtitle` and the soundcheck line in `caption` — is that the right split? Should date, venue, hashtag, rsvp and photos be left empty or carried as context?
- **Plan seconds:** Are the six plan values final, or should the cuts be quantized to the 88 BPM grid now?
