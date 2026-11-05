import test from "node:test";
import assert from "node:assert/strict";
import {
  analyseFaceSamples,
  expressionChanges,
  visibleDelta,
  type FaceProbeFrame,
  type FaceSample,
} from "../src/engine/face-audit.js";

function sample(value: number, character = "A"): FaceSample {
  const cells = new Array(8 * 8 * 3).fill(value);
  return {
    kind: "faceSample",
    character,
    grid: 8,
    cells,
    validCells: 64,
    deviceBox: { x: 0, y: 0, w: 100, h: 100 },
  };
}

const frames: FaceProbeFrame[] = [
  { time: 0, rigRecords: [sample(0)] },
  { time: 0.25, rigRecords: [sample(0)] },
  { time: 0.45, rigRecords: [sample(10)] },
  { time: 0.5, rigRecords: [sample(30)] },
  { time: 0.7, rigRecords: [sample(30)] },
  { time: 0.8, rigRecords: [sample(30)] },
];

const score = {
  shots: [
    {
      id: "s01",
      duration: 2,
      direction: {
        events: [
          { t: 0.1, kind: "pose", who: "A", expression: "calm" },
          { t: 0.5, kind: "pose", who: "A", expression: "happy" },
        ],
      },
    },
  ],
};

test("an expression change is found in absolute shot time", () => {
  const changes = expressionChanges(score);
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.from, "calm");
  assert.equal(changes[0]?.to, "happy");
  assert.equal(changes[0]?.at, 0.5);
});

test("a gradual face change passes and a one-step change snaps", () => {
  const gradual = analyseFaceSamples({ frames, changes: expressionChanges(score) });
  assert.equal(gradual.pass, true);
  const snap = analyseFaceSamples({
    frames: [
      { time: 0, rigRecords: [sample(0)] },
      { time: 0.4, rigRecords: [sample(0)] },
      { time: 0.5, rigRecords: [sample(40)] },
      { time: 0.8, rigRecords: [sample(40)] },
    ],
    changes: expressionChanges(score),
  });
  assert.ok(snap.findings.some((finding) => finding.code === "face:snap" || finding.code === "face:no-change"));
});

test("identical face samples are a no-change finding", () => {
  const flat = analyseFaceSamples({
    frames: [
      { time: 0, rigRecords: [sample(0)] },
      { time: 0.4, rigRecords: [sample(0)] },
      { time: 0.5, rigRecords: [sample(0)] },
      { time: 0.8, rigRecords: [sample(0)] },
    ],
    changes: expressionChanges(score),
  });
  assert.ok(flat.findings.some((finding) => finding.code === "face:no-change"));
});

test("a high signal confined to fewer than three cells is refused", () => {
  const a = sample(0);
  const b = sample(0);
  b.cells[0] = 255;
  b.cells[3] = 255;
  const few = analyseFaceSamples({
    frames: [
      { time: 0, rigRecords: [a] },
      { time: 0.25, rigRecords: [a] },
      { time: 0.45, rigRecords: [b] },
      { time: 0.5, rigRecords: [b] },
      { time: 0.7, rigRecords: [b] },
    ],
    changes: expressionChanges(score),
  });
  assert.equal(few.pass, false);
  assert.ok(few.findings.some((finding) => finding.code === "face:changed-cells"));
});

test("the visible delta uses the strongest cells, not the whole face", () => {
  const a = sample(0);
  const b = sample(0);
  for (let i = 0; i < 18; i += 1) b.cells[i * 3] = 255;
  assert.ok(visibleDelta(a, b) > 0.2);
});
