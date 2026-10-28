import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run captions -- <score.json>");
  process.exit(2);
}

const scorePath = resolve(process.cwd(), file);
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(scorePath, "utf8")));
const styleDir = resolve(process.cwd(), `styles/${score.style}`);
const { errors } = resolveFilm(score, styleDir);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const lines = score.clock.mode === "narration" ? score.clock.lines : [];
const words = lines.map((line) => {
  const tokens = line.text.split(/\s+/).filter(Boolean);
  const weight = tokens.reduce((sum, token) => sum + token.length + 1, 0);
  let cursor = line.start;
  return {
    id: line.id,
    text: line.text,
    start: line.start,
    duration: line.duration,
    words: tokens.map((token) => {
      const span = ((token.length + 1) / weight) * line.duration;
      const word = { w: token, start: Number(cursor.toFixed(3)), end: Number((cursor + span).toFixed(3)) };
      cursor += span;
      return word;
    }),
  };
});

const transcript = {
  film: score.id,
  voice: score.audio.voice ?? null,
  duration: score.duration,
  lines: words,
};
writeFileSync(resolve(process.cwd(), `films/${score.id}/transcript.json`), `${JSON.stringify(transcript, null, 2)}\n`, "utf8");

function stamp(seconds: number): string {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const rest = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(rest).padStart(3, "0")}`;
}

const srt = score.captions.lines
  .map(
    (caption, index) =>
      `${index + 1}\n${stamp(caption.start)} --> ${stamp(caption.end)}\n${caption.text}\n`,
  )
  .join("\n");
writeFileSync(resolve(process.cwd(), score.captions.source), srt, "utf8");
console.log(`wrote films/${score.id}/transcript.json and ${score.captions.source}`);
