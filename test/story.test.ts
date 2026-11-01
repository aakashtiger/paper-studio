import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BeatsSchema, StorySchema, checkStory, countWords } from "../src/engine/story.js";

const root = process.cwd();
const story = StorySchema.parse(
  JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8")),
);
const beats = BeatsSchema.parse(
  JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8")),
);

const codes = (check: { errors: { code: string }[] }) => check.errors.map((error) => error.code);

test("the written example passes every rule", () => {
  const check = checkStory(story, beats);
  assert.deepEqual(check.errors, []);
  assert.equal(check.report.words, 70);
  assert.ok(Math.abs(check.report.wpm - 140) < 0.01);
  assert.equal(check.report.beats.length, 5);
});

/**
 * The tests below are the film that shipped. Each one is a defect a viewer named
 * in one sentence — "no story", "hardly any narration", "continuous hissing",
 * "slow to nil movement" — written as a refusal, so it cannot happen quietly
 * again. A checker that only passes the example is a checker that agrees with
 * whoever wrote the example.
 */

test("21 words in a minute is refused, which is what the last film did", () => {
  // Same Alarm shipped with 7 lines, 21 words and 17.8 s of speech in 60 s.
  const thin = {
    ...story,
    duration: 60,
    narration: story.narration.slice(0, 2),
  };
  const check = checkStory(thin, beats);
  assert.ok(codes(check).includes("story:wpm"), `expected a wpm refusal, got ${codes(check)}`);
  assert.match(check.errors.find((e) => e.code === "story:wpm")?.message ?? "", /wpm/);
});

test("a film with no turn is refused", () => {
  const flat = {
    ...beats,
    beats: beats.beats.map((beat) => ({ ...beat, purpose: beat.purpose === "turn" ? "escalate" : beat.purpose })),
  };
  assert.ok(codes(checkStory(story, flat)).includes("story:turn"));
});

test("a film whose energy never moves is refused", () => {
  const flat = { ...beats, beats: beats.beats.map((beat) => ({ ...beat, energy: 3 })) };
  assert.ok(codes(checkStory(story, flat)).includes("story:flat"));
});

test("a beat that owns time but says nothing is refused — the 16 s hole", () => {
  // The delivered cut gave 16.4 s to a stretch with no narration in it. Here the
  // turn owns 45% of a 30 s film and 20% of its words.
  const shares: Record<string, number> = { b01: 5, b02: 10, b03: 10, b04: 45, b05: 30 };
  const lopsided = {
    ...beats,
    beats: beats.beats.map((beat) => ({ ...beat, share: shares[beat.id] ?? beat.share })),
  };
  const check = checkStory(story, lopsided);
  const balance = check.errors.filter((error) => error.code === "story:balance");
  assert.ok(balance.length > 0, `expected a balance refusal, got ${codes(check)}`);
  assert.ok(balance.some((error) => error.message.includes("b04")), balance.map((e) => e.message).join("\n"));
});

test("a beat with no line is refused", () => {
  const silent = {
    ...story,
    narration: story.narration.filter((line) => line.beat !== "b03"),
  };
  assert.ok(codes(checkStory(silent, beats)).includes("story:beat-empty"));
});

test("a film scored wall to wall is refused — the room bed", () => {
  // The delivered master sat at -15.2 LUFS in its gaps: one 58.9 s noise bed.
  // No beat was allowed to be quiet, so nothing could ever be heard landing.
  const loud = { ...beats, beats: beats.beats.map((beat) => ({ ...beat, sound: { ...beat.sound, quiet: false } })) };
  assert.ok(codes(checkStory(story, loud)).includes("story:air"));
});

test("a line on a beat that does not exist is refused", () => {
  const orphan = {
    ...story,
    narration: story.narration.map((line, index) => (index === 0 ? { ...line, beat: "b99" } : line)),
  };
  assert.ok(codes(checkStory(orphan, beats)).includes("story:orphan"));
});

test("beats that do not add up to the film are refused", () => {
  const short = { ...beats, beats: beats.beats.map((beat, index) => (index === 0 ? { ...beat, share: 10 } : beat)) };
  assert.ok(codes(checkStory(story, short)).includes("story:share"));
});

test("a promised phrase that is never said is refused", () => {
  const promise = { ...story, mustSay: ["same alarm", "nine hours", "we will call you back"] };
  const check = checkStory(promise, beats);
  assert.ok(check.errors.some((error) => error.code === "story:must-say" && error.message.includes("call you back")));
});

test("the two documents have to be the same film", () => {
  assert.ok(codes(checkStory(story, { ...beats, id: "another-film" })).includes("story:id"));
});

test("words are counted the way a reader counts them", () => {
  assert.equal(countWords("Same alarm."), 2);
  assert.equal(countWords("He doesn't reach for it — not once."), 7);
  assert.equal(countWords("  "), 0);
});
