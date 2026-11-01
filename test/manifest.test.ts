/**
 * The render manifest is written by the renderer and read by the audit and the
 * gate, so these tests check the two things that make it evidence rather than a
 * note: it hashes exactly the files the page loads (`null` for the ones that are
 * not there), and `inputMismatches` names the input that moved — including a
 * vendor script and a font, which no gate row re-checked before.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  fontUrls,
  hashFile,
  inputMismatches,
  manifestPath,
  readRenderManifest,
  renderInputs,
} from "../src/engine/manifest.js";

function tree(): string {
  const root = mkdtempSync(join(tmpdir(), "paper-manifest-"));
  const film = join(root, "films", "demo");
  mkdirSync(join(film, "vendor"), { recursive: true });
  mkdirSync(join(film, "assets", "fonts"), { recursive: true });
  mkdirSync(join(root, "styles", "paper-kpop", "canvas"), { recursive: true });
  mkdirSync(join(root, "cast"), { recursive: true });
  writeFileSync(join(film, "score.json"), "{\"id\":\"demo\"}");
  writeFileSync(join(film, "score-data.js"), "window.SCORE = {};");
  writeFileSync(join(film, "painter.js"), "// painter");
  writeFileSync(
    join(film, "index.html"),
    [
      "<html><head>",
      '<style>@font-face { font-family: "Anton"; src: url("assets/fonts/Anton-Regular.ttf"); font-display: block; }',
      '@font-face { font-family: "DMMono"; src: url("assets/fonts/DMMono-Regular.ttf"); font-display: block; }</style>',
      "</head></html>",
    ].join("\n"),
  );
  writeFileSync(join(film, "assets", "fonts", "Anton-Regular.ttf"), "ttf-anton");
  writeFileSync(join(film, "assets", "fonts", "DMMono-Regular.ttf"), "ttf-mono");
  writeFileSync(join(film, "captions.srt"), "1\n00:00:00,000 --> 00:00:01,000\nhi\n");
  writeFileSync(join(film, "vendor", "core.js"), "// core");
  writeFileSync(join(film, "vendor", "type.js"), "// type");
  writeFileSync(join(root, "styles", "paper-kpop", "canvas", "recipes.js"), "// recipes");
  writeFileSync(join(root, "cast", "mira.json"), "{\"poses\":[]}");
  return root;
}

const hashOf = (root: string, path: string) => hashFile(join(root, path));

test("renderInputs hashes every file the film is made from, with its path", async () => {
  const root = tree();
  const inputs = await renderInputs(
    root,
    { id: "demo", style: "paper-kpop", duration: 1, cast: [{ character: "mira", poses: "cast/mira.json" }] },
    "films/demo/score.json",
  );
  const byPath = new Map(inputs.files.map((file) => [file.path, file.hash]));

  assert.equal(byPath.get("films/demo/score.json"), await hashOf(root, "films/demo/score.json"));
  assert.equal(byPath.get("films/demo/painter.js"), await hashOf(root, "films/demo/painter.js"));
  assert.equal(byPath.get("styles/paper-kpop/canvas/recipes.js"), await hashOf(root, "styles/paper-kpop/canvas/recipes.js"));
  assert.equal(byPath.get("cast/mira.json"), await hashOf(root, "cast/mira.json"));
  assert.equal(byPath.get("films/demo/vendor/core.js"), await hashOf(root, "films/demo/vendor/core.js"));
  // The fonts the page names are pinned by the page, not by a list in the engine.
  assert.equal(
    byPath.get("films/demo/assets/fonts/Anton-Regular.ttf"),
    await hashOf(root, "films/demo/assets/fonts/Anton-Regular.ttf"),
  );
  // A vendor file the film does not load is recorded as absent, not "unchanged".
  assert.equal(byPath.get("films/demo/vendor/props.js"), null);
});

test("a changed input changes its hash, and only its hash", async () => {
  const root = tree();
  const score = { id: "demo", style: "paper-kpop", duration: 1 };
  const before = await renderInputs(root, score, "films/demo/score.json");
  writeFileSync(join(root, "styles", "paper-kpop", "canvas", "recipes.js"), "// recipes, edited");
  const after = await renderInputs(root, score, "films/demo/score.json");
  assert.notEqual(
    before.files.find((file) => file.path.endsWith("recipes.js"))?.hash,
    after.files.find((file) => file.path.endsWith("recipes.js"))?.hash,
  );
  assert.equal(
    before.files.find((file) => file.path.endsWith("painter.js"))?.hash,
    after.files.find((file) => file.path.endsWith("painter.js"))?.hash,
  );
});

test("inputMismatches names the vendor script and the font that moved", async () => {
  const root = tree();
  const inputs = await renderInputs(root, { id: "demo", style: "paper-kpop", duration: 1 }, "films/demo/score.json");
  const hash = (path: string): string | null => {
    try {
      return `sha256:${createHash("sha256").update(readFileSync(join(root, path))).digest("hex")}`;
    } catch {
      return null;
    }
  };
  assert.deepEqual(inputMismatches(inputs, hash), []);

  // Editing the code that draws every word must fail the check, by name.
  writeFileSync(join(root, "films", "demo", "vendor", "type.js"), "// type, edited");
  assert.deepEqual(inputMismatches(inputs, hash), ["films/demo/vendor/type.js"]);

  // So must swapping a font, which no other row looks at.
  writeFileSync(join(root, "films", "demo", "assets", "fonts", "Anton-Regular.ttf"), "different");
  assert.deepEqual(inputMismatches(inputs, hash).sort(), [
    "films/demo/assets/fonts/Anton-Regular.ttf",
    "films/demo/vendor/type.js",
  ]);

  // A recorded null for a file that has since appeared is a mismatch too.
  writeFileSync(join(root, "films", "demo", "vendor", "props.js"), "// props");
  assert.ok(inputMismatches(inputs, hash).includes("films/demo/vendor/props.js"));
});

test("inputMismatches refuses a manifest with no inputs at all", () => {
  assert.deepEqual(inputMismatches(undefined, () => null), ["no inputs recorded"]);
  assert.deepEqual(inputMismatches({ files: [] }, () => null), ["no inputs recorded"]);
  // A manifest where nothing was on disk describes no film, so it is refused
  // rather than passing every comparison by accident.
  assert.deepEqual(
    inputMismatches({ files: [{ path: "films/demo/vendor/props.js", hash: null }] }, () => null),
    ["no inputs recorded"],
  );
});

test("fontUrls reads the faces the page names, in order", () => {
  assert.deepEqual(
    fontUrls(
      '@font-face { font-family: "A"; src: url("assets/fonts/A.ttf"); }\n@font-face{font-family:"B";src:url(./b.woff2)}',
    ),
    ["assets/fonts/A.ttf", "b.woff2"],
  );
  assert.deepEqual(fontUrls("<html></html>"), []);
});

test("a manifest that is not there reads as missing", async () => {
  const root = tree();
  assert.equal(await readRenderManifest(root, "demo"), null);
  assert.equal(manifestPath(root, "demo"), join(root, "build", "demo", "render-manifest.json"));
});
