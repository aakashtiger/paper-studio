/**
 * `film:new` — the front door (decision 0017, step 8; decision 0025; 0030).
 *
 * Writes the film's **documents** from a brief, in the order it has to write
 * them: `story.json`, then `beats.json`, then `scenes.json`, then `score.json`.
 * Before 0030 it wrote only the score, which is how a film came to begin at its
 * shot list — the defect 0025 exists to stop — because the only document the
 * tool offered was the last one. Before 0035 it skipped `scenes.json` while
 * printing that it was next.
 *
 * It cannot invent a shot, a beat, a recipe, a caption, a line or a note. It
 * writes the fields the brief already states, leaves every sentence a person has
 * to mean empty, and then fails with the precise list of what is missing in each
 * document.
 *
 * usage: npm run film:new -- --brief <brief.json> [--out <dir>] [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { FilmBriefSchema, resolveBrief } from "../src/engine/film-brief.js";
import { beatsSkeleton, filmGaps, filmSkeleton, sceneGaps, scenesSkeleton, storyGaps, storySkeleton } from "../src/engine/film-new.js";
import { PaceSchema, type Pace } from "../src/engine/story.js";

const args = process.argv.slice(2);

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const briefArg = arg("brief");
if (!briefArg) {
  console.error("usage: npm run film:new -- --brief <brief.json> [--out <dir>] [--force]");
  process.exit(2);
}

const root = process.cwd();
const briefPath = resolve(root, briefArg);
if (!existsSync(briefPath)) {
  console.error(`error: brief not found: ${briefArg}`);
  process.exit(2);
}

const brief = FilmBriefSchema.parse(JSON.parse(readFileSync(briefPath, "utf8")));
const styleDir = resolve(root, `styles/${brief.style}`);
if (!existsSync(styleDir)) {
  console.error(`error: no style pack at styles/${brief.style}`);
  process.exit(1);
}
const { errors } = resolveBrief(brief, styleDir);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.code}: ${error.message}`);
  process.exit(1);
}

/**
 * The tempo the film is written to, in the order decision 0026 set: this style's
 * `tokens.json`, then the default band for the idiom. Writing it into the story
 * makes the band a stated fact of the film instead of an assumption of the check.
 */
function stylePace(): Pace | undefined {
  const tokensPath = join(styleDir, "tokens.json");
  if (!existsSync(tokensPath)) return undefined;
  const tokens = JSON.parse(readFileSync(tokensPath, "utf8")) as { pace?: unknown };
  const parsed = PaceSchema.safeParse(tokens.pace);
  return parsed.success ? parsed.data : undefined;
}

const relBrief = relative(root, briefPath).split(sep).join("/");
const outDir = resolve(root, arg("out") ?? `films/${brief.id}`);
const documents = [
  { name: "story.json", body: storySkeleton(brief, { briefPath: relBrief, pace: stylePace() }), gap: "stage 1" },
  { name: "beats.json", body: beatsSkeleton(brief), gap: "stage 2" },
  { name: "scenes.json", body: scenesSkeleton(brief), gap: "stage 3" },
  {
    name: "score.json",
    body: filmSkeleton(brief, { briefPath: relBrief }),
    gap: "stage 4",
  },
];

const existing = documents.filter((doc) => existsSync(join(outDir, doc.name)));
if (existing.length > 0 && !args.includes("--force")) {
  console.error(
    `error: ${existing.map((doc) => relative(root, join(outDir, doc.name)).split(sep).join("/")).join(", ")} already exists; pass --force to overwrite`,
  );
  process.exit(2);
}

mkdirSync(outDir, { recursive: true });
const shown = (path: string) => relative(root, path).split(sep).join("/");
for (const doc of documents) {
  writeFileSync(join(outDir, doc.name), `${JSON.stringify(doc.body, null, 2)}\n`, "utf8");
  console.log(`film:new: wrote ${shown(join(outDir, doc.name))}`);
}

const story = documents[0]?.body;
const beats = documents[1]?.body;
const scenes = documents[2]?.body;
const score = documents[3]?.body;

const storyGapList = storyGaps(story, beats);
const sceneGapList = sceneGaps(scenes, story, beats, { requireVisual: true });
const scoreGapList = filmGaps(score, { requireVisual: true });
const dir = shown(outDir);
console.log("");
console.log("film:new: the order is story -> beats -> scenes -> shots. Write them in that order:");
console.log(`  1. ${dir}/story.json   the spine, the logline, the narration lines and the tone`);
console.log(`  2. ${dir}/beats.json   what each beat is for, how much of the film it owns, its signature sound`);
console.log(`  3. ${dir}/scenes.json  where each scene happens, who is in it, what happens, which lines it carries`);
console.log(`  4. npm run preflight -- ${dir}/score.json   which checks the scenes, the narration and every gap`);
if (storyGapList.length === 0 && sceneGapList.length === 0 && scoreGapList.length === 0) {
  console.log(`film:new: the film is written; run \`npm run preflight -- ${dir}/score.json\``);
  process.exit(0);
}
console.error("");
console.error(`film:new: not a film yet — fill these in ${dir}/story.json and ${dir}/beats.json:`);
for (const gap of storyGapList) console.error(`  - ${gap}`);
console.error("");
console.error(`film:new: and these in ${dir}/scenes.json:`);
for (const gap of sceneGapList) console.error(`  - ${gap}`);
console.error("");
console.error(`film:new: and these in ${dir}/score.json:`);
for (const gap of scoreGapList) console.error(`  - ${gap}`);
console.error("");
console.error("film:new: the clock defaults to `free`; choose music / narration / reading if the film has a spoken or musical spine");
process.exit(1);
