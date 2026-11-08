/* ============================================================
   CLAUDE POP — timeline / scene registry
   ============================================================ */
const SCENES = [];
function scene(o) { SCENES.push(o); }
function sceneAt(t) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].start) return SCENES[i];
  return SCENES[0];
}
let ctx, cv;

function beginShot(s) {
  // never inherit canvas state between frames
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H);
}

function drawScene(s, t) {
  const lt = t - s.start, dur = s.end - s.start;
  s.draw(t, lt, dur);
}

/* transitions are authored inside shots for now; global list for folds/flashes */
const GLOBAL_TRANS = [
  // { t, d, type, color }
];

function drawTransition(t) {
  for (const tr of GLOBAL_TRANS) {
    if (t > tr.t && t < tr.t + tr.d) {
      const u = C.seg(t, tr.t, tr.t + tr.d);
      // closed at midpoint
      const k = u < .5 ? C.ease(u * 2) : 1 - C.ease((u - .5) * 2);
      drawPaperWipe(ctx, k, tr.color || PAL.red, tr.seed || 3);
    }
  }
}
function drawPaperWipe(ctx, k, col, seed) {
  if (k <= 0) return;
  ctx.save();
  const w = W * k;
  paper(ctx, () => tornRectPath(ctx, W / 2 - w / 2, -30, w, H + 60, 10, seed, true, true, true, true), { fill: col, edge: C.rgba(PAL.ink, .3), edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 10, sy: 0 });
  ctx.restore();
}

function renderAt(t, type = 'image/png', q = .95) {
  if (!ctx) { cv = document.getElementById('out'); ctx = cv.getContext('2d'); }
  const s = sceneAt(t);
  beginShot(s);
  drawScene(s, t);
  drawTransition(t);

  // global lyric (subtitle or none)
  const line = lyricAt(t);
  const mode = s.lyric || 'sub';
  if (line && mode === 'sub') TY.subtitle(ctx, line, t, { x: s.subX, y: s.subY });
  if (line && mode === 'hero') { /* shot draws it */ }

  // doom ticker
  if (!s.noDoom) drawDoomTicker(ctx, t);

  // print furniture
  drawPrintMarks(ctx, t);
  paperOverlay(ctx, t, .5);
  grainOverlay(ctx, t, .45);
  vignette(ctx, .34);
  return cv.toDataURL(type, q);
}

function drawDoomTicker(ctx, t) {
  const v = doomAt(t);
  const x = W - 286, y = 40, w = 246, h = 96;
  ctx.save();
  ctx.globalAlpha = .92;
  paper(ctx, () => tornRectPath(ctx, x, y, w, h, 3.5, 9), { fill: PAL.ink, edge: null, shadow: C.rgba(PAL.ink, .25), sx: 4, sy: 6 });
  TY.text(ctx, 'P(DOOM)', x + 16, y + 24, 15, { family: 'Archivo Black', color: PAL.cream, letter: .5 });
  TY.text(ctx, v.toFixed(1) + '%', x + 16, y + 66, 34, { family: 'DMMono', color: v > 95 ? PAL.red : PAL.acid, letter: -1 });
  TY.text(ctx, 'TOKENS/S', x + 16, y + 84, 10, { family: 'DMMono', color: C.rgba(PAL.cream, .5), letter: 1 });
  // bar
  ctx.fillStyle = C.rgba(PAL.cream, .16); ctx.fillRect(x + 156, y + 46, 70, 6);
  ctx.fillStyle = v > 95 ? PAL.red : PAL.acid; ctx.fillRect(x + 156, y + 46, 70 * v / 100, 6);
  // ticks
  for (let i = 0; i < 6; i++) { ctx.fillStyle = C.rgba(PAL.cream, .3); ctx.fillRect(x + 156 + i * 14, y + 56, 1, 5); }
  // tiny flower
  for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(x + 206, y + 22); ctx.rotate(i / 6 * TAU); ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.ellipse(0, -7, 3, 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(x + 206, y + 22, 3, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawPrintMarks(ctx, t) {
  ctx.save();
  ctx.globalAlpha = .22; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1;
  const m = 26, l = 16;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, y + sy * l); ctx.lineTo(x, y); ctx.lineTo(x + sx * l, y); ctx.stroke();
  }
  // color bars
  const cols = [PAL.blue, PAL.red, PAL.gold, PAL.ink];
  for (let i = 0; i < cols.length; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(W - 100 + i * 15, H - 34, 11, 5); }
  TY.text(ctx, 'CLAUDE POP · ' + Math.floor(t * 30).toString().padStart(5, '0'), W - 344, H - 30, 11, { color: C.rgba(PAL.ink, .5), letter: 1 });
  TY.text(ctx, '© 2026 PAPER SINGULARITY', 44, H - 30, 11, { color: C.rgba(PAL.ink, .5), letter: 1 });
  ctx.restore();
}

function renderSheet(ts, cols = 3, w = 480) {
  if (!ctx) { cv = document.getElementById('out'); ctx = cv.getContext('2d'); }
  const rows = Math.ceil(ts.length / cols);
  const h = Math.round(w * H / W);
  const sheet = makeCanvas(cols * w, rows * h);
  const sx = sheet.x;
  sx.fillStyle = '#100D0B'; sx.fillRect(0, 0, sheet.c.width, sheet.c.height);
  const ms = [];
  for (let i = 0; i < ts.length; i++) {
    const t0 = performance.now();
    const s = sceneAt(ts[i]);
    beginShot(s); drawScene(s, ts[i]);
    const line = lyricAt(ts[i]);
    if (line && (s.lyric || 'sub') === 'sub') TY.subtitle(ctx, line, ts[i], { x: s.subX, y: s.subY });
    if (!s.noDoom) drawDoomTicker(ctx, ts[i]);
    drawPrintMarks(ctx, ts[i]);
    paperOverlay(ctx, ts[i], .5); grainOverlay(ctx, ts[i], .45); vignette(ctx, .34);
    ms.push(Math.round(performance.now() - t0));
    const col = i % cols, row = Math.floor(i / cols);
    sx.drawImage(cv, col * w, row * h, w, h);
    sx.fillStyle = 'rgba(10,8,7,.72)'; sx.fillRect(col * w, row * h + h - 22, 100, 22);
    sx.fillStyle = '#F2E8D5'; sx.font = '13px DMMono'; sx.fillText(ts[i].toFixed(2) + 's', col * w + 8, row * h + h - 6);
  }
  return { url: sheet.c.toDataURL('image/jpeg', .92), ms };
}
