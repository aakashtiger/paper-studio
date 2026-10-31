import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { sheetHtml, sheetSlug, type SheetFonts } from "../src/engine/sheet.js";
import { findChrome, fileUrl, shootHtml } from "../src/engine/chrome.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run sheet -- <score.json> [--no-render]");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const styleDir = resolve(root, `styles/${score.style}`);
const { plan, errors } = resolveFilm(score, styleDir, root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const outDir = resolve(root, "build", score.id, "sheets");
mkdirSync(outDir, { recursive: true });
const usedSlugs = new Set<string>();
const chrome = findChrome();
const render = !args.includes("--no-render") && Boolean(chrome);

const tokens = JSON.parse(readFileSync(resolve(styleDir, "tokens.json"), "utf8")) as {
  type?: { families?: Array<{ role?: string; name?: string; file?: string }> };
};
const families = tokens.type?.families ?? [];
const face = (role: string) => {
  const family = families.find((entry) => entry.role === role) ?? families[0];
  if (!family?.name || !family?.file) throw new Error(`style "${score.style}" has no font for role "${role}"`);
  return { family: family.name, file: family.file };
};
// The sheet is written to build/<id>/sheets/, so repo-relative paths climb three.
const fonts: SheetFonts = {
  dir: `../../../styles/${score.style}`,
  display: face("display"),
  body: face("body"),
  mono: face("caption"),
};
const vendor = `../../../films/${score.id}/vendor`;
if (!existsSync(resolve(root, "films", score.id, "vendor"))) {
  console.error(`error: films/${score.id}/vendor is missing; the sheet draws with the film's pinned renderer`);
  process.exit(1);
}

if (!render && !args.includes("--no-render")) {
  console.error("warning: Chrome not found; writing HTML sheets only");
}

for (const entry of plan.cast) {
  const library = PoseLibrarySchema.parse(
    JSON.parse(readFileSync(resolve(root, entry.poses), "utf8")),
  );
  const poseErrors = resolvePoseLibrary(library);
  if (poseErrors.errors.length > 0) {
    for (const issue of poseErrors.errors) console.error(`error: ${issue.message}`);
    process.exit(1);
  }

  const slug = sheetSlug(library.character);
  if (!slug) {
    console.error(`error: character "${library.character}" has no usable file slug`);
    process.exit(1);
  }
  if (usedSlugs.has(slug)) {
    console.error(`error: two characters map to the same sheet "${slug}"`);
    process.exit(1);
  }
  usedSlugs.add(slug);

  let html: string;
  let height: number;
  try {
    const sheet = sheetHtml(library, {
      character: library.character,
      rig: library.rig,
      anchors: library.anchors,
      library,
      vendor,
      fonts,
    });
    html = sheet.html;
    height = sheet.height;
  } catch (error) {
    console.error(`error: ${error instanceof Error ? error.message : "sheet failed"}`);
    process.exit(1);
  }

  const htmlPath = resolve(outDir, `${slug}.html`);
  writeFileSync(htmlPath, html, "utf8");

  if (render && chrome) {
    const pngPath = resolve(outDir, `${slug}.png`);
    if (existsSync(pngPath)) rmSync(pngPath);
    const shot = shootHtml(chrome, {
      url: fileUrl(htmlPath),
      out: pngPath,
      width: 1920,
      height,
    });
    if (!shot.ok || shot.width !== 1920 || Math.abs(shot.height - height) > 2) {
      console.error(`error: sheet render failed for ${library.character}`);
      process.exit(1);
    }
    console.log(`sheet: ${library.character} → build/${score.id}/sheets/${slug}.png (${shot.width}×${shot.height})`);
    continue;
  }
  console.log(`sheet: ${library.character} → build/${score.id}/sheets/${slug}.html`);
}
