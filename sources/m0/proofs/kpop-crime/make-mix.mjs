/**
 * `make-mix` — the proof's delivered sound, built in code from sound.json.
 *
 * A low room bed carries the loudness; a short click marks every cue. The mix
 * is measured with ffmpeg's ebur128 and the measured lufs / truePeak are
 * written back into sound.json, so the file and the report cannot disagree.
 *
 * The bed is deterministic (a fixed LCG, no Math.random), 21 s, 48 kHz stereo.
 *
 * usage: node proofs/kpop-crime/make-mix.mjs
 * writes proofs/kpop-crime/mix.wav and updates proofs/kpop-crime/sound.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const ROOT = "proofs/kpop-crime";
const soundPath = `${ROOT}/sound.json`;
const wavPath = `${ROOT}/mix.wav`;
const SR = 48000;
const DUR = 21.0;
const N = Math.round(SR * DUR);
const TAU = Math.PI * 2;
const TARGET_LUFS = -14.0;
const TARGET_TP = -1.6; // inside -1.5±0.5 before AAC, and still inside after it

const sound = JSON.parse(readFileSync(soundPath, "utf8"));
if (!Array.isArray(sound.list) || !sound.list.length) {
  console.error(`make-mix: ${soundPath} has no cue list`);
  process.exit(1);
}

// Deterministic noise source: the same mix every run.
let seed = 0x9e3779b9;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 * 2 - 1;
};

// Low bed: a 110 Hz hum with a 55 Hz sub and a little filtered air.
const bedL = new Float32Array(N);
const bedR = new Float32Array(N);
let lpL = 0, lpR = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const env = 0.72 + 0.28 * Math.sin(TAU * 0.045 * t + 0.4);
  const humL = 0.62 * Math.sin(TAU * 110 * t)
    + 0.28 * Math.sin(TAU * 55 * t + 0.7)
    + 0.10 * Math.sin(TAU * 165 * t + 1.3);
  const humR = 0.62 * Math.sin(TAU * 110 * t + 0.05)
    + 0.28 * Math.sin(TAU * 55 * t + 0.75)
    + 0.10 * Math.sin(TAU * 165 * t + 1.35);
  lpL += (rnd() - lpL) * 0.015;
  lpR += (rnd() - lpR) * 0.015;
  bedL[i] = (humL + 0.35 * lpL) * env;
  bedR[i] = (humR + 0.35 * lpR) * env;
}

// Normalise the bed to unit RMS; the calibration loop sets its level.
let bedEnergy = 0;
for (let i = 0; i < N; i++) bedEnergy += bedL[i] * bedL[i] + bedR[i] * bedR[i];
const bedRms = Math.sqrt(bedEnergy / (2 * N));
for (let i = 0; i < N; i++) { bedL[i] /= bedRms; bedR[i] /= bedRms; }

// Duck the bed under each cue so the click is the event, not a fight.
const duck = new Float32Array(N).fill(1);
for (const cue of sound.list) {
  const centre = Math.round(cue.t * SR);
  const half = Math.round(0.12 * SR);
  for (let i = Math.max(0, centre - half); i < Math.min(N, centre + half); i++) {
    const u = Math.abs(i - centre) / half;
    const d = 0.35 + 0.65 * u * u * (3 - 2 * u);
    if (d < duck[i]) duck[i] = d;
  }
}

// Short clicks at the cue times. The kind chooses the pitch, never the timing.
const clickL = new Float32Array(N);
const clickR = new Float32Array(N);
for (const cue of sound.list) {
  const start = Math.round(cue.t * SR);
  const len = Math.round(0.07 * SR);
  const f = cue.kind === "bell" ? 1320 : cue.kind === "chime" ? 1760
    : cue.kind === "thud" ? 220 : cue.kind === "whoosh" ? 900 : 1800;
  const decay = cue.kind === "bell" ? 18 : 80;
  for (let j = 0; j < len && start + j < N; j++) {
    const t = j / SR;
    const e = Math.exp(-t * decay);
    const v = (Math.sin(TAU * f * t) * 0.75 + rnd() * 0.25) * e;
    clickL[start + j] += v;
    clickR[start + j] += v * 0.98;
  }
}

// Normalise the click layer to unit peak; the calibration loop sets its level.
let clickPeak = 0;
for (let i = 0; i < N; i++) clickPeak = Math.max(clickPeak, Math.abs(clickL[i]), Math.abs(clickR[i]));
for (let i = 0; i < N; i++) { clickL[i] /= clickPeak; clickR[i] /= clickPeak; }

const render = (bedGain, clickGain) => {
  const mix = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    mix[i * 2] = bedGain * bedL[i] * duck[i] + clickGain * clickL[i];
    mix[i * 2 + 1] = bedGain * bedR[i] * duck[i] + clickGain * clickR[i];
  }
  return mix;
};

const writeWav = (mix) => {
  const data = Buffer.alloc(44 + N * 4);
  data.write("RIFF", 0); data.writeUInt32LE(36 + N * 4, 4); data.write("WAVE", 8);
  data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34);
  data.write("data", 36); data.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N * 2; i++) {
    const v = Math.max(-1, Math.min(1, mix[i]));
    data.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(wavPath, data);
};

const measure = () => {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", wavPath, "-af", "ebur128=peak=true",
    "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null"], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  const lufsM = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)];
  const tpM = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)];
  if (!lufsM.length || !tpM.length) return null;
  return {
    lufs: Number(lufsM[lufsM.length - 1][1]),
    truePeak: Number(tpM[tpM.length - 1][1]),
  };
};

// Calibrate the bed to -14 LUFS and the clicks to -1.7 dBTP. Short clicks add
// almost no integrated energy, so the two adjustments converge in a few passes.
let bedGain = 0.5, clickGain = 0.7, measured = null;
for (let pass = 0; pass < 12; pass++) {
  const mix = render(bedGain, clickGain);
  let peak = 0;
  for (let i = 0; i < N * 2; i++) peak = Math.max(peak, Math.abs(mix[i]));
  if (peak > 0.999) {
    const k = 0.999 / peak;
    bedGain *= k; clickGain *= k;
    continue;
  }
  writeWav(mix);
  measured = measure();
  if (!measured) {
    console.error("make-mix: ffmpeg could not measure mix.wav");
    process.exit(1);
  }
  const dL = TARGET_LUFS - measured.lufs;
  const dP = TARGET_TP - measured.truePeak;
  console.log(`  pass ${pass + 1}: bed ${bedGain.toFixed(4)} click ${clickGain.toFixed(4)} -> ${measured.lufs} LUFS / ${measured.truePeak} dBTP`);
  if (Math.abs(dL) <= 0.03 && Math.abs(dP) <= 0.03) break;
  bedGain *= Math.pow(10, dL / 20);
  clickGain *= Math.pow(10, dP / 20);
}

if (!measured) {
  console.error("make-mix: no measurement");
  process.exit(1);
}
const lufsOk = Math.abs(measured.lufs - TARGET_LUFS) <= 1;
const peakOk = Math.abs(measured.truePeak - -1.5) <= 0.5;
if (!lufsOk || !peakOk) {
  console.error(`make-mix: ${measured.lufs} LUFS / ${measured.truePeak} dBTP is outside -14±1 / -1.5±0.5`);
  process.exit(1);
}

sound.cues = sound.list.length;
sound.lufs = measured.lufs;
sound.truePeak = measured.truePeak;
writeFileSync(soundPath, JSON.stringify(sound, null, 2) + "\n");
console.log(`make-mix: ${sound.cues} cues, ${DUR.toFixed(1)}s ${SR / 1000}kHz stereo, ${measured.lufs} LUFS, ${measured.truePeak} dBTP -> ${wavPath}`);
