/**
 * Refresh the asset manifest hashes in a score.
 *
 * `resolveAssets` fails hard when a hashed file changes, which is the point: a
 * rig or prop edit must be deliberate. This rewrites the recorded hashes from
 * the files on disk so `npm run embed` can proceed, and prints every change so
 * the edit is visible in the terminal, not silent.
 *
 * usage: npm run assets:hash -- films/understudy/score.json
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("usage: npm run assets:hash -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const path = resolve(root, file);
const score = JSON.parse(readFileSync(path, "utf8")) as {
  assets?: { id: string; hash: string; path: string }[];
};
if (!Array.isArray(score.assets)) {
  console.error("score has no assets array");
  process.exit(2);
}

let changed = 0;
let missing = 0;
for (const asset of score.assets) {
  const target = resolve(root, asset.path);
  if (!existsSync(target)) {
    // A generated asset (audio, for example) is written by its own command.
    console.log(`skip  ${asset.id} (not on disk yet: ${asset.path})`);
    missing++;
    continue;
  }
  const hash = `sha256:${createHash("sha256").update(readFileSync(target)).digest("hex")}`;
  if (hash === asset.hash) continue;
  console.log(`update ${asset.id} ${asset.hash.slice(0, 16)}… -> ${hash.slice(0, 16)}… (${asset.path})`);
  asset.hash = hash;
  changed++;
}

writeFileSync(path, JSON.stringify(score, null, 2) + "\n", "utf8");
console.log(`assets: ${changed} hash(es) updated, ${missing} not on disk, ${score.assets.length - changed - missing} already correct`);
