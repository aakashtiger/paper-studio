import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const edits = [
  // faces are keyed on shot time, not global time
  ["faceAt(t, [", "faceAt(lt, ["],
  // remove the failed front row from s2
  ["      frontRow(ctx, t, C.easeOut(C.clamp(lt / 2.2)));\n", ""],
  // s3: second line lands on the word "empty"; sticker sits on the mark
  ["perChar: (i) => C.clamp((t - 7.0 - i * 0.03) / 0.4),", "perChar: (i) => C.clamp((t - 9.1 - i * 0.03) / 0.4),"],
  ["ctx.translate(820, 690);", "ctx.translate(850, 880);"],
  // s5: give the handoff room; the hands meet between the bodies
  ["nova(ctx, 820, 1280, 1.55, t, np, faceAt(lt, [", "nova(ctx, 700, 1280, 1.55, t, np, faceAt(lt, ["],
  ["mira(ctx, 1160, 1280, 1.50, t, mp, faceAt(lt, [", "mira(ctx, 1280, 1280, 1.50, t, mp, faceAt(lt, ["],
  ["const nh = novaHand(820, 1280, 1.55, np, 'R');", "const nh = novaHand(700, 1280, 1.55, np, 'R');"],
  ["const mh = miraHand(1160, 1280, 1.50, mp, 'L');", "const mh = miraHand(1280, 1280, 1.50, mp, 'L');"],
  // s6: remove the redundant label; "A GIRL" lands nearer the word
  ["      TY.text(ctx, 'WHO WAS NEVER ON THE LIST', 126, 280, 20, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });\n", ""],
  ["perChar: (i) => C.clamp((t - 14.5 - i * 0.03) / 0.4),", "perChar: (i) => C.clamp((t - 15.0 - i * 0.03) / 0.4),"],
  // s9: final title in the clear left column
  ["TY.text(ctx, 'THE CUE LAMP', 960, 950, 20, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'center', letter: 6 });",
   "TY.text(ctx, 'THE CUE LAMP', 120, 950, 20, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'left', letter: 6 });"],
  // s3 work light is a light, not a shadow
  ["spotlight(ctx, wx, 300, 520, 30, 210, '#FFE8B0', 0.1, 0);", "spotlight(ctx, wx, 300, 520, 30, 210, '#FFE8B0', 0.18, 0);"],
  // star sits on the vanity
  ["      starProp(ctx, starX, starY, 0.8, lt * 0.7, t, 0.5 + 0.5 * pick);",
   "      ctx.save(); ctx.fillStyle = C.rgba(INK, 0.24); ctx.beginPath(); ctx.ellipse(starX, 758, 52, 8, 0, 0, TAU); ctx.fill(); ctx.restore();\n      starProp(ctx, starX, starY, 0.8, lt * 0.7, t, 0.5 + 0.5 * pick);"],
];
for (const [a, b] of edits) {
  if (!s.includes(a)) console.log("MISSING:", a.slice(0, 80).replace(/\n/g, "\\n"));
  s = s.replaceAll(a, b);
}
writeFileSync(p, s);
console.log("done");
