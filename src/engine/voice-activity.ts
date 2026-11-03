/**
 * How much of the film has a voice in it.
 *
 * Coverage used to be the union of the recogniser's word intervals. That is a
 * record of *words*, not of *speech*: each interval starts after the attack and
 * stops before the decay, so a perfectly continuous read measures ~75% while a
 * listener hears no gap at all. The 180-190 wpm band made that visible - the
 * read fitted the film only when the word-union said it covered 75% of it.
 *
 * This measures the audio instead: ffmpeg's silence detector marks stretches
 * below -35 dBFS for at least a breath (0.3 s), and everything else is voice.
 * A short articulation inside a word is not silence; a sentence pause is.
 *
 * It is a measurement, not a gate: the caller compares `voiced / filmDuration`
 * with the coverage floor.
 */
import { spawnSync } from "node:child_process";

/** A pause at least this long is a beat in the read, not articulation. */
export const VOICE_SILENCE_MIN = 0.3;

/** Below this the detector calls the room silent. */
export const VOICE_SILENCE_DB = -35;

export type VoiceActivity = {
  /** Seconds with audible voice, inside the film. */
  voiced: number;
  /** Seconds of detected silence, inside the film. */
  silence: number;
  /** The longest detected silence and where it starts. */
  longest: number;
  longestAt: number;
};

type Span = { start: number; end: number };

const seconds = (stamp: string): number => {
  // ffmpeg prints 00:00:32.55; the leading hour field may be absent in logs.
  const parts = stamp.trim().split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return Number.NaN;
  if (parts.length === 3) {
    const [hours, minutes, rest] = parts as [number, number, number];
    return hours * 3600 + minutes * 60 + rest;
  }
  if (parts.length === 2) {
    const [minutes, rest] = parts as [number, number];
    return minutes * 60 + rest;
  }
  return parts[0] ?? Number.NaN;
};

/**
 * Read `silencedetect` output. Exported so the arithmetic is testable without
 * an audio file or an ffmpeg process.
 */
export function parseSilenceDetect(log: string, filmDuration: number): VoiceActivity {
  const audioDuration = (() => {
    const found = /Duration:\s*(\d{2}:\d{2}:\d{2}(?:\.\d+)?)/.exec(log);
    return found?.[1] ? seconds(found[1]) : filmDuration;
  })();
  const measured = Number.isFinite(audioDuration) ? Math.min(filmDuration, audioDuration) : filmDuration;

  const spans: Span[] = [];
  let open: number | null = null;
  for (const line of log.split(/\r?\n/)) {
    const start = /silence_start:\s*(-?\d+(?:\.\d+)?)/.exec(line);
    if (start) {
      open = Number(start[1]);
      continue;
    }
    const end = /silence_end:\s*(-?\d+(?:\.\d+)?)/.exec(line);
    if (end && open !== null) {
      spans.push({ start: open, end: Number(end[1]) });
      open = null;
    }
  }
  // A silence that runs to the end of the file has no silence_end line.
  if (open !== null) spans.push({ start: open, end: measured });

  let silence = 0;
  let longest = 0;
  let longestAt = 0;
  for (const span of spans) {
    const from = Math.max(0, Math.min(span.start, measured));
    const to = Math.max(from, Math.min(span.end, measured));
    const length = to - from;
    if (length <= 0) continue;
    silence += length;
    if (length > longest) {
      longest = length;
      longestAt = from;
    }
  }
  // A file shorter than the film ends early; the rest of the film is silence.
  const tail = Math.max(0, filmDuration - measured);
  silence += tail;
  if (tail > longest) {
    longest = tail;
    longestAt = measured;
  }
  const voiced = Math.max(0, filmDuration - silence);
  return {
    voiced: Number(voiced.toFixed(3)),
    silence: Number(silence.toFixed(3)),
    longest: Number(longest.toFixed(3)),
    longestAt: Number(longestAt.toFixed(3)),
  };
}

/** Run the detector on one audio file and return the voiced seconds inside the film. */
export function measureVoiceActivity(ffmpeg: string, audio: string, filmDuration: number): VoiceActivity {
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-i", audio,
      "-af", `silencedetect=noise=${VOICE_SILENCE_DB}dB:d=${VOICE_SILENCE_MIN}`,
      "-f", "null",
      "-",
    ],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  return parseSilenceDetect(`${result.stderr ?? ""}${result.stdout ?? ""}`, filmDuration);
}
