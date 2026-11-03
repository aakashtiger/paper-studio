/**
 * `voice:story` — speak the script before the film is cut.
 *
 * The order the user asked for is: idea → story → beats → **voice** → scenes →
 * shots. Until now `voice` read the score's clock lines, so the score (and the
 * shot list) existed before the read. This command fixes the order: it reads
 * `story.json` and `beats.json`, speaks the story's narration lines, listens
 * with Whisper, and writes `narration.json` with the measured line starts,
 * durations and word times. Scenes and shots are then authored against that
 * file.
 *
 * It invents nothing: the text is the story's, the voice is the story's
 * `voice` block (or the default), and the times are measured.
 *
 * usage:
 *   npm run voice:story -- --story films/<id>/story.json [--beats films/<id>/beats.json]
 *     [--out films/<id>/narration.json] [--audio films/<id>/voice.wav] [--force] [--json]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { hashFile } from "../src/core/style.js";
import {
  NARRATION_COVERAGE_MIN,
  NARRATION_START_MAX,
  measureWords,
} from "../src/engine/preflight.js";
import {
  BeatsSchema,
  NARRATION_HOLE_MAX,
  StorySchema,
  checkStory,
  countWords,
  type Beats,
  type Story,
} from "../src/engine/story.js";
import {
  installSteps,
  scriptWords,
  showPath,
  speechStatus,
  SPEECH_TOOLS,
  voiceRequest,
  type VoiceLine,
} from "../src/engine/voice.js";
import { attachWords, coverage, deriveClockLines, unheard, type HeardWord, type TimedWord } from "../src/engine/words.js";
import { findFfmpeg } from "../src/engine/grid.js";
import { measureVoiceActivity } from "../src/engine/voice-activity.js";

const args = process.argv.slice(2);
function arg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

const storyArg = arg("story");
const json = args.includes("--json");
const force = args.includes("--force");
if (!storyArg) {
  console.error(
    "usage: npm run voice:story -- --story <story.json> [--beats <beats.json>] [--out <narration.json>] [--audio <voice.wav>] [--speed 0.82] [--force] [--json]",
  );
  process.exit(2);
}

const root = process.cwd();
const storyPath = resolve(root, storyArg);
if (!existsSync(storyPath)) {
  console.error(`error: story not found: ${storyArg}`);
  process.exit(2);
}
const story = StorySchema.parse(JSON.parse(readFileSync(storyPath, "utf8").replace(/^\uFEFF/, ""))) as Story;
const beatsPath = resolve(root, arg("beats") ?? join(dirname(storyPath), "beats.json"));
if (!existsSync(beatsPath)) {
  console.error(`error: beats not found beside the story: ${showPath(root, beatsPath)}`);
  process.exit(2);
}
const beats = BeatsSchema.parse(JSON.parse(readFileSync(beatsPath, "utf8").replace(/^\uFEFF/, ""))) as Beats;

const writing = checkStory(story, beats);
if (writing.errors.length > 0) {
  for (const error of writing.errors) console.error(`error: ${error.code}: ${error.message}`);
  console.error("voice:story: the writing is not filmable; fix story/beats before speaking it");
  process.exit(1);
}

const lines: VoiceLine[] = story.narration.map((line) => ({ id: line.id, text: line.text }));
const wordsOfScript = scriptWords(lines);
const buildDir = resolve(root, "build", story.id);
mkdirSync(buildDir, { recursive: true });
const hasFilmDir = existsSync(resolve(root, "films", story.id));
const audioPath = resolve(
  root,
  arg("audio") ?? (hasFilmDir ? join("films", story.id, "voice.wav") : join("build", story.id, "voice-story.wav")),
);
const outPath = resolve(
  root,
  arg("out") ?? (hasFilmDir ? join("films", story.id, "narration.json") : join("build", story.id, "narration.json")),
);
mkdirSync(dirname(outPath), { recursive: true });
mkdirSync(dirname(audioPath), { recursive: true });

const narration = {
  source: "tts" as const,
  provider: story.voice?.provider ?? "kokoro",
  voiceId: story.voice?.voiceId ?? "af_heart",
  ...(arg("speed") !== undefined
    ? { speed: Number(arg("speed")) }
    : story.voice?.speed !== undefined
      ? { speed: story.voice.speed }
      : {}),
};
const request = voiceRequest(story.id, narration, lines);
const requestPath = join(buildDir, "voice-story-request.json");
writeFileSync(requestPath, `${JSON.stringify(request, null, 2)}\n`, "utf8");
const requestHash = hashFile(requestPath);
const readStampPath = join(buildDir, "voice-story.read.json");

function run(command: string, argv: string[], cwd: string): Promise<number> {
  return new Promise((done, fail) => {
    const child = spawn(command, argv, { cwd, stdio: "inherit" });
    child.on("error", fail);
    child.on("close", (code) => done(code ?? 1));
  });
}

async function main(): Promise<void> {
  // 1. Speak the story. A pinned read is kept unless --force.
  if (existsSync(audioPath) && !force) {
    if (!existsSync(readStampPath)) {
      console.error(`error: the pinned read has no script stamp — pass --force to re-speak ${showPath(root, audioPath)}`);
      process.exit(1);
    }
    const stamp = JSON.parse(readFileSync(readStampPath, "utf8")) as { requestHash?: string };
    if (stamp.requestHash !== requestHash) {
      console.error(
        "error: the pinned read was spoken from a different script or speed — pass --force to re-speak it",
      );
      process.exit(1);
    }
    console.log(`voice:story: keeping the pinned read ${showPath(root, audioPath)} (--force to re-speak)`);
  } else {
    const status = speechStatus();
    if (status.missing.some((tool) => tool.name === "kokoro")) {
      for (const line of installSteps(status, ["kokoro"])) console.error(line);
      process.exit(3);
    }
    console.log(`voice:story: speaking ${lines.length} lines from ${showPath(root, storyPath)}`);
    const code = await run(
      status.python!.command,
      [
        ...status.python!.prefix,
        SPEECH_TOOLS.kokoro.bridge,
        "--request", showPath(root, requestPath),
        "--out", showPath(root, audioPath),
        "--sentences", showPath(root, join(buildDir, "sentences-story.json")),
      ],
      root,
    );
    if (code !== 0) process.exit(code);
  }
  if (!existsSync(audioPath)) {
    console.error(`error: no narration to listen to: ${showPath(root, audioPath)}`);
    process.exit(1);
  }
  writeFileSync(
    readStampPath,
    `${JSON.stringify({ requestHash, audioHash: hashFile(audioPath), source: "tts" }, null, 2)}\n`,
    "utf8",
  );

  // 2. Listen. The measured word times are the clock.
  const status = speechStatus();
  if (status.missing.some((tool) => tool.name === "whisper")) {
    for (const line of installSteps(status, ["whisper"])) console.error(line);
    process.exit(3);
  }
  const heardPath = join(buildDir, "heard-story.json");
  console.log("voice:story: listening for word timings…");
  const code = await run(
    status.python!.command,
    [
      ...status.python!.prefix,
      SPEECH_TOOLS.whisper.bridge,
      "--audio", showPath(root, audioPath),
      "--out", showPath(root, heardPath),
    ],
    root,
  );
  if (code !== 0) process.exit(code);
  const heard = JSON.parse(readFileSync(heardPath, "utf8")) as HeardWord[];
  const timed = attachWords(wordsOfScript, heard, story.duration);
  const matched = Math.round(coverage(wordsOfScript, heard) * wordsOfScript.length);

  // 3. Derive the line clock from the measured words.
  const derived = deriveClockLines(lines, timed);
  const beatByLine = new Map(story.narration.map((line) => [line.id, line.beat]));
  const narrationLines = derived.map((line) => ({ ...line, beat: beatByLine.get(line.id) ?? "" }));
  const words = narrationLines.reduce((sum, line) => sum + countWords(line.text), 0);
  const scriptWpm = story.duration > 0 ? (words / story.duration) * 60 : 0;
  // The check is the measured words, not the line windows: a 3 s pause inside
  // one line is a hole, and line durations count it as speech.
  const measured = measureWords(heard, story.duration);
  // Coverage is the audio, not the word nuclei: a listener hears the whole
  // word, and a short articulation is not a pause (voice-activity.ts).
  const activity = measureVoiceActivity(findFfmpeg(), audioPath, story.duration);
  const speech = activity.voiced;
  const coverageRatio = story.duration > 0 ? speech / story.duration : 0;
  const hole = measured.hole;
  const holeAt = measured.holeAt;
  const first = measured.first;
  const lastEnd = heard.reduce((end, word) => Math.max(end, word.end), 0);
  const spokenWpm = speech > 0 ? (measured.words / speech) * 60 : 0;
  const missing = unheard(wordsOfScript, heard);

  const checks = {
    everyLineSpoken: narrationLines.length === story.narration.length,
    everyWordHeard: matched / Math.max(1, wordsOfScript.length) >= 0.9,
    firstLine: first <= NARRATION_START_MAX,
    hole: hole <= NARRATION_HOLE_MAX,
    coverage: coverageRatio >= NARRATION_COVERAGE_MIN,
    withinFilm: lastEnd <= story.duration + 0.001,
  };
  const pass = Object.values(checks).every(Boolean);

  const report = {
    film: story.id,
    source: "asr",
    audio: showPath(root, audioPath),
    audioHash: hashFile(audioPath),
    model: "small.en",
    duration: story.duration,
    scriptWords: wordsOfScript.length,
    heardWords: heard.length,
    matched,
    coverage: Number((matched / Math.max(1, wordsOfScript.length)).toFixed(4)),
    scriptWpm: Number(scriptWpm.toFixed(1)),
    spokenWpm: Number(spokenWpm.toFixed(1)),
    speech: Number(speech.toFixed(2)),
    speechCoverage: Number(coverageRatio.toFixed(3)),
    silence: activity.silence,
    longestSilence: activity.longest,
    longestSilenceAt: activity.longestAt,
    first: Number(first.toFixed(3)),
    lastEnd: Number(lastEnd.toFixed(3)),
    hole: Number(hole.toFixed(3)),
    holeAt: Number(holeAt.toFixed(3)),
    unheard: missing,
    checks,
    pass,
    lines: narrationLines,
    words: timed.map((word: TimedWord) => ({ w: word.word, start: word.start, end: word.end })),
  };
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`voice:story: ${story.id} · ${words} words · ${scriptWpm.toFixed(0)} script wpm · ${spokenWpm.toFixed(0)} spoken wpm · speaks ${(coverageRatio * 100).toFixed(0)}%`);
    console.log(`  first line ${first.toFixed(2)}s · last ends ${lastEnd.toFixed(2)}s · longest hole ${hole.toFixed(2)}s at ${holeAt.toFixed(2)}s · ${matched}/${wordsOfScript.length} words heard`);
    for (const line of narrationLines) {
      console.log(`  ${line.id.padEnd(4)} ${line.start.toFixed(2).padStart(6)}s  +${line.duration.toFixed(2)}s  ${line.text}`);
    }
    for (const [name, ok] of Object.entries(checks)) console.log(`  ${ok ? "ok  " : "FAIL"} ${name}`);
    console.log(`narration: ${showPath(root, outPath)}`);
  }
  if (!pass) {
    console.error("voice:story: the read does not meet the story's pace — fix the script or the read");
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
