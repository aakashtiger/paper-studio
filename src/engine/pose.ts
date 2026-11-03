import { z } from "zod";

const ParamSchema = z.union([z.number().finite(), z.array(z.number().finite())]);

export const PoseSchema = z.object({
  name: z.string().min(1),
  params: z.record(ParamSchema),
});

export const ExpressionSchema = z.object({
  name: z.string().min(1),
  params: z.record(ParamSchema),
});

export const PoseLibrarySchema = z.object({
  character: z.string().min(1),
  rig: z.string().min(1),
  anchors: z.array(z.string().min(1)).default([]),
  /** Palette roles or explicit values; the sheet resolves roles through PAL. */
  colors: z.record(z.string()).default({}),
  poses: z.array(PoseSchema).min(8).max(12),
  /**
   * 4-16 expressions. The shared library carries 14, so a character can be
   * reused with the same face set; a film-specific library may carry the four
   * a shot needs. The renderer only uses an expression when a shot names it.
   */
  expressions: z.array(ExpressionSchema).min(4).max(16),
});

export type PoseLibrary = z.infer<typeof PoseLibrarySchema>;
export type PoseIssue = { code: string; message: string };

export function resolvePoseLibrary(library: PoseLibrary): { errors: PoseIssue[]; warnings: PoseIssue[] } {
  const errors: PoseIssue[] = [];
  const warnings: PoseIssue[] = [];

  const poseNames = new Set<string>();
  for (const pose of library.poses) {
    if (poseNames.has(pose.name)) {
      errors.push({ code: "pose_duplicate", message: `pose "${pose.name}" is duplicated` });
    }
    poseNames.add(pose.name);
    if (Object.keys(pose.params).length === 0) {
      errors.push({ code: "pose_empty", message: `pose "${pose.name}" has no parameters` });
    }
  }

  const expressionNames = new Set<string>();
  for (const expression of library.expressions) {
    if (expressionNames.has(expression.name)) {
      errors.push({ code: "expression_duplicate", message: `expression "${expression.name}" is duplicated` });
    }
    expressionNames.add(expression.name);
  }

  if (library.anchors.length === 0) {
    warnings.push({ code: "pose_anchors", message: `"${library.character}" has no anchors` });
  }

  for (let i = 0; i < library.poses.length; i++) {
    for (let j = i + 1; j < library.poses.length; j++) {
      const a = library.poses[i];
      const b = library.poses[j];
      if (!a || !b) continue;
      if (poseDistance(a, b) < 0.12) {
        warnings.push({
          code: "pose_similar",
          message: `poses "${a.name}" and "${b.name}" are too close in silhouette`,
        });
      }
    }
  }

  return { errors, warnings };
}

function poseDistance(a: z.infer<typeof PoseSchema>, b: z.infer<typeof PoseSchema>): number {
  const keys = ["armL", "armR", "legL", "legR"];
  let sum = 0;
  let count = 0;
  for (const key of keys) {
    const av = a.params[key];
    const bv = b.params[key];
    if (Array.isArray(av) && Array.isArray(bv)) {
      for (let i = 0; i < Math.max(av.length, bv.length); i++) {
        const d = (av[i] ?? 0) - (bv[i] ?? 0);
        sum += d * d;
        count += 1;
      }
    }
  }
  for (const key of ["lean", "headTurn", "bounce", "sway"]) {
    const av = a.params[key];
    const bv = b.params[key];
    if (typeof av === "number" && typeof bv === "number") {
      const d = av - bv;
      sum += d * d;
      count += 1;
    }
  }
  return count === 0 ? 0 : Math.sqrt(sum / count);
}
