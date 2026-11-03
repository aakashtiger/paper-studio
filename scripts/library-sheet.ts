/**
 * `library:sheet` — see the characters, poses and expressions you can reuse.
 *
 * The sheet renderer draws a film's cast through a film's vendor, so a library
 * character needs a vendor that registers its rig. This command takes a base
 * film (default *Same Alarm*, whose vendor registers `worker@0.1.0` and
 * `supervisor@0.1.0`), swaps its cast for every library character, and writes
 * one sheet per character into `build/library/sheets/`.
 *
 * usage: npm run library:sheet -- [--film same-alarm] [--out build/library/sheets]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { LibraryIndexSchema } from "../src/engine/library.js";

const args = process.argv.slice(2);
function arg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

const root = process.cwd();
const film = arg("film") ?? "same-alarm";
const basePath = resolve(root, "films", film, "score.json");
if (!existsSync(basePath)) {
  console.error(`error: films/${film}/score.json is missing; pass --film <id> with a vendor that registers the library rigs`);
  process.exit(1);
}
const index = LibraryIndexSchema.parse(
  JSON.parse(readFileSync(resolve(root, "library/characters/index.json"), "utf8").replace(/^\uFEFF/, "")),
);
const base = JSON.parse(readFileSync(basePath, "utf8").replace(/^\uFEFF/, "")) as {
  cast?: { character: string; poses: string; rig?: string }[];
};
base.cast = index.characters.map((character) => ({
  character: character.name,
  poses: character.poses,
  rig: character.rig,
}));
const scorePath = resolve(root, "build/library/score.json");
mkdirSync(resolve(root, "build/library"), { recursive: true });
writeFileSync(scorePath, `${JSON.stringify(base, null, 2)}\n`, "utf8");

const out = arg("out") ?? "build/library/sheets";
const child = spawn(
  process.execPath,
  [
    "--import", "tsx", "scripts/sheet.ts", "build/library/score.json",
    "--vendor", `films/${film}/vendor`,
    "--out", out,
  ],
  { cwd: root, stdio: "inherit" },
);
child.on("exit", (code) => {
  if (code === 0) console.log(`library:sheet: ${index.characters.length} character(s) in ${out}`);
  process.exit(code ?? 1);
});
