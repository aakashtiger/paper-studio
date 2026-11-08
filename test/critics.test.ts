import test from "node:test";
import assert from "node:assert/strict";
import { checkCritics, describeVerdict, normaliseHash, type CriticReport } from "../src/engine/critics.js";

/**
 * K6: a 10/10 gate is necessary and not sufficient. These tests pin the rule
 * that turns two critic reports into a ship-or-not answer, including the ways a
 * report can look like a GO and not be one.
 */

const PICTURE = "5769fef56e61287fe0ce48711bbc5d84d39fa8073d6cac5f15731f7dfa73839d";
const SCORE = "aa15d0e2b8c34f6f0f0e2f9f4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6";

const report = (role: "picture" | "story", over: Partial<CriticReport> = {}): CriticReport => ({
  role,
  critic: `${role}-critic`,
  videoHash: PICTURE,
  score: 10,
  verdict: "GO",
  axes: role === "picture"
    ? { continuity: 10, anatomy: 10, legibility: 10, performance: 10, type: 10, variety: 10 }
    : { legibility: 10, "line-to-picture": 10, ending: 10, invention: 10, argument: 10, pacing: 10 },
  findings: [],
  named_strongest: "s05",
  named_weakest: "s12",
  ...over,
});

const two = (over: { picture?: Partial<CriticReport>; story?: Partial<CriticReport> } = {}) => [
  report("picture", over.picture),
  report("story", over.story),
];

const codes = (reports: CriticReport[], context = { videoHash: PICTURE }) =>
  checkCritics(reports, context).findings.map((finding) => finding.code);

test("two fresh GOes, tied to this picture, ship", () => {
  const verdict = checkCritics(two(), { videoHash: PICTURE });
  assert.deepEqual(verdict.findings, []);
  assert.equal(verdict.ship, true);
  assert.equal(verdict.score, 10);
  assert.deepEqual(verdict.signed, ["picture", "story"]);
  assert.match(describeVerdict(verdict), /^SHIP: picture \+ story signed GO at 10\/10/);
});

test("a missing role is not shippable, and the reason names it", () => {
  const verdict = checkCritics([report("picture")], { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:missing-role" && finding.role === "story"));
});

test("no reports at all names both roles, not just one", () => {
  const verdict = checkCritics([], { videoHash: PICTURE });
  assert.equal(verdict.findings.filter((finding) => finding.code === "critic:missing-role").length, 2);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:no-reports"));
});

test("a GO below the bar is refused, so 9/10 cannot ship as 10/10", () => {
  const verdict = checkCritics(two({ story: { score: 9 } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:go-below-bar"));
  assert.equal(verdict.score, 9);
});

test("a GO that lists a P1 is a NO-GO with better manners", () => {
  const blocker = { shot: "s09", t: 23.4, severity: "P1", what: "the cap lands before the hand", evidence: "stills/t24_00.png" };
  const verdict = checkCritics(two({ picture: { findings: [blocker] } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:go-with-blocker"));
});

test("a P2 is allowed on a GO and does not block the ship", () => {
  const nit = { shot: "s02", t: 4.1, severity: "P2", what: "the label is a hair low", evidence: "stills/t4_20.png" };
  const verdict = checkCritics(two({ picture: { findings: [nit] } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, true);
});

test("a blocker with no evidence is refused as a finding", () => {
  const thin = { shot: "s09", severity: "P0", what: "the hand is wrong" };
  const verdict = checkCritics(two({ story: { findings: [thin] } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:thin-finding"));
});

test("an untied report is not evidence about this film", () => {
  const verdict = checkCritics(two({ picture: { videoHash: undefined } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:untied"));
});

test("a report about an earlier cut is refused, and both hashes are named", () => {
  const verdict = checkCritics(two({ story: { videoHash: "f".repeat(64) } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  const wrong = verdict.findings.find((finding) => finding.code === "critic:wrong-picture");
  assert.ok(wrong);
  assert.match(wrong!.message, /ffffffffffff/);
  assert.match(wrong!.message, /5769fef56e61/);
});

test("a story report naming a score that is gone is refused", () => {
  const verdict = checkCritics(two({ story: { scoreHash: "0".repeat(64) } }), {
    videoHash: PICTURE,
    scoreHash: SCORE,
  });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:wrong-score"));
});

test("`sha256:` and bare hex are the same hash", () => {
  const verdict = checkCritics(two({ picture: { videoHash: `sha256:${PICTURE}` } }), {
    videoHash: `sha256:${PICTURE}`,
  });
  assert.equal(verdict.ship, true);
  assert.equal(normaliseHash(`SHA256:${PICTURE.toUpperCase()}`), PICTURE);
});

test("one critic cannot be both critics", () => {
  const verdict = checkCritics(two({ story: { critic: "picture-critic" } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:one-signer"));
});

test("an unsigned report is refused: a verdict needs a name", () => {
  const verdict = checkCritics(two({ picture: { critic: undefined } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:unsigned"));
});

test("a role signs once; two picture reports are refused", () => {
  const verdict = checkCritics([...two(), report("picture", { critic: "second-picture" })], { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:duplicate-role"));
});

test("a NO-GO blocks the ship even when the other critic signs GO", () => {
  const verdict = checkCritics(two({ story: { verdict: "NO-GO", score: 7 } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:no-go"));
});

test("an unreadable verdict is refused rather than guessed", () => {
  const verdict = checkCritics(two({ picture: { verdict: "maybe" } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:verdict"));
});

test("axes are how a score becomes auditable: missing axes is a warning, not a blocker", () => {
  const verdict = checkCritics(two({ picture: { axes: undefined } }), { videoHash: PICTURE });
  assert.equal(verdict.ship, true);
  assert.ok(verdict.warnings.some((finding) => finding.code === "critic:no-axes"));
});

test("a film with no picture hash cannot be signed at all", () => {
  const verdict = checkCritics(two(), { videoHash: "" });
  assert.equal(verdict.ship, false);
  assert.ok(verdict.findings.some((finding) => finding.code === "critic:no-picture"));
});
