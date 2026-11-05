/**
 * The visual layer, before the recipe is chosen.
 *
 * A scene says what it must show. A shot says what is in frame, what moves, the
 * focus, **the exact words of the narration it answers**, the one visual device
 * that makes it its own, and what any staged character physically does. Only
 * then is a recipe chosen.
 *
 * Contract 2 (decision 0056) refuses four failures the first Uber cut exposed:
 * a shot that answers a whole line instead of a moment; two shots that are the
 * same picture with different words; a character standing in a diagram for no
 * reason; and a character with no visible action. The phrase/device/performer
 * checks are lexical floors, not a semantic judge; the storyboard and a critic
 * still judge meaning.
 */

export const VISUAL_CONTRACT_VERSION = 3;
/** A recipe, device and phrase are unique in a film. Ten shots need ten ideas. */
export const VISUAL_RECIPE_MAX = 1;
/** Action/focus descriptions this close are the same gesture reworded. */
export const VISUAL_SIMILARITY_MAX = 0.7;

export type VisualShot = {
  id: string;
  recipe: string;
  beat?: string;
  scene?: string;
  /** Shots' staged cast. `[]` is how a shot says "nobody"; absent is a gap. */
  cast?: string[];
  /** Cumulative start and duration, for the measured-word check. */
  start?: number;
  duration?: number;
  /** The staged action. A cast member that never changes pose is a still. */
  direction?: {
    events: { t: number; kind: string; who?: string; pose?: string; expression?: string }[];
  };
  visual?: {
    shows: string;
    action: string;
    focus: string;
    link: string;
    why: string;
    phrase?: string;
    device?: string;
    performers?: { who: string; does: string; why: string }[];
  };
};

export type RecipeVisual = {
  id: string;
  /** Plain nouns the recipe can draw: "phone", "route", "fare", "car". */
  subjects?: string[];
  /** True for a pack's default opening card; a film must justify opening on it. */
  openingDefault?: boolean;
};

export type VisualFinding = {
  code:
    | "visual:missing"
    | "visual:link"
    | "visual:why"
    | "visual:subjects"
    | "visual:match"
    | "visual:opening"
    | "visual:repetition"
    | "visual:scene"
    | "visual:scene-line"
    | "visual:phrase-missing"
    | "visual:phrase-link"
    | "visual:phrase-short"
    | "visual:phrase-long"
    | "visual:phrase-match"
    | "visual:phrase-time"
    | "visual:device-missing"
    | "visual:device-match"
    | "visual:repeat"
    | "visual:similar"
    | "visual:cast-missing"
    | "visual:performer-missing"
    | "visual:performer-unstaged"
    | "visual:performer-who"
    | "visual:performer-extra"
    | "visual:performer-duplicate"
    | "visual:performer-does"
    | "visual:performer-why"
    | "visual:performer-unearned"
    | "visual:performer-static"
    | "visual:pose-continuity"
    | "visual:expression-continuity"
    | "visual:expression-cast"
    | "visual:action-cadence";
  message: string;
  shot?: string;
  /** For repeats/similarity: which field and which other shot. */
  field?: string;
  other?: string;
  score?: number;
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "do", "does",
  "for", "from", "had", "has", "have", "he", "her", "his", "i", "if", "in",
  "into", "is", "it", "its", "me", "my", "no", "not", "of", "on", "or", "our",
  "she", "so", "that", "the", "their", "them", "then", "there", "they", "this",
  "to", "up", "was", "we", "were", "what", "when", "where", "which", "who",
  "why", "will", "with", "you", "your",
]);

const words = (text: string): string[] =>
  (text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? []).filter(Boolean);

const stem = (word: string): string => {
  if (word.length > 5 && word.endsWith("ing")) {
    const base = word.slice(0, -3);
    // `moving -> move`, `making -> make`; `pressing -> press`, `connecting -> connect`.
    return base.endsWith("v") || base.endsWith("k") || base.endsWith("c") ? `${base}e` : base;
  }
  if (word.length > 4 && word.endsWith("ed")) {
    const base = word.slice(0, -2);
    return base.endsWith("v") || base.endsWith("k") || base.endsWith("c") ? `${base}e` : base;
  }
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
};

const content = (text: string): string[] =>
  words(text)
    // Filter on the spelling the writer used: stemming first turned `this`
    // into `thi` and `does` into `doe`, which then counted as content.
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
    .map(stem)
    .filter(Boolean);

const canonical = (text: string): string => words(text).join(" ");

function contiguous(phrase: string, line: string): boolean {
  const needle = words(phrase);
  const haystack = words(line);
  if (needle.length === 0 || needle.length > haystack.length) return false;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    if (needle.every((word, index) => haystack[start + index] === word)) return true;
  }
  return false;
}

function shared(a: readonly string[], b: readonly string[]): string[] {
  const set = new Set(b);
  return [...new Set(a)].filter((word) => set.has(word));
}

function jaccard(a: readonly string[], b: readonly string[]): number {
  const left = new Set(a);
  const right = new Set(b);
  if (left.size === 0 && right.size === 0) return 0;
  let common = 0;
  for (const word of left) if (right.has(word)) common += 1;
  return common / (left.size + right.size - common);
}

/** Does a recipe subject appear in the visual text, as a word or a phrase? */
function hasSubject(text: string, subject: string): boolean {
  const haystack = new Set(content(text));
  const needle = content(subject);
  return needle.length > 0 && needle.every((word) => haystack.has(word));
}

export type TimedWord = { w: string; start: number; end: number };

/** Find a phrase's first and last measured word, contiguously. */
export function phraseSpan(
  phrase: string,
  timed: readonly TimedWord[],
): { start: number; end: number } | null {
  const needle = words(phrase);
  if (needle.length === 0) return null;
  const haystack = timed.map((word) => words(word.w)[0] ?? "");
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    if (!needle.every((word, index) => haystack[start + index] === word)) continue;
    const first = timed[start];
    const last = timed[start + needle.length - 1];
    if (!first || !last) return null;
    return { start: first.start, end: last.end };
  }
  return null;
}

export function checkVisuals(
  shots: VisualShot[],
  recipes: RecipeVisual[],
  lines: { id: string; text?: string }[],
  scenes?: { id: string; visual?: { subject: string }; lines: string[] }[],
  timedWords?: readonly TimedWord[],
  options?: {
    contract?: number;
    /** Two pose changes closer than this are a pop, not a performance. */
    minPoseGapSeconds?: number;
    /** A shot must already be in character by this time. */
    maxFirstPoseSeconds?: number;
    /** Expression changes obey the same spacing floor as poses. */
    minExpressionGapSeconds?: number;
    maxFirstExpressionSeconds?: number;
  },
): {
  findings: VisualFinding[];
  checked: number;
  recipes: number;
  scenes: number;
  staged: number;
  phrases: number;
  signatures: { shot: string; phrase: string; device: string; shows: string }[];
} {
  const findings: VisualFinding[] = [];
  const contract = options?.contract ?? 2;
  const minPoseGap = options?.minPoseGapSeconds ?? 0.3;
  const maxFirstPose = options?.maxFirstPoseSeconds ?? 0.25;
  const minExpressionGap = options?.minExpressionGapSeconds ?? minPoseGap;
  const maxFirstExpression = options?.maxFirstExpressionSeconds ?? maxFirstPose;
  const byRecipe = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const lineById = new Map(lines.map((line) => [line.id, line]));
  const lineIds = new Set(lines.map((line) => line.id));
  /** A song/performance clock has no lines; the phrase rules do not apply yet. */
  const narration = lines.length > 0;
  const sceneById = new Map((scenes ?? []).map((scene) => [scene.id, scene]));
  const usage = new Map<string, number>();
  const signatures: { shot: string; phrase: string; device: string; shows: string; action: string[]; focus: string[] }[] = [];
  let checked = 0;
  let staged = 0;
  let phrases = 0;

  for (const scene of scenes ?? []) {
    if (!scene.visual) {
      findings.push({
        code: "visual:scene",
        message: `scene "${scene.id}" has no visual idea — say what the audience must see before choosing shots`,
      });
    }
  }

  for (const shot of shots) {
    if (shot.cast === undefined) {
      findings.push({
        code: "visual:cast-missing",
        message: `${shot.id} has no explicit cast — write "cast": [] when nobody is on screen, so a diagram cannot quietly inherit the film's lead`,
        shot: shot.id,
      });
    }
    const cast = shot.cast ?? [];
    if (cast.length > 0) staged += 1;

    if (!shot.visual) {
      findings.push({
        code: "visual:missing",
        message: `${shot.id} has no visual brief — say what is in frame, what moves, the focus, the line it answers and why`,
        shot: shot.id,
      });
      continue;
    }
    checked += 1;
    const visual = shot.visual;

    if (narration && !lineIds.has(visual.link)) {
      findings.push({
        code: "visual:link",
        message: `${shot.id} visual answers line "${visual.link}", which the clock does not have`,
        shot: shot.id,
      });
    }
    if (shot.scene) {
      const scene = sceneById.get(shot.scene);
      if (!scene) {
        findings.push({
          code: "visual:scene",
          message: `${shot.id} names scene "${shot.scene}", which scenes.json does not have`,
          shot: shot.id,
        });
      } else if (!scene.lines.includes(visual.link)) {
        findings.push({
          code: "visual:scene",
          message:
            `${shot.id} answers line "${visual.link}", but that line is not in scene "${shot.scene}" ` +
            `(${scene.lines.join(", ") || "no lines"}) — the image is cut away from its scene`,
          shot: shot.id,
        });
      }
    }
    if (words(visual.why).length < 4) {
      findings.push({
        code: "visual:why",
        message: `${shot.id} visual has a one-word reason ("${visual.why}") — say why this image serves the line`,
        shot: shot.id,
      });
    }

    // 1. The exact words. A whole line is not a shot.
    const phrase = visual.phrase?.trim();
    if (narration) {
      const line = lineById.get(visual.link);
      if (!phrase) {
        findings.push({
          code: "visual:phrase-missing",
          message: `${shot.id} has no visual phrase - quote the exact words of "${visual.link}" this image answers`,
          shot: shot.id,
        });
      } else {
        phrases += 1;
        const phraseWords = words(phrase);
        const phraseContent = content(phrase);
        const lineWords = line?.text ? words(line.text) : [];
        if (line?.text && !contiguous(phrase, line.text)) {
          findings.push({
            code: "visual:phrase-link",
            message: `${shot.id} quotes "${phrase}", which is not a contiguous run of "${line.text}" - the image answers words the narrator is not saying`,
            shot: shot.id,
          });
        }
        if (phraseWords.length < 2 || phraseContent.length === 0) {
          findings.push({
            code: "visual:phrase-short",
            message: `${shot.id} phrase "${phrase}" is too short to be an idea - quote at least two words, one of them a content word`,
            shot: shot.id,
          });
        } else if (lineWords.length > 4 && phraseWords.length > Math.ceil(lineWords.length * 0.8)) {
          findings.push({
            code: "visual:phrase-long",
            message: `${shot.id} quotes ${phraseWords.length} of the line's ${lineWords.length} words - a whole line is not a shot, quote the moment the image answers`,
            shot: shot.id,
          });
        }
        const text = `${visual.shows} ${visual.action} ${visual.focus}`;
        if (phraseContent.length > 0 && shared(phraseContent, content(text)).length === 0) {
          findings.push({
            code: "visual:phrase-match",
            message: `${shot.id} answers "${phrase}", but its shows/action/focus share no content word with those words - the picture is not of this thought`,
            shot: shot.id,
          });
        }
        if (timedWords && timedWords.length > 0 && shot.start !== undefined && shot.duration !== undefined) {
          const span = phraseSpan(phrase, timedWords);
          if (!span) {
            findings.push({
              code: "visual:phrase-time",
              message: `${shot.id} quotes "${phrase}", which is not in the measured read - the picture answers words the voice does not say`,
              shot: shot.id,
            });
          } else if (span.start < shot.start - 0.2 || span.end > shot.start + shot.duration + 0.2) {
            findings.push({
              code: "visual:phrase-time",
              message: `${shot.id} quotes "${phrase}" at ${span.start.toFixed(2)}-${span.end.toFixed(2)}s, outside its shot ${shot.start.toFixed(2)}-${(shot.start + shot.duration).toFixed(2)}s - the image is on screen before or after the words`,
              shot: shot.id,
            });
          }
        }
      }
    }

    // 2. The concrete device. A name is not an idea.
    const device = visual.device?.trim();
    if (!device || content(device).length === 0) {
      findings.push({
        code: "visual:device-missing",
        message: `${shot.id} has no visual device — name the one concrete thing that makes this image its own`,
        shot: shot.id,
      });
    } else if (shared(content(device), content(`${visual.shows} ${visual.action}`)).length === 0) {
      findings.push({
        code: "visual:device-match",
        message: `${shot.id} device "${device}" does not appear in its own shows/action — the device is a label, not the image`,
        shot: shot.id,
      });
    }

    // 3. The recipe can draw the subject.
    const recipe = byRecipe.get(shot.recipe);
    if (!recipe) {
      findings.push({
        code: "visual:subjects",
        message: `${shot.id} uses recipe "${shot.recipe}", which the style pack does not have`,
        shot: shot.id,
      });
      continue;
    }
    if (!recipe.subjects || recipe.subjects.length === 0) {
      findings.push({
        code: "visual:subjects",
        message: `${shot.id} uses recipe "${shot.recipe}", which does not declare what it can draw`,
        shot: shot.id,
      });
      continue;
    }
    const text = `${visual.shows} ${visual.focus} ${visual.action}`;
    if (!recipe.subjects.some((subject) => hasSubject(text, subject))) {
      findings.push({
        code: "visual:match",
        message:
          `${shot.id} says it shows "${visual.shows}", but recipe "${shot.recipe}" draws ` +
          `${recipe.subjects.join(", ")} — the picture does not answer the brief`,
        shot: shot.id,
      });
    }
    usage.set(shot.recipe, (usage.get(shot.recipe) ?? 0) + 1);

    // 4. A staged character must act, and the words must need the act.
    const performers = visual.performers ?? [];
    if (cast.length > 0) {
      if (performers.length === 0) {
        findings.push({
          code: "visual:performer-missing",
          message: `${shot.id} stages ${cast.join(", ")} but declares no performer action — a character in frame must do something the narration needs`,
          shot: shot.id,
        });
      }
      const seen = new Set<string>();
      for (const performer of performers) {
        if (seen.has(performer.who)) {
          findings.push({
            code: "visual:performer-duplicate",
            message: `${shot.id} declares ${performer.who} twice — one action per character per shot`,
            shot: shot.id,
          });
        }
        seen.add(performer.who);
        if (!cast.includes(performer.who)) {
          findings.push({
            code: "visual:performer-who",
            message: `${shot.id} gives an action to "${performer.who}", who is not in the shot's cast`,
            shot: shot.id,
          });
        }
        const does = content(performer.does);
        if (does.length < 2) {
          findings.push({
            code: "visual:performer-does",
            message: `${shot.id} "${performer.who}" does "${performer.does}" — name a physical action with at least two content words`,
            shot: shot.id,
          });
        } else if (shared(does, content(text)).length === 0) {
          findings.push({
            code: "visual:performer-does",
            message: `${shot.id} "${performer.who}" does "${performer.does}", which appears nowhere in the image — the action is unstageable`,
            shot: shot.id,
          });
        }
        if (content(performer.why).length < 4) {
          findings.push({
            code: "visual:performer-why",
            message: `${shot.id} "${performer.who}" has no reason — say why the narration needs this body in this frame`,
            shot: shot.id,
          });
        }
        const phraseContent = phrase ? content(phrase) : [];
        if (
          phraseContent.length > 0 &&
          !content(performer.who).some((name) => phraseContent.includes(name)) &&
          shared(does, phraseContent).length === 0
        ) {
          findings.push({
            code: "visual:performer-unearned",
            message: `${shot.id} stages "${performer.who}" on words that never ask for a body ("${phrase}") — unstage it or quote the words the action performs`,
            shot: shot.id,
          });
        }
      }
      for (const who of cast) {
        if (!performers.some((performer) => performer.who === who)) {
          findings.push({
            code: "visual:performer-extra",
            message: `${shot.id} stages "${who}" with no action — every cast member needs one block`,
            shot: shot.id,
          });
        }
      }
    } else if (performers.length > 0) {
      findings.push({
        code: "visual:performer-unstaged",
        message: `${shot.id} declares performer action but casts nobody — unstage the words or add the cast`,
        shot: shot.id,
      });
    }
    if (contract >= 3 && shot.duration !== undefined) {
      const actions = (shot.direction?.events ?? []).filter(
        (event) => event.t > 0 && ["pose", "action", "build", "light"].includes(event.kind),
      );
      const needed = Math.max(2, Math.ceil(shot.duration));
      if (actions.length < needed) {
        findings.push({
          code: "visual:action-cadence",
          message: `${shot.id} has ${actions.length} action(s) in ${shot.duration.toFixed(1)}s; the style needs at least ${needed} - a shot may not hover`,
          shot: shot.id,
        });
      }
    }
    if (contract >= 3 && cast.length > 0) {
      const poses = (shot.direction?.events ?? []).filter(
        (event) => event.kind === "pose" && event.t > 0 && cast.includes(event.who ?? ""),
      );
      if (poses.length === 0) {
        findings.push({
          code: "visual:performer-static",
          message: `${shot.id} stages ${cast.join(", ")} with no pose change — a body in the frame is not a performance`,
          shot: shot.id,
        });
      }
      const byWho = new Map<string, { t: number; pose?: string }[]>();
      for (const event of shot.direction?.events ?? []) {
        if (event.kind !== "pose") continue;
        if (!cast.includes(event.who ?? "")) continue;
        const list = byWho.get(event.who ?? "") ?? [];
        list.push({ t: event.t, pose: event.pose });
        byWho.set(event.who ?? "", list);
      }
      for (const [who, list] of byWho) {
        const sorted = [...list].sort((a, b) => a.t - b.t);
        const first = sorted[0];
        if (first && first.t > maxFirstPose + 1e-9) {
          findings.push({
            code: "visual:pose-continuity",
            message: `${shot.id} "${who}" first changes pose at ${first.t.toFixed(2)}s; the shot must be in character by ${maxFirstPose.toFixed(2)}s — a late snap is a pop`,
            shot: shot.id,
          });
        }
        for (let index = 1; index < sorted.length; index++) {
          const previous = sorted[index - 1]!;
          const current = sorted[index]!;
          if (current.pose === previous.pose) continue;
          const gap = current.t - previous.t;
          if (gap < minPoseGap - 1e-9) {
            findings.push({
              code: "visual:pose-continuity",
              message: `${shot.id} "${who}" changes pose ${gap.toFixed(2)}s after the last one; the style needs ${minPoseGap.toFixed(2)}s — back-to-back changes must blend, not snap`,
              shot: shot.id,
            });
          }
        }
      }
      const expressions = (shot.direction?.events ?? []).filter(
        (event) => event.kind === "pose" && event.expression,
      );
      const expressionByWho = new Map<string, { t: number; expression: string }[]>();
      for (const event of expressions) {
        if (!event.who) {
          findings.push({
            code: "visual:expression-cast",
            message: `${shot.id} has an expression event with no character - say whose face changes`,
            shot: shot.id,
          });
          continue;
        }
        if (!cast.includes(event.who)) {
          findings.push({
            code: "visual:expression-cast",
            message: `${shot.id} gives an expression to "${event.who}", who is not in the shot's cast`,
            shot: shot.id,
          });
          continue;
        }
        const list = expressionByWho.get(event.who) ?? [];
        list.push({ t: event.t, expression: event.expression as string });
        expressionByWho.set(event.who, list);
      }
      for (const [who, list] of expressionByWho) {
        const sorted = [...list].sort((a, b) => a.t - b.t);
        const first = sorted[0];
        if (first && first.t > maxFirstExpression + 1e-9) {
          findings.push({
            code: "visual:expression-continuity",
            message: `${shot.id} "${who}" first changes expression at ${first.t.toFixed(2)}s; the face must be in character by ${maxFirstExpression.toFixed(2)}s`,
            shot: shot.id,
          });
        }
        for (let index = 1; index < sorted.length; index++) {
          const previous = sorted[index - 1]!;
          const current = sorted[index]!;
          if (current.expression === previous.expression) continue;
          const gap = current.t - previous.t;
          if (gap < minExpressionGap - 1e-9) {
            findings.push({
              code: "visual:expression-continuity",
              message: `${shot.id} "${who}" changes expression ${gap.toFixed(2)}s after the last one; the style needs ${minExpressionGap.toFixed(2)}s`,
              shot: shot.id,
            });
          }
        }
      }
    }

    signatures.push({
      shot: shot.id,
      phrase: canonical(phrase ?? ""),
      device: canonical(device ?? ""),
      shows: canonical(visual.shows),
      action: content(visual.action),
      focus: content(visual.focus),
    });
  }

  // 5. No picture twice. Exact fields first, then near-identical gestures.
  const seenField = new Map<string, Map<string, string>>();
  for (const signature of signatures) {
    for (const field of ["phrase", "device", "shows"] as const) {
      const value = signature[field];
      if (!value) continue;
      // Compare content words for phrase/device so "the red thread" and "red
      // thread" are one image; `shows` keeps its full canonical phrasing.
      const key = field === "shows" ? value : content(value).join(" ") || value;
      const bucket = seenField.get(field) ?? new Map<string, string>();
      const other = bucket.get(key);
      if (other && other !== signature.shot) {
        findings.push({
          code: "visual:repeat",
          message: `${signature.shot} repeats ${field} "${value}" from ${other} — every shot must be its own image`,
          shot: signature.shot,
          field,
          other,
        });
      } else {
        bucket.set(key, signature.shot);
      }
      seenField.set(field, bucket);
    }
  }
  for (let i = 0; i < signatures.length; i += 1) {
    for (let j = i + 1; j < signatures.length; j += 1) {
      const a = signatures[i]!;
      const b = signatures[j]!;
      for (const axis of ["action", "focus"] as const) {
        const score = jaccard(a[axis], b[axis]);
        if (score >= VISUAL_SIMILARITY_MAX) {
          findings.push({
            code: "visual:similar",
            message: `${a.shot} and ${b.shot} have the same ${axis} (${Math.round(score * 100)}% overlap) — reworded, it is still the same shot`,
            shot: a.shot,
            other: b.shot,
            field: axis,
            score: Number(score.toFixed(2)),
          });
        }
      }
    }
  }

  // The opening is part of the story, not the pack's signature.
  const first = shots[0];
  if (first) {
    const recipe = byRecipe.get(first.recipe);
    if (recipe?.openingDefault) {
      findings.push({
        code: "visual:opening",
        message:
          `${first.id} opens on the pack's default title card "${first.recipe}" — ` +
          `the first image must come from this film's story, not the pack's signature`,
        shot: first.id,
      });
    }
  }

  for (const [recipe, count] of usage) {
    if (count > VISUAL_RECIPE_MAX) {
      findings.push({
        code: "visual:repetition",
        message: `recipe "${recipe}" is used in ${count} of ${shots.length} shots — one recipe cannot carry two different ideas`,
      });
    }
  }

  for (const scene of scenes ?? []) {
    for (const line of scene.lines) {
      if (!shots.some((shot) => shot.scene === scene.id && shot.visual?.link === line)) {
        findings.push({
          code: "visual:scene-line",
          message: `scene "${scene.id}" carries line "${line}", but no shot in that scene answers it`,
        });
      }
    }
  }

  return {
    findings,
    checked,
    recipes: recipes.length,
    scenes: scenes?.length ?? 0,
    staged,
    phrases,
    signatures: signatures.map(({ shot, phrase, device, shows }) => ({ shot, phrase, device, shows })),
  };
}