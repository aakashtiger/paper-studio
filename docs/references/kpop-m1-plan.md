# M1 — the KPOP pack, ready to make a film

**Date:** 8 Nov 2026
**Status:** plan. K0, K0.5, K3, K4, K5 and K6 have shipped; K7 is the seal.
Everything else is named with the command that proves it.

## What "ready" means

M1 is done when the pack can produce a **10/10 film the first time**, by a
different person, with different characters, props, sets and colours, in a known
number of hours. Not "we made a good film once"; that was M0.

The bar, in one line each:

1. **Gold-pinned.** The reference is a hash, not a memory. `build/audit-gold/GOLD.json`.
2. **One policy.** Shot length, count, aspect and fps come from the system and
   are implemented once. `npm run shot:policy -- <film.json>`.
3. **Variety floors.** Sets, world types, cast, palettes, performance modes,
   compositions, type, transitions, camera, motifs, rhythm, look — floors from
   the gold's weakest act, each checkable.
4. **A factory.** One command runs the chain; four browsers paint; two fresh
   critics sign; a film cannot be called done by the person who made it.
5. **A gate that sees the picture.** The ten rows, plus the policy, plus the
   critic verdicts, tied to the delivered file's hash.
6. **A seal.** `styles/paper-kpop` (or its successor) is versioned, with a
   passport that names what it can and cannot draw.

## The work packages

| # | Package | Why | Proof command | Est. |
|---|---|---|---|---|
| K0 | Gold pinned + units unified | every later number compares to one file, in one unit | `GOLD.json` + `docs/references/kpop-units.md` | **done** |
| K0.5 | Law repair | four pages stated four shot bands; the policy page wins | `kpop-shot-policy.md` + pointers | **done** |
| K3 | Duration engine | shot length/count belong to the system, not a film | `npm run shot:policy` + `test/shot-policy.test.ts` | **built**, wiring open |
| K4 | The factory | one command: plan → paint → measure → evidence → gate → critics | `npm run film:factory -- <score> --plan` | **built** |
| K5 | The gate reads the policy | a film cannot pass on a band it did not cut to | `npm run shot:policy` as a `film:review` row | **built** |
| K6 | The critics | two fresh GOes, or the film is not done | `npm run critics:check -- <film>` | **built** |
| K7 | The seal | a versioned pack with a passport | `npm run style:seal` + `PACK.md` | 1–2 h |

K1 (variety) and K2 (the recipe catalogue) are not separate packages: the
variety floors are checked by K5. The catalogue is **not** ready: on 8 Nov
`npm run recipes:check` measured **60 declared, 20 painted** — forty entries a
director can select and the pack cannot draw. The missing painters are not
missing art; they live inside film folders (`films/*/vendor/*-recipes.js`):
`p_*` in `films/diwali-north/vendor/diwali-recipes.js:833`, `proof_*` in
`portrait-recipes.js`, `myth_*` in the other films, and `type_stack` /
`side_scroll_chase` nowhere. See `docs/M1-HANDOVER.md` §4A.

## K3 — what is built, and what is not

`src/engine/shot-policy.ts` implements `kpop-shot-policy.md`:

- the band is derived from the film duration: **1.2 / 3.0 / 5.5 s** under
  3 min, **3.0 / 5.0 / 7.0 s** at 3 min and over;
- `round(duration / median)` is the fewest shots the film may use;
- median within ±0.3 s of the band;
- no more than **15%** of shots at the minimum, **10%** at the maximum, and no
  two maximum shots in a row;
- no four consecutive shots sharing a camera move, a set or a composition;
- the cut must cover the film with no gap and no overlap.

`npm run shot:policy -- proofs/kpop-crime-60/film.json` reads the M0 film and
returns **one finding**: its 2.66 s median sits 0.04 s outside the ±0.3 s
tolerance. That is the honest state, not a bug:

> The M0 film was cut to the gate that existed (1.0–4.5 s, median 2.5–3.0) and
> passes it at 10/10. The system policy arrived after it. The next film is cut to
> the policy; the crime film's pass stays tied to the gate it was made for.

**Open in K3:** `scripts/motion-check.mjs` and `scripts/quality-check.mjs` still
carry the old band. K5 replaces the constants with a call to the engine, and
`test/shot-policy.test.ts` pins the crime film's median so nobody widens the
tolerance to make a document true.

## K4 — the factory, in detail

The cost that M0 measured is the thing to remove:

| step | M0 cost | the factory's target |
|---|---|---|
| paint the film | ~12 min / 1,800 frames, 4 workers | unchanged |
| measure the film | 226 s | 226 s, ranged when one shot changes (~15 s) |
| evidence (stills, sheet, hands, cuts, cards) | ~4 min | ~4 min, one command |
| the ten rows | ~1 s | ~1 s |
| review | 62 s with reuse | 62 s |
| critics | one round, two agents | two agents, parallel, one round |

**The factory is `film:chain`, and `film:factory` is the same command under the
name it earned.** It already runs the whole order — tests, voice, embed, audit,
camera, policy, assets, preflight, visual, inspect, determinism, sheet, collage,
identity, sfx, mix, render, frames, paint, palette, motion, deliver, identity,
asr, gate, review — and stops at the first failure. K4 added the four things it
was missing:

1. **`--plan`** prints the order, names which steps are skipped for this film,
   and writes nothing.
2. **`--ship`** ends at the critics row (`film:review --ship`), because a 10/10
   gate is necessary and not sufficient.
3. **`build/<id>/chain.json`** records every step, its seconds, the score hash
   and the `videoHash` the pass produced. "The chain passed" cannot mean "some
   chain passed".
4. **The policy row runs before the paint**, not after it: a cut outside the
   band dies in second 2 instead of after 12 minutes of painting.

Resume is `--from gate`/`--from review` with `--skip-render`, and a shot fix
re-renders a range with `render:film --from --to`; a range measure is exact
because the paint is pure (0032). **A latent bug was found on the way:** the
committed `scripts/film-chain.mjs` carried a TypeScript `as` cast in a `.mjs`
file, so the chain could not start at all. It is fixed and `node --check` is the
proof.

The parallel setup the user asked for is the one M0 proved:
**`--workers 4` paints four contiguous ranges; `twin-check` proves 1-vs-4
equality on a sample; a range measure is exact because the paint is pure.**

## K5 — the policy is a gate row, and a film opts in

A score declares `"policy": "system"`. When it does, `film:review` runs
`shot-policy` as a normal row (tied to the score hash, so `--reuse` does not
re-run it) and the film **cannot pass** on a cut outside the band. A score that
omits the field is a pre-policy film: the review prints `pre-policy cut (no
policy row)` and judges it by the `edit` band it was made for. That is how
history stays history without letting a new film skip the policy.

```
$ npm run shot:policy -- films/understudy/score.json     # 30 s, 9 shots
  band  short form: 1.2s / 3s / 5.5s (median ±0.3s), at least 10 shots
  FAIL  policy:median: median shot 3.40s is outside 3±0.3s (9 shots)
  FAIL  policy:count: 9 shots is fewer than the 10 a 30s film derives
  FAIL  policy:at-max: 1/9 shots (11%) sit at the 5.5s maximum — the cap is 10%
```

Understudy is a pre-policy film and those three findings are true of it. The
next film is cut to the band before it is painted, which is cheaper than
discovering it after.

## K6 — the critics (the Goldfish protocol)

A 10/10 gate is necessary and not sufficient. Two fresh agents, one picture and
one story, no shared context, read-only, each writes one JSON report. **Both must
say GO.** `npm run critics:check -- <film dir|score.json>` is the rule in code: it
reads `<dir>/critics/{picture,story}.json` and answers SHIP or every reason it is
not shippable — missing role, a GO below 10, a GO carrying a P0/P1, a P1 with no
shot or evidence, a report naming another picture, one signer twice, a verdict
nobody can act on. It never judges the film; it refuses a weak or stale
signature. `npm run film:review -- <score> --ship` runs the gate **and** this row;
`--plan` prints the order and writes nothing.

The prompts are `critics/kpop-picture.md` and `critics/kpop-story.md`, and
`critics/kpop-critics.md` says how they are run. The rules:

1. The critic did not make the film and has no history with it.
2. The critic may not re-run the gate as its argument, and may not edit a file.
3. Every finding names a shot, a second, a severity and the sheet or still.
4. A reused report is allowed only when it is provably about this film (the
   video hash for a picture report; the score hash for a paint report) — never
   because it is convenient.
5. A NO-GO goes in `FIXLIST.md` as a row, and the row is closed by a fix or by a
   written argument, never by silence.

M0's two critics and their fixes are the worked example:
`proofs/kpop-crime-60/critics/`.

## Named gaps (do not hide these)

- **The gate reads declarations, not taste.** M0's critics found real faults at
  10/10. K5 is not the end of review; K6 is why both are required.
- **The policy and the M0 gate still disagree.** The crime film's 2.66 s median
  is 0.04 s outside the system tolerance; it stays tied to the gate it was made
  for, and `shot:policy` keeps saying so.
- **The 30 s pacing blend (O2)** is still open: 165–195 wpm for films under 60 s.
  A 30 s film with nine lines cannot carry 180–190 wpm.
- **The 54-shot gold map (O1)** wins for the gold measurement only.
- **Two toolchains.** The M0 film was painted by `proofs/kpop-crime-60` and its
  gate lives in `Y:\NewVideoTest\scripts`; the product engine is `studio/`. K4
  must not paper over this: the factory is one entry point over the toolchain
  that exists.
- **The pack cannot yet draw everything it declares**: `npm run recipes:check`
  says 40 of 60 recipes have no painter in the pack (they live in film `vendor/`
  folders); 44/60 have no 9:16 map; `type_stack` and `side_scroll_chase` have no
  painter anywhere; and the budgets are the crime film's, not a style's.

## Order of work, and the time box

M1-core, before the next film (target 10–12 h):

1. ~~K3 wiring~~ — the policy is its own command and a `film:review` row (done).
2. ~~K4 factory~~ — `film:factory --plan/--ship`, `chain.json`, policy before the paint (done).
3. ~~K5 gate over the policy~~ (done: `policy: "system"` + a tied row).
4. ~~K6 critics' prompts~~ (done: `critics/kpop-*.md` + `critics:check`).
5. ~~K0.5 leftovers~~ (done: the rubric and the gold note now point at the policy;
   `PLAN-v2.md` and `initial-prompt.md` are dated history, not law).

M1-full, before the M3 seal (+4–6 h): K7 seal, the 9:16 maps, the two missing
painters, and the variety floors checked per act.

**No new film starts before M1-core passes on one already-delivered film.**
