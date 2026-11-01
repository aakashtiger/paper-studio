/**
 * The collage, checked by the tool instead of approved by a person.
 *
 * Decision 0025 made the collage a hard stop before the render, and the user's
 * answer was blunt: *no manual approval — the whole point of this tool is that it
 * produces an end-to-end video from one idea*. So the stop has to be a verdict
 * the machine can reach on its own.
 *
 * It is a verdict about the things a machine can actually see, on one frame per
 * shot, painted through the film's real recipe and cast:
 *
 *   every shot produced a frame            `collage:missing`
 *   no frame is empty or a flat colour     `collage:blank`
 *   no two shots are the same picture      `collage:duplicate`
 *   every character the shot names drew    `collage:cast`
 *   no text runs off the frame             `collage:text`
 *
 * What it deliberately does not claim: that the film is good. A machine cannot
 * see that the arm is a plank. What it *can* do is refuse the collages that are
 * broken by construction — a character who never appeared, two shots that are one
 * picture, a frame that is a blank page — and put every shot on one page, in
 * order, so a person looking at one image sees the whole film.
 *
 * This module is pure. The script that calls it paints the frames, hashes them
 * and decodes the coarse samples; nothing here touches a file.
 */

export type CollageText = { text: string; x: number; y: number; w: number; h: number };

export type CollageFrame = {
  shot: string;
  /** The time inside the shot this frame was painted at. */
  time: number;
  /** sha256 of the painted PNG. Two equal hashes are the same picture. */
  hash: string;
  /**
   * Coarse RGB samples of the frame, row-major, 3 bytes a pixel.
   *
   * The sample exists so "blank" can be measured without a PNG decoder: a frame
   * that is one flat colour has almost no variance and almost no distinct
   * colours, whatever its size.
   */
  sample: number[];
  /** Characters whose rig actually drew in this frame, as the paint probe saw them. */
  characters: string[];
  /** Every text run the frame painted, with its box in frame pixels. */
  text: CollageText[];
};

export type CollageShot = {
  id: string;
  /** The characters the score says are in this shot. */
  cast: string[];
};

export type CollageInput = {
  film: string;
  shots: CollageShot[];
  frames: CollageFrame[];
  width: number;
  height: number;
};

export type CollageIssue = { code: string; message: string; shot?: string };

export type CollageReport = {
  film: string;
  ok: boolean;
  frames: number;
  /** Distinct pictures: 1 means every shot is the same image. */
  distinct: number;
  errors: CollageIssue[];
  warnings: CollageIssue[];
};

/** A frame flatter than this is a page, not a picture. */
export const BLANK_STDDEV = 2;
/** How many distinct colours a flat frame has. */
export const BLANK_COLOURS = 8;
/** Text closer than this share of the frame to its edge is crowding it. */
export const TEXT_CROWD = 0.03;

/** Luminance and the two flatness measures, from the coarse sample. */
export function flatness(sample: number[]): { stddev: number; colours: number } {
  if (sample.length < 3) return { stddev: 0, colours: 0 };
  const lums: number[] = [];
  const colours = new Set<number>();
  for (let index = 0; index + 2 < sample.length; index += 3) {
    const r = sample[index] ?? 0;
    const g = sample[index + 1] ?? 0;
    const b = sample[index + 2] ?? 0;
    lums.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
    colours.add((r << 16) | (g << 8) | b);
  }
  const mean = lums.reduce((sum, value) => sum + value, 0) / lums.length;
  const variance = lums.reduce((sum, value) => sum + (value - mean) ** 2, 0) / lums.length;
  return { stddev: Math.sqrt(variance), colours: colours.size };
}

export function checkCollage(input: CollageInput): CollageReport {
  const { film, shots, frames, width, height } = input;
  const errors: CollageIssue[] = [];
  const warnings: CollageIssue[] = [];

  const byShot = new Map<string, CollageFrame>();
  for (const frame of frames) {
    if (byShot.has(frame.shot)) {
      errors.push({
        code: "collage:twice",
        message: `shot "${frame.shot}" has two frames; the collage shows one frame per shot`,
        shot: frame.shot,
      });
      continue;
    }
    byShot.set(frame.shot, frame);
  }

  // 1 — every shot is on the page.
  for (const shot of shots) {
    if (!byShot.has(shot.id)) {
      errors.push({
        code: "collage:missing",
        message: `shot "${shot.id}" has no frame — the collage cannot show a shot that was never painted`,
        shot: shot.id,
      });
    }
  }
  const unknown = frames.filter((frame) => !shots.some((shot) => shot.id === frame.shot));
  for (const frame of unknown) {
    errors.push({
      code: "collage:unknown",
      message: `the collage has a frame for shot "${frame.shot}", which the score does not have`,
      shot: frame.shot,
    });
  }

  // 2 — the frames are pictures, and different pictures.
  const seen = new Map<string, string>();
  for (const frame of frames) {
    const { stddev, colours } = flatness(frame.sample);
    if (stddev < BLANK_STDDEV && colours < BLANK_COLOURS) {
      errors.push({
        code: "collage:blank",
        message:
          `shot "${frame.shot}" at ${frame.time}s is a flat frame (${colours} colour(s), ` +
          `luminance spread ${stddev.toFixed(2)}) — nothing was drawn`,
        shot: frame.shot,
      });
    }
    const twin = seen.get(frame.hash);
    if (twin) {
      errors.push({
        code: "collage:duplicate",
        message: `shots "${twin}" and "${frame.shot}" are the same picture — a shot was reused instead of staged`,
        shot: frame.shot,
      });
    } else {
      seen.set(frame.hash, frame.shot);
    }
  }

  // 3 — the people the score says are in a frame are the people the painter drew.
  for (const shot of shots) {
    const frame = byShot.get(shot.id);
    if (!frame) continue;
    for (const character of shot.cast) {
      if (!frame.characters.includes(character)) {
        errors.push({
          code: "collage:cast",
          message:
            `shot "${shot.id}" stages ${character}, and the frame painted without them ` +
            `(drew: ${frame.characters.length > 0 ? frame.characters.join(", ") : "nobody"})`,
          shot: shot.id,
        });
      }
    }
  }

  // 4 — text stays on the page. A frame, not a safe area: the safe area is
  // `audit:type`'s job on the finished film, at the film's own margins. Here the
  // question is only whether a word has fallen off the edge, which no margin
  // setting can excuse.
  for (const frame of frames) {
    for (const box of frame.text) {
      const off = box.x < -0.5 || box.y < -0.5 || box.x + box.w > width + 0.5 || box.y + box.h > height + 0.5;
      if (off) {
        errors.push({
          code: "collage:text",
          message:
            `shot "${frame.shot}" paints "${box.text}" off the frame ` +
            `(${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.w)}×${Math.round(box.h)} in ${width}×${height})`,
          shot: frame.shot,
        });
        continue;
      }
      const margin = TEXT_CROWD * Math.min(width, height);
      const crowd = Math.min(box.x, box.y, width - (box.x + box.w), height - (box.y + box.h));
      if (crowd < margin) {
        warnings.push({
          code: "collage:crowd",
          message: `shot "${frame.shot}" paints "${box.text}" ${Math.round(crowd)} px from the frame edge`,
          shot: frame.shot,
        });
      }
    }
  }

  return {
    film,
    ok: errors.length === 0,
    frames: frames.length,
    distinct: new Set(frames.map((frame) => frame.hash)).size,
    errors,
    warnings,
  };
}
