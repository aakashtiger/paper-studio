/**
 * Does this shot move?
 *
 * The question that cost three whole renders. *Scene 6 is a still photograph*
 * (motion 0.533 against a 0.6 floor) was discovered after a 70-minute paint, and
 * scene 7 cost another 72. Both were knowable from twelve frames of the shot.
 *
 * The measurement here is deliberately coarse and cheap: the paint probe returns
 * a 48×27 RGB sample of every frame it draws, so a movement pass needs no PNG
 * decoding and no encoded video — just the numbers the browser already had. What
 * it answers is the only question that matters before a render: **did anything
 * change across this shot at all?**
 *
 * It does not replace `audit:motion`, which measures the delivered picture frame
 * by frame against a floor. This is the probe that runs before the paint.
 */

export type MotionFrame = { time: number; sample: number[] };

export type ShotMotion = {
  shot: string;
  from: number;
  to: number;
  frames: number;
  /** Mean absolute channel difference between consecutive frames, 0–255. */
  mean: number;
  /** The largest single step in the shot. */
  peak: number;
  /**
   * How far the shot travels: the mean absolute difference between its first and
   * last sampled frame. A still photograph scores ~0 however long it sits there,
   * and a slow push still scores above zero because the whole frame drifts.
   */
  travel: number;
};

export type MotionIssue = { code: string; message: string; shot?: string };

export type MotionReport = {
  shots: ShotMotion[];
  errors: MotionIssue[];
  warnings: MotionIssue[];
};

/**
 * Below this, the first and last frame of the shot are the same picture and the
 * shot is a photograph. Calibrated on the delivered film: its weakest shot scored
 * 0.684 on the full-frame motion floor and travels well above this; the alarm
 * card and the title card are the near-still ones, and are named as such.
 */
export const STILL_TRAVEL = 0.5;

/** A shot that travels this little is moving, but only just. */
export const WEAK_TRAVEL = 1.5;

function channelDiff(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;
  let sum = 0;
  for (let index = 0; index < length; index++) sum += Math.abs((a[index] ?? 0) - (b[index] ?? 0));
  return sum / length;
}

const round = (value: number) => Number(value.toFixed(3));

/**
 * One sample list per shot, in shot order. Frames outside every shot (a film with
 * a hole in it) are ignored rather than attributed to the nearest shot.
 */
export function motionOf(
  shots: { id: string; start: number; duration: number }[],
  frames: MotionFrame[],
): ShotMotion[] {
  const ordered = [...frames].sort((a, b) => a.time - b.time);
  return shots.map((shot) => {
    const to = shot.start + shot.duration;
    const own = ordered.filter((frame) => frame.time >= shot.start - 1e-6 && frame.time < to - 1e-6);
    const steps: number[] = [];
    for (let index = 1; index < own.length; index++) {
      steps.push(channelDiff(own[index - 1]?.sample ?? [], own[index]?.sample ?? []));
    }
    const first = own[0]?.sample ?? [];
    const last = own[own.length - 1]?.sample ?? [];
    return {
      shot: shot.id,
      from: shot.start,
      to,
      frames: own.length,
      mean: round(steps.length > 0 ? steps.reduce((sum, value) => sum + value, 0) / steps.length : 0),
      peak: round(steps.length > 0 ? Math.max(...steps) : 0),
      travel: round(own.length > 1 ? channelDiff(first, last) : 0),
    };
  });
}

export function checkMotion(shots: ShotMotion[]): MotionReport {
  const errors: MotionIssue[] = [];
  const warnings: MotionIssue[] = [];

  for (const shot of shots) {
    if (shot.frames < 2) {
      errors.push({
        code: "motion:unmeasured",
        message: `shot "${shot.shot}" has ${shot.frames} sampled frame(s) — movement cannot be measured`,
        shot: shot.shot,
      });
      continue;
    }
    if (shot.travel < STILL_TRAVEL) {
      errors.push({
        code: "motion:still",
        message:
          `shot "${shot.shot}" is a still photograph: it travels ${shot.travel.toFixed(2)} ` +
          `(first frame to last) over ${(shot.to - shot.from).toFixed(1)}s — the floor is ${STILL_TRAVEL}`,
        shot: shot.shot,
      });
    } else if (shot.travel < WEAK_TRAVEL) {
      warnings.push({
        code: "motion:weak",
        message: `shot "${shot.shot}" travels ${shot.travel.toFixed(2)} — it moves, but not enough to read as movement`,
        shot: shot.shot,
      });
    }
  }

  return { shots, errors, warnings };
}
