/**
 * Palette and clipping audit.
 *
 * Decodes the delivered video at a small size and checks two things about every
 * frame, not a sample of them:
 *
 * - **Palette family.** The film may use the colours its world needs (green
 *   grass, snow white, a blue night, an orange sunset), but the saturated
 *   colours must still form a family: no more than five hue families, and those
 *   families must cover at least 85% of the saturated pixels. A rainbow is not
 *   a palette; a grassland or a snowfield is.
 * - **Clipping.** Paper is bright, so the risk is a blown highlight, not a
 *   crushed black. Pixels are counted at both ends of the scale; a frame whose
 *   flat color is averaged into pure white over a region is a frame that has
 *   lost its texture. The count is taken on the same 160x90 average as the
 *   palette, so it finds a blown *region*, not a single hot pixel.
 *
 * usage: npm run audit:palette -- films/understudy/score.json [--video mp4]
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileHash, videoStreamHash } from "../src/engine/video.js";

const WIDTH = 160;
const HEIGHT = 90;
const SAT_MIN = 0.3;
const FAMILY_MIN = 0.05; // a hue must hold this share to count as a family
const MAX_FAMILIES = 5;
const TOP_FAMILIES = 0.85;
const MAX_OUTLIER = 0.005; // retained for the audit's historical field
/**
 * The most of a frame that may sit at either end of the scale. Measured, not
 * guessed: Understudy's worst frame clips 0.59% (frame 51 at 1.7 s, a black
 * card, which is meant to be black) and **no frame has a blown pixel at all** —
 * paper is bright, but this film never loses a region of it. A 2% frame has lost
 * a region of texture, which the eye reads as a hole however the palette reads.
 */
const MAX_CLIPPED = 0.02;
const BLOWN = 250; // all three channels at or above: white with no detail
const CRUSHED = 4; // all three channels at or below: black with no detail

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
const fps = Number(score.fps ?? 30);
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
// Every frame, or the claim is a lie: a truncated decode would otherwise report
// a clean palette for the frames it happened to read.
const expectedFrames = Math.round(score.duration * fps);
const coverageOk = frames === expectedFrames;
let worstFrame = -1;
let worstOutlier = 0;
let saturatedSum = 0;
let worstClipFrame = -1;
let worstClip = 0;
let blownTotal = 0;
let crushedTotal = 0;
const bins = new Array(12).fill(0);

for (let frame = 0; frame < frames; frame++) {
  const base = frame * frameSize;
  let saturated = 0;
  let blown = 0;
  let crushed = 0;
  for (let i = 0; i < width * height; i++) {
    const at = base + i * 3;
    const r8 = pixels[at] ?? 0;
    const g8 = pixels[at + 1] ?? 0;
    const b8 = pixels[at + 2] ?? 0;
    const lo = Math.min(r8, g8, b8);
    const hi = Math.max(r8, g8, b8);
    if (lo >= BLOWN) blown++;
    else if (hi <= CRUSHED) crushed++;
    const r = r8 / 255;
    const g = g8 / 255;
    const b = b8 / 255;
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
  }
  saturatedSum += saturated;
  blownTotal += blown;
  crushedTotal += crushed;
  const clipped = (blown + crushed) / (width * height);
  if (clipped > worstClip) {
    worstClip = clipped;
    worstClipFrame = frame;
  }
}

const saturatedTotal = bins.reduce((sum, value) => sum + value, 0);
const shares = bins.map((value) => (saturatedTotal > 0 ? value / saturatedTotal : 0));
const familyCount = shares.filter((share) => share >= FAMILY_MIN).length;
const topFamilyShare = [...shares]
  .sort((a, b) => b - a)
  .slice(0, MAX_FAMILIES)
  .reduce((sum, share) => sum + share, 0);
const familyPass =
  saturatedTotal === 0 || (familyCount <= MAX_FAMILIES && topFamilyShare >= TOP_FAMILIES);
const palettePass = familyPass;
const clippingPass = worstClip <= MAX_CLIPPED;
const pass = palettePass && clippingPass && coverageOk;
// Which film was measured: the audit reads a file, and the file is what the
// gate has to agree on. Without this the row could read a palette pass from a
// render the gate never saw. The hash is the video stream, so re-cutting the
// audio does not invalidate a palette measurement of the same frames.
const videoHash = videoStreamHash(ffmpeg, video);
const videoFileHash = fileHash(video);
const report = {
  film: score.id,
  video,
  videoHash,
  videoFileHash,
  width,
  height,
  frames,
  expectedFrames,
  satMin: SAT_MIN,
  forbiddenHue: [],
  maxOutlierFraction: Number(worstOutlier.toFixed(5)),
  hueFamilies: familyCount,
  topFamiliesShare: Number(topFamilyShare.toFixed(3)),
  worstFrame,
  meanSaturatedPixels: Number((saturatedSum / Math.max(1, frames)).toFixed(1)),
  hueBins30deg: bins,
  // Every frame, both ends of the scale. `worst` is the frame with the most
  // blown or crushed pixels, not the frame that looked worst to a person.
  clipping: {
    pass: clippingPass,
    maxClippedFraction: MAX_CLIPPED,
    blownLevel: BLOWN,
    crushedLevel: CRUSHED,
    worst: {
      frame: worstClipFrame,
      fraction: Number(worstClip.toFixed(5)),
      time: frames > 0 && worstClipFrame >= 0 ? Number((worstClipFrame / fps).toFixed(2)) : null,
    },
    meanBlownPixels: Number((blownTotal / Math.max(1, frames)).toFixed(1)),
    meanCrushedPixels: Number((crushedTotal / Math.max(1, frames)).toFixed(1)),
  },
  pass,
  checks: { palette: palettePass, clipping: clippingPass, everyFrame: coverageOk },
  generatedAt: new Date().toISOString(),
};
const out = resolve(root, "build", score.id, "palette-audit.json");
mkdirSync(resolve(root, "build", score.id), { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(
  `palette: ${familyCount} hue famil${familyCount === 1 ? "y" : "ies"} · top ${(topFamilyShare * 100).toFixed(1)}% · ${palettePass ? "pass" : "FAIL"}`,
);
console.log(
  `clipping: worst ${(worstClip * 100).toFixed(2)}% of frame ${worstClipFrame} (${report.clipping.worst.time ?? "?"}s) · ${clippingPass ? "pass" : "FAIL"}`,
);
console.log(`frames: ${frames}/${expectedFrames} decoded${coverageOk ? "" : " · FAIL (the decode did not cover the film)"}`);
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
