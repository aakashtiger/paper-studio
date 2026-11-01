/**
 * Determinism, proven where it can be proven cheaply (decision 0032).
 *
 * Non-negotiable #1 says the same brief, style and seed produce identical
 * frames. The old proof painted the whole film **twice** — 2 × ~12 min for a
 * 60 s film, the largest single cost in the loop.
 *
 * But a frame is a pure function of the score and its time (0023). What can
 * actually go wrong is not the arithmetic, it is the *environment*: a font that
 * shapes differently in a second process, a canvas that antialiases differently,
 * or — the real risk in a parallel renderer — a frame whose bytes depend on
 * **which** browser painted it. The old twin could not catch the last one: both
 * runs split the film the same way, so each browser painted the same frames in
 * both runs and a warm-up defect would have been identical twice over.
 *
 * So the proof is a **sample painted twice in two independent browser
 * processes, one of them serial and one of them parallel**, compared byte for
 * byte. Cost: ~30 frames, ~45 s. It also proves worker-count invariance, which
 * the twin never tested.
 */
import { createHash } from "node:crypto";

/** How many frames of each shot the twin paints. */
export const TWIN_PER_SHOT = 3;

/** A twin of one frame proves nothing about a painter. */
export const TWIN_MIN_FRAMES = 2;

export type TwinShot = { id: string; start: number; duration: number };
export type TwinSample = { time: number; shot: string };

/**
 * The times to paint, spread evenly **inside** every shot.
 *
 * Even fractions (1/(n+1) … n/(n+1)) rather than the shot's first and last
 * frame: a boundary frame rounds unpredictably at two decimals and can land in
 * the neighbouring shot, and the ends of a shot are exactly where an easing
 * curve is most sensitive. Times are rounded to two decimals because that is the
 * grid the renderer names its stills on (`t-00.25.png`).
 */
export function sampleFrames(shots: TwinShot[], perShot: number = TWIN_PER_SHOT): TwinSample[] {
  if (!Number.isInteger(perShot) || perShot < 1) {
    throw new Error(`perShot must be a positive integer, got ${perShot}`);
  }
  const out: TwinSample[] = [];
  const seen = new Set<number>();
  for (const shot of shots) {
    if (!(shot.duration > 0)) continue;
    for (let index = 1; index <= perShot; index += 1) {
      const fraction = index / (perShot + 1);
      const time = Math.round((shot.start + shot.duration * fraction) * 100) / 100;
      // A shot shorter than the sample grid can round two samples onto one time.
      // One picture is one picture; painting it twice would pad the count.
      if (seen.has(time)) continue;
      seen.add(time);
      out.push({ time, shot: shot.id });
    }
  }
  return out.sort((a, b) => a.time - b.time);
}

export type TwinFrame = {
  /** The film time painted, to two decimals. */
  time: number;
  /** The shot that time falls in, so an uncovered shot is visible by name. */
  shot: string;
  /** sha256 of the PNG painted by run A (serial). */
  a: string;
  /** sha256 of the PNG painted by run B (parallel). */
  b: string;
  identical: boolean;
};

export type TwinInput = {
  film: string;
  /** sha256 of the score, so a report cannot be read as evidence for another edit. */
  score: string;
  /** The picture this was measured for, when the manifest already exists. */
  videoHash?: string | null;
  runs: { a: { workers: number; seconds: number }; b: { workers: number; seconds: number } };
  /** Every shot id in the film, in order — the coverage the twin must have. */
  shots: string[];
  frames: { time: number; shot: string; a: string; b: string }[];
};

export type TwinIssue = { code: string; message: string; shot?: string; time?: number };

export type TwinReport = {
  mode: "frame-bytes";
  film: string;
  score: string;
  videoHash: string | null;
  runs: { a: { workers: number; seconds: number }; b: { workers: number; seconds: number } };
  shots: string[];
  uncovered: string[];
  frames: TwinFrame[];
  /** One hash over every sampled (time, shot, first run) — internal consistency. */
  sampleHash: string;
  mismatches: number;
  errors: TwinIssue[];
  warnings: TwinIssue[];
  pass: boolean;
};

/**
 * One hash over the sample, so the gate can tell whether the frame list it was
 * handed is the frame list the report summarised.
 */
export function twinSampleHash(frames: { time: number; shot: string; a: string }[]): string {
  const text = frames.map((frame) => `${frame.time}|${frame.shot}|${frame.a}`).join("\n");
  return `sha256:${createHash("sha256").update(text).digest("hex")}`;
}

/**
 * The verdict. Pure, so the command and its test run the same rule.
 *
 * The rules are deliberately narrow: every sampled frame must be byte-identical
 * between the two runs, every shot must have been sampled, and the sample must
 * be more than one picture. `pass` is false for any of those — a determinism
 * claim is not a matter of degree.
 */
export function checkTwin(input: TwinInput): TwinReport {
  const errors: TwinIssue[] = [];
  const warnings: TwinIssue[] = [];

  const frames: TwinFrame[] = input.frames
    .map((frame) => ({ ...frame, identical: frame.a === frame.b }))
    .sort((a, b) => a.time - b.time);

  const differing = frames.filter((frame) => !frame.identical);
  for (const frame of differing) {
    errors.push({
      code: "determinism:frame",
      message:
        `t=${frame.time.toFixed(2)}s (${frame.shot}) is not the same picture in the two runs: ` +
        `${frame.a.slice(0, 18)}… vs ${frame.b.slice(0, 18)}… — the painter is not a pure function of time`,
      shot: frame.shot,
      time: frame.time,
    });
  }

  if (frames.length < TWIN_MIN_FRAMES) {
    errors.push({
      code: "determinism:sample",
      message: `${frames.length} frame(s) sampled; a twin needs at least ${TWIN_MIN_FRAMES} to compare anything`,
    });
  }

  const times = frames.map((frame) => frame.time);
  const repeated = times.filter((time, index) => times.indexOf(time) !== index);
  if (repeated.length > 0) {
    errors.push({
      code: "determinism:duplicate",
      message: `${repeated.length} time(s) sampled more than once (${[...new Set(repeated)].join(", ")}s) — one picture, counted twice`,
    });
  }

  const sampled = new Set(frames.map((frame) => frame.shot));
  const uncovered = input.shots.filter((shot) => !sampled.has(shot));
  for (const shot of uncovered) {
    errors.push({
      code: "determinism:uncovered",
      message: `shot "${shot}" was not sampled — a film's determinism is not proven by the shots that happened to be painted`,
      shot,
    });
  }

  const unknown = frames.filter((frame) => !input.shots.includes(frame.shot));
  for (const frame of unknown) {
    warnings.push({
      code: "determinism:unknown-shot",
      message: `t=${frame.time.toFixed(2)}s was attributed to shot "${frame.shot}", which is not in the film`,
      shot: frame.shot,
      time: frame.time,
    });
  }

  return {
    mode: "frame-bytes",
    film: input.film,
    score: input.score,
    videoHash: input.videoHash ?? null,
    runs: input.runs,
    shots: input.shots,
    uncovered,
    frames,
    sampleHash: twinSampleHash(frames),
    mismatches: differing.length,
    errors,
    warnings,
    // A determinism claim is binary. Nothing here is a matter of degree.
    pass: errors.length === 0,
  };
}

/**
 * The gate's rule, as a pure function.
 *
 * The gate does not trust the report's `pass` flag: it re-derives the sample
 * hash from the frame list it was handed, re-checks every pair, requires the
 * report to name **this** score, and requires the two runs to have used a
 * different number of workers. A trimmed, hand-edited or stale report fails
 * here even if it says `pass: true` — which is the only reason a gate over a
 * JSON file is worth anything.
 */
export type TwinEvidence = {
  mode?: string;
  pass?: boolean;
  score?: string;
  mismatches?: number;
  sampleHash?: string;
  uncovered?: string[];
  frames?: { time: number; shot: string; a: string; b: string }[];
  runs?: { a: { workers: number }; b: { workers: number } };
} | null;

export function checkTwinEvidence(evidence: TwinEvidence, scoreNow: string): { ok: boolean; detail: string } {
  if (!evidence) {
    return { ok: false, detail: "no determinism report (run `npm run determinism -- <score>`)" };
  }
  if (evidence.mode !== "frame-bytes") {
    return {
      ok: false,
      detail:
        "the determinism report is a twin *render*, not a twin *sample* — the chain now proves purity " +
        "with `npm run determinism` at ~1% of the cost, and this row refuses the older evidence",
    };
  }

  const frames = Array.isArray(evidence.frames) ? evidence.frames : [];
  const differs = frames.filter((frame) => frame.a !== frame.b).length;
  const uncovered = Array.isArray(evidence.uncovered) ? evidence.uncovered : [];
  const hashNow = frames.length > 0 ? twinSampleHash(frames) : null;
  const runs = evidence.runs;
  const distinctWorkers = Boolean(runs) && runs!.a.workers !== runs!.b.workers;

  const ok =
    evidence.pass === true &&
    evidence.score === scoreNow &&
    frames.length >= TWIN_MIN_FRAMES &&
    differs === 0 &&
    evidence.mismatches === 0 &&
    uncovered.length === 0 &&
    hashNow !== null &&
    hashNow === evidence.sampleHash &&
    distinctWorkers;

  const detail = ok
    ? `the same ${frames.length} frames, byte for byte, in ${runs!.a.workers} and ${runs!.b.workers} browsers`
    : evidence.score !== scoreNow
      ? "the determinism report measured a different score"
      : frames.length < TWIN_MIN_FRAMES
        ? `only ${frames.length} frame(s) sampled`
        : differs > 0
          ? `${differs} of ${frames.length} sampled frames differ between the serial and the parallel run`
          : uncovered.length > 0
            ? `shot(s) never sampled: ${uncovered.join(", ")}`
            : hashNow !== evidence.sampleHash
              ? "the report's sample hash does not cover the frames it lists"
              : !distinctWorkers
                ? "both runs used the same number of workers — that proves the same code ran twice, not that a frame is the same whichever browser paints it"
                : `the report says pass=${String(evidence.pass)} with ${String(evidence.mismatches)} mismatch(es)`;

  return { ok, detail };
}
