import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveFilm, type FilmScore } from "../src/engine/treatment.js";
import { auditFilm } from "../src/engine/audit.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-kpop");
const pilot = JSON.parse(
  readFileSync(resolve(root, "films/understudy/score.json"), "utf8"),
) as FilmScore;

function resolvedPlan() {
  const { plan, errors } = resolveFilm(pilot, styleDir, root);
  assert.deepEqual(errors, []);
  return plan;
}

test("the fixture passes the score-level audit", () => {
  const report = auditFilm(resolvedPlan(), { root });
  assert.equal(report.ok, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.shots, 9);
  assert.equal(report.frames, 900);
  assert.equal(report.captions, 6);
});

test("a cue off the frame grid fails", () => {
  const plan = resolvedPlan();
  const shot = plan.shots[0];
  assert.ok(shot);
  shot.direction.events[0] = { t: 0.01, kind: "type", note: "off frame" };
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "cue_frame"));
});

test("a caption shorter than read time fails", () => {
  const plan = resolvedPlan();
  const caption = plan.captions.lines[0];
  assert.ok(caption);
  caption.end = caption.start + 0.5;
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "caption_read_time"));
});
