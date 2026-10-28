/* Paper K-pop S2 proof scenes.
   Three shots, 4 / 5 / 6 seconds. Fictional Nova Kim. No source film story. */

const SHOTS = [
  { id: "open", start: 0, end: 4 },
  { id: "sticker", start: 4, end: 9 },
  { id: "stage", start: 9, end: 15 },
];

function bgPaper() {
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(0, 0, W, H);
}

function openShot(lt, t) {
  bgPaper();
  const ease = C.easeOut(C.clamp(lt / 0.7));
  const push = 1 + 0.045 * C.smooth(C.clamp(lt / 4));
  setCam(W / 2, 500, push, Math.sin(lt * 0.6) * 0.006, 0, t);
  beginCam(ctx);

  sunburst(ctx, W / 2, 470, 110 + 90 * ease, 410 + 160 * ease, 30, PAL.acid, PAL.paper2, lt * 0.22, 0.95);
  paper(ctx, () => blobPath(ctx, W / 2, 470, 185 * ease, 185 * ease, 64, 0.008, 8), {
    fill: PAL.gold,
    edge: C.rgba(PAL.ink, 0.35),
    edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.18),
    sx: 0,
    sy: 0,
  });
  halftone(ctx, W / 2 - 240, 230, 480, 480, PAL.red, 18, 0.5, 0.15);

  const drop = C.clamp((lt - 0.35) / 1.4);
  TY.type(ctx, "LAST CUE", W / 2, 500, 190, {
    align: "center",
    color: PAL.ink,
    edge: PAL.paper,
    edgeW: 14,
    shadow: C.rgba(PAL.ink, 0.28),
    shadowOff: 9,
    time: t,
    seed: 7,
    charRot: 0.02,
    perChar: (i) => C.clamp((lt - 0.35 - i * 0.035) / 0.4),
  });
  TY.text(ctx, "NOVA KIM  ·  ONE NIGHT  ·  07 NOV", W / 2, 570, 22, {
    family: "DMMono",
    color: PAL.ink,
    align: "center",
    letter: 3,
    alpha: C.seg(lt, 1.1, 1.7),
  });
  if (lt > 2.1) {
    TY.sticker(ctx, "THE LAST ENTRANCE", W / 2, 650, 35, {
      fill: PAL.cream,
      text: PAL.ink,
      rot: -0.018,
      seed: 12,
      barcode: true,
      tape: true,
    });
  }
  endCam(ctx);

  // rings / sparkles at the edges
  ctx.save();
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * TAU + lt * 0.15;
    const r = 520 + 35 * Math.sin(i * 2.1 + lt);
    ctx.fillStyle = i % 3 ? PAL.cream : PAL.acid;
    ctx.beginPath();
    ctx.arc(W / 2 + Math.cos(a) * r, 470 + Math.sin(a) * r * 0.7, 3 + (i % 4), 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  if (lt > 2.45) {
    paperShards(ctx, W / 2, 470, lt, 22, [PAL.cream, PAL.gold, PAL.acid], 460, C.clamp(1 - (lt - 2.45) / 1.5), 5);
  }
  if (lt > 3.7) irisOverlay(ctx, W / 2, 470, C.inv(3.7, 4.05, lt) * 1300, PAL.red, 80);
}

function stickerShot(lt, t) {
  bgPaper();
  const slam = C.clamp((lt - 0.15) / 0.55);
  const settle = C.backOut(C.clamp((lt - 0.2) / 0.9));
  const scale = 0.72 + 0.28 * settle;
  const rot = -0.06 + 0.018 * Math.sin(lt * 1.7) + 0.008 * Math.sin(lt * 5.1);
  const pulse = Math.exp(-C.frac(C.beat(t)) * 5);
  const camScale = 1 + 0.025 * C.smooth(lt / 5) + 0.022 * pulse;
  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.scale(camScale, camScale);
  ctx.translate(-W / 2, -500);

  // torn red bed
  paper(ctx, () => tornRectPath(ctx, 90, 78, W - 180, H - 156, 12, 31), {
    fill: PAL.red,
    edge: C.rgba(PAL.ink, 0.45),
    edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.25),
    sx: 0,
    sy: 0,
  });
  halftone(ctx, 120, 110, W - 240, H - 220, PAL.ink, 20, 0.5, 0.2);

  // accent burst behind the sticker
  comicBurst(ctx, "", W / 2, 470, 320, PAL.gold, PAL.ink, -0.05, { n: 20, squash: 0.72, edgeW: 0 });

  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
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

  // impact dust
  if (lt > 0.32) paperShards(ctx, W / 2, 500, lt, 34, [PAL.cream, PAL.acid, PAL.gold, PAL.red], 520, C.clamp(1 - (lt - 0.32) / 1.4), 9);

  TY.text(ctx, "THE LAST CUE  /  NOVA KIM", 120, 960, 20, {
    family: "DMMono",
    color: PAL.cream,
    letter: 3,
    alpha: C.seg(lt, 0.9, 1.4),
  });
  TY.text(ctx, "ONE NIGHT ONLY", W - 120, 960, 20, {
    family: "DMMono",
    color: PAL.acid,
    align: "right",
    letter: 3,
    alpha: C.seg(lt, 1.0, 1.5),
  });

  ctx.restore();
  if (lt > 2.4) {
    paperShards(ctx, W / 2, 500, lt, 22, [PAL.cream, PAL.acid, PAL.gold], 700, C.clamp(1 - (lt - 2.4) / 1.4), 12);
  }
  if (lt > 0.32 && lt < 0.55) flash(ctx, (lt - 0.32) * 4, "#FFF7E4");
}

function stageShot(lt, t) {
  const beat = C.beat(t);
  const pulse = Math.exp(-C.frac(beat) * 5);
  const camZ = 1 + 0.045 * C.smooth(C.clamp(lt / 6)) + 0.015 * pulse;
  setCam(W / 2, 540, camZ, Math.sin(lt * 0.7) * 0.01 + pulse * 0.002, 0, t);
  beginCam(ctx);

  stageSet(ctx, t, {
    sky: PAL.redD,
    sun: PAL.gold,
    floor: PAL.blue,
    accent: PAL.cream,
    crowd: true,
    confetti: 48,
    confettiCols: [PAL.cream, PAL.acid, PAL.gold, PAL.blue],
    rot: lt * 0.02,
  });

  const phrase = Math.floor(beat / 2) % 4;
  const poseA = [
    { armL: [-1.0, -0.2], armR: [1.0, 0.2], legL: [-0.07, -0.02], legR: [0.07, 0.02], headTilt: 0.04 },
    { armL: [-0.35, -1.1], armR: [0.6, 0.2], legL: [-0.05, -0.02], legR: [0.06, 0.02], headTilt: -0.05 },
    { armL: [-0.7, -0.5], armR: [1.1, 0.5], legL: [-0.08, -0.02], legR: [0.05, 0.02], headTilt: 0.03 },
    { armL: [-0.5, 0.1], armR: [0.3, 1.0], legL: [-0.05, -0.02], legR: [0.08, 0.02], headTilt: -0.04 },
  ][phrase];
  const poseB = [
    { armL: [-0.4, -0.3], armR: [0.4, 0.3], headTilt: -0.04 },
    { armL: [-0.9, -0.2], armR: [0.2, 0.6], headTilt: 0.05 },
    { armL: [-0.3, -0.5], armR: [1.0, 0.5], headTilt: -0.02 },
    { armL: [-0.6, 0.2], armR: [0.3, -1.0], headTilt: 0.04 },
  ][(phrase + 1) % 4];
  const bounce = -Math.abs(Math.sin(C.frac(beat) * Math.PI)) * 18;
  const sway = Math.sin(C.frac(beat) * Math.PI) * 8;
  const leadX = 700 + Math.sin(lt * 0.8) * 8 + pulse * 5;
  const secondX = 1210 - Math.sin(lt * 0.8 + 0.7) * 8 - pulse * 5;
  idol(ctx, leadX, 955, 1.12, {
    t,
    pose: {
      bounce,
      sway,
      lean: Math.sin(C.frac(beat) * Math.PI) * 0.05,
      armL: poseA.armL,
      armR: poseA.armR,
      legL: poseA.legL,
      legR: poseA.legR,
      headTilt: poseA.headTilt,
      headTurn: Math.sin(lt * 1.1) * 0.04,
      hairSwing: Math.sin(lt * 2.2) * 5,
    },
    outfit: "stage",
    colors: { jacket: PAL.red, sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.red, hair: PAL.ink, skin: "#F0C9A4" },
    petals: 12,
    earrings: true,
    shadow: 1,
  });
  idol(ctx, secondX, 955, 1.12, {
    t: t + 0.5,
    flip: -1,
    pose: {
      bounce: -Math.abs(Math.sin(C.frac(beat + 0.5) * Math.PI)) * 18,
      sway: -Math.sin(C.frac(beat + 0.5) * Math.PI) * 8,
      lean: -Math.sin(C.frac(beat) * Math.PI) * 0.05,
      armL: poseB.armL,
      armR: poseB.armR,
      legL: [-0.05, -0.02],
      legR: [0.06, 0.02],
      headTilt: poseB.headTilt,
      headTurn: Math.sin(lt * 1.1 + 0.6) * 0.04,
      hairSwing: Math.sin(lt * 2.2 + 0.6) * 5,
    },
    outfit: "stage",
    colors: { jacket: PAL.acid, sleeve: PAL.cream, skirt: PAL.blue, boot: PAL.red, hair: PAL.ink, skin: "#F0C9A4" },
    petals: 12,
    earrings: true,
    shadow: 1,
  });

  // black meter sticker
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
  ctx.fillRect(20, 64, 230, 2);
  ctx.restore();

  // lower third lands on the beat
  const land = C.backOut(C.clamp((lt - 4.1) / 0.6));
  ctx.save();
  ctx.globalAlpha = land;
  ctx.translate(0, (1 - land) * 90);
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
  });
  TY.text(ctx, "NOVA KIM  /  THE LAST CUE", 98, 956, 15, {
    family: "DMMono",
    color: C.rgba(PAL.ink, 0.7),
    letter: 2,
  });
  ctx.restore();

  endCam(ctx);

  if (pulse > 0.7) {
    ctx.save();
    ctx.globalAlpha = (pulse - 0.7) * 0.15;
    ctx.fillStyle = PAL.acid;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (lt > 5.7) irisOverlay(ctx, W / 2, 500, C.inv(5.7, 6.05, lt) * 1300, PAL.paper, 70);
}

function drawPaperAt(t) {
  try {
    ctx.clearRect(0, 0, W, H);
    if (t < 4) openShot(t, t);
    else if (t < 9) stickerShot(t - 4, t);
    else stageShot(t - 9, t);
    paperOverlay(ctx, t, 0.5);
    grainOverlay(ctx, t, 0.42);
    vignette(ctx, 0.3);
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
