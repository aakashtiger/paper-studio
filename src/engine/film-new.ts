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
import { DEFAULT_PACE } from "./preflight.js";
import type { Pace } from "./story.js";

export type SkeletonOptions = {
  /** Repo-relative path of the brief the score points back to. */
  briefPath: string;
  /** The tempo band this film is written to: the style's, or the default. */
  pace?: Pace;
};

/**
 * Stage 1 — the story, scaffolded and empty of invention.
 *
 * Only the facts are written: identity, length, and the tempo band the film is
 * measured against (so the band is visible rather than implied). Every sentence
 * a person has to mean is an empty string, and `storyGaps` names them.
 */
export function storySkeleton(brief: FilmBrief, options: SkeletonOptions): Record<string, unknown> {
  return {
    id: brief.id,
    title: "",
    duration: brief.duration,
    audience: "",
    tone: "",
    logline: "",
    spine: { want: "", obstacle: "", turn: "", button: "" },
    pace: options.pace ?? DEFAULT_PACE,
    narration: [],
    mustSay: [],
  };
}

/**
 * Stage 2 — the beats, scaffolded.
 *
 * No beat is written for the director: a beat's share, energy and signature
 * sound are the film's shape, and a scaffold that guessed them would be writing
 * the film. The file exists so the stage exists.
 */
export function beatsSkeleton(brief: FilmBrief): Record<string, unknown> {
  return { id: brief.id, beats: [] };
}

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
const text = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0;

/**
 * The precise list of fields a director must fill in the **story and beats** —
 * stage 1 and 2. Derived from the documents themselves, so it is empty for a
 * written film and names every gap for a scaffold: the same function drives the
 * command and its test.
 */
export function storyGaps(story: unknown, beats: unknown): string[] {
  const gaps: string[] = [];
  const root = record(story);

  for (const field of ["title", "audience", "tone", "logline"]) {
    if (!text(root[field])) gaps.push(field);
  }
  const spine = record(root.spine);
  for (const field of ["want", "obstacle", "turn", "button"]) {
    if (!text(spine[field])) gaps.push(`spine.${field}`);
  }
  if (list(root.narration).length === 0) {
    gaps.push("narration: at least one line (id, beat, text) — a narrated film is spoken end to end");
  } else {
    list(root.narration).forEach((value, index) => {
      const line = record(value);
      const where = `narration[${index}]`;
      if (!text(line.id) || !text(line.beat)) gaps.push(`${where}: an id and the beat it belongs to`);
      if (!text(line.text)) gaps.push(`${where}.text`);
    });
  }

  const map = record(beats);
  const written = list(map.beats);
  if (written.length === 0) {
    gaps.push("beats: at least one beat (id, title, purpose, share, energy, sound.world, sound.signature)");
  } else {
    let share = 0;
    written.forEach((value, index) => {
      const beat = record(value);
      const where = `beats[${index}]`;
      if (!text(beat.id) || !text(beat.title) || !text(beat.purpose)) {
        gaps.push(`${where}: id, title and purpose (hook / setup / escalate / turn / release / button)`);
      }
      if (!positive(beat.share)) gaps.push(`${where}.share: percent of the film this beat owns`);
      if (!Number.isInteger(beat.energy)) gaps.push(`${where}.energy: 1–5`);
      const sound = record(beat.sound);
      if (!text(sound.world)) gaps.push(`${where}.sound.world: what the place sounds like`);
      if (!text(sound.signature)) gaps.push(`${where}.sound.signature: the one sound that names the beat`);
      share += typeof beat.share === "number" ? beat.share : 0;
    });
    if (written.length > 0 && Math.abs(share - 100) > 1e-6) {
      gaps.push(`beats[].share: the beats add up to ${share}%, not 100%`);
    }
  }

  return gaps;
}

/**
 * The precise list of fields a director must fill in the **score** — stage 4.
 * Derived from the score's own content, so it is empty for a finished score and
 * names every gap for a scaffold — the same function drives the command and its
 * test.
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
