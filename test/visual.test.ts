import test from "node:test";
import assert from "node:assert/strict";
import { checkVisuals } from "../src/engine/visual.js";

const lines = [{ id: "v01" }, { id: "v02" }];
const recipes = [
  { id: "phone_route", subjects: ["phone", "route", "pin"] },
  { id: "lamp", subjects: ["lamp", "light"] },
  { id: "paper_open", subjects: ["title", "paper"], openingDefault: true },
];
const shot = (id: string, recipe: string, visual?: Record<string, string>) => ({
  id,
  recipe,
  visual: visual as { shows: string; action: string; focus: string; link: string; why: string } | undefined,
});
const brief = {
  shows: "a phone with a route and two pins",
  action: "the route draws itself",
  focus: "the moving pin",
  link: "v01",
  why: "the line says the network connects a rider and a driver",
};

test("a shot whose recipe can draw what the brief names passes", () => {
  const result = checkVisuals([shot("s01", "phone_route", brief)], recipes, lines);
  assert.deepEqual(result.findings, []);
});

test("a lamp cannot answer a phone brief", () => {
  const result = checkVisuals([shot("s01", "lamp", brief)], recipes, lines);
  assert.ok(result.findings.some((finding) => finding.code === "visual:match"));
});

test("a shot with no visual brief is refused", () => {
  const result = checkVisuals([shot("s01", "phone_route")], recipes, lines);
  assert.ok(result.findings.some((finding) => finding.code === "visual:missing"));
});

test("a visual that answers a line outside the clock is refused", () => {
  const result = checkVisuals([shot("s01", "phone_route", { ...brief, link: "v99" })], recipes, lines);
  assert.ok(result.findings.some((finding) => finding.code === "visual:link"));
});

test("the pack's default title card cannot open the film", () => {
  const result = checkVisuals(
    [shot("s01", "paper_open", { ...brief, shows: "a paper title card", focus: "the title" })],
    recipes,
    lines,
  );
  assert.ok(result.findings.some((finding) => finding.code === "visual:opening"));
});

test("one recipe doing more than 40% of the film is refused", () => {
  const shots = Array.from({ length: 10 }, (_, index) => shot(`s${index + 1}`, "phone_route", brief));
  const result = checkVisuals(shots, recipes, lines);
  assert.ok(result.findings.some((finding) => finding.code === "visual:repetition"));
});
