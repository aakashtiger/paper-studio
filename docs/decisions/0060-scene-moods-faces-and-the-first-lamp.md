# 0060 — Scenes have moods, faces interpolate, and the first lamp is re-blocked

**Status:** accepted, 2026-11-05. This closes the three gaps named in 0059.

## Context

0059 made characters measured and films declare a mood. It left three honest
gaps: the mood was film-level only, a face changed only by cutting between two
drawings, and the first diya was a small object at the bottom of a wide doorway.
A critic pass on the proof named the same three, plus four evidence holes the
new work would have inherited. This decision closes the three and the evidence
holes that would let a stale report call the old picture current.

## Decision

### A scene can name its own mood

- `scenes[].mood` is optional. Omitted means the scene inherits the film's
  `mood`; a named mood must be one of `identity.filmBands.moods`, otherwise
  `style:identity` and `preflight` refuse it. A typo is not a silent inherit.
- `resolveSceneBand` resolves inherit / override / absolute. The film band stays
  the film-level check; scene bands are narrow, additional checks.
- The proof declares **sc03 `interior`** while the film is `night`, so the
  override is exercised by the film rather than only by a unit test:
  - sc01 night, inherited: **80.2 / 23.1 / 10.5**, 177 frames
  - sc02 night, inherited: **66.4 / 15.4 / 11.3**, 222 frames
  - sc03 interior, declared: **104.7 / 35.8 / 10.7**, 117 frames
- The collage stage samples one frame per shot; the delivered video measures
  **every frame in each scene window** with the same `style:measure` filters
  (YAVG, SATAVG, edgedetect YAVG). The video report is the authoritative one.
- `scenesHash` is written by `preflight`, `visual:check` and `style:identity`,
  and checked by `render:film`, `gate:7` and `film:review --reuse`. A mood edit
  after a report invalidates it.
- Scene palette coherence is still the **global** palette family check. A
  per-scene hue-family row is named as open, not invented here.

### The face is a numeric vector, and it blends

- The office rig publishes `faceFields(params)`: a complete vector of
  `eyeOpen, eyeWhite, pupil, pupilAlpha, catch, eyeSmile, eyeSquint, eyeLid,
  lookX, lookY, browLift, browTilt, tear, mouthOpen, mouthCurve, mouthWide,
  mouthRound, teeth, toothLines, tongue, wobble, asym`. The string eyes/mouth
  are endpoints; every missing field is filled with its neutral value, so a
  blend cannot snap at the midpoint.
- `LakshmiV2` publishes the same idea in her own face units (`eyeOpen`,
  `eyeLid`, `pupil`, `look`, `browLift/Tilt`, `mouthOpen/Curve/Wide/Round`).
- `faceFromExpression` merges the legacy names with the rig's numeric fields.
  `faceAt(shot, lt, who)` blends the previous and next expression over a
  0.25–0.4 s window, with the opening expression in force at the cut.
- `visual:check` now refuses an expression event with no character, an
  expression for a character not in the shot, a first expression after 0.25 s,
  or two expression changes closer than 0.3 s.
- The proof uses `faceAt` in every shot. s03's `awe → kind` and s04's
  `blessing → giving` are visible blends; s01/s02/s05/s06 hold one expression.
  `blessing` and `giving` were given distinct eye and mouth endpoints.
- The sheet crop was using the pack's 2.2 zoom on a rig whose head is now 2×;
  it cut the eyes off the expression cards. A film-local expression card now
  zooms at 1.3 and shows the whole face. The 14 endpoints were checked on
  `build/lakshmi-proof/sheets/child.png`.

### The first lamp is the subject

- s01 camera is **1.02 → 1.30**, the facade/door are cropped, the diya is
  **1.6**, the child is **0.68**, and the hand carries the diya **toward** the
  child instead of away.
- The rangoli is drawn **before** the diya and the hand, so the rings no longer
  cross the flame and the wrist. The diya lights at **0.5 s**, when the lamp cue
  lands, and the hand reaches it at the same time.
- The held diya is a rig prop in s02: the child walking down the street now
  carries the flame that the `child_with_diya` device names.
- The office rig publishes `foot-left`/`foot-right` at the drawn ankle, so a
  procedural walk has a subject box even when it has no IK foot target.

### The evidence cannot go stale

- `renderInputs` parses every local `<script src>` in the page and hashes it,
  plus `tokens.json`; the old fixed six-file vendor list could miss
  `office.js`, `lakshmi-v2.js` and `proof-recipes.js`.
- `style:identity --video` reads the render manifest, refuses if any input
  moved, requires the manifest's picture hash to equal the specimen's, and
  records `manifestHash`.
- `gate:7` and `render:film` re-hash the frame report file named by the identity
  report; `frameReportHash` is no longer a presence check.
- `preflight` and `visual:check` publish `scenesHash`; the gate and renderer
  check it.
- `film:review --reuse` ties `style:identity` to picture **and** score **and**
  scenes; the other audits keep their score/picture ties. `newestPaintChange`
  now includes the film vendor, tokens and cast poses.

## Evidence

`films/lakshmi-proof/` (17.2 s, 6 shots, 3 lines, 47 words):

- picture `sha256:a35472f3def7…` (delivered)
- `gate:7` **PASS, 29 checks**; `film:review --gate --reuse` **PASS**
- identity 6/6 staged · film night 79.8 / 22.6 / 10.9; scene rows above
- palette **4 hue families / top 98.6%**, clipping 0.03%
- motion 6/6 above the floor; ASR 97.9%
- **526 tests**, typecheck clean

## Consequences / still open

- The s01 lamp is large now, but there is no **focus-size floor**: a future shot
  can still name a tiny focus. The probe box and the 10% short-side rule are the
  next work, not silently assumed.
- Per-scene palette families and a face-pixel audit are not built. The face
  proof is the sheet plus `stills` at the blend, and the video scene rows are
  full-frame-window means.
- A scene that genuinely crosses moods still uses the film's `mixed` band unless
  it declares its own; per-shot moods are deliberately not a second authored
  source of truth.
