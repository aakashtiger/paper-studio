import test from "node:test";
import assert from "node:assert/strict";
import {
  BANNED_KINDS,
  checkCue,
  effectiveLayers,
  fadesClean,
  isBannedKind,
  kindBand,
  kindGain,
  kindLength,
  kindLayers,
  renderSfx,
  SFX_GENERATOR,
  SFX_KINDS,
  SFX_SAMPLE_RATE,
} from "../src/engine/sfx.js";
import { AudioPlanSchema, resolveAudio, resolveCueTimes } from "../src/engine/audio.js";
import { cueBand, cueDuckDb, cueSend } from "../src/engine/mix.js";

const sr = SFX_SAMPLE_RATE;
const root = process.cwd();
const aligned30 = (value: number) => Math.abs(value * 30 - Math.round(value * 30)) <= 0.001;

function tone(freq: number, seconds: number): Float32Array {
  const samples = new Float32Array(Math.round(seconds * sr));
  for (let i = 0; i < samples.length; i++) samples[i] = Math.sin((2 * Math.PI * freq * i) / sr);
  return samples;
}

test("the same cue renders byte-identical samples twice", () => {
  const first = renderSfx("snap", Math.round(0.14 * sr), sr, "sfx-snap");
  const second = renderSfx("snap", Math.round(0.14 * sr), sr, "sfx-snap");
  assert.deepEqual(Array.from(first), Array.from(second));
});

test("two cues of the same kind are not the same take", () => {
  const a = renderSfx("crowd", Math.round(0.4 * sr), sr, "sfx-crowd");
  const b = renderSfx("crowd", Math.round(0.4 * sr), sr, "sfx-cheer");
  assert.notDeepEqual(Array.from(a), Array.from(b));
});

test("every kind in the kit is allowed on a phone speaker and stays under 9 kHz", () => {
  for (const kind of Object.keys(SFX_KINDS)) {
    assert.equal(isBannedKind(kind), false, `${kind} must not be banned`);
    assert.ok(kindBand(kind)[1] <= 9000, `${kind} tops out above 9 kHz`);
    assert.ok(kindLength(kind) > 0);
    assert.ok(kindGain(kind) > 0 && kindGain(kind) <= 1);
    assert.ok(kindLayers(kind).length > 0);
  }
  for (const kind of BANNED_KINDS) assert.equal(isBannedKind(kind), true);
});

test("the kit version is on the report, not a date", () => {
  assert.equal(SFX_GENERATOR, "paper-studio/sfx 2.0");
});

test("a rendered cue passes the mechanical checks on an aligned frame", () => {
  const samples = renderSfx("snap", Math.round(0.14 * sr), sr, "sfx-snap");
  const check = checkCue({ id: "sfx-snap", kind: "snap", at: 2.2 }, samples, sr, aligned30);
  assert.equal(check.ok, true, check.detail);
  assert.match(check.detail, /ms/);
});

test("a cue off the frame grid fails and says why", () => {
  const samples = renderSfx("snap", Math.round(0.14 * sr), sr, "sfx-snap");
  const check = checkCue({ id: "sfx-snap", kind: "snap", at: 2.21 }, samples, sr, aligned30);
  assert.equal(check.ok, false);
  assert.match(check.detail, /not on a frame/);
});

test("a banned kind fails even when it renders", () => {
  const samples = renderSfx("click", Math.round(0.14 * sr), sr, "sfx-click");
  const check = checkCue({ id: "sfx-click", kind: "click", at: 1 }, samples, sr, aligned30);
  assert.equal(check.ok, false);
  assert.match(check.detail, /banned/);
});

test("a cue that ends on a jump fails the clean fade", () => {
  const samples = new Float32Array(Math.round(0.2 * sr)).fill(0.8);
  assert.equal(fadesClean(samples, sr), false);
  const check = checkCue({ id: "x", kind: "snap", at: 1 }, samples, sr, aligned30);
  assert.match(check.detail, /fade out clean/);
});

test("a rendered cue ends clean", () => {
  const samples = renderSfx("whoosh", Math.round(0.4 * sr), sr, "sfx-build");
  assert.equal(fadesClean(samples, sr), true);
});

test("a cue with most of its energy outside its band fails the band check", () => {
  const samples = tone(5000, 0.2);
  const check = checkCue(
    { id: "x", kind: "snap", at: 1, band: [300, 700] },
    samples,
    sr,
    aligned30,
  );
  assert.equal(check.ok, false);
  assert.match(check.detail, /energy is in/);
});

test("layers are filtered to the ones the kit knows, and never empty", () => {
  assert.deepEqual(effectiveLayers("snap", ["body", "nonsense"]), ["body"]);
  assert.deepEqual(effectiveLayers("snap", []), kindLayers("snap"));
  assert.deepEqual(effectiveLayers("snap"), kindLayers("snap"));
  assert.deepEqual(effectiveLayers("snap", ["nonsense"]), kindLayers("snap"));
});

test("a cue can name its time once, bound to the picture event it sits on", () => {
  const shots = [
    { id: "s01", start: 0, events: [{ t: 0.2, kind: "type", note: "title drops" }] },
    {
      id: "s02",
      start: 2.2,
      events: [
        { t: 0.1, kind: "light", note: "lamp glows" },
        { t: 1, kind: "move", note: "iris closes" },
      ],
    },
  ];
  const { cues, errors } = resolveCueTimes(
    [
      { id: "bound", kind: "iris", event: { shot: "s02", index: 1 } },
      { id: "typed", kind: "step", at: 5 },
    ],
    shots,
    30,
  );
  assert.deepEqual(errors, []);
  assert.equal(cues[0]?.at, 3.2);
  assert.equal(cues[0]?.from, "event");
  assert.deepEqual(cues[0]?.event, { shot: "s02", index: 1, t: 1, kind: "move", note: "iris closes" });
  assert.equal(cues[1]?.at, 5);
  assert.equal(cues[1]?.from, "at");
});

test("a bound cue names a shot and an event that are really there", () => {
  const shots = [{ id: "s01", start: 0, events: [{ t: 0.2, kind: "type", note: "title" }] }];
  const unknownShot = resolveCueTimes([{ id: "a", kind: "snap", event: { shot: "s09", index: 0 } }], shots, 30);
  assert.ok(unknownShot.errors.some((issue) => issue.code === "sfx_event_shot"));
  assert.deepEqual(unknownShot.cues, []);

  const unknownIndex = resolveCueTimes([{ id: "b", kind: "snap", event: { shot: "s01", index: 4 } }], shots, 30);
  assert.ok(unknownIndex.errors.some((issue) => issue.code === "sfx_event_index"));
});

test("a bound cue that lands outside the film fails", () => {
  const shots = [{ id: "s01", start: 29.5, events: [{ t: 1, kind: "type", note: "title" }] }];
  const { errors } = resolveCueTimes([{ id: "late", kind: "snap", event: { shot: "s01", index: 0 } }], shots, 30);
  assert.ok(errors.some((issue) => issue.code === "sfx_outside_film"));
});

test("a cue with no time, or two times, is a contract error", () => {
  const none = AudioPlanSchema.parse({
    mode: "sfx",
    sfx: { source: "generated", cues: [{ id: "a", kind: "snap" }] },
  });
  assert.ok(
    resolveAudio(none, { duration: 30, clockMode: "sfx", root }).errors.some(
      (issue) => issue.code === "sfx_no_time",
    ),
  );

  const both = AudioPlanSchema.parse({
    mode: "sfx",
    sfx: {
      source: "generated",
      cues: [{ id: "b", kind: "snap", at: 1, event: { shot: "s01", index: 0 } }],
    },
  });
  assert.ok(
    resolveAudio(both, { duration: 30, clockMode: "sfx", root }).errors.some(
      (issue) => issue.code === "sfx_time_conflict",
    ),
  );
});

test("library and recorded sfx are in the contract but not built", () => {
  for (const source of ["library", "recorded"] as const) {
    const plan = AudioPlanSchema.parse({ mode: "sfx", sfx: { source, cues: [] } });
    const { errors } = resolveAudio(plan, { duration: 30, clockMode: "sfx", root });
    assert.ok(errors.some((issue) => issue.code === "sfx_source_unbuilt"), source);
  }
});

test("send, duck and band have one source: the kit", () => {
  assert.equal(cueSend({ kind: "lamp" }), SFX_KINDS.lamp?.send);
  assert.equal(cueDuckDb({ kind: "lamp" }), SFX_KINDS.lamp?.duckDb);
  assert.deepEqual(cueBand({ kind: "lamp" }), kindBand("lamp"));
  assert.equal(cueSend({ kind: "lamp", send: 0.5 }), 0.5);
  assert.deepEqual(cueBand({ kind: "lamp", band: [100, 2000] }), [100, 2000]);
});
