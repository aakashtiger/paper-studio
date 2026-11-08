#!/usr/bin/env node
/**
 * `chain-check` — every level checked against the level above it.
 *
 *   north star → script → beats → scenes → shots → storyboard → assets → render
 *
 * The north star is the proof's `north-star.json`, copied from the film's
 * `story.json`. The script is `story.json` + the measured `test-words.js` +
 * the script's own rule sheet when one is present. Each section prints a table
 * row per check and exits 1 on any structural failure.
 *
 * usage:
 *   node scripts/chain-check.mjs proofs/kpop-crime-60
 *   node scripts/chain-check.mjs --score proofs/kpop-crime-60
 *
 * writes:
 *   <score>/chain.json
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import ffmpegPath from "ffmpeg-static";
import { ROOT, loadScore, parseArgs, readJson, relToRoot, sha256, writeJson } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0] || "proofs/kpop-crime-60");
const film = score.film;
const clock = score.shots || [];
const base = String(film.id || "").replace(/-60$/, "");
const studioDir = join(ROOT, "studio", "films", base);
const baseProof = join(ROOT, "proofs", base);

const northStarPath = join(score.root, "north-star.json");
const storyPath = args.story ? resolve(ROOT, args.story) : join(studioDir, "story.json");
const beatsPath = args.beats ? resolve(ROOT, args.beats) : join(studioDir, "beats.json");
const scriptPath = args.script ? resolve(ROOT, args.script) : join(baseProof, "SCRIPT-60.md");
const cardsPath = join(score.root, "out", "cards", "index.json");
const storyboardPath = join(score.root, "out", "storyboard.json");
const videoPath = args.video ? resolve(ROOT, args.video) : join(score.root, "out", `${film.id}.mp4`);
const lookPath = join(score.root, "out", "look.json");

function optionalJson(file) {
  if (!existsSync(file)) return null;
  try {
    return readJson(file);
  } catch (error) {
    return null;
  }
}

const northStar = optionalJson(northStarPath) || {};
const story = optionalJson(storyPath) || {};
const beats = optionalJson(beatsPath) || {};
const cardsIndex = optionalJson(cardsPath);
const storyboard = optionalJson(storyboardPath);
const look = optionalJson(lookPath);
const scriptText = existsSync(scriptPath) ? readFileSync(scriptPath, "utf8") : "";
const rulesMatch = /\*\*Rules\*\*([\s\S]*?)(?=\n## |\n\*\*Count\*\*|$)/.exec(scriptText);
const rulesText = rulesMatch ? rulesMatch[1] : scriptText;

// --- measured shot-lines ---------------------------------------------------
const wordsPath = join(score.root, "test-words.js");
let wordLines = [];
let wordShots = [];
if (existsSync(wordsPath)) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(wordsPath, "utf8"), sandbox);
  wordLines = sandbox.window.KPOP_LINES || [];
  wordShots = sandbox.window.KPOP_SHOTS || [];
}

const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();
const countWords = (s) => norm(s).split(/\s+/).filter(Boolean).length;
const esc = (s) => String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pad = (s, n) => String(s ?? "").padEnd(n);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fixed = (n, d = 3) => Number(n).toFixed(d);

const EXPECTED_LINE_SHOTS = [
  ["s01", "s02"], ["s03"], ["s04", "s05"], ["s06"], ["s07", "s08"], ["s09"],
  ["s10", "s11"], ["s12"], ["s13", "s14"], ["s15"], ["s16", "s17"], ["s18"],
  ["s19"], ["s20", "s21"],
];

const lineGroups = [];
for (const line of wordLines) {
  let group = lineGroups.find((g) => g.vo === line.vo);
  if (!group) {
    group = { vo: line.vo, shots: [], parts: [] };
    lineGroups.push(group);
  }
  group.shots.push(line.shot);
  group.parts.push(line.text);
}
lineGroups.forEach((group, i) => {
  group.id = `L${i + 1}`;
  group.text = story.narration && story.narration[i] ? norm(story.narration[i].text) : norm(group.parts.join(" "));
  group.words = countWords(group.text);
});
const clockById = new Map(clock.map((shot) => [shot.id, shot]));
const filmById = new Map((film.shots || []).map((shot) => [shot.id, shot]));
const setAliases = film.setAliases && typeof film.setAliases === "object" ? film.setAliases : {};
const resolveSet = (name) => setAliases[name] || name;
const totalShots = clock.reduce((sum, shot) => sum + Number(shot.duration || 0), 0);

function sceneLength(scene) {
  return (scene.shots || []).reduce((sum, id) => sum + Number((clockById.get(id) || {}).duration || 0), 0);
}

function pngSize(file) {
  const buf = readFileSync(file);
  const png = buf.length >= 24 && buf[0] === 0x89 && buf.subarray(1, 4).toString("ascii") === "PNG";
  return png ? { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) } : null;
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function functionsIn(files) {
  const map = new Map();
  for (const file of files) {
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) if (!map.has(m[1])) map.set(m[1], file);
  }
  return map;
}

function probeVideo(file) {
  const info = spawnSync(ffmpegPath, ["-hide_banner", "-i", file], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const text = `${info.stderr || ""}\n${info.stdout || ""}`;
  const dm = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(text);
  const fm = /(\d+(?:\.\d+)?)\s*fps/.exec(text);
  const sm = /(\d{3,5})x(\d{3,5})/.exec(text);
  const duration = dm ? Number(dm[1]) * 3600 + Number(dm[2]) * 60 + Number(dm[3]) : null;
  const fps = fm ? Number(fm[1]) : null;
  const progress = spawnSync(ffmpegPath, [
    "-hide_banner", "-v", "error", "-progress", "pipe:1", "-i", file,
    "-map", "0:v:0", "-f", "null", "-",
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const frames = Math.max(0, ...[...String(progress.stdout || "").matchAll(/frame=(\d+)/g)].map((m) => Number(m[1])));
  return { duration, fps, frames, width: sm ? Number(sm[1]) : null, height: sm ? Number(sm[2]) : null };
}

function walkJson(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJson(file));
    else if (entry.name.endsWith(".json")) out.push(file);
  }
  return out;
}

// --- the table -------------------------------------------------------------
const sections = [];
let current = null;
function begin(level) {
  current = { level, rows: [], findings: [] };
  sections.push(current);
}
function add(check, detail, pass) {
  const row = { check, detail, pass: !!pass };
  current.rows.push(row);
  if (!row.pass) current.findings.push({ check, detail });
  return row;
}
const failures = () => sections.flatMap((s) => s.findings.map((f) => ({ level: s.level, ...f })));

// --- 1. north star → script ------------------------------------------------
begin("north star → script");
const storyNarration = Array.isArray(story.narration) ? story.narration : [];
const narrationWords = storyNarration.reduce((sum, line) => sum + countWords(line.text), 0);
const shotWords = wordLines.reduce((sum, line) => sum + countWords(line.text), 0);
const shotCount = (film.shots || []).length;
const sceneCount = (film.scenes || []).length;
const beatCount = (beats.beats || []).length;

add("north star id", `${northStar.id || "(missing)"} vs story ${story.id || "(missing)"}`, northStar.id && northStar.id === story.id);
add("title", `${northStar.title || "(missing)"} vs story ${story.title || "(missing)"}`, northStar.title && northStar.title === story.title);
add("logline", "north star copies the story's logline", northStar.logline && northStar.logline === story.logline);
add("tone", "north star copies the story's tone", northStar.tone && northStar.tone === story.tone);
add("audience", "north star copies the story's audience", northStar.audience && northStar.audience === story.audience);
add("spine", "want / obstacle / turn / button match the story", !!northStar.spine && stable(northStar.spine) === stable(story.spine));
const nn = Array.isArray(northStar.nonNegotiables) ? northStar.nonNegotiables : [];
const WANT_NN = [
  "male-only cast", "non-graphic murder and execution", "60.00 s", "186 words",
  "14 voice-over lines", "21 shots", "7 scenes", "the cell is visited twice",
  "the calendar never reaches 11",
];
add("non-negotiables listed", `${nn.length}/9 in north-star.json`, WANT_NN.every((x) => nn.includes(x)));

add("narration lines", `${storyNarration.length} (want 14)`, storyNarration.length === 14);
add("narration words", `${narrationWords} (want 186)`, narrationWords === 186);
add("shot-lines", `${wordLines.length} (want 21)`, wordLines.length === 21);
add("shot-line words", `${shotWords} (want 186)`, shotWords === 186);
add("beats", `${beatCount} (want 7)`, beatCount === 7);
add("scenes", `${sceneCount} (want 7)`, sceneCount === 7);
add("shot clock", `${fixed(totalShots, 3)} s (want 60.00)`, Math.abs(totalShots - 60) <= 0.001);

const maleOnly = /male only|No women on screen/i.test(rulesText)
  && !/female|woman|women|girl/i.test(`${JSON.stringify(film.castStyle || {})}${JSON.stringify(film.castRoles || {})}`);
add("non-negotiable male-only cast", "script rules say male only / no women; no female role", maleOnly);

const gore = /\b(blood|gore|corpse|dismember|decapitat\w*|intestines|hanged|hanging)\b/i;
const allFilmText = (film.shots || []).map((s) => [s.summary, s.intent, s.action].join(" ")).join(" ");
const s21 = (film.shots || []).find((s) => s.id === "s21");
const nonGraphic = /no gore/i.test(scriptText) && /No body, no drop/i.test(rulesText)
  && !gore.test(allFilmText) && !/\bdrop\b/i.test(String((s21 || {}).action || ""));
add("non-negotiable non-graphic", "no gore, no body, no drop; s21 is a shadow and a fade", nonGraphic);

const cellShots = (film.shots || [])
  .filter((s) => (s.setBase || resolveSet(s.set)) === "cell")
  .map((s) => s.id);
add("non-negotiable 60.00 s", "story.duration 60, script 60.00 s, clock 60.00 s",
  Number(story.duration) === 60 && /60\.00 s/.test(scriptText) && Math.abs(totalShots - 60) <= 0.001);
add("non-negotiable 186 words", "story and shot-lines both 186; script says 186 words",
  narrationWords === 186 && shotWords === 186 && /186 words/.test(scriptText));
add("non-negotiable 14 lines", "14 story lines; script says 14 voice-over lines",
  storyNarration.length === 14 && /14 voice-over lines/.test(scriptText));
add("non-negotiable 21 shots", "21 clock shots; script says 21 shots",
  shotCount === 21 && wordShots.length === 21 && /21 shots/.test(scriptText));
add("non-negotiable 7 scenes", "7 film scenes; script says 7 scenes",
  sceneCount === 7 && /7 scenes/.test(scriptText));
add("non-negotiable cell return", `cell shots ${cellShots.join(", ")}; script says cell visits s16/s19`,
  /Cell visits/i.test(scriptText) && same(cellShots, ["s16", "s19"]));
const calendarValues = (film.shots || [])
  .map((s) => (s.state || {}).calendar)
  .filter((v) => v !== undefined && v !== null)
  .map((v) => Number(v));
const maxCalendar = calendarValues.length ? Math.max(...calendarValues) : null;
const noEleven = calendarValues.every((v) => Number.isFinite(v) && v <= 10)
  && !(film.shots || []).some((s) => /(^|\D)11(\D|$)|eleven/i.test(String((s.state || {}).calendar || "")));
add("non-negotiable calendar never 11", `max calendar page ${maxCalendar}; script says never reaches 11`,
  /calendar never reaches 11/i.test(rulesText) && maxCalendar === 10 && noEleven);

// --- 2. script → beats -----------------------------------------------------
begin("script → beats");
const beatIds = new Set((beats.beats || []).map((b) => b.id));
for (let i = 0; i < storyNarration.length; i++) {
  const line = storyNarration[i];
  add(`line ${i + 1}`, `${line.id || "?"} → ${line.beat || "(no beat)"}`, !!line.beat && beatIds.has(line.beat));
}
const linesPerBeat = new Map();
for (const line of storyNarration) linesPerBeat.set(line.beat, (linesPerBeat.get(line.beat) || 0) + 1);
for (const beat of beats.beats || []) {
  const n = linesPerBeat.get(beat.id) || 0;
  add(`beat ${beat.id} lines`, `${n} line(s)`, n >= 1);
}
const shareSum = (beats.beats || []).reduce((sum, b) => sum + Number(b.share || 0), 0);
add("beat shares sum", `${fixed(shareSum, 4)} (want 100.00)`, Math.abs(shareSum - 100) <= 0.01);
for (let i = 0; i < Math.min(sceneCount, beatCount); i++) {
  const scene = film.scenes[i];
  const beat = beats.beats[i];
  const length = sceneLength(scene);
  const expected = length / 60 * 100;
  const diff = Number(beat.share) - expected;
  add(`beat ${beat.id} ↔ scene ${scene.id}`, `share ${fixed(beat.share, 4)} vs ${fixed(expected, 4)} (${diff >= 0 ? "+" : ""}${fixed(diff, 4)})`, Math.abs(diff) <= 0.2);
}

// --- 3. beats → scenes -----------------------------------------------------
begin("beats → scenes");
add("beat count", `${beatCount} (want 7)`, beatCount === 7);
add("scene count", `${sceneCount} (want 7)`, sceneCount === 7);
add("same order", (film.scenes || []).map((s, i) => `${s.id}←${(beats.beats || [])[i] ? beats.beats[i].id : "?"}`).join(" "),
  sceneCount === beatCount && (film.scenes || []).every((s, i) => !!(beats.beats || [])[i]));
for (let i = 0; i < sceneCount; i++) {
  const scene = film.scenes[i];
  const beat = (beats.beats || [])[i];
  add(`scene ${scene.id}`, `${beat ? beat.id : "(no beat)"}, ${(scene.shots || []).length} shots`,
    !!beat && (scene.shots || []).length === 3);
}
add("every scene has a beat", `${sceneCount}/${sceneCount}`, (film.scenes || []).every((s, i) => !!(beats.beats || [])[i]));
add("every beat has a scene", `${beatCount}/${beatCount}`, (beats.beats || []).every((b, i) => !!(film.scenes || [])[i]));

// --- 4. scenes → shots -----------------------------------------------------
begin("scenes → shots");
const owners = new Map();
for (const scene of film.scenes || []) for (const shotId of scene.shots || []) {
  if (!owners.has(shotId)) owners.set(shotId, []);
  owners.get(shotId).push(scene.id);
}
const badOwners = clock.filter((shot) => (owners.get(shot.id) || []).length !== 1);
add("one scene per shot", `${clock.length - badOwners.length}/${clock.length} in exactly one scene`,
  badOwners.length === 0);
add("21 shot-lines cover 14 lines", `${lineGroups.length} line groups`, lineGroups.length === 14 && wordLines.length === 21);
for (let i = 0; i < EXPECTED_LINE_SHOTS.length; i++) {
  const group = lineGroups[i];
  const expected = EXPECTED_LINE_SHOTS[i];
  add(`line L${i + 1}`, `expected ${expected.join("–")}, actual ${group ? group.shots.join("–") : "(missing)"}`,
    !!group && same(group.shots, expected));
}
const lineTextOk = lineGroups.every((group, i) => storyNarration[i] && norm(group.parts.join(" ")) === norm(storyNarration[i].text));
add("shot-lines concatenate to story lines", "all 14 shot-line groups match their story line", lineTextOk);
const missingContract = (film.shots || []).filter((s) => countWords(s.intent) < 2 || countWords(s.action) < 2).map((s) => s.id);
add("intent and action", `${(film.shots || []).length - missingContract.length}/${(film.shots || []).length} shots`,
  missingContract.length === 0);
const opening = film.opening || {};
const openingShot = filmById.get(opening.shot);
const act = /\b(murder|knife|body)\b/i;
add("opening", `${opening.shot || "(missing)"} action names ${opening.act || "the act"}`,
  !!openingShot && act.test(String(openingShot.action || "")));

// --- 5. shots → storyboard -------------------------------------------------
begin("shots → storyboard");
const cards = cardsIndex && Array.isArray(cardsIndex.cards) ? cardsIndex.cards : [];
add("cards", `${cards.length} (want ${clock.length})`, cards.length === clock.length);
const cardOrderOk = same(cards.map((c) => c.id), clock.map((s) => s.id));
add("card order", cardOrderOk ? "21 card ids in shot order" : `out of order: ${cards.map((c) => c.id).join(" ")}`, cardOrderOk);
const seenStill = new Map();
for (const card of cards) {
  const problems = [];
  if (!card.still) problems.push("no still");
  else {
    if (seenStill.has(card.still)) problems.push(`shared with ${seenStill.get(card.still)}`);
    else seenStill.set(card.still, card.id);
    const absolute = join(ROOT, card.still);
    if (!existsSync(absolute)) problems.push("missing");
    else {
      const size = pngSize(absolute);
      if (!size) problems.push("not PNG");
      else if (size.width !== 1920 || size.height !== 1080) problems.push(`${size.width}x${size.height}`);
      if (sha256(absolute) !== card.stillHash) problems.push("hash mismatch");
    }
  }
  add(`card ${card.id}`, `${card.still || "(none)"} ${problems.length ? `— ${problems.join("; ")}` : "1920x1080, hash ok"}`, problems.length === 0);
}
if (!cards.length) add("card stills", "no cards; run scripts/shot-cards.mjs", false);
const sbRows = storyboard && Array.isArray(storyboard.rows) ? storyboard.rows : [];
add("storyboard.json", storyboard ? `${sbRows.length} rows, pass=${!!storyboard.pass}` : "missing; run scripts/storyboard-check.mjs",
  !!storyboard && !!storyboard.pass && sbRows.length === clock.length);
for (const row of sbRows) {
  const card = cards.find((c) => c.id === row.shot);
  const ok = !!card && row.still === card.still && row.stillHash === card.stillHash;
  add(`storyboard ${row.shot}`, ok ? `${row.still}` : "still/hash does not match the card", ok);
}
const cs = storyboard && storyboard.contactSheet;
add("contact sheet", cs ? (cs.present ? `${cs.width}x${cs.height}, pass=${!!cs.pass}` : "not present") : "no storyboard report",
  !!cs && (!cs.present || !!cs.pass));

// --- 6. shots → assets -----------------------------------------------------
begin("shots → assets");
const setFiles = [
  join(baseProof, "sets.js"),
  join(baseProof, "sets-bridge.js"),
  join(score.root, "sets-60.js"),
].filter(existsSync);
const propFiles = [join(baseProof, "props.js"), join(ROOT, "src", "props.js")].filter(existsSync);
const setFns = functionsIn(setFiles);
const propFns = functionsIn(propFiles);
const shotFiles = new Map(clock.map((s) => [s.id, join(score.root, "shots", `${s.id}.js`)]).filter(([, f]) => existsSync(f)));
const shotSrc = new Map([...shotFiles].map(([id, file]) => [id, readFileSync(file, "utf8")]));

for (const name of Object.keys(film.sets || {})) {
  add(`set ${name}`, `${name}Set()`, setFns.has(`${name}Set`));
}
for (const shot of film.shots || []) {
  const resolved = shot.setBase || resolveSet(shot.set);
  add(`set ${shot.id}`, `${shot.set} → ${resolved}`, !!film.sets[resolved] && setFns.has(`${resolved}Set`));
}
const STRUCT_LAYERS = new Set(["backdrop", "cast", "foreground", "foregroundBars", "type", "hud"]);
const ALL_SIGNATURES = new Set(Object.values(film.sets || {}).flatMap((s) => s.signature || []));
const PROP_FN = {
  knife: "knifeProp", caseFile: "caseFile", ticket: "ticketProp", money: "moneyProp",
  hat: "flatCapProp", flatCap: "flatCapProp", handcuffs: "handcuffs", cuffs: "handcuffs", gavel: "gavelProp",
  noose: "nooseProp", calendar: "calendarProp",
};
const SHOT_ALIAS = {
  grayHat: "flatCapProp", flatCap: "flatCapProp", courtJacket: "foldedCourtJacket", verdict: "verdict",
  floorboard: "floorboard", coveredBody: "body", cellDoor: "door", knifeDrawing: "knife",
  bridgeRail: "bridgeSet", street: "chaseSet", bag: "bag09", policeTape: "tape",
};
function resolveName(name, source) {
  if (STRUCT_LAYERS.has(name)) return { ok: true, via: "layer" };
  if (ALL_SIGNATURES.has(name)) return { ok: true, via: "set signature" };
  if (propFns.has(name)) return { ok: true, via: "prop function" };
  if (PROP_FN[name] && propFns.has(PROP_FN[name])) return { ok: true, via: PROP_FN[name] };
  if (new RegExp(`\\b${esc(name)}\\b`).test(source)) return { ok: true, via: "shot-local" };
  if (SHOT_ALIAS[name] && new RegExp(`\\b${esc(SHOT_ALIAS[name])}\\b`).test(source)) return { ok: true, via: SHOT_ALIAS[name] };
  return { ok: false, via: "missing" };
}
for (const shot of film.shots || []) {
  const resolved = shot.setBase || resolveSet(shot.set);
  const entry = film.sets[resolved];
  const signature = entry && Array.isArray(entry.signature) ? entry.signature : [];
  const props = Array.isArray(shot.props) ? shot.props : [];
  const layers = Array.isArray(shot.layers) ? shot.layers : [];
  const missingSig = signature.filter((name) => !props.includes(name) && !layers.includes(name));
  add(`signature ${shot.id}`, `${resolved}: ${missingSig.length ? `missing ${missingSig.join(", ")}` : "complete"}`, missingSig.length === 0);

  const source = shotSrc.get(shot.id) || "";
  const names = [...new Set([...props, ...layers])];
  const missingNames = names
    .map((name) => ({ name, resolved: resolveName(name, source) }))
    .filter((x) => !x.resolved.ok);
  add(`names ${shot.id}`, missingNames.length ? `no draw symbol: ${missingNames.map((x) => x.name).join(", ")}` : `${names.length} names resolve`, missingNames.length === 0);
}

const castStyle = film.castStyle || {};
for (const [role, style] of Object.entries(castStyle)) {
  add(`castStyle ${role}`, `${style.hat || "no hat"}, ${style.silhouette || "no silhouette"}`, true);
}
for (const [key, role] of Object.entries(film.castRoles || {})) {
  add(`cast ${key}`, `role ${role}`, !!castStyle[role]);
}
const whos = [...new Set((film.shots || []).flatMap((s) => (s.handProps || []).map((h) => h.who)))];
for (const who of whos) {
  const role = (film.castRoles || {})[who];
  add(`handProp who ${who}`, role ? `role ${role}` : "not a cast key", !!role && !!castStyle[role]);
}
const badCardCast = cards.flatMap((card) => (card.cast || [])
  .map((who) => ({ who, role: (film.castRoles || {})[who] || who }))
  .filter((x) => !castStyle[x.role])
  .map((x) => `${card.id}.${x.who}→${x.role}`));
add("card cast keys", badCardCast.length ? `unresolved: ${badCardCast.join(", ")}` : `${cards.length} cards resolve`, badCardCast.length === 0);

const CAST_CALL = /\b(man|detective|warder|judge)\s*\(/;
function callLine(lines, name) {
  const re = new RegExp(`\\b${esc(name)}\\s*\\(`);
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    if (re.test(lines[i])) return i;
  }
  return -1;
}
function lastCastLine(lines) {
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    if (CAST_CALL.test(lines[i])) last = i;
  }
  return last;
}
for (const shot of film.shots || []) {
  const source = shotSrc.get(shot.id);
  for (const fg of shot.foreground || []) {
    if (!source) {
      add(`foreground ${shot.id} ${fg}`, "no shot file", false);
      continue;
    }
    const lines = source.split(/\r?\n/);
    const call = callLine(lines, fg);
    const cast = lastCastLine(lines);
    if (call < 0) add(`foreground ${shot.id} ${fg}`, "named but not drawn (no call)", false);
    else if (cast >= 0 && call < cast) add(`foreground ${shot.id} ${fg}`, `drawn at ${call + 1}, before cast at ${cast + 1}`, false);
    else add(`foreground ${shot.id} ${fg}`, cast >= 0 ? `drawn at ${call + 1}, after cast at ${cast + 1}` : `drawn at ${call + 1}, no cast`, true);
  }
}

// --- 7. shots → render -----------------------------------------------------
begin("shots → render");
add("shot ranges sum", `${fixed(totalShots, 3)} s`, Math.abs(totalShots - 60) <= 0.001);
let contiguous = true;
for (let i = 1; i < clock.length; i++) {
  if (Math.abs(Number(clock[i].start) - Number(clock[i - 1].end)) > 0.001) contiguous = false;
}
add("shot ranges contiguous", clock.length ? `${clock[0].start} → ${clock[clock.length - 1].end}` : "no shots", contiguous);
const clockMatchesWords = wordShots.length === clock.length && wordShots.every((s, i) => s.id === clock[i].id && Math.abs(s.start - clock[i].start) < 0.001 && Math.abs(s.end - clock[i].end) < 0.001);
add("shots.json matches measured clock", `${clock.length} rows`, clockMatchesWords);

let videoHash = null;
let probe = null;
if (!existsSync(videoPath)) {
  add("delivered video", `${relToRoot(videoPath)} missing`, false);
} else {
  videoHash = sha256(videoPath);
  probe = probeVideo(videoPath);
  add("delivered video", relToRoot(videoPath), true);
  add("video sha256", videoHash, true);
  add("video duration", `${probe.duration === null ? "?" : probe.duration.toFixed(2)} s (want 60.00)`, probe.duration !== null && Math.abs(probe.duration - 60) <= 0.01);
  add("video fps", `${probe.fps} (want 30)`, probe.fps === 30);
  add("video frames", `${probe.frames} (want 1800)`, probe.frames === 1800);
  add("video size", `${probe.width}x${probe.height} (want 1920x1080)`, probe.width === 1920 && probe.height === 1080);
  add("shots vs video", `${fixed(totalShots, 3)} s vs ${probe.duration === null ? "?" : probe.duration.toFixed(2)} s`, probe.duration !== null && Math.abs(totalShots - probe.duration) <= 0.01);
}
if (!look) {
  add("look.json", "missing", false);
} else {
  add("look.json video", look.videoHash && videoHash && look.videoHash === videoHash
    ? "videoHash matches the delivered picture"
    : `videoHash ${look.videoHash || "missing"} does not match`, !!look.videoHash && (!videoHash || look.videoHash === videoHash));
}
const reports = [];
for (const file of walkJson(join(score.root, "out"))) {
  const value = optionalJson(file);
  if (value && typeof value === "object" && typeof value.videoHash === "string") {
    reports.push({ file, value });
  }
}
add("gate reports", `${reports.length} report(s) carry a videoHash`, reports.length > 0);
for (const report of reports) {
  const ok = !!videoHash && report.value.videoHash === videoHash;
  add(`gate ${relToRoot(report.file)}`, `${report.value.videoHash.slice(0, 16)}… ${ok ? "tied" : "NOT tied"}`, ok);
}

// --- write chain.json ------------------------------------------------------
function input(file) {
  return {
    path: relToRoot(file),
    sha256: existsSync(file) ? sha256(file) : null,
  };
}
const table = sections.flatMap((s) => s.rows.map((r) => ({ level: s.level, check: r.check, detail: r.detail, pass: r.pass })));
const findings = failures();
const pass = findings.length === 0;
const chain = {
  id: film.id,
  score: score.rel,
  pass,
  checks: table.length,
  failed: findings.length,
  table,
  sections: sections.map((s) => ({ level: s.level, pass: s.findings.length === 0, failed: s.findings.length, rows: s.rows })),
  findings,
  inputs: {
    northStar: input(northStarPath),
    story: input(storyPath),
    beats: input(beatsPath),
    film: input(score.filmPath),
    shots: input(score.shotsPath),
    cards: input(cardsPath),
    storyboard: input(storyboardPath),
    script: input(scriptPath),
    video: {
      path: relToRoot(videoPath),
      sha256: videoHash || (existsSync(videoPath) ? sha256(videoPath) : null),
    },
  },
};
writeJson(join(score.root, "chain.json"), chain);

// --- print -----------------------------------------------------------------
console.log(`chain-check: ${score.rel}`);
for (const section of sections) {
  const failed = section.rows.filter((r) => !r.pass).length;
  console.log("");
  console.log(`[${section.level}] ${section.rows.length} checks, ${failed} failed`);
  console.log(`${pad("check", 42)}${pad("detail", 76)}result`);
  for (const row of section.rows) {
    console.log(`${pad(row.check, 42)}${pad(row.detail, 76)}${row.pass ? "PASS" : "FAIL"}`);
  }
}
console.log("");
if (findings.length) {
  console.error(`chain-check: FAIL — ${findings.length}/${table.length} checks failed`);
  for (const f of findings) console.error(`  - ${f.level} / ${f.check}: ${f.detail}`);
  console.log(`\nwrote ${relToRoot(join(score.root, "chain.json"))}`);
  process.exit(1);
}
console.log(`chain-check: PASS — ${table.length} checks across ${sections.length} levels`);
console.log(`wrote ${relToRoot(join(score.root, "chain.json"))}`);
