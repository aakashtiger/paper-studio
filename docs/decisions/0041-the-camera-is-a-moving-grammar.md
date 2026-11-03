# 0041 — The camera is a moving grammar, not a per-shot accident

**Status:** accepted · 4 Nov 2026
**Owners:** creative (`styles/paper-kpop/tokens.json`), technical (`src/engine/camera.ts`, `scripts/camera-*.ts`)
**Depends on:** 0039 (the camera is measured in x/y/z)

## Context

The reference shorts almost never cut without the camera doing something: they
glide, push, pull back and orbit, and the move is part of the style. Our paper
pack allowed `static` as its default, three recipes use it, and *Same Alarm*
shipped one shot with no camera block at all and a run of four identical push-ins.
The film could pass every motion probe because the *subject* moved while the
camera did not.

The user's direction: for this style, decide the camera grammar ourselves. Not
static. More dynamic. Use the reference structure for every film so they look
like one template, but do not copy the same sequence each time.

## Decision

**A film's camera is checked as a grammar, and the style proposes a plan.**

`tokens.motion.camera` now declares:

```json
{
  "moves": ["static","push_in","pull_back","pan","tilt","orbit","parallax"],
  "default": "push_in",
  "requireMove": true,
  "minDistinct": 3,
  "maxRun": 2,
  "byBeat": { "hook":"orbit", "setup":"pan", "escalate":"push_in",
              "turn":"pull_back", "release":"parallax", "button":"push_in" }
}
```

- **`camera:check`** refuses a shot with no camera, a `static` move, a move with
  no travel (`from === to`), a `push_in` that pulls, a `pull_back` that pushes,
  an unknown move/easing, fewer than 3 distinct moves, and more than 2
  consecutive shots with the same move.
- **`camera:plan`** proposes one dynamic move per shot from the beat, breaks a
  run, and uses the film's seed for the fallback. It is a dry run unless
  `--apply` is given. The result is a template — same grammar, different
  sequence — not a fixed list copied into every film.
- The chain runs `camera:check` after the score audit and before preflight, so a
  still camera is refused in ~0.1 s, not after a render.

## Measured

*Same Alarm*, 10 shots, before the plan:

```
camera: 10 shots · 4 move(s): push_in, pan, orbit, pull_back
  FAIL camera:sign: shot "s08" is a push_in but 1.04 → 1
  FAIL camera:run: 4 consecutive shots use one move
```

`camera:plan --apply --force` on a copy produced:

```
s01 push_in 1→1.05 · s02 pan 1→1.04 · s03 orbit 1→1.03 · s04 pull_back 1.08→1
s05 parallax 1→1.03 · s06 tilt 1→1.04 · s07 push_in 1→1.05 · s08 pan 1→1.04
s09 orbit 1→1.03 · s10 pull_back 1.08→1
```

`camera:check` then passed: **4 distinct moves, longest run 1**. The plan is the
template; the score remains the director's, and a beat table overrides the
fallback.

**440 tests**, typecheck clean, `films/` untouched.

## What this does not do, and is named

- **It does not invent a new move.** The closed `CAMERA_MOVES` vocabulary is
  unchanged; the change is that a shot must use one and the film must vary it.
- **It does not measure whether the rendered move matches the plan.** 0039
  measures x/y/z on the picture; this checks the score. The two are not joined
  yet.
- **It does not add roll, whip pans or 3D orbits.** A 3D style needs a renderer
  that can perform them.
- **`parallax` and `tilt` are declared but not new physics.** They use the
  painter's existing camera path; a style that needs a different computation
  extends the pack, not this check.
