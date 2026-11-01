/**
 * Proof that the rig-anchor row in `audit:rig` sees the defect it was built
 * for. It puts the long hair back where it was (drawn at the rig root instead
 * of under the head), paints the bow at the audit's own 0.1 s step, measures
 * the drift in chest space, then restores the rig and verifies the file is
 * byte-identical to what it started with.
 *
 *   npm run audit:rig:proof
 *
 * The rig file is restored in a `finally`, so an interrupt in the middle of
 * this command still leaves the repo as it was. If it is ever killed outright,
 * `git diff films/understudy/vendor/characters.js` shows the patched lines.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const RIG = "films/understudy/vendor/characters.js";
const LIMIT = 1.5; // `audit:rig` default: --seam-tolerance
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

const original = readFileSync(RIG);
const source = original.toString("utf8");

const newHead = `  // long hair behind everything — but it hangs from the head, so it must ride
  // the torso lean exactly like the head does. Drawn at the rig root it kept
  // the upright head position and read as a second, detached head on a bow.
  ctx.save();
  ctx.translate(0, -334 + bounce); ctx.rotate(lean); ctx.translate(0, 334);
  ctx.save();
  ctx.translate(0, HEAD); ctx.rotate(headTilt * .45 + headTurn * .1);
  rigAnchor(ctx, "hair", 0, 0);`;
const oldHead = `  // long hair behind everything
  ctx.save();
  ctx.translate(0, HEAD + bounce); ctx.rotate(headTilt * .45 + headTurn * .1);
  rigAnchor(ctx, "hair", 0, 0);`;

const newTail = `  ctx.restore(); // hair rotation about the head
  ctx.restore(); // torso lean the hair rides`;
const oldTail = `  ctx.restore();`;

for (const [what, text] of [["new hair head", newHead], ["new hair tail", newTail]]) {
  if (!source.includes(text)) {
    console.error(`error: ${what} not found in ${RIG}; the rig changed, update this probe`);
    process.exit(2);
  }
}

const patched = source.split(newHead).join(oldHead).split(newTail).join(oldTail);

function npm() {
  // Spawning `npm.cmd` needs a shell on Windows, and Node 24 refuses that
  // without one. The two commands this needs are tsx scripts, so call them the
  // way every other script here does: this same node, with tsx loaded.
  for (const script of ["scripts/assets-hash.ts", "scripts/embed.ts"]) {
    execFileSync(process.execPath, ["--import", "tsx", script, "films/understudy/score.json"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
  }
}

function paint(out) {
  execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "scripts/render-film.ts",
      "films/understudy/score.json",
      "--stills",
      "24.600,24.800,25.000,25.200,25.400,26.000,27.400",
      "--out-dir",
      `build/rig-seam-proof/stills`,
      "--probe",
      out,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
}

function seam(path) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const place = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const unplace = (m, x, y) => {
    const det = m[0] * m[3] - m[1] * m[2];
    return [(m[3] * (x - m[4]) - m[2] * (y - m[5])) / det, (-m[1] * (x - m[4]) + m[0] * (y - m[5])) / det];
  };
  const out = [];
  const previous = new Map();
  let worst = { time: 0, shift: 0 };
  for (const frame of data.frames) {
    const anchors = frame.rigRecords.filter((r) => r.kind === "anchor");
    const groups = new Map();
    for (const a of anchors) {
      const list = groups.get(a.character) ?? [];
      list.push(a);
      groups.set(a.character, list);
    }
    for (const [name, list] of groups) {
      const chest = list.find((a) => a.part === "chest");
      const hair = list.find((a) => a.part === "hair");
      if (!chest || !hair) continue;
      const device = place(hair.m, hair.local[0], hair.local[1]);
      const rel = unplace(chest.m, device[0], device[1]);
      const before = previous.get(name);
      const shift = before ? Math.hypot(rel[0] - before[0], rel[1] - before[1]) : 0;
      previous.set(name, rel);
      if (shift > worst.shift) worst = { time: frame.time, shift };
      out.push(
        `${name}@${frame.time}: hair in chest space (${rel[0].toFixed(1)}, ${rel[1].toFixed(1)})` +
          (before ? ` · ${shift.toFixed(1)} units since the previous sample` : ""),
      );
    }
  }
  out.push(`worst adjacent shift: ${worst.shift.toFixed(1)} units at ${worst.time}s`);
  return { lines: out, worst };
}

let broken = null;
try {
  writeFileSync(RIG, patched, "utf8");
  npm();
  paint("build/rig-seam-proof/old.json");
  console.log("--- old rig (hair at the rig root) ---");
  broken = seam("build/rig-seam-proof/old.json");
  for (const line of broken.lines) console.log(`  ${line}`);
} finally {
  writeFileSync(RIG, original);
  npm();
  const restored = readFileSync(RIG);
  const same = sha(restored) === sha(original);
  console.log(`restored ${RIG}: ${same ? "byte-identical" : "CHANGED — investigate"} (sha256:${sha(restored).slice(0, 12)})`);
  if (!same) process.exitCode = 1;
}

paint("build/rig-seam-proof/fixed.json");
console.log("--- fixed rig (hair under the head, inside the lean) ---");
const fixed = seam("build/rig-seam-proof/fixed.json");
for (const line of fixed.lines) console.log(`  ${line}`);

if (broken) {
  const caught = broken.worst.shift > LIMIT;
  const clean = fixed.worst.shift <= LIMIT;
  console.log(
    `audit:rig ${caught ? "fails" : "PASSES"} the old rig (${broken.worst.shift.toFixed(1)} vs ${LIMIT} units) and ` +
      `${clean ? "passes" : "FAILS"} the fixed rig (${fixed.worst.shift.toFixed(1)} units)`,
  );
  if (!caught || !clean) process.exitCode = 1;
}
