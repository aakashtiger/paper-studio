import { z } from "zod";
import { mustSayGaps } from "./film-brief.js";

/**
 * The film as it is *written*, before it is shot.
 *
 * A film used to begin at the shot list: one `score.json` with ten shots, seven
 * narration lines and thirty-five sound hooks, written in a single pass. That is
 * how *Same Alarm* shipped with twenty-one words of narration in sixty seconds,
 * ten shots averaging six seconds, and one noise bed under the whole thing: the
 * picture had a contract, and the writing had none, so nothing could refuse it.
 *
 * There are now four documents, each one a smaller screen than the last:
 *
 *   story.json   what happens, and what is said, in words and seconds
 *   beats.json   the turns of it, and what each one sounds like
 *   scenes.json  where it happens, and who is in it
 *   score.json   the shots: camera, staging, timing, cues
 *
 * This module is the first two. It is pure: give it the two files and it says
 * whether the writing is filmable, in the numbers a viewer would use — words per
 * minute, seconds per beat, and how much of the film each beat is allowed to be
 * silent for. The commands that measure a rendered film cannot answer any of
 * that, which is the entire reason a film with no story could pass twenty-one of
 * them.
 */

/**
 * The two numbers a style has to declare, not the engine.
 *
 * 2.5 s is the median shot length of a Short or a Reel in this idiom; a minute
 * at six seconds a shot is a slideshow, and the film that taught us this scored
 * 6.0. 140–150 words a minute is what keeps a narrated short from having holes
 * in it — the film that taught us this had 21.
 */
export const PaceSchema = z.object({
  /** Words per minute the narration is written to, as [min, max]. */
  wpm: z.tuple([z.number().positive(), z.number().positive()]),
  /** Median shot length in seconds, as [min, max]. */
  medianShot: z.tuple([z.number().positive(), z.number().positive()]),
});

export type Pace = z.infer<typeof PaceSchema>;

export const NARRATION_LINE_MAX_WORDS = 22;

/**
 * How long a narrated film may go with no words in it.
 *
 * Shared with the scene check: a scene may not carry more air than this without
 * saying something, and the preflight refuses a hole this long anywhere in the
 * film. One number, so the two checks cannot drift apart.
 */
export const NARRATION_HOLE_MAX = 2.5;

export const StorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** The film's length in seconds. Everything downstream is measured against it. */
  duration: z.number().positive(),
  audience: z.string().min(1),
  tone: z.string().min(1),
  logline: z.string().min(1),
  /**
   * The spine. Four sentences, and a film that cannot fill them in has no story:
   * somebody wants something, something is in the way, it turns, and it lands.
   */
  spine: z.object({
    want: z.string().min(1),
    obstacle: z.string().min(1),
    turn: z.string().min(1),
    button: z.string().min(1),
  }),
  pace: PaceSchema,
  /** Spoken or sung words, in order. Each line belongs to exactly one beat. */
  narration: z
    .array(
      z.object({
        id: z.string().min(1),
        beat: z.string().min(1),
        text: z.string().min(1),
        /** Delivery, not content: "flat", "quick", "almost a whisper". */
        tone: z.string().optional(),
      }),
    )
    .default([]),
  /** A song film says the same thing with a lyric; the clock rules do not move. */
  song: z.object({ id: z.string().min(1), note: z.string().optional() }).optional(),
  /** The phrases the film promises to say, checked as words (see `mustSayGaps`). */
  mustSay: z.array(z.string()).default([]),
  voice: z
    .object({
      provider: z.string().min(1),
      voiceId: z.string().min(1),
      /** Where the voice sits; a style that wants a faster read says so here. */
      speed: z.number().positive().optional(),
    })
    .optional(),
});

export type Story = z.infer<typeof StorySchema>;

export const BEAT_PURPOSES = ["hook", "setup", "escalate", "turn", "release", "button"] as const;

export const BeatsSchema = z.object({
  id: z.string().min(1),
  beats: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        purpose: z.enum(BEAT_PURPOSES),
        /** Percent of the film's duration this beat owns. Must total 100. */
        share: z.number().positive(),
        energy: z.number().int().min(1).max(5),
        sound: z.object({
          /** What the place sounds like under this beat. */
          world: z.string().min(1),
          /** The one sound that names the beat — the thing the audience remembers. */
          signature: z.string().min(1),
          /** True when this beat is allowed to be silent: no bed, no wall of sound. */
          quiet: z.boolean().default(false),
        }),
      }),
    )
    .min(1),
});

export type Beats = z.infer<typeof BeatsSchema>;
export type Beat = Beats["beats"][number];

export type Issue = { code: string; message: string };

export type BeatReport = {
  beat: Beat;
  seconds: number;
  words: number;
  lines: number;
};

export type StoryReport = {
  id: string;
  duration: number;
  words: number;
  wpm: number;
  wpmBand: [number, number];
  medianShotBand: [number, number];
  spine: Story["spine"];
  beats: BeatReport[];
  /** How much of the film's words each beat carries, next to its share of time. */
  balance: { beat: string; timeShare: number; wordShare: number }[];
};

export type StoryCheck = { errors: Issue[]; warnings: Issue[]; report: StoryReport };

const WORD = /[A-Za-z0-9][A-Za-z0-9'’-]*/g;

/** Words in a line of narration, counted the way a reader counts them. */
export function countWords(text: string): number {
  return (text.match(WORD) ?? []).length;
}

const pct = (value: number) => `${(value * 100).toFixed(0)}%`;

/**
 * Is the writing filmable?
 *
 * Every check below is one that a film in this repository has failed in
 * production, not a style preference. They are refusals, not advice: the point
 * is that the cheapest place to catch "this film has nothing to say for sixteen
 * seconds" is the page, not the rendering.
 */
export function checkStory(story: Story, beats: Beats): StoryCheck {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const byId = new Map(beats.beats.map((beat) => [beat.id, beat]));

  if (beats.id !== story.id) {
    errors.push({
      code: "story:id",
      message: `beats.json is "${beats.id}" but the story is "${story.id}" — the two documents are not the same film`,
    });
  }

  const words = story.narration.reduce((sum, line) => sum + countWords(line.text), 0);
  const [wpmMin, wpmMax] = story.pace.wpm;
  const wpm = story.duration > 0 ? (words / story.duration) * 60 : 0;

  // 1 — the film has something to say, and says it at the declared speed.
  if (story.narration.length === 0 && !story.song) {
    errors.push({
      code: "story:silent",
      message: "no narration and no song: the film would have nothing to say",
    });
  }
  if (wpmMax < wpmMin) {
    errors.push({ code: "story:pace", message: `pace.wpm is [${wpmMin}, ${wpmMax}] — min is above max` });
  } else if (words > 0 && (wpm < wpmMin || wpm > wpmMax)) {
    errors.push({
      code: "story:wpm",
      message:
        `${words} words in ${story.duration.toFixed(1)}s is ${wpm.toFixed(0)} wpm, outside the declared ` +
        `${wpmMin}–${wpmMax} band (${Math.round((wpmMin * story.duration) / 60)}–` +
        `${Math.round((wpmMax * story.duration) / 60)} words for this length)`,
    });
  }
  if (story.pace.medianShot[1] < story.pace.medianShot[0]) {
    errors.push({ code: "story:pace", message: "pace.medianShot min is above max" });
  }

  // 2 — every line is on a beat, and every beat says something.
  const seen = new Set<string>();
  const perBeat = new Map<string, number>();
  for (const line of story.narration) {
    if (seen.has(line.id)) {
      errors.push({ code: "story:line-id", message: `narration line "${line.id}" is declared twice` });
    }
    seen.add(line.id);
    if (!byId.has(line.beat)) {
      errors.push({
        code: "story:orphan",
        message: `narration line "${line.id}" belongs to beat "${line.beat}", which beats.json does not have`,
      });
      continue;
    }
    const count = countWords(line.text);
    if (count < 2) {
      errors.push({ code: "story:line", message: `narration line "${line.id}" is ${count} word(s)` });
    }
    if (count > NARRATION_LINE_MAX_WORDS) {
      warnings.push({
        code: "story:line-long",
        message: `narration line "${line.id}" is ${count} words — past ${NARRATION_LINE_MAX_WORDS} a line stops being one breath`,
      });
    }
    perBeat.set(line.beat, (perBeat.get(line.beat) ?? 0) + count);
  }

  // 3 — the beats are a shape, not a list: a hook, one turn, a button.
  const purposes = beats.beats.map((beat) => beat.purpose);
  const count = (purpose: string) => purposes.filter((p) => p === purpose).length;
  if (beats.beats[0]?.purpose !== "hook") {
    errors.push({ code: "story:hook", message: `the first beat is "${purposes[0]}", not a hook` });
  }
  if (beats.beats[beats.beats.length - 1]?.purpose !== "button") {
    errors.push({
      code: "story:button",
      message: `the last beat is "${purposes[purposes.length - 1]}", not a button — a film has to land`,
    });
  }
  if (count("turn") === 0) {
    errors.push({
      code: "story:turn",
      message: "no beat turns: a film of escalation with no reversal is ten shots of the same thing",
    });
  }
  if (count("turn") > 1) {
    errors.push({ code: "story:turn", message: `${count("turn")} beats are marked turn — there is one turn` });
  }
  if (count("hook") > 1 || count("button") > 1) {
    errors.push({ code: "story:ends", message: "more than one hook or more than one button" });
  }

  // 4 — the energy moves. A flat curve is a film with no dynamics, whatever the shots do.
  const energies = beats.beats.map((beat) => beat.energy);
  const spread = Math.max(...energies) - Math.min(...energies);
  if (spread < 2) {
    errors.push({
      code: "story:flat",
      message: `energy spans ${spread} of 4 (${energies.join("/")}) — the film never lifts or drops`,
    });
  }

  // 5 — the beats cover the film exactly.
  const shareSum = beats.beats.reduce((sum, beat) => sum + beat.share, 0);
  if (Math.abs(shareSum - 100) > 0.5) {
    errors.push({
      code: "story:share",
      message: `beat shares total ${shareSum.toFixed(1)}%, not 100% — some of the film is unclaimed`,
    });
  }

  // 6 — no beat is silent by accident, and at least one is silent on purpose.
  const quiet = beats.beats.filter((beat) => beat.sound.quiet);
  if (quiet.length === 0) {
    errors.push({
      code: "story:air",
      message:
        "no beat is allowed to be quiet: a film scored wall to wall has no contrast, and the " +
        "delivered mix of Same Alarm measured −15.2 LUFS in its gaps against −13.8 in its speech",
    });
  }

  // 7 — time and words are distributed together. This is the rule that would
  // have refused the last film: 16.4 s of it belonged to a beat that said
  // nothing at all.
  const totalShare = beats.beats.reduce((sum, beat) => sum + beat.share, 0) || 100;
  const balance = beats.beats.map((beat) => {
    const beatWords = perBeat.get(beat.id) ?? 0;
    const timeShare = beat.share / totalShare;
    const wordShare = words > 0 ? beatWords / words : 0;
    if (story.narration.length > 0 && Math.abs(timeShare - wordShare) > 0.1) {
      errors.push({
        code: "story:balance",
        message:
          `beat ${beat.id} ("${beat.title}") is ${pct(timeShare)} of the film but carries ${pct(wordShare)} ` +
          `of its words — ${((timeShare - wordShare) * story.duration).toFixed(1)}s of air`,
      });
    }
    return { beat: beat.id, timeShare, wordShare };
  });
  for (const beat of beats.beats) {
    if (!perBeat.has(beat.id) && story.narration.length > 0) {
      errors.push({
        code: "story:beat-empty",
        message: `beat ${beat.id} ("${beat.title}") has no narration line — nothing is said in it`,
      });
    }
  }

  // 8 — the client's phrases are actually in the film.
  if (story.mustSay.length > 0) {
    const gaps = mustSayGaps(
      story.mustSay,
      story.narration.map((line) => line.text),
    );
    for (const gap of gaps) {
      errors.push({ code: "story:must-say", message: `the film never says "${gap}"` });
    }
  }

  const report: StoryReport = {
    id: story.id,
    duration: story.duration,
    words,
    wpm,
    wpmBand: story.pace.wpm,
    medianShotBand: story.pace.medianShot,
    spine: story.spine,
    beats: beats.beats.map((beat) => ({
      beat,
      seconds: (beat.share / totalShare) * story.duration,
      words: perBeat.get(beat.id) ?? 0,
      lines: story.narration.filter((line) => line.beat === beat.id).length,
    })),
    balance,
  };

  return { errors, warnings, report };
}

/**
 * The story and the score must say the same words (decision 0035).
 *
 * The narration exists twice: once as writing in `story.json`, once as a clock
 * in the score. Nothing compared them, so a score could speak a line the story
 * never wrote — or drop a line the story promised — and every check would pass,
 * because each document was internally consistent.
 */
export function checkNarrationSync(
  story: Story,
  lines: Array<{ id: string; text: string }>,
): Issue[] {
  const errors: Issue[] = [];
  const byId = new Map(story.narration.map((line) => [line.id, line]));
  const seen = new Set<string>();
  const normalize = (text: string) => text.trim().replace(/\s+/g, " ");

  for (const line of lines) {
    const scripted = byId.get(line.id);
    if (!scripted) {
      errors.push({
        code: "story:score-line",
        message: `the score speaks line "${line.id}", which story.json does not have`,
      });
      continue;
    }
    if (seen.has(line.id)) {
      errors.push({ code: "story:score-line", message: `the score speaks line "${line.id}" twice` });
    }
    seen.add(line.id);
    if (normalize(scripted.text) !== normalize(line.text)) {
      errors.push({
        code: "story:score-text",
        message:
          `line "${line.id}" is "${scripted.text}" in story.json and "${line.text}" in the score — ` +
          "the film would say something it was not written to say",
      });
    }
  }

  for (const line of story.narration) {
    if (!seen.has(line.id)) {
      errors.push({
        code: "story:score-missing",
        message: `story.json's line "${line.id}" is never spoken in the score`,
      });
    }
  }

  return errors;
}
