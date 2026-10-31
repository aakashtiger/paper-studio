import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  BANNED_KINDS,
  checkCue,
  checkCueSet,
  CUE_RMS,
  cueSpec,
  effectiveLayers,
  fadesClean,
  isBannedKind,
  isKnownKind,
  kindBand,
  kindGain,
  kindLength,
  kindLayers,
  phoneAudible,
  renderSfx,
  rms,
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

test("the kit's take on a kind is pinned by a golden hash", () => {
  // A generator change must be a deliberate change to this number, not a
  // silent drift in the delivered sound.
  const samples = renderSfx("snap", Math.round(0.14 * sr), sr, "sfx-snap");
  const bytes = Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength);
  const hash = createHash("sha256").update(bytes).digest("hex");
  assert.equal(hash, "5c29f722a99debfb127ce5e8a526596c5a0410bf0baba3705ed8fd5445a99f98");
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

test("an unknown kind is not a kind, and is never rendered", () => {
  assert.equal(isKnownKind("thunder"), false);
  assert.equal(isKnownKind("snap"), true);
  assert.throws(() => renderSfx("thunder", Math.round(0.14 * sr), sr, "sfx-thunder"), /unknown sfx kind/);
  const check = checkCue({ id: "x", kind: "thunder", at: 1 }, tone(200, 0.2), sr, aligned30);
  assert.equal(check.ok, false);
  assert.match(check.detail, /not a kind in the kit/);
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

test("a banned kind fails before anything is rendered", () => {
  const check = checkCue({ id: "sfx-click", kind: "click", at: 1 }, tone(800, 0.2), sr, aligned30);
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
    30,
  );
  assert.deepEqual(errors, []);
  assert.equal(cues[0]?.at, 3.2);
  assert.equal(cues[0]?.from, "event");
  assert.deepEqual(cues[0]?.event, { shot: "s02", index: 1, t: 1, kind: "move", note: "iris closes" });
  assert.equal(cues[1]?.at, 5);
  assert.equal(cues[1]?.from, "at");
});

test("a derived time lands on a frame, even when the event does not", () => {
  // 1/30 s is 0.0333...: it cannot be written at 3 decimal places, so the
  // resolver must snap the sum to the frame grid, not round the decimals.
  const shots = [
    { id: "s02", start: 1, events: [{ t: 1 / 30, kind: "move", note: "one frame in" }] },
  ];
  const { cues, errors } = resolveCueTimes(
    [{ id: "bound", kind: "snap", event: { shot: "s02", index: 0 } }],
    shots,
    30,
    30,
  );
  assert.deepEqual(errors, []);
  const at = cues[0]?.at ?? -1;
  assert.equal(Math.round(at * 30), 31);
  assert.ok(aligned30(at), `${at}s is off the frame grid`);
});

test("a bound cue names a shot and an event that are really there", () => {
  const shots = [{ id: "s01", start: 0, events: [{ t: 0.2, kind: "type", note: "title" }] }];
  const unknownShot = resolveCueTimes(
    [{ id: "a", kind: "snap", event: { shot: "s09", index: 0 } }],
    shots,
    30,
    30,
  );
  assert.ok(unknownShot.errors.some((issue) => issue.code === "sfx_event_shot"));
  assert.deepEqual(unknownShot.cues, []);

  const unknownIndex = resolveCueTimes(
    [{ id: "b", kind: "snap", event: { shot: "s01", index: 4 } }],
    shots,
    30,
    30,
  );
  assert.ok(unknownIndex.errors.some((issue) => issue.code === "sfx_event_index"));
});

test("a bound cue that lands outside the film fails", () => {
  const shots = [{ id: "s01", start: 29.5, events: [{ t: 1, kind: "type", note: "title" }] }];
  const { errors } = resolveCueTimes(
    [{ id: "late", kind: "snap", event: { shot: "s01", index: 0 } }],
    shots,
    30,
    30,
  );
  assert.ok(errors.some((issue) => issue.code === "sfx_outside_film"));
});

test("a cue with no time, or two times, or an unknown kind is a contract error", () => {
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

  const unknown = AudioPlanSchema.parse({
    mode: "sfx",
    sfx: { source: "generated", cues: [{ id: "c", kind: "thunder", at: 1 }] },
  });
  const unknownErrors = resolveAudio(unknown, { duration: 30, clockMode: "sfx", root }).errors;
  assert.ok(unknownErrors.some((issue) => issue.code === "sfx_kind_unknown"));
});

test("library and recorded sfx are in the contract but not built", () => {
  for (const source of ["library", "recorded"] as const) {
    const plan = AudioPlanSchema.parse({ mode: "sfx", sfx: { source, cues: [] } });
    const { errors } = resolveAudio(plan, { duration: 30, clockMode: "sfx", root });
    assert.ok(errors.some((issue) => issue.code === "sfx_source_unbuilt"), source);
  }
});

test("a cue's spec changes when anything that decides its sound changes", () => {
  const base = { kind: "snap", at: 2.2 };
  const spec = cueSpec(base);
  assert.notEqual(cueSpec({ ...base, kind: "step" }), spec);
  assert.notEqual(cueSpec({ ...base, at: 2.233333 }), spec);
  assert.notEqual(cueSpec({ ...base, layers: ["body"] }), spec);
  assert.notEqual(cueSpec({ ...base, gain: 0.3 }), spec);
  assert.notEqual(cueSpec({ ...base, band: [100, 2000] }), spec);
  assert.equal(cueSpec(base), cueSpec({ ...base }));
});

test("the kit has one loudness rule: beds share an RMS, hits share a peak", () => {
  const level = (samples: Float32Array) => 20 * Math.log10(rms(samples) + 1e-9);
  for (const kind of Object.keys(SFX_KINDS)) {
    const samples = renderSfx(kind, Math.round(kindLength(kind) * sr), sr, `level-${kind}`);
    const peak = samples.reduce((max, value) => Math.max(max, Math.abs(value)), 0);
    assert.ok(peak <= 0.9801, `${kind} peaks at ${peak}, which clips`);
    assert.ok(level(samples) <= -18.3, `${kind} is louder than the cue target`);
    assert.ok(level(samples) >= -30.1, `${kind} is ${level(samples).toFixed(1)} dBFS, far under the target`);
  }
  // A sustained bed is exactly on the target; a hit is held down by its peak.
  const bed = renderSfx("room", Math.round(0.5 * sr), sr, "level-bed");
  const hit = renderSfx("slam", Math.round(0.4 * sr), sr, "level-hit");
  const target = 20 * Math.log10(CUE_RMS);
  assert.ok(Math.abs(level(bed) - target) < 1.5, `the bed is ${level(bed).toFixed(1)} dBFS, target ${target.toFixed(1)}`);
  assert.ok(level(hit) < level(bed), "a transient is quieter in RMS than a bed at the same loudness");
});

test("a cue that lives under the phone floor fails the speaker check", () => {
  const sub = tone(80, 0.3);
  assert.ok(phoneAudible(sub, sr) < 0.1);
  const check = checkCue({ id: "x", kind: "hum", at: 1 }, sub, sr, aligned30);
  assert.equal(check.ok, false);
  assert.match(check.detail, /phone speaker lives/);
});

test("two cues of one kind cannot machine-gun", () => {
  const issues = checkCueSet([
    { id: "a", kind: "crowd", at: 1 },
    { id: "b", kind: "crowd", at: 2.2 },
    { id: "c", kind: "snap", at: 2.3 },
    { id: "d", kind: "crowd", at: 9 },
  ]);
  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.code, "sfx_repeat");
  assert.match(issues[0]?.message ?? "", /"b" repeats "a"/);
  assert.equal(checkCueSet([{ id: "a", kind: "crowd", at: 1 }, { id: "d", kind: "crowd", at: 9 }]).length, 0);
});

test("send, duck and band have one source: the kit", () => {
  assert.equal(cueSend({ kind: "lamp" }), 0.12);
  assert.equal(cueDuckDb({ kind: "lamp" }), 2);
  assert.deepEqual(cueBand({ kind: "lamp" }), [80, 6000]);
  assert.equal(cueSend({ kind: "lamp", send: 0.5 }), 0.5);
  assert.equal(cueDuckDb({ kind: "lamp", duckDb: 6 }), 6);
  assert.deepEqual(cueBand({ kind: "lamp", band: [100, 2000] }), [100, 2000]);
});
