/**
 * Frame audit for a rendered film.
 *
 * Reads the MP4 (the actual delivered artifact), checks every frame for
 * blank/black, verifies the frame count, finds scene cuts and reports holds.
 *
 * usage: npm run audit:frames -- films/understudy/score.json
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { readRenderManifest } from "../src/engine/manifest.js";
import { findFfmpeg, videoStreamHash } from "../src/engine/video.js";

type Score = {
  id: string;
  style?: string;
  duration: number;
  fps?: number;
  shots: { id: string; start?: number; duration: number }[];
  cast?: { character: string; poses?: string; rig?: string }[];
};

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function findBinary(names: string[], env: string): string {
  const fromEnv = process.env[env];
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const roots = [
    join(process.cwd(), "node_modules", "ffmpeg-static"),
    join(process.cwd(), "..", "node_modules", "ffmpeg-static"),
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "win32", "x64"),
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "linux", "x64"),
    join(process.cwd(), "node_modules", "ffprobe-static", "bin", "darwin", "x64"),
  ];
  for (const root of roots) {
    for (const name of names) {
      const candidate = join(root, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return names[0] ?? "ffmpeg";
}

function run(binary: string, args: string[]): Promise<string> {
  return new Promise((done, fail) => {
    const child = spawn(binary, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      out += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) done(out + err);
      else fail(new Error(`${binary} exited ${code}\n${err.slice(-1200)}`));
    });
  });
}

function parseSignalStats(output: string): { frame: number; time: number; yavg: number }[] {
  const values: { frame: number; time: number; yavg: number }[] = [];
  let frame = -1;
  let time = -1;
  for (const line of output.split(/\r?\n/)) {
    const frameMatch = /^frame:(\d+)\s+pts:\S+\s+pts_time:([\d.]+)/.exec(line.trim());
    if (frameMatch) {
      frame = Number(frameMatch[1]);
      time = Number(frameMatch[2]);
      continue;
    }
    const avgMatch = /lavfi\.signalstats\.YAVG=([\d.]+)/.exec(line);
    if (avgMatch && frame >= 0) {
      values.push({ frame, time, yavg: Number(avgMatch[1]) });
    }
  }
  return values;
}

function parseCuts(output: string): number[] {
  const cuts: number[] = [];
  for (const match of output.matchAll(/pts_time:([\d.]+)/g)) {
    const time = Number(match[1]);
    if (Number.isFinite(time) && !cuts.some((value) => Math.abs(value - time) < 1e-4)) {
      cuts.push(time);
    }
  }
  return cuts.sort((a, b) => a - b);
}

async function main(): Promise<void> {
  const scorePath = process.argv[2];
  if (!scorePath || scorePath.startsWith("--")) {
    console.error("usage: npm run audit:frames -- <score.json> [--video <mp4>]");
    process.exit(2);
  }

  const root = process.cwd();
  const score = JSON.parse(await readFile(resolve(root, scorePath), "utf8")) as Score;
  const fps = Number(score.fps ?? 30);
  const expectedFrames = Math.round(score.duration * fps);
  const video = resolve(root, arg("video") ?? join("films", score.id, `${score.id}.mp4`));
  if (!existsSync(video)) throw new Error(`video not found: ${video}`);

  const ffmpeg = findBinary(["ffmpeg.exe", "ffmpeg"], "FFMPEG_PATH");
  const ffprobe = findBinary(["ffprobe.exe", "ffprobe"], "FFPROBE_PATH");

  const frameCount = Number(
    (await run(ffprobe, [
      "-v",
      "error",
      "-count_frames",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=nb_read_frames",
      "-of",
      "csv=p=0",
      video,
    ])).trim(),
  );

  const stats = parseSignalStats(
    await run(ffmpeg, [
      "-hide_banner",
      "-i",
      video,
      "-vf",
      "signalstats,metadata=print:file=-",
      "-an",
      "-f",
      "null",
      "-",
    ]),
  );

  const blank = stats.filter((entry) => entry.yavg < 8 || entry.yavg > 247);
  const minAvg = Math.min(...stats.map((entry) => entry.yavg));
  const maxAvg = Math.max(...stats.map((entry) => entry.yavg));

  const cutOutput = await run(ffmpeg, [
    "-hide_banner",
    "-i",
    video,
    "-vf",
    "select='gt(scene,0.03)',showinfo",
    "-an",
    "-f",
    "null",
    "-",
  ]).catch((error: Error) => error.message);
  const cuts = parseCuts(cutOutput);

  const expectedCuts: number[] = [];
  let shotStart = 0;
  for (const shot of score.shots) {
    if (shotStart > 0) expectedCuts.push(Number(shotStart.toFixed(6)));
    shotStart += shot.duration;
  }
  const cutTolerance = 1.5 / fps;
  const missedCuts = expectedCuts.filter(
    (expected) => !cuts.some((actual) => Math.abs(actual - expected) <= cutTolerance),
  );

  const diffOut = await run(ffmpeg, [
    "-hide_banner",
    "-i",
    video,
    "-vf",
    "tblend=all_mode=difference,signalstats,metadata=print:file=-",
    "-an",
    "-f",
    "null",
    "-",
  ]).catch((error: Error) => error.message);
  const diff = parseSignalStats(diffOut).filter((entry) => entry.frame > 0);
  const diffs = diff.map((entry) => entry.yavg);
  const sorted = [...diffs].sort((a, b) => a - b);
  const medianDiff = sorted.length ? sorted[Math.floor(sorted.length / 2)] ?? 0 : 0;

  let runLength = 0;
  let longestRun = 0;
  let longestRunStart = 0;
  for (let index = 0; index < diffs.length; index++) {
    if ((diffs[index] ?? 0) < 0.35) {
      runLength++;
      if (runLength > longestRun) {
        longestRun = runLength;
        longestRunStart = diff[index]?.time ?? 0;
      }
    } else {
      runLength = 0;
    }
  }
  const holdThresholdFrames = Math.ceil(0.4 * fps);
  const holds = longestRun > holdThresholdFrames
    ? [{ start: Number((longestRunStart - longestRun / fps).toFixed(3)), frames: longestRun }]
    : [];

  const hash = createHash("sha256").update(await readFile(video)).digest("hex");
  // The picture's identity is its video stream, not the container: the audio is
  // re-cut at delivery, and a hash every frame audit hangs off must not move
  // when a fade does. The container hash is recorded too, because the file is
  // what ships.
  const streamHash = videoStreamHash(findFfmpeg(root), video);
  // The manifest is the **render's** claim about what it painted from, so the
  // renderer writes it (`src/engine/manifest.ts`) and this audit reads it.
  // Hashing the inputs here would describe the files as they are *now*, beside a
  // picture that may be older than them — a manifest whose every hash agrees and
  // whose central claim is unverified. When the video is not the picture the
  // manifest names, the audit fails instead of writing a new manifest that makes
  // the two agree.
  const manifest = await readRenderManifest(root, score.id);
  const manifestOk = manifest !== null && manifest.videoHash === streamHash;
  const checks = {
    frameCount: frameCount === expectedFrames,
    noBlankFrames: blank.length === 0,
    cutsOnShots: missedCuts.length === 0,
    noLongHolds: holds.length === 0,
    describedByRender: manifestOk,
  };
  const pass = Object.values(checks).every(Boolean);

  const report = {
    film: score.id,
    video,
    /** The container that was measured. */
    hash: `sha256:${hash}`,
    /** The picture that was measured. This is what the gate freezes. */
    videoHash: streamHash,
    duration: score.duration,
    fps,
    expectedFrames,
    frameCount,
    luma: { min: Number(minAvg.toFixed(2)), max: Number(maxAvg.toFixed(2)) },
    blankFrames: blank.slice(0, 20),
    blankCount: blank.length,
    cuts,
    expectedCuts,
    missedCuts,
    holds,
    diff: { median: Number(medianDiff.toFixed(3)), longestRunFrames: longestRun },
    checks,
    pass,
    // What this audit does *not* do. Palette, type safe area, rig seam and two
    // renders are separate commands now (`audit:palette`, `audit:type`,
    // `audit:rig`, `determinism:renders`); they are listed here so nobody reads
    // this file as the whole gate.
    pending: ["ASR of the mixed master (npm run asr)"],
    generatedAt: new Date().toISOString(),
  };

  const out = resolve(root, "build", score.id, "frame-audit.json");
  await mkdir(resolve(root, "build", score.id), { recursive: true });
  await writeFile(out, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`frames ${frameCount}/${expectedFrames} · luma ${minAvg.toFixed(1)}-${maxAvg.toFixed(1)}`);
  console.log(`cuts ${cuts.length} · missed ${missedCuts.length} · blank ${blank.length} · longest hold ${(longestRun / fps).toFixed(2)}s`);
  console.log(
    `render manifest: ${
      manifestOk
        ? "this picture is the one the render wrote"
        : manifest === null
          ? "MISSING — the picture was not produced by npm run render:film"
          : "MISMATCH — the render's manifest describes a different picture"
    }`,
  );
  console.log(`audit: ${out}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
