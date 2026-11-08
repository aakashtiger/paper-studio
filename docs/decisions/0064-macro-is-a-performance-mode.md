# 0064 — A macro shot declares itself, and is exempt from the rig metrics

**Date:** 8 Nov 2026
**Status:** accepted
**Scope:** `proofs/kpop-crime-60/film.json`, `scripts/quality-check.mjs`,
`studio/docs/references/kpop-9-10-rubric.md`, `studio/docs/references/kpop-variety-policy.md`

## Context

The ten-row gate's performance row is measured from the paint path: every shot
must show a cast member with ≥3 poses, ≥2 pose changes, ≥1 gesture, ≥2 faces, a
still run under 1.2 s, no T-pose, and a face of at least 90 px. The rule is
right for a staged shot: it caught a T-pose and a still shot that a hand-written
table had hidden (0063).

*The Run* has one shot that is not staged: **s02**, a close-up of a hand opening
over the knife in the rain. The hand is drawn directly at the cast's scale; there
is no torso, no head, no rig. The row reported `s02: no cast registry` and the
film could not reach 10/10 for a shot that is *correct*.

The gold film has this mode: of its seven performance modes, **macro** is 6 of
54 shots (11%). The gate had no way to say "this shot is a hand and a prop".

## Decision

1. A shot may declare `performance: "macro"` in `film.json`. The declaration is
   part of the shot, next to `set` and `camera`.
2. The performance row reads the declaration **only when the measurement agrees
   with it**: no cast of a registered name was drawn in the shot's frames. A
   macro shot whose frames do contain a rig is not exempt; it fails as before.
3. A macro shot is still held to **row 2 (motion)**, to the type row and to the
   look row. The exemption is about rig metrics, not about being allowed to be a
   still image.
4. `storyboard-check`, `shot-cards` and the frame audits are unchanged: a macro
   shot still needs a still, a card and a hand sheet.

## Consequences

- *The Run*'s s02 passes as `macro (hand + prop, no rig)`, and the other twenty
  shots are unchanged. The gate can reach 10/10 for the right reason.
- The rule is a **declaration the gate can refuse**. It cannot be used to skip
  performance in a staged shot: if a rig is drawn, the metrics apply.
- The rubric row 5 and the system spec now name the exception; the M1 law repair
  points both at this decision instead of restating the rule.

## What this does not solve

- The gate still cannot tell a good macro from a bad one. It only knows the shot
  is a hand and a prop.
- `performance` is one declared string. The other six gold modes (stage,
  diagram, creature, close, chase, diorama) are not yet read by any check; the
  variety policy asks for them, and M1 will make the field required.
