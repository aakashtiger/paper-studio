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
  // Every picture event is either scored or sits in a silence the film wrote
  // down: no event is quietly dropped.
  assert.equal(report.events, 32);
  assert.equal(report.scored + report.bare, report.events);
  assert.ok(report.bare <= 6, `${report.bare} events are bare`);
});

test("an event nobody scored is an error, not a warning", () => {
  const plan = resolvedPlan();
  const shot = plan.shots[7];
  assert.ok(shot);
  // Find a cue bound to this shot and unbind it by moving it to another event
  // index that does not exist: the coverage row must notice the gap.
  const cue = plan.cues.find((candidate) => candidate.event?.shot === shot.id && candidate.event.index === 4);
  assert.ok(cue, "the fixture should score the paper shard on the hold");
  cue.event = { shot: shot.id, index: 0, t: 0.4, kind: "entrance", note: "Nova enters from the wing" };
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "sfx_unscored"));
});

test("a silence with a sound at the top of it is a contradiction", () => {
  const plan = resolvedPlan();
  const cue = plan.cues.find((candidate) => candidate.id === "sfx-turn");
  assert.ok(cue);
  plan.audio.sfx?.silences.push({ from: 2.4, to: 3.2, why: "a test hole" });
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "sfx_in_silence"));
});

test("a long hole needs a reason", () => {
  const plan = resolvedPlan();
  plan.audio.sfx?.silences.splice(0, plan.audio.sfx.silences.length);
  const report = auditFilm(plan, { root });
  assert.ok(report.ok === false);
  assert.ok(report.errors.some((issue) => issue.code === "sfx_gap" || issue.code === "sfx_unscored"));
});

test("a cue that starts inside the master's tail fade is refused", () => {
  const plan = resolvedPlan();
  const cue = plan.cues.find((candidate) => candidate.event?.shot === "s09");
  assert.ok(cue);
  cue.at = 29.7;
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "sfx_tail_fade"));
});

test("a cue under a spoken line must carry a duck", () => {
  const plan = resolvedPlan();
  const cue = plan.cues.find((candidate) => candidate.id === "sfx-room");
  assert.ok(cue);
  cue.duckDb = 0;
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "sfx_no_duck"));
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
