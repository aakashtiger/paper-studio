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
import { assetNamesCharacter } from "../src/engine/assets.js";
import type { CutBeat } from "../src/engine/cut.js";
import { preflightFilm, DEFAULT_PACE, measureWords, type CastFact, type MeasuredNarration } from "../src/engine/preflight.js";
import { ScenesSchema, checkScenes } from "../src/engine/scenes.js";
import {
  BeatsSchema,
  PaceSchema,
  StorySchema,
  checkNarrationSync,
  checkStory,
  checkStoryDuration,
  type Beats,
  type Issue,
  type Pace,
  type Story,
} from "../src/engine/story.js";
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
  return {
    character: member.character,
    rig,
    poses: member.poses,
    asset: score.assets.some((ref) => assetNamesCharacter(ref, member.character, member.poses)),
    problems,
  };
});

const { pace, source } = readPace();

const storyPath = resolve(filmDir, "story.json");
const beatsPath = resolve(filmDir, "beats.json");
let story: { errors: Issue[]; warnings: Issue[] } | null = null;
let storyDoc: Story | null = null;
let beatDoc: Beats | null = null;
let beatMap: CutBeat[] | null = null;
if (existsSync(storyPath) || existsSync(beatsPath)) {
  if (!existsSync(storyPath) || !existsSync(beatsPath)) {
    const missing = existsSync(storyPath) ? "beats.json" : "story.json";
    console.error(`error: ${file} has a half-written film — ${missing} is missing beside it`);
    process.exit(1);
  }
  // A scaffold is a real state of the work: `npm run film:new` writes the
  // documents empty of invention on purpose. So a document that is not yet
  // *legal* is a refusal with a sentence, not an exception with a zod path — the
  // director reads it and fills the field it names.
  const writtenDoc = StorySchema.safeParse(JSON.parse(readFileSync(storyPath, "utf8")));
  const beatsDoc = BeatsSchema.safeParse(JSON.parse(readFileSync(beatsPath, "utf8")));
  const invalid: Issue[] = [];
  if (!writtenDoc.success) {
    const first = writtenDoc.error.issues[0];
    invalid.push({
      code: "story:invalid",
      message:
        `story.json is not a story yet — ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}` +
        ` (${writtenDoc.error.issues.length} field(s) to fill; see \`npm run film:new\`)`,
    });
  }
  if (!beatsDoc.success) {
    const first = beatsDoc.error.issues[0];
    invalid.push({
      code: "beats:invalid",
      message:
        `beats.json is not a beat map yet — ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}` +
        ` (${beatsDoc.error.issues.length} field(s) to fill)`,
    });
  }
  if (writtenDoc.success && beatsDoc.success) {
    storyDoc = writtenDoc.data;
    beatDoc = beatsDoc.data;
    const check = checkStory(writtenDoc.data, beatsDoc.data);
    story = { errors: check.errors, warnings: check.warnings };
    beatMap = beatsDoc.data.beats.map((beat) => ({
      id: beat.id,
      title: beat.title,
      share: beat.share,
      sound: { signature: beat.sound.signature, quiet: beat.sound.quiet },
    }));
  } else {
    story = { errors: invalid, warnings: [] };
  }
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

/**
 * Stage 3 — the scenes (decision 0035).
 *
 * A film with a story and beats but no scenes skipped the stage between them:
 * the shots have no high-level screen to answer, and the order the repository
 * promises is not the order it enforces. A delivered film is a reproduction and
 * may predate the stage; a new film may not.
 */
const scenesPath = resolve(filmDir, "scenes.json");
let sceneCheck: { errors: Issue[]; warnings: Issue[] } | undefined;
let sceneDocs: { id: string; beat: string; duration: number }[] | null = null;
let sceneSource: "authored" | "derived" | "missing" = "missing";
if (storyDoc && beatDoc) {
  if (!existsSync(scenesPath)) {
    const issue: Issue = {
      code: "scenes:missing",
      message:
        "no scenes.json — the film jumps from the beat map to the shot list, so no scene was ever " +
        "staged: no place, no cast, no lines, no seconds",
    };
    sceneCheck = reproduce ? { errors: [], warnings: [issue] } : { errors: [issue], warnings: [] };
  } else {
    const parsed = ScenesSchema.safeParse(JSON.parse(readFileSync(scenesPath, "utf8")));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      sceneCheck = {
        errors: [
          {
            code: "scenes:invalid",
            message:
              `scenes.json is not a scene list yet — ${first?.path.join(".") || "(root)"}: ` +
              `${first?.message ?? "invalid"} (${parsed.error.issues.length} field(s) to fill; see \`npm run film:new\`)`,
          },
        ],
        warnings: [],
      };
    } else {
      const check = checkScenes(
        parsed.data,
        storyDoc,
        beatDoc,
        plan.clock.mode === "narration" ? plan.clock.lines : undefined,
        plan.cast.map((member) => member.character),
      );
      sceneCheck = { errors: check.errors, warnings: check.warnings };
      sceneDocs = parsed.data.scenes.map((scene) => ({ id: scene.id, beat: scene.beat, duration: scene.duration }));
      sceneSource = "authored";
    }
  }

  // The score must speak the story's words (0035). Two documents that each look
  // valid can still disagree about what the film says.
  if (plan.clock.mode === "narration" && story) {
    story.errors.push(...checkNarrationSync(storyDoc, plan.clock.lines));
  }
}

/**
 * The story and the score must be the same length. The wpm check divides by the
 * story's duration; the cut divides by the shots' duration. If those differ, one
 * of the two numbers is measuring a different film.
 */
if (story && storyDoc) {
  const issue = checkStoryDuration(storyDoc, plan.duration);
  if (issue) story.errors.push(issue);
}

/**
 * Coverage and holes are measured on the words Whisper heard, not on the
 * authored line windows. A window can hold a long pause and still count as
 * "speech"; a word cannot.
 */
let measured: MeasuredNarration | undefined;
const wordsPath = resolve(filmDir, "words.json");
if (existsSync(wordsPath)) {
  const doc = JSON.parse(readFileSync(wordsPath, "utf8")) as { words?: { start: number; end: number }[] };
  if (Array.isArray(doc.words)) measured = measureWords(doc.words, plan.duration);
}

const report = preflightFilm({
  plan,
  pace,
  paceSource: source,
  story,
  beats: beatMap,
  sceneCheck,
  sceneDocs,
  sceneSource,
  measured,
  cast,
  reproduce,
});
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
        `${(n.coverage * 100).toFixed(0)}% · first line ${secs(n.first)} · longest hole ${secs(n.hole)} at ${secs(n.holeAt)}` +
        ` (${n.measured ? "measured words" : "line windows"})`,
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
  if (report.cut) {
    console.log(
      `  scenes    ${report.cut.scenes.length} scene(s) from ${report.cut.beats.length} beats (${report.sceneSource})`,
    );
    for (const scene of report.cut.scenes) {
      const row = report.cut.beats.find((beat) => beat.beat === scene.beat);
      console.log(
        `            ${scene.id ?? scene.beat}  ${scene.from.toFixed(1).padStart(5)}–${scene.to.toFixed(1)}s · ` +
          `${scene.shots.length} shot(s) · declared ${((row?.declared ?? 0) * 100).toFixed(0)}% · ` +
          `shot ${((row?.share ?? 0) * 100).toFixed(0)}% · ${row?.cues ?? 0} cue(s)`,
      );
    }
  }
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
