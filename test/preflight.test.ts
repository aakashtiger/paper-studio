import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_PACE, longestHole, median, preflightFilm, type PreflightInput } from "../src/engine/preflight.js";
import { FilmScoreSchema, resolveFilm, type ResolvedFilm } from "../src/engine/treatment.js";

const root = process.cwd();

/**
 * The film that was delivered and rejected, resolved for real — the score, the
 * style pack, the clock. The numbers below are therefore the film's own, not a
 * hand-made approximation of it.
 */
function resolvedSameAlarm(): ResolvedFilm {
  const score = FilmScoreSchema.parse(
    JSON.parse(readFileSync(resolve(root, "films/same-alarm/score.json"), "utf8")),
  );
  const { plan, errors } = resolveFilm(score, resolve(root, "styles/paper-kpop"), root);
  assert.deepEqual(errors, []);
  return plan;
}

/**
 * A film written to the declared rules: 30 s, twelve shots at the 2.5 s median,
 * nine lines of narration spoken end to end at 140 wpm, no cue longer than a
 * quarter of the film. This is the *shape* a passing film has; the only thing
 * synthetic about it is that nothing is painted.
 */
function passingPlan(): ResolvedFilm {
  const shotLength = 2.5;
  // Twelve shots at the 2.5 s median, each bound to the beat it serves and each
  // with a reason to exist. The assignment mirrors the beat map's shares: two
  // shots on the hook, three on the corridor, two on the demand, three on the
  // quiet turn, two on the button.
  const beatOf = ["b01", "b01", "b02", "b02", "b02", "b03", "b03", "b04", "b04", "b04", "b05", "b05"];
  const reasonOf = [
    "the alarm starts the day",
    "the lamp finds the phone",
    "twelve steps on lino",
    "the doors are all closed",
    "a phone rings on the desk",
    "he says yes again",
    "the light does not change",
    "the room empties around him",
    "a chair rolls to a stop",
    "he stays in the dark",
    "the alarm again at six",
    "no hand reaches for it",
  ];
  const shots = Array.from({ length: 12 }, (_, index) => ({
    id: `s${String(index + 1).padStart(2, "0")}`,
    beat: beatOf[index],
    recipe: "office_day",
    start: index * shotLength,
    duration: shotLength,
    slots: {},
    camera: { move: "hold", from: 1, to: 1 },
    motion: { note: "" },
    transitionOut: "cut",
    direction: { entry: "", exit: "", spine: reasonOf[index], cast: [], events: [] },
  }));
  // Seven lines, 2.6 s each, 1.5 s of air between them: 70 words over 30 s is
  // 140 wpm, and the longest quiet is the 2.2 s the film lands on.
  const spoken = [
    "same alarm same six same ceiling he has stared at for a decade",
    "same corridor same grey doors all of them shut",
    "nine hours under a light that never changes",
    "someone always needs the thing sooner than the last person",
    "he says yes because he has always been good at yes",
    "then the room empties and nobody needs anything at all",
    "he stays and the light does not stay with",
  ];
  const lines = spoken.map((text, index) => ({
    id: `v${String(index + 1).padStart(2, "0")}`,
    text,
    start: Number((0.6 + index * 4.1).toFixed(3)),
    duration: 2.6,
  }));
  return {
    projectId: "test-pass",
    shots,
    clock: { mode: "narration", lines },
    // One signature sound per scored beat, and nothing at all inside the quiet
    // turn (17.5–25.0 s), which is what that beat promised.
    cues: [
      { id: "sfx-alarm", kind: "hum", at: 1, from: "at" },
      { id: "sfx-step", kind: "step", at: 6.5, from: "at" },
      { id: "sfx-phone", kind: "slam", at: 13, from: "at" },
      { id: "sfx-button", kind: "hum", at: 26, from: "at" },
    ],
  } as unknown as ResolvedFilm;
}

/** The beat map `fixtures/story-min/beats.json` writes, as the cut check sees it. */
const TEST_BEATS = [
  { id: "b01", title: "the alarm", share: 18.5, sound: { signature: "three chirps", quiet: false } },
  { id: "b02", title: "the corridor", share: 23, sound: { signature: "twelve steps", quiet: false } },
  { id: "b03", title: "the demand", share: 18.5, sound: { signature: "a phone rings", quiet: false } },
  { id: "b04", title: "the lights go down", share: 20, sound: { signature: "a chair rolls", quiet: true } },
  { id: "b05", title: "the alarm again", share: 20, sound: { signature: "no hand arrives", quiet: false } },
];

function check(overrides: Partial<PreflightInput> = {}) {
  return preflightFilm({
    plan: passingPlan(),
    pace: DEFAULT_PACE,
    paceSource: "default",
    story: { errors: [], warnings: [] },
    beats: TEST_BEATS,
    cast: [],
    reproduce: false,
    ...overrides,
  });
}

const codes = (report: ReturnType<typeof check>) => report.errors.map((error) => error.code);

test("a film written to the declared band passes every cheap check", () => {
  const report = check();
  assert.deepEqual(report.errors, []);
  assert.equal(report.ok, true);
  assert.equal(report.shots.count, 12);
  assert.equal(report.shots.median, 2.5);
  assert.equal(report.narration?.words, 70);
  assert.equal(report.narration?.wpm, 140);
});

/**
 * Every test below is a defect a viewer named in one sentence, turned into a
 * refusal — and the first is the delivered film itself, measured from its own
 * score through the same resolver the renderer uses.
 */
test("the rejected film is refused for the four things its viewer said", () => {
  const report = preflightFilm({
    plan: resolvedSameAlarm(),
    pace: DEFAULT_PACE,
    paceSource: "default",
    story: null,
    cast: [],
    reproduce: true,
  });
  assert.equal(report.ok, false);
  const found = codes(report);
  // "slow to nil movement" — 10 shots, median 6.3 s.
  assert.ok(found.includes("pacing:median"), found.join(", "));
  assert.equal(report.shots.median, 6.25);
  assert.equal(report.shots.count, 10);
  // "hardly any narration" — 26 words in 60 s, and 17 s of it says nothing.
  assert.ok(found.includes("narration:wpm"));
  assert.equal(report.narration?.words, 26);
  assert.ok(found.includes("narration:hole"));
  assert.ok((report.narration?.hole ?? 0) > 16);
  // "continuous hissing" — one room bed for 58.9 s.
  assert.ok(found.includes("sound:bed"));
  assert.equal(report.sound.longest?.id, "sfx-room");
  assert.equal(report.sound.longest?.seconds, 58.9);
  // And the fact that explains all of it: the film was never written.
  assert.equal(report.reproduce, true, "a delivered film is a reproduction");
});

test("a film that begins at the shot list is refused, but a reproduction is allowed to be old", () => {
  assert.ok(codes(check({ story: null })).includes("story:missing"));
  const old = check({ story: null, reproduce: true });
  assert.equal(old.ok, true);
  assert.ok(old.warnings.some((warning) => warning.code === "story:missing"));
});

test("the median is the middle of the cut, not its average", () => {
  // Five 2 s shots and five 6 s shots: the mean is 4 s but no viewer of this cut
  // would say the shots last four seconds. The median is what a cut feels like.
  const plan = passingPlan();
  const lengths = [2, 2, 2, 2, 2, 6, 6, 6, 6, 6];
  const shots = lengths.map((duration, index) => ({
    ...plan.shots[0],
    id: `s${index}`,
    start: index * 2,
    duration,
  }));
  const report = check({ plan: { ...plan, shots } as ResolvedFilm });
  assert.ok(codes(report).includes("pacing:median"));
  assert.equal(report.shots.median, 4);
});

test("one shot that outstays the cut is refused by name", () => {
  const plan = passingPlan();
  const shots = plan.shots.map((shot, index) =>
    index === 3 ? { ...shot, duration: shot.duration * 2.5 } : shot,
  );
  const report = check({ plan: { ...plan, shots } as ResolvedFilm });
  const long = report.errors.find((error) => error.code === "pacing:long");
  assert.ok(long, codes(report).join(", "));
  assert.match(long.message, /"s04"/);
});

test("a hole in the narration is refused, and it names where the film goes quiet", () => {
  // *Same Alarm* ran 17.0 s with no line in it, from 38.8 s.
  const plan = passingPlan();
  const lines = plan.clock.mode === "narration" ? plan.clock.lines : [];
  const trimmed = lines.filter((line) => line.start < 6 || line.start > 20);
  const report = check({ plan: { ...plan, clock: { mode: "narration", lines: trimmed } } as ResolvedFilm });
  const hole = report.errors.find((error) => error.code === "narration:hole");
  assert.ok(hole, codes(report).join(", "));
  assert.match(hole.message, /no narration from 7\.3s/);
});

test("narration is measured on the clock, not on what the script hoped", () => {
  // The same words, delivered at half the speed: the line is twice as long, so
  // fewer of them fit in the film. This is why the voice is captured before the
  // shots are cut.
  const plan = passingPlan();
  const lines = plan.clock.mode === "narration" ? plan.clock.lines : [];
  const slow = lines.slice(0, 4).map((line, index) => ({
    ...line,
    start: 0.6 + index * 8,
    duration: 2.6,
  }));
  const report = check({ plan: { ...plan, clock: { mode: "narration", lines: slow } } as ResolvedFilm });
  assert.ok(codes(report).includes("narration:wpm"));
  assert.ok(codes(report).includes("narration:coverage"));
});

test("a single cue may not own the film", () => {
  const plan = passingPlan();
  const cues = [
    ...plan.cues,
    { id: "sfx-room", kind: "room", at: 0, duration: 29, from: "at" as const },
  ];
  const report = check({ plan: { ...plan, cues } as ResolvedFilm });
  const bed = report.errors.find((error) => error.code === "sound:bed");
  assert.ok(bed, codes(report).join(", "));
  assert.match(bed.message, /sfx-room/);
  assert.match(bed.message, /97%/);
});

test("a cast the film's vendor does not register is refused", () => {
  const report = check({
    cast: [
      { character: "Kiran", rig: "worker@0.1.0", poses: "films/x/cast/kiran.poses.json", problems: [] },
      {
        character: "Vaz",
        rig: "supervisor@9",
        poses: "films/x/cast/vaz.poses.json",
        problems: [{ code: "cast:rig", message: 'films/x/vendor does not register the rig "supervisor@9" for Vaz' }],
      },
    ],
  });
  assert.ok(codes(report).includes("cast:rig"));
});

test("the writing's own refusals reach the report as story errors", () => {
  const report = check({ story: { errors: [{ code: "story:turn", message: "no beat turns" }], warnings: [] } });
  assert.equal(report.ok, false);
  assert.equal(report.errors[0]?.check, "story");
  assert.equal(report.errors[0]?.code, "story:turn");
});

test("the film's scenes are the runs of shots that serve one beat", () => {
  const report = check();
  assert.equal(report.cut?.scenes.length, 5);
  assert.deepEqual(
    report.cut?.scenes.map((scene) => scene.beat),
    ["b01", "b02", "b03", "b04", "b05"],
  );
  assert.equal(report.cut?.scenes[3]?.seconds, 7.5);
});

test("a cut that does not answer its beats is refused before the render", () => {
  const plan = passingPlan();
  const shots = plan.shots.map((shot) => ({ ...shot, beat: undefined }));
  const report = check({ plan: { ...plan, shots } as ResolvedFilm });
  assert.ok(codes(report).includes("cut:unbound"), codes(report).join(", "));
  assert.equal(report.cut?.scenes.length, 0);
});

test("the arithmetic is the arithmetic", () => {
  assert.equal(median([]), 0);
  assert.equal(median([3]), 3);
  assert.equal(median([4, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  // Silence before the first line and after the last both count.
  const hole = longestHole([{ start: 5, duration: 1 }, { start: 20, duration: 1 }], 30);
  assert.equal(hole.hole, 14);
  assert.equal(hole.holeAt, 6);
  assert.deepEqual(longestHole([{ start: 0, duration: 30 }], 30), { hole: 0, holeAt: 0 });
});
