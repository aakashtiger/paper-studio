import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

/**
 * Determinism check at the level that matters: two independently rendered
 * films of the same score. Identical MP4 bytes are a stronger claim than
 * identical frame PNGs — the encode is a function of the frames, and the
 * frames are a function of the score.
 *
 * The report also carries each file's **picture hash** (sha256 over the video
 * stream). Two renders that differ only in their audio still have the same
 * picture, and the gate needs to know whether the film it ships is that
 * picture — byte equality alone cannot say that when the audio was re-cut
 * after the render.
 *
 * usage: node scripts/compare-renders.mjs <a.mp4> <b.mp4> [--out <report.json>]
 */
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const out = outIndex === -1 ? "build/understudy/determinism.json" : args[outIndex + 1];
const files = args.filter((value, index) => !value.startsWith("--") && !(outIndex !== -1 && index === outIndex + 1));
const [fileA, fileB] = files;
if (!fileA || !fileB) {
  console.error("usage: node scripts/compare-renders.mjs <a.mp4> <b.mp4> [--out <report.json>]");
  process.exit(2);
}
for (const file of [fileA, fileB]) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`);
    process.exit(2);
  }
}

function findFfmpeg() {
  const root = process.cwd();
  const candidates = [
    process.env.FFMPEG_PATH,
    join(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "node_modules", "ffmpeg-static", "ffmpeg"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg"),
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (found) return found;
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  throw new Error("ffmpeg not found");
}

const ffmpeg = findFfmpeg();
const hash = (file) => `sha256:${createHash("sha256").update(readFileSync(file)).digest("hex")}`;
const picture = (file) => {
  const result = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-i", resolve(file), "-map", "0:v:0", "-c", "copy", "-f", "streamhash", "-hash", "sha256", "-"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  const match = /SHA256=([0-9a-f]+)/i.exec(String(result.stdout ?? ""));
  return match ? `sha256:${match[1]}` : null;
};

// Two paths, not one: a file compared with itself is identical by construction,
// and the gate now refuses that. The delivered film is a *third* file — delivery
// re-cuts its audio — which is why the comparands are build copies.
if (resolve(fileA) === resolve(fileB)) {
  console.error(`error: both comparands are ${fileA}; this compares a file with itself and proves nothing`);
  process.exit(2);
}

const a = { file: fileA, bytes: statSync(fileA).size, hash: hash(fileA), videoHash: picture(fileA) };
const b = { file: fileB, bytes: statSync(fileB).size, hash: hash(fileB), videoHash: picture(fileB) };
const bytesMatch = a.hash === b.hash && a.bytes === b.bytes;
const pictureMatch = a.videoHash !== null && a.videoHash === b.videoHash;

const report = {
  mode: "mp4-bytes",
  a,
  b,
  comparedAt: new Date().toISOString(),
  countMatch: a.bytes === b.bytes,
  mismatches: bytesMatch ? 0 : 1,
  frameSetHash: a.videoHash,
  pictureMatch,
  pass: bytesMatch && pictureMatch,
};
writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(
  `renders: ${a.bytes}/${b.bytes} bytes · ${bytesMatch ? "IDENTICAL" : "DIFFER"} · ` +
    `picture ${pictureMatch ? "same" : "DIFFERS"} · ${a.hash.slice(0, 24)}...`,
);
console.log(`report: ${out}`);
process.exit(bytesMatch ? 0 : 1);
