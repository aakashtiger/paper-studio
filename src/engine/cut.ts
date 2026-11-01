import { type Issue } from "./story.js";

/**
 * The cut, checked against the beat sheet.
 *
 * The order the user asked for is *script → beat → scene → shot, in sync*. The
 * script and the beats are contracts (decision 0025). This module is the other
 * half of that sentence: once a film has a beat map, its **shots** have to answer
 * it — every shot bound to a beat, every beat holding its declared share of the
 * film, every beat's signature sound actually heard, every shot with a reason to
 * exist.
 *
 * A *scene* here is not a fifth authored file. It is what it is in an edit: a
 * contiguous run of shots that serve the same beat, in the same place. That is
 * derived from the shots, so a scene can never disagree with them — and the beat
 * it serves carries the writing that justifies it.
 *
 * This is the check that would have refused *Same Alarm*'s cut before it was
 * painted: ten shots, none of them bound to anything, a five-beat shape in
 * nobody's head, and no signature sound that ever lands.
 */

export type CutShot = {
  id: string;
  start: number;
  duration: number;
  /** The beat this shot serves. Absent is refused once the film has beats. */
  beat?: string;
  /** Why the shot exists, in one line (`direction.spine`). */
  reason?: string;
};

export type CutBeat = {
  id: string;
  title: string;
  share: number;
  sound: { signature: string; quiet: boolean };
};

export type CutCue = {
  id: string;
  at: number;
  duration?: number;
  kind: string;
};

export type CutInput = {
  shots: CutShot[];
  beats: CutBeat[];
  cues: CutCue[];
  duration: number;
};

export type CutScene = {
  beat: string;
  from: number;
  to: number;
  seconds: number;
  shots: string[];
};

export type CutBeatRow = {
  beat: string;
  title: string;
  /** Seconds of film the beat's shots take. */
  seconds: number;
  /** That as a share of the film. */
  share: number;
  /** The share `beats.json` declared. */
  declared: number;
  cues: number;
  quiet: boolean;
};

export type CutReport = {
  /** Contiguous runs of shots serving one beat — the film's scenes. */
  scenes: CutScene[];
  beats: CutBeatRow[];
  errors: Issue[];
  warnings: Issue[];
};

/** How far a beat's share of the *shots* may drift from its share of the *writing*. */
export const BEAT_SHARE_DRIFT = 0.1;

/** A reason shorter than this is a label, not a reason. */
export const REASON_MIN_WORDS = 3;

const words = (text: string) => (text.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []).length;
const pct = (value: number) => `${(value * 100).toFixed(0)}%`;
const secs = (value: number) => `${value.toFixed(1)}s`;

export function checkCut(input: CutInput): CutReport {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const { shots, beats, cues, duration } = input;
  const ordered = [...shots].sort((a, b) => a.start - b.start);
  const byId = new Map(beats.map((beat) => [beat.id, beat]));

  // 1 — every shot answers a beat, and every beat is answered.
  const unbound = shots.filter((shot) => !shot.beat).map((shot) => shot.id);
  if (unbound.length > 0) {
    errors.push({
      code: "cut:unbound",
      message:
        `${unbound.length} of ${shots.length} shots are not bound to a beat (${unbound.join(", ")}) — ` +
        "the cut does not say what it is arguing",
    });
  }
  for (const shot of shots) {
    if (shot.beat && !byId.has(shot.beat)) {
      errors.push({
        code: "cut:orphan",
        message: `shot "${shot.id}" serves beat "${shot.beat}", which beats.json does not have`,
      });
    }
  }
  const covered = new Set(shots.map((shot) => shot.beat).filter(Boolean) as string[]);
  for (const beat of beats) {
    if (!covered.has(beat.id)) {
      errors.push({
        code: "cut:uncovered",
        message: `beat ${beat.id} ("${beat.title}") has no shot — it is written and never filmed`,
      });
    }
  }

  // 2 — the scenes: contiguous runs of shots on one beat.
  const scenes: CutScene[] = [];
  for (const shot of ordered) {
    if (!shot.beat) continue;
    const last = scenes[scenes.length - 1];
    if (last && last.beat === shot.beat) {
      last.to = shot.start + shot.duration;
      last.seconds += shot.duration;
      last.shots.push(shot.id);
    } else {
      scenes.push({ beat: shot.beat, from: shot.start, to: shot.start + shot.duration, seconds: shot.duration, shots: [shot.id] });
    }
  }

  // A beat visited twice is a cut that does not follow its own shape. It is not
  // wrong for a film to cross-cut — but it *is* something the film has to mean,
  // so it is named rather than passed over.
  const seen = new Map<string, number>();
  for (const scene of scenes) seen.set(scene.beat, (seen.get(scene.beat) ?? 0) + 1);
  for (const [beat, count] of seen) {
    if (count > 1) {
      warnings.push({
        code: "cut:revisit",
        message: `beat ${beat} is visited ${count} times; the cut cross-cuts — fine if it means to`,
      });
    }
  }

  // 3 — time follows the writing. This is the shot-level version of the 16.4 s
  // hole: a beat that owns a fifth of the writing and half the film.
  const rows: CutBeatRow[] = beats.map((beat) => {
    const own = shots.filter((shot) => shot.beat === beat.id);
    const seconds = own.reduce((sum, shot) => sum + shot.duration, 0);
    const share = duration > 0 ? seconds / duration : 0;
    const declared = beat.share / 100;
    // The beat's window is where its shots are — the first frame it appears on
    // to the last frame it leaves. A cue that rings across that window counts:
    // a signature sound that runs through a beat is still heard in it.
    const cueCount =
      own.length === 0
        ? 0
        : cues.filter((cue) => {
            const from = Math.min(...own.map((shot) => shot.start));
            const to = Math.max(...own.map((shot) => shot.start + shot.duration));
            return cue.at < to && cue.at + (cue.duration ?? 0) > from;
          }).length;

    if (covered.has(beat.id) && Math.abs(share - declared) > BEAT_SHARE_DRIFT) {
      errors.push({
        code: "cut:share",
        message:
          `beat ${beat.id} ("${beat.title}") is ${pct(declared)} of the film in the beat map but ` +
          `${pct(share)} of its shots (${secs(seconds)} vs ${secs(declared * duration)}) — ` +
          `${secs(Math.abs(share - declared) * duration)} of drift`,
      });
    }
    if (covered.has(beat.id) && beat.sound.quiet && cueCount > 0) {
      errors.push({
        code: "cut:quiet-scored",
        message: `beat ${beat.id} ("${beat.title}") is declared quiet but ${cueCount} cue(s) play inside it`,
      });
    }
    if (covered.has(beat.id) && !beat.sound.quiet && cueCount === 0) {
      errors.push({
        code: "cut:signature",
        message:
          `beat ${beat.id} ("${beat.title}") promises the signature sound "${beat.sound.signature}" ` +
          "and no cue plays in it — the beat is silent in a way it did not declare",
      });
    }
    return { beat: beat.id, title: beat.title, seconds, share, declared, cues: cueCount, quiet: beat.sound.quiet };
  });

  // 4 — every shot has a reason. "If a shot has no reason it is cut."
  for (const shot of shots) {
    const count = words(shot.reason ?? "");
    if (count < REASON_MIN_WORDS) {
      errors.push({
        code: "cut:reason",
        message:
          `shot "${shot.id}" has ${count === 0 ? "no" : `${count}-word`} reason to exist` +
          (shot.reason ? ` ("${shot.reason}")` : "") +
          ` — a shot with no reason is cut (min ${REASON_MIN_WORDS} words)`,
      });
    }
  }

  return { scenes, beats: rows, errors, warnings };
}
