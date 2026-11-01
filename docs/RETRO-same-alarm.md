# Retro — *Same Alarm*, the first film, measured

**Written:** 1 Nov 2026, while the acceptance chain ran.
**Question it answers:** where did the time go, and what would make the next film
reach 30–60 minutes from idea to delivered video.

**How these times were obtained.** Not from memory. Every row is a file mtime, a
git commit time, or a `chain:` line in `build/film-chain.log`. Where a window is
the gap between two artefacts it is rounded to five minutes. Wall clock includes
periods when nothing was running because a question was being answered, so the
"machine" column is the honest one for "what would this cost again".

## The film

10 shots · 60 s · 1800 frames at 30 fps · 8 office recipes · 57 score events ·
35 generated SFX cues · 7 narration lines (Kokoro, clock measured from the audio).

---

## 1. What happened, in order

| # | step | window (1 Nov) | wall | of which machine |
|---|---|---|---|---|
| 1 | Idea → brief + score scaffolding (`build/make-score.mjs`, `check-inputs.mjs`) | 09:03 – 12:30 | 3 h 30 | ~20 min |
| 2 | Rig and proportion diagnosis (`depth-dump`, `anchor-inspect`, `old-rig-check`) | 12:32 – 12:55 | 25 min | ~5 min |
| 3 | The office world: 8 recipes + film-local cast rig (`office.js`) | 14:19 – 15:00 | 40 min | ~10 min |
| 4 | Props, poses and staging, judged by stills (`office-ids`, `window-db`, `append-office`, `draft-recipes`, `add-poses`, `office-poses`, `nightstand`) | 14:36 – 15:44 | 1 h 10 | ~15 min |
| 5 | Voice as clock: TTS, word times, captions (`npm run voice`) | 15:25 – 15:34 | **10 min** | 10 min |
| 6 | Staging pass 1 judged by full-size stills (`build/peek`) | 15:44 – 16:00 | 15 min | ~5 min |
| 7 | Storyboard + type probe | 16:23 – 16:25 | 2 min | 2 min |
| 8 | Score committed, office pack committed | 16:59 | — | — |
| 9 | **Chain A** — two renders + six audits → **failed at motion** (s06 = 0.533, floor 0.6) | 17:00 – 18:10 | **70 min** | 68 min |
| 10 | s06 diagnosed and fixed on a slice (3 slice renders) | 18:11 – 18:23 | 12 min | 12 min |
| 11 | Staging pass 2: one ground plane, one scale, desk with work on it | 18:24 – 18:44 | 20 min | 6 min |
| 12 | **Chain B** — two renders + six audits → **failed at rig** (209 findings) | 18:44 – 20:05 | **81 min** | 79 min |
| 13 | Rig diagnosed from the probe, fixed, mutation-tested, audited | 20:05 – 20:34 | 29 min | 11 min |
| 14 | Props as assets + the three screen fixes (rim, cuff, crop) | 20:35 – 20:52 | 17 min | 3 min |
| 15 | **Chain C** — stopped at `embed` in 0.2 s (asset hash moved) | 20:56 | 0 min | 0 min |
| 16 | **Chain C′** — two renders + audits → **failed at motion** (s07 = 0.597) | 20:56 – 22:08 | **72 min** | 70 min |
| 17 | s07 restructured: hold key, later descent, deeper push; slices and stills | 22:21 – 22:41 | 20 min | 16 min |
| 18 | Eyes for a pose, the chair's box, `type` looks down; 7 stills | 22:41 – 22:43 | 2 min | 2 min |
| 19 | **Chain D — the acceptance run** | 22:44 – | 88 min (projected) | 86 min |

Totals to acceptance: **≈ 14 h wall**, of which **≈ 5.5 h is rendering** and
**≈ 3.5 h is my own inspecting, diagnosing and editing**. The rest is gaps.

### The number that matters

**Six full-film renders were paid for before the accepted one** — three chain
attempts, each rendering the deliverable *and* its determinism twin. Two of those
three were rejected by an audit within 60 seconds of the picture finishing:
`motion` said shot 6 was 0.533 and shot 7 was 0.597; `rig` said 209 findings.
That is ~3.5 h spent rendering cuts that a 2-second check would have refused.

---

## 2. Per step: what to change

### Step 1 — score authoring (3 h 30, of which ~20 min machine)

The 3 h was mostly *deciding the score*, which is the creative act and should stay
human. What it did not have was a **static referee**: the two defects that later
cost whole chains were already visible in the numbers.

- A pose key with no following key for 3.2 s is a **blend, not a hold** — this is
  why at 21:00 the man was already sitting up by 2 s. Statically checkable.
- A cue bound to `event.index` silently moves when an event is inserted. It
  should be bound to the event's *identity* (time + kind), or the score should
  refuse to resolve if the bound event's kind changed.
- `type` looking 9° down was a number in a pose file; it took a rendered still to
  see it. A **pose contact sheet** (one body per pose, drawn in a second) is the
  cheap instrument.

**Change:** `script:score-lint` — runs in < 1 s on the JSON, fails on:
a pose key whose gap to the next key exceeds 1.0 s with no hold, a cue bound to
a non-picture event, a shot whose last pose key lands past `duration − 0.5`, a
narration line longer than its shot.

### Step 2 — rig and proportion diagnosis (25 min)

This was cheap and correct, and it produced the two numbers (hip, leg) that later
explained 209 rig findings. **Keep it, and move it before the pack.**

**Change:** the rig's `HIP` / `THIGH` / `SHIN` / `SOLE` belong in a declared
`rig.json` in the cast asset, not as literals in a vendor file that a test has to
regex. A rig is data; the painter reads it. Then reachability is arithmetic on
two files, not a pattern match.

### Step 3 — the office world, 8 recipes (~50 min)

The recipes were written before the two decisions that govern them
(`0020` one ground plane, one scale per depth; `0021` a prop is an asset with a
declared footprint). Those decisions were written *four hours later*, after the
defects they prevent had been found by eye, three times.

**Change:** the pack's set-dressing rules are **checks, not prose**. A recipe may
only place furniture through `placeProp`, `placeProp` may not be called with a
scale that is not declared, and every placed prop's box is recorded by the paint
probe. Then "a chair behind a man must be narrower than 1.3× his shoulders" is a
test at authoring time (it is one now — it should have been at 14:20, not 20:50).

### Step 4 — props, poses, staging by stills (1 h 10)

`build/office-ids.mjs`, `draft-recipes.mjs`, `add-poses.mjs`, `nightstand.mjs`
are one-off scripts that each answered one question with one render. That is the
right instrument, used at the wrong scale: **15 s per still, but a human in the
loop for every decision**.

**Change:** one command, `npm run sheet:shots`, that renders **one frame per shot**
and tiles them into a single PNG in ~25 s. Staging is then judged as a sequence,
and a bad beat is visible next to a good one. This is the single biggest
human-time lever, because it turns nine review rounds into one.

### Step 5 — voice (10 min)

Correct, one command, no surprises, because the clock is *measured* rather than
typed. **This is the model for every other step**: capture, measure, derive.

### Steps 9, 12, 16 — the chains (70 + 81 + 72 min)

This is where the day went, and every failure was a **cheap check placed
downstream of an expensive one**:

| the audit that failed | cost to reach it | cost to have known |
|---|---|---|
| motion, s06 | 70 min | 4 min (slice) — or 0 min, if a motion probe ran on 40 frames per shot |
| rig, 209 findings | 81 min | **0.2 s** (`test/cast-rig.test.ts` already existed; the office rig was not in its list) |
| motion, s07 | 72 min | 4 min (slice) |

**Three changes, in order of payoff:**

1. **A pre-render gate that costs seconds and blocks the render.** Not a new
   audit: run the existing static checks (rig reachability, prop footprints,
   text fit, event order, score lint) *before* frame 1, and make `render:film`
   refuse to start if any is red. The rig failure would have been caught at
   second 1 rather than minute 4,900.
2. **A motion probe per shot: 12 frames sampled across each shot at 1 fps of
   work instead of 30.** The motion metric is a mean luma difference between
   adjacent frames; sampling 12 frames per shot costs ~40 s for the whole film
   and catches "this shot is a statue". It does not replace `audit:motion` on the
   deliverable; it replaces *waiting 34 minutes to discover a dead shot*.
3. **Never render the twin on an iteration run.** Determinism is a property of
   the renderer, not of each cut. Prove it once per renderer change with a
   two-process, 30-frame probe, and keep the full twin only for the sealed
   acceptance evidence.

### Steps 13, 17, 18 — the fixes (29 + 20 + 2 min)

These were the efficient part, and they are the template: **diagnose from data
(the probe JSON), fix arithmetic, prove it with a mutation, then look at a
slice.** The chair's misplacement cost 2 minutes to *identify* only because the
instrument was a magenta render; it would have cost zero if `PROPS.chair.draw`
had taken a named box (it does now).

---

## 3. What the system needs, to reach 30–60 minutes

The target is reachable, and not by relaxing anything. Of the 5.5 h of rendering,
**4 h is twin renders and full-length audits that do not need to be full-length**,
and **1.5 h is parallelism that is not being used**: the renderer paints frames
one at a time in one Chrome while every frame is an independent pure function of
`(time, score, assets)`.

### The budget I believe is achievable

| step | today | target | how |
|---|---|---|---|
| score authored against a linter | 3 h 30 | 20 min | human decides; linter refuses blends-as-holds, stale cue bindings, over-long lines |
| one frame per shot, tiled | — | 30 s | `sheet:shots` (new) |
| 720p / 12 fps preview, with sound | — | 2 min | a second, cheaper render target |
| fix rounds | 3 × 20 min | 2 × 6 min | stills + slices, as done for s07 |
| **final render, 1080p30, 1800 frames** | **33 min** | **6–8 min** | 4–6 parallel workers, contiguous ranges, one encode |
| all frame audits | 6 min | 40 s | one decode pass, sampled, all metrics at once |
| audio (sfx, mix, deliver) | 1 min | 1 min | already fast |
| `gate:7` + review page | 1 min | 1 min | already fast |
| **total** | **≈ 5.5 h + authoring** | **≈ 25–35 min + authoring** | |

### The ordered change set

1. **Parallel frame workers** in `scripts/render-film.ts`: N Chrome instances,
   contiguous ranges, per-range segments concatenated in order. Frames are pure,
   so ordering is the only correctness question. Prove with a test that a
   4-worker render and a serial render produce identical `videoHash`, and that
   two 4-worker renders are byte-identical. *This is the 4× and it is the one
   that makes the target reachable.*
2. **Static-layer caching in the painter**: the room, window, desk and monitor
   are repainted identically in ~1200 of 1800 frames. Cache them to an offscreen
   canvas keyed by `(recipe, hour, camera)`. Expected 2–3× on per-frame paint;
   must be measured, not assumed, and must not change a single pixel
   (`paint-match` already compares the page against the video).
3. **Movement of every check upstream of the first frame**: pre-render gate,
   score lint, per-shot motion probe, prop footprint (exists), rig reachability
   for *every* cast rig (exists, was just not wired to the office rig).
4. **Determinism as a probe, not a second film**: a 30-frame two-process test,
   plus the full twin only on a tagged acceptance run.
5. **`sheet:shots` and the 720p preview**, so the human loop is minutes.

### What I would not change

The gates that found the three real defects. Every one of them named a defect
that four rounds of looking at stills had not: 209 locked legs, a chair two and a
half men wide, a man asleep with his eyes open. The problem was never the
standard — it was that the standard was being consulted *after* the most
expensive step instead of before it.

### On the comparison

Videos that show a 30–60 minute result from a prompt are a single generative pass
with a few retries: no determinism claim, no measured loudness, no frame or
palette audit, no ASR. This system's target is the same wall clock **with** those
guarantees, and the budget above shows that is achievable by moving checks
earlier and rendering wider, not by dropping them.
