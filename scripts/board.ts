/**
 * Board (Gate 2, the text half).
 *
 * The board is a view of the score: one card per shot at its poster moment,
 * plus any beat the director marks. It writes a manifest, an HTML page and, on
 * one image, a sheet of every card, so the whole board is judged by looking at
 * one picture.
 *
 * usage: npm run board -- <score.json> [--no-render] [--sheet-width 1600]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { buildBoard, boardSheet } from "../src/engine/board.js";
import { findChrome, fileUrl, pageHeight, shootHtml } from "../src/engine/chrome.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run board -- <score.json> [--no-render]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const styleDir = resolve(root, `styles/${score.style}`);
const { plan, errors } = resolveFilm(score, styleDir, root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const entries = buildBoard(plan);
const out = resolve(root, "build", score.id, "board");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "manifest.json"), `${JSON.stringify({ film: score.id, entries }, null, 2)}\n`, "utf8");

const html = boardSheet(score.id, entries);
const htmlPath = resolve(out, "index.html");
writeFileSync(htmlPath, html, "utf8");

const sheetWidth = Number(arg("sheet-width") ?? 1600);
const sheetPath = resolve(out, "board-sheet.png");
const wantSheet = !args.includes("--no-render");
const chrome = findChrome();
let rendered: { width: number; height: number } | null = null;

if (wantSheet && chrome) {
  const url = fileUrl(htmlPath);
  const height = pageHeight(chrome, url, sheetWidth);
  if (!height) {
    console.error("error: board page did not report a height; cannot sheet it");
    process.exit(1);
  }
  const shot = shootHtml(chrome, { url, out: sheetPath, width: sheetWidth, height });
  if (!shot.ok || shot.width !== sheetWidth || shot.height !== height) {
    console.error("error: board sheet render failed");
    process.exit(1);
  }
  rendered = { width: shot.width, height: shot.height };
} else if (wantSheet) {
  console.error("error: Chrome not found; cannot render the board sheet (use --no-render to skip)");
}

const checks = {
  everyShotOnBoard: plan.shots.every((shot) => entries.some((entry) => entry.shotId === shot.id)),
  inTimeOrder: entries.every((entry, index) => index === 0 || entry.time >= (entries[index - 1]?.time ?? 0)),
  manifestWritten: existsSync(resolve(out, "manifest.json")),
  htmlWritten: existsSync(htmlPath),
  sheetWritten: rendered ? existsSync(sheetPath) : !wantSheet,
};
const pass = Object.values(checks).every(Boolean);
writeFileSync(
  resolve(out, "board.json"),
  `${JSON.stringify(
    {
      film: score.id,
      pass,
      entries: entries.length,
      sheet: rendered ? { path: `build/${score.id}/board/board-sheet.png`, ...rendered } : null,
      checks,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`board: ${entries.length} frames → build/${score.id}/board/`);
if (rendered) console.log(`board: sheet ${rendered.width}×${rendered.height} → build/${score.id}/board/board-sheet.png`);
if (!pass) process.exit(1);
