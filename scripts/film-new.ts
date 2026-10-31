/**
 * `film:new` — the front door (decision 0017, step 8).
 *
 * Writes an empty-of-invention score skeleton from a brief, then fails with the
 * precise list of fields the director must fill. It cannot invent a shot, a
 * recipe, a caption or a note; see `src/engine/film-new.ts`.
 *
 * usage: npm run film:new -- --brief <brief.json> [--out <dir>] [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { FilmBriefSchema, resolveBrief } from "../src/engine/film-brief.js";
import { filmSkeleton, filmGaps } from "../src/engine/film-new.js";

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

const relBrief = relative(root, briefPath).split(sep).join("/");
const skeleton = filmSkeleton(brief, { briefPath: relBrief });
const outPath = resolve(root, arg("out") ?? `films/${brief.id}/score.json`);

if (existsSync(outPath) && !args.includes("--force")) {
  console.error(`error: ${relative(root, outPath).split(sep).join("/")} already exists; pass --force to overwrite`);
  process.exit(2);
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(skeleton, null, 2)}\n`, "utf8");

const shown = relative(root, outPath).split(sep).join("/");
const gaps = filmGaps(skeleton);
console.log(`film:new: wrote ${shown} from ${relBrief}`);
if (gaps.length === 0) {
  console.log("film:new: the score is complete; run `npm run film -- " + shown + "`");
} else {
  console.error(`film:new: not a film yet — fill these in ${shown}:`);
  for (const gap of gaps) console.error(`  - ${gap}`);
}
console.log("film:new: the clock defaults to `free`; choose music / narration / reading if the film has a spoken or musical spine");
if (gaps.length > 0) process.exit(1);
