import fs from "node:fs";
let p="src/characters.js", s=fs.readFileSync(p,"utf8");
s=s.replace(`    const elbow = limb(ctx, sx, sy, 104, 23, 19, a1, sleeveCol, C.rgba(PAL.ink, .5), true);
    // shoulder cap`,
`    const elbow = limb(ctx, sx, sy, 104, 23, 19, a1, sleeveCol, C.rgba(PAL.ink, .65), true);
    // racing stripe down the sleeve
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(a1);
    ctx.strokeStyle = far ? C.shade(jacket, -12) : jacket; ctx.lineWidth = 6; ctx.globalAlpha = .9;
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, 96); ctx.stroke(); ctx.restore();
    // shoulder cap`);
s=s.replace(`    const wrist = limb(ctx, elbow[0], elbow[1], 88, 18, 14, a1 + a2, sleeveCol, C.rgba(PAL.ink, .5), true);
    // cuff`,
`    const wrist = limb(ctx, elbow[0], elbow[1], 88, 18, 14, a1 + a2, sleeveCol, C.rgba(PAL.ink, .65), true);
    ctx.save(); ctx.translate(elbow[0], elbow[1]); ctx.rotate(a1 + a2);
    ctx.strokeStyle = far ? C.shade(jacket, -12) : jacket; ctx.lineWidth = 5; ctx.globalAlpha = .9;
    ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(0, 80); ctx.stroke(); ctx.restore();
    // cuff`);
fs.writeFileSync(p,s);

p="src/scenes/test.js"; s=fs.readFileSync(p,"utf8");
s=s.replace("armL: [-.5, -.12], armR: [2.38, .26]","armL: [-.5, -.12], armR: [2.9, .08]");
s=s.replace("armR: [2.3, .35]","armR: [1.75, -.08]");
fs.writeFileSync(p,s);
console.log("ok");
