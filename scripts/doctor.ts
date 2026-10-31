/**
 * Doctor (preflight).
 *
 * Answers one question before a render: is this machine able to paint and
 * encode a film? Checks the tools the renderer needs (node, ffmpeg, ffprobe,
 * headless Chrome, the bundled fonts) and prints one verdict. A missing tool is
 * a break five seconds from now, not 150 frames in.
 *
 * `--render` adds an end-to-end smoke test: it paints one real frame through
 * the painter, so the verdict covers the whole path, not just file presence.
 *
 * usage: npm run doctor [-- --render]
 */
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { findChrome } from "../src/engine/chrome.js";

const root = process.cwd();
const wantRender = process.argv.includes("--render");

const FONTS = [
  "Anton-Regular.ttf",
  "ArchivoBlack-Regular.ttf",
  "DMMono-Regular.ttf",
  "PermanentMarker-Regular.ttf",
].map((name) => join("proofs", "s2-paper", "assets", "fonts", name));

function firstExisting(paths: (string | undefined)[]): string | undefined {
  return paths.find((value): value is string => Boolean(value) && existsSync(value as string));
}

function onPath(binary: string): boolean {
  const probe = spawnSync(binary, ["-version"], { stdio: "ignore", shell: process.platform === "win32" });
  return probe.status === 0;
}

type Check = { name: string; ok: boolean; detail: string };

function checkNode(): Check {
  const major = Number(process.versions.node.split(".")[0]);
  return {
    name: "node >= 22",
    ok: major >= 22,
    detail: `v${process.versions.node}`,
  };
}

function checkFfmpeg(): Check {
  const bundled = firstExisting([
    process.env.FFMPEG_PATH,
    join(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "node_modules", "ffmpeg-static", "ffmpeg"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    join(root, "..", "node_modules", "ffmpeg-static", "ffmpeg"),
  ]);
  if (bundled) return { name: "ffmpeg", ok: true, detail: bundled.replace(root, ".") };
  return { name: "ffmpeg", ok: onPath("ffmpeg"), detail: "bundled or on PATH" };
}

function checkFfprobe(): Check {
  const bundled = firstExisting([
    process.env.FFPROBE_PATH,
    join(root, "node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe"),
    join(root, "node_modules", "ffprobe-static", "bin", "darwin", "x64", "ffprobe"),
    join(root, "node_modules", "ffprobe-static", "bin", "linux", "x64", "ffprobe"),
  ]);
  if (bundled) return { name: "ffprobe", ok: true, detail: bundled.replace(root, ".") };
  return { name: "ffprobe", ok: onPath("ffprobe"), detail: "bundled or on PATH" };
}

function checkChrome(): Check {
  const found = findChrome();
  return { name: "headless chrome", ok: Boolean(found), detail: found ?? "set CHROME_PATH" };
}

function checkFonts(): Check {
  const missing = FONTS.filter((font) => !existsSync(resolve(root, font)));
  return {
    name: "bundled fonts",
    ok: missing.length === 0,
    detail: missing.length === 0 ? `${FONTS.length} present` : `missing ${missing.join(", ")}`,
  };
}

function checkRender(): Check {
  const smoke = join("build", "doctor", "smoke");
  const result = spawnSync(
    process.execPath,
    [
      "--import", "tsx", "scripts/render-film.ts", "films/understudy/score.json",
      "--stills", "1", "--out-dir", smoke,
    ],
    { cwd: root, stdio: "ignore" },
  );
  const ok = result.status === 0 && existsSync(resolve(root, smoke, "t-01.00.png"));
  return { name: "render smoke test", ok, detail: ok ? "painted one frame end to end" : "render-film failed; run it directly" };
}

const checks: Check[] = [checkNode(), checkFfmpeg(), checkFfprobe(), checkChrome(), checkFonts()];
if (wantRender) checks.push(checkRender());

const width = Math.max(...checks.map((entry) => entry.name.length));
for (const entry of checks) {
  console.log(`${entry.ok ? "ok  " : "FAIL"} ${entry.name.padEnd(width)}  ${entry.detail}`);
}

const failed = checks.filter((entry) => !entry.ok);
if (failed.length > 0) {
  console.log(`doctor: ${failed.length} check(s) failed — fix these before rendering`);
  process.exit(1);
}
console.log(`doctor: READY — ${checks.length}/${checks.length} checks pass`);
