import test from "node:test";
import assert from "node:assert/strict";
import { sampleTimes } from "../src/engine/sampling.js";

test("sampleTimes starts at zero, steps, and ends on the last frame", () => {
  assert.deepEqual(sampleTimes(5, 2), [0, 2, 4, 4.95]);
  assert.equal(sampleTimes(30, 1)[0], 0);
  assert.equal(sampleTimes(30, 1).at(-1), 29.95);
  assert.equal(sampleTimes(30, 1).length, 31);
});

test("sampleTimes never repeats the closing frame", () => {
  const times = sampleTimes(10, 1);
  assert.deepEqual(times, [...new Set(times)]);
  assert.ok(times.every((time, index) => index === 0 || time > (times[index - 1] ?? -1)));
});

test("sampleTimes defaults a non-positive step to one second", () => {
  assert.deepEqual(sampleTimes(3, 0), sampleTimes(3, 1));
  assert.deepEqual(sampleTimes(3, -2), sampleTimes(3, 1));
});

test("sampleTimes handles a film shorter than the step", () => {
  assert.deepEqual(sampleTimes(0.5, 1), [0, 0.45]);
});

test("sampleTimes refuses a non-positive duration", () => {
  assert.throws(() => sampleTimes(0, 1));
});
