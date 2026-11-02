import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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
  /**
   * For `type: "character"`, the cast member this asset draws. Until 0035 a
   * character asset was identified only by its path, so nothing could prove the
   * manifest covered the cast the shots stage.
   */
  character: z.string().min(1).optional(),
});

/**
 * Does this asset draw `character`?
 *
 * The declared `character` is authoritative. Older manifests predate it, so the
 * pose library path and then the id are accepted as fallbacks — never the other
 * way round: a new manifest that names the wrong character must not pass because
 * its path looks plausible.
 */
export function assetNamesCharacter(asset: AssetRef, character: string, poses: string): boolean {
  if (asset.type !== "character") return false;
  if (asset.character) return asset.character.toLowerCase() === character.toLowerCase();
  const clean = (value: string) => value.replace(/\\/g, "/").toLowerCase();
  if (asset.path && clean(asset.path) === clean(poses)) return true;
  return asset.id.toLowerCase().includes(character.toLowerCase());
}

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

    if (asset.path) {
      const absolute = resolve(options.root, asset.path);
      if (!existsSync(absolute)) {
        errors.push({ code: "asset_path", message: `asset path "${asset.path}" does not exist`, asset: asset.id });
      } else {
        const actual = `sha256:${createHash("sha256").update(readFileSync(absolute)).digest("hex")}`;
        if (actual !== asset.hash) {
          errors.push({
            code: "asset_hash",
            message: `asset "${asset.id}" hash ${asset.hash} does not match ${actual}`,
            asset: asset.id,
          });
        }
      }
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
