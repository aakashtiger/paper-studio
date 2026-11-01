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
  assert.equal(report.events, 36);
  assert.equal(report.scored + report.bare, report.events);
  // Quiet is a decision, not a default: a quarter of the events is the ceiling
  // before the film is mostly held beats.
  assert.ok(report.bare <= 9, `${report.bare} events are bare`);
});

test("an event nobody scored is an error, not a warning", () => {
  const plan = resolvedPlan();
  // Take a cue off the event it is bound to: the event is now bare in a score
  // that gave it no `quiet` reason, which is the case the coverage row exists
  // for. (The reverse — a cue *and* a reason — is the next test.)
  const cue = plan.cues.find((candidate) => (candidate.event?.index ?? 0) > 0);
  assert.ok(cue?.event, "the fixture should score an event after the first");
  plan.cues = plan.cues.filter((candidate) => candidate !== cue);
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

test("a cue that rings through a silence is the same lie as one that starts in it", () => {
  // A 0.8 s paper cue at 1.6 s runs into a window declared silent at 2.2 s. It
  // does not *start* in the window, and the film is still claiming silence
  // while the cue is audible — which is what the ear hears.
  const plan = resolvedPlan();
  plan.audio.sfx?.silences.push({ from: 2.2, to: 2.5, why: "a test hole" });
  const report = auditFilm(plan, { root });
  assert.ok(
    report.errors.some((issue) => issue.code === "sfx_in_silence" && /runs/.test(issue.message)),
    "overlap, not just the start, has to be caught",
  );
});

test("a declared silence cannot sit under narration", () => {
  // A cue sheet never sees the voice: the window can look empty and still be
  // full of the loudest thing in the film. The audit reads the clock.
  const plan = resolvedPlan();
  assert.equal(plan.clock.mode, "narration");
  const line = plan.clock.mode === "narration" ? plan.clock.lines[0] : undefined;
  assert.ok(line);
  plan.audio.sfx?.silences.push({
    from: Number((line.start + 0.2).toFixed(2)),
    to: Number((line.start + 0.6).toFixed(2)),
    why: "a test hole over a word",
  });
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "silence_over_voice"));
});

test("an event with a cue and a quiet reason cannot be both", () => {
  const plan = resolvedPlan();
  const shot = plan.shots[2];
  assert.ok(shot);
  const cue = plan.cues.find((candidate) => candidate.event?.shot === shot.id);
  assert.ok(cue?.event);
  const event = shot.direction.events[cue.event.index];
  assert.ok(event);
  event.quiet = "it is silent here";
  const report = auditFilm(plan, { root });
  assert.ok(report.errors.some((issue) => issue.code === "sfx_quiet_scored"));
});

test("an event with no cue and no quiet reason is an error", () => {
  const plan = resolvedPlan();
  const shot = plan.shots[6];
  assert.ok(shot);
  const event = shot.direction.events.find((candidate) => candidate.quiet);
  assert.ok(event, "the fixture should have a bare event with a reason");
  delete event.quiet;
  const report = auditFilm(plan, { root });
  assert.ok(
    report.errors.some((issue) => issue.code === "sfx_unscored" && /quiet/.test(issue.message)),
    "a bare event without a reason has to fail",
  );
});

test("a long hole needs a reason", () => {
  // Bare events now carry their own reason, so a hole is only visible as a
  // stretch of *time* with no foley in it. A room bed is a sound, so it fills
  // one: strip the cues out of the middle of the film, take the bed with them
  // and remove every declared silence. 9 s of nothing has to fail.
  const plan = resolvedPlan();
  plan.audio.sfx?.silences.splice(0, plan.audio.sfx.silences.length);
  plan.cues = plan.cues.filter((cue) => cue.kind !== "room" && (cue.at < 5 || cue.at > 14));
  const report = auditFilm(plan, { root });
  assert.ok(report.ok === false);
  assert.ok(report.errors.some((issue) => issue.code === "sfx_gap"), "a 9 s hole must be named");
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
