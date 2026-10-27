# Questions — CUT AT THE FOLD

These are the questions the pack leaves open for this film. The `paper-shadow` choice is the director's; nothing here answers it.

## 1. `paper-shadow`: Collage or Print?

The pack leaves this choice open. Both options keep the cream cut edge and the type's hard misregistered ink shadow; they change the paper's relationship to the card.

- **Collage:** every paper layer gains a soft contact shadow. In shot 1 the sun and burst sit above the cream card; in shot 3 the portrait and window have depth; in shot 4 the stage and cast sit on the riser; in shot 5 the sticker lifts off the torn bed; in shot 6 the diorama pull-back reveals real depth. The film reads as a tabletop diorama.
- **Print:** no paper contact shadow. Those same layers sit flat on the cream sheet, and only the type keeps the hard down-right ink shadow. Shot 6's depth has to come from overlapping cut plates and the cutaway edge alone. The film reads as a printed poster.
- **Does the choice count against the four-colour budget?** The pack counts paper, ink and the two loudest plates. If Collage introduces a soft shadow value, is that a value or a fifth colour role? The pack does not say.
- **Which does the director want?** This treatment does not choose.

## 2. What is the delivery frame rate, and how is the 12 Hz boil held on twos?

`tokens.type.treatment.boil` says "12 Hz step boil, held on twos"; `motion.paper.fibreBoilHz` is 12; `STYLE.md` also says fibre and torn edges step at "twelve frames per second". At 24 fps, held on twos is exactly 12 Hz. At 30 fps, held on twos is 15 Hz. The source film is 30 fps and the pack never states the delivery frame rate.

- Should S2 run at 24 fps so the 12 Hz/twos rule is exact?
- Or at 30 fps with a 15 Hz two-frame boil?
- Or at 30 fps with a 2.5-frame 12 Hz cadence, which cannot sit on whole frames?
- Does the type boil, the fibre boil and the torn-edge step share one cadence?

This is a pack defect, not a taste question: the stated pair is only exact at 24 fps.

## 3. What are the type shadow offset and cream lip, in pixels, at 9:16?

The pack fixes the shadow's direction (down and right) and the cream cut edge, but gives no offset or lip thickness at 390 px or at 9:16. The card shows a plate, not a spec.

- What is the fixed shadow offset for display, body, caption, label and monogram?
- Does it scale with the 56/24/16/14/32 px type or stay at one pixel offset for the whole stack?
- How thick is the cream lip at 9:16, and does it scale with type size?
- Does the 14 px floor apply to the lip as well as the fill?

## 4. At 9:16, do character and diorama images cover or re-stage?

`tokens.layout.aspectRules.9:16` says "images fill their box with cover". `capabilities.adaptation.aspects` says 9:16 is a re-stage, never a crop, and that both performers are re-staged. Those two instructions meet in `stage_wide` and `pullback_close`.

- In `stage_wide`, the lead box changes from 0.2 x 0.5 (16:9) to 0.22 x 0.44 (9:16). Cover-cropping a paper puppet would cut the head or feet and could cut the visible edge. Does the renderer re-pose and scale the paper rig into the box, or cover-crop the character plate?
- In `pullback_close`, the diorama box changes from 0.88 x 0.72 to 0.88 x 0.56. Cover would crop the back wall and cutaway edge that shot 6 is about. Does the diorama re-stage its layers, or crop?
- The pack does not distinguish character images from stage images. Which reading is correct?

This is a pack defect in wording: "cover" and "re-stage, never a crop" cannot both be literal for these ops.

## 5. Does the 0.21 s offset move the first cut, and which end of the 30.000 s absorbs it?

The grid is 88 BPM with a 0.21 s offset and a four-beat bar. The resolver allocates 30.000 s of plan time; S2 quantises cuts to the grid.

- Does the first cut land at 0.21 s, or does the film start on frame 0 and the offset only phase the beat?
- Is the 30.000 s target measured from frame 0 or from the first downbeat?
- If the quantised cuts do not sum to 30.000 s, does the correction go to the head, the tail, or the close's hold?
- Does the close's `hold` sit outside the 88 BPM grid?

## 6. Are two iris transitions allowed in a six-shot film?

This route uses `iris` out of shot 1 (`paper_open`) and shot 3 (`portrait_iris`), with a cut between them. The pack fixes each recipe's transition and does not say whether a second iris in one short film is a grammar failure.

- Is the repeat allowed?
- If not, should one iris become a cut? Changing a recipe's transition would edit the pack, which the blind run forbids.
- Does the in-shot `iris` effect in `portrait_iris` count separately from its `iris` transition out?

## 7. What audio is cleared, and is there a voice line?

The pack supplies no audio files. It specifies electronic pop, paper foley, an optional short voice line, music ducked about 4 dB, and a close that may hold on room tone.

- What original 30 s track is cleared for this film?
- Is there a voice line, and if so, is it one short line or none?
- Is the close's room tone a produced paper-room bed, a recorded roof, or silence?
- Who clears the track and the voice, and does the clearance cover a public post?

## 8. Is `-14 LUFS` the intended delivery loudness?

`format.json` carries `-14 LUFS` as optional passthrough metadata. The pack says delivery loudness belongs to the format but gives no target.

- Is `-14 LUFS` correct for this platform?
- Should the close's room tone be measured inside that target?
- Does the loudness metadata belong in the format, as written, or in a separate delivery spec?

## 9. Where does the venue live if `content.venue` is unread?

The brief schema has `content.venue`, but the pack reads only `title`, `subtitle`, `names`, `body`, `caption` and `monogram`. The commission's venue is in `subtitle` ("The Fold, rooftop").

- Is `subtitle` the only intended on-screen home for the venue?
- Should the brief also carry `content.venue` for downstream metadata even though the pack ignores it?
- If the venue must be machine-readable, which read slot should carry it?

## 10. Is `frame` a filled plate or an outline?

`type_stack` uses `kind: "frame"` for the red title card and sets `content.title` and `content.body` in paper on top of it. The shape vocabulary lists both `card` and `frame` but does not define whether `frame` is filled.

- If `frame` is an outline, paper type sits on cream paper and disappears.
- If `frame` is a filled red plate, the shot works as written.
- Which is intended, and does the same answer apply to any other recipe that uses `frame`?
