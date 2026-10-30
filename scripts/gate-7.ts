/**
 * Gate 7 — final, for one frozen MP4.
 *
 * Reads the artifacts the other checks wrote and ties them to a single video
 * hash. It does not re-render: it proves that the audit, the determinism run,
 * the mix and the palette check all describe the same delivered file.
 *
 * usage: npm run gate:7 -- films/understudy/score.json
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run gate:7 -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = JSON.parse(readFileSync(resolve(root, file), "utf8")) as { id: string };
const dir = resolve(root, "build", score.id);

function read<T>(name: string): T | null {
  const path = resolve(dir, name);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

const scoreAudit = read<{ ok: boolean }>("audit.json");
const frames = read<{ pass: boolean; hash: string; frameCount: number }>("frame-audit.json");
const manifest = read<{ videoHash: string; inputs: { backend: string | null; painter: string | null } }>("render-manifest.json");
const determinism = read<{ pass: boolean; mismatches: number }>("determinism.json");
const mix = read<{ passes: boolean; measured: { lufs: number; truePeak: number }; files: { hash: string } }>("mix/mix-report.json");
const palette = read<{ pass: boolean; maxOutlierFraction: number }>("palette-audit.json");
const paint = read<{ pass: boolean; sampled: number; worst: { time: number; psnr: number }; videoHash: string | null }>("paint-match.json");

const frozenHash = frames?.hash ?? manifest?.videoHash ?? null;
const checks: Record<string, { ok: boolean; detail: string }> = {
  scoreAudit: { ok: scoreAudit?.ok === true, detail: "npm run audit" },
  frames: { ok: frames?.pass === true, detail: `${frames?.frameCount ?? 0} frames` },
  oneHash: {
    ok: Boolean(frozenHash) && frames?.hash === manifest?.videoHash,
    detail: frozenHash ? `${frozenHash.slice(0, 18)}…` : "no hash",
  },
  paintMatch: {
    ok: paint?.pass === true && Boolean(frozenHash) && paint?.videoHash === frozenHash,
    detail: paint
      ? `${paint.sampled} frames, worst ${paint.worst.psnr.toFixed(1)} dB at ${paint.worst.time}s`
      : "no paint-match report",
  },
  inputsHashed: {
    ok: Boolean(manifest?.inputs?.backend && manifest?.inputs?.painter),
    detail: "backend + painter hashed into the manifest",
  },
  determinism: {
    ok: determinism?.pass === true,
    detail: `${determinism?.mismatches ?? "?"} mismatched frames between two runs`,
  },
  mix: {
    ok: mix?.passes === true,
    detail: mix ? `${mix.measured.lufs.toFixed(1)} LUFS / ${mix.measured.truePeak.toFixed(1)} dBTP` : "no mix report",
  },
  palette: {
    ok: palette?.pass === true,
    detail: palette ? `worst outlier ${(palette.maxOutlierFraction * 100).toFixed(2)}%` : "no palette report",
  },
};

const pending = [
  "type-safe-area: not mechanical yet (needs text boxes from the board)",
  "rig-seam: not mechanical on the delivered frames yet",
  "ASR of the mixed master: no offline recogniser wired in",
  "motioncheck: the motion floor is judged by the critics, not measured",
];

const failed = Object.entries(checks).filter(([, value]) => !value.ok).map(([name]) => name);
const pass = failed.length === 0;
const report = {
  film: score.id,
  gate: "G7",
  frozenVideoHash: frozenHash,
  checks,
  failed,
  pending,
  pass,
  generatedAt: new Date().toISOString(),
};
writeFileSync(resolve(dir, "gate-7.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

for (const [name, value] of Object.entries(checks)) {
  console.log(`${value.ok ? "ok  " : "FAIL"} ${name.padEnd(14)} ${value.detail}`);
}
console.log(`gate-7: ${pass ? "PASS" : "FAIL"}${pass ? "" : ` (${failed.join(", ")})`} · ${pending.length} checks still manual`);
if (!pass) process.exit(1);
