import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  // ---- new props: contact shadow + mic stand ----
  [
    "  function starProp(ctx, x, y, s, rot, t, glow = 1) {",
    `  function contactShadow(ctx, x, y, s, w = 60) {
    ctx.save();
    ctx.fillStyle = C.rgba(INK, 0.26);
    ctx.beginPath(); ctx.ellipse(x, y + 4, w * s, 13 * s, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function micStand(ctx, x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // base
    paper(ctx, () => roundRectPath(ctx, -34, -10, 68, 16, 6), { fill: INK, edge: C.rgba(CREAM, 0.3), edgeW: 1.5, shadow: C.rgba(INK, 0.3), sx: 3, sy: 5 });
    // pole
    paper(ctx, () => tornRectPath(ctx, -4, -660, 8, 660, 2, 7), { fill: GOLD, edge: INK, edgeW: 1.2 });
    // boom
    ctx.strokeStyle = INK; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -660); ctx.lineTo(26, -742); ctx.stroke();
    // capsule
    ctx.save(); ctx.translate(26, -748); ctx.rotate(0.12);
    paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 0, 15, 24, 0, 0, TAU); }, { fill: PAL.silver, edge: INK, edgeW: 2.2, shadow: C.rgba(INK, 0.25), sx: 2, sy: 4 });
    ctx.strokeStyle = C.rgba(INK, 0.45); ctx.lineWidth = 1.4;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-9, i * 7); ctx.lineTo(9, i * 7); ctx.stroke(); }
    ctx.restore();
    // cable
    ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(40 + Math.sin(t * 1.4) * 8, 60, 90, 30); ctx.stroke();
    ctx.restore();
  }

  function starProp(ctx, x, y, s, rot, t, glow = 1) {`,
  ],
  // ---- clipboard held by the clip, not floating ----
  ["clipboardProp(ctx, mh[0], mh[1] + 20, 0.7, -0.08, t);", "clipboardProp(ctx, mh[0], mh[1] + 78, 0.7, -0.08, t);"],
  ["clipboardProp(ctx, mh[0], mh[1] + 20, 0.72, -0.1, t);", "clipboardProp(ctx, mh[0], mh[1] + 78, 0.72, -0.1, t);"],
  ["clipboardProp(ctx, mh[0], mh[1] + 20, 0.65, -0.1, t);", "clipboardProp(ctx, mh[0], mh[1] + 78, 0.65, -0.1, t);"],
  // ---- s1: Mira and lamp clear of the speaker; contact shadow ----
  ["mira(ctx, 1460, GROUND, 0.95, t, mp,", "mira(ctx, 1360, GROUND, 0.95, t, mp,"],
  ["const mh = miraHand(1460, GROUND, 0.95, mp, 'R');", "const mh = miraHand(1360, GROUND, 0.95, mp, 'R');"],
  ["cueLamp(ctx, 1680, 900, 1.0, t, {", "cueLamp(ctx, 1580, 900, 1.0, t, {"],
  ["nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, [", "contactShadow(ctx, nx, GROUND, 1.05, 58);\n      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, ["],
  // ---- s2: Mira and lamp clear; type left stack; contact shadow ----
  ["mira(ctx, 1460, GROUND, 0.95, t, mp,", "mira(ctx, 1360, GROUND, 0.95, t, mp,"],
  ["const mh = miraHand(1460, GROUND, 0.95, mp, 'R');", "const mh = miraHand(1360, GROUND, 0.95, mp, 'R');"],
  ["cueLamp(ctx, 1680, 900, 1.0, t, {", "cueLamp(ctx, 1580, 900, 1.0, t, {"],
  ["TY.type(ctx, 'THE STAGE', 120, 210, 120, {", "TY.type(ctx, 'THE STAGE', 120, 190, 110, {"],
  ["TY.type(ctx, 'HOLDS ITS BREATH', 120, 330, 110, {", "TY.type(ctx, 'HOLDS ITS BREATH', 120, 310, 90, {"],
  ["TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 390, 18,", "TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 370, 18,"],
  ["nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, [", "contactShadow(ctx, nx, GROUND, 1.05, 58);\n      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(t, ["],
  // ---- s3: type above Mira's head; work light off the call sheet; contact shadow ----
  ["TY.type(ctx, 'THE WINGS', 1090, 270, 120, {", "TY.type(ctx, 'THE WINGS', 1090, 180, 120, {"],
  ["TY.type(ctx, 'WERE EMPTY', 1090, 388, 120, {", "TY.type(ctx, 'WERE EMPTY', 1090, 300, 120, {"],
  ["TY.text(ctx, 'THE NAME CARD WAS STILL ON THE FLOOR', 1096, 446, 17,", "TY.text(ctx, 'THE NAME CARD WAS STILL ON THE FLOOR', 1096, 360, 17,"],
  ["const wx = 620 + Math.sin(t * 0.6) * 6;", "const wx = 380 + Math.sin(t * 0.6) * 6;"],
  ["mira(ctx, mx, GROUND, 0.98, t, mp,", "contactShadow(ctx, mx, GROUND, 0.98, 56);\n      mira(ctx, mx, GROUND, 0.98, t, mp,"],
  // ---- s4: Nova slumped, star on the table, poster away from type; contact shadow ----
  [
    `        armL: C.kf(lt, [[0, [0.4, 0.9]], [1.3, [0.5, 1.1]], [1.8, [0.3, 0.4]]]),
        armR: C.kf(lt, [[0, [-0.4, -0.9]], [1.3, [-0.5, -1.1]], [1.8, [-0.3, -0.4]]]),`,
    `        armL: C.kf(lt, [[0, [0.15, 0.15]], [1.3, [0.3, 0.5]], [1.8, [0.3, 0.4]]]),
        armR: C.kf(lt, [[0, [-0.15, -0.15]], [1.3, [-0.3, -0.5]], [1.8, [-0.3, -0.4]]]),`,
  ],
  [
    `        sway: 1.5, lean: C.kf(lt, [[0, 0.06], [1.3, 0.02], [1.8, -0.02]]),
        headTilt: C.kf(lt, [[0, 0.18], [1.3, 0.1], [1.8, 0.02]]),`,
    `        sway: 1.5, lean: C.kf(lt, [[0, 0.12], [1.3, 0.06], [1.8, -0.02]]),
        headTilt: C.kf(lt, [[0, 0.22], [1.3, 0.12], [1.8, 0.02]]),`,
  ],
  ["paper(ctx, () => tornRectPath(ctx, 380, 170, 210, 280, 3, 5)", "paper(ctx, () => tornRectPath(ctx, 1500, 170, 210, 280, 3, 5)"],
  ["TY.text(ctx, 'TONIGHT', 404, 218, 15,", "TY.text(ctx, 'TONIGHT', 1524, 218, 15,"],
  ["TY.text(ctx, 'NOVA', 404, 286, 44,", "TY.text(ctx, 'NOVA', 1524, 286, 44,"],
  ["TY.text(ctx, 'ONE NIGHT ONLY', 404, 318, 12,", "TY.text(ctx, 'ONE NIGHT ONLY', 1524, 318, 12,"],
  ["const starY = C.lerp(720, mh[1] - 18, pick);", "const starY = C.lerp(745, mh[1] - 18, pick);"],
  ["nova(ctx, 760, GROUND, 1.05, t, np, faceAt(t, [", "contactShadow(ctx, 760, GROUND, 1.05, 58);\n      nova(ctx, 760, GROUND, 1.05, t, np, faceAt(t, ["],
  ["mira(ctx, mx, GROUND, 0.98, t, mp,", "contactShadow(ctx, mx, GROUND, 0.98, 56);\n      mira(ctx, mx, GROUND, 0.98, t, mp,"],
  // ---- s5: lower handoff, type above the hair ----
  [
    `        armL: [0.4, 0.9], armR: C.kf(lt, [[0, [-0.7, -0.9]], [0.7, [-1.05, -0.9]], [1.2, [-0.95, -0.55]], [dur, [-0.7, -0.4]]]),`,
    `        armL: [0.25, 0.1], armR: C.kf(lt, [[0, [-0.7, -0.3]], [0.7, [-0.8, -0.3]], [1.2, [-0.75, -0.2]], [dur, [-0.6, -0.2]]]),`,
  ],
  [
    `        armL: C.kf(lt, [[0, [0.9, 1.0]], [0.7, [1.05, 0.9]], [1.2, [0.95, 0.55]], [dur, [0.7, 0.4]]]),
        armR: [-0.4, -0.9],`,
    `        armL: C.kf(lt, [[0, [0.7, 0.3]], [0.7, [0.8, 0.3]], [1.2, [0.75, 0.2]], [dur, [0.6, 0.2]]]),
        armR: [-0.25, -0.1],`,
  ],
  ["TY.type(ctx, 'AND PUT IT IN HER HAND', 960, 190, 96, {", "TY.type(ctx, 'AND PUT IT IN HER HAND', 960, 120, 96, {"],
  ["TY.text(ctx, 'THE HANDOFF', 960, 240, 16,", "TY.text(ctx, 'THE HANDOFF', 960, 160, 16,"],
  // ---- s6: type at the top; no front row under the feet ----
  ["TY.type(ctx, 'THE CROWD SAW', 120, 260, 120, {", "TY.type(ctx, 'THE CROWD SAW', 120, 120, 120, {"],
  ["TY.type(ctx, 'A GIRL', 120, 380, 120, {", "TY.type(ctx, 'A GIRL', 120, 220, 120, {"],
  ["TY.text(ctx, 'WHO WAS NEVER ON THE LIST', 126, 438, 20,", "TY.text(ctx, 'WHO WAS NEVER ON THE LIST', 126, 280, 20,"],
  ["      frontRow(ctx, t, C.easeOut(C.clamp((lt - 0.8) / 1.8)));\n", ""],
  ["nova(ctx, nx, GROUND, 1.12, t, np, faceAt(t, [", "contactShadow(ctx, nx, GROUND, 1.12, 60);\n      nova(ctx, nx, GROUND, 1.12, t, np, faceAt(t, ["],
  ["mira(ctx, mx, GROUND, 1.0, t, mp,", "contactShadow(ctx, mx, GROUND, 1.0, 54);\n      mira(ctx, mx, GROUND, 1.0, t, mp,"],
  // ---- s7: mic stand, clapping hands, no front row ----
  [
    `        armL: C.kf(lt, [[0, [0.5, 0.5]], [0.7, [1.1, 0.3]], [1.4, [1.5, 0.2]]]),
        armR: [-0.95, -1.15],`,
    `        armL: C.kf(lt, [[0, [0.5, 0.5]], [0.7, [1.1, 0.3]], [1.4, [1.5, 0.2]]]),
        armR: [-0.4, -0.8],`,
  ],
  [
    `      nova(ctx, 980, GROUND, 1.25, t, np, faceAt(t, [
        { t: 0, f: { eyes: 'closed', mouth: 'sing', blush: 0.5, look: [0, 0], sing: 0.7 } },
        { t: 0.7, f: { eyes: 'star', mouth: 'sing', blush: 0.6, look: [0, 0], sing: 0.9 } },
      ]), { mic: true });`,
    `      contactShadow(ctx, 980, GROUND, 1.25, 66);
      nova(ctx, 980, GROUND, 1.25, t, np, faceAt(t, [
        { t: 0, f: { eyes: 'closed', mouth: 'sing', blush: 0.5, look: [0, 0], sing: 0.7 } },
        { t: 0.7, f: { eyes: 'star', mouth: 'sing', blush: 0.6, look: [0, 0], sing: 0.9 } },
      ]));
      micStand(ctx, 990, GROUND, 1.0, t);`,
  ],
  [
    `        armL: C.kf(lt, [[0, [0.5, 0.9]], [0.5, [1.3, 0.2]], [0.9, [0.5, 0.9]], [1.3, [1.3, 0.2]]]),
        armR: C.kf(lt, [[0, [-0.5, -0.9]], [0.5, [-1.3, -0.2]], [0.9, [-0.5, -0.9]], [1.3, [-1.3, -0.2]]]),`,
    `        armL: C.kf(lt, [[0, [0.7, 1.0]], [0.45, [0.9, 1.4]], [0.9, [0.7, 1.0]], [1.35, [0.9, 1.4]]]),
        armR: C.kf(lt, [[0, [-0.7, -1.0]], [0.45, [-0.9, -1.4]], [0.9, [-0.7, -1.0]], [1.35, [-0.9, -1.4]]]),`,
  ],
  ["      frontRow(ctx, t, 1);\n", ""],
  ["mira(ctx, 1420, GROUND, 1.0, t, mp,", "contactShadow(ctx, 1420, GROUND, 1.0, 54);\n      mira(ctx, 1420, GROUND, 1.0, t, mp,"],
  // ---- s8: type at the top, Mira points at herself, lamp clear, no front row ----
  ["TY.type(ctx, 'THE LAMP', 120, 270, 120, {", "TY.type(ctx, 'THE LAMP', 120, 120, 120, {"],
  ["TY.type(ctx, 'CALLED AGAIN', 120, 388, 120, {", "TY.type(ctx, 'CALLED AGAIN', 120, 220, 120, {"],
  [
    `        armL: C.kf(lt, [[0, [0.4, 0.9]], [0.9, [0.9, 0.3]], [1.3, [0.5, 1.7]]]),
        armR: C.kf(lt, [[0, [-0.4, -0.9]], [0.9, [-0.9, -0.3]], [1.3, [-0.5, -1.7]]]),`,
    `        armL: [0.3, 0.1],
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [0.8, [0.2, 0.8]], [1.2, [0.5, 1.4]]]),`,
  ],
  ["cueLamp(ctx, 1680, 900, 1.0, t, {", "cueLamp(ctx, 1580, 900, 1.0, t, {"],
  ["      frontRow(ctx, t, 0.7);\n", ""],
  ["nova(ctx, 900, GROUND, 1.1, t, np, faceAt(t, [", "contactShadow(ctx, 900, GROUND, 1.1, 58);\n      nova(ctx, 900, GROUND, 1.1, t, np, faceAt(t, ["],
  ["mira(ctx, 1420, GROUND, 1.05, t, mp, faceAt(t, [", "contactShadow(ctx, 1420, GROUND, 1.05, 56);\n      mira(ctx, 1420, GROUND, 1.05, t, mp, faceAt(t, ["],
  // ---- s9: remove the redundant label, lamp clear, contact shadows ----
  ["TY.text(ctx, 'ON A STAGE THAT HAD BEEN WAITING', 126, 424, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.72), letter: 2 });\n", ""],
  ["cueLamp(ctx, 1660, 780, 0.8, t, {", "cueLamp(ctx, 1580, 780, 0.8, t, {"],
  ["nova(ctx, 820, GROUND, 1.1, t, np, faceAt(t, [", "contactShadow(ctx, 820, GROUND, 1.1, 58);\n      nova(ctx, 820, GROUND, 1.1, t, np, faceAt(t, ["],
  ["mira(ctx, 1100, GROUND, 1.05, t, mp, faceAt(t, [", "contactShadow(ctx, 1100, GROUND, 1.05, 56);\n      mira(ctx, 1100, GROUND, 1.05, t, mp, faceAt(t, ["],
  // ---- ticker timecode ----
  ["TY.text(ctx, '00:' + Math.floor(t * 30).toString().padStart(5, '0'), x + 16, y + 92, 10, { family: 'DMMono', color: C.rgba(CREAM, 0.45), letter: 1 });",
   "const ff = Math.floor(t * 30), ss = Math.floor(ff / 30), fr = ff % 30;\n    TY.text(ctx, '00:' + String(ss).padStart(2, '0') + ':' + String(fr).padStart(2, '0'), x + 16, y + 92, 10, { family: 'DMMono', color: C.rgba(CREAM, 0.45), letter: 1 });"],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING:", a.slice(0, 80).replace(/\n/g, "\\n"));
  s = s.replace(a, b);
}
writeFileSync(p, s);
console.log("done");
