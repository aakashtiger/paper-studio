/**
 * `review-check` — the visual review gate.
 *
 * A delivered picture is only shippable when a person has looked at the hands,
 * the cuts and a contact sheet, and signed `review.json` with the hash of the
 * MP4 they looked at. Every referenced sheet is re-hashed. A manifest with
 * `pages` has every page re-hashed too, so a stale page cannot hide behind a
 * fresh manifest.
 *
 * usage:
 *   node scripts/review-check.mjs proofs/kpop-crime-60
 *   node scripts/review-check.mjs --score proofs/kpop-crime-60 --video proofs/kpop-crime-60/out/kpop-crime-60.mp4
 */
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  ROOT, loadScore, normHash, parseArgs, readJson, relToRoot, sha256, videoPath,
} from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const reviewPath = args.review ? resolve(ROOT, args.review) : join(score.root, "review.json");
const video = videoPath(score, args.video);

const EXPECTED = {
  videoHash: "<sha256 of the delivered mp4>",
  pass: true,
  contact: { path: "out/sheet/contact-sheet.png", sha256: "<sha256>" },
  hands: { path: "out/hands/hands.json", sha256: "<sha256>" },
  cuts: { path: "out/cut-pairs.json", sha256: "<sha256>" },
  notes: "what the reviewer looked at, and why this picture is ready",
};

const findings = [];
const note = (s) => findings.push(s);
const pad = (s, n) => String(s).padEnd(n);

function loadReview() {
  if (!existsSync(reviewPath)) {
    note(`review.json is missing at ${relToRoot(reviewPath)}`);
    return null;
  }
  try {
    return readJson(reviewPath);
  } catch (e) {
    note(`review.json is not valid JSON: ${e.message}`);
    return null;
  }
}

const review = loadReview();
if (review) {
  if (review.pass !== true) note(`review.pass is ${JSON.stringify(review.pass)}; it must be true`);
  if (typeof review.videoHash !== "string" || !review.videoHash.trim()) {
    note("review.videoHash is missing");
  } else if (!existsSync(video)) {
    note(`delivered picture is missing: ${relToRoot(video)}`);
  } else {
    const actual = sha256(video);
    if (normHash(review.videoHash) !== actual) {
      note(`review.videoHash ${normHash(review.videoHash).slice(0, 12)}… does not match ${relToRoot(video)} (${actual.slice(0, 12)}…)`);
    }
  }
  if (review.notes !== undefined && typeof review.notes !== "string") note("review.notes must be a string when present");
}

function checkEntry(name, entry) {
  const bad = (message) => { note(message); return { pages: 0, ok: false }; };
  if (!entry || typeof entry !== "object") return bad(`review.${name} is missing`);
  if (typeof entry.path !== "string" || !entry.path.trim()) return bad(`review.${name}.path is missing`);
  if (typeof entry.sha256 !== "string" || !entry.sha256.trim()) return bad(`review.${name}.sha256 is missing`);
  const abs = resolve(score.root, entry.path);
  if (!existsSync(abs)) return bad(`review.${name}.path does not exist: ${entry.path}`);
  const actual = sha256(abs);
  if (normHash(entry.sha256) !== actual) {
    return bad(`review.${name}.sha256 ${normHash(entry.sha256).slice(0, 12)}… does not match ${entry.path} (${actual.slice(0, 12)}…)`);
  }
  let pages = 0, ok = true;
  if (/\.json$/i.test(abs)) {
    try {
      const manifest = readJson(abs);
      if (!Array.isArray(manifest.pages) || !manifest.pages.length) {
        note(`review.${name} manifest ${entry.path} has no pages[]`);
        ok = false;
      } else {
        for (const page of manifest.pages) {
          pages++;
          if (typeof page.path !== "string" || typeof page.sha256 !== "string") {
            note(`review.${name} manifest page ${page.path || "(no path)"} needs path and sha256`);
            ok = false;
            continue;
          }
          const pageAbs = resolve(score.root, page.path);
          if (!existsSync(pageAbs)) { note(`review.${name} page is missing: ${page.path}`); ok = false; continue; }
          const pageHash = sha256(pageAbs);
          if (normHash(page.sha256) !== pageHash) {
            note(`review.${name} page ${page.path} sha256 is stale (${normHash(page.sha256).slice(0, 12)}… vs ${pageHash.slice(0, 12)}…)`);
            ok = false;
          }
        }
      }
    } catch (e) {
      note(`review.${name} manifest is not valid JSON: ${e.message}`);
      ok = false;
    }
  }
  return { pages, ok };
}

let contact = { pages: 0, ok: false }, hands = { pages: 0, ok: false }, cuts = { pages: 0, ok: false };
if (review) {
  contact = checkEntry("contact", review.contact);
  hands = checkEntry("hands", review.hands);
  cuts = checkEntry("cuts", review.cuts);
}

console.log(`review-check: ${score.rel}`);
console.log(`${pad("field", 10)}${pad("file", 44)}result`);
const videoHash = existsSync(video) ? sha256(video) : null;
const videoOk = !!(review && videoHash && normHash(review.videoHash) === videoHash);
const videoNote = !videoHash ? "missing picture"
  : !review ? `sha256:${videoHash.slice(0, 12)}…  (no review)`
  : videoOk ? `PASS  sha256:${videoHash.slice(0, 12)}…`
  : `FAIL  sha256:${videoHash.slice(0, 12)}…`;
console.log(`${pad("video", 10)}${pad(relToRoot(video), 44)}${videoNote}`);
console.log(`${pad("pass", 10)}${pad("review.json", 44)}${review && review.pass === true ? "PASS" : "FAIL"}`);
for (const [name, entry, state] of [["contact", review && review.contact, contact], ["hands", review && review.hands, hands], ["cuts", review && review.cuts, cuts]]) {
  const suffix = state.pages ? `  (${state.pages} page${state.pages === 1 ? "" : "s"})` : "";
  console.log(`${pad(name, 10)}${pad(entry && entry.path ? entry.path : "(missing)", 44)}${state.ok ? `PASS  sha256:${normHash(entry.sha256).slice(0, 12)}…${suffix}` : "FAIL"}`);
}

if (findings.length) {
  console.error(`\nreview-check: FAIL — ${findings.length} finding(s)`);
  for (const f of findings) console.error(`  - ${f}`);
  if (!review) {
    console.error("\nExpected review.json shape:\n");
    console.error(JSON.stringify(EXPECTED, null, 2));
  }
  process.exit(1);
}
console.log(`\nreview-check: PASS — ${relToRoot(reviewPath)} describes ${relToRoot(video)} (sha256:${videoHash.slice(0, 12)}…)`);
