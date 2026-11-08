# The KPOP system — spec v1

**Date:** 6 Nov 2026
**Evidence:** the gold standard `out/claude-pop.mp4` (156.63 s, **54 scored
shots from 51 shot functions**, **4,698** frames), a full review at **30 fps
sampled every 2nd frame**, 4,698 consecutive-frame diffs, nine act reports, three
cross-cutting reports, and the 25 s test `proofs/kpop-test/`.

> **Status, 8 Nov 2026 — this page is v1 and its length rule is superseded.**
> Shot length, shot count and aspect belong to the **system**: see
> `kpop-shot-policy.md`, which is the one page that decides them (under 3 min:
> 1.2 s / 3.0 s / 5.5 s; 3 min and over: 3.0 / 5.0 / 7.0; shots derived from
> duration). The **current gate still implements this page's older band**
> (1.0–4.5 s, median 2.5–3.0); the duration engine (K3) moves the gate to the
> policy. Until it does, a film is judged by the gate that exists, and the gap
> is named in the M1 report rather than hidden. The variety floors are in
> `kpop-variety-policy.md`; the gold is pinned in `build/audit-gold/GOLD.json`.


The system is not a recipe library. It is a way to author shots that carry the
gold standard's grammar: paper theatre, a live cast, held props, monumental type,
a continuous voice, and a cut that lands on a word.

## 1. The seven laws

1. **The voice is the clock.** Speak the script first. Measure the words. Cut
   the picture on the measured word, not on a guessed grid. 180–190 wpm,
   continuous; no internal silence over 0.2 s. The test reads 74 words in
   24.57 s = **183 wpm**, with no internal pause over 0.12 s.
2. **Every shot is authored.** A shot is a pure function of `t, lt, dur` with
   its own set, cast blocking, camera, prop, type and event. A shot is not a
   recipe id plus prose.
3. **Every frame changes.** At least **three independent non-UI layers**, one a
   silhouette of **≥2% of the frame** moving **≥19 px/s**. No run longer than
   **0.4 s** under 1.0 mean luma diff at 192×108. Grain, type boil and the
   ticker are finish, not motion.
4. **Shot lengths are a band, not a grid**, and the band lives in
   `kpop-shot-policy.md`. The gate **as built today** reads min **1.0 s**,
   median **2.5–3.0 s**, max **4.5 s**; the policy target is 1.2 / 3.0 / 5.5
   under 3 min. No constant 2/3/4 s cadence. The test: 1.42–4.38 s, median
   2.74 s.
5. **Every shot moves the camera.** ≥1 px/frame (30 px/s), or ≥3% scale, or
   ≥1.6°/s roll. A declared move that is not painted is a finding.
6. **Type is a paper object with a safe area.** Hero titles fully visible for
   **≥0.5 s** (the test uses ≥1 s); lyrics land within ±2 frames of the measured
   word; no type over a face; 60 px face margin, 40 px hand margin. The
   subtitle band must not cover the feet.
7. **Contact is measured.** Hand–wrist ≤4 px, foot–shadow ≤4 px, held prop ≤6 px
   from the hand. A prop that floats is not a prop.

### 1a. The sync table

The voice is the clock, but the clock is not the picture. Every **content word**
must have a picture event. `sync.json` binds each word to a layer (cast, prop,
light, set, crowd, camera, type) and an event. `scripts/sync-check.mjs` refuses a
shot when:

- a content word has no event within 0.2 s;
- an event names a word that is not in the shot's line;
- the shot has no cast event, no prop/light/set/crowd event, or no camera event;
- two events are more than 1.3 s apart;
- the shot is outside the gate's band (1.0-4.5 s, median 2.5-3.0 s today; the
  target band is `kpop-shot-policy.md`);
- the narration is outside 170–195 wpm, or a word gap is over 0.6 s.

The validator writes `sync.js`; the scene reads `syncAt`/`syncLocal`, so the
timing is one source of truth. The test has **69 events over 74 words** and
prints PASS. This is the difference between "the voice is roughly right" and
"the picture is the voice".

**The opening lesson.** Do not open on a character bouncing under type. Open on
the object that drives the line — the lamp, the card, the door — then reveal the
cast. The first six seconds of the test are a lamp close-up, a pull to the
stage, the NOVA card, the spotlight, and Nova stepping into the light.

### 1b. The performance gate is measured

A table of performance numbers written by the author is not evidence. The
renderer records every cast draw from the same call that paints the character —
`who, x, y, s, pose, face` — and `render-test.mjs --measure` paints the whole
film and writes `measured.json`. `quality-check` reads that file, never a
hand-written `performance.json`.

The gate refuses a shot on any of:

- fewer than **3 distinct poses** (five samples, bucketed at 0.2 rad);
- fewer than **2 pose changes**;
- **no gesture** (hand travel > 28 px over 0.16 s, by forward kinematics);
- fewer than **2 distinct faces**;
- a **still run** over **1.2 s** (body speed under 0.2 rad/s);
- a **T-pose** (both arms near horizontal, elbows under 0.35 rad);
- a lead **face under 90 px**, unless the shot is an audience POV, or the shot
  declares `performance: "macro"` and no rig is drawn (decision 0064; the
  motion row still applies).

`poseAt` holds a pose until 0.32 s before the next event, then moves. Without the
hold key the rig drifts slowly across the shot and reads as a statue sliding;
with it, the body is still, changes on the word, and holds. The measured pass on
the 25 s test: 3-5 poses, 2-4 changes, 1-5 gestures, 108-186 px faces, longest
still 1.13 s, no T-pose.

## 2. The shot blueprint

The authored stack is **seven layers**, not twenty:

| layer | what it is | what moves |
|---|---|---|
| 1 | ground / back wall | torn paper planks, a gradient, a practical |
| 2 | one torn flat | the set's identity (door, mirror, call sheet) |
| 3 | floor plane | perspective lines, a stage lip, a shadow |
| 4 | cast | root translation, pose, face, hair, hands |
| 5 | story prop | held, contacted, carried through the film |
| 6 | display + mono type | one hero, one world label |
| 7 | foreground occluder + atmosphere | curtain, rope, dust, confetti, shards |

Plus the **camera** and the **HUD**. The best gold-standard shots run 5–9
moving layers; the floor is 3.

The test's blueprint per shot is in `proofs/kpop-test/REPORT.md`.

## 3. The rig contract

Use the clean Understudy/Nova human rig. Do not use the source sunflower rig.

- **Idol:** hip **−315**, shoulder −500, head −604; leg lengths 158 + 118;
  foot targets at y **−39**; boots mirrored per side.
- **Mira:** hip **−281**, shoulder −452, head −518; leg lengths 156 + 117;
  foot targets at y **−8**; sneakers mirrored per side.
- **Arms:** `armL` is the far arm and uses **positive** angles; `armR` is the
  near arm and uses **negative** angles. `armL +`, `armR −` keeps the arms out
  of the chest and face. The old proof inverted this; that was the twist.
- **Head:** `petals: 0`, `halo: 0`. A human head with hair, not a sunflower.
- **Hands:** a paper mitten — palm, thumb, two finger creases; open on a raised
  arm, closed at rest. Held props are drawn at the computed hand point, with a
  grip overlay if the prop is large.
- **Feet:** use `footL`/`footR` targets for standing and walking; add a contact
  shadow at the ground point. No floating shoes.
- **Faces:** author `eyes` / `mouth` directly. The expression keys are **shot
  time**, not global time; a face that reads global time snaps to its last
  expression on frame 1.

Safe arm vocabulary (radians, upper/forearm). The live library is `POSES` in
`proofs/kpop-test/test-scenes.js`: every pose is a two-bone arm with a visible
elbow bend, and a raised arm is an L (upper arm out, forearm up), never a
straight T. The table is the historical safe vocabulary, kept for reference.

| pose | armL | armR |
|---|---|---|
| rest | `[0.25, 0.05]` | `[-0.25, -0.05]` |
| reach out | `[0.9, 0.3]` | `[-0.9, -0.3]` |
| hold at chest | `[0.5, 1.2]` | `[-0.5, -1.2]` |
| raise / cheer | `[1.6, 0.2]` | `[-1.6, -0.2]` |
| hand to mouth | `[0.2, 0.1]` | `[-0.9, -1.2]` (use a mic stand) |
| bow | `[0.9, 0.5]` | `[-0.9, -0.5]` + `lean 0.32` |

## 4. Camera grammar

The gold standard's camera is mostly a **2.5D plane**: x, y, zoom, roll. That is
enough if it is painted.

| move | floor | use |
|---|---|---|
| push | 3–6% scale over the shot | intimacy, a reveal |
| pull | 3–8% | a stage reveal, a curtain |
| pan | ≥20 px, ideally 120–440 px | a whip, a track |
| tilt | ≥20 px vertical | a look up/down |
| roll | ≥1.6°/s | unease, a turn |
| shake | 1–2 px | a hit, a lamp |

A shot with no move is a finding. The test has a move in 9/9 shots; the gold
standard has no `setCam` in 24/51.

## 5. Type grammar

- **Hierarchy:** hero title (Anton, 100–170 px), world label (DM Mono, 15–22 px,
  letter-spaced), lyric/subtitle (DM Mono 30 px), HUD (DM Mono 10–15 px).
- **Paper:** cream fill, ink or coral cut edge, hard ink shadow, per-glyph 12 Hz
  boil, optional sticker. No flat vector text.
- **Reveal:** per-character, 0.3–0.5 s, starting on the shot's first word or the
  named word. A title that is only 0.05 s from full at the cut is a miss.
- **Safe areas:** 60 px from a face, 40 px from a hand; the subtitle band top
  must clear the lowest boot. In the test the band is at y 1024, the feet at
  y 960.
- **One idea per frame.** A hero and one world label; not three competing
  headlines.

## 6. Set, prop, palette

- **Paper theatre:** torn edge 3–10 px; shadow 4–16 px at 16–55% ink; a floor
  plane; a proscenium or a foreground occluder; print furniture.
- **Recurring props:** the cue lamp, the name card, the star, the call sheet,
  the microphone, the curtain. A prop is reused 3+ times and carries story.
- **Palette:** cream/ink + **two story hues** + one accent. Four hue families per
  film, ≤3 per shot, top family ≥60%, accent ≤10%. A mood change is a value
  jump first.
- **Stage:** proscenium towers with gold trim and bulbs, a light truss, a
  halftone star, floor tape and a cable, a stage lip, footlights, speakers, a
  crowd and confetti. A flat teal field is not a stage.
- **Composition:** floor 65–87% of the frame, hero 0.86–1.34 scale, type on the
  opposite third, one 10–30% foreground occluder.

## 7. The review loop

The order is fixed:

1. **Every 2nd frame of the 30 fps source**, per shot. No 5 fps or 10 fps
   sheets. One cell per sampled frame.
2. **30 fps cut strips**: 0.5 s before and after every cut, every frame.
3. **Frame diff**: 30 fps, 192×108, mean absolute luma; per shot and per 3×3
   region. Find the dead runs, then confirm them visually.
4. **Fix the shot**, not the report. Re-render the shot, not the film.
5. **Watch the film once at full speed**, then review the sheets again.
6. **`node scripts/sync-check.mjs`** — every content word has a picture event;
   every shot has cast, prop/light/set/crowd and camera events; the table passes
   before the picture is called synced.
7. **`node scripts/motion-check.mjs`** — no shot may freeze; no run over 0.4 s
   under 1.0; the shot band and median hold.

The test's review set is the model:
`proofs/kpop-test/out/shots-15/`, `out/cuts-30/`, `out/frame-diff.json`.

## 8. What the test proves, and what it does not

**Proves:** the clean rig can carry 25 s without a twist; 183 wpm continuous
narration can be the clock; **69 sync events bind every content word to a
picture**; the first six seconds are a lamp-to-stage reveal, not characters
under type; s2 is an audience POV with a playbill and phone; s8 is a cue booth
with a window to the stage; 9/9 shots have a camera move and 5+ moving layers;
no shot has a dead run over 3 frames (s1's 0.1 s pre-roll); type, props,
curtains, stars, clipboards, a call sheet and a mic stand can be authored and
contacted; the stage has a cream/mustard star, proscenium, truss, halftone,
print frame, stage clock, monitor wedges, tape and cable; the short has 9
distinct worlds and 22 SFX cues; the film is mastered to −14.2 LUFS / −1.6
dBTP; and the paint is deterministic — the source `grainCanvas` uses
`Math.random()`, so a film must override it with a hashed grain before
`initTextures()`. The test's 1-worker and 4-worker frames hash the same, frame
for frame; twin hash
`sha256:bda186a9fb4711229098d725d1a293771c5d39ba36d81e0005c2bbc77059e238`.

The ten-check gate is **10/10**; my own score is **9/10**, because the cast is
still a paper doll, the short has SFX but no music, and 9 worlds are not the
gold standard's 51 shots. Those are the next quality pass, not the gate.

**Does not prove:** the cast's acting at the gold standard's level; a song; the
density of 51 hand-authored shots; a 3D camera; a chorus/formation system; the
full studio pipeline. The next film should be authored at the same grammar with
more performance, music and set density, and a stronger second business in the
quiet beats.
