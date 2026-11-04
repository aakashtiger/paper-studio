/**
 * `frame-report` - what the paint actually did.
 *
 * One sample per shot, decoded at 480x270. The subject box comes from the
 * probe's chest/head anchors and the leg IK targets (the aperture), not from a
 * score claim. The field is the largest flat colour component; bars are
 * contiguous edge columns whose dominant colour runs through the frame; local
 * contrast is the figure against a 30%-padded ring.
 *
 * This module is pure measurement. It does not decide whether the film is
 * Paper K-pop; `style-identity.ts` applies the pack's bands to this summary.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { median } from "./style-measure.js";

export type FrameSummary = {
  shots: number;
  barsLeftMax: number;
  barsRightMax: number;
  barShotShare: number;
  plateShare: number;
  centroidShare: number;
  heightSd: number;
  heightTiers: number;
  closeUpShare: number;
  localContrastShare: number;
  localContrastMedian: number;
  blueOnBlueShare: number;
  warmShare: number;
  blueShare: number;
  saturatedShare: number;
  largestFlat: number;
  meanLuma: number;
};

export type SubjectBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  character: string;
  source: "aperture";
};

export type ShotFrameReport = {
  shot: string;
  time: number;
  cast: string[];
  box: SubjectBox | null;
  bars: { left: number; right: number; plate: boolean };
  field: {
    largestFlat: number;
    fieldShare: number;
    warmShare: number;
    blueShare: number;
    saturatedShare: number;
    meanLuma: number;
  };
  contrast: {
    innerLuma: number | null;
    ringLuma: number | null;
    localLumaDelta: number;
    figureBlueShare: number;
    fieldHue: number | null;
    blueOnBlue: boolean;
  } | null;
};

export type FrameReport = {
  $schema: "paper-studio/frame-report@1";
  film: string;
  score: string;
  videoHash: string | null;
  stage: "collage" | "video";
  grid: { width: number; height: number };
  shots: ShotFrameReport[];
  summary: FrameSummary;
};

export type ProbeAnchor = {
  kind: "anchor";
  character: string;
  part: string;
  local: [number, number];
  m: [number, number, number, number, number, number];
};

export type ProbeSolve = {
  kind: "solve";
  character: string;
  target: [number, number];
  hip: [number, number];
};

export type ProbeFrame = {
  time: number;
  rigRecords: Array<ProbeAnchor | ProbeSolve | { kind: string; character?: string }>;
};

const GRID_WIDTH = 480;
const GRID_HEIGHT = 270;

function apply(m: ProbeAnchor["m"], x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/**
 * The subject aperture: chest x, head y, feet y from the leg IK targets.
 * The paper extends above the head pivot (hair, petals, halo), so the box adds
 * 28% of the core above the head and 4% below the feet. This is the aperture
 * the research measured at x .135 on the Uber film; it is a proxy, not a
 * silhouette, and the report says so.
 */
export function probeBox(
  frame: ProbeFrame | undefined,
  cast: readonly string[],
  width = 1920,
  height = 1080,
): SubjectBox | null {
  if (!frame) return null;
  const records = frame.rigRecords;
  const characters = cast.length > 0 ? cast : [...new Set(records.map((r) => r.character ?? ""))];
  for (const character of characters) {
    if (!character) continue;
    const anchors = records.filter(
      (record): record is ProbeAnchor =>
        record.kind === "anchor" && record.character === character,
    );
    const chest = anchors.find((anchor) => anchor.part === "chest");
    const head = anchors.find((anchor) => anchor.part === "head");
    if (!chest || !head) continue;
    const chestPoint = apply(chest.m, chest.local[0], chest.local[1]);
    const headPoint = apply(head.m, head.local[0], head.local[1]);
    const solves = records.filter(
      (record): record is ProbeSolve =>
        record.kind === "solve" && record.character === character,
    );
    if (solves.length === 0) continue;
    const feet = solves
      .map((solve) => apply(chest.m, solve.target[0], solve.target[1]))
      .sort((a, b) => b[1] - a[1])[0];
    if (!feet) continue;
    const core = feet[1] - headPoint[1];
    if (!(core > 0)) continue;
    const top = headPoint[1] - 0.28 * core;
    const bottom = feet[1] + 0.04 * core;
    const h = bottom - top;
    const w = h * 0.28;
    return {
      x: chestPoint[0] - w / 2,
      y: top,
      w,
      h,
      character,
      source: "aperture",
    };
  }
  return null;
}

function hsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function quantKey(r: number, g: number, b: number): number {
  return ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
}

function largestComponent(
  rgb: Uint8Array,
  width: number,
  height: number,
): { share: number; key: number } {
  const keys = new Uint16Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const p = i * 3;
    keys[i] = quantKey(rgb[p] ?? 0, rgb[p + 1] ?? 0, rgb[p + 2] ?? 0);
  }
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let best = 0;
  let bestKey = 0;
  for (let start = 0; start < keys.length; start += 1) {
    if (visited[start]) continue;
    const key = keys[start] ?? 0;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;
    let count = 0;
    while (head < tail) {
      const index = queue[head++] ?? 0;
      count += 1;
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const next = ny * width + nx;
        if (visited[next] || keys[next] !== key) continue;
        visited[next] = 1;
        queue[tail++] = next;
      }
    }
    if (count > best) {
      best = count;
      bestKey = key;
    }
  }
  return { share: best / (width * height), key: bestKey };
}

type BarRun = { width: number; key: number } | null;

function barRunFrom(
  rgb: Uint8Array,
  width: number,
  height: number,
  side: "left" | "right",
): BarRun {
  const meanColumn = (x: number): [number, number, number] => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let y = 0; y < height; y += 1) {
      const p = (y * width + x) * 3;
      r += rgb[p] ?? 0;
      g += rgb[p + 1] ?? 0;
      b += rgb[p + 2] ?? 0;
    }
    return [r / height, g / height, b / height];
  };

  let run = 0;
  let hueSum = 0;
  let hueCount = 0;
  for (let step = 0; step < width; step += 1) {
    const x = side === "left" ? step : width - 1 - step;
    const [r, g, b] = meanColumn(x);
    const [h, s, v] = hsv(r, g, b);
    if (s < 0.3 || v < 0.15) break;
    if (run === 0) {
      hueSum = 0;
      hueCount = 0;
    }
    // A bar is one saturated colour, not a rainbow. Allow a little paper
    // texture and the character standing in it.
    if (hueCount > 0) {
      const meanHue = hueSum / hueCount;
      const delta = Math.abs(((h - meanHue + 540) % 360) - 180);
      if (delta > 28) break;
    }
    hueSum += h;
    hueCount += 1;
    run += 1;
    if (run / width > 0.45) return null;
  }
  if (run / width < 0.03) return null;
  return { width: run / width, key: 0 };
}

function creamShare(
  rgb: Uint8Array,
  width: number,
  height: number,
  fromX: number,
  toX: number,
): number {
  let cream = 0;
  let total = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = fromX; x < toX; x += 1) {
      const p = (y * width + x) * 3;
      const r = rgb[p] ?? 0;
      const g = rgb[p + 1] ?? 0;
      const b = rgb[p + 2] ?? 0;
      const [, s, v] = hsv(r, g, b);
      if (s < 0.2 && v > 0.65) cream += 1;
      total += 1;
    }
  }
  return total === 0 ? 0 : cream / total;
}

export function analyzeRgb(input: {
  rgb: Uint8Array;
  width?: number;
  height?: number;
  shot: string;
  time: number;
  cast: string[];
  probe: ProbeFrame | undefined;
  boxOverride?: SubjectBox | null;
}): ShotFrameReport {
  const width = input.width ?? GRID_WIDTH;
  const height = input.height ?? GRID_HEIGHT;
  const rgb = input.rgb;
  if (rgb.length < width * height * 3) {
    throw new Error(`frame-report: expected ${width * height * 3} bytes, got ${rgb.length}`);
  }

  const largest = largestComponent(rgb, width, height);
  const left = barRunFrom(rgb, width, height, "left");
  const right = barRunFrom(rgb, width, height, "right");
  const barLeft = left?.width ?? 0;
  const barRight = right?.width ?? 0;
  const plate =
    barLeft + barRight >= 0.08 &&
    creamShare(rgb, width, height, Math.floor(barLeft * width), Math.ceil((1 - barRight) * width)) > 0.5;

  let warm = 0;
  let blue = 0;
  let saturated = 0;
  let lumaTotal = 0;
  const total = width * height;
  for (let i = 0; i < total; i += 1) {
    const p = i * 3;
    const r = rgb[p] ?? 0;
    const g = rgb[p + 1] ?? 0;
    const b = rgb[p + 2] ?? 0;
    const [h, s, v] = hsv(r, g, b);
    if ((h <= 70 || h >= 330) && s > 0.2 && v > 0.15) warm += 1;
    if (s < 0.2 && v > 0.65) warm += 1;
    if (h >= 188 && h <= 252 && s > 0.35) blue += 1;
    if (s > 0.35 && v > 0.15) saturated += 1;
    lumaTotal += luma(r, g, b);
  }

  const rawBox = input.boxOverride
    ? null
    : probeBox(input.probe, input.cast, 1920, 1080);
  const box: SubjectBox | null = input.boxOverride
    ? input.boxOverride
    : rawBox
      ? {
          ...rawBox,
          x: (rawBox.x * width) / 1920,
          y: (rawBox.y * height) / 1080,
          w: (rawBox.w * width) / 1920,
          h: (rawBox.h * height) / 1080,
        }
      : null;
  let contrast: ShotFrameReport["contrast"] = null;
  if (box) {
    const x0 = Math.max(0, Math.floor(box.x - box.w * 0.3));
    const x1 = Math.min(width, Math.ceil(box.x + box.w * 1.3));
    const y0 = Math.max(0, Math.floor(box.y - box.h * 0.3));
    const y1 = Math.min(height, Math.ceil(box.y + box.h * 1.3));
    const ix0 = Math.max(0, Math.floor(box.x));
    const ix1 = Math.min(width, Math.ceil(box.x + box.w));
    const iy0 = Math.max(0, Math.floor(box.y));
    const iy1 = Math.min(height, Math.ceil(box.y + box.h));
    let innerLuma = 0;
    let innerCount = 0;
    let innerBlue = 0;
    let ringLuma = 0;
    let ringCount = 0;
    let hueSum = 0;
    let hueCount = 0;
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const inside = x >= ix0 && x < ix1 && y >= iy0 && y < iy1;
        const p = (y * width + x) * 3;
        const r = rgb[p] ?? 0;
        const g = rgb[p + 1] ?? 0;
        const b = rgb[p + 2] ?? 0;
        const l = luma(r, g, b);
        if (inside) {
          innerLuma += l;
          innerCount += 1;
          const [h, s] = hsv(r, g, b);
          if (h >= 188 && h <= 252 && s > 0.35) innerBlue += 1;
        } else {
          ringLuma += l;
          ringCount += 1;
          const [h, s] = hsv(r, g, b);
          if (h >= 188 && h <= 252 && s > 0.35) {
            hueSum += h;
            hueCount += 1;
          }
        }
      }
    }
    const inner = innerCount > 0 ? innerLuma / innerCount : 0;
    const ring = ringCount > 0 ? ringLuma / ringCount : 0;
    const figureBlue = innerCount > 0 ? innerBlue / innerCount : 0;
    const fieldHue = hueCount > 0 ? hueSum / hueCount : null;
    const delta = Math.abs(inner - ring);
    contrast = {
      innerLuma: inner,
      ringLuma: ring,
      localLumaDelta: delta,
      figureBlueShare: figureBlue,
      fieldHue,
      blueOnBlue: figureBlue > 0.3 && fieldHue !== null && delta < 18,
    };
  }

  return {
    shot: input.shot,
    time: input.time,
    cast: input.cast,
    box,
    bars: { left: barLeft, right: barRight, plate },
    field: {
      largestFlat: largest.share,
      fieldShare: largest.share,
      warmShare: warm / total,
      blueShare: blue / total,
      saturatedShare: saturated / total,
      meanLuma: lumaTotal / total,
    },
    contrast,
  };
}

function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function summarize(shots: ShotFrameReport[]): FrameSummary {
  const count = shots.length;
  const boxes = shots.map((shot) => shot.box).filter((box): box is SubjectBox => box !== null);
  const heights = boxes.map((box) => (box.h / GRID_HEIGHT) * 100);
  const deltas = shots
    .map((shot) => shot.contrast?.localLumaDelta)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const tiers = new Set<number>();
  for (const height of heights) {
    if (height < 35) tiers.add(0);
    else if (height < 55) tiers.add(1);
    else if (height < 80) tiers.add(2);
    else tiers.add(3);
  }
  const centroidShare =
    boxes.length === 0
      ? 0
      : boxes.filter((box) => {
          const x = (box.x + box.w / 2) / GRID_WIDTH;
          return x >= 0.3 && x <= 0.75;
        }).length / boxes.length;
  const closeUpShare =
    boxes.length === 0
      ? 0
      : boxes.filter((box) => box.h / GRID_HEIGHT >= 0.55).length / boxes.length;
  const barShots = shots.filter(
    (shot) => shot.bars.left > 0.08 || shot.bars.right > 0.08,
  ).length;
  const plateShots = shots.filter((shot) => shot.bars.plate).length;
  const blueShots = shots.filter((shot) => shot.contrast?.blueOnBlue === true).length;
  return {
    shots: count,
    barsLeftMax: Math.max(0, ...shots.map((shot) => shot.bars.left)),
    barsRightMax: Math.max(0, ...shots.map((shot) => shot.bars.right)),
    barShotShare: count === 0 ? 0 : barShots / count,
    plateShare: count === 0 ? 0 : plateShots / count,
    centroidShare,
    heightSd: stddev(heights),
    heightTiers: tiers.size,
    closeUpShare,
    localContrastShare:
      deltas.length === 0 ? 0 : deltas.filter((value) => value >= 20).length / deltas.length,
    localContrastMedian: deltas.length === 0 ? 0 : (median(deltas) ?? 0),
    blueOnBlueShare: count === 0 ? 0 : blueShots / count,
    warmShare: count === 0 ? 0 : (median(shots.map((shot) => shot.field.warmShare)) ?? 0),
    blueShare: count === 0 ? 0 : (median(shots.map((shot) => shot.field.blueShare)) ?? 0),
    saturatedShare:
      count === 0 ? 0 : (median(shots.map((shot) => shot.field.saturatedShare)) ?? 0),
    largestFlat:
      count === 0 ? 0 : (median(shots.map((shot) => shot.field.largestFlat)) ?? 0),
    meanLuma: count === 0 ? 0 : (median(shots.map((shot) => shot.field.meanLuma)) ?? 0),
  };
}

export function readFrameReport(path: string): FrameReport {
  return JSON.parse(readFileSync(path, "utf8")) as FrameReport;
}

/**
 * Decode one image to the 480x270 RGB grid used by every measurement. The
 * caller passes the ffmpeg binary so tests can use a fixture without a browser.
 */
export function readRgb(
  ffmpeg: string,
  imagePath: string,
  width = GRID_WIDTH,
  height = GRID_HEIGHT,
): Uint8Array {
  const result = spawnSync(
    ffmpeg,
    [
      "-v",
      "error",
      "-i",
      imagePath,
      "-vf",
      `scale=${width}:${height}:flags=area`,
      "-frames:v",
      "1",
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgb24",
      "-",
    ],
    { maxBuffer: width * height * 3 + 1024 },
  );
  if (result.status !== 0 || result.stdout.length < width * height * 3) {
    throw new Error(
      `frame-report: could not decode ${imagePath}: ${result.stderr?.toString() ?? "no output"}`,
    );
  }
  return new Uint8Array(result.stdout.subarray(0, width * height * 3));
}

/** Decode one frame of a video at `time` to the same grid. */
export function readVideoRgb(
  ffmpeg: string,
  videoPath: string,
  time: number,
  width = GRID_WIDTH,
  height = GRID_HEIGHT,
): Uint8Array {
  const result = spawnSync(
    ffmpeg,
    [
      "-v",
      "error",
      "-ss",
      String(time),
      "-i",
      videoPath,
      "-vf",
      `scale=${width}:${height}:flags=area`,
      "-frames:v",
      "1",
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgb24",
      "-",
    ],
    { maxBuffer: width * height * 3 + 1024 },
  );
  if (result.status !== 0 || result.stdout.length < width * height * 3) {
    throw new Error(
      `frame-report: could not decode ${videoPath} at ${time}s: ${result.stderr?.toString() ?? "no output"}`,
    );
  }
  return new Uint8Array(result.stdout.subarray(0, width * height * 3));
}
