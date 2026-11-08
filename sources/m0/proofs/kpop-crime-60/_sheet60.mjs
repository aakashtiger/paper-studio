/**
 * Tile one still per shot into a labelled contact sheet.
 * usage: node proofs/kpop-crime-60/_sheet60.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const stills = "proofs/kpop-crime-60/out/stills";
const out = "proofs/kpop-crime-60/out/sheet";
const font = "assets/fonts/DMMono-Medium.ttf";
// one representative instant per shot, in shot order
const times = [
  [1, "s01", 1.7], [2, "s02", 4.2], [3, "s03", 6.5], [4, "s04", 9.5],
  [5, "s05", 11.5], [6, "s06", 15.0], [7, "s07", 18.5], [8, "s08", 21.0],
  [9, "s09", 24.0], [10, "s10", 27.5], [11, "s11", 29.8], [12, "s12", 32.5],
  [13, "s13", 36.0], [14, "s14", 38.5], [15, "s15", 41.0], [16, "s16", 44.2],
  [17, "s17", 46.5], [18, "s18", 49.5], [19, "s19", 53.5], [20, "s20", 57.2],
  [21, "s21", 59.2],
];
mkdirSync(out, { recursive: true });
for (const [i, id, t] of times) {
  const src = `${stills}/t${t.toFixed(2).replace(".", "_")}.png`;
  if (!existsSync(src)) { console.log("MISS", src); continue; }
  const dst = `${out}/f${String(i).padStart(2, "0")}.png`;
  execFileSync(ffmpegPath, ["-y", "-loglevel", "error", "-i", src,
    "-vf", `scale=640:360,drawtext=fontfile=${font}:text='${id}  ${t.toFixed(1)}s':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=6`,
    "-frames:v", "1", dst]);
}
execFileSync(ffmpegPath, ["-y", "-loglevel", "error", "-framerate", "1", "-i", `${out}/f%02d.png`,
  "-vf", "tile=3x7:padding=6:margin=6:color=0x111116", "-frames:v", "1", `${out}/contact-sheet.png`]);
console.log("wrote", `${out}/contact-sheet.png`);
