# 0065 — Shot length, shot count and frame size belong to the system

**Date:** 8 Nov 2026
**Status:** accepted (the pacing blend for films under 60 s is open and named)
**Scope:** `studio/docs/references/kpop-shot-policy.md` (new),
`studio/docs/references/kpop-system-spec.md`,
`studio/docs/references/kpop-9-10-rubric.md`

## Context

Three documents each decided how long a shot may be:

- `kpop-system-spec.md` v1: min **1.0 s**, median **2.5–3.0 s**, max **4.5 s**.
- `kpop-9-10-rubric.md`: the same numbers, restated in the sync and motion rows.
- the 25 s test and the 60 s film: whatever the author chose, judged against the
  above.

The numbers were measured from one film (`out/claude-pop.mp4`) and then treated
as law for every film. That made a 3-minute film impossible to cut: a 180 s film
at a 4.5 s ceiling needs 40 shots minimum and reads as a slideshow, while the
gold film itself has 54 shots in 156 s (median 2.90 s) and uses 5.5 s shots.

The user's instruction is simpler: **the duration is chosen, the shot count is
derived, and the band depends on the duration.** Aspect, resolution and frame
rate are system properties too — they are not a style's choice.

## Decision

1. **The system owns** aspect, resolution, frame rate, film duration, the shot
   length band, the derived shot count, and the guard rules.
2. **The style owns** pacing character, palette, rig, sets, props, type, motifs
   and forbidden content. A style may **narrow** a system band; it may not widen
   it.
3. **Frames:** 16:9 at **1920 x 1080** and 9:16 at **1080 x 1920**, **30 fps**
   constant. No other aspect, resolution or rate without a new decision.
4. **Shot length:**

   | film | min | median | max |
   |---|---|---|---|
   | under 3 min | **1.2 s** | **3.0 s** | **5.5 s** |
   | 3 min and over | **3.0 s** | **5.0 s** | **7.0 s** |

5. **Shot count is derived:** `shots = round(duration / median)`. A 30 s film
   is 10 shots at the median and must never fall below **10–11**; 60 s is 20;
   3 min is 36; 10 min is 120.
6. **Guards, checked before a frame is painted:** every shot inside the band; the
   median within ±0.3 s of the band median; at most 15% of shots at the minimum
   and 10% at the maximum, with no two maximum shots in a row; and no four
   consecutive shots sharing a camera move, a composition or a set.
7. **One page decides.** `kpop-shot-policy.md` holds the numbers. Any other page
   that states them is a copy; where they disagree, the policy page wins and the
   copy gets a pointer. The system spec now carries that pointer instead of the
   numbers.

## What this changes today

- The **gate as built** still implements the old band (1.0–4.5 s, median
  2.5–3.0). The duration engine (K3, M1) moves `quality-check` and the audit
  rows onto the policy. Until then the gap is printed in the M1 report, not
  hidden: a film is judged by the gate that exists.
- *The Run* is 60 s with a 2.66 s median; it is inside the old band and would be
  inside the new one only after the median moves to 2.7–3.3. It is a **pre-0065
  film**: its cut is not re-timed to satisfy a law written after it. The next
  film is authored under 0065.

## Open, and named

- **O2, the 30 s pacing blend.** 30 s sits at the edge of both regimes. At a
  3.0 s median it is 10 shots, which cannot carry nine spoken lines at
  180–190 wpm (the line breaks alone are 4 s of 30). The recommendation is a
  blended **165–195 wpm** band for films under 60 s. Not approved item by item;
  it changes the voice refusal, so it waits for the user.
- **O1, the 54-shot gold map.** The gold has 54 authored shots in 156.63 s; the
  policy derives 52. The authored map wins for the gold measurement, because the
  gold was not made to this policy.

## Consequences

- A 3-minute film becomes cuttable: 36 shots at a 5.0 s median, with room for a
  3.0 s floor and a 7.0 s held shot.
- The variety policy can talk in **rates per act** instead of counts, because
  the count now comes from the duration.
- A style pack cannot quietly redefine pacing: it declares a narrowing and the
  system bands still apply.
