# Questions — Above the Fold

The pack answers the grammar, the six slots, the 30 s / 9:16 limits and the 9:16 anchor rules. These are the questions it leaves open for this film. The `paper-shadow` choice is **not** answered here.

## 1. paper-shadow — the open choice

- **Collage or Print?** The pack leaves this to the director. I have not chosen.
- **What changes under Collage?** Every paper layer would carry a soft contact shadow: the cream sheet, the acid sun and its pink core, the red title card, the paper window, the stage, both performers, the torn bed, the sticker and the diorama. The rooftop would read as a physical set.
- **What changes under Print?** The layers stay flat with the visible cut edge; only the type keeps its hard offset ink shadow. The same film would read as a printed poster of the roof.
- Does the contact shadow reach the HUD pieces — the red lyric band, the black meter sticker and the ink corner marks — or only the stage and cast?
- Does the contact shadow count against the four-colour budget? It is a shadow, not a palette role, but it adds a value to every frame.
- Does the top-left key stay fixed in 9:16 when the stage is re-staged, or does the contact shadow re-anchor with each layer?
- Does the choice change the three proof frames (`paper_open`, `portrait_iris`, `pullback_close`) or only the later render? The card shows both options at 390 px, but not this film's frames.
- The cut edge must stay visible in both choices. Is the cream lip plus the dark ink line under it fixed in both, with only the soft contact shadow added under Collage?

## 2. Time, beats and the 30.000 s total

- The plan under the resolver rule is 4.968 / 4.855 / 4.968 / 5.161 / 4.855 / 5.193 s. At 88 BPM a beat is 0.6818 s and a four-beat bar is 2.727 s; these six shots are not beat multiples.
- How should S2 quantise the six cuts to the 88 BPM grid without changing the 30.000 s total?
- Is the 0.21 s offset applied once at the head of the film, or to every cut?
- The close is 5.193 s; if it rounds up to the next beat it passes the 5.5 s recipe maximum. Does the beat or the maximum win? Is 5.5 s a plan limit or a hard render limit?
- Can a quantised shot fall below the 1.5 s recipe minimum, or below the 1.2 s style floor?

## 3. The 1.2 s floor is unreachable

- `STYLE.md`, `tokens.motion.minShot`, `BRIEF.md` and `capabilities.governance.decisions` all say the shortest shot is 1.2 s.
- Every recipe's `duration.min` is 1.5 s or more. The resolver starts at the recipe minimum, so no plan made from these recipes can produce a 1.2 s shot.
- Is 1.2 s a style target that no recipe currently carries, or should one recipe have a 1.2 s minimum?
- The pack says the 14-shot 45 s song proves the 1.2 s floor; with these recipes the shortest possible shot is 1.5 s. How is that proof made?

## 4. Six shots, 30 seconds and pace

- All six shots land between 4.855 and 5.193 s, near the 5.5 s ceiling.
- The pack says the fast 2.8–4.2 s cuts are only proved by the 14-shot 45 s song, and calls the six-shot 30 s 9:16 shape a blind proof, not a product format.
- Is a six-shot music Short meant to be this slow? Should the director use the 8-shot 30 s Short shape instead, or repeat a short recipe inside the six?
- The commission asks for a six-shot music Short; the pack calls that shape a blind application. Is the deliverable a proof or a product?

## 5. The two-cast credit

- `portrait_iris` is the only recipe with `content.names`, and it is a one-lead portrait.
- `stage_wide` is the only two-cast recipe, and it has no names slot.
- If both performers are credited, the 9:16 names box (0.8 wide, 0.07 high) must auto-fit "Vera Lune and Rook Saye" below the 56 px display size.
- Is a two-name credit allowed to shrink? Or should the credit be lead-only and the second uncredited, as the pack allows for a one-name film with an uncredited foil?
- If the second is uncredited, where does Rook appear in the type at all?

## 6. 9:16 mapping gaps

- Every recipe's `vertical` array maps the named ops but omits the full-bleed `paper` image and the effects (`fiber`, `halftone`, `vignette`, `grain`, `flash`, `iris`).
- Is `paper` implicitly 0, 0, 1, 1 in 9:16? Are the effects full-frame?
- If not, which boxes should they use? The aspectRules say top-level shapes fill their box, but the paper and the effects have no box.
- `portrait_iris` maps both `caption-line` and `lyric-band` to the same `lyric` box; the nested-shape rule preserves the 16:9 inset. Is that the intended way to keep the caption inside the band in 9:16?
- `stage_wide` maps `body-line` to `bodyLower` and `caption-line` to `caption`; the stage box ends at 0.74 in 9:16, so the caption sits below the stage. Is that the intended re-stage of the lower-third, or should the caption stay on the stage edge as it does in 16:9?

## 7. Rules, HUD and the meter

- The 9:16 `*Rule` boxes are 0.008 high. At 390 × 693 that is 5.5 px, but the aspectRules say rules keep 1.5–2 px. Does the box set thickness or only the anchor? Which wins?
- The meter is "a beat count and a four-role bar in DM Mono". What is the exact beat-count string? Is the four-role bar the four palette roles in the current frame, or the four beats of the bar?
- The 9:16 meter box is 0.24 wide (93.6 px) and 0.05 high (34.6 px). Can a 14 px beat count plus a four-segment bar fit? How many characters may the beat count use?
- Does the printed HUD count against the four-colour budget? The red lyric band, the black meter with acid readout and the ink corner marks are printed paper, not floating UI.
- If a frame already uses paper, ink, blue and acid, the meter's acid is the same role; if a frame also uses red, is the meter exempt or must the palette drop a plate?

## 8. The portrait iris

- `portrait_iris` has an `effect kind iris` and a `transitionOut` of `iris`; `paper_open` also irises out.
- Is the effect a held paper iris or window around the face, or an animated iris reveal inside the shot?
- If it is animated, the portrait gets an iris transition in and an iris effect at the same time. Should the effect be held after the transition, or is it the transition itself?
- The failure mode "the iris opening faster than the cut" suggests the effect is timed to the cut. Which cut — into the portrait, or out of it?

## 9. Halftone and fibre

- The pack says halftone is a dot screen at a fixed angle, but gives no angle or dot pitch. Recipes give only opacity and amount (0.18–0.24, 0.5–0.6).
- What angle and pitch should the renderer use? Is the angle film-wide while the phase is seeded per shot (`tokens.seed.seeded` includes "halftone phase")?
- Paper fibre is 18% and steps at 12 Hz. The layer order puts fibre after the HUD, so it sits over the type. Is the fibre meant to print over the type, or is that only a screen texture?
- Does the 12 Hz boil apply to the halftone phase and the grain offset as well as the fibre? The seed block lists all three.

## 10. Sound, voice and loudness

- The pack supplies no audio and gives no delivery loudness. I put `-14 LUFS` in the format as passthrough metadata. Is that the house target? Is it integrated loudness, true peak, or both?
- Must the cleared track be exactly 88 BPM to lock to the grid? What if the track is 87 or 90 BPM?
- Is a voice line expected for this film? The pack says voice is optional, one short line per idea, not a content slot. Where is it specified if it is not in the brief?
- The close may hold on room tone. Does the 5.193 s close include the hold, or is the hold extra time after the shot?

## 11. The brief fields the pack does not read

- The pack reads `title`, `subtitle`, `names`, `body`, `caption` and `monogram`; it does not read `date`, `venue`, `hashtag`, `rsvp` or `photos.*`.
- The commission mandates the venue "The Fold, rooftop". I put "The Fold" in the subtitle and the full string in `content.venue`, which the pack ignores. Is "The Fold" on screen enough, or must the full venue string appear?
- Should a music Short carry `hashtag` and `rsvp` at all? They are in the schema but dead in this pack.
- Should `photos` be omitted entirely, since the pack has no photo slot and no photograph may be pasted?

## 12. Palette and the frame budget

- The night-stage accent is pink; the red is oxblood. Are they distinct enough at 390 px, or does the accent read as a second red?
- If a frame would need a fifth role, the pack says drop the accent first. Does that apply to the accent sleeve on the `character.second` rig? The rig description gives the second one accent sleeve.
