import test from "node:test";
import assert from "node:assert/strict";
import { bandFor, checkShotPolicy, medianOf, type PolicyShot } from "../src/engine/shot-policy.js";

/**
 * The shot band belongs to the system (decision 0065). These tests pin the band,
 * the guards that read it, and — deliberately — the one real film the policy
 * refuses, so nobody "fixes" the tolerance to make it pass.
 */

const shot = (id: string, start: number, duration: number, extra: Partial<PolicyShot> = {}): PolicyShot => ({
  id,
  start,
  duration,
  camera: `move-${id}`,
  set: `set-${id}`,
  ...extra,
});

/** A cut of `count` equal shots covering `duration`. */
const evenCut = (duration: number, count: number, extra: (index: number) => Partial<PolicyShot> = () => ({})) =>
  Array.from({ length: count }, (_, index) =>
    shot(`s${String(index + 1).padStart(2, "0")}`, (index * duration) / count, duration / count, extra(index)),
  );

test("the band is derived from the duration, and 3 min is the seam", () => {
  const short = bandFor(30);
  assert.deepEqual(
    { min: short.min, median: short.median, max: short.max, regime: short.regime, shots: short.shots },
    { min: 1.2, median: 3.0, max: 5.5, regime: "short", shots: 10 },
  );
  assert.equal(bandFor(179.9).regime, "short");
  const long = bandFor(180);
  assert.deepEqual(
    { min: long.min, median: long.median, max: long.max, regime: long.regime, shots: long.shots },
    { min: 3.0, median: 5.0, max: 7.0, regime: "long", shots: 36 },
  );
  assert.equal(bandFor(600).shots, 120);
});

test("a 30 s film at ten shots of 3.0 s passes", () => {
  const report = checkShotPolicy(evenCut(30, 10), 30);
  assert.deepEqual(report.findings, []);
  assert.equal(report.median, 3);
});

test("a 60 s film at twenty-one shots passes when it also varies", () => {
  // 21 shots across 60 s: 2.6–3.2 s, none at an edge.
  const lengths = [3.0, 2.9, 3.1, 2.8, 3.2, 2.7, 3.0, 3.1, 2.9, 3.0, 3.0, 2.8, 3.2, 2.9, 3.1, 3.0, 2.7, 3.2, 2.9, 3.1, 3.0];
  let cursor = 0;
  const shots = lengths.map((duration, index) => {
    const row = shot(`s${String(index + 1).padStart(2, "0")}`, cursor, duration);
    cursor = Number((cursor + duration).toFixed(2));
    return row;
  });
  const report = checkShotPolicy(shots, 62.6);
  assert.deepEqual(report.findings, []);
});

test("a shot under the floor and a shot over the ceiling are both refused", () => {
  const shots = evenCut(60, 20);
  shots[3] = shot("s04", shots[3]!.start, 0.9);
  shots[7] = shot("s08", shots[7]!.start, 6.2);
  const codes = checkShotPolicy(shots, 60).findings.map((finding) => finding.code);
  assert.ok(codes.includes("policy:too-short"));
  assert.ok(codes.includes("policy:too-long"));
});

test("a median outside the tolerance is refused, and the reason names the band", () => {
  const report = checkShotPolicy(evenCut(60, 30), 60); // 30 x 2.0 s
  const median = report.findings.find((finding) => finding.code === "policy:median");
  assert.ok(median, "a 2.0 s median must be refused");
  assert.match(median!.message, /outside 3±0.3s/);
});

test("too few shots for the duration is refused", () => {
  const report = checkShotPolicy(evenCut(60, 15), 60); // 15 x 4.0 s
  const count = report.findings.find((finding) => finding.code === "policy:count");
  assert.ok(count, "15 shots for 60 s must be refused");
  assert.match(count!.message, /fewer than the 20/);
});

test("the edge caps hold: no more than 15% at the minimum, 10% at the maximum", () => {
  const shots = evenCut(60, 20, (index) => {
    if (index < 4) return { duration: 1.2 };
    if (index >= 18) return { duration: 5.5 };
    return { duration: (60 - 4 * 1.2 - 2 * 5.5) / 14 };
  });
  // re-time so the cut is contiguous after the overrides
  let cursor = 0;
  for (const row of shots) {
    row.start = Number(cursor.toFixed(2));
    cursor += row.duration;
  }
  const codes = checkShotPolicy(shots, Number(cursor.toFixed(2))).findings.map((finding) => finding.code);
  assert.ok(codes.includes("policy:at-min"), "4 of 20 at the minimum is over the 15% cap");
  assert.ok(codes.includes("policy:at-max") || codes.includes("policy:max-run"));
});

test("two maximum-length shots in a row are refused", () => {
  const lengths = [3, 3, 3, 3, 5.5, 5.5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  let cursor = 0;
  const shots = lengths.map((duration, index) => {
    const row = shot(`s${String(index + 1).padStart(2, "0")}`, cursor, duration);
    cursor += duration;
    return row;
  });
  const codes = checkShotPolicy(shots, cursor).findings.map((finding) => finding.code);
  assert.ok(codes.includes("policy:max-run"));
});

test("four shots in a row sharing a set or a camera move are refused", () => {
  const sameSet = evenCut(60, 20, (index) => ({ set: index >= 4 && index <= 7 ? "hideout" : `set-${index}` }));
  assert.ok(checkShotPolicy(sameSet, 60).findings.some((finding) => finding.code === "policy:set-run"));

  const sameCamera = evenCut(60, 20, (index) => ({ camera: index >= 10 && index <= 13 ? "push" : `move-${index}` }));
  assert.ok(checkShotPolicy(sameCamera, 60).findings.some((finding) => finding.code === "policy:camera-run"));

  const spread = evenCut(60, 20, (index) => ({ set: index >= 4 && index <= 6 ? "hideout" : `set-${index}` }));
  assert.ok(!checkShotPolicy(spread, 60).findings.some((finding) => finding.code === "policy:set-run"), "three in a row is legal");
});

test("a hole in the cut and a film the shots do not cover are refused", () => {
  const gapped = evenCut(60, 20);
  gapped[5] = shot("s06", gapped[5]!.start + 0.5, gapped[5]!.duration);
  assert.ok(checkShotPolicy(gapped, 60).findings.some((finding) => finding.code === "policy:gap"));

  const short = evenCut(60, 20).slice(0, 19);
  assert.ok(checkShotPolicy(short, 60).findings.some((finding) => finding.code === "policy:coverage"));
});

test("medianOf matches the gate's convention: the upper middle", () => {
  assert.equal(medianOf([1, 2, 3, 4]), 3);
  assert.equal(medianOf([4, 1, 3, 2]), 3);
  assert.equal(medianOf([2.5, 2.6, 2.66]), 2.6);
});

test("the delivered 60 s crime cut misses the policy median by 0.04 s — named, not hidden", () => {
  // The shot lengths of proofs/kpop-crime-60, the film M0 closed at 10/10 on the
  // *old* band (median 2.5–3.0). Under the system policy its 2.66 s median sits
  // 0.34 s from the 3.0 s band, i.e. 0.04 s outside the ±0.3 tolerance. This test
  // keeps that fact visible: the next film is cut to the policy, and the crime
  // film's pass stays tied to the gate it was made for.
  const lengths = [
    3.38, 1.5, 3.82, 1.6, 2.74, 4.24, 2.42, 2.52, 3.84, 2.66, 2.18, 3.7, 2.82, 1.78, 3.86, 2.12, 2.62, 3.72, 4.5, 2.12, 1.86,
  ];
  let cursor = 0;
  const shots = lengths.map((duration, index) => {
    const row = shot(`s${String(index + 1).padStart(2, "0")}`, cursor, duration, {
      camera: `cam-${index % 5}`,
      set: `set-${Math.floor(index / 2)}`,
    });
    cursor = Number((cursor + duration).toFixed(2));
    return row;
  });
  const report = checkShotPolicy(shots, 60);
  assert.equal(report.median, 2.66);
  const median = report.findings.find((finding) => finding.code === "policy:median");
  assert.ok(median, "the crime cut is outside the policy median and the engine says so");
  assert.equal(median!.message.includes("2.66"), true);
});
