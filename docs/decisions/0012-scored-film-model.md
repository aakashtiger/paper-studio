# 0012 — The scored-film model

**Status:** accepted for S2
**Date:** 2026-10-28
**Evidence:** `docs/research/lemo-59-survey.md` (all 59 Lemo-Opuscar styles read)

## Context

The first S2 plan treated a film as a shot list plus a renderer, with music as
the default clock and one global character rig. The 59-style survey shows a
different and consistent production model:

- one **timed score** is the single source for picture, voice, subtitles, sound
  and checks;
- **assets are made per film**; the engine core is reused; the library grows by
  promotion, not by freezing one cast;
- **the clock varies**: music, narration, real time, reading time or free time;
- **cut density varies by style**, from zero cuts to 79 shots in 161.6 s;
- characters step at 8–12 fps while camera and light run at 24–60 fps;
- every style has one **native move** and one accent;
- QA is scripted: cue alignment, read time, ASR, subtitles, motion, model sheets.

## Decision

### 1. A film is a score, not a shot list

The authored artifact is `film.score.json`:

```ts
type FilmScore = {
  id: string;
  style: string;
  styleVersion: string;
  aspect: string;
  fps: number;
  duration: number;
  seed: string | number;
  clock: Clock;
  audio: AudioPlan;
  shots: Shot[];
  assets: AssetManifest;
  events: Event[];
};

type Clock =
  | { mode: "music"; bpm: number; offset: number; meter: number }
  | { mode: "narration"; lines: NarrationLine[] }
  | { mode: "sfx"; cues: SoundCue[] }
  | { mode: "realtime"; start: number; zero: number }
  | { mode: "reading"; base: number; perWord: number }
  | { mode: "free" };

type AudioPlan =
  | { mode: "music"; track: string; bpm: number; offset: number }
  | { mode: "narration"; voice: string; lines: NarrationLine[]; bed?: string }
  | { mode: "sfx"; cues: SoundCue[] }
  | { mode: "hybrid"; primary: "music" | "narration" | "sfx"; bed?: string };
```

`Shot` carries the recipe or scene id, duration, slots, camera, motion note,
transition and the key events inside the shot. `Event` is anything that must land
on a frame: a cut, a gesture, a word, a stamp, a light change, a sound hit.

The renderer reads the score. It does not own the creative direction.

### 2. The style owns the envelope; the film owns the choice

Each style declares:

```ts
durationEnvelope: { min: number; median: number; max: number };
clockModes: ("music" | "narration" | "sfx" | "realtime" | "reading" | "free")[];
nativeMoves: string[];
```

Rules:

- every shot is inside the style envelope and the recipe's own min/max;
- the film's median shot length is within ±25% of the style median;
- the number of shots is whatever the film needs; it is not fixed;
- a style that forbids voice or music cannot be given one.

Paper K-pop measured: 0.7 / 3.0 / 7.2 s. The 4/5/6 s proof is legal as a
deliberate proof override, not as the style's rhythm.

### 3. Assets are per film by default

Every film gets an asset stage:

```
films/<id>/
  score.json
  cast/         characters, rigs, poses, expressions, wardrobe
  sets/         stages, rooms, backgrounds
  props/        objects with named anchors
  audio/        voice, music, sfx
  stills/       character and prop sheets
```

- The film may **reuse** any approved asset at a pinned version, or create new.
- The engine core (`rig`, `paper`, `type`, `camera`, `transition`) is shared.
- After delivery, reusable assets are promoted to `library/` with a version and
  a provenance note. The library is a record of what shipped, not a constraint
  on the next film.
- A character sheet (all poses and expressions) is approved before animation.

### 4. Split motion rates

- Characters: 8–12 fps, usually on twos.
- Camera, light, effects: 24 or 30 fps.
- The renderer samples the character at its step rate and the camera every frame.
  This is the house motion grammar and it removes a class of "off" frames.

### 5. One native move per style

- Paper K-pop: snap, slam, peel, iris.
- Watercolor: paint-in, bloom, wash.
- The film is built around the native move; it is not decoration added at the end.

### 6. Six fixed critics, four gates

| Critic | Owns | Gate |
|---|---|---|
| Architect | score contract, style/engine boundary | A: score + asset manifest |
| Senior developer | rig, code, determinism | A and B |
| Designer/DOP | look, composition, light, palette, type | B: asset sheets; D: final |
| Motion director | performance, choreography, camera | C: animatic; D: final |
| Editor | shot rhythm, transitions, sound sync | A: rhythm; C: animatic; D: final |
| QA/UAT | every check, evidence, claims | A–D |

The human director holds the final call. No agent overrides taste.

### 7. QA is scripted

Every film has a `film-audit` command that checks:

- cue alignment: every event on its frame (0 ms), not "close";
- shot durations: inside the envelope, median inside the band;
- rig: no seam gap, no floating part, feet planted, contact shadow;
- frame: no blank/black, no unintended clipping, no frozen span;
- palette and type: role count, word count, overflow, read time;
- determinism: two renders hash-identical;
- captions: SRT matches the score and the read-time rule.

A film that fails rig or framing is **broken**, not "7/10".

### 8. Style and proof are separate

`STYLE.md` holds invariants. `DEMO.md` holds one film. A demo measurement becomes
a rule only when it is promoted. The demo's story, shots, palette and timings are
never reused.

## What this replaces

- The treatment-only contract (0010) becomes the shot/score subset.
- The one-time character sheet (0011) becomes per-film asset sheets plus a
  growing library.
- The fixed "5 shots at 3 s" idea is withdrawn. Cut density is style-defined.

## What this does not decide

- The exact score schema fields; that is the next implementation.
- The audio synthesis path (SFX generated in code); the score reserves the cues.
- The library storage format beyond a versioned folder and a manifest.

## Next build

1. `film.score.json` schema + validator (clock modes, envelope, assets, events).
2. Project asset manifest + library promotion, proven with Nova and Mira.
3. `film-audit` with cue, rig, frame, palette, type and determinism checks.
4. Re-cut the 15 s proof through the score, with five variable shots and a
   non-music clock (narration or SFX) to prove the clock modes.

## Amendment 2026-10-29

Amended by `docs/PRODUCTION-PLAN.md` v1.4:

- the film schema omits the `proof` flag; a deliverable cannot downgrade a recipe limit;
- the clock includes `free`; the audio plan declares `music | narration | sfx | hybrid`;
- `resolveFilm` preserves per-shot `direction` and `events`; it does not reuse the shot rebuilding in `resolveTreatment`;
- a slice is a render window of a legal film, not a separate score;
- *The Understudy* is a fixture, not the first film; the first film is the user's
  idea. The board is derived from the score, SFX are generated in code, and seven
  critics review. The core system is built before any film render.
