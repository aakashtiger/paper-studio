/**
 * `film:new` scaffolds, it never invents.
 *
 * The skeleton carries only what the brief already states: identity, style,
 * aspect, duration, fps and the brief's own audio mode. The creative fields —
 * the edit envelope, the shots, their direction, the copy, the captions and the
 * assets — are left empty, and `filmGaps` names exactly what the director must
 * fill. There is no placeholder shot, no sample line and no guessed recipe.
 */
import type { FilmBrief } from "./film-brief.js";

export type SkeletonOptions = {
  /** Repo-relative path of the brief the score points back to. */
  briefPath: string;
};

/** A legal-shaped score with nothing creative invented yet. */
export function filmSkeleton(brief: FilmBrief, options: SkeletonOptions): Record<string, unknown> {
  return {
    id: brief.id,
    style: brief.style,
    styleVersion: brief.styleVersion,
    aspect: brief.aspect,
    fps: brief.fps,
    duration: brief.duration,
    // A deterministic default the director may change; not a creative choice.
    seed: brief.id,
    brief: options.briefPath,
    // The edit envelope is a creative choice; zeros fail validation on purpose.
    edit: { minShot: 0, medianShot: 0, maxShot: 0 },
    // `free` means "no clock chosen yet"; it invents no tempo.
    clock: { mode: "free" },
    audio: { mode: brief.audioMode },
    captions: { source: `films/${brief.id}/captions.srt`, lines: [] },
    assets: [],
    cast: [],
    shots: [],
  };
}

type AnyRecord = Record<string, unknown>;

const record = (value: unknown): AnyRecord =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as AnyRecord) : {};
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const positive = (value: unknown): boolean => typeof value === "number" && value > 0;

/**
 * The precise list of fields a director must fill. Derived from the score's own
 * content, so it is empty for a finished score and names every gap for a
 * scaffold — the same function drives the command and its test.
 */
export function filmGaps(score: unknown): string[] {
  const gaps: string[] = [];
  const root = record(score);

  const edit = record(root.edit);
  if (!positive(edit.minShot) || !positive(edit.medianShot) || !positive(edit.maxShot)) {
    gaps.push("edit.minShot / edit.medianShot / edit.maxShot: the shot-length envelope in seconds (all three, each > 0)");
  }

  const audio = record(root.audio);
  const mode = typeof audio.mode === "string" ? audio.mode : null;
  const sources = ["narration", "music", "sfx"].filter((key) => audio[key] !== undefined).length;
  if (!mode) {
    gaps.push("audio.mode: music / narration / sfx / hybrid");
  } else if (mode === "narration" && audio.narration === undefined) {
    gaps.push("audio.narration: the narration block (source, and a voice/voiceId, transcript and srt)");
  } else if (mode === "music" && audio.music === undefined) {
    gaps.push("audio.music: the music block (source, and a track or a generated beat map)");
  } else if (mode === "sfx" && audio.sfx === undefined) {
    gaps.push("audio.sfx: the sfx block (source \"generated\" and its cues)");
  } else if (mode === "hybrid" && sources < 2) {
    gaps.push("audio: hybrid needs at least two of narration, music and sfx");
  }

  const captions = record(root.captions);
  if (list(captions.lines).length === 0) {
    gaps.push("captions.lines: at least one caption line (id, text, start, end)");
  }

  if (list(root.assets).length === 0) {
    gaps.push("assets: at least one asset (id, type, source, path)");
  }

  const shots = list(root.shots);
  if (shots.length === 0) {
    gaps.push("shots: at least one shot (recipe, duration, slots, and a direction with entry, exit, spine and at least three events)");
  } else {
    shots.forEach((value, index) => {
      const shot = record(value);
      const where = typeof shot.recipe === "string" ? `${shot.recipe} (#${index + 1})` : `shot #${index + 1}`;
      if (typeof shot.recipe !== "string" || !positive(shot.duration)) {
        gaps.push(`${where}: a recipe id and a duration`);
      }
      const direction = record(shot.direction);
      if (typeof direction.entry !== "string" || typeof direction.exit !== "string" || typeof direction.spine !== "string") {
        gaps.push(`${where}.direction: entry, exit and spine`);
      }
      if (list(direction.events).length < 3) {
        gaps.push(`${where}.direction.events: at least three events (t, kind, note)`);
      }
    });
  }

  return gaps;
}
