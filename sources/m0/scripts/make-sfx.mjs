/**
 * `make-sfx` — bind short paper-theatre SFX to the sync table and mix them
 * under the measured narration. One source of truth: sync.js.
 *
 * usage: node scripts/make-sfx.mjs
 * writes proofs/kpop-test/sfx.wav, mix.wav and sound.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import ffmpegPath from "ffmpeg-static";

const root = "proofs/kpop-test";
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(`${root}/sync.js`, "utf8"), sandbox);
const S = sandbox.window.KPOP_SYNC;
const TAU = Math.PI * 2;
const SR = 48000, DUR = 25.2, N = Math.round(SR * DUR);

const cues = [
  ["s1", "lampOn", "click", 1400, 0.20],
  ["s1", "cardDrop", "paper", 0, 0.14],
  ["s1", "spotNova", "click", 1800, 0.22],
  ["s1", "novaStep", "thud", 0, 0.15],
  ["s2", "crowdInhale", "whoosh", 0, 0.10],
  ["s2", "novaBreath", "breath", 0, 0.07],
  ["s3", "workLight", "click", 900, 0.18],
  ["s3", "cardFlutter", "paper", 0, 0.14],
  ["s3", "starFall", "whoosh", 0, 0.12],
  ["s3", "starLand", "chime", 0, 0.14],
  ["s4", "miraReach", "paper", 0, 0.10],
  ["s4", "starGlow", "chime", 0, 0.12],
  ["s5", "starHand", "chime", 0, 0.14],
  ["s6", "curtainHalf", "whoosh", 0, 0.12],
  ["s6", "listStamp", "stamp", 0, 0.16],
  ["s7", "spotLand", "click", 1600, 0.18],
  ["s8", "miraCard", "paper", 0, 0.14],
  ["s8", "miraPoint", "click", 1200, 0.16],
  ["s9", "curtainStart", "whoosh", 0, 0.12],
  ["s9", "curtainOpen", "whoosh", 0, 0.10],
  ["s9", "novaBow", "applause", 0, 0.12],
  ["s9", "finalTitle", "bell", 0, 0.12],
];

const out = new Float32Array(N * 2);
let seed = 1234567;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const add = (t0, dur, gain, fn) => {
  const start = Math.max(0, Math.round(t0 * SR));
  const end = Math.min(N, start + Math.round(dur * SR));
  for (let i = start; i < end; i++) {
    const t = (i - start) / SR;
    const v = fn(t) * gain;
    out[i * 2] += v; out[i * 2 + 1] += v;
  }
};

const synth = {
  click: (f) => (t) => (Math.sin(TAU * f * t) * 0.7 + rnd() * 0.3) * Math.exp(-t * 90),
  paper: () => { let prev = 0; return (t) => { const n = rnd(); const hp = n - prev; prev = n; return hp * Math.exp(-t * 18); }; },
  whoosh: () => { let lp = 0; return (t) => { const n = rnd(); const k = 0.02 + 0.18 * Math.sin(Math.min(1, t / 0.5) * Math.PI); lp += (n - lp) * k; return lp * Math.sin(Math.min(1, t / 0.5) * Math.PI) * 2; }; },
  chime: () => (t) => (Math.sin(TAU * 880 * t) + 0.45 * Math.sin(TAU * 1320 * t)) * Math.exp(-t * 4.2),
  thud: () => (t) => (Math.sin(TAU * 72 * t) + 0.35 * Math.sin(TAU * 144 * t)) * Math.exp(-t * 18),
  bell: () => (t) => (Math.sin(TAU * 660 * t) + 0.4 * Math.sin(TAU * 990 * t)) * Math.exp(-t * 3),
  stamp: () => { let prev = 0; return (t) => { const n = rnd(); const hp = n - prev; prev = n; return (Math.sin(TAU * 90 * t) * Math.exp(-t * 20) + hp * Math.exp(-t * 30) * 0.6); }; },
  breath: () => { let lp = 0; return (t) => { lp += (rnd() - lp) * 0.03; return lp * Math.sin(Math.min(1, t / 0.6) * Math.PI); }; },
  applause: () => (t) => { let v = 0; for (let k = 0; k < 5; k++) v += (rnd() > 0.72 ? 1 : 0) * (rnd() * 0.4 + 0.6); return v * Math.exp(-t * 1.4) * 0.5; },
};

const list = [];
for (const [shot, id, kind, f, gain] of cues) {
  const t = S[shot] && S[shot][id];
  if (t === undefined) { console.log(`missing ${shot}/${id}`); continue; }
  const fn = kind === "click" ? synth.click(f) : synth[kind]();
  add(t, kind === "chime" || kind === "bell" ? 1.1 : kind === "applause" ? 1.5 : kind === "whoosh" ? 0.55 : 0.3, gain, fn);
  list.push({ shot, id, kind, t: +t.toFixed(3) });
}

// 16-bit stereo WAV
const data = Buffer.alloc(44 + N * 4);
data.write("RIFF", 0); data.writeUInt32LE(36 + N * 4, 4); data.write("WAVE", 8);
data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34);
data.write("data", 36); data.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N * 2; i++) {
  const v = Math.max(-1, Math.min(1, out[i]));
  data.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
}
writeFileSync(`${root}/sfx.wav`, data);

const ff = (args) => spawnSync(ffmpegPath, args, { encoding: "utf8" });
const mix = ff(["-y", "-loglevel", "error", "-i", `${root}/voice-master.wav`, "-i", `${root}/sfx.wav`,
  "-filter_complex", "[1:a]volume=0.9[sfx];[0:a][sfx]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11",
  "-ar", "48000", "-ac", "2", `${root}/mix.wav`]);
if (mix.status !== 0) { console.error(mix.stderr); process.exit(1); }

const meas = ff(["-hide_banner", "-i", `${root}/mix.wav`, "-af", "ebur128=peak=true", "-f", "null", "NUL"]);
const text = `${meas.stdout || ""}\n${meas.stderr || ""}`;
const lufsM = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)];
const lufs = Number(lufsM.length ? lufsM[lufsM.length - 1][1] : NaN);
const tpM = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)];
const tp = Number(tpM.length ? tpM[tpM.length - 1][1] : NaN);
const sound = { cues: list.length, lufs, truePeak: tp, list };
writeFileSync(`${root}/sound.json`, JSON.stringify(sound, null, 2) + "\n");
console.log(`make-sfx: ${list.length} cues, ${lufs} LUFS, ${tp} dBTP`);
