# 0055 - *The Uber Cut* is rebuilt as a passing example

**Status:** accepted, 2026-11-05.
**Depends on:** 0051 (visual brief), 0053 (identity schema and frame report),
0054 (a line can go quiet).

## The problem

0053 made the channel a gate. The delivered *Uber Cut* failed it by design:
17 identity findings, bars in 100% of shots, no height rhythm, a 27.4 local
contrast median, blue-on-blue, office-worker leads, and five red gate rows
(`preflight`, `styleIdentity`, `closeUps`, `lra`, `soundContrast`). A gate whose
only example is the film it rejects is not a working gate.

The first rebuild attempt made the schema pass on the collage but not on the
delivered MP4: the video report sampled different frames, the H.264 encode
moved saturation, and the actor was often behind the phone or the caption. The
film looked better on a sheet and still failed on the artifact.

## Decision

Rebuild the film as a **presenter-show**, not an office explainer:

- **Cast:** `Rider` is the star, `Driver` is the foil. Both are paper-pop
  performers on the new `performer@0.1.0` rig: petal halo, cropped jacket,
  pleated skirt, platform boots. They are **roles**, not new personal names;
  the old Kiran/Vaz office characters are retired from this film.
- **Stage:** every explainer shot is full-bleed. The field is a declared
  `stage.field` role; the floor, torn lip, spotlight and halftone are the
  pack's. The old cream plate between two cobalt/tomato wings is off by default
  and no shot uses it.
- **Props:** the phone, app, city and fare card are **props beside the
  performer**, not the stage. The app phone moves right, the map phone moves
  right, the fare card moves above the pair. The performer keeps a clean
  aperture ring.
- **Captions:** one or two words, so the paper tab cannot sit over the figure.
  The narration carries the full sentence.
- **Scale rhythm:** the star is a 56-60% figure in the network and money
  shots, a 36-40% figure beside a phone, and a close-up only where the face is
  the event. Close-ups are 30% of shots, inside the 20-60% band.
- **Colour:** deep cobalt, tomato/oxblood, kraft, cream and marigold; no
  blue-on-blue, no cream plate, no side bars. Warm share and saturated share
  are measured on the delivered video, not the collage.
- **Sound:** v04 is marked `gainDb: -16` (0054). The words stay at 17.5-23.3 s,
  so there is no narration hole; the 3 s contrast is 17.8 LU and LRA 16.5.
- **Bars are a layout, not a prop.** The frame report's bar rule now requires a
  hard inner edge, and a plate requires **two different** edge colours plus a
  cream centre. The old rule counted any edge run, so a phone standing at the
  right edge read as a bar. The rebuilt film has 0% bars and 0% plates; the old
  Uber's cobalt/tomato wings still fail the plate rule.

The two P0.7 holes the rebuild found were closed in the same change:

- `preflight` no longer calls an existing MP4 a reproduction when its video
  stream matches the current `render-manifest.json`; a re-render of the film
  you just delivered is not an old film.
- `film:review --reuse` reads `ok` + the identity section for a reused
  `preflight` report. It used to read only `pass`, a field preflight does not
  publish, so every reused review printed a false preflight FAIL.

## Measured

```
style:identity -- films/uber-model/score.json --video
  PASS · 10/10 staged · luma 112.2 (75-130) · sat 29.0 (12-35) · edges 8.6 (7.5-17.5)
  centroid 100% · close-ups 30% · local contrast 35.1 median (100% >=20)
  bars 0% · plate 0% · blue-on-blue 0% · warm 78% · saturated 53% · mean luma 85

gate:7
  PASS · 28 checks · nothing manual
  LRA 16.5 LU · 3 s contrast 17.8 LU · delivered -14.2 LUFS / -2.3 dBTP

film:review --gate --reuse
  PASS · preflight, audit, visual, board, storyboard, sheet, sfx, mix, strips,
  frame-audit, paint-match, motion-audit, type-audit, rig-audit, deliver,
  style:identity, gate:7

asr
  91/91 script words (100.0%) on the delivered file
```

The delivered picture is `sha256:fe8ae0fec206...`; the file is
`films/uber-model/uber-model.mp4`. The old delivered files are under
`build/uber-model/historical/`.

## Proof

```
npm run style:identity -- films/uber-model/score.json --video
npm run gate:7 -- films/uber-model/score.json
npm run film:review -- films/uber-model/score.json --gate --reuse
npm run asr -- films/uber-model/score.json
npm run typecheck && npm test
```

**493 tests**, typecheck clean.

## What this does not do

- The subject box is still the chest/head/leg **aperture**, not a drawn
  silhouette. The petal halo is partly outside the box on the narrowest
  figures; the report says so.
- One sample per shot. A mid-shot defect can still be missed.
- The asset manifest still carries unused office-era entries; coverage passes,
  but the list is not a clean inventory.
- No music, no semantic vision, no exact financials. P0.5 remains parked.
- The old `identity:accept` calibration (reference passes, old Uber fails) is
  historical. The rebuilt film passes; it is not the negative control any more.
