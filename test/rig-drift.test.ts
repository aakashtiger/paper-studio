import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const files = [
  resolve(root, "proofs/s2-paper/vendor/characters.js"),
  resolve(root, "../src/characters.js"),
];

const correct = "return [x - Math.sin(ang) * len, y + Math.cos(ang) * len];";
const mirrored = "return [x + Math.sin(ang) * len";

for (const file of files) {
  if (!existsSync(file)) continue;
  test(`${file} keeps the unmirrored limb return`, () => {
    const source = readFileSync(file, "utf8");
    assert.ok(source.includes(correct), "limb() must return x - sin(ang) * len");
    assert.equal(source.includes(mirrored), false, "mirrored limb return is back");
  });
}
