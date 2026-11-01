import test from "node:test";
import assert from "node:assert/strict";
import { resolveChain, chainSeamGap, limbEnd, solveLeg, anchorsInSpace } from "../src/engine/rig.js";
import type { Affine } from "../src/engine/rig.js";

test("a limb at rest points down", () => {
  const end = limbEnd(0, 0, 100, 0);
  assert.deepEqual(end, { x: 0, y: 100 });
});

test("a positive angle swings a limb to the left of the screen", () => {
  const end = limbEnd(0, 0, 100, Math.PI / 2);
  assert.ok(end.x < -99 && end.x > -101);
  assert.ok(Math.abs(end.y) < 1e-9);
});

test("a negative angle swings a limb to the right of the screen", () => {
  const end = limbEnd(0, 0, 100, -Math.PI / 2);
  assert.ok(end.x > 99 && end.x < 101);
});

test("a two-segment chain has no seam gap", () => {
  const chain = resolveChain({ x: 0, y: 0 }, [104, 88], [0.8, 1.2]);
  assert.equal(chainSeamGap(chain), 0);
  assert.equal(chain.joints.length, 2);
});

test("a mirrored chain would be caught as a seam gap", () => {
  const chain = resolveChain({ x: 0, y: 0 }, [104], [0.8]);
  const tip = chain.joints[0];
  assert.ok(tip);
  // the old bug: x + sin instead of x - sin
  const wrong = { x: 104 * Math.sin(0.8), y: 104 * Math.cos(0.8) };
  assert.ok(Math.hypot(tip.x - wrong.x, tip.y - wrong.y) > 100);
});

test("a chain rejects mismatched lengths and angles", () => {
  assert.throws(() => resolveChain({ x: 0, y: 0 }, [104, 88], [0.8]));
});

test("leg IK lands the ankle on a planted target", () => {
  const hip = { x: -16, y: -300 };
  const target = { x: -16, y: -24 };
  const sol = solveLeg(hip, target, 158, 118, -1);
  const knee = limbEnd(hip.x, hip.y, 158, sol.hipAngle);
  const ankle = limbEnd(knee.x, knee.y, 118, sol.hipAngle + sol.kneeBend);
  assert.ok(Math.hypot(ankle.x - target.x, ankle.y - target.y) < 0.001);
  assert.ok(sol.knee.x < hip.x);
});

test("leg IK bends the knee outward on the right side", () => {
  const sol = solveLeg({ x: 16, y: -300 }, { x: 16, y: -80 }, 158, 118, 1);
  assert.ok(sol.knee.x > 16);
  assert.ok(sol.knee.y > -300);
});

/**
 * Where a part is measured decides what the audit can see (decision 0024).
 *
 * The rig draws the hair inside the head's transform, so the hair's place in
 * **head** space is a constant of the rig. Measured in chest space instead, it
 * moves through an arc whenever the head turns — 2.0 to 3.0 units per 0.1 s on
 * *Same Alarm*'s head-drop beat, which the audit reported as 18 head-seams on a
 * rig that was correct. These three cases are the proof the fix is a correction
 * and not a weakening: the correct rig reads zero, and the two ways it can
 * actually be wrong still read as a seam.
 */
const mul = (a: Affine, b: Affine): Affine => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const translate = (x: number, y: number): Affine => [1, 0, 0, 1, x, y];
const rotate = (t: number): Affine => [Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), 0, 0];

const CAMERA = 1.65;                                  // the film is drawn through a zoom
const PIVOT = -462;                                   // the neck: the head turns about it
const HEAD = -518;                                    // where the hair hangs in head space
const CHEST: Affine = [CAMERA, 0, 0, CAMERA, 0, 0];
function headTransform(tilt: number, drop = 0): Affine {
  return mul(mul(mul(CHEST, translate(0, PIVOT + drop)), rotate(tilt)), translate(0, -PIVOT));
}

function driftOf(tiltA: number, tiltB: number, hair: (head: Affine) => Affine): number {
  const frame = (tilt: number) => {
    const head = headTransform(tilt);
    const anchors = anchorsInSpace([
      { part: "chest", local: [0, -452], m: CHEST },
      { part: "head", local: [0, PIVOT], m: head },
      { part: "hair", local: [0, 0], m: hair(head) },
    ]);
    const sample = anchors.find((anchor) => anchor.part === "hair");
    assert.ok(sample, "the hair anchor must be measured");
    return sample.at;
  };
  const a = frame(tiltA);
  const b = frame(tiltB);
  return Math.hypot(a.x - b.x, a.y - b.y);
}

test("hair drawn inside the head holds still in head space while the head turns", () => {
  // The head turns 17 degrees in one tenth of a second, which is what the rig
  // does on the head-drop beat. Attached hair moves with it: drift must be zero,
  // not merely small.
  const drift = driftOf(0, 0.3, (head) => mul(head, translate(0, HEAD)));
  assert.ok(drift < 1e-9, `attached hair drifted ${drift}`);
});

test("hair drawn at the rig root is still a seam, at 17 degrees of head turn", () => {
  // The mutation: the hair ignores the head's transform, which is the defect the
  // check was written for (a second, detached head the moment a character bows).
  const drift = driftOf(0, 0.3, () => CHEST);
  assert.ok(drift > 1.5, `a hair outside the head moved only ${drift} units`);
});

test("a head pivot that slides against the chest is still a seam", () => {
  const frame = (drop: number) => {
    const anchors = anchorsInSpace([
      { part: "chest", local: [0, -452], m: CHEST },
      { part: "head", local: [0, PIVOT], m: headTransform(0, drop) },
    ]);
    const sample = anchors.find((anchor) => anchor.part === "head");
    assert.ok(sample, "the head anchor must be measured");
    return sample.at;
  };
  const a = frame(0);
  const b = frame(4);
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 1.5, "a sliding pivot must read as a seam");
});
