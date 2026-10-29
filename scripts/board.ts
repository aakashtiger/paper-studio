import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { buildBoard } from "../src/engine/board.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run board -- <score.json>");
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

const entries = buildBoard(plan);
const out = resolve(root, "build", score.id, "board");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "manifest.json"), `${JSON.stringify({ film: score.id, entries }, null, 2)}\n`, "utf8");

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cards = entries
  .map((entry) => {
    const slots = Object.entries(entry.slots)
      .map(([key, value]) => `<div class="slot"><b>${esc(key)}</b> ${esc(value)}</div>`)
      .join("");
    return `<article class="card">
  <header><span class="time">${entry.time.toFixed(2)}s · f${entry.frame}</span><span class="recipe">${esc(entry.recipe)}</span></header>
  <h2>${esc(entry.label)}</h2>
  ${slots}
  <p class="spine">${esc(entry.direction.spine)}</p>
  <p class="state">${esc(entry.direction.entry)} → ${esc(entry.direction.exit)}</p>
</article>`;
  })
  .join("\n");

writeFileSync(
  resolve(out, "index.html"),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(score.id)} — board</title>
<style>
  body { margin: 32px; background: #171310; color: #f2e8d5; font: 14px/1.4 system-ui, sans-serif; }
  h1 { font-size: 20px; letter-spacing: .08em; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .card { background: #f2e8d5; color: #171310; border-radius: 2px; padding: 16px; }
  header { display: flex; justify-content: space-between; font: 11px/1.2 ui-monospace, monospace; opacity: .7; }
  h2 { font-size: 18px; margin: 12px 0 8px; }
  .slot { font: 12px/1.5 ui-monospace, monospace; }
  .spine { margin-top: 12px; font-weight: 600; }
  .state { font-size: 12px; opacity: .65; }
</style></head>
<body><h1>${esc(score.id)} — board · ${entries.length} frames</h1><div class="grid">
${cards}
</div></body></html>
`,
  "utf8",
);

console.log(`board: ${entries.length} frames → build/${score.id}/board/`);
