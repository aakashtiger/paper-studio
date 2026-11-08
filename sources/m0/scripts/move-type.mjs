import { readFileSync, writeFileSync } from "node:fs";
const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  ["TY.type(ctx, 'EVERY NIGHT', 90, 190, 120, {", "TY.type(ctx, 'EVERY NIGHT', 150, 190, 110, {"],
  ["TY.text(ctx, 'A CUE-LAMP STORY', 96, 250, 20,", "TY.text(ctx, 'A CUE-LAMP STORY', 156, 250, 20,"],
  ["TY.text(ctx, 'CUE 01', 96, 282, 14,", "TY.text(ctx, 'CUE 01', 156, 282, 14,"],
  ["TY.type(ctx, 'THE STAGE', 120, 190, 110, {", "TY.type(ctx, 'THE STAGE', 150, 190, 110, {"],
  ["TY.type(ctx, 'HOLDS ITS BREATH', 120, 310, 90, {", "TY.type(ctx, 'HOLDS ITS BREATH', 150, 310, 90, {"],
  ["TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 370, 18,", "TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 156, 370, 18,"],
  ["TY.type(ctx, 'THE CROWD SAW', 120, 170, 110, {", "TY.type(ctx, 'THE CROWD SAW', 150, 170, 110, {"],
  ["TY.type(ctx, 'A GIRL', 120, 270, 110, {", "TY.type(ctx, 'A GIRL', 150, 270, 110, {"],
  ["TY.type(ctx, 'THE LIGHT', 120, 260, 120, {", "TY.type(ctx, 'THE LIGHT', 150, 260, 120, {"],
  ["TY.type(ctx, 'FOUND HER', 120, 380, 120, {", "TY.type(ctx, 'FOUND HER', 150, 380, 120, {"],
  ["TY.type(ctx, 'THE LAMP', 120, 120, 120, {", "TY.type(ctx, 'THE LAMP', 150, 120, 120, {"],
  ["TY.type(ctx, 'CALLED AGAIN', 120, 220, 120, {", "TY.type(ctx, 'CALLED AGAIN', 150, 220, 120, {"],
  ["TY.type(ctx, 'THE CURTAIN', 120, 250, 112, {", "TY.type(ctx, 'THE CURTAIN', 150, 250, 112, {"],
  ["TY.type(ctx, 'OPENED', 120, 366, 112, {", "TY.type(ctx, 'OPENED', 150, 366, 112, {"],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING", a.slice(0, 60));
  s = s.replace(a, b);
}
writeFileSync(p, s);
console.log("type moved");
