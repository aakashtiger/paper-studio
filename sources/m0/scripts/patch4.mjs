import fs from "node:fs";
const p="src/characters.js";
let s=fs.readFileSync(p,"utf8");

// stronger limb edges so cream sleeves read on cream paper
s=s.replace("function limb(ctx, x, y, len, w1, w2, ang, col, edge = C.rgba(PAL.ink, .55), shadow = true) {","function limb(ctx, x, y, len, w1, w2, ang, col, edge = C.rgba(PAL.ink, .78), shadow = true) {");
s=s.replace("  path(); ctx.fillStyle = col; ctx.fill();\n  ctx.strokeStyle = edge; ctx.lineWidth = 1.8; ctx.stroke();","  path(); ctx.fillStyle = col; ctx.fill();\n  ctx.strokeStyle = edge; ctx.lineWidth = 2.1; ctx.stroke();\n  ctx.strokeStyle = C.rgba('#FFFFFF', .35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w1*.22, len*.12); ctx.quadraticCurveTo(-w2*.26, len*.6, -w2*.2, len*.86); ctx.stroke();");

// sleeve red piping + gold wrist band
s=s.replace(`    const wrist = limb(ctx, elbow[0], elbow[1], 88, 18, 14, a1 + a2, sleeveCol, C.rgba(PAL.ink, .5), true);
    // cuff
    ctx.save(); ctx.translate(wrist[0], wrist[1]); ctx.rotate(a1 + a2);
    ctx.fillStyle = far ? C.shade(jacket, -14) : jacket;
    ctx.fillRect(-9, -5, 18, 8);`,
`    const wrist = limb(ctx, elbow[0], elbow[1], 88, 18, 14, a1 + a2, sleeveCol, C.rgba(PAL.ink, .65), true);
    // cuff
    ctx.save(); ctx.translate(wrist[0], wrist[1]); ctx.rotate(a1 + a2);
    ctx.fillStyle = far ? C.shade(jacket, -14) : jacket;
    ctx.fillRect(-9, -5, 18, 8);
    ctx.fillStyle = PAL.gold; ctx.fillRect(-9, 1, 18, 2);`);

// MIRA: open coat with black tee + belt
const a=s.indexOf("  // lab coat\n  if (coat) {");
const b=s.indexOf("  // neck\n  ctx.fillStyle = C.shade(skin, -6);");
const block=`  // lab coat (open, over black tee)
  if (coat) {
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.scale(sx, 1);
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(10, -456);
        ctx.quadraticCurveTo(38, -462, 44, -446);
        ctx.quadraticCurveTo(54, -380, 48, -196);
        ctx.lineTo(36, -182); ctx.lineTo(14, -190); ctx.lineTo(12, -250);
        ctx.quadraticCurveTo(20, -360, 10, -456);
        ctx.closePath();
      };
      paper(ctx, path, { fill: coat, edge: C.rgba(PAL.ink, .7), edgeW: 2.4, shadow: C.rgba(PAL.ink, .18), sx: 4, sy: 7 });
      // lapel
      ctx.beginPath();
      ctx.moveTo(12, -456); ctx.lineTo(34, -436); ctx.lineTo(22, -394); ctx.lineTo(12, -404);
      ctx.closePath(); ctx.fillStyle = C.shade(coat, -12); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1; ctx.stroke();
      // pocket
      ctx.strokeStyle = C.rgba(PAL.ink, .26); ctx.lineWidth = 1.1; ctx.strokeRect(24, -296, 17, 15);
      ctx.restore();
    }
    // belt
    ctx.fillStyle = PAL.blueD; ctx.fillRect(-34, -310, 68, 10);
    ctx.fillStyle = PAL.gold; ctx.fillRect(-6, -312, 12, 14);
    ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1; ctx.strokeRect(-34, -310, 68, 10);
    // pens
    ctx.fillStyle = PAL.red; ctx.fillRect(34, -338, 3, 16);
    ctx.fillStyle = PAL.blue; ctx.fillRect(28, -334, 3, 14);
    // badge
    ctx.save(); ctx.translate(-30, -426); ctx.rotate(-.08);
    paper(ctx, () => roundRectPath(ctx, -15, -10, 30, 20, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1 });
    TY.text(ctx, 'MIRA', 0, 3, 8, { family: 'Archivo Black', color: PAL.ink, align: 'center' });
    ctx.restore();
  }
`;
s=s.slice(0,a)+block+s.slice(b);

fs.writeFileSync(p,s);
console.log("ok");
