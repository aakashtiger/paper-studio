import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const root = "Y:/NewVideoTest";
const outDir = `${root}/out/analysis`;
mkdirSync(outDir, { recursive: true });

const acts = ["act1", "act2", "act3", "act4", "act5"];
const scenes = [];
for (const act of acts) {
  const text = readFileSync(`${root}/src/scenes/${act}.js`, "utf8");
  const re = /scene\(\{\s*id:\s*'([^']+)',\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)/g;
  let m;
  while ((m = re.exec(text))) {
    scenes.push({ act, id: m[1], start: Number(m[2]), end: Number(m[3]), duration: Number((Number(m[3]) - Number(m[2])).toFixed(3)) });
  }
}
scenes.sort((a, b) => a.start - b.start);
writeFileSync(`${outDir}/shots.json`, `${JSON.stringify(scenes, null, 2)}\n`);
console.log(`${scenes.length} shots`);
console.log(scenes.map((s) => `${s.id} ${s.start}-${s.end} ${s.duration}s`).join("\n"));
