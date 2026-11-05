import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { z } from "zod";

/**
 * Spec 0003 — Style Definition System (S1a).
 *
 * This file is the machine contract for a style pack. It contains:
 *   - the closed vocabularies;
 *   - the 27 decision rows;
 *   - Zod schemas for the six authored artifacts;
 *   - the validator, resolver and signature writer used by scripts/style.ts.
 *
 * Deliberate ambiguities are called out in comments starting with "Ambiguity:".
 */

// ---------------------------------------------------------------------------
// Closed vocabularies
// ---------------------------------------------------------------------------

export const PRIMITIVES = [
  "layer",
  "shape",
  "path",
  "text",
  "image",
  "camera",
  "effect",
  "transition",
] as const;

export const TRANSITIONS = [
  "cut",
  "page_turn",
  "dissolve",
  "iris",
  "wipe",
  "match_cut",
  "hold",
] as const;

export const EFFECTS = [
  "grain",
  "vignette",
  "fiber",
  "halftone",
  "shadow",
  "glow",
  "flash",
  "iris",
] as const;

export const CAMERA_MOVES = [
  "static",
  "push_in",
  "pull_back",
  "pan",
  "tilt",
  "orbit",
  "parallax",
] as const;

export const EASINGS = [
  "linear",
  "ease",
  "easeIn",
  "easeOut",
  "easeInOut",
  "backOut",
] as const;

export const ASSET_TYPES = [
  "character",
  "prop",
  "set",
  "frame",
  "texture",
  "type",
  "hud",
] as const;

export const BEAT_ROLES = [
  "open",
  "title",
  "portrait",
  "detail",
  "list",
  "quote",
  "transition",
  "close",
] as const;

export const TYPE_ROLES = [
  "display",
  "body",
  "caption",
  "label",
  "monogram",
] as const;

export const PHYSICS = [
  "ease",
  "squash",
  "overshoot",
  "anticipation",
  "none",
] as const;

export const SLOT_VOCABULARY = [
  "content.title",
  "content.subtitle",
  "content.names",
  "content.date",
  "content.venue",
  "content.body",
  "content.caption",
  "content.hashtag",
  "content.rsvp",
  "content.monogram",
  "photos.hero",
  "photos.supporting",
] as const;

export type Primitive = (typeof PRIMITIVES)[number];
export type Transition = (typeof TRANSITIONS)[number];
export type Effect = (typeof EFFECTS)[number];
export type CameraMove = (typeof CAMERA_MOVES)[number];
export type Easing = (typeof EASINGS)[number];
export type AssetType = (typeof ASSET_TYPES)[number];
export type BeatRole = (typeof BEAT_ROLES)[number];
export type TypeRole = (typeof TYPE_ROLES)[number];
export type Physics = (typeof PHYSICS)[number];
export type Slot = (typeof SLOT_VOCABULARY)[number];

const PRIMITIVE_SET: ReadonlySet<string> = new Set(PRIMITIVES);
const TRANSITION_SET: ReadonlySet<string> = new Set(TRANSITIONS);
const EFFECT_SET: ReadonlySet<string> = new Set(EFFECTS);
const CAMERA_MOVE_SET: ReadonlySet<string> = new Set(CAMERA_MOVES);
const EASING_SET: ReadonlySet<string> = new Set(EASINGS);
const ASSET_TYPE_SET: ReadonlySet<string> = new Set(ASSET_TYPES);
const BEAT_ROLE_SET: ReadonlySet<string> = new Set(BEAT_ROLES);
const TYPE_ROLE_SET: ReadonlySet<string> = new Set(TYPE_ROLES);
const PHYSICS_SET: ReadonlySet<string> = new Set(PHYSICS);
const SLOT_SET: ReadonlySet<string> = new Set(SLOT_VOCABULARY);

/** Style vocabulary for shape names; literal copy uses capitals and prose. */
const SHAPE_NAME_PATTERN = /^[a-z][a-z0-9 _.-]*$/;

// ---------------------------------------------------------------------------
// The 27 decisions
// ---------------------------------------------------------------------------

export type StyleDimension = {
  id: string;
  decision: string;
  where: string;
  required: boolean;
  "n/aAllowed": boolean;
  rule: string;
};

export const STYLE_DIMENSIONS: readonly StyleDimension[] = [
  {
    id: "D01",
    decision: "Medium & brush",
    where: "tokens.medium.brush",
    required: true,
    "n/aAllowed": false,
    rule: "brush non-empty",
  },
  {
    id: "D02",
    decision: "Material & surface",
    where: "tokens.medium.material",
    required: true,
    "n/aAllowed": false,
    rule: "non-empty",
  },
  {
    id: "D03",
    decision: "Light & shadow",
    where: "tokens.medium.light",
    required: true,
    "n/aAllowed": false,
    rule: "direction + softness + opacity",
  },
  {
    id: "D04",
    decision: "Colour system",
    where: "tokens.color",
    required: true,
    "n/aAllowed": false,
    rule: "≥2 palettes, six roles, default, maxColours 1–8",
  },
  {
    id: "D05",
    decision: "Texture & finish",
    where: "tokens.medium.texture",
    required: true,
    "n/aAllowed": false,
    rule: "numeric 0–1",
  },
  {
    id: "D06",
    decision: "Compositing order",
    where: "tokens.medium.layerOrder",
    required: true,
    "n/aAllowed": false,
    rule: "≥3 entries",
  },
  {
    id: "D07",
    decision: "Shape & geometry",
    where: "tokens.layout.shapes",
    required: true,
    "n/aAllowed": false,
    rule: "non-empty",
  },
  {
    id: "D08",
    decision: "Composition & safe zones",
    where: "tokens.layout",
    required: true,
    "n/aAllowed": false,
    rule: "margins 0–1, maxWords 1–40",
  },
  {
    id: "D09",
    decision: "Typography & lettering",
    where: "tokens.type",
    required: true,
    "n/aAllowed": false,
    rule: "name + file + licence; scale numeric",
  },
  {
    id: "D10",
    decision: "Camera & depth",
    where: "tokens.motion.camera",
    required: false,
    "n/aAllowed": true,
    rule: "moves from CAMERA_MOVES",
  },
  {
    id: "D11",
    decision: "Rig & character construction",
    where: "capabilities.assets.rigs",
    required: false,
    "n/aAllowed": true,
    rule: "rigs or N/A with reason",
  },
  {
    id: "D12",
    decision: "Timing & beat grid",
    where: "tokens.motion.timing",
    required: true,
    "n/aAllowed": false,
    rule: "bpm 30–220, offset 0–2, bar > 0",
  },
  {
    id: "D13",
    decision: "Motion & physics",
    where: "tokens.motion",
    required: true,
    "n/aAllowed": false,
    rule: "easings from EASINGS, physics from PHYSICS",
  },
  {
    id: "D14",
    decision: "Edit & transitions",
    where: "tokens.motion.transitions",
    required: true,
    "n/aAllowed": false,
    rule: "allowed from TRANSITIONS, minShot > 0",
  },
  {
    id: "D15",
    decision: "Sound & silence",
    where: "tokens.sound",
    required: false,
    "n/aAllowed": true,
    rule: "sound block or N/A with reason",
  },
  {
    id: "D16",
    decision: "Signature",
    where: "STYLE.md signature",
    required: true,
    "n/aAllowed": false,
    rule: "shot, transition, texture",
  },
  {
    id: "D17",
    decision: "Refusals",
    where: "STYLE.md refusals",
    required: true,
    "n/aAllowed": false,
    rule: "≥5",
  },
  {
    id: "D18",
    decision: "Register & fitness",
    where: "STYLE.md notFor",
    required: true,
    "n/aAllowed": false,
    rule: "≥3",
  },
  {
    id: "D19",
    decision: "Capabilities & limits",
    where: "capabilities.limits",
    required: true,
    "n/aAllowed": false,
    rule: "aspects, durations, maxCast, maxWords",
  },
  {
    id: "D20",
    decision: "Assets & registry",
    where: "capabilities.assets",
    required: true,
    "n/aAllowed": false,
    rule: "grammar + starter library; id, type, anchors",
  },
  {
    id: "D21",
    decision: "Recipes & shot contract",
    where: "recipes/*.json",
    required: true,
    "n/aAllowed": false,
    rule: "≥1 recipe; ops closed; slots closed",
  },
  {
    id: "D22",
    decision: "Runtime contract & seed",
    where: "capabilities.runtime, tokens.seed",
    required: true,
    "n/aAllowed": false,
    rule: "primitives ⊆ PRIMITIVES; seeded + fixed non-empty",
  },
  {
    id: "D23",
    decision: "Cost class",
    where: "capabilities.costClass",
    required: true,
    "n/aAllowed": false,
    rule: "light, standard, heavy",
  },
  {
    id: "D24",
    decision: "Reference media",
    where: "capabilities.evidence.sources",
    required: true,
    "n/aAllowed": false,
    rule: "≥3 sources; take / not-take / rights",
  },
  {
    id: "D25",
    decision: "Conformance protocol",
    where: "capabilities.proof",
    required: true,
    "n/aAllowed": false,
    rule: "status declared; frames, aspects, metrics named",
  },
  {
    id: "D26",
    decision: "Provenance, rights & lineage",
    where: "capabilities.identity, capabilities.governance",
    required: true,
    "n/aAllowed": false,
    rule: "author, licence, sources, lineage",
  },
  {
    id: "D27",
    decision: "Authoring protocol",
    where: "capabilities.bindings, BRIEF.md",
    required: true,
    "n/aAllowed": false,
    rule: "brief present; hashes match; questions log",
  },
];

export const CONTRACT_VERSION = 1;

/** The sealed contract. Kept small on purpose: vocabularies and the 27 rows. */
export const STYLE_CONTRACT = {
  version: CONTRACT_VERSION,
  primitives: PRIMITIVES,
  transitions: TRANSITIONS,
  effects: EFFECTS,
  cameraMoves: CAMERA_MOVES,
  easings: EASINGS,
  assetTypes: ASSET_TYPES,
  beatRoles: BEAT_ROLES,
  typeRoles: TYPE_ROLES,
  physics: PHYSICS,
  slotVocabulary: SLOT_VOCABULARY,
  dimensions: STYLE_DIMENSIONS,
} as const;

// ---------------------------------------------------------------------------
// Hashes
// ---------------------------------------------------------------------------

export function sha256(value: string | Buffer): string {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

export function hashFile(path: string): string {
  return sha256(readFileSync(path));
}

function listFiles(root: string, current = root): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(root, path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function relativePosix(root: string, path: string): string {
  return relative(root, path).split(sep).join("/");
}

function hashFileSet(root: string, files: string[]): string {
  const hash = createHash("sha256");
  const sorted = [...files].sort((a, b) =>
    relativePosix(root, a).localeCompare(relativePosix(root, b), "en"),
  );
  for (const file of sorted) {
    hash.update(relativePosix(root, file));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

/** Hash of every file in a directory. Used for the template identity. */
export function computeTemplateHash(templatePath: string): string {
  return hashFileSet(resolve(templatePath), listFiles(resolve(templatePath)));
}

/** Hash of every pack file except signoff.json. */
export function computePackHash(packPath: string): string {
  const root = resolve(packPath);
  if (!existsSync(root)) return sha256("");
  const files = listFiles(root).filter(
    (file) => relativePosix(root, file) !== "signoff.json",
  );
  return hashFileSet(root, files);
}

export function computeContractHash(): string {
  return sha256(JSON.stringify(STYLE_CONTRACT));
}

export function computeBriefHash(packPath: string): string {
  return hashFile(join(resolve(packPath), "BRIEF.md"));
}

/**
 * The validator identity is its source, package manifest and tsconfig only.
 * Installed dependencies, lockfiles and the seal itself are not part of it.
 */
export const VALIDATOR_MANIFEST_FILES = ["package.json", "tsconfig.json"] as const;

export function computeValidatorHash(validatorPath: string): string {
  const root = resolve(validatorPath);
  const files = VALIDATOR_MANIFEST_FILES.map((file) => join(root, file)).filter(
    (file) => existsSync(file),
  );
  for (const folder of ["src", "scripts"] as const) {
    const directory = join(root, folder);
    if (!existsSync(directory)) continue;
    files.push(...listFiles(directory).filter((file) => file.endsWith(".ts")));
  }
  return hashFileSet(root, files);
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/**
 * Find the template beside the repo or beside a sealed validator copy.
 *
 * When a declared hash is supplied, a candidate that still hashes to that
 * value wins. This keeps a blind-authored control bound to the sealed template
 * even after styles/_template moves on, without weakening the hash check.
 */
export function findDefaultTemplatePath(expectedHash?: string): string | null {
  const candidates = [
    join(process.cwd(), "styles", "_template"),
    join(process.cwd(), "gate", "blind", "_template"),
    join(process.cwd(), "_template"),
    join(process.cwd(), "..", "_template"),
  ];
  if (expectedHash !== undefined) {
    for (const candidate of candidates) {
      if (!existsSync(join(candidate, "capabilities.json"))) continue;
      if (computeTemplateHash(candidate) === expectedHash) return resolve(candidate);
    }
  }
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "capabilities.json"))) return resolve(candidate);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Zod primitives
// ---------------------------------------------------------------------------

const PrimitiveSchema = z.enum(PRIMITIVES);
const TransitionSchema = z.enum(TRANSITIONS);
const EffectSchema = z.enum(EFFECTS);
const CameraMoveSchema = z.enum(CAMERA_MOVES);
const EasingSchema = z.enum(EASINGS);
const AssetTypeSchema = z.enum(ASSET_TYPES);
const BeatRoleSchema = z.enum(BEAT_ROLES);
const TypeRoleSchema = z.enum(TYPE_ROLES);
const PhysicsSchema = z.enum(PHYSICS);
const SlotSchema = z.enum(SLOT_VOCABULARY);

export const HashSchema = z
  .string()
  .regex(/^sha256:[0-9a-f]{64}$/, "must be sha256:<64 hex characters>");

export const NotApplicableSchema = z.object({
  notApplicable: z.literal(true),
  reason: z.string().min(1),
});

const HexColourSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "must be a six-digit hex colour");

const NonEmptyRecordSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (value) => Object.keys(value).length > 0 && value.notApplicable !== true,
    "must be a non-empty object",
  );

// ---------------------------------------------------------------------------
// tokens.json
// ---------------------------------------------------------------------------

const LightSchema = z
  .object({
    direction: z.string().min(1),
    softness: z.number().min(0).max(1),
    opacity: z.number().min(0).max(1),
  })
  .passthrough();

const MediumSchema = z
  .object({
    brush: z.string().min(1),
    material: z.string().min(1),
    light: LightSchema,
    texture: z.number().min(0).max(1),
    layerOrder: z.array(z.string().min(1)).min(3),
  })
  .passthrough();

/**
 * Ambiguity: the spec says "six roles" but does not name them. We require six
 * unique role strings per style, and every palette must contain exactly those
 * six roles. The old paper-vows pack uses paper/ink/accent/metal/soft/shadow;
 * that is a valid choice, not a requirement.
 */
const ColourSchema = z
  .object({
    palettes: z
      .record(z.string().min(1), z.record(z.string().min(1), HexColourSchema))
      .refine((palettes) => Object.keys(palettes).length >= 2, "need at least two palettes"),
    roles: z.array(z.string().min(1)).length(6),
    default: z.string().min(1),
    maxColours: z.number().int().min(1).max(8),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    const roleSet = new Set(value.roles);
    if (roleSet.size !== value.roles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "colour roles must be unique",
        path: ["roles"],
      });
    }
    if (!(value.default in value.palettes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `default palette "${value.default}" is not in palettes`,
        path: ["default"],
      });
    }
    for (const [paletteName, palette] of Object.entries(value.palettes)) {
      for (const role of value.roles) {
        if (!(role in palette)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `palette "${paletteName}" is missing role "${role}"`,
            path: ["palettes", paletteName, role],
          });
        }
      }
      if (Object.keys(palette).length !== value.roles.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `palette "${paletteName}" must contain exactly the six declared roles`,
          path: ["palettes", paletteName],
        });
      }
    }
  });

const TypeFamilySchema = z
  .object({
    role: TypeRoleSchema,
    name: z.string().min(1),
    file: z.string().min(1),
    licence: z.string().min(1),
  })
  .passthrough();

const TypeSchema = z
  .object({
    families: z.array(TypeFamilySchema).min(1),
    scale: z.record(z.string().min(1), z.number().positive()),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    const roles = new Set<string>();
    for (const family of value.families) {
      if (roles.has(family.role)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate type role "${family.role}"`,
          path: ["families"],
        });
      }
      roles.add(family.role);
    }
    if (Object.keys(value.scale).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "scale must contain at least one numeric step",
        path: ["scale"],
      });
    }
  });

const MarginsSchema = z
  .object({
    top: z.number().min(0).max(1),
    right: z.number().min(0).max(1),
    bottom: z.number().min(0).max(1),
    left: z.number().min(0).max(1),
  })
  .passthrough();

const LayoutSchema = z
  .object({
    shapes: z.array(z.string().min(1)).min(1),
    margins: MarginsSchema,
    safeZones: z
      .array(z.union([z.string().min(1), NonEmptyRecordSchema]))
      .min(1),
    maxWords: z.number().int().min(1).max(40),
  })
  .passthrough();

const TimingSchema = z
  .object({
    bpm: z.number().min(30).max(220),
    offset: z.number().min(0).max(2),
    bar: z.number().positive(),
  })
  .passthrough();

/**
 * Ambiguity: the spec says "camera ... moves from CAMERA_MOVES" without a
 * shape. We use { moves: [...], default?: move }. N/A is allowed for D10.
 */
const CameraSchema = z.union([
  NotApplicableSchema,
  z
    .object({
      moves: z.array(CameraMoveSchema).min(1),
      default: CameraMoveSchema.optional(),
    })
    .passthrough(),
]);

const MotionSchema = z
  .object({
    timing: TimingSchema,
    camera: CameraSchema,
    easings: z.array(EasingSchema).min(1),
    physics: z.array(PhysicsSchema).min(1),
    transitions: z.array(TransitionSchema).min(1),
    minShot: z.number().positive(),
  })
  .passthrough();

/**
 * Ambiguity: the spec does not name sound fields. A sound block is any
 * non-empty object; an N/A block is exactly { notApplicable, reason }.
 */
const SoundSchema = z.union([
  NotApplicableSchema,
  z
    .record(z.string(), z.unknown())
    .refine(
      (value) => Object.keys(value).length > 0 && value.notApplicable !== true,
      "sound must be a non-empty sound block or an N/A block",
    ),
]);

const SeedSchema = z
  .object({
    seeded: z.array(z.string().min(1)).min(1),
    fixed: z.array(z.string().min(1)).min(1),
    jitterHz: z.number().min(0),
  })
  .passthrough();

/**
 * The identity block is the style's grammar, not a second style document.
 *
 * Nine groups, no defaults, strict keys. `filmBands` is optional in the
 * template so a new pack can be scaffolded before its reference is measured;
 * `identityGaps` is what turns that omission into a named failure. A pack with
 * a cast must declare the block; a pack with no cast is reported N/A.
 */
const IdentityBandSchema = z
  .tuple([z.number(), z.number()])
  .refine(([min, max]) => min < max, "band min must be less than max");

const IdentityRatioBandSchema = z
  .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
  .refine(([min, max]) => min < max, "band min must be less than max");

const IdentityCountBandSchema = z
  .object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  })
  .strict()
  .refine(({ min, max }) => min <= max, "count band min must be <= max");

const IdentityAppearanceSchema = z
  .object({
    faceStyle: z.string().min(1),
    headLayers: z.number().int().min(1),
    hairLayers: z.number().int().min(1),
    bradMetal: z.string().min(1),
    fingers: z.boolean(),
  })
  .strict();

/**
 * A film's mood selects a band; the bands are still the style's, not the
 * film's. A blue night and a white snowfield are both Paper K-pop, but a night
 * frame at snow luma is not. Older packs keep the one absolute band.
 */
const IdentityMoodBandSchema = z
  .object({
    lumaMean: IdentityBandSchema,
    saturationMean: IdentityBandSchema,
    edgesMean: IdentityBandSchema,
  })
  .strict();

/**
 * The cast's drawn proportions, keyed by construction archetype. The values are
 * measured from the rig (`body.height`, `body.head`) and checked against the
 * library's declared doll ratio. A pack may stage a tall goddess and a chibi
 * mortal; it may not let one film's lead be 7 heads and the next 3.
 */
const IdentityProportionSchema = z
  .object({
    /** Total drawn height divided by head height. */
    visualHeadToBody: z
      .tuple([z.number().positive(), z.number().positive()])
      .refine(([min, max]) => min < max, "visualHeadToBody min must be less than max"),
    /** Hand height divided by head height. */
    handToHead: z
      .tuple([z.number().positive(), z.number().positive()])
      .refine(([min, max]) => min < max, "handToHead min must be less than max"),
  })
  .strict();

export const StyleIdentitySchema = z
  .object({
    envelope: z
      .object({
        canvas: z.tuple([z.number().int().positive(), z.number().int().positive()]),
        fps: z.number().positive(),
        dimension: z.enum(["2d-flat", "2.5d-layered", "3d"]),
        cameraAxes: z
          .array(z.enum(["x", "y", "z", "roll", "shake"]))
          .min(1),
      })
      .strict(),
    reference: z.string().min(1),
    filmBands: z
      .object({
        lumaMean: IdentityBandSchema,
        saturationMean: IdentityBandSchema,
        edgesMean: IdentityBandSchema,
        /**
         * Optional named moods. The score's `mood` selects one; an unknown mood
         * falls back to the absolute band, so an old score still resolves.
         */
        moods: z.record(z.string().min(1), IdentityMoodBandSchema).optional(),
      })
      .strict()
      .optional(),
    field: z
      .object({
        edgeBarMax: z.number().min(0).max(1),
        largestFlat: IdentityRatioBandSchema,
        warmShare: IdentityRatioBandSchema,
        blueShareMax: z.number().min(0).max(1),
        saturatedShare: IdentityRatioBandSchema,
      })
      .strict(),
    /**
     * Colour is a family, not a fixed set of hexes. A film may use a green
     * grassland, a white snowfield or a blue night; the audit asks only that
     * the saturated colours form no more than a few hue families and that those
     * families cover the picture. Older packs omit this block.
     */
    palette: z
      .object({
        mode: z.literal("family"),
        maxHueFamilies: z.number().int().min(1).max(8),
        minFamilyShare: z.number().min(0).max(1),
        topFamiliesShare: z.number().min(0).max(1),
      })
      .strict()
      .optional(),
    composition: z
      .object({
        subjectHeight: IdentityRatioBandSchema,
        centroidX: IdentityRatioBandSchema,
        centroidShare: z.number().min(0).max(1),
        heightSdMin: z.number().positive(),
        heightTiersMin: z.number().int().min(1),
        localContrastMin: z.number().positive(),
        localContrastMedian: z.number().positive(),
        localContrastShare: z.number().min(0).max(1),
      })
      .strict(),
    cast: z
      .object({
        archetype: z.string().min(1),
        stageRoles: z.array(z.string().min(1)).min(1),
        principals: IdentityCountBandSchema,
        stagedShare: z.number().min(0).max(1),
        posesMin: z.number().int().min(1),
        expressionsMin: z.number().int().min(1),
        anchors: z.array(z.string().min(1)).min(1),
        appearance: IdentityAppearanceSchema,
        proportions: z.record(z.string().min(1), IdentityProportionSchema).optional(),
      })
      .strict(),
    performance: z
      .object({
        modes: z
          .array(z.enum(["stage-show", "presenter-show", "creature-show", "diagram-show"]))
          .min(1),
        defaultMode: z.enum(["stage-show", "presenter-show", "creature-show", "diagram-show"]),
        /**
         * Optional per-mode staged-shot band. A diagram show may stage 20-60%
         * of its shots; a stage/presenter show keeps the pack's high floor.
         * Absent means the cast.stagedShare floor, as before.
         */
        stagedShareByMode: z
          .object({
            "stage-show": z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]).optional(),
            "presenter-show": z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]).optional(),
            "creature-show": z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]).optional(),
            "diagram-show": z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]).optional(),
          })
          .strict()
          .optional(),
      })
      .strict(),
    motion: z
      .object({
        maxShotSeconds: z.number().positive(),
        actionsPerSecond: z.number().positive(),
        poseEventsPerStagedShot: z.number().int().min(1),
        /**
         * Two pose changes closer than this are a pop, not a performance. The
         * first pose must also be in force before this many seconds, so a shot
         * does not open neutral and snap into character.
         */
        minPoseGapSeconds: z.number().positive().optional(),
        maxFirstPoseSeconds: z.number().positive().optional(),
        minExpressionGapSeconds: z.number().positive().optional(),
        maxFirstExpressionSeconds: z.number().positive().optional(),
        reference: z.string().min(1),
      })
      .strict()
      .optional(),
    motifs: z
      .object({
        library: z.array(z.string().min(1)).min(1),
        perFilm: IdentityCountBandSchema,
        uses: IdentityCountBandSchema,
        maxShotShare: z.number().min(0).max(1),
        semanticObjectMin: z.number().int().min(0),
      })
      .strict(),
    forbidden: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type StyleIdentity = z.infer<typeof StyleIdentitySchema>;

/**
 * The one gap a new pack is allowed to start with. Everything else is a
 * template value the author must replace; `filmBands` cannot be invented
 * because it is the measurement of this style's own reference film.
 */
export function identityGaps(identity: StyleIdentity | undefined): string[] {
  if (!identity) return ["identity"];
  const gaps: string[] = [];
  if (!identity.filmBands) gaps.push("identity.filmBands");
  return gaps;
}

/** The pack rule, mapped for the film-level identity check. */
export function identityCastRule(identity: StyleIdentity): {
  archetype: string;
  stageRoles: string[];
  principals: { min: number; max: number };
  stagedShare: number;
  stagedShareByMode?: Partial<Record<string, readonly [number, number]>>;
  posesMin: number;
  expressionsMin: number;
  anchors: string[];
  appearance: StyleIdentity["cast"]["appearance"];
  proportions?: StyleIdentity["cast"]["proportions"];
} {
  return {
    archetype: identity.cast.archetype,
    stageRoles: identity.cast.stageRoles,
    principals: identity.cast.principals,
    stagedShare: identity.cast.stagedShare,
    stagedShareByMode: identity.performance.stagedShareByMode,
    posesMin: identity.cast.posesMin,
    expressionsMin: identity.cast.expressionsMin,
    anchors: identity.cast.anchors,
    appearance: identity.cast.appearance,
    proportions: identity.cast.proportions,
  };
}

export const TokensSchema = z
  .object({
    medium: MediumSchema,
    color: ColourSchema,
    type: TypeSchema,
    layout: LayoutSchema,
    motion: MotionSchema,
    sound: SoundSchema,
    seed: SeedSchema,
    identity: StyleIdentitySchema.optional(),
  })
  .passthrough();

export type StyleTokens = z.infer<typeof TokensSchema>;

// ---------------------------------------------------------------------------
// capabilities.json
// ---------------------------------------------------------------------------

export const BindingsSchema = z.object({
  briefHash: HashSchema,
  templateHash: HashSchema,
  contractHash: HashSchema,
});

export type StyleBindings = z.infer<typeof BindingsSchema>;

const IdentitySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/, "must be semver, e.g. 0.1.0"),
    family: z.string().min(1),
    extends: z.string().min(1).optional(),
    status: z.string().min(1),
    author: z.string().min(1),
    licence: z.string().min(1),
    lineage: z.array(z.string().min(1)).min(1),
    bindings: BindingsSchema,
  })
  .passthrough();

const LimitsSchema = z
  .object({
    aspects: z.array(z.string().min(1)).min(1),
    durations: z.array(z.number().positive()).min(1),
    maxCast: z.number().int().min(0),
    maxWords: z.number().int().min(1).max(40),
  })
  .passthrough();

const AdaptationSchema = z.union([
  z.array(z.string().min(1)).min(1),
  NonEmptyRecordSchema,
]);

const AssetEntrySchema = z
  .object({
    id: z.string().min(1),
    type: AssetTypeSchema,
    anchors: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

const RigsSchema = z.union([
  NotApplicableSchema,
  z.array(z.union([z.string().min(1), NonEmptyRecordSchema])).min(1),
  NonEmptyRecordSchema,
]);

const AssetsSchema = z
  .object({
    grammar: z.union([z.string().min(1), NonEmptyRecordSchema]),
    starterLibrary: z.array(AssetEntrySchema).min(1),
    rigs: RigsSchema,
  })
  .passthrough();

const RuntimeSchema = z
  .object({
    primitives: z.array(PrimitiveSchema).min(1),
  })
  .passthrough();

const EvidenceSourceSchema = z
  .object({
    take: z.string().min(1),
    notTake: z.string().min(1),
    rights: z.string().min(1),
  })
  .passthrough();

const EvidenceSchema = z
  .object({
    sources: z.array(EvidenceSourceSchema).min(3),
  })
  .passthrough();

const ProofSchema = z
  .object({
    status: z.literal("declared"),
    frames: z.array(z.string().min(1)).min(1),
    aspects: z.array(z.string().min(1)).min(1),
    metrics: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

const CostClassSchema = z.enum(["light", "standard", "heavy"]);

export const CapabilitiesSchema = z
  .object({
    identity: IdentitySchema,
    limits: LimitsSchema,
    adaptation: AdaptationSchema,
    assets: AssetsSchema,
    runtime: RuntimeSchema,
    evidence: EvidenceSchema,
    proof: ProofSchema,
    governance: NonEmptyRecordSchema,
    costClass: CostClassSchema,
  })
  .passthrough();

export type StyleCapabilities = z.infer<typeof CapabilitiesSchema>;

// ---------------------------------------------------------------------------
// recipes/*.json
// ---------------------------------------------------------------------------

/**
 * Composition ops are closed contracts. Each op lists exactly the layout keys
 * it may carry; anything else is a schema error, so literal copy cannot ride
 * along on an unrelated key. The known layout vocabulary is shared through the
 * field groups below.
 */
const IdField = z.string().min(1).optional();
const BoxFields = {
  align: z.string().min(1).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  w: z.number().positive().optional(),
  h: z.number().positive().optional(),
};
const PaintFields = {
  color: z.string().min(1).optional(),
  fill: z.string().min(1).optional(),
  stroke: z.string().min(1).optional(),
};
const TransformFields = {
  rotate: z.number().optional(),
  scale: z.number().positive().optional(),
  opacity: z.number().min(0).max(1).optional(),
};
const StackField = { z: z.number().optional() };
const PointsSchema = z.array(
  z.union([z.number(), z.tuple([z.number(), z.number()])]),
);
/**
 * Shape names are style vocabulary, not copy: lower-case words, digits and
 * separators only. A value such as "Ada & Ben" fails the schema.
 */
const ShapeNameSchema = z
  .string()
  .min(1)
  .regex(SHAPE_NAME_PATTERN, "must be a lower-case shape name");

type VisualFields = {
  id?: string;
  align?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  rotate?: number;
  scale?: number;
  opacity?: number;
  z?: number;
};

export type CompositionOp =
  | { op: "layer"; id?: string; z?: number; opacity?: number }
  | (VisualFields & {
      op: "shape";
      kind?: string;
      shape?: string;
      points?: Array<number | [number, number]>;
      asset?: string;
      frame?: string;
    })
  | (VisualFields & {
      op: "path";
      path?: string;
      points?: Array<number | [number, number]>;
    })
  | (VisualFields & {
      op: "text";
      slot: Slot;
      typeRole?: TypeRole;
    })
  | (VisualFields & {
      op: "image";
      slot?: Slot;
      frame?: string;
      asset?: string;
      width?: number;
    })
  | {
      op: "camera";
      move: CameraMove;
      from?: number;
      to?: number;
      ease?: Easing;
    }
  | { op: "effect"; z?: number; kind: Effect; opacity?: number; amount?: number }
  | { op: "transition"; kind: Transition };

const LayerOpSchema: z.ZodType<Extract<CompositionOp, { op: "layer" }>> = z
  .object({
    op: z.literal("layer"),
    id: IdField,
    ...StackField,
    opacity: z.number().min(0).max(1).optional(),
  })
  .strict();

const ShapeOpSchema = z
  .object({
    op: z.literal("shape"),
    id: IdField,
    ...BoxFields,
    ...PaintFields,
    ...TransformFields,
    ...StackField,
    kind: ShapeNameSchema.optional(),
    shape: ShapeNameSchema.optional(),
    points: PointsSchema.optional(),
    asset: z.string().min(1).optional(),
    frame: z.string().min(1).optional(),
  })
  .strict();

const PathOpSchema = z
  .object({
    op: z.literal("path"),
    id: IdField,
    ...BoxFields,
    ...PaintFields,
    ...TransformFields,
    ...StackField,
    path: z.string().min(1).optional(),
    points: PointsSchema.optional(),
  })
  .strict();

const TextOpSchema = z
  .object({
    op: z.literal("text"),
    id: IdField,
    ...BoxFields,
    ...PaintFields,
    ...TransformFields,
    ...StackField,
    slot: SlotSchema,
    typeRole: TypeRoleSchema.optional(),
  })
  .strict();

const ImageOpSchema = z
  .object({
    op: z.literal("image"),
    id: IdField,
    ...BoxFields,
    ...PaintFields,
    ...TransformFields,
    ...StackField,
    slot: SlotSchema.optional(),
    frame: z.string().min(1).optional(),
    asset: z.string().min(1).optional(),
    /** The control pack uses width as a synonym for w. */
    width: z.number().positive().optional(),
  })
  .strict();

const CameraOpSchema = z
  .object({
    op: z.literal("camera"),
    move: CameraMoveSchema,
    from: z.number().optional(),
    to: z.number().optional(),
    ease: EasingSchema.optional(),
  })
  .strict();

const EffectOpSchema = z
  .object({
    op: z.literal("effect"),
    ...StackField,
    kind: EffectSchema,
    opacity: z.number().min(0).max(1).optional(),
    amount: z.number().optional(),
  })
  .strict();

const TransitionOpSchema = z
  .object({
    op: z.literal("transition"),
    kind: TransitionSchema,
  })
  .strict();

export const CompositionOpSchema: z.ZodType<CompositionOp> = z.union([
  LayerOpSchema,
  ShapeOpSchema,
  PathOpSchema,
  TextOpSchema,
  ImageOpSchema,
  CameraOpSchema,
  EffectOpSchema,
  TransitionOpSchema,
]);

const DurationSchema = z
  .object({
    min: z.number().positive(),
    max: z.number().positive(),
    default: z.number().positive(),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (value.min > value.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "duration.min must be <= duration.max",
        path: ["min"],
      });
    }
    if (value.default < value.min || value.default > value.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "duration.default must sit between min and max",
        path: ["default"],
      });
    }
  });

const RecipeCameraSchema = z
  .object({
    move: CameraMoveSchema,
    from: z.number().optional(),
    to: z.number().optional(),
    ease: EasingSchema.optional(),
  })
  .passthrough();

export const RecipeSchema = z
  .object({
    id: z.string().min(1),
    beatRoles: z.array(BeatRoleSchema).min(1),
    duration: DurationSchema,
    camera: RecipeCameraSchema,
    slots: z.array(SlotSchema),
    assets: z.array(z.string().min(1)),
    composition: z.array(CompositionOpSchema).min(1),
    transitionOut: TransitionSchema,
    failureModes: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export type StyleRecipe = z.infer<typeof RecipeSchema>;

// ---------------------------------------------------------------------------
// Generic content brief and resolve format
// ---------------------------------------------------------------------------

const ContentSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    names: z.string().optional(),
    date: z.string().optional(),
    venue: z.string().optional(),
    body: z.string().optional(),
    caption: z.string().optional(),
    hashtag: z.string().optional(),
    rsvp: z.string().optional(),
    monogram: z.string().optional(),
  })
  .passthrough();

const PhotosSchema = z
  .object({
    hero: z.string().optional(),
    supporting: z.array(z.string()).optional(),
  })
  .passthrough()
  .default({});

export const GenericBriefSchema = z
  .object({
    content: ContentSchema,
    photos: PhotosSchema,
  })
  .passthrough();

export type GenericBrief = z.infer<typeof GenericBriefSchema>;

const BeatRoleMapValueSchema = z.union([
  BeatRoleSchema,
  z.array(BeatRoleSchema).min(1),
]);

const SequenceEntrySchema = z.object({
  beat: z.string().min(1),
  role: BeatRoleSchema,
  count: z.number().int().positive(),
});

export const ResolveFormatSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    beatRoleMap: z
      .record(z.string().min(1), BeatRoleMapValueSchema)
      .refine(
        (value) => Object.keys(value).length > 0,
        "beatRoleMap must map at least one format beat",
      ),
    sequence: z.array(SequenceEntrySchema).min(1).optional(),
    /**
     * The recipes this deliverable is allowed to use. A format that names its
     * pool cannot be re-cut by a recipe added to the pack later; a format that
     * does not name one may use any recipe in the pack.
     */
    recipes: z.array(z.string().min(1)).min(1).optional(),
    durations: z.array(z.number().positive()).min(1),
    aspects: z.array(z.string().min(1)).min(1),
    primaryAspect: z.string().min(1),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (!value.aspects.includes(value.primaryAspect)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "primaryAspect must be one of aspects",
        path: ["primaryAspect"],
      });
    }
  });

export type ResolveFormat = z.infer<typeof ResolveFormatSchema>;

export const SignoffSchema = z
  .object({
    by: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
    version: z.string().min(1),
    packHash: HashSchema,
    briefHash: HashSchema,
    templateHash: HashSchema,
    contractHash: HashSchema,
  })
  .passthrough();

export type StyleSignoff = z.infer<typeof SignoffSchema>;

export const SealSchema = z
  .object({
    version: z.number().int().positive(),
    createdAt: z.string().min(1),
    templateHash: HashSchema,
    contractHash: HashSchema,
    briefHash: HashSchema,
    authoringHash: HashSchema,
    promptHash: HashSchema,
    validatorHash: HashSchema,
    files: z.record(z.string().min(1), HashSchema),
  })
  .passthrough();

export type StyleSeal = z.infer<typeof SealSchema>;

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export type LoadedStylePack = {
  path: string;
  tokens: StyleTokens;
  capabilities: StyleCapabilities;
  recipes: StyleRecipe[];
  brief: string;
  styleDocument: string;
  card: string;
  cardPath: string;
  packHash: string;
  briefHash: string;
  signoff?: StyleSignoff;
};

export class StyleLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StyleLoadError";
  }
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

function formatIssues(label: string, error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${label} ${where}: ${issue.message}`;
    })
    .join("\n");
}

function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new StyleLoadError(formatIssues(label, parsed.error));
  }
  return parsed.data;
}

export function loadStylePack(packPath: string): LoadedStylePack {
  const root = resolve(packPath);
  if (!existsSync(root)) {
    throw new StyleLoadError(`style pack not found: ${packPath}`);
  }

  const requiredFiles = [
    "BRIEF.md",
    "STYLE.md",
    "tokens.json",
    "capabilities.json",
    "card.html",
  ];
  for (const file of requiredFiles) {
    if (!existsSync(join(root, file))) {
      throw new StyleLoadError(`style pack is missing ${file}: ${packPath}`);
    }
  }

  const recipesDir = join(root, "recipes");
  if (!existsSync(recipesDir)) {
    throw new StyleLoadError(`style pack is missing recipes/: ${packPath}`);
  }

  const tokens = parseOrThrow(TokensSchema, readJson(join(root, "tokens.json")), "tokens.json");
  const capabilities = parseOrThrow(
    CapabilitiesSchema,
    readJson(join(root, "capabilities.json")),
    "capabilities.json",
  );

  const recipeFiles = readdirSync(recipesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();
  if (recipeFiles.length === 0) {
    throw new StyleLoadError(`style pack has no recipes: ${packPath}`);
  }

  const recipes: StyleRecipe[] = [];
  for (const file of recipeFiles) {
    recipes.push(
      parseOrThrow(RecipeSchema, readJson(join(recipesDir, file)), `recipes/${file}`),
    );
  }

  let signoff: StyleSignoff | undefined;
  const signoffPath = join(root, "signoff.json");
  if (existsSync(signoffPath)) {
    signoff = parseOrThrow(SignoffSchema, readJson(signoffPath), "signoff.json");
  }

  return {
    path: root,
    tokens,
    capabilities,
    recipes,
    brief: readFileSync(join(root, "BRIEF.md"), "utf8"),
    styleDocument: readFileSync(join(root, "STYLE.md"), "utf8"),
    card: readFileSync(join(root, "card.html"), "utf8"),
    cardPath: toDisplayPath(join(root, "card.html")),
    packHash: computePackHash(root),
    briefHash: computeBriefHash(root),
    signoff,
  };
}

function toDisplayPath(path: string): string {
  return relative(process.cwd(), path).split(sep).join("/");
}

export class StyleSealError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StyleSealError";
  }
}

/** Read a seal strictly. A present but unparseable seal invalidates the run. */
export function readStyleSeal(sealPath: string): StyleSeal {
  if (!existsSync(sealPath)) {
    throw new StyleSealError(`SEAL.json not found: ${sealPath}`);
  }
  let raw: unknown;
  try {
    // A legacy PowerShell seal may carry a UTF-8 BOM. New seals never do.
    const text = readFileSync(sealPath, "utf8").replace(/^\uFEFF/, "");
    raw = JSON.parse(text) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new StyleSealError(
      `sealed run invalidated: SEAL.json cannot be parsed: ${sealPath}: ${message}`,
    );
  }
  const parsed = SealSchema.safeParse(raw);
  if (!parsed.success) {
    throw new StyleSealError(
      `sealed run invalidated: ${formatIssues("SEAL.json", parsed.error)}`,
    );
  }
  return parsed.data;
}

/**
 * Compare a seal with the files that are on disk now. Sealed hashes are
 * evidence, never a substitute for the current file's hash.
 */
export function checkSealedRun(root: string, seal: StyleSeal): string[] {
  const problems: string[] = [];
  const compare = (label: string, expected: string, actual: string | null): void => {
    if (actual === null) {
      problems.push(`${label} file is missing`);
    } else if (actual !== expected) {
      problems.push(`${label} hash changed`);
    }
  };
  const templatePath = join(root, "_template");
  compare(
    "templateHash",
    seal.templateHash,
    existsSync(templatePath) ? computeTemplateHash(templatePath) : null,
  );
  compare("contractHash", seal.contractHash, computeContractHash());
  const briefPath = join(root, "brief.md");
  compare(
    "briefHash",
    seal.briefHash,
    existsSync(briefPath) ? hashFile(briefPath) : null,
  );
  const authoringPath = join(root, "STYLE-AUTHORING.md");
  compare(
    "authoringHash",
    seal.authoringHash,
    existsSync(authoringPath) ? hashFile(authoringPath) : null,
  );
  const promptPath = join(root, "prompt.md");
  compare(
    "promptHash",
    seal.promptHash,
    existsSync(promptPath) ? hashFile(promptPath) : null,
  );
  const validatorPath = join(root, "validator");
  compare(
    "validatorHash",
    seal.validatorHash,
    existsSync(validatorPath) ? computeValidatorHash(validatorPath) : null,
  );

  const sealedFiles = Object.entries(seal.files).sort(([a], [b]) =>
    a.localeCompare(b, "en"),
  );
  for (const [relativePath, expected] of sealedFiles) {
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) {
      problems.push(`sealed file is missing: ${relativePath}`);
      continue;
    }
    if (hashFile(filePath) !== expected) {
      problems.push(`sealed file changed: ${relativePath}`);
    }
  }

  const known = new Set(Object.keys(seal.files));
  for (const file of listFiles(root)) {
    const relativePath = relativePosix(root, file);
    if (relativePath === "SEAL.json") continue;
    if (relativePath === "package-lock.json") continue;
    if (relativePath.endsWith("/package-lock.json")) continue;
    if (relativePath.split("/").includes("node_modules")) continue;
    // The author's pack is output, not a sealed input.
    if (relativePath === "pack" || relativePath.startsWith("pack/")) continue;
    if (!known.has(relativePath)) {
      problems.push(`sealed file set changed: ${relativePath} is not in the seal`);
    }
  }

  return problems.map((problem) => `sealed run invalidated: ${problem}`);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type StyleStatus = "DRAFT" | "REVIEWABLE" | "APPROVED";

export type StyleFailure = {
  layer: string;
  rule: string;
  message: string;
  where?: string;
  fix?: string;
};

export type StyleWarning = {
  layer: string;
  rule: string;
  message: string;
  where?: string;
};

export type TasteChoice = {
  id: string;
  question: string;
  options?: string[];
  where?: string;
};

export type StyleProfileLayer = {
  layer: string;
  passed: boolean;
  hardFailures: number;
  warnings: number;
};

export type StyleCheckResult = {
  status: StyleStatus;
  statusLine: string;
  styleId: string;
  name: string;
  version: string;
  packPath: string;
  cardPath: string;
  packHash: string;
  briefHash: string;
  hardFailures: StyleFailure[];
  warnings: StyleWarning[];
  chosen: TasteChoice[];
  profile: StyleProfileLayer[];
  signoff?: StyleSignoff;
};

export type ValidateStylePackOptions = {
  /** Defaults to styles/_template, then _template, then ../_template. */
  templatePath?: string;
  /** Override the expected template hash (used by the sealed blind run). */
  expectedTemplateHash?: string;
  /** Override the expected contract hash (used by the sealed blind run). */
  expectedContractHash?: string;
  /** The frozen brief hash from SEAL.json (used by the sealed blind run). */
  expectedBriefHash?: string;
};

const LAYERS = [
  "files",
  "schema",
  "identity",
  "dimensions",
  "story",
  "content",
  "references",
  "bindings",
  "card",
  "proof",
  "signoff",
] as const;

type LayerName = (typeof LAYERS)[number];

type LayerCounter = { hard: number; warnings: number };

function makeLayerCounters(): Record<LayerName, LayerCounter> {
  return Object.fromEntries(
    LAYERS.map((layer) => [layer, { hard: 0, warnings: 0 }]),
  ) as Record<LayerName, LayerCounter>;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readPath(value: unknown, path: string): unknown {
  let current: unknown = value;
  for (const key of path.split(".")) {
    const record = asRecord(current);
    if (record === null) return undefined;
    current = record[key];
  }
  return current;
}

function isNotApplicable(value: unknown): boolean {
  const record = asRecord(value);
  return record !== null && record.notApplicable === true;
}

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    if (isNotApplicable(value)) return false;
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return true;
}

function nonApplicableReason(value: unknown): string | null {
  const record = asRecord(value);
  if (record === null || record.notApplicable !== true) return null;
  return asString(record.reason)?.trim() || null;
}

function findSection(markdown: string, heading: string): string | null {
  const lines = markdown.split(/\r?\n/);
  const wanted = `## ${heading}`.toLowerCase();
  const start = lines.findIndex((line) => line.trim().toLowerCase() === wanted);
  if (start < 0) return null;
  const body: string[] = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) break;
    if (/^##\s+/.test(line)) break;
    body.push(line);
  }
  return body.join("\n").trim();
}

const SIGNATURE_LABELS = ["shot", "transition", "texture"] as const;
type SignatureLabel = (typeof SIGNATURE_LABELS)[number];

/** D16 is a structured signature: three bullet labels with non-empty values. */
function parseSignatureSection(
  section: string | null,
): Partial<Record<SignatureLabel, string>> {
  const parts: Partial<Record<SignatureLabel, string>> = {};
  if (section === null) return parts;

  let current: SignatureLabel | null = null;
  for (const line of section.split(/\r?\n/)) {
    const match = /^\s*[-*]\s+\*\*\s*(shot|transition|texture)\s*:\s*\*\*\s*(.*)$/i.exec(
      line,
    );
    if (match) {
      const label = (match[1] ?? "").toLowerCase() as SignatureLabel;
      current = label;
      parts[label] = (match[2] ?? "").trim();
      continue;
    }
    if (/^\s*[-*]\s+\S/.test(line)) {
      current = null;
      continue;
    }
    if (current !== null && line.trim().length > 0) {
      parts[current] = `${parts[current] ?? ""} ${line.trim()}`.trim();
    }
  }
  return parts;
}

function signatureTransitionToken(
  value: string,
  allowed: ReadonlySet<string>,
): string | null {
  for (const token of allowed) {
    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9_])${token}([^a-zA-Z0-9_]|$)`,
      "i",
    );
    if (pattern.test(value)) return token;
  }
  return null;
}

function bulletCount(section: string | null): number {
  if (section === null) return 0;
  return section
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+\S/.test(line)).length;
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlIncludes(card: string, text: string): boolean {
  return card.includes(text) || card.includes(htmlEscape(text));
}

const CARD_SECTIONS = [
  "hero",
  "legend",
  "visuals",
  "palette",
  "type",
  "motion",
  "sound",
  "rules",
  "fit",
  "proof",
  "signoff",
] as const;

const SIGNOFF_ELEMENT_PATTERN =
  /<([a-zA-Z][\w-]*)([^>]*(?<![\w-])data-signoff(?![\w-])[^>]*)>[\s\S]*?<\/\1>/;
const SIGNOFF_TEXT_PATTERN =
  /<([a-zA-Z][\w-]*)([^>]*(?<![\w-])data-signoff(?![\w-])[^>]*)>([\s\S]*?)<\/\1>/;
const STATUS_ELEMENT_GLOBAL =
  /<([a-zA-Z][\w-]*)([^>]*(?<![\w-])data-status(?![\w-])[^>]*)>([\s\S]*?)<\/\1>/g;
const WAITING_ELEMENT_GLOBAL =
  /<([a-zA-Z][\w-]*)([^>]*(?<![\w-])data-waiting(?![\w-])[^>]*)>([\s\S]*?)<\/\1>/g;

function decodeHtmlText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cardSignoffText(card: string): string | null {
  const match = SIGNOFF_TEXT_PATTERN.exec(card);
  if (match === null || match[3] === undefined) return null;
  return decodeHtmlText(match[3]);
}

function cardStatusTexts(card: string): string[] {
  return [...card.matchAll(STATUS_ELEMENT_GLOBAL)].map((match) =>
    decodeHtmlText(match[3] ?? ""),
  );
}

function cardWaitingTexts(card: string): string[] {
  return [...card.matchAll(WAITING_ELEMENT_GLOBAL)].map((match) =>
    decodeHtmlText(match[3] ?? ""),
  );
}

/** Every url() inside an @font-face block, in document order. */
function cardFontFaceSources(card: string): string[] {
  const sources: string[] = [];
  for (const block of card.match(/@font-face\s*\{[^}]*\}/gi) ?? []) {
    for (const match of block.matchAll(
      /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi,
    )) {
      const value = (match[1] ?? match[2] ?? match[3] ?? "").trim();
      if (value.length > 0) sources.push(value);
    }
  }
  return sources;
}

/** A declared font file matches by full path or by basename. */
function fontSourceMatches(source: string, declaredFile: string): boolean {
  const cleaned = source.replace(/\\/g, "/").split(/[?#]/)[0]?.trim() ?? "";
  const declared = declaredFile.replace(/\\/g, "/").trim();
  if (cleaned === declared) return true;
  if (cleaned.endsWith(`/${declared}`)) return true;
  const sourceName = cleaned.split("/").pop() ?? cleaned;
  const declaredName = declared.split("/").pop() ?? declared;
  return sourceName === declaredName;
}

function hasFontFaceFor(card: string, file: string): boolean {
  return cardFontFaceSources(card).some((source) => fontSourceMatches(source, file));
}

const STYLE_STATUS_LINE = /^[ \t]*\*\*Status:\*\*[ \t]*([^\r\n]*)/im;
const STYLE_STATUS_LINE_GLOBAL = /^([ \t]*)\*\*Status:\*\*[ \t]*[^\r\n]*/gim;

function normaliseStatusWord(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const word = /^[A-Za-z][A-Za-z-]*/.exec(value.trim());
  return word ? word[0].toLowerCase() : null;
}

function styleStatusFromDocument(markdown: string | null): string | null {
  if (markdown === null) return null;
  const match = STYLE_STATUS_LINE.exec(markdown);
  if (match === null) return null;
  return normaliseStatusWord(match[1]);
}

/** Rewrite the single **Status:** line, preserving its indentation and EOLs. */
export function rewriteStyleStatus(markdown: string, status: string): string | null {
  if (!STYLE_STATUS_LINE.test(markdown)) return null;
  return markdown.replace(
    STYLE_STATUS_LINE_GLOBAL,
    (_match: string, indent: string) => `${indent}**Status:** ${status}`,
  );
}

function hasCardSection(card: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idPattern = new RegExp(
    `(?<![\\w-])(?:id|data-section)\\s*=\\s*["']${escaped}["']`,
    "i",
  );
  const classPattern = new RegExp(
    `class\\s*=\\s*["'](?:[^"']*\\s)?${escaped}(?:\\s[^"']*)?["']`,
    "i",
  );
  return idPattern.test(card) || classPattern.test(card);
}

const CONTENT_KEYS = new Set([
  "title",
  "subtitle",
  "names",
  "date",
  "venue",
  "body",
  "caption",
  "hashtag",
  "rsvp",
  "monogram",
]);

const LITERAL_TEXT_KEYS = new Set([
  "text",
  "value",
  "content",
  "copy",
  "literal",
  "string",
  "label",
  "note",
]);

const DATE_PATTERNS: readonly RegExp[] = [
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b\d{1,2}[/.]\d{1,2}[/.]\d{2,4}\b/,
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b/i,
  /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i,
];

function looksLikeDate(value: string): boolean {
  return DATE_PATTERNS.some((pattern) => pattern.test(value));
}

function scanContentFree(
  value: unknown,
  where: string,
  addFailure: (rule: string, message: string, at: string) => void,
  parentIsCompositionOp = false,
): void {
  if (typeof value === "string") {
    if (looksLikeDate(value)) {
      addFailure("content-free", `literal date found in tokens or recipes: "${value}"`, where);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      scanContentFree(item, `${where}[${index}]`, addFailure, parentIsCompositionOp),
    );
    return;
  }
  const record = asRecord(value);
  if (record === null) return;

  const isCompositionOp =
    parentIsCompositionOp ||
    (typeof record.op === "string" && PRIMITIVE_SET.has(record.op));
  for (const [key, item] of Object.entries(record)) {
    const lower = key.toLowerCase();
    if (
      typeof item === "string" &&
      item.trim().length > 0 &&
      CONTENT_KEYS.has(lower)
    ) {
      addFailure(
        "content-free",
        `literal content field "${key}" found in tokens or recipes`,
        where,
      );
    }
    if (
      isCompositionOp &&
      LITERAL_TEXT_KEYS.has(lower) &&
      item !== undefined &&
      item !== null &&
      String(item).trim().length > 0
    ) {
      addFailure(
        "content-free",
        `composition op carries literal copy in "${key}"; use a slot`,
        where,
      );
    }
    if (
      isCompositionOp &&
      record.op === "shape" &&
      lower === "kind" &&
      typeof item === "string" &&
      item.trim().length > 0 &&
      !SHAPE_NAME_PATTERN.test(item.trim())
    ) {
      addFailure(
        "content-free",
        `shape kind "${item}" is not style vocabulary; literal copy belongs in the brief`,
        where,
      );
    }
    scanContentFree(item, `${where}.${key}`, addFailure, isCompositionOp);
  }
}

const ENGINE_TERM_PATTERN =
  /(Three\.js|THREE\.|WebGLRenderer|CanvasRenderingContext2D|requestAnimationFrame|p5\.brush|p5\.js|\bctx\.)/;

function scanEngineFree(
  value: unknown,
  where: string,
  addFailure: (rule: string, message: string, at: string) => void,
): void {
  if (typeof value === "string") {
    const match = ENGINE_TERM_PATTERN.exec(value);
    if (match) {
      addFailure(
        "engine-free",
        `engine term "${match[1] ?? match[0]}" found in tokens or recipes`,
        where,
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      scanEngineFree(item, `${where}[${index}]`, addFailure),
    );
    return;
  }
  const record = asRecord(value);
  if (record === null) return;
  for (const [key, item] of Object.entries(record)) {
    if (ENGINE_TERM_PATTERN.test(key)) {
      addFailure("engine-free", `engine term "${key}" found in tokens or recipes`, where);
    }
    scanEngineFree(item, `${where}.${key}`, addFailure);
  }
}

function collectAssetIds(capabilitiesRaw: unknown): Set<string> {
  const ids = new Set<string>();
  const library = asArray(readPath(capabilitiesRaw, "assets.starterLibrary"));
  for (const entry of library) {
    const record = asRecord(entry);
    const id = record ? asString(record.id) : null;
    if (id) ids.add(id);
  }
  return ids;
}

/** Any asset or frame field on any composition op is a reference. */
function compositionOpAssetReferences(op: unknown): string[] {
  const record = asRecord(op);
  if (record === null) return [];
  const references: string[] = [];
  for (const key of ["asset", "frame"] as const) {
    const value = asString(record[key]);
    if (value !== null && value.trim().length > 0) references.push(value);
  }
  return references;
}

function allowedTransitions(tokensRaw: unknown): Set<string> {
  const values = new Set<string>();
  for (const value of asArray(readPath(tokensRaw, "motion.transitions"))) {
    if (typeof value === "string") values.add(value);
  }
  return values;
}

/** null means camera is N/A, so move membership is not constrained. */
function allowedCameraMoves(tokensRaw: unknown): Set<string> | null {
  const camera = asRecord(readPath(tokensRaw, "motion.camera"));
  if (camera === null || isNotApplicable(camera)) return null;
  const values = new Set<string>();
  for (const value of asArray(camera.moves)) {
    if (typeof value === "string") values.add(value);
  }
  return values;
}

function allowedEasings(tokensRaw: unknown): Set<string> {
  const values = new Set<string>();
  for (const value of asArray(readPath(tokensRaw, "motion.easings"))) {
    if (typeof value === "string") values.add(value);
  }
  return values;
}

function minimumShot(tokensRaw: unknown): number | null {
  const value = readPath(tokensRaw, "motion.minShot");
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function runtimePrimitives(capabilitiesRaw: unknown): Set<string> {
  const values = new Set<string>();
  for (const value of asArray(readPath(capabilitiesRaw, "runtime.primitives"))) {
    if (typeof value === "string") values.add(value);
  }
  return values;
}

/**
 * Only governance.choices can open or close a taste choice. governance.decisions
 * is the author's written record; it never substitutes for an unanswered choice.
 */
function readTasteChoices(capabilitiesRaw: unknown): TasteChoice[] {
  const governance = asRecord(readPath(capabilitiesRaw, "governance"));
  if (governance === null) return [];
  const choices = asArray(governance.choices);
  const parsed: TasteChoice[] = [];
  choices.forEach((entry, index) => {
    if (typeof entry === "string" && entry.trim().length > 0) {
      parsed.push({ id: `choice-${index + 1}`, question: entry });
      return;
    }
    const record = asRecord(entry);
    if (record === null) return;
    const question =
      asString(record.question) ??
      asString(record.prompt) ??
      asString(record.label);
    if (!question) return;
    const answered =
      record.resolved === true ||
      (record.answer !== undefined && record.answer !== null) ||
      (record.decidedBy !== undefined && record.decidedBy !== null);
    if (answered) return;
    const options = asArray(record.options)
      .map((option) => asString(option))
      .filter((option): option is string => option !== null && option.length > 0);
    parsed.push({
      id: asString(record.id) ?? `choice-${index + 1}`,
      question,
      ...(options.length > 0 ? { options } : {}),
      ...(asString(record.where) ? { where: asString(record.where) ?? undefined } : {}),
    });
  });
  return parsed;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateStylePack(
  packPath: string,
  options: ValidateStylePackOptions = {},
): StyleCheckResult {
  const root = resolve(packPath);
  const counters = makeLayerCounters();
  const hardFailures: StyleFailure[] = [];
  const warnings: StyleWarning[] = [];

  const addFailure = (
    layer: LayerName,
    rule: string,
    message: string,
    where?: string,
    fix?: string,
  ): void => {
    hardFailures.push({ layer, rule, message, ...(where ? { where } : {}), ...(fix ? { fix } : {}) });
    counters[layer].hard += 1;
  };
  const addWarning = (
    layer: LayerName,
    rule: string,
    message: string,
    where?: string,
  ): void => {
    warnings.push({ layer, rule, message, ...(where ? { where } : {}) });
    counters[layer].warnings += 1;
  };

  const readText = (file: string): string | null => {
    const path = join(root, file);
    if (!existsSync(path)) return null;
    try {
      return readFileSync(path, "utf8");
    } catch {
      addFailure("files", "files", `could not read ${file}`, file);
      return null;
    }
  };

  const readJsonFile = (file: string): unknown | undefined => {
    const text = readText(file);
    if (text === null) return undefined;
    try {
      return JSON.parse(text) as unknown;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addFailure("schema", "schema", `${file} is not valid JSON: ${message}`, file);
      return undefined;
    }
  };

  // -- files ---------------------------------------------------------------
  const requiredFiles = [
    "BRIEF.md",
    "STYLE.md",
    "tokens.json",
    "capabilities.json",
    "card.html",
  ];
  for (const file of requiredFiles) {
    if (!existsSync(join(root, file))) {
      addFailure(
        "files",
        "files",
        `missing required file: ${file}`,
        file,
        `create ${file} from the template`,
      );
    }
  }

  const recipesDir = join(root, "recipes");
  const recipeFiles = existsSync(recipesDir)
    ? readdirSync(recipesDir).filter((file) => file.endsWith(".json")).sort()
    : [];
  if (!existsSync(recipesDir)) {
    addFailure("files", "files", "missing required folder: recipes/", "recipes/");
  } else if (recipeFiles.length === 0) {
    addFailure("files", "recipe-count", "recipes/ contains no .json files", "recipes/");
  }

  const excludeSignoff = (files: string[]): string[] =>
    files.filter((file) => relativePosix(root, file) !== "signoff.json");
  let packHash = sha256("");
  if (existsSync(root)) {
    packHash = hashFileSet(root, excludeSignoff(listFiles(root)));
  }

  const brief = readText("BRIEF.md");
  const styleDocument = readText("STYLE.md");
  const card = readText("card.html");
  const tokensRaw = readJsonFile("tokens.json");
  const capabilitiesRaw = readJsonFile("capabilities.json");

  const recipeRaws: Array<{ file: string; raw: unknown }> = [];
  for (const file of recipeFiles) {
    const raw = readJsonFile(`recipes/${file}`);
    if (raw !== undefined) recipeRaws.push({ file, raw });
  }

  // -- schema --------------------------------------------------------------
  const tokensParsed = TokensSchema.safeParse(tokensRaw);
  if (tokensRaw !== undefined && !tokensParsed.success) {
    for (const issue of tokensParsed.error.issues) {
      const where = issue.path.length > 0 ? `tokens.json:${issue.path.join(".")}` : "tokens.json";
      addFailure("schema", "schema", `tokens.json ${where}: ${issue.message}`, where);
    }
  }

  const capabilitiesParsed = CapabilitiesSchema.safeParse(capabilitiesRaw);
  if (capabilitiesRaw !== undefined && !capabilitiesParsed.success) {
    for (const issue of capabilitiesParsed.error.issues) {
      const where =
        issue.path.length > 0
          ? `capabilities.json:${issue.path.join(".")}`
          : "capabilities.json";
      addFailure("schema", "schema", `capabilities.json ${where}: ${issue.message}`, where);
    }
  }

  // -- identity -------------------------------------------------------------
  // A pack with a cast must declare the identity grammar. A pack with no cast
  // has no film identity to declare; it is reported N/A rather than forced to
  // invent one. The template is allowed to omit filmBands, and that omission is
  // the one named gap a new style starts with.
  const maxCast =
    capabilitiesParsed.success && typeof capabilitiesParsed.data.limits.maxCast === "number"
      ? capabilitiesParsed.data.limits.maxCast
      : 0;
  const identity =
    tokensParsed.success ? tokensParsed.data.identity : undefined;
  if (maxCast > 0 || identity !== undefined) {
    if (!identity) {
      addFailure(
        "identity",
        "identity-missing",
        "tokens.json has no identity block, but this pack stages a cast",
        "tokens.json:identity",
        "add the nine identity groups; start from styles/_template/tokens.json",
      );
    } else {
      for (const gap of identityGaps(identity)) {
        addFailure(
          "identity",
          "identity-gap",
          `${gap} is missing; a film cannot be measured against this pack`,
          `tokens.json:${gap.replace("identity.", "identity.")}`,
          "measure this style's reference film and fill the band",
        );
      }
      if (identity.cast.principals.max > maxCast) {
        addFailure(
          "identity",
          "identity-cast",
          `identity.cast.principals.max is ${identity.cast.principals.max}, but capabilities.limits.maxCast is ${maxCast}`,
          "tokens.json:identity.cast.principals",
          "make the cast limit one number and use it in both places",
        );
      }
    }
  }

  const parsedRecipes: StyleRecipe[] = [];
  for (const { file, raw } of recipeRaws) {
    const parsed = RecipeSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const where =
          issue.path.length > 0 ? `recipes/${file}:${issue.path.join(".")}` : `recipes/${file}`;
        addFailure("schema", "schema", `recipes/${file} ${where}: ${issue.message}`, where);
      }
    } else {
      parsedRecipes.push(parsed.data);
    }
  }

  // -- dimensions ----------------------------------------------------------
  const signature = styleDocument ? findSection(styleDocument, "Signature") : null;
  const refusals = styleDocument ? findSection(styleDocument, "Refusals") : null;
  const notFor = styleDocument ? findSection(styleDocument, "Not for") : null;
  const questions = styleDocument ? findSection(styleDocument, "Questions") : null;
  const signaturePresent = signature !== null && signature.trim().length > 0;
  const refusalsCount = bulletCount(refusals);
  const notForCount = bulletCount(notFor);
  const recipesPresent = recipeRaws.length > 0;

  function dimensionValue(dimension: StyleDimension): unknown {
    if (dimension.id === "D16") return signature;
    if (dimension.id === "D17") return refusals;
    if (dimension.id === "D18") return notFor;
    if (dimension.id === "D21") return recipeRaws;
    if (dimension.id === "D27") return brief;
    if (dimension.where.startsWith("tokens.")) {
      return readPath(tokensRaw, dimension.where.slice("tokens.".length));
    }
    if (dimension.where.startsWith("capabilities.")) {
      return readPath(
        capabilitiesRaw,
        dimension.where.slice("capabilities.".length),
      );
    }
    return undefined;
  }

  function dimensionPresence(dimension: StyleDimension): boolean {
    switch (dimension.id) {
      case "D16":
        return signaturePresent;
      case "D17":
        return refusalsCount > 0;
      case "D18":
        return notForCount > 0;
      case "D21":
        return recipesPresent;
      case "D22":
        return (
          isPresent(readPath(capabilitiesRaw, "runtime.primitives")) &&
          isPresent(readPath(tokensRaw, "seed"))
        );
      case "D26":
        return (
          isPresent(readPath(capabilitiesRaw, "identity")) &&
          isPresent(readPath(capabilitiesRaw, "governance"))
        );
      case "D27":
        return brief !== null && brief.trim().length > 0;
      default:
        return isPresent(dimensionValue(dimension));
    }
  }

  let nonApplicableCount = 0;
  for (const dimension of STYLE_DIMENSIONS) {
    const rawValue = dimensionValue(dimension);

    if (isNotApplicable(rawValue)) {
      nonApplicableCount += 1;
      if (!dimension["n/aAllowed"]) {
        addFailure(
          "dimensions",
          "not-applicable",
          `${dimension.id} ${dimension.decision} may not be N/A`,
          dimension.where,
          "fill the decision instead of marking it N/A",
        );
      }
      if (nonApplicableReason(rawValue) === null) {
        addFailure(
          "dimensions",
          "not-applicable-reason",
          `${dimension.id} ${dimension.decision} is N/A without a reason`,
          dimension.where,
          "add { \"notApplicable\": true, \"reason\": \"...\" }",
        );
      }
      continue;
    }

    if (!dimensionPresence(dimension)) {
      addFailure(
        "dimensions",
        "required-dimension",
        `${dimension.id} ${dimension.decision} is missing`,
        dimension.where,
        `declare ${dimension.where} (${dimension.rule})`,
      );
    }
  }

  if (nonApplicableCount > 3) {
    addFailure(
      "dimensions",
      "not-applicable-count",
      `more than three decisions are marked N/A (${nonApplicableCount})`,
      "tokens/capabilities",
      "only D10, D11 and D15 may be N/A",
    );
  }

  // -- story (STYLE.md) ----------------------------------------------------
  if (styleDocument === null) {
    // already reported by the files layer
  } else {
    if (!signaturePresent) {
      addFailure(
        "story",
        "signature",
        "STYLE.md has no Signature section",
        "STYLE.md > Signature",
        "add - **Shot:** ..., - **Transition:** ..., - **Texture:** ...",
      );
    } else {
      const parts = parseSignatureSection(signature);
      const missing = SIGNATURE_LABELS.filter(
        (label) => (parts[label] ?? "").trim().length === 0,
      );
      if (missing.length > 0) {
        addFailure(
          "story",
          "signature",
          `Signature is missing a non-empty ${missing
            .map((label) => `"- **${label[0]?.toUpperCase()}${label.slice(1)}:** ..."`)
            .join(", ")} line`,
          "STYLE.md > Signature",
          "write three bullets: Shot, Transition and Texture",
        );
      } else {
        const transitionValue = parts.transition ?? "";
        const allowed = allowedTransitions(tokensRaw);
        if (signatureTransitionToken(transitionValue, allowed) === null) {
          addFailure(
            "story",
            "signature",
            `Signature transition "${transitionValue}" is not one of tokens.motion.transitions (${[...allowed].join(", ") || "none declared"})`,
            "STYLE.md > Signature",
            "name an allowed transition token such as page_turn or hold",
          );
        }
      }
    }
    if (refusalsCount < 5) {
      addFailure(
        "story",
        "refusals",
        `STYLE.md has ${refusalsCount} refusals; at least 5 are required`,
        "STYLE.md > Refusals",
        "add bulleted refusals",
      );
    }
    if (notForCount < 3) {
      addFailure(
        "story",
        "not-for",
        `STYLE.md has ${notForCount} not-for entries; at least 3 are required`,
        "STYLE.md > Not for",
        "add bulleted not-for entries",
      );
    }
    if (questions === null) {
      addFailure(
        "story",
        "questions-log",
        "STYLE.md has no Questions section (authoring log)",
        "STYLE.md > Questions",
        "add '## Questions' with 'None yet.' if there were none",
      );
    }
  }

  // -- content -------------------------------------------------------------
  if (tokensRaw !== undefined) {
    scanContentFree(tokensRaw, "tokens.json", (rule, message, where) =>
      addFailure("content", rule, message, where),
    );
    scanEngineFree(tokensRaw, "tokens.json", (rule, message, where) =>
      addFailure("content", rule, message, where),
    );
  }
  for (const { file, raw } of recipeRaws) {
    scanContentFree(raw, `recipes/${file}`, (rule, message, where) =>
      addFailure("content", rule, message, where),
    );
    scanEngineFree(raw, `recipes/${file}`, (rule, message, where) =>
      addFailure("content", rule, message, where),
    );
  }

  // -- references and vocabularies ----------------------------------------
  const assetIds = collectAssetIds(capabilitiesRaw);
  const transitionsAllowed = allowedTransitions(tokensRaw);
  const cameraMovesAllowed = allowedCameraMoves(tokensRaw);
  const easingsAllowed = allowedEasings(tokensRaw);
  const minShot = minimumShot(tokensRaw);
  const primitivesAllowed = runtimePrimitives(capabilitiesRaw);

  // tokens: enums that must fail with a named rule even when the schema also fails.
  if (tokensRaw !== undefined) {
    const motion = asRecord(readPath(tokensRaw, "motion"));
    const camera = motion ? asRecord(motion.camera) : null;
    if (camera !== null && !isNotApplicable(camera)) {
      for (const move of asArray(camera.moves)) {
        if (typeof move === "string" && !CAMERA_MOVE_SET.has(move)) {
          addFailure("references", "camera-move", `unknown camera move "${move}"`, "tokens.motion.camera.moves");
        }
      }
      const defaultMove = asString(camera.default);
      if (defaultMove && !CAMERA_MOVE_SET.has(defaultMove)) {
        addFailure("references", "camera-move", `unknown default camera move "${defaultMove}"`, "tokens.motion.camera.default");
      }
    }
    for (const value of asArray(motion?.easings)) {
      if (typeof value === "string" && !EASING_SET.has(value)) {
        addFailure("references", "easing", `unknown easing "${value}"`, "tokens.motion.easings");
      }
    }
    for (const value of asArray(motion?.physics)) {
      if (typeof value === "string" && !PHYSICS_SET.has(value)) {
        addFailure("references", "physics", `unknown physics "${value}"`, "tokens.motion.physics");
      }
    }
    for (const value of asArray(motion?.transitions)) {
      if (typeof value === "string" && !TRANSITION_SET.has(value)) {
        addFailure("references", "transition", `unknown transition "${value}"`, "tokens.motion.transitions");
      }
    }
    for (const family of asArray(readPath(tokensRaw, "type.families"))) {
      const record = asRecord(family);
      const role = record ? asString(record.role) : null;
      if (role && !TYPE_ROLE_SET.has(role)) {
        addFailure("references", "type-role", `unknown type role "${role}"`, "tokens.type.families");
      }
    }

    const seed = asRecord(readPath(tokensRaw, "seed"));
    if (seed === null) {
      addFailure("references", "seed-policy", "tokens.seed is missing", "tokens.seed", "declare seeded, fixed and jitterHz");
    } else {
      if (!Array.isArray(seed.seeded) || seed.seeded.length === 0) {
        addFailure("references", "seed-policy", "tokens.seed.seeded must name at least one seeded surface", "tokens.seed.seeded");
      }
      if (!Array.isArray(seed.fixed) || seed.fixed.length === 0) {
        addFailure("references", "seed-policy", "tokens.seed.fixed must name at least one fixed surface", "tokens.seed.fixed");
      }
      if (typeof seed.jitterHz !== "number" || seed.jitterHz < 0) {
        addFailure("references", "seed-policy", "tokens.seed.jitterHz must be a non-negative number", "tokens.seed.jitterHz");
      }
    }
  }

  // capabilities: runtime, evidence, proof, assets.
  if (capabilitiesRaw !== undefined) {
    const runtime = asRecord(readPath(capabilitiesRaw, "runtime"));
    for (const primitive of asArray(runtime?.primitives)) {
      if (typeof primitive === "string" && !PRIMITIVE_SET.has(primitive)) {
        addFailure("references", "runtime-primitive", `unknown runtime primitive "${primitive}"`, "capabilities.runtime.primitives");
      }
    }

    const sources = asArray(readPath(capabilitiesRaw, "evidence.sources"));
    if (sources.length < 3) {
      addFailure("references", "evidence", `capabilities.evidence.sources has ${sources.length} sources; at least 3 are required`, "capabilities.evidence.sources");
    }
    sources.forEach((source, index) => {
      const record = asRecord(source);
      for (const field of ["take", "notTake", "rights"] as const) {
        if (!record || !isPresent(record[field])) {
          addFailure("references", "evidence", `evidence source ${index + 1} is missing ${field}`, `capabilities.evidence.sources[${index}]`);
        }
      }
    });

    if (asString(readPath(capabilitiesRaw, "proof.status")) !== "declared") {
      addFailure("proof", "proof-status", "capabilities.proof.status must be \"declared\"", "capabilities.proof.status");
    }
    for (const field of ["frames", "aspects", "metrics"] as const) {
      if (asArray(readPath(capabilitiesRaw, `proof.${field}`)).length === 0) {
        addFailure("proof", "proof", `capabilities.proof.${field} must name at least one item`, `capabilities.proof.${field}`);
      }
    }

    const recipeIds = new Set(parsedRecipes.map((recipe) => recipe.id));
    for (const { raw } of recipeRaws) {
      const id = asString(asRecord(raw)?.id);
      if (id) recipeIds.add(id);
    }
    for (const frame of asArray(readPath(capabilitiesRaw, "proof.frames"))) {
      if (typeof frame === "string" && !recipeIds.has(frame)) {
        addFailure(
          "proof",
          "proof-frame",
          `capabilities.proof.frames names "${frame}" which is not a recipe id`,
          "capabilities.proof.frames",
          "name a recipe id, for example keepsake_cover",
        );
      }
    }
    const limitsAspects = new Set(
      asArray(readPath(capabilitiesRaw, "limits.aspects")).filter(
        (aspect): aspect is string => typeof aspect === "string",
      ),
    );
    for (const aspect of asArray(readPath(capabilitiesRaw, "proof.aspects"))) {
      if (typeof aspect === "string" && !limitsAspects.has(aspect)) {
        addFailure(
          "proof",
          "proof-aspect",
          `capabilities.proof.aspects names "${aspect}" which is not in capabilities.limits.aspects`,
          "capabilities.proof.aspects",
          "use an aspect declared by limits.aspects",
        );
      }
    }

    const library = asArray(readPath(capabilitiesRaw, "assets.starterLibrary"));
    const seenAssetIds = new Set<string>();
    library.forEach((entry, index) => {
      const record = asRecord(entry);
      const id = record ? asString(record.id) : null;
      const type = record ? asString(record.type) : null;
      if (!id) {
        addFailure("references", "asset", `starterLibrary[${index}] has no id`, "capabilities.assets.starterLibrary");
      } else {
        if (seenAssetIds.has(id)) {
          addFailure("references", "asset", `duplicate asset id "${id}"`, "capabilities.assets.starterLibrary");
        }
        seenAssetIds.add(id);
      }
      if (type && !ASSET_TYPE_SET.has(type)) {
        addFailure("references", "asset-type", `unknown asset type "${type}"`, "capabilities.assets.starterLibrary");
      }
      if (!record || asArray(record.anchors).length === 0) {
        addFailure("references", "asset", `asset "${id ?? index}" needs at least one anchor`, "capabilities.assets.starterLibrary");
      }
    });

    const usedAssets = new Set<string>();

    recipeRaws.forEach(({ file, raw }) => {
      const recipe = asRecord(raw);
      const where = `recipes/${file}`;
      if (recipe === null) return;

      const id = asString(recipe.id) ?? file;
      const beatRoles = asArray(recipe.beatRoles);
      if (beatRoles.length === 0) {
        addFailure("references", "beat-role", `recipe "${id}" has no beatRoles`, where);
      }
      for (const role of beatRoles) {
        if (typeof role !== "string" || !BEAT_ROLE_SET.has(role)) {
          addFailure("references", "beat-role", `recipe "${id}" uses unknown beat role "${String(role)}"`, where);
        }
      }

      const slots = asArray(recipe.slots);
      // An optional slot is still a slot the recipe may draw: `plan.ts` and
      // `treatment.ts` both honour `optionalSlots`, so the validator refused a
      // recipe the resolver happily resolves. One rule, one reading.
      const optionalSlots = asArray(recipe.optionalSlots);
      const listedSlots = new Set(
        [...slots, ...optionalSlots].filter((slot): slot is string => typeof slot === "string"),
      );
      for (const slot of [...slots, ...optionalSlots]) {
        if (typeof slot !== "string" || !SLOT_SET.has(slot)) {
          addFailure("references", "slot-vocabulary", `recipe "${id}" uses unknown slot "${String(slot)}"`, where);
        }
      }
      if (optionalSlots.some((slot) => slots.includes(slot))) {
        addFailure(
          "references",
          "slot-contract",
          `recipe "${id}" lists a slot in both slots and optionalSlots`,
          where,
          "declare a slot once: required or optional",
        );
      }

      for (const asset of asArray(recipe.assets)) {
        if (typeof asset !== "string") {
          addFailure("references", "asset-reference", `recipe "${id}" has a non-string asset reference`, where);
          continue;
        }
        usedAssets.add(asset);
        if (!assetIds.has(asset)) {
          addFailure("references", "asset-reference", `recipe "${id}" references unknown asset "${asset}"`, where, "add it to capabilities.assets.starterLibrary");
        }
      }

      const composition = asArray(recipe.composition);
      if (composition.length === 0) {
        addFailure("references", "op", `recipe "${id}" has an empty composition`, where);
      }
      composition.forEach((opValue, index) => {
        const op = asRecord(opValue);
        const name = op ? asString(op.op) : null;
        if (!name || !PRIMITIVE_SET.has(name)) {
          addFailure("references", "op", `recipe "${id}" composition[${index}] has unknown op "${String(name)}"`, where);
          return;
        }
        if (primitivesAllowed.size > 0 && !primitivesAllowed.has(name)) {
          addFailure("references", "capability-recipe", `recipe "${id}" uses op "${name}" but capabilities.runtime.primitives does not list it`, where, "add the primitive to capabilities.runtime.primitives");
        }

        for (const key of ["asset", "frame"] as const) {
          const rawValue = op?.[key];
          if (rawValue === undefined) continue;
          const asset = asString(rawValue);
          if (asset === null || asset.trim().length === 0) {
            addFailure(
              "references",
              "asset-reference",
              `recipe "${id}" ${name} op has an empty or non-string "${key}"`,
              where,
              "name an asset id from capabilities.assets.starterLibrary",
            );
            continue;
          }
          usedAssets.add(asset);
          if (!assetIds.has(asset)) {
            addFailure("references", "asset-reference", `recipe "${id}" ${name} op references unknown asset "${asset}"`, where, "add it to capabilities.assets.starterLibrary");
          }
        }

        if (name === "text") {
          const slot = asString(op?.slot);
          if (!slot || !SLOT_SET.has(slot)) {
            addFailure("references", "slot-vocabulary", `recipe "${id}" text op has unknown slot "${String(slot)}"`, where);
          } else if (!listedSlots.has(slot)) {
            addFailure(
              "references",
              "slot-contract",
              `recipe "${id}" text op uses slot "${slot}" which is not listed in recipe.slots`,
              where,
              "add the slot to recipe.slots",
            );
          }
          const role = asString(op?.typeRole);
          if (role && !TYPE_ROLE_SET.has(role)) {
            addFailure("references", "type-role", `recipe "${id}" text op uses unknown type role "${role}"`, where);
          }
        }

        if (name === "image") {
          const slot = asString(op?.slot);
          if (slot && !SLOT_SET.has(slot)) {
            addFailure("references", "slot-vocabulary", `recipe "${id}" image op has unknown slot "${slot}"`, where);
          } else if (slot && !listedSlots.has(slot)) {
            addFailure(
              "references",
              "slot-contract",
              `recipe "${id}" image op uses slot "${slot}" which is not listed in recipe.slots`,
              where,
              "add the slot to recipe.slots",
            );
          }
        }

        if (name === "camera") {
          const move = asString(op?.move);
          if (move && !CAMERA_MOVE_SET.has(move)) {
            addFailure("references", "camera-move", `recipe "${id}" uses unknown camera move "${move}"`, where);
          } else if (move && cameraMovesAllowed !== null && !cameraMovesAllowed.has(move)) {
            addFailure(
              "references",
              "camera-move",
              `recipe "${id}" camera op uses move "${move}" which tokens.motion.camera.moves does not allow`,
              where,
              "add the move to tokens.motion.camera.moves or change the recipe",
            );
          }
          const ease = asString(op?.ease);
          if (ease && !EASING_SET.has(ease)) {
            addFailure("references", "easing", `recipe "${id}" uses unknown easing "${ease}"`, where);
          } else if (ease && !easingsAllowed.has(ease)) {
            addFailure(
              "references",
              "easing",
              `recipe "${id}" camera op uses easing "${ease}" which tokens.motion.easings does not allow`,
              where,
              "add the easing to tokens.motion.easings or change the recipe",
            );
          }
        }

        if (name === "effect") {
          const kind = asString(op?.kind);
          if (kind && !EFFECT_SET.has(kind)) {
            addFailure("references", "effect", `recipe "${id}" uses unknown effect "${kind}"`, where);
          }
        }

        if (name === "transition") {
          const kind = asString(op?.kind);
          if (kind && !TRANSITION_SET.has(kind)) {
            addFailure("references", "transition", `recipe "${id}" uses unknown transition "${kind}"`, where);
          }
          if (kind && !transitionsAllowed.has(kind)) {
            addFailure("references", "transition-allowed", `recipe "${id}" uses transition "${kind}" which tokens.motion.transitions does not allow`, where);
          }
        }
      });

      const transitionOut = asString(recipe.transitionOut);
      if (!transitionOut) {
        addFailure("references", "transition", `recipe "${id}" has no transitionOut`, where);
      } else {
        if (!TRANSITION_SET.has(transitionOut)) {
          addFailure("references", "transition", `recipe "${id}" has unknown transitionOut "${transitionOut}"`, where);
        }
        if (!transitionsAllowed.has(transitionOut)) {
          addFailure("references", "transition-allowed", `recipe "${id}" transitionOut "${transitionOut}" is not allowed by tokens.motion.transitions`, where);
        }
      }

      const camera = asRecord(recipe.camera);
      const cameraMove = camera ? asString(camera.move) : null;
      if (cameraMove && !CAMERA_MOVE_SET.has(cameraMove)) {
        addFailure("references", "camera-move", `recipe "${id}" uses unknown camera move "${cameraMove}"`, where);
      } else if (cameraMove && cameraMovesAllowed !== null && !cameraMovesAllowed.has(cameraMove)) {
        addFailure(
          "references",
          "camera-move",
          `recipe "${id}" uses camera move "${cameraMove}" which tokens.motion.camera.moves does not allow`,
          where,
          "add the move to tokens.motion.camera.moves or change the recipe",
        );
      }
      const cameraEase = camera ? asString(camera.ease) : null;
      if (cameraEase && !EASING_SET.has(cameraEase)) {
        addFailure("references", "easing", `recipe "${id}" uses unknown easing "${cameraEase}"`, where);
      } else if (cameraEase && !easingsAllowed.has(cameraEase)) {
        addFailure(
          "references",
          "easing",
          `recipe "${id}" uses easing "${cameraEase}" which tokens.motion.easings does not allow`,
          where,
          "add the easing to tokens.motion.easings or change the recipe",
        );
      }

      const duration = asRecord(recipe.duration);
      const durationMin = duration ? duration.min : undefined;
      if (
        typeof durationMin === "number" &&
        minShot !== null &&
        durationMin < minShot
      ) {
        addFailure(
          "references",
          "duration-min",
          `recipe "${id}" duration.min ${durationMin}s is below tokens.motion.minShot ${minShot}s`,
          where,
          "raise the recipe minimum or lower tokens.motion.minShot",
        );
      }
    });

    for (const assetId of assetIds) {
      if (!usedAssets.has(assetId)) {
        addWarning("references", "unused-asset", `asset "${assetId}" is declared but never used`, "capabilities.assets.starterLibrary");
      }
    }
  }

  // duplicate recipe ids
  const seenRecipeIds = new Set<string>();
  for (const recipe of parsedRecipes) {
    if (seenRecipeIds.has(recipe.id)) {
      addFailure("references", "recipe-id", `duplicate recipe id "${recipe.id}"`, "recipes/");
    }
    seenRecipeIds.add(recipe.id);
  }

  // -- bindings ------------------------------------------------------------
  const actualBriefHash = brief !== null ? hashFile(join(root, "BRIEF.md")) : null;
  const declaredBriefHash = asString(readPath(capabilitiesRaw, "identity.bindings.briefHash"));
  const declaredTemplateHash = asString(readPath(capabilitiesRaw, "identity.bindings.templateHash"));
  const declaredContractHash = asString(readPath(capabilitiesRaw, "identity.bindings.contractHash"));

  if (actualBriefHash === null) {
    // files layer already reported the missing brief
  } else if (options.expectedBriefHash && actualBriefHash !== options.expectedBriefHash) {
    addFailure(
      "bindings",
      "brief-hash",
      "BRIEF.md does not match the frozen brief in SEAL.json",
      "BRIEF.md",
      "copy the sealed brief.md into the pack as BRIEF.md",
    );
  } else if (declaredBriefHash === null) {
    addFailure("bindings", "brief-hash", "capabilities.identity.bindings.briefHash is missing", "capabilities.identity.bindings");
  } else if (declaredBriefHash !== actualBriefHash) {
    addFailure(
      "bindings",
      "brief-hash",
      `BRIEF.md hash does not match bindings.briefHash (expected ${actualBriefHash})`,
      "capabilities.identity.bindings.briefHash",
      "re-run style:new, or update the binding after freezing the brief",
    );
  }

  const templatePath =
    options.templatePath ??
    findDefaultTemplatePath(declaredTemplateHash ?? undefined);
  const expectedTemplateHash =
    options.expectedTemplateHash ??
    (templatePath !== null ? computeTemplateHash(templatePath) : null);

  if (expectedTemplateHash === null) {
    addWarning(
      "bindings",
      "template-hash-unchecked",
      "template folder not found; templateHash could not be recomputed",
      "capabilities.identity.bindings.templateHash",
    );
  } else if (declaredTemplateHash === null) {
    addFailure("bindings", "template-hash", "capabilities.identity.bindings.templateHash is missing", "capabilities.identity.bindings");
  } else if (declaredTemplateHash !== expectedTemplateHash) {
    addFailure(
      "bindings",
      "template-hash",
      "templateHash does not match the template used to scaffold this pack",
      "capabilities.identity.bindings.templateHash",
      "re-scaffold from the current template or restore the template",
    );
  }

  const expectedContractHash = options.expectedContractHash ?? computeContractHash();
  if (declaredContractHash === null) {
    addFailure("bindings", "contract-hash", "capabilities.identity.bindings.contractHash is missing", "capabilities.identity.bindings");
  } else if (declaredContractHash !== expectedContractHash) {
    addFailure(
      "bindings",
      "contract-hash",
      "contractHash does not match the current closed contract",
      "capabilities.identity.bindings.contractHash",
      "update the pack against the current contract",
    );
  }

  // -- card ----------------------------------------------------------------
  const cardPath = toDisplayPath(join(root, "card.html"));
  if (card === null) {
    addFailure("card", "card-section", "card.html is missing", "card.html");
  } else {
    const missingSections = CARD_SECTIONS.filter((section) => !hasCardSection(card, section));
    if (missingSections.length > 0) {
      addFailure(
        "card",
        "card-section",
        `card is missing section(s): ${missingSections.join(", ")}`,
        "card.html",
        "add an element with id or data-section for each required section",
      );
    }

    const identityName = asString(readPath(capabilitiesRaw, "identity.name"));
    const identityVersion = asString(readPath(capabilitiesRaw, "identity.version"));
    if (identityName && !htmlIncludes(card, identityName)) {
      addFailure("card", "card-identity", `card does not show the style name "${identityName}"`, "card.html > hero");
    }
    if (identityVersion && !htmlIncludes(card, identityVersion)) {
      addFailure("card", "card-identity", `card does not show the style version "${identityVersion}"`, "card.html > hero");
    }

    const defaultPaletteName = asString(readPath(tokensRaw, "color.default"));
    const palettes = asRecord(readPath(tokensRaw, "color.palettes"));
    const defaultPalette =
      defaultPaletteName && palettes ? asRecord(palettes[defaultPaletteName]) : null;
    if (defaultPalette) {
      const lowerCard = card.toLowerCase();
      for (const [role, hex] of Object.entries(defaultPalette)) {
        if (typeof hex !== "string") continue;
        if (!lowerCard.includes(hex.toLowerCase())) {
          addFailure("card", "card-palette", `card does not show the ${role} hex ${hex}`, "card.html > palette");
        }
      }
    }

    if (!SIGNOFF_ELEMENT_PATTERN.test(card)) {
      addFailure(
        "card",
        "card-signoff",
        "card is missing an element with data-signoff",
        "card.html > signoff",
        "add <span data-signoff>UNSIGNED</span>",
      );
    }

    if (cardStatusTexts(card).length === 0) {
      addFailure(
        "card",
        "card-status-marker",
        "card is missing an element with data-status",
        "card.html",
        "add <span data-status>REVIEWABLE</span>",
      );
    }

    if (cardWaitingTexts(card).length === 0) {
      addFailure(
        "card",
        "card-waiting-marker",
        "card is missing an element with data-waiting",
        "card.html",
        "add <span data-waiting>Waiting for review.</span>",
      );
    }

    const allFontSources = cardFontFaceSources(card);
    if (allFontSources.some((source) => /^https?:/i.test(source))) {
      addFailure(
        "card",
        "card-font",
        "card.html loads a font from an external URL",
        "card.html > type",
        "use a pack-local font file; there is no network in a render",
      );
    }
    if (/@import\s+(?:url\s*\(\s*)?["']?https?:/i.test(card)) {
      addFailure(
        "card",
        "card-dependency",
        "card.html imports an external stylesheet",
        "card.html",
        "use pack-local files only",
      );
    }

    for (const family of asArray(readPath(tokensRaw, "type.families"))) {
      const record = asRecord(family);
      const file = record ? asString(record.file)?.trim() : null;
      if (!file) continue;
      if (!hasFontFaceFor(card, file)) {
        addFailure(
          "card",
          "card-font",
          `card.html has no @font-face rule for declared type file "${file}"`,
          "card.html > type",
          `add @font-face { src: url("${file}"); } so the specimen uses the declared face`,
        );
      }
      const sources = cardFontFaceSources(card).filter((source) =>
        fontSourceMatches(source, file),
      );
      const resolves = sources.some((source) => {
        if (/^data:/i.test(source)) return true;
        if (/^https?:/i.test(source)) return false;
        const cleaned = source.replace(/\\/g, "/").split(/[?#]/)[0]?.trim() ?? "";
        return existsSync(resolve(root, cleaned));
      });
      if (sources.length > 0 && !resolves) {
        addFailure(
          "card",
          "card-font",
          `card.html @font-face for "${file}" does not resolve to a file`,
          "card.html > type",
          "point the url() at an existing file relative to card.html",
        );
      }
    }

    if (!/\bANTI\b/.test(card) || !/\bREFERENCE\b/.test(card) || !/\bSPECIMEN\b/.test(card)) {
      addWarning(
        "card",
        "card-legend",
        "card legend does not name REFERENCE, SPECIMEN and ANTI",
        "card.html > legend",
      );
    }

    if (
      /<script[^>]+src\s*=\s*["']https?:/i.test(card) ||
      /<link[^>]+href\s*=\s*["']https?:/i.test(card)
    ) {
      addFailure(
        "card",
        "card-dependency",
        "card.html loads an external script or stylesheet",
        "card.html",
        "use pack-local files only",
      );
    }
  }

  // -- proof (already checked above) and signoff --------------------------
  let signoff: StyleSignoff | undefined;
  let staleSignoff: StyleSignoff | undefined;
  const signoffRaw = readJsonFile("signoff.json");
  if (signoffRaw !== undefined) {
    const parsed = SignoffSchema.safeParse(signoffRaw);
    if (!parsed.success) {
      addWarning("signoff", "signoff-schema", "signoff.json is not valid; treat the pack as unsigned", "signoff.json");
    } else {
      signoff = parsed.data;
      const staleReasons: string[] = [];
      if (signoff.packHash !== packHash) staleReasons.push("pack hash changed");
      if (actualBriefHash !== null && signoff.briefHash !== actualBriefHash) staleReasons.push("brief hash changed");
      if (declaredTemplateHash !== null && signoff.templateHash !== declaredTemplateHash) staleReasons.push("template hash changed");
      if (declaredContractHash !== null && signoff.contractHash !== declaredContractHash) staleReasons.push("contract hash changed");
      if (
        signoff.version !== asString(readPath(capabilitiesRaw, "identity.version"))
      ) {
        staleReasons.push("version changed");
      }

      if (staleReasons.length > 0) {
        addWarning(
          "signoff",
          "signoff-stale",
          `signoff is stale: ${staleReasons.join(", ")}`,
          "pack",
        );
        staleSignoff = signoff;
        signoff = undefined;
      }
    }
  }

  // Status is one fact written in three places: the card, STYLE.md and
  // capabilities.identity.status. A valid sign-off makes all three say
  // approved; a declared approval without a sign-off is a hard failure, not a
  // reviewable pack. A stale sign-off is the one exception: it proves the pack
  // was approved and then changed, so the changed-after-approval state stands.
  const styleStatus = styleStatusFromDocument(styleDocument);
  const identityStatus = normaliseStatusWord(
    asString(readPath(capabilitiesRaw, "identity.status")),
  );
  const cardStatuses = card !== null ? cardStatusTexts(card) : [];
  const cardSaysApproved = cardStatuses.some(
    (status) => status.toUpperCase() === "APPROVED",
  );
  const declaredApproved =
    styleStatus === "approved" || identityStatus === "approved";

  const addStatusFailure = (message: string, where: string, fix: string): void => {
    addFailure("signoff", "status-consistency", message, where, fix);
  };

  // Only an approved/unapproved split is a contradiction. A reviewable pack
  // may still call itself draft somewhere while the author is working.
  const approvedVsUnapproved =
    (styleStatus === "approved" &&
      (identityStatus === "reviewable" || identityStatus === "draft")) ||
    (identityStatus === "approved" &&
      (styleStatus === "reviewable" || styleStatus === "draft"));
  if (approvedVsUnapproved) {
    addStatusFailure(
      `STYLE.md status reads "${styleStatus}" but capabilities.identity.status reads "${identityStatus}"`,
      "STYLE.md > Status / capabilities.identity.status",
      "make both say the same word; style:approve writes approved to both",
    );
  }

  if (signoff !== undefined) {
    if (styleStatus !== "approved") {
      addStatusFailure(
        `pack is APPROVED but STYLE.md status reads "${styleStatus ?? "(missing)"}"; it must read "approved"`,
        "STYLE.md > Status",
        "re-run style:approve so the status line is rewritten with the signature",
      );
    }
    if (identityStatus !== "approved") {
      addStatusFailure(
        `pack is APPROVED but capabilities.identity.status reads "${identityStatus ?? "(missing)"}"; it must read "approved"`,
        "capabilities.identity.status",
        "re-run style:approve so identity.status is rewritten with the signature",
      );
    }
  } else if (staleSignoff === undefined) {
    if (declaredApproved) {
      addStatusFailure(
        "STYLE.md or capabilities.identity.status declares approval, but signoff.json is missing or invalid",
        "STYLE.md > Status / capabilities.identity.status",
        "remove the approval claim or run style:approve",
      );
    }
  }

  if (cardSaysApproved && !declaredApproved) {
    addStatusFailure(
      `card data-status says APPROVED but STYLE.md/identity.status read "${styleStatus ?? "(missing)"}"/"${identityStatus ?? "(missing)"}"`,
      "card.html",
      "re-run style:approve so the card, STYLE.md and identity.status agree",
    );
  }
  if (declaredApproved && !cardSaysApproved) {
    addStatusFailure(
      "STYLE.md/identity.status declares approval but no card data-status marker says APPROVED",
      "card.html",
      "re-run style:approve so every data-status marker is rewritten",
    );
  }

  // The signed card must agree with the generated sign-off, and once approved
  // no data-status marker may still advertise an earlier status.
  if (signoff !== undefined && card !== null) {
    const expectedSignoff = `${signoff.by} · ${signoff.date}`;
    const actualSignoff = cardSignoffText(card);
    if (actualSignoff !== expectedSignoff) {
      addFailure(
        "card",
        "card-signoff-text",
        `card data-signoff reads "${actualSignoff ?? "(missing)"}" but signoff.json says "${expectedSignoff}"`,
        "card.html > signoff",
        "re-run style:approve so the card and signoff.json are written together",
      );
    }
    for (const statusText of cardStatusTexts(card)) {
      if (statusText !== "APPROVED") {
        addFailure(
          "card",
          "card-status",
          `card data-status reads "${statusText}" but the pack is APPROVED`,
          "card.html",
          "re-run style:approve to rewrite every data-status marker",
        );
      }
    }
    const expectedWaiting = `Approved ${signoff.date}`;
    for (const waitingText of cardWaitingTexts(card)) {
      if (waitingText !== expectedWaiting) {
        addFailure(
          "card",
          "card-waiting",
          `card data-waiting reads "${waitingText}" but the pack is APPROVED`,
          "card.html",
          `re-run style:approve to write "${expectedWaiting}"`,
        );
      }
    }
  }

  // -- placeholders --------------------------------------------------------
  const placeholderText = [tokensRaw, capabilitiesRaw, recipeRaws.map((entry) => entry.raw), card]
    .map((value) => JSON.stringify(value) ?? "")
    .join("\n");
  const placeholderCount = (placeholderText.match(/\bTODO\b|\{\{/g) ?? []).length;
  if (placeholderCount > 0) {
    addWarning(
      "schema",
      "placeholder",
      `pack still contains ${placeholderCount} placeholder marker(s)`,
      "pack",
    );
  }

  // -- status --------------------------------------------------------------
  const isTemplatePack = basename(root) === "_template";
  let status: StyleStatus;
  let statusLine: string;
  if (hardFailures.length > 0) {
    status = "DRAFT";
    statusLine = `DRAFT — ${hardFailures.length} hard failure${hardFailures.length === 1 ? "" : "s"}; not ready for review`;
  } else if (placeholderCount > 0) {
    status = "DRAFT";
    statusLine = `DRAFT — ${placeholderCount} placeholder marker${placeholderCount === 1 ? "" : "s"} still in the pack`;
  } else if (isTemplatePack) {
    // The template is scaffolding, never a style, even when every field is
    // filled in. Spec acceptance requires it to report DRAFT.
    status = "DRAFT";
    statusLine = "DRAFT — template scaffolding, not a style";
  } else if (signoff !== undefined) {
    status = "APPROVED";
    statusLine = `APPROVED — signed by ${signoff.by} on ${signoff.date}`;
  } else if (warnings.some((warning) => warning.rule === "signoff-stale")) {
    status = "REVIEWABLE";
    statusLine = "REVIEWABLE — changed after approval";
  } else {
    status = "REVIEWABLE";
    statusLine = "REVIEWABLE — machine-clean, waiting for your eyes";
  }

  const profile: StyleProfileLayer[] = LAYERS.map((layer) => ({
    layer,
    passed: counters[layer].hard === 0,
    hardFailures: counters[layer].hard,
    warnings: counters[layer].warnings,
  }));

  return {
    status,
    statusLine,
    styleId: asString(readPath(capabilitiesRaw, "identity.id")) ?? basename(root),
    name: asString(readPath(capabilitiesRaw, "identity.name")) ?? basename(root),
    version: asString(readPath(capabilitiesRaw, "identity.version")) ?? "0.0.0",
    packPath: toDisplayPath(root),
    cardPath,
    packHash,
    briefHash: declaredBriefHash ?? actualBriefHash ?? sha256(""),
    hardFailures,
    warnings,
    chosen: readTasteChoices(capabilitiesRaw),
    profile,
    ...(signoff ? { signoff } : {}),
  };
}

// ---------------------------------------------------------------------------
// Human report
// ---------------------------------------------------------------------------

export function formatStyleReport(result: StyleCheckResult): string {
  const lines: string[] = [];
  lines.push(`STYLE: ${result.styleId} ${result.version}`);
  lines.push(`STATUS: ${result.statusLine}`);
  lines.push("");

  lines.push(
    `BEFORE YOU APPROVE (mechanical, ${result.hardFailures.length})`,
  );
  if (result.hardFailures.length === 0) {
    lines.push("Nothing mechanical.");
  } else {
    result.hardFailures.forEach((failure, index) => {
      lines.push(`${index + 1}. ${failure.message}`);
      lines.push(`   Where: ${failure.where ?? "pack"}`);
      lines.push(`   Fix: ${failure.fix ?? `ask your LLM to fix the "${failure.rule}" rule`}`);
    });
  }
  lines.push("");

  lines.push(`YOU MUST CHOOSE (taste, ${result.chosen.length})`);
  if (result.chosen.length === 0) {
    lines.push("None — no open taste choices.");
  } else {
    result.chosen.forEach((choice, index) => {
      lines.push(`${index + 1}. ${choice.question}`);
      if (choice.options && choice.options.length > 0) {
        lines.push(`   Options: ${choice.options.join(" / ")}`);
      }
      if (choice.where) lines.push(`   Where: ${choice.where}`);
    });
  }
  lines.push("");

  lines.push(`WORTH KNOWING (${result.warnings.length})`);
  if (result.warnings.length === 0) {
    lines.push("Nothing.");
  } else {
    for (const warning of result.warnings) {
      lines.push(
        `- ${warning.message}${warning.where ? ` (${warning.where})` : ""}`,
      );
    }
  }
  lines.push("");

  lines.push("WHAT I COULD NOT CHECK");
  lines.push("Taste, phone legibility, motion feel.");
  lines.push("");

  lines.push(`OPEN THE CARD: ${result.cardPath}`);
  lines.push("");
  if (result.status === "APPROVED") {
    lines.push(
      `SIGNED: ${result.signoff?.by ?? "unknown"} · ${result.signoff?.date ?? "unknown"}`,
    );
    lines.push(
      "This pack is signed. Any later byte change returns REVIEWABLE — changed after approval.",
    );
  } else {
    lines.push("If you approve, run this yourself:");
    lines.push(
      `npm run style:approve -- ${result.styleId} --by "Your Name"`,
    );
    if (result.status === "DRAFT") {
      lines.push("");
      lines.push(
        "The approve command will refuse until the hard failures above are fixed.",
      );
    }
  }
  if (result.status !== "APPROVED") {
    lines.push("");
    lines.push("NEXT: paste everything above into your LLM and say");
    lines.push('"ask me the choices, then fix the rest and re-check."');
  }

  return lines.join("\n");
}

/**
 * The template is intentionally incomplete. Spec acceptance asks for
 * "`_template` is DRAFT, exits 0", so the template path alone is exempt from
 * the hard-failure exit code. Every other pack exits 1 on hard failures.
 */
export function styleExitCode(result: StyleCheckResult, packPath: string): number {
  if (result.hardFailures.length === 0) return 0;
  if (basename(resolve(packPath)) === "_template") return 0;
  return 1;
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

export class StyleResolveError extends Error {
  constructor(
    public readonly rule: string,
    message: string,
  ) {
    super(`[${rule}] ${message}`);
    this.name = "StyleResolveError";
  }
}

export type ResolvedShot = {
  id: string;
  beat: string;
  beatRoles: BeatRole[];
  recipe: string;
  start: number;
  duration: number;
  slots: Record<string, string>;
  composition: CompositionOp[];
  transitionOut: string;
};

export type SeedVariations = {
  seed: number;
  grainOffset: number;
  shadowOffset: number;
  cameraPhase: number;
  timingJitter: number;
};

export type ResolvePlan = {
  style: string;
  version: string;
  format: string;
  formatName: string;
  briefHash: string;
  seed: number;
  duration: number;
  aspect: string;
  shots: ResolvedShot[];
  variations: SeedVariations;
};

export const RESOLVE_ASSERTIONS: readonly string[] = [
  "Every slot in every selected recipe resolves non-empty",
  "Every format beat maps to at least one recipe through beatRoleMap",
  "Every asset resolves in capabilities.assets",
  "Two briefs produce different plans; at least one slot value differs",
  "The same seed twice produces byte-identical JSON",
  "A different seed changes seed and the variations block",
  "Every selected recipe's transitionOut is allowed by the style",
  "The plan's duration and aspect fit the format and the style limits",
  "Every resolved content.* text slot is within the style's word limit",
];

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function variationsForSeed(seed: number): SeedVariations {
  const random = mulberry32(seed);
  return {
    seed,
    grainOffset: round(random() * 1000),
    shadowOffset: round(random() * 1000),
    cameraPhase: round(random() * 360),
    timingJitter: round(random() * 40 - 20),
  };
}

function cleanSlotValue(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Words are whitespace-separated tokens; a caption is judged as written. */
export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
}

function resolveSlot(brief: GenericBrief, slot: Slot): string | null {
  switch (slot) {
    case "content.title":
      return cleanSlotValue(brief.content.title);
    case "content.subtitle":
      return cleanSlotValue(brief.content.subtitle);
    case "content.names":
      return cleanSlotValue(brief.content.names);
    case "content.date":
      return cleanSlotValue(brief.content.date);
    case "content.venue":
      return cleanSlotValue(brief.content.venue);
    case "content.body":
      return cleanSlotValue(brief.content.body);
    case "content.caption":
      return cleanSlotValue(brief.content.caption);
    case "content.hashtag":
      return cleanSlotValue(brief.content.hashtag);
    case "content.rsvp":
      return cleanSlotValue(brief.content.rsvp);
    case "content.monogram":
      return cleanSlotValue(brief.content.monogram);
    case "photos.hero":
      return cleanSlotValue(brief.photos.hero);
    case "photos.supporting": {
      const supporting = (brief.photos.supporting ?? [])
        .map((photo) => photo.trim())
        .filter((photo) => photo.length > 0);
      return supporting[0] ?? null;
    }
    default:
      return null;
  }
}

function collectPlanSlotValues(plan: ResolvePlan): Set<string> {
  const values = new Set<string>();
  for (const shot of plan.shots) {
    for (const value of Object.values(shot.slots)) {
      values.add(value);
    }
  }
  return values;
}

export function assertSamePlan(first: ResolvePlan, second: ResolvePlan): void {
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    throw new StyleResolveError(
      "assertion-5",
      "the same seed produced two different plans",
    );
  }
}

export function assertSeedChanges(first: ResolvePlan, second: ResolvePlan): void {
  if (first.seed === second.seed) {
    throw new StyleResolveError(
      "assertion-6",
      "a different seed did not change the plan seed",
    );
  }
  if (JSON.stringify(first.variations) === JSON.stringify(second.variations)) {
    throw new StyleResolveError(
      "assertion-6",
      "a different seed did not change the variations block",
    );
  }
}

export function assertBriefsDiffer(first: ResolvePlan, second: ResolvePlan): void {
  if (first.briefHash === second.briefHash) {
    throw new StyleResolveError(
      "assertion-4",
      "the two briefs are identical; reuse cannot be proven",
    );
  }
  const firstValues = collectPlanSlotValues(first);
  const secondValues = collectPlanSlotValues(second);
  const sameSize = firstValues.size === secondValues.size;
  const sameValues =
    sameSize && [...firstValues].every((value) => secondValues.has(value));
  if (sameValues) {
    throw new StyleResolveError(
      "assertion-4",
      "the two briefs produced no different slot values",
    );
  }
}

function normalizeRoles(value: BeatRole | BeatRole[]): BeatRole[] {
  return Array.isArray(value) ? value : [value];
}

function buildResolvePlan(
  pack: LoadedStylePack,
  brief: GenericBrief,
  format: ResolveFormat,
  seed: number,
): ResolvePlan {
  const assetIds = new Set(
    pack.capabilities.assets.starterLibrary.map((asset) => asset.id),
  );
  const transitionsAllowed = new Set<string>(pack.tokens.motion.transitions);
  // A format may name the recipes it uses, so a recipe added to the pack later
  // cannot silently re-cut a plan that was already accepted.
  if (format.recipes) {
    const known = new Set(pack.recipes.map((recipe) => recipe.id));
    for (const id of format.recipes) {
      if (!known.has(id)) {
        throw new StyleResolveError(
          "assertion-2",
          `format "${format.id}" names recipe "${id}" which the pack does not have`,
        );
      }
    }
  }
  const pool = format.recipes ? new Set(format.recipes) : null;
  const recipes = pack.recipes
    .filter((recipe) => pool === null || pool.has(recipe.id))
    .sort((a, b) => a.id.localeCompare(b.id, "en"));
  const beatEntries = Object.entries(format.beatRoleMap);

  if (beatEntries.length === 0) {
    throw new StyleResolveError(
      "assertion-2",
      `format "${format.id}" has an empty beatRoleMap`,
    );
  }

  for (const [beat, rolesValue] of beatEntries) {
    const roles = normalizeRoles(rolesValue);
    const covered = recipes.some((recipe) =>
      recipe.beatRoles.some((role) => roles.includes(role)),
    );
    if (!covered) {
      throw new StyleResolveError(
        "assertion-2",
        `format beat "${beat}" maps to roles ${roles.join(", ")} but no recipe uses them`,
      );
    }
  }

  type SequenceUnit = { beat: string; roles: BeatRole[]; count: number };
  const units: SequenceUnit[] = format.sequence
    ? format.sequence.map((entry) => ({
        beat: entry.beat,
        roles: [entry.role],
        count: entry.count,
      }))
    : beatEntries.map(([beat, rolesValue]) => ({
        beat,
        roles: normalizeRoles(rolesValue),
        count: 1,
      }));

  const limits = pack.capabilities.limits;
  const contentWordLimit = Math.min(limits.maxWords, pack.tokens.layout.maxWords);
  const commonDurations = format.durations.filter((duration) =>
    limits.durations.includes(duration),
  );
  if (commonDurations.length === 0) {
    throw new StyleResolveError(
      "format-duration",
      `format "${format.id}" durations [${format.durations.join(", ")}] do not overlap style limits.durations [${limits.durations.join(", ")}]`,
    );
  }
  const targetDuration = Math.min(...commonDurations);
  const commonAspects = format.aspects.filter((aspect) =>
    limits.aspects.includes(aspect),
  );
  if (commonAspects.length === 0) {
    throw new StyleResolveError(
      "format-aspect",
      `format "${format.id}" aspects [${format.aspects.join(", ")}] do not overlap style limits.aspects [${limits.aspects.join(", ")}]`,
    );
  }
  const aspect = commonAspects.includes(format.primaryAspect)
    ? format.primaryAspect
    : commonAspects[0];
  if (aspect === undefined) {
    throw new StyleResolveError(
      "format-aspect",
      `format "${format.id}" has no aspect that the style allows`,
    );
  }

  type DraftShot = {
    id: string;
    beat: string;
    beatRoles: BeatRole[];
    recipe: string;
    slots: Record<string, string>;
    composition: CompositionOp[];
    transitionOut: string;
    min: number;
    max: number;
  };

  const drafts: DraftShot[] = [];

  for (const unit of units) {
    const candidates = recipes.filter((recipe) =>
      recipe.beatRoles.some((role) => unit.roles.includes(role)),
    );
    if (candidates.length === 0) {
      throw new StyleResolveError(
        "assertion-2",
        `format beat "${unit.beat}" maps to roles ${unit.roles.join(", ")} but no recipe uses them`,
      );
    }

    let selected: StyleRecipe | undefined;
    let missingSlot: string | undefined;
    for (const candidate of candidates) {
      const missing = candidate.slots.find((slot) => resolveSlot(brief, slot) === null);
      if (missing === undefined) {
        selected = candidate;
        break;
      }
      missingSlot ??= missing;
    }

    if (selected === undefined) {
      throw new StyleResolveError(
        "assertion-1",
        `format beat "${unit.beat}" has no candidate recipe whose slots resolve; missing "${missingSlot ?? "a slot"}"`,
      );
    }

    const slots: Record<string, string> = {};
    for (const slot of selected.slots) {
      const value = resolveSlot(brief, slot);
      if (value === null) {
        throw new StyleResolveError(
          "assertion-1",
          `recipe "${selected.id}" slot "${slot}" resolved empty for format beat "${unit.beat}"`,
        );
      }
      if (slot.startsWith("content.")) {
        const words = countWords(value);
        if (words > contentWordLimit) {
          throw new StyleResolveError(
            "assertion-9",
            `recipe "${selected.id}" slot "${slot}" resolves to ${words} words, over the ${contentWordLimit}-word limit (capabilities.limits.maxWords ${limits.maxWords}, tokens.layout.maxWords ${pack.tokens.layout.maxWords}) for format beat "${unit.beat}"`,
          );
        }
      }
      slots[slot] = value;
    }

    for (const asset of selected.assets) {
      if (!assetIds.has(asset)) {
        throw new StyleResolveError(
          "assertion-3",
          `recipe "${selected.id}" references asset "${asset}" which is not in capabilities.assets.starterLibrary`,
        );
      }
    }
    for (const op of selected.composition) {
      for (const asset of compositionOpAssetReferences(op)) {
        if (!assetIds.has(asset)) {
          throw new StyleResolveError(
            "assertion-3",
            `recipe "${selected.id}" ${op.op} op references asset "${asset}" which is not in capabilities.assets.starterLibrary`,
          );
        }
      }
      if (op.op === "transition" && !transitionsAllowed.has(op.kind)) {
        throw new StyleResolveError(
          "assertion-7",
          `recipe "${selected.id}" uses transition "${op.kind}" which tokens.motion.transitions does not allow`,
        );
      }
    }

    if (!transitionsAllowed.has(selected.transitionOut)) {
      throw new StyleResolveError(
        "assertion-7",
        `recipe "${selected.id}" transitionOut "${selected.transitionOut}" is not allowed by tokens.motion.transitions`,
      );
    }

    for (let repeat = 0; repeat < unit.count; repeat += 1) {
      drafts.push({
        id: `s${String(drafts.length + 1).padStart(2, "0")}`,
        beat: unit.beat,
        beatRoles: selected.beatRoles,
        recipe: selected.id,
        slots,
        composition: selected.composition,
        transitionOut: selected.transitionOut,
        min: selected.duration.min,
        max: selected.duration.max,
      });
    }
  }

  if (drafts.length === 0) {
    throw new StyleResolveError(
      "assertion-8",
      `format "${format.id}" selected no shots`,
    );
  }

  // Allocate in milliseconds so the total is exact. Every shot starts at its
  // recipe minimum; the remaining target is shared out by remaining capacity.
  const targetMs = Math.round(targetDuration * 1000);
  const allocations = drafts.map((draft, index) => {
    const min = Math.round(draft.min * 1000);
    const max = Math.round(draft.max * 1000);
    return { index, min, max, capacity: Math.max(0, max - min), extra: 0, fraction: 0 };
  });
  const totalMinMs = allocations.reduce((sum, entry) => sum + entry.min, 0);
  const totalMaxMs = allocations.reduce((sum, entry) => sum + entry.max, 0);

  if (targetMs < totalMinMs) {
    throw new StyleResolveError(
      "assertion-8",
      `format "${format.id}" needs ${round(targetDuration)}s but the ${drafts.length} selected shots have a minimum of ${round(totalMinMs / 1000)}s; shorten the sequence or use fewer repeats`,
    );
  }
  if (targetMs > totalMaxMs) {
    throw new StyleResolveError(
      "assertion-8",
      `format "${format.id}" needs ${round(targetDuration)}s but the ${drafts.length} selected shots have a maximum of ${round(totalMaxMs / 1000)}s; shorten the sequence or raise a recipe duration.max`,
    );
  }

  const remainingMs = targetMs - totalMinMs;
  const totalCapacityMs = allocations.reduce((sum, entry) => sum + entry.capacity, 0);
  if (remainingMs > 0 && totalCapacityMs === 0) {
    throw new StyleResolveError(
      "assertion-8",
      `format "${format.id}" needs ${round(targetDuration)}s but every selected recipe is already at duration.max`,
    );
  }
  for (const entry of allocations) {
    const raw =
      totalCapacityMs > 0 ? (remainingMs * entry.capacity) / totalCapacityMs : 0;
    const whole = Math.floor(raw);
    entry.extra = Math.min(entry.capacity, whole);
    entry.fraction = raw - whole;
  }

  let assignedMs = allocations.reduce((sum, entry) => sum + entry.extra, 0);
  let residualMs = remainingMs - assignedMs;
  const byFraction = [...allocations].sort(
    (a, b) => b.fraction - a.fraction || a.index - b.index,
  );
  let cursor = 0;
  while (residualMs > 0 && byFraction.length > 0) {
    const entry = byFraction[cursor % byFraction.length];
    if (entry !== undefined && entry.extra < entry.capacity) {
      entry.extra += 1;
      residualMs -= 1;
    }
    cursor += 1;
    if (cursor > byFraction.length * 1000) break;
  }
  if (residualMs !== 0) {
    throw new StyleResolveError(
      "assertion-8",
      `format "${format.id}" could not distribute ${round(residualMs / 1000)}s across the selected recipe ranges`,
    );
  }

  const shots: ResolvedShot[] = [];
  let start = 0;
  drafts.forEach((draft, index) => {
    const allocation = allocations[index];
    if (allocation === undefined) {
      throw new StyleResolveError("assertion-8", `shot "${draft.id}" has no duration allocation`);
    }
    const durationMs = allocation.min + allocation.extra;
    if (durationMs < allocation.min || durationMs > allocation.max) {
      throw new StyleResolveError(
        "assertion-8",
        `shot "${draft.id}" (${draft.recipe}) duration ${round(durationMs / 1000)}s is outside its recipe range ${draft.min}–${draft.max}s`,
      );
    }
    const duration = round(durationMs / 1000);
    shots.push({
      id: draft.id,
      beat: draft.beat,
      beatRoles: draft.beatRoles,
      recipe: draft.recipe,
      start: round(start),
      duration,
      slots: draft.slots,
      composition: draft.composition,
      transitionOut: draft.transitionOut,
    });
    start = round(start + duration);
  });

  const scaledTotal = round(
    shots.reduce((sum, shot) => sum + shot.duration, 0),
  );
  if (scaledTotal !== round(targetDuration)) {
    throw new StyleResolveError(
      "assertion-8",
      `scaled durations sum to ${scaledTotal}s but the format duration is ${targetDuration}s`,
    );
  }

  const plan: ResolvePlan = {
    style: pack.capabilities.identity.id,
    version: pack.capabilities.identity.version,
    format: format.id,
    formatName: format.name,
    briefHash: sha256(canonicalJson(brief)),
    seed,
    duration: round(targetDuration),
    aspect,
    shots,
    variations: variationsForSeed(seed),
  };

  if (
    !format.durations.includes(plan.duration) ||
    !limits.durations.includes(plan.duration)
  ) {
    throw new StyleResolveError(
      "assertion-8",
      `plan duration ${plan.duration}s does not fit the format and style limits`,
    );
  }
  if (
    !format.aspects.includes(plan.aspect) ||
    !limits.aspects.includes(plan.aspect)
  ) {
    throw new StyleResolveError(
      "assertion-8",
      `plan aspect ${plan.aspect} does not fit the format and style limits`,
    );
  }

  return plan;
}

export type ResolveStyleOptions = {
  compare?: { brief: GenericBrief; format: ResolveFormat };
  /** The same options style:check uses; tests pass their own template. */
  validation?: ValidateStylePackOptions;
};

/**
 * Resolve one brief against one format.
 *
 * A pack with any hard failure is refused before a plan is built. Assertions
 * 1, 2, 3, 5, 6, 7, 8 and 9 are enforced here. Assertion 4 needs two briefs, so
 * it is enforced when `options.compare` is supplied (the CLI does this for
 * every pair after the first).
 */
export function resolveStyle(
  pack: LoadedStylePack,
  brief: GenericBrief,
  format: ResolveFormat,
  seed: number,
  options: ResolveStyleOptions = {},
): ResolvePlan {
  const checked = validateStylePack(pack.path, options.validation ?? {});
  if (checked.hardFailures.length > 0) {
    const summary = checked.hardFailures
      .slice(0, 5)
      .map((failure) => `${failure.rule}: ${failure.message}`)
      .join("; ");
    throw new StyleResolveError(
      "validation",
      `style pack "${pack.capabilities.identity.id}" has ${checked.hardFailures.length} hard failure(s); run style:check first. ${summary}`,
    );
  }

  const plan = buildResolvePlan(pack, brief, format, seed);
  const sameAgain = buildResolvePlan(pack, brief, format, seed);
  assertSamePlan(plan, sameAgain);

  const differentSeed = buildResolvePlan(pack, brief, format, seed + 1);
  assertSeedChanges(plan, differentSeed);

  if (options.compare) {
    const other = buildResolvePlan(
      pack,
      options.compare.brief,
      options.compare.format,
      seed,
    );
    assertBriefsDiffer(plan, other);
  }

  return plan;
}

// ---------------------------------------------------------------------------
// Approval
// ---------------------------------------------------------------------------

const SIGNOFF_ELEMENT_GLOBAL =
  /<([a-zA-Z][\w-]*)([^>]*(?<![\w-])data-signoff(?![\w-])[^>]*)>[\s\S]*?<\/\1>/g;

export function rewriteCardSignoff(
  card: string,
  by: string,
  date: string,
): string | null {
  if (!SIGNOFF_ELEMENT_PATTERN.test(card)) return null;
  const text = htmlEscape(`${by} · ${date}`);
  return card.replace(
    SIGNOFF_ELEMENT_GLOBAL,
    (_match: string, tag: string, attributes: string) =>
      `<${tag}${attributes}>${text}</${tag}>`,
  );
}

export function rewriteCardStatus(card: string, status: string): string {
  const text = htmlEscape(status);
  return card.replace(
    STATUS_ELEMENT_GLOBAL,
    (_match: string, tag: string, attributes: string) =>
      `<${tag}${attributes}>${text}</${tag}>`,
  );
}

export function rewriteCardWaiting(card: string, date: string): string {
  const text = htmlEscape(`Approved ${date}`);
  return card.replace(
    WAITING_ELEMENT_GLOBAL,
    (_match: string, tag: string, attributes: string) =>
      `<${tag}${attributes}>${text}</${tag}>`,
  );
}

export type ApproveStyleResult = {
  approved: boolean;
  result: StyleCheckResult;
  signoff?: StyleSignoff;
};

export function approveStylePack(
  packPath: string,
  by: string,
  date: string = todayIso(),
  options: ValidateStylePackOptions = {},
): ApproveStyleResult {
  if (by.trim().length === 0) {
    throw new Error("--by must not be empty");
  }

  const root = resolve(packPath);
  const before = validateStylePack(root, options);
  if (
    before.hardFailures.length > 0 ||
    before.status === "DRAFT" ||
    before.chosen.length > 0
  ) {
    return { approved: false, result: before };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("--date must be YYYY-MM-DD");
  }

  const cardPath = join(root, "card.html");
  const stylePath = join(root, "STYLE.md");
  const capabilitiesPath = join(root, "capabilities.json");
  const card = readFileSync(cardPath, "utf8");
  const styleDocument = readFileSync(stylePath, "utf8");
  const signed = rewriteCardSignoff(card, by.trim(), date);
  if (signed === null) {
    // This should already be a hard failure, but guard against a race.
    const result = validateStylePack(root, options);
    return { approved: false, result };
  }
  // Approval must never silently skip a marker it cannot rewrite.
  if (cardStatusTexts(card).length === 0 || cardWaitingTexts(card).length === 0) {
    const result = validateStylePack(root, options);
    return { approved: false, result };
  }
  const statusWritten = rewriteCardStatus(signed, "APPROVED");
  const rewrittenCard = rewriteCardWaiting(statusWritten, date);
  const rewrittenStyle = rewriteStyleStatus(styleDocument, "approved");
  if (rewrittenStyle === null) {
    throw new Error(
      "STYLE.md has no **Status:** line; add one before approving",
    );
  }

  const capabilities = JSON.parse(
    readFileSync(capabilitiesPath, "utf8"),
  ) as unknown;
  const identity = asRecord(readPath(capabilities, "identity"));
  if (identity === null) {
    throw new Error("capabilities.identity is missing");
  }
  const bindings = asRecord(identity.bindings);
  if (bindings === null) {
    throw new Error("capabilities.identity.bindings is missing");
  }
  identity.status = "approved";

  // The card, STYLE.md and capabilities are all part of the pack. Rewrite them
  // BEFORE hashing so the sign-off binds the exact bytes a reviewer sees.
  writeFileSync(cardPath, rewrittenCard, "utf8");
  writeFileSync(stylePath, rewrittenStyle, "utf8");
  writeStyleJson(capabilitiesPath, capabilities);
  const packHashAfterRewrite = computePackHash(root);

  const signoff: StyleSignoff = {
    by: by.trim(),
    date,
    version: asString(identity?.version) ?? "0.0.0",
    packHash: packHashAfterRewrite,
    briefHash: asString(bindings.briefHash) ?? computeBriefHash(root),
    templateHash: asString(bindings.templateHash) ?? "",
    contractHash: asString(bindings.contractHash) ?? computeContractHash(),
  };

  mkdirSync(root, { recursive: true });
  writeFileSync(
    join(root, "signoff.json"),
    `${JSON.stringify(signoff, null, 2)}\n`,
    "utf8",
  );

  const after = validateStylePack(root, options);
  return { approved: after.status === "APPROVED", result: after, signoff };
}

function identityIdOf(directory: string): string | null {
  const capabilitiesPath = join(directory, "capabilities.json");
  if (!existsSync(capabilitiesPath)) return null;
  try {
    const capabilities = JSON.parse(readFileSync(capabilitiesPath, "utf8")) as unknown;
    return asString(readPath(capabilities, "identity.id"));
  } catch {
    // An unreadable candidate is not a match.
    return null;
  }
}

function childDirectories(directory: string): string[] {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directory, entry.name));
  } catch {
    return [];
  }
}

/**
 * Resolve a style id to a directory. The direct pack `styles/<id>` wins, then
 * a pack whose identity.id matches. Sealed/example packs live one level deeper
 * (`styles/_examples/<id>`), so depth 2 is searched for the CLI's exact path.
 */
export function findStyleDirectory(stylesRoot: string, id: string): string | null {
  if (!existsSync(stylesRoot)) return null;
  const root = resolve(stylesRoot);
  const direct = childDirectories(root);

  for (const candidate of direct) {
    if (basename(candidate) === id) return candidate;
  }
  for (const candidate of direct) {
    if (identityIdOf(candidate) === id) return candidate;
  }

  for (const parent of direct) {
    for (const candidate of childDirectories(parent)) {
      if (basename(candidate) !== id) continue;
      if (!existsSync(join(candidate, "capabilities.json"))) continue;
      return candidate;
    }
    for (const candidate of childDirectories(parent)) {
      if (identityIdOf(candidate) === id) return candidate;
    }
  }
  return null;
}

/**
 * Prepare gate/blind for a fresh seal. --force replaces the folder, but the
 * author's output (`pack/`) is kept unless --discard-pack is explicit.
 */
export function resetSealTarget(
  target: string,
  options: { force: boolean; discardPack: boolean },
): { preservedPack: boolean } {
  const root = resolve(target);
  if (!existsSync(root)) {
    mkdirSync(root, { recursive: true });
    return { preservedPack: false };
  }
  if (!options.force) {
    throw new Error(
      "gate/blind already exists. Re-run with --force to replace it (this deletes the sealed folder).",
    );
  }
  const packPath = join(root, "pack");
  const preservedPack = !options.discardPack && existsSync(packPath);
  if (options.discardPack) {
    rmSync(root, { recursive: true, force: true });
    mkdirSync(root, { recursive: true });
    return { preservedPack: false };
  }
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === "pack") continue;
    rmSync(join(root, entry.name), { recursive: true, force: true });
  }
  mkdirSync(root, { recursive: true });
  return { preservedPack };
}

// ---------------------------------------------------------------------------
// File helpers used by scripts/style.ts
// ---------------------------------------------------------------------------

export function readStyleJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

export function writeStyleJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
