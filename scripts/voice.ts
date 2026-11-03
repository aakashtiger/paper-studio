/**
 * Voice — capture the narration and turn it into the film's clock.
 *
 * One command: speak (or accept) the narration, listen to it with local
 * Whisper, attach the heard times to the script's own spelling, and derive the
 * line clock from what was actually said. The score is **not** rewritten: the
 * derived clock and the shot boundaries a snap would move are written under
 * `build/<id>/clock.json` for the director to accept or ignore.
 *
 * Two things are checked here, and they are different questions:
 *
 *   - **coverage** — are these the script's words? Whisper hears the WAV and the
 *     heard words are attached to the script; a word never said fails.
 *   - **clock** — is each line said when the score says? Measured on the audio
 *     itself (the first sample above −40 dBFS near each authored start), because
 *     a recogniser's word onsets wobble by a third of a second.
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
/** `--apply` accepts the measured read: the score's clock and shot boundaries move to it. */
const apply = args.includes("--apply");
/** The three files this command writes: missing until it has run. */
const VOICE_OUTPUTS = new Set(["audio_voice_file", "audio_transcript_file", "audio_srt_file"]);
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

/**
 * When each line actually starts in the narration WAV.
 *
 * The score's clock says "this line begins at 5.1 s". The only honest way to
 * check that is to look at the samples: for each authored start, scan a short
 * window around it for the first moment the voice rises above −40 dBFS. The
 * capture writes 48 kHz 16-bit stereo PCM (ffmpeg's `-ar 48000 -ac 2`), so the
 * reader is a header parse and a stride, not a decoder.
 *
 * A line with no authored `start`, or with no sound in its window, reports a
 * null delta — that is a failure of the clock, not a silent pass.
 */
function wavOnsets(
  path: string,
  lines: VoiceLine[],
): { id: string; authored: number | null; onset: number | null; delta: number | null }[] {
  const bytes = readFileSync(path);
  const channels = bytes.readUInt16LE(22);
  const rate = bytes.readUInt32LE(24);
  const bits = bytes.readUInt16LE(34);
  let dataAt = 12;
  while (dataAt + 8 <= bytes.length && bytes.toString("ascii", dataAt, dataAt + 4) !== "data") {
    dataAt += 8 + bytes.readUInt32LE(dataAt + 4);
  }
  if (bytes.toString("ascii", dataAt, dataAt + 4) !== "data") {
    throw new Error(`${path} has no data chunk`);
  }
  const asked = bits === 16 ? true : bits === 24 ? true : false;
  if (!asked) throw new Error(`${path} is ${bits}-bit; the clock check reads 16- or 24-bit PCM`);
  const start = dataAt + 8;
  const end = Math.min(bytes.length, start + bytes.readUInt32LE(dataAt + 4));
  const frameBytes = channels * (bits / 8);
  const frames = Math.floor((end - start) / frameBytes);
  const sample = (frame: number, channel: number): number => {
    const at = start + frame * frameBytes + channel * (bits / 8);
    if (bits === 16) return Math.abs(bytes.readInt16LE(at)) / 32768;
    return Math.abs(bytes.readIntLE(at, 3)) / 8388608;
  };
  const loudness = (frame: number): number => {
    let sum = 0;
    for (let channel = 0; channel < channels; channel++) sum += sample(frame, channel);
    return sum / channels;
  };
  const threshold = 0.01; // −40 dBFS
  const window = 0.25; // seconds either side of the authored start
  return lines.map((line) => {
    if (line.start === undefined) return { id: line.id, authored: null, onset: null, delta: null };
    const from = Math.max(0, Math.floor((line.start - window) * rate));
    const to = Math.min(frames, Math.ceil((line.start + window) * rate));
    for (let frame = from; frame < to; frame++) {
      if (loudness(frame) > threshold) {
        const onset = Number((frame / rate).toFixed(3));
        return {
          id: line.id,
          authored: line.start,
          onset,
          delta: Number((onset - line.start).toFixed(3)),
        };
      }
    }
    return { id: line.id, authored: line.start, onset: null, delta: null };
  });
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  // This step *writes* the voice, the transcript and the captions, so their
  // absence is not a reason to refuse: every other error is. Without this the
  // first voice run on a new film could never happen — the score is invalid
  // until the file this command makes exists.
  const blocking = errors.filter((error) => !VOICE_OUTPUTS.has(error.code));
  if (blocking.length > 0) {
    for (const error of blocking) console.error(`error: ${error.message}`);
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
    start: line.start,
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
  // The clock is a promise about when a line is *said*. Whisper proves the words
  // are the script's, but its word onsets wobble (its first word came back 0.35 s
  // early on a read that starts at 0.50 and measures 0.53), so timing is measured
  // on the audio itself: the WAV is scanned for the moment the voice rises above
  // −40 dBFS near each authored start. A film whose clock is ignored drifts by
  // seconds; a read that keeps it lands inside a tenth.
  const onsets = wavOnsets(narrationPath, lines);
  const clockTolerance = 0.1;
  /**
   * The clock is judged on the **measured word times**, not on a rise found near
   * the authored start. The old scan looked in a window around the score's time,
   * so a line that actually started 0.27 s early read as "+0.04 s" — it found
   * the second word. `words.json` is the authority the rest of the pipeline is
   * cut to, so it is the authority here.
   *
   * The WAV onsets are still reported (`clock.wav`): they are a second opinion
   * about the same audio, and a disagreement between the two is worth seeing.
   */
  const clockLines = lines.map((line) => {
    const measured = derived.find((entry) => entry.id === line.id);
    const onset = measured ? measured.start : null;
    const authored = line.start ?? null;
    return {
      id: line.id,
      authored,
      onset,
      delta: onset === null || authored === null ? null : Number((onset - authored).toFixed(3)),
    };
  });
  const worstOnset = clockLines.reduce(
    (worst, line) => (line.delta !== null && Math.abs(line.delta) > Math.abs(worst) ? (line.delta as number) : worst),
    0,
  );
  const lateLines = clockLines.filter((line) => line.delta === null || Math.abs(line.delta) > clockTolerance);
  const snap = snapShots(
    plan.shots.map((shot) => ({ id: shot.id, start: shot.start, duration: shot.duration })),
    derived.map((line) => line.start),
  );

  /**
   * `--apply` — the measured read becomes the clock (decision 0035).
   *
   * The user's order is: write the script, speak it, then cut the scenes and
   * shots to what was actually said. Until 0035 `voice` only *proposed* the
   * move (`derived, not applied: edit the score to accept a moved boundary`),
   * so a film whose read drifted was refused and a person had to retype times.
   *
   * Applying invents nothing: the text is unchanged and only times are measured.
   * Captions move with their line. If no value changes, the score is not
   * rewritten, so a re-run cannot move a hash for nothing.
   */
  let applied: { lines: number; shots: number; captions: number; lateLines: typeof lateLines } | null = null;
  if (apply) {
    const rawPath = resolve(root, scorePath);
    const raw = JSON.parse(readFileSync(rawPath, "utf8")) as {
      clock?: { mode?: string; lines?: Array<{ id: string; text: string; start: number; duration: number; hold?: number }> };
      shots?: Array<{ duration: number }>;
      captions?: { lines?: Array<{ id: string; text: string; start: number; end: number }> };
    };
    const before = JSON.stringify(raw);
    const oldLines = new Map((raw.clock?.lines ?? []).map((line) => [line.id, line]));
    const newLines = new Map(derived.map((line) => [line.id, line]));
    let linesMoved = 0;
    let captionsMoved = 0;

    for (const line of raw.clock?.lines ?? []) {
      const measured = newLines.get(line.id);
      if (!measured) continue;
      // The start is the measured word time: that is the clock the cut is
      // trimmed to. The duration is only extended, never shortened — an
      // authored window may hold a deliberate pause, and the read fitting
      // inside it is not evidence that the pause should go.
      if (line.start !== measured.start) linesMoved += 1;
      line.start = measured.start;
      if (measured.duration > line.duration + 0.05) {
        line.duration = measured.duration;
        linesMoved += 1;
      }
    }

    for (const caption of raw.captions?.lines ?? []) {
      const oldLine = oldLines.get(caption.id);
      const newLine = newLines.get(caption.id);
      if (!oldLine || !newLine) continue;
      const beforeStart = caption.start;
      const windowStart = newLine.start;
      const windowEnd = Number((newLine.start + newLine.duration + (newLine.hold ?? 0)).toFixed(3));
      const span = caption.end - caption.start;
      // Keep the caption inside its line's own window. A read that shortened
      // the line shortens the caption with it rather than leaving the words on
      // screen past the line — the defect the first version of `--apply` had.
      const latestStart = Math.max(windowStart, windowEnd - 0.1);
      const start = Math.max(windowStart, Math.min(caption.start + (newLine.start - oldLine.start), latestStart));
      const end = Math.min(windowEnd, Math.max(start + 0.05, start + span));
      caption.start = Number(start.toFixed(3));
      caption.end = Number(Math.max(caption.start + 0.05, end).toFixed(3));
      if (caption.start !== beforeStart) captionsMoved += 1;
    }

    let shotsMoved = 0;
    (raw.shots ?? []).forEach((shot, index) => {
      const next = snap.shots[index];
      if (!next) return;
      if (shot.duration !== next.duration) shotsMoved += 1;
      shot.duration = next.duration;
    });

    // The applied score must still be a legal film. Validate before writing, so
    // a refused application cannot leave a half-timed score on disk.
    const after = FilmScoreSchema.safeParse(raw);
    if (!after.success) {
      const first = after.error.issues[0];
      console.error(
        `error: --apply produced a score that does not validate — ${first?.path.join(".") || "(root)"}: ` +
          `${first?.message ?? "invalid"}`,
      );
      process.exit(1);
    }
    const recheck = resolveFilm(after.data, resolve(root, `styles/${score.style}`), root);
    if (recheck.errors.length > 0) {
      for (const error of recheck.errors) console.error(`error: after --apply: ${error.message}`);
      process.exit(1);
    }

    if (JSON.stringify(raw) !== before) {
      writeFileSync(rawPath, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
    }

    applied = { lines: linesMoved, shots: shotsMoved, captions: captionsMoved, lateLines };
    console.log(
      `voice: applied ${linesMoved} line timing(s), ${shotsMoved} shot boundary(ies) and ${captionsMoved} caption(s) to ${scorePath}`,
    );
  }

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
        note: apply
          ? "applied to the score: the clock and shot boundaries are the measured read"
          : "derived, not applied: edit the score to accept a moved boundary",
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
    // `--apply` moves the score to the measured read, so the score is exact by
    // construction; the drift it accepted is recorded in `applied.lateLines`.
    clock: apply || lateLines.length === 0,
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
        applied,
        clock: { tolerance: clockTolerance, worst: worstOnset, lines: clockLines, wav: onsets },
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
  console.log(
    `voice: clock ${apply ? "applied" : lateLines.length === 0 ? "kept" : `FAILED on ${lateLines.length} line(s)`} · worst line starts ` +
      `${worstOnset >= 0 ? "+" : ""}${worstOnset.toFixed(2)}s from the score (tolerance ${clockTolerance}s)`,
  );
  for (const line of lateLines) {
    console.log(
      `  ${line.id}: the score says ${line.authored}s, ` +
        (line.onset === null ? "and there is no sound anywhere near it" : `the voice starts at ${line.onset}s`),
    );
  }
  console.log(`voice: ${showPath(root, wordsPath)} · ${apply ? "clock applied" : "clock proposal"} build/${score.id}/clock.json`);
  if (snap.moved.length > 0) {
    console.log(`voice: ${snap.moved.length} shot boundaries sit within 0.35 s of a phrase beat:`);
    for (const move of snap.moved) console.log(`  ${move.id}  ${move.from}s → ${move.to}s`);
  }
  if (!pass) process.exit(1);
}

async function fromStory(): Promise<void> {
  const root = process.cwd();
  const narrationPath = args[args.indexOf("--from-story") + 1];
  if (!file || !narrationPath) throw new Error("usage: npm run voice -- <score.json> --from-story <narration.json> [--apply]");
  const readJson = (path: string) => JSON.parse(readFileSync(resolve(root, path), "utf8").replace(/^\uFEFF/, ""));
  const narration = readJson(narrationPath) as {
    lines?: { id: string; text: string; start: number; duration: number; hold?: number }[];
  };
  if (!Array.isArray(narration.lines) || narration.lines.length === 0) {
    throw new Error(`${narrationPath} has no measured lines — run voice:story first`);
  }
  const raw = readJson(file) as {
    id: string;
    clock?: unknown;
    captions?: { source?: string; lines?: { id: string; text: string; start: number; end: number }[] };
    shots?: { duration: number }[];
    audio?: { mode?: string };
  };
  if (!Array.isArray(raw.shots) || raw.shots.length === 0) {
    throw new Error("the score has no shots — write the shot list before filling its clock from the read");
  }
  if (raw.audio?.mode !== "narration" && raw.audio?.mode !== "hybrid") {
    throw new Error(`the score's audio mode is "${raw.audio?.mode ?? "(none)"}" — a narration clock needs narration`);
  }

  const lines = narration.lines.map((line) => ({
    id: line.id,
    text: line.text,
    start: line.start,
    duration: line.duration,
    ...(line.hold !== undefined ? { hold: line.hold } : {}),
  }));
  raw.clock = { mode: "narration", lines };
  const byId = new Map(lines.map((line) => [line.id, line]));
  raw.captions = raw.captions ?? { source: `films/${raw.id}/captions.srt`, lines: [] };
  raw.captions.lines = raw.captions.lines ?? [];
  const seen = new Set<string>();
  for (const caption of raw.captions.lines) {
    const line = byId.get(caption.id);
    if (!line) continue;
    caption.text = line.text;
    caption.start = line.start;
    caption.end = Number((line.start + line.duration).toFixed(3));
    seen.add(caption.id);
  }
  for (const line of lines) {
    if (seen.has(line.id)) continue;
    raw.captions.lines.push({
      id: line.id,
      text: line.text,
      start: line.start,
      end: Number((line.start + line.duration).toFixed(3)),
    });
  }

  const parsed = FilmScoreSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(`${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}`);
  }
  const resolved = resolveFilm(parsed.data, resolve(root, `styles/${parsed.data.style}`), root);
  if (resolved.errors.length > 0) {
    for (const error of resolved.errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }
  const snap = snapShots(
    resolved.plan.shots.map((shot) => ({ id: shot.id, start: shot.start, duration: shot.duration })),
    lines.map((line) => line.start),
  );
  (raw.shots ?? []).forEach((shot, index) => {
    const next = snap.shots[index];
    if (next && Number.isFinite(next.duration)) shot.duration = next.duration;
  });

  const after = FilmScoreSchema.safeParse(raw);
  if (!after.success) {
    const first = after.error.issues[0];
    throw new Error(`after the read: ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}`);
  }
  const checked = resolveFilm(after.data, resolve(root, `styles/${after.data.style}`), root);
  if (checked.errors.length > 0) {
    for (const error of checked.errors) console.error(`error: after the read: ${error.message}`);
    process.exit(1);
  }

  console.log(`voice --from-story: ${lines.length} measured lines · ${snap.moved.length} shot boundary(ies) moved`);
  for (const line of lines) console.log(`  ${line.id.padEnd(4)} ${line.start.toFixed(2).padStart(6)}s +${line.duration.toFixed(2)}s  ${line.text}`);
  if (!apply) {
    console.log("voice --from-story: dry run; pass --apply to write the score clock and captions");
    return;
  }
  writeFileSync(resolve(root, file), `${JSON.stringify(raw, null, 2)}\n`, "utf8");
  console.log(`voice --from-story: wrote ${file}; run \`npm run embed -- ${file}\``);
}

if (args.includes("--from-story")) {
  fromStory().catch((error: unknown) => {
    console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
} else {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
