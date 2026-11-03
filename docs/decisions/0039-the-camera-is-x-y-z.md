# 0039 — The camera is measured in x, y and z

**Status:** accepted · 4 Nov 2026
**Owners:** technical (`src/engine/style-measure.ts`, `scripts/style-measure.ts`)
**Depends on:** 0036 (a style is measured before it is described)

## Context

The reference video tracks its camera with phase correlation: it measures how far
the image shifts frame by frame, how much the camera moves, and how often. Our
`style:measure` measured movement as one number — the mean frame-to-frame luma
difference. That number cannot tell a pan from a character walking, cannot say
which way the camera moved, and counts cuts as movement (21.9% of the reported
movement on *Same Alarm* was cut spikes).

The user's addition: the camera has **x, y and z** axes, and all three must be
measured.

## Decision

`npm run style:measure -- --camera` measures the camera on a **48×27 luma
grid**, and reports:

- `dx`, `dy` — full-resolution pixels per shot, the shift that aligns the next
  frame to the previous. Positive x = content moved right; positive y = down.
- `dz` — percent per shot, positive for a push-in.
- `movingShare` — share of shots with at least 1 px/s of translation.
- `zoomShare` — share of shots with at least 0.5% of zoom over the shot.
- `path` — the per-frame x/y shift, for a movement trace.
- `moves` — one row per shot: `from`, `to`, `seconds`, `dx`, `dy`, `dz`, `speed`.

The method is a brute-force translation search over ±6 low-resolution pixels,
then a scale search around the best shift. It is the same answer phase
correlation gives for a small move, without an FFT: on a 4-second clip it costs
**2.2 s**; on the 60-second *Same Alarm* it costs **18.1 s**. It is opt-in
because it is the one measurement that decodes the film a second time.

Per-shot z matters because adjacent frames are too close to see a slow push: a
3% push over four seconds is 0.025% per frame, below the resolution of a
frame-to-frame scale search. Comparing the first and last frame of the shot
measures the move the viewer actually sees.

Two guards:

- A flat frame is equally well aligned at every shift and scale, so ties prefer
  zero translation and scale 1.0. Without that, a still image reported a pan and
  a zoom it did not have.
- `--score` refuses a score whose shot durations do not match the video. A 4 s
  clip measured against a 60 s score was reporting 10 shots and 129 cuts/min;
  it now fails by name.

## Measured

*Same Alarm*, 60 s, 10 shots, `--camera --score`:

```
camera |dx| 16 px/shot · |dy| 0 px/shot · dz 4.5 %/shot · moving 20%
```

Per shot, the moves match the score: shot 2 `dx −120`, shot 7 `dz +20%`
(the score asks for 1.00→1.20), shot 8 `dz −3%` (1.04→1.00), shot 9 `dz +6%`
(1.00→1.06), shot 10 `dz +9%`. The signed mean of x is 0 because a left move and
a right move cancel; the report therefore prints **mean absolute** translation
for x/y and the signed mean for z.

**427 tests** pass (from 418): four camera cases — a known 2 px / 1 px shift is
found in x and y and reported as content movement; identical frames are still; a
known **10% push** is measured as a push and not absorbed by translation; a cut
frame is not a camera move. Typecheck clean, `films/` untouched.

The first version searched translation first and zoom second. A 10% push read
**3.63%**, and the report's top-level `dz` was 0 while the per-shot moves said
3.598. The joint search and the per-shot report fixed both. The scale range is
±25%; a move at the edge sets `saturated: true` instead of silently clipping.

## What this cannot do, and is named

- **It is not phase correlation.** It is a brute-force search on a 48-wide luma
  grid (aspect preserved; a 9:16 film gets 48×85), with a ±8-cell translation
  search and a ±25% zoom search. On a 1920 film one cell is **40 px**, so a move
  under 40 px is invisible; the per-shot z is the compensation for slow pushes.
- **No roll, no 3D rotation, no depth.** x/y/z are translation and scale. A
  dutch angle or an orbit around a modelled body is not measured.
- **The score's camera DSL is still `move/from/to/ease`.** The measurement can
  see x/y/z, but the paper score does not yet write a 3D camera position. A 3D
  style would consume the same numbers through a new renderer.
- **Occlusion and parallax are not separated.** A character walking across a
  still frame can register as a small camera move; per-shot moves reduce this,
  not remove it.
- **Cuts are excluded from the per-frame path, not from per-shot `moves` when a
  shot starts on a cut.** The path skips a sample touching a cut; the per-shot
  moves compare the first and last frame of the shot, which is the intended cut.
- **The reference has no video in the repo.** The six reference crops have no
  motion, so the camera report is only meaningful on a reference video the user
  provides.
