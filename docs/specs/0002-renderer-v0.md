# Spec 0002 — Renderer v0

**Status:** ready to build · week 1–2
**Owner:** technical
**Depends on:** 0001 (planner)

## Goal

Turn a `RenderPlan` into an MP4 for `fixtures/wedding-min`.

Start with three shots, preview resolution, no audio. Then expand to six shots, full resolution, audio and encode.

## Interface

**Input:** the `RenderPlan` JSON produced by `npm run plan`.

**Output:**

```
out/<projectId>/
  frames/<shotId>/<frameNumber>.jpg
  video.mp4
```

**Commands:**

```bash
npm run render -- fixtures/wedding-min
npm run render -- fixtures/wedding-min --preview
npm run render -- fixtures/wedding-min --shots=s01,s02
```

- `--preview` renders 540×960 and skips every second frame in the encode, for speed.
- `--shots` renders a subset. This is what makes revisions cheap.

## Rules

- 30fps. Frame count per shot is `duration * 30`, rounded.
- Canvas size from aspect: `9:16` → 1080×1920, `16:9` → 1920×1080, `1:1` → 1080×1080.
- Deterministic: no `Date.now()`, no unseeded `Math.random()`, no network.
- Fonts are loaded from `assets/fonts/`, never from the system.
- ffmpeg is a pinned binary, invoked with explicit parameters.
- Every frame writes to disk; encoding is a separate step.

## Shot contract

Each recipe maps to a render function with the same signature:

```ts
type ShotRender = (args: {
  ctx: CanvasRenderingContext2D;
  shot: ShotPlan;
  style: StyleTokens;
  palette: Palette;
  frame: number;      // 0-based, within the shot
  frameCount: number; // total frames in the shot
}) => void;
```

The function draws. It does not decide timing, transitions or ordering. Those come from the plan.

The registry lives in `src/engine/recipes/index.ts`:

```ts
export const recipeRenderers: Record<string, ShotRender> = {
  invitation_unfold: renderInvitationUnfold,
  names_lockup: renderNamesLockup,
  monogram_end: renderMonogramEnd,
  // ...
};
```

If the plan names a recipe with no renderer, fail loudly before rendering any frame.

## Frame loop

```
for each shot in plan.shots:
  clear canvas
  draw background from palette
  recipeRenderers[shot.recipe](...)
  draw global overlays (grain, vignette) from tokens
  write frames/<shotId>/<frame>.jpg
```

Overlays are applied once, globally, not per recipe.

## First milestone

Three shots: `invitation_unfold`, `names_lockup`, `monogram_end`.

- 540×960 preview.
- Stills at 0%, 50% and 100% of each shot.
- Acceptance:
  - names are legible at phone size
  - nothing is clipped by the 9:16 safe zones
  - two runs produce identical still hashes
  - the renderer reads every colour and font from the style pack

Do not build text layout beyond a single line per slot yet. Do not build transitions.

## Second milestone

All six shots, 1080×1920, audio from the plan, encoded to MP4.

Acceptance:

- duration within one frame of the plan
- audio present and not clipping
- the film plays on mute and still communicates names, date, venue and RSVP
- golden frame hashes committed in `fixtures/wedding-min/golden.json`

## Out of scope

- photo treatment
- transitions
- 16:9 and 1:1
- multiple palettes
- the web app

## Reference

Port from `reference/paper-kpop/core.js` and `reference/paper-kpop/type.js`. Do not import them. Copy the math, the texture functions and the transform model into the new renderer, then delete what you do not use.

## Notes for the technical owner

- Keep the renderer a pure function of `(plan, style, frame)`. No hidden state.
- Put every recipe in its own file under `src/engine/recipes/`.
- If a recipe needs a font metric, measure at load time and cache it — never measure inside the frame loop.
- Prefer drawing in a normalised 0–1 space and scaling once, so 9:16 and 16:9 share code later.
