import test from "node:test";
import assert from "node:assert/strict";
import { sampleTimes, shotTimes } from "../src/engine/sampling.js";

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

const shots = [
  { id: "s01", start: 0, duration: 4 },
  { id: "s02", start: 4, duration: 2 },
  { id: "s03", start: 6, duration: 8 },
];

test("shotTimes returns exactly one time per shot, in order", () => {
  const times = shotTimes(shots);
  assert.equal(times.length, shots.length);
  assert.deepEqual(times.map((entry) => entry.id), ["s01", "s02", "s03"]);
  assert.deepEqual(times.map((entry) => entry.index), [0, 1, 2]);
});

test("each shot time stays inside its own shot", () => {
  for (const entry of shotTimes(shots, 0.99)) {
    assert.ok(entry.time >= entry.from && entry.time < entry.to, `${entry.id} time ${entry.time}`);
  }
  assert.deepEqual(shotTimes(shots).map((entry) => entry.time), [2, 5, 10]);
});

test("shotTimes refuses an empty score", () => {
  assert.throws(() => shotTimes([]));
});
