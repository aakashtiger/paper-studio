import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmBriefSchema } from "../src/engine/film-brief.js";
import { filmSkeleton, filmGaps } from "../src/engine/film-new.js";

const root = process.cwd();

const brief = FilmBriefSchema.parse({
  id: "first-film",
  title: "A First Film",
  audience: "friends",
  style: "paper-kpop",
  styleVersion: "0.1.0",
  aspect: "16:9",
  duration: 30,
  fps: 30,
  audioMode: "narration",
  references: [],
  mustSay: [],
});

test("the skeleton carries only what the brief states", () => {
  const skeleton = filmSkeleton(brief, { briefPath: "films/first-film/brief.json" });
  assert.equal(skeleton.id, "first-film");
  assert.equal(skeleton.style, "paper-kpop");
  assert.equal(skeleton.styleVersion, "0.1.0");
  assert.equal(skeleton.aspect, "16:9");
  assert.equal(skeleton.duration, 30);
  assert.equal(skeleton.fps, 30);
  assert.equal(skeleton.brief, "films/first-film/brief.json");
  assert.equal(skeleton.seed, "first-film");
});

test("the skeleton invents no shot, recipe or copy", () => {
  const skeleton = filmSkeleton(brief, { briefPath: "b.json" });
  assert.deepEqual(skeleton.shots, []);
  assert.deepEqual(skeleton.assets, []);
  assert.deepEqual((skeleton.captions as { lines: unknown[] }).lines, []);
  // No recipe id, no note and no caption text anywhere.
  const text = JSON.stringify(skeleton);
  assert.ok(!text.includes("recipe"));
  assert.ok(!text.includes("note"));
});

test("filmGaps names every creative field the director must fill", () => {
  const gaps = filmGaps(filmSkeleton(brief, { briefPath: "b.json" }));
  assert.equal(gaps.length, 5);
  assert.ok(gaps.some((gap) => gap.startsWith("edit.")));
  assert.ok(gaps.some((gap) => gap.startsWith("audio.narration")));
  assert.ok(gaps.some((gap) => gap.startsWith("captions.lines")));
  assert.ok(gaps.some((gap) => gap.startsWith("assets")));
  assert.ok(gaps.some((gap) => gap.startsWith("shots")));
});

test("filmGaps is silent for a finished score", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/understudy/score.json"), "utf8"));
  assert.deepEqual(filmGaps(score), []);
});

test("filmGaps names a shot that is missing its direction", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/understudy/score.json"), "utf8"));
  score.shots[1].direction.events = [];
  delete score.shots[2].direction.spine;
  const gaps = filmGaps(score);
  assert.ok(gaps.some((gap) => gap.includes("#2") && gap.includes("events")));
  assert.ok(gaps.some((gap) => gap.includes("#3") && gap.includes("entry, exit and spine")));
});
