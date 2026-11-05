/**
 * `visual:check` — was the picture asked for before it was painted?
 *
 * Reads the score's `shots[].visual`, the pack's recipe `subjects`, and the
 * score's clock lines. Refuses a missing phrase or device, a phrase outside the
 * linked line or its shot's measured words, a repeated phrase/shows/device, a
 * near-identical action, a recipe used twice, and a staged body the words do
 * not need.
 *
 * usage: npm run visual:check -- films/<id>/score.json
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FilmScoreSchema } from "../src/engine/treatment.js";
import { ScenesSchema } from "../src/engine/scenes.js";
import { checkVisuals, VISUAL_CONTRACT_VERSION, type RecipeVisual } from "../src/engine/visual.js";

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
const wordsPath = resolve(root, "films", score.id, "words.json");
const timedWords = existsSync(wordsPath)
  ? (JSON.parse(readFileSync(wordsPath, "utf8")) as { words?: { w: string; start: number; end: number }[] }).words
  : undefined;
let clock = 0;
const shots = score.shots.map((shot, index) => {
  const entry = {
    id: `s${String(index + 1).padStart(2, "0")}`,
    recipe: shot.recipe,
    beat: shot.beat,
    scene: shot.scene,
    cast: shot.direction.cast,
    start: clock,
    duration: shot.duration,
    visual: shot.visual,
    direction: { events: shot.direction.events },
  };
  clock += shot.duration;
  return entry;
});
const contract = (score as { visualContract?: number }).visualContract ?? 2;
const tokensPath = resolve(root, "styles", score.style, "tokens.json");
const motion = existsSync(tokensPath)
  ? (JSON.parse(readFileSync(tokensPath, "utf8").replace(/^\uFEFF/, "")) as {
      identity?: { motion?: { minPoseGapSeconds?: number; maxFirstPoseSeconds?: number } };
    }).identity?.motion
  : undefined;
const result = checkVisuals(
  shots,
  recipes,
  lines.map((line) => ({ id: line.id, text: line.text })),
  scenes,
  timedWords,
  {
    contract,
    minPoseGapSeconds: motion?.minPoseGapSeconds,
    maxFirstPoseSeconds: motion?.maxFirstPoseSeconds,
  },
);
const report = {
  film: score.id,
  contract,
  score: `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`,
  pass: result.findings.length === 0,
  shots: shots.length,
  checked: result.checked,
  recipes: result.recipes,
  scenes: result.scenes,
  staged: result.staged,
  phrases: result.phrases,
  signatures: result.signatures,
  findings: result.findings,
};
mkdirSync(resolve(root, "build", score.id), { recursive: true });
const out = resolve(root, "build", score.id, "visual-check.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const shot of shots) {
  const phrase = shot.visual?.phrase ? `"${shot.visual.phrase}"` : "NO PHRASE";
  const device = shot.visual?.device ? `[${shot.visual.device}]` : "[NO DEVICE]";
  console.log(
    `visual: ${shot.id.padEnd(4)} ${shot.recipe.padEnd(14)} ${device.padEnd(18)} ${phrase}`,
  );
}
for (const finding of result.findings) console.error(`  FAIL ${finding.code}: ${finding.message}`);
console.log(
  `visual: contract ${contract} · ${result.checked}/${shots.length} briefs · ` +
    `${result.staged} staged · ${result.phrases} phrase(s) · ${recipes.length} recipes · ` +
    `${result.findings.length} finding(s) · ${report.pass ? "pass" : "FAIL"} · ${out}`,
);
if (!report.pass) process.exit(1);
