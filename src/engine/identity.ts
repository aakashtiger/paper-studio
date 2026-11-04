/**
 * The film-level identity vocabulary.
 *
 * The pack owns the grammar; the score owns the film's choices. This module is
 * deliberately pure: it validates what the film *says* it is, and leaves the
 * painted frame to `frame-report.ts`. No filesystem, no renderer, no second
 * identity document.
 */
import { z } from "zod";

export const PERFORMANCE_MODES = [
  "stage-show",
  "presenter-show",
  "creature-show",
  "diagram-show",
] as const;

export const ENTRANCE_VIAS = [
  "door",
  "trapdoor",
  "fold",
  "curtain",
  "back-of-frame",
  "spotlight",
] as const;

export const EXIT_VIAS = ["bow", "curtain", "pullback", "loop", "freeze"] as const;

export const MOTIFS = [
  "sunburst",
  "paper-sun",
  "petal",
  "halo",
  "torn-strip",
  "tape",
  "stamp",
  "print-marks",
  "iris",
  "confetti",
  "speed-lines",
  "paperclip",
  "meter",
] as const;

export const FIELD_ROLES = [
  "paper",
  "ink",
  "red",
  "blue",
  "acid",
  "accent",
  "kraft",
  "teal",
  "oxblood",
  "orange",
  "green",
  "pink",
  "cream",
] as const;

/** The field roles that count as warm earth for the colour script. */
export const WARM_FIELD_ROLES: readonly string[] = [
  "paper",
  "red",
  "accent",
  "kraft",
  "teal",
  "oxblood",
  "orange",
  "green",
  "pink",
  "cream",
];

const BeatRefSchema = z.string().min(1);

export const FilmPerformanceSchema = z
  .object({
    mode: z.enum(PERFORMANCE_MODES),
    star: z.string().min(1),
    entrance: z
      .object({ beat: BeatRefSchema, via: z.enum(ENTRANCE_VIAS) })
      .strict(),
    exit: z
      .object({ beat: BeatRefSchema, via: z.enum(EXIT_VIAS) })
      .strict(),
    signature: z.object({ name: z.string().min(1) }).strict(),
  })
  .strict();

export const PaletteScriptEntrySchema = z
  .object({
    beat: BeatRefSchema,
    field: z.enum(FIELD_ROLES),
  })
  .strict();

export const MotifDeclarationSchema = z
  .object({
    motif: z.string().min(1),
    kind: z.enum(["object", "device"]),
    meaning: z.string().min(1),
  })
  .strict();

export type FilmPerformance = z.infer<typeof FilmPerformanceSchema>;
export type PaletteScriptEntry = z.infer<typeof PaletteScriptEntrySchema>;
export type MotifDeclaration = z.infer<typeof MotifDeclarationSchema>;

export type FilmIdentityFinding = {
  code:
    | "identity:performance"
    | "identity:palette"
    | "identity:motif"
    | "identity:forbidden";
  message: string;
};

export type FilmIdentityPack = {
  modes: readonly string[];
  defaultMode: string;
  motifLibrary: readonly string[];
  perFilm: { min: number; max: number };
  uses: { min: number; max: number };
  maxShotShare: number;
  semanticObjectMin: number;
  fieldRoles: readonly string[];
  forbidden: readonly string[];
};

export type FilmIdentityScore = {
  performance?: unknown;
  paletteScript?: unknown;
  motifs?: unknown;
  cast?: readonly { character?: string }[];
  shots: readonly {
    id?: string;
    beat?: string;
    motif?: string;
    transitionOut?: string;
    camera?: { move?: string; from?: number; to?: number };
  }[];
};

/**
 * Check the film's declared identity. Missing is a finding, never a pass:
 * a score that has not chosen its performance, colour script or motifs is not
 * a Paper K-pop film yet.
 */
export function checkFilmIdentity(input: {
  score: FilmIdentityScore;
  pack: FilmIdentityPack;
  beatIds: ReadonlySet<string>;
}): FilmIdentityFinding[] {
  const findings: FilmIdentityFinding[] = [];
  const { score, pack, beatIds } = input;

  const performance = FilmPerformanceSchema.safeParse(score.performance);
  if (!performance.success) {
    findings.push({
      code: "identity:performance",
      message:
        "the score has no valid performance block (mode, star, entrance, exit, signature)",
    });
  } else {
    const value = performance.data;
    if (!pack.modes.includes(value.mode)) {
      findings.push({
        code: "identity:performance",
        message: `performance.mode "${value.mode}" is not one of ${pack.modes.join(", ")}`,
      });
    }
    const castNames = new Set(
      (score.cast ?? [])
        .map((member) => member.character)
        .filter((name): name is string => typeof name === "string" && name.length > 0),
    );
    if (!castNames.has(value.star)) {
      findings.push({
        code: "identity:performance",
        message: `performance.star "${value.star}" is not in the score's cast`,
      });
    }
    for (const [label, ref] of [
      ["entrance", value.entrance.beat],
      ["exit", value.exit.beat],
    ] as const) {
      if (!beatIds.has(ref)) {
        findings.push({
          code: "identity:performance",
          message: `performance.${label}.beat "${ref}" is not in beats.json`,
        });
      }
    }
  }

  const palette = Array.isArray(score.paletteScript) ? score.paletteScript : null;
  if (palette === null || palette.length === 0) {
    findings.push({
      code: "identity:palette",
      message: "the score has no paletteScript; 3-5 field choices are required",
    });
  } else {
    if (palette.length < 3 || palette.length > 5) {
      findings.push({
        code: "identity:palette",
        message: `paletteScript has ${palette.length} entries; the style needs 3-5`,
      });
    }
    let warm = 0;
    let blue = 0;
    let previous: string | null = null;
    palette.forEach((raw, index) => {
      const parsed = PaletteScriptEntrySchema.safeParse(raw);
      if (!parsed.success) {
        findings.push({
          code: "identity:palette",
          message: `paletteScript[${index}] must name a beat and a field role`,
        });
        return;
      }
      const { beat, field } = parsed.data;
      if (!beatIds.has(beat)) {
        findings.push({
          code: "identity:palette",
          message: `paletteScript[${index}] names beat "${beat}", which is not in beats.json`,
        });
      }
      if (!pack.fieldRoles.includes(field)) {
        findings.push({
          code: "identity:palette",
          message: `paletteScript[${index}] field "${field}" is not a declared field role`,
        });
      }
      if (field === "blue") blue += 1;
      if (WARM_FIELD_ROLES.includes(field)) warm += 1;
      if (field === previous) {
        findings.push({
          code: "identity:palette",
          message: `paletteScript repeats "${field}" in consecutive entries`,
        });
      }
      previous = field;
    });
    if (warm < 2) {
      findings.push({
        code: "identity:palette",
        message: `paletteScript has ${warm} warm field(s); the style needs at least 2`,
      });
    }
    if (blue > 1) {
      findings.push({
        code: "identity:palette",
        message: `paletteScript has ${blue} blue fields; the style allows at most 1`,
      });
    }
  }

  const motifs = Array.isArray(score.motifs) ? score.motifs : null;
  if (motifs === null || motifs.length === 0) {
    findings.push({
      code: "identity:motif",
      message: "the score has no motifs; 3-5 motif declarations are required",
    });
  } else {
    if (motifs.length < pack.perFilm.min || motifs.length > pack.perFilm.max) {
      findings.push({
        code: "identity:motif",
        message: `the score declares ${motifs.length} motifs; the style needs ${pack.perFilm.min}-${pack.perFilm.max}`,
      });
    }
    const declared = new Set<string>();
    let semanticObjects = 0;
    motifs.forEach((raw, index) => {
      const parsed = MotifDeclarationSchema.safeParse(raw);
      if (!parsed.success) {
        findings.push({
          code: "identity:motif",
          message: `motifs[${index}] must name a motif, a kind (object/device) and a meaning`,
        });
        return;
      }
      const { motif, kind, meaning } = parsed.data;
      if (kind === "device" && !pack.motifLibrary.includes(motif)) {
        findings.push({
          code: "identity:motif",
          message: `device motif "${motif}" is not in the pack's motif library`,
        });
      }
      if (declared.has(motif)) {
        findings.push({
          code: "identity:motif",
          message: `motif "${motif}" is declared twice`,
        });
      }
      declared.add(motif);
      if (kind === "object" && meaning.trim().length > 0) semanticObjects += 1;
    });
    if (semanticObjects < pack.semanticObjectMin) {
      findings.push({
        code: "identity:motif",
        message: `the score has ${semanticObjects} semantic object motif(s); the style needs ${pack.semanticObjectMin}`,
      });
    }

    const uses = new Map<string, number>();
    for (const shot of score.shots) {
      if (typeof shot.motif === "string" && shot.motif.length > 0) {
        uses.set(shot.motif, (uses.get(shot.motif) ?? 0) + 1);
      }
    }
    for (const motif of declared) {
      const count = uses.get(motif) ?? 0;
      if (count < pack.uses.min || count > pack.uses.max) {
        findings.push({
          code: "identity:motif",
          message: `motif "${motif}" is used in ${count} shot(s); the style needs ${pack.uses.min}-${pack.uses.max}`,
        });
      }
    }
    const maxShots = Math.max(1, Math.floor(score.shots.length * pack.maxShotShare));
    for (const [motif, count] of uses) {
      if (count > maxShots) {
        findings.push({
          code: "identity:motif",
          message: `motif "${motif}" is used in ${count} shots; the style allows at most ${maxShots} (${Math.round(pack.maxShotShare * 100)}%)`,
        });
      }
    }
  }

  const forbidden = new Set(pack.forbidden);
  for (const shot of score.shots) {
    const transition = shot.transitionOut;
    if (typeof transition === "string" && forbidden.has(transition)) {
      findings.push({
        code: "identity:forbidden",
        message: `shot "${shot.id ?? "?"}" uses forbidden transition "${transition}"`,
      });
    }
    if (
      forbidden.has("static-no-creep") &&
      shot.camera?.move === "static" &&
      shot.camera.from === shot.camera.to
    ) {
      findings.push({
        code: "identity:forbidden",
        message: `shot "${shot.id ?? "?"}" is static with no creep`,
      });
    }
  }

  return findings;
}
