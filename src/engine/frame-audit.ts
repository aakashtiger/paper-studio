/**
 * The time grid of a per-shot measurement (decision 0034).
 *
 * The frame audit decodes each shot separately, which costs about a third of one
 * whole-film pass for the same frames, and the measured values were proved
 * identical before the change. Splitting a decode is only safe if the split puts
 * every sample back on the film's own clock, so that mapping is one pure
 * function with tests, not arithmetic buried in a script:
 *
 *   - frame `i` of a shot is at `from + i / fps`;
 *   - `tblend` emits one fewer difference than frames, and its sample `i` is the
 *     difference between frame `i` and frame `i+1` — so it belongs to the frame
 *     at `from + (i + 1) / fps`. A shot's first frame has no difference inside
 *     its own segment; that is the diff across a cut, which is not a hold.
 */

/** Rounded to milliseconds: the renderer's own grid is finer, and a report is read, not re-encoded. */
function clock(time: number): number {
  return Math.round(time * 1000) / 1000;
}

/**
 * A frame with nothing on it.
 *
 * The old rule was `YAVG < 8 || YAVG > 247`, which cannot fire on ordinary SDR
 * video: legal-range black is Y=16 and legal-range white is Y=235 (measured on a
 * synthetic black clip: YMIN = YAVG = YMAX = 16). The check was a guarantee that
 * could never fail — the worst kind of gate row.
 *
 * The rule now judges the video's own range (16/235 limited, 0/255 full) and
 * requires the frame to be *uniform*, so a dark night scene with a lit window is
 * not mistaken for a blank frame: its average may sit near black, but its
 * spread does not.
 */
export const BLANK_BLACK = 18;
export const BLANK_WHITE = 233;
export const BLANK_SPREAD = 6;

export function isBlankFrame(frame: { yavg: number; ymin: number; ymax: number }): boolean {
  const atAnEnd = frame.yavg <= BLANK_BLACK || frame.yavg >= BLANK_WHITE;
  return atAnEnd && frame.ymax - frame.ymin <= BLANK_SPREAD;
}

/** The film times of `count` decoded frames starting at a shot's first frame. */
export function frameTimes(from: number, count: number, fps: number): number[] {
  if (!(fps > 0)) throw new Error(`fps must be positive, got ${fps}`);
  if (!Number.isInteger(count) || count < 0) throw new Error(`count must be a whole number, got ${count}`);
  return Array.from({ length: count }, (_, index) => clock(from + index / fps));
}

/** The film times of the `count` frame-to-frame differences a `tblend` pass emits. */
export function diffTimes(from: number, count: number, fps: number): number[] {
  if (!(fps > 0)) throw new Error(`fps must be positive, got ${fps}`);
  if (!Number.isInteger(count) || count < 0) throw new Error(`count must be a whole number, got ${count}`);
  // The exact expression, not a rounded frame time plus a frame: rounding twice
  // can move a millisecond at a boundary.
  return Array.from({ length: count }, (_, index) => clock(from + (index + 1) / fps));
}
