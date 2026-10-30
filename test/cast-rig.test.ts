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
