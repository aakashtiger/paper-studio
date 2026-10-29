import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export const AssetTypeSchema = z.enum([
  "character",
  "set",
  "prop",
  "frame",
  "texture",
  "type",
  "hud",
]);

export const AssetRefSchema = z.object({
  id: z.string().min(1),
  type: AssetTypeSchema,
  version: z.string().min(1),
  hash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  source: z.enum(["new", "reused"]),
  anchors: z.array(z.string().min(1)).default([]),
  path: z.string().min(1).optional(),
});

export const AssetManifestSchema = z.array(AssetRefSchema).min(1);

export type AssetRef = z.infer<typeof AssetRefSchema>;
export type AssetIssue = { code: string; message: string; asset?: string };

const CHARACTER_ANCHORS = ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"];

export function resolveAssets(
  assets: AssetRef[],
  options: { root: string },
): { errors: AssetIssue[]; warnings: AssetIssue[] } {
  const errors: AssetIssue[] = [];
  const warnings: AssetIssue[] = [];
  const ids = new Set<string>();

  for (const asset of assets) {
    if (ids.has(asset.id)) {
      errors.push({ code: "asset_duplicate", message: `asset "${asset.id}" is listed twice`, asset: asset.id });
    }
    ids.add(asset.id);

    if (asset.path && !existsSync(resolve(options.root, asset.path))) {
      errors.push({ code: "asset_path", message: `asset path "${asset.path}" does not exist`, asset: asset.id });
    }

    if (asset.type === "character") {
      const missing = CHARACTER_ANCHORS.filter((anchor) => !asset.anchors.includes(anchor));
      if (missing.length > 0) {
        warnings.push({
          code: "asset_anchors",
          message: `character "${asset.id}" is missing anchors: ${missing.join(", ")}`,
          asset: asset.id,
        });
      }
    }
  }

  return { errors, warnings };
}
