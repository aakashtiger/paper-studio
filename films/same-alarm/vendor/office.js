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

function officeFigure(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  const p = o.pose || {};
  const f = o.face || {};
  const flip = o.flip || 1;
  const pose = o.pose || {};
  const bounce = pose.bounce || 0;
  const lean = p.lean || 0;
  const headTilt = p.headTilt || 0;
  const headTurn = p.headTurn || 0;
  const armL = p.armL || [0.16, 0.08];
  const armR = p.armR || [-0.16, -0.08];
  const legL = p.legL || [0.03, 0.01];
  const legR = p.legR || [-0.03, -0.01];

  const boss = o.outfit === "supervisor";
  const HIP = boss ? -286 : -272;
  const SHOULDER = boss ? -466 : -452;
  const HEAD = boss ? -530 : -518;
  // One colour convention for every rig: the painter passes `colors`, an object
  // already mapped through the pack palette, and each rig reads its own roles.
  const col = o.colors || {};
  const skin = col.skin || SKIN;
  const shirt = col.shirt || (boss ? PAL.cream : PAL.blueL);
  const trouser = col.trouser || (boss ? PAL.ink2 : PAL.blueD);
  const jacket = boss ? (col.jacket || PAL.ink) : null;
  const hairCol = col.hair || PAL.ink;
  const tie = boss ? null : (col.tie === undefined ? PAL.red : col.tie);

  ctx.save();
  ctx.translate(x, y);
  if (o.shadow !== 0) shadowEllipse(ctx, 0, 0, (boss ? 44 : 40) * s, 9 * s, 0.22);
  ctx.scale(flip * s, s);

  // Far arm: behind the torso, and it rides the lean like the near arm.
  ctx.save();
  ctx.translate(0, bounce);
  ctx.translate(0, HIP + 2); ctx.rotate(lean); ctx.translate(0, -(HIP + 2));
  drawArm(-1, armL, true);
  ctx.restore();

  // Legs. Feet are IK targets when the pose gives one, so a planted foot bends
  // its knee instead of sliding.
  drawLeg(-1, legL, true);
  drawLeg(1, legR, false);
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
    // A plain lace-up, cut from paper: one shape, one edge, one sole line.
    ctx.save();
    ctx.translate(ankle[0] + 4, ankle[1] - 2);
    ctx.rotate(foot * 0.5);
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-15, -9); ctx.lineTo(11, -9);
      ctx.quadraticCurveTo(25, -3, 25, 10);
      ctx.lineTo(-15, 10); ctx.closePath();
    }, { fill: far ? C.shade(PAL.ink, 6) : PAL.ink, edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.16), sx: 2, sy: 3 });
    ctx.fillStyle = C.rgba(PAL.cream, 0.85);
    ctx.fillRect(-13, 3, 26, 2.4);
    ctx.restore();
  }

  // Torso: leans from the waist, so every garment, the neck and the arms move
  // together. The anchor is what `audit:rig` holds still in chest space.
  ctx.save();
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

  // Open collar and a tie: the one piece of office costume the whole film needs.
  ctx.fillStyle = C.shade(shirt, 8);
  ctx.beginPath(); ctx.moveTo(-17, SHOULDER); ctx.lineTo(0, SHOULDER + 24); ctx.lineTo(17, SHOULDER); ctx.lineTo(0, SHOULDER - 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.2; ctx.stroke();
  if (tie) {
    ctx.fillStyle = tie;
    ctx.beginPath(); ctx.moveTo(0, SHOULDER + 22); ctx.lineTo(9, SHOULDER + 34); ctx.lineTo(6, SHOULDER + 96); ctx.lineTo(0, SHOULDER + 112); ctx.lineTo(-6, SHOULDER + 96); ctx.lineTo(-9, SHOULDER + 34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1; ctx.stroke();
  }

  // A blazer for the supervisor: open, two panels, lapels and a pocket.
  if (jacket) {
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
      }, { fill: jacket, edge: C.rgba(PAL.ink, 0.7), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
      ctx.beginPath();
      ctx.moveTo(14, SHOULDER - 4); ctx.lineTo(36, SHOULDER + 18); ctx.lineTo(24, SHOULDER + 62); ctx.lineTo(13, SHOULDER + 50);
      ctx.closePath();
      ctx.fillStyle = C.shade(jacket, 10); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1; ctx.stroke();
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
  rigAnchor(ctx, "hair", 0, 0);
  // hair, back layer
  paper(ctx, () => {
    ctx.beginPath();
    ctx.arc(0, 0, boss ? 46 : 48, Math.PI * 0.95, Math.PI * 2.05);
    ctx.lineTo(44, 42);
    ctx.quadraticCurveTo(24, 24, 0, 30);
    ctx.quadraticCurveTo(-24, 24, -44, 42);
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
  for (const sx of [-1, 1]) {
    ctx.save();
    ctx.translate(sx * 15, ey);
    const es = f.eyes || "dot";
    if (es === "closed") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 0, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    } else if (es === "wide") {
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc((f.look?.[0] || 0) * 3, (f.look?.[1] || 0) * 3, 4.4, 0, TAU); ctx.fill();
    } else if (es === "happy") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 2, 7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
    } else {
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 5.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(1.8, -1.8, 1.6, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // brows: the film's only emotional instrument, so they are separate shapes
  ctx.strokeStyle = C.rgba(PAL.ink, 0.75); ctx.lineWidth = 1.7;
  const browLift = f.browLift || 0;
  ctx.beginPath(); ctx.moveTo(-23, ey - 17 - browLift); ctx.quadraticCurveTo(-15, ey - 21 - browLift, -7, ey - 17 - browLift); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, ey - 17 - browLift); ctx.quadraticCurveTo(15, ey - 21 - browLift, 23, ey - 17 - browLift); ctx.stroke();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(2, 13); ctx.stroke();
  const m = f.mouth || "flat";
  ctx.save();
  ctx.translate(0, 27);
  if (m === "o") {
    ctx.fillStyle = "#8E2430"; ctx.beginPath(); ctx.ellipse(0, 0, 3.8, 4.8, 0, 0, TAU); ctx.fill();
  } else if (m === "smile") {
    ctx.fillStyle = "#A62A36";
    ctx.beginPath(); ctx.moveTo(-5.5, -1); ctx.quadraticCurveTo(0, 3, 5.5, -1); ctx.quadraticCurveTo(0, 7, -5.5, -1); ctx.fill();
  } else if (m === "wobble") {
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.moveTo(-5.5, 0); ctx.quadraticCurveTo(0, 3.6, 5.5, 0); ctx.stroke();
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
  ctx.restore(); // face at HEAD
  ctx.restore(); // head pivot

  drawArm(1, armR, false);

  function drawArm(side, ang, far) {
    const sx = side * (boss ? 40 : 38);
    const sy = SHOULDER + 4;
    const sleeveCol = jacket ? (far ? C.shade(jacket, -14) : jacket) : (far ? C.shade(shirt, -14) : shirt);
    const elbow = limb(ctx, sx, sy, 92, 20, 16, ang[0], sleeveCol, C.rgba(PAL.ink, 0.5), true);
    brad(ctx, sx, sy, 3.6);
    brad(ctx, elbow[0], elbow[1], 2.8);
    const wrist = limb(ctx, elbow[0], elbow[1], 78, 16, 13, ang[0] + ang[1], sleeveCol, C.rgba(PAL.ink, 0.5), true);
    paper(ctx, () => blobPath(ctx, wrist[0], wrist[1] + 10, 9, 13, 10, 0.08, 5), {
      fill: far ? SKIN_D : SKIN, edge: C.rgba(PAL.ink, 0.45), edgeW: 1.2,
    });
    paper(ctx, () => blobPath(ctx, wrist[0] + 7, wrist[1] + 14, 4, 6, 4, 0.1, 4), {
      fill: far ? SKIN_D : SKIN, edge: C.rgba(PAL.ink, 0.4), edgeW: 1,
    });
    return wrist;
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
