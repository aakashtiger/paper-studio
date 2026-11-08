import { readFileSync, writeFileSync } from "node:fs";

const script =
  "Every night the cue lamp calls one name, and every night the stage holds its breath, but tonight the lamp called Nova, and the wings were empty, so Mira picked up the star, and put it in her hand, and the crowd saw a girl who was never on the list, and the light found her, and the lamp called again, and the curtain opened on a stage that had been waiting all night.";

const raw = script.split(/\s+/).filter(Boolean);
const heard = JSON.parse(readFileSync("proofs/kpop-test/heard.json", "utf8"));
if (raw.length !== heard.length) throw new Error(`script ${raw.length} != heard ${heard.length}`);
const offset = 0.35;
const words = raw.map((w, i) => ({
  w: w.replace(/[^A-Za-z0-9']/g, ""),
  t: +(heard[i].start + offset).toFixed(3),
  d: +(heard[i].end - heard[i].start).toFixed(3),
}));

const shots = [
  { id: "s1", start: 0.0, end: 3.68, a: 0, b: 7 },
  { id: "s2", start: 3.68, end: 6.42, a: 8, b: 15 },
  { id: "s3", start: 6.42, end: 10.44, a: 16, b: 26 },
  { id: "s4", start: 10.44, end: 12.26, a: 27, b: 32 },
  { id: "s5", start: 12.26, end: 13.9, a: 33, b: 38 },
  { id: "s6", start: 13.9, end: 17.44, a: 39, b: 50 },
  { id: "s7", start: 17.44, end: 18.86, a: 51, b: 55 },
  { id: "s8", start: 18.86, end: 20.52, a: 56, b: 60 },
  { id: "s9", start: 20.52, end: 24.9, a: 61, b: 73 },
];

const lines = shots.map((s) => {
  const ws = words.slice(s.a, s.b + 1);
  return {
    id: s.id,
    text: ws.map((w) => w.w).join(" "),
    start: ws[0].t,
    end: ws[ws.length - 1].t + ws[ws.length - 1].d,
    words: ws,
  };
});

const out = `/* generated from proofs/kpop-test/heard.json — do not hand-edit */
window.KPOP_WORDS = ${JSON.stringify(words, null, 0)};
window.KPOP_LINES = ${JSON.stringify(lines, null, 0)};
window.KPOP_SHOTS = ${JSON.stringify(shots, null, 0)};
window.KPOP_DURATION = 24.9;
`;
writeFileSync("proofs/kpop-test/test-words.js", out);
console.log(`${words.length} words, ${lines.length} lines`);
for (const l of lines) console.log(`${l.id} ${l.start.toFixed(2)}-${l.end.toFixed(2)} ${l.text}`);
