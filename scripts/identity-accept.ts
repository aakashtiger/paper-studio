/**
 * `identity:accept` - the proof the identity gate is calibrated.
 *
 *   reference film  -> must pass the film bands
 *   Uber film       -> must fail the named axes, not just "some" axis
 *
 * The reference has no score, so it is measured with `style:measure`; the Uber
 * film has a score, so it is measured with `style:identity --video`.
 *
 * usage: npm run identity:accept -- --ref <video> --film <score.json>
 * Exit 2 when an artifact is missing; 1 when the reference fails or Uber passes.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { StyleIdentitySchema } from "../src/core/style.js";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const reference = flag("ref");
const film = flag("film");
if (!reference || !film) {
  console.error("usage: npm run identity:accept -- --ref <video> --film <score.json>");
  process.exit(2);
}
const root = process.cwd();
const referencePath = resolve(root, reference);
const filmPath = resolve(root, film);
if (!existsSync(referencePath)) {
  console.error(`identity:accept: no reference at ${referencePath}`);
  process.exit(2);
}
if (!existsSync(filmPath)) {
  console.error(`identity:accept: no film at ${filmPath}`);
  process.exit(2);
}

const tokensPath = resolve(root, "styles", "paper-kpop", "tokens.json");
const tokens = JSON.parse(readFileSync(tokensPath, "utf8")) as { identity?: unknown };
const parsedIdentity = StyleIdentitySchema.safeParse(tokens.identity);
if (!parsedIdentity.success || !parsedIdentity.data.filmBands) {
  console.error("identity:accept: styles/paper-kpop/tokens.json has no complete identity block");
  process.exit(2);
}
const bands = parsedIdentity.data.filmBands;

const out = resolve(root, "build", "identity-accept", "reference");
mkdirSync(out, { recursive: true });
const measured = spawnSync(
  process.execPath,
  [
    "--import",
    "tsx",
    "scripts/style-measure.ts",
    "--ref",
    referencePath,
    "--specimen",
    referencePath,
    "--out",
    out,
  ],
  { cwd: root, encoding: "utf8" },
);
if (measured.status !== 0) {
  process.stderr.write(measured.stderr ?? "");
  process.stderr.write(measured.stdout ?? "");
  console.error("identity:accept: the reference measurement failed");
  process.exit(2);
}
const matchPath = resolve(out, "match.json");
if (!existsSync(matchPath)) {
  console.error("identity:accept: the reference measurement wrote no match.json");
  process.exit(2);
}
const match = JSON.parse(readFileSync(matchPath, "utf8")) as {
  specimen?: {
    luma?: { mean?: number };
    saturation?: { mean?: number };
    edges?: { mean?: number };
  };
};
const referenceMetrics = {
  lumaMean: match.specimen?.luma?.mean,
  saturationMean: match.specimen?.saturation?.mean,
  edgesMean: match.specimen?.edges?.mean,
};

const score = JSON.parse(readFileSync(filmPath, "utf8")) as { id?: string };
if (!score.id) {
  console.error("identity:accept: the film score has no id");
  process.exit(2);
}
const identity = spawnSync(
  process.execPath,
  ["--import", "tsx", "scripts/style-identity.ts", film, "--video"],
  { cwd: root, encoding: "utf8" },
);
const reportPath = resolve(root, "build", score.id, "style-identity", "style-identity.json");
if (!existsSync(reportPath)) {
  process.stderr.write(identity.stderr ?? "");
  console.error("identity:accept: style:identity wrote no report");
  process.exit(2);
}
const report = JSON.parse(readFileSync(reportPath, "utf8")) as {
  pass: boolean;
  findings: { code: string; message: string }[];
  metrics?: { lumaMean?: number; saturationMean?: number; edgesMean?: number };
};
const codes = new Set(report.findings.map((finding) => finding.code));
const required = [
  "identity:bars",
  "identity:fieldPlate",
  "identity:centroidX",
  "identity:heightRhythm",
  "identity:localContrast",
  "identity:blueOnBlue",
  "identity:cast",
  "identity:performance",
  "identity:motif",
];
const missing = required.filter((code) => !codes.has(code));

function band(value: number | undefined, range: readonly [number, number]): boolean {
  return typeof value === "number" && value >= range[0] && value <= range[1];
}

const referencePass =
  band(referenceMetrics.lumaMean, bands.lumaMean) &&
  band(referenceMetrics.saturationMean, bands.saturationMean) &&
  band(referenceMetrics.edgesMean, bands.edgesMean);
const uberFails = report.pass === false && missing.length === 0;

const fmt = (value: number | undefined): string =>
  typeof value === "number" ? value.toFixed(1) : "?";

console.log("identity:accept — the reference must pass, the Uber film must fail");
console.log("");
console.log("axis            reference   band            uber        verdict");
console.log(
  `luma mean       ${fmt(referenceMetrics.lumaMean).padEnd(11)} ${`${bands.lumaMean[0]}-${bands.lumaMean[1]}`.padEnd(15)} ${fmt(report.metrics?.lumaMean).padEnd(11)} ${referencePass ? "ref pass" : "ref FAIL"} / ${band(report.metrics?.lumaMean, bands.lumaMean) ? "uber pass" : "uber FAIL"}`,
);
console.log(
  `saturation      ${fmt(referenceMetrics.saturationMean).padEnd(11)} ${`${bands.saturationMean[0]}-${bands.saturationMean[1]}`.padEnd(15)} ${fmt(report.metrics?.saturationMean).padEnd(11)} ${band(referenceMetrics.saturationMean, bands.saturationMean) ? "ref pass" : "ref FAIL"} / ${band(report.metrics?.saturationMean, bands.saturationMean) ? "uber pass" : "uber FAIL"}`,
);
console.log(
  `edges           ${fmt(referenceMetrics.edgesMean).padEnd(11)} ${`${bands.edgesMean[0]}-${bands.edgesMean[1]}`.padEnd(15)} ${fmt(report.metrics?.edgesMean).padEnd(11)} ${band(referenceMetrics.edgesMean, bands.edgesMean) ? "ref pass" : "ref FAIL"} / ${band(report.metrics?.edgesMean, bands.edgesMean) ? "uber pass" : "uber FAIL"}`,
);
console.log("");
console.log(
  `reference: ${referencePass ? "PASS" : "FAIL"} · film bands ${bands.lumaMean[0]}-${bands.lumaMean[1]} / ${bands.saturationMean[0]}-${bands.saturationMean[1]} / ${bands.edgesMean[0]}-${bands.edgesMean[1]}`,
);
console.log(
  `uber:      ${uberFails ? "FAIL as required" : "WRONG"} · ${report.findings.length} finding(s)` +
    (missing.length > 0 ? ` · missing ${missing.join(", ")}` : ""),
);
if (report.findings.length > 0) {
  for (const finding of report.findings) console.log(`  ${finding.code}  ${finding.message}`);
}
console.log("");
if (!referencePass || !uberFails) {
  console.error("identity:accept: FAIL — the gate is not calibrated");
  process.exit(1);
}
console.log("identity:accept: PASS — reference inside the bands, Uber fails the named axes");
