import test from "node:test";
import assert from "node:assert/strict";
import { autoCols, gridGraph, planGrid, planGridRows } from "../src/engine/grid.js";

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

test("planGridRows starts each row on the left and sizes to the longest", () => {
  const grid = planGridRows([3, 1, 2], 100, 50);
  assert.equal(grid.cols, 3);
  assert.equal(grid.rows, 3);
  assert.equal(grid.layout, "0_0|100_0|200_0|0_50|0_100|100_100");
  assert.equal(grid.width, 300);
  assert.equal(grid.height, 150);
});

test("planGridRows rejects an empty or empty-row layout", () => {
  assert.throws(() => planGridRows([], 100, 50), /at least one row/);
  assert.throws(() => planGridRows([2, 0], 100, 50), /at least one tile/);
});

test("gridGraph never sends a single tile through xstack", () => {
  const one = gridGraph(["scale=640:360"], "0_0", "0x101010");
  assert.equal(one.graph, "[0:v]scale=640:360[v0]");
  assert.deepEqual(one.map, ["-map", "[v0]"]);
  assert.ok(!one.graph.includes("xstack"));
});

test("gridGraph stacks two or more tiles with xstack", () => {
  const two = gridGraph(["a", "b"], "0_0|640_0", "0x101010");
  assert.equal(two.graph, "[0:v]a[v0];[1:v]b[v1];[v0][v1]xstack=inputs=2:layout=0_0|640_0:fill=0x101010");
  assert.deepEqual(two.map, []);
});
