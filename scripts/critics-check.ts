/**
 * `critics:check` — may this film be called done? (M1 K6)
 *
 * Reads the critic reports a film folder carries and answers with one verdict:
 * SHIP, or every reason it is not shippable. It never judges the film; it reads
 * the two people who did, and refuses a signature that is stale, thin, at the
 * wrong score, or from a single hand twice.
 *
 * usage:
 *   npm run critics:check -- <film dir|film.json> [--score <score.json>]
 *                          [--video-hash <hex>] [--manifest <render-manifest.json>]
 *                          [--bar 10] [--json]
 *
 * The picture hash is read from the film's own evidence — a render manifest,
 * `review.json`, or the twin/look reports — never guessed. `--video-hash` exists
 * for a film whose evidence is not on disk yet; it is an assertion by the person
 * running the command, and the printed line says so.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { checkCritics, describeVerdict, normaliseHash, type CriticReport } from "../src/engine/critics.js";

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const at = argv.indexOf(`--${name}`);
  if (at !== -1) return argv[at + 1];
  const hit = argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const positional = argv.find((arg) => !arg.startsWith("--"));
if (!positional) {
  console.error("usage: npm run critics:check -- <film dir|film.json> [--score <score.json>] [--video-hash <hex>] [--bar 10] [--json]");
  process.exit(2);
}
const json = argv.includes("--json");
const root = process.cwd();
const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(root, path), "utf8").replace(/^\uFEFF/, ""));

const dir = resolve(root, positional.endsWith(".json") ? dirname(positional) : positional);
if (!existsSync(dir)) {
  console.error(`${positional}: no such film folder`);
  process.exit(2);
}

// ---- the reports -----------------------------------------------------------
const criticsDir = join(dir, "critics");
if (!existsSync(criticsDir)) {
  console.error(`${criticsDir} does not exist: no critic has signed this film`);
  process.exit(1);
}
const reportFiles = readdirSync(criticsDir).filter((name) => name.endsWith(".json")).sort();
const reports: CriticReport[] = reportFiles.map((name) => {
  try {
    return readJson(join(criticsDir, name)) as CriticReport;
  } catch (error) {
    console.error(`${join(criticsDir, name)} is not readable JSON: ${(error as Error).message}`);
    process.exit(2);
  }
});

// ---- the picture hash, from the film's own evidence -------------------------
const id = basename(dir);
const hashSources = [
  flag("manifest"),
  join(root, "build", id, "render-manifest.json"),
  // Measurement evidence first: `review.json` is a sign-off, and a tie should
  // come from a report that measured the picture, not one that approved it.
  join(dir, "out", "twin.json"),
  join(dir, "out", "look.json"),
  join(dir, "review.json"),
  join(dir, "out", "review.json"),
].filter((path): path is string => typeof path === "string" && existsSync(resolve(root, path)));

let videoHash = normaliseHash(flag("video-hash"));
let videoSource = flag("video-hash") ? "--video-hash (asserted on the command line)" : "";
if (!videoHash) {
  for (const path of hashSources) {
    const evidence = readJson(path);
    const named = normaliseHash(
      (evidence.videoHash as string | undefined) ??
        ((evidence.picture as { sha256?: string } | undefined)?.sha256 as string | undefined),
    );
    if (named) {
      videoHash = named;
      videoSource = path.replace(`${root}/`, "").replace(`${root}\\`, "");
      break;
    }
  }
}
if (!videoHash) {
  console.error(
    "no picture hash: pass --video-hash <hex>, or point --manifest at the render manifest. " +
      `Looked in ${hashSources.length === 0 ? "nothing (no manifest, review or twin report)" : hashSources.join(", ")}.`,
  );
  process.exit(2);
}

// ---- the score hash, when the film has a score ------------------------------
const scorePath = flag("score") ?? [join(dir, "film.json"), join(dir, "score.json")].find((path) => existsSync(path));
const scoreHash = scorePath
  ? createHash("sha256").update(readFileSync(resolve(root, scorePath))).digest("hex")
  : undefined;

// ---- the verdict -----------------------------------------------------------
const barFlag = Number(flag("bar"));
const verdict = checkCritics(reports, {
  videoHash,
  scoreHash,
  bar: Number.isFinite(barFlag) && barFlag > 0 ? barFlag : undefined,
});

if (json) {
  console.log(JSON.stringify({ ...verdict, videoHash, videoSource, scoreHash, reports: reportFiles }, null, 2));
} else {
  console.log(`critics:check: ${id}  ${reports.length} report${reports.length === 1 ? "" : "s"}`);
  console.log(`  picture  ${videoHash.slice(0, 12)}...  ${videoSource}`);
  for (const file of reportFiles) {
    const report = reports[reportFiles.indexOf(file)]!;
    const findings = report.findings ?? [];
    const p = ["P0", "P1", "P2"].map(
      (severity) => findings.filter((finding) => String(finding.severity ?? "").toUpperCase() === severity).length,
    );
    const axes = report.axes ? Object.entries(report.axes).map(([key, value]) => `${key} ${value}`).join(", ") : "no axes";
    console.log(
      `  ${String(report.role ?? "?").padEnd(7)}  ${String(report.verdict ?? "?").padEnd(5)} ` +
        `${String(report.score ?? "?")}/10  ${String(report.critic ?? "(unsigned)")}  ` +
        `P0 ${p[0]} / P1 ${p[1]} / P2 ${p[2]}  [${axes}]`,
    );
  }
  for (const warning of verdict.warnings) console.log(`  warn  ${warning.code}: ${warning.message}`);
  for (const finding of verdict.findings) console.log(`  FAIL  ${finding.code}: ${finding.message}`);
  console.log(`\n${describeVerdict(verdict)}`);
}

process.exit(verdict.ship ? 0 : 1);
