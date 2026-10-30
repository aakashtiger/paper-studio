/**
 * Paint-match audit: proves the delivered MP4 frames are the frames the
 * painter actually draws.
 *
 * For a sample of times it paints the composition (same path as the renderer's
 * `--stills`), extracts the MP4 frame at the same time and compares them with
 * PSNR. A correct frame survives H.264 at ~40 dB; a wrong frame lands near
 * 10-20 dB. This is the check that catches "the video does not match the
 * drawing code" — which luma/cut audits cannot see.
 *
 * usage: npm run audit:paint -- films/understudy/score.json [--video <mp4>]
 *                              [--step 1] [--min 30]
 */
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

type Score = { id: string; duration: number; fps?: number };

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
    console.error("usage: npm run audit:paint -- <score.json> [--video <mp4>] [--step 1] [--min 30]");
    process.exit(2);
  }

  const root = process.cwd();
  const score = JSON.parse(await readFile(resolve(root, scorePath), "utf8")) as Score;
  const fps = Number(score.fps ?? 30);
  const step = Math.max(0.25, Number(arg("step") ?? 1));
  const minPsnr = Number(arg("min") ?? 30);
  const video = resolve(root, arg("video") ?? join("films", score.id, `${score.id}.mp4`));
  if (!existsSync(video)) throw new Error(`video not found: ${video}`);

  const times: number[] = [];
  for (let time = 0; time < score.duration; time += step) times.push(Number(time.toFixed(3)));
  const last = Number((score.duration - 1 / fps).toFixed(3));
  if (!times.includes(last)) times.push(last);

  const ffmpeg = findFfmpeg();
  const work = await mkdtemp(join(tmpdir(), "paper-paint-"));
  try {
    const painted = join(work, "painted");
    await mkdir(painted, { recursive: true });
    const stills = times.map((time) => time.toFixed(2)).join(",");
    await run(process.execPath, [
      "--import",
      "tsx",
      join("scripts", "render-film.ts"),
      scorePath,
      "--stills",
      stills,
      "--out-dir",
      painted,
    ]);

    const rows: { time: number; psnr: number }[] = [];
    const lastFrameTime = (Math.round(score.duration * fps) - 1) / fps;
    for (const time of times) {
      const paintedFile = join(painted, `t-${time.toFixed(2).padStart(5, "0")}.png`);
      if (!existsSync(paintedFile)) throw new Error(`painter produced no still for ${time}s`);
      const decoded = join(work, `mp4-${time.toFixed(2)}.png`);
      const seek = Math.min(time, lastFrameTime);
      await run(ffmpeg, ["-y", "-loglevel", "error", "-ss", seek.toFixed(6), "-i", video, "-frames:v", "1", decoded]);
      const out = await run(ffmpeg, [
        "-hide_banner",
        "-i",
        paintedFile,
        "-i",
        decoded,
        "-lavfi",
        "[0:v][1:v]psnr",
        "-f",
        "null",
        "-",
      ]);
      const match = /average:([\d.]+)/.exec(out);
      if (!match) throw new Error(`psnr failed at ${time}s\n${out.slice(-600)}`);
      rows.push({ time, psnr: Number(match[1]) });
    }

    const worst = rows.reduce((low, row) => (row.psnr < low.psnr ? row : low), rows[0]!);
    const below = rows.filter((row) => row.psnr < minPsnr);
    const pass = below.length === 0;

    await mkdir(join(root, "build", score.id), { recursive: true });
    const reportPath = join(root, "build", score.id, "paint-match.json");
    const videoHash = `sha256:${createHash("sha256").update(await readFile(video)).digest("hex")}`;
    const report = {
      film: score.id,
      video,
      videoHash,
      sampled: rows.length,
      stepSeconds: step,
      minPsnr,
      worst,
      belowMin: below,
      pass,
      rows,
    };
    await (await import("node:fs/promises")).writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

    console.log(`paint-match: ${rows.length} frames · worst ${worst.psnr.toFixed(1)} dB at ${worst.time}s · min ${minPsnr} dB`);
    console.log(`report: ${reportPath}`);
    if (!pass) {
      console.error(`FAIL: ${below.length} frame(s) below ${minPsnr} dB — the video does not match the painter`);
      for (const row of below.slice(0, 12)) console.error(`  ${row.time}s -> ${row.psnr.toFixed(1)} dB`);
      process.exit(1);
    }
  } finally {
    await rm(work, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
