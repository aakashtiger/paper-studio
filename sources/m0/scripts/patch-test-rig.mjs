import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const src = "studio/films/understudy/vendor/characters.js";
const dst = "proofs/kpop-test/test-rig.js";
copyFileSync(src, dst);
let s = readFileSync(dst, "utf8");
const before = s;

s = s.replace("const HIP = -306, SHOULDER = -500, HEAD = -604;", "const HIP = -315, SHOULDER = -500, HEAD = -604;");
s = s.replace("const HIP = -272, SHOULDER = -452, HEAD = -518;", "const HIP = -281, SHOULDER = -452, HEAD = -518;");
s = s.replace(
  "function boot(ctx, x, y, ang, col = PAL.blue, sole = PAL.cream, gold = PAL.gold) {",
  "function boot(ctx, x, y, ang, col = PAL.blue, sole = PAL.cream, gold = PAL.gold, flip = 1) {",
);
s = s.replace(
  "ctx.save(); ctx.translate(x, y); ctx.rotate(ang * .55);",
  "ctx.save(); ctx.translate(x, y); ctx.rotate(ang * .55); ctx.scale(flip, 1);",
);
s = s.replace(
  "boot(ctx, ankle[0], ankle[1] - 2, foot, far ? C.shade(bootCol, -18) : bootCol, PAL.cream, PAL.gold);",
  "boot(ctx, ankle[0], ankle[1] - 2, foot, far ? C.shade(bootCol, -18) : bootCol, PAL.cream, PAL.gold, side < 0 ? -1 : 1);",
);
s = s.replace('petals: 0, earrings: true', 'petals: 0, halo: 0, earrings: true');

writeFileSync(dst, s);
console.log("changed", before !== s);
for (const c of [
  "const HIP = -315",
  "const HIP = -281",
  "gold = PAL.gold, flip = 1",
  "ctx.scale(flip, 1)",
  "PAL.gold, side < 0 ? -1 : 1",
  "petals: 0, halo: 0",
]) console.log(c, s.includes(c));
