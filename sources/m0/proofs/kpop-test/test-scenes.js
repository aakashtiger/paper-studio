/* ============================================================
   THE CUE LAMP — a 25 s KPOP test on the source Paper K-pop grammar.
   9 authored shots. Every shot is a pure function of t.
   The narration is the clock; the picture cuts on the measured words.
   ============================================================ */
(() => {
  const INK = '#171310';
  const CREAM = '#F2E8D5';
  const TEAL = '#0F6B5E';
  const TEAL_D = '#082A28';
  const CORAL = '#E86A5A';
  const MUSTARD = '#F2C14E';
  const BLUE = '#1B2F52';
  const GOLD = '#C68E2E';
  const PINK = '#E86A96';
  const GROUND = 960;

  // The palette roles the shared type, subtitle and print furniture read.
  PAL.red = CORAL;
  PAL.acid = MUSTARD;
  PAL.gold = MUSTARD;
  PAL.goldD = GOLD;
  PAL.blue = '#2F5FA8';
  PAL.blueD = BLUE;
  PAL.pink = PINK;
  PAL.teal = TEAL;
  PAL.tealD = TEAL_D;
  PAL.green = '#2FAE9A';
  PAL.silver = '#C9C2B4';

  /* Deterministic grain. The source's grainCanvas uses Math.random(); the
   * studio's first law is that the same frame hashes the same. This override is
   * loaded after core.js and before initTextures(), so the whole proof uses it. */
  function grainCanvas(size = 512) {
    const { c, x } = makeCanvas(size, size);
    const img = x.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const v = Math.floor(C.hash(i * 12.9898 + 0.37) * 255);
      img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = Math.floor(C.hash(i * 78.233 + 1.7) * 34);
    }
    x.putImageData(img, 0, 0);
    return c;
  }
  window.grainCanvas = grainCanvas;

  const NOVA_FLOWER = { petal: CREAM, petal2: '#E7C98B', tip: CORAL, center: '#F0C9A4', hair: INK };
  const NOVA_COLORS = { jacket: TEAL, sleeve: CREAM, skirt: CORAL, boot: MUSTARD, hair: INK, skin: '#D9A06A' };
  const MIRA_COLORS = { coat: CREAM, coatCol: CREAM, trouser: BLUE, hair: INK, skin: '#E8B98C' };

  let IDLE_NOVA = {
    bounce: 0, sway: 0, lean: -0.02, headTilt: 0.03, headTurn: 0.02, hairSwing: 4,
    armL: [0.25, 0.05], armR: [-0.25, -0.05],
    legL: [0.05, 0.02], legR: [-0.05, -0.02],
    footL: [-36, -39], footR: [36, -39],
  };
  let IDLE_MIRA = {
    bounce: 0, sway: 0, lean: 0.02, headTilt: 0.02, headTurn: -0.02, hairSwing: 2,
    armL: [0.3, 0.1], armR: [-0.3, -0.1],
    legL: [0.03, 0.01], legR: [-0.03, -0.01],
    footL: [-28, -8], footR: [29, -8],
  };

  const P = (base, o = {}) => ({ ...base, ...o });

  // The pose library. Every arm is two bones: [upper, elbow]. A raised arm
  // without an elbow bend reads as a T-pose, so the elbow is never 0 here.
  // `yaw` shears the upper body: 0 = facing us, +1 = turned to her left.
  const POSES = {
    nova: {
      idle: { bounce: 0, sway: 0, lean: -0.02, yaw: 0.10, headTilt: 0.03, headTurn: 0.06, hairSwing: 4, armL: [0.30, -0.45], armR: [-0.34, 0.55], legL: [0.05, 0.02], legR: [-0.05, -0.02], footL: [-36, -39], footR: [36, -39] },
      reach: { bounce: -4, sway: 4, lean: 0.02, yaw: 0.35, headTilt: -0.04, headTurn: -0.18, hairSwing: 6, armL: [1.35, 0.75], armR: [-0.55, 1.05], legL: [0.12, 0.08], legR: [-0.08, -0.05], footL: [-37, -39], footR: [38, -39] },
      point: { bounce: -4, sway: 10, lean: 0.06, yaw: 0.45, headTilt: 0.06, headTurn: -0.12, hairSwing: 7, armL: [1.80, 0.08], armR: [-0.70, 1.35], legL: [0.18, 0.12], legR: [-0.1, -0.08], footL: [-39, -39], footR: [39, -39] },
      turn: { bounce: -4, sway: -8, lean: -0.07, yaw: -0.55, headTilt: 0.05, headTurn: 0.25, hairSwing: 10, armL: [0.80, -1.55], armR: [-1.05, 0.65], legL: [0.08, 0.05], legR: [-0.18, -0.12], footL: [-36, -39], footR: [41, -39] },
      lift: { bounce: -4, sway: 6, lean: 0.04, yaw: 0.25, headTilt: -0.05, headTurn: -0.05, hairSwing: -6, armL: [1.50, 1.10], armR: [-0.85, 0.95], legL: [0.10, 0.05], legR: [-0.15, -0.20], footL: [-36, -39], footR: [32, -39] },
      duetLeft: { bounce: -5, sway: 8, lean: 0.04, yaw: 0.40, headTilt: -0.04, headTurn: 0.02, hairSwing: 5, armL: [1.55, 1.15], armR: [-0.95, 1.25], legL: [0.15, 0.1], legR: [-0.1, -0.05], footL: [-42, -39], footR: [39, -39] },
      duetRight: { bounce: -5, sway: -8, lean: -0.04, yaw: -0.40, headTilt: 0.05, headTurn: -0.05, hairSwing: -7, armL: [0.95, -1.25], armR: [-1.55, -1.15], legL: [0.1, 0.05], legR: [-0.15, -0.1], footL: [-37, -39], footR: [44, -39] },
      bow: { bounce: 4, sway: 0, lean: 0.4, yaw: 0.0, headTilt: 0.22, headTurn: 0, hairSwing: 2, armL: [0.55, -0.75], armR: [-0.55, 0.75], legL: [0.08, 0.03], legR: [-0.08, -0.03], footL: [-33, -39], footR: [33, -39] },
      hip: { bounce: 0, sway: 6, lean: 0.03, yaw: 0.25, headTilt: 0.06, headTurn: 0.10, hairSwing: 3, armL: [0.72, -1.95], armR: [-0.30, 0.35], legL: [0.05, 0.02], legR: [-0.05, -0.02], footL: [-36, -39], footR: [36, -39] },
    },
    mira: {
      idle: { bounce: 0, sway: 0, lean: 0.02, yaw: 0.10, headTilt: 0.02, headTurn: -0.02, hairSwing: 2, armL: [0.32, -0.50], armR: [-0.36, 0.60], legL: [0.03, 0.01], legR: [-0.03, -0.01], footL: [-28, -8], footR: [29, -8] },
      step: { bounce: -4, sway: 6, lean: 0.05, yaw: 0.20, headTilt: -0.03, headTurn: 0.04, hairSwing: 4, armL: [0.60, 0.25], armR: [-0.45, -0.30], legL: [0.08, 0.03], legR: [-0.04, -0.02], footL: [-28, -8], footR: [32, -26], footPitchR: -0.3 },
      point: { bounce: -4, sway: 8, lean: 0.04, yaw: 0.40, headTilt: 0.03, headTurn: -0.05, hairSwing: 5, armL: [1.72, 0.10], armR: [-0.65, 1.30], legL: [0.05, 0.02], legR: [-0.06, -0.02], footL: [-31, -8], footR: [33, -8] },
      turn: { bounce: -4, sway: -8, lean: -0.04, yaw: -0.50, headTilt: 0.04, headTurn: 0.06, hairSwing: -6, armL: [0.90, -1.25], armR: [-1.10, 0.60], legL: [0.06, 0.02], legR: [-0.05, -0.02], footL: [-28, -8], footR: [35, -8] },
      listen: { bounce: -3, sway: 2, lean: 0.06, yaw: 0.30, headTilt: 0.15, headTurn: 0.15, hairSwing: 3, armL: [0.90, 1.35], armR: [-0.40, 0.55], legL: [0.08, 0.06], legR: [-0.04, -0.02], footL: [-27, -8], footR: [30, -8] },
      duetLeft: { bounce: -4, sway: 6, lean: 0.03, yaw: 0.35, headTilt: -0.02, headTurn: 0.03, hairSwing: 4, armL: [1.50, 1.10], armR: [-0.95, 1.20], legL: [0.05, 0.02], legR: [-0.05, -0.02], footL: [-34, -8], footR: [33, -8] },
      duetRight: { bounce: -4, sway: -6, lean: -0.03, yaw: -0.35, headTilt: 0.03, headTurn: -0.04, hairSwing: -5, armL: [0.95, -1.20], armR: [-1.50, -1.10], legL: [0.06, 0.02], legR: [-0.04, -0.02], footL: [-31, -8], footR: [36, -8] },
      bow: { bounce: 3, sway: 0, lean: 0.4, yaw: 0.0, headTilt: 0.2, headTurn: 0, hairSwing: 1, armL: [0.55, -0.75], armR: [-0.55, 0.75], legL: [0.04, 0.02], legR: [-0.04, -0.02], footL: [-28, -8], footR: [29, -8] },
      hip: { bounce: 0, sway: 4, lean: 0.03, yaw: 0.20, headTilt: 0.04, headTurn: 0.08, hairSwing: 2, armL: [0.70, -1.90], armR: [-0.32, 0.38], legL: [0.03, 0.01], legR: [-0.03, -0.01], footL: [-28, -8], footR: [29, -8] },
    },
  };
  IDLE_NOVA = POSES.nova.idle;
  IDLE_MIRA = POSES.mira.idle;
  const FACES = {
    neutral: { eyes: 'normal', mouth: 'smile', blush: 0.35, look: [0, 0] },
    smile: { eyes: 'happy', mouth: 'smile', blush: 0.5, look: [0, 0] },
    surprise: { eyes: 'wide', mouth: 'o', blush: 0.45, look: [0, 0] },
    tender: { eyes: 'closed', mouth: 'smile', blush: 0.55, look: [0, 0] },
    alarm: { eyes: 'wide', mouth: 'o', blush: 0.35, look: [0, 0] },
    star: { eyes: 'star', mouth: 'sing', blush: 0.6, look: [0, 0], sing: 0.8 },
    sing: { eyes: 'closed', mouth: 'sing', blush: 0.5, look: [0, 0], sing: 0.8 },
    narrow: { eyes: 'narrow', mouth: 'flat', blush: 0.3, look: [0, 0] },
    grin: { eyes: 'happy', mouth: 'grin', blush: 0.55, look: [0, 0] },
  };
  const POSE_KEYS = ['bounce', 'sway', 'lean', 'yaw', 'headTilt', 'headTurn', 'hairSwing', 'armL', 'armR', 'legL', 'legR', 'footL', 'footR', 'footPitchL', 'footPitchR'];
  function mixPose(a, b, u) {
    const o = {};
    for (const k of POSE_KEYS) {
      const va = a[k], vb = b[k] === undefined ? va : b[k];
      o[k] = Array.isArray(va) ? va.map((v, i) => C.lerp(v, vb[i] === undefined ? v : vb[i], u)) : C.lerp(va || 0, vb || 0, u);
    }
    return o;
  }
  // A pose is held until 0.32 s before the next event, then it moves. Without
  // the hold key the rig drifts slowly across the whole shot, which reads as a
  // statue sliding rather than an actor changing pose on a word.
  function poseAt(t, keys, hold = 0.32) {
    const k = [];
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) k.push([Math.max(keys[i - 1][0] + 0.02, keys[i][0] - hold), keys[i - 1][1]]);
      k.push(keys[i]);
    }
    if (t <= k[0][0]) return { ...k[0][1] };
    for (let i = 1; i < k.length; i++) {
      if (t <= k[i][0]) {
        const u = C.ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
        return mixPose(k[i - 1][1], k[i][1], u);
      }
    }
    return { ...k[k.length - 1][1] };
  }

  // A held pose is a freeze. Every pose gets a small, seeded drift on the
  // arms, head and weight so the body is alive between the authored keys.
  function livePose(pose, t, seed) {
    const p = { ...pose };
    const L = pose.armL || [0.3, 0], R = pose.armR || [-0.3, 0];
    p.armL = [L[0] + 0.035 * Math.sin(t * 1.9 + seed), L[1] + 0.06 * Math.sin(t * 1.3 + seed + 1)];
    p.armR = [R[0] - 0.035 * Math.sin(t * 1.7 + seed + 2), R[1] - 0.06 * Math.sin(t * 1.1 + seed + 3)];
    p.headTilt = (pose.headTilt || 0) + 0.014 * Math.sin(t * 1.4 + seed);
    p.headTurn = (pose.headTurn || 0) + 0.022 * Math.sin(t * 1.1 + seed + 2);
    p.sway = (pose.sway || 0) + 0.5 * Math.sin(t * 0.9 + seed);
    return p;
  }

  const wordTime = (i) => (window.KPOP_WORDS[i] ? window.KPOP_WORDS[i].t : 0);
  const lineOf = (i) => window.KPOP_LINES[i];
  const blinkAt = (t, seed = 0) => (C.frac(t * 0.47 + seed) < 0.035 ? 1 : 0);

  function faceAt(t, keys, base = {}) {
    let f = { ...base };
    for (const k of keys) if (t >= k.t) f = { ...f, ...k.f };
    return f;
  }

  function faceRim(ctx, x, y, s, head, side = 1, alpha = 0.14) {
    const fy = y + head * s;
    const g = ctx.createRadialGradient(x + side * 28 * s, fy - 18 * s, 4, x, fy, 54 * s);
    g.addColorStop(0, C.rgba(CREAM, alpha));
    g.addColorStop(1, C.rgba(CREAM, 0));
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, fy, 54 * s, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(MUSTARD, alpha * 0.9); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x + side * 36 * s, fy - 4 * s, 40 * s, Math.PI * 1.05, Math.PI * 1.55); ctx.stroke();
    ctx.restore();
  }

  /* ---------- the clean cast ---------- */
  function recordCast(who, x, y, s, t, pose, face) {
    if (!window.KPOP_MEASURE) return;
    (window.KPOP_CAST || (window.KPOP_CAST = [])).push({ who, x, y, s, t, pose, face });
  }

  function nova(ctx, x, y, s, t, pose = {}, face = {}, extra = {}) {
    const live = livePose(P(IDLE_NOVA, pose), t, 1.3);
    recordCast('nova', x, y, s, t, live, face);
    const r = idol(ctx, x, y, s, {
      t,
      pose: live,
      flower: NOVA_FLOWER,
      colors: NOVA_COLORS,
      petals: 0,
      halo: 0,
      outfit: 'stage',
      shadow: 1,
      earrings: true,
      face: { eyes: 'normal', mouth: 'smile', blush: 0.45, look: [0, 0], ...face },
      ...extra,
    });
    faceRim(ctx, x, y, s, -604, 1, 0.15);
    return r;
  }

  function mira(ctx, x, y, s, t, pose = {}, face = {}, extra = {}) {
    const live = livePose(P(IDLE_MIRA, pose), t, 4.1);
    recordCast('mira', x, y, s, t, live, face);
    const r = window.mira(ctx, x, y, s, {
      t,
      pose: live,
      colors: MIRA_COLORS,
      glasses: true,
      shadow: 1,
      face: { eyes: 'normal', mouth: 'smile', blush: 0.35, look: [0, 0], ...face },
      ...extra,
    });
    faceRim(ctx, x, y, s, -518, -1, 0.13);
    return r;
  }

  function backup(ctx, x, y, s, t, which, pose = {}, face = {}) {
    const a = which === 0;
    return idol(ctx, x, y, s, {
      t,
      pose: livePose(P(IDLE_NOVA, pose), t, 1.3),
      flower: NOVA_FLOWER,
      colors: a
        ? { jacket: MUSTARD, sleeve: CREAM, skirt: TEAL, boot: CORAL, hair: '#3A2A20', skin: '#D9A06A' }
        : { jacket: CORAL, sleeve: CREAM, skirt: BLUE, boot: MUSTARD, hair: '#2B2430', skin: '#E8B98C' },
      petals: 0,
      halo: 0,
      outfit: 'stage',
      shadow: 1,
      earrings: true,
      face: { eyes: 'happy', mouth: 'sing', blush: 0.5, look: [0, 0], ...face },
    });
  }

  /* hand points, including the torso lean, so props can be held */
  function armPoint(x, y, s, p, which, shoulderX, shoulderY, upper, lower, pivot) {
    const side = which === 'R' ? 1 : -1;
    const ang = which === 'R' ? (p.armR || [-0.25, -0.05]) : (p.armL || [0.25, 0.05]);
    const sx = side * shoulderX;
    let ex = sx - Math.sin(ang[0]) * upper;
    let ey = shoulderY + Math.cos(ang[0]) * upper;
    let wx = ex - Math.sin(ang[0] + ang[1]) * lower;
    let wy = ey + Math.cos(ang[0] + ang[1]) * lower;
    const lean = p.lean || 0;
    const bounce = p.bounce || 0;
    const py = wy - pivot;
    const rx = wx * Math.cos(lean) - py * Math.sin(lean);
    const ry = wx * Math.sin(lean) + py * Math.cos(lean);
    return [x + rx * s, y + (ry + pivot + bounce) * s];
  }
  const novaHand = (x, y, s, p, which = 'R') => armPoint(x, y, s, p, which, 45, -516, 104, 88, -334);
  const miraHand = (x, y, s, p, which = 'R') => armPoint(x, y, s, p, which, 38, -448, 92, 78, -270);

  function walkPose(base, lt, speed = 9, stride = 1, phase = 0) {
    const u = lt * speed + phase;
    const step = Math.sin(u);
    return P(base, {
      bounce: -Math.abs(step) * 6,
      sway: 2.5 * step,
      lean: (base.lean || 0) + 0.02 * step,
      armL: [0.3 - 0.16 * step, 0.06],
      armR: [-0.3 - 0.16 * step, -0.06],
      footL: [base.footL[0] + 12 * stride * step, base.footL[1]],
      footR: [base.footR[0] - 12 * stride * step, base.footR[1]],
      headTilt: (base.headTilt || 0) + 0.02 * step,
    });
  }

  /* ---------- atmosphere and paper furniture ---------- */
  function dust(ctx, t, n = 40, seed = 0, alpha = 0.22) {
    for (let i = 0; i < n; i++) {
      const h = C.hash(i * 3.71 + seed);
      const x = C.lerp(-80, W + 80, C.frac(h * 7.3 + t * 0.012));
      const y = C.lerp(80, H - 40, C.frac(h * 13.7 + t * 0.02));
      const r = 1 + C.hash(i * 9.1 + seed) * 2.4;
      ctx.fillStyle = C.rgba(CREAM, alpha * (0.35 + 0.65 * C.hash(i * 5.3 + Math.floor(t * 3))));
      ctx.beginPath(); ctx.arc(x + Math.sin(t * 0.7 + i) * 12, y, r, 0, TAU); ctx.fill();
    }
  }

  function contactShadow(ctx, x, y, s, w = 60) {
    ctx.save();
    ctx.fillStyle = C.rgba(INK, 0.26);
    ctx.beginPath(); ctx.ellipse(x, y + 4, w * s, 13 * s, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function micStand(ctx, x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // base
    paper(ctx, () => roundRectPath(ctx, -34, -10, 68, 16, 6), { fill: INK, edge: C.rgba(CREAM, 0.3), edgeW: 1.5, shadow: C.rgba(INK, 0.3), sx: 3, sy: 5 });
    // pole
    paper(ctx, () => tornRectPath(ctx, -4, -660, 8, 660, 2, 7), { fill: GOLD, edge: INK, edgeW: 1.2 });
    // boom reaches left to the singer's mouth; the pole stays at her side
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -660); ctx.lineTo(-140, -742); ctx.stroke();
    ctx.strokeStyle = C.rgba(PAL.cream, .5); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(0, -660); ctx.lineTo(-140, -742); ctx.stroke();
    // capsule
    ctx.save(); ctx.translate(-140, -748); ctx.rotate(-0.12);
    paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, 0, 15, 24, 0, 0, TAU); }, { fill: PAL.silver, edge: INK, edgeW: 2.2, shadow: C.rgba(INK, 0.25), sx: 2, sy: 4 });
    ctx.strokeStyle = C.rgba(INK, 0.45); ctx.lineWidth = 1.4;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-9, i * 7); ctx.lineTo(9, i * 7); ctx.stroke(); }
    ctx.restore();
    // cable
    ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(40 + Math.sin(t * 1.4) * 8, 60, 90, 30); ctx.stroke();
    ctx.restore();
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

  function starProp(ctx, x, y, s, rot, t, glow = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    if (glow > 0) {
      const g = ctx.createRadialGradient(0, 0, 8, 0, 0, 170);
      g.addColorStop(0, C.rgba(MUSTARD, 0.34 * glow));
      g.addColorStop(0.55, C.rgba(MUSTARD, 0.1 * glow));
      g.addColorStop(1, C.rgba(MUSTARD, 0));
      ctx.fillStyle = g; ctx.fillRect(-190, -190, 380, 380);
    }
    paper(ctx, () => starPath(ctx, 0, 0, 74, 0.44, 5), {
      fill: MUSTARD, edge: INK, edgeW: 3.2, shadow: C.rgba(INK, 0.26), sx: 4, sy: 7,
    });
    paper(ctx, () => starPath(ctx, 0, 0, 42, 0.44, 5), { fill: CREAM, edge: null, shadow: null });
    ctx.fillStyle = C.rgba(CORAL, 0.9); ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function grip(ctx, x, y, s, skin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = skin; ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(0, 0, 11, 8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(8, -4, 4, 6, 0.5, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-6, i * 4); ctx.lineTo(4, i * 4); ctx.stroke(); }
    ctx.restore();
  }

  function clipboardProp(ctx, x, y, s, rot, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    paper(ctx, () => tornRectPath(ctx, -58, -78, 116, 166, 3, 14), {
      fill: '#8A5A3A', edge: INK, edgeW: 2.4, shadow: C.rgba(INK, 0.3), sx: 4, sy: 7,
    });
    paper(ctx, () => tornRectPath(ctx, -48, -68, 96, 146, 2, 8), { fill: CREAM, edge: C.rgba(INK, 0.35), edgeW: 1.2 });
    ctx.fillStyle = INK; ctx.fillRect(-22, -84, 44, 12);
    ctx.fillStyle = MUSTARD; ctx.fillRect(-18, -82, 36, 3);
    TY.text(ctx, 'CALL SHEET', -38, -44, 11, { family: 'DMMono', color: CORAL, letter: 1 });
    for (let i = 0; i < 7; i++) {
      const yy = -26 + i * 17;
      ctx.strokeStyle = C.rgba(INK, 0.22); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-38, yy); ctx.lineTo(38 - (i % 3) * 10, yy); ctx.stroke();
      if (i < 4) { ctx.fillStyle = i === 1 ? CORAL : MUSTARD; ctx.beginPath(); ctx.arc(-44, yy - 3, 3.2, 0, TAU); ctx.fill(); }
    }
    ctx.strokeStyle = C.rgba(INK, 0.25); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10 + Math.sin(t * 2) * 2, 40); ctx.lineTo(30, 56); ctx.stroke();
    ctx.restore();
  }

  function callList(ctx, x, y, s, rot, t, stampK = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    paper(ctx, () => tornRectPath(ctx, -95, -125, 190, 250, 3, 14), {
      fill: CREAM, edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.28), sx: 4, sy: 8,
    });
    TY.text(ctx, 'TONIGHT', -72, -88, 13, { family: 'DMMono', color: CORAL, letter: 2 });
    TY.text(ctx, 'CALL SHEET', -72, -56, 25, { family: 'Archivo Black', color: INK });
    const names = ['NOVA', 'MIRA', 'SOL', 'VAZ'];
    for (let i = 0; i < names.length; i++) {
      const yy = -14 + i * 30;
      TY.text(ctx, names[i], -72, yy, 16, { family: 'DMMono', color: i === 0 ? C.rgba(INK, 0.35) : INK, letter: 1 });
      ctx.strokeStyle = C.rgba(INK, 0.2); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-10, yy - 4); ctx.lineTo(58, yy - 4); ctx.stroke();
    }
    // NOVA is struck off the list
    ctx.strokeStyle = CORAL; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-76, -18); ctx.lineTo(-12, -18); ctx.stroke();
    if (stampK > 0) {
      ctx.save();
      ctx.translate(18, 66);
      ctx.rotate(-0.16);
      ctx.globalAlpha = C.clamp(stampK);
      paper(ctx, () => tornRectPath(ctx, -70, -21, 140, 42, 2, 9), { fill: CORAL, edge: INK, edgeW: 2, shadow: C.rgba(INK, 0.25), sx: 3, sy: 5 });
      TY.text(ctx, 'NOT ON LIST', 0, 8, 17, { family: 'Archivo Black', color: CREAM, align: 'center', letter: 0.5 });
      ctx.restore();
    }
    ctx.restore();
  }

  function cueLamp(ctx, x, y, s, t, o = {}) {
    const rot = o.rot || 0;
    const glow = o.glow ?? 0.7;
    const card = o.card || '';
    const cardOut = C.clamp(o.cardOut || 0);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // base and stand
    paper(ctx, () => roundRectPath(ctx, -34, -2, 68, 18, 5), { fill: INK, edge: C.rgba(CREAM, 0.3), edgeW: 1.5, shadow: C.rgba(INK, 0.3), sx: 3, sy: 6 });
    paper(ctx, () => roundRectPath(ctx, -6, -150, 12, 150, 3), { fill: GOLD, edge: INK, edgeW: 1.5 });
    // head
    ctx.save();
    ctx.translate(0, -150);
    ctx.rotate(rot);
    // beam
    const g = ctx.createLinearGradient(0, 10, 0, 520);
    g.addColorStop(0, C.rgba(MUSTARD, 0.3 * glow));
    g.addColorStop(0.45, C.rgba(MUSTARD, 0.12 * glow));
    g.addColorStop(1, C.rgba(MUSTARD, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-26, 12); ctx.lineTo(26, 12); ctx.lineTo(240, 560); ctx.lineTo(-240, 560); ctx.closePath(); ctx.fill();
    // shade
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-56, -38); ctx.lineTo(56, -38); ctx.lineTo(34, 12); ctx.lineTo(-34, 12); ctx.closePath(); }, {
      fill: CREAM, edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.3), sx: 3, sy: 6,
    });
    // bulb
    ctx.save(); ctx.globalAlpha = 0.55 + 0.45 * glow;
    ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(0, 8, 24, 0, TAU); ctx.fill();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(-6, 2, 9, 0, TAU); ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 8, 30, 0, TAU); ctx.stroke();
    ctx.restore();
    // card slot
    ctx.fillStyle = INK; ctx.fillRect(-30, 14, 60, 8);
    ctx.restore();
    // the name card slides out of the slot
    if (card && cardOut > 0.02) {
      const cy = -150 + 24 + cardOut * 78;
      ctx.strokeStyle = C.rgba(GOLD, 0.8); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -150 + 22); ctx.lineTo(0, cy - 24); ctx.stroke();
      ctx.save();
      ctx.translate(0, cy);
      ctx.rotate(rot * 0.35 + (1 - cardOut) * 0.2);
      paper(ctx, () => tornRectPath(ctx, -42, -24, 84, 48, 2, 12), { fill: CREAM, edge: INK, edgeW: 2, shadow: C.rgba(INK, 0.3), sx: 3, sy: 5 });
      TY.text(ctx, card, 0, 8, 26, { family: 'Archivo Black', color: INK, align: 'center', letter: 1 });
      ctx.restore();
    }
    ctx.restore();
  }

  function costumeRack(ctx, x, y, s, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    paper(ctx, () => tornRectPath(ctx, -170, -170, 340, 8, 3, 7), { fill: INK, edge: C.rgba(CREAM, 0.25), edgeW: 1.2 });
    ctx.strokeStyle = C.rgba(CREAM, 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-160, -162); ctx.lineTo(-160, 0); ctx.moveTo(160, -162); ctx.lineTo(160, 0); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const hx = -110 + i * 105;
      const sway = Math.sin(t * 1.1 + i * 1.7) * 5;
      ctx.save(); ctx.translate(hx, -162); ctx.rotate(sway * 0.012);
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, 24); ctx.lineTo(18, 24); ctx.stroke();
      const col = [CORAL, TEAL, MUSTARD][i];
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-18, 24); ctx.lineTo(18, 24); ctx.lineTo(44, 150); ctx.lineTo(-44, 150); ctx.closePath(); }, {
        fill: col, edge: C.rgba(INK, 0.6), edgeW: 2, shadow: C.rgba(INK, 0.2), sx: 3, sy: 6,
      });
      ctx.fillStyle = C.rgba(CREAM, 0.5); ctx.fillRect(-30, 78, 60, 4);
      ctx.restore();
    }
    ctx.restore();
  }

  function wingSet(ctx, t) {
    paperBg(ctx, '#0A1E1D', '#123B3B');
    const par = (CAM.x - 960) * 0.18;
    // back wall planks, slower than the foreground
    ctx.save();
    ctx.translate(par, 0);
    for (let i = 0; i < 12; i++) {
      const x = i * 176 - 40;
      paper(ctx, () => tornRectPath(ctx, x, 40, 150, 760, 5, i + 3), {
        fill: i % 2 ? '#0C2A28' : '#0A2422', edge: C.rgba(CREAM, 0.1), edgeW: 1.2, shadow: null,
      });
    }
    // fly rail
    ctx.fillStyle = INK; ctx.fillRect(-40, 70, W + 80, 16);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(120 + i * 210, 78, 5, 0, TAU); ctx.fill(); }
    // call-sheet board
    paper(ctx, () => tornRectPath(ctx, 580, 180, 320, 220, 4, 18), { fill: CREAM, edge: C.rgba(INK, 0.5), edgeW: 2, shadow: C.rgba(INK, 0.25), sx: 4, sy: 7 });
    TY.text(ctx, 'TONIGHT', 604, 218, 18, { family: 'DMMono', color: CORAL, letter: 2 });
    TY.text(ctx, 'CALL SHEET', 604, 248, 30, { family: 'Archivo Black', color: INK });
    for (let i = 0; i < 4; i++) { TY.text(ctx, ['NOVA  ?', 'MIRA  ?', 'CROWD ?', 'LAMP  ?'][i], 604, 286 + i * 28, 16, { family: 'DMMono', color: C.rgba(INK, 0.65) }); }
    // door to the dressing room
    drawDoor(ctx, 250, 520, 210, 380, t, { fill: '#0A2A28', light: 0.1 });
    ctx.restore();
    // floor
    floorPlane(ctx, 820, '#0E2F2C', MUSTARD, t, {});
    // ropes
    for (let i = 0; i < 4; i++) {
      const x = 1100 + i * 150;
      const sway = Math.sin(t * 0.9 + i) * 8;
      ctx.strokeStyle = C.rgba(CREAM, 0.24); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, 90); ctx.quadraticCurveTo(x + sway, 420, x + sway * 1.4, 760); ctx.stroke();
      ctx.fillStyle = C.rgba(MUSTARD, 0.35); ctx.beginPath(); ctx.arc(x + sway * 1.4, 764, 5, 0, TAU); ctx.fill();
    }
    costumeRack(ctx, 1530, 900, 0.95, t);
    ladderProp(ctx, 1320, 900, 1.0, t);
    flightCase(ctx, 1180, 870, 0.9, t);
    // spike mark and the name card on the floor
    ctx.save();
    ctx.translate(900, 920);
    ctx.strokeStyle = C.rgba(MUSTARD, 0.7); ctx.lineWidth = 7; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(-60, -26); ctx.lineTo(60, 26); ctx.moveTo(60, -26); ctx.lineTo(-60, 26); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    // work light
    const wx = 380 + Math.sin(t * 0.6) * 6;
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx, 0); ctx.lineTo(wx, 250); ctx.stroke();
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(wx - 46, 250); ctx.lineTo(wx + 46, 250); ctx.lineTo(wx + 28, 300); ctx.lineTo(wx - 28, 300); ctx.closePath(); }, { fill: INK, edge: C.rgba(CREAM, 0.4), edgeW: 2 });
    ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(wx, 302, 18, 0, TAU); ctx.fill();
    spotlight(ctx, wx, 300, 520, 30, 210, '#FFE8B0', 0.18, 0);
    dust(ctx, t, 34, 9, 0.2);
  }

  function dressingSet(ctx, t) {
    paperBg(ctx, '#E7C39C', '#D79C74');
    const par = (CAM.x - 960) * 0.15;
    ctx.save();
    ctx.translate(par, 0);
    // wall panels
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? C.rgba(CORAL, 0.12) : C.rgba(CREAM, 0.16);
      ctx.fillRect(i * 260 - 30, 0, 250, 820);
    }
    // mirror frame
    const mx = 980, my = 400, mw = 520, mh = 620;
    paper(ctx, () => tornRectPath(ctx, mx - mw / 2 - 26, my - mh / 2 - 26, mw + 52, mh + 52, 6, 7), {
      fill: CREAM, edge: INK, edgeW: 3, shadow: C.rgba(INK, 0.24), sx: 7, sy: 12,
    });
    // glass: a gradient, a faint reflection and a diagonal glare
    ctx.save();
    ctx.beginPath(); tornRectPath(ctx, mx - mw / 2, my - mh / 2, mw, mh, 4, 11); ctx.clip();
    const mg = ctx.createLinearGradient(mx, my - mh / 2, mx, my + mh / 2);
    mg.addColorStop(0, '#1D4F4A'); mg.addColorStop(0.55, '#0F3532'); mg.addColorStop(1, '#092523');
    ctx.fillStyle = mg; ctx.fillRect(mx - mw / 2, my - mh / 2, mw, mh);
    ctx.globalAlpha = 0.12; ctx.fillStyle = CREAM;
    ctx.beginPath(); ctx.ellipse(mx + 34, my + 92, 84, 198, 0.03, 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.08; ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(mx + 34, my + 38, 54, 68, 0.03, 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.1; ctx.fillStyle = CREAM;
    ctx.beginPath(); ctx.moveTo(mx - 230, my - 280); ctx.lineTo(mx - 70, my - 280); ctx.lineTo(mx - 190, my + 280); ctx.lineTo(mx - 260, my + 280); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 0.07; ctx.fillStyle = CREAM;
    ctx.beginPath(); ctx.ellipse(mx + Math.sin(t * 0.7) * 8, my + 40, 70, 188, 0.04, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = MUSTARD; ctx.lineWidth = 3;
    ctx.beginPath(); tornRectPath(ctx, mx - mw / 2, my - mh / 2, mw, mh, 4, 11); ctx.stroke();
    // bulbs
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU;
      const bx = mx + Math.cos(a) * (mw / 2 + 4);
      const by = my + Math.sin(a) * (mh / 2 + 4);
      const glow = 0.35 + 0.65 * Math.max(0, Math.sin(t * 4 - i * 0.8));
      const g = ctx.createRadialGradient(bx, by, 2, bx, by, 34);
      g.addColorStop(0, C.rgba(MUSTARD, 0.5 * glow)); g.addColorStop(1, C.rgba(MUSTARD, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, 34, 0, TAU); ctx.fill();
      ctx.fillStyle = C.mix(CREAM, MUSTARD, 0.35 + 0.65 * glow); ctx.beginPath(); ctx.arc(bx, by, 8, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.4); ctx.lineWidth = 1.5; ctx.stroke();
    }
    // vanity table
    drawTable(ctx, 960, 760, 980, '#8A4A3A');
    // makeup and the star on the table
    for (let i = 0; i < 5; i++) {
      const x = 660 + i * 92;
      ctx.fillStyle = [CORAL, MUSTARD, TEAL, PINK, CREAM][i];
      ctx.beginPath(); ctx.arc(x, 746, 10 + (i % 2) * 4, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
    }
    // costume rack and door
    costumeRack(ctx, 1540, 870, 0.8, t);
    chairProp(ctx, 860, 900, 0.9, t);
    robeProp(ctx, 1400, 520, 1.0, t);
    bouquetProp(ctx, 1040, 730, 0.55, -0.1, t);
    drawDoor(ctx, 240, 470, 190, 350, t, { fill: '#7A3A2A', light: 0.12 });
    // a poster
    paper(ctx, () => tornRectPath(ctx, 1500, 170, 210, 280, 3, 5), { fill: TEAL, edge: CREAM, edgeW: 3, shadow: C.rgba(INK, 0.2), sx: 5, sy: 8 });
    TY.text(ctx, 'TONIGHT', 1524, 218, 15, { family: 'DMMono', color: MUSTARD, letter: 2 });
    TY.text(ctx, 'NOVA', 1524, 286, 44, { family: 'Archivo Black', color: CREAM });
    TY.text(ctx, 'ONE NIGHT ONLY', 1524, 318, 12, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 1 });
    ctx.restore();
    // floor
    floorPlane(ctx, 820, '#8A4A3A', MUSTARD, t, {});
    dust(ctx, t, 26, 4, 0.18);
  }

  function cueBooth(ctx, t) {
    paperBg(ctx, '#0B1F1E', '#123B3B');
    const par = (CAM.x - 960) * 0.12;
    ctx.save();
    ctx.translate(par, 0);
    for (let i = 0; i < 11; i++) {
      paper(ctx, () => tornRectPath(ctx, i * 190 - 40, 30, 170, 820, 5, i + 3), {
        fill: i % 2 ? '#0C2A28' : '#0A2422', edge: C.rgba(CREAM, 0.1), edgeW: 1.2, shadow: null,
      });
    }
    // window to the stage
    paper(ctx, () => tornRectPath(ctx, 1000, 150, 560, 430, 7, 5), { fill: '#0A2422', edge: CREAM, edgeW: 3, shadow: C.rgba(INK, 0.3), sx: 5, sy: 9 });
    ctx.save();
    ctx.beginPath(); tornRectPath(ctx, 1010, 160, 540, 410, 6, 9); ctx.clip();
    paper(ctx, () => tornRectPath(ctx, 1010, 160, 84, 410, 4, 3), { fill: PAL.redD, edge: C.rgba(INK, 0.3), edgeW: 1.5 });
    paper(ctx, () => tornRectPath(ctx, 1466, 160, 84, 410, 4, 4), { fill: PAL.redD, edge: C.rgba(INK, 0.3), edgeW: 1.5 });
    ctx.save(); ctx.translate(1280, 360);
    paper(ctx, () => starPath(ctx, 0, 0, 150, 0.48, 5), { fill: C.rgba(CREAM, 0.5), edge: C.rgba(MUSTARD, 0.7), edgeW: 4 });
    ctx.restore();
    ctx.fillStyle = '#123B3B'; ctx.fillRect(1010, 500, 540, 70);
    spotlight(ctx, 1280, -40, 700, 20, 220, '#FFF6DC', 0.12, 0);
    ctx.restore();
    ctx.strokeStyle = MUSTARD; ctx.lineWidth = 3;
    ctx.beginPath(); tornRectPath(ctx, 1010, 160, 540, 410, 6, 9); ctx.stroke();
    // desk, switchboard, clock, door, chair
    paper(ctx, () => tornRectPath(ctx, 860, 800, 860, 180, 5, 12), { fill: '#5A3A2A', edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.3), sx: 5, sy: 9 });
    paper(ctx, () => roundRectPath(ctx, 1510, 740, 230, 160, 6), { fill: INK, edge: CREAM, edgeW: 2.5, shadow: C.rgba(INK, 0.3), sx: 4, sy: 7 });
    TY.text(ctx, 'CUE', 1530, 772, 14, { family: 'DMMono', color: MUSTARD, letter: 2 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) {
      const x = 1532 + i * 70, y = 798 + j * 20;
      const on = Math.sin(t * 5 + i * 2 + j) > 0.55;
      ctx.fillStyle = on ? MUSTARD : C.rgba(CREAM, 0.22);
      ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
      if (on) { ctx.fillStyle = C.rgba(MUSTARD, 0.18); ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); }
    }
    stageClock(ctx, 1780, 260, 0.8, t);
    paper(ctx, () => tornRectPath(ctx, 680, 200, 280, 700, 6, 7), { fill: '#0A2A28', edge: CREAM, edgeW: 3, shadow: C.rgba(INK, 0.3), sx: 5, sy: 9 });
    chairProp(ctx, 1450, 1000, 0.8, t);
    paper(ctx, () => tornRectPath(ctx, 900, 820, 120, 30, 2, 7), { fill: CREAM, edge: C.rgba(INK, 0.35), edgeW: 1.2 });
    ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1100, 980); ctx.quadraticCurveTo(1280, 1010, 1450, 980); ctx.stroke();
    ctx.restore();
    dust(ctx, t, 20, 31, 0.12);
  }

  function audienceHead(ctx, x, y, s, flip, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(flip * s, s);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-120, 30); ctx.quadraticCurveTo(-96, -80, 0, -92); ctx.quadraticCurveTo(96, -80, 120, 30); ctx.closePath(); }, {
      fill: '#0B0A0C', edge: C.rgba(CREAM, 0.08), edgeW: 1.5, shadow: C.rgba(INK, 0.4), sx: 4, sy: 8,
    });
    paper(ctx, () => blobPath(ctx, 0, -138, 52, 58, 16, 0.02, 4), { fill: '#0B0A0C', edge: C.rgba(CREAM, 0.1), edgeW: 1.5 });
    // the audience has faces, not just silhouettes
    for (const sx of [-1, 1]) {
      ctx.fillStyle = C.rgba(CREAM, 0.55); ctx.beginPath(); ctx.ellipse(sx * 17, -144, 5, 3.4, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(sx * 17, -146, 2, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = C.rgba(CREAM, 0.32); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, -104, 9, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.strokeStyle = C.rgba(MUSTARD, 0.22); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -138, 52, Math.PI * 1.1, Math.PI * 1.55); ctx.stroke();
    ctx.restore();
  }

  function playbill(ctx, x, y, s, rot, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    paper(ctx, () => tornRectPath(ctx, -70, -95, 140, 190, 3, 13), { fill: CREAM, edge: INK, edgeW: 2.2, shadow: C.rgba(INK, 0.3), sx: 4, sy: 7 });
    TY.text(ctx, 'THE CUE LAMP', -54, -58, 15, { family: 'Archivo Black', color: INK });
    TY.text(ctx, 'ONE NIGHT ONLY', -54, -38, 9, { family: 'DMMono', color: CORAL, letter: 1 });
    paper(ctx, () => starPath(ctx, 0, 34, 38, 0.45, 5), { fill: MUSTARD, edge: INK, edgeW: 2 });
    ctx.restore();
  }

  function phoneProp(ctx, x, y, s, rot, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    paper(ctx, () => roundRectPath(ctx, -30, -56, 60, 112, 9), { fill: INK, edge: C.rgba(CREAM, 0.4), edgeW: 2 });
    ctx.fillStyle = C.rgba(MUSTARD, 0.28 + 0.08 * Math.sin(t * 4)); ctx.fillRect(-22, -46, 44, 92);
    TY.text(ctx, 'NOVA', 0, 0, 12, { family: 'DMMono', color: CREAM, align: 'center', letter: 2 });
    ctx.fillStyle = CORAL; ctx.beginPath(); ctx.arc(0, 28, 4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function stageClock(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, () => { ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); }, { fill: CREAM, edge: INK, edgeW: 3, shadow: C.rgba(INK, 0.25), sx: 2, sy: 4 });
    ctx.fillStyle = INK;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU;
      ctx.save(); ctx.rotate(a); ctx.fillRect(-1.2, -30, 2.4, 6); ctx.restore();
    }
    const hand = (a, len, w) => { ctx.save(); ctx.rotate(a); ctx.fillStyle = INK; ctx.fillRect(-w / 2, -len, w, len); ctx.restore(); };
    hand((t * 0.02 % 1) * TAU, 18, 4);
    hand((t * 0.12 % 1) * TAU, 26, 2.5);
    ctx.fillStyle = CORAL; ctx.beginPath(); ctx.arc(0, 0, 3, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function monitorWedge(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-55, -10); ctx.lineTo(55, -10); ctx.lineTo(38, 30); ctx.lineTo(-38, 30); ctx.closePath(); }, {
      fill: INK, edge: C.rgba(CREAM, 0.55), edgeW: 2, shadow: C.rgba(INK, 0.28), sx: 3, sy: 6,
    });
    ctx.fillStyle = C.rgba(MUSTARD, 0.45 + 0.15 * Math.sin(t * 5)); ctx.beginPath(); ctx.ellipse(0, 10, 32, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba(CREAM, 0.18); ctx.beginPath(); ctx.ellipse(-8, 6, 12, 5, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function fireExtinguisher(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, () => roundRectPath(ctx, -12, -66, 24, 66, 6), { fill: CORAL, edge: INK, edgeW: 2, shadow: C.rgba(INK, 0.28), sx: 2, sy: 4 });
    ctx.fillStyle = INK; ctx.fillRect(-9, -78, 18, 12);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -78); ctx.quadraticCurveTo(20, -64, 16, -44); ctx.stroke();
    ctx.fillStyle = CREAM; ctx.fillRect(-9, -38, 18, 15);
    TY.text(ctx, 'FIRE', 0, -26, 8, { family: 'DMMono', color: INK, align: 'center', letter: 1 });
    ctx.restore();
  }

  function ladderProp(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-22, -320); ctx.lineTo(-22, 0); ctx.moveTo(22, -320); ctx.lineTo(22, 0); ctx.stroke();
    ctx.strokeStyle = C.rgba(CREAM, 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) { const yy = -300 + i * 44; ctx.beginPath(); ctx.moveTo(-22, yy); ctx.lineTo(22, yy); ctx.stroke(); }
    ctx.restore();
  }

  function flightCase(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, () => roundRectPath(ctx, -62, -52, 124, 52, 4), { fill: INK, edge: C.rgba(CREAM, 0.45), edgeW: 2, shadow: C.rgba(INK, 0.28), sx: 4, sy: 7 });
    ctx.fillStyle = GOLD; ctx.fillRect(-8, -52, 16, 52);
    ctx.strokeStyle = C.rgba(CREAM, 0.25); ctx.lineWidth = 2; ctx.strokeRect(-52, -42, 104, 32);
    TY.text(ctx, 'CUE', 0, -16, 16, { family: 'Archivo Black', color: CREAM, align: 'center', letter: 2 });
    ctx.restore();
  }

  function chairProp(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    paper(ctx, () => roundRectPath(ctx, -40, -104, 80, 58, 7), { fill: CORAL, edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.25), sx: 3, sy: 6 });
    paper(ctx, () => roundRectPath(ctx, -40, -46, 80, 18, 4), { fill: CORAL, edge: INK, edgeW: 2.5 });
    ctx.fillStyle = INK; ctx.fillRect(-34, -28, 8, 56); ctx.fillRect(26, -28, 8, 56);
    ctx.fillStyle = GOLD; ctx.fillRect(-30, -46, 60, 3);
    ctx.restore();
  }

  function robeProp(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -34, 6, 0, TAU); ctx.stroke();
    const sway = Math.sin(t * 1.2) * 3;
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-46, 0); ctx.quadraticCurveTo(-54, 90, -30 + sway, 190); ctx.lineTo(30 + sway, 190); ctx.quadraticCurveTo(54, 90, 46, 0); ctx.closePath(); }, {
      fill: CREAM, edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.22), sx: 3, sy: 6,
    });
    ctx.fillStyle = CORAL; ctx.fillRect(-40, 70, 80, 6);
    ctx.restore();
  }

  function bouquetProp(ctx, x, y, s, rot, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const cols = [CORAL, MUSTARD, CREAM, PINK, CORAL, MUSTARD];
    for (let i = 0; i < 6; i++) {
      const a = -1.2 + i * 0.48;
      const len = 62 + (i % 3) * 12;
      ctx.strokeStyle = TEAL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 28); ctx.quadraticCurveTo(Math.sin(a) * 18, -len * 0.3, Math.sin(a) * len, -len); ctx.stroke();
      const fx = Math.sin(a) * len, fy = -len;
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(a * 0.2);
      for (let k = 0; k < 6; k++) {
        ctx.save(); ctx.rotate(k / 6 * TAU);
        ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.ellipse(0, -9, 5, 9, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
      ctx.restore();
    }
    paper(ctx, () => tornRectPath(ctx, -26, 20, 52, 56, 3, 11), { fill: CREAM, edge: INK, edgeW: 2, shadow: C.rgba(INK, 0.22), sx: 2, sy: 4 });
    ctx.fillStyle = CORAL; ctx.fillRect(-26, 30, 52, 5);
    ctx.restore();
  }

  function kpopStage(ctx, t, o = {}) {
    const sky = o.sky || TEAL_D;
    const sky2 = o.sky2 || '#123B3B';
    paperBg(ctx, sky, sky2);
    sunburst(ctx, W / 2, 470, 0, 1400, 28, o.rayA || '#0A4A44', o.rayB || '#2FAE9A', (o.rot || 0) + t * 0.03, 0.9);
    // the giant paper star is the stage's identity
    const glow = o.starGlow ?? 0.12;
    ctx.save();
    ctx.translate(W / 2, 470);
    ctx.rotate(t * 0.01);
    paper(ctx, () => starPath(ctx, 0, 0, 430, 0.48, 5), {
      fill: C.rgba(CREAM, 0.55 + glow * 0.5), edge: C.rgba(MUSTARD, 0.7), edgeW: 7, shadow: null,
    });
    paper(ctx, () => starPath(ctx, 0, 0, 300, 0.48, 5), { fill: C.rgba(MUSTARD, 0.4 + glow * 0.4), edge: C.rgba(INK, 0.35), edgeW: 3, shadow: null });
    ctx.save();
    ctx.beginPath(); starPath(ctx, 0, 0, 430, 0.48, 5); ctx.clip();
    halftone(ctx, -430, -430, 860, 860, C.rgba(INK, 0.08), 14, 0.55, 0.08);
    ctx.restore();
    ctx.restore();
    halftone(ctx, 0, 0, W, H, C.rgba(INK, 0.035), 12, 0.5, 0.05);
    // floor
    floorPlane(ctx, 800, o.floor || '#123B3B', MUSTARD, t, {});
    ctx.strokeStyle = C.rgba(CREAM, 0.2); ctx.lineWidth = 2;
    for (let i = -2; i < 12; i++) {
      ctx.beginPath(); ctx.moveTo(i * 190, 800); ctx.lineTo(-420 + i * 260, H + 60); ctx.stroke();
    }
    for (let j = 0; j < 5; j++) {
      const yy = 820 + Math.pow(j / 4, 1.6) * 280;
      ctx.beginPath(); ctx.moveTo(-80, yy); ctx.lineTo(W + 80, yy); ctx.stroke();
    }
    // tape marks and a cable on the floor
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(160, 930); ctx.quadraticCurveTo(560, 990, 930, 940); ctx.stroke();
    paper(ctx, () => tornRectPath(ctx, 640, 930, 92, 10, 1, 6), { fill: MUSTARD, edge: null, shadow: null });
    paper(ctx, () => tornRectPath(ctx, 1120, 960, 74, 10, 1, 8), { fill: MUSTARD, edge: null, shadow: null });
    // stage lip
    paper(ctx, () => tornRectPath(ctx, -60, 786, W + 120, 30, 6, 21), { fill: MUSTARD, edge: C.rgba(INK, 0.4), edgeW: 2, shadow: C.rgba(INK, 0.25), sx: 0, sy: 8 });
    // proscenium towers and a light truss
    paper(ctx, () => tornRectPath(ctx, -40, 70, 170, 780, 7, 3), { fill: PAL.redD, edge: C.rgba(INK, 0.32), edgeW: 2, shadow: C.rgba(INK, 0.25), sx: 4, sy: 8 });
    paper(ctx, () => tornRectPath(ctx, W - 130, 70, 170, 780, 7, 4), { fill: PAL.redD, edge: C.rgba(INK, 0.32), edgeW: 2, shadow: C.rgba(INK, 0.25), sx: 4, sy: 8 });
    ctx.fillStyle = MUSTARD; ctx.fillRect(96, 70, 8, 780); ctx.fillRect(W - 104, 70, 8, 780);
    for (let i = 0; i < 7; i++) {
      const y = 150 + i * 92;
      ctx.fillStyle = C.rgba(MUSTARD, 0.35); ctx.beginPath(); ctx.arc(58, y, 10, 0, TAU); ctx.fill();
      ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(58, y, 4, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 58, y, 4, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = INK; ctx.fillRect(-40, 66, W + 80, 14);
    for (let i = 0; i < 8; i++) {
      const x = 180 + i * 220;
      ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.arc(x, 73, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba(MUSTARD, 0.18); ctx.beginPath(); ctx.arc(x, 73, 12, 0, TAU); ctx.fill();
    }
    paper(ctx, () => tornRectPath(ctx, -40, -30, W + 80, 58, 8, 5), { fill: CREAM, edge: INK, edgeW: 2.5, shadow: C.rgba(INK, 0.22), sx: 0, sy: 6 });
    stageClock(ctx, 58, 410, 0.85, t);
    monitorWedge(ctx, 700, 840, 0.95, t);
    monitorWedge(ctx, 1220, 840, 0.95, t);
    fireExtinguisher(ctx, 210, 900, 0.9, t);
    // speakers
    speakerStack(ctx, 148, 960, 1.0, INK, CORAL);
    speakerStack(ctx, 1772, 960, 1.0, INK, CORAL);
    // spotlights
    spotlight(ctx, 250, -40, 1150, 40, 420, '#FFF6DC', 0.14, -0.35);
    spotlight(ctx, W - 250, -40, 1150, 40, 420, '#FFF6DC', 0.14, 0.35);
    // footlights
    for (let i = 0; i < 11; i++) {
      const x = 180 + i * 156;
      const p = 0.35 + 0.65 * Math.max(0, Math.sin(t * 5 - i * 0.7));
      ctx.fillStyle = C.rgba(MUSTARD, 0.5 * p); ctx.beginPath(); ctx.arc(x, 806, 16, 0, TAU); ctx.fill();
      ctx.fillStyle = C.mix(CREAM, MUSTARD, p); ctx.beginPath(); ctx.arc(x, 806, 5, 0, TAU); ctx.fill();
    }
    if (o.crowd !== false) crowd(ctx, t, o.crowdY || 1060, '#08060A', 24);
    if (o.confetti) confetti(ctx, t, o.confetti, [CREAM, MUSTARD, CORAL, '#2FAE9A']);
    // proscenium
    paper(ctx, () => tornRectPath(ctx, -40, -30, W + 80, 40, 8, 5), { fill: o.prosc || PAL.paper, edge: null, shadow: C.rgba(INK, 0.2), sx: 0, sy: 6 });
  }

  function curtainPanel(ctx, x0, x1, side, t, col) {
    const w = x1 - x0;
    if (w <= 1) return;
    const n = Math.max(2, Math.round(w / 90));
    for (let i = 0; i < n; i++) {
      const a = x0 + (i / n) * w;
      const b = x0 + ((i + 1) / n) * w;
      const sway = Math.sin(t * 1.2 + i * 0.9) * 7;
      ctx.beginPath();
      ctx.moveTo(a, -20);
      ctx.quadraticCurveTo(a + (b - a) * 0.5 + sway, H * 0.5, a + (b - a) * 0.16, H + 20);
      ctx.lineTo(b, H + 20);
      ctx.quadraticCurveTo(b - (b - a) * 0.18 + sway, H * 0.5, b, -20);
      ctx.closePath();
      ctx.fillStyle = i % 2 ? col : C.shade(col, -18);
      ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.24); ctx.lineWidth = 2; ctx.stroke();
    }
  }

  function stageCurtain(ctx, open, t, col = PAL.redD) {
    const mid = W / 2;
    curtainPanel(ctx, 0, mid - open * mid, -1, t, col);
    curtainPanel(ctx, mid + open * mid, W, 1, t, col);
    // valance
    paper(ctx, () => tornRectPath(ctx, -40, -24, W + 80, 92, 7, 31), {
      fill: col, edge: C.rgba(INK, 0.3), edgeW: 2, shadow: C.rgba(INK, 0.24), sx: 0, sy: 8,
    });
    ctx.fillStyle = MUSTARD; ctx.fillRect(-40, 58, W + 80, 7);
    ctx.strokeStyle = C.rgba(CREAM, 0.35); ctx.lineWidth = 2;
    for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(i * 112, 64); ctx.lineTo(i * 112 + 52, 64); ctx.stroke(); }
  }

  function frontRow(ctx, t, turn = 0) {
    const cols = [CORAL, TEAL, MUSTARD];
    for (let i = 0; i < 3; i++) {
      const x = 430 + i * 530;
      const y = 1010;
      const tilt = (turn - 0.5) * 0.35 + Math.sin(t * 1.3 + i) * 0.04;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      // shoulders
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-110, 20); ctx.quadraticCurveTo(-80, -70, 0, -78); ctx.quadraticCurveTo(80, -70, 110, 20); ctx.closePath(); }, {
        fill: cols[i], edge: C.rgba(INK, 0.6), edgeW: 2.5, shadow: C.rgba(INK, 0.3), sx: 5, sy: 8,
      });
      // head
      paper(ctx, () => blobPath(ctx, 0, -118, 46, 52, 16, 0.02, i + 3), { fill: '#E8B98C', edge: C.rgba(INK, 0.6), edgeW: 2.5 });
      // hair
      paper(ctx, () => { ctx.beginPath(); ctx.arc(0, -126, 48, Math.PI, TAU); ctx.lineTo(46, -102); ctx.quadraticCurveTo(0, -112, -46, -102); ctx.closePath(); }, { fill: INK, edge: C.rgba(INK, 0.6), edgeW: 1.5 });
      // eyes look up at the stage
      for (const sx of [-1, 1]) {
        ctx.fillStyle = CREAM; ctx.beginPath(); ctx.ellipse(sx * 16, -118, 8, 9, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(sx * 16, -122, 4, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, -100, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.restore();
    }
  }

  /* ---------- the three non-stage worlds ---------- */

  // s1: the auditorium, the closed curtain, the cue lamp on the apron
  function frontHouse(ctx, t) {
    paperBg(ctx, '#0B0A0C', '#1A120D');
    ctx.fillStyle = '#120D0A'; ctx.fillRect(0, 0, W, H);
    const mid = W / 2;
    curtainPanel(ctx, 0, mid, -1, t, PAL.redD);
    curtainPanel(ctx, mid, W, 1, t, PAL.redD);
    paper(ctx, () => tornRectPath(ctx, -40, -20, W + 80, 86, 7, 31), { fill: PAL.redD, edge: C.rgba(INK, .3), edgeW: 2, shadow: C.rgba(INK, .24), sx: 0, sy: 8 });
    ctx.fillStyle = MUSTARD; ctx.fillRect(-40, 54, W + 80, 6);
    ctx.fillStyle = '#0A0807'; ctx.fillRect(0, 930, W, 150);
    for (let i = 0; i < 11; i++) {
      const x = 80 + i * 176;
      const g = ctx.createRadialGradient(x, 930, 2, x, 930, 26);
      g.addColorStop(0, C.rgba(MUSTARD, .8)); g.addColorStop(1, C.rgba(MUSTARD, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 930, 26, 0, TAU); ctx.fill();
    }
    for (let i = 0; i < 7; i++) {
      const x = 60 + i * 300, y = 1080;
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(x - 120, y); ctx.quadraticCurveTo(x - 120, y - 120, x, y - 130); ctx.quadraticCurveTo(x + 120, y - 120, x + 120, y); ctx.closePath(); }, { fill: '#1C0E0C', edge: C.rgba(MUSTARD, .18), edgeW: 2 });
    }
    dust(ctx, t, 26, 13, .12);
  }

  // s6: the stage seen from the wings, framed by the fly tower and the tabs
  function wingReveal(ctx, t) {
    paperBg(ctx, '#050D0C', '#0A1A17');
    ctx.save();
    ctx.translate(600, 500); ctx.scale(0.62, 0.62); ctx.translate(-960, -520);
    kpopStage(ctx, t, { starGlow: 0.16, confetti: 30, crowd: false });
    ctx.restore();
    // the right third is the wing: dark floor, fly rail, ropes, sandbags
    ctx.fillStyle = '#050A09'; ctx.fillRect(1150, 0, W - 1150, H);
    ctx.strokeStyle = C.rgba(MUSTARD, .20); ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(1200 + i * 150, 0); ctx.lineTo(1200 + i * 150, 820); ctx.stroke(); }
    for (let i = 0; i < 4; i++) { ctx.fillStyle = '#1A1410'; ctx.beginPath(); ctx.ellipse(1210 + i * 150, 840, 24, 32, 0, 0, TAU); ctx.fill(); }
    curtainPanel(ctx, 0, 110, -1, t, PAL.redD);
    curtainPanel(ctx, W - 110, W, 1, t, PAL.redD);
    ctx.fillStyle = '#050A09'; ctx.fillRect(0, 0, W, 120);
    ctx.fillStyle = PAL.gold; ctx.fillRect(0, 118, W, 4);
    ctx.fillStyle = '#06100E'; ctx.fillRect(0, 900, W, 180);
    crowd(ctx, t, 1040, '#08060A', 22);
    dust(ctx, t, 36, 19, .16);
  }

  // s7: the stage-front close-up, a dark tab and one spotlight
  function stageFront(ctx, t) {
    paperBg(ctx, '#061A18', '#0A2A26');
    for (let i = 0; i < 12; i++) {
      const x = i * 160;
      ctx.fillStyle = i % 2 ? '#0B2A26' : '#08211E';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 40, 500, x, 1080); ctx.lineTo(x + 160, 1080); ctx.quadraticCurveTo(x + 200, 500, x + 160, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, .25); ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = PAL.gold; ctx.fillRect(0, 0, W, 10);
    ctx.fillStyle = '#04100E'; ctx.fillRect(0, 930, W, 150);
    const g = ctx.createRadialGradient(980, 500, 40, 980, 500, 560);
    g.addColorStop(0, C.rgba(MUSTARD, .16)); g.addColorStop(1, C.rgba(MUSTARD, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    dust(ctx, t, 30, 23, .14);
  }

  /* ---------- 1. 0.00–3.68 — every night the cue lamp calls one name ---------- */
  scene({
    id: 's1', start: 0, end: 3.68, line: 0, cast: 'NOVA',
    draw(t, lt, dur) {
      const lampOn = syncLocal('s1', 'lampOn');
      const crowdSettle = syncLocal('s1', 'crowdSettle');
      const lampTurn = syncLocal('s1', 'lampTurn');
      const beamSweep = syncLocal('s1', 'beamSweep');
      const cardDrop = syncLocal('s1', 'cardDrop');
      const spotNova = syncLocal('s1', 'spotNova');
      const novaStep = syncLocal('s1', 'novaStep');

      // close on the lamp, then pull back to the stage; the pull starts on "cue"
      const pull = C.ease(C.clamp((lt - lampOn) / (beamSweep - lampOn)));
      const camX = C.lerp(500, 960, pull);
      const camY = C.lerp(760, 540, pull);
      const camZ = C.lerp(2.26, 1.0, pull);
      setCam(camX, camY, camZ, C.lerp(-0.012, 0.004, pull), 1.5, t);
      beginCam(ctx);
      frontHouse(ctx, t);

      const stepK = C.easeOut(C.clamp((lt - novaStep) / 0.45));
      const nx = 960 + 120 * stepK;
      const spotK = C.easeOut(C.clamp((lt - spotNova) / 0.22));

      // the stage is dark until the lamp clicks on; then a pool around Nova
      const lampK = C.easeOut(C.clamp((lt - lampOn) / 0.35));
      if (lampK < 1) {
        ctx.fillStyle = C.rgba(INK, 0.62 * (1 - lampK));
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }
      if (spotK > 0) {
        const pool = ctx.createRadialGradient(nx, GROUND - 260, 80, nx, GROUND - 260, 520);
        pool.addColorStop(0, C.rgba(INK, 0));
        pool.addColorStop(0.45, C.rgba(INK, 0.08 * spotK));
        pool.addColorStop(1, C.rgba(INK, 0.72 * spotK));
        ctx.fillStyle = pool;
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }

      // the cue lamp is the subject of the first half
      const headTurn = C.kf(lt, [[0, -0.25], [lampTurn, 0.08], [beamSweep, 0.52], [dur, 0.6]]);
      cueLamp(ctx, 500, 900, 1.8, t, {
        rot: headTurn,
        glow: 0.12 + 0.88 * lampK + 0.06 * Math.sin(t * 11) * (1 - lampK * 0.5),
        card: 'NOVA',
        cardOut: C.easeOut(C.clamp((lt - cardDrop) / 0.38)),
      });
      if (lt < lampOn) {
        const f = Math.max(0, Math.sin(lt * 50));
        ctx.fillStyle = C.rgba(MUSTARD, 0.35 * f);
        ctx.beginPath(); ctx.arc(500, 750, 8 + 4 * f, 0, TAU); ctx.fill();
      }
      // the beam finds Nova on "one"
      if (spotK > 0) {
        ctx.save(); ctx.globalAlpha = spotK;
        spotlight(ctx, nx, -40, 1200, 24, 300, '#FFF6DC', 0.35, 0);
        ctx.restore();
      }
      // Nova waits in the right wing, then steps into the light on "name"
      const np = poseAt(lt, [
        [0, POSES.nova.idle],
        [0.75, POSES.nova.hip],
        [lampTurn, POSES.nova.reach],
        [spotNova, POSES.nova.duetLeft],
        [novaStep, POSES.nova.point],
      ]);
      contactShadow(ctx, nx, GROUND, 1.1, 60);
      nova(ctx, nx, GROUND, 1.1, t, np, faceAt(lt, [
        { t: 0, f: FACES.narrow },
        { t: spotNova, f: FACES.surprise },
        { t: novaStep, f: FACES.star },
      ], { blink: blinkAt(t, 1) }));
      // Mira at the desk; she looks up when the beam finds Nova
      const mp = P(IDLE_MIRA, {
        armL: [-0.1, 0.1], armR: [-0.6, -0.9],
        headTilt: C.kf(lt, [[0, -0.03], [spotNova, 0.04]]),
        headTurn: C.kf(lt, [[0, -0.1], [spotNova, 0.08]]),
        hairSwing: 2,
      });
      contactShadow(ctx, 1550, GROUND, 0.9, 50);
      mira(ctx, 1550, GROUND, 0.9, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: spotNova, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 2) }));
      const mh = miraHand(1550, GROUND, 0.9, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 72, 0.62, -0.08, t);
      dust(ctx, t, 36, 3);
      endCam(ctx);

      TY.type(ctx, 'EVERY NIGHT', 150, 190, 110, {
        color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 5,
        perChar: (i) => C.clamp((t - lampOn - i * 0.03) / 0.28),
      });
      TY.text(ctx, 'A CUE-LAMP STORY', 156, 250, 20, { family: 'DMMono', color: MUSTARD, letter: 4 });
      TY.text(ctx, 'CUE 01', 156, 282, 14, { family: 'DMMono', color: C.rgba(CREAM, 0.6), letter: 2 });
      TY.sticker(ctx, 'ONE NAME', 1200, 600, 34, { fill: CORAL, text: CREAM, seed: 7, rot: -0.04, time: t });
    },
  });

  /* ---------- 2. 3.68–6.42 — the stage holds its breath, from the audience ---------- */
  scene({
    id: 's2', start: 3.68, end: 6.42, line: 1, cast: 'NOVA',
    draw(t, lt, dur) {
      const step2 = syncLocal('s2', 'novaStep2');
      const starPulse = syncLocal('s2', 'starPulse');
      const miraLook = syncLocal('s2', 'miraLook');
      const stageReveal = syncLocal('s2', 'stageReveal');
      const crowdInhale = syncLocal('s2', 'crowdInhale');
      const novaBreath = syncLocal('s2', 'novaBreath');

      const push = C.ease(C.clamp(lt / dur));
      setCam(960, 600, C.lerp(1.02, 1.10, push), C.kf(lt, [[0, 0.02], [dur, -0.015]]), 1.2, t);
      beginCam(ctx);

      // the stage, far away, seen from the audience
      ctx.save();
      ctx.translate(960, 560);
      ctx.scale(0.58, 0.58);
      ctx.translate(-960, -540);
      kpopStage(ctx, t, { starGlow: 0.1 + 0.08 * C.bpmPulse(t, 4), confetti: 18, crowd: false });
      if (lt > starPulse) {
        const p = Math.max(0, Math.sin((lt - starPulse) * 8));
        ctx.save(); ctx.globalAlpha = 0.16 * p;
        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(960, 470, 430 + 10 * p, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      const holdK = C.easeOut(C.clamp((lt - crowdInhale) / 0.5));
      if (holdK > 0) {
        ctx.fillStyle = C.rgba(INK, 0.16 * holdK);
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }
      const lampRot = C.kf(lt, [[0, 0.5], [miraLook, 0.42], [crowdInhale, 0.35], [dur, 0.3]]);
      cueLamp(ctx, 500, 900, 1.8, t, {
        rot: lampRot, glow: 0.8 + 0.2 * C.bpmPulse(t, 3),
        card: 'NOVA', cardOut: 1,
      });
      const nx = 1350 - 60 * C.easeOut(C.clamp(lt / stageReveal));
      const walk = walkPose(IDLE_NOVA, lt, 8.5, 1, 0);
      const np = P(walk, {
        headTilt: 0.04, headTurn: 0.1, hairSwing: 8,
        armL: C.kf(lt, [[0, [0.3, 0.1]], [crowdInhale, [0.65, -0.65]], [novaBreath, [0.25, 0.05]], [dur, [0.25, 0.05]]]),
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [crowdInhale, [-0.65, 0.85]], [novaBreath, [0.25, 1.0]], [dur, [0.25, 1.0]]]),
        footL: [-36, -39], footR: [36, -39],
      });
      contactShadow(ctx, nx, GROUND, 1.05, 58);
      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [1, -0.1] } },
        { t: stageReveal, f: { eyes: 'normal', mouth: 'flat', blush: 0.35, look: [1, 0] } },
        { t: novaBreath, f: { eyes: 'closed', mouth: 'flat', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 3) }));
      const mp = P(IDLE_MIRA, {
        armL: [-0.1, 0.1], armR: [-0.6, -0.9],
        headTilt: C.kf(lt, [[0, -0.03], [miraLook, 0.05]]),
        headTurn: C.kf(lt, [[0, -0.1], [miraLook, 0.12]]),
        hairSwing: 2,
      });
      contactShadow(ctx, 1550, GROUND, 0.9, 50);
      mira(ctx, 1550, GROUND, 0.9, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: miraLook, f: { eyes: 'wide', mouth: 'o', blush: 0.35, look: [1, 0] } },
      ], { blink: blinkAt(t, 4) }));
      const mh = miraHand(1550, GROUND, 0.9, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 72, 0.62, -0.08, t);
      ctx.restore();

      // the audience, in front of the stage
      const rise = 10 * C.easeOut(C.clamp((lt - crowdInhale) / 0.5));
      audienceHead(ctx, 250, 1010 - rise, 1.0, 1, t);
      audienceHead(ctx, 1670, 1010 - rise, 1.0, -1, t);
      audienceHead(ctx, 960, 1050 - rise, 1.1, 1, t);
      playbill(ctx, 250, 920 - rise, 0.9, -0.08, t);
      phoneProp(ctx, 1670, 920 - rise, 0.9, 0.06, t);
      endCam(ctx);

      TY.type(ctx, 'THE STAGE', 150, 190, 110, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 9,
        perChar: (i) => C.clamp((t - (3.68 + stageReveal) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'HOLDS ITS BREATH', 150, 310, 90, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 11,
        perChar: (i) => C.clamp((t - (3.68 + crowdInhale) - i * 0.03) / 0.4),
      });
      if (t > 3.68 + crowdInhale) {
        TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 156, 370, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });
      }
      TY.sticker(ctx, 'HOLD', 1600, 700, 34, { fill: CORAL, text: CREAM, seed: 7, rot: 0.04, time: t });
    },
  });

  /* ---------- 3. 6.42–10.44 — the wings were empty ---------- */
  scene({
    id: 's3', start: 6.42, end: 10.44, line: 2, cast: 'MIRA',
    draw(t, lt, dur) {
      const tonight = syncLocal('s3', 'workLight');
      const beamEnter = syncLocal('s3', 'beamEnter');
      const cardFlutter = syncLocal('s3', 'cardFlutter');
      const miraLook = syncLocal('s3', 'miraLook');
      const starFall = syncLocal('s3', 'starFall');
      const starLand = syncLocal('s3', 'starLand');

      setCam(C.kf(lt, [[0, 1110], [dur, 820]]), 560, C.kf(lt, [[0, 1.02], [dur, 1.2]]), C.kf(lt, [[0, 0], [dur, 0.015]]), 1.5, t);
      beginCam(ctx);
      wingSet(ctx, t);
      // the work light flickers on "tonight"
      if (lt > tonight) {
        const fk = C.clamp((lt - tonight) / 0.3);
        const g = ctx.createRadialGradient(380, 300, 4, 380, 300, 180);
        g.addColorStop(0, C.rgba(MUSTARD, 0.4 * fk)); g.addColorStop(1, C.rgba(MUSTARD, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(380, 300, 180, 0, TAU); ctx.fill();
      }
      // the lamp beam enters the wing on "lamp"
      if (lt > beamEnter) {
        ctx.save(); ctx.globalAlpha = C.easeOut(C.clamp((lt - beamEnter) / 0.3));
        spotlight(ctx, 1800, -40, 1200, 30, 360, '#FFF6DC', 0.18, 0.35);
        ctx.restore();
      }
      // Mira walks to the empty mark; she reaches it on "Nova"
      const mx = 1380 - 260 * C.easeOut(C.clamp(lt / miraLook));
      const mp = poseAt(lt, [
        [0, POSES.mira.step],
        [0.55, POSES.mira.hip],
        [miraLook, POSES.mira.listen],
        [starFall, POSES.mira.point],
        [starLand, POSES.mira.listen],
      ]);
      contactShadow(ctx, mx, GROUND, 1.12, 62);
      mira(ctx, mx, GROUND, 1.12, t, mp, faceAt(lt, [
        { t: 0, f: FACES.neutral },
        { t: miraLook, f: FACES.surprise },
        { t: starFall, f: FACES.alarm },
        { t: starLand, f: FACES.narrow },
      ], { blink: blinkAt(t, 5) }));
      const mh = miraHand(mx, GROUND, 1.12, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 86, 0.8, -0.1, t);
      // the name card flutters on "called"
      const flutter = lt > cardFlutter ? Math.sin((lt - cardFlutter) * 16) * 7 * Math.max(0, 1 - (lt - cardFlutter) * 1.6) : 0;
      paper(ctx, () => tornRectPath(ctx, 760 + flutter, 900, 120, 44, 2, 21), { fill: CREAM, edge: INK, edgeW: 2, shadow: C.rgba(INK, 0.3), sx: 3, sy: 5 });
      TY.text(ctx, 'NOVA', 820 + flutter, 930, 22, { family: 'Archivo Black', color: INK, align: 'center', letter: 1 });
      // the star falls on "were" and lands on "empty"
      if (lt > starFall) {
        const u = C.clamp((lt - starFall) / (starLand - starFall));
        const sy = C.lerp(500, 900, C.easeIn(u));
        const bounce = lt > starLand ? Math.abs(Math.sin((lt - starLand) * 12)) * 18 * Math.max(0, 1 - (lt - starLand) * 1.4) : 0;
        starProp(ctx, 900, sy - bounce, 0.72, (lt - starFall) * 3.2, t, 0.6);
      }
      dust(ctx, t, 36, 11, 0.22);
      endCam(ctx);

      TY.type(ctx, 'THE WINGS', 1090, 180, 120, {
        color: CREAM, edge: CORAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 13,
        perChar: (i) => C.clamp((t - 6.5 - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'WERE EMPTY', 1090, 300, 120, {
        color: CORAL, edge: CREAM, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 17,
        perChar: (i) => C.clamp((t - 9.1 - i * 0.03) / 0.4),
      });
      TY.text(ctx, 'THE NAME CARD WAS STILL ON THE FLOOR', 120, 560, 17, { family: 'DMMono', color: C.rgba(CREAM, 0.65), letter: 2 });
      // NOVA? sticker on the empty mark
      ctx.save();
      ctx.translate(850, 900);
      ctx.rotate(-0.08);
      TY.sticker(ctx, 'NOVA?', 0, 0, 52, { fill: MUSTARD, text: INK, seed: 5, rot: 0, time: t });
      ctx.restore();
    },
  });

  /* ---------- 4. 10.44–12.26 — Mira picks up the star ---------- */
  scene({
    id: 's4', start: 10.44, end: 12.26, line: 3, cast: 'MIRA',
    draw(t, lt, dur) {
      const miraEnter = syncLocal('s4', 'miraEnter');
      const miraReach = syncLocal('s4', 'miraReach');
      const starLift = syncLocal('s4', 'starLift');
      const starGlow = syncLocal('s4', 'starGlow');
      setCam(C.kf(lt, [[0, 960], [dur, 900]]), C.kf(lt, [[0, 540], [dur, 520]]), C.kf(lt, [[0, 1.0], [dur, 1.2]]), C.kf(lt, [[0, 0], [dur, 0.015]]), 1.2, t);
      beginCam(ctx);
      dressingSet(ctx, t);
      // Nova at the vanity, head down, then looks up on "star"
      const np = poseAt(lt, [
        [0, POSES.nova.bow],
        [starGlow, POSES.nova.idle],
        [starGlow + 0.25, POSES.nova.duetLeft],
      ]);
      contactShadow(ctx, 760, GROUND, 1.12, 62);
      nova(ctx, 760, GROUND, 1.12, t, np, faceAt(lt, [
        { t: 0, f: FACES.narrow },
        { t: starGlow, f: FACES.surprise },
        { t: starGlow + 0.25, f: FACES.tender },
      ], { blink: blinkAt(t, 3) }));
      // Mira walks in and picks up the star on "picked"; it lifts on "up"
      const mx = 1470 - 220 * C.easeOut(C.clamp((lt - miraEnter) / (starLift - miraEnter)));
      const mp = poseAt(lt, [
        [0, POSES.mira.step],
        [miraReach, POSES.mira.point],
        [starGlow, POSES.mira.duetLeft],
      ]);
      contactShadow(ctx, mx, GROUND + 30, 1.0, 54);
      mira(ctx, mx, GROUND + 30, 1.0, t, mp, faceAt(lt, [
        { t: 0, f: FACES.neutral },
        { t: miraReach, f: FACES.surprise },
        { t: starGlow, f: FACES.smile },
      ], { blink: blinkAt(t, 4) }));
      // the star on the vanity, then in Mira's hand
      const mh = miraHand(mx, GROUND, 1.05, mp, 'L');
      const pick = C.easeOut(C.clamp((lt - miraReach) / (starLift - miraReach)));
      const starX = C.lerp(1130, mh[0], pick);
      const starY = C.lerp(745, mh[1] - 18, pick);
      ctx.save(); ctx.fillStyle = C.rgba(INK, 0.24); ctx.beginPath(); ctx.ellipse(starX, 758, 52, 8, 0, 0, TAU); ctx.fill(); ctx.restore();
      starProp(ctx, starX, starY, 0.8, lt * 0.7, t, 0.5 + 0.5 * pick);
      if (pick > 0.8) grip(ctx, mh[0], mh[1], 0.95, '#E8B98C');
      dust(ctx, t, 24, 15, 0.16);
      endCam(ctx);

      TY.type(ctx, 'SO MIRA PICKED UP', 120, 170, 104, {
        color: INK, edge: CREAM, edgeW: 7, shadow: C.rgba(INK, 0.22),
        time: t, charRot: 0.02, jitter: 1, seed: 19,
        perChar: (i) => C.clamp((t - 10.5 - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'THE STAR', 120, 290, 104, {
        color: CORAL, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.22),
        time: t, charRot: 0.02, jitter: 1, seed: 23,
        perChar: (i) => C.clamp((t - 11.0 - i * 0.03) / 0.4),
      });
      TY.text(ctx, 'THE DRESSING ROOM, 7:58 PM', 126, 350, 17, { family: 'DMMono', color: C.rgba(INK, 0.65), letter: 2 });
      TY.sticker(ctx, '7:58', 1180, 620, 28, { fill: TEAL, text: CREAM, seed: 7, rot: 0.05, time: t });
    },
  });

  /* ---------- 5. 12.26–13.90 — put it in her hand ---------- */
  scene({
    id: 's5', start: 12.26, end: 13.9, line: 4, cast: 'NOVA + MIRA',
    draw(t, lt, dur) {
      const miraExtend = syncLocal('s5', 'miraExtend');
      const novaOpen = syncLocal('s5', 'novaOpen');
      const starHand = syncLocal('s5', 'starHand');
      setCam(C.kf(lt, [[0, 980], [dur, 940]]), C.kf(lt, [[0, 560], [dur, 540]]), C.kf(lt, [[0, 1.0], [dur, 1.08]]), C.kf(lt, [[0, -0.008], [dur, 0.008]]), 1.5, t);
      beginCam(ctx);
      // warm dressing-room bokeh, close
      dressingSet(ctx, t);
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#D79C74'; ctx.fillRect(0, 0, W, H); ctx.restore();
      for (let i = 0; i < 8; i++) {
        const x = 120 + C.hash(i * 4.1) * 1680 + Math.sin(t * 0.3 + i) * 18;
        const y = 120 + C.hash(i * 7.7) * 700 + Math.cos(t * 0.25 + i) * 12;
        const r = 26 + C.hash(i * 3.3) * 70;
        const g = ctx.createRadialGradient(x, y, 2, x, y, r);
        g.addColorStop(0, C.rgba(MUSTARD, 0.12)); g.addColorStop(1, C.rgba(MUSTARD, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      }
      // two figures, close
      const np = P(IDLE_NOVA, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 6,
        sway: 3, lean: 0.02, headTilt: 0.04, headTurn: 0.16, hairSwing: 10,
        armL: [0.25, 0.1], armR: C.kf(lt, [[0, [-0.35, 0.5]], [Math.max(0.02, miraExtend - 0.3), [-0.35, 0.5]], [miraExtend, [-0.90, 1.05]], [starHand, [-1.15, 1.35]], [dur, [-1.15, 1.35]]]),
        footL: [-36, -39], footR: [36, -39],
      });
      const nx5 = 700 + 70 * C.easeOut(C.clamp((lt - (starHand - 0.45)) / 0.45));
      nova(ctx, nx5, 1280, 1.55, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'narrow', mouth: 'flat', blush: 0.3, look: [1, 0] } },
        { t: novaOpen, f: { eyes: 'wide', mouth: 'o', blush: 0.45, look: [1, 0] } },
        { t: starHand, f: { eyes: 'tender', mouth: 'smile', blush: 0.6, look: [1, 0] } },
      ], { blink: blinkAt(t, 3) }));
      const mp = P(IDLE_MIRA, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 5,
        sway: 2.5, lean: -0.02, headTilt: -0.03, headTurn: -0.18, hairSwing: 6,
        armL: C.kf(lt, [[0, [0.35, -0.5]], [Math.max(0.02, miraExtend - 0.3), [0.35, -0.5]], [miraExtend, [0.90, 1.05]], [starHand, [1.15, 1.35]], [dur, [1.15, 1.35]]]),
        armR: [-0.25, -0.1],
        footL: [-28, -8], footR: [29, -8],
      });
      const mx5 = 1280 - 70 * C.easeOut(C.clamp((lt - (starHand - 0.45)) / 0.45));
      mira(ctx, mx5, 1280, 1.50, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'tender', mouth: 'smile', blush: 0.45, look: [-1, 0] } },
        { t: starHand, f: { eyes: 'happy', mouth: 'smile', blush: 0.55, look: [-1, 0] } },
      ], { blink: blinkAt(t, 4) }));
      const rh = miraHand(mx5, 1280, 1.50, mp, 'R');
      clipboardProp(ctx, rh[0], rh[1] + 60, 0.55, -0.1, t);
      // the star passes between the hands
      const nh = novaHand(nx5, 1280, 1.55, np, 'R');
      const mh = miraHand(mx5, 1280, 1.50, mp, 'L');
      const u = C.easeOut(C.clamp((lt - miraExtend) / (starHand - miraExtend)));
      const sx = C.lerp(mh[0], nh[0], u);
      const sy = C.lerp(mh[1] - 14, nh[1] - 22, u) - Math.sin(u * Math.PI) * 44;
      starProp(ctx, sx, sy, 0.95 + 0.06 * Math.sin(lt * 12), lt * 0.8, t, 0.6 + 0.4 * u);
      ctx.save();
      ctx.translate(sx, sy + 42); ctx.rotate(lt * 0.8);
      ctx.strokeStyle = CORAL; ctx.lineWidth = 5; ctx.lineCap = 'round';
      for (const d of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(d * 16, 38, d * 6, 78); ctx.stroke();
      }
      ctx.restore();
      grip(ctx, nh[0], nh[1], 1.0, '#D9A06A');
      grip(ctx, mh[0], mh[1], 1.0, '#E8B98C');
      if (lt > starHand) paperShards(ctx, sx, sy, t, 16, [CREAM, MUSTARD, CORAL], 240, 0.9, 7);
      dust(ctx, t, 26, 17, 0.16);
      endCam(ctx);
      if (lt > starHand) {
        const k = C.clamp((lt - starHand) / 0.25);
        flash(ctx, 0.18 * k, '#FFF1C8');
      }

      TY.type(ctx, 'AND PUT IT IN HER HAND', 150, 120, 84, {
        color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.02, jitter: 1, seed: 29,
        perChar: (i) => C.clamp((t - 12.35 - i * 0.025) / 0.35),
      });
      TY.text(ctx, 'THE HANDOFF', 960, 160, 16, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'center', letter: 3 });
    },
  });

  /* ---------- 6. 13.90–17.44 — the crowd saw a girl who was never on the list ---------- */
  scene({
    id: 's6', start: 13.9, end: 17.44, line: 5, cast: 'NOVA',
    draw(t, lt, dur) {
      const crowdTurn = syncLocal('s6', 'crowdTurn');
      const curtainHalf = syncLocal('s6', 'curtainHalf');
      const novaLight = syncLocal('s6', 'novaLight');
      const listStamp = syncLocal('s6', 'listStamp');
      const listShow = syncLocal('s6', 'listShow');
      setCam(C.kf(lt, [[0, 800], [dur, 900]]), C.kf(lt, [[0, 560], [dur, 545]]), C.kf(lt, [[0, 1.08], [dur, 1.0]]), C.kf(lt, [[0, -0.03], [dur, 0.012]]), 1.5, t);
      beginCam(ctx);
      wingReveal(ctx, t);
      // Nova walks out of the wing; the spotlight finds her on "girl"
      const walkU = C.clamp((lt - curtainHalf) / 1.4);
      const nx = 240 + 360 * C.easeOut(walkU);
      const lightK = C.easeOut(C.clamp((lt - novaLight) / 0.25));
      if (lightK > 0) {
        const pool = ctx.createRadialGradient(nx, GROUND - 260, 80, nx, GROUND - 260, 520);
        pool.addColorStop(0, C.rgba(INK, 0));
        pool.addColorStop(0.45, C.rgba(INK, 0.08 * lightK));
        pool.addColorStop(1, C.rgba(INK, 0.55 * lightK));
        ctx.fillStyle = pool; ctx.fillRect(-300, -300, W + 600, H + 600);
        ctx.save(); ctx.globalAlpha = lightK;
        spotlight(ctx, nx, -40, 1100, 26, 300, '#FFF6DC', 0.3, 0);
        ctx.restore();
      }
      const np = poseAt(lt, [
        [0, POSES.nova.idle],
        [0.6, POSES.nova.hip],
        [novaLight, POSES.nova.duetLeft],
        [2.1, POSES.nova.duetRight],
        [listShow, POSES.nova.point],
        [dur, POSES.nova.point],
      ]);
      contactShadow(ctx, nx, GROUND, 1.28, 70);
      nova(ctx, nx, GROUND, 1.28, t, np, faceAt(lt, [
        { t: 0, f: FACES.narrow },
        { t: novaLight, f: FACES.surprise },
        { t: listShow, f: FACES.star },
      ], { blink: blinkAt(t, 3) }));
      // Mira follows with the call sheet; the list is held up on "list"
      const mx = 900 - 60 * C.easeOut(C.clamp((lt - curtainHalf) / 1.6));
      const showK = C.easeOut(C.clamp((lt - listShow) / 0.4));
      const mp = poseAt(lt, [
        [0, POSES.mira.step],
        [0.7, POSES.mira.hip],
        [1.5, POSES.mira.listen],
        [listShow, POSES.mira.duetLeft],
        [dur, POSES.mira.duetLeft],
      ]);
      contactShadow(ctx, mx, GROUND + 30, 1.0, 54);
      mira(ctx, mx, GROUND + 30, 1.0, t, mp, faceAt(lt, [
        { t: 0, f: FACES.neutral },
        { t: listShow, f: FACES.smile },
        { t: dur, f: FACES.grin },
      ], { blink: blinkAt(t, 5) }));
      const lh = miraHand(mx, GROUND + 30, 1.0, mp, 'L');
      callList(ctx, lh[0] + 34, lh[1] - 96, 0.68, -0.06 + 0.1 * showK, t, C.clamp((lt - listStamp) / 0.2));
      grip(ctx, lh[0], lh[1], 0.95, '#E8B98C');
      // two backups in the back line, moving
      for (let i = 0; i < 2; i++) {
        const bx = 1010 + i * 80;
        const bp = poseAt(lt, [
          [0, POSES.nova.idle],
          [listShow, i === 0 ? POSES.nova.duetLeft : POSES.nova.duetRight],
          [dur, i === 0 ? POSES.nova.duetRight : POSES.nova.duetLeft],
        ]);
        backup(ctx, bx, GROUND + 70, 0.64, t, i, bp, i === 0
          ? { eyes: 'happy', mouth: 'grin', blush: 0.5, look: [0, 0] }
          : { eyes: 'wide', mouth: 'sing', blush: 0.45, look: [0, 0], sing: 0.5 });
      }
      // the curtain opens in front of the stage
      const open = C.easeOut(C.clamp((lt - crowdTurn) / 1.2));
      stageCurtain(ctx, open, t, PAL.redD);
      dust(ctx, t, 48, 21, 0.2);
      endCam(ctx);

      TY.type(ctx, 'THE CROWD SAW', 100, 150, 96, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 31,
        perChar: (i) => C.clamp((t - (13.9 + crowdTurn) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'A GIRL', 100, 250, 96, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 37,
        perChar: (i) => C.clamp((t - (13.9 + novaLight) - i * 0.03) / 0.4),
      });
    },
  });

  /* ---------- 7. 17.44–18.86 — the light found her ---------- */
  scene({
    id: 's7', start: 17.44, end: 18.86, line: 6, cast: 'NOVA',
    draw(t, lt, dur) {
      const spotSweep = syncLocal('s7', 'spotSweep');
      const spotLand = syncLocal('s7', 'spotLand');
      const novaSing = syncLocal('s7', 'novaSing');
      setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 555], [dur, 535]]), C.kf(lt, [[0, 1.0], [dur, 1.12]]), C.kf(lt, [[0, 0], [dur, 0.015]]), 2, t);
      beginCam(ctx);
      stageFront(ctx, t);
      // the spotlight sweeps on "light" and lands on Nova on "found"
      const snap = C.clamp((lt - spotSweep) / 0.18);
      const spotX = C.lerp(700, 980, C.ease(C.clamp((lt - spotSweep) / (spotLand - spotSweep))));
      ctx.save(); ctx.globalAlpha = snap;
      spotlight(ctx, spotX, -60, 1280, 30, 420, '#FFF6DC', 0.28, 0);
      ctx.restore();
      // Nova sings into the mic: one hand on the stand, one arm up, weight on the back foot
      const np = poseAt(lt, [
        [0, POSES.nova.idle],
        [spotSweep, POSES.nova.reach],
        [novaSing, POSES.nova.duetLeft],
        [Math.min(dur - 0.12, novaSing + 0.45), POSES.nova.duetRight],
        [dur, POSES.nova.duetRight],
      ]);
      np.bounce = -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 12;
      contactShadow(ctx, 980, GROUND, 1.3, 68);
      nova(ctx, 980, GROUND, 1.3, t, np, faceAt(lt, [
        { t: 0, f: FACES.sing },
        { t: novaSing, f: FACES.star },
        { t: dur, f: FACES.tender },
      ], { blink: blinkAt(t, 7) }));
      micStand(ctx, 1130, GROUND, 1.0, t);
      const gripR = novaHand(980, GROUND, 1.3, np, 'R');
      grip(ctx, gripR[0], gripR[1], 1.05, '#D9A06A');
      // Mira at the side, one arm up, one out, a real cheer
      const mp = poseAt(lt, [
        [0, POSES.mira.idle],
        [spotLand, POSES.mira.duetLeft],
        [novaSing, POSES.mira.duetRight],
        [Math.min(dur - 0.12, novaSing + 0.45), POSES.mira.duetLeft],
        [dur, POSES.mira.duetLeft],
      ]);
      contactShadow(ctx, 1420, GROUND, 1.05, 56);
      mira(ctx, 1420, GROUND, 1.05, t, mp, faceAt(lt, [
        { t: 0, f: FACES.smile },
        { t: novaSing, f: FACES.grin },
      ], { blink: blinkAt(t, 7) }));
      dust(ctx, t, 30, 23, 0.16);
      endCam(ctx);

      TY.type(ctx, 'THE LIGHT', 150, 260, 120, {
        color: CREAM, edge: MUSTARD, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 41,
        perChar: (i) => C.clamp((t - (17.44 + spotSweep) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'FOUND HER', 150, 380, 120, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.025, jitter: 1, seed: 43,
        perChar: (i) => C.clamp((t - (17.44 + spotLand) - i * 0.03) / 0.4),
      });
      if (lt > spotLand) {
        const k = C.clamp((lt - 0.15) / 0.2);
        ctx.save(); ctx.globalAlpha = 0.25 * k;
        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(980, 640, 220 + 40 * k, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      TY.sticker(ctx, 'LIVE', 1660, 470, 32, { fill: CORAL, text: CREAM, seed: 7, rot: -0.04, time: t });
    },
  });

  /* ---------- 8. 18.86–20.52 — the lamp called again, in the cue booth ---------- */
  scene({
    id: 's8', start: 18.86, end: 20.52, line: 7, cast: 'MIRA',
    draw(t, lt, dur) {
      const lampTurn2 = syncLocal('s8', 'lampTurn2');
      const miraCard = syncLocal('s8', 'miraCard');
      const miraPoint = syncLocal('s8', 'miraPoint');
      const pan = C.easeOut(C.clamp((lt - lampTurn2) / 0.35));
      setCam(820 + 300 * pan, 520, C.kf(lt, [[0, 1.06], [dur, 1.02]]), C.kf(lt, [[0, 0.035], [dur, -0.02]]), 2.2, t);
      beginCam(ctx);
      cueBooth(ctx, t);
      const lampRot = C.kf(lt, [[0, -0.1], [lampTurn2, 0.35], [dur, 0.55]]);
      cueLamp(ctx, 1250, 880, 1.0, t, {
        rot: lampRot, glow: 0.7 + 0.3 * C.bpmPulse(t, 3),
        card: 'MIRA', cardOut: C.easeOut(C.clamp((lt - miraCard) / 0.5)),
      });
      // Mira at the desk, looking up and pointing at herself
      const mp = P(IDLE_MIRA, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI + 0.7)) * 8,
        sway: 3, lean: C.kf(lt, [[0, 0.02], [miraCard, -0.03]]),
        headTilt: C.kf(lt, [[0, 0.02], [miraCard, -0.06]]),
        headTurn: C.kf(lt, [[0, -0.12], [miraCard, -0.35]]),
        hairSwing: 4,
        armL: [0.3, 0.1],
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [miraCard, [0.2, 0.8]], [miraPoint, [0.5, 1.4]]]),
        footL: [-28, -8], footR: [29, -8],
      });
      contactShadow(ctx, 1000, GROUND, 1.28, 64);
      mira(ctx, 1000, GROUND, 1.28, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.35, look: [-1, 0] } },
        { t: miraCard, f: { eyes: 'wide', mouth: 'o', blush: 0.5, look: [0, 0] } },
        { t: miraPoint, f: { eyes: 'wide', mouth: 'o', blush: 0.55, look: [0, 0] } },
      ]));
      dust(ctx, t, 26, 25, 0.14);
      endCam(ctx);

      TY.type(ctx, 'THE LAMP', 150, 120, 120, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 47,
        perChar: (i) => C.clamp((t - (18.86 + lampTurn2) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'CALLED AGAIN', 150, 220, 120, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 53,
        perChar: (i) => C.clamp((t - (18.86 + miraCard) - i * 0.03) / 0.4),
      });
      if (lt > miraPoint) {
        const k = C.easeOut(C.clamp((lt - miraPoint) / 0.35));
        ctx.save();
        ctx.translate(1100, 620);
        ctx.rotate(0.06);
        ctx.scale(0.7 + 0.3 * C.backOut(k), 0.7 + 0.3 * C.backOut(k));
        TY.sticker(ctx, 'MIRA', 0, 0, 54, { fill: MUSTARD, text: INK, seed: 9, rot: 0, time: t });
        ctx.restore();
      }
    },
  });

  /* ---------- 9. 20.52–24.90 — the curtain opened ---------- */
  scene({
    id: 's9', start: 20.52, end: 24.9, line: 8, cast: 'NOVA + MIRA',
    draw(t, lt, dur) {
      const curtainStart = syncLocal('s9', 'curtainStart');
      const curtainOpen = syncLocal('s9', 'curtainOpen');
      const stagePull = syncLocal('s9', 'stagePull');
      const crowdWait = syncLocal('s9', 'crowdWait');
      const nightSky = syncLocal('s9', 'nightSky');
      const finalTitle = syncLocal('s9', 'finalTitle');
      const novaBow = syncLocal('s9', 'novaBow');
      const pull = C.ease(C.clamp((lt - stagePull) / (nightSky - stagePull)));
      setCam(960, C.lerp(500, 540, pull), C.lerp(1.14, 0.94, pull), C.lerp(-0.02, 0.015, pull), 1.4, t);
      beginCam(ctx);
      kpopStage(ctx, t, {
        starGlow: 0.25, confetti: 50, crowd: true,
        crowdY: 1060 - 6 * C.easeOut(C.clamp((lt - crowdWait) / 0.5)),
      });
      const open = C.easeOut(C.clamp((lt - curtainStart) / (curtainOpen - curtainStart)));
      // the two leads, together; they bow on "waiting"
      const bow = C.kf(lt, [[0, 0], [novaBow, 0], [novaBow + 0.4, 0.32], [nightSky + 0.3, 0.32], [finalTitle + 0.3, 0]]);
      // the night sky arrives on "all"
      if (lt > nightSky) {
        const mk = C.easeOut(C.clamp((lt - nightSky) / 0.5));
        ctx.save(); ctx.globalAlpha = 0.8 * mk;
        drawMoon(ctx, 1700, 190, 58, CREAM);
        ctx.restore();
      }
      const np = poseAt(lt, [
        [0, POSES.nova.duetLeft],
        [curtainOpen, POSES.nova.point],
        [stagePull, POSES.nova.hip],
        [stagePull + 0.45, POSES.nova.point],
        [novaBow, POSES.nova.bow],
        [novaBow + 0.2, POSES.nova.bow],
        [nightSky, POSES.nova.duetLeft],
        [finalTitle, POSES.nova.duetLeft],
      ]);
      const nx = 820 + 22 * C.easeOut(C.clamp((lt - stagePull) / 0.5));
      contactShadow(ctx, nx, GROUND, 1.15, 62);
      nova(ctx, nx, GROUND, 1.15, t, np, faceAt(lt, [
        { t: 0, f: FACES.smile },
        { t: novaBow, f: FACES.tender },
        { t: nightSky, f: FACES.smile },
        { t: finalTitle, f: FACES.grin },
      ], { blink: blinkAt(t, 3) }));
      const mp = poseAt(lt, [
        [0, POSES.mira.duetRight],
        [curtainOpen, POSES.mira.point],
        [stagePull, POSES.mira.hip],
        [stagePull + 0.45, POSES.mira.point],
        [novaBow, POSES.mira.bow],
        [novaBow + 0.2, POSES.mira.bow],
        [nightSky, POSES.mira.duetRight],
        [finalTitle, POSES.mira.duetRight],
      ]);
      const mx = 1100 - 18 * C.easeOut(C.clamp((lt - stagePull) / 0.5));
      contactShadow(ctx, mx, GROUND, 1.1, 58);
      mira(ctx, mx, GROUND, 1.1, t, mp, faceAt(lt, [
        { t: 0, f: FACES.smile },
        { t: novaBow, f: FACES.tender },
        { t: nightSky, f: FACES.grin },
      ], { blink: blinkAt(t, 4) }));
      const bh = miraHand(mx, GROUND, 1.1, mp, 'L');
      bouquetProp(ctx, bh[0], bh[1] - 28, 0.8, 0.05, t);
      // Nova holds the star; Mira holds the call sheet
      const nh = novaHand(nx, GROUND, 1.15, np, 'L');
      starProp(ctx, nh[0] - 6, nh[1] - 24, 0.8, lt * 0.5, t, 0.8);
      grip(ctx, nh[0], nh[1], 0.95, '#D9A06A');
      const mh = miraHand(mx, GROUND, 1.1, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 78, 0.65, -0.1, t);
      // the curtain opens in front of them
      stageCurtain(ctx, open, t, PAL.redD);
      // the lamp above the stage
      cueLamp(ctx, 1580, 880, 0.8, t, { rot: 0.15, glow: 0.8, card: '', cardOut: 0 });
      dust(ctx, t, 40, 29, 0.18);
      endCam(ctx);

      TY.type(ctx, 'THE CURTAIN', 150, 250, 112, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 59,
        perChar: (i) => C.clamp((t - (20.52 + curtainStart) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'OPENED', 150, 366, 112, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 61,
        perChar: (i) => C.clamp((t - (20.52 + curtainOpen) - i * 0.03) / 0.4),
      });
      if (lt > finalTitle) {
        const k = C.easeOut(C.clamp((lt - finalTitle) / 0.35));
        ctx.save(); ctx.globalAlpha = k;
        TY.text(ctx, 'THE CUE LAMP', 120, 880, 22, { family: 'DMMono', color: C.rgba(CREAM, 0.75), align: 'left', letter: 6 });
        ctx.restore();
      }
    },
  });

  /* ---------- the frame ---------- */
  function lineAt(t) {
    const s = sceneAt(t);
    const line = window.KPOP_LINES[s.line];
    if (!line) return null;
    if (t < line.start - 0.2 || t > line.end + 0.25) return null;
    return line;
  }

  function drawCueTicker(ctx, t) {
    const s = sceneAt(t);
    const idx = SCENES.indexOf(s) + 1;
    const p = C.clamp((t - s.start) / Math.max(0.1, s.end - s.start));
    const x = W - 286, y = 40, w = 246, h = 96;
    ctx.save();
    ctx.globalAlpha = 0.92;
    paper(ctx, () => tornRectPath(ctx, x, y, w, h, 3.5, 9), { fill: INK, edge: null, shadow: C.rgba(INK, 0.25), sx: 4, sy: 6 });
    TY.text(ctx, 'CUE', x + 16, y + 24, 15, { family: 'Archivo Black', color: CREAM, letter: 1 });
    TY.text(ctx, String(idx).padStart(2, '0') + ' / 09', x + 72, y + 24, 15, { family: 'DMMono', color: MUSTARD, letter: 1 });
    TY.text(ctx, s.cast || 'NOVA', x + 16, y + 48, 13, { family: 'DMMono', color: C.rgba(CREAM, 0.65), letter: 1 });
    TY.text(ctx, 'TAKE 01', x + 168, y + 48, 10, { family: 'DMMono', color: C.rgba(CREAM, 0.45), letter: 1 });
    // progress
    ctx.fillStyle = C.rgba(CREAM, 0.16); ctx.fillRect(x + 16, y + 62, w - 32, 6);
    ctx.fillStyle = MUSTARD; ctx.fillRect(x + 16, y + 62, (w - 32) * p, 6);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = C.rgba(CREAM, 0.28); ctx.fillRect(x + 16 + i * (w - 32) / 9, y + 72, 1, 5); }
    const ff = Math.floor(t * 30), ss = Math.floor(ff / 30), fr = ff % 30;
    TY.text(ctx, '00:' + String(ss).padStart(2, '0') + ':' + String(fr).padStart(2, '0'), x + 16, y + 92, 10, { family: 'DMMono', color: C.rgba(CREAM, 0.45), letter: 1 });
    // tiny star
    ctx.save(); ctx.translate(x + 214, y + 24); ctx.rotate(t * 0.4);
    ctx.fillStyle = MUSTARD; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(3, -3); ctx.lineTo(10, -3); ctx.lineTo(4, 2); ctx.lineTo(6, 10); ctx.lineTo(0, 5); ctx.lineTo(-6, 10); ctx.lineTo(-4, 2); ctx.lineTo(-10, -3); ctx.lineTo(-3, -3); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function drawKpopMarks(ctx, t) {
    ctx.save();
    ctx.globalAlpha = 0.3; ctx.strokeStyle = INK; ctx.lineWidth = 1;
    const m = 26, l = 16;
    for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) {
      ctx.beginPath(); ctx.moveTo(x, y + sy * l); ctx.lineTo(x, y); ctx.lineTo(x + sx * l, y); ctx.stroke();
    }
    const cols = [PAL.blue, PAL.red, PAL.gold, PAL.ink];
    for (let i = 0; i < cols.length; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(W - 100 + i * 15, H - 34, 11, 5); }
    TY.text(ctx, 'THE CUE LAMP · ' + Math.floor(t * 30).toString().padStart(5, '0'), W - 384, H - 30, 11, { color: C.rgba(INK, 0.5), letter: 1 });
    TY.text(ctx, '© 2026 PAPER STAGE', 44, H - 30, 11, { color: C.rgba(INK, 0.5), letter: 1 });
    ctx.restore();
    // the film's own progress hairline
    ctx.fillStyle = C.rgba(INK, 0.16); ctx.fillRect(0, H - 3, W, 3);
    ctx.fillStyle = MUSTARD; ctx.fillRect(0, H - 3, W * C.clamp(t / window.KPOP_DURATION), 3);
  }

  function drawKpopMarks(ctx, t) {
    ctx.save();
    ctx.globalAlpha = 0.22; ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
    ctx.strokeRect(16, 16, W - 32, H - 32);
    const m = 26, l = 24;
    for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) {
      ctx.beginPath(); ctx.moveTo(x, y + sy * l); ctx.lineTo(x, y); ctx.lineTo(x + sx * l, y); ctx.stroke();
    }
    for (let x = 64; x < W; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, 24); ctx.moveTo(x, H - 24); ctx.lineTo(x, H - 16); ctx.stroke();
    }
    for (let y = 64; y < H; y += 64) {
      ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(24, y); ctx.moveTo(W - 24, y); ctx.lineTo(W - 16, y); ctx.stroke();
    }
    for (const [cx, cy] of [[W / 4, H / 4], [W * 3 / 4, H / 4], [W / 4, H * 3 / 4], [W * 3 / 4, H * 3 / 4]]) {
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10); ctx.stroke();
    }
    const cols = [PAL.blue, PAL.red, PAL.gold, PAL.ink, PAL.green, PAL.pink, PAL.cream, PAL.teal];
    for (let i = 0; i < cols.length; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(W - 170 + i * 18, H - 40, 14, 7); }
    TY.text(ctx, 'THE CUE LAMP · ' + Math.floor(t * 30).toString().padStart(5, '0'), W - 430, H - 28, 12, { color: C.rgba(INK, 0.55), letter: 1 });
    TY.text(ctx, '© 2026 PAPER STAGE', 44, H - 28, 12, { color: C.rgba(INK, 0.55), letter: 1 });
    ctx.restore();
    ctx.fillStyle = C.rgba(INK, 0.16); ctx.fillRect(0, H - 3, W, 3);
    ctx.fillStyle = MUSTARD; ctx.fillRect(0, H - 3, W * C.clamp(t / window.KPOP_DURATION), 3);
  }

  function renderTestAt(t, type = 'image/png', q = 0.95) {
    if (!ctx) { cv = document.getElementById('out'); ctx = cv.getContext('2d'); }
    const s = sceneAt(t);
    beginShot(s);
    drawScene(s, t);
    drawTransition(t);
    // one-sided paper flashes at the cuts, the source's transition grammar
    for (const c of [3.68, 6.42, 10.44, 12.26, 13.9, 17.44, 18.86, 20.52]) {
      const d = Math.abs(t - c);
      if (d < 0.06) flash(ctx, 0.16 * (1 - d / 0.06), '#FFF1C8');
    }
    const line = lineAt(t);
    if (line) TY.subtitle(ctx, line, t, { x: 84, y: 1024, size: 30 });
    drawCueTicker(ctx, t);
    drawKpopMarks(ctx, t);
    paperOverlay(ctx, t, 0.5);
    grainOverlay(ctx, t, 0.45);
    paperScratches(ctx, t, 0.07);
    vignette(ctx, 0.34);
    return cv.toDataURL(type, q);
  }

  function renderTestSheet(ts, cols = 4, w = 480) {
    if (!ctx) { cv = document.getElementById('out'); ctx = cv.getContext('2d'); }
    const rows = Math.ceil(ts.length / cols);
    const h = Math.round(w * H / W);
    const sheet = makeCanvas(cols * w, rows * h);
    const sx = sheet.x;
    sx.fillStyle = '#100D0B'; sx.fillRect(0, 0, sheet.c.width, sheet.c.height);
    ts.forEach((time, i) => {
      const url = renderTestAt(time, 'image/png');
      const img = new Image();
      img.src = url;
      sx.drawImage(img, (i % cols) * w, Math.floor(i / cols) * h, w, h);
    });
    return sheet.c.toDataURL('image/png');
  }

  window.renderTestAt = renderTestAt;
  window.renderTestSheet = renderTestSheet;
  // The measured pass: the same paint path, but it returns what the rig was
  // actually told to draw. The gate reads this, never a hand-written table.
  window.measureAt = (t) => {
    window.KPOP_MEASURE = true;
    window.KPOP_CAST = [];
    renderTestAt(t, 'image/png');
    window.KPOP_MEASURE = false;
    return { t, cast: window.KPOP_CAST };
  };
})();
