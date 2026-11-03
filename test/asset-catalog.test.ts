import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AssetCatalogSchema,
  checkCoverage,
  resolveCatalog,
} from "../src/engine/asset-catalog.js";

const root = process.cwd();
const catalog = AssetCatalogSchema.parse(
  JSON.parse(readFileSync(resolve(root, "library/assets/index.json"), "utf8")),
);

test("the built asset catalogue is legal", () => {
  const report = resolveCatalog(catalog, { root });
  assert.deepEqual(report.errors, []);
  assert.ok(report.entries.length >= 20);
});

test("a missing file and a duplicate id are refused", () => {
  const broken = AssetCatalogSchema.parse({
    version: 1,
    assets: [
      { ...catalog.assets[0]!, id: "test.one", where: "no/such/file.js" },
      { ...catalog.assets[1]!, id: "test.one" },
    ],
  });
  const report = resolveCatalog(broken, { root });
  assert.ok(report.errors.some((error) => error.code === "asset:where"));
  assert.ok(report.errors.some((error) => error.code === "asset:id"));
});

test("a prop without a size is a warning, not a hard failure", () => {
  const prop = catalog.assets.find((entry) => entry.type === "prop" && !entry.size);
  assert.ok(prop, "catalogue has a prop without a size");
  const report = resolveCatalog({ version: 1, assets: [prop] }, { root });
  assert.ok(report.warnings.some((warning) => warning.code === "asset:size"));
  assert.deepEqual(report.errors, []);
});

test("coverage finds the assets Same Alarm's recipes name but its manifest misses", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8")) as {
    assets: { id: string }[];
    shots: { recipe: string }[];
  };
  const report = checkCoverage(score, { root, styleDir: resolve(root, "styles/paper-kpop") });
  assert.equal(report.required.length, 11);
  assert.equal(report.missing.length, 6);
  assert.deepEqual(report.missing, [
    "frame.paper-window",
    "prop.object",
    "set.corridor",
    "set.tabletop",
    "texture.halftone",
    "texture.paper-fibre",
  ]);
});

test("coverage is silent when every recipe asset is in the manifest", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8")) as {
    assets: { id: string }[];
    shots: { recipe: string }[];
  };
  const required = checkCoverage(score, { root, styleDir: resolve(root, "styles/paper-kpop") }).required;
  const complete = { ...score, assets: required.map((id) => ({ id })) };
  assert.deepEqual(checkCoverage(complete, { root, styleDir: resolve(root, "styles/paper-kpop") }).missing, []);
});
