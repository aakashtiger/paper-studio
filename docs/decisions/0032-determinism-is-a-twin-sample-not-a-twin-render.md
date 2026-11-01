# 0032 — Determinism is proven by a twin sample, not a twin render

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/determinism.ts`, `scripts/determinism.ts`, `test/paint-purity.test.ts`)
**Depends on:** 0023 (a frame is pure · render in parallel), 0029 (one pass), 0031 (the draft)
**Touches:** non-negotiable #1 — *same brief + same seed = identical frames*

## Context

The chain painted the film **twice** and compared the two MP4s byte for byte.
For a 60 s film at 30 fps that is 2 × ~12 min — by a wide margin the largest
remaining cost in the loop, and it was paid on every run, including runs whose
cut was about to be rejected.

Two things made that look wrong on inspection:

1. **There is no seed problem to catch.** The paint path contains no
   `Math.random`, no `Date.now`, no `performance.now`, no `new Date(`, and no
   network call. Determinism is not a thing the painter might lose by accident
   in the arithmetic; it is a property of the code, and the code is already
   written that way.
2. **The twin tested the weakest hypothesis.** Both runs used the same number of
   workers, so each browser painted the same frames in both runs, in the same
   order. A warm-up defect — a font that shapes differently on a browser's first
   frame — would have been *identical in both runs*, and the twin would have
   passed. The question that actually matters for a parallel renderer is not
   "is a second run the same" but **"is a frame the same whichever browser
   paints it, in whatever order"**.

`paint-match` already covers the other half cheaply: it repaints 61 frames (one
per second) in fresh browser processes and compares them to the delivered MP4 at
PSNR ≥ 30 dB. "The delivered picture is the painter's picture" was already
proven without a second full render.

## Decision

**Determinism is proven by painting a sample of frames twice — once in one
browser, once across N — and comparing the PNGs byte for byte.**

`npm run determinism -- <score>`:

- samples **3 frames per shot** (1/4, 1/2 and 3/4 of each shot — never on a cut,
  where rounding to the renderer's two-decimal grid could land the frame in the
  neighbouring shot);
- paints them in **run A serial** (one browser) and **run B parallel** (up to
  four), two independent processes;
- requires **every pair byte-identical**, **every shot sampled**, **more than
  one frame**, and **no time sampled twice**;
- writes `build/<id>/determinism.json`, which `gate:7` reads.

The gate does not trust the report. `checkTwinEvidence()` re-derives the sample
hash from the frame list it was handed, re-checks every pair itself, requires
the report to name **the current score**, and requires the two runs to have used
**a different number of workers**. A trimmed or hand-edited report fails even if
it says `pass: true`.

### Determinism becomes structural, not just observed

`test/paint-purity.test.ts` reads the film's own paint code — every pack's
`canvas/*.js`, every `films/*/painter.js`, `score-data.js` and the page's inline
script — and refuses `Math.random`, `Date.now`, `performance.now`, `new Date(`,
`crypto.randomUUID`, `fetch`, `XMLHttpRequest`, `WebSocket`,
`requestAnimationFrame` and `setInterval`. It also requires every
`gsap.timeline(...)` to be created `paused: true` and forbids `.play()`: a paused
timeline that is `seek()`ed is a pure function of the time asked for; the same
timeline played is a function of how long the machine took.

Vendor libraries are deliberately not read. gsap legitimately contains
`Date.now` inside its own ticker; what matters is that our code never lets a
ticker decide a frame.

## Measured

*Same Alarm*, 60 s, 10 shots, 30 sampled frames:

| | twin render | twin sample |
|---|---|---|
| frames painted | 3,600 | **60** (30 × 2) |
| wall clock | ~24 min | **48 s** (serial 31 s + parallel 15 s) |
| byte comparison | whole film, same worker split | 30 frames, **two different splits** |
| proves worker-order invariance | no | **yes** |

The sample was correct on the first run: 30/30 identical, all 10 shots covered.

Two live proofs, not just unit tests:

- **It refuses a nondeterministic painter.** A `Math.random()` pixel injected
  into `films/same-alarm/painter.js` produced 10/10 DIFF and exit 1 — *"the
  painter is not a pure function of time"*. The painter was restored with
  `git checkout` and `git status --porcelain films/` was empty afterwards.
- **It is worker-invariant.** Before the command existed, 8 frames painted in
  one browser and in four were **8/8 byte-identical**, which is the measurement
  that made a serial-vs-parallel twin worth having at all.

`gate:7` on *Same Alarm* is **PASS · 21 checks · nothing manual** with the twin
sample in place of the twin render.

## What this does not prove, stated plainly

The sample is a **sample**: it proves the painter is pure at 30 times across
every shot in two independent processes, not at all 1,800 frames. The full-film
claim therefore rests on three things together, which is why all three are gate
rows:

1. **purity** — the paint code has no source of nondeterminism (`test/paint-purity.test.ts`);
2. **the sample** — 30 frames re-paint to the same bytes in a different paint arrangement;
3. **`paint-match`** — 61 freshly painted frames are the delivered film's frames;
   and **`inputsHashed`** re-hashes the score, the page data, the painter and the
   fonts, so the film that shipped was painted by the code and score that were
   measured.

A full twin is still available where someone wants it — `npm run
determinism:renders` compares two complete renders — and it is the right thing to
run for a release that matters more than twelve minutes. It is no longer the
price of every run.

## What this does not change

- Nothing about the painter. Not one pixel of the film changes; the two builds
  of *Same Alarm* were already byte-identical, which is why the sample passes.
- `audit:motion`, `paint-match`, `frame-audit`, `palette` and `deliver` still
  read the delivered file. Only the *determinism* row changed.
- No new dependency, no network.

## Landed

- `src/engine/determinism.ts` — `sampleFrames()`, `checkTwin()`,
  `twinSampleHash()`, `checkTwinEvidence()`; `TWIN_PER_SHOT = 3`,
  `TWIN_MIN_FRAMES = 2`. Refusals `determinism:frame`, `determinism:sample`,
  `determinism:duplicate`, `determinism:uncovered`.
- `scripts/determinism.ts` — `npm run determinism -- <score.json> [--per-shot 3] [--workers 4] [--keep]`.
- `scripts/gate-7.ts` — the determinism row is `checkTwinEvidence()`, a pure
  function, so every way it can refuse is a unit test.
- `scripts/film-chain.mjs` — `determinism` runs after `inspect` and **before**
  the paint; the render step paints **once**; `--skip-render` requires one file.
- `test/determinism.test.ts` — 18 cases: the sample grid, the rule, and the eight
  ways the gate row can be fooled.
- `test/paint-purity.test.ts` — 3 cases: no nondeterminism in the paint code, no
  played timeline, no `Math.random` in the render loop.
