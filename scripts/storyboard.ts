/**
 * Storyboard (Gate 2, the visual half).
 *
 * The board pass lists every shot as a text card. This pass shows the same
 * shots as pictures: exactly one code-drawn frame per defined shot, painted
 * through the same painter the final render uses, tiled into a single sheet
 * with its label.
 *
 * It does not invent shots. It can only draw shots that are already in the
 * score, one per shot, in order. Because every tile comes from the same style
 * pack and pose library, the sheet also makes consistency visible: a character
 * that drifts between shots is obvious in one glance.
 *
 * The sheet is an index. The full-resolution frames stay on disk, so a tile
 * that looks wrong is opened, not guessed at.
 *
 * usage: npm run storyboard -- films/understudy/score.json [--tile 640] [--cols 3] [--at 0.5]
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { renderGrid, autoCols } from "../src/engine/grid.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run storyboard -- <score.json> [--tile 640] [--cols 3] [--at 0.5]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const at = Number(arg("at") ?? 0.5);
  const tileW = Number(arg("tile") ?? 640);
  const tileH = Math.round((tileW * 9) / 16);

  const outDir = resolve(root, "build", score.id, "storyboard");
  const framesDir = join(outDir, "frames");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  // 1. One representative time per shot, in shot order (never fewer, never invented).
  const frames = plan.shots.map((shot) => {
    const from = shot.start;
    const time = Number((from + shot.duration * at).toFixed(2));
    return { shot, from, to: Number((from + shot.duration).toFixed(2)), time };
  });
  const times = frames.map((frame) => frame.time);

  console.log(`storyboard: painting ${frames.length} shots at ${at * 100}% through each`);
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", scorePath,
        "--stills", times.join(","),
        "--out-dir", framesDir,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });

  // 2. Tile them, each carrying its own label, into one sheet.
  const missing: string[] = [];
  const tiles = frames.map((frame) => {
    const image = join(framesDir, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`);
    if (!existsSync(image)) missing.push(frame.shot.id);
    return {
      image,
      label: `${frame.shot.id}  ${frame.from.toFixed(2)}–${frame.to.toFixed(2)}s  ${frame.shot.recipe}`,
    };
  });
  if (missing.length > 0) throw new Error(`no storyboard frame for shots: ${missing.join(", ")}`);

  const cols = Number(arg("cols") ?? 0) || autoCols(frames.length, 3);
  const sheet = join(outDir, "storyboard.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles,
    tileWidth: tileW,
    tileHeight: tileH,
    cols,
    labelDir: `build/${score.id}/storyboard/labels`,
  });

  const checks = {
    onePerShot: frames.length === plan.shots.length,
    inShotOrder: frames.every((frame, index) => frame.shot.id === plan.shots[index]?.id),
    everyShotPainted: missing.length === 0,
    sheetExists: existsSync(sheet),
  };
  const pass = Object.values(checks).every(Boolean);
  const report = {
    film: score.id,
    pass,
    at,
    tile: { width: tileW, height: tileH },
    grid: { cols: grid.cols, rows: grid.rows },
    sheet: { path: sheet, width: grid.width, height: grid.height },
    shots: frames.map((frame) => ({
      id: frame.shot.id,
      from: frame.from,
      to: frame.to,
      time: frame.time,
      recipe: frame.shot.recipe,
      frame: `build/${score.id}/storyboard/frames/t-${frame.time.toFixed(2).padStart(5, "0")}.png`,
    })),
    checks,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, "storyboard.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`storyboard: ${frames.length} shots · ${grid.cols}×${grid.rows} grid · ${grid.width}×${grid.height} px`);
  console.log(`storyboard: ${sheet.replace(`${root}\\`, "").replace(`${root}/`, "")}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
