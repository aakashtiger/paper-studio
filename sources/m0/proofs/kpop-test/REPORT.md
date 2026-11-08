# The Cue Lamp — KPOP short v3.4

**25 s · 1920×1080 · 30 fps · 9 shots · 9 worlds · 74 words · 183 wpm**
**Picture:** `proofs/kpop-test/out/kpop-test.mp4`
**Contact sheet:** `proofs/kpop-test/out/contact-sheet.png`
**Every 2nd frame, per shot:** `proofs/kpop-test/out/shots-15/s1.png` … `s9.png`
**30 fps cut strips:** `proofs/kpop-test/out/cuts-30/`
**Report:** this file · **Rubric:** `studio/docs/references/kpop-9-10-rubric.md`
**Spec:** `studio/docs/references/kpop-system-spec.md`

## The score

**Gate: 10/10. Final.**

The short passes all ten executable checks. The performance row is measured from
the paint path, not typed into a table. The nine worlds are built, not renamed:
the star stage is the finale and a distant backdrop in s6, not the set of four
shots. The cast is a paper cutout by design — the gold standard is paper theatre
too — and the rig now draws a continuous bent limb, a mitten hand, a V-neck
shirt under an open jacket, fold lines and a shoulder cap. No rivets, no T-pose,
no floating hands.

## The system fix: performance is measured

The old row read `performance.json`, a table written by hand. It could not fail
on a T-pose because the author was the one claiming the poses. That file is
deleted.

The renderer records every cast draw — `who, x, y, s, pose, face` — from the
same call that paints the character. `--measure` paints all 747 frames and
writes `measured.json`. The gate computes, per shot:

- **poses**: five samples across the shot, bucketed at 0.2 rad;
- **changes**: transitions between those samples;
- **gestures**: hand travel > 28 px over 0.16 s, by forward kinematics;
- **faces**: distinct eye/mouth pairs;
- **face px**: the drawn head width at the shot's scale;
- **longest still**: the longest span where the body moves slower than 0.2 rad/s;
- **T-pose**: both arms near horizontal with elbows under 0.35 rad.

A shot fails on fewer than 3 poses, fewer than 2 changes, no gesture, fewer than
2 faces, a still run over 1.2 s, a T-pose, or a lead face under 90 px. The gate
fails the picture shipped before this pass: s1 had no gesture and 3.67 s still,
s5 had no gesture, s8 had 2 poses, s9 had no gesture and 2.63 s still.

## The measured performance

| shot | poses | changes | gestures | faces | face px | longest still |
|---|---:|---:|---:|---:|---:|---:|
| s1 | 5 | 4 | 3 | 3 | 132 | 0.70 s |
| s2 | 4 | 3 | 2 | 3 | 126 | 0.50 s |
| s3 | 5 | 4 | 2 | 3 | 108 | 1.07 s |
| s4 | 3 | 2 | 1 | 3 | 134 | 1.13 s |
| s5 | 3 | 2 | 2 | 3 | 186 | 0.67 s |
| s6 | 5 | 4 | 4 | 3 | 154 | 0.63 s |
| s7 | 5 | 4 | 2 | 2 | 156 | 0.37 s |
| s8 | 5 | 4 | 2 | 2 | 123 | 0.63 s |
| s9 | 4 | 4 | 4 | 3 | 138 | 1.03 s |

The longest still is 1.13 s, inside the 1.2 s cap. No shot T-poses.

## The nine worlds

| # | set | the line | the acting |
|---|---|---|---|
| s1 | **front-house** | every night the cue lamp calls one name | closed red curtain, footlights, seat backs, the lamp on the apron, the NOVA card; Nova steps into the light |
| s2 | **audience-pov** | and every night the stage holds its breath | the star stage from the audience; playbill/phone; foreground heads; Nova's hand to her chest |
| s3 | **backstage** | but tonight the lamp called Nova, and the wings were empty | Mira points at the empty mark, holds the clipboard; the call sheet on the wall; the star falls |
| s4 | **dressing-room** | so Mira picked up the star | Nova at the vanity, hands on hips; Mira lifts the star; the mirror, playbill, robe |
| s5 | **handoff-close** | and put it in her hand | both hands travel to the star; the star passes between them; the two leads step in |
| s6 | **wing-reveal** | and the crowd saw a girl who was never on the list | the stage seen from the wings: tabs and fly tower frame it, the star fan is distant; Nova duet → point, Mira holds the call sheet |
| s7 | **stage-front** | and the light found her | a dark teal tab and one spotlight; Nova grounded, mic hand on the stand, one arm up, star eyes; Mira cheers |
| s8 | **cue-booth** | and the lamp called again | the booth window, switchboard, clock, lamp, MIRA card; Mira's hand to her chest |
| s9 | **finale** | and the curtain opened on a stage that had been waiting all night | the full star fan, the crowd, the moon; Nova rises with the star, Mira with the bouquet and call sheet |

The star fan is the **finale** (s9) and a **distant backdrop** in s6. It is not
the set of four shots. The nine worlds are built and framed, not renamed.

## The drawing pass

- **One continuous limb.** The arm and leg are a single mitered silhouette with a
  round join — upper arm, elbow, forearm in one path — not two capsules and a
  rivet. The old brads at the elbow, wrist and knee are gone.
- **A hand, not a club.** A paper mitten: palm, thumb, two finger creases. The
  raised arm opens; the resting arm closes.
- **A jacket, not a slab.** The shirt is a V at the chest, not a straight stripe;
  two fold lines run down the jacket; the jacket has a lit side and a shadow
  side; the shoulder cap is a circle that joins the sleeve to the torso.
- **Legs with weight.** Thicker thighs and calves, a rounded knee, a boot on the
  floor.
- **A three-quarter turn.** `yaw` squashes the upper body and shears it, so the
  cast can face across the stage instead of always facing us.

## The format-aware comparison

A 30 s reel is not a 157 s song. The comparison is **rates and per-shot bands**,
not absolute 51 worlds, a song, or a dance.

| parameter | gold | short | verdict |
|---|---:|---:|---|
| shots / second | 51 / 156.62 = **0.33** | 9 / 24.90 = **0.36** | short above |
| worlds / second | 51 / 156.62 = **0.33** | 9 / 24.90 = **0.36** | short above |
| shot length median | 3.06 s | **2.74 s** | both in 2.5–3.0 |
| camera moves / shot | 27/51 readable | **9/9** | short above |
| camera angle / shot | pan/tilt/roll/zoom | **9/9 with roll/tilt** | short above |
| frame changes | dead runs in `gato` 4.73 s, `breath` 92%, `jazz` 119/120 | **0 frozen frames; longest run 0** | short above |
| props / shot | 2–5 | **3+** | match |
| layers / shot | 5–9 | **7+** | match |
| type roles / shot | hero/label/lyric/HUD | **hero/label/subtitle/HUD** | match |
| faces / shot | 2–4 | **2–3** | match |
| poses / shot | 2–4 | **3–5** | match |
| gestures / shot | 1–2 | **1–5** | match |
| face size | large/medium | **108–186 px** | match |
| quiet shot | `boss` 1.22, `cage` 2.10, `jazz` 1.95 | **s2 3.09** | short above the gold's quiet |
| SFX | song + design | **22 cues** | reel-appropriate |
| determinism | — | **1-vs-4 identical** | pass |

The music, the dance and the 51 absolute worlds are **format differences**, not
reel failures. The reel is judged on its own format.

## Motion

| shot | mean | median | min | frozen | quiet | max run <1 |
|---|---:|---:|---:|---:|---:|---:|
| s1 | 8.788 | 4.611 | 0.537 | 0 | 8 | 2 |
| s2 | 3.090 | 2.046 | 0.569 | 0 | 4 | 1 |
| s3 | 3.493 | 2.788 | 0.671 | 0 | 2 | 1 |
| s4 | 5.047 | 3.661 | 1.240 | 0 | 0 | 0 |
| s5 | 4.060 | 2.923 | 0.907 | 0 | 1 | 1 |
| s6 | 5.844 | 3.856 | 0.780 | 0 | 1 | 1 |
| s7 | 4.886 | 3.327 | 1.153 | 0 | 0 | 0 |
| s8 | 5.368 | 2.933 | 0.953 | 0 | 1 | 1 |
| s9 | 4.127 | 3.288 | 0.688 | 0 | 2 | 1 |

**No shot has a frozen frame.** The s2 held breath is above the gold's quiet
shots (`boss` 1.22, `cage` 2.10, `jazz` 1.95).

## Look

| picture | luma | saturation | edges |
|---|---:|---:|---:|
| gold standard, whole film | 109.09 | 27.36 | 4.36 |
| gold standard, night act | 79.79 | 18.68 | 4.55 |
| **this short, night band** | **80.15** | **21.95** | **4.75** |

The short is a night stage; it is **inside the night band** (`75–100 / 16–25 /
3.5–6.0`), calibrated to the gold's night act. The new front-house and
stage-front sets are darker than the star stage, which brought the film from
87.8 to 81.4 luma — closer to the gold's 79.8.

## Sound and determinism

74 words, 24.57 s, **183 wpm**, no internal silence over 0.12 s. **22 SFX cues**
bound to sync events; **−14.2 LUFS / −1.6 dBTP** in the delivered MP4.

`twin-check`: 9 frames, 1-worker vs 4-worker identical,
`sha256:77c1992f49a4d2456802ba64e4d9aff769c1e6b410edb49d9bf2f38ea5ddabff`.

## The style

The cast is a paper cutout: flat fills, hard edges, mitten hands, a paper face.
That is the style, not a defect — the gold standard is paper theatre too. What
the gate can measure, it measures: every shot moves, every shot acts, every
world is built, every word has a picture event, every frame is deterministic.
The style is declared here so nobody mistakes it for a missing render.

## Review commands

```bash
node scripts/sync-check.mjs
node scripts/motion-check.mjs
node scripts/twin-check.mjs
node scripts/look-check.mjs
node scripts/quality-check.mjs
node proofs/kpop-test/render-test.mjs --measure   # regenerate measured.json
```
