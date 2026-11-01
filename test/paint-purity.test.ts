import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Determinism is a property of the code, not a hope about the environment
 * (decision 0032, non-negotiable #1).
 *
 * The twin sample proves that *today's* painter paints the same bytes twice.
 * This test is what keeps that true tomorrow: it reads the film's own paint code
 * — the pack's recipes, the film's painter and its generated score data, and the
 * page's inline script — and refuses the shapes that make a frame depend on
 * anything but the film's time and the score.
 *
 * The vendor libraries are deliberately **not** read. gsap legitimately contains
 * `Date.now` inside its own ticker; what matters is that our code never lets a
 * ticker decide a frame.
 */
const root = process.cwd();

/** One line, one reason. A refusal names the source, so it can be fixed. */
const BANNED: { pattern: RegExp; reason: string }[] = [
  { pattern: /Math\.random\s*\(/, reason: "unseeded randomness — every frame would differ" },
  { pattern: /Date\.now\s*\(/, reason: "the wall clock — two renders would differ by when they ran" },
  { pattern: /performance\.now\s*\(/, reason: "the wall clock — see Date.now" },
  { pattern: /new\s+Date\s*\(/, reason: "the wall clock — see Date.now" },
  { pattern: /crypto\.randomUUID\s*\(/, reason: "unseeded randomness" },
  { pattern: /\bfetch\s*\(/, reason: "the network — render code must not touch it" },
  { pattern: /XMLHttpRequest/, reason: "the network" },
  { pattern: /WebSocket/, reason: "the network" },
  { pattern: /requestAnimationFrame\s*\(/, reason: "a frame driven by the display, not the film's clock" },
  { pattern: /setInterval\s*\(/, reason: "the wall clock — a frame driven by how long the machine took" },
];

/** Every file that paints a frame, from the renderer's own input list (manifest.ts). */
function paintSources(): string[] {
  const files: string[] = [];

  const stylesDir = resolve(root, "styles");
  for (const style of readdirSync(stylesDir, { withFileTypes: true })) {
    if (!style.isDirectory()) continue;
    const canvas = resolve(stylesDir, style.name, "canvas");
    if (!existsSync(canvas)) continue;
    for (const file of readdirSync(canvas)) {
      if (file.endsWith(".js")) files.push(join(canvas, file));
    }
  }

  const filmsDir = resolve(root, "films");
  for (const film of readdirSync(filmsDir, { withFileTypes: true })) {
    if (!film.isDirectory()) continue;
    const dir = resolve(filmsDir, film.name);
    for (const name of ["painter.js", "score-data.js", "index.html"]) {
      if (existsSync(join(dir, name))) files.push(join(dir, name));
    }
  }

  return files.sort();
}

/** Lines that break the rule, as `file:line  reason`. */
function violations(files: string[]): string[] {
  const out: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    text.split("\n").forEach((line, index) => {
      for (const rule of BANNED) {
        if (rule.pattern.test(line)) {
          const where = file.slice(root.length + 1).replace(/\\/g, "/");
          out.push(`${where}:${index + 1}  ${rule.reason}\n    ${line.trim().slice(0, 140)}`);
        }
      }
    });
  }
  return out;
}

test("the paint code has no source of nondeterminism", () => {
  const files = paintSources();
  // If this is empty the test would pass by reading nothing, which is the one
  // way a guard like this fails silently.
  assert.ok(files.length >= 3, `found only ${files.length} paint files: ${files.join(", ")}`);
  const found = violations(files);
  assert.deepEqual(found, [], `\n${found.join("\n")}\n`);
});

test("every gsap timeline is paused and seeked, never played", () => {
  // `gsap.timeline({ paused: true })` that is `seek()`ed is a pure function of
  // the time asked for. The same timeline `.play()`ed is a function of how long
  // the machine took, and no amount of sampling makes that reproducible.
  const painters = paintSources().filter((file) => file.endsWith("painter.js"));
  assert.ok(painters.length > 0, "no painter.js found");
  for (const file of painters) {
    const text = readFileSync(file, "utf8");
    const where = file.slice(root.length + 1).replace(/\\/g, "/");
    let index = text.indexOf("gsap.timeline(");
    let seen = 0;
    while (index !== -1) {
      seen += 1;
      const head = text.slice(index, index + 160);
      assert.match(head, /paused:\s*true/, `${where}: a gsap timeline is not created paused:\n    ${head.split("\n")[0]}`);
      index = text.indexOf("gsap.timeline(", index + 1);
    }
    assert.ok(seen > 0, `${where}: expected a paused timeline`);
    assert.doesNotMatch(text, /\.play\s*\(/, `${where}: the painter calls .play() — a frame would depend on the wall clock`);
  }
});

test("the renderer itself never asks the wall clock for a frame", () => {
  // The page decides the pixels, but the loop decides which times are asked for.
  const files = ["scripts/render-film.ts", "src/engine/treatments.ts", "src/engine/treatment.ts"];
  const found: string[] = [];
  for (const name of files) {
    const file = resolve(root, name);
    if (!existsSync(file)) continue;
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (/Math\.random\s*\(/.test(line)) found.push(`${name}:${index + 1}  Math.random in the render path`);
      });
  }
  assert.deepEqual(found, [], found.join("\n"));
});
