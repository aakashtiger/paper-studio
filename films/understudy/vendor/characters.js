/* ============================================================
   CLAUDE POP — cast v2
   Articulated paper dolls. (x,y) is the ground point.
   Proportions: ground 0, head centre -604, total ~706 units.
   ============================================================ */
const SKIN = '#F0C9A4', SKIN_D = '#D19A72', SKIN_L = '#FFE2C4';
const HAIR = '#171319', HAIR_L = '#332C3E';
const BRASS = '#C68E2E', BRASS_L = '#FFE2A0';

const FLOWERS = {
  sun:    { petal: '#F8E9CA', petal2: '#EAD3A6', tip: '#E8452A', center: '#F0C9A4', hair: HAIR },
  daisy:  { petal: '#FBF4E6', petal2: '#EADFC8', tip: '#F5B93F', center: '#F0C9A4', hair: '#2B2430' },
  poppy:  { petal: '#E8452A', petal2: '#C6331C', tip: '#171310', center: '#1A1518', hair: '#171310' },
  tulip:  { petal: '#FF8FB4', petal2: '#E86A96', tip: '#D62E70', center: '#F0C9A4', hair: '#4A2B32' },
  corn:   { petal: '#5570FF', petal2: '#3D55D9', tip: '#203FD8', center: '#DCE6FF', hair: '#22203A' },
  mari:   { petal: '#F5B93F', petal2: '#E09A22', tip: '#F08A2E', center: '#F0C9A4', hair: '#3A2A20' },
};

function brad(ctx, x, y, r = 4.2, col = BRASS) {
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r);
  g.addColorStop(0, BRASS_L); g.addColorStop(.55, col); g.addColorStop(1, '#7A4E12');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(60,34,8,.55)'; ctx.lineWidth = .9; ctx.stroke();
  ctx.fillStyle = 'rgba(255,247,220,.8)'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .35, r * .24, 0, TAU); ctx.fill();
}

/* tapered paper limb. angle 0 = straight down; + rotates toward +x. */
function limb(ctx, x, y, len, w1, w2, ang, col, edge = C.rgba(PAL.ink, .78), shadow = true) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-w1 / 2, 0);
    ctx.quadraticCurveTo(-w1 * .56, len * .5, -w2 / 2, len - w2 * .42);
    ctx.quadraticCurveTo(-w2 * .46, len, 0, len);
    ctx.quadraticCurveTo(w2 * .46, len, w2 / 2, len - w2 * .42);
    ctx.quadraticCurveTo(w1 * .56, len * .5, w1 / 2, 0);
    ctx.closePath();
  };
  if (shadow) {
    ctx.save(); ctx.translate(3, 5); ctx.fillStyle = C.rgba(PAL.ink, .14); path(); ctx.fill(); ctx.restore();
  }
  path(); ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = edge; ctx.lineWidth = 2.1; ctx.stroke();
  ctx.strokeStyle = C.rgba('#FFFFFF', .35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w1*.22, len*.12); ctx.quadraticCurveTo(-w2*.26, len*.6, -w2*.2, len*.86); ctx.stroke();
  ctx.save(); path(); ctx.clip();
  const g = ctx.createLinearGradient(-w1 / 2, 0, w1 / 2, 0);
  g.addColorStop(0, 'rgba(255,255,255,.2)'); g.addColorStop(.4, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.12)');
  ctx.fillStyle = g; ctx.fillRect(-w1, 0, w1 * 2, len + 2); ctx.restore();
  ctx.restore();
  return [x - Math.sin(ang) * len, y + Math.cos(ang) * len];
}

/* Two-bone leg IK: hip + ankle target -> [hip angle, knee bend, shin angle].
   Keeps a planted foot exactly where the pose asks for it. */
function solveLeg(hipX, hipY, targetX, targetY, l1, l2, side) {
  const dx = targetX - hipX, dy = targetY - hipY;
  let d = Math.hypot(dx, dy);
  d = Math.max(Math.abs(l1 - l2) + 0.001, Math.min(l1 + l2 - 0.001, d));
  const base = Math.atan2(-dx, dy);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const sign = side < 0 ? 1 : -1;
  const hipAngle = base + sign * A;
  const kneeX = hipX - Math.sin(hipAngle) * l1;
  const kneeY = hipY + Math.cos(hipAngle) * l1;
  const shinAngle = Math.atan2(-(targetX - kneeX), targetY - kneeY);
  return { hipAngle, kneeBend: shinAngle - hipAngle, shinAngle, kneeX, kneeY };
}

/* platform boot, drawn around the ankle. angle matches the shin. */
function boot(ctx, x, y, ang, col = PAL.blue, sole = PAL.cream, gold = PAL.gold) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang * .55);
  // ankle shaft
  paper(ctx, () => roundRectPath(ctx, -13, -16, 26, 38, 7), { fill: col, edge: C.rgba(PAL.ink, .7), edgeW: 2, shadow: C.rgba(PAL.ink, .16), sx: 2, sy: 4 });
  // foot
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-16, 12); ctx.lineTo(14, 12); ctx.quadraticCurveTo(30, 16, 30, 30); ctx.lineTo(-18, 30); ctx.quadraticCurveTo(-22, 18, -16, 12); ctx.closePath(); }, { fill: col, edge: C.rgba(PAL.ink, .7), edgeW: 2 });
  // platform sole
  paper(ctx, () => roundRectPath(ctx, -20, 28, 52, 13, 4), { fill: sole, edge: C.rgba(PAL.ink, .65), edgeW: 1.8, shadow: C.rgba(PAL.ink, .2), sx: 1, sy: 3 });
  ctx.fillStyle = gold; ctx.fillRect(-15, 33, 42, 2.5);
  // laces
  ctx.strokeStyle = C.rgba(PAL.cream, .7); ctx.lineWidth = 1.4;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-9, -6 + i * 7); ctx.lineTo(8, -6 + i * 7); ctx.stroke(); }
  ctx.restore();
}

/* pleated mini skirt. waist at y=0 in local space. */
function pleatedSkirt(ctx, x, y, sway, main = PAL.blue, under = PAL.cream, len = 152) {
  const wTop = 32, wBot = 76;
  ctx.save(); ctx.translate(x, y);
  const n = 11;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), u2 = (i + 1) / (n - 1);
    const x1 = C.lerp(-wTop, wTop, u), x2 = C.lerp(-wTop, wTop, u2);
    const xb1 = C.lerp(-wBot, wBot, u) + sway * (1 + u * .18);
    const xb2 = C.lerp(-wBot, wBot, u2) + sway * (1 + u2 * .18);
    ctx.beginPath();
    ctx.moveTo(x1, 0); ctx.lineTo(x2, 0);
    ctx.lineTo(xb2 + 5, len + Math.sin(u2 * 8) * 2);
    ctx.lineTo(xb1 - 5, len + Math.sin(u * 8) * 2);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? main : C.shade(main, -16);
    ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, .2); ctx.lineWidth = 1; ctx.stroke();
  }
  // cream under-layer peeking below
  ctx.beginPath();
  ctx.moveTo(-wBot + sway - 2, len - 10);
  ctx.quadraticCurveTo(sway, len + 6, wBot + sway + 2, len - 10);
  ctx.lineTo(wBot + sway, len + 4);
  ctx.quadraticCurveTo(sway, len + 20, -wBot + sway, len + 4);
  ctx.closePath();
  ctx.fillStyle = under; ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1.2; ctx.stroke();
  // waistband
  paper(ctx, () => roundRectPath(ctx, -35, -12, 70, 16, 3), { fill: main, edge: C.rgba(PAL.ink, .6), edgeW: 1.5 });
  ctx.fillStyle = PAL.gold; ctx.fillRect(-3.5, -11, 7, 13);
  ctx.restore();
}

/* cropped varsity jacket torso. shoulders at -170 relative to waist, waist at 0. */
function varsityTorso(ctx, main, sleeve, accent = PAL.gold) {
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-47, -182);
    ctx.quadraticCurveTo(-58, -120, -40, -6);
    ctx.lineTo(-30, 8); ctx.lineTo(30, 8); ctx.lineTo(40, -6);
    ctx.quadraticCurveTo(58, -120, 47, -182);
    ctx.quadraticCurveTo(0, -200, -47, -182);
    ctx.closePath();
  };
  paper(ctx, path, { fill: main, edge: C.rgba(PAL.ink, .75), edgeW: 2.6, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
  // open front showing cream top
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-13, -180); ctx.quadraticCurveTo(-20, -120, -14, -4); ctx.lineTo(14, -4); ctx.quadraticCurveTo(20, -120, 13, -180); ctx.closePath(); }, { fill: PAL.cream, edge: C.rgba(PAL.ink, .45), edgeW: 1.2 });
  // collar wings
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * 44, -184); ctx.lineTo(sx * 16, -148); ctx.lineTo(sx * 6, -176); ctx.closePath();
    ctx.fillStyle = PAL.cream; ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, .55); ctx.lineWidth = 1.4; ctx.stroke();
  }
  // gold ribbed hem + cuffs on torso
  ctx.save(); ctx.beginPath(); ctx.rect(-34, -8, 68, 18); ctx.clip();
  for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? accent : C.shade(accent, -22); ctx.fillRect(-34 + i * 6, -8, 6, 18); }
  ctx.restore();
  ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 1.2; ctx.strokeRect(-34, -8, 68, 18);
  // patch
  ctx.save(); ctx.translate(-27, -124); ctx.rotate(-.06);
  paper(ctx, () => roundRectPath(ctx, -14, -10, 28, 20, 3), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.2 });
  ctx.restore();
}

/* sunflower / flower head. centre is (0,0). */
function flowerHead(ctx, o, t) {
  const F = o.flower || FLOWERS.sun;
  const n = o.petals ?? 22;
  const spin = o.spin || 0;
  const pulse = 1 + .045 * C.bpmPulse(t || 0, 4);
  const r0 = (o.r0 || 24), r1 = (o.r1 || 146) * pulse;
  if (o.halo) {
    ctx.save(); ctx.globalAlpha = o.halo;
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r1 + 16, 0, TAU); ctx.stroke();
    ctx.strokeStyle = C.rgba(PAL.cream, .55); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, r1 + 23, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  ctx.save(); ctx.rotate(spin);
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU;
    const len = r1 * (1 + (C.hash(i * 4.1 + (o.seed || 0)) - .5) * .09);
    const w = 19 + (C.hash(i * 7.3) - .5) * 5;
    const fill = i % 2 ? F.petal : F.petal2;
    ctx.save(); ctx.rotate(a);
    paper(ctx, () => petalPath(ctx, 0, 0, -Math.PI / 2, r0, len, w, i), {
      fill, edge: C.rgba(PAL.ink, .32), edgeW: 1.3, shadow: C.rgba(PAL.ink, .13), sx: 1.5, sy: 3
    });
    // crease
    ctx.strokeStyle = C.rgba(PAL.ink, .12); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -r0 - 4); ctx.lineTo(0, -len + 10); ctx.stroke();
    // painted tip, clipped to the petal silhouette
    ctx.save();
    petalPath(ctx, 0, 0, -Math.PI / 2, r0, len, w, i);
    ctx.clip();
    ctx.fillStyle = F.tip; ctx.globalAlpha = .95;
    ctx.fillRect(-w * 2, -len, w * 4, 26);
    ctx.restore();
    ctx.restore();
  }
  ctx.restore();
}

/* face. centre (0,0). */
function face(ctx, o, t) {
  const f = o.face || {};
  const eyes = f.eyes || 'normal';
  const mouth = f.mouth || 'smile';
  const blush = f.blush ?? .5;
  const look = f.look || [0, 0];
  const blink = f.blink ?? 0;
  const sing = f.sing ?? 0;
  const F = o.flower || FLOWERS.sun;
  // face plate
  paper(ctx, () => blobPath(ctx, 0, 0, 41, 47, 18, .015, 7), {
    fill: o.skin || SKIN, edge: C.rgba(PAL.ink, .62), edgeW: 2.1, shadow: C.rgba(PAL.ink, .14), sx: 2.5, sy: 4.5
  });
  // ears
  for (const sx of [-1, 1]) {
    ctx.fillStyle = o.skin || SKIN; ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.ellipse(sx * 41, 3, 5.5, 9, 0, 0, TAU); ctx.fill(); ctx.stroke();
  }
  // blush
  if (blush > 0) {
    ctx.save(); ctx.globalAlpha = blush * .55;
    for (const sx of [-1, 1]) {
      ctx.fillStyle = '#F08A8A';
      ctx.beginPath(); ctx.ellipse(sx * 25, 19, 10, 4.6, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#D96A6A'; ctx.lineWidth = .8;
      for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(sx * 25 + k * 4 - 2, 17); ctx.lineTo(sx * 25 + k * 4 + 2, 21); ctx.stroke(); }
    }
    ctx.restore();
  }
  const ex = 17.5, ey = -3;
  const drawEye = (sx) => {
    ctx.save(); ctx.translate(sx * ex, ey); ctx.scale(sx, 1);
    if (eyes === 'closed' || eyes === 'happy' || blink > .5) {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, 10.5, .12 * Math.PI, .88 * Math.PI); ctx.stroke();
      if (eyes === 'happy') { ctx.beginPath(); ctx.arc(0, 4, 8.5, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
    } else if (eyes === 'wink') {
      if (sx < 0) { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 9.5, .12 * Math.PI, .88 * Math.PI); ctx.stroke(); }
      else {
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(1, 0, 7.5, 10.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(3, -4, 2.3, 0, TAU); ctx.fill();
      }
    } else if (eyes === 'heart') {
      heartPath(ctx, 0, 0, 10.5); ctx.fillStyle = PAL.red; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
    } else if (eyes === 'star') {
      starPath(ctx, 0, 0, 11.5, .45, 5); ctx.fillStyle = PAL.ink; ctx.fill();
      ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(2, -3, 2.1, 0, TAU); ctx.fill();
    } else if (eyes === 'swirl') {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i < 26; i++) { const a = i * .5, r = i * .52; i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(0, 0); }
      ctx.stroke();
    } else if (eyes === 'narrow') {
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, 2, 10.5, 4.6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(3, 0, 1.7, 0, TAU); ctx.fill();
    } else if (eyes === 'x') {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.moveTo(-6.5, -6.5); ctx.lineTo(6.5, 6.5); ctx.moveTo(6.5, -6.5); ctx.lineTo(-6.5, 6.5); ctx.stroke();
    } else if (eyes === 'spiral') {
      ctx.strokeStyle = PAL.redD; ctx.lineWidth = 1.9; ctx.beginPath();
      for (let i = 0; i < 34; i++) { const a = i * .42, r = i * .36; i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(0, 0); }
      ctx.stroke();
    } else {
      // almond eye
      ctx.beginPath();
      ctx.moveTo(-11.5, 2); ctx.quadraticCurveTo(-3, -12.5, 11.5, -1.5);
      ctx.quadraticCurveTo(2, 10.5, -11.5, 2); ctx.closePath();
      ctx.fillStyle = '#FFF9EF'; ctx.fill();
      ctx.save(); ctx.clip();
      const ix = look[0] * 3.6, iy = look[1] * 2.8;
      const iris = f.iris || '#4A2A18';
      const g = ctx.createRadialGradient(ix, iy + 1, 1, ix, iy + 1, 10);
      g.addColorStop(0, C.shade(iris, 34)); g.addColorStop(.6, iris); g.addColorStop(1, '#120B08');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ix, iy + 1, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = '#0B0706'; ctx.beginPath(); ctx.arc(ix, iy + 1, 4.4, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.97)'; ctx.beginPath(); ctx.arc(ix + 3, iy - 3, 2.6, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(ix - 3.2, iy + 3.4, 1.15, 0, TAU); ctx.fill();
      // eyeshadow haze
      const eg = ctx.createLinearGradient(0, -12, 0, -2);
      eg.addColorStop(0, C.rgba(PAL.pink, .38)); eg.addColorStop(1, C.rgba(PAL.pink, 0));
      ctx.fillStyle = eg; ctx.fillRect(-12, -13, 24, 12);
      ctx.restore();
      // upper lash
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.5; ctx.beginPath();
      ctx.moveTo(-11.5, 2); ctx.quadraticCurveTo(-3, -12.5, 11.5, -1.5); ctx.stroke();
      // flick
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.9; ctx.beginPath(); ctx.moveTo(10, -1.5); ctx.lineTo(16, -6.5); ctx.stroke();
      // lower lash
      ctx.strokeStyle = C.rgba(PAL.ink, .45); ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(-8, 4.5); ctx.quadraticCurveTo(0, 8.5, 8, 2); ctx.stroke();
    }
    ctx.restore();
  };
  drawEye(-1); drawEye(1);
  // brows
  if (f.brows !== false) {
    ctx.strokeStyle = C.rgba(PAL.ink, .78); ctx.lineWidth = f.browW || 2;
    const by = ey - 16.5 + (f.browY || 0);
    ctx.beginPath(); ctx.moveTo(-27, by + 1 + (f.browL || 0)); ctx.quadraticCurveTo(-18, by - 3.5, -8, by + .5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, by + .5); ctx.quadraticCurveTo(18, by - 3.5, 27, by + 1 + (f.browR || 0)); ctx.stroke();
  }
  // nose
  ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.moveTo(.5, 11); ctx.quadraticCurveTo(3, 16, .5, 17); ctx.stroke();
  // mouth
  const my = 32;
  ctx.save(); ctx.translate(0, my);
  if (mouth === 'sing' || sing > .25) {
    const open = C.lerp(2, 8.5, C.clamp(sing));
    ctx.fillStyle = '#8E2430'; ctx.beginPath(); ctx.ellipse(0, 0, 6.4, open, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#E77A86'; ctx.beginPath(); ctx.ellipse(0, open * .42, 4, open * .42, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.beginPath(); ctx.ellipse(-1.8, -open * .45, 2.4, .9, -.3, 0, TAU); ctx.fill();
  } else if (mouth === 'grin') {
    ctx.fillStyle = '#8E2430'; ctx.beginPath(); ctx.arc(0, -2, 8.4, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.fillRect(-6.5, -2, 13, 3.2);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -2, 8.4, 0, Math.PI); ctx.stroke();
  } else if (mouth === 'o') {
    ctx.fillStyle = '#8E2430'; ctx.beginPath(); ctx.ellipse(0, 0, 4.2, 5.2, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.2; ctx.stroke();
  } else if (mouth === 'flat') {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5.5, 0); ctx.lineTo(5.5, 0); ctx.stroke();
  } else if (mouth === 'pout') {
    ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.ellipse(0, 0, 4.8, 3.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-1.2, -1, 2, .8, 0, 0, TAU); ctx.fill();
  } else if (mouth === 'wobble') {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.9; ctx.beginPath();
    ctx.moveTo(-6.5, 0); ctx.quadraticCurveTo(-3, 3.6, 0, 0); ctx.quadraticCurveTo(3, -3.6, 6.5, 0); ctx.stroke();
  } else {
    ctx.fillStyle = '#A62A36'; ctx.beginPath(); ctx.moveTo(-7, -1); ctx.quadraticCurveTo(0, 3.6, 7, -1); ctx.quadraticCurveTo(0, 9, -7, -1); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(-1.5, 4.4, 2.6, .9, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

/* hair back = a soft bob silhouette behind the face. centre (0,0). */
function hairBack(ctx, col, len = 120) {
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-46, -6);
    ctx.quadraticCurveTo(-58, -60, -34, -82);
    ctx.quadraticCurveTo(-16, -96, 0, -94);
    ctx.quadraticCurveTo(16, -96, 38, -82);
    ctx.quadraticCurveTo(58, -60, 46, -6);
    ctx.lineTo(40, 62);
    ctx.quadraticCurveTo(26, 40, 0, 44);
    ctx.quadraticCurveTo(-26, 40, -40, 62);
    ctx.closePath();
  };
  paper(ctx, path, { fill: col, edge: C.rgba(PAL.ink, .75), edgeW: 2.2, shadow: C.rgba(PAL.ink, .16), sx: 2.5, sy: 5 });
  // long side strands
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * 44, -60);
    ctx.quadraticCurveTo(sx * 60, 20, sx * 48, len);
    ctx.lineTo(sx * 30, len + 6);
    ctx.quadraticCurveTo(sx * 38, 20, sx * 26, -40);
    ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, .6); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.strokeStyle = C.rgba('#8D8AAE', .22); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sx * 40, -34); ctx.quadraticCurveTo(sx * 48, 40, sx * 38, len - 12); ctx.stroke();
  }
}

/* curtain bangs + crown volume, in front of face. centre (0,0). */
function bangs(ctx, col) {
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-53, -8);
    ctx.quadraticCurveTo(-58, -72, -20, -88);
    ctx.quadraticCurveTo(0, -95, 20, -88);
    ctx.quadraticCurveTo(58, -72, 53, -8);
    ctx.lineTo(44, -14);
    ctx.quadraticCurveTo(34, -46, 8, -50);
    ctx.quadraticCurveTo(4, -30, 2, -12);
    ctx.quadraticCurveTo(0, -8, -2, -12);
    ctx.quadraticCurveTo(-4, -30, -8, -50);
    ctx.quadraticCurveTo(-34, -46, -44, -14);
    ctx.closePath();
  };
  paper(ctx, path, { fill: col, edge: C.rgba(PAL.ink, .68), edgeW: 2, shadow: C.rgba(PAL.ink, .12), sx: 2, sy: 4 });
  // side curtains
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * 42, -56);
    ctx.quadraticCurveTo(sx * 56, -18, sx * 46, 30);
    ctx.quadraticCurveTo(sx * 38, -8, sx * 28, -46);
    ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1.4; ctx.stroke();
  }
  // shine
  ctx.strokeStyle = C.rgba('#9D96C4', .55); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-30, -58); ctx.quadraticCurveTo(-12, -72, 6, -64); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, -62); ctx.quadraticCurveTo(28, -56, 34, -44); ctx.stroke();
}

/* ------------------------------------------------------------
   SOL — sunflower idol
   pose: bounce sway lean headTilt headTurn hairSwing petalDrift
         armL [upper,fore] armR ... legL legR  (absolute radians, + = her right)
   ------------------------------------------------------------ */
function idol(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  const p = o.pose || {};
  const F = o.flower || FLOWERS.sun;
  const outfit = o.outfit || 'stage';
  const col = o.colors || {};
  const skin = col.skin || SKIN;
  const hair = col.hair || F.hair;
  const jacket = col.jacket || PAL.red;
  const sleeve = col.sleeve || PAL.cream;
  const skirt = col.skirt || PAL.blue;
  const bootCol = col.boot || PAL.blue;
  const bounce = p.bounce || 0, sway = p.sway || 0, lean = p.lean || 0;
  const armL = p.armL || [.14, .06], armR = p.armR || [-.14, -.06];
  const legL = p.legL || [.035, .015], legR = p.legR || [-.035, -.015];
  const headTilt = p.headTilt || 0, headTurn = p.headTurn || 0;
  const flip = o.flip || 1;
  const shadow = o.shadow ?? 1;
  const HIP = -306, SHOULDER = -500, HEAD = -604;
  const showEyes = o.eyeGlow || .9;

  ctx.save();
  ctx.translate(x, y);
  if (shadow) shadowEllipse(ctx, 0, 0, 46 * s, 10 * s, .22);
  ctx.scale(flip * s, s);

  // long hair behind everything
  ctx.save();
  ctx.translate(0, HEAD + bounce); ctx.rotate(headTilt * .45 + headTurn * .1);
  for (let i = 0; i < 4; i++) {
    const sx = (i - 1.5) * 17;
    const len = 150 + C.hash(i * 3.3) * 46;
    const sway = Math.sin(t * 1.8 + i) * 8 + (p.hairSwing || 0);
    ctx.beginPath();
    ctx.moveTo(sx - 8, -6);
    ctx.quadraticCurveTo(sx + sway - 12, len * .55, sx + sway - 2, len);
    ctx.lineTo(sx + sway + (i % 2 === 0 ? 1 : -1), len + 26 + C.hash(i * 7.7) * 18);
    ctx.lineTo(sx + sway + 3, len);
    ctx.quadraticCurveTo(sx + sway + 12, len * .55, sx + 8, -6);
    ctx.closePath();
    ctx.fillStyle = hair; ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.restore();

  // far arm (behind torso); must inherit the torso lean like the near arm
  ctx.save();
  ctx.translate(0, bounce);
  ctx.translate(0, -334); ctx.rotate(lean); ctx.translate(0, 334);
  drawArm(-1, armL, true);
  ctx.restore();

  // legs
  drawLeg(-1, legL, true);
  drawLeg(1, legR, false);
  function drawLeg(side, ang, far) {
    const hx = side * 16, hy = HIP + bounce;
    const target = side < 0 ? p.footL : p.footR;
    const pitch = (side < 0 ? p.footPitchL : p.footPitchR) || 0;
    let a1 = ang[0], a2 = ang[1], foot = ang[0] + ang[1] + pitch;
    if (Array.isArray(target)) {
      const sol = solveLeg(hx, hy, target[0], target[1], 158, 118, side);
      a1 = sol.hipAngle; a2 = sol.kneeBend; foot = sol.shinAngle + pitch;
    }
    const knee = limb(ctx, hx, hy, 158, 30, 24, a1, far ? C.shade(skin, -18) : skin, C.rgba(PAL.ink, .5), true);
    const ankle = limb(ctx, knee[0], knee[1], 118, 23, 18, a1 + a2, far ? C.shade(skin, -18) : skin, C.rgba(PAL.ink, .5), true);
    brad(ctx, hx, hy, 4.4);
    brad(ctx, knee[0], knee[1], 3.6);
    boot(ctx, ankle[0], ankle[1] - 2, foot, far ? C.shade(bootCol, -18) : bootCol, PAL.cream, PAL.gold);
  }

  // skirt
  ctx.save(); ctx.translate(0, -334 + bounce); ctx.rotate(lean * .25);
  pleatedSkirt(ctx, 0, 0, sway, outfit === 'gym' ? PAL.mint : skirt, PAL.cream, outfit === 'gym' ? 120 : 148);
  ctx.restore();

  // torso group (leans from waist)
  ctx.save(); ctx.translate(0, -334 + bounce); ctx.rotate(lean); ctx.translate(0, 334);

  // neck
  ctx.fillStyle = C.shade(skin, -8);
  ctx.beginPath(); ctx.moveTo(-9, -566); ctx.lineTo(9, -566); ctx.lineTo(11, -512); ctx.lineTo(-11, -512); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 1.2; ctx.stroke();

  // garments are authored relative to the waist (0 = waist, -182 = shoulder line)
  ctx.save();
  ctx.translate(0, -334);
  if (outfit === 'gym') {
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-42, -178); ctx.quadraticCurveTo(-52, -106, -34, 4); ctx.lineTo(34, 4); ctx.quadraticCurveTo(52, -106, 42, -178); ctx.quadraticCurveTo(0, -192, -42, -178); ctx.closePath(); }, { fill: PAL.mint, edge: C.rgba(PAL.ink, .65), edgeW: 2.4, shadow: C.rgba(PAL.ink, .18), sx: 4, sy: 7 });
    ctx.fillStyle = PAL.cream; ctx.fillRect(-38, -86, 76, 7);
    ctx.fillStyle = PAL.blue; ctx.fillRect(-38, -76, 76, 3);
    ctx.save(); ctx.translate(0, -48);
    paper(ctx, () => roundRectPath(ctx, -22, -18, 44, 38, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.2 });
    TY.text(ctx, '042', 0, 8, 20, { family: 'DMMono', color: PAL.red, align: 'center' });
    ctx.restore();
  } else if (outfit === 'jazz' || outfit === 'gown') {
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-42, -178); ctx.quadraticCurveTo(-52, -106, -32, -2); ctx.lineTo(32, -2); ctx.quadraticCurveTo(52, -106, 42, -178); ctx.quadraticCurveTo(0, -192, -42, -178); ctx.closePath(); }, { fill: outfit === 'gown' ? PAL.redD : PAL.blueD, edge: C.rgba(PAL.ink, .7), edgeW: 2.4, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 7 });
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-22 + i * 7.5, -136); ctx.lineTo(-28 + i * 8, -6); ctx.stroke(); }
  } else if (outfit === 'hazard') {
    varsityTorso(ctx, PAL.gold, PAL.ink, PAL.ink);
    ctx.save(); ctx.beginPath(); ctx.rect(-46, -118, 92, 22); ctx.clip();
    for (let i = -4; i < 8; i++) { ctx.fillStyle = i % 2 ? PAL.ink : PAL.gold; ctx.beginPath(); ctx.moveTo(i * 18, -118); ctx.lineTo(i * 18 + 10, -118); ctx.lineTo(i * 18 - 10, -96); ctx.lineTo(i * 18 - 20, -96); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  } else if (outfit === 'stage') {
    varsityTorso(ctx, jacket, sleeve, PAL.gold);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-15, -176); ctx.lineTo(-18, -120); ctx.quadraticCurveTo(0, -102, 18, -120); ctx.lineTo(15, -176); ctx.closePath(); }, { fill: PAL.chrome, edge: PAL.ink, edgeW: 1.2 });
  } else {
    varsityTorso(ctx, jacket, sleeve, PAL.gold);
  }
  ctx.restore();

  // shoulder brads
  brad(ctx, -45, -516, 4.6); brad(ctx, 45, -516, 4.6);
  // collar necklace
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(-13, -534, 26, 10);
  ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(0, -528, 17, .18 * Math.PI, .82 * Math.PI); ctx.stroke();
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -509, 3, 0, TAU); ctx.fill();

  // head
  ctx.save();
  ctx.translate(0, -530); ctx.rotate(headTilt + headTurn * .16); ctx.translate(0, 530);
  ctx.save(); ctx.translate(0, HEAD);
  flowerHead(ctx, { flower: F, petals: o.petals, halo: o.halo, spin: (o.petalSpin || 0) + (p.petalDrift || 0), seed: o.seed || 0, r0: o.flowerR0, r1: o.flowerR1 }, t);
  ctx.restore();
  ctx.save(); ctx.translate(0, HEAD);
  hairBack(ctx, hair, 118);
  face(ctx, { face: o.face, skin, flower: F, seeds: o.seeds }, t);
  bangs(ctx, hair);
  // earrings
  if (o.earrings !== false) {
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2.4;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 43, 16, 7, 0, TAU); ctx.stroke(); ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(sx * 43, 23, 2.4, 0, TAU); ctx.fill(); }
  }
  if (o.crown) crown(ctx, 0, -86, .8);
  if (o.hood) {
    ctx.fillStyle = C.rgba(PAL.blueD, .9); ctx.beginPath(); ctx.arc(0, -4, 88, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(62, 88); ctx.lineTo(-62, 88); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.5; ctx.stroke();
  }
  if (o.mask) {
    ctx.save(); ctx.rotate(-.06);
    paper(ctx, () => blobPath(ctx, 0, 0, 42, 20, 12, .04, 3), { fill: PAL.ink, edge: PAL.gold, edgeW: 1.2 });
    ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.ellipse(-14, 0, 7, 3.5, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(14, 0, 7, 3.5, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.restore(); // face group at HEAD
  ctx.restore(); // head pivot (closes neck rotation before near arm)

  drawArm(1, armR, false);

  function drawArm(side, ang, far) {
    const sx = side * 45, sy = -516;
    const a1 = ang[0], a2 = ang[1];
    const sleeveCol = far ? C.shade(sleeve, -16) : sleeve;
    const elbow = limb(ctx, sx, sy, 104, 23, 19, a1, sleeveCol, C.rgba(PAL.ink, .65), true);
    // racing stripe down the sleeve
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(a1);
    ctx.strokeStyle = far ? C.shade(jacket, -12) : jacket; ctx.lineWidth = 6; ctx.globalAlpha = .9;
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, 96); ctx.stroke(); ctx.restore();
    // shoulder cap
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(a1);
    paper(ctx, () => blobPath(ctx, 0, 6, 14, 17, 10, .04, 3), { fill: far ? C.shade(jacket, -14) : jacket, edge: C.rgba(PAL.ink, .55), edgeW: 1.6 });
    ctx.fillStyle = PAL.gold; ctx.fillRect(-10, 14, 20, 3);
    ctx.restore();
    brad(ctx, sx, sy, 4.2);
    brad(ctx, elbow[0], elbow[1], 3.4);
    const wrist = limb(ctx, elbow[0], elbow[1], 88, 18, 14, a1 + a2, sleeveCol, C.rgba(PAL.ink, .65), true);
    // cuff
    ctx.save(); ctx.translate(wrist[0], wrist[1]); ctx.rotate(a1 + a2);
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(-8, -4, 16, 7);
    ctx.fillStyle = PAL.gold; ctx.fillRect(-8, 1, 16, 2);
    ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1; ctx.strokeRect(-8, -4, 16, 7);
    // hand
    paper(ctx, () => blobPath(ctx, 0, 12, 11, 16, 11, .08, 5), { fill: far ? C.shade(skin, -16) : skin, edge: C.rgba(PAL.ink, .55), edgeW: 1.5 });
    paper(ctx, () => blobPath(ctx, 9, 18, 5, 8, 5, .1, 4), { fill: far ? C.shade(skin, -16) : skin, edge: C.rgba(PAL.ink, .5), edgeW: 1.2 });
    ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(4, 8); ctx.stroke();
    // thumb
    ctx.fillStyle = far ? C.shade(skin, -16) : skin;
    ctx.strokeStyle = C.rgba(PAL.ink, .35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(side * 8, 7, 3.8, 5.6, side * .5, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
    brad(ctx, wrist[0], wrist[1], 3);
  }

  if (o.mic) {
    const w = [45 + Math.sin(armR[0]) * 104 + Math.sin(armR[0] + armR[1]) * 88, -512 + Math.cos(armR[0]) * 104 + Math.cos(armR[0] + armR[1]) * 88];
    ctx.save(); ctx.translate(w[0], w[1] - 26); ctx.rotate(-.2);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
    paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 0, 8, 12, 0, 0, TAU); }, { fill: PAL.silver, edge: PAL.ink, edgeW: 1.4 });
    ctx.restore();
  }
  ctx.restore(); // torso
  ctx.restore(); // outer
}

function crown(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const path = () => { ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-40, -34); ctx.lineTo(-18, -18); ctx.lineTo(0, -44); ctx.lineTo(18, -18); ctx.lineTo(40, -34); ctx.lineTo(34, 0); ctx.closePath(); };
  paper(ctx, path, { fill: PAL.gold, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, .2), sx: 2, sy: 4 });
  for (const px of [-28, 0, 28]) { ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.arc(px, -6, 3.2, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* ------------------------------------------------------------
   MIRA — the researcher. ground 0, head -536, total ~610.
   ------------------------------------------------------------ */
function mira(ctx, x, y, s, o = {}) {
  const t = o.t || 0, p = o.pose || {}, f = o.face || {};
  const flip = o.flip || 1;
  const bounce = p.bounce || 0, sway = p.sway || 0, lean = p.lean || 0;
  const armL = p.armL || [.16, .08], armR = p.armR || [-.16, -.08];
  const legL = p.legL || [.03, .01], legR = p.legR || [-.03, -.01];
  const headTilt = p.headTilt || 0;
  const HIP = -272, SHOULDER = -452, HEAD = -518;
  const coat = o.coat === false ? null : (o.coatCol || PAL.cream);
  const skin = o.skin || SKIN;
  const trouser = o.trouser || PAL.blueD;
  const hairCol = o.hair || PAL.ink;

  ctx.save();
  ctx.translate(x, y);
  if (o.shadow !== 0) shadowEllipse(ctx, 0, 0, 40 * s, 9 * s, .22);
  ctx.scale(flip * s, s);

  // far arm; must inherit the torso lean like the near arm
  ctx.save();
  ctx.translate(0, bounce);
  ctx.translate(0, -270); ctx.rotate(lean); ctx.translate(0, 270);
  drawArm(-1, armL, true);
  ctx.restore();

  // legs
  drawLeg(-1, legL, true);
  drawLeg(1, legR, false);
  function drawLeg(side, ang, far) {
    const hx = side * 14, hy = HIP + bounce;
    const target = side < 0 ? p.footL : p.footR;
    const pitch = (side < 0 ? p.footPitchL : p.footPitchR) || 0;
    let a1 = ang[0], a2 = ang[1], foot = ang[0] + ang[1] + pitch;
    if (Array.isArray(target)) {
      const sol = solveLeg(hx, hy, target[0], target[1], 156, 117, side);
      a1 = sol.hipAngle; a2 = sol.kneeBend; foot = sol.shinAngle + pitch;
    }
    const knee = limb(ctx, hx, hy, 156, 25, 20, a1, far ? C.shade(trouser, -12) : trouser, C.rgba(PAL.ink, .5), true);
    const ankle = limb(ctx, knee[0], knee[1], 117, 20, 16, a1 + a2, far ? C.shade(trouser, -12) : trouser, C.rgba(PAL.ink, .5), true);
    brad(ctx, hx, hy, 3.4); brad(ctx, knee[0], knee[1], 2.8);
    // sneaker
    ctx.save(); ctx.translate(ankle[0] + 4, ankle[1] - 2); ctx.rotate(foot * .5);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-14, -8); ctx.lineTo(10, -8); ctx.quadraticCurveTo(24, -2, 24, 10); ctx.lineTo(-14, 10); ctx.closePath(); }, { fill: far ? C.shade(PAL.cream, -10) : PAL.cream, edge: PAL.ink, edgeW: 1.8, shadow: C.rgba(PAL.ink, .16), sx: 2, sy: 3 });
    ctx.fillStyle = PAL.red; ctx.fillRect(-10, 4, 26, 3);
    ctx.restore();
  }

  // torso
  ctx.save(); ctx.translate(0, -270 + bounce); ctx.rotate(lean); ctx.translate(0, 270);
  // tee
  ctx.fillStyle = PAL.ink;
  ctx.beginPath(); ctx.moveTo(-35, -452); ctx.quadraticCurveTo(-42, -370, -30, -268); ctx.lineTo(30, -268); ctx.quadraticCurveTo(42, -370, 35, -452); ctx.closePath(); ctx.fill();
  // shirt collar + tie
  ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.moveTo(-16, -450); ctx.lineTo(0, -424); ctx.lineTo(16, -450); ctx.lineTo(0, -460); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.blue; ctx.beginPath(); ctx.moveTo(-10, -430); ctx.lineTo(0, -404); ctx.lineTo(10, -430); ctx.lineTo(0, -438); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(-5, -406); ctx.lineTo(5, -406); ctx.lineTo(8, -352); ctx.lineTo(0, -340); ctx.lineTo(-8, -352); ctx.closePath(); ctx.fill();
  // lab coat (open, over black tee)
  if (coat) {
    for (const sx of [-1, 1]) {
      ctx.save(); ctx.scale(sx, 1);
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(10, -456);
        ctx.quadraticCurveTo(38, -462, 44, -446);
        ctx.quadraticCurveTo(54, -380, 48, -196);
        ctx.lineTo(36, -182); ctx.lineTo(14, -190); ctx.lineTo(12, -250);
        ctx.quadraticCurveTo(20, -360, 10, -456);
        ctx.closePath();
      };
      paper(ctx, path, { fill: coat, edge: C.rgba(PAL.ink, .7), edgeW: 2.4, shadow: C.rgba(PAL.ink, .18), sx: 4, sy: 7 });
      // lapel
      ctx.beginPath();
      ctx.moveTo(12, -456); ctx.lineTo(34, -436); ctx.lineTo(22, -394); ctx.lineTo(12, -404);
      ctx.closePath(); ctx.fillStyle = C.shade(coat, -12); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1; ctx.stroke();
      // pocket
      ctx.strokeStyle = C.rgba(PAL.ink, .26); ctx.lineWidth = 1.1; ctx.strokeRect(24, -296, 17, 15);
      ctx.restore();
    }
    // belt
    ctx.fillStyle = PAL.blueD; ctx.fillRect(-34, -310, 68, 10);
    ctx.fillStyle = PAL.gold; ctx.fillRect(-6, -312, 12, 14);
    ctx.strokeStyle = C.rgba(PAL.ink, .5); ctx.lineWidth = 1; ctx.strokeRect(-34, -310, 68, 10);
    // pens
    ctx.fillStyle = PAL.red; ctx.fillRect(34, -338, 3, 16);
    ctx.fillStyle = PAL.blue; ctx.fillRect(28, -334, 3, 14);
    // badge
    ctx.save(); ctx.translate(-30, -426); ctx.rotate(-.08);
    paper(ctx, () => roundRectPath(ctx, -15, -10, 30, 20, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1 });
    ctx.save();
    ctx.scale(flip, 1);
    TY.text(ctx, 'MIRA', 0, 3, 8, { family: 'Archivo Black', color: PAL.ink, align: 'center' });
    ctx.restore();
    ctx.restore();
  }
  // neck
  ctx.fillStyle = C.shade(skin, -6);
  ctx.beginPath(); ctx.moveTo(-8, -500); ctx.lineTo(8, -500); ctx.lineTo(9, -462); ctx.lineTo(-9, -462); ctx.closePath(); ctx.fill();

  // head
  ctx.save();
  ctx.translate(0, -462); ctx.rotate(headTilt); ctx.translate(0, 462);
  ctx.save(); ctx.translate(0, HEAD);
  // hair back
  paper(ctx, () => { ctx.beginPath(); ctx.arc(0, 0, 48, Math.PI * .95, Math.PI * 2.05); ctx.lineTo(46, 44); ctx.quadraticCurveTo(26, 26, 0, 32); ctx.quadraticCurveTo(-26, 26, -46, 44); ctx.closePath(); }, { fill: hairCol, edge: C.rgba(PAL.ink, .55), edgeW: 2 });
  // face
  paper(ctx, () => blobPath(ctx, 0, 0, 36, 42, 16, .02, 9), { fill: skin, edge: C.rgba(PAL.ink, .55), edgeW: 2, shadow: C.rgba(PAL.ink, .12), sx: 2.5, sy: 4.5 });
  // blush
  ctx.globalAlpha = .3; ctx.fillStyle = '#F08A8A';
  ctx.beginPath(); ctx.ellipse(-22, 17, 8, 3.6, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(22, 17, 8, 3.6, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  // eyes
  const ey = -4;
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 15, ey);
    const es = f.eyes || 'dot';
    if (es === 'closed') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(0, 0, 7, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
    else if (es === 'star') { starPath(ctx, 0, 0, 10, .45, 5); ctx.fillStyle = PAL.ink; ctx.fill(); }
    else if (es === 'swirl') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.8; ctx.beginPath(); for (let i = 0; i < 22; i++) { const a = i * .55, r = i * .46; i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(0, 0); } ctx.stroke(); }
    else if (es === 'wide') { ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc((f.look?.[0] || 0) * 3, 0, 4.4, 0, TAU); ctx.fill(); }
    else if (es === 'happy') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(0, 2, 7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
    else { ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 5.6, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(1.8, -1.8, 1.6, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // glasses
  if (o.glasses !== false) {
    ctx.save(); ctx.translate(0, ey); ctx.rotate(f.glassesTilt || 0);
    // lens tint
    ctx.fillStyle = 'rgba(160,210,235,.18)';
    ctx.beginPath(); ctx.arc(-16, 0, 12, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(16, 0, 12, 0, TAU); ctx.fill();
    ctx.strokeStyle = PAL.blue; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-16, 0, 12, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(16, 0, 12, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-28, -1); ctx.lineTo(-38, -3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, -1); ctx.lineTo(38, -3); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.72)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-23, -6); ctx.lineTo(-15, -11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(9, -6); ctx.lineTo(17, -11); ctx.stroke();
    ctx.restore();
  }
  // brows
  ctx.strokeStyle = C.rgba(PAL.ink, .75); ctx.lineWidth = 1.7;
  ctx.beginPath(); ctx.moveTo(-23, ey - 17); ctx.quadraticCurveTo(-15, ey - 21, -7, ey - 17); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, ey - 17); ctx.quadraticCurveTo(15, ey - 21, 23, ey - 17); ctx.stroke();
  // nose
  ctx.strokeStyle = C.rgba(PAL.ink, .3); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(2, 13); ctx.stroke();
  // mouth
  const m = f.mouth || 'smile';
  ctx.save(); ctx.translate(0, 27);
  if (m === 'o') { ctx.fillStyle = '#8E2430'; ctx.beginPath(); ctx.ellipse(0, 0, 3.8, 4.8, 0, 0, TAU); ctx.fill(); }
  else if (m === 'flat') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke(); }
  else if (m === 'wobble') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(-5.5, 0); ctx.quadraticCurveTo(0, 3.6, 5.5, 0); ctx.stroke(); }
  else if (m === 'grin') { ctx.fillStyle = '#8E2430'; ctx.beginPath(); ctx.arc(0, -2, 6.5, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.fillRect(-5, -2, 10, 2.6); }
  else { ctx.fillStyle = '#A62A36'; ctx.beginPath(); ctx.moveTo(-5.5, -1); ctx.quadraticCurveTo(0, 3, 5.5, -1); ctx.quadraticCurveTo(0, 7, -5.5, -1); ctx.fill(); }
  ctx.restore();
  // bangs
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-40, -30); ctx.quadraticCurveTo(-30, -56, 0, -52); ctx.quadraticCurveTo(30, -56, 40, -30); ctx.lineTo(37, -16); ctx.quadraticCurveTo(20, -26, 0, -20); ctx.quadraticCurveTo(-20, -26, -37, -16); ctx.closePath(); }, { fill: hairCol, edge: C.rgba(PAL.ink, .6), edgeW: 1.8 });
  ctx.restore();
  ctx.restore();

  // near arm
  drawArm(1, armR, false);

  function drawArm(side, ang, far) {
    const sx = side * 38, sy = -448;
    const colArm = coat ? (far ? C.shade(coat, -14) : coat) : PAL.ink;
    const elbow = limb(ctx, sx, sy, 92, 20, 16, ang[0], colArm, C.rgba(PAL.ink, .5), true);
    brad(ctx, sx, sy, 3.6); brad(ctx, elbow[0], elbow[1], 2.8);
    const wrist = limb(ctx, elbow[0], elbow[1], 78, 16, 13, ang[0] + ang[1], colArm, C.rgba(PAL.ink, .5), true);
    paper(ctx, () => blobPath(ctx, wrist[0], wrist[1] + 10, 9, 13, 10, .08, 5), { fill: far ? SKIN_D : SKIN, edge: C.rgba(PAL.ink, .45), edgeW: 1.2 });
    paper(ctx, () => blobPath(ctx, wrist[0] + 7, wrist[1] + 14, 4, 6, 4, .1, 4), { fill: far ? SKIN_D : SKIN, edge: C.rgba(PAL.ink, .4), edgeW: 1 });
    return wrist;
  }

  // held props are drawn by scenes using returned hand positions, keep simple handles:
  ctx.restore(); // torso
  ctx.restore(); // outer
}

/* ------------------------------------------------------------
   GATO — cat idol (wraps idol)
   ------------------------------------------------------------ */
function gato(ctx, x, y, s, o = {}) {
  const t = o.t || 0, p = o.pose || {};
  ctx.save();
  // tail first
  ctx.save(); ctx.translate(x + 26 * s, y - 250 * s);
  ctx.strokeStyle = '#171310'; ctx.lineWidth = 9 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(70 * s, -10 * s, 74 * s + Math.sin(t * 2) * 22 * s, -110 * s, 26 * s, -142 * s); ctx.stroke();
  ctx.strokeStyle = C.rgba(PAL.pink, .55); ctx.lineWidth = 3 * s; ctx.stroke();
  ctx.restore();
  idol(ctx, x, y, s, {
    ...o, t, pose: p,
    flower: { petal: '#3A2030', petal2: '#2A1622', tip: '#FF5E9C', center: SKIN, hair: '#3A2030' },
    outfit: 'stage',
    colors: { jacket: PAL.ink, sleeve: PAL.ink, skirt: PAL.ink, boot: PAL.ink, skin: SKIN, hair: '#3A2030' },
    petals: 12, earrings: true
  });
  // cat ears
  ctx.save(); ctx.translate(x, y + (p.bounce || 0)); ctx.scale(s, s);
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 34, -672); ctx.rotate(sx * .22);
    ctx.beginPath(); ctx.moveTo(-15, 12); ctx.lineTo(0, -26); ctx.lineTo(17, 10); ctx.closePath();
    ctx.fillStyle = '#3A2030'; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(0, -14); ctx.lineTo(8, 5); ctx.closePath(); ctx.fillStyle = PAL.pink; ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

/* ------------------------------------------------------------
   Mascots
   ------------------------------------------------------------ */
function paperclip(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  if (o.shadow !== false) shadowEllipse(ctx, 0, 4, 34, 10, .18);
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-10, -26); ctx.lineTo(-10, 18); ctx.quadraticCurveTo(-10, 34, 6, 34);
    ctx.quadraticCurveTo(22, 34, 22, 18); ctx.lineTo(22, -18); ctx.quadraticCurveTo(22, -30, 10, -30);
    ctx.quadraticCurveTo(-2, -30, -2, -18); ctx.lineTo(-2, 12); ctx.quadraticCurveTo(-2, 20, 5, 20);
    ctx.quadraticCurveTo(12, 20, 12, 12); ctx.lineTo(12, -24);
  };
  ctx.strokeStyle = C.rgba(PAL.ink, .6); ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.strokeStyle = o.col || PAL.silver; ctx.lineWidth = 9; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2.4; ctx.stroke();
  if (o.face !== false) {
    for (const sx of [-1, 1]) {
      ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(2 + sx * 6, 2, 4.4, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(2 + sx * 6 + (o.lookX || 0), 2 + (o.lookY || 0), 2.3, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(2, 9, 3.5, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
  }
  ctx.restore();
}

function shoggoth(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 10, 120, 26, .25);
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI * .9 + i / 8 * Math.PI * .8;
    const len = 90 + C.hash(i * 3.1) * 60;
    ctx.save(); ctx.rotate(a + Math.sin(t * 2 + i) * .08);
    ctx.strokeStyle = i % 2 ? '#1B171E' : '#2B2430'; ctx.lineWidth = 22 - i; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.quadraticCurveTo(len * .5, -60 - Math.sin(t * 3 + i) * 30, len, -10); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }
  paper(ctx, () => blobPath(ctx, 0, -50, 95, 80, 16, .08, 5), { fill: '#1B171E', edge: '#0C0A09', edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 6, sy: 10 });
  for (let i = 0; i < 11; i++) {
    const ex = (C.hash(i * 4.1) - .5) * 150, ey = -80 + (C.hash(i * 7.7) - .5) * 80;
    ctx.fillStyle = o.eyeCol || PAL.acid; ctx.beginPath(); ctx.ellipse(ex, ey, 8, 5, C.hash(i) * 3, 0, TAU); ctx.fill();
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(ex + (o.lookX || 0) * 2, ey, 2.8, 0, TAU); ctx.fill();
  }
  if (o.mask !== false) {
    ctx.save(); ctx.translate(0, -115); ctx.rotate(o.maskRot || 0);
    ctx.strokeStyle = '#B08A52'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, 120); ctx.stroke();
    paper(ctx, () => blobPath(ctx, 0, 0, 76, 70, 18, .03, 2), { fill: PAL.goldL, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .3), sx: 6, sy: 10 });
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.ellipse(-26, -12, 9, 14, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(26, -12, 9, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 8, 32, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function basilisk(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const n = o.segs || 8;
  for (let i = n - 1; i >= 0; i--) {
    const a = i * .55 + t * .15;
    const px = Math.sin(a) * (80 + i * 8), py = -i * 52 - 20;
    const w = 34 - i * 2.2;
    paper(ctx, () => blobPath(ctx, px, py, w, w * .72, 14, .05, i * 3), {
      fill: i % 2 ? PAL.green : PAL.greenD, edge: PAL.ink, edgeW: 2.2, shadow: C.rgba(PAL.ink, .16), sx: 3, sy: 6
    });
    if (i === 0) {
      ctx.save(); ctx.translate(px, py - 20);
      paper(ctx, () => blobPath(ctx, 0, 0, 52, 40, 16, .04, 2), { fill: PAL.green, edge: PAL.ink, edgeW: 2.6, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 8 });
      for (const sx of [-1, 1]) {
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.ellipse(sx * 20, -4, 9, 7, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(sx * 20, -4, 3, 9, 0, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 10, 26, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
      ctx.fillStyle = PAL.red; ctx.beginPath(); ctx.moveTo(-8, 20); ctx.lineTo(0, 46); ctx.lineTo(8, 20); ctx.closePath(); ctx.fill();
      crown(ctx, 0, -34, .62);
      ctx.restore();
    }
  }
  ctx.restore();
}

function chinchilla(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 0, 70, 16, .2);
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * TAU;
    ctx.save(); ctx.rotate(a);
    ctx.fillStyle = i % 2 ? PAL.cream : PAL.paper2;
    ctx.beginPath(); ctx.ellipse(0, -60, 16, 54, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  paper(ctx, () => blobPath(ctx, 0, -60, 52, 60, 16, .06, 4), { fill: PAL.cream, edge: C.rgba(PAL.ink, .45), edgeW: 2 });
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 32, -118); ctx.rotate(sx * .3);
    paper(ctx, () => blobPath(ctx, 0, 0, 16, 28, 12, .05, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.8 });
    ctx.fillStyle = PAL.pink; ctx.beginPath(); ctx.ellipse(0, 2, 7, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  for (const sx of [-1, 1]) {
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * 17, -72, 5.5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(sx * 17 + 2, -74, 1.7, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, -58, 4, 3, 0, 0, TAU); ctx.fill();
  if (o.tokens) {
    for (let i = 0; i < 6; i++) {
      ctx.save(); ctx.translate(-38 + (i % 3) * 38, -46 + Math.floor(i / 3) * 14); ctx.rotate((C.hash(i) - .5) * .5);
      paper(ctx, () => roundRectPath(ctx, -12, -8, 24, 16, 2), { fill: PAL.acid, edge: PAL.ink, edgeW: 1.2 });
      ctx.restore();
    }
  }
  ctx.restore();
}

function cloudGuard(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const pts = [[-80, 0], [-64, -34], [-28, -44], [-8, -66], [30, -58], [54, -30], [84, -12], [76, 14], [-72, 18]];
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.closePath(); }, { fill: o.col || PAL.cream, edge: C.rgba(PAL.ink, .35), edgeW: 2, shadow: C.rgba(PAL.ink, .14), sx: 4, sy: 8 });
  ctx.fillStyle = PAL.blueD; ctx.beginPath(); ctx.ellipse(0, -40, 34, 9, 0, 0, TAU); ctx.fill();
  ctx.fillRect(-18, -66, 36, 28); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.strokeRect(-18, -66, 36, 28);
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -50, 4, 0, TAU); ctx.fill();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 18, -18, 7, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
  ctx.save(); ctx.translate(34, 12); ctx.rotate((o.lightRot || .7) + Math.sin(t + (o.seed || 0)) * .05);
  ctx.fillStyle = C.rgba(PAL.goldL, .18); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(90, 160); ctx.lineTo(-20, 160); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PAL.ink; ctx.fillRect(-8, -6, 16, 14);
  ctx.restore();
  if (o.zzz) for (let i = 0; i < 3; i++) TY.text(ctx, 'z', 50 + i * 20, -70 - i * 22 - Math.sin(t * 2 + i) * 5, 16 + i * 7, { family: 'Instrument Serif', color: C.rgba(PAL.ink, .55) });
  ctx.restore();
}

function doomMeter(ctx, x, y, s, v, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 0, 50, 12, .2);
  paper(ctx, () => roundRectPath(ctx, -44, -420, 88, 420, 14), { fill: PAL.paper2, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .25), sx: 6, sy: 10 });
  ctx.save(); ctx.beginPath(); roundRectPath(ctx, -17, -386, 34, 330, 17); ctx.clip();
  ctx.fillStyle = PAL.cream; ctx.fillRect(-20, -390, 40, 340);
  const h = 330 * C.clamp(v / 100);
  const g = ctx.createLinearGradient(0, 0, 0, -360);
  g.addColorStop(0, PAL.redD); g.addColorStop(.55, PAL.red); g.addColorStop(1, PAL.gold);
  ctx.fillStyle = g; ctx.fillRect(-20, -56 - h, 40, h);
  ctx.strokeStyle = C.rgba(PAL.ink, .4); ctx.lineWidth = 1.5;
  for (let i = 0; i <= 10; i++) { const yy = -56 - 330 * i / 10; ctx.beginPath(); ctx.moveTo(10, yy); ctx.lineTo(20, yy); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; roundRectPath(ctx, -17, -386, 34, 330, 17); ctx.stroke();
  paper(ctx, () => blobPath(ctx, 0, 6, 38, 34, 16, .04, 4), { fill: PAL.red, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, .2), sx: 4, sy: 8 });
  for (const sx of [-1, 1]) { ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(sx * 12, 2, 5, 0, TAU); ctx.fill(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * 12 + (o.lookX || 0), 2, 2, 0, TAU); ctx.fill(); }
  TY.text(ctx, 'P(DOOM)', 0, -438, 17, { family: 'Archivo Black', color: PAL.ink, align: 'center' });
  TY.text(ctx, v.toFixed(1) + '%', 0, 46, 22, { family: 'DMMono', color: PAL.cream, align: 'center' });
  if (o.cracked) {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-10 + i * 5, -300 + i * 30); ctx.lineTo(4 + i * 3, -270 + i * 34); ctx.lineTo(-8 + i * 4, -240 + i * 38); ctx.stroke(); }
  }
  ctx.restore();
}
