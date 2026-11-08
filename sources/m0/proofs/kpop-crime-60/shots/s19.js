/* THE RUN — s19. Day 10, the same cell. The door closes behind him; he carries
   the court jacket in at his left side, folds it on the bench and looks at the
   calendar still reading ten. The room is behind the foreground bars; the file
   has gone to court. Push in, past the bars, to the page. */
scene({
  id: "s19", start: 51.52, end: 56.02, line: 18, cast: "MAN / WARDER",
  draw(t, lt, dur) {
    const doorT = syncLocal("s19", "e2");   // 1.06 — "back"
    const setT = syncLocal("s19", "e4");    // 1.84 — "cell,"
    const calT = syncLocal("s19", "e5");    // 2.80 — "calendar"

    setCam(
      C.kf(lt, [[0, 1000], [dur, 900]]),
      C.kf(lt, [[0, 540], [dur, 520]]),
      C.kf(lt, [[0, 1.00], [dur, 1.08]]),
      C.kf(lt, [[0, 0.004], [dur, -0.004]]),
      1.0, t
    );
    beginCam(ctx);
    cellSet(ctx, t);

    // the calendar: still the last page. A warm ring when he looks at it.
    const lookK = Math.exp(-Math.pow((lt - calT) / 0.45, 2));
    if (lookK > 0.01) {
      const g = ctx.createRadialGradient(560, 260, 20, 560, 260, 210);
      g.addColorStop(0, C.rgba("#FFE2A0", 0.28 * lookK));
      g.addColorStop(1, C.rgba("#FFE2A0", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(560, 260, 210, 0, TAU); ctx.fill();
    }
    calendarProp(ctx, 560, 260, 0.95, 10, t, 0, { oldDay: 10 });
    ctx.save();
    ctx.beginPath(); ctx.rect(490, 158, 140, 202); ctx.clip();
    cellBars(ctx);
    ctx.restore();

    // the door is open; the warder holds its edge and swings it shut on "back"
    const doorK = 1 - C.easeOut(C.clamp((lt - doorT) / 0.40));
    if (doorK > 0.01) {
      const light = ctx.createLinearGradient(1560, 0, 1920, 0);
      light.addColorStop(0, C.rgba("#FFD27A", 0.55 * doorK));
      light.addColorStop(1, C.rgba("#FFD27A", 0));
      ctx.fillStyle = light;
      ctx.beginPath(); ctx.moveTo(1560, 120); ctx.lineTo(1860, 120); ctx.lineTo(1920, 900); ctx.lineTo(1560, 900); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 14; i++) {
        const x = 1580 + C.hash(i * 3.1) * 320 + Math.sin(t * 1.3 + i) * 8;
        const y = 180 + C.hash(i * 7.7) * 680 - C.frac(t * 0.1 + C.hash(i * 5.3)) * 80;
        ctx.fillStyle = C.rgba("#FFE2A0", 0.30 * doorK);
        ctx.beginPath(); ctx.arc(x, y, 1.5 + C.hash(i * 9.1) * 2, 0, TAU); ctx.fill();
      }
    }

    // the door leaf swings shut
    ctx.save();
    ctx.translate(1860, 0);
    ctx.transform(1 - 0.62 * doorK, 0, -0.22 * doorK, 1, 0, 0);
    ctx.translate(-1860, 0);
    ctx.fillStyle = "#2A2E34"; ctx.fillRect(1580, 120, 280, 780);
    ctx.strokeStyle = "#6A7078"; ctx.lineWidth = 11; ctx.lineCap = "round";
    for (let x = 1600; x <= 1840; x += 60) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke(); }
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(1580, 400); ctx.lineTo(1860, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1580, 680); ctx.lineTo(1860, 680); ctx.stroke();
    ctx.strokeStyle = C.rgba("#9AA0A8", 0.5); ctx.lineWidth = 2;
    for (let x = 1597; x <= 1837; x += 60) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke(); }
    ctx.restore();

    // the warder at the door edge, his own right hand on the leaf, walking the
    // door shut and stepping out of frame as it lands. Cuffs on his belt.
    const wExit = C.easeOut(C.clamp((lt - doorT) / 0.55));
    const wx = C.lerp(1560, 1700, wExit);
    const wstep = Math.sin(lt * 7);
    // his hand holds the leaf while the door is moving, then drops to his side
    // as he walks out, so no hand is ever painted past the frame edge
    const wReach = 1 - wExit;
    const wp = {
      bounce: Math.sin(t * 4.1 + 1) * 0.7, sway: 1, lean: 0.03, yaw: 0.12, headTilt: 0.02, headTurn: 0.16,
      armL: [0.18, -0.18],
      armR: [C.lerp(-0.30, -0.85, wReach), C.lerp(0.22, 0.55, wReach)],
      footL: [-34 + 18 * wstep * (1 - wExit), -8], footR: [34 - 18 * wstep * (1 - wExit), -8],
    };
    warder(ctx, wx, 900, 0.98, t, wp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: doorT - 0.2, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: doorT + 0.3, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]));
    beltCuffs(ctx, wx - 52, 606, 0.52);

    // the man walks in from the door, carrying the court jacket at his left
    // side; the fold is drawn before him, so his own hand closes over its top
    const manX = C.lerp(1400, 900, C.easeOut(C.clamp(lt / 1.60)));
    const hold = { ...MAN_POSES.stand, armL: [0.45, -0.75], armR: [-0.28, 0.40], headTilt: 0.03, headTurn: 0.05 };
    const foldPose = { ...MAN_POSES.stand, armL: [0.30, -0.70], armR: [-0.40, 0.55], lean: 0.08, headTilt: 0.10, headTurn: 0.02 };
    const mp = poseAt(lt, [
      [0, hold],
      [1.60, hold],
      [setT, foldPose],
      [setT + 0.55, MAN_POSES.stand],
      [calT, { ...MAN_POSES.stand, headTurn: -0.30, headTilt: -0.06, lean: -0.01 }],
      [dur, { ...MAN_POSES.stand, headTurn: -0.26, headTilt: -0.04 }],
    ]);
    if (lt < 1.60) {
      const stride = Math.sin(lt * 9);
      mp.bounce = -Math.abs(stride) * 4;
      mp.lean = 0.12;
      mp.armR[0] -= 0.10 * stride;
      mp.footL = [-34 + 25 * stride, -8 - 40 * Math.max(0, -stride)];
      mp.footR = [34 - 25 * stride, -8 - 40 * Math.max(0, stride)];
    } else {
      plantFeet(mp);
    }
    mp.bounce += Math.sin(t * 5.4) * 1.0;
    // standing, he shifts his weight and keeps the page in his eye
    mp.lean += 0.035 * Math.sin(t * 5.6);
    mp.headTurn += 0.05 * Math.sin(t * 4.4);

    // the jacket: carried in one hand, then folded onto the bench. The carry
    // position is part of the man's left hand, not a floating chest prop.
    const setK = C.easeOut(C.clamp((lt - setT) / 0.50));
    const jx = C.lerp(manX - 100, 760, setK);
    const jy = C.lerp(656, 758, setK) - Math.sin(setK * Math.PI) * 26;
    if (setK < 0.999) {
      ctx.save();
      ctx.fillStyle = C.rgba(PAL.ink, 0.18);
      ctx.beginPath(); ctx.ellipse(jx, jy + 4, 74, 8, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    foldedCourtJacket(ctx, jx, jy, C.lerp(0.82, 0.90, setK), C.lerp(0.05, -0.03, setK));

    man(ctx, manX, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
        { t: calT - 0.15, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
        { t: calT, f: { eyes: "wide", mouth: "flat", look: [-1, -1] } },
        { t: calT + 0.45, f: { eyes: "closed", mouth: "flat", look: [-1, -1] } },
        { t: calT + 0.62, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
        { t: dur, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
      ]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D8D5CC", jacket: "#2F3B4A", trouser: "#6A6E72", shoe: "#171310", hair: "#171310" },
    });

    // THE FOREGROUND BARS: after the cast, the bench and the jacket,
    // before the title, so he is inside the cell, not painted on the grille.
    cellBarsFront(ctx);

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "THE SAME CELL", 120, 140, 88, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 47,
      perChar: (i) => C.clamp((t - 51.9 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "STILL", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CALENDAR SAID TEN", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
  },
});
