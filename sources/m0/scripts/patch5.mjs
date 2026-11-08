import fs from "node:fs";
const p="src/characters.js";
let s=fs.readFileSync(p,"utf8");
s=s.replace(`  ctx.beginPath(); ctx.moveTo(-35, -452); ctx.quadraticCurveTo(-42, -370, -30, -268); ctx.lineTo(30, -268); ctx.quadraticCurveTo(42, -370, 35, -452); ctx.closePath(); ctx.fill();`,
`  ctx.beginPath(); ctx.moveTo(-35, -452); ctx.quadraticCurveTo(-42, -370, -30, -268); ctx.lineTo(30, -268); ctx.quadraticCurveTo(42, -370, 35, -452); ctx.closePath(); ctx.fill();
  // shirt collar + tie
  ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.moveTo(-16, -450); ctx.lineTo(0, -424); ctx.lineTo(16, -450); ctx.lineTo(0, -460); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.blue; ctx.beginPath(); ctx.moveTo(-10, -430); ctx.lineTo(0, -404); ctx.lineTo(10, -430); ctx.lineTo(0, -438); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(-5, -406); ctx.lineTo(5, -406); ctx.lineTo(8, -352); ctx.lineTo(0, -340); ctx.lineTo(-8, -352); ctx.closePath(); ctx.fill();`);
fs.writeFileSync(p,s);
