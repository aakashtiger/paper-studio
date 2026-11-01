import test from "node:test";
import assert from "node:assert/strict";
import { autoCols, chunkRows, gridGraph, planGrid, planGridRows } from "../src/engine/grid.js";

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

/**
 * A sheet wider than one command line is composed from row strips, so the number
 * of tiles a film has is not a limit on what can be reviewed.
 *
 * Windows refuses a spawned process past ~32,000 characters of command line and
 * every tile costs an `-i` plus a filter chain: 120 tiles is ~44,000 and the G5
 * strips sheet and the G7 final sheet both died with ENAMETOOLONG on the first
 * 60 s film, after passing on a 30 s one. The split has to be **whole rows, in
 * order**, or the sheet a long film gets stops being the sheet a short one gets.
 */
test("chunkRows keeps every group inside the limit, in order", () => {
  assert.deepEqual(chunkRows([10, 10, 10], 24), [[10, 10], [10]]);
  assert.deepEqual(chunkRows([13, 13, 13, 13], 24), [[13], [13], [13], [13]]);
  assert.deepEqual(chunkRows([6, 6, 6, 6, 6], 24), [[6, 6, 6, 6], [6]]);
});

test("chunkRows leaves a sheet that already fits in one group", () => {
  // One group means one ffmpeg pass: no intermediate files, no second encode.
  assert.deepEqual(chunkRows([5, 5, 5, 5], 24), [[5, 5, 5, 5]]);
  assert.deepEqual(chunkRows([1], 24), [[1]]);
});

test("chunkRows keeps a row wider than the limit whole instead of splitting it", () => {
  // A row cannot be split without ceasing to be a row: G5's strip for one shot
  // is one row by definition, so an over-wide row is its own group.
  assert.deepEqual(chunkRows([30, 2], 24), [[30], [2]]);
});

test("chunkRows never loses or reorders a row", () => {
  const counts = [12, 13, 7, 9, 13, 13, 13, 11, 13, 4];
  const groups = chunkRows(counts, 24);
  assert.deepEqual(groups.flat(), counts);
  for (const group of groups) {
    const total = group.reduce((sum, count) => sum + count, 0);
    assert.ok(total <= 24 || group.length === 1, `group ${group} is ${total} tiles`);
  }
});

test("chunkRows rejects a limit or a count it cannot honour", () => {
  assert.throws(() => chunkRows([], 24), /no rows/);
  assert.throws(() => chunkRows([3], 0), /at least one tile/);
  assert.throws(() => chunkRows([3, 0], 24), /bad row count/);
});
