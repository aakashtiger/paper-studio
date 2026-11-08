// Build the 60 s word clock from the measured narration.
//
//   node proofs/kpop-crime-60/make-words.mjs
//
// Input:  studio/films/kpop-crime/narration.json  (voice:story, measured)
// Output: proofs/kpop-crime-60/test-words.js      (21 shot-lines, 186 words)
//         proofs/kpop-crime-60/voice.json         (the measured read)
//
// The split is the script's, by word count. Nothing is invented: the words,
// their order and their times come from narration.json. The shot windows are
// the measured read: each shot opens 0.10 s before the first word of its
// shot-line and closes where the next shot opens; the last closes at 60.00.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const studio = path.resolve(here, "../../studio");
const narrationPath = path.join(studio, "films/kpop-crime/narration.json");
const narration = JSON.parse(fs.readFileSync(narrationPath, "utf8"));

// SCRIPT-60.md §2 — one shot-line per shot, with the script's word split.
const SHOT_LINES = [
  { shot: "s01", vo: "v01", count: 10, text: "Day one. Rain on the bricks. A knife, a coat," },
  { shot: "s02", vo: "v01", count: 5, text: "a body under a sheet." },
  { shot: "s03", vo: "v02", count: 12, text: "By dawn the file was open, and his name was in it." },
  { shot: "s04", vo: "v03", count: 6, text: "Days two and three. He ran" },
  { shot: "s05", vo: "v03", count: 7, text: "through rain; the city kept his face." },
  { shot: "s06", vo: "v04", count: 14, text: "Day four. A train, a tunnel, a ticket on a seat in the dark." },
  { shot: "s07", vo: "v05", count: 7, text: "Days five and six. A rented room," },
  { shot: "s08", vo: "v05", count: 8, text: "a calendar, a door he did not answer." },
  { shot: "s09", vo: "v06", count: 12, text: "Day seven. The page turned. He counted the hours, not the money." },
  { shot: "s10", vo: "v07", count: 8, text: "Day eight. A checkpoint at the city's edge," },
  { shot: "s11", vo: "v07", count: 6, text: "and a lamp found his face." },
  { shot: "s12", vo: "v08", count: 12, text: "He turned his collar up and walked through the light without stopping." },
  { shot: "s13", vo: "v09", count: 9, text: "Day nine. The bridge was wet, and the detective" },
  { shot: "s14", vo: "v09", count: 5, text: "waited at the far end." },
  { shot: "s15", vo: "v10", count: 10, text: "The cuffs closed. The city went on behind him, indifferent." },
  { shot: "s16", vo: "v11", count: 6, text: "Day ten. A cell, a file," },
  { shot: "s17", vo: "v11", count: 8, text: "a judge, and a sentence read without hurry." },
  { shot: "s18", vo: "v12", count: 13, text: "The gavel fell. The warder took his arm, and the court was empty." },
  { shot: "s19", vo: "v13", count: 14, text: "They brought him back to the same cell, and the calendar still said ten." },
  { shot: "s20", vo: "v14", count: 8, text: "At dawn they walked him to the yard," },
  { shot: "s21", vo: "v14", count: 6, text: "where the noose was a shadow." },
];

const round3 = (value) => Number(value.toFixed(3));
const fail = (message) => {
  console.error(`make-words: ${message}`);
  process.exit(1);
};

// --- the assertions: the split must be the script's, word for word ----------
if (SHOT_LINES.length !== 21) fail(`expected 21 shot-lines, got ${SHOT_LINES.length}`);
if (SHOT_LINES.reduce((sum, line) => sum + line.count, 0) !== 186) {
  fail("the shot-line word counts do not total 186");
}
if (!Array.isArray(narration.words) || narration.words.length !== 186) {
  fail(`narration.json carries ${narration.words?.length ?? 0} words, not 186`);
}

let wordCursor = 0;
const lines = SHOT_LINES.map((line) => {
  const words = narration.words.slice(wordCursor, wordCursor + line.count);
  wordCursor += line.count;
  if (words.length !== line.count) fail(`${line.shot} wants ${line.count} words, measured ${words.length}`);
  const text = words.map((word) => word.w).join(" ");
  if (text !== line.text) fail(`${line.shot} reads "${text}", the script says "${line.text}"`);
  const start = round3(words[0].start);
  const end = round3(words[words.length - 1].end);
  return {
    shot: line.shot,
    vo: line.vo,
    text,
    start,
    end,
    words: words.map((word) => ({ w: word.w, t: round3(word.start), d: round3(word.end - word.start) })),
  };
});
if (wordCursor !== narration.words.length) fail(`consumed ${wordCursor} words, not ${narration.words.length}`);

// --- the shot windows: the measured read is the clock ----------------------
// Each shot opens 0.10 s before the first word of its shot-line and closes
// where the next shot opens; the last closes at 60.00. The 1.0–4.5 s band is
// enforced by moving an overlong shot's opening later, never by cutting its
// words. A line may still carry a beat past the cut; voice.json names it.
const shotStarts = lines.map((line) => round3(Math.max(0, line.words[0].t - 0.10)));
for (let i = 0; i < shotStarts.length; i++) {
  const end = i + 1 < shotStarts.length ? shotStarts[i + 1] : 60.0;
  if (end - shotStarts[i] > 4.5) shotStarts[i] = round3(end - 4.5);
  if (end - shotStarts[i] < 1.0) shotStarts[i] = round3(Math.max(0, end - 1.0));
}
const shots = shotStarts.map((start, i) => {
  const end = i + 1 < shotStarts.length ? shotStarts[i + 1] : 60.0;
  const duration = round3(end - start);
  if (duration < 1.0 || duration > 4.5) fail(`${lines[i].shot}: ${duration}s is outside the 1.0–4.5 s band`);
  return { id: lines[i].shot, start, end, duration, line: i };
});
const total = round3(shots.reduce((sum, shot) => sum + shot.duration, 0));
if (Math.abs(total - 60) > 0.001) fail(`the shot windows total ${total}s, not 60.0s`);

// --- test-words.js ---------------------------------------------------------
const wordCell = (word) => `{ w: ${JSON.stringify(word.w)}, t: ${word.t}, d: ${word.d} }`;
const lineBlock = (line, index) => {
  const rows = [];
  for (let i = 0; i < line.words.length; i += 4) rows.push(`      ${line.words.slice(i, i + 4).map(wordCell).join(", ")},`);
  return [
    "  {",
    `    shot: ${JSON.stringify(line.shot)}, vo: ${JSON.stringify(line.vo)},`,
    `    text: ${JSON.stringify(line.text)},`,
    `    start: ${line.start}, end: ${line.end},`,
    "    words: [",
    ...rows,
    "    ],",
    "  },",
  ].join("\n");
};
const shotsBlock = shots.map((shot, index) => `  { id: ${JSON.stringify(shot.id)}, start: ${shot.start}, end: ${shot.end}, duration: ${shot.duration}, line: ${index} },`);

const js = [
  "// Generated by make-words.mjs from films/kpop-crime/narration.json.",
  "// 21 shot-lines, 186 words; the split is SCRIPT-60.md's, by word count.",
  "window.KPOP_LINES = [",
  lines.map(lineBlock).join("\n"),
  "];",
  "window.KPOP_WORDS = window.KPOP_LINES.flatMap((l) => l.words);",
  "window.KPOP_SHOTS = [",
  shotsBlock.join("\n"),
  "];",
  "window.KPOP_DURATION = 60.0;",
  "",
].join("\n");
fs.writeFileSync(path.join(here, "test-words.js"), js, "utf8");

// --- voice.json ------------------------------------------------------------
const fit = lines.map((line, index) => {
  const window = shots[index];
  const before = round3(Math.max(0, window.start - line.start));
  const after = round3(Math.max(0, line.end - window.end));
  return {
    shot: line.shot,
    vo: line.vo,
    shotStart: window.start,
    shotEnd: window.end,
    lineStart: line.start,
    lineEnd: line.end,
    /** Seconds the shot-line starts after its shot opens (negative = pre-lap). */
    startLag: round3(line.start - window.start),
    /** Seconds the shot-line ends before its shot closes (negative = carries past). */
    endLead: round3(window.end - line.end),
    before,
    after,
    // 0.05 s is 1.5 frames at 30 fps: inside the frame grid, not a cut miss.
    fits: before <= 0.05 && after <= 0.05,
  };
});
const doesNotFit = fit.filter((row) => !row.fits);

const voice = {
  film: narration.film,
  narration: "films/kpop-crime/narration.json",
  narrationAbsolute: path.join(studio, "films/kpop-crime/narration.json").split(path.sep).join("/"),
  audio: narration.audio,
  audioAbsolute: path.join(studio, "films/kpop-crime/voice.wav").split(path.sep).join("/"),
  audioHash: narration.audioHash,
  model: narration.model,
  voice: "bm_george",
  speed: 1.11,
  ...(narration.read ? { read: narration.read } : {}),
  duration: 60,
  lines: 14,
  shots: 21,
  words: narration.scriptWords,
  wpm: narration.scriptWpm,
  wpmBand: [180, 190],
  scriptWpm: narration.scriptWpm,
  spokenWpm: narration.spokenWpm,
  first: narration.first,
  lastWord: narration.lastEnd,
  coverage: narration.speechCoverage,
  wordCoverage: narration.coverage,
  matched: narration.matched,
  unheard: narration.unheard,
  longestHole: narration.hole,
  longestHoleAt: narration.holeAt,
  longestSilence: narration.longestSilence,
  longestSilenceAt: narration.longestSilenceAt,
  speech: narration.speech,
  silence: narration.silence,
  checks: narration.checks,
  pass: narration.pass,
  shotFits: fit,
  doesNotFit,
};
fs.writeFileSync(path.join(here, "voice.json"), `${JSON.stringify(voice, null, 2)}\n`, "utf8");

console.log(`make-words: ${lines.length} shot-lines · ${wordCursor} words · ${voice.lastWord}s last word · ${(voice.coverage * 100).toFixed(1)}% voiced`);
console.log(`  ${doesNotFit.length} shot-line(s) outside their shot window`);
for (const row of doesNotFit) {
  console.log(`  ${row.shot} (${row.vo}) line ${row.lineStart}–${row.lineEnd} vs shot ${row.shotStart}–${row.shotEnd}  before ${row.before}s  after ${row.after}s`);
}
