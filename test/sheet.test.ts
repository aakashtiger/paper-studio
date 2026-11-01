import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PoseLibrarySchema } from "../src/engine/pose.js";
import { sheetHeight, sheetHtml, sheetRigKind, sheetSlug } from "../src/engine/sheet.js";

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
  extra: [],
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

test("a rig the pack has never seen is drawn, not refused", () => {
  // The first real film's cast is worker@0.1.0 and supervisor@0.1.0. The sheet
  // used to throw on any rig that was not idol@ or mira@, so the one film that
  // needed a pose sheet could not have one: the reviewer's first look at the
  // characters was 60 s of painted film. A film-local rig is now drawn through
  // window.CHARACTERS[rig] in the film's own vendor, and the page names the rig
  // it could not find instead of the engine failing before a page exists.
  assert.equal(sheetRigKind("worker@0.1.0"), "film");
  assert.equal(sheetRigKind("idol@0.1.0"), "idol");
  assert.equal(sheetRigKind("mira@0.1.0"), "mira");
  const { html } = sheetHtml(nova, { ...options, rig: "worker@0.1.0" });
  assert.ok(html.includes('const RIG = "worker@0.1.0"'));
  assert.ok(html.includes("does not register CHARACTERS"));
});

test("a film-local rig gets the panels its joints can support", () => {
  // The detail zooms place a wrist, a boot and a torso from the pack's chain
  // numbers; for someone else's rig those numbers are fiction, so the row is
  // not drawn at all and the sheet is shorter by exactly that row.
  const pack = sheetHeight(nova, "idol");
  const film = sheetHeight(nova, "film");
  assert.equal(pack - film, 240 + 20);
  const { html } = sheetHtml(nova, { ...options, rig: "worker@0.1.0" });
  assert.ok(html.includes("origin at the feet"));
  assert.ok(html.includes("drawn by the film's vendor"));
});

test("a film's extra vendor scripts are loaded after the pack's", () => {
  const { html } = sheetHtml(nova, { ...options, rig: "worker@0.1.0", extra: ["office.js"] });
  const core = html.indexOf("core.js");
  const office = html.indexOf("office.js");
  assert.ok(core > 0 && office > core, "office.js must load after core.js");
  assert.ok(html.includes('src="../../../films/understudy/vendor/office.js"'));
});
