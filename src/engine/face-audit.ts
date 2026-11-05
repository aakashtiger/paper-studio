/**
 * Face-pixel audit: did the painted face actually change between two named
 * expressions, and did it change over more than one frame?
 *
 * The sampler lives in `paint-probe.js`; this module is pure and tests the
 * timeline, the face-local grid delta and the snap rule.
 */

export const FACE_AUDIT_VERSION = 1;
export const FACE_GRID = 8;
export const FACE_WINDOW = { x0: -0.85, x1: 0.85, y0: -0.72, y1: 0.95 } as const;

export type FaceSample = {
  kind: "faceSample";
  character: string;
  grid: number;
  cells: number[];
  validCells: number;
  deviceBox: { x: number; y: number; w: number; h: number };
  reason?: string;
};

export type FaceProbeFrame = {
  time: number;
  rigRecords: Array<{ kind?: string; character?: string; [key: string]: unknown }>;
};

export type FaceExpressionChange = {
  shot: string;
  who: string;
  from: string;
  to: string;
  fromAt: number;
  at: number;
  blend: number;
  start: number;
  shotEnd: number;
};

export type FaceAuditOptions = {
  minDelta?: number;
  noiseMultiple?: number;
  minCells?: number;
  cellChanged?: number;
  snapShare?: number;
  minValidCells?: number;
};

const DEFAULTS: Required<FaceAuditOptions> = {
  minDelta: 0.02,
  noiseMultiple: 1.5,
  minCells: 3,
  cellChanged: 0.08,
  snapShare: 0.85,
  minValidCells: 0.6,
};

type MinimalScore = {
  shots: {
    id?: string;
    duration: number;
    direction?: {
      events?: { t: number; kind: string; who?: string; expression?: string }[];
    };
  }[];
};

/** Every measured expression change, in absolute film time. */
export function expressionChanges(score: MinimalScore): FaceExpressionChange[] {
  const changes: FaceExpressionChange[] = [];
  let shotStart = 0;
  score.shots.forEach((shot, index) => {
    const shotEnd = shotStart + shot.duration;
    const events = (shot.direction?.events ?? [])
      .filter((event) => event.kind === "pose" && event.expression && event.who)
      .sort((a, b) => a.t - b.t);
    const byWho = new Map<string, typeof events>();
    for (const event of events) {
      const list = byWho.get(event.who as string) ?? [];
      list.push(event);
      byWho.set(event.who as string, list);
    }
    for (const [who, list] of byWho) {
      for (let i = 1; i < list.length; i += 1) {
        const previous = list[i - 1]!;
        const next = list[i]!;
        if (previous.expression === next.expression) continue;
        const fromAt = shotStart + previous.t;
        const at = shotStart + next.t;
        const blend = Math.min(0.4, Math.max(0.25, at - fromAt));
        changes.push({
          shot: shot.id ?? `s${String(index + 1).padStart(2, "0")}`,
          who,
          from: previous.expression as string,
          to: next.expression as string,
          fromAt,
          at,
          blend,
          start: at - blend,
          shotEnd,
        });
      }
    }
    shotStart = shotEnd;
  });
  return changes;
}

function sampleDelta(a: FaceSample, b: FaceSample): number[] {
  const out: number[] = [];
  const count = Math.min(a.cells.length, b.cells.length);
  for (let i = 0; i < count; i += 3) {
    const ar = a.cells[i] ?? -1;
    const ag = a.cells[i + 1] ?? -1;
    const ab = a.cells[i + 2] ?? -1;
    const br = b.cells[i] ?? -1;
    const bg = b.cells[i + 1] ?? -1;
    const bb = b.cells[i + 2] ?? -1;
    if (ar < 0 || ag < 0 || ab < 0 || br < 0 || bg < 0 || bb < 0) continue;
    out.push(Math.sqrt((((ar - br) ** 2) + ((ag - bg) ** 2) + ((ab - bb) ** 2)) / 3) / 255);
  }
  return out;
}

export function visibleDelta(a: FaceSample, b: FaceSample): number {
  const deltas = sampleDelta(a, b).sort((left, right) => right - left);
  if (deltas.length === 0) return 0;
  const take = Math.max(3, Math.round(deltas.length * 0.25));
  return deltas.slice(0, take).reduce((sum, value) => sum + value, 0) / take;
}

export function changedCells(a: FaceSample, b: FaceSample, threshold = DEFAULTS.cellChanged): number {
  return sampleDelta(a, b).filter((delta) => delta >= threshold).length;
}

function faceSamples(frames: readonly FaceProbeFrame[]): Map<string, Array<{ time: number; sample: FaceSample }>> {
  const map = new Map<string, Array<{ time: number; sample: FaceSample }>>();
  for (const frame of frames) {
    for (const record of frame.rigRecords) {
      if (record.kind !== "faceSample") continue;
      const sample = record as unknown as FaceSample;
      if (!Array.isArray(sample.cells) || sample.validCells <= 0) continue;
      const list = map.get(sample.character) ?? [];
      list.push({ time: frame.time, sample });
      map.set(sample.character, list);
    }
  }
  for (const list of map.values()) list.sort((a, b) => a.time - b.time);
  return map;
}

export type FaceAuditFinding = { code: string; message: string; change?: FaceExpressionChange };

export type FaceChangeResult = FaceExpressionChange & {
  measured: boolean;
  signal: number;
  changedCells: number;
  intermediates: number;
  maxStep: number;
  noise: number;
  pass: boolean;
};

export function analyseFaceSamples(input: {
  frames: readonly FaceProbeFrame[];
  changes: readonly FaceExpressionChange[];
  options?: FaceAuditOptions;
}): { pass: boolean; findings: FaceAuditFinding[]; changes: FaceChangeResult[]; measured: number } {
  const options = { ...DEFAULTS, ...(input.options ?? {}) };
  const byCharacter = faceSamples(input.frames);
  const findings: FaceAuditFinding[] = [];
  const results: FaceChangeResult[] = [];
  let measured = 0;

  for (const change of input.changes) {
    const samples = byCharacter.get(change.who) ?? [];
    // Two samples for one character in one frame is ambiguous, not a face.
    const times = new Map<number, number>();
    for (const entry of samples) times.set(entry.time, (times.get(entry.time) ?? 0) + 1);
    const clean = samples.filter((entry) => (times.get(entry.time) ?? 0) === 1);
    const before = [...clean].reverse().find((entry) => entry.time <= change.start + 1e-6);
    const at = clean.find((entry) => entry.time >= change.at - 1e-6);
    const intermediate = clean.filter((entry) => entry.time > (before?.time ?? -1) && entry.time < (at?.time ?? -1));
    if (!before || !at || before.sample.validCells < before.sample.grid * before.sample.grid * options.minValidCells || at.sample.validCells < at.sample.grid * at.sample.grid * options.minValidCells) {
      findings.push({
        code: "face:unmeasured",
        message: `${change.shot} "${change.who}" ${change.from}->${change.to}: no clean face sample before/at the change`,
        change,
      });
      results.push({
        ...change,
        measured: false,
        signal: 0,
        changedCells: 0,
        intermediates: intermediate.length,
        maxStep: 0,
        noise: 0,
        pass: false,
      });
      continue;
    }
    measured += 1;
    const signal = visibleDelta(before.sample, at.sample);
    const changed = changedCells(before.sample, at.sample, options.cellChanged);
    const steps: number[] = [];
    const path = [before, ...intermediate, at];
    for (let i = 1; i < path.length; i += 1) {
      steps.push(visibleDelta(path[i - 1]!.sample, path[i]!.sample));
    }
    const maxStep = steps.length > 0 ? Math.max(...steps) : signal;
    const post = clean.filter((entry) => entry.time >= change.at && entry.time <= Math.min(change.shotEnd, change.at + 0.6));
    const noisePairs: number[] = [];
    for (let i = 1; i < post.length; i += 1) {
      noisePairs.push(visibleDelta(post[i - 1]!.sample, post[i]!.sample));
    }
    const noise = noisePairs.length > 0 ? [...noisePairs].sort((a, b) => a - b)[Math.floor(noisePairs.length / 2)]! : 0;
    const required = Math.max(options.minDelta, noise * options.noiseMultiple);
    let pass = signal >= required && changed >= options.minCells;
    if (signal >= required && changed < options.minCells) {
      findings.push({
        code: "face:changed-cells",
        message: `${change.shot} "${change.who}" ${change.from}->${change.to}: only ${changed} cell(s) moved; the face needs at least ${options.minCells}`,
        change,
      });
      pass = false;
    }
    if (pass && steps.length > 0 && maxStep >= options.snapShare * signal) {
      findings.push({
        code: "face:snap",
        message: `${change.shot} "${change.who}" ${change.from}->${change.to}: one frame carries ${(maxStep / Math.max(signal, 1e-9) * 100).toFixed(0)}% of the change`,
        change,
      });
      pass = false;
    }
    if (pass && intermediate.length === 0) {
      findings.push({
        code: "face:snap",
        message: `${change.shot} "${change.who}" ${change.from}->${change.to}: no in-between sample; the face cut`,
        change,
      });
      pass = false;
    }
    if (!pass && signal < required) {
      findings.push({
        code: "face:no-change",
        message: `${change.shot} "${change.who}" ${change.from}->${change.to}: face delta ${signal.toFixed(3)} is below ${required.toFixed(3)} (or only ${changed} cells moved)`,
        change,
      });
    }
    results.push({ ...change, measured: true, signal, changedCells: changed, intermediates: intermediate.length, maxStep, noise, pass });
  }

  return {
    pass: findings.length === 0 && results.every((change) => change.pass),
    findings,
    changes: results,
    measured,
  };
}
