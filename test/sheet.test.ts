import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PoseLibrarySchema } from "../src/engine/pose.js";
import { sheetHeight, sheetHtml, sheetSlug } from "../src/engine/sheet.js";

const root = process.cwd();
const nova = PoseLibrarySchema.parse(
  JSON.parse(readFileSync(resolve(root, "films/understudy/cast/nova.poses.json"), "utf8")),
);

const options = {
  character: nova.character,
  rig: nova.rig,
  anchors: nova.anchors,
  library: nova,
  vendor: "../../../films/understudy/vendor",
  fonts: {
    dir: "../../../styles/test",
    display: { family: "Display Face", file: "fonts/display.ttf" },
    body: { family: "Body Face", file: "fonts/body.ttf" },
    mono: { family: "Mono Face", file: "fonts/mono.ttf" },
  },
};

test("the sheet slug is stable and rejects empty names", () => {
  assert.equal(sheetSlug("Nova Kim"), "nova-kim");
  assert.equal(sheetSlug("!!!"), "");
});

test("the sheet height grows with more poses", () => {
  const tall = { ...nova, poses: [...nova.poses, ...nova.poses.slice(0, 4)] };
  assert.ok(sheetHeight(tall) > sheetHeight(nova));
});

test("the sheet contains the ready marker and the character", () => {
  const { html } = sheetHtml(nova, options);
  assert.ok(html.includes("__sheetReady"));
  assert.ok(html.includes("PAPER ASSET SHEET"));
  assert.ok(html.includes(nova.character));
});

test("the sheet takes its faces from the caller, not from the engine", () => {
  const { html } = sheetHtml(nova, options);
  assert.ok(html.includes('font-family: "Mono Face"'));
  assert.ok(html.includes("fonts/mono.ttf"));
  assert.equal(html.includes('"DMMono"'), false);
  assert.equal(html.includes('"Anton"'), false);
});

test("script-breaking pose names are escaped out of the JSON block", () => {
  const evil = {
    ...nova,
    poses: nova.poses.map((pose, index) =>
      index === 0 ? { ...pose, name: "</script><script>alert(1)</script>" } : pose,
    ),
  };
  const { html } = sheetHtml(evil, { ...options, library: evil });
  assert.equal(html.includes("</script><script>alert(1)</script>"), false);
  assert.ok(html.includes("\\u003c/script"));
});

test("an unknown rig fails loudly", () => {
  assert.throws(() => sheetHtml(nova, { ...options, rig: "unknown@1" }));
});
