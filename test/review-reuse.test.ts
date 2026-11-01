import test from "node:test";
import assert from "node:assert/strict";
import { mayReuse, type ReuseQuestion } from "../src/engine/review.js";

/**
 * A review may print a report it did not write this run, but only when the
 * report is provably about *this* film (decision 0033). Each case below is a way
 * that could go wrong and print a lie on the one page a director reads.
 */
const picture = (over: Partial<ReuseQuestion> = {}): ReuseQuestion => ({
  report: { pass: true, videoHash: "sha256:the-picture" },
  tie: "picture",
  frozenHash: "sha256:the-picture",
  scoreNow: "sha256:the-score",
  writtenAt: 2_000,
  paintChangedAt: 1_000,
  ...over,
});

const paint = (over: Partial<ReuseQuestion> = {}): ReuseQuestion => ({
  report: { pass: true, score: "sha256:the-score" },
  tie: "score",
  frozenHash: "sha256:the-picture",
  scoreNow: "sha256:the-score",
  writtenAt: 2_000,
  paintChangedAt: 1_000,
  ...over,
});

test("a video audit is reused when it measured the picture the film ships", () => {
  const verdict = mayReuse(picture());
  assert.equal(verdict.ok, true);
  assert.match(verdict.why, /measured on this picture/);
});

test("a video audit on any other picture is re-measured", () => {
  const verdict = mayReuse(picture({ report: { pass: true, videoHash: "sha256:an-older-cut" } }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /different picture/);
});

test("a video audit is not reused before there is a picture to tie it to", () => {
  // The manifest is the tie. Without it, `deliver` could still be about to move
  // the file the report describes.
  const verdict = mayReuse(picture({ frozenHash: null }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /no picture hash yet/);
});

test("a video report that names no picture is re-measured", () => {
  const verdict = mayReuse(picture({ report: { pass: true } }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /names no picture/);
});

test("a paint audit is reused when it measured this score, through this painter", () => {
  const verdict = mayReuse(paint());
  assert.equal(verdict.ok, true);
  assert.match(verdict.why, /this score and this painter/);
});

test("a paint audit from before the painter changed is re-measured", () => {
  // The report measured frames a painter drew that no longer exists.
  const verdict = mayReuse(paint({ paintChangedAt: 3_000 }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /paint code changed after the report was written/);
});

test("a paint audit on a different score is re-measured", () => {
  const verdict = mayReuse(paint({ report: { pass: true, score: "sha256:an-earlier-edit" } }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /different score/);
});

test("a paint report written by an older build, naming no score, is re-measured", () => {
  // This is the shape every report had before decision 0033, which is why the
  // audits now publish the score they measured.
  const verdict = mayReuse(paint({ report: { pass: true } }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /names no score/);
});

test("a report with no timestamp cannot be tied to the painter", () => {
  const verdict = mayReuse(paint({ writtenAt: null }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.why, /no timestamp/);
});

test("no report at all means the step runs", () => {
  assert.equal(mayReuse(picture({ report: null })).ok, false);
  assert.match(mayReuse(picture({ report: null })).why, /no report on disk/);
});
