# Creative critique v4 — Paper K-pop identity specification v1.3

**Critic:** creative director / designer (final pass)
**Date:** 4 November 2026
**Subject:** `docs/research/identity/KPOP-IDENTITY.md` v1.3 and `kpop-identity.proposed.json` 1.3.0
**Previous:** `critique-creative.md` (v1.0, 6.5/10, SIGN NO); `critique-creative-v2.md` (v1.1, 7.0/10, SIGN NO); `critique-creative-v3.md` (v1.2, 7.5/10, SIGN NO)
**Evidence used:** the spec and JSON; the six crops in `styles/paper-kpop/references/frames`; `films/uber-model/score.json` (10 shots, all six explainer recipes); `library/characters/{kiran,vaz}/poses.json`; `styles/paper-kpop/tokens.json`; `src/engine/style-identity.ts`; and `blind-test-v2.md`, which is now present and is the best evidence the spec has. I read it before writing, not after.

**Verdict: NOT SIGNED — 8.0 / 10.**
Identity completeness **8.5**; channel fidelity **8.0**.

**One line:** v1.3 closes the Uber loophole with four numbers, gives the channel its own doll and its eight tone beats — then writes a worked example (a voice-led stage-show) that the sound block forbids, and leaves the reference film with no mode to belong to.

---

## 1. Q1 — Do the five P0s close?

| P0 (v3) | Verdict | The one-line reason |
|---|---|---|
| P0-1 performance frame | **PARTIAL** | The four numbers exist; "stage shot" and "detail shot" do not, and §6.2 is in an illegal mode. |
| P0-2 doll | **PARTIAL** | 4.2–5.2 and 45–65% are the reference's hero doll; the family splits by head definition, and the library is still `worker@0.1.0`. |
| P0-3 performer test | **PARTIAL** | A declared `host` still passes a specific office worker; the new fields are prose, not file fields. |
| P0-4 tone | **PARTIAL** | Eight beats, correctly ordered, describing the real film; no shot ids, and §6.2 demonstrates two of eight. |
| P0-5 text/opening | **PARTIAL** | The band moved to the format; 8 vs 9 words, `world reveal`, "never black" and the song-only frame story all remain. |

### P0-1 — The performance frame: rules without units

**Fixed (real):** `performance.modeScopes` makes presenter-show and creature-show `V, signed`; `stageShareMin .60` for a song film; `performerPresenceMin .85`; `detailShareMax .40`; `giantObject 1`; `opening.diagramOpener false`; §6.2's cast is 2 principals, not 3. The blind test v2's #4 (a presenter-show threshold) and #5 (30 s arithmetic) are answered; #3 (reference classification) and #10 (music dependency) are not.

**Not fixed:**

- **"A stage shot" is never defined.** The stage-device list (proscenium, sunburst, spotlight, LED backdrop, riser, curtain, trapdoor, mic stand) is in §3.30's prose table, not in `performance` in the JSON. There is no `performanceShot` field. So the 60% can only be a score flag, and §5.5 #5 says a score claim is a failure.
- **"Detail" and "diagram" are merged into one row** (`detailShareMax .40`). A macro insert of a coin is a detail shot; a route map is a diagram shot. The reference has the first (`macro-prop`); the Uber has the second. The rule that should refuse the Uber should not refuse the reference's macro.
- **The stage share and the detail share are not complementary.** If they were, `<40% detail` would already give `>=60% stage` and the 1/act note would be redundant. Because neither is defined, a film can be 10/10 "stage" and 10/10 "detail" by declaration.
- **The presenter-show stage rule is 1 shot per act, not .60** (`stageShareMin` note; §3.30 line 1204). A 10-shot presenter film can be 5 stage + 4 diagrams + 1 other and pass both numbers.
- **`giantObject` is 1 per film with no size band and no "stage" constraint.** One per film is the right number for 30 s (I withdraw my per-act ask), but without 1.5–3.5× the star, the Uber's phone screen can be named as the "screen". A phone is not an oversized paper object; the reference's throne, sun and vault are.
- **The show test is still two tests.** The table says "remove the story: is there still a performance?" (line 1217); the prose says "a star, a stage, a chorus, a song, an audience" (lines 1219–1221). The prose one requires a song, so every voice-led film fails it — including §6.2.
- **§6.2 is a stage-show and voice-led** (lines 1430, 1440). `sound.voiceLedRequires: "presenter-show"` (JSON 1930) says that combination does not exist. This is new in v1.3 and it is the worst kind of error: the worked example is the instruction.

### P0-2 — The doll: the band is right, the head is still two heads

**Fixed (real):** `cast.visualHeadToBody [4.2,5.2]`; `headOrnamentDiameterPct [.45,.65]`; `kneeL/kneeR` (the joint list is 15); `thumbOptional`; the creature branch in prose and JSON. My v3 asked for all five.

**Not fixed:**

- `cast.headPct [.22,.28]` is **3.6–4.5 heads**, not 4.2–5.2 (which is 19.2–23.8%). The two bands overlap only at 4.2–4.55. A film with a 25% head passes `headPct` and fails `visualHeadToBody`; a film with a 20% head passes the visual band and fails `headPct`.
- `cast.silhouette.headOrnamentPct [.22,.28]` has **the same range as `headPct`** but a different meaning (head + ornament). If the ornament is 45–65% in diameter, head + ornament cannot also be 22–28% of height. One of the two is a label, the other is a number.
- The JSON note on `visualHeadToBody` says **"head + ornament"**. Head + ornament is 45–65% of height, i.e. 1.5–2.2 heads, not 4.2–5.2. The note should say **head + hair**; the 4.2–5.2 band only works on the face-plate/hair reading.
- The rest of the table is unchanged: `shoulderPct [.18,.22]`, `handPct [.013,.037]`, `torsoPct [.30,.35]`, `legsPct [.35,.40]`; and the performer test's point 1 still requires **580–760 units, 7–7.5 heads, bradded two-bone limbs**. So the constructor still builds the worker and the frame probe now rejects him.
- **The library is literally the worker.** `library/characters/kiran/poses.json` has `rig: "worker@0.1.0"`; Vaz is `supervisor@0.1.0`; neither file carries `archetype`, `stageRole`, `faceStyle`, a silhouette or a performance pose. `src/engine/style-identity.ts` reads only `poses` and `expressions`. The identity's `cast.archetype: paper-pop-performer` is a string no character file owns, and `library:check` cannot refuse a worker rig because it never reads the field.

### P0-3 — The performer test: still a declaration test

**Fixed (real):** the `stageRoles` enum is one list in the JSON (`star/backing/foil/creature/host`); point 4 adds a **performance feature** (ornament, makeup, signature hair/glasses) that must be recognisable at 390 px; point 5 adds **4 performance poses** in the MD; the creature branch allows a mask face and a non-human body.

**Not fixed:**

- **"Three distinguishing features" is still any three from seven classes** (silhouette, hair, face, ornament, costume, glasses, prop). A specific office worker with glasses, a tie and a badge has three. My v3 asked for **one from each of silhouette / face / costume**; that is not in the MD or the JSON.
- **The JSON test does not carry the MD's performance poses.** `performerTest[4]` still says "bounce, lean, head tilt, arm L/R, leg L/R". There is no `performancePosesMin`, `performanceAction`, `makeupMin`, `gaze` or `stageContext` field anywhere in the JSON.
- **`host` is still "an MC, not a narrator" in prose only.** No mic, no signature move, no spoken hook. A lab-coat researcher declared `host` still passes; that is how the presenter-show keeps licensing the office pair.
- **The count is still wrong.** The test has seven points; §5.1 still says "6/6 test" (line 1328); points 2 and 7 both require a stage role; MD point 2 says `lead` while the enum says `star`. One enum, one count, or the check cannot be written.
- **No file fields, so no `library:check`.** The seven points exist only in the document.

### P0-4 — Tone: the beats are right; the binding is missing

**Fixed (real):** §3.26 now has **eight tone beats, in order** (bright surface, first threat, cute-in-danger, comic escalation, dark act, tender beat, resolve/loop, button); the JSON has `beats[8]`, `darkActMin 1`, `tenderBeat 1`; `identity.tone` is in `required`; `identity.tones` was renamed to `filmBands`, so the name collision is dead.

The eight beats **describe the reference**, which is the test of any tone rule: title/sunflower; "I SEE SPARKS" and P(DOOM); "PLEASE DON'T"; the train and the OPTIMIZING button; "LIES LIES LIES" on black; the desert "there you are"; the finale; the desk pullback. That is the channel's spine, not a mood board.

**Not fixed:**

- **No shot ids and no `why`.** The order cannot be checked; a film can write the eight strings and place them anywhere.
- **The JSON has no beat count.** Only `darkActMin` and `tenderBeat` are numbers, so a film with a dark act and a tender beat passes with 2 of 8.
- **The dark act has no field.** `darkActMin: 1` does not say ink/oxblood/teal; §3.26 says it in prose.
- **No `poisonAccentShot`, `contradictionSticker`, `cuteInDanger` or `misbehavingProp`.** The eight beats name the ideas; the four measurements that would make them checkable are absent.
- **`subject` is still "a real threat, a bad idea, a doom, a joke about power"** (line 1099). A wedding, a creature turn or a tender story still has to import a doom. The register should be "a bad idea the world treats as normal".
- **`measure: human/review`.** By §1.1's own rule, an `I` that no check can refuse is a note, not an invariant. The same is true of `performance.showTest`.
- **§6.2 has no tone row and fails six of eight.** See §4 below.

### P0-5 — Text and opening: the band moved; the words did not

**Fixed (real):** the subtitle geometry is now `T`, with 16:9 84/992/31 and 9:16 .12/.34/16 (line 866); `type.subjectPriority` exists ("performer > type; if they compete, move the type"); `subtitleBand9x16` is in the JSON. The 9:16 mid-frame bug is closed.

**Not fixed:**

- **`maxWordsSubtitle: 9` is unscoped** against `lyricWall: ">8 words of narrative copy"` (JSON 897/1894). Nine words is legal only if the line is a *lyric*; a nine-word narrated subtitle is narrative copy and trips the wall. The doc never says which. One field: `maxWordsSubtitle: 9, scope: song-led`, or 8 everywhere.
- **`world reveal` is still in §3.23's opening types** (line 1003) while §3.24 and `opening.types` use `title-object`. Three menus for one choice.
- **"Never black" is still in the first-frame row** (line 1002), and §3.23 still calls the cold open "a dark field" rather than the measured 91% near-black. The rule and the evidence still disagree.
- **The frame story is still headed "(song films)"** (line 1013) while the JSON `opening` block is all films. The only producible film is voice-led, so the prose makes the bookend optional exactly where it is needed.
- **`subjectPriority` has no measure.** There is no "the type is the largest shape in at most one hook per act" and no `performerDetailShareMin`; the rule is prose.
- **The 9:16 band is a point, not a box.** `subtitleBand9x16 {x:.12, y:.34}` drops the pack's `w .8, h .07` (and uses .12 where the pack uses .1). The note "the 69 px audit floor is the 9:16 equivalent (14 px at 390)" is true only on a **1920-wide** frame (69/1920×390 = 14.0); on a 1080-wide 9:16 it is 24.9 px, and 14 px at 390 is 38.8 px at 1080. One of the two canvases is wrong.

---

## 2. Q2 — Is the stage-show enforceable, and can the Uber film still pass?

**The Uber film cannot pass v1.3.** Tested against the actual score (`films/uber-model/score.json`, 10 shots):

| Check | Field | Uber value | Result |
|---|---|---|---|
| Stage ≥60% (song) or ≥1/act (presenter) | `performance.stageShareMin .60`; note ">=1 stage shot per act" | **0/10 stage**; the recipes are `network_web`, `app_menu` ×2, `phone_route` ×2, `city_route` ×2, `fare_split`, `money_flow`; no stage device in any shot | **fail** (0/10 and 0/5 acts) |
| Presence ≥85% | `performerPresenceMin .85` | cast 2 (Kiran `worker@0.1.0`, Vaz `supervisor@0.1.0`); staged in 9/10 shots (AGENTS.md) = 90% | **pass** |
| Detail ≤40% | `detailShareMax .40` | **10/10**; every `visual.focus` is a diagram element — the network lines, the four tiles, the moving route, the moving car, the fare slice, the coin, the wait bar, the arrival pin | **fail** |
| Giant object 1 | `giantObject 1` | none named; the phone is a diagram surface, not a stage object | **fail** (weak) |
| No diagram opener | `opening.diagramOpener false`; `performanceOpener true` | shot 1 is `network_web`; no performer in frame 1 | **fail** |

So the loophole is closed against the film that exposed it: the Uber fails four of five, and the one it passes is **presence**, the only member of the new block that already has a reader (`stagedRatio`, 9/10 = 90%). That is progress, and it is worth the half point.

**But "enforceable" is not yet true, for four reasons.**

1. **The four failures are declarations.** The score has no `stage`, `detail`, `giantObject` or `opening.kind` field; the film would fail by *absence*, which is the right default but not a measurement. A rebuilt Uber with `stage: true` on six shots, a coin declared as the giant object and a stage set would pass all five while still being a business model. Presence is already checked as `stagedRatio`, and the Uber passes it; the other four have no reader at all.
2. **The acceptance test does not test the new block.** §5.5 and `checks.acceptance` list field, centroid x, height sd, local contrast, motifs, blue-on-blue, side bars, surface — the v1.0 gaps. They do not name stage share, presence, detail share, giant object, tone, the doll or the show test. The test that proves the Uber fails does not exercise the rules v1.3 added.
3. **The reference fails its own stage rule.** The reference is song-led and, per `blind-test-v2.md` §Phase 2, a **presenter-show with performance numbers and a stage finale**, stage share far below 60%. `modeScopes` says `stage-show` is `I for a song film`, so the reference must be a stage-show and fails; `presenter-show`'s only when-list is "narrated explainer, business model, story short" and `sound.voiceLedRequires` makes it the voice-led mode, so a song-led presenter film is in neither mode. There is no fourth mode. §0.1's own rule — "if a band fails the reference film, the band is wrong" (line 82) — fires, and v1.3 does not answer it. The fix is one word: `stageShareMin.basis: target` (not `film`), plus a `reference.mode: presenter-show` field, or a fourth `song-presenter` mode with its own band.
4. **No legal film is producible today.** The reference is a signed presenter-show. The Uber is a signed presenter-show and fails. The blind test's *ONE OF US* is song-led, and music is parked. §6.2 is voice-led and stage-show, which `voiceLedRequires` forbids. The default mode has never been made, and the only worked example is outside the mode system. A style whose default cannot be shot is not yet a style; it is a target.

**Verdict on Q2:** the Uber is refused, so the *gap* is closed; the *rule* is not enforceable until "stage shot" and "detail shot" are defined, the five checks are in the acceptance test, and the reference is classified. This is a **PARTIAL**.

---

## 3. Q3 — The visual doll: the reference's silhouette, or the library worker?

**The band is now the reference's hero doll. The table and the library are still the worker's.** That is the honest split.

I re-measured the six crops. Numbers are rough (±1–2 points) because the crops are 720 px JPEGs, but the *definition* problem is not a measurement error:

| Crop | Figure | Head + hair | Face plate | Ornament diameter | Heads (hair / face plate) |
|---|---|---|---|---|---|
| `desk-diorama` (full doll on a notebook) | ~215 px | 23% | ~17% | ~44% | 4.3 / 5.8 |
| `chorus-stage` (star) | ~655 px | 32% | 20% | 51% | 3.1 / 5.0 |
| `chorus-stage` (chorus) | ~336 px | 30% | 21% | 34% | 3.4 / 4.8 |
| `throne-orbit` | cropped | — | — | ~380 px ring | — |

The reference is a **family, not one doll**, and the answer depends on which head you measure: **3.1–4.3 heads** if the head is the hair mass (23%, 30%, 32% of height), **4.8–5.8** if it is the face plate (17%, 20%, 21%). v1.3's two bands are each a middle ground between those definitions:

- `visualHeadToBody 4.2–5.2` catches the desk-diorama **hair** (4.3) and the star **face** (5.0); it misses the chorus hair (3.4) and the desk face (5.8). It only works if you switch definitions per figure.
- `headPct .22–.28` catches the desk hair (23%) and misses the chorus hair (30%), the star hair (32%) and every face plate (17–21%).
- So the two bands agree only on the desk doll, by hair (23% head, 4.3 heads). They are not two views of one head; they are two different heads.
- At a 25% head the figure is 4.0 heads: it passes `headPct` and fails `visualHeadToBody`. At a 20% head it is 5.0 heads: it passes the visual band and fails `headPct`. The bands overlap only at 4.2–4.55.
- `headOrnamentPct .22–.28` and `headPct .22–.28` are the same numbers for different quantities; the ornament is 45–65% in diameter (and the reference's halo is circular), so "head + ornament" cannot also be 22–28% of height.
- **The 45–65% ornament is the soloist's halo, not the chorus's.** The star's ring is 51%; the three chorus dancers' petals are ~34% of their height. If the band is invariant for every performer, the reference's own chorus fails it. Scope it to the hero/star tier (or lower the floor to 30% for backing).
- The JSON note "head + ornament" on `visualHeadToBody` is wrong: head + ornament is 1.5–2.2 heads. It should read **head + hair**.

**The fix is to name the head.** The measured face plates are 17–21%, so take the face plate as the head: `headPct [.17,.22]`, and the band that follows is `visualHeadToBody [4.5,5.9]` (star 5.0, chorus 4.8, desk 5.8 — one band, all three figures). Keep the hair mass as a separate silhouette field, `headMassPct [.23,.32]`, not a ratio. Widen the ornament to `headOrnamentDiameterPct [.34,.65]`, which covers the star 51, the desk 44 and the chorus 34; if 45–65 is kept, it is a hero-tier band, not a cast band.

**The rest of the table is still the library's doll.** `shoulderPct [.18,.22]`, `handPct [.013,.037]`, `torsoPct [.30,.35]`, `legsPct [.35,.40]`, and the performer test's point 1 (`580–760 units, 7–7.5 heads, two-bone limbs`). The only library characters are **`worker@0.1.0` (Kiran)** and **`supervisor@0.1.0` (Vaz)**; neither file has an `archetype`, a `stageRole`, a `faceStyle` or a silhouette. `src/engine/style-identity.ts` reads cast count, anchors, body, poses, expressions, the staged ratio and five luma bands — not the archetype, the stage role, the face or the silhouette. So the identity now *measures* the reference's doll on the frame and *builds* the worker in the library; nothing reconciles the two.

**Correction to my v3, on the record.** I said the reference's shoulder was 12–17% and the hand 0–2%. On re-measuring `chorus-stage.jpg` the shoulder is ~28–31% of figure height and the hand cap is ~4%. So the spec's `handPct [.013,.037]` is close and my 0–2% was wrong; the spec's `shoulderPct [.18,.22]` is **below** the reference's 28–31%, so that band is too narrow (my 12–17% was lower still). I withdraw that part of v3. The doll findings above do not depend on it.

**Answer to Q3:** 4.2–5.2 and 45–65% now describe the reference's **hero/desk doll** (the `desk-diorama` full figure is 23% head + hair and 4.3 heads by hair, the point where both new bands pass), but not the family: the chorus is 3.4 heads by hair and 34% ornament. The head is defined twice, the table still describes Kiran, and the library still says `worker`. **Described, not built.**

---

## 4. Q4 — Does the tone section have enforceable beats, and does §6.2 demonstrate them?

**The section has the right beats. It does not have a check. §6.2 demonstrates two of eight.**

The eight beats are correct and they are the channel's, not a mood board. The reference maps to all eight: the title/sunflower (bright), "I SEE SPARKS"/P(DOOM) (first threat), "PLEASE DON'T" (cute-in-danger), the train/OPTIMIZING button (comic escalation), "LIES LIES LIES"/the dark beam (dark act), the desert "there you are" (tender beat), the finale (resolve), the desk pullback (button). That is the best content addition in v1.3.

Enforceability is still missing: no shot ids, no `why`, no `beatsMin: 8`, no field for the dark act, no poison/contradiction/cute-in-danger/prop measures, and `measure: human/review`. A reviewer can tick the eight; a check cannot refuse a film that ignores six.

**§6.2, beat by beat:**

| # | Beat | §6.2 | Why |
|---|---|---|---|
| 1 | bright surface | kraft → marigold stage | **pass** |
| 2 | first threat | none | the platform's cut is never staged as a threat |
| 3 | cute-in-danger | none | the duo is never in danger |
| 4 | comic escalation | none | the split is the product, not a threat that grows |
| 5 | dark act | cobalt | the one blue act is a product colour, not "the palette tells the truth" |
| 6 | tender beat | none | no quiet shot, no line, no alone |
| 7 | resolve or loop | cream → arrival | **partial** |
| 8 | button | the coin splits | a signature shot, not a joke or a held wink |

**2/8.** And the table has no tone row at all: the 12 rows are Performance, Story, Set family, Field script, Cast, Motifs, Camera, Edit, Text, Transitions, Sound, Signature. The worked example a designer copies is still a business model with a stage, no threat and no flinch.

The missing row is exactly my v3 list, and it is still the right content: **the platform's cut is the threat; the coin's acid edge is the poison; the driver's one free ride is the tender beat; the night city is the dark act; "FAIR FARE" on the maw is the contradiction sticker.** Write those five into §6.2 and the example moves from 2/8 to at least 6/8.

**Answer to Q4:** the beats exist and are right; they are not enforceable (no ids, human measure); §6.2 demonstrates 2/8 and has no tone row. **PARTIAL.**

---

## 5. Q5 — New and surviving contradictions

| # | Contradiction | Where | Fix |
|---|---|---|---|
| 1 | **"Ten axes"** in the one-page answer vs 12 everywhere else | §0 line 18 vs lines 38–51, §2 axis 32, §3.24, JSON `requiredDifferences` (12) | one word: twelve |
| 2 | **9 words vs >8** | `maxWordsSubtitle 9` (JSON 1894), `subtitleBox.maxWords 9` (1829) vs `lyricWall ">8 words"` (1874), `maxWords 8` (1847), §0 axis 11, §2 axis 24 | scope the 9 to song-led, or 8 everywhere |
| 3 | **Two head definitions** | `headPct [.22,.28]` = 3.6–4.5 heads vs `visualHeadToBody [4.2,5.2]` = 19.2–23.8%; `headOrnamentPct` duplicates `headPct`; JSON note "head + ornament"; the two bands pass different figures | name the head: face plate `headPct [.17,.22]`, `visualHeadToBody [4.5,5.9]`, `headMassPct [.23,.32]`, ornament `[.34,.65]` or hero-scoped |
| 4 | **§6.2 is an illegal mode** | stage-show + voice-led (1430, 1440) vs `sound.voiceLedRequires: presenter-show` (1930) and stage-show's "must still have … a song" (1194) | make §6.2 a presenter-show (signed) or add a voice-led stage-show to `sound` |
| 5 | **The show test is two tests** | table 1217 vs prose 1219–1221; the prose requires a song | one test: "remove the narration and labels — is the story legible from what the performers do?" |
| 6 | **Three opening menus** | §3.23 "object birth, mid-action, question, world reveal" (1003) vs §3.24 "performance object, mid-action, question, title object" (1041) vs JSON `opening.types` | delete `world reveal` |
| 7 | **"Never black"** | first-frame row 1002 vs the measured 91% dark field (A/I) | "a dark field is allowed; a black frame with only a logo is not" |
| 8 | **Frame story is song-only in prose, all-film in JSON** | heading 1013 vs JSON `opening` | make it all films; the title object can be the desk/mic/ledger |
| 9 | **7 points vs 6/6** | seven-point test 460–472 vs §5.1 line 1328; points 2 and 7 duplicate stage role; MD point 2 `lead` vs JSON `star` | one count, one enum |
| 10 | **11 vs 12 pose keys** | §2 axis 12 and §3.11 say 11; JSON `poseKeys` has 12 | 12, or remove one |
| 11 | **`basis` outside the enum** | `product` (variation), `reference` (hud), `code/film`, `reference-comparison` vs §1.1 `code|film|crops|target|proposal|format` | map or extend the enum |
| 12 | **The reference fails the stage band** | `stageShareMin .60`, `basis: film`, `modeScopes.stage-show: I for a song film` vs the reference (song-led, presenter-show) | `basis: target` + `reference.mode` or a fourth mode |
| 13 | **The acceptance test omits v1.3's block** | §5.5 / `checks.acceptance` name only the v1.0 gaps | add stage, presence, detail, giant object, doll, tone |
| 14 | **`stageShareMin` note vs value** | JSON 1020: value .60, note "1/act for a 30 s presenter show"; §3.30 line 1204 | one number per mode |
| 15 | **9:16 units** | `subtitleBand9x16` is a point (x .12, y .34), not the pack's box (x .1, y .34, w .8, h .07); "69 px = 14 px at 390" is true only at 1920 wide (24.9 px at 1080; 14 px at 390 = 38.8 px at 1080) | name the canvas, use the box |
| 16 | **"Beat" has four meanings** | story 5–9 beats, tone 8, camera 6 roles (hook/setup/escalate/turn/release/button), `formationChangeBeats` 2–4 *musical* beats; no `bpm` anywhere | `performance.bpm: 88`, `movement.beatLocked: true`, `movement.flowerPulse: .045` |
| 17 | **84–90 words is still optimistic** | 90 at 190 wpm = 28.4 s; with a 1 s first word the last word lands at 29.4 s — 0.6 s before the end, not 1.5. The max that satisfies both is **87**; at 180 wpm it is **82**. §6.2's 88 at 182 = 29.0 s = zero tail | 82–87, or relax a rule; §6.2 becomes 83 |
| 18 | **30/45/60 arithmetic** | shot counts/cuts-per-minute close (10–13/18–24; 14–18/17–23; 18–23/17–22; medians fit). The **distribution** rows do not partition: at 30 s the floors sum to .80 and the ceilings to 1.20, and `overFive [.05,.15]` is half a shot at 10 shots | keep as declared targets, not a check |

**The counts that are now right, and should be kept:** 12 axes in §3.24/JSON/§2; 15 joints with knees; 8 poses/14 expressions; 1–2 principals + 0–5 chorus, total 7; 30/45/60 shot counts; the 84–90 band is closer than the 90–95 the doc itself rejects; 9:16 at .34; `filmBands` vs `tones`.

---

## 6. Q6 — Score, and the P0s that remain

**8.0 / 10 for channel fidelity.** Identity completeness 8.5.

The +0.5 on v1.2 is earned by: the four stage numbers and the signed modes; the visual doll (4.2–5.2 and 45–65% for the hero; the desk full figure is 4.3 heads by hair, so the band exists and sits in the reference's region); knees, thumb, creature; the eight tone beats, which describe the real film; the 9:16 band moved to `T`; the 30/45/60 arithmetic; and §6.2's cast count.

The 1.5 withheld is for five things, and none of them is a new section.

### P0-A — The worked example is not a legal film

`§6.2` declares **stage-show + voice-led**; `sound.voiceLedRequires: presenter-show` and stage-show's "must still have … a song" forbid it. It also has **no giant object**, **no entrance/exit/audience/spotlight**, a "3 paper-coin chorus" that is props (the `chorus` rule requires an identical **rig**), and **2/8 tone beats**. A designer following the only worked example produces a film the spec refuses on the mode, the giant object and the tone. Fix: make §6.2 a signed **presenter-show** with an MC host and a stage in every act, **or** add a voice-led stage-show (a spoken/chanted number) to `sound`; add the giant object, the entrance/exit, and the tone row.

### P0-B — The reference has no mode, and the acceptance test does not test the block

The reference is song-led and mostly presenter (`blind-test-v2.md`); `stageShareMin .60` + `stage-show: I for a song film` makes the channel's own film fail its identity; `modeScopes` has no song-led presenter mode; §0.1 says a band the reference fails is wrong. §5.5 and `checks.acceptance` do not name stage, presence, detail, giant object, the doll or tone, so a rebuilt Uber can pass the acceptance test while remaining a signed presenter-show. Fix: `stageShareMin.basis: target` + `reference.mode: presenter-show` (or a fourth `song-presenter` mode), and add the six new checks to §5.5.

### P0-C — The doll has two heads, and the library is still the worker

`headPct [.22,.28]` (3.6–4.5 heads) contradicts `visualHeadToBody [4.2,5.2]` (19.2–23.8%); `headOrnamentPct` duplicates `headPct`; the JSON note says head + ornament; and the two bands pass different members of the reference family (the head band the desk doll, the visual band the star and chorus). The performer test's point 1 still builds 580–760 units / 7–7.5 heads, and the library is `worker@0.1.0` / `supervisor@0.1.0` with no `archetype`, `stageRole`, `faceStyle` or silhouette. Fix: name the head (face plate) — `headPct [.17,.22]`, `visualHeadToBody [4.5,5.9]`, `headMassPct [.23,.32]`, `headOrnamentDiameterPct [.34,.65]` (or scope 45–65 to the hero); move 580–760 / 7–7.5 to "rig construction" and re-proportion Kiran or declare the library non-compliant; add `archetype`/`stageRole` to `poses.json` and read them in `library:check`.

### P0-D — Nine words is still a lyric wall

`maxWordsSubtitle: 9` is unscoped against `lyricWall: >8 words of narrative copy`. A nine-word narrated subtitle trips the wall the same document permits. Fix: `maxWordsSubtitle: 9, scope: song-led` and `8` for voice-led, or 8 everywhere.

### P0-E — The performer has no beat clock

`formationChangeBeats [2,4]` and "a pose/formation change every 2–4 beats" have no `bpm`. `A-engine.md` says 88; `B-cast-sets.md` gives `1 + .045·bpmPulse(t,4)`. Three revisions have omitted it. Fix: `performance.bpm: 88`, `movement.beatLocked: true`, `movement.flowerPulse: .045`, and measure `formationChangeBeats` against `bpm`. (This is the motion critic's P0-5; I am carrying it because a K-pop performer off the beat is the channel's most visible failure.)

---

## 7. What v1.3 got right (keep)

- The four stage numbers and the signed-mode split. The Uber is now refused; that is the point of the revision.
- `visualHeadToBody 4.2–5.2` and the 45–65% ornament: the hero doll is named at last, even if the family and the chorus need the wider band.
- Knees, thumb-optional, the creature branch.
- The eight tone beats, in order, describing the real film.
- The 9:16 band moved to `T`; the 30/45/60 arithmetic; the 84–90 correction (still 3 high, but the direction is right).
- §6.2's two principals; the 12-axis count in §3.24; `filmBands` replacing `tones`.
- The blind test v2's finding stands: the **show test** is the field that changed the film. Do not lose it when it is rewritten as one test.

---

## 8. Sign-off

**SIGN: NO. 8.0 / 10.**

The re-sign test is the same, and it is now close enough to run on one page:

> Give v1.3 to a designer who has never seen the reference. Ask for a new performer and a new 30 s film. The result must be unmistakably this channel without a sunflower, a banner, a lamp, a desk, a network map, a business deck, or Sol's face.

A designer following v1.3 will make a better film than v1.2: a stage, a star, a giant coin, a doll in the reference's proportion, eight tone beats, a centre-framed performer, a 60% stage share. They will also copy §6.2 and make a voice-led stage-show that `voiceLedRequires` forbids; draw a 22–28% head and get a 3.6–4.5-head figure; and store ten variation axes from the one-page answer. That is why this is a no, and why it is a no with a short list: a handful of fields, one example, one clock.

Sign v1.4 when §6.2 is a legal film that would make someone laugh and then flinch, the reference has a mode, the doll has one head, and the eight beats have shot ids.
