import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { GenericBriefSchema, readStyleJson } from "../src/core/style.js";

/**
 * The pack's geometry proof: every text box, in both aspects, at the 14 px floor.
 *
 * It lives in its own module because two gates have to make the same claim
 * about two different packs: `paper-kpop-gate` proves the **sealed 0.1.0** pack
 * still holds, and `paper-kpop-0.2.0-gate` proves the pack that ships today
 * holds as well — including the eight office recipes added for *Same Alarm*.
 * One proof, two packs, so a fix can never land on only one of them.
 *
 * It is a floor proof, not a font engine: advances are conservative em widths,
 * and the fixture set is the widest string each slot will ever carry.
 */
export function assertPackGeometry(packPath: string): void {
  const tokens = readStyleJson(join(packPath, "tokens.json")) as {
    type: {
      scale: Record<string, number>;
      treatment: { metrics: { charRot: number } };
    };
    layout: {
      aspectScale: Record<string, Record<string, number>>;
      aspectBoxes: Record<string, Record<string, { x: number; y: number; w: number; h: number }>>;
    };
  };
  const scale16 = tokens.type.scale;
  const boxes96 = tokens.layout.aspectBoxes["9:16"] ?? {};
  const screen96 = boxes96.screen ?? { x: 0, y: 0, w: 1, h: 1 };
  const lineFactor: Record<string, number> = {
    display: scale16.displayLine ?? 0.85,
    body: scale16.bodyLine ?? 1.05,
    caption: scale16.captionLine ?? 1.2,
    label: 1,
    monogram: 1,
  };
  // Conservative advance widths in em.
  const advance: Record<string, number> = {
    display: 0.56,
    body: 0.72,
    caption: 0.61,
    label: 0.61,
    monogram: 0.6,
  };
  const fixtures = [
    "fixtures/resolve/paper-kpop-a.json",
    "fixtures/resolve/paper-kpop-b.json",
    "gate/paper-kpop-blind/work/brief.json",
  ].map((path) => GenericBriefSchema.parse(readStyleJson(path)).content);
  const values: Record<string, string[]> = {};
  for (const content of fixtures) {
    for (const [key, value] of Object.entries(content)) {
      if (typeof value === "string") (values[key] ??= []).push(value);
    }
  }
  const worst: Record<string, string> = {};
  for (const [key, list] of Object.entries(values)) {
    worst[key] = [...list].sort((a, b) => b.length - a.length)[0] ?? "";
  }

  const frame = (aspect: string) =>
    aspect === "16:9"
      ? { w: 390, h: (390 * 9) / 16 }
      : { w: 390, h: (390 * 16) / 9 };
  const intersect = (
    a: { x: number; y: number; w: number; h: number },
    b: { x: number; y: number; w: number; h: number },
  ) =>
    Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
    Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const inside = (
    inner: { x: number; y: number; w: number; h: number },
    outer: { x: number; y: number; w: number; h: number },
  ) =>
    inner.x >= outer.x - 1e-9 &&
    inner.y >= outer.y - 1e-9 &&
    inner.x + inner.w <= outer.x + outer.w + 1e-9 &&
    inner.y + inner.h <= outer.y + outer.h + 1e-9;
  const wordsWidth = (text: string, role: string, size: number) =>
    Math.max(
      ...text
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.length * (advance[role] ?? 0.7) * size),
    );
  const lineCount = (text: string, role: string, size: number, maxWidth: number) => {
    let lines = 1;
    let current = 0;
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const width = word.length * (advance[role] ?? 0.7) * size;
      const space = current === 0 ? 0 : (advance[role] ?? 0.7) * size;
      if (current + space + width > maxWidth) {
        lines += 1;
        current = width;
      } else {
        current += space + width;
      }
    }
    return lines;
  };

  for (const file of readdirSync(join(packPath, "recipes"))) {
    if (!file.endsWith(".json")) continue;
    const recipe = readStyleJson(join(packPath, "recipes", file)) as {
      id: string;
      composition: Array<{
        op: string;
        id?: string;
        slot?: string;
        typeRole?: string;
        color?: string;
        kind?: string;
        x?: number;
        y?: number;
        w?: number;
        h?: number;
      }>;
      vertical?: Array<[string, string]>;
    };
    const map = new Map(recipe.vertical ?? []);
    for (const aspect of ["16:9", "9:16"]) {
      const resolved = recipe.composition
        .filter((op) => op.op !== "effect" && op.op !== "camera" && op.op !== "transition")
        .map((op) => {
          let box = { x: op.x ?? 0, y: op.y ?? 0, w: op.w ?? 0, h: op.h ?? 0 };
          let anchor: string | undefined;
          if (aspect === "9:16") {
            anchor = map.get(op.id ?? "");
            if (anchor) box = tokens.layout.aspectBoxes["9:16"]?.[anchor] ?? box;
          }
          return { ...op, box, anchor };
        });
      const dims = frame(aspect);
      const texts = resolved.filter((op) => op.op === "text");
      const rules = resolved.filter((op) => op.op === "shape" && op.kind === "rule");

      for (const text of texts) {
        const box = text.box;
        const slot = text.slot ?? "";
        const key = slot.split(".")[1] ?? "";
        const value = worst[key] ?? "";
        const role = text.typeRole ?? "body";
        const roleAdvance = advance[role] ?? 0.7;
        assert.ok(
          wordsWidth(value, role, 14) <= box.w * dims.w,
          `${recipe.id} ${aspect} ${text.id}: a word cannot fit at the 14 px floor`,
        );
        assert.ok(
          lineCount(value, role, 14, box.w * dims.w) * (lineFactor[role] ?? 1.2) * 14 <= box.h * dims.h,
          `${recipe.id} ${aspect} ${text.id}: the 14 px floor needs more lines than the box holds`,
        );
        assert.ok(roleAdvance > 0, `${recipe.id} ${text.id}: unknown type role ${role}`);

        const isLyricHud = recipe.id === "portrait_iris" && key === "caption";
        if (!isLyricHud) {
          assert.ok(box.x >= 0.06 - 1e-9, `${recipe.id} ${aspect} ${text.id} leaves the left margin`);
          assert.ok(box.y >= 0.06 - 1e-9, `${recipe.id} ${aspect} ${text.id} leaves the top margin`);
          assert.ok(box.x + box.w <= 0.94 + 1e-9, `${recipe.id} ${aspect} ${text.id} leaves the right margin`);
          assert.ok(box.y + box.h <= 0.88 + 1e-9, `${recipe.id} ${aspect} ${text.id} enters the bottom 12%`);
        }
      }

      for (let i = 0; i < texts.length; i += 1) {
        for (let j = i + 1; j < texts.length; j += 1) {
          assert.ok(
            intersect(texts[i]!.box, texts[j]!.box) < 1e-9,
            `${recipe.id} ${aspect}: ${texts[i]!.id} overlaps ${texts[j]!.id}`,
          );
        }
      }
      for (const rule of rules) {
        for (const text of texts) {
          assert.ok(
            intersect(rule.box, text.box) < 1e-9,
            `${recipe.id} ${aspect}: ${rule.id} crosses ${text.id}`,
          );
        }
      }

      const roles = new Set(["paper", "ink"]);
      for (const op of resolved) if (op.color) roles.add(op.color);
      assert.ok(roles.size <= 4, `${recipe.id} ${aspect}: ${roles.size} explicit colour roles`);

      if (recipe.id === "macro_prop_beat") {
        const object = resolved.find((op) => op.id === "macro-object");
        const table = resolved.find((op) => op.id === "tabletop-plane");
        assert.ok(object && table);
        assert.ok(
          Math.abs(object.box.y + object.box.h - table.box.y) < 1e-9,
          `${recipe.id} ${aspect}: macro object does not touch the tabletop`,
        );
      }
      if (recipe.id === "stage_wide") {
        const stage = resolved.find((op) => op.id === "wide-stage");
        const lead = resolved.find((op) => op.id === "lead-figure");
        const second = resolved.find((op) => op.id === "second-figure");
        assert.ok(stage && lead && second);
        for (const figure of [lead, second]) {
          assert.ok(
            figure.box.y + figure.box.h <= stage.box.y + stage.box.h + 1e-9,
            `${recipe.id} ${aspect}: ${figure.id} stands below the stage floor`,
          );
        }
      }

      const boxOf = (id: string) => resolved.find((op) => op.id === id)?.box;
      if (recipe.id === "paper_open") {
        assert.ok(inside(boxOf("core-burst")!, boxOf("open-sun")!));
        if (aspect === "9:16") {
          assert.notEqual(
            resolved.find((op) => op.id === "core-burst")?.anchor,
            resolved.find((op) => op.id === "open-sun")?.anchor,
          );
        }
      }
      if (recipe.id === "portrait_iris") {
        assert.ok(inside(boxOf("caption-line")!, boxOf("lyric-band")!));
        if (aspect === "9:16") {
          assert.notEqual(
            resolved.find((op) => op.id === "caption-line")?.anchor,
            resolved.find((op) => op.id === "lyric-band")?.anchor,
          );
        }
      }
      if (recipe.id === "sticker_slam") {
        assert.ok(inside(boxOf("sticker-slam")!, boxOf("torn-bed")!));
        assert.ok(inside(boxOf("body-slam")!, boxOf("sticker-slam")!));
        assert.ok(inside(boxOf("slam-rule")!, boxOf("sticker-slam")!));
        assert.equal(
          resolved.find((op) => op.id === "body-slam")?.color,
          "ink",
          `${recipe.id} ${aspect}: quote type must be ink on the paper sticker`,
        );
        if (aspect === "9:16") {
          assert.notEqual(
            resolved.find((op) => op.id === "sticker-slam")?.anchor,
            resolved.find((op) => op.id === "torn-bed")?.anchor,
          );
        }
      }
      if (recipe.id === "pullback_close") {
        assert.ok(inside(boxOf("body-line")!, boxOf("close-strip")!));
        if (aspect === "9:16") {
          assert.notEqual(
            resolved.find((op) => op.id === "body-line")?.anchor,
            resolved.find((op) => op.id === "close-strip")?.anchor,
          );
        }
      }
      if (recipe.id === "side_scroll_chase") {
        assert.ok(inside(boxOf("chase-arrow")!, boxOf("corridor-run")!));
        if (aspect === "9:16") {
          assert.notEqual(
            resolved.find((op) => op.id === "chase-arrow")?.anchor,
            resolved.find((op) => op.id === "corridor-run")?.anchor,
          );
        }
      }
      if (recipe.id === "stage_wide") {
        const screen = aspect === "9:16" ? screen96 : { x: 0, y: 0, w: 1, h: 1 };
        assert.ok(inside(boxOf("stage-burst")!, screen));
      }
      if (recipe.id === "sticker_slam") {
        const screen = aspect === "9:16" ? screen96 : { x: 0, y: 0, w: 1, h: 1 };
        assert.ok(inside(boxOf("slam-burst")!, screen));
      }
    }
  }
}
