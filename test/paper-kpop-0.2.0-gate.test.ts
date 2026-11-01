import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  GenericBriefSchema,
  ResolveFormatSchema,
  loadStylePack,
  readStyleJson,
  resolveStyle,
  validateStylePack,
} from "../src/core/style.js";
import { assertPackGeometry } from "./style-geometry.js";

/**
 * Paper K-pop 0.2.0 gate — the pack that is on disk today.
 *
 * 0.2.0 added eight office recipes and the world *Same Alarm* walks through:
 * a bedroom before dawn, a corridor, a desk under a fluorescent bar, a window
 * at dusk, a card. The pack that shipped 0.1.0 is sealed at
 * `gate/paper-kpop-blind/inputs/pack` and its own gate still proves it; this
 * one proves three things about the live pack and nothing more:
 *
 *   1. it is REVIEWABLE, with exactly one open director choice;
 *   2. it has sixteen recipes — the eight it shipped with and the eight the
 *      film added — and every one of them fits its text in both aspects at the
 *      14 px floor (the same proof the sealed gate runs);
 *   3. **adding the office set did not re-cut a sealed plan.** A format names
 *      the recipes it uses, so `paper-kpop-song` and `paper-kpop-shorts` still
 *      resolve to exactly the fourteen and eight shots they resolved to at
 *      0.1.0, recipe for recipe.
 *
 * 0.2.0 is not yet sealed: the pack is still moving under the film work, and
 * sealing it mid-push would pin a hash that the next painter fix invalidates.
 * The seal lands with the film's acceptance (docs/decisions/0020).
 */

const ROOT = process.cwd();
const PACK = join(ROOT, "styles", "paper-kpop");

const SHIPPED = [
  "paper_open",
  "type_stack",
  "portrait_iris",
  "macro_prop_beat",
  "stage_wide",
  "sticker_slam",
  "side_scroll_chase",
  "pullback_close",
];
const OFFICE = [
  "alarm_close",
  "corridor_walk",
  "desk_wide",
  "desk_night",
  "supervisor_point",
  "window_dusk",
  "loop_close",
  "loop_card",
];

// The two plans as they were sealed at 0.1.0, recipe for recipe.
const SONG_PLAN = [
  "paper_open",
  "type_stack",
  "portrait_iris",
  "macro_prop_beat",
  "stage_wide",
  "sticker_slam",
  "portrait_iris",
  "macro_prop_beat",
  "stage_wide",
  "sticker_slam",
  "side_scroll_chase",
  "type_stack",
  "macro_prop_beat",
  "pullback_close",
];
const SHORTS_PLAN = [
  "paper_open",
  "type_stack",
  "portrait_iris",
  "macro_prop_beat",
  "stage_wide",
  "sticker_slam",
  "side_scroll_chase",
  "pullback_close",
];

function readBrief(path: string) {
  return GenericBriefSchema.parse(readStyleJson(join(ROOT, path)));
}

function readFormat(path: string) {
  return ResolveFormatSchema.parse(readStyleJson(join(ROOT, path)));
}

test("0.2.0 gate: the live pack is REVIEWABLE with exactly one open choice", () => {
  const result = validateStylePack(PACK);
  assert.equal(result.status, "REVIEWABLE");
  assert.equal(result.hardFailures.length, 0, JSON.stringify(result.hardFailures, null, 2));
  assert.equal(result.chosen.length, 1);
  assert.equal(result.chosen[0]?.id, "paper-shadow");

  const capabilities = readStyleJson(join(PACK, "capabilities.json")) as {
    identity: { name: string; version: string };
    proof: { frames: string[] };
  };
  assert.equal(capabilities.identity.version, "0.2.0");
  const card = readFileSync(join(PACK, "card.html"), "utf8");
  assert.ok(card.includes(capabilities.identity.name), "the card does not name the pack");
  assert.ok(card.includes(capabilities.identity.version), "the card does not show 0.2.0");
});

test("0.2.0 gate: sixteen recipes, eight shipped and eight office, each with a beat role", () => {
  const recipes = readdirSync(join(PACK, "recipes"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readStyleJson(join(PACK, "recipes", file)) as { id: string; beatRoles: string[] });
  const ids = recipes.map((recipe) => recipe.id).sort();
  assert.deepEqual(ids, [...SHIPPED, ...OFFICE].sort());
  assert.equal(new Set(ids).size, 16, "a recipe id is listed twice");
  for (const recipe of recipes) {
    assert.ok(recipe.beatRoles.length > 0, `${recipe.id} has no beat role`);
  }

  // The film's proof frames are the pack's proof frames: every recipe is drawn.
  const capabilities = readStyleJson(join(PACK, "capabilities.json")) as {
    proof: { frames: string[] };
  };
  assert.deepEqual([...capabilities.proof.frames].sort(), [...ids].sort());
});

test("0.2.0 gate: a format names its recipes, so the office set cannot re-cut a sealed plan", () => {
  const pack = loadStylePack(PACK);
  const a = readBrief("fixtures/resolve/paper-kpop-a.json");
  const b = readBrief("fixtures/resolve/paper-kpop-b.json");

  for (const [format, plan, shots, duration, aspect] of [
    [readFormat("formats/paper-kpop-song/format.json"), SONG_PLAN, 14, 45, "16:9"],
    [readFormat("formats/paper-kpop-shorts/format.json"), SHORTS_PLAN, 8, 30, "9:16"],
  ] as const) {
    assert.ok(format.recipes, `${format.id} does not name its recipes`);
    for (const id of format.recipes) {
      assert.ok(SHIPPED.includes(id), `${format.id} names "${id}", which is not one of the eight it shipped with`);
    }
    const resolved = resolveStyle(pack, a, format, 42, { compare: { brief: b, format } });
    assert.equal(resolved.shots.length, shots);
    assert.equal(resolved.duration, duration);
    assert.equal(resolved.aspect, aspect);
    assert.deepEqual(resolved.shots.map((shot) => shot.recipe), [...plan]);
  }
});

test("0.2.0 gate: all sixteen recipes fit their text in both aspects at the 14 px floor", () => {
  assertPackGeometry(PACK);
});

/**
 * The office props are declared assets, and a declared footprint is only worth
 * something if it is compared with the thing the prop is behind.
 *
 * The chair was drawn `192 * s` wide and passed `1.45` at four call sites, so at
 * the desk shots it was 278 px across behind a man whose shoulders are 108 — two
 * and a half men wide. Judged at full size it read as a slab behind the hip, and
 * no test could see it because the width was never written in one place. Now it
 * is, so this can compare it: a chair back may be a little wider than the man in
 * it and no more.
 */
test("0.2.0 gate: every office prop declares a footprint, and the chair fits the man", () => {
  const source = readFileSync(join(PACK, "canvas", "recipes.js"), "utf8");
  const office = readFileSync(join(ROOT, "films", "same-alarm", "vendor", "office.js"), "utf8");

  // Each entry in the PROPS table: `id: { w: n, h: n, anchor: "...", flat?: bool, draw(`.
  const entries = [...source.matchAll(/\n {2}(\w+): \{\n([\s\S]*?)\n {2}\},/g)].map((m) => ({
    id: m[1],
    body: m[2] ?? "",
  }));
  const props = entries.filter((entry) => /\bw: \d+/.test(entry.body) && /\banchor: "/.test(entry.body));
  assert.ok(props.length >= 2, "the PROPS table should declare the chair and the form");

  const problems: string[] = [];
  for (const prop of props) {
    const w = Number(/w: (\d+)/.exec(prop.body)?.[1]);
    const h = Number(/h: (\d+)/.exec(prop.body)?.[1]);
    const anchor = /anchor: "([^"]+)"/.exec(prop.body)?.[1];
    if (!(w > 0) || !(h > 0)) problems.push(`${prop.id} has no footprint`);
    if (!anchor) problems.push(`${prop.id} has no anchor`);
    if (/flat: true/.test(prop.body) && /shadow: C\.rgba/.test(prop.body)) {
      problems.push(`${prop.id} lies flat and still casts a lift shadow`);
    }
  }

  // A prop drawn at the call site is a prop with no footprint.
  if (/officeChairBack\(/.test(source)) problems.push("the chair is still drawn at the call site");

  // The shoulders the rig actually draws: half-width 38 at the worker's scale.
  const shoulderPx = 38 * 2 * 1.5;
  const chair = props.find((prop) => prop.id === "chair");
  assert.ok(chair, "the chair is not declared in PROPS");
  const chairW = Number(/w: (\d+)/.exec(chair.body)?.[1]);
  const chairPx = chairW * 1.5;
  if (chairPx > shoulderPx * 1.3) {
    problems.push(`the chair is ${chairPx.toFixed(0)} px wide behind ${shoulderPx.toFixed(0)} px shoulders`);
  }

  // The seat is placed from the man, not typed next to him.
  if (!/function officeSeated\(/.test(source)) problems.push("no officeSeated(): the chair can drift from the man again");
  if (/\b258\b/.test(office) === false) problems.push("the rig does not state the hip height the seat is derived from");

  assert.deepEqual(problems, []);
});
