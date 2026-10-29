import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { loadStyle, type Recipe } from "./plan.js";
import {
  AudioPlanSchema,
  type AudioPlan,
  resolveAudio,
  type SfxCue,
  SfxCueSchema,
} from "./audio.js";
import { AssetRefSchema, type AssetRef, resolveAssets } from "./assets.js";
import { FilmBriefSchema, resolveBrief } from "./film-brief.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "./pose.js";

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

/* ------------------------------------------------------------------ film */

export const NarrationLineSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  start: z.number().nonnegative(),
  duration: z.number().positive(),
  /** Extra caption hold after the spoken line; not extra audio. */
  hold: z.number().nonnegative().optional(),
});

export const CaptionLineSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  start: z.number().nonnegative(),
  end: z.number().positive(),
});

export const ClockSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("music"),
    bpm: z.number().positive(),
    offset: z.number().nonnegative(),
    meter: z.number().int().positive(),
  }),
  z.object({
    mode: z.literal("narration"),
    lines: z.array(NarrationLineSchema).min(1),
  }),
  z.object({ mode: z.literal("sfx"), cues: z.array(SfxCueSchema).min(1) }),
  z.object({
    mode: z.literal("realtime"),
    start: z.number(),
    zero: z.number(),
  }),
  z.object({
    mode: z.literal("reading"),
    base: z.number().positive(),
    perWord: z.number().positive(),
  }),
  z.object({ mode: z.literal("free") }),
]);

export const DirectionSchema = z.object({
  entry: z.string().min(1),
  exit: z.string().min(1),
  spine: z.string().min(1),
  events: z
    .array(
      z.object({
        t: z.number().nonnegative(),
        kind: z.string().min(1),
        note: z.string().min(1),
      }),
    )
    .min(3),
});

export const FilmScoreSchema = TreatmentSchema.omit({ proof: true })
  .extend({
    brief: z.string().min(1),
    edit: z.object({
      minShot: z.number().positive(),
      medianShot: z.number().positive(),
      maxShot: z.number().positive(),
    }),
    clock: ClockSchema,
    audio: AudioPlanSchema,
    captions: z.object({
      source: z.string().min(1),
      lines: z.array(CaptionLineSchema).min(1),
    }),
    assets: z.array(AssetRefSchema).min(1),
    cast: z
      .array(
        z.object({
          character: z.string().min(1),
          poses: z.string().min(1),
          rig: z.string().min(1).optional(),
        }),
      )
      .default([]),
    shots: z
      .array(TreatmentShotSchema.extend({ direction: DirectionSchema }))
      .min(1),
  })
  .strict();

export type FilmScore = z.infer<typeof FilmScoreSchema>;
export type FilmShot = z.infer<typeof FilmScoreSchema>["shots"][number];
export type Clock = z.infer<typeof ClockSchema>;
export type Direction = z.infer<typeof DirectionSchema>;
export type NarrationLine = z.infer<typeof NarrationLineSchema>;
export type SoundCue = SfxCue;
export type CaptionLine = z.infer<typeof CaptionLineSchema>;

export type ResolvedFilmShot = ResolvedShot & { direction: Direction };

export type ResolvedFilm = Omit<ResolvedTreatment, "shots"> & {
  brief: string;
  clock: Clock;
  audio: AudioPlan;
  captions: FilmScore["captions"];
  assets: AssetRef[];
  cast: FilmScore["cast"];
  shots: ResolvedFilmShot[];
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

export function resolveFilm(
  input: unknown,
  styleDir: string,
  root: string = process.cwd(),
): { plan: ResolvedFilm; errors: TreatmentIssue[]; warnings: TreatmentIssue[] } {
  const film = FilmScoreSchema.parse(input);
  const capabilities = JSON.parse(
    readFileSync(resolve(styleDir, "capabilities.json"), "utf8"),
  ) as Capabilities;
  const { recipes } = loadStyle(styleDir);
  const errors: TreatmentIssue[] = [];
  const warnings: TreatmentIssue[] = [];

  if (film.style !== capabilities.identity.id) {
    errors.push({
      code: "style_mismatch",
      message: `film asks for "${film.style}" but the pack is "${capabilities.identity.id}"`,
    });
  }
  if (film.styleVersion !== capabilities.identity.version) {
    warnings.push({
      code: "style_version",
      message: `film pins ${film.style}@${film.styleVersion} but the pack is @${capabilities.identity.version}`,
    });
  }
  if (!capabilities.limits.aspects.includes(film.aspect)) {
    errors.push({
      code: "aspect_unsupported",
      message: `aspect "${film.aspect}" is not in ${capabilities.limits.aspects.join(", ")}`,
    });
  }
  if (
    capabilities.limits.durations.length > 0 &&
    !capabilities.limits.durations.includes(film.duration)
  ) {
    errors.push({
      code: "duration_unsupported",
      message: `duration ${film.duration}s is not in ${capabilities.limits.durations.join(", ")}`,
    });
  }

  const briefPath = resolve(root, film.brief);
  if (!existsSync(briefPath)) {
    errors.push({ code: "brief_missing", message: `brief "${film.brief}" does not exist` });
  } else {
    try {
      const brief = FilmBriefSchema.parse(JSON.parse(readFileSync(briefPath, "utf8")));
      const briefResult = resolveBrief(brief, styleDir);
      errors.push(...briefResult.errors.map((issue) => ({ code: issue.code, message: issue.message })));
      warnings.push(...briefResult.warnings.map((issue) => ({ code: issue.code, message: issue.message })));
      for (const [field, expected, actual] of [
        ["id", brief.id, film.id],
        ["style", brief.style, film.style],
        ["styleVersion", brief.styleVersion, film.styleVersion],
        ["aspect", brief.aspect, film.aspect],
        ["duration", brief.duration, film.duration],
        ["fps", brief.fps, film.fps],
        ["audioMode", brief.audioMode, film.audio.mode],
      ] as const) {
        if (expected !== actual) {
          errors.push({
            code: "brief_mismatch",
            message: `brief ${field} "${expected}" does not match the score "${actual}"`,
          });
        }
      }
    } catch (error) {
      errors.push({
        code: "brief_invalid",
        message: `brief could not be parsed: ${error instanceof Error ? error.message : "unknown"}`,
      });
    }
  }

  for (const entry of film.cast) {
    const posePath = resolve(root, entry.poses);
    if (!existsSync(posePath)) {
      errors.push({ code: "cast_missing", message: `pose library "${entry.poses}" does not exist` });
      continue;
    }
    try {
      const library = PoseLibrarySchema.parse(JSON.parse(readFileSync(posePath, "utf8")));
      if (library.character !== entry.character) {
        errors.push({
          code: "cast_character",
          message: `pose library "${entry.poses}" is for "${library.character}", not "${entry.character}"`,
        });
      }
      const poseResult = resolvePoseLibrary(library);
      errors.push(...poseResult.errors.map((issue) => ({ code: issue.code, message: issue.message })));
      warnings.push(...poseResult.warnings.map((issue) => ({ code: issue.code, message: issue.message })));
    } catch (error) {
      errors.push({
        code: "cast_invalid",
        message: `pose library "${entry.poses}" could not be parsed: ${error instanceof Error ? error.message : "unknown"}`,
      });
    }
  }

  const audioResult = resolveAudio(film.audio, {
    duration: film.duration,
    clockMode: film.clock.mode,
    root,
  });
  errors.push(...audioResult.errors.map((issue) => ({ code: issue.code, message: issue.message })));
  warnings.push(...audioResult.warnings.map((issue) => ({ code: issue.code, message: issue.message })));

  const assetResult = resolveAssets(film.assets, { root });
  errors.push(...assetResult.errors.map((issue) => ({ code: issue.code, message: issue.message })));
  warnings.push(...assetResult.warnings.map((issue) => ({ code: issue.code, message: issue.message })));

  let start = 0;
  const shots: ResolvedFilmShot[] = film.shots.map((shot, index) => {
    const id = `s${String(index + 1).padStart(2, "0")}`;
    const recipe = recipes.get(shot.recipe);
    if (!recipe) {
      errors.push({
        code: "recipe_missing",
        message: `recipe "${shot.recipe}" is not in the pack`,
        shot: id,
      });
    } else {
      checkRecipe(id, shot, recipe, false, capabilities, errors, warnings);
    }

    checkDirection(id, shot, errors);

    const resolved: ResolvedFilmShot = {
      id,
      recipe: shot.recipe,
      start: round(start),
      duration: round(shot.duration),
      slots: { ...shot.slots },
      camera: shot.camera ?? recipe?.camera,
      motion: shot.motion,
      transitionOut: shot.transitionOut ?? recipe?.transitionOut ?? "cut",
      direction: shot.direction,
    };
    start = round(start + shot.duration);
    return resolved;
  });

  const total = round(shots.reduce((sum, shot) => sum + shot.duration, 0));
  if (Math.abs(total - film.duration) > 0.001) {
    errors.push({
      code: "duration_sum",
      message: `shot durations sum to ${total}s, expected ${film.duration}s`,
    });
  }

  for (const shot of shots) {
    if (shot.duration < film.edit.minShot || shot.duration > film.edit.maxShot) {
      errors.push({
        code: "duration_outside_edit",
        message: `${shot.id} runs ${shot.duration}s, edit allows ${film.edit.minShot}–${film.edit.maxShot}s`,
        shot: shot.id,
      });
    }
  }
  const median = medianOf(shots.map((shot) => shot.duration));
  if (Math.abs(median - film.edit.medianShot) > film.edit.medianShot * 0.25) {
    errors.push({
      code: "median_outside_band",
      message: `shot median is ${median}s, expected ${film.edit.medianShot}s ±25%`,
    });
  }

  checkClock(film, errors);
  checkCaptions(film, capabilities, errors);

  const plan: ResolvedFilm = {
    projectId: film.id,
    style: film.style,
    styleVersion: film.styleVersion,
    seed: film.seed,
    aspect: film.aspect,
    fps: film.fps,
    duration: film.duration,
    frames: Math.round(film.duration * film.fps),
    shots,
    warnings: warnings.map((issue) => issue.message),
    brief: film.brief,
    clock: film.clock,
    audio: film.audio,
    captions: film.captions,
    assets: film.assets,
    cast: film.cast,
  };

  return { plan, errors, warnings };
}

function checkDirection(id: string, shot: FilmShot, errors: TreatmentIssue[]) {
  let previous = -1;
  for (const event of shot.direction.events) {
    if (event.t >= shot.duration) {
      errors.push({
        code: "event_outside_shot",
        message: `event at ${event.t}s is outside ${shot.recipe} (${shot.duration}s)`,
        shot: id,
      });
    }
    if (event.t < previous) {
      errors.push({
        code: "event_order",
        message: `events must be in time order (${event.t}s after ${previous}s)`,
        shot: id,
      });
    }
    previous = event.t;
  }
  if (!shot.direction.events.some((event) => event.t >= shot.duration / 3)) {
    errors.push({
      code: "event_late_missing",
      message: `no event after the first third of ${shot.recipe}`,
      shot: id,
    });
  }
}

function checkClock(film: FilmScore, errors: TreatmentIssue[]) {
  if (film.clock.mode === "narration") {
    let previousEnd = 0;
    const ids = new Set<string>();
    for (const line of film.clock.lines) {
      if (ids.has(line.id)) {
        errors.push({
          code: "narration_duplicate",
          message: `narration id "${line.id}" is duplicated`,
        });
      }
      ids.add(line.id);
      if (line.start < previousEnd - 0.001) {
        errors.push({
          code: "narration_overlap",
          message: `narration "${line.id}" starts at ${line.start}s, previous ends ${previousEnd}s`,
        });
      }
      if (line.start + line.duration > film.duration + 0.001) {
        errors.push({
          code: "narration_outside_film",
          message: `narration "${line.id}" ends after ${film.duration}s`,
        });
      }
      previousEnd = line.start + line.duration;
    }
  }
  if (film.clock.mode === "music") {
    if (film.clock.offset >= film.duration) {
      errors.push({
        code: "clock_offset",
        message: `music offset ${film.clock.offset}s is outside the film`,
      });
    }
  }
  if (film.clock.mode === "sfx") {
    for (const cue of film.clock.cues) {
      if (cue.at >= film.duration) {
        errors.push({
          code: "cue_outside_film",
          message: `sfx cue "${cue.id}" at ${cue.at}s is outside the film`,
        });
      }
    }
  }
  if (film.clock.mode === "realtime" && film.clock.zero >= film.duration) {
    errors.push({
      code: "clock_zero",
      message: `zero point ${film.clock.zero}s is outside the film`,
    });
  }
}

function checkCaptions(
  film: FilmScore,
  capabilities: Capabilities,
  errors: TreatmentIssue[],
) {
  const narration =
    film.clock.mode === "narration" ? film.clock.lines : undefined;
  const byId = new Map(narration?.map((line) => [line.id, line]) ?? []);
  for (const caption of film.captions.lines) {
    if (caption.end <= caption.start) {
      errors.push({
        code: "caption_order",
        message: `caption "${caption.id}" ends before it starts`,
      });
    }
    if (caption.end > film.duration + 0.001) {
      errors.push({
        code: "caption_outside_film",
        message: `caption "${caption.id}" ends after ${film.duration}s`,
      });
    }
    const words = caption.text.trim().split(/\s+/).filter(Boolean).length;
    if (words > capabilities.limits.maxWords) {
      errors.push({
        code: "caption_words",
        message: `caption "${caption.id}" has ${words} words, limit ${capabilities.limits.maxWords}`,
      });
    }
    if (narration) {
      const line = byId.get(caption.id);
      if (!line) {
        errors.push({
          code: "caption_unknown_line",
          message: `caption "${caption.id}" has no narration line`,
        });
        continue;
      }
      if (caption.text.trim() !== line.text.trim()) {
        errors.push({
          code: "caption_text",
          message: `caption "${caption.id}" does not match its narration line`,
        });
      }
      if (
        caption.start < line.start - 0.001 ||
        caption.end > line.start + line.duration + (line.hold ?? 0) + 0.001
      ) {
        errors.push({
          code: "caption_outside_line",
          message: `caption "${caption.id}" is outside its narration line and hold`,
        });
      }
    }
  }
}

function medianOf(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle] ?? 0;
  return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
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
