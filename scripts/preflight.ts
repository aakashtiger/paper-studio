/**
 * Every cheap check, before a single frame is painted.
 *
 * usage: npm run preflight -- films/<id>/score.json
 *
 * The renderer will not paint a whole film without a fresh, passing report from
 * this command. That is the ordering lesson of the sixteen-hour day: nine full
 * renders produced seven cuts that a one-second check had already rejected, and
 * every one of those checks ran after the expensive step.
 *
 * It reads the film's own documents and nothing else: the story and beats if the
 * film has them, the score it will render, the pose files of its cast, and the
 * rigs its vendor registers. The report is written to `build/<id>/preflight.json`
 * together with the hash of the score it describes, so a stale pass cannot be
 * mistaken for a fresh one.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { preflightFilm, DEFAULT_PACE, type CastFact } from "../src/engine/preflight.js";
import { BeatsSchema, PaceSchema, StorySchema, checkStory, type Issue, type Pace } from "../src/engine/story.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
const json = args.includes("--json");
if (!file) {
  console.error("usage: npm run preflight -- films/<id>/score.json [--json]");
  process.exit(2);
}

const root = process.cwd();
const scorePath = resolve(root, file);
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scorePath, "utf8")));
const filmDir = dirname(scorePath);

/**
 * The pace the film is judged against, and where it came from.
 *
 * A style owns its tempo (a history channel and a K-pop edit do not cut alike),
 * so the order is: the film's own `story.json`, then the style pack's
 * `tokens.json`, then the default band for this idiom. The report names which
 * one was used every time, because a number that decides a refusal must not be
 * anonymous.
 */
function readPace(): { pace: Pace; source: "story" | "style" | "default" } {
  const storyPath = resolve(filmDir, "story.json");
  if (existsSync(storyPath)) {
    const parsed = StorySchema.safeParse(JSON.parse(readFileSync(storyPath, "utf8")));
    if (parsed.success) return { pace: parsed.data.pace, source: "story" };
  }
  const tokensPath = resolve(root, "styles", score.style, "tokens.json");
  if (existsSync(tokensPath)) {
    const tokens = JSON.parse(readFileSync(tokensPath, "utf8")) as { pace?: unknown };
    const parsed = PaceSchema.safeParse(tokens.pace);
    if (parsed.success) return { pace: parsed.data, source: "style" };
  }
  return { pace: DEFAULT_PACE, source: "default" };
}

/** The rigs a film's own vendor registers — the same test the pose sheet makes. */
function registeredRigs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const rigs = new Set<string>();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".js")) continue;
    for (const match of readFileSync(resolve(dir, name), "utf8").matchAll(/CHARACTERS\[["']([^"']+)["']\]\s*=/g)) {
      if (match[1]) rigs.add(match[1]);
    }
  }
  return [...rigs].sort();
}

const rigs = registeredRigs(resolve(root, "films", score.id, "vendor"));
const cast: CastFact[] = score.cast.map((member) => {
  const problems: Issue[] = [];
  const posesPath = resolve(root, member.poses);
  // The cast entry may name its rig, or leave it to the pose library — which is
  // the only other place it is written. Either way the rig that gets checked is
  // the one the film will draw with.
  let rig = member.rig ?? "";
  if (!existsSync(posesPath)) {
    problems.push({
      code: "cast:poses",
      message: `${member.character} has no pose file at ${member.poses} — the film would draw a character it never described`,
    });
  } else {
    const parsed = PoseLibrarySchema.safeParse(JSON.parse(readFileSync(posesPath, "utf8")));
    if (!parsed.success) {
      problems.push({
        code: "cast:poses",
        message: `${member.poses} is not a pose library: ${parsed.error.issues[0]?.message ?? "invalid"}`,
      });
    } else {
      rig = rig || parsed.data.rig;
      for (const issue of resolvePoseLibrary(parsed.data).errors) problems.push(issue);
    }
  }
  if (!rigs.includes(rig)) {
    problems.push({
      code: "cast:rig",
      message:
        `films/${score.id}/vendor does not register the rig "${rig || "(none)"}" for ${member.character}` +
        (rigs.length > 0 ? `; it registers ${rigs.join(", ")}` : "; it registers nothing"),
    });
  }
  return { character: member.character, rig, poses: member.poses, problems };
});

const { pace, source } = readPace();

const storyPath = resolve(filmDir, "story.json");
const beatsPath = resolve(filmDir, "beats.json");
let story: { errors: Issue[]; warnings: Issue[] } | null = null;
if (existsSync(storyPath) || existsSync(beatsPath)) {
  if (!existsSync(storyPath) || !existsSync(beatsPath)) {
    const missing = existsSync(storyPath) ? "beats.json" : "story.json";
    console.error(`error: ${file} has a half-written film — ${missing} is missing beside it`);
    process.exit(1);
  }
  const written = StorySchema.parse(JSON.parse(readFileSync(storyPath, "utf8")));
  const beats = BeatsSchema.parse(JSON.parse(readFileSync(beatsPath, "utf8")));
  const check = checkStory(written, beats);
  story = { errors: check.errors, warnings: check.warnings };
}

const { plan, errors: resolveErrors, warnings: resolveWarnings } = resolveFilm(
  score,
  resolve(root, `styles/${score.style}`),
  root,
);
if (resolveErrors.length > 0) {
  for (const error of resolveErrors) console.error(`error: ${error.message}`);
  process.exit(1);
}
for (const warning of resolveWarnings) console.error(`warning: ${warning.message}`);

/**
 * A film that already has a delivered file is a *reproduction*: re-cutting a
 * finished film is not an act of authorship, and demanding a newly written
 * script for it would only teach everyone to bypass the check. A film with no
 * delivered file has no such excuse.
 */
const reproduce = existsSync(resolve(root, "films", score.id, `${score.id}.mp4`));

const report = preflightFilm({ plan, pace, paceSource: source, story, cast, reproduce });
const scoreHash = `sha256:${createHash("sha256").update(readFileSync(scorePath)).digest("hex")}`;
const written = { ...report, score: scoreHash };
const out = resolve(root, "build", score.id);
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "preflight.json"), `${JSON.stringify(written, null, 2)}\n`, "utf8");

if (json) {
  console.log(JSON.stringify(written, null, 2));
} else {
  console.log(`preflight: ${score.id} · ${report.duration.toFixed(1)}s${report.reproduce ? " · reproduction" : ""}`);
  console.log(
    `  pace      ${report.pace.medianShot[0]}–${report.pace.medianShot[1]}s median · ` +
      `${report.pace.wpm[0]}–${report.pace.wpm[1]} wpm  (from ${report.pace.source})`,
  );
  console.log(
    `  shots     ${report.shots.count} · median ${secs(report.shots.median)} · ` +
      `${report.shots.shortest}–${report.shots.longest}s`,
  );
  if (report.narration) {
    const n = report.narration;
    console.log(
      `  narration ${n.lines} lines · ${n.words} words · ${n.wpm} wpm · speaks ` +
        `${(n.coverage * 100).toFixed(0)}% · longest hole ${secs(n.hole)} at ${secs(n.holeAt)}`,
    );
  } else {
    console.log("  narration none (the clock is not narration)");
  }
  console.log(
    `  sound     ${report.sound.cues} cues · longest ${report.sound.longest ? `${secs(report.sound.longest.seconds)} (${(report.sound.longest.share * 100).toFixed(0)}%) "${report.sound.longest.id}"` : "none"}`,
  );
  console.log(
    `  cast      ${report.cast.length > 0 ? report.cast.map((member) => `${member.character} ${member.rig}`).join(" · ") : "none"}`,
  );
  if (report.warnings.length > 0) {
    console.log("");
    for (const warning of report.warnings) console.log(`  warn  ${warning.message}`);
  }
  if (report.errors.length > 0) {
    console.log("");
    for (const error of report.errors) console.log(`  FAIL  [${error.check}] ${error.message}`);
    console.log("");
    console.log(`preflight: ${report.errors.length} refusal(s) — the film is not ready to paint`);
    console.log(`report: build/${score.id}/preflight.json (written, and it fails)`);
    process.exit(1);
  }
  console.log("");
  console.log(`preflight: PASS — every cheap check is green; the render may start`);
  console.log(`report: build/${score.id}/preflight.json`);
}

function secs(value: number): string {
  return `${value.toFixed(1)}s`;
}

process.exit(report.ok ? 0 : 1);
