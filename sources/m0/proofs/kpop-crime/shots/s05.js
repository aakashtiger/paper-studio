/* THE RUN — s5. Day 10, the cell. The window sits behind the bars; the door
   opens on its word; the calendar reads day 10. */
scene({
  id: "s5", start: 12.0, end: 15.0, line: 4, cast: "MAN",
  draw(t, lt, dur) {
    const cellT = syncLocal("s5", "e0"); // 0.6 — the cell
    setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.0], [dur, 1.05]]), 0, 1.2, t);
    beginCam(ctx);
    cellSet(ctx, t);

    // the cell door, hinged at the right, swings inward
    const doorK = C.easeOut(C.clamp((lt - cellT) / 0.55));
    if (doorK > 0.01) {
      const light = ctx.createLinearGradient(1560, 0, 1920, 0);
      light.addColorStop(0, C.rgba("#FFD27A", 0.55 * doorK));
      light.addColorStop(1, C.rgba("#FFD27A", 0));
      ctx.fillStyle = light;
      ctx.beginPath(); ctx.moveTo(1560, 120); ctx.lineTo(1860, 120); ctx.lineTo(1920, 900); ctx.lineTo(1560, 900); ctx.closePath(); ctx.fill();
      // dust in the corridor light
      for (let i = 0; i < 18; i++) {
        const x = 1580 + C.hash(i * 3.1) * 320 + Math.sin(t * 1.3 + i) * 8;
        const y = 180 + C.hash(i * 7.7) * 680 - C.frac(t * 0.1 + C.hash(i * 5.3)) * 80;
        ctx.fillStyle = C.rgba("#FFE2A0", 0.35 * doorK);
        ctx.beginPath(); ctx.arc(x, y, 1.5 + C.hash(i * 9.1) * 2, 0, TAU); ctx.fill();
      }
    }
    ctx.save();
    ctx.translate(1860, 0);
    ctx.transform(1 - 0.62 * doorK, 0, -0.22 * doorK, 1, 0, 0);
    ctx.translate(-1860, 0);
    ctx.fillStyle = "#2A2E34"; ctx.fillRect(1580, 120, 280, 780);
    ctx.strokeStyle = "#6A7078"; ctx.lineWidth = 11; ctx.lineCap = "round";
    for (let x = 1600; x <= 1840; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke();
    }
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(1580, 400); ctx.lineTo(1860, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1580, 680); ctx.lineTo(1860, 680); ctx.stroke();
    ctx.strokeStyle = C.rgba("#9AA0A8", 0.5); ctx.lineWidth = 2;
    for (let x = 1597; x <= 1837; x += 60) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke(); }
    ctx.restore();

    // the wall calendar: day 10. It is on the wall behind the bars, so the
    // bars are painted over it again (clipped to the calendar, so the wall
    // lamp and the rest of the cell keep their original order).
    calendarProp(ctx, 520, 300, 1.0, 10, t, 0, { oldDay: 10 });
    ctx.save();
    ctx.beginPath(); ctx.rect(450, 200, 150, 200); ctx.clip();
    cellBars(ctx);
    ctx.restore();

    // the man paces, then turns to the door; the free left arm stays down and
    // only the cuffed right arm reacts
    const mx = 760 + 26 * Math.sin(lt * 1.5);
    const mp = poseAt(lt, [[0, MAN_POSES.stand], [0.9, { ...MAN_POSES.pace, armL: MAN_POSES.stand.armL }], [1.8, MAN_POSES.stand], [cellT + 1.4, { ...MAN_POSES.brace, armL: MAN_POSES.stand.armL }]]);
    man(ctx, mx, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }, { t: cellT, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: cellT + 0.8, f: { eyes: "narrow", mouth: "flat", look: [0, 0] } }, { t: 2.4, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#C9C2B4", jacket: "#2F3B4A", trouser: "#6E6A60", shoe: "#171310", hair: "#171310" },
    });
    const wp = {
      bounce: Math.sin(t * 3.1) * 1.5, sway: 1, lean: -0.02, yaw: 0.1, headTilt: 0.02, headTurn: 0.1,
      armL: [0.2, -0.2], armR: [-0.2, 0.2],
      footL: [-34, -39], footR: [34, -39],
    };
    warder(ctx, 1200, 900, 1.0, t, wp, faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: cellT, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: 2.0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }]));

    TY.type(ctx, "THE CELL", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 25,
      perChar: (i) => C.clamp((t - 12.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "DAY 10", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE DAYS ARE LONG", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
