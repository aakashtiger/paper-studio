# Design

Two design systems, kept separate.

1. **Output design system** — the style pack. It governs the film.
2. **App design system** — the studio UI. It governs the tool.

The film should feel handmade. The tool should feel quiet.

## Output principles

- **Paper first.** Every element reads as a physical material: card, ink, wax, thread, print.
- **One idea per shot.** If a shot needs a caption to explain itself, it is two shots.
- **Type is the hero.** Names and dates are the largest elements in the frame.
- **Motion is slow and confident.** No bouncing, no elastic, no spin for its own sake.
- **Silence is allowed.** Not every beat needs sound.
- **Restraint over decoration.** One accent colour, one metallic, one texture.

## Paper Vows specifically

- Palette: warm paper, dark ink, one accent, one metal. Never more than four colours in a frame.
- Type: a display serif for names, a quiet sans for details. Devanagari pairs with both.
- Texture: paper fibre at low opacity, soft vignette, no digital grain.
- Light: soft, from the top left, consistent across every shot.
- Transitions: cut, unfold, page turn. No cross-dissolve except at act boundaries.

## App principles (when the web app is built)

- **Gallery before form.** The first screen is a set of films, not an empty prompt.
- **No prompt box.** The user answers a brief, not a blank page.
- **Show the film, not the pipeline.** Progress is a state, not a log.
- **One primary action per screen.**
- **Preview at 540p, approve at 1080p.**
- **Every change is reversible.** Version the project, not the conversation.

## Typography

| Role | Face | Licence |
|---|---|---|
| Display | Instrument Serif | SIL OFL |
| Body / UI | Inter | SIL OFL |
| Devanagari | Tiro Devanagari Hindi | SIL OFL |

Fonts are bundled. System fonts are never used in render.

## Colour roles

Never reference raw hex in code. Reference roles:

`paper`, `ink`, `accent`, `metal`, `soft`, `shadow`

Each palette maps those roles. A new palette is a token file, not a code change.

## Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances.
- Camera: push in, pull back, gentle parallax. No handheld shake.
- Shot entrance: 240ms fade and a 1.02 scale settle.
- Max simultaneous moving elements: three.

## Accessibility

- Burned-in captions for every spoken or text-critical line.
- Contrast ratio of at least 4.5:1 for body text, 3:1 for large display type.
- No flashing above 3Hz.
- Safe zones respected for 9:16 (top 220px, bottom 320px reserved).
