# The variety policy — floors from the gold, not from taste

**Date:** 8 Nov 2026
**Status:** DRAFT for M1. Every row is a number a command can check. The
evidence is `build/audit-gold/REPORT.md`; the gold is pinned in
`build/audit-gold/GOLD.json` (`sha256:fb85200bc531...`).

| axis | gold evidence | floor a film must meet |
|---|---|---|
| sets | 54/54 unique | ≥90% unique; ≥6 families; no set >30% of shots |
| world types | 8; every act ≥3 | ≥3 per act; ≥5 per film |
| cast | ≥3 identities/act; 10 groups; size 0–10+ | ≥3 identities/act; ≥6/film; ≥20% of shots with ≥4; ≥1 zero-cast shot |
| palettes | 9; 8 bins; ≥2 hues/act | ≥5 of 12 bins/film; ≥2/act; ≥3 palette variants/act |
| performance modes | 7; max 46%; ≥4/act | ≥4/act; no mode >60% |
| compositions | 9; max 39%; ≥5/act | ≥5/act; no type >50%; ≥1 overhead/isometric, ≥1 macro/close, ≥1 silhouette/scroll |
| type | 5 roles; 6 faces; 54 briefs; 5 shots without hero | ≥4 roles; ≥4 faces; ≥6 hero treatments/act; no treatment >30%; ≥1 no-hero shot |
| transitions | 53/54; max 7.4% | ≥5/act; no type >25% |
| camera | 12+ types; push 31% | ≥5/act; push ≤40%; ≥1 orbit/tilt/overhead; roll claimed only if ≥3° |
| motifs | 7 recurring + 3 continuity | ≥4 recurring, each ≥3 shots and ≥2 acts; ≥1 continuity device in ≥80% of shots |
| rhythm | 5.6% ≤1.2 s; 5.6% ≥5.5 s; 16.7% ≥4.5 s; longest run 3 | ≥5% ≤1.2 s and ≥5% ≥5.5 s, or ≥1 each in a film under 30 s; no run of ≥4.5 s shots longer than 3 |
| look | act means 88–120 luma, 15–27 sat | ≥3 act look bands; per-act spread ≥20 luma / ≥8 sat |

The **performance modes** are the ones the gold actually uses: stage, diagram,
macro, creature, close, chase, diorama. A shot declares one (`film.json`
`shots[].performance`), and the performance row reads it: a **macro** shot is a
hand and a prop with no puppet, so it is exempt from the rig metrics and is
still held to the motion floor.

## Why these floors, and not "more is better"

The 25 s proof failed 11 of the 12 axes above while matching the gold's tempo
and motion. That is the lesson: a KPOP film cannot be one room, one palette and
one performance mode with a moving camera. The floors are set just below the
gold's measured rate, so a film that meets them is as varied as the gold's
*weakest* act, not its average.

## What the policy does not ask for

- It does not ask for 54 shots. Shot count comes from the duration policy
  (`kpop-shot-policy.md`); variety is a rate per act, not a count.
- It does not ask for a new painter per shot. The pack may reuse a recipe as
  long as the shot's declared world, palette, composition and performance mode
  vary; the M1 rule is **no recipe more than twice in a film** and no more than
  once per act.

## Open

- The per-act split (acts of what length?) is not fixed for a 30 s film, which
  has no acts. The `shots[].act` field is optional; when absent, the floors are
  read over the whole film and the per-act rows are skipped with a warning.
