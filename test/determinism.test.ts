import test from "node:test";
import assert from "node:assert/strict";
import {
  TWIN_MIN_FRAMES,
  checkTwin,
  checkTwinEvidence,
  sampleFrames,
  twinSampleHash,
  type TwinFrame,
} from "../src/engine/determinism.js";

const shots = [
  { id: "s01", start: 0, duration: 4 },
  { id: "s02", start: 4, duration: 6 },
  { id: "s03", start: 10, duration: 2 },
];

const frames = (overrides: Partial<TwinFrame>[] = []): { time: number; shot: string; a: string; b: string }[] =>
  sampleFrames(shots, 1).map((sample, index) => ({
    ...sample,
    a: `sha256:a${index}`,
    b: `sha256:a${index}`,
    ...(overrides[index] ?? {}),
  }));

const report = (over: Partial<TwinFrame>[] = []) =>
  checkTwin({
    film: "probe",
    score: "sha256:score",
    runs: { a: { workers: 1, seconds: 1 }, b: { workers: 4, seconds: 1 } },
    shots: shots.map((shot) => shot.id),
    frames: frames(over),
  });

test("the sample is spread inside every shot, never on its boundaries", () => {
  const sample = sampleFrames(shots, 3);
  assert.equal(sample.length, 9);
  // 1/4, 1/2 and 3/4 of each shot: no sample sits on a cut, where a rounding to
  // two decimals could land it in the neighbouring shot.
  assert.deepEqual(
    sample.filter((entry) => entry.shot === "s01").map((entry) => entry.time),
    [1, 2, 3],
  );
  assert.deepEqual(
    sample.filter((entry) => entry.shot === "s03").map((entry) => entry.time),
    [10.5, 11, 11.5],
  );
  for (const entry of sample) {
    const shot = shots.find((candidate) => candidate.id === entry.shot)!;
    assert.ok(entry.time > shot.start && entry.time < shot.start + shot.duration, `${entry.time}`);
  }
});

test("the sample is ordered by time and rounds to the renderer's two-decimal grid", () => {
  const sample = sampleFrames([{ id: "s01", start: 1.33, duration: 2.5 }], 3);
  const times = sample.map((entry) => entry.time);
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
  for (const time of times) assert.equal(time, Math.round(time * 100) / 100);
});

test("a shot shorter than the sample grid is one picture, not a duplicate", () => {
  // Three samples of a 30 ms shot can round onto the same two-decimal time. One
  // picture is one picture: painting it twice would pad the count, not the proof.
  const sample = sampleFrames([{ id: "s01", start: 0, duration: 0.03 }], 3);
  const times = sample.map((entry) => entry.time);
  assert.deepEqual(times, [...new Set(times)]);
  assert.ok(sample.length < 3, `${sample.length} samples: ${times.join(", ")}`);
  // A shot far shorter than the grid collapses to a single picture.
  assert.equal(sampleFrames([{ id: "s01", start: 0, duration: 0.004 }], 3).length, 1);
});

test("a twin whose frames are identical passes, and names the score it measured", () => {
  const twin = report();
  assert.deepEqual(twin.errors, []);
  assert.equal(twin.pass, true);
  assert.equal(twin.mismatches, 0);
  assert.equal(twin.score, "sha256:score");
  assert.equal(twin.mode, "frame-bytes");
  assert.deepEqual(twin.uncovered, []);
  for (const frame of twin.frames) assert.equal(frame.identical, true);
});

test("one frame that differs refuses the whole claim", () => {
  // Determinism is not a matter of degree: 2 of 3 identical is a broken painter.
  const twin = report([{}, { b: "sha256:other" }]);
  assert.equal(twin.pass, false);
  assert.equal(twin.mismatches, 1);
  const error = twin.errors.find((issue) => issue.code === "determinism:frame");
  assert.ok(error, twin.errors.map((issue) => issue.code).join(", "));
  assert.equal(error.shot, "s02");
  assert.match(error.message, /not the same picture in the two runs/);
  assert.match(error.message, /pure function of time/);
});

test("a shot nobody sampled does not count as deterministic", () => {
  // Drop s03's frame: the film is not proven by the shots that were painted.
  const twin = checkTwin({
    film: "probe",
    score: "sha256:score",
    runs: { a: { workers: 1, seconds: 1 }, b: { workers: 4, seconds: 1 } },
    shots: ["s01", "s02", "s03"],
    frames: frames().filter((frame) => frame.shot !== "s03"),
  });
  assert.equal(twin.pass, false);
  assert.deepEqual(twin.uncovered, ["s03"]);
  assert.ok(twin.errors.some((issue) => issue.code === "determinism:uncovered" && issue.shot === "s03"));
});

test("one picture compared with itself proves nothing", () => {
  const twin = checkTwin({
    film: "probe",
    score: "sha256:score",
    runs: { a: { workers: 1, seconds: 1 }, b: { workers: 1, seconds: 1 } },
    shots: ["s01"],
    frames: [{ time: 1, shot: "s01", a: "sha256:x", b: "sha256:x" }],
  });
  assert.equal(twin.pass, false);
  assert.ok(twin.errors.some((issue) => issue.code === "determinism:sample"));
  assert.ok(twin.frames.length < TWIN_MIN_FRAMES);
});

test("the same time counted twice is refused, not silently doubled", () => {
  const twin = checkTwin({
    film: "probe",
    score: "sha256:score",
    runs: { a: { workers: 1, seconds: 1 }, b: { workers: 4, seconds: 1 } },
    shots: ["s01"],
    frames: [
      { time: 1, shot: "s01", a: "sha256:x", b: "sha256:x" },
      { time: 1, shot: "s01", a: "sha256:x", b: "sha256:x" },
    ],
  });
  assert.equal(twin.pass, false);
  assert.ok(twin.errors.some((issue) => issue.code === "determinism:duplicate"));
});

test("the sample hash covers what was compared, so a report cannot be trimmed", () => {
  const twin = report();
  assert.equal(twin.sampleHash, twinSampleHash(twin.frames));
  const trimmed = twinSampleHash(twin.frames.slice(0, 1));
  assert.notEqual(trimmed, twin.sampleHash);
});

/**
 * The gate row. Every refusal below is a way a report could *look* like proof
 * and not be one, so each is a test rather than something only the whole gate
 * could catch.
 */
const good = () => JSON.parse(JSON.stringify(report())) as ReturnType<typeof report>;

test("the gate row accepts a report about this score, from two different paint arrangements", () => {
  const verdict = checkTwinEvidence(good(), "sha256:score");
  assert.equal(verdict.ok, true);
  assert.match(verdict.detail, /the same 3 frames, byte for byte, in 1 and 4 browsers/);
});

test("the gate row refuses a report with no frames", () => {
  assert.equal(checkTwinEvidence(null, "sha256:score").detail.includes("no determinism report"), true);
});

test("the gate row refuses the older twin-render evidence by name", () => {
  // The shape that named two MP4s, so an old build/ cannot pass the new gate by
  // accident and quietly weaken what "deterministic" means.
  const older = { mode: "mp4-bytes", pass: true, mismatches: 0 } as never;
  const verdict = checkTwinEvidence(older, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /twin \*render\*, not a twin \*sample\*/);
});

test("the gate row refuses a report measured on a different score", () => {
  const twin = good();
  const verdict = checkTwinEvidence(twin, "sha256:a-different-edit");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /different score/);
});

test("the gate row does not trust a hand-edited `pass: true`", () => {
  // Flip one frame's hash, leave every summary field claiming success.
  const twin = good();
  twin.frames[0]!.b = "sha256:tampered";
  twin.pass = true;
  twin.mismatches = 0;
  twin.sampleHash = twinSampleHash(twin.frames);
  const verdict = checkTwinEvidence(twin, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /1 of 3 sampled frames differ/);
});

test("the gate row refuses a frame list the report's sample hash does not cover", () => {
  const twin = good();
  // Two frames — enough to be a sample — but not the two the hash was taken over.
  twin.frames = twin.frames.slice(0, 2);
  const verdict = checkTwinEvidence(twin, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /sample hash does not cover/);
});

test("the gate row refuses two runs that used the same number of workers", () => {
  // Two identical parallel runs prove the same code ran twice, not that a frame
  // is the same whichever browser paints it — the defect the sample exists for.
  const twin = good();
  twin.runs.b.workers = twin.runs.a.workers;
  const verdict = checkTwinEvidence(twin, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /same number of workers/);
});

test("the gate row refuses a single sampled frame", () => {
  const twin = good();
  twin.frames = twin.frames.slice(0, 1);
  twin.sampleHash = twinSampleHash(twin.frames);
  const verdict = checkTwinEvidence(twin, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /only 1 frame\(s\) sampled/);
});

test("the gate row refuses a shot that was never sampled", () => {
  const twin = good();
  twin.uncovered = ["s03"];
  const verdict = checkTwinEvidence(twin, "sha256:score");
  assert.equal(verdict.ok, false);
  assert.match(verdict.detail, /never sampled: s03/);
});
