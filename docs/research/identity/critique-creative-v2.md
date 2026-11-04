# Creative critique v2 — Paper K-pop identity specification v1.1

**Critic:** creative director / designer (second pass)
**Date:** 4 November 2026
**Subject:** `docs/research/identity/KPOP-IDENTITY.md` and `kpop-identity.proposed.json` v1.1
**Previous:** `critique-creative.md` (v1.0, 6.5/10, SIGN NO)
**Evidence used:** v1.1 prose and JSON, `A-engine.md`, `B-cast-sets.md`, `I-frames.md`, the six reference crops, `out/claude-pop.mp4`, `build/uber-model/final-sheet.png`, `formats/paper-kpop-shorts/format.json`, `styles/paper-kpop/tokens.json`.

**Verdict: NOT SIGNED — 7.0 / 10.**
Identity completeness **7/10**; channel fidelity **6.5/10**.

**One line:** v1.1 adds the three sections that were missing — scope, tone, performance — and then does not make any of them bite. The scope legend is not applied, the tone is contradicted by the only worked example, and the performer test passes Kiran and fails Mira. The document is better organised and no closer to being a channel.

---

## 1. The P0s, checked against the text

**0 of 8 closed. 6 partial. 2 not fixed in substance.** That is the headline.

| P0 (v1.0) | v1.1 | What actually landed | Where it still fails |
|---|---|---|---|
| **P0-1** scope model | **PARTIAL** | `R/T/I/F/V/X` table in §1.1 and JSON `scopes`; `referenceValues` block; `envelope.frame`, `durationFormats`, `sound.song`, `palette.maxRolesShort`, `edit.formats` re-scoped | Mixed scopes survive (`I/T`, `I/F`, `I/R` in §2 axes 18/24/28); the subtitle x/y is still `I`; `edit.distribution` is still `I`; no "a field in the wrong layer is a contract error" rule; no scope check |
| **P0-2** tone | **PARTIAL** | §3.26 and JSON `tone` — mode, surface, subject, character, violence, cynicism, tender beat, poison accent, ending | `darkAct`, `misbehavingProp`, `contradictionSticker`, `cuteInDanger`, `turn`, and a sweet/sinister beat pairing are absent; song-led is still not the default; §6.2 still teaches the explainer |
| **P0-3** performer | **PARTIAL** | §3.9 names the cast family (Sol, Mira, Petals, Gato, creatures); skin and hair are 2–3 values `F`; "petal halo **behind** the head" is stated for Sol | The six-point test is construction, not performance; it passes a worker and fails Mira; face/hair/foot are still Sol's; no knees; no ornament span/depth |
| **P0-4** bands | **PARTIAL** | `subjectArea` removed from JSON; §3.6 says "do not use subject area as a band"; blue share declared film-wide; p10 edge; short cast total 7 | No `aggregation` anywhere; width still body-only; feet still 1000–1012; motif and role counts unchanged; distribution still fractional; camera shares unchanged; `paperArea >=60%` still rejects the ink acts |
| **P0-5** light/motion | **PARTIAL** | §3.4 flat-print model, `light.paperShadow` renamed, no cast shadow on field/figure; one paper event **per act**, not per shot | **No BPM, no beat-locked body, no flower pulse.** Fold/tear/curl are still default events. Squash range unchanged |
| **P0-6** text/opening | **NOT FIXED** | Subtitle *size* is now `T`; a 9:16 size note | Band geometry x84/y992 still `I`; `maxLines: 2`; `LIES ×12` still a lyric wall; no text mode; no performer-focal rule; `world-reveal` still endorsed; "never black" still in the table; the new prose **explicitly allows a phone map opener** |
| **P0-7** variation | **PARTIAL** | Three-film history (§3.24 "History", `variation.historyFilms: 3`); "refuses a fourth use" | 10/12/12/10 axis counts in four places; no per-film report; no signature `why`/`differsFrom`; **no blind test**; the fixed band and face still repeat |
| **P0-8** motifs | **PARTIAL** | Cast ornament exempt from the 40% cap (§3.13, `castOrnamentExempt`); prose sentence separating devices from objects; `semanticObjectMin: 1` | One mixed 13-item library with no `kind`; 1 of 3–5 semantic is still motif salad; no `arc`; no `scale`; 2 vs 3 uses contradiction |

### P0-1 — the scope legend is a caption, not a contract

The legend is right (§1.1, lines 86–96). It is also not applied to the file it introduces.

- §2's at-a-glance still prints `I/T` (axis 24), `I/F` (18), `I/R` (28). §1.1 says a field has one scope. These rows have two.
- §3.19 still marks the subtitle band `x / y | 84 / 992 | px | I` (line 836). That is the format's geometry, which P0-1 itself named as `T`.
- JSON `edit.distribution` is block-scope `I` (line 279), while §3.15 calls the same numbers the 54-card reference. A validator reading the JSON will hold a 10-shot film to a 54-shot distribution.
- JSON `composition.castFeetY` and `sets.feetPx` remain `I`; `sets.floor` (17 radials, 5 horizontals, torn lip) remains global, not the stage family's value.
- `basis` has escaped its own enum. §4.1 declares `code | film | crops | target | proposal | format`; the JSON uses `reference-comparison` (line 258), `product` (402), `reference` (414), and `code/film` (many). A field cannot be validated against a vocabulary that the file does not use.
- The sentence P0-1 asked for — "the style owns the grammar; the format owns the envelope; the film owns the instance; the reference owns the measurement; a field in the wrong layer is a contract error" — is not in the document.

**Verdict: PARTIAL.** The layer model exists; the fields have not moved.

### P0-2 — tone is written, then contradicted by the example

§3.26 is a good paragraph. It is not a rule. Every value is a prose string (`surface`, `subject`, `character`, `violence`, `cynicism`, `ending`) with no measure, while §5.1 says `Tone | review | human | none`. §1.1 says an `I` can be refused by a check. Tone cannot. By the spec's own definition it is not an invariant; it is a note.

The P0 was "it will produce a warm business explainer". v1.1 still produces one, because the only worked example is one:

- §6.2 line 1321: `Story | rider, driver, platform, split, arrival | **a business model as a paper diagram**`.
- §6.2 line 1330: `Sound | **voice-led**, 5 lines, 91 words, 182 wpm | the narration is the clock`.
- No threat, no poison accent, no contradiction sticker, no tender beat, no dark act, no cute-in-danger shot. The example fails §3.26 on every row and is still labelled "Why it is the channel".

That is not a stale paragraph; it is the instruction a designer will follow. The prose says sweet-sinister; the worked example says business deck. The example wins.

**Over-correction, second direction.** `tone.subject: "a real threat, a bad idea, a doom, a joke about power"` is the reference film's *content*, not the channel's register. Paper Studio also sells Paper Vows. A wedding film cannot have "a doom". The tone block fixes the attitude by importing the reference's subject, which is the same error as fixing the sunflower.

**Verdict: PARTIAL, and the partial is in the wrong half.** The missing pieces are the *testable beats* (`darkAct`, `contradictionSticker`, `cuteInDanger`, `misbehavingProp`), not more adjectives.

### P0-3 — the performer test still passes the worker

§3.9's six points are a real addition. Read them as a designer would:

1. Construction — brads, 580–760 units, 7–7.5 heads.
2. Stage role — "a costume with a performer's silhouette (jacket/skirt, catsuit, coat, **suit**, stage dress), not a generic office uniform."
3. Face — 10 eyes × 7 mouths.
4. Head — three-layer stack and **an ornament slot**.
5. Performance — 8+ poses, 14+ expressions.
6. Scale — can hold the tiers.

Kiran (`library/characters/kiran/poses.json`, rig `worker@0.1.0`, shirt + trousers, no ornament) passes 1, 3, 5 and 6. He passes 2 because **a suit is in the allowed list** — the parenthetical that is supposed to exclude him includes his costume. He passes 4 because the requirement is a *slot*, not an ornament, and the slot is empty by construction. So the sentence on line 461 — "A worker with 8 poses and 14 expressions passes 1, 3, 5 and 6, but fails 2 and 4" — is **false under the spec's own wording**. The test is a construction test with a stage label, which is exactly what the P0 said.

The test also **excludes the reference's own cast**. Mira has "no petal/halo/crown accessories" (`B-cast-sets.md` §2.6, line 215), so she fails point 4. The creatures (CLIP, SHOGGOTH, BASILISK, CHINCHILLA) are listed in §3.9 as the cast family, and they fail points 1 and 2 (7–7.5 heads; a stage costume). A 6/6 *iff* test that rejects Mira and the creatures while accepting a worker is measuring the wrong thing.

What is missing is the performance half I specified, and none of it is in v1.1: `performanceRole`, `performancePoses` from mic/point/heart/bow/wave/danceHit/present, `performanceAction` per performer shot, `makeup` (≥2 of lash/eyeshadow/lip/blush), `gaze` at audience/target, stage-or-metaphor-of-stage context. The reference idol is *singing* in `chorus-stage.jpg`; the spec can still draw a standing figure holding a briefcase and call it a performer.

The construction is still Sol's:

- `cast.face` — "eyes at +/-17.5, brows, 1 px nose, mouth y 32" in **px**, `I` (§3.9 line 481). No ratio bands. Mira's face is 36×42 against Sol's 41×47 and cannot be expressed.
- `cast.hair` — "3 layers: 4 long strands, back mass, bangs", `I` (line 480). That is Sol's bob, not a hair vocabulary.
- `cast.foot` — "boot/sneaker, platform sole, **gold bar**", `I` (line 477). Mira's red-stripe sneaker fails.
- `cast.joints` — 13 names, still **no `kneeL` / `kneeR`** (JSON 165; §3.9 line 473). `B-cast-sets.md` §2.5 has leg brads at **hip 4.4, knee 3.6**; the rig bends a knee the identity does not name. A character built from this JSON cannot bend a leg.

**Verdict: PARTIAL.** The cast is no longer one doll (skin/hair `F`, family acknowledged); the archetype is still a label.

### P0-4 — the bands were widened, not re-based

The P0 asked for an `aggregation` on every band. v1.1 has no `aggregation` field anywhere. §3.3's shares table now has a "Band" column, but nothing says whether `.40-.90` is a film median, a per-shot share or a p90. A checker author still chooses. This is the one line that would have made the whole table implementable, and it is absent.

The specific bands:

- **`subjectWidth` 4.0–14.2%** is still the body, not the silhouette (JSON 122). No `subjectBox`, no `ornamentSpan`. §8.2 item 4 still defines the bbox as "min/max of the rig anchors" — and the rig anchors are joints, so the petal halo, hair and skirt are **outside** the box. The identity will measure the body and miss the thing that makes the character a paper doll.
- **`castFeetY` 1000–1012** is still `I` (JSON 126; §3.7). The reference's own gym shot stands SOL at **862** (`B-cast-sets.md` §5, line 385), and the spec's own placement law says backing singers are at **956–1000** (§3.7 line 401). Three different feet values in one document; the band rejects two of them.
- **`floorLine` .65–.88** still conflates horizon, ground and feet (JSON 125), while `field.horizonPx` is 780–900 (JSON 143) = .72–.83. Two floors. The desk is at 726, the museum 842, the treadmill 862; the split P0-4 asked for is not there.
- **`maxRolesShort: 5`** (JSON 70) and §3.3 rule 5 "Max 5 roles in a 30-60 s film". The pack's palette has **six** roles (paper, ink, red, blue, acid, accent). A short that uses the poison accent (acid or pink) *and* red *and* kraft runs out of budget, and the tone section requires the poison. The cap fights §3.26.
- **`motifs.perFilm: [3, 5]`, `uses: [2, 5]`** (JSON 233–234). In a 9–12 shot film, five motifs × two uses is ten motif-shots, i.e. a motif in every shot. That is the "motif salad" the P0 named, still permitted. §0 item 5 and §3.13 both still say 3–5.
- **`edit.distribution`** (JSON 279) is still 5 fractional bins for a 10-shot film. For 54 cards the bins sum to 100%; as *ranges* the v1.1 values sum to **0.88–1.15**. The reference row is 4 + 33 + 15 + 41 + 7 = 100. The bands do not have to add up to one, so a film can satisfy every bin and leave 12% of its shots unaccounted.
- **`framingMix`** (JSON 130): wide `.25-.40`, medium `.10-.25`, close `.40-.55`, extreme `0-.10` — sum **.75–1.30**. Same error. And it is the wrong mix: `B-cast-sets.md` §4.2 says the identity's "wide" **is** a full-body figure at 65–80% and "anything smaller stops being Paper K-pop". The spec calls 65–80% "close/hero" and gives 25–40% of shots to 13–35% figures. A designer following the table draws the punctuation and calls it the composition.
- **`paperArea >=60%`** is still in §5.1 (line 1217). The reference is **27.3% ink, 20 of 54 ink fields**. The band rejects the film it is calibrated to.
- **`subjectHeight` p50 .552** is still `I` (JSON 121); no `F .40-.70`, no max .98. `negativeSpace .97` is still `I` (JSON 128); §0 invariant 6 still says "**3% of frame area**"; §2 axis 7 still says "One focal shape; subject centred; 97% negative space". §3.6's new sentence "Do not use subject area as a band" contradicts all three. The Uber film passes "one focal shape", "97% negative space" and "3% area". Those three are the Uber recipe, and they are still in the one-page table a designer reads.
- **Camera shares** `.30-.45 / .15-.25 / .10-.20 / .05-.15 / .05-.15` are still block-scope `I` (JSON 248–252). For 10 shots: 3 pushes, 1.5 tracks, 1.5 orbits. The fractions are not implementable and there is no `maxMoveShare`. A 4-move 10-shot film with 7 pushes passes `distinctMoves: [4,8]`.
- **`textArea` .02-.06** (JSON 129) still has no small/display split. A 376 px `FOOM` is rejected by the only text-area band in the file.

**Verdict: PARTIAL.** JSON scopes improved; the arithmetic and the perceptual bands did not.

### P0-5 — the light is fixed; the beat is gone

This is the cleanest fix in v1.1 and I want to say so. §3.4 is now "flat print, not a lit 3D scene", `light.paperShadow` is renamed and restricted to cards/props/type, and the per-element table is unambiguous. The "hard top-left key" is gone. That is exactly right.

The paper event is now **one per act** (§3.16, JSON `paperEventPerAct: 1`, `F`), not one per shot. Also right.

What is still missing is the thing that makes it K-pop:

- **No BPM.** `A-engine.md` line 309: `BPM | 88 | [I] | core.js:47–48`. `B-cast-sets.md` line 131: the flower pulse is `1 + .045·bpmPulse(t, 4)`. v1.1 mentions 88 BPM only as a reference fact in §3.15 (cut grid) and §5.3. There is no `movement.bpm`, no beat-locked vertical, no `flowerPulse`, no "the body is on the beat". §3.11's movement table is 24 rows of amplitudes and easings with no clock. A performer who bobs at 12 Hz and is not on the beat is not a K-pop performer; it is a paper doll with a boil.
- **Fold/tear/curl are still default.** §3.16: "a drawn fold, tear, curl, flutter, stack, peel or stamp"; §3.20: "a hit folds, tears, curls or flutters". `A-engine.md` line 331 and `B-cast-sets.md` §3.5 are explicit: the rig has no fold/curl/bend/collision; the source's material events are rare and authored. The per-act change removes the checklist; it does not remove the craft-video vocabulary. Fold/tear/curl should be a max-1-film exception behind a story reason, not a peer of `pop`/`slam`/`snap`.
- **Squash** is still `.96-1.04` (`V`). Moving it from `I` to `V` is the right call; the range is still twice what an impact needs.

**Verdict: PARTIAL.** Light: fixed. Motion: the checklist is gone, the beat is still absent.

### P0-6 — the band is still the band; "never black" survived by redefining black

The only real move is the size: `type.subtitle.size` is now `T` (31 at 16:9, 16 at 9:16). Everything else the P0 named is unchanged:

- **Geometry.** `subtitleBox.x/y = 84/992` is still `I` (JSON 325; §3.19 line 836), with the `LYRIC` label, the acid active word and the progress hairline still `I`. Every film still gets the same bottom-left band. In 9:16 at 1080×1920, y 992 is **51.7% of height** — the middle of the frame. The pack's own 9:16 anchor is `aspectBoxes.9:16.subtitle.y = 0.34` (`styles/paper-kpop/tokens.json`). The identity contradicts the pack it extends.
- **`maxLines: 2`** (JSON 327; §3.19 line 855). No display/body/subtitle split. The reference's own hero stack is three lines — `I SEE / SPARKS / OF AGI` (`B-cast-sets.md` shot 2, line 506). The spec still rejects the reference's poster.
- **`LIES ×12` is still a lyric wall.** §3.19 line 866 and §3.25 #11 ban `>8 words`. No `displayPattern`, no `noReading`, no repeated-word exemption.
- **The lyric wall contradicts the subtitle.** `maxWords: 8` and `lyricWall: >8 words` sit beside a subtitle that allows **9** words (§3.19 line 847; JSON `subtitleBox.maxWords: 9`). A 9-word subtitle is a lyric wall by the rule two lines below it.
- **No text mode, no layout memory.** Behaviours exist (`stack, stamp, slide, fold, eaten, scatter, drop`), modes do not. There is no `lyric-band | poster | diegetic`, no "3 layouts per film", and no "no repeated layout from the last 3 films" as a layout concept.
- **No performer-focal rule.** §3.6 still says "One focal shape per frame. The subject, a prop, **or a type block** - one, not three." The Uber film's type is the focal shape and this rule blesses it. The identity never says the *performer* is the focal shape in ≥60% of shots. That was the single clearest P0-6 fix and it is absent.
- **`world-reveal` is still an opening type** in three places (§3.23 line 972, §3.24 line 997, JSON 393), and the new prose goes further: "A new film may open on a **phone map**, a hand, a door, a coin, a question" (line 977). The Uber film opens on a network map. v1.1 now **explicitly authorises the exact Uber opener** while claiming to fix the diagram trap.
- **"Never black" is still in the table** (line 970), and the prose resolves the contradiction by asserting something false: "The source's cold open is **not black**; it is a lit paper event on a dark field" (line 977). `B-cast-sets.md` shot 1 calls it a "**black void** + light seam"; `I-frames.md` shot 00 measures field **0.91**, luma **37.8**. The first frame is a near-black void with a petal ring and a title. The reference fails the invariant, and v1.1 keeps the invariant by redefining the evidence. That is the opposite of the section's own rule that "if a band fails the reference film, the band is wrong."

**Verdict: NOT FIXED.** One scope moved; the instance is still fixed, the grammar is still rejected, and the Uber opener is now allowed by name.

### P0-7 — memory added, memory not reported

Three films is in (§3.24 "History"; JSON `historyFilms: 3`). Good. But:

- **Four axis counts.** §3.24's table has **12** rows (Structure, Set, Field, Cast, Motifs, Camera, Text, Transitions, Opening, Closing, Sound, Signature). JSON `requiredDifferences` has **10** (opening and closing merged, sound dropped). §0 says "**ten** things". §2 axis 31 says "**10** required differences; **12** invariants". My P1-22 asked for one count; v1.1 shipped four.
- **No report.** §3.24 stores a history file and refuses a fourth use; it does not require a per-film `variation.json` with the previous three values and a director signature, and `film:review` does not refuse a missing or identical axis.
- **No signature `why`.** `signatureShot: 1` (JSON 408) with no `why` and no `differsFrom`. The row still says "unlike any shot in the **last film**" — one film, not three.
- **No blind test.** §6.3 is still "a person must answer"; the ten questions are not blind. My v1 re-sign test was exactly this, and it is the one thing that would tell you whether the spec is a channel or a template. It is not in v1.1.
- **The instance still repeats.** The subtitle band, Sol's face, Sol's hair and Sol's foot are still `I`, so three films that differ on all ten axes still share the same bottom-left band and the same doll. P0-7 asked for the instance to be removed; P0-3/P0-6 did not remove it.

**Over-correction.** "`variation:check` refuses a fourth use of the same value on any axis" is a rotation, not a difference. With four opening types, four closings and two sound modes, a film can be forced off a good choice to satisfy a counter — and the sentence is ambiguous: with only three films stored, a "fourth use" cannot be detected unless the counter is lifetime, which the spec does not say. The rule should be "differs from the last three", not "never four times".

**Verdict: PARTIAL.** The memory exists; the report, the blind test and the signature do not.

### P0-8 — the split is a sentence, not a schema

The cast-ornament exemption is fixed (§3.13 line 597; `castOrnamentExempt: true`). The 40% cap no longer fails the reference's own petal. That is a real fix.

The rest is prose:

- The library is still one 13-item list (JSON 232). There is no `kind: device | object`. `halftone` is called a formal device in the prose but is not in the library; `coin`, `phone`, `route` and `thread` are called semantic objects in the prose and are not in the library. The worked example's four motifs (`route line, coin, paper phone, fare stamp`) are still **none of them in the library**. That is the same tell as v1.0.
- `semanticObjectMin: 1` of 3–5 means two to four devices are still allowed. The P0 asked for at least **two** semantic objects with meaning and an arc. One is a token.
- No `motifs.arc` field. "At least one semantic object with a transformation arc" is a sentence; there is no `introduced / transformed / paid off` triple to check, and §5.1 still says `Motifs | score + probe | **none**`.
- No `motifs.scale`. The meter at 420 px and the paperclip at 20 px are both "a motif"; nothing says a motif must hold its declared scale, so a coin can be a giant coin in one shot and a speck in the next without that being a decision.
- **2 vs 3 uses.** `props.motifRecurrence: 3` (JSON 224) says a motif prop appears **at least 3** times; `motifs.uses: [2, 5]` (JSON 234) says **2–5**; §3.13 says 2–5. Three minima.

**Verdict: PARTIAL.** The exemption is fixed; the library is still the wrong shape and the arc is still a wish.

---

## 2. The re-check you asked for

### 2.1 Tone (§3.26, JSON `tone`)

The best-written new section and the least enforceable. It names the right register — "sweet-sinister", "the character is sincere; the world is the joke" — and then gives a human reviewer nothing to hold. Worse, the only worked example is a business explainer that fails every line of it. **The tone exists in the document and not in the channel.** See P0-2.

### 2.2 The performer test / archetype (§3.9)

A six-point test that a worker passes and Mira fails. It measures construction, not performance. The one sentence that would have made it real — "at least one performance action per performer shot" — is not there. **PARTIAL, and the partial is the wrong half.** See P0-3.

### 2.3 The scope system (R/T/I/F/V/X)

The legend is the single best structural change in v1.1. It is also not applied. Mixed scopes remain, the subtitle geometry remains `I`, the distribution remains `I`, and `basis` has four values outside its own enum. A scope system that cannot be validated is a legend. **PARTIAL.** See P0-1.

### 2.4 Field / placement bands

- Field: `fieldShare .18-.60` still has no aggregation; `fieldColoursPerFilm [3,5]` is **per act**, while §3.3 rule 1 says "per shot **or** per act" and §0 invariant 4 says "a different field colour per shot/act". The slash is the problem. A 9-shot film with 3 field colours repeats a field three times; my P0 asked for 8–10 in a 30 s. **NOT FIXED.**
- Placement: `centroidX .30-.75` in ≥80% is better than a hard range, but the JSON still has a bare range and no edge allowance. The reference has three edge portraits — shot 13 at x .88, shots 36 and 45 at .13/.14 (`I-frames.md` line 113) — and §3.6 calls them "two left-edge exceptions", which is both the wrong count and the wrong side. A re-make of the reference's own edge portrait fails. **NOT FIXED.**
- Feet/floor/horizon: three vocabularies, three bands, one of which (`1000–1012`) rejects the reference's gym shot and the spec's own backing line. **NOT FIXED.**

### 2.5 The variation grammar (10 axes + 3-film history)

The history is real; the grammar is still a review. Four counts (10/12/12/10), no report, no blind test, no signature reason. The one new rule — "no fourth use" — is a rotation that can force a worse film. **PARTIAL.** See P0-7.

### 2.6 Motif split (formal vs semantic)

The sentence is there; the schema is not. One library, no `kind`, no `arc`, no `scale`, and the worked example's motifs are still outside the library. **PARTIAL.** See P0-8.

### 2.7 Text / opening fixes

The size moved to `T`. Nothing else did. The band, `maxLines: 2`, the lyric wall, the 9-word contradiction, the missing text mode, the missing performer-focal rule, `world-reveal`, "never black" and the new "phone map" opener are all still there. **NOT FIXED.** See P0-6.

---

## 3. New contradictions and over-corrections introduced by v1.1

These are new or newly sharpened in v1.1, not inherited:

1. **Tone vs the worked example.** §3.26 is `I`; §6.2 — the only worked example — is a voice-led business diagram with no threat, no poison accent, no tender beat and no dark act, and is still labelled "Why it is the channel". The spec now contradicts itself in the section a designer will copy.
2. **The performer test's own example is false.** "A worker ... fails 2 and 4" (line 461) is not true: point 2 allows a **suit**, point 4 requires a **slot**, not an ornament. The test passes the worker it was written to reject, and rejects Mira (no ornament) and the creatures (7–7.5 heads, costume) that §3.9 lists as the family.
3. **"The source's cold open is not black" is false.** `B-cast-sets.md` calls shot 1 a "black void"; `I-frames.md` measures field .91 and luma 37.8. The `never black` invariant survives by mis-describing the evidence, against §0.1's own rule that a band failing the reference is wrong.
4. **The phone map is now an allowed opener** (line 977). That is the Uber film's first shot, named as acceptable. The diagram trap got worse, not better.
5. **Four variation counts** (10 / 12 / 12 / 10) and a "no fourth use" rotation that is not implementable with a three-film store.
6. **Two distributions that do not partition.** `framingMix` sums to .75–1.30 and `edit.distribution` to .88–1.15. A film can satisfy every bin and still not sum to 1.
7. **`basis` outside its enum.** `reference-comparison`, `product`, `reference`, `code/film` are not in `code | film | crops | target | proposal | format`. The schema's own vocabulary is broken in the file that declares it.
8. **2.5D promoted, not corrected.** §1.4 and axis 1 now make `2.5d-layered` the first identity parameter, with "5–11 flat paper layers". `A-engine.md` is explicit: there is **no layer list and no scene graph** (line 68), no per-layer parallax (line 266), and "2.5D" is not implemented (line 292). v1.1 turned a P1 wording note into a model that a renderer will build a scene graph from. The source is a painter's-algorithm 2D stage; say so.
9. **The bbox still excludes the silhouette.** §8.2 item 4 measures the character from rig anchors, which are joints — not petals, hair or skirt. The width band and the height band will describe a stick figure's skeleton, and the paper-doll silhouette (the thing that reads as the channel) is outside the measurement.
10. **The short role cap fights the tone.** `maxRolesShort: 5` vs the pack's six palette roles and §3.26's required poison accent. A short that adds the acid threat is over budget.
11. **A 9-word subtitle is a lyric wall.** `subtitleBox.maxWords: 9` vs `lyricWall: >8 words` in the same section.
12. **9:16 text lands mid-frame.** `subtitleBox.y = 992` is `I`; at 1080×1920 that is 51.7% height; the pack's own 9:16 subtitle anchor is 0.34. The identity contradicts the pack it extends.
13. **The one-page answer still omits tone.** §0's "Fixed grammar" list (line 17) does not include tone, and the twelve invariants do not include performance or tone. The summary a director reads still says "cast construction" and no attitude — the exact gap P0-2 named.

---

## 4. What v1.1 got right (credit where it is due)

- The scope legend, even unapplied, is the right model and the right vocabulary.
- The flat-print light model and the `paperShadow` rename are a complete, correct fix.
- One paper event **per act** is the right de-escalation.
- Skin and hair as 2–3 values `F`, and the cast family named, removes the "one light-skinned black-haired doll" failure.
- The cast-ornament motif exemption removes a rule that failed the reference.
- Three-film variation memory is the right structure.
- §0.1 "reference vs target", §3.29 "reference defects", and §5.5's Uber acceptance test are the best methodological additions in the document.
- The 9:16 size note, even incomplete, stops the 31 px television number from being copied into a phone frame.

None of these is a P0 closure, but four of them are load-bearing and should survive the next cut.

---

## 5. Blocking issues (the only ones that matter for the sign)

1. **The performer test does not test performance.** It passes a worker in a suit with an empty ornament slot, and fails Mira and the creatures. Add the performance half (role, 4+ performance poses, one action per performer shot, makeup, gaze, stage context) and make the ornament a **filled** slot with a span of 2.0–3.5× shoulder width **behind** the face. P0-3.
2. **Tone is unenforceable and contradicted.** Give it the five testable beats (sweet/sinister pairing, dark act, poison accent at the threat, contradiction sticker, cute-in-danger, tender beat) and rewrite §6.2 so the only worked example passes §3.26. P0-2.
3. **The text system is still a subtitle, not a poster.** Move the band geometry, `LYRIC`, acid word and hairline to the song format; split display/body/subtitle lines; allow the repeated-word plate; add `text.mode` and 3-layout memory; add **performer is the focal shape ≥60%**. P0-6.
4. **The opening still endorses the diagram.** Remove `world-reveal` or require a performer/motif in frame 1; ban a network/UI/map as the first frame; fix "never black" to "a dark field is allowed"; correct the false cold-open claim. P0-6.
5. **No aggregation, and the arithmetic does not partition.** Every band needs `film-median | per-shot-share | p90`; `framingMix` and `edit.distribution` must sum to 1; the feet/floor/horizon split must be three fields; the width bbox must exclude the ornament. P0-4.
6. **The beat is missing.** `movement.bpm: 88`, a beat-locked vertical, one slow secondary and the `.045` flower pulse. A K-pop performer who is not on the beat is not this channel. P0-5.
7. **The blind same-channel test is still not blind.** Three new frames + three reference frames, a person who has not seen the brief. Until that test exists, no one can tell a channel from a template — and the Uber sheet still passes "one focal shape", "97% negative space" and the warm/blue averages.
8. **No command proves the three new engines.** AGENTS.md rule 4: "every feature ships with a command that proves it works." Tone, archetype and motif meaning are all scoped `I` and all have `none` as their instrument (§5.1). §5.5's acceptance test cannot run: `style:identity` does not measure motifs, archetype or tone. A scope of `I` with no instrument is a wish, by §1.1's own definition.

Fix 1–5 and the document becomes signable in substance. Fix 6–8 and it becomes signable in practice.

---

## 6. Sign-off

**SIGN: NO. 7.0 / 10.**

The 0.5 over v1.0 is for the scope legend, the flat-print light fix, the cast family, the per-act paper event, the motif exemption and the three-film memory — six real structural improvements. It is not for the four P0s that were renamed rather than fixed, and it is not for the two new contradictions that make the document harder to implement than v1.0 (the tone/example split and the performer test's false claim).

The re-sign test from v1 still has not been run:

> Give the revised spec to a designer who has never seen the reference. Ask for a new performer and a new 30 s film. The result must be unmistakably this channel without a sunflower, a banner, a lamp, a desk, a network map, or Sol's face.

A designer following v1.1 will produce: a performer in a suit with a crown slot, a 30 s film with 3–5 motifs and 5 roles and 3 field colours across 9 shots, a two-line `LYRIC` band at x84/y992, a "world reveal" or phone-map opener, a voice-led 182 wpm read, and a business model as a paper diagram — because §6.2 tells them that is the channel. That is the Uber film with a better field. The answer to the test is still no.

**Sign v1.2 when the eight blockers above are closed and §6.2 is a film that would make someone laugh and then flinch.**
