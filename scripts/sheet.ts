import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { sheetHtml, sheetSlug } from "../src/engine/sheet.js";

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
      vendor: "../../../proofs/s2-paper/vendor",
      fonts: "../../../proofs/s2-paper/assets/fonts",
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
    const url = `file:///${htmlPath.replace(/\\/g, "/")}`;
    const result = spawnSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--allow-file-access-from-files",
        "--hide-scrollbars",
        "--virtual-time-budget=10000",
        "--window-size=1920," + height,
        `--screenshot=${pngPath}`,
        url,
      ],
      { stdio: "ignore", timeout: 40_000 },
    );
    const size = existsSync(pngPath) ? pngSize(pngPath) : null;
    if (result.status !== 0 || !size || size.width !== 1920 || Math.abs(size.height - height) > 2) {
      console.error(`error: sheet render failed for ${library.character}`);
      process.exit(1);
    }
    console.log(`sheet: ${library.character} → build/${score.id}/sheets/${slug}.png (${size.width}×${size.height})`);
    continue;
  }
  console.log(`sheet: ${library.character} → build/${score.id}/sheets/${slug}.html`);
}

function findChrome(): string | undefined {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter((value): value is string => Boolean(value));
  return candidates.find((candidate) => existsSync(candidate));
}

function pngSize(path: string): { width: number; height: number } | null {
  const header = readFileSync(path).subarray(0, 24);
  if (header.length < 24 || header.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}
