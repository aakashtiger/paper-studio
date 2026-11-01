/* ============================================================
   CLAUDE POP — typography
   ============================================================ */
const TY = {};
TY.fonts = {};
TY.ready = false;

TY.font = (size, family = 'Anton', weight = '400', style = 'normal') => `${style} ${weight} ${size}px "${family}", "Arial Black", sans-serif`;
TY.set = (ctx, size, family, weight, style) => { ctx.font = TY.font(size, family, weight, style); };
TY.width = (ctx, str, size, family = 'Anton', weight = '400', track = 0) => {
  TY.set(ctx, size, family, weight);
  let w = 0; for (const ch of str) w += ctx.measureText(ch).width + track;
  return w;
};
TY.wrap = (ctx, str, maxW, size, family, weight) => {
  TY.set(ctx, size, family, weight);
  const words = str.split(' '); const lines = []; let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
};

/* per-character paper type. x,y is the baseline; opts.align left|center|right */
TY.type = function (ctx, str, x, y, size, o = {}) {
  const fam = o.family || 'Anton', weight = o.weight || '400';
  const style = o.italic ? 'italic' : 'normal';
  const track = o.track ?? size * .01;
  const chars = [...str];
  let total = 0;
  TY.set(ctx, size, fam, weight, style);
  for (const ch of chars) total += ctx.measureText(ch).width + track;
  total -= track;
  let cx = x;
  if (o.align === 'center') cx = x - total / 2;
  else if (o.align === 'right') cx = x - total;
  const app = o.appear === undefined ? 1 : C.clamp(o.appear);
  const seed = o.seed ?? 0;
  const col = o.color || PAL.ink;
  const edge = o.edge === undefined ? PAL.cream : o.edge;
  const edgeW = o.edgeW ?? Math.max(2, size * .055);
  const shOff = o.shadowOff ?? size * .035;
  const shadow = o.shadow === undefined ? C.rgba(PAL.ink, .26) : o.shadow;
  const jit = o.jitter ?? .6;
  const boil = o.boil === false ? 0 : Math.floor((o.time || 0) * 12);

  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  TY.set(ctx, size, fam, weight, style);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const w = ctx.measureText(ch).width;
    if (ch !== ' ') {
      const h1 = C.hash(seed + i * 3.71 + boil * 1.13) - .5;
      const h2 = C.hash(seed + i * 7.13 + boil * 2.7) - .5;
      const rot = (o.rot || 0) + h1 * (o.charRot ?? .035) * (jit ? 1 : 0);
      const dy = h2 * (o.charY ?? size * .012) * (jit ? 1 : 0);
      const localApp = o.perChar ? o.perChar(i, chars.length, ch) : app;
      const sc = .55 + .45 * C.clamp(localApp);
      ctx.save();
      ctx.translate(cx + w / 2, y + dy);
      ctx.rotate(rot);
      ctx.scale(sc, sc);
      ctx.globalAlpha = C.clamp(localApp) * (o.alpha ?? 1);
      if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = size * .22; }
      // shadow
      if (shadow) {
        ctx.fillStyle = shadow;
        ctx.fillText(ch, -w / 2 + shOff, shOff * 1.1);
      }
      // edge
      if (edge && edgeW) {
        ctx.strokeStyle = edge; ctx.lineWidth = edgeW; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
        ctx.strokeText(ch, -w / 2, 0);
      }
      // fill
      if (o.chrome) {
        const g = ctx.createLinearGradient(0, -size * .8, 0, size * .12);
        g.addColorStop(0, o.chrome[0]); g.addColorStop(.45, o.chrome[1]); g.addColorStop(.55, o.chrome[2]); g.addColorStop(1, o.chrome[3] || o.chrome[0]);
        ctx.fillStyle = g;
      } else if (o.grad) {
        const g = ctx.createLinearGradient(0, -size * .9, 0, size * .1);
        o.grad.forEach((c, k) => g.addColorStop(k / (o.grad.length - 1), c));
        ctx.fillStyle = g;
      } else ctx.fillStyle = col;
      ctx.fillText(ch, -w / 2, 0);
      // top highlight
      if (o.highlight) {
        ctx.globalAlpha *= .5; ctx.fillStyle = o.highlight; ctx.fillText(ch, -w / 2, -size * .015);
      }
      ctx.restore();
    }
    cx += w + track;
  }
  ctx.restore();
  return total;
};

/* simple one-line text */
TY.text = function (ctx, str, x, y, size, o = {}) {
  ctx.save();
  TY.set(ctx, size, o.family || 'DMMono', o.weight || '400');
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.baseline || 'alphabetic';
  ctx.fillStyle = o.color || PAL.ink; ctx.globalAlpha = o.alpha ?? 1;
  if (o.letter) { ctx.letterSpacing = o.letter + 'px'; }
  if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.strokeW || 2; ctx.strokeText(str, x, y); }
  ctx.fillText(str, x, y);
  ctx.restore();
};

/* label on a torn paper sticker */
TY.sticker = function (ctx, str, x, y, size, o = {}) {
  const fam = o.family || 'Archivo Black', weight = o.weight || '400';
  const padX = o.padX ?? size * .38, padY = o.padY ?? size * .28;
  const track = o.track ?? 0;
  const tw = TY.width(ctx, str, size, fam, weight, track);
  const w = tw + padX * 2, h = size * 1.12 + padY * 2;
  const rot = o.rot ?? -.05;
  const fill = o.fill || PAL.acid, ink = o.ink || PAL.ink;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, h, o.torn ?? 3.5, o.seed ?? 7), {
    fill, edge: o.edge === undefined ? ink : o.edge, edgeW: o.edgeW ?? 2.2, shadow: C.rgba(PAL.ink, .28), sx: 5, sy: 8
  });
  if (o.tape) {
    ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = PAL.cream;
    ctx.translate(w * .5, -h * .18); ctx.rotate(.08); ctx.fillRect(-38, -9, 76, 20);
    ctx.restore();
  }
  TY.type(ctx, str, w / 2, h * .5 + size * .37, size, {
    family: fam, weight, align: 'center', color: o.text || ink, edge: o.textEdge === undefined ? null : o.textEdge,
    edgeW: o.textEdgeW ?? 0, shadow: o.textShadow === undefined ? null : o.textShadow,
    track, charRot: .012, seed: o.seed ?? 7, jitter: o.jitter ?? 1,
    // A sticker carries the caller's copy flag down to the type it sets, so a
    // label that is the film's words is measured as copy, not as decoration.
    copy: o.copy
  });
  if (o.barcode) {
    ctx.save(); ctx.fillStyle = ink; ctx.globalAlpha = .8;
    let bx = w - padX - 22;
    for (let i = 0; i < 6; i++) { const bw = 1 + (i % 3); ctx.fillRect(bx + i * 4, h - 18, bw, 10); }
    ctx.restore();
  }
  ctx.restore();
  return { w, h };
};

/* text on a circle */
TY.circular = function (ctx, str, cx, cy, r, size, o = {}) {
  const chars = [...str];
  const step = (o.span ?? TAU) / chars.length;
  const start = o.start ?? -Math.PI / 2;
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < chars.length; i++) {
    const a = start + i * step + (o.spin || 0);
    ctx.save(); ctx.rotate(a); ctx.translate(0, -r);
    TY.type(ctx, chars[i], 0, 0, size, {
      family: o.family || 'DMMono', align: 'center', color: o.color || PAL.ink,
      edge: o.edge ?? null, edgeW: 0, shadow: null, jitter: o.jitter ?? 1,
      rot: 0, seed: i * 7, time: o.time || 0, charRot: .01
    });
    ctx.restore();
  }
  ctx.restore();
};

/* vertical type, top to bottom */
TY.vertical = function (ctx, str, x, y, size, o = {}) {
  const chars = [...str];
  const step = o.step ?? size * .92;
  const drift = o.drift ?? 0;
  for (let i = 0; i < chars.length; i++) {
    const app = o.perChar ? o.perChar(i, chars.length) : (o.appear ?? 1);
    if (app <= 0) continue;
    TY.type(ctx, chars[i], x + (o.curve ? Math.sin(i * .5 + (o.time || 0)) * o.curve : 0) + i * drift, y + i * step, size, {
      family: o.family || 'Anton', weight: o.weight || '400', align: 'center', color: o.color || PAL.ink,
      edge: o.edge ?? PAL.cream, edgeW: o.edgeW ?? size * .05, shadow: o.shadow ?? C.rgba(PAL.ink, .25),
      shadowOff: o.shadowOff ?? size * .03, appear: app, rot: o.rot || 0, seed: i * 9, time: o.time || 0,
      charRot: .05, jitter: 1, alpha: o.alpha ?? 1
    });
  }
};

/* subtitle band */
TY.subtitle = function (ctx, line, t, o = {}) {
  if (!line) return;
  const words = line.words || [];
  const active = words.findIndex(w => t >= w.t && t < w.t + (w.d || .5));
  const x = o.x ?? 84, y = o.y ?? 992;
  const size = o.size ?? 31;
  const full = line.text;
  const tw = TY.width(ctx, full, size, 'DMMono', '400', 1);
  const w = Math.min(1300, tw + 96), h = 62;
  ctx.save();
  paper(ctx, () => tornRectPath(ctx, x - 18, y - 44, w + 20, h, 3.5, 31), {
    fill: o.fill || C.rgba(PAL.ink, .92), edge: o.edge ?? null, shadow: C.rgba(PAL.ink, .28), sx: 5, sy: 8
  });
  // rec dot
  ctx.fillStyle = active >= 0 ? PAL.red : PAL.silver;
  ctx.beginPath(); ctx.arc(x + 8, y - 13, 5, 0, TAU); ctx.fill();
  TY.text(ctx, 'LYRIC', x + 20, y - 7, 11, { color: C.rgba(PAL.cream, .55), letter: 1.5 });
  // words
  let cx = x + 64;
  TY.set(ctx, size, 'DMMono', '400');
  for (let i = 0; i < words.length; i++) {
    const word = words[i].w;
    const isA = i === active;
    const ww = ctx.measureText(word).width + 9;
    const app = C.clamp((t - (line.start - .12)) * 4);
    ctx.save();
    ctx.globalAlpha = app;
    ctx.translate(0, isA ? -5 : 0);
    ctx.fillStyle = isA ? PAL.acid : PAL.cream;
    ctx.fillText(word, cx, y);
    if (isA) { ctx.fillStyle = C.rgba(PAL.acid, .25); ctx.fillRect(cx - 2, y + 7, ww - 5, 3); }
    ctx.restore();
    cx += ww;
  }
  // progress hairline
  const p = C.clamp((t - line.start) / Math.max(.1, line.end - line.start));
  ctx.fillStyle = C.rgba(PAL.cream, .16); ctx.fillRect(x + 8, y + 11, w - 40, 2);
  ctx.fillStyle = PAL.red; ctx.fillRect(x + 8, y + 11, (w - 40) * p, 2);
  ctx.restore();
};
