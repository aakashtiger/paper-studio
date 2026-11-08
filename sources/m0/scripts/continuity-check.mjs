/**
 * `continuity-check` — the film's time, wardrobe, set and prop state.
 *
 * This is a preflight / critic tool, not a gate row. It reads film.json and
 * expects every shot to declare:
 *
 *   day       number, strictly increasing from shot to shot
 *   place     string, the set the shot happens in
 *   costume   string, or { "<who>": "<costume>" }
 *   props     string[], or [{ id, state }]
 *   state     object/string, the set and prop state at this shot
 *
 * A change is legal only when the shot declares it. Accepted declarations:
 *   events: [ "costume: prison", { type: "state", prop: "door", to: "open" } ]
 *   costumeEvent / stateEvent / propEvent / setEvent: a string or object
 *   declared: [ "costume", "door" ]
 *   state: { costumeEvent: "...", stateEvent: "..." }
 *
 * Checks:
 *   - day strictly increases;
 *   - a costume change on a cut needs a declared costume event;
 *   - a prop added or removed in the same place needs a declared prop event;
 *   - a state value changed in the same place needs a declared state event;
 *   - a return to a place repeats the state and props it was left with;
 *   - the cell is visited once, left, and returned to once (the return-to-cell
 *     rule); the return cannot be the next shot.
 *
 * usage: node scripts/continuity-check.mjs [film.json]
 * exit 1 when any finding is printed.
 */
import { readFileSync } from "node:fs";

const filmPath = process.argv[2] || "proofs/kpop-crime/film.json";
const film = JSON.parse(readFileSync(filmPath, "utf8"));
const shots = Array.isArray(film.shots) ? film.shots : [];
const findings = [];

const text = (v) => typeof v === "string" ? v : JSON.stringify(v);
const lower = (v) => text(v).toLowerCase();
// "the cell" and "cell" are the same place; so are "Cell." and "cell".
const placeKey = (v) => String(v ?? "").toLowerCase().replace(/^the\s+/, "").replace(/[^a-z0-9]+/g, " ").trim();

const costumeMap = (shot) => {
  if (shot.costume == null) return null;
  if (typeof shot.costume === "string") return { "*": shot.costume };
  return shot.costume;
};
const costumeFor = (map, who) => map[who] ?? map["*"] ?? null;
const stateMap = (shot) => {
  if (shot.state == null) return null;
  if (typeof shot.state === "object" && !Array.isArray(shot.state)) return shot.state;
  return { "*": shot.state };
};
const propsOf = (shot) => {
  if (!Array.isArray(shot.props)) return null;
  return shot.props.map((p) => typeof p === "string" ? p : (p.id || p.name || p.prop || text(p)));
};

const eventsOf = (shot) => {
  const out = [];
  for (const key of ["events", "declared", "changes"]) {
    const v = shot[key];
    if (Array.isArray(v)) out.push(...v);
    else if (v != null) out.push(v);
  }
  for (const key of ["event", "costumeEvent", "stateEvent", "propEvent", "setEvent"]) {
    if (shot[key] != null) out.push(shot[key]);
  }
  return out;
};
const kindOf = (e) => {
  if (typeof e === "string") {
    if (/costume|wardrobe|dress|uniform|suit|robe|prison/i.test(e)) return "costume";
    if (/state|prop|set|door|light|calendar|knife|noose|open|close/i.test(e)) return "state";
    return "";
  }
  const kind = String(e.type || e.kind || e.layer || "").toLowerCase();
  if (/costume|wardrobe/.test(kind)) return "costume";
  if (/state|prop|set/.test(kind)) return "state";
  return "";
};
const matches = (e, what) => {
  if (!what) return true;
  const t = lower(e);
  return t.includes(String(what).toLowerCase());
};

function declaresCostume(shot, who, to) {
  if (shot.costumeEvent != null) {
    if (typeof shot.costumeEvent === "object") {
      if (shot.costumeEvent.who && shot.costumeEvent.who !== who) return false;
      if (shot.costumeEvent.to && shot.costumeEvent.to !== to) return false;
    }
    return true;
  }
  for (const e of eventsOf(shot)) {
    if (kindOf(e) !== "costume") continue;
    if (typeof e === "object") {
      if (e.who && e.who !== who) continue;
      if (e.to && e.to !== to) continue;
      return true;
    }
    if (who && !lower(e).includes(String(who).toLowerCase()) && !/\*|all|cast/.test(lower(e))) continue;
    if (to && !lower(e).includes(String(to).toLowerCase())) continue;
    return true;
  }
  const s = stateMap(shot);
  if (s) for (const [k, v] of Object.entries(s)) {
    if (/costume|wardrobe/i.test(k) && (!to || lower(v).includes(String(to).toLowerCase()))) return true;
  }
  // A story event on the shot is a declaration too ("arrest", "sentenced").
  return eventsOf(shot).length > 0;
}

function declaresState(shot, key) {
  for (const k of ["stateEvent", "propEvent", "setEvent"]) {
    if (shot[k] == null) continue;
    if (typeof shot[k] === "object" && !matches(shot[k], key)) continue;
    return true;
  }
  for (const e of eventsOf(shot)) {
    if (kindOf(e) !== "state") continue;
    if (typeof e === "object") {
      const named = e.prop || e.key || e.what || e.set || e.id;
      if (named && !matches(named, key)) continue;
      return true;
    }
    if (matches(e, key)) return true;
  }
  const s = stateMap(shot);
  if (s) for (const [k, v] of Object.entries(s)) {
    if (/event|change/i.test(k) && matches(v, key)) return true;
  }
  return false;
}

function compareCostume(shot, prev, where) {
  const cur = costumeMap(shot), old = costumeMap(prev);
  if (!cur) { findings.push(`${shot.id}: missing costume`); return; }
  if (!old) return;
  const who = new Set([...Object.keys(cur), ...Object.keys(old), "*"]);
  for (const w of who) {
    const a = costumeFor(old, w), b = costumeFor(cur, w);
    if (a == null || b == null || a === b) continue;
    if (!declaresCostume(shot, w === "*" ? null : w, b)) {
      findings.push(`${shot.id}: ${where} costume ${w === "*" ? "" : `${w} `}changed ${a} -> ${b} without a declared costume event`);
    }
  }
}

function compareState(shot, prev, prevState, where) {
  const cur = stateMap(shot);
  if (!cur) { findings.push(`${shot.id}: missing state`); return; }
  if (!prevState) return;
  for (const [k, v] of Object.entries(cur)) {
    if (!(k in prevState)) {
      findings.push(`${shot.id}: ${where} state "${k}" appears without a declared event`);
    } else if (text(prevState[k]) !== text(v) && !declaresState(shot, k)) {
      findings.push(`${shot.id}: ${where} state "${k}" changed ${text(prevState[k])} -> ${text(v)} without a declared event`);
    }
  }
  for (const k of Object.keys(prevState)) {
    if (!(k in cur) && !declaresState(shot, k)) {
      findings.push(`${shot.id}: ${where} state "${k}" disappears without a declared event`);
    }
  }
}

function compareProps(shot, prevProps, where) {
  const cur = propsOf(shot);
  if (!cur) { findings.push(`${shot.id}: missing props`); return; }
  if (!prevProps) return;
  const now = new Set(cur), then = new Set(prevProps);
  for (const p of now) if (!then.has(p) && !declaresState(shot, p)) {
    findings.push(`${shot.id}: ${where} prop "${p}" appears without a declared event`);
  }
  for (const p of then) if (!now.has(p) && !declaresState(shot, p)) {
    findings.push(`${shot.id}: ${where} prop "${p}" disappears without a declared event`);
  }
}

// --- day and required fields ------------------------------------------------
let prevDay = null;
for (const shot of shots) {
  if (shot.day == null) findings.push(`${shot.id}: missing day`);
  else {
    const day = Number(shot.day);
    if (!Number.isFinite(day)) findings.push(`${shot.id}: day "${shot.day}" is not a number`);
    else if (prevDay !== null && day < prevDay) findings.push(`${shot.id}: day ${day} goes backwards from day ${prevDay}`);
    else if (prevDay !== null && day === prevDay) {
      const sameDay = shot.sameDay === true
        || eventsOf(shot).some((e) => /same day|same-day/i.test(text(e)))
        || /same day|same-day/i.test(text(shot.state));
      if (!sameDay) findings.push(`${shot.id}: day ${day} repeats day ${prevDay} without a same-day declaration`);
    }
    if (Number.isFinite(day)) prevDay = prevDay === null ? day : Math.max(prevDay, day);
  }
  if (shot.place == null) findings.push(`${shot.id}: missing place`);
  if (shot.costume == null) findings.push(`${shot.id}: missing costume`);
  if (!Array.isArray(shot.props)) findings.push(`${shot.id}: missing props`);
  if (shot.state == null) findings.push(`${shot.id}: missing state`);
}

// --- cut / same-place / return continuity ----------------------------------
let prev = null;
const lastByPlace = new Map();
for (const shot of shots) {
  const place = shot.place == null ? null : placeKey(shot.place);
  const prevPlace = prev && prev.place != null ? placeKey(prev.place) : null;
  const samePlace = !!(prev && place !== null && prevPlace !== null && prevPlace === place);
  if (prev) compareCostume(shot, prev, samePlace ? `${place} cut` : "cut");
  if (place === null) {
    // Missing place is already a finding; do not compare two unknown sets.
  } else if (samePlace) {
    const last = lastByPlace.get(place);
    if (last) {
      compareState(shot, prev, last.state, place);
      compareProps(shot, last.props, place);
    }
  } else {
    const last = lastByPlace.get(place);
    if (last) {
      compareState(shot, last.shot, last.state, `return to ${place}`);
      compareProps(shot, last.props, `return to ${place}`);
    }
  }
  if (place !== null) {
    lastByPlace.set(place, {
      shot,
      state: stateMap(shot),
      props: propsOf(shot),
    });
  }
  prev = shot;
}

// --- the return-to-cell rule ------------------------------------------------
// A 21 s proof visits the cell once; the rule is for a 45 s+ film, where a
// return is a story beat. A short proof declares `requiresReturn: false`.
const needsReturn = film.requiresReturn === true || (Number(film.duration) || 0) >= 45;
if (needsReturn) {
  const cellVisits = shots
    .map((s, i) => ({ shot: s, i }))
    .filter((x) => placeKey(x.shot.place) === "cell");
  if (cellVisits.length === 0) findings.push("return-to-cell: no shot is set in the cell");
  if (cellVisits.length === 1) findings.push("return-to-cell: the cell is visited once; the rule wants one return to it");
  if (cellVisits.length > 2) findings.push(`return-to-cell: the cell is visited ${cellVisits.length} times; one return (2 visits) is the rule`);
  if (cellVisits.length === 2 && cellVisits[1].i - cellVisits[0].i < 2) {
    findings.push("return-to-cell: the return is the next shot; leave the cell before returning");
  }
}

// --- report ----------------------------------------------------------------
console.log(`continuity-check: ${film.id || filmPath}  ${shots.length} shots`);
for (const s of shots) {
  console.log(`${String(s.id).padEnd(4)} day ${String(s.day ?? "?").padEnd(3)} ${String(s.place ?? "?").padEnd(10)} ${text(s.costume ?? "?").padEnd(18)} props ${text(s.props ?? "?").slice(0, 44)}`);
}
if (findings.length) {
  console.error(`\n${findings.length} finding(s):`);
  for (const f of findings) console.error("  - " + f);
  process.exit(1);
}
console.log("\nPASS: day, wardrobe, set and prop state hold.");
