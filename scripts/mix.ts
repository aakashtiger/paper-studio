/**
 * Final audio master.
 *
 * Reads the recorded voice and the per-cue SFX written by `npm run sfx`, runs
 * them through the mix bus in `src/engine/mix.ts`, then masters the result to
 * -14.0 LUFS / -1.5 dBTP. Writes a report with the measured loudness, the gain
 * and limiter the master used, and the input hashes.
 *
 * usage: npm run mix -- films/understudy/score.json
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { cueBand, cueDuckDb, cueSend, mixFilm } from "../src/engine/mix.js";
import { cueSetText, cueSpec } from "../src/engine/sfx.js";

const TARGET_LUFS = -14;
const TARGET_TP = -1.5;
/** The most the master may add or take away. A mix needing more is a mix to fix. */
const MASTER_MAX_GAIN = 8;
/**
 * The limiter's sample ceiling, in linear full scale. -2 dBFS leaves room for
 * the inter-sample peaks that `ebur128` measures as true peak, so the limit
 * lands under -1.5 dBTP rather than pinning at it.
 */
const LIMITER_CEILING = 0.794;
/** How many gain/limit passes the master may take to land on the target. */
const MASTER_PASSES = 6;
/**
 * The most the limiter may take off the loudest sample.
 *
 * A -14 LUFS delivery gives a programme 12.5 dB between its loudness and its
 * true-peak ceiling. A hit that sits 16 dB over the film's loudness has to give
 * that difference back somewhere, and the limiter is where it goes — on the
 * loudest few milliseconds, not on the film. The bound is what separates that
 * from a mix that is simply broken: past this the film is being squashed rather
 * than mastered, and the fix belongs in the mix. `master.limiterWindows` in the
 * report says how the reduction is spread over the film, so the single number
 * can be read in context.
 */
const LIMITER_MAX_REDUCTION = 8;

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run mix -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const ffmpeg = findFfmpeg();
const sr = 48_000;

const outDir = resolve(root, "build", score.id, "mix");
mkdirSync(outDir, { recursive: true });

const voicePath = plan.audio.narration?.voice ? resolve(root, plan.audio.narration.voice) : null;
const voice = voicePath && existsSync(voicePath) ? mono(voicePath) : null;

/**
 * The per-cue WAVs are only trusted when `sfx.json` says this exact cue
 * rendered them. A kind, a length or a time that changed after `npm run sfx`
 * must fail the mix, not be mixed from yesterday's file.
 */
type SfxRecord = { id: string; spec: string; wav: string; ok: boolean };
const sfxPath = resolve(root, "build", score.id, "sfx", "sfx.json");
const sfxReport = existsSync(sfxPath)
  ? (JSON.parse(readFileSync(sfxPath, "utf8")) as { cues: SfxRecord[] })
  : null;
const records = new Map((sfxReport?.cues ?? []).map((record) => [record.id, record]));

const cues = plan.cues.map((cue) => {
  const path = resolve(root, "build", score.id, "sfx", `${cue.id}.wav`);
  if (!existsSync(path)) {
    console.error(`error: cue "${cue.id}" has no audio at build/${score.id}/sfx/${cue.id}.wav`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  const record = records.get(cue.id);
  if (!record) {
    console.error(`error: cue "${cue.id}" is not in build/${score.id}/sfx/sfx.json`);
    console.error("       the WAVs and the score disagree; run: npm run sfx -- " + file);
    process.exit(1);
  }
  if (record.spec !== sha256(cueSpec(cue))) {
    console.error(`error: cue "${cue.id}" changed after it was rendered (kind, time, length, layers, gain, pan or band)`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  if (record.wav !== `sha256:${hashFile(path)}`) {
    console.error(`error: cue "${cue.id}" WAV was written by a different run than its record`);
    console.error("       run: npm run sfx -- " + file);
    process.exit(1);
  }
  const samples = mono(path);
  return {
    id: cue.id,
    kind: cue.kind,
    at: cue.at,
    samples,
    send: cueSend(cue),
    duckDb: cueDuckDb(cue),
    band: cueBand(cue),
    pan: cue.pan,
  };
});

if (!voice && cues.length === 0) {
  console.error("error: nothing to mix; add a voice or SFX cues");
  process.exit(1);
}

const mixed = mixFilm({ sampleRate: sr, duration: plan.duration, voice, cues });
const premaster = resolve(outDir, "premaster48.wav");
writeWavFloat32(premaster, mixed.left, mixed.right, sr);

const master = resolve(outDir, "master.wav");
const mastered = masterToTarget(ffmpeg, premaster, master);
const measured = mastered.measured;

const pass =
  Math.abs(measured.lufs - TARGET_LUFS) <= 0.5 &&
  measured.truePeak <= TARGET_TP + 0.1 &&
  mastered.gainReductionDb <= LIMITER_MAX_REDUCTION;
const report = {
  film: score.id,
  target: { lufs: TARGET_LUFS, truePeak: TARGET_TP },
  measured: { lufs: measured.lufs, truePeak: measured.truePeak, lra: measured.lra },
  master: {
    gainDb: mastered.gainDb,
    limiterCeiling: Number((20 * Math.log10(mastered.ceiling)).toFixed(2)),
    /** What the limiter took off the loudest sample, so the gain is not a fiction. */
    limiterGainReductionDb: mastered.gainReductionDb,
    /**
     * The same reduction read as a distribution over the film, in 100 ms
     * windows. The peak number alone reads as if the master squashed the whole
     * programme; this says how much of it was actually touched.
     */
    limiterWindows: limiterWindows(premaster, master, mastered.gainDb),
    passes: mastered.passes,
    usedAllPasses: mastered.passes >= MASTER_PASSES,
    /** The render reached the target; it is not "close enough on the last pass". */
    converged: Math.abs(measured.lufs - TARGET_LUFS) <= 0.2 && measured.truePeak <= TARGET_TP + 0.2,
  },
  /** What the mix bus did to its own headroom before the master saw it. */
  bus: { headroomDb: mixed.busGainDb },
  cues: cues.length,
  voice: voicePath ? relative(voicePath) : null,
  duckDb: average(cues.map((cue) => cue.duckDb)),
  reverb: { room: 0.82, damp: 0.2, wet: 0.32 },
  passes: pass,
  inputs: {
    score: `sha256:${hashFile(resolve(root, file))}`,
    sfx: sfxReport ? `sha256:${sha256(cueSetText(sfxReport.cues))}` : null,
    voice: voicePath && existsSync(voicePath) ? `sha256:${hashFile(voicePath)}` : null,
  },
  files: {
    master: relative(master),
    hash: `sha256:${hashFile(master)}`,
    premaster: relative(premaster),
  },
  generatedAt: new Date().toISOString(),
};
writeFileSync(resolve(outDir, "mix-report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

console.log(`mix: ${cues.length} cues + ${voice ? "voice" : "no voice"} → build/${score.id}/mix/master.wav`);
if (mixed.busGainDb !== 0) {
  console.log(`bus: ${mixed.busGainDb.toFixed(1)} dB of headroom taken so the premaster peaks at -1 dBFS`);
}
console.log(
  `master: ${measured.lufs.toFixed(1)} LUFS · ${measured.truePeak.toFixed(1)} dBTP ` +
    `(target ${TARGET_LUFS} / ${TARGET_TP} · gain ${mastered.gainDb >= 0 ? "+" : ""}${mastered.gainDb.toFixed(1)} dB · ` +
    `limiter ${(20 * Math.log10(mastered.ceiling)).toFixed(1)} dBFS, taking ${mastered.gainReductionDb.toFixed(1)} dB off the loudest sample`,
);
const windows = report.master.limiterWindows;
console.log(
  `       limiter over the film: median window ${windows.p50.toFixed(2)} dB · p90 ${windows.p90.toFixed(2)} · ` +
    `p99 ${windows.p99.toFixed(2)} · ${windows.over3Db}/${windows.windows} windows over 3 dB)`,
);
if (mastered.gainReductionDb > LIMITER_MAX_REDUCTION) {
  console.error(
    `error: the limiter took ${mastered.gainReductionDb.toFixed(1)} dB off the loudest sample; ` +
      `more than ${LIMITER_MAX_REDUCTION} dB is the master compressing the film, so fix the mix`,
  );
}
if (!pass) process.exit(1);

function mono(path: string): Float32Array {
  const wav = readWav(path);
  const frames = wav.channels[0]?.length ?? 0;
  if (wav.channels.length === 1) return wav.channels[0] ?? new Float32Array(0);
  const out = new Float32Array(frames);
  for (const channel of wav.channels) {
    for (let i = 0; i < frames; i++) out[i] = (out[i] ?? 0) + (channel[i] ?? 0) / wav.channels.length;
  }
  return out;
}

type Wav = { sampleRate: number; channels: Float32Array[] };

function readWav(path: string): Wav {
  const buffer = readFileSync(path);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${path} is not a RIFF/WAVE file`);
  }
  let offset = 12;
  let format = 1;
  let channels = 1;
  let sampleRate = 48_000;
  let bits = 16;
  let dataStart = -1;
  let dataLength = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (id === "fmt ") {
      format = buffer.readUInt16LE(body);
      channels = buffer.readUInt16LE(body + 2);
      sampleRate = buffer.readUInt32LE(body + 4);
      bits = buffer.readUInt16LE(body + 14);
      if (format === 0xfffe && size >= 40) format = buffer.readUInt16LE(body + 24);
    } else if (id === "data") {
      dataStart = body;
      dataLength = Math.min(size, buffer.length - body);
    }
    offset = body + size + (size % 2);
  }
  if (dataStart < 0) throw new Error(`${path} has no data chunk`);
  const bytesPerSample = bits / 8;
  const frames = Math.floor(dataLength / (bytesPerSample * channels));
  const out: Float32Array[] = Array.from({ length: channels }, () => new Float32Array(frames));
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const at = dataStart + (frame * channels + channel) * bytesPerSample;
      let value: number;
      if (format === 3) value = buffer.readFloatLE(at);
      else if (bits === 16) value = buffer.readInt16LE(at) / 32768;
      else if (bits === 24) value = (buffer.readIntLE(at, 3) << 8) / 2147483648;
      else if (bits === 32) value = buffer.readInt32LE(at) / 2147483648;
      else value = 0;
      out[channel]![frame] = value;
    }
  }
  return { sampleRate, channels: out };
}

function writeWavFloat32(path: string, left: Float32Array, right: Float32Array, sampleRate: number): void {
  const frames = Math.min(left.length, right.length);
  const dataLength = frames * 2 * 4;
  const buffer = Buffer.alloc(44 + dataLength);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(3, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 8, 28);
  buffer.writeUInt16LE(8, 32);
  buffer.writeUInt16LE(32, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    buffer.writeFloatLE(left[i] ?? 0, offset); offset += 4;
    buffer.writeFloatLE(right[i] ?? 0, offset); offset += 4;
  }
  writeFileSync(path, buffer);
}

/**
 * The master chain: one gain, then a true-peak limiter.
 *
 * The mix decides how the film sounds; the master only sets its level. It adds
 * one constant gain towards -14 LUFS and holds the true peak under -1.5 dBTP
 * with a limiter, and the report records both numbers, so nothing is hidden
 * behind a normaliser. The gain is measured, not guessed: each pass measures
 * what the last render actually reached and adds the residual, because the
 * limiter takes back some of every gain increase. `MASTER_MAX_GAIN` bounds it —
 * a film that would need more than that to reach -14 is a quiet mix, and a
 * quiet mix is fixed in the mix, not squashed on the master.
 */
type Mastered = {
  gainDb: number;
  ceiling: number;
  passes: number;
  /** dB the limiter took off the loudest sample, at the master's final gain. */
  gainReductionDb: number;
  measured: ReturnType<typeof measure>;
};

function masterToTarget(ffmpeg: string, input: string, output: string): Mastered {
  let gainDb = 0;
  let ceiling = LIMITER_CEILING;
  let measured = measure(ffmpeg, input);
  let passes = 0;

  for (let pass = 0; pass < MASTER_PASSES; pass += 1) {
    const needed = TARGET_LUFS - measured.lufs;
    const tooPeaky = measured.truePeak > TARGET_TP;
    if (pass > 0 && Math.abs(needed) < 0.15 && !tooPeaky) break;

    gainDb = clamp(gainDb + needed, -MASTER_MAX_GAIN, MASTER_MAX_GAIN);
    if (pass > 0 && tooPeaky) ceiling = Math.max(0.5, ceiling * 0.94);
    run(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error", "-i", input,
      "-af", `volume=${gainDb.toFixed(2)}dB,alimiter=limit=${ceiling.toFixed(3)}:attack=5:release=50:level=disabled`,
      "-ar", "48000", output,
    ]);
    measured = measure(ffmpeg, output);
    passes = pass + 1;
  }

  // The gain is measured, so the report has to say what the limiter did with it:
  // a master that adds 6 dB and takes 3 of them back off the voice is a
  // different master from one that does not, and the difference is audible.
  // Both peaks come from the same true-peak meter that sets the delivery target;
  // `volumedetect` reads its samples as 16-bit, so a signal lifted over 0 dBFS
  // reports as 0 dB and the reduction reads as a fifth of what it is.
  const peakIn = truePeakAfterGain(ffmpeg, input, gainDb);
  const peakOut = measured.truePeak;
  return {
    gainDb: Number(gainDb.toFixed(2)),
    ceiling,
    passes,
    gainReductionDb: Number((peakIn - peakOut).toFixed(2)),
    measured,
  };
}

/** The true peak of `input` after `gainDb`, in dBTP, from the same meter as the target. */
function truePeakAfterGain(ffmpeg: string, input: string, gainDb: number): number {
  const output = run(ffmpeg, [
    "-hide_banner", "-i", input,
    "-af", `volume=${gainDb.toFixed(2)}dB,ebur128=peak=true`,
    "-f", "null", "-",
  ]);
  const summary = output.slice(output.lastIndexOf("Summary:"));
  return Number(summary.match(/Peak:\s*(-?[\d.]+)\s*dBFS/)?.[1] ?? "0");
}

/**
 * How the limiter's reduction is spread over the film: the level lost per 100 ms
 * window, between the premaster raised by the master's gain and the master.
 *
 * One sample number cannot be judged — a single clamped hit and a squashed
 * programme look the same in `limiterGainReductionDb`. This is the same
 * measurement as a distribution, so the report can say "the median window lost
 * 0.03 dB" next to "the loudest sample lost 7.5".
 */
function limiterWindows(
  premaster: string,
  master: string,
  gainDb: number,
): { p50: number; p90: number; p99: number; max: number; over3Db: number; windows: number } {
  const before = readWav(premaster);
  const after = readWav(master);
  const sr = before.sampleRate;
  const span = Math.max(1, Math.round(0.1 * sr));
  const scale = 10 ** (gainDb / 20);
  const frames = Math.min(before.channels[0]?.length ?? 0, after.channels[0]?.length ?? 0);
  const drops: number[] = [];
  for (let start = 0; start + span <= frames; start += span) {
    let inEnergy = 0;
    let outEnergy = 0;
    for (let i = start; i < start + span; i++) {
      const x = (((before.channels[0]?.[i] ?? 0) + (before.channels[1]?.[i] ?? 0)) / 2) * scale;
      const y = ((after.channels[0]?.[i] ?? 0) + (after.channels[1]?.[i] ?? 0)) / 2;
      inEnergy += x * x;
      outEnergy += y * y;
    }
    if (inEnergy < 1e-6) continue;
    drops.push(10 * Math.log10(inEnergy / Math.max(outEnergy, 1e-12)));
  }
  drops.sort((a, b) => a - b);
  const pick = (percent: number) => Number((drops[Math.min(drops.length - 1, Math.floor((percent / 100) * drops.length))] ?? 0).toFixed(2));
  return {
    p50: pick(50),
    p90: pick(90),
    p99: pick(99),
    max: Number((drops[drops.length - 1] ?? 0).toFixed(2)),
    over3Db: drops.filter((drop) => drop > 3).length,
    windows: drops.length,
  };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function measure(ffmpeg: string, input: string): { lufs: number; truePeak: number; lra: number } {
  const output = run(ffmpeg, ["-hide_banner", "-i", input, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const summary = output.slice(output.lastIndexOf("Summary:"));
  const lufs = Number(summary.match(/I:\s*(-?[\d.]+)\s*LUFS/)?.[1] ?? "NaN");
  const lra = Number(summary.match(/LRA:\s*(-?[\d.]+)\s*LU/)?.[1] ?? "NaN");
  const truePeak = Number(summary.match(/Peak:\s*(-?[\d.]+)\s*dBFS/)?.[1] ?? "NaN");
  return { lufs, truePeak, lra };
}

function run(binary: string, args: string[]): string {
  const result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    console.error(result.stderr?.slice(-1500) ?? "");
    throw new Error(`${binary} exited ${result.status}`);
  }
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}

function hashFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function relative(path: string): string {
  return path.replace(root + "\\", "").replace(root + "/", "").replace(/\\/g, "/");
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function findFfmpeg(): string {
  const candidates = [
    process.env.FFMPEG_PATH,
    resolve(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    resolve(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    "ffmpeg",
  ].filter((value): value is string => Boolean(value));
  const found = candidates.find((candidate) => candidate === "ffmpeg" || existsSync(candidate));
  if (!found) throw new Error("ffmpeg not found");
  return found;
}
