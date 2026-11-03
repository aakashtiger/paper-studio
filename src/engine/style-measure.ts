/**
 * What a style actually is, measured (decision 0036).
 *
 * The video this comes from says the quiet part out loud: "Don't ask Claude what
 * it thinks of a video. Make it measure. You can't recreate an opinion. You can
 * recreate a number." It measured 20 reference shorts — 32,000 frames — into
 * contact sheets, camera drift, cuts, brightness, contrast and saturation, and
 * then wrote the rule book from those numbers.
 *
 * The style pack already encodes a style very well (27 decisions, tokens,
 * recipes, formats, provenance, a blind protocol and a seal). What it did not
 * have is the step *before* the encoding: a repeatable measurement of the
 * reference, and a comparison of our frames against it. This module is the pure
 * half of that step. It knows nothing about paper, 3D, ink or K-pop: it knows
 * luma, contrast, saturation, edge density, movement, cuts and palettes.
 */

export type Summary = {
  n: number;
  mean: number;
  p5: number;
  p50: number;
  p95: number;
  min: number;
  max: number;
};

/** Nearest-rank percentile. `p` is 0-1; an empty list has no percentile. */
export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return Number.NaN;
  const at = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[at] as number;
}

export function summarize(values: number[]): Summary {
  if (values.length === 0) {
    return { n: 0, mean: Number.NaN, p5: Number.NaN, p50: Number.NaN, p95: Number.NaN, min: Number.NaN, max: Number.NaN };
  }
  const sum = values.reduce((total, value) => total + value, 0);
  return {
    n: values.length,
    mean: sum / values.length,
    p5: percentile(values, 0.05),
    p50: percentile(values, 0.5),
    p95: percentile(values, 0.95),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export type SignalSample = {
  frame: number;
  time: number;
  ymin: number;
  yavg: number;
  ymax: number;
  satavg: number;
  satmax: number;
  hueavg: number;
};

/**
 * Parse `signalstats,metadata=print` output.
 *
 * `YMIN/YAVG/YMAX` are luma (0-255 legal range), `SATAVG/SATMAX` saturation and
 * `HUEAVG` hue. A frame without a luma average was not measured, so it is
 * dropped rather than read as zero.
 */
export function parseSignalStats(output: string): SignalSample[] {
  const values: SignalSample[] = [];
  let current: SignalSample | null = null;
  for (const line of output.split(/\r?\n/)) {
    const frame = /^frame:(\d+)\s+pts:\S+\s+pts_time:([\d.]+)/.exec(line.trim());
    if (frame) {
      if (current) values.push(current);
      current = {
        frame: Number(frame[1]),
        time: Number(frame[2]),
        ymin: Number.NaN,
        yavg: Number.NaN,
        ymax: Number.NaN,
        satavg: Number.NaN,
        satmax: Number.NaN,
        hueavg: Number.NaN,
      };
      continue;
    }
    if (!current) continue;
    const stat = /lavfi\.signalstats\.(YMIN|YAVG|YMAX|SATAVG|SATMAX|HUEAVG)=([\d.]+)/.exec(line);
    if (stat) current[stat[1]!.toLowerCase() as keyof SignalSample] = Number(stat[2]) as never;
  }
  if (current) values.push(current);
  return values.filter((sample) => Number.isFinite(sample.yavg));
}

/**
 * The length of every shot, from the cut times and the film's duration.
 *
 * A cut at 4.0 s means the shot before it is 4.0 s long and the next begins at
 * 4.0 s. The last shot runs to the end.
 */
export function shotLengths(cuts: number[], duration: number): number[] {
  const points = [0, ...cuts.filter((time) => time > 0 && time < duration).sort((a, b) => a - b), duration];
  const lengths: number[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const length = (points[index] as number) - (points[index - 1] as number);
    if (length > 0.001) lengths.push(length);
  }
  return lengths;
}

/** The middle of a set of values; for an even count, the mean of the two middle ones. */
export function median(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

export function rgbHex(r: number, g: number, b: number): string {
  const hex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * The distinct colours in a raw RGB buffer, in order, up to `max`.
 *
 * `palettegen` writes a 16x16 image whose first pixels are the palette, padded
 * with repeats. A colour repeated inside the palette is the same colour, so it
 * is returned once.
 */
export function distinctPalette(rgb: Uint8Array | number[], max = 6): string[] {
  const out: string[] = [];
  for (let index = 0; index + 2 < rgb.length && out.length < max; index += 3) {
    const hex = rgbHex(rgb[index] as number, rgb[index + 1] as number, rgb[index + 2] as number);
    if (!out.includes(hex)) out.push(hex);
  }
  return out;
}

function hexRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}

/** Mean distance from each colour in `a` to its nearest colour in `b`, 0-441. */
export function paletteDistance(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return Number.NaN;
  const bs = b.map(hexRgb);
  let total = 0;
  for (const colour of a) {
    const [r, g, blue] = hexRgb(colour);
    let best = Number.POSITIVE_INFINITY;
    for (const [br, bg, bb] of bs) {
      const distance = Math.hypot(r - br, g - bg, blue - bb);
      if (distance < best) best = distance;
    }
    total += best;
  }
  return total / a.length;
}

/**
 * The best x/y shift between two luma frames, in the low-resolution grid.
 *
 * This is the cheap version of the video's phase correlation: brute force over a
 * small search window, minimizing the mean absolute difference of the overlap.
 * It is deliberately pure and small; the phase-correlation half the reference
 * describes is the same answer, not a different one.
 */
export function bestShift(
  previous: Uint8Array,
  next: Uint8Array,
  width: number,
  height: number,
  maxShift = 6,
): { dx: number; dy: number; sad: number } {
  let best = { dx: 0, dy: 0, sad: Number.POSITIVE_INFINITY };
  for (let dy = -maxShift; dy <= maxShift; dy += 1) {
    for (let dx = -maxShift; dx <= maxShift; dx += 1) {
      let sum = 0;
      let count = 0;
      for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) {
        for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) {
          sum += Math.abs((previous[(y + dy) * width + (x + dx)] ?? 0) - (next[y * width + x] ?? 0));
          count += 1;
        }
      }
      if (count === 0) continue;
      const sad = sum / count;
      // A flat frame is equally well aligned at every shift; prefer the
      // smallest move, or a still image would report a pan it does not have.
      const magnitude = Math.abs(dx) + Math.abs(dy);
      const bestMagnitude = Math.abs(best.dx) + Math.abs(best.dy);
      if (sad < best.sad - 1e-9 || (Math.abs(sad - best.sad) <= 1e-9 && magnitude < bestMagnitude)) {
        best = { dx, dy, sad };
      }
    }
  }
  return best;
}

/**
 * Bilinear sample of a low-resolution luma frame.
 *
 * Nearest-neighbour sampling makes a 0.5% scale step invisible at 48 px, so the
 * zoom search would return a piecewise-constant answer. Bilinear keeps the SAD
 * smooth enough to see the step.
 */
function sampleBilinear(frame: Uint8Array, width: number, height: number, x: number, y: number): number {
  const x0 = Math.max(0, Math.min(width - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(height - 1, Math.floor(y)));
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const fx = Math.max(0, Math.min(1, x - x0));
  const fy = Math.max(0, Math.min(1, y - y0));
  const v00 = frame[y0 * width + x0] ?? 0;
  const v10 = frame[y0 * width + x1] ?? 0;
  const v01 = frame[y1 * width + x0] ?? 0;
  const v11 = frame[y1 * width + x1] ?? 0;
  return (v00 * (1 - fx) + v10 * fx) * (1 - fy) + (v01 * (1 - fx) + v11 * fx) * fy;
}

/** Scale the next frame around its centre, for the zoom search. */
export function scaleFrame(frame: Uint8Array, width: number, height: number, scale: number): Uint8Array {
  const out = new Uint8Array(width * height);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      out[y * width + x] = Math.round(sampleBilinear(frame, width, height, cx + (x - cx) * scale, cy + (y - cy) * scale));
    }
  }
  return out;
}

/**
 * Joint translation and zoom.
 *
 * The first version searched translation first and zoom second. A pure push
 * was partly absorbed by a spurious translation, and a known 10% push read
 * 3.63%. This searches the zoom with the translation inside it, so the scale
 * cannot be hidden in x/y.
 */
export function bestScaleShift(
  previous: Uint8Array,
  next: Uint8Array,
  width: number,
  height: number,
  options: { maxShift?: number; dz?: number[] } = {},
): { scale: number; dx: number; dy: number; sad: number; saturated: boolean } {
  const maxShift = options.maxShift ?? 8;
  const dz = options.dz ?? Array.from({ length: 51 }, (_, index) => -25 + index);
  let best = { scale: 1, dx: 0, dy: 0, sad: Number.POSITIVE_INFINITY, saturated: false };
  for (const [index, zoom] of dz.entries()) {
    const scale = 1 + zoom / 100;
    const scaled = scaleFrame(next, width, height, scale);
    const shift = bestShift(previous, scaled, width, height, maxShift);
    const closer = Math.abs(zoom) < Math.abs((best.scale - 1) * 100);
    if (shift.sad < best.sad - 1e-9 || (Math.abs(shift.sad - best.sad) <= 1e-9 && closer)) {
      best = { scale, dx: shift.dx, dy: shift.dy, sad: shift.sad, saturated: index === 0 || index === dz.length - 1 };
    }
  }
  return best;
}

/**
 * The per-frame x/y path. Zoom is not measured here: a slow push is below the
 * per-frame resolution, and the per-shot moves measure it properly.
 *
 * The skipFrames set is cut frames; a cut is not a camera move. The path skips a
 * sample when either of its frames is a cut, so a hard cut cannot appear as a
 * 120 px pan.
 */
export function cameraPath(
  frames: Uint8Array[],
  width: number,
  height: number,
  options: { maxShift?: number; fullWidth?: number; fullHeight?: number; skipFrames?: Set<number> } = {},
): CameraSample[] {
  const maxShift = options.maxShift ?? 6;
  const fullWidth = options.fullWidth ?? width;
  const fullHeight = options.fullHeight ?? height;
  const scaleX = fullWidth / width;
  const scaleY = fullHeight / height;
  const out: CameraSample[] = [];
  for (let index = 1; index < frames.length; index += 1) {
    if (options.skipFrames?.has(index) || options.skipFrames?.has(index - 1)) continue;
    const previous = frames[index - 1] as Uint8Array;
    const next = frames[index] as Uint8Array;
    const shift = bestShift(previous, next, width, height, maxShift);
    // The search applies the shift to the previous frame; the content's movement
    // is the opposite sign. dx positive = the content moved right.
    const dx = Number((-shift.dx * scaleX).toFixed(3));
    const dy = Number((-shift.dy * scaleY).toFixed(3));
    out.push({ frame: index, dx, dy, dz: 0, sad: Number(shift.sad.toFixed(3)), speed: Number(Math.hypot(dx, dy).toFixed(3)) });
  }
  return out;
}

export function summarizeCamera(
  path: CameraSample[],
  moves: CameraMove[] = [],
  options: { source?: string; resolutionPx?: number } = {},
): CameraReport {
  const useMoves = moves.length > 0;
  const moving = useMoves
    ? moves.filter((move) => move.speed >= 1).length
    : path.filter((sample) => sample.speed >= 1).length;
  const zooming = moves.filter((move) => Math.abs(move.dz) >= 0.5).length;
  const n = Math.max(1, useMoves ? moves.length : path.length);
  return {
    source: options.source ?? "",
    resolutionPx: options.resolutionPx ?? 0,
    samples: path.length,
    dx: summarize((useMoves ? moves.map((move) => move.dx) : path.map((sample) => sample.dx))),
    dy: summarize((useMoves ? moves.map((move) => move.dy) : path.map((sample) => sample.dy))),
    dz: summarize((useMoves ? moves.map((move) => move.dz) : path.map((sample) => sample.dz))),
    speed: summarize((useMoves ? moves.map((move) => move.speed) : path.map((sample) => sample.speed))),
    movingShare: Number((moving / n).toFixed(4)),
    zoomShare: Number((zooming / n).toFixed(4)),
    path,
    pathSummary: {
      dx: summarize(path.map((sample) => sample.dx)),
      dy: summarize(path.map((sample) => sample.dy)),
      speed: summarize(path.map((sample) => sample.speed)),
    },
    moves,
  };
}

/**
 * The camera move per shot, measured end to end.
 *
 * Adjacent frames are too close to see a slow push: a 3% push over four seconds
 * is 0.025% per frame. Comparing the first and last frame of the shot gives the
 * move the viewer actually sees. x/y are full-resolution pixels over the shot;
 * z is percent over the shot, positive for a push-in.
 */
export function cameraMoves(
  frames: Uint8Array[],
  width: number,
  height: number,
  shots: { start: number; duration: number }[],
  fps: number,
  options: { maxShift?: number; fullWidth?: number; fullHeight?: number; dz?: number[] } = {},
): CameraMove[] {
  const maxShift = options.maxShift ?? 8;
  const fullWidth = options.fullWidth ?? width;
  const fullHeight = options.fullHeight ?? height;
  const scaleX = fullWidth / width;
  const scaleY = fullHeight / height;
  const out: CameraMove[] = [];
  for (const [index, shot] of shots.entries()) {
    const from = Math.max(0, Math.round(shot.start * fps));
    const to = Math.min(frames.length - 1, Math.round((shot.start + shot.duration) * fps) - 1);
    if (to <= from) continue;
    const previous = frames[from] as Uint8Array;
    const next = frames[to] as Uint8Array;
    const best = bestScaleShift(previous, next, width, height, { maxShift, dz: options.dz });
    const dx = Number((-best.dx * scaleX).toFixed(2));
    const dy = Number((-best.dy * scaleY).toFixed(2));
    const dz = Number(((best.scale - 1) * 100).toFixed(2));
    out.push({
      shot: index + 1,
      from: Number(shot.start.toFixed(3)),
      to: Number((shot.start + shot.duration).toFixed(3)),
      seconds: Number(shot.duration.toFixed(3)),
      dx,
      dy,
      dz,
      speed: Number((Math.hypot(dx, dy) / Math.max(0.001, shot.duration)).toFixed(2)),
      sad: Number(best.sad.toFixed(3)),
      saturated: best.saturated,
    });
  }
  return out;
}

export type StyleMetrics = {
  source: string;
  kind: "video" | "frames";
  format: {
    width: number;
    height: number;
    aspect: string;
    fps: number | null;
    duration: number | null;
    frames: number;
  };
  luma: Summary;
  /** Per-frame luma range (YMAX - YMIN): a simple contrast proxy. */
  contrast: Summary;
  saturation: Summary;
  /** Edge density: mean luma of an edgedetect pass, 0-255. Higher is inkier. */
  edges: Summary | null;
  /** Frame-to-frame difference, 0-255. Higher is more movement. */
  movement: Summary | null;
  cuts: { count: number; perMinute: number; times: number[] } | null;
  /** Raw scene changes. With `--score`, `cuts` is the authored shot boundary set instead. */
  sceneChanges: { count: number; perMinute: number; times: number[] } | null;
  /**
   * Camera translation and zoom, in full-resolution pixels per frame.
   *
   * `dx`/`dy` are the shift that best aligns the next frame to the previous;
   * `dz` is the zoom as a percentage per frame, positive for a push-in. This is
   * the x, y and z the video measures with phase correlation. It is only
   * computed for a video and only when `--camera` is asked for.
   */
  camera: CameraReport | null;
  shots: { count: number; median: number; min: number; max: number } | null;
  palette: string[];
};

export type CameraSample = {
  /** The frame being aligned (1-based; frame 0 has no predecessor). */
  frame: number;
  /** Full-resolution pixels. Positive x = the content moved right. */
  dx: number;
  dy: number;
  /** Percentage per frame. Positive = push-in. */
  dz: number;
  /** Mean absolute luma difference after alignment, 0-255. */
  sad: number;
  /** Translation speed in pixels per frame. */
  speed: number;
};

export type CameraReport = {
  /** The file this path was measured on. */
  source: string;
  /** Full-resolution pixels per grid cell; 48-wide grid on a 1920 film = 40 px. */
  resolutionPx: number;
  samples: number;
  dx: Summary;
  dy: Summary;
  dz: Summary;
  speed: Summary;
  /** Share of shots (or frames, without a shot list) whose translation is at least 1 px/s. */
  movingShare: number;
  /** Share of shots whose zoom is at least 0.5% over the shot. */
  zoomShare: number;
  /** The per-frame x/y path; dz is 0 here because slow zooms are measured per shot. */
  path: CameraSample[];
  /** Summaries of the per-frame path, in px/frame; not the per-shot report. */
  pathSummary: { dx: Summary; dy: Summary; speed: Summary };
  /** Per-shot translation and zoom: the move, measured end to end. */
  moves: CameraMove[];
};

export type CameraMove = {
  shot: number;
  from: number;
  to: number;
  seconds: number;
  /** Full-resolution pixels over the shot. Positive = content moved right/down. */
  dx: number;
  dy: number;
  /** Percent over the shot. Positive = push-in. */
  dz: number;
  /** Translation in full-resolution pixels per second. */
  speed: number;
  /** Mean absolute luma difference after alignment, 0-255. */
  sad: number;
  /** True when the best scale sits on the search limit; the number is a floor/ceiling. */
  saturated: boolean;
};

const round = (value: number) => Number(value.toFixed(4));

/** A compact, stable view of the metrics, for a report or a comparison. */
/** The camera move per shot when available, the per-frame path otherwise. */
export function cameraMean(metrics: StyleMetrics, key: "dx" | "dy" | "dz" | "speed"): number | null {
  const moves = metrics.camera?.moves ?? [];
  if (moves.length > 0) {
    return moves.reduce((sum, move) => sum + move[key], 0) / moves.length;
  }
  if (!metrics.camera) return null;
  return metrics.camera[key].mean;
}

/** Mean absolute translation: opposite moves should not cancel in a style report. */
export function cameraAbsMean(metrics: StyleMetrics, key: "dx" | "dy"): number | null {
  const moves = metrics.camera?.moves ?? [];
  if (moves.length > 0) {
    return moves.reduce((sum, move) => sum + Math.abs(move[key]), 0) / moves.length;
  }
  if (!metrics.camera) return null;
  return Math.abs(metrics.camera[key].mean);
}

export function metricRow(metrics: StyleMetrics): Record<string, number | string | null> {
  const cameraDx = cameraAbsMean(metrics, "dx");
  const cameraDy = cameraAbsMean(metrics, "dy");
  const cameraDz = cameraMean(metrics, "dz");
  return {
    aspect: metrics.format.aspect,
    fps: metrics.format.fps,
    duration: metrics.format.duration,
    luma: round(metrics.luma.mean),
    contrast: round(metrics.contrast.mean),
    saturation: round(metrics.saturation.mean),
    edges: metrics.edges ? round(metrics.edges.mean) : null,
    movement: metrics.movement ? round(metrics.movement.mean) : null,
    shotMedian: metrics.shots ? round(metrics.shots.median) : null,
    cutsPerMinute: metrics.cuts ? round(metrics.cuts.perMinute) : null,
    sceneChangesPerMinute: metrics.sceneChanges ? round(metrics.sceneChanges.perMinute) : null,
    cameraDx: cameraDx === null ? null : round(cameraDx),
    cameraDy: cameraDy === null ? null : round(cameraDy),
    cameraDz: cameraDz === null ? null : round(cameraDz),
    cameraMoving: metrics.camera ? round(metrics.camera.movingShare) : null,
    palette: metrics.palette.join(" "),
  };
}

/** The difference between two measurements, in the same units. */
export function compareMetrics(ref: StyleMetrics, spec: StyleMetrics): Record<string, number | null> {
  const delta = (a: number | null | undefined, b: number | null | undefined) =>
    a === null || a === undefined || b === null || b === undefined || Number.isNaN(a) || Number.isNaN(b)
      ? null
      : round(b - a);
  return {
    luma: delta(ref.luma.mean, spec.luma.mean),
    contrast: delta(ref.contrast.mean, spec.contrast.mean),
    saturation: delta(ref.saturation.mean, spec.saturation.mean),
    edges: delta(ref.edges?.mean, spec.edges?.mean),
    movement: delta(ref.movement?.mean, spec.movement?.mean),
    shotMedian: delta(ref.shots?.median, spec.shots?.median),
    cutsPerMinute: delta(ref.cuts?.perMinute, spec.cuts?.perMinute),
    cameraDx: delta(cameraAbsMean(ref, "dx"), cameraAbsMean(spec, "dx")),
    cameraDy: delta(cameraAbsMean(ref, "dy"), cameraAbsMean(spec, "dy")),
    cameraDz: delta(cameraMean(ref, "dz"), cameraMean(spec, "dz")),
    cameraSpeed: delta(cameraMean(ref, "speed"), cameraMean(spec, "speed")),
    // A palette is not a scalar: this is the mean distance from each reference
    // colour to its nearest specimen colour, 0-441. It is not a delta.
    palette: round(paletteDistance(ref.palette, spec.palette)),
  };
}
