import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { loadStyle, type Recipe } from "./plan.js";

/**
 * A treatment is the authored creative direction: which recipe each shot uses,
 * how long it runs, the copy, the camera hint and the motion note. It is
 * resolved against a style pack before anything is rendered.
 *
 * The treatment may narrow the pack (durations inside the recipe limits, slots
 * the recipe declares). It may not invent a palette, a font, a shot or a
 * recipe id: those live in `styles/`.
 */

export const TreatmentShotSchema = z.object({
  recipe: z.string().min(1),
  duration: z.number().positive(),
  slots: z.record(z.string()).default({}),
  camera: z
    .object({
      move: z.string(),
      from: z.number(),
      to: z.number(),
      ease: z.string(),
    })
    .optional(),
  motion: z
    .object({
      beat: z.string().optional(),
      note: z.string().min(1),
    })
    .optional(),
  transitionOut: z.string().optional(),
});

export const TreatmentSchema = z.object({
  id: z.string().min(1),
  style: z.string().min(1),
  styleVersion: z.string().min(1),
  aspect: z.string().min(1),
  fps: z.number().int().positive(),
  duration: z.number().positive(),
  seed: z.union([z.string(), z.number()]),
  /** A proof may deliberately exceed a recipe limit; the resolver warns. */
  proof: z.boolean().optional(),
  shots: z.array(TreatmentShotSchema).min(1),
});

export type Treatment = z.infer<typeof TreatmentSchema>;
export type TreatmentShot = z.infer<typeof TreatmentShotSchema>;

export type TreatmentIssue = {
  code: string;
  message: string;
  shot?: string;
};

export type ResolvedShot = {
  id: string;
  recipe: string;
  start: number;
  duration: number;
  slots: Record<string, string>;
  camera: TreatmentShot["camera"];
  motion: TreatmentShot["motion"];
  transitionOut: string;
};

export type ResolvedTreatment = {
  projectId: string;
  style: string;
  styleVersion: string;
  seed: string | number;
  aspect: string;
  fps: number;
  duration: number;
  frames: number;
  shots: ResolvedShot[];
  warnings: string[];
};

type Capabilities = {
  identity: { id: string; version: string };
  limits: { aspects: string[]; durations: number[]; maxWords: number; maxCast: number };
  proof?: { frames?: string[] };
};

const TRANSITIONS = ["cut", "iris", "wipe", "hold", "match_cut"];

export function resolveTreatment(
  input: unknown,
  styleDir: string,
): { plan: ResolvedTreatment; errors: TreatmentIssue[]; warnings: TreatmentIssue[] } {
  const treatment = TreatmentSchema.parse(input);
  const capabilities = JSON.parse(
    readFileSync(resolve(styleDir, "capabilities.json"), "utf8"),
  ) as Capabilities;
  const { recipes } = loadStyle(styleDir);
  const errors: TreatmentIssue[] = [];
  const warnings: TreatmentIssue[] = [];

  if (treatment.style !== capabilities.identity.id) {
    errors.push({
      code: "style_mismatch",
      message: `treatment asks for "${treatment.style}" but the pack is "${capabilities.identity.id}"`,
    });
  }
  if (treatment.styleVersion !== capabilities.identity.version) {
    warnings.push({
      code: "style_version",
      message: `treatment pins ${treatment.style}@${treatment.styleVersion} but the pack is @${capabilities.identity.version}`,
    });
  }
  if (!capabilities.limits.aspects.includes(treatment.aspect)) {
    errors.push({
      code: "aspect_unsupported",
      message: `aspect "${treatment.aspect}" is not in ${capabilities.limits.aspects.join(", ")}`,
    });
  }
  if (
    !treatment.proof &&
    capabilities.limits.durations.length > 0 &&
    !capabilities.limits.durations.includes(treatment.duration)
  ) {
    errors.push({
      code: "duration_unsupported",
      message: `duration ${treatment.duration}s is not in ${capabilities.limits.durations.join(", ")}`,
    });
  }

  let start = 0;
  const shots: ResolvedShot[] = treatment.shots.map((shot, index) => {
    const id = `s${String(index + 1).padStart(2, "0")}`;
    const recipe = recipes.get(shot.recipe);
    if (!recipe) {
      errors.push({
        code: "recipe_missing",
        message: `recipe "${shot.recipe}" is not in the pack`,
        shot: id,
      });
      return unresolved(id, shot, start);
    }

    checkRecipe(id, shot, recipe, treatment.proof === true, capabilities, errors, warnings);

    const resolved: ResolvedShot = {
      id,
      recipe: shot.recipe,
      start: round(start),
      duration: round(shot.duration),
      slots: { ...shot.slots },
      camera: shot.camera ?? recipe.camera,
      motion: shot.motion,
      transitionOut: shot.transitionOut ?? recipe.transitionOut,
    };
    start += shot.duration;
    return resolved;
  });

  const total = round(shots.reduce((sum, shot) => sum + shot.duration, 0));
  if (Math.abs(total - treatment.duration) > 0.001) {
    errors.push({
      code: "duration_sum",
      message: `shot durations sum to ${total}s, expected ${treatment.duration}s`,
    });
  }

  const plan: ResolvedTreatment = {
    projectId: treatment.id,
    style: treatment.style,
    styleVersion: treatment.styleVersion,
    seed: treatment.seed,
    aspect: treatment.aspect,
    fps: treatment.fps,
    duration: treatment.duration,
    frames: Math.round(treatment.duration * treatment.fps),
    shots,
    warnings: warnings.map((issue) => issue.message),
  };

  return { plan, errors, warnings };
}

function checkRecipe(
  id: string,
  shot: TreatmentShot,
  recipe: Recipe,
  proof: boolean,
  capabilities: Capabilities,
  errors: TreatmentIssue[],
  warnings: TreatmentIssue[],
) {
  const { min, max } = recipe.duration;
  if (shot.duration < min || shot.duration > max) {
    const issue = {
      code: "duration_outside_recipe",
      message: `${shot.recipe} runs ${shot.duration}s, recipe allows ${min}–${max}s`,
      shot: id,
    };
    if (proof) warnings.push(issue);
    else errors.push(issue);
  }

  if (capabilities.proof?.frames && !capabilities.proof.frames.includes(shot.recipe)) {
    warnings.push({
      code: "recipe_not_in_proof",
      message: `recipe "${shot.recipe}" is not in the pack's proof frame list`,
      shot: id,
    });
  }

  const declared = new Set([...recipe.slots, ...(recipe.optionalSlots ?? [])]);
  for (const slot of recipe.slots) {
    if (!(slot in shot.slots)) {
      if (recipe.optionalSlots?.includes(slot)) continue;
      errors.push({
        code: "slot_missing",
        message: `recipe "${shot.recipe}" needs "${slot}"`,
        shot: id,
      });
    }
  }
  for (const slot of Object.keys(shot.slots)) {
    if (!declared.has(slot)) {
      warnings.push({
        code: "slot_unknown",
        message: `slot "${slot}" is not declared by "${shot.recipe}"`,
        shot: id,
      });
    }
    const words = shot.slots[slot]?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (words.length > capabilities.limits.maxWords) {
      errors.push({
        code: "words_over_limit",
        message: `slot "${slot}" has ${words.length} words, limit is ${capabilities.limits.maxWords}`,
        shot: id,
      });
    }
  }

  if (!TRANSITIONS.includes(shot.transitionOut ?? recipe.transitionOut)) {
    errors.push({
      code: "transition_unknown",
      message: `transition "${shot.transitionOut ?? recipe.transitionOut}" is not in ${TRANSITIONS.join(", ")}`,
      shot: id,
    });
  }
}

function unresolved(id: string, shot: TreatmentShot, start: number): ResolvedShot {
  return {
    id,
    recipe: shot.recipe,
    start: round(start),
    duration: round(shot.duration),
    slots: { ...shot.slots },
    camera: shot.camera,
    motion: shot.motion,
    transitionOut: shot.transitionOut ?? "cut",
  };
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
