import test from "node:test";
import assert from "node:assert/strict";
import {
  CAMERA_BY_BEAT,
  cameraOptionsFromTokens,
  checkCameraPlan,
  proposeCameraPlan,
  type CameraPlanShot,
} from "../src/engine/camera.js";

const shot = (id: string, move: string, from = 1, to = 1.05, beat = "setup"): CameraPlanShot => ({
  id,
  beat,
  camera: { move, from, to, ease: "easeOut" },
});

test("a varied, moving camera plan passes", () => {
  const report = checkCameraPlan([
    shot("s01", "orbit", 1, 1.04, "hook"),
    shot("s02", "pan", 1, 1.03, "setup"),
    shot("s03", "push_in", 1, 1.06, "escalate"),
    shot("s04", "pull_back", 1.08, 1, "turn"),
    shot("s05", "orbit", 1, 1.04, "release"),
    shot("s06", "push_in", 1, 1.08, "button"),
  ]);
  assert.deepEqual(report.errors, []);
  assert.ok(report.distinct.length >= 4);
});

test("a still shot, a missing camera, and a move with no travel are refused", () => {
  const report = checkCameraPlan([
    shot("s01", "static"),
    { id: "s02", beat: "setup" },
    shot("s03", "push_in", 1, 1),
  ]);
  assert.ok(report.errors.some((error) => error.code === "camera:static"));
  assert.ok(report.errors.some((error) => error.code === "camera:missing"));
  assert.ok(report.errors.some((error) => error.code === "camera:delta"));
});

test("a push that pulls and a pull that pushes are refused", () => {
  const report = checkCameraPlan([
    shot("s01", "push_in", 1.1, 1),
    shot("s02", "pull_back", 1, 1.1),
    shot("s03", "pan"),
  ]);
  assert.equal(report.errors.filter((error) => error.code === "camera:sign").length, 2);
});

test("too little variety and a long run are refused", () => {
  const report = checkCameraPlan([
    shot("s01", "push_in"),
    shot("s02", "push_in"),
    shot("s03", "push_in"),
    shot("s04", "push_in"),
  ]);
  assert.ok(report.errors.some((error) => error.code === "camera:variety"));
  assert.ok(report.errors.some((error) => error.code === "camera:run"));
});

test("the style's grammar is read from tokens", () => {
  const options = cameraOptionsFromTokens({
    motion: { camera: { requireMove: true, minDistinct: 4, maxRun: 1 } },
  });
  assert.deepEqual(options, { requireMove: true, minDistinct: 4, maxRun: 1 });
  assert.equal(cameraOptionsFromTokens({}).requireMove, undefined);
});

test("the proposed plan is dynamic, varied, and follows the beat", () => {
  const shots: CameraPlanShot[] = [
    { id: "s01", beat: "hook" },
    { id: "s02", beat: "setup" },
    { id: "s03", beat: "escalate" },
    { id: "s04", beat: "turn" },
    { id: "s05", beat: "release" },
    { id: "s06", beat: "button" },
  ];
  const plan = proposeCameraPlan(shots, { seed: "same-alarm" });
  assert.equal(plan[0]?.camera.move, "orbit");
  assert.equal(plan[1]?.camera.move, "pan");
  assert.equal(plan[2]?.camera.move, "push_in");
  assert.equal(plan[3]?.camera.move, "pull_back");
  const report = checkCameraPlan(plan.map((entry) => ({ id: entry.id, beat: entry.beat, camera: entry.camera })));
  assert.deepEqual(report.errors, []);
  assert.ok(plan.every((entry) => entry.camera.move !== "static"));
  assert.ok(plan.some((entry) => entry.camera.move === "push_in"));
  assert.equal(CAMERA_BY_BEAT.button, "push_in");
});
