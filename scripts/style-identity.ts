/**
 * `style:identity` - is this film still this channel?
 *
 * One verdict from three sources:
 *   - the pack: `tokens.identity` (what this style is);
 *   - the score: performance, colour script and motifs (what the film chose);
 *   - the paint: `frame-report.json` (what the frame actually did).
 *
 * Missing or null is a finding, never a pass. The report is tied to the score
 * hash, the identity hash and the frame-report hash; the delivered picture adds
 * the video hash.
 *
 * usage: npm run style:identity -- <score.json> [--video] [--specimen <dir|video>]
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  StyleIdentitySchema,
  identityCastRule,
} from "../src/core/style.js";
import {
  FIELD_ROLES,
  checkFilmIdentity,
} from "../src/engine/identity.js";
import {
  analyzeRgb,
  readFrameReport,
  readVideoRgb,
  summarize,
  type FrameReport,
  type FrameSummary,
} from "../src/engine/frame-report.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import {
  checkStyleIdentity,
  type CastLibraryFact,
  type IdentityMetrics,
} from "../src/engine/style-identity.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { videoStreamHash } from "../src/engine/video.js";
import { findFfmpeg } from "../src/engine/grid.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
const specimenArg = args.includes("--specimen")
  ? args[args.indexOf("--specimen") + 1]
  : undefined;
const videoMode = args.includes("--video");
if (!file) {
  console.error("usage: npm run style:identity -- <score.json> [--video] [--specimen <dir|video>]");
  process.exit(2);
}

const root = process.cwd();
const scorePath = resolve(root, file);
const score = FilmScoreSchema.parse(
  JSON.parse(readFileSync(scorePath, "utf8").replace(/^\uFEFF/, "")),
);
const styleDir = resolve(root, "styles", score.style);
const tokens = JSON.parse(
  readFileSync(resolve(styleDir, "tokens.json"), "utf8").replace(/^\uFEFF/, ""),
) as { identity?: unknown };
const parsedIdentity = StyleIdentitySchema.safeParse(tokens.identity);
if (!parsedIdentity.success) {
  console.error(`style:identity: styles/${score.style}/tokens.json has no valid identity block`);
  for (const issue of parsedIdentity.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}
const identity = parsedIdentity.data;
if (!identity.filmBands) {
  console.error(
    `style:identity: styles/${score.style}/tokens.json has no filmBands; measure the reference film first`,
  );
  process.exit(1);
}

const resolved = resolveFilm(score, styleDir, root);
if (resolved.errors.length > 0) {
  for (const error of resolved.errors) console.error(`error: ${error.message}`);
  process.exit(1);
}
const planShots = resolved.plan.shots;

const cast: CastLibraryFact[] = [];for (const member of score.cast) {
  const posesPath = resolve(root, member.poses);
  if (!existsSync(posesPath)) {
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
  const library = PoseLibrarySchema.parse(
    JSON.parse(readFileSync(posesPath, "utf8").replace(/^\uFEFF/, "")),
  );
  const check = resolvePoseLibrary(library);
  cast.push({
    character: member.character,
    rig: member.rig ?? library.rig,
    poses: library.poses.length,
    expressions: library.expressions.length,
    anchors: library.anchors,
    body: Boolean(library.body),
    archetype: library.archetype,
    stageRoles: library.stageRoles,
    appearance: library.appearance,
    errors: check.errors,
  });
}

const stagedShots = score.shots.filter(
  (shot) => (shot.direction.cast?.length ?? 0) > 0,
).length;

const beatsPath = resolve(root, "films", score.id, "beats.json");
const beatIds = new Set<string>();
if (existsSync(beatsPath)) {
  const beats = JSON.parse(readFileSync(beatsPath, "utf8")) as {
    beats?: Array<{ id?: unknown }>;
  };
  for (const beat of beats.beats ?? []) {
    if (typeof beat.id === "string") beatIds.add(beat.id);
  }
}

const scoreFindings = checkFilmIdentity({
  score,
  pack: {
    modes: identity.performance.modes,
    defaultMode: identity.performance.defaultMode,
    motifLibrary: identity.motifs.library,
    perFilm: identity.motifs.perFilm,
    uses: identity.motifs.uses,
    maxShotShare: identity.motifs.maxShotShare,
    semanticObjectMin: identity.motifs.semanticObjectMin,
    fieldRoles: FIELD_ROLES,
    forbidden: identity.forbidden,
  },
  beatIds,
});

const specimen = videoMode
  ? `films/${score.id}/${score.id}.mp4`
  : specimenArg ??
    (existsSync(resolve(root, "build", score.id, "collage", "frames"))
      ? `build/${score.id}/collage/frames`
      : `films/${score.id}/${score.id}.mp4`);
if (!existsSync(resolve(root, specimen))) {
  console.error(
    `style:identity: no specimen at ${specimen}; run \`npm run collage\` first, or pass --specimen`,
  );
  process.exit(1);
}

const outDir = resolve(root, "build", score.id, "style-identity");
mkdirSync(outDir, { recursive: true });
const measured = spawnSync(
  process.execPath,
  [
    "--import",
    "tsx",
    "scripts/style-measure.ts",
    "--ref",
    resolve(styleDir, identity.reference),
    "--specimen",
    resolve(root, specimen),
    "--out",
    outDir,
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
  specimen?: {
    luma?: { mean?: number | null };
    saturation?: { mean?: number | null };
    edges?: { mean?: number | null };
  };
};
const numeric = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;
const metrics: IdentityMetrics = {
  lumaMean: numeric(match.specimen?.luma?.mean),
  saturationMean: numeric(match.specimen?.saturation?.mean),
  edgesMean: numeric(match.specimen?.edges?.mean),
};

const scoreHash = `sha256:${createHash("sha256").update(readFileSync(scorePath)).digest("hex")}`;
const identityHash = `sha256:${createHash("sha256")
  .update(JSON.stringify(identity))
  .digest("hex")}`;
const ffmpeg = findFfmpeg();
const videoHash = videoMode
  ? videoStreamHash(ffmpeg, resolve(root, specimen))
  : null;

const collageReportPath = resolve(root, "build", score.id, "frame-report.json");
const collageReport = existsSync(collageReportPath)
  ? readFrameReport(collageReportPath)
  : null;

function measureVideo(base: FrameReport): FrameReport {
  const shots = planShots.map((shot, index) => {
    const source =
      base.shots.find((entry) => entry.shot === shot.id) ?? base.shots[index];
    if (!source) {
      throw new Error(`frame-report: no base sample for shot ${shot.id}`);
    }
    return analyzeRgb({
      rgb: readVideoRgb(ffmpeg, resolve(root, specimen), source.time),
      shot: shot.id,
      time: source.time,
      cast: shot.direction.cast ?? [],
      probe: undefined,
      boxOverride: source.box,
    });
  });
  return {
    $schema: "paper-studio/frame-report@1",
    film: score.id,
    score: scoreHash,
    videoHash,
    stage: "video",
    grid: { width: 480, height: 270 },
    shots,
    summary: summarize(shots),
  };
}

let frame: FrameSummary | null = null;
let frameReportHash: string | null = null;
let frameReportPath: string | null = null;
if (videoMode) {
  if (collageReport) {
    const videoReport = measureVideo(collageReport);
    frameReportPath = resolve(root, "build", score.id, "frame-report.video.json");
    writeFileSync(frameReportPath, `${JSON.stringify(videoReport, null, 2)}\n`, "utf8");
    frame = videoReport.summary;
    frameReportHash = `sha256:${createHash("sha256")
      .update(JSON.stringify(videoReport))
      .digest("hex")}`;
  }
} else if (collageReport) {
  frame = collageReport.summary;
  frameReportPath = collageReportPath;
  frameReportHash = `sha256:${createHash("sha256")
    .update(readFileSync(collageReportPath))
    .digest("hex")}`;
}

const result = checkStyleIdentity({
  shots: score.shots.length,
  stagedShots,
  cast,
  metrics,
  filmBands: identity.filmBands,
  field: identity.field,
  composition: identity.composition,
  castRule: identityCastRule(identity),
  performanceMode: score.performance?.mode,
  frame,
});
const findings = [...scoreFindings, ...result.findings];

const report = {
  film: score.id,
  style: score.style,
  styleVersion: score.styleVersion,
  score: scoreHash,
  identityHash,
  stage: videoMode ? "video" : "collage",
  specimen,
  videoHash,
  frameReport: frameReportPath
    ? frameReportPath.replace(`${root}\\`, "").replace(`${root}/`, "").replace(/\\/g, "/")
    : null,
  frameReportHash,
  dimension: identity.envelope.dimension,
  pass: findings.length === 0,
  stagedRatio: Number(result.stagedRatio.toFixed(3)),
  performanceMode: score.performance?.mode ?? null,
  stagedBand: result.stagedBand,
  stages: { shots: score.shots.length, stagedShots },
  cast,
  metrics,
  filmBands: identity.filmBands,
  frame,
  findings,
};
writeFileSync(
  resolve(outDir, "style-identity.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

for (const member of cast) {
  console.log(
    `identity: ${member.character.padEnd(6)} ${member.rig.padEnd(18)} ${member.poses} poses · ${member.expressions} expressions · ${member.archetype ?? "NO ARCHETYPE"}`,
  );
}
console.log(
  `identity: ${stagedShots}/${score.shots.length} staged shots · ` +
    `luma ${metrics.lumaMean?.toFixed(1) ?? "?"} (${identity.filmBands.lumaMean[0]}-${identity.filmBands.lumaMean[1]}) · ` +
    `sat ${metrics.saturationMean?.toFixed(1) ?? "?"} (${identity.filmBands.saturationMean[0]}-${identity.filmBands.saturationMean[1]}) · ` +
    `edges ${metrics.edgesMean?.toFixed(1) ?? "?"} (${identity.filmBands.edgesMean[0]}-${identity.filmBands.edgesMean[1]})`,
);
for (const finding of findings) {
  console.error(`  FAIL ${finding.code}: ${finding.message}`);
}
console.log(
  `style:identity: ${report.pass ? "pass" : "FAIL"} · ${findings.length} finding(s) · ${outDir}`,
);
if (!report.pass) process.exit(1);
