/* Proves solveArm is the inverse of the rig's manHand, using the two functions
   as they are written in the repo (not copies). Run:
     node proofs/kpop-crime-60/_arm-probe.mjs
   Exits 1 if any pose fails to round-trip. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const sets = readFileSync(join(here, "sets-60.js"), "utf8");
const man = readFileSync(join(here, "..", "kpop-crime", "characters", "man.js"), "utf8");

function grab(src, name) {
  const start = src.indexOf("function " + name + "(");
  if (start < 0) throw new Error("no " + name);
  const end = src.indexOf("\n}\n", start);
  if (end < 0) throw new Error("no end for " + name);
  return src.slice(start, end + 3);
}

const C = { clamp: (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)) };
const fns = [grab(man, "manHand"), grab(sets, "solveArm")].join("\n");
const factory = new Function("C", fns + "\nreturn { manHand, solveArm };")(C);
const { manHand, solveArm } = factory;

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

let worstHand = 0, worstAngle = 0, fails = 0, n = 0;
for (const side of ["L", "R"]) {
  for (let i = 0; i < 500; i++) {
    const pose = { armL: [0, 0], armR: [0, 0] };
    const a1 = (rnd() - 0.5) * 2.6;
    const a2 = a1 + (rnd() - 0.5) * 2.4;
    pose[side === "L" ? "armL" : "armR"] = [a1, a2 - a1];
    const target = manHand(0, 0, 1, pose, side);
    const solved = solveArm(0, 0, 1, side, target[0], target[1]);
    const back = manHand(0, 0, 1, { armL: solved, armR: solved }, side);
    const dh = Math.hypot(back[0] - target[0], back[1] - target[1]);
    worstHand = Math.max(worstHand, dh);
    if (dh > 0.01) fails++;
    n++;
  }
}

// the two default poses must reproduce exactly, or every untouched shot moves
const defaults = {
  L: [0.28, -0.35], R: [-0.32, 0.45],
};
for (const side of ["L", "R"]) {
  const [a1, bend] = defaults[side];
  const pose = { armL: [a1, bend], armR: [a1, bend] };
  const t = manHand(0, 0, 1, pose, side);
  const s = solveArm(0, 0, 1, side, t[0], t[1]);
  const da = Math.max(Math.abs(s[0] - a1), Math.abs(s[1] - bend));
  worstAngle = Math.max(worstAngle, da);
  if (da > 1e-6) fails++;
  n++;
}

console.log(`arm probe: ${n} poses, worst wrist error ${worstHand.toFixed(4)} px, worst default-angle error ${worstAngle.toExponential(2)} rad`);
console.log(fails === 0 ? "PASS solveArm is manHand inverted" : `FAIL ${fails} poses did not round-trip`);
process.exit(fails === 0 ? 0 : 1);
