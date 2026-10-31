/**
 * Per-shot strips (G5, decision 0017 step 6).
 *
 * G5 asks for "one strip per shot every 0.5 s, on one image". This reads the
 * delivered MP4 (the artifact, not a repaint), pulls a row of frames for each
 * shot at a fixed step measured from the shot's own start, and tiles every row
 * into one labelled sheet. A shot with a dead stretch or a drifting look is
 * visible in one glance.
 *
 * It touches nothing in the render chain: the sheet is a review artifact under
 * `build/`, tied to the video hash it was read from.
 *
 * usage: npm run strips -- films/understudy/score.json [--video <mp4>] [--step 0.5] [--tile 384]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { packFontPath } from "../src/engine/plan.js";
import { findFfmpeg, planGridRows, renderGrid, runBinary } from "../src/engine/grid.js";
import { hashFile } from "../src/core/style.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run strips -- <score.json> [--video <mp4>] [--step 0.5] [--tile 384]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

/** "16:9" -> 16/9. Falls back to 16/9. */
function aspectRatio(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w && h ? w / h : 16 / 9;
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

  const video = resolve(root, arg("video") ?? join("films", score.id, `${score.id}.mp4`));
  if (!existsSync(video)) {
    console.error(`error: no delivered video at ${video}; render it first`);
    process.exit(1);
  }

  const step = Number(arg("step") ?? 0.5);
  if (!Number.isFinite(step) || step <= 0) {
    console.error("error: --step must be positive");
    process.exit(1);
  }
  const tileW = Number(arg("tile") ?? 384);
  const ratio = aspectRatio(score.aspect);
  const tileH = Math.round(ratio >= 1 ? tileW / ratio : tileW * ratio);

  const outDir = resolve(root, "build", score.id, "strips");
  const framesDir = join(outDir, "frames");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  const ffmpeg = findFfmpeg();
  const rows: number[] = [];
  const tiles: { image: string; label: string }[] = [];
  const stripReport: Array<{ id: string; frames: number; from: number; to: number }> = [];

  for (const shot of plan.shots) {
    // One pass per shot: frames at the shot's own start, every `step`, for its
    // duration. `fps=1/step` gives them relative to the seek point.
    const dir = join(framesDir, shot.id);
    mkdirSync(dir, { recursive: true });
    await runBinary(
      ffmpeg,
      [
        "-y", "-hide_banner", "-loglevel", "error",
        "-ss", shot.start.toFixed(3),
        "-i", video,
        "-t", shot.duration.toFixed(3),
        "-vf", `fps=${(1 / step).toFixed(6)}`,
        "-frames:v", String(Math.max(1, Math.ceil(shot.duration / step))),
        join(dir, "f-%04d.png"),
      ],
      { cwd: root },
    );
    const files = readdirSync(dir).filter((name) => name.endsWith(".png")).sort();
    if (files.length === 0) throw new Error(`no frames extracted for shot ${shot.id}`);
    rows.push(files.length);
    files.forEach((name, index) => {
      const time = shot.start + index * step;
      tiles.push({
        image: join(dir, name),
        label: index === 0 ? `${shot.id} · ${time.toFixed(2)}s` : `${time.toFixed(2)}s`,
      });
    });
    stripReport.push({ id: shot.id, frames: files.length, from: shot.start, to: shot.start + shot.duration });
    console.log(`strip ${shot.id}: ${files.length} frames`);
  }

  const gridPlan = planGridRows(rows, tileW, tileH);
  const sheet = join(outDir, "strips.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles,
    tileWidth: tileW,
    tileHeight: tileH,
    rows,
    font: packFontPath(root, score.style, "caption"),
    labelDir: `build/${score.id}/strips/labels`,
  });

  const checks = {
    oneRowPerShot: rows.length === plan.shots.length,
    everyRowHasFrames: rows.every((count) => count > 0),
    sheetWritten: existsSync(sheet),
    sheetWidth: grid.width === gridPlan.width && grid.height === gridPlan.height,
  };
  const pass = Object.values(checks).every(Boolean);
  writeFileSync(
    join(outDir, "strips.json"),
    `${JSON.stringify(
      {
        film: score.id,
        pass,
        video,
        videoHash: hashFile(video),
        step,
        tile: { width: tileW, height: tileH },
        grid: { cols: grid.cols, rows: grid.rows, width: grid.width, height: grid.height },
        sheet: `build/${score.id}/strips/strips.png`,
        strips: stripReport,
        checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`strips: ${plan.shots.length} shots · ${tiles.length} frames · ${grid.cols}×${grid.rows} grid · ${grid.width}×${grid.height} px`);
  console.log(`strips: build/${score.id}/strips/strips.png`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
