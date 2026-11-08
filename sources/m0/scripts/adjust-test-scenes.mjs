import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  ["  const PINK = '#E86A96';", "  const PINK = '#E86A96';\n  const GROUND = 960;"],
  // s1
  ["const nx = 330 + 42 * C.easeOut(C.clamp(lt / 1.6));", "const nx = 880 + 30 * C.easeOut(C.clamp(lt / 1.6));"],
  ["nova(ctx, nx, 1008, 1.05, t, np, faceAt(t, [", "nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, ["],
  ["mira(ctx, 1520, 1008, 0.95, t, mp,", "mira(ctx, 1460, GROUND, 0.95, t, mp,"],
  ["const mh = miraHand(1520, 1008, 0.95, mp, 'R');", "const mh = miraHand(1460, GROUND, 0.95, mp, 'R');"],
  ["TY.type(ctx, 'EVERY NIGHT', 120, 300, 150, {", "TY.type(ctx, 'EVERY NIGHT', 120, 230, 150, {"],
  ["TY.text(ctx, 'A CUE-LAMP STORY', 126, 360, 20,", "TY.text(ctx, 'A CUE-LAMP STORY', 126, 300, 20,"],
  ["TY.text(ctx, 'CUE 01', 126, 392, 14,", "TY.text(ctx, 'CUE 01', 126, 332, 14,"],
  ["ctx.translate(1500, 640);", "ctx.translate(1180, 620);"],
  // s2
  ["const nx = 372 + 96 * C.easeOut(C.clamp((lt - 0.2) / 1.6));", "const nx = 600 + 560 * C.easeOut(C.clamp((lt - 0.2) / 1.6));"],
  ["nova(ctx, nx, 1008, 1.05, t, np, faceAt(t, [", "nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, ["],
  ["mira(ctx, 1520, 1008, 0.95, t, mp,", "mira(ctx, 1460, GROUND, 0.95, t, mp,"],
  ["const mh = miraHand(1520, 1008, 0.95, mp, 'R');", "const mh = miraHand(1460, GROUND, 0.95, mp, 'R');"],
  ["TY.type(ctx, 'THE STAGE', 120, 280, 120, {", "TY.type(ctx, 'THE STAGE', 120, 210, 120, {"],
  ["TY.type(ctx, 'HOLDS ITS BREATH', 120, 400, 110, {", "TY.type(ctx, 'HOLDS ITS BREATH', 120, 330, 110, {"],
  ["TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 456, 18,", "TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 390, 18,"],
  // s3
  ["mira(ctx, mx, 1008, 0.98, t, mp,", "mira(ctx, mx, GROUND, 0.98, t, mp,"],
  ["const mh = miraHand(mx, 1008, 0.98, mp, 'R');", "const mh = miraHand(mx, GROUND, 0.98, mp, 'R');"],
  // s4
  ["nova(ctx, 760, 1010, 1.05, t, np, faceAt(t, [", "nova(ctx, 760, GROUND, 1.05, t, np, faceAt(t, ["],
  ["mira(ctx, mx, 1010, 0.98, t, mp,", "mira(ctx, mx, GROUND, 0.98, t, mp,"],
  ["const mh = miraHand(mx, 1010, 0.98, mp, 'L');", "const mh = miraHand(mx, GROUND, 0.98, mp, 'L');"],
  // s6
  ["nova(ctx, nx, 1008, 1.12, t, np, faceAt(t, [", "nova(ctx, nx, GROUND, 1.12, t, np, faceAt(t, ["],
  ["mira(ctx, mx, 1008, 1.0, t, mp,", "mira(ctx, mx, GROUND, 1.0, t, mp,"],
  ["backup(ctx, bx, 1008, 0.88, t, i, bp,", "backup(ctx, bx, GROUND, 0.88, t, i, bp,"],
  // s7
  ["nova(ctx, 980, 1040, 1.25, t, np, faceAt(t, [", "nova(ctx, 980, GROUND, 1.25, t, np, faceAt(t, ["],
  ["mira(ctx, 1420, 1010, 1.0, t, mp,", "mira(ctx, 1420, GROUND, 1.0, t, mp,"],
  // s8
  ["nova(ctx, 900, 1008, 1.1, t, np, faceAt(t, [", "nova(ctx, 900, GROUND, 1.1, t, np, faceAt(t, ["],
  ["mira(ctx, 1420, 1008, 1.05, t, mp, faceAt(t, [", "mira(ctx, 1420, GROUND, 1.05, t, mp, faceAt(t, ["],
  // s9
  ["nova(ctx, 820, 1010, 1.1, t, np, faceAt(t, [", "nova(ctx, 820, GROUND, 1.1, t, np, faceAt(t, ["],
  ["mira(ctx, 1100, 1010, 1.05, t, mp, faceAt(t, [", "mira(ctx, 1100, GROUND, 1.05, t, mp, faceAt(t, ["],
  ["const nh = novaHand(820, 1010, 1.1, np, 'L');", "const nh = novaHand(820, GROUND, 1.1, np, 'L');"],
  ["const mh = miraHand(1100, 1010, 1.05, mp, 'R');", "const mh = miraHand(1100, GROUND, 1.05, mp, 'R');"],
  // frame
  ["if (line) TY.subtitle(ctx, line, t, { x: 84, y: 1006, size: 30 });", "if (line) TY.subtitle(ctx, line, t, { x: 84, y: 1024, size: 30 });"],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING:", a.slice(0, 70));
  s = s.replace(a, b);
}
writeFileSync(p, s);
console.log("done");
