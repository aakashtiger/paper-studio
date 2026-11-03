import test from "node:test";
import assert from "node:assert/strict";
import { checkReactions } from "../src/engine/reaction.js";

const fps = 30;
const lines = [{ id: "v01", start: 1 }];
const shot = (events: { t: number; kind: string; note: string; word?: string }[]) => [
  { id: "s01", start: 0, duration: 3, direction: { events } },
];

test("a reaction on the measured word passes", () => {
  const result = checkReactions(shot([{ t: 1, kind: "pose", note: "he hears it", word: "v01" }]), lines, fps);
  assert.deepEqual(result.findings, []);
  assert.equal(result.reactions.length, 1);
  assert.equal(result.reactions[0]?.frames, 0);
});

test("a reaction within three frames after the word passes", () => {
  const result = checkReactions(shot([{ t: 1.08, kind: "pose", note: "he hears it", word: "v01" }]), lines, fps);
  assert.deepEqual(result.findings, []);
  assert.equal(Math.round(result.reactions[0]?.frames ?? 0), 2);
});

test("a reaction before the word is refused", () => {
  const result = checkReactions(shot([{ t: 0.9, kind: "pose", note: "he hears it", word: "v01" }]), lines, fps);
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0]?.code, "reaction:early");
  assert.match(result.findings[0]?.message ?? "", /BEFORE/);
});

test("a reaction later than three frames is refused", () => {
  const result = checkReactions(shot([{ t: 1.15, kind: "pose", note: "he hears it", word: "v01" }]), lines, fps);
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0]?.code, "reaction:late");
});

test("a word that is not in the clock is refused", () => {
  const result = checkReactions(shot([{ t: 1, kind: "pose", note: "he hears it", word: "v99" }]), lines, fps);
  assert.equal(result.findings[0]?.code, "reaction:word");
});

test("an event with no word is not a reaction", () => {
  const result = checkReactions(shot([{ t: 1, kind: "pose", note: "he hears it" }]), lines, fps);
  assert.deepEqual(result.reactions, []);
  assert.deepEqual(result.findings, []);
});

test("the shot's own start is added to the event time", () => {
  const result = checkReactions(
    [{ id: "s02", start: 5, duration: 2, direction: { events: [{ t: 0.05, kind: "hand", note: "the hand answers", word: "v01" }] } }],
    [{ id: "v01", start: 5.05 }],
    fps,
  );
  assert.deepEqual(result.findings, []);
  assert.equal(result.reactions[0]?.at, 5.05);
});
