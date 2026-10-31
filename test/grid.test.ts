import test from "node:test";
import assert from "node:assert/strict";
import { autoCols, planGrid } from "../src/engine/grid.js";

test("autoCols stays square-ish and capped", () => {
  assert.equal(autoCols(1), 1);
  assert.equal(autoCols(4), 2);
  assert.equal(autoCols(9), 3);
  assert.equal(autoCols(16), 3);
  assert.equal(autoCols(4, 1), 1);
});

test("planGrid tiles left to right, top to bottom", () => {
  const grid = planGrid(5, 3, 640, 360);
  assert.equal(grid.cols, 3);
  assert.equal(grid.rows, 2);
  assert.equal(grid.layout, "0_0|640_0|1280_0|0_360|640_360");
  assert.equal(grid.width, 1920);
  assert.equal(grid.height, 720);
});

test("planGrid never makes a column past the tile count", () => {
  const grid = planGrid(2, 4, 100, 100);
  assert.equal(grid.cols, 2);
  assert.equal(grid.rows, 1);
  assert.equal(grid.layout, "0_0|100_0");
});

test("planGrid rejects an empty batch", () => {
  assert.throws(() => planGrid(0, 3, 100, 100), /at least one tile/);
});

test("planGrid handles a single tile", () => {
  const grid = planGrid(1, 3, 640, 360);
  assert.equal(grid.cols, 1);
  assert.equal(grid.rows, 1);
  assert.equal(grid.layout, "0_0");
  assert.equal(grid.width, 640);
  assert.equal(grid.height, 360);
});
