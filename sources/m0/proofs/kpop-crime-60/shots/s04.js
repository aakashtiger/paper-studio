/* THE RUN — s04. Day 2, the wet station.
   The ticket comes out of the brass slot and into his right hand, thumb on the
   paper; the newspaper is tucked under his left arm. On "ran" he turns and goes
   for the platform. No detective is in this frame. The thief's olive work coat,
   grey flat cap and red scarf start here. */

scene({
  id: "s04", start: 8.7, end: 10.3, line: 3, cast: "MAN",
  draw(t, lt, dur) {
    const twoT = syncLocal("s04", "e1"); // 0.18 — "two"
    const ranT = syncLocal("s04", "e3"); // 1.50 — "ran"

    setCam(C.kf(lt, [[0, 780], [dur, 822]]), C.kf(lt, [[0, 548], [dur, 552]]), C.kf(lt, [[0, 1.16], [dur, 1.23]]), C.kf(lt, [[0, 0.006], [dur, -0.004]]), 1.0, t);
    beginCam(ctx);
    stationSet(ctx, t);

    // the newspaper under his left arm: drawn before him, so the arm clamps it
    ctx.save(); ctx.translate(632, 506); ctx.rotate(-0.24);
    paper(ctx, () => tornRectPath(ctx, -72, -94, 144, 188, 3, 5), { fill: "#E8DCC4", edge: C.rgba(INK, 0.5), edgeW: 2, shadow: C.rgba(INK, 0.3), sx: 4, sy: 7 });
    TY.text(ctx, "THE RUN", -58, -66, 13, { family: "Archivo Black", color: INK, letter: 1 });
    ctx.strokeStyle = C.rgba(INK, 0.32); ctx.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-58, -44 + i * 18); ctx.lineTo(58, -44 + i * 18); ctx.stroke(); }
    ctx.fillStyle = C.rgba(INK, 0.25); ctx.fillRect(-58, -50, 70, 34);
    ctx.restore();

    // the man: thief, hat down, scarf, at the slot
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, lean: -0.20, armL: [-0.16, 0.30], armR: [0.46, 0.14], headTurn: -0.30, headTilt: 0.02 }],
      [twoT, { ...MAN_POSES.stand, lean: -0.28, armL: [-0.16, 0.30], armR: [0.55, 0.15], headTurn: -0.34, headTilt: 0.04 }],
      [twoT + 0.30, { ...MAN_POSES.stand, lean: -0.24, armL: [-0.16, 0.30], armR: [0.38, 0.34], headTurn: -0.32, headTilt: 0.08 }],
      [0.86, { ...MAN_POSES.stand, lean: -0.10, armL: [-0.16, 0.30], armR: [0.06, 0.78], headTurn: -0.22, headTilt: 0.12 }],
      [1.16, { ...MAN_POSES.stand, lean: -0.06, armL: [-0.14, 0.28], armR: [0.02, 0.66], headTurn: -0.18, headTilt: 0.10 }],
      [1.30, { ...MAN_POSES.turn, lean: 0.10, armL: [0.42, 0.02], armR: [-0.46, 0.92], headTurn: 0.34, headTilt: 0.02 }],
      [1.42, { ...MAN_POSES.pace, lean: 0.26, yaw: -0.12, armL: [0.86, -0.34], armR: [-0.82, 0.52], footL: [-56, -34], footR: [70, -10], headTurn: 0.46, headTilt: 0.02 }],
      [1.54, { ...MAN_POSES.pace, lean: 0.30, yaw: -0.16, armL: [0.72, -0.26], armR: [-1.02, 0.44], footL: [62, -10], footR: [-52, -40], headTurn: 0.48, headTilt: 0.02 }],
      [dur, { ...MAN_POSES.pace, lean: 0.32, yaw: -0.18, armL: [0.96, -0.38], armR: [-1.12, 0.46], footL: [-54, -38], footR: [68, -10], headTurn: 0.50, headTilt: 0.02 }],
    ]);
    mp.bounce += Math.sin(t * 6.4) * 1.1;
    if (lt > 1.30) mp.bounce += -Math.abs(Math.sin(t * 13.0)) * 5;
    const manX = 700 + 100 * C.ease(C.clamp((lt - 1.24) / 0.36));
    man(ctx, manX, 905, 1.0, {
      t, pose: mp, role: "thief",
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
        { t: twoT, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
        { t: 0.86, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
        { t: 1.20, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: ranT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
      ]),
    });

    // the ticket: out of the slot on "two", then held in the right hand
    const h = castHand(manX, 905, 1.0, mp, "R");
    const outK = C.ease(C.clamp((lt - twoT) / 0.34));
    const takeK = C.ease(C.clamp((lt - 0.52) / 0.28));
    const liftK = C.ease(C.clamp((lt - 0.78) / 0.28));
    let tx = C.lerp(474, 548, outK);
    let ty = 566;
    tx = C.lerp(tx, h[0] + 14, takeK);
    ty = C.lerp(ty, h[1] + 2, takeK);
    tx = C.lerp(tx, h[0] + 10, liftK);
    ty = C.lerp(ty, h[1] - 2, liftK);
    const showTicket = lt > twoT + 0.05;
    if (showTicket) {
      ticketProp(ctx, tx, ty, 0.92, C.lerp(-0.04, 0.08, takeK), { title: "THE RUN", time: "02:10", code: "N2", route: "NORTH", note: "ONE WAY" });
      // the thumb over the ticket's near edge, and the wrist cuff behind it
      ctx.save(); ctx.translate(tx - 40, ty + 18); ctx.rotate(-0.42);
      ctx.fillStyle = "#C98A5A";
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 15, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 1.3; ctx.stroke();
      ctx.restore();
    }

    rainStreaks(ctx, t, 28, "#D8E8F8", 0.17, 1.4);
    endCam(ctx);

    // the corner page: day 2
    calendarProp(ctx, 1786, 990, 0.32, 2, t, 0, { oldDay: 2 });

    TY.type(ctx, "THE STATION", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 17,
      perChar: (i) => C.clamp((t - 8.85 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE STATION · 02:10", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "ONE TICKET, ONE WAY", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "ONE WAY", 1340, 780, 24, { fill: MUSTARD, text: INK, seed: 11, rot: -0.04, time: t });
  },
});
