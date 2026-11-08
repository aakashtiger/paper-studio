import fs from "node:fs";
const p="src/scenes/test.js";
let s=fs.readFileSync(p,"utf8");
const a=s.indexOf("    // backing petals");
const b=s.indexOf("    endCam(ctx);");
const block=`    const phase = C.beat(t);
    idol(ctx, 1410, 996, 1.32, {
      t, face: { eyes: 'normal', mouth: 'sing', sing: .55 + .3 * Math.sin(t * 4), blush: .55, look: [.2, 0] },
      pose: {
        bounce: -Math.abs(Math.sin(phase * Math.PI)) * 12, sway: Math.sin(phase * Math.PI) * 5,
        armL: [-.5, -.12], armR: [2.38, .26], legL: [-.05, -.02], legR: [.05, .02], headTilt: -.04, hairSwing: 6
      },
      outfit: 'stage', halo: 1, petalSpin: Math.sin(t * .4) * .05
    });
    mira(ctx, 1100, 984, .95, { t, pose: { armL: [-.3, -.2], armR: [2.3, .35], headTilt: .06 }, face: { eyes: 'wide', mouth: 'o', look: [1, 0] } });
`;
s=s.slice(0,a)+block+s.slice(b);
fs.writeFileSync(p,s);
console.log("ok");
