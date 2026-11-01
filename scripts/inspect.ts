/**
 * One pass, every cheap picture check (decision 0029).
 *
 * The render loop used to paint the same frames three times: `probe:motion`
 * (150 frames), `audit:type` (120 at 0.5 s steps) and `audit:rig` (601 at 0.1 s
 * steps and 2 GB of PNGs nothing opened). Every one of them reads the same paint
 * probe — text boxes, rig records and a coarse sample of the frame — and every
 * one of those probes was painted from the same score through the same painter.
 *
 * This command paints **one grid** of frames, probe-only (no PNG is ever
 * encoded), writes one probe, and then asks all three questions of it:
 *
 *   does every shot move?          `motion:*`   → the gate `render:film` reads
 *   is every word inside the safe area?  `type:*`
 *   does every leg solve and land?      `rig:*`
 *
 * The audits keep their own grids: they filter the shared probe to the frames
 * they would have painted themselves, so a verdict is the one they would have
 * reached alone — only the painting is shared.
 *
 * usage: npm run inspect -- films/<id>/score.json [--step 0.1] [--workers 4]
 *
 * The step is the finest grid any check needs: at 0.1 s the rig audit sees every
 * frame it wants, and the movement and type checks take their frames from it.
 */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { motionReportFor, type MotionFrame } from "../src/engine/motion.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run inspect -- <score.json> [--step 0.1] [--workers 4]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

/** Run a child to completion, with its output shown, and fail if it fails. */
function run(argv: string[], cwd: string): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, ["--import", "tsx", ...argv], { cwd, stdio: ["ignore", "inherit", "inherit"] });
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`exited ${code}: ${argv.join(" ")}`))));
  });
}

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

  const step = Number(arg("step") ?? 0.1);
  if (!(step > 0)) {
    console.error("error: --step must be positive");
    process.exit(2);
  }
  const workers = arg("workers");

  const work = resolve(root, "build", score.id, "inspect");
  mkdirSync(work, { recursive: true });
  const probePath = join(work, "probe.json");
  const times: number[] = [];
  for (let time = 0; time < score.duration - 1e-9; time += step) {
    times.push(Math.round(time * 1000) / 1000);
  }

  // 1 — one pass. Probe-only: the numbers are the evidence, the PNGs never were.
  console.log(`inspect: painting ${times.length} frames at ${step}s steps (no PNG)`);
  await run(
    [
      "scripts/render-film.ts",
      scorePath,
      "--stills",
      times.map((time) => time.toFixed(3)).join(","),
      "--out-dir",
      join("build", score.id, "inspect", "none"),
      "--no-png",
      "--probe",
      probePath,
      ...(workers ? ["--workers", workers] : []),
    ],
    root,
  );

  type Probe = { frames: { time: number; textBoxes?: { text: string }[]; rigRecords?: unknown[]; sample?: number[] }[] };
  const probe = JSON.parse(readFileSync(probePath, "utf8")) as Probe;
  if (probe.frames.length === 0) throw new Error("the paint probe returned no frames");

  // 2 — movement, from the same frames, written where the renderer's gate reads it.
  const scoreHash = `sha256:${createHash("sha256").update(readFileSync(scoreFile)).digest("hex")}`;
  const motion = motionReportFor({
    film: score.id,
    score: scoreHash,
    step,
    shots: plan.shots,
    frames: probe.frames
      .filter((frame) => Array.isArray(frame.sample) && frame.sample.length > 0)
      .map((frame): MotionFrame => ({ time: frame.time, sample: frame.sample as number[] })),
  });
  const motionDir = resolve(root, "build", score.id, "motion-probe");
  mkdirSync(motionDir, { recursive: true });
  writeFileSync(join(motionDir, "motion-probe.json"), `${JSON.stringify(motion, null, 2)}\n`, "utf8");

  // 3 — the two audits that already know how to read a probe. Each keeps its own
  // grid, so the frames it judges are the frames it would have painted.
  const failures: string[] = [];
  if (motion.errors.length > 0) failures.push("motion");
  console.log("");
  for (const shot of motion.shots) {
    const bar = "▏".repeat(Math.min(40, Math.round(shot.travel * 2)));
    console.log(
      `  ${shot.shot}  ${(shot.to - shot.from).toFixed(1).padStart(4)}s  ${shot.frames.toString().padStart(3)} frames  ` +
        `travel ${shot.travel.toFixed(2).padStart(5)}  peak ${shot.peak.toFixed(2).padStart(5)}  ${bar}`,
    );
  }
  for (const error of motion.errors) console.log(`  FAIL  ${error.message}`);
  for (const warning of motion.warnings) console.log(`  warn  ${warning.message}`);
  console.log("");

  for (const [name, script] of [
    ["type", "scripts/type-audit.ts"],
    ["rig", "scripts/rig-audit.ts"],
  ] as const) {
    console.log(`inspect: ${name} on the shared probe`);
    try {
      await run([script, scorePath, "--probe", probePath], root);
    } catch {
      failures.push(name);
    }
  }

  const summary = {
    film: score.id,
    score: scoreHash,
    step,
    frames: probe.frames.length,
    pass: { motion: motion.errors.length === 0, type: !failures.includes("type"), rig: !failures.includes("rig") },
    failures,
  };
  writeFileSync(join(work, "inspect.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  console.log("");
  console.log(
    `inspect: ${probe.frames.length} frames once · motion ${summary.pass.motion ? "PASS" : "FAIL"} · ` +
      `type ${summary.pass.type ? "PASS" : "FAIL"} · rig ${summary.pass.rig ? "PASS" : "FAIL"}`,
  );
  console.log(`inspect: build/${score.id}/inspect/inspect.json`);
  if (failures.length > 0) {
    console.log(`inspect: ${failures.length} check(s) refused — the film is not ready to paint`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
