# Critique - motion, edit and sound identity of Paper K-pop v1

**Critic:** editor / motion director / sound.
**Spec reviewed:** `docs/research/identity/KPOP-IDENTITY.md` v1 (4 Nov 2026) and `kpop-identity.proposed.json`.
**Canonical film claimed:** `out/claude-pop.mp4`, 1920x1080, 30 fps, 4,699 frames, 156.63 s.
**Verdict:** **5.0 / 10. SIGN: no.** The grammar is largely right; the load-bearing numbers are not all from the same film, and three rules invert the reference.

---

## 0. The evidence base is three artifacts (and a declared bible), and the spec mixes them

This is the root cause of most findings below, so it comes first.

| Artifact | What it actually is | Shots | Lyrics | Type | Sound |
|---|---|---|---|---|---|
| **A** `A-engine.md` | 1080p source code (`src/*`), 30 fps | 51 scenes, **27 `setCam`**, 24 inherit | **45 lines / 213 words** | **31 px DM Mono** band, HUD, stickers, vertical, 6 families | not measured |
| **C** `C-edit-camera-sound.md` | **1280x720, 24 fps, 3,758 frames**, `ref/PDoomVideo` | **64 visible shots** | **46 lines / 227 words** | **50 px Shantell Sans**, centred, 2 systems, no HUD, no sticker, no underline | **-15.6 LUFS / -3.7 dBTP** |
| **I** `I-frames.md` | 1080p `claude-pop.mp4`, 30 fps | **54 shots / 53 boundaries** | not measured | not measured | not measured |
| **STORYBOARD.md** | 54-card shot list (prose) | 54 | prose | prose | prose |

C is not a variant of the canonical film: it declares 1280x720 at **24 fps** (C §9, l.540-541), while the reference is 1080x30; its cast is Clawd and the Researcher, not SOL and MIRA. A's 51-scene source and C's 64-shot 720p film are different artifacts. I's 54 cards are a third count.

The spec draws from all three without declaring which film each number belongs to:

- **31 px subtitle, HUD, stickers, six type families** -> A (the code), not C (the delivered 720p film, whose subtitle is 50 px Shantell Sans and which has "nothing boxed except the subtitle", C l.438-441).
- **46 lines / 227 words / 97.8 wpm / -15.6 LUFS** -> C, which the spec's own evidence index calls "comparison only".
- **-15.6** is also outside the spec's own invariant "−14 LUFS ±1" (KPOP-IDENTITY §3.21 vs invariant 12).
- **"5 static shots"** -> matches nothing. The only "5" in the evidence is I §0's **5 shots without a drawn character** (sunflower, mug tower, iris, cube, door) - and none of those is static. B's staging table has **zero** shots declared static.
- **"crash up to 8.0"** -> C's 720p film (C §2.2, shot 20); the canonical code's z range is **.84-3.55** (A §5, l.797).
- **"11/61 cuts on the 88 BPM grid"** -> C's 720p film (C §1.4, §9); the canonical film's count is not measured. A only says the canonical film is **not** beat-quantised (A §7, l.352).

There is a fourth source, and it is the most misleading: **PRODUCTION.md's declared rules**. It says 52 shots (l.80), a 240x92 ticker (l.63), subtitles >=28 px (l.85), "every shot must have ... a camera move" (l.87), "one piece of paper physics (fold, tear, curl, flutter, stack)" (l.87), "maximum two type systems per frame" (l.60), and "text enters on the sung word, not the line start" (l.58). A-engine shows the code contradicts several: **51 scenes and 246x96** (§12 l.659-660), a **26 px** subtitle in the P(DOOM) balloon (§10 l.600), **24 shots with no `setCam`** (§5 l.271), **no fold/curl/bend/collision** (§12 l.640), and **six type families** (§8.1 l.391). The spec inherits the declarations as if they were measurements. A reader cannot tell whether the identity is the intention or the film; a checker cannot enforce both.

**P0-1 (exact fix):** declare **one** canonical artifact (`out/claude-pop.mp4`). Re-derive every numeric value from that file with one command, and tag every parameter with `basis: "film" | "code" | "storyboard" | "production-bible" | "kit" | "comparison"`. Delete every C-derived value from the identity or mark it `comparison-only`; mark every PRODUCTION.md declaration that the code does not implement as `production-bible` (a goal, not a measurement). Until this is done, the spec cannot be checked, because two values can both be "true" of different artifacts.

---

## 1. Camera

### 1.1 The model is right

`x`, `y`, `z` (uniform scale), `roll`, `shake`, no FOV, no DOF, no perspective, no true parallax: this is exactly what the source does (A §5, l.250-270; C §2.3, l.275-279; B l.419-431). Keep it. A "dolly" is a z change, a "truck" is an x change, a "tilt" is a y change: correct.

Two model-level corrections:

1. **`orbit` is not an orbit.** A 2D similarity cannot orbit a subject; it can only translate and scale. The source's "orbit" is a translate + scale on layered paper (C l.279). The spec's "`orbit`: x/y arc + z; arc 10-40 deg" describes a 3D move it has already banned. Fix: define orbit as a **curved x/y path + z, no viewpoint rotation**, and measure curvature in px, not degrees.
2. **`handheld` is mislabelled.** The spec calls 71/63 rad/s "low-frequency". That is **11.3 / 10.0 Hz**, near Nyquist at 30 fps (A §5, l.253-256: phase step 2.37/2.10 rad, alternating almost every frame). That is a buzz, not a handheld drift. Fix: "high-frequency shake 10-11 Hz, 0-12 px" for impacts; a separate low-frequency drift (0.5-2 Hz) if a documentary beat is wanted.

### 1.2 24/51 vs 90% - the moving-share contradiction

The source has **27 of 51 shots with `setCam`** (53%); **24 inherit** (A §5 l.271; B l.29, l.578). The spec's `camera.movingShare: 0.90-1.0` cites "A 5; C 2". A says 53%. C says 98.4% - for the **720p comparison film** (C l.263). The canonical film therefore **fails the spec's own invariant**.

The 24 inherited shots are not all still. At least eight move the **world**, not the camera: `clips` 1.45->1.0, `pto` 1.24->1.0, `recursive` 1.35->1.0, `ilya` 1->1.18->1.0, `reveal` 1.55->1.0, `desk` 2.6->1.0, `finaldance` orbit ±50, `rlhf` world rotate/slide (B l.550-575). The code also uses local `ctx.scale` (2.25x mugs, 2.6->1.0 desk, 1.55->1.0 reveal; A §5 l.277). The spec's model has **no world transform**, so it cannot describe the last act at all. PRODUCTION.md l.87 declares "every shot must have ... a camera move"; the code does not, and the 90% figure is the declaration, not the measurement.

**P0-2 (exact fix):** add a scene transform `world: { scale, rotate, translate }`, distinct from the camera. Define `moving` as **camera OR world OR subject**. Then either (a) state the measured camera share (53%) and the measured picture share (100%), or (b) keep 90% as a **channel rule** with `basis: "rule"` and say the reference does not meet it. Do not cite A for 90%.

### 1.3 The "5 static" is unsourced

There is no list of five static shots in A or B. B's staging table has no static shot; the closest is `chair` "930,560, 1.03->1.00" (a push, not a static) and `breath` "none set" (but the door breathes ±1.2%). The storyboard's card 27 says "static, tiny push" - also not static. The only "5" in the evidence is I's five **character-less** shots, which are not the static ones.

If no-`setCam` is read as static, the canonical has **24** static (47%), with **16 of 17** Act IV shots carrying no camera at all - which would also fail "never two static in a row". That is why the world transform (1.2) is the correct fix, not a smaller static count.

**Fix:** delete "static 5 (9%)". If the table is the 54 cards, list the five card ids and their camera column. If it is the code, list the 24 inherited shots and their world transforms.

### 1.4 The frequency table is authored from the storyboard, not measured

The spec says "measured/authored from 54 cards". The 54 cards are a **pitch document**, not the film; several cards describe moves the code does not perform (card 05 "slow orbit (parallax)", code `boss` "none set"; card 01 "starts at 3.2", code kf 3.55->1.55->1.0->1.04). The table also contains **`roll/warp 1`** and **`transition micro 1`**, which are not in the declared 10-move vocabulary (`camera.moves`). A checker reading the vocabulary would reject the table's own two rows.

**Fix:** count from the code's 27 `setCam` calls (and the eight world moves), not the cards; either add `roll`/`micro` as defined move kinds or fold them into `orbit`/`static`.

### 1.5 Travel bands do not cover the reference's signature moves

- **push/pull `.03-.25`** covers `cold` (.84->1.05, 25%), `loss` (1.0->1.16, 16%), `mugs` (.90->1.03, 14%). It **excludes** `chase` (1.02->1.42, 39%), `sparks` (3.55->1.0, 72% pull), `reveal` (1.55->1.0, 35%), `desk` (2.6->1.0, 62%). Those are the film's act-ending reveals. A check using .03-.25 refuses them.
- **pan 24-600**: the source has **no true pans**. Lateral movement is a track that keeps the subject or a whip; the one "pan" is shot 61, panning along a cast line (C l.267-269). A's camera x range 760-1430 is a *position*, not travel.
- **The instrument saturates.** C l.179: 49/62 windows saturate at |dx|/|dy| = 213.33 px and |dz| = 25%; "read the sign, not the magnitude". So any band above 213 px / 25% cannot be verified by `style:measure` on the reference. The bands are fine for `camera:check` (score from/to) but not for `style:measure` (image).

**Fix:** state the per-move bands: `push/pull .03-.25` for a normal move, `reveal_pull .30-.72` for the act-ending reveal, `crash .5-3.6` (canonical max 3.55); drop `pan` from the required vocabulary or define it as "pan across a static set" with 0-5% share. Cap image-measured bands at 213 px / 25%, or widen the search constant. Mark `crashMax 8.0` as comparison-only.

### 1.6 Seam and cut-at-rest are inverted

F §5.1 (l.297-301):

```
maxSpeedJump 0.35, maxAccelJump 0.50, maxDirectionTurnDeg 90,
cutAtRestMaxShare 0.5
```

The spec says **"cut at rest 50-80% of cuts"** (KPOP-IDENTITY §3.14; JSON `camera.seam.cutAtRest: [0.5, 0.8]`). That is the opposite of the cited source: F says **at most** 50% may be at rest, to avoid a slideshow. The reference's signature is the opposite of a cut at rest: the cut lands **inside an action that crosses it** (C l.365-368: only 4/63 boundaries are not cuts, and all 4 sit on chapter breaks). A rule that *requires* 50-80% at rest would forbid the reference's best cuts.

**P0-3 (exact fix):** `cutAtRestShareMax: 0.5`; add `cutOnMotionMin: 0.4`; define speed as px/frame normalised by frame width, and `jump = |v_out - v_in| / max(|v_out|, |v_in|)`. Remove the 50-80% range.

### 1.7 "No run >2" contradicts the canonical film

The canonical has **three consecutive push-ins**: `atoms` (17), `cage` (18), `chorus2` (19) - B l.526-528; and four push-ins in six shots at 2, 4, 6, 7. (The comparison film has a run of 5, C l.266.) The pack's `maxRun: 2` is a rule; the spec presents it as the source's grammar.

**Fix:** keep `maxRun 2` as a **channel rule** (`basis: "rule"`), and state that the reference violates it. Or set it to 3 and measure.

### 1.8 Roll, shake, decay

- "no decay in the source (fix: decay 0)" is self-contradictory. State: source decay = 0; the channel may apply a decay (proposal: 0.85/s), scope F.
- Roll `-4..+7.5`: asymmetric. The +7.5 is an impact (`loss`), the -4 is a tilt. Say "roll <=4 deg non-impact, <=8 deg with an impact event"; the current forbidden "Dutch >8 without an impact" leaves 4-8 undefined.
- `byBeat.release`: the spec says `pull_back`; the pack's `tokens.motion.camera.byBeat.release` says **`orbit`** (tokens.json l.438). A score following the spec contradicts the pack. Pick one; this is a film choice (F), not a fixed identity value.

### 1.9 Whip and crash values

- `whip 300-900 px`: the source's whip pans are 1,700 px (C l.33); 300-900 is below them.
- `crash .50-3.0`: the source's crash is .95->3.40 (3.6x) and 1.9->2.5; the max should be 3.55, with 8.0 comparison-only.
- `kick 6-10 px`: this is a rescale of Kit B's 3 px at 640 (x3 = 9 px at 1920), not a measurement of the film (E §4.1 l.645-647; E l.596). Say so.

---

## 2. Edit

### 2.1 What is solid

The two duration tables are the best-measured part of the spec: 51 scenes median **3.06 s**, 54 cards **2.86 s as reported** (2.90 recomputed; see the note), p10 1.58-1.64, p90 4.60-4.82, max 6.14, min .66, cuts **19.2-20.3/min** (A §7 l.340-347; STORYBOARD). The distribution is genuinely bimodal: 1-2 s 29-33%, 2-3 s 14-15% (the valley), 3-5 s 41-45%, >5 s 7-10%. The diagnosis - chorus fast, verse long, finale held - is right.

Small exactness note: from the 54 storyboard durations, the **median is 2.90 s** (27th 2.86, 28th 2.94), not 2.86; p90 recomputes to 4.62, not 4.60. The differences are trivial, but the table says "measured", so state the percentile method (nearest-rank vs interpolated).

### 2.2 The per-format bands are arithmetically wrong

`cuts/min = (shots - 1) / (duration / 60)`.

| Format | Shots | Cuts | Actual cuts/min | Spec band | Verdict |
|---|---|---|---|---|---|
| 30 s | 8 | 7 | **14.0** | 16-24 | fails |
| 30 s | 12 | 11 | 22.0 | 16-24 | ok |
| 45 s | 12 | 11 | **14.7** | 16-22 | fails |
| 45 s | 18 | 17 | **22.7** | 16-22 | fails |
| 60 s | 16 | 15 | **15.0** | 16-22 | fails |
| 60 s | 24 | 23 | **23.0** | 16-22 | fails |
| 156 s | 45 | 44 | **16.9** | 18-22 | fails |
| 156 s | 60 | 59 | **22.6** | 18-22 | fails |

A legal score at the low end of every shot range is refused by the cuts/min band, and a legal score at the high end is refused too. This is a checker that fails its own examples.

**P0-4 (exact fix):** derive one from the other in the schema. Either narrow the shot ranges to **30 s: 9-11; 45 s: 13-17; 60 s: 17-22; 156 s: 48-57**, or widen the bands to **30 s: 14-22; 45 s: 14.7-22.7; 60 s: 15-23; 156 s: 17-23**. Then add `cutsPerMin = (shots-1)/duration*60` as a computed field and a preflight check that the two agree.

### 2.3 The 156 s median band is too wide

At 156 s, median **2.4** implies ~65 shots -> 24.5 cuts/min, outside the stated 18-22. The 156 s band should be **2.8-3.1** (the measured 2.86-3.06). The 2.4-3.2 band belongs to the 30 s short. Fix: per-format median, not one band for all.

### 2.4 Bimodality is named, not captured

The spec gives per-shot bands (chorus 1.58-2.20, verse 3.0-5.0) but no **section rule**. A film with all shots at 2.9 s passes the median and the min/max, and has no rhythm. The reference's signature is the **shape**: a cluster at 1.58-2.1, a valley at 2.2-3.0, a cluster at 3.0-5.0.

**P0-5 (exact fix):** add a distribution check: **>=30% of shots in 1.58-2.20, >=30% in 3.0-5.0, <=15% in 2.2-3.0**, plus **>=1 run of 2-3 chorus shots**. Add a section map (`chorus` / `verse` / `finale`) to the score so the check knows which shot is which.

Also: **"2-4 shots per lyric line" is not supported.** Chorus 1 is 5 shots over 6 lines (B l.517-526; C l.405-406); C's chorus 3 is 7 shots over 5 lines. The actual is **1-2 shots per line, 2-4 per 2-line phrase**. Fix the sentence.

### 2.5 Cut on word vs cut on beat - half right, and the evidence is mixed

- The canonical's **47/51 scene starts land on a lyric line start/end** (A §7 l.350), not on every word. The subtitle enters at `line.start - 0.12` and holds to `end + 0.35` (A §8.6 l.499-501); the **highlight** is word-synced.
- For a **song**, cut on the sung **line** (or 2-line phrase) - the spec's "cut on the sung line" is right.
- For a **narrated film**, `voice --apply` moves line starts to measured word times and snaps shot bounds (AGENTS/0035); `audit:reaction` requires a reaction **0-3 frames after** the word. Cutting on *every* word is neither what the canonical does nor what the narration pipeline does.
- The "11/61 on the 88 BPM grid" is C's 720p film, not the canonical (see §0). A says only that the canonical cuts are not beat-quantised (A l.352), and the 88 BPM grid drives **bodies and flowers, not cuts or words** (A l.560).

**Fix:** state the rule by mode: **song = cut on the line/phrase (80-95% of starts); narration = cut on the line start, reaction 0-3 frames after the word; neither cuts on the beat.** Delete "only 11/61" or mark it comparison-only.

### 2.6 19-20 vs 20.3

If the film has 54 shots, cuts = 53 -> 20.3/min. The spec's 19-20 is the 51-scene count. The band 18-22 covers both, but the "canonical 19-20" line is a code count, not a film count. Say which.

---

## 3. Motion

### 3.1 What is right

1-3 actions, one hero, at least one non-camera action per shot, no dead hold >0.4 s, 0.4 s freeze budget (E §4.1 l.657: three independent sources agree), a motion floor, planted feet. Keep all of it.

### 3.2 Squash / overshoot / anticipation contradict the cited evidence

This is the most serious motion finding. The spec gives, as invariants:

- squash **.96-1.04** (`movement.squash`, source "B 3.5")
- overshoot **1.03-1.06** (`movement.overshoot`, source "B 3.5")
- anticipation **2-4 frames** (`movement.anticipation`, source "B 3.5")

B §3.5 says the opposite:

> **Anticipation: none - there is no pre-move dip anywhere in the cast.**
> So: **paper cuts do not squash; they pop, slam and snap.** (B l.325-327)
> The only squash is `ctx.scale(1+sq*.55, 1-sq*.78)` on the chinchilla - **55% wider, 78% shorter** at sq=1 (B l.321).

The pack (J §3, l.252) declares `squash 0.12, overshoot 0.18, anticipation 0.10` as **amplitudes**; J l.254 gives **2-frame anticipation, 3-frame overshoot, 4-8 frame hair/skirt/hand lag**; J l.253 says a paper snap is **one frame of anticipation and one frame of contact**.

The spec's numbers match none of these:

| Value | Source | Pack / J | Spec | Verdict |
|---|---|---|---|---|
| squash amplitude | 55%/78% one gag | 0.12 (12%) | 4% | 3x-14x too narrow, invented |
| overshoot | `backOut c=1.70158` (~10%) | 0.18 (18%) | 3-6% | invented, matches neither |
| anticipation | **none** | 2 frames | 2-4 frames | wider than both, and B denies it |
| hair lag | not measured | 4-8 frames | 2-4 frames | narrower than J, invented |

**P0-6 (exact fix):** pick one story and say it:

- **Paper-cut story (the source):** no anticipation, no rig squash; a paper cut **pops, slams and snaps**. Delete the three invariants; keep a `pop` (scale .55->1) and a `slam` (2.6->1 with `easeIn`), both measured.
- **Physical-comedy story:** `squash` is an **F event**, amplitude **0.12** (the pack), only on a declared gag; `overshoot` from **`backOut` c=1.70158** (the only overshoot curve in the source); `anticipation 1-2 frames` (J l.253); hair/petal lag **4-8 frames** (J l.254).

Do not cite B §3.5 for values B §3.5 denies.

### 3.3 The paper-physics event does not exist

A §12 (l.640): "Paper fold / curl / bend / collision: **F** - closest is sine flutter, static torn paths." B l.327: paper cuts pop/slam/snap. PRODUCTION.md l.87 **declares** "one piece of paper physics (fold, tear, curl, flutter, stack)" per shot, but the code does not implement it. The spec repeats the declaration as an invariant. The engine has no such event, no renderer function, and no command. This is a new capability, not an identity value; it fails AGENTS non-negotiable 4 ("every feature ships with a command that proves it works").

**Fix:** either define the event as what the film actually has - **a paper impact: pop, slam, snap, flutter, confetti** - and add `npm run audit:paper` that counts it per shot; or build the fold/curl and then make it invariant. Until then, delete it.

### 3.4 Walk cycle - missing

B l.283: "**no walk / run cycle** (every run is re-derived per scene)"; B l.674: "add `walk(phase)`". The spec's 3.10 says "walk/run phase from distance, not wall clock" - a principle, not a cycle. There is no stride length, cadence, contact/down/pass/up, foot plant, or arm counter-swing. The reference has runs (gym, chase, gpus) and a walk (data centre). Without a cycle, every film re-derives it, which is exactly the defect B names.

**Fix:** add `cast.walk { stridePx, cadencePerSec, contactFrames, downFrames, passFrames, upFrames, armSwing, footPitch }` and a `walk(phase)` rig function; `audit:body` checks the planted foot, not just the hand.

### 3.5 Gesture vocabulary - missing

The 11 pose keys are generic: bounce, sway, lean, headTilt, headTurn, hairSwing, petalDrift, armL/R, legL/R, flip. The reference is a **K-pop choreography film**: point choreography, sunflower hands, hair flips, hip sway, formation changes, bows, a signature move (STORYBOARD 15, 51, 52; B l.522). None of these is nameable. A film can pass "1-3 actions" with a bounce and no dance.

**Fix:** add a gesture set - `point`, `wave`, `heart-hands`, `hair-flip`, `hip-sway`, `bow`, `formation-change`, `signature` - each with 2-4 frame durations; add a `gesture` event; check **>=1 gesture per chorus shot**.

### 3.6 Reaction timing - present, but in the wrong table

The 0-3 frame reaction is only in §3.20 (interaction), not in §3.16 (motion). The studio has `audit:reaction`. J is internally split: l.171 says a reaction starts **0-45 ms after** its word (0-1.3 frames), while l.130 says "every visual reaction lands **0-3 frames before** its word". Those cannot both be true.

**Fix:** define `reaction` as an event with `wordId` and `offsetFrames` in **[0, 3] after**; resolve the "before" variant (an **anticipatory look** may lead the word; a **reaction** may not); make `audit:reaction` the command for every cast reaction, not one.

### 3.7 Crowd - the rule contradicts the source

A §6 (l.321): the crowd bobs on the beat, `max(0, sin(beat*pi + i*.6))*10`, every 3rd raises an arm, every 5th holds a phone light. That is an **ambient beat loop**, and it is an invariant of the source. The spec says "extras frozen except on cue; no ambient loop" (§3.20). The reference's chorus is a crowd moving on the beat.

**Fix:** distinguish **crowd bed** (beat bob, 10 px, on the beat - allowed) from **crowd action** (a formation change or a reaction, on cue, 1-3 per shot). The current rule reads as a ban on the reference's chorus.

### 3.8 Blink, hair and petals

- **Blink** 4 frames every 0.5-2.3 s, hides an expression swap: this is E §4.1 (l.510) and J l.512, a **kit** rule, not a measurement of claude-pop (A's blink is a continuous scalar >.5, no cadence). Fine to keep, but label it `basis: "kit"`.
- **Hair/petal lag**: spec 2-4 frames; J l.254 says 4-8. 2-4 is invented and narrower. Fix to 4-8, or measure.
- **Petal drift** amplitude is missing: A l.320 gives `sin(t*.6...8)*.03...05 rad`; add it to the pose key.

### 3.9 Hero and freeze are not checkable

- "One hero action" has no `hero` flag in `events[]`. Add `events[].hero: true`; check exactly one per shot.
- `movement.freezeBudget` and `motion.freezeBudget` are **duplicate ids** with the same value, as are `movement.actionsPerShot`/`motion.actionsPerShot`, `movement.squash`/`motion.squash`, etc. A checker reading one will drift from the other. Keep one block and delete the other (the spec's own §4.2 says "extend, do not duplicate").
- `motion.paperPhysics: 1` has no `measure` that exists (see 3.3).

### 3.10 Creep provenance

`holdCreep .02%/frame` and `pushCreep .06%/frame` are E §4.2's **proposed retune** (E l.664), not measurements of claude-pop; the source has no creep in 24 shots. Label `basis: "kit/proposed"`. `kick 6-10 px` is a rescale of 3 px at 640 (E l.596) - say so.

---

## 4. Transitions - the taxonomy is wrong

### 4.1 What the source actually does

- The **iris is authored inside the outgoing shot**: it closes to a flat colour, and **the next shot begins with a hard cut** (A §7 l.371). So an iris is a **shot-ending device**, not a boundary transition. 10 iris calls / 51 scenes = **19.6%**.
- **Flashes are 38 calls: 14 open a shot, 24 mark a hit or close** (A l.362). A flash is an **in-shot impact** or an **opening accent**, not a cut. 14/51 = **27.5%** of shots open on a flash; 38/51 = **74.5%** contain one.
- **I-frames** (I §2): 50/53 boundaries are hard cuts, **2 soft** (7.90, 135.40), **1 melt** (27.90). Boundary shares: **94.3% hard, 3.8% soft, 1.9% melt**.
- The **wipe is dead code**: `drawPaperWipe` is implemented and never called (A §7 l.355); the storyboard's "wipe" lines are prose. **Match cut: 1/51 = 2%.**

### 4.2 The shares cannot be right

The spec: hard cut **80-90%**, iris **10-20%**, flash **0-10%**, wipe **0-5%**, match **5-10%**, hold **0-5%**. The minimums sum to **95%**, the maximums to **140%**. No film can satisfy all bands. The reference's 94% hard cut is **above** the 90% maximum. And flash-as-a-transition does not exist in the source.

**P0-7 (exact fix):** split the model into two layers and give each its own denominator:

| Layer | Kind | Share | Duration | Params |
|---|---|---|---|---|
| boundary | **hard cut** | **1 - melt - soft** (0.94-1.00) | 0 | - |
| boundary | **melt** (V) | 0-0.02 | 4-8 f | the 27.90 Chinese-room melt |
| boundary | **soft cut** (V) | 0-0.04 | 0 | low-contrast cut, no blend (7.90, 135.40) |
| device (out) | **iris close** | **0.10-0.20 of shots** | .17-.44 s | r 900-1500 -> 8-60, feather 26-120, colour ink/blueD/pink/gold |
| device (in) | **flash open** | **0.20-0.30 of shots** | .14-.44 s | alpha .22-1, cream/red/gold/mint |
| device (hit) | **flash hit** | 0.2-0.3/s | .14-.44 s | same |
| device | **match cut** | 0.02-0.05 of boundaries | 0 | silhouette / scale / orientation / direction |
| device | **hold** | 0-0.05 | <=2 s | last shot only |
| X | **dissolve** | 0 | - | or V <=0.04 with a frame proof |

Boundaries sum to 1. Devices are per-shot shares and do not sum with boundaries. That is the only model that matches A, B and I at once.

### 4.3 The iris share is right, the denominator is wrong

10-20% is right **as a share of shots ending on an iris** (10/51 = 19.6%). It is wrong **as a share of cuts**: every one of those shots is followed by a hard cut. Say "10-20% of shots end on an iris; **0% of boundaries are irises**."

### 4.4 The transition object and duration are missing

The JSON `edit.transitions` is a map of six ratios. It has **no `seconds`, no `radius`, no `feather`, no `colour`, no `alpha`, no `in/out`**. The pack's `tokens.motion.transitions` is a list of **five names** (`cut, iris, wipe, hold, match_cut`) - **no `flash`**, no `melt` (tokens.json l.455-461). A score can declare `iris` and the renderer has nothing to draw. This is exactly the gap J §3 (l.497) named: "transitions are names, not durations."

**Fix:** `tokens.motion.transitions` becomes an array of objects `{ kind, secondsMin, secondsMax, params }`; add `flash` and `melt`; `score.shots[].out` becomes `{ kind, seconds, params }`; `style:check`/`preflight` refuses an unknown kind, a missing duration, a dissolve, or a boundary sum != 1.

---

## 5. Type

### 5.1 What is specific and good

Families, tracking .01 em, charRot ±.035 rad, charY ±.012 em, edge .055*size (min 2), shadow .035/.0385 at .26, boil 12 Hz, appear .55->1, single line/manual stack, the subtitle band (x84/y992, 62 high, words +64, gap 9, active acid lift -5, 3 px underline at .25, progress 2 px red), reading floor, no lyric wall. This is the most reproducible section of the spec - **if the numbers come from one film**.

### 5.2 They do not: 31 px and "2 systems" are from different films

- **31 px DM Mono, bottom-left, HUD 246x96, stickers, vertical, circular** -> A (`type.js`), the 1080p source. Six families in use (A l.391: DMMono 152, Archivo 49, Serif 31, Marker 8, Anton 5, Black Han Sans 2).
- **50 px Shantell Sans, centred, 2 systems, "nothing boxed except the subtitle", "nothing underlined"** -> C l.387-441, the 720p film.

The spec says "31 px" and "2 systems" in the same document. They cannot both describe the same film. "Two systems" is **PRODUCTION.md l.60's declared rule**, not a measurement: the code uses six families, and shot 5 `boss` carries two stickers + serif + subtitle. The "2 boxes" is C's **one** box or A's **4-5 objects**, and matches neither.

**P0-8 (exact fix):** choose one. If the canonical is A (1080p): 31 px, DM Mono, six families, stickers/HUD, keep the active-word underline; drop "2 systems" as a *measurement* (it may remain a channel rule). If the canonical is C (720p): 50 px, Shantell Sans, 2 systems, no HUD/sticker/vertical. Then write the missing band details (5.5).

### 5.3 "Enter on the word" is false for the band

A §8.6 l.499-501: the subtitle **fades in from `line.start - 0.12`** over 0.25 s; words highlight on their own times; the band is visible to `end + 0.35`. So the **line** enters early, the **word** highlights. The spec's "enter on the sung/spoken word, not the line start" is PRODUCTION.md l.58's **declared** rule, and the code does not do it for the subtitle band; it is right only for a display hook.

**Fix:** `subtitle.enter = line.start - 0.12`; `highlight = word.t`; `exit = line.end + 0.35`; add the fade duration.

### 5.4 Missing band details (needed to reproduce the look)

- **REC dot**: r 5 at `(x+8, y-13)`, red when a word is active, silver otherwise (A l.492).
- **Panel**: at `(x-18, y-44)`, size `(w+20) x h`, fill `rgba(ink,.92)`, tear 3.5, seed 31, shadow `+5/+8` at .28 (A l.488-491).
- **Label**: `LYRIC`, 11 px, `rgba(cream,.55)`, letter 1.5, at `(x+20, y-7)` (A l.493).
- **Override**: `gato` uses `subX 56, subY 1048` (A l.502) - a one-shot exception the checker must allow.
- **Max chars**: 54 (A l.548) is missing from the JSON.
- **Active word**: the first `w` with `t >= w.t` and `t < w.t + d`, with `d = max(.18, next - t)` (A l.544-550) - the .18 s floor is part of the karaoke feel.

### 5.5 Sizes and positions that contradict the source

- **`display 92-376`**: A's display range is **26-376**, with labels 26-76 and hooks 92-304 (A l.421, l.509); the spec's 92 floor sends "NO SURPRISE" (84), "STABLE" (62), and a small mono label like `SERVICE LEVEL: 0` to other roles. The role bands overlap (body 44-84, sticker 12-62, display 92-376), so a 62 px Anton string is both sticker and display. Fix: define by **role**, not by size, or give non-overlapping ranges with named exceptions.
- **`display position upper-left/right third`**: A l.590-592 gives hero baselines **236-930**, left 74-116, right 1712/1840; "you're my boss" is right-aligned at **y 930** (B l.509), i.e. **lower right**. Fix: "upper **or lower** third, opposite the subject; baseline 236-930; left 74-120 or right 1712/1840; never over face/hands/feet."
- **`8 words max`**: the source's max line is **9 words / 54 chars** (A l.547-548). The JSON has `maxWords 8` and `maxSubtitleWords 9`; a checker reading `maxWords` refuses the source's own line 9. Fix: `display.maxWords 8`, `subtitle.maxWords 9`, `subtitle.maxChars 54`.
- **`2 boxes`**: see 5.2. Fix: `maxTextBoxes 2` as a **channel rule** (basis: rule), and define what counts (a sticker is a box; the subtitle band is a box; the HUD is a third system, not a box).

### 5.6 Chrome and the "no gloss" ban

The reference's biggest type (`P(DOOM)` 248-380 px) is **chrome-red paper with a cream edge** (A §8.2: chrome fill is a 4-stop vertical gradient; B l.517). The spec bans gloss/3D/chrome material (X) but never says how to draw the hero type's chrome. A film cannot reproduce the poster without this.

**Fix:** declare "chrome = a 4-stop **paper** gradient + cream cut edge + hard shadow, **not** a specular gloss" as an allowed fill, or drop the chrome and accept that the look changes. This is a poster-look decision, not a detail.

### 5.7 Underline

The active-word rule (3 px acid at .25) and the hand-drawn red squiggle are **two different things**: the first is invariant karaoke; the second is a one-off annotation (STORYBOARD card 02, "nervous"). The spec's `type.underline` makes one F rule out of both. Fix: `subtitle.activeRule` I; `annotation.squiggle` F.

---

## 6. Sound and voice

### 6.1 The split is conceptually right

Song-led vs voice-led is the right two-mode model: the reference is a song film with **no foley** and **no added SFX** (C l.487-489; A "the typography is the SFX"); the product is a narrated short with code SFX, -14 LUFS, an 8 dB duck and declared silence. Keep the split.

### 6.2 The song numbers are the 720p comparison film's

- C: **46 lines, 227 words, 97.8 wpm over the voiced span, -15.6 LUFS, 6.0 LU, -3.7 dBTP** (C l.378-379, 464, 481-483).
- A (the 1080p source): **45 lines, 213 words**, sung span 1.50-140.68 -> **91.8 wpm**.

The spec adopts C's 46/227/97.8 and calls the film canonical. Fix: use A's **45/213/91.8** for the canonical 1080p film, or re-measure the canonical; keep C's values as `comparison-only`. The 90-100 wpm band survives both; the line/word counts do not.

### 6.3 The wpm comparison is apples to oranges

97.8 is over the **voiced span** (139.2 s); 180-190 is over the **film** (30 s). Over the film the song is **87.0 wpm** (C l.463); over the sounding time it is **113.6 wpm** (C l.465). A fair split: `wpm_film` **87 vs 180-190**, or `wpm_voiced` **113.6 vs ~240**. The 97.8-vs-180 comparison overstates the gap.

**Fix:** state the basis, and put `wpmBasis: "film" | "voiced" | "sounding"` in the schema.

### 6.4 The loudness targets conflict

Invariant 12: **-14 ±1 / <=-1.5 dBTP**. Song-led: **-15.6 / -3.7**. -15.6 is outside -14 ±1 by **0.6 dB**. A song-led film cannot pass both. Fix: one **delivery** target for both modes (-14 ±1 / <=-1.5); record -15.6/-3.7 as the **reference measurement**, not a target. If song-led must keep -15.6, branch the gate and say why the product ships quieter than its own invariant.

### 6.5 Duck and band

The spec says **duck 8 dB**; the pack's `tokens.sound.mix` says "music ducked about **4 dB**" (tokens.json l.475). One must change. J l.286/403 says 0.3-0.4 (about -8 to -10 dB) and duck in **1-4 kHz** without pumping. The spec omits the band.

**Fix:** duck **8 dB**, band **1-4 kHz**, attack/release (e.g. 10/120 ms), and change `tokens.sound.mix` to 8 dB; add a `duckBand` field.

### 6.6 Silence and the drop

The reference has **no silence** inside the song: RMS never below -30 dBFS before the final fade; the quietest 8 s is the **drop** under Gato (88.0-95.4, -24 -> -27 dBFS); the tail fades to **-59 dBFS** over 5 s (C l.507-526). The spec's "declared silence" is a voice-led rule; for song-led it is impossible, and the **drop** - the real identity device - is missing.

**Fix:** `song-led: no designed silence; one drop 6-9 LU below the chorus (the reference's -27 vs -18); tail to <=-60 over 0.5 s`; `voice-led: declared silence <=-50 dBFS with a reason`. That is a sound identity element the spec does not have.

### 6.7 Room tone

The pack says "the close may hold on room tone" (tokens l.473) but the identity has no room-tone level or rule. For voice-led, a room tone under the whole film is what makes a silence read as a room, not a gap.

**Fix:** `sound.roomTone { levelDb: -48..-42, continuous, ducked with the voice }`; a silence is legal only if the room tone is present (or explicitly "dead silence" with a reason).

### 6.8 Mode variation is unsatisfiable while music is parked

The variation table says "different mode if the last film was the other". Music is parked (§9 Q3), so only voice-led is possible; two consecutive films cannot differ on this axis. Fix: either unpark music (a licensed track, cleared) or drop "sound mode" from the required differences until it is possible. Do not ship a rule the pipeline cannot meet.

### 6.9 Cue binding is a slogan, not a contract

"word, contact, transition" - but the score's event object has no `with/contact/interaction` fields (the spec's §4.4 P1 additions), no `cueId`, no `duckDb`, no `band`, no `send`. The existing `src/engine/sfx.ts` has layers, send, duckDb and band.

**Fix:** `events[].cue { kind, layers[], band, sendDb, duckDb, at: { wordId | contactId | transitionId } }`; `npm run sfx` refuses a cue with no anchor or an anchor that is not in the same shot.

### 6.10 Width

C l.529: "centre-heavy; nothing sits hard in one channel". The studio's mixes are effectively mono (AGENTS: "a mono field" is open). The identity says nothing about width. Fix: `sound.width: mono-compatible, <=3 dB side/mid, no hard-panned cue`, or declare stereo as a product decision.

---

## 7. Score

| Axis | Score | Why |
|---|---|---|
| Camera model | **7/10** | 2D similarity is right; shares are from the wrong film, the world transform is missing, the seam is inverted |
| Edit | **6/10** | distribution well measured; per-format arithmetic wrong; transition taxonomy wrong |
| Motion | **4/10** | 1-3/hero/freeze good; squash/overshoot/anticipation contradict B/J; walk/gesture/crowd missing |
| Transitions | **3/10** | iris is an ending, not a cut; shares do not sum; no object/duration; flash missing from the pack |
| Type | **7/10** | most specific; mixes 1080p and 720p; enter rule wrong; band details missing |
| Sound | **5/10** | split right; numbers from the 720p film; targets conflict; drop/room tone/duck band missing |
| **Overall** | **5.0/10** | a good map of the channel's intention, not yet a specification of the film (holistic; the row mean is 5.3) |

---

## 8. P0 blockers - exact fixes

1. **One film.** Declare `out/claude-pop.mp4` as the only canonical artifact. Re-derive camera, edit, type and sound from it; tag every parameter `basis`; delete or mark every C-derived value (46/227/97.8/-15.6/crash 8.0/11-of-61) as comparison-only.
2. **Camera share and world.** Add `world {scale, rotate, translate}`; define `moving = camera OR world OR subject`; state the measured camera share (53%) and picture share (100%); stop citing A for 90%.
3. **Seam.** Replace "cut at rest 50-80%" with `cutAtRestShareMax 0.5` plus `cutOnMotionMin 0.4`; define speed/accel/turn units. The reference cuts **inside** motion (C l.365).
4. **Edit arithmetic.** Narrow the shot ranges or widen the cuts/min bands (table in 2.2), make `cutsPerMin` computed, and set the 156 s median to 2.8-3.1.
5. **Bimodal check.** Add the distribution test (>=30% 1.58-2.20, >=30% 3.0-5.0, <=15% 2.2-3.0) and a section map; fix "2-4 shots per line" to 1-2.
6. **Motion physics.** Delete squash .96-1.04 / overshoot 1.03-1.06 / anticipation 2-4 from the invariants; use either B's "pop, slam, snap" (no anticipation) or the pack's 0.12/0.18/backOut with 1-2 frame anticipation and 4-8 frame hair lag.
7. **Transitions.** Split boundary vs device (table in 4.2); make boundaries sum to 1; add `flash` and `melt` to the pack; give every transition `{kind, seconds, params}`; iris is 10-20% of **shots**, 0% of boundaries.
8. **Type and sound split.** Pick 31 px/DM Mono/6 families (A) or 50 px/Shantell/2 systems (C), not both; fix `enter = line.start - 0.12`; one delivery target for both sound modes; set the duck to 8 dB and the band to 1-4 kHz; add the drop and room tone.

---

## 9. P1 - should fix before the identity is used

1. Camera travel: add `reveal_pull .30-.72`; drop `pan` from the required vocabulary; cap image bands at 213 px / 25% or widen the search.
2. Camera frequency: `roll/warp` and `transition micro` are not in the vocabulary; recount from the code, not the cards.
3. Max run 2: mark as a channel rule; the reference has three consecutive pushes (`atoms`, `cage`, `chorus2`).
4. "5 static": delete; the only 5 is I's character-less shots.
5. Crash 8.0: mark comparison-only; canonical max 3.55.
6. Cut-on-word: song = line/phrase; narration = line start + 0-3 frame reaction; delete the "11/61" claim or mark it C.
7. 19-20 vs 20.3: say which shot count.
8. "2-4 shots per lyric line": use 1-2 per line, 2-4 per 2-line phrase.
9. Type: add REC dot, panel geometry, fade/window, `gato` override, 54 chars; fix display position to upper **or lower** third, baseline 236-930; split `maxWords` into display/subtitle.
10. Chrome: declare the 4-stop paper gradient fill or drop the chrome.
11. Underline: split karaoke active rule (I) from the hand-drawn squiggle (F).
12. Sound: use A's 45/213/91.8 or re-measure; state the wpm basis; one loudness target; duck band 1-4 kHz.
13. Sound: add the drop, room tone, cue fields (`kind/layers/band/send/duck/at`), and mono-compatibility.
14. Motion: add the walk cycle and gesture vocabulary; put reaction timing in the motion table; split crowd bed vs crowd action.
15. Schema: delete the duplicate `movement.*` / `motion.*` ids; add `events[].hero`; add a `basis` field to every parameter.

## 10. P2 - nice to have

1. Card median 2.86 -> 2.90; state the percentile method.
2. p90 4.60 -> 4.62.
3. `byBeat.release` conflicts with the pack (`pull_back` vs `orbit`); pick one.
4. Roll asymmetry (-4/+7.5) and the 4-8 deg gap; say impact-only above 4.
5. Shake 10-11 Hz is near Nyquist; add a lower-frequency drift variant if a handheld look is wanted.
6. `holdCreep` .02%/frame is 1.5% over a 2.5 s shot; that is a slow push, not a hold; say so or lower it.
7. `push_in` .03-.25 excludes `chase` (39%); add a `push_deep` or widen.
8. `whip` 300-900 is below the source's 1,700 px.
9. Type `monogram 72-160` and `sticker 12-62` overlap the display range; state the role rules.
10. `reading max(1.8, speech+0.6)` vs J's `0.5 + 0.3/word`; pick one and make `readcheck` the command.
11. `cueDensity 1.5 s` vs the Uber film's 1.7 s; fine, but say it is a floor not a target.
12. Foot/ankle: the spec says "support ankle locked" but does not say which foot is the support in a two-foot pose; add `supportFoot` to the pose event.

## 11. Sign

**SIGN: no.**

The spec is a strong first draft: the 2D similarity, the 2.9 s bimodal cut, the poster type and the song/voice split are the right bones. But it is not yet a specification of the film, because its numbers come from three different films, its transition taxonomy is a category error, its seam rule is inverted, and its motion physics are denied by the evidence it cites.

**One required fix:** **one canonical artifact, re-derived.** Declare `out/claude-pop.mp4`, rebuild the camera/edit/transition/sound tables from it, tag every value with its basis, and split boundary transitions from in-shot devices. When that is done, the remaining P0s in §8 are mechanical, and this can be re-reviewed in one pass.

---

*Files read: KPOP-IDENTITY.md, kpop-identity.proposed.json, A-engine.md, B-cast-sets.md, C-edit-camera-sound.md, I-frames.md, J-skills.md, STORYBOARD.md, PRODUCTION.md, tokens.json (paper-kpop). No other file was edited.*
