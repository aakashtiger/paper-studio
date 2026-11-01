/* ============================================================
   CLAUDE POP — core
   Deterministic 2D paper-cut renderer. No external assets except fonts.
   ============================================================ */
const W = 1920, H = 1080, TAU = Math.PI * 2;
const DUR = 156.62;

const C = {
  clamp: (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  inv: (a, b, v) => (v - a) / (b - a),
  seg: (t, a, b) => C.clamp((t - a) / (b - a)),
  frac: v => v - Math.floor(v),
  smooth: t => t * t * (3 - 2 * t),
  ease: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeIn: t => t * t * t,
  backOut: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  elasticOut: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
  expoOut: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  hash: n => { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return x - Math.floor(x); },
  hash2: (a, b) => C.hash(a * 12.9898 + b * 78.233),
  wob: (t, f = 1, p = 0) => Math.sin(t * TAU * f + p),
  wob2: (t, f = 1, p = 0) => Math.cos(t * TAU * f + p),
  mix: (a, b, t) => {
    const pa = C.hex(a), pb = C.hex(b);
    return `rgb(${Math.round(C.lerp(pa[0], pb[0], t))},${Math.round(C.lerp(pa[1], pb[1], t))},${Math.round(C.lerp(pa[2], pb[2], t))})`;
  },
  hex: h => {
    if (h.startsWith('rgb')) return h.match(/\d+/g).map(Number);
    const s = h.replace('#', '');
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  },
  rgba: (h, a) => { const p = C.hex(h); return `rgba(${p[0]},${p[1]},${p[2]},${a})`; },
  shade: (h, k) => { const p = C.hex(h); return `rgb(${Math.max(0, Math.min(255, p[0] + k))},${Math.max(0, Math.min(255, p[1] + k))},${Math.max(0, Math.min(255, p[2] + k))})`; },
  kf: (t, keys, e = C.ease) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const u = e((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
        const a = keys[i - 1][1], b = keys[i][1];
        return Array.isArray(a) ? a.map((v, j) => C.lerp(v, b[j], u)) : C.lerp(a, b, u);
      }
    }
    return keys[keys.length - 1][1];
  },
  // 88 BPM grid used by the source video. Triplet shimmer at 132.
  beat: t => (t - 0.21) / (60 / 88),
  bpmPulse: (t, decay = 5) => Math.exp(-C.frac(C.beat(t)) * decay),
  three: t => C.frac((t - 0.21) / (60 / 132)),
  loop: (v, a, b) => a + C.frac((v - a) / (b - a)) * (b - a),
};

const PAL = {
  paper: '#F2E8D5', paper2: '#E8DAC0', paper3: '#DCCBAF',
  cream: '#FBF4E6', bone: '#F6EEDC',
  ink: '#171310', ink2: '#382D25', ink3: '#5A4A3C',
  red: '#E8452A', redD: '#B92A16', redL: '#FF755A',
  blue: '#203FD8', blueD: '#122A9B', blueL: '#4E6BFF',
  acid: '#D9F24B', lime: '#A8D63A',
  pink: '#FF5E9C', pinkD: '#D62E70', pinkL: '#FFA6C4',
  gold: '#F5B93F', goldD: '#C98A1E', goldL: '#FFD884',
  mint: '#A8E6C9', teal: '#0D6C6C', tealD: '#064A4A',
  violet: '#5B3FD8', violetD: '#321F8C',
  silver: '#C9CED6', silverD: '#8D97A6', chrome: '#E8EDF3',
  sky: '#9CCBEA', skyD: '#5C93B8',
  orange: '#F08A2E', ochre: '#D9A441', terracotta: '#C96A45',
  green: '#1FA36B', greenD: '#0B6B45',
  black: '#0C0A09',
};

/* ---------- canvases ---------- */
function makeCanvas(w = W, h = H) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', { alpha: true });
  x.imageSmoothingEnabled = true;
  return { c, x };
}
const OFF = {};
function off(name, w = W, h = H) {
  if (!OFF[name]) OFF[name] = makeCanvas(w, h);
  return OFF[name];
}

/* ---------- noise / texture ---------- */
function fiberCanvas(size = 1024, base = '#F2E8D5', dark = '#C9B896', light = '#FFFDF4') {
  const { c, x } = makeCanvas(size, size);
  x.fillStyle = base; x.fillRect(0, 0, size, size);
  // large mottles
  for (let i = 0; i < 90; i++) {
    const px = C.hash(i * 3.1) * size, py = C.hash(i * 7.7 + 2) * size;
    const r = 40 + C.hash(i * 5.3) * 190;
    const g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, C.rgba(C.hash(i) > .5 ? dark : light, .035));
    g.addColorStop(1, C.rgba(dark, 0));
    x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  // fibers
  for (let i = 0; i < 4200; i++) {
    const px = C.hash(i * 1.7) * size, py = C.hash(i * 2.9 + 4) * size;
    const len = 2 + C.hash(i * 4.3) * 22, a = C.hash(i * 6.1) * TAU;
    x.strokeStyle = C.rgba(C.hash(i * 8.3) > .55 ? dark : light, .05 + C.hash(i * 9.7) * .09);
    x.lineWidth = .4 + C.hash(i * 3.7) * .9;
    x.beginPath(); x.moveTo(px, py);
    x.quadraticCurveTo(px + Math.cos(a) * len * .5 + (C.hash(i) - .5) * 3, py + Math.sin(a) * len * .5, px + Math.cos(a) * len, py + Math.sin(a) * len);
    x.stroke();
  }
  // specks
  for (let i = 0; i < 1500; i++) {
    x.fillStyle = C.rgba(C.hash(i * 11.1) > .5 ? dark : light, .06 + C.hash(i) * .08);
    const px = C.hash(i * 13.3) * size, py = C.hash(i * 17.9) * size;
    x.fillRect(px, py, .7 + C.hash(i * 19.1) * 1.8, .7 + C.hash(i * 23.7) * 1.8);
  }
  return c;
}
function grainCanvas(size = 512) {
  const { c, x } = makeCanvas(size, size);
  const img = x.createImageData(size, size);
  let seed = 0x5eed1234;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < size * size; i++) {
    const v = rnd() * 255;
    img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = rnd() * 34;
  }
  x.putImageData(img, 0, 0);
  return c;
}
let PAPER_TEX, GRAIN_TEX, HALFTONE;
function initTextures() {
  if (PAPER_TEX) return;
  PAPER_TEX = fiberCanvas(1024);
  GRAIN_TEX = grainCanvas(512);
  const h = makeCanvas(64, 64);
  h.x.fillStyle = '#000'; h.x.beginPath(); h.x.arc(32, 32, 13, 0, TAU); h.x.fill();
  HALFTONE = h.c;
}

function paperOverlay(ctx, t = 0, alpha = .5) {
  const p = ctx.createPattern(PAPER_TEX, 'repeat');
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p;
  const ox = (C.hash(Math.floor(t * 2)) * 160) | 0, oy = (C.hash(Math.floor(t * 2) + 8) * 160) | 0;
  ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 200, H + 200);
  ctx.restore();
}
function grainOverlay(ctx, t = 0, alpha = .55) {
  const p = ctx.createPattern(GRAIN_TEX, 'repeat');
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p;
  const f = Math.floor(t * 24);
  ctx.translate(-(C.hash(f) * 512) | 0, -(C.hash(f + 3) * 512) | 0);
  ctx.fillRect(0, 0, W + 512, H + 512);
  ctx.restore();
}
function halftone(ctx, x, y, w, h, color, cell = 14, dot = .55, alpha = .5, angle = .2) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.globalAlpha = alpha; ctx.fillStyle = color;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  for (let j = -h; j < h * 1.5; j += cell) for (let i = -w; i < w * 1.5; i += cell) {
    const px = x + i * ca - j * sa, py = y + i * sa + j * ca;
    ctx.beginPath(); ctx.arc(px, py, cell * dot * .5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
function vignette(ctx, strength = .3, color = '#171310') {
  const g = ctx.createRadialGradient(W * .5, H * .45, H * .18, W * .5, H * .5, H * .82);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.72, 'rgba(0,0,0,0)');
  g.addColorStop(1, C.rgba(color, strength));
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function flash(ctx, k, color = '#FFF7E4') {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = C.clamp(k); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function speedLines(ctx, cx, cy, r0, r1, n, color, alpha, t, seed = 0) {
  ctx.save(); ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = C.hash(i * 3.7 + seed) * TAU + t * (C.hash(i + 2) - .5) * .6;
    const rr = r0 + C.frac(C.hash(i * 5.1 + seed) + t * (.2 + C.hash(i) * .5)) * (r1 - r0);
    const len = 40 + C.hash(i * 7.3) * 180;
    ctx.lineWidth = 1 + C.hash(i * 9.1) * 4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    ctx.lineTo(cx + Math.cos(a) * (rr + len), cy + Math.sin(a) * (rr + len)); ctx.stroke();
  }
  ctx.restore();
}

/* ---------- object factories ---------- */
function makeRng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
function polyPath(ctx, pts, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
}
function blobPath(ctx, cx, cy, rx, ry, n = 14, jitter = .06, seed = 0, rot = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + rot;
    const j = 1 + (C.hash(seed + i * 3.3) - .5) * jitter * 2;
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
  }
  ctx.beginPath();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let m = mid(pts[n - 1], pts[0]);
  ctx.moveTo(m[0], m[1]);
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n], mm = mid(p, q);
    ctx.quadraticCurveTo(p[0], p[1], mm[0], mm[1]);
  }
  ctx.closePath();
}
function tornRectPath(ctx, x, y, w, h, amt = 6, seed = 0, top = true, right = true, bottom = true, left = true) {
  const edge = (x1, y1, x2, y2, n, s) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const u = i / n;
      const px = C.lerp(x1, x2, u) + (C.hash(s + i * 3.1) - .5) * amt * 2;
      const py = C.lerp(y1, y2, u) + (C.hash(s + i * 5.7) - .5) * amt * 2;
      out.push([px, py]);
    }
    return out;
  };
  let pts = [];
  pts.push(...(top ? edge(x, y, x + w, y, 14, seed) : [[x, y]]));
  pts.push(...(right ? edge(x + w, y, x + w, y + h, 10, seed + 20) : [[x + w, y], [x + w, y + h]]));
  pts.push(...(bottom ? edge(x + w, y + h, x, y + h, 14, seed + 40) : [[x + w, y + h], [x, y + h]]));
  pts.push(...(left ? edge(x, y + h, x, y, 10, seed + 60) : [[x, y + h], [x, y]]));
  polyPath(ctx, pts);
}
function starPath(ctx, cx, cy, r, inner = .45, n = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = rot + i / (n * 2) * TAU, rr = i % 2 ? r * inner : r;
    i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
}
function sparkPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU, rr = i % 2 ? r * .28 : r;
    i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
}
function heartPath(ctx, cx, cy, r) {
  ctx.beginPath(); ctx.moveTo(cx, cy + r * .72);
  ctx.bezierCurveTo(cx - r * 1.35, cy - r * .16, cx - r * .6, cy - r * 1.03, cx, cy - r * .42);
  ctx.bezierCurveTo(cx + r * .6, cy - r * 1.03, cx + r * 1.35, cy - r * .16, cx, cy + r * .72);
  ctx.closePath();
}
function petalPath(ctx, cx, cy, a, r0, r1, width, seed = 0) {
  const ca = Math.cos(a), sa = Math.sin(a);
  const px = -sa, py = ca;
  const tipx = cx + ca * r1, tipy = cy + sa * r1;
  const bx = cx + ca * r0, by = cy + sa * r0;
  ctx.beginPath();
  ctx.moveTo(bx + px * width * .35, by + py * width * .35);
  ctx.quadraticCurveTo(cx + ca * (r0 + r1) * .5 + px * width, cy + sa * (r0 + r1) * .5 + py * width, tipx, tipy);
  ctx.quadraticCurveTo(cx + ca * (r0 + r1) * .5 - px * width, cy + sa * (r0 + r1) * .5 - py * width, bx - px * width * .35, by - py * width * .35);
  ctx.closePath();
}

/* draw a paper shape: shadow pass, fill, edge, top highlight */
function paper(ctx, pathFn, o = {}) {
  const sh = o.shadow === undefined ? null : o.shadow;
  if (sh) {
    ctx.save();
    ctx.translate(o.sx ?? 6, o.sy ?? 10);
    ctx.fillStyle = sh; ctx.globalAlpha = o.shAlpha ?? 1;
    pathFn(); ctx.fill(); ctx.restore();
  }
  pathFn();
  ctx.fillStyle = o.fill || PAL.paper; ctx.fill();
  if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = o.edgeW ?? 2; ctx.stroke(); }
  if (o.gloss) {
    ctx.save(); ctx.clip();
    const g = ctx.createLinearGradient(0, o.glossY ?? 0, 0, (o.glossY ?? 0) + (o.glossH ?? 100));
    g.addColorStop(0, C.rgba('#FFFFFF', o.gloss ?? .25)); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
  }
}
function shadowEllipse(ctx, x, y, rx, ry, alpha = .2) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
  g.addColorStop(0, C.rgba(PAL.ink, alpha)); g.addColorStop(1, C.rgba(PAL.ink, 0));
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}

/* ---------- camera ---------- */
const CAM = { x: W / 2, y: H / 2, z: 1, r: 0, sx: 0, sy: 0, ox: 0, oy: 0 };
function setCam(x, y, z = 1, r = 0, shake = 0, t = 0) {
  CAM.x = x; CAM.y = y; CAM.z = z; CAM.r = r;
  CAM.sx = shake && t ? Math.sin(t * 71) * shake : 0;
  CAM.sy = shake && t ? Math.cos(t * 63) * shake * .7 : 0;
  CAM.ox = 0; CAM.oy = 0;
}
function beginCam(ctx) {
  ctx.save();
  ctx.translate(W / 2 + CAM.sx, H / 2 + CAM.sy);
  ctx.rotate(CAM.r);
  ctx.scale(CAM.z, CAM.z);
  ctx.translate(-CAM.x, -CAM.y);
}
function endCam(ctx) { ctx.restore(); }
function worldToScreen(x, y) {
  const dx = (x - CAM.x) * CAM.z, dy = (y - CAM.y) * CAM.z;
  const c = Math.cos(CAM.r), s = Math.sin(CAM.r);
  return [W / 2 + CAM.sx + dx * c - dy * s, H / 2 + CAM.sy + dx * s + dy * c];
}

/* ---------- misc ---------- */
function drawCanvasRot(ctx, img, x, y, w, h, rot = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
  ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
}
function lerpPose(a, b, u) {
  const o = {};
  for (const k in a) {
    if (typeof a[k] === 'number' && typeof b[k] === 'number') o[k] = C.lerp(a[k], b[k], u);
    else o[k] = u < .5 ? a[k] : b[k];
  }
  return o;
}
