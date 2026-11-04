import test from "node:test";
import assert from "node:assert/strict";
import { faceBoxes, textOnFace } from "../src/engine/text-face.js";

const anchor = (size: [number, number], m: [number, number, number, number, number, number] = [1, 0, 0, 1, 0, 0]) => ({
  kind: "anchor",
  character: "Rider",
  part: "face",
  local: [0, 0] as [number, number],
  size,
  m,
});

test("a face box is the local box mapped through the rig matrix", () => {
  const [box] = faceBoxes([anchor([90, 100], [2, 0, 0, 2, 100, 50])]);
  assert.ok(box);
  assert.deepEqual(
    [box!.x, box!.y, box!.w, box!.h].map((value) => Math.round(value)),
    [10, -50, 180, 200],
  );
});

test("an unboxed face or a non-face anchor is ignored", () => {
  assert.equal(faceBoxes([anchor([0, 0])]).length, 0);
  assert.equal(faceBoxes([{ ...anchor([90, 100]), part: "head" }]).length, 0);
});

test("text inside a face is a finding", () => {
  const [face] = faceBoxes([anchor([90, 100], [1, 0, 0, 1, 100, 100])]);
  const hits = textOnFace([{ text: "THE APP", x: 80, y: 80, w: 40, h: 20 }], [face!]);
  assert.equal(hits.length, 1);
  assert.ok(hits[0]!.share > 0);
});

test("text outside a face is clear, with one pixel of tolerance", () => {
  const [face] = faceBoxes([anchor([90, 100], [1, 0, 0, 1, 100, 100])]);
  assert.equal(textOnFace([{ text: "x", x: 146, y: 80, w: 40, h: 20 }], [face!]).length, 0);
});

test("the box is measured after a rotated head", () => {
  const s = Math.SQRT1_2;
  const [face] = faceBoxes([anchor([100, 100], [s, -s, s, s, 100, 100])]);
  assert.ok(face);
  // A 100x100 square rotated 45° has a 141x141 axis-aligned box.
  assert.ok(face!.w > 141 && face!.w < 142);
});