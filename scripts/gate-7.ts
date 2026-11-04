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
import { FilmBriefSchema, mustSayGaps } from "../src/engine/film-brief.js";
import { StorySchema, BeatsSchema, checkStory, checkNarrationSync } from "../src/engine/story.js";
import { ScenesSchema, checkScenes } from "../src/engine/scenes.js";
import { inputMismatches, type RenderInputs } from "../src/engine/manifest.js";
import { checkTwinEvidence, type TwinEvidence } from "../src/engine/determinism.js";
/**
 * The bounds the mix contract sets on the master come from `loudness.ts`, not
 * from a copy here. The mix refuses a film past them and the gate refuses a
 * report that claims to be inside them; when both files restated the numbers
 * they drifted, and the gate was holding a bound the mix no longer had.
 */
import { LIMITER_MAX_REDUCTION as MASTER_MAX_LIMITING, MASTER_MAX_GAIN } from "../src/engine/loudness.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run gate:7 -- <score.json>");
  process.exit(2);
}
const scorePath: string = file;

const root = process.cwd();

/** The delivery ceiling and loudness target `scripts/deliver.ts` holds the file to. */
const DELIVERY_TP = -1.5;
const DELIVERY_LUFS = -14;
const DELIVERY_LUFS_TOLERANCE = 1;
const score = JSON.parse(readFileSync(resolve(root, file), "utf8")) as {
  id: string;
  style: string;
  duration: number;
  aspect: string;
  clock?: { lines?: { id: string; text: string; start: number; duration: number }[] };
  shots?: { slots?: Record<string, string> }[];
  cast?: { character: string }[];
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

  // Windows hands a spawned process about 32,000 characters of command line, and
  // `renderGrid` puts one `-i` and one filter chain per tile on it: 120 tiles is
  // ~44,000 characters and `spawn` refuses it (ENAMETOOLONG), which is how this
  // row failed on the first 60 s film after passing on a 30 s one. The sheet is a
  // review aid, so it samples the film rather than every half second: at most 40
  // tiles, which still shows every shot and keeps the command line at ~15,000.
  // The row's claim is unchanged — the hash is measured from the file the tiles
  // came from.
  const step = Math.max(0.5, Math.ceil((score.duration / 40) * 2) / 2);
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
    videoFileHash?: string;
    audio?: { path: string; hash: string } | null;
    inputs: RenderInputs;
  }>("render-manifest.json");
  const determinism = read<TwinEvidence>("determinism.json");
  const mix = read<{
    passes: boolean;
    measured: { lufs: number; truePeak: number; lra?: number };
    shortTerm?: { contrastLu: number; loudest: number; quietest: number; windows: number };
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
    undeclaredHoles?: {
      ok: boolean;
      minSeconds: number;
      ceilingDb: number;
      found: { from: number; to: number; seconds: number; peakDb: number }[];
    };
    roomUnderLines?: {
      ok: boolean;
      endedInLine: { cue: string; line: string; endsAt: number; lineEndsAt: number }[];
    };
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
  const type = read<{
    pass: boolean;
    score?: string;
    sampled: number;
    boxes: number;
    copyBoxes?: number;
    floor?: { px: number };
    outside: unknown[];
    belowFloor?: unknown[];
  }>("type-audit.json");
  const rig = read<{
    pass: boolean;
    score?: string;
    legs: number;
    unpairedSolves: number;
    worstAnkleJump: { distance: number };
    anchors?: number;
    anchorPairs?: number;
    anchoredCharacters?: string[];
    worstSeamShift?: { units: number; limit: number };
    expectsCast?: boolean;
  }>("rig-audit.json");
  const asr = read<{
    pass: boolean;
    coverage: number;
    audio: string;
    audioHash: string;
    pictureHash: string | null;
    unmatched: { word: string; heard: string | null }[];
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
    preflight: (() => {
      const report = read<{
        ok: boolean;
        score: string;
        identity?: { pass: boolean; findings: { code: string; message: string }[] };
      }>("preflight.json");
      const current = `sha256:${hashFile(resolve(root, scorePath))}`;
      if (!report) return { ok: false, detail: "no preflight report" };
      if (report.score !== current) return { ok: false, detail: "preflight describes a different score" };
      if (!report.identity) return { ok: false, detail: "preflight has no identity section" };
      if (!report.identity.pass) {
        return {
          ok: false,
          detail: `${report.identity.findings.length} identity finding(s): ${report.identity.findings[0]?.message ?? "see preflight.json"}`,
        };
      }
      if (!report.ok) return { ok: false, detail: "preflight refused the film" };
      return { ok: true, detail: "score, cast and identity pass before the paint" };
    })(),
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
      // file it names has moved since. **Every** input is re-hashed, not a
      // hand-picked four: the vendor scripts draw every body and every word, the
      // fonts shape every glyph, the pose libraries are cast data, and the page
      // and captions are files the film is made of. `inputMismatches` is the one
      // rule, so the gate and its test check the same list.
      if (!manifest?.inputs) return { ok: false, detail: "no inputs in the manifest to re-hash" };
      const stale = inputMismatches(manifest.inputs, (path) => {
        const absolute = resolve(root, path);
        return existsSync(absolute) ? `sha256:${hashFile(absolute)}` : null;
      });
      const count = manifest.inputs.files.length;
      return stale.length === 0
        ? { ok: true, detail: `${count} inputs re-hashed now: score, page data, backend, painter, page, captions, ${count - 6} more (vendor, fonts, poses)` }
        : {
            ok: false,
            detail: `MOVED since the render: ${stale.join(", ")} — this picture no longer matches its ${count} inputs`,
          };
    })(),
    writing: (() => {      // The writing is not a note beside the film; it is an input the render
      // hashed. A delivered picture whose script was deleted or rewritten no
      // longer proves what it was made from (0047). The row re-runs the three
      // writing checks against the score's own clock and cast.
      const filmDir = resolve(root, "films", score.id);
      const docs = ["story.json", "beats.json", "scenes.json"];
      const missing = docs.filter((name) => !existsSync(join(filmDir, name)));
      if (missing.length > 0) {
        return { ok: false, detail: `missing ${missing.join(", ")} — the film cannot prove what it was written from` };
      }
      if (!manifest?.inputs) {
        return { ok: false, detail: "no inputs in the render manifest — the writing was not hashed by the render" };
      }
      const unhashed = docs.filter((name) => {
        const path = `films/${score.id}/${name}`;
        return !manifest.inputs.files.some(
          (input) => input.path === path && input.hash === `sha256:${hashFile(join(filmDir, name))}`,
        );
      });
      if (unhashed.length > 0) {
        return { ok: false, detail: `${unhashed.join(", ")} not hashed into the render manifest` };
      }
      try {
        const story = StorySchema.parse(JSON.parse(readFileSync(join(filmDir, "story.json"), "utf8").replace(/^\uFEFF/, "")));
        const beats = BeatsSchema.parse(JSON.parse(readFileSync(join(filmDir, "beats.json"), "utf8").replace(/^\uFEFF/, "")));
        const scenes = ScenesSchema.parse(JSON.parse(readFileSync(join(filmDir, "scenes.json"), "utf8").replace(/^\uFEFF/, "")));
        const storyCheck = checkStory(story, beats);
        const sceneCheck = checkScenes(
          scenes,
          story,
          beats,
          score.clock?.lines ?? null,
          (score.cast ?? []).map((member) => member.character),
        );
        const sync = score.clock?.lines ? checkNarrationSync(story, score.clock.lines) : [];
        const errors = [...storyCheck.errors, ...sceneCheck.errors, ...sync];
        if (errors.length > 0) {
          return {
            ok: false,
            detail: `${errors.length} writing error(s): ${errors.slice(0, 3).map((error) => error.message).join("; ")}`,
          };
        }
        return {
          ok: true,
          detail: `story, beats and scenes re-read and hashed: ${storyCheck.report.words} words, ${storyCheck.report.beats.length} beats, ${scenes.scenes.length} scenes`,
        };
      } catch (error) {
        return { ok: false, detail: error instanceof Error ? error.message : "writing check failed" };
      }
    })(),
    visual: (() => {      // The picture must have been asked for before it was painted. The report
      // is tied to the score and lists the brief, the recipe match and the
      // scene/shot link; the render refuses without it, and the gate re-reads it.
      const report = read<{
        pass: boolean;
        score: string;
        checked: number;
        shots: number;
        findings: { code: string; message: string }[];
      }>("visual-check.json");
      const current = `sha256:${hashFile(resolve(root, scorePath))}`;
      if (!report) return { ok: false, detail: "no visual check — run `npm run visual:check -- <score>`" };
      if (report.score !== current) return { ok: false, detail: "the visual check measured a different score" };
      if (!report.pass) {
        return { ok: false, detail: `${report.findings.length} visual finding(s): ${report.findings[0]?.message ?? "see visual-check.json"}` };
      }
      return { ok: true, detail: `${report.checked}/${report.shots} shots have a visual brief its recipe can draw` };
    })(),
    styleIdentity: (() => {
      // The film's own picture, not the score's promise: the identity report is
      // re-run on the delivered video and carries its videoHash. The identity
      // hash and frame-report hash close the two stale-report holes: a widened
      // band and a re-painted frame report.
      const report = read<{
        pass: boolean;
        score: string;
        identityHash?: string;
        frameReportHash?: string | null;
        videoHash: string | null;
        stagedRatio: number;
        findings: { code: string; message: string }[];
      }>("style-identity/style-identity.json");
      const current = `sha256:${hashFile(resolve(root, scorePath))}`;
      if (!report) return { ok: false, detail: "no style-identity report — run `npm run style:identity -- <score> --video`" };
      if (report.score !== current) return { ok: false, detail: "the identity report measured a different score" };
      if (report.videoHash !== frozenHash) return { ok: false, detail: "the identity report measured a different picture" };
      const tokensPath = resolve(root, "styles", score.style, "tokens.json");
      const tokens = existsSync(tokensPath)
        ? (JSON.parse(readFileSync(tokensPath, "utf8")) as { identity?: unknown })
        : {};
      const identityHash = `sha256:${createHash("sha256")
        .update(JSON.stringify(tokens.identity ?? null))
        .digest("hex")}`;
      if (report.identityHash !== identityHash) return { ok: false, detail: "the identity block changed since the report" };
      if (!report.frameReportHash) return { ok: false, detail: "the identity report has no frame-report hash" };
      if (!report.pass) {
        return { ok: false, detail: `${report.findings.length} identity finding(s): ${report.findings[0]?.message ?? "see the report"}` };
      }
      return { ok: true, detail: `staged ${(report.stagedRatio * 100).toFixed(0)}% · look inside the pack's bands` };
    })(),
    closeUps: (() => {
      const report = read<{
        videoHash: string | null;
        frame?: { closeUpShare?: number } | null;
      }>("style-identity/style-identity.json");
      if (!report) return { ok: false, detail: "no style-identity report" };
      if (report.videoHash !== frozenHash) return { ok: false, detail: "the identity report measured a different picture" };
      const share = report.frame?.closeUpShare;
      if (typeof share !== "number" || !Number.isFinite(share)) {
        return { ok: false, detail: "the frame report has no close-up share" };
      }
      if (share < 0.2 || share > 0.6) {
        return { ok: false, detail: `close-ups (>=55% height) are ${(share * 100).toFixed(0)}% of shots; the band is 20-60%` };
      }
      return { ok: true, detail: `${(share * 100).toFixed(0)}% of shots are close-ups` };
    })(),
    lra: {
      ok: typeof mix?.measured.lra === "number" && mix.measured.lra >= 4,
      detail:
        typeof mix?.measured.lra === "number"
          ? `LRA ${mix.measured.lra.toFixed(1)} LU (floor 4)`
          : "no LRA in the mix report",
    },
    soundContrast: {
      ok:
        typeof mix?.shortTerm?.contrastLu === "number" &&
        mix.shortTerm.contrastLu >= 15,
      detail:
        typeof mix?.shortTerm?.contrastLu === "number"
          ? `${mix.shortTerm.contrastLu.toFixed(1)} LU between the quietest and loudest 3 s window (floor 15)`
          : "no 3 s short-term contrast in the mix report",
    },
    determinism: (() => {      // The painter is a pure function of the score and the time (decision 0032).
      //
      // The evidence is a sample painted twice in two independent browser
      // processes — one serial, one parallel — and compared byte for byte. The
      // rule lives in `checkTwinEvidence`, so every way this row can refuse is a
      // unit test rather than something nobody can run without the whole gate.
      return checkTwinEvidence(determinism, `sha256:${hashFile(resolve(root, scorePath))}`);
    })(),
    mix: {
      ok:
        mix?.passes === true &&
        // Two checks the mix learned last: a hole nobody declared, and a bed
        // that leaves mid-line. `passes` covers them, but a row that does not
        // name them cannot say *why* the mix failed, and a missing section is
        // treated as a failure rather than as a pass.
        mix?.undeclaredHoles?.ok === true &&
        mix?.roomUnderLines?.ok === true &&
        Boolean(mix.inputs?.sfx) &&
        mix.inputs?.sfx === (sfx ? `sha256:${sha256(cueSetText(sfx.cues))}` : "missing") &&
        mix.inputs?.score === `sha256:${hashFile(resolve(root, scorePath))}` &&
        // The narration the mix was measured from, re-hashed: a re-recorded take
        // with an old mix would otherwise pass three rows about a read nobody
        // hears.
        typeof mix.inputs?.voice === "string" &&
        mix.inputs.voice === `sha256:${hashFile(resolve(root, "films", score.id, "voice.wav"))}` &&
        mix.files.hash === `sha256:${hashFile(resolve(dir, "mix", "master.wav"))}`,
      detail: mix
        ? `${mix.measured.lufs.toFixed(1)} LUFS / ${mix.measured.truePeak.toFixed(1)} dBTP · voice, cue set, score and master tied` +
          ` · ${mix.undeclaredHoles?.found.length ?? "?"} undeclared hole(s)` +
          (mix.roomUnderLines?.endedInLine.length
            ? ` · room bed ends under a line: ${mix.roomUnderLines.endedInLine.map((entry) => entry.cue).join(", ")}`
            : "")
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
          // The audio in the shipped file was measured from **this** master. Without
          // this line a re-mix without a re-deliver ships the previous cut while
          // the mix row reports the new one.
          deliver.master.hash === mix?.files.hash &&
          typeof deliver.output?.audio?.truePeak === "number" &&
          deliver.output.audio.truePeak <= DELIVERY_TP &&
          typeof deliver.output.audio.lufs === "number" &&
          Math.abs(deliver.output.audio.lufs - DELIVERY_LUFS) <= DELIVERY_LUFS_TOLERANCE
        );
      })(),
      detail: deliver?.output
        ? `${deliver.output.path} · ${deliver.output.audio.lufs?.toFixed(1)} LUFS / ${deliver.output.audio.truePeak?.toFixed(1)} dBTP measured on the delivered file · picture ${deliver.output.videoHash === frozenHash ? "is the frozen one" : "is NOT the frozen one"}${deliver.master.hash === mix?.files.hash ? " · from the current master" : " · NOT from the current master"}`
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
      ok:
        type?.pass === true &&
        type.score === `sha256:${hashFile(resolve(root, scorePath))}`,
      detail: type
        ? type.score !== `sha256:${hashFile(resolve(root, scorePath))}`
          ? "type audit measured a different score"
          : `${type.boxes} boxes in ${type.sampled} frames (${type.copyBoxes ?? 0} copy), ${type.outside.length} outside, ${type.belowFloor?.length ?? 0} under the ${type.floor?.px ?? "?"}px copy floor`
        : "no type-audit report",
    },
    rigSeam: {
      // An empty anchor set is not a pass when the film stages a character: it
      // means no rig published where it hangs a part, or nothing was drawn twice
      // to compare. A diagram film with no staged cast is not applicable, and
      // says so instead of pretending it measured a rig.
      ok:
        rig?.pass === true &&
        rig.score === `sha256:${hashFile(resolve(root, scorePath))}` &&
        (rig?.expectsCast === false || ((rig?.anchors ?? 0) > 0 && (rig?.anchorPairs ?? 0) > 0)),
      detail: rig
        ? rig.score !== `sha256:${hashFile(resolve(root, scorePath))}`
          ? "rig audit measured a different score"
          : rig.expectsCast === false
          ? "no staged cast — rig seam not applicable; the visual check proves the picture's subject"
          : `${rig.legs} legs, ${rig.unpairedSolves} unpaired, worst ankle jump ${rig.worstAnkleJump.distance}px; ` +
            `${rig.anchors ?? 0} anchors / ${rig.anchorPairs ?? 0} pairs on ${(rig.anchoredCharacters ?? []).length} character(s), worst in-parent shift ` +
            `${rig.worstSeamShift?.units ?? "?"} of ${rig.worstSeamShift?.limit ?? "?"} units`
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
    // The ASR report is about a file: its audio hash and its picture hash both
    // have to be the delivered film's, or the words were heard somewhere else.
    // It is a hard check the moment the report exists.
    checks["asr"] = {
      ok:
        asr.pass === true &&
        asr.pictureHash === frozenHash &&
        asr.audioHash === (existsSync(resolve(root, asr.audio)) ? `sha256:${hashFile(resolve(root, asr.audio))}` : "missing"),
      detail: `${(asr.coverage * 100).toFixed(1)}% of the script heard in ${asr.audio}${
        asr.unmatched.length
          ? ` · ${asr.unmatched.length} words the recogniser spelled differently: ${asr.unmatched
              .map((entry) => `${entry.word}${entry.heard ? `→${entry.heard}` : ""}`)
              .join(", ")}`
          : ""
      }`,
    };
  } else {
    pending.push("ASR of the mixed master: run `npm run asr -- <score>` (needs faster-whisper — tools/README.md)");
  }

  // The brief's `mustSay` was parsed and never read by anything. This row is the
  // command behind it: every phrase the client asked the film to say has to be
  // in the narration, the captions or the type, word for word.
  checks["briefSaid"] = (() => {
    const briefPath = resolve(root, "films", score.id, "brief.json");
    if (!existsSync(briefPath)) return { ok: false, detail: `no brief at films/${score.id}/brief.json to check against` };
    const brief = FilmBriefSchema.parse(JSON.parse(readFileSync(briefPath, "utf8")));
    const captionPath = resolve(root, "films", score.id, "captions.srt");
    const texts = [
      ...(score.clock?.lines ?? []).map((line) => line.text),
      ...(score.shots ?? []).flatMap((shot) => Object.values(shot.slots ?? {})),
      existsSync(captionPath) ? readFileSync(captionPath, "utf8") : "",
    ];
    const gaps = mustSayGaps(brief.mustSay, texts);
    return gaps.length === 0
      ? {
          ok: true,
          detail: brief.mustSay.length === 0 ? "the brief asks for no words" : `${brief.mustSay.length} phrases the brief asks for, all in the film`,
        }
      : { ok: false, detail: `the brief asks the film to say what it does not: ${gaps.join(", ")}` };
  })();

  const failed = Object.entries(checks).filter(([, value]) => !value.ok).map(([name]) => name);
  // A pending row is not a pass (P0.7): a gate that says "nothing manual" while
  // a listed check has not run is the "pass with a hole" this repository keeps
  // finding. The command is printed, and the gate stays red until it runs.
  const pass = failed.length === 0 && pending.length === 0;
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
