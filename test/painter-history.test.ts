/**
 * Painter history independence.
 *
 * A frame must be a function of its time alone. If painting mutates shared
 * state (the pose library, for example), the same time paints differently
 * depending on how many frames were painted before it. That is a determinism
 * break: stills look fine, a 900-frame render drifts into a wreck.
 *
 * This pins both halves: a pose library that stays untouched, and a pose at a
 * given time that is identical cold and after 600 frames of history.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const root = process.cwd();
const film = resolve(root, "films/understudy");
// The painter is style-owned (docs/decisions/0015-painter-in-the-pack.md); the
// film loads it from the pack just as index.html does.
const painter = resolve(root, "styles/paper-kpop/canvas/recipes.js");
const sources = [
  "vendor/core.js",
  "vendor/type.js",
  "vendor/characters.js",
  "vendor/props.js",
  "vendor/scene_kit.js",
  "score-data.js",
].map((file) => readFileSync(resolve(film, file), "utf8"))
  .concat(readFileSync(painter, "utf8"))
  .join("\n;\n");

const noop = () => {};
const sandboxDocument = {
  createElement: () => ({ getContext: () => ({}), style: {} }),
  getElementById: () => null,
};

function openPainter(): {
  paintAll: (count: number) => void;
  paintAt: (time: number) => void;
  poses: Record<string, unknown>;
  draws: { time: number; name: string; pose: Record<string, number> }[];
} {
  const sandbox: Record<string, unknown> = {
    console,
    Math,
    Date,
    performance: { now: () => 0 },
    document: sandboxDocument,
    devicePixelRatio: 1,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  const harness = `
    const noop = () => {};
    ctx = new Proxy({}, {
      get(_t, prop) {
        const p = String(prop);
        if (p === "createRadialGradient" || p === "createLinearGradient") return () => ({ addColorStop: noop });
        if (p === "measureText") return () => ({ width: 10 });
        if (p === "canvas") return { width: 1920, height: 1080 };
        return noop;
      },
      set() { return true; },
    });
    globalThis.__draws = [];
    const realDraw = drawCharacter;
    drawCharacter = function (name, x, y, scale, poseName, flip, poseOverride, time) {
      __draws.push({ time: Number(time.toFixed(3)), name, pose: JSON.parse(JSON.stringify(poseOverride || {})) });
      return realDraw.apply(this, arguments);
    };
    globalThis.__paint = (t) => {
      const score = window.SCORE;
      const shot = score.shots.find((s) => t >= s.start && t < s.start + s.duration) || score.shots[score.shots.length - 1];
      window.PAPER_BACKEND.shots[shot.recipe](shot, t - shot.start, t);
    };
  `;
  vm.runInContext(`${sources}\n;\n${harness}`, sandbox, { filename: "painter.js" });

  const paint = sandbox.__paint as (t: number) => void;
  return {
    paintAll: (count) => {
      for (let index = 0; index < count; index++) paint(index / 30);
    },
    paintAt: (time) => paint(time),
    poses: sandbox.POSES as Record<string, unknown>,
    draws: sandbox.__draws as { time: number; name: string; pose: Record<string, number> }[],
  };
}

test("painter: the pose library is not mutated by painting", () => {
  const painter = openPainter();
  const before = JSON.stringify(painter.poses);
  painter.paintAll(630);
  assert.equal(JSON.stringify(painter.poses), before, "painting changed window.POSES");
});

test("painter: a time paints the same cold and after 600 frames of history", () => {
  const cold = openPainter();
  cold.paintAt(19);
  const coldDraws = cold.draws.filter((draw) => Math.abs(draw.time - 19) < 1e-6);

  const warm = openPainter();
  warm.paintAll(600);
  warm.paintAt(19);
  // paintAll already painted 19.0 (frame 570); compare the last paint only.
  const warmDraws = warm.draws.filter((draw) => Math.abs(draw.time - 19) < 1e-6).slice(-coldDraws.length);

  assert.ok(coldDraws.length > 0, "no character drawn at 19s");
  // The draws come from two vm realms, so normalise before a deep compare.
  const plain = (draws: unknown) => JSON.parse(JSON.stringify(draws));
  assert.deepEqual(plain(warmDraws), plain(coldDraws), "the frame at 19s depends on draw history");
});
