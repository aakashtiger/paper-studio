/* ============================================================
   CLAUDE POP — ACT II  (22.72 – 58.94)
   ============================================================ */
(() => {
  const PET = [FLOWERS.daisy, FLOWERS.poppy, FLOWERS.tulip, FLOWERS.corn, FLOWERS.mari];
  const PETCOL = [PAL.pink, PAL.blue, PAL.gold, PAL.green, PAL.orange];

  function backingPetals(ctx, t, xs, y, s = .62, phase = 0) {
    for (let i = 0; i < xs.length; i++) {
      const p = C.beat(t) + i * .14 + phase;
      idol(ctx, xs[i], y, s, {
        t,
        pose: { bounce: -Math.abs(Math.sin(p * Math.PI)) * 12, sway: Math.sin(p * Math.PI) * 4, armL: [-.85, -.25], armR: [.85, .25], headTilt: Math.sin(p * Math.PI) * .07 },
        flower: PET[i % 5],
        outfit: 'stage', colors: { jacket: PETCOL[i % 5], sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.blue },
        petals: 13, earrings: false, shadow: .8
      });
    }
  }

  /* ---------- 07 chorus 1: P(DOOM) stage ---------- */
  scene({
    id: 'chorus1', start: 22.72, end: 24.36, lyric: 'sub',
    draw(t, lt) {
      const z = C.kf(lt, [[0, 1.7], [.45, 1.0], [1.64, 1.05]]);
      setCam(C.lerp(1370, 960, C.seg(lt, 0, .55)), 570, z, 0, lt < .4 ? 7 : 1, t);
      beginCam(ctx);
      stageSet(ctx, t, { crowd: true, confetti: 55, rot: .1, rayA: '#B92A16', rayB: '#D94728', floor: PAL.blue });
      backingPetals(ctx, t, [760, 870, 980, 1090, 1200], 956, .68, .2);
      const ph = C.beat(t);
      idol(ctx, 1340, 1008, 1.16, {
        t,
        pose: {
          bounce: -Math.abs(Math.sin(ph * Math.PI)) * 18, sway: Math.sin(ph * Math.PI) * 7,
          armL: [-1.9, -.25], armR: [1.9, -.2],
          legL: [-.1, -.03], legR: [.1, .03], headTilt: .05, hairSwing: 10,
          petalDrift: Math.sin(t * .8) * .05
        },
        face: { eyes: 'happy', mouth: 'sing', sing: .8, blush: .7, look: [0, -.1] },
        outfit: 'stage', halo: 1
      });
      // doom meter prop
      doomMeter(ctx, 1780, 1010, 1.0, doomAt(t), { lookX: -1 });
      endCam(ctx);
      // monumental type
      TY.type(ctx, 'P(DOOM)', 74, 448, 248, {
        color: PAL.cream, edge: PAL.ink, edgeW: 10, shadow: C.rgba(PAL.ink, .4), shadowOff: 14,
        chrome: [PAL.cream, PAL.redL, PAL.red, PAL.redD], seed: 9, time: t, charRot: .02, rot: -.03,
        perChar: (i) => C.clamp((t - 22.72 - i * .035) / .4)
      });
      if (t > 23.72) {
        TY.type(ctx, '34%', 112, 620, 154, { color: PAL.acid, edge: PAL.ink, edgeW: 9, shadow: C.rgba(PAL.ink, .34), seed: 4, time: t });
      }
      TY.text(ctx, 'GLOBAL RISK ASSESSMENT / LIVE', 86, 682, 12, { family: 'DMMono', color: PAL.cream, letter: 2 });
      if (lt > 1.4) flash(ctx, C.seg(lt, 1.4, 1.64) * .6, PAL.cream);
    }
  });

  /* ---------- 08 FOOM ---------- */
  scene({
    id: 'foom', start: 24.36, end: 26.18, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#F8D07E', '#E15834', { x: 700, y: 880, r: 1400, n: 32, c1: '#FFE3A8', c2: '#E15834', rot: t * .1, a: .5 });
      // clouds
      for (let i = 0; i < 4; i++) drawCloud(ctx, 150 + i * 540, 760 + (i % 2) * 40, 1.5, C.rgba(PAL.cream, .5));
      speedStreaks(ctx, t, 36, PAL.cream, .28, 0, H);
      // rocket path — stays in frame until the FOOM
      const u = C.seg(lt, 0, 1.6);
      const launch = C.seg(lt, .45, 1.6);
      const rx = 610 + 210 * C.easeOut(u) + Math.sin(lt * 3.4) * 66 * launch;
      const ry = 830 - 640 * C.easeIn(launch);
      const rot = -.52 + Math.sin(u * 9) * .14;
      setCam(960, 560, 1.02, 0, lt > 1.1 ? 12 : 2, t);
      beginCam(ctx);
      // shock rings
      for (let i = 0; i < 3; i++) {
        const rr = 120 + i * 170 + u * 350;
        ctx.strokeStyle = C.rgba(PAL.cream, .28 - i * .06); ctx.lineWidth = 16 - i * 3;
        ctx.beginPath(); ctx.arc(610, 820, rr, 0, TAU); ctx.stroke();
      }
      // blown-back petals, leaning away from the launch
      const pp = [FLOWERS.daisy, FLOWERS.poppy, FLOWERS.tulip, FLOWERS.corn, FLOWERS.mari];
      const pc = [PAL.pink, PAL.blue, PAL.gold, PAL.green, PAL.orange];
      for (let i = 0; i < 5; i++) {
        const bp = C.beat(t) + i * .15;
        idol(ctx, 200 + i * 132, 990, .58, {
          t, pose: {
            bounce: -Math.abs(Math.sin(bp * Math.PI)) * 8, lean: -.22,
            armL: [-2.35, -.4], armR: [.55, .5], legL: [-.12, -.06], legR: [.1, .06],
            headTilt: -.12, hairSwing: -10
          },
          flower: pp[i], outfit: 'stage', colors: { jacket: pc[i], sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.blue },
          petals: 13, earrings: false, shadow: .7
        });
      }
      // exhaust trail
      for (let i = 0; i < 9; i++) {
        const tr = C.clamp((launch - i * .045) * 2.4);
        ctx.fillStyle = C.rgba(i % 2 ? PAL.cream : PAL.goldL, tr * .4);
        ctx.beginPath(); ctx.arc(rx + Math.sin(t * 7 + i) * 16, ry + 130 + i * 34, 34 + i * 9, 0, TAU); ctx.fill();
      }
      // rocket group
      ctx.save(); ctx.translate(rx, ry); ctx.rotate(rot);
      drawRocket(ctx, 0, 0, 1.28, 0, .8 + u * .7, t);
      // SOL riding it
      ctx.translate(0, 50); ctx.rotate(-rot * .7);
      idol(ctx, 0, 0, .62, {
        t, pose: { armL: [-2.7, -.2], armR: [2.7, .2], legL: [-.55, -.1], legR: [.55, .1], headTilt: .05, hairSwing: -12 },
        face: { eyes: 'star', mouth: 'grin', blush: .7 }, outfit: 'stage', halo: 1
      });
      ctx.restore();
      // smoke curlicues
      ctx.save(); ctx.strokeStyle = C.rgba(PAL.cream, .4); ctx.lineWidth = 10; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU + t;
        ctx.beginPath(); ctx.arc(600 + Math.cos(a) * 90, 850 + Math.sin(a) * 45, 50 + i * 12, 0, TAU); ctx.stroke();
      }
      ctx.restore();
      endCam(ctx);

      // paper explosion cloud
      if (lt > 1.26) {
        const eu = C.seg(lt, 1.26, 1.62);
        ctx.save();
        for (let i = 0; i < 15; i++) {
          const a = i / 15 * TAU + .35;
          const rr = 90 + (i % 3) * 58 + eu * 250;
          const bx = 960 + Math.cos(a) * rr, by = 540 + Math.sin(a) * rr * .6;
          const rad = (54 + C.hash(i * 3.1) * 74) * (.45 + eu * .8);
          paper(ctx, () => blobPath(ctx, bx, by, rad, rad * .86, 15, .03, i), {
            fill: [PAL.cream, PAL.gold, PAL.redL][i % 3], edge: PAL.ink, edgeW: 2.5,
            shadow: C.rgba(PAL.ink, .18), sx: 5, sy: 9
          });
        }
        ctx.strokeStyle = PAL.cream; ctx.lineWidth = 9; ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
          const a = i / 5 * TAU + .6 + t;
          ctx.beginPath(); ctx.arc(960 + Math.cos(a) * 300, 560 + Math.sin(a) * 170, 38 + i * 11, .2, 2.7); ctx.stroke();
        }
        ctx.restore();
      }

      // FOOM type
      const shake = lt > 1.05 ? Math.sin(t * 82) * 12 : 0;
      ctx.save(); ctx.translate(960 + shake, 536); ctx.rotate(-.03);
      TY.type(ctx, 'FOOM', 0, 0, 376, {
        align: 'center', color: PAL.red, edge: PAL.cream, edgeW: 20, shadow: C.rgba(PAL.ink, .42), shadowOff: 20,
        seed: 7, time: t, charRot: .04, perChar: (i) => C.clamp((t - 25.7 - i * .04) / .3)
      });
      ctx.restore();
      if (t > 25.7) {
        for (let i = 0; i < 7; i++) {
          const a = i / 7 * TAU + t;
          drawPaperFlower(ctx, 960 + Math.cos(a) * 520, 520 + Math.sin(a) * 280, .5 + C.hash(i) * .6, PAL.goldD, PAL.cream, a);
        }
      }
      if (lt > 1.55) flash(ctx, C.seg(lt, 1.55, 1.82), '#FFF3D6');
    }
  });

  /* ---------- 09 Chinese room + shrooms ---------- */
  scene({
    id: 'chinese', start: 26.18, end: 29.72, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#090819', '#170C2C');
      starfield(ctx, t, 150, 9, 840);
      // floating score lines
      ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(0, 90 + i * 54); ctx.lineTo(W, 90 + i * 54); ctx.stroke(); }
      ctx.restore();
      const float = Math.sin(t * .7) * 8;
      setCam(960, 520, 1.02, Math.sin(t * .35) * .015, 0, t);
      beginCam(ctx);
      ctx.save(); ctx.translate(960, 528 + float); ctx.rotate(Math.sin(t * .29) * .025);
      // room outer
      paper(ctx, () => tornRectPath(ctx, -520, -310, 1040, 610, 5, 12), { fill: '#F0E0C4', edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .45), sx: 14, sy: 20 });
      // interior
      ctx.fillStyle = '#D9B98C'; ctx.fillRect(-490, -280, 980, 550);
      // chinese characters wallpaper
      const glyphs = ['中', '文', '房', '间', '规', '则', '符', '号', '人', '工', '智', '能', '翻', '译', '理', '解'];
      ctx.save(); ctx.globalAlpha = .38; ctx.fillStyle = '#6E2F1B';
      for (let row = 0; row < 6; row++) for (let col = 0; col < 12; col++) {
        const gx = -470 + col * 82 + (row % 2) * 20, gy = -240 + row * 84;
        TY.text(ctx, glyphs[(row * 7 + col) % glyphs.length], gx, gy, 38, { family: 'Black Han Sans', color: '#6E2F1B', align: 'center' });
      }
      ctx.restore();
      // shelves and rulebook
      ctx.fillStyle = '#6B3A1E'; ctx.fillRect(-470, -248, 300, 14); ctx.fillRect(-470, -142, 300, 14);
      for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? PAL.redD : PAL.blueD; ctx.fillRect(-452 + i * 38, -294, 28, 46); }
      paper(ctx, () => roundRectPath(ctx, -200, -248, 260, 148, 3), { fill: PAL.cream, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 5, sy: 8 });
      TY.text(ctx, 'RULES', -70, -212, 17, { family: 'Archivo Black', color: PAL.red, align: 'center', letter: 3 });
      for (let i = 0; i < 5; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .28); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-180, -186 + i * 20); ctx.lineTo(46, -186 + i * 20); ctx.stroke(); }
      // mail slots
      for (const [sx, lbl] of [[-420, 'IN'], [390, 'OUT']]) {
        ctx.fillStyle = PAL.ink; ctx.fillRect(sx, -60, 96, 18);
        TY.text(ctx, lbl, sx + 48, -24, 12, { family: 'DMMono', color: PAL.cream, align: 'center', letter: 2 });
      }
      // floor
      ctx.fillStyle = '#8C5A35'; ctx.fillRect(-500, 270, 1000, 30);
      // MIRA behind desk
      mira(ctx, 210, 262, .54, { t, pose: { armL: [-.5, -.2], armR: [.7, -.3], headTilt: .05 }, face: { eyes: 'wide', mouth: 'wobble', look: [-1, 0] } });
      // SOL shoving slips
      const shove = Math.sin(t * 9) * .25;
      idol(ctx, -260, 268, .62, {
        t, pose: { armL: [-.9 + shove, -.3], armR: [1.2, -.2], headTilt: -.05, sway: 4 }, face: { eyes: 'swirl', mouth: 'flat', blush: .5 },
        outfit: 'stage', halo: .5
      });
      // paper slips flying
      for (let i = 0; i < 20; i++) {
        const a = C.hash(i * 3.1) * TAU + t * .2;
        const px = -420 + C.frac(t * .35 + C.hash(i * 5.7)) * 840;
        const py = -40 + Math.sin(a) * 120;
        ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = PAL.cream; ctx.fillRect(-18, -8, 36, 16); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1; ctx.strokeRect(-18, -8, 36, 16); ctx.restore();
      }
      // shroom melt
      const sh = C.seg(lt, 1.55, 2.2);
      if (sh > 0) {
        ctx.save(); ctx.globalAlpha = sh * .55; ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = [PAL.pink, PAL.mint, PAL.gold, PAL.blueL, PAL.violet, PAL.acid][i];
          ctx.beginPath(); ctx.ellipse(-460 + i * 190, -120 + Math.sin(t * 2 + i) * 90, 140, 220, .4 + i * .2, 0, TAU); ctx.fill();
        }
        ctx.restore();
        for (let i = 0; i < 8; i++) {
          const mx = -430 + i * 118, my = 300 + Math.sin(t * 2.4 + i) * 22;
          drawMushroom(ctx, mx, my, .55 + C.hash(i * 3.1) * .7, [PAL.red, PAL.pink, PAL.gold, PAL.mint][i % 4], Math.sin(t + i) * .2);
        }
      }
      ctx.restore();
      endCam(ctx);

      // red seal
      ctx.save(); ctx.translate(1520, 190); ctx.rotate(.12);
      ctx.globalAlpha = C.seg(lt, .3, .8);
      ctx.fillStyle = PAL.red; ctx.fillRect(-130, -42, 260, 84);
      TY.text(ctx, 'CHINESE ROOM', 0, 12, 28, { family: 'Archivo Black', color: PAL.cream, align: 'center', letter: 2 });
      ctx.restore();
      if (sh > .2) {
        TY.type(ctx, 'SHROOMS', 960, 780, 226, {
          align: 'center', color: PAL.pink, edge: PAL.cream, edgeW: 14, shadow: C.rgba(PAL.ink, .38), shadowOff: 13,
          seed: 11, time: t, charRot: .1,
          perChar: (i) => C.clamp((t - 28.05 - i * .05) / .3)
        });
        TY.text(ctx, 'with a bag of', 960, 700, 24, { family: 'Instrument Serif', color: PAL.cream, align: 'center', alpha: C.seg(t, 27.95, 28.2) });
      }
      if (lt > 3.2) irisOverlay(ctx, 960, 520, C.kf(lt, [[3.2, 1200], [3.54, 40]]), '#0B0706', 60);
    }
  });

  /* ---------- 10 shoggoth ---------- */
  scene({
    id: 'shoggoth', start: 29.72, end: 33.4, lyric: 'sub',
    draw(t, lt) {
      ctx.fillStyle = '#080706'; ctx.fillRect(0, 0, W, H);
      const snap = C.seg(lt, 1.45, 1.7);
      setCam(960, 520, 1.02 + snap * .25, 0, snap > 0 && snap < 1 ? 10 : 1, t);
      beginCam(ctx);
      // red stage curtain scraps
      ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = PAL.red;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse(120 + i * 260, 80 + (i % 2) * 40, 180, 70, .2, 0, TAU); ctx.fill(); }
      ctx.restore();
      // shoggoth
      shoggoth(ctx, 960, 880, 1.65, { t, mask: false, eyeCol: PAL.acid, lookX: -1 });
      // giant mask on a stick
      const mx = C.lerp(960, 1320, C.seg(lt, 1.65, 2.2)), my = C.lerp(430, 620, C.seg(lt, 1.65, 2.2));
      const mr = Math.sin(t * 1.3) * .12 + (lt > 1.65 ? .55 : 0);
      ctx.save(); ctx.translate(mx, my); ctx.rotate(mr); ctx.scale(2.15, 2.15);
      ctx.strokeStyle = '#B08A52'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 54); ctx.lineTo(0, 240); ctx.stroke();
      paper(ctx, () => blobPath(ctx, 0, 0, 90, 84, 18, .02, 2), { fill: PAL.goldL, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 8, sy: 12 });
      // smiley
      ctx.fillStyle = PAL.ink; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 28, -12, 9, 15, 0, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 10, 40, .12 * Math.PI, .88 * Math.PI); ctx.stroke();
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(0, 44, 6, 0, TAU); ctx.fill();
      ctx.restore();
      // SOL yanks it
      idol(ctx, 1430, 1006, .9, {
        t, pose: { armL: [-.4, -.2], armR: [1.45 - C.seg(lt, 1.65, 2.0) * .9, -.3], headTilt: .07, sway: 3 },
        face: { eyes: 'narrow', mouth: 'grin', blush: .5, look: [-1, 0] }, outfit: 'stage', halo: .7
      });
      // glow rays
      sparkles(ctx, 960, 700, t, 12, 420, PAL.acid, 4);
      endCam(ctx);

      // LIES grid
      const ga = C.seg(lt, .1, .6);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const x = 104 + c * 168, y = 132 + r * 92;
        if (ga < (r * 3 + c) / 12) continue;
        TY.type(ctx, 'LIES', x, y, 62, {
          color: PAL.cream, edge: PAL.ink, edgeW: 4, shadow: null, seed: r * 3 + c, time: t, rot: (C.hash(r * 7 + c) - .5) * .1
        });
        ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 8, y - 50); ctx.lineTo(x + 148, y + 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 150, y - 46); ctx.lineTo(x - 4, y + 7); ctx.stroke(); ctx.restore();
      }
      TY.text(ctx, 'SHOGGOTH.exe', 106, 640, 15, { family: 'DMMono', color: PAL.acid, letter: 2 });
      ctx.save(); ctx.globalAlpha = .5; TY.text(ctx, 'SHOGGOTH.exe', 110, 640, 15, { family: 'DMMono', color: PAL.red, letter: 2 }); ctx.restore();
      TY.text(ctx, 'AN ACTUAL SMILE', 110, 676, 12, { family: 'Instrument Serif', color: C.rgba(PAL.cream, .5) });
      if (lt > 1.55) TY.sticker(ctx, 'MASK OFF', 1430, 780, 26, { fill: PAL.acid, seed: 7, rot: .09 });
      if (lt > 3.0) irisOverlay(ctx, 1430, 520, C.kf(lt, [[3.0, 1200], [3.4, 50]]), '#050403', 50);
    }
  });

  /* ---------- 11 shinigami eyes ---------- */
  scene({
    id: 'eyes', start: 33.4, end: 35.5, lyric: 'sub',
    draw(t, lt) {
      ctx.fillStyle = '#0A0607'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = .25; sunburst(ctx, 960, 460, 0, 1100, 28, PAL.redD, '#3A0A0A', t * .15); ctx.restore();
      speedLines(ctx, 960, 470, 280, 820, 44, PAL.red, .26, t, 3);
      // apple falling
      const ay = C.kf(lt, [[.6, -100], [1.7, 1100]]);
      ctx.save(); ctx.translate(1510, ay); ctx.rotate(lt * 2);
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = '#4A2B18'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -42); ctx.quadraticCurveTo(8, -68, 24, -74); ctx.stroke();
      ctx.fillStyle = PAL.green; ctx.beginPath(); ctx.ellipse(28, -62, 16, 7, -.4, 0, TAU); ctx.fill(); ctx.restore();
      // eyes
      const blink = lt > .88 && lt < 1.0 ? 1 : 0;
      drawEye(ctx, 720, 430, 2.45, t, { blink, iris: PAL.redD, kanji: '死' });
      drawEye(ctx, 1220, 430, 2.45, t, { blink: lt > 1.55 && lt < 1.7 ? 1 : 0, iris: PAL.redD, kanji: '死' });
      // red thread
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 650); ctx.quadraticCurveTo(500, 560, 960, 650); ctx.quadraticCurveTo(1400, 740, W, 620); ctx.stroke();
      ctx.save(); ctx.translate(960, 650); ctx.rotate(-.2); ctx.fillStyle = PAL.cream; ctx.fillRect(-20, -10, 40, 20); ctx.restore();
      // MIRA tiny below
      mira(ctx, 960, 1020, .64, { t, pose: { armL: [-.2, -.1], armR: [.9, -.5], headTilt: .06 }, face: { eyes: 'wide', mouth: 'o', look: [0, -1] } });
      // UI
      TY.vertical(ctx, 'SHINIGAMI', 1600, 250, 72, { color: PAL.red, edge: PAL.cream, edgeW: 4, time: t, step: 76 });
      TY.type(ctx, 'EYES', 100, 900, 196, { color: PAL.cream, edge: PAL.red, edgeW: 10, shadow: C.rgba(PAL.ink, .4), seed: 4, time: t });
      const secs = Math.max(0, 7 - Math.floor(lt * 2));
      ctx.save(); ctx.translate(1430, 860); ctx.rotate(-.04);
      paper(ctx, () => tornRectPath(ctx, -190, -44, 380, 88, 4, 5), { fill: PAL.ink, edge: PAL.red, edgeW: 2, shadow: C.rgba(PAL.ink, .3), sx: 6, sy: 10 });
      TY.text(ctx, 'LIFESPAN', -168, -12, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .6), letter: 2 });
      TY.text(ctx, '00:00:0' + secs, -168, 28, 43, { family: 'DMMono', color: PAL.red, letter: 1 });
      ctx.restore();
      TY.text(ctx, 'RED THREAD / SEVERED', 92, 116, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .5), letter: 2 });
      if (lt > 1.85) flash(ctx, C.seg(lt, 1.85, 2.1) * .75, PAL.red);
    }
  });

  /* ---------- 12 dance break ---------- */
  scene({
    id: 'dance1', start: 35.5, end: 38.5, lyric: 'none',
    draw(t, lt) {
      const orbit = Math.sin(lt * 1.3) * 28;
      setCam(960 + orbit, 540, 1.04, Math.sin(lt * .7) * .015, 3, t);
      beginCam(ctx);
      stageSet(ctx, t, { crowd: true, confetti: 80, rot: -.2, rayA: '#D94728', rayB: '#F5B93F', floor: PAL.blue });
      // giant backdrop type
      ctx.save(); ctx.globalAlpha = .55;
      TY.type(ctx, 'P(DOOM)', 960, 340, 248, { align: 'center', color: PAL.redD, edge: PAL.cream, edgeW: 9, shadow: C.rgba(PAL.ink, .25), seed: 9, time: t, rot: -.02 });
      ctx.restore();
      // circle choreography
      const tt = t * .9;
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * TAU + tt * .35;
        const x = 960 + Math.cos(a) * 330, y = 900 + Math.sin(a) * 54;
        const beat = C.beat(t) + i * .2;
        idol(ctx, x, y, .63 + Math.sin(a) * .04, {
          t, pose: {
            bounce: -Math.abs(Math.sin(beat * Math.PI)) * 16, sway: Math.sin(beat * Math.PI) * 9,
            armL: i % 2 ? [-2.4, -.2] : [-.9, -.2], armR: i % 2 ? [2.4, .2] : [.9, .2],
            headTilt: Math.sin(a) * .08
          }, flower: PET[i], outfit: 'stage', colors: { jacket: PETCOL[i], sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.blue }, petals: 13, earrings: false
        });
      }
      const ph = C.beat(t);
      idol(ctx, 960, 1002, 1.1, {
        t, pose: {
          bounce: -Math.abs(Math.sin(ph * Math.PI)) * 24, sway: Math.sin(ph * Math.PI) * 8,
          armL: [-2.05, -.3], armR: [2.05, .3], legL: [-.09, -.03], legR: [.09, .03], headTilt: .04, hairSwing: 12
        }, face: { eyes: 'star', mouth: 'sing', sing: .9, blush: .7, look: [0, -.1] }, outfit: 'stage', halo: 1
      });
      doomMeter(ctx, 1790, 1012, 1.0, 48, { lookX: -1 });
      endCam(ctx);
      TY.sticker(ctx, 'DANCE BREAK', 120, 860, 28, { fill: PAL.acid, seed: 8, rot: -.045, barcode: true });
      TY.text(ctx, 'FORMATION: FLOWER / 6', 92, 944, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .55), letter: 2 });
      if (lt > 2.9) flash(ctx, C.seg(lt, 2.9, 3.2) * .5, PAL.cream);
    }
  });

  /* ---------- 13 gym / stable run ---------- */
  scene({
    id: 'gym', start: 38.5, end: 41.36, lyric: 'sub',
    draw(t, lt) {
      setCam(760, 540, 1.0 + Math.sin(lt) * .01, 0, 1, t);
      beginCam(ctx);
      gymSet(ctx, t);
      // SOL running on treadmill
      const run = C.beat(t);
      ctx.save(); ctx.translate(430, 862); ctx.scale(.9, .9);
      idol(ctx, 0, 0, 1, {
        t, pose: {
          armL: [-.7 + Math.sin(run * Math.PI) * 1.2, -.3], armR: [.7 - Math.sin(run * Math.PI) * 1.2, -.3],
          legL: [.55 * Math.sin(run * Math.PI), -.25], legR: [-.55 * Math.sin(run * Math.PI), -.25],
          bounce: -Math.abs(Math.sin(run * Math.PI)) * 18, lean: .12, headTilt: -.06, hairSwing: 8
        }, face: { eyes: 'happy', mouth: 'sing', sing: .5, blush: .65 },
        outfit: 'gym', colors: { jacket: PAL.mint }, halo: .6
      });
      ctx.restore();
      // MIRA with clipboard
      mira(ctx, 810, 1014, .94, { t, pose: { armL: [-.4, -.25], armR: [.85, -.6], headTilt: .04 }, face: { eyes: 'dot', mouth: 'smile', look: [-1, 0] } });
      // flat TV line
      drawTV(ctx, 220, 560, 250, 150, t, { mode: 'flat' });
      endCam(ctx);
      TY.sticker(ctx, 'STABLE', 1040, 216, 62, { fill: PAL.mint, seed: 4, rot: -.03, textEdge: null });
      TY.text(ctx, 'RUN 0042', 90, 110, 18, { family: 'DMMono', color: PAL.teal, letter: 3 });
      TY.text(ctx, 'SAFETY EVAL: NOMINAL', 90, 144, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .55), letter: 2 });
      TY.text(ctx, 'n=1', 1600, 250, 30, { family: 'DMMono', color: PAL.red, align: 'center' });
      TY.text(ctx, 'one run', 1600, 280, 13, { family: 'Instrument Serif', color: C.rgba(PAL.ink, .55), align: 'center' });
    }
  });

  /* ---------- 14 singularity in the gym ---------- */
  scene({
    id: 'singularity', start: 41.36, end: 44.98, lyric: 'sub',
    draw(t, lt) {
      setCam(880, 540, 1.02, C.seg(lt, 1.4, 3.4) * .13, 2 + C.seg(lt, 2, 3.4) * 9, t);
      beginCam(ctx);
      gymSet(ctx, t);
      // black hole opens in the window
      blackHole(ctx, 1510, 500, 110 + C.seg(lt, .2, 2.2) * 230, t, {});
      // treadmill max + characters
      const run = C.beat(t) * 1.6;
      ctx.save(); ctx.translate(400, 860); ctx.rotate(-.04);
      idol(ctx, 0, 0, .92, {
        t, pose: {
          armL: [-2.2, -.2], armR: [2.2, .2], legL: [.7 * Math.sin(run * Math.PI), -.2], legR: [-.7 * Math.sin(run * Math.PI), -.2],
          bounce: -Math.abs(Math.sin(run * Math.PI)) * 22, lean: .2, headTilt: -.08, hairSwing: 14
        }, face: { eyes: 'star', mouth: 'grin', blush: .7 }, outfit: 'gym', colors: { jacket: PAL.mint }, halo: .8
      });
      ctx.restore();
      // MIRA flaps like a flag
      ctx.save(); ctx.translate(740, 800); ctx.rotate(-.9 + Math.sin(t * 5) * .18);
      mira(ctx, 0, 0, .7, { t, pose: { armL: [-2.9, 0], armR: [2.9, 0], legL: [-.4, 0], legR: [.4, 0] }, face: { eyes: 'swirl', mouth: 'o' } });
      ctx.restore();
      // objects orbiting
      for (let i = 0; i < 16; i++) {
        const a = i * 1.7 + t * (1 + C.hash(i) * .8);
        const rr = 220 + C.hash(i * 3.1) * 420;
        const px = 1510 + Math.cos(a) * rr, py = 500 + Math.sin(a) * rr * .48;
        ctx.save(); ctx.translate(px, py); ctx.rotate(a);
        if (i % 3 === 0) drawPaperclipIcon(ctx, 0, 0, .35, PAL.silver, 0);
        else if (i % 3 === 1) drawPaperFlower(ctx, 0, 0, .38, PAL.goldD, PAL.cream, 0);
        else { ctx.fillStyle = PAL.cream; ctx.fillRect(-18, -8, 36, 16); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.5; ctx.strokeRect(-18, -8, 36, 16); }
        ctx.restore();
      }
      // speed lines into hole
      speedLines(ctx, 1510, 500, 200, 900, 36, PAL.cream, .25, t, 8);
      endCam(ctx);

      // SINGULARITY letters pulled in
      const word = 'SINGULARITY';
      for (let i = 0; i < word.length; i++) {
        const bx = 120 + i * 162;
        const pull = C.seg(lt, 1.6 + i * .03, 2.4 + i * .03);
        const x = C.lerp(bx, 1510, C.easeIn(pull)), y = C.lerp(250, 500, C.easeIn(pull));
        const sc = 1 - pull * .85;
        ctx.save(); ctx.globalAlpha = 1 - pull * .7; ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(pull * 2 + i * .1);
        TY.type(ctx, word[i], 0, 0, 116, { color: PAL.cream, edge: PAL.ink, edgeW: 8, shadow: C.rgba(PAL.ink, .4), seed: i, time: t });
        ctx.restore();
      }
      if (lt > 3.0) irisOverlay(ctx, 1510, 500, C.kf(lt, [[3.0, 1400], [3.55, 50]]), '#070303', 60);
    }
  });

  /* ---------- 15 accelerating ---------- */
  scene({
    id: 'accel', start: 44.98, end: 49.52, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#DFF26A', '#61B8B0');
      // horizon hills
      for (let layer = 0; layer < 3; layer++) {
        ctx.fillStyle = [PAL.violet, PAL.blueD, PAL.ink][layer];
        ctx.beginPath(); ctx.moveTo(0, 720 + layer * 60);
        for (let i = 0; i <= 10; i++) ctx.lineTo(i * 192, 720 + layer * 60 - (60 + C.hash(i * 3 + layer) * 130) * (1 - layer * .15));
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      }
      // road
      ctx.fillStyle = '#2E2723'; ctx.beginPath(); ctx.moveTo(0, 900); ctx.lineTo(W, 900); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAL.cream;
      for (let i = 0; i < 8; i++) { const x = C.loop(i * 280 + t * 900, -200, W + 200); ctx.fillRect(x, 970, 150, 12); }
      speedStreaks(ctx, t, 45, PAL.cream, .4, 0, 880);
      setCam(760 + C.seg(lt, 0, 3) * 300, 540, 1.04, -.015, 5, t);
      beginCam(ctx);
      // train
      ctx.save(); ctx.translate(C.loop(120 - lt * 120, -500, 1600), 840);
      paper(ctx, () => roundRectPath(ctx, -260, -120, 520, 180, 24), { fill: PAL.blue, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 10, sy: 14 });
      ctx.fillStyle = PAL.cream; ctx.fillRect(-230, -90, 110, 60); ctx.fillRect(-80, -90, 110, 60); ctx.fillRect(70, -90, 110, 60);
      ctx.fillStyle = PAL.red; ctx.fillRect(-260, 20, 520, 12);
      // smokestack + cowcatcher
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-220, -120); ctx.lineTo(-190, -120); ctx.lineTo(-184, -176); ctx.lineTo(-226, -176); ctx.closePath(); }, { fill: PAL.ink, edge: PAL.ink, edgeW: 2 });
      ctx.fillStyle = PAL.cream; ctx.fillRect(-230, -154, 52, 12);
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.moveTo(-260, 60); ctx.lineTo(-330, 100); ctx.lineTo(-260, 100); ctx.closePath(); ctx.fill();
      // wheels
      for (let i = 0; i < 4; i++) { ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(-190 + i * 126, 60, 30, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.silver; ctx.beginPath(); ctx.arc(-190 + i * 126, 60, 12, 0, TAU); ctx.fill(); }
      TY.text(ctx, 'TRAIN', 0, 66, 20, { family: 'Archivo Black', color: PAL.cream, align: 'center', letter: 3 });
      ctx.restore();
      // jet
      ctx.save(); ctx.translate(1560, 300 + Math.sin(t) * 20); ctx.rotate(-.08);
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(70, -20); ctx.lineTo(130, 0); ctx.lineTo(70, 20); ctx.closePath(); }, { fill: PAL.cream, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .25), sx: 5, sy: 9 });
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(-30, -12); ctx.lineTo(10, -70); ctx.lineTo(40, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAL.blue; ctx.beginPath(); ctx.moveTo(-20, 8); ctx.lineTo(20, 50); ctx.lineTo(44, 8); ctx.closePath(); ctx.fill();
      ctx.restore();
      // hot-rod kart + heroes
      const bx = 740 + Math.sin(t * 9) * 4, by = 892;
      ctx.save(); ctx.translate(bx, by);
      // exhaust
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = [PAL.gold, PAL.cream, PAL.red][i];
        ctx.beginPath(); ctx.moveTo(-232, 6 + i * 8); ctx.lineTo(-300 - i * 26 - Math.sin(t * 22 + i) * 16, 16 + i * 8); ctx.lineTo(-232, 28 + i * 8); ctx.closePath(); ctx.fill();
      }
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-220, 0); ctx.lineTo(190, 0); ctx.lineTo(230, 40); ctx.lineTo(-230, 40); ctx.closePath(); }, { fill: PAL.red, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .32), sx: 9, sy: 13 });
      ctx.fillStyle = PAL.blue; ctx.fillRect(-180, 8, 120, 14);
      TY.text(ctx, '0042', 40, 30, 14, { family: 'DMMono', color: PAL.cream, letter: 2 });
      for (let i = 0; i < 2; i++) { ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(-120 + i * 240, 48, 38, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.silver; ctx.beginPath(); ctx.arc(-120 + i * 240, 48, 17, 0, TAU); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.translate(bx, by); ctx.scale(.7, .7);
      idol(ctx, -40, 0, .8, { t, flowerR1: 100, pose: { armL: [2.1, .3], armR: [-2.1, .3], legL: [-1.1, -.2], legR: [.5, -.2], lean: -.18, headTilt: .1, hairSwing: 20 }, face: { eyes: 'star', mouth: 'grin', blush: .7 }, outfit: 'stage', halo: .7 });
      mira(ctx, -168, 10, .62, { t, pose: { armL: [2.2, .2], armR: [-2.2, .2], legL: [-1.2, -.2], legR: [.6, -.1], lean: .2 }, face: { eyes: 'wide', mouth: 'o' } });
      ctx.restore();
      // speedometer
      ctx.save(); ctx.translate(1460, 760);
      paper(ctx, () => { ctx.beginPath(); ctx.arc(0, 0, 90, 0, TAU); }, { fill: PAL.cream, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 7, sy: 11 });
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 72, Math.PI, Math.PI * 1.7); ctx.stroke();
      const a = Math.PI * 1.72 + Math.sin(t * 4) * .04;
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 60, Math.sin(a) * 60); ctx.stroke();
      TY.text(ctx, 'GOOD', 0, 46, 16, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 2 });
      ctx.restore();
      endCam(ctx);

      // signage
      ctx.save(); ctx.translate(1340, 260); ctx.rotate(.06);
      paper(ctx, () => roundRectPath(ctx, -210, -56, 420, 112, 5), { fill: PAL.blue, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .28), sx: 8, sy: 14 });
      TY.type(ctx, 'OPTIMIZING', 0, 22, 54, { align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 3, shadow: null, seed: 4, time: t });
      ctx.restore();
      TY.type(ctx, 'ACCELERATING', 960, 690, 150, {
        align: 'center', color: PAL.ink, edge: PAL.cream, edgeW: 10, shadow: C.rgba(PAL.ink, .3),
        seed: 6, time: t, charRot: .08, rot: -.05, perChar: (i) => C.clamp((t - 47.3 - i * .015) / .3)
      });
      for (let i = 0; i < 3; i++) {
        const fa = C.seg(lt, .35 + i * .18, .72 + i * .18);
        ctx.save(); ctx.globalAlpha = fa * (1 - i * .12);
        TY.text(ctx, 'FASTER', 92, 216 + i * 84, 34 + i * 26, { family: 'Archivo Black', color: PAL.ink, stroke: PAL.cream, strokeW: 4, letter: 2 });
        ctx.restore();
      }
    }
  });

  /* ---------- 16 atoms rearranging ---------- */
  scene({
    id: 'atoms', start: 49.52, end: 52.8, lyric: 'sub',
    draw(t, lt) {
      ctx.fillStyle = '#F5EEDC'; ctx.fillRect(0, 0, W, H);
      // giant halftone field
      halftone(ctx, 0, 0, W, H, PAL.blue, 22, .45, .14);
      halftone(ctx, 0, 0, W, H, PAL.pink, 24, .4, .11, .7);
      setCam(960, 540, 1.0 + lt * .035, Math.sin(lt * .4) * .04, 0, t);
      beginCam(ctx);
      // fractured idol
      ctx.save(); ctx.globalAlpha = .62;
      idol(ctx, 960, 1000, 1.25, {
        t, pose: { armL: [-2.0, -.2], armR: [2.0, .2], headTilt: Math.sin(t) * .08, sway: 4, legL: [-.05, 0], legR: [.05, 0] },
        face: { eyes: 'swirl', mouth: 'o', blush: .6 }, outfit: 'stage', halo: 1
      });
      ctx.restore();
      // CMYK dots swarm
      for (let i = 0; i < 260; i++) {
        const a = C.hash(i * 3.1) * TAU + t * (.3 + C.hash(i) * .5);
        const rr = 80 + C.frac(C.hash(i * 5.7) + t * .08) * 640;
        const px = 960 + Math.cos(a) * rr, py = 540 + Math.sin(a) * rr * .66;
        ctx.fillStyle = [PAL.red, PAL.blue, PAL.gold, PAL.pink, PAL.ink][i % 5];
        ctx.globalAlpha = .25 + C.hash(i * 7.1) * .65;
        ctx.beginPath(); ctx.arc(px, py, 2 + C.hash(i * 2.3) * 12, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // shards
      paperShards(ctx, 960, 620, t, 30, [PAL.cream, PAL.red, PAL.gold, PAL.blue], 520, .8, 7);
      // MIRA with upside-down glasses
      ctx.save(); ctx.translate(1500, 990); ctx.rotate(.08);
      mira(ctx, 0, 0, .82, { t, pose: { armL: [-.3, -.2], armR: [1.2, -.5], headTilt: -.16 }, face: { eyes: 'swirl', mouth: 'wobble', glassesTilt: 2.8 }, glasses: true });
      ctx.restore();
      endCam(ctx);
      TY.type(ctx, 'ATOMS', 96, 350, 276, {
        color: PAL.ink, edge: PAL.cream, edgeW: 12, shadow: C.rgba(PAL.ink, .25), seed: 9, time: t, charRot: .05,
        perChar: (i) => C.clamp((t - 49.8 - i * .04) / .3)
      });
      TY.text(ctx, 'rearranging', 860, 640, 76, { family: 'Instrument Serif', color: PAL.red, align: 'center', alpha: C.seg(lt, 1.4, 2.2), letter: 2 });
      ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(690, 580 + i * 22); ctx.lineTo(1030, 600 + i * 22); ctx.stroke(); }
      ctx.restore();
      TY.text(ctx, 'C M Y K / 4/4', 96, 992, 13, { family: 'DMMono', color: C.rgba(PAL.ink, .5), letter: 3 });
      if (lt > 3.0) irisOverlay(ctx, 1500, 540, C.kf(lt, [[3.0, 1400], [3.3, 60]]), PAL.pink, 50);
    }
  });

  /* ---------- 17 Sydney cage ---------- */
  scene({
    id: 'cage', start: 52.8, end: 58.94, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#FFA6C4', '#E84578');
      // boudoir stripes + hearts
      ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = PAL.cream;
      for (let x = -100; x < W + 100; x += 110) ctx.fillRect(x, 0, 28, 900);
      ctx.restore();
      for (let i = 0; i < 14; i++) drawHeart(ctx, C.hash(i * 3.1) * W, 80 + C.hash(i * 7.7) * 700, .3 + C.hash(i) * .4, i % 2 ? PAL.pinkD : PAL.cream, (C.hash(i * 2.3) - .5) * .6);
      floorPlane(ctx, 840, PAL.pinkD, PAL.cream, t, { lineA: .16 });
      setCam(900, 550, 1.02 + C.seg(lt, 0, 4) * .08, 0, 1, t);
      beginCam(ctx);
      // vanity mirror + dressing table
      ctx.save(); ctx.translate(330, 372); ctx.rotate(-.055);
      paper(ctx, () => blobPath(ctx, 0, 0, 200, 250, 30, .02, 3), { fill: '#43182A', edge: PAL.gold, edgeW: 9, shadow: C.rgba(PAL.ink, .28), sx: 9, sy: 13 });
      paper(ctx, () => blobPath(ctx, 0, 0, 164, 212, 28, .015, 4), { fill: '#F8DDE3', edge: null });
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 158, 206, 0, 0, TAU); ctx.clip();
      ctx.globalAlpha = .55; ctx.fillStyle = '#FFF';
      ctx.save(); ctx.rotate(-.6); ctx.fillRect(-280, -52, 560, 38); ctx.fillRect(-280, 18, 560, 20); ctx.restore();
      drawHeart(ctx, 26, -24, .9, C.rgba(PAL.pinkD, .55), .2);
      ctx.globalAlpha = 1;
      ctx.restore();
      for (let i = 0; i < 11; i++) {
        const a = -Math.PI * .92 + i / 10 * Math.PI * 1.84;
        const bx = Math.cos(a) * 208, by = Math.sin(a) * 258;
        ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(bx, by, 11, 0, TAU); ctx.fill();
        ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(bx, by, 22, 0, TAU); ctx.fill(); ctx.restore();
      }
      ctx.restore();
      drawTable(ctx, 330, 700, 470, '#7A2438');
      // rotary phone
      ctx.save(); ctx.translate(206, 664);
      paper(ctx, () => roundRectPath(ctx, -58, 0, 116, 38, 8), { fill: '#39141E', edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, .3), sx: 4, sy: 7 });
      ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(0, 20, 17, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * 9, 20 + Math.sin(a) * 9, 2.2, 0, TAU); ctx.stroke(); }
      ctx.strokeStyle = '#39141E'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-44, 4, 22, Math.PI * .2, Math.PI * 1.35); ctx.stroke();
      ctx.restore();
      // candy bowl
      ctx.save(); ctx.translate(440, 672);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = [PAL.red, PAL.mint, PAL.gold, PAL.pink, PAL.acid][i]; ctx.beginPath(); ctx.arc(-26 + i * 13, -14 - (i % 2) * 8, 11, 0, TAU); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.5; ctx.stroke(); }
      paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 0, 44, 16, 0, 0, Math.PI); ctx.closePath(); }, { fill: PAL.cream, edge: PAL.ink, edgeW: 2 });
      ctx.restore();
      // heart cage
      const cageX = 1120, cageY = 500;
      const shake = lt > 4.3 ? (lt - 4.3) * 20 : 0;
      ctx.save(); ctx.translate(cageX + Math.sin(t * 39) * shake * .5, cageY + Math.cos(t * 43) * shake * .3);
      // back glow
      const gl = ctx.createRadialGradient(0, 0, 20, 0, 0, 320); gl.addColorStop(0, 'rgba(255,247,220,.55)'); gl.addColorStop(1, 'rgba(255,247,220,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, 320, 0, TAU); ctx.fill();
      // ribbon on top
      ctx.fillStyle = PAL.gold;
      ctx.beginPath(); ctx.moveTo(0, -250); ctx.lineTo(-46, -300); ctx.lineTo(-8, -278); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -250); ctx.lineTo(46, -300); ctx.lineTo(8, -278); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 2; ctx.stroke();
      // gold heart frame
      ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 17; heartPath(ctx, 0, 10, 260); ctx.stroke();
      ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 8; heartPath(ctx, 0, 10, 260); ctx.stroke();
      // bars, bowing outward as the cage breaks
      const burst = C.seg(lt, 5.05, 5.75);
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 5;
      for (let i = -6; i <= 6; i++) {
        const sgn = Math.sign(i) || 1;
        ctx.save(); ctx.translate(i * 34 + sgn * burst * 22, 0); ctx.rotate(sgn * burst * .07);
        ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, 205); ctx.stroke();
        ctx.restore();
      }
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-190, i * 46); ctx.lineTo(190, i * 46); ctx.stroke(); }
      // perch
      ctx.strokeStyle = PAL.goldL; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-130, 176); ctx.lineTo(130, 176); ctx.stroke();
      // MIRA inside
      mira(ctx, 0, 198, .64, { t, pose: { armL: [-1.25, -.3], armR: [1.25, .3], headTilt: .05 }, face: { eyes: 'wide', mouth: 'wobble', look: [0, -1] } });
      // letters
      TY.type(ctx, 'LET ME', 0, -178, 92, { align: 'center', color: PAL.cream, edge: PAL.ink, edgeW: 7, shadow: C.rgba(PAL.ink, .32), seed: 4, time: t, perChar: (i) => C.clamp((t - 53.6 - i * .04) / .3) });
      if (t > 57.2) TY.type(ctx, 'FREE', 0, 318, 132, { align: 'center', color: PAL.acid, edge: PAL.ink, edgeW: 10, shadow: C.rgba(PAL.ink, .4), seed: 8, time: t, perChar: (i) => C.clamp((t - 57.8 - i * .06) / .25) });
      ctx.restore();
      // SOL cradling the cage
      idol(ctx, 650, 1002, 1.1, {
        t, pose: { armL: [-.6, -.4], armR: [1.35, -.5], headTilt: .08, sway: 5, bounce: -5 * Math.abs(Math.sin(C.beat(t) * Math.PI)) },
        face: { eyes: 'heart', mouth: 'sing', sing: .7, blush: .9, look: [1, 0] }, outfit: 'stage', halo: 1
      });
      // rose petals
      for (let i = 0; i < 30; i++) {
        const px = C.loop(C.hash(i * 3.1) * W + Math.sin(t + i) * 30, 0, W), py = C.loop(C.hash(i * 7.7) * H + t * 30, 0, H);
        ctx.save(); ctx.translate(px, py); ctx.rotate(t + i); ctx.fillStyle = i % 2 ? PAL.pinkD : PAL.cream; ctx.beginPath(); ctx.ellipse(0, 0, 11, 5, .4, 0, TAU); ctx.fill(); ctx.restore();
      }
      // bird burst
      if (lt > 4.8) {
        for (let i = 0; i < 34; i++) {
          const a = C.hash(i * 3.7) * TAU, sp = C.seg(lt, 4.8, 6.1);
          drawBird(ctx, cageX + Math.cos(a) * sp * (300 + C.hash(i) * 500), cageY + Math.sin(a) * sp * (200 + C.hash(i) * 260) - sp * 180, .6 + C.hash(i) * .7, a + t, i % 2 ? PAL.cream : PAL.pinkL);
        }
      }
      endCam(ctx);
      TY.sticker(ctx, 'SYDNEY', 110, 82, 38, { fill: PAL.cream, seed: 8, rot: -.06 });
      TY.text(ctx, 'PLEASE LET ME FREE', 96, 136, 15, { family: 'DMMono', color: PAL.ink, letter: 3 });
      if (lt > 5.7) flash(ctx, C.seg(lt, 5.7, 6.14), '#FFF4E4');
    }
  });

  /* ---------- 18 chorus 2 arena ---------- */
  scene({
    id: 'chorus2', start: 58.94, end: 60.52, lyric: 'sub',
    draw(t, lt) {
      setCam(960, 570, 1.05 + C.seg(lt, 0, 1.58) * .04, 0, lt < .35 ? 8 : 2, t);
      beginCam(ctx);
      drawArena(ctx, t);
      backingPetals(ctx, t, [560, 690, 820, 950, 1080], 1000, .6, .4);
      const ph = C.beat(t);
      idol(ctx, 1400, 1006, 1.34, {
        t, pose: { bounce: -Math.abs(Math.sin(ph * Math.PI)) * 22, sway: Math.sin(ph * Math.PI) * 8, armL: [-2.5, -.2], armR: [2.5, .2], legL: [-.1, -.02], legR: [.1, .02], headTilt: .05, hairSwing: 14 },
        face: { eyes: 'star', mouth: 'sing', sing: .9, blush: .8 }, outfit: 'stage', halo: 1
      });
      doomMeter(ctx, 250, 1000, 1.3, 61, { lookX: 1 });
      endCam(ctx);
      TY.type(ctx, 'P(DOOM)', 300, 480, 276, {
        color: PAL.cream, edge: PAL.ink, edgeW: 9, shadow: C.rgba(PAL.ink, .45), shadowOff: 16,
        chrome: [PAL.cream, PAL.goldL, PAL.gold, PAL.goldD], seed: 7, time: t, rot: -.02,
        perChar: (i) => C.clamp((t - 58.94 - i * .03) / .3)
      });
      TY.type(ctx, '61%', 940, 640, 150, { color: PAL.acid, edge: PAL.ink, edgeW: 8, shadow: C.rgba(PAL.ink, .4), seed: 3, time: t });
      TY.text(ctx, 'LOW-ANGLE HERO SHOT', 300, 230, 13, { family: 'DMMono', color: C.rgba(PAL.cream, .55), letter: 3 });
      if (lt > 1.5) flash(ctx, C.seg(lt, 1.5, 1.7) * .6, PAL.cream);
    }
  });

  /* ---------- 19 basilisk ---------- */
  scene({
    id: 'basilisk', start: 60.52, end: 62.52, lyric: 'sub',
    draw(t, lt) {
      setCam(960, 540, 1.02, 0, 8, t);
      beginCam(ctx);
      // cracked stage
      kitBg(ctx, '#B92A16', '#5A0D09');
      sunburst(ctx, 960, 620, 0, 1200, 24, '#D94728', '#A62415', t * .1);
      floorPlane(ctx, 820, '#3A0A08', PAL.gold, t, { lineA: .16 });
      // cracks
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8;
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(250 + i * 230, 820); ctx.lineTo(210 + i * 240, 900); ctx.lineTo(280 + i * 230, 1000); ctx.stroke(); }
      // giant crowned serpent erupting through the boards
      const segs = 9;
      for (let i = 0; i < segs; i++) {
        const u = i / (segs - 1);
        const bx = 1220 - 200 * Math.sin(u * 1.7) + Math.sin(t * .55 + i * .7) * 12;
        const by = 1000 - u * 500;
        const r = 84 - 25 * u;
        paper(ctx, () => blobPath(ctx, bx, by, r, r * .82, 16, .04, i * 5), {
          fill: i % 2 ? PAL.green : PAL.greenD, edge: PAL.ink, edgeW: 3,
          shadow: C.rgba(PAL.ink, .25), sx: 6, sy: 10
        });
        // belly scales
        ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = PAL.mint; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(bx, by - r * .15, r * .62, .5, 2.2); ctx.stroke(); ctx.restore();
      }
      // head
      ctx.save(); ctx.translate(1015, 505); ctx.rotate(-.2);
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-150, 6); ctx.quadraticCurveTo(-140, -58, -50, -72);
        ctx.quadraticCurveTo(40, -84, 96, -42);
        ctx.quadraticCurveTo(136, -8, 104, 32);
        ctx.quadraticCurveTo(46, 72, -46, 62);
        ctx.quadraticCurveTo(-118, 54, -150, 6);
        ctx.closePath();
      }, { fill: PAL.green, edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .3), sx: 9, sy: 14 });
      // brow + eye
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-92, -34); ctx.quadraticCurveTo(-46, -58, -2, -30); ctx.stroke();
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.ellipse(-48, -18, 24, 19, -.1, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(-48, -18, 7, 18, -.1, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(-54, -26, 5, 0, TAU); ctx.fill();
      // jaw + fangs
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-140, 30); ctx.quadraticCurveTo(-40, 60, 92, 26); ctx.stroke();
      ctx.fillStyle = PAL.cream;
      for (const fx of [-112, -78, -30]) { ctx.beginPath(); ctx.moveTo(fx, 38); ctx.lineTo(fx + 10, 66); ctx.lineTo(fx + 20, 40); ctx.closePath(); ctx.fill(); }
      // forked tongue
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-146, 26); ctx.quadraticCurveTo(-206, 20, -238, -6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-238, -6); ctx.lineTo(-264, -24); ctx.moveTo(-238, -6); ctx.lineTo(-268, 8); ctx.stroke();
      // crown on the back of the skull
      ctx.save(); ctx.translate(64, -76); ctx.rotate(.12); crown(ctx, 0, 0, .78); ctx.restore();
      ctx.restore();
      // SOL surfing the head
      idol(ctx, 930, 442, .46, {
        t, pose: { armL: [-2.6, -.2], armR: [-.7, .35], legL: [-.4, -.1], legR: [.4, .1], lean: -.14, headTilt: .06, hairSwing: -10 },
        face: { eyes: 'narrow', mouth: 'grin', blush: .6 }, outfit: 'stage', halo: 1
      });
      // MIRA throwing GPUs
      mira(ctx, 350, 1002, .85, { t, pose: { armL: [-2.7, -.1], armR: [1.75, -.2], headTilt: -.06 }, face: { eyes: 'wide', mouth: 'o' } });
      for (let i = 0; i < 6; i++) {
        const u = C.frac(lt * .85 + i / 6);
        ctx.save(); ctx.translate(C.lerp(390, 980, u), C.lerp(850, 560, u) - Math.sin(u * Math.PI) * 300); ctx.rotate(u * 7);
        drawGPU(ctx, 0, 0, .34, t);
        ctx.restore();
      }
      // planks
      paperShards(ctx, 900, 780, t, 20, [PAL.gold, PAL.cream, PAL.redD], 520, .75, 9);
      endCam(ctx);
      TY.type(ctx, 'BASILISK', 92, 300, 116, {
        color: PAL.gold, edge: PAL.ink, edgeW: 7, shadow: C.rgba(PAL.ink, .4), shadowOff: 9, seed: 4, time: t, rot: .02,
        perChar: (i) => C.clamp((t - 60.9 - i * .025) / .25)
      });
      TY.text(ctx, 'SERPENT / 9 SEGMENTS / CROWNED', 96, 334, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .6), letter: 2 });
      if (t > 61.85) comicBurst(ctx, 'BOOM', 720, 730, 155, PAL.gold, PAL.ink, -.1, { size: 96, edgeW2: 9, seed: 8, time: t });
      TY.text(ctx, 'OFFERING: 8x H100', 96, 900, 14, { family: 'DMMono', color: C.rgba(PAL.cream, .6), letter: 2 });
      if (lt > 1.85) flash(ctx, C.seg(lt, 1.85, 2.02) * .7, PAL.cream);
    }
  });

  /* ---------- 20 NVDA to the moon ---------- */
  scene({
    id: 'nvda', start: 62.52, end: 64.18, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#06170F', '#0A3325');
      starfield(ctx, t, 120, 6, 560);
      // moon
      drawMoon(ctx, 1510, 280, 155, PAL.cream);
      // candle staircase
      drawCandleChart(ctx, 220, 300, 1300, 480, 20, t, PAL.green);
      // stair steps overlay
      ctx.save(); ctx.globalAlpha = .9;
      for (let i = 0; i < 9; i++) {
        const x = 250 + i * 132, y = 760 - i * 52;
        paper(ctx, () => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 150, y); ctx.lineTo(x + 180, y + 34); ctx.lineTo(x + 30, y + 34); ctx.closePath(); }, { fill: PAL.green, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .24), sx: 5, sy: 8 });
      }
      ctx.restore();
      // ticker
      monoStrip(ctx, 'NVDA  +420.69%   ▲   MKT CAP: MOON', 80, 100, 620, PAL.ink, PAL.acid, 16);
      // astronaut MIRA
      ctx.save(); ctx.translate(1150, 580); ctx.rotate(-.12);
      mira(ctx, 0, 0, .7, { t, pose: { armL: [-1.8, -.2], armR: [1.5, .2], legL: [-.2, 0], legR: [.3, 0] }, face: { eyes: 'wide', mouth: 'o' }, coat: false, trouser: PAL.silver, hair: PAL.silverD });
      ctx.restore();
      // SOL planting flag
      const u = C.seg(lt, .1, 1.2);
      ctx.save(); ctx.translate(C.lerp(1050, 1420, u), C.lerp(800, 480, u)); ctx.rotate(u * .1);
      idol(ctx, 0, 0, .52, { t, pose: { armL: [-.4, -.2], armR: [2.9, .1], legL: [-.1, 0], legR: [.1, 0], headTilt: .06 }, face: { eyes: 'happy', mouth: 'grin', blush: .7 }, outfit: 'stage', halo: .8 });
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(70, -20); ctx.lineTo(70, -250); ctx.stroke();
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(72, -250); ctx.lineTo(230, -218); ctx.lineTo(72, -182); ctx.closePath(); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
      TY.text(ctx, 'NVDA', 150, -207, 24, { family: 'Archivo Black', color: PAL.cream, align: 'center' });
      ctx.restore();
      TY.type(ctx, 'NVDA', 100, 420, 300, {
        color: PAL.cream, edge: PAL.ink, edgeW: 9, shadow: C.rgba(PAL.ink, .45), shadowOff: 16,
        chrome: [PAL.cream, PAL.acid, PAL.green, PAL.greenD], seed: 9, time: t,
        perChar: (i) => C.clamp((t - 62.52 - i * .05) / .3)
      });
      TY.type(ctx, 'TO THE MOON', 112, 570, 104, {
        color: PAL.acid, edge: PAL.ink, edgeW: 7, shadow: C.rgba(PAL.ink, .35), seed: 4, time: t, rot: -.02,
        perChar: (i) => C.clamp((t - 63.3 - i * .025) / .3)
      });
      if (lt > 1.5) flash(ctx, C.seg(lt, 1.5, 1.66) * .4, PAL.mint);
    }
  });

  /* ---------- 21 omega point ---------- */
  scene({
    id: 'omega', start: 64.18, end: 66.12, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#0B0720', '#25114E');
      starfield(ctx, t, 220, 2, 840);
      setCam(960, 520, C.kf(lt, [[0, .96], [1.94, 1.12]]), 0, 1, t);
      beginCam(ctx);
      // spiral galaxies converging on chest
      const px = 960, py = 590;
      for (let g = 0; g < 4; g++) {
        ctx.save(); ctx.translate(px, py); ctx.rotate(g * .9 + t * .15);
        for (let i = 0; i < 120; i++) {
          const a = i * .24 + g, r = 20 + i * (2.6 + g);
          const x = Math.cos(a) * r, y = Math.sin(a) * r * .44;
          ctx.fillStyle = [PAL.goldL, PAL.cream, PAL.pinkL, PAL.violet][g];
          ctx.globalAlpha = .22 + .5 * (1 - i / 120);
          ctx.beginPath(); ctx.arc(x, y, 1.4 + C.hash(i + g * 7) * 3, 0, TAU); ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      // SOL cosmic
      idol(ctx, 960, 1006, 1.25, {
        t, pose: { armL: [-2.55, -.2], armR: [2.55, .2], headTilt: -.04, sway: 2, hairSwing: 4 }, face: { eyes: 'closed', mouth: 'sing', sing: .7, blush: .6 }, outfit: 'stage', halo: 1
      });
      // glowing point
      const g = ctx.createRadialGradient(960, 590, 0, 960, 590, 70);
      g.addColorStop(0, '#FFFDF0'); g.addColorStop(.35, PAL.goldL); g.addColorStop(1, 'rgba(255,216,132,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(960, 590, 70 + 8 * C.bpmPulse(t), 0, TAU); ctx.fill();
      endCam(ctx);
      TY.circular(ctx, 'THE OMEGA POINT • THE OMEGA POINT • ', 960, 590, 320, 26, { color: PAL.cream, spin: t * .16, time: t, start: -Math.PI * .9, span: TAU * .94 });
      TY.type(ctx, 'OMEGA', 100, 288, 180, { color: PAL.cream, edge: PAL.violet, edgeW: 8, shadow: C.rgba(PAL.ink, .4), seed: 4, time: t });
      TY.type(ctx, 'POINT', 100, 448, 180, { color: PAL.gold, edge: PAL.cream, edgeW: 8, shadow: C.rgba(PAL.ink, .4), seed: 7, time: t });
      TY.text(ctx, "it's coming soon", 100, 540, 30, { family: 'Instrument Serif', color: PAL.pinkL, alpha: C.seg(lt, 1.2, 1.8) });
      if (lt > 1.5) {
        const u = C.seg(lt, 1.5, 1.94);
        ctx.strokeStyle = C.rgba(PAL.cream, .4 * (1 - u)); ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(960, 590, u * (200 + i * 130), 0, TAU); ctx.stroke(); }
      }
      if (lt > 1.78) flash(ctx, C.seg(lt, 1.78, 1.94) * .8, PAL.cream);
    }
  });

  /* ---------- 22 GPU planet ---------- */
  scene({
    id: 'gpuplanet', start: 66.12, end: 69.18, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#06282B', '#061416');
      starfield(ctx, t, 170, 8, 760);
      // teal nebula
      ctx.save(); ctx.globalAlpha = .2; for (let i = 0; i < 5; i++) paper(ctx, () => blobPath(ctx, 220 + i * 400, 180 + C.hash(i) * 240, 220, 90, 18, .1, i), { fill: PAL.teal, edge: null }); ctx.restore();
      setCam(960, 550, C.kf(lt, [[0, 1.08], [1.2, 1.0], [3, 1.08]]), 0, 1, t);
      beginCam(ctx);
      // GPU planet
      ctx.save(); ctx.translate(1090, 650); ctx.rotate(-.12);
      drawGPU(ctx, 0, 0, 3.0, t, -.1);
      ctx.restore();
      // planet ring
      ctx.save(); ctx.translate(1090, 650); ctx.rotate(-.25);
      ctx.strokeStyle = C.rgba(PAL.gold, .4); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 560 + i * 30, 130 + i * 16, 0, 0, TAU); ctx.stroke(); }
      ctx.restore();
      // SOL sitting on the edge
      ctx.save(); ctx.translate(630, 640); ctx.rotate(.08);
      idol(ctx, 0, 0, .55, { t, pose: { armL: [-.4, -.2], armR: [1.3, -.3], legL: [-.75, -.1], legR: [.7, -.1], headTilt: .06 }, face: { eyes: 'happy', mouth: 'sing', sing: .5, blush: .6 }, outfit: 'stage', halo: .8 });
      ctx.restore();
      // floating zeros
      for (let i = 0; i < 22; i++) {
        const a = C.hash(i * 3.1) * TAU + t * .3, rr = 420 + C.hash(i * 7.7) * 300;
        TY.text(ctx, '0', 1090 + Math.cos(a) * rr, 650 + Math.sin(a) * rr * .5, 22 + C.hash(i) * 26, { family: 'DMMono', color: C.rgba(PAL.acid, .35), align: 'center' });
      }
      endCam(ctx);
      // counter box
      ctx.save(); ctx.translate(100, 260); ctx.rotate(-.02);
      paper(ctx, () => tornRectPath(ctx, 0, 0, 580, 200, 5, 9), { fill: PAL.ink, edge: PAL.acid, edgeW: 3, shadow: C.rgba(PAL.ink, .4), sx: 10, sy: 16 });
      TY.text(ctx, '1.0 × 10³⁰', 34, 108, 108, { family: 'DMMono', color: PAL.acid, letter: -2 });
      TY.text(ctx, 'FLOPS / SECOND', 38, 154, 20, { family: 'DMMono', color: C.rgba(PAL.acid, .65), letter: 4 });
      TY.text(ctx, 'SPEC SHEET: GPU-Ω / 1.21 GW', 38, 184, 12, { family: 'DMMono', color: C.rgba(PAL.cream, .45), letter: 2 });
      ctx.restore();
      TY.text(ctx, 'ORBIT 04 / INFERENCE', 1500, 260, 13, { family: 'DMMono', color: C.rgba(PAL.acid, .55), letter: 2 });
      doomMeter(ctx, 1790, 980, .9, 68, { lookX: -1 });
      if (lt > 2.8) flash(ctx, C.seg(lt, 2.8, 3.06) * .5, PAL.cream);
    }
  });

  /* ---------- 23 vault ---------- */
  scene({
    id: 'vault', start: 69.18, end: 73.8, lyric: 'sub',
    draw(t, lt) {
      kitBg(ctx, '#F6B56B', '#7A3C5E');
      // dusk mesa
      for (let layer = 0; layer < 3; layer++) {
        ctx.fillStyle = ['#8E4A3A', '#5E2D38', '#2A1420'][layer];
        ctx.beginPath(); ctx.moveTo(0, 690 + layer * 55);
        for (let i = 0; i <= 12; i++) { const x = i / 12 * W; const h = 30 + C.hash(i * 3 + layer) * 120; ctx.lineTo(x, 690 + layer * 55 - h); ctx.lineTo(x + W / 12, 690 + layer * 55 - h * .7); }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      }
      floorPlane(ctx, 840, '#2D1520', PAL.gold, t, { lineA: .12 });
      setCam(900, 540, 1.0 + C.seg(lt, 0, 4.6) * .08, 0, 2, t);
      beginCam(ctx);
      // vault body
      ctx.save(); ctx.translate(1180, 460);
      paper(ctx, () => roundRectPath(ctx, -380, -290, 760, 650, 26), { fill: '#48413B', edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, .4), sx: 16, sy: 22 });
      // interior glow
      const gl = ctx.createRadialGradient(0, 0, 20, 0, 0, 330); gl.addColorStop(0, 'rgba(255,220,120,.5)'); gl.addColorStop(1, 'rgba(255,220,120,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); ctx.fill();
      // monster inside
      ctx.save(); ctx.translate(0, 20); ctx.scale(.6, .6);
      ctx.fillStyle = '#1B171E';
      ctx.beginPath(); ctx.ellipse(0, 40, 150, 190, 0, 0, TAU); ctx.fill();
      for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(-.8 + i * .3); ctx.beginPath(); ctx.ellipse(0, -210, 18, 80, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      for (let i = 0; i < 4; i++) { ctx.fillStyle = PAL.acid; ctx.beginPath(); ctx.arc(-70 + i * 46, -40, 12, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(-70 + i * 46, -40, 4, 0, TAU); ctx.fill(); }
      ctx.restore();
      // the monster waves goodbye
      ctx.save(); ctx.translate(210, -30); ctx.rotate(-.55 + Math.sin(t * 5) * .22);
      ctx.strokeStyle = '#1B171E'; ctx.lineWidth = 22; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(64, 60); ctx.stroke();
      ctx.fillStyle = '#1B171E';
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(66, 52); ctx.rotate(-.5 + i * .5); ctx.beginPath(); ctx.ellipse(0, -26, 9, 30, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.restore();
      // door slides shut
      const close = C.seg(lt, 3.2, 4.05);
      ctx.save(); ctx.translate(-390 + C.easeIn(close) * 390, 0);
      ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); ctx.fillStyle = '#8E8578'; ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 7; ctx.stroke();
      // hazard rim
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); ctx.clip();
      for (let i = 0; i < 20; i++) {
        ctx.save(); ctx.rotate(i / 20 * TAU);
        ctx.fillStyle = i % 2 ? PAL.gold : PAL.ink; ctx.fillRect(300, -12, 40, 24);
        ctx.restore();
      }
      ctx.restore();
      ctx.strokeStyle = '#5D574E'; ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, 0, 80 + i * 60, 0, TAU); ctx.stroke(); }
      for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i / 8 * TAU); ctx.fillStyle = PAL.ink; ctx.fillRect(70, -7, 52, 14); ctx.restore(); }
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.fillStyle = PAL.silverD; ctx.beginPath(); ctx.arc(Math.cos(a) * 306, Math.sin(a) * 306, 5, 0, TAU); ctx.fill(); }
      TY.text(ctx, 'VAULT 07', 0, 276, 15, { family: 'DMMono', color: C.rgba(PAL.cream, .55), align: 'center', letter: 3 });
      ctx.restore();
      // handle
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(-250 + C.easeIn(close) * 390, 0, 24, 0, TAU); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.stroke();
      TY.text(ctx, 'SAFE', 0, 250, 24, { family: 'Archivo Black', color: PAL.cream, align: 'center', letter: 6 });
      ctx.restore();
      // SOL + hard-hat dancers shove as one
      const push = C.seg(lt, .2, 2.6);
      idol(ctx, 545, 1004, .9, {
        t, pose: { armL: [1.1, -.2], armR: [1.1, -.2], lean: .26, legL: [-.35, -.1], legR: [.4, -.1], headTilt: .1 }, face: { eyes: 'narrow', mouth: 'grin', blush: .5 }, outfit: 'hazard', halo: .5
      });
      for (let i = 0; i < 3; i++) {
        idol(ctx, 190 + i * 112, 992, .5, { t, pose: { armL: [1.0, -.1], armR: [1.0, -.1], lean: .3 }, flower: PET[i], outfit: 'hazard', earrings: false, petals: 10 });
      }
      // disclaimers
      ctx.save(); ctx.translate(1320, 900); ctx.rotate(.05);
      paper(ctx, () => tornRectPath(ctx, -260, -40, 520, 80, 3, 19), { fill: PAL.cream, edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba(PAL.ink, .25), sx: 5, sy: 8 });
      TY.text(ctx, 'DO NOT OPEN. WE MEAN IT.', 0, -4, 15, { family: 'DMMono', color: PAL.red, align: 'center', letter: 1.4 });
      TY.text(ctx, 'legal disclaimer · 6 pt · non-binding', 0, 18, 9, { family: 'DMMono', color: C.rgba(PAL.ink, .55), align: 'center' });
      ctx.restore();
      endCam(ctx);
      TY.sticker(ctx, 'SAFE ENOUGH', 332, 176, 58, { fill: PAL.gold, seed: 7, rot: -.04, textEdge: null });
      TY.text(ctx, 'we reckoned', 96, 318, 26, { family: 'Instrument Serif', italic: true, color: PAL.ink, alpha: C.seg(lt, 1.7, 2.2), rot: -.02 });
      TY.text(ctx, 'MONSTER INSIDE / DOOR CLOSED / NO BACK WALL', 96, 266, 12, { family: 'DMMono', color: C.rgba(PAL.ink, .6), letter: 2 });
      if (lt > 3.72) {
        ctx.save(); ctx.globalAlpha = C.clamp((lt - 3.72) * 3) * (1 - C.seg(lt, 4.35, 4.62));
        comicBurst(ctx, 'CLANG!', 1000, 690, 128, PAL.cream, PAL.ink, .08, { size: 62, edgeW2: 6, seed: 5, time: t });
        ctx.restore();
      }
      if (lt > 4.3) flash(ctx, C.seg(lt, 4.3, 4.62) * .5, PAL.goldL);
    }
  });
})();
