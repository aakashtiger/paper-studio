# Paper Vows — style contract

**Family:** paper
**Version:** 0.1.0
**Formats:** wedding, ballad, anniversary

## Intent

A wedding invitation that feels like a piece of stationery someone kept.

Warm paper, dark ink, one metal, one accent. Slow, confident motion. Type does most of the work. The film should feel quiet enough that a family can watch it together in a room.

Not grand. Not cinematic. Not loud. Intimate and crafted.

## Five invariants

1. **Paper is physical.** Every element sits on, or is cut from, paper. Shadows are soft and directional, always from the top left.
2. **Four colours maximum per frame.** Paper, ink, one accent, one metal. Never a fifth.
3. **Type is the hero.** Names are the largest element in the frame. Nothing competes with them.
4. **Motion is slow.** The fastest element moves at roughly 1.5% of frame width per second. No bounce, no elastic, no spin.
5. **One idea per shot.** If a shot needs an explanation, it is two shots.

## Variables

| Variable | Values |
|---|---|
| palette | marigold-ivory, sage-blush, midnight-rose, sandalwood, ivory-gold |
| motif | indian-classic, minimal, destination |
| type lockup | classic, modern, bilingual |
| tone | traditional, modern, playful, minimal |
| aspect | 9:16, 16:9, 1:1 |
| duration | 30, 45, 60 |

## Signature

- **Shot:** the invitation unfolds and the names resolve from the fold.
- **Transition:** page turn at act boundaries; hard cut everywhere else.
- **Texture:** paper fibre at 18% and a soft vignette at 22%, never digital grain.

## Anti-patterns

These instantly break the style:

- glossy gradients or metallic sheen beyond one small accent
- drop shadows with hard edges
- more than one accent colour
- fast cuts under 1.5 seconds
- centred paragraphs of body text
- stock-photo smiles pasted into a frame
- lens flares, glitch, chromatic aberration
- any motion that overshoots and settles

## Not for

- comedy
- action
- dense explainer content
- anything that needs more than four colours or more than twelve words per card

## Recipes

`invitation_unfold`, `names_lockup`, `portrait_frame`, `blessing_text`, `date_reveal`, `rsvp_card`, `monogram_end`

Each recipe is a parameterized shot. It declares its slots, its camera path, its required assets, and how it fails.

## References

Hero frames and anti-pattern frames live in `references/`. They are the ground truth when a render is ambiguous.
