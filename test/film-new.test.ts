import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmBriefSchema } from "../src/engine/film-brief.js";
import { beatsSkeleton, filmGaps, filmSkeleton, sceneGaps, scenesSkeleton, storyGaps, storySkeleton } from "../src/engine/film-new.js";

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
  assert.equal(gaps.length, 8);
  assert.ok(gaps.some((gap) => gap.startsWith("edit.")));
  assert.ok(gaps.some((gap) => gap.startsWith("audio.narration")));
  assert.ok(gaps.some((gap) => gap.startsWith("captions.lines")));
  assert.ok(gaps.some((gap) => gap.startsWith("assets")));
  assert.ok(gaps.some((gap) => gap.startsWith("shots")));
  assert.ok(gaps.some((gap) => gap.startsWith("performance:")));
  assert.ok(gaps.some((gap) => gap.startsWith("paletteScript:")));
  assert.ok(gaps.some((gap) => gap.startsWith("motifs:")));
});

test("filmGaps names the identity fields a pre-contract film has not chosen", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8"));
  const gaps = filmGaps(score);
  assert.ok(gaps.some((gap) => gap.startsWith("performance:")));
  assert.ok(gaps.some((gap) => gap.startsWith("paletteScript:")));
  assert.ok(gaps.some((gap) => gap.startsWith("motifs:")));
});

test("filmGaps names a shot that is missing its direction", () => {
  const score = JSON.parse(readFileSync(resolve(root, "films/understudy/score.json"), "utf8"));
  score.shots[1].direction.events = [];
  delete score.shots[2].direction.spine;
  const gaps = filmGaps(score);
  assert.ok(gaps.some((gap) => gap.includes("#2") && gap.includes("events")));
  assert.ok(gaps.some((gap) => gap.includes("#3") && gap.includes("entry, exit and spine")));
});

/**
 * The front door writes the film in the order it is written, not just the last
 * document. Before 0030 it wrote only the score, which is how a film came to
 * begin at its shot list: the only document the tool offered was the last one.
 */
test("the front door writes the story, the beats, the scenes and the score — in that order", () => {
  const story = storySkeleton(brief, { briefPath: "films/first-film/brief.json" });
  const beats = beatsSkeleton(brief);
  const scenes = scenesSkeleton(brief);
  assert.equal(story.id, "first-film");
  assert.equal(story.duration, 30);
  assert.equal(beats.id, "first-film");
  assert.deepEqual(beats.beats, []);
  assert.equal(scenes.id, "first-film");
  assert.deepEqual(scenes.scenes, []);
});

test("the story skeleton states the pace it will be judged against, and invents nothing else", () => {
  const story = storySkeleton(brief, { briefPath: "b.json" });
  assert.deepEqual(story.pace, { wpm: [180, 190], medianShot: [2.5, 3] });
  assert.deepEqual(story.narration, []);
  assert.deepEqual(story.spine, { want: "", obstacle: "", turn: "", button: "" });
  // Nothing a person has to mean is written for them.
  for (const field of ["title", "audience", "tone", "logline"]) assert.equal(story[field], "");
});

test("storyGaps names every sentence the director has to mean", () => {
  const gaps = storyGaps(storySkeleton(brief, { briefPath: "b.json" }), beatsSkeleton(brief));
  for (const field of ["title", "audience", "tone", "logline", "spine.want", "spine.obstacle", "spine.turn", "spine.button"]) {
    assert.ok(gaps.includes(field), `${field} not in ${gaps.join(", ")}`);
  }
  assert.ok(gaps.some((gap) => gap.startsWith("narration")));
  assert.ok(gaps.some((gap) => gap.startsWith("beats:")));
});

test("storyGaps is silent for a film that was written to the rules", () => {
  const story = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8"));
  const beats = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8"));
  assert.deepEqual(storyGaps(story, beats), []);
});

test("storyGaps refuses beats that do not add up to the whole film", () => {
  const story = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8"));
  const beats = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8"));
  beats.beats[0].share = beats.beats[0].share + 5;
  const gaps = storyGaps(story, beats);
  assert.ok(gaps.some((gap) => gap.includes("add up to")), gaps.join(", "));
});

test("sceneGaps is silent for the written fixture", () => {
  const story = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8"));
  const beats = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8"));
  const scenes = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/scenes.json"), "utf8"));
  assert.deepEqual(sceneGaps(scenes, story, beats), []);
});

test("sceneGaps names a missing place, a line on the wrong beat and an unplaced line", () => {
  const story = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8"));
  const beats = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8"));
  const scenes = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/scenes.json"), "utf8"));
  delete scenes.scenes[0].place;
  scenes.scenes[1].lines = ["v01"]; // v01 belongs to b01, not b02
  const gaps = sceneGaps(scenes, story, beats);
  assert.ok(gaps.some((gap) => gap.startsWith("scenes[0]: id, title, place and summary")), gaps.join(", "));
  assert.ok(gaps.some((gap) => gap.includes('"v01" belongs to beat "b01"')), gaps.join(", "));
  assert.ok(gaps.some((gap) => gap.includes('"v02" is in story.json and in no scene')), gaps.join(", "));
});

test("sceneGaps names a beat with no scene and a wrong total", () => {
  const story = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8"));
  const beats = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8"));
  const scenes = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/scenes.json"), "utf8"));
  scenes.scenes = scenes.scenes.filter((scene: { beat: string }) => scene.beat !== "b05");
  const gaps = sceneGaps(scenes, story, beats);
  assert.ok(gaps.some((gap) => gap.includes('beat "b05" has no scene')), gaps.join(", "));
  assert.ok(gaps.some((gap) => gap.includes("add up to")), gaps.join(", "));
});
