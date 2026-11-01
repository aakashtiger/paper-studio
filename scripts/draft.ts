/**
 * The draft: watch and listen before paying for the film.
 *
 * The render is the one expensive step left (a 60 s film is 1,800 frames), and
 * until now the only ways to look at a cut were the collage — one frame per
 * shot, silent — or the final render. A director needs to see it *move* and hear
 * it, and needs that in two minutes, not ten.
 *
 * So: the whole film, through the same painter, at a low frame rate, with the
 * master muxed. Every frame it paints is the frame the film will have, because a
 * frame is a pure function of the film's absolute time (decision 0023) — only
 * the sampling is coarser. It writes **no manifest**, because the manifest is
 * the claim that a picture *is* the deliverable, and 10 fps is not 30. Nothing
 * downstream can mistake a draft for a film.
 *
 * usage: npm run draft -- films/<id>/score.json [--fps 10] [--workers 4] [--out <file>]
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { availableParallelism } from "node:os";
import { FilmScoreSchema } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run draft -- <score.json> [--fps 10] [--workers 4] [--out <file>]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file as string), "utf8")));

// 10 fps is a third of the frames of a 30 fps film and still reads as movement;
// 12 or 15 are available when a draft needs to be more faithful.
const fps = Number(arg("fps") ?? 10);
const workers = Number(arg("workers") ?? Math.max(1, Math.min(4, Math.floor(availableParallelism() / 2))));
const out = arg("out") ?? `films/${score.id}/draft.mp4`;
const master = join("build", score.id, "mix", "master.wav");
const audio = existsSync(resolve(root, master)) ? master : undefined;

console.log(`draft: ${score.id} at ${fps} fps (the film is ${score.fps ?? 30}) · ${workers} workers`);
console.log(
  audio
    ? `draft: sound from ${master}`
    : "draft: no master at build/<id>/mix/master.wav — the draft will be silent (run `npm run mix`)",
);

const argv = [
  "--import", "tsx", "scripts/render-film.ts", file as string,
  "--draft",
  "--fps", String(fps),
  "--workers", String(workers),
  "--out", out,
  ...(audio ? ["--audio", audio] : []),
];

const child = spawn(process.execPath, argv, { cwd: root, stdio: ["ignore", "inherit", "inherit"] });
child.on("close", (code) => {
  if (code === 0) {
    console.log("");
    console.log(`draft: ${out} — a preview, not the deliverable. Nothing was added to the manifest;`);
    console.log(`draft: to paint the film itself: npm run render:film -- ${file} --workers ${workers}`);
  }
  process.exit(code ?? 1);
});
