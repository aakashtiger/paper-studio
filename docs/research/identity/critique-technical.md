# Technical critique - Paper K-pop identity specification v1

**Critic:** technical architect (subagent)
**Subject:** `KPOP-IDENTITY.md` and `kpop-identity.proposed.json`
**Date:** 4 November 2026
**Score:** **5 / 10** for implementability without over-engineering
**SIGN:** **NO**

The diagnosis is strong and the evidence is real. The prose says the right thing: identity is a
grammar plus a declared space of variation, the six crop frames are a surface reference and not the
film's average, and five axes are genuinely unproven (field, archetype, placement, contrast,
motifs). The machine-readable companion, however, is a 251-record second identity document that
duplicates most of `tokens.json`, changes signed pack values while calling itself an extension, and
loses the information a checker needs to interpret its own numbers. A developer who implements the
JSON will build the opposite of the minimal change the prose recommends. That is the central
finding.

I read the spec, the JSON, `tokens.json`, `STYLE.md`, `capabilities.json`, `style-identity.ts`,
`style-measure.ts`, `treatment.ts`, `camera-check.ts`, `type-audit.ts`, `palette-audit.ts`,
`paint-probe.js`, `camera.ts`, `visual-check.ts`, `library/characters/kiran/poses.json`, the gap
report `G-studio-gap.md`, and sections 7 / 5 / 5 of `D-lemo.md`, `E-kits.md` and `F-vizavi.md`.
I ran a Node validation over the JSON (IDs, scopes, units, ranges, duplicate value groups, share
sums) and checked every proposed value against the current pack and the reference numbers. No
repository file was changed except this critique.

---

## 1. What the spec gets right

1. **The frame of the problem is correct.** Identity is a fixed grammar plus a declared variation
   space. That is a better model than a list of things to copy, and it explains why the Uber film
   can pass 24 checks and still read as a different channel.
2. **The two references are a real discovery.** The six crops measure luma 145.8 / saturation 39.8;
   the film measures 100.9 / 21.8. The current bands are calibrated to the crops, so a film that
   looks like the source would be refused. Splitting surface reference from grammar reference is
   the single most valuable idea in the document.
3. **The five gaps are correctly named.** Field, archetype, placement, local contrast and motifs are
   the axes the gate cannot see, and the Uber measurements (centroid .136, 19% left + 19.5% right
   bars, 57.8% fixed height, 12.6 local luma, 0 motifs) are concrete evidence, not opinion.
4. **The prose is honest about what a frame can and cannot show.** Section 3.4 says the cast-shadow
   measurement was unreliable (median -0.4 luma, 0/44 high confidence) and that the rule must come
   from the code. That is exactly the right instinct; the JSON then labels
   `light.shadowOffset/Alpha/Blur` as `frame probe`, which is the same mistake.
5. **The anti-copy grammar is the right product idea.** Eight required differences, a motif set, a
   signature shot, and a "same-channel test" are what stops the channel becoming a template. It is
   also the part with the weakest instrumentation, which is the main thing to fix.

None of the criticism below is about taste. It is about whether a command can read the document and
whether the document agrees with itself.

---

## 2. JSON validation

### 2.1 Counts and basic integrity

| Check | Result |
|---|---|
| Records | **251** |
| Scope counts | I 198, F 27, X 23, V 3 |
| Literal duplicate `id` values | **none** |
| Missing `unit` | none |
| Missing `measure` | none |
| Records whose `value` is prose or a formula | at least 13 (`interaction.feet`, `.eyeline`, `.crowd`, `sound.silence`, `.tail`, `opening.firstFrame`, `envelope.aspectVertical`, `type.reading`, `camera.kick.decay`, `variation.*`) |
| Records with an exact reference value and no tolerance | at least 20 (`subjectHeightP50 .552`, `centroidXP50 .55`, `centreThirdShare .78`, `negativeSpace .97`, `edge.silhouetteP10 5.6`, `accentPerFrame 1`, ...) |
| Records that only apply to one mode/format/aspect | about 25 (`sound.song`, `sound.voice`, `edit.chorus`, `edit.verse`, `voice.*`, every px value, every 30 s value) |
| Records that are reference facts, not rules | at least 8 (`edit.scenes 51`, `edit.visibleCards 54`, `palette.referenceDominant`, `sound.song`, `envelope.frame` in the prose, `cast.heightUnits`, ...) |

So the JSON is not a schema in the sense section 4.1 claims. It is an annotated catalogue: 251
values, each with a source, of which 198 are declared invariant. A catalogue can be useful evidence.
It cannot be the contract, because it does not say how to read any of the 198.

### 2.2 The five properties a checker needs, and the JSON loses

The spec's own section 4.1 example contains a `tolerance` field. The JSON never uses it. The prose
says "`range` is used when the film chooses inside a band". The JSON never uses `range`; it writes
`value: [min, max]`. That is already a schema/prose mismatch, and it is the smallest of the five.

**(a) There is no type discriminator.** `value` is untyped JSON. In one document:

- `envelope.canvas` is `[1920, 1080]`, a **size**;
- `light.shadowOffset` is `[6, 10]`, a **vector**;
- `composition.subjectHeight` is `[0.13, 0.92]`, a **range**;
- `sets.floor.polygon` is an **array of points**;
- `palette.dayStage` is a **map** of hex strings;
- `type.reading` is a **formula string**;
- `interaction.feet` is a **rule string**.

A generic validator cannot tell these apart. My first validation pass flagged `envelope.canvas` as
"min > max" because it is a pair, not a range. A checker would need a hardcoded rule per ID, which
means the 251-record file is documentation, not schema. The fix is a `kind` or `shape` field
(`range`, `tuple`, `vector`, `map`, `enum`, `bool`, `rule`, `formula`) and typed values.

**(b) Direction is lost.** A scalar has no operator. As written, a checker cannot know whether:

- `palette.localContrastMin: 20` means ">= 20 in every shot", ">= 20 in 75% of shots" (the prose),
  or "the minimum observed is 20";
- `voice.coverage: 0.80` means "at least" or "equals";
- `camera.staticMax: 0.10` means "at most" or "target";
- `sound.voice.truePeak: -1.5` means "<= -1.5" (the prose) or "-1.5 exactly";
- `composition.centreThirdShare: 0.78` means "at least 78%" or "78% exactly".

The prose supplies the direction for some of these; the JSON supplies none. This affects roughly 40
records, including every "Min", "Max", "P50" and "Share" ID. Add `op: "min" | "max" | "eq" | "in"`
and `share: 0..1` (the fraction of shots/frames the rule must hold for).

**(c) Tolerance is lost.** The reference's p50 is 55.2%, so the JSON stores `0.552` as an invariant.
No new film will hit 0.552. The same is true of `0.55`, `0.78`, `0.97`, `5.6`, `0.14`. A check with
no tolerance either fails every film or silently skips the value. The pack's current bands are
`±20 / ±25 / ±10 / ±5 / ±45`; the new scalar values have no equivalent. Add `tolerance` (absolute or
relative) to every scalar and every percentile, and use the existing `±` convention.

**(d) Condition is lost.** At least 25 records are conditional but carry no condition:

- `sound.song.lufs -15.6` (song-led only) and `sound.voice.lufs -14` (voice-led only), both `I`;
- `edit.chorus 1.58-2.20` and `edit.verse 3.0-5.0` (song films, beat roles, not all films);
- `voice.narratedWpm 180-190` and `voice.linesPer30 5` (narrated films only);
- every px value (`horizon 780-900`, `feet 1000-1012`, `printMargin 26`, `subtitle y 992`,
  `shadow +6/+10`) is 16:9 only, while `aspectVertical` is also `I`;
- every 30 s value (`wordsPer30`, `shots 8-12`, `cuts/min`) is not true at 156 s.

A minimal checker can either (i) apply the value to every film and fail the wrong ones, or (ii) skip
it and pass the wrong ones. Both are wrong. Add `when: { aspect?, format?, mode? }` to the record.
This is not optional; it is the difference between a rule and a comment.

**(e) Units are composite where the value is an object.** `medium.fibres` has `unit:
"count/px/ratio"` for a value with a count, two ranges and an alpha. `camera.seam` has `unit:
"ratio/deg"` for four values whose baselines are undefined. `sound.voice` has `unit: "LUFS/dB"`.
A unit has to attach to a leaf, not to a bag. Either flatten the object into one record per leaf or
use a typed object whose keys end in their unit (`count`, `lengthPx`, `alpha`).

The spec's own evidence base says the same thing. `D-lemo.md` §7.1 principle 4: "Every invariant has
a check. If it cannot be checked, it is a note, not an invariant." At least 50 of the 198 invariants
are notes under that rule. `E-kits.md` §5.2 rule 1: "Every number has a unit in its key or its
type" and rule 3: "No functions." The JSON violates both (`type.reading`, `camera.kick.decay`).

### 2.3 Values that are evidence, not invariants

An `I` record is a rule every film must satisfy. These cannot be:

| Record | Why it cannot be an invariant |
|---|---|
| `edit.scenes: 51` | a 30 s film cannot have 51 scenes; the 156 s band is 45-60 shots, which also contradicts 51 |
| `edit.visibleCards: 54` | same; and 54 is not the same population as 51 scenes |
| `palette.referenceDominant` | the reference's dominant colours; a new film must have its own |
| `sound.song` (`227 words`, `46 lines`, `-15.6 LUFS`, `97.8 wpm`) | one film's master, not a rule |
| `envelope.frame` (prose §3.1, `4,699`) | one film's frame count; the JSON correctly omits it, the prose does not |
| `cast.heightUnits [580,760]` | a source constant; the library has no height field to compare |
| `palette.fieldRoles` with 13 names | 7 of them have no hex in `tokens.color`; a role without a value is not a role |

The same population problem appears in the opposite direction: `envelope.durationFormats` includes
156.6, but `capabilities.limits.durations` is `[30, 45, 60]` and `resolveFilm` refuses anything
else. The identity document cannot widen a product limit by declaring it.

### 2.4 Other JSON defects

- **Absolute drive path.** `reference.film` is `Y:\NewVideoTest\out\claude-pop.mp4`. The pack's
  own `STYLE.md` decision **Independence** says "no drive path"; `capabilities.governance.decisions`
  repeats it. A style artefact that only works on the author's Y: drive cannot be sealed, blind-run
  or reproduced by the technical owner. Use a repo-relative path (or a 30-frame sample) plus a
  `sha256`, and fail if it is missing.
- **`$schema` names a schema that does not exist.** `paper-studio/style-identity@1` is not in the
  repository. Either add the schema or drop the claim.
- **Status mismatch.** Markdown §4.1 says `"status": "research"`; the JSON says
  `"research-proposal"`. Trivial, but the whole point of the record is that it is exact.
- **`camera.byBeat.release` is `pull_back` in the JSON and `orbit` in `tokens.motion.camera.byBeat`.**
  The JSON cites the token as its source. One of the two is wrong; `camera:plan` uses the engine
  table, which also says orbit (`src/engine/camera.ts:52-59`).
- **`palette.accentPerFrame: 1` contradicts `STYLE.md`**: "it recurs at least twice in a film, **not
  in every frame**" (`STYLE.md:38`). `accentPerFilmMin: 2` agrees with the style; `accentPerFrame`
  does not.
- **13 real semantic duplicates inside the JSON** (same value and unit, different IDs):
  `envelope.background` = `medium.paper`; `light.objectEdge` = `edge.object`;
  `light.typeEdge` = `type.edge`; `light.typeEdgeMin` = `type.edgeMin`;
  `light.typeShadow` = `type.shadow`; `movement.squash`/`overshoot`/`anticipation`/
  `actionsPerShot`/`freezeBudget` = `motion.*`; `props.grip` = `interaction.grip`;
  `edit.lastHoldMax` = `closing.lastHold`; `movement.boilHz` = `type.boilHz`. The
  `movement.*` / `motion.*` pair is two copies of the same block with different IDs; a checker
  author will pick one and the other will drift. (`light.shadowBlur` = `camera.motionBlur`, both 0,
  is a value collision, not a shared concept.)
- **No exact duplicate IDs** is the one clean result. It does not compensate for the duplicates of
  concept.

---

## 3. Does the spec extend the system or duplicate it?

It does both, and the duplication is the larger half. Section 4.2 of the spec gets the ownership
right: extend `tokens.identity`, `tokens.motion.camera`, `tokens.type`, `tokens.color`, the library
and the score. The companion JSON then ignores its own table and restates the pack. This is the map.

| Concept | Existing source of truth | JSON records that duplicate it | What should carry it |
|---|---|---|---|
| Envelope, aspect, fps | `capabilities.limits`, score `aspect/fps/duration`, `formats/` | `envelope.canvas/aspect/aspectVertical/fps/durationFormats/encode` | score + `capabilities.limits`; `encode` belongs to the format/deliver step, not identity |
| Dimension, planes, layer order | `tokens.identity.dimension`, `tokens.medium.layerOrder` | `envelope.dimension/projection/planes`, `medium.layerOrder`, `sets.layers` | one `tokens.identity.dimension` and one `tokens.medium.layerOrder`; delete `sets.layers` |
| Medium surface constants | `tokens.medium`, `canvas/recipes.js` | `medium.mottles/fibres/specks/grain/paperOverlay/grainOverlay/halftone/tornEdge/blobJitter/printMargin/printMarks` | painter constants; do not copy them into identity |
| Palette roles and stages | `tokens.color.palettes/roles/default/maxColours` | `palette.roles/dayStage/nightStage/maxRoles/maxRolesShort` | `tokens.color`; one cap |
| Palette checks | `scripts/palette-audit.ts` (hardcoded 70-170°), `style:measure` palette | `palette.blueOnBlue/figureBlueMax/localContrastMin/warmShare/saturatedShare/fieldShare/largestFlat` | one `tokens.color.share` + one check; the hue ban must read the roles |
| Light and shadow | `tokens.medium.light.*`, `tokens.type.treatment.metrics` | `light.*`, `edge.*`, `type.edge/edgeMin/shadow` | `tokens.medium.light` + `tokens.type.treatment.metrics`; measure from the paint call, not the frame |
| Camera | `tokens.motion.camera` (moves/default/requireMove/minDistinct/maxRun/byBeat), `score.shots[].camera`, `src/core/style.ts CAMERA_MOVES` | `camera.*` (21 records) | `tokens.motion.camera` extended with travel/share/seam; the score needs real axes |
| Type | `tokens.type.families/scale/treatment`, `tokens.layout.maxWords`, `type-audit` | `type.*` (27 records) | `tokens.type` extended with role map/lines/underline/reading; one scale |
| Cast | `tokens.identity.cast`, `capabilities.limits.maxCast`, `capabilities.assets.rigs`, `library/characters/<id>/poses.json`, `score.cast` | `cast.*` (22 records) | library = character, `tokens.identity.cast` = rule, `capabilities.limits.maxCast` = the one limit |
| Movement | `tokens.motion.paper`, `tokens.motion.easings`, `score.direction.events` | `movement.*` (17) and `motion.*` (8) | one `tokens.motion.paper` + a closed event vocabulary |
| Shot duration and edit | `tokens.motion.minShot`, `score.edit.minShot/medianShot/maxShot`, `story.pace`, `preflight`, `capabilities.limits.durations` | `edit.*` (17) | one `tokens.identity.edit` keyed by format; `score.edit` narrows it |
| Field and sets | no token; `bgPaper()` fills cream; `layout.safeZones` | `sets.*`, `palette.field*` | **new** `tokens.identity.field` (additive, correct); floor/horizon from the set code |
| Props and motifs | `capabilities.assets.starterLibrary`, `recipes.subjects`, `visual:check` | `props.*`, `motifs.*` | **new** motif token + score field; prop size is new but should be one rule |
| Sound | `tokens.sound` (prose), `score.audio`, `src/engine/sfx.ts SFX_KINDS`, `docs/GATES.md` | `sound.*` (8) | `tokens.sound` + `GATES.md`; identity only mode and cue-kind allowlist |
| Voice | `story.pace` (0043), `preflight` (0044) | `voice.*` (8) | `story.json` and `preflight`; identity only the register, if anything |
| Variation | nothing; no previous-film record | `variation.*` (5) | **new** `films/<id>/variation.json` + a two-film check, or a review row |
| Forbidden | `STYLE.md` refusals, `capabilities.governance.decisions`, engine enums, `palette-audit` hue ban | `forbidden.list` (41) | one list read by the checks; shrink to what is enforced |
| Reference | `tokens.identity.reference`, `capabilities.identity.bindings` | `reference.*` | `tokens.identity.referenceFilm` pack-relative + hash |

The pattern is not "nine missing fields". It is "one new file that restates the pack and changes
some of its signed values". Two examples show the difference between extension and replacement:

- `tokens.identity.dimension` is `"2d"` today, and `style:identity` copies it into the report but
  never checks it. The spec wants `2.5d-layered`. That is a one-line token change plus a check, and
  it is a genuine correction.
- `tokens.motion.camera.moves` is `static, push_in, pull_back, pan, orbit`; `STYLE.md:62` says
  "static, push_in, pull_back, pan, tilt and orbit; no handheld, no wobble, no shake"; the spec's
  `camera.moves` adds `crash_zoom`, `track`, `whip`, `handheld` and `camera.shake [0,12]`. That is
  not an extension of the camera block. It reverses a written refusal. The same is true of the sixth
  type family, the `flash` transition, the 7-colour budget, the 6-person cast, the 156 s format and
  the 31 px subtitle. If the owner wants them, the honest route is **paper-kpop 0.3.0**, a
  `contract-change` PR, a new card, a new seal and a re-run of the gate. A research document cannot
  change a signed refusal by declaring a new invariant.

---

## 4. Internal contradictions

These are stated exactly, with the arithmetic where arithmetic settles it. I have not tried to
resolve them; the owner has to choose. But every one of them is a place where a checker would have
to guess.

### 4.1 Counts and caps

**C1. Three colour caps.** `palette.maxRoles = 7` (I), `palette.maxRolesShort = 5` (I),
`tokens.color.maxColours = 4` (`tokens.json:81`), `STYLE.md:11` and `:38` "at most four colours",
`capabilities.json` decision `palette-roles` "at most four". Five statements, three numbers. The
"4-7 roles" invariant is the reference's *measured* count (p50 5, p90 7), not the pack's budget of
six roles with four in a frame.

**C2. Accent every frame, or not every frame.** `palette.accentPerFrame = 1` (I) vs `STYLE.md:38`
"it recurs at least twice in a film, **not in every frame**". `accentPerFilmMin = 2` agrees with the
style; `accentPerFrame` contradicts it.

**C3. Static is both X and 10%.** `camera.staticMax = 0.10` (I) and the reference table says static
5/54 = 9%; `camera.movingShare [0.90, 1.0]`; `forbidden.list` contains `static-shot`; §0 hard bans
"a static shot"; §3.25 item 9 "A static shot"; §3.14 "Forbidden: ... a static shot". The current
`camera:check` refuses any `static` move (`camera.ts:87-93`). The JSON says a film may have 10%
static and also that it may have none. Pick one.

**C4. Cast totals 7 against a total of 6.** `cast.principals [1,2]` + `cast.chorus [0,5]` = up to 7,
while `cast.totalMax = 6` (I). The corner (2 principals + 5 chorus) is impossible. Also
`capabilities.limits.maxCast = 2` and `tokens.identity.cast.max = 2`; the spec's 6 is a product
change, not an identity detail. `capabilities.limits.maxCast` is read by neither `resolveFilm` nor
the score schema; only `style:identity` reads `tokens.identity.cast.max`.

**C5. Four distinct moves cannot satisfy five share bands.** `camera.distinctMoves [4,6]`, while the
share bands each have a positive minimum: push/pull 35-45%, lateral 15-25%, orbit 10-20%, tilt
5-15%, crash/whip 5-15%. That is five categories; with 4 distinct moves at least one category is at
zero and fails its minimum. The reference itself uses 8 distinct dynamic moves (push 15, pull 6,
track 8, orbit 7, tilt 4, crash 4, pan 1, handheld 2) plus static and roll/warp: 10-11, not 4-6.
The band is not a description of the film it cites.

**C6. "Not ten" against a ten-move vocabulary.** §3.14: "4-6 distinct moves per film. Not one move
for the whole film, **not ten**." The same section lists ten moves; the reference uses nine of the
ten named moves (all but `whip`), plus roll/warp and a transition micro. The band and the vocabulary
disagree.

**C7. `camera.byBeat.release` is two values.** `tokens.motion.camera.byBeat.release = "orbit"`;
JSON `camera.byBeat.release = "pull_back"`; the JSON cites the token as its source.

**C8. Words per 30 s against the 8-word slot.** `voice.linesPer30 = 5` and `voice.wordsPer30 =
[90,95]` imply 18-19 words per line. A subtitle is 9 words max (`type.maxSubtitleWords`) and 1300 px
wide at 31 px; 18 words do not fit. The film can split each line into two captions, but the spec
does not say so, and `edit.cutOnWord` is defined on words, not captions.

**C9. Type word caps.** `type.maxWords = 8` (I), `type.maxSubtitleWords = 9` (I), and the X
`lyric-wall` is ">8 words". A 9-word subtitle is both allowed and forbidden. The prose says "8
(subtitle 9)" but the X rule does not carry the exception.

### 4.2 Geometry

**C10. Hero is four different bands.** The document contains:

- close/hero framing: height **55-80%**, share 40-55% (§3.6);
- extreme close: height **80-92%**, share 0-10%;
- hero prop: **40-90%** of frame height (§3.12);
- hero character scale **1.10-1.34** × `cast.heightUnits 580-760` = **638-1,018 px** = **59.1-94.3%**
  of 1080.

The last exceeds the subject-height maximum of 92% (993.6 px) by 24.8 px. If the intended "hero
55-90" is the last one, it is not in the text; the text has 55-80, 80-92, 40-90 and 59-94.

**C11. The bottom of the scale ladder is below the subject floor.** Inset scale `.22` × height 580 =
127.6 px = **11.8%**, below the declared subject-height minimum of **13%** (140.4 px). A character
at the smallest allowed scale cannot satisfy the smallest allowed height.

**C12. The floor line is two different lines.** `composition.floorY [0.65, 0.88]` = 702-950 px;
`sets.feetY [1000, 1012]` = **0.926-0.937**; `sets.horizonY [780, 900]` = 0.722-0.833. The prose says
the cast stands 100-200 px in front of the painted floor (`§3.7`), so the "floor line under the cast"
and the "horizon" are different objects. The JSON has one `floorY`, one `horizonY` and one `feetY`,
and the only one that matches the cast is outside the band named after it. A frame probe cannot
tell which line it is measuring.

**C13. Subject area against subject height and width.** `composition.subjectArea [0.01, 0.04]`. At
the reference's p75 height 71.1% and p50 width 7.1%, a bounding box is **5.05%**, above the 4% max.
At the height max 91.9% and width max 14.2%, the box is 13.05%. If "area" means silhouette, 3% is
plausible; if it means bbox, 25% of the reference shots fail. The JSON does not say which. A paint
probe reports a box; a silhouette needs a mask.

**C14. Negative space plus text plus subject exceeds 100%.** `negativeSpace 0.97` + `textArea
[0.02, 0.06]` + `subjectArea 0.03` = **102-106%**. The prose defines 97% as "not subject", so text
must sit inside the 97%; then `textArea` is not an independent share. As three invariants they
cannot all hold. Define the populations.

**C15. Field share and largest flat region contradict.** `palette.fieldShare [0.18, 0.60]` and
`palette.largestFlat [0.04, 0.46]`. The field is by definition the largest flat colour region, so
its share cannot exceed the largest flat share. The reference's field p90 is 0.57, above the
largest-flat max 0.46. The effective field maximum is 0.46, not 0.60; the extra 0.14 is dead.

**C16. A side bar can pass the field rule.** `fieldShare` 0.18-0.60 and `edgeBarMax` 0.08. The Uber
film's 19% left bar is a large flat region inside 0.18-0.60 and its 19% is above 0.08, so the bar
rule catches it — but a **7%** designed bar passes both, while the prose says "0 left, 0 designed
right". More importantly, a 38.5% bar split into two 19% wings is *two* regions; the Uber's largest
flat region is 26.8% (the plate), so `fieldShare` alone does not identify the bar at all. The field
rule needs a definition that excludes vertical bars: the field must touch **both** the left and
right frame edges (full bleed), and a region that touches only top/bottom is a bar. Without that,
the headline fix can pass the exact film it is meant to catch.

**C17. Per-shot px values on 9:16.** `horizon 780-900`, `feet 1000-1012`, `printMargin 26`,
`subtitle y 992`, `shadow +6/+10`, `type.subtitle 31`, `vignette innerR 194.4/outerR 885.6` are all
1920×1080 values. The style also declares 9:16 as an invariant (`aspectVertical`) and
`capabilities.limits.aspects` includes it. On a 1080×1920 frame these either fail or are skipped.
The spec's own open question 6 admits the 9:16 bands need separate measurement; the records still
say `I`. Add `when: aspect = 16:9` or make them ratios of the frame.

### 4.3 Time, voice and edit

**C18. The 30 s band and the 30 s edit values disagree.** The format table (§3.15) says a 30 s Short
has min **1.2 s**, max **5.5 s**; the JSON says `edit.min 0.6`, `edit.max 6.2` (both I, sourced from
the 156 s band). A 30 s film with a 0.7 s shot or a 6.0 s shot passes the JSON and fails the table.
`tokens.motion.minShot` is 1.2, and `score.edit` is checked against itself, so the JSON's 0.6 would
be a third minimum.

**C19. 51 scenes / 54 cards against 8-12 shots.** `edit.scenes 51` and `edit.visibleCards 54` are I;
the 30 s band is 8-12 shots and the 156 s band is 45-60. A 30 s film cannot satisfy 51 or 54; a
60-shot 156 s film satisfies neither. These are the reference's counts, not rules.

**C20. Eight shots cannot make 16 cuts per minute.** At 30 s, cuts/min = (shots−1)/0.5. Eight shots
= **14.0**, below the `edit.cutsPerMinute` minimum 16. The feasible range is **9-12 shots** for the
16-24 band, not 8-12. The low end of the shot count and the cuts/min band are incompatible.

**C21. 90-95 words cannot fit a 30 s film with a 1 s head and a 1.5 s tail.** The maximum speech
time is 27.5 s. At 180-190 wpm that is **82.5-87.1 words**. 90 words at 190 wpm is 28.4 s; at 180
wpm it is 30.0 s. 95 words is 30.0-31.7 s. The `wordsPer30` band is above its own ceiling. Either
set `[75, 87]` or drop the field and keep wpm + coverage + first/last word, measured over the
**voiced span** (the spec does not say whether wpm is over the film or the voiced span; the Uber
film's 91 words at "182 wpm" is 30.0 s of speech, i.e. 100% voiced, while its coverage is 84.6%).

**C22. Hold creep against the static vocabulary.** `camera.holdCreep 0.0002` = 0.02%/frame. The
static move's travel is "creep <= 1.5% per shot" (§3.14). A 3 s shot is 90 frames × 0.02% = **1.8%**,
above the 1.5% cap. A 2.5 s shot is exactly 1.5%. So a hold may not exceed 2.5 s, but the edit band
allows 3.2 s median and 5.5 s max. The two values need one derivation.

**C23. The song and voice loudness bands are both invariant.** `sound.song.lufs -15.6` and
`sound.voice.lufs -14`, both `I`; a song film cannot satisfy -14 ±1 and a voice film cannot satisfy
-15.6. Same for `edit.chorus`/`edit.verse` (song only) and `voice.narratedWpm` (narrated only).
Mode is not a property of a value in the JSON.

**C24. Distribution sums are not constrained.** `edit.distribution` has five shares whose minimum
sum is **0.88** and maximum sum is **1.15**; a film can pass every band with shares summing to 0.88
or 1.15. `edit.transitions` sums to **0.95-1.40**. Independent checks would pass impossible
distributions. Either check the sum or use median/p10/p90/max and drop the distributions.

**C25. `flash` is not in the transition contract.** `edit.transitions` includes `flash [0,0.10]`;
`tokens.motion.transitions` is `cut, iris, wipe, hold, match_cut`; `src/core/style.ts TRANSITIONS`
has `cut, page_turn, dissolve, iris, wipe, match_cut, hold` (no flash); `treatment.ts` uses a string
`transitionOut` and the pack's list. Adding `flash` is a core enum + token + recipe change, not an
identity field.

### 4.4 Units, signs and definitions

**C26. The ± sign is lost in three movement bands.** The prose says lean `+/- .02-.30 rad` and hair
swing `+/- 5-26 px`; the JSON stores `[0.02, 0.30]` and `[5, 26]`, positive only. Kiran's library
has `lean -0.05` (`wake`), `headTilt -0.22` (`wake`), `0.5` (`asleep`), `0.38` (`slump`),
`-0.08` (`reach`, `look`), and `hairSwing -2, -1, 1, 2, 3, 4` — 7 of the 8 poses fail the hair-swing
band and 6 of 8 fail the head-tilt band. The reference-film bands are not the library's bands; a
check comparing them would refuse most of Kiran's poses, and the same for any character built on the
same rig.

**C27. `movement.exitRatio [0.4, 0.5]` is not "40-50% shorter".** "40-50% shorter" means exit/enter
= **0.50-0.60**. The JSON stores 0.4-0.5, which is 50-60% shorter. One of the two is wrong.

**C28. The camera unit is undefined.** `camera.zRange [0.84, 3.55]` is `unit: "scale"`;
`camera.holdCreep` is `"ratio/frame"`; the markdown's `push_in dz .03-.25` has no unit at all; the
score's `camera` is `{from, to}` with a scalar, and a `pan` in `films/uber-model/score.json` is
`from 1, to 1.02` — a 2% zoom, not a lateral move. `style:measure` reports `dz` as **percent over
the shot**. Three units under one name. A checker cannot tell whether 0.08 is 8%, 0.08 scale or
0.08 px/frame.

**C29. `camera.seam` has no baseline.** `speedJump .35`, `accelJump .50` are `unit: "ratio/deg"`.
Ratio of what — px/frame, px/s, scale/s? `cutAtRest [0.5,0.8]` is a share of cuts; the other three
are not shares. The seam rule is unmeasurable as written, and `style:measure` already skips cut
frames in its per-frame path (`cameraPath`), so the cut speed is not in the report.

**C30. Warm share includes teal.** The prose defines warm earth as "red, oxblood, orange, kraft,
cream, gold, **teal**" (§3.3). Teal is cool; a teal-dominant film would pass a "warm" band. The JSON
has the band but not the membership list, so a checker cannot compute it. If teal is meant, rename
the metric to "earth share" and publish the list; if not, remove it.

**C31. The reference film trips its own blue-on-blue rule.** The rule is `figure-blue > .30` and
field hue 195-255 and `|deltaL| < 18` (§3.3), and the reference trips it in **1/49 shots for one
frame**. The JSON expresses the rule as `palette.blueOnBlue: false` (X), which is "0 sustained" and
would fail the reference. It also has `figureBlueMax .3` and `localContrastMin 20`, so the same
predicate is split across three records with no operator. A boolean cannot express "detected".

**C32. The motif library contains the anti-copy list.** `motifs.library` includes `paperclip` and
`meter`; §3.24 says "What must never be copied from the reference film: ... the DOOM meter, the
paperclip". A new film may select both from the menu. Also `props.motifRecurrence = 3` (I) vs
`motifs.uses [2,5]` (F): a motif used twice is allowed by `uses` and fails the I. And
`motifs.maxShotShare 0.40` cites "0051 recipe cap", but 0051's 40% is **one recipe's share of the
film**, not one motif's share of shots. The source citation is false.

**C33. The halftone values contradict the pack.** `medium.halftone.alpha [0.11,0.18]` vs
`tokens.medium.halftone.alpha 0.5` (`tokens.json:50`); `cellPx [14,24]` vs token `cellMin 14 /
cellMax 22`; `angleRad [0.2,0.7]` vs token `angle 0.2`. The JSON follows the source film's measured
halftone, not the pack's painter. One of them has to change; the painter draws 0.5 today.

**C34. Joint and pose counts are stated three ways.** `cast.joints` lists **13** names but the
markdown says **11**; `capabilities.assets.rigs` has **11** different names (neck, shoulder-left/right,
elbow-left/right, hip-left/right, knee-left/right, ankle-left/right) with no wrists, waist, head
pivot or head centre. `movement.poseKeys` lists **12** but the markdown says "11 pose keys"; Kiran's
poses use `footL`/`footR`, which are not in the list, and have no `petalDrift` or `flip`. A check
against either list fails the existing character.

**C35. Type scale and the current floor.** At 1920, the pack's caption 18 at 390 = **88.6 px**; body
26 = **128 px**; label 14 = **69 px** (the `type-audit` floor, `type-audit.ts:123`). The JSON says
subtitle **31**, body **44-84**, label **7-18**, monogram 72-160. A film that follows the JSON fails
`audit:type`'s 69 px floor; a film that follows the pack fails the JSON. The reference's 31 px
subtitle is the source film's, not the pack's scale. One scale has to win.

**C36. The type "system" is undefined.** `type.maxSystems = 2` while `type.families` has six roles
(Anton, Archivo, Instrument Serif, DM Mono, Permanent Marker, Black Han Sans). A frame with a hook
(Anton), a label (DM Mono) and body (Archivo) uses three families. Is that 2 systems (display +
mono) or 3? The pack's role map has five roles and four families; "2 systems" has no definition and
no check.

### 4.5 Evidence conflicts

**C37. The reference is outside the proposed camera band.** The reference uses 8 distinct dynamic
moves; the band is 4-6. The spec's own table (§3.14) lists those moves and shares, so a film that
copies the reference fails the band. The band is a product choice, not a description of the channel;
the spec should say so.

**C38. The reference is outside the proposed colour cap.** The reference's median roles is 5 and p90
is 7; the pack's `maxColours` is 4; `maxRolesShort` is 5. The reference itself has frames at 7.

**C39. The reference is outside the proposed duration list.** 156.63 s vs
`capabilities.limits.durations [30,45,60]`; the reference's 0.66 s minimum is below
`tokens.motion.minShot 1.2` and the 30 s table's 1.2; its 6.14 s maximum is above the 30 s table's
5.5 and below the JSON's 6.2. Only the 156 s band admits the film, and that format is not in
`capabilities.limits.durations`. The identity cannot describe a format the product refuses to score.

**C40. The two research documents disagree on the reference frame count.** The spec says 4,699;
`G-studio-gap.md` says 4,698. 156.63 × 30 = 4,698.9, so 4,699 is the rounded value; the calibration
should use `ffprobe`, not a constant. This is minor, but it is exactly the kind of number the
identity file should not freeze as an invariant.

---

## 5. Measurability: can any command prove these invariants?

### 5.1 What the instruments actually see

**`style:measure`.** It measures luma, contrast (`YMAX - YMIN`), saturation, edge density
(`edgedetect` mean) and movement at **320 px wide** (`scripts/style-measure.ts:161,205`); palette via
`palettegen` (6 colours, merged across frames); cuts via `select gt(scene,0.03)`; camera at a
**48 px wide** luma grid (`:279`). It already computes p5/p50/p95 (`src/engine/style-measure.ts:18-26`),
but `compareMetrics` only compares means. It cannot see a 6 px shadow, a 1.5-4 px edge, a 31 px
subtitle, a 14 px halftone cell, a role share, a subject box, or a field component. At 320 px, a
14 px halftone cell is 2.3 px and aliases; at 160 px it is 1.2 px.

**`palette-audit`.** 160×90 RGB, every frame: saturated pixel share, hue bins, clipping. It cannot
see roles, field, subject, shadow or edge. Its hue ban is hardcoded 70-170° (`palette-audit.ts:26-29`),
and the token's acid `#D9F24B` sits at 69°, one degree outside the ban (G §6.4). It allows 0.5% of a
frame to be an outlier.

**`audit:type`.** Paint-probe text boxes in device space, the `copy` flag, the 6% title-safe margin
and the 69 px floor. It cannot see family, weight, colour, lines, underline, shadow, or whether text
is over a face. It reads only `title-safe 6 percent` from `safeZones` (`type-audit.ts:91-104`), not
the 12% bottom margin or the 14% lyric band.

**`paint-probe`.** Text boxes and rig records only (`paint-probe.js:4-7,18-19`): leg IK solves, limb
endpoints, anchors with their matrices. It does not record a character bounding box, a prop box, a
face box, a shadow draw, a field fill, a shape, a colour, an event or a pose name. It is a **box and
joint probe**, not a picture probe.

**`collage`.** One 32×18 RGB sample per shot: colour count, stddev, `cast` vs `drew`. It cannot see
placement.

**`audit:motion` / `probe:motion`.** Per-frame difference per shot, floor 0.6, dead seconds. It
cannot separate subject from camera; the painter adds 14 px orbit drift and 46 px pan, and the
12 Hz fibre/grain boil makes every frame differ, so a still character on a boiling paper layer has
non-zero movement.

**`camera:check`.** Score labels only. It checks a dynamic move, the engine vocabulary, push/pull
sign and `from != to`, `minDistinct`, `maxRun` (`camera.ts:61-160`). It does not check pan/orbit
travel, magnitude, measured travel, or the token's move list (`src/engine/camera.ts:44` uses the
engine list, not the token).

**`visual:check`.** The score's `visual.shows` strings vs recipe `subjects`, a default-opening flag
and one recipe's 40% share. It cannot see a motif, an archetype or whether the picture matches the
brief.

**`mix` / `deliver` / `gate:7`.** The only full measurement in the list: LUFS, true peak, duck,
silence, tail, delivered file, tied to the video hash. It applies to voice-led films; the song path
is parked.

### 5.2 Invariant by invariant

| # | Invariant | Instrument today | Can it prove it? | What would silently pass |
|---|---|---|---|---|
| 1 | 2.5D layered, no perspective/DOF | Schema; `tokens.identity.dimension` copied, never compared | **No** | a perspective room drawn in canvas; a `dimension: "2d"` token; any key not named |
| 2 | Cut paper, fibre, halftone, ink, hard shadow | `style:measure` edge density at 320; no width/halftone/shadow measure | **No** | a clean vector frame with a noise overlay; a soft shadow; a 24 px halftone that aliases |
| 3 | 4-7 roles, warm dominant, blue accent, one accent | `style:measure` means + `palette-audit` hue/clipping | **Partial** | a 4-colour frame with 2 warm plates; a teal "warm" plate; a 7-role frame against maxColours 4 |
| 4 | Full-bleed field, different per shot, no cream plate | none; 3×3 grid proposed | **No** | the Uber cream plate + 19% wings, unless the bar rule is checked; a 7% bar |
| 5 | Paper-pop performer, 8 poses, 14 faces | library + `audit:body` + `audit:rig` | **Partial** | a worker with 8 poses/14 faces (the spec's own example); a robot with the anchors |
| 6 | Subject 13-92% height, centroid .30-.75, floor .65-.88 | paint probe has joints/anchors, not card bounds; no subject ID | **No** | a shot with the cast drawn off-centre but the score says `cast`; a macro prop shot with no cast |
| 7 | Figure vs surround >=20 in 75%, median >=35 | `style:measure` `YMAX-YMIN` global; no figure mask; a 3×3 cell blends subject and field | **No** | a flat cream film with a 2% dark prop; a figure at 12 luma inside a same-hue field |
| 8 | 90%+ moving, push/pull 35-45%, 4-6 moves, run <=2 | score labels + per-shot dx/dy/dz; no move classifier; no x/y/roll in score | **Partial** | a `pan` with `from 1, to 1.02` (a 2% push); a `push_in` with 0.001 delta; a static shot with grain |
| 9 | Median 2.86-3.06, 19-20 cuts/min, chorus 1.6-2.2 | `style:measure --score` / `preflight` | **Yes, if** `--score` is used; the scene detector finds 238 shots on the reference (12 Hz boil) | the detector's own cuts; p10/p90/distribution not checked |
| 10 | 1-3 actions, one paper-physics event, no hold >0.4 s | `audit:motion` floor/dead seconds; event `kind` is free text | **No** | a character that bobs but does not act; a "fold" that is a label; a hold hidden by the boil |
| 11 | 2 systems, 8 words, 31 px subtitle, poster hooks | `audit:type` safe/floor; no family/role/lines/underline/over-face | **Partial** | 69 px copy in every slot; a 3-family frame; text over a hand (no hand box) |
| 12 | Song/voice-led, -14 LUFS, declared silence | `mix`/`deliver`/`gate:7` | **Yes** for voice-led; **No** for song | song mode has no path; a "song" with no lyric track |
| V | 8 required differences | `variation.*` measured by "review"; no previous-film record | **No** | the same set family, motifs and opener as the last film; a signature shot that is not |

The honest count is **2 of 13** invariants provable end to end today (sound for voice-led, edit with
`--score`), **4 partial**, **7 no**. The Uber film is the proof that the partial ones are not enough.

### 5.3 Silent passes in the existing code

These are not hypothetical; they are in the code the spec proposes to extend.

1. `style-identity.ts:110-119` returns early when a measurement is `null`, and compares
   `Math.abs(value) > limit` where `limit` may be `undefined` if a band is missing (TokensSchema is
   `.passthrough()` and does not validate `identity`). A typo or a failed measurement is a pass.
2. `camera:check` only checks `from = to` and the sign for push/pull; a pan or orbit with no travel
   passes. `camera.staticMax` is not implemented; `static` is an error. The token's move list is
   ignored; the engine list is used.
3. `palette-audit` passes the acid role by 1° and allows 0.5% outliers; it cannot see a role count.
4. `audit:type` checks a 6% margin on all edges and the label floor; the 12% bottom margin and the
   14% lyric band are not checked; a 31 px subtitle fails the 69 px floor, and a 69 px subtitle
   passes regardless of role.
5. `collage` checks that a declared cast was drawn, not where; a character at x .136 passes.
6. `audit:motion` and `frame-audit` measure frame-to-frame luma, so the 12 Hz fibre/grain boil can
   make a dead shot look alive and a hold look like a move. The movement floor must be measured on
   the subject box, not the whole frame.
7. `style:measure`'s scene detector reports 238 "shots" for the 156 s reference (median 0.1 s,
   90.8 cuts/min); any edit band measured with it is wrong. `--score` is the only honest route.
8. `visual:check` sees a recipe id and an `openingDefault` flag; it cannot see a default sunflower,
   banner or lamp, or a motif.

### 5.4 What a paint probe and a frame measure can actually see

- **Paint probe, today:** text boxes (device-space x/y/w/h, text, `copy`), leg IK solves, limb
  endpoints, anchors and their matrices. Nothing else.
- **Paint probe, after the proposed bbox:** the union of the *drawn card* boxes per character. It
  still cannot see the shadow, the field, the halftone, the ink width, the pose name, the prop
  contact or the event kind. It can see a character box, a prop box and a text box; that is enough
  for placement, height, type-over-face (with a face box) and prop grip (with a prop box). It is not
  enough for "paper physics", "one hero action", "shadow +6/+10" or "halftone 5-40%".
- **Frame measure, today:** global luma/sat/edge/movement at 320 px, 6-colour palette, cuts, camera
  at 48 px. It can see a full-bleed field only as a large flat region, not as "the field"; it can see
  a subject only as a dark/bright blob, not as the cast. A 3×3 grid gives 640×360 cells; a subject at
  3% of the frame is about 27% of one cell, so the cell mean is a figure/field blend, not the field
  and not the immediate surround. **A 3×3 grid cannot measure figure/field contrast, field share or
  horizon.** It can measure a 3×3 *regional* tone, which is a different thing.

The fix is not a bigger grid. It is (a) a subject box from the paint probe, (b) a ring around that
box at full resolution for local contrast, (c) a per-pixel role assignment and a connected component
touching both side edges for the field, and (d) a code-side shadow/field record for the rules a
frame cannot see. That is two small instruments, not a framework.

---

## 6. The minimal-change claim

### 6.1 The nine P0 fields, counted honestly

The prose says "nine fields, no new tool" (8.2) and "nine additions" (4.3). In practice the nine
blocks are:

1. `referenceFilm` + `bands.basis` + `tones` (5 subfields);
2. `field` (roles, share per role, horizon, no-bar) (4);
3. `composition` (height, centroid, floor, framing mix, tiers, sd) (6);
4. `edit` (min, p10, median, p90, max, cuts/min, cut share) (7);
5. `cast.archetype` + `appearance` (2+);
6. `motifs` (id, min/max shots, roles) (n);
7. `forbidden` (1 list);
8. `style:measure` percentiles + region grid (tool change);
9. paint-probe bbox (tool change);
10. `camera:check` token vocabulary + pan/orbit travel (tool change);
11. `type-audit` bottom band + role map + reading (tool change);
12. `palette-audit` tokens (tool change);
13. library `archetype` + `appearance` (schema change);
14. score `motif`, `framing`, `events[].with/contact` (schema change; `FilmScoreSchema` is
    `.strict()`).

That is **~30 fields, 4 command changes, 2 schema changes, and 1 core contract change** (the camera
axes, below). It is still a reasonable amount of work. It is not "nine fields, no new tool", and a
reviewer who budgets for nine will be wrong by a factor of three.

### 6.2 What is missing that would make the identity check real

1. **A `when` / `op` / `share` / `tolerance` record shape.** Without it the 198 invariants are not
   interpretable. This is the first thing to build, before any band.
2. **A subject box and a subject declaration.** The paint probe must record the drawn card bounds
   per character (not the joints) and the score must say which character or prop is the subject of
   the shot. Without this, invariants 6 and 7 are score claims. A joint bbox misses the head, hair,
   hands and feet by 5-15%, which is the whole band.
3. **A field/role classifier.** The field is the largest connected near-uniform region touching both
   side edges; its share is its area; its role is the nearest role hex within a deltaE threshold;
   its horizon is the top edge. The 3×3 grid cannot do this, and the current `style:measure` cannot
   see it.
4. **A local-contrast measurement.** Figure box + a dilated ring (or a 2% frame-height annulus),
   full resolution, per shot. A 3×3 cell mixes the subject with the field; it is not the immediate
   surround.
5. **A previous-film record for variation.** `films/<id>/variation.json` with the previous id, score
   hash, set families, field script, motif set, cast instance, opening/closing move/type, text
   behaviours and signature shot; `variation:check` reads both films. Without it, "8 required
   differences" is a human opinion, and `variation.*` must not be `I`.
6. **Camera axes in the score.** `FilmScoreSchema.camera` is `{move, from, to, ease}`, one scalar
   pair (`treatment.ts:69-76`). A pan, track, orbit, roll or shake cannot be expressed. A `pan` in
   the Uber score is `from 1, to 1.02` (a 2% push). Either add `x/y/z/roll/shake` or `keys` and
   teach the painter, or restrict the identity to z-only moves. This is the largest hidden cost in
   the spec.
7. **One type scale and one colour cap.** Two numbers, but they decide whether the film can pass its
   own checks. The pack's caption is 88.6 px at 1920; the reference's subtitle is 31 px. The pack's
   budget is 4; the reference's median is 5. Pick, write it once, and change the painter/audit with
   it.
8. **A 9:16 reference or an explicit exemption.** Every px band is 16:9. The 9:16 path is a product
   format; it cannot be left as "needs a separate measurement" while the records say `I`.
9. **A two-film calibration record.** See section 7. This is the acceptance test the spec lacks.

### 6.3 What is over-engineered and should be cut

- **The 251-record JSON as a contract.** Demote it to `docs/research/identity/evidence.json`
  (status: evidence, not schema) and implement only the additive `tokens.identity` blocks. Every
  duplicated block (medium constants, palette roles, type scale, camera, sound, voice) is deleted
  from the contract and referenced to its existing path.
- **All painter constants**: `mottles 90`, `fibres 4200`, `specks 1500`, `grain 512`, `halftone tile
  64`, `torn edge 14/10 points`, `blob jitter .06`, `vignette .34`, `print margin 26`. They live in
  `canvas/recipes.js`; copying them into identity creates a second source that drifts the first time
  the painter changes.
- **`envelope.encode`** (crf 15, AAC 320k) — a format/deliver setting, not identity.
- **`sound.song`** (LRA 6.0, 227 words, 46 lines, 97.8 wpm) — one film's master; the song path is
  parked. Keep the mode and the loudness band for the voice path.
- **`cast.blink` and `cast.idle`** — painter behaviour constants with no check.
- **`movement.*`** — a duplicate of `motion.*`; keep one block.
- **`interaction.*`** — prose rules that already live in `STYLE.md` §3.20; a probe cannot see
  "shared eyeline" or "support ankle locked". Either add the event vocabulary that makes them
  checkable or move them back to prose.
- **`type.underline`** with `animate: "progress-or-none"` and `offsetPx [6,10]` — no check, and the
  pack's refusals say "no generic underline". One sentence is enough.
- **`props.sizeClass`** with overlapping bands (handheld .08-.30, body .30-.50, hero .40-.90); a
  30% prop is both handheld and body. One rule or none.
- **`camera.kick.decay`** as `"(1-n/7)^1.5"` — the spec's own rule says no functions. Move it to the
  painter.
- **`edit.distribution`** with five independent shares — use median/p10/p90/max and one total check.
- **`palette.referenceDominant`** — evidence, not a parameter.
- **`forbidden.list`** of 41 items of which about six are enforced. Either wire each to a check or
  shrink it to the enforceable set and leave the rest in `STYLE.md`. A 41-item list that no command
  reads is worse than a 6-item list that does.

---

## 7. The missing acceptance test: two films

A band is only meaningful if it separates the reference from the film that failed. The spec has the
numbers for both but no table that says what each check must do. This is the test to add, and it is
cheap: `style:identity` on the reference film and on `films/uber-model/uber-model.mp4`, with the
expected verdict recorded next to the video hash.

| Proposed check | Reference `claude-pop.mp4` | Uber film | Expected |
|---|---|---|---|
| field is full-bleed, one field per shot | 54 field colours in 54 shots | 1 cream plate + 19.0% left / 19.5% right bars | pass reference, **fail Uber** |
| subject centroid x | .55 | .136 | pass / **fail** |
| subject height sd | 13-92% range | 57.8% fixed in all 30 samples | pass / **fail** |
| local figure/field luma | 46.6 | 12.6 | pass / **fail** |
| blue share | .01 median, .044 mean | .179 | pass / **fail** |
| blue-on-blue | 1/49 one frame | 7/10 tiles, 25/30 frames | pass with a one-frame tolerance / **fail** |
| archetype | paper-pop performer | office worker | pass / **fail** |
| motif set | sunburst, petals, halo, stamps, iris | none (route maps, revenue tiles) | pass / **fail** |
| colour role cap | 5 median, 7 p90 | 4 (paper, blue, red, ink); passes a 4-colour cap | pass both — **not a discriminator** |
| edit median / cuts/min | 2.86-3.06 / 19-20 | 3.0 / 18 | pass both — **not a discriminator** |
| camera moving | 90%+ | 10/10 labelled moves | pass both — **not a discriminator** |
| type subtitle | 31 px | 69 px (the pack floor) | pass reference only if the new scale is 31; the Uber film passes today |

If a proposed band fails the reference, it is miscalibrated. If it passes the Uber film, it is not a
gap check and should not be sold as one. The spec should record this table, not just the numbers.
The two-film run is also the "command that proves it" the repository requires; without it the new
identity check is another report that can be true and useless.

Two more calibration cautions:

- `style:measure` on the reference reports 238 shots because the 12 Hz boil trips `scene > 0.03`
  (G §2). Use `--score` with the authored 51 shots for edit bands, or raise the threshold. Do not
  build a cut band on the detector's output.
- The reference's own blue-on-blue frame (1/49) means an absolute X rule is stricter than the
  channel. Allow a stated small share (e.g. <=2% of shots, no sustained frame) and record it.

---

## 8. Score and blockers

### Score

**5 / 10.** The diagnosis and the prose are 8-9; the machine contract is 3. The number is not a
judgement of the research, which is the best evidence in the repository. It is the chance that a
developer can implement the document as written without inventing rules or contradicting the pack.

### P0 — must fix before any implementation

**P0.1. Two sources of truth.** The JSON is a 251-record second identity document; the prose says
"do not create a second identity file". **Fix:** move the JSON to
`docs/research/identity/evidence.json` with `status: "evidence"` and a header "not a schema"; add
only the additive blocks to `tokens.identity` (referenceFilm, bands.basis, tones, field,
composition, edit, cast.archetype, motifs, forbidden). Delete every duplicated block from the
contract: medium constants, palette roles, type scale, camera, sound, voice. One path per concept,
as section 3.

**P0.2. Signed pack reversals labelled invariants.** The spec changes `STYLE.md`'s camera (adds
handheld/shake/crash/track/whip), type (six families, 31 px), transitions (flash), colour cap (7),
cast (6), format (156 s) and still calls itself an extension. **Fix:** either (a) make it
**paper-kpop 0.3.0** with a `contract-change` PR, a new card, a new seal and a gate re-run, or
(b) adopt the signed values: five moves, no handheld/shake, four families, five transitions, four
colours, two cast, 30/45/60 s, 69 px floor. Do not ship a research document that reverses a refusal.

**P0.3. One colour cap.** `maxRoles 7` / `maxRolesShort 5` / `maxColours 4` cannot coexist. **Fix:**
`tokens.color.maxColours` is the only cap. Keep 4 (the signed pack) or raise it to 7 with a new
painter budget and a new `STYLE.md`; delete `palette.maxRoles` and `palette.maxRolesShort`. Enforce
it with a role-share measurement at full resolution (nearest role hex within a deltaE threshold),
not the 70-170° hue ban.

**P0.4. Static: decide once.** `static` is X in five places, 10% in `camera.staticMax`, and a hard
error in `camera:check`. **Fix (recommended):** remove `static` from the move vocabulary; add
`hold` with a measured creep <=1.5% per shot and <=10% of shots; `camera:check` refuses `static` and
accepts `hold`; `camera.holdCreep` becomes 0.000167 (1.5% / 90 frames) or the hold is capped at
2.5 s. If a true still is wanted, keep it X and delete `staticMax`. Do not keep both.

**P0.5. One cast limit.** `principals 2 + chorus 5 = 7` vs `totalMax 6`, and
`capabilities.limits.maxCast 2` is read by neither `resolveFilm` nor the score. **Fix:** one public
limit in `capabilities.limits.maxCast`, read by `resolveFilm`; if chorus is real, set it to 6 with
principals 1-2 and chorus 0-4 (2+4=6), and delete `tokens.identity.cast.max`. If chorus is not a
product decision, keep 2 and delete the chorus field.

**P0.6. Camera axes are not in the score.** `treatment.ts:69-76` is `{move, from, to, ease}`; there
is no x/y/roll/shake. **Fix:** either add `camera.x/y/z/roll/shake` (or `keys`) to
`FilmScoreSchema`, the painter and `camera:check`, with one unit (`from/to` = scale, not percent;
`dz` measured in percent over the shot), or restrict the identity to z-only and delete pan, track,
orbit, whip, handheld, roll and shake. This is a contract change; budget it as one.

**P0.7. One type scale.** 31 px subtitle vs the 69 px `audit:type` floor; body 44-84 vs 128; label
7-18 vs 69; monogram 72-160 vs 177. **Fix:** choose the reference scale or the pack scale. If
reference: set `tokens.type.scale` at 1080 (caption 31, body 44-84, display 92-376) and change the
painter + the 9:16 scale; if pack: delete 31/44-84/7-18 from the identity and keep 18@390 -> 88.6 px.
Then make `type-audit` read the role map and the drawn family, not just a floor.

**P0.8. Arithmetic impossibilities.** (a) 30 s voice: 90-95 words at 180-190 wpm needs 28.4-31.7 s,
with a 1 s head + 1.5 s tail it must be <=82-87; set `[75,87]` or drop `wordsPer30`. (b) 30 s edit:
8 shots = 14 cuts/min, below 16; the feasible range is 9-12 shots. (c) hero scale: 1.34 × 760 =
1,018 px = 94.3%, above 92%; inset .22 × 580 = 11.8%, below 13%. (d) floorY .65-.88 vs feet
.926-.937. Fix each value, not the prose around it.

**P0.9. Subject and field instruments.** A joint bbox is not a subject box; a 3×3 grid cannot
measure local contrast, field share or horizon; the halftone/shadow/edge widths are below the
measurement scale. **Fix:** `paint-probe.js` records a per-character `bounds` (union of drawn card
boxes: head, hair, torso, hands, feet) and a per-shot `subject` id; `style:measure` adds a per-pixel
role assignment and the largest edge-touching component; local contrast is the subject box plus a
dilated ring at full resolution. Do this before the composition/field checks; otherwise they are
score claims.

**P0.10. Variation and archetype are unprovable.** `variation.*` is "review" with no previous-film
record; `cast.archetype` is a string label ("paper-pop-performer") that a check can only compare to
itself; the library has no `archetype`, `appearance`, `height`, `headToBody` or `hairLayers`.
**Fix:** add `films/<id>/variation.json` (previous id, score hash, 8 axes) and `variation:check`, or
demote variation to a review row; move `appearance` + `heightClass` + `headToBody` + `hairLayers`
into P0 and add them to `library/characters/<id>/poses.json`, checked by `library:check`. Without
both, two of the five named gaps are still opinions.

**P0.11. The reference path must be pack-relative.** `Y:\NewVideoTest\out\claude-pop.mp4` violates
the pack's `independence` decision and cannot be sealed or blind-run. **Fix:** copy a 30-frame
sample or the film to `styles/paper-kpop/references/film/`, record `sha256`, and make
`style:identity` fail (not skip) when the file is missing.

### P1 — should fix before the first film under the new identity

1. **Format-keyed edit bands.** `tokens.identity.edit["30"|"45"|"60"]` with the table's own
   min/median/max; delete `edit.scenes`/`visibleCards` (reference facts); drop `chorus`/`verse` from
   `I` (song only, beat roles).
2. **Sum rules.** `edit.distribution` and `edit.transitions` must sum to 1 (or be replaced by
   median/p10/p90/max). Check the total, not each band.
3. **`palette.fieldRoles` needs hexes.** Either the six pack roles or a declared 7-13-role set with
   values and a painter budget; "green/pink/orange" with no hex is unmeasurable.
4. **Warm/saturated definitions.** Publish the membership list and the S/V predicate in the record;
   remove teal from "warm" or rename it; name `saturationMean` and `saturatedPixelShare` separately
   (the existing gate reads the mean; the new band reads the share).
5. **Blue-on-blue as a predicate, not a bool.** `{figureBlueMax .30, fieldHue [195,255],
   deltaLMin 18, allowedShare .02}`; the reference's 1/49 must pass.
6. **Type words.** One rule: 8 per slot, 9 only for the subtitle, and the lyric-wall X says ">9 in a
   subtitle or >8 elsewhere". Do not keep 8, 9 and ">8 is X" as three statements.
7. **Sound one source.** `tokens.sound` + `GATES.md` + `sfx.ts`; one duck value (4 vs 8 vs 6); the
   song path is parked, so `sound.song` is evidence, not an invariant.
8. **Motifs.** Remove `paperclip` and `meter` from the selectable library or mark them
   reference-only; make `props.motifRecurrence` 2-5 with at least one 3+ (match `uses`), and fix the
   `0051` citation (recipe share is not motif share).
9. **Movement signs and library alignment.** Restore the ± on lean/hairSwing, or change Kiran's
   poses; add `footL/footR` to the pose keys; decide whether the reference's bands or the library's
   bands are the rule.
10. **9:16.** Add `when: aspect = 16:9` to every px record, or convert to ratios and measure a 9:16
    reference. `canvas` should be a map per aspect.
11. **Camera shares vs distinct moves.** Raise `distinctMoves` to 5-8 (the share minima need five
    categories) or delete one share band; the reference uses 8-10, so 4-6 is not a description.
12. **`stagedRatio`.** The existing 0.5 floor is weak; the reference stages 49/54 = 91%. Set a
    channel floor (e.g. 0.85) and measure it from the probe's `drew`, not the score's `cast`.
13. **The identity report must be tied to the film.** Carry `score` hash + `videoHash` (as
    `style:identity` already does) and include the new blocks; otherwise `film:review --gate
    --reuse` can print a stale identity report.

### P2 — optional, or cut

1. `cast.blink` / `cast.idle` — painter constants; no check; cut.
2. `camera.kick` — no score field; move to the painter or add `camera.kicks` with a test.
3. `type.underline` — one sentence in `STYLE.md` until a command can see it.
4. `props.sizeClass` — overlapping bands; one rule or none.
5. `type.families` serif/Korean — no files, no licences in the pack, and STYLE says Latin only;
   cut until a brief needs them.
6. `envelope.encode` — format/deliver, not identity.
7. The 156.6 s format — a long-form product does not exist; park it as evidence, not a format.
8. `forbidden.list` — wire the six enforceable items to checks; leave the rest in prose.

---

## 9. Sign

**NO.**

The spec is the right diagnosis with the wrong machine artefact. It should be signed as a research
document and **not** implemented as written. The path to a yes is short and concrete:

1. Demote the 251-record JSON to evidence; implement 9 additive `tokens.identity` blocks, one path
   per concept.
2. Add `when` / `op` / `share` / `tolerance` to the record shape; without it the bands are notes.
3. Fix the contradictions in section 4 that decide whether a film passes: colour cap, static, cast,
   type scale, 30 s arithmetic, floor/feet, hero/inset, field/largest flat, 9:16.
4. Build the two instruments first: the paint-probe `bounds` and the role/field classifier. Then the
   composition/contrast/field checks are pictures, not opinions.
5. Add the previous-film record and the two-film calibration table. Run `style:identity` on the
   reference (must pass) and on the Uber film (must fail on exactly the five named gaps).
6. If any signed pack value must change, release **paper-kpop 0.3.0** with a `contract-change` PR
   and a new seal. Do not change it in a research file.

With those six changes the score is 8-9 and the sign flips. Without them, the identity check will be
a 251-record document that no command can read, which is the exact failure the document itself warns
against in section 8.3.
