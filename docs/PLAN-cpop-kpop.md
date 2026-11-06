# CPOP + KPOP — the rebuild plan

**Date:** 6 Nov 2026
**Status:** proof-first. No 157 s render until both proofs pass.

## The two styles are different, and both are kept

| | **CPOP** | **KPOP** |
|---|---|---|
| Source | *CLAUDE POP* — `Y:\NewVideoTest\out\claude-pop.mp4`, 156.6 s, 1920×1080, 30 fps, 4,699 frames | *The Understudy* — `films/understudy/understudy.mp4`, 30 s, 9 shots |
| What it is | the faithful source grammar: 2.5D paper dolls, 5–10 moving layers per frame, one simple camera move per shot, type as a paper object, cuts on the word | the repo's extracted pack: same construction, but 1–4 principals, 9:16 re-stage, film-owned sets, narration or song |
| Cast | new cast built from the source rig: **VEE** (star), **MOTH** (foil), **TABS ×2** (chorus) | Nova / Mira and the existing six recipes |
| Colour | cream/kraft/ink + **cobalt** + **magenta** + **acid**; no tomato/butter/gold | the pack's role budget; the film chooses its field script |
| Length | 157 s, 16:9 | 12 s proof first, then the film |

## Non-negotiables

1. **Continuous motion in every frame**, not camera-only. A still camera must carry at least two of: body breathing, ornament pulse, type boil, fibre/grain, ambient particles, a secondary prop.
2. **Variable cuts:** minimum 1.0 s, median 2.5–3.0 s, maximum 4.5 s. No constant 2/3/4 s grid. Cut on the word or the action, not the metronome.
3. **Camera is subordinate:** push/pan/orbit ≤12%; one move per shot; no 30% zooms; no linear camera doing the acting.
4. **A body must perform.** A staged shot has a pose change by 0.25 s, another by 0.3 s later, and the painter must read the score's pose times, not a hardcoded local blend.
5. **Paper physics:** one authored event per shot — fold, tear, curl, flutter, stamp, stack, slam. No particle dissolve, no glow as the event.
6. **Type is a paper object:** subtitle for the line, monumental fragment for the hook, on the word, never over a face, hands or feet. At least one type object in every shot.
7. **Cast construction is fixed:** brads at every joint, tapered two-bone limbs, three-layer head, drawn face, hands with thumbs, one ground shadow. Names, clothes, hair, colours and species may change.
8. **Sets are paper layers**, not flat backgrounds: floor, horizon, one graphic device, one texture, contact shadow.
9. **Determinism:** no `Math.random`, `Date.now`, network or played timelines in the paint path.

## The first proof — CPOP, 10.00 s

**Section:** first chorus, `22.72–32.72` of the exact source audio.
**Shots:** 3, **2.97 / 4.03 / 3.00 s** (median 3.00), cuts at 25.70 (FOOM) and 32.72.

| Shot | Time | What happens | Continuous motion | Paper event | Lyric |
|---|---|---|---|---|---|
| P1 | 22.72–25.70 | VEE on the Meter Stage; halo snaps off and unfolds into the P(doom) dial; needle 8→34 | halo fan, needle, coat tails, moth wings, type ratchet, floor marks | halo unfolds; P(doom) ticket stamps | `P(DOOM)` 300 px upper-right |
| P2 | 25.70–29.72 | Folded Room; walls fold, mail slots flap, bag tips, mushrooms unfold, FOOM flower bursts | wall panels, slots, bag, mushrooms, flower, room roll | FOOM accordion flower; bag tear | `FOOM` 420 px upper-left |
| P3 | 29.72–32.72 | Mask Wall; mask tilts, 12 eyes blink, tentacles curl, mask folds, shoggoth unfurls | mask, eyes, tentacles, puddle, spotlight | mask folds; stick snaps | `LIES` 220 px on the mask; subtitle |

**First 3 seconds:** VEE already on screen, hand on the wire halo; at 23.0 the halo snaps off; by 23.44 it is an unfolded paper dial with a brad and fold lines; at 23.78 `P(DOOM)` stamps into the negative space; at 24.32 the needle slams to 34; at 25.70 the tape snaps and the cut lands on `FOOM`. No title card, no black frame.

**Source:** use the source project's rig and scene code (`Y:\NewVideoTest\src`), not the reduced pack. The final picture is code-drawn; no generated image enters the render path.

## The second proof — KPOP, 12.00 s

**Shots:** 3, `portrait_iris` / `macro_prop_beat` / `stage_wide`, **3.0 / 4.5 / 4.5 s**, Nova + Mira, 13 words, event-bound cues. This proves the Understudy grammar survives outside its own film: pose blend, paper tear on the score, two-body formation, type in every shot, camera ≤12%.

## What happens after the proofs

1. Watch both proofs frame by frame against the source and *Understudy*.
2. Fix motion, timing, type and contact until a critic rates both **AAA** against the references.
3. Only then build the 157 s CPOP film, using the act structure in the planning report (proof at 22.72–32.72, hooks at 22.72 / 58.94 / 95.20 / 124.24).
4. Delete the failed Diwali film and any remaining generated bulk once the new proofs replace it.

## What is not available in this workspace

The `/asic` folder, the ElevenLabs key, and the foul/seedance access described in the initial prompt are **not present** here. The proofs are therefore code-drawn. If those keys/folders are added, generated character/set reference sheets can be produced, but they remain reference only; the final video stays code-drawn.

## Acceptance

The proof fails if any shot is a static illustration, the camera does all the motion, a hold exceeds 0.4 s, the paper event is a blur/glow, type covers a face/hand/foot, the palette drifts to tomato/butter/gold, the cuts are uniform, or the frame is not reproducible.
