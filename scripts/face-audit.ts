/**
 * `audit:face` - did the painted face move between two named expressions?
 *
 * The paint probe samples each character's face box in face-local space. This
 * command finds the expression changes in the score, compares the samples
 * before/at/after each one, and refuses a no-change or a one-frame snap.
 *
 * usage: npm run audit:face -- films/<id>/score.json [--probe <probe.json>] [--step 0.1]
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  FACE_AUDIT_VERSION,
  analyseFaceSamples,
  expressionChanges,
  type FaceProbeFrame,
} from "../src/engine/face-audit.js";
import { fileHash } from "../src/engine/video.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run audit:face -- <score.json> [--probe <probe.json>] [--step 0.1]");
  process.exit(2);
}
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function run(argv: string[], cwd: string): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, ["--import", "tsx", ...argv], { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let error = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => (error += chunk));
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(error.slice(-1500)))));
  });
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const scoreFile = resolve(root, scorePath);
  const score = JSON.parse(readFileSync(scoreFile, "utf8").replace(/^\uFEFF/, "")) as {
    id: string;
    duration: number;
    fps?: number;
    shots: {
      id?: string;
      duration: number;
      direction?: { events?: { t: number; kind: string; who?: string; expression?: string }[] };
    }[];
  };
  const step = Number(arg("step") ?? "0.1");
  const probeArg = arg("probe");
  const probePath = probeArg
    ? resolve(root, probeArg)
    : resolve(root, "build", score.id, "face-probe", "probe.json");
  if (!probeArg) {
    mkdirSync(resolve(root, "build", score.id, "face-probe"), { recursive: true });
    const times: string[] = [];
    for (let time = 0; time < score.duration - 1e-9; time += step) {
      times.push(time.toFixed(3));
    }
    console.log(`audit:face: painting ${times.length} probe frames at ${step}s`);
    await run(
      [
        "scripts/render-film.ts",
        scorePath,
        "--stills",
        times.join(","),
        "--out-dir",
        join("build", score.id, "face-probe", "none"),
        "--no-png",
        "--probe",
        probePath,
      ],
      root,
    );
  }
  if (!existsSync(probePath)) throw new Error(`no probe at ${probePath}`);
  const probe = JSON.parse(readFileSync(probePath, "utf8")) as { frames: FaceProbeFrame[] };
  const changes = expressionChanges(score);
  const result = analyseFaceSamples({ frames: probe.frames, changes });
  const scoreHash = `sha256:${createHash("sha256").update(readFileSync(scoreFile)).digest("hex")}`;
  const probeHash = fileHash(probePath);
  const probeSource = fileHash(resolve(root, "src/engine/paint-probe.js"));
  const report = {
    film: score.id,
    contract: FACE_AUDIT_VERSION,
    score: scoreHash,
    probe: probeHash,
    probeFile: probePath.replace(`${root}\\`, "").replace(`${root}/`, "").replace(/\\/g, "/"),
    probeSource,
    step,
    sampledFrames: probe.frames.length,
    events: { changes: changes.length, measured: result.measured },
    changes: result.changes,
    findings: result.findings,
    pass: result.pass && result.measured === changes.length,
  };
  const out = resolve(root, "build", score.id, "face-audit.json");
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  for (const change of result.changes) {
    console.log(
      `face: ${change.shot} ${change.who} ${change.from}->${change.to} · signal ${change.signal.toFixed(3)} · cells ${change.changedCells} · in-between ${change.intermediates} · max step ${change.maxStep.toFixed(3)} · ${change.pass ? "pass" : "FAIL"}`,
    );
  }
  for (const finding of result.findings) console.error(`  FAIL ${finding.code}: ${finding.message}`);
  console.log(
    `audit:face: ${result.changes.length} change(s) · ${result.measured} measured · ${result.findings.length} finding(s) · ${report.pass ? "pass" : "FAIL"} · ${out}`,
  );
  if (!report.pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
