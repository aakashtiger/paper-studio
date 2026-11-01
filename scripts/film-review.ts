/**
 * `film:review` — the front door (decision 0017, step 9).
 *
 * Chains the review steps for one film, prints one page, and names one sheet.
 * It hides no failure: every step runs even after another fails, each step's
 * status is on the page, and a failure prints the step's own output and a
 * non-zero exit. What it did not run is said out loud, never implied.
 *
 * usage: npm run film:review -- <score.json> [--gate] [--from <step>]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run film:review -- <score.json> [--gate]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

type StepResult = { name: string; ok: boolean; detail: string; output: string };

const root = process.cwd();
const scorePath = file as string;
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const id = score.id;
/** When this review started. A file older than this was not written by it. */
const startedAt = Date.now();
const video = resolve(root, "films", id, `${id}.mp4`);
const hasVideo = existsSync(video);
const wantGate = args.includes("--gate");

type Step = { name: string; script: string; detail: string };
const steps: Step[] = [
  { name: "audit", script: "scripts/audit.ts", detail: "score-level contracts" },
  { name: "board", script: "scripts/board.ts", detail: "cards, one image" },
  { name: "storyboard", script: "scripts/storyboard.ts", detail: "one frame per shot" },
  { name: "sheet", script: "scripts/sheet.ts", detail: "character / pose sheet" },
  { name: "sfx", script: "scripts/sfx.ts", detail: "cues + spectrogram sheet" },
  // The master is measured after the cues are regenerated: `sfx` rewrites every
  // WAV, so a master mixed before it is a master of a different cue set.
  { name: "mix", script: "scripts/mix.ts", detail: "master, measured" },
];
if (hasVideo) {
  steps.push({ name: "strips", script: "scripts/strips.ts", detail: "per-shot strips" });
}
if (wantGate) {
  for (const gate of ["frame-audit", "paint-match", "motion-audit", "type-audit", "rig-audit"] as const) {
    steps.push({ name: gate, script: `scripts/${gate}.ts`, detail: "G7 mechanical audit" });
  }
  // After the audits, because `deliver` puts the measured master into the
  // picture — and the picture must already have passed its frame audit. Before
  // the gate, because the gate's `deliveredAudio` row reads the delivered file.
  // Nothing in this chain rewrites `render-manifest.json`: the renderer is its
  // only writer (see `src/engine/manifest.ts`).
  steps.push({ name: "deliver", script: "scripts/deliver.ts", detail: "master into the picture, measured" });
  steps.push({ name: "gate:7", script: "scripts/gate-7.ts", detail: "the final gate" });
}

/**
 * The artifact a step writes. `film:review` reads a step's own report to
 * summarise it — but only a report *this* run wrote. A report on disk from last
 * week is not evidence that this run passed.
 */
function artifact(name: string): string | null {
  switch (name) {
    case "audit":
      return `build/${id}/audit.json`;
    case "board":
      return `build/${id}/board/board.json`;
    case "storyboard":
      return `build/${id}/storyboard/storyboard.json`;
    case "sheet":
      return `build/${id}/sheets`;
    case "sfx":
      return `build/${id}/sfx/sfx.json`;
    case "strips":
      return `build/${id}/strips/strips.json`;
    case "mix":
      return `build/${id}/mix/mix-report.json`;
    case "deliver":
      return `build/${id}/deliver.json`;
    case "gate:7":
      return `build/${id}/gate-7.json`;
    default:
      return name.endsWith("-audit") || name === "paint-match" ? `build/${id}/${name}.json` : null;
  }
}

/** When the step's artifact was last touched, or null if it is not there. */
function stamp(name: string): number | null {
  const rel = artifact(name);
  if (!rel) return null;
  const path = resolve(root, rel);
  if (!existsSync(path)) return null;
  try {
    if (statSync(path).isDirectory()) {
      let newest = 0;
      for (const entry of readdirSync(path)) {
        const file = resolve(path, entry);
        if (entry.endsWith(".png")) newest = Math.max(newest, statSync(file).mtimeMs);
      }
      return newest || null;
    }
    return statSync(path).mtimeMs;
  } catch {
    return null;
  }
}

async function runStep(step: Step): Promise<StepResult> {
  const before = stamp(step.name);
  return new Promise((done) => {
    const child = spawn(process.execPath, ["--import", "tsx", step.script, scorePath], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.on("close", (code) => {
      const ok = code === 0;
      const after = stamp(step.name);
      const fresh = after !== null && after !== before;
      // A failed step is described by its own output. Never by a report on disk:
      // that report is from an earlier run, and printing it beside FAIL is a lie.
      const described = fresh ? describe(step.name) : null;
      const detail = ok
        ? described ?? (lastLine(output) || step.detail)
        : (described?.startsWith("FAIL") ? described : null) ?? (failureLine(output) || "failed");
      done({ name: step.name, ok, detail, output });
    });
  });
}

async function main(): Promise<void> {
  const results: StepResult[] = [];
  for (const step of steps) {
    process.stdout.write(`film:review: ${step.name}...\n`);
    results.push(await runStep(step));
  }

  const failed = results.filter((result) => !result.ok);
  const gateRan = results.some((result) => result.name === "gate:7");
  const page = gateRan ? readGatePage() : [`G7 gate-7     not run in this review${wantGate ? "" : " (pass --gate)"}`];
  const sheetPath = pickSheet();

  console.log("");
  console.log(`film:review — ${id} · ${score.style}@${score.styleVersion} · ${score.duration}s · ${score.aspect} · ${plan.shots.length} shots`);
  console.log("");
  for (const result of results) {
    const mark = result.ok ? "ok  " : "FAIL";
    console.log(`  ${mark} ${result.name.padEnd(12)} ${result.detail || "(no output)"}`);
  }
  for (const line of page) console.log(`  ${line}`);
  console.log("");
  for (const line of notRun()) console.log(`  skipped ${line}`);
  console.log(`  one sheet: ${sheetPath ?? "none from this run"}`);

  if (failed.length > 0) {
    for (const result of failed) {
      console.error("");
      console.error(`film:review: ${result.name} output:`);
      for (const line of result.output.trim().split("\n").slice(-20)) console.error(`  ${line}`);
    }
  }

  console.log("");
  console.log(`film:review: ${failed.length === 0 ? "PASS" : `FAIL (${failed.map((result) => result.name).join(", ")})`}${wantGate ? "" : " · gate not run (pass --gate)"}`);
  if (failed.length > 0) process.exit(1);
}

/** What this review did not do, named so nobody reads silence as a pass. */
function notRun(): string[] {
  const lines: string[] = [];
  if (!hasVideo) lines.push("strips     no delivered MP4 at films/" + id + "/" + id + ".mp4");
  if (!wantGate) lines.push("G7 audits  five mechanical audits and gate:7 (pass --gate)");
  return lines;
}

/** The last line that is prose, not JSON punctuation. */
function lastLine(output: string): string {
  const lines = output.trim().split("\n").map((line) => line.trim()).filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index] ?? "";
    if (!/^[{}[\],]+$/.test(line) && !/^"[^"]+":/.test(line)) return line;
  }
  return "";
}

/** The line that says what went wrong: an explicit error, else the last failure. */
function failureLine(output: string): string {
  const lines = output.trim().split("\n").map((line) => line.trim()).filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index] ?? "";
    if (/^error[:\s]/i.test(line)) return line;
  }
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index] ?? "";
    if (/fail/i.test(line) && !/^[{}[\],]+$/.test(line)) return line;
  }
  return lastLine(output);
}

function readJson<T>(rel: string): T | null {
  const path = resolve(root, rel);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

/** One line for a step, read from the report the step wrote. */
function describe(name: string): string | null {
  const id = score.id;
  switch (name) {
    case "audit": {
      const report = readJson<{
        ok: boolean;
        shots: number;
        events: number;
        cues: number;
        captions: number;
        warnings: unknown[];
        errors: Array<{ message: string }>;
      }>(`build/${id}/audit.json`);
      if (!report) return null;
      if (!report.ok) return `FAIL · ${report.errors[0]?.message ?? "the score audit failed"}`;
      return `ok · ${report.shots} shots · ${report.events} events · ${report.cues} cues · ${report.captions} captions${report.warnings.length ? ` · ${report.warnings.length} warnings` : ""}`;
    }
    case "board": {
      const report = readJson<{ entries: number; sheet: { width: number; height: number } | null }>(
        `build/${id}/board/board.json`,
      );
      if (!report) return null;
      return `${report.entries} cards${report.sheet ? ` · ${report.sheet.width}×${report.sheet.height}` : ""}`;
    }
    case "storyboard": {
      const report = readJson<{ shots: unknown[]; grid: { cols: number; rows: number } }>(
        `build/${id}/storyboard/storyboard.json`,
      );
      return report ? `one frame per shot · ${report.shots.length} shots · ${report.grid.cols}×${report.grid.rows}` : null;
    }
    case "sheet": {
      const dir = resolve(root, "build", id, "sheets");
      const count = existsSync(dir) ? readdirSync(dir).filter((entry) => entry.endsWith(".png")).length : 0;
      return count > 0 ? `${count} character / pose sheets` : null;
    }
    case "sfx": {
      const report = readJson<{ cues: number; grid: { cols: number; rows: number } | null }>(`build/${id}/sfx/spectrogram.json`);
      return report ? `${report.cues} cues · spectrogram on one sheet` : "no cues";
    }
    case "strips": {
      const report = readJson<{ strips: unknown[]; grid: { cols: number; rows: number } }>(`build/${id}/strips/strips.json`);
      return report ? `one strip per shot · ${report.strips.length} shots · ${report.grid.cols}×${report.grid.rows}` : null;
    }
    case "mix": {
      const report = readJson<{
        passes: boolean;
        measured: { lufs: number; truePeak: number };
        master?: { gainDb: number; limiterGainReductionDb: number };
      }>(`build/${id}/mix/mix-report.json`);
      if (!report) return null;
      if (!report.passes) return "FAIL · the mix report does not pass";
      return `${report.measured.lufs.toFixed(1)} LUFS / ${report.measured.truePeak.toFixed(1)} dBTP${report.master ? ` · gain ${report.master.gainDb >= 0 ? "+" : ""}${report.master.gainDb.toFixed(1)} dB` : ""}`;
    }
    case "deliver": {
      const report = readJson<{
        ok: boolean;
        passes: number;
        conflict: string | null;
        output: { audio: { lufs: number; truePeak: number; limitDb: number } };
      }>(`build/${id}/deliver.json`);
      if (!report) return null;
      if (!report.ok) return `FAIL · ${report.conflict ?? "the delivered file is out of contract"}`;
      return `${report.output.audio.lufs.toFixed(1)} LUFS / ${report.output.audio.truePeak.toFixed(1)} dBTP measured on the delivered file · ${report.passes} pass(es)`;
    }
    case "frame-audit": {
      const report = readJson<{ frameCount: number; blankCount: number }>(`build/${id}/frame-audit.json`);
      return report ? `${report.frameCount} frames · ${report.blankCount} blank` : null;
    }
    case "paint-match": {
      const report = readJson<{ sampled: number; worst: { time: number; psnr: number } }>(`build/${id}/paint-match.json`);
      return report
        ? `${report.sampled} frames · worst ${report.worst.psnr.toFixed(1)} dB at ${report.worst.time}s`
        : null;
    }
    case "motion-audit": {
      const report = readJson<{ sampled: number; shots: Array<{ median: number }> }>(`build/${id}/motion-audit.json`);
      if (!report) return null;
      const weakest = report.shots.reduce((min, shot) => Math.min(min, shot.median), Number.POSITIVE_INFINITY);
      return `${report.shots.length} shots · weakest median ${weakest}`;
    }
    case "type-audit": {
      const report = readJson<{
        sampled: number;
        boxes: number;
        copyBoxes?: number;
        floor?: { px: number };
        outside: unknown[];
        belowFloor?: unknown[];
      }>(`build/${id}/type-audit.json`);
      return report
        ? `${report.boxes} boxes in ${report.sampled} frames (${report.copyBoxes ?? 0} copy at the ${report.floor?.px ?? "?"}px floor) · ${report.outside.length} outside · ${report.belowFloor?.length ?? 0} under the floor`
        : null;
    }
    case "rig-audit": {
      const report = readJson<{ legs: number; unpairedSolves: number; worstAnkleJump: { distance: number } }>(
        `build/${id}/rig-audit.json`,
      );
      return report
        ? `${report.legs} legs · ${report.unpairedSolves} unpaired · worst ankle jump ${report.worstAnkleJump.distance}px`
        : null;
    }
    default:
      return null;
  }
}

/** The gate-7 page, read not re-run — and only when this run wrote it. */
function readGatePage(): string[] {
  const path = resolve(root, "build", id, "gate-7.json");
  if (!existsSync(path) || statSync(path).mtimeMs < startedAt) {
    return ["G7 gate-7     no fresh gate-7 report from this run"];
  }
  try {
    const report = JSON.parse(readFileSync(path, "utf8")) as {
      pass: boolean;
      frozenVideoHash: string | null;
      checks: Record<string, unknown>;
      pending: string[];
      generatedAt: string;
    };
    const checks = Object.keys(report.checks).length;
    const failed = Object.entries(report.checks)
      .filter(([, value]) => (value as { ok?: boolean }).ok === false)
      .map(([name]) => name);
    return [
      `G7 gate-7     ${report.pass ? "PASS" : `FAIL (${failed.join(", ")})`} · ${checks} checks · ${report.pending.length} manual · ${report.frozenVideoHash?.slice(0, 18) ?? "no video hash"}...`,
    ];
  } catch {
    return ["G7 gate-7     unreadable"];
  }
}

/** One sheet, the best this run made. A sheet from an older run is not evidence. */
function pickSheet(): string | null {
  const candidates = [
    `build/${id}/final-sheet.png`,
    `build/${id}/strips/strips.png`,
    `build/${id}/stills/stills.png`,
    `build/${id}/storyboard/storyboard.png`,
    `build/${id}/board/board-sheet.png`,
    `build/${id}/sfx/spectrogram-sheet.png`,
  ];
  for (const candidate of candidates) {
    const path = resolve(root, candidate);
    if (existsSync(path) && statSync(path).mtimeMs >= startedAt) return candidate;
  }
  return null;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
