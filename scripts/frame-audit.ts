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

type Score = {
  id: string;
  duration: number;
  fps?: number;
  shots: { id: string; start?: number; duration: number }[];
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
  const hashFile = async (path: string): Promise<string | null> => {
    if (!existsSync(path)) return null;
    return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}`;
  };
  const filmDir = resolve(root, "films", score.id);
  const vendorFiles = ["characters.js", "core.js", "props.js", "scene_kit.js", "type.js", "gsap.min.js"];
  const vendor = Object.fromEntries(
    await Promise.all(
      vendorFiles.map(async (name) => [name, await hashFile(join(filmDir, "vendor", name))] as const),
    ),
  );
  const inputs = {
    score: await hashFile(resolve(root, scorePath)),
    scoreData: await hashFile(join(filmDir, "score-data.js")),
    backend: await hashFile(join(filmDir, "backend.js")),
    painter: await hashFile(join(filmDir, "painter.js")),
    index: await hashFile(join(filmDir, "index.html")),
    captions: await hashFile(join(filmDir, "captions.srt")),
    vendor,
  };
  const audioPath = arg("audio");
  const audioHash = audioPath ? await hashFile(resolve(root, audioPath)) : null;
  const manifest = {
    film: score.id,
    renderer: "scripts/render-film.ts",
    command: `npm run render:film -- ${scorePath}`,
    duration: score.duration,
    fps,
    frames: expectedFrames,
    video,
    videoHash: `sha256:${hash}`,
    audio: audioPath ? { path: audioPath, hash: audioHash } : null,
    inputs,
  };
  await writeFile(resolve(root, "build", score.id, "render-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  const checks = {
    frameCount: frameCount === expectedFrames,
    noBlankFrames: blank.length === 0,
    cutsOnShots: missedCuts.length === 0,
    noLongHolds: holds.length === 0,
  };
  const pass = Object.values(checks).every(Boolean);

  const report = {
    film: score.id,
    video,
    hash: `sha256:${hash}`,
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
    pending: [
      "clipping / palette / type-safe-area / rig-seam checks are not mechanical yet",
      "ASR of the mixed master",
      "two-render frame-hash comparison",
    ],
    generatedAt: new Date().toISOString(),
  };

  const out = resolve(root, "build", score.id, "frame-audit.json");
  await mkdir(resolve(root, "build", score.id), { recursive: true });
  await writeFile(out, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`frames ${frameCount}/${expectedFrames} · luma ${minAvg.toFixed(1)}-${maxAvg.toFixed(1)}`);
  console.log(`cuts ${cuts.length} · missed ${missedCuts.length} · blank ${blank.length} · longest hold ${(longestRun / fps).toFixed(2)}s`);
  console.log(`audit: ${out}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
