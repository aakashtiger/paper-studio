import test from "node:test";
import assert from "node:assert/strict";
import { isCaptionChunk, splitCaption } from "../src/engine/captions.js";

test("a long line splits into phone-sized chunks without losing a word", () => {
  const text =
    "Uber does not own the cars, the kitchens, or the freight it moves; it owns the network that connects them.";
  const chunks = splitCaption(text, 8);
  assert.deepEqual(chunks.map((chunk) => chunk.split(/\s+/).length), [8, 8, 4]);
  assert.equal(chunks.join(" "), text);
});

test("a line shorter than the limit is one chunk", () => {
  assert.deepEqual(splitCaption("More riders, shorter waits.", 8), ["More riders, shorter waits."]);
});

test("a caption must be a contiguous word run of its line", () => {
  const line = "Uber takes a service fee from each fare; the driver keeps the rest.";
  assert.equal(isCaptionChunk(line, "Uber takes a service fee"), true);
  assert.equal(isCaptionChunk(line, "a service fee from each fare;"), true);
  assert.equal(isCaptionChunk(line, "the driver takes a service fee"), false);
  assert.equal(isCaptionChunk(line, "service fee from each fare; the driver"), true);
});
