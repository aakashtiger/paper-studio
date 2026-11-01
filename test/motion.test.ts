import test from "node:test";
import assert from "node:assert/strict";
import { STILL_TRAVEL, WEAK_TRAVEL, checkMotion, motionOf, type MotionFrame } from "../src/engine/motion.js";

const shots = [
  { id: "s01", start: 0, duration: 3 },
  { id: "s02", start: 3, duration: 3 },
];

/** A 4×2 RGB sample that is `shift` steps away from the same picture. */
function sample(shift: number): number[] {
  const out: number[] = [];
  for (let index = 0; index < 8; index++) {
    const v = (index * 20 + shift * 10) % 256;
    out.push(v, 255 - v, v);
  }
  return out;
}

const framesAt = (offset: number, shifts: number[]): MotionFrame[] =>
  shifts.map((shift, index) => ({ time: offset + index * 0.2, sample: sample(shift) }));

test("a shot whose frames never change is a still photograph, however long it sits", () => {
  const report = checkMotion(
    motionOf(shots, [...framesAt(0, [5, 5, 5, 5]), ...framesAt(3, [5, 40, 5, 40])]),
  );
  const error = report.errors.find((issue) => issue.code === "motion:still");
  assert.ok(error, report.errors.map((issue) => issue.code).join(", "));
  assert.match(error.message, /"s01"/);
  assert.equal(report.shots[0]?.travel, 0);
});

test("a shot that changes passes, and its travel is reported", () => {
  const report = checkMotion(motionOf(shots, [...framesAt(0, [0, 3, 6, 9]), ...framesAt(3, [0, 4, 8, 12])]));
  assert.deepEqual(report.errors, []);
  assert.ok((report.shots[0]?.travel ?? 0) > STILL_TRAVEL);
  assert.ok((report.shots[0]?.peak ?? 0) > 0);
});

test("a shot that barely moves is named but not refused", () => {
  // A very slow drift: every channel of the frame rises by about one level from
  // the first sample to the last — a mean difference of ~1, which is above a
  // still photograph and below anything that reads as movement on screen.
  const drift = (amount: number) => sample(0).map((value) => Math.min(255, value + amount));
  const tiny = [0, 1 / 3, 2 / 3, 1].map((amount, index) => ({ time: index * 0.2, sample: drift(amount) }));
  const report = checkMotion(motionOf([shots[0]!], tiny));
  assert.deepEqual(report.errors, []);
  const warning = report.warnings.find((issue) => issue.code === "motion:weak");
  assert.ok(warning, `travel ${report.shots[0]?.travel}`);
  assert.ok((report.shots[0]?.travel ?? 0) > STILL_TRAVEL);
  assert.ok((report.shots[0]?.travel ?? 0) < WEAK_TRAVEL);
});

test("frames outside every shot are not attributed to a shot", () => {
  const stray: MotionFrame = { time: 10, sample: sample(60) };
  const report = motionOf(shots, [...framesAt(0, [0, 2, 4]), stray]);
  assert.equal(report[0]?.frames, 3);
  assert.equal(report[1]?.frames, 0);
});

test("a shot with fewer than two frames cannot be measured", () => {
  const report = checkMotion(motionOf(shots, framesAt(0, [0])));
  assert.ok(report.errors.some((issue) => issue.code === "motion:unmeasured"));
});

test("the last frame of a shot belongs to the next shot", () => {
  // Windows are half-open: a sample exactly on the boundary is the next shot's
  // first frame, which is also what the painter does.
  const boundary = [
    { time: 0, sample: sample(0) },
    { time: 1, sample: sample(2) },
    { time: 3, sample: sample(9) },
    { time: 4, sample: sample(12) },
  ];
  const report = motionOf(shots, boundary);
  assert.equal(report[0]?.frames, 2);
  assert.equal(report[1]?.frames, 2);
});
