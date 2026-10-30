import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export const SfxCueSchema = z.object({
  id: z.string().min(1),
  at: z.number().nonnegative(),
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
  source: z.literal("generated"),
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

  if (plan.sfx && plan.sfx.cues.length > 0) {
    const ids = new Set<string>();
    for (const cue of plan.sfx.cues) {
      if (ids.has(cue.id)) {
        errors.push({ code: "sfx_duplicate", message: `sfx cue "${cue.id}" is duplicated` });
      }
      ids.add(cue.id);
      if (cue.at >= duration) {
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
