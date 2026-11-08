/* THE RUN — s06. Day 4, the night train.
   The thief lays the ticket on the empty facing seat on "ticket"; the window
   goes black in the tunnel on "tunnel,"; the detective's shadow fills the
   vestibule on "dark." The carriage is a carriage: window band, seat row,
   luggage rack, aisle and the door. He leaves the ticket and slips out. */

scene({
  id: "s06", start: 13.04, end: 17.28, line: 5, cast: "MAN",
  draw(t, lt, dur) {
    const tunnelT = syncLocal("s06", "e3"); // 1.68 — "tunnel,"
    const ticketT = syncLocal("s06", "e4"); // 2.44 — "ticket"
    const darkT = syncLocal("s06", "e6");   // 3.52 — "dark."

    const tunnel = C.ease(C.clamp((lt - tunnelT) / 0.34));
    setCam(C.kf(lt, [[0, 950], [dur, 996]]), C.kf(lt, [[0, 540], [dur, 536]]), C.kf(lt, [[0, 1.02], [dur, 1.09]]), C.kf(lt, [[0, -0.004], [dur, 0.004]]), 1.2, t);
    beginCam(ctx);
    trainSet(ctx, t, { tunnel });

    if (tunnel > 0.01) {
      ctx.fillStyle = C.rgba("#06080A", 0.30 * tunnel);
      ctx.fillRect(-W, -H, W * 3, H * 3);
    }

    // the man: ticket in his right hand, lifts it, lays it on the seat, leaves
    const exitK = C.ease(C.clamp((lt - 2.60) / 0.90));
    const mx = 1080 + 520 * exitK;
    const fade = 1 - C.clamp((lt - 3.20) / 0.26);
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, armL: [0.52, 0.06], armR: [-0.26, 0.40], headTurn: 0.10, headTilt: 0.03 }],
      [0.85, { ...MAN_POSES.stand, lean: 0.06, armL: [0.52, 0.06], armR: [-1.00, 0.60], headTurn: 0.20, headTilt: 0.08 }],
      [1.12, { ...MAN_POSES.stand, lean: 0.22, armL: [0.50, 0.04], armR: [-1.40, 0.60], headTurn: 0.26, headTilt: 0.12 }],
      [1.40, { ...MAN_POSES.stand, lean: 0.38, bounce: 16, armL: [0.46, 0.06], armR: [-0.35, 0.10], headTurn: 0.22, headTilt: 0.16, footL: [-46, -8], footR: [58, -8] }],
      [1.95, { ...MAN_POSES.stand, lean: 0.38, bounce: 16, armL: [0.46, 0.06], armR: [-0.38, 0.12], headTurn: 0.20, headTilt: 0.16, footL: [-46, -8], footR: [58, -8] }],
      [2.15, { ...MAN_POSES.stand, lean: 0.10, armL: [0.42, 0.10], armR: [-0.55, 0.35], headTurn: 0.08, headTilt: 0.06 }],
      [2.60, { ...MAN_POSES.pace, armL: [0.30, -0.20], armR: [-0.40, 0.45], headTurn: 0.16, lean: 0.10 }],
      [dur, { ...MAN_POSES.pace, armL: [0.60, -0.30], armR: [-0.70, 0.40], headTurn: 0.20, lean: 0.13 }],
    ]);
    mp.bounce += Math.sin(t * 5.4) * 1.2;
    if (lt > 2.60) {
      const step = Math.sin(t * 7.6);
      mp.armL[0] += 0.12 * step;
      mp.armR[0] -= 0.12 * step;
      mp.bounce += -Math.abs(Math.sin(t * 7.6)) * 3;
    }
    // the ticket: held on the way in, then flat on the facing cushion (y≈650).
    // Once it is on the seat it is part of the set, so it stays lit after he
    // fades and is drawn behind him while he crosses in front of the seat.
    const seatCushion = [1256, 700];
    const h = castHand(mx, 930, 1.02, mp, "R");
    const layK = C.ease(C.clamp((lt - 1.28) / 0.32));
    const tx = C.lerp(h[0] + 12, seatCushion[0], layK);
    const ty = C.lerp(h[1] + 2, seatCushion[1], layK);
    const drawTicket06 = () => {
      if (layK > 0.5) {
        ctx.fillStyle = C.rgba(INK, 0.26);
        ctx.beginPath(); ctx.ellipse(1256, 716, 58, 8, 0, 0, TAU); ctx.fill();
      }
      ticketProp(ctx, tx, ty, 0.80, C.lerp(0.18, 0.04, layK), { title: "THE RUN", time: "02:10", code: "N2", route: "NORTH", note: "ONE WAY" });
      if (lt < 2.05) {
        ctx.save(); ctx.translate(tx - 30, ty + 14); ctx.rotate(-0.35);
        ctx.fillStyle = "#C98A5A";
        ctx.beginPath(); ctx.ellipse(0, 0, 4.8, 12.5, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 1.3; ctx.stroke();
        ctx.restore();
      }
    };
    const ticketBefore = lt > 2.55;
    if (ticketBefore) drawTicket06();

    ctx.save(); ctx.globalAlpha = fade;
    man(ctx, mx, 930, 1.02, {
      t, pose: mp, role: "thief",
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: 1.45, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: ticketT - 0.2, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        { t: ticketT + 0.3, f: { eyes: "wide", mouth: "flat", look: [-1, 0] } },
        { t: darkT, f: { eyes: "wide", mouth: "flat", look: [-1, 0] } },
      ]),
    });
    ctx.restore();
    if (!ticketBefore) drawTicket06();

    // the carriage darkens once the window is a wall; the ticket stays lit
    if (tunnel > 0.01) {
      ctx.fillStyle = C.rgba("#06080A", 0.13 * tunnel);
      ctx.fillRect(-W, -H, W * 3, H * 3);
    }

    // the detective's shadow in the vestibule: a hint in the tunnel, then the door.
    // The corridor light is lifted first, so the silhouette has something to stand on.
    ctx.save();
    ctx.beginPath(); ctx.rect(1664, 204, 162, 224); ctx.clip();
    const vl = ctx.createRadialGradient(1745, 322, 8, 1745, 322, 160);
    vl.addColorStop(0, C.rgba("#FFD27A", 0.32));
    vl.addColorStop(1, C.rgba("#FFD27A", 0));
    ctx.fillStyle = vl; ctx.beginPath(); ctx.arc(1745, 322, 160, 0, TAU); ctx.fill();
    ctx.restore();
    const shadowK = 0.34 + 0.56 * C.clamp((lt - darkT) / 0.26);
    ctx.save(); ctx.globalAlpha = shadowK;
    ctx.fillStyle = "#050608";
    ctx.beginPath(); ctx.ellipse(1745, 236, 52, 11, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(1745, 262, 23, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1688, 392); ctx.quadraticCurveTo(1704, 292, 1745, 286); ctx.quadraticCurveTo(1786, 292, 1802, 392); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (lt > darkT) {
      const k = C.clamp((lt - darkT) / 0.3);
      ctx.save(); ctx.globalAlpha = 0.26 * k;
      ctx.fillStyle = "#050608";
      ctx.beginPath(); ctx.moveTo(1680, 394); ctx.lineTo(1460, 900); ctx.lineTo(1620, 900); ctx.lineTo(1786, 394); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // The tunnel lamps outside throw light through the glass and across the
    // carriage: a warm wash that rises and falls as each lamp passes, and a
    // band of that light crossing the wall. The tunnel is never a still black.
    if (tunnel > 0.004) {
      const glow = trainLampGlow(t) * tunnel;
      ctx.fillStyle = C.rgba("#FFC46A", 0.085 * glow);
      ctx.fillRect(-W, -H, W * 3, H * 3);
      const bx = ((t * 1180) % (W + 1200)) - 600;
      const bg = ctx.createLinearGradient(bx - 210, 0, bx + 210, 0);
      bg.addColorStop(0, C.rgba("#FFD27A", 0));
      bg.addColorStop(0.5, C.rgba("#FFD27A", 0.10 * tunnel));
      bg.addColorStop(1, C.rgba("#FFD27A", 0));
      ctx.fillStyle = bg; ctx.fillRect(-W, -H, W * 3, H * 3);
    }

    endCam(ctx);

    // the corner page: day 4, clear of the caption band
    calendarProp(ctx, 1786, 990, 0.32, 4, t, 0, { oldDay: 4 });

    TY.type(ctx, "THE TRAIN", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 21,
      perChar: (i) => C.clamp((t - 13.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "NIGHT · 02:10", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "A TICKET ON A SEAT", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "ONE TICKET", 1560, 770, 24, { fill: MUSTARD, text: INK, seed: 15, rot: -0.04, time: t });
  },
});
