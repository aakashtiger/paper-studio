/**
 * Time sampling for review sheets.
 *
 * A stills sheet samples the film at a regular interval. The rule is fixed and
 * pure so it is the same every run and can be unit-tested without painting a
 * frame: start at zero, step by `every`, and always include the last frame of
 * the film so the closing image is never the one nobody looked at.
 */
export function sampleTimes(duration: number, every: number): number[] {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("sampleTimes needs a positive duration");
  const step = Number.isFinite(every) && every > 0 ? every : 1;
  const out: number[] = [];
  for (let time = 0; time < duration; time = Number((time + step).toFixed(2))) out.push(time);
  const last = Number((duration - 0.05).toFixed(2));
  if (out.length === 0 || out[out.length - 1] !== last) out.push(last);
  return out;
}
