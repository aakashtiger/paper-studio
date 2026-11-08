/* KPOP proof — 10.2 s, four shots, on the source Paper K-pop grammar.
 * The voice is The Understudy's measured read, trimmed to 10.2 s; the picture
 * is new. The cast, stage, props, type and paper physics are the source's.
 */
(() => {
  const INK = '#171310';
  const CREAM = '#F2E8D5';
  const TEAL = '#0F6B5E';
  const TEAL_D = '#082A28';
  const CORAL = '#E86A5A';
  const MUSTARD = '#F2C14E';

  // The subtitle band and print marks read the palette roles too.
  PAL.red = CORAL;
  PAL.acid = MUSTARD;
  PAL.gold = MUSTARD;

  const KIRAN_FLOWER = {
    petal: '#F6E3B8', petal2: '#E7C98B', tip: CORAL, center: '#F0C9A4', hair: INK,
  };
  const KIRAN_COLORS = {
    jacket: TEAL, sleeve: CREAM, skirt: CORAL, boot: MUSTARD, hair: INK, skin: '#D9A06A',
  };

  function kiran(ctx, x, y, s, t, pose = {}, extra = {}) {
    idol(ctx, x, y, s, {
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
        headTurn: pose.headTurn || 0,
        hairSwing: pose.hairSwing || 0,
      },
      flower: KIRAN_FLOWER,
      colors: KIRAN_COLORS,
      petals: 0,
      outfit: 'stage',
      halo: .65,
      shadow: 1,
      ...extra,
    });
  }

  function cueLamp(ctx, x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    paper(ctx, () => tornRectPath(ctx, -9, 42, 18, 120, 4, 3), { fill: INK, edge: C.rgba(CREAM, .25), edgeW: 1.5 });
    paper(ctx, () => tornRectPath(ctx, -58, -34, 116, 78, 8, 5), { fill: INK, edge: C.rgba(CREAM, .4), edgeW: 2, shadow: C.rgba(INK, .25), sx: 4, sy: 7 });
    paper(ctx, () => { ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); }, { fill: MUSTARD, edge: C.rgba(INK, .5), edgeW: 2 });
    ctx.fillStyle = C.rgba(CREAM, .8); ctx.beginPath(); ctx.arc(-8, -8, 10, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
    g.addColorStop(0, C.rgba(MUSTARD, .28)); g.addColorStop(1, C.rgba(MUSTARD, 0));
    ctx.fillStyle = g; ctx.fillRect(-180, -180, 360, 360);
    ctx.restore();
    spotlight(ctx, x + 30, y + 20, 760, 50, 300, '#FFE8B0', .16, .22);
  }

  function emptyWing(ctx, x, y, s, flip) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flip * s, s);
    for (let i = 0; i < 4; i += 1) {
      paper(ctx, () => tornRectPath(ctx, -150 - i * 18, -40 + i * 46, 150, 16, 7, i + 4), {
        fill: C.rgba(CREAM, .16), edge: C.rgba(CREAM, .45), edgeW: 2,
      });
    }
    ctx.restore();
  }

  /* 1 — 0.00–3.10: the stage builds, the cue lamp calls */
  scene({
    id: 'k1', start: 0, end: 3.1, lyric: 'sub', noDoom: true,
    draw(t, lt) {
      setCam(960, 540, C.kf(lt, [[0, 1.0], [3.1, 1.06]]), C.kf(lt, [[0, 0], [3.1, .01]]), 2, t);
      beginCam(ctx);
      stageSet(ctx, t, {
        sky: '#0A2323', sky2: '#123B3B', sun: CREAM,
        rayA: TEAL, rayB: '#1C8F7A', floor: '#123B3B', accent: MUSTARD,
        crowd: true, confetti: 44,
        confettiCols: [CREAM, MUSTARD, CORAL, '#2FAE9A'],
      });
      cueLamp(ctx, 1660, 700, 1.0, t);
      const ph = C.beat(t);
      const walk = C.easeOut(C.clamp(lt / 1.2));
      kiran(ctx, 1180 + 90 * walk, 1008, 1.18, t, {
        bounce: -Math.abs(Math.sin(ph * Math.PI)) * 18,
        sway: Math.sin(ph * Math.PI) * 5,
        armL: [-1.4 + walk * .6, -.2],
        armR: [1.1, .2],
        legL: [-.12 * walk, -.03], legR: [.12 * walk, .03],
        headTilt: .04, hairSwing: 8,
      }, { face: { eyes: 'happy', mouth: 'sing', sing: .5, blush: .6, look: [1, 0] } });
      TY.type(ctx, 'EVERY NIGHT', 92, 312, 148, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, .32),
        time: t, charRot: .025, jitter: 1, seed: 5,
        perChar: (i) => C.clamp((t - 0.25 - i * .035) / .4),
      });
      TY.text(ctx, 'A CUE-LAMP STORY', 98, 368, 20, { family: 'DMMono', color: MUSTARD, letter: 4 });
      paperShards(ctx, 980, 760, t, 20, [CREAM, MUSTARD, CORAL], 360, .2, 11);
      endCam(ctx);
    },
  });

  /* 2 — 3.10–5.1667: the portrait set */
  scene({
    id: 'k2', start: 3.1, end: 5.1667, lyric: 'sub', noDoom: true,
    draw(t, lt) {
      setCam(980, 540, C.kf(lt, [[0, 1.0], [2.0667, 1.1]]), C.kf(lt, [[0, 0], [2.0667, .008]]), 0, t);
      beginCam(ctx);
      ctx.fillStyle = TEAL_D; ctx.fillRect(0, 0, W, H);
      sunburst(ctx, 960, 460, 0, 1000, 28, C.rgba(TEAL, .28), C.rgba(TEAL_D, .1), t * .12);
      paper(ctx, () => tornRectPath(ctx, 520, 100, 880, 840, 18, 7), {
        fill: '#0F3B38', edge: C.rgba(CREAM, .55), edgeW: 4, shadow: C.rgba(INK, .3), sx: 8, sy: 12,
      });
      paper(ctx, () => tornRectPath(ctx, 560, 140, 800, 760, 14, 11), {
        fill: '#082A28', edge: C.rgba(CORAL, .65), edgeW: 3,
      });
      for (let i = 0; i < 6; i += 1) {
        ctx.strokeStyle = i % 2 ? C.rgba(CREAM, .18) : C.rgba(CORAL, .22);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(620 + i * 140, 0); ctx.quadraticCurveTo(600 + i * 150, 150, 640 + i * 130, 300); ctx.stroke();
      }
      spotlight(ctx, 980, -40, 1200, 40, 460, '#FFE8B0', .18, 0);
      cueLamp(ctx, 1450, 680, 1.0, t);
      kiran(ctx, 1060, 1080, 1.35, t, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 12,
        sway: 3,
        armL: [-1.8, -.2], armR: [1.9, -.3],
        headTilt: .05, hairSwing: 6,
      }, { face: { eyes: 'wide', mouth: 'o', blush: .6, look: [1, 0] } });
      TY.type(ctx, 'ONE NAME', 86, 318, 168, {
        color: CREAM, edge: CORAL, edgeW: 9, shadow: C.rgba(INK, .3),
        time: t, charRot: .03, jitter: 1, seed: 9,
        perChar: (i) => C.clamp((t - 3.2 - i * .035) / .4),
      });
      TY.text(ctx, 'THE LAMP KNOWS', 92, 374, 20, { family: 'DMMono', color: MUSTARD, letter: 4 });
      endCam(ctx);
    },
  });

  /* 3 — 5.1667–8.8667: Nova is the star */
  scene({
    id: 'k3', start: 5.1667, end: 8.8667, lyric: 'sub', noDoom: true,
    draw(t, lt) {
      setCam(960, 540, C.kf(lt, [[0, 1.0], [3.7, 1.06]]), C.kf(lt, [[0, 0], [3.7, -.008]]), 2, t);
      beginCam(ctx);
      stageSet(ctx, t, {
        sky: '#0A2323', sky2: '#123B3B', sun: CREAM,
        rayA: TEAL, rayB: '#1C8F7A', floor: '#123B3B', accent: MUSTARD,
        crowd: true, confetti: 58,
        confettiCols: [CREAM, MUSTARD, CORAL, '#2FAE9A'],
      });
      const ph = C.beat(t);
      kiran(ctx, 960, 1008, 1.28, t, {
        bounce: -Math.abs(Math.sin(ph * Math.PI)) * 20,
        sway: Math.sin(ph * Math.PI) * 6,
        armL: [-2.0, -.2], armR: [2.0, .2],
        legL: [-.08, -.02], legR: [.08, .02],
        headTilt: .04, hairSwing: 10,
      }, { face: { eyes: 'star', mouth: 'sing', sing: .8, blush: .7, look: [0, -.1] } });
      TY.type(ctx, 'NOVA', 92, 312, 190, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, .32),
        time: t, charRot: .025, jitter: 1, seed: 13,
        perChar: (i) => C.clamp((t - 5.2 - i * .035) / .4),
      });
      TY.type(ctx, 'THE STAR', 92, 470, 132, {
        color: CORAL, edge: CREAM, edgeW: 7, shadow: C.rgba(INK, .32),
        time: t, charRot: .025, jitter: 1, seed: 17,
        perChar: (i) => C.clamp((t - 5.8 - i * .035) / .4),
      });
      paperShards(ctx, 960, 760, t, 24, [CREAM, MUSTARD, CORAL], 420, .22, 31);
      endCam(ctx);
    },
  });

  /* 4 — 8.8667–10.20: the empty wings */
  scene({
    id: 'k4', start: 8.8667, end: 10.2, lyric: 'sub', noDoom: true,
    draw(t, lt) {
      setCam(960, 540, C.kf(lt, [[0, 1.0], [1.3333, 1.05]]), C.kf(lt, [[0, 0], [1.3333, .006]]), 3, t);
      beginCam(ctx);
      stageSet(ctx, t, {
        sky: '#0A2323', sky2: '#123B3B', sun: CREAM,
        rayA: TEAL, rayB: '#1C8F7A', floor: '#123B3B', accent: MUSTARD,
        crowd: true, confetti: 40,
        confettiCols: [CREAM, MUSTARD, CORAL, '#2FAE9A'],
      });
      emptyWing(ctx, 150, 640, 1.05, 1);
      emptyWing(ctx, 1770, 640, 1.05, -1);
      ctx.save();
      ctx.globalAlpha = .55;
      ctx.strokeStyle = MUSTARD; ctx.lineWidth = 6; ctx.setLineDash([12, 12]);
      ctx.beginPath(); ctx.arc(960, 930, 120, 0, TAU); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      TY.text(ctx, 'EMPTY', 960, 946, 28, { family: 'DMMono', color: C.rgba(CREAM, .5), align: 'center', letter: 6 });
      kiran(ctx, 1420, 1008, 1.12, t, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 16,
        sway: Math.sin(C.beat(t) * Math.PI) * 6,
        armL: [-.7, -.2], armR: [1.9, .4],
        headTilt: -.06, hairSwing: 10,
      }, { face: { eyes: 'narrow', mouth: 'flat', blush: .4, look: [-1, 0] } });
      const slam = C.clamp((lt - .18) / .22);
      if (slam > 0) {
        ctx.save();
        ctx.translate(760, 520);
        ctx.scale(.72 + .28 * C.backOut(slam), .72 + .28 * C.backOut(slam));
        ctx.rotate(-.05 + (1 - slam) * .12);
        TY.sticker(ctx, 'NO NOVA', 0, 0, 74, { fill: CORAL, text: CREAM, seed: 4, rot: 0, time: t });
        ctx.restore();
      }
      TY.type(ctx, 'EMPTY', 92, 312, 180, {
        color: CORAL, edge: CREAM, edgeW: 8, shadow: C.rgba(INK, .32),
        time: t, charRot: .03, jitter: 1, seed: 19,
        perChar: (i) => C.clamp((t - 8.9 - i * .02) / .3),
      });
      paperShards(ctx, 960, 760, t, 20, [CREAM, MUSTARD, CORAL], 380, .2, 37);
      endCam(ctx);
    },
  });
})();
