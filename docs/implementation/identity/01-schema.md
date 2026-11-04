# 01 — The identity schema

**Status:** implementation plan. No code is changed by this document.
**Date:** 4 November 2026
**Owner:** technical (shared `src/core/**`), with creative sign-off for `styles/**`
**Input:** `docs/research/identity/KPOP-IDENTITY.md` v1.3, `kpop-identity.proposed.json`
**Follows:** decision 0052 (style:identity is a film gate)
**Blocks:** 02 (the film reader), the next film

---

## 0. The decision in one page

1. **One block, in `tokens.json`.** `tokens.identity` is the style's machine
   identity. There is no `identity.json`, no second camera block, no second
   palette, no second type system. The research proposal is not copied into the
   pack; it is the source for the schema.
2. **`TokensSchema` validates it.** Today `tokens.identity` is passthrough. It
   becomes a closed, strict schema (`StyleIdentitySchema`, schema version 1).
3. **Missing is a failure, never a default.** The schema uses no `.default()`.
   A value the pack did not declare fails with the exact path.
4. **Two kinds of band, two names.** `surfaceBands` (the existing `bands`) are
   **deltas** against the six crops and stay the surface gate. `filmBands` are
   **absolute film ranges** measured against the reference film. They never
   share a name again.
5. **The template is the core, not a style.** It ships the nine structural
   groups and omits exactly three things that are this pack's evidence or voice:
   `referenceFilm`, `filmBands`, `tone`. Omission is the only placeholder.
6. **Legacy is a label on a failure, not an exemption.** A pack with no identity
   is DRAFT and exits 1. A pack may say `capabilities.legacy` so the reason is
   recorded and the message is specific; it still fails.
7. **The schema does not enter `STYLE_CONTRACT`.** Adding it would change
   `contractHash` and invalidate every pack's bindings. `validatorHash` already
   covers the schema file, so the seal still binds it.
8. **01 declares and validates; 02 measures and enforces.** Do not claim the
   identity gap is closed when 01 lands. The reader table in §4 is the honest
   state of each field.

---

## 1. Where it lives

```
src/core/style.ts
  ├─ STYLE_IDENTITY_SCHEMA_VERSION, IDENTITY_*, STAGE_ROLES, PERFORMANCE_MODES,
  │  FORBIDDEN_MOVES, FORBIDDEN_CORE          closed vocabularies
  ├─ StyleIdentitySchema                       tokens.identity (new, strict)
  ├─ identityGaps(tokensRaw)                   used by style:new and tests
  └─ identityCastRule(identity)                the adapter to style:identity

styles/<id>/tokens.json          "identity": { ... }     the style's declaration
styles/<id>/capabilities.json    "legacy": { reason }    optional, historical packs
```

The existing `IdentitySchema` in `src/core/style.ts` (line 778) is the pack's
**name record** in `capabilities.json`. Do not rename it. The new schema is
`StyleIdentitySchema` and carries a comment saying which is which.

`TokensSchema` gains:

```ts
export const TokensSchema = z
  .object({
    medium: MediumSchema,
    color: ColourSchema,
    type: TypeSchema,
    layout: LayoutSchema,
    motion: MotionSchema,
    sound: SoundSchema,
    seed: SeedSchema,
    /**
     * Optional at the schema level so a historical pack can still be loaded and
     * measured. A present block is always validated. `validateStylePack` refuses
     * a pack that has neither a block nor `capabilities.legacy`.
     */
    identity: StyleIdentitySchema.optional(),
  })
  .passthrough();
```

`CapabilitiesSchema` gains:

```ts
const LegacySchema = z
  .object({ reason: z.string().min(1) })
  .passthrough();

// in CapabilitiesSchema:
legacy: LegacySchema.optional(),
```

---

## 2. The block, in shape

```json
"identity": {
  "schemaVersion": 1,
  "envelope":     { "canvas": {...}, "fps": 30, "dimension": "2.5d-layered", "projection": "orthographic", "planes": [...], "cameraAxes": [...] },
  "referenceFilm":{ "surface": "references/frames", "film": "...", "sha256": "sha256:..." },
  "surfaceBands": { "luma": 20, "contrast": 25, "saturation": 10, "edges": 5, "palette": 45 },
  "filmBands":    { "basis": "film", "luma": {...}, "contrastP5": [...], "saturation": {...}, "edges": [...], "paletteDistanceMax": 55, "warmShare": [...], "blueShare": [...] },
  "field":        { "share": [...], "largestFlat": [...], "edgeBarMax": 0.08, "fullBleed": true, "horizonPx": [...], "fieldRoles": [...], "noBlueOnBlue": true },
  "composition":  { "subjectHeight": [...], "subjectWidth": [...], "centroidX": [...], "centroidY": [...], "floorLine": [...], "heightTiersMin": 3, "heightSdMin": 15, "localContrastMin": 20, "localContrastMedian": 35 },
  "edit":         { "medianS": [...], "p10S": [...], "p90S": [...], "minS": 0.6, "maxS": 6.2, "cutsPerMinute": [...], "cutOnWordShare": [...], "hardCutShare": [...], "designedTransitionShare": [...], "holdMaxS": 0.4, "lastHoldMaxS": 2 },
  "cast":         { "archetype": "paper-pop-performer", "stageRoles": [...], "principals": {...}, "chorus": {...}, "stagedShare": 0.85, "posesMin": 8, "expressionsMin": 14, "anchors": [...], "silhouette": {...}, "appearance": {...} },
  "performance":  { "modes": [...], "defaultMode": "presenter-show", "stageShareMin": 0.6, "detailShareMax": 0.4, "entrance": 1, "exit": 1, "signatureMove": 1 },
  "motifs":       { "library": [...], "perFilm": {...}, "uses": {...}, "maxShotShare": 0.4, "semanticObjectMin": 1, "castOrnamentExempt": true, "defaultOpener": false },
  "tone":         { "mode": "sweet-sinister-pop", "surface": "...", "subject": "...", "character": "...", "ending": "...", "tenderBeats": 1, "poisonAccents": [...], "beats": [...] },
  "forbidden":    ["glossy-3d", "..."]
}
```

**Units.** Luma/contrast/saturation/edges are 0–255 (the units `style:measure`
prints). Palette distance is 0–441. Shares and ratios are 0–1. `*S` fields are
seconds. `horizonPx` is pixels at `envelope.canvas`. `surfaceBands` are delta
magnitudes (how far a film may stray), always ≥ 0; `filmBands` are ranges
`[low, high]` that may not be inverted.

---

## 3. Exact schema

Add to `src/core/style.ts`, above `TokensSchema`.

```ts
// ---------------------------------------------------------------------------
// tokens.identity — the style's machine grammar (schema 1)
// ---------------------------------------------------------------------------
// Not to be confused with IdentitySchema below: that is the pack's name record
// in capabilities.json. This is the style itself.

export const STYLE_IDENTITY_SCHEMA_VERSION = 1;

export const IDENTITY_DIMENSIONS = ["2d", "2.5d-layered"] as const;
export const CAMERA_AXES = ["x", "y", "z", "roll", "shake"] as const;
export const STAGE_ROLES = ["star", "backing", "foil", "creature", "host"] as const;
export const PERFORMANCE_MODES = ["stage-show", "presenter-show", "creature-show"] as const;

export const FORBIDDEN_MOVES = [
  "glossy-3d", "bevel", "photo-face", "fingers", "soft-cast-shadow", "dof",
  "motion-blur", "dissolve", "page_turn", "side-bars", "cream-plate-with-wings",
  "blue-on-blue", "office-worker-lead", "static-no-action", "camera-only-motion",
  "text-over-face", "lyric-wall", "too-many-roles", "default-opener",
  "diagram-opener", "three-same-moves", "floating-prop", "floating-foot",
  "clipped-hand", "mirrored-badge", "pose-swap", "dead-hold", "generic-underline",
  "rounded-ui-card", "unlicensed-font", "unlicensed-track", "meme-sound",
  "unverified-claim", "same-opener-twice", "same-closer-twice", "same-motif-set-twice",
] as const;

/** The bans no style in this house may omit. */
export const FORBIDDEN_CORE = [
  "glossy-3d", "bevel", "photo-face", "fingers", "soft-cast-shadow", "dof",
  "motion-blur", "side-bars", "text-over-face", "unverified-claim",
] as const;

const IDENTITY_TOKEN = /^[a-z][a-z0-9_-]*$/;
const IdentityToken = z.string().min(1).regex(IDENTITY_TOKEN, "must be a lower-case token");
const Ratio = z.number().min(0).max(1);
const RatioBand = z.tuple([Ratio, Ratio]);
const LumaBand = z.tuple([z.number().min(0).max(255), z.number().min(0).max(255)]);
const PixelBand = z.tuple([z.number().min(0), z.number().min(0)]);
const SecondsBand = z.tuple([z.number().positive(), z.number().positive()]);

const countRange = (min: number) =>
  z.object({
    min: z.number().int().min(min),
    max: z.number().int().min(min),
  }).strict();

const unique = <T>(values: T[]): boolean => new Set(values).size === values.length;

const EnvelopeSchema = z.object({
  canvas: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).strict(),
  fps: z.number().int().min(1).max(120),
  dimension: z.enum(IDENTITY_DIMENSIONS),
  projection: z.literal("orthographic"),
  planes: z.array(z.string().min(1)).min(3),
  cameraAxes: z.array(z.enum(CAMERA_AXES)).min(3),
}).strict();

const ReferenceFilmSchema = z.object({
  /** Pack-relative. Must exist; this is the in-repo evidence. */
  surface: z.string().min(1),
  /** The grammar film. May live outside the pack; verified by style:measure. */
  film: z.string().min(1).optional(),
  sha256: HashSchema.optional(),
}).strict();

const SurfaceBandsSchema = z.object({
  luma: z.number().min(0),
  contrast: z.number().min(0),
  saturation: z.number().min(0),
  edges: z.number().min(0),
  palette: z.number().min(0),
}).strict();

const FilmBandsSchema = z.object({
  basis: z.enum(["film", "crops"]),
  luma: z.object({
    mean: LumaBand,
    p5: LumaBand,
    p50: LumaBand,
    p95: LumaBand,
  }).strict(),
  contrastP5: LumaBand,
  saturation: z.object({
    mean: LumaBand,
    p95: LumaBand,
  }).strict(),
  edges: LumaBand,
  paletteDistanceMax: z.number().min(0).max(441),
  warmShare: RatioBand,
  blueShare: RatioBand,
}).strict();

const FieldSchema = z.object({
  share: RatioBand,
  largestFlat: RatioBand,
  edgeBarMax: Ratio,
  fullBleed: z.literal(true),
  horizonPx: PixelBand,
  fieldRoles: z.array(IdentityToken).min(3).refine(unique, "fieldRoles must be unique"),
  noBlueOnBlue: z.literal(true),
}).strict();

const CompositionSchema = z.object({
  subjectHeight: RatioBand,
  subjectWidth: RatioBand,
  centroidX: RatioBand,
  centroidY: RatioBand,
  floorLine: RatioBand,
  heightTiersMin: z.number().int().min(1).max(6),
  heightSdMin: z.number().min(0).max(100),
  localContrastMin: z.number().min(0).max(255),
  localContrastMedian: z.number().min(0).max(255),
}).strict();

const EditSchema = z.object({
  medianS: SecondsBand,
  p10S: SecondsBand,
  p90S: SecondsBand,
  minS: z.number().positive(),
  maxS: z.number().positive(),
  cutsPerMinute: z.tuple([z.number().min(0).max(60), z.number().min(0).max(60)]),
  cutOnWordShare: RatioBand,
  hardCutShare: RatioBand,
  designedTransitionShare: RatioBand,
  holdMaxS: z.number().positive(),
  lastHoldMaxS: z.number().positive(),
}).strict();

const SilhouetteSchema = z.object({
  headOrnamentPct: RatioBand,
  torsoPct: RatioBand,
  legsPct: RatioBand,
  shoulderPct: RatioBand,
  handPct: RatioBand,
}).strict();

const AppearanceSchema = z.object({
  faceStyle: z.enum(["drawn-cartoon", "mask"]),
  headLayers: z.number().int().min(1).max(6),
  hairLayers: z.number().int().min(0).max(6),
  bradMetal: HexColourSchema,
  fingers: z.literal(false),
}).strict();

const CastSchema = z.object({
  archetype: IdentityToken,
  stageRoles: z.array(z.enum(STAGE_ROLES)).min(1).refine(unique, "stageRoles must be unique"),
  principals: countRange(1),
  chorus: countRange(0),
  stagedShare: Ratio,
  posesMin: z.number().int().min(1),
  expressionsMin: z.number().int().min(1),
  anchors: z.array(z.string().min(1)).min(1).refine(unique, "anchors must be unique"),
  silhouette: SilhouetteSchema,
  appearance: AppearanceSchema,
}).strict();

const PerformanceSchema = z.object({
  modes: z.array(z.enum(PERFORMANCE_MODES)).min(1).refine(unique, "modes must be unique"),
  defaultMode: z.enum(PERFORMANCE_MODES),
  stageShareMin: Ratio,
  detailShareMax: Ratio,
  entrance: z.number().int().min(1),
  exit: z.number().int().min(1),
  signatureMove: z.number().int().min(1),
}).strict();

const MotifsSchema = z.object({
  library: z.array(IdentityToken).min(3).refine(unique, "library must be unique"),
  perFilm: countRange(1),
  uses: countRange(1),
  maxShotShare: Ratio,
  semanticObjectMin: z.number().int().min(0),
  castOrnamentExempt: z.boolean(),
  defaultOpener: z.literal(false),
}).strict();

const ToneSchema = z.object({
  mode: IdentityToken,
  surface: z.string().min(1).max(160),
  subject: z.string().min(1).max(160),
  character: z.string().min(1).max(160),
  ending: z.string().min(1).max(160),
  tenderBeats: z.number().int().min(0).max(3),
  poisonAccents: z.array(z.string().min(1)),
  /** Optional: the eight tone beats are a Paper K-pop shape, not a universal one. */
  beats: z.array(IdentityToken).min(3).refine(unique, "beats must be unique").optional(),
}).strict();

export const StyleIdentitySchema = z.object({
  schemaVersion: z.literal(STYLE_IDENTITY_SCHEMA_VERSION),
  envelope: EnvelopeSchema,
  referenceFilm: ReferenceFilmSchema,
  surfaceBands: SurfaceBandsSchema,
  filmBands: FilmBandsSchema,
  field: FieldSchema,
  composition: CompositionSchema,
  edit: EditSchema,
  cast: z.union([NotApplicableSchema, CastSchema]),
  performance: z.union([NotApplicableSchema, PerformanceSchema]),
  motifs: MotifsSchema,
  tone: ToneSchema,
  forbidden: z.array(z.enum(FORBIDDEN_MOVES)).min(5).refine(unique, "forbidden must be unique"),
}).strict();

export type StyleIdentity = z.infer<typeof StyleIdentitySchema>;

/**
 * The bridge to src/engine/style-identity.ts. That engine keeps its own
 * `CastIdentity` input shape so the engine does not depend on tokens. The
 * adapter is the one place the two names are mapped. null means "this pack
 * stages no cast" and the film gate must refuse.
 */
export type IdentityCastRule = {
  max: number;
  stagedRatio: number;
  posesMin: number;
  expressionsMin: number;
  anchors: string[];
};

export function identityCastRule(identity: StyleIdentity): IdentityCastRule | null {
  // `in` narrows the union; `.notApplicable` alone does not typecheck.
  if ("notApplicable" in identity.cast) return null;
  return {
    max: identity.cast.principals.max,
    stagedRatio: identity.cast.stagedShare,
    posesMin: identity.cast.posesMin,
    expressionsMin: identity.cast.expressionsMin,
    anchors: identity.cast.anchors,
  };
}

/** The groups a pack still has to author. Used by style:new and the tests. */
export function identityGaps(tokensRaw: unknown): string[] {
  const raw = readPath(tokensRaw, "identity");
  if (raw === undefined) return ["identity"];
  const parsed = StyleIdentitySchema.safeParse(raw);
  if (parsed.success) return [];
  return [...new Set(parsed.error.issues.map((issue) => `identity.${issue.path.join(".")}`))];
}
```

**No `.default()` anywhere.** A default inside the identity block would be a
silent pass: the pack would look declared when it is not.

---

## 4. Fields, required vs optional, defaults, readers

`default` means **what `styles/_template/tokens.json` ships**, not a Zod
default. Everything else is required. Every group is between 1 and 11 fields;
the largest are `cast` at 10 and `edit` at 11, and no group needs a second block.

| Group | Required | Optional | Template ships | Reader after 01 |
|---|---|---|---|---|
| `envelope` | canvas, fps, dimension, projection, planes, cameraAxes | — | all | `style:check` schema; `style:identity` prints dimension |
| `referenceFilm` | surface | film, sha256 | **omitted** | `style:identity` (surface); `style:measure` (film) |
| `surfaceBands` | luma, contrast, saturation, edges, palette | — | channel values | `style:identity` today |
| `filmBands` | basis, luma{mean,p5,p50,p95}, contrastP5, saturation{mean,p95}, edges, paletteDistanceMax, warmShare, blueShare | — | **omitted** | `style:measure` today (except shares); `style:identity` in 02 |
| `field` | share, largestFlat, edgeBarMax, fullBleed, horizonPx, fieldRoles, noBlueOnBlue | — | all | 02 (frame probe) |
| `composition` | subjectHeight, subjectWidth, centroidX, centroidY, floorLine, heightTiersMin, heightSdMin, localContrastMin, localContrastMedian | — | all | 02 (paint probe bbox) |
| `edit` | medianS, p10S, p90S, minS, maxS, cutsPerMinute, cutOnWordShare, hardCutShare, designedTransitionShare, holdMaxS, lastHoldMaxS | - | all | `style:measure` cuts; preflight in 02 |
| `cast` | archetype, stageRoles, principals, chorus, stagedShare, posesMin, expressionsMin, anchors, silhouette, appearance — **or** N/A with a reason | — | channel cast | `style:identity` today (via `identityCastRule`) |
| `performance` | modes, defaultMode, stageShareMin, detailShareMax, entrance, exit, signatureMove — **or** N/A with a reason | — | channel performance | 02/score; human for the show test |
| `motifs` | library, perFilm, uses, maxShotShare, semanticObjectMin, castOrnamentExempt, defaultOpener | — | channel menu | score audit in a later plan |
| `tone` | mode, surface, subject, character, ending, tenderBeats, poisonAccents | beats | **omitted** | human; `style:check` checks the accents |
| `forbidden` | the 10 core ids, plus any style-specific ones | extra ids from `FORBIDDEN_MOVES` | core 10 | `style:check` (transition cross-check); recipe checks later |

**Why `cast`/`performance` may be N/A.** A Paper Studio pack may stage no cast
(the watercolor and keepsake families). The N/A path is narrow and checked:
`capabilities.limits.maxCast` must be 0 and `capabilities.assets.rigs` must be
N/A, or the pack fails (§6, `identity-cast`).

**Why `tone.beats` is optional.** The eight-beat shape is Paper K-pop's; a
different paper style has a different register. The five short tone fields are
required because "the style has no tone" is not a style.

---

## 5. Closed vocabularies

- `IDENTITY_DIMENSIONS`: `2d`, `2.5d-layered`. There is no `3d` value; a 3D
  camera is not representable.
- `CAMERA_AXES`: `x`, `y`, `z`, `roll`, `shake`.
- `STAGE_ROLES`: `star`, `backing`, `foil`, `creature`, `host`.
- `PERFORMANCE_MODES`: `stage-show`, `presenter-show`, `creature-show`.
- `FORBIDDEN_MOVES`: the 36 ids in §3. `FORBIDDEN_CORE` is the 10 a style may
  not omit.
- Motif ids, field roles, archetype and tone mode are **style vocabulary**, not
  a shared enum: they are lower-case tokens (`^[a-z][a-z0-9_-]*$`) declared per
  pack. A closed enum would make every new motif a contract change.

`forbidden` is the only list with a required subset. Unknown ids fail; a
duplicate fails; a core id left out fails.

---

## 6. `validateStylePack`: exact failures

A new layer `"identity"` is added to `LAYERS` (between `schema` and
`dimensions`); `profile.length` becomes 11. All identity failures live there.

The schema loop maps `tokens.identity` issues to identity rules instead of the
generic `schema` rule:

- missing value under `filmBands` or `surfaceBands` → `identity-band`
- missing value elsewhere → `identity-field`
- any other issue (type, domain, unknown key, duplicate) → `identity-value`

Semantic rules run on `tokensRaw` after the schema loop. Exact messages:

When the block is absent, only `identity-missing` / `identity-legacy` fires and
every other identity rule is skipped. A semantic rule only fires when its inputs
are present and the right shape, so one bad value is not reported twice.

| Rule | Trigger | Message | Where | Fix |
|---|---|---|---|---|
| `identity-missing` | no `tokens.identity`, no `capabilities.legacy` | `tokens.json has no identity block; every style declares one` | `tokens.json:identity` | `copy the block from styles/_template/tokens.json, then fill the three gaps it leaves` |
| `identity-legacy` | `capabilities.legacy` and no block | `this pack is marked legacy and has no identity block: <reason>. It is not a style under the identity contract.` | `capabilities.legacy` | `declare tokens.identity (see docs/STYLE-AUTHORING.md), then remove capabilities.legacy` |
| `identity-legacy-conflict` | both declared | `capabilities.legacy is declared but tokens.json has an identity block; a migrated pack is not legacy` | `capabilities.legacy` | `remove capabilities.legacy` |
| `identity-field` | required value missing outside a band block | `tokens.identity.<path> is missing; this value is required` | `tokens.json:identity.<path>` | group hint: `referenceFilm` → name the frames; `tone` → write the register; otherwise declare the value |
| `identity-band` | required value missing under `filmBands` or `surfaceBands` | `tokens.identity.<path> is missing; a band is required, not optional` | `tokens.json:identity.<path>` | `run npm run style:measure -- --ref <reference> and copy the summary; do not guess a band` |
| `identity-value` | wrong type, out of domain, unknown key, duplicate | `tokens.identity.<path>: <zod message>` | path | `declare the value the schema names; the identity block is closed` |
| `identity-range` | `[low, high]` inverted; `min > max`; edit bands out of order; horizon below the canvas | `tokens.identity.<path> is [<a>, <b>]; the low value must be <= the high value` — or `tokens.identity.edit.p10S [<a>, <b>] must end before edit.medianS [<c>, <d>] begins` | path | `order the band low to high` |
| `identity-placeholder` | any identity string matching `/^(todo|tbd|placeholder|fixme)\b/i` or containing `{{` | `tokens.identity.<path> still says "<value>"; the identity block may not be scaffolded` | path | `write the value, or remove the key — a missing value fails, a placeholder lies` |
| `identity-reference` | surface missing / outside the pack / empty; `basis: "film"` without `film`; `film` without `sha256`; `sha256` without `film` | `tokens.identity.referenceFilm.surface "<path>" does not exist under the pack` / `... contains no images` / `tokens.identity.filmBands.basis is "film" but referenceFilm.film is not named` / `tokens.identity.referenceFilm.film is named without sha256` / `... sha256 is declared without film` | path | `name references/... inside the pack; name the film and its sha256 when the bands were measured on it` |
| `identity-forbidden` | a core id is missing; a forbidden id is also in `tokens.motion.transitions` | `the ban list is missing the universal bans: <ids>` / `the ban list forbids "<id>" but tokens.motion.transitions allows it` | `tokens.json:identity.forbidden` | `declare every core ban; remove a banned transition from the allowed list` |
| `identity-cast` | cast N/A while `limits.maxCast > 0` or rigs declared; cast declared while `limits.maxCast` differs from `principals.max`, or rigs are N/A; principals + chorus > 7 | `identity.cast is N/A but capabilities.limits.maxCast is <n>` / `identity.cast.principals.max is <a> but capabilities.limits.maxCast is <b>; one fact, one place` / `identity.cast is declared but capabilities.assets.rigs is N/A` / `the cast totals <n> bodies; the channel stages at most 7 (2 principals + 5 chorus)` | `tokens.json:identity.cast` / `capabilities.*` | `declare the cast and its rig, or set maxCast 0, mark cast N/A and give a reason` |
| `identity-performance` | cast declared but performance N/A; cast N/A but performance declared; `defaultMode` not in `modes` | `identity.cast is declared but identity.performance is N/A; a cast without a stage is a portrait` / `identity.performance is declared but identity.cast is N/A; there is no stage without a performer` / `identity.performance.defaultMode "<mode>" is not one of its modes` | path | `declare the performance frame, or mark both N/A with a reason` |
| `identity-tone` | a poison accent is neither a colour role nor a field role | `tokens.identity.tone.poisonAccents names "<accent>" which is neither a colour role nor a field role` | path | `use a role from tokens.color.roles or identity.field.fieldRoles` |

**What is not checked.** Whether the declared bands are *true*. That is 02:
the reference film must land inside its own bands and the Uber film must fail
the field/placement/contrast bands (§5.5 of the spec). A fabricated band can
only be caught there, with the reference hash in the report.

**Minor fix while here.** The schema loop builds `where` as
`tokens.json:<path>` and then prefixes `tokens.json` again, so messages read
`tokens.json tokens.json:identity...`. Print `${where}: ${issue.message}` once.

---

## 7. What `style:check` prints

A new pack from the template (the three gaps):

```
STYLE: my-style 0.1.0
STATUS: DRAFT — 3 hard failures; not ready for review

BEFORE YOU APPROVE (mechanical, 3)
1. tokens.identity.referenceFilm is missing; this value is required
   Where: tokens.json:identity.referenceFilm
   Fix: name the frames you measured against (create references/ first)
2. tokens.identity.filmBands is missing; a band is required, not optional
   Where: tokens.json:identity.filmBands
   Fix: run npm run style:measure -- --ref <reference> and copy the summary; do not guess a band
3. tokens.identity.tone is missing; this value is required
   Where: tokens.json:identity.tone
   Fix: write the register in your own words in STYLE.md, then declare the same tone here
```

A legacy pack:

```
STATUS: DRAFT — 1 hard failure; not ready for review

BEFORE YOU APPROVE (mechanical, 1)
1. this pack is marked legacy and has no identity block: authored before the identity contract (0.2.0). It is not a style under the identity contract.
   Where: capabilities.legacy
   Fix: declare tokens.identity (see docs/STYLE-AUTHORING.md), then remove capabilities.legacy
```

Migrated paper-kpop:

```
STYLE: paper-kpop 0.2.0
STATUS: REVIEWABLE — machine-clean, waiting for your eyes
```

`style:approve` needs no change: a legacy or missing block is already a hard
failure, so approval refuses and writes no `signoff.json`.

---

## 8. Legacy policy

**Legacy is a label on a failure, never an exemption.** A pack that says
`legacy` is still DRAFT and still exits 1. The marker only replaces the generic
message with a specific one, records the reason in the pack, and gives the
migration a name.

There is no `migrate` flag. A pack is migrated when `tokens.identity` exists;
a second boolean would be the same fact twice and could disagree with the block.

| Pack | Today | Action in 01 | After 01 |
|---|---|---|---|
| `styles/paper-kpop` | REVIEWABLE, identity v0 (passthrough) | migrate to schema 1 (§10) | REVIEWABLE, identity layer passes |
| `styles/watercolor-0.2.0` | REVIEWABLE, no identity | add `capabilities.legacy` with the reason | DRAFT, 1 hard failure `identity-legacy`, exit 1 |
| `styles/watercolor` (0.1.0) | REVIEWABLE, no identity | same marker | same |
| `styles/paper-vows` | DRAFT, 142 hard failures, no `capabilities.identity` | none | still refused; it also names `identity-missing` |
| `gate/paper-kpop-blind/inputs/pack` | REVIEWABLE, sealed | **do not edit** | DRAFT, `identity-missing`; the gate test records the refusal |
| `gate/blind/**` | sealed S1a control | **do not edit or re-run** | its `validatorHash` no longer matches, by design; re-sealing is a separate decision |

`styles/paper-vows` cannot carry `capabilities.legacy` usefully because its
capabilities file does not parse as a pack. Do not add a marker there; it is
legacy by refusal.

A refusal is not a retraction. The S1c/S1c.1 results and the sealed blind remain
true for the contract they were obtained under; the tests record that the
contract moved after them, not that the films or packs were wrong.

`styles/watercolor` and `styles/watercolor-0.2.0` are accepted historical packs.
Their gate evidence under `gate/watercolor*` is not edited; the live packs become
DRAFT until someone buys the migration. This is a deliberate contract change and
goes in decision 0053 with both owners aware.

**Why not a soft warning.** `styleExitCode` returns 0 when there are no hard
failures. A warning would let `style:check styles/watercolor-0.2.0` pass in CI,
which is exactly the silent pass the spec's rule 5 forbids.

---

## 9. Template and `style:new`

### 9.1 `styles/_template/tokens.json`

Add an `identity` block with the nine structural groups. The three omitted
groups are the only placeholders:

```json
"identity": {
  "schemaVersion": 1,
  "envelope": {
    "canvas": { "width": 1920, "height": 1080 },
    "fps": 30,
    "dimension": "2.5d-layered",
    "projection": "orthographic",
    "planes": ["background", "midground", "character", "foreground", "type"],
    "cameraAxes": ["x", "y", "z", "roll", "shake"]
  },
  "surfaceBands": { "luma": 20, "contrast": 25, "saturation": 10, "edges": 5, "palette": 45 },
  "field": {
    "share": [0.18, 0.6],
    "largestFlat": [0.04, 0.46],
    "edgeBarMax": 0.08,
    "fullBleed": true,
    "horizonPx": [780, 900],
    "fieldRoles": ["paper", "ink", "accent", "metal", "soft", "shadow"],
    "noBlueOnBlue": true
  },
  "composition": {
    "subjectHeight": [0.13, 0.92],
    "subjectWidth": [0.04, 0.142],
    "centroidX": [0.3, 0.75],
    "centroidY": [0.38, 0.66],
    "floorLine": [0.65, 0.88],
    "heightTiersMin": 3,
    "heightSdMin": 15,
    "localContrastMin": 20,
    "localContrastMedian": 35
  },
  "edit": {
    "medianS": [2.4, 3.2],
    "p10S": [1.2, 1.8],
    "p90S": [4.4, 5],
    "minS": 0.6,
    "maxS": 6.2,
    "cutsPerMinute": [18, 24],
    "cutOnWordShare": [0.8, 0.95],
    "hardCutShare": [0.8, 0.9],
    "designedTransitionShare": [0.1, 0.2],
    "holdMaxS": 0.4,
    "lastHoldMaxS": 2
  },
  "cast": {
    "archetype": "paper-pop-performer",
    "stageRoles": ["star", "backing", "foil", "creature", "host"],
    "principals": { "min": 1, "max": 2 },
    "chorus": { "min": 0, "max": 5 },
    "stagedShare": 0.85,
    "posesMin": 8,
    "expressionsMin": 14,
    "anchors": ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"],
    "silhouette": {
      "headOrnamentPct": [0.22, 0.28],
      "torsoPct": [0.3, 0.35],
      "legsPct": [0.35, 0.4],
      "shoulderPct": [0.18, 0.22],
      "handPct": [0.013, 0.037]
    },
    "appearance": {
      "faceStyle": "drawn-cartoon",
      "headLayers": 3,
      "hairLayers": 3,
      "bradMetal": "#C68E2E",
      "fingers": false
    }
  },
  "performance": {
    "modes": ["stage-show", "presenter-show", "creature-show"],
    "defaultMode": "stage-show",
    "stageShareMin": 0.6,
    "detailShareMax": 0.4,
    "entrance": 1,
    "exit": 1,
    "signatureMove": 1
  },
  "motifs": {
    "library": ["sunburst", "paper-sun", "petal", "halo", "torn-strip", "tape", "stamp", "print-marks", "iris", "confetti", "speed-lines", "paperclip", "meter"],
    "perFilm": { "min": 3, "max": 5 },
    "uses": { "min": 2, "max": 5 },
    "maxShotShare": 0.4,
    "semanticObjectMin": 1,
    "castOrnamentExempt": true,
    "defaultOpener": false
  },
  "forbidden": [
    "glossy-3d", "bevel", "photo-face", "fingers", "soft-cast-shadow", "dof",
    "motion-blur", "side-bars", "text-over-face", "unverified-claim"
  ]
}
```

**What is deliberately absent:** `referenceFilm`, `filmBands`, `tone`. These are
not the template's to invent. A style with no reference is a guess; a style with
no tone is a template. `style:check` names all three.

**What the template may not contain:** `TODO`, `TBD`, `PLACEHOLDER`, `{{...}}`,
zero bands, or an empty tone. All four fail (`identity-placeholder`, or the
required-value rules). There is no "fill this in later" placeholder that passes.

**The template's own `motion` block is scaffolding.** Its `page_turn` and
`dissolve` remain allowed because its only recipe uses a page turn; the channel's
transition bans are paper-kpop's, not the scaffold's. A new Paper K-pop pack adds
them to `forbidden` and removes them from `motion.transitions`; the
`identity-forbidden` cross-check catches a pack that bans and allows the same
transition.

### 9.2 `styles/_template/capabilities.json`

Three edits: the cast limit, the proof frame and the rig, because the template now
declares a cast:

```json
"limits": { "maxCast": 2, ... },
"proof": { "frames": ["example_spread"], ... },
"assets": {
  "rigs": {
    "lead": {
      "construction": "Layered paper puppet: flat back plate, torso plate, head plate, cut hair, two arm chains, two leg chains; visible paper eyelets; no 3D, mesh or soft body.",
      "joints": ["neck", "shoulder-left", "shoulder-right", "elbow-left", "elbow-right", "hip-left", "hip-right", "knee-left", "knee-right", "ankle-left", "ankle-right"],
      "anchors": ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"]
    }
  }
}
```

No starter-library asset is added; an unused asset would warn on the template.
A no-cast style changes `maxCast` to 0, marks `cast` and `performance` N/A with
reasons, and sets `rigs` back to N/A.

### 9.3 `scripts/style.ts` (`commandNew`)

After copying the template, print `identityGaps(tokens)`:

```
CREATED: styles/my-style
BRIEF: styles/my-style/BRIEF.md (sha256:...)

IDENTITY: 3 values are yours to author; nothing was invented
  - identity.referenceFilm  name the frames (and the film + sha256) you measured
  - identity.filmBands      measure the reference with style:measure, then copy the bands
  - identity.tone           write the register in your own words, then declare it here
A pack with a gap is DRAFT: style:check names every one.

NEXT: npm run style:check -- styles/my-style
```

`identityGaps` reads the same schema the validator reads, so the two lists
cannot drift. `style:new` writes nothing into the gaps.

---

## 10. Migrating `paper-kpop/tokens.json`

### 10.1 The collision, resolved

| Today | After | Why |
|---|---|---|
| `identity.bands` (deltas vs the six crops: luma 20, contrast 25, saturation 10, edges 5, palette 45) | `identity.surfaceBands` (same five numbers) | the name now says what the numbers are; the delta gate keeps working |
| — | `identity.filmBands` (absolute ranges) | the film bands are a different measurement with different units; they must never share a name |
| `identity.dimension: "2d"` | `identity.envelope.dimension: "2.5d-layered"` | the source is a 2.5D layered stage (spec §1.4) |
| `identity.reference: "references/frames"` | `identity.referenceFilm.surface` | one reference field, film and surface in one place |
| `identity.cast.max: 2` | `identity.cast.principals.max: 2` (+ `min: 1`) | principals and chorus are separate; total is checked |
| `identity.cast.stagedRatio: 0.5` | `identity.cast.stagedShare: 0.85` | the spec's performer presence; 0.5 was the old under-check |
| `identity.cast.posesMin/expressionsMin/anchors` | unchanged | the construction is unchanged |

The old keys (`dimension`, `reference`, `bands`, `cast.max`,
`cast.stagedRatio`) are **removed**. The schema is strict; a leftover key fails.

### 10.2 The target block

```json
"identity": {
  "schemaVersion": 1,
  "envelope": {
    "canvas": { "width": 1920, "height": 1080 },
    "fps": 30,
    "dimension": "2.5d-layered",
    "projection": "orthographic",
    "planes": ["background", "midground", "character", "foreground", "type"],
    "cameraAxes": ["x", "y", "z", "roll", "shake"]
  },
  "referenceFilm": {
    "surface": "references/frames",
    "film": "Y:/NewVideoTest/out/claude-pop.mp4",
    "sha256": "sha256:<compute at migration: Get-FileHash -Algorithm SHA256 'Y:\\NewVideoTest\\out\\claude-pop.mp4'>"
  },
  "surfaceBands": { "luma": 20, "contrast": 25, "saturation": 10, "edges": 5, "palette": 45 },
  "filmBands": {
    "basis": "film",
    "luma": { "mean": [75, 130], "p5": [20, 60], "p50": [80, 140], "p95": [160, 200] },
    "contrastP5": [175, 210],
    "saturation": { "mean": [12, 35], "p95": [30, 60] },
    "edges": [7.5, 17.5],
    "paletteDistanceMax": 55,
    "warmShare": [0.4, 0.9],
    "blueShare": [0, 0.2]
  },
  "field": {
    "share": [0.18, 0.6],
    "largestFlat": [0.04, 0.46],
    "edgeBarMax": 0.08,
    "fullBleed": true,
    "horizonPx": [780, 900],
    "fieldRoles": ["paper", "ink", "red", "blue", "acid", "accent", "kraft", "teal", "oxblood", "orange", "green", "pink", "cream"],
    "noBlueOnBlue": true
  },
  "composition": {
    "subjectHeight": [0.13, 0.92],
    "subjectWidth": [0.04, 0.142],
    "centroidX": [0.3, 0.75],
    "centroidY": [0.38, 0.66],
    "floorLine": [0.65, 0.88],
    "heightTiersMin": 3,
    "heightSdMin": 15,
    "localContrastMin": 20,
    "localContrastMedian": 35
  },
  "edit": {
    "medianS": [2.4, 3.2],
    "p10S": [1.2, 1.8],
    "p90S": [4.4, 5],
    "minS": 0.6,
    "maxS": 6.2,
    "cutsPerMinute": [18, 24],
    "cutOnWordShare": [0.8, 0.95],
    "hardCutShare": [0.8, 0.9],
    "designedTransitionShare": [0.1, 0.2],
    "holdMaxS": 0.4,
    "lastHoldMaxS": 2
  },
  "cast": {
    "archetype": "paper-pop-performer",
    "stageRoles": ["star", "backing", "foil", "creature", "host"],
    "principals": { "min": 1, "max": 2 },
    "chorus": { "min": 0, "max": 5 },
    "stagedShare": 0.85,
    "posesMin": 8,
    "expressionsMin": 14,
    "anchors": ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"],
    "silhouette": {
      "headOrnamentPct": [0.22, 0.28],
      "torsoPct": [0.3, 0.35],
      "legsPct": [0.35, 0.4],
      "shoulderPct": [0.18, 0.22],
      "handPct": [0.013, 0.037]
    },
    "appearance": {
      "faceStyle": "drawn-cartoon",
      "headLayers": 3,
      "hairLayers": 3,
      "bradMetal": "#C68E2E",
      "fingers": false
    }
  },
  "performance": {
    "modes": ["stage-show", "presenter-show", "creature-show"],
    "defaultMode": "presenter-show",
    "stageShareMin": 0.6,
    "detailShareMax": 0.4,
    "entrance": 1,
    "exit": 1,
    "signatureMove": 1
  },
  "motifs": {
    "library": ["sunburst", "paper-sun", "petal", "halo", "torn-strip", "tape", "stamp", "print-marks", "iris", "confetti", "speed-lines", "paperclip", "meter"],
    "perFilm": { "min": 3, "max": 5 },
    "uses": { "min": 2, "max": 5 },
    "maxShotShare": 0.4,
    "semanticObjectMin": 1,
    "castOrnamentExempt": true,
    "defaultOpener": false
  },
  "tone": {
    "mode": "sweet-sinister-pop",
    "surface": "bright, warm, handmade, cute",
    "subject": "a real threat, a bad idea, a doom, a joke about power",
    "character": "sincere, deadpan, never mugging",
    "ending": "resolve, loop or hold; no cruel punchline",
    "tenderBeats": 1,
    "poisonAccents": ["acid", "pink"],
    "beats": ["bright-surface", "first-threat", "cute-in-danger", "comic-escalation", "dark-act", "tender-beat", "resolve-or-loop", "button"]
  },
  "forbidden": [
    "glossy-3d", "bevel", "photo-face", "fingers", "soft-cast-shadow", "dof",
    "motion-blur", "dissolve", "page_turn", "side-bars", "cream-plate-with-wings",
    "blue-on-blue", "office-worker-lead", "static-no-action", "camera-only-motion",
    "text-over-face", "lyric-wall", "too-many-roles", "default-opener",
    "diagram-opener", "same-opener-twice", "same-closer-twice", "same-motif-set-twice",
    "three-same-moves", "floating-prop", "floating-foot", "clipped-hand",
    "mirrored-badge", "pose-swap", "dead-hold", "generic-underline",
    "rounded-ui-card", "unlicensed-font", "unlicensed-track", "meme-sound",
    "unverified-claim"
  ]
}
```

### 10.3 Steps

1. Compute the film hash. Do not copy a hash from a document:
   `(Get-FileHash -Algorithm SHA256 'Y:\NewVideoTest\out\claude-pop.mp4').Hash.ToLower()`.
   If the film is absent, stop and ask the director; do not fall back to a
   fabricated value.
2. Measure the reference:
   `npm run style:measure -- --ref "Y:\NewVideoTest\out\claude-pop.mp4" --out build/identity/paper-kpop-reference`.
   Check the summary against the spec's point values: luma ≈ 100.9, saturation
   ≈ 21.8, edges ≈ 12.6, palette distance ≈ 48.3. If the tool cannot reproduce
   them, stop; the bands stay unwritten. Record the command and output in the
   decision record.
3. Replace the old `identity` object with §10.2, using the measured summary.
   `surfaceBands` copies the old `bands` unchanged. `filmBands` copies the
   measured ranges; the spec's §5.3 values are the expected result, not the
   source.
4. Run `npm run style:check -- styles/paper-kpop`. It must be REVIEWABLE with
   0 hard failures and 0 warnings.
5. Run `npm run style:identity -- films/uber-model/score.json --video`. It must
   still pass the surface bands and print `2.5d-layered`, 2 cast members and
   `stagedShare 0.85` (Uber stages 9/10 = 90%). If it fails on staged share,
   that is a real finding: record it, do not lower the band to pass.
6. No `capabilities.json` change is needed: `limits.maxCast` is already 2 and
   the rigs are declared. Do not bump the style version; the identity block
   changes no frame.

**Note on `edit.minS: 0.6`.** `tokens.motion.minShot` stays 1.2. The identity
band is the channel's allowed range; the pack's recipes may be stricter. The
spec's `minShot` supersession is a separate contract change and is parked.

**Note on `stagedShare`.** The old rule was 0.5; the spec's is 0.85. This is a
behaviour change in `style:identity` (via the adapter) and is recorded in 0053.
The Uber film passes; Same Alarm is not re-reviewed, and if it is below 0.85
that is a true identity finding.

---

## 11. Tests

### 11.1 `test/style-check.test.ts`

**Fixture changes** (this is the bulk of the diff):

- add `identityBlock()` returning a valid schema-1 block (the template's values
  plus referenceFilm/filmBands/tone);
- `tokens()` gains `identity: identityBlock()`;
- `buildPack()` creates `references/` and writes one `frame.png`;
- `capabilities()` sets `limits.maxCast: 2` and declares `assets.rigs`
  (`{ lead: { construction, joints, anchors } }`) instead of N/A;
- add `mutateIdentity(pack, fn)` that reads tokens, mutates the identity object,
  and saves it;
- `assert.equal(result.profile.length, 10)` → `11`; assert the new `identity`
  layer exists.

**New tests** (name → expected rule):

| Test | Rule |
|---|---|
| the identity block is required: a pack without it is DRAFT | `identity-missing` |
| a legacy pack is refused with its reason and cannot be approved | `identity-legacy` (message contains the reason; `approveStylePack` returns `approved: false`, no `signoff.json`) |
| legacy and identity cannot both be declared | `identity-legacy-conflict` |
| a missing band is a named failure, not a default | `identity-band` (message names `filmBands.luma.p50`) |
| an inverted band is refused with both values | `identity-range` (message contains `140` and `80`) |
| edit bands must be ordered p10 < median < p90 | `identity-range` (message names both bands) |
| a placeholder in the identity block is a hard failure | `identity-placeholder` (`tone.surface: "TODO"`) |
| the universal bans must be declared | `identity-forbidden` (delete `dof`) |
| a ban may not be simultaneously allowed | `identity-forbidden` (add `dissolve` while `motion.transitions` includes it) |
| a film-basis identity must name the film and its hash | `identity-reference` |
| a reference surface must exist inside the pack | `identity-reference` (`references/missing`) |
| cast limits must agree with capabilities | `identity-cast` (`principals.max: 3` vs `maxCast: 2`) |
| cast N/A needs `maxCast: 0` | `identity-cast` |
| cast declared needs declared rigs | `identity-cast` (rigs back to N/A) |
| a cast without a performance is refused | `identity-performance` |
| `defaultMode` must be in `modes` | `identity-performance` |
| a poison accent must be a colour or field role | `identity-tone` (`"purple"`) |
| `TokensSchema` keeps the block and the export list is closed | parse + `deepEqual`; `FORBIDDEN_MOVES` unique, `FORBIDDEN_CORE` ⊆ `FORBIDDEN_MOVES` |
| `identityCastRule` maps `principals.max`/`stagedShare` and returns null for N/A | unit |

### 11.2 Gate tests that must change

These tests encode the historical state; the new state is the refusal.

- `test/watercolor-gate.test.ts` (`styles/watercolor`): `REVIEWABLE` / 0 hard →
  `DRAFT`, 1 hard failure, rule `identity-legacy`; keep the open choice.
- `test/watercolor-0.2.0-gate.test.ts`: same.
- `test/paper-kpop-gate.test.ts` (the sealed blind pack): `REVIEWABLE` / 0 hard →
  `DRAFT`, 1 hard failure, rule `identity-missing`. **Do not edit the pack.**
- `test/paper-kpop-0.2.0-gate.test.ts`: unchanged (`REVIEWABLE`, 0 hard).
- `test/style-identity.test.ts`: unchanged (the engine keeps its input shape).

---

## 12. Verification

```bash
npm run typecheck                     # 0 errors
npm test                              # all tests, +18 or so

npm run style:check -- styles/_template          # DRAFT, 6 failures (3 identity + 3 binding), exit 0
npm run style:check -- styles/paper-kpop         # REVIEWABLE, 0 hard, 0 warnings
npm run style:check -- styles/watercolor         # DRAFT, 1 hard (identity-legacy), exit 1
npm run style:check -- styles/watercolor-0.2.0   # DRAFT, 1 hard (identity-legacy), exit 1
npm run style:check -- styles/paper-vows         # DRAFT (still refused)
npm run style:check -- gate/paper-kpop-blind/inputs/pack   # DRAFT, identity-missing

npm run style:identity -- films/uber-model/score.json --video   # pass, dimension 2.5d-layered, staged 90%
npm run style:new -- demo-identity --brief fixtures/wedding-min/brief.json
npm run style:check -- styles/demo-identity      # DRAFT with the 3 identity gaps
Remove-Item -Recurse -Force styles/demo-identity
```

The template is DRAFT and exits 0 by design (`styleExitCode` exempts the
basename `_template`). A new pack from it exits 1 until the three groups exist.

---

## 13. What we deliberately did not build

- **No second identity file.** The block is `tokens.identity`; the research JSON
  is not copied into the pack.
- **No per-leaf `{value, unit, scope, basis, measure, source}` objects.** Types
  imply units; provenance lives in the spec and in `docs/decisions/0053`. One
  `basis` remains on `filmBands` because *which reference calibrated the band*
  is a fact the reader needs.
- **No duplication.** No camera vocabulary (that is `tokens.motion.camera`), no
  palette hexes (that is `tokens.color`), no type block (that is `tokens.type`),
  no `cutsPerMinute` in two places (it is `edit`), no `subjectHeight` in two
  places (it is `composition`), no `performerPresenceMin` beside `stagedShare`.
- **No P1 blocks.** No `light`, `edge`, `depth`, `opening`, `closing`, `hud`,
  `variation`, `sound`, `voice` inside identity. They are already in `tokens`
  or have no reader. A 200-field schema that no check reads is the failure mode
  this plan exists to avoid.
- **No `cast.appearance` character instances.** Skin and hair hexes belong to
  `library/characters/<id>/poses.json`, not to the style.
- **No Zod defaults.** A default is a silent pass.
- **No identity in `STYLE_CONTRACT`.** It would move `contractHash` and break
  every binding; `validatorHash` already covers the schema.
- **No path-based exemption** for `gate/**`. The sealed pack is refused like any
  other un-migrated pack; the sealed inputs are not edited.
- **No automatic migration.** A person measures the reference and writes the
  bands; a tool that guessed them would invent values.
- **No film hashing in `style:check`.** The reference is 289 MB; `style:check`
  verifies that the surface exists, and 02 verifies the film hash when it reads
  the film. A hash checked nowhere is a claim, so 02 must check it.
- **No `--ref` flag on `style:new`.** It would scaffold a band from a path
  without a measurement.

---

## 14. Risks and open questions

1. **01 does not close the identity gap.** It makes the block declarable,
   strict and visible. `filmBands`, `field`, `composition` and `edit` are not
   enforced until 02. No report may say "identity done" after 01. The next film
   does not start until 02 proves the reference passes its own bands and Uber
   fails the field/placement/contrast bands.
2. **A fabricated band is undetectable in 01.** The only proof is 02: measure
   the reference named in `referenceFilm`, require every declared band to
   contain the measured value, and fail on a band the tool cannot measure. The
   reference hash in the report is what makes the claim auditable.
3. **Watercolor and the sealed blind become DRAFT.** This is a contract change
   for accepted evidence. `gate/**` is not edited; the test expectations change.
   Both owners must sign decision 0053.
4. **The next blind needs reference media.** The keepsake brief has no
   reference frames and no cast, so a re-seal would be refused with
   `identity-reference`. A future blind brief must ship reference frames (or a
   film); re-sealing is not part of this change.
5. **`stagedShare` rises from 0.5 to 0.85.** Uber passes at 90%. Same Alarm is
   not re-reviewed; if it is below 85%, that is a finding, not a reason to
   lower the band.
6. **The reference film lives outside the repo.** `referenceFilm.film` is a
   provenance path plus a hash; `style:check` does not require it to exist on
   every machine. 02 must refuse if the film is absent when it needs to measure.
7. **Template hash generation.** `styles/_template` changes, so its hash
   changes. Existing packs keep passing because `findDefaultTemplatePath`
   prefers the candidate matching their declared hash — `gate/blind/_template`
   is that candidate. If `gate/blind` is ever removed, paper-kpop and the
   watercolors need re-binding to the current template. Add this to the
   verification: `style:check -- styles/paper-kpop` must stay green after the
   template edit.
8. **`edit.minS 0.6` vs `motion.minShot 1.2`.** The identity band is wider than
   the pack's recipe floor. This is deliberate (the spec's floor is a separate
   contract change), but a reader may see it as drift. 0053 records it.

---

## 15. Files

**Changed in 01**

| File | Change |
|---|---|
| `src/core/style.ts` | `StyleIdentitySchema`, vocabularies, `identityGaps`, `identityCastRule`, `TokensSchema.identity`, `CapabilitiesSchema.legacy`, the identity validation section, the `identity` layer |
| `styles/_template/tokens.json` | the nine structural groups; omit referenceFilm, filmBands, tone |
| `styles/_template/capabilities.json` | `maxCast: 2`; `proof.frames: ["example_spread"]`; declared `assets.rigs` |
| `scripts/style.ts` | `commandNew` prints `identityGaps` |
| `styles/paper-kpop/tokens.json` | the §10.2 block |
| `styles/watercolor/capabilities.json` | `legacy: { reason }` |
| `styles/watercolor-0.2.0/capabilities.json` | `legacy: { reason }` |
| `scripts/style-identity.ts` | parse with `StyleIdentitySchema`; `surfaceBands`; `referenceFilm.surface`; `envelope.dimension`; `identityCastRule`; report carries both band sets |
| `test/style-check.test.ts` | fixture + 17 new tests + profile length 11 |
| `test/watercolor-gate.test.ts` | expect DRAFT / `identity-legacy` |
| `test/watercolor-0.2.0-gate.test.ts` | expect DRAFT / `identity-legacy` |
| `test/paper-kpop-gate.test.ts` | expect DRAFT / `identity-missing` |
| `docs/decisions/0053-style-identity-is-a-schema.md` | the decision record (new) |
| `docs/STYLE-AUTHORING.md` | the identity step and the three gaps |

**Not changed**

`styles/paper-vows/**`, `gate/**` (including `gate/blind/**` and the sealed
paper-kpop pack), `docs/research/identity/**`, `STYLE_CONTRACT`, every film
score. No new identity file, no new dependency, no new npm script.

**Follow-up (02, not this plan)**

`style:measure` adds the warm/blue share and bbox measurements; `style:identity`
reads every declared band, refuses a band it cannot measure, and refuses the
reference film if it falls outside its own bands. That is the plan that closes
the gap the spec names.
