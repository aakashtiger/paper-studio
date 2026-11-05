/* Film-local myth scenes for Lakshmi and the Lights.
 *
 * The Paper K-pop pack owns the construction (paper, cut edge, brads, halftone,
 * hard key). This file owns this film's people, props and twelve images. It is
 * loaded after the pack canvas and registers only this film's recipes.
 */
(function () {
  const W2 = W / 2;
  let CLOCK = 0;
  function hashText(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function ground(shot, t) {
    CLOCK = t;
    const role = shot.slots && shot.slots["stage.field"];
    const fields = { ink: PAL.ink, oxblood: PAL.redD, red: PAL.red, blue: PAL.blueD, orange: PAL.orange, cream: PAL.cream, paper: PAL.paper, teal: PAL.teal, kraft: PAL.paper3 };
    const field = fields[role] || PAL.paper;
    const floor = C.shade(field, role === "ink" || role === "oxblood" ? 16 : -18);
    paper(ctx, () => tornRectPath(ctx, -60, 930, W + 120, 220, 26, 23), {
      fill: floor, edge: C.rgba(PAL.cream, 0.28), edgeW: 3, shadow: C.rgba(PAL.ink, 0.2), sx: 8, sy: 12,
    });
    ctx.strokeStyle = C.rgba(PAL.cream, 0.22);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-60, 948); ctx.lineTo(W + 60, 948); ctx.stroke();
    const seed = hashText(String((shot && shot.recipe) || (shot && shot.visual && shot.visual.shows) || "stage"));
    const ink = seed % 997 / 997;
    const lightField = role === "cream" || role === "orange" || role === "paper" || role === "kraft";
    const mark = lightField ? PAL.ink : PAL.cream;
    const device = shot && shot.slots && shot.slots["stage.device"];
    if (device === "sunburst") {
      const cx = W / 2;
      const cy = 560;
      const rays = 30;
      for (let i = 0; i < rays; i += 1) {
        const a = (i / rays) * TAU + 0.11;
        const inner = 210 + (i % 4) * 22;
        const outer = 540 + (i % 5) * 34;
        ctx.strokeStyle = lightField ? C.rgba(PAL.ink, 0.16) : C.rgba(PAL.cream, 0.34);
        ctx.lineWidth = 13 + (i % 3) * 5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        ctx.stroke();
      }
    }
    const rot = ink * TAU;
    const r = 426 + (seed % 7) * 22;
    ctx.strokeStyle = C.rgba(mark, lightField ? 0.10 : 0.16);
    ctx.lineWidth = 9 + Math.sin(t * 1.5) * 2;
    ctx.beginPath(); ctx.arc(W / 2, 640, r, rot, rot + Math.PI * 1.22); ctx.stroke();
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(W / 2, 640, r - 62, rot + 1.04, rot + 1.04 + Math.PI * 0.82); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(W / 2, 640, r - 118, rot + 2.1, rot + 2.1 + Math.PI * 0.66); ctx.stroke();
    // A second paper step gives the stage depth and a strong cut edge.
    paper(ctx, () => tornRectPath(ctx, -60, 862, W + 120, 180, 26, 29), {
      fill: C.shade(field, role === "ink" || role === "oxblood" ? 10 : -8),
      edge: C.rgba(lightField ? PAL.ink : PAL.cream, 0.2), edgeW: 3, shadow: C.rgba(PAL.ink, 0.14), sx: 6, sy: 9,
    });
    paperShards(ctx, W / 2, 520, t * 0.65, 16, lightField ? [PAL.ink, PAL.gold, PAL.red] : [PAL.cream, PAL.gold, PAL.red], 860, lightField ? 0.12 : 0.2, 17);
  }

  function diya(ctx, x, y, s = 1, lit = true) {
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x - 34 * s, y);
      ctx.quadraticCurveTo(x, y + 30 * s, x + 34 * s, y);
      ctx.quadraticCurveTo(x, y + 8 * s, x - 34 * s, y);
      ctx.closePath();
    }, { fill: PAL.terracotta, edge: PAL.ink, edgeW: 2.4 * s, shadow: C.rgba(PAL.ink, 0.26), sx: 5 * s, sy: 8 * s });
    paper(ctx, () => blobPath(ctx, x, y + 22 * s, 20 * s, 7 * s, 12, 0.03, 2), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.4), edgeW: 1.4 * s,
    });
    if (!lit) return;
    const phase = CLOCK * 6.4 + x * 0.011 + y * 0.017;
    const flick = 1 + Math.sin(phase) * 0.16 + Math.sin(phase * 2.3) * 0.06;
    const sway = Math.sin(phase * 0.7) * 4 * s;
    ctx.save();
    ctx.globalAlpha = 0.22 + 0.08 * Math.sin(phase * 1.3);
    ctx.fillStyle = PAL.gold;
    ctx.beginPath(); ctx.arc(x, y - 18 * s, 44 * s, 0, TAU); ctx.fill();
    ctx.restore();
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x + sway, y - 34 * s * flick);
      ctx.quadraticCurveTo(x - 16 * s + sway, y - 6 * s, x, y - 1 * s);
      ctx.quadraticCurveTo(x + 16 * s + sway, y - 6 * s, x + sway, y - 34 * s * flick);
      ctx.closePath();
    }, { fill: PAL.gold, edge: C.rgba(PAL.redD, 0.7), edgeW: 1.2 * s });
    paper(ctx, () => blobPath(ctx, x + sway * 0.5, y - 14 * s, 4 * s, 9 * s * flick, 8, 0.02, 3), {
      fill: PAL.cream, edge: null,
    });
  }

  function lotus(ctx, x, y, r, fill = PAL.pinkL) {
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * TAU;
      paper(ctx, () => {
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.48, y + Math.sin(a) * r * 0.32, r * 0.42, r * 0.16, a, 0, TAU);
        ctx.closePath();
      }, { fill: i % 3 === 0 ? PAL.gold : fill, edge: C.rgba(PAL.ink, 0.35), edgeW: 1.2 });
    }
    paper(ctx, () => blobPath(ctx, x, y, r * 0.26, r * 0.2, 12, 0.03, 4), {
      fill: PAL.gold, edge: C.rgba(PAL.ink, 0.4), edgeW: 1.2,
    });
  }

  function wave(ctx, y, amp, color, seed = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-80, y);
    for (let x = -80; x <= W + 80; x += 60) {
      ctx.lineTo(x, y + Math.sin((x + seed * 70 + CLOCK * 34) * 0.008) * amp + Math.sin((x + CLOCK * 46) * 0.017) * amp * 0.4);
    }
    ctx.lineTo(W + 80, H + 80);
    ctx.lineTo(-80, H + 80);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function moon(ctx, x, y, r, fill = PAL.cream) {
    paper(ctx, () => blobPath(ctx, x, y, r, r, 24, 0.02, 9), {
      fill, edge: C.rgba(PAL.ink, 0.3), edgeW: 2,
    });
  }

  function starField(ctx, t) {
    for (let i = 0; i < 36; i += 1) {
      const x = (i * 173 + 41) % W;
      const y = (i * 97 + 63) % 520;
      const r = 2 + (i % 3);
      ctx.fillStyle = C.rgba(PAL.cream, 0.45 + 0.25 * Math.sin(t * 1.7 + i));
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
  }

  function caption(shot, t) {
    explainerCaption(shot, t);
  }

  function firstDiya(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.1, t);
    beginCam(ctx);
    starField(ctx, t);
    // A dark doorway: the house is a paper frame, the night is beyond it.
    paper(ctx, () => tornRectPath(ctx, 80, 70, 560, 900, 22, 17), {
      fill: PAL.ink2, edge: C.rgba(PAL.cream, 0.4), edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 10, sy: 14,
    });
    paper(ctx, () => tornRectPath(ctx, 120, 120, 480, 800, 18, 19), {
      fill: PAL.ink, edge: C.rgba(PAL.gold, 0.55), edgeW: 3,
    });
    // One large hand and one diya, the first light.
    const k = C.smooth(C.clamp(lt / 1.1));
    ctx.save();
    ctx.globalAlpha = k;
    paperHand(760, 690, 2.1, -0.16, k);
    diya(ctx, 810, 710, 1.8, true);
    ctx.restore();
    for (let i = 0; i < 3; i += 1) diya(ctx, 1180 + i * 150, 830, 1.1, i < 2);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function lampRow(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2 + 40, 520, 0.08, t);
    beginCam(ctx);
    starField(ctx, t);
    // A paper street: one long torn strip, houses, windows, a row of lamps.
    for (let i = 0; i < 7; i += 1) {
      const x = 80 + i * 265;
      paper(ctx, () => tornRectPath(ctx, x, 330 + (i % 2) * 40, 190, 360, 10, 7 + i), {
        fill: i % 2 ? PAL.redD : PAL.blueD, edge: C.rgba(PAL.ink, 0.6), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.24), sx: 7, sy: 10,
      });
      paper(ctx, () => tornRectPath(ctx, x + 45, 400, 52, 74, 5, 8 + i), {
        fill: PAL.gold, edge: C.rgba(PAL.ink, 0.45), edgeW: 1.5,
      });
      ctx.save();
      ctx.globalAlpha = 0.10 + 0.07 * Math.sin(t * 2.6 + i * 1.4);
      ctx.fillStyle = PAL.goldL;
      ctx.beginPath(); ctx.arc(x + 71, 437, 82, 0, TAU); ctx.fill();
      ctx.restore();
    }
    const drift = Math.sin(t * 0.9) * 10;
    ctx.save();
    ctx.translate(drift, 0);
    ctx.restore();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(-40, 760); ctx.lineTo(W + 40, 760); ctx.stroke();
    for (let i = 0; i < 10; i += 1) diya(ctx, 80 + i * 200, 800, 1.15, true);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function lakshmiScene(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 560, 0.12, t);
    beginCam(ctx);
    // Lotus pond and a low sun/moon halo.
    wave(ctx, 760, 26, C.rgba(PAL.blueD, 0.75), 2);
    wave(ctx, 840, 18, C.rgba(PAL.teal, 0.65), 5);
    moon(ctx, 1500, 220, 120, PAL.goldL);
    for (let i = 0; i < 6; i += 1) lotus(ctx, 260 + i * 300, 830, 70, i % 2 ? PAL.pink : PAL.redL);
    drawCharacter("Lakshmi", 960, 1040, 1.45, "idle", 1, scorePose(shot, "Lakshmi"), t);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function churn(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.14, t);
    beginCam(ctx);
    starField(ctx, t);
    moon(ctx, 300, 180, 80, PAL.cream);
    wave(ctx, 600, 62, C.rgba(PAL.blueD, 0.85), 3);
    wave(ctx, 720, 48, C.rgba(PAL.blue, 0.8), 7);
    wave(ctx, 810, 34, C.rgba(PAL.tealD, 0.85), 11);
    // Mount Mandara, cut as a triangle, with a serpent rope around it.
    ctx.save();
    ctx.translate(Math.sin(t * 1.15) * 12, Math.cos(t * 0.95) * 6);
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(740, 760); ctx.lineTo(960, 160); ctx.lineTo(1180, 760); ctx.closePath();
    }, { fill: PAL.terracotta, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.3), sx: 10, sy: 14 });
    ctx.restore();
    // The serpent is the rope: it wraps the mountain in three visible turns.
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 18; ctx.lineCap = "round";
    for (let turn = 0; turn < 3; turn += 1) {
      const yy = 620 - turn * 150 + Math.sin(t * 1.1 + turn) * 14;
      const half = 210 + turn * 30;
      ctx.beginPath();
      ctx.moveTo(960 - half, yy + 60);
      ctx.quadraticCurveTo(960, yy - 70, 960 + half, yy + 60);
      ctx.stroke();
    }
    for (let i = 0; i <= 80; i += 1) {
      const p = i / 80;
      const x = 260 + p * 1400;
      const y = 690 + Math.sin(p * Math.PI * 4 + t * 0.8) * 90 * (0.4 + p * 0.3);
      if (i === 0) ctx.beginPath(), ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Foam caps on the turning water.
    for (let i = 0; i < 20; i += 1) {
      const x = 80 + i * 94 + Math.sin(t * 1.4 + i) * 28;
      const y = 650 + Math.cos(t * 1.2 + i * 1.7) * 34;
      paper(ctx, () => blobPath(ctx, x, y, 30, 12, 10, 0.03, 40 + i), {
        fill: PAL.cream, edge: C.rgba(PAL.blueD, 0.35), edgeW: 1.4,
      });
    }
    paperShards(ctx, W / 2, 660, t * 1.1, 22, [PAL.cream, PAL.goldL, PAL.blueL], 700, 0.4, 23);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function labor(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.12, t);
    beginCam(ctx);
    wave(ctx, 760, 34, C.rgba(PAL.blueD, 0.85), 4);
    moon(ctx, 1500 + Math.sin(t * 1.1) * 18, 180, 80, PAL.cream);
    // Two rows of cut-paper pullers; no named cast, just the argument.
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i += 1) {
        const x = 240 + i * 170 + (side > 0 ? 760 : 0) + Math.sin(t * 1.6 + i + side) * 26;
        const y = 820 + (i % 2) * 30 + Math.cos(t * 1.3 + i) * 16;
        paper(ctx, () => blobPath(ctx, x, y, 36, 54, 14, 0.04, 7 + i), {
          fill: side < 0 ? PAL.blueD : PAL.redD, edge: C.rgba(PAL.ink, 0.6), edgeW: 2,
          shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7,
        });
        paper(ctx, () => blobPath(ctx, x, y - 44, 24, 24, 12, 0.03, 4 + i), {
          fill: side < 0 ? PAL.blueL : PAL.redL, edge: C.rgba(PAL.ink, 0.55), edgeW: 1.5,
        });
        // Both arms reach the rope and pull.
        const ropeX = x;
        const p = C.clamp((ropeX - 170) / 1580);
        const ropeY = 740 - 2 * 50 * p * (1 - p) + Math.cos(t * 1.1) * 12;
        for (const arm of [-1, 1]) {
          ctx.strokeStyle = side < 0 ? PAL.blueL : PAL.redL;
          ctx.lineWidth = 9; ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x + arm * 16, y - 22);
          ctx.quadraticCurveTo(x + arm * 30, y - 70, ropeX + arm * 18, ropeY + 6);
          ctx.stroke();
          paper(ctx, () => blobPath(ctx, ropeX + arm * 18, ropeY + 6, 7, 9, 8, 0.03, 60 + i), {
            fill: PAL.gold, edge: C.rgba(PAL.ink, 0.5), edgeW: 1.2,
          });
        }
      }
    }
    // The rope runs between the rows and over the mountain.
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(170 + Math.sin(t * 1.2) * 26, 740); ctx.quadraticCurveTo(960, 690 + Math.cos(t * 1.1) * 12, 1750 + Math.sin(t * 1.2) * 26, 740); ctx.stroke();
    // The serpent's head at the near end of the rope.
    paper(ctx, () => blobPath(ctx, 160, 748, 30, 24, 12, 0.04, 71), {
      fill: PAL.gold, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 6,
    });
    ctx.fillStyle = PAL.ink;
    ctx.beginPath(); ctx.arc(150, 744, 4, 0, TAU); ctx.fill();
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function treasures(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.1, t);
    beginCam(ctx);
    starField(ctx, t);
    wave(ctx, 700, 38, C.rgba(PAL.blueD, 0.9), 8);
    const items = [
      [300, 690, "COW", PAL.cream],
      [540, 640, "HORSE", PAL.cream],
      [780, 700, "MOON", PAL.goldL],
      [1020, 650, "POT", PAL.terracotta],
      [1260, 700, "JEWEL", PAL.redL],
    ];
    const k = C.smooth(C.clamp((lt - 0.1) / 1.8));
    for (let i = 0; i < items.length; i += 1) {
      const [x, y, label, fill] = items[i];
      const rise = C.clamp(k * 1.4 - i * 0.12);
      if (rise <= 0) continue;
      const bob = Math.sin(t * 1.7 + i * 1.3) * 9;
      ctx.save(); ctx.globalAlpha = rise;
      const cy = y - 30 + bob;
      if (label === "COW") {
        paper(ctx, () => blobPath(ctx, x, cy, 62, 34, 14, 0.03, 5), { fill: PAL.cream, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
        paper(ctx, () => blobPath(ctx, x + 58, cy - 14, 22, 18, 10, 0.03, 6), { fill: PAL.cream, edge: PAL.ink, edgeW: 2.2 });
        for (const [lx, ly] of [[-36, 30], [-12, 34], [22, 34], [44, 30]]) {
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(x + lx, cy + 18); ctx.lineTo(x + lx, cy + ly + 18); ctx.stroke();
        }
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(x + 64, cy - 30); ctx.quadraticCurveTo(x + 72, cy - 46, x + 52, cy - 42); ctx.stroke();
      } else if (label === "HORSE") {
        paper(ctx, () => blobPath(ctx, x, cy, 66, 30, 14, 0.03, 7), { fill: PAL.cream, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
        ctx.strokeStyle = PAL.cream; ctx.lineWidth = 26; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x + 56, cy - 4); ctx.quadraticCurveTo(x + 82, cy - 48, x + 70, cy - 76); ctx.stroke();
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x + 56, cy - 4); ctx.quadraticCurveTo(x + 82, cy - 48, x + 70, cy - 76); ctx.stroke();
        for (const [lx, ly] of [[-40, 30], [-16, 34], [20, 34], [44, 30]]) {
          ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(x + lx, cy + 14); ctx.lineTo(x + lx, cy + ly + 14); ctx.stroke();
        }
        ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5;
        for (let k = 0; k < 5; k += 1) {
          ctx.beginPath(); ctx.moveTo(x - 54 + k * 12, cy - 20); ctx.lineTo(x - 46 + k * 12, cy - 34); ctx.stroke();
        }
      } else if (label === "MOON") {
        paper(ctx, () => blobPath(ctx, x, cy, 58, 58, 22, 0.02, 9), { fill: PAL.goldL, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
        ctx.fillStyle = C.rgba(PAL.cream, 0.6);
        for (const [dx, dy, r] of [[-18, -14, 10], [14, 8, 7], [6, -26, 5]]) { ctx.beginPath(); ctx.arc(x + dx, cy + dy, r, 0, TAU); ctx.fill(); }
      } else if (label === "POT") {
        paper(ctx, () => blobPath(ctx, x, cy + 4, 52, 40, 16, 0.04, 11), { fill: PAL.terracotta, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
        paper(ctx, () => tornRectPath(ctx, x - 30, cy - 48, 60, 22, 6, 13), { fill: PAL.terracotta, edge: PAL.ink, edgeW: 2.2 });
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(x, cy + 2, 32, 0.3, Math.PI - 0.3); ctx.stroke();
      } else {
        paper(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(x, cy - 46); ctx.lineTo(x + 44, cy - 10); ctx.lineTo(x + 30, cy + 42); ctx.lineTo(x - 30, cy + 42); ctx.lineTo(x - 44, cy - 10); ctx.closePath();
        }, { fill: PAL.redL, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8 });
        ctx.strokeStyle = C.rgba(PAL.cream, 0.8); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x - 16, cy - 22); ctx.lineTo(x + 10, cy + 8); ctx.stroke();
      }
      ctx.restore();
    }
    const emerge = C.smooth(C.clamp((lt - 1.35) / 0.9));
    if (emerge > 0) {
      ctx.save(); ctx.globalAlpha = emerge;
      drawCharacter("Lakshmi", 960, 1005, 0.65, "accept", 1, null, t);
      ctx.restore();
    }
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function birth(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.12, t);
    beginCam(ctx);
    starField(ctx, t);
    wave(ctx, 730, 32, C.rgba(PAL.blueD, 0.85), 9);
    const k = C.smooth(C.clamp((lt - 0.2) / 1.6));
    // She rises first; the lotus opens in front of her feet, so the flower is
    // the ground she comes out of, not a mask over her body.
    drawCharacter("Lakshmi", 960, 992 - 18 * k, 0.95 + 0.2 * k, "accept", 1, scorePose(shot, "Lakshmi"), t);
    ctx.save();
    ctx.translate(W / 2, 1018);
    ctx.scale(0.55 + 0.45 * k, 0.55 + 0.45 * k);
    lotus(ctx, 0, 0, 200, PAL.pink);
    ctx.restore();
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function garland(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.1, t);
    beginCam(ctx);
    moon(ctx, 960, 220, 160, PAL.goldL);
    drawCharacter("Lakshmi", 760, 1030, 1.25, "accept", 1, scorePose(shot, "Lakshmi"), t);
    drawCharacter("Vishnu", 1180, 1030, 1.15, "idle", -1, scorePose(shot, "Vishnu"), t);
    // The garland is a bridge between their hands.
    const k = C.smooth(C.clamp((lt - 0.25) / 0.9));
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 14; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(820, 640);
    ctx.quadraticCurveTo(960, 560 + 30 * k, 1100, 640);
    ctx.stroke();
    for (let i = 0; i < 9; i += 1) {
      const p = i / 8;
      const x = 820 + p * 280;
      const y = 640 - Math.sin(p * Math.PI) * 80;
      paper(ctx, () => blobPath(ctx, x, y, 16, 16, 10, 0.04, i), { fill: PAL.red, edge: PAL.ink, edgeW: 1.5 });
    }
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function rangoli(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.08, t);
    beginCam(ctx);
    // Courtyard wall and door.
    paper(ctx, () => tornRectPath(ctx, 180, 80, 1560, 700, 18, 21), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.35), edgeW: 3, shadow: C.rgba(PAL.ink, 0.16), sx: 10, sy: 14,
    });
    paper(ctx, () => tornRectPath(ctx, 780, 150, 360, 600, 12, 6), {
      fill: PAL.redD, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.25), sx: 8, sy: 12,
    });
    // Rangoli: concentric paper rings and petals on the floor, turning.
    ctx.save();
    ctx.translate(960, 860);
    ctx.rotate(t * 0.16);
    for (let i = 0; i < 4; i += 1) {
      ctx.strokeStyle = i % 2 ? PAL.red : PAL.gold; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(0, 0, 80 + i * 42, 0, TAU); ctx.stroke();
    }
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * TAU;
      paper(ctx, () => blobPath(ctx, Math.cos(a) * 210, Math.sin(a) * 78, 18, 12, 8, 0.03, i), {
        fill: i % 2 ? PAL.gold : PAL.cream, edge: C.rgba(PAL.ink, 0.4), edgeW: 1.2,
      });
    }
    ctx.restore();
    for (let i = 0; i < 16; i += 1) {
      const fx = (i * 137 + 60) % W;
      const fy = ((i * 83 + t * 46) % 620) + 300;
      const fa = t * 1.3 + i;
      paper(ctx, () => blobPath(ctx, fx + Math.sin(fa) * 18, fy, 12, 8, 8, 0.04, 31 + i), {
        fill: i % 3 ? PAL.gold : PAL.orange, edge: C.rgba(PAL.ink, 0.35), edgeW: 1,
      });
    }
    drawCharacter("Householder", 640, 1010, 0.8, "hold", 1, scorePose(shot, "Householder"), t);
    drawCharacter("Child", 1370, 1040, 0.55, "hold", -1, scorePose(shot, "Child"), t);
    diya(ctx, 900, 980, 1.0, true);
    diya(ctx, 1040, 980, 1.0, true);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function puja(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.1, t);
    beginCam(ctx);
    paper(ctx, () => tornRectPath(ctx, 420, 600, 1080, 260, 16, 11), {
      fill: PAL.gold, edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.24), sx: 8, sy: 12,
    });
    for (let i = 0; i < 5; i += 1) diya(ctx, 560 + i * 190, 620, 0.9, true);
    // Offerings: marigold, a small thali, a coconut.
    for (let i = 0; i < 9; i += 1) {
      paper(ctx, () => blobPath(ctx, 520 + i * 100, 800 + (i % 2) * 20, 22, 22, 12, 0.04, i), {
        fill: i % 2 ? PAL.gold : PAL.orange, edge: C.rgba(PAL.ink, 0.4), edgeW: 1.4,
      });
    }
    drawCharacter("Householder", 640, 1040, 0.85, "accept", 1, scorePose(shot, "Householder"), t);
    drawCharacter("Lakshmi", 1420, 1030, 0.9, "idle", -1, scorePose(shot, "Lakshmi"), t);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function dana(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.08, t);
    beginCam(ctx);
    paper(ctx, () => tornRectPath(ctx, 280, 260, 1360, 520, 18, 9), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.45), edgeW: 3, shadow: C.rgba(PAL.ink, 0.2), sx: 8, sy: 12,
    });
    // Ledger: ruled lines, a spine, stamped entries.
    ctx.strokeStyle = C.rgba(PAL.blueD, 0.55); ctx.lineWidth = 3;
    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath(); ctx.moveTo(420, 360 + i * 42); ctx.lineTo(1460, 360 + i * 42); ctx.stroke();
    }
    loop: for (let i = 0; i < 8; i += 1) {
      const x = 380 + (i % 4) * 280, y = 390 + Math.floor(i / 4) * 160;
      paper(ctx, () => blobPath(ctx, x, y, 26, 26, 12, 0.02, i), { fill: PAL.gold, edge: PAL.ink, edgeW: 2 });
    }
    drawCharacter("Householder", 640, 1030, 0.85, "accept", 1, scorePose(shot, "Householder"), t);
    drawCharacter("Child", 1370, 1040, 0.55, "accept", -1, scorePose(shot, "Child"), t);
    // One coin passes between them.
    const k = C.smooth(C.clamp((lt - 0.35) / 0.7));
    paper(ctx, () => blobPath(ctx, 720 + 400 * k, 760 - Math.sin(k * Math.PI) * 60, 28, 28, 14, 0.03, 5), {
      fill: PAL.gold, edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 6,
    });
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function windows(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.08, t);
    beginCam(ctx);
    starField(ctx, t);
    ctx.save();
    ctx.translate(Math.sin(t * 1.35) * 12, Math.cos(t * 1.1) * 7);
    const panels = [
      [180, PAL.blueD, "BENGAL", PAL.red],
      [760, PAL.orange, "AYODHYA", PAL.goldL],
      [1340, PAL.ink2, "ACCOUNTS", PAL.gold],
    ];
    for (const [x, fill, label, accent] of panels) {
      paper(ctx, () => tornRectPath(ctx, x, 250, 400, 560, 14, 5), {
        fill, edge: C.rgba(PAL.cream, 0.4), edgeW: 3, shadow: C.rgba(PAL.ink, 0.25), sx: 8, sy: 12,
      });
      // A shrine lamp in each window; the left one carries a trident, not a face.
      ctx.save();
      ctx.globalAlpha = 0.12 + 0.08 * Math.sin(t * 2.2 + x * 0.01);
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(x + 200, 620, 160, 0, TAU); ctx.fill();
      ctx.restore();
      diya(ctx, x + 200, 700, 1.3, true);
      if (label === "BENGAL") {
        ctx.strokeStyle = accent; ctx.lineWidth = 9;
        ctx.beginPath(); ctx.moveTo(x + 200, 360); ctx.lineTo(x + 200, 610); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 200, 420); ctx.lineTo(x + 150, 470); ctx.moveTo(x + 200, 420); ctx.lineTo(x + 250, 470); ctx.stroke();
      } else if (label === "AYODHYA") {
        for (let i = 0; i < 5; i += 1) {
          paper(ctx, () => blobPath(ctx, x + 100 + i * 50, 500, 12, 12, 9, 0.02, i), { fill: accent, edge: PAL.ink, edgeW: 1 });
        }
      } else {
        ctx.strokeStyle = accent; ctx.lineWidth = 5;
        for (let i = 0; i < 5; i += 1) {
          ctx.beginPath(); ctx.moveTo(x + 80, 380 + i * 34); ctx.lineTo(x + 320, 380 + i * 34); ctx.stroke();
        }
      }
      TY.text(ctx, label, x + 200, 850, 24, { family: "DMMono", color: PAL.cream, align: "center" });
    }
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    ctx.restore();
    endCam(ctx);
    caption(shot, t);
  }

  function passLight(shot, lt, t) {
    const d = shot.duration;
    bgPaper(shot);
    ground(shot, t);
    shotCam(shot, lt, d, W / 2, 520, 0.06, t);
    beginCam(ctx);
    starField(ctx, t);
    // Two paper hands pass one flame. The hands are the whole cast here.
    const k = C.smooth(C.clamp((lt - 0.2) / 1.2));
    const sway = Math.sin(t * 1.25) * 24;
    const bob = Math.cos(t * 1.1) * 8;
    paperHand(720 - 30 * k + sway, 690 + bob, 1.8, 0.1, 1);
    paperHand(1200 + 30 * k - sway, 690 - bob, 1.8, -0.1, 1);
    ctx.save();
    const scale = 1.8 + 0.5 * k + Math.sin(t * 2.7) * 0.12;
    diya(ctx, 960, 650, scale, true);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = PAL.gold;
    ctx.beginPath(); ctx.arc(960, 540, 150 + 30 * k + Math.sin(t * 1.7) * 25, 0, TAU); ctx.fill();
    sparkles(ctx, 960, 540, t, 14, 230, PAL.gold, 4);
    ctx.restore();
    // The lamp throws embers; they cross the dark and keep the last shot alive.
    paperShards(ctx, 960, 600, t * 1.75, 28, [PAL.gold, PAL.cream, PAL.redL], 720, 0.42, 91);
    halftone(ctx, 0, 0, W, H, PAL.ink, 16, 0.5, 0.1);
    endCam(ctx);
    caption(shot, t);
  }

  function poseFromScore(shot, name) {
    // Reserved for a future per-shot gesture override; the score's pose events
    // are already applied by the rig, so this is intentionally empty.
    return null;
  }
  const scorePose = poseFromScore;

  Object.assign(window.PAPER_BACKEND.shots, {
    myth_first_diya: firstDiya,
    myth_lamp_row: lampRow,
    myth_lakshmi: lakshmiScene,
    myth_churn: churn,
    myth_labor: labor,
    myth_treasures: treasures,
    myth_birth: birth,
    myth_garland: garland,
    myth_rangoli: rangoli,
    myth_puja: puja,
    myth_dana: dana,
    myth_windows: windows,
    myth_pass_light: passLight,
  });
})();
