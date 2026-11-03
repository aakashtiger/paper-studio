/**
 * `camera:check` — every shot moves, and the film does not repeat one move.
 *
 * The style's tokens declare the grammar (`requireMove`, `minDistinct`,
 * `maxRun`). This command reads the score and the style, and refuses a still
 * frame, a move with no travel, a wrong push/pull sign, too little variety, or a
 * run of the same move.
 *
 * usage: npm run camera:check -- films/<id>/score.json [--json]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { checkCameraPlan, cameraOptionsFromTokens } from "../src/engine/camera.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const scorePath = args.find((arg) => !arg.startsWith("--"));
const json = args.includes("--json");
if (!scorePath) {
  console.error("usage: npm run camera:check -- <score.json> [--json]");
  process.exit(2);
}

const root = process.cwd();
// The renderer paints the **resolved** score, so the check must read that:
// a shot with no camera block inherits the recipe's move. Reading the raw score
// called Same Alarm's corridor pan a missing camera.
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8").replace(/^\uFEFF/, "")));
const resolved = resolveFilm(score, resolve(root, "styles", score.style), root);
if (resolved.errors.length > 0) {
  for (const error of resolved.errors) console.error(`error: ${error.message}`);
  process.exit(1);
}
const tokensPath = resolve(root, "styles", score.style, "tokens.json");
const tokens = existsSync(tokensPath) ? JSON.parse(readFileSync(tokensPath, "utf8")) : null;
const options = cameraOptionsFromTokens(tokens);
const report = checkCameraPlan(
  resolved.plan.shots.map((shot) => ({
    id: shot.id,
    beat: shot.beat,
    camera: shot.camera,
  })),
  options,
);

if (json) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`camera: ${score.id} · ${report.shots} shots · ${report.distinct.length} move(s): ${report.distinct.join(", ") || "none"}`);
  console.log(`  longest run ${report.longestRun} · grammar requireMove=${options.requireMove ?? true} minDistinct=${options.minDistinct ?? 3} maxRun=${options.maxRun ?? 2}`);
  for (const warning of report.warnings) console.log(`  warn  ${warning.code}: ${warning.message}`);
  for (const error of report.errors) console.error(`  FAIL  ${error.code}: ${error.message}`);
}
if (report.errors.length > 0) {
  console.error(`camera: ${report.errors.length} refusal(s) — the camera is not a moving template yet`);
  process.exit(1);
}
console.log("camera: pass — every shot moves and the film varies its moves");
