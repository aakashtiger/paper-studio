/* ============================================================
   CLAUDE POP — paper sets & props
   Every set is a pure function of song time.
   ============================================================ */

/* ---------------- base helpers ---------------- */
function paperBg(ctx, top, bot) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function sunburst(ctx, cx, cy, r0, r1, n, colA, colB, rot = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const a0 = rot + i / n * TAU, a1 = rot + (i + 1) / n * TAU;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1);
    ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? colA : colB; ctx.fill();
  }
  ctx.restore();
}

function tape(ctx, x, y, w, h, rot = 0, col = PAL.cream) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.globalAlpha = .52; ctx.fillStyle = col;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.globalAlpha = .3; ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-w / 2, -h / 2, w, 3);
  ctx.restore();
}

function tornPanel(ctx, x, y, w, h, fill, seed = 3, edge = null) {
  paper(ctx, () => tornRectPath(ctx, x, y, w, h, 5, seed), { fill, edge, edgeW: edge ? 2 : 0, shadow: C.rgba(PAL.ink, .16), sx: 4, sy: 7 });
}

function card(ctx, x, y, w, h, o = {}) {
  const rot = o.rot || 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);
  if (o.tape !== false) { tape(ctx, w * .5, 2, Math.min(w * .42, 110), 22, o.tapeRot || .02); }
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, h, 4, o.seed || 11), {
    fill: o.fill || PAL.cream, edge: o.edge === undefined ? C.rgba(PAL.ink, .35) : o.edge, edgeW: 1.6,
    shadow: C.rgba(PAL.ink, .22), sx: 5, sy: 9
  });
  if (o.head) TY.text(ctx, o.head, 18, 30, o.headSize || 13, { family: 'Archivo Black', color: o.headCol || PAL.red, letter: 1 });
  if (o.lines) {
    ctx.strokeStyle = C.rgba(PAL.ink, .28); ctx.lineWidth = 1;
    for (let i = 0; i < o.lines; i++) { ctx.beginPath(); ctx.moveTo(18, 48 + i * 16); ctx.lineTo(w - 18, 48 + i * 16); ctx.stroke(); }
  }
  if (o.text) TY.text(ctx, o.text, w / 2, h / 2 + (o.textY || 0), o.size || 14, { family: o.family || 'DMMono', color: o.col || PAL.ink, align: 'center' });
  if (o.img) o.img(ctx, w, h);
  ctx.restore();
}

function confetti(ctx, t, n = 70, cols = [PAL.red, PAL.gold, PAL.cream, PAL.blue, PAL.pink], alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const sp = .13 + C.hash(i * 3.1) * .3;
    const x = C.hash(i * 7.7) * W + Math.sin(t * 1.6 + i) * 24;
    const y = C.loop(C.hash(i * 11.3) * H + t * (90 + sp * 300), -60, H + 120);
    const rot = t * (1 + C.hash(i) * 3) + i;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = cols[i % cols.length];
    ctx.globalAlpha = alpha * (.7 + C.hash(i * 5.9) * .3);
    ctx.fillRect(-4, -8, 8 + C.hash(i * 2.3) * 5, 13);
    ctx.restore();
  }
  ctx.restore();
}

function spotlight(ctx, x, y, len, w0, w1, col = '#FFF4D8', alpha = .16, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const g = ctx.createLinearGradient(0, 0, 0, len);
  g.addColorStop(0, C.rgba(col, alpha * 1.5)); g.addColorStop(1, C.rgba(col, 0));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-w0 / 2, 0); ctx.lineTo(w0 / 2, 0); ctx.lineTo(w1 / 2, len); ctx.lineTo(-w1 / 2, len); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function starfield(ctx, t, n = 160, seed = 1, maxY = 720) {
  for (let i = 0; i < n; i++) {
    const x = C.hash(i * 3.7 + seed) * W;
    const y = C.hash(i * 7.1 + seed) * maxY;
    const tw = .4 + .6 * Math.abs(Math.sin(t * (.7 + C.hash(i) * 1.6) + i));
    ctx.fillStyle = C.rgba(i % 7 === 0 ? PAL.gold : '#FFF6E2', tw);
    const r = i % 9 === 0 ? 3.2 : 1 + C.hash(i * 2.3) * 1.8;
    if (i % 11 === 0) { sparkPath(ctx, x, y, r * 3.4); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  }
}

function crowd(ctx, t, y = 1034, col = '#120E0B', n = 16) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const x = 30 + i * (W - 60) / (n - 1) + C.hash(i * 3.3) * 26;
    // A foreground paper layer, not a stencil: the nearest object in frame has
    // to be the largest, so the heads are ~3x what they were (43 px on screen
    // against a 670 px performer was 6 % — a distant strip, not an audience).
    const h = 190 + C.hash(i * 7.1) * 95;
    const bob = Math.max(0, Math.sin(C.beat(t) * Math.PI + i * .6)) * 10;
    // contact shadow onto the floor, one per figure
    ctx.save();
    ctx.globalAlpha = .18;
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.ellipse(x, y + 58, 92, 14, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = col;
    ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 2.5;
    // torso
    ctx.beginPath(); ctx.moveTo(x - 96, y + 62); ctx.quadraticCurveTo(x - 66, y - h * .55 + bob, x - 30, y - h * .5 + bob);
    ctx.lineTo(x + 30, y - h * .5 + bob); ctx.quadraticCurveTo(x + 66, y - h * .55 + bob, x + 96, y + 62); ctx.closePath(); ctx.fill(); ctx.stroke();
    // head, with the cut edge of a paper shape
    ctx.beginPath(); ctx.arc(x, y - h * .72 + bob, 46, 0, TAU); ctx.fill(); ctx.stroke();
    // arm
    if (i % 3 === 0) {
      ctx.strokeStyle = col; ctx.lineWidth = 26; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + 52, y - h * .45 + bob); ctx.lineTo(x + 86, y - h * .95 + bob + Math.sin(t * 3 + i) * 8); ctx.stroke();
    }
    // phone light
    if (i % 5 === 1) {
      ctx.fillStyle = C.rgba('#FFF1C8', .85); ctx.fillRect(x + 72, y - h * .95 + bob, 14, 22);
      ctx.fillStyle = C.rgba(PAL.gold, .1); ctx.beginPath(); ctx.arc(x + 79, y - h * .9 + bob, 56, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

function speakerStack(ctx, x, y, s, col = PAL.ink, accent = PAL.red) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 2; i++) {
    paper(ctx, () => roundRectPath(ctx, -70, -220 + i * 224, 140, 214, 6), {
      fill: col, edge: C.rgba(PAL.ink, .8), edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 8, sy: 12
    });
    for (let k = 0; k < 2; k++) {
      ctx.fillStyle = C.rgba(PAL.cream, .12); ctx.beginPath(); ctx.arc(0, -160 + i * 224 + k * 92, 40 - k * 10, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.cream, .35); ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = accent; ctx.fillRect(-70, -220 + i * 224, 140, 8);
  }
  ctx.restore();
}

/* ---------------- STAGE ---------------- */
function stageSet(ctx, t, o = {}) {
  const sky = o.sky || PAL.redD, sun = o.sun || PAL.gold, rayA = o.rayA || '#C93A20', rayB = o.rayB || '#E85A3A';
  const floor = o.floor || PAL.blue, accent = o.accent || PAL.cream;
  // Flat plate: paper is cut, never blended. A vertical gradient under a paper
  // film is the one thing that made the wides read as vector rather than paper.
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  // rays
  sunburst(ctx, W / 2, 486, 0, 1300, 28, rayA, rayB, (o.rot || 0) + t * .04, .95);
  // giant sun, lifted off the backdrop with a hard paper shadow
  paper(ctx, () => blobPath(ctx, W / 2, 470, 436, 436, 64, .012, 4), { fill: sun, edge: C.rgba(PAL.cream, .8), edgeW: 4, shadow: C.rgba(PAL.ink, .24), sx: 14, sy: 20 });
  halftone(ctx, W / 2 - 436, 34, 872, 872, C.shade(sun, -40), 22, .5, .12);
  // stage floor: a cut plate with a contact shadow onto the backdrop, so the
  // floor is a piece of paper in front of the sky rather than a fill.
  paper(ctx, () => tornRectPath(ctx, -200, 800, W + 400, H - 700, 7, 13), {
    fill: floor, edge: C.rgba(PAL.ink, .35), edgeW: 3,
    shadow: C.rgba(PAL.ink, .3), sx: -6, sy: -12,
  });
  ctx.save();
  ctx.beginPath(); ctx.moveTo(-80, 800); ctx.lineTo(W + 80, 800); ctx.lineTo(W + 200, H + 80); ctx.lineTo(-200, H + 80); ctx.closePath();
  ctx.clip();
  // perspective floor lines
  ctx.strokeStyle = C.rgba(PAL.cream, .18); ctx.lineWidth = 2;
  for (let i = -2; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * 210, 800); ctx.lineTo(-500 + i * 330, H + 80); ctx.stroke(); }
  for (let j = 0; j < 5; j++) { const y = 800 + Math.pow(j / 4, 1.7) * 300; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  // stage lip
  paper(ctx, () => tornRectPath(ctx, -60, 786, W + 120, 30, 6, 21), { fill: accent, edge: C.rgba(PAL.ink, .4), edgeW: 2, shadow: C.rgba(PAL.ink, .25), sx: 0, sy: 8 });
  // side proscenium curtains (in front of the speaker edges; shadow falls inward)
  for (const side of [-1, 1]) {
    const x = side < 0 ? -80 : W - 120;
    paper(ctx, () => tornRectPath(ctx, x, -30, 220, 930, 9, 31), {
      fill: PAL.red, edge: C.rgba(PAL.ink, 0.45), edgeW: 2.5,
      // One key, from the top left: every paper shape in the set (the sun, the
      // lip, the cards, both performers) casts down-right, so the curtains do
      // too. The old inward offsets lit the room from both corners at once.
      shadow: C.rgba(PAL.ink, 0.3), sx: 18, sy: 10,
    });
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = C.shade(PAL.red, -7 - i * 5);
      ctx.fillRect(x + 40 + i * 46, -20, 10, 900);
    }
  }
  // speakers
  speakerStack(ctx, 148, 960, 1.0, PAL.ink, PAL.red);
  speakerStack(ctx, 1772, 960, 1.0, PAL.ink, PAL.red);
  // one key light, top left — the direction every shadow in the pack already
  // agrees with. A symmetric pair gave the room two sources and no shadow side.
  spotlight(ctx, 250, -40, 1150, 40, 420, '#FFF6DC', .22, -.35);
  if (o.crowd !== false) crowd(ctx, t, o.crowdY ?? 1052);
  if (o.confetti) confetti(ctx, t, o.confetti, o.confettiCols || [PAL.cream, PAL.gold, PAL.blue, PAL.pink]);
  // proscenium torn edge
  paper(ctx, () => tornRectPath(ctx, -40, -30, W + 80, 40, 8, 5), { fill: o.prosc || PAL.paper, edge: null, shadow: C.rgba(PAL.ink, .2), sx: 0, sy: 6 });
}

/* ---------------- LAB ---------------- */
function monitor(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  // stand
  ctx.fillStyle = PAL.ink2; ctx.fillRect(-9, h, 18, 26);
  paper(ctx, () => roundRectPath(ctx, -w * .22, h + 20, w * .44, 12, 5), { fill: PAL.ink2, edge: C.rgba(PAL.ink, .5), edgeW: 1.5 });
  paper(ctx, () => roundRectPath(ctx, -w / 2 - 8, -8, w + 16, h + 16, 10), { fill: '#2A2521', edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, .3), sx: 6, sy: 8 });
  const f = o.fill || '#0C2B2A';
  ctx.fillStyle = f; ctx.fillRect(-w / 2, 0, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h); ctx.clip();
  if (o.mode === 'code') {
    ctx.fillStyle = C.rgba(PAL.mint, .8);
    for (let i = 0; i < 13; i++) {
      const lw = 18 + C.hash(i * 3.7 + Math.floor(t * 2)) * w * .55;
      ctx.globalAlpha = .25 + C.hash(i * 7.1) * .55;
      ctx.fillRect(-w / 2 + 16 + (i % 3) * 12, 16 + i * (h - 30) / 13, lw, 4);
    }
  } else if (o.mode === 'eyes') {
    ctx.fillStyle = '#07100F'; ctx.fillRect(-w / 2, 0, w, h);
    for (const sx of [-1, 1]) {
      ctx.fillStyle = PAL.acid; ctx.beginPath(); ctx.ellipse(sx * w * .16, h * .5, w * .07, h * .16, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(sx * w * .16, h * .5, w * .02, h * .11, 0, 0, TAU); ctx.fill();
    }
  } else {
    // loss curve
    ctx.strokeStyle = C.rgba(PAL.mint, .25); ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-w / 2 + 10, 12 + i * (h - 24) / 5); ctx.lineTo(w / 2 - 10, 12 + i * (h - 24) / 5); ctx.stroke(); }
    ctx.strokeStyle = o.line || PAL.red; ctx.lineWidth = 4; ctx.beginPath();
    for (let i = 0; i <= w; i += 4) {
      const u = i / w, v = o.drop ? .82 * Math.exp(-u * 7) + .1 + Math.sin(u * 14 + t * 2) * .02 : .6 + Math.sin(u * 9) * .04;
      const px = -w / 2 + i, py = 16 + (h - 32) * v;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = C.rgba(PAL.mint, .6); TY.text(ctx, o.label || 'train_loss', -w / 2 + 10, 18, 11, { color: C.rgba(PAL.mint, .8), family: 'DMMono' });
  }
  ctx.restore();
  // screen glare
  ctx.globalAlpha = .1; ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w * .3, 0); ctx.lineTo(-w / 2, h * .8); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function mug(ctx, x, y, s = 1, col = PAL.red, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, -15, -22, 30, 34, 5), { fill: col, edge: C.rgba(PAL.ink, .6), edgeW: 1.8, shadow: C.rgba(PAL.ink, .2), sx: 2, sy: 4 });
  ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(19, -6, 9, -1.1, 1.1); ctx.stroke();
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, -22, 15, 4, 0, 0, TAU); ctx.fill();
  if (o.steam) {
    ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      for (let k = 0; k < 8; k++) { const yy = -30 - k * 9, xx = i * 7 + Math.sin(k * .7 + o.t * 2 + i) * 5; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function labSet(ctx, t, o = {}) {
  paperBg(ctx, o.top || '#EDE0C8', o.bot || '#D9C4A2');
  // wall grid / blueprint
  ctx.save(); ctx.globalAlpha = .1; ctx.strokeStyle = PAL.blue; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 62) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 760); ctx.stroke(); }
  for (let y = 0; y < 760; y += 62) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  // window with paper sun
  if (o.window !== false) {
    paper(ctx, () => roundRectPath(ctx, 1150, 120, 560, 380, 6), { fill: '#F8DFAF', edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, .18), sx: 8, sy: 10 });
    ctx.save(); ctx.beginPath(); ctx.rect(1158, 128, 544, 364); ctx.clip();
    paper(ctx, () => blobPath(ctx, 1430, 330, 150, 150, 40, .01, 3), { fill: PAL.gold, edge: null });
    ctx.fillStyle = C.rgba(PAL.red, .18); ctx.fillRect(1158, 128, 544, 364);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = C.rgba(PAL.blue, .18); ctx.fillRect(1158, 128 + i * 90, 544, 26); }
    ctx.restore();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(1430, 128); ctx.lineTo(1430, 492); ctx.moveTo(1158, 310); ctx.lineTo(1702, 310); ctx.stroke();
  }
  // shelves with binders
  ctx.save();
  paper(ctx, () => roundRectPath(ctx, 90, 190, 440, 16, 3), { fill: PAL.paper3, edge: C.rgba(PAL.ink, .5), edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 6 });
  for (let i = 0; i < 12; i++) {
    const bx = 106 + i * 34, bh = 62 + C.hash(i * 3.7) * 46;
    ctx.fillStyle = [PAL.red, PAL.blue, PAL.ink, PAL.gold, PAL.mint, PAL.pink][i % 6];
    ctx.fillRect(bx, 190 - bh, 26, bh);
    ctx.fillStyle = C.rgba(PAL.cream, .5); ctx.fillRect(bx + 4, 190 - bh + 12, 2, bh - 24);
    ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 1; ctx.strokeRect(bx, 190 - bh, 26, bh);
  }
  ctx.restore();
  // pinned charts
  card(ctx, 380, 330, 240, 170, { seed: 5, rot: -.03, head: 'P(DOOM) / DAY', lines: 6 });
  card(ctx, 680, 260, 190, 130, { seed: 9, rot: .035, head: 'SCALING', text: '10^26', size: 34, family: 'DMMono', col: PAL.blue });
  // desk
  paper(ctx, () => tornRectPath(ctx, -40, 726, W + 80, 50, 3, 31), { fill: PAL.paper2, edge: C.rgba(PAL.ink, .45), edgeW: 2, shadow: C.rgba(PAL.ink, .22), sx: 0, sy: 8 });
  ctx.fillStyle = C.rgba(PAL.ink, .12); ctx.fillRect(0, 772, W, 6);
  // monitors on desk
  monitor(ctx, 900, 520, 430, 208, t, { mode: 'code' });
  monitor(ctx, 430, 560, 290, 156, t, { mode: 'curve', label: 'train_loss', drop: true });
  // desk clutter
  mug(ctx, 1260, 726, 1.1, PAL.red, { steam: true, t });
  for (let i = 0; i < 4; i++) card(ctx, 1290 + i * 8, 700 - i * 4, 120, 90, { rot: -.02 + i * .012, seed: 20 + i, lines: 4, tape: false });
  // cables
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.globalAlpha = .65;
  ctx.beginPath(); ctx.moveTo(1000, 744); ctx.bezierCurveTo(1060, 800, 940, 812, 1010, 900); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(600, 730); ctx.bezierCurveTo(540, 800, 640, 820, 560, 910); ctx.stroke();
  ctx.globalAlpha = 1;
  // chair
  if (o.chair) {
    ctx.save(); ctx.translate(1120, 800);
    paper(ctx, () => roundRectPath(ctx, -80, -170, 160, 180, 26), { fill: PAL.blueD, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 6, sy: 10 });
    ctx.restore();
  }
}

/* ---------------- GYM ---------------- */
function gymSet(ctx, t, o = {}) {
  paperBg(ctx, '#C8EBDD', '#A6D9C6');
  // window
  paper(ctx, () => roundRectPath(ctx, 1080, 90, 660, 470, 8), { fill: '#EAF7F2', edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, .18), sx: 8, sy: 10 });
  ctx.save(); ctx.beginPath(); ctx.rect(1090, 100, 640, 450); ctx.clip();
  ctx.fillStyle = '#BFE6FA'; ctx.fillRect(1090, 100, 640, 240);
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(1090, 400); ctx.quadraticCurveTo(1260, 300, 1420, 380); ctx.quadraticCurveTo(1580, 450, 1730, 340); ctx.lineTo(1730, 560); ctx.lineTo(1090, 560); ctx.closePath(); }, { fill: PAL.green, edge: null });
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(1090, 470); ctx.quadraticCurveTo(1300, 380, 1500, 460); ctx.quadraticCurveTo(1620, 500, 1730, 430); ctx.lineTo(1730, 560); ctx.lineTo(1090, 560); ctx.closePath(); }, { fill: '#5BBE8C', edge: null });
  paper(ctx, () => blobPath(ctx, 1540, 230, 62, 62, 32, .01, 2), { fill: PAL.gold, edge: null });
  ctx.restore();
  for (let i = 1; i < 3; i++) { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1090 + i * 213, 100); ctx.lineTo(1090 + i * 213, 550); ctx.stroke(); }
  // wall stripe
  paper(ctx, () => tornRectPath(ctx, -20, 300, 950, 40, 4, 6), { fill: PAL.mint, edge: null, shadow: C.rgba(PAL.ink, .12), sx: 0, sy: 5 });
  // slogan
  TY.type(ctx, 'MOVE FAST', 90, 240, 74, { color: PAL.teal, edge: PAL.cream, edgeW: 6, align: 'left', time: t, seed: 4, charRot: .01 });
  TY.text(ctx, 'AND BREAK THINGS', 96, 282, 24, { family: 'DMMono', color: PAL.teal, letter: 4 });
  // treadmill
  ctx.save(); ctx.translate(430, 760);
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-210, 120); ctx.lineTo(190, 120); ctx.lineTo(210, 250); ctx.lineTo(-230, 250); ctx.closePath(); }, { fill: PAL.ink2, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 8, sy: 12 });
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-180, 96); ctx.lineTo(160, 96); ctx.lineTo(176, 124); ctx.lineTo(-196, 124); ctx.closePath(); }, { fill: '#3A3430', edge: PAL.ink, edgeW: 2 });
  // belt stripes
  ctx.strokeStyle = C.rgba(PAL.cream, .25); ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-170 + i * 38, 100); ctx.lineTo(-184 + i * 38, 120); ctx.stroke(); }
  // console
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(150, 110); ctx.lineTo(180, -80); ctx.stroke();
  paper(ctx, () => roundRectPath(ctx, 130, -170, 170, 94, 8), { fill: PAL.ink, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 6 });
  ctx.fillStyle = '#0C2B2A'; ctx.fillRect(140, -160, 150, 74);
  TY.text(ctx, 'RUN 0042', 150, -136, 14, { family: 'DMMono', color: PAL.acid });
  TY.text(ctx, '0.0%', 150, -112, 24, { family: 'DMMono', color: PAL.cream });
  ctx.restore();
  // dumbbells
  for (let i = 0; i < 3; i++) {
    const x = 800 + i * 90, y = 1010;
    ctx.fillStyle = PAL.ink; ctx.fillRect(x - 34, y - 8, 68, 16);
    ctx.beginPath(); ctx.arc(x - 34, y, 22, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 34, y, 22, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.red; ctx.fillRect(x - 28, y - 4, 56, 8);
  }
  // rubber floor
  ctx.fillStyle = 'rgba(23,19,16,.10)'; ctx.fillRect(0, 900, W, 180);
  ctx.strokeStyle = C.rgba(PAL.ink, .12); ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(0, 900 + i * 20); ctx.lineTo(W, 900 + i * 20); ctx.stroke(); }
  // TV on wall
  card(ctx, 240, 560, 250, 160, { seed: 3, rot: -.02, head: 'LOSS', img: (c, w, h) => {
    c.strokeStyle = PAL.blue; c.lineWidth = 4; c.beginPath();
    for (let i = 0; i < w - 40; i += 5) { const u = i / (w - 40); const y = 100 + Math.sin(u * 3) * 2; i ? c.lineTo(20 + i, y) : c.moveTo(20 + i, y); }
    c.stroke();
  } });
}

/* ---------------- BLACK HOLE ---------------- */
function blackHole(ctx, x, y, r, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  // accretion rings
  for (let i = 7; i >= 0; i--) {
    const rr = r * (1 + i * .15);
    ctx.strokeStyle = i % 2 ? C.rgba(PAL.gold, .55 - i * .06) : C.rgba(PAL.red, .4 - i * .04);
    ctx.lineWidth = r * .05;
    ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * .42, t * .4 + i * .3, 0, TAU); ctx.stroke();
  }
  // swirl dots
  for (let i = 0; i < 90; i++) {
    const a = i * .55 + t * (1.2 + C.hash(i) * .6);
    const rr = r * (.5 + C.hash(i * 3.1) * 1.2);
    const px = Math.cos(a) * rr, py = Math.sin(a) * rr * .5;
    ctx.fillStyle = i % 3 ? C.rgba(PAL.cream, .5) : C.rgba(PAL.gold, .7);
    ctx.beginPath(); ctx.arc(px, py, 1 + C.hash(i * 7.7) * 2.4, 0, TAU); ctx.fill();
  }
  // hole
  const g = ctx.createRadialGradient(0, 0, r * .3, 0, 0, r);
  g.addColorStop(0, '#000000'); g.addColorStop(.82, '#0B0507'); g.addColorStop(1, C.rgba(PAL.violetD, .9));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.cream, .8); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
  ctx.restore();
}

/* ---------------- ROAD / DESERT ---------------- */
function roadSet(ctx, t, o = {}) {
  paperBg(ctx, o.sky || '#F6C877', o.sky2 || '#E89B5A');
  paper(ctx, () => blobPath(ctx, 1360, 300, 130, 130, 40, .01, 3), { fill: PAL.gold, edge: C.rgba(PAL.cream, .7), edgeW: 3 });
  // mesas
  const layers = o.layers || [
    { y: 620, col: '#C96A45' }, { y: 700, col: '#A8502F' }, { y: 780, col: '#7C3A22' }
  ];
  for (const L of layers) {
    ctx.fillStyle = L.col; ctx.beginPath(); ctx.moveTo(0, L.y);
    for (let i = 0; i <= 12; i++) {
      const x = i / 12 * W, h = 40 + C.hash(i * 3.1 + L.y) * 120;
      ctx.lineTo(x, L.y - h); ctx.lineTo(x + W / 12, L.y - h * .82);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, .12); ctx.lineWidth = 2; ctx.stroke();
  }
  // road
  ctx.beginPath(); ctx.moveTo(560, 800); ctx.lineTo(1360, 800); ctx.lineTo(1900, H + 60); ctx.lineTo(120, H + 60); ctx.closePath();
  ctx.fillStyle = '#2E2723'; ctx.fill();
  // center dashes
  ctx.fillStyle = PAL.cream;
  for (let i = 0; i < 5; i++) {
    const u = C.frac(t * .35 + i / 5);
    const y = 800 + u * u * 320, w = 8 + u * 36;
    ctx.fillRect(960 - w / 2, y, w, 20 + u * 50);
  }
  // horizon line
  ctx.strokeStyle = C.rgba(PAL.cream, .25); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 800); ctx.lineTo(W, 800); ctx.stroke();
}

/* ---------------- SPACE ---------------- */
function spaceSet(ctx, t, o = {}) {
  paperBg(ctx, o.top || '#0B0A22', o.bot || '#1B0E38');
  starfield(ctx, t, 190, 3, 780);
  // nebula paper wisps
  ctx.save(); ctx.globalAlpha = .18;
  for (let i = 0; i < 7; i++) {
    paper(ctx, () => blobPath(ctx, 200 + i * 280, 180 + C.hash(i) * 380, 220 + C.hash(i * 3) * 160, 90, 18, .12, i), { fill: i % 2 ? PAL.violet : PAL.pink, edge: null });
  }
  ctx.restore();
  // planet
  if (o.planet !== false) {
    const px = o.planetX ?? 1520, py = o.planetY ?? 700, pr = o.planetR ?? 190;
    paper(ctx, () => blobPath(ctx, px, py, pr, pr, 50, .01, 4), { fill: o.planetCol || PAL.blueD, edge: C.rgba(PAL.cream, .45), edgeW: 3, shadow: C.rgba('#000000', .3), sx: 0, sy: 0 });
    halftone(ctx, px - pr, py - pr, pr * 2, pr * 2, PAL.ink, 14, .4, .18);
    ctx.strokeStyle = C.rgba(PAL.cream, .3); ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(px, py, pr * (.8 + i * .1), pr * .18, -.3, 0, TAU); ctx.stroke(); }
  }
  // grid floor
  if (o.grid !== false) {
    ctx.save(); ctx.globalAlpha = .35; ctx.strokeStyle = PAL.violet;
    const hz = 820;
    for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 40, hz); ctx.lineTo(W / 2 + i * 300, H); ctx.stroke(); }
    for (let i = 0; i < 8; i++) { const y = hz + Math.pow(i / 7, 2) * 260; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }
}

/* ---------------- DATA CENTER ---------------- */
function serverRack(ctx, x, y, w, h, t, seed = 0) {
  ctx.save(); ctx.translate(x, y);
  paper(ctx, () => roundRectPath(ctx, -w / 2, -h, w, h, 4), { fill: '#141C22', edge: '#05090B', edgeW: 3, shadow: C.rgba('#000000', .5), sx: 6, sy: 8 });
  const n = Math.floor(h / 26);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = '#1D2830'; ctx.fillRect(-w / 2 + 8, -h + 8 + i * 26, w - 16, 20);
    for (let k = 0; k < 4; k++) {
      const on = C.hash(seed + i * 7.1 + k * 3.3 + Math.floor(t * (2 + C.hash(i + k) * 5))) > .35;
      ctx.fillStyle = on ? (k === 1 ? PAL.red : PAL.acid) : '#0B1216';
      ctx.fillRect(-w / 2 + 12 + k * 9, -h + 14 + i * 26, 5, 3);
    }
    ctx.fillStyle = C.rgba(PAL.silver, .18); ctx.fillRect(w / 2 - 26, -h + 11 + i * 26, 16, 12);
  }
  ctx.strokeStyle = C.rgba(PAL.silver, .18); ctx.lineWidth = 1; ctx.strokeRect(-w / 2, -h, w, h);
  ctx.restore();
}

function dataSet(ctx, t, o = {}) {
  paperBg(ctx, '#070B0D', '#0B1416');
  // vanishing aisle
  const vx = 960, vy = 700;
  ctx.fillStyle = '#0E191C'; ctx.fillRect(0, vy, W, H - vy);
  // floor grid
  ctx.save(); ctx.globalAlpha = .2; ctx.strokeStyle = PAL.acid;
  for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 22, vy); ctx.lineTo(vx + i * 220, H + 60); ctx.stroke(); }
  for (let i = 0; i < 7; i++) { const y = vy + Math.pow(i / 6, 2) * 300; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  // receding racks
  for (let d = 8; d >= 1; d--) {
    const u = d / 8;
    const sc = 1 - u * .82;
    const y = vy + 40 + u * 120;
    serverRack(ctx, 960 - 250 - u * 620, y, 150 * sc + 40, 480 * sc + 80, t, d * 11);
    serverRack(ctx, 960 + 250 + u * 620, y, 150 * sc + 40, 480 * sc + 80, t, d * 17);
  }
  // READY light
  TY.text(ctx, 'CLUSTER 001', 60, 70, 16, { family: 'DMMono', color: C.rgba(PAL.acid, .7), letter: 3 });
  TY.text(ctx, 'POWER 1.21 GW', 60, 96, 16, { family: 'DMMono', color: C.rgba(PAL.acid, .45), letter: 2 });
  // cold fog
  ctx.save(); ctx.globalAlpha = .08; ctx.fillStyle = PAL.mint;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(200 + i * 400, 880, 260, 40, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
