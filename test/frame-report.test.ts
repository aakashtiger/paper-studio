import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeRgb,
  probeBox,
  resolveFocusMeasurements,
  summarize,
  type ProbeFrame,
  type ShotFrameReport,
} from "../src/engine/frame-report.js";

const W = 480;
const H = 270;

function solid(r: number, g: number, b: number): Uint8Array {
  const rgb = new Uint8Array(W * H * 3);
  for (let i = 0; i < W * H; i += 1) {
    rgb[i * 3] = r;
    rgb[i * 3 + 1] = g;
    rgb[i * 3 + 2] = b;
  }
  return rgb;
}

function fill(rgb: Uint8Array, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number): void {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const p = (y * W + x) * 3;
      rgb[p] = r;
      rgb[p + 1] = g;
      rgb[p + 2] = b;
    }
  }
}

test("a full-bleed field has no side bars and no plate", () => {
  const rgb = solid(243, 231, 209);
  const shot = analyzeRgb({
    rgb,
    shot: "s1",
    time: 1,
    cast: [],
    probe: undefined,
    boxOverride: null,
  });
  assert.ok(shot.bars.left < 0.08);
  assert.ok(shot.bars.right < 0.08);
  assert.equal(shot.bars.plate, false);
  assert.ok(shot.field.largestFlat > 0.9);
});

test("a 20% saturated bar on each edge is measured and flagged as a plate", () => {
  const rgb = solid(243, 231, 209);
  fill(rgb, 0, 0, 96, H, 32, 63, 216);
  fill(rgb, W - 96, 0, W, H, 232, 69, 42);
  const shot = analyzeRgb({
    rgb,
    shot: "s1",
    time: 1,
    cast: [],
    probe: undefined,
    boxOverride: null,
  });
  assert.ok(shot.bars.left >= 0.18 && shot.bars.left <= 0.22, `left ${shot.bars.left}`);
  assert.ok(shot.bars.right >= 0.18 && shot.bars.right <= 0.22, `right ${shot.bars.right}`);
  assert.equal(shot.bars.plate, true);
});

test("a blue figure on a blue field is blue-on-blue", () => {
  const rgb = solid(32, 63, 216);
  const shot = analyzeRgb({
    rgb,
    shot: "s1",
    time: 1,
    cast: ["Kiran"],
    probe: undefined,
    boxOverride: { x: 180, y: 60, w: 120, h: 150, character: "Kiran", source: "aperture" },
  });
  assert.ok(shot.contrast);
  assert.ok(shot.contrast.localLumaDelta < 18);
  assert.equal(shot.contrast.blueOnBlue, true);
});

test("a cream figure on a blue field separates", () => {
  const rgb = solid(32, 63, 216);
  fill(rgb, 180, 60, 300, 210, 243, 231, 209);
  const shot = analyzeRgb({
    rgb,
    shot: "s1",
    time: 1,
    cast: ["Kiran"],
    probe: undefined,
    boxOverride: { x: 180, y: 60, w: 120, h: 150, character: "Kiran", source: "aperture" },
  });
  assert.ok(shot.contrast);
  assert.ok(shot.contrast.localLumaDelta >= 20);
  assert.equal(shot.contrast.blueOnBlue, false);
});

test("the summary measures centroid, height rhythm, bars and contrast", () => {
  const row = (height: number, x: number, bars: number, delta: number, blue = false): ShotFrameReport => ({
    shot: `s${height}`,
    time: 0,
    cast: [],
    box: { x, y: 0, w: 100, h: height, character: "Kiran", source: "aperture" },
    bars: { left: bars, right: 0, plate: bars > 0 },
    field: { largestFlat: 0.2, fieldShare: 0.2, warmShare: 0.7, blueShare: 0.05, saturatedShare: 0.5, meanLuma: 100 },
    contrast: {
      innerLuma: 0,
      ringLuma: delta,
      localLumaDelta: delta,
      figureBlueShare: blue ? 0.8 : 0.02,
      fieldHue: blue ? 230 : null,
      blueOnBlue: blue,
    },
  });
  const summary = summarize([
    row(54, 30, 0, 40), // 20%
    row(135, 200, 0, 40), // 50%
    row(216, 240, 0.2, 10, true), // 80%
  ]);
  assert.equal(summary.shots, 3);
  assert.equal(summary.heightTiers, 3);
  assert.ok(summary.heightSd > 15);
  assert.equal(summary.centroidShare, 2 / 3);
  assert.equal(summary.barShotShare, 1 / 3);
  assert.equal(summary.blueOnBlueShare, 1 / 3);
  assert.equal(summary.localContrastShare, 2 / 3);
});

test("a focus box is measured and clipped in device space", () => {
  const probe: ProbeFrame = {
    time: 1,
    rigRecords: [],
    focusBoxes: [
      { kind: "focus", name: "diya", x: 100, y: 200, w: 160, h: 120, order: 1, alpha: 1 },
      { kind: "focus", name: "diya", x: 100, y: 200, w: 80, h: 60, order: 2, alpha: 0.02 },
    ],
  };
  const rows = resolveFocusMeasurements({
    anchors: [{ name: "diya", kind: "object" }],
    probe,
    frameWidth: 1920,
    frameHeight: 1080,
  });
  assert.equal(rows[0]?.shortSideShare, Number((120 / 1080).toFixed(4)));
  assert.equal(rows[0]?.paintOrder, 1);
  const clipped = resolveFocusMeasurements({
    anchors: [{ name: "diya", kind: "object" }],
    probe: {
      ...probe,
      focusBoxes: [{ kind: "focus", name: "diya", x: 1900, y: 0, w: 100, h: 100, order: 1, alpha: 1 }],
    },
    frameWidth: 1920,
    frameHeight: 1080,
  });
  assert.equal(clipped[0]?.clipped, true);
  assert.equal(clipped[0]?.shortSideShare, Number((20 / 1080).toFixed(4)));
});

test("the probe aperture uses the chest, head and leg targets", () => {
  const probe: ProbeFrame = {
    time: 1,
    rigRecords: [
      { kind: "anchor", character: "Kiran", part: "chest", local: [0, -452], m: [1, 0, 0, 1, 960, 1068] },
      { kind: "anchor", character: "Kiran", part: "head", local: [0, -462], m: [1, 0, 0, 1, 960, 1068] },
      { kind: "solve", character: "Kiran", hip: [0, -281], target: [0, -8] },
    ],
  };
  const box = probeBox(probe, ["Kiran"], 1920, 1080);
  assert.ok(box);
  assert.equal(box.character, "Kiran");
  assert.ok(box.x < 960 && box.x + box.w > 960);
  assert.ok(box.h > 0);
});
