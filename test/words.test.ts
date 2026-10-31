import test from "node:test";
import assert from "node:assert/strict";
import {
  attachWords,
  coverage,
  deriveClockLines,
  matchingBlocks,
  normalizeWord,
  snapShots,
  unheard,
  type HeardWord,
} from "../src/engine/words.js";

const heard = (word: string, start: number, end: number): HeardWord => ({ word, start, end });

test("normalizeWord keeps letters and digits only", () => {
  assert.equal(normalizeWord("Night,"), "night");
  assert.equal(normalizeWord("1919"), "1919");
  assert.equal(normalizeWord("Nineteen-nineteen"), "nineteennineteen");
  assert.equal(normalizeWord("…"), "");
});

test("matchingBlocks finds the runs two lists share", () => {
  assert.deepEqual(matchingBlocks(["a", "b", "c"], ["a", "b", "c"]), [[0, 0, 3]]);
  assert.deepEqual(matchingBlocks(["a", "x", "c"], ["a", "b", "c"]), [
    [0, 0, 1],
    [2, 2, 1],
  ]);
});

test("a matched word keeps the time the reader actually said it", () => {
  const words = attachWords(
    ["Every", "night,", "the"],
    [heard("Every", 0.5, 0.9), heard("night", 0.9, 1.3), heard("the", 1.3, 1.5)],
    5,
  );
  assert.deepEqual(words, [
    { word: "Every", start: 0.5, end: 0.9 },
    { word: "night,", start: 0.9, end: 1.3 },
    { word: "the", start: 1.3, end: 1.5 },
  ]);
});

test("a word the recogniser split shares the heard span by length", () => {
  const words = attachWords(["nineteen", "nineteen"], [heard("Nineteen-nineteen", 1, 2)], 5);
  assert.equal(words.length, 2);
  assert.ok(Math.abs(words[0]!.start - 1) < 1e-9);
  assert.ok(Math.abs(words[0]!.end - 1.5) < 1e-9);
  assert.ok(Math.abs(words[1]!.start - 1.5) < 1e-9);
  assert.ok(Math.abs(words[1]!.end - 2) < 1e-9);
});

test("a word the recogniser missed shares the gap between its neighbours", () => {
  const words = attachWords(["a", "b", "c"], [heard("a", 0, 1), heard("c", 2, 3)], 5);
  assert.equal(words[1]!.word, "b");
  assert.equal(words[1]!.start, 1);
  assert.equal(words[1]!.end, 2);
});

test("attachWords ignores tokens with no content", () => {
  const words = attachWords(["hello", "—", "world"], [heard("hello", 0, 1), heard("world", 1, 2)], 3);
  assert.equal(words.length, 2);
  assert.deepEqual(words.map((word) => word.word), ["hello", "world"]);
});

test("deriveClockLines takes each line's start and duration from the read", () => {
  const timed = attachWords(
    ["Every", "night,", "the", "lamp."],
    [heard("Every", 0.4, 0.8), heard("night", 0.8, 1.3), heard("the", 2, 2.1), heard("lamp", 2.1, 2.6)],
    5,
  );
  const lines = deriveClockLines(
    [
      { id: "v01", text: "Every night,", hold: 0.5 },
      { id: "v02", text: "the lamp." },
    ],
    timed,
  );
  assert.deepEqual(lines[0], { id: "v01", text: "Every night,", start: 0.4, duration: 0.9, hold: 0.5 });
  assert.deepEqual(lines[1], { id: "v02", text: "the lamp.", start: 2, duration: 0.6 });
});

test("snapShots moves a boundary near a phrase beat and keeps the film length", () => {
  const shots = [
    { id: "s1", start: 0, duration: 4 },
    { id: "s2", start: 4, duration: 4 },
    { id: "s3", start: 8, duration: 4 },
  ];
  const { shots: snapped, moved } = snapShots(shots, [0, 3.8, 12], 0.35);
  assert.equal(snapped[1]!.start, 3.8);
  assert.equal(snapped[0]!.duration, 3.8);
  assert.equal(snapped[2]!.start, 8);
  assert.equal(snapped.reduce((sum, shot) => sum + shot.duration, 0), 12);
  assert.deepEqual(moved, [{ id: "s2", from: 4, to: 3.8 }]);
});

test("snapShots leaves a boundary that is far from every beat", () => {
  const shots = [
    { id: "s1", start: 0, duration: 4 },
    { id: "s2", start: 4, duration: 4 },
  ];
  const { moved } = snapShots(shots, [1, 9], 0.35);
  assert.deepEqual(moved, []);
});

test("coverage and unheard agree about what was not heard", () => {
  const script = ["Nova", "is", "the", "star"];
  const all = [heard("Nova", 0, 1), heard("is", 1, 2), heard("the", 2, 3), heard("star", 3, 4)];
  assert.equal(coverage(script, all), 1);
  assert.deepEqual(unheard(script, all), []);

  const partial = [heard("Nova", 0, 1), heard("the", 2, 3), heard("star", 3, 4)];
  assert.equal(coverage(script, partial), 0.75);
  assert.deepEqual(unheard(script, partial), ["is"]);
});

test("coverage of an empty script is one, not a division by zero", () => {
  assert.equal(coverage([], []), 1);
});
