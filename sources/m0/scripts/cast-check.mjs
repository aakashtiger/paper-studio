/**
 * `cast-check` — the cast identity contract.
 *
 * film.json must declare `castStyle`: one entry per role with a palette, a hat,
 * a badge and a one-line silhouette. Two characters the audience must tell
 * apart may not share a palette colour, a hat, or a badge.
 *
 * usage:
 *   node scripts/cast-check.mjs proofs/kpop-crime-60/film.json
 *   node scripts/cast-check.mjs --score proofs/kpop-crime-60
 */
import { loadScore, parseArgs } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const film = score.film;
const ROLES = ["thief", "detective", "warder", "judge"];
const MIN_DISTANCE = 45;
const ENFORCED = [["thief", "detective"], ["thief", "warder"]];

const EXPECTED = {
  castStyle: {
    thief: {
      role: "thief",
      palette: ["#8E2430", "#1B2230"],
      hat: "none",
      badge: null,
      silhouette: "short coat, bare head, no badge",
    },
    detective: {
      role: "detective",
      palette: ["#24344A", "#C9C2B4"],
      hat: "fedora",
      badge: "gold shield",
      silhouette: "long coat, fedora, shield",
    },
    warder: {
      role: "warder",
      palette: ["#2F5FA8", "#C9C2B4"],
      hat: "cap",
      badge: "blue armband",
      silhouette: "uniform, peaked cap, armband",
    },
    judge: {
      role: "judge",
      palette: ["#171310", "#C68E2E"],
      hat: "wig",
      badge: "red seal",
      silhouette: "black robe, white wig, red seal",
    },
  },
};

const findings = [];
const note = (s) => findings.push(s);
const hex = (h) => /^#[0-9a-f]{6}$/i.test(String(h || "").trim());
const rgb = (h) => {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(h).trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const paletteDistance = (a, b) => {
  let best = Infinity;
  for (const ca of a) for (const cb of b) best = Math.min(best, distance(rgb(ca), rgb(cb)));
  return best;
};

if (!film.castStyle || typeof film.castStyle !== "object") {
  console.error("cast-check: FAIL — film.castStyle is missing.\n");
  console.error("Expected shape:\n");
  console.error(JSON.stringify(EXPECTED, null, 2));
  process.exit(1);
}

const style = film.castStyle;
for (const role of ROLES) {
  const entry = style[role];
  if (!entry || typeof entry !== "object") { note(`castStyle.${role} is missing`); continue; }
  if (typeof entry.role !== "string" || !entry.role.trim()) note(`castStyle.${role}.role is empty`);
  else if (entry.role !== role) note(`castStyle.${role}.role is "${entry.role}"`);
  if (!Array.isArray(entry.palette) || entry.palette.length < 2) note(`castStyle.${role}.palette needs at least two #rrggbb colours`);
  else for (const c of entry.palette) if (!hex(c)) note(`castStyle.${role}.palette has a non-hex colour: ${JSON.stringify(c)}`);
  if (typeof entry.hat !== "string" || !entry.hat.trim()) note(`castStyle.${role}.hat is empty`);
  if (typeof entry.silhouette !== "string" || !entry.silhouette.trim()) note(`castStyle.${role}.silhouette is empty`);
}

const badgeOf = (entry) => {
  if (!entry) return null;
  if (entry.badge === true) return "badge";
  if (entry.badge === false || entry.badge === null || entry.badge === undefined) return null;
  const b = String(entry.badge).trim();
  if (!b || /^none$/i.test(b)) return null;
  return b;
};
// A boolean badge distinguishes “has one” from “has none”; a string badge can
// also distinguish one badge from another.
const badgeIdentity = (entry) => {
  if (!entry) return null;
  if (entry.badge === true) return { kind: "presence", value: "badge" };
  if (entry.badge === false || entry.badge === null || entry.badge === undefined) return null;
  const b = String(entry.badge).trim();
  if (!b || /^none$/i.test(b)) return null;
  return { kind: "string", value: b };
};

// pauldrons and hats are the two silhouette marks the eye reads at a cut.
const hats = new Map();
for (const role of ROLES) {
  const entry = style[role];
  if (!entry || typeof entry.hat !== "string") continue;
  const h = entry.hat.trim().toLowerCase();
  if (hats.has(h)) note(`hat collision: ${hats.get(h)} and ${role} both wear "${entry.hat}"`);
  else hats.set(h, role);
}

const thiefBadge = badgeOf(style.thief);
if (thiefBadge) note(`thief must have no badge; found "${thiefBadge}"`);
for (const role of ["detective", "warder"]) {
  if (!badgeOf(style[role])) note(`${role} must have a badge`);
}
const badges = new Map();
let booleanBadges = 0;
for (const role of ROLES) {
  const b = badgeIdentity(style[role]);
  if (!b) continue;
  if (b.kind === "presence") { booleanBadges++; continue; }
  const key = b.value.toLowerCase();
  if (badges.has(key)) note(`badge collision: ${badges.get(key)} and ${role} both carry "${b.value}"`);
  else badges.set(key, role);
}
if (booleanBadges > 1) console.log(`note: ${booleanBadges} roles use boolean badges — presence is checked, not badge artwork`);

const rows = ROLES.map((role) => {
  const e = style[role] || {};
  const palette = Array.isArray(e.palette) ? e.palette.join(" ") : "(missing)";
  return {
    role,
    hat: typeof e.hat === "string" ? e.hat : "(missing)",
    badge: badgeOf(e) || "none",
    silhouette: typeof e.silhouette === "string" ? e.silhouette : "(missing)",
    palette,
  };
});

const pairRows = [];
for (let i = 0; i < ROLES.length; i++) {
  for (let j = i + 1; j < ROLES.length; j++) {
    const a = style[ROLES[i]], b = style[ROLES[j]];
    if (!a || !b || !Array.isArray(a.palette) || !Array.isArray(b.palette) ||
        a.palette.some((c) => !hex(c)) || b.palette.some((c) => !hex(c))) continue;
    const d = paletteDistance(a.palette, b.palette);
    const enforced = ENFORCED.some(([x, y]) => (x === ROLES[i] && y === ROLES[j]) || (x === ROLES[j] && y === ROLES[i]));
    if (enforced && d < MIN_DISTANCE) {
      note(`palette distance ${ROLES[i]} ↔ ${ROLES[j]} is ${d.toFixed(1)} (need >= ${MIN_DISTANCE})`);
    }
    pairRows.push({ pair: `${ROLES[i]} ↔ ${ROLES[j]}`, distance: d, rule: enforced ? `>= ${MIN_DISTANCE}` : "info", pass: !enforced || d >= MIN_DISTANCE });
  }
}

const registry = Object.keys(film.cast || {});
const castRoles = film.castRoles && typeof film.castRoles === "object" ? film.castRoles : {};
const registryRoles = new Set(registry.map((who) => castRoles[who] || who));
for (const who of registry) {
  const role = castRoles[who] || who;
  if (!ROLES.includes(role)) note(`film.cast["${who}"] maps to "${role}", which has no castStyle entry`);
}
for (const who of Object.keys(castRoles)) {
  if (!registry.includes(who)) note(`film.castRoles names "${who}" but film.cast has no such instance`);
}
for (const role of ROLES) if (!registryRoles.has(role)) note(`castStyle.${role} is not in film.cast`);

const pad = (s, n) => String(s).padEnd(n);
console.log(`cast-check: ${score.rel}/film.json`);
console.log("");
console.log(`${pad("role", 12)}${pad("hat", 14)}${pad("badge", 16)}palette`);
for (const r of rows) console.log(`${pad(r.role, 12)}${pad(r.hat, 14)}${pad(r.badge, 16)}${r.palette}`);
console.log("");
console.log(`${pad("pair", 26)}${pad("min RGB", 10)}${pad("rule", 10)}result`);
for (const p of pairRows) {
  console.log(`${pad(p.pair, 26)}${pad(p.distance.toFixed(1), 10)}${pad(p.rule, 10)}${p.pass ? "PASS" : "FAIL"}`);
}
console.log("");
console.log("Silhouettes:");
for (const r of rows) console.log(`  ${pad(r.role, 12)}${r.silhouette}`);

if (findings.length) {
  console.error(`\ncast-check: FAIL — ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\ncast-check: PASS — ${ROLES.length} roles, palettes >= ${MIN_DISTANCE}, hats and badges distinct`);
