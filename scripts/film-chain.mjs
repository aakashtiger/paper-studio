/**
 * The whole film, one command, in the only order that is honest.
 *
 * Every stage is a command that already exists; this script only decides the
 * order and stops at the first failure. It exists because the order is a
 * contract and the order used to live in a PowerShell file under `build/`,
 * which is gitignored — so the sequence that produced the accepted film was
 * not in the repository.
 *
 * The one structural rule it enforces: **the film is painted once.** Determinism
 * is proven before the paint by a twin *sample* — the same 30 frames painted
 * twice, once serial and once parallel, compared byte for byte (0032) — and the
 * single full render is then tied to that painter by the score hash, the
 * re-hashed inputs and `paint-match`, which repaints 61 frames in fresh
 * processes and compares them to the delivered video. Painting 1,800 frames
 * twice to prove what 30 frames already proved was the largest cost in the loop.
 *
 *   npm run film:chain -- films/understudy/score.json
 *   npm run film:chain -- <score> --skip-render   (reuse the render on disk)
 *   npm run film:chain -- <score> --from gate     (resume at a step)
 *   npm run film:chain -- <score> --workers 1     (force a serial render)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
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
const delivered = `films/${id}/${id}.mp4`;
const master = `${build}/mix/master.wav`;

/**
 * The unit suite, as files rather than as a shell glob: `test/*.test.ts` needs a
 * shell to expand on Windows, and the chain spawns node directly.
 */
const testFiles = readdirSync(resolve(root, "test"))
  .filter((name) => name.endsWith(".test.ts"))
  .sort()
  .map((name) => `test/${name}`);

/**
 * A step is a name and a command. `tsx` marks the TypeScript entry points,
 * which are run through the same node that runs this script — spawning
 * `npm.cmd` on Windows needs a shell, and Node 24 refuses that.
 */
const steps = [
  { name: "embed", tsx: "scripts/embed.ts", args: [score] },
  // The unit suite is 14 s and it already knew. Chain B spent 81 minutes
  // rendering a cut whose legs were measurably unreachable, then reported 209
  // rig findings — while `test/cast-rig.test.ts`, which asserts exactly that,
  // would have failed in a fourteenth of a second… if anything had run it. A
  // check that can refuse a render has to run before the render.
  { name: "tests", argv: ["--import", "tsx", "--test", ...testFiles] },
  // The score audit costs 0.4 s and the render costs 34 minutes, so the audit
  // runs first. It was the other way round, and a contradiction in one event
  // (`quiet` on an event a cue was bound to) was reported by the audit *after*
  // the deliverable and its twin had both finished — 70 minutes to learn what
  // four tenths of a second would have said. A check that can refuse a render
  // must run before it.
  { name: "audit", tsx: "scripts/audit.ts", args: [score] },
  // The preflight is the same lesson one stage up: it asks the *writing* every
  // question a viewer asked about the last film — median shot length, words a
  // minute, where the voice stops, whether one cue owns the whole thing, whether
  // the cast the vendor will draw even exists — and the renderer refuses to
  // paint a whole film without a fresh pass from it.
  { name: "preflight", tsx: "scripts/preflight.ts", args: [score] },
  // One pass for every picture question a score can answer (decision 0029): the
  // frames are painted once, probe-only, and the movement, the type and the rig
  // are all read from that same probe. It also writes the movement report the
  // renderer's gate reads. Before this, the chain painted those frames three
  // times — and a rig pass wrote 2 GB of PNGs that nothing opened.
  { name: "inspect", tsx: "scripts/inspect.ts", args: [score] },
  // The painter is a pure function of the score and the time, proven by painting
  // a sample twice — once in one browser, once across four — and comparing bytes
  // (0032). It runs *before* the paint because that is the only place a
  // nondeterministic painter can be refused cheaply: 30 frames, ~48 s, against
  // painting 1,800 frames twice to learn the same thing.
  { name: "determinism", tsx: "scripts/determinism.ts", args: [score] },
  // Stage 5: the character sheet and the collage. The sheet is the page where a
  // plank arm is obvious; the collage is one frame per shot, checked by the tool
  // (every shot present, none blank or duplicated, every staged character drawn,
  // no word off the edge). `render:film` refuses a whole film without both.
  { name: "sheet", tsx: "scripts/sheet.ts", args: [score] },
  { name: "collage", tsx: "scripts/collage.ts", args: [score] },
  { name: "sfx", tsx: "scripts/sfx.ts", args: [score] },
  { name: "mix", tsx: "scripts/mix.ts", args: [score] },
  {
    name: "render",
    skip: skipRender,
    commands: [
      { name: "render (deliverable)", tsx: "scripts/render-film.ts", args: [score, "--out", deliverable, "--audio", master, "--workers", String(workers)] },
    ],
  },
  { name: "frames", tsx: "scripts/frame-audit.ts", args: [score, "--video", deliverable] },
  { name: "paint", tsx: "scripts/paint-match.ts", args: [score, "--video", deliverable] },
  { name: "palette", tsx: "scripts/palette-audit.ts", args: [score, "--video", deliverable] },
  { name: "motion", tsx: "scripts/motion-audit.ts", args: [score, "--video", deliverable] },
  { name: "deliver", tsx: "scripts/deliver.ts", args: [score, "--video", deliverable, "--out", delivered] },
  { name: "asr", tsx: "scripts/asr.ts", args: [score] },
  { name: "gate", tsx: "scripts/gate-7.ts", args: [score] },
  // `--reuse`: the chain has just run every one of these audits, so the review
  // prints them from their reports instead of re-measuring them — but only when
  // a report is verifiably about this picture or this score (decision 0033).
  // Re-running them cost ~5 minutes to re-derive verdicts already in hand.
  { name: "review", tsx: "scripts/film-review.ts", args: [score, "--gate", "--reuse"] },
];

function run(step) {
  const began = Date.now();
  const argv = step.argv
    ? [process.execPath, step.argv]
    : step.tsx
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
console.log(`chain: ${id} · ${workers} worker(s) of ${threads} threads · render ${skipRender ? "reused" : "once"}`);

// A resumed or audio-only run must not measure a picture that is not there.
if (skipRender) {
  if (!existsSync(resolve(root, deliverable))) {
    console.error(`error: --skip-render needs ${deliverable}; render it first or drop the flag`);
    process.exit(2);
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
