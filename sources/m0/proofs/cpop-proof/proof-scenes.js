/* CPOP proof — 22.72–32.72. Source rig, new colourway, three shots.
 * The picture is code only. No generated image enters the render path.
 */
(() => {
  const INK = '#171310';
  const CREAM = '#F2E8D5';
  const KRAFT = '#DCCBAF';
  const COBALT = '#203FD8';
  const MAGENTA = '#E23A8A';
  const ACID = '#D9F24B';
  const TEAL = '#0D3B3B';

  const VEE = {
    flower: { petal: MAGENTA, petal2: '#B92A6B', tip: ACID, center: CREAM, hair: INK },
    colors: { jacket: COBALT, sleeve: CREAM, skirt: MAGENTA, boot: ACID, hair: INK, skin: '#D9A06A' },
    petals: 14,
  };

  function vee(ctx, x, y, s, t, pose = {}, extra = {}) {
    // VEE is a new performer on the source human rig: cobalt coat, magenta
    // trousers, acid crown, no glasses. The construction is the source's.
    mira(ctx, x, y, s, {
      t,
      pose: {
        bounce: pose.bounce || 0,
        sway: pose.sway || 0,
        lean: pose.lean || 0,
        armL: pose.armL || [-.14, -.06],
        armR: pose.armR || [.14, .06],
        legL: pose.legL || [-.035, -.015],
        legR: pose.legR || [.035, .015],
        headTilt: pose.headTilt || 0,
      },
      coatCol: COBALT,
      trouser: MAGENTA,
      hair: INK,
      glasses: false,
      skin: '#D9A06A',
      ...extra,
    });
    const hy = y + (pose.bounce || 0) - 536 * s;
    ctx.save();
    ctx.translate(x, hy);
    ctx.scale(s, s);
    // a paper crown gives VEE a silhouette that is not SOL's flower
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-46, -34); ctx.lineTo(-28, -86); ctx.lineTo(-6, -48);
      ctx.lineTo(14, -92); ctx.lineTo(36, -44); ctx.lineTo(50, -82);
      ctx.lineTo(56, -30); ctx.closePath();
    }, { fill: ACID, edge: C.rgba(INK, .65), edgeW: 2.4, shadow: C.rgba(INK, .18), sx: 3, sy: 5 });
    // a magenta sash covers the source's red tie
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-38, -444); ctx.lineTo(-16, -458); ctx.lineTo(46, -246);
      ctx.lineTo(22, -232); ctx.closePath();
    }, { fill: MAGENTA, edge: C.rgba(INK, .5), edgeW: 2, shadow: C.rgba(INK, .15), sx: 2, sy: 4 });
    ctx.restore();
  }

  function moth(ctx, x, y, s, t, flap = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    const open = .55 + .45 * Math.sin(t * 7.4);
    for (const side of [-1, 1]) {
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * 64, -58 * open, side * 96, -12);
        ctx.quadraticCurveTo(side * 64, 40, 0, 12);
        ctx.closePath();
      }, { fill: MAGENTA, edge: C.rgba(INK, .55), edgeW: 2.4, shadow: C.rgba(INK, .18), sx: 3, sy: 5 });
      ctx.fillStyle = ACID;
      ctx.beginPath(); ctx.ellipse(side * 58, -8, 11, 8, side * .3, 0, TAU); ctx.fill();
    }
    paper(ctx, () => blobPath(ctx, 0, 0, 18, 34, 10, .03, 4), { fill: INK, edge: C.rgba(CREAM, .3), edgeW: 1.5 });
    ctx.fillStyle = ACID;
    ctx.beginPath(); ctx.arc(-7, -16, 3.4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(7, -16, 3.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = CREAM; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-8, 30); ctx.quadraticCurveTo(-18, 48, -28, 54); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 30); ctx.quadraticCurveTo(18, 48, 28, 54); ctx.stroke();
    ctx.restore();
  }

  function dial(ctx, x, y, r, t) {
    const value = doomAt(t);
    const angle = -Math.PI * .82 + (value / 100) * Math.PI * 1.64;
    paper(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, {
      fill: CREAM, edge: C.rgba(INK, .6), edgeW: 4, shadow: C.rgba(INK, .22), sx: 8, sy: 12,
    });
    paper(ctx, () => { ctx.beginPath(); ctx.arc(x, y, r - 14, 0, TAU); }, {
      fill: COBALT, edge: C.rgba(CREAM, .35), edgeW: 2,
    });
    for (let i = 0; i <= 10; i += 1) {
      const a = -Math.PI * .82 + (i / 10) * Math.PI * 1.64;
      const x0 = x + Math.cos(a) * (r - 38), y0 = y + Math.sin(a) * (r - 38);
      const x1 = x + Math.cos(a) * (r - 20), y1 = y + Math.sin(a) * (r - 20);
      ctx.strokeStyle = i >= 8 ? ACID : CREAM; ctx.lineWidth = i % 5 === 0 ? 5 : 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.strokeStyle = ACID; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle) * (r - 54), y + Math.sin(angle) * (r - 54)); ctx.stroke();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
    TY.text(ctx, `${Math.round(value)}%`, x, y + r + 44, 42, { family: 'DMMono', color: CREAM, align: 'center', letter: -1 });
  }

  function foldedPanel(ctx, x, y, w, h, fold, fill, seed) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.transform(1, 0, fold * .28, 1, 0, 0);
    paper(ctx, () => tornRectPath(ctx, -w / 2, -h / 2, w, h, 8, seed), {
      fill, edge: C.rgba(INK, .5), edgeW: 3, shadow: C.rgba(INK, .18), sx: 5, sy: 8,
    });
    ctx.strokeStyle = C.rgba(CREAM, .25); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
    ctx.restore();
  }

  function mask(ctx, x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 1.7) * .05);
    ctx.scale(s, s);
    paper(ctx, () => blobPath(ctx, 0, 0, 150, 120, 24, .02, 7), { fill: CREAM, edge: C.rgba(INK, .65), edgeW: 4, shadow: C.rgba(INK, .22), sx: 7, sy: 12 });
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(-52, -26, 18, 24, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(52, -26, 18, 24, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 18, 62, .18, Math.PI - .18); ctx.stroke();
    // twelve little eyes around the rim
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * TAU;
      const blink = .35 + .65 * Math.abs(Math.sin(t * 4 + i * .8));
      ctx.fillStyle = ACID;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * 138, Math.sin(a) * 106, 8, 11 * blink, a, 0, TAU); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 138, Math.sin(a) * 106, 3.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  /* P1 — 22.72–25.70: the dial */
  scene({
    id: 'proof-dial', start: 22.72, end: 25.70, lyric: 'sub',
    draw(t, lt) {
      setCam(980, 540, C.kf(lt, [[0, 1.0], [2.98, 1.08]]), C.kf(lt, [[0, 0], [2.98, .012]]), 0, t);
      beginCam(ctx);
      stageSet(ctx, t, {
        sky: '#0B1B3A', sun: CREAM, rayA: COBALT, rayB: '#3D55D9',
        floor: MAGENTA, accent: ACID, crowd: true, confetti: 34,
        confettiCols: [CREAM, ACID, MAGENTA, COBALT],
      });
      // paper sunburst behind VEE
      sunburst(ctx, 760, 430, 0, 560, 22, C.rgba(ACID, .22), C.rgba(COBALT, .1), t * .18);
      // VEE performs; three poses in 3 s
      const pose = lt < .9
        ? { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 10, armL: [-.8, -.2], armR: [.8, .2], headTilt: .03 }
        : lt < 1.9
          ? { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 16, armL: [-1.9, -.4], armR: [1.2, .2], headTilt: -.05 }
          : { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 14, armL: [-.4, -.1], armR: [1.9, .5], headTilt: .08 };
      vee(ctx, 760, 1008, 1.25, t, pose);
      moth(ctx, 1130, 610, .95, t);
      dial(ctx, 1500, 360, 150, t);
      TY.type(ctx, 'P(DOOM)', 96, 320, 156, {
        color: CREAM, edge: COBALT, edgeW: 8, shadow: C.rgba(INK, .28),
        time: t, charRot: .025, jitter: 1, seed: 5,
      });
      TY.text(ctx, 'THE MODEL CARD', 102, 380, 22, { family: 'DMMono', color: ACID, letter: 4 });
      paperShards(ctx, 760, 740, t, 18, [CREAM, ACID, MAGENTA], 360, .18, 11);
      endCam(ctx);
    },
  });

  /* P2 — 25.70–29.72: the folded room */
  scene({
    id: 'proof-room', start: 25.70, end: 29.72, lyric: 'sub',
    draw(t, lt) {
      setCam(C.kf(lt, [[0, 980], [4.02, 900]]), 540, C.kf(lt, [[0, 1.0], [4.02, 1.04]]), C.kf(lt, [[0, 0], [4.02, .015]]), 0, t);
      beginCam(ctx);
      kitBg(ctx, '#170C2C', '#090819', { x: 900, y: 420, r: 1100, n: 26, c1: C.rgba(MAGENTA, .25), c2: '#170C2C', rot: t * .12, a: .35 });
      // folded walls
      for (let i = 0; i < 6; i += 1) {
        const fold = Math.sin(t * 1.2 + i * .8) * .35;
        foldedPanel(ctx, 120 + i * 290, 150 + (i % 2) * 40, 270, 720, fold, i % 2 ? MAGENTA : COBALT, i + 3);
      }
      // mail slots
      for (let i = 0; i < 4; i += 1) {
        const x = 360 + i * 260;
        paper(ctx, () => tornRectPath(ctx, x, 560, 150, 26, 5, i + 20), { fill: INK, edge: C.rgba(CREAM, .4), edgeW: 2 });
        paper(ctx, () => tornRectPath(ctx, x + 12, 568, 126, 10, 4, i + 30), { fill: ACID, edge: null });
      }
      // mushrooms
      for (let i = 0; i < 5; i += 1) {
        const x = 260 + i * 330, y = 880 + (i % 2) * 30;
        const s = .8 + .2 * Math.sin(t * 2 + i);
        paper(ctx, () => blobPath(ctx, x, y - 30 * s, 38 * s, 24 * s, 12, .03, i + 40), { fill: i % 2 ? MAGENTA : CREAM, edge: C.rgba(INK, .5), edgeW: 2 });
        paper(ctx, () => tornRectPath(ctx, x - 10, y - 8, 20, 54 * s, 5, i + 50), { fill: KRAFT, edge: C.rgba(INK, .4), edgeW: 1.5 });
      }
      vee(ctx, 940, 1010, 1.15, t, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 18,
        armL: [-.6, -.2], armR: [1.5, .4], headTilt: .1,
      });
      moth(ctx, 1350, 650, 1.1, t);
      // FOOM flower
      ctx.save();
      ctx.translate(1420, 300);
      ctx.rotate(Math.sin(t * 2) * .08);
      const fs = 1 + .08 * Math.sin(t * 6);
      ctx.scale(fs, fs);
      for (let i = 0; i < 14; i += 1) {
        const a = (i / 14) * TAU;
        paper(ctx, () => blobPath(ctx, Math.cos(a) * 58, Math.sin(a) * 58, 32, 54, 10, .03, i + 60), { fill: i % 2 ? ACID : MAGENTA, edge: C.rgba(INK, .5), edgeW: 2 });
      }
      paper(ctx, () => blobPath(ctx, 0, 0, 28, 28, 12, .02, 70), { fill: CREAM, edge: C.rgba(INK, .5), edgeW: 2 });
      ctx.restore();
      TY.type(ctx, 'FOOM', 86, 280, 200, {
        color: MAGENTA, edge: CREAM, edgeW: 9, shadow: C.rgba(INK, .3),
        time: t, charRot: .04, jitter: 1, seed: 9,
      });
      paperShards(ctx, 940, 740, t, 26, [CREAM, ACID, MAGENTA, COBALT], 420, .22, 23);
      endCam(ctx);
    },
  });

  /* P3 — 29.72–32.72: the mask */
  scene({
    id: 'proof-mask', start: 29.72, end: 32.72, lyric: 'sub',
    draw(t, lt) {
      setCam(960, 540, C.kf(lt, [[0, 1.12], [3.0, 1.0]]), C.kf(lt, [[0, .01], [3.0, 0]]), 0, t);
      beginCam(ctx);
      ctx.fillStyle = '#080706'; ctx.fillRect(0, 0, W, H);
      sunburst(ctx, 1180, 420, 0, 900, 24, C.rgba(MAGENTA, .2), C.rgba(INK, .1), t * .1);
      // tentacles
      for (let i = 0; i < 7; i += 1) {
        ctx.strokeStyle = i % 2 ? MAGENTA : COBALT; ctx.lineWidth = 18; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(1180, 640);
        ctx.quadraticCurveTo(1180 + Math.sin(t * 1.8 + i) * 120, 760 + i * 20, 1180 + Math.sin(t * 1.4 + i) * 220, 940 + i * 12);
        ctx.stroke();
      }
      mask(ctx, 1180, 430, 1.15, t);
      // stick
      ctx.strokeStyle = KRAFT; ctx.lineWidth = 18;
      ctx.beginPath(); ctx.moveTo(1180, 560); ctx.lineTo(1180, 900); ctx.stroke();
      vee(ctx, 690, 1008, 1.18, t, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 12,
        armL: [-1.7, -.4], armR: [.9, .2], headTilt: -.08,
      });
      moth(ctx, 930, 620, .8, t);
      TY.type(ctx, 'LIES', 90, 340, 190, {
        color: ACID, edge: INK, edgeW: 8, shadow: C.rgba(INK, .3),
        time: t, charRot: .03, jitter: 1, seed: 13,
      });
      TY.text(ctx, 'SEE THROUGH', 96, 400, 20, { family: 'DMMono', color: CREAM, letter: 5 });
      paperShards(ctx, 1180, 430, t, 20, [CREAM, ACID, MAGENTA], 300, .16, 31);
      endCam(ctx);
    },
  });
})();
