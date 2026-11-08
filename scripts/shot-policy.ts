/**
 * `shot:policy` — the shot band and the guards, for a film of any duration.
 *
 * The numbers belong to the system (decision 0065, `kpop-shot-policy.md`): under
 * 3 min a shot is 1.2–5.5 s with a 3.0 s median; at 3 min and over it is 3.0–7.0
 * with a 5.0 s median. The shot count is derived from the duration, not fixed.
 *
 * This command prints the band it derived, the cut it read, and every guard it
 * refused. It does not paint anything, so it runs in a second.
 *
 * usage:
 *   npm run shot:policy -- <film.json> [--shots=<shots.json>] [--duration=<s>] [--json]
 *   npm run shot:policy -- <shots.json> [--film=<film.json>] [--json]
 *
 * A film file may be:
 *   - a score/film with `shots[]` carrying `start` and `duration` (the studio
 *     score shape, and `proofs/<id>/score.json`);
 *   - a film with `shots[]` carrying `set`, `camera`, `composition` but no
 *     times, in which case the times come from `shots.json` beside it (the
 *     `proofs/kpop-crime-60` shape);
 *   - a plain shots array.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { bandFor, checkShotPolicy, describeBand, type PolicyShot } from "../src/engine/shot-policy.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const positional = argv.find((arg) => !arg.startsWith("--"));
if (!positional) {
  console.error("usage: npm run shot:policy -- <film.json|shots.json> [--shots=<file>] [--film=<file>] [--duration=<s>] [--json]");
  process.exit(2);
}
const json = argv.includes("--json");
const root = process.cwd();
const readJson = (path: string) => JSON.parse(readFileSync(resolve(root, path), "utf8").replace(/^\uFEFF/, ""));

const primaryPath = positional;
const primary = readJson(primaryPath);
const isShotArray = Array.isArray(primary);
const film = isShotArray ? (flag("film") ? readJson(flag("film") as string) : null) : primary;
let filmShots: any[] = isShotArray ? primary : (film?.shots ?? []);
if (filmShots.length === 0) {
  console.error(`${primaryPath}: no shots found`);
  process.exit(2);
}

// A studio score declares its shots by recipe, not by time. The resolver is the
// one place that turns them into a cut, so it is the one place this command can
// read the times from; reading the raw file would call every studio film "no
// shots with times".
let resolved = false;
if (!isShotArray && film?.style) {
  try {
    const score = FilmScoreSchema.parse(film);
    const { plan, errors } = resolveFilm(score, resolve(root, "styles", score.style), root);
    if (errors.length === 0 && plan.shots.length > 0) {
      filmShots = plan.shots as any[];
      resolved = true;
    }
  } catch {
    // Not a studio score (or one that does not resolve): fall through to the
    // raw times, and the missing-times message below says what is wrong.
  }
}

// Times: the film's own, else `shots.json` beside it (or --shots).
const hasTimes = filmShots.every((shot) => typeof shot.start === "number" && (typeof shot.duration === "number" || typeof shot.end === "number"));
let times: Map<string, { start: number; duration: number }>;
if (hasTimes) {
  times = new Map(filmShots.map((shot) => [String(shot.id), { start: shot.start, duration: shot.duration ?? shot.end - shot.start }]));
} else {
  const shotsPath = flag("shots") ?? (isShotArray ? primaryPath : join(dirname(primaryPath), "shots.json"));
  if (!existsSync(resolve(root, shotsPath))) {
    console.error(`${primaryPath}: the shots carry no start/duration and ${shotsPath} does not exist`);
    process.exit(2);
  }
  const rows: any[] = readJson(shotsPath);
  times = new Map(rows.map((row) => [String(row.id), { start: row.start, duration: row.duration ?? row.end - row.start }]));
}

const shots: PolicyShot[] = filmShots.map((shot) => {
  const time = times.get(String(shot.id));
  if (!time) {
    console.error(`${primaryPath}: ${shot.id} has no time in ${flag("shots") ?? "shots.json"}`);
    process.exit(2);
  }
  return {
    id: String(shot.id),
    start: time.start,
    duration: time.duration,
    camera: typeof shot.camera === "string" ? shot.camera : shot.camera?.move,
    set: shot.set,
    composition: shot.composition,
  };
});

const declared = Number(flag("duration") ?? film?.duration ?? 0);
const duration = declared > 0 ? declared : shots.reduce((sum, shot) => sum + shot.duration, 0);
const report = checkShotPolicy(shots, duration);
const band = bandFor(duration);

// A report a gate can reuse without re-running this command (decision 0033):
// the times live in the score file, so the score's own hash is the tie.
const outPath = flag("out");
if (outPath) {
  const scoreFile = resolved ? primaryPath : (flag("shots") ?? primaryPath);
  const scoreHash = `sha256:${createHash("sha256").update(readFileSync(resolve(root, scoreFile))).digest("hex")}`;
  const absolute = resolve(root, outPath);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(
    absolute,
    `${JSON.stringify(
      {
        id: film?.id ?? basename(primaryPath),
        score: scoreHash,
        duration,
        band,
        shots: shots.map((shot) => ({ id: shot.id, start: shot.start, duration: shot.duration })),
        median: report.median,
        findings: report.findings,
        warnings: report.warnings,
      },
      null,
      2,
    )}\n`,
  );
}

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`shot:policy: ${film?.id ?? primaryPath}  ${duration.toFixed(2)}s  ${report.shots} shots  median ${report.median}s`);
  console.log(`  band  ${describeBand(band)}`);
  console.log("  shot   start   dur   edge");
  for (const [index, row] of report.lengths.entries()) {
    const edge = row.atMin ? "min" : row.atMax ? "max" : "";
    console.log(
      `  ${row.shot.padEnd(6)} ${shots[index]!.start.toFixed(2).padStart(6)} ${row.duration.toFixed(2).padStart(6)}   ${edge}`,
    );
  }
  for (const warning of report.warnings) console.log(`  warn  ${warning.code}: ${warning.message}`);
  for (const finding of report.findings) console.log(`  FAIL  ${finding.code}: ${finding.message}`);
}

if (report.findings.length > 0) {
  console.error(`\n${report.findings.length} finding(s): the cut is outside the system's shot policy.`);
  process.exit(1);
}
console.log("\nPASS: shot lengths, shot count, median and the run guards hold for this duration.");
