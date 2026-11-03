/**
 * `assets:new` — turn the assets the recipes name into the film's manifest.
 *
 * The score's `assets[]` is hand-written; a recipe names its own assets. Nothing
 * compared the two, so Same Alarm shipped missing six of the eleven its shots
 * draw. This command derives the missing entries from the plain-name catalogue,
 * hashes the file that draws each one, and either prints the proposal or writes
 * it with `--write`. It never invents an asset: a name the catalogue does not
 * know is a refusal, not a placeholder.
 *
 * usage: npm run assets:new -- --score films/<id>/score.json [--write]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { AssetCatalogSchema, deriveAssetRefs } from "../src/engine/asset-catalog.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const scoreArg = args[args.indexOf("--score") + 1];
const write = args.includes("--write");
if (!args.includes("--score") || !scoreArg) {
  console.error("usage: npm run assets:new -- --score <score.json> [--write]");
  process.exit(2);
}

const root = process.cwd();
const scorePath = resolve(root, scoreArg);
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scorePath, "utf8").replace(/^\uFEFF/, "")));
const catalog = AssetCatalogSchema.parse(
  JSON.parse(readFileSync(resolve(root, "library/assets/index.json"), "utf8").replace(/^\uFEFF/, "")),
);
const styleDir = resolve(root, "styles", score.style);
const derived = deriveAssetRefs(score, catalog, { root, styleDir });

if (derived.missingRecipes.length > 0) {
  for (const recipe of derived.missingRecipes) console.error(`error: the style has no recipe "${recipe}"`);
  process.exit(1);
}
if (derived.unknown.length > 0) {
  for (const id of derived.unknown) console.error(`  UNKNOWN ${id} — the catalogue has no plain-name entry`);
  console.error(`assets:new: ${derived.unknown.length} asset(s) cannot be derived; add them to library/assets/index.json first`);
  process.exit(1);
}
if (derived.refs.length === 0) {
  console.log(`assets:new: ${score.id} · every recipe asset is already in the manifest`);
  process.exit(0);
}

console.log(`assets:new: ${score.id} · ${derived.refs.length} missing asset(s)`);
for (const { entry, ref, required } of derived.refs) {
  console.log(`  + ${entry.name} (${required}) ← ${entry.where} ${ref.hash.slice(0, 19)}…`);
}
if (!write) {
  console.log("assets:new: dry run; pass --write to add them to the score");
  process.exit(0);
}

const proposed = FilmScoreSchema.parse({
  ...score,
  assets: [...score.assets, ...derived.refs.map(({ ref }) => ref)],
});
const resolved = resolveFilm(proposed, styleDir, root);
if (resolved.errors.length > 0) {
  for (const error of resolved.errors) console.error(`error: ${error.message}`);
  console.error("assets:new: the proposed manifest does not resolve; nothing was written");
  process.exit(1);
}
writeFileSync(scorePath, `${JSON.stringify(proposed, null, 2)}\n`, "utf8");
console.log(`assets:new: wrote ${scoreArg}; ${proposed.assets.length} assets now`);
