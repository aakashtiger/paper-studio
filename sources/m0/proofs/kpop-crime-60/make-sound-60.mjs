/**
 * `make-sound-60` — the 60 s proof's sound report.
 *
 * The narration is the film's voice. It measures -18.1 LUFS / -3.8 dBTP, so
 * it is normalised once with ffmpeg's loudnorm to -14 LUFS / -1.5 dBTP and
 * written as `mix.wav`; the raw measurement stays in sound.json beside it.
 * The 12 cues are bound to measured words in test-words.js, not typed times.
 *
 * usage: node proofs/kpop-crime-60/make-sound-60.mjs
 * writes proofs/kpop-crime-60/mix.wav and proofs/kpop-crime-60/sound.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import ffmpegPath from "ffmpeg-static";

const ROOT = "proofs/kpop-crime-60";
const VOICE = `${ROOT}/voice.wav`;
const MIX = `${ROOT}/mix.wav`;
const SOUND = `${ROOT}/sound.json`;

// 12 cues, one per act beat. Each names the measured word it lands on.
const CUES = [
  { shot: "s01", id: "knife", kind: "click", word: "knife," },
  { shot: "s02", id: "sheet", kind: "paper", word: "sheet." },
  { shot: "s03", id: "file", kind: "paper", word: "file" },
  { shot: "s06", id: "tunnel", kind: "whoosh", word: "tunnel," },
  { shot: "s07", id: "room", kind: "paper", word: "room," },
  { shot: "s08", id: "door", kind: "thud", word: "door" },
  { shot: "s09", id: "page", kind: "paper", word: "page" },
  { shot: "s11", id: "lamp", kind: "chime", word: "lamp" },
  { shot: "s15", id: "cuffs", kind: "click", word: "cuffs" },
  { shot: "s16", id: "cell", kind: "thud", word: "cell," },
  { shot: "s18", id: "gavel", kind: "stamp", word: "gavel" },
  { shot: "s21", id: "bell", kind: "bell", word: "noose" },
];

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(`${ROOT}/test-words.js`, "utf8"), sandbox);
const W = sandbox.window;
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, "");

function wordTime(shotId, word) {
  const line = W.KPOP_LINES.find((l) => l.shot === shotId);
  if (!line) throw new Error(`no line for ${shotId}`);
  const hit = line.words.find((w) => norm(w.w) === norm(word));
  if (!hit) throw new Error(`${shotId}: "${word}" is not in the line`);
  return hit.t;
}

function measure(path) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", path, "-af", "ebur128=peak=true",
    "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null"], { encoding: "utf8" });
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  const lufs = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].pop();
  const peak = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)].pop();
  if (!lufs || !peak) throw new Error(`could not measure ${path}`);
  return { lufs: Number(lufs[1]), truePeak: Number(peak[1]) };
}

const voice = measure(VOICE);
const inBand = (m) => Math.abs(m.lufs + 14) <= 1 && Math.abs(m.truePeak + 1.5) <= 0.5;

let source = "voice";
let delivered = voice;
if (!inBand(voice)) {
  const r = spawnSync(ffmpegPath, ["-y", "-hide_banner", "-loglevel", "error", "-i", VOICE,
    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", MIX], { encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`make-sound-60: loudnorm failed\n${r.stderr || ""}`);
    process.exit(1);
  }
  delivered = measure(MIX);
  source = "voice-normalized";
}

const list = CUES.map((cue) => ({ ...cue, t: wordTime(cue.shot, cue.word) }));
const sound = {
  cues: list.length,
  lufs: delivered.lufs,
  truePeak: delivered.truePeak,
  source,
  target: { lufs: -14, truePeak: -1.5 },
  voice,
  normalized: source !== "voice",
  audio: source === "voice" ? VOICE : MIX,
  list,
};
writeFileSync(SOUND, `${JSON.stringify(sound, null, 2)}\n`, "utf8");

console.log(`make-sound-60: voice ${voice.lufs} LUFS / ${voice.truePeak} dBTP -> ${source} ${delivered.lufs} LUFS / ${delivered.truePeak} dBTP`);
console.log(`  ${list.length} cues: ${list.map((c) => `${c.shot}/${c.id}@${c.t}`).join(", ")}`);
