# *Same Alarm* — what actually happened, in plain language

**For:** the owner, not the programmer.
**Subject:** the first real film made from an idea you gave in one sentence:
*"the life of a corporate slave from morning to night, one minute, new
characters."*
**What it produced:** `films/same-alarm/same-alarm.mp4` — 1 minute, 30 pictures
per second, 10 scenes, 7 narration lines, 35 sound effects, measured audio.

Every time in this document comes from a file timestamp or a log line, not from
memory. Where a number is an estimate it says so.

---

## First, the vocabulary, because the report is useless without it

| word you'll see | what it actually means |
|---|---|
| **brief** | the one-page order: who it's for, the tone, the must-say lines. Nothing may appear in the film that isn't in it. |
| **score** | the written plan of the film: 10 scenes, what happens in each, at what second, and what sound lands on it. It is a text file a human can read and edit. |
| **recipe / set** | a reusable painted set — "bedroom at dawn", "office corridor", "desk at night". Built once, used by any film. |
| **rig** | the skeleton inside a drawn character: hips, legs, arms, so a body can be posed instead of redrawn. |
| **pose** | a named body position — `sit`, `sleep`, `look`, `point`. The film asks for poses; it never contains hand-drawn frames. |
| **render** | the machine painting 1,800 separate still pictures and gluing them into a video. This is the slow, expensive part. |
| **audit** | an automatic inspector. It measures the finished video and *refuses* it if a rule is broken — a still character, text outside the safe area, a foot off the ground. |
| **gate** | the final checklist: 20 rows, each backed by a measurement, plus seven reviewers who read the film. |
| **slice** | a 4-minute test render of one scene, instead of the full 33-minute film. |

---

## 1. The twelve steps, in order, with the real time

### Step 1 — Story to a written plan · 09:03 → 12:30 · **3 h 30**
*Machine working: ~20 min. My attention: the rest.*

The idea arrived as one sentence. Turning it into a film means deciding the
**shape**: ten scenes, 60 seconds, a loop — the same 06:00 alarm opens and closes
it, and the last hand never comes down from the phone.

What I produced: a one-page **brief** (tone, audience, the three lines the film
must say: "same alarm", "nine hours", "still here") and a **score** — every
scene, every beat, every sound, in seconds.

**Why it took three hours:** the *thinking* is the work, and it should stay with
a human. What made it slow was having no referee. Two mistakes in that plan cost
whole renders later: one pose asked to hold for 3 seconds when the format cannot
hold (so the man was already sitting up at second 2), and one sound effect was
attached by position, so when a beat was inserted the sound moved with it.

### Step 2 — Checking the body before animating it · 12:32 → 12:55 · **25 min**
*Machine: ~5 min.*

Before posing anyone I measured the skeleton: how long are the legs, how high is
the hip, does the foot reach the floor. Three small throwaway scripts
(`depth-dump`, `anchor-inspect`, `old-rig-check`).

This step was cheap and it was right, and it later explained the single worst
problem of the day (Step 9). The two numbers it produced — hip height, leg
length — were the whole story.

### Step 3 — Building the office world · 14:19 → 15:00 · **40 min**
*Machine: ~10 min.*

Eight painted sets for the film's world: alarm close-up, corridor, desk wide,
supervisor, window at dusk, desk at night, loop close, and a title card. Plus the
characters' skeleton for this film specifically.

This is the "props department". It is the reason the second film in this world
will be fast and this one was slow.

### Step 4 — Props, poses and staging · 14:36 → 15:44 · **1 h 10**
*Machine: ~15 min. My attention: most of it.*

A bed, a nightstand, a desk with paper on it, a chair, a monitor, an hour tab in
the corner that reads 06:00 and then 06:01. Twenty-one poses for two men.

Judged by looking at still pictures, one at a time — fifteen seconds each, but
**with a person in the loop for every decision.** That is what made it slow, not
the machine.

### Step 5 — Voice, used as the clock · 15:25 → 15:34 · **10 min**
*Machine: 10 min.*

Seven narration lines spoken by a local voice model, then the *machine listened
to itself* and wrote down when each word was said. Every scene boundary is placed
on a measured word, not a guessed one.

This is the only step of the day that went exactly as designed: one command, no
surprises, because nothing was typed by hand that could have been measured.

### Step 6 — First full look · 15:44 → 16:00 · **15 min**

Nine full-size stills, one per scene, to see whether the staging reads.

### Step 7 — The contact sheet and the small-text check · 16:23 → 16:25 · **2 min**

One frame per scene, tiled into a single image, plus a check that no caption
sits too low or too close to the frame edge.

### Step 8 — Locking the plan and the set · 16:59

The score and the office world are committed as the official version. From here
on, anything that changes the picture must be re-rendered.

### Step 9 — **First full render + automatic inspection · 17:00 → 18:10 · 70 min**
*(the machine worked for 68 of those 70 minutes)*

Two complete renders (one to keep, one to compare against, to prove the machine
produces the same film twice) and then six inspections.

**The render passed. The inspection refused the film**: scene 6's average
movement was 0.533 against a required 0.6. In plain terms — *the character was
standing still long enough to look like a photograph*.

### Step 10 — Fixing scene 6 on a test strip · 18:11 → 18:23 · **12 min**

Instead of re-rendering the film, I rendered **four seconds** of the one broken
scene, measured it, changed the acting beat and the camera push, measured again
(0.677). Twelve minutes, not thirty-three.

### Step 11 — The second look at the staging · 18:24 → 18:44 · **20 min**

Two things were wrong that no measurement caught, only eyes: the room had no
single floor line (each piece of furniture sat at its own height), and the desk
had no work on it.

### Step 12 — **Second full render + inspection · 18:44 → 20:05 · 81 min**

Refused again, and this time the inspector was brutal: **209 findings.** 111
knees locked straight, 78 ankles hanging in the air, 20 seams at cuts. One cause:
the hip was drawn 272 units above the floor on legs whose total length was 273.
Every pose was straight-legged *by construction*, and no foot could reach its own
shadow.

### Step 13 — Fixing the skeleton · 20:05 → 20:34 · **29 min**

Diagnosed from the measurement file, fixed the arithmetic, wrote a test that
fails if anyone breaks it again. 209 findings → **0**.

### Step 14 — The chair that was two and a half men wide · 20:35 → 20:52 · **17 min**

A prop turned out to be a number typed at four different places instead of an
asset with a declared size. It was 278 pixels wide behind a man whose shoulders
are 108. Now a chair is a *thing* with a size, placed by the character's hip, and
a test refuses a chair wider than the man.

### Step 15 — A render that stopped in 0.2 seconds · 20:56 · **0 min**

Good news, actually: a guard noticed the skeleton had changed and refused to use
the old cached copy. Zero cost.

### Step 16 — **Third full render + inspection · 20:56 → 22:08 · 72 min**

Refused again: scene 7's movement 0.597 against 0.6. A near miss — and a near
miss is a refusal.

### Step 17 — Rebuilding scene 7 on test strips · 22:21 → 22:41 · **20 min**

The fix was structural: the head's descent had to be a *declared hold*, not a
slow blend, plus a later fall and a deeper push. Measured on four-second strips.

### Step 18 — Faces and the last two details · 22:41 → 22:43 · **2 min**

A sleeping man had his eyes open (a face cannot be blended between poses — it has
to be chosen). Three fixes at once, then seven stills.

### Step 19 — **Fourth full render + inspection · 22:44 → 23:53 · ~69 min**

Determinism proven: two independent renders, byte-for-byte identical. Inspections
all green. Then the **score audit refused the film**: one event was both
"scored with a sound" and "declared silent". It cannot be both. Four tenths of a
second of checking, discovered after 70 minutes of painting.

### Step 20 — The fix, the re-render, and the proof · 23:54 → 00:39 · **45 min**
*Machine: 33 min.*

Removed the contradiction, re-ran the sound, re-rendered once. The new film came
out **byte-for-byte identical** to the old one — which proves the edit could not
have touched a single pixel.

### Step 21 — Inspections, delivery, gate, reviewers · **~30 min**

The six measurements on the delivered file, the audio muxed in and measured *on
the file itself*, the automatic speech check, the 20-row gate, and the seven
reviewers.

---

## Where the day actually went

| | |
|---|---|
| **Wall clock, idea → delivered file** | **≈ 16 hours** |
| The machine painting films (9 full renders) | ≈ 5 h |
| My own looking, measuring, diagnosing, editing | ≈ 3.5 h |
| Creative decisions (yours and mine) | ≈ 3 h |
| Waiting on a slow command, or on a question | the rest |

**The one number that explains the day: the machine painted 9 full films. Two of
them are the film you are watching. The other seven were cuts that an automatic
inspector rejected, or duplicates I ran to prove an edit was harmless.**

Each of those seven cost ~33 minutes, and in three cases a check that takes
**under 15 seconds** already knew the answer:

| the inspector that refused the film | cost to reach it | cost to have known first |
|---|---|---|
| "scene 6 is a still photograph" | 70 min | 4 min (a test strip) |
| "209 locked legs" | 81 min | **0.2 s** — a test in the codebase already asserted the leg reaches the floor |
| "scene 7 moved 0.597, needs 0.6" | 72 min | 4 min (a test strip) |
| "one event is scored and silent" | 70 min | **0.4 s** (the score check) |

That is the whole story of the day: **the standards were right; they were being
consulted after the most expensive step instead of before it.**

---

## 2. What to improve at each step

**Step 1 — writing the plan (3 h 30).** Keep the human decisions. Add a
**grammar check on the plan** that runs in under a second: refuses a pose that
"holds" when the format cannot hold, refuses a sound attached by position rather
than by meaning, refuses a narration line longer than its scene. Both defects
that cost us renders were visible in the text before anything was drawn.

**Step 2 — measuring the body (25 min).** Was right. Move it *before* the sets
are built, and make the skeleton's numbers a declared file instead of numbers
buried in code that a test has to guess at.

**Step 3 — the sets (40 min).** They were built before the two rules that govern
them were written down (one floor line; a prop is an asset with a size). Those
rules came four hours later, after the chair had cost five passes. Make the rules
**checks that run when a set is authored**, not advice written afterwards.

**Step 4 — props and staging (1 h 10).** Right instrument, wrong scale: fifteen
separate stills, one person in the loop each time. The tool that shows **one
frame per scene side by side** already existed and was used once, for two
minutes. Use it for every staging pass.

**Step 5 — voice (10 min).** This is the model for everything else: *capture,
measure, derive*. Nothing typed that could be measured.

**Steps 9, 12, 16, 19 — the four expensive renders (70 + 81 + 72 + 69 min).**
Three changes, in order of payoff:
1. **A gate before the first frame**: run the cheap checks (plan grammar, body
   reachability, prop sizes, text fit) and refuse to start painting if any is
   red. Two of the four refusals would have cost seconds.
2. **A movement probe per scene** — twelve sampled frames per scene instead of
   the whole film. Forty seconds, catches "this scene is a photograph".
3. **Never render the comparison copy on a working cut.** Determinism is a
   property of the machine, not of each cut: prove it once, not eight times.

**Steps 10, 13, 17, 20 — the fixes.** These were the efficient part and the
template to copy: *diagnose from the measurement, fix the arithmetic, prove it
with a test, look at a four-second strip.* Scene 7 went from 0.597 to 0.745 in
20 minutes instead of 85.

---

## 3. How to get from 16 hours to 30–60 minutes

The target is reachable without lowering a single standard. Two facts decide it:

1. **Half the day was the machine painting, and the machine was painting with
   one hand.** The film is 1,800 independent still pictures — no picture depends
   on the one before it — and they were being painted **one at a time in one
   browser** on a laptop with 20 threads. Splitting the work across several
   browsers changes who paints, not what is painted.
2. **Checks were consulted after the expensive step.** Every one of them can run
   before frame one.

### The budget

| step | today | target | how |
|---|---|---|---|
| plan written against a grammar check | 3 h 30 | 20 min | human decides; the check refuses the traps |
| one frame per scene, side by side | 15 min × 9 rounds | 2 min × 2 | the sheet that already exists |
| a moving preview with sound | — | 3 min | a cheaper draft quality |
| fix rounds | 3 × 20 min | 2 × 6 min | test strips, as used for scene 7 |
| **the final film, full quality** | **33 min** | **6–8 min** | **several browsers painting at once** |
| the comparison copy | 34 min | 6–8 min | same, and only on the final cut |
| all six inspections | 6 min | 1 min | one pass, sampled, all measurements at once |
| sound, delivery, gate, reviewers | 5 min | 5 min | already fast |
| **total, hands-on** | **≈ 16 h** | **≈ 40–60 min** | |

### Landed the same night (measured, not promised)

- **Several browsers painting at once.** `--workers 4` splits the film into four
  equal blocks. Proven by bytes: 60 out of 60 frames **identical**, same picture
  hash; 67 seconds became 28 — *while another render was already using the
  machine*. On a full film that is 33 minutes → about 10.
- **Checks moved before the first frame.** The whole test suite (14 seconds) and
  the plan check now run **before** a single picture is painted. That one line
  would have saved 81 minutes.

Still to do, in order: **reuse the painted background** inside each scene (the
room, window and desk are repainted identically in most frames — expected 2–3×,
must be measured), **movement probe per scene** (40 s), **a draft-quality
preview**, and **determinism proven once per machine change** instead of twice
per film.

### What I would not change

The inspectors that found the three real defects. Every one of them named
something that four rounds of looking at stills had missed: 209 locked legs, a
chair two and a half men wide, a man asleep with his eyes open. The problem was
never the standard.

### On the 30-minute YouTube videos

Those are a single generative pass with a few retries: no guarantee that two runs
produce the same film, no measured loudness, no frame inspection, no automatic
speech check, no delivered-file measurement. This system's 40–60 minutes carries
all of that. The gap is not standards — it is parallelism and ordering, and both
are now measured.
