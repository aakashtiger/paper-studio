/* Score-driven Paper K-pop backend for The Understudy (technical slice). */



function bgPaper() {
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(0, 0, W, H);
}

function libFor(name) {
  if (!window.POSES) return null;
  const key = Object.keys(window.POSES).find((k) => name.toLowerCase().includes(k.toLowerCase().split(" ")[0]));
  return key ? window.POSES[key] : null;
}

function clonePose(params) {
  const out = {};
  for (const [key, value] of Object.entries(params || {})) {
    out[key] = Array.isArray(value) ? value.slice() : value;
  }
  return out;
}

function poseFor(name, poseName) {
  const lib = libFor(name);
  if (!lib) return {};
  const pose = lib.poses.find((p) => p.name === poseName) || lib.poses[0];
  // Always a copy: callers adjust poses (headTurn, sway). Returning the live
  // library object let those adjustments accumulate across frames, so the same
  // time painted differently depending on how many frames came before it.
  return pose ? clonePose(pose.params) : {};
}

function colorsFor(name) {
  const lib = libFor(name);
  if (!lib) return {};
  const colors = {};
  for (const [key, value] of Object.entries(lib.colors)) colors[key] = PAL[value] || value;
  return colors;
}

function drawCharacter(name, x, y, scale, poseName, flip, poseOverride, time) {
  const pose = livingPose(poseOverride || poseFor(name, poseName), time || 0, 1);
  const colors = colorsFor(name);
  const t = time || 0;
  if (/mira/i.test(name)) {
    mira(ctx, x, y, scale, { pose, ...colors, flip: flip || 1, shadow: 1, t });
  } else {
    idol(ctx, x, y, scale, {
      pose, outfit: "stage", colors, flip: flip || 1,
      t, petals: 0, earrings: true, shadow: 1,
    });
  }
}

function blendValue(a, b, k) {
  if (typeof a === "number" && typeof b === "number") return a + (b - a) * k;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((value, index) =>
      typeof value === "number" && typeof b[index] === "number"
        ? value + (b[index] - value) * k
        : k < 0.5 ? value : b[index],
    );
  }
  return k < 0.5 ? a : b;
}

function blendPose(a, b, k) {
  const out = {};
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const key of keys) out[key] = blendValue(a ? a[key] : undefined, b ? b[key] : undefined, k);
  return out;
}

function poseAt(name, keys, lt) {
  if (!keys.length) return poseFor(name, "idle");
  if (lt <= keys[0].t) return poseFor(name, keys[0].pose);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (lt >= a.t && lt <= b.t) {
      const k = C.smooth(C.clamp((lt - a.t) / Math.max(1e-4, b.t - a.t)));
      return blendPose(poseFor(name, a.pose), poseFor(name, b.pose), k);
    }
  }
  return poseFor(name, keys[keys.length - 1].pose);
}

/**
 * Living hold: a pose is never frozen. The hips breathe and shift, the head
 * leads, the hair follows. Feet stay on their IK targets, so the knees take
 * the weight change.
 */
function livingPose(pose, t, amp = 1) {
  const p = { ...pose };
  p.sway = (p.sway || 0) + Math.sin(t * 1.25) * 2.6 * amp;
  p.bounce = (p.bounce || 0) + Math.sin(t * 2.1 + 0.7) * 2.2 * amp;
  p.headTurn = (p.headTurn || 0) + Math.sin(t * 0.85) * 0.018 * amp;
  p.headTilt = (p.headTilt || 0) + Math.sin(t * 1.7 + 1.2) * 0.012 * amp;
  p.hairSwing = (p.hairSwing || 0) + Math.sin(t * 1.05) * 2.2 * amp;
  return p;
}

function cueLamp(x, y, scale, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const g = ctx.createRadialGradient(0, 10, 0, 0, 10, 210);
  g.addColorStop(0, C.rgba(PAL.goldL, 0.55));
  g.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-280, -280, 560, 560);
  spotlight(ctx, 0, 4, 540, 30, 260, "#FFF4D8", 0.22, -0.12);
  // torn paper shade, narrow at the top and wide at the lip
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-54, -96);
    ctx.lineTo(52, -92);
    ctx.lineTo(76, -12);
    ctx.lineTo(-72, -16);
    ctx.closePath();
  }, {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.5,
    shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 9,
  });
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(-46, -80, 32, 15);
  ctx.fillStyle = PAL.ink;
  ctx.font = "10px DMMono";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CUE", -30, -72);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  // bulb under the shade
  ctx.save();
  const halo = ctx.createRadialGradient(0, 18, 0, 0, 18, 190);
  const flick = 0.55 + 0.08 * Math.sin(t * 9.1) + 0.04 * Math.sin(t * 23.7);
  halo.addColorStop(0, C.rgba(PAL.goldL, flick));
  halo.addColorStop(0.45, C.rgba(PAL.goldL, 0.22));
  halo.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(-200, -180, 400, 400);
  ctx.restore();
  paper(ctx, () => blobPath(ctx, 0, 18, 33, 33, 17, 0.02, 4), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.2), sx: 2, sy: 4,
  });
  ctx.fillStyle = C.rgba("#FFF7E4", 0.7);
  ctx.beginPath();
  ctx.arc(-10, 8, 9, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(0, 44);
  ctx.stroke();
  // stem and base
  ctx.fillStyle = C.rgba(PAL.ink, 0.8);
  ctx.fillRect(-4, 44, 8, 60);
  paper(ctx, () => roundRectPath(ctx, -46, 100, 92, 12, 5), {
    fill: PAL.ink, edge: null, shadow: C.rgba(PAL.ink, 0.24), sx: 2, sy: 4,
  });
  ctx.restore();
}

function paperOpen(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  const push = 1 + 0.06 * C.smooth(C.clamp(lt / d));
  setCam(W / 2, 500, push, Math.sin(lt * 0.6) * 0.006, 0.6, t);
  beginCam(ctx);
  sunburst(ctx, W / 2, 470, 120, 630, 30, PAL.gold, PAL.paper2, lt * 0.32, 0.95);
  const coreIn = C.backOut(C.clamp(lt / 0.55));
  paper(ctx, () => blobPath(ctx, W / 2, 500, 172 * coreIn, 172 * coreIn, 64, 0.008, 8), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.35), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 7, sy: 10,
  });

  const title = shot.slots["content.title"] || "THE UNDERSTUDY";
  const titleIn = C.clamp((lt - 0.2) / 0.4);
  ctx.save();
  ctx.translate(0, (1 - C.backOut(titleIn)) * -60);
  TY.type(ctx, title, W / 2, 350, 150, {
    align: "center", color: PAL.ink, edge: PAL.cream, edgeW: 14,
    shadow: C.rgba(PAL.ink, 0.3), shadowOff: 9, time: t, seed: 7,
    charRot: 0.02,
    perChar: (i) => C.backOut(C.clamp((lt - 0.2 - i * 0.03) / 0.34)),
  });
  ctx.restore();

  const subtitle = shot.slots["content.subtitle"] || "";
  const tab = C.seg(lt, 0.7, 1.1);
  if (subtitle && tab > 0) {
    ctx.save();
    ctx.globalAlpha = tab;
    paper(ctx, () => tornRectPath(ctx, W / 2 - 300, 500, 600, 46, 3, 23), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.22), sx: 5, sy: 8,
    });
    TY.text(ctx, subtitle, W / 2, 530, 21, {
      family: "DMMono", color: PAL.ink, align: "center", letter: 3,
    });
    ctx.restore();
  }

  paper(ctx, () => tornRectPath(ctx, 1450, 356, 320, 18, 4, 19), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 10,
  });
  cueLamp(W - 330, 250, 1, t);
  endCam(ctx);
  if (lt > 1.5) paperShards(ctx, W / 2, 500, lt, 24, [PAL.cream, PAL.gold, PAL.red], 520, C.clamp(1 - (lt - 1.5) / 0.7), 8);
  if (lt > 1.8) {
    const iris = Math.max(1, (1 - C.inv(1.8, d, lt)) * 1300);
    irisOverlay(ctx, W / 2, 500, iris, PAL.red, 80);
  }
}

function portrait(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  const name = shot.slots["content.names"] || "NOVA";
  const caption = shot.slots["content.caption"] || "THE STAR";
  const miraShot = /mira/i.test(name);
  const keys = miraShot
    ? [
        { t: 0, pose: "idle" },
        { t: 0.35, pose: "step" },
        { t: 1.15, pose: "idle" },
        { t: 2.2, pose: "point" },
        { t: d, pose: "point" },
      ]
    : [
        { t: 0, pose: "idle" },
        { t: 1.0, pose: "reach" },
        { t: d, pose: "reach" },
      ];
  const pose = poseAt(name, keys, lt);
  const zoom = 1.42;
  const push = zoom + 0.05 * C.smooth(C.clamp(lt / d));
  setCam(W / 2, 520, push, Math.sin(lt * 0.5) * 0.005, 0.5, t);
  beginCam(ctx);
  sunburst(ctx, W / 2, 480, 180, 700, 28, PAL.gold, PAL.paper2, lt * 0.18, 0.85);

  paper(ctx, () => tornRectPath(ctx, 620, 110, 880, 860, 10, 11), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.5), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
  });
  paper(ctx, () => tornRectPath(ctx, 650, 140, 820, 800, 7, 21), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.35), edgeW: 2,
  });
  halftone(ctx, 680, 170, 760, 740, PAL.ink, 22, 0.5, 0.13);

  if (miraShot) {
    spotlight(ctx, 1120, -90, 1060, 90, 640, "#F2B33A", 0.16, 0.16);
    spotlight(ctx, 1120, -70, 1040, 40, 520, "#F2B33A", 0.38, 0.16);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = C.rgba(PAL.gold, 0.9);
    ctx.beginPath();
    ctx.ellipse(W / 2, 900, 260, 32, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  } else {
    cueLamp(1320, 488, 1.15, t);
  }

  drawCharacter(name, 1000, miraShot ? 960 : 1160, miraShot ? 1.34 : 1.28, "idle", miraShot ? -1 : 1, pose, t);
  endCam(ctx);

  paper(ctx, () => tornRectPath(ctx, 76, 208, 370, 232, 5, 17), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
  });
  TY.type(ctx, name, 120, 300, 80, {
    align: "left", color: PAL.ink, edge: PAL.cream, edgeW: 8,
    shadow: null, time: t, seed: 5,
    charRot: 0.02,
  });
  TY.text(ctx, caption, 124, 356, 24, {
    family: "DMMono", color: PAL.red, letter: 3,
  });
  TY.text(ctx, "THE LAST CUE", 124, 410, 14, {
    family: "DMMono", color: C.rgba(PAL.ink, 0.6), letter: 2,
  });
  TY.vertical(ctx, "PAPER STAGE", 1790, 220, 14, {
    family: "DMMono", color: C.rgba(PAL.ink, 0.55),
  });
  if (lt > d - 0.4) paperShards(ctx, W / 2, 700, lt, 18, [PAL.cream, PAL.gold, PAL.red], 480, C.clamp(1 - (lt - (d - 0.4)) / 0.4), 5);
}

function stage(shot, lt, t) {
  const d = shot.duration;
  const body = shot.slots["content.body"] || "";
  const duet = /\bTWO\b/i.test(body);
  const lightShot = /LIGHT/i.test(body);
  const oneNight = /ONE NIGHT/i.test(body);
  const crowdRise = duet ? 0 : lightShot ? 1 - C.smooth(C.clamp((lt - 1.4) / 0.6)) : oneNight ? 1 - C.smooth(C.clamp((lt - 2.2) / 0.6)) : 0;
  const pulse = Math.exp(-C.frac(C.beat(t)) * 6);
  setCam(W / 2 + Math.sin(lt * 0.55) * 14, 520, 1 + 0.05 * C.smooth(C.clamp(lt / d)) + 0.012 * pulse, Math.sin(lt * 0.45) * 0.006, 0.7, t);
  beginCam(ctx);
  stageSet(ctx, t, {
    sky: PAL.redD, sun: PAL.gold, floor: PAL.blue, accent: PAL.cream,
    crowd: true, crowdY: 1052 + crowdRise * 220,
    confetti: 40, confettiCols: [PAL.cream, PAL.gold, PAL.blue, PAL.red],
    rot: lt * 0.03,
  });
  let poseA;
  let poseB;
  if (duet) {
    const join = C.smooth(C.clamp((lt - 1.4) / 0.6));
    poseA = blendPose(poseFor("Nova", "idle"), poseFor("Nova", "duet-left"), join);
    poseB = blendPose(poseFor("Mira", "idle"), poseFor("Mira", "duet-right"), join);
    const duetStart = 1.9;
    if (lt >= duetStart) {
      const count = Math.floor((lt - duetStart) / 0.55);
      const phase = C.frac((lt - duetStart) / 0.55);
      const ease = C.smooth(phase);
      const seqA = ["duet-left", "duet-right", "duet-left", "duet-right"];
      const seqB = ["duet-right", "duet-left", "duet-right", "duet-left"];
      const a0 = seqA[((count % 4) + 4) % 4];
      const a1 = seqA[(((count + 1) % 4) + 4) % 4];
      const b0 = seqB[((count % 4) + 4) % 4];
      const b1 = seqB[(((count + 1) % 4) + 4) % 4];
      const cycleA = blendPose(poseFor("Nova", a0), poseFor("Nova", a1), ease);
      const cycleB = blendPose(poseFor("Mira", b0), poseFor("Mira", b1), ease);
      const into = C.smooth(C.clamp((lt - duetStart) / 0.3));
      poseA = blendPose(poseA, cycleA, into);
      poseB = blendPose(poseB, cycleB, into);
    }
  } else if (lightShot) {
    poseA = poseAt("Nova", [{ t: 0, pose: "idle" }, { t: 0.5, pose: "listen" }], lt);
    poseB = poseAt("Mira", [{ t: 0, pose: "idle" }, { t: 0.4, pose: "point" }], lt);
    const look = C.smooth(C.clamp((lt - 1.2) / 0.5));
    poseA.headTurn = (poseA.headTurn || 0) + look * 0.25;
    poseA.sway = (poseA.sway || 0) + look * 3;
    poseB.headTurn = (poseB.headTurn || 0) - look * 0.18;
    poseB.sway = (poseB.sway || 0) + look * 4;
    const settle = C.smooth(C.clamp((lt - 2.6) / 0.5));
    if (settle > 0) poseB = blendPose(poseB, poseFor("Mira", "idle"), settle * 0.7);
  } else {
    poseA = poseAt("Nova", [{ t: 0, pose: "idle" }, { t: 0.35, pose: "point" }], lt);
    poseB = poseAt("Mira", [{ t: 0, pose: "idle" }, { t: 0.5, pose: "listen" }], lt);
  }
  if (duet && lt < 1.4) {
    const phase = (lt - 0.3) / 0.34;
    const swing = Math.sin(phase * Math.PI);
    const base = poseFor("Nova", "idle");
    poseA = {
      ...base,
      footL: [-31, -12 - 26 * Math.max(0, swing)],
      footR: [33, -12 - 26 * Math.max(0, -swing)],
      bounce: -6 * Math.abs(swing),
      armL: [0.2 + 0.18 * swing, 0.05],
      armR: [-0.2 - 0.18 * swing, -0.05],
    };
  }
  const bob = -Math.abs(Math.sin(C.frac(C.beat(t)) * Math.PI)) * 12;
  const formation = duet ? C.smooth(C.clamp((lt - 3.0) / 0.5)) : 0;
  const novaX = duet ? 60 + 740 * C.smooth(C.clamp((lt - 0.3) / 0.9)) + formation * 35 : 700;
  const miraX = duet ? 1100 - formation * 35 : 1180;
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = PAL.ink;
  ctx.beginPath(); ctx.ellipse(novaX, 966, 70, 12, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(miraX, 991, 52, 10, 0, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(0, bob);
  drawCharacter("Nova", novaX, 960, 1.12, "point", 1, poseA, t);
  drawCharacter("Mira", miraX, 985, 0.98, "listen", -1, poseB, t);
  ctx.restore();

  if (shot.slots["content.body"] && d >= 3.2) {
    const land = C.clamp(C.backOut(C.clamp((lt - (d - 1.8)) / 0.5)));
    if (land > 0) {
      ctx.save();
      ctx.globalAlpha = land;
      ctx.translate((1 - land) * 90, 0);
      paper(ctx, () => tornRectPath(ctx, 1120, 90, 620, 128, 5, 9), {
        fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.22), sx: 4, sy: 8,
      });
      TY.type(ctx, shot.slots["content.body"], 1146, 156, 50, {
        align: "left", color: PAL.ink, edge: null, edgeW: 0, shadow: null, time: t, seed: 3,
        alpha: land,
      });
      TY.text(ctx, shot.slots["content.caption"] || "", 1148, 192, 15, {
        family: "DMMono", color: C.rgba(PAL.ink, 0.7), letter: 2, alpha: land,
      });
      ctx.restore();
    }
  }
  endCam(ctx);
  if (pulse > 0.7) {
    ctx.save(); ctx.globalAlpha = (pulse - 0.7) * 0.12; ctx.fillStyle = PAL.gold; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
}

function sticker(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  const push = 1 + 0.05 * C.smooth(C.clamp(lt / d));
  ctx.save();
  ctx.translate(W / 2, 500); ctx.scale(push, push); ctx.translate(-W / 2, -500);
  paper(ctx, () => tornRectPath(ctx, 90, 78, W - 180, H - 156, 12, 31), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.45), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.25), sx: 0, sy: 0,
  });
  halftone(ctx, 120, 110, W - 240, H - 220, PAL.ink, 20, 0.5, 0.2);
  comicBurst(ctx, "", W / 2, 470, 340, PAL.gold, PAL.ink, -0.05, { n: 20, squash: 0.72, edgeW: 0 });
  if (lt > 0.2) paperShards(ctx, W / 2, 500, lt, 30, [PAL.cream, PAL.gold, PAL.red], 720, C.clamp(1 - (lt - 0.2) / 1.2), 9);
  const settle = C.clamp((lt - 0.03) / 0.42);
  const hit = C.backOut(settle);
  const scale = 1.55 - 0.55 * hit;
  const wobble = Math.sin(settle * Math.PI * 3) * 0.09 * (1 - settle);
  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.rotate(-0.045 + 0.015 * Math.sin(lt * 1.8) + 0.03 * (1 - settle));
  ctx.scale(scale * (1 + wobble), scale * (1 - wobble));
  TY.sticker(ctx, shot.slots["content.body"] || "NO NOVA", 0, 0, 112, {
    fill: PAL.cream, text: PAL.ink, rot: 0, seed: 5, barcode: true, tape: true,
    textShadow: C.rgba(PAL.ink, 0.18),
  });
  ctx.restore();
  ctx.restore();
  if (lt > 0.2 && lt < 0.45) flash(ctx, (lt - 0.2) * 4, "#FFF7E4");
  TY.text(ctx, "THE LAST CUE  /  NOVA", 120, 960, 20, {
    family: "DMMono", color: PAL.cream, letter: 3, alpha: C.seg(lt, 0.7, 1.2),
  });
}

function paperHand(x, y, s, rot, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, 30, -42, 820, 84, 22), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 6, sy: 10,
  });
  paper(ctx, () => roundRectPath(ctx, 0, -50, 38, 100, 8), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5,
  });
  // palm
  paper(ctx, () => roundRectPath(ctx, -14, -38, 66, 76, 24), {
    fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.5), edgeW: 2.5,
    shadow: C.rgba(PAL.ink, 0.18), sx: 3, sy: 6,
  });
  // four fingers fan toward the lamp
  for (let i = 0; i < 4; i++) {
    const fy = -30 + i * 20;
    const len = 46 - Math.abs(i - 1.5) * 6;
    paper(ctx, () => roundRectPath(ctx, -12 - len, fy - 8, len + 18, 16, 8), {
      fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.45), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.14), sx: 2, sy: 4,
    });
  }
  // thumb
  ctx.save();
  ctx.translate(-4, 34);
  ctx.rotate(0.5);
  paper(ctx, () => roundRectPath(ctx, -48, -9, 58, 18, 9), {
    fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.45), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.14), sx: 2, sy: 4,
  });
  ctx.restore();
  ctx.restore();
}

function macro(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  setCam(W / 2 + 30, 520, 1 + 0.09 * C.smooth(C.clamp(lt / d)), 0, 0.4, t);
  beginCam(ctx);
  paper(ctx, () => tornRectPath(ctx, 60, 60, W - 120, H - 120, 16, 17), {
    fill: PAL.paper2, edge: C.rgba(PAL.ink, 0.35), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.2), sx: 10, sy: 14,
  });
  halftone(ctx, 90, 90, 560, 520, PAL.ink, 26, 0.5, 0.09);
  halftone(ctx, 1270, 90, 560, 520, PAL.ink, 26, 0.5, 0.07);
  paper(ctx, () => tornRectPath(ctx, 120, 896, 1680, 28, 5, 13), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 12,
  });

  const swing = -0.05 + Math.sin(lt * 4.2) * 0.12 * Math.exp(-lt * 0.55) + Math.sin(lt * 1.3) * 0.018;
  ctx.save();
  ctx.translate(W / 2 + 20, 560);
  ctx.rotate(swing);
  ctx.scale(3.2, 3.2);
  cueLamp(0, 0, 1, t);
  ctx.restore();

  const enter = C.smooth(C.clamp((lt - 0.7) / 0.35));
  if (enter > 0) {
    const retreat = C.smooth(C.clamp((lt - 1.55) / 0.5));
    const handIn = enter * (1 - 0.55 * retreat);
    paperHand(1140 + (1 - handIn) * 260, 604, 1.4, -0.12, enter);
  }

  if (lt > 1.5) {
    const tear = C.smooth(C.clamp((lt - 1.5) / 0.4));
    ctx.save();
    ctx.translate(W / 2 + 200 + tear * 170, 430 - tear * 70);
    ctx.rotate(-0.18 + tear * 0.8);
    paper(ctx, () => tornRectPath(ctx, 0, 0, 150 * (0.6 + 0.4 * tear), 34, 4, 7), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 8,
    });
    ctx.restore();
    paperShards(ctx, 1050, 460, lt, 18, [PAL.cream, PAL.red, PAL.gold], 460, C.clamp(1 - (lt - 1.5) / 0.6), 6);
  }

  TY.type(ctx, shot.slots["content.caption"] || "THE CUE LAMP", 120, 856, 46, {
    align: "left", color: PAL.ink, edge: PAL.cream, edgeW: 7,
    shadow: C.rgba(PAL.ink, 0.2), shadowOff: 5, time: t, seed: 9,
  });
  TY.text(ctx, "NOVA  /  THE LAST CUE", 132, 890, 17, {
    family: "DMMono", color: C.rgba(PAL.ink, 0.62), letter: 2,
  });
  endCam(ctx);
  if (lt > d - 0.3) paperShards(ctx, W / 2, 500, lt, 16, [PAL.cream, PAL.gold], 420, C.clamp(1 - (lt - (d - 0.3)) / 0.3), 4);
}

function bowPose(name, lt = 0) {
  const k = C.smooth(C.clamp((lt - 0.25) / 0.8));
  const pose = { ...poseFor(name, "bow") };
  pose.lean = 0.02;
  pose.headTilt = 0.25;
  pose.bounce = -6 - 12 * k;
  pose.armL = [0.6 - 0.45 * k, 0.2];
  pose.armR = [-0.6 + 0.45 * k, -0.2];
  return pose;
}

function pullback(shot, lt, t) {
  const d = shot.duration;
  const z = 1.18 - 0.18 * C.smooth(C.clamp(lt / d));
  setCam(W / 2, 540, z, Math.sin(lt * 0.4) * 0.005, 0.6, t);
  beginCam(ctx);
  stageSet(ctx, t, {
    sky: PAL.redD, sun: PAL.gold, floor: PAL.blue, accent: PAL.cream,
    crowd: true, confetti: 44, confettiCols: [PAL.cream, PAL.gold, PAL.blue, PAL.red],
    rot: lt * 0.02,
  });
  const bowK = C.smooth(C.clamp((lt - 0.25) / 0.8));
  ctx.save();
  ctx.translate(0, 960);
  ctx.scale(1, 1 - 0.28 * bowK);
  ctx.translate(0, -960);
  drawCharacter("Nova", 700, 960, 1.12, "bow", 1, bowPose("Nova", lt), t);
  drawCharacter("Mira", 1180, 985, 0.98, "bow", -1, bowPose("Mira", lt), t);
  ctx.restore();
  if (lt > 1.2) {
    const land = C.clamp(C.backOut(C.clamp((lt - 1.2) / 0.5)));
    ctx.save();
    ctx.globalAlpha = land;
    ctx.translate(0, (1 - land) * 40);
    paper(ctx, () => tornRectPath(ctx, 1480, 80, 320, 250, 5, 23), {
      fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
    });
    TY.type(ctx, shot.slots["content.monogram"] || "N", 1600, 280, 140, {
      align: "center", color: PAL.ink, edge: null, edgeW: 0,
      shadow: C.rgba(PAL.ink, 0.18), shadowOff: 4, time: t, seed: 4,
      family: "Permanent Marker",
    });
    TY.text(ctx, shot.slots["content.body"] || "THE UNDERSTUDY", 1600, 324, 16, {
      family: "DMMono", color: PAL.ink, align: "center", letter: 3,
    });
    ctx.restore();
  }
  endCam(ctx);
  if (lt > 3.6) {
    // Close the iris into paper. It already pinches to ~1 px by the last frame,
    // so no extra fill: a hard fill here flashed the frame beige.
    const iris = Math.max(1, (1 - C.inv(3.6, d, lt)) * 1400);
    irisOverlay(ctx, W / 2, 470, iris, PAL.paper, 70);
  }
}

window.PAPER_BACKEND = {
  shots: { paper_open: paperOpen, portrait_iris: portrait, stage_wide: stage, sticker_slam: sticker, macro_prop_beat: macro, pullback_close: pullback },
};
