/**
 * Motion audit: does every shot move?
 *
 * Measures the mean absolute difference between consecutive frames inside each
 * shot of the delivered MP4. A slideshow shot sits near 0.2; a shot with a
 * character action sits well above the floor. This turns "no dead middles" from
 * an opinion into a number per shot.
 *
 * usage: npm run audit:motion -- films/understudy/score.json [--video <mp4>] [--floor 0.6]
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

async function main(): Promise<void> {
  const scorePath = process.argv[2];
  if (!scorePath || scorePath.startsWith("--")) {
    console.error("usage: npm run audit:motion -- <score.json> [--video <mp4>] [--floor 0.6]");
    process.exit(2);
  }

  const root = process.cwd();
  const score = JSON.parse(await readFile(resolve(root, scorePath), "utf8")) as Score;
  const fps = Number(score.fps ?? 30);
  const floor = Number(arg("floor") ?? 0.6);
  const video = resolve(root, arg("video") ?? join("films", score.id, `${score.id}.mp4`));
  if (!existsSync(video)) throw new Error(`video not found: ${video}`);
  const ffmpeg = findFfmpeg();

  const shots: {
    id: string;
    start: number;
    duration: number;
    frames: number;
    median: number;
    mean: number;
    max: number;
    deadSeconds: number;
  }[] = [];

  let start = 0;
  for (const [index, shot] of score.shots.entries()) {
    const from = shot.start ?? start;
    start = from + shot.duration;
    const shotId = shot.id ?? `s${String(index + 1).padStart(2, "0")}`;
    const out = await run(ffmpeg, [
      "-hide_banner",
      "-ss",
      from.toFixed(3),
      "-t",
      shot.duration.toFixed(3),
      "-i",
      video,
      "-vf",
      "tblend=all_mode=difference,signalstats,metadata=print:file=-",
      "-an",
      "-f",
      "null",
      "-",
    ]);
    const values = [...out.matchAll(/lavfi\.signalstats\.YAVG=([\d.]+)/g)].map((match) => Number(match[1]));
    const diffs = values.slice(1);
    if (diffs.length === 0) throw new Error(`no frame differences measured for ${shotId}`);
    const sorted = [...diffs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
    const mean = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
    const max = sorted[sorted.length - 1] ?? 0;
    // A dead stretch is a run of frames below a tenth of the floor.
    let streak = 0;
    let longest = 0;
    for (const value of diffs) {
      if (value < floor / 10) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 0;
      }
    }
    shots.push({
      id: shotId,
      start: Number(from.toFixed(2)),
      duration: Number(shot.duration.toFixed(2)),
      frames: diffs.length,
      median: Number(median.toFixed(3)),
      mean: Number(mean.toFixed(3)),
      max: Number(max.toFixed(2)),
      deadSeconds: Number((longest / fps).toFixed(2)),
    });
  }

  const weak = shots.filter((shot) => shot.median < floor);
  const pass = weak.length === 0;
  // Tie the measurement to the exact video it measured, so gate 7 knows this
  // report describes the frozen file and not a stale render.
  const videoHash = `sha256:${createHash("sha256").update(await readFile(video)).digest("hex")}`;

  await mkdir(join(root, "build", score.id), { recursive: true });
  const reportPath = join(root, "build", score.id, "motion-audit.json");
  await writeFile(
    reportPath,
    JSON.stringify(
      { film: score.id, video, videoHash, floor, shots, weak: weak.map((shot) => shot.id), pass },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  for (const shot of shots) {
    console.log(
      `  ${shot.median < floor ? "WEAK" : "ok  "} ${shot.id} ${shot.start}s ${shot.duration}s · median ${shot.median} · max ${shot.max} · dead ${shot.deadSeconds}s`,
    );
  }
  console.log(`motion: floor ${floor} · ${shots.length - weak.length}/${shots.length} shots above the floor · ${pass ? "pass" : "FAIL"}`);
  console.log(`report: ${reportPath}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
