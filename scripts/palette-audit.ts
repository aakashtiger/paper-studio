/**
 * Palette audit.
 *
 * Decodes the delivered video at a small size and checks that the only
 * saturated colours on screen are the ones the paper style allows: paper,
 * ink, red, blue and a gold accent. Anything in the yellow-green to cyan
 * band (roughly 70-170 degrees of hue) is an outlier, the way the old acid
 * green was. Reports the worst frame and the saturated coverage.
 *
 * usage: npm run audit:palette -- films/understudy/score.json [--video mp4]
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const WIDTH = 160;
const HEIGHT = 90;
const SAT_MIN = 0.3;
const FORBIDDEN_MIN = 70;
const FORBIDDEN_MAX = 170;
const MAX_OUTLIER = 0.005; // 0.5% of the frame may be an edge outlier

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run audit:palette -- <score.json> [--video mp4]");
  process.exit(2);
}
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const root = process.cwd();
const score = JSON.parse(readFileSync(resolve(root, file), "utf8")) as { id: string; fps?: number; duration: number };
const video = resolve(root, arg("video") ?? resolve("films", score.id, `${score.id}.mp4`));
if (!existsSync(video)) throw new Error(`video not found: ${video}`);

const ffmpeg = findFfmpeg();
const width = Number(arg("width") ?? WIDTH);
const height = Number(arg("height") ?? HEIGHT);
const result = spawnSync(
  ffmpeg,
  ["-hide_banner", "-loglevel", "error", "-i", video, "-vf", `scale=${width}:${height}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
  { maxBuffer: 512 * 1024 * 1024 },
);
if (result.status !== 0) throw new Error(`ffmpeg exited ${result.status}`);

const pixels = new Uint8Array(result.stdout);
const frameSize = width * height * 3;
const frames = Math.floor(pixels.length / frameSize);
let worstFrame = -1;
let worstOutlier = 0;
let saturatedSum = 0;
const bins = new Array(12).fill(0);

for (let frame = 0; frame < frames; frame++) {
  const base = frame * frameSize;
  let saturated = 0;
  let forbidden = 0;
  for (let i = 0; i < width * height; i++) {
    const at = base + i * 3;
    const r = (pixels[at] ?? 0) / 255;
    const g = (pixels[at + 1] ?? 0) / 255;
    const b = (pixels[at + 2] ?? 0) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const sat = max === 0 ? 0 : delta / max;
    if (sat < SAT_MIN || delta < 0.08) continue;
    saturated++;
    let hue = 0;
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
    if (hue < 0) hue += 360;
    bins[Math.min(11, Math.floor(hue / 30))]++;
    if (hue >= FORBIDDEN_MIN && hue <= FORBIDDEN_MAX) forbidden++;
  }
  saturatedSum += saturated;
  const outlier = saturated === 0 ? 0 : forbidden / (width * height);
  if (outlier > worstOutlier) {
    worstOutlier = outlier;
    worstFrame = frame;
    void outlier;
  }
}

const pass = worstOutlier <= MAX_OUTLIER;
const report = {
  film: score.id,
  video,
  width,
  height,
  frames,
  satMin: SAT_MIN,
  forbiddenHue: [FORBIDDEN_MIN, FORBIDDEN_MAX],
  maxOutlierFraction: Number(worstOutlier.toFixed(5)),
  worstFrame,
  meanSaturatedPixels: Number((saturatedSum / Math.max(1, frames)).toFixed(1)),
  hueBins30deg: bins,
  pass,
  generatedAt: new Date().toISOString(),
};
const out = resolve(root, "build", score.id, "palette-audit.json");
mkdirSync(resolve(root, "build", score.id), { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(`palette: worst outlier ${(worstOutlier * 100).toFixed(2)}% of frame ${worstFrame} · ${pass ? "pass" : "FAIL"}`);
console.log(`audit: ${out}`);
if (!pass) process.exit(1);

function findFfmpeg(): string {
  const candidates = [
    process.env.FFMPEG_PATH,
    resolve(root, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    resolve(root, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    "ffmpeg",
  ].filter((value): value is string => Boolean(value));
  const found = candidates.find((candidate) => candidate === "ffmpeg" || existsSync(candidate));
  if (!found) throw new Error("ffmpeg not found");
  return found;
}
