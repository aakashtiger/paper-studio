/**
 * `set-check` — every set declares what makes it legible, and every shot shows it.
 *
 * A set is not a backdrop name. film.json declares `sets[name].signature`: the
 * props that tell the audience where they are. Every shot must render every
 * signature prop of its set, in `props` or in `layers`.
 *
 * usage:
 *   node scripts/set-check.mjs proofs/kpop-crime-60/film.json
 *   node scripts/set-check.mjs --score proofs/kpop-crime-60
 */
import { loadScore, parseArgs } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const film = score.film;

const EXPECTED = {
  sets: {
    train: {
      intent: "one sentence: what this place is for in the story",
      signature: ["trainWindow", "seats", "luggage", "door", "tunnel"],
    },
  },
};

if (!film.sets || typeof film.sets !== "object" || Array.isArray(film.sets)) {
  console.error("set-check: FAIL — film.sets is missing.\n");
  console.error("Expected shape:\n");
  console.error(JSON.stringify(EXPECTED, null, 2));
  process.exit(1);
}
if (!Array.isArray(film.shots) || !film.shots.length) {
  console.error("set-check: FAIL — film.shots is missing");
  process.exit(1);
}

const findings = [];
const note = (s) => findings.push(s);
const sets = film.sets;
const setNames = Object.keys(sets);
const setAliases = film.setAliases && typeof film.setAliases === "object" ? film.setAliases : {};
const resolveSet = (name) => setAliases[name] || name;

for (const name of setNames) {
  const entry = sets[name] || {};
  if (typeof entry.intent !== "string" || !entry.intent.trim()) note(`sets.${name}.intent is empty`);
  if (!Array.isArray(entry.signature) || !entry.signature.length) note(`sets.${name}.signature needs at least one prop`);
  else for (const prop of entry.signature) {
    if (typeof prop !== "string" || !prop.trim()) note(`sets.${name}.signature has an empty prop`);
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`set-check: ${score.rel}/film.json`);
console.log("");
console.log(`${pad("shot", 8)}${pad("set", 16)}signature`);
for (const name of setNames) {
  const sig = Array.isArray(sets[name].signature) ? sets[name].signature : [];
  console.log(`${pad("", 8)}${pad(name, 16)}${sig.join(", ") || "(missing)"}`);
}
console.log("");
console.log(`${pad("shot", 8)}${pad("set", 16)}result`);
let missingShots = 0;
for (const shot of film.shots) {
  const declared = shot.set;
  const name = resolveSet(declared);
  const entry = sets[name];
  if (!entry) {
    note(`${shot.id}: set "${declared}" is not declared in film.sets`);
    console.log(`${pad(shot.id, 8)}${pad(declared || "(none)", 16)}FAIL — undeclared set`);
    missingShots++;
    continue;
  }
  const props = Array.isArray(shot.props) ? shot.props : [];
  const layers = Array.isArray(shot.layers) ? shot.layers : [];
  const signature = Array.isArray(entry.signature) ? entry.signature : [];
  const missing = signature.filter((p) => !props.includes(p) && !layers.includes(p));
  if (missing.length) {
    note(`${shot.id} (${name}): missing ${missing.join(", ")}`);
    console.log(`${pad(shot.id, 8)}${pad(name, 16)}FAIL — missing ${missing.join(", ")}`);
    missingShots++;
  } else {
    console.log(`${pad(shot.id, 8)}${pad(name, 16)}PASS`);
  }
}

if (findings.length) {
  console.error(`\nset-check: FAIL — ${missingShots}/${film.shots.length} shots miss a signature prop, ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nset-check: PASS — ${setNames.length} sets, ${film.shots.length} shots show every signature prop`);
