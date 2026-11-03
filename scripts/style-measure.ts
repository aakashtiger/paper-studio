/**
 * `style:measure` — measure a reference, and measure our frames against it.
 *
 * This is the step the style pack did not have. The pack encodes a style very
 * well; it did not have a repeatable way to *read* one out of a reference, or to
 * say how far our frames are from it. The video that prompted this measured 20
 * shorts, 32,000 frames, into contact sheets, camera drift, cuts, brightness,
 * contrast and saturation, and then wrote its rule book from the numbers.
 *
 * Nothing here knows what paper, 3D, ink or K-pop is. It measures any video or
 * any folder of frames, and reports numbers in the same units for both.
 *
 * usage:
 *   npm run style:measure -- --ref <dir|video> [--out build/style-measure]
 *   npm run style:measure -- --ref <dir|video> --specimen <dir|video> [--out ...]
 *   npm run style:measure -- --ref <video> --sheets
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { findFfmpeg, renderGrid, runBinary } from "../src/engine/grid.js";
import {
  compareMetrics,
  distinctPalette,
  median,
  metricRow,
  parseSignalStats,
  shotLengths,
  summarize,
  cameraPath,
  cameraMoves,
  summarizeCamera,
  type CameraReport,
  type StyleMetrics,
} from "../src/engine/style-measure.js";

const IMAGE = /\.(png|jpe?g|webp)$/i;
const VIDEO = /\.(mp4|mov|webm|mkv|m4v)$/i;

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function findFfprobe(): string {
  const env = process.env.FFPROBE_PATH;
  if (env && existsSync(env)) return env;
  const roots = [
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe"),
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "linux", "x64", "ffprobe"),
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "darwin", "x64", "ffprobe"),
  ];
  for (const root of roots) if (existsSync(root)) return root;
  return "ffprobe";
}

function capture(binary: string, argv: string[]): Promise<Buffer> {
  return new Promise((done, fail) => {
    const child = spawn(binary, argv, { stdio: ["ignore", "pipe", "pipe"] });
    const out: Buffer[] = [];
    let err = "";
    child.stdout.on("data", (chunk: Buffer) => out.push(chunk));
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => (err += chunk));
    child.on("close", (code) => {
      if (code === 0) done(Buffer.concat(out));
      else fail(new Error(`${binary} exited ${code}\n${err.slice(-1200)}`));
    });
  });
}

async function text(binary: string, argv: string[]): Promise<string> {
  return (await capture(binary, argv)).toString("utf8");
}

const ffmpeg = findFfmpeg();
const ffprobe = findFfprobe();
const root = process.cwd();

type Probe = { width: number; height: number; fps: number | null; duration: number | null; frames: number };

async function probe(file: string): Promise<Probe> {
  const raw = await text(ffprobe, [
    "-v", "error", "-print_format", "json", "-show_format", "-show_streams", file,
  ]);
  const doc = JSON.parse(raw) as {
    format?: { duration?: string };
    streams?: { codec_type?: string; width?: number; height?: number; r_frame_rate?: string; nb_frames?: string }[];
  };
  const video = (doc.streams ?? []).find((stream) => stream.codec_type === "video");
  const [num, den] = (video?.r_frame_rate ?? "0/1").split("/").map(Number);
  const fps = den && num ? Number((num / den).toFixed(3)) : null;
  const duration = doc.format?.duration ? Number(Number(doc.format.duration).toFixed(3)) : null;
  return {
    width: video?.width ?? 0,
    height: video?.height ?? 0,
    fps,
    duration,
    frames: Number(video?.nb_frames) || (duration && fps ? Math.round(duration * fps) : 0),
  };
}

function split(cuts: number[]): { min: number; median: number; max: number; count: number } {
  return {
    count: cuts.length,
    min: cuts.length ? Math.min(...cuts) : 0,
    median: cuts.length ? Number(median(cuts).toFixed(3)) : 0,
    max: cuts.length ? Math.max(...cuts) : 0,
  };
}

async function stats(file: string, filter: string): Promise<ReturnType<typeof parseSignalStats>> {
  const out = await text(ffmpeg, [
    "-hide_banner", "-i", file,
    "-vf", `${filter},signalstats,metadata=print:file=-`,
    "-an", "-f", "null", "-",
  ]);
  return parseSignalStats(out);
}

async function edges(file: string): Promise<number[]> {
  const out = await stats(file, "scale=320:-2,edgedetect=low=0.1:high=0.3");
  return out.map((sample) => sample.yavg);
}

async function palette(file: string): Promise<string[]> {
  if (!existsSync("build")) mkdirSync("build", { recursive: true });
  const tmp = join(root, "build", `style-palette-${process.pid}.png`);
  try {
    await runBinary(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", file,
      "-vf", "scale=320:-2,palettegen=max_colors=6:stats_mode=full:reserve_transparent=0",
      "-frames:v", "1", tmp,
    ], { cwd: root });
    const raw = await capture(ffmpeg, ["-v", "error", "-i", tmp, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
    return distinctPalette(raw, 6);
  } finally {
    rmSync(tmp, { force: true });
  }
}

function aspect(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  if (!width || !height) return "unknown";
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

async function measureFrames(dir: string, out: string): Promise<StyleMetrics> {
  const files = readdirSync(dir).filter((name) => IMAGE.test(name)).sort().map((name) => join(dir, name));
  if (files.length === 0) throw new Error(`no images in ${dir}`);
  const probes = await Promise.all(files.map((file) => probe(file)));
  const aspects = [...new Set(probes.map((info) => aspect(info.width, info.height)))];
  const luma: number[] = [];
  const contrast: number[] = [];
  const saturation: number[] = [];
  const edge: number[] = [];

  for (const file of files) {
    const samples = await stats(file, "scale=320:-2");
    for (const sample of samples) {
      luma.push(sample.yavg);
      contrast.push(sample.ymax - sample.ymin);
      if (Number.isFinite(sample.satavg)) saturation.push(sample.satavg);
    }
    edge.push(...(await edges(file)));
  }

  // One palette per frame, merged and deduplicated: a reference set is not its
  // first image. The order is the order the frames contribute them.
  const merged: string[] = [];
  for (const file of files) {
    for (const colour of await palette(file)) {
      if (!merged.includes(colour) && merged.length < 6) merged.push(colour);
    }
  }

  return {
    source: dir,
    kind: "frames",
    format: {
      width: probes[0]?.width ?? 0,
      height: probes[0]?.height ?? 0,
      aspect: aspects.length === 1 ? (aspects[0] as string) : "mixed",
      fps: null,
      duration: null,
      frames: files.length,
    },
    luma: summarize(luma),
    contrast: summarize(contrast),
    saturation: summarize(saturation),
    edges: summarize(edge),
    movement: null,
    cuts: null,
    sceneChanges: null,
    camera: null,
    shots: null,
    palette: merged,
  };
}

async function measureVideo(file: string, out: string, sheets: boolean, scorePath?: string, camera = false, role = "reference"): Promise<StyleMetrics> {
  const info = await probe(file);
  const samples = await stats(file, "scale=320:-2");
  const movement = await stats(file, "scale=320:-2,tblend=all_mode=difference");
  const edge = await edges(file);

  // `showinfo` writes its frame lines to stderr, not stdout; `runBinary`
  // returns both. Capturing only stdout found zero cuts and called a ten-shot
  // film one shot.
  const cutOut = await runBinary(ffmpeg, [
    "-hide_banner", "-i", file,
    "-vf", "select='gt(scene,0.03)',showinfo",
    "-an", "-f", "null", "-",
  ], { cwd: root });
  const sceneCuts = [...cutOut.matchAll(/pts_time:([\d.]+)/g)]
    .map((match) => Number(match[1]))
    .filter((time, index, all) => Number.isFinite(time) && all.indexOf(time) === index)
    .sort((a, b) => a - b);
  const sceneLengths = shotLengths(sceneCuts, info.duration ?? (samples.at(-1)?.time ?? 0) + 1 / (info.fps ?? 30));

  // A scene detector finds *changes*, not authored shots: on Same Alarm it
  // finds 12 changes for a 10-shot film. With --score, the shots are the
  // score's own boundaries; the raw changes are reported beside them.
  let cuts = sceneCuts;
  let lengths = sceneLengths;
  if (scorePath) {
    const score = JSON.parse(readFileSync(resolve(root, scorePath), "utf8")) as { duration?: number; shots?: { duration: number }[] };
    if (!Array.isArray(score.shots) || score.shots.length === 0) {
      throw new Error(`--score has no shots: ${scorePath}`);
    }
    lengths = score.shots.map((shot) => shot.duration);
    const total = lengths.reduce((sum, seconds) => sum + seconds, 0);
    if (info.duration && Math.abs(total - info.duration) > 0.5) {
      throw new Error(
        `--score is ${total.toFixed(3)}s but the video is ${info.duration.toFixed(3)}s — ` +
          "the cuts would describe a different film",
      );
    }
    cuts = [];
    let at = 0;
    for (let index = 0; index < lengths.length - 1; index += 1) {
      at += lengths[index] as number;
      cuts.push(Number(at.toFixed(3)));
    }
  }

  if (sheets && info.duration) {
    const dir = join(out, "sheets");
    mkdirSync(dir, { recursive: true });
    // The video's own method: two seconds per sheet, sixty frames, one image.
    for (let at = 0, index = 0; at < info.duration; at += 2, index += 1) {
      await runBinary(ffmpeg, [
        "-y", "-hide_banner", "-loglevel", "error",
        "-ss", at.toFixed(3), "-t", "2", "-i", file,
        "-vf", "fps=30,scale=160:-2,tile=10x6",
        "-frames:v", "1", join(dir, `sheet-${String(index).padStart(3, "0")}.jpg`),
      ], { cwd: root });
    }
  }

  let shotAt = 0;
  const shotWindows = lengths.map((duration) => {
    const window = { start: shotAt, duration };
    shotAt += duration;
    return window;
  });

  /**
   * x, y and z. The video tracks the camera with phase correlation; this is the
   * same answer on a 48x27 luma grid: a brute-force translation search plus a
   * zoom search around the best shift. It is opt-in because it is the one
   * measurement that costs a full decode and a few hundred million comparisons.
   */
  let cameraReport: CameraReport | null = null;
  if (camera) {
    // 48 wide, aspect preserved: a 9:16 source gets 48x85, not a squeezed 48x27.
    const gridWidth = 48;
    const gridHeight = Math.max(1, Math.round((info.height * gridWidth) / Math.max(1, info.width)));
    const gray = await capture(ffmpeg, [
      "-v", "error", "-i", file,
      "-vf", `scale=${gridWidth}:${gridHeight},format=gray`,
      "-f", "rawvideo", "-",
    ]);
    const frameSize = gridWidth * gridHeight;
    const frames: Uint8Array[] = [];
    for (let at = 0; at + frameSize <= gray.length; at += frameSize) {
      frames.push(gray.subarray(at, at + frameSize));
    }
    const fps = info.fps ?? 30;
    const cutFrames = new Set(cuts.map((time) => Math.round(time * fps)));
    const path = cameraPath(frames, gridWidth, gridHeight, {
      fullWidth: info.width,
      fullHeight: info.height,
      skipFrames: cutFrames,
    });
    const moves = cameraMoves(frames, gridWidth, gridHeight, shotWindows, fps, {
      fullWidth: info.width,
      fullHeight: info.height,
    });
    cameraReport = summarizeCamera(path, moves, {
      source: file,
      resolutionPx: Number((info.width / gridWidth).toFixed(2)),
    });
    writeFileSync(join(out, `camera-${role}.json`), `${JSON.stringify(cameraReport, null, 2)}\n`, "utf8");
  }

  return {
    source: file,
    kind: "video",
    format: { width: info.width, height: info.height, aspect: aspect(info.width, info.height), fps: info.fps, duration: info.duration, frames: info.frames },
    luma: summarize(samples.map((sample) => sample.yavg)),
    contrast: summarize(samples.map((sample) => sample.ymax - sample.ymin)),
    saturation: summarize(samples.map((sample) => sample.satavg).filter(Number.isFinite)),
    edges: summarize(edge),
    movement: summarize(movement.map((sample) => sample.yavg)),
    camera: cameraReport,
    cuts: {
      count: cuts.length,
      perMinute: info.duration ? Number(((cuts.length / info.duration) * 60).toFixed(2)) : 0,
      times: cuts.map((time) => Number(time.toFixed(3))),
    },
    sceneChanges: {
      count: sceneCuts.length,
      perMinute: info.duration ? Number(((sceneCuts.length / info.duration) * 60).toFixed(2)) : 0,
      times: sceneCuts.map((time) => Number(time.toFixed(3))),
    },
    shots: { ...split(lengths), count: lengths.length },
    palette: await palette(file),
  };
}

async function measure(path: string, out: string, sheets: boolean, scorePath?: string, camera = false, role = "reference"): Promise<StyleMetrics> {
  if (!existsSync(path)) throw new Error(`not found: ${path}`);
  if (statSync(path).isDirectory()) {
    if (camera) throw new Error("--camera needs a video; a frame set has no motion to measure");
    return measureFrames(path, out);
  }
  if (!VIDEO.test(path) && !IMAGE.test(path)) throw new Error(`neither a folder of images nor a video: ${path}`);
  return measureVideo(path, out, sheets, scorePath, camera, role);
}

function table(metrics: StyleMetrics): string {
  const row = metricRow(metrics);
  const lines = [
    `| metric | value | what it means |`,
    `|---|---|---|`,
    `| aspect | ${row.aspect} | frame shape |`,
    `| fps | ${row.fps ?? "—"} | frame rate |`,
    `| duration | ${row.duration ?? "—"} | seconds measured |`,
    `| luma mean | ${row.luma} / 255 | how bright the frame is |`,
    `| contrast mean | ${row.contrast} / 255 | luma range, high = hard light |`,
    `| saturation mean | ${row.saturation} / 255 | colour strength |`,
    `| edge density | ${row.edges ?? "—"} / 255 | how much line/ink/cut edge |`,
    `| movement mean | ${row.movement ?? "-"} / 255 | frame-to-frame change |`,
    ...(metrics.camera
      ? [
          `| camera |dx| | ${row.cameraDx} px/shot | mean absolute x translation |`,
          `| camera |dy| | ${row.cameraDy} px/shot | mean absolute y translation |`,
          `| camera dz | ${row.cameraDz} %/shot | z zoom; positive = push-in |`,
          `| camera moving | ${(Number(row.cameraMoving) * 100).toFixed(1)}% | frames with at least 1 px of translation |`,
        ]
      : []),
    `| shot median | ${row.shotMedian ?? "-"} s | middle shot length |`,
    `| cuts / minute | ${row.cutsPerMinute ?? "—"} | cutting rate (authored shots with --score) |`,
    `| scene changes / minute | ${row.sceneChangesPerMinute ?? "—"} | raw detector; not the authored shot count |`,
    `| palette | ${row.palette} | the first six distinct colours |`,
  ];
  return lines.join("\n");
}

function bible(metrics: StyleMetrics): string {
  return [
    `# Style bible — ${metrics.source}`,
    ``,
    `Measured, not described. Every number below comes from ffmpeg on the source`,
    `frames; nothing here is an opinion about the style.`,
    ``,
    table(metrics),
    ``,
    `## What this cannot say`,
    ``,
    metrics.kind === "frames"
      ? `This is a frame set, not a film: cuts, shot lengths and movement need a video.`
      : `Luma, contrast, saturation, edge density and movement are global per-frame measures. They do not say *where* the ink is, what the light direction is, or whether a face reads.`,
    ``,
  ].join("\n");
}

function matchReport(ref: StyleMetrics, spec: StyleMetrics): string {
  const delta = compareMetrics(ref, spec);
  const moveMean = (camera: CameraReport | null, key: "dx" | "dy" | "dz" | "speed", absolute = false): string => {
    if (!camera || camera.moves.length === 0) return "-";
    return (
      camera.moves.reduce((sum, move) => sum + (absolute ? Math.abs(move[key]) : move[key]), 0) /
      camera.moves.length
    ).toFixed(2);
  };
  return [
    `# Look match — reference vs specimen`,
    ``,
    `Reference: \`${ref.source}\``,
    `Specimen: \`${spec.source}\``,
    ``,
    `| metric | reference | specimen | delta (specimen − reference) |`,
    `|---|---|---|---|`,
    `| luma | ${ref.luma.mean.toFixed(2)} | ${spec.luma.mean.toFixed(2)} | ${delta.luma} |`,
    `| contrast | ${ref.contrast.mean.toFixed(2)} | ${spec.contrast.mean.toFixed(2)} | ${delta.contrast} |`,
    `| saturation | ${ref.saturation.mean.toFixed(2)} | ${spec.saturation.mean.toFixed(2)} | ${delta.saturation} |`,
    `| edges | ${ref.edges?.mean.toFixed(2) ?? "—"} | ${spec.edges?.mean.toFixed(2) ?? "—"} | ${delta.edges} |`,
    `| movement | ${ref.movement?.mean.toFixed(2) ?? "-"} | ${spec.movement?.mean.toFixed(2) ?? "-"} | ${delta.movement} |`,
    ...(ref.camera || spec.camera
      ? [
          `| camera dx (px/shot) | ${moveMean(ref.camera, "dx", true)} | ${moveMean(spec.camera, "dx", true)} | ${delta.cameraDx} |`,
          `| camera dy (px/shot) | ${moveMean(ref.camera, "dy", true)} | ${moveMean(spec.camera, "dy", true)} | ${delta.cameraDy} |`,
          `| camera dz (%/shot) | ${moveMean(ref.camera, "dz")} | ${moveMean(spec.camera, "dz")} | ${delta.cameraDz} |`,
          `| camera speed (px/s) | ${moveMean(ref.camera, "speed")} | ${moveMean(spec.camera, "speed")} | ${delta.cameraSpeed} |`,
        ]
      : []),
    `| shot median | ${ref.shots?.median ?? "-"} | ${spec.shots?.median ?? "-"} | ${delta.shotMedian} |`,
    `| cuts / minute | ${ref.cuts?.perMinute ?? "—"} | ${spec.cuts?.perMinute ?? "—"} | ${delta.cutsPerMinute} |`,
    `| scene changes / min | ${ref.sceneChanges?.perMinute ?? "—"} | ${spec.sceneChanges?.perMinute ?? "—"} | — |`,
    `| palette distance | — | ${delta.palette} | ${delta.palette} |`,
    ``,
    `Delta is `+"`specimen - reference`"+`: positive means the specimen has more of it.`,
    `Palette distance is not a delta: it is the mean distance from each reference`,
    `colour to its nearest specimen colour (0-441).`,
    ``,
    `Pairs in \`pairs.png\` are matched in **filename order**, not by shot. Read the`,
    `numbers as a distribution across the reference, not as a shot-to-shot verdict.`,
    `A number here is a target to move, not a pass/fail. A style declares its bands`,
    `in \`tokens.json\` / \`capabilities.proof\`; this tool measures the gap.`,
    ``,
  ].join("\n");
}

async function pairSheet(refDir: string, specDir: string, out: string): Promise<string | null> {
  const refs = readdirSync(refDir).filter((name) => IMAGE.test(name)).sort().map((name) => join(refDir, name));
  const specs = readdirSync(specDir).filter((name) => IMAGE.test(name)).sort().map((name) => join(specDir, name));
  const count = Math.min(refs.length, specs.length);
  if (count === 0) return null;
  const pairs: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const pair = join(out, `pair-${String(index + 1).padStart(3, "0")}.png`);
    await runBinary(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", refs[index] as string, "-i", specs[index] as string,
      "-filter_complex",
      "[0:v]scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2:color=0x101010[a];" +
        "[1:v]scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2:color=0x101010[b];[a][b]hstack",
      "-frames:v", "1", pair,
    ], { cwd: root });
    pairs.push(pair);
  }
  const sheet = join(out, "pairs.png");
  await renderGrid({
    root,
    out: sheet,
    tiles: pairs.map((image) => ({ image })),
    tileWidth: 640,
    tileHeight: 180,
    // No labels, so no font: the engine must not name a style's font here.
    font: "",
    cols: 1,
    labelDir: "build/style-measure/labels",
  });
  return sheet;
}

async function main(): Promise<void> {
  const ref = arg("ref");
  const spec = arg("specimen");
  const score = arg("score");
  const camera = process.argv.includes("--camera");
  const json = process.argv.includes("--json");
  const sheets = process.argv.includes("--sheets");
  if (!ref) {
    console.error("usage: npm run style:measure -- --ref <dir|video> [--specimen <dir|video>] [--score <score.json>] [--out build/style-measure] [--sheets] [--camera] [--json]");
    process.exit(2);
  }
  const out = resolve(root, arg("out") ?? "build/style-measure");
  mkdirSync(out, { recursive: true });

  const reference = await measure(resolve(root, ref), out, sheets, score ? resolve(root, score) : undefined, camera, "reference");
  const bibleDoc = bible(reference);
  writeFileSync(join(out, "bible.json"), `${JSON.stringify(reference, null, 2)}\n`, "utf8");
  writeFileSync(join(out, "STYLE-BIBLE.md"), `${bibleDoc}\n`, "utf8");

  if (!spec) {
    if (json) console.log(JSON.stringify(reference, null, 2));
    else {
      console.log(`style:measure: ${reference.kind} · ${reference.format.frames} frame(s) · ${reference.format.aspect} · ${reference.format.width}x${reference.format.height}`);
      console.log(
        `  luma ${reference.luma.mean.toFixed(1)} · contrast ${reference.contrast.mean.toFixed(1)} · ` +
          `saturation ${reference.saturation.mean.toFixed(1)} · edges ${reference.edges?.mean.toFixed(1) ?? "—"}`,
      );
      if (reference.shots) {
        console.log(
          `  shots ${reference.shots.count} · median ${reference.shots.median}s · cuts/min ${reference.cuts?.perMinute} · ` +
            `movement ${reference.movement?.mean.toFixed(2) ?? "-"}`,
        );
      }
      if (reference.camera) {
        const row = metricRow(reference);
        console.log(
          `  camera |dx| ${row.cameraDx} px/shot · |dy| ${row.cameraDy} px/shot · ` +
            `dz ${row.cameraDz} %/shot · moving ${(reference.camera.movingShare * 100).toFixed(0)}%`,
        );
      }
      console.log(`  palette ${reference.palette.join(" ")}`);
      console.log(`bible: ${join(out, "STYLE-BIBLE.md")}`);
    }
    return;
  }

  const specimenPath = resolve(root, spec);
  const specimenIsVideo = statSync(specimenPath).isFile() && VIDEO.test(specimenPath);
  const specimen = await measure(specimenPath, out, false, undefined, camera && specimenIsVideo, "specimen");
  const delta = compareMetrics(reference, specimen);
  const match = { reference, specimen, delta };
  writeFileSync(join(out, "match.json"), `${JSON.stringify(match, null, 2)}\n`, "utf8");
  writeFileSync(join(out, "MATCH.md"), `${matchReport(reference, specimen)}\n`, "utf8");

  let sheet: string | null = null;
  try {
    if (reference.kind === "frames" && specimen.kind === "frames") {
      sheet = await pairSheet(resolve(root, ref), resolve(root, spec), out);
    }
  } catch (error) {
    console.error(`warning: no pair sheet — ${error instanceof Error ? error.message : "unknown"}`);
  }

  if (json) console.log(JSON.stringify(match, null, 2));
  else {
    console.log(`style:measure: reference ${reference.kind} · specimen ${specimen.kind}`);
    console.log(
      `  luma ${reference.luma.mean.toFixed(1)} → ${specimen.luma.mean.toFixed(1)} (${delta.luma! >= 0 ? "+" : ""}${delta.luma}) · ` +
        `saturation ${reference.saturation.mean.toFixed(1)} → ${specimen.saturation.mean.toFixed(1)} (${delta.saturation! >= 0 ? "+" : ""}${delta.saturation})`,
    );
    console.log(
      `  contrast ${reference.contrast.mean.toFixed(1)} → ${specimen.contrast.mean.toFixed(1)} (${delta.contrast! >= 0 ? "+" : ""}${delta.contrast}) · ` +
        `edges ${reference.edges?.mean.toFixed(1) ?? "—"} → ${specimen.edges?.mean.toFixed(1) ?? "—"} (${delta.edges ?? "—"})`,
    );
    console.log(`  match: ${join(out, "MATCH.md")}${sheet ? ` · sheet ${sheet}` : ""}`);
  }
}

main().catch((error: unknown) => {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
