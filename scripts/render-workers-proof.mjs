/**
 * A frame is pure, so the number of browsers painting cannot change the film.
 *
 * This renders the same window of a film twice — once with one worker, once with
 * `--workers N` — and compares two things:
 *
 *   1. every frame PNG, byte for byte. This is the strong claim: the same frame
 *      index produced the same pixels in a different process, a different
 *      browser and in a different order relative to its neighbours.
 *   2. the encoded video stream hash of both MP4s, which is the engine's existing
 *      definition of "the same picture" (decision 0023). Where the two disagree,
 *      the parallel renderer is wrong, not the hash.
 *
 * usage: npm run render:workers -- <score.json> [--from 20] [--to 22] [--workers 4]
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const scorePath = args.find((value) => !value.startsWith("--") && value.endsWith(".json"));
if (!scorePath) {
  console.error("usage: npm run render:workers -- <score.json> [--from 20] [--to 22] [--workers 4]");
  process.exit(2);
}
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const from = Number(flag("from", 20));
const to = Number(flag("to", 22));
const workers = Number(flag("workers", 4));
const score = JSON.parse(readFileSync(scorePath, "utf8"));
const build = resolve("build", score.id);
const root = join(build, "workers-proof");
if (!(to > from)) {
  console.error(`error: --from ${from} --to ${to} selects no time`);
  process.exit(2);
}

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (found) return found;
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  throw new Error("ffmpeg not found");
}

const ffmpeg = findFfmpeg();
const sha256 = (file) => `sha256:${createHash("sha256").update(readFileSync(file)).digest("hex")}`;
const picture = (file) => {
  const result = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-i", resolve(file), "-map", "0:v:0", "-c", "copy", "-f", "streamhash", "-hash", "sha256", "-"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  const match = /SHA256=([0-9a-f]+)/i.exec(String(result.stdout ?? ""));
  return match ? `sha256:${match[1]}` : null;
};

function render(tag, count) {
  const frames = join(root, `${tag}-frames`);
  const video = join(root, `${tag}.mp4`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const started = Date.now();
  const run = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "tsx",
      "scripts/render-film.ts",
      scorePath,
      "--out",
      video,
      "--from",
      String(from),
      "--to",
      String(to),
      "--workers",
      String(count),
      "--keep-frames",
      frames,
    ],
    { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", shell: process.platform === "win32" },
  );
  if (run.status !== 0) {
    console.error(run.stdout ?? "");
    console.error(run.stderr ?? "");
    throw new Error(`${tag}: render failed (${run.status})`);
  }
  const files = readdirSync(frames).filter((name) => name.endsWith(".png")).sort();
  return {
    tag,
    workers: count,
    seconds: Math.round((Date.now() - started) / 100) / 10,
    video,
    frameCount: files.length,
    frames: files.map((name) => ({ name, bytes: statSync(join(frames, name)).size, hash: sha256(join(frames, name)) })),
  };
}

mkdirSync(root, { recursive: true });
console.log(`window: ${from}s–${to}s of ${score.id} · serial then ${workers} workers`);
const serial = render("w1", 1);
const parallel = render(`w${workers}`, workers);

const a = new Map(serial.frames.map((frame) => [frame.name, frame.hash]));
const b = new Map(parallel.frames.map((frame) => [frame.name, frame.hash]));
const missing = [...a.keys()].filter((name) => !b.has(name));
const extra = [...b.keys()].filter((name) => !a.has(name));
const differing = [...a.entries()].filter(([name, hash]) => b.has(name) && b.get(name) !== hash).map(([name]) => name);
const framesMatch =
  serial.frameCount > 0 && serial.frameCount === parallel.frameCount && missing.length === 0 && extra.length === 0 && differing.length === 0;

const serialPicture = picture(serial.video);
const parallelPicture = picture(parallel.video);
const pictureMatch = serialPicture !== null && serialPicture === parallelPicture;

const report = {
  film: score.id,
  window: { from, to },
  serial: { workers: 1, seconds: serial.seconds, frames: serial.frameCount, video: serial.video, videoHash: serialPicture },
  parallel: { workers, seconds: parallel.seconds, frames: parallel.frameCount, video: parallel.video, videoHash: parallelPicture },
  speedup: serial.seconds > 0 ? Math.round((serial.seconds / Math.max(parallel.seconds, 0.1)) * 10) / 10 : null,
  framesMatch,
  pictureMatch,
  missing,
  extra,
  differing,
  pass: framesMatch && pictureMatch,
};
writeFileSync(join(build, "workers-proof.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(
  `frames: ${serial.frameCount} vs ${parallel.frameCount} · ` +
    (framesMatch ? "IDENTICAL BYTES" : `${differing.length} differ, ${missing.length} missing, ${extra.length} extra`),
);
console.log(`picture: ${pictureMatch ? "same" : "DIFFERS"} · ${String(parallelPicture).slice(0, 24)}...`);
console.log(
  `time: ${serial.seconds}s serial → ${parallel.seconds}s on ${workers} workers` +
    (report.speedup ? ` · ${report.speedup}×` : ""),
);
console.log(`report: build/${score.id}/workers-proof.json`);
process.exit(report.pass ? 0 : 1);
