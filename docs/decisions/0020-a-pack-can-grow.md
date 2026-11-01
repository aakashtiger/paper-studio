# 0020 — A pack can grow without re-cutting its own film

**Status:** accepted · 1 Nov 2026
**Owners:** technical (`src/core/style.ts`, `test/`) and creative
(`styles/paper-kpop/recipes/**`, `card.html`)
**Pack:** `styles/paper-kpop/` 0.2.0 · 16 recipes
**Blocks:** the first real film (*Same Alarm*), and every pack after it

## Context

The first real film needed a world. *Same Alarm* is a day: a bedroom before
dawn, a corridor, a desk under a fluorescent bar, a window at dusk, a card. The
paper painter lives in the pack (decision 0015), so the world was painted there —
eight office recipes in `styles/paper-kpop/recipes/`.

That is fine until the pack's own films are considered. `paper-kpop-song` and
`paper-kpop-shorts` pick a recipe **by beat role**: for each beat, take the
recipes that declare the role, sort by id, take the first whose slots resolve.
Nothing about that rule mentions *which* recipes the format was accepted with.
So the moment eight recipes were added, the pack's accepted 14-shot song resolved
to a different film: `alarm_close` took the `open` beat because `a` sorts before
`p`, and the sealed blind resolved to a shot list with the alarm twice at the
front. Every audit stayed green, because every audit was about the pack as it is,
and none was about the pack as it was accepted.

Two smaller defects of the same shape were in the same push:

- **The validator refused a recipe the resolver accepts.** `loop_card` declares
  `content.caption` as an *optional* slot — `plan.ts` and `treatment.ts` both
  honour `optionalSlots` — but `slot-contract` in the validator read
  `recipe.slots` only and failed the pack as DRAFT. One rule, two readings.
- **The hour tab had no box.** Eight recipes declared the tab at `h: 0.06`, which
  is a one-line box at phone scale. The pack's geometry proof feeds every recipe
  the *widest* string its slots may carry ("I hear the crowd through the wall"),
  and at the 14 px floor that needs three lines: the tab's box held 13 px of
  text space. The pack could not be REVIEWABLE and the painter had nothing to
  obey.

## Decisions

### 1. A format names the recipes it uses

`format.recipes` is an optional list of recipe ids. When present, only those
recipes are candidates for the format's beats. When absent, any recipe in the
pack may be used — which is what the sealed 0.1.0 blind format does, and why its
own gate reads the sealed pack.

`formats/paper-kpop-song/format.json` and
`formats/paper-kpop-shorts/format.json` now name their eight recipes. The office
set keeps the beat roles it honestly has (a desk shot *is* a detail shot); it is
simply not in either pool.

This is the rule that makes a pack maintainable: **a recipe may be added to a
pack without changing what any shipped format cuts.** It is proven, not asserted:
`test/paper-kpop-0.2.0-gate.test.ts` resolves both formats against the live 0.2.0
pack and compares the shot list, recipe for recipe, to the sealed 0.1.0 plans.

### 2. `optionalSlots` is part of the slot contract

`slot-contract` now reads `slots` and `optionalSlots` together, and refuses a
recipe that lists the same slot in both. `needs a slot it does not declare` and
`needs a slot it only optionally declares` are different statements, and the
validator now means the first one.

### 3. The hour tab is a zone, and the 14 px floor sizes it

`officeHourTab` sets its label inside a declared box — `x 0.062, y 0.078,
w 0.34, h 0.27` at 16:9, which is 120,84 by 653,291 px at 1920×1080 — wrapping at
16 phone-scale px down to nothing below 14, and **clipping to the zone**. An hour
is one line and looks exactly as it did; a caption that is a whole line of lyric
wraps to three, and a pathological one is cut off inside the box rather than
drawn outside it. Shrinking type to fit a longer string is the one thing the
floor forbids, so the tab grows downward instead.

The chosen box is the box the proof needs (three lines × 1.2 × 14 px = 50.4 px at
390 px, i.e. h ≥ 0.2298) with margin, and the painter's own worst case (three
lines at 69 px = 283 px of 291) fits inside it.

### 4. The film's staging is the film's cast

Recipes call `castIn(shot, 0)` for the lead and `castIn(shot, 1)` for a second
character, and `drawCharacter` dispatches through `window.CHARACTERS` by
`score.cast[].rig`. No film's names appear in the pack painter. Unknown or
missing rig: throw.

### 5. No silent pose fallback

`poseFor(name, null)` returns the character's **first library pose**, not a
hardcoded `idle`; a named pose that the library does not have still throws. The
office recipes pass `null` and let the score's pose events direct the
performance. A fallback that quietly plays `idle` looks like a performance and is
not one.

## What this does not claim

- **0.2.0 is not sealed.** There is no `gate/paper-kpop-0.2.0/` and no fresh
  blind: the pack is still moving under the film, and sealing it now would pin a
  hash the next painter fix invalidates. The seal lands with the film's
  acceptance. The 0.1.0 evidence is untouched and its gate still runs.
- **The shipped cut is the sealed cut.** That is the point of §1, not a claim of
  quality on the office set. The office set's quality evidence is the film's own
  gate.
- No new dependency, no new vocabulary in the closed contract: `BEAT_ROLES` is
  unchanged. A tie-break was considered (giving the office recipes a role of their
  own) and rejected — the closed contract is hashed into every pack's
  `contractHash`, so widening it would have re-validated *every sealed pack in
  the repository*. A format's pool costs nothing outside the format.

## Evidence

```bash
npm run typecheck                                   # clean
npm test                                            # 276 tests, 276 pass
node --import tsx --test test/paper-kpop-gate.test.ts        # 9/9, sealed 0.1.0
node --import tsx --test test/paper-kpop-0.2.0-gate.test.ts  # 4/4, live 0.2.0
npm run audit:type -- films/same-alarm/score.json    # 150 boxes, 150 copy, pass
npm run style:check -- styles/paper-kpop             # 16 recipes
```

`test/style-geometry.ts` holds the geometry proof once; both gates call it, so a
box that is fixed for one pack cannot stay broken in the other.
