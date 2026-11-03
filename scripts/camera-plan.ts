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
import { dirname, resolve } from "node:path";
import { checkCameraPlan, cameraOptionsFromTokens, proposeCameraPlan } from "../src/engine/camera.js";
import { BeatsSchema } from "../src/engine/story.js";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const scorePath = args.find((arg) => !arg.startsWith("--"));
const apply = args.includes("--apply");
const force = args.includes("--force");
const json = args.includes("--json");
if (!scorePath) {
  console.error("usage: npm run camera:plan -- <score.json> [--apply] [--force] [--json]");
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

// The score stores beat ids; the grammar is keyed by beat purpose. Read the
// beats beside the score so `b01` resolves to `hook`, not to a missing key.
const beatsPath = resolve(dirname(file), "beats.json");
const purposeById = new Map<string, string>();
if (existsSync(beatsPath)) {
  const beats = BeatsSchema.parse(JSON.parse(readFileSync(beatsPath, "utf8").replace(/^\uFEFF/, "")));
  for (const beat of beats.beats) purposeById.set(beat.id, beat.purpose);
}
const proposed = proposeCameraPlan(
  raw.shots.map((shot, index) => ({
    id: shot.id ?? `s${String(index + 1).padStart(2, "0")}`,
    beat: (shot.beat && purposeById.get(shot.beat)) ?? shot.beat,
  })),
  { ...options, ...(byBeat ? { byBeat } : {}), seed: String(raw.seed ?? raw.id) },
);
const applied = raw.shots.map((shot, index) => (force || !shot.camera ? proposed[index]!.camera : shot.camera));

if (json) console.log(JSON.stringify(proposed, null, 2));
else {
  console.log(`camera:plan: ${raw.id} · ${proposed.length} shots${force ? " · overwrite" : " · keep authored cameras"}`);
  for (const [index, shot] of proposed.entries()) {
    const kept = !force && raw.shots[index]?.camera;
    console.log(
      `  ${shot.id.padEnd(4)} ${(shot.beat ?? "-").padEnd(9)} ${shot.camera.move.padEnd(10)} ${shot.camera.from} → ${shot.camera.to} · ${shot.camera.ease}${kept ? " (kept)" : ""}`,
    );
  }
  if (!apply) console.log("camera:plan: dry run; pass --apply to write the score (--force overwrites authored cameras)");
}

if (apply) {
  const check = checkCameraPlan(
    raw.shots.map((shot, index) => ({
      id: shot.id ?? `s${String(index + 1).padStart(2, "0")}`,
      beat: shot.beat,
      camera: applied[index],
    })),
    options,
  );
  if (check.errors.length > 0) {
    for (const error of check.errors) console.error(`error: ${error.message}`);
    console.error("camera:plan: the proposed camera is not legal; the score was not changed");
    process.exit(1);
  }
  applied.forEach((camera, index) => {
    const target = raw.shots[index];
    if (target) target.camera = camera;
  });
  const parsed = FilmScoreSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    console.error(`error: ${first?.path.join(".") || "(root)"}: ${first?.message ?? "invalid"}`);
    process.exit(1);
  }
  const resolved = resolveFilm(parsed.data, resolve(root, "styles", parsed.data.style), root);
  if (resolved.errors.length > 0) {
    for (const error of resolved.errors) console.error(`error: ${error.message}`);
    process.exit(1);
  }
  writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
  console.log(`camera:plan: wrote ${scorePath}; run \`npm run camera:check -- ${scorePath}\` and \`npm run embed -- ${scorePath}\``);
}
