import test from "node:test";
import assert from "node:assert/strict";
import { checkStyleIdentity, type CastLibraryFact } from "../src/engine/style-identity.js";

const bands = { luma: 20, contrast: 25, saturation: 10, edges: 5, palette: 45 };
const castRule = { max: 2, stagedRatio: 0.5, posesMin: 8, expressionsMin: 14, anchors: ["face", "hair", "hand-left", "hand-right", "foot-left", "foot-right"] };
const delta = { luma: 1, contrast: -2, saturation: -3, edges: 0, palette: 30 };
const cast: CastLibraryFact[] = [{
  character: "Kiran",
  rig: "worker@0.1.0",
  poses: 8,
  expressions: 14,
  anchors: castRule.anchors,
  body: true,
  errors: [],
}];

test("a conforming cast and measured look pass", () => {
  const result = checkStyleIdentity({ shots: 10, stagedShots: 6, cast, delta, bands, castRule });
  assert.deepEqual(result.findings, []);
});

test("a new character with the same construction is allowed", () => {
  const newCast: CastLibraryFact[] = [{ ...cast[0]!, character: "New Person", rig: "new-rig@0.1.0" }];
  const result = checkStyleIdentity({ shots: 10, stagedShots: 6, cast: newCast, delta, bands, castRule });
  assert.deepEqual(result.findings, []);
});

test("a film that stages no character is not the channel", () => {
  const result = checkStyleIdentity({ shots: 10, stagedShots: 0, cast, delta, bands, castRule });
  assert.ok(result.findings.some((finding) => finding.code === "identity:staged"));
});

test("a character without the pack's anchors or body is refused", () => {
  const broken: CastLibraryFact[] = [{ ...cast[0]!, anchors: ["face"], body: false }];
  const result = checkStyleIdentity({ shots: 10, stagedShots: 6, cast: broken, delta, bands, castRule });
  assert.ok(result.findings.some((finding) => finding.code === "identity:cast"));
});

test("a look outside the luma, saturation or palette band is refused", () => {
  const result = checkStyleIdentity({
    shots: 10,
    stagedShots: 6,
    cast,
    delta: { ...delta, luma: 38, saturation: -25, palette: 83 },
    bands,
    castRule,
  });
  assert.ok(result.findings.some((finding) => finding.code === "identity:luma"));
  assert.ok(result.findings.some((finding) => finding.code === "identity:saturation"));
  assert.ok(result.findings.some((finding) => finding.code === "identity:palette"));
});
