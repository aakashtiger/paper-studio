/**
 * `assets` — the plain-name catalogue, and whether a film's shots are covered.
 *
 *   npm run assets:list
 *   npm run assets:check
 *   npm run assets:coverage -- films/<id>/score.json
 *
 * `list` is for a person: Bedroom, Office chair, Phone, Anton. `check` refuses
 * a missing file, a duplicate, a character outside the library, and warns on a
 * prop without a size. `coverage` compares the assets the recipes name with the
 * film's manifest and refuses a missing one.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AssetCatalogSchema,
  checkCoverage,
  resolveCatalog,
} from "../src/engine/asset-catalog.js";

const args = process.argv.slice(2);
const command = args[0] ?? "list";
const json = args.includes("--json");
const root = process.cwd();
const catalogPath = resolve(root, "library/assets/index.json");
if (!existsSync(catalogPath)) {
  console.error("error: library/assets/index.json is missing");
  process.exit(2);
}
const catalog = AssetCatalogSchema.parse(JSON.parse(readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, "")));

if (command === "list") {
  if (json) console.log(JSON.stringify(catalog, null, 2));
  else {
    console.log(`assets: ${catalog.assets.length} built assets`);
    console.log(`${"name".padEnd(24)} ${"type".padEnd(10)} ${"size".padEnd(12)} used by`);
    for (const entry of catalog.assets) {
      const size = entry.size ? `${entry.size.w}×${entry.size.h}${entry.size.unit}` : "—";
      const used = entry.recipes.length > 0 ? entry.recipes.join(", ") : "—";
      console.log(`${entry.name.padEnd(24)} ${entry.type.padEnd(10)} ${size.padEnd(12)} ${used}`);
    }
    console.log(`where: ${catalogPath}`);
  }
  process.exit(0);
}

if (command === "check") {
  const report = resolveCatalog(catalog, { root });
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`assets:check: ${report.entries.length} assets from ${catalogPath}`);
    for (const warning of report.warnings) console.log(`  warn  ${warning.code}: ${warning.message}`);
    for (const error of report.errors) console.error(`  FAIL  ${error.code}: ${error.message}`);
  }
  if (report.errors.length > 0) {
    console.error(`assets:check: ${report.errors.length} refusal(s)`);
    process.exit(1);
  }
  console.log("assets:check: pass — every asset has a file, a name and a licence");
  process.exit(0);
}

if (command === "coverage") {
  const scorePath = args[1];
  if (!scorePath) {
    console.error("usage: npm run assets:coverage -- <score.json>");
    process.exit(2);
  }
  const score = JSON.parse(readFileSync(resolve(root, scorePath), "utf8").replace(/^\uFEFF/, "")) as {
    id: string;
    style: string;
    assets: { id: string }[];
    shots: { recipe: string }[];
  };
  const report = checkCoverage(score, {
    root,
    styleDir: resolve(root, "styles", score.style),
  });
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`assets:coverage: ${score.id} · ${report.required.length} named by the recipes, ${report.present.length} in the manifest`);
    if (report.missing.length > 0) for (const id of report.missing) console.error(`  MISSING ${id}`);
    if (report.unused.length > 0) for (const id of report.unused) console.log(`  unused  ${id}`);
  }
  if (report.missing.length > 0) {
    console.error(`assets:coverage: ${report.missing.length} asset(s) the shots use are not in the film's assets[]`);
    process.exit(1);
  }
  console.log("assets:coverage: pass — every recipe asset is in the manifest");
  process.exit(0);
}

console.error("usage: npm run assets:list | assets:check | assets:coverage -- <score.json>");
process.exit(2);
