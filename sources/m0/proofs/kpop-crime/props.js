/* THE RUN — props. A knife, a case file, a tear-off calendar, handcuffs,
   a noose, a gavel, a stack of money, a ticket and the grey flat cap. */

function knifeProp(ctx, x, y, s, rot, glint = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, -6, 0, 16, 38, 3), { fill: "#4A3A2C", edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.3), sx: 2, sy: 3 });
  ctx.fillStyle = PAL.gold; ctx.fillRect(-6, 30, 16, 3);
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(10, 0); ctx.lineTo(4, -58); ctx.lineTo(-6, -42); ctx.closePath(); }, { fill: "#D8D2C4", edge: PAL.ink, edgeW: 1.4 });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(1, -8); ctx.lineTo(2, -46); ctx.stroke();
  if (glint > 0) {
    ctx.save(); ctx.translate(2, -50); ctx.rotate(glint * 0.6);
    ctx.fillStyle = C.rgba("#FFF6DA", 0.95); sparkPath(ctx, 0, 0, 14 + glint * 22); ctx.fill();
    ctx.strokeStyle = C.rgba("#FFD27A", 0.7); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function caseFile(ctx, x, y, s, rot, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.open) {
    // an open file: two spread pages, a spine and a red stamp
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-96, -58); ctx.quadraticCurveTo(-40, -70, -4, -54); ctx.lineTo(-4, 64); ctx.quadraticCurveTo(-46, 52, -96, 62); ctx.closePath(); }, { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(96, -58); ctx.quadraticCurveTo(40, -70, 4, -54); ctx.lineTo(4, 64); ctx.quadraticCurveTo(46, 52, 96, 62); ctx.closePath(); }, { fill: "#F2E8D5", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-96, -58, 92, 10); ctx.fillRect(4, -58, 92, 10);
    TY.text(ctx, "CASE 044", -88, -22, 12, { family: "DMMono", color: PAL.ink, letter: 1 });
    TY.text(ctx, "THE PEOPLE", 14, -22, 11, { family: "DMMono", color: PAL.ink, letter: 1 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-88, 0 + i * 13); ctx.lineTo(-16, 0 + i * 13); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(14, 0 + i * 13); ctx.lineTo(86, 0 + i * 13); ctx.stroke(); }
    if (o.stamp) {
      ctx.save(); ctx.translate(52, 40); ctx.rotate(-0.14); ctx.globalAlpha = o.stamp;
      ctx.strokeStyle = "#B8382A"; ctx.lineWidth = 3; ctx.strokeRect(-34, -14, 68, 28);
      TY.text(ctx, "SENTENCE", 0, 5, 12, { family: "Archivo Black", color: "#B8382A", align: "center", letter: 1 });
      ctx.restore();
    }
  } else {
    paper(ctx, () => roundRectPath(ctx, -54, -68, 108, 136, 4), { fill: "#E0D2B4", edge: PAL.ink, edgeW: 1.8, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-54, -68, 108, 13);
    TY.text(ctx, "CASE 044", 0, -34, 12, { family: "DMMono", color: PAL.ink, align: "center", letter: 1 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-40, -12 + i * 16); ctx.lineTo(40, -12 + i * 16); ctx.stroke(); }
    ctx.fillStyle = C.rgba(PAL.ink, 0.55); ctx.fillRect(-42, 48, 84, 4);
    // a corner tab, so the file reads as paper
    ctx.fillStyle = "#D8C8A8"; ctx.fillRect(40, -68, 14, 20);
  }
  ctx.restore();
}

function calendarProp(ctx, x, y, s, day, t, turn = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // the body: the new day is revealed as the page turns
  paper(ctx, () => roundRectPath(ctx, -64, -94, 128, 188, 5), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
  ctx.fillStyle = "#8E2430"; ctx.fillRect(-64, -94, 128, 28);
  TY.text(ctx, "THE RUN", 0, -74, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 1 });
  TY.text(ctx, String(day), 0, 40, 78, { family: "Archivo Black", color: PAL.ink, align: "center" });
  TY.text(ctx, "DAY", 0, 72, 13, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 4 });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-64, -66); ctx.lineTo(64, -66); ctx.stroke();
  // the torn page, hinged at the top, carrying the old day
  if (turn < 0.999) {
    const k = C.clamp(turn);
    const oldDay = o.oldDay ?? day - 1;
    ctx.save();
    ctx.translate(0, -94);
    ctx.rotate(-k * 2.4);
    ctx.globalAlpha = 1 - k * 0.15;
    paper(ctx, () => roundRectPath(ctx, -64, 0, 128, 188, 5), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.35), sx: 5, sy: 9 });
    ctx.fillStyle = "#B8382A"; ctx.fillRect(-64, 0, 128, 28);
    TY.text(ctx, "THE RUN", 0, 20, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 1 });
    TY.text(ctx, String(oldDay), 0, 134, 78, { family: "Archivo Black", color: PAL.ink, align: "center" });
    TY.text(ctx, "DAY", 0, 166, 13, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 4 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-64, 28); ctx.lineTo(64, 28); ctx.stroke();
    // curl highlight on the lifting corner
    ctx.strokeStyle = C.rgba("#FFFFFF", 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(64, 188); ctx.stroke();
    ctx.restore();
  }
  // the pin
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(0, -98, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

/* The chain between two cuff centres. It is inset to the cuff rims and
   starts and ends in a swivel ring, so the chain ends at the wrists and
   never floats between them. */
function handcuffChain(ctx, ax, ay, bx, by, s = 1) {
  const dx = bx - ax, dy = by - ay;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const ang = Math.atan2(dy, dx);
  const inset = 21 * s;
  const x0 = ax + ux * inset, y0 = ay + uy * inset;
  const x1 = bx - ux * inset, y1 = by - uy * inset;
  const span = Math.hypot(x1 - x0, y1 - y0);
  // swivels at the two cuff rims
  for (const [px, py] of [[x0, y0], [x1, y1]]) {
    ctx.strokeStyle = "#B8B2A4"; ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.ellipse(px, py, 4.5 * s, 7.5 * s, ang, 0, TAU); ctx.stroke();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1.2 * s;
    ctx.beginPath(); ctx.ellipse(px, py, 4.5 * s, 7.5 * s, ang, 0, TAU); ctx.stroke();
  }
  // links, alternating so the chain reads as a chain
  const n = Math.max(3, Math.round(span / (9 * s)));
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang + (i % 2 ? Math.PI / 2 : 0));
    ctx.strokeStyle = "#C8C2B4"; ctx.lineWidth = 2.6 * s;
    ctx.beginPath(); ctx.ellipse(0, 0, 4 * s, 7 * s, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1 * s;
    ctx.beginPath(); ctx.ellipse(0, 0, 4 * s, 7 * s, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
}

/* One cuff ring, drawn around a wrist. `closed` 0..1 swings the gate shut;
   the ring stays around the wrist the whole time. The gate is hinged at
   the top-left and swings out, so open and closed are two clear shapes. */
function cuffRing(ctx, x, y, s = 1, rot = 0, closed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const k = C.clamp(closed);
  const R = 22;
  const top = -Math.PI / 2;
  const a0 = top + 0.6;        // fixed bow, lower edge of the gap
  const a1 = top + TAU - 0.6;  // fixed bow, upper edge / hinge
  const metal = "#D8D2C4";
  function bow(angle0, angle1) {
    ctx.strokeStyle = metal; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, 0, R, angle0, angle1); ctx.stroke();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, R, angle0, angle1); ctx.stroke();
    ctx.strokeStyle = C.rgba("#FFF6DA", 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, R - 2.4, angle0, angle1); ctx.stroke();
  }
  bow(a0, a1);
  // the gate, hinged at a1, covering the gap when closed
  const hx = Math.cos(a1) * R, hy = Math.sin(a1) * R;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate((1 - k) * 1.5);
  ctx.translate(-hx, -hy);
  bow(a1, a0 + TAU);
  const fa = a0 + TAU;
  ctx.save();
  ctx.translate(Math.cos(fa) * R, Math.sin(fa) * R);
  ctx.rotate(fa + Math.PI / 2);
  ctx.fillStyle = "#8A8478"; ctx.fillRect(-5.5, -6, 11, 12);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.7); ctx.lineWidth = 1.2; ctx.strokeRect(-5.5, -6, 11, 12);
  ctx.restore();
  ctx.restore();
  // hinge pin
  ctx.fillStyle = "#B8B2A4"; ctx.beginPath(); ctx.arc(hx, hy, 3.4, 0, TAU); ctx.fill();
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.2; ctx.stroke();
  // ratchet block and keyhole on the fixed bow
  ctx.fillStyle = "#8A8478"; ctx.fillRect(-8, R - 4, 16, 11);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 1; ctx.strokeRect(-8, R - 4, 16, 11);
  ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(0, R + 3, 2.2, 0, TAU); ctx.fill();
  ctx.restore();
}

/* A pair of cuffs held in the hand or hooked on a belt. The first ring is
   the wrist cuff (closed); the second swings shut as `closed` goes 0 -> 1. */
function handcuffs(ctx, x, y, s, rot, closed = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  handcuffChain(ctx, 0, 0, 62, 0, 1);
  cuffRing(ctx, 0, 0, 1, 0, 1);
  cuffRing(ctx, 62, 0, 1, 0, closed);
  ctx.restore();
}

/* Two cuffs, one on each wrist, with the chain between them. */
function handcuffsPair(ctx, ax, ay, bx, by, s = 1, closed = 1) {
  handcuffChain(ctx, ax, ay, bx, by, s);
  const rot = Math.atan2(by - ay, bx - ax);
  cuffRing(ctx, ax, ay, s, rot, 1);
  cuffRing(ctx, bx, by, s, rot, closed);
}

/* The standing part of the noose. It leaves the beam, runs down the SIDE of
   the head (`sideX`), and turns in to the knot at the loop. It never crosses
   the face. */
function nooseRope(ctx, x, beamY, endX, endY, sway = 0, s = 1, sideX = null) {
  ctx.save(); ctx.translate(x, 0); ctx.scale(s, s);
  const sx = (sideX === null ? endX : sideX) - x;
  const knotX = endX - x;
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(0, beamY);
    ctx.quadraticCurveTo(sx * 0.30 + sway * 18, beamY + 34, sx, beamY + 80);
    ctx.lineTo(sx, endY - 54);
    ctx.quadraticCurveTo(sx, endY - 12, knotX, endY);
  };
  ctx.strokeStyle = "#8A6A42"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round";
  path(); ctx.stroke();
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 5;
  path(); ctx.stroke();
  // rope twist ticks down the visible side
  ctx.strokeStyle = C.rgba("#F2D9A0", 0.5); ctx.lineWidth = 1.6;
  for (let i = 0; i < 8; i++) {
    const yy = beamY + 80 + (endY - 54 - beamY - 80) * (i / 7);
    ctx.beginPath(); ctx.moveTo(sx - 4, yy); ctx.lineTo(sx + 4, yy + 6); ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    const u = i / 3;
    const px = C.lerp(sx, knotX, u), py = C.lerp(endY - 54, endY, u * u);
    ctx.beginPath(); ctx.moveTo(px - 4, py); ctx.lineTo(px + 4, py + 6); ctx.stroke();
  }
  ctx.restore();
}

function nooseLoop(ctx, x, y, s = 1, sway = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.35); ctx.scale(s, s);
  // two offset wraps of rope at the neck / collar, not a gold ring
  for (const [rx, ry, rot, ox, oy] of [[32, 18, -0.06, 0, 0], [26, 14, 0.28, 2, 2]]) {
    ctx.strokeStyle = "#5A3E26"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, rot, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "#B89A6A"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, rot, 0, TAU); ctx.stroke();
  }
  // twist ticks, so the loop reads as rope
  ctx.strokeStyle = C.rgba("#E8C88A", 0.6); ctx.lineWidth = 1.4;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    const px = Math.cos(a) * 32, py = Math.sin(a) * 18;
    ctx.beginPath(); ctx.moveTo(px - 3, py - 2); ctx.lineTo(px + 3, py + 2); ctx.stroke();
  }
  // the knot at the side of the neck, the rope's own width
  ctx.fillStyle = "#5A3E26"; ctx.beginPath(); ctx.ellipse(32, -6, 8, 11, 0.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#B89A6A"; ctx.lineWidth = 2.2; ctx.stroke();
  // two short tails
  ctx.strokeStyle = "#5A3E26"; ctx.lineWidth = 7; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(34, -4); ctx.lineTo(50, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(34, -2); ctx.lineTo(48, 4); ctx.stroke();
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(34, -4); ctx.lineTo(50, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(34, -2); ctx.lineTo(48, 4); ctx.stroke();
  ctx.restore();
}

function nooseProp(ctx, x, y, s, t, sway = 0) {
  nooseLoop(ctx, x, y, s, sway);
}

/* A rope binding around two wrists held together at the waist. Two wraps, a
   knot and two short tails, so the binding reads at a glance. */
function boundWrists(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // two offset wraps of rope around the pair of wrists
  for (const [rx, ry, oy, a] of [[27, 13, 0, -0.08], [23, 11, 2, 0.18]]) {
    ctx.strokeStyle = "#5A3E26"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(0, oy, rx, ry, a, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "#B89A6A"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(0, oy, rx, ry, a, 0, TAU); ctx.stroke();
  }
  // twist ticks, so it reads as rope
  ctx.strokeStyle = C.rgba("#E8C88A", 0.6); ctx.lineWidth = 1.4;
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * TAU;
    const px = Math.cos(a) * 27, py = Math.sin(a) * 13;
    ctx.beginPath(); ctx.moveTo(px - 3, py - 2); ctx.lineTo(px + 3, py + 2); ctx.stroke();
  }
  // the knot, on the right, and two tails
  ctx.fillStyle = "#5A3E26"; ctx.beginPath(); ctx.ellipse(27, -4, 8, 11, 0.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#B89A6A"; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.strokeStyle = "#5A3E26"; ctx.lineWidth = 7; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(29, -2); ctx.lineTo(43, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(29, 0); ctx.lineTo(41, 10); ctx.stroke();
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(29, -2); ctx.lineTo(43, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(29, 0); ctx.lineTo(41, 10); ctx.stroke();
  ctx.restore();
}

/* A gavel resting on its sound block. (x,y) is the block on the bench TOP;
   the head sits above it and the handle lies up-right along the top. */
function gavelProp(ctx, x, y, s, rot, strike = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // the sound block on the bench top
  paper(ctx, () => roundRectPath(ctx, -34, -9, 68, 18, 4), { fill: "#5A3A22", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 5 });
  ctx.fillStyle = C.rgba("#FFD27A", 0.5); ctx.fillRect(-30, -9, 60, 3);
  // the gavel, lifted by `strike` and dropped onto the block
  const lift = Math.sin(C.clamp(strike) * Math.PI) * 34;
  ctx.save(); ctx.translate(0, -22 - lift); ctx.rotate(rot - C.clamp(strike) * 0.35);
  // handle first, so the head sits on top of it
  paper(ctx, () => roundRectPath(ctx, 26, -7, 88, 14, 6), { fill: "#5A3A22", edge: PAL.ink, edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.25), sx: 3, sy: 5 });
  ctx.fillStyle = PAL.gold; ctx.fillRect(96, -6, 12, 12);
  // the head
  paper(ctx, () => roundRectPath(ctx, -40, -13, 80, 26, 6), { fill: "#7A4A2A", edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.fillStyle = "#C68E2E"; ctx.fillRect(-40, -13, 80, 4);
  ctx.fillStyle = "#5A3A22"; ctx.fillRect(-40, 9, 80, 4);
  ctx.restore();
  // impact ring at the block
  if (strike > 0.85) {
    ctx.save(); ctx.globalAlpha = (strike - 0.85) / 0.15;
    ctx.strokeStyle = C.rgba("#FFD27A", 0.8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 6, 62, 15, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

/* A stack of 8-10 banknotes: pale green/cream paper, a dark-green 100, a
   red currency band, and three loose notes under the stack. Reads at 1x.
   (x,y) is the centre of the top note. */
function moneyProp(ctx, x, y, s, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const green = "#2E5B3C";
  const pale = "#DDE6C6";
  const cream = "#E9E4CB";
  const red = "#A8322A";
  const W = 112, H = 56;
  // loose notes under the stack
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(-42 + i * 26, 8 - i * 5);
    ctx.rotate(-0.26 + i * 0.2);
    paper(ctx, () => roundRectPath(ctx, -W / 2, -H / 2, W, H, 3), { fill: i === 1 ? pale : cream, edge: C.rgba(PAL.ink, 0.5), edgeW: 1.4, shadow: C.rgba(PAL.ink, 0.2), sx: 2, sy: 3 });
    ctx.strokeStyle = C.rgba(green, 0.55); ctx.lineWidth = 1.4;
    ctx.strokeRect(-W / 2 + 11, -H / 2 + 8, W - 22, H - 16);
    TY.text(ctx, "100", 20, 8, 18, { family: "DMMono", color: green, align: "center", letter: 1 });
    ctx.restore();
  }
  // the stack, bottom to top
  const n = Math.max(8, Math.min(10, o.count || 9));
  const step = 2.2;
  for (let i = n - 1; i >= 0; i--) {
    const yy = -i * step;
    paper(ctx, () => roundRectPath(ctx, -W / 2, yy - H / 2, W, H, 3), { fill: i % 2 ? cream : pale, edge: C.rgba(PAL.ink, 0.35), edgeW: 1, shadow: i === n - 1 ? C.rgba(PAL.ink, 0.28) : null, sx: 2, sy: 3 });
    // the note edge, so the stack reads as paper
    ctx.strokeStyle = C.rgba(PAL.ink, 0.18); ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-W / 2 + 2, yy + H / 2 - 1); ctx.lineTo(W / 2 - 2, yy + H / 2 - 1); ctx.stroke();
  }
  const ty = -(n - 1) * step;
  // top note: border, portrait oval, the 100
  ctx.strokeStyle = C.rgba(green, 0.65); ctx.lineWidth = 1.8;
  ctx.strokeRect(-W / 2 + 10, ty - H / 2 + 8, W - 20, H - 16);
  ctx.fillStyle = C.rgba(green, 0.12); ctx.strokeStyle = C.rgba(green, 0.55); ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(-32, ty + 2, 12, 17, 0, 0, TAU); ctx.fill(); ctx.stroke();
  TY.text(ctx, "100", 6, ty + 9, 25, { family: "DMMono", color: green, align: "center", letter: 1 });
  TY.text(ctx, "100", -32, ty + 30, 11, { family: "DMMono", color: green, align: "center", letter: 1 });
  TY.text(ctx, "100", 18, ty - 14, 10, { family: "DMMono", color: green, align: "center", letter: 1 });
  ctx.strokeStyle = C.rgba(green, 0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-48, ty + 22); ctx.lineTo(-16, ty + 22); ctx.stroke();
  // the red currency band wraps the whole stack
  const bandTop = ty - H / 2 - 1;
  const bandH = (n - 1) * step + H + 2;
  ctx.fillStyle = red;
  ctx.fillRect(32, bandTop, 16, bandH);
  ctx.fillStyle = C.rgba("#000000", 0.15); ctx.fillRect(44, bandTop, 4, bandH);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1;
  ctx.strokeRect(32, bandTop, 16, bandH);
  TY.text(ctx, "100", 40, bandTop + bandH * 0.62, 9, { family: "DMMono", color: PAL.cream, align: "center", letter: 0.5 });
  ctx.restore();
}

/* A paper ticket with a printed route, a perforated stub and a notch on
   the right edge. Draw it before the hand: the holding hand should cover
   the bottom edge, so the ticket reads as held, never as a hand coming
   out of the paper. (x,y) is the ticket centre. */
function ticketProp(ctx, x, y, s = 1, rot = 0, o = {}) {
  const W = 128, H = 64, notch = 8;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(-W / 2 + 5, -H / 2);
    ctx.lineTo(W / 2 - 5, -H / 2);
    ctx.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + 5);
    ctx.lineTo(W / 2, -notch);
    ctx.arc(W / 2, 0, notch, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(W / 2, H / 2 - 5);
    ctx.quadraticCurveTo(W / 2, H / 2, W / 2 - 5, H / 2);
    ctx.lineTo(-W / 2 + 5, H / 2);
    ctx.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - 5);
    ctx.lineTo(-W / 2, -H / 2 + 5);
    ctx.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + 5, -H / 2);
    ctx.closePath();
  };
  paper(ctx, body, { fill: "#EFE4CC", edge: PAL.ink, edgeW: 1.8, shadow: C.rgba(PAL.ink, 0.26), sx: 3, sy: 5 });
  // the dark header band
  ctx.save(); body(); ctx.clip();
  ctx.fillStyle = "#8E2430"; ctx.fillRect(-W / 2, -H / 2, W, 10);
  ctx.restore();
  TY.text(ctx, o.title || "THE RUN", -W / 2 + 44, -H / 2 + 22, 8, { family: "DMMono", color: C.rgba(PAL.cream, 0.9), letter: 1 });
  // the stub, left of the perforation
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(-W / 2 + 38, -H / 2 + 14); ctx.lineTo(-W / 2 + 38, H / 2 - 10); ctx.stroke();
  ctx.setLineDash([]);
  TY.text(ctx, o.time || "02:10", -W / 2 + 19, 2, 10, { family: "DMMono", color: PAL.ink, align: "center", letter: 1 });
  TY.text(ctx, o.code || "N2", -W / 2 + 19, 20, 8, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 1 });
  // the printed route, main field, clear of the notch
  TY.text(ctx, o.route || "NORTH", -W / 2 + 44, 0, 15, { family: "DMMono", color: PAL.ink, letter: 1 });
  TY.text(ctx, o.note || "ONE WAY", -W / 2 + 44, 17, 8, { family: "DMMono", color: C.rgba("#8E2430", 0.9), letter: 1 });
  // a barcode along the bottom of the main field
  ctx.fillStyle = C.rgba(PAL.ink, 0.75);
  for (let i = 0; i < 11; i++) ctx.fillRect(-W / 2 + 44 + i * 4, H / 2 - 10, i % 3 ? 1.4 : 2.6, 7);
  ctx.restore();
}

/* The same grey flat cap the thief wears, for the barrier or the
   detective's hand. Draws with the one shape in man.js, so the hat on
   the barrier is the hat that was on his head. (x,y) is the brim centre. */
function flatCapProp(ctx, x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (typeof drawFlatCap === "function") drawFlatCap(ctx, o.color || "#6E6A62");
  ctx.restore();
}
