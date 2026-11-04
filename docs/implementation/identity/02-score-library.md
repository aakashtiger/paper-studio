# 02 — Score and library data for the K-pop identity

**Status:** implementation plan, not implemented.
**Date:** 4 November 2026.
**Inputs:** `docs/research/identity/KPOP-IDENTITY.md` (v1.3, research), `docs/research/identity/kpop-identity.proposed.json` (1.3.0), `docs/research/identity/critique-creative-v4.md`, `docs/research/identity/critique-technical-v4.md`.
**Current code:** `src/engine/treatment.ts`, `src/engine/pose.ts`, `src/engine/library.ts`, `src/engine/camera.ts`, `src/engine/film-new.ts`, `scripts/style-identity.ts`, `scripts/library-check.ts`.
**Decision this needs:** a `contract-change` PR, proposed as **0053 — the score carries the performance frame** (see §11).

---

## 0. The one-page answer

1. **Add the fields to the existing documents, not to a new file.** `score.json` gains a film-level
   `performance`, `paletteScript`, `motifs` and five optional shot/event fields. `poses.json` gains a
   character-level `archetype`, `appearance`, `stageRoles`, `thumbOptional`, `visualHeadToBody`,
   `headOrnamentDiameterPct`.
2. **No `identityVersion`, no migration.** Every new field is optional and every absent film keeps
   parsing. **Presence of `score.performance` is the claim**: a film that writes it opts into every
   new rule; a film that does not is reported as `identity:unwritten` and is judged exactly as it is
   today. This is one marker, not a number, and it cannot be cherry-picked field by field.
3. **The schema is small.** Three film-level blocks, four shot fields, three event fields, six
   library fields. No 200-field schema, no `acts.json`, no second camera vocabulary, no new command.
4. **The checks do not repaint and do not touch `score-data.js`.** The new checks read the raw score
   and the pose files; `ResolvedFilm` gains no field except `camera.keys` (which is absent on every
   old score, so the generated page data is byte-identical — guarded by `test/score-data.test.ts`).
5. **The delivered Uber film is not edited.** Its `render-manifest.json` pins the sha256 of the score
   and of both pose files; editing either makes the manifest describe a different tree, and
   `render:film` cannot restore it because the new identity check would refuse the film. The exact
   migration is written down in §8 and applied only when the film is rebuilt.

---

## 1. Scope

**In scope**

- The Zod schemas for the film-level and character-level identity data.
- The rules that read them, in the existing commands: `style:identity`, `camera:check`,
  `library:check`, `preflight`'s existing resolver, and `film:new`.
- The exact `Kiran`/`Vaz` profile and the exact Uber migration text.
- Tests in the four named files (plus one camera test file, because that is where the camera rule
  lives).

**Out of scope, deliberately**

- Painting `camera.keys` (the painter change is a separate, measurable step; until it lands a score
  may declare keys and the picture will still move by `from`/`to` only — §11 risk 6).
- The per-shot frame report (drawn card bounds, field component, local contrast). Without it the
  field/placement/contrast/motif **paint** claims stay declarations. This plan says so in the report.
- Changing signed pack values (`maxCast`, `maxColours`, `CAMERA_MOVES`, `dimension`). Those are a
  pack 0.3.0 decision, not a data decision.
- `identityVersion`, per-film migration scripts, a second identity file, a new `identity:check`
  command (technical-v4 §8: one report, existing readers).
- The first `paper-pop-performer` character. Kiran and Vaz stay workers; the library will say so.

---

## 2. How old scores stay valid — the recommendation

**Recommendation: optional fields with explicit empty defaults. No `identityVersion`. No migration.**

The rule in one sentence:

> A film **claims** the v1.3 identity by writing `score.performance`. If it does not, it is reported
> as `identity:unwritten` and the new rules do not run. If it does, every new rule runs, and every
> missing field is a finding.

### Why not a version

| Option | Why not |
|---|---|
| `identityVersion: "1.3"` on every score | It is a second source of truth for the same fact (the presence of the block). It forces a table of "which checks run at which version" that nothing else in the repo needs, and it makes a film's validity depend on a number rather than on its content. |
| A migration script | It would rewrite delivered scores whose sha256 is pinned in `render-manifest.json` and `gate/`. That is the exact cost this plan avoids (§7, §11). |
| Required fields with no default | `FilmScoreSchema` is `.strict()`; a required field would refuse every film before the first one is written, and `film:new` could not emit a legally shaped skeleton. |
| A per-film `--identity` CLI flag | A flag is a claim that lives outside the film. The score is the contract; the claim belongs in it. |

### What stays valid, and how it is proved

1. `FilmScoreSchema.parse` on `films/same-alarm`, `films/understudy` and `films/uber-model` does not
   throw. `performance` stays `undefined`; `paletteScript` and `motifs` default to `[]`.
2. `resolveFilm` returns the same shots, the same errors and the same warnings.
3. `scoreDataText(root, "films/understudy/score.json")` is **byte-identical** to the checked-in
   `films/understudy/score-data.js`. This is already asserted by `test/score-data.test.ts`; it is the
   guard that the new fields did not leak into the resolved plan.
4. `npm run style:identity -- films/uber-model/score.json --video` still **passes** the look and cast
   checks, and prints `identity: unwritten — this film does not claim the performance frame`.
5. `npm run film:new` writes `performance` for every new film, so a new film cannot silently omit it;
   `filmGaps` names every field inside it.
6. `film:review --gate` and `gate:7` read the same `pass` field, so an unclaimed film's gate result is
   unchanged. The report carries `claimed: false` for the reviewer; no gate row changes shape.

The only way to dodge the identity gate is to delete the block, and that is visible in the report as
`claimed: false`. That is not a silent pass; it is a named unwritten film.

---

## 3. Score schema — exact types

All of this lives in a new module **`src/engine/identity.ts`**, so the score and the library share one
vocabulary. It imports only `zod` (no cycle with `treatment.ts` or `pose.ts`).

```ts
import { z } from "zod";

export const PERFORMANCE_MODES = ["stage-show", "presenter-show", "creature-show"] as const;
export const SET_FAMILIES = [
  "stage", "arena", "theatre", "lab", "gym", "data-centre",
  "desert", "cliff", "room", "desk", "void",
] as const;
export const ENTRANCES = ["door", "trapdoor", "fold", "curtain", "back-of-frame", "aisle"] as const;
export const EXITS = ["bow", "curtain", "pullback", "loop", "hold"] as const;
export const FRAMINGS = ["wide", "medium", "close", "extreme"] as const;
export const FIELD_ROLES = [
  "paper", "ink", "red", "blue", "acid", "accent",
  "kraft", "teal", "oxblood", "orange", "green", "pink", "cream",
] as const;
export const MOTIFS = [
  "sunburst", "paper-sun", "petal", "halo", "torn-strip", "tape",
  "stamp", "print-marks", "iris", "confetti", "speed-lines", "paperclip", "meter",
] as const;
export const MOTIF_KINDS = ["formal", "semantic"] as const;
export const TEXT_BEHAVIOURS = ["stack", "stamp", "slide", "fold", "eaten", "scatter", "drop"] as const;
export const CONTACT_POINTS = [
  "hand-left", "hand-right", "both-hands", "foot-left", "foot-right",
  "floor", "head", "chest", "waist", "face", "stage",
] as const;
export const INTERACTIONS = ["hold", "wear", "plant", "pass", "hit", "look"] as const;
/** `with` may name a cast member, an asset id, or one of these. */
export const INTERACTION_TARGETS = ["floor", "stage", "crowd"] as const;
export const HEAD_FEATURES = [
  "ornament", "halo", "crown", "hood", "mask", "hat", "ears", "glasses", "hair", "makeup",
] as const;
export const SILHOUETTES = ["doll", "human", "creature"] as const;
export const STAGE_ROLES = ["star", "backing", "foil", "creature", "host"] as const;

/** A head styling that is a worn object; these need a declared diameter. */
export const ORNAMENT_FEATURES: ReadonlySet<string> = new Set([
  "ornament", "halo", "crown", "hood", "mask", "hat", "ears",
]);
```

### 3.1 `performance` (film level, optional)

The **claim marker** and the show's facts.

```ts
export const PerformanceSchema = z.object({
  /** The show. Required by the check, not by the parser, so a scaffold can exist. */
  mode: z.enum(PERFORMANCE_MODES).optional(),
  /** The performer the audience watches; a name in `score.cast`. */
  star: z.string().min(1).optional(),
  /** Backing performers; names in `score.cast`. Empty is a fact. */
  chorus: z.array(z.string().min(1)).max(5).default([]),
  /** The set family and the act that establishes the stage. */
  stage: z.object({ family: z.enum(SET_FAMILIES), beat: z.string().min(1) }).optional(),
  /** Where the star enters, and how. */
  entrance: z.object({ beat: z.string().min(1), via: z.enum(ENTRANCES) }).optional(),
  /** Where the star leaves, and how. */
  exit: z.object({ beat: z.string().min(1), via: z.enum(EXITS) }).optional(),
  /** The one repeatable gesture the star owns. */
  signature: z.object({ name: z.string().min(1), beat: z.string().min(1).optional() }).optional(),
});
export type Performance = z.infer<typeof PerformanceSchema>;
```

**Required vs optional.** The object is optional; inside it only `mode`, `star`, `stage`, `entrance`,
`exit` and `signature` are *required when the film claims the identity* (checked in
`style:identity`), not at parse time. `chorus` defaults to `[]`. There is no default for `mode`: a
default would invent a show. `film:new` writes `mode` only when `brief.audioMode` determines it (§6).

### 3.2 `paletteScript` (film level, defaults `[]`)

An ordered act script. The beat is the act; there is no `acts.json`.

```ts
export const PaletteScriptSchema = z
  .array(z.object({
    /** The act this field owns; a beat id from beats.json. */
    beat: z.string().min(1),
    /** The field role the whole act sits in. */
    field: z.enum(FIELD_ROLES),
  }))
  .default([]);
```

Rules (when claimed): 3–5 entries; each beat exists and the entries follow the beat order; no two
consecutive entries use the same field; at least two warm fields; at most one `blue`; nothing else.
Warm is `paper, kraft, cream, orange, red, oxblood, accent`. This is the checkable part of §3.3; the
"arc" (intimate → loud → resolve) stays prose and is not modelled.

### 3.3 `motifs` (film level, defaults `[]`)

```ts
export const MotifSchema = z.object({
  motif: z.enum(MOTIFS),
  /** A formal device or a semantic object; a film needs at least one semantic. */
  kind: z.enum(MOTIF_KINDS),
  /** What it means in this film; declared, never inferred. */
  meaning: z.string().min(1),
});
export const MotifsSchema = z.array(MotifSchema).max(5).default([]);
```

Deliberately **not** modelled: material, petal count, travel, "mandatory", an asset binding. Those
are the identity's prose or a paint-probe job.

### 3.4 `shots[].framing` (optional)

```ts
framing: z.enum(FRAMINGS).optional(),
```

Rules (when claimed): every shot has one; the film uses at least three distinct tiers. The
height-band proof stays `style:measure` / the frame probe; this field is a **claim**. It is the first
candidate to retire when the paint probe can derive framing from the subject box
(`G-studio-gap.md` §"prefer measurement over authoring").

### 3.5 `shots[].motif` (optional)

```ts
motif: z.enum(MOTIFS).optional(),
```

One declared motif per shot — the **primary** one. A shot that carries two motifs says so in `visual`;
the check needs an unambiguous count, not a second list.

Rules (when claimed): every declared shot motif is in `score.motifs`; no motif is used more than
`floor(0.4 × shots)` times; every declared motif is used 2–5 times; at least one is used 3+ times.

### 3.6 `shots[].camera.keys` (optional, additive)

The camera stays `{ move, from, to, ease }` and **`from`/`to` remain the z endpoints**. `keys` is the
path, added beside them, so no existing score or painter branch changes shape.

```ts
export const CameraKeySchema = z.object({
  /** Shot-local seconds: 0 at the shot's first frame. */
  t: z.number().nonnegative(),
  /** Pixels at z=1, relative to the frame centre, +right. */
  x: z.number().default(0),
  /** Pixels at z=1, relative to the frame centre, +down. */
  y: z.number().default(0),
  /** Scale multiplier; 1 is the authored frame. Same unit as from/to. */
  z: z.number().positive().default(1),
  /** Degrees, +clockwise. The band is a pack value, not a schema range. */
  roll: z.number().default(0),
});
```

In `TreatmentShotSchema`:

```ts
camera: z.object({
  move: z.string(),
  from: z.number(),
  to: z.number(),
  ease: z.string(),
  keys: z.array(CameraKeySchema).min(2).optional(),
}).optional(),
```

Semantics, exactly:

| Key | Unit | Anchor | Default |
|---|---|---|---|
| `t` | seconds, shot-local | `0` = first frame of the shot | required |
| `x` | pixels at `z=1` | frame centre (960, 540 at 1080p), `+` right | `0` |
| `y` | pixels at `z=1` | frame centre, `+` down | `0` |
| `z` | scale | `1` = the frame at `z=1` | `1` |
| `roll` | degrees | `+` clockwise | `0` |

Rules (in `camera:check`, §4.3): at least two keys; first `t = 0`; last `t = shot.duration`;
strictly increasing `t`; `keys[0].z === from` and `keys[last].z === to`; at least one axis changes;
`pan` changes `x`, `tilt` changes `y`, `orbit` changes `x` or `z`. A `pan` with `from = to` is legal
**only if** `keys` carries the x travel — which is the whole point of the field.

**Do not touch `CAMERA_MOVES`.** The identity's 11 moves include `crash_zoom`, `track`, `whip`,
`handheld` and `world`; adding them is a signed-pack reversal and the painter does not implement
them. `keys` makes the existing labels honest without the reversal.

### 3.7 `shots[].text` (optional)

The type **event**, not the copy. The words already live in `slots` and in `captions`; duplicating them
would create two sources of truth.

```ts
export const ShotTextSchema = z.object({
  /** How the type enters the world. */
  behaviour: z.enum(TEXT_BEHAVIOURS),
  /** The clock line whose word the type enters on; a narration line id. */
  onWord: z.string().min(1).optional(),
});
```

Rules: when claimed, the film declares **2–3 distinct behaviours** across its shots; every `onWord`
is a clock line (and the clock must be `narration`); a shot that declares `text` but has no non-empty
slot value is a contradiction (`text:empty`).

### 3.8 `events[].with / contact / interaction` (optional, all three or none)

In this repo the event list is **`score.shots[].direction.events`** (there is no film-level `events[]`);
the task's `events[]` means that list.

Extracted as a named `EventSchema` in `treatment.ts` (the object is currently inline) so the fields
have one home. The fields are **not** validated by a Zod `refine`; they are checked in
`checkDirection`, where the cast and asset names are known and the report gets a code.

```ts
with: z.string().min(1).optional(),          // a cast name, an asset id, or floor/stage/crowd
contact: z.enum(CONTACT_POINTS).optional(),  // where the contact is
interaction: z.enum(INTERACTIONS).optional(),// hold, wear, plant, pass, hit, look
```

Rules, in `checkDirection` (so every film gets them, claimed or not — a floating prop is a picture
defect, not an identity opinion):

1. The three fields are **all present or all absent** (`contact:incomplete`). This is the "a contact
   point with no verb is a coordinate" rule and its converse.
2. `with` must be in `score.cast[].character` (case-insensitive), or `score.assets[].id`, or one of
   `floor`, `stage`, `crowd` (`contact:unknown`). A typo would otherwise be a silently empty contact.
3. A pose event's existing `who` rules are unchanged; `with` is the *other* party.

### 3.9 Field table

| Field | Type | Required | Default | Read by |
|---|---|---|---|---|
| `performance` | `PerformanceSchema` | no (the claim) | absent | `style:identity`, `film:new` |
| `performance.mode` | enum 3 | when claimed | none | `style:identity`, `film:new` |
| `performance.star` | string | when claimed | none | `style:identity` |
| `performance.chorus` | string[] ≤5 | no | `[]` | `style:identity` |
| `performance.stage` | `{family,beat}` | when claimed | none | `style:identity` |
| `performance.entrance` | `{beat,via}` | when claimed | none | `style:identity` |
| `performance.exit` | `{beat,via}` | when claimed | none | `style:identity` |
| `performance.signature` | `{name,beat?}` | when claimed | none | `style:identity` |
| `paletteScript` | `{beat,field}[]` | when claimed | `[]` | `style:identity`, `film:new` |
| `motifs` | `{motif,kind,meaning}[]` ≤5 | when claimed | `[]` | `style:identity`, `film:new` |
| `shots[].framing` | enum 4 | when claimed | none | `style:identity`, `film:new` |
| `shots[].motif` | enum 13 | no | none | `style:identity` |
| `shots[].camera.keys` | `CameraKey[]` ≥2 | no | none | `camera:check`, painter later |
| `shots[].text` | `{behaviour,onWord?}` | no | none | `style:identity`, resolver |
| `events[].with` | string | no | none | resolver |
| `events[].contact` | enum 11 | no | none | resolver |
| `events[].interaction` | enum 6 | no | none | resolver |

---

## 4. Where the checks live — one report, no new command

```
                 score.json ──┬── resolveFilm()      events[].with/contact/interaction, text.onWord
                              │                       (structural; refuse the film before paint)
                              ├── camera:check        shots[].camera.keys (travel, endpoints, order)
                              ├── library:check       archetype/appearance/stageRoles/thumb/ratios
                              ├── film:new            the scaffold and its gap list
                              └── style:identity      performance/palette/motifs/framing/text
                                                      + the existing look and cast check
```

`style:identity` remains the only identity report. There is **no** `identity:check` command
(technical-v4 §8). The new findings are merged into the same `style-identity.json`, and
`render:film` / `film:review` / `gate:7` keep reading `pass` and `findings` unchanged.

### 4.1 `checkFilmIdentity` (pure, in `src/engine/identity.ts`)

```ts
export type IdentityFilm = {
  shots: { id: string; framing?: Framing; motif?: string; text?: ShotText; slots: Record<string, string> }[];
  performance?: Performance;
  paletteScript: PaletteScript;
  motifs: Motif[];
  cast: { character: string; archetype?: string }[];
  audioMode: string;
  clockLines: string[];
  beats?: string[];
  stagedShots: number;
  rule?: PerformanceCastRule;
};

export function checkFilmIdentity(film: IdentityFilm): {
  claimed: boolean;
  findings: IdentityFinding[];
};
```

It reads no files. `scripts/style-identity.ts` builds the input from the score, the pose files and
`beats.json` (from the score's own directory, not a hardcoded `films/<id>`), and merges:

- unclaimed: `film.findings` = one `identity:unwritten`; top-level `findings` unchanged; `pass` unchanged.
- claimed: `film.findings` are appended to top-level `findings`; `pass = findings.length === 0`.

Report addition:

```json
"claimed": false,
"filmIdentity": {
  "claimed": false,
  "findings": [{ "code": "identity:unwritten", "message": "this film does not claim the performance frame" }]
}
```

The advisory stays out of the top-level `findings` so `render:film` and `film:review` do not fail an
old film on a rule it never claimed — but it is printed and written, so it is not hidden.

### 4.2 Findings and their rules

| Code | Fires when | Message shape |
|---|---|---|
| `identity:unwritten` | no `performance` (advisory) | "this film does not claim the performance frame" |
| `identity:beats` | claimed, and `beats.json` is missing/invalid | "a performance frame needs the beat map; the score's beats.json is missing" |
| `identity:presence` | `stagedShots / shots < rule.presenceMin` | "3/10 shots stage a performer; the identity needs 85%" |
| `identity:archetype` | a cast member is not `rule.archetype` (or declares none) | "Kiran is "office-worker", not "paper-pop-performer"" |
| `identity:rules` | the pack lacks archetype/ratios/presenceMin | "tokens.identity.cast has no visualHeadToBody band" |
| `performance:mode` | `mode` missing | "name the show: stage-show / presenter-show / creature-show" |
| `performance:sound` | voice-led (`audio.mode` narration/hybrid) + `stage-show` | "a voice-led film is a presenter-show; stage-show needs a song" |
| `performance:star` | missing, or not in `score.cast` | "the star "X" is not in the cast" |
| `performance:chorus` | a chorus name not in `score.cast` | "chorus member "X" is not in the cast" |
| `performance:stage` | missing; beat not in beats | "the stage is not in beat "b09"" |
| `performance:entrance` | missing; beat not in beats | — |
| `performance:exit` | missing; beat not in beats | — |
| `performance:signature` | missing; optional beat not in beats | — |
| `palette:script` | count not 3–5; unknown/out-of-order beat; repeat in a row; fewer than 2 warm; more than one blue | one message naming the breach |
| `motif:set` | count not 3–5; duplicate motif | — |
| `motif:shot` | a shot motif not in `score.motifs` | "s03 carries "iris", which the film did not choose" |
| `motif:uses` | a declared motif used outside 2–5, or one used >40% of shots | — |
| `motif:semantic` | no `kind: "semantic"` | "a film needs one motif that means something, not only decoration" |
| `framing:missing` | a shot has no `framing` | "s04 has no framing" |
| `framing:tiers` | fewer than 3 distinct tiers | "2 tiers (wide, close); the scale rhythm needs 3" |
| `text:behaviours` | distinct behaviours not 2–3 | — |
| `text:word` | `onWord` is not a narration line (or the clock is not narration) | — |
| `text:empty` | `text` on a shot with no non-empty slot value | — |

Counts are contract constants in `identity.ts`, with the identity section in the comment:

```ts
export const IDENTITY_RULES = {
  paletteFields: [3, 5],
  warmFieldsMin: 2,
  blueFieldsMax: 1,
  motifsPerFilm: [3, 5],
  motifUses: [2, 5],
  motifMaxShotShare: 0.4,
  semanticMotifsMin: 1,
  framingTiersMin: 3,
  textBehaviours: [2, 3],
} as const;
```

They are counts, not measured bands; the repo already treats counts this way (`NARRATION_COVERAGE_MIN`,
`LIBRARY_MIN_EXPRESSIONS`). Measured bands stay in tokens (§6.4).

### 4.3 `camera.keys` in `camera:check`

`CameraPlanShot` gains `duration?: number` and `camera.keys?`. When keys are present:

| Check | Code |
|---|---|
| first `t = 0`, last `t = duration`, strictly increasing | `camera:keys` |
| `keys[0].z = from`, `keys[last].z = to` | `camera:keys` |
| at least one of x/y/z/roll changes | `camera:keys-travel` |
| `pan` changes x, `tilt` changes y, `orbit` changes x or z | `camera:keys-travel` |
| the existing push/pull sign rule still applies to `from`/`to` | `camera:sign` (unchanged) |

`scripts/camera-check.ts` already passes the **resolved** shots; pass `shot.duration` alongside.
The banded travel (24–600 px pan, etc.) is not enforced here; it belongs to the pack's travel table
and a later decision.

---

## 5. `film:new` — scaffold without inventing

`src/engine/film-new.ts`, `filmSkeleton()` (currently lines 67–88). Add, after `cast`:

```ts
performance: {
  // Derived from the brief's sound, not invented: music -> stage-show,
  // narration -> presenter-show. hybrid/sfx leave `mode` for the director.
  ...(mode ? { mode } : {}),
  // No chorus is a fact, not a guess.
  chorus: [],
},
paletteScript: [],
motifs: [],
```

`mode` derivation:

| `brief.audioMode` | `performance.mode` | Why |
|---|---|---|
| `music` | `stage-show` | the identity's default for a song film |
| `narration` | `presenter-show` | voice-led requires a presenter (§3.21) |
| `hybrid` | none | it carries a voice, but the show could be either; leave it blank |
| `sfx` | none | no voice; the director chooses |

Everything creative stays blank: no `star`, no `stage`, no `entrance`, no `exit`, no `signature`, no
motif, no field, no shot, no contact. This is the same rule as `spine: { want: "", ... }` and
`edit: { 0, 0, 0 }`: the file exists, the meaning does not.

`filmGaps()` (currently lines 236–311) gains, **only when `performance` is present**:

- `performance.mode`
- `performance.star: the performer the audience watches (a name in score.cast)`
- `performance.stage: the set family and the beat that establishes it`
- `performance.entrance: the beat the star enters in, and how`
- `performance.exit: the beat the star leaves in, and how`
- `performance.signature: the gesture the star owns`
- `paletteScript: 3-5 field roles, one per beat, warm, at most one blue, no repeat in a row`
- `motifs: 3-5 motifs, each with a meaning and a kind (formal or semantic)`
- per shot: `shots[i].framing: wide / medium / close / extreme (the film claims the performance frame)`

The skeleton's gap count goes from 5 to **12** for a narrated or musical brief (13 when `mode` is not
derived, i.e. hybrid/sfx). The current test asserts `gaps.length === 5`; change it to assert the named
gaps, not the count (counts are brittle and this plan adds two stages' worth).

`filmGaps` keeps no beat-reference check: it has no `beats.json`. Beat membership/order is checked by
`style:identity`, which reads the document.

---

## 6. Library schema — exact fields

`src/engine/pose.ts`, `PoseLibrarySchema` (currently lines 43–58). Add six fields, all optional, and
change two existing numbers.

```ts
archetype: z.string().min(1).optional(),
/** What the character can be to an audience. Empty means "not cast yet". */
stageRoles: z.array(z.enum(STAGE_ROLES)).default([]),
appearance: AppearanceSchema,
/** A creature or a Mira-type human may have no thumb. */
thumbOptional: z.boolean().default(false),
/** Height ÷ head-mass height (head + hair); the "visual head". A ratio, 3–6. */
visualHeadToBody: z.number().min(2).max(8).optional(),
/** Ornament diameter ÷ height (0.45 is 45% of height). A ratio, never 0–100. */
headOrnamentDiameterPct: z.number().min(0.1).max(1).optional(),
```

with

```ts
export const AppearanceSchema = z.object({
  head: z.object({
    layers: z.number().int().min(1).max(5).optional(),
    /** The performance feature: a worn object, a signature hair, glasses or makeup. */
    feature: z.enum(HEAD_FEATURES).optional(),
  }).optional(),
  hair: z.object({
    silhouette: z.string().min(1).optional(),
    layers: z.number().int().min(1).max(5).optional(),
  }).optional(),
  skin: z.object({
    values: z.array(z.string().min(1)).min(1).max(3),
  }).optional(),
  costume: z.object({
    /** The garments the rig draws, in draw order. */
    pieces: z.array(z.string().min(1)).min(1),
  }).optional(),
  /** Which proportion family the figure is built for. */
  silhouette: z.enum(SILHOUETTES).optional(),
});
```

**Defaults are deliberately almost absent.** Only `stageRoles: []` and `thumbOptional: false`. A
default of `head.layers: 3` would claim a three-layer head the file may not have; a default of
`visualHeadToBody: 4` would claim a doll the rig is not. A fact you have not observed is not a
default; it is a lie.

### 6.1 `thumbOptional` and the hand rule

`BodySchema.hand.thumbW/H` change from `.positive()` to `.nonnegative()`.

In `resolvePoseLibrary`:

- `thumbOptional === false` and (`thumbW === 0` or `thumbH === 0`) → `body:thumb` ("a thumbless hand
  must say `thumbOptional: true`").
- `thumbOptional === true` → skip the 1.5× hand/thumb ratio checks (the thumb may be absent).
- when a thumb exists and is optional, the ratio still applies if both dims are non-zero; a real thumb
  still has to be smaller than the hand.

This closes the exact contradiction in technical-v4 §4: the identity allows a thumbless creature, the
schema required a positive thumb.

### 6.2 `library:check` rules

`resolveLibrary` (src/engine/library.ts, lines 64–159) gains
`options.castRule?: PerformanceCastRule`. `scripts/library-check.ts` reads the pack's
`tokens.identity.cast` with `readPerformanceCastRule()` and passes it; a new `--style <id>` flag
defaults to `paper-kpop`. If the pack is missing the fields → `library:band` (not a silent skip).

For **every** indexed character:

| Rule | Code |
|---|---|
| `archetype` present | `library:archetype` |
| `appearance` present, with at least two of `head.feature`, `hair.silhouette`, `costume.pieces`, `skin.values`, `silhouette` | `library:appearance` |
| `stageRoles.length > 0` | `library:stageRole` ("a character with no stage role is a prop with a face") |

For a character whose `archetype === rule.archetype` (the performer):

| Rule | Code |
|---|---|
| `appearance.head.feature` present | `library:head` |
| `appearance.hair.silhouette` present, unless `silhouette: "creature"` | `library:appearance` |
| `appearance.costume.pieces` non-empty | `library:appearance` |
| `appearance.silhouette` is `"doll"` or `"creature"` | `library:doll` |
| for `doll`: `head.layers >= 3`, `visualHeadToBody` inside the band | `library:head`, `library:doll` |
| for `doll` with a worn head feature: `headOrnamentDiameterPct` inside the band | `library:ornament` |
| for `creature`: no ratio required; `thumbOptional` may be true | — |

For a character with another archetype (`office-worker`, `scientist`, …): **no ratio requirement**.
The library is a catalogue, not a casting decision. A worker is a legal library character and an
illegal Paper K-pop lead. That is exactly the split the Uber film needs.

`LibraryCharacterReport` gains `archetype?: string`, `stageRoles: string[]`, `appearance: boolean`.
`library:check` prints them on each row.

### 6.3 Kiran and Vaz — exact profile

Both are workers; the data says so. Values are read from `films/uber-model/vendor/office.js`, not
invented.

`library/characters/kiran/poses.json`:

```json
"archetype": "office-worker",
"stageRoles": ["foil"],
"appearance": {
  "head":  { "feature": "hair", "layers": 3 },
  "hair":  { "silhouette": "jaw-length", "layers": 2 },
  "skin":  { "values": ["#F0C9A4", "#D19A72", "#FFE2C4"] },
  "costume": { "pieces": ["shirt", "trouser", "tie"] },
  "silhouette": "human"
}
```

`library/characters/vaz/poses.json`:

```json
"archetype": "office-worker",
"stageRoles": ["foil"],
"appearance": {
  "head":  { "feature": "hair", "layers": 3 },
  "hair":  { "silhouette": "short", "layers": 2 },
  "skin":  { "values": ["#D9A87E"] },
  "costume": { "pieces": ["shirt", "trouser", "jacket", "badge"] },
  "silhouette": "human"
}
```

- `layers: 3` is the back hair, the face plate and the fringe, and `hair.layers: 2` is back hair +
  fringe — what the rig draws. The head stack passes one performer-test point; the archetype,
  silhouette and missing ornament are what fail the rest.
- `visualHeadToBody` and `headOrnamentDiameterPct` are **omitted**: they are doll/organ claims, and
  these are not dolls and have no ornament. The schema only requires them for
  `archetype: "paper-pop-performer"`.
- `thumbOptional` is omitted (default `false`): both have a 18×26 hand and an 8×12 thumb.
- `stageRoles: ["foil"]`: in *The Uber Cut* they are the two people the diagram happens to. Neither
  addresses the audience, holds a mic or owns a signature move, so neither is a `star` or a `host`.

Update `library/characters/index.json`: `version: "1.1.0"` for both and the two new `hash` values.
`library/check` will refuse a stale hash; run it after the edit.

### 6.4 Pack values the checks read

`styles/paper-kpop/tokens.json`, inside `identity.cast` (the block `style:identity` already reads):

```json
"archetype": "paper-pop-performer",
"visualHeadToBody": [3.4, 4.5],
"headOrnamentDiameterPct": [0.45, 0.65],
"presenceMin": 0.85
```

- `presenceMin` is separate from the existing `stagedRatio: 0.5`: the old floor still applies to every
  film, the new floor only to a film that claims the performance frame. Do not raise `stagedRatio`;
  that would retroactively fail *Same Alarm*.
- `visualHeadToBody` means **height ÷ head-mass height (head + hair)**, band 3.4–4.5. The identity JSON
  v1.3's note says "head + ornament"; that note is wrong (critique-creative-v4 §3). The numbers are
  hair-mass numbers (chorus 30% head → 3.3 heads; desk 23% → 4.3). Correct the note when the block is
  added.
- `headOrnamentDiameterPct` is `ornament diameter ÷ height`, 0.45–0.65 (a ratio, never 0–100). The
  critique measures the star at 51%, the desk at 44%, the chorus at 34%; 0.45–0.65 is therefore a
  **hero band**, not a cast band. It is seeded from the identity as written; the style owner must
  decide whether the chorus gets a wider band before a chorus character is drawn.
- The face-plate alternative (`visualHeadToBody 4.5–5.9`) is recorded in the decision as an open
  choice. No character claims the band yet, so nothing fails on the choice today.

Do **not** change `identity.dimension` (`2d`), `maxCast`, `maxColours`, or `CAMERA_MOVES` here. Those
are pack 0.3.0 decisions, not data.

---

## 7. `films/uber-model/score.json` — exact migration

### 7.1 The patch

Add exactly this between `seed` and `shots`:

```diff
   "seed": "uber-model-01",
+  "performance": {
+    "mode": "presenter-show",
+    "chorus": []
+  },
   "shots": [
```

That is the whole migration. Nothing else changes.

### 7.2 Why each omitted field is omitted

| Field | Why it is **not** added |
|---|---|
| `performance.star` | The identity's star addresses the audience, holds a prop/mic and owns a signature move. Kiran does none. Naming him would invent a performance the film does not have. |
| `performance.stage` | The film has no stage set. `set.stage` is a manifest asset; the ten shots are diagram recipes (`network_web`, `app_menu`, `phone_route`, `city_route`, `fare_split`, `money_flow`). |
| `performance.entrance` / `exit` | There is no entrance and no exit. The first shot is a network map; the last is a phone map. |
| `performance.signature` | There is no repeatable gesture. |
| `paletteScript` | The measured failure is one cream plate. Declaring 3–5 fields would be a script the film was not painted from. |
| `motifs` | The spec's verdict is that the film has no motif language; declaring the phone/route/coin as motifs would make a failing film pass a structural motif check. |
| `shots[].framing` | The film is one fixed height (57.8%). Declaring ten `close` shots is truthful but proves nothing the measurement does not already prove; leaving it absent is one finding, not a false rhythm. |
| `shots[].camera.keys` | **The delivered picture was painted from `from`/`to`.** Keys would describe a path the MP4 does not contain. |
| `shots[].text` | The type was painted by the recipes from slots. Declaring behaviours retrospectively is a reading, not a fact. |
| `events[].with/contact/interaction` | The events were authored without contacts; adding them now would describe a picture that was not drawn with them. |

### 7.3 Apply gate — **do not edit the delivered score in this change**

`build/uber-model/render-manifest.json` pins:

```text
films/uber-model/score.json                  sha256:5f5f71f3…
library/characters/kiran/poses.json          (one of the 21 inputs)
library/characters/vaz/poses.json            (one of the 21 inputs)
```

Editing the score changes the pinned hash. `gate:7`'s `inputsHashed` re-hashes the inputs, so the
delivered film's gate would fail on `inputsHashed` before it ever reaches identity. Worse,
`render:film` refuses to paint without a passing `style:identity` report **tied to this score**, and the
migrated Uber film cannot pass it (worker archetype, no star, no stage, no motifs). So the manifest
cannot be restored without first passing a check the film is designed to fail. That is a deadlock.

Therefore:

- **Land the patch as a test fixture in memory**, not as an edit to `films/uber-model/score.json`.
  `test/style-identity.test.ts` builds `{ ...uberScore, performance: {...} }` and asserts the expected
  findings. `test/film-new.test.ts` uses the same object to prove `filmGaps` names the rest.
- Apply the patch to the real score only when the film is rebuilt as a Paper K-pop film (the user has
  parked new films; this is not that moment).
- The same rule applies to the Kiran/Vaz pose edits in §6.3: they change two pinned inputs. That edit
  **is** required for `library:check`, so land it, but record in `docs/STATUS.md` and decision 0053
  that `build/uber-model/*` and `gate/` describe the **pre-0053 tree**; do not re-run `inputsHashed`
  on the delivered film until a rebuild is scheduled.

If the user overrules this and wants the score edited now, the full cost is:
edit → `npm run embed` (no change: identity fields are not in the resolved plan) → `render:film`
(refused by the new identity gate) → nothing. The only way through is to rebuild the film as a
performance first. That is the next film, not a data migration.

---

## 8. Tests

### `test/treatment.test.ts`

1. **An old score is unchanged.** Parse `films/same-alarm/score.json`; assert `performance` is
   `undefined`, `paletteScript` and `motifs` are `[]`; `resolveFilm` errors are `[]`.
2. **A claimed score resolves.** Clone the Uber score in memory, add `performance`, `paletteScript`,
   `motifs`, one `framing`/`motif`/`text` per shot, keys on one shot, and one contact trio; assert
   `resolveFilm` errors are `[]`.
3. **Key defaults.** Parse `keys: [{t: 0}, {t: 2.5, x: 40}]`; assert the second key is
   `{t: 2.5, x: 40, y: 0, z: 1, roll: 0}`.
4. **A contact is all three or none.** `interaction: "hold"` with no `contact`/`with` →
   `contact:incomplete`; `with: "Nobody"` → `contact:unknown`; the full trio → no error.
5. **Text enters on a real word.** `text.onWord: "nope"` → `text:word`; a valid line id → no error;
   `text` on a shot whose slots are all empty → `text:empty`.
6. **Unknown framing/motif is refused at parse.** `safeParse` fails for `framing: "insert"` and
   `motif: "lamp"`.

### `test/camera.test.ts` (the camera rule lives here)

7. A two-key path that starts at 0, ends at the shot and moves → no error.
8. A path that starts at 1 s → `camera:keys`; a path that ends at 2 s on a 3 s shot → `camera:keys`;
   a path whose z endpoints disagree with `from`/`to` → `camera:keys`.
9. A `pan` whose keys change only z → `camera:keys-travel`; one that changes x → pass.
10. A path whose keys never change any axis → `camera:keys-travel`.

### `test/library.test.ts`

11. **The shipped library declares what each character is.** Kiran and Vaz are `office-worker`, both
    have `appearance`, `stageRoles: ["foil"]`; `resolveLibrary(index, { root, castRule })` errors `[]`.
12. **A performer must declare its doll ratios.** Clone Kiran, set `archetype: "paper-pop-performer"`,
    `appearance.silhouette: "doll"`, `head.feature: "ornament"`, `head.layers: 3`; add
    `visualHeadToBody: 4.0`, `headOrnamentDiameterPct: 0.5` → pass. Remove the ratios → `library:doll`
    and `library:ornament`. Move `visualHeadToBody` to 6 → `library:doll`.
13. **A worker is legal in the library and not a performer.** `archetype: "office-worker"` with no
    ratios → `resolveLibrary` has no `library:doll`/`library:ornament` finding (the film check is the
    one that refuses it, §8 `style-identity`).
14. **A thumbless creature may omit the thumb.** `thumbOptional: true`, `thumbW/H: 0` →
    `resolvePoseLibrary` errors `[]`; `thumbOptional` absent → `body:thumb`. A present thumb narrower
    than 1.5× the hand still fails.
15. **The ratios are ratios.** `visualHeadToBody: 55` and `headOrnamentDiameterPct: 55` fail the Zod
    parse; `0.5` passes.
16. **An old film-local pose file still parses.** `films/same-alarm/cast/kiran.poses.json` parses with
    no profile; `resolvePoseLibrary` adds no finding.

### `test/film-new.test.ts`

17. **The skeleton states the mode the sound allows.** `audioMode: "music"` → `stage-show`;
    `"narration"` → `presenter-show`; `"hybrid"`/`"sfx"` → no `mode`.
18. **The skeleton invents no performer, stage, field or motif.** `star`, `stage`, `entrance`, `exit`,
    `signature` are `undefined`; `chorus`, `paletteScript`, `motifs` are `[]`.
19. **`filmGaps` names the identity gaps.** Assert each of the 12 named gaps (not the count).
20. **`filmGaps` is silent for a film that claims nothing.** `films/same-alarm/score.json` → `[]`
    (existing test, keep).
21. **`filmGaps` names a shot's missing `framing` only when the film claims the identity.** Clone
    understudy, add `performance`, no framing → gap; remove `performance` → no gap.
22. **Filling the gaps silences `filmGaps`.** Build the claimed Uber object with every performance
    field, palette script, motifs and framing on all shots → `[]`.

### `test/style-identity.test.ts`

23. **An unclaimed film is reported, not passed silently.** `checkFilmIdentity` returns
    `claimed: false` with one `identity:unwritten`; the existing `checkStyleIdentity` tests are
    unchanged.
24. **A claimed film with a worker cast fails the archetype.** Uber cast (`office-worker`) + the
    performance block → `identity:archetype` for both.
25. **The star must exist and be in the cast.** `star: "Nobody"` → `performance:star`.
26. **A voice-led stage-show is refused.** `audioMode: "narration"`, `mode: "stage-show"` →
    `performance:sound`.
27. **A palette script is 3–5, warm, one blue, no repeat.** Four cases; each names `palette:script`.
28. **Motifs are 3–5, used 2–5, under 40%, with one semantic.** Cases: 2 motifs; a shot motif not
    chosen; a motif used 6/10 times; no semantic.
29. **Framing needs three tiers.** Two tiers → `framing:tiers`; three → pass.
30. **Text needs two or three behaviours and a real word.** One behaviour → `text:behaviours`;
    `onWord: "nope"` → `text:word`.

`test/score-data.test.ts` is **not edited**: its byte-equality assertion for understudy is the guard
that the new fields did not enter `ResolvedFilm`.

---

## 9. Files touched, in order

1. `src/engine/identity.ts` — **new**: vocabularies, `PerformanceSchema`, `PaletteScriptSchema`,
   `MotifSchema(s)`, `CameraKeySchema`, `ShotTextSchema`, `AppearanceSchema`,
   `PerformanceCastRuleSchema`, `readPerformanceCastRule`, `IDENTITY_RULES`, `checkFilmIdentity`.
2. `src/engine/treatment.ts` — import the schemas; `ShotCameraSchema` + `keys`; `framing`/`motif`/`text`
   on `TreatmentShotSchema`; extract `EventSchema` and add the trio; `performance`/`paletteScript`/
   `motifs` on `FilmScoreSchema`; `checkDirection` contact rules; `checkText` word/empty rules.
3. `src/engine/camera.ts` — `duration` and `keys` on `CameraPlanShot`; the key checks.
4. `src/engine/pose.ts` — profile fields; `thumbW/H` nonnegative; the optional-thumb rule.
5. `src/engine/library.ts` — `castRule` option; profile findings; report fields.
6. `src/engine/film-new.ts` — skeleton block; the nine gap lines.
7. `scripts/library-check.ts` — `--style`, read the pack, pass the rule, print the profile.
8. `scripts/style-identity.ts` — read archetypes/beats/clock, call `checkFilmIdentity`, merge the
   report (`claimed`, `filmIdentity`), keep `pass` semantics for unclaimed films.
9. `styles/paper-kpop/tokens.json` — the four `identity.cast` values.
10. `library/characters/kiran/poses.json`, `vaz/poses.json`, `index.json` — the profile, versions,
    hashes.
11. `library/README.md` — document the six fields and the worker/performer split.
12. `docs/decisions/0053-the-score-carries-the-performance-frame.md` — the contract change, the
    absence/claim rule, the pack bands and the Uber evidence cost.
13. `docs/STATUS.md` + `AGENTS.md` — the Uber manifest is pre-0053; the new gate is `unwritten` for
    old films.
14. Tests: the four named files + `test/camera.test.ts`.

No `package.json` change: no new command.

### Definition of done (commands)

```bash
npm run typecheck
npm test
npm run library:check -- library/characters/index.json        # pass, prints office-worker / foil
npm run style:identity -- films/uber-model/score.json --video # pass, claimed:false, "identity: unwritten"
npm run camera:check -- films/uber-model/score.json           # unchanged pass
npm run film:new -- --brief fixtures/story-min/brief.json --out <temp>   # 12 named gaps
```

No render.

---

## 10. Over-engineering — what is deliberately not added

| Not added | Why |
|---|---|
| `identityVersion` | §2. A second source of truth for the presence of the block, plus a check matrix nothing reads. |
| `acts.json` / an `acts` array | `beats.json` is the authored unit. A second layer of acts would need a second total and a second check. |
| `shots[].stage: boolean` / `detail: boolean` | It would make stage share and detail share **declarations** (critique-creative-v4 P0-1: a film can be 10/10 both). The real instrument is the per-shot frame report, which does not exist. Parked and named. |
| A 13-motif record with material, petals, travel, mandatory | The film chooses 3–5 and declares a meaning. The rest is prose or paint. |
| `shots[].text.words` | The words are already in `slots` and `captions`. Duplicating them creates two sources of truth and a drift check that does not exist. Only `behaviour` + `onWord` are new. |
| `paletteScript[].accent` / `.arc` | The checkable part is count/warm/blue/repeat. "Intimate → loud → resolve" is a director's reading, not a band. |
| The six-ratio silhouette table (torso/legs/shoulder/boot/hand) | Nothing measures it. The two ratios the probe can use are `visualHeadToBody` and `headOrnamentDiameterPct`; `appearance.silhouette` is one enum (`doll`/`human`/`creature`), not five numbers. |
| A `camera` discriminated union on `keys` vs `from/to` | It changes the shape every painter and check reads. `keys` is additive; `from/to` stays the z endpoint. |
| A new `identity:check` command | Technical-v4 §8: one report, existing readers. `style:identity` is the report; `camera:check` and `library:check` are the other readers. |
| Motif/stage paint records | The paint probe records characters, not motifs. Until it does, the motif/stage checks are **structural**, and the report says so. |
| `stageRoles` in `index.json` | The pose file owns the character; the index owns the file, version and licence. One fact, one place. |
| Making `TreatmentShotSchema` strict | It would break every film with an unknown shot key. The new fields being stripped on a typo is a pre-existing property; fixing it is a separate hygiene change. |

---

## 11. Risks and open questions

1. **The delivered Uber manifest is pinned to the score and to both pose files.** The pose edit is
   required for `library:check`; the score edit is not, and is deferred. After this change,
   `build/uber-model/render-manifest.json` and `build/uber-model/gate-7.json` describe the pre-0053
   tree. Do not re-run `inputsHashed` on the delivered film. Record this in decision 0053 and
   `docs/STATUS.md`; the MP4 itself is untouched.
2. **`render:film` deadlock if the score is migrated.** The migrated score cannot pass the identity
   gate, so a re-render (the only thing that would rewrite the manifest) is refused. This is the
   reason for §7.3.
3. **The identity bands are unsigned research values.** `visualHeadToBody 3.4–4.5` is the hair-mass
   reading; the creative critique proposes `4.5–5.9` for the face plate; `headOrnamentDiameterPct
   0.45–0.65` is a hero band that the reference chorus (34%) fails. The plan puts them in tokens so
   the style owner can move them without code. No character claims them yet, so no false failure.
4. **Score claims can lie.** Motifs, framing, palette script, stage and presence (from
   `direction.cast`, not the paint) are declarations until the per-shot frame report exists. The
   report must print that they are structural checks, not paint checks (technical-v4 §4;
   `critique-qa-v2` "a film can declare four motifs and draw none").
5. **`performance.chorus` vs `cast.max: 2`.** A chorus must be cast names, and `style-identity` still
   refuses more than 2 cast entries. A film with a 5-person chorus is refused until the pack's cast
   contract changes (2 principals + 0–5 chorus, total 7). That is a pack 0.3.0 decision, named here.
6. **`camera.keys` is data the painter does not yet read.** Today `pan` is a fixed ±23 px drift and
   `orbit` a sine (`styles/paper-kpop/canvas/recipes.js:207-217`), not the scored path; a film may
   declare keys and the picture will still move by `from`/`to` plus that drift. `camera:check`
   validates the path but cannot prove it was painted. The first film that uses keys must land the
   painter read in the same change. Related and named: a keyless `pan` with `from = to` still passes,
   because making it fail would refuse the delivered Uber film; the identity's travel rule is only
   applied where keys exist.
7. **`shots[].framing` is authored, not measured.** It can pass the ≥3-tier rule while
   `style:measure` shows one subject height (the Uber case). The measurement stays the proof.
8. **`text.onWord` and the type audit can disagree.** The audit reads painted text; `onWord` is a
   claim about when it entered. The two are compared only by a person until the paint record carries
   a text-entry frame.
9. **No performer character exists.** `library:check` will pass Kiran and Vaz as workers;
   `style:identity` will refuse them as leads. Designing the first `paper-pop-performer` (3-layer
   head, ornament slot, doll ratios, 4 performance poses) is a creative task, not a schema task.
10. **Open: who signs a `presenter-show` / `creature-show`?** The identity says these are `V, signed`,
    but the score has no `signedBy`. This plan does not add one; the check only refuses the illegal
    combination (voice-led stage-show). A signature field is a product decision.
11. **Open: should `film:new` derive `mode` at all?** It does so only when `brief.audioMode` determines
    it (music/narration), never in the check. If the style owner prefers the director to always name
    the mode, delete the derivation and let `filmGaps` ask; the rest of the plan is unchanged.
