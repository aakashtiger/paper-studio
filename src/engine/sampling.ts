/**
 * Time sampling for review sheets.
 *
 * A stills sheet samples the film at a regular interval. The rule is fixed and
 * pure so it is the same every run and can be unit-tested without painting a
 * frame: start at zero, step by `every`, and always include the last frame of
 * the film so the closing image is never the one nobody looked at.
 */
export type ShotLike = { id: string; start: number; duration: number };

export type ShotTime = {
  id: string;
  index: number;
  /** Shot start in seconds. */
  from: number;
  /** Shot end in seconds. */
  to: number;
  /** The chosen time, always inside the shot. */
  time: number;
};

/**
 * Exactly one representative time per shot, in shot order.
 *
 * This is the storyboard rule: one frame per shot, never two, never a beat.
 * `at` is the fraction through the shot and is kept strictly inside it, so a shot
 * boundary is never sampled as if it belonged to the shot it starts.
 */
export function shotTimes(shots: readonly ShotLike[], at = 0.5): ShotTime[] {
  if (shots.length === 0) throw new Error("shotTimes needs at least one shot");
  const fraction = Math.min(0.99, Math.max(0, Number.isFinite(at) ? at : 0.5));
  return shots.map((shot, index) => {
    const from = shot.start;
    const to = Number((shot.start + shot.duration).toFixed(2));
    const time = Number((from + shot.duration * fraction).toFixed(2));
    return { id: shot.id, index, from, to, time };
  });
}

export function sampleTimes(duration: number, every: number): number[] {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("sampleTimes needs a positive duration");
  const step = Number.isFinite(every) && every > 0 ? every : 1;
  const out: number[] = [];
  for (let time = 0; time < duration; time = Number((time + step).toFixed(2))) out.push(time);
  const last = Number((duration - 0.05).toFixed(2));
  if (out.length === 0 || out[out.length - 1] !== last) out.push(last);
  return out;
}
