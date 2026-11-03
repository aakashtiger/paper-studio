import test from "node:test";
import assert from "node:assert/strict";
import {
  bestShift,
  cameraMoves,
  cameraPath,
  compareMetrics,
  distinctPalette,
  median,
  paletteDistance,
  parseSignalStats,
  percentile,
  scaleFrame,
  shotLengths,
  summarize,
  type StyleMetrics,
} from "../src/engine/style-measure.js";

/**
 * The style measurement is the capability the video has and the pack did not:
 * turn a reference into numbers, then measure our frames against it. These
 * tests keep the arithmetic honest; the live proof is `npm run style:measure`.
 */

test("percentile is nearest-rank, not an average of the ends", () => {
  const values = [1, 2, 3, 4, 5];
  assert.equal(percentile(values, 0), 1);
  assert.equal(percentile(values, 0.5), 3);
  assert.equal(percentile(values, 1), 5);
  assert.ok(Number.isNaN(percentile([], 0.5)));
});

test("summarize reports the spread a style is judged on", () => {
  const summary = summarize([10, 20, 30, 40, 50]);
  assert.equal(summary.n, 5);
  assert.equal(summary.mean, 30);
  assert.equal(summary.min, 10);
  assert.equal(summary.max, 50);
  assert.equal(summary.p50, 30);
  assert.equal(summarize([]).n, 0);
});

test("signalstats are read per frame, and an unmeasured frame is dropped", () => {
  const output = [
    "frame:0 pts:0 pts_time:0",
    "lavfi.signalstats.YMIN=16",
    "lavfi.signalstats.YAVG=40",
    "lavfi.signalstats.YMAX=200",
    "lavfi.signalstats.SATAVG=30",
    "frame:1 pts:1 pts_time:0.033",
    "lavfi.signalstats.YMIN=18",
    "lavfi.signalstats.YAVG=42",
    "lavfi.signalstats.YMAX=210",
  ].join("\n");
  const samples = parseSignalStats(output);
  assert.equal(samples.length, 2);
  assert.equal(samples[0]?.yavg, 40);
  assert.equal(samples[0]?.ymax, 200);
  assert.equal(samples[1]?.time, 0.033);
});

test("shot lengths come from the cuts, and the last shot runs to the end", () => {
  assert.deepEqual(shotLengths([2, 5, 9], 12), [2, 3, 4, 3]);
  assert.deepEqual(shotLengths([], 6), [6]);
  // A cut at the first or last frame is not a shot.
  assert.deepEqual(shotLengths([0, 6], 6), [6]);
});

test("the median is the middle of the cut, not its average", () => {
  assert.equal(median([4, 1, 3]), 3);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.ok(Number.isNaN(median([])));
});

test("a palette is distinct, and its distance is zero to itself", () => {
  const raw = [0x1d, 0x38, 0xba, 0x1d, 0x38, 0xba, 0xc4, 0x40, 0x26];
  assert.deepEqual(distinctPalette(raw, 6), ["#1d38ba", "#c44026"]);
  assert.equal(paletteDistance(["#1d38ba", "#c44026"], ["#1d38ba", "#c44026"]), 0);
  assert.ok(paletteDistance(["#000000"], ["#ffffff"]) > 0);
});

test("a comparison reports a palette distance, not a signed delta", () => {
  const metrics = (luma: number, palette: string[]): StyleMetrics => ({
    source: "x",
    kind: "frames",
    format: { width: 320, height: 180, aspect: "16:9", fps: null, duration: null, frames: 1 },
    luma: summarize([luma]),
    contrast: summarize([100]),
    saturation: summarize([50]),
    edges: null,
    movement: null,
    cuts: null,
    sceneChanges: null,
    camera: null,
    shots: null,
    palette,
  });
  const delta = compareMetrics(metrics(100, ["#000000"]), metrics(110, ["#ffffff"]));
  assert.equal(delta.luma, 10);
  assert.ok((delta.palette ?? 0) > 0, "palette distance is positive");
});

test("a known shift is found in x and y, and reported as content movement", () => {
  const width = 16;
  const height = 16;
  const previous = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) previous[y * width + x] = (x * 17 + y * 29) % 255;
  }
  // The next frame is the previous one moved right 2 and down 1.
  const next = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sx = x - 2;
      const sy = y - 1;
      if (sx >= 0 && sy >= 0 && sx < width && sy < height) next[y * width + x] = previous[sy * width + sx] as number;
    }
  }
  const shift = bestShift(previous, next, width, height, 4);
  assert.equal(shift.dx, -2);
  assert.equal(shift.dy, -1);
  const path = cameraPath([previous, next], width, height, { maxShift: 4, fullWidth: width * 2, fullHeight: height * 2 });
  assert.equal(path[0]?.dx, 4);
  assert.equal(path[0]?.dy, 2);
  assert.ok((path[0]?.sad ?? 99) < 10, "the aligned difference is small");
});

test("identical frames are still and have no zoom", () => {
  const frame = new Uint8Array(16 * 16).fill(120);
  const path = cameraPath([frame, frame], 16, 16, { maxShift: 2 });
  assert.equal(path[0]?.dx, 0);
  assert.equal(path[0]?.dy, 0);
  assert.equal(path[0]?.dz, 0);
  assert.equal(path[0]?.speed, 0);
});

test("a known 10% push is measured as a push, not absorbed by translation", () => {
  const width = 32;
  const height = 32;
  const previous = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) previous[y * width + x] = (x * 37 + y * 57) % 255;
  }
  // Sampling a narrower region makes the next frame larger: a push-in.
  const next = scaleFrame(previous, width, height, 1 / 1.1);
  const moves = cameraMoves([previous, next], width, height, [{ start: 0, duration: 2 }], 1, { maxShift: 4 });
  assert.equal(moves.length, 1);
  assert.ok((moves[0]?.dz ?? 0) > 9, `expected a 10% push, got ${moves[0]?.dz}`);
  assert.ok((moves[0]?.dz ?? 0) < 11, `expected a 10% push, got ${moves[0]?.dz}`);
  assert.ok(Math.abs(moves[0]?.dx ?? 0) < 8, `push should not become a pan: dx ${moves[0]?.dx}`);

  const pull = scaleFrame(previous, width, height, 1.1);
  const back = cameraMoves([previous, pull], width, height, [{ start: 0, duration: 2 }], 1, { maxShift: 4 });
  assert.ok((back[0]?.dz ?? 0) < -7, `expected a pull-back, got ${back[0]?.dz}`);
  assert.ok((back[0]?.dz ?? 0) > -12, `expected about -9%, got ${back[0]?.dz}`);
});

test("a cut frame is not a camera move", () => {
  const a = new Uint8Array(16 * 16).fill(40);
  const b = new Uint8Array(16 * 16).fill(200);
  const c = new Uint8Array(16 * 16).fill(210);
  const path = cameraPath([a, b, c], 16, 16, { maxShift: 2, skipFrames: new Set([1]) });
  // Both samples touch frame 1 (the cut), so neither is a camera move.
  assert.equal(path.length, 0);
});
