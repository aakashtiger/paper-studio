/**
 * ASR â€” the G7 gate on the delivered master.
 *
 * The last thing a film owes the director: it is listened to, once, by the same
 * local Whisper that timed the narration, and the words it hears are compared to
 * the script's. A missing line, a dropped word or a swapped take shows up as
 * coverage below the threshold, and the report names every word it did not hear.
 *
 * It reads the delivered MP4 by default (the mixed master). Pass `--audio` to
 * listen to any file ffmpeg can read, e.g. the narration stem. It writes one
 * report, `build/<id>/asr.json`, that `gate:7` reads.
 *
 * usage: npm run asr -- films/understudy/score.json [--audio <file>] [--model small.en]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { hashFile } from "../src/core/style.js";
import { coverage, unheardWith, type HeardWord } from "../src/engine/words.js";
import { findFfmpeg, videoStreamHash } from "../src/engine/video.js";
import { installSteps, scriptWords, showPath, speechStatus, SPEECH_TOOLS } from "../src/engine/voice.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run asr -- <score.json> [--audio <file>] [--model small.en] [--threshold 0.9]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function run(command: string, argv: string[], cwd: string): Promise<number> {
  return new Promise((done, fail) => {
    const child = spawn(command, argv, { cwd, stdio: "inherit" });
    child.on("error", fail);
    child.on("close", (code) => done(code ?? 1));
  });
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }
  if (score.clock.mode !== "narration") {
    console.error(`error: ASR needs a narration clock, not "${score.clock.mode}"`);
    process.exit(1);
  }

  const master = resolve(root, `films/${score.id}/${score.id}.mp4`);
  const audio = arg("audio") ? resolve(root, arg("audio") as string) : master;
  if (!existsSync(audio)) {
    console.error(`error: no audio to listen to: ${showPath(root, audio)}; render the film, or pass --audio`);
    process.exit(1);
  }
  const isMaster = audio === master;
  const threshold = Number(arg("threshold") ?? 0.9);
  const model = arg("model") ?? "small.en";

  const status = speechStatus();
  if (status.missing.some((tool) => tool.name === "whisper")) {
    for (const line of installSteps(status, ["whisper"])) console.error(line);
    process.exit(3);
  }

  const buildDir = resolve(root, "build", score.id);
  mkdirSync(buildDir, { recursive: true });
  const heardPath = join(buildDir, "asr-heard.json");
  console.log(`asr: listening to ${showPath(root, audio)} with Whisper ${model}â€¦`);
  const code = await run(
    status.python!.command,
    [
      ...status.python!.prefix,
      SPEECH_TOOLS.whisper.bridge,
      "--audio", showPath(root, audio),
      "--out", showPath(root, heardPath),
      "--model", model,
    ],
    root,
  );
  if (code !== 0) process.exit(code);

  const heard = JSON.parse(readFileSync(heardPath, "utf8")) as HeardWord[];
  const lines = score.clock.lines;
  const words = scriptWords(lines.map((line) => ({ id: line.id, text: line.text })));
  const ratio = Number(coverage(words, heard).toFixed(4));

  // Every script word the recogniser did not match, in order, with the token it
  // heard in its place â€” "cue" read as "Q" is a spelling difference, not a
  // dropped word, and the report has to be able to say which it is.
  const unmatched = unheardWith(words, heard).slice(0, 40);

  // The picture the words were heard over, so the gate ties the report to the
  // delivered film rather than to a path that may hold another cut by then.
  const pictureHash = isMaster ? videoStreamHash(findFfmpeg(), audio) : null;

  const pass = ratio >= threshold;
  const report = {
    film: score.id,
    gate: "asr",
    pass,
    audio: showPath(root, audio),
    audioHash: hashFile(audio),
    pictureHash,
    model,
    threshold,
    scriptWords: words.length,
    heardWords: heard.length,
    coverage: ratio,
    unmatched,
    toolVersions: status.modules,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(buildDir, "asr.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`asr: ${words.length} script words, ${heard.length} heard, ${(ratio * 100).toFixed(1)}% matched (threshold ${(threshold * 100).toFixed(0)}%)`);
  if (unmatched.length > 0) {
    const shown = unmatched.slice(0, 12).map((entry) => entry.word + (entry.heard ? " -> " + entry.heard : ""));
    console.log(`asr: not matched: ${shown.join(", ")}${unmatched.length > 12 ? ` +${unmatched.length - 12} more` : ""}`);
  }
  console.log(`asr: ${pass ? "PASS" : "FAIL"} -> build/${score.id}/asr.json`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
