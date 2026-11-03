/**
 * `library:use` — point a film's cast at a shared library character.
 *
 * This is the action that makes the library reusable: one command rewrites the
 * film's `cast[].poses` and its character asset to the library file, with the
 * pinned version and hash. It validates the score before writing, and it is a
 * dry run unless `--apply` is given.
 *
 * usage:
 *   npm run library:use -- --score films/<id>/score.json --character kiran [--apply]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { LibraryIndexSchema, resolveLibrary, sha256File } from "../src/engine/library.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";

const args = process.argv.slice(2);
function arg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

const scorePath = arg("score");
const character = arg("character");
const apply = args.includes("--apply");
if (!scorePath || !character) {
  console.error("usage: npm run library:use -- --score <score.json> --character <id> [--apply]");
  process.exit(2);
}

const root = process.cwd();
const indexFile = resolve(root, "library/characters/index.json");
const index = LibraryIndexSchema.parse(JSON.parse(readFileSync(indexFile, "utf8")));
const library = resolveLibrary(index, { root });
if (library.errors.length > 0) {
  for (const error of library.errors) console.error(`FAIL ${error.code}: ${error.message}`);
  process.exit(1);
}
const entry = index.characters.find(
  (item) => item.id.toLowerCase() === character.toLowerCase() || item.name.toLowerCase() === character.toLowerCase(),
);
if (!entry) throw new Error(`no library character "${character}"`);

const scoreFile = resolve(root, scorePath);
const raw = JSON.parse(readFileSync(scoreFile, "utf8")) as {
  cast?: { character: string; poses: string; rig?: string }[];
  assets?: Record<string, unknown>[];
};
const cast = (raw.cast ?? []).find((member) => member.character.toLowerCase() === entry.name.toLowerCase());
if (!cast) {
  throw new Error(
    `the score has no cast member "${entry.name}" — it has ${(raw.cast ?? []).map((member) => member.character).join(", ") || "none"}`,
  );
}
// The film's vendor draws with cast[].rig; without it preflight falls back to the
// library rig and the painter throws at frame 1. Carry it, or refuse a mismatch.
if (!cast.rig) cast.rig = entry.rig;
else if (cast.rig !== entry.rig) {
  console.error(`error: ${cast.character} is rig "${cast.rig}" but the library character is "${entry.rig}"`);
  process.exit(1);
}

const poseLibrary = PoseLibrarySchema.parse(JSON.parse(readFileSync(resolve(root, entry.poses), "utf8")));
const poseReport = resolvePoseLibrary(poseLibrary);
if (poseReport.errors.length > 0) {
  for (const error of poseReport.errors) console.error(`FAIL ${error.code}: ${error.message}`);
  process.exit(1);
}
const hash = entry.hash ?? sha256File(resolve(root, entry.poses));
const oldPoses = cast.poses;
cast.poses = entry.poses;

raw.assets = raw.assets ?? [];
const asset = raw.assets.find(
  (item) =>
    item.type === "character" &&
    (String(item.character ?? "").toLowerCase() === entry.name.toLowerCase() ||
      item.path === oldPoses ||
      String(item.id ?? "").toLowerCase().includes(entry.id.toLowerCase())),
);
if (asset) {
  asset.path = entry.poses;
  asset.hash = hash;
  asset.version = entry.version;
  asset.character = entry.name;
  asset.source = "reused";
} else {
  raw.assets.push({
    id: `character.${entry.id}`,
    type: "character",
    version: entry.version,
    hash,
    source: "reused",
    anchors: poseLibrary.anchors,
    path: entry.poses,
    character: entry.name,
  });
}

const parsed = FilmScoreSchema.safeParse(raw);
if (!parsed.success) {
  const first = parsed.error.issues[0];
  console.error(`error: ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}`);
  process.exit(1);
}
const resolved = resolveFilm(parsed.data, resolve(root, `styles/${parsed.data.style}`), root);
if (resolved.errors.length > 0) {
  for (const error of resolved.errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const assetLine = (asset ?? raw.assets[raw.assets.length - 1]) as { id: string; path: string };
console.log(`library:use: ${entry.name} -> ${entry.poses} (${entry.version}, ${hash.slice(0, 19)}…)`);
console.log(`library:use: asset ${assetLine.id} -> ${assetLine.path}`);
if (!apply) {
  console.log("library:use: dry run; pass --apply to write the score");
  process.exit(0);
}
writeFileSync(scoreFile, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
console.log(`library:use: wrote ${scorePath}`);
console.log(`library:use: run \`npm run embed -- ${scorePath}\`; the page data is now stale`);
