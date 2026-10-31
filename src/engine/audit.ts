import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ResolvedFilm } from "./treatment.js";

export type AuditIssue = { code: string; message: string; shot?: string };

export type AuditReport = {
  film: string;
  ok: boolean;
  shots: number;
  frames: number;
  /** Picture events the shots declare. */
  events: number;
  /** SFX cues in the audio plan. */
  cues: number;
  captions: number;
  errors: AuditIssue[];
  warnings: AuditIssue[];
};

export function auditFilm(plan: ResolvedFilm, options: { root: string }): AuditReport {
  const errors: AuditIssue[] = [];
  const warnings: AuditIssue[] = [];
  let events = 0;
  let cues = 0;

  const frame = (value: number) => Math.round(value * plan.fps);
  const aligned = (value: number) => Math.abs(value * plan.fps - frame(value)) <= 0.001;

  for (const shot of plan.shots) {
    for (const event of shot.direction.events) {
      events += 1;
      const at = shot.start + event.t;
      if (!aligned(at)) {
        errors.push({
          code: "cue_frame",
          message: `${shot.id} event "${event.note}" at ${at.toFixed(3)}s is not on a frame`,
          shot: shot.id,
        });
      }
    }
  }

  for (const cue of plan.cues) {
    cues += 1;
    if (!aligned(cue.at)) {
      errors.push({
        code: "sfx_frame",
        message: `sfx "${cue.id}" at ${cue.at}s is not on a frame`,
      });
    }
  }

  for (const line of plan.clock.mode === "narration" ? plan.clock.lines : []) {
    for (const [label, value] of [
      ["start", line.start],
      ["end", line.start + line.duration],
    ] as const) {
      if (!aligned(value)) {
        errors.push({
          code: "narration_frame",
          message: `narration "${line.id}" ${label} at ${value}s is not on a frame`,
        });
      }
    }
  }

  const lines =
    plan.clock.mode === "narration"
      ? new Map(plan.clock.lines.map((line) => [line.id, line]))
      : new Map();

  for (const caption of plan.captions.lines) {
    for (const [label, value] of [
      ["start", caption.start],
      ["end", caption.end],
    ] as const) {
      if (!aligned(value)) {
        errors.push({
          code: "caption_frame",
          message: `caption "${caption.id}" ${label} at ${value}s is not on a frame`,
        });
      }
    }

    const line = lines.get(caption.id);
    if (line) {
      const hold = caption.end - caption.start;
      const required = Math.max(1.8, line.duration + 0.6);
      if (hold + 0.001 < required) {
        errors.push({
          code: "caption_read_time",
          message: `caption "${caption.id}" holds ${hold.toFixed(2)}s, needs ${required.toFixed(2)}s`,
        });
      }
    }
  }

  if (lines.size > 0 && plan.captions.lines.length !== lines.size) {
    errors.push({
      code: "caption_count",
      message: `${plan.captions.lines.length} captions for ${lines.size} narration lines`,
    });
  }

  if (!existsSync(resolve(options.root, plan.captions.source))) {
    errors.push({
      code: "srt_missing",
      message: `caption file "${plan.captions.source}" does not exist`,
    });
  } else {
    const srt = readFileSync(resolve(options.root, plan.captions.source), "utf8");
    const count = (srt.match(/-->/g) ?? []).length;
    if (count !== plan.captions.lines.length) {
      errors.push({
        code: "srt_count",
        message: `srt has ${count} cues, score has ${plan.captions.lines.length}`,
      });
    }
  }

  if (plan.warnings.length > 0) {
    warnings.push(...plan.warnings.map((message) => ({ code: "plan_warning", message })));
  }

  return {
    film: plan.projectId,
    ok: errors.length === 0,
    shots: plan.shots.length,
    frames: plan.frames,
    events,
    cues,
    captions: plan.captions.lines.length,
    errors,
    warnings,
  };
}
