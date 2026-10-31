import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

/** The picture event a cue is bound to, so its time is never typed twice. */
export const SfxCueEventSchema = z.object({
  /** The shot this cue belongs to, e.g. "s03". */
  shot: z.string().min(1),
  /** Which of that shot's direction events, 0-based. */
  index: z.number().int().nonnegative(),
});

export const SfxCueSchema = z.object({
  id: z.string().min(1),
  /**
   * The cue's time in the film, in seconds. A cue names its time **once**: typed
   * here, or derived from the picture event it belongs to with `event`.
   */
  at: z.number().nonnegative().optional(),
  event: SfxCueEventSchema.optional(),
  kind: z.string().min(1),
  note: z.string().optional(),
  duration: z.number().positive().optional(),
  gain: z.number().min(0).max(2).optional(),
  pan: z.number().min(-1).max(1).optional(),
  layers: z.array(z.string()).optional(),
  /** Frequency band the cue is designed to occupy, in hertz [lo, hi]. */
  band: z.tuple([z.number().positive(), z.number().positive()]).optional(),
  /** Reverb send level for this cue, 0–1. Defaults by kind. */
  send: z.number().min(0).max(1).optional(),
  /** Sidechain duck depth in dB against the voice, keyed in the 1–4 kHz band. */
  duckDb: z.number().min(0).max(12).optional(),
});

export const NarrationPlanSchema = z.object({
  source: z.enum(["recorded", "tts", "none"]),
  /** Source of a tts voice: local (Apache-2.0) or a one-time cloud fetch. */
  provider: z.enum(["kokoro", "elevenlabs"]).optional(),
  voice: z.string().min(1).optional(),
  voiceId: z.string().min(1).optional(),
  speed: z.number().positive().optional(),
  transcript: z.string().min(1).optional(),
  srt: z.string().min(1).optional(),
});

export const MusicPlanSchema = z.object({
  source: z.enum(["library", "generated", "none"]),
  track: z.string().min(1).optional(),
  license: z.string().min(1).optional(),
  bpm: z.number().positive().optional(),
  offset: z.number().nonnegative().optional(),
  meter: z.number().int().positive().optional(),
  beatMap: z.string().min(1).optional(),
});

export const SfxPlanSchema = z.object({
  /**
   * Where the foley comes from. Only `generated` is built: `library` (a licensed
   * pack) and `recorded` (a supplied file) are in the contract so a later film
   * can use them, and the resolver rejects them until that path exists.
   */
  source: z.enum(["generated", "library", "recorded"]),
  cues: z.array(SfxCueSchema).default([]),
});

export const AudioPlanSchema = z.object({
  mode: z.enum(["music", "narration", "sfx", "hybrid"]),
  narration: NarrationPlanSchema.optional(),
  music: MusicPlanSchema.optional(),
  sfx: SfxPlanSchema.optional(),
});

export type AudioPlan = z.infer<typeof AudioPlanSchema>;
export type SfxCue = z.infer<typeof SfxCueSchema>;

/** A shot as the cue resolver needs it: where it starts, and what happens in it. */
export type CueShot = {
  id: string;
  start: number;
  events: Array<{ t: number; kind: string; note: string }>;
};

/** A cue that is on the film's clock: `at` is always a real number here. */
export type ResolvedCue = Omit<SfxCue, "at" | "event"> & {
  at: number;
  /** Whether the time was typed, or derived from a picture event. */
  from: "at" | "event";
  /** The event a bound cue sits on: the picture, named. */
  event?: { shot: string; index: number; t: number; kind: string; note: string };
};

export type AudioIssue = { code: string; message: string };

const MODES = ["music", "narration", "sfx", "hybrid"] as const;

export function resolveAudio(
  plan: AudioPlan,
  options: { duration: number; clockMode: string; root: string },
): { errors: AudioIssue[]; warnings: AudioIssue[] } {
  const errors: AudioIssue[] = [];
  const warnings: AudioIssue[] = [];
  const { duration, clockMode, root } = options;

  if (!MODES.includes(plan.mode)) {
    errors.push({ code: "audio_mode", message: `unknown audio mode "${plan.mode}"` });
  }

  const present = [plan.narration, plan.music, plan.sfx].filter(Boolean).length;
  if (plan.mode === "hybrid" && present < 2) {
    errors.push({
      code: "audio_hybrid_sources",
      message: "hybrid audio needs at least two of narration, music and sfx",
    });
  }
  if (plan.mode === "narration" && !plan.narration) {
    errors.push({ code: "audio_narration_missing", message: "narration film has no narration plan" });
  }
  if (plan.mode === "music" && !plan.music) {
    errors.push({ code: "audio_music_missing", message: "music film has no music plan" });
  }
  if (plan.mode === "sfx" && !plan.sfx) {
    errors.push({ code: "audio_sfx_missing", message: "sfx film has no sfx plan" });
  }

  if (plan.narration && plan.narration.source !== "none") {
    const narration = plan.narration;
    if (narration.source === "recorded" && !narration.voice) {
      errors.push({ code: "audio_voice_missing", message: "recorded narration needs a voice file" });
    }
    if (narration.source === "tts" && !narration.voiceId) {
      errors.push({ code: "audio_voice_id", message: "tts narration needs a voice id" });
    }
    if (narration.source === "tts" && !narration.provider) {
      errors.push({
        code: "audio_provider_missing",
        message: "tts narration needs a provider (kokoro local, or elevenlabs fetched once)",
      });
    }
    if (!narration.transcript) {
      errors.push({ code: "audio_transcript_missing", message: "narration needs a transcript" });
    }
    if (!narration.srt) {
      errors.push({ code: "audio_srt_missing", message: "narration needs an srt path" });
    }
    for (const [label, path] of [
      ["voice", narration.voice],
      ["transcript", narration.transcript],
      ["srt", narration.srt],
    ] as const) {
      if (path && !existsSync(resolve(root, path))) {
        errors.push({ code: `audio_${label}_file`, message: `${label} "${path}" does not exist` });
      }
    }
  }

  if (plan.music && plan.music.source !== "none") {
    const music = plan.music;
    if (music.source === "library") {
      if (!music.track) {
        errors.push({ code: "audio_track_missing", message: "library music needs a track" });
      }
      if (!music.license) {
        errors.push({ code: "audio_license_missing", message: "library music needs a licence" });
      }
      if (music.track && !existsSync(resolve(root, music.track))) {
        errors.push({ code: "audio_track_file", message: `track "${music.track}" does not exist` });
      }
    }
    if (music.source === "generated" && !music.bpm) {
      warnings.push({
        code: "audio_generated_tempo",
        message: "generated music has no bpm; the score will need its own tempo",
      });
    }
    if (music.beatMap && !existsSync(resolve(root, music.beatMap))) {
      errors.push({ code: "audio_beatmap_file", message: `beat map "${music.beatMap}" does not exist` });
    }
  }

  if (plan.sfx && plan.sfx.source !== "generated") {
    errors.push({
      code: "sfx_source_unbuilt",
      message: `sfx source "${plan.sfx.source}" is defined but not built; generate the cues in code (source: "generated")`,
    });
  }

  if (plan.sfx && plan.sfx.cues.length > 0) {
    const ids = new Set<string>();
    for (const cue of plan.sfx.cues) {
      if (ids.has(cue.id)) {
        errors.push({ code: "sfx_duplicate", message: `sfx cue "${cue.id}" is duplicated` });
      }
      ids.add(cue.id);
      const hasAt = cue.at !== undefined;
      const hasEvent = cue.event !== undefined;
      if (hasAt === hasEvent) {
        errors.push({
          code: hasAt ? "sfx_time_conflict" : "sfx_no_time",
          message: hasAt
            ? `sfx "${cue.id}" names both at ${cue.at}s and an event; name its time once`
            : `sfx "${cue.id}" has no time: give it at, or bind it to a shot event`,
        });
      }
      if (cue.at !== undefined && cue.at >= duration) {
        errors.push({ code: "sfx_outside_film", message: `sfx "${cue.id}" at ${cue.at}s is outside the film` });
      }
      if (cue.band && cue.band[0] >= cue.band[1]) {
        errors.push({
          code: "sfx_band",
          message: `sfx "${cue.id}" band ${cue.band[0]}–${cue.band[1]} Hz is not low-to-high`,
        });
      }
    }
  } else if (plan.mode === "sfx") {
    errors.push({ code: "audio_sfx_cues", message: "sfx film has no cues" });
  }

  if (plan.mode !== "hybrid" && clockMode !== plan.mode) {
    warnings.push({
      code: "audio_clock_mismatch",
      message: `audio mode "${plan.mode}" but clock mode "${clockMode}"`,
    });
  }

  return { errors, warnings };
}

/**
 * Put every cue on the film's clock.
 *
 * A cue names its time once. Typed (`at`), it is already on the clock. Bound
 * (`event`), the time is the shot's start plus the event's offset inside it — so
 * re-timing a shot moves its foley with it and the time is never typed twice.
 *
 * The plan must already be well-formed (`resolveAudio` owns the at/event choice,
 * a duplicate id and a typed time outside the film); this only finds the time and
 * rejects an event that is not there. A cue that names no time at all is skipped:
 * its error is already on the resolver's list.
 */
export function resolveCueTimes(
  cues: SfxCue[],
  shots: CueShot[],
  duration: number,
): { cues: ResolvedCue[]; errors: AudioIssue[] } {
  const errors: AudioIssue[] = [];
  const byId = new Map(shots.map((shot) => [shot.id, shot]));
  const resolved: ResolvedCue[] = [];

  for (const cue of cues) {
    if (cue.at !== undefined) {
      const { event: _ignored, ...rest } = cue;
      resolved.push({ ...rest, at: cue.at, from: "at" });
      continue;
    }
    if (!cue.event) continue;

    const shot = byId.get(cue.event.shot);
    if (!shot) {
      errors.push({
        code: "sfx_event_shot",
        message: `sfx "${cue.id}" is bound to shot "${cue.event.shot}", which is not in the film`,
      });
      continue;
    }
    const event = shot.events[cue.event.index];
    if (!event) {
      errors.push({
        code: "sfx_event_index",
        message: `sfx "${cue.id}" is bound to event ${cue.event.index} of ${shot.id}, which has ${shot.events.length}`,
      });
      continue;
    }
    const at = Number((shot.start + event.t).toFixed(3));
    if (at >= duration) {
      errors.push({
        code: "sfx_outside_film",
        message: `sfx "${cue.id}" lands at ${at}s (${shot.id} event ${cue.event.index}), outside the ${duration}s film`,
      });
    }
    resolved.push({
      ...cue,
      at,
      from: "event",
      event: { shot: shot.id, index: cue.event.index, t: event.t, kind: event.kind, note: event.note },
    });
  }

  return { cues: resolved, errors };
}
