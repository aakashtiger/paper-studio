import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import {
  GenericBriefSchema,
  RESOLVE_ASSERTIONS,
  ResolveFormatSchema,
  computePackHash,
  loadStylePack,
  readStyleJson,
  resolveStyle,
  sha256,
  validateStylePack,
} from "../src/core/style.js";

/**
 * S1c Paper K-pop gate.
 *
 * This is the command that proves the pack:
 *   - REVIEWABLE with one open director choice;
 *   - 14 shots / 45 s / 16:9 and 8 shots / 30 s / 9:16 from two briefs;
 *   - all eight recipes selected;
 *   - a sealed 6-shot / 30 s / 9:16 blind application;
 *   - the pack is self-contained and independent of every other style;
 *   - the card is visual, short and carries the open choice;
 *   - no film story, lyric, character name or title leaks into the pack.
 */

const ROOT = process.cwd();
const PACK = join(ROOT, "styles", "paper-kpop");
const BLIND = join(ROOT, "gate", "paper-kpop-blind");
const AUTOPSY = join(ROOT, "sources", "paper-kpop", "autopsy.md");

function readBrief(path: string) {
  return GenericBriefSchema.parse(readStyleJson(join(ROOT, path)));
}

function readFormat(path: string) {
  return ResolveFormatSchema.parse(readStyleJson(join(ROOT, path)));
}

function walk(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function textFiles(directory: string): string[] {
  const allowed = new Set([".md", ".json", ".html", ".txt"]);
  return walk(directory).filter((file) => allowed.has(extname(file).toLowerCase()));
}

function visibleBodyCopy(card: string): number {
  const paragraphs = [...card.matchAll(/<(?:p|figcaption)\b[^>]*>([\s\S]*?)<\/(?:p|figcaption)>/gi)];
  return paragraphs
    .map((match) =>
      (match[1] ?? "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z#0-9]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .reduce((count, text) => count + text.split(/\s+/).length, 0);
}

test("paper-kpop gate: REVIEWABLE with exactly one open choice", () => {
  const result = validateStylePack(PACK);
  assert.equal(result.status, "REVIEWABLE");
  assert.equal(result.hardFailures.length, 0, JSON.stringify(result.hardFailures, null, 2));
  assert.equal(result.chosen.length, 1);
  assert.equal(result.chosen[0]?.id, "paper-shadow");
});

test("paper-kpop gate: song resolves 14 shots / 45 s / 16:9 and uses all eight recipes", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("formats/paper-kpop-song/format.json");
  const a = readBrief("fixtures/resolve/paper-kpop-a.json");
  const b = readBrief("fixtures/resolve/paper-kpop-b.json");
  const plan = resolveStyle(pack, a, format, 42, { compare: { brief: b, format } });
  assert.equal(plan.format, "paper-kpop-song");
  assert.equal(plan.shots.length, 14);
  assert.equal(plan.duration, 45);
  assert.equal(plan.aspect, "16:9");
  assert.equal(plan.shots[0]?.slots["content.title"], "PAPER STAGE");
  assert.equal(plan.shots[1]?.slots["content.body"], "THE FLOOR IS YOURS");
  assert.equal(new Set(plan.shots.map((shot) => shot.recipe)).size, 8);
});

test("paper-kpop gate: shorts resolves 8 shots / 30 s / 9:16 and uses all eight recipes", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("formats/paper-kpop-shorts/format.json");
  const a = readBrief("fixtures/resolve/paper-kpop-a.json");
  const b = readBrief("fixtures/resolve/paper-kpop-b.json");
  const plan = resolveStyle(pack, a, format, 42, { compare: { brief: b, format } });
  assert.equal(plan.format, "paper-kpop-shorts");
  assert.equal(plan.shots.length, 8);
  assert.equal(plan.duration, 30);
  assert.equal(plan.aspect, "9:16");
  assert.equal(new Set(plan.shots.map((shot) => shot.recipe)).size, 8);
  const vertical = plan.shots.find((shot) => shot.recipe === "stage_wide")?.composition
    .filter((op) => op.op === "image")
    .map((op) => op.id);
  assert.ok(vertical?.includes("lead-figure"));
  assert.ok(vertical?.includes("second-figure"));
});

test("paper-kpop gate: sealed blind run resolves 6 shots / 30 s / 9:16 and the pack is unchanged", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("gate/paper-kpop-blind/work/format.json");
  const blind = readBrief("gate/paper-kpop-blind/work/brief.json");
  const a = readBrief("fixtures/resolve/paper-kpop-a.json");
  const plan = resolveStyle(pack, blind, format, 7, { compare: { brief: a, format } });
  assert.equal(plan.shots.length, 6);
  assert.equal(plan.duration, 30);
  assert.equal(plan.aspect, "9:16");
  assert.deepEqual(
    plan.shots.map((shot) => shot.recipe),
    ["paper_open", "macro_prop_beat", "portrait_iris", "stage_wide", "sticker_slam", "pullback_close"],
  );
  assert.equal(plan.shots[0]?.slots["content.title"], "Last Cue");
  const archived = readStyleJson(join(BLIND, "archive", "run-17", "work", "brief.json")) as {
    content: { title: string };
  };
  assert.equal(archived.content.title, "ROOFTOP SOUNDCHECK");
  assert.equal(
    readFileSync(join(BLIND, "archive", "run-17", "PACK-HASH.txt"), "utf8").trim(),
    "sha256:719e05825639e0338c31f06099be38d62caa69520752f7736375dd2a6048b2d5",
  );

  const recorded = readFileSync(join(BLIND, "PACK-HASH.txt"), "utf8").trim();
  assert.equal(computePackHash(PACK), recorded);
  assert.equal(computePackHash(join(BLIND, "inputs", "pack")), recorded);
  assert.equal(computePackHash(join(BLIND, "used-inputs", "pack")), recorded);

  const baseline = readFileSync(join(BLIND, "inputs", "MANIFEST.json"));
  const used = readFileSync(join(BLIND, "used-inputs", "MANIFEST.json"));
  assert.ok(baseline.equals(used), "baseline and used manifests differ");
  const manifest = JSON.parse(baseline.toString("utf8")) as {
    algorithm: string;
    files: Record<string, string>;
  };
  assert.equal(manifest.algorithm, "sha256");
  for (const [relativePath, expected] of Object.entries(manifest.files)) {
    for (const root of ["inputs", "used-inputs"]) {
      const file = join(BLIND, root, relativePath);
      assert.equal(sha256(readFileSync(file)), expected, `${root}/${relativePath}`);
    }
  }
});

test("paper-kpop gate: recipe camera, transition and text fill are unambiguous", () => {
  const recipes = readdirSync(join(PACK, "recipes"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readStyleJson(join(PACK, "recipes", file)) as {
      id: string;
      camera: { move: string };
      transitionOut: string;
      vertical?: Array<[string, string]>;
      composition: Array<{
        op: string;
        id?: string;
        color?: string;
        move?: string;
        kind?: string;
      }>;
    });
  assert.equal(recipes.length, 8);
  const tokens = readStyleJson(join(PACK, "tokens.json")) as {
    color: { roles: string[] };
    layout: { shapes: string[]; aspectBoxes: Record<string, Record<string, unknown>> };
  };
  const roles = new Set(tokens.color.roles);
  const shapes = new Set(tokens.layout.shapes);
  const boxes = new Set(Object.keys(tokens.layout.aspectBoxes["9:16"] ?? {}));
  for (const recipe of recipes) {
    const cameraOps = recipe.composition.filter((op) => op.op === "camera");
    const transitionOps = recipe.composition.filter((op) => op.op === "transition");
    assert.equal(cameraOps.length, 1, `${recipe.id} must have one camera op`);
    assert.equal(transitionOps.length, 1, `${recipe.id} must have one transition op`);
    assert.equal(cameraOps[0]?.move, recipe.camera.move, `${recipe.id} camera mismatch`);
    assert.equal(transitionOps[0]?.kind, recipe.transitionOut, `${recipe.id} transition mismatch`);
    if (
      recipe.composition.some((op) => op.op === "effect" && op.kind === "iris") &&
      transitionOps.some((op) => op.kind === "iris")
    ) {
      assert.fail(`${recipe.id} has both an iris effect and an iris transition`);
    }
    const mapped = new Map((recipe.vertical ?? []).map(([id, box]) => [id, box]));
    for (const [id, box] of mapped) {
      assert.ok(boxes.has(box), `${recipe.id} op ${id} maps to unknown 9:16 box ${box}`);
      assert.ok(recipe.composition.some((op) => op.id === id), `${recipe.id} vertical map names unknown op ${id}`);
    }
    for (const op of recipe.composition) {
      if (op.op === "shape" && op.kind) {
        assert.ok(shapes.has(op.kind), `${recipe.id} op ${op.id ?? "(no id)"} uses unknown shape ${op.kind}`);
      }
      if (op.op !== "effect" && op.op !== "camera" && op.op !== "transition" && op.id !== "paper") {
        assert.ok(mapped.has(op.id ?? ""), `${recipe.id} op ${op.id ?? "(no id)"} has no 9:16 map`);
      }
      if (op.op === "text") {
        assert.ok(op.color, `${recipe.id} text op ${op.id ?? "(no id)"} has no fill`);
        assert.ok(roles.has(op.color ?? ""), `${recipe.id} text op ${op.id ?? "(no id)"} uses non-palette fill ${op.color}`);
      }
    }
    const textBoxes = new Set(
      recipe.composition.filter((op) => op.op === "text").map((op) => mapped.get(op.id ?? "")),
    );
    for (const op of recipe.composition.filter((entry) => entry.op === "shape" && entry.kind === "rule")) {
      assert.equal(textBoxes.has(mapped.get(op.id ?? "")), false, `${recipe.id} rule ${op.id} shares a text box`);
    }
  }
});

test("paper-kpop gate: both aspects fit their text, margins, rules and paired anchors", () => {
  const tokens = readStyleJson(join(PACK, "tokens.json")) as {
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
  // Conservative advance widths in em. The test is a floor proof, not a font engine.
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
  ].map((path) => readBrief(path).content);
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

  for (const file of readdirSync(join(PACK, "recipes"))) {
    if (!file.endsWith(".json")) continue;
    const recipe = readStyleJson(join(PACK, "recipes", file)) as {
      id: string;
      composition: Array<{
        op: string;
        id?: string;
        slot?: string;
        typeRole?: string;
        color?: string;
        kind?: string;
        z?: number;
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
});

test("paper-kpop gate: the pack is self-contained", () => {
  const text = textFiles(PACK);
  const forbidden = [
    ["network URL", /https?:\/\//i],
    ["parent path", /\.\.\//],
    ["drive path", /\b[A-Z]:[\\/]/],
    ["watercolor dependency", /watercolor/i],
    ["keepsake dependency", /keepsake/i],
    ["source path", /(^|[^a-z])src[\\/]/i],
    ["asset path", /(^|[^a-z])assets[\\/]/i],
    ["source frame path", /out[\\/]frames/i],
  ] as const;
  for (const file of text) {
    const posix = file.replace(/\\/g, "/");
    if (posix.endsWith("/fonts/OFL.txt") || posix.endsWith("/fonts/LICENSE-Apache-2.0.txt")) {
      continue;
    }
    const body = readFileSync(file, "utf8");
    for (const [label, pattern] of forbidden) {
      assert.equal(pattern.test(body), false, `${label} found in ${file}`);
    }
  }

  const card = readFileSync(join(PACK, "card.html"), "utf8");
  const refs = [...card.matchAll(/(?:src\s*=\s*"([^"]+)"|url\(\s*"([^"]+)"\s*\))/gi)]
    .map((match) => (match[1] ?? match[2] ?? "").trim())
    .filter((value) => value.length > 0 && !value.startsWith("data:") && !value.startsWith("#"));
  for (const ref of refs) {
    assert.equal(/^https?:/i.test(ref), false, `external card dependency: ${ref}`);
    assert.equal(ref.includes(".."), false, `card path escapes the pack: ${ref}`);
    assert.ok(existsSync(resolve(PACK, ref)), `card reference does not exist: ${ref}`);
  }

  const files = walk(PACK);
  for (const file of files) {
    const extension = extname(file).toLowerCase();
    assert.notEqual([".mp4", ".mov", ".webm", ".wav", ".mp3", ".m4a", ".srt"].includes(extension), true, `forbidden media: ${file}`);
    if (extension === ".jpg" || extension === ".jpeg" || extension === ".png") {
      assert.ok(file.replace(/\\/g, "/").includes("/references/frames/"), `unexpected image: ${file}`);
    }
  }
  assert.equal(files.filter((file) => extname(file).toLowerCase() === ".jpg").length, 6);
  assert.equal(existsSync(join(PACK, "signoff.json")), false);
  assert.equal(existsSync(join(PACK, "style.json")), false);
  assert.equal(existsSync(join(PACK, "APPLICATION.md")), true);
});

test("paper-kpop gate: the card is visual, short and leaves paper-shadow open", () => {
  const card = readFileSync(join(PACK, "card.html"), "utf8");
  for (const word of ["REFERENCE", "SPECIMEN", "ANTI", "COLLAGE", "PRINT", "UNSIGNED"]) {
    assert.ok(card.includes(word), `card missing ${word}`);
  }
  assert.equal(/checked|recommended/i.test(card), false, "card pre-fills the open choice");
  assert.ok(card.includes('class="recognition"') || card.includes('data-section="recognition"'), "card missing recognition crops");
  assert.equal((card.match(/class="recog"/g) ?? []).length, 3, "card needs three recognition specimens");
  assert.ok(card.includes("refuses"), "card missing the ANTI definition");
  assert.equal(/https?:\/\//i.test(card), false, "card makes an external request");
  assert.ok(visibleBodyCopy(card) <= 150, `card body copy is ${visibleBodyCopy(card)} words`);
  const totalWords = card.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean).length;
  assert.ok(totalWords <= 240, `card has ${totalWords} visible words; it is becoming a text wall`);
  const references = [...card.matchAll(/references\/frames\/([^"']+\.jpg)/gi)].map((match) => match[1]);
  assert.equal(new Set(references).size, 3);
  for (const frame of references) {
    assert.ok(existsSync(join(PACK, "references", "frames", frame ?? "")), `missing reference: ${frame}`);
  }
});

test("paper-kpop gate: no source film story leaks, and the autopsy covers D01-D27", () => {
  const banned = [
    [/CLAUDE\s+POP/i, "film title"],
    [/\bSOL\b/, "character name"],
    [/\bMIRA\b/, "character name"],
    [/P\(DOOM\)/i, "meter"],
    [/a paper singularity/i, "film subtitle"],
    [/I'm upping/i, "lyric"],
    [/I see sparks/i, "lyric"],
    [/\bFOOM\b/, "lyric"],
    [/shoggoth/i, "story token"],
    [/paperclip/i, "story token"],
    [/basilisk/i, "story token"],
    [/\bGPT\b/, "story token"],
    [/\bSydney\b/, "story token"],
    [/\bNVDA\b/, "story token"],
    [/\bLemo\b/, "lineage token"],
  ] as const;
  for (const root of [PACK, join(BLIND, "work")]) {
    for (const file of textFiles(root)) {
      const posix = file.replace(/\\/g, "/");
      if (posix.endsWith("/fonts/OFL.txt") || posix.endsWith("/fonts/LICENSE-Apache-2.0.txt")) {
        continue;
      }
      const body = readFileSync(file, "utf8");
      for (const [pattern, label] of banned) {
        assert.equal(pattern.test(body), false, `${label} found in ${file}`);
      }
    }
  }

  const autopsy = readFileSync(AUTOPSY, "utf8");
  for (let index = 1; index <= 27; index += 1) {
    assert.ok(autopsy.includes(`D${String(index).padStart(2, "0")}`), `autopsy missing D${index}`);
  }
  const tokens = readStyleJson(join(PACK, "tokens.json")) as {
    color: { palettes: Record<string, Record<string, string>> };
    type: { families: Array<{ file: string }> };
  };
  for (const palette of Object.values(tokens.color.palettes)) {
    for (const hex of Object.values(palette)) {
      assert.ok(autopsy.toLowerCase().includes(hex.toLowerCase()), `autopsy missing palette hex ${hex}`);
    }
  }
  for (const family of tokens.type.families) {
    assert.ok(existsSync(join(PACK, family.file)), `font file missing: ${family.file}`);
  }
  const licence = readFileSync(join(PACK, "LICENSE-THIRD-PARTY.txt"), "utf8");
  assert.match(licence, /OFL/);
  assert.match(licence, /Apache/);
  assert.match(licence, /author/i);
});
