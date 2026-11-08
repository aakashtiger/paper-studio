/**
 * The shot and duration policy, as code (decision 0065).
 *
 * Shot length, shot count, aspect and frame rate belong to the **system**, not to
 * a style and not to a film's taste. This module is the one implementation of
 * `docs/references/kpop-shot-policy.md`: it derives the band from the film's
 * duration and refuses a cut that is outside it.
 *
 * The gate that exists today (`scripts/motion-check.mjs` in the proof toolchain)
 * still carries the older band — 1.0–4.5 s, median 2.5–3.0 — because the films
 * already delivered were cut to it. This module is the engine that replaces it;
 * until the gate reads it, a film is judged twice and the gap is named in the M1
 * report rather than hidden (see `kpop-system-spec.md`).
 *
 * Why a function and not a table of constants: the same film must be judged the
 * same way whether it is 30 s, 60 s or 10 min. A constant table would make a
 * 10-minute film "wrong" for having 120 shots.
 */

/** The band a film of this duration must cut to. */
export type ShotBand = {
  /** 1.2 s under 3 min, 3.0 s from 3 min. */
  min: number;
  /** The band's median, not a grid: a film earns its rhythm. */
  median: number;
  /** 5.5 s under 3 min, 7.0 s from 3 min. */
  max: number;
  /** How far the film's own median may sit from the band's median. */
  tolerance: number;
  /** `round(duration / median)` — the fewest shots the film may use. */
  shots: number;
  regime: "short" | "long";
};

export type PolicyShot = {
  id: string;
  start: number;
  duration: number;
  /** Declared camera move; used by the four-in-a-row guard when present. */
  camera?: string;
  /** Declared set; used by the four-in-a-row guard when present. */
  set?: string;
  /** Declared composition; used by the four-in-a-row guard when present. */
  composition?: string;
};

export type PolicyIssue = { code: string; message: string; shot?: string };

export type PolicyReport = {
  band: ShotBand;
  duration: number;
  shots: number;
  lengths: { shot: string; duration: number; atMin: boolean; atMax: boolean }[];
  median: number;
  findings: PolicyIssue[];
  warnings: PolicyIssue[];
};

/** Below three minutes the film is a short; at and above it is long form. */
export const SHORT_FORM_SECONDS = 180;

/** A shot within this of the band edge counts as "at the edge" for the guards. */
export const EDGE_SLACK = 0.1;

/** At most 15% of shots at the minimum, at most 10% at the maximum. */
export const MAX_AT_MIN = 0.15;
export const MAX_AT_MAX = 0.10;

/** The film's median may sit this far from the band's median. */
export const MEDIAN_TOLERANCE = 0.3;

export function bandFor(duration: number): ShotBand {
  if (!(duration > 0)) throw new Error(`bandFor: duration must be positive, got ${duration}`);
  const regime: ShotBand["regime"] = duration < SHORT_FORM_SECONDS ? "short" : "long";
  const min = regime === "short" ? 1.2 : 3.0;
  const median = regime === "short" ? 3.0 : 5.0;
  const max = regime === "short" ? 5.5 : 7.0;
  // A 30 s film is 10 shots at the median and must never fall to 9; rounding is
  // the policy's own arithmetic, not a second rule.
  const shots = Math.max(1, Math.round(duration / median));
  return { min, median, max, tolerance: MEDIAN_TOLERANCE, shots, regime };
}

/** The same median the delivered gate reads: the upper middle of the sorted list. */
export function medianOf(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

const round = (value: number) => Number(value.toFixed(3));
const pct = (part: number, whole: number) => (whole > 0 ? (100 * part) / whole : 0);

/**
 * Check a cut against the band for its duration.
 *
 * `duration` is the film's declared length, not the sum of the shots: a hole in
 * the cut is a finding of its own (the last shot's end is compared to it), and
 * silently using the sum would hide it.
 */
export function checkShotPolicy(shots: PolicyShot[], duration: number): PolicyReport {
  const band = bandFor(duration);
  const findings: PolicyIssue[] = [];
  const warnings: PolicyIssue[] = [];

  if (shots.length === 0) {
    findings.push({ code: "policy:no-shots", message: "the film has no shots" });
    return { band, duration, shots: 0, lengths: [], median: 0, findings, warnings };
  }

  // The cut must cover the film exactly: a gap is an unpainted second, an
  // overlap is two pictures claiming the same second.
  const ordered = [...shots].sort((a, b) => a.start - b.start);
  let cursor = 0;
  for (const shot of ordered) {
    if (Math.abs(shot.start - cursor) > 0.02) {
      findings.push({
        code: "policy:gap",
        message:
          `${shot.id} starts at ${shot.start.toFixed(2)}s but the previous shot ends at ${cursor.toFixed(2)}s`,
        shot: shot.id,
      });
    }
    cursor = shot.start + shot.duration;
  }
  if (Math.abs(cursor - duration) > 0.02) {
    findings.push({
      code: "policy:coverage",
      message: `the shots end at ${cursor.toFixed(2)}s; the film is ${duration.toFixed(2)}s`,
    });
  }

  const lengths = ordered.map((shot) => ({
    shot: shot.id,
    duration: round(shot.duration),
    atMin: shot.duration <= band.min + EDGE_SLACK,
    atMax: shot.duration >= band.max - EDGE_SLACK,
  }));

  for (const row of lengths) {
    if (row.duration < band.min - 1e-6) {
      findings.push({
        code: "policy:too-short",
        message: `${row.shot} is ${row.duration}s — under the ${band.min}s floor`,
        shot: row.shot,
      });
    }
    if (row.duration > band.max + 1e-6) {
      findings.push({
        code: "policy:too-long",
        message: `${row.shot} is ${row.duration}s — over the ${band.max}s ceiling`,
        shot: row.shot,
      });
    }
  }

  const median = medianOf(lengths.map((row) => row.duration));
  if (Math.abs(median - band.median) > band.tolerance + 1e-6) {
    findings.push({
      code: "policy:median",
      message:
        `median shot ${median.toFixed(2)}s is outside ${band.median}±${band.tolerance}s ` +
        `(${lengths.length} shots)`,
    });
  }

  if (lengths.length < band.shots) {
    findings.push({
      code: "policy:count",
      message:
        `${lengths.length} shots is fewer than the ${band.shots} a ${duration.toFixed(0)}s film ` +
        `derives at a ${band.median}s median`,
    });
  }

  const atMin = lengths.filter((row) => row.atMin).length;
  const atMax = lengths.filter((row) => row.atMax).length;
  if (pct(atMin, lengths.length) > 100 * MAX_AT_MIN + 1e-6) {
    findings.push({
      code: "policy:at-min",
      message:
        `${atMin}/${lengths.length} shots (${pct(atMin, lengths.length).toFixed(0)}%) sit at the ` +
        `${band.min}s minimum — the cap is ${Math.round(100 * MAX_AT_MIN)}%`,
    });
  }
  if (pct(atMax, lengths.length) > 100 * MAX_AT_MAX + 1e-6) {
    findings.push({
      code: "policy:at-max",
      message:
        `${atMax}/${lengths.length} shots (${pct(atMax, lengths.length).toFixed(0)}%) sit at the ` +
        `${band.max}s maximum — the cap is ${Math.round(100 * MAX_AT_MAX)}%`,
    });
  }

  // No two maximum-length shots in a row: that is the metronome the policy is
  // trying to prevent, in its slow form.
  for (let index = 1; index < lengths.length; index++) {
    if (lengths[index - 1]?.atMax && lengths[index]?.atMax) {
      findings.push({
        code: "policy:max-run",
        message: `${lengths[index - 1]?.shot} and ${lengths[index]?.shot} are both at the maximum`,
        shot: lengths[index]?.shot,
      });
    }
  }

  // No four consecutive shots share a camera move, a set or a composition. Only
  // declared axes are checked: an absent composition is not a failing one.
  const axes: { key: keyof PolicyShot; label: string }[] = [
    { key: "camera", label: "camera move" },
    { key: "set", label: "set" },
    { key: "composition", label: "composition" },
  ];
  for (const axis of axes) {
    const values = ordered.map((shot) => shot[axis.key]);
    if (values.every((value) => value === undefined || value === "")) {
      warnings.push({
        code: `policy:${axis.key}-absent`,
        message: `no shot declares a ${axis.label}; the four-in-a-row guard was not applied`,
      });
      continue;
    }
    for (let index = 3; index < values.length; index++) {
      const run = [values[index - 3], values[index - 2], values[index - 1], values[index]];
      if (run[0] !== undefined && run.every((value) => value === run[0])) {
        findings.push({
          code: `policy:${axis.key}-run`,
          message: `four shots in a row share the ${axis.label} "${String(run[0])}"`,
          shot: ordered[index]?.id,
        });
      }
    }
  }

  return { band, duration, shots: lengths.length, lengths, median: round(median), findings, warnings };
}

/** The human line a CLI prints for one shot row. */
export function describeBand(band: ShotBand): string {
  return (
    `${band.regime} form: ${band.min}s / ${band.median}s / ${band.max}s ` +
    `(median ±${band.tolerance}s), at least ${band.shots} shots`
  );
}
