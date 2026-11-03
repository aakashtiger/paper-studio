import test from "node:test";
import assert from "node:assert/strict";
import {
  BLANK_BLACK,
  BLANK_SPREAD,
  BLANK_WHITE,
  diffTimes,
  findPops,
  frameTimes,
  isBlankFrame,
} from "../src/engine/frame-audit.js";

/**
 * The frame audit decodes per shot (decision 0034). These tests keep the split
 * honest: every frame of the film appears exactly once, on the film's own clock,
 * and the frame-to-frame differences start at the second frame of each shot.
 */
const shots = [
  { id: "s01", start: 0, duration: 4 },
  { id: "s02", start: 4, duration: 5.5 },
  { id: "s03", start: 9.5, duration: 2.5 },
];
const fps = 30;

test("every frame of the film appears exactly once, in order", () => {
  const times = shots.flatMap((shot) =>
    frameTimes(shot.start, Math.round(shot.duration * fps), fps),
  );
  assert.equal(times.length, 12 * fps);
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
  assert.equal(new Set(times).size, times.length);
  // The grid is the film's own: 0, 1/30, 2/30 ... with no shot's boundary counted twice.
  assert.equal(times[0], 0);
  assert.equal(times[times.length - 1], 11.967);
  assert.equal(times[120], 4); // first frame of s02, not the last of s01
});

test("the last frame of a shot is one frame before the next shot starts", () => {
  const first = frameTimes(0, Math.round(4 * fps), fps);
  assert.equal(first[first.length - 1], 3.967);
  const second = frameTimes(4, Math.round(5.5 * fps), fps);
  assert.equal(second[0], 4);
});

test("differences belong to the frame after them, never to the shot's first frame", () => {
  const frames = frameTimes(9.5, Math.round(2.5 * fps), fps);
  const diffs = diffTimes(9.5, frames.length - 1, fps);
  assert.equal(diffs.length, frames.length - 1);
  assert.equal(diffs[0], frames[1]);
  assert.deepEqual(diffs, frames.slice(1));
  // The diff across the cut into s03 is not in s03's own pass.
  assert.equal(diffs.includes(9.5), false);
});

test("a shot of one frame has no differences at all", () => {
  assert.deepEqual(frameTimes(3, 1, fps), [3]);
  assert.deepEqual(diffTimes(3, 0, fps), []);
});

test("times do not collide at 30 fps", () => {
  // 1/30 = 0.0333...; rounding to milliseconds must not merge neighbouring frames.
  const times = frameTimes(0, 300, 30);
  assert.equal(new Set(times).size, 300);
});

test("a bad grid is refused rather than silently measured", () => {
  assert.throws(() => frameTimes(0, 10, 0), /fps must be positive/);
  assert.throws(() => frameTimes(0, 1.5, 30), /whole number/);
});

/**
 * The blank rule. The old one was `YAVG < 8 || YAVG > 247`, written for a
 * full-range video: legal-range black is Y=16 and legal-range white is Y=235, so
 * on ordinary SDR it could never fire. Measured on a synthetic black clip:
 * YMIN = YAVG = YMAX = 16.
 */
test("the old thresholds could not see a black frame; the rule can", () => {
  const black = { yavg: 16, ymin: 16, ymax: 16 };
  assert.equal(black.yavg < 8 || black.yavg > 247, false, "the old rule on legal-range black");
  assert.equal(isBlankFrame(black), true);
});

test("a frame at either end of the video's own range is blank", () => {
  // limited range (16/235) and full range (0/255), both black and white
  for (const value of [0, 16, 235, 255]) {
    assert.equal(isBlankFrame({ yavg: value, ymin: value, ymax: value }), true, `flat ${value}`);
  }
});

test("a dark scene with something lit in it is not blank", () => {
  // Average near black, but the window is lit: spread 104.
  assert.equal(isBlankFrame({ yavg: 20, ymin: 16, ymax: 120 }), false);
  // Average near white, but there is detail in the bright area.
  assert.equal(isBlankFrame({ yavg: 232, ymin: 200, ymax: 240 }), false);
});

test("a flat mid frame is a colour card, not a blank frame", () => {
  assert.equal(isBlankFrame({ yavg: 128, ymin: 128, ymax: 128 }), false);
});

test("uniformity must hold at the threshold, not near it", () => {
  assert.equal(isBlankFrame({ yavg: BLANK_BLACK, ymin: 16, ymax: 16 + BLANK_SPREAD }), true);
  assert.equal(isBlankFrame({ yavg: BLANK_BLACK, ymin: 16, ymax: 17 + BLANK_SPREAD }), false);
  assert.equal(isBlankFrame({ yavg: BLANK_WHITE, ymin: 235 - BLANK_SPREAD, ymax: 235 }), true);
  // A frame that is dark but not uniform is content.
  assert.equal(isBlankFrame({ yavg: 17, ymin: 16, ymax: 40 }), false);
});

/**
 * A pop is one frame that does not belong to either shot: the cut's first frame
 * is much brighter or darker than both the shot it left and the shot it entered,
 * and the next frame has settled. A cut that simply changes exposure is not a
 * pop.
 */
test("a one-frame flash at a cut is a pop", () => {
  const samples = [
    { time: 0.933, yavg: 50 },
    { time: 0.966, yavg: 50 },
    { time: 1.0, yavg: 150 },
    { time: 1.033, yavg: 50 },
    { time: 1.066, yavg: 50 },
  ];
  const pops = findPops(samples, [1.0], { threshold: 40, fps: 30 });
  assert.equal(pops.length, 1);
  assert.equal(pops[0]?.time, 1.0);
  assert.equal(pops[0]?.yavg, 150);
  assert.equal(pops[0]?.before, 50);
  assert.equal(pops[0]?.after, 50);
});

test("a cut to a new exposure is not a pop", () => {
  const samples = [
    { time: 0.933, yavg: 50 },
    { time: 0.966, yavg: 50 },
    { time: 1.0, yavg: 150 },
    { time: 1.033, yavg: 150 },
    { time: 1.066, yavg: 150 },
  ];
  assert.deepEqual(findPops(samples, [1.0], { threshold: 40, fps: 30 }), []);
});

test("a jump below the threshold is not a pop", () => {
  const samples = [
    { time: 0.933, yavg: 50 },
    { time: 0.966, yavg: 50 },
    { time: 1.0, yavg: 80 },
    { time: 1.033, yavg: 50 },
  ];
  assert.deepEqual(findPops(samples, [1.0], { threshold: 40, fps: 30 }), []);
});
