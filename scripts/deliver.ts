/**
 * Final delivery: mux the measured master into the frozen picture.
 *
 * The picture and the sound are two artefacts with two lifetimes. A look pass
 * re-cuts the audio and must not re-render 900 frames; a picture fix must not
 * move the master. So this step copies the **video stream** (no re-encode) and
 * encodes the master beside it, then measures the *delivered file's own audio* —
 * not the master's.
 *
 * That last part is the reason the step exists. The AAC encoder overshoots the
 * master's true peak (Understudy: -1.9 dBTP in, -0.6 dBTP out), so a master that
 * passes the mix contract can still ship out of contract. A peak limiter on the
 * encode brings the *file* inside the ceiling without turning the film down, and
 * the measurement is written next to the file hash so `gate:7` reads the number
 * the file actually has.
 *
 * usage: npm run deliver -- films/understudy/score.json [--video <mp4>] [--out <mp4>]
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { measureLoudness, runFfmpeg } from "../src/engine/loudness.js";
import { readRenderManifest } from "../src/engine/manifest.js";
import { fileHash, findFfmpeg, videoStreamHash } from "../src/engine/video.js";

/** The delivery ceiling. The same -1.5 dBTP the mix master targets. */
const DELIVERY_TP = -1.5;
/** True peaks at the ceiling are one rounded sample away from over it. */
const DELIVERY_MARGIN = 0.2;
const TARGET_LUFS = -14;
const LUFS_TOLERANCE = 1;
/** Each pass costs one AAC encode; the overshoot converges in one or two. */
const MAX_PASSES = 4;
/** The first limiter ceiling, in dBFS of sample peak: room for the first overshoot. */
const DELIVERY_LIMIT_DB = -2.5;
/** Past this the limiter is paying for the encoder with the film's own peaks. */
const DELIVERY_LIMIT_FLOOR_DB = -6;
/**
 * The limiter's envelope, and the reason it is this fast.
 *
 * A 5 ms attack with a 50 ms release is a *compressor* in disguise: it rides
 * the gain over every loud syllable instead of catching the few samples the
 * encode rings on, and the delivered file's words stop being words. Measured on
 * Understudy's last line, the same master and the same 192k AAC encode:
 *
 *   no limiter            → "The crowd never knew."
 *   attack 5 ms/rel 50 ms → "I've never knew."   (at −2.5 dB and at −1.0 dB)
 *   attack 1 ms/rel 10 ms → "The crowd never knew."
 *
 * The threshold made no difference; the envelope did. So the delivery limiter is
 * a peak limiter: 1 ms attack, 10 ms release, and `gate:7`'s ASR row listens to
 * the delivered file to prove the words survived the encode.
 */
const DELIVERY_LIMIT_ATTACK_MS = 1;
const DELIVERY_LIMIT_RELEASE_MS = 10;

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const root = process.cwd();
const file = process.argv.slice(2).find((value) => !value.startsWith("--"));
if (!file) {
  console.error("usage: npm run deliver -- <score.json> [--video <mp4>] [--out <mp4>]");
  process.exit(2);
}

const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const { plan, errors } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const ffmpeg = findFfmpeg(root);
const buildDir = resolve(root, "build", score.id);
const out = resolve(root, arg("out") ?? resolve("films", score.id, `${score.id}.mp4`));
const source = resolve(
  root,
  arg("video") ?? resolve(root, "films", score.id, `${score.id}.mp4`),
);

// ---------------------------------------------------------------- provenance
const mixPath = resolve(buildDir, "mix", "mix-report.json");
if (!existsSync(mixPath)) {
  console.error("error: no mix report; run: npm run mix -- " + file);
  process.exit(1);
}
const mix = JSON.parse(readFileSync(mixPath, "utf8")) as {
  passes: boolean;
  measured: { lufs: number; truePeak: number };
  files: { master: string; hash: string };
};
if (!mix.passes) {
  console.error("error: the mix report does not pass; fix the mix before delivering it");
  process.exit(1);
}
const master = resolve(root, mix.files.master);
if (!existsSync(master)) {
  console.error(`error: the mix report names ${mix.files.master}, which is not there`);
  process.exit(1);
}
// The master on disk has to be the master the mix measured. A re-run of `mix`
// after the report would otherwise deliver an unmeasured file under a measured
// hash.
if (mix.files.hash !== fileHash(master)) {
  console.error("error: build/<id>/mix/master.wav changed since the mix measured it; run: npm run mix -- " + file);
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`error: no picture at ${source}; render it first`);
  process.exit(1);
}
const pictureHash = videoStreamHash(ffmpeg, source);

// The render wrote down what it painted from. Delivering a picture the manifest
// does not describe would put measured audio into a film nobody recorded the
// provenance of, so it is refused here rather than explained later.
const manifest = await readRenderManifest(root, score.id);
if (manifest === null) {
  console.error(
    "error: no build/" + score.id + "/render-manifest.json; the picture was not produced by `npm run render:film`",
  );
  process.exit(1);
}
if (manifest.videoHash !== pictureHash) {
  console.error(
    `error: ${relative(source)} is not the picture the render wrote (${manifest.videoHash.slice(0, 19)}...); ` +
      "the manifest describes a different render",
  );
  process.exit(1);
}

// ------------------------------------------------------------------- encode
const target = DELIVERY_TP - DELIVERY_MARGIN;
// Encode beside the deliverable and move it into place: `source` is often the
// same path as `out`, and ffmpeg truncates its output before it reads its input.
const outTmp = out.replace(/\.mp4$/i, "") + ".deliver.tmp.mp4";
/**
 * The file is brought under the true-peak ceiling with a **peak limiter**, not a
 * gain.
 *
 * The first version turned the whole file down by the overshoot. That passes the
 * peak check and quietly changes the film: 1.1 dB of gain took Understudy from
 * -14.2 to -15.3 LUFS, outside the -14 ± 1 the delivery asks for — two bounds,
 * one knob, no solution. The overshoot is a *peak* problem (AAC rings above the
 * source's true peak), so it gets a peak solution: limit only the loudest
 * samples, leave the programme where the mix put it. The limit starts generous
 * and tightens by the measured overshoot; the report records the limit and the
 * measured result.
 */
let limitDb = DELIVERY_LIMIT_DB;
let delivered: { lufs: number; truePeak: number; lra: number } | null = null;
let pass = 0;
for (; pass < MAX_PASSES; pass++) {
  runFfmpeg(ffmpeg, [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    source,
    "-i",
    master,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-af",
    `alimiter=limit=${(10 ** (limitDb / 20)).toFixed(4)}:attack=${DELIVERY_LIMIT_ATTACK_MS}:release=${DELIVERY_LIMIT_RELEASE_MS}:level=disabled`,
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-ar",
    "48000",
    "-shortest",
    "-movflags",
    "+faststart",
    outTmp,
  ]);
  delivered = measureLoudness(ffmpeg, outTmp);
  const over = delivered.truePeak - target;
  if (over <= 0) break;
  // Tighten by the measured overshoot. Below this floor the limiter would be
  // mangling the film to pay for the encoder, and a mix that needs it is a mix
  // to fix, so the loop stops and the checks report the real numbers.
  const next = limitDb - Math.max(0.2, over);
  if (next < DELIVERY_LIMIT_FLOOR_DB) break;
  limitDb = next;
}
if (!delivered) throw new Error("no delivery pass produced a file");

renameSync(outTmp, out);
const streamHash = videoStreamHash(ffmpeg, out);
const pictureOk = streamHash === pictureHash;
const peakOk = delivered.truePeak <= DELIVERY_TP;
const lufsOk = Math.abs(delivered.lufs - TARGET_LUFS) <= LUFS_TOLERANCE;
const ok = pictureOk && peakOk && lufsOk;

const report = {
  film: score.id,
  ok,
  passes: pass + 1,
  source: { path: relative(source), videoHash: pictureHash },
  master: { path: mix.files.master, hash: mix.files.hash, measured: mix.measured },
  output: {
    path: relative(out),
    fileHash: fileHash(out),
    videoHash: streamHash,
    /** The delivered audio, measured on the delivered file. */
    audio: {
      codec: "aac",
      /** The limiter ceiling the delivery settled on, in dBFS of sample peak. */
      limitDb: Number(limitDb.toFixed(2)),
      lufs: delivered.lufs,
      truePeak: delivered.truePeak,
      lra: delivered.lra,
    },
  },
  checks: { pictureUnchanged: pictureOk, truePeak: peakOk, loudness: lufsOk },
  // Two bounds that one knob cannot fix: if the peak is inside after limiting,
  // and the loudness is still outside, the master's crest does not fit the
  // delivery window and the mix is what has to change. Naming it stops the next
  // person from "fixing" it by turning the film down.
  conflict:
    peakOk && !lufsOk
      ? `the peak fits inside ${DELIVERY_TP} dBTP but loudness ${delivered.lufs.toFixed(1)} LUFS is outside ${TARGET_LUFS} ± ${LUFS_TOLERANCE}; no delivery level satisfies both — fix the mix's crest`
      : null,
  generatedAt: new Date().toISOString(),
};
mkdirSync(buildDir, { recursive: true });
writeFileSync(resolve(buildDir, "deliver.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
// The full hash beside the delivered file, so it can be read without opening
// JSON or trusting a truncated console line.
const shaPath = out.replace(/\.mp4$/i, ".sha256");
writeFileSync(shaPath, `video ${streamHash}\nfile ${fileHash(out)}\n`, "utf8");

// `render-manifest.json` is **not** touched here. It is the render's record of
// what it painted from, and the renderer is its only writer; a second writer
// made `videoFileHash` name a file that no longer existed. The delivered audio
// is recorded above, in `deliver.json`, which is this step's own report.

console.log(`deliver: ${report.output.path}`);
console.log(
  `picture: ${pictureOk ? "unchanged" : "CHANGED"} (${streamHash.slice(0, 19)}…) from ${report.source.path}`,
);
console.log(
  `audio: ${delivered.lufs.toFixed(1)} LUFS · ${delivered.truePeak.toFixed(1)} dBTP ` +
    `after ${report.passes} encode pass(es), peak limited to ${report.output.audio.limitDb.toFixed(2)} dBFS`,
);
if (!pictureOk) {
  console.error("error: the delivered video stream is not the source picture; the mux re-encoded it");
}
if (!peakOk) {
  console.error(`error: the delivered true peak is ${delivered.truePeak.toFixed(1)} dBTP, over ${DELIVERY_TP} dBTP`);
}
if (!lufsOk) {
  console.error(`error: the delivered loudness is ${delivered.lufs.toFixed(1)} LUFS, outside ${TARGET_LUFS} ± ${LUFS_TOLERANCE}`);
}
if (!ok) process.exit(1);

function relative(path: string): string {
  return path.replace(root + "\\", "").replace(root + "/", "").replace(/\\/g, "/");
}
