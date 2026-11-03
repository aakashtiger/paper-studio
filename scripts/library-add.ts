/**
 * `library:add` — add one pose or expression to a shared character, once.
 *
 * The alternative is copying a pose file into the next film and editing it
 * there, which is how two versions of the same person appear. This command
 * appends to the library file, validates the whole library, and refuses a
 * duplicate, an empty pose, or a full set.
 *
 * usage:
 *   npm run library:add -- --character kiran --kind pose --from pose.json
 *   npm run library:add -- --character kiran --kind expression --from face.json
 */
import { readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { LibraryIndexSchema, addToLibrary, resolveLibrary, sha256File } from "../src/engine/library.js";

const args = process.argv.slice(2);
function arg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

const character = arg("character");
const kind = arg("kind");
const from = arg("from");
const indexFile = arg("index") ?? "library/characters/index.json";
if (!character || (kind !== "pose" && kind !== "expression") || !from) {
  console.error("usage: npm run library:add -- --character <id> --kind pose|expression --from <file.json> [--index <file>]");
  process.exit(2);
}

const root = process.cwd();
const index = LibraryIndexSchema.parse(JSON.parse(readFileSync(resolve(root, indexFile), "utf8")));
const value = JSON.parse(readFileSync(resolve(root, from), "utf8"));
const result = addToLibrary({ index, root, character, kind, value });
const entry = index.characters.find(
  (item) => item.id.toLowerCase() === character.toLowerCase() || item.name.toLowerCase() === character.toLowerCase(),
);
if (!entry) throw new Error(`no library character "${character}"`);
if (!entry.poses.replace(/\\/g, "/").startsWith("library/")) {
  console.error(`refusing to write outside library/: ${entry.poses}`);
  process.exit(1);
}

// Validate the whole library against a temporary file BEFORE replacing the
// real one. A failure must leave the library byte-identical.
const finalPath = resolve(root, entry.poses);
const tempPath = `${finalPath}.tmp`;
const tempRel = `${entry.poses}.tmp`;
writeFileSync(tempPath, `${JSON.stringify(result.doc, null, 2)}\n`, "utf8");
const tempIndex = {
  ...index,
  characters: index.characters.map((item) => (item.id === entry.id ? { ...item, poses: tempRel } : item)),
};
const report = resolveLibrary(tempIndex, { root });
if (report.errors.length > 0) {
  rmSync(tempPath, { force: true });
  for (const error of report.errors) console.error(`FAIL ${error.code}: ${error.message}`);
  console.error("library:add: refused; the library was not changed");
  process.exit(1);
}

renameSync(tempPath, finalPath);
const hash = sha256File(finalPath);
const version = /(\d+)$/.test(entry.version)
  ? entry.version.replace(/(\d+)$/, (digits) => String(Number(digits) + 1))
  : `${entry.version}.1`;
const nextIndex = {
  ...index,
  characters: index.characters.map((item) => (item.id === entry.id ? { ...item, version, hash } : item)),
};
writeFileSync(resolve(root, indexFile), `${JSON.stringify(nextIndex, null, 2)}\n`, "utf8");

const added = (result.doc as { poses: unknown[]; expressions: unknown[] });
console.log(
  `library:add: ${entry.id} now has ${added.poses.length} poses and ${added.expressions.length} expressions`,
);
console.log(`library:add: wrote ${entry.poses} · version ${version} · ${hash.slice(0, 19)}…`);
console.log(`library:add: updated ${indexFile}`);
