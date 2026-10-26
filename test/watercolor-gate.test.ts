import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import {
  GenericBriefSchema,
  RESOLVE_ASSERTIONS,
  ResolveFormatSchema,
  computePackHash,
  loadStylePack,
  readStyleJson,
  resolveStyle,
  sha256,
  styleExitCode,
  validateStylePack,
} from "../src/core/style.js";

/**
 * S1b watercolor gate.
 *
 * This file is the command that proves the pilot:
 *   - the pack is REVIEWABLE with one open taste choice;
 *   - the page resolves 8 shots / 45 s / 1:1 from two briefs;
 *   - the scroll resolves 4 shots / 45 s / 16:9 from two briefs;
 *   - the sealed blind run resolves 6 shots / 30 s / 9:16;
 *   - the live pack, the baseline inputs and the author's used inputs all match;
 *   - keepsake and the template did not regress;
 *   - the card, STYLE.md, autopsy and licence carry the promised evidence.
 */

const ROOT = process.cwd();
const PACK = join(ROOT, "styles", "watercolor");
const BLIND = join(ROOT, "gate", "watercolor-blind");

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

test("watercolor gate: pack is REVIEWABLE with exactly one open choice", () => {
  const result = validateStylePack(PACK);
  assert.equal(result.status, "REVIEWABLE");
  assert.equal(result.hardFailures.length, 0, JSON.stringify(result.hardFailures, null, 2));
  assert.equal(result.chosen.length, 1);
  assert.equal(result.chosen[0]?.id, "paint-in-speed");
  assert.equal(RESOLVE_ASSERTIONS.length, 9);
});

test("watercolor gate: 1:1 page resolves 8 shots / 45 s from two briefs", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("formats/watercolor-page/format.json");
  const garden = readBrief("fixtures/resolve/watercolor-garden.json");
  const song = readBrief("fixtures/resolve/watercolor-song.json");
  const plan = resolveStyle(pack, garden, format, 42, { compare: { brief: song, format } });
  assert.equal(plan.format, "watercolor-page");
  assert.equal(plan.shots.length, 8);
  assert.equal(plan.duration, 45);
  assert.equal(plan.aspect, "1:1");
  assert.equal(plan.shots[0]?.slots["content.names"], "Mira and Jonah");
});

test("watercolor gate: 16:9 scroll resolves 4 shots / 45 s from two briefs", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("formats/watercolor-scroll/format.json");
  const garden = readBrief("fixtures/resolve/watercolor-garden.json");
  const song = readBrief("fixtures/resolve/watercolor-song.json");
  const plan = resolveStyle(pack, garden, format, 42, { compare: { brief: song, format } });
  assert.equal(plan.format, "watercolor-scroll");
  assert.equal(plan.shots.length, 4);
  assert.equal(plan.duration, 45);
  assert.equal(plan.aspect, "16:9");
});

test("watercolor gate: sealed blind run resolves 6 shots / 30 s / 9:16", () => {
  const pack = loadStylePack(PACK);
  const format = readFormat("gate/watercolor-blind/work/format.json");
  const blind = readBrief("gate/watercolor-blind/work/brief.json");
  const garden = readBrief("fixtures/resolve/watercolor-garden.json");
  const plan = resolveStyle(pack, blind, format, 7, { compare: { brief: garden, format } });
  assert.equal(plan.shots.length, 6);
  assert.equal(plan.duration, 30);
  assert.equal(plan.aspect, "9:16");
});

test("watercolor gate: the medium values and corrected recipes are present", () => {
  const tokens = readStyleJson(join(PACK, "tokens.json")) as {
    medium: {
      texture: number;
      granulation: number;
      layerOrder: string[];
      strokeWidths: Record<string, number>;
    };
    color: { palettes: Record<string, Record<string, string>> };
    motion: { sway: { tree: number } };
    seed: { seeded: string[] };
    type: { scale: Record<string, number> };
    layout: {
      aspectBoxes: Record<
        string,
        Record<string, { x: number; y: number; w: number; h: number }>
      >;
    };
  };
  assert.equal(tokens.medium.texture, 0.22);
  assert.ok(tokens.medium.granulation > 0);
  assert.ok((tokens.medium.strokeWidths.wide ?? 0) >= 6);
  assert.ok((tokens.medium.strokeWidths.standard ?? 99) < 6);
  assert.ok(tokens.medium.layerOrder.some((entry) => entry.includes("mist band")));
  assert.equal(tokens.motion.sway.tree, 0.006);
  assert.ok(tokens.seed.seeded.includes("sway phase"));
  for (const palette of Object.values(tokens.color.palettes)) {
    assert.equal(palette.deep, palette.wash, "deep must be the wash, not a sixth pigment");
  }
  const vertical = tokens.layout.aspectBoxes["9:16"] ?? {};
  for (const key of [
    "names",
    "labelVenue",
    "labelDate",
    "specimen",
    "specimenWash",
    "specimenLeader",
    "specimenNote",
    "quote",
    "quoteObject",
    "quoteLeader",
    "quoteWash",
    "quoteNote",
    "walkLeader",
    "closeSeal",
    "closeMonogram",
    "closeNote",
    "closeDate",
    "closeDetail",
    "closeWash",
    "closeGap",
    "horizonWash",
  ]) {
    assert.ok(vertical[key] !== undefined, `9:16 aspect box missing: ${key}`);
  }
  const titleBox = vertical.title;
  const archBox = vertical.arch;
  assert.ok(titleBox && archBox);
  assert.ok(
    titleBox.x + titleBox.w <= archBox.x,
    "title box must not overlap the arch",
  );
  const subtitleBox = vertical.subtitle;
  assert.ok(subtitleBox && subtitleBox.x + subtitleBox.w <= archBox.x);
  assert.ok((tokens.type.scale.displayLine ?? 0) > 0);
  assert.ok((tokens.type.scale.bodyLine ?? 0) > 0);
  assert.ok((tokens.type.scale.captionLine ?? 0) > 0);
  const specimenBox = vertical.specimen;
  const specimenNote = vertical.specimenNote;
  assert.ok(specimenBox && specimenNote);
  const noOverlap =
    specimenNote.x >= specimenBox.x + specimenBox.w ||
    specimenNote.y >= specimenBox.y + specimenBox.h;
  assert.ok(noOverlap, "specimen note must not cover the specimen");
  assert.ok(specimenNote.w >= 0.5, "specimen note must be wide enough for a note");
  assert.ok((vertical.names?.h ?? 0) >= 0.08, "names box must hold two short lines");
  for (const box of [vertical.seal, vertical.monogram]) {
    assert.ok(box && box.x + box.w <= 0.92, "title mark must stay inside the right margin");
  }
  for (const [recipe, pair] of [
    ["watercolor_title", ["names", "names"]],
    ["watercolor_title", ["horizon", "horizonWash"]],
    ["watercolor_specimen", ["note", "specimenNote"]],
    ["watercolor_specimen", ["leader", "specimenLeader"]],
    ["watercolor_specimen", ["edge-wash", "specimenWash"]],
    ["watercolor_quote", ["object", "quoteObject"]],
    ["watercolor_quote", ["leader", "quoteLeader"]],
    ["watercolor_quote", ["object-wash", "quoteWash"]],
    ["watercolor_close", ["paper-gap", "closeGap"]],
    ["watercolor_walk", ["leader", "walkLeader"]],
  ] as const) {
    const data = readStyleJson(join(PACK, "recipes", `${recipe}.json`)) as {
      vertical?: Array<[string, string]>;
    };
    assert.ok(
      data.vertical?.some(([from, to]) => from === pair[0] && to === pair[1]),
      `${recipe} missing vertical map ${pair[0]} -> ${pair[1]}`,
    );
  }

  const mist = readStyleJson(join(PACK, "recipes", "watercolor_mist.json")) as {
    composition: Array<{ op: string; id?: string; opacity?: number; points?: unknown[] }>;
  };
  assert.equal(mist.composition.some((op) => op.op === "layer"), false);
  const mistShape = mist.composition.find((op) => op.op === "shape" && op.id === "mist");
  assert.equal(mistShape?.opacity, 1);
  assert.ok((mistShape?.points?.length ?? 0) > 3);
  assert.ok(mist.composition.some((op) => op.id === "mist-full"));

  const close = readStyleJson(join(PACK, "recipes", "watercolor_close.json")) as {
    composition: Array<{ id?: string }>;
  };
  assert.ok(close.composition.some((op) => op.id === "paper-gap"));

  const walk = readStyleJson(join(PACK, "recipes", "watercolor_walk.json")) as {
    composition: Array<{ id?: string }>;
  };
  assert.ok(walk.composition.some((op) => op.id === "leader"));
  const walkData = readStyleJson(join(PACK, "recipes", "watercolor_walk.json")) as {
    world?: { width?: number };
    entries?: unknown[];
  };
  assert.ok((walkData.world?.width ?? 0) > 1);
  assert.ok((walkData.entries?.length ?? 0) >= 3);
});

test("watercolor gate: the subtitle role and names slot are consistent", () => {
  const title = readStyleJson(join(PACK, "recipes", "watercolor_title.json")) as {
    slots: string[];
    composition: Array<{ op: string; slot?: string; typeRole?: string }>;
  };
  assert.ok(title.slots.includes("content.names"));
  const subtitle = title.composition.find(
    (op) => op.op === "text" && op.slot === "content.subtitle",
  );
  assert.equal(subtitle?.typeRole, "body");
  const style = readFileSync(join(PACK, "STYLE.md"), "utf8");
  assert.match(style, /subtitle, names and body use body/);
});


test("watercolor gate: live pack, baseline inputs and used inputs match", () => {
  const recorded = readFileSync(join(BLIND, "PACK-HASH.txt"), "utf8").trim();
  assert.equal(computePackHash(PACK), recorded);
  assert.equal(computePackHash(join(BLIND, "used-inputs", "pack")), recorded);

  const baselineBytes = readFileSync(join(BLIND, "inputs", "MANIFEST.json"));
  const usedBytes = readFileSync(join(BLIND, "used-inputs", "MANIFEST.json"));
  assert.ok(baselineBytes.equals(usedBytes), "baseline and used manifests differ");

  const manifest = JSON.parse(baselineBytes.toString("utf8")) as {
    algorithm: string;
    files: Record<string, string>;
  };
  assert.equal(manifest.algorithm, "sha256");
  assert.ok(Object.keys(manifest.files).length >= 20);
  for (const [relativePath, expected] of Object.entries(manifest.files)) {
    for (const root of ["inputs", "used-inputs"]) {
      const file = join(BLIND, root, relativePath);
      assert.equal(sha256(readFileSync(file)), expected, `${root}/${relativePath}`);
    }
  }
});

test("watercolor gate: keepsake and the template did not regress", () => {
  const keepsake = validateStylePack("styles/_examples/keepsake");
  assert.equal(keepsake.status, "REVIEWABLE");
  assert.equal(keepsake.hardFailures.length, 0);
  assert.equal(keepsake.chosen.length, 1);

  const template = validateStylePack("styles/_template");
  assert.equal(template.status, "DRAFT");
  assert.equal(styleExitCode(template, "styles/_template"), 0);
});

test("watercolor gate: card carries the six evidence tests and no external requests", () => {
  const card = readFileSync(join(PACK, "card.html"), "utf8");
  assert.equal(/https?:\/\//.test(card), false);
  for (const label of [
    "Paper is the white",
    "Flying white",
    "Pooled edge",
    "Painting-in",
    "Annotation leader",
    "No vector outline",
  ]) {
    assert.ok(card.includes(label), `card missing evidence label: ${label}`);
  }
  for (const frame of ["title", "walk", "specimen", "quote", "mist", "close"]) {
    assert.ok(card.includes(`<figcaption>${frame}</figcaption>`), `card missing strip frame: ${frame}`);
  }
  for (const parameter of [
    "paper #f3ead9",
    "wash 3 passes",
    "bristles 3–9",
    "halo 12 px",
    "leader 1.5 px",
  ]) {
    assert.ok(card.includes(parameter), `card missing parameter: ${parameter}`);
  }
  for (const progress of [0, 1, 2, 3]) {
    assert.ok(card.includes(`data-progress="${progress}"`), `card missing progress ${progress}`);
  }
  for (const aspect of ["1:1 page", "16:9 scroll", "9:16 page"]) {
    assert.ok(card.includes(aspect), `card missing aspect proof: ${aspect}`);
  }
  assert.ok(card.includes('data-world="walk"'), "card missing the walk world strip");
  assert.ok(card.includes("#efe6d4"), "card missing evening-blue paper");
  assert.ok(card.includes("#8fa3b0"), "card missing evening-blue wash");
});

test("watercolor gate: STYLE.md has the eleven headings in order", () => {
  const style = readFileSync(join(PACK, "STYLE.md"), "utf8");
  const headings = style
    .split(/\r?\n/)
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
  assert.deepEqual(headings, [
    "Intent",
    "Materials & surface",
    "Colour logic",
    "Type & lettering",
    "Composition & framing",
    "Motion & camera",
    "Sound & silence",
    "Signature",
    "Refusals",
    "Not for",
    "Questions",
  ]);
});

test("watercolor gate: autopsy covers D01-D27 and the pack names its licence", () => {
  const autopsy = readFileSync(join(ROOT, "sources", "lemo", "watercolor-source.md"), "utf8");
  for (let index = 1; index <= 27; index += 1) {
    const id = `D${String(index).padStart(2, "0")}`;
    assert.ok(autopsy.includes(id), `autopsy missing ${id}`);
  }
  const capabilities = readStyleJson(join(PACK, "capabilities.json")) as {
    identity: { licence: string };
  };
  assert.match(capabilities.identity.licence, /Proprietary/);
  assert.match(capabilities.identity.licence, /OFL/);
});

test("watercolor gate: no Lemo media, no signoff, no loose files", () => {
  const files = walk(PACK);
  const forbidden = [".mp4", ".mov", ".wav", ".jpg", ".jpeg", ".png", ".srt"];
  for (const file of files) {
    assert.equal(
      forbidden.includes(extname(file).toLowerCase()),
      false,
      `forbidden media in pack: ${file}`,
    );
  }
  assert.equal(existsSync(join(PACK, "signoff.json")), false);
  assert.equal(existsSync(join(BLIND, "work", "treatment.md")), true);
  assert.equal(existsSync(join(BLIND, "work", "questions.md")), true);
  assert.ok(files.length > 10);
});
