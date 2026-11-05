/* Lakshmi V2 — a four-armed paper goddess, drawn for the proof film.
 *
 * This is deliberately not the old performer rig with a halo: the four arms,
 * the attributes, the crown, the lotus base and the face are drawn here. The
 * paper construction (cut edge, shadow, brads, gold) is the pack's; the
 * silhouette is the goddess's.
 */
(function () {
  const V = {
    skin: "#E9B26F",
    skinD: "#C98A4B",
    skinL: "#F6D19B",
    hair: "#1A1420",
    hairL: "#35243A",
    gold: "#F2C24E",
    goldD: "#B97A18",
    goldL: "#FFE39A",
    sari: "#E2B060",
    sariD: "#B87A30",
    sariL: "#F6D090",
    cream: "#FFF3DC",
    lotus: "#F28AA6",
    lotusL: "#FFC1D0",
    leaf: "#2E8B57",
    leafD: "#1D5C3A",
    kohl: "#1A1420",
  };

  function edge(a = 0.55) { return C.rgba(PAL.ink, a); }

  function tapered(ctx, x1, y1, x2, y2, w1, w2, fill, edgeCol = edge(), shadow = true) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ang = Math.atan2(-dx, dy); // local +y maps to (dx, dy); 0 = down
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(ang);
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(-w1 / 2, 0);
      ctx.quadraticCurveTo(-w1 * 0.58, len * 0.45, -w2 / 2, len - w2 * 0.35);
      ctx.quadraticCurveTo(-w2 * 0.4, len, 0, len);
      ctx.quadraticCurveTo(w2 * 0.4, len, w2 / 2, len - w2 * 0.35);
      ctx.quadraticCurveTo(w1 * 0.58, len * 0.45, w1 / 2, 0);
      ctx.closePath();
    };
    if (shadow) {
      ctx.save(); ctx.translate(3, 5); ctx.fillStyle = C.rgba(PAL.ink, 0.13); path(); ctx.fill(); ctx.restore();
    }
    path();
    ctx.fillStyle = fill; ctx.fill();
    if (edgeCol) { ctx.strokeStyle = edgeCol; ctx.lineWidth = 2.2; ctx.stroke(); }
    ctx.restore();
    return [x2, y2];
  }

  function bangle(ctx, x, y, r, col = V.gold) {
    ctx.save();
    ctx.strokeStyle = V.goldD; ctx.lineWidth = r * 0.55;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.fillStyle = C.rgba(V.goldL, 0.85);
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.18, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function hand(ctx, x, y, s, rot, side, open = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s * (side < 0 ? -1 : 1), s);
    // palm
    paper(ctx, () => roundRectPath(ctx, -11, -13, 22, 28, 7), {
      fill: V.skin, edge: edge(0.55), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.15), sx: 2, sy: 4,
    });
    // four fingers, fanned; the open hand is what says abhaya/varada
    const fan = open ? 0.16 : 0.02;
    for (let i = 0; i < 4; i += 1) {
      const a = (i - 1.5) * fan;
      ctx.save();
      ctx.translate(-7.5 + i * 5, 12);
      ctx.rotate(a);
      paper(ctx, () => roundRectPath(ctx, -2.4, 0, 4.8, 17 - Math.abs(i - 1.5) * 1.6, 2.4), {
        fill: V.skin, edge: edge(0.5), edgeW: 1.4,
      });
      ctx.restore();
    }
    // thumb
    paper(ctx, () => roundRectPath(ctx, side < 0 ? 9 : -15, -2, 6, 11, 3), {
      fill: V.skin, edge: edge(0.5), edgeW: 1.4,
    });
    // gold ring
    ctx.strokeStyle = V.gold; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-7, 2); ctx.lineTo(6, 2); ctx.stroke();
    ctx.restore();
  }

  function lotusFlower(ctx, x, y, r, t = 0, col = V.lotus) {
    const sway = Math.sin(t * 1.8) * 0.04;
    // back petals
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU + sway;
      paper(ctx, () => {
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.24, r * 0.42, r * 0.16, a, 0, TAU);
        ctx.closePath();
      }, { fill: i % 3 ? V.lotus : V.lotusL, edge: edge(0.38), edgeW: 1.2 });
    }
    // front cup
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - r * 0.72, y + r * 0.2);
      ctx.quadraticCurveTo(x - r * 0.5, y - r * 0.8, x, y - r * 0.5);
      ctx.quadraticCurveTo(x + r * 0.5, y - r * 0.8, x + r * 0.72, y + r * 0.2);
      ctx.quadraticCurveTo(x, y + r * 0.55, x - r * 0.72, y + r * 0.2);
      ctx.closePath();
    }, { fill: V.lotusL, edge: edge(0.4), edgeW: 1.4 });
    paper(ctx, () => blobPath(ctx, x, y - r * 0.08, r * 0.2, r * 0.16, 10, 0.02, 3), {
      fill: V.gold, edge: edge(0.35), edgeW: 1,
    });
    // stem
    ctx.strokeStyle = V.leafD; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, y + r * 0.25); ctx.quadraticCurveTo(x + 8, y + r * 0.9, x - 4, y + r * 1.3); ctx.stroke();
  }

  function lotusBase(ctx, y, r, t) {
    // three layers of cut petals, seen from above the water
    for (let layer = 0; layer < 3; layer += 1) {
      const rr = r * (1 - layer * 0.2);
      const col = layer === 0 ? V.cream : layer === 1 ? V.lotusL : V.lotus;
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * TAU + layer * 0.13 + Math.sin(t * 1.1 + i) * 0.012;
        paper(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(Math.cos(a - 0.2) * rr * 0.9, Math.sin(a - 0.2) * rr * 0.38, Math.cos(a) * rr, Math.sin(a) * rr * 0.42);
          ctx.quadraticCurveTo(Math.cos(a + 0.2) * rr * 0.9, Math.sin(a + 0.2) * rr * 0.38, 0, 0);
          ctx.closePath();
        }, { fill: col, edge: edge(0.38), edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.12), sx: 3, sy: 5 });
      }
    }
    paper(ctx, () => blobPath(ctx, 0, 0, r * 0.28, r * 0.12, 18, 0.02, 7), {
      fill: V.gold, edge: edge(0.4), edgeW: 1.4,
    });
  }

  function drawFace(ctx, x, y, t, o) {
    const f = o.face || {};
    const eyes = f.eyes || "soft";
    const mouth = f.mouth || "smile";
    const blink = Math.sin(t * 1.7) > 0.985 ? 0.1 : 1;
    // face
    paper(ctx, () => blobPath(ctx, x, y, 54, 66, 28, 0.02, 4), {
      fill: V.skin, edge: edge(0.55), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.16), sx: 3, sy: 5,
    });
    // cheeks
    ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = V.sariL;
    ctx.beginPath(); ctx.ellipse(x - 30, y + 14, 11, 6, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 30, y + 14, 11, 6, 0, 0, TAU); ctx.fill(); ctx.restore();
    // brows
    ctx.strokeStyle = V.kohl; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + s * 12, y - 16);
      ctx.quadraticCurveTo(x + s * 23, y - 24, x + s * 34, y - 17);
      ctx.stroke();
    }
    // eyes — almond, kohl, warm iris
    for (const s of [-1, 1]) {
      const ex = x + s * 22;
      const open = eyes === "closed" ? 0.05 : eyes === "half" ? 0.55 : eyes === "wide" ? 1.15 : 0.9;
      ctx.save();
      ctx.translate(ex, y - 2);
      ctx.scale(1, open * blink);
      ctx.fillStyle = V.cream; ctx.strokeStyle = V.kohl; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, 0, 16, 9, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6B3B1E"; ctx.beginPath(); ctx.arc(2, 0, 5.5, 0, TAU); ctx.fill();
      ctx.fillStyle = V.kohl; ctx.beginPath(); ctx.arc(2, 0, 2.8, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFFFFF", 0.85); ctx.beginPath(); ctx.arc(0, -2, 1.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = V.kohl; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(-16, -2); ctx.quadraticCurveTo(0, -13, 16, -2); ctx.stroke();
      ctx.restore();
    }
    // nose
    ctx.strokeStyle = C.rgba(V.skinD, 0.85); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 2, y + 4); ctx.quadraticCurveTo(x - 5, y + 14, x + 2, y + 15); ctx.stroke();
    // lips
    ctx.fillStyle = V.sariD;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 30);
    ctx.quadraticCurveTo(x, y + (mouth === "o" ? 22 : 26), x + 14, y + 30);
    ctx.quadraticCurveTo(x, y + (mouth === "smile" ? 40 : 34), x - 14, y + 30);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1; ctx.stroke();
    // bindi
    ctx.fillStyle = V.sari; ctx.beginPath(); ctx.arc(x, y - 30, 4.5, 0, TAU); ctx.fill();
  }

  function drawCrown(ctx, x, y, t) {
    // three gold points, a band, and a small gem
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - 58, y);
      ctx.lineTo(x - 46, y - 54);
      ctx.lineTo(x - 26, y - 20);
      ctx.lineTo(x - 10, y - 78);
      ctx.lineTo(x + 4, y - 22);
      ctx.lineTo(x + 26, y - 58);
      ctx.lineTo(x + 58, y);
      ctx.lineTo(x + 50, y + 18);
      ctx.lineTo(x - 50, y + 18);
      ctx.closePath();
    }, { fill: V.gold, edge: edge(0.6), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5 });
    ctx.fillStyle = V.sari; ctx.beginPath(); ctx.arc(x, y - 34, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = V.goldL; ctx.beginPath(); ctx.arc(x - 34, y - 10, 3.5, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 34, y - 10, 3.5, 0, TAU); ctx.fill();
    // side hairpins
    for (const s of [-1, 1]) {
      ctx.strokeStyle = V.goldD; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + s * 52, y + 2); ctx.lineTo(x + s * 68, y + 18); ctx.stroke();
      ctx.fillStyle = V.gold; ctx.beginPath(); ctx.arc(x + s * 70, y + 20, 4, 0, TAU); ctx.fill();
    }
  }

  function drawHalo(ctx, x, y, t) {
    ctx.save();
    ctx.strokeStyle = C.rgba(V.gold, 0.85); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y, 112, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.strokeStyle = C.rgba(V.goldL, 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 101, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    for (let i = 0; i < 10; i += 1) {
      const a = Math.PI * (1.18 + i * 0.072);
      ctx.strokeStyle = C.rgba(V.gold, 0.8); ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 116, y + Math.sin(a) * 116);
      ctx.lineTo(x + Math.cos(a) * 130, y + Math.sin(a) * 130);
      ctx.stroke();
      ctx.fillStyle = C.rgba(V.goldL, 0.9);
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * 134, y + Math.sin(a) * 134, 2.2, 0, TAU); ctx.fill();
    }
    // prabhavali finial
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 136);
      ctx.quadraticCurveTo(x, y - 168, x + 8, y - 136);
      ctx.quadraticCurveTo(x, y - 148, x - 8, y - 136);
      ctx.closePath();
    }, { fill: V.gold, edge: edge(0.5), edgeW: 1.4 });
    ctx.restore();
  }

  function drawHair(ctx, x, y, t, sway) {
    // back hair
    paper(ctx, () => blobPath(ctx, x, y + 4, 64, 74, 22, 0.03, 8), {
      fill: V.hair, edge: edge(0.6), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 6,
    });
    // side locks
    for (const s of [-1, 1]) {
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(x + s * 48, y - 26);
        ctx.quadraticCurveTo(x + s * 70, y + 20 + sway, x + s * 54, y + 92 + sway);
        ctx.quadraticCurveTo(x + s * 38, y + 34, x + s * 34, y - 16);
        ctx.closePath();
      }, { fill: V.hairL, edge: edge(0.5), edgeW: 1.8 });
    }
    // bun
    paper(ctx, () => blobPath(ctx, x, y + 80, 32, 24, 18, 0.03, 12), {
      fill: V.hair, edge: edge(0.5), edgeW: 2,
    });
    for (let i = 0; i < 3; i += 1) {
      ctx.strokeStyle = C.rgba(V.goldL, 0.8); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y + 80, 20 - i * 4, 0.2, Math.PI - 0.2); ctx.stroke();
    }
  }

  function drawJewels(ctx, x, y) {
    // necklace
    ctx.strokeStyle = V.gold; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y + 24, 46, 0.15, Math.PI - 0.15); ctx.stroke();
    for (let i = 0; i < 7; i += 1) {
      const a = 0.2 + (i / 6) * (Math.PI - 0.4);
      ctx.fillStyle = i % 2 ? V.sari : V.goldL;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * 47, y + 24 + Math.sin(a) * 47, 3.4, 0, TAU); ctx.fill();
    }
    // waist belt
    paper(ctx, () => roundRectPath(ctx, x - 62, y + 262, 124, 22, 6), {
      fill: V.gold, edge: edge(0.5), edgeW: 2,
    });
    ctx.fillStyle = V.sariD; ctx.beginPath(); ctx.arc(x, y + 273, 5, 0, TAU); ctx.fill();
  }

  function drawLakshmiV2(ctx, x, y, s, o = {}) {
    const t = o.t || 0;
    const pose = o.poseKey || "stand";
    const phase = C.clamp(o.face?.phase ?? (o.phase === undefined ? 1 : o.phase));
    const handOpen = o.face?.handOpen ?? o.handOpen;
    const flip = o.flip || 1;
    const breathe = Math.sin(t * 1.35) * 3;
    const sway = Math.sin(t * 0.95) * 3;
    const headTurn = pose === "turn" ? Math.sin(t * 0.8) * 0.18 : Math.sin(t * 0.7) * 0.05;
    const armLift = pose === "rise" ? 0.35 + 0.65 * phase : pose === "lower" ? 0.35 : pose === "offer" ? 0.72 : 1;
    const openPalm = pose === "bless" || pose === "open" || pose === "offer" || pose === "rise";
    const lean = pose === "offer" ? 0.03 : pose === "rise" ? -0.02 : 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * flip, s);

    // lotus the goddess stands in
    lotusBase(ctx, 8 + breathe * 0.3, 235, t);

    // body lean / breath
    ctx.save();
    ctx.rotate(lean);
    ctx.translate(sway * 0.2, breathe);

    // feet and anklets
    for (const [side, fx] of [[-1, -38], [1, 38]]) {
      // Publish the leg intent for the aperture/rig probe; the drawing keeps
      // its own simple boots, but the solve is the foot the pose asks for.
      const sol = solveLeg(side * 26, -278, fx, -8, 148, 148, side);
      limb(ctx, side * 26, -278, 148, 30, 24, sol.hipAngle, V.sariD, edge(0.5), false);
      limb(ctx, sol.kneeX, sol.kneeY, 148, 24, 18, sol.shinAngle, V.sariD, edge(0.5), false);
      paper(ctx, () => roundRectPath(ctx, fx - 16, -22, 30, 22, 9), {
        fill: V.skin, edge: edge(0.55), edgeW: 2,
      });
      ctx.strokeStyle = V.gold; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(fx, -22, 16, 0.1, Math.PI - 0.1); ctx.stroke();
      void side;
    }

    // skirt: red with a gold border and pleats
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-58, -292);
      ctx.quadraticCurveTo(-92, -150, -128, -10);
      ctx.quadraticCurveTo(0, 14, 128, -10);
      ctx.quadraticCurveTo(92, -150, 58, -292);
      ctx.closePath();
    }, { fill: V.sari, edge: edge(0.6), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 9 });
    // pleats
    for (let i = -2; i <= 2; i += 1) {
      ctx.strokeStyle = C.rgba(V.sariD, 0.8); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(i * 22, -270); ctx.quadraticCurveTo(i * 34, -140, i * 48, -8); ctx.stroke();
    }
    // gold hem
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-128, -10);
      ctx.quadraticCurveTo(0, 14, 128, -10);
      ctx.lineTo(124, -34);
      ctx.quadraticCurveTo(0, -10, -124, -34);
      ctx.closePath();
    }, { fill: V.gold, edge: edge(0.5), edgeW: 2 });

    // bodice
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-60, -292);
      ctx.quadraticCurveTo(-72, -380, -54, -452);
      ctx.quadraticCurveTo(0, -470, 54, -452);
      ctx.quadraticCurveTo(72, -380, 60, -292);
      ctx.closePath();
    }, { fill: V.sari, edge: edge(0.6), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.16), sx: 4, sy: 7 });
    // sari pallu across the torso
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-48, -450);
      ctx.quadraticCurveTo(30, -420, 62, -300);
      ctx.lineTo(34, -288);
      ctx.quadraticCurveTo(0, -398, -58, -424);
      ctx.closePath();
    }, { fill: V.goldL, edge: edge(0.45), edgeW: 2 });
    ctx.strokeStyle = C.rgba(V.goldD, 0.8); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-44, -436); ctx.quadraticCurveTo(24, -404, 52, -308); ctx.stroke();
    drawJewels(ctx, 0, -292);

    // neck
    paper(ctx, () => roundRectPath(ctx, -18, -492, 36, 52, 10), {
      fill: V.skinD, edge: edge(0.45), edgeW: 2,
    });

    // upper arms, behind the torso and head
    const shoulders = [-52, 52];
    for (const side of [-1, 1]) {
      const sx = shoulders[side < 0 ? 0 : 1];
      const sy = -438 + breathe;
      const lift = armLift;
      const elbow = [sx + side * 118 * lift, sy - 96 * lift];
      const wrist = [sx + side * 190 * lift, sy - 222 * lift];
      tapered(ctx, sx, sy, elbow[0], elbow[1], 30, 22, V.sari, edge(0.5));
      bangle(ctx, elbow[0], elbow[1], 12);
      tapered(ctx, elbow[0], elbow[1], wrist[0], wrist[1], 22, 15, V.sari, edge(0.5));
      bangle(ctx, wrist[0], wrist[1], 10);
      hand(ctx, wrist[0], wrist[1], 1.15, side * -0.25, side, true);
      // lotus in the upper hand
      lotusFlower(ctx, wrist[0] + side * 10, wrist[1] - 38, 44, t + side, V.lotus);
      rigAnchor(ctx, side < 0 ? "hand-upper-left" : "hand-upper-right", wrist[0], wrist[1]);
    }

    // head: hair, face, crown, halo
    const headY = -548 + breathe * 0.4;
    drawHalo(ctx, 0, headY, t);
    drawHair(ctx, 0, headY, t, sway);
    ctx.save();
    ctx.translate(headTurn * 24, 0);
    drawFace(ctx, 0, headY, t, o);
    drawCrown(ctx, 0, headY - 58, t);
    rigAnchor(ctx, "face", 0, headY, 54, 66);
    rigAnchor(ctx, "head", 0, headY - 10, 54, 66);
    rigAnchor(ctx, "hair", 0, headY + 30, 64, 74);
    // earrings
    for (const side of [-1, 1]) {
      ctx.strokeStyle = V.gold; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(side * 50, headY + 8, 9, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.fillStyle = V.sari; ctx.beginPath(); ctx.arc(side * 50, headY + 18, 4, 0, TAU); ctx.fill();
    }
    ctx.restore();

    // lower arms, in front
    for (const side of [-1, 1]) {
      const sx = shoulders[side < 0 ? 0 : 1];
      const sy = -420 + breathe;
      let elbow = [sx + side * 112, sy + 22];
      let wrist = [sx + side * 198, sy + 6];
      if (pose === "offer") { wrist = [sx + side * 150, sy + 80]; elbow = [sx + side * 96, sy + 40]; }
      if (pose === "bless" && side > 0) { wrist = [sx + 150, sy - 30]; elbow = [sx + 90, sy - 18]; }
      if (pose === "turn") { wrist = [sx + side * 120, sy + 46]; elbow = [sx + side * 80, sy + 8]; }
      if (pose === "rise") { wrist = [sx + side * 160 * phase, sy + 40 - 60 * phase]; elbow = [sx + side * 90, sy + 20]; }
      tapered(ctx, sx, sy, elbow[0], elbow[1], 28, 20, V.sari, edge(0.5));
      bangle(ctx, elbow[0], elbow[1], 11);
      tapered(ctx, elbow[0], elbow[1], wrist[0], wrist[1], 20, 14, V.sari, edge(0.5));
      bangle(ctx, wrist[0], wrist[1], 9);
      hand(ctx, wrist[0], wrist[1], 1.25, side * 0.15, side, handOpen === undefined ? openPalm : handOpen > 0.5);
      if (pose === "offer") {
        // a small gold coin in the giving palm
        ctx.fillStyle = V.gold; ctx.strokeStyle = V.goldD; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wrist[0], wrist[1] - 18, 10, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = C.rgba(V.goldL, 0.8); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(wrist[0], wrist[1] - 18, 5, 0, TAU); ctx.stroke();
      }
      rigAnchor(ctx, side < 0 ? "hand-left" : "hand-right", wrist[0], wrist[1]);
    }

    rigAnchor(ctx, "chest", 0, -380);
    rigAnchor(ctx, "waist", 0, -280);
    rigAnchor(ctx, "foot-left", -38, -8);
    rigAnchor(ctx, "foot-right", 38, -8);

    ctx.restore(); // lean / breathe
    ctx.restore();
  }

  window.CHARACTERS = window.CHARACTERS || {};
  window.CHARACTERS["lakshmi-v2@0.1.0"] = function (ctx, x, y, s, o = {}) {
    drawLakshmiV2(ctx, x, y, s, o);
  };
})();
