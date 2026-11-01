import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Frame-level determinism: two directories of rendered PNGs, compared frame by
 * frame. This is the **debugging** tool when `compare-renders` says two MP4s
 * differ; it is not the gate's determinism record, so it writes its own file.
 * (It used to overwrite `build/understudy/determinism.json` with a shape the gate
 * could not read at all, hardcoded to the fixture.)
 */
const [dirA, dirB] = process.argv.slice(2);
if (!dirA || !dirB) {
  console.error("usage: node scripts/compare-frames.mjs <dir-a> <dir-b> [--out <report.json>]");
  process.exit(2);
}
const outIndex = process.argv.indexOf("--out");
const out =
  outIndex === -1 ? "build/frame-compare.json" : (process.argv[outIndex + 1] ?? "build/frame-compare.json");
for (const dir of [dirA, dirB]) {
  if (!existsSync(dir)) {
    console.error(`missing: ${dir}`);
    process.exit(2);
  }
}

function hashes(dir) {
  const files = readdirSync(dir)
    .filter((name) => /^frame-\d+\.png$/.test(name))
    .sort();
  return files.map((name) => ({
    name,
    hash: createHash("sha256").update(readFileSync(join(dir, name))).digest("hex"),
  }));
}

const a = hashes(dirA);
const b = hashes(dirB);
const countMatch = a.length === b.length;
const mismatches = [];
for (let index = 0; index < Math.min(a.length, b.length); index++) {
  if (a[index]?.name !== b[index]?.name || a[index]?.hash !== b[index]?.hash) {
    mismatches.push({ index: index + 1, a: a[index], b: b[index] });
  }
}

const digest = createHash("sha256")
  .update(a.map((entry) => `${entry.name}:${entry.hash}`).join("\n"))
  .digest("hex");

const report = {
  mode: "frame-pngs",
  a: { dir: dirA, frames: a.length },
  b: { dir: dirB, frames: b.length },
  comparedAt: new Date().toISOString(),
  countMatch,
  mismatches: mismatches.length,
  firstMismatches: mismatches.slice(0, 20),
  frameSetHash: `sha256:${digest}`,
  pass: countMatch && mismatches.length === 0,
};
writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(`frame-compare: ${a.length}/${b.length} frames · mismatches ${mismatches.length} · ${report.pass ? "MATCH" : "FAIL"}`);
console.log(`report: ${resolve(out)}`);
process.exit(report.pass ? 0 : 1);
