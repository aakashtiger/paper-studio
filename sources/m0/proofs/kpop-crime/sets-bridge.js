/* THE RUN — the far end of the bridge: a police barrier closes the walkway, so
   "the only way out" is a place with a shape instead of a phrase. Two piers, a
   striped arm and a booth beyond it, all standing on the deck at y=900 like the
   cast, so nothing floats. `lit` is how much searchlight is on it. */
function bridgeEndGate(ctx, t, o = {}) {
  const lit = o.lit === undefined ? 1 : o.lit;
  // a cold halo, so the barrier separates from the lit city behind it
  const hg = ctx.createRadialGradient(1770, 640, 40, 1770, 640, 430);
  hg.addColorStop(0, C.rgba("#DFF0FF", 0.20 * lit));
  hg.addColorStop(1, C.rgba("#DFF0FF", 0));
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.arc(1770, 640, 430, 0, TAU); ctx.fill();

  // the booth first, so both piers stand in front of it
  paper(ctx, () => roundRectPath(ctx, 1846, 430, 190, 470, 6), { fill: "#28323E", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.4), sx: 6, sy: 9 });
  ctx.fillStyle = "#3A4A5A"; ctx.fillRect(1846, 430, 190, 16);
  ctx.fillStyle = C.rgba("#FFD27A", 0.90 * lit); ctx.fillRect(1872, 474, 138, 92);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.65); ctx.lineWidth = 2.4;
  ctx.strokeRect(1872, 474, 138, 92);
  ctx.beginPath(); ctx.moveTo(1941, 474); ctx.lineTo(1941, 566); ctx.stroke();
  ctx.fillStyle = C.rgba("#2A3644", 0.55); ctx.fillRect(1872, 560, 138, 6);
  // the booth's own small sign
  ctx.fillStyle = "#8E2430"; ctx.fillRect(1868, 596, 146, 26);
  TY.text(ctx, "POLICE", 1941, 615, 13, { family: "Archivo Black", color: CREAM, align: "center", letter: 3 });
  // its door and step
  ctx.fillStyle = "#1E2834"; ctx.fillRect(1900, 660, 86, 236);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 2; ctx.strokeRect(1900, 660, 86, 236);
  ctx.fillStyle = "#46586A"; ctx.fillRect(1892, 894, 102, 8);

  // the two piers, on the deck line
  for (const x of [1586, 1958]) {
    paper(ctx, () => roundRectPath(ctx, x - 15, 520, 30, 380, 4), { fill: "#222C38", edge: PAL.ink, edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.45), sx: 6, sy: 8 });
    ctx.fillStyle = "#3A4A5A"; ctx.fillRect(x - 20, 512, 40, 12);
    ctx.fillStyle = C.rgba("#8AA0B8", 0.5); ctx.fillRect(x - 15, 536, 3, 360);
    ctx.fillStyle = C.rgba("#FFD27A", 0.95 * lit);
    ctx.beginPath(); ctx.arc(x, 500, 7, 0, TAU); ctx.fill();
    const lg = ctx.createRadialGradient(x, 500, 3, x, 500, 70);
    lg.addColorStop(0, C.rgba("#FFD27A", 0.34 * lit)); lg.addColorStop(1, C.rgba("#FFD27A", 0));
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(x, 500, 70, 0, TAU); ctx.fill();
  }

  // the arm across the walkway, striped, at waist height on a one-metre barrier
  paper(ctx, () => roundRectPath(ctx, 1568, 596, 404, 20, 4), { fill: "#E4D8C0", edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
  ctx.fillStyle = "#B8382A";
  for (let i = 0; i < 5; i++) ctx.fillRect(1580 + i * 80, 598, 40, 16);
  // the plate: the walk ends here
  paper(ctx, () => roundRectPath(ctx, 1694, 548, 152, 42, 3), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.25), sx: 2, sy: 4 });
  TY.text(ctx, "NO ENTRY", 1770, 576, 17, { family: "Archivo Black", color: "#8E2430", align: "center", letter: 2 });
  // the arm's counterweight, so it reads as a barrier and not a rail
  ctx.fillStyle = "#1E2834"; ctx.fillRect(1952, 584, 14, 44);

  // rain beating off the barrier
  ctx.strokeStyle = C.rgba("#D8E8F8", 0.22); ctx.lineWidth = 1.6;
  for (let i = 0; i < 14; i++) {
    const x = 1580 + i * 28;
    const y = 606 + C.hash(i * 5.1) * 60;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 18); ctx.stroke();
  }
}


/* THE RUN — the bridge set. Warm city, wet deck, cables, lamps. */
function bridgeSet(ctx, t, o = {}) {
  paperBg(ctx, "#1C2834", "#2E3C4A");
  // moon
  paper(ctx, () => blobPath(ctx, 260, 150, 64, 64, 30, 0.03, 9), { fill: "#F2D9A0", edge: C.rgba(PAL.ink, 0.3), edgeW: 2 });
  // city blocks with lit windows
  for (let i = 0; i < 6; i++) {
    const x = i * 340 - 80;
    const h = 180 + C.hash(i * 3.3) * 260;
    ctx.fillStyle = i % 2 ? "#242E3A" : "#1C2630";
    ctx.fillRect(x, 600 - h, 260, h);
    ctx.fillStyle = "#34424E"; ctx.fillRect(x, 600 - h, 260, 7);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
      if (C.hash(i * 17 + r * 3 + c) > 0.42) {
        ctx.fillStyle = C.hash(i * 9 + r * 7 + c) > 0.5 ? C.rgba("#FFD27A", 0.88) : C.rgba("#FF8A5A", 0.75);
        ctx.fillRect(x + 24 + c * 64, 600 - h + 30 + r * 42, 18, 20);
        ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1;
        ctx.strokeRect(x + 24 + c * 64, 600 - h + 30 + r * 42, 18, 20);
      }
    }
  }
  // the river, visible in the band between the city and the bridge
  ctx.fillStyle = "#1A303E"; ctx.fillRect(0, 600, W, 100);
  ctx.strokeStyle = C.rgba("#5A8AA2", 0.35); ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    const y = 606 + i * 5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + Math.sin(t * 1.2 + i) * 4); ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = C.rgba("#FFD27A", 0.10 + 0.06 * C.hash(i * 3.1));
    const w = 80 + C.hash(i * 7.7) * 160;
    ctx.fillRect(120 + i * 300 + Math.sin(t * 0.7 + i) * 20, 620 + i * 6, w, 3);
  }
  // bridge deck with planks and a rail
  ctx.fillStyle = "#3E3E46"; ctx.fillRect(0, 660, W, 60);
  ctx.fillStyle = "#32323A"; ctx.fillRect(0, 720, W, 20);
  ctx.strokeStyle = C.rgba("#7A7A84", 0.7); ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 46) { ctx.beginPath(); ctx.moveTo(x, 660); ctx.lineTo(x - 12, 720); ctx.stroke(); }
  ctx.fillStyle = C.rgba("#9A9AA4", 0.6); ctx.fillRect(0, 660, W, 5);
  ctx.strokeStyle = "#4A4A54"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(0, 640); ctx.lineTo(W, 640); ctx.stroke();
  for (let x = 40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 600); ctx.lineTo(x, 660); ctx.stroke(); }
  // towers and cables, with cross-bracing for edge detail
  ctx.strokeStyle = "#2A3440"; ctx.lineWidth = 10;
  for (let i = 0; i < 5; i++) { const x = 180 + i * 400; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 660); ctx.stroke(); }
  ctx.strokeStyle = C.rgba("#8A9AAA", 0.6); ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) { const x = 180 + i * 400; ctx.beginPath(); ctx.moveTo(x - 3, 0); ctx.lineTo(x - 3, 660); ctx.stroke(); }
  ctx.strokeStyle = "#2A3440"; ctx.lineWidth = 5;
  for (let i = 0; i < 5; i++) {
    const x = 180 + i * 400;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 200, 660); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 200, 660); ctx.stroke();
  }
  ctx.strokeStyle = C.rgba("#8A9AAA", 0.45); ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const x = 180 + i * 400;
    ctx.beginPath(); ctx.moveTo(x + 2, 0); ctx.lineTo(x + 202, 660); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 2, 0); ctx.lineTo(x - 198, 660); ctx.stroke();
  }
  // rivets on the towers
  for (let i = 0; i < 5; i++) {
    const x = 180 + i * 400;
    for (let y = 60; y < 640; y += 70) {
      ctx.fillStyle = "#141C26"; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#C8D0D8", 0.6); ctx.beginPath(); ctx.arc(x - 1, y - 1, 1.6, 0, TAU); ctx.fill();
    }
  }
  // secondary bracing
  ctx.strokeStyle = C.rgba("#8A9AAA", 0.4); ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const x = 180 + i * 400;
    for (let k = 0; k < 4; k++) {
      const y0 = k * 150, y1 = y0 + 150;
      ctx.beginPath(); ctx.moveTo(x + k * 50, y0); ctx.lineTo(x + (k + 1) * 50, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - k * 50, y0); ctx.lineTo(x - (k + 1) * 50, y1); ctx.stroke();
    }
  }
  // lamps with warm pools
  for (let i = 0; i < 4; i++) {
    const x = 280 + i * 440;
    ctx.strokeStyle = "#4A4A52"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x, 660); ctx.lineTo(x, 420); ctx.stroke();
    ctx.fillStyle = "#6A6A74"; ctx.fillRect(x - 20, 412, 40, 8);
    ctx.fillStyle = C.rgba("#FFF2C8", 0.95); ctx.beginPath(); ctx.arc(x, 406, 12, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(x, 406, 4, x, 406, 260);
    g.addColorStop(0, C.rgba("#FFE2A0", 0.62)); g.addColorStop(1, C.rgba("#FFE2A0", 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 406, 260, 0, TAU); ctx.fill();
  }
  // a red signal on the tower
  ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(760, 500, 10, 0, TAU); ctx.fill();
  const rg = ctx.createRadialGradient(760, 500, 4, 760, 500, 120);
  rg.addColorStop(0, C.rgba("#FF6A4A", 0.55)); rg.addColorStop(1, C.rgba("#FF6A4A", 0));
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(760, 500, 120, 0, TAU); ctx.fill();
  // the near deck, in perspective: the cast stands on this, not on the river
  const deck = ctx.createLinearGradient(0, 720, 0, 1080);
  deck.addColorStop(0, "#3E3E46"); deck.addColorStop(1, "#2A2A32");
  // overscanned like paperBg: the camera pulls out to z=0.95 in s15, and a
  // deck of exactly 0..W leaves a cream margin at the frame edge
  ctx.fillStyle = deck; ctx.fillRect(-W, 720, W * 3, H * 2 - 720);
  ctx.fillStyle = "#32323A"; ctx.fillRect(0, 720, W, 10);
  ctx.strokeStyle = C.rgba("#7A7A84", 0.55); ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = 748 + i * 40;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.strokeStyle = C.rgba("#1E1E24", 0.6); ctx.lineWidth = 3;
  for (let i = 0; i < 10; i++) {
    const x = i * 220 - 40;
    ctx.beginPath(); ctx.moveTo(x, 720); ctx.lineTo(x - 60, 1080); ctx.stroke();
  }
  ctx.fillStyle = C.rgba("#FFD27A", 0.10); ctx.fillRect(0, 790, W, 3);
  ctx.fillStyle = C.rgba("#FFD27A", 0.07); ctx.fillRect(0, 900, W, 2);
  ctx.fillStyle = C.rgba("#8AA0B8", 0.08); ctx.fillRect(0, 840, W, 2);
  ctx.fillStyle = C.rgba("#14141A", 0.35); ctx.fillRect(0, 1058, W, 22);
  ctx.fillStyle = C.rgba("#FF9A5A", 0.10); ctx.fillRect(0, 620, W, 460);
  ctx.fillStyle = C.rgba("#FFB070", 0.10); ctx.fillRect(0, 660, W, 60);
  // rain and splashes on the deck
  rainStreaks(ctx, t, 110, "#C8D8E8", 0.32);
  splashRings(ctx, t, 22, 722);
}
