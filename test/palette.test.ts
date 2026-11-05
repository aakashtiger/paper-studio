import test from "node:test";
import assert from "node:assert/strict";
import {
  PALETTE_POLICY,
  hueBin,
  hueFamilyStats,
  sceneFrameMap,
} from "../src/engine/palette.js";

test("saturated red, green and blue land in different hue families", () => {
  assert.equal(hueBin(220, 40, 40), 0);
  assert.equal(hueBin(40, 180, 60), 4);
  assert.equal(hueBin(40, 60, 200), 7);
  assert.equal(hueBin(245, 240, 235), null);
});

test("the family rule keeps five families at 85% and refuses six", () => {
  const proof = hueFamilyStats([500, 300, 100, 86, 7, 7]);
  assert.equal(proof.hueFamilies, 4);
  assert.ok(proof.topFamiliesShare >= 0.85);
  assert.equal(proof.pass, true);
  const six = hueFamilyStats([300, 300, 300, 300, 300, 300]);
  assert.equal(six.hueFamilies, 6);
  assert.equal(six.pass, false);
  const noSaturated = hueFamilyStats([0, 0, 0]);
  assert.equal(noSaturated.measured, false);
  assert.equal(noSaturated.pass, true);
});

test("a frame belongs to the shot that starts on it", () => {
  const map = sceneFrameMap(
    [
      { duration: 1, scene: "a" },
      { duration: 1, scene: "b" },
    ],
    30,
    60,
  );
  assert.equal(map[29], "a");
  assert.equal(map[30], "b");
  assert.equal(map[59], "b");
  assert.equal(sceneFrameMap([{ duration: 1, scene: "a" }], 30, 40)[39], null);
});

test("a cut scene can return later without losing its first window", () => {
  const map = sceneFrameMap(
    [
      { duration: 0.5, scene: "a" },
      { duration: 0.5, scene: "b" },
      { duration: 0.5, scene: "a" },
    ],
    30,
    45,
  );
  assert.equal(map[0], "a");
  assert.equal(map[15], "b");
  assert.equal(map[30], "a");
});

test("the policy mirrors the pack's family rule", () => {
  assert.deepEqual(PALETTE_POLICY, {
    maxHueFamilies: 5,
    minFamilyShare: 0.05,
    topFamiliesShare: 0.85,
  });
});
