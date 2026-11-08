import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = "proofs/kpop-crime-60/shots";
const heroes = {
  "s01.js": ["\"DAY ONE\"", "\"THE ALLEY\""],
  "s04.js": ["\"DAY 2\"", "\"THE STATION\""],
  "s06.js": ["\"DAY 4\"", "\"THE TRAIN\""],
  "s10.js": ["\"DAY 8\"", "\"THE CHECKPOINT\""],
  "s13.js": ["\"DAY 9\"", "\"THE BRIDGE\""],
  "s16.js": ["\"DAY TEN\"", "\"THE CELL\""],
};
const skip = new Set(["s07.js", "s08.js", "s09.js"]);
let changed = 0;
for (const [file, [from, to]] of Object.entries(heroes)) {
  const p = join(dir, file);
  let s = readFileSync(p, "utf8");
  if (!s.includes(from)) { console.log("hero missing", file, from); continue; }
  s = s.split(from).join(to);
  writeFileSync(p, s);
  changed++;
}
for (let i = 1; i <= 21; i++) {
  const file = `s${String(i).padStart(2, "0")}.js`;
  if (skip.has(file)) continue;
  const p = join(dir, file);
  let s = readFileSync(p, "utf8");
  const before = s;
  s = s.replace(/"DAY [^"]*?[\u00b7\u2014\u2013-] ([^"]*)"/g, "\"$1\"");
  if (s !== before) { writeFileSync(p, s); changed++; }
}
console.log(`changed ${changed} files`);
