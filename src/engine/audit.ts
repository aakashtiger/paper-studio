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
      // Every picture event either makes a sound or says why it does not: an
      // event nobody scored is the difference between a film and a slideshow
      // with a soundtrack next to it. The reason lives on the event, because
      // the event is the thing that has no sound — a window of time cannot say
      // why *that* beat is quiet.
      const scoredHere = cueShots.has(`${shot.id}#${index}`);
      if (scoredHere && event.quiet) {
        errors.push({
          code: "sfx_quiet_scored",
          message: `${shot.id}#${index} "${event.note}" at ${at.toFixed(2)}s has a cue and a quiet reason ("${event.quiet}"); it cannot be both`,
          shot: shot.id,
        });
      } else if (scoredHere) scored += 1;
      else if (event.quiet) bare += 1;
      else {
        errors.push({
          code: "sfx_unscored",
          message: `${shot.id}#${index} "${event.note}" at ${at.toFixed(2)}s has no cue and no \`quiet\` reason`,
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

  // A declared silence is a claim about the film, and the loudest thing in the
  // film is the narration: three of this film's first five declared windows sat
  // on top of a spoken line, which the cue sheet alone can never see.
  const lines = plan.clock.mode === "narration" ? plan.clock.lines : [];
  for (const silence of silences) {
    for (const line of lines) {
      const lineTo = line.start + line.duration;
      if (line.start < silence.to && lineTo > silence.from) {
        errors.push({
          code: "silence_over_voice",
          message: `declared silence ${silence.from}–${silence.to}s ("${silence.why}") has narration "${line.id}" running through it (${line.start.toFixed(2)}–${lineTo.toFixed(2)}s)`,
        });
      }
    }
  }

  // A cue may not be inside a declared silence — and "inside" means overlapping,
  // not merely starting there: a cue that starts before the window and rings
  // through it is the same lie as one that starts in it.
  for (const span of spans) {
    for (const hole of silences) {
      if (span.at < hole.to && span.end > hole.from) {
        errors.push({
          code: "sfx_in_silence",
          message: `sfx "${span.id}" runs ${span.at.toFixed(2)}–${span.end.toFixed(2)}s through the declared silence ${hole.from}–${hole.to}s ("${hole.why}")`,
        });
      }
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

  const lineById =
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

    const baseId = lineById.has(caption.id)
      ? caption.id
      : [...lineById.keys()].find((id) => caption.id.startsWith(`${id}.`));
    const line = baseId ? lineById.get(baseId) : undefined;
    if (line) {
      const hold = caption.end - caption.start;
      const words = caption.text.trim().split(/\s+/).filter(Boolean).length;
      // A full-line caption gets the old 1.8 s read time. A chunk is one
      // phone-sized piece and needs only its own words' time.
      const required =
        baseId === caption.id ? Math.max(1.8, line.duration + 0.6) : Math.max(0.6, words * 0.22);
      if (hold + 0.001 < required) {
        errors.push({
          code: "caption_read_time",
          message: `caption "${caption.id}" holds ${hold.toFixed(2)}s, needs ${required.toFixed(2)}s`,
        });
      }
    }
  }

  if (lineById.size > 0) {
    const missing = [...lineById.keys()].filter(
      (id) => !plan.captions.lines.some((caption) => caption.id === id || caption.id.startsWith(`${id}.`)),
    );
    if (missing.length > 0) {
      errors.push({
        code: "caption_count",
        message: `${missing.length} narration line(s) have no caption: ${missing.join(", ")}`,
      });
    }
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
