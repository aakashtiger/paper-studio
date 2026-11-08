/* THE RUN — s7. Day 10, dawn in the yard. The bell swings, the noose sways at
   the collar, dust turns in the light, and the last 0.4 s go to black. */
scene({
  id: "s7", start: 18.0, end: 21.0, line: 6, cast: "MAN",
  draw(t, lt, dur) {
    const bellT = syncLocal("s7", "e2"); // 2.1 — the bell
    const swing = lt < bellT
      ? 0.02 * Math.sin(lt * 1.6)
      : 0.42 * Math.exp(-(lt - bellT) * 0.9) * Math.sin((lt - bellT) * 8.5);
    const sway = 0.02 * Math.sin(lt * 1.3) + (lt > bellT ? 0.07 * Math.sin((lt - bellT) * 3.1) : 0);
    setCam(C.kf(lt, [[0, 960], [dur, 960]]), C.kf(lt, [[0, 540], [dur, 520]]), C.kf(lt, [[0, 1.0], [dur, 0.96]]), 0, 1.2, t);
    beginCam(ctx);
    yardSet(ctx, t, { bellSwing: swing, sunLift: C.clamp(lt / dur) * 30 });

    // the man is bound in front: both wrists meet at his waist, the rope wraps
    // them, and the noose and the wrist rope both follow his lean
    const boundArms = { armL: [-0.245, -0.421], armR: [0.245, 0.425] };
    const boundLift = { armL: [-0.3, -1.4], armR: [0.3, 1.4] };
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.bound, ...boundArms }],
      [1.2, { ...MAN_POSES.bound, ...boundArms }],
      [bellT - 0.3, { ...MAN_POSES.bound, ...boundLift }],
      [bellT + 0.4, { ...MAN_POSES.bound, ...boundArms }],
      [dur, { ...MAN_POSES.bound, ...boundArms }],
    ]);
    mp.bounce += Math.sin(t * 7.3) * 2.2;
    mp.headTilt += Math.sin(t * 9.1) * 0.025;
    mp.armL[0] += Math.sin(t * 8.1) * 0.025;
    mp.armR[0] += Math.sin(t * 7.7 + 1) * 0.025;
    const flinch = Math.exp(-Math.pow((lt - bellT) / 0.12, 2));
    // the bell tugs the bound wrists, but the two hands stay together
    mp.armL[0] += flinch * 0.05;
    mp.armR[0] -= flinch * 0.05;
    mp.headTilt += flinch * 0.06;
    const lean = mp.lean || 0;
    const torsoPoint = (lx, ly) => {
      const dx = lx, dy = ly + 280;
      const c = Math.cos(lean), s = Math.sin(lean);
      return [1320 + dx * c - dy * s, 900 - 280 + dx * s + dy * c];
    };
    const handPoint = (side) => {
      const arm = side === "L" ? mp.armL : mp.armR;
      const sx = side === "L" ? -80 : 80;
      const a1 = arm[0], a2 = arm[0] + arm[1];
      const lx = sx - Math.sin(a1) * 104 - Math.sin(a2) * 88;
      const ly = -500 + Math.cos(a1) * 104 + Math.cos(a2) * 88;
      const p = torsoPoint(lx, ly);
      p[1] += mp.bounce;
      return p;
    };
    const handL = handPoint("L"), handR = handPoint("R");
    const wristX = (handL[0] + handR[0]) / 2;
    const wristY = (handL[1] + handR[1]) / 2;
    const wristRot = Math.atan2(handR[1] - handL[1], handR[0] - handL[0]);
    const headPivot = torsoPoint(0, -530);
    const headX = headPivot[0] + Math.sin(mp.headTilt) * 74;
    const loop = torsoPoint(0, -490);
    const knot = [loop[0] + 32, loop[1] - 6];
    const sideX = headX + 86;
    nooseRope(ctx, 1320, 206, knot[0], knot[1], sway, 1.0, sideX);
    man(ctx, 1320, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }, { t: bellT - 0.2, f: { eyes: "narrow", mouth: "flat", look: [0, 0] } }, { t: bellT, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#C9C2B4", jacket: "#2F3B4A", trouser: "#6E6A60", shoe: "#171310", hair: "#171310" },
    });
    boundWrists(ctx, wristX, wristY - 10, 1.0, wristRot, t);
    nooseLoop(ctx, loop[0], loop[1], 1.0, sway);

    // the warder steps back when the bell sounds, off the platform; his near
    // hand rests on the condemned man's elbow with a bent arm
    const back = C.easeOut(C.clamp((lt - bellT) / 0.5));
    const wx = 1030 - back * 30;
    const wp = {
      bounce: Math.sin(t * 4.1) * 1.2, sway: 1, lean: -0.02, yaw: 0.1, headTilt: 0.02, headTurn: 0.1 - back * 0.3,
      armL: [0.12, 0.18], armR: [-0.12, 0.18],
      footL: [-34 - back * 18, -39], footR: [34 - back * 18, -39],
    };
    warder(ctx, wx, 900, 0.98, t, wp, faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: bellT, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]));
    // the warder's near sleeve, bent at the elbow, and his hand at the man's elbow
    const a1 = mp.armL[0];
    const elbow = torsoPoint(-80 - Math.sin(a1) * 104, -500 + Math.cos(a1) * 104);
    const wsh = [wx + 78.4, 410];
    const mid = [(wsh[0] + elbow[0]) / 2, (wsh[1] + elbow[1]) / 2];
    ctx.save();
    ctx.strokeStyle = "#2F3B4A"; ctx.lineWidth = 30; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(wsh[0], wsh[1]); ctx.quadraticCurveTo(mid[0] - 12, mid[1] + 56, elbow[0], elbow[1]); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(wsh[0], wsh[1]); ctx.quadraticCurveTo(mid[0] - 12, mid[1] + 56, elbow[0], elbow[1]); ctx.stroke();
    ctx.save(); ctx.translate(elbow[0], elbow[1]); ctx.rotate(0.55);
    ctx.fillStyle = "#B87A4E"; ctx.beginPath(); ctx.ellipse(0, 0, 13, 16, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = "#B87A4E"; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-2, 12); ctx.lineTo(-8 - i * 3, 22 + i * 2); ctx.stroke(); }
    ctx.restore();
    ctx.restore();

    // the bell's rings
    if (lt > bellT) {
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const k = C.frac((lt - bellT) * 0.7 + i / 3);
        ctx.strokeStyle = C.rgba("#FFD27A", (1 - k) * 0.5);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(370, 378, 90 + k * 260, -0.7, 0.7); ctx.stroke();
      }
      ctx.restore();
    }

    // dust and torn paper turning in the dawn light
    confetti(ctx, t, 26, [CREAM, MUSTARD, CORAL, "#C8A86A"], 0.38);

    // foreground yard rail, for depth and edge
    ctx.fillStyle = "#2A241E"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#4A3A2E"; ctx.fillRect(0, 980, W, 12);
    ctx.strokeStyle = "#14100C"; ctx.lineWidth = 8;
    for (let x = 40; x < W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 992); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#E8B84A", 0.16); ctx.fillRect(0, 980, W, 4);

    TY.type(ctx, "AT DAWN", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 29,
      perChar: (i) => C.clamp((t - 18.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE YARD · THE BELL", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE LAST PAGE TURNS", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);

    // the frame goes to black only in the last 0.4 s
    const k = C.easeOut(C.clamp((lt - 2.6) / 0.4));
    if (k > 0) { ctx.fillStyle = C.rgba("#08080A", k); ctx.fillRect(0, 0, W, H); }
  },
});
