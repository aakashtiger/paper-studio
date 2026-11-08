/**
 * `motion-check` — the film is not allowed to freeze.
 *
 * Reads the frame-diff report (30 fps, 192×108 mean absolute luma) and the
 * shot map. Refuses:
 *   - a shot outside 1.0–4.5 s, or a median outside 2.5–3.0 s;
 *   - a run longer than 12 frames (0.4 s) under 1.0;
 *   - more than 5% frozen frames (under 0.5) in a shot;
 *   - more than half the shot quiet (under 1.0);
 *   - a shot mean under 1.0.
 *
 * usage:
 *   node scripts/motion-check.mjs [frame-diff.json] [shots.json]
 */
import { readFileSync } from "node:fs";

const diffPath = process.argv[2] || "proofs/kpop-test/out/frame-diff.json";
const shotsPath = process.argv[3] || "proofs/kpop-test/shots.json";
const diff = JSON.parse(readFileSync(diffPath, "utf8"));
const shots = JSON.parse(readFileSync(shotsPath, "utf8"));
const findings = [];

const rows = [];
for (const shot of shots) {
  const s = diff.shots.find((x) => x.id === shot.id);
  if (!s) { findings.push(`${shot.id}: no frame-diff row`); continue; }
  const dur = shot.end - shot.start;
  if (dur < 1.0 || dur > 4.5) findings.push(`${shot.id}: ${dur.toFixed(2)}s outside 1.0–4.5 s`);
  if (s.longestRunUnder10 > 12) findings.push(`${shot.id}: ${s.longestRunUnder10} consecutive frames under 1.0 (max 12)`);
  if (s.frozenFrames > Math.max(4, s.frames * 0.05)) findings.push(`${shot.id}: ${s.frozenFrames}/${s.frames} frozen frames`);
  if (s.quietFrames > s.frames * 0.5) findings.push(`${shot.id}: ${s.quietFrames}/${s.frames} quiet frames`);
  if (s.mean < 1.0) findings.push(`${shot.id}: mean ${s.mean} is under 1.0`);
  rows.push({ id: shot.id, dur, mean: s.mean, median: s.median, min: s.min, frozen: s.frozenFrames, quiet: s.quietFrames, run: s.longestRunUnder10 });
}

const lens = shots.map((s) => s.end - s.start).sort((a, b) => a - b);
const median = lens[Math.floor(lens.length / 2)];
if (median < 2.5 || median > 3.0) findings.push(`median shot ${median.toFixed(2)}s outside 2.5–3.0 s`);

console.log(`motion-check: ${shots.length} shots, median ${median.toFixed(2)}s`);
console.log("shot   dur   mean  median  min   frozen quiet run<1");
for (const r of rows) {
  console.log(`${r.id.padEnd(5)} ${r.dur.toFixed(2)}  ${String(r.mean).padStart(5)}  ${String(r.median).padStart(5)}  ${String(r.min).padStart(5)}  ${String(r.frozen).padStart(4)}  ${String(r.quiet).padStart(4)}  ${String(r.run).padStart(4)}`);
}
if (findings.length) {
  console.error(`\n${findings.length} finding(s):`);
  for (const f of findings) console.error("  - " + f);
  process.exit(1);
}
console.log("\nPASS: no shot freezes; the cut moves.");
