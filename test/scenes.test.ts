import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkCut } from "../src/engine/cut.js";
import { ScenesSchema, checkScenes } from "../src/engine/scenes.js";
import { BeatsSchema, StorySchema, checkNarrationSync } from "../src/engine/story.js";

const root = process.cwd();
const story = StorySchema.parse(JSON.parse(readFileSync(resolve(root, "fixtures/story-min/story.json"), "utf8")));
const beats = BeatsSchema.parse(JSON.parse(readFileSync(resolve(root, "fixtures/story-min/beats.json"), "utf8")));
const fixture = JSON.parse(readFileSync(resolve(root, "fixtures/story-min/scenes.json"), "utf8"));
const scenes = () => JSON.parse(JSON.stringify(fixture));

test("a scene may declare a mood or inherit the film's", () => {
  const doc = scenes();
  doc.scenes[0].mood = "night";
  assert.equal(ScenesSchema.parse(doc).scenes[0]?.mood, "night");
  delete doc.scenes[0].mood;
  assert.equal(ScenesSchema.parse(doc).scenes[0]?.mood, undefined);
});

/** A measured clock that fits the fixture: about 0.4 s a word, scene by scene. */
function measured() {
  const out: { id: string; start: number; duration: number }[] = [];
  let sceneAt = 0;
  for (const scene of fixture.scenes as { lines: string[]; duration: number }[]) {
    let at = sceneAt;
    for (const id of scene.lines) {
      const line = story.narration.find((entry) => entry.id === id)!;
      const words = line.text.split(/\s+/).filter(Boolean).length;
      const duration = Number((words * 0.4).toFixed(3));
      out.push({ id, start: Number(at.toFixed(3)), duration });
      at += duration;
    }
    sceneAt += scene.duration;
  }
  return out;
}

test("the written fixture is a legal set of scenes", () => {
  const check = checkScenes(scenes(), story, beats, measured());
  assert.deepEqual(check.errors, []);
});

test("a line on the wrong beat is refused", () => {
  const doc = scenes();
  doc.scenes[1].lines = ["v01", "v02", "v03"];
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:line-beat" && error.message.includes('"v01"')));
});

test("a line in two scenes is refused", () => {
  const doc = scenes();
  doc.scenes[1].lines.push("v01");
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:line-twice"));
});

test("a line in no scene is refused by name", () => {
  const doc = scenes();
  doc.scenes[4].lines = [];
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:line-unplaced" && error.message.includes('"v08"')));
});

test("a beat with no scene is refused", () => {
  const doc = scenes();
  doc.scenes = doc.scenes.filter((scene: { beat: string }) => scene.beat !== "b05");
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:beat-empty" && error.message.includes("b05")));
});

test("scenes that do not cover the film are refused", () => {
  const doc = scenes();
  doc.scenes[0].duration = 3;
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:total"));
});

test("a scene that owns more air than a breath is refused", () => {
  const doc = scenes();
  // Keep the total: move 3 s from the last scene into the first.
  doc.scenes[0].duration += 3;
  doc.scenes[4].duration -= 3;
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:air" && error.message.includes("sc01")));
});

test("a scene shorter than its own words is refused", () => {
  const doc = scenes();
  doc.scenes[0].duration = 2;
  doc.scenes[4].duration += 3.55; // keep the total close enough to isolate the error
  const check = checkScenes(doc, story, beats);
  assert.ok(check.errors.some((error) => error.code === "scene:short" && error.message.includes("sc01")));
});

test("a scene that starts long before its first line is refused on the measured clock", () => {
  const clock = measured();
  const first = clock.find((line) => line.id === "v01")!;
  first.start = 2; // sc01 starts at 0
  const check = checkScenes(scenes(), story, beats, clock);
  assert.ok(check.errors.some((error) => error.code === "scene:lead" && error.message.includes("sc01")));
});

test("a scene naming someone outside the cast is refused", () => {
  const doc = scenes();
  doc.scenes[0].cast = ["Nobody"];
  const check = checkScenes(doc, story, beats, undefined, ["Kiran", "Vaz"]);
  assert.ok(check.errors.some((error) => error.code === "scene:cast" && error.message.includes("Nobody")));
});

test("the score must speak the story's words", () => {
  const lines = story.narration.map((line) => ({ id: line.id, text: line.text }));
  assert.deepEqual(checkNarrationSync(story, lines), []);

  const changed = lines.map((line, index) =>
    index === 0 ? { ...line, text: "A different first line." } : line,
  );
  const errors = checkNarrationSync(story, changed);
  assert.ok(errors.some((error) => error.code === "story:score-text" && error.message.includes('"v01"')));

  const missing = lines.slice(1);
  assert.ok(checkNarrationSync(story, missing).some((error) => error.code === "story:score-missing"));

  const extra = [...lines, { id: "v99", text: "a line nobody wrote" }];
  assert.ok(checkNarrationSync(story, extra).some((error) => error.code === "story:score-line"));
});

test("a cut must answer its scenes when scenes are authored", () => {
  const beatMap = [{ id: "b01", title: "one", share: 100, sound: { signature: "a sound", quiet: false } }];
  const sceneDocs = [{ id: "sc01", beat: "b01", duration: 5 }];
  const shots = [
    { id: "s01", start: 0, duration: 2.5, beat: "b01", scene: "sc01", reason: "the alarm starts it" },
    { id: "s02", start: 2.5, duration: 2.5, beat: "b01", scene: "sc01", reason: "the alarm ends it" },
  ];
  const clean = checkCut({
    shots,
    beats: beatMap,
    scenes: sceneDocs,
    cues: [{ id: "c1", at: 1, duration: 0.5, kind: "tick" }],
    duration: 5,
  });
  assert.deepEqual(clean.errors, []);
  assert.equal(clean.scenes[0]?.id, "sc01");

  const unbound = checkCut({
    shots: shots.map((shot, index) => (index === 0 ? { ...shot, scene: undefined } : shot)),
    beats: beatMap,
    scenes: sceneDocs,
    cues: [],
    duration: 5,
  });
  assert.ok(unbound.errors.some((error) => error.code === "cut:scene-unbound"));

  const orphan = checkCut({ shots, beats: beatMap, scenes: [{ id: "sc99", beat: "b01", duration: 5 }], cues: [], duration: 5 });
  assert.ok(orphan.errors.some((error) => error.code === "cut:scene-orphan"));

  const wrongBeat = checkCut({
    shots: shots.map((shot, index) => (index === 0 ? { ...shot, beat: "b02" } : shot)),
    beats: [...beatMap, { id: "b02", title: "two", share: 0, sound: { signature: "another", quiet: false } }],
    scenes: sceneDocs,
    cues: [],
    duration: 5,
  });
  assert.ok(wrongBeat.errors.some((error) => error.code === "cut:scene-beat"));

  const short = checkCut({ shots, beats: beatMap, scenes: [{ id: "sc01", beat: "b01", duration: 4 }], cues: [], duration: 5 });
  assert.ok(short.errors.some((error) => error.code === "cut:scene-duration"));
});
