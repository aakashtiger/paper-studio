import test from "node:test";
import assert from "node:assert/strict";
import { resolveChain, chainSeamGap, limbEnd } from "../src/engine/rig.js";

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
