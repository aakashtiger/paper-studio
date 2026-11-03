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

const args = process.argv.slice(2);
const scorePath = args.find((arg) => !arg.startsWith("--"));
const json = args.includes("--json");
if (!scorePath) {
  console.error("usage: npm run camera:check -- <score.json> [--json]");
  process.exit(2);
}

const root = process.cwd();
const score = JSON.parse(readFileSync(resolve(root, scorePath), "utf8").replace(/^\uFEFF/, "")) as {
  id: string;
  style: string;
  shots: { id?: string; beat?: string; camera?: { move: string; from: number; to: number; ease: string } }[];
};
const tokensPath = resolve(root, "styles", score.style, "tokens.json");
const tokens = existsSync(tokensPath) ? JSON.parse(readFileSync(tokensPath, "utf8")) : null;
const options = cameraOptionsFromTokens(tokens);
const report = checkCameraPlan(
  score.shots.map((shot, index) => ({
    id: shot.id ?? `s${String(index + 1).padStart(2, "0")}`,
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
