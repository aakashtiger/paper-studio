# Creative critique v3 — Paper K-pop identity specification v1.2

**Critic:** creative director / designer (third pass)
**Date:** 4 November 2026
**Subject:** `docs/research/identity/KPOP-IDENTITY.md` (body is v1.2; the header still says v1.1) and `kpop-identity.proposed.json` 1.2.0
**Previous:** `critique-creative.md` (v1.0, 6.5/10, SIGN NO); `critique-creative-v2.md` (v1.1, 7.0/10, SIGN NO)
**Evidence used:** the spec and JSON; the six crops in `styles/paper-kpop/references/frames`; 13 frames from `out/claude-pop.mp4` (0.4, 3, 30, 55, 70, 88, 95, 102, 112, 124, 138, 148, 155.5 s); `build/uber-model/final-sheet.png`; `library/characters/kiran/poses.json`; `build/library/sheets/kiran.png`; `styles/paper-kpop/tokens.json`; `formats/paper-kpop-shorts`. There is **no `blind-test-v2.md`**; the only blind test is `blind-test.md` (v1), which I read after forming the view below. It is the evidence §3.30 answers.

**Verdict: NOT SIGNED — 7.5 / 10.**
Identity completeness **8/10**; channel fidelity **7.5/10**.

**One line:** v1.2 finally names the show, then writes a rulebook in which the Uber film is a legal show — a presenter-show needs one stage shot, a declared host and a business model; the doll it measures is the library's 7.5-head worker, not the reference's 4.5-head paper doll; and tone is still a paragraph.

---

## 1. What v1.2 closes (keep this)

1. **The show is named.** §3.30 is the right section in the right place. It says the channel is a show, not a fable, a diagram or a scrapbook; it bans the pure fable; it names a mode, a stage, a star, a chorus, an audience, an entrance, an exit, a signature move and a performance beat. The blind test's largest gap ("I invented a drought town with no stage") is now a refusal. This is the most important addition since the scope legend.
2. **The diagram opener is banned in four places:** §3.23's table, §3.24's opening row, §3.25 #13, and JSON `diagramOpener: false` + `forbidden: "diagram-opener"`. The phone-map endorsement is gone. The Uber's first frame is refused by name.
3. **The frame story is in:** a title object, a credits/reveal, a bookend relation. That is the reference's handmade frame as grammar, not as the sunflower/desk instance.
4. **The poster type is legal again:** 3 display lines, 1–4 words per line, 8–25% display area, a hook shot, and the `LIES ×12` plate is a texture, not a lyric wall. This fixes "subtitle, not poster".
5. **The blue act is legal:** one act up to 60% blue with a warm figure and local contrast ≥20 is the reference's arena/P(DOOM) stage as a declared range, not a violation.
6. **The 12-axis count is consistent** in the §3.24 table, the JSON `requiredDifferences`, the §0 list and §2 axis 32. The four-count problem of v1.1 is gone.
7. **Character specificity has a stage role.** The generic worker is named as a failure; Mira is named as a pass. The test is still wrong in the details, but the direction is right.

The blind test's gaps map like this:

| Blind-test gap | v1.2 | Verdict |
|---|---|---|
| #1 cast proportion | `silhouette` block added | **Wrong doll** (P0-2) |
| #3 performance frame | §3.30 | **Right idea, loopholed** (P0-1) |
| #5 type role | 3-line display, hook area | **Right** |
| #8 frame story | §3.23 frame story | **Right content, song-only** (P1) |
| #11 opening | performance opener, diagram ban | **Right**, with `world-reveal`/`never black` leftovers |
| #12 blue stage | blue-act exception | **Right in principle**, prose median regressed (P1) |
| #2 face, #4 sound, #6 relationship, #7 medium, #10 split | unchanged / parked | **Still open** |

The rest of this critique is about the four places where the new section is a menu rather than a rule, and the one place where the new silhouette is the wrong doll.

---

## 2. Q1 — Does §3.30 close the paper-fable / diagram gap?

**Half.** It closes the *fable* (the pure-fable ban) and the *diagram opener* (the ban). It does not close the *diagram body*, because the only legal mode for a voice-led film is the one that licenses it, and the only worked example is it.

### 2.1 The stage vocabulary is general enough

The menus do not force the reference's exact stage: 8 stage devices (proscenium, sunburst, spotlight, LED backdrop, riser, curtain, trapdoor, mic stand), 5 entrances, 4 exits, 3 signature-move examples, 3 modes. A designer can build a proscenium, a cliff, a lab-as-stage, a desk-stage or a creature turn. The reference's throne/lab/museum/vault are not forced; they are instances. **This part is right.** A stage grammar that named the proscenium and the spotlight as required would have been the sunflower mistake again; it did not.

### 2.2 The presenter-show is the Uber film with a host

This is the hole. §3.30 says:

- `presenter-show`: "a host performs an idea on a set | narrated explainer, business model, story short | a host, a stage/desk, a chorus/audience, a curtain" (line 1173).
- `stageShareMin`: "≥30% of shots for a song film; **≥1 stage shot for a 30 s film**" (line 1182).
- `sound.voiceLedRequires: "presenter-show"` (JSON 477), and music is parked (spec §9.3).

So every film the studio can currently make is a presenter-show; a 30 s presenter-show passes with **one** stage shot; a host at a desk, a duo, a map backdrop and a coin is a legal K-pop film. That is the Uber film with a host and a coin. The "Uber lesson" (line 1200) says "the rider and driver are a duo on a paper stage, the fare split is a chorus, the map is a backdrop, the coin is the hook, the audience is the crowd" — that is a better Uber film, but it is still a business model with a performance frame around it, not a story told by performers.

**Exact fix:**

- Make `stage-show` the only `I` mode. Make `presenter-show` a `V` signed by the style owner and labelled "a Paper Studio format, not Paper K-pop" unless it has a song/chorus. Make `creature-show` a `V`.
- `stageShareMin`: **≥.60 for a 30 s film** (6 of 10), and **≥1 stage shot per act**; the first and last shots are stage/performance. "One stage shot" is a bookend, not a show.
- Add `performerPresenceMin: .85` (the star in ≥85% of shots) and `performerDetailShareMin: .60` (the performer is the highest-detail region, by edge density/local contrast, in ≥60% of shots). Type may be the largest shape in at most **one hook shot per act**.
- Define `performanceShot` as "a shot with the star/host in a performance frame (stage device, audience, spotlight, proscenium, riser, curtain, or a set treated as a stage)", not the `stage` set family. Otherwise the reference's lab/throne/museum do not count.
- **Fix the show test.** The table's test is "remove the story: is there still a performance?" (line 1192); the prose's test is "a star, a stage, a chorus, a song, an audience" (line 1196). The prose test requires a song, so every voice-led presenter-show fails it — including §6.2. Use one test: **"Remove the narration and the labels: is the story still legible from what the performers do? If a diagram is still needed to explain it, it is not a performance."** That is the test the Uber film fails and the reference passes.
- **§6.2 fails its own performance block.** It has 3 named characters (rider, driver, host) against `cast.principals: [1,2]`; it has no entrance, no exit, no signature move, no star named, no chorus, no audience; it is voice-led; it is a presenter-show business model. It should either be a stage-show with a song (and the music unparked) or be marked "Paper Studio, not Paper K-pop" and kept out of the identity. As written, it is the instruction a designer will follow.
- **The default mode is unreachable.** `performance.defaultMode: "stage-show"` vs `sound.voiceLedRequires: "presenter-show"` and music parked. Either unpark music, or make `presenter-show` the declared default with a stage MC and a hook, or delete the default. A default that no current film can use is a wish.

### 2.3 The paper stage is missing its giant object

The reference's stage is not a proscenium with a small prop; it is a **diorama with one object out of scale**: a 600×640 throne, a vault door, a mug tower, a giant sun, a desk with a cutting mat. The spec's `stage device` is a stage *furniture* list; `props.sizeClass` is a prop size; `sets` has "one graphic device". A designer can satisfy §3.30 with a curtain, a mic stand and a desk, and still make a poster with a host.

**Exact fix:** `sets.giantObject: 1 per act, 1.5–3.5× the star's height, named (throne, vault, tower, sun, desk, screen); or a nested diorama (the film is a paper object on a larger surface, revealed at the close)`. The reference's close is the nested diorama; the t70 vault is ~2.5×; the t148 sun is ~2×. That is the paper-show signature. Without it, "a stage" is a TV studio.

### 2.4 The beat has no clock

`performanceBeat`: "a pose/formation change every 2–4 beats" (line 1191), and `formationChangeBeats: [2,4]` (JSON 297). A "beat" is undefined: there is no `movement.bpm`, no `beatLocked`, no `flowerPulse` anywhere in the JSON. `A-engine.md` says the reference is 88 BPM; `B-cast-sets.md` gives the flower pulse at `.045`. A K-pop performer who is not on the beat is a paper doll with a boil — my v2 P0-5, still open.

**Exact fix:** `performance.bpm: 88` (or the song's), `movement.beatLocked: true`, `movement.flowerPulse: .045`; measure `formationChangeBeats` against `bpm`.

---

## 3. Q2 — Performer test, silhouette, character specificity

**The generic worker is excluded; a specific worker is not. Mira is included by features, not by construction. The creatures are excluded. The silhouette is two different dolls in one block.**

### 3.1 The silhouette is the library's 7.5-head worker, not the reference's 4.5-head doll

§3.9's `silhouette` block (line 482; JSON 231) says:

| band | spec | reference (measured roughly on `chorus-stage.jpg`, t148, t3) |
|---|---|---|
| head + ornament | 22–28% of height | head alone **20–28%**; halo **45–65%** |
| torso | 30–35% | 28–34% |
| legs | 35–40% | 32–40% |
| shoulder | 18–22% | **12–17%** |
| hand | 3–4% | **0–2%** (a capped tube, no palm/thumb) |
| boot/platform | 8–12% | 8–12% |

The 22–28% is the **head**, not the head plus ornament. The reference's halo is 45–65% of the figure's height; the spec has no ornament height at all. The `headToBody: 7.0–7.5` (JSON 237) means a head of 13.3–14.3%; the silhouette's 22–28% means **3.6–4.5 heads**. Those two numbers cannot both be true for the same figure. The sentence "doll proportions, not a realistic 7.5-head human" (JSON 231) is an assertion the numbers contradict.

The reference is **4.2–5.2 heads**: `chorus-stage.jpg` star ≈645 px tall, head 130 px = 4.96 heads; t148 star ≈545 px, head 150 px = 3.6–4.5; t3 Sol ≈600 px, head 135 px = 4.4. The library's Kiran is 7.5 heads (`build/library/sheets/kiran.png`): a long-limbed figure with a small head, no halo, a mitten hand. The v1.2 silhouette is Kiran's proportions with a halo word added. That is the blind test's **#1 divergence** — "my cast reads as Paper Studio, not Claude Pop" — and the fix locks the wrong doll as the invariant.

**Exact fix:**

- `cast.headToBody: [4.2, 5.2]` (visual heads, hair top to chin). Move `580–760 units / 7.0–7.5 heads` to "library construction, not the channel silhouette".
- `silhouette.headPct: [.20,.28]`, `ornamentDiameterPct: [.45,.65]`, `ornamentSpan: [2.4,4.0] × shoulder`, `torsoPct: [.28,.34]`, `legsPct: [.32,.40]`, `shoulderPct: [.12,.17]`, `handPct: [0,.02]`, `bootPct: [.08,.12]`.
- Make the bands partition (sum .98–1.02) or declare each as independent. Add `ornamentDepth: behind-face`.
- **Add `kneeL` / `kneeR` to `cast.joints`.** The list (JSON 238) has 13 names and no knees; the rig bends a knee (`AGENTS.md`, leg IK). A character built from the identity cannot bend a leg. This is a contract error, not a style choice.
- Make `hand` optional (`thumb` optional) and allow a capped tube; Mira's rig has 7×10 hands and no thumb (`B-cast-sets.md` §2.6). The current `thumb .4–.5` fails her.
- Add a `creature` construction branch: a paper creature with a readable body plan, 8 poses, 14 expressions, a stage role, and a silhouette that reads at 390 px. The humanoid doll bands apply only to humanoid performers. The `creature-show` mode and the `creature` stage role currently have no cast that can pass point 1.

### 3.2 The seven-point test is a declaration test

The test (line 458; JSON 223–230) asks for "at least three distinguishing features" and "a declared stage role". A specific office worker with glasses, a tie and a badge has three features; a declared `host` role is a string. He passes. The document's own example — "A generic office worker has one feature (a suit) and no stage role" (line 463) — only excludes the *generic* worker, not the specific one. The Uber pair are specific (Kiran: bob, blue jumpsuit, badge; Vaz: glasses, waistcoat, tie) and would pass 2, 3, 4, 5, 6 with a declared `host`.

Also, the count is **seven in the prose, six in the JSON, six in §5.1's "6/6"** (line 1303). Points 2 and 7 are the same stage role. The `stageRoles` enum is `star|backing|foil|creature|host` in the JSON, `lead|backing|foil|creature|host` in point 2, `star|foil|chorus|creature|host` in point 7. Three lists.

**Exact fix:**

- Replace "3 features" with **one feature from each class**: silhouette (ornament/halo/ears/hat/hood/strong hair), face (makeup or mask), costume (stage signal: collar/cuff/pleat/stripe/sash/badge). A filled styling slot, not an empty slot.
- Add the performance half that is still missing: `performancePoses >= 4` from `mic, point, heart, bow, wave, danceHit, present`; `performanceAction >= 1 per performer shot`; `makeup >= 2 of lash/eyeshadow/lip/blush`; `gaze: audience|target`; `stageContext: stage-or-metaphor` in the first 3 shots.
- One enum: `star | backing | foil | creature | host`. Six points, not seven; or seven with "stage role" as a film-level relationship and "specificity" as the library test. Do not use 6/6 and seven-point in the same document.
- `host` is an **MC**: a mic/megaphone, a signature move, a spoken or sung hook, and one performance action per host shot. A lab-coat researcher is a `foil`, not a `host`. That is how the presenter-show stops licensing the office worker.
- `library:check` must read `stageRole`, `specificity`, `faceStyle`, `performancePoses` and refuse a worker rig with an empty role.

### 3.3 Mira and the creatures

Mira passes points 2–7 on paper (bob, round glasses, lab coat, red tie = four features; role = foil; face = drawn). She fails point 1 if she is 5 heads (the blind test measures the researcher at ~5) and if she has no thumb/wrist brad. The document says "Mira passes" (line 470) without addressing point 1. That is the same error as v1.1, smaller. The creatures (CLIP, SHOGGOTH, BASILISK, CHINCHILLA) fail point 1 outright: a shoggoth is a blob with eyes, not a 7–7.5-head, 580–760-unit, two-bone humanoid. The `creature` stage role and `creature-show` mode are therefore empty.

**Verdict:** the test is **too broad** for a specific worker (declaration) and **too narrow** for the reference's own researcher and creatures (construction). It is not yet a performer test; it is a distinctiveness + role declaration.

---

## 4. Q3 — Text and opening

**The direction is right; the contract is not finished.**

### 4.1 The subtitle band is still fixed

`subtitleBox` (JSON 439) is block-scope `I`: x 84, y 992, height 62, `LYRIC`, acid active word, progress hairline. Every film still gets the same bottom-left band. In 9:16 at 1080×1920, y 992 is **51.7% of height** — the middle of the phone frame. The pack's own 9:16 anchor is `aspectBoxes.9:16.subtitle.y = 0.34` (`styles/paper-kpop/tokens.json`). The identity contradicts the pack it extends.

**Exact fix:** move the geometry to `formats/paper-kpop-shorts/format.json` (16:9: x84/y992/size31/height62; 9:16: the pack's 0.34 anchor, size 16, 14 px floor). Keep as `I`: one band, one line, enter on the word, no face/hands/feet overlap, paper layer. The `LYRIC` label, acid word and hairline are the song format's preset, not the style.

### 4.2 The 9-word subtitle is still a lyric wall

`subtitleBox.maxWords: 9` (JSON 439), `type.maxWords: 8` (JSON 442), and the lyric wall ">8 words of narrative copy" (JSON 450; §3.19 line 890). A 9-word subtitle is narrative copy, so the spec permits a thing it bans. The v1.1 critique named this; v1.2 did not fix it.

**Exact fix:** one number. `maxWords: 8` everywhere, or `lyricWall: >9` with "the subtitle band is the one 9-word exception". Do not have both.

### 4.3 The hook area is right; the hierarchy is still missing

The 3-line display, 1–4 words per line, 8–25% display area, 2–5 hooks and the `LIES ×12` plate are the right fixes. The reference's `I SEE / SPARKS / OF AGI` is now legal, and the `LIES` plate is a texture. Good. But there is still **no performer-vs-type rule**: §3.6 still says "one focal shape ... the subject, a prop, or a type block — one, not three" (line 384), and the Uber's type is a focal shape. The v2 P0-6 asked for "the performer is the focal shape in ≥60%"; v1.2's performance section says "the performer is the subject" in prose (line 1200) but gives it no measure.

**Exact fix:** `type.subjectPriority`: in a performer shot, the performer's detail share ≥ the type's; type may be the largest shape in **at most one hook shot per act**. Add `cast.presence` (the star in ≥85% of shots, see P0-1) and a `type.mode` (`lyric-band | poster | diegetic`) with 3 layouts per film and no repeated layout from the last 3.

### 4.4 Frame story: right content, wrong scope

§3.23's frame story is a song-film section (line 1006); the JSON `opening` block is all films (`titleObject: 1`, `credits: 1`, `performanceOpener: true`). The prose and the JSON disagree. The only current output is voice-led, so the prose makes the bookend optional for the only film the studio can make; the blind test's #8 (no frame story) remains for a narrated film.

**Exact fix:** make the frame story `I` for every film; a presenter-show's title object can be the desk/mic/ledger; credits ≤2 s; the bookend is a declared pair of shot ids (first/last) with the same object or its world. The credits block must not eat the last line's tail (the voice rule is last word ≥1.5 s before the end).

### 4.5 Opening: one ban, three menus, one false claim

- `world-reveal` is still in §3.23's `opening types` (line 996), while §3.24's opening row and JSON `opening.types` use `title-object` (no world reveal). Three menus: object birth / performance object; question; world reveal / title object.
- "never black" is still in §3.23's table (line 995), and the prose says "The source's cold open is a lit paper event on a dark field" (line 1002). `I-frames.md` measures shot 00 at field .91, luma 37.8; `B-cast-sets.md` calls it a "black void". A near-black field is not a "never black" pass. The reference fails the row as written.
- The diagram-opener ban is right and consistent; keep it.

**Exact fix:** one opening menu: `performance-object | mid-action | question | title-object`; delete `world-reveal` (or make it a `V` with a performer in frame 1); replace "never black" with "a dark field is allowed; a black frame with only a logo is not"; correct the cold-open description to "a near-black field (91%) with a lit paper event". The `performanceOpener: true` is the stronger rule; the "never black" row is redundant.

---

## 5. Q4 — Tone

**Still prose, and the only worked example still fails it.**

§3.26 (JSON 500–514) is unchanged in substance: `mode`, `surface`, `subject`, `character`, `violence`, `cynicism`, `tenderBeat: 1`, `poisonAccent: [acid,pink]`, `ending`. The `measure` is `human/review`; §5.1 says `Tone | review | sweet-sinister; one tender beat | human | none` (line 1319). By §1.1's own definition, an `I` that no check can refuse is a note, not an invariant. The JSON `required` array does not even include `identity.tone` — it includes `identity.tones` (the luma block), a name collision. So a schema check would not require the register at all.

The five beats I asked for in v2 are still absent: `darkAct`, `contradictionSticker`, `cuteInDanger`, `misbehavingProp`, the sweet/sinister pairing. The worked example §6.2 has a host, a duo, a coin split and a fare split; it has no threat, no poison accent at a threat, no dark act, no contradiction sticker, no tender beat, no cute-in-danger. It is a business model with a stage. The §3.26 test ("if the film is only cute ... if only dark ...") is a human judgement, not a pass/fail.

**Exact fix:**

- Add `tone.beats` with shot ids and a `why`:
  - `sweet >= 1`
  - `sinister >= 1`
  - `tender >= 1`, near the end
  - `darkAct >= 1` (field `ink|oxblood|teal`)
  - `poisonAccentShot >= 1` (acid/pink at the threat, not decoration)
  - `contradictionSticker >= 1` (text vs image)
  - `cuteInDanger >= 1` (cage/maw/giant hand/spotlight/crowd)
  - `misbehavingProp >= 1` (the phone grows a mouth, the meter rises, the coin bites)
- `tone.subject`: change "a real threat, a bad idea, a doom, a joke about power" to a **register** ("a bad idea the world treats as normal") so a creature/wedding/creature-show film can pass without a doom.
- §6.2 gets the same row: the platform's cut is the threat; the coin's acid edge is the poison; the driver's one free ride is the tender beat; the city at night is the dark act; "FAIR FARE" on the maw is the contradiction sticker.
- `film:review` reads the ids; `style:identity` checks the shot ids exist, the fields/accents are in the palette, and the tender beat is in the last third. A human still signs the joke; the beats are the contract.
- Add `identity.tone` to `required`; rename `identity.tones` to `identity.luma` to kill the collision.

---

## 6. Q5 — The 12 axes and the counts

**The 12/12/12 is fixed; the memory is not.**

The §3.24 table has 12 rows; the JSON `requiredDifferences` has 12; the §0 list has 12; §2 axis 32 says "12 required differences; 12 invariants". Good. The four-count problem of v1.1 is gone. What remains:

1. **§0 still says "ten axes"** (line 18). The one-page answer a director reads is the only place with the old count. Change to twelve.
2. **The table says "last film" in 10 rows; the History paragraph says last three** (line 1039); the JSON `historyFilms: 3`. The table is the rule; the paragraph is the memory. Make the column "differs from all of the last 3" and add `variation.json` with the 12 axes and the last 3 values.
3. **"variation:check refuses a fourth use"** (line 1039) is a rotation, not a difference. With 4 opening types and a 3-film memory, the fourth value is forced, not forbidden; with a non-consecutive value, the "fourth use" never fires. Replace with "differs from all of the last 3 on every axis".
4. **No report, no signature reason.** `signatureShot: 1` (JSON 575) has no `why` and no `differsFrom`; the row says "unlike any shot in the last film" (one film). Add `signatureShot: {count: 1, why, differsFrom: <shot id>, last3: true}`; `film:review` refuses a missing or identical axis.
5. **The sound axis is frozen.** With music parked, every film is voice-led; "song-led or voice-led; different mode if the last film was the other" (line 1036) cannot be satisfied. Use a **sound register** axis (voice, tempo, narrator, hook) while music is parked; keep song/voice as the format's `V`.
6. **The 12 invariants still omit tone and performance.** The §0 "fixed grammar" list (line 17) has paper, camera, palette, shadow, cast, field, contrast, scale, type, cut, motif, mix — no tone, no show. The 12-invariant table #5 smuggles "on a stage" into cast, but tone is absent from both. The one-page answer a director reads still says "cast construction" and no attitude. Add `Tone` and `Performance` to the 12 (or call the 12 "the load-bearing" and list the full I axes).

---

## 7. Q6 — Score and remaining P0s

**7.5 / 10.** The +0.5 on v1.1 is for the performance frame, the diagram-opener ban, the frame story, the 3-line/hook type, the blue act and the 12-axis count. The 2.5 withheld is for the presenter-show loophole, the wrong doll, the declarative performer test, the prose tone and the fixed band.

### P0-1 — The performance frame is legal on paper, not in the cut

**Why:** `presenter-show` + `stageShareMin` "1 stage shot for a 30 s film" + no presence/focal rule + `voiceLedRequires: presenter-show` + music parked = the Uber film is a legal Paper K-pop film. §6.2 is the proof: 3 named characters against `cast.principals: [1,2]`, no entrance/exit/signature/chorus/audience, no song, and it is labelled "why it is the channel". The show test has two versions; the prose one requires a song that the presenter-show does not have. The stage has no oversized paper object.

**Exact fixes:**

- `stage-show` is the only `I` mode; `presenter-show` and `creature-show` are `V` (signed, labelled "Paper Studio" unless they have a song/chorus).
- `stageShareMin .60` for 30 s and ≥1 per act; first/last shot stage/performance.
- `performerPresenceMin .85`; `performerDetailShareMin .60`; type largest in ≤1 hook/act.
- `performanceShot` defined by the performance frame, not the `stage` set family.
- `sets.giantObject: 1 per act, 1.5–3.5× the star, named`; or a nested diorama.
- One show test: "remove the narration and labels — is the story still legible from the performers' actions?"
- §6.2: a stage-show with a song (unpark music) **or** explicitly "not Paper K-pop; Paper Studio"; add the star, chorus, audience, entrance, exit, signature move; fix the 3-principal count.
- `performance.defaultMode` and `sound.voiceLedRequires` must agree; add `bpm: 88` (or the song's) and `movement.beatLocked: true`, `flowerPulse: .045` so "every 2–4 beats" has a clock.

### P0-2 — The doll silhouette is the library's 7.5-head worker, not the channel's 4.5-head doll

**Why:** 22–28% "head + ornament" is the head alone; the halo is 45–65% and missing; `headToBody: 7.0–7.5` contradicts 22–28% (which is 3.6–4.5 heads); shoulder 18–22% vs 12–17%; hand 3–4% vs a capped tube. The blind test's #1 divergence is re-locked. `cast.joints` has no knees; `hand` requires a thumb (Mira fails); the creatures fail the humanoid construction.

**Exact fixes:** `headToBody [4.2,5.2]`; `headPct [.20,.28]`; `ornamentDiameterPct [.45,.65]`; `ornamentSpan [2.4,4.0] × shoulder`; `shoulderPct [.12,.17]`; `handPct [0,.02]`; `kneeL/kneeR`; `hand`/`thumb` optional; a `creature` construction branch; move `580–760 / 7–7.5` to "library construction, not the channel silhouette"; re-proportion the pack's cast or declare the reference's doll an instance — not both.

### P0-3 — The performer test is still a declaration test

**Why:** 3 features + a declared `host` passes a specific office worker; Mira passes by features but fails the construction band if 5 heads; creatures fail point 1; no performance action/gaze/makeup/performance poses. The count is seven in prose, six in JSON, six in §5.1.

**Exact fixes:** one feature from each of silhouette/face/costume; a filled styling slot; `performancePoses >= 4` from the named list; `performanceAction >= 1 per performer shot`; `makeup >= 2`; `gaze`; `stageContext` in the first 3 shots; one `star|backing|foil|creature|host` enum; `host` = MC with a mic/signature move/hook; `library:check` reads the fields; six or seven points, not both.

### P0-4 — Tone is still prose, and §6.2 fails it

**Why:** `measure: human/review`; the `required` array does not include `identity.tone` (`identity.tones` is luma); no dark act/poison shot/contradiction/cute-in-danger/misbehaving prop/tender beat; §6.2 has none.

**Exact fixes:** the 8 beats with shot ids and `why`; §6.2's tone row; `subject` as a register; `film:review` reads the ids; add `identity.tone` to `required` and rename `tones` to `luma`.

### P0-5 — Text/opening: the fixed band, the 9:16 mid-frame, the 9-word contradiction, the missing hierarchy

**Why:** `subtitleBox` is `I` at y992 (51.7% of a 1920-high frame); `maxWords 9` vs lyric wall `>8`; no performer-vs-type rule; `world-reveal` vs `title-object`; "never black" misdescribes the reference; the frame story is song-only in prose but all-film in JSON.

**Exact fixes:** move the box to the format (16:9 84/992/31; 9:16 0.34/16/14); `maxWords 8` (or lyric wall >9 with the subtitle exception); `type.subjectPriority` (performer detail ≥ type in performer shots; type largest in ≤1 hook/act); one opening menu (performance-object, mid-action, question, title-object), delete `world-reveal`; "dark field allowed; a black frame with only a logo is not"; frame story all films, credits ≤2 s, bookend shot ids.

### P1 — important, same pass

1. **Document/schema control:** the MD header is v1.1 while the body/JSON are v1.2 (line 5); the critiques list only v1; `basis` still uses `product`, `reference`, `code/film`, `reference-comparison` outside the `code|film|crops|target|proposal|format` enum; `required` misses tone/opening; §0 "ten axes"; the one-page answer omits tone and performance.
2. **Blue:** §3.3 rule 2 and §5.3 say film median blue ≤.20; the Uber is .179, so the prose band passes it. Use median ≤.05, p90 ≤.20, one act ≤.60 (V) with a warm **face/torso** and local contrast ≥20 — not "the figure must be warm" (the reference's idol wears a blue skirt and boots).
3. **Motion:** no `movement.bpm` / `beatLocked` / `flowerPulse` (the new "every 2–4 beats" has no clock); fold/tear/curl are still peers of pop/slam/snap (they should be a max-1-film `V`); `squash .96–1.04` is twice an impact.
4. **Motifs:** the library is still 13 formal devices; §6.2's coin/route/phone and the blind test's jar/coin/umbrella/thread are outside it; `semanticObjectMin: 1` is a token; no `arc` (introduced/transformed/paid off); no `scale`; 2 vs 3 uses (`props.motifRecurrence: 3` vs `motifs.uses: [2,5]`). Split devices/objects, 2 objects + 1 device for 30 s, `arc` and `scale` per object.
5. **Split-screen duet:** the side-bar ban still forbids the reference's `KILLSWITCH / PAPER BEACH` (a two-panel duet, not a UI wing). Add a `duet-split` V: two full-bleed fields, one paper divider, no third bar; keep the UI bar ban.
6. **Face:** the prose still fixes Sol's px face (eyes ±17.5, mouth y32); the library's Kiran has dot eyes and a line mouth, which `faceStyle` ("lashes, irises, lips, blush") refuses. Use ratio bands (face .48–.62 of head, eyes ±.40–.46, mouth .62–.72) and make `library:check` read `faceStyle`.
7. **The stage's vocabulary is in prose only:** `stageDevices`, `entranceKinds`, `exitKinds`, `signatureMoveKinds` are not in the JSON `performance` block; a validator can't read them. Add them.

### What v1.2 got right (keep)

- The performance frame, the pure-fable ban, the diagram-opener ban, the frame story, the 3-line display + hook area, the `LIES` texture exemption, the blue act, the 12-axis count, the character-specificity + stage-role direction, the 9:16 size note, the flat-print light, the per-act paper event, the cast-ornament motif exemption, the three-film history. These are real. Do not lose them in the next cut.

## 8. Sign-off

**SIGN: NO. 7.5 / 10.**

The re-sign test from v1/v2 has still not been run. The v1 blind test is the evidence §3.30 answers; there is no v2 blind test. The test is:

> Give v1.2 to a designer who has never seen the reference. Ask for a new performer and a new 30 s film. The result must be unmistakably this channel without a sunflower, a banner, a lamp, a desk, a network map, a business deck, or Sol's face.

A designer following v1.2 will produce: a presenter-show with a host at a desk, a duo, a map backdrop, one stage shot, a 7.5-head worker with three features and a `host` role, a 2-line `LYRIC` band at x84/y992, a `world reveal` or a title object, a voice-led 182 wpm read, and a business model with a coin. That is the Uber film with a performance frame. The answer to the test is still no.

Sign v1.3 when the five P0s are closed, §6.2 is a film that would make someone laugh and then flinch, and the doll in the frame is the reference's doll, not the library's.
