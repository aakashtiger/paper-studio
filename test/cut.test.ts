import test from "node:test";
import assert from "node:assert/strict";
import { checkCut, type CutBeat, type CutCue, type CutShot } from "../src/engine/cut.js";

/**
 * A fifteen-second cut that is in sync with its beat sheet: three beats, six
 * shots, one quiet beat with nothing in it, a signature sound in each of the
 * other two. Every test below breaks exactly one of those agreements.
 */
const beats: CutBeat[] = [
  { id: "b01", title: "the alarm", share: 33, sound: { signature: "three chirps", quiet: false } },
  { id: "b02", title: "the turn", share: 33, sound: { signature: "a chair rolls to a stop", quiet: true } },
  { id: "b03", title: "the button", share: 34, sound: { signature: "no hand arrives", quiet: false } },
];

const shots: CutShot[] = [
  { id: "s01", start: 0, duration: 2.5, beat: "b01", reason: "the alarm starts the day" },
  { id: "s02", start: 2.5, duration: 2.5, beat: "b01", reason: "the lamp finds the phone" },
  { id: "s03", start: 5, duration: 2.5, beat: "b02", reason: "the room empties quietly" },
  { id: "s04", start: 7.5, duration: 2.5, beat: "b02", reason: "he stays in the dark" },
  { id: "s05", start: 10, duration: 2.5, beat: "b03", reason: "the alarm again at six" },
  { id: "s06", start: 12.5, duration: 2.5, beat: "b03", reason: "no hand reaches for it" },
];

const cues: CutCue[] = [
  { id: "c1", at: 0.5, kind: "hum" },
  { id: "c3", at: 10.5, kind: "hum" },
];

const run = (over: { shots?: CutShot[]; beats?: CutBeat[]; cues?: CutCue[]; duration?: number } = {}) =>
  checkCut({ shots, beats, cues, duration: 15, ...over });

const codes = (report: ReturnType<typeof run>) => report.errors.map((error) => error.code);

test("a cut in sync with its beats passes, and its scenes are the runs of shots", () => {
  const report = run();
  assert.deepEqual(report.errors, []);
  assert.equal(report.scenes.length, 3);
  assert.deepEqual(report.scenes.map((scene) => scene.beat), ["b01", "b02", "b03"]);
  assert.equal(report.scenes[0]?.shots.length, 2);
  assert.equal(report.scenes[2]?.to, 15);
  assert.equal(report.beats[1]?.quiet, true);
});

test("a shot that serves no beat is refused, and the message counts them", () => {
  // The delivered film: ten shots, none bound to anything.
  const unbound = shots.map((shot, index) => (index === 0 || index === 1 ? { ...shot, beat: undefined } : shot));
  const report = run({ shots: unbound });
  const error = report.errors.find((issue) => issue.code === "cut:unbound");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /2 of 6 shots/);
});

test("a beat that is written and never filmed is refused", () => {
  const report = run({ shots: shots.filter((shot) => shot.beat !== "b02") });
  assert.ok(codes(report).includes("cut:uncovered"));
});

test("a shot bound to a beat that does not exist is refused", () => {
  const report = run({ shots: shots.map((shot, index) => (index === 2 ? { ...shot, beat: "b99" } : shot)) });
  assert.ok(codes(report).includes("cut:orphan"));
});

test("a beat that takes more of the film than it wrote is refused — the 16 s hole, at shot level", () => {
  // The turn is 33% of the writing and 73% of the shots.
  const heavy = shots.map((shot) => ({ ...shot, beat: shot.id === "s01" || shot.id === "s02" ? "b01" : "b02" }));
  const report = run({ shots: heavy, cues: [{ id: "c1", at: 0.5, kind: "hum" }] });
  const error = report.errors.find((issue) => issue.code === "cut:share");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /b02/);
  assert.match(error.message, /drift/);
});

test("a beat whose signature sound never plays is refused", () => {
  const report = run({ cues: [{ id: "c1", at: 0.5, kind: "hum" }] });
  const error = report.errors.find((issue) => issue.code === "cut:signature");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /no hand arrives/);
});

test("a beat declared quiet may not be scored", () => {
  const report = run({ cues: [...cues, { id: "c2", at: 6, kind: "step" }] });
  assert.ok(codes(report).includes("cut:quiet-scored"));
});

test("a shot with no reason is cut", () => {
  const report = run({ shots: shots.map((shot, index) => (index === 3 ? { ...shot, reason: "" } : shot)) });
  const error = report.errors.find((issue) => issue.code === "cut:reason");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /"s04"/);
  assert.match(error.message, /no reason/);
});

test("a two-word label is not a reason", () => {
  const report = run({ shots: shots.map((shot, index) => (index === 0 ? { ...shot, reason: "alarm rings" } : shot)) });
  assert.ok(codes(report).includes("cut:reason"));
});

test("cross-cutting is named but not refused", () => {
  const crossed = shots.map((shot) => (shot.id === "s04" ? { ...shot, beat: "b01" } : shot));
  const report = run({ shots: crossed });
  assert.ok(report.warnings.some((warning) => warning.code === "cut:revisit"));
});
