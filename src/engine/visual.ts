/**
 * The visual layer, before the recipe is chosen.
 *
 * A scene says what it must show (subject, setting, action, props). A shot says
 * what is in frame, what moves, the focus, the line it answers and why that
 * image serves the line. Only then is a recipe chosen. This check refuses the
 * two failures the Uber draft exposed: a shot with no visual idea at all, and a
 * shot whose recipe cannot draw the thing its own visual brief names (a lamp
 * for a phone, a sunburst for a network).
 *
 * It is deliberately a textual check, not a pixel judgement: the frame audit and
 * the final sheet judge the pixels; this judges whether the picture was *asked
 * for* before it was painted.
 */

export type VisualShot = {
  id: string;
  recipe: string;
  beat?: string;
  scene?: string;
  visual?: {
    shows: string;
    action: string;
    focus: string;
    link: string;
    why: string;
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
    | "visual:scene-line";
  message: string;
  shot?: string;
};

const words = (text: string): string[] =>
  (text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? []).filter(Boolean);

/** Does a recipe subject appear in the visual text, as a word or a phrase? */
function hasSubject(text: string, subject: string): boolean {
  const haystack = ` ${words(text).join(" ")} `;
  const needle = words(subject).join(" ");
  return needle.length > 0 && haystack.includes(` ${needle} `);
}

export function checkVisuals(
  shots: VisualShot[],
  recipes: RecipeVisual[],
  lines: { id: string }[],
  scenes?: { id: string; visual?: { subject: string }; lines: string[] }[],
): { findings: VisualFinding[]; checked: number; recipes: number; scenes: number } {
  const findings: VisualFinding[] = [];
  const byRecipe = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const lineIds = new Set(lines.map((line) => line.id));
  const sceneById = new Map((scenes ?? []).map((scene) => [scene.id, scene]));
  const usage = new Map<string, number>();
  let checked = 0;

  for (const scene of scenes ?? []) {
    if (!scene.visual) {
      findings.push({
        code: "visual:scene",
        message: `scene "${scene.id}" has no visual idea — say what the audience must see before choosing shots`,
      });
    }
  }

  for (const shot of shots) {
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
    if (!lineIds.has(visual.link)) {
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
  }

  // The opening is part of the story, not the pack's signature. A default title
  // card is allowed only when the film has said why it opens there.
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

  const limit = Math.max(2, Math.ceil(shots.length * 0.4));
  for (const [recipe, count] of usage) {
    if (count > limit) {
      findings.push({
        code: "visual:repetition",
        message: `recipe "${recipe}" is used in ${count} of ${shots.length} shots — one image is doing too much of the film`,
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

  return { findings, checked, recipes: recipes.length, scenes: scenes?.length ?? 0 };
}
