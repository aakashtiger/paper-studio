/**
 * The first screen of a film: the writing.
 *
 * usage: npm run story -- films/<id>/story.json
 *
 * Reads `story.json` and the `beats.json` beside it and prints the whole shape of
 * the film in the units a viewer uses — how many words a minute it speaks, how
 * long each beat is, how much of it each beat is allowed to be silent for — then
 * refuses the writing if it cannot be filmed. Nothing here renders anything, so
 * the whole check costs a second instead of a day.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { BeatsSchema, StorySchema, checkStory } from "../src/engine/story.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run story -- films/<id>/story.json [--json]");
  process.exit(2);
}

const root = process.cwd();
const storyPath = resolve(root, file);
const story = StorySchema.parse(JSON.parse(readFileSync(storyPath, "utf8")));
const beatsPath = resolve(dirname(storyPath), "beats.json");
if (!existsSync(beatsPath)) {
  console.error(`error: ${file} has no beats.json beside it — the script's beats are not written`);
  process.exit(1);
}
const beats = BeatsSchema.parse(JSON.parse(readFileSync(beatsPath, "utf8")));
const { errors, warnings, report } = checkStory(story, beats);

const bar = (energy: number) => "▁▂▃▄▅".slice(Math.max(0, energy - 1), Math.max(1, energy));

console.log(`story: ${story.title} · ${story.id}`);
console.log(`  ${story.duration.toFixed(1)}s · ${report.words} words · ${report.wpm.toFixed(0)} wpm ` +
  `(band ${report.wpmBand[0]}–${report.wpmBand[1]}) · median shot ${report.medianShotBand[0]}–${report.medianShotBand[1]}s`);
console.log("");
console.log("SPINE");
console.log(`  want      ${story.spine.want}`);
console.log(`  obstacle  ${story.spine.obstacle}`);
console.log(`  turn      ${story.spine.turn}`);
console.log(`  button    ${story.spine.button}`);
console.log("");
console.log("BEATS");
for (const row of report.beats) {
  const { beat } = row;
  const unit = beat.sound.quiet ? "quiet" : "scored";
  console.log(
    `  ${beat.id}  ${row.seconds.toFixed(1).padStart(5)}s  ${bar(beat.energy)}  ` +
      `${beat.purpose.padEnd(8)} ${row.words.toString().padStart(3)}w  ${unit.padEnd(6)} ${beat.title}`,
  );
  console.log(`        world      ${beat.sound.world}`);
  console.log(`        signature  ${beat.sound.signature}`);
}
console.log("");
console.log("NARRATION");
for (const line of story.narration) {
  const seconds = (line.text.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []).length / (report.wpmBand[0] / 60);
  console.log(`  ${line.id}  ${seconds.toFixed(1).padStart(5)}s  ${line.beat}  "${line.text}"`);
}
console.log("");
console.log("BALANCE  (time share vs word share)");
for (const row of report.balance) {
  const time = `${(row.timeShare * 100).toFixed(0)}%`.padStart(4);
  const word = `${(row.wordShare * 100).toFixed(0)}%`.padStart(4);
  const drift = Math.abs(row.timeShare - row.wordShare) > 0.1 ? "  ← air" : "";
  console.log(`  ${row.beat}  time ${time}  words ${word}${drift}`);
}

if (warnings.length > 0) {
  console.log("");
  for (const warning of warnings) console.log(`  warn  ${warning.message}`);
}
if (errors.length > 0) {
  console.log("");
  for (const error of errors) console.log(`  FAIL  ${error.message}`);
  console.log("");
  console.log(`story: ${errors.length} refusal(s) — the film is not written yet`);
  process.exit(1);
}

const outDir = resolve(root, "build", story.id);
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "story-report.json"), `${JSON.stringify({ ...report, errors, warnings }, null, 2)}\n`, "utf8");
console.log("");
console.log(`story: PASS — ${report.words} words · ${report.beats.length} beats · ${story.narration.length} lines`);
console.log(`report: build/${story.id}/story-report.json`);
