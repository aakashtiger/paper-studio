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
  poses: z.array(PoseSchema).min(8).max(12),
  expressions: z.array(ExpressionSchema).min(4).max(8),
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

  return { errors, warnings };
}
