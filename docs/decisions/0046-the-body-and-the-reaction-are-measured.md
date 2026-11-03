# 0046 — The body and the reaction are measured

**Status:** accepted · 4 Nov 2026
**Owners:** shared (`src/engine/pose.ts`, `src/engine/reaction.ts`, `src/engine/frame-audit.ts`)
**Depends on:** 0024 (the rig), 0038 (the character library), 0037/0044 (the measured read)

## Context

Three defects had no command (P0.4): a **plank arm**, a **hand smaller than a
thumb**, a **reaction that lands before its word**, and a **one-frame pop at a
cut**. A still cannot show the first, the third or the fourth; the sheet can
show a hand but nothing compared it to anything. The rig already published the
chest, head and hair anchors (0024), and the probe wraps those calls. The body
had no such publication, and the score had no way to say "this pose answers
that line".

## Decision

- **The body is published.** `PoseLibrarySchema` gains an optional `body`:
  `arm.upper`, `arm.fore`, `arm.minElbow`, and the hand/thumb boxes. The shared
  library (Kiran, Vaz) carries it. `resolvePoseLibrary` refuses a hand narrower
  or shorter than **1.5× its own thumb**, and a pose whose two declared elbows
  are both straighter than `minElbow` (`body:plank`). A partial pose that
  declares one arm is not a plank; it inherits the other arm from the rig.
- **`npm run audit:body -- <score>`** reads the **library** character for each
  cast member (a film-specific cast falls back to its own file) and refuses a
  cast member with no body. It writes `build/<id>/body-audit.json`.
- **`event.word`** names the clock line a reaction answers. `resolveFilm`
  refuses a word the clock does not have, or a word on a non-narration clock.
  **`npm run audit:reaction -- <score>`** measures the line's measured start to
  the event and requires **0–3 frames** after it, with half a frame of grid
  tolerance. Earlier is `reaction:early`; later is `reaction:late`. A narrated
  film with no word-bound event is **not instrumented** and fails.
- **`findPops`** in the frame audit flags the first frame at a cut when it is
  at least 40 luma units brighter or darker than **both** the shot it left and
  the shot it entered, and the next frames have settled. A cut that changes
  exposure is not a pop.

## Measured

- `audit:body` on Same Alarm: Kiran `worker@0.1.0` hand **22×32** (thumb
  7.6×11.2), Vaz `supervisor@0.1.0` hand **18×26** (thumb 8×12), 8 poses each,
  **pass**.
- A synthetic Test character with a **5×6** hand and a pose with both elbows at
  **0.000/0.000** produced three findings (`body:hand` twice, `body:plank`) and
  exit 1.
- `audit:reaction` on a Same Alarm copy: a pose at **12.40 s** against line
  `v03` at **12.40 s** is **+0.0 frames**, pass; moved to **12.30 s** it is
  **−3.0 frames**, `reaction:early`, exit 1.
- `test/frame-audit-split.test.ts` adds three pop cases: a one-frame flash is a
  pop, a cut to a new exposure is not, a jump under 40 luma is not.
- **460 tests**, typecheck clean.

## What this does not do

- **The body box is declared, not measured from pixels.** It is the rig's own
  two `limb` lengths and two hand `blobPath` radii, written in the pose library;
  a painter that draws a different hand without changing the box would not be
  caught. A paint-level hand probe is the next step if that becomes a real
  defect.
- **The first film must author `word` events.** Same Alarm has none, so
  `audit:reaction` reports it as not instrumented (use `--allow-none` only for a
  legacy reproduction). The new film's poses must carry `word: "<line id>"`.
- **A reaction is one event, not a hold.** The check measures the landing, not
  whether the expression stays for the line.
- **The pop threshold is one number.** A style may need its own; 40 luma is the
  default, and `--pop-luma` overrides it.
