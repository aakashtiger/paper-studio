/**
 * One grid builder for every batch of pictures.
 *
 * Every review artifact that shows N pictures on one image goes through here.
 * Today that is the storyboard and the stepped-rough contact sheet; the per-shot
 * strips, the spectrogram sheet, the stills sheet and the final contact sheet
 * (steps 6–7 of decision 0017) will use it too. It plans the grid, writes each
 * tile's label, and runs one ffmpeg pass.
 *
 * A sheet is a review artifact. It lives under `build/`, is gitignored, and
 * never enters a render manifest or a frame hash.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { spawn } from "node:child_process";

export type GridTile = {
  /** Absolute path to the source image. */
  image: string;
  /** One-line label drawn at the tile foot. Omit for no label. */
  label?: string;
};

export type GridPlan = {
  cols: number;
  rows: number;
  /** ffmpeg xstack layout string, e.g. "0_0|640_0|0_360". */
  layout: string;
  width: number;
  height: number;
};

export type GridOptions = {
  /** Repo root. Label files and the font are resolved relative to it. */
  root: string;
  /** Absolute path of the sheet png to write. */
  out: string;
  tiles: GridTile[];
  tileWidth: number;
  tileHeight: number;
  /**
   * Repo-relative font file for labels. Required: a font is a style choice, so
   * the caller names it rather than the engine hardcoding one.
   */
  font: string;
  /** Explicit column count. Omit to auto-fit. */
  cols?: number;
  /** Column cap used by auto-fit. Default 3. */
  maxCols?: number;
  /** ffmpeg colour for the fill and the label box. Default a neutral dark. */
  background?: string;
  /** Label text colour. Default a neutral light. */
  fontColor?: string;
  /** Label font size. Defaults to tileWidth / 32. */
  fontSize?: number;
  /** Repo-relative directory for the generated label .txt files. */
  labelDir?: string;
  /** ffmpeg binary. Defaults to findFfmpeg(). */
  ffmpeg?: string;
};

/** A square-ish grid, capped, so a wide batch does not become one long row. */
export function autoCols(count: number, maxCols = 3): number {
  return Math.max(1, Math.min(maxCols, Math.ceil(Math.sqrt(count))));
}

export function planGrid(
  count: number,
  cols: number,
  tileWidth: number,
  tileHeight: number,
): GridPlan {
  if (!Number.isInteger(count) || count < 1) throw new Error("planGrid needs at least one tile");
  const clamped = Math.max(1, Math.min(Math.floor(cols), count));
  const rows = Math.ceil(count / clamped);
  const layout = Array.from(
    { length: count },
    (_, index) => `${(index % clamped) * tileWidth}_${Math.floor(index / clamped) * tileHeight}`,
  ).join("|");
  return { cols: clamped, rows, layout, width: clamped * tileWidth, height: rows * tileHeight };
}

/**
 * ffmpeg is not on PATH on a clean machine; it ships in node_modules. Resolve it
 * the same way everywhere, and fall back to the bare name.
 */
export function findFfmpeg(): string {
  const roots = [
    process.env.FFMPEG_PATH,
    join(process.cwd(), "node_modules", "ffmpeg-static"),
    join(process.cwd(), "..", "node_modules", "ffmpeg-static"),
  ];
  for (const root of roots) {
    if (!root) continue;
    if (existsSync(root) && /ffmpeg(\.exe)?$/i.test(root)) return root;
    for (const name of ["ffmpeg.exe", "ffmpeg"]) {
      const candidate = join(root, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return "ffmpeg";
}

/** Run a binary to completion and return its combined output. */
export function runBinary(
  binary: string,
  argv: string[],
  options: { cwd?: string } = {},
): Promise<string> {
  return new Promise((done, fail) => {
    const child = spawn(binary, argv, { cwd: options.cwd, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => (out += chunk));
    child.stderr.on("data", (chunk: string) => (err += chunk));
    child.on("close", (code) => {
      if (code === 0) done(out + err);
      else fail(new Error(`${binary} exited ${code}\n${err.slice(-1200)}`));
    });
  });
}

/**
 * Tile images into one labelled sheet.
 *
 * Label and font paths are written as repo-relative paths (forward slashes) and
 * ffmpeg runs with its cwd at the repo root: an ffmpeg filter string cannot
 * carry a Windows drive colon.
 */
export async function renderGrid(options: GridOptions): Promise<GridPlan & { path: string }> {
  const {
    root,
    out,
    tiles,
    tileWidth,
    tileHeight,
    font,
    maxCols = 3,
    background = "0x101010",
    fontColor = "0xF5F5F5",
    labelDir = "build/grid/labels",
  } = options;
  if (tiles.length === 0) throw new Error("renderGrid: no tiles");

  const grid = planGrid(tiles.length, options.cols ?? autoCols(tiles.length, maxCols), tileWidth, tileHeight);

  const missing = tiles.filter((tile) => !existsSync(tile.image)).map((tile) => tile.image);
  if (missing.length > 0) throw new Error(`renderGrid: missing tiles: ${missing.join(", ")}`);

  const labelRoot = join(root, labelDir);
  mkdirSync(labelRoot, { recursive: true });
  const fontSize = options.fontSize ?? Math.max(12, Math.round(tileWidth / 32));
  // Label files are named after the sheet, so two sheets sharing a label dir
  // never overwrite each other's labels.
  const slug = basename(out, extname(out));

  const filters: string[] = [];
  tiles.forEach((tile, index) => {
    let filter =
      `scale=${tileWidth}:${tileHeight}:force_original_aspect_ratio=decrease,` +
      `pad=${tileWidth}:${tileHeight}:(ow-iw)/2:(oh-ih)/2:color=${background}`;
    if (tile.label) {
      const rel = `${labelDir}/${slug}-${String(index + 1).padStart(3, "0")}.txt`;
      writeFileSync(join(root, rel), tile.label, "utf8");
      filter +=
        `,drawtext=fontfile='${font}':textfile='${rel}':fontcolor=${fontColor}:fontsize=${fontSize}:` +
        `x=10:y=h-${fontSize + 14}:box=1:boxcolor=${background}@0.72:boxborderw=6`;
    }
    filters.push(filter);
  });

  const inputs = tiles.flatMap((tile) => ["-i", tile.image]);
  const links: string[] = [];
  let graph: string;
  if (tiles.length === 1) {
    // ffmpeg xstack needs at least two inputs; a single tile passes straight through.
    graph = `[0:v]${filters[0]}[v0]`;
    links.push("-map", "[v0]");
  } else {
    const chains = filters.map((filter, index) => `[${index}:v]${filter}[v${index}]`);
    const stacked = filters.map((_, index) => `[v${index}]`).join("");
    chains.push(`${stacked}xstack=inputs=${tiles.length}:layout=${grid.layout}:fill=${background}`);
    graph = chains.join(";");
  }

  // A stale sheet must never masquerade as a fresh one.
  if (existsSync(out)) rmSync(out);
  const ffmpeg = options.ffmpeg ?? findFfmpeg();
  await runBinary(
    ffmpeg,
    [
      "-y", "-hide_banner", "-loglevel", "error",
      ...inputs,
      "-filter_complex", graph,
      ...links,
      "-frames:v", "1",
      out,
    ],
    { cwd: root },
  );

  return { ...grid, path: out };
}
