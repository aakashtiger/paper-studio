# The units — one meaning per number

**Date:** 8 Nov 2026
**Status:** reference. Every report in this repo measures in one of these units;
if a report does not say which, it is not evidence.

The gold film was measured three ways by three tools, and the three disagreed
about what "motion" meant. This page exists so that never happens again: a number
is only comparable to another number in the same unit, on the same reduction.

## Picture

| unit | what it is | who writes it |
|---|---|---|
| **luma mean** | 8-bit luma, 0–255, averaged over the whole frame | `look-check` → `look.json` |
| **saturation mean** | 0–255 mean of `max(r,g,b) − min(r,g,b)` after `hue=s=0` differencing | `look-check` |
| **edge density** | mean Sobel magnitude per cell, on a **192×108** reduction | `look-check` |
| **frame diff (`mean`)** | mean absolute luma difference between consecutive frames, 30 fps, on a **192×108** reduction, over the **whole** frame | `frame-diff.mjs` |
| **region diff** | the same, per cell of the **3×3** grid (64×36 cells each) | `frame-diff.mjs` |
| **face box** | the face's drawn width in **screen pixels** at the shot's own scale | render probe → `measured.json` |
| **hand travel** | forward-kinematic hand position, screen pixels, over a **0.16 s** window | `quality-check` performance row |
| **palette families** | count of hue families holding ≥1% of pixels; the top family's share | `palette-audit` |
| **palette distance** | mean Lab distance between two palettes' five dominant colours | `style:measure` |

Two properties matter and are easy to lose:

- **The reduction is part of the unit.** A 192×108 luma diff and a 48×27 RGB
  probe diff are not the same number and never will be. The gate's floor (1.0) is
  a 192×108 number.
- **The frame rate is part of the unit.** Every diff is between consecutive
  frames at 30 fps. A 10 fps draft is not comparable.

## Motion, three measurements, three questions

| probe | unit | floor | what it answers |
|---|---|---|---|
| pre-paint probe (`probe:motion`, `inspect`) | mean channel diff on a **48×27** RGB sample | travel **0.5** | is this shot a still photograph? — before a browser opens |
| delivered frame diff (`frame-diff.mjs`) | mean luma diff on **192×108** | **1.0** per frame, no run >12 frames, ≤50% quiet | does the cut freeze? — on the shipped picture |
| camera (`style:measure --camera`) | px/shot, %/shot | — | does the camera move, and which way? |

A shot can pass the first and fail the second: the probe samples 27 rows, the
delivered measure samples 108 and is stricter about a single quiet second. That is
the intended order — cheap refusal first, exact measurement later.

## Sound

| unit | definition | target |
|---|---|---|
| **LUFS (integrated)** | ITU-R BS.1770-4, `ebur128` | −14 ± 1 |
| **true peak (dBTP)** | 4× oversampled, `ebur128=peak=true` | −1.5 ± 0.5 |
| **cue level** | RMS of the **loudest 50 ms** of the cue, not the whole cue | `CUE_LOUD · gain` |
| **duck depth** | the reduction the sidechain actually applied, measured on a local reference | the declared dB |

## Text and timing

| unit | definition |
|---|---|
| **word time** | the measured word's onset in the spoken take (Whisper, local), in seconds from the film's zero |
| **snap** | the picture event's time minus its word time, in frames at 30 fps; the reaction row allows **0 to +3** |
| **subtitle dwell** | seconds a line's caption is on screen |
| **type size** | CSS pixels at 1920×1080 (or 1080×1920); never a ratio |

## What a report must carry

1. The unit (or the name of the tool that defines it).
2. The **hash of the thing it measured**: `videoHash` for a picture report,
   `score` for a paint report.
3. If it is a sample: how many frames, and how they were chosen.

A number without (1) is not comparable; without (2) it is not evidence.
