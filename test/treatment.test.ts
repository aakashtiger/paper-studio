import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveTreatment, type Treatment } from "../src/engine/treatment.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-kpop");
const proof = JSON.parse(
  readFileSync(resolve(root, "proofs/s2-paper/plan.json"), "utf8"),
) as Treatment;

function withShots(shots: Treatment["shots"], extra: Partial<Treatment> = {}): Treatment {
  return { ...proof, ...extra, shots };
}

test("the proof treatment resolves to a 15 s, 450-frame, three-shot plan", () => {
  const { plan, errors } = resolveTreatment(proof, styleDir);
  assert.deepEqual(errors, []);
  assert.equal(plan.duration, 15);
  assert.equal(plan.frames, 450);
  assert.equal(plan.shots.length, 3);
  assert.deepEqual(
    plan.shots.map((shot) => [shot.id, shot.start, shot.duration]),
    [
      ["s01", 0, 4],
      ["s02", 4, 5],
      ["s03", 9, 6],
    ],
  );
});

test("the proof override turns a recipe overrun into a warning", () => {
  const { warnings, errors } = resolveTreatment(proof, styleDir);
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((issue) => issue.code === "duration_outside_recipe"));
});

test("a real film may not exceed a recipe limit", () => {
  const { errors } = resolveTreatment({ ...proof, proof: false, duration: 15 }, styleDir);
  assert.ok(errors.some((issue) => issue.code === "duration_outside_recipe"));
});

test("an unknown recipe is an error", () => {
  const shots = structuredClone(proof.shots);
  const first = shots[0];
  assert.ok(first);
  first.recipe = "not_a_recipe";
  const { errors } = resolveTreatment(withShots(shots), styleDir);
  assert.ok(errors.some((issue) => issue.code === "recipe_missing"));
});

test("durations must sum to the treatment duration", () => {
  const shots = structuredClone(proof.shots);
  const first = shots[0];
  assert.ok(first);
  first.duration = 3;
  const { errors } = resolveTreatment(withShots(shots), styleDir);
  assert.ok(errors.some((issue) => issue.code === "duration_sum"));
});

test("a slot over eight words is an error", () => {
  const shots = structuredClone(proof.shots);
  const first = shots[0];
  assert.ok(first);
  first.slots["content.subtitle"] =
    "NOVA KIM ONE NIGHT ONLY SEVEN NOV PAPER STAGE LIVE";
  const { errors } = resolveTreatment(withShots(shots), styleDir);
  assert.ok(errors.some((issue) => issue.code === "words_over_limit"));
});
