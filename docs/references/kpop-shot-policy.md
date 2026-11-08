# The shot and duration policy — one place

**Date:** 8 Nov 2026
**Status:** the system-level numbers are the user's instruction; the pacing
blend is still an open decision and is marked so.

Every style document that restates a shot length is a copy of this page. If the
numbers disagree, this page wins and the other page gets a pointer.

## What belongs to the system, and what belongs to the style

| Question | Owner |
|---|---|
| aspect, resolution, frame rate | **system** |
| film duration | **system** (the user picks 30 s to 1 h) |
| shot length band, shot count, guards | **system** (derived from duration) |
| pacing, palette, rig, sets, props, type, motifs, forbidden | **style** |

A style may narrow a system band (a slow style may refuse the 1.2 s floor) but
it may not widen it.

## Frames

| aspect | pixels | use |
|---|---|---|
| 16:9 | 1920 x 1080 | long form, YouTube, 1-3 min films |
| 9:16 | 1080 x 1920 | reels, Shorts, the 30-60 s cut |

30 fps, constant. No variable frame rate, no 24/25 fps variant.

## Shot length, by film duration

| film | min shot | median shot | max shot |
|---|---|---|---|
| under 3 min | **1.2 s** | **3.0 s** | **5.5 s** |
| 3 min and over | **3.0 s** | **5.0 s** | **7.0 s** |

The shot list is **derived**: `shots = round(duration / median)`. A 30 s film is
10 shots at the median, and must never fall below **10-11 shots**; a 60 s film is
20; a 3 min film is 36; a 10 min film is 120.

Guards, checked before a frame is painted:

1. `min <= every shot <= max`.
2. Median within +/-0.3 s of the band's median.
3. At most 15% of shots at the minimum, and at most 10% at the maximum; no two
   maximum-length shots in a row.
4. No four consecutive shots share a camera move, a composition or a set.

## What the policy does not say

- It does not say a 30 s film is 10 shots of 3.0 s. A film earns its rhythm; the
  median is a band, not a grid, and three shots at 1.6 s followed by two at 4.4 s
  is legal.
- It does not set the speech rate. A 30 s film with 9 lines cannot carry the
  180-190 wpm band; that is a writing problem, and the voice pass refuses it
  (decision 0043/0044 in the studio repo).

## Open, and named

- **O2, the 30 s pacing blend.** 30 s is at the edge of the two regimes: the
  short band (median 3.0) leaves no room for a 180-190 wpm read with nine lines.
  The recommendation is a **blended band, 165-195 wpm**, for films under 60 s.
  It is not approved item by item.
- **O1, the 54-shot gold map.** The gold film has 54 authored shots in 156.63 s
  (median 2.90 s); this policy derives 52 at the median. The authored map wins
  for the gold measurement, because the gold was not made to this policy.

## Who reads this

`docs/references/kpop-gold-standard.md` (the reverse-engineering note) and
`docs/references/kpop-system-spec.md` still carry older numbers. Where they
disagree with this page, they are wrong; the M1 law repair replaces the numbers
with a pointer to this page.
