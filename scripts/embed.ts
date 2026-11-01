/**
 * Generate `films/<id>/score-data.js`: the resolved plan and the pose libraries,
 * as the film page reads them.
 *
 * The renderer paints from this file, so it is generated and checked, never
 * hand-edited — `src/engine/score-data.ts` produces the text, this writes it, and
 * `gate:7`'s `scoreData` row regenerates it from `score.json` and compares bytes.
 *
 * usage: npm run embed -- films/understudy/score.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { scoreDataPath, scoreDataText } from "../src/engine/score-data.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run embed -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = JSON.parse(readFileSync(resolve(root, file), "utf8")) as { id: string };

// One implementation of the text: `gate:7` regenerates it with the same
// function and compares, so this file cannot drift from the score unnoticed.
let text: string;
try {
  text = scoreDataText(root, file);
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

writeFileSync(scoreDataPath(root, score.id), text, "utf8");
console.log(`embed: films/${score.id}/score-data.js`);
