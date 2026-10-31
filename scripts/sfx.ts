import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { findFfmpeg, renderGrid, runBinary } from "../src/engine/grid.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run sfx -- <score.json>");
  process.exit(2);
}

const sr = 48_000;

async function main(scorePath: string): Promise<void> {
  const root = process.cwd();
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }
  const cues = plan.audio.sfx?.cues ?? [];
  if (cues.length === 0) {
    console.log("sfx: no cues");
    return;
  }

  const outDir = resolve(root, "build", score.id, "sfx");
  mkdirSync(outDir, { recursive: true });
  const total = Math.ceil((plan.duration + 0.5) * sr);
  const mix = new Float32Array(total * 2);

  for (const cue of cues) {
    const len = Math.ceil((cue.duration ?? defaultLength(cue.kind)) * sr);
    const samples = synth(cue.kind, len, cue.id);
    let samplePeak = 0;
    for (const value of samples) samplePeak = Math.max(samplePeak, Math.abs(value));
    const normalize = samplePeak > 0 ? 1 / samplePeak : 1;
    for (let i = 0; i < samples.length; i++) samples[i] = (samples[i] ?? 0) * normalize;
    const gain = cue.gain ?? kindGain(cue.kind);
    const start = Math.round(cue.at * sr);
    const pan = cue.pan ?? 0;
    for (let i = 0; i < samples.length; i++) {
      const s = (samples[i] ?? 0) * gain;
      const l = s * Math.sqrt(0.5 * (1 - pan));
      const r = s * Math.sqrt(0.5 * (1 + pan));
      const at = (start + i) * 2;
      if (at + 1 < mix.length) {
        mix[at] = (mix[at] ?? 0) + l;
        mix[at + 1] = (mix[at + 1] ?? 0) + r;
      }
    }
    writeWav(resolve(outDir, `${cue.id}.wav`), samples, gain, pan);
  }

  let peak = 0;
  for (const value of mix) peak = Math.max(peak, Math.abs(value));
  const norm = peak > 0.9 ? 0.9 / peak : 1;
  for (let i = 0; i < mix.length; i++) mix[i] = (mix[i] ?? 0) * norm;
  writeWav(resolve(outDir, "mix.wav"), mix, 1, 0, true);

  console.log(`sfx: ${cues.length} cues → build/${score.id}/sfx/mix.wav`);

  if (!args.includes("--no-sheet")) {
    await spectrogramSheet(root, score.id, outDir, cues);
  }
}

/**
 * G6 asks for a spectrogram per cue on one image. ffmpeg's `showspectrumpic`
 * turns each generated cue into a time x frequency picture; the one grid helper
 * tiles them, labelled with the cue and the picture event it sits on.
 */
async function spectrogramSheet(
  root: string,
  filmId: string,
  outDir: string,
  cues: Array<{ id: string; kind: string; at: number }>,
): Promise<void> {
  const framesDir = join(outDir, "spectrograms");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  const ffmpeg = findFfmpeg();
  const tileW = 480;
  const tileH = 200;
  const tiles: { image: string; label: string }[] = [];
  for (const cue of cues) {
    const wav = resolve(outDir, `${cue.id}.wav`);
    if (!existsSync(wav)) continue;
    const image = join(framesDir, `${cue.id}.png`);
    await runBinary(
      ffmpeg,
      ["-y", "-hide_banner", "-loglevel", "error", "-i", wav, "-lavfi", `showspectrumpic=s=${tileW}x${tileH}:legend=0`, "-frames:v", "1", image],
      { cwd: root },
    );
    if (!existsSync(image)) throw new Error(`no spectrogram for cue ${cue.id}`);
    tiles.push({ image, label: `${cue.id} · ${cue.kind} @ ${cue.at.toFixed(2)}s` });
  }
  if (tiles.length === 0) return;

  const sheet = join(outDir, "spectrogram-sheet.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles,
    tileWidth: tileW,
    tileHeight: tileH,
    font: "proofs/s2-paper/assets/fonts/DMMono-Regular.ttf",
    labelDir: `build/${filmId}/sfx/labels`,
  });
  writeFileSync(
    join(outDir, "spectrogram.json"),
    `${JSON.stringify(
      {
        film: filmId,
        cues: tiles.length,
        sheet: `build/${filmId}/sfx/spectrogram-sheet.png`,
        grid: { cols: grid.cols, rows: grid.rows, width: grid.width, height: grid.height },
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`sfx: spectrogram sheet ${grid.cols}×${grid.rows} → build/${filmId}/sfx/spectrogram-sheet.png`);
}

main(file).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

function kindGain(kind: string): number {
  switch (kind) {
    case "slam": return 0.9;
    case "snap": return 0.7;
    case "step": return 0.55;
    case "lamp": return 0.5;
    case "whoosh": return 0.6;
    case "crowd": return 0.55;
    case "confetti": return 0.6;
    case "iris": return 0.55;
    case "room": return 0.1;
    default: return 0.5;
  }
}

function defaultLength(kind: string): number {
  switch (kind) {
    case "lamp": return 0.6;
    case "snap": return 0.14;
    case "whoosh": return 0.5;
    case "slam": return 0.4;
    case "step": return 0.18;
    case "crowd": return 1.4;
    case "confetti": return 0.8;
    case "iris": return 0.9;
    case "room": return 30;
    default: return 0.35;
  }
}

function synth(kind: string, len: number, seedText: string): Float32Array {
  const out = new Float32Array(len);
  const rng = mulberry32(hash(seedText));
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const noise = rng() * 2 - 1;
    let value = 0;
    switch (kind) {
      case "snap":
        value = noise * Math.exp(-t * 70) * 0.9 + Math.sin(2 * Math.PI * 2200 * t) * Math.exp(-t * 120) * 0.3;
        break;
      case "slam":
        value = Math.sin(2 * Math.PI * 72 * t) * Math.exp(-t * 11) * 0.8
          + noise * Math.exp(-t * 45) * 0.5;
        break;
      case "lamp":
        value = (Math.sin(2 * Math.PI * 118 * t) * 0.35 + Math.sin(2 * Math.PI * 236 * t) * 0.12)
          * (0.55 + 0.45 * Math.sin(2 * Math.PI * 7 * t))
          * Math.min(1, t * 12) * Math.exp(-t * 1.6);
        break;
      case "whoosh": {
        lp = lp + 0.08 * (noise - lp);
        const env = Math.sin(Math.PI * Math.min(1, t / (len / sr)));
        value = lp * env * 1.1;
        break;
      }
      case "step":
        value = Math.sin(2 * Math.PI * 92 * t) * Math.exp(-t * 26) * 0.7
          + noise * Math.exp(-t * 80) * 0.25;
        break;
      case "crowd": {
        lp = lp + 0.02 * (noise - lp);
        const env = Math.min(1, t * 2.2) * Math.max(0, 1 - t / (len / sr));
        value = (lp * 1.6 + noise * 0.08) * env;
        break;
      }
      case "confetti": {
        const tick = Math.exp(-((t * 9) % 1) * 18);
        value = noise * tick * Math.exp(-t * 2.2) * 0.8;
        break;
      }
      case "room": {
        lp = lp + 0.003 * (noise - lp);
        value = lp * 0.55 * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.17 * t));
        break;
      }
      case "iris": {
        const f = 420 - 220 * Math.min(1, t / (len / sr));
        value = Math.sin(2 * Math.PI * f * t) * 0.22 * Math.exp(-t * 2)
          + noise * 0.08 * Math.exp(-t * 3);
        break;
      }
      default:
        value = noise * Math.exp(-t * 20) * 0.5;
    }
    out[i] = value;
  }
  return out;
}

function writeWav(path: string, samples: Float32Array, gain: number, pan: number, stereo = false): void {
  const channels = stereo ? 2 : 1;
  const length = samples.length * 2;
  const buffer = Buffer.alloc(44 + length);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + length, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sr, 24);
  buffer.writeUInt32LE(sr * channels * 2, 28);
  buffer.writeUInt16LE(channels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(length, 40);
  let offset = 44;
  if (!stereo) {
    for (let i = 0; i < samples.length; i++) {
      const value = samples[i] ?? 0;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * gain)) * 32767), offset);
      offset += 2;
    }
  } else {
    for (let i = 0; i < samples.length; i += 2) {
      const left = samples[i] ?? 0;
      const right = samples[i + 1] ?? 0;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left)) * 32767), offset); offset += 2;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right)) * 32767), offset); offset += 2;
    }
  }
  writeFileSync(path, buffer);
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
