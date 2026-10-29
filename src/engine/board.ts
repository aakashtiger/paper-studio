import type { Direction, ResolvedFilm } from "./treatment.js";

export type BoardEntry = {
  id: string;
  shotId: string;
  time: number;
  frame: number;
  label: string;
  recipe: string;
  slots: Record<string, string>;
  direction: Direction;
};

/**
 * The board is a view of the score, not a fixed artifact.
 * One entry per shot at its poster moment, plus any event the director marks
 * with kind "board" (or a note containing the word "board").
 */
export function buildBoard(plan: ResolvedFilm): BoardEntry[] {
  const entries: BoardEntry[] = [];

  for (const shot of plan.shots) {
    const poster = shot.start + Math.min(shot.duration * 0.5, 1.2);
    entries.push({
      id: `${shot.id}-poster`,
      shotId: shot.id,
      time: round(poster),
      frame: Math.round(poster * plan.fps),
      label: `${shot.id} · ${shot.recipe}`,
      recipe: shot.recipe,
      slots: shot.slots,
      direction: shot.direction,
    });

    for (const [index, event] of shot.direction.events.entries()) {
      if (event.kind === "board" || /\bboard\b/i.test(event.note)) {
        const time = round(shot.start + event.t);
        entries.push({
          id: `${shot.id}-beat-${index + 1}`,
          shotId: shot.id,
          time,
          frame: Math.round(time * plan.fps),
          label: `${shot.id} · ${event.note}`,
          recipe: shot.recipe,
          slots: shot.slots,
          direction: shot.direction,
        });
      }
    }
  }

  return entries.sort((a, b) => a.time - b.time);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
