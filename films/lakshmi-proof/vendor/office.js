/* Office figures for Same Alarm — a plain human paper puppet.
 *
 * The pack's rigs are stage people: an idol with a sunflower head and a
 * lab-dressed second. An office film needs a person in a shirt, so this file
 * builds one from the same primitives (`limb`, `solveLeg`, `paper`, `blobPath`)
 * rather than bending the idol into it. It is film-local by design: the pack
 * owns the *look* (paper, cut edge, eyelets, one key light); this film owns *who*
 * is in it.
 *
 * Pose parameters are the rig's own vocabulary, the same one the pose library
 * files use: bounce, sway, lean, headTilt, headTurn, hairSwing, armL/armR,
 * legL/legR, footL/footR, footPitchL/footPitchR. A part that hangs from a part
 * inherits every transform between it and the root (decision 0011): the hair is
 * drawn inside the head's pivot, and the head inside the torso's lean.
 */

/**
 * The face the body is making.
 *
 * A spine can be blended; an eye cannot. Until this table existed, every office
 * shot drew the rig's default face, so a man in the `asleep` pose had his eyes
 * open — at 21:00, in the one shot whose whole job is to say he has been at the
 * desk too long. The painter hands the rig the pose's *name* and the rig decides
 * what a face for it looks like, which keeps the pack ignorant of expressions
 * and the film in charge of who is in it.
 */
const FACE_BY_POSE = {
  idle: { eyes: "dot" },
  type: { eyes: "dot", browLift: -1.6 },
  slump: { eyes: "closed", browLift: -3 },
  asleep: { eyes: "closed", browLift: -4 },
  wake: { eyes: "wide", browLift: 3 },
  look: { eyes: "wide", browLift: 2.4 },
  reach: { eyes: "wide", browLift: 1.2 },
  walk: { eyes: "dot", browLift: -0.8 },
  enter: { eyes: "dot" },
  point: { eyes: "dot", browLift: 2.6 },
  turn: { eyes: "dot", browLift: 1 },
  crossed: { eyes: "dot", browLift: -2.6 },
  nod: { eyes: "dot", browLift: 0.8 },
  leave: { eyes: "dot", browLift: -1.2 },
  listen: { eyes: "dot", browLift: -0.8 },
  tap: { eyes: "dot", browLift: 2.2 },
  hold: { eyes: "dot", browLift: 0.6 },
  accept: { eyes: "happy", browLift: 2.8 },
};

function officeFigure(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  const p = o.pose || {};
  const f = o.face || FACE_BY_POSE[o.poseKey] || {};
  const flip = o.flip || 1;
  const pose = o.pose || {};
  // A walk is a cycle, not a sequence of pose events every third of a second.
  // Phase the legs and arms from the clock so one `walk` pose is continuous.
  const walkPhase = o.poseKey === "walk" ? Math.sin(t * 6.2) : 0;
  const walkBounce = o.poseKey === "walk" ? Math.abs(walkPhase) * 4 : 0;
  const bounce = (pose.bounce || 0) + walkBounce;
  const lean = p.lean || 0;
  const headTilt = p.headTilt || 0;
  const headTurn = p.headTurn || 0;
  const armL = p.armL || [0.16, 0.08];
  const armR = p.armR || [-0.16, -0.08];
  const legL = p.legL || [0.03, 0.01];
  const legR = p.legR || [-0.03, -0.01];
  const walkArmL = [armL[0] - 0.3 * walkPhase, armL[1] - 0.08 * walkPhase];
  const walkArmR = [armR[0] + 0.3 * walkPhase, armR[1] + 0.08 * walkPhase];
  const walkLegL = [legL[0] + 0.38 * walkPhase, legL[1] + 0.08 * Math.abs(walkPhase)];
  const walkLegR = [legR[0] - 0.38 * walkPhase, legR[1] + 0.08 * Math.abs(walkPhase)];

  const boss = o.outfit === "supervisor";
  const performer = o.outfit === "performer";
  const mortal = o.outfit === "mortal";
  // The pack's people are paper dolls, not portrait busts: a head big enough to
  // read at 390 px, a body that is a silhouette, and a face that can act. The
  // office rig's first head was 14% of the figure, so every expression cost a
  // magnifying glass. 2.0 makes the mortal 26% head, still a body and not a bobble.
  const headScale = mortal ? 2 : 1;
  // One leg, one ground line. The hip sits 273 above the feet and the leg is
  // 156 + 117 = 273 long, so a standing foot is straight. The old 258 left 15
  // units of slack, and the 2D solver spent it by swinging the knee 60 px
  // sideways: a clean front view read as a frog. A bent knee in this flat rig
  // is a walk pose's lifted foot, not a standing pose's default.
  const HIP = -281;
  const SHOULDER = boss || performer ? -466 : -452;
  const HEAD = boss || performer ? -530 : -518;
  // One colour convention for every rig: the painter passes `colors`, an object
  // already mapped through the pack palette, and each rig reads its own roles.
  const col = o.colors || {};
  const skin = col.skin || SKIN;
  const shirt = col.shirt || (performer ? PAL.red : boss ? PAL.cream : PAL.blueL);
  const trouser = col.trouser || (performer ? PAL.blueD : boss ? PAL.ink2 : PAL.blueD);
  const jacket = performer ? (col.jacket || PAL.gold) : boss ? (col.jacket || PAL.ink) : null;
  const hairCol = col.hair || PAL.ink;
  const skirt = performer ? (col.skirt || PAL.red) : null;
  const petal = performer ? (col.petal || PAL.gold) : null;
  const boot = performer ? (col.boot || PAL.ink) : null;
  const tie = boss || performer || mortal ? null : (col.tie === undefined ? PAL.red : col.tie);

  // A dark garment on a lit wall needs a *light* rim to have a contour at all:
  // an edge in the garment's own colour is not an edge. The blazer and the
  // sleeve were both outlined in `PAL.ink` on a `PAL.ink` fill, which is why the
  // supervisor's pointing arm read as a black plank and his coat as a slab.
  const rim = jacket ? C.rgba(PAL.paper2, 0.55) : C.rgba(PAL.ink, 0.62);

  ctx.save();
  ctx.translate(x, y);
  if (o.shadow !== 0) shadowEllipse(ctx, 0, 0, (boss ? 44 : 40) * s, 9 * s, 0.22);
  ctx.scale(flip * s, s);

  // Far arm: drawn after the torso, before the near arm, so its hand is not
  // swallowed by the shirt, belt or skirt. The far shade keeps the depth read.
  // Legs. Feet are IK targets when the pose gives one, so a planted foot bends
  // its knee instead of sliding.
  drawLeg(-1, walkLegL, true);
  drawLeg(1, walkLegR, false);
  function drawLeg(side, ang, far) {
    const hx = side * (boss ? 16 : 14);
    const hy = HIP + bounce;
    const target = side < 0 ? p.footL : p.footR;
    const pitch = (side < 0 ? p.footPitchL : p.footPitchR) || 0;
    let a1 = ang[0];
    let a2 = ang[1];
    let foot = ang[0] + ang[1] + pitch;
    if (Array.isArray(target)) {
      const sol = solveLeg(hx, hy, target[0], target[1], 156, 117, side);
      a1 = sol.hipAngle;
      a2 = sol.kneeBend;
      foot = sol.shinAngle + pitch;
    }
    const knee = limb(ctx, hx, hy, 156, 25, 20, a1, far ? C.shade(trouser, -12) : trouser, C.rgba(PAL.ink, 0.5), true);
    const ankle = limb(ctx, knee[0], knee[1], 117, 20, 16, a1 + a2, far ? C.shade(trouser, -12) : trouser, C.rgba(PAL.ink, 0.5), true);
    brad(ctx, hx, hy, 3.4);
    brad(ctx, knee[0], knee[1], 2.8);
    // A plain lace-up for the office; a platform boot for the stage.
    ctx.save();
    ctx.translate(ankle[0] + 4, ankle[1] - 2);
    ctx.rotate(foot * 0.5);
    if (performer) {
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-17, -12); ctx.lineTo(13, -12);
        ctx.quadraticCurveTo(26, -6, 24, 10);
        ctx.lineTo(-18, 10); ctx.closePath();
      }, { fill: far ? C.shade(boot, -10) : boot, edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5 });
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(-18, 8, 42, 5);
      ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1;
      ctx.strokeRect(-18, 8, 42, 5);
    } else {
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-15, -9); ctx.lineTo(11, -9);
        ctx.quadraticCurveTo(25, -3, 25, 10);
        ctx.lineTo(-15, 10); ctx.closePath();
      }, { fill: far ? C.shade(PAL.ink, 6) : PAL.ink, edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.16), sx: 2, sy: 3 });
      ctx.fillStyle = C.rgba(PAL.cream, 0.85);
      ctx.fillRect(-13, 3, 26, 2.4);
    }
    ctx.restore();
  }

  // Torso: leans from the waist, so every garment, the neck and the arms move
  // together. The anchor is what `audit:rig` holds still in chest space.
  ctx.save();
  ctx.translate(0, bounce);
  ctx.translate(0, HIP + 2); ctx.rotate(lean); ctx.translate(0, -(HIP + 2));
  rigAnchor(ctx, "chest", 0, SHOULDER);

  // Shirt body.
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-36, SHOULDER + 2);
    ctx.quadraticCurveTo(-44, SHOULDER + 84, -32, HIP + 4);
    ctx.lineTo(32, HIP + 4);
    ctx.quadraticCurveTo(44, SHOULDER + 84, 36, SHOULDER + 2);
    ctx.quadraticCurveTo(0, SHOULDER - 14, -36, SHOULDER + 2);
    ctx.closePath();
  }, { fill: shirt, edge: C.rgba(PAL.ink, 0.62), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.16), sx: 4, sy: 7 });

  // A village kurta for the mortal: the same body, a different cloth.
  if (mortal) {
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-34, SHOULDER + 4);
      ctx.quadraticCurveTo(-46, HIP + 40, -40, HIP + 150);
      ctx.lineTo(40, HIP + 150);
      ctx.quadraticCurveTo(46, HIP + 40, 34, SHOULDER + 4);
      ctx.closePath();
    }, { fill: shirt, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.16), sx: 4, sy: 7 });
    paper(ctx, () => roundRectPath(ctx, -38, HIP + 18, 76, 15, 4), {
      fill: jacket || PAL.gold, edge: C.rgba(PAL.ink, 0.45), edgeW: 1.6,
    });
  }

  // Open collar and a tie: the one piece of office costume the whole film needs.
  if (!mortal) {
    ctx.fillStyle = C.shade(shirt, 8);
    ctx.beginPath(); ctx.moveTo(-17, SHOULDER); ctx.lineTo(0, SHOULDER + 24); ctx.lineTo(17, SHOULDER); ctx.lineTo(0, SHOULDER - 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.2; ctx.stroke();
    if (tie) {
      ctx.fillStyle = tie;
      ctx.beginPath(); ctx.moveTo(0, SHOULDER + 22); ctx.lineTo(9, SHOULDER + 34); ctx.lineTo(6, SHOULDER + 96); ctx.lineTo(0, SHOULDER + 112); ctx.lineTo(-6, SHOULDER + 96); ctx.lineTo(-9, SHOULDER + 34); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1; ctx.stroke();
    }
  }

  // A blazer for the supervisor: open, two panels, lapels and a pocket.
  if (jacket && !performer) {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(12, SHOULDER - 4);
        ctx.quadraticCurveTo(40, SHOULDER - 10, 46, SHOULDER + 8);
        ctx.quadraticCurveTo(56, SHOULDER + 72, 50, HIP + 10);
        ctx.lineTo(36, HIP + 20); ctx.lineTo(14, HIP + 10); ctx.lineTo(12, SHOULDER + 60);
        ctx.quadraticCurveTo(20, SHOULDER + 28, 12, SHOULDER - 4);
        ctx.closePath();
      }, { fill: jacket, edge: rim, edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
      ctx.beginPath();
      ctx.moveTo(14, SHOULDER - 4); ctx.lineTo(36, SHOULDER + 18); ctx.lineTo(24, SHOULDER + 62); ctx.lineTo(13, SHOULDER + 50);
      ctx.closePath();
      ctx.fillStyle = C.shade(jacket, 14); ctx.fill();
      ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
    }
    // lanyard, because a supervisor's whole job is written on a card
    ctx.strokeStyle = PAL.red; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(-12, SHOULDER + 4); ctx.quadraticCurveTo(0, SHOULDER + 42, 12, SHOULDER + 4); ctx.stroke();
    ctx.save();
    ctx.translate(0, SHOULDER + 62);
    paper(ctx, () => roundRectPath(ctx, -13, -9, 26, 18, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1.2 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-9, -3 + i * 5); ctx.lineTo(9, -3 + i * 5); ctx.stroke(); }
    ctx.restore();
  }

  // Belt, so the waist reads as a joint rather than a seam.
  ctx.fillStyle = C.shade(trouser, -6);
  ctx.fillRect(-33, HIP - 16, 66, 10);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1;
  ctx.strokeRect(-33, HIP - 16, 66, 10);

  if (performer) {
    // A cropped stage jacket, open at the front, with one gold button.
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(10, SHOULDER - 2);
        ctx.quadraticCurveTo(42, SHOULDER + 2, 45, SHOULDER + 20);
        ctx.quadraticCurveTo(48, SHOULDER + 80, 38, HIP + 2);
        ctx.lineTo(22, HIP + 6);
        ctx.lineTo(18, SHOULDER + 50);
        ctx.closePath();
      }, { fill: jacket, edge: C.rgba(PAL.cream, 0.55), edgeW: 2, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
      ctx.restore();
    }
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.arc(0, SHOULDER + 108, 5, 0, TAU); ctx.fill();
    // Pleated skirt: one trapezoid, twelve ribs, a cream hem.
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-36, HIP - 6); ctx.lineTo(36, HIP - 6);
      ctx.lineTo(58, HIP + 104); ctx.lineTo(-58, HIP + 104);
      ctx.closePath();
    }, { fill: skirt, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
    ctx.strokeStyle = C.rgba(PAL.cream, 0.5); ctx.lineWidth = 1.4;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 6.4, HIP - 2);
      ctx.lineTo(i * 10.2, HIP + 100);
      ctx.stroke();
    }
    ctx.fillStyle = PAL.cream;
    ctx.fillRect(-58, HIP + 98, 116, 6);
  }

  // Name badge: the film's cast entry decides the text, or there is none.
  if (o.badge) {
    ctx.save();
    ctx.translate(-30, SHOULDER + 46);
    ctx.rotate(-0.08);
    paper(ctx, () => roundRectPath(ctx, -15, -10, 30, 20, 2), { fill: PAL.cream, edge: PAL.ink, edgeW: 1 });
    ctx.save();
    ctx.scale(flip, 1);
    TY.text(ctx, String(o.badge).toUpperCase(), 0, 3, 8, { family: "Archivo Black", color: PAL.ink, align: "center" });
    ctx.restore();
    ctx.restore();
  }

  // Neck.
  ctx.fillStyle = C.shade(skin, -6);
  ctx.beginPath(); ctx.moveTo(-8, SHOULDER - 34); ctx.lineTo(8, SHOULDER - 34); ctx.lineTo(9, SHOULDER + 4); ctx.lineTo(-9, SHOULDER + 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.1; ctx.stroke();

  // Head: the pivot turns, and the hair is drawn inside it.
  ctx.save();
  ctx.translate(0, SHOULDER - 10);
  ctx.rotate(headTilt + headTurn * 0.16);
  ctx.translate(0, -(SHOULDER - 10));
  rigAnchor(ctx, "head", 0, SHOULDER - 10);
  ctx.save();
  ctx.translate(0, HEAD);
  ctx.scale(headScale, headScale);
  rigAnchor(ctx, "hair", 0, 0);
  rigAnchor(ctx, "face", 0, 0, 76, 88);
  if (performer) {
    // The petal halo is the character's silhouette: it must read from 390 px.
    ctx.strokeStyle = C.rgba(PAL.gold, 0.9);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 103, 0, TAU); ctx.stroke();
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU + 0.08;
      const px = Math.cos(a) * 84;
      const py = Math.sin(a) * 84;
      paper(ctx, () => {
        ctx.beginPath();
        ctx.ellipse(px, py, 18, 32, a + Math.PI / 2, 0, TAU);
        ctx.closePath();
      }, {
        fill: i % 3 === 0 ? C.shade(petal, -14) : petal,
        edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.18), sx: 3, sy: 5,
      });
    }
  }
  // hair, back layer
  //
  // Kiran's hair falls to the jaw; the supervisor's is cut above the ear. They
  // shared one shape, so with the same bob and a dark coat the supervisor read
  // as the same person in a different outfit.
  paper(ctx, () => {
    ctx.beginPath();
    ctx.arc(0, 0, boss ? 46 : 48, Math.PI * 0.95, Math.PI * 2.05);
    if (boss) {
      ctx.quadraticCurveTo(34, 16, 0, 16);
      ctx.quadraticCurveTo(-34, 16, -45, 5);
    } else {
      ctx.lineTo(44, 42);
      ctx.quadraticCurveTo(24, 24, 0, 30);
      ctx.quadraticCurveTo(-24, 24, -44, 42);
    }
    ctx.closePath();
  }, { fill: hairCol, edge: C.rgba(PAL.ink, 0.55), edgeW: 2 });
  // face
  paper(ctx, () => blobPath(ctx, 0, 0, 36, 42, 16, 0.02, 9), {
    fill: skin, edge: C.rgba(PAL.ink, 0.55), edgeW: 2, shadow: C.rgba(PAL.ink, 0.12), sx: 2.5, sy: 4.5,
  });
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = "#F08A8A";
  ctx.beginPath(); ctx.ellipse(-22, 17, 8, 3.6, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(22, 17, 8, 3.6, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  const ey = -4;
  // The library's expression vocabulary is explicit where it can be: `eyes`
  // and `mouth` name a shape, so 14 names are 14 faces. The old adapter mapped
  // four numbers onto four shapes and half the sheet was duplicates.
  const es = f.eyes || (f.open > 1.12 ? "wide" : f.open < 0.62 ? "closed" : "dot");
  const lookX = f.look?.[0] ?? f.lookX ?? 0;
  const lookY = f.look?.[1] ?? f.lookY ?? 0;
  for (const sx of [-1, 1]) {
    ctx.save();
    ctx.translate(sx * 15, ey);
    if (es === "closed") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 0, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else if (es === "wide") {
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(lookX * 3, lookY * 3, 4.4, 0, TAU); ctx.fill();
    } else if (es === "happy") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 2, 7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
    } else if (es === "half") {
      // A lid across the top third, pupil below it: bored, tired, relieved.
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(lookX * 2.4, 2 + lookY * 2.4, 3.8, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba(PAL.ink, 0.9);
      ctx.beginPath(); ctx.ellipse(0, -3.4, 9, 3.2, 0, 0, TAU); ctx.fill();
    } else if (es === "squint") {
      // An angry eye is a wedge, not a dot: the lid cuts down from the inside.
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * -1.8, 1.4, 3.6, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba(PAL.ink, 0.92);
      ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(9, -8); ctx.lineTo(9, -1); ctx.lineTo(-9, 3.5); ctx.closePath(); ctx.fill();
    } else if (es === "blank") {
      // No catchlight and a smaller pupil: a person not home.
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 7.6, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba(PAL.ink, 0.55); ctx.beginPath(); ctx.arc(lookX * 2, lookY * 2, 3.4, 0, TAU); ctx.fill();
    } else if (es === "glance") {
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 5.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(1.8, -1.8, 1.4, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(sx * 3.8, 0.6, 2.2, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 5.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(1.8, -1.8, 1.6, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(lookX * 2.4, lookY * 2.4, 1.9, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // brows: the film's only emotional instrument, so they are separate shapes.
  // `browTilt` raises the inner ends (worried) or drops them (angry).
  ctx.strokeStyle = C.rgba(PAL.ink, 0.75); ctx.lineWidth = 1.7;
  const browLift = f.browLift ?? (typeof f.brow === "number" ? f.brow * 4 : 0);
  const browTilt = f.browTilt || 0;
  ctx.beginPath();
  ctx.moveTo(-23, ey - 17 - browLift);
  ctx.quadraticCurveTo(-15, ey - 21 - browLift, -7, ey - 17 - browLift - browTilt);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(7, ey - 17 - browLift - browTilt);
  ctx.quadraticCurveTo(15, ey - 21 - browLift, 23, ey - 17 - browLift);
  ctx.stroke();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(2, 13); ctx.stroke();
  if (f.tear) {
    ctx.fillStyle = C.rgba("#7DB7D9", 0.9);
    ctx.beginPath();
    ctx.moveTo(-20, 8);
    ctx.quadraticCurveTo(-24, 16, -20, 20);
    ctx.quadraticCurveTo(-16, 16, -20, 8);
    ctx.fill();
  }
  const m = f.mouth || (f.open > 1.3 ? "o" : typeof f.brow === "number" && f.brow > 0.25 ? "smile" : "flat");
  ctx.save();
  ctx.translate(0, 27);
  if (m === "o") {
    ctx.fillStyle = "#8E2430"; ctx.beginPath(); ctx.ellipse(0, 0, 3.8, 4.8, 0, 0, TAU); ctx.fill();
  } else if (m === "O") {
    ctx.fillStyle = "#6E1822"; ctx.beginPath(); ctx.ellipse(0, 1, 6.2, 8.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#C94B58"; ctx.beginPath(); ctx.ellipse(0, 4, 3.4, 3.6, 0, 0, TAU); ctx.fill();
  } else if (m === "smile") {
    ctx.fillStyle = "#A62A36";
    ctx.beginPath(); ctx.moveTo(-5.5, -1); ctx.quadraticCurveTo(0, 3, 5.5, -1); ctx.quadraticCurveTo(0, 7, -5.5, -1); ctx.fill();
  } else if (m === "grin") {
    ctx.fillStyle = "#6E1822";
    ctx.beginPath(); ctx.moveTo(-9, -2); ctx.quadraticCurveTo(0, 2, 9, -2); ctx.quadraticCurveTo(0, 9, -9, -2); ctx.fill();
    ctx.fillStyle = "#FFF7E4"; ctx.fillRect(-7, 0, 14, 2.2);
  } else if (m === "wobble") {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(-5.5, 0); ctx.quadraticCurveTo(0, 3.6, 5.5, 0); ctx.stroke();
  } else if (m === "frown") {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(-5.5, 2); ctx.quadraticCurveTo(0, -3.4, 5.5, 2); ctx.stroke();
  } else if (m === "smirk") {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(-4, 1); ctx.quadraticCurveTo(2, 1.4, 6, -2); ctx.stroke();
  } else if (m === "grit") {
    ctx.fillStyle = "#FFF7E4"; ctx.fillRect(-7, -2, 14, 4.6);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.2; ctx.strokeRect(-7, -2, 14, 4.6);
    ctx.beginPath(); ctx.moveTo(-2.3, -2); ctx.lineTo(-2.3, 2.6); ctx.moveTo(2.3, -2); ctx.lineTo(2.3, 2.6); ctx.stroke();
  } else {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
  }
  ctx.restore();
  // fringe
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-40, -30); ctx.quadraticCurveTo(-30, -56, 0, -52);
    ctx.quadraticCurveTo(30, -56, 40, -30); ctx.lineTo(37, -16);
    ctx.quadraticCurveTo(20, -26, 0, -20); ctx.quadraticCurveTo(-20, -26, -37, -16);
    ctx.closePath();
  }, { fill: hairCol, edge: C.rgba(PAL.ink, 0.6), edgeW: 1.8 });
  ctx.restore(); // face at HEAD (inside the head scale)
  ctx.restore(); // head pivot

  const farWrist = drawArm(-1, walkArmL, true);
  const nearWrist = drawArm(1, walkArmR, false);
  drawHand(farWrist, -1, true, walkArmL[0] + walkArmL[1]);
  drawHand(nearWrist, 1, false, walkArmR[0] + walkArmR[1]);

  function drawArm(side, ang, far) {
    // The far arm hangs behind the torso. At ±38 it was almost entirely hidden
    // by the 36-wide shirt, so the figure read as one-armed from the left. Move
    // it five units out: it is still behind, but its sleeve has a silhouette.
    const sx = side * (boss ? 40 : 38) + (side < 0 ? -5 : 0);
    const sy = SHOULDER + 4;
    const sleeveCol = jacket ? (far ? C.shade(jacket, -14) : jacket) : (far ? C.shade(shirt, -14) : shirt);
    const armEdge = jacket ? rim : C.rgba(PAL.ink, 0.5);
    const elbow = limb(ctx, sx, sy, 92, 24, 19, ang[0], sleeveCol, armEdge, true);
    brad(ctx, sx, sy, 3.6);
    brad(ctx, elbow[0], elbow[1], 2.8);
    const wrist = limb(ctx, elbow[0], elbow[1], 78, 19, 15, ang[0] + ang[1], sleeveCol, armEdge, true);
    // A cuff, so the sleeve has an end and the hand has a wrist to hang from.
    // Without it a pointing arm is one tapering bar with a square tip.
    if (jacket && !performer) {
      ctx.save();
      ctx.translate(wrist[0], wrist[1]);
      ctx.rotate(ang[0] + ang[1]);
      ctx.fillStyle = C.shade(PAL.paper2, -4);
      ctx.fillRect(-2, -9, 9, 18);
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1;
      ctx.strokeRect(-2, -9, 9, 18);
      ctx.restore();
    }
    return wrist;
  }

  function drawHand(wrist, side, far, ang) {
    const poseKey = String(o.poseKey || "");
    const open = ["wake", "reach", "accept", "look", "point"].includes(poseKey);
    const point = poseKey === "tap" || poseKey === "point";
    const folded = ["hold", "type", "asleep", "slump"].includes(poseKey);
    const lengths = open
      ? [7, 9, 8, 6]
      : point
        ? [9, 2.2, 2.2, 2.2]
        : folded
          ? [4, 4, 4, 4]
          : [6, 7, 6, 5];
    const skin = far ? SKIN_D : SKIN;
    const edge = C.rgba(PAL.ink, far ? 0.5 : 0.45);
    const sleeve = jacket ? (far ? C.shade(jacket, -14) : jacket) : (far ? C.shade(shirt, -14) : shirt);
    ctx.save();
    ctx.translate(wrist[0], wrist[1]);
    ctx.rotate(ang);
    // A hand is a body part at this head size, not a leaf on a wire. The cuff
    // and the whole hand scale together so the wrist stays the hinge.
    ctx.scale(1.35, 1.35);
    // The cuff is the sleeve's end, so the hand is a part, not a floating leaf.
    ctx.fillStyle = C.shade(sleeve, -10);
    ctx.fillRect(-9, -5, 18, 6);
    ctx.strokeStyle = C.rgba(PAL.ink, 0.45);
    ctx.lineWidth = 1;
    ctx.strokeRect(-9, -5, 18, 6);
    paper(ctx, () => roundRectPath(ctx, -8, -1, 16, 16, 4), { fill: skin, edge, edgeW: 1.4 });
    for (let i = 0; i < 4; i += 1) {
      const x = -6.6 + i * 4.2;
      paper(ctx, () => roundRectPath(ctx, x, 12, 3.2, lengths[i] ?? 5, 1.5), {
        fill: skin,
        edge,
        edgeW: 1,
      });
    }
    // The thumb sits proud of the palm on the body-facing side.
    paper(ctx, () => roundRectPath(ctx, side < 0 ? 8 : -13, 2, 4.6, 9, 2), {
      fill: skin,
      edge,
      edgeW: 1,
    });
    rigAnchor(ctx, side < 0 ? "hand-left" : "hand-right", 0, 0, 18, 26);
    ctx.restore();
  }

  ctx.restore(); // torso
  ctx.restore(); // outer
}

function officeWorker(ctx, x, y, s, o = {}) {
  return officeFigure(ctx, x, y, s, { ...o, outfit: "worker" });
}

function officeSupervisor(ctx, x, y, s, o = {}) {
  return officeFigure(ctx, x, y, s, { ...o, outfit: "supervisor" });
}

/* The registry the painter dispatches through: the score's cast entry names a
 * rig id and this is the only thing that answers to it. */
window.CHARACTERS = window.CHARACTERS || {};
window.CHARACTERS["worker@0.1.0"] = officeWorker;
window.CHARACTERS["supervisor@0.1.0"] = officeSupervisor;
window.CHARACTERS["performer@0.1.0"] = function performer(ctx, x, y, s, o = {}) {
  return officeFigure(ctx, x, y, s, { ...o, outfit: "performer" });
};
window.CHARACTERS["mortal@0.1.0"] = function mortal(ctx, x, y, s, o = {}) {
  return officeFigure(ctx, x, y, s, { ...o, outfit: "mortal" });
};
