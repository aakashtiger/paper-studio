import { z } from "zod";
import { NARRATION_HOLE_MAX, countWords, type Beats, type Issue, type Story } from "./story.js";

/**
 * Stage 3 — the scenes (decision 0025, implemented by 0035).
 *
 * A scene is the high level of the cut: where it happens, who is in it, and
 * which narration lines it carries. It sits between the beat map and the shot
 * list, and it is **authored**, not derived from the shots: the user's order is
 * story -> beat -> scene -> shot, and a document that is reverse-engineered from
 * the shots cannot refuse a shot list that has no scene.
 *
 * Until 0035 this stage did not exist. `film:new` told the director to write
 * `scenes.json`, `story.ts` named it as one of four documents, and no schema,
 * command or check ever read it — so the order the repository promised was the
 * order it did not enforce.
 *
 * The timing rule is the measured narration, not a hope: a scene may not be
 * shorter than the words spoken in it, and (unless its beat is declared quiet)
 * it may not carry more than one narration hole of air beyond them.
 */

export const SceneVisualSchema = z
  .object({
    /** What the audience must see, in plain words — the subject of the shot. */
    subject: z.string().min(1),
    setting: z.string().min(1),
    action: z.string().min(1),
    /** The props the frame needs; the shot's recipe must be able to draw them. */
    props: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const SceneSchema = z.object({
  id: z.string().min(1),
  /** The beat of `beats.json` this scene serves. */
  beat: z.string().min(1),
  title: z.string().min(1),
  /** Where it happens, in the film's own words. */
  place: z.string().min(1),
  /** What happens, in one line. A scene with no event is a set, not a scene. */
  summary: z.string().min(1),
  /** The visual idea this scene is built around, before any recipe is chosen. */
  visual: SceneVisualSchema.optional(),
  /** Who is in it. Checked against the film's declared cast. */
  cast: z.array(z.string().min(1)).default([]),
  /** The narration lines it carries, by id. Every line belongs to one scene. */
  lines: z.array(z.string().min(1)).default([]),
  /** Seconds this scene owns. The scenes must cover the film exactly. */
  duration: z.number().positive(),
  /**
   * Which of the pack's `identity.filmBands.moods` this scene claims. Omitted
   * means it inherits the film's mood. An unknown name is a finding, never a
   * silent fallback.
   */
  mood: z.string().min(1).optional(),
}).strict();

export const ScenesSchema = z
  .object({
    id: z.string().min(1),
    scenes: z.array(SceneSchema).min(1),
  })
  .strict();

export type Scene = z.infer<typeof SceneSchema>;
export type Scenes = z.infer<typeof ScenesSchema>;
export type MeasuredLine = { id: string; start: number; duration: number };

export type SceneReport = {
  scene: Scene;
  words: number;
  lines: number;
  /** Measured (or, before voice, estimated) seconds spoken in the scene. */
  spoken: number;
  /** Seconds the scene owns beyond its words. */
  air: number;
};

export type SceneCheck = { errors: Issue[]; warnings: Issue[]; report: SceneReport[] };

/** How far a scene may fall short of its own words, or overshoot them by one breath. */
export const SCENE_AIR_MAX = NARRATION_HOLE_MAX;
export const SCENE_SPOKEN_SLACK = 0.3;

/** How late a scene may start before its first line. A narrated short does not clear its throat. */
export const SCENE_LEAD_MAX = 1;

/** The scenes must cover the film exactly; float sums are not exact. */
export const SCENE_TOTAL_SLACK = 0.5;

const secs = (value: number) => `${value.toFixed(1)}s`;
const pct = (value: number) => `${(value * 100).toFixed(0)}%`;

export function checkScenes(
  scenes: Scenes,
  story: Story,
  beats: Beats,
  measured?: MeasuredLine[] | null,
  castNames?: string[],
): SceneCheck {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const beatById = new Map(beats.beats.map((beat, index) => [beat.id, { beat, index }]));
  const lineById = new Map(story.narration.map((line) => [line.id, line]));
  const measuredById = new Map((measured ?? []).map((line) => [line.id, line]));
  const cast = new Set((castNames ?? []).map((name) => name.toLowerCase()));

  if (scenes.id !== story.id) {
    errors.push({
      code: "scene:id",
      message: `scenes.json is "${scenes.id}" but the story is "${story.id}" — the two documents are not the same film`,
    });
  }

  const wordRate = ((story.pace.wpm[0] + story.pace.wpm[1]) / 2) / 60;
  const placed = new Map<string, string>();
  const seenScenes = new Set<string>();
  const perBeat = new Map<string, number>();
  const report: SceneReport[] = [];
  let sceneAt = 0;
  let lastBeat = -1;

  for (const scene of scenes.scenes) {
    if (seenScenes.has(scene.id)) {
      errors.push({ code: "scene:duplicate", message: `scene "${scene.id}" is declared twice` });
    }
    seenScenes.add(scene.id);

    const beatEntry = beatById.get(scene.beat);
    if (!beatEntry) {
      errors.push({
        code: "scene:orphan",
        message: `scene "${scene.id}" serves beat "${scene.beat}", which beats.json does not have`,
      });
    } else {
      if (beatEntry.index < lastBeat) {
        warnings.push({
          code: "scene:order",
          message: `scene "${scene.id}" returns to beat "${scene.beat}" after a later beat — a cross-cut, fine if it means to`,
        });
      }
      lastBeat = Math.max(lastBeat, beatEntry.index);
      perBeat.set(scene.beat, (perBeat.get(scene.beat) ?? 0) + 1);
    }

    for (const who of scene.cast) {
      if (cast.size > 0 && !cast.has(who.toLowerCase())) {
        errors.push({
          code: "scene:cast",
          message: `scene "${scene.id}" names "${who}", who is not in the film's cast`,
        });
      }
    }

    let words = 0;
    let spoken = 0;
    let firstStart: number | null = null;
    const own = new Set<string>();
    for (const id of scene.lines) {
      if (own.has(id)) {
        errors.push({ code: "scene:line", message: `scene "${scene.id}" lists line "${id}" twice` });
        continue;
      }
      own.add(id);
      const line = lineById.get(id);
      if (!line) {
        errors.push({
          code: "scene:line-unknown",
          message: `scene "${scene.id}" carries line "${id}", which story.json does not have`,
        });
        continue;
      }
      if (line.beat !== scene.beat) {
        errors.push({
          code: "scene:line-beat",
          message: `scene "${scene.id}" is on beat "${scene.beat}" but carries line "${id}", which belongs to "${line.beat}"`,
        });
      }
      const owner = placed.get(id);
      if (owner) {
        errors.push({
          code: "scene:line-twice",
          message: `line "${id}" is in scene "${owner}" and again in "${scene.id}" — a line is said once`,
        });
      } else {
        placed.set(id, scene.id);
      }
      words += countWords(line.text);

      if (measured) {
        const timed = measuredById.get(id);
        if (!timed) {
          errors.push({
            code: "scene:unmeasured",
            message: `scene "${scene.id}" carries line "${id}", which the measured clock does not have`,
          });
        } else {
          spoken += timed.duration;
          firstStart = firstStart === null ? timed.start : Math.min(firstStart, timed.start);
        }
      } else {
        // Before the voice exists, judge the writing at the band it declares.
        spoken += wordRate > 0 ? countWords(line.text) / wordRate : 0;
      }
    }

    const air = scene.duration - spoken;
    const quiet = beatEntry?.beat.sound.quiet ?? false;
    if (air < -SCENE_SPOKEN_SLACK) {
      errors.push({
        code: "scene:short",
        message:
          `scene "${scene.id}" is ${secs(scene.duration)} but its lines speak for ${secs(spoken)} — ` +
          `the scene is shorter than the words in it`,
      });
    } else if (!quiet && air > SCENE_AIR_MAX + SCENE_SPOKEN_SLACK) {
      errors.push({
        code: "scene:air",
        message:
          `scene "${scene.id}" owns ${secs(scene.duration)} and its lines speak for ${secs(spoken)} — ` +
          `${secs(air)} of air, more than the ${SCENE_AIR_MAX}s a scene may hold without saying anything`,
      });
    }

    if (measured && firstStart !== null && !quiet && firstStart - sceneAt > SCENE_LEAD_MAX) {
      errors.push({
        code: "scene:lead",
        message:
          `scene "${scene.id}" starts at ${secs(sceneAt)} and its first line starts at ${secs(firstStart)} — ` +
          `${secs(firstStart - sceneAt)} of dead air before the scene speaks (max ${SCENE_LEAD_MAX}s)`,
      });
    }

    report.push({ scene, words, lines: scene.lines.length, spoken: Number(spoken.toFixed(2)), air: Number(air.toFixed(2)) });
    sceneAt += scene.duration;
  }

  // Every line is said once, in one scene.
  for (const line of story.narration) {
    if (!placed.has(line.id)) {
      errors.push({
        code: "scene:line-unplaced",
        message: `line "${line.id}" is in story.json and in no scene — the film would never say it`,
      });
    }
  }

  // Every beat is filmed.
  for (const beat of beats.beats) {
    if (!perBeat.has(beat.id)) {
      errors.push({
        code: "scene:beat-empty",
        message: `beat ${beat.id} ("${beat.title}") has no scene — it is written and never staged`,
      });
    }
  }

  // The scenes are the film, start to end.
  const total = scenes.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  if (Math.abs(total - story.duration) > SCENE_TOTAL_SLACK) {
    errors.push({
      code: "scene:total",
      message:
        `the scenes total ${secs(total)}, not the film's ${secs(story.duration)} — ` +
        `${pct(Math.abs(total - story.duration) / story.duration)} of the film is unclaimed or double-claimed`,
    });
  }

  return { errors, warnings, report };
}
