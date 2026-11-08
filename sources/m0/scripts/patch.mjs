import fs from "node:fs";
const p="src/characters.js";
let s=fs.readFileSync(p,"utf8");
const start=s.indexOf("  if (outfit === 'gym') {");
const end=s.indexOf("  // head", start);
const block=`  // garments are authored relative to the waist (0 = waist, -182 = shoulder line)
  ctx.save();
  ctx.translate(0, -334);
  if (outfit === 'gym') {
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-42, -178); ctx.quadraticCurveTo(-52, -106, -34, 4); ctx.lineTo(34, 4); ctx.quadraticCurveTo(52, -106, 42, -178); ctx.quadraticCurveTo(0, -192, -42, -178); ctx.closePath(); }, { fill: PAL.mint, edge: C.rgba(PAL.ink, .65), edgeW: 2.4, shadow: C.rgba(PAL.ink, .18), sx: 4, sy: 7 });
    ctx.fillStyle = PAL.cream; ctx.fillRect(-38, -86, 76, 7);
    ctx.fillStyle = PAL.blue; ctx.fillRect(-38, -76, 76, 3);
    ctx.save(); ctx.translate(0, -48);
    paper(ctx, () => roundRectPath(ctx, -22, -18, 44, 38, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.2 });
    TY.text(ctx, '042', 0, 8, 20, { family: 'DMMono', color: PAL.red, align: 'center' });
    ctx.restore();
  } else if (outfit === 'jazz' || outfit === 'gown') {
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-42, -178); ctx.quadraticCurveTo(-52, -106, -32, -2); ctx.lineTo(32, -2); ctx.quadraticCurveTo(52, -106, 42, -178); ctx.quadraticCurveTo(0, -192, -42, -178); ctx.closePath(); }, { fill: outfit === 'gown' ? PAL.redD : PAL.blueD, edge: C.rgba(PAL.ink, .7), edgeW: 2.4, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-22 + i * 7.5, -136); ctx.lineTo(-28 + i * 8, -6); ctx.stroke(); }
  } else if (outfit === 'hazard') {
    varsityTorso(ctx, PAL.gold, PAL.ink, PAL.ink);
    ctx.save(); ctx.beginPath(); ctx.rect(-46, -118, 92, 22); ctx.clip();
    for (let i = -4; i < 8; i++) { ctx.fillStyle = i % 2 ? PAL.ink : PAL.gold; ctx.beginPath(); ctx.moveTo(i * 18, -118); ctx.lineTo(i * 18 + 10, -118); ctx.lineTo(i * 18 - 10, -96); ctx.lineTo(i * 18 - 20, -96); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  } else if (outfit === 'stage') {
    varsityTorso(ctx, jacket, sleeve, PAL.gold);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-15, -176); ctx.lineTo(-18, -120); ctx.quadraticCurveTo(0, -102, 18, -120); ctx.lineTo(15, -176); ctx.closePath(); }, { fill: PAL.chrome, edge: PAL.ink, edgeW: 1.2 });
  } else {
    varsityTorso(ctx, jacket, sleeve, PAL.gold);
  }
  ctx.restore();

  // shoulder brads
  brad(ctx, -45, -516, 4.6); brad(ctx, 45, -516, 4.6);
  // collar necklace
  ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(0, -528, 17, .18 * Math.PI, .82 * Math.PI); ctx.stroke();
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -509, 3, 0, TAU); ctx.fill();

`;
s=s.slice(0,start)+block+s.slice(end);
s=s.replace("ctx.beginPath(); ctx.moveTo(-9, -566); ctx.lineTo(9, -566); ctx.lineTo(11, -520); ctx.lineTo(-11, -520);","ctx.beginPath(); ctx.moveTo(-9, -566); ctx.lineTo(9, -566); ctx.lineTo(11, -512); ctx.lineTo(-11, -512);");
s=s.replace("const sx = side * 45, sy = -500;","const sx = side * 45, sy = -512;");
s=s.replace("const w = [45 + Math.sin(armR[0]) * 104 + Math.sin(armR[0] + armR[1]) * 88, -500 + Math.cos(armR[0]) * 104 + Math.cos(armR[0] + armR[1]) * 88];","const w = [45 + Math.sin(armR[0]) * 104 + Math.sin(armR[0] + armR[1]) * 88, -512 + Math.cos(armR[0]) * 104 + Math.cos(armR[0] + armR[1]) * 88];");
fs.writeFileSync(p,s);
console.log("ok");
