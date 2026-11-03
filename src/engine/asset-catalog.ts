import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import type { AssetRef } from "./assets.js";

/**
 * The plain-name asset catalogue (decision 0042).
 *
 * The score's `assets[]` uses technical ids (`character.lead`, `prop.object`).
 * A person cannot tell from those what exists, what it is called, or where it
 * is drawn. This catalogue gives every built asset a normal name — Bedroom,
 * Office chair, Phone, Anton — and points at the file that draws it. It is a
 * map, not a second manifest: the score still owns what a film uses.
 */

export const AssetKindSchema = z.enum(["character", "rig", "set", "prop", "frame", "texture", "type", "hud", "effect"]);

export const AssetSizeSchema = z.object({
  w: z.number().positive(),
  h: z.number().positive(),
  unit: z.string().min(1).default("px"),
});

export const CatalogEntrySchema = z.object({
  id: z.string().min(1),
  /** The technical ids this plain-name entry maps to, e.g. ["character.lead"]. */
  ids: z.array(z.string().min(1)).default([]),
  /** The name a person reads. */
  name: z.string().min(1),
  type: AssetKindSchema,
  /** Repo-relative file that draws or stores it. */
  where: z.string().min(1),
  size: AssetSizeSchema.optional(),
  /** Recipes that use it, for cross-checking the shot list. */
  recipes: z.array(z.string().min(1)).default([]),
  source: z.string().min(1),
  licence: z.string().min(1),
});

export const AssetCatalogSchema = z.object({
  version: z.number().int().positive(),
  assets: z.array(CatalogEntrySchema).min(1),
});

export type AssetCatalog = z.infer<typeof AssetCatalogSchema>;
export type CatalogEntry = z.infer<typeof CatalogEntrySchema>;

export type CatalogIssue = { code: string; message: string; asset?: string };

export function resolveCatalog(
  catalog: AssetCatalog,
  options: { root: string },
): { entries: CatalogEntry[]; errors: CatalogIssue[]; warnings: CatalogIssue[] } {
  const errors: CatalogIssue[] = [];
  const warnings: CatalogIssue[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  for (const entry of catalog.assets) {
    if (ids.has(entry.id.toLowerCase())) {
      errors.push({ code: "asset:id", message: `asset id "${entry.id}" is declared twice`, asset: entry.id });
    }
    ids.add(entry.id.toLowerCase());
    if (names.has(entry.name.toLowerCase())) {
      errors.push({ code: "asset:name", message: `asset name "${entry.name}" is declared twice`, asset: entry.id });
    }
    names.add(entry.name.toLowerCase());

    if (!existsSync(resolve(options.root, entry.where))) {
      errors.push({
        code: "asset:where",
        message: `${entry.name}: "${entry.where}" does not exist`,
        asset: entry.id,
      });
    }
    if (entry.type === "prop" && !entry.size) {
      warnings.push({
        code: "asset:size",
        message: `${entry.name} has no declared size — a prop without one can be 2.5 men wide`,
        asset: entry.id,
      });
    }
    if (/^(none|unknown|n\/a|tbd|found on the internet)$/i.test(entry.licence.trim())) {
      errors.push({
        code: "asset:licence",
        message: `${entry.name}: "${entry.licence}" is not a licence`,
        asset: entry.id,
      });
    }
    if (entry.type === "character" && !entry.where.replace(/\\/g, "/").startsWith("library/characters/")) {
      errors.push({
        code: "asset:character",
        message: `${entry.name} is not in library/characters/ — a reusable character belongs there`,
        asset: entry.id,
      });
    }
  }

  return { entries: catalog.assets, errors, warnings };
}

export type CoverageReport = {
  required: string[];
  present: string[];
  missing: string[];
  unused: string[];
  /** Recipes a shot names that the style pack does not have. */
  missingRecipes: string[];
};

/**
 * What the shots actually need, versus what the film's manifest lists.
 *
 * A recipe names its assets. A film's `assets[]` is hand-written. Nothing
 * compared the two, so Same Alarm missed six of the eleven its recipes named.
 */
export function checkCoverage(
  score: { assets: { id: string }[]; shots: { recipe: string }[] },
  options: { root: string; styleDir: string },
): CoverageReport {
  const required = new Set<string>();
  const missingRecipes = new Set<string>();
  for (const shot of score.shots) {
    const recipePath = join(options.styleDir, "recipes", `${shot.recipe}.json`);
    if (!existsSync(recipePath)) {
      missingRecipes.add(shot.recipe);
      continue;
    }
    const recipe = JSON.parse(readFileSync(recipePath, "utf8")) as { assets?: string[] };
    for (const id of recipe.assets ?? []) required.add(id);
  }
  const present = new Set(score.assets.map((asset) => asset.id));
  return {
    required: [...required].sort(),
    present: [...present].sort(),
    missing: [...required].filter((id) => !present.has(id)).sort(),
    unused: [...present].filter((id) => !required.has(id)).sort(),
    missingRecipes: [...missingRecipes].sort(),
  };
}

export type DerivedAsset = {
  /** The id the recipe named. */
  required: string;
  entry: CatalogEntry;
  ref: AssetRef;
};

/** The kinds a film's `assets[]` can carry (see AssetRefSchema). */
const REF_TYPES = new Set(["character", "set", "prop", "frame", "texture", "type", "hud"]);

/**
 * Derive the manifest entries a film is missing, from the catalogue.
 *
 * The catalogue is the map; the score is still the manifest. This makes the
 * missing entries explicit and hashes the file that draws each one, so a film
 * cannot claim an asset it does not carry. An id the catalogue does not know is
 * returned in `unknown`; it is never guessed.
 */
export function deriveAssetRefs(
  score: { assets: { id: string }[]; shots: { recipe: string }[] },
  catalog: AssetCatalog,
  options: { root: string; styleDir: string },
): { refs: DerivedAsset[]; unknown: string[]; missingRecipes: string[] } {
  const report = checkCoverage(score, options);
  const refs: DerivedAsset[] = [];
  const unknown: string[] = [];
  for (const id of report.missing) {
    const entry =
      catalog.assets.find((candidate) => candidate.id === id) ??
      catalog.assets.find((candidate) => candidate.ids.includes(id));
    if (!entry) {
      unknown.push(id);
      continue;
    }
    const absolute = resolve(options.root, entry.where);
    if (!existsSync(absolute)) {
      throw new Error(`${entry.name} points at "${entry.where}", which does not exist`);
    }
    if (!REF_TYPES.has(entry.type)) {
      throw new Error(`${entry.name} is a "${entry.type}"; a film manifest cannot carry that kind yet`);
    }
    const hash = `sha256:${createHash("sha256").update(readFileSync(absolute)).digest("hex")}`;
    refs.push({
      required: id,
      entry,
      ref: {
        id,
        version: "0.1.0",
        hash,
        source: "reused",
        type: entry.type as AssetRef["type"],
        anchors: [],
        path: entry.where,
        ...(entry.type === "character" ? { character: entry.name } : {}),
      },
    });
  }
  return { refs, unknown, missingRecipes: report.missingRecipes };
}
