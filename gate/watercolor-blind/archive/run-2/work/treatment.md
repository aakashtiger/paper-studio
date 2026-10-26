# Treatment — The Four O'Clock Light

*A 30-second, 9:16 memory film: the last week in a house before it is sold.*

## Route

| # | Recipe | Beat role | Seconds | Invariant it proves |
|---|---|---|---|---|
| 1 | `watercolor_title` — the gate, the street, the title | `title` | 4.667 | Paper is the white |
| 2 | `watercolor_specimen` — the window and its latch | `detail` | 5.833 | Painting-in |
| 3 | `watercolor_quote` — the chair turned to the window | `quote` | 4.667 | Annotation leader |
| 4 | `watercolor_specimen` — the worn third stair | `detail` | 5.833 | Flying white |
| 5 | `watercolor_mist` — the rooms wash back to paper | `transition` | 4.500 | No vector outline |
| 6 | `watercolor_close` — the latch, unfinished | `close` | 4.500 | Pooled edge |

The beats in `format.json` are `opening`, `first-plate`, `line`, `second-plate`, `breath`, `closing`.

**Allocation — the resolver's rule, not an equal split.** Each shot starts at its recipe minimum: 4 + 5 + 5 + 4 + 4 + 4 = 26.000 s. The remaining 4.000 s is shared by remaining capacity (4 / 5 / 5 / 4 / 3 / 3 s), which is 667 + 833 + 833 + 667 + 500 + 500 ms. Shot starts: 0.000 / 4.667 / 10.500 / 15.167 / 21.000 / 25.500 s. The plan output is authoritative; one millisecond of rounding the other way changes nothing a viewer sees.

### What gets painted

1. **The sheet.** A horizon wash across the page at 58 percent — the far side of Alder Row, a low wall and two roofs, made in three passes rather than a darker mix. The pear branch that hangs over the gate stands at the right: bare, three ochre leaves left. The rain-blue seal is pressed at the top right and `Nº 9` sits under it. The title is wiped in from the left, then the subtitle, the place and the date. The sky above the horizon stays bare sheet and is the brightest thing in the frame.
2. **The window.** Sill, jambs and two bars paint in first, then the latch and the paint worn from its thumb-plate; 1.8 s, structure before detail. The pale wash behind is the cool of the room. Ochre sits on the sill where the four o'clock light lies, three passes, so the edge darkens where they disagree. The note and its leader grow in from the right.
3. **The chair.** A ladder-back chair turned to face the window, painted from the back rail down: rails, stiles, rush seat, four legs, over 1.2 s. The ochre wash at its base is the light on the floorboards, not a shadow. The line sits left, the note under it, the leader running from the note to the seat.
4. **The stair.** The third step from the bottom seen from above: the nosing, the riser below it, the tread. The hollow where feet turn is one wide dry-brush stroke that breaks into five bristle tracks and dashes out where the wood is bare. A rain-blue tick, drawn with the rigger, marks the hollow. It is the same note on the same leader, and it is true here too: the light lands on that step at four.
5. **The mist.** The page the turn has just revealed, still carrying the stair as a faint reverse-side ghost. The paper-coloured band stands at mid-page and its edge bleeds upward through the shot, taking the ghost with it; the camera pulls back as the sheet empties. No caption, no accent, music out.
6. **The close.** The latch again, painted only as far as its plate: the screw, the keyhole and the last edge are not there. One wash pass under it stops mid-form and pools at the rim. The seal is stamped once; `Nº 9`, the closing line and the date follow. Then a hold to 30.000 s.

### Director choices

- **Paint-in speed — 1.8 s.** The film's answer to the open choice in `capabilities.governance.choices`. Both specimens use it. The quote's chair is a secondary form at 1.2 s; the close's latch deliberately stops at about 1.4 s so the last frame is unfinished.
- **Palette — `evening-blue`.** Paper `#efe6d4` · ink `#262a2e` · wash `#8fa3b0` (the room, the street, the stair) · petal `#c9a27e` (the light, at four) · accent `#3f7fa8` (the seal, the tick). Five pigments at most in any frame; `deep` is the wash at three passes, never a darker tube colour. The mist carries paper only.
- **Accent.** Rain-blue, three times: the seal (shot 1), a rigger tick at the worn hollow (shot 4), the seal (shot 6). Absent from shots 2, 3 and 5, so it recurs rather than decorates.
- **Camera.** Exactly the recipes, nothing invented: push-in 1.0 → 1.04 (title), 1.0 → 1.06 (both specimens), static (chair, close), pull-back 1.0 → 0.98 (mist). `easeOut` on the pushes, `easeInOut` on the pull-back.
- **Transitions.** wipe → page turn → wipe → page turn → wipe → hold. The quote sits between the two specimens so no two page turns are adjacent, and no cut or dissolve appears anywhere.
- **Pulse.** 48 BPM: a 1.25 s beat, a 5 s bar. The resolver's shot lengths are not multiples of either, so the grid is applied inside each shot — paint-in starts on a beat, the note lands two beats later, the exit runs from the last half-beat — and the shot boundary is allowed to fall between beats (see Questions 8).
- **Refrain.** The caption is the film's only tune and it sounds four times: at the window, beside the chair, at the stair, and as the closing line. The mist is the one silence in the round. The repetition is deliberate — the pack allows a repeated caption as a running note — and four is the most a 30 s page can carry (see Questions 2).
- **Sound.** Solo felt piano, unhurried, from the first frame to 21.000 s. Paper brush rustle at each paint-in, pencil scratch at each hand note, one soft page turn at each specimen exit. Music out at the first frame of the mist; paper and room through the close; one quiet stamp thump as the seal is pressed. No drums, no voice: the body line is set in type, not read.
- **Type at 9:16.** Display 44, body 24, caption 24, label 14, read as the 390 px frame the card draws. The title box widens to the left margin only; the branch keeps the right side (Questions 3 and 5). Every hand note sits on a 12 px paper halo and is drawn twice; every leader is 1.5 px.
- **Seed 9.** Same brief, same pack version, same seed, same six frames.
- **Rights.** No lyrics, no third-party song title, no photograph, no real person. The address, the date and the house are invented. The pack carries no audio; the felt piano in the sound plan is cleared per film and is not part of this pack.

## Invariants

- **Paper is the white:** shot 1 — the sky above the horizon is bare sheet, the brightest area in the frame, and no pure white is painted. Shot 5 repeats it: the mist is paper-coloured, so the eraser is the paper itself.
- **Flying white:** shot 4 — the worn tread is one wide dry-brush stroke carrying five bristle tracks that break into dashes where the wood shows; the riser beside it is a single clean edge, not noise.
- **Pooled edge:** shot 6 — the unfinished wash pass stops mid-form and darkens at the rim where it pooled. Shot 2's sill is the same rule at three passes, darker where the three edges disagree.
- **Painting-in:** shot 2 — sill, jambs and bars, then latch and worn plate, 1.8 s. Shot 4 repeats it at 1.2 s, and shot 6 stops before the last detail, which is what proves the form is painted rather than faded in.
- **Annotation leader:** shot 3 — the note sits on its 12 px halo and a 1.5 px leader grows from it to the chair's seat. Shots 2 and 4 carry the same note on the same leader.
- **No vector outline:** shot 5 — the mist's edge is a wash that bleeds and stops, with no closed contour; a vector cloud is the named failure. Shot 4 has no outline either: the stair's edge is the darker edge of the last pass.

## Questions

- (1) A measured label has no slot: `date` and `venue` are the only label slots, and both are already the date and the place. Where does "sill 94 cm" go?
- (2) `content.caption` is one value serving a specimen note, a quote note and the closing line — four plates in this route; is a repeated refrain the intent, and may the close set it without a leader?
- (3) At 9:16 "widen the title box to the margin" runs the title under the arch that run 1 moved to the right of the plate. Does the arch move, the box stop, or the branch shrink?
- (4) There is no 9:16 composition map, only a type scale: every box is a 1:1 fraction, and the monogram has no 9:16 size at all.
- (5) The 9:16 scale is not tied to a frame width: at 390 px the label sits on the 14 px floor, at 1080 px it falls to about 5 px on a phone.
- (6) `names`, `hashtag`, `rsvp` and `photos.*` are brief fields no page contract uses; for a no-cast, no-photo film, omit them or send them empty?
- (7) The specimen exits with a page turn and the mist follows it, so the mist erases a sheet the turn has already emptied; and the mist recipe declares a band but no animation. Is a reverse-side ghost the intended reading?
- (8) The 48 BPM grid and the resolver's allocation disagree: 4.667 / 5.833 / 5.833 / 4.667 / 4.5 / 4.5 s all land between beats. Which one quantises?
- (9) "An unfinished detail" has no rule — after the wash, mid-stroke, or at a stated fraction of the paint-in?
- (10) Does the quote's painted object paint in, and is the film's 1.2 / 1.8 s answer meant to cover it or only specimens?
- (11) Is `content.body` spoken? Voice is optional, and a quote reads like a line to be heard.
- (12) Music out from the mist through the close is 9.0 s of 30 here against 20 percent of 45 s on the longer shapes; is the share meant to scale?
- (13) In `evening-blue` the accent and the wash share a hue; is the accent meant to be separable by value alone?

Fuller notes on each: see `questions.md`.
