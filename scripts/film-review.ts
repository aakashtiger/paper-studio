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
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

const video = resolve(root, "films", score.id, `${score.id}.mp4`);
const hasVideo = existsSync(video);
const wantGate = args.includes("--gate");

type Step = { name: string; script: string; detail: string };
const steps: Step[] = [
  { name: "audit", script: "scripts/audit.ts", detail: "score-level contracts" },
  { name: "board", script: "scripts/board.ts", detail: "cards, one image" },
  { name: "storyboard", script: "scripts/storyboard.ts", detail: "one frame per shot" },
  { name: "sheet", script: "scripts/sheet.ts", detail: "character / pose sheet" },
  { name: "sfx", script: "scripts/sfx.ts", detail: "cues + spectrogram sheet" },
];
if (hasVideo) {
  steps.push({ name: "strips", script: "scripts/strips.ts", detail: "per-shot strips" });
}
if (wantGate) {
  for (const gate of ["frame-audit", "paint-match", "motion-audit", "type-audit", "rig-audit"] as const) {
    steps.push({ name: gate, script: `scripts/${gate}.ts`, detail: "G7 mechanical audit" });
  }
  steps.push({ name: "gate:7", script: "scripts/gate-7.ts", detail: "the final gate" });
}

async function runStep(step: Step): Promise<StepResult> {
  return new Promise((done) => {
    const child = spawn(process.execPath, ["--import", "tsx", step.script, scorePath], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.on("close", (code) => {
      done({ name: step.name, ok: code === 0, detail: describe(step.name) ?? (lastLine(output) || step.detail), output });
    });
  });
}

async function main(): Promise<void> {
  const results: StepResult[] = [];
  for (const step of steps) {
    process.stdout.write(`film:review: ${step.name}...\n`);
    results.push(await runStep(step));
  }

  const page = readGatePage();
  const sheetPath = pickSheet();

  console.log("");
  console.log(`film:review — ${score.id} · ${score.style}@${score.styleVersion} · ${score.duration}s · ${score.aspect} · ${plan.shots.length} shots`);
  console.log("");
  for (const result of results) {
    const mark = result.ok ? "ok  " : "FAIL";
    console.log(`  ${mark} ${result.name.padEnd(12)} ${result.detail || "(no output)"}`);
  }
  for (const line of page) console.log(`  ${line}`);
  console.log("");
  console.log(`  one sheet: ${sheetPath ?? "none yet"}`);

  const failed = results.filter((result) => !result.ok);
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

/** The last line that is prose, not JSON punctuation. */
function lastLine(output: string): string {
  const lines = output.trim().split("\n").map((line) => line.trim()).filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index] ?? "";
    if (!/^[{}[\],]+$/.test(line)) return line;
  }
  return "";
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
      const report = readJson<{ ok: boolean; shots: number; cues: number; captions: number; warnings: unknown[] }>(
        `build/${id}/audit.json`,
      );
      if (!report) return null;
      return `${report.ok ? "ok" : "FAIL"} · ${report.shots} shots · ${report.cues} cues · ${report.captions} captions${report.warnings.length ? ` · ${report.warnings.length} warnings` : ""}`;
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
    default:
      return null;
  }
}

/** The gate-7 page, read not re-run. */
function readGatePage(): string[] {
  const path = resolve(root, "build", score.id, "gate-7.json");
  if (!existsSync(path)) return ["G7 gate-7     not run"];
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

/** One sheet, the best the film has right now. */
function pickSheet(): string | null {
  const candidates = [
    `build/${score.id}/final-sheet.png`,
    `build/${score.id}/strips/strips.png`,
    `build/${score.id}/stills/stills.png`,
    `build/${score.id}/storyboard/storyboard.png`,
    `build/${score.id}/board/board-sheet.png`,
  ];
  for (const candidate of candidates) {
    if (existsSync(resolve(root, candidate))) return candidate;
  }
  return null;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
