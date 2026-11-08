/**
 * `shot-check` — the staging contract.
 *
 * Every shot says what it is for (`intent`) and what physically changes
 * (`action`). The film opens on the act. Every role that appears is introduced
 * once with a `roleTag` the audience can read.
 *
 * usage:
 *   node scripts/shot-check.mjs proofs/kpop-crime-60/film.json
 *   node scripts/shot-check.mjs --score proofs/kpop-crime-60
 */
import { loadScore, parseArgs } from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const film = score.film;
const ACT = /\b(murder|knife|body)\b/i;
const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean);

const findings = [];
const note = (s) => findings.push(s);

if (!Array.isArray(film.shots) || !film.shots.length) {
  console.error("shot-check: FAIL — film.shots is missing");
  process.exit(1);
}
const castStyle = film.castStyle && typeof film.castStyle === "object" ? film.castStyle : null;
const roles = castStyle ? Object.keys(castStyle) : [];
if (!castStyle) note("film.castStyle is missing; firstAppearance roles cannot be checked (see scripts/cast-check.mjs for the shape)");

const contract = film.shots.map((shot) => {
  const problems = [];
  if (typeof shot.intent !== "string" || words(shot.intent).length < 2) problems.push("intent");
  if (typeof shot.action !== "string" || words(shot.action).length < 2) problems.push("action");
  for (const p of problems) note(`${shot.id}: ${p} is missing or not a sentence`);
  return { id: shot.id, intent: shot.intent || "", action: shot.action || "", problems };
});

const opening = film.opening;
let openingRow = { shot: opening && opening.shot ? opening.shot : "(missing)", action: "", pass: false, detail: "" };
if (!opening || typeof opening !== "object" || typeof opening.shot !== "string" || !opening.shot.trim()) {
  note("film.opening is missing or has no .shot");
  openingRow.detail = "film.opening is missing or has no .shot";
} else {
  const shot = film.shots.find((s) => s.id === opening.shot);
  if (!shot) {
    note(`film.opening.shot "${opening.shot}" is not a shot id`);
    openingRow.detail = "unknown shot";
  } else {
    openingRow.action = shot.action || "";
    if (!ACT.test(String(shot.action || ""))) {
      note(`opening shot ${shot.id} action does not name the act (murder|knife|body): "${shot.action || ""}"`);
      openingRow.detail = "action does not name the act";
    } else {
      openingRow.pass = true;
      openingRow.detail = "action names the act";
    }
  }
}

const intro = new Map();
for (const shot of film.shots) {
  if (shot.firstAppearance === undefined || shot.firstAppearance === null || shot.firstAppearance === "") continue;
  const role = String(shot.firstAppearance);
  if (!castStyle || !roles.includes(role)) {
    note(`${shot.id}: firstAppearance "${role}" is not a role in castStyle`);
  }
  if (typeof shot.roleTag !== "string" || !shot.roleTag.trim()) {
    note(`${shot.id}: introduces ${role} with no roleTag`);
  }
  if (castStyle && roles.includes(role) && !intro.has(role)) intro.set(role, shot);
}
for (const role of roles) {
  const shot = intro.get(role);
  if (!shot) note(`role ${role} has no shot tagged firstAppearance`);
  else if (typeof shot.roleTag !== "string" || !shot.roleTag.trim()) note(`role ${role} is introduced in ${shot.id} without a roleTag`);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`shot-check: ${score.rel}/film.json`);
console.log("");
console.log(`${pad("shot", 8)}${pad("intent", 10)}${pad("action", 10)}result`);
for (const row of contract) {
  console.log(`${pad(row.id, 8)}${pad(row.intent ? "yes" : "-", 10)}${pad(row.action ? "yes" : "-", 10)}${row.problems.length ? `FAIL — ${row.problems.join(", ")}` : "PASS"}`);
}

console.log("");
console.log(`opening: ${openingRow.shot}  ${openingRow.pass ? "PASS" : "FAIL"}  ${openingRow.detail}`);
if (openingRow.action) console.log(`  action: ${openingRow.action}`);

console.log("");
console.log(`${pad("role", 12)}${pad("first shot", 14)}${pad("roleTag", 28)}result`);
for (const role of roles) {
  const shot = intro.get(role);
  const tag = shot && typeof shot.roleTag === "string" ? shot.roleTag : "";
  const ok = !!(shot && tag.trim());
  console.log(`${pad(role, 12)}${pad(shot ? shot.id : "-", 14)}${pad(tag || "-", 28)}${ok ? "PASS" : "FAIL"}`);
}

if (findings.length) {
  console.error(`\nshot-check: FAIL — ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nshot-check: PASS — ${contract.length} shots, opening names the act, ${roles.length} roles introduced`);
