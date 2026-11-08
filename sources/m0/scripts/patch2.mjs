import fs from "node:fs";
const p="src/characters.js";
let s=fs.readFileSync(p,"utf8");

// --- petals: bigger, clipped painted tips ---
s=s.replace("const r0 = (o.r0 || 34), r1 = (o.r1 || 102) * pulse;","const r0 = (o.r0 || 28), r1 = (o.r1 || 116) * pulse;");
s=s.replace("const n = o.petals || 20;","const n = o.petals || 22;");
s=s.replace("const w = 15 + (C.hash(i * 7.3) - .5) * 4;","const w = 17 + (C.hash(i * 7.3) - .5) * 4;");
s=s.replace(`    // painted tip
    ctx.save(); ctx.translate(0, -len + 10);
    ctx.fillStyle = F.tip; ctx.globalAlpha = .92;
    ctx.beginPath(); ctx.ellipse(0, 0, w * .62, 5.2, 0, 0, TAU); ctx.fill();
    ctx.restore();`,
`    // painted tip, clipped to the petal silhouette
    ctx.save();
    petalPath(ctx, 0, 0, -Math.PI / 2, r0, len, w, i);
    ctx.clip();
    ctx.fillStyle = F.tip; ctx.globalAlpha = .95;
    ctx.fillRect(-w * 2, -len, w * 4, 26);
    ctx.restore();`);

// --- remove seed ring from face ---
const seedStart=s.indexOf("  // sunflower seed ring");
const seedEnd=s.indexOf("  // ears", seedStart);
s=s.slice(0,seedStart)+s.slice(seedEnd);

// --- narrower bob so petals read ---
s=s.replace("ctx.moveTo(-52, -6);","ctx.moveTo(-46, -6);");
s=s.replace("ctx.quadraticCurveTo(-64, -60, -38, -82);","ctx.quadraticCurveTo(-58, -60, -34, -82);");
s=s.replace("ctx.quadraticCurveTo(64, -60, 52, -6);","ctx.quadraticCurveTo(58, -60, 46, -6);");
s=s.replace("ctx.lineTo(44, 62);","ctx.lineTo(40, 62);");
s=s.replace("ctx.quadraticCurveTo(-26, 40, -44, 62);","ctx.quadraticCurveTo(-26, 40, -40, 62);");

// --- test pose ---
s=s.replace("armL: [-2.15, -.35], armR: [.62, .3], legL: [-.05, -.02], legR: [.05, .02], headTilt: -.04, hairSwing: 6","armL: [-.52, -.12], armR: [2.35, .28], legL: [-.05, -.02], legR: [.05, .02], headTilt: -.04, hairSwing: 6");

fs.writeFileSync(p,s);
console.log("done");
