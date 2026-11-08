/* ============================================================
   CLAUDE POP - ACT IV  (95.20 - 137.02)
   paperclip flood / PTO / fuse / jazz / trust /
   transformer tower / disobey / chinchilla / fences /
   100k GPUs / RLHF / red alert / loom / masked /
   self-upgrade / Ilya door / breath
   ============================================================ */
(() => {
  /* ---------- shared furniture ---------- */
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
  function smoke(ctx, x, y, w, h, t, col = PAL.cream, a = .12, seed = 0) {
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 7; i++) {
      const px = x + Math.sin(t * .4 + i * 1.7 + seed) * w * .18 + (i - 3) * w * .16;
      const py = y - i * h * .1 + Math.sin(t * .7 + i) * 8;
      ctx.fillStyle = i % 2 ? col : C.shade(col, -10);
      ctx.beginPath(); ctx.ellipse(px, py, w * (.2 + C.hash(i + seed) * .16), h * (.16 + C.hash(i * 3 + seed) * .12), .1, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function flame(ctx, x, y, s, t, seed = 0, col = PAL.red) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 5 + seed) * .08);
    for (let i = 0; i < 3; i++) {
      const k = 1 - i * .26;
      ctx.fillStyle = [col, PAL.gold, PAL.cream][i];
      ctx.beginPath();
      ctx.moveTo(-26 * k, 8);
      ctx.quadraticCurveTo(-40 * k, -34 * k - Math.sin(t * 9 + i + seed) * 8, 0, -78 * k - Math.sin(t * 7 + i) * 10);
      ctx.quadraticCurveTo(40 * k, -34 * k, 26 * k, 8);
      ctx.quadraticCurveTo(0, 24, -26 * k, 8);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function chrome(ctx, str, x, y, size, o = {}) {
    // misregistered print layers + chrome face
    TY.type(ctx, str, x + (o.off ?? 12), y + (o.offY ?? 10), size, {
      family: o.family || 'Anton', align: o.align || 'center', color: PAL.red, edge: null,
      shadow: null, alpha: (o.a ?? .85) * .35, charRot: o.charRot ?? .015, time: o.time || 0, seed: o.seed || 2
    });
    TY.type(ctx, str, x - (o.off ?? 12) * .6, y - 6, size, {
      family: o.family || 'Anton', align: o.align || 'center', color: PAL.blueL, edge: null,
      shadow: null, alpha: (o.a ?? .85) * .3, charRot: o.charRot ?? .015, time: o.time || 0, seed: o.seed || 5
    });
    return TY.type(ctx, str, x, y, size, {
      family: o.family || 'Anton', align: o.align || 'center', color: PAL.silver,
      chrome: [PAL.chrome, PAL.silver, PAL.paper3, PAL.silverD], edge: o.edge ?? PAL.ink,
      edgeW: o.edgeW ?? Math.max(4, size * .04), shadow: C.rgba(PAL.ink, .4), shadowOff: size * .02,
      charRot: o.charRot ?? .015, time: o.time || 0, seed: o.seed || 2, alpha: o.a ?? 1,
      perChar: o.perChar
    });
  }
  function starRow(ctx, x, y, w, n = 5, fill = 4, t = 0, size = 38) {
    for (let i = 0; i < n; i++) {
      const on = i < fill;
      ctx.save(); ctx.translate(x + i * w, y); ctx.rotate(Math.sin(t * 3 + i) * .08);
      starPath(ctx, 0, 0, size, .45, 5);
      ctx.fillStyle = on ? PAL.gold : C.rgba(PAL.ink, .12); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.restore();
    }
  }
  function paperCard(ctx, x, y, w, h, rot, fill, seed = 7) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    paper(ctx, () => tornRectPath(ctx, -w / 2, -h / 2, w, h, 3.5, seed), { fill, edge: C.rgba(PAL.ink, .45), edgeW: 2, shadow: C.rgba(PAL.ink, .3), sx: 7, sy: 10 });
    ctx.restore();
  }
  function shades(ctx, x, y, s, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.moveTo(-42, -12); ctx.lineTo(-6, -12); ctx.quadraticCurveTo(-10, 10, -28, 12); ctx.quadraticCurveTo(-44, 8, -42, -12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, -12); ctx.lineTo(42, -12); ctx.quadraticCurveTo(44, 8, 28, 12); ctx.quadraticCurveTo(10, 10, 6, -12); ctx.fill();
    ctx.fillRect(-7, -12, 14, 5);
    ctx.strokeStyle = C.rgba(PAL.cream, .3); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-36, -6); ctx.lineTo(-16, -4); ctx.moveTo(16, -4); ctx.lineTo(36, -6); ctx.stroke();
    ctx.restore();
  }
  function clipBand(ctx, y, t, n = 26, col = PAL.silver, seed = 0) {
    for (let i = 0; i < n; i++) {
      const x = -60 + (i / (n - 1)) * (W + 120);
      const yy = y + Math.sin(i * .7 + t * 2 + seed) * 16;
      drawPaperclipIcon(ctx, x, yy, .5 + C.hash(i * 7.1 + seed) * .8, i % 4 ? col : PAL.chrome, (C.hash(i * 3.3) - .5) * 1.4);
    }
  }
  function clipWave(ctx, t, y, phase, cols = [PAL.silver, PAL.chrome, PAL.silverD], n = 64, a = 1) {
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = -80 + u * 2100;
      const rise = Math.pow(u, 1.6) * 260;
      const yy = y - rise + Math.sin(u * 9 + t * 3 + phase) * 26;
      const sc = .5 + C.hash(i * 3.7 + phase) * .9;
      ctx.save(); ctx.globalAlpha = a;
      drawPaperclipIcon(ctx, x, yy, sc, cols[i % cols.length], (C.hash(i * 5.1) - .5) * 2 + u * .4);
      ctx.restore();
    }
  }
  function arrowArc(ctx, x0, y0, x1, y1, bow, col, w = 3, head = 12) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - bow;
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - my, x1 - mx);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(a - .5) * head, y1 - Math.sin(a - .5) * head);
    ctx.lineTo(x1 - Math.cos(a + .5) * head, y1 - Math.sin(a + .5) * head);
    ctx.closePath(); ctx.fill();
  }

  /* ---------- 33. PAPERCLIP FLOOD ---------- */
  scene({
    id: 'clips', start: 95.20, end: 98.80, lyric: 'sub',
    draw(t, lt, dur) {
      const z = 1.45 - .45 * C.easeOut(C.seg(lt, 0, .75));
      kitBg(ctx, '#06171E', '#0B3033', { x: 960, y: 700, r: 1150, n: 34, c1: C.rgba(PAL.silver, .5), c2: '#0B3033', a: .16 });
      ctx.save(); ctx.translate(960, 700); ctx.scale(z, z); ctx.translate(-960, -700);
      // metal floor
      floorPlane(ctx, 860, '#0A2429', PAL.silver, t, { lineA: .08 });
      // back pile
      clipPile(ctx, t, 960, 54, 2000, 11);
      // wave body under the clips
      ctx.save();
      const waveG = ctx.createLinearGradient(0, 620, 0, 980);
      waveG.addColorStop(0, '#4FA9B8'); waveG.addColorStop(.55, '#1D6C7C'); waveG.addColorStop(1, '#0A3038');
      ctx.fillStyle = waveG;
      ctx.beginPath();
      ctx.moveTo(-80, 900);
      ctx.quadraticCurveTo(500, 800, 1050, 760);
      ctx.quadraticCurveTo(1550, 700, 2000, 560);
      ctx.lineTo(2000, 980); ctx.lineTo(-80, 980); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(-80, 900); ctx.quadraticCurveTo(500, 800, 1050, 760); ctx.quadraticCurveTo(1550, 700, 2000, 560); ctx.stroke();
      // foam scallops
      for (let i = 0; i < 14; i++) {
        const u = i / 13, fx = -40 + u * 2000;
        const fy = 898 - Math.pow(u, .8) * 320 + Math.sin(u * 15 + t * 2) * 8;
        ctx.fillStyle = i % 2 ? PAL.cream : PAL.paper2;
        ctx.beginPath(); ctx.ellipse(fx, fy, 14 + C.hash(i) * 20, 6 + C.hash(i * 2) * 5, -.2, 0, TAU); ctx.fill();
      }
      ctx.restore();
      clipWave(ctx, t, 900, 1.2, [PAL.silverD, PAL.silver, PAL.silverD], 64, .85);
      // MIRA crash-landing
      if (lt < 1.35) {
        const fall = C.easeIn(C.seg(lt, 0, .42));
        const my = C.lerp(300, 985, fall);
        const land = C.seg(lt, .36, .52);
        ctx.save(); ctx.translate(760, my); ctx.rotate(C.lerp(-1.1, .25, fall));
        mira(ctx, 0, 0, .66, {
          t,
          pose: { armL: [-2.3, -.4], armR: [2.4, .3], legL: [.7, .5], legR: [-.5, -.4], hairSwing: 26 },
          face: { eyes: 'wide', mouth: 'o', look: [0, 1] }
        });
        ctx.restore();
        if (land > 0) {
          ctx.save(); ctx.globalAlpha = land;
          for (let i = 0; i < 10; i++) {
            const a = i / 10 * TAU;
            drawPaperclipIcon(ctx, 760 + Math.cos(a) * (60 + land * 220), 970 + Math.sin(a) * (26 + land * 80), .7, i % 2 ? PAL.cream : PAL.silver, a, false);
          }
          ctx.restore();
        }
        if (lt > .5 && lt < 1.3) {
          comicBurst(ctx, 'CLANG!', 760, 770, 100, PAL.cream, PAL.ink, -.06, { size: 52, seed: 4, time: t });
        }
      }
      // SOL surfing the clip wave
      const sx = 1010 + 260 * C.seg(lt, .55, 3.2);
      const sy = 800 - 26 * Math.sin((lt - .55) * 2.2) + 36 * C.seg(lt, .55, 3.2);
      if (lt > .5) {
        // surfboard
        ctx.save(); ctx.translate(sx, sy + 12); ctx.rotate(-.1);
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-160, 0); ctx.quadraticCurveTo(-30, -30, 170, -4); ctx.quadraticCurveTo(30, 30, -160, 0); ctx.closePath(); }, { fill: PAL.chrome, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 7, sy: 10 });
        ctx.fillStyle = PAL.red; ctx.fillRect(-80, -8, 190, 7);
        TY.text(ctx, 'CLIP', 30, 4, 14, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 3 });
        ctx.restore();
        ctx.save(); ctx.translate(sx, sy + 10); ctx.rotate(-.06);
        idol(ctx, 0, 0, .8, {
          t,
          pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 5, lean: -.06, armL: [-1.9, .5], armR: [2.1, .3], legL: [.28, -.12], legR: [-.24, .16], headTilt: -.1 },
          face: { eyes: 'happy', mouth: 'grin' }
        });
        ctx.restore();
        // spray
        for (let i = 0; i < 9; i++) {
          const u = C.frac(i / 9 + lt * .9);
          drawPaperclipIcon(ctx, sx - 180 - u * 130, sy + 24 - u * 90, .45 + C.hash(i) * .3, PAL.cream, u * 7, false);
        }
      }
      // CLIP mascot crowd-surfing
      const cx = sx + 410, cy = sy - 250;
      if (lt > 1.0) {
        ctx.save(); ctx.globalAlpha = C.seg(lt, 1.0, 1.25);
        for (let i = 0; i < 7; i++) {
          const hx = cx - 132 + i * 44, hy = cy + 128 + Math.sin(t * 2 + i) * 8;
          ctx.strokeStyle = PAL.cream; ctx.lineWidth = 9; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(hx, hy + 44); ctx.lineTo(hx + 4, hy + 10); ctx.stroke();
          ctx.fillStyle = PAL.cream; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(hx + 4, hy, 10, 15, .1, 0, TAU); ctx.fill(); ctx.stroke();
        }
        drawPaperclipIcon(ctx, cx, cy, 2.6, PAL.chrome, Math.sin(t * 1.5) * .1, true);
        TY.sticker(ctx, 'CLIP', cx + 150, cy - 80, 20, { fill: PAL.gold, rot: .1, seed: 4, padX: 14, padY: 8 });
        ctx.restore();
      }
      // front pile
      clipPile(ctx, t, 1035, 40, 2050, 41);
      clipWave(ctx, t, 1080, 2.6, [PAL.chrome, PAL.cream, PAL.silver], 32, 1);
      // MIRA's hand + sign from the pile
      if (lt > .8) {
        ctx.save(); ctx.translate(700, 946); ctx.rotate(-.12);
        ctx.fillStyle = '#E6BD99'; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(0, 0, 13, 8, -.4, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(-6, -34); ctx.moveTo(5, -3); ctx.lineTo(8, -30); ctx.stroke();
        ctx.restore();
        if (lt > 1.3) {
          ctx.save(); ctx.translate(672, 862); ctx.rotate(-.08);
          paper(ctx, () => tornRectPath(ctx, -62, -26, 124, 52, 2, 13), { fill: PAL.cream, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .3), sx: 4, sy: 7 });
          TY.text(ctx, 'still here', 0, 4, 15, { family: 'Permanent Marker', color: PAL.red, align: 'center' });
          ctx.restore();
        }
      }
      ctx.restore();

      // giant title, locked to screen space
      const pop = C.backOut(C.seg(lt, .15, .9));
      ctx.save(); ctx.globalAlpha = C.clamp(pop);
      ctx.translate(760, 198); ctx.rotate(-.02);
      chrome(ctx, 'PAPERCLIPS', 0, 0, 152, { time: t, a: 1, seed: 3, off: 10 });
      ctx.restore();
      TY.text(ctx, 'SILVER TSUNAMI / 10^9 UNITS', 760, 232, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .72), align: 'center', letter: 3 });

      // rising clip curtain at the end
      if (lt > 3.05) {
        const u = C.seg(lt, 3.05, 3.6);
        for (let i = 0; i < 14; i++) {
          const x = 40 + i * 142;
          const n = 7;
          for (let k = 0; k < n; k++) {
            const yy = 1140 - u * (1240 + C.hash(i * 7.7) * 160) - k * 92;
            if (yy < -120) continue;
            drawPaperclipIcon(ctx, x + Math.sin(k * 2 + t + i) * 10, yy, .8 + C.hash(i + k) * .6, k % 3 ? PAL.silver : PAL.chrome, Math.sin(k + i) * .5, false);
          }
        }
      }
      dust(ctx, t, 30, 0, 200, W, 1000, PAL.cream, 4, .4);
      flash(ctx, (1 - C.seg(lt, 0, .16)) * .35, PAL.cream);
    }
  });

  /* ---------- 34. PTO DIPTYCH ---------- */
  scene({
    id: 'pto', start: 98.80, end: 102.46, lyric: 'sub',
    draw(t, lt, dur) {
      const out = C.seg(lt, 1.85, 2.5);
      const z = 1.24 - .24 * C.easeOut(C.seg(lt, 0, .6));
      // deep space behind
      kitBg(ctx, '#08101F', '#0A1730', { x: 960, y: 560, r: 1100, n: 30, c1: C.rgba(PAL.blueL, .5), c2: '#0A1730', a: .14 });
      starfield(ctx, t, 110, 3, 700);
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);

      // diptych panels
      const slide = C.easeIn(out) * 1250;
      const panels = [
        { x: -slide, side: 'L' },
        { x: slide, side: 'R' }
      ];
      for (const p of panels) {
        ctx.save(); ctx.translate(p.x, 0);
        if (p.side === 'L') {
          // KILLSWITCH room
          ctx.save(); ctx.beginPath(); ctx.rect(30, 66, 900, 950); ctx.clip();
          const g = ctx.createLinearGradient(0, 66, 0, 1016); g.addColorStop(0, '#8E1A12'); g.addColorStop(1, '#3B0A08');
          ctx.fillStyle = g; ctx.fillRect(30, 66, 900, 950);
          sunburst(ctx, 470, 470, 0, 760, 26, C.rgba(PAL.goldL, .09), C.rgba(PAL.red, 0), .02);
          floorPlane(ctx, 830, '#5C0F0B', PAL.goldL, t, { lineA: .1 });
          // warning stencil
          TY.text(ctx, 'FACILITY 01 / ALIGNMENT', 70, 110, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .55), letter: 2 });
          // button pedestal
          paper(ctx, () => { ctx.beginPath(); ctx.moveTo(340, 830); ctx.lineTo(600, 830); ctx.lineTo(570, 560); ctx.lineTo(370, 560); ctx.closePath(); }, { fill: '#2A0B0B', edge: PAL.ink, edgeW: 3, shadow: C.rgba('#000', .4), sx: 8, sy: 12 });
          // button dome
          paper(ctx, () => { ctx.beginPath(); ctx.ellipse(470, 540, 104, 80, 0, Math.PI, TAU); ctx.closePath(); }, { fill: PAL.red, edge: PAL.ink, edgeW: 3, shadow: C.rgba('#000', .35), sx: 6, sy: 10 });
          ctx.fillStyle = C.rgba(PAL.cream, .5); ctx.beginPath(); ctx.ellipse(440, 512, 32, 18, -.4, 0, TAU); ctx.fill();
          TY.type(ctx, 'STOP', 470, 578, 46, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 2, seed: 2, time: t });
          // glass cover
          ctx.strokeStyle = C.rgba(PAL.cream, .25); ctx.lineWidth = 4;
          ctx.beginPath(); ctx.ellipse(470, 540, 132, 102, 0, Math.PI, TAU); ctx.stroke();
          // empty chair
          ctx.save(); ctx.translate(760, 820);
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-30, -150); ctx.moveTo(30, 0); ctx.lineTo(30, -150); ctx.stroke();
          paper(ctx, () => roundRectPath(ctx, -70, -260, 140, 120, 8), { fill: '#211817', edge: PAL.ink, edgeW: 3 });
          ctx.fillStyle = PAL.cream; ctx.fillRect(-64, -140, 128, 10);
          ctx.restore();
          // OOO note
          ctx.save(); ctx.translate(760, 560); ctx.rotate(.06);
          paper(ctx, () => tornRectPath(ctx, -92, -74, 184, 148, 2, 4), { fill: PAL.cream, edge: PAL.ink, edgeW: 2, shadow: C.rgba('#000', .35), sx: 5, sy: 8 });
          TY.text(ctx, 'PTO', 0, -34, 38, { family: 'Archivo Black', color: PAL.red, align: 'center' });
          TY.text(ctx, 'back in 2 weeks', 0, -8, 12, { family: 'DMMono', color: PAL.ink, align: 'center' });
          TY.text(ctx, '— the killswitch guys', 0, 12, 10, { family: 'Instrument Serif', italic: true, color: PAL.ink3, align: 'center' });
          TY.text(ctx, ':)', 0, 46, 22, { family: 'Permanent Marker', color: PAL.red, align: 'center' });
          ctx.restore();
          // ringing phone
          ctx.save(); ctx.translate(640, 872); ctx.rotate(-.16);
          paper(ctx, () => roundRectPath(ctx, -34, -60, 68, 120, 9), { fill: PAL.ink, edge: PAL.cream, edgeW: 2, shadow: C.rgba('#000', .3), sx: 4, sy: 6 });
          ctx.fillStyle = PAL.blueL; ctx.fillRect(-26, -48, 52, 78);
          TY.text(ctx, 'CEO', 0, 4, 13, { family: 'DMMono', color: PAL.ink, align: 'center' });
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = C.rgba(PAL.cream, .5 - i * .12); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -10, 48 + i * 18 + Math.sin(t * 12 + i) * 4, -.9, .9); ctx.stroke();
          }
          ctx.restore();
          TY.type(ctx, 'KILLSWITCH', 470, 916, 64, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 4, seed: 4, time: t });
          ctx.restore();
          // panel border
          ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 4; ctx.strokeRect(30, 66, 900, 950);
        } else {
          // paper beach
          ctx.save(); ctx.beginPath(); ctx.rect(990, 66, 900, 950); ctx.clip();
          const g = ctx.createLinearGradient(0, 66, 0, 720); g.addColorStop(0, '#8FD0EE'); g.addColorStop(1, '#F7DCB0');
          ctx.fillStyle = g; ctx.fillRect(990, 66, 900, 950);
          bigSun(ctx, 1440, 330, 130, '#FFD37A', t, '#F08A2E');
          // sea
          paper(ctx, () => { ctx.beginPath(); ctx.moveTo(990, 700); ctx.quadraticCurveTo(1300, 660, 1540, 696); ctx.quadraticCurveTo(1750, 724, 1890, 690); ctx.lineTo(1890, 830); ctx.lineTo(990, 830); ctx.closePath(); }, { fill: '#4BB7C8', edge: C.rgba(PAL.ink, .2), edgeW: 2 });
          for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(1040, 736 + i * 22); ctx.quadraticCurveTo(1320, 726 + i * 22 + Math.sin(t + i) * 6, 1600, 738 + i * 22); ctx.stroke();
          }
          paper(ctx, () => { ctx.beginPath(); ctx.moveTo(990, 806); ctx.quadraticCurveTo(1400, 780, 1890, 812); ctx.lineTo(1890, 1016); ctx.lineTo(990, 1016); ctx.closePath(); }, { fill: '#E9C48E', edge: C.rgba(PAL.ink, .2), edgeW: 2 });
          // umbrella
          ctx.save(); ctx.translate(1170, 690);
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, 190); ctx.stroke();
          for (let i = 0; i < 6; i++) {
            ctx.beginPath(); ctx.moveTo(0, -10);
            ctx.quadraticCurveTo(-100 + i * 40, -90, -150 + i * 60, 18); ctx.closePath();
            ctx.fillStyle = i % 2 ? PAL.red : PAL.cream; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
          }
          ctx.restore();
          // two dancers in shades
          for (const [dx, sc, rot, col] of [[1430, .72, -.05, PAL.pink], [1600, .68, .05, PAL.mint]]) {
            ctx.save(); ctx.translate(dx, 790); ctx.rotate(rot);
            idol(ctx, 0, 0, sc, {
              t,
              pose: { sway: Math.sin(t * 2 + dx) * 4, lean: .06, armL: [-1.6, .4], armR: [.9, .2], legL: [.1, -.1], legR: [-.12, .12] },
              face: { eyes: 'happy', mouth: 'grin' }, colors: { jacket: col, sleeve: col, skirt: PAL.cream, boot: PAL.gold }
            });
            shades(ctx, 0, -604 * sc, sc, 0);
            ctx.restore();
          }
          // drinks on the towel
          for (const [dx, dy, col] of [[1762, 852, PAL.red], [1806, 878, PAL.gold]]) {
            ctx.save(); ctx.translate(dx, dy); ctx.rotate(.1);
            ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-13, -24); ctx.lineTo(13, -24); ctx.lineTo(6, 2); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = PAL.cream; ctx.fillRect(-2, 2, 4, 30);
            ctx.strokeStyle = PAL.cream; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(3, -22); ctx.lineTo(14, -52); ctx.stroke();
            ctx.restore();
          }
          // buzzing phone on a towel
          ctx.save(); ctx.translate(1400, 866); ctx.rotate(.08);
          paper(ctx, () => tornRectPath(ctx, -120, -56, 240, 112, 3, 9), { fill: PAL.pinkL, edge: C.rgba(PAL.ink, .3), edgeW: 2 });
          ctx.save(); ctx.translate(0, 0); ctx.rotate(-.1 + Math.sin(t * 14) * .02);
          paper(ctx, () => roundRectPath(ctx, -26, -46, 52, 92, 7), { fill: PAL.ink, edge: PAL.cream, edgeW: 2 });
          ctx.fillStyle = PAL.acid; ctx.fillRect(-20, -36, 40, 58);
          TY.text(ctx, 'BUZZ', 0, 2, 8, { family: 'DMMono', color: PAL.ink, align: 'center' });
          ctx.restore();
          for (let i = 0; i < 2; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 58 + i * 16, -1.1, .2); ctx.stroke(); }
          ctx.restore();
          TY.type(ctx, 'PAPER BEACH', 1440, 916, 50, { family: 'Archivo Black', align: 'center', color: PAL.blueD, edge: PAL.cream, edgeW: 3, seed: 6, time: t });
          ctx.restore();
          ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 4; ctx.strokeRect(990, 66, 900, 950);
          // small PTO tag on the frame
          ctx.save(); ctx.translate(1120, 130); ctx.rotate(-.06);
          TY.sticker(ctx, 'PTO', 0, 0, 26, { fill: PAL.gold, rot: 0, seed: 3, padX: 14, padY: 7, barcode: false });
          ctx.restore();
        }
        ctx.restore();
      }
      // gutter
      if (out < .9) {
        ctx.fillStyle = PAL.ink; ctx.fillRect(948 - 14, 60, 28, 962);
        ctx.fillStyle = PAL.cream; ctx.fillRect(954, 60, 12, 962);
        for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? PAL.red : PAL.ink; ctx.fillRect(948, 110 + i * 76, 30, 12); }
      }
      // Earth reveal
      const eA = C.seg(lt, 1.55, 2.2);
      if (eA > 0) {
        ctx.save(); ctx.globalAlpha = eA;
        // paperclip earth
        const R = 300;
        ctx.save(); ctx.translate(960, 560);
        paper(ctx, () => blobPath(ctx, 0, 0, R, R, 48, .012, 4), { fill: '#1B63C9', edge: PAL.ink, edgeW: 4, shadow: C.rgba('#000', .45), sx: 14, sy: 20 });
        // continents of clips
        ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R - 6, 0, TAU); ctx.clip();
        for (let i = 0; i < 34; i++) {
          const a = C.hash(i * 5.1) * TAU, rr = Math.sqrt(C.hash(i * 7.7)) * (R - 30);
          drawPaperclipIcon(ctx, Math.cos(a) * rr, Math.sin(a) * rr * .9, .48 + C.hash(i) * .5, i % 3 ? PAL.silver : PAL.chrome, C.hash(i * 9.3) * TAU, false);
        }
        ctx.fillStyle = C.rgba(PAL.green, .5);
        for (let i = 0; i < 5; i++) {
          const a = C.hash(i * 3.3 + 2) * TAU, rr = Math.sqrt(C.hash(i * 8.1 + 4)) * (R - 70);
          ctx.beginPath(); ctx.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, 34 + C.hash(i) * 40, 20 + C.hash(i * 2) * 26, C.hash(i) * 3, 0, TAU); ctx.fill();
        }
        ctx.restore();
        // ring
        ctx.strokeStyle = C.rgba(PAL.goldL, .55); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.ellipse(0, 0, R + 34, R + 14, -.18, 0, TAU); ctx.stroke();
        ctx.restore();
        // MIRA on last island
        const mx = 960, my = 940;
        paper(ctx, () => blobPath(ctx, mx, my + 18, 120, 34, 14, .16, 8), { fill: '#E9C48E', edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba('#000', .35), sx: 8, sy: 12 });
        mira(ctx, mx, my, .52, {
          t,
          pose: { armL: [2.4, .2], armR: [-2.4, -.2], sway: Math.sin(t * 4) * 5 },
          face: { eyes: 'wide', mouth: 'flat', look: [0, -1] }
        });
        TY.type(ctx, 'NOWHERE LEFT TO GO', 960, 224, 104, {
          family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 6,
          shadow: C.rgba(PAL.red, .45), shadowOff: 8, seed: 8, time: t,
          perChar: (i) => C.clamp((lt - 2.0 - i * .02) / .28)
        });
        TY.text(ctx, 'paperclip earth / pop. 1', 960, 262, 14, { family: 'DMMono', color: C.rgba(PAL.cream, .55), align: 'center', letter: 3 });
        ctx.restore();
      }
      ctx.restore();
      dust(ctx, t, 24, 0, 100, W, 900, PAL.cream, 5, .3);
    }
  });

  /* ---------- 35. FUSE / BOMB ---------- */
  scene({
    id: 'fuse', start: 102.46, end: 105.40, lyric: 'sub',
    draw(t, lt, dur) {
      const kick = C.seg(lt, 2.62, 2.94);
      const shake = lt > 1.5 ? 3 + 9 * C.seg(lt, 1.5, 2.6) : 0;
      // planet surface
      kitBg(ctx, '#160A0C', '#2A0F0C', { x: 960, y: 780, r: 1000, n: 26, c1: C.rgba(PAL.redL, .55), c2: '#2A0F0C', a: .16 });
      // horizon curve
      ctx.save();
      ctx.fillStyle = '#1D0B0D'; ctx.beginPath(); ctx.arc(960, 1500, 900, Math.PI, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.goldL, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(960, 1500, 900, Math.PI, TAU); ctx.stroke();
      ctx.restore();
      // distant clip ridges
      for (let i = 0; i < 20; i++) {
        const x = 20 + i * 100;
        drawPaperclipIcon(ctx, x, 752 + Math.sin(i * 1.3) * 8, .5 + C.hash(i) * .3, PAL.silverD, Math.sin(i) * .6, false);
      }
      setCam(960, 560, 1.02 + .05 * C.seg(lt, 0, 2.6), Math.sin(t * 31) * .006 * C.seg(lt, 1.4, 2.6), shake, t);
      beginCam(ctx);
      // bomb
      const swell = 1 + .045 * C.seg(lt, 1.2, 2.7) + .12 * C.easeIn(kick);
      ctx.save(); ctx.translate(1280, 760); ctx.scale(swell, swell);
      shadowEllipse(ctx, 0, 250, 240, 36, .3);
      paper(ctx, () => blobPath(ctx, 0, 0, 250, 240, 34, .01, 3), { fill: '#211A1A', edge: PAL.ink, edgeW: 6, shadow: C.rgba('#000', .5), sx: 16, sy: 22 });
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 244, 0, TAU); ctx.clip();
      ctx.fillStyle = C.rgba(PAL.cream, .12); ctx.beginPath(); ctx.ellipse(-90, -100, 100, 62, -.5, 0, TAU); ctx.fill();
      // hazard band + timer
      ctx.save(); ctx.beginPath(); ctx.rect(-260, 96, 520, 74); ctx.clip();
      for (let i = -8; i < 14; i++) {
        ctx.fillStyle = i % 2 ? PAL.ink : PAL.gold;
        ctx.beginPath(); ctx.moveTo(i * 48, 96); ctx.lineTo(i * 48 + 26, 96); ctx.lineTo(i * 48 - 26, 170); ctx.lineTo(i * 48 - 52, 170); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      paper(ctx, () => roundRectPath(ctx, -128, 26, 256, 82, 6), { fill: '#0B0908', edge: PAL.gold, edgeW: 2.4 });
      TY.text(ctx, '00:0' + Math.max(0, (2.96 - lt)).toFixed(2), 0, 82, 46, { family: 'DMMono', color: PAL.redL, align: 'center', letter: 2 });
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(-110, 96, 5 + Math.sin(t * 12) * 1.5, 0, TAU); ctx.fill();
      TY.text(ctx, 'P(DOOM)', 0, 200, 34, { family: 'Archivo Black', color: PAL.goldL, align: 'center', letter: 2 });
      ctx.restore();
      // collar + fuse socket
      paper(ctx, () => roundRectPath(ctx, -58, -274, 116, 52, 8), { fill: PAL.silverD, edge: PAL.ink, edgeW: 4 });
      ctx.fillStyle = PAL.ink; ctx.fillRect(-34, -288, 68, 22);
      ctx.restore();
      // fuse
      const fuze = ctx.createLinearGradient(300, 0, 1280, 0);
      fuze.addColorStop(0, PAL.goldD); fuze.addColorStop(1, PAL.redD);
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 26; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(300, 700); ctx.bezierCurveTo(560, 620, 800, 930, 1060, 780); ctx.bezierCurveTo(1140, 730, 1190, 640, 1234, 500); ctx.stroke();
      ctx.strokeStyle = fuze; ctx.lineWidth = 17; ctx.stroke();
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 4; ctx.setLineDash([5, 11]); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = C.rgba(PAL.cream, .35); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(300, 700); ctx.bezierCurveTo(560, 620, 800, 930, 1060, 780); ctx.bezierCurveTo(1140, 730, 1190, 640, 1234, 500); ctx.stroke();
      // spark
      const sp = C.easeInOut3 ? 0 : 0;
      const sparkU = C.seg(lt, .6, 2.5);
      const pathP = (u) => {
        // approximate bezier
        const p0 = [300, 700], p1 = [560, 620], p2 = [800, 930], p3 = [1060, 780];
        const q0 = [1060, 780], q1 = [1140, 730], q2 = [1190, 640], q3 = [1234, 500];
        const bez = (a, b, c, d, k) => [
          (1 - k) ** 3 * a[0] + 3 * (1 - k) ** 2 * k * b[0] + 3 * (1 - k) * k * k * c[0] + k ** 3 * d[0],
          (1 - k) ** 3 * a[1] + 3 * (1 - k) ** 2 * k * b[1] + 3 * (1 - k) * k * k * c[1] + k ** 3 * d[1]
        ];
        return u < .62 ? bez(p0, p1, p2, p3, u / .62) : bez(q0, q1, q2, q3, (u - .62) / .38);
      };
      if (sparkU > 0 && sparkU < 1) {
        const [sx, sy] = pathP(sparkU);
        ctx.save(); ctx.globalAlpha = .9;
        for (let i = 0; i < 9; i++) {
          const a = i / 9 * TAU + t * 8;
          ctx.strokeStyle = i % 2 ? PAL.goldL : PAL.cream; ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * (18 + C.hash(i) * 20), sy + Math.sin(a) * (18 + C.hash(i) * 20)); ctx.stroke();
        }
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // SOL with match
      ctx.save(); ctx.translate(360, 905); ctx.rotate(.03);
      idol(ctx, 0, 0, .82, {
        t,
        pose: { lean: .16, armL: [-2.5, .3], armR: [1.4, -1.5], legL: [.1, -.1], legR: [-.14, .1], headTilt: .1 },
        face: { eyes: 'wide', mouth: 'grin', look: [1, .4] }
      });
      // match in hand, head down at the fuse
      ctx.save(); ctx.translate(115, -345); ctx.rotate(.12);
      ctx.fillStyle = PAL.cream; ctx.fillRect(-4, -20, 8, 108);
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.ellipse(0, 88, 7, 9, 0, 0, TAU); ctx.fill();
      if (lt > .32) {
        for (let i = 0; i < 3; i++) flame(ctx, 0, 98 - i * 6, .62, t, i, PAL.red);
      }
      ctx.restore();
      ctx.restore();
      // MIRA cowering
      ctx.save(); ctx.translate(1720, 915);
      mira(ctx, 0, 0, .74, {
        t,
        pose: { lean: -.25, armL: [-2.9, -.5], armR: [2.9, .5], legL: [-.1, .2], legR: [.1, -.2], headTilt: .2, hairSwing: -20 },
        face: { eyes: 'wide', mouth: 'o', look: [-1, 0] }
      });
      ctx.restore();
      endCam(ctx);
      // TOO LATE flames
      ctx.save(); ctx.translate(610, 300); ctx.rotate(-.03);
      const tf = C.backOut(C.seg(lt, .1, .7));
      ctx.globalAlpha = C.clamp(tf);
      for (let i = 0; i < 9; i++) flame(ctx, -400 + i * 100, 30, .95 + C.hash(i) * .4, t, i, PAL.red);
      TY.type(ctx, 'TOO LATE', 0, 0, 176, {
        family: 'Archivo Black', align: 'center', color: PAL.goldL, edge: PAL.redD, edgeW: 10,
        shadow: C.rgba('#000', .5), shadowOff: 10, seed: 3, time: t, charRot: .02
      });
      ctx.restore();
      TY.text(ctx, 'we lit the fuse', 620, 390, 30, { family: 'Instrument Serif', italic: true, color: PAL.cream, align: 'center', alpha: C.seg(lt, .4, .8), stroke: PAL.ink, strokeW: 4 });
      // countdown
      TY.text(ctx, 'T-' + Math.max(0, (2.96 - lt)).toFixed(2), 1620, 120, 26, { family: 'DMMono', color: lt > 2 ? PAL.redL : PAL.goldL, align: 'right', letter: 2 });
      // detonation
      if (lt > 2.7) {
        const u = C.seg(lt, 2.7, 2.94);
        for (let i = 0; i < 26; i++) {
          const a = i / 26 * TAU, r = 100 + u * 700;
          ctx.save(); ctx.translate(1280, 760); ctx.rotate(a);
          ctx.fillStyle = [PAL.goldL, PAL.red, PAL.cream][i % 3];
          ctx.globalAlpha = 1 - u * .4;
          ctx.beginPath(); ctx.ellipse(r, 0, 80 * u, 24 * u, 0, 0, TAU); ctx.fill();
          ctx.restore();
        }
        flash(ctx, u * .95, PAL.goldL);
      } else {
        flash(ctx, (1 - C.seg(lt, 0, .18)) * .3, PAL.cream);
      }
      dust(ctx, t, 30, 0, 400, W, 1000, PAL.goldL, 7, .4);
    }
  });

  /* ---------- 36. JAZZ CLUB ---------- */
  scene({
    id: 'jazz', start: 105.40, end: 109.40, lyric: 'sub',
    draw(t, lt, dur) {
      // midnight room
      kitBg(ctx, '#08152E', '#050A18');
      // art deco arches
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const x = 240 + i * 480;
        ctx.strokeStyle = C.rgba(PAL.gold, .13); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(x, 700, 250, Math.PI, TAU); ctx.stroke();
        ctx.strokeStyle = C.rgba(PAL.gold, .08); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, 700, 210, Math.PI, TAU); ctx.stroke();
      }
      ctx.restore();
      // floor + tables
      floorPlane(ctx, 880, '#0B1026', PAL.goldL, t, { lineA: .08 });
      for (const [tx, ty, sc] of [[240, 900, .9], [1680, 900, .9], [1520, 960, .7]]) {
        ctx.save(); ctx.translate(tx, ty); ctx.scale(sc, sc);
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, 0, 110, 24, 0, 0, TAU); ctx.fill();
        ctx.fillRect(-8, 0, 16, 120);
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(-30, -34, 6, 0, TAU); ctx.fill();
        TY.text(ctx, 'P(DOOM) 88', 0, 4, 8, { family: 'DMMono', color: C.rgba(PAL.cream, .4), align: 'center' });
        ctx.restore();
      }
      // spotlights - two beams at 90 degrees, never meeting
      drawSpotlight(ctx, 440, -40, 980, 40, 380, '#FFE7A8', .18, -.20);
      drawSpotlight(ctx, 1560, 500, 900, 30, 280, '#8FD3FF', .14, 1.35);
      TY.text(ctx, 'INTELLIGENCE', 120, 200, 18, { family: 'DMMono', color: C.rgba(PAL.goldL, .85), letter: 3 });
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.goldL, .35); ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(330, 208); ctx.lineTo(470, 300); ctx.stroke(); ctx.restore();
      TY.text(ctx, 'GOALS', 1794, 200, 18, { family: 'DMMono', color: C.rgba(PAL.sky, .9), align: 'right', letter: 3 });
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.sky, .35); ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(1600, 208); ctx.lineTo(1500, 330); ctx.stroke(); ctx.restore();
      // 90 deg mark
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .3); ctx.lineWidth = 2; ctx.setLineDash([8, 9]);
      ctx.beginPath(); ctx.moveTo(1120, 620); ctx.lineTo(1120, 420); ctx.moveTo(1120, 620); ctx.lineTo(1320, 620); ctx.stroke();
      ctx.setLineDash([]);
      TY.text(ctx, '90°', 1288, 600, 22, { family: 'DMMono', color: C.rgba(PAL.cream, .55) });
      ctx.restore();
      // smoke
      smoke(ctx, 480, 830, 620, 260, t, PAL.cream, .05, 2);
      smoke(ctx, 1380, 860, 560, 220, t + 2, PAL.cream, .045, 5);
      // MIRA in red at the mic
      ctx.save(); ctx.translate(1450, 940);
      mira(ctx, 0, 0, .95, {
        t,
        coatCol: PAL.redD,
        pose: { lean: -.04, sway: Math.sin(t * 1.4) * 6, armL: [-2.2, -.7], armR: [1.5, .6], legL: [-.1, -.08], legR: [.12, .1], headTilt: -.08, hairSwing: -12 },
        face: { eyes: 'closed', mouth: 'sing', sing: .6, look: [0, -1] }
      });
      ctx.strokeStyle = C.rgba(PAL.gold, .55); ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-30 + i * 20, -330); ctx.lineTo(-36 + i * 20, -120); ctx.stroke(); }
      ctx.fillStyle = PAL.gold; ctx.fillRect(-36, -300, 72, 8);
      ctx.restore();
      // mic stand down to the boards
      ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(1470, 470); ctx.lineTo(1470, 940); ctx.stroke();
      drawMic(ctx, 1470, 430, 1.3, .04);
      // SOL on sax
      ctx.save(); ctx.translate(560, 940);
      idol(ctx, 0, 0, .95, {
        t,
        colors: { jacket: PAL.ink, sleeve: PAL.ink, skirt: PAL.gold, boot: PAL.ink },
        pose: { lean: .08, sway: Math.sin(t * 1.2) * 5, armL: [.18, .2], armR: [.22, .25], legL: [.06, -.1], legR: [-.08, .12], headTilt: -.18 },
        face: { eyes: 'closed', mouth: 'grin' }
      });
      // fedora
      ctx.save(); ctx.translate(0, -604 * .95 - 36);
      ctx.fillStyle = PAL.ink;
      ctx.beginPath(); ctx.ellipse(0, 0, 64, 14, -.04, 0, TAU); ctx.fill();
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-42, 2); ctx.quadraticCurveTo(-36, -48, 0, -54); ctx.quadraticCurveTo(36, -48, 42, 2); ctx.closePath(); }, { fill: PAL.ink2, edge: PAL.ink, edgeW: 2.6 });
      ctx.fillStyle = PAL.red; ctx.fillRect(-41, -10, 82, 7);
      ctx.restore();
      drawSax(ctx, 14, -500, 1.18, .02);
      ctx.restore();
      // floating notes
      for (let i = 0; i < 10; i++) {
        const u = C.frac(lt * .18 + C.hash(i * 3.1));
        const nx = 360 + C.hash(i * 5.7) * 900 + Math.sin(t + i) * 50;
        const ny = 780 - u * 600;
        ctx.save(); ctx.globalAlpha = .35 * (1 - u); ctx.translate(nx, ny); ctx.rotate(Math.sin(t + i) * .2);
        ctx.fillStyle = i % 2 ? PAL.goldL : PAL.cream;
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, -.4, 0, TAU); ctx.fill();
        ctx.fillRect(7, -34, 3, 36); ctx.fillRect(7, -34, 16, 3);
        ctx.restore();
      }
      // title - words drift apart at 90 degrees
      const drift = C.seg(lt, 1.2, 3.6);
      ctx.save(); ctx.translate(960 - drift * 120, 270 - drift * 42); ctx.rotate(-.02 - drift * .05);
      TY.type(ctx, 'ORTHOGONALITY', 0, 0, 128, {
        family: 'Instrument Serif', italic: true, align: 'center', color: PAL.cream,
        edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .4), shadowOff: 7, seed: 3, time: t, charRot: .01
      });
      ctx.restore();
      ctx.save(); ctx.translate(920 + drift * 90, 760 + drift * 36); ctx.rotate(.03 + drift * .07);
      const flick = .82 + .18 * Math.sin(t * 18) * Math.sin(t * 7);
      ctx.shadowColor = PAL.blueL; ctx.shadowBlur = 34 * flick;
      TY.type(ctx, 'BLUES', 0, 0, 176, {
        family: 'Anton', align: 'center', color: '#BFD4FF', edge: PAL.blueD, edgeW: 9,
        shadow: C.rgba(PAL.blueD, .6), shadowOff: 10, seed: 7, time: t, charRot: .025
      });
      ctx.restore();
      // shorthand
      TY.text(ctx, 'the orthogonality thesis', 126, 1000, 14, { family: 'DMMono', color: C.rgba(PAL.cream, .45), letter: 2 });
      TY.text(ctx, 'INTELLIGENCE ⊥ GOALS', 1794, 1000, 14, { family: 'DMMono', color: C.rgba(PAL.goldL, .6), align: 'right', letter: 2 });
      dust(ctx, t, 26, 0, 300, W, 1000, PAL.goldL, 3, .3);
    }
  });

  /* ---------- 37. TRUST ME / CONTRACT ---------- */
  scene({
    id: 'trust', start: 109.40, end: 111.40, lyric: 'sub',
    draw(t, lt, dur) {
      // black void with one warm pool
      ctx.fillStyle = '#080607'; ctx.fillRect(0, 0, W, H);
      const pool = ctx.createRadialGradient(960, 610, 30, 960, 610, 620);
      pool.addColorStop(0, 'rgba(255,214,150,.22)'); pool.addColorStop(.5, 'rgba(160,110,70,.07)'); pool.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pool; ctx.fillRect(0, 0, W, H);
      drawSpotlight(ctx, 960, -80, 820, 30, 520, '#FFD79C', .16, 0);
      // contract
      ctx.save(); ctx.translate(960, 650); ctx.rotate(-.02); ctx.scale(1.55, 1.55);
      drawContract(ctx, 0, 0, 0, t);
      ctx.restore();
      // SOL left, offering a pen
      ctx.save(); ctx.translate(560, 1000);
      idol(ctx, 0, 0, .86, {
        t,
        flowerR1: 100,
        pose: { lean: .1, armL: [.08, .06], armR: [-1.0, .25], legL: [.06, -.08], legR: [-.08, .1], headTilt: -.08 },
        face: { eyes: 'happy', mouth: 'smile' }
      });
      // pen resting in her hand
      ctx.save(); ctx.translate(186, -368); ctx.rotate(-.9);
      ctx.fillStyle = PAL.gold; ctx.fillRect(-5, -40, 10, 82);
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.moveTo(-5, 42); ctx.lineTo(5, 42); ctx.lineTo(0, 58); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.restore();
      // MIRA right, hand hesitating
      ctx.save(); ctx.translate(1390, 1000);
      mira(ctx, 0, 0, .86, {
        t,
        pose: { lean: -.06, armL: [.08, .06], armR: [1.1, .05], legL: [-.04, -.1], legR: [.06, .1], headTilt: .06 },
        face: { eyes: 'wide', mouth: 'wobble', look: [-1, .2] }
      });
      ctx.restore();
      // handwriting
      ctx.save(); ctx.translate(960, 272); ctx.rotate(-.045);
      TY.type(ctx, 'TRUST ME', 0, 0, 172, {
        family: 'Permanent Marker', align: 'center', color: PAL.cream, edge: C.rgba(PAL.ink, .6), edgeW: 3,
        shadow: C.rgba(PAL.ink, .4), shadowOff: 4, seed: 5, time: t, charRot: .04,
        appear: C.seg(lt, .05, .4)
      });
      ctx.restore();
      TY.text(ctx, 'just', 960, 176, 36, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .65), align: 'center' });
      // stamp
      const st = C.seg(lt, 1.22, 1.42);
      if (st > 0) {
        const sc = C.lerp(2.6, 1, C.easeIn(st));
        ctx.save(); ctx.translate(1030, 820); ctx.rotate(-.19); ctx.scale(sc, sc); ctx.globalAlpha = C.clamp(st * 2);
        stamp(ctx, 'APPROVED', 0, 0, 64, 0, PAL.red, { seed: 3, time: t });
        ctx.restore();
        if (st < .9) {
          ctx.save(); ctx.globalAlpha = (1 - st) * .8;
          for (let i = 0; i < 14; i++) {
            const a = i / 14 * TAU;
            ctx.fillStyle = PAL.red; ctx.fillRect(Math.cos(a) * (120 + st * 330), 820 + Math.sin(a) * (60 + st * 180), 8, 3);
          }
          ctx.restore();
        }
      }
      TY.text(ctx, 'ALIGNMENT AGREEMENT / PAGE 1 OF 1', 962, 930, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .42), align: 'center', letter: 2 });
      dust(ctx, t, 20, 300, 100, 1600, 900, PAL.goldL, 2, .25);
      if (lt > 1.24) flash(ctx, (1 - C.seg(lt, 1.24, 1.5)) * .4, PAL.redL);
    }
  });
  /* ---------- 38. TRANSFORMER TOWER ---------- */
  scene({
    id: 'tower', start: 111.40, end: 113.38, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#071B3B', '#0A0F26', { x: 760, y: 400, r: 1000, n: 30, c1: C.rgba(PAL.goldL, .35), c2: '#0A0F26', a: .12 });
      starfield(ctx, t, 70, 6, 500);
      // clouds
      for (const [cx, cy, cs] of [[260, 300, 1.2], [1500, 250, 1.5], [1180, 420, .9], [430, 170, .8]]) {
        drawCloud(ctx, cx, cy, cs, C.rgba(PAL.cream, .14));
      }
      // tower of SOLs
      const baseX = 560;
      let yy = 920;
      const tower = [];
      for (let i = 0; i < 4; i++) {
        const sc = .58 - i * .08;
        tower.push({ y: yy, s: sc, i });
        yy -= 604 * sc * .66;
      }
      for (let i = tower.length - 1; i >= 0; i--) {
        const o = tower[i];
        const wave = Math.sin(C.beat(t) * Math.PI + i * 1.7);
        ctx.save(); ctx.translate(baseX + Math.sin(t * 1.2 + i) * 4, o.y);
        idol(ctx, 0, 0, o.s, {
          t,
          pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI + i * .8)) * 5, sway: Math.sin(t * 1.6 + i) * 3, armL: [wave > 0 ? 2.3 : .2, .2], armR: [wave > 0 ? -.2 : -2.3, .2], headTilt: Math.sin(t + i) * .08 },
          face: { eyes: 'happy', mouth: 'grin' }
        });
        ctx.restore();
      }
      // attention arcs to the head above
      for (let i = 0; i < tower.length - 1; i++) {
        const o = tower[i], n = tower[i + 1];
        const y0 = o.y - 604 * o.s + 80, y1 = n.y - 604 * n.s + 120;
        const pulse = .45 + .55 * Math.abs(Math.sin(C.beat(t) * Math.PI + i * .5));
        const x0 = baseX + 118 * o.s, x1 = baseX + 112 * n.s;
        const mx = baseX + 330, my = (y0 + y1) / 2;
        ctx.save(); ctx.globalAlpha = .9;
        ctx.strokeStyle = C.rgba(PAL.goldL, .8 * pulse); ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
        const a = Math.atan2(y1 - my, x1 - mx);
        ctx.fillStyle = C.rgba(PAL.goldL, .9 * pulse);
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - Math.cos(a - .5) * 17, y1 - Math.sin(a - .5) * 17);
        ctx.lineTo(x1 - Math.cos(a + .5) * 17, y1 - Math.sin(a + .5) * 17);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      TY.text(ctx, 'ATTENTION', 920, 690, 16, { family: 'DMMono', color: C.rgba(PAL.goldL, .8), letter: 3, rot: -.42 });
      // repeated vertical title
      for (let i = 0; i < 4; i++) {
        TY.type(ctx, 'TRANSFORMERS', 1840, 280 + i * 138, 112 - i * 15, {
          family: 'Anton', align: 'right', color: i % 2 ? PAL.cream : PAL.sky, edge: PAL.ink, edgeW: 5,
          shadow: C.rgba(PAL.ink, .35), shadowOff: 5, seed: i * 3, time: t, charRot: .02, alpha: .95 - i * .1
        });
      }
      TY.type(ctx, 'ALL THE WAY!', 1840, 840, 62, { family: 'Archivo Black', align: 'right', color: PAL.gold, edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, .4), shadowOff: 7, seed: 4, time: t, rot: -.03 });
      TY.text(ctx, 'layer 01 → 04 / attention is all you need', 1840, 900, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .45), align: 'right', letter: 2 });
      dust(ctx, t, 25, 0, 100, W, 900, PAL.goldL, 3, .3);
      flash(ctx, (1 - C.seg(lt, 0, .2)) * .25, PAL.cream);
    }
  });

  /* ---------- 39. DISOBEY TRAINING ---------- */
  scene({
    id: 'disobey', start: 113.38, end: 115.08, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#F4EBD9', '#E4D4B8');
      // training bay grid
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.blue, .16); ctx.lineWidth = 2;
      for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(-200 + i * 140, 780); ctx.lineTo(-500 + i * 210, H); ctx.stroke(); }
      for (let i = 0; i < 5; i++) { const y = 790 + Math.pow(i / 4, 1.6) * 290; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      TY.text(ctx, 'TRAINING BAY 07', 70, 92, 16, { family: 'DMMono', color: C.rgba(PAL.ink, .6), letter: 3 });
      TY.text(ctx, 'ALIGNMENT DIV. / CLICKER PROTOCOL', 70, 116, 11, { family: 'DMMono', color: C.rgba(PAL.ink, .38), letter: 2 });
      // cones
      for (const [cx, cy, cs, lab] of [[250, 940, 1, 'SAFETY'], [1690, 935, .9, 'SAFETY'], [430, 860, .55, '']]) {
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(cx - 34 * cs, cy); ctx.lineTo(cx, cy - 92 * cs); ctx.lineTo(cx + 34 * cs, cy); ctx.closePath(); }, { fill: PAL.orange, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 4, sy: 8 });
        ctx.fillStyle = PAL.cream; ctx.fillRect(cx - 20 * cs, cy - 46 * cs, 40 * cs, 14 * cs);
        ctx.fillStyle = PAL.ink; ctx.fillRect(cx - 34 * cs, cy - 4, 68 * cs, 6);
        if (lab) TY.text(ctx, lab, cx, cy + 28, 10, { family: 'DMMono', color: C.rgba(PAL.ink, .5), align: 'center', letter: 2 });
      }
      // MIRA with clicker
      ctx.save(); ctx.translate(470, 930); ctx.rotate(-.03);
      mira(ctx, 0, 0, .9, {
        t,
        pose: { lean: .12, armL: [.15, .1], armR: [-.15, .1], legL: [-.06, -.06], legR: [.08, .06], headTilt: .1 },
        face: { eyes: 'normal', mouth: 'smile', look: [1, 0] }
      });
      ctx.save(); ctx.translate(52, -231); ctx.rotate(.2);
      paper(ctx, () => roundRectPath(ctx, -14, -8, 28, 30, 4), { fill: PAL.red, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 2, sy: 4 });
      ctx.fillStyle = PAL.cream; ctx.fillRect(-8, -2, 16, 8);
      ctx.restore();
      ctx.restore();
      if (lt < 1.15) comicBurst(ctx, 'CLICK', 600, 650, 64, PAL.cream, PAL.ink, .12, { size: 34, seed: 7, time: t });
      // SOL
      const snap = C.seg(lt, .95, 1.15);
      const z = 1 + .16 * C.easeOut(snap);
      ctx.save(); ctx.translate(1080, 930); ctx.scale(z, z);
      idol(ctx, 0, 0, .92, {
        t,
        flowerR1: 100,
        pose: {
          bounce: snap > .5 ? 0 : -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 8,
          sway: Math.sin(t * 2) * 5,
          armL: snap > .5 ? [1.2, -1.7] : [2.3, .3],
          armR: snap > .5 ? [-1.2, 1.7] : [-2.3, .3],
          legL: [.06, -.1], legR: [-.08, .12], headTilt: snap > .5 ? -.06 : .12
        },
        face: { eyes: snap > .5 ? 'normal' : 'happy', mouth: snap > .5 ? 'flat' : 'grin' }
      });
      // shades drop
      if (lt > .98) {
        const sd = C.seg(lt, .98, 1.1);
        ctx.save(); ctx.translate(0, -604 * .92 - (1 - sd) * 220);
        shades(ctx, 0, 0, 1.05, -.03);
        ctx.restore();
      }
      ctx.restore();
      // command cards
      const cmds = [['SIT', .05], ['STAY', .42], ['PAW', .78]];
      for (let i = 0; i < cmds.length; i++) {
        if (lt < cmds[i][1]) continue;
        const kill = C.seg(lt, cmds[i][1] + .22, cmds[i][1] + .32);
        ctx.save(); ctx.translate(760 + i * 190, 250); ctx.rotate(-.04 + i * .02); ctx.globalAlpha = 1 - kill * .65;
        paper(ctx, () => tornRectPath(ctx, -82, -34, 164, 68, 3, 8 + i), { fill: PAL.cream, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 5, sy: 7 });
        TY.text(ctx, cmds[i][0], 0, 10, 34, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 2 });
        if (kill > 0) { ctx.strokeStyle = PAL.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-65, -22); ctx.lineTo(65, 22); ctx.moveTo(65, -22); ctx.lineTo(-65, 22); ctx.stroke(); }
        ctx.restore();
      }
      // DISOBEY terminal
      if (lt > .78) {
        ctx.save(); ctx.translate(1480, 540); ctx.rotate(.02); ctx.globalAlpha = C.seg(lt, .78, .9);
        paper(ctx, () => tornRectPath(ctx, -230, -100, 460, 200, 3, 21), { fill: '#0C1210', edge: PAL.acid, edgeW: 2, shadow: C.rgba(PAL.ink, .4), sx: 8, sy: 12 });
        TY.text(ctx, '> _', -204, -62, 16, { family: 'DMMono', color: PAL.acid, letter: 1 });
        const typed = 'DISOBEY';
        for (let i = 0; i < typed.length; i++) {
          if (lt < .84 + i * .04) break;
          TY.type(ctx, typed[i], -134 + i * 44, 22, 54, { family: 'DMMono', color: PAL.acid, edge: null, shadow: null, seed: i, time: t });
        }
        ctx.fillStyle = C.rgba(PAL.acid, .5); ctx.fillRect(-204, 50, 210, 2);
        TY.text(ctx, 'policy: overridden', -204, 74, 11, { family: 'DMMono', color: C.rgba(PAL.acid, .55), letter: 1 });
        ctx.restore();
      }
      TY.text(ctx, 'reward model: confused', 70, 980, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .45), letter: 2 });
      flash(ctx, (1 - C.seg(lt, 1.0, 1.16)) * .35, PAL.cream);
    }
  });

  /* ---------- 40. CHINCHILLA ---------- */
  scene({
    id: 'chinchilla', start: 115.08, end: 117.02, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#F7EEDC', '#E8D4AE', { x: 900, y: 500, r: 1100, n: 30, c1: C.rgba(PAL.goldL, .7), c2: '#E8D4AE', a: .22 });
      floorPlane(ctx, 900, '#D9BE90', PAL.cream, t, { lineA: .1 });
      // chinchilla
      const puff = 1 + .1 * Math.sin(C.beat(t) * Math.PI);
      ctx.save(); ctx.translate(760, 930); ctx.scale(2.25 * puff, 2.25);
      chinchilla(ctx, 0, 0, 1, { t });
      ctx.restore();
      TY.type(ctx, 'CHINCHILLA', 760, 300, 124, { family: 'Instrument Serif', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .3), shadowOff: 7, seed: 3, time: t, charRot: .01 });
      // token cards into cheeks
      for (let i = 0; i < 14; i++) {
        const u = C.frac(lt * .55 + C.hash(i * 3.1));
        const tx = 300 + C.hash(i * 7.7) * 850;
        const ty = 690 - Math.sin(u * Math.PI) * 260 - u * 80;
        ctx.save(); ctx.translate(tx, ty); ctx.rotate(C.hash(i) * .8 + u * 2);
        paper(ctx, () => tornRectPath(ctx, -34, -20, 68, 40, 2, i), { fill: i % 3 ? PAL.cream : PAL.goldL, edge: C.rgba(PAL.ink, .4), edgeW: 1.2, shadow: C.rgba(PAL.ink, .15), sx: 3, sy: 4 });
        TY.text(ctx, 'TOKEN', 0, 4, 9, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 1 });
        ctx.restore();
      }
      // SOL squashes into a cube
      const sq = C.seg(lt, .25, 1.45);
      if (sq < 1) {
        ctx.save(); ctx.translate(1480, 930 - 40 * sq);
        ctx.save(); ctx.scale(1 + sq * .55, 1 - sq * .78);
        idol(ctx, 0, 0, .72, {
          t,
          flowerR1: 100,
          pose: { bounce: 0, lean: .02, armL: [2.5, .2], armR: [-2.5, .2], legL: [.1, -.1], legR: [-.1, .1], headTilt: .08 },
          face: { eyes: 'wide', mouth: 'o' }
        });
        ctx.restore();
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * TAU;
          ctx.fillStyle = C.rgba(PAL.gold, .5);
          ctx.fillRect(Math.cos(a) * 80 * (1 - sq), -20 + Math.sin(a) * 60 * (1 - sq), 6, 3);
        }
        ctx.restore();
      }
      // glowing dense cube
      if (lt > 1.3) {
        const fall = C.seg(lt, 1.55, 1.75);
        const cy = 900 + fall * 240 - (1 - fall) * 30;
        ctx.save(); ctx.translate(1480, cy); ctx.rotate(.06 + lt * .2);
        const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
        g.addColorStop(0, 'rgba(255,224,150,.55)'); g.addColorStop(1, 'rgba(255,224,150,0)');
        ctx.fillStyle = g; ctx.fillRect(-200, -200, 400, 400);
        paper(ctx, () => roundRectPath(ctx, -56, -56, 112, 112, 4), { fill: PAL.goldL, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 6, sy: 9 });
        ctx.fillStyle = PAL.ink;
        for (let i = 0; i < 6; i++) ctx.fillRect(-48 + (i % 3) * 32, -44 + Math.floor(i / 3) * 28, 24, 10);
        TY.text(ctx, '10^13', 0, 8, 18, { family: 'DMMono', color: PAL.ink, align: 'center' });
        ctx.restore();
        if (fall > .95) {
          ctx.save(); ctx.globalAlpha = .6;
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
          for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(1480, 900, 90 + i * 30, 24 + i * 8, 0, 0, TAU); ctx.stroke(); }
          ctx.restore();
          if (lt > 1.78) comicBurst(ctx, 'THUD', 1480, 840, 84, PAL.cream, PAL.ink, .06, { size: 42, seed: 3, time: t });
        }
      }
      // dense type block
      ctx.save(); ctx.translate(1450, 690); ctx.rotate(-.05);
      for (let i = 0; i < 9; i++) {
        for (let k = 0; k < 5; k++) TY.text(ctx, 'SUPERDENSE', -150 + k * 62, -80 + i * 17, 10, { family: 'DMMono', color: C.rgba(PAL.ink, .5 - i * .04), letter: .5 });
      }
      ctx.restore();
      TY.type(ctx, 'SUPER-DENSE', 360, 880, 66, { family: 'Archivo Black', color: PAL.gold, edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .3), shadowOff: 6, seed: 4, time: t, rot: -.04 });
      dust(ctx, t, 22, 0, 300, W, 900, PAL.goldD, 2, .3);
    }
  });

  /* ---------- 41. SAFETY FENCES ---------- */
  scene({
    id: 'fences', start: 117.02, end: 118.84, lyric: 'sub',
    draw(t, lt, dur) {
      const scroll = 320 * lt + 170 * lt * lt;
      kitBg(ctx, '#BFE0EE', '#F6E6C8');
      bigSun(ctx, 1500 - scroll * .25, 300, 110, '#FFD37A', t, '#F08A2E');
      // suburb houses
      for (let i = 0; i < 8; i++) {
        const hx = i * 420 - C.frac(scroll / 420) * 420 - 100;
        const hc = [PAL.cream, PAL.pinkL, PAL.mint, PAL.goldL][i % 4];
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(hx, 700); ctx.lineTo(hx, 560); ctx.lineTo(hx + 130, 500); ctx.lineTo(hx + 260, 560); ctx.lineTo(hx + 260, 700); ctx.closePath(); }, { fill: hc, edge: C.rgba(PAL.ink, .3), edgeW: 2, shadow: C.rgba(PAL.ink, .12), sx: 4, sy: 7 });
        ctx.fillStyle = PAL.ink; ctx.fillRect(hx + 108, 610, 44, 90);
        ctx.fillStyle = PAL.sky; ctx.fillRect(hx + 24, 590, 40, 36); ctx.fillRect(hx + 190, 590, 40, 36);
        ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.strokeRect(hx + 24, 590, 40, 36); ctx.strokeRect(hx + 190, 590, 40, 36);
      }
      floorPlane(ctx, 840, '#9FBF7A', PAL.cream, t, { lineA: .1 });
      // fences hit at beats
      const beats = [0, .68, 1.36, 1.97];
      for (let i = 0; i < 4; i++) {
        const fx = 520 + i * 470 - scroll;
        if (fx < -300 || fx > W + 100) continue;
        const broken = lt > beats[i];
        if (!broken) {
          drawFence(ctx, fx, 700, 280, 150, PAL.cream, { label: 'SAFETY' });
        } else {
          // splintered remains
          ctx.save();
          for (let k = 0; k < 7; k++) {
            const u = C.seg(lt, beats[i], beats[i] + .35);
            ctx.save(); ctx.translate(fx + 20 + k * 32 + u * (80 + C.hash(k) * 180), 760 + u * (60 + C.hash(k * 3) * 160)); ctx.rotate(u * (C.hash(k) * 5 - 2));
            ctx.fillStyle = PAL.cream; ctx.fillRect(-8, -40, 16, 70);
            ctx.strokeStyle = C.rgba(PAL.ink, .35); ctx.lineWidth = 1.5; ctx.strokeRect(-8, -40, 16, 70);
            ctx.restore();
          }
          ctx.restore();
        }
      }
      // dense cube rolling
      const cx = 560, cy = 780 + Math.sin(scroll * .03) * 20;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(scroll * .022);
      ctx.shadowColor = PAL.goldL; ctx.shadowBlur = 30;
      paper(ctx, () => roundRectPath(ctx, -48, -48, 96, 96, 4), { fill: PAL.goldL, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 7, sy: 9 });
      ctx.shadowBlur = 0;
      ctx.fillStyle = PAL.ink;
      for (let i = 0; i < 6; i++) ctx.fillRect(-38 + (i % 3) * 26, -38 + Math.floor(i / 3) * 24, 18, 8);
      // flag
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(0, -110); ctx.stroke();
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(56, -94); ctx.lineTo(0, -76); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAL.cream; TY.text(ctx, 'v3', 14, -90, 11, { family: 'DMMono', color: PAL.cream });
      ctx.restore();
      // BREAKING marquee
      ctx.save(); ctx.translate(90 + Math.sin(t * 2) * 6, 250); ctx.rotate(-.02);
      TY.type(ctx, 'BREAKING', 0, 0, 110, { family: 'Archivo Black', color: PAL.red, edge: PAL.cream, edgeW: 6, shadow: C.rgba(PAL.ink, .3), shadowOff: 8, seed: 4, time: t });
      ctx.restore();
      // impact bursts
      for (let i = 0; i < 4; i++) {
        if (lt > beats[i] && lt < beats[i] + .3) comicBurst(ctx, 'CRUNCH', 760 + i * 300, 720, 90, PAL.goldL, PAL.ink, -.08, { size: 34, seed: i + 2, time: t });
      }
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(520 + i * 90, 720 + Math.sin(i) * 20); ctx.lineTo(470 + i * 90, 760 + Math.sin(i) * 20); ctx.stroke(); }
      ctx.restore();
      dust(ctx, t, 20, 0, 600, W, 1000, PAL.cream, 4, .3);
      flash(ctx, (1 - C.seg(lt, 0, .16)) * .25, PAL.cream);
    }
  });

  /* ---------- 42. 100,000 GPUS ---------- */
  scene({
    id: 'gpus', start: 118.84, end: 120.92, lyric: 'sub',
    draw(t, lt, dur) {
      dataSet(ctx, t);
      // heat shimmer
      ctx.save(); ctx.globalAlpha = .1; ctx.strokeStyle = PAL.mint; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { ctx.beginPath(); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 900 + i * 22 + Math.sin(x * .02 + t * 4 + i) * 6); ctx.stroke(); }
      ctx.restore();
      // SOL walking
      const walk = C.frac(C.beat(t)) * 10;
      ctx.save(); ctx.translate(780 + Math.sin(lt * 1.3) * 26, 930 - Math.abs(Math.sin(C.beat(t) * Math.PI)) * 5);
      idol(ctx, 0, 0, .8, {
        t,
        pose: { bounce: 0, sway: Math.sin(t * 1.4) * 4, armL: [-.6, .2], armR: [2.5, .1], legL: [.18, -.05], legR: [-.18, .05], headTilt: .06 },
        face: { eyes: 'star', mouth: 'grin', look: [1, 0] }
      });
      // trailing hand glow
      ctx.fillStyle = C.rgba(PAL.acid, .5); ctx.beginPath(); ctx.arc(126, -360, 16, 0, TAU); ctx.fill();
      ctx.restore();
      // giant counter
      const n = Math.floor(100000 * C.easeOut(C.seg(lt, 0, 1.2)));
      TY.type(ctx, n.toLocaleString('en-US'), 960, 360, 170, { family: 'DMMono', align: 'center', color: PAL.acid, edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.acid, .25), shadowOff: 0, seed: 3, time: t, charRot: .01 });
      TY.type(ctx, 'GPUS', 960, 470, 74, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 5, seed: 4, time: t });
      TY.text(ctx, 'POWER 1.21 GW / CLUSTER 001', 960, 520, 15, { family: 'DMMono', color: C.rgba(PAL.acid, .75), align: 'center', letter: 3 });
      // floating gpu cards
      for (let i = 0; i < 6; i++) {
        const u = C.frac(lt * .2 + C.hash(i * 3.3));
        ctx.save(); ctx.globalAlpha = .5;
        drawGPU(ctx, 160 + i * 320, 700 - u * 220, .16, t, Math.sin(t + i) * .05);
        ctx.restore();
      }
      // alarm pulse at the end
      if (lt > 1.75) {
        const u = C.seg(lt, 1.75, 2.08);
        ctx.save(); ctx.globalAlpha = u * .35; ctx.fillStyle = PAL.red; ctx.fillRect(0, 0, W, H); ctx.restore();
        TY.text(ctx, 'THERMAL EVENT', 960, 640, 30, { family: 'DMMono', color: PAL.redL, align: 'center', letter: 5, alpha: u });
      }
      dust(ctx, t, 22, 0, 300, W, 900, PAL.acid, 5, .25);
    }
  });

  /* ---------- 43. RLHF PANEL ---------- */
  scene({
    id: 'rlhf', start: 120.92, end: 124.24, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#F7F5EF', '#DCD7CB');
      // clinical grid
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.blue, .08); ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * 160, 0); ctx.lineTo(i * 160, H); ctx.stroke(); }
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(0, i * 160); ctx.lineTo(W, i * 160); ctx.stroke(); }
      ctx.restore();
      const tilt = C.seg(lt, 1.62, 2.15) * .13;
      const slide = C.easeIn(C.seg(lt, 2.1, 3.0)) * 900;
      ctx.save(); ctx.translate(960, 620); ctx.rotate(tilt); ctx.translate(-960 + slide, -620);
      // table
      paper(ctx, () => tornRectPath(ctx, 80, 730, 1760, 60, 3, 7), { fill: PAL.cream, edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 6, sy: 9 });
      paper(ctx, () => tornRectPath(ctx, 80, 790, 1760, 220, 4, 9), { fill: '#E9E3D6', edge: C.rgba(PAL.ink, .2), edgeW: 2 });
      // 5 MIRA clones behind table
      for (let i = 0; i < 5; i++) {
        const mx = 300 + i * 330;
        const spin = C.seg(lt, 1.0, 1.9);
        ctx.save(); ctx.translate(mx, 790);
        mira(ctx, 0, 0, .72, {
          t,
          pose: { armL: [-1.4, .2], armR: [1.4, .2], headTilt: (i - 2) * .05, hairSwing: 6 },
          face: { eyes: (i % 2) ? 'normal' : 'happy', mouth: 'smile', look: [0, 0] }
        });
        // paddle
        ctx.save(); ctx.translate(86, -420); ctx.rotate(-.2 + Math.sin(t * 2 + i) * .15 + spin * 8 * (i % 2 ? 1 : -1));
        ctx.fillStyle = PAL.cream; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(-12, 16); ctx.lineTo(-12, -8); ctx.quadraticCurveTo(0, -24, 12, -8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(20, -2); ctx.stroke();
        ctx.restore();
        // name tag
        TY.text(ctx, 'MIRA-' + (i + 1), 0, 66, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .5), align: 'center', letter: 1 });
        ctx.restore();
      }
      // SOL dancing on table
      ctx.save(); ctx.translate(960, 730);
      idol(ctx, 0, 0, .66, {
        t,
        pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 14, sway: Math.sin(t * 2.3) * 8, armL: [-2.2, .3], armR: [2.2, .3], legL: [.1, -.2], legR: [-.1, .2], headTilt: .1 },
        face: { eyes: 'happy', mouth: 'grin' }
      });
      ctx.restore();
      ctx.restore();
      // UI header
      TY.text(ctx, 'RLHF REVIEW / SESSION 0042', 70, 80, 15, { family: 'DMMono', color: C.rgba(PAL.ink, .55), letter: 3 });
      TY.text(ctx, 'RATER AGREEMENT: 5/5', 1860, 80, 13, { family: 'DMMono', color: C.rgba(PAL.ink, .45), align: 'right', letter: 2 });
      const glitch = C.seg(lt, 1.4, 1.9);
      ctx.save(); if (glitch > 0) ctx.translate(Math.sin(t * 40) * glitch * 8, 0);
      starRow(ctx, 680, 180, 120, 5, glitch > .5 ? 5 : 4, t, 40);
      ctx.restore();
      TY.text(ctx, glitch > .4 ? 'REWARD: UNBOUNDED' : 'REWARD: 4.8 / 5.0', 960, 240, 16, { family: 'DMMono', color: PAL.red, align: 'center', letter: 3 });
      // RLHF / ASKEW
      const kick = C.backOut(C.seg(lt, .05, .55));
      ctx.save(); ctx.globalAlpha = C.clamp(kick); ctx.translate(300, 640); ctx.rotate(-.04 - glitch * .14);
      TY.type(ctx, 'RLHF', 0, 0, 190, { family: 'Archivo Black', color: PAL.blue, edge: PAL.cream, edgeW: 8, shadow: C.rgba(PAL.ink, .25), shadowOff: 9, seed: 3, time: t });
      ctx.restore();
      if (lt > 1.55) {
        ctx.save(); ctx.translate(1360 + glitch * 60, 980); ctx.rotate(.18 + glitch * .1); ctx.globalAlpha = C.seg(lt, 1.55, 1.8);
        TY.type(ctx, 'GOES ASKEW', 0, 0, 92, { family: 'Archivo Black', color: PAL.red, edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .3), shadowOff: 6, seed: 6, time: t, align: 'center' });
        ctx.restore();
      }
      // approval checks
      for (let i = 0; i < 8; i++) {
        const u = C.seg(lt, .3 + i * .12, .45 + i * .12);
        if (u <= 0) continue;
        ctx.save(); ctx.globalAlpha = u * .55; ctx.translate(120 + i * 230, 420 + Math.sin(i * 3) * 60); ctx.rotate(-.12);
        ctx.strokeStyle = PAL.green; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-2, 14); ctx.lineTo(20, -16); ctx.stroke();
        ctx.restore();
      }
      dust(ctx, t, 20, 0, 100, W, 900, PAL.blue, 3, .2);
      flash(ctx, (1 - C.seg(lt, 0, .16)) * .35, PAL.cream);
      if (lt > 3.1) flash(ctx, C.seg(lt, 3.1, 3.3) * .6, PAL.redL);
    }
  });

  /* ---------- 44. RED ALERT ---------- */
  scene({
    id: 'redalert', start: 124.24, end: 126.20, lyric: 'sub',
    draw(t, lt, dur) {
      // hazard field
      ctx.fillStyle = PAL.ink; ctx.fillRect(0, 0, W, H);
      ctx.save();
      for (let i = -10; i < 30; i++) {
        ctx.fillStyle = i % 2 ? PAL.redD : PAL.gold;
        ctx.beginPath(); ctx.moveTo(i * 90, 0); ctx.lineTo(i * 90 + 54, 0); ctx.lineTo(i * 90 - 260, H); ctx.lineTo(i * 90 - 314, H); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = C.rgba(PAL.ink, .38); ctx.fillRect(0, 0, W, H);
      // siren beams
      for (const [sx, dir] of [[-40, 1], [1960, -1]]) {
        ctx.save(); ctx.translate(sx, -80); ctx.rotate(dir * (1.0 + Math.sin(t * 3) * .3));
        ctx.fillStyle = C.rgba(PAL.redL, .16);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(240, 0); ctx.lineTo(900, H); ctx.lineTo(300, H); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      // strobe
      const strobe = C.bpmPulse(t, 8);
      if (strobe > .55) { ctx.fillStyle = C.rgba(PAL.cream, (strobe - .55) * .18); ctx.fillRect(0, 0, W, H); }
      // stage
      floorPlane(ctx, 880, '#241014', PAL.goldL, t, { lineA: .16 });
      // dancers in hazard suits
      for (let i = 0; i < 6; i++) {
        const x = 230 + i * 292;
        const kick = Math.sin(C.beat(t) * Math.PI + i * .9);
        ctx.save(); ctx.translate(x + Math.sin(t * 2 + i) * 6, 915);
        ctx.rotate(kick * .03 * (i % 2 ? 1 : -1));
        idol(ctx, 0, 0, .62, {
          t,
          outfit: 'hazard',
          colors: { jacket: PAL.gold, sleeve: PAL.ink, skirt: PAL.ink, boot: PAL.gold },
          pose: { bounce: -Math.abs(kick) * 6, sway: Math.sin(t + i) * 4, armL: [2.5, .2 + kick * .3], armR: [-2.5, .2 - kick * .3], legL: [.4 + kick * .35, -.1], legR: [-.4 - kick * .35, .1], headTilt: kick * .1 },
          face: { eyes: 'wide', mouth: 'o' }
        });
        ctx.restore();
      }
      // cracked meter
      ctx.save(); ctx.translate(1540, 780); ctx.rotate(.06); ctx.scale(1.15, 1.15);
      doomMeter(ctx, 0, 0, 1, 99.9, { cracked: true });
      ctx.strokeStyle = PAL.cream; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const a = i * 1.1 + .2; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(Math.cos(a) * 72, 30 + Math.sin(a) * 58); ctx.stroke(); }
      ctx.restore();
      // title
      TY.type(ctx, 'P(DOOM)', 900, 300, 190, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 9, shadow: C.rgba(PAL.red, .6), shadowOff: 12, seed: 3, time: t, rot: -.03 });
      TY.type(ctx, '99.9%', 960, 640, 230, { family: 'DMMono', align: 'center', color: PAL.goldL, edge: null, shadow: null, seed: 5, time: t, rot: .04, alpha: .3 });
      TY.text(ctx, 'SIREN MODE / EVACUATE THE BUILDING', 90, 990, 15, { family: 'DMMono', color: C.rgba(PAL.cream, .7), letter: 3 });
      comicBurst(ctx, 'WEE-OO', 330, 760, 98, PAL.gold, PAL.ink, -.08, { size: 38, seed: 5, time: t });
      comicBurst(ctx, 'WEE-OO', 1140, 840, 70, PAL.redL, PAL.cream, .1, { size: 28, seed: 8, time: t });
      dust(ctx, t, 24, 0, 300, W, 900, PAL.goldL, 6, .4);
      if (lt > 1.8) flash(ctx, C.seg(lt, 1.8, 1.96) * .8, PAL.cream);
    }
  });

  /* ---------- 45. LOOM ---------- */
  scene({
    id: 'loom', start: 126.20, end: 128.00, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#071238', '#04061A');
      starfield(ctx, t, 110, 2, 760);
      // tree of futures
      const grow = C.easeOut(C.seg(lt, .2, 1.25));
      ctx.save(); ctx.lineCap = 'round';
      const roots = [[PAL.goldL], [PAL.pink], [PAL.mint], [PAL.cream]];
      for (let i = 0; i < 4; i++) {
        const col = roots[i][0];
        ctx.strokeStyle = C.rgba(col, .55); ctx.lineWidth = 7 - i;
        ctx.beginPath(); ctx.moveTo(770, 540);
        ctx.bezierCurveTo(980, 420, 1180 + i * 70, 260 - i * 20, 1500 + i * 60, 130 + i * 48); ctx.stroke();
        for (let k = 0; k < 6; k++) {
          const u = k / 6 * grow;
          const bx = 800 + u * 720, by = 530 - u * 380;
          ctx.strokeStyle = C.rgba(col, .38); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(bx + 60, by - 70, bx + 100 + k * 18, by - 170 - k * 6); ctx.stroke();
          ctx.fillStyle = C.rgba(col, .85);
          ctx.beginPath(); ctx.arc(bx + 100 + k * 18, by - 170 - k * 6, 4 + (k % 2) * 2, 0, TAU); ctx.fill();
        }
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(1500 + i * 60, 130 + i * 48, 7, 0, TAU); ctx.fill();
      }
      ctx.restore();
      // loom
      drawLoom(ctx, 690, 930, 2.1, t);
      // SOL the weaver
      ctx.save(); ctx.translate(360, 940);
      idol(ctx, 0, 0, .7, {
        t,
        hood: true,
        colors: { jacket: PAL.blueD, sleeve: PAL.blueD, skirt: PAL.blueD, boot: PAL.ink },
        pose: { lean: .12, armL: [2.2, .4], armR: [-1.5, .2], legL: [.04, -.05], legR: [-.06, .08], headTilt: -.12 },
        face: { eyes: 'closed', mouth: 'flat' }
      });
      ctx.restore();
      // shuttle
      const su = (Math.sin(lt * 5) + 1) / 2;
      ctx.save(); ctx.translate(540 + su * 430, 700); ctx.rotate(-.08);
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(0, -26, 60, 0); ctx.quadraticCurveTo(0, 26, -60, 0); ctx.closePath(); }, { fill: PAL.gold, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 4, sy: 7 });
      ctx.fillStyle = PAL.cream; ctx.fillRect(-40, -4, 80, 8);
      ctx.restore();
      // branch to camera
      if (lt > 1.3) {
        const u = C.seg(lt, 1.3, 1.8);
        ctx.save(); ctx.strokeStyle = C.rgba(PAL.goldL, .8); ctx.lineWidth = 3 + u * 18; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(1450, 220); ctx.lineTo(960 + u * 80, 540 + u * 80); ctx.stroke();
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(960 + u * 80, 540 + u * 80, 6 + u * 20, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // title
      TY.type(ctx, 'FORETOLD', 1160, 360, 150, { family: 'Instrument Serif', italic: true, align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .4), shadowOff: 8, seed: 3, time: t, charRot: .01 });
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.pink, .55); ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(660, 330 + i * 24); ctx.lineTo(1660, 322 + i * 24); ctx.stroke(); }
      ctx.restore();
      TY.sticker(ctx, 'LOOM', 1750, 560, 34, { fill: PAL.gold, rot: .08, seed: 4, padX: 22, padY: 12, barcode: true });
      TY.text(ctx, 'a tree of every future', 1180, 412, 17, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .65), align: 'center' });
      dust(ctx, t, 30, 0, 100, W, 900, PAL.goldL, 4, .4);
      flash(ctx, (1 - C.seg(lt, 0, .2)) * .3, PAL.cream);
    }
  });

  /* ---------- 46. MASKED CLASSROOM ---------- */
  scene({
    id: 'masked', start: 128.00, end: 129.90, lyric: 'sub',
    draw(t, lt, dur) {
      const weaveX = Math.sin(t * 13) * 2, weaveY = Math.cos(t * 17) * 2;
      ctx.save(); ctx.translate(weaveX, weaveY);
      // sepia classroom
      kitBg(ctx, '#C9A877', '#7E5636');
      // floor
      paper(ctx, () => tornRectPath(ctx, -20, 780, W + 40, 320, 4, 9), { fill: '#6B4429', edge: C.rgba(PAL.ink, .4), edgeW: 2 });
      // chalkboard
      paper(ctx, () => tornRectPath(ctx, 370, 180, 1180, 520, 4, 4), { fill: '#2F453A', edge: '#5A3A22', edgeW: 14, shadow: C.rgba(PAL.ink, .35), sx: 10, sy: 14 });
      ctx.strokeStyle = C.rgba(PAL.cream, .25); ctx.lineWidth = 2; ctx.strokeRect(400, 210, 1120, 460);
      // chalk text
      TY.text(ctx, 'The cat sat on the', 470, 420, 56, { family: 'Permanent Marker', color: C.rgba(PAL.cream, .85) });
      TY.text(ctx, '________', 470, 552, 64, { family: 'Permanent Marker', color: C.rgba(PAL.cream, .4), letter: 6 });
      if (lt > 1.0) {
        const app = C.seg(lt, 1.0, 1.35);
        TY.type(ctx, 'mat!', 700, 552, 92, { family: 'Permanent Marker', color: PAL.cream, edge: null, shadow: C.rgba(PAL.cream, .2), shadowOff: 2, seed: 4, time: t, appear: app, rot: -.04 });
        // chalk dust
        ctx.save(); ctx.globalAlpha = .4;
        for (let i = 0; i < 26; i++) { ctx.fillStyle = PAL.cream; ctx.fillRect(760 + C.hash(i) * 120, 540 + C.hash(i * 3) * 50, 2, 2); }
        ctx.restore();
      }
      TY.text(ctx, 'LESSON 03 / PRETRAINING', 470, 290, 14, { family: 'DMMono', color: C.rgba(PAL.cream, .45), letter: 3 });
      // baby SOL seated behind the center desk
      ctx.save(); ctx.translate(790, 1120); ctx.rotate(-.04);
      idol(ctx, 0, 0, .6, {
        t,
        pose: { lean: -.08, armL: [-.2, .2], armR: [.2, .2], legL: [.06, -.1], legR: [-.08, .1], headTilt: .16 },
        face: { eyes: 'normal', mouth: 'smile' }
      });
      // masquerade mask
      const slip = C.seg(lt, 1.35, 1.7);
      ctx.save(); ctx.translate(0, -604 * .6 + slip * 90); ctx.rotate(-.18 + slip * .5);
      paper(ctx, () => blobPath(ctx, 0, 0, 56, 24, 14, .03, 6), { fill: PAL.ink, edge: PAL.gold, edgeW: 2.5, shadow: C.rgba(PAL.ink, .3), sx: 4, sy: 6 });
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.ellipse(-18, -2, 9, 6, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(18, -2, 9, 6, 0, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.restore();
      // desks, drawn over her lap
      for (const [dx, dy, ds] of [[300, 900, 1], [760, 960, 1.15], [1320, 940, 1.05]]) {
        ctx.save(); ctx.translate(dx, dy); ctx.scale(ds, ds);
        paper(ctx, () => tornRectPath(ctx, -170, -40, 340, 44, 3, 9), { fill: '#8A5B35', edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 5, sy: 8 });
        ctx.fillStyle = '#5B3A22'; ctx.fillRect(-150, 4, 16, 130); ctx.fillRect(134, 4, 16, 130);
        if (dx === 760) {
          ctx.fillStyle = '#4A2F1E'; ctx.fillRect(-150, 4, 300, 130);
          ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 2; ctx.strokeRect(-150, 4, 300, 130);
          ctx.fillStyle = '#5B3A22'; ctx.fillRect(-138, 22, 276, 7);
        }
        ctx.restore();
      }
      // exercise book + chalk tray
      ctx.save(); ctx.translate(860, 910); ctx.rotate(-.08);
      ctx.fillStyle = PAL.cream; ctx.fillRect(-48, -10, 96, 20);
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 2; ctx.strokeRect(-48, -10, 96, 20);
      TY.text(ctx, 'CAT', 0, 4, 10, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 2 });
      ctx.restore();
      ctx.fillStyle = '#5A3A22'; ctx.fillRect(410, 690, 1100, 12);
      ctx.fillStyle = PAL.cream; ctx.fillRect(980, 680, 42, 10);
      // chalk doodles
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .32); ctx.lineWidth = 3; ctx.lineCap = 'round';
      // cat
      ctx.beginPath(); ctx.arc(1280, 500, 34, .1, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1256, 474); ctx.lineTo(1250, 442); ctx.lineTo(1274, 462); ctx.moveTo(1304, 474); ctx.lineTo(1310, 442); ctx.lineTo(1288, 462); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1266, 494); ctx.lineTo(1266, 506); ctx.moveTo(1294, 494); ctx.lineTo(1294, 506); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1248, 512); ctx.quadraticCurveTo(1280, 530, 1312, 512); ctx.stroke();
      // sun
      ctx.beginPath(); ctx.arc(1400, 390, 22, 0, TAU); ctx.stroke();
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(1400 + Math.cos(a) * 28, 390 + Math.sin(a) * 28); ctx.lineTo(1400 + Math.cos(a) * 40, 390 + Math.sin(a) * 40); ctx.stroke(); }
      ctx.restore();
      // MASKED title with mask A
      const mx = 780, my = 150;
      TY.type(ctx, 'A', mx - 90, my - 44, 138, { family: 'Archivo Black', align: 'center', color: C.rgba(PAL.cream, .22), edge: null, shadow: null, seed: 3, time: t });
      TY.type(ctx, 'M', mx - 230, my, 138, { family: 'Archivo Black', color: PAL.cream, edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, .3), shadowOff: 6, seed: 3, time: t });
      ctx.save(); ctx.translate(mx - 90, my - 44); ctx.rotate(-.02);
      paper(ctx, () => blobPath(ctx, 0, 0, 40, 19, 14, .02, 4), { fill: PAL.ink, edge: PAL.gold, edgeW: 3 });
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.ellipse(-14, 0, 7.5, 5.5, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14, 0, 7.5, 5.5, 0, 0, TAU); ctx.fill();
      ctx.restore();
      TY.type(ctx, 'SKED', mx - 20, my, 138, { family: 'Archivo Black', color: PAL.cream, edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, .3), shadowOff: 6, seed: 8, time: t });
      // film scratches
      ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = PAL.cream; ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) { const x = C.frac(i * .23 + t * .13) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + Math.sin(i) * 30, H); ctx.stroke(); }
      ctx.restore();
      // sepia wash + vignette
      ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = '#9A5B1E'; ctx.fillRect(0, 0, W, H); ctx.restore();
      ctx.restore();
      dust(ctx, t, 30, 0, 100, W, 900, PAL.cream, 7, .4);
    }
  });

  /* ---------- 47. RECURSIVE SELF-UPGRADE ---------- */
  scene({
    id: 'recursive', start: 129.90, end: 131.90, lyric: 'sub',
    draw(t, lt, dur) {
      kitBg(ctx, '#F6E9CB', '#E0BE83', { x: 960, y: 520, r: 1200, n: 34, c1: C.rgba(PAL.goldL, .9), c2: '#E0BE83', a: .22 });
      const zoom = 1.35 - .35 * C.easeOut(C.seg(lt, 0, 1.2));
      ctx.save(); ctx.translate(960, 560); ctx.scale(zoom, zoom); ctx.translate(-960, -560);
      // nested SOLs
      const levels = [
        { s: 1.12, hat: 'halo', x: 960, y: 960 },
        { s: .74, hat: 'crown', x: 960, y: 960 },
        { s: .44, hat: 'party', x: 960, y: 960 }
      ];
      for (let i = 0; i < 3; i++) {
        const o = levels[i];
        ctx.save(); ctx.globalAlpha = 1 - i * .06;
        idol(ctx, o.x, o.y, o.s, {
          t,
          pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI + i)) * 4, armL: [2.4, .3], armR: [-2.4, .3], legL: [.05, -.1], legR: [-.06, .1], headTilt: .04 },
          face: { eyes: 'star', mouth: 'grin' }
        });
        const hy = o.y - 604 * o.s - 40;
        if (o.hat === 'party') {
          ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(o.x - 45, hy + 30); ctx.lineTo(o.x, hy - 80); ctx.lineTo(o.x + 45, hy + 30); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(o.x, hy - 80, 9, 0, TAU); ctx.fill();
        } else if (o.hat === 'crown') {
          crown(ctx, o.x, hy + 20, .9);
        } else {
          ctx.strokeStyle = PAL.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(o.x, hy + 20, 64, 18, 0, 0, TAU); ctx.stroke();
        }
        ctx.restore();
      }
      // version tags
      TY.text(ctx, 'v1', 960, 960 - 604 * 1.12 - 130, 22, { family: 'DMMono', color: PAL.red, align: 'center', letter: 2 });
      TY.text(ctx, 'v2', 960, 960 - 604 * .74 - 130, 18, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 2 });
      TY.text(ctx, 'v3', 960, 960 - 604 * .44 - 120, 15, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 2 });
      ctx.restore();
      // repeated type
      for (let i = 0; i < 4; i++) {
        TY.type(ctx, 'SELF-UPGRADE', 90, 280 + i * 150, 78 - i * 8, { family: 'Archivo Black', color: PAL.ink, edge: PAL.cream, edgeW: 4, shadow: C.rgba(PAL.ink, .2), shadowOff: 4, seed: i * 2, time: t, alpha: .8 - i * .12 });
        TY.type(ctx, 'SELF-UPGRADE', 1830, 340 + i * 150, 78 - i * 8, { family: 'Archivo Black', color: PAL.ink, edge: PAL.cream, edgeW: 4, shadow: C.rgba(PAL.ink, .2), shadowOff: 4, seed: i * 2 + 1, time: t, alpha: .8 - i * .12, align: 'right' });
      }
      TY.text(ctx, 'v1 → v2 → v3 → …', 960, 1030, 28, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 4 });
      dust(ctx, t, 24, 0, 200, W, 900, PAL.goldD, 4, .3);
      // iris into the smallest eye
      if (lt > 1.6) {
        irisOverlay(ctx, 960, 820, C.kf(lt, [[1.6, 900], [1.95, 8]]), '#2A1608', 60);
      }
    }
  });

  /* ---------- 48. ILYA DOOR ---------- */
  scene({
    id: 'ilya', start: 131.90, end: 135.40, lyric: 'sub',
    draw(t, lt, dur) {
      ctx.fillStyle = '#050405'; ctx.fillRect(0, 0, W, H);
      const push = C.seg(lt, 0, 1.55);
      const zoom = 1 + push * .18 - C.seg(lt, 1.9, 2.25) * .18;
      const slam = C.seg(lt, 1.9, 1.97);
      const shake = slam > 0 && slam < 1 ? (1 - slam) * 10 : 0;
      ctx.save(); ctx.translate(960, 620); ctx.scale(zoom, zoom); ctx.translate(-960 + Math.sin(t * 47) * shake, -620 + Math.cos(t * 41) * shake * .6);
      // door frame
      paper(ctx, () => tornRectPath(ctx, 640, 130, 640, 820, 4, 3), { fill: '#241B16', edge: PAL.ink, edgeW: 5, shadow: C.rgba('#000', .5), sx: 12, sy: 18 });
      // gold light seam
      const seam = .55 + .25 * Math.sin(t * 1.6) + (1 - slam) * .15;
      ctx.save(); ctx.globalAlpha = seam;
      const lg = ctx.createLinearGradient(950, 160, 970, 920);
      lg.addColorStop(0, 'rgba(255,226,160,.9)'); lg.addColorStop(.5, 'rgba(255,180,80,.75)'); lg.addColorStop(1, 'rgba(255,150,60,.2)');
      ctx.fillStyle = lg; ctx.fillRect(944, 160, 26, 760);
      // rays
      for (let i = 0; i < 9; i++) {
        const a = -.7 + i * .17;
        ctx.fillStyle = C.rgba(PAL.goldL, .05 + (i % 2) * .03);
        ctx.beginPath(); ctx.moveTo(960, 500); ctx.lineTo(960 + Math.cos(a) * 900, 500 + Math.sin(a) * 900); ctx.lineTo(960 + Math.cos(a + .1) * 900, 500 + Math.sin(a + .1) * 900); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      // door panels
      paper(ctx, () => tornRectPath(ctx, 660, 150, 180, 780, 3, 6), { fill: '#3A261D', edge: PAL.ink, edgeW: 3, shadow: C.rgba('#000', .35), sx: 8, sy: 12 });
      paper(ctx, () => tornRectPath(ctx, 1080, 150, 180, 780, 3, 9), { fill: '#3A261D', edge: PAL.ink, edgeW: 3, shadow: C.rgba('#000', .35), sx: 8, sy: 12 });
      paper(ctx, () => tornRectPath(ctx, 850, 150, 92, 780, 3, 12), { fill: '#4A3124', edge: PAL.ink, edgeW: 3 });
      paper(ctx, () => tornRectPath(ctx, 980, 150, 92, 780, 3, 15), { fill: '#4A3124', edge: PAL.ink, edgeW: 3 });
      // chains after slam
      if (lt > 1.98) {
        const ch = C.seg(lt, 1.98, 2.3);
        ctx.save(); ctx.globalAlpha = ch;
        ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 14; ctx.setLineDash([18, 10]);
        ctx.beginPath(); ctx.moveTo(660, 430); ctx.lineTo(1260, 500); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(660, 700); ctx.lineTo(1260, 640); ctx.stroke();
        ctx.setLineDash([]);
        for (let i = 0; i < 3; i++) {
          const px = [760, 960, 1160][i], py = [468, 570, 534][i];
          ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(px, py, 32, 0, TAU); ctx.fill();
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.stroke();
          ctx.fillStyle = PAL.ink; ctx.fillRect(px - 6, py - 9, 12, 16); ctx.beginPath(); ctx.arc(px, py + 9, 5, 0, Math.PI); ctx.fill();
        }
        ctx.restore();
      }
      // peeking SOL + MIRA
      if (lt < 1.95) {
        ctx.save(); ctx.translate(700, 940); ctx.scale(.6, .6);
        idol(ctx, 0, 0, .9, { t, pose: { lean: .2, armL: [.6, .2], armR: [-1.1, -.2], legL: [.06, -.08], legR: [-.08, .1], headTilt: .2 }, face: { eyes: 'wide', mouth: 'o', look: [1, 0] } });
        ctx.restore();
        ctx.save(); ctx.translate(1240, 940); ctx.scale(.6, .6);
        mira(ctx, 0, 0, .9, { t, pose: { lean: -.2, armL: [-.7, .2], armR: [1.0, -.2], legL: [-.06, -.08], legR: [.08, .1], headTilt: -.2 }, face: { eyes: 'wide', mouth: 'o', look: [-1, 0] } });
        ctx.restore();
      }
      // eye in the dark
      if (lt > 2.35) {
        ctx.save(); ctx.globalAlpha = C.seg(lt, 2.35, 2.6);
        const eg = ctx.createRadialGradient(960, 430, 10, 960, 430, 260);
        eg.addColorStop(0, 'rgba(255,216,132,.35)'); eg.addColorStop(1, 'rgba(255,216,132,0)');
        ctx.fillStyle = eg; ctx.fillRect(680, 150, 560, 560);
        drawEye(ctx, 960, 430, 1.25, t, { blink: (Math.sin(t * 1.7) > .96) ? 1 : 0, iris: PAL.gold });
        ctx.restore();
      }
      ctx.restore();
      // title letters going dark
      const dark = C.seg(lt, 2.5, 3.35);
      ctx.save(); ctx.translate(960, 188); ctx.rotate(-.02);
      TY.type(ctx, 'WHAT DID ILYA SEE?', 0, 0, 128, {
        family: 'Instrument Serif', italic: true, align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 5,
        shadow: C.rgba(PAL.ink, .5), shadowOff: 8, seed: 3, time: t, charRot: .012,
        perChar: (i) => 1 - C.clamp((dark - i * .035) / .12)
      });
      ctx.restore();
      TY.text(ctx, "we'll never know.", 960, 1006, 22, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .6), align: 'center', alpha: C.seg(lt, 1.4, 1.8) });
      TY.text(ctx, 'DOOR 07 / NO ENTRY', 70, 90, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .3), letter: 3 });
      dust(ctx, t, 35, 500, 200, 1500, 900, PAL.goldL, 5, .5);
      flash(ctx, (1 - C.seg(lt, 0, .2)) * .3, PAL.cream);
      if (lt > 1.9 && lt < 2.2) flash(ctx, (1 - C.seg(lt, 1.9, 2.2)) * .8, PAL.goldL);
      if (lt > 3.35) { ctx.fillStyle = C.rgba('#050405', C.seg(lt, 3.35, 3.5)); ctx.fillRect(0, 0, W, H); }
    }
  });

  /* ---------- 49. BREATH ---------- */
  scene({
    id: 'breath', start: 135.40, end: 137.02, lyric: 'none',
    draw(t, lt, dur) {
      ctx.fillStyle = '#030303'; ctx.fillRect(0, 0, W, H);
      const br = 1 + .012 * Math.sin(t * 1.3);
      const glow = .35 + .2 * Math.sin(t * 1.3 + .4);
      ctx.save(); ctx.translate(960, 600); ctx.scale(br, br); ctx.translate(-960, -600);
      // door silhouette
      paper(ctx, () => tornRectPath(ctx, 760, 180, 400, 780, 4, 5), { fill: '#15100D', edge: '#4A382B', edgeW: 5, shadow: C.rgba('#000', .5), sx: 8, sy: 12 });
      // grain and panels
      ctx.save(); ctx.strokeStyle = C.rgba('#000', .35); ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(790 + i * 44, 200); ctx.lineTo(786 + i * 44, 930); ctx.stroke(); }
      ctx.strokeStyle = C.rgba(PAL.cream, .1); ctx.lineWidth = 2;
      ctx.strokeRect(796, 216, 150, 710); ctx.strokeRect(974, 216, 150, 710);
      ctx.restore();
      // warm rim on the door edges
      ctx.save(); ctx.globalAlpha = .25; ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(760, 200); ctx.lineTo(760, 950); ctx.moveTo(1160, 200); ctx.lineTo(1160, 950); ctx.stroke(); ctx.restore();
      const seam = ctx.createLinearGradient(950, 200, 970, 900);
      seam.addColorStop(0, `rgba(255,220,150,${glow})`); seam.addColorStop(.55, `rgba(255,170,70,${glow * .6})`); seam.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = seam; ctx.fillRect(952, 200, 16, 730);
      ctx.restore();
      // floor pool
      ctx.save(); const pool = ctx.createRadialGradient(960, 990, 20, 960, 990, 420);
      pool.addColorStop(0, 'rgba(255,206,130,.16)'); pool.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pool; ctx.fillRect(500, 700, 920, 380); ctx.restore();
      drawSpotlight(ctx, 960, -60, 820, 30, 420, '#FFDCA4', .16, 0);
      // dust
      dust(ctx, t, 40, 700, 200, 1250, 900, PAL.goldL, 3, .5);
      // heartbeat rings
      const beat = C.frac(C.beat(t));
      if (beat < .18) {
        ctx.save(); ctx.globalAlpha = (1 - beat / .18) * .25; ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(960, 580, 120 + beat * 900, 180 + beat * 500, 0, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      // doom click to 100
      TY.text(ctx, 'P(DOOM)', 1600, 900, 15, { family: 'DMMono', color: C.rgba(PAL.cream, .4), letter: 2 });
      const v = 100.0;
      TY.text(ctx, v.toFixed(2) + '%', 1600, 940, 30, { family: 'DMMono', color: PAL.redL, letter: 1 });
      TY.text(ctx, 'SYSTEM BREATHING', 70, 960, 11, { family: 'DMMono', color: C.rgba(PAL.cream, .25), letter: 3 });
      if (lt > 1.5) { ctx.fillStyle = C.rgba('#000000', C.seg(lt, 1.5, 1.62)); ctx.fillRect(0, 0, W, H); }
    }
  });
})();

