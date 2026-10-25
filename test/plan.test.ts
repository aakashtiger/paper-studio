import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { WeddingBriefSchema } from "../src/core/brief.js";
import { planWedding } from "../src/engine/plan.js";

const root = process.cwd();
const styleDir = resolve(root, "styles/paper-vows");
const fixture: unknown = JSON.parse(
  readFileSync(resolve(root, "fixtures/wedding-min/brief.json"), "utf8"),
);

function brief(overrides: Record<string, unknown> = {}) {
  return WeddingBriefSchema.parse({ ...(fixture as object), ...overrides });
}

test("the fixture brief is valid", () => {
  assert.doesNotThrow(() => brief());
});

test("shot durations sum to the requested duration", () => {
  const plan = planWedding(brief(), styleDir);
  const total = plan.shots.reduce((sum, shot) => sum + shot.duration, 0);
  assert.equal(total, 30);
  assert.equal(plan.frames, 900);
  assert.equal(plan.shots.length, 6);
});

test("the planner is deterministic", () => {
  const first = JSON.stringify(planWedding(brief(), styleDir));
  const second = JSON.stringify(planWedding(brief(), styleDir));
  assert.equal(first, second);
});

test("no photos substitutes a text shot and warns", () => {
  const plan = planWedding(brief({ photos: [] }), styleDir);
  assert.ok(plan.shots.some((shot) => shot.recipe === "blessing_text"));
  assert.ok(plan.warnings.some((warning) => warning.includes("no photos")));
});

test("photos select the portrait shot", () => {
  const plan = planWedding(
    brief({
      photos: [{ id: "p1", path: "photos/p1.jpg", consent: true }],
    }),
    styleDir,
  );
  assert.ok(plan.shots.some((shot) => shot.recipe === "portrait_frame"));
});

test("an unsupported palette fails loudly", () => {
  assert.throws(
    () => planWedding(brief({ palette: "neon" }), styleDir),
    /not supported/,
  );
});

test("31 seconds is rejected by the schema", () => {
  const result = WeddingBriefSchema.safeParse({ ...(fixture as object), duration: 31 });
  assert.equal(result.success, false);
});

test("a missing partner name is rejected by the schema", () => {
  const invalid = {
    ...(fixture as Record<string, unknown>),
    couple: { partnerA: { name: "" }, partnerB: { name: "Rohan" } },
  };
  assert.equal(WeddingBriefSchema.safeParse(invalid).success, false);
});
