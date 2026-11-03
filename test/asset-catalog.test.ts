import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveAssets, type AssetRef } from "../src/engine/assets.js";
import {
  AssetCatalogSchema,
  checkCoverage,
  deriveAssetRefs,
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
  const { size: _size, ...prop } = catalog.assets.find((entry) => entry.type === "prop")!;
  const report = resolveCatalog({ version: 1, assets: [prop] }, { root });
  assert.ok(report.warnings.some((warning) => warning.code === "asset:size"));
  assert.deepEqual(report.errors, []);
});

test("every prop in the catalogue has a declared size", () => {
  const unsized = catalog.assets.filter((entry) => entry.type === "prop" && !entry.size);
  assert.deepEqual(unsized.map((entry) => entry.id), []);
});

test("coverage finds the assets Same Alarm's recipes name but its manifest misses", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8")) as {
    assets: AssetRef[];
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
    assets: AssetRef[];
    shots: { recipe: string }[];
  };
  const required = checkCoverage(score, { root, styleDir: resolve(root, "styles/paper-kpop") }).required;
  const complete = { ...score, assets: required.map((id) => ({ id })) };
  assert.deepEqual(checkCoverage(complete, { root, styleDir: resolve(root, "styles/paper-kpop") }).missing, []);
});

test("the six missing assets derive into a manifest that resolves", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8")) as {
    assets: AssetRef[];
    shots: { recipe: string }[];
  };
  const derived = deriveAssetRefs(score, catalog, { root, styleDir: resolve(root, "styles/paper-kpop") });
  assert.deepEqual(derived.unknown, []);
  assert.deepEqual(
    derived.refs.map((entry) => entry.required),
    ["frame.paper-window", "prop.object", "set.corridor", "set.tabletop", "texture.halftone", "texture.paper-fibre"],
  );
  for (const { ref } of derived.refs) {
    assert.match(ref.hash, /^sha256:[a-f0-9]{64}$/);
    assert.ok(ref.path && existsSync(resolve(root, ref.path)), `${ref.id} has a real path`);
  }
  const proposed = { ...score, assets: [...score.assets, ...derived.refs.map(({ ref }) => ref)] };
  const check = resolveAssets(proposed.assets, { root });
  assert.deepEqual(check.errors, []);
});
