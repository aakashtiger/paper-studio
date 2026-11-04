/**
 * `style:identity` — is this film still this channel?
 *
 * The pack already defines the look in `STYLE.md`, `tokens.json` and the
 * reference frames. This command checks the film against those definitions:
 *
 *   - a cast on the paper-puppet construction (a new character is allowed; the
 *     shared library is not required), with the style's pose/expression count,
 *     anchors and body;
 *   - at least half the shots stage a performer;
 *   - luma, contrast, saturation, edges and palette inside the reference bands
 *     measured by `style:measure`.
 *
 * usage: npm run style:identity -- <score.json> [--specimen <dir|video>]
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { checkStyleIdentity, type CastLibraryFact, type IdentityBandKey } from "../src/engine/style-identity.js";
import { FilmScoreSchema } from "../src/engine/treatment.js";
import { videoStreamHash } from "../src/engine/video.js";
import { findFfmpeg } from "../src/engine/grid.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
const specimenArg = args.includes("--specimen") ? args[args.indexOf("--specimen") + 1] : undefined;
if (!file) {
  console.error("usage: npm run style:identity -- <score.json> [--specimen <dir|video>] [--video]");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8").replace(/^\uFEFF/, "")));
const videoArg = args.includes("--video") ? `films/${score.id}/${score.id}.mp4` : undefined;
const styleDir = resolve(root, "styles", score.style);
const tokens = JSON.parse(readFileSync(resolve(styleDir, "tokens.json"), "utf8").replace(/^\uFEFF/, "")) as {
  identity?: {
    dimension?: string;
    reference?: string;
    bands?: Record<IdentityBandKey, number>;
    cast?: { max: number; stagedRatio: number; posesMin: number; expressionsMin: number; anchors: string[] };
  };
};
const identity = tokens.identity;
if (!identity?.bands || !identity.cast || !identity.reference) {
  console.error(`style:identity: styles/${score.style}/tokens.json has no identity block`);
  process.exit(1);
}

const cast: CastLibraryFact[] = [];
for (const member of score.cast) {
  if (!existsSync(resolve(root, member.poses))) {
    cast.push({
      character: member.character,
      rig: member.rig ?? "?",
      poses: 0,
      expressions: 0,
      anchors: [],
      body: false,
      errors: [{ code: "cast:missing", message: `${member.poses} does not exist` }],
    });
    continue;
  }
  const library = PoseLibrarySchema.parse(JSON.parse(readFileSync(resolve(root, member.poses), "utf8").replace(/^\uFEFF/, "")));
  const check = resolvePoseLibrary(library);
  cast.push({
    character: member.character,
    rig: member.rig ?? library.rig,
    poses: library.poses.length,
    expressions: library.expressions.length,
    anchors: library.anchors,
    body: Boolean(library.body),
    errors: check.errors,
  });
}

const stagedShots = score.shots.filter((shot) => (shot.direction.cast?.length ?? 0) > 0).length;
const specimen =
  specimenArg ??
  videoArg ??
  (existsSync(resolve(root, "build", score.id, "collage", "frames"))
    ? `build/${score.id}/collage/frames`
    : `films/${score.id}/${score.id}.mp4`);
if (!existsSync(resolve(root, specimen))) {
  console.error(`style:identity: no specimen at ${specimen}; run collage first, or pass --specimen`);
  process.exit(1);
}
const outDir = resolve(root, "build", score.id, "style-identity");
mkdirSync(outDir, { recursive: true });
const measured = spawnSync(
  process.execPath,
  [
    "--import", "tsx", "scripts/style-measure.ts",
    "--ref", resolve(styleDir, identity.reference),
    "--specimen", resolve(root, specimen),
    "--out", outDir,
  ],
  { cwd: root, encoding: "utf8" },
);
if (measured.status !== 0) {
  process.stderr.write(measured.stderr ?? "");
  process.stderr.write(measured.stdout ?? "");
  console.error("style:identity: style:measure failed");
  process.exit(1);
}
const matchPath = resolve(outDir, "match.json");
if (!existsSync(matchPath)) {
  console.error("style:identity: style:measure wrote no match.json");
  process.exit(1);
}
const match = JSON.parse(readFileSync(matchPath, "utf8")) as {
  delta: { luma: number | null; contrast: number | null; saturation: number | null; edges: number | null; palette: number | null };
};

const result = checkStyleIdentity({
  shots: score.shots.length,
  stagedShots,
  cast,
  delta: match.delta,
  bands: identity.bands,
  castRule: identity.cast,
});
const videoHash = specimen.endsWith(".mp4") ? videoStreamHash(findFfmpeg(), resolve(root, specimen)) : null;
const report = {
  film: score.id,
  score: `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`,
  dimension: identity.dimension ?? "2d",
  specimen,
  videoHash,
  pass: result.findings.length === 0,
  stagedRatio: Number(result.stagedRatio.toFixed(3)),
  stages: { shots: score.shots.length, stagedShots },
  cast,
  delta: match.delta,
  bands: identity.bands,
  findings: result.findings,
};
writeFileSync(resolve(outDir, "style-identity.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const member of cast) {
  console.log(
    `identity: ${member.character.padEnd(6)} ${member.rig.padEnd(18)} ${member.poses} poses · ${member.expressions} expressions · ${member.body ? "body" : "NO BODY"}`,
  );
}
console.log(
  `identity: ${stagedShots}/${score.shots.length} staged shots · ` +
    `Δ luma ${match.delta.luma?.toFixed(1) ?? "?"} · Δ sat ${match.delta.saturation?.toFixed(1) ?? "?"} · ` +
    `Δ contrast ${match.delta.contrast?.toFixed(1) ?? "?"} · palette ${match.delta.palette?.toFixed(1) ?? "?"}`,
);
for (const finding of result.findings) console.error(`  FAIL ${finding.code}: ${finding.message}`);
console.log(
  `style:identity: ${report.pass ? "pass" : "FAIL"} · ${result.findings.length} finding(s) · ${outDir}`,
);
if (!report.pass) process.exit(1);
