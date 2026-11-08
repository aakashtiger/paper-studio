/* ============================================================
   CLAUDE POP - ACT V  (137.02 - 156.62)
   the reveal / curtain call / final dance / desk & credits
   ============================================================ */
(() => {
  function dust(ctx, t, n, x0, y0, x1, y1, col = PAL.cream, seed = 0, a = .4) {
    ctx.save();
    for (let i = 0; i < n; i++) {
      const px = x0 + C.frac(C.hash(i * 3.7 + seed) + t * (.012 + C.hash(i * 2.1) * .026)) * (x1 - x0);
      const py = y0 + C.frac(C.hash(i * 7.3 + seed) + t * (.008 + C.hash(i * 5.9) * .016)) * (y1 - y0);
      ctx.globalAlpha = a * (.12 + C.hash(i * 9.1) * .6);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(px, py, .8 + C.hash(i * 11.3) * 2.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function strands(ctx, x, y, n, len, col, a = .5) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) {
      ctx.beginPath(); ctx.moveTo(x + i * 16, y); ctx.quadraticCurveTo(x + i * 16 + 20, y + len * .5, x + i * 16 + 8, y + len); ctx.stroke();
    }
    ctx.restore();
  }
  function cardHang(ctx, str, x, y, w, h, rot, seed, drop = 0) {
    ctx.save(); ctx.translate(x, y + drop); ctx.rotate(rot);
    // string
    ctx.strokeStyle = C.rgba(PAL.cream, .35); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-w * .3, -h / 2 - 160); ctx.lineTo(-w * .3, -h / 2); ctx.moveTo(w * .3, -h / 2 - 160); ctx.lineTo(w * .3, -h / 2); ctx.stroke();
    paper(ctx, () => tornRectPath(ctx, -w / 2, -h / 2, w, h, 4, seed), { fill: PAL.cream, edge: C.rgba(PAL.ink, .5), edgeW: 2, shadow: C.rgba(PAL.ink, .35), sx: 7, sy: 11 });
    TY.type(ctx, str, 0, h * .12, h * .42, { family: 'Instrument Serif', italic: true, align: 'center', color: PAL.ink, edge: null, shadow: null, seed, time: 0, charRot: .02 });
    ctx.restore();
  }
  function castBow(ctx, t, i, x, y, drawFn) {
    const b = Math.max(0, Math.sin(C.beat(t) * Math.PI - i * .55));
    ctx.save(); ctx.translate(x, y + b * 8);
    ctx.translate(0, 0); ctx.rotate(b * .22);
    drawFn();
    ctx.restore();
    return b;
  }

  /* ---------- 50. WAS IT ALL FOR SHOW? ---------- */
  scene({
    id: 'reveal', start: 137.02, end: 140.68, lyric: 'sub',
    draw(t, lt, dur) {
      const z = 1.55 - .55 * C.easeOut(C.seg(lt, 0, 1.9));
      // backstage wall
      kitBg(ctx, '#191512', '#0B0908');
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
      // brick wall
      ctx.save();
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 16; col++) {
          const bx = col * 128 + (row % 2) * 64 - 40;
          const by = 120 + row * 64;
          ctx.fillStyle = C.rgba(['#2B2420', '#332A24', '#241D19'][(row + col) % 3], .9);
          ctx.fillRect(bx, by, 120, 56);
          ctx.strokeStyle = C.rgba('#0A0807', .55); ctx.lineWidth = 2; ctx.strokeRect(bx, by, 120, 56);
        }
      }
      ctx.restore();
      // floor
      paper(ctx, () => tornRectPath(ctx, -100, 900, W + 200, 260, 4, 9), { fill: '#2E2118', edge: '#0B0806', edgeW: 3 });
      for (let i = 0; i < 10; i++) { ctx.strokeStyle = C.rgba(PAL.cream, .05); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-100, 940 + i * 22); ctx.lineTo(W + 100, 940 + i * 22); ctx.stroke(); }
      // work lights
      for (const [lx, ly] of [[260, 220], [1560, 180], [1120, 260]]) {
        ctx.strokeStyle = '#0B0806'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, ly - 40); ctx.stroke();
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(lx - 36, ly); ctx.lineTo(lx + 36, ly); ctx.lineTo(lx + 22, ly + 22); ctx.lineTo(lx - 22, ly + 22); ctx.closePath(); }, { fill: '#3A3027', edge: PAL.ink, edgeW: 2 });
        ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = PAL.goldL;
        ctx.beginPath(); ctx.moveTo(lx, ly + 20); ctx.lineTo(lx - 190, 980); ctx.lineTo(lx + 190, 980); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      // giant door flat on a strut
      ctx.save(); ctx.translate(960, 470); ctx.rotate(-.015);
      // support
      ctx.strokeStyle = '#4A3526'; ctx.lineWidth = 18;
      ctx.beginPath(); ctx.moveTo(-260, 430); ctx.lineTo(220, 430); ctx.lineTo(250, 520); ctx.stroke();
      // back of the flat
      paper(ctx, () => tornRectPath(ctx, -200, -360, 400, 760, 4, 5), { fill: '#3B2A20', edge: '#0C0907', edgeW: 4, shadow: C.rgba('#000', .4), sx: 9, sy: 13 });
      // painted door
      paper(ctx, () => tornRectPath(ctx, -176, -340, 352, 700, 3, 8), { fill: '#5A3B2A', edge: '#1A110C', edgeW: 3 });
      paper(ctx, () => tornRectPath(ctx, -152, -316, 130, 640, 3, 11), { fill: '#6B4933', edge: '#231811', edgeW: 2 });
      paper(ctx, () => tornRectPath(ctx, 22, -316, 130, 640, 3, 14), { fill: '#6B4933', edge: '#231811', edgeW: 2 });
      // painted light seam
      const seam = ctx.createLinearGradient(0, -330, 0, 350);
      seam.addColorStop(0, 'rgba(255,222,150,.9)'); seam.addColorStop(1, 'rgba(255,170,70,.25)');
      ctx.fillStyle = seam; ctx.fillRect(-4, -310, 8, 620);
      // painted glow (not real light)
      ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = PAL.goldL;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-250, 500); ctx.lineTo(250, 500); ctx.closePath(); ctx.fill(); ctx.restore();
      // wheels
      for (const sx of [-1, 1]) {
        ctx.fillStyle = '#0B0806'; ctx.beginPath(); ctx.arc(sx * 160, 430, 34, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#5A4A3C'; ctx.lineWidth = 5; ctx.stroke();
      }
      ctx.restore();
      // moon on a string + paperclip earth prop
      ctx.save(); ctx.translate(280, 470);
      ctx.strokeStyle = C.rgba(PAL.cream, .35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -470); ctx.lineTo(0, -80); ctx.stroke();
      drawMoon(ctx, 0, 0, 74, '#E8D3A4');
      // handle
      ctx.fillStyle = '#4A3526'; ctx.fillRect(-6, 70, 12, 120);
      ctx.restore();
      // paperclip earth on a stick
      ctx.save(); ctx.translate(1580, 650); ctx.rotate(.16);
      ctx.fillStyle = '#4A3526'; ctx.fillRect(-8, -40, 16, 300);
      paper(ctx, () => blobPath(ctx, 0, -150, 140, 140, 40, .02, 4), { fill: '#2C63B8', edge: PAL.ink, edgeW: 4, shadow: C.rgba('#000', .3), sx: 6, sy: 10 });
      for (let i = 0; i < 16; i++) { const a = C.hash(i * 3.1) * TAU, rr = Math.sqrt(C.hash(i * 7.7)) * 110; drawPaperclipIcon(ctx, Math.cos(a) * rr, -150 + Math.sin(a) * rr, .35, PAL.silver, a, false); }
      ctx.restore();
      // giant SOL costume, split open
      ctx.save(); ctx.translate(1600, 940); ctx.scale(1.55, 1.55);
      idol(ctx, 0, 0, .7, {
        t,
        flowerR1: 100,
        pose: { armL: [2.6, .1], armR: [-2.6, .1], legL: [.08, -.1], legR: [-.1, .1], headTilt: .04 },
        face: { eyes: 'x', mouth: 'flat' }
      });
      // split seam
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0, -560); ctx.lineTo(-24, -420); ctx.lineTo(18, -300); ctx.lineTo(-10, -120); ctx.lineTo(6, 20); ctx.stroke();
      ctx.strokeStyle = C.rgba(PAL.goldL, .55); ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      // three small SOLs stepping out
      for (let i = 0; i < 3; i++) {
        ctx.save(); ctx.translate(1440 + i * 62, 946 + i * 6); ctx.scale(.9, .9);
        idol(ctx, 0, 0, .34 - i * .03, {
          t,
          flowerR1: 100,
          pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI + i)) * 4, armL: [2.2, .2], armR: [-1.9, .2], legL: [.1, -.1], legR: [-.1, .1], headTilt: (i - 1) * .1 },
          face: { eyes: i === 1 ? 'wink' : 'happy', mouth: 'grin' }
        });
        ctx.restore();
      }
      // MIRA alone, in her lab coat
      ctx.save(); ctx.translate(720, 940);
      mira(ctx, 0, 0, .86, {
        t,
        pose: { sway: Math.sin(t * .7) * 3, lean: -.02, armL: [-.2, .1], armR: [.2, .1], legL: [-.05, -.06], legR: [.07, .06], headTilt: .02, hairSwing: -8 },
        face: { eyes: 'normal', mouth: 'flat', look: [.6, 0] }
      });
      // she holds the lyric card string
      ctx.strokeStyle = C.rgba(PAL.cream, .4); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(74, -430); ctx.lineTo(190, -760); ctx.stroke();
      ctx.restore();
      // stagehands
      ctx.save(); ctx.translate(420, 940); ctx.scale(.9, .9);
      ctx.fillStyle = '#0F0D0B';
      ctx.beginPath(); ctx.ellipse(0, -560, 34, 40, 0, 0, TAU); ctx.fill();
      ctx.fillRect(-42, -520, 84, 320); ctx.fillRect(-38, -200, 28, 200); ctx.fillRect(12, -200, 28, 200);
      ctx.fillStyle = PAL.ink; ctx.fillRect(-40, -570, 80, 18);
      // sandwich
      ctx.save(); ctx.translate(70, -470); ctx.rotate(.2);
      ctx.fillStyle = PAL.cream; ctx.fillRect(-34, -16, 68, 18); ctx.fillStyle = PAL.green; ctx.fillRect(-34, -16, 68, 5); ctx.fillStyle = PAL.red; ctx.fillRect(-34, -8, 68, 4);
      ctx.restore();
      ctx.restore();
      // hanging lyric cards
      const fall1 = C.seg(lt, 1.45, 2.0), fall2 = C.seg(lt, 1.75, 2.3), fall3 = C.seg(lt, 2.05, 2.6);
      if (fall1 < 1) cardHang(ctx, 'WAS IT', 1230, 300 - fall1 * 340, 300, 120, -.03 + fall1 * .5, 4, fall1 * 700);
      if (fall2 < 1) cardHang(ctx, 'ALL FOR', 1430, 380 - fall2 * 340, 340, 120, .04 - fall2 * .6, 7, fall2 * 700);
      if (fall3 < 1) cardHang(ctx, 'SHOW?', 1330, 510 - fall3 * 320, 300, 120, -.02 + fall3 * .4, 10, fall3 * 700);
      // final ?
      if (lt > 2.1) {
        const app = C.backOut(C.seg(lt, 2.1, 2.45));
        ctx.save(); ctx.translate(1330, 410); ctx.rotate(.04); ctx.globalAlpha = C.clamp(app); ctx.scale(app, app);
        paper(ctx, () => tornRectPath(ctx, -140, -150, 280, 300, 4, 12), { fill: PAL.cream, edge: C.rgba(PAL.ink, .5), edgeW: 2.5, shadow: C.rgba(PAL.ink, .4), sx: 9, sy: 14 });
        TY.type(ctx, '?', 0, 92, 250, { family: 'Instrument Serif', italic: true, align: 'center', color: PAL.ink, edge: null, shadow: null, seed: 4, time: t });
        ctx.restore();
        ctx.strokeStyle = C.rgba(PAL.cream, .35); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(1330, 260); ctx.lineTo(1330, 90); ctx.stroke();
      }
      // MIRA's last line card
      TY.text(ctx, 'STAGE B / AFTER THE SHOW', 80, 90, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .4), letter: 3 });
      TY.text(ctx, 'nothing here was real', 80, 118, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .22), letter: 1 });
      ctx.restore();
      // work light pool on MIRA (screen space, after scale)
      dust(ctx, t, 34, 200, 200, 1800, 950, PAL.goldL, 6, .45);
      flash(ctx, (1 - C.seg(lt, 0, .22)) * .35, PAL.cream);
    }
  });

  /* ---------- 51. CURTAIN CALL ---------- */
  scene({
    id: 'curtain', start: 140.68, end: 146.00, lyric: 'none',
    draw(t, lt, dur) {
      drawTheatre(ctx, t);
      // extra sunburst behind the company
      ctx.save(); ctx.globalAlpha = .16;
      sunburst(ctx, 960, 620, 120, 900, 30, PAL.goldL, PAL.redD, t * .03);
      ctx.restore();
      // stage floor grounds the company
      paper(ctx, () => tornRectPath(ctx, -40, 902, W + 80, 240, 4, 12), { fill: '#2A0B10', edge: PAL.goldD, edgeW: 2, shadow: C.rgba('#000', .4), sx: 0, sy: 8 });
      ctx.fillStyle = C.rgba(PAL.goldL, .16); ctx.fillRect(0, 902, W, 6);
      for (let i = 0; i < 9; i++) { const x = 180 + i * 195; ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(x, 948, 7, 0, TAU); ctx.fill(); }
      // DOOM balloon
      const pop = C.seg(lt, 1.55, 1.72);
      if (pop < 1) {
        const bx = 1790, by = 390 - Math.sin(t * .8) * 8;
        ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(bx, by + 90); ctx.quadraticCurveTo(bx - 20, by + 200, bx + 8, by + 270); ctx.stroke();
        ctx.save(); ctx.translate(bx, by); ctx.scale(1 + pop * 1.8, 1 + pop * 1.8); ctx.globalAlpha = 1 - pop;
        paper(ctx, () => blobPath(ctx, 0, 0, 84, 98, 20, .03, 6), { fill: PAL.red, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 5, sy: 8 });
        TY.type(ctx, 'P(DOOM)', 0, 4, 26, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 2, seed: 4, time: t });
        TY.text(ctx, '100%', 0, 40, 26, { family: 'DMMono', color: PAL.ink, align: 'center' });
        ctx.restore();
      } else {
        if (pop < 1.35) {
          ctx.save(); ctx.globalAlpha = 1 - (pop - 1) / .35;
          for (let i = 0; i < 28; i++) {
            const a = i / 28 * TAU, r = 60 + (pop - 1) * 900;
            ctx.fillStyle = [PAL.red, PAL.goldL, PAL.cream, PAL.pink][i % 4];
            ctx.save(); ctx.translate(1790 + Math.cos(a) * r, 390 + Math.sin(a) * r * .7); ctx.rotate(a); ctx.fillRect(-12, -4, 24, 8); ctx.restore();
          }
          ctx.restore();
        }
        TY.text(ctx, 'POP!', 1790, 350, 54, { family: 'Permanent Marker', color: PAL.goldL, align: 'center', rot: .08, stroke: PAL.ink, strokeW: 4, alpha: 1 - C.seg(lt, 2.3, 2.6) });
      }
      // cast line
      const cast = [
        { x: 170, s: .62, fn: () => chinchilla(ctx, 0, 0, 1, { t }) },
        { x: 350, s: .64, fn: () => gato(ctx, 0, 0, 1, { t, pose: { armL: [2.3, .2], armR: [-2.2, .2], legL: [.06, -.1], legR: [-.08, .1], headTilt: .06 }, face: { eyes: 'happy', mouth: 'grin' } }) },
        { x: 540, s: .7, fn: () => mira(ctx, 0, 0, 1, { t, pose: { lean: .04, armL: [2.3, .3], armR: [-2.3, .3], legL: [-.06, -.08], legR: [.08, .08], headTilt: .08 }, face: { eyes: 'happy', mouth: 'grin' } }) },
        { x: 720, s: 1.9, fn: () => drawPaperclipIcon(ctx, 0, -40, 1, PAL.chrome, 0, true) },
        { x: 930, s: .8, fn: () => idol(ctx, 0, 0, 1, { t, flowerR1: 100, pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 5, armL: [2.3, .2], armR: [-2.3, .2], legL: [.06, -.1], legR: [-.08, .1], headTilt: .05 }, face: { eyes: 'happy', mouth: 'grin' } }) },
        { x: 1130, s: .62, fn: () => shoggoth(ctx, 0, -20, 1, { t, mask: false }) },
        { x: 1320, s: .58, fn: () => basilisk(ctx, 0, 0, 1, { t, segs: 6 }) },
        { x: 1520, s: .7, fn: () => drawCloudGuard(ctx, 0, -40, 1, t, { zzz: true }) },
        { x: 1720, s: .62, fn: () => drawCloudGuard(ctx, 0, -20, 1, t + 1, { sleep: true }) }
      ];
      for (let i = 0; i < cast.length; i++) {
        const c = cast[i];
        castBow(ctx, t, i, c.x, 938, () => {
          ctx.save(); ctx.scale(c.s, c.s);
          c.fn();
          ctx.restore();
        });
      }
      // flowers thrown
      for (let i = 0; i < 12; i++) {
        const u = C.frac(lt * .18 + C.hash(i * 3.1));
        const fx = 200 + C.hash(i * 5.7) * 1500 + Math.sin(t + i) * 30;
        const fy = 380 + u * 700;
        ctx.save(); ctx.globalAlpha = .8 * (1 - u * .4); ctx.translate(fx, fy); ctx.rotate(t + i);
        drawPaperFlower(ctx, 0, 0, .3 + C.hash(i) * .2, PAL.goldD, i % 2 ? PAL.pinkL : PAL.cream, 0);
        ctx.restore();
      }
      confetti(ctx, t, 160, [PAL.goldL, PAL.cream, PAL.red, PAL.pink, PAL.mint], .95);
      // title
      const ti = C.backOut(C.seg(lt, .15, .7));
      ctx.save(); ctx.translate(960, 300); ctx.rotate(-.02); ctx.scale(ti, ti);
      TY.type(ctx, 'CLAUDE POP', 0, 0, 168, { family: 'Anton', align: 'center', color: PAL.goldL, edge: PAL.ink, edgeW: 9, shadow: C.rgba(PAL.ink, .5), shadowOff: 12, seed: 3, time: t });
      ctx.restore();
      TY.text(ctx, 'a paper singularity', 960, 352, 28, { family: 'Instrument Serif', italic: true, color: PAL.ink, align: 'center', alpha: C.seg(lt, .4, .8), stroke: PAL.cream, strokeW: 3 });
      TY.sticker(ctx, 'THANK YOU', 1630, 270, 32, { fill: PAL.cream, text: PAL.red, rot: .08, seed: 5, padX: 20, padY: 11, tape: true });
      TY.text(ctx, 'ENCORE! ENCORE!', 90, 250, 15, { family: 'DMMono', color: PAL.goldL, letter: 3, alpha: C.seg(lt, .6, 1.1), stroke: PAL.ink, strokeW: 3 });
      // bowing prompt
      TY.text(ctx, 'the company takes a bow', 960, 1010, 14, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .55), align: 'center', alpha: C.seg(lt, 1.0, 1.5) });
      dust(ctx, t, 30, 0, 150, W, 950, PAL.goldL, 4, .35);
      if (lt > 4.8) flash(ctx, C.seg(lt, 4.8, 5.1) * .7, PAL.goldL);
    }
  });

  /* ---------- 52. FINAL DANCE ---------- */
  scene({
    id: 'finaldance', start: 146.00, end: 151.00, lyric: 'none',
    draw(t, lt, dur) {
      // concert sky
      kitBg(ctx, '#2A0710', '#0B0610');
      const orbit = Math.sin(lt * .7) * 50;
      ctx.save(); ctx.translate(orbit, 0);
      // giant sun
      bigSun(ctx, 960, 480, 260, '#F1AE63', t, '#B33A38');
      sunburst(ctx, 960, 480, 100, 1050, 40, C.rgba(PAL.goldL, .35), C.rgba(PAL.goldL, 0), t * .05);
      // stage floor
      paper(ctx, () => tornRectPath(ctx, -40, 900, W + 80, 240, 4, 15), { fill: '#1B0E12', edge: PAL.goldD, edgeW: 2, shadow: C.rgba('#000', .4), sx: 0, sy: 8 });
      ctx.fillStyle = C.rgba(PAL.goldL, .14); ctx.fillRect(0, 900, W, 5);
      for (let i = 0; i < 9; i++) { const x = 170 + i * 198; ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(x, 942, 7, 0, TAU); ctx.fill(); }
      // curtains
      drawCurtain(ctx, -30, 'left', PAL.redD, t);
      drawCurtain(ctx, W + 30, 'right', PAL.redD, t);
      // stage
      paper(ctx, () => tornRectPath(ctx, -60, 860, W + 120, 40, 4, 11), { fill: PAL.goldD, edge: PAL.ink, edgeW: 2, shadow: C.rgba('#000', .35), sx: 0, sy: 8 });
      floorPlane(ctx, 890, '#1B0E12', PAL.goldL, t, { lineA: .14 });
      // spotlights
      for (const [x, rot] of [[300, -.18], [960, .04], [1620, .2]]) drawSpotlight(ctx, x, -80, 1000, 40, 300, '#FFE7A8', .1, rot);
      // cast - wider arc, all dancing
      const cast = [
        { x: 110, y: 940, s: .62, fn: () => chinchilla(ctx, 0, 0, 1, { t }) },
        { x: 290, y: 940, s: .66, fn: () => gato(ctx, 0, 0, 1, { t, pose: { armL: [2.5, .2], armR: [-2.5, .2], legL: [.25, -.2], legR: [-.2, .2], headTilt: .1, hairSwing: 20 }, face: { eyes: 'star', mouth: 'grin' } }) },
        { x: 470, y: 940, s: .7, fn: () => mira(ctx, 0, 0, 1, { t, pose: { lean: -.05, armL: [2.4, .2], armR: [-2.4, .2], legL: [-.15, -.1], legR: [.2, .1], headTilt: -.08 }, face: { eyes: 'happy', mouth: 'grin' } }) },
        { x: 650, y: 940, s: 1.7, fn: () => drawPaperclipIcon(ctx, 0, -40, 1, PAL.chrome, Math.sin(t * 2) * .15, true) },
        { x: 890, y: 940, s: .95, fn: () => idol(ctx, 0, 0, 1, { t, flowerR1: 100, pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 20, sway: Math.sin(t * 2) * 10, armL: [2.3, .3], armR: [-2.3, .3], legL: [.3, -.2], legR: [-.3, .2], headTilt: .08 }, face: { eyes: 'star', mouth: 'grin' } }) },
        { x: 1080, y: 940, s: .65, fn: () => shoggoth(ctx, 0, -20, 1, { t, mask: false }) },
        { x: 1270, y: 940, s: .6, fn: () => basilisk(ctx, 0, 0, 1, { t, segs: 6 }) },
        { x: 1470, y: 940, s: .68, fn: () => drawCloudGuard(ctx, 0, -30, 1, t) },
        { x: 1700, y: 940, s: .65, fn: () => gato(ctx, 0, 0, 1, { t: t + 1.3, pose: { armL: [2.3, .2], armR: [-2.3, .2], legL: [.2, -.1], legR: [-.2, .1], headTilt: -.1 }, face: { eyes: 'happy', mouth: 'grin' } }) }
      ];
      for (let i = 0; i < cast.length; i++) {
        const c = cast[i];
        const jump = Math.abs(Math.sin(C.beat(t) * Math.PI + i * .6));
        ctx.save(); ctx.translate(c.x, c.y - jump * (10 + i % 3 * 4));
        ctx.rotate(Math.sin(C.beat(t) * Math.PI + i) * .04);
        ctx.scale(c.s, c.s);
        c.fn();
        ctx.restore();
      }
      // sparklers at the wings
      for (const [sx, sy] of [[170, 810], [1750, 800], [70, 940], [1860, 930]]) {
        ctx.save(); ctx.translate(sx, sy);
        const fl = .55 + .45 * Math.sin(t * 19 + sx);
        for (let i = 0; i < 16; i++) {
          const a = i / 16 * TAU + t;
          ctx.strokeStyle = i % 2 ? PAL.goldL : PAL.cream; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (30 + i * 4) * fl, Math.sin(a) * (30 + i * 4) * fl); ctx.stroke();
        }
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // confetti
      confetti(ctx, t, 130, [PAL.goldL, PAL.cream, PAL.red, PAL.pink, PAL.mint, PAL.sky], 1);
      ctx.restore();
      // P(DOOM) 100% stamp
      if (lt > 1.55) {
        const u = C.seg(lt, 1.55, 1.75);
        const sc = C.lerp(2.4, 1, C.easeIn(u));
        ctx.save(); ctx.translate(1420, 280); ctx.rotate(-.14); ctx.scale(sc, sc); ctx.globalAlpha = u;
        stamp(ctx, 'P(DOOM) 100%', 0, 0, 62, 0, PAL.red, { seed: 4, time: t });
        ctx.restore();
        if (u < .7) flash(ctx, (1 - u / .7) * .3, PAL.redL);
      }
      TY.sticker(ctx, 'WE ARE SO BACK', 1580, 760, 22, { fill: PAL.acid, rot: -.06, seed: 6, padX: 14, padY: 8, alpha: C.seg(lt, 2.3, 2.7) });
      TY.text(ctx, 'CLAUDE POP · LIVE', 90, 150, 15, { family: 'DMMono', color: PAL.cream, letter: 3, alpha: C.seg(lt, .4, .9), stroke: PAL.ink, strokeW: 3 });
      TY.text(ctx, 'one night only / the end of the world', 90, 176, 11, { family: 'DMMono', color: C.rgba(PAL.cream, .55), letter: 1, stroke: PAL.ink, strokeW: 2 });
      dust(ctx, t, 30, 0, 200, W, 950, PAL.goldL, 5, .4);
      if (lt > 4.35) flash(ctx, C.seg(lt, 4.35, 4.7), PAL.cream);
    }
  });

  /* ---------- 53. DESK / CREDITS ---------- */
  scene({
    id: 'desk', start: 151.00, end: 156.62, lyric: 'none', noDoom: true,
    draw(t, lt, dur) {
      const z = 2.6 - 1.6 * C.easeOut(C.seg(lt, 0, 2.0));
      ctx.save(); ctx.translate(1000, 580); ctx.scale(z, z); ctx.translate(-1000, -580);
      drawDesk(ctx, t);
      // human MIRA at the desk
      ctx.save(); ctx.translate(640, 870); ctx.rotate(.03);
      mira(ctx, 0, 0, .72, {
        t,
        coatCol: '#E8DAC0',
        pose: { lean: .16, armL: [.15, .1], armR: lt > 3.5 ? [-1.55, .25] : [-.15, .1], legL: [.04, -.06], legR: [-.06, .08], headTilt: .12, hairSwing: 12 },
        face: { eyes: 'normal', mouth: 'smile', look: [1, .1] }
      });
      ctx.restore();
      // desk lamp
      ctx.save(); ctx.translate(120, 800);
      ctx.fillStyle = '#171310'; ctx.beginPath(); ctx.ellipse(0, 0, 70, 18, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#C9B896'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, -220); ctx.lineTo(120, -300); ctx.stroke();
      ctx.strokeStyle = '#6B5B46'; ctx.lineWidth = 3; ctx.stroke();
      const lampOn = lt < 4.75;
      ctx.save(); ctx.translate(120, -300); ctx.rotate(.5);
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-66, 0); ctx.lineTo(66, 0); ctx.lineTo(36, 66); ctx.lineTo(-36, 66); ctx.closePath(); }, { fill: lampOn ? PAL.gold : '#3A3027', edge: PAL.ink, edgeW: 3 });
      ctx.restore();
      if (lampOn) {
        const lg = ctx.createRadialGradient(250, 520, 20, 250, 520, 560);
        lg.addColorStop(0, 'rgba(255,224,160,.2)'); lg.addColorStop(.5, 'rgba(255,214,145,.08)'); lg.addColorStop(1, 'rgba(255,214,145,0)');
        ctx.fillStyle = lg; ctx.fillRect(-300, -100, 1200, 1100);
        ctx.fillStyle = C.rgba(PAL.goldL, .35); ctx.beginPath(); ctx.ellipse(250, 525, 60, 14, -.4, 0, TAU); ctx.fill();
      }
      ctx.restore();
      ctx.restore();
      // closing the laptop lid
      const close = C.seg(lt, 4.0, 4.55);
      if (close > 0) {
        const lidH = 220 * (1 - close);
        ctx.save(); ctx.translate(1000, 700);
        ctx.fillStyle = '#2A2521';
        ctx.fillRect(-168, -234, 336, 220 - lidH);
        if (lidH > 2) {
          ctx.fillStyle = '#171412'; ctx.fillRect(-168, -234 - lidH, 336, lidH);
          ctx.strokeStyle = C.rgba(PAL.cream, .18); ctx.lineWidth = 2; ctx.strokeRect(-168, -234 - lidH, 336, lidH);
          // sunflower sticker on the lid
          ctx.save(); ctx.translate(0, -140 - lidH); ctx.rotate(-.1); drawPaperFlower(ctx, 0, 0, .32, PAL.goldD, PAL.goldL, 0); ctx.restore();
        }
        ctx.restore();
        if (close > .96) {
          TY.text(ctx, 'click', 1090, 742, 16, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .5), alpha: 1 - C.seg(lt, 4.6, 4.9) });
        }
      }
      // small SOL peeks out
      const peek = C.seg(lt, 4.75, 5.05);
      if (peek > 0 && peek < .95) {
        ctx.save(); ctx.translate(1128, 700 - 40 * peek); ctx.scale(.22, .22);
        idol(ctx, 0, 0, 1, { t, pose: { armL: [-.4, .2], armR: [1.8, .1], headTilt: .12 }, face: { eyes: 'wink', mouth: 'grin' } });
        ctx.restore();
      }
      // credits
      const credits = [
        ['CLAUDE POP', 2.0],
        ['a paper singularity', 2.2],
        ['', 2.35],
        ['words & music: the internet', 2.45],
        ['paper, code & performance: SOL', 2.7],
        ['special thanks: MIRA, GATO, CLIP', 2.9],
        ['no pixels were harmed', 3.1],
        ['© 2026 paper singularity', 3.3]
      ];
      ctx.save();
      for (let i = 0; i < credits.length; i++) {
        const [str, at] = credits[i];
        if (!str || lt < at) continue;
        TY.text(ctx, str, 76, 170 + i * 28, i === 0 ? 24 : 14, {
          family: i === 0 ? 'Archivo Black' : 'DMMono',
          color: i === 0 ? PAL.cream : C.rgba(PAL.cream, .82),
          letter: i === 0 ? 2 : 1.2,
          alpha: C.seg(lt, at, at + .35)
        });
      }
      ctx.restore();
      // final paper card
      if (lt > 4.9) {
        const cu = C.easeOut(C.seg(lt, 4.9, 5.3));
        ctx.save(); ctx.globalAlpha = cu;
        ctx.fillStyle = PAL.cream; ctx.fillRect(0, 0, W, H);
        ctx.translate(0, (1 - cu) * 120);
        TY.type(ctx, 'made of paper', 960, 560, 128, { family: 'Instrument Serif', italic: true, align: 'center', color: PAL.ink, edge: null, shadow: C.rgba(PAL.ink, .12), shadowOff: 5, seed: 4, time: t, charRot: .01 });
        drawPaperFlower(ctx, 960, 680, 1.1, PAL.goldD, PAL.goldL, -.2);
        TY.text(ctx, 'CLAUDE POP · 2026', 960, 800, 14, { family: 'DMMono', color: C.rgba(PAL.ink, .55), align: 'center', letter: 4 });
        // barcode
        ctx.fillStyle = PAL.ink;
        for (let i = 0; i < 28; i++) { const w = 1 + (i % 4); ctx.fillRect(1550 + i * 8, 930, w, 44); }
        TY.text(ctx, '0 2026 15662 9', 1620, 1000, 10, { family: 'DMMono', color: C.rgba(PAL.ink, .6), align: 'center', letter: 2 });
        TY.text(ctx, 'no pixels were harmed', 90, 990, 11, { family: 'DMMono', color: C.rgba(PAL.ink, .4), letter: 1 });
        ctx.restore();
      }
      dust(ctx, t, 24, 0, 200, W, 900, PAL.goldL, 7, .25);
    }
  });
})();
