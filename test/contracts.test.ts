import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AudioPlanSchema, resolveAudio } from "../src/engine/audio.js";
import { AssetRefSchema, resolveAssets } from "../src/engine/assets.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { FilmBriefSchema, resolveBrief } from "../src/engine/film-brief.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-kpop");
const brief = FilmBriefSchema.parse(
  JSON.parse(readFileSync(resolve(root, "films/understudy/brief.json"), "utf8")),
);
const nova = PoseLibrarySchema.parse(
  JSON.parse(readFileSync(resolve(root, "films/understudy/cast/nova.poses.json"), "utf8")),
);

test("the fixture brief resolves against the paper pack", () => {
  const { errors } = resolveBrief(brief, styleDir);
  assert.deepEqual(errors, []);
});

test("a brief with an unsupported aspect fails", () => {
  const { errors } = resolveBrief({ ...brief, aspect: "4:3" }, styleDir);
  assert.ok(errors.some((issue) => issue.code === "brief_aspect"));
});

test("a brief with an unsupported duration fails", () => {
  const { errors } = resolveBrief({ ...brief, duration: 12.5 }, styleDir);
  assert.ok(errors.some((issue) => issue.code === "brief_duration"));
});

test("narration needs a transcript and an srt", () => {
  const plan = AudioPlanSchema.parse({
    mode: "narration",
    narration: { source: "tts", provider: "kokoro", voiceId: "voice-1" },
    sfx: { source: "generated", cues: [] },
  });
  const { errors } = resolveAudio(plan, { duration: 30, clockMode: "narration", root });
  assert.ok(errors.some((issue) => issue.code === "audio_transcript_missing"));
  assert.ok(errors.some((issue) => issue.code === "audio_srt_missing"));
});

test("a tts narration must name its provider", () => {
  const plan = AudioPlanSchema.parse({
    mode: "narration",
    narration: { source: "tts", voiceId: "voice-1" },
  });
  const { errors } = resolveAudio(plan, { duration: 30, clockMode: "narration", root });
  assert.ok(errors.some((issue) => issue.code === "audio_provider_missing"));
});

test("library music without a licence fails", () => {
  const plan = AudioPlanSchema.parse({
    mode: "music",
    music: { source: "library", track: "films/understudy/voice.wav" },
  });
  const { errors } = resolveAudio(plan, { duration: 30, clockMode: "music", root });
  assert.ok(errors.some((issue) => issue.code === "audio_license_missing"));
});

test("a cue outside the film fails", () => {
  const plan = AudioPlanSchema.parse({
    mode: "sfx",
    sfx: { source: "generated", cues: [{ id: "late", at: 31, kind: "hit" }] },
  });
  const { errors } = resolveAudio(plan, { duration: 30, clockMode: "sfx", root });
  assert.ok(errors.some((issue) => issue.code === "sfx_outside_film"));
});

test("the fixture pose library has eight poses and four expressions", () => {
  assert.equal(nova.poses.length, 8);
  assert.equal(nova.expressions.length, 4);
  const { errors } = resolvePoseLibrary(nova);
  assert.deepEqual(errors, []);
});

test("a pose library with fewer than eight poses fails the schema", () => {
  assert.throws(() =>
    PoseLibrarySchema.parse({
      ...nova,
      poses: nova.poses.slice(0, 7),
    }),
  );
});

test("duplicate poses fail resolution", () => {
  const { errors } = resolvePoseLibrary({
    ...nova,
    poses: nova.poses.map((pose, index) => (index === 1 ? { ...pose, name: "idle" } : pose)),
  });
  assert.ok(errors.some((issue) => issue.code === "pose_duplicate"));
});

test("a plank arm and a hand smaller than its thumb are refused", () => {
  const body = {
    arm: { upper: 104, fore: 88, minElbow: 0.02 },
    hand: { w: 22, h: 32, thumbW: 7.6, thumbH: 11.2 },
  };
  const withBody = PoseLibrarySchema.parse({
    ...nova,
    body,
    poses: nova.poses.map((pose, index) =>
      index === 0 ? { ...pose, params: { ...pose.params, armL: [0.1, 0], armR: [0.2, 0] } } : pose,
    ),
  });
  const { errors } = resolvePoseLibrary(withBody);
  assert.ok(errors.some((issue) => issue.code === "body:plank"));

  const tinyHand = PoseLibrarySchema.parse({
    ...withBody,
    body: { ...body, hand: { w: 5, h: 6, thumbW: 7.6, thumbH: 11.2 } },
  });
  assert.ok(resolvePoseLibrary(tinyHand).errors.some((issue) => issue.code === "body:hand"));
});

test("duplicate assets fail resolution", () => {
  const asset = AssetRefSchema.parse({
    id: "character.lead",
    type: "character",
    version: "0.1.0",
    hash: `sha256:${"a".repeat(64)}`,
    source: "reused",
    anchors: ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"],
  });
  const { errors } = resolveAssets([asset, asset], { root });
  assert.ok(errors.some((issue) => issue.code === "asset_duplicate"));
});

test("a character without anchors warns, not fails", () => {
  const asset = AssetRefSchema.parse({
    id: "character.lead",
    type: "character",
    version: "0.1.0",
    hash: `sha256:${"a".repeat(64)}`,
    source: "reused",
    anchors: [],
  });
  const { errors, warnings } = resolveAssets([asset], { root });
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((issue) => issue.code === "asset_anchors"));
});
