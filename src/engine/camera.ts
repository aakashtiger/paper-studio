import { CAMERA_MOVES, EASINGS } from "../core/style.js";

/**
 * The camera grammar for a short (decision 0041).
 *
 * The video's camera is never simply still: it glides, pushes, pulls and
 * orbits, and the move is part of the style. The paper pack allowed `static`
 * as its default and one shot in *Same Alarm* had no camera at all, so a film
 * could be a set of photographs with moving subjects.
 *
 * This module is the rule, not a new renderer. Every shot must name a move that
 * is not `static`, the move must have a real delta, and a film may not repeat
 * one move forever. The values come from the score; the style declares the
 * grammar in `tokens.motion.camera`.
 */

export type CameraPlanShot = {
  id: string;
  beat?: string;
  camera?: { move: string; from: number; to: number; ease: string };
};

export type CameraIssue = { code: string; message: string; shot?: string };

export type CameraPlanReport = {
  shots: number;
  distinct: string[];
  longestRun: number;
  errors: CameraIssue[];
  warnings: CameraIssue[];
};

export type CameraPlanOptions = {
  /** A shot with no camera is refused (the style says so). Default true. */
  requireMove?: boolean;
  /** At least this many different moves in a film. Default 3. */
  minDistinct?: number;
  /** No more than this many consecutive shots with the same move. Default 2. */
  maxRun?: number;
};

const isDynamic = (move: string) => move !== "static";

const CAMERA_MOVE_SET = new Set<string>(CAMERA_MOVES);
const EASING_SET = new Set<string>(EASINGS);

/**
 * The move a beat suggests when a shot needs one:
 * the hook orbits, setup pans, escalation pushes, the turn pulls back, the
 * release drifts, the button pushes. A style may override this table.
 */
export const CAMERA_BY_BEAT: Record<string, string> = {
  hook: "orbit",
  setup: "pan",
  escalate: "push_in",
  turn: "pull_back",
  release: "parallax",
  button: "push_in",
};

export function checkCameraPlan(
  shots: CameraPlanShot[],
  options: CameraPlanOptions = {},
): CameraPlanReport {
  const requireMove = options.requireMove ?? true;
  const minDistinct = options.minDistinct ?? 3;
  const maxRun = options.maxRun ?? 2;
  const errors: CameraIssue[] = [];
  const warnings: CameraIssue[] = [];
  const distinct = new Set<string>();
  let run = 0;
  let runMove: string | null = null;
  let longestRun = 0;

  for (const shot of shots) {
    const camera = shot.camera;
    if (!camera) {
      if (requireMove) {
        errors.push({
          code: "camera:missing",
          message: `shot "${shot.id}" has no camera — this style does not allow a still frame`,
          shot: shot.id,
        });
      }
      continue;
    }
    if (!isDynamic(camera.move)) {
      errors.push({
        code: "camera:static",
        message: `shot "${shot.id}" uses a static camera — every shot must move`,
        shot: shot.id,
      });
    }
    if (!CAMERA_MOVE_SET.has(camera.move)) {
      errors.push({
        code: "camera:move",
        message: `shot "${shot.id}" uses unknown camera move "${camera.move}"`,
        shot: shot.id,
      });
    }
    if (!EASING_SET.has(camera.ease)) {
      errors.push({
        code: "camera:ease",
        message: `shot "${shot.id}" uses unknown easing "${camera.ease}"`,
        shot: shot.id,
      });
    }
    if (!(camera.to > camera.from) && !(camera.to < camera.from)) {
      errors.push({
        code: "camera:delta",
        message: `shot "${shot.id}" has from ${camera.from} and to ${camera.to} — the move has no travel`,
        shot: shot.id,
      });
    }
    if (camera.move === "push_in" && camera.to <= camera.from) {
      errors.push({
        code: "camera:sign",
        message: `shot "${shot.id}" is a push_in but ${camera.from} → ${camera.to} — it pulls back`,
        shot: shot.id,
      });
    }
    if (camera.move === "pull_back" && camera.to >= camera.from) {
      errors.push({
        code: "camera:sign",
        message: `shot "${shot.id}" is a pull_back but ${camera.from} → ${camera.to} — it pushes in`,
        shot: shot.id,
      });
    }

    if (isDynamic(camera.move)) distinct.add(camera.move);
    if (camera.move === runMove) {
      run += 1;
    } else {
      runMove = camera.move;
      run = 1;
    }
    longestRun = Math.max(longestRun, run);
  }

  if (distinct.size < minDistinct) {
    errors.push({
      code: "camera:variety",
      message:
        `${distinct.size} camera move(s) in ${shots.length} shots (${[...distinct].join(", ") || "none"}) — ` +
        `a film needs at least ${minDistinct}`,
    });
  }
  if (longestRun > maxRun) {
    errors.push({
      code: "camera:run",
      message: `${longestRun} consecutive shots use one move — the cut stops moving its eye (max ${maxRun})`,
    });
  }
  if (longestRun === shots.length && shots.length > 1) {
    warnings.push({ code: "camera:monotone", message: "every shot uses the same move" });
  }

  return { shots: shots.length, distinct: [...distinct], longestRun, errors, warnings };
}

/** Read the camera grammar from a style's tokens, with the defaults above. */
export function cameraOptionsFromTokens(tokens: unknown): CameraPlanOptions {
  const motion = tokens && typeof tokens === "object" ? (tokens as { motion?: { camera?: Record<string, unknown> } }).motion : undefined;
  const camera = motion?.camera;
  if (!camera) return {};
  return {
    requireMove: typeof camera.requireMove === "boolean" ? camera.requireMove : undefined,
    minDistinct: typeof camera.minDistinct === "number" ? camera.minDistinct : undefined,
    maxRun: typeof camera.maxRun === "number" ? camera.maxRun : undefined,
  };
}

/**
 * A deterministic camera plan for a shot list: the style's template, varied.
 *
 * The beat chooses the preferred move (hook orbits, setup pans, escalation
 * pushes, the turn pulls back, the release drifts, the button pushes). If that
 * would repeat the previous move more than `maxRun` times, the next dynamic
 * move takes over. A seed rotates the fallback, so two films with the same
 * beats do not get the same sequence unless they ask for it.
 */
export function proposeCameraPlan(
  shots: CameraPlanShot[],
  options: CameraPlanOptions & { byBeat?: Record<string, string>; seed?: string } = {},
): { id: string; beat?: string; camera: { move: string; from: number; to: number; ease: string } }[] {
  const maxRun = options.maxRun ?? 2;
  const byBeat = options.byBeat ?? CAMERA_BY_BEAT;
  const cycle = ["push_in", "pan", "orbit", "pull_back", "parallax", "tilt"];
  const seed = (options.seed ?? "camera").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  let previous: string | null = null;
  let run = 0;
  return shots.map((shot, index) => {
    let move = byBeat[shot.beat ?? ""] ?? cycle[(index + seed) % cycle.length]!;
    if (move === previous && run >= maxRun) {
      move = cycle[(cycle.indexOf(move) + 1 + (seed % cycle.length)) % cycle.length]!;
    }
    if (move === previous) run += 1;
    else {
      previous = move;
      run = 1;
    }
    const from = move === "pull_back" ? 1.08 : 1;
    const to = move === "pull_back" ? 1 : move === "push_in" ? 1.05 + (index % 3) * 0.01 : 1.03 + (index % 2) * 0.01;
    const ease = move === "orbit" || move === "parallax" ? "easeInOut" : "easeOut";
    return { id: shot.id, ...(shot.beat ? { beat: shot.beat } : {}), camera: { move, from: Number(from.toFixed(2)), to: Number(to.toFixed(2)), ease } };
  });
}
