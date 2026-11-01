# 0033 — A report is trusted because it is about this film, not because it is new

**Status:** accepted · 2 Nov 2026
**Owners:** technical (`src/engine/review.ts`, `scripts/film-review.ts`)
**Depends on:** 0017 (the review surface), 0023 (a frame is pure), 0029 (one pass), 0032 (the twin sample)

## Context

After 0032 the chain painted the film once, and the tail of a run measured
like this (*Same Alarm*, 60 s, render reused):

| step | cost |
|---|---|
| frames | 134.5 s |
| paint | 73.7 s |
| **review** | **363.5 s** |
| determinism | 47.6 s |
| asr · motion · collage · gate · sfx · palette · mix · deliver | 76 s together |

`film:review --gate` was the second largest cost in the whole loop — larger than
the frame audit, larger than the paint match, larger than everything else in the
tail combined — and almost all of it was **work the chain had just done**. The
review re-ran `frame-audit`, `paint-match`, `motion-audit`, `type-audit` and
`rig-audit` seconds after the chain ran the same five against the same score and
the same picture.

Two of those five are paint-probe audits, so the review did not merely re-read a
video: it **repainted every frame it judged** — 120 frames for `type-audit`, 600
for `rig-audit` — which is exactly the defect decision 0029 fixed one layer down.

The review refuses to print a report it did not write this run, and that rule is
right. Its implementation was the problem: it compared a file's **mtime** before
and after the step. A timestamp answers "was this written just now", which is not
the question. The question is "is this report about *this* film".

## Decision

**A review may print a report it did not write this run when the report is
verifiably tied to this film. Anything that cannot be tied is re-measured.**

The tie is a hash, not a clock:

| report kind | tie | reused when |
|---|---|---|
| video audit — `frame-audit`, `paint-match`, `motion-audit` | the picture it read (`videoHash`) | it equals the manifest's picture hash |
| paint-probe audit — `type-audit`, `rig-audit` | the score (`score`) **and** the painter (mtime) | the score hash matches **and** the report was written after the newest change to the pack's canvas, the film's `painter.js`, `score-data.js` or the page |

`type-audit` and `rig-audit` now publish the score they measured. Without it no
review could tell whether a rig verdict was about this edit or last week's — the
one input that made these two reports untrustworthy across a change.

`npm run film:review -- <score> --gate --reuse` is what the chain runs. Plain
`npm run film:review -- <score> --gate` still re-runs everything, so a cold
review from a fresh clone behaves exactly as it did before.

The asymmetry is deliberate: **a wrong reuse prints a lie, and a needless repaint
costs seconds.** Every ambiguity resolves to re-running.

## Measured

*Same Alarm*, 60 s, the same five audits:

| | before 0033 | first `--reuse` run | steady state |
|---|---|---|---|
| review | **363.5 s** | 132.5 s (2 of 5 re-measured) | **62.0 s** (5 of 5 reused) |
| chain tail | 745 s (12.4 min) | — | **393 s (6.6 min)** |

The first `--reuse` run re-measured `type-audit` and `rig-audit` because reports
written before this change name no score. From the second run on they carry it.

Proven refusing a stale reuse: touching `films/same-alarm/painter.js` (mtime
only — the bytes were unchanged, and `git status --porcelain films/` stayed
empty) made the very next review print

```
film:review: type-audit — re-measuring: the paint code changed after the report was written
film:review: rig-audit — re-measuring: the paint code changed after the report was written
```

and a full chain run after that is **PASS · 13 steps · delivered**, with all five
rows reused.

## What this does not change

- The gate still re-hashes everything it reads, and `gate:7` still runs on every
  chain run (7.5 s) — the review prints the gate's page, it does not replace it.
- A reused row says so on the page: `measured on this picture (sha256:3c555013…),
  not repainted`. A row that was measured now says nothing extra, as before.
- A reused report that says `pass: false` fails the review. Reuse is about
  freshness, never about leniency.
- No new dependency, no network.

## Landed

- `src/engine/review.ts` — `mayReuse()`, pure, with `ReportTie = "picture" | "score"`.
- `scripts/film-review.ts` — `--reuse`; `newestPaintChange()`; the run loop
  consults `mayReuse()` before spawning a gate step and says why on the page.
- `scripts/type-audit.ts`, `scripts/rig-audit.ts` — the report carries `score`.
- `scripts/film-chain.mjs` — the review step passes `--reuse`.
- `test/review-reuse.test.ts` — 10 cases, one per way a reuse could print a lie.
