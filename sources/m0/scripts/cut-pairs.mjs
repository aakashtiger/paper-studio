/**
 * `cut-pairs` — every cut, side by side, end frame against start frame.
 *
 * The eye can miss a jump when the cut is one frame long. This tool extracts
 * the last frame of shot N and the first frame of shot N+1 from the delivered
 * MP4, scales each to 960x540, and tiles one row per cut with the shot ids on
 * the row.
 *
 * usage:
 *   node scripts/cut-pairs.mjs --video proofs/kpop-crime-60/out/kpop-crime-60.mp4 --score proofs/kpop-crime-60
 *   node scripts/cut-pairs.mjs --video=... --score=... --rows=6
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  ROOT, die, loadScore, pageNames, parseArgs, relToRoot, resetDir, runFfmpeg, sha256, stackRows, cutRow, writeJson,
} from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const video = args.video
  ? resolve(ROOT, args.video)
  : resolve(score.root, "out", `${score.film.id}.mp4`);
if (!existsSync(video)) die(`cut-pairs: video not found: ${relToRoot(video)}`);
if (!score.shots || score.shots.length < 2) die(`cut-pairs: ${score.shotsPath} needs at least two shots`);

const fps = +(args.fps || (score.measured && score.measured.fps) || 30);
const ROWS = +(args.rows || 6);
if (ROWS > 20) die("cut-pairs: --rows must be <= 20 (one ffmpeg command line)");
const OUT_BASE = resolve(score.root, "out");
const OUT = resolve(OUT_BASE, "cut-pairs");
const MANIFEST = resolve(OUT_BASE, "cut-pairs.json");

// The cut times come from shots.json. If the picture predates that file, the
// rows may show a cut the current score no longer has.
for (const f of ["film.json", "shots.json"]) {
  const p = join(score.root, f);
  if (existsSync(p) && statSync(p).mtimeMs > statSync(video).mtimeMs + 1000) {
    console.warn(`cut-pairs: warning — ${f} is newer than the video; these rows may be from an earlier edit`);
    break;
  }
}

resetDir(OUT);
mkdirSync(join(OUT, "frames"), { recursive: true });
mkdirSync(join(OUT, "rows"), { recursive: true });
// a shorter film must not leave a page from the previous run behind
for (const f of readdirSync(OUT_BASE)) {
  if (/^cut-pairs(-\d+)?\.png$/.test(f)) rmSync(join(OUT_BASE, f), { force: true });
}

/* frames are addressed by index: frame i covers [i/fps, (i+1)/fps). Seeking to
   its middle avoids landing on the neighbouring frame at a cut boundary. */
const frameAt = (t, first) => first
  ? Math.ceil(t * fps - 1e-6)
  : Math.ceil(t * fps - 1e-6) - 1;
const seek = (frame) => String((frame + 0.5) / fps);

function extract(frame, file) {
  runFfmpeg(["-ss", seek(frame), "-i", video, "-frames:v", "1", file], "cut-pairs extract");
  if (!existsSync(file)) throw new Error(`cut-pairs: ffmpeg wrote no frame at ${file}`);
}

const pairs = [];
for (let i = 0; i < score.shots.length - 1; i++) {
  const from = score.shots[i], to = score.shots[i + 1];
  const endFrame = Math.max(0, frameAt(from.end, false));
  const startFrame = Math.max(0, frameAt(to.start, true));
  const endImage = join(OUT, "frames", `${from.id}-end.png`);
  const startImage = join(OUT, "frames", `${to.id}-start.png`);
  extract(endFrame, endImage);
  extract(startFrame, startImage);
  const rowAbs = join(OUT, "rows", `${String(i + 1).padStart(2, "0")}-${from.id}-${to.id}.png`);
  const banner = `${from.id} END ${(endFrame / fps).toFixed(2)}s | ${to.id} START ${(startFrame / fps).toFixed(2)}s`;
  cutRow({ out: rowAbs, endPng: endImage, startPng: startImage, banner });
  pairs.push({
    index: i + 1,
    from: from.id,
    to: to.id,
    endFrame,
    startFrame,
    endTime: Number((endFrame / fps).toFixed(4)),
    startTime: Number((startFrame / fps).toFixed(4)),
    endImage: relToRoot(endImage),
    startImage: relToRoot(startImage),
    row: relToRoot(rowAbs),
  });
  if ((i + 1) % 5 === 0) console.log(`cut-pairs: ${i + 1}/${score.shots.length - 1} cuts`);
}

const pageGroups = [];
for (let i = 0; i < pairs.length; i += ROWS) pageGroups.push(pairs.slice(i, i + ROWS));
const pageFiles = pageNames(OUT_BASE, "cut-pairs", pageGroups.length);
const pageManifest = pageGroups.map((group, i) => {
  const size = stackRows({
    out: pageFiles[i],
    rows: group.map((p) => resolve(ROOT, p.row)),
    width: 1920,
    rowHeight: 540,
  });
  group.forEach((p) => { p.page = i + 1; });
  return {
    path: `out/${pageFiles[i].split(/[\\/]/).pop()}`,
    sha256: sha256(pageFiles[i]),
    width: size.width,
    height: size.height,
    cuts: group.map((p) => `${p.from}->${p.to}`),
  };
});

const videoHash = sha256(video);
writeJson(MANIFEST, {
  video: relToRoot(video),
  videoHash,
  fps,
  rowsPerPage: ROWS,
  cuts: pairs.length,
  pages: pageManifest,
  pairs,
});

console.log(`cut-pairs: ${pairs.length} cuts, ${pageManifest.length} page(s), video sha256:${videoHash.slice(0, 12)}…`);
for (const p of pageManifest) console.log(`  ${p.path}  ${p.width}x${p.height}  ${p.cuts.length} cuts  sha256:${p.sha256.slice(0, 12)}…`);
console.log(`  ${relToRoot(MANIFEST)}`);
