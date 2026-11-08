/**
 * Shared plumbing for the review tools.
 *
 * The review tools are read-only with respect to the film: they measure it and
 * write sheets under `<score>/out/`. They use the dependencies the render
 * harness already has (ffmpeg-static, puppeteer-core), never a new package.
 *
 * Every tool is run from the repository root, like the render harnesses:
 *   node scripts/hands-sheet.mjs --score proofs/kpop-crime-60
 */
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

export const ROOT = process.cwd();
export const FONT = "assets/fonts/DMMono-Regular.ttf";

export function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

export function normHash(h) {
  return String(h || "").replace(/^sha256:/i, "").trim().toLowerCase();
}

export function relToRoot(file) {
  return relative(ROOT, resolve(file)).replace(/\\/g, "/");
}

/**
 * `--key=value`, `--key value`, or a bare positional. Bare flags are true.
 */
export function parseArgs(argv) {
  const args = {};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { rest.push(a); continue; }
    const body = a.slice(2);
    const eq = body.indexOf("=");
    if (eq >= 0) { args[body.slice(0, eq)] = body.slice(eq + 1); continue; }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) { args[body] = next; i++; }
    else args[body] = true;
  }
  return { args, rest };
}

/**
 * Accept a score directory or a film.json path. Returns the film and the paths
 * every tool writes relative to.
 */
export function loadScore(arg) {
  if (!arg) die("missing --score <proofs/id> (or a film.json path)");
  const abs = resolve(ROOT, arg);
  if (!existsSync(abs)) die(`score not found: ${arg}`);
  const filmPath = statSync(abs).isDirectory() ? join(abs, "film.json") : abs;
  if (!existsSync(filmPath)) die(`no film.json in ${arg}`);
  const root = dirname(filmPath);
  const film = readJson(filmPath);
  const shotsPath = join(root, "shots.json");
  const measuredPath = join(root, "measured.json");
  return {
    root,
    rel: relToRoot(root),
    filmPath,
    film,
    shotsPath,
    shots: existsSync(shotsPath) ? readJson(shotsPath) : null,
    measuredPath,
    measured: existsSync(measuredPath) ? readJson(measuredPath) : null,
  };
}

/** The picture the score delivers. */
export function videoPath(score, override) {
  if (override) return resolve(ROOT, override);
  if (score.film.video) {
    return resolve(score.root, score.film.video);
  }
  return join(score.root, "out", `${score.film.id}.mp4`);
}

export function runFfmpeg(args, label = "ffmpeg") {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    throw new Error(`${label} exited ${r.status}\n${(r.stderr || "").slice(-3000)}`);
  }
  return r;
}

export function resetDir(dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function drawtextEscape(text) {
  // The labels are ASCII. Escape the two characters ffmpeg's filter parser
  // cannot take raw inside single quotes.
  return String(text).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * Tile crops into one PNG. Each item is { file, box: {x,y}, label }.
 * A 4 px gap and a 22 px label bar keep neighbouring hands from touching.
 */
export function tileCrops({ out, items, cols, cell = 260, gap = 4, font = FONT, fontSize = 14 }) {
  if (!items.length) throw new Error("tileCrops: nothing to tile");
  const per = cell + gap;
  const rows = Math.ceil(items.length / cols);
  const width = Math.min(cols, items.length) * per;
  const height = rows * per;
  const inputs = [];
  const chains = [];
  const labels = [];
  items.forEach((item, i) => {
    inputs.push("-i", resolve(ROOT, item.file));
    const label = drawtextEscape(item.label);
    chains.push(
      `[${i}:v]crop=${cell}:${cell}:${item.box.x}:${item.box.y},` +
      `drawbox=x=0:y=0:w=${cell}:h=22:color=black@0.68:t=fill,` +
      `drawtext=fontfile=${font}:text='${label}':x=6:y=3:fontsize=${fontSize}:fontcolor=white,` +
      `pad=${per}:${per}:${gap / 2}:${gap / 2}:color=0x1b1b1b[c${i}]`,
    );
    labels.push(`[c${i}]`);
  });
  const layout = items.map((_, i) => `${(i % cols) * per}_${Math.floor(i / cols) * per}`).join("|");
  const graph = chains.join(";") + (items.length === 1
    ? ";[c0]null[out]"
    : `;${labels.join("")}xstack=inputs=${items.length}:layout=${layout}[out]`);
  runFfmpeg([...inputs, "-filter_complex", graph, "-map", "[out]", "-frames:v", "1", out], "tile");
  return { width, height, cols, rows };
}

/** Stack rows (already-sized PNGs) into one page. */
export function stackRows({ out, rows, width, rowHeight, gap = 4 }) {
  if (!rows.length) throw new Error("stackRows: nothing to stack");
  const inputs = [];
  const labels = [];
  rows.forEach((file, i) => {
    inputs.push("-i", resolve(ROOT, file));
    labels.push(`[${i}:v]pad=${width}:${rowHeight + gap}:0:0:color=0x1b1b1b[r${i}]`);
  });
  const height = rows.length * (rowHeight + gap);
  const graph = labels.join(";") +
    (rows.length === 1 ? ";[r0]null[out]" : `;${rows.map((_, i) => `[r${i}]`).join("")}vstack=inputs=${rows.length}[out]`);
  runFfmpeg([...inputs, "-filter_complex", graph, "-map", "[out]", "-frames:v", "1", out], "stack");
  return { width, height };
}

/** A label banner across the top of a 1920-wide cut row. */
export function cutRow({ out, endPng, startPng, banner, font = FONT }) {
  const text = drawtextEscape(banner);
  const graph =
    `[0:v]scale=960:540:flags=lanczos[L];` +
    `[1:v]scale=960:540:flags=lanczos[R];` +
    `[L][R]hstack=inputs=2,` +
    `drawbox=x=0:y=0:w=1920:h=38:color=black@0.78:t=fill,` +
    `drawtext=fontfile=${font}:text='${text}':x=(w-text_w)/2:y=9:fontsize=20:fontcolor=0xF2C14E[row]`;
  runFfmpeg(["-i", resolve(ROOT, endPng), "-i", resolve(ROOT, startPng), "-filter_complex", graph, "-map", "[row]", "-frames:v", "1", out], "cut-row");
}

export function pageNames(outDir, base, count) {
  const names = [];
  for (let i = 0; i < count; i++) {
    names.push(count === 1 ? join(outDir, `${base}.png`) : join(outDir, `${base}-${i + 1}.png`));
  }
  return names;
}
