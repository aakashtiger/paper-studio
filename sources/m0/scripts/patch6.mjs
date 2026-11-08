import fs from "node:fs";
const p="src/scenes/test.js";
let s=fs.readFileSync(p,"utf8");
s=s.replace("const cx = 1330, cy = 500, r = 430 + 10 * C.bpmPulse(t);","const cx = 1410, cy = 470, r = 415 + 10 * C.bpmPulse(t);");
s=s.replace("TY.sticker(ctx, 'IN YOUR EYES', 112, 820, 31","TY.sticker(ctx, 'IN YOUR EYES', 250, 822, 31");
s=s.replace("idol(ctx, 1410, 996, 1.32, {","idol(ctx, 1430, 1004, 1.22, {");
s=s.replace("mira(ctx, 1100, 984, .95, {","mira(ctx, 1150, 1000, .95, {");
fs.writeFileSync(p,s);
