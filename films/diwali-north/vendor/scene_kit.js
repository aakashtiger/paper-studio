/* ============================================================
   CLAUDE POP — scene kit
   Shared staging, paper props and graphic furniture.
   ============================================================ */

function kitBg(ctx, top, bot, rays) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (rays) {
    ctx.save(); ctx.globalAlpha = rays.a ?? .12;
    sunburst(ctx, rays.x ?? W / 2, rays.y ?? 420, 0, rays.r ?? 1200, rays.n ?? 28, rays.c1 || PAL.cream, rays.c2 || top, rays.rot || 0);
    ctx.restore();
  }
}

function floorPlane(ctx, y, col, accent = PAL.cream, t = 0, o = {}) {
  ctx.save();
  ctx.beginPath(); ctx.moveTo(-80, y); ctx.lineTo(W + 80, y); ctx.lineTo(W + 220, H + 80); ctx.lineTo(-220, H + 80); ctx.closePath();
  ctx.fillStyle = col; ctx.fill();
  ctx.clip();
  ctx.strokeStyle = C.rgba(accent, o.lineA ?? .16); ctx.lineWidth = o.lw || 2;
  const vx = o.vx ?? W / 2;
  for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 70, y); ctx.lineTo(vx + i * 340, H + 80); ctx.stroke(); }
  for (let i = 0; i < 5; i++) { const yy = y + Math.pow(i / 4, 1.7) * (H - y + 40); ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  ctx.restore();
  paper(ctx, () => tornRectPath(ctx, -30, y - 12, W + 60, 22, 4, 12), { fill: accent, edge: null, shadow: C.rgba(PAL.ink, .22), sx: 0, sy: 5 });
}

function bigSun(ctx, cx, cy, r, col = PAL.gold, t = 0, dotCol = PAL.red) {
  paper(ctx, () => blobPath(ctx, cx, cy, r, r, 54, .01, 3), { fill: col, edge: null });
  halftone(ctx, cx - r, cy - r, r * 2, r * 2, dotCol, 20, .5, .13);
  ctx.save(); ctx.globalAlpha = .22; ctx.strokeStyle = PAL.cream; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r * .86, 0, TAU); ctx.stroke(); ctx.restore();
}

function outlineSun(ctx, cx, cy, r, col = PAL.ink, n = 24, rot = 0) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2;
  for (let i = 0; i < n; i++) {
    const a = rot + i / n * TAU;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * .78, cy + Math.sin(a) * r * .78);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, r * .76, 0, TAU); ctx.stroke();
  ctx.restore();
}

function comicBurst(ctx, text, x, y, r, fill = PAL.gold, textCol = PAL.ink, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const n = o.n || 18;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = i / (n * 2) * TAU, rr = i % 2 ? r * (.66 + C.hash(i) * .09) : r * (1.05 + C.hash(i + 9) * .2);
    const px = Math.cos(a) * rr, py = Math.sin(a) * rr * (o.squash || .78);
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = o.edge || PAL.ink; ctx.lineWidth = o.edgeW || 7; ctx.stroke();
  TY.type(ctx, text, 0, r * .18, o.size || r * .5, {
    align: 'center', color: textCol, edge: o.textEdge ?? PAL.cream, edgeW: o.edgeW2 ?? 8,
    shadow: C.rgba(PAL.ink, .22), shadowOff: 6, rot: -.02, seed: o.seed || 4, time: o.time || 0, charRot: .02
  });
  ctx.restore();
}

function stamp(ctx, text, x, y, size, rot = -.16, col = PAL.red, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  TY.set(ctx, size, o.family || 'Archivo Black');
  const tw = ctx.measureText(text).width;
  const w = tw + size * .8, h = size * 1.35;
  ctx.strokeStyle = col; ctx.lineWidth = o.border || 5; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.globalAlpha = .93; TY.text(ctx, text, 0, size * .34, size, { family: o.family || 'Archivo Black', color: col, align: 'center', letter: o.letter || 0 });
  ctx.restore();
}

function tapeTab(ctx, x, y, w = 120, rot = 0, col = PAL.cream, a = .55) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = col;
  ctx.fillRect(-w / 2, -11, w, 22);
  ctx.globalAlpha = a * .5; ctx.fillStyle = '#FFF';
  ctx.fillRect(-w / 2, -11, w, 2);
  ctx.restore();
}

function wordAppear(t, at, dur = .35) { return C.clamp((t - at) / dur); }

function giantLyric(ctx, text, x, y, size, t, at, o = {}) {
  const app = wordAppear(t, at, o.dur || .4);
  return TY.type(ctx, text, x, y, size, {
    align: o.align || 'left', color: o.color || PAL.ink, edge: o.edge ?? PAL.cream,
    edgeW: o.edgeW ?? Math.max(4, size * .06), shadow: o.shadow ?? C.rgba(PAL.ink, .27),
    shadowOff: o.shadowOff ?? size * .035, rot: o.rot || 0, charRot: o.charRot ?? .025,
    seed: o.seed || 3, time: t, perChar: (i, n) => C.clamp((t - at - i * (o.stagger ?? .025)) / (o.dur || .35)),
    alpha: o.alpha ?? 1, family: o.family, chrome: o.chrome, grad: o.grad, glow: o.glow,
    highlight: o.highlight
  });
}

function monoStrip(ctx, text, x, y, w, col = PAL.ink, ink = PAL.cream, size = 13) {
  ctx.save(); ctx.fillStyle = col; ctx.fillRect(x, y, w, size + 16);
  TY.text(ctx, text, x + 10, y + size + 2, size, { family: 'DMMono', color: ink, letter: 1.2 });
  ctx.restore();
}

function cardLabel(ctx, text, x, y, w, fill = PAL.cream, col = PAL.ink, rot = 0, size = 14) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, size * 2.4 + 18, 3, Math.floor(w)), { fill, edge: C.rgba(PAL.ink, .35), edgeW: 1.5, shadow: C.rgba(PAL.ink, .22), sx: 4, sy: 7 });
  TY.text(ctx, text, 12, size + 8, size, { family: 'DMMono', color: col, letter: .8 });
  ctx.restore();
}

function irisOverlay(ctx, cx, cy, r, col = PAL.ink, feather = 40) {
  if (r <= 0) return;
  ctx.save();
  const g = ctx.createRadialGradient(cx, cy, Math.max(0, r - feather), cx, cy, r + 2);
  g.addColorStop(0, C.rgba(col, 0)); g.addColorStop(1, C.rgba(col, 1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function speedStreaks(ctx, t, n = 40, col = PAL.cream, alpha = .3, y0 = 0, y1 = H) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const yy = y0 + C.hash(i * 3.1) * (y1 - y0);
    const xx = C.loop(C.hash(i * 7.7) * W + t * (500 + C.hash(i) * 1300), -300, W + 200);
    const w = 60 + C.hash(i * 5.3) * 260, h = 1 + C.hash(i * 9.1) * 4;
    ctx.fillRect(xx, yy, w, h);
  }
  ctx.restore();
}

function paperShards(ctx, x, y, t, n = 24, cols = [PAL.red, PAL.gold, PAL.blue, PAL.cream], spread = 400, alpha = 1, seed = 0) {
  ctx.save(); ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const a = C.hash(i * 3.1 + seed) * TAU;
    const dist = (C.hash(i * 7.3 + seed) * spread) * (.5 + .5 * Math.sin(t * 2 + i));
    const px = x + Math.cos(a) * dist, py = y + Math.sin(a) * dist;
    ctx.save(); ctx.translate(px, py); ctx.rotate(a + t * (1 + C.hash(i)));
    ctx.fillStyle = cols[i % cols.length];
    ctx.fillRect(-7, -10, 14 + C.hash(i * 2.3) * 14, 12 + C.hash(i * 4.1) * 16);
    ctx.restore();
  }
  ctx.restore();
}

function sparkles(ctx, x, y, t, n = 10, maxR = 340, col = PAL.cream, seed = 0) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const a = C.hash(i * 3.7 + seed) * TAU + t * .3;
    const r = (C.hash(i * 5.1 + seed) * maxR) * (.7 + .3 * Math.sin(t * 2.2 + i));
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
    ctx.fillStyle = col; ctx.globalAlpha = .25 + .7 * C.hash(i + seed);
    sparkPath(ctx, px, py, 4 + C.hash(i * 7.7) * 12); ctx.fill();
  }
  ctx.restore();
}

function drawHeart(ctx, x, y, s, col = PAL.pink, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  heartPath(ctx, 0, 0, 40); ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-12, -12, 8, 5, -.6, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawBird(ctx, x, y, s, rot = 0, col = PAL.cream) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-22, 0); ctx.quadraticCurveTo(-6, -16, 8, -2); ctx.quadraticCurveTo(18, -18, 34, -4);
  ctx.quadraticCurveTo(20, 2, 8, 2); ctx.quadraticCurveTo(-6, 6, -22, 0); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(26, -6, 1.6, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawCloud(ctx, x, y, s, col = PAL.cream, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 6, 100, 18, .12);
  const pts = [[-100, 0], [-82, -38], [-42, -52], [-16, -84], [30, -76], [62, -42], [102, -16], [92, 18], [-88, 22]];
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.quadraticCurveTo((p[0] + 20), p[1] - 10, p[0], p[1]); ctx.closePath(); },
    { fill: col, edge: C.rgba(PAL.ink, .28), edgeW: 2, shadow: C.rgba(PAL.ink, .15), sx: 5, sy: 8 });
  if (o.face !== false) {
    ctx.fillStyle = PAL.ink;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 28, -20, 4, 6, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -8, 10, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
  }
  ctx.restore();
}

function drawMoon(ctx, x, y, r, col = PAL.goldL) {
  paper(ctx, () => blobPath(ctx, x, y, r, r, 34, .035, 7), { fill: col, edge: C.rgba(PAL.ink, .2), edgeW: 2 });
  ctx.save(); ctx.globalAlpha = .18; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - r * .2 + C.hash(i) * r * .4, y + (C.hash(i * 3) - .5) * r * .5, r * (.1 + C.hash(i * 7) * .14), 0, TAU); ctx.stroke(); }
  ctx.restore();
}

function drawRocket(ctx, x, y, s, rot = 0, fire = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // flame
  if (fire > 0) {
    for (let i = 0; i < 3; i++) {
      const f = fire * (1 + .2 * Math.sin(t * 30 + i));
      ctx.fillStyle = i === 0 ? PAL.red : i === 1 ? PAL.gold : PAL.cream;
      ctx.beginPath(); ctx.moveTo(-15, 104); ctx.quadraticCurveTo(0, 104 + 80 * f, 15, 104); ctx.closePath(); ctx.fill();
      ctx.translate(0, 8);
    }
  }
  // body
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(0, -120); ctx.quadraticCurveTo(44, -54, 38, 72); ctx.lineTo(-38, 72); ctx.quadraticCurveTo(-44, -54, 0, -120); ctx.closePath(); },
    { fill: PAL.cream, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .22), sx: 6, sy: 10 });
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.ellipse(0, 8, 28, 30, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = PAL.blue; ctx.beginPath(); ctx.arc(0, 8, 13, 0, TAU); ctx.fill();
  ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(-4, 4, 4.5, 0, TAU); ctx.fill();
  // fins
  for (const sx of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(sx * 32, 20); ctx.lineTo(sx * 68, 88); ctx.lineTo(sx * 38, 78); ctx.closePath();
    ctx.fillStyle = PAL.red; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.4; ctx.stroke();
  }
  TY.text(ctx, 'AGI', 0, 82, 17, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 2 });
  ctx.restore();
}

function drawMugTower(ctx, x, y, n, t, o = {}) {
  for (let i = 0; i < n; i++) {
    const w = 42 - i * .5, yy = y - i * 38;
    const off = Math.sin(t * 2 + i * .7) * (i > 2 ? 2 : .5);
    ctx.save(); ctx.translate(x + off, yy); ctx.rotate((C.hash(i * 3.1) - .5) * .08);
    ctx.fillStyle = [PAL.red, PAL.cream, PAL.blue, PAL.gold, PAL.mint, PAL.pink][i % 6];
    paper(ctx, () => roundRectPath(ctx, -w / 2, -34, w, 38, 5), { fill: ctx.fillStyle, edge: PAL.ink, edgeW: 1.7, shadow: C.rgba(PAL.ink, .16), sx: 2, sy: 4 });
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(w / 2 + 4, -16, 10, -1.2, 1.2); ctx.stroke();
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, -34, w / 2, 4, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
}

function drawPaperclipIcon(ctx, x, y, s, col = PAL.silver, rot = 0, face = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const p = () => {
    ctx.beginPath(); ctx.moveTo(-10, -26); ctx.lineTo(-10, 18); ctx.quadraticCurveTo(-10, 34, 6, 34);
    ctx.quadraticCurveTo(22, 34, 22, 18); ctx.lineTo(22, -18); ctx.quadraticCurveTo(22, -30, 10, -30);
    ctx.quadraticCurveTo(-2, -30, -2, -18); ctx.lineTo(-2, 12); ctx.quadraticCurveTo(-2, 20, 5, 20);
    ctx.quadraticCurveTo(12, 20, 12, 12); ctx.lineTo(12, -24);
  };
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 10; ctx.lineJoin = 'round'; p(); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 7; p(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; p(); ctx.stroke();
  if (face) {
    for (const sx of [-1, 1]) { ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(3 + sx * 5, 1, 3.4, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(3 + sx * 5, 1, 1.7, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

function clipPile(ctx, t, y = 1000, n = 70, spread = 1800, seed = 0) {
  for (let i = 0; i < n; i++) {
    const x = -60 + C.hash(i * 3.1 + seed) * spread;
    const yy = y + Math.sin(t * 2 + i) * 5 - C.hash(i * 7.7 + seed) * 80;
    drawPaperclipIcon(ctx, x, yy, .55 + C.hash(i * 2.3) * .5, i % 5 ? PAL.silver : PAL.chrome, (C.hash(i * 5.9) - .5) * 1.6);
  }
}

function drawLaptop(ctx, x, y, s, t, glow = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // base
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(170, 0); ctx.lineTo(205, 46); ctx.lineTo(-205, 46); ctx.closePath(); },
    { fill: PAL.silver, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 8, sy: 12 });
  ctx.fillStyle = PAL.silverD; ctx.fillRect(-170, 6, 340, 8);
  for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = PAL.ink; ctx.globalAlpha = .4; ctx.fillRect(-140 + i * 22, 18 + j * 6, 14, 2); }
  ctx.globalAlpha = 1;
  // screen
  paper(ctx, () => roundRectPath(ctx, -184, -250, 368, 254, 10), { fill: '#2A2521', edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .3), sx: 9, sy: 14 });
  ctx.fillStyle = glow ? '#123638' : '#101515'; ctx.fillRect(-168, -234, 336, 220);
  ctx.save(); ctx.beginPath(); ctx.rect(-168, -234, 336, 220); ctx.clip();
  if (glow) {
    // little stage on the laptop
    ctx.fillStyle = '#E8452A'; ctx.fillRect(-168, -234, 336, 220);
    ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -80, 76, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.blue; ctx.fillRect(-168, -72, 336, 58);
    // mini idol
    const pose = { armL: [.2, .1], armR: [-2.4, .2], bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 3 };
    idol(ctx, 42, -78, .2, { t, flowerR1: 100, pose, outfit: 'stage' });
    TY.text(ctx, 'CLAUDE', -146, -196, 24, { family: 'Anton', color: PAL.cream, letter: 2 });
    TY.text(ctx, 'POP', -146, -164, 34, { family: 'Anton', color: PAL.ink });
    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 28; i++) ctx.fillRect(-168, -234 + i * 8, 336, 1);
  } else {
    ctx.fillStyle = C.rgba(PAL.cream, .08); ctx.fillRect(-168, -234, 336, 220);
  }
  ctx.restore();
  ctx.strokeStyle = C.rgba(PAL.cream, .22); ctx.lineWidth = 1; ctx.strokeRect(-168, -234, 336, 220);
  ctx.restore();
}

function drawSax(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(-12, 20, 10, 70); ctx.quadraticCurveTo(36, 110, 58, 80); ctx.stroke();
  ctx.strokeStyle = PAL.gold; ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(62, 76, 24, 18, -.5, 0, TAU); ctx.fill();
  ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3; ctx.stroke();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(2 + i * 1.5, -42 + i * 20, 4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function drawMic(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 100); ctx.stroke();
  ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.stroke();
  ctx.fillStyle = PAL.silver; ctx.beginPath(); ctx.ellipse(0, 0, 12, 20, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

function drawDoor(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, h, 3, 8), { fill: o.fill || PAL.blueD, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .26), sx: 8, sy: 12 });
  ctx.strokeStyle = C.rgba(PAL.cream, .45); ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(w - 30, h * .55, 7, 0, TAU); ctx.fill();
  if (o.light) {
    ctx.save(); ctx.globalAlpha = o.light; ctx.fillStyle = PAL.goldL;
    ctx.beginPath(); ctx.moveTo(w / 2 - 10, 20); ctx.lineTo(w / 2 + 14, 20); ctx.lineTo(w * .9, h); ctx.lineTo(w * .1, h); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}

function drawFence(ctx, x, y, w, h, col = PAL.cream, o = {}) {
  ctx.save(); ctx.translate(x, y);
  for (let i = 0; i < Math.max(2, Math.floor(w / 38)); i++) {
    const px = i * 38;
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(px, 0); ctx.lineTo(px + 26, 0); ctx.lineTo(px + 26, h); ctx.lineTo(px + 20, h - 16); ctx.lineTo(px + 13, h); ctx.lineTo(px, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, .35); ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.fillStyle = o.rail || PAL.cream; ctx.fillRect(0, h * .24, w, 12); ctx.fillRect(0, h * .7, w, 12);
  ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1.5; ctx.strokeRect(0, h * .24, w, 12); ctx.strokeRect(0, h * .7, w, 12);
  if (o.label) {
    ctx.save(); ctx.translate(w / 2, h * .48);
    paper(ctx, () => roundRectPath(ctx, -52, -18, 104, 36, 2), { fill: PAL.gold, edge: PAL.ink, edgeW: 2 });
    TY.text(ctx, o.label, 0, 6, 15, { family: 'Archivo Black', color: PAL.ink, align: 'center' });
    ctx.restore();
  }
  ctx.restore();
}

function drawCandleChart(ctx, x, y, w, h, n, t, col = PAL.green) {
  const cw = w / n;
  for (let i = 0; i < n; i++) {
    const base = h * (.78 - i / n * .62) + Math.sin(i * .8) * h * .05;
    const bh = 14 + C.hash(i * 3.1) * h * .14;
    const up = C.hash(i * 7.7) > .28;
    ctx.fillStyle = up ? col : PAL.red;
    ctx.fillRect(x + i * cw + cw * .2, y + base - bh, cw * .6, bh);
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + i * cw + cw * .5, y + base - bh - 10 - C.hash(i) * 20); ctx.lineTo(x + i * cw + cw * .5, y + base + 12); ctx.stroke();
  }
}

function drawTV(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  paper(ctx, () => roundRectPath(ctx, 0, 0, w, h, 12), { fill: PAL.ink2, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .28), sx: 6, sy: 9 });
  ctx.fillStyle = o.screen || '#0C2B2A'; ctx.fillRect(12, 12, w - 24, h - 24);
  ctx.save(); ctx.beginPath(); ctx.rect(12, 12, w - 24, h - 24); ctx.clip();
  if (o.mode === 'eyes') {
    for (const sx of [-1, 1]) { ctx.fillStyle = PAL.acid; ctx.beginPath(); ctx.ellipse(w / 2 + sx * 42, h / 2, 16, 34, 0, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(w / 2 + sx * 42, h / 2, 5, 24, 0, 0, TAU); ctx.fill(); }
  } else if (o.mode === 'flat') {
    ctx.strokeStyle = PAL.acid; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, h * .55); ctx.lineTo(w - 20, h * .52); ctx.stroke();
    TY.text(ctx, 'LOSS 0.002', 22, 36, 14, { family: 'DMMono', color: C.rgba(PAL.acid, .8) });
  } else {
    ctx.strokeStyle = PAL.red; ctx.lineWidth = 4; ctx.beginPath();
    for (let i = 0; i < w - 30; i += 6) { const u = i / (w - 30); const yy = h * (.3 + u * .45 + Math.sin(u * 18) * .03); i ? ctx.lineTo(18 + i, yy) : ctx.moveTo(18 + i, yy); }
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(w - 26, h - 24, 5 + (Math.sin(t * 6) > 0 ? 2 : 0), 0, TAU); ctx.fill();
  ctx.restore();
}

function drawPaperFlower(ctx, x, y, s, col = PAL.gold, petal = PAL.cream, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (let i = 0; i < 12; i++) {
    ctx.save(); ctx.rotate(i / 12 * TAU);
    paper(ctx, () => petalPath(ctx, 0, 0, -Math.PI / 2, 8, 42, 8, i), { fill: petal, edge: C.rgba(PAL.ink, .25), edgeW: 1 });
    ctx.restore();
  }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

function drawCurtain(ctx, x, side, col = PAL.redD, t = 0) {
  const sign = side === 'left' ? 1 : -1;
  ctx.save(); ctx.translate(x, 0);
  const w = 250;
  for (let i = 0; i < 5; i++) {
    const xx = sign * i * 46;
    ctx.beginPath();
    ctx.moveTo(xx, -20);
    ctx.quadraticCurveTo(xx + sign * (40 + Math.sin(t + i) * 5), H * .5, xx, H + 20);
    ctx.lineTo(xx + sign * 70, H + 20);
    ctx.quadraticCurveTo(xx + sign * (92 + Math.sin(t + i) * 5), H * .5, xx + sign * 64, -20);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? col : C.shade(col, -18); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, .18); ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.restore();
}

function drawTable(ctx, x, y, w, col = PAL.paper3) {
  paper(ctx, () => tornRectPath(ctx, x - w / 2, y, w, 24, 4, 12), { fill: col, edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba(PAL.ink, .24), sx: 0, sy: 8 });
  ctx.fillStyle = C.shade(col, -22); ctx.fillRect(x - w / 2 + 30, y + 24, 28, 250); ctx.fillRect(x + w / 2 - 58, y + 24, 28, 250);
}

function drawEye(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const blink = o.blink || 0;
  ctx.save(); ctx.scale(1, Math.max(.04, 1 - blink * .95));
  ctx.beginPath();
  ctx.moveTo(-100, 0); ctx.quadraticCurveTo(-20, -70, 100, -4); ctx.quadraticCurveTo(10, 66, -100, 0); ctx.closePath();
  ctx.fillStyle = PAL.cream; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.stroke();
  ctx.save(); ctx.clip();
  const iris = o.iris || PAL.red;
  ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(8, 2, 40, 0, TAU); ctx.fill();
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(8, 2, 18, 0, TAU); ctx.fill();
  ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(20, -10, 6, 0, TAU); ctx.fill();
  if (o.kanji) TY.text(ctx, o.kanji, 8, 10, 20, { family: 'Black Han Sans', color: PAL.cream, align: 'center', alpha: .85 });
  ctx.restore();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 7; ctx.beginPath();
  ctx.moveTo(-100, 0); ctx.quadraticCurveTo(-20, -70, 100, -4); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

function drawMushroom(ctx, x, y, s, col = PAL.red, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = PAL.cream; ctx.fillRect(-9, -6, 18, 52);
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.strokeRect(-9, -6, 18, 52);
  paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, -8, 40, 26, 0, Math.PI, TAU); ctx.closePath(); }, { fill: col, edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, .18), sx: 4, sy: 6 });
  for (let i = 0; i < 4; i++) { ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(-22 + i * 14, -18 - (i % 2) * 7, 4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

function drawLoom(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#6B3A1E'; ctx.lineWidth = 18; ctx.lineCap = 'round';
  ctx.strokeRect(-170, -280, 340, 360);
  ctx.strokeStyle = '#B07A3E'; ctx.lineWidth = 12; ctx.strokeRect(-170, -280, 340, 360);
  for (let i = 0; i < 14; i++) {
    ctx.strokeStyle = i % 3 ? PAL.cream : PAL.goldL; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-150 + i * 23, -260);
    ctx.quadraticCurveTo(-150 + i * 23 + Math.sin(t + i) * 6, -40, -150 + i * 23, 50); ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    ctx.strokeStyle = i % 2 ? PAL.pink : PAL.mint; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-160, -220 + i * 38); ctx.lineTo(160, -220 + i * 38); ctx.stroke();
  }
  ctx.restore();
}

function drawGPU(ctx, x, y, s, t, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, -150, -120, 300, 240, 8), { fill: '#172024', edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .4), sx: 10, sy: 16 });
  ctx.fillStyle = '#263238'; ctx.fillRect(-132, -102, 264, 204);
  for (const sx of [-1, 1]) {
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * 72, 0, 52, 0, TAU); ctx.fill();
    ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 4;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(sx * 72, 0, 12 + k * 10, 0, TAU); ctx.stroke(); }
    ctx.save(); ctx.translate(sx * 72, 0); ctx.rotate(t * (sx) * 2);
    for (let k = 0; k < 7; k++) { ctx.rotate(TAU / 7); ctx.fillStyle = PAL.silver; ctx.beginPath(); ctx.ellipse(0, -32, 6, 20, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  ctx.fillStyle = PAL.acid; TY.text(ctx, 'H100', 0, 94, 24, { family: 'Archivo Black', color: PAL.acid, align: 'center', letter: 3 });
  ctx.restore();
}

function drawDesk(ctx, t, o = {}) {
  // wood surface
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2A1B12'); g.addColorStop(1, '#150D09');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // lamp pool
  const l = ctx.createRadialGradient(980, 560, 40, 980, 560, 900);
  l.addColorStop(0, 'rgba(255,208,132,.30)'); l.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = l; ctx.fillRect(0, 0, W, H);
  // cutting mat
  ctx.save(); ctx.translate(960, 700); ctx.rotate(-.02);
  paper(ctx, () => tornRectPath(ctx, -500, -280, 1000, 560, 4, 9), { fill: '#1C5B50', edge: '#0C332D', edgeW: 4, shadow: C.rgba('#000', .35), sx: 14, sy: 20 });
  ctx.globalAlpha = .15; ctx.strokeStyle = PAL.cream; ctx.lineWidth = 1;
  for (let i = -480; i < 500; i += 40) { ctx.beginPath(); ctx.moveTo(i, -260); ctx.lineTo(i, 260); ctx.stroke(); }
  for (let j = -260; j < 270; j += 40) { ctx.beginPath(); ctx.moveTo(-480, j); ctx.lineTo(480, j); ctx.stroke(); }
  ctx.globalAlpha = .3;
  for (let k = -260; k < 260; k += 100) TY.text(ctx, String(k / 10), -488, k, 9, { family: 'DMMono', color: PAL.cream });
  ctx.restore();
  // laptop center
  drawLaptop(ctx, 1000, 700, .98, t, o.glow !== false);
  // mug
  mug(ctx, 760, 620, 1.5, PAL.red, { steam: true, t });
  // sunflower in jar
  ctx.save(); ctx.translate(1290, 620);
  paper(ctx, () => roundRectPath(ctx, -36, -80, 72, 100, 6), { fill: C.rgba(PAL.silver, .35), edge: PAL.ink, edgeW: 2 });
  ctx.strokeStyle = PAL.green; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(-8, -130, 6, -170); ctx.stroke();
  drawPaperFlower(ctx, 8, -184, 1.3, PAL.goldD, PAL.goldL, -.3);
  ctx.restore();
  // pencil, glue, scraps
  ctx.save(); ctx.translate(700, 760); ctx.rotate(.2);
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-130, -8); ctx.lineTo(90, -8); ctx.lineTo(130, 0); ctx.lineTo(90, 8); ctx.lineTo(-130, 8); ctx.closePath(); }, { fill: PAL.gold, edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = PAL.pink; ctx.fillRect(-130, -8, 22, 16); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.moveTo(130, -5); ctx.lineTo(148, 0); ctx.lineTo(130, 5); ctx.fill();
  ctx.restore();
  // printed character sheet
  ctx.save(); ctx.translate(390, 690); ctx.rotate(-.09);
  paper(ctx, () => tornRectPath(ctx, -150, -130, 300, 260, 3, 14), { fill: PAL.cream, edge: C.rgba(PAL.ink, .3), edgeW: 2, shadow: C.rgba('#000', .3), sx: 8, sy: 12 });
  TY.text(ctx, 'SOL / SHEET 01', -128, -100, 14, { family: 'DMMono', color: PAL.red, letter: 1 });
  idol(ctx, 0, 100, .32, { t, flowerR1: 100, pose: { armL: [.2, .1], armR: [-2.4, .2] }, outfit: 'stage' });
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .2); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-126, 40 + i * 17); ctx.lineTo(126, 40 + i * 17); ctx.stroke(); }
  ctx.restore();
  // second sheet / script
  ctx.save(); ctx.translate(1520, 800); ctx.rotate(.06);
  paper(ctx, () => tornRectPath(ctx, -130, -100, 260, 210, 3, 17), { fill: PAL.cream, edge: C.rgba(PAL.ink, .25), edgeW: 1.5, shadow: C.rgba('#000', .25), sx: 8, sy: 10 });
  TY.text(ctx, 'CLAUDE POP', -108, -66, 20, { family: 'Archivo Black', color: PAL.ink });
  TY.text(ctx, 'a paper singularity', -108, -44, 11, { family: 'Instrument Serif', color: PAL.red });
  for (let i = 0; i < 7; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .18); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-108, -18 + i * 15); ctx.lineTo(108, -18 + i * 15); ctx.stroke(); }
  ctx.restore();
}

function drawFlowerMark(ctx, x, y, s, col = PAL.gold) {
  drawPaperFlower(ctx, x, y, s, col, PAL.cream, 0);
}

function drawArena(ctx, t) {
  kitBg(ctx, '#071334', '#0A0B1E');
  starfield(ctx, t, 120, 4, 620);
  outlineSun(ctx, 960, 440, 500, C.rgba(PAL.gold, .15), 40, t * .03);
  // truss
  ctx.strokeStyle = PAL.silverD; ctx.lineWidth = 5; ctx.globalAlpha = .4;
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(i ? 1450 : 300, 0); ctx.lineTo(i ? 1780 : 620, 330); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // beams
  for (let i = 0; i < 5; i++) {
    const x = 240 + i * 360;
    ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = [PAL.gold, PAL.blueL, PAL.pink][i % 3];
    ctx.beginPath(); ctx.moveTo(x - 20, 0); ctx.lineTo(x + 20, 0); ctx.lineTo(x + 260, 900); ctx.lineTo(x - 260, 900); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  floorPlane(ctx, 820, '#11152E', PAL.gold, t, { lineA: .12 });
  crowd(ctx, t, 1040);
}

function drawSpotlight(ctx, x, y, len, w0, w1, col = '#FFE7A8', a = .18, rot = 0) {
  spotlight(ctx, x, y, len, w0, w1, col, a, rot);
}

function drawTheatre(ctx, t) {
  kitBg(ctx, '#2A0B10', '#12070A');
  drawCurtain(ctx, -30, 'left', PAL.redD, t);
  drawCurtain(ctx, W + 30, 'right', PAL.redD, t);
  // gold proscenium
  ctx.strokeStyle = PAL.gold; ctx.lineWidth = 9; ctx.strokeRect(120, 70, W - 240, H - 140);
  ctx.strokeStyle = PAL.goldD; ctx.lineWidth = 3; ctx.strokeRect(136, 86, W - 272, H - 172);
  // valance
  paper(ctx, () => tornRectPath(ctx, 120, 40, W - 240, 90, 8, 21), { fill: PAL.redD, edge: PAL.gold, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 0, sy: 10 });
  TY.text(ctx, 'THE PAPER SINGULARITY', W / 2, 92, 30, { family: 'Archivo Black', color: PAL.goldL, align: 'center', letter: 5 });
  // boards
  floorPlane(ctx, 940, '#6B3A1E', PAL.gold, t, { lineA: .12 });
  // footlights
  for (let i = 0; i < 9; i++) {
    const x = 180 + i * 195;
    ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(x, 962, 8, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalAlpha = .15; ctx.fillStyle = PAL.goldL; ctx.beginPath(); ctx.arc(x, 962, 70, 0, TAU); ctx.fill(); ctx.restore();
  }
}

function drawCrowdHeads(ctx, t, y = 1035) {
  crowd(ctx, t, y, '#08060A', 26);
}

function drawTicket(ctx, x, y, w, text, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  paper(ctx, () => tornRectPath(ctx, -w / 2, -28, w, 56, 5, 22), { fill: PAL.cream, edge: C.rgba(PAL.ink, .4), edgeW: 1.5, shadow: C.rgba(PAL.ink, .23), sx: 5, sy: 8 });
  ctx.fillStyle = PAL.redD; ctx.fillRect(-w / 2 + 8, -20, 26, 40);
  for (let i = 0; i < 5; i++) { ctx.fillStyle = PAL.cream; ctx.fillRect(-w / 2 + 15, -14 + i * 7, 12, 2); }
  TY.text(ctx, text, 0, 6, 14, { family: 'DMMono', color: PAL.ink, align: 'center', letter: 1 });
  ctx.restore();
}

function drawContract(ctx, x, y, rot, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  paper(ctx, () => tornRectPath(ctx, -180, -120, 360, 240, 3, 5), { fill: PAL.cream, edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba(PAL.ink, .3), sx: 9, sy: 13 });
  TY.text(ctx, 'ALIGNMENT AGREEMENT', 0, -80, 19, { family: 'Archivo Black', color: PAL.ink, align: 'center', letter: 1 });
  TY.text(ctx, 'TERMS & CONDITIONS', 0, -58, 11, { family: 'DMMono', color: PAL.red, align: 'center', letter: 1 });
  for (let i = 0; i < 7; i++) { ctx.strokeStyle = C.rgba(PAL.ink, .2); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-150, -32 + i * 18); ctx.lineTo(150, -32 + i * 18); ctx.stroke(); }
  ctx.strokeStyle = PAL.blue; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 86); ctx.quadraticCurveTo(80, 56, 120, 90); ctx.stroke();
  ctx.restore();
}

function drawCloudGuard(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  drawCloud(ctx, 0, 0, 1, o.col || PAL.cream, { face: !o.sleep });
  if (o.sleep) {
    ctx.strokeStyle = C.rgba(PAL.ink, .8); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sx * 28, -22, 9, .12 * Math.PI, .88 * Math.PI); ctx.stroke();
    }
    ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, -4, 7, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
  }
  ctx.fillStyle = PAL.blueD; ctx.fillRect(-30, -78, 60, 22);
  ctx.fillRect(-22, -106, 44, 34);
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.strokeRect(-30, -78, 60, 22); ctx.strokeRect(-22, -106, 44, 34);
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -92, 5, 0, TAU); ctx.fill();
  if (o.light !== false) {
    ctx.save(); ctx.translate(34, 12); ctx.rotate((o.lightRot || .75) + Math.sin(t + (o.seed || 0)) * .05);
    ctx.fillStyle = C.rgba(PAL.goldL, .12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(120, 200); ctx.lineTo(-34, 200); ctx.closePath(); ctx.fill();
    ctx.fillStyle = PAL.ink; ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();
  }
  if (o.zzz) for (let i = 0; i < 3; i++) TY.text(ctx, 'z', 70 + i * 18, -40 - i * 22 - Math.sin(t * 2 + i) * 4, 15 + i * 7, { family: 'Instrument Serif', color: C.rgba(PAL.ink, .5), alpha: .8 });
  ctx.restore();
}

function drawStars(ctx, x, y, w, h, t) {
  for (let i = 0; i < 5; i++) {
    const filled = i < 4;
    ctx.save(); ctx.translate(x + i * w * .2, y); ctx.rotate(Math.sin(t * 3 + i) * .1);
    starPath(ctx, 0, 0, w * .13, .45, 5); ctx.fillStyle = filled ? PAL.gold : C.rgba(PAL.ink, .15); ctx.fill();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }
}

function drawSunflowerSticker(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  paper(ctx, () => blobPath(ctx, 0, 0, 54 * s, 54 * s, 24, .05, 5), { fill: PAL.cream, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 3, sy: 5 });
  drawPaperFlower(ctx, 0, 0, s * .72, PAL.goldD, PAL.goldL, 0);
  ctx.restore();
}
