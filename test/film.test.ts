import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveFilm, type FilmScore } from "../src/engine/treatment.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-kpop");
const pilot = JSON.parse(
  readFileSync(resolve(root, "films/understudy/score.json"), "utf8"),
) as FilmScore;

function clone(): FilmScore {
  return structuredClone(pilot);
}

test("the pilot score resolves to 30 s, 900 frames, nine legal shots", () => {
  const { plan, errors } = resolveFilm(pilot, styleDir);
  assert.deepEqual(errors, []);
  assert.equal(plan.duration, 30);
  assert.equal(plan.frames, 900);
  assert.equal(plan.shots.length, 9);
  assert.deepEqual(
    plan.shots.map((shot) => shot.duration),
    [2.2, 3.3, 3.4, 1.6, 2.8, 2.1, 4.1, 5.1, 5.4],
  );
  assert.equal(plan.shots[8]?.start, 24.6);
  assert.equal(plan.shots[0]?.direction.events.length, 3);
});

test("the shot direction survives resolution", () => {
  const { plan } = resolveFilm(pilot, styleDir);
  const shot = plan.shots[7];
  assert.ok(shot);
  assert.equal(shot.direction.spine.length > 0, true);
  assert.equal(shot.direction.events.length, 5);
});

test("a film cannot declare the old proof override", () => {
  const score = { ...clone(), proof: true };
  assert.throws(() => resolveFilm(score, styleDir));
});

test("a 12.5 s slice is not a film", () => {
  const score = clone();
  score.duration = 12.5;
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "duration_unsupported"));
});

test("an event outside its shot is an error", () => {
  const score = clone();
  const shot = score.shots[0];
  assert.ok(shot);
  shot.direction.events[0] = { t: shot.duration + 1, kind: "type", note: "late" };
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "event_outside_shot"));
});

test("fewer than three events fails the schema", () => {
  const score = clone();
  const shot = score.shots[0];
  assert.ok(shot);
  shot.direction.events = shot.direction.events.slice(0, 2);
  assert.throws(() => resolveFilm(score, styleDir));
});

test("a median outside the band is an error", () => {
  const score = clone();
  score.edit.medianShot = 4.5;
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "median_outside_band"));
});

test("a caption that does not match its narration is an error", () => {
  const score = clone();
  const caption = score.captions.lines[0];
  assert.ok(caption);
  caption.text = "A different line.";
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "caption_text"));
});

test("a recorded narration film without a voice file is an error", () => {
  const score = clone();
  if (score.audio.narration) delete score.audio.narration.voice;
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "audio_voice_missing"));
});

test("asset hashes must be real sha256 values", () => {
  const score = clone();
  const asset = score.assets[0];
  assert.ok(asset);
  asset.hash = "sha256:not-a-hash";
  assert.throws(() => resolveFilm(score, styleDir));
});

test("duplicate assets are an error", () => {
  const score = clone();
  const asset = score.assets[0];
  assert.ok(asset);
  score.assets.push({ ...asset });
  const { errors } = resolveFilm(score, styleDir);
  assert.ok(errors.some((issue) => issue.code === "asset_duplicate"));
});
