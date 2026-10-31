/**
 * Storyboard (Gate 2, the visual half).
 *
 * The board pass lists every shot as a text card. This pass shows the same
 * shots as pictures: one code-drawn frame per defined shot, painted through the
 * same painter the final render uses, tiled into a single sheet with its label.
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

function findFfmpeg(): string {
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

function run(binary: string, argv: string[]): Promise<string> {
  return new Promise((done, fail) => {
    const child = spawn(binary, argv, { stdio: ["ignore", "pipe", "pipe"] });
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

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const ffmpeg = findFfmpeg();
  const at = Number(arg("at") ?? 0.5);
  const tileW = Number(arg("tile") ?? 640);
  const tileH = Math.round((tileW * 9) / 16);

  const outDir = resolve(root, "build", score.id, "storyboard");
  const outRel = `build/${score.id}/storyboard`;
  const framesDir = join(outDir, "frames");
  const framesRel = `${outRel}/frames`;
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
  const font = "proofs/s2-paper/assets/fonts/DMMono-Regular.ttf";
  const cols = Math.max(1, Math.min(Number(arg("cols") ?? Math.ceil(Math.sqrt(frames.length))), frames.length));
  const rows = Math.ceil(frames.length / cols);
  const inputs: string[] = [];
  const chains: string[] = [];
  const missing: string[] = [];
  frames.forEach((frame, index) => {
    const still = join(framesDir, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`);
    if (!existsSync(still)) missing.push(frame.shot.id);
    const labelRel = `${framesRel}/label-${index + 1}.txt`;
    writeFileSync(
      resolve(root, labelRel),
      `${frame.shot.id}  ${frame.from.toFixed(2)}–${frame.to.toFixed(2)}s  ${frame.shot.recipe}`,
      "utf8",
    );
    inputs.push("-i", still);
    chains.push(
      `[${index}:v]scale=${tileW}:${tileH}:force_original_aspect_ratio=decrease,pad=${tileW}:${tileH}:(ow-iw)/2:(oh-ih)/2:color=0x171310,` +
        `drawtext=fontfile='${font}':textfile='${labelRel}':fontcolor=0xF2E8D5:fontsize=${Math.round(tileW / 32)}:x=10:y=h-${Math.round(tileW / 22)}:box=1:boxcolor=0x171310@0.72:boxborderw=6[v${index}]`,
    );
  });
  if (missing.length > 0) throw new Error(`no storyboard frame for shots: ${missing.join(", ")}`);

  const layout = frames
    .map((_, index) => `${(index % cols) * tileW}_${Math.floor(index / cols) * tileH}`)
    .join("|");
  const stacked = frames.map((_, index) => `[v${index}]`).join("");
  const sheet = join(outDir, "storyboard.png");
  await run(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...inputs,
    "-filter_complex",
    `${chains.join(";")};${stacked}xstack=inputs=${frames.length}:layout=${layout}:fill=0x171310`,
    "-frames:v", "1",
    sheet,
  ]);

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
    grid: { cols, rows },
    sheet: { path: sheet, width: cols * tileW, height: rows * tileH },
    shots: frames.map((frame) => ({
      id: frame.shot.id,
      from: frame.from,
      to: frame.to,
      time: frame.time,
      recipe: frame.shot.recipe,
      frame: join(framesRel, `t-${frame.time.toFixed(2).padStart(5, "0")}.png`),
    })),
    checks,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, "storyboard.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`storyboard: ${frames.length} shots · ${cols}×${rows} grid · ${report.sheet.width}×${report.sheet.height} px`);
  console.log(`storyboard: ${sheet.replace(`${root}\\`, "").replace(`${root}/`, "")}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
