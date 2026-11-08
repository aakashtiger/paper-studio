#!/usr/bin/env node
/**
 * `storyboard-check` — exactly one still per shot, in shot order.
 *
 * This is the structural storyboard: it checks that every card names a still
 * that exists, is 1920×1080, hashes to the card, sits inside its shot, and is
 * unique. If the contact sheet is present, every tile is checked with SSIM
 * against the card still, or another still inside the same shot, so the sheet
 * is in the same shot order as the score.
 *
 * The sense of the image — does the still show the intent, the action, the line
 * — is the picture critic's job, not this script's.
 *
 * usage:
 *   node scripts/storyboard-check.mjs proofs/kpop-crime-60
 *   node scripts/storyboard-check.mjs --score proofs/kpop-crime-60
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import ffmpegPath from "ffmpeg-static";
import { ROOT, loadScore, parseArgs, readJson, relToRoot, sha256 } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0] || "proofs/kpop-crime-60");
const cardsPath = join(score.root, "out", "cards", "index.json");
if (!existsSync(cardsPath)) {
  console.error(`storyboard-check: FAIL — no cards at ${relToRoot(cardsPath)}; run scripts/shot-cards.mjs first`);
  process.exit(1);
}
const cardsIndex = readJson(cardsPath);
const cards = Array.isArray(cardsIndex.cards) ? cardsIndex.cards : [];
const clock = score.shots || [];
const findings = [];

function note(shot, message) {
  findings.push({ shot, message });
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

function cardHash(card) {
  const { stillHash, cardHash, ...rest } = card;
  return createHash("sha256").update(stable(rest)).digest("hex");
}

function stillTime(file) {
  const m = /\/t(\d+)_(\d+)\.png$/.exec(String(file || ""));
  return m ? Number(`${m[1]}.${m[2]}`) : null;
}

const stillDir = join(score.root, "out", "stills");
const stillPool = existsSync(stillDir)
  ? readdirSync(stillDir)
      .filter((name) => /^t\d+_\d+\.png$/.test(name))
      .map((name) => {
        const m = /^t(\d+)_(\d+)\.png$/.exec(name);
        return { file: join(stillDir, name), time: Number(`${m[1]}.${m[2]}`) };
      })
  : [];

/** SSIM between the 640×360 contact-sheet tile and the card still. */
function tileSsim(tile, still) {
  const r = spawnSync(ffmpegPath, [
    "-hide_banner", "-v", "info", "-i", tile, "-i", still,
    "-filter_complex", "[1:v]scale=640:360[s];[0:v][s]ssim",
    "-f", "null", "-",
  ], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const m = /All:([0-9.]+)/.exec(`${r.stderr || ""}\n${r.stdout || ""}`);
  return m ? Number(m[1]) : null;
}

const rows = [];
const seenStill = new Map();
let previousTime = -Infinity;

for (let i = 0; i < clock.length; i++) {
  const shot = clock[i];
  const card = cards[i];
  const problems = [];
  if (!card) {
    note(shot.id, "no card at this index");
    rows.push({ shot: shot.id, still: null, width: null, height: null, stillHash: null, pass: false, problems: ["no card"] });
    continue;
  }
  if (card.id !== shot.id) problems.push(`card id ${card.id} at index ${i}, expected ${shot.id}`);
  if (!card.still) {
    problems.push("no still");
  } else {
    const absolute = join(ROOT, card.still);
    if (!existsSync(absolute)) {
      problems.push(`still missing: ${card.still}`);
    } else {
      if (seenStill.has(card.still)) problems.push(`still shared with ${seenStill.get(card.still)}`);
      else seenStill.set(card.still, shot.id);
      const size = pngSize(absolute);
      if (!size) problems.push("still is not a PNG");
      else if (size.width !== 1920 || size.height !== 1080) problems.push(`still is ${size.width}x${size.height}, expected 1920x1080`);
      const hash = sha256(absolute);
      if (hash !== card.stillHash) problems.push(`still sha256 ${hash.slice(0, 12)}… does not match card ${String(card.stillHash).slice(0, 12)}…`);
      const t = stillTime(card.still);
      if (t === null) problems.push("still name has no t<seconds> time");
      else {
        if (t < shot.start || t > shot.end) problems.push(`still t=${t} is outside ${shot.id} (${shot.start}–${shot.end})`);
        if (t <= previousTime) problems.push(`still t=${t} is not after the previous still (${previousTime})`);
        previousTime = t;
      }
    }
  }
  if (cardHash(card) !== card.cardHash) problems.push("cardHash does not match the card content");
  for (const p of problems) note(shot.id, p);
  const size = card.still && existsSync(join(ROOT, card.still)) ? pngSize(join(ROOT, card.still)) : null;
  rows.push({
    shot: shot.id,
    still: card.still,
    width: size ? size.width : null,
    height: size ? size.height : null,
    stillHash: card.stillHash,
    pass: problems.length === 0,
    problems,
  });
}

if (cards.length !== clock.length) note("storyboard", `${cards.length} cards for ${clock.length} clock shots`);

// The contact sheet is optional. When it exists, prove the tiles are the
// cards' stills, in order, not merely 21 pictures.
let contactSheet = { path: "out/sheet/contact-sheet.png", present: false, pass: true, problems: [] };
const sheetPath = join(score.root, "out", "sheet", "contact-sheet.png");
if (existsSync(sheetPath)) {
  contactSheet.present = true;
  const size = pngSize(sheetPath);
  const COLS = 3, ROWS = 7, TILE_W = 640, TILE_H = 360, GAP = 6, MARGIN = 6;
  const expectedW = COLS * TILE_W + (COLS - 1) * GAP + 2 * MARGIN;
  const expectedH = ROWS * TILE_H + (ROWS - 1) * GAP + 2 * MARGIN;
  contactSheet.width = size ? size.width : null;
  contactSheet.height = size ? size.height : null;
  contactSheet.expected = { width: expectedW, height: expectedH, cols: COLS, rows: ROWS };
  if (!size) contactSheet.problems.push("contact sheet is not a PNG");
  else if (size.width !== expectedW || size.height !== expectedH) {
    contactSheet.problems.push(`contact sheet is ${size.width}x${size.height}, expected ${expectedW}x${expectedH} (3x7 of 640x360)`);
  }
  if (clock.length !== COLS * ROWS) contactSheet.problems.push(`${clock.length} shots for a ${COLS}x${ROWS} sheet`);
  contactSheet.tiles = [];
  for (let i = 0; i < clock.length; i++) {
    const tile = join(score.root, "out", "sheet", `f${String(i + 1).padStart(2, "0")}.png`);
    const card = cards[i];
    const entry = { shot: clock[i].id, tile: relToRoot(tile), pass: false, ssim: null, problems: [] };
    if (!existsSync(tile)) entry.problems.push("tile missing");
    else {
      const ts = pngSize(tile);
      if (!ts) entry.problems.push("tile is not a PNG");
      else if (ts.width !== TILE_W || ts.height !== TILE_H) entry.problems.push(`tile is ${ts.width}x${ts.height}, expected ${TILE_W}x${TILE_H}`);
      if (card && card.still && existsSync(join(ROOT, card.still))) {
        const cardFile = join(ROOT, card.still);
        let s = tileSsim(tile, cardFile);
        let matched = cardFile;
        // A contact sheet may pick a different instant inside the same shot.
        // If the card's exact still does not match, accept any still whose
        // time falls inside this shot; the order and the shot are what this
        // script proves, the chosen instant is the picture critic's call.
        if (s === null || s < 0.9) {
          for (const candidate of stillPool) {
            if (candidate.time < clock[i].start || candidate.time > clock[i].end) continue;
            if (candidate.file === cardFile) continue;
            const v = tileSsim(tile, candidate.file);
            if (v !== null && (s === null || v > s)) { s = v; matched = candidate.file; }
            if (s !== null && s >= 0.9) break;
          }
        }
        entry.ssim = s;
        entry.still = relToRoot(matched);
        if (s === null) entry.problems.push("could not measure tile against a still");
        else if (s < 0.9) entry.problems.push(`tile does not match any still in ${clock[i].id} (best SSIM ${s.toFixed(3)})`);
        else if (matched !== cardFile) entry.note = `same shot, different instant: ${relToRoot(matched)} (SSIM ${s.toFixed(3)})`;
      } else {
        entry.problems.push("no card still to compare");
      }
    }
    entry.pass = entry.problems.length === 0;
    if (!entry.pass) contactSheet.problems.push(`${clock[i].id}: ${entry.problems.join("; ")}`);
    contactSheet.tiles.push(entry);
  }
  contactSheet.pass = contactSheet.problems.length === 0;
  for (const p of contactSheet.problems) note("contact sheet", p);
} else {
  contactSheet.note = "not present (optional)";
}

const pass = findings.length === 0;
const storyboard = {
  id: score.film.id,
  score: score.rel,
  pass,
  rows,
  contactSheet,
  findings,
};
mkdirSync(join(score.root, "out"), { recursive: true });
writeFileSync(join(score.root, "out", "storyboard.json"), `${JSON.stringify(storyboard, null, 2)}\n`, "utf8");

const pad = (s, n) => String(s ?? "").padEnd(n);
console.log(`storyboard-check: ${score.rel}`);
console.log("");
console.log(`${pad("shot", 8)}${pad("still", 48)}${pad("size", 12)}${pad("sheet", 8)}result`);
for (const row of rows) {
  const tile = contactSheet.tiles ? contactSheet.tiles.find((t) => t.shot === row.shot) : null;
  const sheet = contactSheet.present ? (tile && tile.pass ? "PASS" : "FAIL") : "-";
  console.log(`${pad(row.shot, 8)}${pad(row.still || "-", 48)}${pad(row.width ? `${row.width}x${row.height}` : "-", 12)}${pad(sheet, 8)}${row.pass ? "PASS" : `FAIL — ${row.problems.join("; ")}`}`);
}
console.log("");
console.log(`contact sheet: ${contactSheet.present ? (contactSheet.pass ? `PASS — ${contactSheet.tiles.filter((t) => t.pass).length}/${contactSheet.tiles.length} tiles` : `FAIL — ${contactSheet.problems.length} problem(s)`) : "not present"}`);
if (findings.length) {
  console.error(`\nstoryboard-check: FAIL — ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f.shot}: ${f.message}`);
  process.exit(1);
}
console.log(`\nstoryboard-check: PASS — ${rows.length} shots, one still each, in shot order`);
