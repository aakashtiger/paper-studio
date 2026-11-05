import test from "node:test";
import assert from "node:assert/strict";
import { checkVisuals, type VisualShot } from "../src/engine/visual.js";

const lines = [
  {
    id: "v01",
    text: "Uber does not own the cars, kitchens, or the freight it moves; it owns the network that connects them.",
  },
  {
    id: "v02",
    text: "Riders open the app, drivers use their own cars, and every completed trip is matched by the platform.",
  },
];
const recipes = [
  { id: "phone_route", subjects: ["phone", "app", "route", "pin"] },
  { id: "network_web", subjects: ["network", "nodes", "riders", "drivers", "thread"] },
  { id: "lamp", subjects: ["lamp", "light"] },
  { id: "paper_open", subjects: ["title", "paper"], openingDefault: true },
];

const phone: VisualShot = {
  id: "s01",
  recipe: "phone_route",
  cast: ["Rider"],
  visual: {
    shows: "a phone lock screen with one app icon",
    action: "the rider presses the app icon and the map opens",
    focus: "the app icon under the thumb",
    link: "v02",
    phrase: "Riders open the app",
    device: "lock_screen",
    why: "the line says riders open the app and the press is the opening",
    performers: [
      {
        who: "Rider",
        does: "presses the app icon",
        why: "the sentence is about the rider opening the app",
      },
    ],
  },
};

const network: VisualShot = {
  id: "s02",
  recipe: "network_web",
  cast: [],
  visual: {
    shows: "a red thread connecting three paper objects",
    action: "the thread pulls taut between the objects",
    focus: "the single red thread",
    link: "v01",
    phrase: "it owns the network that connects them",
    device: "owned_thread",
    why: "the line says the network, not the objects, is what Uber owns",
  },
};

const check = (shots: VisualShot[]) => checkVisuals(shots, recipes, lines);

test("a phrase, a device and a purposeful performer pass", () => {
  assert.deepEqual(check([phone]).findings, []);
});

test("a diagram may cast nobody", () => {
  assert.deepEqual(check([network]).findings, []);
});

test("a shot with no visual brief is refused", () => {
  const result = check([{ id: "s01", recipe: "phone_route", cast: [] }]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:missing"));
});

test("a phrase must be contiguous words of the linked line", () => {
  const result = check([
    { ...phone, visual: { ...phone.visual!, phrase: "Riders open the map" } },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:phrase-link"));
});

test("a phrase must share a content word with the picture", () => {
  const result = check([
    {
      ...phone,
      visual: {
        ...phone.visual!,
        phrase: "it owns the network",
        link: "v01",
      },
    },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:phrase-match"));
});

test("the same shows, phrase or device is refused", () => {
  const twice = check([
    phone,
    { ...phone, id: "s02", visual: { ...phone.visual! } },
  ]);
  assert.ok(twice.findings.some((finding) => finding.code === "visual:repeat"));
});

test("the same action reworded is refused", () => {
  const twin: VisualShot = {
    ...phone,
    id: "s02",
    visual: {
      ...phone.visual!,
      shows: "a phone lock screen with one app tile",
      device: "lock_screen_two",
      action: "the rider presses the app icon as the map opens",
    },
  };
  const result = check([phone, twin]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:similar"));
});

test("one recipe cannot carry two ideas", () => {
  const result = check([
    phone,
    {
      ...phone,
      id: "s02",
      visual: {
        ...phone.visual!,
        shows: "a phone route with a moving pin",
        device: "moving_route",
        phrase: "every completed trip is matched",
      },
    },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:repetition"));
});

test("a staged character needs an action block", () => {
  const result = check([
    { ...phone, visual: { ...phone.visual!, performers: [] } },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:performer-missing"));
});

test("an action the phrase never needs is refused", () => {
  const result = check([
    {
      ...phone,
      visual: {
        ...phone.visual!,
        phrase: "it owns the network",
        link: "v01",
        performers: [
          {
            who: "Rider",
            does: "stands beside the phone",
            why: "the director wanted a body in frame",
          },
        ],
      },
    },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:performer-unearned"));
});

test("a performer without a cast is refused", () => {
  const result = check([
    { ...network, visual: { ...network.visual!, performers: phone.visual!.performers } },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:performer-unstaged"));
});

test("a missing cast is not the same as an empty cast", () => {
  const result = check([
    { id: "s01", recipe: "phone_route", visual: phone.visual },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:cast-missing"));
});

test("the phrase must land inside its shot in the measured read", () => {
  const words = [
    { w: "Riders", start: 1.0, end: 1.3 },
    { w: "open", start: 1.3, end: 1.5 },
    { w: "the", start: 1.5, end: 1.55 },
    { w: "app", start: 1.55, end: 1.8 },
  ];
  const inside = checkVisuals([{ ...phone, start: 0.5, duration: 2 }], recipes, lines, undefined, words);
  assert.ok(!inside.findings.some((finding) => finding.code === "visual:phrase-time"));
  const outside = checkVisuals([{ ...phone, start: 3, duration: 2 }], recipes, lines, undefined, words);
  assert.ok(outside.findings.some((finding) => finding.code === "visual:phrase-time"));
});

test("a whole line cannot stand in for a moment", () => {
  const result = check([
    {
      ...network,
      visual: { ...network.visual!, phrase: lines[0]!.text },
    },
  ]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:phrase-long"));
});

test("a performance/song clock without lines can have a device without a phrase", () => {
  const result = checkVisuals(
    [
      {
        ...network,
        visual: {
          shows: "a red thread connecting three paper objects",
          action: "the thread pulls taut",
          focus: "the red thread",
          link: "beat",
          device: "owned_thread",
          why: "the image carries the beat without narration",
        },
      },
    ],
    recipes,
    [],
  );
  assert.deepEqual(result.findings, []);
});

const continuity: VisualShot = {
  ...phone,
  id: "s03",
  start: 0,
  duration: 3,
  direction: {
    events: [
      { t: 0.1, kind: "pose", who: "Rider", pose: "hold" },
      { t: 0.5, kind: "pose", who: "Rider", pose: "walk" },
      { t: 1.2, kind: "pose", who: "Rider", pose: "reach" },
    ],
  },
};

test("a pose that lands too late or snaps into the next one is refused", () => {
  const late = checkVisuals(
    [
      {
        ...continuity,
        direction: {
          events: [
            { t: 0.6, kind: "pose", who: "Rider", pose: "hold" },
            { t: 1.2, kind: "pose", who: "Rider", pose: "walk" },
            { t: 2.0, kind: "pose", who: "Rider", pose: "reach" },
          ],
        },
      },
    ],
    recipes,
    lines,
    undefined,
    undefined,
    { contract: 3 },
  );
  assert.ok(late.findings.some((finding) => finding.code === "visual:pose-continuity"));

  const snap = checkVisuals(
    [
      {
        ...continuity,
        direction: {
          events: [
            { t: 0.1, kind: "pose", who: "Rider", pose: "hold" },
            { t: 0.3, kind: "pose", who: "Rider", pose: "walk" },
            { t: 1.2, kind: "action", who: "Rider", pose: "reach" },
          ],
        },
      },
    ],
    recipes,
    lines,
    undefined,
    undefined,
    { contract: 3 },
  );
  assert.ok(snap.findings.some((finding) => finding.code === "visual:pose-continuity"));
});

test("a lamp cannot answer a phone brief", () => {
  const result = check([{ ...phone, recipe: "lamp" }]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:match"));
});

test("the pack's default title card cannot open the film", () => {
  const result = check([{ ...phone, recipe: "paper_open" }]);
  assert.ok(result.findings.some((finding) => finding.code === "visual:opening"));
});
