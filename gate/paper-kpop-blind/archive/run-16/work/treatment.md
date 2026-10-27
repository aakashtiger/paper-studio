# Treatment — FOLD THE LIGHT

Vera Lune at The Fold, rooftop · day-stage · 30 s · 9:16 · six shots. A last soundcheck before the 14 Nov show.

## Route

| # | Recipe | Beat role | Seconds | Grammar it proves |
|---|---|---|---|---|
| 1 | `paper_open` | open | 4.968 | Cream card, acid sun snaps open, gold core; ink title with cream edge and hard ink shadow; 5% push; iris out on the sun. |
| 2 | `type_stack` | title | 4.855 | Red cut card; title stacks on the beat; paper display and body with cream edge and ink shadow; halftone under the type; match_cut on the card rectangle. |
| 3 | `portrait_iris` | portrait | 4.968 | Vera in a blue paper window; torn red lyric band; two-name billing; 12% portrait push; iris out on the face. |
| 4 | `stage_wide` | list | 5.161 | Two-cast rig (Vera and Rhea); 6% stage orbit; black sticker meter; 9:16 re-stage; beat cut out. |
| 5 | `sticker_slam` | quote | 4.855 | Red torn bed and red sticker; paper display body; gold accent; halftone; beat cut out. |
| 6 | `pullback_close` | close | 5.193 | Rooftop diorama with a small paper mic; torn strip; hand monogram; ink corner marks; 12% pull-back to a hold. |

Duration fit: minima 14.400 s + 15.600 s capacity share = 30.000 s. Shares: 2.768 / 3.355 / 2.768 / 1.761 / 3.355 / 1.593 s; the 4 ms leftover goes to the largest fractions. This is capacity, not an equal split.

Palette: day-stage. Shots 1 paper/ink/acid/accent; 2 paper/ink/red/acid; 3 paper/ink/red/blue; 4 paper/ink/red/acid; 5 paper/ink/red/accent; 6 paper/ink/red/acid. Gold accent only in 1 and 5; blue only in 3; no frame over four.

HUD: shot 3 carries the lyric band only; shot 4 the meter only; shot 6 the corner marks only. No shot carries two.

`paper-shadow` stays open. The cut edge and the hard type shadow are fixed, so the route holds in either Collage or Print.

Sound: 88 BPM electronic pop and paper foley; one beat of silence can precede the shot 5 slam; the close holds on room tone. The pack supplies no audio.

## Grammar check

- **Cut-paper edge:** Shot 2's red title card and shot 5's sticker show the cream lip and the dark ink line under it; shot 3's blue paper window and the lead's hair and arm plates, and shot 6's diorama cutaway, keep the same flat-card edge. No bevel, no 3D.
- **Cream type edge and hard ink shadow:** Shot 1's ink title over the acid sun and gold core, shot 2's paper-fill title and body on the red card, and shot 5's display body on the red sticker. Each character has the cream cut edge and the fixed hard misregistered ink shadow, one offset for the stack; the shadow is not a soft drop.
- **Torn fibre or sticker:** Shot 5: the red torn bed under the sticker, the sticker's torn edge and the 18% fibre finish. Shot 3's red lyric band and shot 6's torn paper strip repeat the tear at a smaller scale.
- **Halftone:** Shot 2 prints the fixed-angle dot screen over the red card and under the type; shot 4 carries it on the stage; shot 5 carries it under the sticker. It stays a dot screen, not an airbrush or a gradient.
- **Two-cast rig:** Shot 4 only: Vera Lune (lead) and Rhea Voss (second) are separate layered paper puppets with visible eyelet joints; the second uses the narrower shoulder plate, the longer hair plate and a paper sleeve. No third figure. The portrait is one lead by the pack's rule; the close has no performer.
- **Beat cut or beat-locked move:** Shot 4's stage orbit is the move; the cuts into shot 5 and shot 6 are planned on the 88 BPM grid and land as beat cuts, and shot 5 lands the sticker on the cut. Shot 2 exits on a match_cut and shot 3 on an iris on the face. S2 quantises the plan values; this treatment does not claim frame-exact pixels.
- **9:16 re-stage:** Shot 4 is the proof: the 16:9 stage is re-staged, not cropped. Vera takes `lead` (x 0.20, w 0.22), Rhea takes `second` (x 0.58, w 0.22), both inside the central 60%; the stage fills 0.04–0.96, the body and caption stack at `bodyLower`/`caption`, and the meter re-anchors at x 0.70, y 0.06. Shot 3 contains Vera in the 0.56-wide portrait box with the lyric band at the bottom; shot 6 moves the monogram to the lower-left. No 16:9 sides are cropped.

## Questions

- **`paper-shadow` (open):** Collage or Print? Collage would put a soft contact shadow under the sun, title card, window, lyric band, both puppets, stage, sticker and diorama; Print would keep those layers flat with only the type shadow. The cut edge and the type shadow are fixed. Does the choice cover the HUD, does the contact shadow count as a colour, and is it film-level? Not decided here; the shot-by-shot effects are in `questions.md`.
- **9:16 `names` box:** 0.06 h = 41.6 px at 390 wide, but one 56 px display line is 47.6 px. Even a one-line billing must auto-fit below display size; a two-name billing shrinks to roughly 30 px on one line or 24 px on two. Is the box or the scale wrong?
- **Close z-order:** `pullback_close` puts the corner marks at z 6.5 above the monogram at z 6, against the layer order (HUD before type). Which wins?
- **Sticker fill:** `sticker_slam` sets the body to paper fill but does not name the sticker's fill; a paper sticker would hide the type. Is red the intended fill? In 9:16 the body box is 0.48 w against a nested sticker of about 0.35 w; should the body overhang the sticker?
- **`stage_wide` body over stage:** The 16:9 body line is y 0.76–0.86 on a stage that ends at 0.82; ink body copy would sit on a blue or red stage. Is the stage meant to be paper under the body?
- **`pullback_close` body and strip:** The 16:9 body is 0.56 w and the torn strip 0.50 w; both map to `bodyLower` in 9:16. Nesting the body inside the strip would make it 112% of the strip and overflow the 0.88 safe width; filling the box loses the overhang. Which is intended? The 9:16 monogram box also ends at 0.90, inside the 12% bottom margin (safe bottom 0.88); is it allowed there as a hand mark?
- **`stage_wide` burst:** The 16:9 stage burst is 0.22 × 0.18; the 9:16 `burst` box is 0.84 × 0.58. Is the burst meant to become a full-stage sun, or keep its relative scale?
- **Halftone and camera limits:** `alpha` 0.5 against recipe `opacity` 0.18–0.24 and `amount` 0.5–0.6: do they multiply or override? Are the 14–22 cell values pixels at 390? Do the 6% push limits cover the 12% pull-back, the 12% pan and the 6% orbit?
- **Transitions:** Does the iris from shot 1 into the rectangular shot 2 need a circle in the incoming frame? For the match_cut from shot 2 into shot 3, is the red card rectangle → the window aperture a valid match, or should the red field match the lyric band?
- **Audio, voice and loudness:** Is `-14 LUFS` the intended target, with what true-peak ceiling? Is the music an original cleared track, and is the vocal a separate performance track? Is the caption line sung or only printed, and does the lyric band sync? Who clears the foley and the room tone?
- **Brief slots and billing:** The pack does not read `date` or `venue`; this brief fills both and repeats them in `subtitle`. Is that the workaround? Is a two-name billing over a one-lead portrait correct? Does the second rig's “accent sleeve” use the accent role or is it paper, as planned? Is one `body` value meant to serve body, lower-third, display and close, and one `caption` to serve the lyric band and the stage caption?
- **Four-colour count:** Do the black meter, the halftone dots and a Collage contact shadow count as `ink` or as extra colours?

Full detail on every open point is in `questions.md`.
