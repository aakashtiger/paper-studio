/* test scene — look development */
(() => {
  function draw(t, lt, dur) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#F8F0DE'); bg.addColorStop(.55, '#F2E6CE'); bg.addColorStop(1, '#E4D2B2');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // giant poster sun
    const cx = 1410, cy = 470, r = 415 + 10 * C.bpmPulse(t);
    ctx.save();
    paper(ctx, () => blobPath(ctx, cx, cy, r, r, 60, .012, 3), { fill: '#F5B93F', edge: null });
    halftone(ctx, cx - r, cy - r, r * 2, r * 2, '#E8452A', 20, .5, .16);
    ctx.restore();

    // cobalt horizon band
    paper(ctx, () => tornRectPath(ctx, -100, 872, W + 200, 260, 7, 7), { fill: PAL.blue, edge: null });
    ctx.fillStyle = 'rgba(23,19,16,.10)'; ctx.fillRect(0, 872, W, 5);

    // type block (left)
    TY.type(ctx, 'I SEE', 106, 296, 126, { align: 'left', color: PAL.ink, edge: PAL.cream, edgeW: 10, time: t, seed: 8, shadow: C.rgba(PAL.ink, .22) });
    TY.type(ctx, 'SPARKS', 96, 566, 296, { align: 'left', color: PAL.red, edge: PAL.cream, edgeW: 17, shadow: C.rgba(PAL.ink, .3), shadowOff: 13, time: t, seed: 3, charRot: .02 });
    TY.type(ctx, 'OF AGI', 104, 730, 150, { align: 'left', color: PAL.ink, edge: PAL.cream, edgeW: 9, time: t, seed: 5 });
    TY.sticker(ctx, 'IN YOUR EYES', 250, 822, 31, { fill: PAL.acid, rot: -.025, barcode: true });

    setCam(960, 540, 1.0, 0, 0, t);
    beginCam(ctx);
    const phase = C.beat(t);
    idol(ctx, 1430, 1004, 1.22, {
      t, face: { eyes: 'normal', mouth: 'sing', sing: .55 + .3 * Math.sin(t * 4), blush: .55, look: [.2, 0] },
      pose: {
        bounce: -Math.abs(Math.sin(phase * Math.PI)) * 12, sway: Math.sin(phase * Math.PI) * 5,
        armL: [-.5, -.12], armR: [2.9, .08], legL: [-.05, -.02], legR: [.05, .02], headTilt: -.04, hairSwing: 6
      },
      outfit: 'stage', halo: 1, petalSpin: Math.sin(t * .4) * .05
    });
    mira(ctx, 1150, 1000, .95, { t, pose: { armL: [-.3, -.2], armR: [1.75, -.08], headTilt: .06 }, face: { eyes: 'wide', mouth: 'o', look: [1, 0] } });
    endCam(ctx);
  }
  scene({ id: 'test', start: 0, end: 10, name: 'test', draw, lyric: 'l01', transition: null });
})();
