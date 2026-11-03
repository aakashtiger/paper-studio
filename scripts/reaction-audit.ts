/**
 * Reaction audit: does the picture wait for the word?
 *
 * Reads the score's clock and every event that carries `word`, and measures the
 * distance from the measured line start to the event. The window is 0–3 frames;
 * earlier than the word fails, later than three frames fails.
 *
 * A narrated film with no word-bound event is **not instrumented**: the check
 * would pass by measuring nothing, which is the one result that looks like
 * success. `--allow-none` exists only for a legacy film being reproduced.
 *
 * usage: npm run audit:reaction -- films/<id>/score.json [--allow-none]
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkReactions } from "../src/engine/reaction.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run audit:reaction -- <score.json> [--allow-none]");
  process.exit(2);
}
const allowNone = args.includes("--allow-none");

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8").replace(/^\uFEFF/, "")));
const resolved = resolveFilm(score, resolve(root, "styles", score.style), root);
if (resolved.errors.length > 0) {
  for (const error of resolved.errors) console.error(`error: ${error.message}`);
  process.exit(1);
}
const lines = resolved.plan.clock.mode === "narration" ? resolved.plan.clock.lines : [];
if (lines.length === 0 && !allowNone) {
  console.error("audit:reaction: the clock is not narration — there is no word to react to (pass --allow-none for a legacy film)");
  process.exit(1);
}
const result = checkReactions(
  resolved.plan.shots.map((shot) => ({
    id: shot.id,
    start: shot.start,
    duration: shot.duration,
    direction: { events: shot.direction.events },
  })),
  lines.map((line) => ({ id: line.id, start: line.start })),
  score.fps,
);
const instrumented = result.reactions.length > 0 || allowNone;
const pass = instrumented && result.findings.length === 0;
const report = {
  film: score.id,
  score: `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`,
  pass,
  instrumented,
  windowFrames: result.windowFrames,
  fps: score.fps,
  reactions: result.reactions.map((reaction) => ({
    ...reaction,
    at: Number(reaction.at.toFixed(3)),
    lineStart: Number(reaction.lineStart.toFixed(3)),
    delta: Number(reaction.delta.toFixed(3)),
    frames: Number(reaction.frames.toFixed(2)),
  })),
  findings: result.findings,
};
mkdirSync(resolve(root, "build", score.id), { recursive: true });
const out = resolve(root, "build", score.id, "reaction-audit.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const reaction of report.reactions) {
  console.log(
    `reaction: ${reaction.shot} ${reaction.kind} → ${reaction.word} at ${reaction.at.toFixed(2)}s ` +
      `(${reaction.frames >= 0 ? "+" : ""}${reaction.frames.toFixed(1)} frames)`,
  );
}
for (const finding of result.findings) console.error(`  FAIL ${finding.code}: ${finding.message}`);
console.log(
  `reaction: ${report.reactions.length} word-bound event(s) · ${result.findings.length} finding(s) · ` +
    `${pass ? "pass" : instrumented ? "FAIL" : "FAIL not instrumented"} · ${out}`,
);
if (!pass) process.exit(1);
