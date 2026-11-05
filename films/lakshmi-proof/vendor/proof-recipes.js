/* Fresh proof scenes for Lakshmi and the First Lamp.
 *
 * Nothing here is a re-use of the 60 s film's scenes. The construction is the
 * pack's (cut paper, torn edges, halftone, one hard key); the staging is new:
 * a village street with roofs and doorways, a river with ghats and a lotus,
 * a real rangoli, a brass thali, and a four-armed goddess built in
 * `lakshmi-v2.js`.
 */
(function () {
  const C2 = {
    night: "#1A1B26",
    indigo: "#232638",
    teal: "#2A4A4A",
    tealD: "#182E30",
    water: "#24444A",
    ochre: "#D8C49A",
    ochreD: "#C2A878",
    terra: "#B98A6A",
    terraD: "#8A5A4A",
    cream: "#FFF3DC",
    paper: "#F2E8D5",
    gold: "#E2C27A",
    goldD: "#B97A18",
    goldL: "#F2E0B8",
    red: "#B85A4A",
    redD: "#7E2E26",
    green: "#0D6C6C",
    greenD: "#064A4A",
    ink: "#120F1E",
    ink2: "#2A2340",
  };
  const V = () => window.LAKSHMI_V2 || {};

  function edge(a = 0.5) { return C.rgba(C2.ink, a); }

  function sky(ctx, top = C2.night, bottom = C2.indigo) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top);
    g.addColorStop(0.62, bottom);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function starField(ctx, t, n = 70, maxY = 560) {
    for (let i = 0; i < n; i += 1) {
      const x = (i * 233 + 41) % W;
      const y = (i * 97 + 31) % maxY;
      const r = 1 + (i % 3) * 0.7;
      ctx.fillStyle = C.rgba(C2.cream, 0.2 + 0.55 * C.hash(i) * (0.7 + 0.3 * Math.sin(t * 1.3 + i)));
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
  }

  function moon(ctx, x, y, r, t) {
    paper(ctx, () => blobPath(ctx, x, y, r, r, 28, 0.015, 11), {
      fill: C2.goldL, edge: C.rgba(C2.ink, 0.28), edgeW: 2,
      shadow: C.rgba(C2.gold, 0.12), sx: 0, sy: 0,
    });
    ctx.save();
    ctx.globalAlpha = 0.18 + 0.04 * Math.sin(t * 1.2);
    ctx.fillStyle = C2.goldL;
    ctx.beginPath(); ctx.arc(x, y, r * 1.55, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function temple(ctx, x, y, s, col = C2.ink2) {
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - 60 * s, y);
      ctx.lineTo(x - 38 * s, y - 90 * s);
      ctx.lineTo(x - 20 * s, y - 80 * s);
      ctx.lineTo(x - 10 * s, y - 150 * s);
      ctx.lineTo(x, y - 185 * s);
      ctx.lineTo(x + 10 * s, y - 150 * s);
      ctx.lineTo(x + 20 * s, y - 80 * s);
      ctx.lineTo(x + 38 * s, y - 90 * s);
      ctx.lineTo(x + 60 * s, y);
      ctx.closePath();
    }, { fill: col, edge: C.rgba(C2.cream, 0.15), edgeW: 1.5 });
    paper(ctx, () => tornRectPath(ctx, x - 90 * s, y, 180 * s, 46 * s, 8, 3), {
      fill: col, edge: C.rgba(C2.cream, 0.12), edgeW: 1.2,
    });
    ctx.fillStyle = C2.gold;
    ctx.beginPath(); ctx.arc(x, y - 150 * s, 4 * s, 0, TAU); ctx.fill();
  }

  function tiles(ctx, x, y, w, h, col, rows = 4) {
    // A pitched roof made of overlapping half-round tiles.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w * 0.12, y - h);
    ctx.lineTo(x + w * 0.88, y - h);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = col; ctx.fillRect(x, y - h, w, h);
    for (let r = 0; r < rows; r += 1) {
      const yy = y - h + (r / rows) * h;
      const step = w / 14;
      for (let i = -1; i < 15; i += 1) {
        const xx = x + i * step + (r % 2) * step * 0.5;
        ctx.strokeStyle = C.rgba(C2.ink, 0.28);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(xx, yy + step * 0.45, step * 0.55, Math.PI, TAU); ctx.stroke();
      }
    }
    ctx.restore();
    // ridge and edge
    ctx.strokeStyle = C.rgba(C2.ink, 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x + w * 0.12, y - h); ctx.lineTo(x + w * 0.88, y - h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * 0.12, y - h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w * 0.88, y - h); ctx.stroke();
  }

  function house(ctx, x, y, w, h, body, roofCol, lit, t, o = {}) {
    paper(ctx, () => tornRectPath(ctx, x, y - h, w, h, 12, 7 + Math.round(x)), {
      fill: body, edge: edge(0.45), edgeW: 2.4, shadow: C.rgba(C2.ink, 0.18), sx: 8, sy: 12,
    });
    tiles(ctx, x - 24, y - h + 8, w + 48, 120, roofCol, 4);
    // door
    const dw = o.doorW ?? Math.min(110, w * 0.32);
    const dx = x + w * 0.16;
    paper(ctx, () => tornRectPath(ctx, dx, y - h * 0.58, dw, h * 0.58, 6, 11), {
      fill: lit ? C2.goldL : C2.ink2, edge: edge(0.55), edgeW: 2,
    });
    // window
    const wx = x + w * 0.62;
    paper(ctx, () => tornRectPath(ctx, wx, y - h * 0.5, w * 0.18, h * 0.22, 4, 17), {
      fill: lit ? C2.gold : C2.ink2, edge: edge(0.5), edgeW: 1.6,
    });
    if (lit) {
      ctx.save(); ctx.globalAlpha = 0.12 + 0.05 * Math.sin(t * 2.2 + x);
      ctx.fillStyle = C2.goldL;
      ctx.beginPath(); ctx.arc(wx + w * 0.09, y - h * 0.39, w * 0.22, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // hanging lamp at the door
    const lx = dx + dw * 0.5;
    ctx.strokeStyle = C2.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx, y - h * 0.58); ctx.lineTo(lx, y - h * 0.66); ctx.stroke();
    smallLamp(ctx, lx, y - h * 0.68, 0.75, lit, t);
    // threshold rangoli
    if (o.rangoli !== false) {
      ctx.save(); ctx.globalAlpha = 0.55;
      for (let i = 0; i < 8; i += 1) {
        ctx.strokeStyle = i % 2 ? C2.red : C2.gold;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(lx, y + 16, 14 + i * 5, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
  }

  function smallLamp(ctx, x, y, s, lit, t) {
    paper(ctx, () => blobPath(ctx, x, y, 12 * s, 6 * s, 10, 0.03, 3), {
      fill: C2.terra, edge: edge(0.5), edgeW: 1.4,
    });
    if (!lit) return;
    const fl = 1 + Math.sin(t * 6.1 + x) * 0.16;
    ctx.save(); ctx.globalAlpha = 0.2;
    ctx.fillStyle = C2.goldL;
    ctx.beginPath(); ctx.arc(x, y - 8 * s, 24 * s, 0, TAU); ctx.fill(); ctx.restore();
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x, y - 22 * s * fl);
      ctx.quadraticCurveTo(x - 7 * s, y - 4 * s, x, y - 1 * s);
      ctx.quadraticCurveTo(x + 7 * s, y - 4 * s, x, y - 22 * s * fl);
      ctx.closePath();
    }, { fill: C2.gold, edge: C.rgba(C2.redD, 0.65), edgeW: 1.2 });
  }

  function diya(ctx, x, y, s, lit, t) {
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - 34 * s, y);
      ctx.quadraticCurveTo(x, y + 28 * s, x + 34 * s, y);
      ctx.quadraticCurveTo(x, y + 8 * s, x - 34 * s, y);
      ctx.closePath();
    }, { fill: C2.terra, edge: edge(0.65), edgeW: 2.4 * s, shadow: C.rgba(C2.ink, 0.24), sx: 4, sy: 7 });
    paper(ctx, () => blobPath(ctx, x, y + 20 * s, 19 * s, 6 * s, 12, 0.03, 2), {
      fill: C2.cream, edge: edge(0.4), edgeW: 1.2,
    });
    if (!lit) return;
    const fl = 1 + Math.sin(t * 6.7 + x * 0.02) * 0.14;
    ctx.save(); ctx.globalAlpha = 0.3;
    ctx.fillStyle = C2.goldL;
    ctx.beginPath(); ctx.arc(x, y - 12 * s, 48 * s, 0, TAU); ctx.fill(); ctx.restore();
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x, y - 40 * s * fl);
      ctx.quadraticCurveTo(x - 14 * s, y - 8 * s, x, y - 1 * s);
      ctx.quadraticCurveTo(x + 14 * s, y - 8 * s, x, y - 40 * s * fl);
      ctx.closePath();
    }, { fill: C2.gold, edge: C.rgba(C2.redD, 0.7), edgeW: 1.4 });
    paper(ctx, () => blobPath(ctx, x, y - 16 * s, 4 * s, 9 * s * fl, 8, 0.02, 3), {
      fill: C2.cream, edge: null,
    });
  }

  function garland(ctx, x1, y1, x2, y2, t, n = 14) {
    ctx.strokeStyle = C.rgba(C2.ink, 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + 28, x2, y2); ctx.stroke();
    for (let i = 0; i < n; i += 1) {
      const p = (i + 0.5) / n;
      const x = x1 + (x2 - x1) * p;
      const y = y1 + (y2 - y1) * p + Math.sin(p * Math.PI) * 26;
      paper(ctx, () => blobPath(ctx, x, y, 9, 9, 8, 0.04, i), {
        fill: i % 3 === 0 ? C2.gold : i % 3 === 1 ? C2.red : C2.terra,
        edge: edge(0.4), edgeW: 1,
      });
    }
  }

  function humanHand(ctx, x, y, s, rot, open, skin = "#B9784D", side = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * side, s);
    paper(ctx, () => roundRectPath(ctx, -11, -12, 23, 27, 7), {
      fill: skin, edge: edge(0.5), edgeW: 2, shadow: C.rgba(C2.ink, 0.14), sx: 2, sy: 4,
    });
    for (let i = 0; i < 4; i += 1) {
      const a = (i - 1.5) * (open ? 0.13 : 0.02);
      ctx.save(); ctx.translate(-7.4 + i * 5, 13); ctx.rotate(a);
      const len = open ? 18 - Math.abs(i - 1.5) * 1.5 : 8 - Math.abs(i - 1.5) * 0.8;
      paper(ctx, () => roundRectPath(ctx, -2.6, 0, 5.2, len, 2.5), {
        fill: skin, edge: edge(0.45), edgeW: 1.2,
      });
      ctx.restore();
    }
    paper(ctx, () => roundRectPath(ctx, side < 0 ? 9 : -15, -2, 6, 12, 3), {
      fill: skin, edge: edge(0.45), edgeW: 1.2,
    });
    ctx.restore();
  }

  function wristBangle(ctx, x, y, r, col = C2.gold) {
    ctx.save();
    ctx.strokeStyle = C2.goldD; ctx.lineWidth = r * 0.55;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function child(ctx, x, y, s, t, walk = 0, flip = 1) {
    const step = 0;
    const bob = Math.abs(Math.sin(walk)) * 3;
    ctx.save(); ctx.translate(x, y - bob); ctx.rotate(Math.sin(walk) * 0.035); ctx.scale(s * flip, s);
    // planted feet, drawn with the same leg solve the audit reads
    for (const [side] of [[-1], [1]]) {
      const sol = solveLeg(side * 10, -70, side * 10, -4, 40, 38, side);
      limb(ctx, side * 10, -70, 40, 12, 10, sol.hipAngle, "#B9784D", edge(0.5), false);
      limb(ctx, sol.kneeX, sol.kneeY, 38, 10, 8, sol.shinAngle, "#B9784D", edge(0.5), false);
      ctx.strokeStyle = C2.ink; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(side * 10, -4); ctx.lineTo(side * 10 + 8, 0); ctx.stroke();
    }
    // skirt
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(-24, -84); ctx.lineTo(24, -84); ctx.lineTo(36, -28); ctx.lineTo(-36, -28); ctx.closePath();
    }, { fill: C2.gold, edge: edge(0.5), edgeW: 2, shadow: C.rgba(C2.ink, 0.14), sx: 3, sy: 5 });
    // torso / shawl
    paper(ctx, () => roundRectPath(ctx, -26, -140, 52, 62, 12), {
      fill: C2.red, edge: edge(0.55), edgeW: 2.2, shadow: C.rgba(C2.ink, 0.16), sx: 3, sy: 5,
    });
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(-30, -136); ctx.lineTo(0, -96); ctx.lineTo(30, -136); ctx.lineTo(14, -146); ctx.lineTo(0, -118); ctx.lineTo(-14, -146); ctx.closePath();
    }, { fill: C2.gold, edge: edge(0.4), edgeW: 1.4 });
    // arms
    ctx.strokeStyle = "#B9784D"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-24, -128); ctx.lineTo(-34, -94); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, -128); ctx.lineTo(40, -112); ctx.stroke();
    // head
    paper(ctx, () => blobPath(ctx, 0, -166, 24, 26, 16, 0.03, 5), {
      fill: "#B9784D", edge: edge(0.5), edgeW: 2,
    });
    // hair
    paper(ctx, () => blobPath(ctx, 0, -176, 26, 22, 14, 0.03, 6), {
      fill: C2.ink, edge: edge(0.45), edgeW: 1.6,
    });
    // eyes
    ctx.fillStyle = C2.ink;
    ctx.beginPath(); ctx.arc(-8, -166, 2.2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -166, 2.2, 0, TAU); ctx.fill();
    // the diya she carries
    diya(ctx, 40, -118, 0.55, true, t);
    rigAnchor(ctx, "face", 0, -166, 24, 26);
    rigAnchor(ctx, "head", 0, -176, 26, 22);
    rigAnchor(ctx, "hair", 0, -184, 26, 22);
    rigAnchor(ctx, "chest", 0, -112, 26, 30);
    rigAnchor(ctx, "waist", 0, -80, 24, 24);
    rigAnchor(ctx, "hand-left", -34, -94, 16, 22);
    rigAnchor(ctx, "hand-right", 40, -112, 16, 22);
    rigAnchor(ctx, "foot-left", -10, -4, 10, 8);
    rigAnchor(ctx, "foot-right", 10, -4, 10, 8);
    ctx.restore();
  }

  function person(ctx, x, y, s, col, t, flip = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
    paper(ctx, () => roundRectPath(ctx, -22, -120, 44, 96, 10), {
      fill: col, edge: edge(0.5), edgeW: 2, shadow: C.rgba(C2.ink, 0.15), sx: 3, sy: 6,
    });
    paper(ctx, () => blobPath(ctx, 0, -144, 21, 23, 14, 0.03, 5), {
      fill: "#B9784D", edge: edge(0.45), edgeW: 1.8,
    });
    paper(ctx, () => blobPath(ctx, 0, -154, 23, 18, 12, 0.03, 6), {
      fill: C2.ink, edge: edge(0.4), edgeW: 1.4,
    });
    ctx.fillStyle = C2.ink;
    ctx.beginPath(); ctx.arc(-6, -145, 1.8, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -145, 1.8, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function water(ctx, y, t, rows = 9) {
    ctx.save();
    for (let i = 0; i < rows; i += 1) {
      ctx.strokeStyle = C.rgba(C2.cream, 0.08 + i * 0.006);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -40; x <= W + 40; x += 35) {
        const yy = y + i * 26 + Math.sin((x + t * 38) * 0.009 + i * 1.7) * (4 + i);
        if (x === -40) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function rangoli(ctx, cx, cy, r, progress, t) {
    ctx.save();
    ctx.translate(cx, cy);
    // faint floor circle
    ctx.fillStyle = C.rgba(C2.cream, 0.06);
    ctx.beginPath(); ctx.arc(0, 0, r * 1.18, 0, TAU); ctx.fill();
    const parts = [
      [0.2, C2.cream, 6],
      [0.4, C2.red, 8],
      [0.6, C2.gold, 10],
      [0.8, C2.green, 12],
      [1.0, C2.cream, 16],
    ];
    for (let i = 0; i < parts.length; i += 1) {
      const [pr, col, n] = parts[i];
      if (progress < pr * 0.55) continue;
      const rr = r * pr;
      ctx.strokeStyle = col; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.stroke();
      for (let j = 0; j < n; j += 1) {
        const a = (j / n) * TAU + t * 0.04;
        const px = Math.cos(a) * rr;
        const py = Math.sin(a) * rr * 0.9;
        paper(ctx, () => blobPath(ctx, px, py, 10, 6, 8, 0.03, j + i * 17), {
          fill: j % 2 ? col : C2.goldL, edge: edge(0.35), edgeW: 1,
        });
      }
    }
    // eight large petals at the middle ring
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU + 0.2;
      ctx.save(); ctx.rotate(a);
      paper(ctx, () => {
        ctx.beginPath();
        ctx.ellipse(0, r * 0.52, r * 0.12, r * 0.24, 0, 0, TAU);
        ctx.closePath();
      }, { fill: i % 2 ? C2.red : C2.gold, edge: edge(0.35), edgeW: 1.4 });
      ctx.restore();
    }
    // dots and broken arcs around the rim
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * TAU;
      ctx.fillStyle = i % 3 ? C2.cream : C2.ink;
      ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.66, 4, 0, TAU); ctx.fill();
    }
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU + 0.12;
      ctx.strokeStyle = i % 2 ? C2.green : C2.red; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.88, a, a + 0.55); ctx.stroke();
    }
    // inner flower
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU;
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = i % 2 ? C2.red : C2.gold;
      ctx.beginPath(); ctx.ellipse(0, r * 0.16, r * 0.09, r * 0.22, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    diya(ctx, 0, 8, 1.3, true, t);
    ctx.restore();
  }

  function thali(ctx, x, y, s, t) {
    paper(ctx, () => blobPath(ctx, x, y, 170 * s, 54 * s, 28, 0.02, 5), {
      fill: C2.gold, edge: edge(0.6), edgeW: 3, shadow: C.rgba(C2.ink, 0.25), sx: 8, sy: 12,
    });
    paper(ctx, () => blobPath(ctx, x, y - 4, 148 * s, 42 * s, 26, 0.02, 6), {
      fill: C2.goldL, edge: C.rgba(C2.goldD, 0.8), edgeW: 2,
    });
    diya(ctx, x - 12, y - 12, 1.0, true, t);
    // marigolds
    for (let i = 0; i < 7; i += 1) {
      const a = -2.5 + i * 0.42;
      paper(ctx, () => blobPath(ctx, x + Math.cos(a) * 100 * s, y - 10 + Math.sin(a) * 28 * s, 13, 13, 8, 0.03, i), {
        fill: i % 2 ? C2.terra : C2.gold, edge: edge(0.4), edgeW: 1.2,
      });
    }
    // coconut and banana
    paper(ctx, () => blobPath(ctx, x + 96 * s, y - 42 * s, 28, 34, 14, 0.03, 14), {
      fill: "#8B5A2B", edge: edge(0.5), edgeW: 2,
    });
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(x - 112 * s, y - 20 * s);
      ctx.quadraticCurveTo(x - 170 * s, y - 70 * s, x - 94 * s, y - 58 * s);
      ctx.quadraticCurveTo(x - 100 * s, y - 30 * s, x - 112 * s, y - 20 * s); ctx.closePath();
    }, { fill: C2.gold, edge: C2.greenD, edgeW: 2 });
  }

  function poseAt(shot, who, lt, fallback = "stand") {
    let pose = fallback;
    for (const event of shot.direction?.events ?? []) {
      if (event.kind === "pose" && event.who === who && event.t <= lt + 1e-6) pose = event.pose || pose;
    }
    return pose;
  }

  function bigLotus(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.translate(cx, cy);
    // A ring of cut petals around the goddess; the centre stays open so her
    // skirt is not buried under the flower.
    for (let layer = 0; layer < 2; layer += 1) {
      const rr = r * (1 - layer * 0.16);
      for (let i = 0; i < 18; i += 1) {
        const a = (i / 18) * TAU + layer * 0.16 + Math.sin(t * 0.9 + i) * 0.015;
        const inner = 0.3 + layer * 0.04;
        paper(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(Math.cos(a - 0.09) * rr * inner, Math.sin(a - 0.09) * rr * inner * 0.42);
          ctx.quadraticCurveTo(
            Math.cos(a - 0.18) * rr * 0.78,
            Math.sin(a - 0.18) * rr * 0.32,
            Math.cos(a) * rr,
            Math.sin(a) * rr * 0.42,
          );
          ctx.quadraticCurveTo(
            Math.cos(a + 0.18) * rr * 0.78,
            Math.sin(a + 0.18) * rr * 0.32,
            Math.cos(a + 0.09) * rr * inner,
            Math.sin(a + 0.09) * rr * inner * 0.42,
          );
          ctx.closePath();
        }, {
          fill: layer === 0 ? C2.red : C2.terra,
          edge: edge(0.35), edgeW: 1.8,
          shadow: C.rgba(C2.ink, 0.12), sx: 3, sy: 5,
        });
      }
    }
    // a few front petals, larger
    for (let i = 0; i < 9; i += 1) {
      const a = Math.PI * 0.08 + (i / 8) * Math.PI * 0.84;
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.12) * r * 0.34, Math.sin(a - 0.12) * r * 0.16);
        ctx.quadraticCurveTo(Math.cos(a) * r * 0.96, Math.sin(a) * r * 0.5, Math.cos(a) * r * 1.12, Math.sin(a) * r * 0.58);
        ctx.quadraticCurveTo(Math.cos(a + 0.12) * r * 0.96, Math.sin(a + 0.12) * r * 0.5, Math.cos(a + 0.12) * r * 0.34, Math.sin(a + 0.12) * r * 0.16);
        ctx.closePath();
      }, { fill: i % 2 ? C2.red : C2.terra, edge: edge(0.38), edgeW: 2 });
    }
    ctx.restore();
  }

  function softVignette() {
    const g = ctx.createRadialGradient(W / 2, H / 2, 340, W / 2, H / 2, 1120);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, C.rgba(C2.ink, 0.5));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function framePaper() {
    // A print margin: the film is a paper object, not a full-bleed screen.
    const b = 100;
    ctx.fillStyle = "#F5B93F";
    ctx.fillRect(0, 0, W, b);
    ctx.fillRect(0, H - b, W, b);
    ctx.fillRect(0, 0, b, H);
    ctx.fillRect(W - b, 0, b, H);
    ctx.strokeStyle = C.rgba(C2.ink, 0.18); ctx.lineWidth = 3;
    ctx.strokeRect(b, b, W - b * 2, H - b * 2);
    // a few deckle ticks on the inner edge
    ctx.strokeStyle = C.rgba(C2.ink, 0.12); ctx.lineWidth = 2;
    for (let i = 0; i < 24; i += 1) {
      const x = b + (i / 23) * (W - b * 2);
      ctx.beginPath(); ctx.moveTo(x, b); ctx.lineTo(x + 8, b + 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, H - b); ctx.lineTo(x + 8, H - b - 7); ctx.stroke();
    }
  }

  function caption(shot, t) {
    // No paper cards. The proof is captioned in the SRT, not over the picture.
    void shot; void t;
  }

  // ---------------------------------------------------------------- s01
  function door(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, 860, 680, 0.06, t);
    beginCam(ctx);
    sky(ctx, C2.night, C2.indigo);
    starField(ctx, t, 80, 560);
    moon(ctx, 1530, 160, 96, t);
    temple(ctx, 170, 700, 0.9, "#1B2340");
    temple(ctx, 1780, 690, 0.7, "#1B2340");
    // side houses frame the doorway
    house(ctx, -40, 880, 390, 480, C2.terra, C2.ink2, false, t, { doorW: 90, rangoli: false });
    house(ctx, 1510, 880, 450, 470, C2.ochreD, C2.terraD, true, t, { doorW: 100 });
    // the house the camera is looking into
    paper(ctx, () => tornRectPath(ctx, 390, 560, 820, 390, 16, 21), {
      fill: C2.ochre, edge: edge(0.5), edgeW: 3, shadow: C.rgba(C2.ink, 0.22), sx: 9, sy: 14,
    });
    tiles(ctx, 350, 570, 900, 150, C2.terraD, 5);
    // the open door: a warm room, not a black rectangle
    paper(ctx, () => tornRectPath(ctx, 630, 660, 300, 300, 12, 7), {
      fill: C2.ink2, edge: edge(0.6), edgeW: 3, shadow: C.rgba(C2.ink, 0.25), sx: 8, sy: 12,
    });
    paper(ctx, () => tornRectPath(ctx, 650, 680, 260, 280, 10, 11), {
      fill: C2.redD, edge: C.rgba(C2.gold, 0.45), edgeW: 2,
    });
    const glow = ctx.createRadialGradient(780, 760, 20, 780, 760, 230);
    glow.addColorStop(0, C.rgba(C2.goldL, 0.55));
    glow.addColorStop(1, C.rgba(C2.goldL, 0));
    ctx.fillStyle = glow; ctx.fillRect(630, 660, 300, 300);
    // shelf and small shrine inside
    ctx.strokeStyle = C2.gold; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(690, 760); ctx.lineTo(870, 760); ctx.stroke();
    smallLamp(ctx, 780, 735, 1.0, true, t);
    paper(ctx, () => blobPath(ctx, 850, 800, 22, 26, 12, 0.03, 21), {
      fill: C2.gold, edge: edge(0.45), edgeW: 1.6,
    });
    // threshold step
    paper(ctx, () => tornRectPath(ctx, 600, 920, 360, 54, 12, 13), {
      fill: C2.gold, edge: edge(0.55), edgeW: 2.6, shadow: C.rgba(C2.ink, 0.2), sx: 5, sy: 8,
    });
    // garlands and lamps on the facade
    garland(ctx, 470, 600, 1130, 600, t, 20);
    smallLamp(ctx, 540, 620, 1.1, true, t);
    smallLamp(ctx, 1120, 620, 1.1, true, t);
    // street floor
    paper(ctx, () => tornRectPath(ctx, -40, 950, W + 80, 180, 20, 19), {
      fill: C2.ink2, edge: C.rgba(C2.cream, 0.16), edgeW: 3, shadow: C.rgba(C2.ink, 0.28), sx: 0, sy: 0,
    });
    // the first diya, large enough to be the subject
    const k = C.smooth(C.clamp((lt - 0.1) / 1.0));
    const k2 = C.smooth(C.clamp((lt - 1.4) / 0.8));
    diya(ctx, 800, 900, 2.0, true, t);
    // the child leans in
    child(ctx, 555 + 14 * k, 995, 1.35, t, lt * 1.6, 1);
    // the hand with the match, from the right
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * k;
    humanHand(ctx, 1165 + 24 * k2, 820, 2.1, -0.85, false, "#B9784D", 1);
    ctx.strokeStyle = C2.cream; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(1065 + 24 * k2, 790); ctx.lineTo(845, 880); ctx.stroke();
    ctx.fillStyle = C2.redD;
    ctx.beginPath(); ctx.arc(845, 880, 7, 0, TAU); ctx.fill();
    ctx.restore();
    // marigold and powder at the threshold
    for (let i = 0; i < 14; i += 1) {
      const x = 430 + i * 80 + Math.sin(t * 0.7 + i) * 5;
      paper(ctx, () => blobPath(ctx, x, 1000 + (i % 3) * 9, 8, 6, 8, 0.03, i), {
        fill: i % 2 ? C2.gold : C2.terra, edge: edge(0.3), edgeW: 1,
      });
    }
    for (let i = 0; i < 7; i += 1) {
      ctx.strokeStyle = i % 2 ? C2.red : C2.gold; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(800, 980, 22 + i * 9, 0, TAU); ctx.stroke();
    }
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.06);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  // ---------------------------------------------------------------- s02
  function street(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, W / 2 + 70, 650, 0.05, t);
    beginCam(ctx);
    sky(ctx, C2.night, C2.indigo);
    starField(ctx, t, 70, 520);
    moon(ctx, 260, 160, 74, t);
    // houses recede on both sides
    const row = [
      [-30, 900, 330, 430, C2.ochre, C2.terraD, true],
      [250, 820, 270, 330, C2.terra, C2.ink2, false],
      [470, 760, 230, 280, C2.ochreD, C2.terraD, true],
      [1250, 760, 230, 280, C2.terra, C2.ink2, true],
      [1440, 820, 270, 330, C2.ochre, C2.terraD, false],
      [1660, 900, 300, 430, C2.ochreD, C2.ink2, true],
    ];
    for (const [x, y, w, h, body, roof, lit] of row) house(ctx, x, y, w, h, body, roof, lit, t, { rangoli: false, doorW: 90 });
    // awnings over the near shops
    for (const [x, y, col] of [[-20, 820, C2.red], [1640, 820, C2.green]]) {
      paper(ctx, () => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 320, y); ctx.lineTo(x + 290, y + 70); ctx.lineTo(x + 30, y + 70); ctx.closePath();
      }, { fill: col, edge: edge(0.5), edgeW: 2.4 });
      for (let i = 0; i < 6; i += 1) {
        ctx.strokeStyle = C.rgba(C2.cream, 0.5); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x + 20 + i * 52, y + 4); ctx.lineTo(x + 32 + i * 52, y + 66); ctx.stroke();
      }
    }
    // street floor with a perspective line
    paper(ctx, () => tornRectPath(ctx, -60, 930, W + 120, 220, 24, 29), {
      fill: C2.ink2, edge: C.rgba(C2.cream, 0.16), edgeW: 3, shadow: C.rgba(C2.ink, 0.28), sx: 0, sy: 0,
    });
    ctx.strokeStyle = C.rgba(C2.cream, 0.14); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-20, 1010); ctx.quadraticCurveTo(960, 930, 1940, 1010); ctx.stroke();
    // lamps: two big foreground posts, a row behind
    for (const [x, h, s2] of [[300, 470, 1.7], [1620, 470, 1.7]]) {
      ctx.strokeStyle = C2.ink; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(x, 1000); ctx.lineTo(x, 1000 - h); ctx.stroke();
      smallLamp(ctx, x, 1000 - h - 18, s2, true, t);
      ctx.strokeStyle = C2.goldD; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x - 24, 1000 - h + 10); ctx.lineTo(x + 24, 1000 - h + 10); ctx.stroke();
    }
    for (let i = 0; i < 6; i += 1) {
      const x = 90 + i * 320;
      const lit = lt > 0.2 + i * 0.18;
      if (x === 300 || x === 1620) continue;
      ctx.strokeStyle = C2.ink; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(x, 930); ctx.lineTo(x, 760); ctx.stroke();
      smallLamp(ctx, x, 750, 1.1, lit, t);
    }
    // the child is the subject, large and walking
    const k = C.smooth(C.clamp(lt / d));
    const cx = 700 + k * 560;
    // a dark pocket around the child, so the small figure has a key
    const spot = ctx.createRadialGradient(cx, 830, 40, cx, 830, 380);
    spot.addColorStop(0, C.rgba(C2.ink, 0.65));
    spot.addColorStop(1, C.rgba(C2.ink, 0));
    ctx.fillStyle = spot; ctx.fillRect(cx - 420, 430, 840, 640);
    drawCharacter("ChildV2", cx, 1000, 1.4, "walk", 1, null, t, {
      face: { eyes: "wide", mouth: "smile", walk: lt * 9, phase: k },
    });
    // neighbours
    person(ctx, 210, 980, 1.15, C2.green, t, 1);
    person(ctx, 1660, 980, 1.05, C2.red, t, -1);
    person(ctx, 1450, 960, 0.9, C2.terra, t, -1);
    // floating petals, paper sparks
    for (let i = 0; i < 20; i += 1) {
      const x = (i * 149 + t * 48) % W;
      const y = 260 + ((i * 91 + t * 22) % 600);
      ctx.fillStyle = C.rgba(i % 2 ? C2.gold : C2.terra, 0.55);
      ctx.beginPath(); ctx.ellipse(x, y, 6, 3, t + i, 0, TAU); ctx.fill();
    }
    paperShards(ctx, W / 2, 760, t * 0.9, 18, [C2.cream, C2.gold, C2.terra], 760, 0.25, 31);
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.06);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  // ---------------------------------------------------------------- s03
  function river(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, W / 2, 520, 0.04, t);
    beginCam(ctx);
    sky(ctx, C2.night, C2.indigo);
    starField(ctx, t, 100, 560);
    moon(ctx, 1550, 150, 110, t);
    const haze = ctx.createLinearGradient(0, 430, 0, 760);
    haze.addColorStop(0, C.rgba(C2.cream, 0));
    haze.addColorStop(0.6, C.rgba(C2.cream, 0.2));
    haze.addColorStop(1, C.rgba(C2.cream, 0));
    ctx.fillStyle = haze; ctx.fillRect(0, 430, W, 330);
    temple(ctx, 200, 730, 1.05, "#151E36");
    temple(ctx, 1740, 720, 0.95, "#151E36");
    // stepped ghats at the waterline
    for (const [x, w, flip] of [[-40, 640, 1], [1280, 680, -1]]) {
      for (let i = 0; i < 5; i += 1) {
        paper(ctx, () => tornRectPath(ctx, x + i * 18, 700 + i * 16, w - i * 36, 28, 8, 5 + i), {
          fill: i % 2 ? "#101A30" : "#182844",
          edge: C.rgba(C2.cream, 0.12), edgeW: 1.5,
        });
      }
      void flip;
    }
    // water: a graded plane, waves and reflections
    const wg = ctx.createLinearGradient(0, 700, 0, H);
    wg.addColorStop(0, "#0E4A5A");
    wg.addColorStop(0.45, "#0B3A46");
    wg.addColorStop(1, C2.tealD);
    ctx.fillStyle = wg; ctx.fillRect(0, 700, W, H - 700);
    water(ctx, 750, t, 11);
    paperShards(ctx, W / 2, 760, t * 0.8, 18, [C2.cream, C2.goldL, "#F28AA6"], 520, 0.18, 77);
    for (let i = 0; i < 7; i += 1) {
      ctx.strokeStyle = C.rgba(C2.cream, 0.16 - i * 0.015);
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -40; x < W + 40; x += 40) {
        const y = 760 + i * 38 + Math.sin((x + t * 30) * 0.01 + i) * 10;
        if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // lotus leaves
    for (let i = 0; i < 16; i += 1) {
      const x = 40 + i * 124;
      const y = 780 + Math.sin(i * 1.7) * 46;
      paper(ctx, () => blobPath(ctx, x, y, 54, 18, 12, 0.03, 40 + i), {
        fill: i % 2 ? C2.greenD : C2.green, edge: edge(0.4), edgeW: 1.5,
      });
    }
    // she rises
    const k = C.smooth(C.clamp((lt - 0.15) / 1.8));
    const pose = poseAt(shot, "LakshmiV2", lt, "rise");
    // a dark pocket behind the figure; the gold and red then sit forward
    const pocket = ctx.createRadialGradient(W / 2, 640, 80, W / 2, 640, 520);
    pocket.addColorStop(0, C.rgba(C2.ink, 0.5));
    pocket.addColorStop(1, C.rgba(C2.ink, 0));
    ctx.fillStyle = pocket; ctx.fillRect(300, 0, 1320, 1080);
    drawCharacter("LakshmiV2", W / 2, 1008 - 30 * k, 0.72, pose, 1, null, t, {
      face: { eyes: "soft", mouth: "smile", phase: 1, handOpen: 0.35 + 0.65 * k },
    });
    // the giant flower opens around her feet
    bigLotus(ctx, W / 2, 1008, 380 * (0.7 + 0.3 * k) + Math.sin(t * 1.4) * 8, t);
    // ripples
    for (let i = 0; i < 5; i += 1) {
      const r = 180 + i * 70 + Math.sin(t * 1.1 + i) * 10;
      ctx.strokeStyle = C.rgba(C2.cream, 0.22 - i * 0.035); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(W / 2, 1012, r, r * 0.16, 0, 0, TAU); ctx.stroke();
    }
    // fireflies and petals
    for (let i = 0; i < 28; i += 1) {
      const x = 100 + (i * 173 + t * 24) % 1720;
      const y = 370 + (i * 71 + Math.sin(t * 1.4 + i) * 44) % 470;
      ctx.fillStyle = C.rgba(C2.goldL, 0.4 + 0.4 * Math.sin(t * 2 + i));
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill();
    }
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 149 + t * 18) % W;
      const y = 520 + ((i * 67 + t * 22) % 360);
      paper(ctx, () => blobPath(ctx, x, y, 14, 8, 8, 0.03, i), {
        fill: i % 2 ? "#F28AA6" : C2.cream, edge: edge(0.28), edgeW: 1,
      });
    }
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.05);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  // ---------------------------------------------------------------- s04
  function hands(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, W / 2, 560, 0.04, t);
    beginCam(ctx);
    // water and gold light behind the hands
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0A2540"); g.addColorStop(1, "#061A26");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    water(ctx, 900, t, 5);
    ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = C2.ink;
    ctx.beginPath(); ctx.arc(W / 2, 470, 540, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.45; ctx.strokeStyle = C2.gold; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(W / 2, 470, 540, 0, TAU); ctx.stroke(); ctx.restore();
    for (let i = 0; i < 26; i += 1) {
      const x = (i * 193 + t * 24) % W;
      const y = 120 + (i * 83 + Math.sin(t * 1.3 + i) * 30) % 820;
      paper(ctx, () => blobPath(ctx, x, y, 16, 8, 8, 0.03, i), {
        fill: i % 3 ? "#F28AA6" : C2.goldL, edge: edge(0.3), edgeW: 1,
      });
    }
    // The goddess fills the frame; the crop is the four hands and the face.
    const k = C.smooth(C.clamp((lt - 0.2) / 1.6));
    const pose = poseAt(shot, "LakshmiV2", lt, "stand");
    drawCharacter("LakshmiV2", W / 2, 1300, 1.1, pose, 1, null, t, {
      face: { eyes: "soft", mouth: "smile", phase: 1, handOpen: 0.2 + 0.8 * k },
    });
    // a foreground diya, small against the hands
    diya(ctx, 1540, 960, 1.0, true, t);
    paperShards(ctx, W / 2, 560, t * 0.9, 18, [C2.cream, C2.goldL, "#F28AA6"], 540, 0.2, 91);
    sparkles(ctx, W / 2, 520, t, 16, 500, C2.goldL, 7);
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.05);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  // ---------------------------------------------------------------- s05
  function courtyard(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, W / 2, 560, 0.04, t);
    beginCam(ctx);
    ctx.fillStyle = C2.ink2; ctx.fillRect(0, 0, W, H);
    // wall, niche and door
    paper(ctx, () => tornRectPath(ctx, 20, 30, 1880, 730, 18, 21), {
      fill: C2.ochre, edge: edge(0.45), edgeW: 3, shadow: C.rgba(C2.ink, 0.2), sx: 8, sy: 12,
    });
    // panel lines and a niche on the left
    ctx.strokeStyle = C.rgba(C2.ink, 0.18); ctx.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath(); ctx.moveTo(120 + i * 44, 120); ctx.lineTo(120 + i * 44, 700); ctx.stroke();
    }
    paper(ctx, () => tornRectPath(ctx, 120, 300, 260, 330, 10, 17), {
      fill: C2.ochreD, edge: edge(0.35), edgeW: 2,
    });
    smallLamp(ctx, 250, 470, 1.4, true, t);
    // door
    paper(ctx, () => tornRectPath(ctx, 780, 140, 380, 600, 12, 6), {
      fill: C2.redD, edge: edge(0.55), edgeW: 3, shadow: C.rgba(C2.ink, 0.28), sx: 8, sy: 12,
    });
    paper(ctx, () => tornRectPath(ctx, 815, 180, 310, 520, 8, 9), {
      fill: C2.terra, edge: C.rgba(C2.gold, 0.55), edgeW: 2,
    });
    ctx.strokeStyle = C2.gold; ctx.lineWidth = 4;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath(); ctx.moveTo(835, 230 + i * 92); ctx.lineTo(1105, 230 + i * 92); ctx.stroke();
    }
    smallLamp(ctx, 960, 130, 1.5, true, t);
    garland(ctx, 680, 230, 1260, 230, t, 20);
    // floor
    paper(ctx, () => tornRectPath(ctx, -60, 740, W + 120, 380, 24, 27), {
      fill: C2.cream, edge: edge(0.35), edgeW: 3, shadow: C.rgba(C2.ink, 0.16), sx: 0, sy: 0,
    });
    // the family, seated on either side, drawing the pattern
    person(ctx, 370, 1080, 1.85, C2.green, t, 1);
    person(ctx, 1540, 1070, 1.45, C2.red, t, -1);
    // the rangoli, large and central
    const progress = C.smooth(C.clamp((lt - 0.1) / 1.3));
    rangoli(ctx, W / 2, 880, 350, progress, t);
    // arms from the seated bodies to the powder
    const draw = Math.sin(t * 2.2) * 22;
    for (const [x, side, col] of [[370, 1, C2.greenD], [1540, -1, C2.redD]]) {
      ctx.strokeStyle = col; ctx.lineWidth = 58; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x + side * 30, 900);
      ctx.quadraticCurveTo(x + side * 150, 900, x + side * 260, 840);
      ctx.stroke();
    }
    wristBangle(ctx, 650 + draw, 850, 16);
    wristBangle(ctx, 1270 - draw, 840, 15);
    humanHand(ctx, 650 + draw, 850, 2.0, 0.55, false, "#B9784D", 1);
    humanHand(ctx, 1270 - draw, 840, 1.85, -0.55, false, "#C98A4B", -1);
    // powder bowls
    for (const [x, col] of [[330, C2.red], [390, C2.gold], [1570, C2.green], [1630, C2.cream]]) {
      paper(ctx, () => blobPath(ctx, x, 1000, 46, 22, 14, 0.03, x), {
        fill: col, edge: edge(0.45), edgeW: 2,
      });
    }
    diya(ctx, 260, 990, 1.1, true, t);
    diya(ctx, 1700, 990, 1.1, true, t);
    // petals
    for (let i = 0; i < 24; i += 1) {
      const x = (i * 127 + t * 20) % W;
      const y = 260 + ((i * 87 + t * 38) % 650);
      paper(ctx, () => blobPath(ctx, x, y, 10, 6, 8, 0.03, i), {
        fill: i % 3 ? C2.gold : C2.terra, edge: edge(0.3), edgeW: 1,
      });
    }
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.06);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  // ---------------------------------------------------------------- s06
  function puja(shot, lt, t) {
    const d = shot.duration;
    shotCam(shot, lt, d, W / 2, 540, 0.03, t);
    beginCam(ctx);
    ctx.fillStyle = C2.ink2; ctx.fillRect(0, 0, W, H);
    // warm wall with a shrine arch
    paper(ctx, () => tornRectPath(ctx, 20, 20, 1880, 760, 18, 33), {
      fill: C2.terraD, edge: edge(0.45), edgeW: 3, shadow: C.rgba(C2.ink, 0.2), sx: 8, sy: 12,
    });
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(480, 700);
      ctx.quadraticCurveTo(480, 300, 960, 280);
      ctx.quadraticCurveTo(1440, 300, 1440, 700);
      ctx.closePath();
    }, { fill: C2.redD, edge: C.rgba(C2.gold, 0.45), edgeW: 3 });
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(560, 700);
      ctx.quadraticCurveTo(560, 360, 960, 340);
      ctx.quadraticCurveTo(1360, 360, 1360, 700);
      ctx.closePath();
    }, { fill: C2.ochreD, edge: C.rgba(C2.gold, 0.35), edgeW: 2 });
    smallLamp(ctx, 960, 470, 1.6, true, t);
    garland(ctx, 300, 250, 1620, 250, t, 26);
    // table and cloth
    paper(ctx, () => tornRectPath(ctx, 220, 750, 1480, 280, 16, 9), {
      fill: C2.ochreD, edge: edge(0.55), edgeW: 3, shadow: C.rgba(C2.ink, 0.25), sx: 8, sy: 12,
    });
    paper(ctx, () => tornRectPath(ctx, 300, 770, 1320, 200, 12, 13), {
      fill: C2.red, edge: C.rgba(C2.gold, 0.35), edgeW: 2,
    });
    ctx.strokeStyle = C2.gold; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(320, 800); ctx.lineTo(1600, 800); ctx.stroke();
    thali(ctx, W / 2, 810, 2.2, t);
    // the family offers from both sides
    person(ctx, 260, 1080, 1.7, C2.green, t, 1);
    person(ctx, 1660, 1080, 1.5, C2.red, t, -1);
    const k = C.smooth(C.clamp((lt - 0.1) / 1.2));
    ctx.strokeStyle = C2.greenD; ctx.lineWidth = 56; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(300, 900); ctx.quadraticCurveTo(400, 870, 500 + 40 * k, 790); ctx.stroke();
    ctx.strokeStyle = C2.redD;
    ctx.beginPath(); ctx.moveTo(1620, 900); ctx.quadraticCurveTo(1520, 870, 1420 - 40 * k, 780); ctx.stroke();
    wristBangle(ctx, 500 + 40 * k, 790, 16);
    wristBangle(ctx, 1420 - 40 * k, 780, 15);
    humanHand(ctx, 500 + 40 * k, 790, 1.9, 0.75, true, "#B9784D", 1);
    humanHand(ctx, 1420 - 40 * k, 780, 1.8, -0.75, true, "#C98A4B", -1);
    // bell, incense, smoke
    paper(ctx, () => blobPath(ctx, 560, 880, 26, 30, 14, 0.03, 5), {
      fill: C2.gold, edge: edge(0.5), edgeW: 2,
    });
    paper(ctx, () => roundRectPath(ctx, 1110, 780, 10, 90, 4), {
      fill: C2.terraD, edge: edge(0.5), edgeW: 1.5,
    });
    for (let i = 0; i < 5; i += 1) {
      ctx.strokeStyle = C.rgba(C2.cream, 0.2 - i * 0.025); ctx.lineWidth = 4 - i * 0.5;
      ctx.beginPath();
      for (let y = 770; y > 440; y -= 12) {
        const x = 1120 + Math.sin((y + t * 40 + i * 30) * 0.02) * 34;
        if (y === 770) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    sparkles(ctx, 960, 760, t, 14, 330, C2.goldL, 9);
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.06);
    endCam(ctx);
    softVignette();
    framePaper();
    caption(shot, t);
  }

  Object.assign(window.PAPER_BACKEND.shots, {
    proof_door: door,
    proof_street: street,
    proof_river: river,
    proof_hands: hands,
    proof_rangoli: courtyard,
    proof_puja: puja,
  });

  window.CHARACTERS = window.CHARACTERS || {};
  window.CHARACTERS["child-v2@0.1.0"] = function (ctx, x, y, s, o = {}) {
    child(ctx, x, y, s, o.t || 0, o.face?.walk === undefined ? (o.t || 0) * 8 : o.face.walk, o.flip || 1);
  };
})();
