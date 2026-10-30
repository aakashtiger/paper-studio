import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { statSync } from "node:fs";

/**
 * Determinism check at the level that matters: two independently rendered
 * films of the same score. Identical MP4 bytes are a stronger claim than
 * identical frame PNGs — the encode is a function of the frames, and the
 * frames are a function of the score.
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

const hash = (file) => `sha256:${createHash("sha256").update(readFileSync(file)).digest("hex")}`;
const a = { file: fileA, bytes: statSync(fileA).size, hash: hash(fileA) };
const b = { file: fileB, bytes: statSync(fileB).size, hash: hash(fileB) };
const pass = a.hash === b.hash && a.bytes === b.bytes;

const report = {
  mode: "mp4-bytes",
  a,
  b,
  countMatch: a.bytes === b.bytes,
  mismatches: pass ? 0 : 1,
  frameSetHash: a.hash,
  pass,
};
writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(`renders: ${a.bytes}/${b.bytes} bytes · ${pass ? "IDENTICAL" : "DIFFER"} · ${a.hash.slice(0, 24)}...`);
console.log(`report: ${out}`);
process.exit(pass ? 0 : 1);
