/**
 * The movement probe: does every shot actually move?
 *
 * usage: npm run probe:motion -- films/<id>/score.json [--step 0.2] [--max 15]
 *
 * One stills pass paints a handful of frames inside every shot — in parallel,
 * through the same painter the film uses — and the paint probe returns a coarse
 * 48×27 sample of each, so the measurement needs no PNG decode and no encoded
 * video. Then, per shot: how far it travels from its first frame to its last.
 *
 * This is the check that would have refused *Same Alarm*'s scene 6 ("a still
 * photograph", 0.533 against a 0.6 floor) before a 70-minute render, and scene 7
 * before the 72-minute one after it. Twelve frames of a shot answer it.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { checkMotion, motionOf, type MotionFrame } from "../src/engine/motion.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run probe:motion -- <score.json> [--step 0.2] [--max 15]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main(): Promise<void> {
  const root = process.cwd();
  const scoreFile = resolve(root, file as string);
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scoreFile, "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }

  const step = Number(arg("step") ?? 0.2);
  const max = Math.max(2, Number(arg("max") ?? 15));
  if (!(step > 0)) {
    console.error("error: --step must be positive");
    process.exit(2);
  }

  // A short window inside every shot: never the boundary frame, which belongs to
  // the next shot, and never more than `max` frames, so a 7.5 s shot is sampled
  // as coarsely as it needs to be rather than costing 37 pictures.
  const times: { shot: string; times: number[] }[] = plan.shots.map((shot) => {
    const span = Math.max(0, shot.duration - 0.2);
    const wanted = Math.min(max, Math.max(2, Math.ceil(span / step) + 1));
    const local = wanted === 1 ? 0 : span / (wanted - 1);
    return {
      shot: shot.id,
      times: Array.from({ length: wanted }, (_, index) =>
        Number((shot.start + 0.1 + index * local).toFixed(3)),
      ),
    };
  });
  const all = times.flatMap((entry) => entry.times);

  const outDir = resolve(root, "build", score.id, "motion-probe");
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const probePath = join(outDir, "probe.json");

  console.log(`probe:motion: painting ${all.length} frames across ${plan.shots.length} shots`);
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", file as string,
        "--stills", all.join(","),
        "--out-dir", join(outDir, "frames"),
        // The probe reads numbers, not pictures: no PNG is encoded or written.
        "--no-png",
        "--probe", probePath,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });

  const probe = JSON.parse(readFileSync(probePath, "utf8")) as { frames: (MotionFrame & { sample?: number[] })[] };
  const frames: MotionFrame[] = probe.frames
    .filter((frame) => Array.isArray(frame.sample) && frame.sample.length > 0)
    .map((frame) => ({ time: frame.time, sample: frame.sample as number[] }));
  if (frames.length === 0) {
    console.error("error: the paint probe returned no samples; is --probe attached?");
    process.exit(1);
  }

  const report = checkMotion(motionOf(plan.shots, frames));
  const written = {
    film: score.id,
    score: `sha256:${createHash("sha256").update(readFileSync(scoreFile)).digest("hex")}`,
    step,
    frames: frames.length,
    shots: report.shots,
    errors: report.errors,
    warnings: report.warnings,
  };
  writeFileSync(join(outDir, "motion-probe.json"), `${JSON.stringify(written, null, 2)}\n`, "utf8");

  console.log("");
  for (const shot of report.shots) {
    const bar = "▏".repeat(Math.min(40, Math.round(shot.travel * 2)));
    console.log(
      `  ${shot.shot}  ${(shot.to - shot.from).toFixed(1).padStart(4)}s  ` +
        `${shot.frames.toString().padStart(2)} frames  travel ${shot.travel.toFixed(2).padStart(5)}  ` +
        `peak ${shot.peak.toFixed(2).padStart(5)}  ${bar}`,
    );
  }
  for (const warning of report.warnings) console.log(`  warn  ${warning.message}`);
  for (const error of report.errors) console.log(`  FAIL  ${error.message}`);
  console.log("");
  console.log(`probe:motion: ${join("build", score.id, "motion-probe", "motion-probe.json")}`);
  if (report.errors.length > 0) {
    console.log(`probe:motion: ${report.errors.length} shot(s) do not move — the film is not ready to paint`);
    process.exit(1);
  }
  console.log(`probe:motion: PASS — every shot moves (${frames.length} frames)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
