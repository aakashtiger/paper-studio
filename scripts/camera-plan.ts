/**
 * `camera:plan` — the style's camera template, varied per film.
 *
 * It proposes one dynamic move per shot from the beat (hook orbits, setup pans,
 * escalation pushes, the turn pulls back, the release drifts, the button pushes),
 * breaks a run of the same move, and uses the film's seed for the fallback. It is
 * a dry run unless `--apply` is given.
 *
 * usage:
 *   npm run camera:plan -- films/<id>/score.json
 *   npm run camera:plan -- films/<id>/score.json --apply
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cameraOptionsFromTokens, proposeCameraPlan } from "../src/engine/camera.js";
import { FilmScoreSchema } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const scorePath = args.find((arg) => !arg.startsWith("--"));
const apply = args.includes("--apply");
const json = args.includes("--json");
if (!scorePath) {
  console.error("usage: npm run camera:plan -- <score.json> [--apply] [--json]");
  process.exit(2);
}

const root = process.cwd();
const file = resolve(root, scorePath);
const raw = JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, "")) as {
  id: string;
  seed?: string | number;
  style: string;
  shots: { id?: string; beat?: string; camera?: { move: string; from: number; to: number; ease: string } }[];
};
const tokensPath = resolve(root, "styles", raw.style, "tokens.json");
const tokens = existsSync(tokensPath)
  ? (JSON.parse(readFileSync(tokensPath, "utf8")) as { motion?: { camera?: { byBeat?: Record<string, string> } } })
  : null;
const options = cameraOptionsFromTokens(tokens);
const byBeat = tokens?.motion?.camera?.byBeat;
const proposed = proposeCameraPlan(
  raw.shots.map((shot, index) => ({ id: shot.id ?? `s${String(index + 1).padStart(2, "0")}`, beat: shot.beat })),
  { ...options, ...(byBeat ? { byBeat } : {}), seed: String(raw.seed ?? raw.id) },
);

if (json) console.log(JSON.stringify(proposed, null, 2));
else {
  console.log(`camera:plan: ${raw.id} · ${proposed.length} shots`);
  for (const shot of proposed) {
    console.log(`  ${shot.id.padEnd(4)} ${(shot.beat ?? "-").padEnd(9)} ${shot.camera.move.padEnd(10)} ${shot.camera.from} → ${shot.camera.to} · ${shot.camera.ease}`);
  }
  if (!apply) console.log("camera:plan: dry run; pass --apply to write the score");
}

if (apply) {
  proposed.forEach((shot, index) => {
    const target = raw.shots[index];
    if (target) target.camera = shot.camera;
  });
  const parsed = FilmScoreSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    console.error(`error: ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}`);
    process.exit(1);
  }
  writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
  console.log(`camera:plan: wrote ${scorePath}; run \`npm run camera:check -- ${scorePath}\``);
}
