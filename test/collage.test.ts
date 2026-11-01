import test from "node:test";
import assert from "node:assert/strict";
import {
  BLANK_STDDEV,
  checkCollage,
  flatness,
  type CollageFrame,
  type CollageInput,
} from "../src/engine/collage.js";

const W = 1920;
const H = 1080;

/** A 32×18 RGB sample that alternates two colours: definitely a drawn frame. */
function drawn(seed = 0): number[] {
  const out: number[] = [];
  for (let index = 0; index < 32 * 18; index++) {
    const light = (index + seed) % 2 === 0;
    out.push(light ? 240 : 20, light ? 235 : 30, light ? 220 : 40);
  }
  return out;
}

function flat(colour: [number, number, number]): number[] {
  const out: number[] = [];
  for (let index = 0; index < 32 * 18; index++) out.push(...colour);
  return out;
}

function frame(shot: string, over: Partial<CollageFrame> = {}): CollageFrame {
  return {
    shot,
    time: 1,
    hash: `sha256:${shot}`,
    sample: drawn(),
    characters: [],
    text: [],
    ...over,
  };
}

const shots = [
  { id: "s01", cast: ["Kiran"] },
  { id: "s02", cast: [] },
  { id: "s03", cast: ["Kiran", "Vaz"] },
];

function check(over: Partial<CollageInput> = {}) {
  return checkCollage({
    film: "test",
    shots,
    frames: [
      frame("s01", { characters: ["Kiran"] }),
      frame("s02"),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
    ],
    width: W,
    height: H,
    ...over,
  });
}

const codes = (report: ReturnType<typeof check>) => report.errors.map((error) => error.code);

test("a collage of three drawn, distinct, cast-correct frames passes", () => {
  const report = check();
  assert.deepEqual(report.errors, []);
  assert.equal(report.ok, true);
  assert.equal(report.frames, 3);
  assert.equal(report.distinct, 3);
});

test("a shot with no frame is refused", () => {
  const report = check({
    frames: [frame("s01", { characters: ["Kiran"] }), frame("s02")],
  });
  const error = report.errors.find((issue) => issue.code === "collage:missing");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /s03/);
});

test("a frame that is one flat colour is refused", () => {
  const report = check({
    frames: [
      frame("s01", { characters: ["Kiran"], sample: flat([250, 250, 250]) }),
      frame("s02"),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
    ],
  });
  const error = report.errors.find((issue) => issue.code === "collage:blank");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /s01/);
});

test("two shots that are the same picture are refused", () => {
  const report = check({
    frames: [
      frame("s01", { characters: ["Kiran"], hash: "sha256:same" }),
      frame("s02", { hash: "sha256:same" }),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
    ],
  });
  const error = report.errors.find((issue) => issue.code === "collage:duplicate");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /"s01" and "s02"/);
});

test("a character the score stages but the frame never drew is refused", () => {
  const report = check({
    frames: [
      frame("s01", { characters: ["Kiran"] }),
      frame("s02"),
      frame("s03", { characters: ["Kiran"] }),
    ],
  });
  const error = report.errors.find((issue) => issue.code === "collage:cast");
  assert.ok(error, codes(report).join(", "));
  assert.match(error.message, /Vaz/);
  assert.match(error.message, /drew: Kiran/);
});

test("a shot the score does not have is refused", () => {
  const report = check({
    frames: [
      frame("s01", { characters: ["Kiran"] }),
      frame("s02"),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
      frame("s99"),
    ],
  });
  assert.ok(codes(report).includes("collage:unknown"));
});

test("a word painted off the frame is refused; a word crowding the edge is named", () => {
  const off = check({
    frames: [
      frame("s01", { characters: ["Kiran"], text: [{ text: "06:00", x: 1880, y: 40, w: 120, h: 40 }] }),
      frame("s02"),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
    ],
  });
  assert.ok(codes(off).includes("collage:text"));

  const crowded = check({
    frames: [
      frame("s01", { characters: ["Kiran"], text: [{ text: "06:00", x: 2, y: 40, w: 60, h: 30 }] }),
      frame("s02"),
      frame("s03", { characters: ["Kiran", "Vaz"] }),
    ],
  });
  assert.equal(crowded.ok, true);
  assert.ok(crowded.warnings.some((warning) => warning.code === "collage:crowd"));
});

test("flatness is what it says it is", () => {
  const none = flatness(flat([100, 100, 100]));
  assert.equal(none.colours, 1);
  assert.ok(none.stddev < BLANK_STDDEV);
  const some = flatness(drawn());
  assert.equal(some.colours, 2);
  assert.ok(some.stddev > 50);
});
