/* THE RUN — s07. Day 5, the rented room.
   He turns the wall calendar to five, sets the flat cap on the room chair's
   top rail and the window stays papered. The table is the point: a packed bag
   and a banded stack of notes, both in frame. No knife (it is bagged evidence
   in s03) and no floorboard hiding. The cap is his; his head is bare while it
   is in his hand. */

scene({
  id: "s07", start: 17.28, end: 19.7, line: 6, cast: "MAN",
  draw(t, lt, dur) {
    const calT = syncLocal("s07", "e1"); // 0.24 — "five"
    const flick = 0.88 + 0.12 * Math.abs(Math.sin(t * 11.3)) * (0.8 + 0.2 * Math.sin(t * 4.1));

    setCam(C.kf(lt, [[0, 958], [dur, 990]]), C.kf(lt, [[0, 542], [dur, 528]]), C.kf(lt, [[0, 1.0], [dur, 1.06]]), C.kf(lt, [[0, 0.006], [dur, -0.008]]), 1.0, t);
    beginCam(ctx);
    hideoutSet(ctx, t, { flicker: flick, clock: { h: 2, m: 9 } });

    // The same papered window as s08 and s09: one windowPaperFull, so the room
    // does not re-paper itself between cuts. The last page is taped at its
    // lower edge and his right hand presses the tape; no glass or rain shows.
    windowPaperFull(ctx);
    // the tape on the last page, under his hand
    ctx.save(); ctx.translate(1540, 520); ctx.rotate(-0.10);
    ctx.fillStyle = C.rgba("#F2E8D5", 0.72); ctx.fillRect(-28, -7, 56, 14);
    ctx.strokeStyle = C.rgba(INK, 0.18); ctx.lineWidth = 1; ctx.strokeRect(-28, -7, 56, 14);
    ctx.restore();

    // the wall calendar turns to five on "five"
    const turn = C.ease(C.clamp((lt - calT) / 0.45));
    calendarProp(ctx, 960, 290, 1.0, 5, t, turn, { oldDay: 4 });

    // the chair by the table, the same one s08 and s09 keep their cap on
    roomChair(ctx, t);

    // the table: the packed bag and the banded money, both on the top. The bag
    // is bagProp, the same bag s08 and s09 carry, so it is one object.
    moneyProp(ctx, 560, 605, 0.9, -0.04, { count: 9 });
    bagProp(ctx, 940, 636, 0.8, -0.03, { open: 0.30 });

    // the man steps from the calendar to the chair with the flat cap
    const walkK = C.ease(C.clamp((lt - 0.46) / 0.36));
    const backK = C.ease(C.clamp((lt - 1.04) / 0.12));
    const manX = 1060 - 260 * walkK + 50 * backK;
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, lean: -0.04, armL: [2.30, 0.70], armR: [-0.25, 0.40], headTurn: -0.34, headTilt: 0.02 }],
      [calT - 0.02, { ...MAN_POSES.stand, lean: -0.02, armL: [2.30, 0.70], armR: [-0.25, 0.40], headTurn: -0.40, headTilt: 0.06 }],
      [0.52, { ...MAN_POSES.turn, lean: -0.04, armL: [0.45, -0.20], armR: [-0.18, 0.34], headTurn: -0.26, headTilt: 0.02 }],
      [0.72, { ...MAN_POSES.stand, lean: -0.06, armL: [0.30, -0.10], armR: [-0.04, 0.28], headTurn: -0.22, headTilt: 0.04 }],
      [0.86, { ...MAN_POSES.stand, lean: -0.02, armL: [0.26, -0.06], armR: [0.24, 0.26], headTurn: -0.16, headTilt: 0.08 }],
      [0.94, { ...MAN_POSES.stand, lean: 0.02, armL: [0.24, -0.04], armR: [0.42, 0.36], headTurn: -0.10, headTilt: 0.12 }],
      [1.02, { ...MAN_POSES.stand, lean: 0.04, armL: [0.24, -0.04], armR: [0.50, 0.40], headTurn: -0.06, headTilt: 0.10 }],
      [1.10, { ...MAN_POSES.stand, lean: 0.05, armL: [0.24, -0.04], armR: [0.44, 0.36], headTurn: -0.02, headTilt: 0.06 }],
      [1.20, { ...MAN_POSES.stand, lean: 0.06, armL: [0.24, -0.04], armR: [0.26, 0.28], headTurn: 0.02, headTilt: 0.02 }],
      [1.50, { ...MAN_POSES.stand, lean: 0.05, armL: [0.24, -0.06], armR: [-0.10, 0.34], headTurn: 0.02, headTilt: 0.02 }],
      [2.10, { ...MAN_POSES.stand, lean: 0.02, armL: [0.26, -0.28], armR: [-0.32, 0.42], headTurn: -0.10, headTilt: 0.02 }],
      [dur, { ...MAN_POSES.stand, lean: 0.02, armL: [0.26, -0.28], armR: [-0.32, 0.42], headTurn: -0.14, headTilt: 0.02 }],
    ]);
    mp.bounce += Math.sin(t * 6.1) * 1.0;
    mp.sway = 1.3;
    if (lt > 0.46 && lt < 0.82) mp.bounce += -Math.abs(Math.sin(t * 11.5)) * 4;

    // the cap: in his right hand, then set down on the chair's top rail at
    // 760,574 — the hand goes to the rail, so the cap never floats
    const h = castHand(manX, 930, 1.0, mp, "R");
    const hangK = C.ease(C.clamp((lt - 1.00) / 0.10));
    const capX = C.lerp(h[0], 760, hangK);
    const capY = C.lerp(h[1] - 8, 574, hangK);
    const capSettled = hangK > 0.98;
    const drawCap = () => {
      flatCapProp(ctx, capX, capY, C.lerp(0.78, 0.82, hangK), C.lerp(-0.16, -0.06, hangK), { color: "#6E6A62" });
      if (hangK < 0.75) {
        ctx.save(); ctx.translate(capX + 20, capY + 12); ctx.rotate(-0.2);
        ctx.fillStyle = "#C98A5A";
        ctx.beginPath(); ctx.ellipse(0, 0, 5, 12, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.restore();
      }
    };
    // on the chair the cap is behind him; carried, it is over his coat
    if (capSettled) drawCap();

    man(ctx, manX, 930, 1.0, {
      t, pose: mp, role: "thief", hat: null,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
        { t: calT, f: { eyes: "wide", mouth: "o", look: [-1, -1] } },
        { t: 0.78, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
        { t: 1.36, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
        { t: 2.00, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      ]),
    });

    // a thumb on the brim shows he is holding it
    if (!capSettled) drawCap();

    endCam(ctx);

    // No DAY n heading: the torn calendar page is the film's only day counter.
    TY.type(ctx, "THE RENTED ROOM", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 23,
      perChar: (i) => C.clamp((t - 17.45 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "A CALENDAR AND A DOOR", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    // the sticker names the thing it points at: the unnamed suspect on the wall
    TY.sticker(ctx, "NO NAME", 1290, 470, 24, { fill: MUSTARD, text: INK, seed: 17, rot: 0.04, time: t });
  },
});
