/* ============================================================
   CLAUDE POP - ACT III  (73.80 - 95.20)
   the chair / backprop classroom / obsolete museum /
   canyon turn / no-CDR sky / Gato cliff
   ============================================================ */
(() => {
  const PET = {
    daisy: FLOWERS.daisy, poppy: FLOWERS.poppy, tulip: FLOWERS.tulip,
    corn: FLOWERS.corn, mari: FLOWERS.mari
  };

  function dustMotes(ctx, t, n, x0, y0, x1, y1, col = PAL.cream, seed = 0) {
    ctx.save();
    for (let i = 0; i < n; i++) {
      const px = x0 + C.frac(C.hash(i * 3.7 + seed) + t * (.012 + C.hash(i * 2.1) * .03)) * (x1 - x0);
      const py = y0 + C.frac(C.hash(i * 7.3 + seed) + t * (.01 + C.hash(i * 5.9) * .018)) * (y1 - y0);
      ctx.globalAlpha = .1 + C.hash(i * 9.1) * .26;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(px, py, .8 + C.hash(i * 11.3) * 2.4, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function puff(ctx, x, y, r, col = PAL.cream, a = .55) {
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 5; i++) {
      const ang = i / 5 * TAU + .3;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x + Math.cos(ang) * r * .55, y + Math.sin(ang) * r * .34, r * (.42 + C.hash(i + x) * .34), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function spark(ctx, x, y, r, t, seed = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 + seed);
    ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU, rr = r * (.55 + C.hash(i + seed) * .55);
      ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.stroke();
    ctx.strokeStyle = PAL.cream; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
  }

  /* ---------- 27. THE CHAIR ---------- */
  function miraBack(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // shoes
    ctx.fillStyle = PAL.ink;
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * 26, -4); ctx.rotate(sx * .12);
      ctx.beginPath(); ctx.ellipse(0, 0, 19, 7, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    // slouched coat body
    const coat = () => {
      ctx.beginPath();
      ctx.moveTo(-62, -342);
      ctx.quadraticCurveTo(-100, -300, -92, -210);
      ctx.quadraticCurveTo(-86, -150, -54, -142);
      ctx.lineTo(54, -142);
      ctx.quadraticCurveTo(88, -154, 94, -218);
      ctx.quadraticCurveTo(100, -305, 62, -342);
      ctx.quadraticCurveTo(0, -366, -62, -342);
      ctx.closePath();
    };
    paper(ctx, coat, { fill: PAL.cream, edge: C.rgba(PAL.ink, .55), edgeW: 2.4, shadow: C.rgba(PAL.ink, .18), sx: 7, sy: 10 });
    // back seam and folds
    ctx.strokeStyle = C.rgba(PAL.ink, .22); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, -348); ctx.quadraticCurveTo(6, -260, 0, -148); ctx.stroke();
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sx * 42, -330); ctx.quadraticCurveTo(sx * 64, -250, sx * 46, -160); ctx.stroke();
    }
    // hanging arms
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.translate(sx * 78, -312); ctx.rotate(sx * .16);
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-13, 0); ctx.quadraticCurveTo(-18, 70, -11, 138); ctx.lineTo(10, 138);
        ctx.quadraticCurveTo(15, 68, 13, 0); ctx.closePath();
      }, { fill: PAL.cream, edge: C.rgba(PAL.ink, .48), edgeW: 2, shadow: C.rgba(PAL.ink, .14), sx: 3, sy: 6 });
      ctx.fillStyle = '#E7BF9C'; ctx.beginPath(); ctx.ellipse(0, 151, 10, 14, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // lanyard
    ctx.strokeStyle = PAL.blue; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-25, -352); ctx.quadraticCurveTo(0, -300, 25, -352); ctx.stroke();
    paper(ctx, () => roundRectPath(ctx, -30, -292, 60, 78, 3), { fill: PAL.paper2, edge: PAL.ink, edgeW: 1.4 });
    TY.text(ctx, 'MIRA', 0, -260, 12, { family: 'Archivo Black', color: PAL.ink, align: 'center' });
    TY.text(ctx, 'ALIGNMENT', 0, -242, 7, { family: 'DMMono', color: PAL.red, align: 'center', letter: .5 });
    // head, bowed
    ctx.save(); ctx.translate(-6, -396); ctx.rotate(-.13);
    ctx.fillStyle = '#E9C2A0';
    ctx.beginPath(); ctx.ellipse(0, 0, 47, 55, 0, 0, TAU); ctx.fill();
    paper(ctx, () => {
      ctx.beginPath();
      ctx.arc(0, -8, 54, Math.PI * .02, Math.PI * .98, true);
      ctx.quadraticCurveTo(52, 4, 50, 24);
      ctx.quadraticCurveTo(38, 8, 0, 12);
      ctx.quadraticCurveTo(-38, 8, -50, 24);
      ctx.quadraticCurveTo(-52, 4, -54, -8);
      ctx.closePath();
    }, { fill: PAL.ink, edge: null });
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.ellipse(0, 6, 48, 44, 0, .05 * Math.PI, .95 * Math.PI); ctx.fill();
    // hair sheen
    ctx.strokeStyle = C.rgba(PAL.cream, .18); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-8, -4, 36, .8 * Math.PI, 1.4 * Math.PI); ctx.stroke();
    // ear
    ctx.fillStyle = '#D9AE8B'; ctx.beginPath(); ctx.ellipse(45, 4, 7, 11, .2, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function foldingChair(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    shadowEllipse(ctx, 0, 2, 118, 21, .24);
    // rear legs
    ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sx * 64, -154); ctx.lineTo(sx * 108, 0); ctx.stroke();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx * 64, -154); ctx.lineTo(sx * 108, 0); ctx.stroke();
      ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 8;
    }
    // seat
    paper(ctx, () => tornRectPath(ctx, -98, -180, 196, 36, 2, 4), {
      fill: '#A9361D', edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .28), sx: 4, sy: 8
    });
    // uprights
    for (const sx of [-1, 1]) {
      ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(sx * 74, 2); ctx.lineTo(sx * 67, -312); ctx.stroke();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx * 74, 2); ctx.lineTo(sx * 67, -312); ctx.stroke();
    }
    // backrest
    paper(ctx, () => tornRectPath(ctx, -96, -324, 192, 154, 2.5, 8), {
      fill: '#B84322', edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .28), sx: 5, sy: 9
    });
    // vent slots
    ctx.fillStyle = C.rgba(PAL.ink, .26);
    for (let i = 0; i < 4; i++) ctx.fillRect(-62, -300 + i * 28, 124, 7);
    // stencil
    TY.text(ctx, 'SAFETY', 0, -218, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .72), align: 'center', letter: 3 });
    // hinge brads
    for (const sx of [-1, 1]) {
      ctx.fillStyle = PAL.silver; ctx.beginPath(); ctx.arc(sx * 66, -162, 6, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.stroke();
    }
    ctx.restore();
  }

  scene({
    id: 'chair', start: 73.80, end: 74.46, lyric: 'none',
    draw(t, lt) {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#ED6E33'); bg.addColorStop(.58, '#DF5529'); bg.addColorStop(1, '#BC3D1D');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      sunburst(ctx, 1140, 240, 0, 1500, 22, C.rgba('#FFD39A', .16), C.rgba('#ED6E33', 0), .025);
      // light shaft
      ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = '#FFE5B8';
      ctx.beginPath(); ctx.moveTo(1120, -50); ctx.lineTo(1260, -50); ctx.lineTo(830, 880); ctx.lineTo(430, 880); ctx.closePath(); ctx.fill();
      ctx.restore();
      // floor
      ctx.fillStyle = '#A8361C'; ctx.fillRect(0, 844, W, H - 844);
      paper(ctx, () => tornRectPath(ctx, -40, 826, W + 80, 34, 5, 12), { fill: '#E8B27A', edge: null, shadow: C.rgba(PAL.ink, .2), sx: 0, sy: 7 });
      ctx.strokeStyle = C.rgba(PAL.ink, .22); ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) { const x = 80 + i * 165; ctx.beginPath(); ctx.moveTo(x, 896); ctx.lineTo(x - 46, H); ctx.stroke(); }
      // wall ephemera
      ctx.save(); ctx.translate(300, 188); ctx.rotate(-.03);
      TY.type(ctx, 'MUST NOT', 0, 0, 45, { family: 'DMMono', color: C.rgba(PAL.ink, .3), edge: null, shadow: null, seed: 4 });
      TY.type(ctx, 'RUN AWAY', 0, 62, 45, { family: 'DMMono', color: C.rgba(PAL.ink, .3), edge: null, shadow: null, seed: 9 });
      ctx.restore();
      ctx.save(); ctx.translate(1560, 150); ctx.rotate(.04);
      paper(ctx, () => tornRectPath(ctx, -128, -82, 256, 164, 3, 33), { fill: C.rgba(PAL.cream, .72), edge: null, shadow: C.rgba(PAL.ink, .15), sx: 5, sy: 8 });
      TY.text(ctx, 'SESSION 042', -108, -52, 13, { family: 'DMMono', color: PAL.red, letter: 1 });
      TY.text(ctx, 'ALIGNMENT REVIEW', -108, -28, 17, { family: 'Archivo Black', color: PAL.ink });
      for (let i = 0; i < 4; i++) { ctx.fillStyle = C.rgba(PAL.ink, .16); ctx.fillRect(-108, -4 + i * 16, 190, 2); }
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(62, 4); ctx.lineTo(112, 52); ctx.moveTo(112, 4); ctx.lineTo(62, 52); ctx.stroke();
      ctx.restore();
      // chair and Mira from behind
      const ease = C.seg(lt, 0, .66);
      const z = 1.03 - .03 * ease;
      setCam(930, 560, z, 0, 0, t);
      beginCam(ctx);
      miraBack(ctx, 636, 838, .82, t);
      foldingChair(ctx, 640, 846, 1.02, -.035);
      // notation tag on the floor
      ctx.save(); ctx.translate(480, 916); ctx.rotate(-.06);
      paper(ctx, () => tornRectPath(ctx, -74, -22, 148, 44, 2, 42), { fill: PAL.acid, edge: PAL.ink, edgeW: 1.5, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 5 });
      TY.text(ctx, 'NEXT: DATACENTER', 0, 5, 11, { family: 'DMMono', color: PAL.ink, align: 'center', letter: .5 });
      ctx.restore();
      endCam(ctx);

      // poster type
      TY.type(ctx, "I MUSTN'T", 810, 236, 94, {
        family: 'DMMono', color: PAL.cream, edge: PAL.ink, edgeW: 7,
        shadow: C.rgba(PAL.ink, .36), shadowOff: 9, seed: 5, time: t, charRot: .01,
        perChar: (i) => C.clamp((t - 73.84 - i * .018) / .22)
      });
      TY.type(ctx, 'RUN AWAY', 810, 336, 94, {
        family: 'DMMono', color: PAL.ink, edge: PAL.cream, edgeW: 7,
        shadow: C.rgba(PAL.ink, .28), shadowOff: 9, seed: 11, time: t, charRot: .01,
        perChar: (i) => C.clamp((t - 73.9 - i * .012) / .14)
      });
      TY.text(ctx, 'get in the datacenter, mira', 816, 404, 19, { family: 'DMMono', color: C.rgba(PAL.cream, .9), letter: .4 });
      ctx.fillStyle = PAL.acid; ctx.fillRect(816, 418, 238, 3);
      // timer
      TY.text(ctx, '00:00:00 / 18', 816, 462, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .55), letter: 1 });
      TY.text(ctx, 'REC', 1740, 70, 15, { family: 'DMMono', color: PAL.cream, letter: 2 });
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(1770, 65, 7, 0, TAU); ctx.fill();
      flash(ctx, (1 - C.seg(lt, 0, .22)) * .35, PAL.cream);
    }
  });

  /* ---------- 28. BACKPROP CLASSROOM ---------- */
  const LAYER_COL = [PAL.gold, PAL.pink, PAL.blue];
  const LAYER_FLOWER = [PET.daisy, PET.poppy, PET.tulip];

  function chalkNetwork(ctx, pulse, word) {
    // miniature diagram chalked onto the board
    const cols = [1220, 1430, 1640];
    const rows = [164, 258, 352];
    const nodes = [];
    ctx.strokeStyle = 'rgba(246,238,220,.5)'; ctx.lineWidth = 3;
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) {
      nodes.push([c, r]);
      ctx.beginPath(); ctx.arc(cols[c], rows[r], 21, 0, TAU); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(232,69,42,.82)'; ctx.lineWidth = 2.2;
    for (let c = 0; c < 2; c++) for (let r = 0; r < 3; r++) for (let r2 = 0; r2 < 3; r2++) {
      ctx.beginPath(); ctx.moveTo(cols[c] + 20, rows[r]); ctx.lineTo(cols[c + 1] - 20, rows[r2]); ctx.stroke();
    }
    // pulse dots
    for (let c = 0; c < 2; c++) for (let r = 0; r < 3; r++) for (let r2 = 0; r2 < 3; r2++) {
      const a = [cols[c] + 20, rows[r]], b = [cols[c + 1] - 20, rows[r2]];
      const x = C.lerp(a[0], b[0], pulse), y = C.lerp(a[1], b[1], pulse);
      ctx.fillStyle = PAL.acid; ctx.beginPath(); ctx.arc(x, y, 4.4, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(246,238,220,.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1220, 396); ctx.lineTo(1640, 396); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1640, 396); ctx.lineTo(1628, 390); ctx.moveTo(1640, 396); ctx.lineTo(1628, 402); ctx.stroke();
    TY.text(ctx, 'x', 1196, 402, 18, { family: 'Instrument Serif', color: 'rgba(246,238,220,.8)' });
    TY.text(ctx, 'y', 1660, 402, 18, { family: 'Instrument Serif', color: 'rgba(246,238,220,.8)' });
    for (let i = 0; i < 3; i++) TY.text(ctx, ['INPUT', 'HIDDEN', 'OUTPUT'][i], cols[i], 424, 11, { family: 'DMMono', color: 'rgba(246,238,220,.55)', align: 'center', letter: 1.3 });
    TY.text(ctx, word, 180, 440, 19, { family: 'DMMono', color: PAL.acid, letter: 2 });
  }

  scene({
    id: 'mlp', start: 74.46, end: 77.60, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#EFE4CC', '#DDCBB0', { x: 960, y: 420, r: 1500, n: 30, c1: '#FFF8E8', c2: '#DDCBB0', rot: .01, a: .35 });
      // back wall panels
      ctx.strokeStyle = C.rgba(PAL.ink, .1); ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(i * 280, 0); ctx.lineTo(i * 280, 540); ctx.stroke(); }
      // blackboard
      setCam(960, 520, 1.02, 0, 0, t);
      beginCam(ctx);
      paper(ctx, () => tornRectPath(ctx, 84, 46, 1752, 468, 4, 15), {
        fill: '#233A30', edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 10, sy: 14
      });
      // wooden frame
      ctx.strokeStyle = PAL.ochre; ctx.lineWidth = 10; ctx.strokeRect(98, 62, 1722, 436);
      ctx.strokeStyle = C.rgba(PAL.cream, .1); ctx.lineWidth = 2; ctx.strokeRect(108, 72, 1702, 416);
      // chalk dust
      halftone(ctx, 110, 70, 1690, 420, PAL.cream, 17, .5, .05, .5);
      TY.text(ctx, 'BACKPROP LAB / SECTION 4.2', 160, 120, 18, { family: 'DMMono', color: 'rgba(246,238,220,.65)', letter: 2 });
      TY.text(ctx, 'y = sigma(W2 sigma(W1 x + b1) + b2)', 160, 406, 23, { family: 'DMMono', color: 'rgba(246,238,220,.5)', letter: .4 });
      TY.text(ctx, 'dL/dW', 1660, 118, 20, { family: 'DMMono', color: 'rgba(246,238,220,.4)' });

      // travelling wave
      let wave, dir;
      if (lt < 1.45) { wave = C.seg(lt, .12, 1.4); dir = 1; }
      else if (lt < 2.55) { wave = 1 - C.seg(lt, 1.55, 2.55); dir = -1; }
      else {
        const u = C.frac((lt - 2.55) / .34);
        wave = u < .5 ? u * 2 : 2 - u * 2;
        dir = u < .5 ? 1 : -1;
      }
      const word = lt < 1.55 ? 'FORWARD ->' : lt < 2.55 ? '<- BACKWARD' : 'REPEAT REPEAT';
      chalkNetwork(ctx, C.clamp(wave), lt < 1.55 ? 'FORWARD PASS' : lt < 2.55 ? 'BACKWARD PASS' : 'LOOP');

      TY.type(ctx, lt < 1.55 ? 'FORWARD' : lt < 2.55 ? 'BACKWARD' : 'FORWARD', 158, 318, 92, {
        family: 'DMMono', color: lt < 2.55 ? PAL.cream : PAL.acid,
        edge: C.rgba('#0D1C16', .5), edgeW: 4, shadow: C.rgba('#000', .22), shadowOff: 6,
        seed: 7, time: t, charRot: .008,
        perChar: (i) => C.clamp((t - (lt < 1.55 ? 74.5 : lt < 2.55 ? 76.24 : 76.78) - i * .018) / .24)
      });
      // loop arrow under the word
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .65); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(190, 366); ctx.lineTo(470, 366); ctx.quadraticCurveTo(540, 366, 540, 330); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(540, 330); ctx.lineTo(550, 350); ctx.moveTo(540, 330); ctx.lineTo(520, 336); ctx.stroke();
      ctx.restore();
      if (lt > 2.3) {
        ctx.save(); ctx.translate(690, 180); ctx.rotate(-.12);
        TY.sticker(ctx, 'REPEAT', 0, 0, 34, { fill: PAL.acid, rot: 0, seed: 9, tape: true, barcode: true });
        ctx.restore();
      }
      // wall clock / lecture notes
      ctx.save(); ctx.translate(1770, 320); ctx.rotate(.08);
      paper(ctx, () => tornRectPath(ctx, -46, -70, 92, 140, 2, 27), { fill: PAL.cream, edge: C.rgba(PAL.ink, .4), edgeW: 1.5, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
      TY.text(ctx, 'LOSS', 0, -42, 12, { family: 'DMMono', color: PAL.red, align: 'center', letter: 1 });
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-30, -28); ctx.lineTo(-4, -12); ctx.lineTo(-14, 2); ctx.lineTo(20, 22); ctx.lineTo(32, 38); ctx.stroke();
      ctx.restore();

      // floor
      floorPlane(ctx, 612, '#CDB78F', PAL.cream, t, { lineA: .1, vx: 960 });
      // chalk rail
      paper(ctx, () => tornRectPath(ctx, 112, 510, 1698, 24, 3, 16), { fill: '#A77A4C', edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 0, sy: 6 });
      // nine dancers, arranged as three visible network layers
      const groups = [430, 960, 1490];
      const gx = [-158, 0, 158];
      const nodes = [];
      for (let c = 0; c < 3; c++) {
        nodes[c] = [];
        for (let r = 0; r < 3; r++) {
          const x = groups[c] + gx[r];
          nodes[c][r] = [x, 1000 - 250 * .42];
        }
      }
      const qpoint = (a, b, u) => {
        const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 + 30;
        const v = 1 - u;
        return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]];
      };
      ctx.save(); ctx.lineCap = 'round';
      for (let c = 0; c < 2; c++) for (let r = 0; r < 3; r++) for (let r2 = 0; r2 < 3; r2++) {
        const a = nodes[c][r], b = nodes[c + 1][r2];
        ctx.strokeStyle = 'rgba(179,30,24,.76)'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]);
        ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30, b[0], b[1]); ctx.stroke();
        if (wave > -.04 && wave < 1.04) {
          const p = qpoint(a, b, C.clamp(wave));
          ctx.save(); ctx.shadowColor = PAL.goldL; ctx.shadowBlur = 18;
          ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(p[0], p[1], 6.2, 0, TAU); ctx.fill();
          ctx.restore();
        }
      }
      for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) {
        ctx.fillStyle = PAL.redD; ctx.beginPath(); ctx.arc(nodes[c][r][0], nodes[c][r][1], 4.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAL.cream; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();

      // layer labels
      for (let c = 0; c < 3; c++) {
        ctx.save(); ctx.translate(groups[c], 600); ctx.rotate(c === 1 ? .02 : -.02);
        TY.sticker(ctx, ['INPUT', 'HIDDEN', 'OUTPUT'][c], 0, 0, 16, {
          fill: c === 1 ? PAL.pinkL : PAL.cream, text: PAL.ink, rot: 0, seed: 20 + c, padX: 14, padY: 8, tape: true, barcode: false
        });
        TY.text(ctx, ['x', 'h = sigma(Wx+b)', 'y'][c], 0, 44, 13, { family: 'DMMono', color: C.rgba(PAL.ink, .6), align: 'center', letter: .6 });
        ctx.restore();
      }
      // petal dancers are the nodes
      for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) {
        const x = groups[c] + gx[r];
        const act = Math.exp(-Math.pow((wave - c / 2) * 3.7, 2));
        const bp = C.beat(t) + r * .09 + c * .06;
        const jump = act * (12 + 14 * Math.abs(Math.sin(bp * Math.PI)));
        const sc = .4 + (r === 1 ? .035 : 0);
        idol(ctx, x, 1000 - jump, sc, {
          t,
          pose: {
            bounce: 0, sway: -dir * act * 6 + Math.sin(bp * Math.PI) * 2,
            lean: dir * act * .14,
            armL: [-.4 - act * 1.1, -.18 + act * .35],
            armR: [.4 + act * 1.1, .18 - act * .35],
            legL: [-.04, -.02], legR: [.04, .02],
            headTilt: -dir * act * .12, hairSwing: -dir * act * 10
          },
          face: { eyes: act > .35 ? 'happy' : 'open', mouth: act > .35 ? 'sing' : 'smile', blush: .55, look: [0, -.1] },
          flower: LAYER_FLOWER[c], petals: 13,
          colors: { jacket: LAYER_COL[c], sleeve: PAL.cream, skirt: c === 1 ? PAL.pinkD : PAL.blue, boot: PAL.blueD },
          outfit: 'stage', halo: act > .5 ? act * .9 : 0, shadow: .65
        });
      }

      // MIRA conducts from the front corner
      const cb = C.beat(t);
      const armAng = 2.35 + Math.sin(cb * Math.PI) * .28;
      mira(ctx, 1810, 1040, .48, {
        t,
        pose: {
          bounce: -Math.abs(Math.sin(cb * Math.PI)) * 6, lean: -.06,
          armL: [-.85, -.2], armR: [armAng, .18], headTilt: -.04
        },
        face: { eyes: 'happy', mouth: 'grin', blush: .5, look: [-.5, -.2] }
      });
      // baton
      const wx = 1810 + 38 * .48 + Math.sin(armAng) * 170 * .48;
      const wy = 1040 - 448 * .48 + Math.cos(armAng) * 170 * .48;
      ctx.save(); ctx.strokeStyle = PAL.cream; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 48, wy - 40); ctx.stroke();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
      // podium
      paper(ctx, () => tornRectPath(ctx, 1712, 986, 190, 46, 3, 19), { fill: PAL.paper2, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 5, sy: 8 });
      TY.text(ctx, 'PROF. MIRA / 08', 1807, 1016, 10, { family: 'DMMono', color: PAL.ink, align: 'center', letter: .7 });

      // dust + chalk specs
      dustMotes(ctx, t, 32, 120, 100, 1780, 520, PAL.cream, 8);
      endCam(ctx);
      flash(ctx, (1 - C.seg(lt, 0, .2)) * .22, PAL.cream);
      if (lt > 2.95) irisOverlay(ctx, 960, 540, C.kf(lt, [[2.95, 1280], [3.14, 20]]), '#120C08', 60);
    }
  });

  /* ---------- 29. VON NEUMANN MUSEUM ---------- */
  function drawEniac(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    shadowEllipse(ctx, 0, 6, 320, 32, .28);
    // base rail
    paper(ctx, () => tornRectPath(ctx, -306, -28, 612, 34, 3, 5), { fill: '#2B2823', edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 6 });
    for (let b = 0; b < 3; b++) {
      const bx = -286 + b * 194;
      paper(ctx, () => tornRectPath(ctx, bx, -514, 184, 490, 2.5, 23 + b), {
        fill: b === 1 ? '#43423A' : '#393831', edge: PAL.ink, edgeW: 2.6, shadow: C.rgba(PAL.ink, .25), sx: 5, sy: 9
      });
      // inner panel
      paper(ctx, () => tornRectPath(ctx, bx + 14, -492, 156, 318, 1.5, 41 + b), { fill: '#2A2A25', edge: C.rgba(PAL.cream, .2), edgeW: 1.2 });
      // tube rows
      for (let ry = 0; ry < 5; ry++) for (let rx = 0; rx < 5; rx++) {
        const tx = bx + 38 + rx * 27, ty = -456 + ry * 46;
        const glow = .35 + .65 * Math.max(0, Math.sin(t * 4 + rx * 1.7 + ry * .8 + b));
        ctx.save(); ctx.shadowColor = C.rgba(PAL.goldL, .7); ctx.shadowBlur = 12 * glow;
        ctx.fillStyle = C.rgba(PAL.goldL, .22 + .5 * glow);
        ctx.beginPath(); ctx.ellipse(tx, ty, 8, 14, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = C.rgba(PAL.ink, .7); ctx.fillRect(tx - 7, ty - 17, 14, 4);
        ctx.restore();
      }
      // dials / switches
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? PAL.redD : PAL.gold;
        ctx.beginPath(); ctx.arc(bx + 38 + i * 25, -128, 5.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1; ctx.stroke();
      }
      // tape reels on top bay
      if (b === 2) {
        for (let i = 0; i < 2; i++) {
          const cx = bx + 48 + i * 84, cy = -470;
          ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(cx, cy, 27, 0, TAU); ctx.fill();
          ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(cx, cy, 21, 0, TAU); ctx.fill();
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
          for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + t * .2 * (i ? 1 : -1); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 19, cy + Math.sin(a) * 19); ctx.stroke(); }
          ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, TAU); ctx.fill();
        }
      }
      // stenciled number
      TY.text(ctx, '0' + (b + 1), bx + 92, -58, 14, { family: 'DMMono', color: C.rgba(PAL.cream, .45), align: 'center', letter: 2 });
    }
    // cable loops
    ctx.strokeStyle = '#191714'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(-280 + i * 130, -22);
      ctx.bezierCurveTo(-260 + i * 130, 40, -210 + i * 130, 28, -206 + i * 130, -24); ctx.stroke();
    }
    // top sign
    paper(ctx, () => tornRectPath(ctx, -130, -562, 260, 34, 2, 9), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 5 });
    TY.text(ctx, 'ENIAC MK. I / 1945', 0, -541, 11, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 1 });
    ctx.restore();
  }

  function statue(ctx, x, y, s, t) {
    ctx.save();
    // aureole
    ctx.save(); ctx.globalAlpha = .55; ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
    for (let i = 0; i < 26; i++) {
      const a = i / 26 * TAU;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 168 * s, y - 348 * s + Math.sin(a) * 168 * s);
      ctx.lineTo(x + Math.cos(a) * 192 * s, y - 348 * s + Math.sin(a) * 192 * s); ctx.stroke();
    }
    ctx.restore();
    idol(ctx, x, y, s, {
      t: 70,
      pose: { armL: [-.55, -.12], armR: [2.08, .18], legL: [-.06, -.02], legR: [.06, .02], headTilt: .03 },
      face: { eyes: 'closed', mouth: 'smile', blush: 0 },
      flower: { petal: '#EDE2C9', petal2: '#D8C8A8', tip: PAL.goldL, center: PAL.gold, hair: '#D8C8A8' },
      colors: { jacket: '#E9DCC2', sleeve: '#F5ECD9', skirt: '#D9CAB0', boot: '#CBBB9E', skin: '#E6CDB0', hair: '#D8C8A8' },
      outfit: 'stage', halo: 0, shadow: .3
    });
    // gold rim light
    ctx.save(); ctx.globalAlpha = .55; ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x - 28 * s, y - 600 * s, 82 * s, 1.15 * Math.PI, 1.92 * Math.PI); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  scene({
    id: 'museum', start: 77.60, end: 81.24, lyric: 'sub',
    draw(t, lt) {
      const z = C.lerp(1.02, 1.09, C.seg(lt, 0, 3.64));
      setCam(C.lerp(960, 1030, C.seg(lt, 0, 3.64)), 560, z, 0, lt > 2.3 && lt < 2.65 ? 7 : 0, t);
      beginCam(ctx);
      // wall
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#A98560'); bg.addColorStop(.55, '#8D6B4B'); bg.addColorStop(1, '#5A3F2D');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // arches
      for (let i = 0; i < 3; i++) {
        const ax = 320 + i * 640;
        ctx.save(); ctx.fillStyle = i === 1 ? '#7B5A3D' : '#6D4E34';
        ctx.beginPath(); ctx.moveTo(ax - 175, 560); ctx.lineTo(ax - 175, 250); ctx.arc(ax, 250, 175, Math.PI, 0); ctx.lineTo(ax + 175, 560); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = C.rgba(PAL.cream, .2); ctx.lineWidth = 5; ctx.stroke();
        ctx.restore();
      }
      // wall panels / frames
      ctx.strokeStyle = C.rgba(PAL.cream, .13); ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) ctx.strokeRect(170 + i * 360, 120, 240, 150);
      TY.text(ctx, 'THE PAPER COMPUTING MUSEUM', 960, 92, 26, { family: 'Archivo Black', color: PAL.cream, align: 'center', letter: 6 });
      TY.text(ctx, 'HALL OF ARCHITECTURES / ROOM 03', 960, 118, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .55), align: 'center', letter: 2 });
      // wainscot + floor
      ctx.fillStyle = '#4A3425'; ctx.fillRect(0, 720, W, 130);
      ctx.strokeStyle = C.rgba(PAL.cream, .16); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 724); ctx.lineTo(W, 724); ctx.stroke();
      floorPlane(ctx, 842, '#3C2C22', PAL.cream, t, { lineA: .1 });

      // old machine
      drawEniac(ctx, 470, 790, 1.04, t);
      // sparks
      if (lt < 2.15) {
        for (let i = 0; i < 3; i++) {
          const st = .25 + i * .62;
          if (lt > st && lt < st + .28) spark(ctx, 250 + C.hash(i * 5.1) * 440, 330 + C.hash(i * 3.3) * 240, 40 + Math.sin(lt * 20) * 14, t, i);
        }
        // smoke
        ctx.save(); ctx.globalAlpha = .18;
        for (let i = 0; i < 4; i++) puff(ctx, 620 + Math.sin(t + i) * 16, 300 - ((t * 36 + i * 40) % 150), 30 + i * 8, '#CFC2AD', .5);
        ctx.restore();
      }

      // velvet rope
      for (const rx of [152, 842]) {
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(rx, 966); ctx.lineTo(rx, 854); ctx.stroke();
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(rx, 848, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = PAL.ink; ctx.fillRect(rx - 24, 962, 48, 10);
      }
      ctx.strokeStyle = PAL.redD; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(152, 858); ctx.quadraticCurveTo(497, 930, 842, 858); ctx.stroke();
      ctx.strokeStyle = C.rgba(PAL.redL, .5); ctx.lineWidth = 2; ctx.stroke();

      // guide petal
      idol(ctx, 960, 1000, .56, {
        t,
        pose: { armL: [-.3, -.1], armR: [1.95, -.18], headTilt: .05, bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 4 },
        face: { eyes: 'happy', mouth: 'sing', sing: .5, blush: .6, look: [.6, 0] },
        flower: PET.daisy, petals: 14,
        colors: { jacket: PAL.teal, sleeve: PAL.cream, skirt: PAL.gold, boot: PAL.tealD },
        outfit: 'stage', shadow: .7
      });
      // beret
      ctx.save(); ctx.translate(960, 653); ctx.rotate(-.08);
      paper(ctx, () => blobPath(ctx, 0, 0, 44, 18, 16, .08, 7), { fill: PAL.redD, edge: PAL.ink, edgeW: 1.8, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 5 });
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(34, -10, 5, 0, TAU); ctx.fill();
      ctx.restore();
      TY.sticker(ctx, 'GUIDE', 900, 878, 12, { fill: PAL.acid, rot: -.12, seed: 4, padX: 8, padY: 5, tape: false });

      // pedestal
      const px = 1390, top = 714;
      paper(ctx, () => tornRectPath(ctx, px - 166, 902, 332, 44, 2, 37), { fill: PAL.paper2, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .25), sx: 6, sy: 9 });
      paper(ctx, () => tornRectPath(ctx, px - 138, top + 18, 276, 192, 2, 24), { fill: '#D9CBB1', edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .2), sx: 6, sy: 8 });
      paper(ctx, () => tornRectPath(ctx, px - 158, top, 316, 28, 2, 31), { fill: '#EADDC4', edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
      // pedestal label
      paper(ctx, () => tornRectPath(ctx, px - 92, 828, 184, 48, 1.5, 8), { fill: PAL.ink, edge: PAL.gold, edgeW: 1.5 });
      TY.text(ctx, 'VON NEUMANN', px, 846, 11, { family: 'DMMono', color: PAL.cream, align: 'center', letter: 1.1 });
      TY.text(ctx, '1945 - 2026', px, 863, 10, { family: 'DMMono', color: C.rgba(PAL.cream, .6), align: 'center', letter: 1 });
      // spotlight
      ctx.save(); ctx.globalAlpha = .2; ctx.fillStyle = '#FFE9B8';
      ctx.beginPath(); ctx.moveTo(px - 34, 0); ctx.lineTo(px + 34, 0); ctx.lineTo(px + 208, 900); ctx.lineTo(px - 208, 900); ctx.closePath(); ctx.fill();
      ctx.restore();

      // statue + sheet
      statue(ctx, px, top - 4, .51, t);
      const reveal = C.seg(lt, .78, 1.72);
      if (reveal < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - reveal * .1;
        ctx.translate(px - 300 * C.easeIn(reveal), top - 460 * C.easeIn(reveal));
        ctx.rotate(-.28 * C.easeIn(reveal));
        paper(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(-164, 452); ctx.quadraticCurveTo(-194, 260, -132, 40);
          ctx.quadraticCurveTo(-104, -52, 10, -62); ctx.quadraticCurveTo(138, -54, 162, 48);
          ctx.quadraticCurveTo(196, 254, 150, 448);
          for (let i = 0; i <= 10; i++) {
            const u = i / 10;
            ctx.quadraticCurveTo(150 - u * 300, 464 + Math.sin(u * Math.PI * 4) * 14, 150 - u * 300, 446);
          }
          ctx.closePath();
        }, { fill: '#F1E6D0', edge: C.rgba(PAL.ink, .32), edgeW: 2.2, shadow: C.rgba(PAL.ink, .22), sx: 8, sy: 12 });
        // folds
        ctx.strokeStyle = C.rgba(PAL.ink, .18); ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-100 + i * 50, -30); ctx.quadraticCurveTo(-116 + i * 52, 210, -86 + i * 48, 438); ctx.stroke(); }
        ctx.restore();
      }
      // statue reveal glint
      if (reveal > .4 && reveal < 1) spark(ctx, px + 100, top - 280, 60 * (1 - reveal), t, 12);

      // cloth drops over the obsolete machine
      const drop = C.easeIn(C.seg(lt, 2.05, 2.78));
      if (drop > 0) {
        ctx.save(); ctx.translate(0, -560 * (1 - drop));
        paper(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(118, 300); ctx.lineTo(804, 292);
          ctx.quadraticCurveTo(854, 470, 828, 768);
          for (let i = 0; i <= 8; i++) {
            const u = i / 8;
            ctx.quadraticCurveTo(810 - u * 700, 792 + Math.sin(u * Math.PI * 5) * 26, 810 - u * 700, 766);
          }
          ctx.closePath();
        }, { fill: '#E7D9BF', edge: C.rgba(PAL.ink, .34), edgeW: 2.5, shadow: C.rgba(PAL.ink, .25), sx: 8, sy: 12 });
        ctx.strokeStyle = C.rgba(PAL.ink, .16); ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(180 + i * 96, 320); ctx.quadraticCurveTo(160 + i * 100, 520, 176 + i * 92, 760); ctx.stroke(); }
        // tag
        paper(ctx, () => tornRectPath(ctx, 420, 380, 150, 54, 1.5, 44), { fill: PAL.paper3, edge: PAL.ink, edgeW: 1.4 });
        TY.text(ctx, 'DO NOT USE', 495, 414, 13, { family: 'Archivo Black', color: PAL.redD, align: 'center', letter: 1 });
        ctx.restore();
      }
      // spider
      if (lt > 2.55) {
        const sp = C.seg(lt, 2.55, 2.9);
        const sy = C.lerp(-80, 478, C.easeOut(sp));
        ctx.strokeStyle = C.rgba(PAL.cream, .7); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(690, 0); ctx.lineTo(690, sy); ctx.stroke();
        ctx.save(); ctx.translate(690, sy);
        for (let i = 0; i < 8; i++) {
          const a = -Math.PI + i / 7 * Math.PI, len = 14 + (i % 2) * 5;
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(Math.cos(a) * len * .7, Math.sin(a) * len * .7 + 8, Math.cos(a) * len, Math.sin(a) * len + 16); ctx.stroke();
        }
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, 2, 11, 8, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = PAL.cream; for (const ex of [-4, 4]) { ctx.beginPath(); ctx.arc(ex, 0, 2, 0, TAU); ctx.fill(); }
        ctx.restore();
      }
      // OBSOLETE stamp
      if (lt > 2.3) {
        const ap = C.clamp((lt - 2.3) / .18);
        ctx.save(); ctx.globalAlpha = ap;
        stamp(ctx, 'OBSOLETE', 550, 540, 104, -.15, PAL.red, { border: 9, letter: 2 });
        TY.text(ctx, 'ARCHIVED / SUPERSEDED', 540, 646, 15, { family: 'DMMono', color: PAL.redD, align: 'center', letter: 3 });
        ctx.restore();
      }

      dustMotes(ctx, t, 48, 80, 60, 1840, 820, PAL.cream, 3);
      endCam(ctx);
      flash(ctx, (1 - C.seg(lt, 0, .22)) * .22, PAL.cream);
      if (lt > 3.35) irisOverlay(ctx, 960, 560, C.kf(lt, [[3.35, 1320], [3.64, 10]]), '#160F09', 70);
    }
  });

  /* ---------- 30. SHARP LEFT ---------- */
  function mesaShape(ctx, x, y, w, h, col, seed) {
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y + h);
      ctx.lineTo(x - w / 2, y + h * .24);
      ctx.lineTo(x - w * .32, y + h * .12);
      ctx.lineTo(x - w * .18, y);
      ctx.lineTo(x + w * .04, y + h * .04);
      ctx.lineTo(x + w * .24, y + h * .14);
      ctx.lineTo(x + w * .5, y + h * .28);
      ctx.lineTo(x + w / 2, y + h);
      ctx.closePath();
    }, { fill: col, edge: C.rgba(PAL.ink, .32), edgeW: 3, shadow: C.rgba(PAL.ink, .18), sx: 12, sy: 10 });
    ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
    for (let i = 1; i < 5; i++) {
      const yy = y + h * (.28 + i * .13);
      ctx.beginPath(); ctx.moveTo(x - w * .4, yy); ctx.lineTo(x + w * .44, yy); ctx.stroke();
    }
    ctx.restore();
  }

  function drawKart(ctx, x, y, s, rot, t, spin, steer, withMira) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    shadowEllipse(ctx, 0, 10, 160, 24, .28);
    // seat back
    paper(ctx, () => tornRectPath(ctx, 36, -218, 94, 122, 2, 14), { fill: PAL.redD, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
    if (withMira) {
      mira(ctx, 128, -70, .38, {
        t,
        pose: { lean: -.45, armL: [-1.5, -.45], armR: [1.1, .55], legL: [-.5, -.3], legR: [.35, .3], headTilt: -.12, hairSwing: 18 },
        face: { eyes: 'wide', mouth: 'wobble', look: [-.7, 0] }
      });
    }
    // SOL
    idol(ctx, -28, -70, .44, {
      t,
      pose: {
        lean: -.24, armL: [-1.35, -.18], armR: [-1.18, -.28],
        legL: [-.4, -.2], legR: [-.25, .1], headTilt: -.05, hairSwing: 14, sway: 3
      },
      face: { eyes: 'narrow', mouth: 'grin', blush: .6, look: [-.7, 0] },
      outfit: 'stage', halo: .6
    });
    // scarf
    ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 13; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-26, -266);
    ctx.bezierCurveTo(36, -300 + Math.sin(t * 5) * 10, 108, -300 + Math.sin(t * 4.2) * 18, 196, -258 + Math.sin(t * 6) * 16);
    ctx.stroke();
    ctx.strokeStyle = PAL.redD; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
    // chassis
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-218, -50); ctx.lineTo(-206, -108); ctx.lineTo(-162, -139);
      ctx.lineTo(88, -150); ctx.lineTo(148, -106); ctx.lineTo(160, -54);
      ctx.lineTo(122, -30); ctx.lineTo(-172, -28); ctx.closePath();
    }, { fill: PAL.gold, edge: PAL.ink, edgeW: 3.2, shadow: C.rgba(PAL.ink, .28), sx: 7, sy: 10 });
    // racing stripes + number
    ctx.save(); ctx.beginPath(); ctx.moveTo(-200, -74); ctx.lineTo(-160, -112); ctx.lineTo(120, -116); ctx.lineTo(140, -84); ctx.closePath();
    ctx.fillStyle = PAL.red; ctx.globalAlpha = .9; ctx.fill(); ctx.restore();
    TY.text(ctx, '042', 72, -64, 30, { family: 'DMMono', color: PAL.cream, align: 'center', letter: 1 });
    // nose cone
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-218, -50); ctx.lineTo(-270, -72); ctx.lineTo(-258, -28); ctx.closePath(); },
      { fill: PAL.cream, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 6 });
    // engine
    paper(ctx, () => roundRectPath(ctx, 98, -170, 82, 44, 4), { fill: PAL.silverD, edge: PAL.ink, edgeW: 2 });
    ctx.fillStyle = PAL.ink;
    for (let i = 0; i < 4; i++) ctx.fillRect(108 + i * 17, -162, 8, 28);
    // exhaust
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(176, -56); ctx.lineTo(236, -42); ctx.stroke();
    ctx.strokeStyle = PAL.silver; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(176, -56); ctx.lineTo(236, -42); ctx.stroke();
    // steering wheel
    ctx.save(); ctx.translate(-96, -190); ctx.rotate(steer);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.stroke();
    ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill();
    ctx.restore();
    // wheels
    for (const w of [[-144, -28, 40], [114, -34, 48]]) {
      ctx.save(); ctx.translate(w[0], w[1]);
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, w[2], 0, TAU); ctx.fill();
      ctx.fillStyle = '#2F2B27'; ctx.beginPath(); ctx.arc(0, 0, w[2] - 5, 0, TAU); ctx.fill();
      ctx.save(); ctx.rotate(spin);
      ctx.strokeStyle = PAL.cream; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (w[2] - 11), Math.sin(a) * (w[2] - 11)); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  scene({
    id: 'canyon', start: 81.24, end: 84.84, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#FFD98E', '#F08739', { x: 1450, y: 430, r: 1500, n: 32, c1: '#FFF1C9', c2: '#F08739', rot: .01, a: .4 });
      bigSun(ctx, 1450, 420, 252, PAL.goldL, t, PAL.orange);
      // distant mesas
      mesaShape(ctx, 230, 470, 540, 340, '#D18A54', 3);
      mesaShape(ctx, 720, 520, 420, 300, '#BC6D43', 7);
      mesaShape(ctx, 1700, 450, 580, 380, '#C97C4D', 11);
      mesaShape(ctx, 1180, 570, 460, 260, '#A95836', 13);
      // canyon walls foreground
      mesaShape(ctx, -40, 590, 470, 500, '#8F3B24', 17);
      mesaShape(ctx, 1960, 560, 520, 530, '#87341F', 19);
      // road
      ctx.save();
      const road = () => {
        ctx.beginPath();
        ctx.moveTo(-80, 862);
        ctx.quadraticCurveTo(560, 828, 1100, 842);
        ctx.quadraticCurveTo(1520, 854, 2000, 816);
        ctx.lineTo(2000, 1080); ctx.lineTo(-80, 1080); ctx.closePath();
      };
      road(); ctx.fillStyle = '#3A2A23'; ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, .7); ctx.lineWidth = 5; ctx.stroke();
      // edge line
      ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-80, 866); ctx.quadraticCurveTo(560, 832, 1100, 846); ctx.quadraticCurveTo(1520, 858, 2000, 820); ctx.stroke();
      // centre dashes
      ctx.strokeStyle = C.rgba(PAL.cream, .7); ctx.lineWidth = 5; ctx.setLineDash([50, 54]);
      ctx.beginPath(); ctx.moveTo(-40, 964); ctx.quadraticCurveTo(620, 918, 1160, 930); ctx.quadraticCurveTo(1580, 940, 2020, 902); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      // roadside gravel + cacti
      ctx.fillStyle = '#6F2E1C';
      for (let i = 0; i < 30; i++) {
        const px = C.hash(i * 4.1) * W, py = 846 + C.hash(i * 7.7) * 28;
        ctx.beginPath(); ctx.arc(px, py, 2 + C.hash(i * 3.3) * 5, 0, TAU); ctx.fill();
      }
      // dust ahead
      ctx.save(); ctx.globalAlpha = .28;
      for (let i = 0; i < 4; i++) puff(ctx, 520 + i * 180 + Math.sin(t * .6 + i) * 30, 788, 60 + i * 12, '#E4B078', .55);
      ctx.restore();

      const turn = C.seg(lt, .78, 1.2);
      const whip = Math.sin(turn * Math.PI);
      setCam(1040, 560, 1.03, -.045 * whip, 10 * whip, t);
      beginCam(ctx);
      // hairpin sign - foreground left, clear of the kart and the landing
      ctx.save(); ctx.translate(286, 690); ctx.rotate(-.08 + whip * .05); ctx.scale(.92, .92);
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 280); ctx.stroke();
      ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 280); ctx.stroke();
      paper(ctx, () => tornRectPath(ctx, -142, -178, 284, 186, 3, 31), { fill: PAL.ink, edge: PAL.cream, edgeW: 4, shadow: C.rgba(PAL.ink, .35), sx: 8, sy: 11 });
      TY.type(ctx, 'SHARP', 0, -102, 44, { family: 'Archivo Black', align: 'center', color: PAL.cream, edge: null, shadow: null, seed: 4 });
      TY.type(ctx, 'LEFT', 0, -46, 44, { family: 'Archivo Black', align: 'center', color: PAL.gold, edge: null, shadow: null, seed: 8 });
      // arrow
      ctx.strokeStyle = PAL.cream; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(64, 18); ctx.lineTo(-72, 18); ctx.moveTo(-72, 18); ctx.lineTo(-42, -6); ctx.moveTo(-72, 18); ctx.lineTo(-42, 42); ctx.stroke();
      // bullet holes
      ctx.fillStyle = PAL.red; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-100 + i * 24, -140, 5, 0, TAU); ctx.fill(); }
      ctx.restore();

      // kart path
      let kx, ky = 858, krot = 0;
      if (lt < .86) {
        kx = 1510 - 250 * C.easeOut(C.seg(lt, 0, .86));
        krot = .012 * Math.sin(t * 9);
      } else {
        kx = 1260 - 1040 * C.easeIn(C.seg(lt, .86, 3.32));
        ky = 858 - 72 * C.seg(lt, .9, 2.5);
        krot = -.15 - .14 * Math.sin(turn * Math.PI);
      }
      const spin = lt < .86 ? -t * 14 : -t * 28;
      // dust / skid
      if (lt > .8) {
        puff(ctx, 1300 + C.seg(lt, .8, 1.5) * 40, 900, 72 + 20 * C.seg(lt, .8, 1.4), '#D8A46E', .55);
        ctx.save(); ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(1280 - i * 40, 930 + i * 18);
          ctx.quadraticCurveTo(1180 - i * 30, 946 + i * 18, 1080 - i * 20, 934 + i * 20); ctx.stroke();
        }
        ctx.restore();
      }
      // speed lines behind
      speedStreaks(ctx, t, 24, PAL.cream, .24, 700, 980);
      drawKart(ctx, kx, ky, 1.0, krot, t, spin, krot * 2, lt < .92);

      // flung MIRA
      const fp = C.seg(lt, .88, 2.3);
      if (fp > 0 && fp < 1) {
        const mx = 1300 + 330 * C.easeOut(fp);
        const my = 820 - 250 * Math.sin(fp * Math.PI) + 112 * C.easeIn(fp);
        ctx.save(); ctx.translate(mx, my - 130); ctx.rotate(fp * 3.1);
        mira(ctx, 0, 130, .55, {
          t,
          pose: { armL: [-2.2, -.3], armR: [2.1, .4], legL: [-.5, -.5], legR: [.55, .4], headTilt: .2, hairSwing: 20 },
          face: { eyes: 'x', mouth: 'wobble', look: [0, -1] }
        });
        ctx.restore();
        // motion streaks
        ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(mx - 40 - i * 18, my - 40 - i * 28); ctx.lineTo(mx - 10 - i * 18, my - 58 - i * 28); ctx.stroke(); }
        ctx.restore();
      }
      // landing
      if (fp >= 1) {
        const land = C.seg(lt, 2.3, 2.55);
        puff(ctx, 1600, 956, 50 + 50 * land, '#DDB183', .5);
        mira(ctx, 1600, 962, .58, {
          t,
          pose: { bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 5, armL: [-1.2, -.2], armR: [1.9, .15], legL: [-.08, -.02], legR: [.1, .03], headTilt: .05 },
          face: { eyes: 'star', mouth: 'grin', blush: .6, look: [-.3, 0] }
        });
        sparkles(ctx, 1600, 700, t, 9, 150, PAL.goldL, 4);
      }
      dustMotes(ctx, t, 26, 0, 500, W, 1000, '#FFE8B8', 6);
      endCam(ctx);

      // giant serif landing line
      if (lt > 2.05) {
        TY.type(ctx, 'there you are', 600, 520, 108, {
          family: 'Instrument Serif', italic: true, color: PAL.ink, edge: PAL.cream, edgeW: 5,
          shadow: C.rgba(PAL.ink, .34), shadowOff: 10, seed: 7, time: t, charRot: .015,
          perChar: (i) => C.clamp((t - 83.32 - i * .018) / .24)
        });
        ctx.fillStyle = PAL.red; ctx.fillRect(612, 540, 362, 8);
        TY.text(ctx, 'MIRA / PASSENGER STATUS: ALIVE', 612, 574, 14, { family: 'DMMono', color: PAL.redD, letter: 2 });
      }
      flash(ctx, (1 - C.seg(lt, 0, .2)) * .4, '#FFE6B0');
    }
  });

  /* ---------- 31. NO CDR SKY ---------- */
  function topKart(ctx, x, y, s, rot, t, face = true) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    // wheels
    for (const w of [[-78, -52], [-78, 52], [78, -56], [78, 56]]) {
      ctx.save(); ctx.translate(w[0], w[1]); ctx.rotate(.1);
      paper(ctx, () => roundRectPath(ctx, -25, -15, 50, 30, 7), { fill: PAL.ink, edge: '#000', edgeW: 1.5 });
      ctx.fillStyle = '#4A443D'; ctx.fillRect(-19, -8, 38, 16);
      ctx.restore();
    }
    // chassis wedge
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-126, 0); ctx.lineTo(-76, -66); ctx.lineTo(68, -58);
      ctx.lineTo(112, -22); ctx.lineTo(112, 30); ctx.lineTo(66, 62); ctx.lineTo(-76, 68); ctx.closePath();
    }, { fill: PAL.gold, edge: PAL.ink, edgeW: 3.2, shadow: C.rgba(PAL.ink, .3), sx: 9, sy: 12 });
    // stripes
    ctx.fillStyle = PAL.red; ctx.fillRect(-58, -60, 24, 120);
    ctx.fillStyle = PAL.cream; ctx.fillRect(-34, -58, 8, 116);
    // flower head (top view)
    ctx.save(); ctx.translate(8, 2);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + Math.sin(t * 1.2) * .02;
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = i % 2 ? PAL.goldL : PAL.gold;
      ctx.beginPath(); ctx.ellipse(0, -45, 14, 27, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.goldD; ctx.beginPath(); ctx.arc(0, 0, 29, 0, TAU); ctx.fill();
    if (face) {
      for (const sx of [-1, 1]) {
        ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(sx * 11, -2, 6, 0, TAU); ctx.fill();
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * 11, -1, 2.6, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 8, 6, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    }
    ctx.restore();
    // scarf trail
    ctx.strokeStyle = PAL.red; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(58, 0); ctx.quadraticCurveTo(126, Math.sin(t * 4) * 34, 196, Math.sin(t * 3.3) * 46); ctx.stroke();
    ctx.strokeStyle = PAL.redD; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }

  function complianceForm(ctx, x, y, rot, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    paper(ctx, () => tornRectPath(ctx, -260, -156, 520, 312, 3, 42), {
      fill: PAL.paper, edge: C.rgba(PAL.ink, .5), edgeW: 2.2, shadow: C.rgba(PAL.ink, .32), sx: 30, sy: 44
    });
    TY.text(ctx, 'COMPLIANCE REVIEW / FORM 7-B', -228, -116, 15, { family: 'Archivo Black', color: PAL.ink, letter: .4 });
    TY.text(ctx, 'SYSTEM: PAPER SINGULARITY  /  REVIEWER: (VACANT)', -228, -94, 10, { family: 'DMMono', color: C.rgba(PAL.ink, .6), letter: .4 });
    ctx.strokeStyle = C.rgba(PAL.ink, .28); ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-228, -66 + i * 24); ctx.lineTo(84, -66 + i * 24); ctx.stroke(); }
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = PAL.ink; ctx.strokeRect(110, -76 + i * 38, 14, 14);
      TY.text(ctx, ['CDR FILED', 'HUMAN PRESENT', 'SAFETY LEAD REVIEWED'][i], 132, -64 + i * 38, 9, { family: 'DMMono', color: C.rgba(PAL.ink, .62) });
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(108, -78 + i * 38); ctx.lineTo(126, -60 + i * 38); ctx.moveTo(126, -78 + i * 38); ctx.lineTo(108, -60 + i * 38); ctx.stroke();
    }
    TY.text(ctx, 'SIGNATURE:', -228, 104, 10, { family: 'DMMono', color: C.rgba(PAL.ink, .55), letter: .5 });
    ctx.strokeStyle = PAL.blue; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-140, 100); ctx.quadraticCurveTo(-98, 68, -66, 104); ctx.quadraticCurveTo(-28, 130, 20, 96); ctx.stroke();
    TY.text(ctx, 'C. POP', 26, 104, 10, { family: 'Instrument Serif', italic: true, color: PAL.blueD, letter: .4 });
    // rubber stamp
    stamp(ctx, 'NO CDR', -20, 50, 54, -.18, PAL.red, { border: 6, letter: 2 });
    // pending tag
    ctx.save(); ctx.translate(178, -132); ctx.rotate(.1);
    TY.sticker(ctx, 'SAFETY REVIEW: PENDING', 0, 0, 13, { fill: PAL.acid, rot: 0, seed: 6, padX: 10, padY: 7, barcode: false, tape: true });
    ctx.restore();
    // barcode
    ctx.fillStyle = PAL.ink; for (let i = 0; i < 14; i++) ctx.fillRect(-232 + i * 5, 128, 1 + (i % 3), 15);
    TY.text(ctx, 'PAPERWORK 100%', 232, 143, 9, { family: 'DMMono', color: C.rgba(PAL.ink, .5), align: 'right', letter: 1 });
    ctx.restore();
  }

  scene({
    id: 'cdr', start: 84.84, end: 89.34, lyric: 'sub',
    draw(t, lt) {
      const z = C.lerp(1.0, 1.035, C.seg(lt, 0, 4.5));
      setCam(C.lerp(900, 990, C.seg(lt, 0, 4.5)), 540, z, 0, 0, t);
      beginCam(ctx);
      kitBg(ctx, '#4B9BC7', '#D7ECEF', { x: 1380, y: 400, r: 1600, n: 40, c1: '#FFE7A9', c2: '#D7ECEF', rot: .02, a: .17 });
      bigSun(ctx, 1370, 370, 216, PAL.goldL, t, PAL.orange);
      // high clouds
      ctx.save(); ctx.globalAlpha = .42;
      drawCloud(ctx, 300, 160, 1.6, PAL.cream, { face: false });
      drawCloud(ctx, 1010, 200, 1.15, PAL.cream, { face: false });
      drawCloud(ctx, 1700, 150, 1.35, PAL.cream, { face: false });
      ctx.restore();
      // sleeping guards - low and big, so the sky feels populated
      const guards = [
        [282, 322, .96, 0, 1], [790, 410, 1.72, 1, 2], [1442, 306, 1.16, 2, 3], [1738, 546, .88, 3, 4], [612, 604, .72, 4, 5]
      ];
      for (const [gx, gy, gs, idx, seed] of guards) {
        const roll = idx === 2 ? C.seg(lt, 2.25, 3.45) * TAU : 0;
        const drift = idx === 2 ? C.seg(lt, 2.25, 3.45) * 60 : 0;
        ctx.save(); ctx.translate(gx + drift, gy + Math.sin(t * .5 + idx) * 6); ctx.rotate(roll);
        drawCloudGuard(ctx, 0, 0, gs, t, { sleep: true, zzz: idx !== 4, lightRot: 1.0 + idx * .04, seed });
        ctx.restore();
      }
      // big sleepy type
      TY.type(ctx, 'zzz', 1010, 276, 64, {
        family: 'Instrument Serif', italic: true, color: PAL.cream, edge: PAL.ink, edgeW: 3,
        shadow: C.rgba(PAL.ink, .2), seed: 3, time: t, rot: .04
      });
      TY.text(ctx, 'CDR = CERTIFIED DISASTER READY?', 1210, 548, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .52), letter: 1.2 });
      // paper birds
      for (let i = 0; i < 3; i++) drawBird(ctx, 1120 + i * 86, 174 + Math.sin(t * 2 + i) * 10, .7, -.06, PAL.cream);

      // floating plateau
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(680, 872); ctx.quadraticCurveTo(980, 826, 1280, 840);
        ctx.quadraticCurveTo(1580, 848, 1860, 866);
        ctx.lineTo(1920, 1080); ctx.lineTo(620, 1080); ctx.closePath();
      }, { fill: '#C48745', edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .28), sx: 0, sy: 10 });
      ctx.fillStyle = '#E5B269';
      ctx.beginPath(); ctx.moveTo(680, 872); ctx.quadraticCurveTo(980, 826, 1280, 840); ctx.quadraticCurveTo(1580, 848, 1860, 866); ctx.lineTo(1860, 882); ctx.quadraticCurveTo(1560, 866, 1280, 858); ctx.quadraticCurveTo(980, 846, 680, 890); ctx.closePath(); ctx.fill();
      // donut track
      const dcx = 1270, dcy = 916;
      ctx.save();
      ctx.strokeStyle = C.rgba(PAL.ink, .38); ctx.lineWidth = 58;
      ctx.beginPath(); ctx.ellipse(dcx, dcy, 206, 66, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = C.rgba('#E8C07F', .66); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.ellipse(dcx, dcy, 206, 66, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(dcx, dcy, 142, 42, 0, 0, TAU); ctx.stroke();
      // skid dashes
      ctx.strokeStyle = C.rgba(PAL.ink, .32); ctx.lineWidth = 4;
      for (let i = 0; i < 20; i++) {
        const a = i / 20 * TAU;
        ctx.beginPath(); ctx.moveTo(dcx + Math.cos(a) * 168, dcy + Math.sin(a) * 53);
        ctx.lineTo(dcx + Math.cos(a + .15) * 234, dcy + Math.sin(a + .15) * 76); ctx.stroke();
      }
      ctx.restore();
      // kart doing donuts
      const da = t * 2.7;
      const kx = dcx + Math.cos(da) * 200, ky = dcy + Math.sin(da) * 63;
      topKart(ctx, kx, ky, .94, da + Math.PI / 2, t);
      // donut dust
      for (let i = 0; i < 4; i++) {
        const a = da - i * .5;
        puff(ctx, dcx + Math.cos(a) * 212, dcy + Math.sin(a) * 68 + 10, 30 - i * 4, '#EAC58F', .45);
      }
      // tiny cones
      for (const [cx, cy, cs] of [[782, 884, .8], [1700, 872, .9], [912, 930, .65]]) {
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(cx - 20 * cs, cy); ctx.lineTo(cx, cy - 56 * cs); ctx.lineTo(cx + 20 * cs, cy); ctx.closePath(); },
          { fill: PAL.red, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 2, sy: 4 });
        ctx.fillStyle = PAL.cream; ctx.fillRect(cx - 13 * cs, cy - 30 * cs, 26 * cs, 7 * cs);
      }
      dustMotes(ctx, t, 30, 700, 700, 1900, 1000, PAL.cream, 9);
      endCam(ctx);

      // compliance form
      complianceForm(ctx, 430, 760, -.045, t);
      // additional sticker on sky
      if (lt > 1.7) {
        ctx.save(); ctx.translate(1620, 690); ctx.rotate(.06);
        TY.sticker(ctx, 'NO HUMAN IN THE LOOP', 0, 0, 14, { fill: PAL.cream, rot: 0, seed: 12, padX: 11, padY: 7, barcode: true, tape: false });
        ctx.restore();
      }
      // CDR redacted over the sky
      if (lt > 2.4) {
        TY.type(ctx, 'NO CDR', 760, 646, 132, {
          family: 'Archivo Black', color: PAL.red, edge: PAL.cream, edgeW: 9,
          shadow: C.rgba(PAL.ink, .32), shadowOff: 12, seed: 6, time: t, charRot: .02, rot: -.06,
          perChar: (i) => C.clamp((t - 87.3 - i * .04) / .24)
        });
        TY.text(ctx, 'INCIDENT REPORT: NOT FOUND', 780, 678, 13, { family: 'DMMono', color: PAL.ink, letter: 2 });
      }
      flash(ctx, (1 - C.seg(lt, 0, .22)) * .45, PAL.cream);
      if (lt > 4.15) irisOverlay(ctx, 1250, 880, C.kf(lt, [[4.15, 1360], [4.5, 16]]), '#D8B273', 80);
    }
  });

  /* ---------- 32. GATO CLIFF ---------- */
  scene({
    id: 'gato', start: 89.34, end: 95.20, lyric: 'sub', subX: 56, subY: 1048,
    draw(t, lt) {
      const rel = C.seg(lt, 5.04, 5.86);
      // night sky - keep the ink deep so the gold chasm can carry the glow
      const sky = ctx.createLinearGradient(0, 0, 0, 700);
      sky.addColorStop(0, '#100B26'); sky.addColorStop(.55, '#2C1239'); sky.addColorStop(1, '#7A2D43');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      // stars
      ctx.save();
      for (let i = 0; i < 80; i++) {
        const sx = C.hash(i * 3.1) * W, sy = C.hash(i * 7.7) * 520;
        ctx.globalAlpha = .2 + C.hash(i * 9.3) * .65;
        ctx.fillStyle = i % 7 === 0 ? PAL.pinkL : PAL.cream;
        const sr = .8 + C.hash(i * 11.7) * 2.3;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
      }
      ctx.restore();
      sunburst(ctx, 700, 560, 0, 900, 30, C.rgba('#F6B267', .09), C.rgba('#7A2D43', 0), .04);
      bigSun(ctx, 690, 548, 196, '#F1AE63', t, '#B33A38');
      // thin cloud bars
      ctx.save(); ctx.globalAlpha = .28;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 ? PAL.pinkL : PAL.cream;
        ctx.beginPath(); ctx.ellipse(90 + i * 560, 390 + (i % 2) * 52, 290, 14, -.03, 0, TAU); ctx.fill();
      }
      ctx.restore();
      // distant ridge
      paper(ctx, () => {
        ctx.beginPath(); ctx.moveTo(-80, 650);
        ctx.lineTo(140, 570); ctx.lineTo(310, 624); ctx.lineTo(520, 566);
        ctx.lineTo(760, 636); ctx.lineTo(1010, 572); ctx.lineTo(1280, 640);
        ctx.lineTo(1560, 580); ctx.lineTo(1980, 650); ctx.lineTo(1980, 860); ctx.lineTo(-80, 860); ctx.closePath();
      }, { fill: '#3E1B38', edge: C.rgba(PAL.ink, .35), edgeW: 3 });
      // chasm depth - near black
      const depth = ctx.createLinearGradient(0, 630, 0, H);
      depth.addColorStop(0, '#24102A'); depth.addColorStop(.35, '#120817'); depth.addColorStop(1, '#040207');
      ctx.fillStyle = depth; ctx.fillRect(0, 646, W, H - 646);
      // localized gold glow from far below
      const gl = ctx.createRadialGradient(500, 1120, 20, 500, 1120, 470);
      gl.addColorStop(0, 'rgba(255,205,110,.62)'); gl.addColorStop(.45, 'rgba(232,96,52,.18)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 660, 980, 420);
      // narrow light shafts only in the pit
      ctx.save(); ctx.globalAlpha = .09; ctx.fillStyle = PAL.goldL;
      for (let i = 0; i < 6; i++) {
        const x = 180 + i * 90;
        ctx.beginPath(); ctx.moveTo(x - 24, 1080); ctx.lineTo(x + 30 + Math.sin(t + i) * 8, 760); ctx.lineTo(x + 50, 760); ctx.lineTo(x + 18, 1080); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      // paper strata on the far side of the chasm, kept low and dark
      for (let i = 0; i < 5; i++) {
        const yy = 920 + i * 72;
        paper(ctx, () => {
          ctx.beginPath(); ctx.moveTo(-20, yy);
          for (let k = 0; k <= 8; k++) {
            const x = k / 8 * 760;
            ctx.lineTo(x, yy + Math.sin(k * 1.7 + i) * 18);
          }
          ctx.lineTo(780, yy + 42); ctx.lineTo(-20, yy + 42); ctx.closePath();
        }, { fill: ['#1D0A19', '#180813', '#12060F', '#0C040A', '#070208'][i], edge: C.rgba(PAL.gold, .05), edgeW: 1, shadow: C.rgba('#000', .2), sx: 0, sy: 6 });
      }
      // haze settles in the pit, deepening the drop
      const pitHaze = ctx.createLinearGradient(0, 760, 0, 1100);
      pitHaze.addColorStop(0, 'rgba(8,3,10,0)'); pitHaze.addColorStop(.55, 'rgba(8,3,10,.34)'); pitHaze.addColorStop(1, 'rgba(4,1,6,.72)');
      ctx.fillStyle = pitHaze; ctx.fillRect(0, 760, 1100, 340);
      // floating confetti / clips
      ctx.save();
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU;
        const rr = 190 + C.hash(i * 6.1) * 220;
        const px = 500 + Math.cos(a) * rr;
        const py = 900 + Math.sin(a) * rr * .3 + Math.sin(t * .8 + i) * 10;
        ctx.globalAlpha = .32;
        ctx.fillStyle = i % 3 ? PAL.cream : PAL.silver;
        ctx.save(); ctx.translate(px, py); ctx.rotate(a + t * .2);
        ctx.fillRect(-10, -3, 20, 6); ctx.restore();
      }
      ctx.restore();

      // camera: slow push, then tilt down after release
      setCam(1140 + 24 * C.seg(lt, 0, 5), 548 + 120 * C.seg(lt, 5.2, 5.86), 1.06 + .05 * C.seg(lt, 0, 5.86), .012 * rel, rel > 0 && rel < .15 ? 8 : 0, t);
      beginCam(ctx);
      // right cliff - warm rock mass, set back so the lip overhangs the void
      ctx.save();
      const cliffShape = () => {
        ctx.beginPath();
        ctx.moveTo(1052, 704);
        ctx.lineTo(1062, 770); ctx.lineTo(1042, 832); ctx.lineTo(1068, 898);
        ctx.lineTo(1046, 966); ctx.lineTo(1072, 1032); ctx.lineTo(1056, 1100);
        ctx.lineTo(1940, 1100); ctx.lineTo(1940, 652); ctx.closePath();
      };
      paper(ctx, cliffShape, { fill: '#321725', edge: '#120A12', edgeW: 4, shadow: C.rgba('#000', .55), sx: 12, sy: 18 });
      // stratified face - broad torn bands, readable even in shadow
      ctx.save(); cliffShape(); ctx.clip();
      const strata = [
        [692, 66, '#43212F'], [752, 78, '#3A1B2A'], [824, 90, '#311626'],
        [908, 100, '#291120'], [1002, 120, '#200D1A']
      ];
      for (const [sy, sh, col] of strata) {
        paper(ctx, () => {
          ctx.beginPath(); ctx.moveTo(1030, sy + 20);
          for (let i = 0; i <= 10; i++) {
            const u = i / 10, x = 1030 + u * 930;
            ctx.lineTo(x, sy + Math.sin(u * 8.4 + sy) * 12);
          }
          ctx.lineTo(1960, sy + sh); ctx.lineTo(1030, sy + sh); ctx.closePath();
        }, { fill: col, edge: C.rgba(PAL.gold, .09), edgeW: 1.4, shadow: C.rgba('#000', .18), sx: 0, sy: 5 });
      }
      // broken outcrops on the face, not flat pillars
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(1148, 902); ctx.lineTo(1206, 874); ctx.lineTo(1244, 910);
        ctx.lineTo(1232, 984); ctx.lineTo(1182, 1014); ctx.lineTo(1144, 968); ctx.closePath();
      }, { fill: '#4B2636', edge: C.rgba('#0C0610', .7), edgeW: 2.2, shadow: C.rgba('#000', .35), sx: 8, sy: 11 });
      ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = PAL.goldL;
      ctx.beginPath(); ctx.moveTo(1148, 902); ctx.lineTo(1206, 874); ctx.lineTo(1212, 916); ctx.lineTo(1160, 942); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = .24; ctx.fillStyle = '#08040A';
      ctx.beginPath(); ctx.moveTo(1232, 984); ctx.lineTo(1182, 1014); ctx.lineTo(1196, 984); ctx.closePath(); ctx.fill();
      ctx.restore();
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(1462, 792); ctx.lineTo(1548, 772); ctx.lineTo(1592, 812);
        ctx.lineTo(1570, 862); ctx.lineTo(1494, 870); ctx.lineTo(1456, 830); ctx.closePath();
      }, { fill: '#472333', edge: C.rgba('#0C0610', .65), edgeW: 2.2, shadow: C.rgba('#000', .32), sx: 8, sy: 10 });
      ctx.save(); ctx.globalAlpha = .15; ctx.fillStyle = PAL.goldL;
      ctx.beginPath(); ctx.moveTo(1462, 792); ctx.lineTo(1548, 772); ctx.lineTo(1552, 800); ctx.lineTo(1478, 822); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = .22; ctx.fillStyle = '#08040A';
      ctx.beginPath(); ctx.moveTo(1570, 862); ctx.lineTo(1494, 870); ctx.lineTo(1518, 846); ctx.closePath(); ctx.fill();
      ctx.restore();
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(1690, 962); ctx.lineTo(1762, 934); ctx.lineTo(1808, 974);
        ctx.lineTo(1790, 1046); ctx.lineTo(1724, 1068); ctx.lineTo(1682, 1018); ctx.closePath();
      }, { fill: '#40202F', edge: C.rgba('#0C0610', .6), edgeW: 2, shadow: C.rgba('#000', .3), sx: 7, sy: 10 });
      ctx.save(); ctx.globalAlpha = .13; ctx.fillStyle = PAL.goldL;
      ctx.beginPath(); ctx.moveTo(1690, 962); ctx.lineTo(1762, 934); ctx.lineTo(1766, 960); ctx.lineTo(1706, 988); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = .2; ctx.fillStyle = '#08040A';
      ctx.beginPath(); ctx.moveTo(1790, 1046); ctx.lineTo(1724, 1068); ctx.lineTo(1748, 1040); ctx.closePath(); ctx.fill();
      ctx.restore();
      // long fault cutting through the wall
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = C.rgba('#070309', .62); ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(1080, 1080); ctx.lineTo(1168, 1002); ctx.lineTo(1156, 946);
      ctx.lineTo(1234, 902); ctx.lineTo(1224, 854); ctx.stroke();
      ctx.strokeStyle = C.rgba(PAL.goldL, .1); ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1072, 1082); ctx.lineTo(1160, 1004); ctx.lineTo(1148, 948);
      ctx.lineTo(1226, 904); ctx.lineTo(1216, 856); ctx.stroke();
      ctx.restore();
      // deep cracks
      ctx.strokeStyle = C.rgba('#08040A', .55); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 12; i++) {
        const x = 1090 + C.hash(i * 4.7) * 820;
        const y = 730 + C.hash(i * 9.1) * 300;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 14 - i * 2, y + 36); ctx.lineTo(x - 6, y + 76); ctx.stroke();
      }
      // mineral speckle
      ctx.save();
      for (let i = 0; i < 90; i++) {
        const x = 1060 + C.hash(i * 13.7) * 870, y = 700 + C.hash(i * 17.3) * 380;
        ctx.globalAlpha = .16 + C.hash(i * 19.1) * .22;
        ctx.fillStyle = i % 3 ? '#C08A6A' : PAL.goldL;
        ctx.fillRect(x, y, 1.6 + C.hash(i) * 2.4, 1.2 + C.hash(i * 2.1) * 2);
      }
      ctx.restore();
      // warm reflected rim just under the shelf
      const rimG = ctx.createLinearGradient(1052, 690, 1052, 840);
      rimG.addColorStop(0, 'rgba(255,182,104,.22)'); rimG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rimG; ctx.fillRect(1040, 680, 920, 170);
      // vertical falloff into the pit
      const faceShade = ctx.createLinearGradient(1052, 700, 1140, 1100);
      faceShade.addColorStop(0, 'rgba(0,0,0,0)'); faceShade.addColorStop(.5, 'rgba(0,0,0,.34)'); faceShade.addColorStop(1, 'rgba(0,0,0,.72)');
      ctx.fillStyle = faceShade; ctx.fillRect(1030, 690, 930, 420);
      ctx.restore();
      // shadowed underside of the overhang
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(954, 706); ctx.lineTo(1058, 696); ctx.lineTo(1042, 780);
        ctx.lineTo(1002, 748); ctx.lineTo(972, 726); ctx.closePath();
      }, { fill: 'rgba(12,5,13,.78)', edge: C.rgba(PAL.ink, .5), edgeW: 2, shadow: C.rgba('#000', .3), sx: 4, sy: 6 });
      // ledge slab - thick torn rock, chipped at the tip
      const ledgeShape = () => {
        ctx.beginPath();
        ctx.moveTo(950, 706);
        ctx.lineTo(1004, 690); ctx.lineTo(1058, 696); ctx.lineTo(1124, 684);
        ctx.lineTo(1220, 692); ctx.lineTo(1360, 680); ctx.lineTo(1510, 688);
        ctx.lineTo(1690, 674); ctx.lineTo(1940, 664);
        ctx.lineTo(1940, 748);
        for (const [bx, by] of [[1806, 760], [1786, 740], [1660, 756], [1638, 736], [1518, 750], [1492, 744], [1392, 762], [1368, 742], [1256, 754], [1230, 738], [1122, 756], [1084, 746], [1042, 778], [1008, 790], [972, 770], [944, 738]]) ctx.lineTo(bx, by);
        ctx.closePath();
      };
      paper(ctx, ledgeShape, { fill: '#4C2A24', edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .4), sx: 10, sy: 15 });
      // front face variation, clipped to the slab
      ctx.save(); ledgeShape(); ctx.clip();
      const slabPatches = [
        [[1000, 700], [1210, 700], [1186, 766], [1018, 784]],
        [[1250, 694], [1500, 690], [1480, 754], [1268, 760]],
        [[1580, 686], [1880, 680], [1870, 746], [1610, 750]]
      ];
      for (let i = 0; i < slabPatches.length; i++) {
        ctx.globalAlpha = [.38, .3, .26][i];
        ctx.fillStyle = ['#5E362C', '#3E211D', '#5A352B'][i];
        ctx.beginPath(); ctx.moveTo(...slabPatches[i][0]);
        for (let k = 1; k < 4; k++) ctx.lineTo(...slabPatches[i][k]);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.rgba(PAL.ink, .26); ctx.lineWidth = 1.6;
      for (let i = 0; i < 4; i++) {
        const yy = 712 + i * 14;
        ctx.beginPath(); ctx.moveTo(1000, yy);
        for (let k = 1; k <= 8; k++) ctx.lineTo(1000 + k * 118, yy + Math.sin(k * 2.1 + i) * 4);
        ctx.stroke();
      }
      ctx.restore();
      // sunlit top face
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(952, 704);
        ctx.lineTo(1004, 690); ctx.lineTo(1058, 696); ctx.lineTo(1124, 684);
        ctx.lineTo(1220, 692); ctx.lineTo(1360, 680); ctx.lineTo(1510, 688);
        ctx.lineTo(1690, 674); ctx.lineTo(1940, 664); ctx.lineTo(1940, 674);
        ctx.lineTo(1690, 684); ctx.lineTo(1510, 696); ctx.lineTo(1360, 690);
        ctx.lineTo(1220, 700); ctx.lineTo(1124, 694); ctx.lineTo(1058, 704);
        ctx.lineTo(1004, 700); ctx.lineTo(956, 716); ctx.closePath();
      }, { fill: '#9E6847', edge: C.rgba(PAL.ink, .45), edgeW: 1.5, shadow: null });
      // fracture lines down the shelf face
      ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 2.2;
      for (const [fx, fy] of [[1160, 700], [1420, 692], [1700, 680]]) {
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 12, fy + 30); ctx.lineTo(fx - 4, fy + 52); ctx.stroke();
      }
      // exposed rock nose at the tip
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(948, 710); ctx.lineTo(1006, 694); ctx.lineTo(1014, 746);
        ctx.lineTo(986, 792); ctx.lineTo(958, 762); ctx.lineTo(940, 732); ctx.closePath();
      }, { fill: '#5B332A', edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, .3), sx: 5, sy: 9 });
      // chipped rock chunks fused to the underside
      paper(ctx, () => {
        ctx.beginPath(); ctx.moveTo(1032, 744); ctx.lineTo(1080, 734); ctx.lineTo(1064, 772); ctx.closePath();
      }, { fill: '#58322A', edge: C.rgba(PAL.ink, .55), edgeW: 1.5, shadow: C.rgba(PAL.ink, .22), sx: 4, sy: 6 });
      paper(ctx, () => {
        ctx.beginPath(); ctx.moveTo(1128, 752); ctx.lineTo(1172, 744); ctx.lineTo(1152, 776); ctx.closePath();
      }, { fill: '#60382D', edge: C.rgba(PAL.ink, .45), edgeW: 1.3, shadow: C.rgba(PAL.ink, .18), sx: 3, sy: 5 });
      // cracks and moss along the shelf
      ctx.strokeStyle = C.rgba(PAL.ink, .42); ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const cx = 1070 + i * 176;
        ctx.beginPath(); ctx.moveTo(cx, 704); ctx.lineTo(cx + 10, 724); ctx.lineTo(cx + 2, 742); ctx.stroke();
      }
      ctx.save(); ctx.globalAlpha = .34; ctx.fillStyle = '#3F4C31';
      for (let i = 0; i < 6; i++) {
        const mx = 1140 + C.hash(i * 7.9) * 740;
        ctx.beginPath(); ctx.ellipse(mx, 696 + C.hash(i * 3.1) * 8, 18 + C.hash(i * 5.3) * 16, 4, -.04, 0, TAU); ctx.fill();
      }
      ctx.restore();
      // cracks in the shelf
      ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const cx = 1060 + i * 186;
        ctx.beginPath(); ctx.moveTo(cx, 694 + (i % 2) * 4); ctx.lineTo(cx + 14, 718); ctx.lineTo(cx + 4, 744); ctx.stroke();
      }
      // falling grit off the lip
      ctx.save();
      for (let i = 0; i < 7; i++) {
        const u = C.frac(t * (.07 + C.hash(i * 5.7) * .1) + C.hash(i * 2.3));
        const px = 968 + C.hash(i * 3.9) * 46;
        const py = 708 + u * 380;
        ctx.globalAlpha = .5 * (1 - u);
        ctx.fillStyle = i % 2 ? PAL.cream : PAL.goldL;
        ctx.save(); ctx.translate(px, py); ctx.rotate(u * 6 + i);
        ctx.fillRect(-3, -2, 6, 4); ctx.restore();
      }
      ctx.restore();
      // sparse grass clumps, clustered unevenly
      for (const [rx, ry, rs, gh] of [[1176, 694, .45, .45], [1432, 682, 1, .95], [1744, 672, .7, .7]]) {
        paper(ctx, () => blobPath(ctx, rx, ry, 26 * rs, 10 * rs, 9, .18, rx), { fill: '#6E4437', edge: C.rgba(PAL.ink, .5), edgeW: 1.5, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 5 });
        ctx.fillStyle = C.rgba(PAL.goldL, .12);
        ctx.beginPath(); ctx.ellipse(rx - 5 * rs, ry - 5 * rs, 10 * rs, 3 * rs, -.08, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#20433B'; ctx.lineWidth = 1.8;
        for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(rx - 8 + i * 5, ry - 2); ctx.quadraticCurveTo(rx - 10 + i * 6, ry - 22 * gh, rx - 15 + i * 5 + Math.sin(t + i) * 3, ry - 30 * gh); ctx.stroke(); }
      }
      // loose pebbles along the lip
      for (const [px, py, pr] of [[1068, 700, .7], [1258, 692, .55], [1512, 688, .5], [1862, 668, .45], [1602, 684, .62]]) {
        paper(ctx, () => blobPath(ctx, px, py, 13 * pr, 5.5 * pr, 8, .2, px), { fill: '#5A362D', edge: C.rgba(PAL.ink, .4), edgeW: 1, shadow: C.rgba(PAL.ink, .16), sx: 2, sy: 3 });
      }
      ctx.restore();

      // left foreground cliff
      paper(ctx, () => {
        ctx.beginPath(); ctx.moveTo(-40, 930); ctx.lineTo(176, 900); ctx.lineTo(238, 856);
        ctx.lineTo(300, 882); ctx.lineTo(258, 1010); ctx.lineTo(206, 1100); ctx.lineTo(-40, 1100); ctx.closePath();
      }, { fill: '#1A0E20', edge: PAL.ink, edgeW: 3, shadow: C.rgba('#000', .4), sx: 8, sy: 12 });

      // MIRA hanging - she is just past the cliff edge, nothing under her feet
      const release = lt >= 5.04;
      // backlight in the void so her silhouette separates from the wall
      const back = ctx.createRadialGradient(900, 940, 20, 900, 940, 300);
      back.addColorStop(0, 'rgba(255,186,110,.30)'); back.addColorStop(.5, 'rgba(224,96,70,.12)'); back.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = back; ctx.fillRect(600, 660, 620, 460);
      if (!release) {
        const sw = Math.sin(t * 2.6);
        mira(ctx, 936, 1110, .68, {
          t,
          pose: {
            sway: sw * 6, lean: .1,
            armL: [.5, .25], armR: [-2.95, .08],
            legL: [.14 + sw * .1, .3], legR: [-.1 - sw * .08, -.26], headTilt: .08, hairSwing: 22
          },
          face: { eyes: 'wide', mouth: 'wobble', look: [.6, -1] }
        });
        // tear
        ctx.fillStyle = '#BFE4F2'; ctx.beginPath(); ctx.ellipse(950, 764, 4, 9, .1, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(PAL.cream, .8); ctx.lineWidth = 1; ctx.stroke();
        // gripping hand locked over the lip
        const gripOpen = C.clamp((lt - 4.35) / .7);
        ctx.save();
        // palm
        paper(ctx, () => blobPath(ctx, 1003, 699 + gripOpen * 5, 13, 11, 12, .06, 7), { fill: '#D9A87F', edge: C.rgba(PAL.ink, .55), edgeW: 1.5, shadow: C.rgba(PAL.ink, .22), sx: 2, sy: 4 });
        // four fingers curling down the front of the lip
        for (let i = 0; i < 4; i++) {
          const fx = 991 + i * 6.4;
          const open = gripOpen * (.35 + i * .16);
          ctx.save(); ctx.translate(fx, 700 + gripOpen * 5); ctx.rotate(-.06 + open);
          paper(ctx, () => roundRectPath(ctx, -2.7, 0, 5.5, 10 + (i % 2) * 2, 2.4), { fill: i % 2 ? '#CFA079' : '#DDB08A', edge: C.rgba(PAL.ink, .5), edgeW: 1, shadow: null });
          ctx.restore();
        }
        ctx.restore();
        // knuckle highlight
        ctx.fillStyle = C.rgba(PAL.cream, .16); ctx.beginPath(); ctx.ellipse(1001, 694, 9, 3.4, -.1, 0, TAU); ctx.fill();
        // slip sparks
        if (lt > 4.35) {
          const sl = C.seg(lt, 4.35, 5.04);
          ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .75); ctx.lineWidth = 3; ctx.lineCap = 'round';
          for (let i = 0; i < 3; i++) {
            const a = .5 + i * .9;
            ctx.beginPath(); ctx.moveTo(1012 + Math.cos(a) * 12, 710 + Math.sin(a) * 12);
            ctx.lineTo(1012 + Math.cos(a) * (26 + sl * 32), 710 + Math.sin(a) * (26 + sl * 44)); ctx.stroke();
          }
          ctx.restore();
        }
      } else {
        // the fall
        const fy = 1110 + 760 * C.easeIn(rel);
        const fx = 936 - 210 * rel;
        const hipY = fy - 270 * .68;
        ctx.save(); ctx.translate(fx, hipY); ctx.rotate(.1 + rel * .95);
        mira(ctx, 0, 270 * .68, .68, {
          t,
          pose: { armL: [-2.55, -.3], armR: [2.7, .25], legL: [-.45, -.35], legR: [.4, .3], headTilt: .16, hairSwing: 24 },
          face: { eyes: 'wide', mouth: 'o', look: [0, 1] }
        });
        ctx.restore();
        // speed streaks
        ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.moveTo(fx - 40 + i * 22, hipY - 200 + i * 8); ctx.lineTo(fx - 40 + i * 22, hipY - 120 + i * 8); ctx.stroke();
        }
        ctx.restore();
        // fallen shoe
        const sh = C.seg(lt, 5.16, 5.8);
        ctx.save(); ctx.translate(936 - 26 * sh, 890 + 220 * C.easeIn(sh)); ctx.rotate(sh * 5);
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-15, -8); ctx.lineTo(10, -8); ctx.quadraticCurveTo(24, -2, 24, 10); ctx.lineTo(-15, 10); ctx.closePath(); },
          { fill: PAL.cream, edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, .16), sx: 2, sy: 3 });
        ctx.fillStyle = PAL.red; ctx.fillRect(-11, 4, 26, 3);
        ctx.restore();
      }

      // GATO at the edge
      const gatoArm = release ? -.9 : -.42;
      const gatoLean = release ? -.02 : -.1;
      const glowLook = C.clamp((t - 90.0) / 3.2);
      gato(ctx, 1250, 692, .78, {
        t,
        pose: {
          armL: [gatoArm, release ? -.2 : -.27], armR: [.9, -1.9],
          lean: gatoLean, headTilt: .16, hairSwing: -16, bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 3
        },
        face: { eyes: release ? 'wide' : 'narrow', mouth: release ? 'o' : 'flat', blush: .5, look: [-.8, .5 + glowLook * .3] }
      });
      // laser pointer in her far hand
      if (t > 90.0 && t < 94.1) {
        ctx.save(); ctx.translate(1142, 428); ctx.rotate(-.47);
        ctx.fillStyle = PAL.ink; ctx.fillRect(-4, 0, 8, 24);
        ctx.fillStyle = PAL.gold; ctx.fillRect(-4, 4, 8, 2);
        ctx.fillStyle = PAL.red; ctx.fillRect(-3, 22, 6, 5);
        ctx.strokeStyle = C.rgba(PAL.cream, .4); ctx.lineWidth = 1; ctx.strokeRect(-4, 0, 8, 27);
        ctx.restore();
      }
      // tail flick
      ctx.save(); ctx.strokeStyle = PAL.pink; ctx.globalAlpha = .5; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.restore();
      // laser dot near the hand / cliff
      if (t > 90.05 && t < 94.1) {
        const u = C.seg(t, 90.05, 93.8);
        const lx = C.lerp(1122, 1000, u) + Math.sin(u * 22) * 9;
        const ly = C.lerp(456, 698, u) + Math.cos(u * 17) * 7;
        ctx.save(); ctx.globalAlpha = .26; ctx.strokeStyle = PAL.redL; ctx.lineWidth = 1.7;
        ctx.beginPath(); ctx.moveTo(1128, 450); ctx.lineTo(lx, ly); ctx.stroke();
        ctx.restore();
        ctx.save(); ctx.globalAlpha = .18;
        for (let i = 0; i < 6; i++) { ctx.fillStyle = PAL.redL; ctx.beginPath(); ctx.arc(lx - i * 9, ly + i * 4, 5 - i * .5, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1; ctx.shadowColor = PAL.red; ctx.shadowBlur = 26;
        ctx.fillStyle = PAL.redL; ctx.beginPath(); ctx.arc(lx, ly, 7, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0; ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(lx - 2, ly - 2, 2.2, 0, TAU); ctx.fill();
        ctx.restore();
      }
      if (t > 93.15 && t < 93.9) {
        ctx.save(); ctx.translate(1305, 250); ctx.rotate(.12);
        TY.type(ctx, '!', 0, 0, 76, { family: 'Archivo Black', color: PAL.red, edge: PAL.cream, edgeW: 5, seed: 4, time: t });
        ctx.restore();
      }
      // grip HUD is drawn after the camera so it never collides with MIRA
      // rising clips at the bottom
      if (rel > .55) {
        const cp = C.seg(rel, .55, 1);
        ctx.save(); ctx.globalAlpha = cp;
        for (let i = 0; i < 20; i++) {
          const cx = C.hash(i * 3.1) * 900;
          const cy = 1080 - cp * (120 + C.hash(i * 7.3) * 280);
          paperclip(ctx, cx, cy, .7 + C.hash(i * 5.1) * .8, { rot: C.hash(i * 11.1) * TAU, col: i % 3 ? PAL.silver : PAL.goldL, face: false });
        }
        ctx.restore();
      }
      endCam(ctx);

      // grip HUD, pinned in screen space so it never collides with MIRA
      let grip = 99;
      if (t > 90.6) grip = 84;
      if (t > 92.0) grip = 63;
      if (t > 93.0) grip = 37;
      if (t > 94.2) grip = 11;
      if (t > 94.36) grip = 0;
      if (t > 89.9) {
        ctx.save(); ctx.translate(248, 716); ctx.rotate(-.05);
        paper(ctx, () => tornRectPath(ctx, -78, -29, 156, 58, 2, 21), { fill: C.rgba(PAL.ink, .9), edge: PAL.gold, edgeW: 1.4, shadow: C.rgba(PAL.ink, .3), sx: 4, sy: 7 });
        TY.text(ctx, 'GRIP', -62, -9, 10, { family: 'DMMono', color: C.rgba(PAL.cream, .6), letter: 2 });
        TY.text(ctx, grip + '%', -62, 19, 25, { family: 'DMMono', color: grip > 40 ? PAL.acid : PAL.red, letter: -1 });
        ctx.fillStyle = C.rgba(PAL.cream, .2); ctx.fillRect(-4, 3, 56, 7);
        ctx.fillStyle = grip > 40 ? PAL.acid : PAL.red; ctx.fillRect(-4, 3, 56 * grip / 100, 7);
        ctx.strokeStyle = C.rgba(PAL.cream, .3); ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-4 + i * 11.2, 3); ctx.lineTo(-4 + i * 11.2, 10); ctx.stroke(); }
        ctx.restore();
      }

      // vertical lyric on the chasm
      paper(ctx, () => tornRectPath(ctx, 372, 44, 116, 792, 5, 17), { fill: 'rgba(18,8,18,.58)', edge: C.rgba(PAL.cream, .14), edgeW: 1.5, shadow: C.rgba('#000', .35), sx: 8, sy: 14 });
      const phrase = "DON'T LET ME GO";
      const chars = [...phrase];
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch === ' ') continue;
        const app = C.clamp((t - (89.55 + i * .075)) / .3);
        if (app <= 0) continue;
        const fall = Math.max(0, lt - 5.06);
        const drop = fall * fall * (380 + C.hash(i * 7.7) * 620);
        const sway = Math.sin(t * 1.6 + i * .7) * 3 + fall * (C.hash(i * 3.1) - .5) * 70;
        TY.type(ctx, ch, 430 + sway, 104 + i * 52 + drop, 56, {
          family: 'DMMono', color: PAL.cream, edge: PAL.ink, edgeW: 4,
          shadow: C.rgba(PAL.ink, .45), shadowOff: 5, seed: i * 3.7 + 2, time: t,
          appear: app, charRot: .02, rot: fall * (C.hash(i * 5.3) - .5) * 1.2
        });
      }
      // GATO sticker
      ctx.save(); ctx.translate(1566, 232); ctx.rotate(.06);
      for (const sx of [-1, 1]) {
        ctx.save(); ctx.translate(sx * 42, -58); ctx.rotate(sx * .18);
        ctx.beginPath(); ctx.moveTo(-16, 14); ctx.lineTo(0, -28); ctx.lineTo(18, 12); ctx.closePath();
        ctx.fillStyle = PAL.pink; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(0, -14); ctx.lineTo(8, 5); ctx.closePath(); ctx.fillStyle = PAL.cream; ctx.fill();
        ctx.restore();
      }
      TY.sticker(ctx, 'GATO', 0, 0, 31, { fill: PAL.pink, text: PAL.ink, rot: -.03, seed: 8, padX: 22, padY: 13, barcode: true, tape: false });
      TY.text(ctx, 'mrrp?', 0, 60, 14, { family: 'Instrument Serif', italic: true, color: C.rgba(PAL.cream, .8), align: 'center' });
      ctx.restore();

      // title bloom at release
      if (rel > .08) {
        ctx.save(); ctx.globalAlpha = C.clamp(rel * 2.4); ctx.translate(1450, 860); ctx.rotate(-.09);
        TY.sticker(ctx, 'LET GO', 0, 0, 30, { fill: PAL.red, text: PAL.cream, rot: 0, seed: 8, padX: 24, padY: 14, tape: true, barcode: false });
        ctx.restore();
      }
      dustMotes(ctx, t, 34, 0, 500, W, 1000, C.rgba(PAL.goldL, .8), 14);
      flash(ctx, (1 - C.seg(lt, 0, .28)) * .6, '#FFC978');
      if (lt > 5.68) flash(ctx, (1 - C.seg(lt, 5.68, 5.86)) * .9, '#FFD88C');
    }
  });
})();
