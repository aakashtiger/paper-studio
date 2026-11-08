/**
 * `sync-check` — the narration is the score, and every meaningful word must
 * have a picture event on it.
 *
 * It reads the measured word times (`test-words.js`) and the authored sync
 * table (`sync.json`), checks that:
 *   - every content word has an event within 0.2 s;
 *   - every event names a word that exists in its shot's line;
 *   - the event times are inside the shot;
 *   - each shot has at least 3 events, including a cast event and a
 *     prop/light/set/crowd event;
 *   - no gap between events is longer than 1.3 s;
 *   - every shot source calls `syncLocal("sN", ...)` when `shots/` exists, so
 *     the picture actually reads the table;
 *   - the shot band (1.0–4.5 s, median 2.5–3.0), the narration rate
 *     (170–195 wpm) and the word gaps (≤ 0.6 s) hold.
 *
 * It writes `<film-root>/sync.js`, which the page reads. The picture and the
 * validator therefore share one timing table.
 *
 * usage: node scripts/sync-check.mjs [film-root]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const ROOT = process.argv[2] || "proofs/kpop-test";
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(`${ROOT}/test-words.js`, "utf8"), sandbox);
const W = sandbox.window;
const words = W.KPOP_WORDS;
const lines = W.KPOP_LINES;
const shots = W.KPOP_SHOTS;
const duration = W.KPOP_DURATION;
const table = JSON.parse(readFileSync(`${ROOT}/sync.json`, "utf8"));

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, "");
const STOP = new Set("and the a an to of in on it its her his he she they we you i was were is are be been had that who for with at as but so".split(" "));
const findings = [];

// The sync table is only a table until a shot reads it. Every shot source must
// call syncLocal("sN", ...) at least once; otherwise the picture is not bound
// to the measured word clock, however correct the table is.
if (existsSync(`${ROOT}/shots`)) {
  for (const shot of shots) {
    const file = `${ROOT}/shots/s${String(shot.id).replace(/^s/, "").padStart(2, "0")}.js`;
    if (!existsSync(file)) {
      findings.push(`${shot.id}: missing shot source ${file}`);
      continue;
    }
    const src = readFileSync(file, "utf8");
    const call = new RegExp(`syncLocal\\s*\\(\\s*["']${shot.id}["']`);
    if (!call.test(src)) findings.push(`${shot.id}: ${file} never calls syncLocal("${shot.id}", ...)`);
  }
} else {
  console.log(`sync-check: ${ROOT}/shots not found; source binding skipped`);
}

function lineOf(shotId) {
  const i = shots.findIndex((s) => s.id === shotId);
  return i >= 0 ? lines[i] : null;
}
function wordIn(line, text, occurrence = 0) {
  const hits = line.words.filter((w) => norm(w.w) === norm(text));
  return hits[occurrence] || null;
}

const eventsByShot = new Map();
const sync = {};
for (const shot of table.shots) {
  const line = lineOf(shot.id);
  if (!line) { findings.push(`${shot.id}: no line`); continue; }
  const meta = shots.find((s) => s.id === shot.id);
  sync[shot.id] = {};
  const rows = [];
  for (const ev of shot.events) {
    const w = wordIn(line, ev.word, ev.occurrence || 0);
    if (!w) { findings.push(`${shot.id}/${ev.id}: word "${ev.word}" is not in the line`); continue; }
    const t = +(w.t + (ev.offset || 0)).toFixed(3);
    if (t < meta.start - 0.05 || t > meta.end + 0.05) findings.push(`${shot.id}/${ev.id}: ${t}s is outside ${meta.start}–${meta.end}`);
    sync[shot.id][ev.id] = t;
    rows.push({ ...ev, t, word: w.w });
  }
  eventsByShot.set(shot.id, rows);
}

// coverage: every content word has an event within 0.2 s
for (const shot of shots) {
  const line = lineOf(shot.id);
  const events = eventsByShot.get(shot.id) || [];
  for (const w of line.words) {
    if (STOP.has(norm(w.w)) || !norm(w.w)) continue;
    const hit = events.find((e) => Math.abs(e.t - w.t) <= 0.2);
    if (!hit) findings.push(`${shot.id}: content word "${w.w}" at ${w.t}s has no event within 0.2 s`);
  }
  if (events.length < 3) findings.push(`${shot.id}: only ${events.length} events; at least 3`);
  if (!events.some((e) => e.layer === "cast")) findings.push(`${shot.id}: no cast event`);
  if (!events.some((e) => ["prop", "light", "set", "crowd"].includes(e.layer))) findings.push(`${shot.id}: no prop/light/set/crowd event`);
  if (!events.some((e) => e.layer === "camera")) findings.push(`${shot.id}: no camera event`);
  const ts = events.map((e) => e.t).sort((a, b) => a - b);
  for (let i = 1; i < ts.length; i++) {
    if (ts[i] - ts[i - 1] > 1.3) findings.push(`${shot.id}: ${(ts[i] - ts[i - 1]).toFixed(2)}s gap between events`);
  }
}

// shot band and narration
const lens = shots.map((s) => s.end - s.start);
const sorted = [...lens].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
for (const s of shots) {
  const d = s.end - s.start;
  if (d < 1.0 || d > 4.5) findings.push(`${s.id}: ${d.toFixed(2)}s is outside 1.0–4.5 s`);
}
if (median < 2.5 || median > 3.0) findings.push(`median shot ${median.toFixed(2)}s is outside 2.5–3.0 s`);
const first = words[0].t, last = words[words.length - 1].t + words[words.length - 1].d;
const wpm = words.length / (last - first) * 60;
if (wpm < 170 || wpm > 195) findings.push(`narration ${wpm.toFixed(1)} wpm is outside 170–195`);
let maxGap = 0, gapAt = 0;
for (let i = 1; i < words.length; i++) {
  const gap = words[i].t - (words[i - 1].t + words[i - 1].d);
  if (gap > maxGap) { maxGap = gap; gapAt = words[i - 1].t; }
}
if (maxGap > 0.6) findings.push(`word gap ${maxGap.toFixed(2)}s at ${gapAt.toFixed(2)}s is over 0.6 s`);

const out = `/* generated by scripts/sync-check.mjs — do not hand-edit */
window.KPOP_SYNC = ${JSON.stringify(sync, null, 0)};
window.syncAt = function (shot, id) {
  const s = window.KPOP_SYNC[shot];
  if (!s || s[id] === undefined) throw new Error('sync: ' + shot + '/' + id + ' missing');
  return s[id];
};
window.syncLocal = function (shot, id) {
  const s = window.KPOP_SHOTS.find((x) => x.id === shot);
  return window.syncAt(shot, id) - (s ? s.start : 0);
};
`;
writeFileSync(`${ROOT}/sync.js`, out);

console.log(`sync-check: ${words.length} words, ${shots.length} shots, ${table.shots.reduce((n, s) => n + s.events.length, 0)} events`);
console.log(`narration ${wpm.toFixed(1)} wpm, max word gap ${maxGap.toFixed(2)}s at ${gapAt.toFixed(2)}s`);
console.log(`shot lengths ${lens.map((d) => d.toFixed(2)).join(" / ")}  median ${median.toFixed(2)}s`);
for (const s of shots) {
  const ev = (eventsByShot.get(s.id) || []).map((e) => `${e.t.toFixed(2)} ${e.word}→${e.id}`).join(" | ");
  console.log(`${s.id} ${s.start.toFixed(2)}–${s.end.toFixed(2)}  ${ev}`);
}
if (findings.length) {
  console.error(`\n${findings.length} finding(s):`);
  for (const f of findings) console.error("  - " + f);
  process.exit(1);
}
console.log("\nPASS: every content word has a picture event.");
