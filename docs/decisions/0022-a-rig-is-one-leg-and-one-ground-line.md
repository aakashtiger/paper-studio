# 0022 — A rig is one leg and one ground line

**Status:** accepted · 1 Nov 2026
**Owners:** technical (`scripts/rig-audit.ts`, `test/cast-rig.test.ts`)
**Asset:** `films/same-alarm/vendor/office.js` (film-local rig)
**Found by:** `audit:rig` on the first delivered cut — 209 findings

## Context

The first full chain of *Same Alarm* stopped at `audit:rig` with 209 findings:

| finding | count | detail |
|---|---|---|
| knee-bend | 111 | `|bend| = 0.005 rad` — the knee dead straight |
| foot-landing | 78 | the ankle stops 3–10 px short of its target (`reach 277.5 of 273.0`) |
| head-seam | 20 | a hair anchor moving up to 24.96 units in chest space in one 0.1 s step |

They looked like three defects. They were one, and it was arithmetic:

- the leg is `156 + 117 = 273` long;
- the worker's hip was drawn **272** above the feet — the leg's own length, so a
  standing figure was straight by construction, in every pose;
- the supervisor's hip was **286** above the same 273 leg, so no pose of his could
  put a foot on the floor at all, ever;
- and the walking recipes **raise** the hip by up to 10 units above the pose
  (a −2 pose bounce, −2.2 of breathing, 6 of `stepBob`).

A target further from the hip than the leg is long is not drawn longer: the
solver clamps, the knee locks, and the foot hangs above its shadow. The rig had
been standing on two locked sticks since it was drawn, and the walking bob is
what turned a stylistic flaw into a measurable miss.

## Decision

**The hip must be low enough that the highest position any pose can put it in
still leaves the knee bent.** That is one inequality, and it is now a test:

```
reach(pose, worst bob) ≤ (thigh + shin) − 8
```

- `HIP = -258` for both office characters. With a 273 leg that spends 15 units on
  a bent knee at rest and 11 at the top of the bob.
- **A taller character is taller in the torso.** The supervisor keeps
  `SHOULDER -466` / `HEAD -530` against the worker's `-452` / `-518`; his hip is
  no higher than the worker's, because his legs are the same legs. Height that
  hangs above the legs it stands on is not height, it is a floating figure.
- The bob allowance is **read out of the painter** by the test
  (`stepBob(...)` amplitudes plus the breathing term), so a faster walk or a
  deeper breath fails the test instead of a film.
- `test/cast-rig.test.ts` covers the office rig. It read only *The Understudy*'s
  vendor rig before, which is why 209 findings reached a delivered cut: the check
  existed, the asset it should have checked was not in its list.

### Seams are attributed to the score

The 20 head-seam findings were all at a **cut** (9.5 s, 16 s, 22 s, 28.5 s, 35 s,
48.6 s) or a **declared pose key** (0.08 s before an event). A cut re-stages the
frame, and a pose snap is acting the film asked for; neither is a rig defect.

`audit:rig` now attributes a shift to a declared discontinuity within one sample
step and **reports the count and the worst attributed shift**, so the row cannot
quietly ignore what it sees. A dropped transform is still caught, because it is
continuous in the pose: it shows between two neighbouring frames with no event to
explain it, which is exactly the defect decision 0011 was written for and what
`npm run audit:rig:proof` still proves.

## What this does not claim

- **Not a proportion redesign.** The figure is still 518 units tall; the hip
  moved 14 units down, so the torso is 14 units longer and the legs 14 shorter at
  the same total height. The arms hang from the shoulder, so hand height — and
  therefore `OFFICE.seated`, which was derived from the wrist — is unchanged.
- **Not a taste judgement.** Whether the new stance looks right is judged at full
  size from the stills, like every other staging change.

## Evidence

| | |
|---|---|
| the old rig | `HIP = -272` → `test/cast-rig.test.ts` **fails**, naming the bob ("needs 274.5 of 273 at the top of the bob"); verified by mutation, which restores the file in a `finally` |
| the new rig | 8/8 in `test/cast-rig.test.ts`, both office characters, every pose |
| the film | `npm run audit:rig -- films/same-alarm/score.json` |
| the seam row still bites | `npm run audit:rig:proof` detaches a part and must still fail |

## Consequences

- A pose that cannot be reached fails in a second, before a render, instead of
  after a 70-minute one.
- Any future cast rig needs the same numbers written down once — hip, thigh, shin
  — because the test reads the rig source, not a copy of it.
- The `head-seam` count is no longer a raw number in a report: it is split into
  what the film asked for and what the rig did wrong.
