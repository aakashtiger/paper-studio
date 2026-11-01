# 0034 — The frame audit measures per shot, and its blank check can now fail

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/frame-audit.ts`, `scripts/frame-audit.ts`)
**Depends on:** 0023 (a frame is pure), 0029 (one pass), 0033 (a report is tied to this film)

## Context

After 0033 the chain tail measured like this (*Same Alarm*, 60 s, render reused):

| step | cost |
|---|---|
| **frames** | **134.4 s** |
| paint | 73.3 s |
| review | 62.0 s |
| determinism | 47.6 s |
| motion · collage · asr · gate · sfx · deliver · mix · palette · sheet | 62 s together |

The frame audit was the largest step in the tail, and it was four full decodes of
the same 1,800 frames:

| pass | cost | what it did |
|---|---|---|
| `ffprobe -count_frames` | 22.5 s | decoded the film only to count its frames |
| `signalstats` | 52.0 s | per-frame brightness (blank frames) |
| `select='gt(scene,0.03)'` | 1.5 s | scene cuts |
| `tblend=difference,signalstats` | 58.3 s | frame-to-frame differences (holds) |

Two experiments decided the change.

**Merging the two filter chains into one decode does not help.** One ffmpeg
graph with `split=2` and both chains took **116.1 s** against 110.5 s for the two
separate passes. The filters, not the decode, are the cost.

**Decoding per shot does.** The same two filters over the same frames, run as ten
shot-sized decodes with `-ss`/`-t`, took **36 s** (blank 16.7 s + diff 19.2 s)
instead of 110.5 s. `motion-audit` had been doing exactly this all along, which
is why it costs 20 s for the same filter.

## Decision

**The frame audit decodes each shot separately, and takes its frame count from
the frames it actually measured.**

- Frames per shot: `frameTimes(from, count, fps)`; differences per shot:
  `diffTimes(from, count, fps)` — pure functions with tests, so a split decode
  puts every sample back on the film's own clock.
- The count is `stats.length`: the frames this audit decoded and measured. A
  count taken from another pass can agree with a picture nobody measured, and
  `ffprobe -count_frames` spent 22.5 s asking the question by decoding the film
  again.
- The scene-cut pass stays whole-film (1.5 s) because a cut is a relationship
  across shots, which is exactly what a per-shot pass cannot see.
- A shot's frame-to-frame diff *across* a cut is not measured. It is not a hold,
  and in the whole-film pass it only inflated the reported activity median with
  one spike per cut.

### The blank check could not fail

While proving the values identical, one check turned out to be dead. It was:

```
YAVG < 8 || YAVG > 247
```

Ordinary SDR video is limited range: legal black is **Y=16**, legal white is
**Y=235**. Measured on a synthetic black clip: `YMIN = YAVG = YMAX = 16`. Neither
threshold could fire on a real film, so `noBlankFrames` was a gate row that could
never fail — the worst kind of guarantee.

The rule now judges the video's own range **and** requires the frame to be
uniform:

```
blank  =  (YAVG <= 18 or YAVG >= 233)  and  (YMAX - YMIN <= 6)
```

`18`/`233` catch both limited (16/235) and full (0/255) range. The uniformity
term is what keeps a night scene with one lit window from being called blank: its
average may sit near black, but its spread does not. A flat mid-grey frame is a
colour card, not a blank frame.

## Measured

*Same Alarm*, 60 s, 1,800 frames:

| | before | after |
|---|---|---|
| frame audit | **134.4 s** | **38.5 s** |
| chain tail (render reused) | 393.4 s (6.6 min) | **297.1 s (5.0 min)** |

### The reschedule measures the same pixels

Decoded both ways and compared sample by sample:

- **brightness**: 1,800 samples in both methods, **identical in value and order**;
- **differences**: 1,799 whole-film vs 1,790 per shot — the 9 missing are the
  diffs across a cut — and after dropping those 9, **identical**.

The report before and after, field by field: `expectedFrames`, `frameCount`,
`blankCount`, `luma` (71.64–195.26), `cuts` (12), `expectedCuts`, `missedCuts`,
`holds`, every `checks` entry and `pass` — **all the same**. Only `diff.median`
moved, 0.912 → 0.909, because nine cut spikes are no longer counted, and
`pending` is now empty (ASR became a gate row; it had been the one entry).

### The blank rule refuses a real defect

A 4 s clip was built from the film with **0.5 s of black inserted** at 1.5 s.
The audit now reports:

```
frames 120/120 · luma 16.0-83.3
cuts 4 · missed 0 · blank 15 · longest hold 0.47s
```

`blankCount 15`, `noBlankFrames false`, exit 1. The film itself is unchanged:
`blank 0`, `pass true`, `gate:7` **PASS · 21 checks · nothing manual**.

## What this does not change

- Every frame is still measured for brightness, and every difference inside a
  shot is still measured. No sampling, no `--step`, no smaller picture.
- The report keeps the fields its readers use (`frameCount`, `blankCount`, `pass`,
  `hash`, `videoHash`), so `film:review` and `gate:7` are untouched.
- A diff pass that measures nothing now **throws** instead of yielding an empty
  list that reads as "no holds". The old `.catch()` made a failed pass look like
  a pass.
- No new dependency, no network.

## Landed

- `src/engine/frame-audit.ts` — `frameTimes()`, `diffTimes()`, `isBlankFrame()`,
  `BLANK_BLACK`, `BLANK_WHITE`, `BLANK_SPREAD`.
- `scripts/frame-audit.ts` — per-shot decodes; `parseSignalStats` also carries
  `YMIN`/`YMAX`; the count is the measured frame count; `pending: []`.
- `test/frame-audit-split.test.ts` — 11 cases: the clock grid, the diff offset,
  and the blank rule including the regression that the old thresholds could not
  see legal-range black.
