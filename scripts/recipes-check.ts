/**
 * `recipes:check` — every recipe a pack *declares* must have a painter that
 * *draws* it.
 *
 * A recipe JSON is a promise to a director: "this pack can draw a phone route."
 * `recipes:list` prints that promise. Nothing checked that the canvas kept it —
 * so a shot could name `type_stack` and the film would fail at frame 1, or worse,
 * the pack would quietly carry forty recipes that only exist inside one film's
 * `vendor/` folder.
 *
 * This command reads the declared ids from `styles/<style>/recipes/*.json`, reads
 * the painted ids out of `canvas/recipes.js` (the `PAPER_BACKEND.shots` table:
 * the literal, plus every `Object.assign` block), and prints the difference.
 *
 * usage:
 *   npm run recipes:check               # exit 1 if anything declared is unpainted
 *   npm run recipes:check -- --list     # also print the painters with no recipe
 *   npm run recipes:check -- --style paper-kpop
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const style = flag("style") ?? "paper-kpop";
const showList = args.includes("--list");
const root = process.cwd();
const recipeDir = resolve(root, "styles", style, "recipes");
const canvasPath = resolve(root, "styles", style, "canvas", "recipes.js");

/** Pull the keys of an object literal body: `name: expr,` at any indent. */
function keysOf(body: string): string[] {
  const out: string[] = [];
  for (const match of body.matchAll(/(?:^|[{,\s])([a-z][a-z0-9_]*)\s*:/g)) {
    const key = match[1];
    if (key) out.push(key);
  }
  return out;
}

/** Every object body passed to Object.assign(window.PAPER_BACKEND.shots, …). */
function assignBodies(src: string): string[] {
  const bodies: string[] = [];
  const needle = "PAPER_BACKEND.shots";
  let from = 0;
  for (;;) {
    const at = src.indexOf(needle, from);
    if (at === -1) break;
    const open = src.indexOf("{", at);
    if (open === -1) break;
    let depth = 0;
    let end = -1;
    for (let i = open; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end === -1) break;
    bodies.push(src.slice(open + 1, end));
    from = end;
  }
  return bodies;
}

const declared = readdirSync(recipeDir)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.replace(/\.json$/, ""))
  .sort();

const src = readFileSync(canvasPath, "utf8");
const painted = new Set<string>();
// the initial literal: window.PAPER_BACKEND = { shots: { a: f, b: g } };
for (const match of src.matchAll(/PAPER_BACKEND\s*=\s*\{\s*shots\s*:\s*\{([\s\S]*?)\}\s*,?\s*\}/g)) {
  for (const key of keysOf(match[1] ?? "")) painted.add(key);
}
// every later Object.assign(window.PAPER_BACKEND.shots, { … })
for (const body of assignBodies(src)) for (const key of keysOf(body)) painted.add(key);

const missing = declared.filter((id) => !painted.has(id));
const extra = [...painted].filter((id) => !declared.includes(id)).sort();

console.log(`pack            styles/${style}`);
console.log(`declared        ${declared.length} recipe jsons`);
console.log(`painted         ${painted.size} entries in PAPER_BACKEND.shots`);
console.log(`unpainted       ${missing.length}`);
if (missing.length) {
  for (const id of missing) console.log(`  - ${id}`);
}
if (showList && extra.length) {
  console.log(`painted with no recipe json (${extra.length}):`);
  for (const id of extra) console.log(`  + ${id}`);
}

if (missing.length) {
  console.log("");
  console.log("FAIL a recipe the pack declares cannot be drawn");
  process.exit(1);
}
console.log("");
console.log("PASS every declared recipe has a painter");
