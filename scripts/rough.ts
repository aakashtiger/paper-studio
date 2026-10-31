/**
 * Stepped rough (Gate 3, second pass).
 *
 * The board pass shows the sequence as cards; this pass shows the same cut with
 * the characters on screen, stepped at 10 fps (three-frame holds), with live
 * camera and the scratch audio. It pairs every board time with its rough frame
 * on one contact sheet and measures per-shot motion, so a dead middle or a
 * pose-to-pose snap is caught before the final render.
 *
 * It does not animate anything: it renders the score through the same painter
 * the final render uses, at a lower rate.
 *
 * usage: npm run rough -- films/understudy/score.json [--fps 10] [--floor 0.6]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { buildBoard } from "../src/engine/board.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run rough -- <score.json> [--fps 10] [--floor 0.6]");
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

  const fps = Number(arg("fps") ?? 10);
  const floor = Number(arg("floor") ?? 0.6);
  const ffmpeg = findFfmpeg();
  const entries = buildBoard(plan);

  const outDir = resolve(root, "build", score.id, "rough");
  // ffmpeg filter strings cannot carry a Windows drive colon, so anything that
  // goes inside a drawtext option is written as a repo-relative path and the
  // child process runs with cwd at the repo root (the same trick animatic.ts uses).
  const outRel = `build/${score.id}/rough`;
  const framesDir = join(outDir, "frames");
  const stillsDir = join(outDir, "stills");
  const stillsRel = `${outRel}/stills`;
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  mkdirSync(stillsDir, { recursive: true });

  // 1. Render the whole score through the painter at the stepped rate.
  const silent = join(outDir, "rough-silent.mp4");
  console.log(`rough: painting ${Math.round(plan.duration * fps)} frames at ${fps} fps`);
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", scorePath,
        "--fps", String(fps),
        "--out", silent,
        "--keep-frames", framesDir,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });

  // 2. Pair every board time with its rough frame.
  const frameFile = (time: number) => {
    const index = Math.min(Math.round(time * fps), Math.round(plan.duration * fps) - 1);
    return join(framesDir, `frame-${String(index + 1).padStart(4, "0")}.png`);
  };
  const tiles: { entry: typeof entries[number]; still: string; tile: string }[] = [];
  entries.forEach((entry, index) => {
    const source = frameFile(entry.time);
    if (!existsSync(source)) throw new Error(`no rough frame for board time ${entry.time}s`);
    const n = String(index + 1).padStart(2, "0");
    const still = join(stillsDir, `${n}-${entry.id}.png`);
    copyFileSync(source, still);
    tiles.push({ entry, still, tile: join(stillsDir, `${n}-tile.png`) });
  });

  // 3. One contact sheet: each rough frame carrying its board label.
  const font = "proofs/s2-paper/assets/fonts/DMMono-Regular.ttf";
  const cols = Math.min(3, tiles.length);
  const rows = Math.ceil(tiles.length / cols);
  const cellW = 640;
  const cellH = 360;
  const inputs: string[] = [];
  const chains: string[] = [];
  tiles.forEach((tile, index) => {
    const labelRel = `${stillsRel}/label-${index + 1}.txt`;
    writeFileSync(
      resolve(root, labelRel),
      `${tile.entry.label}   ${tile.entry.time.toFixed(2)}s   f${tile.entry.frame}`,
      "utf8",
    );
    inputs.push("-i", tile.still);
    chains.push(
      `[${index}:v]scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x171310,` +
        `drawtext=fontfile='${font}':textfile='${labelRel}':fontcolor=0xF2E8D5:fontsize=20:x=12:y=h-34:box=1:boxcolor=0x171310@0.72:boxborderw=8[v${index}]`,
    );
  });
  const layout = tiles
    .map((_, index) => `${(index % cols) * cellW}_${Math.floor(index / cols) * cellH}`)
    .join("|");
  const stacked = tiles.map((_, index) => `[v${index}]`).join("");
  const sheet = join(outDir, "contact-sheet.png");
  await run(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...inputs,
    "-filter_complex",
    `${chains.join(";")};${stacked}xstack=inputs=${tiles.length}:layout=${layout}:fill=0x171310`,
    "-frames:v", "1",
    sheet,
  ]);

  // 4. Captions, burned from the score, then the scratch audio.
  const captionFilters = plan.captions.lines
    .map((caption, index) => {
      const rel = `${stillsRel}/caption-${index + 1}.txt`;
      writeFileSync(resolve(root, rel), caption.text, "utf8");
      return `drawtext=fontfile='${font}':textfile='${rel}':fontcolor=0xFBF4E6:fontsize=40:x=(w-text_w)/2:y=h-150:box=1:boxcolor=0x171310@0.82:boxborderw=18:enable='between(t\\,${caption.start}\\,${caption.end})'`;
    })
    .join(",");
  const captioned = join(outDir, "rough-captioned.mp4");
  await run(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", silent,
    "-vf", captionFilters || "null",
    "-r", String(fps),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast",
    captioned,
  ]);

  const master = join(root, "build", score.id, "mix", "master.wav");
  const sfx = join(root, "build", score.id, "sfx", "mix.wav");
  const audio = existsSync(master) ? master : existsSync(sfx) ? sfx : null;
  const output = resolve(root, arg("out") ?? join("build", score.id, "rough", "rough.mp4"));
  const muxArgs = ["-y", "-hide_banner", "-loglevel", "error", "-i", captioned];
  if (audio) {
    muxArgs.push("-i", audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-shortest");
  }
  muxArgs.push("-c:v", "copy", output);
  await run(ffmpeg, muxArgs);

  // 5. Per-shot motion on the stepped cut.
  const shots: {
    id: string; start: number; duration: number; frames: number;
    median: number; mean: number; max: number; deadSeconds: number;
  }[] = [];
  let start = 0;
  for (const [index, shot] of plan.shots.entries()) {
    const from = shot.start ?? start;
    start = from + shot.duration;
    const out = await run(ffmpeg, [
      "-hide_banner", "-ss", from.toFixed(3), "-t", shot.duration.toFixed(3), "-i", silent,
      "-vf", "tblend=all_mode=difference,signalstats,metadata=print:file=-",
      "-an", "-f", "null", "-",
    ]);
    const values = [...out.matchAll(/lavfi\.signalstats\.YAVG=([\d.]+)/g)].map((m) => Number(m[1]));
    const diffs = values.slice(1);
    if (diffs.length === 0) throw new Error(`no frame differences for ${shot.id}`);
    const sorted = [...diffs].sort((a, b) => a - b);
    let streak = 0;
    let longest = 0;
    for (const value of diffs) {
      if (value < floor / 10) { streak++; longest = Math.max(longest, streak); } else streak = 0;
    }
    shots.push({
      id: shot.id,
      start: Number(from.toFixed(2)),
      duration: Number(shot.duration.toFixed(2)),
      frames: diffs.length,
      median: Number((sorted[Math.floor(sorted.length / 2)] ?? 0).toFixed(3)),
      mean: Number((diffs.reduce((s, v) => s + v, 0) / diffs.length).toFixed(3)),
      max: Number((sorted[sorted.length - 1] ?? 0).toFixed(2)),
      deadSeconds: Number((longest / fps).toFixed(2)),
    });
  }

  const checks = {
    boardPaired: tiles.length === entries.length && existsSync(sheet),
    everyShotMoves: shots.every((shot) => shot.median >= floor),
    noLongHold: shots.every((shot) => shot.deadSeconds <= 0.4),
    // A camera-only shot has no character/action event; every event is a camera
    // move. The direction events are the authored proof of an action.
    notCameraOnly: plan.shots.every((shot) =>
      shot.direction.events.some((event) => !/\bcamera\b|\bmove\b|\bpan\b|\bdolly\b/i.test(event.kind)),
    ),
  };
  const weak = shots.filter((shot) => shot.median < floor).map((shot) => shot.id);
  const cameraOnly = plan.shots
    .filter((shot) => shot.direction.events.every((event) => /\bcamera\b|\bmove\b|\bpan\b|\bdolly\b/i.test(event.kind)))
    .map((shot) => shot.id);
  const pass = Object.values(checks).every(Boolean);
  const report = {
    film: score.id,
    pass,
    fps,
    floor,
    rate: `1/${Math.max(1, Math.round((plan.fps || 30) / fps))} frames (${plan.fps || 30} → ${fps} fps)`,
    boardEntries: entries.length,
    pairedStills: tiles.length,
    contactSheet: sheet,
    output,
    audio: audio ? audio.replace(`${root}\\`, "").replace(`${root}/`, "") : "silent",
    shots,
    weak,
    cameraOnly,
    checks,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, "rough.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  for (const shot of shots) {
    console.log(
      `  ${shot.median < floor ? "WEAK" : "ok  "} ${shot.id} ${shot.start}s ${shot.duration}s · median ${shot.median} · dead ${shot.deadSeconds}s`,
    );
  }
  console.log(`rough: ${entries.length} board times paired · sheet ${sheet.replace(`${root}\\`, "")}`);
  console.log(`rough: ${shots.length} shots · ${checks.everyShotMoves ? "all move" : `weak ${weak.join(", ")}`} · ${checks.noLongHold ? "no hold > 0.4s" : "hold > 0.4s"} · ${pass ? "pass" : "FAIL"}`);
  console.log(`rough: ${output.replace(`${root}\\`, "")} (${report.audio})`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
