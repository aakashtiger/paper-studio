import { readFileSync, writeFileSync } from "node:fs";
const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  ["confetti: 18", "confetti: 32"],
  ["confetti: 10", "confetti: 18"],
  ["confetti: 50", "confetti: 70"],
  ["confetti: 40", "confetti: 60"],
  ["confetti: 30", "confetti: 50"],
  [
    "      TY.text(ctx, 'CUE 01', 156, 282, 14, { family: 'DMMono', color: C.rgba(CREAM, 0.6), letter: 2 });",
    "      TY.text(ctx, 'CUE 01', 156, 282, 14, { family: 'DMMono', color: C.rgba(CREAM, 0.6), letter: 2 });\n      TY.sticker(ctx, 'ONE NAME', 1200, 600, 34, { fill: CORAL, text: CREAM, seed: 7, rot: -0.04, time: t });",
  ],
  [
    "        TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 156, 370, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });\n      }",
    "        TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 156, 370, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });\n      }\n      TY.sticker(ctx, 'HOLD', 1600, 700, 34, { fill: CORAL, text: CREAM, seed: 7, rot: 0.04, time: t });",
  ],
  [
    "      TY.text(ctx, 'THE DRESSING ROOM, 7:58 PM', 126, 350, 17, { family: 'DMMono', color: C.rgba(INK, 0.65), letter: 2 });",
    "      TY.text(ctx, 'THE DRESSING ROOM, 7:58 PM', 126, 350, 17, { family: 'DMMono', color: C.rgba(INK, 0.65), letter: 2 });\n      TY.sticker(ctx, '7:58', 1180, 620, 28, { fill: TEAL, text: CREAM, seed: 7, rot: 0.05, time: t });",
  ],
  [
    "      TY.text(ctx, 'THE HANDOFF', 960, 160, 16, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'center', letter: 3 });",
    "      TY.text(ctx, 'THE HANDOFF', 960, 160, 16, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'center', letter: 3 });\n      TY.sticker(ctx, 'STAR', 1180, 520, 28, { fill: MUSTARD, text: INK, seed: 7, rot: 0.05, time: t });",
  ],
  [
    "      if (lt > spotLand) {\n        const k = C.easeOut(C.clamp((lt - spotLand) / 0.2));\n        ctx.save(); ctx.globalAlpha = 0.25 * k;\n        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 5;\n        ctx.beginPath(); ctx.arc(980, 640, 220 + 40 * k, 0, TAU); ctx.stroke();\n        ctx.restore();\n      }",
    "      if (lt > spotLand) {\n        const k = C.easeOut(C.clamp((lt - spotLand) / 0.2));\n        ctx.save(); ctx.globalAlpha = 0.25 * k;\n        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 5;\n        ctx.beginPath(); ctx.arc(980, 640, 220 + 40 * k, 0, TAU); ctx.stroke();\n        ctx.restore();\n      }\n      TY.sticker(ctx, 'LIVE', 1500, 620, 34, { fill: CORAL, text: CREAM, seed: 7, rot: -0.04, time: t });",
  ],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING", a.slice(0, 70).replace(/\n/g, "\\n"));
  s = s.replace(a, b);
}
writeFileSync(p, s);
console.log("confetti/stickers");
