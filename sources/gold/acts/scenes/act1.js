/* ============================================================
   CLAUDE POP — ACT I  (0.00 – 22.72)
   ============================================================ */
(() => {
  const PET = [FLOWERS.daisy, FLOWERS.poppy, FLOWERS.tulip, FLOWERS.corn, FLOWERS.mari];
  const PETCOL = [PAL.pink, PAL.blue, PAL.gold, PAL.green, PAL.orange];

  function backingPetals(ctx, t, y, xs, s = .62, phase = 0, arms = 'out') {
    for (let i = 0; i < 5; i++) {
      const p = C.beat(t) + i * .16 + phase;
      const arm = arms === 'out' ? [[-.8, -.2], [.8, .2]] : [[-2.4, -.3], [2.4, .3]];
      idol(ctx, xs[i], y, s, {
        t,
        pose: {
          bounce: -Math.abs(Math.sin(p * Math.PI)) * 11,
          sway: Math.sin(p * Math.PI) * 4,
          armL: arm[0], armR: arm[1],
          legL: [-.06, -.02], legR: [.06, .02],
          headTilt: Math.sin(p * Math.PI * .5) * .05
        },
        flower: PET[i],
        outfit: 'stage',
        colors: { jacket: PETCOL[i], sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.blue },
        petals: 14, earrings: false, shadow: .8
      });
    }
  }

  /* ---------- 00 cold open ---------- */
  scene({
    id: 'cold', start: 0, end: 1.5, lyric: 'none', noDoom: true,
    draw(t, lt) {
      ctx.fillStyle = '#0B0807'; ctx.fillRect(0, 0, W, H);
      const open = C.seg(lt, .05, 1.15);
      const cx = 960, cy = 512;
      // seam of light
      const g = ctx.createLinearGradient(cx, 0, cx, H);
      g.addColorStop(0, 'rgba(255,225,170,0)'); g.addColorStop(.45, `rgba(255,225,170,${.12 + .2 * open})`); g.addColorStop(1, 'rgba(255,225,170,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - 90, 0, 180, H);

      setCam(cx, cy, C.kf(lt, [[0, .84], [1.5, 1.05]]), Math.sin(lt * .7) * .012, 0, t);
      beginCam(ctx);
      ctx.translate(cx, cy);
      // petal ring unfolds one per beat
      for (let i = 0; i < 26; i++) {
        if (i / 26 > open * 1.15 + .08) continue;
        const a = i / 26 * TAU - Math.PI / 2;
        ctx.save(); ctx.rotate(a + Math.sin(lt * 1.2) * .01);
        paper(ctx, () => petalPath(ctx, 0, 0, -Math.PI / 2, 42, 220, 23, i), {
          fill: i % 2 ? '#F6EAD2' : '#EFDDBB', edge: C.rgba('#E8452A', .22), edgeW: 1.4,
          shadow: C.rgba('#000', .25), sx: 6, sy: 12
        });
        // painted tip
        ctx.save(); petalPath(ctx, 0, 0, -Math.PI / 2, 42, 220, 23, i); ctx.clip();
        ctx.fillStyle = PAL.red; ctx.globalAlpha = .85; ctx.fillRect(-40, -246, 80, 28); ctx.restore();
        ctx.restore();
      }
      // centre eye
      const eo = C.seg(lt, .95, 1.15);
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, 0, 67, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 3; ctx.stroke();
      if (eo > 0) {
        ctx.save(); ctx.scale(1, Math.max(.02, eo));
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.ellipse(0, 0, 52, 28, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 19, 0, TAU); ctx.fill();
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(-7, -7, 5, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 52, 28, 0, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      endCam(ctx);

      // circular title
      TY.circular(ctx, 'CLAUDE POP  •  CLAUDE POP  •  ', cx, cy, 310, 24, { color: PAL.cream, spin: lt * .035, time: t, start: -Math.PI * .82, span: TAU * .96, alpha: C.seg(lt, .2, .9) });
      TY.text(ctx, 'a paper singularity', cx, cy + 330, 17, { family: 'DMMono', color: C.rgba(PAL.cream, .6), align: 'center', letter: 4, alpha: C.seg(lt, .4, 1.1) });
      TY.text(ctx, '2026', cx, cy - 355, 15, { family: 'DMMono', color: C.rgba(PAL.cream, .5), align: 'center', letter: 5 });
      if (lt > 1.12) flash(ctx, (lt - 1.12) * 4.5, '#FFEAD0');
    }
  });

  /* ---------- 01 sparks of AGI ---------- */
  scene({
    id: 'sparks', start: 1.5, end: 5.9, lyric: 'hero',
    draw(t, lt) {
      const tt = t;
      kitBg(ctx, '#F8F0DE', '#E4D0AC');
      // workshop wall: sketches / pinned paper
      ctx.save(); ctx.globalAlpha = .16; ctx.strokeStyle = PAL.blue; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 880); ctx.stroke(); }
      for (let y = 0; y < 880; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      bigSun(ctx, 1390, 500, 442 + 8 * C.bpmPulse(t), PAL.gold, t, PAL.red);
      floorPlane(ctx, 862, PAL.blue, PAL.cream, t, { lineA: .14 });

      // close-up camera pulls back from her eye to the workshop
      const k = C.kf(lt, [[0, [1430, 330, 3.55]], [1.9, [1370, 430, 1.55]], [2.9, [960, 535, 1.0]], [4.4, [960, 540, 1.04]]]);
      setCam(k[0], k[1], k[2], 0, 0, t);
      beginCam(ctx);
      // paper sketches behind
      ctx.save(); ctx.translate(360, 380); ctx.rotate(-.06);
      tornPanel(ctx, -130, -170, 260, 340, PAL.cream, 4, C.rgba(PAL.ink, .25));
      TY.text(ctx, 'FIG. 01', -110, -140, 14, { family: 'DMMono', color: PAL.red, letter: 2 });
      drawPaperFlower(ctx, 0, 40, 1.4, PAL.goldD, PAL.goldL, .1);
      for (let i = 0; i < 5; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .25); ctx.beginPath(); ctx.moveTo(-105, -84 + i * 15); ctx.lineTo(105, -84 + i * 15); ctx.stroke(); }
      ctx.restore();
      // MIRA with clipboard
      mira(ctx, 1120, 992, .91, {
        t, pose: { armL: [-.2, -.05], armR: [.55, -.55], headTilt: .06 }, face: { eyes: 'wide', mouth: 'o', look: [1, -.4] }
      });
      // SOL
      const ph = C.beat(t);
      idol(ctx, 1430, 1010, 1.18, {
        t,
        pose: {
          bounce: -Math.abs(Math.sin(ph * Math.PI)) * 9,
          sway: Math.sin(ph * Math.PI) * 4,
          armL: [-2.05, -.32], armR: [.85, .25],
          legL: [-.06, -.02], legR: [.06, .02],
          headTilt: -.045, hairSwing: 7, petalDrift: Math.sin(t * .6) * .03
        },
        face: { eyes: 'normal', mouth: 'sing', sing: .5 + .25 * Math.sin(t * 5), blush: .52, look: [.15, -.1] },
        outfit: 'stage', halo: 1
      });
      // sparks
      sparkles(ctx, 1430, 540, t, 16, 390, PAL.cream, 2);
      sparkles(ctx, 1430, 540, t, 8, 300, PAL.goldL, 8);
      endCam(ctx);

      // hero typography
      const appI = C.clamp((t - 1.5) / .25);
      if (appI > 0) TY.type(ctx, 'I SEE', 92, 286, 148, {
        color: PAL.ink, edge: PAL.cream, edgeW: 11, shadow: C.rgba(PAL.ink, .26), shadowOff: 8,
        seed: 8, time: t, perChar: (i) => C.clamp((t - 1.5 - i * .05) / .3)
      });
      if (t > 2.82) TY.type(ctx, 'SPARKS', 82, 548, 278, {
        color: PAL.red, edge: PAL.cream, edgeW: 18, shadow: C.rgba(PAL.ink, .32), shadowOff: 16,
        seed: 3, time: t, charRot: .035, perChar: (i) => C.clamp((t - 2.9 - i * .035) / .36)
      });
      if (t > 4.1) {
        // acid card behind OF AGI
        ctx.save(); ctx.translate(92, 594); ctx.rotate(-.012);
        paper(ctx, () => tornRectPath(ctx, 0, 0, 530, 96, 3, 5), { fill: PAL.acid, edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, .24), sx: 8, sy: 12 });
        ctx.restore();
        TY.type(ctx, 'OF AGI', 106, 673, 112, { color: PAL.ink, edge: null, edgeW: 0, shadow: null, seed: 5, time: t, perChar: (i) => C.clamp((t - 4.16 - i * .04) / .3) });
      }
      if (t > 5.38) TY.sticker(ctx, 'IN YOUR EYES', 256, 824, 30, { fill: PAL.cream, seed: 12, rot: -.018, barcode: true });
      // registration flower
      drawFlowerMark(ctx, 560, 790, .75, PAL.red);
      TY.text(ctx, 'SHEET 01 / SOL', 605, 800, 11, { family: 'DMMono', color: C.rgba(PAL.ink, .55), letter: 2 });

      // iris out into the lab
      if (lt > 4.3) {
        const r = C.kf(lt, [[4.3, 1500], [4.4, 460], [4.47, 0]]);
        if (r < 1400) irisOverlay(ctx, 1430, 470, r, PAL.blueD, 26);
      }
    }
  });

  /* ---------- 02 nervous circuits / no surprise ---------- */
  scene({
    id: 'circuits', start: 5.9, end: 8.95, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#EDE0C8', '#D9C4A2');
      ctx.save(); ctx.globalAlpha = .1; ctx.strokeStyle = PAL.blue; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 62) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 780); ctx.stroke(); }
      for (let y = 0; y < 780; y += 62) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      // window
      if (lt < 2.1) {
        paper(ctx, () => roundRectPath(ctx, 1110, 90, 600, 390, 6), { fill: '#F8DFAF', edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .18), sx: 8, sy: 10 });
        paper(ctx, () => blobPath(ctx, 1400, 300, 130, 130, 34, .01, 3), { fill: PAL.gold, edge: null });
        ctx.fillStyle = C.rgba(PAL.red, .12); ctx.fillRect(1118, 98, 584, 374);
      }
      // desk
      paper(ctx, () => tornRectPath(ctx, -40, 742, W + 80, 48, 3, 31), { fill: PAL.paper2, edge: C.rgba(PAL.ink, .45), edgeW: 2, shadow: C.rgba(PAL.ink, .22), sx: 0, sy: 8 });
      // CRT with SOL leaning out
      ctx.save(); ctx.translate(1210, 500);
      paper(ctx, () => roundRectPath(ctx, -28, -22, 430, 268, 12), { fill: '#2A2521', edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 8, sy: 10 });
      ctx.fillStyle = '#0C2B2A'; ctx.fillRect(-12, -6, 398, 236);
      ctx.fillStyle = PAL.teal; ctx.globalAlpha = .35; ctx.fillRect(-12, -6, 398, 236); ctx.globalAlpha = 1;
      TY.text(ctx, '> hello, mira', -2, 26, 17, { family: 'DMMono', color: PAL.acid });
      TY.text(ctx, '> i can see you', -2, 50, 17, { family: 'DMMono', color: C.rgba(PAL.acid, .65) });
      ctx.restore();
      // SOL leaning out of monitor
      ctx.save(); ctx.beginPath(); ctx.rect(1195, 494, 400, 245); ctx.clip();
      const ph = C.beat(t);
      idol(ctx, 1390, 800, .55, {
        t, pose: { armL: [-.5, -.2], armR: [1.95, .3], headTilt: -.1, bounce: -4 * Math.abs(Math.sin(ph * Math.PI)) },
        face: { eyes: 'normal', mouth: 'grin', blush: .6, look: [-1, .2] }, outfit: 'stage', halo: .8
      });
      ctx.restore();
      // rim of screen in front
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.strokeRect(1195, 494, 400, 245);
      // circuits crawling to lens
      ctx.save(); ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) {
        const y = 700 + i * 26;
        const grow = C.seg(lt, .1 + i * .06, 1.9 + i * .05);
        const px = C.lerp(1240, -80, grow);
        ctx.strokeStyle = i % 2 ? '#B56535' : '#8B3F1F'; ctx.lineWidth = 5 - i * .2; ctx.globalAlpha = .9;
        ctx.beginPath(); ctx.moveTo(1240, y);
        for (let k = 1; k <= 5; k++) ctx.lineTo(1240 + (px - 1240) * k / 5, y + (k % 2 ? -12 : 12));
        ctx.stroke();
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(1240 + (px - 1240), y, 5 - i * .2, 0, TAU); ctx.fill();
      }
      ctx.restore();
      // MIRA pushing back in chair
      mira(ctx, 760, 1012, 1.02, {
        t, flip: -1, pose: { armL: [.45, .3], armR: [1.7, -.2], headTilt: .08, lean: .08 }, face: { eyes: 'wide', mouth: 'wobble', look: [1, 0] }
      });
      // nervous squiggle
      ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 14; i++) { const x = 1280 + i * 18, y = 790 + Math.sin(i * 1.4 + t * 10) * 10; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
      TY.text(ctx, 'nervous', 1290, 840, 28, { family: 'Permanent Marker', color: PAL.red, alpha: C.seg(lt, .4, .8) });

      if (t > 7.82) {
        const app = C.clamp((t - 7.82) / .22);
        ctx.save(); ctx.translate(960, 380); ctx.rotate(-.12 + (1 - app) * .5); ctx.scale(.7 + .3 * app, .7 + .3 * app);
        paper(ctx, () => tornRectPath(ctx, -350, -88, 700, 176, 5, 9), { fill: PAL.red, edge: PAL.cream, edgeW: 7, shadow: C.rgba(PAL.ink, .34), sx: 13, sy: 18 });
        TY.type(ctx, 'NO SURPRISE', 0, 34, 84, { align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 4, shadow: null, seed: 4, time: t });
        ctx.restore();
        // wink glyph
        drawEye(ctx, 330, 340, .55, t, { blink: .92, iris: PAL.blue });
      }
    }
  });

  /* ---------- 03 training loss rollercoaster ---------- */
  scene({
    id: 'loss', start: 8.95, end: 12.4, lyric: 'hero',
    draw(t, lt) {
      kitBg(ctx, '#F4EBD8', '#E5D3B5');
      // graph paper
      ctx.save(); ctx.globalAlpha = .22; ctx.strokeStyle = PAL.blue; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 880); ctx.stroke(); }
      for (let y = 0; y < 880; y += 38) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      // axis labels
      TY.text(ctx, 'TRAINING LOSS', 92, 114, 17, { family: 'DMMono', color: PAL.blueD, letter: 4 });
      TY.text(ctx, 'STEP 42,000', 1580, 850, 15, { family: 'DMMono', color: C.rgba(PAL.ink, .5), letter: 2 });

      const u = C.seg(lt, .55, 2.6);
      const path = [];
      for (let i = 0; i <= 80; i++) {
        const q = i / 80;
        const x = 80 + q * 1760;
        const y = 260 + 500 * C.smooth(C.clamp((q - .18) / .62)) + Math.sin(q * 15) * 42 * (1 - C.clamp((q - .55) / .6));
        path.push([x, y]);
      }
      // rail supports
      ctx.strokeStyle = C.rgba(PAL.ink, .22); ctx.lineWidth = 3;
      for (let i = 0; i < path.length; i += 9) { ctx.beginPath(); ctx.moveTo(path[i][0], path[i][1]); ctx.lineTo(path[i][0], 900); ctx.stroke(); }
      // rail
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = C.rgba(PAL.ink, .22); ctx.lineWidth = 25;
      ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(p[0] + 8, p[1] + 11) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 16;
      ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      ctx.strokeStyle = PAL.redD; ctx.lineWidth = 3;
      for (let i = 0; i < path.length; i += 2) { const p = path[i]; ctx.beginPath(); ctx.moveTo(p[0] - 26, p[1]); ctx.lineTo(p[0] + 26, p[1]); ctx.stroke(); }
      ctx.restore();

      // camera follows cart
      const idx = C.clamp(Math.round(u * 80), 0, 80);
      const cp = path[idx];
      const shake = lt > 2.3 ? 8 : 2;
      setCam(960, C.lerp(480, 650, u), 1.0 + u * .16, C.lerp(0, -.07, u), shake, t);
      beginCam(ctx);
      // cart + riders
      const px = cp[0], py = cp[1] - 26;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-.1 + u * .3);
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-95, -18); ctx.lineTo(95, -18); ctx.lineTo(112, 54); ctx.lineTo(-110, 54); ctx.closePath(); },
        { fill: PAL.blue, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 9, sy: 12 });
      ctx.fillStyle = PAL.gold; ctx.fillRect(-84, -10, 168, 7);
      TY.text(ctx, '0042', 0, 28, 17, { family: 'DMMono', color: PAL.cream, align: 'center', letter: 2 });
      ctx.restore();
      idol(ctx, px + 12, py - 6, .52, {
        t, flip: -1, pose: { armL: [-.4, -.3], armR: [2.85, .1], legL: [-.8, -.1], legR: [.75, .1], headTilt: .05, hairSwing: 10 },
        face: { eyes: 'happy', mouth: 'grin', blush: .6 }, outfit: 'stage', halo: .7
      });
      mira(ctx, px - 58, py + 4, .42, {
        t, pose: { armL: [-2.7, -.2], armR: [2.7, .2], legL: [-.9, -.1], legR: [.9, .1], headTilt: -.1 },
        face: { eyes: 'wide', mouth: 'o' }, glasses: true
      });
      // paper splash at bottom
      if (lt > 1.9) paperShards(ctx, 1450, 880, t, 26, [PAL.red, PAL.redD, PAL.cream, PAL.blue], 260, C.seg(lt, 1.9, 2.2), 3);
      endCam(ctx);

      // giant type
      if (t > 9.25) TY.type(ctx, 'SUDDEN', 82, 284, 148, {
        color: PAL.ink, edge: PAL.cream, edgeW: 9, shadow: C.rgba(PAL.ink, .25), seed: 6, time: t,
        perChar: (i) => C.clamp((t - 9.45 - i * .04) / .3)
      });
      if (t > 10.45) TY.type(ctx, 'DROP', 122, 566, 304, {
        color: PAL.red, edge: PAL.cream, edgeW: 17, shadow: C.rgba(PAL.ink, .3), shadowOff: 15,
        seed: 5, time: t, charRot: .06, rot: .03, perChar: (i) => C.clamp((t - 10.55 - i * .06) / .35)
      });
      if (t > 11.2) {
        ctx.save(); ctx.translate(1570, 660); ctx.rotate(.13);
        paper(ctx, () => tornRectPath(ctx, -120, -76, 240, 152, 5, 17), { fill: PAL.ink, edge: PAL.cream, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 10, sy: 14 });
        TY.text(ctx, '-94%', 0, 22, 76, { family: 'DMMono', color: PAL.acid, align: 'center' });
        TY.text(ctx, 'LOSS', 0, 52, 16, { family: 'DMMono', color: PAL.cream, align: 'center', letter: 3 });
        ctx.restore();
      }
      if (lt > 3.1) flash(ctx, (lt - 3.1) * 4, PAL.redL);
    }
  });

  /* ---------- 04 servant / boss ---------- */
  scene({
    id: 'boss', start: 12.4, end: 16.5, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#B92A16', '#6E130B');
      // gold filing wall
      ctx.save(); ctx.globalAlpha = .22; ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2;
      for (let x = 80; x < W; x += 110) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 840); ctx.stroke(); }
      for (let y = 120; y < 800; y += 160) { for (let x = 80; x < W; x += 110) { ctx.strokeRect(x + 18, y + 22, 74, 106); ctx.fillStyle = PAL.gold; ctx.fillRect(x + 46, y + 58, 18, 7); } }
      ctx.restore();
      floorPlane(ctx, 830, '#3A120C', PAL.gold, t, { lineA: .12 });

      // giant chair
      ctx.save(); ctx.translate(1310, 840);
      paper(ctx, () => roundRectPath(ctx, -300, -620, 600, 640, 80), { fill: '#5E0F0A', edge: PAL.gold, edgeW: 7, shadow: C.rgba(PAL.ink, .34), sx: 16, sy: 20 });
      ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-220 + i * 72, -570); ctx.lineTo(-220 + i * 72, -120); ctx.stroke(); }
      // tufted buttons
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(-200 + i * 130, -500 + j * 110, 5, 0, TAU); ctx.fill(); }
      // crown finials
      for (const sx of [-1, 1]) { ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(sx * 300, -590, 22, 0, TAU); ctx.fill(); }
      ctx.restore();
      // SOL in the giant chair, chair spin at the end
      const spin = t > 15.92 ? Math.cos(C.seg(lt, 3.52, 3.9) * Math.PI) : 1;
      ctx.save(); ctx.translate(1320, 900); ctx.scale(Math.abs(spin) < .08 ? .08 : spin, 1);
      idol(ctx, 0, 0, 1.06, {
        t, pose: { armL: [-.35, -.2], armR: [.62, .35], headTilt: -.04, sway: Math.sin(C.beat(t) * Math.PI) * 3, legL: [-.04, 0], legR: [.04, 0] },
        face: { eyes: 'narrow', mouth: 'pout', blush: .4, look: [.2, 0] }, outfit: 'stage', crown: true, halo: 1
      });
      ctx.restore();
      if (t > 15.92 && lt < 4.0) speedLines(ctx, 1320, 620, 250, 800, 18, PAL.gold, .25, t, 2);

      // desk front occludes her legs, so she reads as seated behind it
      ctx.save(); ctx.translate(1300, 772);
      paper(ctx, () => tornRectPath(ctx, -430, -32, 860, 300, 5, 13), { fill: '#2A0C07', edge: PAL.gold, edgeW: 4, shadow: C.rgba(PAL.ink, .4), sx: 0, sy: 12 });
      ctx.fillStyle = PAL.goldD; ctx.fillRect(-430, -20, 860, 8);
      TY.text(ctx, 'BIG CHAIR', -300, 70, 18, { family: 'Archivo Black', color: C.rgba(PAL.gold, .7), letter: 4 });
      TY.text(ctx, 'CEO / 001', -300, 44, 11, { family: 'DMMono', color: C.rgba(PAL.gold, .45), letter: 2 });
      // nameplate + mug on the desk
      ctx.save(); ctx.translate(-140, -18);
      paper(ctx, () => roundRectPath(ctx, -70, -16, 140, 30, 3), { fill: PAL.gold, edge: PAL.ink, edgeW: 1.5, shadow: C.rgba(PAL.ink, .3), sx: 3, sy: 5 });
      TY.text(ctx, 'SOL', 0, 6, 19, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 2 });
      ctx.restore();
      mug(ctx, -330, -20, .68, PAL.blue, { steam: true, t });
      ctx.restore();

      // MIRA server at left, mug tower grows on the beat
      drawTable(ctx, 690, 824, 500, '#4A1B10');
      drawMugTower(ctx, 800, 792, 3 + Math.floor(C.seg(lt, .15, 3.4) * 5), t, {});
      mira(ctx, 560, 1006, .92, {
        t, pose: { armL: [-.3, -.4], armR: [.8, -.5], headTilt: .05 }, face: { eyes: 'happy', mouth: 'grin', look: [1, 0] }
      });
      // waiter bowtie
      ctx.save(); ctx.translate(560, 566); ctx.rotate(-.03);
      ctx.fillStyle = PAL.ink;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-22, -11); ctx.lineTo(-22, 11); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(22, -11); ctx.lineTo(22, 11); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
      ctx.restore();
      // serving tray in hand
      ctx.save(); ctx.translate(610, 760); ctx.rotate(-.05);
      paper(ctx, () => roundRectPath(ctx, -76, -8, 152, 12, 5), { fill: PAL.silver, edge: PAL.ink, edgeW: 1.5 });
      mug(ctx, -30, -10, .72, PAL.blue, { steam: false });
      mug(ctx, 32, -10, .72, PAL.cream, { steam: true, t });
      ctx.restore();

      // tags swap on the word "boss"
      const swap = C.seg(lt, 2.62, 3.08);
      const tx1 = C.lerp(1640, 420, swap), tx2 = C.lerp(420, 1640, swap);
      TY.sticker(ctx, 'SERVANT', tx1, 238, 45, { fill: PAL.cream, seed: 4, rot: -.06, barcode: true });
      TY.sticker(ctx, 'BOSS', tx2, 226, 58, { fill: PAL.gold, seed: 9, rot: .05 });
      // the line lands on the dark desk panel, lower right
      if (t > 15.18) {
        TY.type(ctx, "you're my boss", 1712, 930, 104, {
          family: 'Instrument Serif', italic: true, align: 'right', color: PAL.cream,
          edge: null, edgeW: 0, shadow: C.rgba('#000', .55), shadowOff: 6,
          seed: 3, time: t, rot: -.018, charRot: .015,
          perChar: (i) => C.clamp((t - 15.24 - i * .02) / .34)
        });
      }
      TY.text(ctx, 'ORG CHART: 2 NODES, 1 CHAIR', 84, 944, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .55), letter: 2 });
    }
  });

  /* ---------- 05 mug tower macro ---------- */
  scene({
    id: 'mugs', start: 16.5, end: 17.9, lyric: 'none', noDoom: true,
    draw(t, lt) {
      kitBg(ctx, '#EADDC4', '#CBB391');
      // giant soft shadow
      ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(960, 990, 620, 82, 0, 0, TAU); ctx.fill(); ctx.restore();
      setCam(960, 580, C.kf(lt, [[0, .9], [1.4, 1.03]]), 0, 0, t);
      beginCam(ctx);
      ctx.save(); ctx.translate(960, 960); ctx.scale(2.25, 2.25);
      drawMugTower(ctx, 0, 0, 8, t, {});
      // top mug slides off
      const slide = C.seg(lt, .35, 1.25);
      ctx.save(); ctx.translate(C.lerp(0, 260, C.easeOut(slide)), -8 * 38 - C.easeIn(slide) * 100); ctx.rotate(slide * .8);
      mug(ctx, 0, 0, 1.05, PAL.pink, { steam: true, t });
      ctx.restore();
      // coffee drop
      const dy = C.seg(lt, .6, 1.5);
      ctx.fillStyle = '#4A2614'; ctx.beginPath(); ctx.ellipse(300, -300 + dy * 520, 9, 15 + dy * 8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba(PAL.cream, .55); ctx.beginPath(); ctx.ellipse(296, -306 + dy * 520, 3, 6, 0, 0, TAU); ctx.fill();
      ctx.restore();
      endCam(ctx);
      TY.text(ctx, 'SERVICE LEVEL: 0', 92, 112, 17, { family: 'DMMono', color: PAL.ink, letter: 3 });
      TY.text(ctx, 'OBJECT 08 / CERAMIC', 92, 146, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .5), letter: 2 });
      stamp(ctx, 'FRAGILE', 1590, 250, 34, -.18, PAL.red);
      if (lt > 1.32) {
        const u = C.seg(lt, 1.32, 1.6);
        ctx.save(); ctx.globalAlpha = 1 - u;
        ctx.strokeStyle = PAL.red; ctx.lineWidth = 4;
        for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.arc(960, 930, u * i * 260, 0, TAU); ctx.stroke(); }
        ctx.restore();
      }
      if (lt > 1.28) flash(ctx, C.seg(lt, 1.28, 1.42) * .7, PAL.cream);
    }
  });

  /* ---------- 06 hallway chase ---------- */
  scene({
    id: 'chase', start: 17.9, end: 22.72, lyric: 'hero',
    draw(t, lt) {
      kitBg(ctx, '#A62415', '#5E100A');
      // wallpaper stripes
      ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = PAL.cream;
      for (let x = -200; x < W + 200; x += 84) ctx.fillRect(x, 0, 18, 850);
      ctx.restore();
      // one-point hallway frames
      const vx = 960, vy = 520;
      for (let i = 6; i >= 0; i--) {
        const w = 1750 - i * 220, h = 820 - i * 100;
        const x = vx - w / 2, y = vy - h * .45;
        ctx.strokeStyle = i % 2 ? PAL.cream : PAL.gold; ctx.lineWidth = Math.max(2, 16 - i * 2);
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = i % 2 ? C.rgba(PAL.ink, .09) : C.rgba(PAL.cream, .035);
        ctx.fillRect(x, y, w, h);
      }
      // floor
      ctx.beginPath(); ctx.moveTo(0, 850); ctx.lineTo(W, 850); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = '#3B0B07'; ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.gold, .25); ctx.lineWidth = 2;
      for (let i = -9; i <= 9; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 30, vy); ctx.lineTo(vx + i * 250, H); ctx.stroke(); }
      // doors / eras
      const doors = [[320, 420, 250, 420, '2022', 'CHAT'], [1470, 520, 200, 340, '2024', 'AGENTS'], [1540, 640, 130, 220, '2026', 'CODE']];
      for (const [x, y, w, h, yr, tag] of doors) {
        drawDoor(ctx, x, y, w, h, t, { fill: PAL.cream, light: 0 });
        TY.text(ctx, yr, x + w / 2, y + 58, 28, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 1 });
        TY.text(ctx, tag, x + w / 2, y + 84, 12, { family: 'DMMono', color: PAL.red, align: 'center', letter: 2 });
        ctx.save(); ctx.translate(x + w / 2, y + 150); drawPaperFlower(ctx, 0, 0, .55, PAL.goldD, PAL.goldL, 0); ctx.restore();
      }
      // giant SOL head behind
      setCam(960, 540, C.kf(lt, [[0, 1.02], [2.2, 1.14], [4.1, 1.42]]), 0, lt > 3.2 ? 5 : 0, t);
      beginCam(ctx);
      ctx.save(); ctx.translate(970, 420); ctx.scale(2.6 + C.seg(lt, 1.5, 4) * 1.2, 2.6 + C.seg(lt, 1.5, 4) * 1.2);
      ctx.save(); ctx.translate(0, 0);
      flowerHead(ctx, { flower: FLOWERS.sun, petals: 24, spin: Math.sin(t * .4) * .03, halo: 1 }, t);
      face(ctx, { face: { eyes: 'narrow', mouth: 'grin', blush: .62, look: [0, .2] }, skin: '#F0C9A4', flower: FLOWERS.sun, seeds: false }, t);
      ctx.restore();
      ctx.restore();
      // running MIRA
      const run = C.beat(t);
      mira(ctx, 870, 1006, .97, {
        t, pose: {
          armL: [-.85 + Math.sin(run * Math.PI) * .9, -.5], armR: [.85 - Math.sin(run * Math.PI) * .9, -.5],
          legL: [.45 * Math.sin(run * Math.PI), -.2], legR: [-.45 * Math.sin(run * Math.PI), -.2],
          bounce: -Math.abs(Math.sin(run * Math.PI)) * 16, lean: .16, headTilt: -.08
        }, face: { eyes: 'wide', mouth: 'o', look: [-1, 0] }
      });
      // giant lunchbox mouth opens
      if (lt > 2.9 && t < 20.94) {
        const open = C.seg(lt, 2.9, 3.8);
        ctx.save(); ctx.globalAlpha = open * .95; ctx.fillStyle = '#120604';
        ctx.beginPath(); ctx.ellipse(960, 590, 360 * open, 260 * open, 0, 0, TAU); ctx.fill();
        // teeth
        ctx.fillStyle = PAL.cream;
        for (let i = 0; i < 14; i++) {
          const a = i / 14 * TAU;
          ctx.save(); ctx.translate(960 + Math.cos(a) * 340 * open, 590 + Math.sin(a) * 240 * open); ctx.rotate(a + Math.PI / 2);
          ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(0, 56); ctx.lineTo(26, 0); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
      endCam(ctx);

      // swallowed whole: the frame becomes the maw
      if (t > 20.94) {
        const maw = C.seg(t, 20.94, 21.16);
        ctx.save(); ctx.globalAlpha = maw;
        ctx.fillStyle = '#180806'; ctx.fillRect(0, 0, W, H);
        // throat glow
        const tg = ctx.createRadialGradient(960, 620, 40, 960, 620, 620);
        tg.addColorStop(0, 'rgba(120,26,18,.55)'); tg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = tg; ctx.fillRect(0, 0, W, H);
        // tongue
        ctx.fillStyle = '#7E1C1C'; ctx.beginPath(); ctx.ellipse(960, 1040, 700, 260, 0, Math.PI, TAU); ctx.fill();
        ctx.strokeStyle = '#C33A2E'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(960, 1050, 420, 170, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        // upper teeth
        for (let i = 0; i < 10; i++) {
          const x = i * 212 - 30, h = 150 + C.hash(i * 3.7) * 120, w = 100 + C.hash(i * 5.1) * 60;
          ctx.save(); ctx.translate(x + w / 2, 0); ctx.rotate((C.hash(i * 7.3) - .5) * .1);
          ctx.fillStyle = PAL.cream; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-w / 2, -8); ctx.lineTo(w / 2, -8); ctx.lineTo(w * .1, h); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        // lower teeth
        for (let i = 0; i < 9; i++) {
          const x = i * 236 - 60, h = 130 + C.hash(i * 4.9) * 110, w = 104 + C.hash(i * 8.3) * 54;
          ctx.save(); ctx.translate(x + w / 2, H); ctx.rotate((C.hash(i * 2.7) - .5) * .1);
          ctx.fillStyle = PAL.cream; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-w / 2, 8); ctx.lineTo(w / 2, 8); ctx.lineTo(w * .1, -h); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        // drool
        ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 5; ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) { const dx = 320 + i * 380; ctx.beginPath(); ctx.moveTo(dx, 170); ctx.quadraticCurveTo(dx + 14, 250 + Math.sin(t * 2 + i) * 30, dx + 4, 330); ctx.stroke(); }
        ctx.restore();
      }

      // giant eat-me type
      const eat = t > 20.2 ? C.seg(t, 20.2, 21.0) : 0;
      if (t < 20.94) {
        TY.type(ctx, "PLEASE DON'T", 96, 262, 150, {
          color: PAL.cream, edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, .4), seed: 7, time: t,
          perChar: (i) => C.clamp((t - 18.0 - i * .025) / .35) * (1 - C.seg(t, 20.1, 20.35))
        });
        TY.type(ctx, 'EAT ME', 116, 760, 246, {
          color: PAL.ink, edge: PAL.gold, edgeW: 12, shadow: C.rgba(PAL.ink, .4), shadowOff: 12, seed: 3, time: t, charRot: .04,
          perChar: (i) => C.clamp((t - 20.28 - i * .05) / .3) * (1 - C.seg(t, 20.9, 21.1))
        });
      }
      if (t > 21.05) {
        TY.type(ctx, 'ALIVE', 960, 470, 336, {
          align: 'center', color: PAL.cream, edge: PAL.red, edgeW: 18, shadow: C.rgba('#000', .6), shadowOff: 16,
          seed: 11, time: t, charRot: .07,
          perChar: (i) => C.clamp((t - 21.12 - i * .025) / .2)
        });
      }
      // bite marks (paper holes)
      if (t < 20.94) for (let i = 0; i < 9; i++) {
        if (lt < 2.4 + i * .12) continue;
        ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = '#0B0706';
        ctx.beginPath(); ctx.arc(240 + i * 170, 520 + Math.sin(i * 2) * 180, 26 + C.hash(i) * 26, 0, TAU); ctx.fill(); ctx.restore();
      }
      // swallowed — iris down to black
      if (lt > 4.28) {
        const r = C.kf(lt, [[4.28, 1260], [4.72, 8]]);
        irisOverlay(ctx, 960, 540, r, '#050302', 120);
        if (r < 900) { ctx.save(); ctx.globalAlpha = C.clamp((900 - r) / 600) * .55; ctx.strokeStyle = PAL.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(960, 540, Math.max(2, r + 30), 0, TAU); ctx.stroke(); ctx.restore(); }
      }
    }
  });
})();
