import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [dirA, dirB] = process.argv.slice(2);
if (!dirA || !dirB) {
  console.error("usage: node scripts/compare-frames.mjs <dir-a> <dir-b>");
  process.exit(2);
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
  framesA: a.length,
  framesB: b.length,
  countMatch,
  mismatches: mismatches.length,
  firstMismatches: mismatches.slice(0, 20),
  frameSetHash: `sha256:${digest}`,
  pass: countMatch && mismatches.length === 0,
};
writeFileSync("build/understudy/determinism.json", JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(`frames ${a.length}/${b.length} · mismatches ${mismatches.length} · ${report.pass ? "MATCH" : "FAIL"}`);
process.exit(report.pass ? 0 : 1);
