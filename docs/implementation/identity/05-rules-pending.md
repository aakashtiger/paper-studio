# 05 — The rules the score can prove, and the bypasses that stop it

**Date:** 4 November 2026
**Status:** implementation plan. No code, pack, score or check has been changed.
**Spec:** `docs/research/identity/KPOP-IDENTITY.md` v1.3 — §3.13 (motifs), §3.24
(variation), §3.26 (tone), §3.30 (performance frame), §5 (measurement),
§5.5 (acceptance).
**Pending items covered:** P0.5 (7-analysis / 4-rebuild), P0.7 (bypasses),
P0.9 (3 s LU contrast, LRA, close-up count). Also: semantic vision, music,
exact Uber financials.
**Depends on:** nothing. This work does not need the probe bbox, the region
grid or the recipes split.

---

## 0. The answer in one page

| Question | Answer |
|---|---|
| How many new commands? | **One**: `npm run identity:rules` → `build/<id>/identity-rules.json`. |
| How many new modules? | **One**: `src/engine/identity-rules.ts` (pure, no fs, no ffmpeg). |
| Where do the score fields live? | One optional `score.identity` block + two optional per-shot fields (`performance`, `framing`, `motifs`). `FilmScoreSchema` is `.strict()`, so the schema moves first. |
| Where does the history live? | `docs/identity/variation.json` — **not** `build/variation.json` (the spec's proposal): `build/` is gitignored, so a history there cannot refuse anything after a clone or a clean. |
| How is a fourth repeat refused? | `variation:fourth` at preflight, against the last three ledger entries, before a frame is painted. |
| Does P0.5 still apply? | **Partly.** The seven read-only analyses apply today and cost nothing. The four rebuild worktrees do **not** apply until `canvas/recipes.js` is split — and the split has a manifest hole (`manifest.ts:113` hashes one file). Do the analyses now, the split only when a rebuild round needs two agents. |
| Is P0.7 still open? | **Yes, and worse than recorded.** `--from/--to` and `--draft` default their output to `films/<id>/<id>.mp4` and overwrite the deliverable (`render-film.ts:722`). `reproduce` is inferred from the existence of an MP4 (`preflight.ts:205`). `film:review --from` is advertised in the usage and not implemented. |
| P0.9: where? | 3 s contrast and LRA in `src/engine/loudness.ts` → `mix.ts` + `deliver.ts` → **gate rows on the delivered file**. Close-up count in `identity-rules` → the `identity` gate row. |
| Semantic vision / music / exact Uber financials | All three **stay parked** and block nothing here. Stated reasons in §6. |

The identity contract becomes **pack 0.3.0**. A film without the block is
*pre-identity*: it can be reproduced, never re-rendered, and never passes the
`identity` gate row. No old film is rewritten.

---

## 1. The four readers

### 1.0 The shape they share

- **They read the score and the ledger, never the pixels.** Pixels belong to
  `style:measure`, `audit:palette`, `audit:type`, `audit:frames`. A fourth
  pixel reader would be a fourth opinion about the same frame.
- **Findings** are `{ code, message, shot? }` — the shape `visual:check` and
  `camera:check` already use.
- **The report** is one JSON, one command, one gate row:

```json
{
  "film": "uber-model",
  "score": "sha256:…",
  "videoHash": "sha256:…",
  "pass": true,
  "performance": { "…": "…", "findings": [] },
  "motifs":      { "…": "…", "findings": [] },
  "variation":   { "…": "…", "findings": [] },
  "forbidden":   { "…": "…", "findings": [] },
  "human": ["the show test", "…"],
  "findings": []
}
```

- **Two tiers, because paint order is not negotiable:**
  - *score-only* (≈0 s) — performance, motifs, variation, and the forbidden
    rows whose instrument is the score or the pack. **Preflight calls this**
    (one module call, not a child process), so a fourth-repeat film is refused
    before a browser opens.
  - *full* (≈0.3 s) — adds the forbidden rows whose instrument is a report
    (`palette`, `type`, `frames`, `motion`, `rig`). **`identity:rules` runs
    this**, post-delivery, tied to the picture hash. Same split as
    `visual:check` (pre-paint) vs `style:identity` (post-delivery).
- **No silent pass.** A missing block, a missing instrument, an unmeasured
  band or a missing history entry is a *finding*, never a blank.

### 1.1 Performance — §3.30

**Score fields**

```jsonc
"identity": {
  "contract": 1,
  "performance": {
    "mode": "presenter-show",          // stage-show | presenter-show | creature-show
    "signed": "Aakash",                // required for presenter/creature (V scope)
    "star": "Kiran",                   // a cast member
    "chorus": ["Vaz"],                 // ≤5 cast members
    "entrance": { "shot": "s01", "how": "from the back of the frame" },
    "exit":     { "shot": "s10", "how": "pullback" },
    "signatureMove": "the coin flick",
    "object": "the giant paper coin"   // the one scale anchor
  }
}
// per shot
"performance": "stage"                 // stage | detail
```

`setFamily` is **not** duplicated here — it lives in `variation` (§1.3).

**Algorithm** (pure; inputs: `identity.performance`, `cast`, `shots[].performance`,
`shot.direction.cast`, `beats.json` when present)

| # | Check | Refusal code |
|---|---|---|
| 1 | `mode` ∈ the enum; if not `stage-show`, `signed` is non-empty | `performance:mode` |
| 2 | `star` ∈ cast; `chorus` ⊆ cast, ≤5, `star ∉ chorus`; **every** cast member is star or chorus | `performance:cast` |
| 3 | every shot declares `performance` | `performance:mark` |
| 4 | `stage-share = stage shots / shots`; `stage-show` requires **≥0.60** | `performance:stage` |
| 5 | presenter/creature show: **every beat with a shot owns ≥1 stage shot** (`shot.beat`) | `performance:beat` |
| 6 | `detail-share ≤ 0.40` | `performance:detail` |
| 7 | shot 1 and shot N are not `detail` (a diagram is never first or last) | `performance:bookend` |
| 8 | `presence = shots with direction.cast.length>0 / shots ≥ 0.85` | `performance:presence` |
| 9 | `entrance.shot` and `exit.shot` exist, entrance index < exit index, and both stage the star | `performance:entrance` / `:exit` |
| 10 | `signatureMove` and `object` are non-empty | `performance:declared` |

**Thresholds:** 0.60 and 0.40 are the spec's invariant values (§3.30). 0.85 is
the spec's performer-presence figure — it is **basis R** (observed on the
reference), so it goes into `tokens.identity.performance.presenceMin` and the
pack owns it, not the code. The Uber film stages 9/10 (0.90) and would pass
this one while failing 4, 6 and 7.

**Human sign:** *the show test* — cover the narration and the plot; is there
still a performance? No number answers it.

### 1.2 Motif — §3.13

**Score fields**

```jsonc
"identity": {
  "motifs": [
    { "id": "coin",  "kind": "object", "meaning": "the fare is a promise that splits", "transforms": true },
    { "id": "route", "kind": "device", "meaning": "the trip is the argument" }
  ]
},
// per shot — the only place a use is counted
"motifs": ["coin", "route"]
```

One source of truth: the **shot** says where a motif appears; the declaration
says what it is and what it means. `meaning` is not a second count.

**Algorithm**

| # | Check | Refusal code |
|---|---|---|
| 1 | `3 ≤ declared ≤ 5` | `motif:count` |
| 2 | every shot id is declared; every declared id is used | `motif:unknown` / `motif:unused` |
| 3 | each motif `uses ≥ 2` | `motif:recurrence` |
| 4 | at least one motif `uses ≥ 3` | `motif:recurrence` |
| 5 | `uses / shots ≤ 0.40` for every motif | `motif:dominant` |
| 6 | at least one `kind:"object"` with `transforms:true` (a semantic object with an arc) | `motif:semantic` |
| 7 | `meaning` has ≥4 words (the `visual.why` floor) | `motif:meaning` |

No cast-ornament exemption is needed: an ornament is not in `shots[].motifs`,
which is exactly why the field is explicit.

**Human sign:** whether the declared meaning is legible on screen. The machine
proves the motif recurs and is rationed; it cannot prove it *means* anything.

**Not checked, deliberately:** a "default sunflower / banner / lamp" scan.
`visual:check` already refuses the pack's default opening card, and the
variation ledger already refuses the same motif set twice. A third text rule
would be a third opinion about the same word.

### 1.3 Variation — §3.24

**Score fields** — seven declared, five derived. Nothing is stored twice.

```jsonc
"identity": {
  "variation": {
    "structure": "rise-and-fall",              // declared: rise-and-fall | loop | question-answer | chase | descent
    "setFamily": ["stage", "desk"],            // declared, 1-3
    "fieldScript": ["kraft", "marigold", "cobalt", "cream"],  // declared, 3-5, one per act
    "text": ["stack", "stamp"],                 // declared, 1-3
    "opening": "world-reveal",                  // declared
    "closing": "pullback",                      // declared
    "signatureShot": "the coin splits into two layers and the duo steps through"
  }
}
```

| Axis | Source | Rule vs the previous film |
|---|---|---|
| structure | declared | must differ |
| set family | declared | ≥1 family the previous film did not use |
| field script | declared | no repeated field **in the same position**; not identical |
| cast instance | derived (`cast[].character`, lowercased, sorted) | must differ |
| motif set | derived (`identity.motifs[].id`, sorted) | symmetric difference ≥2 |
| camera | derived (`shots[0].camera.move`, `shots[N].camera.move`, from the **resolved** score) | opening **and** closing must differ |
| text | declared | ≥1 behaviour not in the previous set; not identical |
| transitions | derived (distinct `transitionOut`, sorted) | sets differ |
| opening | declared | must differ |
| closing | declared | must differ |
| sound | derived (`clock.mode` / `audio.mode` → `voice-led` \| `song-led` \| `foley-led`) | must differ |
| signature shot | declared | differs as a string; *unlike any shot in the last film* is human |

**The history file**

- **Where:** `docs/identity/variation.json`, committed, reviewed, one file.
  The spec proposed `build/variation.json`; `build/` is in `.gitignore`, so
  that file would vanish on a clone, a `git clean` or a CI checkout — a
  history that cannot outlive the workspace cannot refuse a repeat.
- **Shape:**

```json
{
  "$schema": "paper-studio/variation-history@1",
  "entries": [
    {
      "film": "uber-model",
      "at": "2026-11-04",
      "score": "sha256:…",
      "pictureHash": "sha256:…",
      "values": {
        "structure": "rise-and-fall",
        "setFamily": ["desk", "stage"],
        "fieldScript": ["kraft", "marigold", "cobalt", "cream"],
        "cast": ["kiran", "vaz"],
        "motifs": ["coin", "phone", "route", "stamp"],
        "camera": { "open": "orbit", "close": "pull_back" },
        "text": ["stack", "stamp"],
        "transitions": ["cut"],
        "opening": "world-reveal",
        "closing": "pullback",
        "sound": "voice-led",
        "signature": "the coin splits"
      }
    }
  ]
}
```

- **How it is written:** `npm run identity:rules -- <score> --record`.
  - Refuses unless `films/<id>/<id>.mp4` exists **and** `build/<id>/deliver.json`
    names a picture hash equal to that file's `videoHash`. A film that never
    shipped does not consume a slot.
  - Appends one entry. An existing entry for the same film with **identical**
    values is a no-op (idempotent, so a re-run is safe); with **different**
    values it refuses (`history:rewrite`) — the ledger is append-only.
  - Refuses to record a film the check itself refuses.
  - `at` is written once, on insert, and never updated.
- **How a fourth repeat is refused:** `variation:fourth`. For each of the 12
  axes, if the film's value equals the value in **all three** of the last three
  entries, the film is refused at preflight with the axis, the three films and
  the value named. This is the spec's literal rule ("a fourth use of the same
  value"). It cannot fire on fewer than three entries; a ledger with 0–2 films
  prints `history: 2 films` and passes with a warning.
- **The oscillation hole, named:** A B A B never trips the fourth-use rule.
  So a second, *warning-only* rule exists: if a value appears in 2 of the last
  3 entries, print `variation:oscillation` ("the channel is alternating between
  two templates"). It does not refuse, because the spec's rule does not; it is
  visible in the report and in `film:review`.
- **Who may edit it:** a person, in review. A hand edit is a diff, and a diff
  is reviewable. There is no server, no lock file, no database.

**Retro-fit:** none. The ledger starts empty; the first film made under the
contract is entry 1 and the check prints "no history — this film sets the
baseline". Seeding it from the Uber film would need an `identity` block in
`films/uber-model/score.json`, which changes the hash of a delivered film's
score and breaks its own `inputsHashed` row. Not worth it.

### 1.4 Forbidden — §3.25

The list lives in the **pack**, not the score:
`styles/paper-kpop/tokens.json` → `identity.forbidden[]`:

```jsonc
{ "id": "dissolve", "instrument": "score", "why": "the base is always a cut" }
```

`checkForbidden` **does not re-measure anything**. It maps each ban to the
instrument that already answers it, reads that report, and requires it to
exist, to pass, and to be tied to this film. An unknown instrument, or a ban
with no instrument, is a refusal (`forbidden:none`) — that is the rule that
stops the list becoming decoration.

**Today's coverage, honestly:**

| Ban (§3.25) | Instrument today | Machine? |
|---|---|---|
| 5 dissolve / star wipe | `score` (`transitionOut`) | **yes** |
| 14 same opener / closer / set / motifs | `variation` | **yes** |
| 15 camera 3× in a row, pan `from=to`, 3D orbit | `camera:check` | **yes** |
| 17 dead hold >0.4 s | `audit:frames` | **yes** |
| 11 lyric wall (>8 words, >2 boxes, >2 systems) | `audit:type` | **yes** |
| 19 unlicensed font / track / meme sound | `assets:check` + `sfx` kinds | **yes** |
| 4 DOF / bokeh / motion blur | `schema` (`identity.depth.blur:0` + forbidden flags) | **yes** (once the tokens exist) |
| 9 static shot / camera-only | `camera:check` (static) + `audit:motion` (camera-only: **not separated**) | **partial** |
| 10 text over the face | `audit:type` proves the safe area, not the face | **partial** |
| 20 claim not in the brief | `writing` row + `mustSay` | **partial** |
| 6 side bars / cream plate + wings | **none** | **no** — the largest measured Uber gap |
| 7 blue figure on blue field | **none** (no figure bbox) | **no** |
| 1 glossy 3D, 2 photo faces / fingers, 3 soft shadow, 16 floating prop, 17 pose-swap, 18 rounded UI card | human | **no** |

So v1 ships **7 machine bans, 3 partial, 10 human**. The two that matter most
(bars, blue-on-blue) need a figure bbox or a column test; §7 lists the cheap
column test as optional step S5b and states its cost. **If the user does not
want it, the ban becomes a named human row — it does not become a silent pass.**

### 1.5 What a machine can prove, and what a person must sign

| Area | Machine | Human |
|---|---|---|
| Performance | mode, cast roles, stage/detail share, presence, entrance/exit shots, first/last not a diagram | the show test; does the star *address* the audience; does the entrance read as an entrance |
| Motif | count, recurrence, cap, semantic object declared, meaning has words | does the motif mean what it says; is the transformation an arc or a cut |
| Variation | 12 axes, 3-film ledger, fourth use, oscillation warning | is the signature shot *unlike* the last film's, not merely a different string |
| Forbidden | 7 bans, 3 partial | 10 bans, incl. bars and blue-on-blue until an instrument exists |
| Tone (§3.26) | nothing | the eight beats, the tender beat, sweet-sinister |
| Archetype (§3.9) | construction, joints, poses, expressions, anchors | "a performer, not an office worker"; face readable at 390 px |
| Close-ups (§5.1) | tiers, count, band | whether the close-up is on a *face* and earns its place |

`film:review` prints the `human[]` list as its manual rows. Nothing in that
list is hidden by a green gate.

---

## 2. One module, one script — recommended

**`src/engine/identity-rules.ts`** + **`scripts/identity-rules.ts`**. Not four
scripts.

Why one module: it has **two callers** — `preflight` (score-only, before the
paint) and the command (full, after delivery). Four scripts would mean preflight
shells out four times, reads four reports, and the gate grows four rows for one
question ("is this still the channel?"). One module gives one function per axis
(`checkPerformance`, `checkMotifs`, `checkVariation`, `checkForbidden`) and one
`checkIdentity(input): IdentityReport` that composes them — testable in
`test/identity-rules.test.ts` with plain objects, no browser, no ffmpeg.

Why one script: the four readers share one score parse, one pack read, one
ledger read, one report, one gate row. The repo's precedent is exact —
`visual:check` is one command for one question with nine finding codes.

```
npm run identity:rules -- films/<id>/score.json [--json] [--record]
```

`--record` is the only writer, and it writes `docs/identity/variation.json`,
never a report.

**Preflight integration is an import, not a spawn:**

```ts
import { checkIdentity } from "./identity-rules.js";
const identity = checkIdentity({ score, pack, history: readHistory(root), delivered: false });
```

Cost: 0 ms. Value: a fourth-repeat film never reaches a browser.

---

## 3. P0.5 — is the 7-analysis / 4-rebuild workflow still applicable?

**Yes for analysis, no for rebuild — and the difference is one file.**

### 3.1 What changed since the plan was written

- The checks now speak in numbers (`audit:*`, `camera:check`, `visual:check`,
  `style:identity`), so a reviewer has evidence to read instead of opinion.
- `styles/paper-kpop/canvas/recipes.js` is **still one file**: 2,276 lines,
  100 KB, holding type helpers, camera easing, cast, poses, sets (office and
  explainer) and all fourteen recipes.
- `src/engine/manifest.ts:113` hashes **exactly one painter file**
  (`canvas/recipes.js`). A split into five files would leave four of them
  unhashed, and `inputsHashed` would still say "painter: hashed". That is a new
  silent pass, not a refactor. **The split is blocked on the manifest, not on
  the painter.**

### 3.2 What to do now (costs ~half a day, no code)

**Phase A — seven read-only analyses, one checkout.** This part is safe today
because each agent writes exactly one file and nothing else.

```
reviews/<film>/
  colour.md  ink-texture.md  light-shadow.md  character-rig.md
  depth-framing.md  motion-camera.md  text.md
  FIXLIST.md
```

Each file: fixed rows `shot | time | frame/file | severity | evidence command |
one fix`. Every row names a command that shows the defect; a row with no command
is rejected by triage.

**Phase B — director triage.** `FIXLIST.md`: one row per accepted finding with
one owner and one target file. `score.json` stays director-only.

**Phase C — at most TWO rebuild agents until the split lands,** disjoint by
directory, not by area: one on `films/<id>/**`, one on `styles/<pack>/**`.
Never two agents in one directory.

**Phase D — merge one file at a time**; `npm run preflight` after each,
`npm run inspect` after each agent. Two fix rounds maximum.

### 3.3 The split, when a rebuild round actually needs it

Do it in this order, as one contract change:

1. `manifest.ts:113` becomes "every `styles/<style>/canvas/*.js`, sorted" —
   one entry per file, so a missed file is visibly absent.
2. A test: every `<script src>` in `films/<id>/index.html` appears in
   `renderInputs` (this is the guard that makes the split safe).
3. Then split: `type.js`, `cast.js`, `sets.js`, `light.js`, `camera.js`,
   `recipes.js` (registry). Load order in `index.html`; classic scripts, no
   modules — the painter is injected and wrapped by `paint-probe.js`, which
   depends on `window` functions.
4. `npm run determinism` before and after: the same 30 frames, byte for byte.
   A split that changes a frame is a split that changed the painter.

**Recommendation: park §3.3 until a second rebuild agent is actually blocked.**
The seven analyses do not need it.

### 3.4 Prompts (three templates, no framework)

```
ANALYSE — read only. Read <evidence list>. Write only reviews/<film>/<area>.md.
One row per finding: shot | time | frame/file | severity | evidence command | one fix.
No fix without a command that shows it. Do not edit any other file.

TRIAGE — read the seven reviews. Write reviews/<film>/FIXLIST.md.
One row per accepted finding: id | finding | owner | target file | proof command.
Reject with a reason. score.json is director-only.

REBUILD — change only <file>. Run <proof command> after every change.
Never touch score.json, tokens.json, or a sealed input. If the proof fails twice, stop and report.
```

---

## 4. P0.7 — every bypass, the guard, and where it goes

Line numbers are from the current tree (4 Nov 2026).

### 4.1 The list

| # | Bypass | Where | Guard to add |
|---|---|---|---|
| 1 | `reproduce` is inferred from the existence of an MP4, so deleting a script is legal for any delivered film | `scripts/preflight.ts:205`, `:227`, `:314`; `src/engine/preflight.ts:270` (story), `:287` (scenes), `:342` (pacing) | Replace with a **sealed marker in the score**: `legacy: { since, reason, signedBy }`. A legacy film (a) keeps the warn path, (b) is **refused by `render:film` for a whole-film paint** (`render-film.ts:745`), (c) is named `reproduction` in the report. Deleting the script of a non-legacy film is now a hard `story:missing`. |
| 2 | `--skip-render` only checks the file exists | `scripts/film-chain.mjs:34`, `:158` (`skip`), `:202–207` | Require `build/<id>/render-manifest.json` and: `manifest.videoHash === videoStreamHash(deliverable)`, `manifest.score === sha256(score)`, and every render-gate report present and tied (see #7). An adopted picture must be a picture the gates approved. |
| 3 | `--from <step>` skips the prefix entirely (tests, preflight, determinism) | `scripts/film-chain.mjs:35`, `:209–215` | Before starting, for every skipped step, require its report and `mayReuse()` (`src/engine/review.ts:44`) to pass. A skipped step with no report is a refusal naming the command to run. `--from gate` becomes legal only when the picture and every report are this film's. |
| 4 | A slice (`--from/--to`) writes to the **deliverable path** by default, overwriting the film with 2 s | `scripts/render-film.ts:722` (`output` default), `:850` (encode), `:853–856` | (a) A probe's default output is `build/<id>/probe-<from>-<to>.mp4`; `--out` equal to `films/<id>/<id>.mp4` is refused for a probe. (b) Gates apply unless the slice lies inside **one shot** (`from`/`to` within `[shot.start, shot.end]`, ±1 frame) — `--from 0.01 --to 29.99` is therefore a whole-film paint and must pass them. |
| 5 | `--draft` is ungated and also defaults to the deliverable path | `scripts/render-film.ts:745`, `:722` | (a) Same output guard as #4. (b) Require the **score-only** checks (`audit`, `preflight`, `visual:check`, `identity:rules` score tier) — ~1 s. Keep the paint probes off a draft: the draft exists to be cheap. |
| 6 | `--stills` can paint a whole film | `scripts/render-film.ts:727–733`, `:772–817` | **No guard.** A stills pass writes no manifest and returns before the encoder, so it can never become a deliverable. It is a measurement instrument (`inspect`, `determinism`, `audit:rig` all call it with 30–600 times). Capping it would break those. Recorded here so nobody "fixes" it later. |
| 7 | A whole-film paint needs only visuals, style-identity, preflight, collage, motion — not determinism, type, rig, sfx, mix | `scripts/render-film.ts:745–751` | Add `requireDeterminism`, `requireTypeRig` (read `build/<id>/type-audit.json` + `rig-audit.json`, compare `score`), `requireSfx`, `requireMix` (compare the cue set hash and the master hash). All exist before the paint in the chain (`film-chain.mjs:147–155`); a manual render now has to run them. |
| 8 | `camera:check` and `assets:coverage` are chain steps, not render gates — a manual render skips them | `scripts/film-chain.mjs:126`, `:129`; absent from `render-film.ts:745` | **Move them into preflight** (both are score-only, <0.2 s). Preflight's docstring already claims "every cheap check"; make it true. One gate, not two. Same for `visual:check` and the score tier of `identity:rules`. |
| 9 | `gate:7` reads `type?.pass` and `rig?.pass` without comparing the score hash, so a report from before an edit passes | `scripts/gate-7.ts:566–571` (`typeSafeArea`), `:572–587` (`rigSeam`) | Compare `type.score` and `rig.score` to `sha256(score)`; the reports already carry it (`scripts/type-audit.ts:247`, `scripts/rig-audit.ts:409`). |
| 10 | `audit:reaction --allow-none` passes a film that authored no reaction at all | `scripts/reaction-audit.ts:26`, `:37` | Allow `--allow-none` only when `score.legacy` is set (same marker as #1). A new film with no `word` event fails. |
| 11 | `film:review --from` is advertised and **not implemented** | `scripts/film-review.ts:9` (usage only; no body reference) | Delete it from the usage. If it is wanted later, it must carry the same tie requirement as #3. A phantom flag is worse than no flag: it teaches the reader that the review can be shortened. |
| 12 | `gate:7` passes with ASR pending | `scripts/gate-7.ts:645` | **Already closed** (`pass = failed.length === 0 && pending.length === 0`). Listed so it is not re-opened. |
| 13 | `deliver` accepts a picture with no manifest | `scripts/deliver.ts:118–133` | **Already closed.** Listed because it is the model the other guards should copy. |

### 4.2 The one-line proof for each guard

| # | Proof |
|---|---|
| 1 | `mv films/uber-model/uber-model.mp4 <tmp>` → `npm run preflight -- films/uber-model/score.json` exits 1 with `story:missing` and `scenes:missing` |
| 2 | `npm run film:chain -- <score> --skip-render` with a manually replaced MP4 → refused, "the picture is not the one the render wrote" |
| 3 | `--from gate` after editing the score → refused, "preflight.json describes a different score" |
| 4 | `npm run render:film -- <score> --from 0.01 --to 29.99` → gates run; `--from 1 --to 2` writes `build/<id>/probe-1-2.mp4` and leaves the film untouched |
| 5 | `--draft` on a score with a red preflight → refused before the browser |
| 7 | `render:film` on a film with no `type-audit.json` → refused, names `npm run audit:type` |
| 8 | `rm build/<id>/camera.json; npm run preflight -- <score>` → refused with `camera:*` or "no camera check" |
| 9 | edit one shot's duration without re-running `audit:type` → `gate:7` fails `typeSafeArea` ("measured a different score") |
| 10 | a narration film with no `event.word` → `audit:reaction` fails without `legacy` |

**Effort:** 1 day for #1–#11, including the negative tests. This is the cheapest
day in the plan and the one that protects every other day.

---

## 5. P0.9 — sound and the close-up, in viewer units

### 5.1 The 3 s loudness contrast

**Measurement** — new function in `src/engine/loudness.ts`, beside
`measureLoudness` (one meter, one parser — the module's own doctrine):

```ts
export function measureShortTerm(binary: string, input: string): {
  window: 3; samples: number; min: number; max: number; contrast: number;
  p10: number; p90: number; span: { from: number; to: number };
}
```

ffmpeg reads `lavfi.r128.S` (the short-term value, itself a 3 s window, emitted
every 100 ms) through `ebur128=metadata=1,ametadata=mode=print`:

```
ffmpeg -hide_banner -nostats -i <file> \
  -af "ebur128=metadata=1:peak=true,ametadata=mode=print:key=lavfi.r128.S:file=-" \
  -f null -
```

- **Drop the first 3 s** — the window is not full and ffmpeg reports −70.
- **Drop the last 3 s** — the master's 0.5 s tail fade to ≤ −60 dBFS would
  otherwise make every well-mastered film pass the contrast rule vacuously.
  This is the one detail that decides whether the rule can fail.
- `min` and `max` are the quietest and loudest 3 s windows **in the body**;
  `contrast = max − min`.
- Fewer than 10 usable samples (a film under 13 s) is `contrast:short`, a
  refusal, never a pass.

**Where it is measured:** on the **delivered file**, in `scripts/deliver.ts`
(the mix measures the WAV; AAC changes the noise floor at the quiet end). The
mix also records it for the master, so a director sees the loss at the encode.

**Gate:** `gate-7.ts` row `soundContrast`:

```ts
ok: deliver?.output?.audio?.contrast?.ok === true && deliver.output.videoHash === frozenHash
detail: `quietest 3 s ${min.toFixed(1)} LUFS · loudest ${max.toFixed(1)} · contrast ${contrast.toFixed(1)} LU (floor ${floor})`
```

**Threshold:** `contrast ≥ 15 LU`, from PLAN-v2 §Stage 11. It lives in
`tokens.identity.sound.contrastMin`. **Uber-model will fail this row** (one
level, 9 cues, a narration bed): that is the point of the band, and it is
recorded here rather than discovered later.

### 5.2 LRA

- `loudness.ts` already returns `lra` from `ebur128`'s summary, and `deliver.ts`
  already stores it (`output.audio.lra`). Nothing new is measured; a row is
  added.
- **Band:** `tokens.identity.sound.lraMin = 4` (LU), `lraMax = null` for now.
  Basis: the reference song is **LRA 6.0** (§3.21); Uber-model measures **1.9**
  on both master and delivered file. A floor of 4 is the smallest number that
  refuses a flat bed and passes a film with one quiet act. An upper bound is
  **not invented**; the pack adds one when a film measures one.
- **Gate row** `lra`: `lra ≥ lraMin`, on the delivered value.
- **Consequence, stated:** Uber-model fails `lra` and `soundContrast`. Two new
  red rows on the one green film. That is the same trade as 0047 (Same Alarm
  fails `writing` rather than being re-rendered); the alternative is a band
  that passes the film it was designed to catch, which §5.5 rule 4 forbids.

### 5.3 The close-up count

**Field:** `shots[].framing` ∈ `wide | insert | medium | close | extreme`
(§3.6's four tiers, with `insert` split out because a hand insert is a detail,
not a close-up).

**Reader:** `identity-rules`, §1.1's neighbour — it is a declaration like
`performance`, not a sound measurement.

| # | Check | Code |
|---|---|---|
| 1 | every shot declares `framing` | `framing:missing` |
| 2 | ≥3 distinct tiers in the film | `framing:tiers` |
| 3 | `closeUps = close + extreme`; `share = closeUps / shots` in **[0.20, 0.60]** | `framing:closeUps` |
| 4 | ≥1 `close` or `extreme` reaches the film's last third (the face at the turn) — a warning, not a refusal | `framing:late` (warn) |

For 10 shots the band is 2–6 close-ups; the identity target mix is 40–55%, so
the band is the target ± a margin that can fail at both ends. Printed:
`3 close-ups of 10 (30%) · tiers wide/medium/close`.

**Where:** computed in `identity-rules`, printed in `identity-rules.json`,
read by the `identity` gate row. **Not** `audit:frames`: it decodes luma, it has
no subject box. When the paint probe records a character bbox (spec §8.2 item
4), `style:identity` can compare the *declared* framing to the *measured*
height — that is a follow-up, not this plan.

---

## 6. Semantic vision, music, exact Uber financials

| Item | Blocks identity work? | Why |
|---|---|---|
| **Semantic vision** (does the joke land, does the face read as an idol) | **No — stays parked.** | Every rule in §1 is a declaration the score can carry plus an instrument that already exists. A vision model would answer the `human[]` column; it would not make one field in §1 more checkable. The identity spec's own open question 4 says the same. |
| **Music** | **No — stays parked.** | `variation.sound` derives from `clock.mode`/`audio.mode`; a song film would add `song-led` to an existing enum. Nothing in §1 assumes narration. The `lra` and `contrast` bands are voice-led values; a song film declares its own (the reference's −15.6 LUFS / LRA 6.0 is basis **R**, not a target). |
| **Exact Uber financials / take rate** | **No — stays parked, permanently.** | A number the brief does not contain is an invented fact. The identity rules read `identity`, never a figure. |

---

## 7. Order and effort

Half-days (½). Six steps, ~4½ days, each with a command that proves it.

| # | Step | Effort | Proof command |
|---|---|---|---|
| **S1** | **Schema + pack.** `src/engine/treatment.ts`: `IdentitySchema` (performance, motifs, variation, contract), `shots[].framing`, `shots[].performance`, `shots[].motifs`, `legacy`. `styles/paper-kpop/tokens.json`: `identity.performance`, `.motifs`, `.forbidden`, `.sound`, `.composition`. Pack 0.2.0 → 0.3.0. Decision `0053-the-identity-contract-is-a-score-block.md`. | ½ | `npm run typecheck` · `npm test` · `npm run preflight -- films/uber-model/score.json` → **unchanged, PASS** (the block is optional) |
| **S2** | **The module + the command.** `src/engine/identity-rules.ts`, `scripts/identity-rules.ts`, `npm run identity:rules`, `test/identity-rules.test.ts`, `docs/identity/variation.json` (empty ledger). | 1½ | each refusal in the unit test: a 4th `structure`, a motif in 5/10 shots, `detail` 5/10, a cast member with no role, a ban with no instrument, a ledger rewrite; `npm run identity:rules -- films/uber-model/score.json` prints `pre-identity film · 4 human rows` and exits 0 |
| **S3** | **Wiring.** preflight imports the score tier; `gate:7` row `identity`; `film:review` step with a `score` tie; `film:new` writes `identity.contract: 1` and lists the gaps. | ½ | `npm run film:new -- --brief <new brief>` → the score carries `identity.contract` and `filmGaps` names 7 identity fields; `npm run film:review -- <score> --gate` prints the identity row |
| **S4** | **P0.7 (§4).** Eleven guards; one decision `0054-the-order-cannot-be-skipped.md`. | 1 | the 8 negative tests in §4.2 |
| **S5** | **P0.9 (§5).** `measureShortTerm`, mix + deliver fields, rows `soundContrast` + `lra`, `framing` reader. | 1 | `npm run mix -- <score>` prints `contrast 4.2 LU` on a flat master → `deliver` exits 1; `npm run gate:7` prints `soundContrast FAIL` and `lra FAIL` for uber-model, by name |
| **S6** | **P0.5 v1 (§3.2).** `reviews/uber-model/` — seven files + `FIXLIST.md`; `docs/implementation/identity/REVIEW-PROMPTS.md`. | ½ | `ls reviews/uber-model/*.md` → 8 files; every row names a command that runs |
| **S5b** *(optional)* | **The bar test.** In `audit:palette` (same 160×90 decode, every frame): a vertical edge strip in the outer 5% that is uniform (≥85% of pixels within ±6 of the column mean) in ≥80% of frames and differs ≥10 luma from the inner region → `bars`. | ½ | a frame with a 19% bar fails `audit:palette`; the reference passes. Without S5b, `forbidden:side-bars` is a **human** row (§1.4) |

**Order rule:** S1–S3 before S4 (the guard list needs `identity-rules` to exist
for #8); S4 before S5 (the gate rows must be tied before new rows are added);
S6 anytime.

**Total: 4½ days** (5 with S5b). One new command, one new module, four new gate
rows (`identity`, `soundContrast`, `lra`, and the `type`/`rig` ties).

---

## 8. Over-engineering, named

Rejected, with the reason, so it is not re-proposed:

1. **Four scripts, one per axis.** Four score parses, four reports, four gate
   rows, four review lines for one question. One module with four functions.
2. **A history service, a lock file, a database.** One committed JSON, written
   by one flag, reviewed like any other file.
3. **`build/variation.json`** (the spec's own proposal). Gitignored; a history
   that disappears cannot refuse.
4. **A motif detector on pixels.** A motif is a meaning; the score declares it,
   the frame shows it, a person judges it. A CV model here is a second opinion
   with no ground truth.
5. **Measuring "is this a stage?"** from the frame. The show test is human.
6. **Deriving `framing` from the probe bbox now.** The probe has no bbox. A
   declared framing that a later measurement can contradict is honest; a
   fake measurement is not.
7. **An invented LRA upper bound.** Floor only, until a film measures one.
8. **Splitting `canvas/recipes.js` before a rebuild needs it.** It is a
   contract change with a manifest hole (`manifest.ts:113`). Analyses do not
   need it.
9. **A "variation agent" that proposes choices.** The check refuses; the
   director chooses. An agent that chooses is a second director.
10. **Twenty forbidden rows in the score.** The bans live in the pack; the film
    is checked against them. A per-film copy drifts.
11. **Gating `--stills`.** It cannot produce a deliverable. A cap would break
    `inspect`, `determinism` and `audit:rig`.
12. **A signature file for the human rows.** The rows are printed by
    `film:review`. If the creative owner wants a sign, it is a later decision,
    not a mechanism to build now.

---

## Appendix A — the score block, copy-paste

```jsonc
"identity": {
  "contract": 1,
  "performance": {
    "mode": "presenter-show",
    "signed": "",
    "star": "",
    "chorus": [],
    "entrance": { "shot": "", "how": "" },
    "exit": { "shot": "", "how": "" },
    "signatureMove": "",
    "object": ""
  },
  "motifs": [],
  "variation": {
    "structure": "",
    "setFamily": [],
    "fieldScript": [],
    "text": [],
    "opening": "",
    "closing": "",
    "signatureShot": ""
  }
}
```

`film:new` writes exactly this, empty, and `filmGaps` names each field. It
invents nothing — the same contract `storySkeleton` and `scenesSkeleton` already
keep.

## Appendix B — the report, one row per axis

```jsonc
{
  "film": "…", "score": "sha256:…", "videoHash": "sha256:… | null",
  "contract": 1, "pass": false,
  "performance": {
    "mode": "presenter-show", "shots": 10, "stage": 7, "detail": 3,
    "stageShare": 0.7, "presence": 0.9,
    "star": "Kiran", "chorus": ["Vaz"],
    "entrance": { "shot": "s01", "stagesStar": true },
    "exit": { "shot": "s10", "stagesStar": false },
    "findings": [{ "code": "performance:exit", "message": "…", "shot": "s10" }]
  },
  "motifs": {
    "declared": 4, "used": 4,
    "rows": [{ "id": "coin", "kind": "object", "uses": 4, "share": 0.4, "transforms": true }],
    "findings": []
  },
  "variation": {
    "axes": [{ "id": "structure", "value": "rise-and-fall", "source": "declared",
               "last": ["loop", "rise-and-fall", "loop"], "usesInLastThree": 1,
               "rule": "differs", "ok": true }],
    "history": { "path": "docs/identity/variation.json", "films": ["…"], "recorded": false },
    "findings": []
  },
  "forbidden": {
    "rows": [{ "id": "dissolve", "instrument": "score", "evidence": "0 dissolves", "ok": true }],
    "human": ["side-bars", "blue-on-blue", "office-lead"],
    "findings": []
  },
  "human": ["the show test", "the motif's meaning", "the signature shot is unlike the last film"],
  "findings": []
}
```
