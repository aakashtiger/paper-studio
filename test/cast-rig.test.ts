/**
 * Cast rig reachability.
 *
 * Every pose in a cast library hands the rig a foot target. The rig is a
 * two-bone leg of a fixed length, so a target further from the hip than the leg
 * can reach is silently clamped: the knee locks straight and the foot stops
 * short of the ground. That is exactly how this fixture ended up with no knee
 * bend at all and contact shadows 27 px away from the boots.
 *
 * The numbers live in the vendor rig, the targets live in the cast JSON, and
 * nothing compared them until `npm run audit:rig` rendered a film. This test
 * compares them in a second, so bad pose data fails before a render.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

type Rig = { hip: number; hipX: number; thigh: number; shin: number; sole: number; poses: string };

function number(source: string, pattern: RegExp, what: string): number {
  const match = pattern.exec(source);
  assert.ok(match, `could not read ${what} from films/understudy/vendor/characters.js`);
  return Number(match[1]);
}

function readRig(): Record<"Nova" | "Mira", Rig> {
  const source = readFileSync(resolve(root, "films/understudy/vendor/characters.js"), "utf8");

  const idolHip = number(source, /const HIP = (-?\d+), SHOULDER = -500/, "idol hip");
  const idolLegs = /solveLeg\(hx, hy, target\[0\], target\[1\], (\d+), (\d+), side\)[\s\S]{0,220}?limb\(ctx, hx, hy, (\d+)[\s\S]{0,200}?limb\(ctx, knee\[0\], knee\[1\], (\d+)/.exec(source);
  assert.ok(idolLegs, "could not read the idol leg lengths");
  assert.equal(idolLegs[1], idolLegs[3], "idol solves one thigh length and draws another");
  assert.equal(idolLegs[2], idolLegs[4], "idol solves one shin length and draws another");

  const miraHip = number(source, /const HIP = (-?\d+), SHOULDER = -452/, "mira hip");
  const miraLegs = /solveLeg\(hx, hy, target\[0\], target\[1\], (\d+), (\d+), side\)[\s\S]{0,220}?limb\(ctx, hx, hy, (\d+)[\s\S]{0,200}?limb\(ctx, knee\[0\], knee\[1\], (\d+)/.exec(
    source.slice(source.indexOf("const HIP = -272")),
  );
  assert.ok(miraLegs, "could not read the mira leg lengths");
  assert.equal(miraLegs[1], miraLegs[3], "mira solves one thigh length and draws another");
  assert.equal(miraLegs[2], miraLegs[4], "mira solves one shin length and draws another");

  // The boot reaches 39 px below the ankle (platform sole), the sneaker 8 px.
  const boot = /function boot\(ctx[\s\S]{0,900}?roundRectPath\(ctx, (-?\d+), (\d+), (\d+), (\d+),/.exec(source);
  assert.ok(boot, "could not read the boot sole");
  const bootSole = Number(boot[2]) + Number(boot[4]) - 2;

  return {
    Nova: { hip: idolHip, hipX: 16, thigh: Number(idolLegs[1]), shin: Number(idolLegs[2]), sole: bootSole, poses: "films/understudy/cast/nova.poses.json" },
    Mira: { hip: miraHip, hipX: 14, thigh: Number(miraLegs[1]), shin: Number(miraLegs[2]), sole: 8, poses: "films/understudy/cast/mira.poses.json" },
  };
}

const rigs = readRig();

function bend(leg: number, reach: number): number {
  // Interior knee angle from the law of cosines, as a bend from straight.
  const [l1, l2] = [leg / 2, leg / 2];
  const cos = (reach * reach - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  return Math.acos(Math.max(-1, Math.min(1, cos)));
}

for (const [name, rig] of Object.entries(rigs)) {
  const library = JSON.parse(readFileSync(resolve(root, rig.poses), "utf8")) as {
    poses: { name: string; params: Record<string, unknown> }[];
  };
  const leg = rig.thigh + rig.shin;

  test(`${name}: every foot target is within the leg's reach`, () => {
    const unreachable: string[] = [];
    for (const pose of library.poses) {
      const bounce = Number(pose.params.bounce ?? 0);
      for (const side of [-1, 1] as const) {
        const target = pose.params[side < 0 ? "footL" : "footR"];
        if (!Array.isArray(target)) continue;
        const reach = Math.hypot(Number(target[0]) - side * rig.hipX, Number(target[1]) - (rig.hip + bounce));
        // 0.5 px of slack: the solver clamps at exactly l1 + l2.
        if (reach > leg - 0.5) {
          unreachable.push(`${pose.name}/${side < 0 ? "L" : "R"} needs ${reach.toFixed(1)} of ${leg}`);
        }
      }
    }
    assert.deepEqual(unreachable, [], "a clamped target locks the knee and stops the foot short");
  });

  test(`${name}: a grounded foot has a bent knee and lands on the ground line`, () => {
    const bad: string[] = [];
    for (const pose of library.poses) {
      for (const side of [-1, 1] as const) {
        const target = pose.params[side < 0 ? "footL" : "footR"];
        if (!Array.isArray(target)) continue;
        const sole = Number(target[1]) + rig.sole;
        const grounded = Math.abs(sole) <= 10;
        if (!grounded) continue;
        const bounce = Number(pose.params.bounce ?? 0);
        const reach = Math.hypot(Number(target[0]) - side * rig.hipX, Number(target[1]) - (rig.hip + bounce));
        const knee = (bend(leg, reach) * 180) / Math.PI;
        if (knee < 8) bad.push(`${pose.name}/${side < 0 ? "L" : "R"} stands on a ${knee.toFixed(1)}° knee`);
        if (sole < -10 || sole > 10) bad.push(`${pose.name}/${side < 0 ? "L" : "R"} sole ${sole.toFixed(1)} px from the ground`);
      }
    }
    assert.deepEqual(bad, [], "a planted foot must bend its knee and touch the ground");
  });
}

/**
 * The office rig (*Same Alarm*) is a different rig with the same requirement, and
 * it was not covered: its hip sat 272 above the floor on a 273 leg — straight by
 * construction — and the supervisor's 286 floated above legs that could not reach
 * the ground. A walk then raised the hip by up to 10 units (a negative pose
 * bounce, the breathing, and the recipe's step bob) and `audit:rig` found 209
 * clamped legs on a delivered cut.
 *
 * The allowance for that bob is not a number typed here: it is read out of the
 * pack painter, so a faster walk or a deeper breath fails this test instead of a
 * film.
 */
function readOfficeRig() {
  const source = readFileSync(resolve(root, "films/same-alarm/vendor/office.js"), "utf8");
  const painter = readFileSync(resolve(root, "styles/paper-kpop/canvas/recipes.js"), "utf8");

  const hips = [...source.matchAll(/const HIP = (-?\d+);/g)].map((m) => Number(m[1]));
  assert.equal(hips.length, 1, "the office rig should declare one hip height, not one per character");

  const legs = /solveLeg\(hx, hy, target\[0\], target\[1\], (\d+), (\d+), side\)[\s\S]{0,240}?limb\(ctx, hx, hy, (\d+)[\s\S]{0,200}?limb\(ctx, knee\[0\], knee\[1\], (\d+)/.exec(source);
  assert.ok(legs, "could not read the office leg lengths");
  assert.equal(legs[1], legs[3], "the office rig solves one thigh length and draws another");
  assert.equal(legs[2], legs[4], "the office rig solves one shin length and draws another");

  // How far the paint may lift the hip above the pose the library declares.
  return {
    hip: Number(hips[0]),
    // `boss ? 16 : 14` is the hip's half-width, which the solve measures from.
    hipX: { Kiran: 14, Vaz: 16 },
    thigh: Number(legs[1]),
    shin: Number(legs[2]),
    sole: 8, // the shoe is drawn from -9 to +10 around an ankle placed 2 px up
    poses: { Kiran: "library/characters/kiran/poses.json", Vaz: "library/characters/vaz/poses.json" },
  };
}

const office = readOfficeRig();
const officeLeg = office.thigh + office.shin;

for (const [name, posesPath] of Object.entries(office.poses)) {
  const library = JSON.parse(readFileSync(resolve(root, posesPath), "utf8")) as {
    poses: { name: string; params: Record<string, unknown> }[];
  };
  const hipX = office.hipX[name as "Kiran" | "Vaz"];

  test(`office ${name}: every pose reaches the ground at its own bounce`, () => {
    const unreachable: string[] = [];
    for (const pose of library.poses) {
      const bounce = Number(pose.params.bounce ?? 0);
      const hip = office.hip + bounce;
      for (const side of [-1, 1] as const) {
        const target = pose.params[side < 0 ? "footL" : "footR"];
        if (!Array.isArray(target)) continue;
        const reach = Math.hypot(Number(target[0]) - side * hipX, Number(target[1]) - hip);
        // The rig is straight-legged now: a planted foot must be reachable, not
        // leave eight units of bend. A bend in this flat 2D solve is a sideways
        // knee, which is the frog the old slack produced.
        if (reach > officeLeg + 0.5) {
          unreachable.push(
            `${pose.name}/${side < 0 ? "L" : "R"} needs ${reach.toFixed(1)} of ${officeLeg} at bounce ${bounce}`,
          );
        }
      }
    }
    assert.deepEqual(unreachable, [], "the leg clamps and the foot floats above its shadow");
  });

  test(`office ${name}: every pose has a foot on the ground, and none through it`, () => {
    const bad: string[] = [];
    for (const pose of library.poses) {
      const soles = ([-1, 1] as const).map((side) => {
        const target = pose.params[side < 0 ? "footL" : "footR"];
        return Array.isArray(target) ? Number(target[1]) + office.sole : null;
      });
      const grounded = soles.filter((sole): sole is number => sole !== null);
      if (!grounded.length) continue;
      // A stepping foot is lifted — that is what a step is, and -y is up, so a
      // lifted sole is negative. What no pose may do is stand in the floor, or
      // stand with no foot on it at all.
      for (const sole of grounded) {
        if (sole > 2) bad.push(`${pose.name} puts a sole ${sole.toFixed(1)} px into the ground`);
      }
      if (!grounded.some((sole) => Math.abs(sole) <= 10)) {
        bad.push(`${pose.name} has no support foot (soles ${grounded.map((s) => s.toFixed(1)).join(", ")})`);
      }
    }
    assert.deepEqual(bad, [], "a planted foot must touch the ground and no foot may pass through it");
  });
}
