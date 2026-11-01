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
 * never enters a render manifest or a frame hash. Its fill and label colours are
 * neutral review chrome, not a film palette; the caller names the font.
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { spawn } from "node:child_process";

/**
 * Review chrome: the neutral frame every review artifact draws around its
 * pictures. It is deliberately *not* a style palette. A sheet shows what the
 * film is; the film's own colours belong inside the pictures, not in the page
 * around them. Review artifacts take these values so that two packs cannot be
 * told apart by the furniture — only by the work.
 */
export const REVIEW_CHROME = {
  /** Page background. */
  bg: "#101010",
  /** Raised panel or card fill. */
  panel: "#1a1a1a",
  /** Hairline border. */
  line: "#2e2e2e",
  /** Primary text. */
  text: "#f5f5f5",
  /** Secondary text and metadata. */
  muted: "#a3a3a3",
  /** Emphasis bars and guides. */
  accent: "#8a8a8a",
  /** Text drawn on a light swatch. */
  onLight: "#000000",
  /** Text drawn on a dark swatch. */
  onDark: "#ffffff",
  /** A failure drawn onto a review canvas. */
  error: "#ff3b30",
} as const;

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
  /**
   * Explicit row lengths (tiles per row, in order). Use this for a strip sheet:
   * one row per shot, rows of different lengths, each row left-aligned and the
   * remaining cells left as background. Sum must equal `tiles.length`.
   */
  rows?: number[];
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
 * A sheet whose rows have different lengths, e.g. one strip per shot. Each row
 * starts at the left; the space past a short row stays background fill. The
 * canvas is as wide as the longest row and as tall as the number of rows.
 */
export function planGridRows(counts: number[], tileWidth: number, tileHeight: number): GridPlan {
  if (counts.length === 0) throw new Error("planGridRows needs at least one row");
  if (counts.some((count) => !Number.isInteger(count) || count < 1)) {
    throw new Error("planGridRows rows must each hold at least one tile");
  }
  const cols = Math.max(...counts);
  const layout: string[] = [];
  counts.forEach((count, row) => {
    for (let col = 0; col < count; col += 1) {
      layout.push(`${col * tileWidth}_${row * tileHeight}`);
    }
  });
  return {
    cols,
    rows: counts.length,
    layout: layout.join("|"),
    width: cols * tileWidth,
    height: counts.length * tileHeight,
  };
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
 * Build the ffmpeg filtergraph for a batch.
 *
 * ffmpeg's xstack needs at least two inputs, so a single tile is passed straight
 * through. Pure, so the one-tile case is guarded by a unit test and not only by
 * a live render.
 */
export function gridGraph(
  filters: string[],
  layout: string,
  background: string,
): { graph: string; map: string[] } {
  if (filters.length === 0) throw new Error("gridGraph: no filters");
  if (filters.length === 1) {
    return { graph: `[0:v]${filters[0]}[v0]`, map: ["-map", "[v0]"] };
  }
  const chains = filters.map((filter, index) => `[${index}:v]${filter}[v${index}]`);
  const stacked = filters.map((_, index) => `[v${index}]`).join("");
  chains.push(`${stacked}xstack=inputs=${filters.length}:layout=${layout}:fill=${background}`);
  return { graph: chains.join(";"), map: [] };
}

/** A `#rrggbb` or `#rgb` colour as ffmpeg's `0xrrggbb`. */
export function ffColor(hex: string): string {
  return `0x${hex.replace("#", "")}`;
}

/**
 * How many tiles one ffmpeg command may carry.
 *
 * Windows gives a spawned process about 32,000 characters of command line, and
 * every tile costs an `-i <path>` plus a ~300-character filter chain. A 120-tile
 * sheet is ~44,000 and `spawn` refuses it (`ENAMETOOLONG`) — which is how the G5
 * strips sheet and the G7 final sheet both failed on the first 60 s film after
 * passing on a 30 s one. Sheets larger than this are composed from row strips
 * (see `renderGrid`), so the number of tiles a film has is not a limit on what
 * can be reviewed.
 */
const TILES_PER_INVOCATION = 24;

/**
 * Split per-row tile counts into groups whose total fits one ffmpeg command.
 *
 * Groups are whole rows, in order, so a sheet composed from them stacks back
 * into the sheet it would have been in one call. A single row wider than the
 * limit is its own group: it cannot be split without breaking the row.
 */
export function chunkRows(counts: number[], limit = TILES_PER_INVOCATION): number[][] {
  if (limit < 1) throw new Error("chunkRows: the limit must be at least one tile");
  if (counts.length === 0) throw new Error("chunkRows: no rows");
  const groups: number[][] = [];
  let current: number[] = [];
  let total = 0;
  for (const count of counts) {
    if (!Number.isInteger(count) || count < 1) throw new Error(`chunkRows: bad row count ${count}`);
    if (current.length > 0 && total + count > limit) {
      groups.push(current);
      current = [];
      total = 0;
    }
    current.push(count);
    total += count;
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

/** The per-row tile counts a grid implies, so a sheet can be cut into row strips. */
function rowCounts(count: number, cols: number): number[] {
  const rows = Math.ceil(count / cols);
  return Array.from({ length: rows }, (_, row) => Math.min(cols, count - row * cols));
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
    background = ffColor(REVIEW_CHROME.bg),
    fontColor = ffColor(REVIEW_CHROME.text),
    labelDir = "build/grid/labels",
  } = options;
  if (tiles.length === 0) throw new Error("renderGrid: no tiles");

  const grid = options.rows
    ? planGridRows(options.rows, tileWidth, tileHeight)
    : planGrid(tiles.length, options.cols ?? autoCols(tiles.length, maxCols), tileWidth, tileHeight);
  if (options.rows && options.rows.reduce((sum, count) => sum + count, 0) !== tiles.length) {
    throw new Error(`renderGrid: rows describes ${options.rows.reduce((sum, count) => sum + count, 0)} tiles, not ${tiles.length}`);
  }
  const counts = options.rows ?? rowCounts(tiles.length, grid.cols);

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
  // A stale sheet must never masquerade as a fresh one.
  if (existsSync(out)) rmSync(out);
  const ffmpeg = options.ffmpeg ?? findFfmpeg();

  // A sheet too wide for one command line is composed in two passes: each group
  // of rows becomes a strip, and the strips stack into the sheet. The pixels are
  // the same pixels — a tile is scaled and padded to its final size either way,
  // and xstack places it at the same coordinates — so a long film gets the same
  // sheet a short one does, rather than a refusal.
  const groups = chunkRows(counts);
  if (groups.length > 1) {
    const chunksDir = mkdtempSync(join(tmpdir(), "paper-grid-"));
    try {
      const strips: string[] = [];
      let offset = 0;
      for (const [index, group] of groups.entries()) {
        const stripRows = planGridRows(group, tileWidth, tileHeight);
        const stripFilters = filters.slice(offset, offset + group.reduce((sum, count) => sum + count, 0));
        const stripInputs = inputs.slice(offset * 2, (offset + group.reduce((sum, count) => sum + count, 0)) * 2);
        const stripPath = join(chunksDir, `strip-${String(index).padStart(3, "0")}.png`);
        const { graph: stripGraph, map: stripMap } = gridGraph(stripFilters, stripRows.layout, background);
        await runBinary(
          ffmpeg,
          [
            "-y", "-hide_banner", "-loglevel", "error",
            ...stripInputs,
            "-filter_complex", stripGraph,
            ...stripMap,
            "-frames:v", "1",
            stripPath,
          ],
          { cwd: root },
        );
        strips.push(stripPath);
        offset += stripFilters.length;
      }
      // One input per strip, all the same width, stacked top to bottom.
      let y = 0;
      const layout = strips
        .map((_, index) => {
          const rows = groups[index]?.length ?? 0;
          const at = `0_${y}`;
          y += rows * tileHeight;
          return at;
        })
        .join("|");
      const { graph, map } = gridGraph(strips.map(() => "null"), layout, background);
      await runBinary(
        ffmpeg,
        [
          "-y", "-hide_banner", "-loglevel", "error",
          ...strips.flatMap((strip) => ["-i", strip]),
          "-filter_complex", graph,
          ...map,
          "-frames:v", "1",
          out,
        ],
        { cwd: root },
      );
    } finally {
      rmSync(chunksDir, { recursive: true, force: true });
    }
    return { ...grid, path: out };
  }

  const { graph, map } = gridGraph(filters, grid.layout, background);
  await runBinary(
    ffmpeg,
    [
      "-y", "-hide_banner", "-loglevel", "error",
      ...inputs,
      "-filter_complex", graph,
      ...map,
      "-frames:v", "1",
      out,
    ],
    { cwd: root },
  );

  return { ...grid, path: out };
}
