/* THE RUN — the 60 s sets. A wet station, a night carriage, a checkpoint at the
   city's edge. Same paper-cut grammar as sets.js: lit boards, warm practicals,
   visible edges, rain where the script says rain. Every set is a pure function
   of t; no Math.random, no wall clock.

   Rebuilt for set legibility:
   - the train is a carriage: a window band of four night windows, a luggage
     rack, a row of seat backs with headrests, an empty facing seat, a curved
     ceiling with pendant lamps and a vestibule door;
   - the station has a glass ticket window with a clerk behind it, a ticket
     slot in the counter, a departures board, a clock, a bench and a train
     waiting outside. */

/* ---------------- the arm solver ----------------

   manHand() turns a pose's [armL/armR] into the wrist the rig paints
   (man.js drawArm -> bentLimb, 104 + 88). solveArm() is that map inverted, so
   a shot can say "this hand is ON that wrist" and the rig draws it there. The
   hand-tuned angle pairs it replaces miss contact by 40-100 px, which is how
   the cuffs came to close on nobody.

   Convention, derived from manHand and checked against both default poses:
     shoulder   (side*80, -500)
     hand       shoulder + 104*u(a1) + 88*u(a1 + bend),  u(t) = (-sin t, cos t)
     bend > 0 on the right arm, < 0 on the left, so both elbows point out. */
function solveArm(rootX, rootY, s, side, tx, ty) {
  const sx = side === "L" ? -80 : 80;
  const L1 = 104, L2 = 88;
  const vx = (tx - rootX) / s - sx;
  const vy = (ty - rootY) / s + 500;
  const d = Math.max(Math.abs(L1 - L2) + 0.001, Math.min(L1 + L2 - 0.001, Math.hypot(vx, vy)));
  const base = Math.atan2(-vx, vy);
  const cosBend = C.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
  const bend = Math.acos(cosBend) * (side === "L" ? -1 : 1);
  // the sum of the two bones points off the first bone by psi, not by half the
  // bend: the bones are 104 and 88, so the direction is weighted.
  const psi = Math.atan2(L2 * Math.sin(bend), L1 + L2 * Math.cos(bend));
  return [base - psi, bend];
}

/* The wrist solveArm puts at (tx,ty), and the palm centre 15 px beyond it, so a
   shot can put a cuff ring on the wrist and a thumb on the palm. */
function armReach(rootX, rootY, s, side, tx, ty) {
  const pose = { armL: [0, 0], armR: [0, 0] };
  pose[side === "L" ? "armL" : "armR"] = solveArm(rootX, rootY, s, side, tx, ty);
  const wrist = manHand(rootX, rootY, s, pose, side);
  const ang = pose[side === "L" ? "armL" : "armR"];
  const dir = ang[0] + ang[1];
  // manMitten runs 3..31 local px down its own y axis, i.e. u(a1+a2)
  const palm = [wrist[0] - Math.sin(dir) * 16 * s, wrist[1] + Math.cos(dir) * 16 * s];
  return { arm: ang, wrist, palm };
}

/* ---------------- the station ---------------- */

/* A hanging station lamp: brass stem, enamel shade, warm pool. */
function stationLamp60(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 64); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-46, 64); ctx.lineTo(46, 64); ctx.lineTo(34, 100); ctx.lineTo(-34, 100); ctx.closePath(); }, { fill: "#2F4A3A", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.fillStyle = C.rgba("#FFE2A0", 0.75); ctx.beginPath(); ctx.ellipse(0, 100, 24, 6, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(0, 100, 6, 0, 100, 260);
  g.addColorStop(0, C.rgba("#FFE2A0", 0.34)); g.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 100, 260, 0, TAU); ctx.fill();
  ctx.restore();
}

/* The train waiting on the far platform, seen through the station glass. */
function stationTrain60(ctx, x, y, w, h, t) {
  // body, roof, skirt
  ctx.fillStyle = "#18221E"; ctx.fillRect(x, y + h * 0.34, w, h * 0.66);
  ctx.fillStyle = "#0E1614"; ctx.fillRect(x, y + h * 0.30, w, h * 0.08);
  ctx.fillStyle = C.rgba("#8AB0A0", 0.18); ctx.fillRect(x, y + h * 0.30, w, 3);
  // a row of lit carriage windows, rain-blurred
  const winY = y + h * 0.52;
  for (let i = 0; i < 7; i++) {
    const wx = x + w * 0.06 + i * w * 0.128;
    const lit = 0.55 + 0.35 * C.hash(i * 5.3);
    ctx.fillStyle = C.rgba("#FFD27A", lit);
    ctx.fillRect(wx, winY, w * 0.092, h * 0.20);
    ctx.strokeStyle = C.rgba("#1A1410", 0.7); ctx.lineWidth = 2;
    ctx.strokeRect(wx, winY, w * 0.092, h * 0.20);
    ctx.fillStyle = C.rgba("#171310", 0.35);
    ctx.fillRect(wx + 2, winY + h * 0.10, w * 0.092 - 4, 3);
  }
  // the tail lamp and a red signal
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(x + w * 0.96, y + h * 0.46, 7, 0, TAU); ctx.fill();
  const rg = ctx.createRadialGradient(x + w * 0.96, y + h * 0.46, 3, x + w * 0.96, y + h * 0.46, 54);
  rg.addColorStop(0, C.rgba("#FF6A4A", 0.55)); rg.addColorStop(1, C.rgba("#FF6A4A", 0));
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x + w * 0.96, y + h * 0.46, 54, 0, TAU); ctx.fill();
  // platform edge line
  ctx.fillStyle = C.rgba("#D8C8A8", 0.55);
  ctx.fillRect(x, y + h * 0.90, w, 3);
}

function stationSet(ctx, t, o = {}) {
  paperBg(ctx, "#1A2830", "#2C3A42");
  // tiled wall, cool and wet
  ctx.fillStyle = "#2A3A42"; ctx.fillRect(0, 0, W, 900);
  ctx.strokeStyle = C.rgba("#14242C", 0.85); ctx.lineWidth = 3;
  for (let x = 0; x < W; x += 104) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke(); }
  for (let y = 96; y < 900; y += 78) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8AA0A8", 0.22); ctx.lineWidth = 1.4;
  for (let y = 98; y < 900; y += 78) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // soot band and a high clock
  ctx.fillStyle = C.rgba("#101A20", 0.55); ctx.fillRect(0, 0, W, 90);
  paper(ctx, () => { ctx.beginPath(); ctx.arc(920, 130, 52, 0, TAU); }, { fill: "#E8DCC4", edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    ctx.beginPath(); ctx.moveTo(920 + Math.cos(a) * 38, 130 + Math.sin(a) * 38);
    ctx.lineTo(920 + Math.cos(a) * 45, 130 + Math.sin(a) * 45); ctx.stroke();
  }
  // the clock is set to 02:10, the time on his ticket: hour just past two,
  // minute on the ten. One hand each, no extra strokes.
  const hourA = ((2 + 10 / 60) / 12) * TAU - Math.PI / 2;
  const minA = (10 / 60) * TAU - Math.PI / 2;
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(920, 130); ctx.lineTo(920 + Math.cos(hourA) * 28, 130 + Math.sin(hourA) * 28); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(920, 130); ctx.lineTo(920 + Math.cos(minA) * 40, 130 + Math.sin(minA) * 40); ctx.stroke();
  // the second hand runs on the film's own clock, one turn a minute
  const sec = C.frac(t / 60);
  ctx.strokeStyle = "#B8382A"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(920, 130); ctx.lineTo(920 + Math.cos(sec * TAU - Math.PI / 2) * 44, 130 + Math.sin(sec * TAU - Math.PI / 2) * 44); ctx.stroke();
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(920, 130, 5, 0, TAU); ctx.fill();

  // the enamel station name over the platform window, left of the cue ticker
  paper(ctx, () => roundRectPath(ctx, 1104, 96, 522, 62, 6), { fill: "#102A2A", edge: "#0A1414", edgeW: 4, shadow: C.rgba(PAL.ink, 0.45), sx: 5, sy: 8 });
  ctx.strokeStyle = C.rgba("#E8DCC4", 0.75); ctx.lineWidth = 2; ctx.strokeRect(1114, 104, 502, 46);
  TY.text(ctx, "CENTRAL STATION", 1365, 132, 23, { family: "Archivo Black", color: "#F2E8D5", align: "center", letter: 4 });
  ctx.fillStyle = C.rgba("#8AA0A8", 0.4); ctx.fillRect(1106, 94, 518, 4);

  // the platform window, right: rain, a waiting train, a far lamp
  paper(ctx, () => roundRectPath(ctx, 1120, 190, 690, 430, 6), { fill: "#12202A", edge: "#5A4A3A", edgeW: 11, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
  const glass = ctx.createLinearGradient(0, 190, 0, 620);
  glass.addColorStop(0, C.rgba("#4A6A82", 0.45));
  glass.addColorStop(0.55, C.rgba("#1A2C3A", 0.8));
  glass.addColorStop(1, C.rgba("#0E1A22", 0.95));
  ctx.fillStyle = glass; ctx.fillRect(1132, 202, 666, 406);
  // the train idling outside, behind the rain
  stationTrain60(ctx, 1128, 202, 674, 406, t);
  // rain on the glass, running down
  ctx.strokeStyle = C.rgba("#C8D8E8", 0.34); ctx.lineWidth = 2;
  for (let i = 0; i < 50; i++) {
    const x = 1140 + (i * 61 + C.hash(i * 2.3) * 22) % 650;
    const y = 206 + ((C.hash(i * 3.7) * 430 + t * (70 + C.hash(i * 5.9) * 90)) % 430);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 24 + C.hash(i * 7.1) * 20); ctx.stroke();
  }
  // a far platform lamp, with its pool on the wet platform
  ctx.fillStyle = C.rgba("#FFF2C8", 0.9); ctx.beginPath(); ctx.arc(1490, 392, 11, 0, TAU); ctx.fill();
  const tl = ctx.createRadialGradient(1490, 392, 6, 1490, 392, 210);
  tl.addColorStop(0, C.rgba("#FFE2A0", 0.5)); tl.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = tl; ctx.beginPath(); ctx.arc(1490, 392, 210, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#3A4A52"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(1490, 392); ctx.lineTo(1490, 560); ctx.stroke();
  // wet platform lines at the bottom of the glass
  ctx.fillStyle = C.rgba("#FFE2A0", 0.10); ctx.fillRect(1132, 570, 666, 4);
  ctx.fillStyle = C.rgba("#C8D8E8", 0.12); ctx.fillRect(1132, 588, 666, 2);
  // window mullions
  ctx.strokeStyle = "#5A4A3A"; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(1465, 190); ctx.lineTo(1465, 620); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1120, 405); ctx.lineTo(1810, 405); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.4); ctx.lineWidth = 2;
  ctx.strokeRect(1128, 198, 674, 414);
  // condensation at the bottom edge
  ctx.fillStyle = C.rgba("#DFF0FF", 0.10); ctx.fillRect(1132, 590, 666, 18);

  // the ticket booth, left: a glass window, a clerk, a ticket slot
  // kiosk body, standing on the floor
  paper(ctx, () => roundRectPath(ctx, 80, 240, 560, 660, 6), { fill: "#3A2A1E", edge: PAL.ink, edgeW: 5, shadow: C.rgba(PAL.ink, 0.4), sx: 7, sy: 11 });
  ctx.fillStyle = "#2A1E16"; ctx.fillRect(92, 258, 536, 642);
  // cornice and brass rail
  ctx.fillStyle = "#6A4A30"; ctx.fillRect(74, 234, 572, 16);
  ctx.fillStyle = C.rgba("#C8A86A", 0.6); ctx.fillRect(74, 234, 572, 4);
  ctx.fillStyle = "#5A3A26"; ctx.fillRect(74, 250, 572, 8);
  // the booth interior: warm back wall, pigeonholes, a desk lamp
  ctx.fillStyle = "#4A3422"; ctx.fillRect(140, 300, 440, 246);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.22); ctx.fillRect(140, 300, 440, 246);
  // ticket rack: two columns of pigeonholes
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
    ctx.fillStyle = "#241A12"; ctx.fillRect(166 + c * 62, 316 + r * 46, 50, 36);
    ctx.fillStyle = C.rgba("#E8DCC4", 0.55); ctx.fillRect(172 + c * 62, 322 + r * 46, 38, 6);
    ctx.fillStyle = C.rgba("#E8B84A", 0.35); ctx.fillRect(172 + c * 62, 332 + r * 46, 26, 4);
  }
  // the desk lamp behind the counter, painted before the clerk so it backlights him
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(544, 540); ctx.lineTo(544, 476); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(518, 476); ctx.lineTo(570, 476); ctx.lineTo(560, 446); ctx.lineTo(528, 446); ctx.closePath(); }, { fill: "#E8B84A", edge: PAL.ink, edgeW: 3 });
  const cl = ctx.createRadialGradient(544, 486, 4, 544, 486, 160);
  cl.addColorStop(0, C.rgba("#FFE2A0", 0.45)); cl.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = cl; ctx.beginPath(); ctx.arc(544, 486, 160, 0, TAU); ctx.fill();
  // the clerk, a dark silhouette behind the glass, in the right pane. Square
  // jaw, short flat hair and sideburns: the round head read as a woman with a
  // bun at 480 px, which broke the male-only cast.
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "#1A1410";
  ctx.beginPath();
  ctx.moveTo(424, 382);
  ctx.quadraticCurveTo(424, 356, 448, 352);
  ctx.lineTo(492, 352);
  ctx.quadraticCurveTo(516, 356, 516, 382);
  ctx.lineTo(516, 420);
  ctx.quadraticCurveTo(516, 452, 470, 456);
  ctx.quadraticCurveTo(424, 452, 424, 420);
  ctx.closePath(); ctx.fill();
  // short hair: a flat top and a sideburn on each side
  ctx.beginPath();
  ctx.moveTo(424, 382);
  ctx.quadraticCurveTo(428, 350, 470, 346);
  ctx.quadraticCurveTo(512, 350, 516, 382);
  ctx.lineTo(508, 382);
  ctx.quadraticCurveTo(500, 358, 470, 356);
  ctx.quadraticCurveTo(440, 358, 432, 382);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(424, 382, 7, 34);
  ctx.fillRect(509, 382, 7, 34);
  ctx.beginPath(); ctx.moveTo(408, 558); ctx.quadraticCurveTo(404, 430, 470, 430); ctx.quadraticCurveTo(536, 430, 532, 558); ctx.closePath(); ctx.fill();
  // a bare-headed station teller: no cap, no visor, no badge; a shirt collar
  // and a green tie keep the silhouette reading as a clerk, not an officer
  ctx.fillStyle = C.rgba("#E8DCC4", 0.48);
  ctx.beginPath();
  ctx.moveTo(442, 436); ctx.lineTo(470, 458); ctx.lineTo(498, 436);
  ctx.lineTo(490, 427); ctx.lineTo(470, 444); ctx.lineTo(450, 427);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.rgba("#2F4A3A", 0.78);
  ctx.beginPath();
  ctx.moveTo(466, 452); ctx.lineTo(474, 452); ctx.lineTo(472, 494); ctx.lineTo(468, 494);
  ctx.closePath(); ctx.fill();
  // the clerk's near arm reaching down to the left of the ticket, at the slot
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 24; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(430, 468); ctx.quadraticCurveTo(392, 498, 380, 536); ctx.stroke();
  ctx.fillStyle = "#1A1410"; ctx.beginPath(); ctx.ellipse(380, 540, 18, 10, 0.2, 0, TAU); ctx.fill();
  // a warm rim light on the shoulder nearest the desk lamp
  ctx.strokeStyle = C.rgba("#FFE2A0", 0.30); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(524, 438); ctx.quadraticCurveTo(534, 486, 528, 548); ctx.stroke();
  ctx.restore();
  // the glass: a cool tint, two reflections, a brass frame
  ctx.fillStyle = C.rgba("#8AB0C8", 0.13); ctx.fillRect(140, 300, 440, 246);
  ctx.save(); ctx.globalAlpha = 0.13; ctx.fillStyle = "#DFF0FF";
  ctx.beginPath(); ctx.moveTo(180, 546); ctx.lineTo(300, 300); ctx.lineTo(356, 300); ctx.lineTo(236, 546); ctx.closePath(); ctx.fill();
  ctx.restore();
  // speaking grille, a little brass panel of holes at the lower left
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    ctx.fillStyle = C.rgba("#C8A86A", 0.45);
    ctx.beginPath(); ctx.arc(166 + c * 15, 468 + r * 15, 2.4, 0, TAU); ctx.fill();
  }
  // the glass frame and its mullions
  ctx.strokeStyle = "#8A6A4A"; ctx.lineWidth = 9;
  ctx.strokeRect(136, 296, 448, 254);
  ctx.strokeStyle = "#6A4A30"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(360, 296); ctx.lineTo(360, 550); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(136, 430); ctx.lineTo(584, 430); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.4); ctx.lineWidth = 2;
  ctx.strokeRect(144, 304, 432, 238);
  // TICKETS sign: in the right pane, above the clerk's head, so it clears the
  // title block and does not cover the ticket rack
  paper(ctx, () => tornRectPath(ctx, 380, 308, 196, 38, 3, 7), { fill: "#E8B84A", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.35), sx: 3, sy: 5 });
  TY.text(ctx, "TICKETS", 478, 335, 22, { family: "Archivo Black", color: "#3A2414", align: "center", letter: 3 });
  // the counter and its brass lip
  paper(ctx, () => roundRectPath(ctx, 104, 550, 512, 44, 4), { fill: "#6A4A30", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 8 });
  ctx.fillStyle = "#8A6A4A"; ctx.fillRect(104, 550, 512, 5);
  ctx.fillStyle = C.rgba("#C8A86A", 0.65); ctx.fillRect(104, 588, 512, 3);
  // the ticket slot: a brass plate with a dark slit, fed from the clerk's side
  paper(ctx, () => roundRectPath(ctx, 346, 548, 232, 38, 5), { fill: "#8A6A4A", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 4 });
  ctx.fillStyle = "#120E0A"; ctx.fillRect(366, 560, 192, 14);
  ctx.fillStyle = C.rgba("#C8A86A", 0.55); ctx.fillRect(366, 558, 192, 3);
  ctx.fillStyle = C.rgba("#E8DCC4", 0.55); ctx.fillRect(366, 574, 192, 2);
  // a small stack of blank tickets in the mouth of the slot
  ctx.fillStyle = "#F2E8D5"; ctx.fillRect(378, 562, 46, 9);
  ctx.fillStyle = C.rgba("#171310", 0.35); ctx.fillRect(378, 566, 46, 1);
  // the ticket punch and a coin tray on the counter
  ctx.save(); ctx.translate(214, 546);
  paper(ctx, () => roundRectPath(ctx, -30, -14, 60, 18, 4), { fill: "#C8A86A", edge: PAL.ink, edgeW: 2 });
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -44); ctx.stroke();
  ctx.strokeStyle = "#8A6A4A"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(30, -58); ctx.stroke();
  ctx.fillStyle = "#1A1410"; ctx.beginPath(); ctx.arc(-8, -18, 4, 0, TAU); ctx.fill();
  ctx.restore();
  paper(ctx, () => roundRectPath(ctx, 282, 548, 62, 40, 6), { fill: "#8A6A4A", edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = "#6A4A30"; ctx.fillRect(290, 556, 46, 24);
  ctx.fillStyle = "#C8A86A"; ctx.beginPath(); ctx.arc(304, 566, 7, 0, TAU); ctx.fill();
  ctx.fillStyle = "#E8B84A"; ctx.beginPath(); ctx.arc(322, 570, 6, 0, TAU); ctx.fill();
  // the booth base: panelled, with a timetable card and a kick plate
  ctx.strokeStyle = C.rgba("#1A1410", 0.6); ctx.lineWidth = 3;
  ctx.strokeRect(104, 604, 230, 236);
  ctx.strokeRect(356, 604, 230, 236);
  paper(ctx, () => tornRectPath(ctx, 126, 628, 164, 188, 3, 5), { fill: "#E8DCC4", edge: C.rgba(PAL.ink, 0.5), edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
  TY.text(ctx, "TIMETABLE", 208, 650, 12, { family: "Archivo Black", color: "#8E2430", align: "center", letter: 1 });
  ctx.strokeStyle = C.rgba("#171310", 0.3); ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(140, 666 + i * 15); ctx.lineTo(276, 666 + i * 15); ctx.stroke(); }
  ctx.fillStyle = "#1A1612"; ctx.fillRect(104, 852, 512, 22);
  ctx.strokeStyle = C.rgba("#8A7A68", 0.4); ctx.lineWidth = 2;
  for (let x = 112; x < 610; x += 18) { ctx.beginPath(); ctx.moveTo(x, 856); ctx.lineTo(x, 870); ctx.stroke(); }
  // the booth's light falls on the counter and the man
  const boothLight = ctx.createRadialGradient(360, 430, 20, 360, 430, 380);
  boothLight.addColorStop(0, C.rgba("#FFE2A0", 0.22)); boothLight.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = boothLight; ctx.beginPath(); ctx.arc(360, 430, 380, 0, TAU); ctx.fill();

  // departure board, above the bench
  paper(ctx, () => tornRectPath(ctx, 760, 210, 300, 150, 4, 11), { fill: "#141A1E", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 4, sy: 7 });
  TY.text(ctx, "DEPARTURES", 910, 238, 16, { family: "Archivo Black", color: "#E8B84A", align: "center", letter: 2 });
  ctx.strokeStyle = C.rgba("#E8B84A", 0.35); ctx.lineWidth = 1.4;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(780, 264 + i * 30); ctx.lineTo(1040, 264 + i * 30); ctx.stroke(); }
  // the 02:10 NORTH row is the one this film takes; it blinks, the others wait
  const nowBlink = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.2));
  ctx.fillStyle = C.rgba("#E8B84A", 0.10 + 0.08 * nowBlink); ctx.fillRect(776, 272, 268, 22);
  TY.text(ctx, "02:10  NORTH", 780, 288, 12, { family: "DMMono", color: "#F2E8D5", letter: 1 });
  TY.text(ctx, "02:40  HARBOR", 780, 318, 12, { family: "DMMono", color: "#E8DCC4", letter: 1 });
  TY.text(ctx, "03:05  CENTRAL", 780, 348, 12, { family: "DMMono", color: C.rgba("#E8DCC4", 0.55), letter: 1 });

  // the bench: slatted back, seat, cast-iron legs and armrests
  paper(ctx, () => roundRectPath(ctx, 742, 700, 336, 34, 4), { fill: "#5A4E40", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 7 });
  ctx.fillStyle = C.rgba("#8A7A62", 0.5); ctx.fillRect(742, 700, 336, 4);
  for (let i = 0; i < 2; i++) {
    paper(ctx, () => roundRectPath(ctx, 760, 636 + i * 28, 300, 20, 3), { fill: "#4A4036", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.25), sx: 0, sy: 4 });
  }
  ctx.fillStyle = "#4A3A2C"; ctx.fillRect(762, 734, 24, 166); ctx.fillRect(1034, 734, 24, 166);
  ctx.fillStyle = "#3A2E24"; ctx.fillRect(752, 636, 12, 264); ctx.fillRect(1056, 636, 12, 264);
  ctx.fillStyle = "#6A5A48"; ctx.fillRect(752, 700, 12, 12); ctx.fillRect(1056, 700, 12, 12);
  // a folded newspaper and a small case on the bench
  paper(ctx, () => tornRectPath(ctx, 860, 684, 96, 18, 2, 4), { fill: "#E8DCC4", edge: C.rgba(PAL.ink, 0.45), edgeW: 1.5 });
  ctx.fillStyle = C.rgba("#171310", 0.35); ctx.fillRect(870, 688, 60, 2);
  paper(ctx, () => roundRectPath(ctx, 1090, 806, 78, 94, 6), { fill: "#3E3226", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 7 });
  ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(1129, 806, 18, Math.PI, TAU); ctx.stroke();
  ctx.strokeStyle = "#8A6A4A"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(1102, 842); ctx.lineTo(1156, 842); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1102, 864); ctx.lineTo(1156, 864); ctx.stroke();
  ctx.save(); ctx.translate(1152, 850); ctx.rotate(0.18);
  ctx.fillStyle = "#E8DCC4"; ctx.fillRect(-9, -13, 18, 26);
  ctx.fillStyle = C.rgba("#171310", 0.35); ctx.fillRect(-6, -6, 12, 2); ctx.fillRect(-6, 0, 9, 2);
  ctx.restore();

  // a wall lamp between booth and board
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(690, 300); ctx.lineTo(690, 360); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(658, 360); ctx.lineTo(722, 360); ctx.lineTo(710, 400); ctx.lineTo(670, 400); ctx.closePath(); }, { fill: "#E8B84A", edge: PAL.ink, edgeW: 3 });
  const wl = ctx.createRadialGradient(690, 400, 6, 690, 400, 240);
  wl.addColorStop(0, C.rgba("#FFE2A0", 0.34)); wl.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = wl; ctx.beginPath(); ctx.arc(690, 400, 240, 0, TAU); ctx.fill();

  // wet floor, reflections, a drain and the track of wet feet to the booth
  floorBoards(ctx, 900, 180, "#2A3034", C.rgba("#141A1E", 0.8), 120);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.10); ctx.beginPath(); ctx.ellipse(360, 980, 330, 34, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#FFE2A0", 0.10); ctx.beginPath(); ctx.ellipse(1460, 980, 330, 34, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#FF8A5A", 0.08); ctx.beginPath(); ctx.ellipse(340, 1010, 240, 26, 0, 0, TAU); ctx.fill();
  // wet footprints from the platform window to the slot
  for (let i = 0; i < 6; i++) {
    const k = i / 5;
    const fx = C.lerp(1040, 520, k) + (i % 2 ? 14 : -14);
    const fy = C.lerp(946, 1000, k);
    ctx.fillStyle = C.rgba("#0E1418", 0.30);
    ctx.beginPath(); ctx.ellipse(fx, fy, 10, 5, 0.2, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = "#1A1612"; ctx.fillRect(980, 990, 120, 46);
  ctx.strokeStyle = "#6A5A48"; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(990 + i * 18, 996); ctx.lineTo(990 + i * 18, 1030); ctx.stroke(); }
  // a hanging lamp over the queue, so the tile has one big warm note
  stationLamp60(ctx, 690, 0, 0.9);
  // rain outside and over the glass
  rainStreaks(ctx, t, 90, "#C8D8E8", 0.22);
}

/* ---------------- the train ---------------- */

/* One large carriage window: a warm wooden frame, a rounded pane, the night
   running past, rain, and the tunnel's black. `tunnel` 0..1. */
/* How much light the tunnel lamps throw into the carriage. One pulse per
   lamp, at the cadence of the wall: 288 px apart, 1180 px/s. */
function trainLampGlow(t) {
  const ph = (t * 1180) / 288;
  const s = 0.5 + 0.5 * Math.sin(ph * TAU);
  return s * s * s;
}

function trainWindow60(ctx, x, y, w, h, t, i, tunnel) {
  const wrap = (v, m) => ((v % m) + m) % m;
  const a = 1 - tunnel;
  // the frame, sitting proud of the wall
  paper(ctx, () => roundRectPath(ctx, x - 16, y - 16, w + 32, h + 32, 30), { fill: "#4A3424", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.45), sx: 6, sy: 9 });
  ctx.strokeStyle = C.rgba("#C8A86A", 0.45); ctx.lineWidth = 3;
  roundRectPath(ctx, x - 4, y - 4, w + 8, h + 8, 22); ctx.stroke();
  paper(ctx, () => roundRectPath(ctx, x, y, w, h, 20), { fill: "#08101A", edge: "#1A1410", edgeW: 3 });
  ctx.save();
  roundRectPath(ctx, x + 2, y + 2, w - 4, h - 4, 18); ctx.clip();
  // the night outside
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#1E3550"); g.addColorStop(0.52, "#122338"); g.addColorStop(1, "#070D14");
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // far city blocks along the lower third
  if (a > 0.01) {
    ctx.fillStyle = C.rgba("#0A121C", 0.9 * a);
    for (let b = 0; b < 6; b++) {
      const bx = x + wrap(b * 73 + i * 31 - t * 26, w + 120) - 60;
      const bh = 30 + C.hash(b * 3.7 + i) * 58;
      ctx.fillRect(bx, y + h * 0.64 - bh, 48 + C.hash(b * 5.1) * 34, bh);
    }
    // the windows of the city sliding past
    for (let k = 0; k < 9; k++) {
      const wx = x + wrap(k * 41 + i * 17 - t * 52, w + 40) - 20;
      const wy = y + h * (0.40 + C.hash(k * 7.3 + i) * 0.24);
      const lit = 0.30 + 0.60 * C.hash(k * 11.9 + i);
      ctx.fillStyle = k % 4 === 0 ? C.rgba("#FF8A5A", lit * a) : C.rgba("#FFD27A", lit * a);
      ctx.fillRect(wx, wy, 6 + (k % 3) * 5, 5);
    }
    // near platform lights, faster, stretched to a streak
    for (let k = 0; k < 3; k++) {
      const sx = x + wrap(k * 167 + i * 53 - t * 430, w + 260) - 130;
      const sy = y + h * (0.30 + k * 0.14);
      const tail = 80 + k * 48;
      const grad = ctx.createLinearGradient(sx, 0, sx + tail, 0);
      grad.addColorStop(0, C.rgba("#FFE2A0", 0));
      grad.addColorStop(0.68, C.rgba("#FFE2A0", (0.42 + 0.25 * C.hash(k + i)) * a));
      grad.addColorStop(1, C.rgba("#FFF2C8", 0.85 * a));
      ctx.fillStyle = grad; ctx.fillRect(sx, sy, tail, 3);
    }
    // a whole platform lamp passing: a soft warm ball with a tail
    const px = x + wrap(i * 211 - t * 360, w + 300) - 150;
    const py = y + h * 0.47;
    const pg = ctx.createRadialGradient(px, py, 4, px, py, 46);
    pg.addColorStop(0, C.rgba("#FFF2C8", 0.72 * a));
    pg.addColorStop(0.40, C.rgba("#FFD27A", 0.30 * a));
    pg.addColorStop(1, C.rgba("#FFD27A", 0));
    ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 46, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba("#FFE2A0", 0.55 * a); ctx.fillRect(px - 76, py - 2, 86, 3);
    // rain running down the pane
    ctx.strokeStyle = C.rgba("#C8D8E8", 0.28 * a); ctx.lineWidth = 1.6;
    for (let k = 0; k < 8; k++) {
      const rx = x + 10 + C.hash(k * 5.7 + i) * (w - 20);
      const ry = y + wrap(C.hash(k * 9.1 + i) * (h + 60) + t * 240, h + 60) - 30;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 22); ctx.stroke();
    }
    // one long reflection across the glass
    ctx.save(); ctx.globalAlpha = 0.10 * a; ctx.fillStyle = "#DFF0FF";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.08, y + h); ctx.lineTo(x + w * 0.32, y);
    ctx.lineTo(x + w * 0.44, y); ctx.lineTo(x + w * 0.20, y + h);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // the tunnel: the window is a black wall, and nothing outside survives -
  // except the tunnel's own wall, its ribs and lamps, sliding past fast enough
  // that the glass is never a still black rectangle.
  if (tunnel > 0.001) {
    ctx.fillStyle = C.rgba("#04060A", tunnel); ctx.fillRect(x, y, w, h);
    const pitch = 96, speed = 1180, off = (t * speed) % pitch;
    ctx.save();
    // the concrete
    ctx.fillStyle = C.rgba("#0E1116", tunnel); ctx.fillRect(x, y, w, h);
    for (let gx = -pitch + off; gx < w + pitch; gx += pitch) {
      ctx.fillStyle = C.rgba("#1A1F26", tunnel); ctx.fillRect(x + gx, y, 13, h);
      ctx.fillStyle = C.rgba("#2E3640", 0.55 * tunnel); ctx.fillRect(x + gx, y, 3, h);
    }
    // the cable run, and the sodium lamps every third rib
    ctx.fillStyle = C.rgba("#080A0E", tunnel); ctx.fillRect(x, y + h * 0.16, w, 5);
    const lampPitch = pitch * 3, lampOff = (t * speed) % lampPitch;
    for (let lx = -lampPitch + lampOff; lx < w + lampPitch; lx += lampPitch) {
      const px = x + lx + 30, py = y + h * 0.30;
      const lg = ctx.createRadialGradient(px, py, 2, px, py, 62);
      lg.addColorStop(0, C.rgba("#FFE6B0", 0.85 * tunnel));
      lg.addColorStop(0.35, C.rgba("#FFB44A", 0.34 * tunnel));
      lg.addColorStop(1, C.rgba("#FFB44A", 0));
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(px, py, 62, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFE6B0", 0.9 * tunnel); ctx.fillRect(px - 5, py - 3, 10, 6);
      // a short warm tail on the wall behind the lamp
      ctx.fillStyle = C.rgba("#FFC46A", 0.16 * tunnel); ctx.fillRect(px + 5, py - 1, 46, 3);
    }
    ctx.restore();
  }
  ctx.restore();
  // the inner gasket, so the pane reads as glass
  ctx.strokeStyle = C.rgba("#C8D8E8", 0.20); ctx.lineWidth = 2;
  roundRectPath(ctx, x + 7, y + 7, w - 14, h - 14, 14); ctx.stroke();
}

/* A seat seen from behind: the near row. Dark silhouette, headrest with a
   cream antimacassar, stitched channels, a seat pocket and an aisle handle. */
function trainSeatBack60(ctx, x, top, w, h, num) {
  shadowEllipse(ctx, x + w / 2, top + h + 6, w * 0.56, 16, 0.22);
  // the back panel, slightly narrower at the floor
  paper(ctx, () => {
    const r = 18;
    ctx.beginPath();
    ctx.moveTo(x + r, top);
    ctx.lineTo(x + w - r, top);
    ctx.quadraticCurveTo(x + w, top, x + w, top + r);
    ctx.lineTo(x + w - 8, top + h);
    ctx.lineTo(x + 8, top + h);
    ctx.lineTo(x, top + r);
    ctx.quadraticCurveTo(x, top, x + r, top);
    ctx.closePath();
  }, { fill: "#1B2A24", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
  // the top roll and its rim light
  paper(ctx, () => roundRectPath(ctx, x + 6, top - 12, w - 12, 26, 12), { fill: "#2C4236", edge: PAL.ink, edgeW: 3 });
  ctx.strokeStyle = C.rgba("#8AB08A", 0.50); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 14, top - 9); ctx.lineTo(x + w - 14, top - 9); ctx.stroke();
  // stitched channels
  ctx.strokeStyle = C.rgba("#0E1712", 0.55); ctx.lineWidth = 2;
  for (let i = 1; i <= 2; i++) {
    const cx = x + w * i / 3;
    ctx.beginPath(); ctx.moveTo(cx, top + 22); ctx.lineTo(cx, top + h - 8); ctx.stroke();
  }
  // a seat pocket low on the back, with a folded magazine
  ctx.fillStyle = "#101A15"; ctx.fillRect(x + 26, top + h * 0.52, w - 52, 76);
  ctx.strokeStyle = C.rgba("#0A0E0C", 0.8); ctx.lineWidth = 2; ctx.strokeRect(x + 26, top + h * 0.52, w - 52, 76);
  ctx.fillStyle = "#D8C8A8"; ctx.fillRect(x + 38, top + h * 0.52 + 8, 34, 48);
  ctx.fillStyle = C.rgba("#8E2430", 0.55); ctx.fillRect(x + 38, top + h * 0.52 + 8, 34, 8);
  ctx.fillStyle = C.rgba("#171310", 0.35);
  ctx.fillRect(x + 42, top + h * 0.52 + 24, 26, 2);
  ctx.fillRect(x + 42, top + h * 0.52 + 32, 20, 2);
  // the headrest and its antimacassar
  const hw = w * 0.58, hx = x + (w - hw) / 2;
  paper(ctx, () => roundRectPath(ctx, hx, top - 76, hw, 82, 16), { fill: "#22342B", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.4), sx: 4, sy: 7 });
  ctx.fillStyle = "#E8DCC4"; ctx.fillRect(hx + 9, top - 68, hw - 18, 28);
  ctx.fillStyle = "#8E2430"; ctx.fillRect(hx + 9, top - 42, hw - 18, 4);
  TY.text(ctx, String(num), hx + hw / 2, top - 48, 13, { family: "DMMono", color: C.rgba("#171310", 0.7), align: "center", letter: 1 });
  // the aisle handle, chrome, on the right edge
  ctx.strokeStyle = "#9AA0A8"; ctx.lineWidth = 7; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x + w - 20, top - 12); ctx.lineTo(x + w - 20, top - 70); ctx.stroke();
  ctx.strokeStyle = C.rgba("#E8E8E8", 0.55); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + w - 23, top - 12); ctx.lineTo(x + w - 23, top - 68); ctx.stroke();
}

/* The empty facing seat, across the aisle. The ticket is laid on this cushion
   by the shot; the set only builds the seat. */
function trainSeatFront60(ctx, x, top, w, num) {
  shadowEllipse(ctx, x + w / 2, top + 372, w * 0.60, 18, 0.24);
  // the backrest, seen from the front
  paper(ctx, () => roundRectPath(ctx, x, top, w, 150, 18), { fill: "#22342B", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
  // the headrest cover
  ctx.fillStyle = "#E8DCC4"; ctx.fillRect(x + 22, top + 12, w - 44, 36);
  ctx.fillStyle = "#8E2430"; ctx.fillRect(x + 22, top + 42, w - 44, 5);
  TY.text(ctx, String(num), x + w / 2, top + 39, 15, { family: "DMMono", color: C.rgba("#171310", 0.7), align: "center", letter: 1 });
  // the backrest channels
  ctx.strokeStyle = C.rgba("#0E1712", 0.45); ctx.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    const cx = x + w * i / 3;
    ctx.beginPath(); ctx.moveTo(cx, top + 58); ctx.lineTo(cx, top + 124); ctx.stroke();
  }
  // the cushion: a lit top face and a dark front face, so it reads as a seat
  paper(ctx, () => roundRectPath(ctx, x - 12, top + 100, w + 24, 68, 14), { fill: "#2F4A3A", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 4, sy: 8 });
  ctx.fillStyle = C.rgba("#8AB08A", 0.42); ctx.fillRect(x - 4, top + 104, w + 8, 5);
  ctx.fillStyle = C.rgba("#1A2A20", 0.50); ctx.fillRect(x - 4, top + 128, w + 8, 3);
  // the apron and the pedestal
  paper(ctx, () => roundRectPath(ctx, x + 14, top + 166, w - 28, 92, 8), { fill: "#1A2A22", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
  ctx.fillStyle = C.rgba("#F2E8D5", 0.10); ctx.fillRect(x + 24, top + 180, w - 48, 4);
  ctx.fillStyle = "#141C18"; ctx.fillRect(x + w * 0.40, top + 254, w * 0.20, 118);
  ctx.strokeStyle = C.rgba("#8A9098", 0.35); ctx.lineWidth = 2;
  ctx.strokeRect(x + w * 0.40, top + 254, w * 0.20, 118);
  // armrests, chrome and dark leather
  for (const ax of [x - 34, x + w + 6]) {
    ctx.fillStyle = "#8A9098"; ctx.fillRect(ax, top + 148, 28, 12);
    ctx.fillStyle = "#2A1E16"; ctx.fillRect(ax + 3, top + 132, 22, 20);
    ctx.strokeStyle = C.rgba("#171310", 0.6); ctx.lineWidth = 2; ctx.strokeRect(ax + 3, top + 132, 22, 20);
    ctx.fillStyle = "#6A7078"; ctx.fillRect(ax + 10, top + 160, 8, 44);
  }
}

/* A leather hand strap hanging from the luggage rack, swinging with the car. */
function trainStrap60(ctx, x, y, t, i) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.35 + i * 1.7) * 0.075);
  ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 62); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.35); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-2, 4); ctx.lineTo(-2, 60); ctx.stroke();
  paper(ctx, () => roundRectPath(ctx, -14, 62, 28, 34, 12), { fill: "#5A3E2A", edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.3), sx: 2, sy: 4 });
  ctx.fillStyle = C.rgba("#1A1410", 0.55); ctx.fillRect(-7, 70, 14, 18);
  ctx.restore();
}

function trainSet(ctx, t, o = {}) {
  const tunnel = C.clamp(o.tunnel || 0);
  paperBg(ctx, "#1C1610", "#2C2218");

  // the carriage wall: warm panels, vertical seams, a maroon waist rail
  ctx.fillStyle = "#3A2C20"; ctx.fillRect(0, 0, W, 900);
  ctx.strokeStyle = C.rgba("#1E1610", 0.75); ctx.lineWidth = 4;
  for (let x = 0; x < W; x += 180) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8A6A4A", 0.30); ctx.lineWidth = 1.5;
  for (let x = 4; x < W; x += 180) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke(); }
  // a maroon padded band below the windows
  ctx.fillStyle = "#4A2620"; ctx.fillRect(0, 580, W, 24);
  ctx.fillStyle = C.rgba("#C8A86A", 0.45); ctx.fillRect(0, 580, W, 3);
  ctx.fillStyle = C.rgba("#1A1410", 0.5); ctx.fillRect(0, 601, W, 3);
  // tufted buttons on the band
  for (let x = 40; x < W; x += 72) {
    ctx.fillStyle = C.rgba("#2A1612", 0.75);
    ctx.beginPath(); ctx.arc(x, 592, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba("#C8A86A", 0.25);
    ctx.beginPath(); ctx.arc(x - 1, 591, 1.6, 0, TAU); ctx.fill();
  }

  // the curved ceiling: a shallow vault with a cornice, ribs and a beam
  const ceil = (x) => 104 - 132 * (x / W) * (1 - x / W);
  ctx.beginPath();
  ctx.moveTo(0, -4); ctx.lineTo(W, -4); ctx.lineTo(W, ceil(W));
  for (let x = W; x >= 0; x -= 24) ctx.lineTo(x, ceil(x));
  ctx.closePath();
  ctx.fillStyle = "#241C14"; ctx.fill();
  // the cornice follows the curve
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) { if (x === 0) ctx.moveTo(x, ceil(x)); else ctx.lineTo(x, ceil(x)); }
  ctx.strokeStyle = "#5A4028"; ctx.lineWidth = 10; ctx.stroke();
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) { if (x === 0) ctx.moveTo(x, ceil(x) + 8); else ctx.lineTo(x, ceil(x) + 8); }
  ctx.strokeStyle = C.rgba("#C8A86A", 0.35); ctx.lineWidth = 2; ctx.stroke();
  // the longitudinal beam, 26 px under the cornice
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) { const y = ceil(x) + 30; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.strokeStyle = "#2E2318"; ctx.lineWidth = 12; ctx.stroke();
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) { const y = ceil(x) + 24; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.strokeStyle = C.rgba("#6A4A30", 0.45); ctx.lineWidth = 2; ctx.stroke();
  // ribs, short verticals under the cornice
  for (let x = 140; x < W; x += 240) {
    const y = ceil(x) + 8;
    ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 38); ctx.stroke();
    ctx.strokeStyle = C.rgba("#8A6A4A", 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 2, y + 2); ctx.lineTo(x - 2, y + 36); ctx.stroke();
  }

  // pendant lamps, warm, hanging from the vault
  for (const lx of [300, 960, 1600]) {
    const ly = ceil(lx) + 8;
    ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + 34); ctx.stroke();
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(lx - 18, ly + 34); ctx.lineTo(lx + 18, ly + 34); ctx.lineTo(lx + 12, ly + 46); ctx.lineTo(lx - 12, ly + 46); ctx.closePath(); }, { fill: "#8A6A4A", edge: PAL.ink, edgeW: 2 });
    ctx.fillStyle = "#F2E8D5"; ctx.beginPath(); ctx.arc(lx, ly + 68, 22, 0, TAU); ctx.fill();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.stroke();
    const lg = ctx.createRadialGradient(lx, ly + 70, 6, lx, ly + 70, 190);
    lg.addColorStop(0, C.rgba("#FFE2A0", 0.26)); lg.addColorStop(1, C.rgba("#FFE2A0", 0));
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly + 70, 190, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba("#FFF2C8", 0.85); ctx.beginPath(); ctx.arc(lx, ly + 68, 9, 0, TAU); ctx.fill();
  }

  // the luggage rack above the window band, with a case and a bag on it
  ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(44, 208); ctx.lineTo(1580, 208); ctx.stroke();
  ctx.fillStyle = "#5A4028"; ctx.fillRect(38, 194, 1556, 14);
  ctx.fillStyle = C.rgba("#C8A86A", 0.45); ctx.fillRect(38, 194, 1556, 3);
  ctx.fillStyle = C.rgba("#0E0B08", 0.35); ctx.fillRect(38, 208, 1556, 16);
  for (let x = 84; x < 1580; x += 220) {
    ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, 194); ctx.lineTo(x, 156); ctx.stroke();
    ctx.strokeStyle = C.rgba("#8A6A4A", 0.45); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 2, 192); ctx.lineTo(x - 2, 158); ctx.stroke();
  }
  // the suitcase
  paper(ctx, () => roundRectPath(ctx, 248, 132, 176, 64, 8), { fill: "#4A3424", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.fillStyle = "#6A4A30"; ctx.fillRect(248, 148, 176, 8);
  ctx.fillStyle = "#8A6A4A"; ctx.fillRect(248, 172, 176, 6);
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(262, 132); ctx.lineTo(262, 196); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(410, 132); ctx.lineTo(410, 196); ctx.stroke();
  ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(336, 132, 24, Math.PI, TAU); ctx.stroke();
  // a label on the case
  ctx.fillStyle = "#E8DCC4"; ctx.fillRect(302, 154, 44, 24);
  ctx.fillStyle = C.rgba("#171310", 0.45); ctx.fillRect(308, 160, 32, 2); ctx.fillRect(308, 166, 24, 2);
  // the duffel
  paper(ctx, () => roundRectPath(ctx, 838, 148, 158, 48, 18), { fill: "#2F4A3A", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.fillStyle = "#4A6A52"; ctx.fillRect(852, 158, 130, 5);
  ctx.strokeStyle = "#1A2A20"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(878, 150); ctx.lineTo(878, 194); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(956, 150); ctx.lineTo(956, 194); ctx.stroke();
  ctx.fillStyle = "#8A6A4A"; ctx.fillRect(962, 166, 22, 10);
  // a small bag
  paper(ctx, () => roundRectPath(ctx, 1276, 154, 94, 42, 10), { fill: "#5A3A24", edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(1323, 154, 16, Math.PI, TAU); ctx.stroke();
  // hanging straps, in front of the window band
  for (let i = 0; i < 4; i++) trainStrap60(ctx, 520 + i * 280, 210, t, i);

  // the window band: four large rounded windows, night outside
  for (let i = 0; i < 4; i++) trainWindow60(ctx, 110 + i * 360, 224, 340, 348, t, i, tunnel);

  // a fire extinguisher and a car plate on the wall between seat and door
  ctx.fillStyle = "#B8382A"; ctx.fillRect(1518, 610, 34, 116);
  ctx.fillStyle = C.rgba("#F2E8D5", 0.7); ctx.fillRect(1524, 626, 22, 10);
  ctx.fillStyle = "#1A1410"; ctx.fillRect(1532, 600, 6, 16);
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(1552, 700); ctx.quadraticCurveTo(1562, 720, 1556, 742); ctx.stroke();
  paper(ctx, () => roundRectPath(ctx, 1548, 580, 44, 26, 3), { fill: "#8A6A4A", edge: PAL.ink, edgeW: 2 });
  TY.text(ctx, "3", 1570, 599, 16, { family: "Archivo Black", color: "#2A1E16", align: "center" });

  // the floor under the carpet and the seats
  ctx.fillStyle = "#2A1E16"; ctx.fillRect(0, 900, W, 180);
  ctx.strokeStyle = C.rgba("#1A1410", 0.8); ctx.lineWidth = 3;
  for (let y = 918; y < 1080; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8A6A4A", 0.22); ctx.lineWidth = 1.4;
  for (let y = 920; y < 1080; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#1A1410", 0.55); ctx.lineWidth = 2.4;
  for (let x = 0; x < W; x += 150) { ctx.beginPath(); ctx.moveTo(x, 900); ctx.lineTo(x - 34, 1080); ctx.stroke(); }

  // the aisle carpet, widening toward the camera, over the floor
  ctx.fillStyle = "#43241E";
  ctx.beginPath(); ctx.moveTo(900, 660); ctx.lineTo(1140, 660); ctx.lineTo(1400, 1080); ctx.lineTo(780, 1080); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba("#C8A86A", 0.40); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(910, 672); ctx.lineTo(1130, 672); ctx.lineTo(1372, 1068); ctx.lineTo(808, 1068); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle = C.rgba("#1A1410", 0.45); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(950, 700); ctx.lineTo(1090, 700); ctx.stroke();

  // the seat row, near side, backs to camera, standing on the floor
  trainSeatBack60(ctx, 30, 660, 270, 240, 7);
  trainSeatBack60(ctx, 320, 660, 270, 240, 8);
  trainSeatBack60(ctx, 610, 660, 270, 240, 9);
  // the empty facing seat, across the aisle: the shot lays its ticket here
  trainSeatFront60(ctx, 1140, 548, 300, 12);

  // the vestibule door at the far right: a window, a warm corridor, a red EXIT
  paper(ctx, () => roundRectPath(ctx, 1590, 110, 310, 810, 5), { fill: "#2A1E16", edge: "#6A4A30", edgeW: 8, shadow: C.rgba(PAL.ink, 0.45), sx: 5, sy: 9 });
  paper(ctx, () => roundRectPath(ctx, 1612, 132, 266, 776, 4), { fill: "#35261A", edge: "#1A1410", edgeW: 4 });
  ctx.strokeStyle = C.rgba("#1A1410", 0.65); ctx.lineWidth = 3;
  ctx.strokeRect(1636, 476, 218, 250);
  ctx.strokeRect(1636, 752, 218, 132);
  // the door window: the corridor beyond, a far light
  paper(ctx, () => roundRectPath(ctx, 1660, 200, 170, 232, 12), { fill: "#0E1A22", edge: "#8A6A4A", edgeW: 7, shadow: C.rgba(PAL.ink, 0.35), sx: 3, sy: 5 });
  const corr = ctx.createLinearGradient(1660, 0, 1830, 0);
  corr.addColorStop(0, C.rgba("#122430", 0.95));
  corr.addColorStop(0.62, C.rgba("#0A141C", 0.98));
  corr.addColorStop(1, C.rgba("#FFD27A", 0.35));
  ctx.fillStyle = corr; ctx.fillRect(1668, 208, 154, 216);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.30); ctx.fillRect(1804, 214, 12, 204);
  // a far door and a handrail in the corridor
  ctx.fillStyle = C.rgba("#04080A", 0.55); ctx.fillRect(1700, 240, 58, 184);
  ctx.strokeStyle = C.rgba("#8AA0A8", 0.30); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1680, 340); ctx.lineTo(1810, 340); ctx.stroke();
  // EXIT sign and a red lamp over the door
  TY.text(ctx, "EXIT", 1745, 182, 14, { family: "Archivo Black", color: C.rgba("#E8DCC4", 0.72), align: "center", letter: 2 });
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(1745, 458, 7, 0, TAU); ctx.fill();
  const rl = ctx.createRadialGradient(1745, 458, 4, 1745, 458, 72);
  rl.addColorStop(0, C.rgba("#FF6A4A", 0.40)); rl.addColorStop(1, C.rgba("#FF6A4A", 0));
  ctx.fillStyle = rl; ctx.beginPath(); ctx.arc(1745, 458, 72, 0, TAU); ctx.fill();
  // the handle, the kick plate and the door's rubber gasket
  ctx.strokeStyle = "#C8A86A"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(1648, 548); ctx.lineTo(1712, 548); ctx.stroke();
  ctx.fillStyle = C.rgba("#8A6A4A", 0.7); ctx.fillRect(1618, 842, 254, 22);
  ctx.strokeStyle = C.rgba("#1A1410", 0.6); ctx.lineWidth = 2;
  for (let x = 1626; x < 1868; x += 16) { ctx.beginPath(); ctx.moveTo(x, 844); ctx.lineTo(x, 860); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#0E0B08", 0.55); ctx.lineWidth = 2;
  ctx.strokeRect(1612, 132, 266, 776);

  // a foreground seat back at the left, cropped, for depth
  ctx.save();
  ctx.globalAlpha = 0.95;
  trainSeatBack60(ctx, -70, 820, 320, 300, 6);
  ctx.restore();

  // the aisle's warm spill and the tunnel's cold
  const spill = ctx.createRadialGradient(960, 900, 40, 960, 900, 420);
  spill.addColorStop(0, C.rgba("#FFD27A", 0.08)); spill.addColorStop(1, C.rgba("#FFD27A", 0));
  ctx.fillStyle = spill; ctx.beginPath(); ctx.arc(960, 900, 420, 0, TAU); ctx.fill();
  if (tunnel > 0.01) {
    ctx.fillStyle = C.rgba("#06080A", 0.12 * tunnel); ctx.fillRect(0, 0, W, H);
  }
}

/* ---------------- the checkpoint ---------------- */
function checkpointSet(ctx, t, o = {}) {
  paperBg(ctx, "#141C24", "#26303A");
  // the city's edge: a dark wall of blocks and a few lit windows
  for (let i = 0; i < 9; i++) {
    const x = i * 240 - 60;
    const h = 220 + C.hash(i * 3.1) * 300;
    ctx.fillStyle = i % 2 ? "#1A222C" : "#141C24";
    ctx.fillRect(x, 900 - h, 220, h);
    ctx.fillStyle = "#26303A"; ctx.fillRect(x, 900 - h, 220, 7);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
      if (C.hash(i * 17 + r * 3 + c) > 0.62) {
        ctx.fillStyle = C.rgba("#FFD27A", 0.55 + 0.35 * C.hash(i * 7 + r * 5 + c));
        ctx.fillRect(x + 26 + c * 62, 900 - h + 40 + r * 44, 16, 20);
      }
    }
  }
  // a cold searchlight from the top right
  ctx.save(); ctx.globalAlpha = 0.20;
  spotlight(ctx, 1680, -80, 980, 30, 360, "#DFF0FF", 0.8, -0.18);
  ctx.restore();
  // wet ground
  ctx.fillStyle = "#1A2028"; ctx.fillRect(0, 900, W, 180);
  ctx.fillStyle = C.rgba("#8AA0B8", 0.08); ctx.fillRect(0, 900, W, 3);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.10); ctx.beginPath(); ctx.ellipse(1180, 1000, 420, 38, 0, 0, TAU); ctx.fill();
  floorBoards(ctx, 1020, 60, C.rgba("#1A2028", 0.6), C.rgba("#10161C", 0.5), 150);

  // the hut, right: a warm window and the day-8 page
  paper(ctx, () => roundRectPath(ctx, 1380, 340, 380, 500, 6), { fill: "#3A2A1E", edge: PAL.ink, edgeW: 6, shadow: C.rgba(PAL.ink, 0.45), sx: 6, sy: 10 });
  paper(ctx, () => roundRectPath(ctx, 1420, 400, 300, 210, 4), { fill: "#E8B84A", edge: "#6A4A30", edgeW: 8, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.fillStyle = C.rgba("#FFE2A0", 0.62); ctx.fillRect(1432, 412, 276, 186);
  // a clerk on duty behind the glass. The line says he walks through "without
  // stopping", so the checkpoint must have someone in it to not stop for: a
  // plain-clothes bust with a cap, head down over the desk, breathing slowly.
  ctx.save();
  ctx.beginPath(); ctx.rect(1432, 412, 276, 186); ctx.clip();
  const clerkBob = Math.sin(t * 1.15) * 2.6;
  ctx.fillStyle = C.rgba("#2A241E", 0.8);
  ctx.beginPath();
  ctx.moveTo(1452, 600);
  ctx.quadraticCurveTo(1462, 540, 1498, 530);
  ctx.lineTo(1560, 530);
  ctx.quadraticCurveTo(1596, 540, 1606, 600);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(1529, 512 + clerkBob, 25, 29, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#171310", 0.85);
  ctx.beginPath(); ctx.ellipse(1529, 492 + clerkBob, 33, 9, 0, 0, TAU); ctx.fill();
  ctx.fillRect(1508, 470 + clerkBob, 42, 20);
  // the desk's near edge, and the glow it catches
  ctx.fillStyle = C.rgba("#3A2E22", 0.6); ctx.fillRect(1440, 566, 264, 9);
  ctx.restore();
  ctx.strokeStyle = "#5A4636"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(1570, 400); ctx.lineTo(1570, 610); ctx.stroke();
  // the hut calendar: page 8, pinned to the hut wall
  calendarProp(ctx, 1500, 330, 0.44, 8, t, 0, { oldDay: 8 });
  // the hut lamp
  const hutLamp = ctx.createRadialGradient(1560, 470, 8, 1560, 470, 300);
  hutLamp.addColorStop(0, C.rgba("#FFE2A0", 0.35)); hutLamp.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = hutLamp; ctx.beginPath(); ctx.arc(1560, 470, 300, 0, TAU); ctx.fill();
  TY.text(ctx, "CHECKPOINT", 1570, 780, 20, { family: "Archivo Black", color: C.rgba("#E8DCC4", 0.8), align: "center", letter: 2 });

  // the barrier arm, red and white, pivoted at the hut
  const armY = 690;
  ctx.save(); ctx.translate(1360, armY); ctx.rotate(-0.02 + Math.sin(t * 0.7) * 0.004);
  paper(ctx, () => roundRectPath(ctx, -1160, -14, 1160, 28, 4), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 5 });
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 ? "#B8382A" : "#E8DCC4";
    ctx.fillRect(-1160 + i * 116, -14, 116, 28);
  }
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.strokeRect(-1160, -14, 1160, 28);
  ctx.restore();
  // the pivot and counterweight
  paper(ctx, () => { ctx.beginPath(); ctx.arc(1360, armY, 26, 0, TAU); }, { fill: "#4A3A2E", edge: PAL.ink, edgeW: 3 });
  ctx.fillStyle = "#8A8478"; ctx.beginPath(); ctx.arc(1360, armY, 9, 0, TAU); ctx.fill();

  // the swinging lamp above the queue: cable, shade, warm pool
  const swing = o.lampSwing ?? Math.sin(t * 1.9) * 0.10;
  ctx.save(); ctx.translate(840, 0); ctx.rotate(swing);
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 300); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-58, 300); ctx.lineTo(58, 300); ctx.lineTo(44, 350); ctx.lineTo(-44, 350); ctx.closePath(); }, { fill: "#E8B84A", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.fillStyle = C.rgba("#FFF2C8", 0.9); ctx.beginPath(); ctx.ellipse(0, 352, 34, 7, 0, 0, TAU); ctx.fill();
  const lg = ctx.createRadialGradient(0, 352, 8, 0, 352, 360);
  lg.addColorStop(0, C.rgba("#FFE2A0", 0.42)); lg.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 352, 360, 0, TAU); ctx.fill();
  ctx.restore();

  // the queue: male backs and hats, no faces
  for (let i = 0; i < 6; i++) {
    const x = 70 + i * 108 + C.hash(i * 3.3) * 18;
    const y = 900;
    const h = 150 + C.hash(i * 7.1) * 26;
    ctx.fillStyle = i % 2 ? "#10161C" : "#141A20";
    // coat
    ctx.beginPath();
    ctx.moveTo(x - 34, y);
    ctx.lineTo(x - 30, y - h);
    ctx.quadraticCurveTo(x, y - h - 30, x + 30, y - h);
    ctx.lineTo(x + 34, y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.18); ctx.lineWidth = 2; ctx.stroke();
    // shoulders
    ctx.fillStyle = "#1A222A"; ctx.beginPath(); ctx.ellipse(x, y - h - 8, 40, 18, 0, 0, TAU); ctx.fill();
    // hat
    ctx.fillStyle = "#0C1014"; ctx.beginPath(); ctx.ellipse(x, y - h - 44, 40, 10, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#10161C"; ctx.fillRect(x - 26, y - h - 76, 52, 34);
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.2); ctx.lineWidth = 2; ctx.strokeRect(x - 26, y - h - 76, 52, 34);
  }

  // rain
  rainStreaks(ctx, t, 110, "#C8D8E8", 0.28);
  splashRings(ctx, t, 18, 902);
}
