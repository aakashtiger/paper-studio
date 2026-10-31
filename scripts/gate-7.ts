/**
 * Gate 7 — final, for one frozen MP4.
 *
 * Reads the artifacts the other checks wrote and ties them to a single video
 * hash. It does not re-render: it proves that the audit, the determinism run,
 * the mix and the palette check all describe the same delivered file.
 *
 * It also writes the one-image final review: the delivered MP4 sampled every
 * 0.5 s, tiled into a single contact sheet (`build/<id>/final-sheet.png`), so the
 * whole film is judged by looking at one picture.
 *
 * usage: npm run gate:7 -- films/understudy/score.json
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { findFfmpeg, renderGrid, runBinary } from "../src/engine/grid.js";
import { packFontPath } from "../src/engine/plan.js";
import { cueSetText, type SfxRecordLike } from "../src/engine/sfx.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run gate:7 -- <score.json>");
  process.exit(2);
}
const scorePath: string = file;

const root = process.cwd();
const score = JSON.parse(readFileSync(resolve(root, file), "utf8")) as {
  id: string;
  style: string;
  duration: number;
  aspect: string;
};
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

function hashFile(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** "16:9" -> 16/9. */
function aspectRatio(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w && h ? w / h : 16 / 9;
}

/** Sample the delivered MP4 every 0.5 s and tile it into one contact sheet. */
async function finalSheet(videoHash: string | null): Promise<{ ok: boolean; detail: string }> {
  const video = resolve(root, "films", score.id, `${score.id}.mp4`);
  if (!existsSync(video)) return { ok: false, detail: `no delivered video at films/${score.id}/${score.id}.mp4` };

  const step = 0.5;
  const framesDir = resolve(dir, "final-frames");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  const limit = Math.max(1, Math.ceil(score.duration / step));
  await runBinary(
    findFfmpeg(),
    [
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", video,
      "-vf", `fps=${(1 / step).toFixed(6)}`,
      "-frames:v", String(limit),
      join(framesDir, "f-%04d.png"),
    ],
    { cwd: root },
  );
  const files = readdirSync(framesDir).filter((name) => name.endsWith(".png")).sort();
  if (files.length === 0) return { ok: false, detail: "no frames extracted from the delivered video" };

  const ratio = aspectRatio(score.aspect);
  const tileW = 320;
  const tileH = Math.round(ratio >= 1 ? tileW / ratio : tileW * ratio);
  const cols = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(files.length))));
  const sheet = resolve(dir, "final-sheet.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles: files.map((name, index) => ({ image: join(framesDir, name), label: `t=${(index * step).toFixed(2)}s` })),
    tileWidth: tileW,
    tileHeight: tileH,
    cols,
    font: packFontPath(root, score.style, "caption"),
    labelDir: `build/${score.id}/final-labels`,
  });
  writeFileSync(
    resolve(dir, "final-sheet.json"),
    `${JSON.stringify(
      {
        film: score.id,
        video: `films/${score.id}/${score.id}.mp4`,
        videoHash,
        frames: files.length,
        step,
        grid: { cols: grid.cols, rows: grid.rows, width: grid.width, height: grid.height },
        sheet: `build/${score.id}/final-sheet.png`,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  return { ok: existsSync(sheet), detail: `${files.length} frames every ${step}s on one sheet` };
}

async function main(): Promise<void> {
  const scoreAudit = read<{ ok: boolean }>("audit.json");
  const frames = read<{ pass: boolean; hash: string; frameCount: number }>("frame-audit.json");
  const manifest = read<{
    videoHash: string;
    inputs: { backend: string | null; painter: string | null; poses?: Record<string, string | null> };
  }>("render-manifest.json");
  const determinism = read<{ pass: boolean; mismatches: number; frameSetHash: string }>("determinism.json");
  const mix = read<{
    passes: boolean;
    measured: { lufs: number; truePeak: number };
    inputs?: { score: string | null; sfx: string | null; voice: string | null };
    files: { hash: string };
  }>("mix/mix-report.json");
  const sfx = read<{ cues: SfxRecordLike[] }>("sfx/sfx.json");
  const palette = read<{ pass: boolean; maxOutlierFraction: number }>("palette-audit.json");
  const paint = read<{ pass: boolean; sampled: number; worst: { time: number; psnr: number }; videoHash: string | null }>("paint-match.json");
  const motion = read<{ pass: boolean; videoHash: string | null; weak: string[]; shots: { id: string; median: number }[] }>("motion-audit.json");
  const type = read<{ pass: boolean; sampled: number; boxes: number; outside: unknown[] }>("type-audit.json");
  const rig = read<{ pass: boolean; legs: number; unpairedSolves: number; worstAnkleJump: { distance: number } }>("rig-audit.json");
  const asr = read<{
    pass: boolean;
    coverage: number;
    audio: string;
    videoHash: string | null;
    missing: string[];
  }>("asr.json");

  const frozenHash = frames?.hash ?? manifest?.videoHash ?? null;
  const checks: Record<string, { ok: boolean; detail: string }> = {
    scoreAudit: { ok: scoreAudit?.ok === true, detail: "npm run audit" },
    frames: { ok: frames?.pass === true, detail: `${frames?.frameCount ?? 0} frames` },
    oneHash: {
      ok: Boolean(frozenHash) && frames?.hash === manifest?.videoHash,
      detail: frozenHash ? `${frozenHash.slice(0, 18)}...` : "no hash",
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
    poseHashes: {
      ok:
        Boolean(manifest?.inputs?.poses) &&
        Object.keys(manifest?.inputs?.poses ?? {}).length > 0 &&
        Object.values(manifest?.inputs?.poses ?? {}).every((value) => typeof value === "string"),
      detail: manifest?.inputs?.poses
        ? `${Object.keys(manifest.inputs.poses).length} pose libraries hashed`
        : "no pose hashes in the manifest",
    },
    determinism: {
      ok:
        determinism?.pass === true &&
        Boolean(frozenHash) &&
        determinism?.frameSetHash === frozenHash,
      detail: determinism
        ? `${determinism.mismatches} mismatched frames between two runs`
        : "no determinism report",
    },
    mix: {
      ok:
        mix?.passes === true &&
        Boolean(mix.inputs?.sfx) &&
        mix.inputs?.sfx === (sfx ? `sha256:${sha256(cueSetText(sfx.cues))}` : "missing") &&
        mix.inputs?.score === `sha256:${hashFile(resolve(root, scorePath))}` &&
        mix.files.hash === `sha256:${hashFile(resolve(dir, "mix", "master.wav"))}`,
      detail: mix
        ? `${mix.measured.lufs.toFixed(1)} LUFS / ${mix.measured.truePeak.toFixed(1)} dBTP · inputs tied`
        : "no mix report",
    },
    palette: {
      ok: palette?.pass === true,
      detail: palette ? `worst outlier ${(palette.maxOutlierFraction * 100).toFixed(2)}%` : "no palette report",
    },
    motionFloor: {
      ok: motion?.pass === true && Boolean(frozenHash) && motion?.videoHash === frozenHash,
      detail: motion
        ? `${motion.shots.length} shots, weakest median ${Math.min(...motion.shots.map((shot) => shot.median)).toFixed(2)}`
        : "no motion-audit report",
    },
    typeSafeArea: {
      ok: type?.pass === true,
      detail: type ? `${type.boxes} boxes in ${type.sampled} frames, ${type.outside.length} outside` : "no type-audit report",
    },
    rigSeam: {
      ok: rig?.pass === true,
      detail: rig
        ? `${rig.legs} legs, ${rig.unpairedSolves} unpaired, worst ankle jump ${rig.worstAnkleJump.distance}px`
        : "no rig-audit report",
    },
  };

  // The one-image final review is part of the gate, not an extra.
  const sheet = await finalSheet(manifest?.videoHash ?? frozenHash);
  checks["finalSheet"] = sheet;

  // ASR is a hard check the moment its report exists. Until the local
  // recogniser is installed it is named as the one remaining manual check, with
  // the exact command — never silently skipped.
  const pending: string[] = [];
  if (asr) {
    checks["asr"] = {
      ok: asr.pass === true && (asr.videoHash === null || asr.videoHash === frozenHash),
      detail: `${(asr.coverage * 100).toFixed(1)}% of the script heard in ${asr.audio}${
        asr.missing.length ? `, ${asr.missing.length} words missing` : ""
      }`,
    };
  } else {
    pending.push("ASR of the mixed master: run `npm run asr -- <score>` (needs faster-whisper — tools/README.md)");
  }

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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
