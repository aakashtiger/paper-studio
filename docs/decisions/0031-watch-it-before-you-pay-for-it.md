# 0031 — Watch it before you pay for it

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`scripts/draft.ts`, `scripts/render-film.ts --draft`)
**Depends on:** 0023 (a frame is pure), 0027 (the collage checks itself), 0029 (one pass)

## Context

After 0025–0030 the loop could write a film, refuse a bad cut, paint one frame
per shot and measure movement, type and rig in one pass. What it still could not
do is **show you the film**.

The two ways to look at a cut were:

- the **collage** — one frame per shot, silent, no motion, no timing;
- the **final render** — ten minutes for 1,800 frames, and the only thing on the
  machine that produces a film.

So the first time anyone saw the cut move — with its sound, its pace, the rhythm
of the cuts — was after paying for it. Nine renders of *Same Alarm* is what that
costs when the first look is also the last one.

## Decision

**`npm run draft -- <score>` paints the whole film at a low frame rate, with the
master muxed, and writes no manifest.**

- **10 fps by default** (a third of the frames of a 30 fps film); `--fps` takes
  12 or 15 when a draft has to be more faithful.
- **The same painter, the same absolute times.** A frame is a pure function of
  the film's time (0023), so every frame it paints is the frame the film will
  have. Only the sampling is coarser — nothing is invented and nothing is
  approximated.
- **It writes no manifest.** The manifest is the claim that a picture *is* the
  deliverable; 10 fps is not 30. `deliver`, `audit:frames` and `gate:7` all read
  that manifest, so a draft can never be mistaken for the film.
- **It is not gated.** A draft is an instrument, like a stills pass: it exists so
  a person can judge the film *before* the gates that stop a film being painted.
  Refusing to show you a film because it fails the movement probe would take away
  the very thing you need to see in order to fix it.

### Measured

*Same Alarm*, 60 s, 10 shots, 1,800 frames at 30 fps:

| | frames | wall clock |
|---|---|---|
| draft at 10 fps, 4 workers | 600 | **3 min 52 s** |
| the film at 30 fps, 4 workers | 1,800 | ~12 min |

The draft is 1920×1080, 60.0 s, H.264 with AAC — the delivered audio track, so
what you hear is the master that will be muxed into the film. That is the whole
point: the mix, the narration timing and the cut can be judged together, three
times faster than the film that carries them.

## Where this sits in the loop

```
story -> beats -> score -> preflight (1 s) -> inspect (1 min)
      -> collage (30 s) -> sfx -> mix -> draft (4 min) -> look and listen
      -> render (12 min) -> deliver -> gate
```

The draft is **not** a chain step. A chain run has nobody watching it, so a
4-minute preview would be 4 minutes of paint nobody looks at. It is a deliberate
command, run when a person is ready to sit and watch.

## What this does not change

- The film's own frame rate, resolution and encode are untouched: the draft is a
  separate file (`films/<id>/draft.mp4`, gitignored like every render) and a
  separate code path that returns before the manifest is written.
- `rough` and `animatic` still exist: the board animatic is the pre-picture pass,
  the rough is the stepped board, and the draft is the first pass that is *this
  film*, at its real timings, with its real sound.

## Landed

- `scripts/render-film.ts` — `--draft`: paints the whole range at the given fps,
  writes no manifest, is not gated; prints "a preview, not the deliverable".
- `scripts/draft.ts` — `npm run draft -- <score.json> [--fps 10] [--workers 4] [--out]`;
  finds `build/<id>/mix/master.wav` and muxes it, and says so when there is no
  master yet (a silent draft is a reasonable thing to want, and a surprising
  thing to get by accident).
