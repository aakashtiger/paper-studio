/**
 * Rig geometry: one source of truth for a limb chain.
 *
 * A limb is drawn from `(x, y)` along its local +y axis, rotated by `ang`.
 * The tip is therefore `(x - len*sin(ang), y + len*cos(ang))`.
 *
 * The paper proof shipped a mirrored version of this (`x + len*sin`), so every
 * elbow, wrist, knee, ankle and boot after the first segment was placed on the
 * wrong side of its joint. The hands looked detached from the arms. This module
 * exists so the geometry can be tested and the renderer cannot drift again.
 */

export type Point = { x: number; y: number };

export function limbEnd(x: number, y: number, len: number, ang: number): Point {
  return { x: x - Math.sin(ang) * len, y: y + Math.cos(ang) * len };
}

export type Chain = {
  start: Point;
  joints: Point[];
  lengths: number[];
  angles: number[];
};

/**
 * Resolve a chain of limbs. `angles` are absolute in the parent frame; the
 * caller is responsible for composing relative joint angles before this call.
 */
export function resolveChain(start: Point, lengths: number[], angles: number[]): Chain {
  if (lengths.length !== angles.length) {
    throw new Error("a limb chain needs one angle per segment");
  }
  const joints: Point[] = [];
  let point = start;
  for (let index = 0; index < lengths.length; index++) {
    const length = lengths[index];
    const angle = angles[index];
    if (length === undefined || angle === undefined) {
      throw new Error(`missing segment ${index}`);
    }
    point = limbEnd(point.x, point.y, length, angle);
    joints.push(point);
  }
  return { start, joints, lengths, angles };
}

export type LegSolution = {
  hipAngle: number;
  kneeBend: number;
  shinAngle: number;
  knee: Point;
  ankle: Point;
};

/**
 * Two-bone leg IK. The hip and ankle are fixed; the knee bends outward on the
 * character's side. The returned angles can be fed to the paper `limb` chain.
 */
export function solveLeg(
  hip: Point,
  target: Point,
  thigh: number,
  shin: number,
  side: -1 | 1,
): LegSolution {
  const dx = target.x - hip.x;
  const dy = target.y - hip.y;
  let distance = Math.hypot(dx, dy);
  distance = Math.max(
    Math.abs(thigh - shin) + 0.001,
    Math.min(thigh + shin - 0.001, distance),
  );
  const base = Math.atan2(-dx, dy);
  const cosA = (thigh * thigh + distance * distance - shin * shin) / (2 * thigh * distance);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const sign = side < 0 ? 1 : -1;
  const hipAngle = base + sign * bend;
  const knee = limbEnd(hip.x, hip.y, thigh, hipAngle);
  const shinAngle = Math.atan2(-(target.x - knee.x), target.y - knee.y);
  return {
    hipAngle,
    kneeBend: shinAngle - hipAngle,
    shinAngle,
    knee,
    ankle: target,
  };
}

/** The largest distance between a joint and the point the previous segment ends at. */
export function chainSeamGap(chain: Chain): number {
  let previous = chain.start;
  let gap = 0;
  for (let index = 0; index < chain.joints.length; index++) {
    const joint = chain.joints[index];
    const length = chain.lengths[index];
    if (!joint || length === undefined) continue;
    const angle = chain.angles[index];
    if (angle === undefined) continue;
    const expected = limbEnd(previous.x, previous.y, length, angle);
    gap = Math.max(gap, Math.hypot(joint.x - expected.x, joint.y - expected.y));
    previous = joint;
  }
  return gap;
}

/** A 2D affine transform in the order a canvas records it: `[a, b, c, d, e, f]`. */
export type Affine = [number, number, number, number, number, number];

/** A point in a transform's own space, placed into device space. */
export function placePoint(m: Affine, x: number, y: number): Point {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

/** Device space back into a transform's own space; NaN when the transform is degenerate. */
export function unplacePoint(m: Affine, x: number, y: number): Point {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!Number.isFinite(det) || Math.abs(det) < 1e-9) return { x: Number.NaN, y: Number.NaN };
  return {
    x: (m[3] * (x - m[4]) - m[2] * (y - m[5])) / det,
    y: (-m[1] * (x - m[4]) + m[0] * (y - m[5])) / det,
  };
}

/**
 * The space a body part is held still in — which is to say, what it hangs from.
 *
 * A part is drawn inside its parent's transform, so its place in the **parent's**
 * space is a constant of the rig: pose it any way you like and the number does
 * not change, unless the part is drawn outside the transform it claims to hang
 * from. Measuring a part in space that is not its parent's cannot say that. The
 * hair hangs inside the head, and a head turning 30° legitimately moves the hair
 * through 30° of arc — measured in chest space that is tens of units of motion
 * and it reads as a seam on every frame of every turn.
 *
 * The chest is the root of both, and its own space needs no entry: a part with
 * no declared parent here is measured against the chest, which is what a hip and
 * a shoulder are rigged to.
 */
export const ANCHOR_SPACE: Record<string, string> = {
  head: "chest",
  hair: "head",
};

/** One anchor the painter published: its part, its local point, and the transform in force. */
export type AnchorRecord = { part: string; local: [number, number]; m: Affine };

/**
 * Where each anchor sits in the space it hangs from, for one frame.
 *
 * Returns `NaN` coordinates rather than throwing when a transform is degenerate,
 * because the audit reports that as a finding instead of dying on it.
 */
export function anchorsInSpace(anchors: AnchorRecord[]): { part: string; at: Point }[] {
  const byPart = new Map(anchors.map((anchor) => [anchor.part, anchor]));
  const out: { part: string; at: Point }[] = [];
  for (const anchor of anchors) {
    if (anchor.part === "chest") continue;
    const space = byPart.get(ANCHOR_SPACE[anchor.part] ?? "chest");
    if (!space) continue;
    const device = placePoint(anchor.m, anchor.local[0], anchor.local[1]);
    out.push({ part: anchor.part, at: unplacePoint(space.m, device.x, device.y) });
  }
  return out;
}

