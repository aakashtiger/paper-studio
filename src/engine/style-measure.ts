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
  shots: { count: number; median: number; min: number; max: number } | null;
  palette: string[];
};

const round = (value: number) => Number(value.toFixed(4));

/** A compact, stable view of the metrics, for a report or a comparison. */
export function metricRow(metrics: StyleMetrics): Record<string, number | string | null> {
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
    // A palette is not a scalar: this is the mean distance from each reference
    // colour to its nearest specimen colour, 0-441. It is not a delta.
    palette: round(paletteDistance(ref.palette, spec.palette)),
  };
}
