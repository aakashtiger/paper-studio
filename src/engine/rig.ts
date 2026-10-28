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
