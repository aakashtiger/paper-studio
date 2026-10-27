import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import {
  GenericBriefSchema,
  ResolveFormatSchema,
  computePackHash,
  loadStylePack,
  readStyleJson,
  resolveStyle,
  sha256,
  validateStylePack,
} from "../src/core/style.js";

/**
 * S1c.1 Watercolor 0.2.0 gate.
 *
 * Proves:
 *   - the 0.2.0 pack is REVIEWABLE with one open choice;
 *   - page 8/45/1:1, scroll 4/45/16:9, blind 6/30/9:16;
 *   - the exact manifest set, pack hashes and UTF-8 resolve;
 *   - the card is visual-first, dense but not a text wall, and labels
 *     1:1/16:9 text fit unverified/S2;
 *   - the 0.1.0 evidence is untouched and the final blind is run-2.
 */

const ROOT = process.cwd();
const PACK = join(ROOT, "styles", "watercolor-0.2.0");
const BLIND = join(ROOT, "gate", "watercolor-0.2.0");
const OLD_BLIND = join(ROOT, "gate", "watercolor-blind");

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
function totalWords(card: string): number {
  return card
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

test("watercolor 0.2.0 gate: pack is REVIEWABLE with exactly one open choice", () => {
  const result = validateStylePack(PACK);
  assert.equal(result.status, "REVIEWABLE");
  assert.equal(result.hardFailures.length, 0, JSON.stringify(result.hardFailures, null, 2));
  assert.equal(result.chosen.length, 1);
  assert.equal(result.chosen[0]?.id, "paint-in-speed");
  const capabilities = readStyleJson(join(PACK, "capabilities.json")) as {
    identity: { version: string };
  };
  assert.equal(capabilities.identity.version, "0.2.0");
  assert.match(readFileSync(join(PACK, "STYLE.md"), "utf8"), /\*\*Version:\*\* 0\.2\.0/);
});

test("watercolor 0.2.0 gate: page 8/45/1:1 and scroll 4/45/16:9 from two briefs", () => {
  const pack = loadStylePack(PACK);
  const garden = readBrief("fixtures/resolve/watercolor-garden.json");
  const song = readBrief("fixtures/resolve/watercolor-song.json");
  const page = resolveStyle(
    pack,
    garden,
    readFormat("formats/watercolor-page/format.json"),
    42,
    { compare: { brief: song, format: readFormat("formats/watercolor-page/format.json") } },
  );
  assert.equal(page.format, "watercolor-page");
  assert.equal(page.shots.length, 8);
  assert.equal(page.duration, 45);
  assert.equal(page.aspect, "1:1");
  const scroll = resolveStyle(
    pack,
    garden,
    readFormat("formats/watercolor-scroll/format.json"),
    42,
    { compare: { brief: song, format: readFormat("formats/watercolor-scroll/format.json") } },
  );
  assert.equal(scroll.format, "watercolor-scroll");
  assert.equal(scroll.shots.length, 4);
  assert.equal(scroll.duration, 45);
  assert.equal(scroll.aspect, "16:9");
});

test("watercolor 0.2.0 gate: final blind is 6/30/9:16 and differs from the archive", () => {
  const pack = loadStylePack(PACK);
  const blind = readBrief("gate/watercolor-0.2.0/work/brief.json");
  const format = readFormat("gate/watercolor-0.2.0/work/format.json");
  const garden = readBrief("fixtures/resolve/watercolor-garden.json");
  const plan = resolveStyle(pack, blind, format, 7, {
    compare: { brief: garden, format: readFormat("formats/watercolor-page/format.json") },
  });
  assert.equal(plan.shots.length, 6);
  assert.equal(plan.duration, 30);
  assert.equal(plan.aspect, "9:16");
  assert.deepEqual(
    plan.shots.map((shot) => shot.recipe),
    [
      "watercolor_title",
      "watercolor_specimen",
      "watercolor_quote",
      "watercolor_mist",
      "watercolor_specimen",
      "watercolor_close",
    ],
  );
  assert.equal(plan.shots[0]?.slots["content.title"], "A Small Inventory");
  assert.notEqual(plan.shots[0]?.slots["content.title"], "The Garden We Borrowed");
  const archived = readStyleJson(join(BLIND, "archive", "run-1", "work", "brief.json")) as {
    content: { title: string };
  };
  assert.notEqual(plan.shots[0]?.slots["content.title"], archived.content.title);
  assert.equal(
    readFileSync(join(BLIND, "archive", "run-1", "PACK-HASH.txt"), "utf8").trim(),
    "sha256:182b6733596919733dd9aefd17f1b11c0affcf716208c0431c09d1c5516f8bbb",
  );
});

test("watercolor 0.2.0 gate: exact manifest set and pack hash match", () => {
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
  const expectedFiles = walk(join(BLIND, "inputs"))
    .map((file) => file.slice(join(BLIND, "inputs").length + 1).replace(/\\/g, "/"))
    .filter((file) => file !== "MANIFEST.json")
    .sort();
  assert.deepEqual(Object.keys(manifest.files).sort(), expectedFiles);
  for (const [relativePath, expected] of Object.entries(manifest.files)) {
    for (const root of ["inputs", "used-inputs"]) {
      assert.equal(sha256(readFileSync(join(BLIND, root, relativePath))), expected, `${root}/${relativePath}`);
    }
  }
});

test("watercolor 0.2.0 gate: resolve.txt is UTF-8, has nine passes and no mojibake", () => {
  const bytes = readFileSync(join(BLIND, "resolve.txt"));
  assert.notEqual(bytes[0], 0xef, "resolve.txt must not start with a BOM");
  const text = bytes.toString("utf8");
  assert.match(text, /STYLE: watercolor 0\.2\.0/);
  assert.equal((text.match(/ — PASS/g) ?? []).length, 9, "expected nine PASS assertions");
  assert.equal(/FAIL/.test(text), false);
  assert.equal(/ΓÇ|┬╖|�/.test(text), false, "resolve.txt has mojibake");
  assert.match(text, /A Small Inventory/);
});

test("watercolor 0.2.0 gate: card is visual-first, dense but under the caps, and labels unverified text proof", () => {
  const card = readFileSync(join(PACK, "card.html"), "utf8");
  assert.ok(visibleBodyCopy(card) <= 150, `card body copy is ${visibleBodyCopy(card)} words`);
  assert.ok(totalWords(card) <= 240, `card visible words are ${totalWords(card)}`);
  assert.equal(/https?:\/\//i.test(card), false, "card makes an external request");
  assert.equal(/<img\b/i.test(card), false, "card uses a raster still");
  assert.equal(/\bLemo\b|lemo/i.test(card), false, "card names the source library");
  for (const marker of [
    'data-card="watercolor-0.2.0"',
    'data-section="hero"',
    'data-section="walk"',
    'data-section="phone"',
    'data-section="anti"',
    'data-section="palette"',
    'data-section="type"',
    'data-section="paint"',
    'data-section="rules"',
    'data-section="fit"',
    'data-section="proof"',
    'data-section="signoff"',
    'data-section="sound"',
    'data-status',
    'data-waiting',
    'data-signoff',
    "paint12",
    "paint18",
    "UNVERIFIED",
    "1.2",
    "1.8",
    "ANTI",
    "BOX DIAGRAMS",
  ]) {
    assert.ok(card.includes(marker), `card missing ${marker}`);
  }
  assert.ok((card.match(/unverified/gi) ?? []).length >= 3, "card must label 1:1 and 16:9 text fit unverified/S2");
  assert.equal(/checked|recommended/i.test(card), false, "card pre-fills the open choice");
});

test("watercolor 0.2.0 gate: APPLICATION.md is schemas, fit math and template only", () => {
  const application = readFileSync(join(PACK, "APPLICATION.md"), "utf8");
  const words = application.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  assert.ok(words <= 650, `application is ${words} words`);
  for (const heading of ["Brief JSON", "Format JSON", "Resolver fit math", "Treatment template", "Rules"]) {
    assert.ok(application.includes(heading), `application missing ${heading}`);
  }
  for (const banned of ["Lemo", "Follow the Rain", "paper #f3ead9", "bristle", "halftone", "strokeWidths"]) {
    assert.equal(application.includes(banned), false, `application still carries style prescription: ${banned}`);
  }
  assert.equal(application.includes("aspectRules"), false, "application references a missing aspectRules key");
});

test("watercolor 0.2.0 gate: 0.1.0 evidence is untouched and the pack has no media", () => {
  assert.equal(
    readFileSync(join(OLD_BLIND, "PACK-HASH.txt"), "utf8").trim(),
    "sha256:31b804d0530f5a7e4065f41dbfef683153dc9144a61336fa4b892ae74a9bafa5",
  );
  assert.equal(computePackHash(join(ROOT, "styles", "watercolor")), computePackHash(join(OLD_BLIND, "inputs", "pack")));
  for (const file of walk(PACK)) {
    assert.notEqual(
      [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".wav", ".srt"].includes(extname(file).toLowerCase()),
      true,
      `forbidden media: ${file}`,
    );
  }
  assert.equal(existsSync(join(PACK, "signoff.json")), false);
  assert.equal(existsSync(join(BLIND, "work", "treatment.md")), true);
  assert.equal(existsSync(join(BLIND, "archive", "run-1", "work", "treatment.md")), true);
});

test("watercolor 0.2.0 gate: card height and phone proof", (t) => {
  const script = join(ROOT, "scripts", "card-audit.mjs");
  const measure = (width: number, height: number) => {
    try {
      const output = execFileSync(process.execPath, [script, join(PACK, "card.html"), String(width), String(height)], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 8 * 1024 * 1024,
      });
      return JSON.parse(output) as {
        document: { h: number; horizontalOverflow: boolean };
        phone: { w: number } | null;
        phoneScreen: { w: number; h: number } | null;
      };
    } catch (error) {
      if ((error as { status?: number }).status === 2) return null;
      throw error;
    }
  };
  const desktop = measure(900, 700);
  const phone = measure(390, 844);
  if (!desktop || !phone) {
    t.skip("Chrome/Edge is not available for the card height measurement");
    return;
  }
  assert.equal(desktop.document.horizontalOverflow, false);
  assert.equal(phone.document.horizontalOverflow, false);
  assert.ok(desktop.document.h <= 4500, `900 px card is ${desktop.document.h}px`);
  assert.ok(phone.document.h <= 5200, `390 px card is ${phone.document.h}px`);
  assert.ok(desktop.phone && desktop.phone.w >= 380, "900 px phone frame is too narrow");
  assert.ok(phone.phone && phone.phone.w >= 370, "390 px phone frame is too narrow");
  assert.ok(desktop.phoneScreen && phone.phoneScreen);
  const desktopAspect = desktop.phoneScreen.w / desktop.phoneScreen.h;
  const phoneAspect = phone.phoneScreen.w / phone.phoneScreen.h;
  assert.ok(Math.abs(desktopAspect - 9 / 16) < 0.01, `desktop phone aspect ${desktopAspect}`);
  assert.ok(Math.abs(phoneAspect - 9 / 16) < 0.01, `phone aspect ${phoneAspect}`);
});
