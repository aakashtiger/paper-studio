/**
 * Final audio master.
 *
 * Reads the recorded voice and the per-cue SFX written by `npm run sfx`, runs
 * them through the mix bus in `src/engine/mix.ts`, then masters the result to
 * -14.0 LUFS / -1.5 dBTP with ffmpeg's two-pass loudnorm. Writes a report with
 * the measured loudness and the input hashes.
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
masterWithLoudnorm(ffmpeg, premaster, master);
const measured = measure(ffmpeg, master);

const pass = Math.abs(measured.lufs - TARGET_LUFS) <= 0.5 && measured.truePeak <= TARGET_TP + 0.1;
const report = {
  film: score.id,
  target: { lufs: TARGET_LUFS, truePeak: TARGET_TP },
  measured: { lufs: measured.lufs, truePeak: measured.truePeak, lra: measured.lra },
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
console.log(`master: ${measured.lufs.toFixed(1)} LUFS · ${measured.truePeak.toFixed(1)} dBTP (target ${TARGET_LUFS} / ${TARGET_TP})`);
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

function masterWithLoudnorm(ffmpeg: string, input: string, output: string): void {
  const first = run(ffmpeg, [
    "-hide_banner", "-i", input,
    "-af", `loudnorm=I=${TARGET_LUFS}:TP=${TARGET_TP}:LRA=11:print_format=json`,
    "-f", "null", "-",
  ]);
  const json = first.slice(first.lastIndexOf("{"));
  const measured = JSON.parse(json) as Record<string, string>;
  const filter = [
    `loudnorm=I=${TARGET_LUFS}:TP=${TARGET_TP}:LRA=11`,
    `measured_I=${measured.input_i}`,
    `measured_TP=${measured.input_tp}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    "linear=true",
  ].join(":");
  run(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", input, "-af", filter, "-ar", "48000", output]);
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
