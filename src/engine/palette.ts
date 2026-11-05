/**
 * Palette family arithmetic, shared by the film-level and per-scene audits.
 *
 * The rule is the pack's: saturated colours must form at most five hue
 * families, and those families must cover 85% of the saturated pixels. A scene
 * is held to the same rule as the film; a family is not invented per scene.
 */

export const HUE_BINS = 12;
export const SAT_MIN = 0.3;
export const DELTA_MIN = 0.08;

export type PalettePolicy = {
  maxHueFamilies: number;
  minFamilyShare: number;
  topFamiliesShare: number;
};

export const PALETTE_POLICY: PalettePolicy = {
  maxHueFamilies: 5,
  minFamilyShare: 0.05,
  topFamiliesShare: 0.85,
};

/** The 30-degree hue bin for a saturated pixel, or null for grey/paper. */
export function hueBin(r8: number, g8: number, b8: number): number | null {
  const r = r8 / 255;
  const g = g8 / 255;
  const b = b8 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const sat = max === 0 ? 0 : delta / max;
  if (sat < SAT_MIN || delta < DELTA_MIN) return null;
  let hue = 0;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  if (hue < 0) hue += 360;
  return Math.min(HUE_BINS - 1, Math.floor(hue / 30));
}

export type HueFamilyStats = {
  saturatedPixels: number;
  measured: boolean;
  hueFamilies: number;
  topFamiliesShare: number;
  pass: boolean;
};

export function hueFamilyStats(
  bins: readonly number[],
  policy: PalettePolicy = PALETTE_POLICY,
): HueFamilyStats {
  const saturatedPixels = bins.reduce((sum, value) => sum + value, 0);
  if (saturatedPixels === 0) {
    return { saturatedPixels: 0, measured: false, hueFamilies: 0, topFamiliesShare: 0, pass: true };
  }
  const shares = bins.map((value) => value / saturatedPixels);
  const hueFamilies = shares.filter((share) => share >= policy.minFamilyShare).length;
  const topFamiliesShare = [...shares]
    .sort((a, b) => b - a)
    .slice(0, policy.maxHueFamilies)
    .reduce((sum, share) => sum + share, 0);
  return {
    saturatedPixels,
    measured: true,
    hueFamilies,
    topFamiliesShare,
    pass: hueFamilies <= policy.maxHueFamilies && topFamiliesShare >= policy.topFamiliesShare,
  };
}

/**
 * Map each decoded frame to a scene through the score's shot spans. Half-open
 * `[from, to)` ranges mean a frame on a cut belongs to exactly one shot.
 */
export function sceneFrameMap(
  shots: readonly { duration: number; scene?: string }[],
  fps: number,
  frames: number,
): (string | null)[] {
  const map: (string | null)[] = new Array(frames).fill(null);
  let at = 0;
  for (const shot of shots) {
    const from = Math.round(at * fps);
    at += shot.duration;
    const to = Math.round(at * fps);
    const scene = shot.scene ?? null;
    for (let frame = Math.max(0, from); frame < Math.min(frames, to); frame += 1) {
      map[frame] = scene;
    }
  }
  return map;
}
