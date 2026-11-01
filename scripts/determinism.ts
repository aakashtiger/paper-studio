/**
 * `npm run determinism` — the painter is a pure function of time.
 *
 * Paints the same sampled frames twice, in two independent browser processes:
 * run A serial (one browser), run B across N workers. Every PNG must be
 * byte-identical, or the film is not deterministic and there is no point
 * painting 1,800 frames of it.
 *
 * Why this and not a twin render (decision 0032): the camera, the rig and the
 * type are functions of the score and the time, so the only thing that can
 * differ between two runs is the *environment* — and the sharpest environmental
 * question in a parallel renderer is not "is a second run the same" (it is the
 * same code path) but "is a frame the same whichever browser paints it, in
 * whatever order". A serial-vs-parallel twin answers that; two identical
 * parallel runs cannot.
 *
 * usage: npm run determinism -- films/<id>/score.json [--per-shot 3] [--workers 4] [--keep]
 */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { join, resolve } from "node:path";
import { checkTwin, sampleFrames, type TwinFrame } from "../src/engine/determinism.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run determinism -- <score.json> [--per-shot 3] [--workers 4] [--keep]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function run(argv: string[], cwd: string): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, ["--import", "tsx", ...argv], { cwd, stdio: ["ignore", "inherit", "inherit"] });
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`exited ${code}: ${argv.join(" ")}`))));
  });
}

const sha256 = (path: string): string =>
  `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;

/** The name the renderer gives a still at this time. */
const pngName = (time: number): string => `t-${time.toFixed(2).padStart(5, "0")}.png`;

async function main(): Promise<void> {
  const root = process.cwd();
  const scorePath = file as string;
  const scoreFile = resolve(root, scorePath);
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scoreFile, "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const perShot = Number(arg("per-shot") ?? 3);
  const parallel = Number(arg("workers") ?? Math.max(2, Math.min(4, Math.floor(availableParallelism() / 2))));
  const keep = args.includes("--keep");

  const sample = sampleFrames(plan.shots, perShot);
  const list = sample.map((entry) => entry.time.toFixed(2)).join(",");
  // The PNGs live in a subdirectory; the report goes where the gate reads it
  // (`build/<id>/determinism.json`), beside every other report about this film.
  const work = resolve(root, "build", score.id, "determinism");
  const reportPath = resolve(root, "build", score.id, "determinism.json");
  const dirA = join(work, "serial");
  const dirB = join(work, "parallel");
  for (const dir of [dirA, dirB]) rmSync(dir, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });

  console.log(
    `determinism: ${score.id} · ${sample.length} frames (${perShot} per shot, ${plan.shots.length} shots) · ` +
      `run A 1 browser, run B ${parallel}`,
  );

  const runs = { a: { workers: 1, seconds: 0 }, b: { workers: parallel, seconds: 0 } };
  const began = Date.now();
  await run(
    ["scripts/render-film.ts", scorePath, "--stills", list, "--out-dir", dirA, "--workers", "1"],
    root,
  );
  runs.a.seconds = Math.round((Date.now() - began) / 100) / 10;

  const beganB = Date.now();
  await run(
    ["scripts/render-film.ts", scorePath, "--stills", list, "--out-dir", dirB, "--workers", String(parallel)],
    root,
  );
  runs.b.seconds = Math.round((Date.now() - beganB) / 100) / 10;

  // A run that quietly painted fewer pictures than it was asked for would make
  // every comparison below vacuous, so the count is checked before the bytes.
  const frames: TwinFrame[] = [];
  for (const entry of sample) {
    const name = pngName(entry.time);
    const a = join(dirA, name);
    const b = join(dirB, name);
    if (!existsSync(a) || !existsSync(b)) {
      throw new Error(`run ${existsSync(a) ? "B" : "A"} did not paint ${name}`);
    }
    frames.push({ time: entry.time, shot: entry.shot, a: sha256(a), b: sha256(b), identical: false });
  }

  const manifestPath = resolve(root, "build", score.id, "render-manifest.json");
  let videoHash: string | null = null;
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { videoHash?: string };
    videoHash = manifest.videoHash ?? null;
  }

  const report = checkTwin({
    film: score.id,
    score: sha256(scoreFile),
    videoHash,
    runs,
    shots: plan.shots.map((shot) => shot.id),
    frames,
  });

  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  // On a pass the PNGs are 200 MB of evidence for a fact now recorded as 30
  // hashes; on a failure they are the only way to see what differed.
  if (report.pass && !keep) {
    rmSync(dirA, { recursive: true, force: true });
    rmSync(dirB, { recursive: true, force: true });
  } else if (!report.pass) {
    const kept = existsSync(dirA) ? readdirSync(dirA).length : 0;
    console.log(`determinism: kept ${kept} PNG(s) per run under build/${score.id}/determinism/`);
  }

  console.log("");
  for (const frame of report.frames) {
    const mark = frame.identical ? "same" : "DIFF";
    console.log(`  ${frame.shot}  t=${frame.time.toFixed(2).padStart(5)}s  ${frame.a.slice(0, 16)}…  ${mark}`);
  }
  console.log("");
  console.log(
    `determinism: ${report.frames.length} frames · serial ${runs.a.seconds}s · parallel ${runs.b.seconds}s · ` +
      `${report.mismatches} mismatch(es)`,
  );
  console.log(`determinism: build/${score.id}/determinism.json`);
  if (!report.pass) {
    for (const error of report.errors) console.log(`  FAIL  ${error.message}`);
    console.log(`determinism: the painter is not deterministic — do not paint the film`);
    process.exit(1);
  }
  console.log(`determinism: PASS · the same frame, whichever browser paints it, however many share the work`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
