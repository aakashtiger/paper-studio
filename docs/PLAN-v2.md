# Paper Studio — the simple plan (v2)

**Date:** 4 Nov 2026
**Status:** proposed. This is the order of work, not another architecture.
**Audience:** the creative owner first. Every step says what it is in plain
English, what exists, what is missing, and the smallest fix.

## The diagnosis in one sentence

The renderer, the style pack, the checks and the 30–60 minute loop are strong.
The **front of the process** — idea → measured script → voice → assets — and the
**look measurement** — per-region, camera translation, declared bands — are the
gaps. The video's values (3D, ink, bean heads) are not the gap; its **method**
(measure everything, then build from the numbers) is.

**Done means:** one idea and a brief go in; a film comes out; every step has a
command that can refuse; no human seal; a reference style can be measured and
matched, not just described.

---

## 1. The video checklist — do we capture it?

“General” means every style needs this capability. “Style value” means it is one
channel's specific look and should not be copied.

| # | What the video does | General? | What we have | What is missing | Verdict |
|---|---|---|---|---|---|
| 1 | **Lighting** — key direction, warm/cool, light pools | General | `tokens.medium.light` (direction, softness, opacity), `paper-shadow` choice, recipes such as `window_dusk`, `cueLamp`, `spotlight` | No per-shot light key; no measurement of a reference's key direction | **Partial** |
| 2 | **Shadows** — contact shadows, blue/purple shadow colour | General | Type shadow, contact shadow option, `C.shade()` in the painter | No shadow audit; no measurement of shadow fraction or colour | **Partial** |
| 3 | **Contrast** — high contrast, deep darks | General | `style:measure` luma range; palette tokens | Global only; no declared band; `YMAX−YMIN` is a rough proxy | **Partial** |
| 4 | **Movement** — micro-motion, camera drift, holds | General | `motion` note, `direction.events`, `probe:motion`, `audit:motion`, `style:measure` difference | Camera movement and character movement are not separated | **Partial** |
| 5 | **Effects** — ink, blur, bloom, sparkles, dust | Style value / general primitives | `EFFECTS` enum (grain, vignette, fiber, halftone, shadow, glow, flash, iris), recipe-drawn effects | No reusable effect/sprite library; no effect density measurement | **Partial** |
| 6 | **Cuts** — hard cuts, cut frequency | General | `style:measure` cuts/min, `--score` authored cuts, `frame-audit`, `transitionOut` | No declared cut-rate band per style | **Partial** |
| 7 | **Camera movements** — push, orbit, glide, roll | General | `CAMERA_MOVES`, `camera` move/from/to/ease, `camera.ease` | No per-shot position/look/fov/roll keys; no translation measurement | **Partial** |
| 8 | **Contact sheet** — 2 s / 60 frames | General | `style:measure --sheets`, `grid.ts`, storyboard/collage/final sheet | — | **Have** |
| 9 | **Phase-correlation camera tracking** — how far the image shifts per frame | General | `tblend` frame difference only | No x/y translation, no phase correlation | **Missing** |
| 10 | **How much and how the camera moves** | General | Movement mean, `camera.from/to`, motion audit | No direction, no per-shot distribution, no glide/snap classification | **Partial** |
| 11 | **Hard-cut frequency** | General | `style:measure` cuts/min; `--score` separates authored cuts from raw scene changes | No style band | **Have / Partial** |
| 12 | **Brightness** | General | `style:measure` luma (YAVG) | No per-region or band | **Have** |
| 13 | **Saturation** | General | `style:measure` SATAVG, palette | No per-region or band | **Have** |
| 14 | **Assets defined and created first** | General | `assets[]`, `capabilities.assets.starterLibrary`, cast/poses/rigs, `sheet`, preflight cast asset | No asset-first command, no shared library, no asset sheet before shots | **Partial** |
| 15 | **Free models from the internet** — house, table, tree | General for 3D styles | None. Paper props are code/recipes | No sprite/model asset type, no licence/registry, no library | **Missing** (and not needed for paper) |
| 16 | **14 reusable expressions** — laugh, cry, angry… | General for character styles | 4 expressions per character in `*.poses.json`; faces drawn per pose in the vendor | No pack-level expression library; no `expression` field on a shot/event; not reusable across films | **Partial** |
| 17 | **Reusable poses** | General for character styles | 8 poses per character file; `pose`/`breakdown` events; `sheet` | Per-film, not pack-level; no cross-film reuse | **Partial** |
| 18 | **Agents per area, own file copies, merge** | General process | 7 critic roles, ownership table, review reuse, git | No per-area analysis/rebuild roles, no worktrees, no merge procedure, no finding format | **Partial** |

**What we do better than the video:** a hash-bound style contract with 27
decisions, a blind-authoring seal, provenance and rights per source, deterministic
rendering, and per-shot audits (motion, type, rig seam, frame, paint match) that
the video does not have.

---

## 2. The process in plain English

Every stage below is one screen smaller than the last. A stage is finished only
when its command exits 0; a refusal is normal work, not a failure.

### Stage 0 — The idea and the brief

**What it is:** one page that says what the film is, who it is for, how long it
is, what it must say, and what it must never invent.

**Smallest steps**
1. Write the idea in one sentence.
2. Name the audience and the platform (16:9 or 9:16).
3. Set the length and the style.
4. Write the facts the film must state, with a source for each.
5. Run `npm run film:new -- --brief <brief.json>`.

**Have:** `brief.json`, `film:new` (writes story, beats, scenes, score), `mustSay`,
style/format resolution, `filmGaps`.

**Missing:** a `facts`/`sources` block; a command that turns an idea into a
first draft; a fact-check report.

**Fix:** add `facts`/`sources` to `story.json`; a `story:new --idea` that fills
only what the brief says and leaves every sentence blank; a fact-check list.

**Proof:** `film:new` writes four documents and names every gap.

**Time:** 10–20 min with the checks.

---

### Stage 1 — The script

**What it is:** one page with a want, an obstacle, a turn and a button, plus every
spoken line at 140–150 words per minute.

**Smallest steps**
1. Write the spine: want / obstacle / turn / button.
2. Write 8–12 narration lines, one idea each.
3. Read it aloud; cut anything that describes what the picture already shows.
4. Check the words per minute for the film's length.
5. Check that every beat has words and no beat owns silence it did not declare.
6. Check every promised phrase is actually said.
7. Run `npm run story -- <story.json>`.

**Have:** `story.json`, `checkStory` (wpm, turn, hook/button, energy, share,
balance, air, mustSay), `npm run story`.

**Missing:** the hook/analogy/payoff checks; a facts/sources field; an
idea→script draft. The general shape is enforced, not the channel's exact formula.

**Fix:** optional checks for a one-sentence hook, escalation count, an analogy,
and a payoff; `facts`/`sources`; a guided draft command.

**Proof:** a 21-word, 60-second film is refused with `story:wpm`.

**Time:** 20–40 min.

---

### Stage 2 — The beats

**What it is:** the turns of the film: what each beat is for, how much of the
film it owns, its energy, and what it sounds like.

**Smallest steps**
1. Give each beat a purpose from the closed list.
2. Give it a share of the film; the shares must total 100%.
3. Give it an energy from 1 to 5; the curve must lift and drop.
4. Name its world sound and its one signature sound.
5. Mark one beat quiet on purpose.
6. Run the story check.

**Have:** `beats.json`, `BEAT_PURPOSES`, share/energy/balance checks, `sound.world`,
`sound.signature`, `sound.quiet`.

**Missing:** a lyric/song mapping; a direct beat→scene link (scenes carry the
beat, so this is covered).

**Fix:** for a song, a lyric line is a narration line; the same beat map applies.

**Proof:** a flat energy curve or beats that do not total 100% are refused.

**Time:** 10–20 min.

---

### Stage 3 — The voice

**What it is:** speak the script, measure every word, and make the measured read
the clock.

**Smallest steps**
1. Choose a recorded voice or Kokoro TTS.
2. Speak the narration once.
3. Listen with Whisper and attach the heard words to the script.
4. Fail if a word was swallowed or a line starts too far from its written time.
5. Apply the measured times to the score (`--apply`).
6. Keep the word times; everything downstream uses them.

**Have:** `voice`, `voice --apply`, `words.json`, `transcript.json`, `asr`,
`checkNarrationSync`, first-line ≤1 s, coverage from measured words (0037).

**Missing:** `voice --story` — speaking `story.json` before the score exists; a
song/lyric clock; a pronunciation dictionary.

**Fix:** `voice --story` reads the story's narration lines, writes
`narration.json` (line, start, duration, words), and the scenes/shots consume it.
The score is filled from that file, not the other way round. A lyric line is a
narration line whose syllables are the clock.

**Proof:** `voice` refuses a word it did not hear; `--apply` refuses a score that
does not validate.

**Time:** 5–15 min.

---

### Stage 4 — The scenes

**What it is:** the high-level cut: where it happens, who is in it, what happens,
which lines it carries, and how many seconds it owns.

**Smallest steps**
1. Give every scene a beat.
2. Give it a place and a one-line summary.
3. List the cast.
4. List the narration lines it carries; every line belongs to one scene.
5. Set its seconds; the scenes must cover the film.
6. Check the measured narration fits (not shorter than its words, not more than
   one breath of air beyond them).
7. Check the shots that follow sum to the scene.

**Have:** `scenes.json`, `checkScenes`, `sceneGaps`, shot→scene binding,
`scene:lead`, `scene:air`, `scene:total`.

**Missing:** auto-fitting a scene to the measured read; song/lyric scenes.

**Fix:** after `voice --story`, `scenes:fit` *proposes* new durations from the
measured line spans; a person confirms; the check still refuses a bad fit.

**Proof:** a scene with no shot, a line on the wrong beat, or a scene shorter
than its words is refused.

**Time:** 10–20 min.

---

### Stage 5 — The shots

**What it is:** the detailed cut. Every camera move, action, sound, motion and
duration is written down, each shot names its scene and beat, and each shot says
why it exists.

**Smallest steps**
1. Give every shot a recipe, duration, scene and beat.
2. Write the camera move and easing.
3. Write entry, exit and the one-line reason.
4. Write at least three timed events (what happens, when).
5. Bind each sound cue to its event; a silent event says why.
6. Check the median shot is 2.5–3 s, no shot is over 2× the median, and every
   start/end is on the frame grid.
7. Check the cut answers the scene and beat shares.
8. Check staging uses only assets in the manifest.

**Have:** `score.json`, recipes, `checkCut`, `pacing:median`, `pacing:long`,
`pacing:grid` (0037), `cut:signature`, `cut:reason`, cues, `preflight`.

**Missing:** per-shot light/shadow/effect keys; camera roll/kicks; a word binding
for a reaction; a staging-asset check for props/sets.

**Fix:** add optional style keys only when a style needs them; `event.word` for a
reaction that lands 0–3 frames before its word; a staging check that every slot
used by a shot names a declared asset.

**Proof:** `npm run preflight -- <score>` refuses a still shot, an unbound shot,
a fake reason, and a cue that never lands.

**Time:** 30–60 min for a 60 s film.

---

### Stage 6 — The assets

**What it is:** every character, prop, set, text style and effect is listed,
built or reused, given a size and anchors, and drawn on one sheet **before** the
shots are reviewed.

**Smallest steps**
1. Derive the required list from the scenes and shots: cast, props, sets, type,
   effects.
2. Match each to the library by `id@version`; reuse before building.
3. Build the missing character rig, props and sets.
4. Give each character its expressions and poses; a shot names the expression.
5. Declare each asset's size, anchors, licence and source.
6. Render one asset sheet: every character, every expression, every pose, every
   prop, every set.
7. Check the sheet: no plank arm, no tiny hand, no prop floating, no missing
   expression.
8. Only then use the assets in the storyboard.

**Have:** `assets[]` manifest with type, path, hash, anchors; `starterLibrary`;
cast/poses/rigs; `sheet`; preflight cast→asset check. The shared character
library (8 poses, 14 expressions, `library:check/add/use`, hashes); the 40-entry
plain-name catalogue with sizes and licences; `assets:new` derives the recipe
assets and hashes the file that draws each (0045); `library:sheet` draws every
library character.

**Missing:** asset-first derivation from **scenes and shots** (the command
derives from recipe ids); a sheet for props and sets (only characters are drawn);
a `sprite`/model type; immutable library versions and 14 unique faces are parked
by the user.

**Fix:**
- `assets:new --score` — **built** (0045): derives the missing ids, hashes the
  drawing file, refuses an unknown name, validates before writing.
- `assets:sheet` for props and sets — still open; `library:sheet` covers the
  characters today.
- A pack-level `characters/` library with 14 expressions and 8 poses; a shot
  event names `expression` — **built** (0038). The 14 names do not yet draw 14
  unique faces.
- A `sprite` asset type for pre-rendered 3D/CC0 images; a real 3D primitive is a
  new renderer, not this plan.

**Proof:** `assets:check` refuses a missing file, a duplicate, a bad licence and
a prop with no declared size; `library:check` refuses a character outside the
library, a missing expression or a missing pose; `assets:new` refuses an unknown
id; `assets:coverage` refuses a recipe asset the manifest misses.

**Time:** 30–60 min for a new cast; 5 min to reuse.

---

### Stage 7 — Storyboard and collage

**What it is:** the whole film as one page of images before it is rendered:
one frame per shot through the real recipes and cast, plus the character/pose
sheet. A bad beat sits next to a good one.

**Smallest steps**
1. Build the assets (stage 6).
2. Paint one frame per shot through the real recipe and cast.
3. Tile them in shot order, labelled with shot, time and beat.
4. Put the character/pose/expression sheet beside it.
5. Check every shot is present, none blank or duplicated, every staged character
   drawn, every word inside the safe area.
6. Measure the storyboard against the reference (`style:measure --specimen`).
7. Fix the cheapest frame first; repeat.

**Have:** `storyboard`, `collage`, `sheet`, `stills`, `style:measure --specimen`,
`pairs.png`.

**Missing:** assets built before the sheet; per-region comparison; pairing by
subject; an arm/hand check.

**Fix:** the asset stage runs first; `style:measure --regions` and `--pairs`;
the arm/hand audit (stage 9).

**Proof:** `collage` refuses a missing/blank/duplicate shot and a missing cast
member; `style:measure` reports the look gap.

**Time:** 2–5 min per sheet; 10–30 min to fix.

---

### Stage 8 — Animatic and draft

**What it is:** a cheap moving version with the voice and sound, at 10 fps, before
the full render.

**Smallest steps**
1. Paint the score at 10 fps.
2. Mux the master audio.
3. Watch it end to end.
4. Fix only what is visible at 10 fps.
5. Do not render the full film until the draft is right.

**Have:** `draft`, `board`, `animatic`, `rough`, `film:chain --skip-render`.

**Missing:** nothing structural.

**Fix:** keep it; make it a mandatory step in the chain before the full render.

**Proof:** `draft` writes a 10 fps MP4 with the master and no manifest.

**Time:** ~4 min.

---

### Stage 9 — The checks before the paint

**What it is:** every cheap question answered before a browser opens: is the
writing filmable, are the scenes and shots in sync, does every shot move, is the
type safe, is the rig sound, is the look close, is the paint deterministic?

**Smallest steps**
1. Run the unit tests.
2. Run the score audit.
3. Run `preflight` (story, scenes, cut, narration, sound, cast, grid).
4. Run `inspect` (one pass: motion, type, rig).
5. Run `determinism` (30 frames, serial vs workers).
6. Run the arm/hand and word-reaction checks.
7. Run `style:measure --bands` against the reference.
8. Stop on the first refusal.

**Have:** `preflight`, `inspect`, `determinism`, `probe:motion`, `audit:type`,
`audit:rig`, `pacing:grid`, measured narration, stale score-data guard.

**Missing:** per-region/lighting/shadow measurement; bands; arm/hand; word
reaction; pop frames.

**Fix:** the measurement v2 and the three audits (P0).

**Proof:** the chain stops before the render on any red.

**Time:** ~2 min.

---

### Stage 10 — The render

**What it is:** paint the film once, in parallel, from the page data that matches
the score.

**Smallest steps**
1. Regenerate the page data (`embed`) after the voice.
2. Refuse a stale page.
3. Paint N contiguous ranges in N browsers.
4. Encode with the same ffmpeg call.
5. Keep one full render per cut.

**Have:** `render:film`, `--workers`, stale score-data guard, `render:workers`
proof.

**Missing:** background reuse inside a shot (2–3× expected); 2K/vertical default.

**Fix:** cache the static background per shot; measure the saving; a 2K format
field.

**Proof:** `render:workers` shows 60/60 identical frames; the stale guard throws
before a browser opens.

**Time:** ~6–12 min for 60 s.

---

### Stage 11 — Sound

**What it is:** generate the SFX and music, duck under the voice, measure the
master, put it into the picture, measure the delivered file.

**Smallest steps**
1. Bind every cue to its picture event.
2. Generate the SFX.
3. Mix with a declared duck.
4. Measure loudness, true peak, LRA, silence, tail.
5. Mux into the frozen picture.
6. Measure the delivered file.
7. Listen with ASR to the master.

**Have:** `sfx`, `mix`, `deliver`, `asr`, `gate:7`.

**Missing:** music generation; song path; the exact music +3/SFX −6 standard; the **15 LU contrast** rule (quietest 3 s vs loudest 3 s) on the delivered file.

**Fix:** music only when a film needs it; a lyric/syllable clock for a song; measure 3 s short-term windows and fail below 15 LU of contrast.

**Proof:** a click, a banned cue, a silence with narration, or a stale cue is
refused.

**Time:** ~1 min.

---

### Stage 12 — Delivery and gate

**What it is:** one frozen picture hash, the delivered audio measured, and every
gate row printed from evidence about this film.

**Smallest steps**
1. Hash the picture stream.
2. Measure the delivered audio.
3. Run the 21 gate checks.
4. Print the review page and sheet.
5. Reuse an audit only when it is tied to this film.

**Have:** `deliver`, `gate:7`, `film:review --gate --reuse`, `--reuse` rules.

**Missing:** pop-frame check; hand/face close-up count; loudness range gated;
sound contrast at least 15 LU; arm/hand.

**Fix:** add the four checks (P0.4/P0.9).

**Proof:** `gate:7` prints PASS with no pending row.

**Time:** ~1 min.

---

### Stage 13 — Learn and archive

**What it is:** write down what changed and why, so the next film does not
rediscover it.

**Smallest steps**
1. Save the measured bible and the match report.
2. Write one decision per structural change.
3. Write one lesson per rejected cut.
4. Update the style pack only through `style:approve` / `style:seal`.

**Have:** `docs/decisions/`, `build/` reports, `style:measure`, `film:review`.

**Missing:** a per-film lessons file.

**Fix:** `film:review` writes `LESSONS.md` with the refused checks and the fixes.

**Proof:** the decision record is in the repo, not in chat.

**Time:** 5 min.

---

## 3. The gap list, in order

### P0 — do not make the next film until these are closed

| ID | Gap | Smallest fix | Proof |
|---|---|---|---|
| P0.1 | Narration is spoken from the score, not from `story.json`; scenes/shots still come before the voice. `voice --apply` can move a shot by 0.35 s while `cut:scene-duration` allows 0.3 s, so a green apply can make a red scene | `voice --story` writes `narration.json`; scenes/shots consume it; song lyric lines use the same clock. When `--apply` moves a boundary at a scene edge, it updates that scene's seconds or refuses by name. Align the two tolerances | a line that runs long moves one shot, not the film; a moved boundary cannot make a green scene red |
| P0.2 | No shared asset library (names, not files); characters have 4 expressions and 8 poses per film; the render manifest does not hash assets, and Same Alarm's manifest misses **6 of 11** assets its own recipes name; props have no declared size in the manifest; the painter never receives an expression | `assets/` root with id@version, path, hash, licence, anchors, w/h; 12–16 expressions; 12 poses; `assets:new --score` derives the required list from recipes/cast/slots; `assets:check` diffs it; hash every `assets[].path` and every vendor script in the render manifest; pass `expression` through `drawCharacter` to the rig | `assets:check` refuses a missing expression, licence, size or recipe-named asset; the manifest names every drawn file |
| P0.3 | Measurement is global only; contrast is a saturated `YMAX−YMIN` proxy; edge density is measured at a fixed 320 px and biases the higher-resolution film; movement includes cut spikes; no camera translation, lighting direction, shadow fraction or bands; the match report is not tied to a film | `style:measure --regions` (face/sky/text/prop), `--camera` (x/y/z: dx, dy, dz per shot; built in 0039), `--bands` (declared targets); report `YHIGH−YLOW` contrast and `SATHIGH` (already in `signalstats`); measure edges at the reference's width, not 320; drop cut frames from movement; write film id + `videoHash` + tool version into `match.json`; add it to `film:review` | a reference and a specimen produce a per-region gap, not one global number; the gap is tied to the picture it describes |
| P0.4 | No arm/hand audit; no word-reaction check; no pop-frame check | rig publishes arm segments/hand shapes; `event.word` + 0–3 frame check; frame audit flags a luminance jump at a cut | a plank arm and a hand smaller than a thumb fail; a reaction lands before its word |
| P0.5 | No per-area analysis/rebuild workflow; critics are end-of-film and often absent; and the areas **share one file** — `canvas/recipes.js` holds camera, light, sets and final look, so "split files" is not yet possible | **First split `canvas/recipes.js` by area** into `sets.js`, `characters.js`, `light.js`, `camera.js`, `look.js` with `recipes.js` as the registry. Then 7 read-only analysis agents, one `reviews/<film>/<area>.md` each; `FIXLIST.md`; up to 4 rebuild agents in git worktrees with disjoint files; merge one file at a time | every finding has a file/frame, an owner and a proof command; two agents never edit one file |
| P0.6 | The chain and renderer measured the promise, not the film | **Done (0037):** measured words, story/score duration, frame grid, `embed` after voice, stale score-data guard, `--score` cut honesty | 418 tests; Same Alarm coverage 13%, not 23% |
| P0.7 | The order can be bypassed: `reproduce` turns missing story/scenes into warnings for any film with an MP4; `--skip-render` adopts a picture without the render gates; `--from` skips the prefix; `--draft`/probes can paint a whole film; `render:film` requires only preflight, collage and motion; `gate:7` passes with ASR pending | Replace `reproduce` with a sealed legacy marker in the score; `--skip-render`/`--from` must prove the skipped reports exist and are tied to this score; require determinism, type, rig, sfx and mix before the paint; fail the gate on any `pending` | deleting story/scenes after a delivery fails preflight and the gate; a whole-film probe without checks is impossible |
| P0.8 | The writing is not hashed or gated: `story.json`, `beats.json` and `scenes.json` are absent from `renderInputs`; `gate:7` has no writing row, so a delivered film can have its script deleted and still pass | Hash all three into the render manifest; add one `writing` gate row that re-runs `checkStory`, `checkScenes` and `checkNarrationSync` and is tied to the score hash | the delivered file's provenance includes the documents it was written from; a missing script fails the gate |
| P0.9 | The sound and the gate are not in viewer units: the quietest 3 s is not measured against the loudest 3 s (the v2 rule is ≥15 LU of contrast), LRA is measured but never gated, and there is no hand/face close-up count | Measure 3 s short-term windows on the delivered file and fail if the quietest is <15 LU under the loudest; gate LRA; count hand/face close-ups per film and declare a band; express the motion floor in a viewer unit | a film that never goes quiet fails; a film with no close-ups fails; the gate speaks in words, seconds, LU and faces, not arbitrary units |

**Progress (4 Nov):** P0.1 v1 is built — `voice:story` speaks story+beats and writes `narration.json` before a score; `voice --from-story` fills the clock, captions and shot snaps. Coverage is measured on the audio (0044): `fixtures/story-long` (60 s, 189 words, 189 wpm) is **82%** voiced, last word 59.28 s, and passes. The 30 s fixture is refused (its voice ends at 22.06 s), and a 30 s nine-line film cannot carry 180–190 wpm — the line breaks alone are 4 s — so a 30 s short needs five beats. Scenes auto-fit and the song clock are still open. P0.2 v1 is built — the character library (8 poses, 14 expressions, check/add/use) and the 40-entry plain-name asset catalogue with a join key (`assets:list/check/coverage`); Same Alarm names 11 recipe assets and misses 6; `assets:new` derives all 6 from the catalogue and hashes the file that draws each (0045), and every prop now declares a size (12 added). `assets:coverage` passes on the derived copy. Immutable library versions and 14 unique faces are parked. P0.3 is built as the style's camera grammar — `--camera` x/y/z, `camera:check` (resolved scores, no static, correct push/pull sign, no long run), `camera:plan` (preserves authored cameras unless `--force`, beat purpose via `beats.json`, varied 4-move template); per-region/bands/reference-video are dropped for this style by the user, not pending.

### P1 — after the first new film, or in parallel

| ID | Gap | Smallest fix |
|---|---|---|
| P1.1 | The script is not generated from the idea | `story:new --idea` fills only the brief's facts and leaves every sentence blank; a fact-check list; no invention |
| P1.2 | Measurements do not become tokens | `style:new --bible` proposes palette, contrast, type scale and motion values; the 27 decisions validate them |
| P1.3 | Backgrounds are redrawn every frame | cache the static layers per shot; measure the 2–3× claim |
| P1.4 | No music; song path is a marker | lyric/syllable clock; ACE-Step only when a film needs music; the 5–10 dB standard |
| P1.5 | 2K/vertical is format-dependent | a 2K format field and a 1440×2560 render path |
| P1.6 | Readability traps are not checks | ten checks: swing/hanging, foreground blobs, flags, signs, rim light, rails, flat holds |
| P1.7 | Props/sets are not derived from shots | `checkStagingAssets` reads every slot and refuses an undeclared asset |
| P1.8 | Per-asset provenance is missing | `licence` + `source` on every asset, external or reused |

### P2 — later, only when a style needs it

| ID | Gap | Note |
|---|---|---|
| P2.1 | No 3D renderer or sprite/model library | a new backend, not a style contract; add `sprite` type first |
| P2.2 | No style × genre layer | `genres/` with content conventions; do not mix it into the style |
| P2.3 | Only paper-kpop and watercolor are real packs | each new style is a pack, not engine code |
| P2.4 | Music/DAW/plugin system | do not build |

---

## 4. The agent and critic workflow (simple, no new dependency)

The video's real trick is **split the files, not just the jobs**. We copy that
with git worktrees and the existing commands.

**Phase A — seven analysis agents, read-only, same checkout.**
Each reads the same evidence: `build/<id>/collage/`, `build/<id>/sheets/`,
`build/<id>/strips/`, `build/<id>/review.html`, the JSON reports. Each writes
exactly one file, `reviews/<film>/<area>.md`, with fixed rows:

`shot | time | frame/file | severity | evidence command | one fix`

The seven areas: colour, ink/line, light/shadow, texture/material, character/rig,
depth/framing, motion/camera. Plus sound when the film has it. No shared writes,
so no merge conflict by construction.

**Phase B — director triage.**
`reviews/<film>/FIXLIST.md`: one row per accepted finding, one owner, one target
file. `score.json` stays director-only; a camera agent proposes values, never
edits the score.

**Phase C — at most four rebuild agents, each in a worktree.**

```
git worktree add ../studio-world  -b fix/<film>/world
git worktree add ../studio-cast   -b fix/<film>/cast
git worktree add ../studio-look   -b fix/<film>/look
git worktree add ../studio-camera -b fix/<film>/camera
```

Disjoint scopes (after the P0.5 split; without it these four would edit one file):
- world: `styles/<pack>/canvas/sets.js` + the set recipes
- cast: `films/<id>/cast/*.json` + `films/<id>/vendor/characters.js` + `styles/<pack>/canvas/characters.js`
- look: `styles/<pack>/tokens.json` + `styles/<pack>/canvas/look.js`
- camera: `styles/<pack>/canvas/camera.js` + `reviews/<film>/camera.md` (it proposes score values; `score.json` stays director-only)

**Phase D — merge one file at a time**, world → cast → camera → look. After each
file: `npm run preflight` (1 s). After each agent: `npm run inspect` (1 min).
Then once: `npm run film:chain -- <score>`. If a merge goes red, revert that file
only. Two fix rounds maximum.

**Critic rule:** a critic signs only with a file/frame, a measured number and one
required fix. A sign without evidence is not a sign.

**Critic checklist (seven areas, seven questions):**

| Area | Passes only if |
|---|---|
| colour | ≤4 roles + 1 accent; no drift shot to shot; saturation outliers <0.5% |
| ink/line | cut edge, not soft bloom; one line weight per layer; edge density in band |
| light/shadow | one declared key direction per scene; every contact shadow touches; no bloom fighting a hard shadow |
| texture/material | paper grain same scale at 1920 and 390; no stretched texture; every material named |
| character/rig | seam gap 0; feet planted; knees bent; eyes chosen for the pose; no plank arm or clipped hand |
| depth/framing | one ground line; one scale per depth; no floating prop; layer order/parallax consistent |
| motion/camera | every shot moves; no undeclared hold >0.4 s; action, not camera-only; entry/exit match |

This is a process, not a framework: git worktrees, one review file per area, the
existing commands. No parallel runtime, no agent server, no merge bot.

---

## 5. The build order (ten working sessions)

| Session | What | Proof |
|---|---|---|
| 1 | `voice --story` + `narration.json`; song lyric lines use the same clock; align the `--apply` 0.35 s and scene 0.3 s tolerances | a long line moves a shot, not the film; a moved boundary cannot make a green scene red |
| 2–3 | Asset library v1: files, hashes, licences, 12–16 expressions, 12 poses, `assets:new --score`, `assets:sheet`, `expression` through the painter; manifest covers and hashes every recipe/cast/slot asset; props declare w/h | asset sheet shows every expression and pose before the storyboard; the manifest names every drawn file |
| 4–5 | Measurement v2: `--regions`, `--camera`, `--bands`; robust contrast/saturation/edges; movement without cuts; film id + `videoHash`; review reads it | a per-region gap, a translation trace, and a match tied to this picture |
| 6 | Arm/hand audit, word-reaction check, pop-frame check | a plank arm fails; a late reaction fails |
| 7 | Split `canvas/recipes.js` by area; agent/critic workflow v1; run the seven analysis reports on the fixture | seven review files, one FIXLIST, no merge conflict |
| 8 | Close the bypasses: sealed legacy marker, `--skip-render`/`--from` tied reports, render requires all reports, gate fails on `pending`; hash story/beats/scenes and add the `writing` gate row | deleting the script fails the gate; a whole-film probe without checks is impossible |
| 9 | `story:new --idea` + facts/sources; `style:new --bible`; background reuse; 2K/vertical; readability checks | an idea produces a draft, not an invented fact; a measured render saving; a 2K file |
| 10 | The first new film, full chain, measured | one render, gate PASS, no human seal |

**Rule:** no new film until sessions 1–6 are done. Sessions 7–9 can run in
parallel with the first film's pre-production.

---

## 6. What we will not build

- A 3D renderer, unless a 3D style is chosen. It is a new backend, not a style
  contract.
- An AI video generator. The picture stays code-drawn.
- A plugin system, node graph, timeline editor or DAW.
- A scraper for “free models”. Assets come from a licensed library with a
  recorded source.
- A second engine.
- 59 styles. One style at a time, sealed before the next.
- Manual approval gates. The tool approves itself with checks; a person looks
  because they want to, not because the render is blocked.

---

## 7. Acceptance for the first new film

A film is ready to render only when:

1. story, beats, scenes, score and voice are in order and all checks pass;
2. the measured voice moved the cut, not the other way round;
3. every asset exists before the storyboard, with an expression and a pose;
4. the storyboard/collage is one page, self-checked, and measured against the
   reference;
5. the median shot is 2.5–3 s, the read is 140–150 wpm, coverage is ≥80% of
   measured speech, first line ≤1 s, no hole >2.5 s;
6. every shot moves and lands on the frame grid;
7. no arm/hand, type, rig, pop-frame or word-reaction defect; the quietest 3 s is at least 15 LU under the loudest; the gate speaks in words, seconds, LU and faces;
8. one full render, one delivered file, gate PASS, no manual row;
9. the whole loop is under 60 minutes.

---

## 8. Open choices for the user

1. **3D or paper?** Paper is built; a 3D style needs a renderer backend and a
   sprite/model library. Do we want that, or is paper the product for now?
2. **Free models:** do we allow CC0 external assets with a licence record, or
   keep everything code-drawn?
3. **Music:** original generated music, or licensed tracks? The song path needs
   a lyric clock either way.
4. **Expressions:** 14 like the video, or 8–12 that the paper face can actually
   draw?
5. **Agents:** run the 7+4 workflow manually (simple) or automate it with
   OpenCode subagents (more moving parts)?
