/**
 * `twin-check` — the same nine frames, one worker and four workers.
 *
 * usage: node scripts/twin-check.mjs [film-root] [renderer] [range]
 * writes <film-root>/out/twin.json
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { isAbsolute } from "node:path";

const filmRoot = process.argv[2] || "proofs/kpop-test";
const outRoot = `${filmRoot}/out`;
const renderer = process.argv[3] || `${filmRoot}/render-test.mjs`;
const range = process.argv[4] || "3.3:3.6";
let video = process.argv[5];
if (!video) {
  try {
    const film = JSON.parse(readFileSync(`${filmRoot}/film.json`, "utf8"));
    video = film.video
      ? (isAbsolute(film.video) ? film.video : `${filmRoot}/${film.video}`)
      : `${filmRoot}/out/${film.id}.mp4`;
  } catch {
    video = `${filmRoot}/out/kpop-test.mp4`;
  }
}
if (!existsSync(video)) {
  console.error(`twin-check: missing delivered picture ${video}`);
  process.exit(1);
}
const videoHash = createHash("sha256").update(readFileSync(video)).digest("hex");
const dirs = [`${outRoot}/twin-serial`, `${outRoot}/twin-parallel`];
for (const d of dirs) { try { rmSync(d, { recursive: true, force: true }); } catch {} }
mkdirSync(dirs[0], { recursive: true });
mkdirSync(dirs[1], { recursive: true });

const run = (workers, dir) => spawnSync("node", [
  renderer,
  `--frames=${range}`,
  `--workers=${workers}`,
  `--framesDir=${dir}`,
], { encoding: "utf8" });

const a = run(1, dirs[0]);
const b = run(4, dirs[1]);
const files = (d) => readdirSync(d).filter((f) => /^f\d+\.jpg$/.test(f)).sort();
const fa = files(dirs[0]), fb = files(dirs[1]);
let same = fa.length > 0 && fa.length === fb.length;
const hashes = [];
for (let i = 0; i < Math.min(fa.length, fb.length); i++) {
  const ha = createHash("sha256").update(readFileSync(`${dirs[0]}/${fa[i]}`)).digest("hex");
  const hb = createHash("sha256").update(readFileSync(`${dirs[1]}/${fb[i]}`)).digest("hex");
  hashes.push(ha);
  if (ha !== hb) same = false;
}
const hash = createHash("sha256").update(hashes.join("")).digest("hex");
const out = { same, frames: fa.length, at: range, hash, video, videoHash, serialExit: a.status, parallelExit: b.status };
writeFileSync(`${outRoot}/twin.json`, JSON.stringify(out, null, 2) + "\n");
console.log(`twin-check: ${out.frames} frames, 1-vs-4 same=${same}, sha256:${hash}`);
console.log(`twin-check: picture ${video} sha256:${videoHash.slice(0, 12)}…`);
if (!same) process.exit(1);
console.log("PASS: the same frames, whichever worker paints them.");
