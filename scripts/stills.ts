/**
 * Stills sheet (decision 0017, step 4).
 *
 * The storyboard shows one frame per shot. This shows the film *between* the
 * shots: a sample of stills taken straight through the film, tiled into one
 * labelled image, so the whole look and its continuity are judged on one page.
 *
 * It paints through the same painter the final render uses, at exact times, and
 * tiles through the one grid helper. It invents nothing: every tile is a time
 * on the score and the label names the shot that time falls in.
 *
 * usage: npm run stills -- films/understudy/score.json [--every 1] [--times 0,2.5,7]
 *                             [--tile 480] [--cols 0]
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { packFontPath } from "../src/engine/plan.js";
import { renderGrid } from "../src/engine/grid.js";
import { sampleTimes } from "../src/engine/sampling.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run stills -- <score.json> [--every 1] [--times 0,2.5,7] [--tile 480]");
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

  const every = Number(arg("every") ?? 1);
  const timesArg = arg("times");
  const times = timesArg
    ? timesArg
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value >= 0 && value <= score.duration)
    : sampleTimes(score.duration, every);
  if (times.length === 0) {
    console.error("error: no still times to paint");
    process.exit(1);
  }
  const unique = [...new Set(times.map((time) => Number(time.toFixed(2))))].sort((a, b) => a - b);

  const tileW = Number(arg("tile") ?? 480);
  const tileH = Math.round((tileW * 9) / 16);
  const outDir = resolve(root, "build", score.id, "stills");
  const framesDir = join(outDir, "frames");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  console.log(`stills: painting ${unique.length} frames`);
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", scorePath,
        "--stills", unique.join(","),
        "--out-dir", framesDir,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });

  const shotAt = (time: number) =>
    plan.shots.find((shot) => time >= shot.start && time < shot.start + shot.duration) ??
    plan.shots[plan.shots.length - 1];

  const missing: number[] = [];
  const tiles = unique.map((time) => {
    const image = join(framesDir, `t-${time.toFixed(2).padStart(5, "0")}.png`);
    if (!existsSync(image)) missing.push(time);
    const shot = shotAt(time);
    return { time, shot, image, label: `t=${time.toFixed(2)}s  ${shot?.id ?? "?"}  ${shot?.recipe ?? ""}` };
  });
  if (missing.length > 0) throw new Error(`no still painted for times: ${missing.join(", ")}`);

  const cols = Number(arg("cols") ?? 0) || Math.min(4, Math.ceil(Math.sqrt(tiles.length)));
  const sheet = join(outDir, "stills.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles: tiles.map((tile) => ({ image: tile.image, label: tile.label })),
    tileWidth: tileW,
    tileHeight: tileH,
    cols,
    font: packFontPath(root, score.style, "caption"),
    labelDir: `build/${score.id}/stills/labels`,
  });

  const checks = {
    everyTimePainted: missing.length === 0,
    inTimeOrder: tiles.every((tile, index) => index === 0 || tile.time > (tiles[index - 1]?.time ?? -1)),
    sheetExists: existsSync(sheet),
  };
  const pass = Object.values(checks).every(Boolean);
  writeFileSync(
    join(outDir, "stills.json"),
    `${JSON.stringify(
      {
        film: score.id,
        pass,
        every,
        count: tiles.length,
        tile: { width: tileW, height: tileH },
        grid: { cols: grid.cols, rows: grid.rows },
        sheet: { path: `build/${score.id}/stills/stills.png`, width: grid.width, height: grid.height },
        frames: tiles.map((tile) => ({
          time: tile.time,
          shot: tile.shot?.id ?? null,
          recipe: tile.shot?.recipe ?? null,
          file: `build/${score.id}/stills/frames/t-${tile.time.toFixed(2).padStart(5, "0")}.png`,
        })),
        checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`stills: ${tiles.length} frames · ${grid.cols}×${grid.rows} grid · ${grid.width}×${grid.height} px`);
  console.log(`stills: ${sheet.replace(`${root}\\`, "").replace(`${root}/`, "")}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
