/**
 * Body audit: a plank arm, and a hand smaller than its own thumb.
 *
 * The rig publishes its two arm lengths and the hand/thumb boxes in each pose
 * library (`body`). This command reads the **library** character for each cast
 * member - the shared, reusable file - and refuses:
 *
 *   - a pose whose two elbows are both straighter than the rig's minimum;
 *   - a hand narrower or shorter than 1.5x its own thumb;
 *   - a cast member with no published body (the check would be empty).
 *
 * A film-specific cast that is not in the library is read from its own poses and
 * refused if it publishes no body: an unmeasured arm is not a passing arm.
 *
 * usage: npm run audit:body -- films/<id>/score.json
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { LibraryIndexSchema } from "../src/engine/library.js";
import { PoseLibrarySchema, resolvePoseLibrary, type PoseLibrary } from "../src/engine/pose.js";
import { FilmScoreSchema } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run audit:body -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8").replace(/^\uFEFF/, "")));
const index = LibraryIndexSchema.parse(
  JSON.parse(readFileSync(resolve(root, "library/characters/index.json"), "utf8").replace(/^\uFEFF/, "")),
);
const byName = new Map(index.characters.map((entry) => [entry.name.toLowerCase(), entry]));

if (score.cast.length === 0) {
  console.error("audit:body: the film has no cast — there is no arm to measure");
  process.exit(1);
}

type Row = {
  character: string;
  rig: string;
  poses: string;
  source: "library" | "film";
  body: PoseLibrary["body"];
  posesCount: number;
  errors: { code: string; message: string }[];
};
const rows: Row[] = [];
const findings: { character: string; code: string; message: string }[] = [];

for (const member of score.cast) {
  const shared = byName.get(member.character.toLowerCase());
  const posesPath = shared?.poses ?? member.poses;
  if (!existsSync(resolve(root, posesPath))) {
    findings.push({ character: member.character, code: "body:missing", message: `${posesPath} does not exist` });
    continue;
  }
  const library = PoseLibrarySchema.parse(
    JSON.parse(readFileSync(resolve(root, posesPath), "utf8").replace(/^\uFEFF/, "")),
  );
  const check = resolvePoseLibrary(library);
  const bodyErrors = check.errors.filter((error) => error.code.startsWith("body:") || error.code === "pose_body");
  rows.push({
    character: library.character,
    rig: library.rig,
    poses: posesPath,
    source: shared ? "library" : "film",
    body: library.body,
    posesCount: library.poses.length,
    errors: bodyErrors,
  });
  for (const error of bodyErrors) findings.push({ character: library.character, ...error });
}

const pass = rows.length === score.cast.length && findings.length === 0;
const report = {
  film: score.id,
  score: `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`,
  pass,
  cast: rows,
  findings,
};
mkdirSync(resolve(root, "build", score.id), { recursive: true });
const out = resolve(root, "build", score.id, "body-audit.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const row of rows) {
  const hand = row.body ? `${row.body.hand.w}×${row.body.hand.h} (thumb ${row.body.hand.thumbW}×${row.body.hand.thumbH})` : "not published";
  console.log(
    `body: ${row.character.padEnd(6)} ${row.rig.padEnd(18)} ${row.posesCount} poses · hand ${hand} · ${row.source}`,
  );
}
for (const finding of findings) console.error(`  FAIL ${finding.character} ${finding.code}: ${finding.message}`);
console.log(
  `body: ${rows.length}/${score.cast.length} cast members · ${findings.length} finding(s) · ${pass ? "pass" : "FAIL"} · ${out}`,
);
if (!pass) process.exit(1);
