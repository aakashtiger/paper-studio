# 0014 — Frames are a function of time alone

**Status:** accepted · 30 Oct 2026

## The bug

`films/understudy/backend.js` `poseFor()` returned the live object from
`window.POSES`:

```js
return pose ? pose.params : {};   // the library object itself
```

`stage()` then adjusted that object in place:

```js
poseA.sway = (poseA.sway || 0) + look * 3;
```

Because the same object is the library entry, each painted frame added 3 px to
the pose's `sway` *permanently*. Painting the film in order drifted the value:

| time | sway |
|---|---|
| 17.0 s | 15 px |
| 18.0 s | 105 px |
| 19.0 s | 195 px |
| 20.0 s | 237 px |

By 18 s the skirt hem was thrown 100 px sideways and the torso had rotated past
90°; by 20 s the character was upside down. The delivered MP4 was broken through
17.5–21.5 s and clean everywhere else.

## Why it hid for a day

The bug is a function of **draw history**, not of time. A stills run paints a
handful of frames, so `sway` moves a few pixels and looks correct. Every
still-frame check agreed the frame was fine; the video was not. The earlier
search in `vendor/characters.js` (hair fan, pleated skirt, duet scale) could
never have found it: the vendor code is innocent.

## The fix

`poseFor()` returns a copy (`clonePose`, arrays sliced). Callers may adjust a
pose freely; the library is never mutated.

`test/painter-history.test.ts` pins both halves:

1. painting 630 frames leaves `window.POSES` byte-identical;
2. the frame at 19 s is identical painted cold and after 600 frames of history.

## The rule

A frame is a function of its time alone. Any painter state that survives a
`clearRect` is a bug. If a still looks right but the video does not, the
history is wrong — not the drawing.

## Tooling added the same day

- `npm run audit:paint` — paints sampled times through the renderer's `--stills`
  path, extracts the MP4 frame at the same time and compares with PSNR
  (~40 dB correct, 10–20 dB wrong). This is the check that separates "the video
  is well formed" from "the video is what the painter draws".
- Removed the hard paper fill at the end of `pullback_close`
  (`backend.js`), which flashed the last frames beige on top of the closing iris.
