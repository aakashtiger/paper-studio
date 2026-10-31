/**
 * Voice — capture the narration and turn it into the film's clock.
 *
 * One command: speak (or accept) the narration, listen to it with local
 * Whisper, attach the heard times to the script's own spelling, and derive the
 * line clock from what was actually said. The score is **not** rewritten: the
 * derived clock and the shot boundaries a snap would move are written under
 * `build/<id>/clock.json` for the director to accept or ignore.
 *
 * The video never waits on this, and this never runs at render time. The WAV is
 * spoken once and pinned; a later run reuses it unless `--force` is passed.
 *
 * usage: npm run voice -- films/understudy/score.json [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { hashFile } from "../src/core/style.js";
import { attachWords, coverage, deriveClockLines, snapShots, type HeardWord, type TimedWord } from "../src/engine/words.js";
import {
  installSteps,
  scriptWords,
  showPath,
  speechStatus,
  SPEECH_TOOLS,
  voiceRequest,
  type VoiceLine,
} from "../src/engine/voice.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run voice -- <score.json> [--force]");
  process.exit(2);
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
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const narration = score.audio.narration;
  if (!narration || narration.source === "none") {
    console.error("error: voice needs a narration plan (audio.narration)");
    process.exit(1);
  }
  if (score.clock.mode !== "narration") {
    console.error(`error: voice needs a narration clock, not "${score.clock.mode}"`);
    process.exit(1);
  }

  const lines: VoiceLine[] = score.clock.lines.map((line) => ({
    id: line.id,
    text: line.text,
    ...(line.hold !== undefined ? { hold: line.hold } : {}),
  }));
  const wordsOfScript = scriptWords(lines);
  const buildDir = resolve(root, "build", score.id);
  mkdirSync(buildDir, { recursive: true });

  const request = voiceRequest(score.id, narration, lines);
  const requestPath = join(buildDir, "voice-request.json");
  writeFileSync(requestPath, `${JSON.stringify(request, null, 2)}\n`, "utf8");

  // 1. Capture. A recording is used as-is; a tts narration is spoken once.
  const narrationPath = resolve(
    root,
    narration.source === "recorded" && narration.voice ? narration.voice : `films/${score.id}/voice.wav`,
  );
  if (narration.source === "recorded") {
    if (!narration.voice || !existsSync(narrationPath)) {
      console.error(`error: recorded narration file not found: ${narration.voice ?? "(none)"}`);
      process.exit(1);
    }
    console.log(`voice: using the recording ${narration.voice}`);
  } else {
    const status = speechStatus();
    if (status.missing.some((tool) => tool.name === "kokoro")) {
      for (const line of installSteps(status, ["kokoro"])) console.error(line);
      process.exit(3);
    }
    if (existsSync(narrationPath) && !args.includes("--force")) {
      console.log(`voice: keeping the pinned narration ${showPath(root, narrationPath)} (--force to re-speak)`);
    } else {
      console.log(`voice: speaking ${lines.length} lines with ${narration.voiceId}…`);
      const python = status.python!;
      const code = await run(
        python.command,
        [
          ...python.prefix,
          SPEECH_TOOLS.kokoro.bridge,
          "--request", showPath(root, requestPath),
          "--out", showPath(root, narrationPath),
          "--sentences", showPath(root, join(buildDir, "sentences.json")),
        ],
        root,
      );
      if (code !== 0) process.exit(code);
    }
  }
  if (!existsSync(narrationPath)) {
    console.error(`error: no narration to listen to: ${showPath(root, narrationPath)}`);
    process.exit(1);
  }

  // 2. Listen. Word timings are real, not guessed from word length.
  const status = speechStatus();
  if (status.missing.some((tool) => tool.name === "whisper")) {
    for (const line of installSteps(status, ["whisper"])) console.error(line);
    process.exit(3);
  }
  const heardPath = join(buildDir, "heard.json");
  console.log("voice: listening for word timings…");
  const code = await run(
    status.python!.command,
    [
      ...status.python!.prefix,
      SPEECH_TOOLS.whisper.bridge,
      "--audio", showPath(root, narrationPath),
      "--out", showPath(root, heardPath),
    ],
    root,
  );
  if (code !== 0) process.exit(code);

  const heard = JSON.parse(readFileSync(heardPath, "utf8")) as HeardWord[];
  const timed = attachWords(wordsOfScript, heard, score.duration);
  const matched = Math.round(coverage(wordsOfScript, heard) * wordsOfScript.length);

  // 3. Derive. The clock and the boundaries a snap would move, as a proposal.
  const derived = deriveClockLines(lines, timed);
  const snap = snapShots(
    plan.shots.map((shot) => ({ id: shot.id, start: shot.start, duration: shot.duration })),
    derived.map((line) => line.start),
  );

  const wordsPath = resolve(root, `films/${score.id}/words.json`);
  writeFileSync(
    wordsPath,
    `${JSON.stringify(
      {
        film: score.id,
        source: "asr",
        audio: showPath(root, narrationPath),
        audioHash: hashFile(narrationPath),
        model: "small.en",
        scriptWords: wordsOfScript.length,
        heardWords: heard.length,
        coverage: Number((matched / Math.max(1, wordsOfScript.length)).toFixed(4)),
        words: timed.map((word: TimedWord) => ({ w: word.word, start: word.start, end: word.end })),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  writeFileSync(
    join(buildDir, "clock.json"),
    `${JSON.stringify(
      {
        film: score.id,
        derivedFrom: showPath(root, wordsPath),
        lines: derived,
        shots: snap.shots,
        moved: snap.moved,
        note: "derived, not applied: edit the score to accept a moved boundary",
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const checks = {
    narrationFile: existsSync(narrationPath),
    heardWords: heard.length > 0,
    wordsWritten: existsSync(wordsPath) && timed.length === wordsOfScript.length,
    coverage: matched / Math.max(1, wordsOfScript.length) >= 0.9,
  };
  const pass = Object.values(checks).every(Boolean);
  writeFileSync(
    join(buildDir, "voice.json"),
    `${JSON.stringify(
      {
        film: score.id,
        pass,
        source: narration.source,
        provider: narration.provider ?? null,
        voice: narration.voiceId ?? narration.voice ?? null,
        narration: showPath(root, narrationPath),
        narrationHash: hashFile(narrationPath),
        words: showPath(root, wordsPath),
        scriptWords: wordsOfScript.length,
        heardWords: heard.length,
        matched,
        coverage: Number((matched / Math.max(1, wordsOfScript.length)).toFixed(4)),
        movedBoundaries: snap.moved,
        toolVersions: status.modules,
        checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`voice: ${matched}/${wordsOfScript.length} script words timed (${((matched / Math.max(1, wordsOfScript.length)) * 100).toFixed(1)}% heard)`);
  console.log(`voice: ${showPath(root, wordsPath)} · clock proposal build/${score.id}/clock.json`);
  if (snap.moved.length > 0) {
    console.log(`voice: ${snap.moved.length} shot boundaries sit within 0.35 s of a phrase beat:`);
    for (const move of snap.moved) console.log(`  ${move.id}  ${move.from}s → ${move.to}s`);
  }
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
