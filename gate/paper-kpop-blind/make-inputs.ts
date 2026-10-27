import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { computePackHash } from "../../src/core/style.js";

const live = computePackHash("styles/paper-kpop");
const copy = computePackHash("gate/paper-kpop-blind/inputs/pack");
if (live !== copy) {
  throw new Error(`pack copy mismatch: ${live} !== ${copy}`);
}
writeFileSync("gate/paper-kpop-blind/PACK-HASH.txt", `${live}\n`, "utf8");

const root = "gate/paper-kpop-blind/inputs";
const files: string[] = [];
const walk = (directory: string): void => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else files.push(path);
  }
};
walk(root);

const manifest: Record<string, string> = {};
for (const file of files) {
  const rel = relative(root, file).split(sep).join("/");
  if (rel === "MANIFEST.json") continue;
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
  manifest[rel] = `sha256:${hash}`;
}
writeFileSync(
  join(root, "MANIFEST.json"),
  `${JSON.stringify({ algorithm: "sha256", files: manifest }, null, 2)}\n`,
  "utf8",
);
console.log(live);
console.log(`manifest files: ${Object.keys(manifest).length}`);
