# Creative critique — Paper K-pop identity specification v1

**Critic:** creative director / designer
**Date:** 4 November 2026
**Subject:** `docs/research/identity/KPOP-IDENTITY.md` and `kpop-identity.proposed.json`
**Evidence used:** the spec, `A-engine.md`, `B-cast-sets.md`, `I-frames.md`, the six reference frames, the reference film, the Uber final sheet and collage.

**Verdict: NOT SIGNED — 6.5 / 10.**
Identity completeness **7/10**; channel fidelity **6/10**.

**One line:** this is a strong measurement of the reference film's *surface* and a weak account of its *attitude, performance and stage*. It fixes the reference's instances (the subtitle band, Sol's face and hair, a five-role cap) and leaves the channel's engine (tone, performance, set-object scale, motif meaning, three-film memory) loose. The result will be a clean, warm, full-bleed paper-pop channel that is *adjacent* to the reference — not the same channel — and it can still produce copy-paste films.

---

## 1. What the spec gets right (keep this)

1. **The Uber diagnosis is correct and evidence-based.** The bars (19% each side), the centroid at x .136, blue-on-blue in 83% of frames, local contrast 12.6 vs 46.6, and "the diagram is the subject, the performer is decoration" are the right failures to name.
2. **The two-reference split is the most important methodological fix in the document.** Surface = the six crops; grammar = the film. A new film must not be judged against a hero crop's mean luma.
3. **Full-bleed field, no bars, a different field colour per shot, and "the field is the world" are the right structural rules.** This is the rule that actually catches the Uber film.
4. **The cast construction is a real identity, not a template.** Brads, tapered two-bone limbs, the face vocabulary, 8 poses / 14 expressions, and the flat paper material are the channel's fingerprints.
5. **Cut on the word, 2.86–3.06 s median, 19–20 cuts/min, hard cuts, no dissolve** is the right edit grammar.
6. **The anti-default opener/closer stance is right.** The sunflower and desk pullback are instances, not the channel.
7. **The 10-question same-channel test is a good review instrument**, provided it is answered blind.
8. **"A worker with 8 poses and 14 expressions is still a worker"** is exactly the right instinct. The rest of the spec does not yet make it true.

---

## 2. Does the spec capture what makes the original look like itself?

### 2.1 The tone: it misses the sweet/sinister engine

The reference is not a sunny K-pop poster. It is **cute paper dolls inside a corporate/tech apocalypse**: `P(DOOM)`, `SERVANT`/`BOSS`, `EAT ME`, `LIES`, the cage, the maw, the eye, the monster, the mug tower, the desk diorama. The frames in `styles/paper-kpop/references/frames` are the *cute* half; the film's most memorable images are the *threat* half. `I-frames.md` measures **27.3% ink** and **20/54 ink fields**; the spec's one-line identity is "warm earth dominant, one accent, resolve". That is the wrong emotional range.

The Uber film is the proof. It has paper, torn labels, the type families, a full-bleed-ish field, and the right warm/blue/sat averages. It is still not the channel because it has no attitude: it is a business deck. The spec's worked example §6.2 is **another business deck** ("a business model as a paper diagram"). It has learned the Uber film's lesson about bars and placement, and not its lesson about tone.

**This is the largest creative gap.** A film that follows this spec will be pleasant, warm, well-composed, and forgettable. It will not have the `P(DOOM)` grin.

### 2.2 The cast: a face under a halo, not a flower head

Look at `chorus-stage.jpg`, `portrait-paper-cast.jpg`, `throne-orbit.jpg`. The idol has a **human-ish face plate**: skin, big eyes with pink eyeshadow and lashes, brows, a small nose, red lips, blush, black hair in a bob/long strands. The **petal halo is behind the head**, framing the face. It is not a flower where the face should be.

The spec says "flower/petal head" (§3.9, invariant #5) and then says "face plate" (§3.10). That is a contradiction, and the first phrase is the one a designer will draw from. A literal "flower head" produces a sunflower mascot, not the idol. The face is the focal point; the halo is the crown.

The silhouette is also much more extreme than the spec's numbers suggest. The petal ring is roughly **2–3.5× shoulder width** (Sol: petal diameter 292 at s=1, shoulder span ~90), a narrow torso, a flared pleated skirt, platform boots, and brads at the joints. The spec's `subjectWidth` 4–14.2% is a **body-only** measure; it excludes the halo. A machine bbox built from rig anchors (the spec's §8.2 proposal) will include the halo and fail its own width band. The bbox definition is missing.

The reference has **two rigs, not one**. Sol: face 41×47, eyes ±17.5, mouth y32, hand 9×13 + thumb, wrist brad 3.0, four long hair strands, gold-bar boot. Mira: face 36×42, eyes ±15, mouth y27, hand 7×10, no thumb, no wrist brad, bob hair, sneaker with a red stripe. The spec freezes Sol's face, hand, brads, hair and foot as invariants. A new co-lead like Mira fails. That is not channel identity; it is one character's construction.

The fixed `cast.skin #F0C9A4` and `cast.hair #171319` are worse: they make every film cast the same light-skinned, black-haired doll. That is a casting stereotype and a copy-paste engine. A K-pop channel must be able to cast a darker-skinned performer, a blonde, a blue-haired idol, a cat idol, a mascot.

### 2.3 The stage: giant objects and a nested diorama, not just a field

The spec's field rules are good, but a field is not yet a stage. The reference's sets have **one object out of scale with the figure**: a 600×640 throne, a gold filing wall, a mug tower, a giant head at 2.6–3.8×, a desk with a cutting mat, a stage with speaker stacks. The spec's "one graphic device" is too weak. A full-bleed colour with a small prop is a poster; a full-bleed colour with a giant object the figure stands in front of is the channel.

The reference also has a **nested diorama** conceit: the film is a paper world on a desk/laptop, revealed at the close. The spec treats the desk close as an instance and only bans "the same desk". It does not define the *grammar* (the world is a paper object on a larger surface). A new film can close on a different diorama — a stage in a box, a phone screen, a book — but the spec should say so.

`I-frames.md` is honest that the film's floor line is 77.8% and the cast's feet are at 93%. The spec then writes "feet on a 65–88% floor line" (invariant #6). That is three different concepts collapsed into one: horizon, ground plane, feet. A riser/treadmill/desk shot (feet 842–940) fails the "feet 1000–1012" band. A desk/void set (horizon 726 or none) fails the "780–900" band. This will stage the character too high in the frame and lose the "standing in front of the stage" look.

### 2.4 The text: a poster system, not a caption system

The reference's type is not just a bottom band. It is:

- **3-line poster stacks**: `I SEE / SPARKS / OF AGI`, `PLEASE DON'T / EAT ME / ALIVE`.
- **Giant words**: `FOOM` at 376 px, `ALIVE` at 336.
- **Repeated words as pattern**: `LIES ×12`, `FASTER ×3`.
- **Stickers that contradict the image**: `SERVANT` / `BOSS`, `NO SURPRISE`.
- **A diegetic instrument**: the `P(DOOM)` ticker and the meter.
- **Print bugs**: the barcode, the copyright, the timecode.

The spec fixes the **subtitle band geometry** at x84 / y992 / 31 px / `LYRIC` / acid active word / progress hairline as an invariant. That is a component of one song film, not the channel. Every film will have the same bottom-left ink band, and the channel will look like a template even if the story, set and cast change. The `type.maxLines: 2` would reject the reference's own 3-line stacks. The `lyric wall` ban (>8 words, >2 lines, >2 boxes) would reject `LIES ×12`, which is a graphic pattern, not a caption. The spec's text section is written for a subtitle, not for a poster.

The Uber film passes the spec's text rules: torn paper labels, 2 systems, <=8 words. It is still a deck, because the **type is the focal shape and the performer is decoration**. The spec has no `performer is the focal shape` rule.

### 2.5 The light: printed, not lit

The reference frames are flat graphic print. They do not read as a hard-key-lit diorama. `I-frames.md` §7: the cast-shadow shift search finds a median **−0.4 luma** and **0/44 high-confidence** shadows. The code's `+6/+10` at `.22` is a **registration shadow on paper cards**, not a cast shadow from a lamp. The spec calls it "hard top-left key" and makes it an invariant of the light. A renderer that follows that phrase will add a drop shadow to every card and turn the printed poster into a craft diorama.

The only volumetric cue in the reference is a **single far-side shade step of −14 to −18** on limbs/costume (the spec has this in §3.10, not in §3.4). That is the thing to keep. The "paper shadow" should be named as a print/registration device, optional, on cards/props/type, never a cast shadow on the field or the figure.

### 2.6 The motion: pop/slam/snap, not squash/fold

`B-cast-sets.md` §3.5 is explicit: the K-pop rig has **no squash parameter**. Every squash in the film is applied from outside the rig in one or two shots (the cube, the snap zoom). The paper cuts **pop, slam, snap, flutter, stack**; they do not fold, curl or tear in simulation. `A-engine.md` §12 confirms: no fold/curl/bend/collision, no spring, no IK, no pose interpolation.

The spec makes `squash 0.96–1.04`, `overshoot 1.03–1.06`, and **"one paper-physics event (fold, tear, curl, flutter, stack) per shot"** invariants. That is a new motion language imported from a different cartoon style. A tear in every shot will look like a craft video. The reference's material events are motivated and rare; the spec's are a checklist item.

The reference's body rhythm is **88 BPM**, with a flower pulse of ±4.5%, one beat-locked vertical, one slow secondary (hair/flower/skirt), one authored arm shape. The spec has the 12 Hz boil but **no BPM, no flower pulse, no beat-locked body**. A K-pop performer who is not on the beat is not a K-pop performer.

### 2.7 The opening: the dark cold open, and the diagram trap

The reference's first shot (`cold`, 1.5 s) is a **black void + a petal ring unfolding + a gold eye + a circular title**. `I-frames.md` shot 00: field .91, warm .06, blue .00, sat .02. The spec says the first frame must **never be black**. That rejects the reference's own cold open.

The spec's opening menu also includes **"world reveal"**, and its worked example §6.2 says the Uber film "opens on a network map" as if that were fine. A network map is a diagram, not a performer. That is the exact Uber failure, endorsed by the spec. The first frame must contain a **lit paper subject/motif event**, not a diagram, logo or landscape.

### 2.8 The motif: objects with meaning, not graphic devices

The reference's motifs are **semantic objects**: the paperclip (a bad idea that recurs), the meter (the stakes), the moon on a string, the `© PAPER SINGULARITY` bug, the gold halo, the sunflower/petal (the idol's identity). The spec's 13-item library is mostly **formal devices**: sunburst, paper sun, petal, halo, torn strip, tape, stamp, print marks, iris, confetti, speed lines, paperclip, meter. A film can choose "sunburst, tape, iris" and satisfy the letter while having no motif language. The spec's own worked example uses "route line, coin, paper phone, fare stamp" — none of which are in the library. That is a tell that the library is the wrong shape.

The `motif > 40%` cap is also unenforceable as written: the petal is the cast's head. The cast appears in 91% of shots (49/54). If the petal counts as a motif, the reference violates its own cap. The spec must separate **cast-integrated ornament** from **separate motif objects**.

A motif must also **change or pay off**. The spec requires repetition (2–5 uses), not transformation. Five appearances of the same coin in the same size is wallpaper. The reference's paperclip changes context; the meter rises; the moon is pulled on a string. Require a `motif.arc` (introduced, transformed, paid off).

### 2.9 The scale: the signature is a full-body paper doll, not a face close-up

The reference's hero images are full-body or three-quarter figures with the petal halo intact, standing on a stage. The six crops are 82–99% tall, but they are still *figures*, not just faces. The spec's framing table calls 55–80% "close/hero" and 80–92% "extreme close", which will produce face close-ups. A face close-up loses the silhouette that makes the character a paper doll.

The spec's own evidence disagrees with itself: `B-cast-sets.md` §4.2 says "the identity's 'wide' is not a distant wide. It is a full-body figure at 65–80% of frame height... Anything smaller stops being Paper K-pop." `I-frames.md` has 16/49 shots under 35%, including one at 13%. The truth is: **full-body hero is the signature, wide/insert is a punctuation, and 13% is a one-off world reveal, not a target.** The spec treats 13–35% as 25–40% of shots. That will produce small figures in big sets, which is the Uber film's composition with better paper.

---

## 3. Is the invariant/variable balance right?

**No.** The spec has ~200 machine parameters, most of them `I`, but the perceptual identity is carried by ~10 axes. The balance is wrong in both directions at once:

- **Too many source-instance invariants**: the subtitle band geometry, Sol's face/hand/hair/brads, the 51 scenes / 4,699 frames, the 31 px subtitle, the 5-role short cap, the 3–5 field colours, the exact stage floor geometry, the -14 LUFS voice master. A validator that reads the JSON will enforce the reference's *instance*, not the channel's *grammar*.
- **Too few channel invariants**: tone, performance, set-object scale, motif meaning/transformation, three-film memory, the performer-as-focal-shape rule, the "sweet/sinister" contrast, the blind same-channel test.

The result is the worst combination: films that are **same-y in the ways that don't matter** (subtitle band, Sol's face, one centered figure on a warm field) and **different in the ways that do** (story, set, motif), which is exactly how a channel turns into a template.

### 3.1 What will still cause copy-paste films

| What repeats | Why | Fix |
|---|---|---|
| The subtitle band (x84/y992/31 px/`LYRIC`/acid word/progress hairline) | Fixed as `I` | Move geometry/label/progress to `formats/song.json`; keep "one band, one line, enter on word, no face overlap" as `I` |
| Sol's face, hand, hair, brads, boot | Fixed as `I` | Ratio bands; 2–3 skin/hair values per film; major-joint brads only |
| One centered figure on a warm field | `one focal shape` + `97% negative space` + `subject centred` | 1 dominant + 0–2 supporting shapes; field must carry two graphic events; the figure is the highest-detail region, not the only shape |
| 3–5 field colours per film | `field script` 3–5 roles | 3–5 *roles* per film, **one field colour per shot** (8–10 in a 30 s), no repeat in consecutive shots |
| 3–5 motifs × 2–5 uses | Motif counts not format-scaled | 2–3 semantic motifs for 30 s; 3–4 for 45–60 s; 3–5 for 156 s |
| The same 4–6 camera moves from a 10-move menu | Fixed `distinctMoves` and shares | 3–6 moves for shorts; vary the opener/closer; no run >2; max one move >50% |
| 2–3 text behaviours from a 7-item menu | Behaviours not tied to layout | 3 layouts per film; no repeated layout from the last 3 films |
| The same corner marks, colour bars, timecode | Print furniture fixed | Keep the *grammar*; let the film choose the brand text/folio |
| The same warm earth + blue accent look | Palette 6 roles | 8 semantic roles with hue families; allow a poison accent and a dark/pastel act |
| The same negative-space/centered composition | `subject area 3%` + `one focal shape` | The Uber film passes `subject area` and `one focal shape`; these are not the identity |

### 3.2 What is so loose the channel disappears

- **The archetype is a label.** Kiran and Vaz have brads, 8 poses, 14 expressions and a declared `paper-pop-performer`. They are still office workers. The label does not prevent anything.
- **Tone is absent.** A warm, full-bleed, cute film with no threat, absurdity or contradiction is a different channel.
- **Motif meaning is declared but not checked.** A film can declare "the coin means money" and repeat it five times without a transformation.
- **Set-object scale is absent.** A field + a small prop passes "one graphic device"; it is a poster, not a stage.
- **The signature shot is undefined.** It is a `count: 1` with no `why`, no `differsFrom`, no check.
- **The same-channel test is not blind.** The director who wrote the film will pass their own 10 questions.
- **The variation is a review, not a report.** There is no `variation.json` with the previous values; no one can see what changed.
- **The opening allows a diagram.** "World reveal" + the Uber network-map example.
- **The performer is not required to be the focal shape.** The Uber's type is the focal shape; the spec's "one focal shape" allows it.
- **The 90% moving-camera rule is a channel rule, not the source.** The source uses the camera in 27/51 shots (53%). If the spec claims the source is 90%+, it is factually wrong; if it wants 90% for the channel, it should say so.

### 3.3 The scope model is the root cause

The spec has four scopes: `I` (invariant), `F` (film choice), `V` (variant), `X` (forbidden). It needs two more:

- **`R` — reference measurement.** A fact about the 156 s film, not a rule. Examples: 51 scenes, 54 cards, 4,699 frames, 54 field colours, 31 px subtitle, -15.6 LUFS, 27/51 camera use, 8 dominant colours, 296 off-palette literals, 5 iris, 38 flashes, 88 BPM.
- **`T` — format-owned.** A value that belongs in `formats/<id>.json`, not the style: canvas/aspect/fps, duration, shot count, subtitle band geometry/size, edit distribution, sound mode, cast count.

Without `R` and `T`, the machine file will enforce the reference's *instance* and the format's *convenience* as style. That is the single most structural reason the spec is not signable.

A clean model:

| Layer | Owns | Examples |
|---|---|---|
| Style (`I`) | the look and grammar | paper material, 2D similarity camera, palette hue families, full-bleed field/no bars, cast archetype/construction/performance, local contrast, cut-on-word, type material/systems, motif grammar, tone, print furniture |
| Format (`T`) | the deliverable | 16:9/9:16, 30/45/60 s, shot count, subtitle band geometry, type sizes, sound mode, cast count |
| Film (`F`) | the instance | story, set family, field colours, cast instance, motif objects, camera sequence, text behaviour, opening/closing, signature shot |
| Reference (`R`) | the measurement | 51 scenes, 4,699 frames, 54 fields, 31 px, -15.6 LUFS, 27/51 camera |

This is the answer to "is the balance right": the spec has the right axes, in the wrong layer.

---

## 4. Does "paper-pop performer" prevent office workers?

**Not yet.** The current definition is a **construction spec plus a label**:

- flower/petal head, 3-layer hair, bradded 2-bone limbs, 8 poses, 14 expressions, 580–760 units, 7.0–7.5 heads.
- "A worker with 8 poses and 14 expressions is still a worker; it fails the archetype, not the construction."

That sentence is true, but the spec never says how to tell. The Uber pair passes every construction test. The only test is a human saying "that's an office worker." A designer can draw a person in a tie with a petal crown, declare `paper-pop-performer`, and pass.

### 4.1 The six-point performer test

A new character is a **paper-pop performer** if it passes at least 5 of 6:

1. **Silhouette.** A head ornament (petal/halo/crown/ears/hood) spans **2.0–3.5× shoulder width** and sits **behind** the face; the lower body flares (pleated skirt, wide trouser, boot) and the feet have a **platform sole**. At 320×180 the silhouette reads as a doll, not a person in a suit.
2. **Face.** A visible face plate with **performance makeup** (at least two of lash, eyeshadow, lip, blush) and a **gaze** at the audience or a target. Not a blank dot face, not a photo face.
3. **Costume.** 3–5 palette roles, at least one **metal/gold** accent, at least one **stage signal** (collar, cuff, pleat, stripe, badge, sash). A suit is allowed if it has the signals; a lanyard/briefcase as the lead's primary prop is not.
4. **Pose.** At least **4 performance poses** from mic, point, heart, bow, wave, danceHit, present. The default pose is not a neutral A-pose.
5. **Action.** At least **one performance action per performer shot** (sing, dance, pose, present, bow). Walking, standing and pointing at a chart are not performance.
6. **Context.** The performer is in a **stage or a metaphor of a stage** (spotlight, crowd, backstage, arena, desk-as-stage). The first three shots show performance, not commuting or working.

A character that scores 3/6 is a worker; 4–5 is a weak performer; 6 is a performer. This is specific enough to design a cat idol, a flower dancer, an MC or a mascot, and broad enough not to fix the cast.

### 4.2 What to change in the spec

- **§3.9 head:** "human-like face plate + hair + petal/halo **behind** the head; the face is never replaced by a flower."
- **§3.9 ornament:** `cast.ornamentSpan` 2.0–3.5× shoulder width; `cast.ornamentDepth: behind-face`.
- **§3.9 face/hand:** ratio bands, not Sol's pixels. Face width 0.48–0.62 of head width; eyes ±0.40–0.46; mouth 0.62–0.72 of head height; hand 0.22–0.32 of head width. Sol and Mira are two points in the band.
- **§3.9 brads:** shoulder/elbow/hip/knee/head-pivot required; wrist optional. The JSON `cast.joints` currently omits **kneeL/kneeR**, so a rig built from it cannot bend a leg.
- **§3.9 hair:** 1–3 layers; long strands, bob, hood or ears; the 4-strand bob is Sol's, not the channel's.
- **§3.9 foot:** platform sole + one metal accent (gold bar, red stripe or buckle), not a gold bar only.
- **§3.10 skin/hair:** 2–3 values per film, not fixed hex. Keep flat fill + ink edge.
- **§3.9 performance:** `cast.performanceRole` (idol/dancer/singer/MC/mascot-performer), `cast.performancePoses` (>=4), `cast.performanceAction` (>=1 per performer shot), `cast.makeup` (>=2), `cast.gaze`.
- **Forbidden:** replace the binary `office-worker-lead` with **`office-worker-context`**: a neutral A-pose at a desk, a lanyard/laptop as the lead's primary prop, or the first three shots as commuting/working. A corporate *concept* is allowed — the reference is a corporate satire — but the performer must perform.

---

## 5. Are the bands artistically right?

Some are. Many are **overfit to one 156 s film** and **not scaled to a 30 s, 8–12 shot short**. Several pass the Uber film or reject the reference. The central problem is that almost no band declares its **aggregation** (per frame, per shot share, film median, film mean, p90). A checker author will choose arbitrarily.

### 5.1 The band audit

| Band (spec) | Reference / evidence | Verdict | Fix |
|---|---|---|---|
| `subjectHeight` .13–.92; p50 .552 | .13–.919, p50 55.2, p90 76.0 | p50 exact; upper bound rejects a 96% poster close-up | p50 `F` .40–.70; max .98; keep 13 lower |
| `subjectWidth` .04–.142 | .04–.142 body-only; halo is 2–3.5× shoulder | Excludes the halo; bbox undefined | Body box .04–.16; add `ornamentSpan` 2.0–3.5× shoulder |
| `subjectArea` .01–.04 | p50 .03, p90 .07, max .089; crops ~20% | Rejects the reference's close-ups; **the Uber passes** | Drop as identity; use local contrast + edge ratio + no-bar |
| `centroidX` .30–.75 | p10 .33, p90 .69, min .13, max .88 | Rejects the edge portraits (13, 36, 45) | Core .30–.75 in >=75%; allow .14–.88; max 1 edge portrait/film, declared, empty opposite field |
| `centroidY` .38–.66 | p10 .38, p90 .66, max .83 | Okay; top-down/desk is the max | Keep; allow 1 declared top-down |
| `floor/horizon` .65–.88 | p25 .64, p50 .78, p75 .83, min .378 | Conflates horizon/ground/feet; desk/top-down fail | Horizon .72–.83 stage, .62–.78 desk, none void; ground .90–.94 stage, .78–.88 riser |
| `sets.feetY` 1000–1012 | stage 1002–1012, riser 862–940 | Rejects risers, treadmill, desk | `feetY` per set: stage .93, riser .78–.88, close "clipped" |
| `warmShare` .40–.90 | p25 .24, p50 .70, p75 .89 | Per-frame rejects 25% of the film | Film median .40–.90; p25 >= .20 |
| `blueShare` <=.20, median <=.05 | p50 .01, p90 .17, max .46; Uber .179 | Per-frame rejects the arena (46%); **the Uber passes .20** | Median <= .05; p90 <= .20; one shot <= .46 declared "blue field, figure red/cream" |
| `saturatedShare` .35–.70 | p25 .17, p50 .50, p75 .69, p90 .89 | Per-frame rejects 25%; a pastel concept fails | Film median .35–.70; no per-shot gate |
| Roles 4–7; short <=5 | p50 5, p90 7, max 8; the cast alone is 7 | Short cap rejects the reference's own cast; max 7 rejects 1 shot | Short 7, long 8; count semantic roles, not k-means clusters |
| `largestFlat` .04–.46 | p10 .044, p50 .14, p90 .46, max .76 | Rejects the poster shot at .76 | Median .04–.46; max .80 with the no-bar rule |
| `fieldShare` .18–.60 | p25 .19, p50 .27, p75 .41, p90 .57, max .78 | Rejects the void/poster | Median .18–.60; max .85 for a declared void |
| `localContrast` >=20 in 75%; median >=35 | p25 27.6, p50 46.6, p10 18.0 | Okay, but a dark act can fail; luma alone can be gamed by a silhouette | Keep; allow 2 declared low-contrast shots; add `edgeRatio` >=2.5 (figure/field) |
| `textArea` .02–.06 | small text p50 3.1, p90 5.0; display 376 px | Rejects display type; does not measure it | `smallTextArea` .02–.06; `displayArea` .02–.25 |
| `bottomBand` <=.06 p90 | p90 .07 | Rejects the reference's p90 | <= .08 |
| `camera.movingShare` .90–1.0 | 27/51 = 53% setCam | **Factually wrong about the source**; a channel rule presented as a measurement | Rename `camera.channelMovingShare`; source: "anti-slideshow rule, not the film"; keep 90% as a channel rule, state the source's 53% |
| `pushPull` .35–.45; lateral .15–.25; orbit .10–.20; tilt .05–.15; crash .05–.15 | 21/53, 9/53, 7/53, 4/53, 4/53 | Mathematically impossible for 8–12 shots | `F` for 8–12 shots: moving >=.90, 3–6 moves, run <=2, max move share <=.50; use the shares only for >=20 shots |
| `edit.median` 2.4–3.2 | 2.86–3.06 | Right; scale by format | Keep; 30 s: 8–12 shots, median 2.4–3.2 |
| `edit.distribution` 5 bins | 54 cards | Fractional counts for 10 shots; impossible | Only for >=20 shots; shorts: median, min/max, cuts/min, "one <2 s, one >4 s" |
| `edit.hardCut` .80–.90 | 50/53 = 94% | Rejects the reference | .80–.95 |
| `motifs.perFilm` 3–5; uses 2–5 | 5 motifs in 156 s | Motif salad in 10 shots | 2–3 for 30 s; 3–4 for 45–60 s; 3–5 for 156 s; uses 2–4 |
| Field 3–5 colours/film | 54 distinct in 54 shots | Too coarse; the Uber's one plate can pass | 3–5 *roles*/film; **one field colour per shot** (8–10 in 30 s); no repeat in consecutive shots; >=2 per act |
| Luma mean 75–130 | 100.9; crops 143.6; desk 193.3 | Rejects high-key/crop-like films | 75–150; p95 150–220; use a format-matched reference |
| Contrast p5 175–210 | 190 | High-key 220 fails | 160–230 |
| `paperArea` >=60% | 27% ink, 20/54 ink fields | Rejects the dark acts | Measure paper texture/edge, not colour share |
| `halftone` 5–40% | local (sun, field) | Rejects close-ups | `F`/local; no global share |
| `edge` 1.5–6 px | p10 5.6, median 12, p90 40 | Median 12 fails | Use p10 3–6; report median separately |
| `type.subtitle` 31 px | 31 px in 16:9 | 9:16 re-stage needs a different band | Move to `formats/`; 16:9 31 px, 9:16 34–38 px at 1080×1920 |
| `palette.distance` <=55 | 48.3 | A global metric, not perceptual | Keep as a warning, not a gate |

### 5.2 The bands that accept a bad film

- **`subjectArea` 1–4%** accepts the Uber (its figure is narrow and ~3–4% area). It is also the metric the spec calls "97% negative space". The Uber has negative space. This band is not the identity.
- **`one focal shape`** accepts the Uber: the diagram is one focal shape. The rule must be "the *performer* is the focal shape in >=60% of shots", not "one shape".
- **`warm/blue/saturated`** all accept the Uber (.783 / .179 / .477). The palette averages are not enough; the arrangement (bar/plate/contrast) is the identity.
- **`paper material` / torn labels** accept the Uber. The Uber's labels are paper; the film is still a deck.
- **`text 2 systems / 8 words`** accept the Uber. Its type is torn paper and short. The failure is hierarchy, not material.
- **`cast construction`** accepts the Uber. The construction is right; the performance is wrong.

### 5.3 The bands that reject a good film

- **`subjectArea` 1–4%** rejects the reference's close-ups and the six crops.
- **`subjectWidth` 4–14.2%** rejects a character with the petal halo in the bbox.
- **`feetY` 1000–1012** rejects the treadmill, throne, desk, museum, and any riser.
- **`horizonY` 780–900** rejects the desk (726), museum (842 is inside but the desk is not), and the chasm (704).
- **`blue <=20%` per frame** rejects the arena (46%).
- **`warm 40–90%` per frame** rejects the p25 24% dark/blue shots.
- **`saturated 35–70%` per frame** rejects the p25 17% ink acts and a pastel concept.
- **`max 5 roles` short** rejects the reference's 7-colour cast.
- **`textArea 2–6%`** rejects a 376 px poster hook.
- **`hardCut 80–90%`** rejects the reference's 94%.
- **`camera shares`** reject a good 10-shot film with 3 pushes (30%).
- **`edit distribution`** rejects any 10-shot film because the bins are fractional.
- **`motifs 3–5`** crowds a 10-shot film.
- **`field 3–5 colours`** flattens the 54-field reference.
- **`luma 75–130`** rejects the high-key crops and a bright poster film.
- **`paperArea >=60%`** rejects the ink acts.
- **`edge 1.5–6 px`** rejects the reference's median 12 (though the spec intends p10).
- **`cast.skin/hair` fixed** rejects any other performer.
- **`cast.face/hand/brads/hair/foot` Sol's** rejects Mira, who is in the reference.
- **`opening never black`** rejects the reference's cold open.

---

## 6. Blocking issues (P0)

### P0-1 — The scope model is wrong: source and format values are enforced as style

**Why it blocks.** The JSON marks `edit.scenes: 51`, `edit.visibleCards: 54`, `envelope.frame: 4699`, `type.subtitle: 31`, `sound.song: -15.6 LUFS`, `palette.maxRoles: 7`, `camera.movingShare: .90` and `composition.subjectArea: .01–.04` as `I`. A validator reading this will require every new film to have 51 scenes, 4,699 frames, a 31 px subtitle, a -15.6 LUFS song, and a 3% subject area. That is not a channel identity; it is the reference film's birth certificate.

**Exact fix.**
- `scopeLegend`: add `R` = reference measurement, not enforced; `T` = format-owned, declared in `formats/<id>.json`.
- Re-scope to `T`: `envelope.canvas`, `envelope.aspect`, `envelope.fps`, `envelope.durationFormats`, `edit.median`, `edit.cutsPerMinute`, `edit.distribution`, `type.subtitle`, `type.subtitleBox`, `sound.voice`, `voice.narratedWpm`, `cast.totalMax`, `palette.maxRolesShort`, `motifs.perFilm`, `camera.pushPullShare`/`lateral`/`orbit`/`tilt`/`crash` (for shorts), `sets.feetY`, `sets.horizonY`.
- Re-scope to `R`: `edit.scenes` 51, `edit.visibleCards` 54, `envelope.frame` 4,699, `palette.referenceDominant` (the 8 colours), the 54 field colours, `type.subtitle` 31 as a *source* value, `sound.song` -15.6, `camera.movingShare` 27/51, the 296 off-palette literals, 5 iris, 38 flashes, 88 BPM.
- Keep as `I`: medium, dimension, palette hue families, field/no-bar, cast archetype/construction/performance, local contrast + edge ratio, camera model/vocabulary, cut-on-word, type material/systems, motif grammar, tone, print furniture.
- Add a sentence to §4.2: "The style owns the grammar; the format owns the envelope; the film owns the instance; the reference owns the measurement. A field in the wrong layer is a contract error."

**Sections:** §1.1, §3.1, §3.15, §3.19, §3.21, §3.22, §4.1, JSON `scopeLegend`.

---

### P0-2 — The identity has no tone, so it will produce a warm business explainer

**Why it blocks.** The reference's most memorable images are the maw, the cage, the eye, the `P(DOOM)` meter, the `SERVANT`/`BOSS` stickers, the mug tower, the monster. The spec describes the cute surface and the warm palette, and its worked example is a business model diagram. The Uber film is the proof: paper + type + palette + full-bleed, no attitude. A channel that cannot be sinister, absurd or satirical is not this channel.

**Exact fix.** Add a `tone` block to `tokens.identity` and a §3.3a:
- `tone.mode: "pop-satire"` (`I`).
- `tone.contrast`: every film has at least one **sweet** beat and one **sinister/absurd** beat; `tone.darkAct >= 1` act with field roles ink/oxblood/teal.
- `tone.poisonAccent`: one acid/pink/red accent used as a **threat**, not decoration; at least one shot where the accent is the dangerous thing.
- `tone.misbehavingProp`: one prop that does the wrong thing (the mug tower, the mask, the meter, the phone).
- `tone.contradictionSticker`: one text/image contradiction per film (`SERVANT`/`BOSS`).
- `tone.cuteInDanger`: one shot where the performer is contained/threatened (cage, maw, giant hand, spotlight, crowd).
- `tone.turn`: the opening or closing has a cute/ominous turn.
- `sound.default: "song-led"`; a voice-led film is a Paper Studio explainer, not Paper K-pop, unless it declares `variant: "narrated-pop"` and has a song-led chorus.
- The worked example §6.2 must be rewritten or removed: a "business model as a paper diagram" is the Uber film, not the channel.

**Sections:** §0, §3.3, §3.8, §3.21, §6.2; JSON `tone.*`, `sound.default`.

---

### P0-3 — "Paper-pop performer" is a construction spec, not a performer; and "flower head" is a misread

**Why it blocks.** The reference frames show a **human-ish face with black hair and a petal halo behind it**, not a flower for a head. The spec's "flower/petal head" will design a mascot. The archetype is a label: Kiran and Vaz pass every construction test. The fixed skin/hair is one doll in every film. The face/hand/brads/hair/foot are Sol's, and Mira — who is in the reference — fails them.

**Exact fix.** Rewrite §3.9/§3.10:
- `cast.head`: "human-like face plate + hair + petal/halo **behind** the head; the face is never replaced by a flower."
- `cast.ornamentSpan`: 2.0–3.5× shoulder width (`I`); `cast.ornamentDepth: "behind-face"` (`I`).
- `cast.face`: ratio bands, not pixels. Face width 0.48–0.62 of head width; eyes ±0.40–0.46; mouth 0.62–0.72 of head height. Sol and Mira are two points.
- `cast.hand`: 0.22–0.32 of head width; thumb optional per rig.
- `cast.brads`: shoulder/elbow/hip/knee/head-pivot required; wrist optional. Add `kneeL`/`kneeR` to `cast.joints` (the current list omits knees).
- `cast.hair`: 1–3 layers; long strands, bob, hood or ears; not 4 strands only.
- `cast.foot`: platform sole + one metal accent (gold bar, red stripe or buckle), not a gold bar only.
- `cast.skin`/`cast.hair`: 2–3 values per film, not fixed hex; keep flat fill + ink edge.
- `cast.performanceRole`: idol/dancer/singer/MC/mascot-performer (`I`).
- `cast.performancePoses`: >=4 from mic, point, heart, bow, wave, danceHit, present (`I`).
- `cast.performanceAction`: >=1 per performer shot (`I`).
- `cast.makeup`: >=2 of lash, eyeshadow, lip, blush (`I`).
- `cast.gaze`: audience/target, not down at a desk (`I`).
- `forbidden`: replace `office-worker-lead` with `office-worker-context` (neutral A-pose at a desk; lanyard/laptop as the lead's primary prop; the first 3 shots as commuting/working). A suit is allowed if the six-point test passes.

**Sections:** §3.9, §3.10, §3.25 #8, JSON `cast.*`.

---

### P0-4 — The bands are overfit to the 156 s film and mathematically under-scaled to 30 s

**Why it blocks.** The table in §5.1 is not a list of stylistic preferences; it is a set of rules that would reject the reference and/or accept the Uber. The most serious:
- `subjectArea` 1–4% rejects the reference's close-ups (p90 7, max 8.9, crops ~20) and **accepts the Uber** (~3–4%). It is the wrong metric.
- `feetY` 1000–1012 and `floor` 65–88% conflate horizon/ground/feet; risers, desk and treadmill fail.
- `blue <=20%` per frame rejects the arena (46%); the Uber (.179) passes.
- `warm 40–90%` / `saturated 35–70%` per frame reject 25% of the reference.
- `max 5 roles` short rejects the reference's 7-colour cast.
- `textArea 2–6%` rejects a 376 px poster hook.
- `hardCut 80–90%` rejects the reference's 94%.
- The camera shares, edit distribution, motif counts and 3–5 field colours do not scale to 8–12 shots.

**Exact fix.** Add `aggregation` to every band (`film-median`, `per-shot-share`, `film-mean`, `p90`), and:
- `composition.subjectArea`: **remove from identity**; use `contrast.local` + `contrast.edgeRatio` + `field.noBar`.
- `composition.subjectBox`: body + costume, **excluding** the head ornament; add `composition.ornamentSpan`.
- `composition.horizonY`: stage .72–.83, desk .62–.78, void `none`; `composition.groundY`: stage .90–.94, riser .78–.88; `composition.feetY` = ground; never call the horizon "floor".
- `palette.warmShare`: film median .40–.90, p25 >=.20; `palette.blueShare`: median <=.05, p90 <=.20, one shot <=.46 declared; `palette.saturatedShare`: film median .35–.70.
- `palette.maxRolesShort`: 7; `palette.maxRoles`: 8.
- `composition.smallTextArea`: .02–.06; `composition.displayArea`: .02–.25; `text.bottomBandP90`: <=.08.
- `edit.hardCut`: .80–.95; `edit.distribution`: only for >=20 shots; for 8–12 use `median`, `min/max`, `cuts/min`, "one <2 s, one >4 s".
- `camera`: for 8–12 shots, `movingShare >=.90`, `distinctMoves 3–6`, `maxRun <=2`, `maxMoveShare <=.50`; use the reference shares only for >=20 shots.
- `motifs.perFilm`: 2–3 for 30 s, 3–4 for 45–60 s, 3–5 for 156 s; `uses` 2–4.
- `field`: `field.roles` 3–5/film; `field.colours` >=1 per shot (8–10 in 30 s), no repeat in consecutive shots, >=2 per act; `field.share` film median .18–.60.

**Sections:** §3.3, §3.6, §3.7, §3.8, §3.13, §3.14, §3.15, §3.19; JSON `composition.*`, `palette.*`, `edit.*`, `camera.*`, `motifs.*`, `field.*`.

---

### P0-5 — The light and motion are mis-specified; they make a diorama, not a printed poster

**Why it blocks.** The reference is flat graphic print. The `+6/+10 .22` is a registration shadow on cards, not a cast shadow; `I-frames.md` finds 0/44 high-confidence shadows. The spec's "hard top-left key" will add drop shadows to every card. The reference rig has **no squash** and no fold/tear/curl simulation; the spec's `squash 0.96–1.04`, `overshoot`, and one fold/tear per shot are a new motion language that will look like a craft video, not Paper K-pop.

**Exact fix.**
- `light.key`: `"flat-graphic"` (not `"top-left"`). `light.model`: "no directional key; flat fills + one far-side shade step −14..−18 on limbs/costume."
- Rename `light.shadowOffset/Alpha/Blur` to `medium.paperShadow`: optional, hard, +6/+10 .22 blur 0, on cards/props/type only; **never** a cast shadow on the field or the figure.
- Keep `light.contactShadow` as a ground contact, not a cast shadow.
- `motion.paperPhysics`: one material event **per act**, not per shot, from `pop`, `slam`, `snap`, `flutter`, `stack`; `fold/tear/curl` only when the story needs a tear (max 1 per film).
- `movement.squash`: `F` 0.98–1.02 on impact only; `movement.overshoot`: 1.02–1.04; `movement.pops`: required.
- `movement.bpm`: 88 (or the song's BPM); `movement.pulse`: one beat-locked vertical + one slow secondary (hair/flower/skirt) + one authored arm shape; `movement.flowerPulse`: .045.

**Sections:** §3.2, §3.4, §3.11, §3.16; JSON `light.*`, `motion.*`, `movement.*`.

---

### P0-6 — The fixed subtitle band and the "never black" opening repeat the reference's instance and reject its grammar

**Why it blocks.** The subtitle band (x84/y992/31 px/`LYRIC`/acid word/progress hairline) is a **component of one song film**. Fixed as `I`, every film will have it. The reference's cold open is a **black void**; the spec says "never black". The spec's opening menu includes "world reveal", and its worked example praises a **network map** opening — the exact Uber failure. The reference's 3-line stacks (`I SEE / SPARKS / OF AGI`) and `LIES ×12` pattern are rejected by `maxLines: 2` and the lyric-wall ban.

**Exact fix.**
- Move `type.subtitleBox`, `type.subtitle` 31, the `LYRIC` label, the active-word acid, and the progress hairline to `formats/song.json` as a **lyric-band preset**. Keep as `I`: one subtitle band, one line, enter on the word, 8–9 words, no face/hands/feet overlap, paper layer.
- Add `text.mode`: `lyric-band` | `poster` | `diegetic`; 2–3 behaviours; **3 layouts per film**; no repeated layout from the last 3 films.
- `opening.firstFrame`: "a lit paper subject/motif event within the first 12 frames; a dark field is allowed; no title/logo-only frame; the frame must read at 320×180." Remove "never black".
- `opening.types`: remove `world-reveal`, or require a performer/motif in the first frame; **ban a diagram/UI/network map as the first frame**.
- `type.maxLines`: split `maxDisplayLines: 4`, `maxBodyLines: 2`, `maxSubtitleLines: 1`.
- `type.displayPattern`: allow repeated words as a graphic field (`LIES ×12`) with `maxCoverage: .12`, `noReading: true`; exempt from the lyric-wall rule.
- `type.subjectPriority`: the performer is the focal shape in **>=60%** of shots; type never exceeds the performer's contrast/area in a performer shot.

**Sections:** §3.19, §3.23, §3.24; JSON `type.*`, `opening.*`.

---

### P0-7 — The anti-copy grammar remembers one film and fixes the wrong things

**Why it blocks.** The variation table compares only to the **previous film**. A 10-film channel can alternate A/B forever. The "eight differences" omit **opening, closing and transitions**; the 3.24 table has 10 rows, the JSON has 8. The signature shot is a `count: 1` with no `why` and no `differsFrom`. The exact subtitle band and Sol's face/hair are fixed, so the films will be same-y even when the story, set and motifs change.

**Exact fix.**
- `variation.history`: 3 films. Compare opener, closer, set family, field script, motif set, camera opening/closing, text layout and signature shot against the **last 3**.
- `variation.requiredDifferences`: add `opening`, `closing`, `transition-set` (11 axes).
- `variation.report`: a `variation.json` per film with the 11 axes, the previous 3 values, and a director signature; `film:review` refuses a missing or identical axis.
- `variation.signatureShot`: require a `why` and `differsFrom` the last 3.
- Remove the fixed subtitle band and Sol's face/hair from identity (P0-3/P0-6) so the *grammar* repeats and the *instance* changes.
- Add a **blind same-channel test**: 3 frames from the new film + 3 from the reference, shown to someone who has not seen the brief; if they can tell which is which, the film is a copy or a different style. This is not a machine check; it is the sign-off.

**Sections:** §3.24, §6.3; JSON `variation.*`.

---

### P0-8 — The motif language is formal devices, not meaning; the cast-integrated petal breaks its own cap

**Why it blocks.** The 13-item library is mostly graphic furniture. The reference's motifs are semantic objects: paperclip, meter, moon, bug, halo, petal. The worked example uses route/coin/phone/stamp, none of which are in the library. The petal appears in 91% of shots because it is the cast's head, so the 40% cap would fail the reference itself. Repetition is required; **transformation** is not, so a motif can repeat five times and mean nothing.

**Exact fix.**
- Split `motifs.devices` (sunburst, tape, iris, torn strip, confetti, speed lines, print marks) from `motifs.objects` (paperclip, meter, coin, thread, door, mirror, cage, eye, clock, vessel, mask, hand).
- `motifs.perFilm`: 2–3 semantic objects + 1–2 devices; at least 2 objects with a declared meaning and an **arc** (introduced, transformed, paid off); no all-device set.
- `motifs.castIntegrated`: petal/halo are cast construction, exempt from the 40% cap; `maxShotShare` applies to separate motifs only.
- `motifs.defaultOpener`: keep the ban; the cast's petal is not an opener motif.
- Add `motifs.scale`: a motif may be giant (meter 420 px, mug tower) or tiny (paperclip); declare which, and use it at that scale.

**Sections:** §3.13, §6.1; JSON `motifs.*`.

---

## 7. P1 — important, fix in the same pass

1. **2.5D is a read, not a model.** The source is a 2D canvas with a 2D similarity camera; it has no layer list and no per-layer parallax (`A-engine.md` §1, §5). The "5 planes" and "2.5D layered" labels will make a renderer add a scene graph and parallax the source does not have. Say "2D layered paper collage with an orthographic similarity camera; 2.5D is the depth read from overlap/scale."
2. **"One focal shape" + "subject centred" + "97% negative space" is the Uber recipe.** The Uber passes all three. Replace with "1 dominant + 0–2 supporting shapes; the field carries at least two graphic events (device, texture, set object); the performer is the highest-detail region in >=60% of shots." Add `cast.presence >= .85`.
3. **The edge portraits are part of the language.** Shot 13 x .88, shot 36 x .14, shot 45 x .13 are deliberate. `centroidX .30–.75` rejects them. Add `centroidXCore .30–.75` in >=75%, allow .14–.88, max 1 declared edge portrait per film with an empty opposite field.
4. **`subjectHeightP50 .552` is overfit.** Make it `F` .40–.70. The `heightSd >=15` is a weak statistic: one 13% and one 92% shot can satisfy it while nine shots sit at 57%. Add a tier histogram and `maxShareAtMedian <= .40`.
5. **`camera.movingShare .90–1.0` misstates the source.** The source sets a camera in 27/51 shots (53%). Rename it `camera.channelMovingShare` and source it to the anti-slideshow rule, not the film. Keep 90% as a channel rule.
6. **`hardCut .80–.90` rejects the reference's 94%.** Make it .80–.95. `flash 0–10%` is also low: the reference has 38 flash calls, many as hits rather than transitions; clarify hits vs transitions.
7. **The 9:16 format has no bands.** The 16:9 centroid/height/subtitle y992/31 px are format values. Put them in `formats/`; measure 9:16 separately. A 9:16 film with y992 in a 1920-high frame puts the subtitle in the middle.
8. **The sound default is wrong for a K-pop channel.** The reference is song-led at -15.6 LUFS, -3.7 dBTP, 97.8 wpm. The spec's -14 LUFS / 180–190 wpm is the Paper Studio explainer. Make song-led the default; voice-led requires `variant: "narrated-pop"` and a music bed.
9. **The JSON is not "the same values" as the prose.** It omits `cast.face`, `cast.torso`, `cast.foot`, `cast.makeup`, `cast.performanceRole`, `tone`, `text.mode`, `variation.history`; it includes `cast.joints` with 13 items while the prose says 11. Add the missing fields or remove the claim on line 7.
10. **The stage floor is not every set.** `sets.floor` (17 radial, 5 horizontals, torn lip 22) is the `stageSet` geometry. A desk/room/void set should not be forced to draw it. Make it the `stage` family's value; give each family a floor grammar.
11. **The paper medium is "printed poster", not "torn collage".** The reference's character and field have clean edges; the torn edges are on cards/stickers/transitions. The spec's "every mark is a cut, a tear..." will push a craft-collage look. Say "flat fills, clean cut edges, subtle fibre/halftone; torn edges only on cards/stickers/transitions; no collage seams on the cast or field."
12. **`paperArea >=60%` and `halftone 5–40%` are wrong for dark/close shots.** Measure paper *texture/edge*, not colour share; make halftone local/`F`.
13. **`edge 1.5–6 px`** is a p10 band, not a median; the reference's median is 12. Use p10 3–6 and report the median separately.
14. **`type.maxLines: 2`** rejects the reference's 3-line stacks. Split display/body; display 4.
15. **`textArea`** is small text, not all text. Split small/display.
16. **`envelope.background #F2E8D5`** can license a cream plate. Add `envelope.canvasFill: "field colour, not paper"`; the paper base is only the substrate at torn edges/margins.
17. **`figureBlueMax .30`** rejects a blue costume on a warm field. Make it conditional: only when the field hue is 195–255; a blue costume on a warm field is allowed if local contrast >=20.
18. **`cast.totalMax 6`** rejects 2 principals + 5 chorus = 7. Allow 7, or scope the count to the short format.
19. **The "world reveal" opener** and the Uber network-map example are a diagram trap. Remove `world-reveal` or require a performer/motif in the first frame.
20. **The "3 openings/3 closings" vs the 4-type menu** is inconsistent. Unify.
21. **The "12 invariants" vs the 30-axis table** is two different counts. Unify or say the 12 are the load-bearing ones.
22. **The "eight things" vs the 10-row variation table** is inconsistent. Use 11 axes.
23. **The `floor` vs `feet` vs `horizon` vocabulary** is used interchangeably. Define three names.
24. **The `close/hero` tier names** imply face close-ups. Rename to `full-body hero`, `medium`, `insert`, `macro`; require at least one full-body hero per act.
25. **The `paper physics` one-per-shot** invents a signature the reference does not have. One per act.

---

## 8. P2 — polish

- `luma 0–255 legal video range` is wrong; legal video is 16–235. Say "full-range decode of limited-range video."
- `156.63 vs 156.62` and `4,699 vs 4,698` are inconsistent; pick one.
- `shake 0–12; no decay (fix: decay 0)` is self-contradictory. Say "constant shake, no decay" or add a decay field.
- `warm earth` includes teal; call it "earth/non-blue" if that is the intent.
- `accent` is both a role and a hue; define it by hue and function.
- `one accent per frame` is not measurable; keep it as a design note.
- `3 openings/3 closings` vs 4 types.
- `12 invariants` vs 30 axes.
- `max 5 roles` short vs the 7-colour cast.
- `type.families` has 6 families but `maxSystems 2`; fine per frame, but say "choose 2–3 per film."
- `print furniture` is fixed to the reference's corner marks/timecode; keep the grammar, let the brand text vary.
- `P(DOOM)` is a reference instance; a new film's HUD can be its own instrument. Define `type.instrument` as an `F` (one diegetic instrument per film).
- `"3 openings/3 closings"` and `"4 types"` — unify.
- The `12 invariants` table and the `30 axes` table duplicate each other; keep one as the summary and one as the detail.

---

## 9. Sign-off

**SIGN: NO.**

The spec is a serious, evidence-based piece of work, and the Uber diagnosis is the best thing in it. It is not yet a channel identity because it describes the reference's **surface** (paper, palette, petals, type) and not its **engine** (tone, performance, stage scale, motif meaning, memory). It also freezes the reference's **instances** (the subtitle band, Sol's face and hair, the 5-role cap, the 31 px band) as invariants, which is how a channel becomes a template.

**Re-sign after P0-1 through P0-8.** P1 can land in the same pass; P2 can follow. The test for the re-sign is not "does the JSON validate?" It is: **give the revised spec to a designer who has never seen the reference, ask them to design a new performer and a new 30 s film, and see whether the result is unmistakably this channel without containing a sunflower, a banner, a lamp, a desk, a network map, or Sol's face.**

If the answer is yes, sign it. If the designer produces a warm, centered paper doll on a cream field with a `LYRIC` band, the spec is still a template.
