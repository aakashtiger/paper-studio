/**
 * A reaction has to land on the word.
 *
 * A pose, a hand, a light or a slam can carry `word: "<line id>"`: this event is
 * the picture answering that line. The measured line start is the authority
 * (0044/0037), and the event must land on it or within **three frames** after
 * it. Earlier than the word is the classic defect: the face reacts before the
 * audience has heard what it is reacting to.
 *
 * The window is 0–3 frames, with half a frame of tolerance for the frame grid.
 */
export type ReactionEvent = {
  t: number;
  kind: string;
  note: string;
  word?: string;
};

export type ReactionShot = {
  id: string;
  start: number;
  duration: number;
  direction?: { events: ReactionEvent[] };
};

export type ReactionLine = { id: string; start: number };

export type Reaction = {
  shot: string;
  kind: string;
  word: string;
  at: number;
  lineStart: number;
  delta: number;
  frames: number;
};

export type ReactionFinding = {
  code: "reaction:word" | "reaction:early" | "reaction:late";
  message: string;
  shot?: string;
  word?: string;
};

export const REACTION_WINDOW_FRAMES = 3;

export function checkReactions(
  shots: ReactionShot[],
  lines: ReactionLine[],
  fps: number,
): { reactions: Reaction[]; findings: ReactionFinding[]; windowFrames: number } {
  if (!(fps > 0)) throw new Error(`fps must be positive, got ${fps}`);
  const byId = new Map(lines.map((line) => [line.id, line]));
  const window = REACTION_WINDOW_FRAMES / fps;
  const tolerance = 0.5 / fps;
  const reactions: Reaction[] = [];
  const findings: ReactionFinding[] = [];

  for (const shot of shots) {
    for (const event of shot.direction?.events ?? []) {
      if (!event.word) continue;
      const line = byId.get(event.word);
      if (!line) {
        findings.push({
          code: "reaction:word",
          message: `${shot.id} ${event.kind} at ${event.t}s answers line "${event.word}", which the clock does not have`,
          shot: shot.id,
          word: event.word,
        });
        continue;
      }
      const at = shot.start + event.t;
      const delta = at - line.start;
      const frames = delta * fps;
      reactions.push({ shot: shot.id, kind: event.kind, word: event.word, at, lineStart: line.start, delta, frames });
      if (delta < -tolerance) {
        findings.push({
          code: "reaction:early",
          message:
            `${shot.id} ${event.kind} at ${at.toFixed(2)}s is ${Math.abs(frames).toFixed(1)} frames BEFORE ` +
            `line "${event.word}" (${line.start.toFixed(2)}s) — the picture reacts before the word`,
          shot: shot.id,
          word: event.word,
        });
      } else if (delta > window + tolerance) {
        findings.push({
          code: "reaction:late",
          message:
            `${shot.id} ${event.kind} at ${at.toFixed(2)}s is ${frames.toFixed(1)} frames after ` +
            `line "${event.word}" (${line.start.toFixed(2)}s) — the window is 0–${REACTION_WINDOW_FRAMES} frames`,
          shot: shot.id,
          word: event.word,
        });
      }
    }
  }
  return { reactions, findings, windowFrames: REACTION_WINDOW_FRAMES };
}
