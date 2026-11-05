# 0058 — The voice is not a dynamics control

**Status:** accepted, 2026-11-05. This changes the gate and the visual contract; it
does not change the Paper K-pop construction.

## What the rejection exposed

The 60 s *Lakshmi and the Lights* passed the old 28 checks and was still rejected
on the picture. Three of the defects were structural, not artistic:

1. **The voice was turned down to pass LRA.** Line `v02` carried `gainDb: -19`
   because a continuous read could not meet the old LRA/sound-contrast floors.
   The audience heard the drop. A gate that pays for its numbers with the voice
   is measuring the wrong thing.
2. **A shot could sit still for eight seconds.** The edit allowed `maxShot: 8`;
   the proof's opening line was split into two shots only after the rejection.
   A short/reel has no room for a scene sitting still.
3. **A cast member could be in frame and never change pose.** The 0056 contract
   checked that a performer had an action in prose, not that the picture moved.
   The 60 s film removed its pose events and still passed.

## Decision

### Voice

- Narration is **one level**. `gainDb` may not attenuate a line below its
  recorded level; the new `voiceLevel` gate row refuses it.
- A film declares `audio.dynamics: "continuous"` when the voice is the floor as
  well as the lead. For that film, LRA and 3 s sound contrast are **informational**
  and the voice-level row is the refusal. Contrast comes from the picture and
  the cues, not from turning a word down.
- `dynamic` remains the default for a film that genuinely wants a quiet line;
  it must say so, and the old `gainDb` hack is no longer a way to pass.

### Reel duration

- `preflight` now refuses any shot longer than **4.5 s** in a film of 60 s or
  less (`pacing:reel`). The factor rule (`longest <= 2 x median`) still applies.
- The 60 s *Lakshmi* film is refused by this rule (its longest shot is 6.9 s).
  That is the point: it was a scene, not a shot.

### A body must perform

- `visual:check` contract **3** refuses a shot that stages a cast member with no
  `pose` event after the cut (`visual:performer-static`). A body in frame is not
  a performance.
- A film declares `visualContract: 3`; older films omit it and are read under
  contract 2, so their historical evidence is not rewritten.
- A **caption-free film is legal**: the SRT carries the words. `audit:type` no
  longer fails a film with no on-screen copy slots (`copyMarked` is true when
  there is nothing to mark). The proof has no labels over the picture.

### Rig seams

- The proof publishes its legs through `solveLeg` + `limb` for both characters,
  so the rig audit has 266 paired legs and no unpaired solve.
- A rise is a **body translation/scale**, not a continuous arm-angle creep
  between pose keys. The arms change only at declared poses, which keeps the
  in-parent anchor shift inside the 1.5-unit seam limit.

## The 17.2 s proof

`films/lakshmi-proof/` is a fresh short, not a re-cut: **17.2 s, 6 shots, 3 lines,
47 words, 3 cues**, no shot over **3.7 s**, four-armed `LakshmiV2` and `ChildV2`,
a real lotus/river reveal, an eight-fold rangoli and a brass thali.

- picture `sha256:95292d82a47d58b13bb8a5efc245c769ebbcaf6c312bc285d32fde85077ec597`
- `gate:7` **PASS, 29 checks** (the new `voiceLevel` row)
- `film:review --gate --reuse` **PASS**
- `voiceLevel` 3 lines, worst attenuation 0.0 dB
- `lra`/`soundContrast` continuous narration: informational, voice level is the refusal
- 6/6 shots above the motion floor; longest hold 0.00 s
- `audit:body` 2/2; `audit:reaction` 1 event on `v02` at +0.0 frames
- ASR 97.9% (47/47 words; one spelling, `rangoli` → `Rangali`)
- palette worst outlier 0.27%; style identity pass; 3/6 staged, height tiers 3

The 60 s score and its 28-check pass remain historical evidence, not a current
pass. It is not re-rendered under 0058.

## What this does not change

- The Paper K-pop construction, palette roles, one hard key, shadow, halftone,
  camera grammar, frame bands, hands/face, and the 0056 phrase/device contract.
- The 4.5 s ceiling is a short/reel rule; a feature-length film may still hold.
- The old films keep their contract 2 reading and their existing hashes.
