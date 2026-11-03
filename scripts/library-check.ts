/**
 * `library:check` — the shared character/pose library must be legal before a
 * film points at it.
 *
 * A reusable character is a promise: the pose file exists, the name and rig
 * match the index, the poses are distinct, and there are enough expressions to
 * be worth reusing. This command refuses an index that breaks the promise.
 *
 * usage: npm run library:check -- [library/characters/index.json] [--json]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LibraryIndexSchema, resolveLibrary } from "../src/engine/library.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--")) ?? "library/characters/index.json";
const json = args.includes("--json");
const root = process.cwd();
const path = resolve(root, file);

const index = LibraryIndexSchema.parse(JSON.parse(readFileSync(path, "utf8")));
const report = resolveLibrary(index, { root });

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`library: ${report.characters.length} character(s) · ${file}`);
  for (const character of report.characters) {
    console.log(
      `  ${character.id.padEnd(10)} ${character.name.padEnd(10)} ${character.rig.padEnd(18)} ` +
        `${character.posesCount} poses · ${character.expressionsCount} expressions · ${character.licence}`,
    );
  }
  for (const warning of report.warnings) console.log(`  warn  ${warning.code}: ${warning.message}`);
  for (const error of report.errors) console.error(`  FAIL  ${error.code}: ${error.message}`);
}

if (report.errors.length > 0) {
  console.error(`library: ${report.errors.length} refusal(s) — the library is not reusable yet`);
  process.exit(1);
}
console.log("library: pass — every character is a versioned, licensed pose file");
