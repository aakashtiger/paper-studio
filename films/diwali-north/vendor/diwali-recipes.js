/* Portrait scenes for Why North India Lights the Dark.
 *
 * One 1080x1920 paper stage, nineteen distinct tableaux. The helpers are the
 * pack's / the proof's paper primitives; every scene is code-drawn, no image.
 */
(function () {
  const P = window.PAPER_HELPERS;
  const C2 = P.C2;
  const edge = P.edge;

  function stage(top = C2.night, bottom = C2.indigo) {
    P.underlay(top);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function ground(y, col = C2.ink2, seed = 7) {
    paper(ctx, () => tornRectPath(ctx, -40, y, W + 80, H - y + 40, 24, seed), {
      fill: col, edge: C.rgba(C2.cream, 0.16), edgeW: 3,
    });
  }

  function portraitCam(shot, lt, d, cx, cy, zoom, t) {
    shotCam(shot, lt, d, cx, cy, zoom, t);
    beginCam(ctx);
  }

  function finish(shot, t) {
    halftone(ctx, 0, 0, W, H, C2.ink, 18, 0.5, 0.06);
    endCam(ctx);
    P.softVignette();
    P.framePaper();
  }

  function backdrop(x, y, w, h, seed = 1, col = C2.ink2) {
    paper(ctx, () => tornRectPath(ctx, x, y, w, h, 16, seed), {
      fill: col, edge: C.rgba(C2.cream, 0.2), edgeW: 2,
    });
  }

  function glow(x, y, r, col = C2.goldL, alpha = 0.35) {
    const g = ctx.createRadialGradient(x, y, 8, x, y, r);
    g.addColorStop(0, C.rgba(col, alpha));
    g.addColorStop(1, C.rgba(col, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function marigold(x, y, s, seed = 1) {
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * TAU;
      paper(ctx, () => blobPath(ctx, x + Math.cos(a) * 10 * s, y + Math.sin(a) * 10 * s, 8 * s, 8 * s, 7, 0.02, seed + i), {
        fill: i % 2 ? C2.gold : C2.orange || C2.terra, edge: edge(0.25), edgeW: 1,
      });
    }
    paper(ctx, () => blobPath(ctx, x, y, 6 * s, 6 * s, 7, 0.02, seed + 11), { fill: C2.redD, edge: null });
  }

  function silhouette(ctx, x, y, s, col = C2.ink2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    paper(ctx, () => blobPath(ctx, 0, -420, 52, 60, 14, 0.02, 4), { fill: col, edge: null });
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-38, -360); ctx.lineTo(38, -360);
      ctx.lineTo(56, -80); ctx.lineTo(-56, -80); ctx.closePath();
    }, { fill: col, edge: null });
    paper(ctx, () => roundRectPath(ctx, -30, -100, 24, 100, 8), { fill: col, edge: null });
    paper(ctx, () => roundRectPath(ctx, 8, -100, 24, 100, 8), { fill: col, edge: null });
    // two arms, so a silhouette still reads as a body
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * 42, -344);
      ctx.rotate(side * 0.22);
      paper(ctx, () => roundRectPath(ctx, -8, 0, 16, 126, 8), { fill: col, edge: null });
      ctx.restore();
    }
    // a fringe of hair breaks the perfect circle
    paper(ctx, () => blobPath(ctx, 0, -482, 44, 22, 10, 0.04, 6), { fill: col, edge: null });
    ctx.restore();
  }

  function rama(ctx, x, y, s) {
    silhouette(ctx, x, y, s, C2.ink2);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-45, -470); ctx.lineTo(-28, -520); ctx.lineTo(-8, -480);
      ctx.lineTo(8, -530); ctx.lineTo(28, -480); ctx.lineTo(48, -520); ctx.lineTo(36, -460);
      ctx.closePath();
    }, { fill: C2.gold, edge: C.rgba(C2.ink, 0.5), edgeW: 2 });
    ctx.strokeStyle = C2.gold; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(84, -330, 100, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = C2.cream; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(84 + Math.cos(-1.2) * 100, -330 + Math.sin(-1.2) * 100);
    ctx.lineTo(84 + Math.cos(1.2) * 100, -330 + Math.sin(1.2) * 100); ctx.stroke();
    ctx.restore();
  }

  function houseRow(ctx, y, n, col, t, lit = true, doorW = 54) {
    for (let i = 0; i < n; i += 1) {
      const w = W / n;
      const x = i * w;
      P.house(ctx, x + 8, y, w - 16, 330 + (i % 3) * 40, col, C2.terraD, lit, t, { doorW, rangoli: false });
    }
  }

  // 1. the child asks
  function p_door(shot, lt, t) {
    stage(C2.ink2, C2.night);
    portraitCam(shot, lt, shot.duration, 520, 980, 0.04, t);
    P.starField(ctx, t, 80, 1000);
    P.moon(ctx, 870, 260, 92, t);
    P.temple(ctx, 60, 1180, 1.0, C2.night);
    P.temple(ctx, 1010, 1180, 0.9, C2.night);
    P.house(ctx, 120, 1140, 840, 660, C2.ochre, C2.terraD, true, t, { doorW: 260 });
    // the open door: a warm room, not a black rectangle
    paper(ctx, () => tornRectPath(ctx, 300, 750, 360, 400, 12, 7), {
      fill: C2.redD, edge: C.rgba(C2.gold, 0.6), edgeW: 3,
    });
    paper(ctx, () => tornRectPath(ctx, 330, 785, 300, 330, 10, 8), { fill: C2.goldL, edge: null });
    glow(480, 950, 330, C2.goldL, 0.45);
    // marigold garland over the door
    for (let i = 0; i < 9; i += 1) marigold(285 + i * 38, 735 + Math.sin(i * 0.9) * 12, 0.8, i);
    ground(1640, C2.ink2, 9);
    P.diya(ctx, 300, 1580, 2.8, true, t, "diya");
    backdrop(590, 980, 490, 860, 11, C2.ink);
    drawCharacter("Child", 760, 1820, 1.8, "watch", -1, P.poseAt(shot, "Child", lt, "watch"), t, {
      face: { ...(faceAt(shot, lt, "Child") || {}), look: [-1, -0.1] },
    });
    finish(shot, t);
  }

  // 2. a city waits
  function p_wait(shot, lt, t) {
    stage(C2.night, C2.indigo);
    portraitCam(shot, lt, shot.duration, 540, 920, 0.05, t);
    P.starField(ctx, t, 120, 1100);
    P.moon(ctx, 220, 300, 132, t);
    P.temple(ctx, 540, 1260, 1.9, C2.ink2);
    houseRow(ctx, 1080, 4, C2.ochreD, t, false, 70);
    // a foreground rooftop edge gives the wide city depth
    paper(ctx, () => tornRectPath(ctx, -40, 1600, W + 80, 360, 20, 12), { fill: C2.ink2, edge: edge(0.25), edgeW: 3 });
    paper(ctx, () => tornRectPath(ctx, 80, 1560, 340, 70, 12, 15), { fill: C2.ink, edge: edge(0.2), edgeW: 2 });
    ground(1680, C2.ink, 11);
    P.smallLamp(ctx, 540, 1520, 2.1, true, t);
    P.smallLamp(ctx, 250, 1580, 0.9, true, t);
    for (let i = 0; i < 7; i += 1) {
      paper(ctx, () => blobPath(ctx, 760 + i * 38, 1560 + (i % 2) * 22, 8, 5, 7, 0.03, i), {
        fill: i % 2 ? C2.gold : C2.terra, edge: edge(0.25), edgeW: 1,
      });
    }
    finish(shot, t);
  }

  // 3. the name Ayodhya
  function p_ayodhya(shot, lt, t) {
    stage(C2.night, C2.tealD);
    portraitCam(shot, lt, shot.duration, 540, 980, 0.06, t);
    P.starField(ctx, t, 80, 860);
    P.moon(ctx, 850, 250, 70, t);
    P.temple(ctx, 70, 1280, 1.5, C2.ochreD);
    P.temple(ctx, 1010, 1280, 1.4, C2.ochreD);
    houseRow(ctx, 1120, 5, C2.ochreD, t, false, 40);
    // the gate
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(270, 1540); ctx.lineTo(270, 1040);
      ctx.quadraticCurveTo(540, 840, 810, 1040); ctx.lineTo(810, 1540); ctx.closePath();
    }, { fill: C2.ochre, edge: edge(0.55), edgeW: 4, shadow: C.rgba(C2.ink, 0.25), sx: 10, sy: 16 });
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(400, 1540); ctx.lineTo(400, 1180);
      ctx.quadraticCurveTo(540, 1060, 680, 1180); ctx.lineTo(680, 1540); ctx.closePath();
    }, { fill: C2.redD, edge: C.rgba(C2.gold, 0.45), edgeW: 3 });
    glow(540, 1360, 260, C2.goldL, 0.2);
    // the road into the city
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(390, 1540); ctx.lineTo(690, 1540);
      ctx.lineTo(900, 1920); ctx.lineTo(180, 1920); ctx.closePath();
    }, { fill: C2.ochreD, edge: edge(0.3), edgeW: 2 });
    ground(1540, C2.ink2, 13);
    rama(ctx, 470, 1720, 0.72);
    silhouette(ctx, 570, 1720, 0.64, C2.ink2);
    silhouette(ctx, 660, 1720, 0.58, C2.ink2);
    P.diya(ctx, 870, 1540, 1.8, true, t);
    finish(shot, t);
  }

  // 4. fourteen years (forest)
  function p_exile(shot, lt, t) {
    stage(C2.tealD, C2.ink2);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 40, 600);
    P.moon(ctx, 850, 250, 66, t);
    // forest trunks
    for (let i = 0; i < 6; i += 1) {
      const x = 40 + i * 190;
      paper(ctx, () => tornRectPath(ctx, x, 220 + (i % 3) * 40, 54, 1180, 8, i), {
        fill: i % 2 ? C2.tealD : C2.ink2, edge: edge(0.45), edgeW: 2,
      });
      ctx.strokeStyle = C.rgba(C2.cream, 0.22); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x + 20, 420); ctx.lineTo(x - 50 + (i % 2) * 140, 300); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 30, 700); ctx.lineTo(x + 120 - (i % 2) * 60, 560); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 30, 980); ctx.lineTo(x - 40 + (i % 2) * 70, 860); ctx.stroke();
    }
    // path
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(360, 1460); ctx.lineTo(720, 1460);
      ctx.lineTo(940, 1920); ctx.lineTo(140, 1920); ctx.closePath();
    }, { fill: C2.ochreD, edge: edge(0.3), edgeW: 2 });
    ground(1460, C2.ink2, 17);
    silhouette(ctx, 420, 1720, 1.16, C2.ink);
    silhouette(ctx, 540, 1720, 1.08, C2.ink);
    silhouette(ctx, 660, 1720, 1.0, C2.ink);
    // fireflies and the fourteen marks
    for (let i = 0; i < 14; i += 1) {
      paper(ctx, () => blobPath(ctx, 300 + i * 34, 1660 - (i % 4) * 26, 5, 5, 6, 0.02, i), {
        fill: i % 3 ? C2.gold : C2.cream, edge: null,
      });
    }
    glow(540, 1320, 300, C2.goldL, 0.12);
    finish(shot, t);
  }

  // 5. the victory
  function p_victory(shot, lt, t) {
    stage(C2.redD, C2.ink2);
    portraitCam(shot, lt, shot.duration, 540, 980, 0.06, t);
    P.starField(ctx, t, 60, 700);
    // rays behind the sun, so the victory has a graphic edge
    ctx.strokeStyle = C.rgba(C2.cream, 0.6); ctx.lineWidth = 14; ctx.lineCap = "round";
    for (let i = 0; i < 20; i += 1) {
      const a = Math.PI + (i / 19) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(540 + Math.cos(a) * 420, 1060 + Math.sin(a) * 420);
      ctx.lineTo(540 + Math.cos(a) * 650, 1060 + Math.sin(a) * 650);
      ctx.stroke();
    }
    ctx.fillStyle = C.rgba(C2.gold, 0.38);
    ctx.beginPath(); ctx.arc(540, 1060, 420, Math.PI, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 34; i += 1) {
      paper(ctx, () => blobPath(ctx, 60 + (i * 137) % 960, 340 + (i * 73) % 980, 15, 8, 7, 0.04, i), {
        fill: i % 3 === 0 ? C2.cream : C2.goldL, edge: C.rgba(C2.ink, 0.25), edgeW: 1,
      });
    }
    // the city below the victory
    houseRow(ctx, 1510, 6, C2.ink, t, false, 28);
    glow(540, 1200, 440, C2.goldL, 0.22);
    ground(1800, C2.ink2, 19);
    rama(ctx, 540, 1800, 2.1);
    // broken bow at his feet
    ctx.strokeStyle = C2.ink; ctx.lineWidth = 16; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(760, 1640); ctx.lineTo(960, 1720); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(820, 1590); ctx.lineTo(990, 1660); ctx.stroke();
    ctx.strokeStyle = C2.cream; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(780, 1610); ctx.lineTo(820, 1660); ctx.stroke();
    // lit windows in the city and a foreground crowd, so the victory is not a vacuum
    for (let i = 0; i < 14; i += 1) {
      paper(ctx, () => tornRectPath(ctx, 70 + i * 68, 1560 + (i % 3) * 18, 26, 34, 5, i + 90), {
        fill: i % 2 ? C2.goldL : C2.cream, edge: edge(0.3), edgeW: 1,
      });
    }
    for (let i = 0; i < 7; i += 1) {
      const x = 40 + i * 160;
      paper(ctx, () => blobPath(ctx, x, 1850, 66, 74, 12, 0.04, i + 100), {
        fill: C2.ink, edge: C.rgba(C2.cream, 0.4), edgeW: 3,
      });
      paper(ctx, () => tornRectPath(ctx, x - 80, 1900, 160, 160, 12, i + 110), {
        fill: C2.ink, edge: C.rgba(C2.cream, 0.25), edgeW: 2,
      });
    }
    finish(shot, t);
  }

  // 6. the darkest night
  function p_night(shot, lt, t) {
    stage(C2.ink, C2.ink2);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.03, t);
    P.starField(ctx, t, 220, 1400);
    P.moon(ctx, 840, 230, 90, t);
    // rays, clouds and big paper stars give the dark field an edge
    ctx.strokeStyle = C.rgba(C2.cream, 0.45); ctx.lineWidth = 10; ctx.lineCap = "round";
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * TAU;
      ctx.beginPath();
      ctx.moveTo(540 + Math.cos(a) * 390, 1420 + Math.sin(a) * 390);
      ctx.lineTo(540 + Math.cos(a) * 620, 1420 + Math.sin(a) * 620);
      ctx.stroke();
    }
    for (let i = 0; i < 3; i += 1) {
      paper(ctx, () => tornRectPath(ctx, 110 + i * 80, 560 + i * 160, 760 - i * 120, 54, 18, i + 140), {
        fill: C2.cream, edge: edge(0.4), edgeW: 2,
      });
    }
    for (let i = 0; i < 18; i += 1) {
      paper(ctx, () => blobPath(ctx, 60 + (i * 97) % 960, 360 + (i * 67) % 900, 16, 9, 7, 0.03, i + 150), {
        fill: i % 3 === 0 ? C2.goldL : C2.cream, edge: C.rgba(C2.ink, 0.2), edgeW: 1,
      });
    }
    ground(1700, C2.ink, 21);
    for (let i = 0; i < 18; i += 1) {
      const gx = 30 + (i * 113) % 1020;
      ctx.strokeStyle = i % 3 === 0 ? C2.goldD : C2.ink2; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(gx, 1880); ctx.quadraticCurveTo(gx - 12, 1800, gx - 20, 1740); ctx.stroke();
    }
    glow(540, 1420, 430, C2.goldL, 0.3);
    P.diya(ctx, 540, 1540, 5.0, true, t, "diya");
    finish(shot, t);
  }

  // 7. a diya at every door
  function p_lamps(shot, lt, t) {
    stage(C2.ink2, C2.night);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 80, 760);
    houseRow(ctx, 900, 3, C2.ochreD, t, true, 70);
    ground(1580, C2.ink2, 23);
    for (let i = 0; i < 5; i += 1) {
      const x = 60 + i * 210;
      const lit = lt > 0.2 + i * 0.28;
      paper(ctx, () => tornRectPath(ctx, x, 1080, 160, 430, 8, i + 2), {
        fill: C2.ink2, edge: edge(0.55), edgeW: 3,
      });
      paper(ctx, () => tornRectPath(ctx, x + 22, 1120, 116, 390, 6, i + 9), { fill: C2.redD, edge: edge(0.3), edgeW: 2 });
      for (let k = 0; k < 4; k += 1) marigold(x + 40 + k * 28, 1060 + (k % 2) * 12, 0.55, i * 4 + k);
      P.smallLamp(ctx, x + 80, 1460, 1.35, lit, t);
    }
    // the foreground step
    paper(ctx, () => tornRectPath(ctx, -40, 1700, W + 80, 260, 18, 25), { fill: C2.ochreD, edge: edge(0.35), edgeW: 3 });
    paper(ctx, () => tornRectPath(ctx, -40, 1760, W + 80, 220, 14, 27), { fill: C2.ink2, edge: edge(0.2), edgeW: 2 });
    finish(shot, t);
  }

  // 8. the road of light
  function p_road(shot, lt, t) {
    stage(C2.ink2, C2.tealD);
    portraitCam(shot, lt, shot.duration, 540, 980, 0.07, t);
    P.starField(ctx, t, 90, 800);
    P.moon(ctx, 860, 240, 64, t);
    // gate at the horizon
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(250, 1220); ctx.lineTo(250, 820);
      ctx.quadraticCurveTo(540, 620, 830, 820); ctx.lineTo(830, 1220); ctx.closePath();
    }, { fill: C2.ochre, edge: edge(0.6), edgeW: 4, shadow: C.rgba(C2.ink, 0.22), sx: 8, sy: 12 });
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(390, 1220); ctx.lineTo(390, 950);
      ctx.quadraticCurveTo(540, 830, 690, 950); ctx.lineTo(690, 1220); ctx.closePath();
    }, { fill: C2.redD, edge: C.rgba(C2.gold, 0.5), edgeW: 3 });
    ground(1220, C2.ink2, 25);
    // the road
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(400, 1220); ctx.lineTo(680, 1220);
      ctx.lineTo(940, 1920); ctx.lineTo(140, 1920); ctx.closePath();
    }, { fill: C2.ochreD, edge: edge(0.35), edgeW: 3 });
    // sixteen lamps down both edges
    for (let i = 0; i < 16; i += 1) {
      const p = i / 15;
      const side = i % 2 === 0 ? -1 : 1;
      const x = 540 + side * (60 + 300 * p);
      const y = 1240 + p * 600;
      const s = 0.6 + p * 1.6;
      P.diya(ctx, x, y, s, lt > 0.1 + p * 0.7, t);
    }
    glow(540, 1160, 260, C2.goldL, 0.25);
    finish(shot, t);
  }

  // 9. a home keeps a lamp
  function p_home(shot, lt, t) {
    stage(C2.night, C2.indigo);
    portraitCam(shot, lt, shot.duration, 540, 980, 0.04, t);
    P.moon(ctx, 840, 240, 84, t);
    P.starField(ctx, t, 50, 800);
    P.house(ctx, 100, 1100, 700, 680, C2.ochre, C2.terraD, true, t, { doorW: 180 });
    // a deep lit window with mullions
    paper(ctx, () => tornRectPath(ctx, 220, 880, 330, 300, 10, 3), {
      fill: C2.redD, edge: C.rgba(C2.gold, 0.7), edgeW: 4,
    });
    paper(ctx, () => tornRectPath(ctx, 245, 905, 280, 250, 8, 5), { fill: C2.goldL, edge: null });
    ctx.strokeStyle = C2.ink2; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(385, 905); ctx.lineTo(385, 1155); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(245, 1020); ctx.lineTo(525, 1020); ctx.stroke();
    // the lamp inside the window
    P.smallLamp(ctx, 330, 1080, 0.9, true, t);
    glow(385, 1040, 260, C2.goldL, 0.4);
    // the sill lamp
    paper(ctx, () => tornRectPath(ctx, 200, 1180, 370, 42, 8, 7), { fill: C2.terraD, edge: edge(0.4), edgeW: 2 });
    P.diya(ctx, 500, 1180, 1.5, true, t);
    // a tree at the edge of the house
    paper(ctx, () => tornRectPath(ctx, 850, 1220, 40, 420, 8, 6), { fill: C2.ink2, edge: edge(0.3), edgeW: 2 });
    for (let i = 0; i < 5; i += 1) {
      paper(ctx, () => blobPath(ctx, 870 + Math.sin(i * 1.4) * 70, 1120 + i * 40, 70, 46, 12, 0.03, i), {
        fill: C2.tealD, edge: edge(0.3), edgeW: 2,
      });
    }
    ground(1680, C2.ink2, 27);
    P.diya(ctx, 540, 1660, 2.2, true, t, "diya");
    finish(shot, t);
  }

  // 10. five days: five panels drop into a row
  function p_five_a(shot, lt, t) {
    stage(C2.cream, C2.paper);
    portraitCam(shot, lt, shot.duration, 540, 900, 0.04, t);
    ctx.strokeStyle = C2.red; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(30, 300); ctx.lineTo(1050, 300); ctx.stroke();
    const cols = [C2.terra, C2.gold, C2.red, C2.greenD, C2.ochreD];
    for (let i = 0; i < 5; i += 1) {
      const x = 40 + i * 200;
      const drop = Math.min(1, Math.max(0, (lt - i * 0.12) / 0.4));
      paper(ctx, () => tornRectPath(ctx, x, 380 - (1 - drop) * 160, 180, 760, 8, i), {
        fill: cols[i], edge: edge(0.5), edgeW: 3, shadow: C.rgba(C2.ink, 0.2), sx: 6, sy: 10,
      });
      P.smallLamp(ctx, x + 90, 650, 1.3, drop > 0.8, t);
      for (let k = 0; k < 3; k += 1) {
        paper(ctx, () => blobPath(ctx, x + 55 + k * 35, 980 + (k % 2) * 22, 11, 8, 8, 0.03, i * 3 + k), {
          fill: k % 2 ? C2.cream : C2.goldL, edge: edge(0.3), edgeW: 1,
        });
      }
    }
    ground(1540, C2.goldL, 29);
    paper(ctx, () => tornRectPath(ctx, -40, 1600, W + 80, 360, 18, 31), { fill: C2.paper, edge: edge(0.35), edgeW: 2 });
    finish(shot, t);
  }

  // 11. the first three names, as three paper cards
  function p_five_b(shot, lt, t) {
    stage(C2.cream, C2.paper);
    portraitCam(shot, lt, shot.duration, 540, 900, 0.04, t);
    ctx.strokeStyle = C2.red; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(30, 300); ctx.lineTo(1050, 300); ctx.stroke();
    const cols = [C2.terra, C2.gold, C2.red];
    for (let i = 0; i < 3; i += 1) {
      const x = 70 + i * 320;
      const turn = Math.min(1, Math.max(0, (lt - i * 0.25) / 0.45));
      paper(ctx, () => tornRectPath(ctx, x, 500, 290, 470, 10, i + 8), {
        fill: cols[i], edge: edge(0.55), edgeW: 3, shadow: C.rgba(C2.ink, 0.22), sx: 7, sy: 12,
      });
      const cx = x + 145;
      if (i === 0) {
        paper(ctx, () => blobPath(ctx, cx, 720, 70, 70, 22, 0.02, 2), {
          fill: C2.goldL, edge: C.rgba(C2.ink, 0.4), edgeW: 3,
        });
        ctx.fillStyle = C2.red; ctx.beginPath(); ctx.arc(cx, 720, 8, 0, TAU); ctx.fill();
      } else if (i === 1) {
        P.smallLamp(ctx, cx, 760, 2.1, turn > 0.5, t);
      } else {
        for (let k = 0; k < 7; k += 1) {
          const a = (k / 7) * TAU;
          paper(ctx, () => blobPath(ctx, cx + Math.cos(a) * 44, 700 + Math.sin(a) * 36, 27, 40, 12, 0.02, k), {
            fill: C2.cream, edge: edge(0.45), edgeW: 2,
          });
        }
        paper(ctx, () => blobPath(ctx, cx, 700, 26, 26, 12, 0.02, 9), { fill: C2.gold, edge: null });
      }
      // a ticket hole and a string
      ctx.fillStyle = C2.cream; ctx.beginPath(); ctx.arc(x + 145, 545, 9, 0, TAU); ctx.fill();
      ctx.strokeStyle = C2.cream; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + 145, 540); ctx.lineTo(x + 145, 500); ctx.stroke();
    }
    finish(shot, t);
  }

  // 12. the five names complete: the last two light, the first three wait
  function p_names(shot, lt, t) {
    stage(C2.cream, C2.paper);
    portraitCam(shot, lt, shot.duration, 540, 950, 0.03, t);
    const cols = [C2.terra, C2.gold, C2.red, C2.greenD, C2.ochreD];
    for (let i = 0; i < 5; i += 1) {
      const x = 50 + i * 196;
      const lit = i >= 3;
      paper(ctx, () => tornRectPath(ctx, x, 500, 170, 680, 8, i), {
        fill: lit ? cols[i] : C.rgba(cols[i], 0.32),
        edge: edge(lit ? 0.55 : 0.3), edgeW: 2,
      });
      P.smallLamp(ctx, x + 85, 780, 1.3, lit, t);
      paper(ctx, () => blobPath(ctx, x + 85, 1010 + (i % 2) * 20, 18, 12, 8, 0.03, i), {
        fill: C2.cream, edge: edge(0.3), edgeW: 1,
      });
      if (lit) glow(x + 85, 780, 100, C2.goldL, 0.3);
    }
    // the tilak card belongs to the last two days
    paper(ctx, () => roundRectPath(ctx, 300, 1260, 480, 220, 22), {
      fill: C2.cream, edge: edge(0.55), edgeW: 4, shadow: C.rgba(C2.ink, 0.2), sx: 8, sy: 12,
    });
    ctx.fillStyle = C2.red; ctx.beginPath(); ctx.arc(540, 1370, 34, 0, TAU); ctx.fill();
    ground(1580, C2.paper, 33);
    finish(shot, t);
  }

  // 13. rangoli at the door
  function p_rangoli(shot, lt, t) {
    stage(C2.ink2, C2.night);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 50, 700);
    ground(1300, C2.cream, 35);
    const progress = C.smooth(C.clamp((lt - 0.1) / 1.4));
    P.rangoli(ctx, 460, 1400, 390, progress, t);
    // powder bowls and petals
    for (let i = 0; i < 4; i += 1) {
      paper(ctx, () => blobPath(ctx, 100 + i * 52, 1650 + (i % 2) * 30, 22, 14, 8, 0.03, i), {
        fill: [C2.red, C2.gold, C2.cream, C2.greenD][i], edge: edge(0.35), edgeW: 2,
      });
    }
    // powder dots and a threshold line around the rangoli
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * TAU;
      paper(ctx, () => blobPath(ctx, 460 + Math.cos(a) * 430, 1400 + Math.sin(a) * 390, 8, 5, 7, 0.03, i), {
        fill: i % 3 === 0 ? C2.greenD : i % 3 === 1 ? C2.red : C2.gold, edge: null,
      });
    }
    ctx.strokeStyle = C2.ink2; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(30, 1310); ctx.lineTo(700, 1310); ctx.stroke();
    backdrop(600, 1240, 460, 640, 37, C2.ink);
    drawCharacter("Child", 760, 1800, 0.75, "hold", -1, P.blendAt("Child", "hold", "place", lt / 1.4), t, {
      face: { ...(faceAt(shot, lt, "Child") || {}), look: [-1, 0.2] },
    });
    marigold(700, 1720, 1.1, 12);
    finish(shot, t);
  }

  // 14. Lakshmi welcomed
  function p_puja(shot, lt, t) {
    stage(C2.ink2, C2.terraD);
    portraitCam(shot, lt, shot.duration, 540, 980, 0.04, t);
    // shrine arch
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(200, 1360); ctx.lineTo(200, 740);
      ctx.quadraticCurveTo(540, 420, 880, 740); ctx.lineTo(880, 1360); ctx.closePath();
    }, { fill: C2.redD, edge: C.rgba(C2.gold, 0.6), edgeW: 4, shadow: C.rgba(C2.ink, 0.25), sx: 10, sy: 16 });
    // hanging lamps
    for (const x of [270, 810]) {
      ctx.strokeStyle = C2.gold; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, 720); ctx.lineTo(x, 820); ctx.stroke();
      P.smallLamp(ctx, x, 840, 1.0, true, t);
    }
    // marigold garland across the arch
    for (let i = 0; i < 11; i += 1) marigold(250 + i * 58, 700 + Math.sin(i * 0.7) * 18, 0.75, i);
    // Lakshmi: crown, face, sari, four arms
    paper(ctx, () => blobPath(ctx, 540, 920, 78, 90, 18, 0.02, 4), { fill: C2.skin || "#E9B26F", edge: edge(0.55), edgeW: 3 });
    // face
    ctx.fillStyle = C2.ink;
    ctx.beginPath(); ctx.arc(515, 910, 6, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(565, 910, 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = C2.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(540, 935, 18, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = C2.red; ctx.beginPath(); ctx.arc(540, 875, 6, 0, TAU); ctx.fill();
    // crown
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(465, 830); ctx.lineTo(500, 720); ctx.lineTo(540, 800);
      ctx.lineTo(580, 720); ctx.lineTo(615, 830); ctx.closePath();
    }, { fill: C2.goldL, edge: edge(0.5), edgeW: 3 });
    // sari
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(460, 1010); ctx.lineTo(620, 1010);
      ctx.lineTo(690, 1360); ctx.lineTo(390, 1360); ctx.closePath();
    }, { fill: C2.gold, edge: edge(0.55), edgeW: 3 });
    // four arms
    for (const side of [-1, 1]) {
      ctx.strokeStyle = C2.skin || "#E9B26F"; ctx.lineWidth = 22; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(540 + side * 50, 1040); ctx.lineTo(540 + side * 190, 920); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(540 + side * 50, 1110); ctx.lineTo(540 + side * 200, 1180); ctx.stroke();
      ctx.fillStyle = C2.gold;
      ctx.beginPath(); ctx.arc(540 + side * 200, 1180, 14, 0, TAU); ctx.fill();
    }
    // a lotus in the upper hand
    for (let k = 0; k < 6; k += 1) {
      const a = (k / 6) * TAU;
      paper(ctx, () => blobPath(ctx, 350 + Math.cos(a) * 26, 910 + Math.sin(a) * 30, 20, 30, 10, 0.02, k), {
        fill: C2.pink || "#D98BA3", edge: edge(0.4), edgeW: 2,
      });
    }
    paper(ctx, () => blobPath(ctx, 350, 910, 18, 18, 10, 0.02, 9), { fill: C2.goldL, edge: null });
    // the thali
    P.thali(ctx, 540, 1590, 2.2, t);
    glow(540, 1500, 340, C2.goldL, 0.25);
    finish(shot, t);
  }

  // 15. Govardhan
  function p_govardhan(shot, lt, t) {
    stage(C2.greenD, C2.paper);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.04, t);
    ctx.fillStyle = C.rgba(C2.gold, 0.75);
    ctx.beginPath(); ctx.arc(860, 340, 118, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(C2.cream, 0.7); ctx.lineWidth = 12; ctx.lineCap = "round";
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * TAU;
      ctx.beginPath();
      ctx.moveTo(860 + Math.cos(a) * 140, 340 + Math.sin(a) * 140);
      ctx.lineTo(860 + Math.cos(a) * 260, 340 + Math.sin(a) * 260);
      ctx.stroke();
    }
    // torn-paper cloud bands across the sky
    for (let i = 0; i < 3; i += 1) {
      paper(ctx, () => tornRectPath(ctx, 220 + i * 60, 700 + i * 150, 720 - i * 80, 46, 18, i + 130), {
        fill: C2.cream, edge: edge(0.4), edgeW: 2,
      });
    }
    // a big canopy fills the top-left corner
    for (let i = 0; i < 9; i += 1) {
      paper(ctx, () => blobPath(ctx, 20 + (i * 73) % 430, 620 + (i * 61) % 330, 92, 68, 12, 0.04, i + 120), {
        fill: i % 2 ? C2.tealD : C2.greenD, edge: edge(0.45), edgeW: 3,
      });
    }
    // hill
    paper(ctx, () => {
      ctx.beginPath(); ctx.moveTo(40, 1520); ctx.quadraticCurveTo(540, 720, 1040, 1520); ctx.closePath();
    }, { fill: C2.green, edge: edge(0.55), edgeW: 4, shadow: C.rgba(C2.ink, 0.2), sx: 8, sy: 12 });
    for (let i = 0; i < 4; i += 1) {
      ctx.strokeStyle = C.rgba(C2.cream, 0.25); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(340 + i * 120, 1420); ctx.quadraticCurveTo(420 + i * 120, 1200, 540 + i * 40, 1100); ctx.stroke();
    }
    // a tree at the field edge, and a fence on the other side
    paper(ctx, () => tornRectPath(ctx, 100, 1040, 34, 560, 8, 51), { fill: C2.ink2, edge: edge(0.4), edgeW: 2 });
    for (let i = 0; i < 7; i += 1) {
      ctx.strokeStyle = C2.ink2; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(117, 1220 + i * 42);
      ctx.lineTo(30 + (i % 3) * 90, 1120 + i * 26); ctx.stroke();
      paper(ctx, () => blobPath(ctx, 40 + (i % 3) * 90, 1100 + i * 26, 44, 30, 10, 0.03, i + 60), {
        fill: i % 2 ? C2.tealD : C2.greenD, edge: edge(0.3), edgeW: 2,
      });
    }
    for (let i = 0; i < 7; i += 1) {
      paper(ctx, () => tornRectPath(ctx, 800 + i * 36, 1370 + (i % 2) * 12, 18, 160, 5, i + 70), {
        fill: C2.ochreD, edge: edge(0.35), edgeW: 2,
      });
    }
    ctx.strokeStyle = C2.ochreD; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(790, 1410); ctx.lineTo(1030, 1430); ctx.stroke();
    ground(1600, C2.greenD, 37);
    // furrows and grass give the field an edge
    ctx.strokeStyle = C.rgba(C2.cream, 0.2); ctx.lineWidth = 4;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath(); ctx.moveTo(80 + i * 140, 1900); ctx.quadraticCurveTo(180 + i * 120, 1700, 300 + i * 90, 1560); ctx.stroke();
    }
    for (let i = 0; i < 34; i += 1) {
      const gx = 40 + (i * 89) % 1000;
      const gy = 1660 + (i * 47) % 220;
      ctx.strokeStyle = i % 3 ? C2.green : C2.goldD; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + 6, gy - 26, gx + 14, gy - 44); ctx.stroke();
    }
    // big paper tufts, three blades each
    for (let i = 0; i < 22; i += 1) {
      const gx = 40 + (i * 131) % 1000;
      const gy = 1700 + (i * 67) % 200;
      for (let k = 0; k < 3; k += 1) {
        ctx.strokeStyle = k === 1 ? C2.goldL : k === 0 ? C2.green : C2.cream;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.quadraticCurveTo(gx - 22 + k * 18, gy - 70, gx - 30 + k * 24, gy - 120 - k * 18);
        ctx.stroke();
      }
    }
    // the cow
    const cowX = 740;
    const cowY = 1530;
    paper(ctx, () => blobPath(ctx, cowX, cowY, 160, 96, 14, 0.03, 8), { fill: C2.cream, edge: edge(0.55), edgeW: 3 });
    paper(ctx, () => blobPath(ctx, cowX - 150, cowY - 70, 70, 66, 12, 0.03, 9), { fill: C2.cream, edge: edge(0.55), edgeW: 3 });
    // horns and ears
    ctx.strokeStyle = C2.ochreD; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cowX - 180, cowY - 120); ctx.quadraticCurveTo(cowX - 210, cowY - 180, cowX - 170, cowY - 190); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cowX - 120, cowY - 120); ctx.quadraticCurveTo(cowX - 90, cowY - 180, cowX - 130, cowY - 190); ctx.stroke();
    ctx.fillStyle = C2.ink2;
    ctx.beginPath(); ctx.arc(cowX - 175, cowY - 90, 7, 0, TAU); ctx.fill();
    // four legs and a tail
    ctx.strokeStyle = C2.ink2; ctx.lineWidth = 12;
    for (const dx of [-100, -40, 80, 140]) {
      ctx.beginPath(); ctx.moveTo(cowX + dx, cowY + 70); ctx.lineTo(cowX + dx, cowY + 190); ctx.stroke();
    }
    ctx.strokeStyle = C2.ochreD; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(cowX + 150, cowY); ctx.quadraticCurveTo(cowX + 220, cowY + 40, cowX + 200, cowY + 120); ctx.stroke();
    // the grain bundle
    for (let i = 0; i < 26; i += 1) {
      ctx.strokeStyle = i % 3 ? C2.goldD : C2.ochreD; ctx.lineWidth = 4;
      const bx = 300 + (i - 13) * 3;
      ctx.beginPath(); ctx.moveTo(bx, 1520); ctx.quadraticCurveTo(bx + (i - 13) * 6, 1280, bx + (i - 13) * 9, 1120 + (i % 4) * 16); ctx.stroke();
      paper(ctx, () => blobPath(ctx, bx + (i - 13) * 9, 1112 + (i % 4) * 16, 7, 16, 7, 0.02, i), {
        fill: C2.goldD, edge: null,
      });
    }
    ctx.strokeStyle = C2.red; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(215, 1450); ctx.lineTo(385, 1450); ctx.stroke();
    finish(shot, t);
  }

  // 16. Bhai Dooj
  function p_bhaidooj(shot, lt, t) {
    stage(C2.night, C2.indigo);
    portraitCam(shot, lt, shot.duration, 540, 1050, 0.04, t);
    P.starField(ctx, t, 50, 700);
    P.house(ctx, 80, 1080, 920, 720, C2.ochre, C2.terraD, true, t, { doorW: 320 });
    // the warm door
    paper(ctx, () => tornRectPath(ctx, 370, 1160, 340, 520, 10, 3), { fill: C2.goldL, edge: C.rgba(C2.gold, 0.7), edgeW: 3 });
    glow(540, 1400, 300, C2.goldL, 0.3);
    for (let i = 0; i < 8; i += 1) marigold(330 + i * 60, 1120 + Math.sin(i * 0.8) * 16, 0.7, i);
    // a hanging lantern lifts the wall and gives the frame a warm edge
    ctx.strokeStyle = C2.ink2; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(540, 760); ctx.lineTo(540, 860); ctx.stroke();
    P.smallLamp(ctx, 540, 880, 1.3, true, t);
    glow(540, 900, 230, C2.goldL, 0.3);
    ground(1840, C2.ink2, 39);
    backdrop(220, 1060, 250, 800, 41);
    backdrop(680, 1090, 250, 770, 43);
    for (let i = 0; i < 9; i += 1) {
      paper(ctx, () => blobPath(ctx, 250 + (i % 3) * 60, 1130 + Math.floor(i / 3) * 210, 7, 7, 7, 0.02, i + 80), {
        fill: C2.goldL, edge: null,
      });
      paper(ctx, () => blobPath(ctx, 710 + (i % 3) * 60, 1160 + Math.floor(i / 3) * 210, 7, 7, 7, 0.02, i + 90), {
        fill: C2.cream, edge: null,
      });
    }
    drawCharacter("Householder", 300, 1840, 1.35, "accept", 1, P.blendAt("Householder", "hold", "offer", lt / 1.2), t, {
      face: { ...(faceAt(shot, lt, "Householder") || {}), look: [1, 0] },
    });
    drawCharacter("Child", 780, 1840, 1.2, "accept", -1, P.blendAt("Child", "hold", "accept", lt / 1.2), t, {
      face: { ...(faceAt(shot, lt, "Child") || {}), look: [-1, 0] },
    });
    // the tilak goes on the younger sibling's forehead
    const k = C.smooth(C.clamp((lt - 0.2) / 1.0));
    ctx.fillStyle = C2.red;
    ctx.beginPath(); ctx.arc(780, 1195 - 10 * k, 15, 0, TAU); ctx.fill();
    // the shared sweet, on a small plate between them
    paper(ctx, () => blobPath(ctx, 540, 1640, 86, 30, 14, 0.02, 4), { fill: C2.goldL, edge: edge(0.45), edgeW: 2 });
    for (let i = 0; i < 3; i += 1) {
      paper(ctx, () => blobPath(ctx, 505 + i * 35, 1610, 22, 18, 10, 0.02, i + 1), { fill: C2.gold, edge: edge(0.4), edgeW: 2 });
      paper(ctx, () => blobPath(ctx, 505 + i * 35, 1604, 8, 6, 7, 0.02, i + 6), { fill: C2.cream, edge: null });
    }
    P.smallLamp(ctx, 540, 1750, 1.2, true, t);
    finish(shot, t);
  }

  // 17. not only a lamp
  function p_promise(shot, lt, t) {
    stage(C2.ink, C2.ink2);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 140, 900);
    P.moon(ctx, 830, 250, 96, t);
    // rays and big stars fill the dark, so the close-up has an edge
    ctx.strokeStyle = C.rgba(C2.cream, 0.4); ctx.lineWidth = 10; ctx.lineCap = "round";
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * TAU;
      ctx.beginPath();
      ctx.moveTo(540 + Math.cos(a) * 390, 1440 + Math.sin(a) * 390);
      ctx.lineTo(540 + Math.cos(a) * 610, 1440 + Math.sin(a) * 610);
      ctx.stroke();
    }
    for (let i = 0; i < 3; i += 1) {
      paper(ctx, () => tornRectPath(ctx, 90 + i * 70, 520 + i * 150, 780 - i * 100, 52, 18, i + 160), {
        fill: C2.cream, edge: edge(0.4), edgeW: 2,
      });
    }
    for (let i = 0; i < 20; i += 1) {
      paper(ctx, () => blobPath(ctx, 50 + (i * 101) % 980, 340 + (i * 71) % 900, 16, 9, 7, 0.03, i + 170), {
        fill: i % 3 === 0 ? C2.goldL : C2.cream, edge: C.rgba(C2.ink, 0.2), edgeW: 1,
      });
    }
    // the row behind
    for (let i = 0; i < 9; i += 1) {
      P.smallLamp(ctx, 60 + i * 120, 1660 + (i % 2) * 22, 1.15, true, t);
    }
    glow(540, 1440, 480, C2.goldL, 0.32);
    P.diya(ctx, 540, 1500, 4.5, true, t, "diya");
    ground(1800, C2.ink2, 41);
    for (let i = 0; i < 16; i += 1) {
      const gx = 30 + (i * 127) % 1020;
      ctx.strokeStyle = i % 3 === 0 ? C2.goldD : C2.ink2; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(gx, 1880); ctx.quadraticCurveTo(gx + 12, 1820, gx + 22, 1770); ctx.stroke();
    }
    finish(shot, t);
  }

  // 18. the next lamp
  function p_close(shot, lt, t) {
    stage(C2.ink2, C2.night);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 60, 700);
    P.moon(ctx, 830, 250, 92, t);
    // a marigold string frames the close-up
    ctx.strokeStyle = C2.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(80, 560); ctx.quadraticCurveTo(540, 640, 1000, 560); ctx.stroke();
    for (let i = 0; i < 13; i += 1) marigold(100 + i * 70, 560 + Math.sin((i / 12) * Math.PI) * 60, 0.8, i);
    ground(1720, C2.ink2, 43);
    // row behind
    for (let i = 0; i < 5; i += 1) P.smallLamp(ctx, 90 + i * 230, 1300, 1.1, true, t);
    glow(540, 1480, 420, C2.goldL, 0.3);
    const light = C.smooth(C.clamp((lt - 0.4) / 0.8));
    P.diya(ctx, 540, 1500, 4.4, true, t, "diya");
    // the match
    ctx.strokeStyle = C2.cream; ctx.lineWidth = 10; ctx.lineCap = "round";
    const mx = 800 - 90 * light;
    ctx.beginPath(); ctx.moveTo(mx, 900); ctx.lineTo(585, 1420); ctx.stroke();
    ctx.fillStyle = C2.redD; ctx.beginPath(); ctx.arc(585, 1420, 13, 0, TAU); ctx.fill();
    glow(585, 1420, 60, C2.gold, 0.5);
    finish(shot, t);
  }

  // 19. the row answers
  function p_close_row(shot, lt, t) {
    stage(C2.ink, C2.night);
    portraitCam(shot, lt, shot.duration, 540, 1000, 0.05, t);
    P.starField(ctx, t, 100, 900);
    P.moon(ctx, 850, 260, 88, t);
    ctx.strokeStyle = C2.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(70, 620); ctx.quadraticCurveTo(540, 700, 1010, 620); ctx.stroke();
    for (let i = 0; i < 14; i += 1) marigold(90 + i * 69, 620 + Math.sin((i / 13) * Math.PI) * 62, 0.8, i + 20);
    ground(1600, C2.ink2, 45);
    // the row in front
    for (let i = 0; i < 8; i += 1) {
      const x = 60 + i * 135;
      P.diya(ctx, x, 1480 + (i % 2) * 26, 0.9 + 0.06 * i, true, t);
    }
    P.diya(ctx, 330, 1540, 2.4, true, t, "diya");
    backdrop(620, 1200, 420, 640, 47, C2.ink);
    drawCharacter("Child", 760, 1780, 0.85, "watch", -1, null, t, {
      face: { ...(faceAt(shot, lt, "Child") || {}), look: [-1, 0] },
    });
    glow(330, 1460, 260, C2.goldL, 0.28);
    finish(shot, t);
  }

  Object.assign(window.PAPER_BACKEND.shots, {
    p_door, p_wait, p_ayodhya, p_exile, p_victory, p_night, p_lamps, p_road,
    p_home, p_five_a, p_five_b, p_names, p_rangoli, p_puja, p_govardhan,
    p_bhaidooj, p_promise, p_close, p_close_row,
  });
})();
