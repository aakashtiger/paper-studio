import type { Direction, ResolvedFilm } from "./treatment.js";
import { REVIEW_CHROME } from "./grid.js";

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

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * One HTML page holding every board card. Written as `index.html` and, when
 * Chrome is present, captured as `board-sheet.png`, so the whole board is
 * reviewed on one image instead of card by card.
 *
 * The page reports its measured height (`data-sheet-height`) on load: new
 * headless Chrome screenshots the window, not the page, so the height has to be
 * read, not guessed.
 */
export function boardSheet(film: string, entries: BoardEntry[]): string {
  const cards = entries
    .map((entry) => {
      const slots = Object.entries(entry.slots)
        .map(([key, value]) => `<div class="slot"><b>${esc(key)}</b> ${esc(value)}</div>`)
        .join("");
      return `<article class="card">
  <header><span class="time">${entry.time.toFixed(2)}s · f${entry.frame}</span><span class="recipe">${esc(entry.recipe)}</span></header>
  <h2>${esc(entry.label)}</h2>
  ${slots}
  <p class="spine">${esc(entry.direction.spine)}</p>
  <p class="state">${esc(entry.direction.entry)} → ${esc(entry.direction.exit)}</p>
</article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(film)} — board</title>
<style>
  body { margin: 32px; background: ${REVIEW_CHROME.bg}; color: ${REVIEW_CHROME.text}; font: 14px/1.4 system-ui, sans-serif; }
  h1 { font-size: 20px; letter-spacing: .08em; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .card { background: ${REVIEW_CHROME.panel}; border: 1px solid ${REVIEW_CHROME.line}; color: ${REVIEW_CHROME.text}; border-radius: 2px; padding: 16px; }
  header { display: flex; justify-content: space-between; font: 11px/1.2 ui-monospace, monospace; color: ${REVIEW_CHROME.muted}; }
  h2 { font-size: 18px; margin: 12px 0 8px; }
  .slot { font: 12px/1.5 ui-monospace, monospace; }
  .spine { margin-top: 12px; font-weight: 600; }
  .state { font-size: 12px; color: ${REVIEW_CHROME.muted}; }
</style></head>
<body><h1>${esc(film)} — board · ${entries.length} frames</h1><div class="grid">
${cards}
</div>
<script>addEventListener('load',function(){document.documentElement.setAttribute('data-sheet-height',String(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)))})</script>
</body></html>
`;
}
