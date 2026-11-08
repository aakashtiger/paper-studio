/* THE RUN — sets. A wet alley, a city chase, a hideout, a cell, a court, a yard.
   Warm paper-cut rooms: lit brick, gold windows, coral practicals, visible
   boards and panels. The grade in renderTestAt lifts the last few points. */

function brickWall(ctx, x, y, w, h, base, line, stepX = 128, stepY = 46) {
  ctx.save();
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  // dark mortar, then a lit top edge: two lines read as a brick even at 1080p
  ctx.strokeStyle = line; ctx.lineWidth = 3.2;
  let row = 0;
  for (let yy = y; yy < y + h; yy += stepY) {
    const off = (row % 2) * stepX * 0.5;
    for (let xx = x - stepX + off; xx < x + w; xx += stepX) {
      ctx.strokeRect(xx, yy, stepX, stepY);
    }
    row++;
  }
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.5); ctx.lineWidth = 1.2;
  row = 0;
  for (let yy = y; yy < y + h; yy += stepY) {
    const off = (row % 2) * stepX * 0.5;
    for (let xx = x - stepX + off; xx < x + w; xx += stepX) {
      ctx.beginPath(); ctx.moveTo(xx + 1, yy + 1); ctx.lineTo(xx + stepX - 1, yy + 1); ctx.stroke();
    }
    row++;
  }
  ctx.restore();
}

function rainStreaks(ctx, t, n, col = "#C8D8E8", alpha = 0.3, speed = 1) {
  ctx.save();
  ctx.strokeStyle = C.rgba(col, alpha); ctx.lineWidth = 1.6; ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const x = (i * 137 + t * 340 * speed) % (W + 80) - 40;
    const y = (i * 91 + t * 720 * speed) % (H + 80) - 40;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 7, y + 26); ctx.stroke();
  }
  ctx.restore();
}

function splashRings(ctx, t, n = 18, y = 902, col = "#C8D8E8") {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const phase = C.frac(t * (0.7 + C.hash(i * 3.1) * 0.5) + C.hash(i * 7.7));
    const x = 50 + C.hash(i * 11.3) * (W - 100);
    const yy = y + C.hash(i * 5.9) * 30;
    const r = 3 + phase * 26;
    ctx.strokeStyle = C.rgba(col, (1 - phase) * 0.32);
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(x, yy, r, r * 0.28, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

function floorBoards(ctx, y, h, base, line, step = 96) {
  ctx.save();
  ctx.fillStyle = base; ctx.fillRect(0, y, W, h);
  ctx.strokeStyle = line; ctx.lineWidth = 3;
  for (let yy = y + 18; yy < y + h; yy += 34) {
    ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
  }
  ctx.strokeStyle = C.rgba("#9A8A78", 0.35); ctx.lineWidth = 1.2;
  for (let yy = y + 19; yy < y + h; yy += 34) {
    ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
  }
  ctx.strokeStyle = line; ctx.lineWidth = 2.4;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, y + h); ctx.stroke();
  }
  ctx.restore();
}

/* One WANTED poster, used in the alley and the hideout. The silhouette is the
   thief, not a generic bust: flat cap, short head, scarf and work-coat
   shoulders. The poster carries no case number; CASE 044 belongs to the file,
   and the alley copy exists before the detective opens it. */
function wantedPoster(ctx, x, y, w, h, rot = 0) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, h, 4, 8), { fill: "#C8B89A", edge: "#1A1410", edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 7 });
  ctx.fillStyle = "#8E2430"; ctx.fillRect(0, 0, w, h * 0.13);
  TY.text(ctx, "WANTED", w / 2, h * 0.095, w * 0.11, { family: "Archivo Black", color: "#F2E8D5", align: "center", letter: 1 });
  const fx = w * 0.10, fy = h * 0.17, fw = w * 0.80, fh = h * 0.55;
  ctx.strokeStyle = C.rgba("#1A1410", 0.55); ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, fh);
  const cx = w / 2, cy = fy + fh * 0.48, s = Math.min(fw, fh) / 100;
  ctx.fillStyle = C.rgba("#1A1410", 0.55);
  // shoulders / work coat
  ctx.beginPath();
  ctx.moveTo(cx - 42 * s, fy + fh);
  ctx.quadraticCurveTo(cx - 38 * s, cy + 22 * s, cx, cy + 22 * s);
  ctx.quadraticCurveTo(cx + 38 * s, cy + 22 * s, cx + 42 * s, fy + fh);
  ctx.closePath(); ctx.fill();
  // head
  ctx.beginPath(); ctx.ellipse(cx, cy - 6 * s, 22 * s, 26 * s, 0, 0, TAU); ctx.fill();
  // flat cap: low crown and a short brim
  ctx.beginPath();
  ctx.moveTo(cx - 30 * s, cy - 26 * s);
  ctx.quadraticCurveTo(cx, cy - 44 * s, cx + 30 * s, cy - 26 * s);
  ctx.lineTo(cx + 22 * s, cy - 20 * s); ctx.lineTo(cx - 22 * s, cy - 20 * s);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx, cy - 20 * s, 34 * s, 6 * s, 0, 0, TAU); ctx.fill();
  // the red scarf is the one colour on the print
  ctx.fillStyle = "#8E2430";
  ctx.fillRect(cx - 26 * s, cy + 18 * s, 52 * s, 9 * s);
  ctx.beginPath();
  ctx.moveTo(cx + 8 * s, cy + 27 * s); ctx.lineTo(cx + 20 * s, cy + 48 * s);
  ctx.lineTo(cx + 10 * s, cy + 46 * s); ctx.closePath(); ctx.fill();
  TY.text(ctx, "SUSPECT", w / 2, h * 0.86, w * 0.055, { family: "DMMono", color: C.rgba("#1A1410", 0.7), align: "center", letter: 1 });
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.04, 3.5, 0, TAU); ctx.fill();
  ctx.restore();
}

function alleySet(ctx, t, o = {}) {
  paperBg(ctx, "#241E1A", "#342A22");
  // warm brick back wall
  brickWall(ctx, 0, 0, W, 900, "#36302A", C.rgba("#0A0806", 0.9), 120, 44);
  // soot band and a lit window
  ctx.fillStyle = C.rgba("#241A14", 0.45); ctx.fillRect(0, 0, W, 120);
  paper(ctx, () => roundRectPath(ctx, 1540, 250, 230, 180, 4), { fill: "#B8865A", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.fillStyle = C.rgba("#FFE2A0", 0.55); ctx.fillRect(1552, 262, 206, 156);
  ctx.strokeStyle = "#3A2C24"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(1655, 250); ctx.lineTo(1655, 430); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1540, 342); ctx.lineTo(1770, 342); ctx.stroke();
  ctx.strokeStyle = C.rgba("#8A6A4A", 0.6); ctx.lineWidth = 2;
  ctx.strokeRect(1568, 278, 174, 124);
  // drainpipe and its brackets
  ctx.fillStyle = "#4A3A30"; ctx.fillRect(1830, 40, 24, 860);
  ctx.fillStyle = C.rgba("#7A5A44", 0.8);
  for (let y = 120; y < 880; y += 180) ctx.fillRect(1822, y, 40, 10);
  // one torn WANTED poster, the thief's flat cap and scarf. It is not on the
  // wall at the murder: he is not wanted until the body is found, so s01 turns
  // it off and the poster arrives with the detective.
  if (o.poster !== false) wantedPoster(ctx, 1110, 420, 168, 228, 0.01);
  // a fire-escape ladder and a vent for wall edges
  ctx.strokeStyle = C.rgba("#0A0806", 0.85); ctx.lineWidth = 5;
  ctx.strokeRect(980, 150, 100, 280);
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(980, 180 + i * 44); ctx.lineTo(1080, 180 + i * 44); ctx.stroke(); }
  ctx.fillStyle = "#1A1612"; ctx.fillRect(640, 230, 120, 78);
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.35); ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(650, 244 + i * 13); ctx.lineTo(750, 244 + i * 13); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#0A0806", 0.8); ctx.lineWidth = 3; ctx.strokeRect(640, 230, 120, 78);
  // police tape across the wall; absent until the detective arrives
  if (o.tape !== false) {
  ctx.save(); ctx.translate(800, 700); ctx.rotate(-0.02);
  paper(ctx, () => roundRectPath(ctx, -760, -14, 1520, 28, 2), { fill: "#E8B84A", edge: "#1A1410", edgeW: 2, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 4 });
  TY.text(ctx, "POLICE LINE · DO NOT CROSS · POLICE LINE", 0, 8, 15, { family: "Archivo Black", color: "#1A1410", align: "center", letter: 2 });
  ctx.restore();
  }
  // a drain grate and a barrel for foreground edges
  ctx.fillStyle = "#1A1612"; ctx.fillRect(960, 966, 140, 66);
  ctx.strokeStyle = "#6A5A48"; ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(970 + i * 20, 972); ctx.lineTo(970 + i * 20, 1026); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8A7A68", 0.6); ctx.lineWidth = 2;
  ctx.strokeRect(960, 966, 140, 66);
  paper(ctx, () => roundRectPath(ctx, 1720, 780, 92, 122, 8), { fill: "#4A3A2E", edge: "#1A1410", edgeW: 3, shadow: C.rgba(PAL.ink, 0.4), sx: 4, sy: 8 });
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(1720, 812); ctx.lineTo(1812, 812); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1720, 870); ctx.lineTo(1812, 870); ctx.stroke();
  ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(1726, 786, 8, 110);
  // wet ground and a warm puddle
  ctx.fillStyle = "#2A2620"; ctx.fillRect(0, 900, W, 180);
  const puddle = ctx.createLinearGradient(0, 900, 0, 1080);
  puddle.addColorStop(0, C.rgba("#4A3A30", 0.55));
  puddle.addColorStop(0.5, C.rgba("#26201A", 0.8));
  puddle.addColorStop(1, C.rgba("#1A1612", 0.9));
  ctx.fillStyle = puddle; ctx.fillRect(0, 900, W, 180);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.16); ctx.beginPath(); ctx.ellipse(700, 1000, 420, 44, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#FF8A5A", 0.12); ctx.beginPath(); ctx.ellipse(1420, 1010, 300, 34, 0, 0, TAU); ctx.fill();
  floorBoards(ctx, 1020, 60, C.rgba("#3A2A20", 0.4), C.rgba("#1A1410", 0.4), 140);
  // streetlamp: arm, housing, warm pool, flicker
  ctx.strokeStyle = "#4A3A30"; ctx.lineWidth = 12; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(260, 900); ctx.lineTo(260, 220); ctx.lineTo(430, 220); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(402, 214); ctx.lineTo(458, 214); ctx.lineTo(470, 250); ctx.lineTo(390, 250); ctx.closePath(); }, { fill: "#5A4A3A", edge: PAL.ink, edgeW: 3 });
  const flick = o.flicker ?? 1;
  const lamp = ctx.createRadialGradient(430, 260, 10, 430, 260, 430);
  lamp.addColorStop(0, C.rgba("#FFF2C8", 0.68 * flick));
  lamp.addColorStop(0.45, C.rgba("#FFC078", 0.24 * flick));
  lamp.addColorStop(1, C.rgba("#FFC078", 0));
  ctx.fillStyle = lamp; ctx.beginPath(); ctx.arc(430, 260, 430, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#FFF6DA", 0.9 * flick); ctx.beginPath(); ctx.arc(430, 250, 15, 0, TAU); ctx.fill();
  // No coral neon slash on the far wall: at 480 px it read as police tape,
  // and the alley is not a crime-scene set until s03.
  // rain and splashes
  rainStreaks(ctx, t, 120, "#C8D8E8", 0.30);
  splashRings(ctx, t, 20, 902);
}

function chaseSet(ctx, t, o = {}) {
  paperBg(ctx, "#1E2A36", "#2E3C4A");
  // moon in a gap between blocks
  paper(ctx, () => blobPath(ctx, 1470, 170, 74, 74, 30, 0.03, 4), { fill: "#F2D9A0", edge: C.rgba(PAL.ink, 0.3), edgeW: 2 });
  ctx.fillStyle = C.rgba("#F2D9A0", 0.12); ctx.beginPath(); ctx.arc(1470, 170, 150, 0, TAU); ctx.fill();
  // city blocks with lit windows and roof ledges
  for (let i = 0; i < 8; i++) {
    const x = i * 260 - 40;
    const h = 260 + C.hash(i * 3.1) * 340;
    ctx.fillStyle = i % 2 ? "#242E3A" : "#1C2630";
    ctx.fillRect(x, 900 - h, 220, h);
    ctx.fillStyle = "#34424E"; ctx.fillRect(x, 900 - h, 220, 8);
    ctx.fillStyle = C.rgba("#1A242E", 0.55); ctx.fillRect(x, 900 - h + 8, 220, 12);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) {
      if (C.hash(i * 17 + r * 3 + c) > 0.42) {
        ctx.fillStyle = C.hash(i * 7 + r * 5 + c) > 0.5 ? C.rgba("#FFD27A", 0.9) : C.rgba("#FF8A5A", 0.78);
        ctx.fillRect(x + 24 + c * 56, 900 - h + 40 + r * 48, 18, 22);
        ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1;
        ctx.strokeRect(x + 24 + c * 56, 900 - h + 40 + r * 48, 18, 22);
      }
    }
    // fire escape
    if (i % 3 === 1) {
      ctx.strokeStyle = C.rgba("#6A7A8A", 0.6); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + 34, 900 - h + 120); ctx.lineTo(x + 186, 900 - h + 120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 34, 900 - h + 160); ctx.lineTo(x + 186, 900 - h + 160); ctx.stroke();
      for (let k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.moveTo(x + 46 + k * 34, 900 - h + 120); ctx.lineTo(x + 46 + k * 34, 900 - h + 160); ctx.stroke();
      }
    }
  }
  // coral hotel sign
  ctx.save(); ctx.translate(560, 300);
  paper(ctx, () => tornRectPath(ctx, 0, 0, 150, 62, 4, 7), { fill: "#B8382A", edge: PAL.ink, edgeW: 2 });
  TY.text(ctx, "HOTEL", 75, 42, 26, { family: "Archivo Black", color: "#FFD8B0", align: "center", letter: 2 });
  ctx.restore();
  // gold 24H sign
  ctx.save(); ctx.translate(1160, 420);
  paper(ctx, () => roundRectPath(ctx, 0, 0, 92, 54, 4), { fill: "#E8B84A", edge: PAL.ink, edgeW: 2 });
  TY.text(ctx, "24H", 46, 36, 26, { family: "Archivo Black", color: "#3A2414", align: "center", letter: 1 });
  ctx.restore();
  // a lit diner on the ground floor
  paper(ctx, () => roundRectPath(ctx, 70, 660, 300, 220, 5), { fill: "#E8B84A", edge: "#1A1410", edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
  ctx.fillStyle = C.rgba("#FFE2A0", 0.82); ctx.fillRect(86, 676, 268, 150);
  ctx.fillStyle = "#B8382A"; ctx.fillRect(70, 640, 300, 24);
  ctx.fillStyle = C.rgba("#FFD27A", 0.5); ctx.fillRect(70, 664, 300, 4);
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(220, 660); ctx.lineTo(220, 890); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(70, 780); ctx.lineTo(370, 780); ctx.stroke();
  ctx.fillStyle = C.rgba("#3A2414", 0.55);
  ctx.fillRect(104, 800, 70, 12); ctx.fillRect(124, 812, 10, 42);
  ctx.fillRect(250, 800, 70, 12); ctx.fillRect(270, 812, 10, 42);
  TY.text(ctx, "DINER", 220, 730, 22, { family: "Archivo Black", color: "#8E2430", align: "center", letter: 2 });
  // a warm streetlight
  ctx.strokeStyle = "#3A3A42"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(1000, 900); ctx.lineTo(1000, 430); ctx.stroke();
  ctx.fillStyle = "#6A6A74"; ctx.fillRect(978, 422, 44, 8);
  ctx.fillStyle = "#FFF2C8"; ctx.beginPath(); ctx.arc(1000, 416, 11, 0, TAU); ctx.fill();
  const sg = ctx.createRadialGradient(1000, 416, 4, 1000, 416, 250);
  sg.addColorStop(0, C.rgba("#FFE2A0", 0.5)); sg.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(1000, 416, 250, 0, TAU); ctx.fill();
  // a coral taxi sign on the right
  paper(ctx, () => roundRectPath(ctx, 1440, 540, 130, 56, 4), { fill: "#B8382A", edge: "#1A1410", edgeW: 3, shadow: C.rgba(PAL.ink, 0.4), sx: 4, sy: 7 });
  TY.text(ctx, "TAXI", 1505, 578, 28, { family: "Archivo Black", color: "#FFD8B0", align: "center", letter: 2 });
  const tg = ctx.createRadialGradient(1505, 568, 4, 1505, 568, 150);
  tg.addColorStop(0, C.rgba("#FF6A4A", 0.35)); tg.addColorStop(1, C.rgba("#FF6A4A", 0));
  ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(1505, 568, 150, 0, TAU); ctx.fill();
  // street
  ctx.fillStyle = "#1A222A"; ctx.fillRect(0, 900, W, 180);
  ctx.fillStyle = C.rgba("#FF9A5A", 0.10); ctx.fillRect(0, 700, W, 380);
  ctx.fillStyle = C.rgba("#FFD27A", 0.12); ctx.fillRect(0, 930, W, 3);
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = C.rgba("#FFE2A0", 0.13 + 0.08 * C.hash(i * 3.7));
    ctx.fillRect(60 + i * 220, 980, 120, 4);
  }
  // base searchlights, the shot sweeps two more
  ctx.save(); ctx.globalAlpha = 0.26;
  spotlight(ctx, 360, -80, 980, 26, 320, "#DFF0FF", 0.7, 0);
  spotlight(ctx, 1500, -80, 980, 26, 320, "#DFF0FF", 0.7, 0);
  ctx.restore();
  rainStreaks(ctx, t, 100, "#C8D8E8", 0.32);
  splashRings(ctx, t, 24, 902);
}

function hideoutSet(ctx, t, o = {}) {
  const flick = o.flicker ?? 1;
  const doorShadow = C.clamp(o.doorShadow || 0);
  paperBg(ctx, "#32261C", "#3E2E20");

  // ---- the back wall ----
  ctx.fillStyle = "#3A2E24"; ctx.fillRect(0, 0, W, 700);
  // striped wallpaper, down to the wall base
  for (let x = 0; x < W; x += 96) {
    ctx.strokeStyle = C.rgba("#1E1812", 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 700); ctx.stroke();
    ctx.strokeStyle = C.rgba("#8A6A4A", 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 4, 0); ctx.lineTo(x + 4, 700); ctx.stroke();
  }
  // damp stains under the window and a crack above the door
  ctx.fillStyle = C.rgba("#1E1812", 0.18);
  ctx.beginPath(); ctx.ellipse(1250, 150, 34, 52, 0.3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(1680, 520, 26, 44, -0.2, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.rgba("#1A1410", 0.45); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(176, 92); ctx.lineTo(202, 132); ctx.lineTo(186, 158); ctx.lineTo(214, 196); ctx.stroke();
  // the dado: chair rail, panels, skirting
  ctx.fillStyle = "#32261C"; ctx.fillRect(0, 556, W, 144);
  ctx.fillStyle = "#5A4636"; ctx.fillRect(0, 556, W, 12);
  ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(0, 568, W, 3);
  ctx.strokeStyle = C.rgba("#1E1812", 0.7); ctx.lineWidth = 3;
  for (let x = 40; x < W; x += 150) { ctx.strokeRect(x, 580, 118, 96); }
  ctx.fillStyle = "#2A1E16"; ctx.fillRect(0, 686, W, 14);
  ctx.fillStyle = C.rgba("#8A6A4A", 0.55); ctx.fillRect(0, 686, W, 3);

  // ---- the door, meeting the floor: a gap, a chain, a bolt ----
  paper(ctx, () => roundRectPath(ctx, 60, 200, 330, 500, 4), { fill: "#3A2E24", edge: "#1A1410", edgeW: 7, shadow: C.rgba(PAL.ink, 0.35), sx: 5, sy: 8 });
  ctx.strokeStyle = C.rgba("#1A1410", 0.75); ctx.lineWidth = 3;
  ctx.strokeRect(86, 228, 278, 440);
  ctx.strokeRect(106, 250, 238, 150);
  ctx.strokeRect(106, 430, 238, 220);
  ctx.fillStyle = "#5A4636"; ctx.fillRect(82, 220, 286, 8);
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(96, 470, 6, 0, TAU); ctx.fill();
  // the bolt, thrown home, and the chain hanging slack
  ctx.fillStyle = "#8A8478"; ctx.fillRect(250, 590, 54, 10);
  ctx.fillStyle = "#5A5A60"; ctx.beginPath(); ctx.arc(304, 595, 7, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.rgba("#B8B2A4", 0.75); ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const k = i / 4;
    ctx.beginPath(); ctx.ellipse(262 + k * 6, 440 + k * 44 + Math.sin(k * 3.1) * 6, 5, 8, 0.4, 0, TAU); ctx.stroke();
  }
  // the under-door gap, always lit; the option adds the feet that block it
  ctx.fillStyle = C.rgba("#FFD27A", 0.55); ctx.fillRect(78, 690, 294, 8);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.16); ctx.fillRect(74, 698, 302, 4);

  // ---- the floor, from the wall base down; the door now stands on it ----
  floorBoards(ctx, 700, 380, "#3E3024", C.rgba("#1A1410", 0.9), 120);
  ctx.fillStyle = C.rgba("#0E0B08", 0.35); ctx.fillRect(0, 700, W, 10);
  // a worn path from the door into the room
  ctx.fillStyle = C.rgba("#8A6A4A", 0.06);
  ctx.beginPath(); ctx.moveTo(120, 700); ctx.lineTo(370, 700); ctx.lineTo(620, 1080); ctx.lineTo(320, 1080); ctx.closePath(); ctx.fill();

  // someone standing outside: two feet in the gap and a shadow on the floor
  if (doorShadow > 0.01) {
    ctx.fillStyle = C.rgba("#0A0806", 0.92 * doorShadow);
    ctx.beginPath(); ctx.ellipse(146, 694, 26, 7, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(232, 694, 26, 7, 0, 0, TAU); ctx.fill();
    const dg = ctx.createLinearGradient(0, 700, 0, 850);
    dg.addColorStop(0, C.rgba("#0A0806", 0.60 * doorShadow));
    dg.addColorStop(1, C.rgba("#0A0806", 0));
    ctx.fillStyle = dg;
    ctx.beginPath(); ctx.moveTo(80, 700); ctx.lineTo(372, 700); ctx.lineTo(454, 850); ctx.lineTo(8, 850); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.rgba("#0A0806", 0.5 * doorShadow);
    ctx.fillRect(384, 210, 4, 490);
  }

  // One day counter only: the hero page the shot draws. The small month
  // planner that used to sit here made a second counter and circled day 11,
  // which the script forbids.

  // ---- the window, papered with the same clippings ----
  // The wanted poster that used to hang here was an invented prop: the film's
  // murder is not yet discovered on day five, so the thief cannot be on a
  // WANTED sheet in his own room. The newspaper pages carry the wall.
  // the clipping below the window, the same paper the window is papered with
  ctx.save(); ctx.translate(1170, 455); ctx.rotate(0.035);
  paper(ctx, () => tornRectPath(ctx, -60, -50, 120, 100, 3, 21), { fill: "#E0D2B4", edge: C.rgba(PAL.ink, 0.45), edgeW: 1.5, shadow: C.rgba(PAL.ink, 0.25), sx: 3, sy: 5 });
  // a clipping from the same paper the window carries, not the film's title
  TY.text(ctx, "DAILY", 0, -34, 11, { family: "Archivo Black", color: "#1A1410", align: "center", letter: 1 });
  ctx.fillStyle = C.rgba("#1A1410", 0.3); ctx.fillRect(-48, -26, 96, 2);
  ctx.fillStyle = C.rgba("#1A1410", 0.22); ctx.fillRect(-48, -12, 44, 46);
  ctx.fillStyle = C.rgba("#8E2430", 0.5); ctx.fillRect(-48, -12, 44, 8);
  ctx.strokeStyle = C.rgba("#1A1410", 0.35); ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(4, -14 + i * 12); ctx.lineTo(48, -14 + i * 12); ctx.stroke(); }
  ctx.restore();
  // the red thread between the two, and its pins
  ctx.strokeStyle = C.rgba("#B8382A", 0.65); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1176, 390); ctx.lineTo(1130, 418); ctx.lineTo(1200, 498); ctx.stroke();
  for (const [px, py] of [[1176, 390], [1130, 418], [1200, 498]]) {
    ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(px, py, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba("#F2E8D5", 0.6); ctx.beginPath(); ctx.arc(px - 1, py - 1, 1.4, 0, TAU); ctx.fill();
  }
  // No tally marks: the hero calendar page is the film's only day counter.

  // a picture rail, a wall clock and a shelf
  ctx.fillStyle = "#5A4636"; ctx.fillRect(400, 518, W - 400, 12);
  ctx.fillStyle = C.rgba("#1E1812", 0.8); ctx.fillRect(400, 530, W - 400, 4);
  ctx.fillStyle = C.rgba("#8A6A4A", 0.6); ctx.fillRect(400, 518, W - 400, 2);
  paper(ctx, () => { ctx.beginPath(); ctx.arc(1740, 240, 44, 0, TAU); }, { fill: "#E8DCC4", edge: "#1A1410", edgeW: 6, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    ctx.beginPath(); ctx.moveTo(1740 + Math.cos(a) * 32, 240 + Math.sin(a) * 32);
    ctx.lineTo(1740 + Math.cos(a) * 38, 240 + Math.sin(a) * 38); ctx.stroke();
  }
  // The clock is set per shot (o.clock = { h, m }) because days pass here and
  // the line is "he counted the hours": a frozen 4:00 across days 5-7 argued
  // against the script. The map is the same clock, at three different hours.
  const clk = o.clock || { h: 4, m: 0 };
  const ha = (((clk.h % 12) + clk.m / 60) / 12) * TAU - Math.PI / 2;
  const ma = (clk.m / 60) * TAU - Math.PI / 2;
  ctx.strokeStyle = "#1A1410";
  ctx.lineWidth = 4.4;
  ctx.beginPath(); ctx.moveTo(1740, 240);
  ctx.lineTo(1740 + Math.cos(ha) * 19, 240 + Math.sin(ha) * 19); ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(1740, 240);
  ctx.lineTo(1740 + Math.cos(ma) * 31, 240 + Math.sin(ma) * 31); ctx.stroke();
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(1740, 240, 4, 0, TAU); ctx.fill();
  paper(ctx, () => tornRectPath(ctx, 1150, 566, 210, 16, 2, 6), { fill: "#5A4636", edge: "#1A1410", edgeW: 3 });
  ctx.fillStyle = "#3A5A4A"; ctx.fillRect(1180, 526, 18, 40);
  ctx.fillStyle = "#2A4A3A"; ctx.fillRect(1184, 518, 10, 10);
  ctx.fillStyle = "#7A3A2A"; ctx.fillRect(1230, 536, 20, 30);
  ctx.fillStyle = "#C68E2E"; ctx.fillRect(1234, 528, 12, 10);
  ctx.fillStyle = "#4A4A5A"; ctx.fillRect(1280, 540, 22, 26);
  // a candle on the shelf, the room's second flame
  ctx.fillStyle = "#E8DCC4"; ctx.fillRect(1326, 518, 16, 48);
  ctx.fillStyle = C.rgba("#171310", 0.35); ctx.fillRect(1326, 518, 3, 48);
  ctx.fillStyle = C.rgba("#FFF2C8", 0.95 * flick);
  ctx.beginPath(); ctx.ellipse(1334, 506 - Math.sin(t * 9.0) * 1.5, 4, 8, 0, 0, TAU); ctx.fill();
  const cg = ctx.createRadialGradient(1334, 506, 2, 1334, 506, 80);
  cg.addColorStop(0, C.rgba("#FFE2A0", 0.28 * flick)); cg.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(1334, 506, 80, 0, TAU); ctx.fill();

  // ---- the window: cool glass, rain, one lit room across the yard ----
  paper(ctx, () => roundRectPath(ctx, 1280, 180, 380, 300, 6), { fill: "#2A3A4A", edge: "#5A4636", edgeW: 10, shadow: C.rgba(PAL.ink, 0.35), sx: 5, sy: 8 });
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4; ctx.strokeRect(1276, 176, 388, 308);
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.5); ctx.lineWidth = 2; ctx.strokeRect(1284, 184, 372, 292);
  const wg = ctx.createLinearGradient(0, 192, 0, 468);
  wg.addColorStop(0, C.rgba("#4A6A82", 0.55));
  wg.addColorStop(0.55, C.rgba("#1A2C3A", 0.82));
  wg.addColorStop(1, C.rgba("#0E1A22", 0.95));
  ctx.fillStyle = wg; ctx.fillRect(1292, 192, 356, 276);
  // a lit window across the yard, right of the shot's newspaper
  ctx.fillStyle = C.rgba("#FFD27A", 0.24); ctx.fillRect(1562, 228, 54, 74);
  ctx.strokeStyle = C.rgba("#1A1410", 0.35); ctx.lineWidth = 3; ctx.strokeRect(1562, 228, 54, 74);
  ctx.fillStyle = C.rgba("#171310", 0.30); ctx.fillRect(1584, 228, 3, 74);
  // rain running down, not across
  ctx.strokeStyle = C.rgba("#C8D8E8", 0.32); ctx.lineWidth = 2;
  for (let i = 0; i < 22; i++) {
    const x = 1298 + C.hash(i * 4.3) * 344;
    const y = 194 + ((C.hash(i * 7.7) * 300 + t * 120) % 300);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 20 + C.hash(i * 3.1) * 16); ctx.stroke();
  }
  // mullions and sill
  ctx.strokeStyle = "#5A4636"; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(1470, 180); ctx.lineTo(1470, 480); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1280, 330); ctx.lineTo(1660, 330); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8B8A0", 0.4); ctx.lineWidth = 2;
  ctx.strokeRect(1288, 188, 364, 284);
  paper(ctx, () => roundRectPath(ctx, 1256, 480, 428, 26, 4), { fill: "#6A4A30", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 6 });

  // a small framed picture on the right wall, now clear of the evidence
  paper(ctx, () => roundRectPath(ctx, 1700, 320, 90, 124, 3), { fill: "#5A4636", edge: "#1A1410", edgeW: 4, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.fillStyle = "#2A3A4A"; ctx.fillRect(1712, 332, 66, 100);
  ctx.strokeStyle = C.rgba("#C8D8E8", 0.5); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(1745, 366, 14, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1712, 412); ctx.lineTo(1745, 386); ctx.lineTo(1778, 412); ctx.stroke();

  // ---- the bulb ----
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(640, 0); ctx.lineTo(640, 150); ctx.stroke();
  ctx.fillStyle = C.rgba("#FFF2C8", 0.95 * flick); ctx.beginPath(); ctx.arc(640, 165, 15, 0, TAU); ctx.fill();
  const mx = 640 + Math.cos(t * 1.7) * 54, my = 190 + Math.sin(t * 2.3) * 34;
  ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.sin(t * 3.1) * 0.5);
  ctx.fillStyle = "#E8DCC4"; ctx.beginPath(); ctx.ellipse(-7, 0, 8, 4, 0.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(7, 0, 8, 4, -0.4, 0, TAU); ctx.fill();
  ctx.restore();

  // ---- the rug ----
  // No prised-up board: the script keeps the money and the bag in plain sight,
  // and a black cavity under the table read as a torn scrap, not a floor.
  paper(ctx, () => roundRectPath(ctx, 760, 900, 400, 140, 6), { fill: "#7A3A2A", edge: "#1A1410", edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 5 });
  ctx.strokeStyle = C.rgba("#E8B84A", 0.6); ctx.lineWidth = 3;
  ctx.strokeRect(782, 918, 356, 104);
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(820 + i * 68, 922); ctx.lineTo(820 + i * 68, 1018); ctx.stroke(); }

  // a stack of old papers by the table leg, tied with twine
  ctx.save(); ctx.translate(364, 868);
  for (let i = 3; i >= 0; i--) {
    ctx.save(); ctx.translate(i * 2, -i * 3); ctx.rotate(-0.04 + i * 0.02);
    paper(ctx, () => tornRectPath(ctx, -34, -10, 68, 16, 2, 7 + i), { fill: i % 2 ? "#D8C8A8" : "#E8DCC4", edge: C.rgba(PAL.ink, 0.4), edgeW: 1.2 });
    ctx.fillStyle = C.rgba(PAL.ink, 0.25); ctx.fillRect(-24, -4, 36, 2);
    ctx.restore();
  }
  ctx.strokeStyle = C.rgba("#5A3E26", 0.7); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-30, -8); ctx.lineTo(-26, 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(28, -12); ctx.lineTo(32, 4); ctx.stroke();
  ctx.restore();

  // ---- the table: clear top, so the money and the bag have somewhere to land ----
  paper(ctx, () => tornRectPath(ctx, 400, 636, 560, 30, 3, 11), { fill: "#6A4A30", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 7 });
  ctx.fillStyle = "#5A3E2A"; ctx.fillRect(436, 666, 26, 234); ctx.fillRect(900, 666, 26, 234);
  ctx.fillStyle = C.rgba("#3A2A1E", 0.5); ctx.fillRect(400, 652, 560, 5);
  woodGrain(ctx, 410, 640, 540, 22, 5);
  ctx.fillStyle = C.rgba("#8A6A4A", 0.55); ctx.fillRect(410, 636, 540, 3);
  // a small ashtray at the far left, away from the centre
  paper(ctx, () => roundRectPath(ctx, 416, 632, 34, 10, 4), { fill: "#8A8478", edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = C.rgba("#171310", 0.45); ctx.beginPath(); ctx.ellipse(433, 637, 11, 3, 0, 0, TAU); ctx.fill();

  // ---- the chair under the window, the bedroll in the corner ----
  shadowEllipse(ctx, 1510, 900, 86, 12, 0.25);
  paper(ctx, () => roundRectPath(ctx, 1448, 596, 18, 304, 4), { fill: "#5A4030", edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
  paper(ctx, () => roundRectPath(ctx, 1554, 596, 18, 304, 4), { fill: "#5A4030", edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
  paper(ctx, () => roundRectPath(ctx, 1442, 590, 136, 20, 5), { fill: "#6A4A32", edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = "#5A4030"; ctx.fillRect(1466, 620, 88, 12); ctx.fillRect(1466, 650, 88, 10);
  paper(ctx, () => roundRectPath(ctx, 1430, 690, 160, 26, 5), { fill: "#6A4A32", edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 6 });
  ctx.fillStyle = "#7A3A2A"; ctx.beginPath(); ctx.ellipse(1510, 690, 72, 8, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#4A3428"; ctx.fillRect(1442, 716, 16, 184); ctx.fillRect(1562, 716, 16, 184);
  // No bedroll in this corner: at 480 px it read as a second bag beside the
  // satchel. The room keeps one bag, the one the story packs.

  // ---- the light pass: the bulb, the floor lamp, the window ----
  const g = ctx.createRadialGradient(640, 165, 4, 640, 165, 320);
  g.addColorStop(0, C.rgba("#FFE2A0", 0.42 * flick)); g.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(640, 165, 320, 0, TAU); ctx.fill();
  ctx.fillStyle = C.rgba("#6A8AA2", 0.05);
  ctx.beginPath(); ctx.moveTo(1290, 480); ctx.lineTo(1650, 480); ctx.lineTo(1790, 900); ctx.lineTo(1120, 900); ctx.closePath(); ctx.fill();
}

/* Five faint grain lines on a flat paper surface: enough to read as wood, not
   enough to fight the props. */
function woodGrain(ctx, x, y, w, h, n) {
  ctx.strokeStyle = C.rgba("#3A2A1E", 0.30); ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const yy = y + 4 + i * (h - 8) / Math.max(1, n - 1);
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy + Math.sin(i * 2.1) * 1.5); ctx.stroke();
  }
}

/* The cell bars, drawn on the wall. Split out so a wall prop (the calendar)
   can be painted before them and still sit behind the bars. */
function cellBars(ctx) {
  ctx.strokeStyle = "#8A9098"; ctx.lineWidth = 12; ctx.lineCap = "round";
  for (let x = 120; x < W; x += 120) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke();
    ctx.strokeStyle = C.rgba("#C8D0D8", 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 3, 0); ctx.lineTo(x - 3, 900); ctx.stroke();
    ctx.strokeStyle = "#8A9098"; ctx.lineWidth = 12;
  }
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(0, 360); ctx.lineTo(W, 360); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 720); ctx.lineTo(W, 720); ctx.stroke();
  ctx.strokeStyle = C.rgba("#C8D0D8", 0.45); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 354); ctx.lineTo(W, 354); ctx.stroke();
}

/* The foreground bars. `cellBars` is the wall/behind layer, painted inside the
   set; this is the same grille painted AFTER the cast, so a man inside stands
   behind it. It stops at the cell door, leaving the corridor light open. Call
   it from a shot, inside the camera, once the actors are down and before the
   shot's title/HUD is painted. */
function cellBarsFront(ctx, o = {}) {
  const a = o.alpha ?? 1;
  const last = o.lastX ?? 1540;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.lineCap = "round";
  // the two horizontal rails, thrown forward
  for (const ry of [360, 720]) {
    ctx.strokeStyle = C.rgba("#05070A", 0.30); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, ry + 6); ctx.lineTo(last, ry + 6); ctx.stroke();
    ctx.strokeStyle = "#8A9098"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(last, ry); ctx.stroke();
    ctx.strokeStyle = C.rgba("#D8E0E8", 0.5); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, ry - 3); ctx.lineTo(last, ry - 3); ctx.stroke();
  }
  // the bars, heavier than the wall layer because they are nearer
  for (let x = 120; x <= last; x += 120) {
    ctx.strokeStyle = C.rgba("#05070A", 0.30); ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(x + 8, 0); ctx.lineTo(x + 8, 900); ctx.stroke();
    ctx.strokeStyle = "#8A9098"; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke();
    ctx.strokeStyle = C.rgba("#D8E0E8", 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 4, 0); ctx.lineTo(x - 4, 900); ctx.stroke();
    // the bar's foot on the floor
    ctx.fillStyle = C.rgba("#05070A", 0.35);
    ctx.beginPath(); ctx.ellipse(x + 6, 910, 16, 8, 0, 0, TAU); ctx.fill();
  }
  // rivets at the rail crossings, last so they sit on top
  for (let x = 120; x <= last; x += 120) {
    for (const ry of [360, 720]) {
      ctx.fillStyle = "#5A6068"; ctx.beginPath(); ctx.arc(x, ry, 7, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#E8F0F8", 0.55); ctx.beginPath(); ctx.arc(x - 2, ry - 2, 2.4, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

function cellSet(ctx, t, o = {}) {
  paperBg(ctx, "#24282E", "#32363C");
  ctx.fillStyle = "#2A2E34"; ctx.fillRect(0, 0, W, 900);
  // stone courses
  ctx.strokeStyle = C.rgba("#4A5058", 0.55); ctx.lineWidth = 2;
  for (let y = 40; y < 900; y += 78) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    const off = (Math.floor(y / 78) % 2) * 90;
    for (let x = off; x < W; x += 180) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 78); ctx.stroke(); }
  }
  // high window BEFORE the bars, with a frame and a sill
  paper(ctx, () => roundRectPath(ctx, 820, 90, 280, 170, 4), { fill: "#3A5A72", edge: "#6A5A4A", edgeW: 10, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 6 });
  ctx.fillStyle = C.rgba("#8AB0C8", 0.4); ctx.fillRect(832, 102, 256, 146);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.18); ctx.fillRect(832, 102, 256, 146);
  ctx.strokeStyle = "#6A5A4A"; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(960, 90); ctx.lineTo(960, 260); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(820, 175); ctx.lineTo(1100, 175); ctx.stroke();
  paper(ctx, () => roundRectPath(ctx, 796, 260, 328, 22, 4), { fill: "#7A6A56", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 5 });
  // bars AFTER the window, so the window sits behind them
  cellBars(ctx);
  // bench: seat, backrest, legs, panels (behind the cast)
  paper(ctx, () => roundRectPath(ctx, 600, 760, 720, 34, 4), { fill: "#5A4E40", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 7 });
  paper(ctx, () => roundRectPath(ctx, 620, 700, 680, 64, 4), { fill: "#4A4036", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 5 });
  ctx.strokeStyle = C.rgba("#3A2E24", 0.7); ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.strokeRect(640 + i * 168, 712, 152, 40); }
  ctx.fillStyle = "#4A3A2C"; ctx.fillRect(640, 794, 30, 106); ctx.fillRect(1250, 794, 30, 106);
  ctx.fillStyle = C.rgba("#8A7A62", 0.5); ctx.fillRect(600, 760, 720, 5);
  // a warm wall lamp beside the door
  ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(1450, 300); ctx.lineTo(1450, 360); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(1418, 360); ctx.lineTo(1482, 360); ctx.lineTo(1470, 400); ctx.lineTo(1430, 400); ctx.closePath(); }, { fill: "#E8B84A", edge: "#1A1410", edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 3, sy: 5 });
  ctx.fillStyle = C.rgba("#FFE2A0", 0.6); ctx.beginPath(); ctx.ellipse(1450, 400, 30, 6, 0, 0, TAU); ctx.fill();
  const wl = ctx.createRadialGradient(1450, 400, 6, 1450, 400, 220);
  wl.addColorStop(0, C.rgba("#FFE2A0", 0.32)); wl.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = wl; ctx.beginPath(); ctx.arc(1450, 400, 220, 0, TAU); ctx.fill();
  // floorboards
  floorBoards(ctx, 900, 180, "#24282E", C.rgba("#171A1E", 0.7), 110);
  // a stone drain and the slop bucket, so the cell has a floor with a use
  ctx.fillStyle = "#14171A"; ctx.fillRect(300, 944, 120, 44);
  ctx.strokeStyle = "#4A5058"; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(308 + i * 19, 950); ctx.lineTo(308 + i * 19, 982); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8A9098", 0.35); ctx.lineWidth = 2; ctx.strokeRect(300, 944, 120, 44);
  paper(ctx, () => roundRectPath(ctx, 1358, 834, 60, 66, 8), { fill: "#4A5058", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 4, sy: 7 });
  ctx.strokeStyle = "#2A2E34"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(1358, 852); ctx.lineTo(1418, 852); ctx.stroke();
  ctx.strokeStyle = C.rgba("#9AA0A8", 0.6); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(1388, 834, 20, Math.PI, TAU); ctx.stroke();
  // cell-door frame at the right, opening in the wall
  ctx.fillStyle = "#1A1D21"; ctx.fillRect(1560, 120, 300, 780);
  paper(ctx, () => roundRectPath(ctx, 1540, 100, 340, 800, 6), { fill: "rgba(0,0,0,0)", edge: "#6A5A4A", edgeW: 12 });
  ctx.strokeStyle = C.rgba("#8A7A62", 0.7); ctx.lineWidth = 4;
  ctx.strokeRect(1556, 116, 308, 768);
  // the corridor light behind the door
  const doorLight = ctx.createLinearGradient(1560, 0, 1860, 0);
  doorLight.addColorStop(0, C.rgba("#FFD27A", 0.35));
  doorLight.addColorStop(1, C.rgba("#FFD27A", 0));
  ctx.fillStyle = doorLight; ctx.fillRect(1560, 120, 300, 780);
}

function courtSet(ctx, t, o = {}) {
  paperBg(ctx, "#32261E", "#423222");
  ctx.fillStyle = "#3E2E22"; ctx.fillRect(0, 0, W, 900);
  // wall panels and molding
  ctx.strokeStyle = C.rgba("#2A1A12", 0.85); ctx.lineWidth = 4;
  for (let x = 80; x < W; x += 260) {
    ctx.strokeRect(x, 60, 220, 400);
    ctx.strokeStyle = C.rgba("#8A6A4A", 0.55); ctx.lineWidth = 1.6;
    ctx.strokeRect(x + 4, 64, 212, 392);
    ctx.strokeStyle = C.rgba("#2A1A12", 0.85); ctx.lineWidth = 4;
  }
  for (let x = 20; x < W; x += 260) {
    ctx.fillStyle = C.rgba("#2A1A12", 0.7); ctx.fillRect(x, 60, 10, 400);
    ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(x + 10, 60, 2, 400);
  }
  ctx.fillStyle = "#4A3628"; ctx.fillRect(0, 480, W, 20);
  // flag on a pole, rippling
  ctx.fillStyle = "#8A6A4A"; ctx.fillRect(1480, 80, 10, 440);
  ctx.save(); ctx.translate(1490, 120);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const w = 260, h = 150;
    ctx.moveTo(0, i * 4);
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, Math.sin(t * 2.2 + x * 0.03 + i) * 6 + i * 2);
    for (let x = w; x >= 0; x -= 20) ctx.lineTo(x, h + Math.sin(t * 2.2 + x * 0.03 + i) * 6 + i * 2);
    ctx.closePath();
    ctx.fillStyle = i === 0 ? "#B8382A" : i === 1 ? "#C84A32" : "#A82E24";
    ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 2; ctx.stroke();
  }
  // a court banner, not a national flag: a plain red field with a gold hoist
  // stripe. The gold disc on the field read as a national emblem at 1080p.
  ctx.fillStyle = C.rgba(PAL.gold, 0.55); ctx.fillRect(0, 0, 12, 150);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.30); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(12, 4); ctx.lineTo(12, 146); ctx.stroke();
  ctx.restore();
  // warm light shaft from the high windows
  const g = ctx.createLinearGradient(700, 0, 1200, 900);
  g.addColorStop(0, C.rgba("#FFE2A0", 0.22)); g.addColorStop(1, C.rgba("#FFE2A0", 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(660, 0); ctx.lineTo(900, 0); ctx.lineTo(1320, 900); ctx.lineTo(820, 900); ctx.closePath(); ctx.fill();
  // bench: top, front panels, gold trim
  ctx.fillStyle = "#6A4A30"; ctx.fillRect(0, 520, W, 44);
  ctx.fillStyle = "#5A4028"; ctx.fillRect(0, 564, W, 336);
  ctx.fillStyle = PAL.gold; ctx.fillRect(0, 520, W, 8);
  ctx.strokeStyle = C.rgba("#2A1A12", 0.7); ctx.lineWidth = 4;
  for (let x = 60; x < W; x += 240) { ctx.strokeRect(x, 600, 190, 240); }
  ctx.fillStyle = C.rgba("#8A6A4A", 0.5); ctx.fillRect(0, 564, W, 5);
  // floor
  floorBoards(ctx, 900, 180, "#32261E", C.rgba("#241A14", 0.6), 150);
}

function yardSet(ctx, t, o = {}) {
  paperBg(ctx, "#4A3E34", "#7A5E44");
  // dawn sun
  const sunY = 300 - (o.sunLift || 0);
  paper(ctx, () => blobPath(ctx, 1520, sunY, 92, 92, 40, 0.02, 4), { fill: "#F2C878", edge: C.rgba(PAL.ink, 0.2), edgeW: 2 });
  ctx.fillStyle = C.rgba("#F2C878", 0.14); ctx.beginPath(); ctx.arc(1520, sunY, 200, 0, TAU); ctx.fill();
  // high wall with courses
  ctx.fillStyle = "#3E3832"; ctx.fillRect(0, 300, W, 600);
  brickWall(ctx, 0, 300, W, 600, "#3E3832", C.rgba("#0A0806", 0.9), 150, 52);
  ctx.fillStyle = C.rgba("#2E2822", 0.35); ctx.fillRect(0, 300, W, 18);
  // dawn light band
  const g = ctx.createLinearGradient(0, 0, 0, 900);
  g.addColorStop(0, C.rgba("#FFD27A", 0.22)); g.addColorStop(1, C.rgba("#FFD27A", 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 900);
  // gallows: two posts and a beam, with braces
  ctx.fillStyle = "#3A2A1E"; ctx.fillRect(1160, 180, 28, 720);
  ctx.fillRect(1480, 180, 28, 720);
  ctx.fillRect(1160, 180, 348, 26);
  ctx.strokeStyle = C.rgba("#1A1410", 0.6); ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(1188, 260); ctx.lineTo(1260, 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1480, 260); ctx.lineTo(1408, 180); ctx.stroke();
  // floor and platform
  floorBoards(ctx, 900, 180, "#322E2A", C.rgba("#241E1A", 0.6), 140);
  ctx.fillStyle = "#4A3428"; ctx.fillRect(1100, 900, 440, 40);
  ctx.fillStyle = "#3A2A1E"; ctx.fillRect(1260, 900, 120, 36);
  ctx.strokeStyle = C.rgba("#1A1410", 0.6); ctx.lineWidth = 3; ctx.strokeRect(1260, 900, 120, 36);
  ctx.fillStyle = C.rgba("#8A6A4A", 0.6); ctx.fillRect(1100, 900, 440, 5);
  // bell frame: two posts and a crossbar, bell swings from the bar
  ctx.fillStyle = "#3A2E26"; ctx.fillRect(262, 360, 22, 540); ctx.fillRect(456, 360, 22, 540);
  ctx.fillRect(262, 360, 216, 18);
  ctx.strokeStyle = C.rgba("#1A1410", 0.5); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(284, 420); ctx.lineTo(330, 378); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(456, 420); ctx.lineTo(410, 378); ctx.stroke();
  const swing = o.bellSwing || 0;
  ctx.save(); ctx.translate(370, 378); ctx.rotate(swing);
  ctx.strokeStyle = "#B89A6A"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-52, 150); ctx.quadraticCurveTo(-52, 24, 0, 22); ctx.quadraticCurveTo(52, 24, 52, 150); ctx.lineTo(64, 150); ctx.lineTo(-64, 150); ctx.closePath(); }, { fill: "#E0A83A", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
  ctx.fillStyle = C.rgba("#FFD27A", 0.5); ctx.beginPath(); ctx.ellipse(-18, 70, 12, 50, -0.2, 0, TAU); ctx.fill();
  ctx.fillStyle = "#C68E2E"; ctx.fillRect(-64, 146, 128, 9);
  ctx.fillStyle = "#8A5A22"; ctx.beginPath(); ctx.arc(0, 162, 11, 0, TAU); ctx.fill();
  ctx.restore();
  if (Math.abs(swing) > 0.02) {
    ctx.save(); ctx.strokeStyle = C.rgba("#FFD27A", 0.5); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(370, 378, 120 + i * 34, -0.5 + i * 0.2, 0.5 + i * 0.2); ctx.stroke(); }
    ctx.restore();
  }
  // dust motes in the dawn light
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const x = 700 + C.hash(i * 3.1) * 900 + Math.sin(t * 0.6 + i) * 18;
    const y = 120 + C.hash(i * 7.7) * 700 - C.frac(t * 0.04 + C.hash(i * 5.3)) * 90;
    ctx.fillStyle = C.rgba("#FFE2A0", 0.18 + C.hash(i * 9.1) * 0.25);
    ctx.beginPath(); ctx.arc(x, y, 1.5 + C.hash(i * 11.3) * 2.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
