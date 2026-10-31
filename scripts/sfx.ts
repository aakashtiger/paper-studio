/**
 * SFX — render the score's foley through the kit, one WAV per cue plus a mix.
 *
 * Every cue is generated in code from its kind and its id (`src/engine/sfx.ts`):
 * no sample library, no randomness, no network. The command also writes the
 * mechanical part of G6 that does not need an ear — the cue is on a frame, its
 * energy is in the band its kind declares, it fades out clean, it is longer than
 * a click and its kind is allowed on a phone speaker — and tiles one spectrogram
 * per cue into a single sheet.
 *
 * A cue names its time once: typed (`at`) or bound to a picture event
 * (`event`). `plan.cues` already has the derived times, so this command and the
 * mix can never disagree about when a cue happens.
 *
 * usage: npm run sfx -- <score.json> [--no-sheet]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { packFontPath } from "../src/engine/plan.js";
import { findFfmpeg, renderGrid, runBinary } from "../src/engine/grid.js";
import {
  checkCue,
  checkCueSet,
  cueSpec,
  effectiveLayers,
  kindBand,
  kindGain,
  kindLength,
  loudMoment,
  renderSfx,
  SFX_GENERATOR,
  SFX_SAMPLE_RATE,
} from "../src/engine/sfx.js";
import type { ResolvedCue } from "../src/engine/audio.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run sfx -- <score.json> [--no-sheet]");
  process.exit(2);
}

const sr = SFX_SAMPLE_RATE;

async function main(scorePath: string): Promise<void> {
  const root = process.cwd();
  const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, scorePath), "utf8")));
  const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }
  const cues = plan.cues;
  if (cues.length === 0) {
    console.log("sfx: no cues");
    return;
  }

  const outDir = resolve(root, "build", score.id, "sfx");
  mkdirSync(outDir, { recursive: true });
  // The directory must describe the current cue set, not a history of it: a
  // stale WAV next to today's would be mixed by an older report and read as
  // today's sound.
  for (const name of readdirSync(outDir)) {
    if (name.endsWith(".wav")) rmSync(join(outDir, name), { force: true });
  }
  const total = Math.ceil((plan.duration + 0.5) * sr);
  const mix = new Float32Array(total * 2);
  const aligned = (value: number): boolean => Math.abs(value * plan.fps - Math.round(value * plan.fps)) <= 0.001;
  const checks: Array<{
    id: string;
    kind: string;
    at: number;
    from: string;
    event: ResolvedCue["event"] | null;
    seconds: number;
    gain: number;
    /** The cue's level after its gain: what the tile's spectrogram cannot show. */
    levelDb: number;
    layers: string[];
    band: [number, number];
    /** What the WAV was rendered from, so the mix can refuse a stale file. */
    spec: string;
    wav: string;
    ok: boolean;
    detail: string;
  }> = [];

  for (const cue of cues) {
    const len = Math.max(1, Math.ceil((cue.duration ?? kindLength(cue.kind)) * sr));
    const samples = renderSfx(cue.kind, len, sr, cue.id, cue.layers);
    const gain = cue.gain ?? kindGain(cue.kind);
    const pan = cue.pan ?? 0;
    const start = Math.round(cue.at * sr);
    const gainL = Math.sqrt(0.5 * (1 - pan));
    const gainR = Math.sqrt(0.5 * (1 + pan));
    for (let i = 0; i < samples.length; i++) {
      const value = (samples[i] ?? 0) * gain;
      const at = (start + i) * 2;
      if (at + 1 < mix.length) {
        mix[at] = (mix[at] ?? 0) + value * gainL;
        mix[at + 1] = (mix[at + 1] ?? 0) + value * gainR;
      }
    }
    writeWav(join(outDir, `${cue.id}.wav`), samples, gain, pan);

    const check = checkCue(cue, samples, sr, aligned);
    checks.push({
      id: cue.id,
      kind: cue.kind,
      at: cue.at,
      from: cue.from,
      event: cue.event ?? null,
      seconds: Number((samples.length / sr).toFixed(3)),
      gain,
      levelDb: Number((20 * Math.log10(loudMoment(samples, sr) * gain + 1e-9)).toFixed(1)),
      layers: effectiveLayers(cue.kind, cue.layers),
      band: cue.band ?? kindBand(cue.kind),
      spec: sha256(cueSpec(cue)),
      wav: `sha256:${sha256(readFileSync(join(outDir, `${cue.id}.wav`)))}`,
      ok: check.ok,
      detail: check.detail,
    });
  }

  let peak = 0;
  for (const value of mix) peak = Math.max(peak, Math.abs(value));
  const norm = peak > 0.9 ? 0.9 / peak : 1;
  for (let i = 0; i < mix.length; i++) mix[i] = (mix[i] ?? 0) * norm;
  writeWav(join(outDir, "mix.wav"), mix, 1, 0, true);

  const failed = checks.filter((check) => !check.ok);
  const setIssues = checkCueSet(cues.map((cue) => ({ id: cue.id, kind: cue.kind, at: cue.at, duration: cue.duration })));
  writeFileSync(
    join(outDir, "sfx.json"),
    `${JSON.stringify(
      {
        film: score.id,
        generator: SFX_GENERATOR,
        sampleRate: sr,
        inputs: { score: `sha256:${sha256(readFileSync(resolve(root, scorePath)))}` },
        cues: checks,
        set: setIssues,
        pass: failed.length === 0 && setIssues.length === 0,
        files: {
          mix: `build/${score.id}/sfx/mix.wav`,
          cues: cues.map((cue) => `build/${score.id}/sfx/${cue.id}.wav`),
        },
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`sfx: ${cues.length} cues → build/${score.id}/sfx/mix.wav`);
  for (const check of checks) {
    console.log(`  ${check.ok ? "ok  " : "FAIL"} ${check.id.padEnd(14)} ${check.detail}${check.from === "event" ? ` · ${check.event?.shot} event ${check.event?.index}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`sfx: ${failed.length} cue${failed.length === 1 ? "" : "s"} failed the kit checks`);
  }
  for (const issue of setIssues) console.error(`  FAIL ${issue.code}  ${issue.message}`);
  if (failed.length > 0 || setIssues.length > 0) process.exit(1);

  if (!args.includes("--no-sheet")) {
    const levels = new Map(checks.map((check) => [check.id, check.levelDb]));
    await spectrogramSheet(root, score.id, score.style, outDir, cues, levels);
  }
}

/**
 * G6 asks for a spectrogram per cue on one image. ffmpeg's `showspectrumpic`
 * turns each generated cue into a time x frequency picture; the one grid helper
 * tiles them, labelled with the cue, where its time came from, and **its
 * measured level** — a spectrogram normalises its own colour scale, so the
 * picture alone can never tell you whether a cue is loud or quiet.
 */
async function spectrogramSheet(
  root: string,
  filmId: string,
  style: string,
  outDir: string,
  cues: ResolvedCue[],
  levels: Map<string, number>,
): Promise<void> {
  const framesDir = join(outDir, "spectrograms");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  const ffmpeg = findFfmpeg();
  const tileW = 480;
  const tileH = 200;
  const tiles: { image: string; label: string }[] = [];
  for (const cue of cues) {
    const wav = resolve(outDir, `${cue.id}.wav`);
    if (!existsSync(wav)) continue;
    const image = join(framesDir, `${cue.id}.png`);
    await runBinary(
      ffmpeg,
      ["-y", "-hide_banner", "-loglevel", "error", "-i", wav, "-lavfi", `showspectrumpic=s=${tileW}x${tileH}:legend=0`, "-frames:v", "1", image],
      { cwd: root },
    );
    if (!existsSync(image)) throw new Error(`no spectrogram for cue ${cue.id}`);
    const where = cue.from === "event" && cue.event ? ` · ${cue.event.shot}#${cue.event.index}` : "";
    const level = levels.get(cue.id);
    tiles.push({
      image,
      label: `${cue.id} · ${cue.kind} @ ${cue.at.toFixed(2)}s${where}${level === undefined ? "" : ` · ${level} dBFS`}`,
    });
  }
  if (tiles.length === 0) return;

  const sheet = join(outDir, "spectrogram-sheet.png");
  const grid = await renderGrid({
    root,
    out: sheet,
    tiles,
    tileWidth: tileW,
    tileHeight: tileH,
    font: packFontPath(root, style, "caption"),
    labelDir: `build/${filmId}/sfx/labels`,
  });
  writeFileSync(
    join(outDir, "spectrogram.json"),
    `${JSON.stringify(
      {
        film: filmId,
        cues: tiles.length,
        sheet: `build/${filmId}/sfx/spectrogram-sheet.png`,
        grid: { cols: grid.cols, rows: grid.rows, width: grid.width, height: grid.height },
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`sfx: spectrogram sheet ${grid.cols}×${grid.rows} → build/${filmId}/sfx/spectrogram-sheet.png`);
}

main(file).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

function writeWav(path: string, samples: Float32Array, gain: number, pan: number, stereo = false): void {
  const channels = stereo ? 2 : 1;
  const length = samples.length * 2;
  const buffer = Buffer.alloc(44 + length);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + length, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sr, 24);
  buffer.writeUInt32LE(sr * channels * 2, 28);
  buffer.writeUInt16LE(channels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(length, 40);
  let offset = 44;
  if (!stereo) {
    for (let i = 0; i < samples.length; i++) {
      const value = samples[i] ?? 0;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * gain)) * 32767), offset);
      offset += 2;
    }
  } else {
    for (let i = 0; i < samples.length; i += 2) {
      const left = samples[i] ?? 0;
      const right = samples[i + 1] ?? 0;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left)) * 32767), offset); offset += 2;
      buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right)) * 32767), offset); offset += 2;
    }
  }
  writeFileSync(path, buffer);
}

/** sha256 of a buffer or of a string (hex digest). */
function sha256(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}
