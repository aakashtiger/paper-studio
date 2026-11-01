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
import { videoStreamHash } from "../src/engine/video.js";
import { packFontPath } from "../src/engine/plan.js";
import { scoreDataPath, scoreDataText } from "../src/engine/score-data.js";
import { cueSetText, type SfxRecordLike } from "../src/engine/sfx.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run gate:7 -- <score.json>");
  process.exit(2);
}
const scorePath: string = file;

const root = process.cwd();

/**
 * The bounds the mix contract sets on the master, restated here so the gate
 * reads the report against them. `MASTER_MAX_GAIN` and `LIMITER_MAX_REDUCTION`
 * in `scripts/mix.ts` are the same numbers: the mix refuses a film past them, and
 * the gate refuses a report that claims to be inside them.
 */
const MASTER_MAX_GAIN = 8;
const MASTER_MAX_LIMITING = 8;
/** The delivery ceiling and loudness target `scripts/deliver.ts` holds the file to. */
const DELIVERY_TP = -1.5;
const DELIVERY_LUFS = -14;
const DELIVERY_LUFS_TOLERANCE = 1;
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
function aspectRatio(aspect: string): number {  const [w, h] = aspect.split(":").map(Number);
  return w && h ? w / h : 16 / 9;
}

/** Sample the delivered MP4 every 0.5 s and tile it into one contact sheet. */
async function finalSheet(videoHash: string | null): Promise<{ ok: boolean; detail: string }> {
  const video = resolve(root, "films", score.id, `${score.id}.mp4`);
  if (!existsSync(video)) return { ok: false, detail: `no delivered video at films/${score.id}/${score.id}.mp4` };

  // The sheet is a picture of *this* file. Hash the file the tiles came from
  // rather than repeating the manifest's claim: a sheet labelled with a hash it
  // does not show is a review aid that can be reviewed against the wrong film.
  const measured = videoStreamHash(findFfmpeg(), video);
  const matches = Boolean(videoHash) && measured === videoHash;

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
        videoHash: measured,
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
  return {
    ok: existsSync(sheet) && matches,
    detail: `${files.length} frames every ${step}s on one sheet${matches ? "" : " · the sheet's video is NOT the frozen picture"}`,
  };
}

async function main(): Promise<void> {
  const scoreAudit = read<{ ok: boolean; score?: string }>("audit.json");
  const frames = read<{ pass: boolean; hash: string; videoHash?: string; frameCount: number }>("frame-audit.json");
  const manifest = read<{
    videoHash: string;
    audio?: { path: string; hash: string } | null;
    inputs: {
      score: string | null;
      scoreData: string | null;
      backend: string | null;
      backendPath?: string;
      painter: string | null;
      painterPath?: string;
      poses?: Record<string, string | null>;
    };
  }>("render-manifest.json");
  const determinism = read<{
    pass: boolean;
    mismatches: number;
    frameSetHash: string;
    pictureMatch?: boolean;
    a?: { file: string; hash: string; videoHash: string | null };
    b?: { file: string; hash: string; videoHash: string | null };
  }>("determinism.json");
  const mix = read<{
    passes: boolean;
    measured: { lufs: number; truePeak: number };
    master?: {
      gainDb: number;
      limiterCeiling: number;
      limiterGainReductionDb: number;
      limiterWindows?: { p50: number; p90: number; max: number; over3Db: number; windows: number };
      converged: boolean;
      usedAllPasses: boolean;
    };
    duck?: {
      ok: boolean;
      slackDb: number;
      underSpeech: number;
      short: { id: string; declaredDb: number; appliedDb: number; at: number | null }[];
      overVoice: { id: string; overVoiceDb: number | null }[];
    };
    cueLevels?: { ok: boolean; toleranceDb: number; worst: { id: string; driftDb: number } | null };
    silence?: { ok: boolean; ceilingDb: number; windows: { from: number; to: number; peakDb: number; ok: boolean }[] };
    tail?: { ok: boolean; ceilingDb: number; fromDb: number; endDb: number; monotonic: boolean };
    inputs?: { score: string | null; sfx: string | null; voice: string | null };
    files: { hash: string };
  }>("mix/mix-report.json");
  const sfx = read<{ cues: SfxRecordLike[] }>("sfx/sfx.json");
  const palette = read<{
    pass: boolean;
    maxOutlierFraction: number;
    videoHash: string | null;
    frames?: number;
    expectedFrames?: number;
    clipping?: { pass: boolean; worst: { fraction: number; time: number | null } };
  }>("palette-audit.json");
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
  const deliver = read<{
    ok: boolean;
    source: { path: string; videoHash: string };
    master: { path: string; hash: string; measured: { lufs: number; truePeak: number } };
    output?: {
      path: string;
      fileHash: string;
      videoHash: string;
      audio: { codec: string; limitDb: number; lufs: number; truePeak: number; lra: number };
    };
    checks: { pictureUnchanged: boolean; truePeak: boolean; loudness: boolean };
  }>("deliver.json");

  // The frozen thing is the picture, not the container: the audio is re-cut at
  // delivery, and every video audit is tied to frames that did not move.
  const frozenHash = frames?.videoHash ?? manifest?.videoHash ?? null;

  // `score-data.js` is the score **as the page reads it** — the renderer paints
  // from that file, not from `score.json`. So the gate regenerates it from the
  // score and compares byte for byte: a score edited without `npm run embed`, or
  // a hand-edited `score-data.js`, is a page painting data that is not the
  // contract. Understudy had shipped one stale for exactly that reason.
  const scoreData = (() => {
    const path = scoreDataPath(root, score.id);
    if (!existsSync(path)) return { ok: false, detail: `films/${score.id}/score-data.js is missing` };
    try {
      if (readFileSync(path, "utf8") === scoreDataText(root, scorePath)) {
        return { ok: true, detail: "the page's score data is this score, regenerated byte for byte" };
      }
      return {
        ok: false,
        detail: `STALE — films/${score.id}/score-data.js is not what \`npm run embed\` writes from this score`,
      };
    } catch (error) {
      return {
        ok: false,
        detail: `the score does not resolve, so its page data cannot be regenerated: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  })();

  const checks: Record<string, { ok: boolean; detail: string }> = {
    scoreAudit: {
      // The audit has to describe *this* score: an audit.json from before a
      // score edit would otherwise pass a gate about a film nobody audited.
      ok:
        scoreAudit?.ok === true &&
        scoreAudit?.score === `sha256:${hashFile(resolve(root, scorePath))}`,
      detail: scoreAudit?.ok
        ? scoreAudit.score === `sha256:${hashFile(resolve(root, scorePath))}`
          ? "audited this score"
          : "audited a DIFFERENT score"
        : "no passing audit",
    },
    scoreData,
    frames: { ok: frames?.pass === true, detail: `${frames?.frameCount ?? 0} frames` },
    oneHash: {
      ok: Boolean(frozenHash) && frames?.videoHash === manifest?.videoHash,
      detail: frozenHash ? `${frozenHash.slice(0, 18)}...` : "no hash",
    },
    paintMatch: {
      ok: paint?.pass === true && Boolean(frozenHash) && paint?.videoHash === frozenHash,
      detail: paint
        ? `${paint.sampled} frames, worst ${paint.worst.psnr.toFixed(1)} dB at ${paint.worst.time}s`
        : "no paint-match report",
    },
    inputsHashed: (() => {
      // Hashed *and* still true: a string in a manifest proves nothing if the
      // file it names has moved since. The score is in here for the same reason
      // as the code: a render is a render of one score, and a manifest that
      // names an older one describes a film that no longer exists. The page's
      // data is in here because it is the file the painter actually reads.
      const inputs = manifest?.inputs;
      if (!inputs?.backendPath || !inputs?.painterPath) {
        return { ok: false, detail: "the manifest names no backend or painter path to re-hash" };
      }
      const now = {
        score: `sha256:${hashFile(resolve(root, scorePath))}`,
        scoreData: `sha256:${hashFile(scoreDataPath(root, score.id))}`,
        backend: `sha256:${hashFile(resolve(root, inputs.backendPath))}`,
        painter: `sha256:${hashFile(resolve(root, inputs.painterPath))}`,
      };
      const stale = (Object.keys(now) as (keyof typeof now)[]).filter((key) => inputs[key] !== now[key]);
      return stale.length === 0
        ? { ok: true, detail: "score + page data + backend + painter hashed into the manifest, and re-hashed now" }
        : { ok: false, detail: `MOVED since the render: ${stale.join(", ")} — this picture no longer matches its inputs` };
    })(),
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
        determinism.mismatches === 0 &&
        determinism.a !== undefined &&
        determinism.b !== undefined &&
        // Two renders of the same score are the same bytes, *and* the picture
        // they both produced is the picture this film ships. Byte equality on
        // two copies of one file would pass the first half only.
        determinism.a.hash === determinism.b.hash &&
        determinism.a.videoHash !== null &&
        determinism.a.videoHash === frozenHash,
      detail: determinism
        ? `${determinism.mismatches} mismatched frames between two renders` +
          (determinism.a?.videoHash === frozenHash ? " · same picture as the delivered film" : " · NOT the delivered picture")
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
    // The master's level is not a number to trust, it is a number to read: the
    // reported gain, the true-peak reduction and how that reduction is spread
    // over the film all have to agree with each other and sit inside the bounds
    // the mix contract sets.
    master: {
      ok:
        mix?.master !== undefined &&
        mix.master.gainDb <= MASTER_MAX_GAIN &&
        mix.master.limiterGainReductionDb <= MASTER_MAX_LIMITING &&
        // No default: a report without the distribution is a report this row
        // cannot read, and an unreadable row is a failed row.
        mix.master.limiterWindows !== undefined &&
        mix.master.limiterWindows.p50 <= 1 &&
        mix.master.limiterWindows.windows > 0 &&
        mix.master.converged === true,
      detail: mix?.master
        ? `gain ${mix.master.gainDb >= 0 ? "+" : ""}${mix.master.gainDb.toFixed(1)} dB · limiter up to ${mix.master.limiterGainReductionDb.toFixed(1)} dB, median window ${(mix.master.limiterWindows?.p50 ?? 0).toFixed(2)} dB over ${mix.master.limiterWindows?.windows ?? 0} windows · ${mix.master.usedAllPasses ? "used every pass" : "converged early"}`
        : "no master section in the mix report",
    },
    // A duck the score declares and a duck the bus applies are two different
    // numbers, and only the mix can tell them apart. This row reads the one the
    // signal got.
    duck: {
      ok:
        mix?.duck !== undefined &&
        mix.duck.ok === true &&
        mix.duck.short.length === 0 &&
        mix.duck.overVoice.length === 0,
      detail: mix?.duck
        ? `${mix.duck.underSpeech} cues meet speech, every one at its declared depth` +
          (mix.duck.overVoice.length
            ? ` · ${mix.duck.overVoice.length} sit over the voice: ${mix.duck.overVoice
                .map((cue) => `${cue.id} +${cue.overVoiceDb} dB`)
                .join(", ")}`
            : "")
        : "no duck section in the mix report",
    },
    // The band placed the cue; the bus put it back on the level the score's
    // `gain` asks for. If those disagree, a cue's gain stopped being its level.
    cueLevels: {
      ok: mix?.cueLevels?.ok === true,
      detail: mix?.cueLevels
        ? `worst drift ${Math.abs(mix.cueLevels.worst?.driftDb ?? 0).toFixed(2)} dB from the cue's own level (tolerance ${mix.cueLevels.toleranceDb} dB)`
        : "no cue-level section in the mix report",
    },
    // A declared silence is a claim about the master: measure the master.
    silence: {
      ok:
        mix?.silence !== undefined &&
        mix.silence.ok === true &&
        mix.silence.windows.every((window) => window.ok),
      detail: mix?.silence
        ? mix.silence.windows.length === 0
          ? "no silences declared"
          : mix.silence.windows
              .map((window) => `${window.from}–${window.to}s ${window.peakDb} dBFS`)
              .join(" · ") + ` (ceiling ${mix.silence.ceilingDb} dBFS)`
        : "no silence section in the mix report",
    },
    // The film has to end, not stop: the last half second is measured as a slope.
    tail: {
      ok: mix?.tail !== undefined && mix.tail.ok === true && mix.tail.monotonic === true,
      detail: mix?.tail
        ? `${mix.tail.fromDb} → ${mix.tail.endDb} dBFS over the last 0.5 s${mix.tail.monotonic ? "" : " (RISES)"} (ceiling ${mix.tail.ceilingDb} dBFS)`
        : "no tail section in the mix report",
    },
    // The master is a file on disk; the film is an MP4. This row reads the audio
    // the delivered file actually has, against the same ceiling, and refuses a
    // delivery whose picture is not the frozen one.
    deliveredAudio: {
      ok: (() => {
        if (!deliver || !frozenHash) return false;
        const file = resolve(root, deliver.output?.path ?? "");
        if (!existsSync(file)) return false;
        return (
          deliver.ok === true &&
          deliver.output?.videoHash === frozenHash &&
          deliver.output?.fileHash === `sha256:${hashFile(file)}` &&
          typeof deliver.output?.audio?.truePeak === "number" &&
          deliver.output.audio.truePeak <= DELIVERY_TP &&
          typeof deliver.output.audio.lufs === "number" &&
          Math.abs(deliver.output.audio.lufs - DELIVERY_LUFS) <= DELIVERY_LUFS_TOLERANCE
        );
      })(),
      detail: deliver?.output
        ? `${deliver.output.path} · ${deliver.output.audio.lufs?.toFixed(1)} LUFS / ${deliver.output.audio.truePeak?.toFixed(1)} dBTP measured on the delivered file · picture ${deliver.output.videoHash === frozenHash ? "is the frozen one" : "is NOT the frozen one"}`
        : "no deliver report: run `npm run deliver -- <score>`",
    },
    palette: {
      // One decode, every frame, both answers: the hue outlier count and the
      // clipping count come from the same pass, and a report missing the
      // clipping half is a report this row cannot read.
      ok:
        palette?.pass === true &&
        palette?.clipping?.pass === true &&
        palette?.frames !== undefined &&
        palette.frames === palette.expectedFrames &&
        Boolean(frozenHash) &&
        palette?.videoHash === frozenHash,
      detail: palette
        ? `worst outlier ${(palette.maxOutlierFraction * 100).toFixed(2)}% · worst clipping ${((palette.clipping?.worst.fraction ?? 0) * 100).toFixed(2)}% at ${palette.clipping?.worst.time ?? "?"}s · ${palette.frames ?? 0}/${palette.expectedFrames ?? 0} frames decoded${palette.videoHash === frozenHash ? " · tied to the frozen video" : " · NOT tied to the frozen video"}`
        : "no palette report",
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
  if (pending.length > 0) {
    for (const row of pending) console.log(`todo ${row}`);
  }
  console.log(
    `gate-7: ${pass ? "PASS" : "FAIL"}${pass ? "" : ` (${failed.join(", ")})`} · ${Object.keys(checks).length} checks · ${
      pending.length === 0 ? "nothing manual" : `${pending.length} still manual`
    }`,
  );
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
