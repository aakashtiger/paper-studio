#!/usr/bin/env node
/**
 * `assets-check` — can the picture draw what the cards ask for?
 *
 * Coverage, not beauty. The props critic judges whether the knife reads as a
 * knife; this tool checks that a draw function exists, that a hand prop names
 * its owner, that a foreground entry is actually called after the cast, and
 * that every set signature is present in the shot's props/layers.
 *
 * usage:
 *   node scripts/assets-check.mjs proofs/kpop-crime-60
 *   node scripts/assets-check.mjs --score proofs/kpop-crime-60
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadScore, parseArgs, readJson, relToRoot } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0] || "proofs/kpop-crime-60");
const film = score.film;
const cardsPath = join(score.root, "out", "cards", "index.json");
if (!existsSync(cardsPath)) {
  console.error(`assets-check: FAIL — no cards at ${relToRoot(cardsPath)}; run scripts/shot-cards.mjs first`);
  process.exit(1);
}
const cards = readJson(cardsPath).cards || [];
const filmShots = new Map((film.shots || []).map((s) => [s.id, s]));

const base = String(film.id || "").replace(/-60$/, "");
const baseProof = join(ROOT, "proofs", base);
const setFiles = [
  join(baseProof, "sets.js"),
  join(baseProof, "sets-bridge.js"),
  join(score.root, "sets-60.js"),
].filter(existsSync);
const propFiles = [
  join(baseProof, "props.js"),
  join(ROOT, "src", "props.js"),
].filter(existsSync);
const shotFiles = new Map(
  cards.map((c) => [c.id, join(score.root, "shots", `${c.id}.js`)]).filter(([, f]) => existsSync(f)),
);

const FN_RE = /^function\s+([A-Za-z_$][\w$]*)\s*\(/gm;
function functionsIn(files) {
  const map = new Map();
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(FN_RE)) if (!map.has(m[1])) map.set(m[1], file);
  }
  return map;
}
const setFns = functionsIn(setFiles);
const propFns = functionsIn([...propFiles, ...shotFiles.values()]);
const shotSrc = new Map([...shotFiles].map(([id, file]) => [id, readFileSync(file, "utf8")]));

const setAliases = film.setAliases && typeof film.setAliases === "object" ? film.setAliases : {};
const resolveSet = (name) => setAliases[name] || name;
const pad = (s, n) => String(s ?? "").padEnd(n);
const findings = [];
const note = (where, message) => findings.push({ where, message });

// --- sets -----------------------------------------------------------------
const setRows = [];
for (const name of Object.keys(film.sets || {})) {
  const fn = `${name}Set`;
  const file = setFns.get(fn) || null;
  const ok = !!file;
  setRows.push({ name, fn, file: file ? relToRoot(file) : null, pass: ok });
  if (!ok) note(`set ${name}`, `no draw function ${fn}() in ${setFiles.map(relToRoot).join(", ")}`);
}

const setRowsByShot = [];
for (const card of cards) {
  const filmShot = filmShots.get(card.id) || {};
  const resolved = filmShot.setBase || resolveSet(filmShot.set);
  const known = !!film.sets[resolved];
  const fn = `${resolved}Set`;
  const hasFn = !!setFns.get(fn);
  setRowsByShot.push({ shot: card.id, declared: filmShot.set, resolved, hasFn, pass: known && hasFn });
  if (!known) note(`shot ${card.id}`, `set "${filmShot.set}" does not resolve to a film.sets entry`);
  else if (hasFn === false) note(`shot ${card.id}`, `set "${resolved}" has no ${fn}()`);
}

// --- hand props ------------------------------------------------------------
// The film's hand-prop vocabulary. A name resolves to the function that draws
// it, including the two names the old paint spells differently (`cuffs`,
// `courtJacket`) and the inline verdict card.
const KNOWN_PROPS = {
  knife: { fn: "knifeProp", inline: false },
  caseFile: { fn: "caseFile", inline: false },
  ticket: { fn: "ticketProp", inline: false },
  money: { fn: "moneyProp", inline: false },
  hat: { fn: "flatCapProp", inline: false },
  handcuffs: { fn: "handcuffs", inline: false },
  cuffs: { fn: "handcuffs", inline: false },
  courtJacket: { fn: "foldedCourtJacket", inline: false },
  gavel: { fn: "gavelProp", inline: false },
  verdict: { fn: "verdict", inline: true },
  grayHat: { fn: "flatCapProp", inline: false },
  flatCap: { fn: "flatCapProp", inline: false },
};
const handRows = [];
for (const card of cards) {
  for (const hp of card.handProps || []) {
    const prop = String(hp.prop || "");
    const known = KNOWN_PROPS[prop];
    const source = shotSrc.get(card.id) || "";
    let fn = null;
    let owner = null;
    let ok = false;
    let via = "";
    if (known && known.inline) {
      fn = known.fn;
      owner = new RegExp(`\\b${fn}\\b`).test(source) ? shotFiles.get(card.id) : null;
      ok = !!owner;
      via = owner ? "inline in shot" : "missing inline draw";
    } else if (known && propFns.get(known.fn)) {
      fn = known.fn;
      owner = propFns.get(fn);
      ok = true;
      via = "function";
    } else if (new RegExp(`function\\s+${prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`).test(source)) {
      fn = prop;
      owner = shotFiles.get(card.id);
      ok = true;
      via = "shot-local function";
    } else if (new RegExp(`\\b${prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(source)) {
      fn = prop;
      owner = shotFiles.get(card.id);
      ok = true;
      via = "shot-local name";
    }
    handRows.push({ shot: card.id, who: hp.who, hand: hp.hand, prop, fn, owner: owner ? relToRoot(owner) : null, via, pass: ok });
    if (!ok) note(`shot ${card.id} hand prop`, `"${prop}" has no known function and no shot-local declaration`);
  }
}

// --- cast ------------------------------------------------------------------
const castRows = [];
const castStyle = film.castStyle || {};
for (const [key, role] of Object.entries(film.castRoles || {})) {
  const style = castStyle[role];
  castRows.push({ key, role, hasStyle: !!style, pass: !!style });
  if (!style) note(`cast ${key}`, `role "${role}" is not in castStyle`);
}
for (const key of Object.keys(film.cast || {})) {
  if (!film.castRoles || !film.castRoles[key]) {
    if (!castStyle[key]) {
      castRows.push({ key, role: key, hasStyle: false, pass: false });
      note(`cast ${key}`, `cast key has no role mapping and no castStyle entry`);
    }
  }
}
for (const card of cards) {
  for (const who of card.cast || []) {
    const role = (film.castRoles && film.castRoles[who]) || who;
    if (!castStyle[role]) note(`shot ${card.id} cast`, `"${who}" resolves to role "${role}", which is not in castStyle`);
  }
  for (const hp of card.handProps || []) {
    const who = hp.who;
    const role = film.castRoles && film.castRoles[who];
    if (!role) note(`shot ${card.id} handProp`, `who "${who}" is not a key in film.castRoles`);
    else if (!castStyle[role]) note(`shot ${card.id} handProp`, `who "${who}" has role "${role}", which is not in castStyle`);
  }
}

// --- foreground ------------------------------------------------------------
const CAST_CALL = /\b(man|detective|warder|judge)\s*\(/;
function callLine(lines, name) {
  const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
    if (re.test(line)) return i;
  }
  return -1;
}
function castLine(lines) {
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    if (CAST_CALL.test(lines[i])) last = i;
  }
  return last;
}
const foregroundRows = [];
for (const card of cards) {
  const source = shotSrc.get(card.id);
  for (const fg of card.foreground || []) {
    const row = { shot: card.id, name: fg, call: null, cast: null, pass: false, detail: "" };
    if (!source) {
      row.detail = "no shot file";
    } else {
      const lines = source.split(/\r?\n/);
      const call = callLine(lines, fg);
      const cast = castLine(lines);
      row.call = call >= 0 ? call + 1 : null;
      row.cast = cast >= 0 ? cast + 1 : null;
      if (call < 0) {
        row.detail = "named but not drawn (no call in the shot file)";
      } else if (cast >= 0 && call < cast) {
        row.detail = `drawn at line ${call + 1}, before the last cast draw at line ${cast + 1}`;
      } else {
        row.pass = true;
        row.detail = cast >= 0 ? `drawn at line ${call + 1}, after cast at line ${cast + 1}` : `drawn at line ${call + 1}; no cast draw`;
      }
    }
    foregroundRows.push(row);
    if (!row.pass) note(`shot ${card.id} foreground`, `${fg}: ${row.detail}`);
  }
}

// --- set signatures --------------------------------------------------------
const signatureRows = [];
for (const card of cards) {
  const filmShot = filmShots.get(card.id) || {};
  const resolved = filmShot.setBase || resolveSet(filmShot.set);
  const entry = film.sets[resolved];
  if (!entry) {
    signatureRows.push({ shot: card.id, set: resolved, missing: ["(no set)"], pass: false });
    continue;
  }
  const signature = Array.isArray(entry.signature) ? entry.signature : [];
  const props = Array.isArray(filmShot.props) ? filmShot.props : [];
  const layers = Array.isArray(filmShot.layers) ? filmShot.layers : [];
  const missing = signature.filter((name) => !props.includes(name) && !layers.includes(name));
  signatureRows.push({ shot: card.id, set: resolved, missing, pass: missing.length === 0 });
  if (missing.length) note(`shot ${card.id} set ${resolved}`, `missing signature ${missing.join(", ")}`);
}

// --- table -----------------------------------------------------------------
console.log(`assets-check: ${score.rel}`);
console.log("");
console.log("sets");
console.log(`${pad("set", 14)}${pad("draw function", 18)}${pad("file", 42)}result`);
for (const row of setRows) {
  console.log(`${pad(row.name, 14)}${pad(row.fn, 18)}${pad(row.file || "-", 42)}${row.pass ? "PASS" : "FAIL"}`);
}
console.log("");
console.log("hand props");
console.log(`${pad("shot", 8)}${pad("who", 10)}${pad("hand", 6)}${pad("prop", 14)}${pad("resolved", 42)}${pad("via", 20)}result`);
for (const row of handRows) {
  console.log(`${pad(row.shot, 8)}${pad(row.who, 10)}${pad(row.hand, 6)}${pad(row.prop, 14)}${pad(row.owner || "-", 42)}${pad(row.via || "-", 20)}${row.pass ? "PASS" : "FAIL"}`);
}
console.log("");
console.log("cast roles");
console.log(`${pad("key", 12)}${pad("role", 12)}${pad("castStyle", 12)}result`);
for (const row of castRows) {
  console.log(`${pad(row.key, 12)}${pad(row.role, 12)}${pad(row.hasStyle ? "yes" : "-", 12)}${row.pass ? "PASS" : "FAIL"}`);
}
console.log("");
console.log("foreground");
console.log(`${pad("shot", 8)}${pad("entry", 16)}${pad("call line", 11)}${pad("cast line", 11)}result`);
for (const row of foregroundRows) {
  console.log(`${pad(row.shot, 8)}${pad(row.name, 16)}${pad(row.call ?? "-", 11)}${pad(row.cast ?? "-", 11)}${row.pass ? `PASS — ${row.detail}` : `FAIL — ${row.detail}`}`);
}
console.log("");
console.log("set signatures");
console.log(`${pad("shot", 8)}${pad("set", 14)}${pad("signature", 64)}result`);
for (const row of signatureRows) {
  console.log(`${pad(row.shot, 8)}${pad(row.set, 14)}${pad(row.missing.length ? `missing ${row.missing.join(", ")}` : "complete", 64)}${row.pass ? "PASS" : "FAIL"}`);
}

console.log("");
console.log("shot asset list");
console.log(`${pad("shot", 8)}${pad("set", 14)}${pad("props", 7)}${pad("cast", 6)}${pad("hands", 7)}${pad("fg", 4)}result`);
for (const card of cards) {
  const setRow = setRowsByShot.find((r) => r.shot === card.id);
  const sigRow = signatureRows.find((r) => r.shot === card.id);
  const hands = (card.handProps || []).length;
  const fg = (card.foreground || []).length;
  const handBad = (card.handProps || []).some((hp) => handRows.some((r) => r.shot === card.id && r.prop === hp.prop && !r.pass));
  const fgBad = (card.foreground || []).some((name) => foregroundRows.some((r) => r.shot === card.id && r.name === name && !r.pass));
  const ok = setRow && setRow.pass && sigRow && sigRow.pass && !handBad && !fgBad;
  console.log(`${pad(card.id, 8)}${pad(setRow ? setRow.resolved : "-", 14)}${pad((card.props || []).length, 7)}${pad((card.cast || []).length, 6)}${pad(hands, 7)}${pad(fg, 4)}${ok ? "PASS" : "FAIL"}`);
}

if (findings.length) {
  console.error(`\nassets-check: FAIL — ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f.where}: ${f.message}`);
  process.exit(1);
}
console.log(`\nassets-check: PASS — ${setRows.length} sets, ${handRows.length} hand props, ${foregroundRows.length} foreground entries, ${signatureRows.length} signatures`);
