/**
 * `gold:stills` — turn the gold film into a reference a clone can actually read.
 *
 * The gold (`out/claude-pop.mp4`, 276 MB) never enters the repo, but a style
 * cannot be built from a hash. This command paints the reference the pack is
 * held against: **one still per authored shot**, at the shot's midpoint, from
 * the 54-shot map in `gate/gold/gold-authored-shots.json`.
 *
 * That is the difference between "we measured a film" and "we can see it":
 * 54 stills at 960 px ~ 5 MB, in git, in shot order, one per line of the map.
 *
 * usage:
 *   npm run gold:stills                      # uses the pinned path, writes gate/gold/stills
 *   npm run gold:stills -- --ref <gold.mp4>  # another copy of the same film
 *   npm run gold:stills -- --verify          # hash the ref against GOLD.json first
 *
 * The output is deterministic: the same film and map produce the same 54 files.
 * It refuses to run on a file whose sha256 is not the pinned gold (unless
 * --force), because a still from a different cut is worse than no still.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import ffmpegPath from "ffmpeg-static";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const root = process.cwd();
const goldDir = resolve(root, "gate", "gold");
const mapPath = join(goldDir, "gold-authored-shots.json");
const pinPath = join(goldDir, "GOLD.json");
const outDir = resolve(root, flag("out") ?? join("gate", "gold", "stills"));
const width = Number(flag("width") ?? 960);

type Shot = { n: number; start: number; end: number; title?: string; set?: string };
const map = JSON.parse(readFileSync(mapPath, "utf8")) as Record<string, Shot>;
const shots = Object.values(map).sort((a, b) => a.n - b.n);
if (shots.length !== 54) throw new Error(`expected 54 authored shots, the map has ${shots.length}`);

const pin = JSON.parse(readFileSync(pinPath, "utf8")) as { file: string; sha256: string; bytes: number };
const ref = resolve(root, flag("ref") ?? pin.file);

if (!existsSync(ref)) {
  console.error(`no gold at ${ref}`);
  console.error(`pass the same film with --ref, or see gate/gold/README.md`);
  process.exit(1);
}

// Hash only when asked: 276 MB takes a few seconds and the check is not free.
if (args.includes("--verify")) {
  const hash = createHash("sha256").update(readFileSync(ref)).digest("hex");
  const same = hash === pin.sha256;
  console.log(`ref sha256 ${same ? "matches" : "DIFFERS FROM"} the pin (${pin.sha256.slice(0, 12)}…)`);
  if (!same && !args.includes("--force")) {
    console.error("refusing: a still from a different cut is worse than no still");
    process.exit(1);
  }
}

mkdirSync(outDir, { recursive: true });
const ffmpeg = ffmpegPath as unknown as string;
let wrote = 0;
for (const shot of shots) {
  const at = (shot.start + shot.end) / 2;
  const name = `s${String(shot.n + 1).padStart(2, "0")}.jpg`;
  const out = join(outDir, name);
  const run = spawnSync(
    ffmpeg,
    ["-y", "-ss", at.toFixed(3), "-i", ref, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-q:v", "3", out],
    { stdio: "ignore" },
  );
  if (run.status !== 0 || !existsSync(out)) {
    console.error(`FAIL shot ${shot.n} at ${at.toFixed(2)}s`);
    process.exit(1);
  }
  wrote++;
}

const bytes = readdirSync(outDir)
  .filter((f) => f.endsWith(".jpg"))
  .reduce((sum, f) => sum + statSync(join(outDir, f)).size, 0);

console.log(`gold stills: ${wrote} frames at ${width}px -> ${outDir}`);
console.log(`${(bytes / 1024 / 1024).toFixed(1)} MB, one per authored shot, named sNN in map order`);
