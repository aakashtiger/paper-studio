import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveFilm, type FilmScore } from "../src/engine/treatment.js";
import { buildBoard } from "../src/engine/board.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-kpop");
const pilot = JSON.parse(
  readFileSync(resolve(root, "films/understudy/score.json"), "utf8"),
) as FilmScore;

function plan() {
  const { plan, errors } = resolveFilm(pilot, styleDir, root);
  assert.deepEqual(errors, []);
  return plan;
}

test("the board is derived: one frame per shot", () => {
  const entries = buildBoard(plan());
  assert.equal(entries.length, 9);
  assert.equal(entries[0]?.shotId, "s01");
  assert.equal(entries[8]?.shotId, "s09");
  assert.ok(entries.every((entry) => entry.time > 0 && entry.frame > 0));
  assert.deepEqual(
    entries.map((entry) => entry.time),
    [...entries.map((entry) => entry.time)].sort((a, b) => a - b),
  );
});

test("a marked beat adds one board frame; there is no fixed count", () => {
  const score = structuredClone(pilot);
  const shot = score.shots[0];
  assert.ok(shot);
  shot.direction.events.push({ t: 0.8, kind: "board", note: "lamp detail" });
  const { plan: resolved } = resolveFilm(score, styleDir, root);
  const entries = buildBoard(resolved);
  assert.equal(entries.length, 10);
  assert.ok(entries.some((entry) => entry.id === "s01-beat-4" && entry.time === 0.8));
});
