import { checkCut, type CutBeat, type CutReport } from "./cut.js";
import { kindLength } from "./sfx.js";
import { NARRATION_HOLE_MAX, type Issue, type Pace, countWords } from "./story.js";
import type { ResolvedFilm } from "./treatment.js";

/**
 * Checks that run before frame 1.
 *
 * The sixteen-hour day that produced *Same Alarm* was not sixteen hours of work.
 * It was nine full renders, seven of which were cuts that a cheap check had
 * already rejected — a still photograph at 0.533, 209 locked knees, a chair 2.5
 * men wide. Every one of those checks was correct and every one of them ran
 * *after* the expensive step, so each defect cost a whole film to discover.
 *
 * This module is the other order: every claim that can be made about the film
 * from its own documents is made here, in a second, before the renderer starts.
 * It is deliberately not a new kind of measurement — the numbers are the ones a
 * viewer used to reject the last film (median shot length, words a minute, the
 * length of the quiet, the bed that never stops), applied to the writing instead
 * of the delivered file.
 *
 * Nothing in here reads a file or paints a frame, so it is testable by
 * construction: give it a resolved film and it answers.
 */

/**
 * The band a film declares when it does not declare one.
 *
 * A Short or a Reel in this idiom cuts at a median of 2.5–3.0 s, and a narrated
 * one speaks 180–190 words a minute for the Paper K-pop style (the reference
 * reads ~222; 140–150 left too much air). Both are *style* numbers — a history
 * channel and a K-pop edit do not cut alike — so a style pack may declare its
 * own in `tokens.json` and a film may declare its own in `story.json`. This is
 * only what happens when neither has said anything.
 */
export const DEFAULT_PACE: Pace = { wpm: [180, 190], medianShot: [2.5, 3] };

/** No single cue may own more than this share of the film. The room bed owned 98% of *Same Alarm*. */
export const MAX_CUE_SHARE = 0.25;

/** No shot may run longer than this multiple of the film's median. */
export const LONGEST_SHOT_FACTOR = 2;

/**
 * How long the film may go with no narration in it.
 *
 * The user's rule for a narrated short is that the whole film carries narration.
 * 2.5 s is the same number the foley gap uses, for the same reason: a hole
 * longer than a breath is a hole, and *Same Alarm* left 17.0 s of one.
 *
 * The constant lives in `story.ts` because the scene check uses the same number.
 */

/** A narrated short speaks almost immediately: no intro, no logo, no cleared throat. */
export const NARRATION_START_MAX = 1;

/**
 * A narrated film speaks for at least this share of its own length.
 *
 * At 180–190 wpm a normal read covers about 90% of the film; half a film is not
 * a narrated short, it is a film with a voice in it sometimes. The floor was
 * 0.5, which let 30 s of silence through as long as no single hole passed 2.5 s.
 */
export const NARRATION_COVERAGE_MIN = 0.8;

/**
 * What the recogniser actually heard, in seconds (decision 0037).
 *
 * The line windows in the score are authored: `voice --apply` extends a line
 * when the read runs past it but never shortens an authored hold. Summing those
 * windows therefore measures the *promise*, not the speech — a film can pass a
 * coverage floor with long holds and very few words. The measured word times
 * are the authority, exactly as they are for the cut.
 */
export type MeasuredNarration = {
  words: number;
  speech: number;
  hole: number;
  holeAt: number;
  first: number;
};

/** Merge measured word intervals into speech seconds, the longest hole, and the first word. */
export function measureWords(
  words: { start: number; end: number }[],
  duration: number,
): MeasuredNarration {
  const sorted = words
    .filter((word) => Number.isFinite(word.start) && Number.isFinite(word.end) && word.end > word.start)
    .sort((a, b) => a.start - b.start);
  if (sorted.length === 0) return { words: 0, speech: 0, hole: duration, holeAt: 0, first: 0 };

  let cursor = 0;
  let speech = 0;
  let hole = 0;
  let holeAt = 0;
  for (const word of sorted) {
    if (word.start > cursor) {
      const gap = word.start - cursor;
      if (gap > hole) {
        hole = gap;
        holeAt = cursor;
      }
    }
    const from = Math.max(word.start, cursor);
    const to = Math.max(word.end, from);
    speech += to - from;
    cursor = Math.max(cursor, to);
  }
  if (duration > cursor) {
    const gap = duration - cursor;
    if (gap > hole) {
      hole = gap;
      holeAt = cursor;
    }
  }
  return {
    words: sorted.length,
    speech: Number(speech.toFixed(3)),
    hole: Number(hole.toFixed(3)),
    holeAt: Number(holeAt.toFixed(3)),
    first: Number((sorted[0] as { start: number }).start.toFixed(3)),
  };
}

export type PaceSource = "story" | "style" | "default";

/**
 * What the caller could find out about one cast member, because it touched the
 * files. The engine does not read the disk; the checks below only reason.
 */
export type CastFact = {
  character: string;
  rig: string;
  poses: string;
  /** True when `assets[]` has a character asset for this cast member. */
  asset: boolean;
  /** Anything wrong with the pose file or the rig registration. */
  problems: Issue[];
};

export type PreflightInput = {
  plan: ResolvedFilm;
  pace: Pace;
  paceSource: PaceSource;
  /**
   * The result of `checkStory()` when the film has a `story.json`.
   *
   * `null` means the film was never written — it begins at the shot list, which
   * is the defect decision 0025 exists to stop. Only a film that has already
   * been delivered (`reproduce`) may be re-rendered without one.
   */
  story: { errors: Issue[]; warnings: Issue[] } | null;
  /** The beat map, when the film has one: the cut is then checked against it. */
  beats?: CutBeat[] | null;
  /** Measured word times from `words.json`; when absent, line windows are used. */
  measured?: MeasuredNarration | null;
  /**
   * The authored scenes, when the film has them. `null` means the film has a
   * story and beats but no `scenes.json` — the stage the order was missing.
   */
  sceneCheck?: { errors: Issue[]; warnings: Issue[] } | null;
  /** The authored scenes as the cut check needs them: id, beat, duration. */
  sceneDocs?: { id: string; beat: string; duration: number }[] | null;
  sceneSource?: "authored" | "derived" | "missing";
  cast: CastFact[];
  /** True when the film already has a delivered file: this is a reproduction, not a new film. */
  reproduce: boolean;
};

export type PreflightIssue = Issue & {
  check: "story" | "scene" | "cut" | "pacing" | "narration" | "sound" | "cast";
};

export type PreflightReport = {
  film: string;
  ok: boolean;
  /** A re-render of a film that was already delivered; see `PreflightInput.story`. */
  reproduce: boolean;
  duration: number;
  pace: { wpm: [number, number]; medianShot: [number, number]; source: PaceSource };
  shots: { count: number; median: number; shortest: number; longest: number };
  narration: {
    lines: number;
    words: number;
    wpm: number;
    /** Seconds of spoken word, as measured by the clock. */
    speak: number;
    coverage: number;
    /** Where the first line starts. */
    first: number;
    /** The longest stretch with no line in it, and where it starts. */
    hole: number;
    holeAt: number;
    /** True when the hole and coverage come from measured word times, not authored windows. */
    measured: boolean;
  } | null;
  sound: {
    cues: number;
    longest: { id: string; seconds: number; share: number } | null;
  };
  cast: { character: string; rig: string; poses: string }[];
  /** The film's scenes: authored, derived from the shots, or missing. */
  cut: CutReport | null;
  sceneSource: "authored" | "derived" | "missing";
  errors: PreflightIssue[];
  warnings: PreflightIssue[];
};

/** The middle of a set of shot lengths; for an even count, the mean of the two middle ones. */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? (sorted[mid] as number) : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

/**
 * The longest stretch with no line in it — including the run-in before the first
 * line and the run-out after the last, because both are silence in a narrated
 * film. Returns the length and where it starts.
 */
export function longestHole(lines: { start: number; duration: number }[], duration: number) {
  let cursor = 0;
  let hole = 0;
  let holeAt = 0;
  for (const line of [...lines].sort((a, b) => a.start - b.start)) {
    const gap = line.start - cursor;
    if (gap > hole) {
      hole = gap;
      holeAt = cursor;
    }
    cursor = Math.max(cursor, line.start + line.duration);
  }
  if (duration - cursor > hole) {
    hole = duration - cursor;
    holeAt = cursor;
  }
  return { hole, holeAt };
}

const secs = (value: number) => `${value.toFixed(1)}s`;
const band = (value: [number, number]) => `${value[0]}–${value[1]}`;

export function preflightFilm(input: PreflightInput): PreflightReport {
  const { plan, pace, paceSource, story, cast, reproduce } = input;
  const beats = input.beats ?? null;
  const sceneCheck = input.sceneCheck;
  const sceneDocs = input.sceneDocs ?? null;
  const sceneSource = input.sceneSource ?? (sceneDocs ? "authored" : "derived");
  const errors: PreflightIssue[] = [];
  const warnings: PreflightIssue[] = [];
  const add = (check: PreflightIssue["check"], issue: Issue) => errors.push({ ...issue, check });
  const warn = (check: PreflightIssue["check"], issue: Issue) => warnings.push({ ...issue, check });

  const duration = plan.shots.reduce((end, shot) => Math.max(end, shot.start + shot.duration), 0);

  // 1 — the writing. This is the check that had no home before 0025.
  if (story === null) {
    const issue: Issue = {
      code: "story:missing",
      message:
        "no story.json — the film begins at the shot list, so nothing was ever written: " +
        "no spine, no turn, no narration to measure",
    };
    if (reproduce) warn("story", issue);
    else add("story", issue);
  } else {
    for (const issue of story.errors) add("story", issue);
    for (const issue of story.warnings) warn("story", issue);
  }

  // 1b — the scenes. A film with a story and beats but no scenes skipped stage 3:
  // the shots have no high-level screen to answer, and the order the repository
  // promises is not the order it enforces.
  if (sceneCheck === null) {
    const issue: Issue = {
      code: "scenes:missing",
      message:
        "no scenes.json — the film jumps from the beat map to the shot list, so no scene was ever " +
        "staged: no place, no cast, no lines, no seconds",
    };
    if (reproduce) warn("scene", issue);
    else add("scene", issue);
  } else if (sceneCheck) {
    for (const issue of sceneCheck.errors) add("scene", issue);
    for (const issue of sceneCheck.warnings) warn("scene", issue);
  }

  // 2 — the shape of the cut. A shot list is not a cut, and the count is where it shows.
  const lengths = plan.shots.map((shot) => shot.duration);
  const mid = median(lengths);
  const shotBand = pace.medianShot;
  if (plan.shots.length === 0) {
    add("pacing", { code: "pacing:none", message: "the score has no shots" });
  } else {
    if (mid < shotBand[0] || mid > shotBand[1]) {
      const wanted = Math.round(duration / shotBand[0]);
      add("pacing", {
        code: "pacing:median",
        message:
          `median shot is ${secs(mid)} — outside the declared ${band(shotBand)}s band. ` +
          `${plan.shots.length} shots in ${secs(duration)}; at this band the film needs about ${wanted} ` +
          `(${Math.round(duration / shotBand[1])}–${wanted}), not ${plan.shots.length}`,
      });
    }
    const longest = Math.max(...lengths);
    const slowest = plan.shots.find((shot) => shot.duration === longest);
    if (mid > 0 && longest > mid * LONGEST_SHOT_FACTOR) {
      add("pacing", {
        code: "pacing:long",
        message:
          `shot "${slowest?.id}" runs ${secs(longest)}, ${(longest / mid).toFixed(1)}× the ${secs(mid)} median — ` +
          `past ${LONGEST_SHOT_FACTOR}× it is a scene sitting still`,
      });
    }
    for (const shot of plan.shots) {
      if (shot.duration < 0.4) {
        warn("pacing", {
          code: "pacing:short",
          message: `shot "${shot.id}" runs ${shot.duration.toFixed(2)}s — under 0.4s a shot cannot register`,
        });
      }
    }
    // A shot that starts or ends between frames cannot be cut exactly. The
    // picture is quantised to the frame grid anyway; the score should say so.
    for (const shot of plan.shots) {
      const from = shot.start * plan.fps;
      const to = (shot.start + shot.duration) * plan.fps;
      if (Math.abs(from - Math.round(from)) > 1e-6 || Math.abs(to - Math.round(to)) > 1e-6) {
        const issue = {
          code: "pacing:grid",
          message:
            `shot "${shot.id}" starts at ${shot.start.toFixed(3)}s and ends at ` +
            `${(shot.start + shot.duration).toFixed(3)}s — not on the ${plan.fps} fps grid ` +
            `(${from.toFixed(2)}–${to.toFixed(2)} frames)`,
        };
        if (reproduce) warn("pacing", issue);
        else add("pacing", issue);
      }
    }
  }

  // 3 — the cut answers the beats. With a beat map, every shot is bound to the
  // beat it serves, the beat's share of the shots is its share of the writing,
  // its signature sound is actually played, and the shot says why it exists.
  let cut: CutReport | null = null;
  if (beats && beats.length > 0) {
    cut = checkCut({
      shots: plan.shots.map((shot) => ({
        id: shot.id,
        start: shot.start,
        duration: shot.duration,
        beat: shot.beat,
        scene: shot.scene,
        reason: shot.direction.spine,
      })),
      beats,
      scenes: sceneDocs ?? undefined,
      cues: plan.cues,
      duration,
    });
    for (const issue of cut.errors) add("cut", issue);
    for (const issue of cut.warnings) warn("cut", issue);
  }

  // 4 — the narration. The clock is the measured voice, so this is what the
  // audience will actually hear, not what the script hoped for.
  let narration: PreflightReport["narration"] = null;
  if (plan.clock.mode === "narration") {
    const lines = plan.clock.lines;
    const measured = input.measured ?? null;
    const scriptWords = lines.reduce((sum, line) => sum + countWords(line.text), 0);
    const words = measured ? measured.words : scriptWords;
    const speak = measured ? measured.speech : lines.reduce((sum, line) => sum + line.duration, 0);
    const wpm = duration > 0 ? (words / duration) * 60 : 0;
    const coverage = duration > 0 ? speak / duration : 0;
    const fallbackHole = longestHole(lines, duration);
    const hole = measured ? measured.hole : fallbackHole.hole;
    const holeAt = measured ? measured.holeAt : fallbackHole.holeAt;
    const first = measured
      ? { start: measured.first }
      : ([...lines].sort((a, b) => a.start - b.start)[0] ?? { start: 0 });
    narration = {
      lines: lines.length,
      words,
      wpm: Number(wpm.toFixed(1)),
      speak: Number(speak.toFixed(2)),
      coverage: Number(coverage.toFixed(3)),
      first: Number((first?.start ?? 0).toFixed(2)),
      hole: Number(hole.toFixed(2)),
      holeAt: Number(holeAt.toFixed(2)),
      measured: measured !== null,
    };

    // A narrated short does not open on silence. The reference reads start on
    // frame 1-4; one second is the outside of a visual hook that still has the
    // voice in it, and *Same Alarm* opened with 0.53 s — fine — then stopped for
    // sixteen.
    if (first && first.start > NARRATION_START_MAX) {
      add("narration", {
        code: "narration:start",
        message:
          `the first line starts at ${secs(first.start)} — a narrated short speaks within ` +
          `${NARRATION_START_MAX}s (no intro, no logo, no cleared throat)`,
      });
    }

    if (words > 0 && (wpm < pace.wpm[0] || wpm > pace.wpm[1])) {
      add("narration", {
        code: "narration:wpm",
        message:
          `${words} words in ${secs(duration)} is ${wpm.toFixed(0)} wpm, outside the declared ` +
          `${band(pace.wpm)} band (${Math.round((pace.wpm[0] * duration) / 60)}–` +
          `${Math.round((pace.wpm[1] * duration) / 60)} words for this length)`,
      });
    }
    if (words === 0) {
      add("narration", { code: "narration:silent", message: "the clock is narration but no line has a word in it" });
    }
    if (hole > NARRATION_HOLE_MAX) {
      add("narration", {
        code: "narration:hole",
        message:
          `${secs(hole)} with no narration from ${secs(holeAt)} — the film stops talking. ` +
          `A narrated short is carried by the voice end to end (max ${NARRATION_HOLE_MAX}s)`,
      });
    }
    if (coverage < NARRATION_COVERAGE_MIN) {
      add("narration", {
        code: "narration:coverage",
        message:
          `speech covers ${(coverage * 100).toFixed(0)}% of the film (${secs(speak)} of ${secs(duration)}); ` +
          `a narrated short speaks for at least ${NARRATION_COVERAGE_MIN * 100}% of itself`,
      });
    }
  } else if (plan.clock.mode === "sfx") {
    warn("narration", { code: "narration:none", message: "the clock is foley: the film has no spoken word" });
  }

  // 5 — the sound. One cue under the whole film is not a bed, it is a wall, and
  // it is why the delivered mix had no contrast left to land a line on.
  let longest: PreflightReport["sound"]["longest"] = null;
  for (const cue of plan.cues) {
    const seconds = cue.duration ?? kindLength(cue.kind);
    const share = duration > 0 ? seconds / duration : 0;
    if (!longest || seconds > longest.seconds) {
      longest = { id: cue.id, seconds: Number(seconds.toFixed(2)), share: Number(share.toFixed(3)) };
    }
    if (share > MAX_CUE_SHARE) {
      add("sound", {
        code: "sound:bed",
        message:
          `cue "${cue.id}" (${cue.kind}) runs ${secs(seconds)} — ${(share * 100).toFixed(0)}% of the film, ` +
          `more than the ${MAX_CUE_SHARE * 100}% a single cue may own. A bed under everything is a film with no air in it`,
      });
    }
  }

  // 6 — the cast. A rig the film's own vendor does not register draws nothing,
  // and a blank character is the kind of thing the collage must never discover.
  for (const member of cast) {
    for (const problem of member.problems) add("cast", problem);
    // A film with authored scenes is a film written under 0035, so its manifest
    // must name the characters its scenes stage. A legacy film (no scenes) is
    // not retro-fitted — the warning `asset_cast` from the resolver names it.
    if (sceneSource === "authored" && !member.asset) {
      add("cast", {
        code: "cast:asset",
        message:
          `${member.character} is in the cast but no asset names them — add ` +
          `{ "type": "character", "character": "${member.character}" } to assets[]`,
      });
    }
  }

  return {
    film: plan.projectId,
    ok: errors.length === 0,
    reproduce,
    duration: Number(duration.toFixed(3)),
    pace: { wpm: pace.wpm, medianShot: pace.medianShot, source: paceSource },
    shots: {
      count: plan.shots.length,
      median: Number(mid.toFixed(3)),
      shortest: lengths.length > 0 ? Number(Math.min(...lengths).toFixed(3)) : 0,
      longest: lengths.length > 0 ? Number(Math.max(...lengths).toFixed(3)) : 0,
    },
    narration,
    sound: { cues: plan.cues.length, longest },
    cast: cast.map(({ character, rig, poses }) => ({ character, rig, poses })),
    cut,
    sceneSource,
    errors,
    warnings,
  };
}
