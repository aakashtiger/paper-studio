import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  // grip overlay so a held star reads as held, not floating
  [
    "  function clipboardProp(ctx, x, y, s, rot, t) {",
    `  function grip(ctx, x, y, s, skin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = skin; ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(0, 0, 11, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(8, -4, 4, 6, 0.5, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-6, i * 4); ctx.lineTo(4, i * 4); ctx.stroke(); }
    ctx.restore();
  }

  function clipboardProp(ctx, x, y, s, rot, t) {`,
  ],
  // s4: type above the hair; Mira's grip on the picked-up star
  ["TY.type(ctx, 'SO MIRA PICKED UP', 120, 260, 104, {", "TY.type(ctx, 'SO MIRA PICKED UP', 120, 170, 104, {"],
  ["TY.type(ctx, 'THE STAR', 120, 372, 104, {", "TY.type(ctx, 'THE STAR', 120, 290, 104, {"],
  ["TY.text(ctx, 'THE DRESSING ROOM, 7:58 PM', 126, 430, 17,", "TY.text(ctx, 'THE DRESSING ROOM, 7:58 PM', 126, 350, 17,"],
  ["      starProp(ctx, starX, starY, 0.8, lt * 0.7, t, 0.5 + 0.5 * pick);", "      starProp(ctx, starX, starY, 0.8, lt * 0.7, t, 0.5 + 0.5 * pick);\n      if (pick > 0.8) grip(ctx, mh[0], mh[1], 0.95, '#E8B98C');"],
  // s5: both hands on the star
  ["      starProp(ctx, sx, sy, 0.95, lt * 0.8, t, 0.6 + 0.4 * u);", "      starProp(ctx, sx, sy, 0.95, lt * 0.8, t, 0.6 + 0.4 * u);\n      grip(ctx, nh[0], nh[1], 1.0, '#D9A06A');\n      grip(ctx, mh[0], mh[1], 1.0, '#E8B98C');"],
  // s6: Nova a touch smaller, type fully on screen
  ["contactShadow(ctx, nx, GROUND, 1.12, 60);\n      nova(ctx, nx, GROUND, 1.12, t, np, faceAt(lt, [", "contactShadow(ctx, nx, GROUND, 1.05, 58);\n      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, ["],
  ["TY.type(ctx, 'THE CROWD SAW', 120, 120, 120, {", "TY.type(ctx, 'THE CROWD SAW', 120, 170, 110, {"],
  ["TY.type(ctx, 'A GIRL', 120, 220, 120, {", "TY.type(ctx, 'A GIRL', 120, 270, 110, {"],
  // s9: Nova's grip on the star
  ["      starProp(ctx, nh[0] - 6, nh[1] - 24, 0.8, lt * 0.5, t, 0.8);", "      starProp(ctx, nh[0] - 6, nh[1] - 24, 0.8, lt * 0.5, t, 0.8);\n      grip(ctx, nh[0], nh[1], 0.95, '#D9A06A');"],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING:", a.slice(0, 80).replace(/\n/g, "\\n"));
  s = s.replaceAll(a, b);
}
writeFileSync(p, s);
console.log("done");
