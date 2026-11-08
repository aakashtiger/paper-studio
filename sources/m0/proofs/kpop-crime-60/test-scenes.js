/* THE RUN — page furniture and the render entry. 60 s, 21 shots. */

/* ?review draws the review HUD (cue card, timecode, progress, colour chips).
   ?render — the delivered picture — draws none of it. */
const review = new URLSearchParams(location.search).has("review");

const INK = "#171310", CREAM = "#F2E8D5", CORAL = "#E86A5A", MUSTARD = "#F2C14E", GOLD = "#C68E2E";
PAL.red = CORAL; PAL.acid = MUSTARD; PAL.gold = MUSTARD; PAL.goldD = GOLD;
PAL.blue = "#2F5FA8"; PAL.blueD = "#1B2F52"; PAL.pink = "#E86A96";
PAL.teal = "#0F6B5E"; PAL.tealD = "#082A28"; PAL.green = "#2FAE9A"; PAL.silver = "#C9C2B4";

const MAN_POSES = {
  stand: { bounce: 0, armL: [0.25, -0.3], armR: [-0.3, 0.4], lean: 0.02, headTilt: 0.02, headTurn: 0.05, footL: [-34, -8], footR: [34, -8] },
  hand: { bounce: 0, armL: [0.6, 0.9], armR: [-0.3, 0.4], lean: 0.04, headTilt: 0.02, headTurn: 0.1, footL: [-34, -8], footR: [34, -8] },
  turn: { bounce: 0, armL: [0.8, -0.6], armR: [-0.5, 0.8], lean: 0.04, headTilt: 0.04, headTurn: -0.2, footL: [-34, -8], footR: [34, -8] },
  point: { bounce: 0, armL: [1.4, 0.2], armR: [-0.4, 0.6], lean: 0.06, headTilt: 0.02, headTurn: 0.1, footL: [-34, -8], footR: [34, -8] },
  reach: { bounce: 0, armL: [0.3, 0.2], armR: [-2.2, 0.3], lean: 0.05, headTilt: -0.03, headTurn: -0.1, footL: [-34, -8], footR: [34, -8] },
  reachHigh: { bounce: 0, armL: [0.2, 0.1], armR: [-2.5, 0.2], lean: 0.02, headTilt: -0.05, headTurn: -0.12, footL: [-34, -8], footR: [34, -8] },
  kneel: { bounce: 0, armL: [0.9, 0.5], armR: [-0.5, 0.6], lean: 0.14, headTilt: 0.08, headTurn: 0.1, footL: [-60, -200], footR: [50, -39] },
  bow: { bounce: 0, armL: [0.25, -0.3], armR: [-0.3, 0.4], lean: 0.24, headTilt: 0.26, headTurn: 0.02, footL: [-34, -8], footR: [34, -8] },
  brace: { bounce: 0, armL: [0.5, 0.8], armR: [-0.5, 0.8], lean: -0.04, headTilt: 0.02, headTurn: -0.1, footL: [-40, -39], footR: [40, -39] },
  pace: { bounce: 0, armL: [0.6, -0.1], armR: [-0.6, 0.2], lean: 0.08, headTilt: 0.02, headTurn: 0.2, footL: [-34, -8], footR: [34, -8] },
  bound: { bounce: 0, armL: [0.3, 0.9], armR: [-0.3, 0.9], lean: 0.02, headTilt: 0.02, headTurn: 0.02, footL: [-34, -8], footR: [34, -8] },
};
const POSE_KEYS = ["bounce", "sway", "lean", "yaw", "headTilt", "headTurn", "hairSwing", "armL", "armR", "legL", "legR", "footL", "footR", "footPitchL", "footPitchR"];
function clonePose(p) {
  const o = { ...p };
  for (const k of POSE_KEYS) if (Array.isArray(o[k])) o[k] = o[k].slice();
  return o;
}
function mixPose(a, b, u) {
  const o = {};
  for (const k of POSE_KEYS) {
    const va = a[k], vb = b[k] === undefined ? va : b[k];
    o[k] = Array.isArray(va) ? va.map((v, i) => C.lerp(v, vb[i] === undefined ? v : vb[i], u)) : C.lerp(va || 0, vb || 0, u);
  }
  return o;
}
function poseAt(t, keys, hold = 0.32) {
  const k = [];
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) k.push([Math.max(keys[i - 1][0] + 0.02, keys[i][0] - hold), keys[i - 1][1]]);
    k.push(keys[i]);
  }
  // A hold frame must not share its arrays with the pose library: shots nudge
  // armL/armR after poseAt, and a shared array would accumulate across frames.
  if (t <= k[0][0]) return clonePose(k[0][1]);
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) {
      const u = C.ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
      return mixPose(k[i - 1][1], k[i][1], u);
    }
  }
  return clonePose(k[k.length - 1][1]);
}
function faceAt(t, keys) {
  let f = {};
  for (const k of keys) if (t >= k.t) f = { ...f, ...k.f };
  return f;
}

function lineAt(t) {
  const s = sceneAt(t);
  const line = (window.KPOP_LINES || [])[s.line];
  if (!line) return null;
  if (t < line.start - 0.2 || t > line.end + 0.25) return null;
  return line;
}

function shotIndexAt(t) {
  const shots = window.KPOP_SHOTS || [];
  const s = sceneAt(t);
  const i = shots.findIndex((x) => x.id === s.id);
  return i >= 0 ? i + 1 : 1;
}

function drawCueTicker(ctx, t) {
  const x = W - 286, y = 40, w = 246, h = 96;
  const idx = shotIndexAt(t);
  const secs = Math.floor(t);
  const frames = Math.floor((t - secs) * 30);
  ctx.save(); ctx.globalAlpha = 0.92;
  paper(ctx, () => tornRectPath(ctx, x, y, w, h, 3.5, 9), { fill: PAL.ink, edge: null, shadow: C.rgba(PAL.ink, 0.25), sx: 4, sy: 6 });
  TY.text(ctx, "CUE " + String(idx).padStart(2, "0"), x + 16, y + 24, 15, { family: "Archivo Black", color: PAL.cream, letter: 0.5 });
  TY.text(ctx, "MAN", x + 16, y + 48, 11, { family: "DMMono", color: C.rgba(PAL.cream, 0.55), letter: 1 });
  TY.text(ctx, "TAKE 01", x + 156, y + 48, 10, { family: "DMMono", color: C.rgba(PAL.cream, 0.45), letter: 1 });
  ctx.fillStyle = C.rgba(PAL.cream, 0.16); ctx.fillRect(x + 16, y + 62, w - 32, 6);
  ctx.fillStyle = PAL.red; ctx.fillRect(x + 16, y + 62, (w - 32) * C.clamp(t / 60.0), 6);
  TY.text(ctx, "00:" + String(secs).padStart(2, "0") + ":" + String(frames).padStart(2, "0"), x + 16, y + 84, 10, { family: "DMMono", color: C.rgba(PAL.cream, 0.5), letter: 1 });
  ctx.restore();
}

function drawKpopMarks(ctx, t) {
  ctx.save();
  ctx.globalAlpha = 0.22; ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  const m = 26, l = 24;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, y + sy * l); ctx.lineTo(x, y); ctx.lineTo(x + sx * l, y); ctx.stroke();
  }
  for (let x = 64; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, 24); ctx.stroke(); }
  for (let y = 64; y < H; y += 64) { ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(24, y); ctx.stroke(); }
  const cols = [PAL.blue, PAL.red, PAL.gold, PAL.ink, PAL.green, PAL.pink, PAL.cream, PAL.teal];
  for (let i = 0; i < cols.length; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(W - 170 + i * 18, H - 40, 14, 7); }
  TY.text(ctx, "THE RUN · " + Math.floor(t * 30).toString().padStart(5, "0"), W - 430, H - 28, 12, { color: C.rgba(INK, 0.55), letter: 1 });
  TY.text(ctx, "© 2026 PAPER STAGE", 44, H - 28, 12, { color: C.rgba(INK, 0.55), letter: 1 });
  ctx.restore();
  ctx.fillStyle = C.rgba(INK, 0.16); ctx.fillRect(0, H - 3, W, 3);
  ctx.fillStyle = MUSTARD; ctx.fillRect(0, H - 3, W * C.clamp(t / (window.KPOP_DURATION || 1)), 3);
}

function paperScratches(ctx, t, alpha = 0.06) {
  for (let i = 0; i < 90; i++) {
    const x = C.hash(i * 3.7) * W, y = C.hash(i * 7.1) * H;
    const len = 10 + C.hash(i * 5.3) * 80;
    const a = C.hash(i * 9.7) * TAU;
    ctx.strokeStyle = C.rgba(INK, alpha * (0.4 + 0.6 * C.hash(i * 11.3)));
    ctx.lineWidth = 0.6 + C.hash(i * 13.1) * 1.2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  }
}

/* A gentle warm grade: lift the shadows with a neutral-warm screen pass, warm
   the mids with soft-light, and add a low coral overlay for the practicals.
   It is applied before the paper texture so the grain keeps the edges. */
function warmGrade(ctx, t) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, C.rgba("#5A4A3E", 0.18));
  g.addColorStop(0.55, C.rgba("#4A3A2E", 0.17));
  g.addColorStop(1, C.rgba("#2E241C", 0.14));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const h = ctx.createLinearGradient(0, 0, 0, H);
  h.addColorStop(0, C.rgba("#FFC27A", 0.30));
  h.addColorStop(0.6, C.rgba("#FF9A5A", 0.24));
  h.addColorStop(1, C.rgba("#C85A32", 0.18));
  ctx.fillStyle = h; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = C.rgba("#FF8A4A", 0.05);
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function renderTestAt(t, type = "image/png", q = 0.95) {
  if (!ctx) { cv = document.getElementById("out"); ctx = cv.getContext("2d"); }
  const s = sceneAt(t);
  beginShot(s);
  drawScene(s, t);
  drawTransition(t);
  const line = lineAt(t);
  if (line) TY.subtitle(ctx, line, t, { x: 84, y: 1024, size: 30 });
  if (review) {
    drawCueTicker(ctx, t);
    drawKpopMarks(ctx, t);
  }
  warmGrade(ctx, t);
  paperOverlay(ctx, t, 0.38);
  grainOverlay(ctx, t, 0.55);
  paperScratches(ctx, t, 0.08);
  vignette(ctx, 0.22);
  if (s.fade && t >= s.fade.start) {
    const k = C.clamp((t - s.fade.start) / s.fade.dur);
    ctx.fillStyle = "rgba(8,8,10," + k + ")";
    ctx.fillRect(0, 0, W, H);
  }
  return cv.toDataURL(type, q);
}

window.renderTestAt = renderTestAt;
window.renderAt = renderTestAt;
window.reviewCam = () => ({ x: CAM.x, y: CAM.y, z: CAM.z, r: CAM.r, sx: CAM.sx, sy: CAM.sy });
window.handToScreen = (pts) => pts.map(([x, y]) => worldToScreen(x, y));
window.reviewShotAt = (t) => {
  window.KPOP_MEASURE = true;
  window.KPOP_CAST = [];
  try {
    const url = renderTestAt(t, "image/png");
    const cv = document.getElementById("out");
    return { t, url, cast: window.KPOP_CAST, cam: { x: CAM.x, y: CAM.y, z: CAM.z, r: CAM.r, sx: CAM.sx, sy: CAM.sy }, w: cv.width, h: cv.height };
  } finally {
    window.KPOP_MEASURE = false;
  }
};
window.measureAt = (t) => {
  window.KPOP_MEASURE = true;
  window.KPOP_CAST = [];
  renderTestAt(t, "image/png");
  window.KPOP_MEASURE = false;
  return { t, cast: window.KPOP_CAST };
};
