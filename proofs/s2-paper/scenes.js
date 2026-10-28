/* Paper K-pop S2 proof scenes.
   Three shots, 4 / 5 / 6 seconds. Fictional Nova Kim. No source film story.

   Each shot has an entry, a development, a beat and an exit. Nothing holds:
   every layer drifts, every beat has a hit, the camera moves through the shot. */

const SHOTS = [
  { id: "open", start: 0, end: 4 },
  { id: "sticker", start: 4, end: 9 },
  { id: "stage", start: 9, end: 15 },
];

function bgPaper() {
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(0, 0, W, H);
}

function layer(cx, cy, scale, fn) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);
  fn();
  ctx.restore();
}

/* ---------------------------------------------------------------- shot 1 */
/* Open: the title lands on a turning sunburst, the cue lamp sweeps, the
   sticker slams, the paper tears into the next shot. */
function openShot(lt, t) {
  bgPaper();
  const ease = C.easeOut(C.clamp(lt / 0.7));
  const push = C.smooth(C.clamp(lt / 4));
  const punch = lt > 0.3 ? 0.03 * Math.exp(-(lt - 0.3) * 9) : 0;
  const beatPulse = Math.exp(-C.frac(C.beat(t)) * 7);
  const camZ = 1 + 0.075 * push + punch + 0.012 * beatPulse;
  setCam(W / 2 + Math.sin(lt * 0.5) * 12, 500, camZ, Math.sin(lt * 0.6) * 0.008, 0.7, t);
  beginCam(ctx);

  // rays: own layer, own rotation
  layer(W / 2, 470, 1 + 0.02 * push, () => {
    sunburst(ctx, W / 2, 470, 110 + 90 * ease, 410 + 165 * ease, 30, PAL.acid, PAL.paper2, lt * 0.32, 0.95);
  });

  // halftone plate, slower than the rays
  layer(W / 2, 470, 1 + 0.035 * push, () => {
    ctx.globalAlpha = 0.9;
    halftone(ctx, W / 2 - 250, 220, 500, 500, PAL.red, 18, 0.5, 0.13);
  });

  // rotating ring of mono type, a constant read
  ctx.save();
  ctx.globalAlpha = 0.32;
  TY.circular(ctx, "LAST CUE · NOVA KIM · ONE NIGHT · 07 NOV · PAPER STAGE · ", W / 2, 470, 396, 13, {
    span: Math.PI * 1.02,
    start: Math.PI * 0.49,
    family: "DMMono",
    color: PAL.ink,
    start: -Math.PI / 2,
    spin: lt * 0.16,
    time: t,
  });
  ctx.restore();

  // core drops in with an overshoot
  const coreIn = C.backOut(C.clamp((lt - 0.05) / 0.55));
  layer(W / 2, 470, Math.max(0.001, (1 + 0.06 * push) * (1 + 0.015 * beatPulse)), () => {
    paper(ctx, () => blobPath(ctx, W / 2, 470, 150 * coreIn, 150 * coreIn, 64, 0.008, 8), {
      fill: PAL.gold,
      edge: C.rgba(PAL.ink, 0.35),
      edgeW: 3,
      shadow: C.rgba(PAL.ink, 0.22),
      sx: 7,
      sy: 10,
    });
  });

  // cue lamp sweep at the end of the shot
  if (lt > 3.1) {
    const u = C.clamp((lt - 3.1) / 0.55);
    const gx = 300 + 1300 * C.smooth(u);
    const g = ctx.createRadialGradient(gx, 470, 0, gx, 470, 420);
    g.addColorStop(0, C.rgba(PAL.goldL, 0.45 * (1 - u * 0.4)));
    g.addColorStop(1, C.rgba(PAL.goldL, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // title: per-char drop with an overshoot
  const titleIn = C.clamp((lt - 0.35) / 0.4);
  ctx.save();
  ctx.translate(0, (1 - C.backOut(titleIn)) * -70);
  TY.type(ctx, "LAST CUE", W / 2, 372, 196, {
    align: "center",
    color: PAL.ink,
    edge: PAL.cream,
    edgeW: 16,
    shadow: C.rgba(PAL.ink, 0.3),
    shadowOff: 10,
    time: t,
    seed: 7,
    charRot: 0.02,
    perChar: (i) => C.backOut(C.clamp((lt - 0.35 - i * 0.035) / 0.36)),
  });
  ctx.restore();

  // mono line on a cream tab so it reads over the burst
  const tab = C.seg(lt, 1.1, 1.55);
  if (tab > 0) {
    ctx.save();
    ctx.globalAlpha = tab;
    ctx.translate(0, (1 - tab) * 18);
    paper(ctx, () => tornRectPath(ctx, W / 2 - 300, 548, 600, 46, 3, 23), {
      fill: PAL.cream,
      edge: C.rgba(PAL.ink, 0.55),
      edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.22),
      sx: 5,
      sy: 8,
    });
    TY.text(ctx, "NOVA KIM  ·  ONE NIGHT  ·  07 NOV", W / 2, 578, 21, {
      family: "DMMono",
      color: PAL.ink,
      align: "center",
      letter: 3,
    });
    ctx.restore();
  }

  // sticker slam with squash, overshoot and shake
  if (lt > 2.05) {
    const u = C.clamp((lt - 2.05) / 0.16);
    const settle = C.backOut(u);
    const sq = Math.exp(-(lt - 2.05) * 12);
    const sx = 1 + 0.14 * sq;
    const sy = 1 - 0.14 * sq;
    ctx.save();
    ctx.translate(W / 2 + Math.sin(lt * 90) * 5 * sq, 762);
    ctx.rotate(-0.025 + 0.012 * Math.sin(lt * 1.9));
    ctx.scale((1.35 - 0.35 * settle) * sx, (1.35 - 0.35 * settle) * sy);
    TY.sticker(ctx, "THE LAST ENTRANCE", 0, 0, 33, {
      fill: PAL.cream,
      text: PAL.ink,
      rot: 0,
      seed: 12,
      barcode: true,
      tape: true,
    });
    ctx.restore();
  }

  // bottom print strip
  const strip = C.seg(lt, 2.3, 2.8);
  if (strip > 0) {
    ctx.save();
    ctx.globalAlpha = 0.85 * strip;
    TY.text(ctx, "PAPER STAGE  /  NO. 001", 120, 962, 15, {
      family: "DMMono",
      color: C.rgba(PAL.ink, 0.75),
      letter: 3,
    });
    for (let i = 0; i < 22; i++) {
      ctx.fillStyle = C.rgba(PAL.ink, 0.55);
      ctx.fillRect(W - 320 + i * 8, 944, 1 + (i % 3), 20);
    }
    ctx.fillStyle = C.rgba(PAL.ink, 0.2);
    ctx.fillRect(120, 972, W - 240, 1);
    ctx.restore();
  }

  endCam(ctx);

  // edge stars turn at a different rate
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * TAU + lt * 0.22;
    const r = 520 + 35 * Math.sin(i * 2.1 + lt);
    ctx.fillStyle = i % 3 ? PAL.cream : PAL.acid;
    ctx.beginPath();
    ctx.arc(W / 2 + Math.cos(a) * r, 470 + Math.sin(a) * r * 0.7, 3 + (i % 4), 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  if (lt > 2.4) {
    paperShards(ctx, W / 2, 690, lt, 24, [PAL.cream, PAL.gold, PAL.acid], 520, C.clamp(1 - (lt - 2.4) / 1.5), 8);
  }
  if (lt > 3.55) {
    paperShards(ctx, W / 2, 470, lt, 18, [PAL.cream, PAL.gold, PAL.blue], 700, C.clamp(1 - (lt - 3.55) / 0.6), 6);
  }
  if (lt > 3.7) irisOverlay(ctx, W / 2, 470, C.inv(3.7, 4.0, lt) * 1300, PAL.red, 80);
}

/* ---------------------------------------------------------------- shot 2 */
/* Sticker: torn red bed, layered pulse, a peel, a strip wipe into the cut. */
function stickerShot(lt, t) {
  bgPaper();
  const beat = C.beat(t);
  const pulse = Math.exp(-C.frac(beat) * 7);
  const push = C.smooth(lt / 5);
  const camScale = 1 + 0.055 * push + 0.014 * pulse;
  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.scale(camScale, camScale);
  ctx.translate(-W / 2, -500);

  // bed drifts left; parallax against the burst
  ctx.save();
  ctx.translate(-5 * push, 0);
  paper(ctx, () => tornRectPath(ctx, 90, 78, W - 180, H - 156, 12, 31), {
    fill: PAL.red,
    edge: C.rgba(PAL.ink, 0.45),
    edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.25),
    sx: 0,
    sy: 0,
  });
  ctx.restore();

  // halftone drifts right and re-phases on the beat
  layer(W / 2, 500, 1.02 + 0.02 * push, () => {
    halftone(ctx, 120 + 26 * push + 8 * Math.sin(lt * 0.8), 110 + 10 * Math.sin(lt * 0.6), W - 240, H - 220, PAL.ink, 20, 0.5, 0.18 + 0.06 * pulse);
  });

  // travelling key light across the red bed
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const lx = -300 + (W + 600) * C.smooth(C.clamp(lt / 5));
  const lg = ctx.createRadialGradient(lx, 200, 0, lx, 200, 620);
  lg.addColorStop(0, C.rgba(PAL.goldL, 0.26));
  lg.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // ghost numeral behind the burst
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.translate(300 - 6 * push, 1032);
  ctx.rotate(-0.06);
  TY.type(ctx, "07", 0, 0, 300, {
    align: "center",
    color: PAL.ink,
    edge: null,
    edgeW: 0,
    shadow: null,
    time: t,
    seed: 21,
    jitter: 1,
  });
  ctx.restore();

  // burst counter-rotates and hits
  const burstRot = -0.05 + 0.03 * lt + 0.02 * Math.sin(lt * 1.3) + (lt > 2.2 ? 0.12 * C.easeOut(C.clamp((lt - 2.2) / 0.3)) : 0);
  ctx.save();
  ctx.translate(W / 2, 470);
  ctx.rotate(burstRot);
  ctx.scale(1.055 + 0.02 * pulse, 1.055 + 0.02 * pulse);
  ctx.translate(-W / 2, -470);
  comicBurst(ctx, "", W / 2, 470, 330, PAL.gold, PAL.ink, 0, { n: 20, squash: 0.72, edgeW: 0 });
  ctx.restore();

  // sticker: bigger layer, beat pulse, paper squash
  const slam = C.clamp((lt - 0.12) / 0.5);
  const settle = C.backOut(slam);
  const scale = (0.74 + 0.26 * settle) * (1 + 0.035 * pulse);
  const rot = -0.055 + 0.016 * Math.sin(lt * 1.7) + 0.006 * Math.sin(lt * 5.1) - 0.008 * pulse;
  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.rotate(rot);
  ctx.scale(scale * (1 + 0.03 * pulse), scale * (1 - 0.02 * pulse));
  TY.sticker(ctx, "HOUSE LIGHTS", 0, 0, 115, {
    fill: PAL.cream,
    text: PAL.ink,
    rot: 0,
    seed: 5,
    barcode: true,
    tape: true,
    textShadow: C.rgba(PAL.ink, 0.18),
  });
  ctx.restore();

  // impact dust, then a second hit on the off-beat
  if (lt > 0.3) paperShards(ctx, W / 2, 500, lt, 34, [PAL.cream, PAL.acid, PAL.gold, PAL.red], 520, C.clamp(1 - (lt - 0.3) / 1.4), 9);
  if (lt > 2.0) paperShards(ctx, W / 2, 430, lt, 20, [PAL.cream, PAL.acid, PAL.gold], 700, C.clamp(1 - (lt - 2.0) / 1.2), 11);

  // second beat: date ticket slides in from the left
  if (lt > 2.15) {
    const u = C.backOut(C.clamp((lt - 2.15) / 0.35));
    ctx.save();
    ctx.globalAlpha = C.clamp(u);
    ctx.translate(-260 + 260 * u, 0);
    ctx.rotate(0.03);
    paper(ctx, () => tornRectPath(ctx, 120, 250, 300, 96, 4, 41), {
      fill: PAL.acid,
      edge: C.rgba(PAL.ink, 0.6),
      edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.3),
      sx: 6,
      sy: 10,
    });
    TY.text(ctx, "07 NOV", 140, 292, 34, { family: "Archivo Black", color: PAL.ink, letter: 2 });
    TY.text(ctx, "ONE NIGHT ONLY", 142, 325, 14, { family: "DMMono", color: C.rgba(PAL.ink, 0.75), letter: 2 });
    ctx.restore();
  }

  // third beat: the corner peels back to blue
  if (lt > 3.15) {
    const u = C.clamp((lt - 3.15) / 0.7);
    const s = 30 + 190 * C.easeOut(u);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(W - 90, 78);
    ctx.lineTo(W - 90 - s, 78);
    ctx.quadraticCurveTo(W - 90 - s * 0.45, 78 + s * 0.35, W - 90, 78 + s);
    ctx.closePath();
    ctx.fillStyle = PAL.blueD;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W - 90 - s, 78);
    ctx.quadraticCurveTo(W - 90 - s * 0.5, 78 + s * 0.28, W - 90 - s * 0.9, 78 + s * 0.82);
    ctx.lineTo(W - 90, 78 + s);
    ctx.closePath();
    ctx.fillStyle = PAL.cream;
    ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  TY.text(ctx, "THE LAST CUE  /  NOVA KIM", 510, 936, 20, {
    family: "DMMono",
    color: PAL.cream,
    letter: 3,
    alpha: C.seg(lt, 0.9, 1.4),
  });
  TY.text(ctx, "ONE NIGHT ONLY", W - 120, 960, 20, {
    family: "DMMono",
    color: PAL.cream,
    align: "right",
    letter: 3,
    alpha: C.seg(lt, 1.0, 1.5),
  });

  ctx.restore();

  // strip wipe into the cut
  if (lt > 4.0) {
    const u = C.easeOut(C.clamp((lt - 4.0) / 0.55));
    const w = 1500 * u;
    ctx.save();
    ctx.translate(-120, 0);
    ctx.fillStyle = PAL.blue;
    ctx.fillRect(0, 0, w, H);
    ctx.fillStyle = PAL.cream;
    ctx.fillRect(w, 0, 26, H);
    ctx.restore();
  }
  if (lt > 0.3 && lt < 0.52) flash(ctx, (lt - 0.3) * 4.5, "#FFF7E4");
}

/* ---------------------------------------------------------------- shot 3 */
/* Stage: built on camera, a two-cast duo that is not a mirror, a real
   eight-step dance, three crowd tiers and a beat-pulsed camera. */

const LEAD_POSES = [
  { bounce: 0, sway: 0, lean: -0.02, armL: [1.45, 0.05], armR: [-1.45, -0.05], legL: [0.06, 0.02], legR: [-0.06, -0.02], headTilt: 0.03, headTurn: 0.02, hairSwing: 4 },
  { bounce: -26, sway: 12, lean: 0.06, armL: [2.35, 0.1], armR: [-0.45, 0.35], legL: [0.09, 0.04], legR: [-0.04, -0.02], headTilt: -0.06, headTurn: -0.04, hairSwing: -8 },
  { bounce: -10, sway: -8, lean: -0.07, armL: [2.15, 0.2], armR: [-2.15, -0.2], legL: [0.04, 0.02], legR: [-0.1, -0.04], headTilt: 0.05, headTurn: 0.05, hairSwing: 10 },
  { bounce: -34, sway: 16, lean: 0.09, armL: [0.85, 0.45], armR: [-1.6, -0.1], legL: [0.1, 0.04], legR: [-0.03, -0.01], headTilt: -0.07, headTurn: -0.06, hairSwing: -12 },
  { bounce: -6, sway: 4, lean: 0.02, armL: [0.55, 0.05], armR: [-0.55, -0.05], legL: [0.05, 0.02], legR: [-0.05, -0.02], headTilt: 0.04, headTurn: 0.03, hairSwing: 6 },
  { bounce: -30, sway: -14, lean: -0.08, armL: [1.35, 0.2], armR: [-2.35, -0.1], legL: [0.08, 0.03], legR: [-0.05, -0.02], headTilt: -0.05, headTurn: 0.07, hairSwing: -9 },
  { bounce: -14, sway: 10, lean: 0.05, armL: [1.6, 0.05], armR: [-0.7, 0.35], legL: [0.04, 0.02], legR: [-0.09, -0.03], headTilt: 0.06, headTurn: -0.03, hairSwing: 7 },
  { bounce: -38, sway: -10, lean: -0.05, armL: [2.0, 0.45], armR: [-2.0, -0.45], legL: [0.09, 0.04], legR: [-0.06, -0.02], headTilt: -0.03, headTurn: 0.04, hairSwing: -11 },
];

const DOUBLE_POSES = [
  { bounce: -12, sway: 8, lean: 0.04, armL: [0.9, 0.2], armR: [-0.9, -0.2], legL: [0.05, 0.02], legR: [-0.05, -0.02], headTilt: -0.04, headTurn: -0.03, hairSwing: 5 },
  { bounce: -30, sway: -10, lean: -0.06, armL: [1.6, 0.1], armR: [-0.3, 0.3], legL: [0.04, 0.02], legR: [-0.08, -0.03], headTilt: 0.05, headTurn: 0.05, hairSwing: -7 },
  { bounce: -8, sway: 12, lean: 0.07, armL: [0.4, 0.4], armR: [-1.6, -0.1], legL: [0.08, 0.03], legR: [-0.04, -0.02], headTilt: -0.02, headTurn: -0.05, hairSwing: 9 },
  { bounce: -36, sway: -14, lean: -0.09, armL: [1.4, 0.1], armR: [-1.4, -0.1], legL: [0.04, 0.02], legR: [-0.09, -0.03], headTilt: 0.06, headTurn: 0.06, hairSwing: -10 },
  { bounce: -18, sway: 6, lean: 0.03, armL: [0.6, 0.3], armR: [-0.6, -0.3], legL: [0.06, 0.02], legR: [-0.06, -0.02], headTilt: -0.05, headTurn: 0.02, hairSwing: 6 },
  { bounce: -24, sway: -8, lean: -0.04, armL: [2.0, 0.2], armR: [-0.5, 0.3], legL: [0.08, 0.03], legR: [-0.05, -0.02], headTilt: 0.03, headTurn: -0.06, hairSwing: -8 },
  { bounce: -10, sway: 14, lean: 0.08, armL: [0.5, 0.4], armR: [-1.5, -0.2], legL: [0.05, 0.02], legR: [-0.07, -0.02], headTilt: -0.03, headTurn: 0.05, hairSwing: 8 },
  { bounce: -34, sway: -12, lean: -0.07, armL: [1.5, 0.2], armR: [-1.5, -0.2], legL: [0.06, 0.02], legR: [-0.05, -0.02], headTilt: 0.04, headTurn: -0.04, hairSwing: -10 },
];

function lerpPose2(a, b, u) {
  const o = {};
  for (const k in a) {
    const av = a[k], bv = b[k];
    if (typeof av === "number") o[k] = C.lerp(av, bv, u);
    else if (Array.isArray(av)) o[k] = av.map((v, i) => C.lerp(v, bv[i], u));
    else o[k] = u < 0.5 ? av : bv;
  }
  return o;
}

function snapPose(poses, beat, offset) {
  const p = beat * 2 + offset;
  const idx = Math.floor(p);
  const u = C.frac(p);
  const k = C.easeOut(C.clamp(u / 0.36));
  const from = poses[((idx - 1) % poses.length + poses.length) % poses.length];
  const to = poses[idx % poses.length];
  const pose = lerpPose2(from, to, k);
  pose.bounce -= 7 * Math.exp(-u * 9);
  return pose;
}

function stageFloor(up) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-80, 800 + up);
  ctx.lineTo(W + 80, 800 + up);
  ctx.lineTo(W + 200, H + 80 + up);
  ctx.lineTo(-200, H + 80 + up);
  ctx.closePath();
  ctx.fillStyle = PAL.blue;
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = C.rgba(PAL.cream, 0.12);
  ctx.fillRect(-200, 830 + up, W + 400, 2);
  ctx.fillRect(-200, 866 + up, W + 400, 2);
  ctx.restore();
}

function crowdTier(t, y, s, alpha, n, seedOffset) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(W / 2, y);
  ctx.scale(s, s);
  ctx.translate(-W / 2, -y);
  crowd(ctx, t + seedOffset, y, "#120E0B", n);
  ctx.restore();
}

function stageShot(lt, t) {
  const beat = C.beat(t);
  const pulse = Math.exp(-C.frac(beat) * 7);
  const floorIn = C.clamp((lt - 0.05) / 0.34);
  const sunIn = C.backOut(C.clamp((lt - 0.18) / 0.42));
  const crowdIn = C.clamp((lt - 0.32) / 0.5);
  const land = C.backOut(C.clamp((lt - 0.5) / 0.4));
  const roll = Math.sin(lt * 0.45) * 0.01 + 0.008 * Math.exp(-Math.abs(lt - 3.4) * 4) * Math.sin((lt - 3.4) * 40);
  const camZ = 1 + 0.09 * C.smooth(C.clamp(lt / 6)) + 0.025 * pulse;
  setCam(W / 2 + Math.sin(lt * 0.55) * 16, 520, camZ, roll, 0.9, t);
  beginCam(ctx);

  paperBg(ctx, PAL.redD, C.shade(PAL.redD, 16));
  sunburst(ctx, W / 2, 486, 0, 1300, 28, "#C93A20", "#E85A3A", lt * 0.06, 0.95);

  // giant sun drops in
  ctx.save();
  ctx.translate(0, (1 - sunIn) * -280);
  ctx.fillStyle = C.rgba(PAL.ink, 0.22);
  blobPath(ctx, W / 2 + 16, 470 + 18, 436, 436, 64, 0.012, 4);
  ctx.fill();
  paper(ctx, () => blobPath(ctx, W / 2, 470, 436, 436, 64, 0.012, 4), {
    fill: PAL.gold,
    edge: C.rgba(PAL.cream, 0.8),
    edgeW: 4,
    shadow: C.rgba(PAL.ink, 0.18),
    sx: 0,
    sy: 0,
  });
  halftone(ctx, W / 2 - 436, 34, 872, 872, C.shade(PAL.gold, -40), 22, 0.5, 0.12);
  ctx.restore();

  // floor wipes up
  stageFloor((1 - C.easeOut(floorIn)) * 180);

  // stage lip
  paper(ctx, () => tornRectPath(ctx, -60, 786, W + 120, 30, 6, 21), {
    fill: PAL.cream,
    edge: C.rgba(PAL.ink, 0.4),
    edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.25),
    sx: 0,
    sy: 8,
  });

  speakerStack(ctx, 148, 960, 1.0, PAL.ink, PAL.red);
  speakerStack(ctx, 1772, 960, 1.0, PAL.ink, PAL.red);

  // key light, stronger than before
  spotlight(ctx, 250, -40, 1150, 40, 420, "#FFF6DC", 0.2, -0.35);
  spotlight(ctx, W - 250, -40, 1150, 40, 420, "#FFF6DC", 0.2, 0.35);

  // crowd: back tier first, front tier after the cast
  if (crowdIn > 0) {
    crowdTier(t, 962 + (1 - crowdIn) * 60, 0.74, 0.6 * crowdIn, 16, 1.7);
    crowdTier(t, 992 + (1 - crowdIn) * 76, 0.86, 0.8 * crowdIn, 17, 3.1);
  }

  const poseA = snapPose(LEAD_POSES, beat, 0);
  const poseB = snapPose(DOUBLE_POSES, beat, 3);
  poseA.sway += Math.sin(lt * 1.7) * 4;
  poseA.lean += Math.sin(lt * 1.1) * 0.02;
  poseB.sway += Math.sin(lt * 1.7 + 1.2) * 4;
  poseB.lean += Math.sin(lt * 1.1 + 0.9) * 0.02;
  const pulseX = pulse * 6;

  shadowEllipse(ctx, 720 + Math.sin(lt * 0.8) * 6, 964, 66, 13, 0.34);
  ctx.save();
  ctx.translate(0, (1 - land) * 70);
  ctx.scale(1 + 0.1 * (1 - land), 0.9 + 0.1 * land);
  ctx.translate(0, -((1 - land) * 70));
  idol(ctx, 720 + Math.sin(lt * 0.8) * 6 + pulseX, 958, 1.06, {
    t,
    pose: poseA,
    outfit: "stage",
    colors: { jacket: PAL.red, sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.red, hair: PAL.ink, skin: "#F0C9A4" },
    petals: 0,
    earrings: true,
    shadow: 1,
  });
  ctx.restore();

  const cross = C.ease(C.clamp((lt - 3.2) / 0.9));
  shadowEllipse(ctx, 1160 - 155 * cross - Math.sin(lt * 0.8 + 0.7) * 6, 978, 58, 12, 0.3);
  ctx.save();
  ctx.translate(0, (1 - land) * 70);
  ctx.scale(1 + 0.1 * (1 - land), 0.9 + 0.1 * land);
  ctx.translate(0, -((1 - land) * 70));
  mira(ctx, 1160 - 155 * cross - Math.sin(lt * 0.8 + 0.7) * 6 - pulseX, 988, 1.2 + 0.04 * cross, {
    t: t + 0.21,
    flip: -1,
    pose: poseB,
    coatCol: PAL.acid,
    trouser: PAL.ink,
    skin: "#E8B98F",
    hair: PAL.ink,
  });
  ctx.restore();

  // front crowd occludes the stage lip
  if (crowdIn > 0) {
    crowdTier(t, 1024 + (1 - crowdIn) * 96, 1.0, crowdIn, 18, 5.3);
  }

  // confetti, two depths
  layer(W / 2, 600, 0.8, () => {
    ctx.globalAlpha = 0.55;
    confetti(ctx, t, 26, [PAL.cream, PAL.acid, PAL.gold], 0.8);
  });
  confetti(ctx, t, 34, [PAL.cream, PAL.acid, PAL.gold, PAL.blue], 1);

  // dust at the landing
  if (lt > 0.5 && lt < 1.2) {
    paperShards(ctx, 940, 960, lt, 18, [PAL.cream, PAL.gold], 520, C.clamp(1 - (lt - 0.5) / 0.7), 5);
  }

  // meter
  ctx.save();
  ctx.translate(W - 350, 54);
  ctx.rotate(0.015);
  paper(ctx, () => tornRectPath(ctx, 0, 0, 270, 94, 2, 13), {
    fill: PAL.ink,
    edge: PAL.cream,
    edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.25),
    sx: 4,
    sy: 8,
  });
  TY.text(ctx, String(Math.floor(beat) + 1).padStart(2, "0"), 20, 50, 34, { family: "DMMono", color: PAL.acid, weight: "500" });
  TY.text(ctx, `${34 + Math.floor((lt / 6) * 18)}%`, 130, 46, 18, { family: "DMMono", color: PAL.cream });
  ctx.fillStyle = PAL.acid;
  for (let i = 0; i < 4; i++) ctx.fillRect(20 + i * 58, 64, 46, 10);
  ctx.fillStyle = C.rgba(PAL.cream, 0.35);
  ctx.fillRect(20, 64, 230 + pulse * 8, 2);
  ctx.restore();

  // lower third lands late
  const third = lt < 4.34 ? 0 : C.backOut(C.clamp((lt - 4.35) / 0.5));
  if (third > 0.001) {
    ctx.save();
    ctx.globalAlpha = C.clamp(third);
    ctx.translate(0, (1 - third) * 90);
    paper(ctx, () => tornRectPath(ctx, 70, 858, 720, 120, 5, 9), {
      fill: PAL.paper,
      edge: C.rgba(PAL.ink, 0.4),
      edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.22),
      sx: 4,
      sy: 8,
    });
    TY.type(ctx, "HOUSE LIGHTS", 96, 924, 52, {
      align: "left",
      color: PAL.ink,
      edge: null,
      edgeW: 0,
      shadow: null,
      time: t,
      seed: 3,
      alpha: C.clamp(third),
    });
    TY.text(ctx, "NOVA KIM  /  THE LAST CUE", 98, 956, 15, {
      family: "DMMono",
      color: C.rgba(PAL.ink, 0.7),
      letter: 2,
      alpha: C.clamp(third),
    });
    ctx.restore();
  }

  endCam(ctx);

  if (pulse > 0.7) {
    ctx.save();
    ctx.globalAlpha = (pulse - 0.7) * 0.12;
    ctx.fillStyle = PAL.acid;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (lt > 5.7) irisOverlay(ctx, 720, 380, C.inv(5.7, 6.05, lt) * 1300, PAL.paper, 70);
}

function drawPaperAt(t) {
  try {
    ctx.clearRect(0, 0, W, H);
    if (t < 4) openShot(t, t);
    else if (t < 9) stickerShot(t - 4, t);
    else stageShot(t - 9, t);
    paperOverlay(ctx, t, 0.42);
    grainOverlay(ctx, t, 0.36);
    vignette(ctx, 0.12);
  } catch (error) {
    console.error(error);
    ctx.fillStyle = "#0e0b09";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f3ead9";
    ctx.font = "28px monospace";
    ctx.fillText(String(error && error.message ? error.message : error), 60, 100);
    ctx.fillText(String(error && error.stack ? error.stack.split("\n")[1] : ""), 60, 150);
  }
}
