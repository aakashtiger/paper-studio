/**
 * `visual:check` — was the picture asked for before it was painted?
 *
 * Reads the score's `shots[].visual`, the pack's recipe `subjects`, and the
 * score's clock lines. Refuses a missing visual brief, a line that does not
 * exist, a one-word reason, a recipe that cannot draw the named subject, a
 * default opening card, and one recipe doing more than 40% of the film.
 *
 * usage: npm run visual:check -- films/<id>/score.json
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FilmScoreSchema } from "../src/engine/treatment.js";
import { ScenesSchema } from "../src/engine/scenes.js";
import { checkVisuals, type RecipeVisual } from "../src/engine/visual.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run visual:check -- <score.json>");
  process.exit(2);
}
const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8").replace(/^\uFEFF/, "")));
const recipeDir = resolve(root, "styles", score.style, "recipes");
if (!existsSync(recipeDir)) {
  console.error(`visual:check: no recipes at styles/${score.style}/recipes`);
  process.exit(1);
}
const recipes: RecipeVisual[] = readdirSync(recipeDir)
  .filter((name) => name.endsWith(".json"))
  .map((name) => {
    const doc = JSON.parse(readFileSync(join(recipeDir, name), "utf8")) as {
      id: string;
      subjects?: string[];
      openingDefault?: boolean;
    };
    return { id: doc.id, subjects: doc.subjects, openingDefault: doc.openingDefault === true };
  });
const lines = score.clock.mode === "narration" ? score.clock.lines : [];
const scenesPath = resolve(root, "films", score.id, "scenes.json");
const scenes = existsSync(scenesPath)
  ? ScenesSchema.parse(JSON.parse(readFileSync(scenesPath, "utf8").replace(/^\uFEFF/, ""))).scenes
  : undefined;
const shots = score.shots.map((shot, index) => ({
  id: `s${String(index + 1).padStart(2, "0")}`,
  recipe: shot.recipe,
  beat: shot.beat,
  scene: shot.scene,
  visual: shot.visual,
}));
const result = checkVisuals(shots, recipes, lines, scenes);
const report = {
  film: score.id,
  score: `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`,
  pass: result.findings.length === 0,
  shots: shots.length,
  checked: result.checked,
  recipes: result.recipes,
  scenes: result.scenes,
  findings: result.findings,
};
mkdirSync(resolve(root, "build", score.id), { recursive: true });
const out = resolve(root, "build", score.id, "visual-check.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const shot of shots) {
  console.log(
    `visual: ${shot.id.padEnd(4)} ${shot.recipe.padEnd(14)} ${shot.visual ? `"${shot.visual.shows}"` : "NO BRIEF"}`,
  );
}
for (const finding of result.findings) console.error(`  FAIL ${finding.code}: ${finding.message}`);
console.log(
  `visual: ${result.checked}/${shots.length} shots with a brief · ${recipes.length} recipes · ` +
    `${result.findings.length} finding(s) · ${report.pass ? "pass" : "FAIL"} · ${out}`,
);
if (!report.pass) process.exit(1);
