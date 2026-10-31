import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isKnownKind, kindLength, kindSpec } from "./sfx.js";
import type { ResolvedFilm } from "./treatment.js";

export type AuditIssue = { code: string; message: string; shot?: string };

export type AuditReport = {
  film: string;
  ok: boolean;
  shots: number;
  frames: number;
  /** Picture events the shots declare. */
  events: number;
  /** Picture events that carry a cue of their own. */
  scored: number;
  /** Picture events inside a declared silence, so deliberately unscored. */
  bare: number;
  /** SFX cues in the audio plan. */
  cues: number;
  /** Declared silences, and the longest stretch of the film with no foley at all. */
  silences: number;
  longestHole: number;
  captions: number;
  errors: AuditIssue[];
  warnings: AuditIssue[];
};

/** A hole longer than this is a gap, not a beat, unless the film says why. */
export const MAX_GAP = 2.5;
/** How much of the film's end the master fades out; no cue may start inside it. */
export const TAIL_FADE = 0.5;

export function auditFilm(plan: ResolvedFilm, options: { root: string }): AuditReport {
  const errors: AuditIssue[] = [];
  const warnings: AuditIssue[] = [];
  let events = 0;
  let scored = 0;
  let bare = 0;
  let cues = 0;
  const duration = plan.shots.reduce((end, shot) => Math.max(end, shot.start + shot.duration), 0);
  const spans = plan.cues
    .map((cue) => ({
      id: cue.id,
      at: cue.at,
      end: cue.at + (cue.duration ?? kindLength(cue.kind)),
      kind: cue.kind,
      duckDb: cue.duckDb ?? (isKnownKind(cue.kind) ? kindSpec(cue.kind).duckDb : 0),
    }))
    .sort((a, b) => a.at - b.at);

  const frame = (value: number) => Math.round(value * plan.fps);
  const aligned = (value: number) => Math.abs(value * plan.fps - frame(value)) <= 0.001;
  const silences = plan.audio.sfx?.silences ?? [];
  const inSilence = (at: number) => silences.find((silence) => at >= silence.from && at < silence.to);
  const cueShots = new Set(
    plan.cues.filter((cue) => cue.event).map((cue) => `${cue.event?.shot}#${cue.event?.index}`),
  );

  for (const shot of plan.shots) {
    for (const [index, event] of shot.direction.events.entries()) {
      events += 1;
      const at = shot.start + event.t;
      if (!aligned(at)) {
        errors.push({
          code: "cue_frame",
          message: `${shot.id} event "${event.note}" at ${at.toFixed(3)}s is not on a frame`,
          shot: shot.id,
        });
      }
      // Every picture event either makes a sound or the film says it is quiet:
      // an event nobody scored is the difference between a film and a slideshow
      // with a soundtrack next to it.
      if (cueShots.has(`${shot.id}#${index}`)) scored += 1;
      else if (inSilence(at)) bare += 1;
      else {
        errors.push({
          code: "sfx_unscored",
          message: `${shot.id}#${index} "${event.note}" at ${at.toFixed(2)}s has no cue and no silence to sit in`,
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

  // A cue may not start inside a declared silence: a hole with a sound at the
  // top of it is not a hole, and the film would be lying in its own plan.
  for (const span of spans) {
    const hole = inSilence(span.at);
    if (hole) {
      errors.push({
        code: "sfx_in_silence",
        message: `sfx "${span.id}" starts at ${span.at.toFixed(2)}s inside the declared silence ${hole.from}–${hole.to}s ("${hole.why}")`,
      });
    }
  }

  // The longest stretch with no foley at all, and whether the film accounted
  // for it. Silence is a decision only when it is written down.
  let cursor = 0;
  let longestHole = 0;
  let holeAt = 0;
  for (const span of spans) {
    const gap = span.at - cursor;
    if (gap > longestHole) {
      longestHole = gap;
      holeAt = cursor;
    }
    cursor = Math.max(cursor, span.end);
  }
  if (duration - cursor > longestHole) {
    longestHole = duration - cursor;
    holeAt = cursor;
  }
  const explained = silences.some(
    (silence) => holeAt < silence.to && holeAt + longestHole > silence.from,
  );
  if (longestHole > MAX_GAP && !explained) {
    errors.push({
      code: "sfx_gap",
      message: `${longestHole.toFixed(1)}s with no foley from ${holeAt.toFixed(1)}s, and no declared silence to explain it`,
    });
  }

  // The master fades the last `TAIL_FADE` seconds to silence. A cue that starts
  // inside that window is fighting the fade — its transients punch out of a
  // floor the film has already decided to be silent.
  const fadeFrom = duration - TAIL_FADE;
  for (const span of spans) {
    if (span.at >= fadeFrom) {
      errors.push({
        code: "sfx_tail_fade",
        message: `sfx "${span.id}" starts at ${span.at.toFixed(2)}s inside the master's ${TAIL_FADE}s tail fade (from ${fadeFrom.toFixed(2)}s)`,
      });
    }
  }

  // A cue that plays under a spoken word must carry a duck: the mix keys the
  // 1–4 kHz band against the voice by the cue's own `duckDb`, and a cue with no
  // duck will sit on top of the line it shares the frame with.
  for (const line of plan.clock.mode === "narration" ? plan.clock.lines : []) {
    const wordFrom = line.start;
    const wordTo = line.start + line.duration;
    for (const span of spans) {
      if (span.duckDb > 0) continue;
      if (span.at < wordTo && span.end > wordFrom) {
        errors.push({
          code: "sfx_no_duck",
          message: `sfx "${span.id}" plays under narration "${line.id}" with no duck; it will sit on the words`,
        });
      }
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
    scored,
    bare,
    cues,
    silences: silences.length,
    longestHole: Number(longestHole.toFixed(2)),
    captions: plan.captions.lines.length,
    errors,
    warnings,
  };
}
