/**
 * The whole film, one command, in the only order that is honest.
 *
 * Every stage is a command that already exists; this script only decides the
 * order and stops at the first failure. It exists because the order is a
 * contract and the order used to live in a PowerShell file under `build/`,
 * which is gitignored — so the sequence that produced the accepted film was
 * not in the repository.
 *
 * The one structural rule it enforces: **the two renders compared for
 * determinism are builds, not deliveries.** The film is rendered to
 * `build/<id>/deliverable.mp4`, the twin to `build/<id>/det-e.mp4`, the two are
 * compared byte for byte, and only then does `deliver` re-cut the audio into
 * `films/<id>/<id>.mp4`. If the comparand were the delivered file, `deliver`
 * would move it after the comparison and the gate would be right to refuse:
 * a report that names a file that has since changed proves nothing.
 *
 *   npm run film:chain -- films/understudy/score.json
 *   npm run film:chain -- <score> --skip-render   (reuse the two renders)
 *   npm run film:chain -- <score> --from gate     (resume at a step)
 *   npm run film:chain -- <score> --workers 1     (force a serial render)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { cpus } from "node:os";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const scoreArg = args.find((arg) => !arg.startsWith("--"));
const flag = (name) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? undefined : args[at + 1];
};
const skipRender = args.includes("--skip-render");
const from = flag("from");

if (!scoreArg) {
  console.error("usage: npm run film:chain -- <score.json> [--skip-render] [--from <step>] [--workers <n>]");
  process.exit(2);
}

/**
 * How many browsers paint at once (decision 0023).
 *
 * A frame is a pure function of `(time, score, assets)`, so this is a speed
 * knob and not a contract: the proof is `npm run render:workers`, which shows a
 * 4-worker render produces the serial render's bytes. Two threads per worker
 * because a frame occupies one thread for canvas work and borrows another to
 * encode the PNG, and six because a 60 s film split into more ranges spends more
 * time starting browsers than painting. Override with `--workers N`; `1` is the
 * serial render, which is what a machine short of memory should ask for.
 */
const threads = cpus().length;
const workersFlag = flag("workers");
const workers =
  workersFlag === undefined
    ? Math.min(6, Math.max(1, Math.floor(threads / 2)))
    : Math.max(1, Number(workersFlag) || 1);

const root = process.cwd();
const score = scoreArg.replace(/\\/g, "/");
// The film's id is a field in the score, not the file's name: every film is
// `films/<id>/score.json`, so the basename is always the literal word "score".
const id = JSON.parse(readFileSync(resolve(root, score), "utf8")).id;
if (typeof id !== "string" || id === "") {
  console.error(`error: ${score} has no id`);
  process.exit(2);
}
const build = `build/${id}`;
const deliverable = `${build}/deliverable.mp4`;
const twin = `${build}/det-e.mp4`;
const delivered = `films/${id}/${id}.mp4`;
const master = `${build}/mix/master.wav`;

/**
 * A step is a name and a command. `tsx` marks the TypeScript entry points,
 * which are run through the same node that runs this script — spawning
 * `npm.cmd` on Windows needs a shell, and Node 24 refuses that.
 */
const steps = [
  { name: "embed", tsx: "scripts/embed.ts", args: [score] },
  // The score audit costs 0.4 s and the render costs 34 minutes, so the audit
  // runs first. It was the other way round, and a contradiction in one event
  // (`quiet` on an event a cue was bound to) was reported by the audit *after*
  // the deliverable and its twin had both finished — 70 minutes to learn what
  // four tenths of a second would have said. A check that can refuse a render
  // must run before it.
  { name: "audit", tsx: "scripts/audit.ts", args: [score] },
  { name: "sfx", tsx: "scripts/sfx.ts", args: [score] },
  { name: "mix", tsx: "scripts/mix.ts", args: [score] },
  {
    name: "render",
    skip: skipRender,
    commands: [
      { name: "render (deliverable)", tsx: "scripts/render-film.ts", args: [score, "--out", deliverable, "--audio", master, "--workers", String(workers)] },
      { name: "render (twin)", tsx: "scripts/render-film.ts", args: [score, "--out", twin, "--audio", master, "--workers", String(workers)] },
    ],
  },
  {
    name: "determinism",
    skip: skipRender,
    commands: [
      { name: "determinism", node: "scripts/compare-renders.mjs", args: [deliverable, twin, "--out", `${build}/determinism.json`] },
    ],
  },
  { name: "frames", tsx: "scripts/frame-audit.ts", args: [score, "--video", deliverable] },
  { name: "paint", tsx: "scripts/paint-match.ts", args: [score, "--video", deliverable] },
  { name: "palette", tsx: "scripts/palette-audit.ts", args: [score, "--video", deliverable] },
  { name: "motion", tsx: "scripts/motion-audit.ts", args: [score, "--video", deliverable] },
  { name: "type", tsx: "scripts/type-audit.ts", args: [score] },
  { name: "rig", tsx: "scripts/rig-audit.ts", args: [score] },
  { name: "deliver", tsx: "scripts/deliver.ts", args: [score, "--video", deliverable, "--out", delivered] },
  { name: "asr", tsx: "scripts/asr.ts", args: [score] },
  { name: "gate", tsx: "scripts/gate-7.ts", args: [score] },
  { name: "review", tsx: "scripts/film-review.ts", args: [score, "--gate"] },
];

function run(step) {
  const began = Date.now();
  const argv = step.tsx
    ? [process.execPath, ["--import", "tsx", step.tsx, ...step.args]]
    : [process.execPath, [step.node, ...step.args]];
  console.log(`\n=== ${step.name}`);
  const child = spawnSync(argv[0], argv[1], { cwd: root, stdio: "inherit" });
  const seconds = ((Date.now() - began) / 1000).toFixed(1);
  if (child.error) {
    console.log(`chain: ${step.name} could not start — ${child.error.message}`);
    process.exit(1);
  }
  if (child.status !== 0) {
    console.log(`chain: STOPPED at ${step.name} (exit ${child.status}) after ${seconds}s`);
    process.exit(child.status ?? 1);
  }
  console.log(`chain: ${step.name} ok in ${seconds}s`);
}

mkdirSync(resolve(root, build), { recursive: true });
console.log(`chain: ${id} · ${workers} worker(s) of ${threads} threads · render ${skipRender ? "reused" : "twice (deliverable + twin)"}`);

// A resumed or audio-only run must not measure a picture that is not there.
if (skipRender) {
  for (const file of [deliverable, twin]) {
    if (!existsSync(resolve(root, file))) {
      console.error(`error: --skip-render needs ${file}; render it first or drop the flag`);
      process.exit(2);
    }
  }
}

let started = from === undefined;
let count = 0;
for (const step of steps) {
  if (!started) {
    if (step.name !== from) continue;
    started = true;
  }
  if (step.skip) {
    console.log(`\n=== ${step.name} (skipped)`);
    continue;
  }
  const commands = step.commands ?? [step];
  for (const command of commands) run(command);
  count++;
}

console.log(`\nchain: PASS · ${count} step(s) · delivered ${delivered}`);
