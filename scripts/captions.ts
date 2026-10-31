import { existsSync, readFileSync, writeFileSync } from "node:fs";
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

// Real word timings first: `npm run voice` writes `films/<id>/words.json` from
// the actual read. Only when that file is absent does the transcript fall back
// to a per-character guess, and the transcript says which it used.
const wordsFile = resolve(process.cwd(), `films/${score.id}/words.json`);
const timed = existsSync(wordsFile)
  ? (JSON.parse(readFileSync(wordsFile, "utf8")) as { words: Array<{ w: string; start: number; end: number }> }).words
  : null;

let cursor = 0;
const lines = score.clock.mode === "narration" ? score.clock.lines : [];
const words = lines.map((line) => {
  const tokens = line.text.split(/\s+/).filter(Boolean);
  if (timed) {
    const span = timed.slice(cursor, cursor + tokens.length);
    cursor += tokens.length;
    if (span.length === tokens.length && span.length > 0) {
      const first = span[0]!;
      const last = span[span.length - 1]!;
      return {
        id: line.id,
        text: line.text,
        start: first.start,
        duration: Number((last.end - first.start).toFixed(3)),
        words: span.map((word) => ({ w: word.w, start: word.start, end: word.end })),
      };
    }
  }
  const weight = tokens.reduce((sum, token) => sum + token.length + 1, 0);
  let at = line.start;
  return {
    id: line.id,
    text: line.text,
    start: line.start,
    duration: line.duration,
    words: tokens.map((token) => {
      const piece = ((token.length + 1) / weight) * line.duration;
      const word = { w: token, start: Number(at.toFixed(3)), end: Number((at + piece).toFixed(3)) };
      at += piece;
      return word;
    }),
  };
});

const transcript = {
  film: score.id,
  voice: score.audio.narration?.voice ?? score.audio.narration?.voiceId ?? null,
  source: timed ? "asr" : "guess",
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
