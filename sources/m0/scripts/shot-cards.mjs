#!/usr/bin/env node
/**
 * `shot-cards` — one reviewable card per shot.
 *
 * A card is the smallest unit a reviewer can judge: the words spoken in the
 * shot, the script line they belong to, the beat and scene that own them, the
 * staging the score asks for, and the still the picture actually shows.
 *
 * usage:
 *   node scripts/shot-cards.mjs proofs/kpop-crime-60
 *   node scripts/shot-cards.mjs --score proofs/kpop-crime-60
 *
 * writes:
 *   <score>/out/cards/sNN.json
 *   <score>/out/cards/index.json
 *   <score>/out/cards/index.md
 *
 * `cardHash` is sha256 over the card's own content with `stillHash` and
 * `cardHash` removed, serialised with sorted keys. The still is the existing
 * `out/stills/t*.png` nearest 55% through the shot; the card does not paint a
 * new frame.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import vm from "node:vm";
import { ROOT, loadScore, parseArgs, readJson, relToRoot, sha256 } from "./review-util.mjs";

const NON_CAST = new Set(["queue", "crowd", "bystanders", "gallery"]);

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0] || "proofs/kpop-crime-60");
const film = score.film;
if (!Array.isArray(film.shots) || !film.shots.length) {
  console.error("shot-cards: FAIL — film.shots is missing");
  process.exit(1);
}

// The story and beats live beside the film's source id (`kpop-crime-60` →
// `kpop-crime`). A `--story`/`--beats` pair overrides the derivation.
const base = String(film.id || "").replace(/-60$/, "");
const studioDir = join(ROOT, "studio", "films", base);
const storyPath = args.story ? resolve(ROOT, args.story) : join(studioDir, "story.json");
const beatsPath = args.beats ? resolve(ROOT, args.beats) : join(studioDir, "beats.json");
for (const [label, file] of [["story", storyPath], ["beats", beatsPath]]) {
  if (!existsSync(file)) {
    console.error(`shot-cards: FAIL — ${label} not found: ${relToRoot(file)}`);
    process.exit(1);
  }
}
const story = readJson(storyPath);
const beats = readJson(beatsPath);

const wordsPath = join(score.root, "test-words.js");
if (!existsSync(wordsPath)) {
  console.error(`shot-cards: FAIL — no test-words.js in ${score.rel}`);
  process.exit(1);
}
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(wordsPath, "utf8"), sandbox);
const wordLines = sandbox.window.KPOP_LINES || [];
const wordShots = sandbox.window.KPOP_SHOTS || [];
if (!wordLines.length) {
  console.error("shot-cards: FAIL — test-words.js has no KPOP_LINES");
  process.exit(1);
}

const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();
const lower = (s) => String(s || "").trim().toLowerCase();

// The script's line table is rebuilt from the measured shot-lines: consecutive
// shots with the same `vo` are one of the 14 lines. The story's narration is
// the authority for the line text.
const lineGroups = [];
for (const line of wordLines) {
  const shotId = line.shot;
  let group = lineGroups.find((g) => g.vo === line.vo);
  if (!group) {
    group = { vo: line.vo, shots: [], parts: [], text: "" };
    lineGroups.push(group);
  }
  group.shots.push(shotId);
  group.parts.push(line.text);
}
if (lineGroups.length !== 14) {
  console.error(`shot-cards: FAIL — expected 14 script lines, found ${lineGroups.length} (vo groups)`);
  process.exit(1);
}
lineGroups.forEach((group, i) => {
  group.id = `L${i + 1}`;
  group.text = norm(story.narration[i] ? story.narration[i].text : group.parts.join(" "));
  group.words = group.text.split(/\s+/).filter(Boolean).length;
});

const shotLine = new Map();
for (const line of wordLines) {
  const group = lineGroups.find((g) => g.vo === line.vo);
  shotLine.set(line.shot, { line, group });
}

const stillDir = join(score.root, "out", "stills");
const stillFiles = existsSync(stillDir)
  ? readdirSync(stillDir).filter((f) => /^t\d+_\d+\.png$/.test(f)).map((f) => {
      const m = /^t(\d+)_(\d+)\.png$/.exec(f);
      return { name: f, time: Number(`${m[1]}.${m[2]}`) };
    })
  : [];

function nearestStill(start, end) {
  if (!stillFiles.length) return null;
  const target = start + (end - start) * 0.55;
  return [...stillFiles].sort((a, b) => {
    const da = Math.abs(a.time - target);
    const db = Math.abs(b.time - target);
    return da - db || a.time - b.time;
  })[0];
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

function castKeys(shot, filmShot) {
  const keys = [];
  const add = (key) => {
    const k = lower(key);
    if (!k || NON_CAST.has(k) || keys.includes(k)) return;
    keys.push(k);
  };
  const shotFile = join(score.root, "shots", `${shot.id}.js`);
  if (existsSync(shotFile)) {
    const src = readFileSync(shotFile, "utf8");
    const m = /cast:\s*"([^"]*)"/.exec(src);
    if (m) for (const name of m[1].split("/")) add(name);
  }
  for (const prop of filmShot.handProps || []) add(prop.who);
  if (filmShot.firstAppearance) {
    for (const [key, role] of Object.entries(film.castRoles || {})) {
      if (role === filmShot.firstAppearance) add(key);
    }
  }
  return keys;
}

const shotsById = new Map((score.shots || []).map((s) => [s.id, s]));
const filmById = new Map(film.shots.map((s) => [s.id, s]));
const sceneOf = new Map();
for (const scene of film.scenes || []) {
  for (const shotId of scene.shots || []) sceneOf.set(shotId, scene);
}

const cards = [];
const missingStills = [];
for (const shot of score.shots || []) {
  const filmShot = filmById.get(shot.id) || {};
  const scene = sceneOf.get(shot.id) || {};
  const sceneIndex = (film.scenes || []).findIndex((s) => s.id === scene.id);
  const beat = sceneIndex >= 0 ? (beats.beats || [])[sceneIndex] : null;
  const resolved = shotLine.get(shot.id) || null;
  const still = nearestStill(shot.start, shot.end);
  let stillRel = null;
  let stillHash = null;
  if (still) {
    const absolute = join(stillDir, still.name);
    stillRel = relToRoot(absolute);
    stillHash = sha256(absolute);
    const size = pngSize(absolute);
    if (!size || size.width !== 1920 || size.height !== 1080) {
      missingStills.push(`${shot.id}: ${stillRel} is ${size ? `${size.width}x${size.height}` : "not a PNG"}, expected 1920x1080`);
    }
  } else {
    missingStills.push(`${shot.id}: no t*.png in out/stills`);
  }

  const content = {
    id: shot.id,
    start: shot.start,
    end: shot.end,
    line: resolved ? resolved.line.text : null,
    scriptLine: resolved ? resolved.group.id : null,
    beat: beat ? beat.id : null,
    scene: scene.id || null,
    intent: filmShot.intent || null,
    action: filmShot.action || null,
    set: filmShot.set || null,
    props: Array.isArray(filmShot.props) ? filmShot.props : [],
    cast: castKeys(shot, filmShot),
    handProps: Array.isArray(filmShot.handProps) ? filmShot.handProps : [],
    foreground: Array.isArray(filmShot.foreground) ? filmShot.foreground : [],
    matchCut: !!filmShot.matchCut,
    firstAppearance: filmShot.firstAppearance ?? null,
    roleTag: filmShot.roleTag ?? null,
    still: stillRel,
    stillHash,
  };
  const { stillHash: _stillHash, ...hashed } = content;
  content.cardHash = createHash("sha256").update(stable(hashed)).digest("hex");
  cards.push(content);
}

if (cards.length !== (score.shots || []).length || cards.length !== film.shots.length) {
  console.error(`shot-cards: FAIL — ${cards.length} cards for ${film.shots.length} score shots and ${(score.shots || []).length} clock shots`);
  process.exit(1);
}

const cardsDir = join(score.root, "out", "cards");
mkdirSync(cardsDir, { recursive: true });
for (const card of cards) {
  writeFileSync(join(cardsDir, `${card.id}.json`), `${JSON.stringify(card, null, 2)}\n`, "utf8");
}

const lineTable = lineGroups.map((g) => ({
  id: g.id,
  vo: g.vo,
  shots: g.shots,
  words: g.words,
  text: g.text,
}));
const index = {
  id: film.id,
  score: score.rel,
  count: cards.length,
  lineTable,
  cards,
};
writeFileSync(join(cardsDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const md = [];
md.push(`# ${story.title || film.id} — shot cards`, "");
md.push(`${cards.length} shots · ${lineGroups.length} script lines · ${(film.scenes || []).length} scenes`, "");
md.push("| shot | line | beat | scene | intent | action | still |");
md.push("|---|---|---|---|---|---|---|");
for (const card of cards) {
  md.push(`| ${card.id} | ${esc(`${card.scriptLine} · ${card.line}`)} | ${esc(card.beat)} | ${esc(card.scene)} | ${esc(card.intent)} | ${esc(card.action)} | ${esc(card.still)} |`);
}
writeFileSync(join(cardsDir, "index.md"), `${md.join("\n")}\n`, "utf8");

console.log(`shot-cards: ${score.rel}`);
console.log(`  ${cards.length} cards, ${lineGroups.length} script lines, ${cards.filter((c) => c.still).length} stills`);
console.log(`  wrote out/cards/index.json and out/cards/index.md`);
if (missingStills.length) {
  console.error("\nshot-cards: still problems");
  for (const f of missingStills) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("shot-cards: PASS");
