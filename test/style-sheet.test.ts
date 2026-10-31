import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadStylePack } from "../src/core/style.js";
import { styleSheetHtml } from "../src/engine/style-sheet.js";

const root = process.cwd();
const packPath = resolve(root, "styles/paper-kpop");

function sheet(options: { hero?: string; cast?: Array<{ character: string; poses: string }> } = {}) {
  const pack = loadStylePack(packPath);
  return { pack, html: styleSheetHtml(pack, { root, packPath, ...options }) };
}

test("the style sheet names the pack and its contract", () => {
  const { pack, html } = sheet();
  assert.ok(html.includes(pack.capabilities.identity.name));
  assert.ok(html.includes(pack.capabilities.identity.id));
  assert.ok(html.includes(pack.capabilities.identity.version));
  assert.match(html, /data-sheet-height/);
});

test("every recipe, palette, font and anchor is on the sheet", () => {
  const { pack, html } = sheet();
  for (const recipe of pack.recipes) assert.ok(html.includes(recipe.id), `missing recipe ${recipe.id}`);
  for (const name of Object.keys(pack.tokens.color.palettes)) {
    assert.ok(html.includes(name), `missing palette ${name}`);
  }
  for (const role of pack.tokens.color.roles) assert.ok(html.includes(role), `missing role ${role}`);
  for (const family of pack.tokens.type.families) {
    assert.ok(html.includes(family.file), `missing font file ${family.file}`);
    assert.match(html, /@font-face/);
  }
  const boxes = (pack.tokens.layout as { aspectBoxes?: Record<string, unknown> }).aspectBoxes;
  for (const anchor of Object.keys((boxes?.["9:16"] as Record<string, unknown>) ?? {})) {
    assert.ok(html.includes(anchor), `missing 9:16 anchor ${anchor}`);
  }
});

test("the hero slot is empty without a film and shows a frame with one", () => {
  const empty = sheet();
  assert.match(empty.html, /no film on this pack yet/);
  assert.ok(!empty.html.includes('class="hero" src='));
  const withHero = sheet({ hero: "hero.png" });
  assert.match(withHero.html, /class="hero" src="hero.png"/);
});

test("a supplied cast is named and pointed at the lineup command", () => {
  const { html } = sheet({ cast: [{ character: "Nova", poses: "cast/nova.poses.json" }] });
  assert.ok(html.includes("Nova"));
  assert.ok(html.includes("cast/nova.poses.json"));
  assert.ok(html.includes("npm run sheet"));
  const none = sheet();
  assert.ok(!none.html.includes("npm run sheet"));
});

test("the style sheet escapes text instead of injecting markup", () => {
  const pack = loadStylePack(packPath);
  const token = pack.tokens.type.families[0];
  assert.ok(token);
  token.name = '<script>alert("x")</script> & "q"';
  const html = styleSheetHtml(pack, { root, packPath });
  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &quot;q&quot;"));
});
