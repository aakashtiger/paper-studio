/**
 * Text must never sit on a face.
 *
 * The paint probe records a face anchor with a local box (size in rig units).
 * This module maps that box through the anchor's device matrix and tests every
 * text box against it. It is pure: no paint, no canvas.
 */

export type FaceBox = {
  character: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TextBoxLike = {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  copy?: boolean;
};

type AnchorRecord = {
  kind?: string;
  character?: string;
  part?: string;
  local?: [number, number];
  size?: [number, number];
  m?: [number, number, number, number, number, number];
};

function apply(
  m: [number, number, number, number, number, number],
  x: number,
  y: number,
): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** Every face box the probe recorded, as an axis-aligned device-space box. */
export function faceBoxes(records: readonly AnchorRecord[]): FaceBox[] {
  const boxes: FaceBox[] = [];
  for (const record of records) {
    if (record.kind !== "anchor" || record.part !== "face") continue;
    const m = record.m;
    const size = record.size;
    if (!m || !size || !(size[0] > 0) || !(size[1] > 0)) continue;
    const local = record.local ?? [0, 0];
    const hw = size[0] / 2;
    const hh = size[1] / 2;
    const corners = [
      apply(m, local[0] - hw, local[1] - hh),
      apply(m, local[0] + hw, local[1] - hh),
      apply(m, local[0] + hw, local[1] + hh),
      apply(m, local[0] - hw, local[1] + hh),
    ];
    const xs = corners.map(([x]) => x);
    const ys = corners.map(([, y]) => y);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    boxes.push({
      character: String(record.character ?? ""),
      x,
      y,
      w: Math.max(...xs) - x,
      h: Math.max(...ys) - y,
    });
  }
  return boxes;
}

export type TextOnFace = {
  text: string;
  box: TextBoxLike;
  face: FaceBox;
  overlap: number;
  share: number;
};

function intersection(a: TextBoxLike, b: FaceBox, tolerance: number): number {
  const x0 = Math.max(a.x, b.x + tolerance);
  const y0 = Math.max(a.y, b.y + tolerance);
  const x1 = Math.min(a.x + a.w, b.x + b.w - tolerance);
  const y1 = Math.min(a.y + a.h, b.y + b.h - tolerance);
  return Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
}

/** Any positive overlap, with 1 px of glyph side-bearing tolerance. */
export function textOnFace(
  boxes: readonly TextBoxLike[],
  faces: readonly FaceBox[],
  tolerance = 1,
): TextOnFace[] {
  const out: TextOnFace[] = [];
  for (const box of boxes) {
    for (const face of faces) {
      const overlap = intersection(box, face, tolerance);
      if (overlap <= 0) continue;
      out.push({
        text: box.text,
        box,
        face,
        overlap: Number(overlap.toFixed(1)),
        share: Number((overlap / Math.max(1, face.w * face.h)).toFixed(3)),
      });
    }
  }
  return out;
}