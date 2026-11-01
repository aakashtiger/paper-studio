/**
 * The render manifest is written by the renderer and read by the audit, so these
 * tests check the two things that make it evidence rather than a note: it hashes
 * exactly the files it names (and `null` for the ones that are not there), and a
 * missing manifest reads as missing instead of as an empty pass.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { hashFile, manifestPath, readRenderManifest, renderInputs } from "../src/engine/manifest.js";

function tree(): string {
  const root = mkdtempSync(join(tmpdir(), "paper-manifest-"));
  const film = join(root, "films", "demo");
  mkdirSync(join(film, "vendor"), { recursive: true });
  mkdirSync(join(root, "styles", "paper-kpop", "canvas"), { recursive: true });
  mkdirSync(join(root, "cast"), { recursive: true });
  writeFileSync(join(root, "films", "demo", "score.json"), "{\"id\":\"demo\"}");
  writeFileSync(join(film, "score-data.js"), "window.SCORE = {};");
  writeFileSync(join(film, "painter.js"), "// painter");
  writeFileSync(join(film, "index.html"), "<html></html>");
  writeFileSync(join(film, "captions.srt"), "1\n00:00:00,000 --> 00:00:01,000\nhi\n");
  writeFileSync(join(film, "vendor", "core.js"), "// core");
  writeFileSync(join(root, "styles", "paper-kpop", "canvas", "recipes.js"), "// recipes");
  writeFileSync(join(root, "cast", "mira.json"), "{\"poses\":[]}");
  return root;
}

test("renderInputs hashes the files it names, and nulls the ones that are not there", async () => {
  const root = tree();
  const inputs = await renderInputs(
    root,
    { id: "demo", style: "paper-kpop", duration: 1, cast: [{ character: "mira", poses: "cast/mira.json" }] },
    "films/demo/score.json",
  );

  assert.equal(inputs.score, await hashFile(join(root, "films", "demo", "score.json")));
  assert.equal(inputs.painter, await hashFile(join(root, "films", "demo", "painter.js")));
  assert.equal(inputs.backend, await hashFile(join(root, "styles", "paper-kpop", "canvas", "recipes.js")));
  assert.equal(inputs.poses["mira"], await hashFile(join(root, "cast", "mira.json")));
  assert.equal(inputs.vendor["core.js"], await hashFile(join(root, "films", "demo", "vendor", "core.js")));
  // A vendor file the film does not load is absent, not "unchanged".
  assert.equal(inputs.vendor["props.js"], null);

  // The paths travel with the hashes so the gate can re-hash them later.
  assert.equal(inputs.backendPath, "styles/paper-kpop/canvas/recipes.js");
  assert.equal(inputs.painterPath, "films/demo/painter.js");
});

test("a changed input changes its hash", async () => {
  const root = tree();
  const before = await renderInputs(root, { id: "demo", style: "paper-kpop", duration: 1 }, "films/demo/score.json");
  writeFileSync(join(root, "styles", "paper-kpop", "canvas", "recipes.js"), "// recipes, edited");
  const after = await renderInputs(root, { id: "demo", style: "paper-kpop", duration: 1 }, "films/demo/score.json");
  assert.notEqual(before.backend, after.backend);
  assert.equal(before.painter, after.painter);
});

test("a manifest that is not there reads as missing", async () => {
  const root = tree();
  assert.equal(await readRenderManifest(root, "demo"), null);
  assert.equal(manifestPath(root, "demo"), join(root, "build", "demo", "render-manifest.json"));
});
