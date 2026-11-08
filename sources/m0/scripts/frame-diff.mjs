/**
 * Per-frame change measurement on the delivered 30 fps picture.
 *
 * For every consecutive pair of source frames (30 fps), this measures the mean
 * absolute luma difference on a 192x108 reduction, plus a 3x3 region map. It is
 * a floor detector, not a taste detector: it finds runs where the picture is
 * frozen, and it shows which part of the frame is carrying the change.
 *
 * usage: node scripts/frame-diff.mjs [video] [out.json]
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ffmpegPath from "ffmpeg-static";

const video = process.argv[2] || "out/claude-pop.mp4";
const outPath = process.argv[3] || "out/analysis/frame-diff.json";
const shotsPath = process.argv[4] || "out/analysis/shots.json";
const W = 192, H = 108, FPS = 30;
const REG_W = W / 3, REG_H = H / 3;

const p = spawn(ffmpegPath, [
  "-v", "error", "-i", video,
  "-vf", `scale=${W}:${H},format=gray,tblend=all_mode=difference`,
  "-f", "rawvideo", "-pix_fmt", "gray", "-",
], { stdio: ["ignore", "pipe", "inherit"] });

let buf = Buffer.alloc(0);
const frames = [];
const sz = W * H;

p.stdout.on("data", (d) => {
  buf = Buffer.concat([buf, d]);
  while (buf.length >= sz) {
    const f = buf.subarray(0, sz);
    buf = buf.subarray(sz);
    let sum = 0, max = 0;
    const regions = new Array(9).fill(0);
    const counts = new Array(9).fill(0);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = f[y * W + x];
        sum += v;
        if (v > max) max = v;
        const r = Math.min(2, (y / REG_H) | 0) * 3 + Math.min(2, (x / REG_W) | 0);
        regions[r] += v;
        counts[r]++;
      }
    }
    const n = frames.length;
    frames.push({
      i: n,
      t: +((n + 1) / FPS).toFixed(4),
      mean: +(sum / sz).toFixed(3),
      max,
      regions: regions.map((s, r) => +(s / counts[r]).toFixed(3)),
    });
  }
});

p.on("close", (code) => {
  if (code !== 0) { console.error(`ffmpeg exited ${code}`); process.exit(1); }
  const shots = JSON.parse(readFileSync(shotsPath, "utf8"));
  const shotStats = shots.map((s) => {
    const a = Math.max(0, Math.round(s.start * FPS) - 1);
    const b = Math.min(frames.length - 1, Math.round(s.end * FPS) - 1);
    const rows = frames.slice(a, b + 1);
    const means = rows.map((r) => r.mean);
    const sorted = [...means].sort((x, y) => x - y);
    const q = (p) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : 0;
    let longest = { under05: 0, under10: 0, under20: 0 };
    const run = { under05: 0, under10: 0, under20: 0 };
    for (const m of means) {
      for (const [k, th] of [["under05", 0.5], ["under10", 1.0], ["under20", 2.0]]) {
        if (m < th) { run[k]++; if (run[k] > longest[k]) longest[k] = run[k]; }
        else run[k] = 0;
      }
    }
    return {
      id: s.id, act: s.act, start: s.start, end: s.end, duration: s.duration,
      frames: rows.length,
      mean: +(means.reduce((x, y) => x + y, 0) / Math.max(1, means.length)).toFixed(3),
      median: q(0.5), p10: q(0.1), p90: q(0.9), min: Math.min(...means), max: Math.max(...means),
      frozenFrames: means.filter((m) => m < 0.5).length,
      quietFrames: means.filter((m) => m < 1.0).length,
      longestRunUnder05: longest.under05,
      longestRunUnder10: longest.under10,
      longestRunUnder20: longest.under20,
    };
  });
  mkdirSync(dirname(outPath), { recursive: true });
  const videoHash = createHash("sha256").update(readFileSync(video)).digest("hex");
  writeFileSync(outPath, `${JSON.stringify({ video, videoHash, fps: FPS, width: W, height: H, frames, shots: shotStats }, null, 2)}\n`);
  console.log(`${frames.length} frame diffs -> ${resolve(outPath)}`);
  for (const s of shotStats) {
    console.log(`${s.act}-${s.id.padEnd(12)} ${String(s.duration).padStart(5)}s mean ${String(s.mean).padStart(6)} med ${String(s.median).padStart(6)} min ${String(s.min).padStart(5)} frozen ${String(s.frozenFrames).padStart(3)} quiet ${String(s.quietFrames).padStart(3)} maxRun<1 ${s.longestRunUnder10}`);
  }
});
