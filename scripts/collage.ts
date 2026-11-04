/**
 * The collage (decision 0025, stage 5) — painted, inspected and passed by the
 * tool, not by a person.
 *
 * One frame per shot, through the film's real recipe, cast and painter, on one
 * page, in shot order. Before the page is written the engine inspects the frames
 * it just painted: every shot present, no flat frame, no two shots the same
 * picture, every staged character actually drawn, no word off the edge.
 *
 * A failing collage is a refusal: `render:film` will not paint a whole film
 * without a passing collage for the same score. That is the "no manual approval"
 * rule the user set, made mechanical — the tool checks itself and either goes on
 * or says what is broken.
 *
 * usage: npm run collage -- films/<id>/score.json [--tile 640] [--cols 3] [--at 0.5]
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { checkCollage, flatness, type CollageFrame } from "../src/engine/collage.js";
import { pngSize } from "../src/engine/chrome.js";
import {
  analyzeRgb,
  readRgb,
  summarize,
  type FrameReport,
  type ProbeFrame,
} from "../src/engine/frame-report.js";
import { findFfmpeg, renderGrid } from "../src/engine/grid.js";
import { packFontPath } from "../src/engine/plan.js";
import { shotTimes } from "../src/engine/sampling.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run collage -- <score.json> [--tile 640] [--cols 3] [--at 0.5]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

type Probe = {
  frames: {
    time: number;
    textBoxes?: { text: string; x: number; y: number; w: number; h: number }[];
    rigRecords?: ProbeFrame["rigRecords"];
  }[];
};

/** Decode one frame to a coarse RGB sample — 32×18 is enough to tell flat from drawn. */
function sampleOf(ffmpeg: string, png: string): number[] {
  const result = spawnSync(
    ffmpeg,
    ["-v", "error", "-i", png, "-vf", "scale=32:18:flags=area", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
    { maxBuffer: 4 * 1024 * 1024 },
  );
  if (result.status !== 0 || !result.stdout) return [];
  return [...result.stdout];
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const scoreFile = resolve(root, scorePath);
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scoreFile, "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const at = Number(arg("at") ?? 0.5);
  const tileW = Number(arg("tile") ?? 640);
  const tileH = Math.round((tileW * 9) / 16);

  const outDir = resolve(root, "build", score.id, "collage");
  const framesDir = join(outDir, "frames");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  const probePath = join(outDir, "probe.json");

  const frames = shotTimes(plan.shots, at).map((entry) => ({
    shot: plan.shots[entry.index]!,
    ...entry,
  }));
  const times = frames.map((frame) => frame.time);

  console.log(`collage: painting ${frames.length} shots at ${at * 100}% through each`);
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", scorePath,
        "--stills", times.join(","),
        "--out-dir", framesDir,
        "--probe", probePath,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });

  const probe: Probe = existsSync(probePath)
    ? (JSON.parse(readFileSync(probePath, "utf8")) as Probe)
    : { frames: [] };
  const ffmpeg = findFfmpeg();
  let size = { width: 1920, height: 1080 };

  const painted: CollageFrame[] = frames.map((frame) => {
    const png = join(framesDir, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`);
    const measured = pngSize(png);
    if (measured) size = measured;
    const bytes = existsSync(png) ? readFileSync(png) : Buffer.alloc(0);
    const seen = probe.frames.find((entry) => Math.abs(entry.time - frame.time) < 1e-6);
    const characters = [
      ...new Set(
        (seen?.rigRecords ?? [])
          .map((record) => record.character)
          .filter((name): name is string => typeof name === "string" && name.length > 0),
      ),
    ].sort();
    return {
      shot: frame.shot.id,
      time: frame.time,
      hash: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
      sample: existsSync(png) ? sampleOf(ffmpeg, png) : [],
      characters,
      text: (seen?.textBoxes ?? []).map((box) => ({
        text: box.text,
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h,
      })),
    };
  });

  const report = checkCollage({
    film: score.id,
    shots: plan.shots.map((shot) => ({ id: shot.id, cast: shot.direction.cast ?? [] })),
    frames: painted,
    width: size.width,
    height: size.height,
  });

  // The frame report is the identity evidence. It uses the frames the collage
  // already painted - no second paint pass - and the probe's own anchors.
  const frameShots = frames.map((frame) => {
    const png = join(framesDir, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`);
    const seen = probe.frames.find((entry) => Math.abs(entry.time - frame.time) < 1e-6);
    return analyzeRgb({
      rgb: readRgb(ffmpeg, png),
      shot: frame.shot.id,
      time: frame.time,
      cast: frame.shot.direction.cast ?? [],
      probe: seen as ProbeFrame | undefined,
    });
  });
  const frameReport: FrameReport = {
    $schema: "paper-studio/frame-report@1",
    film: score.id,
    score: `sha256:${createHash("sha256").update(readFileSync(scoreFile)).digest("hex")}`,
    videoHash: null,
    stage: "collage",
    grid: { width: 480, height: 270 },
    shots: frameShots,
    summary: summarize(frameShots),
  };
  writeFileSync(
    resolve(root, "build", score.id, "frame-report.json"),
    `${JSON.stringify(frameReport, null, 2)}\n`,
    "utf8",
  );
  console.log(
    `frame-report: ${frameReport.summary.shots} shots · bars ${(frameReport.summary.barsLeftMax * 100).toFixed(1)}/${(frameReport.summary.barsRightMax * 100).toFixed(1)}% · centroid band ${(frameReport.summary.centroidShare * 100).toFixed(0)}% · local ${frameReport.summary.localContrastMedian.toFixed(1)}`,
  );

  // 2. One page, in shot order, each tile carrying the shot it is.
  const missing = painted.filter((frame) => frame.sample.length === 0).map((frame) => frame.shot);
  const tiles = frames.map((frame) => {
    const cast = frame.shot.direction.cast ?? [];
    return {
      image: join(framesDir, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`),
      label:
        `${frame.shot.id}  ${frame.from.toFixed(2)}–${frame.to.toFixed(2)}s  ${frame.shot.recipe}` +
        (cast.length > 0 ? `  ·  ${cast.join(", ")}` : ""),
    };
  });
  const cols = Number(arg("cols") ?? 0) || Math.ceil(Math.sqrt(frames.length));
  const sheet = join(outDir, "collage.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles,
    tileWidth: tileW,
    tileHeight: tileH,
    cols,
    font: packFontPath(root, score.style, "caption"),
    labelDir: `build/${score.id}/collage/labels`,
  });

  const scored = {
    ...report,
    score: `sha256:${createHash("sha256").update(readFileSync(scoreFile)).digest("hex")}`,
    at,
    frame: size,
    grid: { cols: grid.cols, rows: grid.rows, width: grid.width, height: grid.height },
    sheet: `build/${score.id}/collage/collage.png`,
    unreadable: missing,
    frames: frames.map((frame) => {
      const drawn = painted.find((entry) => entry.shot === frame.shot.id);
      return {
        shot: frame.shot.id,
        time: frame.time,
        cast: frame.shot.direction.cast ?? [],
        drew: drawn?.characters ?? [],
        colours: drawn ? flatness(drawn.sample).colours : 0,
        spread: drawn ? Number(flatness(drawn.sample).stddev.toFixed(2)) : 0,
        text: drawn?.text.length ?? 0,
        file: `build/${score.id}/collage/frames/t-${frame.time.toFixed(2).padStart(5, "0")}.png`,
      };
    }),
  };
  writeFileSync(resolve(root, "build", score.id, "collage.json"), `${JSON.stringify(scored, null, 2)}\n`, "utf8");

  console.log(`collage: ${frames.length} frames · ${report.distinct} distinct · ${size.width}×${size.height}`);
  console.log(`collage: ${sheet.replace(`${root}\\`, "").replace(`${root}/`, "")}`);
  if (report.warnings.length > 0) {
    for (const warning of report.warnings.slice(0, 12)) console.log(`  warn  ${warning.message}`);
  }
  if (!report.ok) {
    for (const error of report.errors) console.log(`  FAIL  [${error.code}] ${error.message}`);
    console.log(`collage: ${report.errors.length} refusal(s) — the film is not ready to paint`);
    process.exit(1);
  }
  console.log(`collage: PASS — every shot is on the page, drawn and distinct`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
