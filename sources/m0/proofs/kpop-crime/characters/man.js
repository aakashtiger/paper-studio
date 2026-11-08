/* ============================================================
   THE RUN — male paper-cut cast.
   Same grammar as the KPOP rig: one continuous bent limb, a mitten
   hand, a paper face, a three-quarter yaw.

   CAST_STYLE is the one source of truth for a role. A role owns a
   palette, a coat silhouette, a hat, a badge and its face marks. A
   costume can still change (work coat, prison, court suit), but the
   role's palette holds, so the thief stays olive, the detective navy
   and the warder grey-khaki from the first frame to the last.

   Role options for a shot:
     man(ctx, x, y, s, { role: "thief" })      // grey flat cap, scarf
     detective(ctx, x, y, s, t, pose, face)    // navy trench, fedora, badge
     warder(ctx, x, y, s, t, pose, face)       // khaki uniform, peaked cap, baton
     judge(ctx, x, y, s, t, pose, face)        // black robe, glasses

   `role` wins over an inline `colors`/`hat`/`badge`. The only
   exception is `hat: null` (or false/"none"), the explicit bare-head
   state the thief needs when he leaves the grey hat on the barrier.
   ============================================================ */

const CAST_STYLE = {
  thief: {
    costume: "coat",
    coat: "work",
    colors: {
      skin: "#C98A5A",
      shirt: "#B9AE97",
      jacket: "#6B5A3E",
      jacketDark: "#4A3E2C",
      jacketLight: "#7C6A4A",
      trouser: "#2A2620",
      shoe: "#171310",
      hair: "#3A2E22",
      accent: "#7A2026",
    },
    hat: "flatcap",
    hatColor: "#6E6A62",
    scarf: "#7A2026",
    badge: false,
    tie: false,
    stubble: true,
    mustache: false,
    glasses: false,
    baton: false,
    keys: false,
  },
  detective: {
    costume: "coat",
    coat: "trench",
    colors: {
      skin: "#C98A5A",
      shirt: "#F3EEE2",
      jacket: "#1E2A3A",
      jacketDark: "#141C28",
      jacketLight: "#2C3A4E",
      trouser: "#1A2230",
      shoe: "#15120F",
      hair: "#241F1A",
      accent: "#7A1F26",
    },
    hat: "fedora",
    hatColor: "#241F1A",
    badge: true,
    tie: true,
    stubble: true,
    mustache: true,
    glasses: false,
    baton: false,
    keys: false,
  },
  warder: {
    costume: "uniform",
    colors: {
      skin: "#B87A4E",
      shirt: "#C8CCD0",
      jacket: "#8A8E92",
      jacketDark: "#5E6266",
      jacketLight: "#9AA0A6",
      trouser: "#3E4246",
      shoe: "#171310",
      hair: "#2A2620",
      accent: "#2A2E32",
    },
    hat: "peaked",
    hatColor: "#2A2E32",
    badge: true,
    tie: false,
    stubble: false,
    mustache: false,
    glasses: false,
    baton: true,
    keys: true,
  },
  judge: {
    costume: "robe",
    colors: {
      skin: "#D9A06A",
      shirt: "#F2E8D5",
      jacket: "#141210",
      jacketDark: "#0E0C0A",
      jacketLight: "#1E1A16",
      trouser: "#141210",
      shoe: "#141210",
      hair: "#4A4640",
      accent: "#5A1E24",
    },
    hat: null,
    badge: false,
    tie: false,
    stubble: true,
    mustache: true,
    glasses: true,
    baton: false,
    keys: false,
  },
};

function recordMan(who, x, y, s, t, pose, face) {
  if (!window.KPOP_MEASURE) return;
  (window.KPOP_CAST || (window.KPOP_CAST = [])).push({ who, x, y, s, t, pose, face });
}

function man(ctx, x, y, s, o = {}) {
  const role = o.role && Object.prototype.hasOwnProperty.call(CAST_STYLE, o.role) ? o.role : null;
  const RS = role ? CAST_STYLE[role] : null;
  const col = { ...(o.colors || {}) };
  if (RS) Object.assign(col, RS.colors);
  const costume = o.costume || (RS && RS.costume) || "shirt";
  const t = o.t || 0;
  const p = o.pose || {};
  const skin = col.skin || "#C98A5A";
  const shirt = col.shirt || "#D9D2C3";
  const jacket = col.jacket || "#2F3B4A";
  const jacketDark = col.jacketDark || C.shade(jacket, -16);
  const jacketLight = col.jacketLight || C.shade(jacket, 6);
  const trouser = col.trouser || "#1B2230";
  const shoe = col.shoe || "#171310";
  const hair = o.hair || col.hair || "#171310";
  const accent = col.accent || "#8E2430";
  // role identity wins over inline colours, hats and badges. `hat: null`
  // (or false/"none") is the explicit bare-head state (the thief sets the
  // grey hat down).
  let hat = o.hat;
  let hatColor = o.hatColor || null;
  if (RS) {
    const bare = o.hat === null || o.hat === false || o.hat === "none" || o.hat === "bare";
    hat = bare ? null : RS.hat;
    hatColor = RS.hatColor || o.hatColor || null;
  }
  const badge = RS ? !!RS.badge : !!o.badge;
  const scarf = RS ? (RS.scarf || null) : o.scarf;
  const tie = RS ? !!RS.tie : !!o.tie;
  const stubble = RS ? !!RS.stubble : !!o.stubble;
  const mustache = RS ? !!RS.mustache : !!o.mustache;
  const glasses = RS ? !!RS.glasses : !!o.glasses;
  const baton = RS ? !!RS.baton : !!o.baton;
  const keys = RS ? !!RS.keys : !!o.keys;
  const coatStyle = (RS && RS.coat) || "trench";
  const bounce = p.bounce || 0, sway = p.sway || 0, lean = p.lean || 0, yaw = p.yaw || 0;
  const armL = p.armL || [0.28, -0.35], armR = p.armR || [-0.32, 0.45];
  const legL = p.legL || [0.04, 0.02], legR = p.legR || [-0.04, -0.02];
  const headTilt = p.headTilt || 0, headTurn = p.headTurn || 0;
  const HIP = -280, SHOULDER = -500, HEAD = -604;
  const flip = o.flip || 1;

  // The thief is the film's "man" in the measured cast; every other role
  // can be recorded by its own name if a caller uses `role` without `who`.
  const who = o.who || (role === "thief" ? "man" : role) || "man";
  recordMan(who, x, y, s, t, { ...p, armL, armR, legL, legR, lean, headTurn, yaw }, o.face || {});

  function applyYaw() {
    const k = Math.abs(yaw);
    if (k < 0.001) return;
    ctx.scale(1 - k * 0.12, 1);
    ctx.transform(1, 0, -yaw * 0.06, 1, 0, 0);
  }

  ctx.save();
  ctx.translate(x, y);
  shadowEllipse(ctx, 0, 0, 48 * s, 10 * s, 0.24);
  ctx.scale(flip * s, s);

  // far arm behind the torso
  ctx.save();
  ctx.translate(0, bounce);
  ctx.translate(0, HIP); applyYaw(); ctx.rotate(lean); ctx.translate(0, -HIP);
  drawArm(-1, armL, true);
  // Hands behind the back: the near arm is painted before the torso, so the
  // coat covers it and only the cuff at the hip reads. Used by the yard.
  if (o.handsBehind) drawArm(1, armR, false);
  ctx.restore();

  // legs
  drawLeg(-1, legL, true);
  drawLeg(1, legR, false);
  function drawLeg(side, ang, far) {
    const hx = side * 24, hy = HIP + bounce;
    const target = side < 0 ? p.footL : p.footR;
    let a1 = ang[0], a2 = ang[1], foot = a1 + a2;
    if (Array.isArray(target)) {
      const sol = solveLeg(hx, hy, target[0], target[1], 158, 118, side);
      a1 = sol.hipAngle; a2 = sol.kneeBend; foot = sol.shinAngle;
    }
    const ankle = bentLimb(ctx, hx, hy, 158, 118, 60, 50, 34, a1, a2, far ? C.shade(trouser, -12) : trouser, C.rgba(PAL.ink, 0.55));
    ctx.save(); ctx.translate(ankle[0], ankle[1] - 2); ctx.rotate(foot * 0.4); ctx.scale(side < 0 ? -1 : 1, 1);
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-16, -8); ctx.lineTo(12, -8); ctx.quadraticCurveTo(30, -2, 30, 10); ctx.lineTo(-16, 10); ctx.closePath(); }, { fill: far ? C.shade(shoe, -10) : shoe, edge: C.rgba(PAL.ink, 0.6), edgeW: 2 });
    ctx.restore();
  }

  // torso group, pivots at the waist
  ctx.save();
  ctx.translate(0, HIP + bounce); applyYaw(); ctx.rotate(lean); ctx.translate(0, -HIP);
  rigAnchor(ctx, "chest", 0, SHOULDER);

  const torso = () => {
    ctx.beginPath();
    ctx.moveTo(-80, -500);
    ctx.quadraticCurveTo(-88, -420, -52, -280);
    ctx.lineTo(-46, -272); ctx.lineTo(46, -272); ctx.lineTo(52, -280);
    ctx.quadraticCurveTo(88, -420, 80, -500);
    ctx.quadraticCurveTo(0, -526, -80, -500);
    ctx.closePath();
  };
  const longCoat = () => {
    ctx.beginPath();
    ctx.moveTo(-84, -500);
    ctx.quadraticCurveTo(-94, -400, -62, -262);
    ctx.lineTo(-36, -252); ctx.lineTo(-24, -280); ctx.lineTo(24, -280); ctx.lineTo(36, -252);
    ctx.lineTo(62, -262); ctx.quadraticCurveTo(94, -400, 84, -500);
    ctx.quadraticCurveTo(0, -528, -84, -500);
    ctx.closePath();
  };
  // a hip-length work coat: boxy, no belt, patch pockets. It is the
  // working-class silhouette that separates the thief from the trench.
  const workCoat = () => {
    ctx.beginPath();
    ctx.moveTo(-82, -500);
    ctx.quadraticCurveTo(-90, -414, -68, -306);
    ctx.lineTo(-52, -282); ctx.lineTo(-52, -266);
    ctx.lineTo(52, -266); ctx.lineTo(52, -282);
    ctx.lineTo(68, -306); ctx.quadraticCurveTo(90, -414, 82, -500);
    ctx.quadraticCurveTo(0, -526, -82, -500);
    ctx.closePath();
  };
  const robe = () => {
    ctx.beginPath();
    ctx.moveTo(-86, -500);
    ctx.quadraticCurveTo(-100, -390, -80, -212);
    ctx.lineTo(80, -212); ctx.quadraticCurveTo(100, -390, 86, -500);
    ctx.quadraticCurveTo(0, -528, -86, -500);
    ctx.closePath();
  };

  // base shirt
  paper(ctx, torso, { fill: shirt, edge: C.rgba(PAL.ink, 0.72), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.18), sx: 4, sy: 7 });
  // collar
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * 52, -500); ctx.lineTo(sx * 20, -462); ctx.lineTo(sx * 10, -492); ctx.closePath();
    ctx.fillStyle = C.shade(shirt, 8); ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.3; ctx.stroke();
  }
  // buttons
  ctx.fillStyle = C.rgba(PAL.ink, 0.55);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, -440 + i * 34, 2.6, 0, TAU); ctx.fill(); }

  if (costume === "coat" || costume === "fugitive") {
    if (coatStyle === "work") {
      paper(ctx, workCoat, { fill: jacket, edge: C.rgba(PAL.ink, 0.78), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
      // work collar, turned down
      for (const sx of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(sx * 64, -498); ctx.lineTo(sx * 18, -462); ctx.lineTo(sx * 12, -496); ctx.closePath();
        ctx.fillStyle = jacketDark; ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 1.5; ctx.stroke();
      }
      // buttoned placket
      ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(0, -494); ctx.lineTo(0, -278); ctx.stroke();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = C.shade(jacket, -24);
        ctx.beginPath(); ctx.arc(0, -438 + i * 42, 3.6, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1; ctx.stroke();
      }
      // a straight hem seam, so the work coat ends on the trousers
      ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-52, -272); ctx.lineTo(52, -272); ctx.stroke();
      // patch pockets
      for (const sx of [-1, 1]) {
        paper(ctx, () => roundRectPath(ctx, sx > 0 ? 24 : -58, -388, 34, 32, 4), { fill: C.shade(jacket, 4), edge: C.rgba(PAL.ink, 0.62), edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.12), sx: 1, sy: 3 });
        ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(sx > 0 ? 26 : -56, -376); ctx.lineTo(sx > 0 ? 56 : -26, -376); ctx.stroke();
      }
    } else {
      paper(ctx, longCoat, { fill: jacket, edge: C.rgba(PAL.ink, 0.78), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
      // the trench hangs open: a white shirt V and the tie are the
      // detective's clearest read at a distance.
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-20, -506); ctx.lineTo(0, -450); ctx.lineTo(20, -506); ctx.closePath(); }, { fill: shirt, edge: C.rgba(PAL.ink, 0.5), edgeW: 1.4 });
      if (tie) drawTie(ctx, accent);
      // lapels
      for (const sx of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(sx * 70, -498); ctx.lineTo(sx * 24, -430); ctx.lineTo(sx * 16, -492); ctx.closePath();
        ctx.fillStyle = jacketLight; ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1.4; ctx.stroke();
      }
      // storm flap seam and belt
      ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-40, -470); ctx.quadraticCurveTo(-30, -360, -34, -262); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(40, -470); ctx.quadraticCurveTo(30, -360, 34, -262); ctx.stroke();
      ctx.fillStyle = C.rgba(PAL.ink, 0.62); ctx.fillRect(-46, -300, 92, 13);
      ctx.fillStyle = PAL.gold; ctx.fillRect(-8, -302, 16, 17);
      ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1; ctx.strokeRect(-8, -302, 16, 17);
      if (badge) drawBadgeShield(ctx, 44, -446, 1);
    }
  } else if (costume === "suit") {
    paper(ctx, torso, { fill: jacket, edge: C.rgba(PAL.ink, 0.8), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
    if (tie) {
      drawTie(ctx, accent);
    } else {
      // an open collar, no tie: the thief's court suit stays working class
      ctx.fillStyle = C.shade(shirt, 6);
      ctx.beginPath(); ctx.moveTo(-13, -498); ctx.lineTo(0, -452); ctx.lineTo(13, -498); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.2; ctx.stroke();
    }
    // lapels
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sx * 64, -498); ctx.lineTo(sx * 18, -440); ctx.lineTo(sx * 14, -492); ctx.closePath();
      ctx.fillStyle = C.shade(jacket, 10); ctx.fill(); ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.3; ctx.stroke();
    }
  } else if (costume === "prison") {
    // plain prison shirt, a number and a stripe
    paper(ctx, torso, { fill: shirt, edge: C.rgba(PAL.ink, 0.75), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.18), sx: 4, sy: 7 });
    ctx.fillStyle = C.rgba(PAL.ink, 0.75); ctx.fillRect(-38, -430, 76, 4);
    TY.text(ctx, "044", 0, -390, 22, { family: "DMMono", color: C.rgba(PAL.ink, 0.75), align: "center", letter: 2 });
    // trouser seam, dark: a pale stripe at the hip read as a white paper strip
    // hanging off the shirt in the yard close-ups
    ctx.fillStyle = C.rgba(PAL.ink, 0.16); ctx.fillRect(-38, -280, 5, 60);
  } else if (costume === "robe") {
    paper(ctx, robe, { fill: jacket, edge: C.rgba(PAL.ink, 0.9), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.24), sx: 4, sy: 7 });
    // white collar
    ctx.fillStyle = PAL.cream;
    ctx.beginPath(); ctx.moveTo(-18, -500); ctx.lineTo(0, -470); ctx.lineTo(18, -500); ctx.lineTo(0, -510); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1.2; ctx.stroke();
    // sleeve folds
    ctx.strokeStyle = C.rgba(PAL.cream, 0.12); ctx.lineWidth = 1.4;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 40, -470); ctx.quadraticCurveTo(sx * 30, -350, sx * 34, -240); ctx.stroke(); }
  } else if (costume === "uniform") {
    paper(ctx, torso, { fill: jacket, edge: C.rgba(PAL.ink, 0.8), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
    // stand collar
    ctx.fillStyle = jacketDark; ctx.fillRect(-46, -512, 92, 14);
    ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 1.3; ctx.strokeRect(-46, -512, 92, 14);
    // epaulettes
    for (const sx of [-1, 1]) {
      ctx.fillStyle = jacketDark; ctx.fillRect(sx > 0 ? 50 : -80, -502, 30, 7);
      ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1; ctx.strokeRect(sx > 0 ? 50 : -80, -502, 30, 7);
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(sx > 0 ? 76 : -76, -498, 3.2, 0, TAU); ctx.fill();
    }
    // two buttoned chest pockets
    for (const sx of [-1, 1]) {
      ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1.3;
      ctx.strokeRect(sx > 0 ? 18 : -52, -438, 34, 30);
      ctx.fillStyle = jacketDark; ctx.fillRect(sx > 0 ? 18 : -52, -438, 34, 6);
      ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(sx > 0 ? 35 : -35, -430, 2, 0, TAU); ctx.fill();
    }
    // belt and buckle
    ctx.fillStyle = C.rgba(PAL.ink, 0.72); ctx.fillRect(-46, -300, 92, 13);
    ctx.fillStyle = PAL.gold; ctx.fillRect(-8, -302, 16, 17);
    ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 1; ctx.strokeRect(-8, -302, 16, 17);
    // the badge is the same gold shield as the detective's
    if (badge) drawBadgeShield(ctx, 40, -466, 0.9);
    if (baton) drawBaton(ctx, -62, -296, 1);
    if (keys) drawKeys(ctx, 58, -288, 1);
  } else {
    // civilian shirt: a jacket over the shirt
    paper(ctx, torso, { fill: jacket, edge: C.rgba(PAL.ink, 0.78), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7 });
    ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(-12, -496); ctx.lineTo(0, -440); ctx.lineTo(12, -496); ctx.closePath(); ctx.fill();
  }

  // neck
  ctx.fillStyle = C.shade(skin, -8);
  ctx.fillRect(-14, -548, 28, 52);

  // the scarf sits over the neck base and the coat collar, under the chin
  if (scarf && (costume === "coat" || costume === "fugitive" || costume === "shirt")) {
    drawScarf(ctx, typeof scarf === "string" ? scarf : accent);
  }

  // head
  ctx.save();
  ctx.translate(yaw * 10, -530); ctx.rotate(headTilt + headTurn * 0.16 + yaw * 0.1); ctx.translate(0, 530);
  ctx.save(); ctx.translate(0, HEAD);
  manHead(ctx, { face: o.face, skin, hair, hat, hatColor, glasses, stubble, mustache }, t);
  ctx.restore();
  ctx.restore();

  if (!o.handsBehind) drawArm(1, armR, false);

  function drawArm(side, ang, far) {
    const sx = side * 80, sy = -500;
    const a1 = ang[0], a2 = ang[1];
    const jacketed = costume === "coat" || costume === "fugitive" || costume === "suit" || costume === "uniform" || costume === "robe";
    // the near sleeve is lighter and the far sleeve darker, so the arm
    // separates from the coat at every angle
    // A prison shirt is near-white: a 4-point lift is invisible against the
    // torso. The far sleeve is a deeper shade and the near sleeve a little
    // below the shirt, so a bare arm still separates from a white body.
    const sleeveCol = jacketed
      ? (far ? jacketDark : jacketLight)
      : (far ? C.shade(shirt, -22) : C.shade(shirt, -10));
    const wrist = bentLimb(ctx, sx, sy, 104, 88, 46, 40, 32, a1, a2, sleeveCol, C.rgba(PAL.ink, 0.65));
    ctx.save(); ctx.translate(wrist[0], wrist[1]); ctx.rotate(a1 + a2);
    manMitten(ctx, side, side < 0 ? a1 > 1.1 : a1 < -1.1, far ? C.shade(skin, -14) : skin, sleeveCol);
    ctx.restore();
    return wrist;
  }

  ctx.restore(); // torso
  ctx.restore(); // outer
}

/* A folded dark-red scarf: a band around the neck and one short tail. */
function drawScarf(ctx, col) {
  const edge = C.rgba(PAL.ink, 0.6);
  paper(ctx, () => roundRectPath(ctx, -42, -518, 84, 20, 8), { fill: col, edge, edgeW: 2, shadow: C.rgba(PAL.ink, 0.22), sx: 2, sy: 3 });
  // the fold that crosses the throat
  ctx.save();
  ctx.translate(-2, -508); ctx.rotate(-0.13);
  paper(ctx, () => roundRectPath(ctx, -34, -6, 68, 12, 5), { fill: C.shade(col, 10), edge: C.rgba(PAL.ink, 0.45), edgeW: 1.3 });
  ctx.restore();
  // the tail down the coat
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(4, -500); ctx.lineTo(20, -498); ctx.lineTo(24, -458);
    ctx.lineTo(13, -450); ctx.lineTo(8, -462); ctx.closePath();
  }, { fill: C.shade(col, -8), edge, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.18), sx: 1, sy: 3 });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.moveTo(6, -494); ctx.lineTo(18, -492); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(9, -478); ctx.lineTo(20, -476); ctx.stroke();
}

/* A dark-red tie over the detective's white shirt V. */
function drawTie(ctx, col) {
  ctx.save();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-7, -500); ctx.lineTo(0, -476); ctx.lineTo(7, -500);
  ctx.lineTo(5, -450); ctx.lineTo(0, -440); ctx.lineTo(-5, -450);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
  // knot
  ctx.fillStyle = C.shade(col, -12);
  ctx.beginPath(); ctx.moveTo(-7, -500); ctx.lineTo(0, -476); ctx.lineTo(7, -500); ctx.lineTo(0, -506); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}

/* A small gold shield with an ink edge: detective and warder only. */
function drawBadgeShield(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-9, -11); ctx.lineTo(9, -11); ctx.lineTo(9, 2);
    ctx.quadraticCurveTo(9, 9, 0, 13);
    ctx.quadraticCurveTo(-9, 9, -9, 2);
    ctx.closePath();
  }, { fill: PAL.gold, edge: PAL.ink, edgeW: 1.4, shadow: C.rgba(PAL.ink, 0.3), sx: 1, sy: 2 });
  ctx.fillStyle = C.rgba(PAL.ink, 0.82);
  starPath(ctx, 0, 0, 4.4, 0.45, 5);
  ctx.fill();
  ctx.restore();
}

/* A gold cap badge: a roundel with a dark star. */
function drawCapBadge(ctx, x, y, r = 6) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU);
  ctx.fillStyle = PAL.gold; ctx.fill();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = C.rgba(PAL.ink, 0.8);
  starPath(ctx, 0, 0, r * 0.56, 0.45, 5); ctx.fill();
  ctx.restore();
}

/* The warder's short baton, hanging off the belt. */
function drawBaton(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.rotate(0.1);
  // strap loop
  ctx.strokeStyle = C.rgba(PAL.ink, 0.65); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, 8, 0.2, Math.PI + 0.2); ctx.stroke();
  // shaft
  paper(ctx, () => roundRectPath(ctx, -5, 4, 10, 82, 5), { fill: "#2A2A26", edge: PAL.ink, edgeW: 1.8, shadow: C.rgba(PAL.ink, 0.26), sx: 2, sy: 4 });
  // grip and end cap
  ctx.fillStyle = "#4A4A42"; ctx.fillRect(-5, 12, 10, 22);
  ctx.strokeStyle = C.rgba(PAL.cream, 0.25); ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-4, 15 + i * 5); ctx.lineTo(4, 15 + i * 5); ctx.stroke(); }
  ctx.fillStyle = "#8A8478"; ctx.fillRect(-6, 84, 12, 5);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.7); ctx.lineWidth = 1.2; ctx.strokeRect(-6, 84, 12, 5);
  ctx.restore();
}

/* The warder's key ring, hanging off the belt. */
function drawKeys(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = "#C9C2B4"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.stroke();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.stroke();
  for (const [sx, rot] of [[-3, -0.22], [4, 0.2]]) {
    ctx.save(); ctx.translate(sx, 5); ctx.rotate(rot);
    ctx.fillStyle = "#D8D2C4";
    ctx.fillRect(-2, 0, 4, 20);
    ctx.fillRect(-2, 15, 9, 4);
    ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1;
    ctx.strokeRect(-2, 0, 4, 20); ctx.strokeRect(-2, 15, 9, 4);
    ctx.restore();
  }
  ctx.restore();
}

/* A grey flat cap: a low crown and a short brim, no gold band. The same
   shape is exported as flatCapProp() in props.js, so the hat the thief
   leaves on the barrier is the hat he wore. Origin is the brim centre. */
function drawFlatCap(ctx, color) {
  const c = color || "#6E6A62";
  const crown = C.shade(c, 8);
  const dark = C.shade(c, -18);
  // a thin brim base under the whole crown, then the short front lip
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-72, -4);
    ctx.quadraticCurveTo(-38, 8, 0, 8);
    ctx.quadraticCurveTo(38, 8, 66, 0);
    ctx.lineTo(62, 6);
    ctx.quadraticCurveTo(0, 16, -68, 4);
    ctx.closePath();
  }, { fill: dark, edge: C.rgba(PAL.ink, 0.65), edgeW: 1.8 });
  // short brim, a soft lip at the front
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-70, -2);
    ctx.quadraticCurveTo(-90, 2, -94, 10);
    ctx.quadraticCurveTo(-76, 15, -44, 8);
    ctx.lineTo(-40, -2);
    ctx.closePath();
  }, { fill: dark, edge: C.rgba(PAL.ink, 0.7), edgeW: 2, shadow: C.rgba(PAL.ink, 0.22), sx: 2, sy: 3 });
  // low flat crown
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-70, -4);
    ctx.quadraticCurveTo(-76, -30, -48, -40);
    ctx.quadraticCurveTo(-12, -48, 30, -44);
    ctx.quadraticCurveTo(66, -40, 72, -12);
    ctx.quadraticCurveTo(74, 0, 64, 2);
    ctx.quadraticCurveTo(0, 12, -70, -4);
    ctx.closePath();
  }, { fill: crown, edge: C.rgba(PAL.ink, 0.7), edgeW: 2, shadow: C.rgba(PAL.ink, 0.2), sx: 2, sy: 3 });
  // two panel seams and a cloth button, no gold
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-34, -42); ctx.quadraticCurveTo(-40, -24, -46, -2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -43); ctx.quadraticCurveTo(26, -22, 30, 0); ctx.stroke();
  ctx.fillStyle = C.shade(c, -10); ctx.beginPath(); ctx.arc(-2, -38, 3.6, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1; ctx.stroke();
  // the seam where the crown meets the brim
  ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-68, -2); ctx.quadraticCurveTo(0, 8, 64, 1); ctx.stroke();
}

/* The warder's peaked cap: dark band, crown, glossy black peak, gold badge. */
function drawPeakedCap(ctx, color) {
  const c = color || "#3E4238";
  const crown = C.shade(c, 12);
  const band = C.shade(c, -20);
  // crown
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-58, -84);
    ctx.quadraticCurveTo(-64, -124, -20, -136);
    ctx.quadraticCurveTo(28, -144, 56, -118);
    ctx.quadraticCurveTo(66, -104, 60, -84);
    ctx.closePath();
  }, { fill: crown, edge: C.rgba(PAL.ink, 0.75), edgeW: 2, shadow: C.rgba(PAL.ink, 0.22), sx: 2, sy: 3 });
  // band
  ctx.fillStyle = band; ctx.fillRect(-60, -90, 120, 13);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.7); ctx.lineWidth = 1.4; ctx.strokeRect(-60, -90, 120, 13);
  // black peak, glossy
  const g = ctx.createLinearGradient(0, -82, 0, -52);
  g.addColorStop(0, "#2E302C"); g.addColorStop(1, "#08090A");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-64, -80);
  ctx.quadraticCurveTo(0, -94, 64, -80);
  ctx.quadraticCurveTo(58, -58, 0, -54);
  ctx.quadraticCurveTo(-58, -58, -64, -80);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.85); ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = C.rgba("#FFFFFF", 0.16); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-46, -76); ctx.quadraticCurveTo(0, -86, 46, -76); ctx.stroke();
  // gold badge on the band
  drawCapBadge(ctx, 0, -96, 6.5);
}

function manHead(ctx, o, t) {
  const f = o.face || {};
  const skin = o.skin, hair = o.hair;
  const eyes = f.eyes || "normal";
  const mouth = f.mouth || "flat";
  const look = f.look || [0, 0];

  // face plate: a 4.1-head paper man, squarer than the idol
  paper(ctx, () => blobPath(ctx, 0, 0, 64, 74, 20, 0.01, 7), { fill: skin, edge: C.rgba(PAL.ink, 0.62), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.14), sx: 3, sy: 5 });
  for (const sx of [-1, 1]) {
    ctx.fillStyle = skin; ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(sx * 64, 4, 8, 13, 0, 0, TAU); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = C.rgba(PAL.ink, 0.07);
  ctx.beginPath(); ctx.ellipse(0, 50, 34, 12, 0, 0, TAU); ctx.fill();
  // A 5 o'clock shadow sits on the jaw, not over the mouth. The old 40x19 oval
  // at y 40 read as a pale muzzle panel at 1080p, and it appeared to come and
  // go with the light; this is one opaque shade of the skin at low alpha,
  // narrower and lower, with two short sideburns.
  if (o.stubble) {
    ctx.save(); ctx.globalAlpha = 0.30;
    ctx.fillStyle = C.shade(skin, -26);
    ctx.beginPath(); ctx.ellipse(0, 56, 32, 12, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.20;
    ctx.beginPath(); ctx.ellipse(-52, 16, 8, 15, 0.08, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(52, 16, 8, 15, -0.08, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = C.rgba(PAL.ink, 0.82); ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.moveTo(-43, -28); ctx.lineTo(-12, -32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -32); ctx.lineTo(43, -28); ctx.stroke();
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 28, -4); ctx.scale(sx, 1);
    if (eyes === "closed" || eyes === "happy") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(0, 0, 14, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke();
    } else if (eyes === "wide") {
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc((look[0] || 0) * 4, 0, 6.5, 0, TAU); ctx.fill();
    } else if (eyes === "narrow") {
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(13, 0); ctx.stroke();
    } else if (eyes === "star") {
      starPath(ctx, 0, 0, 16, 0.45, 5); ctx.fillStyle = PAL.ink; ctx.fill();
    } else {
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(2.6, -2.6, 2.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(3, 6); ctx.lineTo(6, 22); ctx.stroke();
  ctx.fillStyle = C.rgba(PAL.ink, 0.05); ctx.beginPath(); ctx.ellipse(6, 18, 6, 8, 0.2, 0, TAU); ctx.fill();
  if (o.mustache) {
    // two lobes; the judge and the detective keep it
    ctx.fillStyle = C.rgba(PAL.ink, 0.84);
    ctx.beginPath(); ctx.ellipse(-11, 27, 12, 5, -0.12, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11, 27, 12, 5, 0.12, 0, TAU); ctx.fill();
  }
  ctx.save(); ctx.translate(0, 42);
  if (mouth === "o") { ctx.fillStyle = "#6E1A22"; ctx.beginPath(); ctx.ellipse(0, 0, 6, 8, 0, 0, TAU); ctx.fill(); }
  else if (mouth === "sing") { ctx.fillStyle = "#6E1A22"; ctx.beginPath(); ctx.ellipse(0, 0, 8, 11, 0, 0, TAU); ctx.fill(); }
  else if (mouth === "smile" || mouth === "grin") { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -3, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  else { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.stroke(); }
  ctx.restore();
  // A short, spiky male cut: the hairline sits above the ears, the fringe is
  // cut in points, and no side lock reaches the jaw. The old smooth bob read
  // as a woman's head at 480 px, which broke the male-only cast.
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-64, -46);
    ctx.quadraticCurveTo(-68, -96, -36, -112);
    ctx.lineTo(-30, -96); ctx.lineTo(-20, -110); ctx.lineTo(-10, -94);
    ctx.lineTo(0, -112); ctx.lineTo(10, -94); ctx.lineTo(20, -110);
    ctx.lineTo(30, -94); ctx.lineTo(38, -108); ctx.lineTo(46, -92);
    ctx.quadraticCurveTo(66, -88, 64, -46);
    // The hairline is a ragged fringe: points that hang DOWN onto the
    // forehead and join the mass. A smooth edge plus a separate lock overlay
    // read as a spiky crown floating above a bald band.
    ctx.lineTo(54, -60);
    ctx.lineTo(43, -84);
    ctx.lineTo(32, -62);
    ctx.lineTo(21, -86);
    ctx.lineTo(10, -63);
    ctx.lineTo(0, -88);
    ctx.lineTo(-11, -64);
    ctx.lineTo(-22, -86);
    ctx.lineTo(-33, -62);
    ctx.lineTo(-44, -82);
    ctx.lineTo(-54, -58);
    ctx.quadraticCurveTo(-62, -62, -64, -46);
    ctx.closePath();
  }, { fill: hair, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.2 });
  // three cut locks, so the top reads as hair and not as a cap
  ctx.strokeStyle = C.rgba(hair, 0.95); ctx.lineWidth = 3.2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-22, -104); ctx.lineTo(-16, -90); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -106); ctx.lineTo(2, -88); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(22, -104); ctx.lineTo(26, -90); ctx.stroke();
  if (o.hat === "fedora") {
    const brim = o.hatColor || "#22201E";
    const crown = o.hatColor ? C.shade(o.hatColor, 10) : "#2B2926";
    ctx.fillStyle = brim;
    ctx.beginPath(); ctx.ellipse(0, -82, 86, 16, 0, 0, TAU); ctx.fill();
    // a lower, pinched crown: a fedora, not a top hat
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-52, -86);
      ctx.quadraticCurveTo(-56, -122, -28, -130);
      ctx.quadraticCurveTo(-10, -134, 0, -128);
      ctx.quadraticCurveTo(10, -134, 28, -130);
      ctx.quadraticCurveTo(56, -122, 52, -86);
      ctx.closePath();
    }, { fill: crown, edge: C.rgba(PAL.ink, 0.7), edgeW: 2 });
    ctx.fillStyle = o.hatColor ? "#3E3A34" : PAL.gold; ctx.fillRect(-52, -90, 104, 7);
  } else if (o.hat === "flatcap") {
    ctx.save(); ctx.translate(0, -76); drawFlatCap(ctx, o.hatColor || "#6E6A62"); ctx.restore();
  } else if (o.hat === "peaked") {
    drawPeakedCap(ctx, o.hatColor || "#3E4238");
  } else if (o.hat === "cap") {
    // legacy newsboy cap, kept for old callers
    ctx.fillStyle = "#22201E";
    ctx.beginPath(); ctx.ellipse(0, -82, 72, 14, 0, 0, TAU); ctx.fill();
    paper(ctx, () => roundRectPath(ctx, -50, -128, 100, 52, 14), { fill: "#2B2926", edge: C.rgba(PAL.ink, 0.7), edgeW: 2 });
    ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(0, -84, 76, 12, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(0, -110, 7, 0, TAU); ctx.fill();
  }
  if (o.glasses) {
    // wire spectacles, not blue goggles: the old PAL.blue rings read as a pair
    // of tinted lenses over dot eyes at 1080p.
    ctx.strokeStyle = C.rgba("#3A2E24", 0.92); ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.arc(-28, -4, 16, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(28, -4, 16, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, -4); ctx.lineTo(12, -4); ctx.stroke();
  }
}

/* A clearer paper mitten: a palm, a visible thumb on the body side, two
   finger creases, and a sleeve cuff drawn over the wrist seam. The cuff
   overlaps the palm, so the hand reads as attached at every arm angle. */
function manMitten(ctx, side, open, col, cuffCol) {
  const edge = C.rgba(PAL.ink, 0.55);
  // palm
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-8.5, -3);
    ctx.quadraticCurveTo(-11.5, 10, -8, 22);
    ctx.quadraticCurveTo(-5, 30, 0, 31);
    ctx.quadraticCurveTo(5, 30, 8, 22);
    ctx.quadraticCurveTo(11.5, 10, 8.5, -3);
    ctx.closePath();
  }, { fill: col, edge, edgeW: 1.4, shadow: C.rgba(PAL.ink, 0.16), sx: 1, sy: 2 });
  // thumb, on the inner side of the hand
  ctx.save();
  ctx.translate(-side * 7.5, 7);
  ctx.rotate(-side * (0.5 + (open ? 0.18 : 0)));
  paper(ctx, () => roundRectPath(ctx, -3.2, 0, 6.4, 15, 3.2), { fill: col, edge, edgeW: 1.2 });
  ctx.restore();
  // two finger creases, so the mitten still reads as a hand
  ctx.strokeStyle = C.rgba(PAL.ink, 0.28); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-3, 18); ctx.lineTo(-3, 27); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(3, 18); ctx.lineTo(3, 27); ctx.stroke();
  // the sleeve cuff overlaps the palm top and hides the wrist seam
  const cuff = cuffCol || col;
  paper(ctx, () => roundRectPath(ctx, -11.5, -8, 23, 9, 3), { fill: C.shade(cuff, -8), edge: C.rgba(PAL.ink, 0.7), edgeW: 1.6 });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-10, -1.5); ctx.lineTo(10, -1.5); ctx.stroke();
  ctx.fillStyle = C.rgba(PAL.ink, 0.55);
  ctx.beginPath(); ctx.arc(6.5, -4.5, 1.2, 0, TAU); ctx.fill();
}

function manHand(x, y, s, pose, side) {
  const arm = side === "L" ? (pose.armL || [0.28, -0.35]) : (pose.armR || [-0.32, 0.45]);
  const sx = side === "L" ? -80 : 80;
  const a1 = arm[0], a2 = arm[0] + arm[1];
  const hx = sx - Math.sin(a1) * 104 - Math.sin(a2) * 88;
  const hy = -500 + Math.cos(a1) * 104 + Math.cos(a2) * 88;
  return [x + hx * s, y + hy * s];
}

/* The canonical four roles. Each wrapper sets its role last, so an
   inline `role` in `extra` cannot turn the detective into the thief. */
function detective(ctx, x, y, s, t, pose, face, extra = {}) {
  const o = { t, pose, face, ...extra };
  o.role = "detective";
  o.who = "detective";
  return man(ctx, x, y, s, o);
}

function warder(ctx, x, y, s, t, pose, face, extra = {}) {
  const o = { t, pose, face, ...extra };
  o.role = "warder";
  o.who = "warder";
  return man(ctx, x, y, s, o);
}

function judge(ctx, x, y, s, t, pose, face, extra = {}) {
  const o = { t, pose, face, ...extra };
  o.role = "judge";
  o.who = "judge";
  return man(ctx, x, y, s, o);
}
