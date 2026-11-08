/* THE RUN — s09. Day 7, the hideout.

   He tears the page to seven on "page"/"turned," looks at the banded money and
   leaves it where it lies, packs the bag on the table and lifts it, then walks
   to the chair and sets the grey flat cap on his head on "money." */

scene({
  id: "s09", start: 22.22, end: 26.06, line: 8, cast: "MAN",
  draw(t, lt, dur) {
    const pageT = syncLocal("s09", "e2");   // 1.10 — "page"
    const turnedT = syncLocal("s09", "e3"); // 1.38 — "turned."
    const hoursT = syncLocal("s09", "e5");  // 2.90 — "hours,"
    const notT = syncLocal("s09", "e6");    // 3.28 — "not"
    const moneyT = syncLocal("s09", "e7");  // 3.70 — "money."
    // The cap lands on the head at 3.48. From that frame the rig draws the
    // worn hat (man.js `hat: "flatcap"`), so it sits exactly as s12/s14 wear
    // it; before then the cap rides the hand and is drawn by hand.
    const LAND_T = 3.48;

    // low and wide from the door side: the third framing of one room, so three
    // shots do not read as one long take
    setCam(
      C.kf(lt, [[0, 712], [1.42, 690], [dur, 646]]),
      C.kf(lt, [[0, 614], [dur, 590]]),
      C.kf(lt, [[0, 0.93], [dur, 1.02]]),
      C.kf(lt, [[0, 0.008], [dur, -0.006]]),
      1.0, t
    );
    ctx.fillStyle = "#32261C"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    hideoutSet(ctx, t, { flicker: 0.94 + 0.06 * Math.sin(t * 7.7), clock: { h: 11, m: 20 } });
    windowPaperFull(ctx);

    // the wall calendar: page seven is torn off on "turned"
    const turn = C.ease(C.clamp((lt - pageT) / 0.42));
    calendarProp(ctx, 960, 290, 1.0, 7, t, turn, { oldDay: 6 });
    if (turn > 0.55) {
      const k = C.clamp((lt - pageT - 0.24) / 0.40);
      if (k < 1) {
        ctx.save(); ctx.globalAlpha = 1 - k;
        ctx.translate(960 - 10 * k, 290 + 250 * k); ctx.rotate(-0.9 * k - 0.12);
        paper(ctx, () => roundRectPath(ctx, -30, -42, 60, 84, 3), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
        TY.text(ctx, "6", 0, 16, 40, { family: "Archivo Black", color: PAL.ink, align: "center" });
        ctx.restore();
      }
    }

    // the chair from s07, at 700; the flat cap waits on its top rail at
    // 760,574 until his left hand takes it
    roomChair(ctx, t);
    if (lt < 3.15) flatCapProp(ctx, 760, 574, 0.82, -0.06);

    // the money is left on the table: banded notes, readable 100s
    moneyProp(ctx, 560, 605, 0.9, -0.04);

    // the bag on the table, packed on screen: the flap closes, then it lifts.
    // He crosses the room to it: in from the window side, the page torn off as
    // he passes the calendar, then the table, then the chair, then the door.
    // One action per beat — but the body is walking the whole time, and that
    // crossing is what keeps the shot from reading as a mannequin in a room.
    const WALK_END = 1.42;
    const walkOff = C.ease(C.clamp((lt - 3.52) / 0.32));
    const x = C.lerp(C.lerp(1010, 850, C.ease(C.clamp(lt / WALK_END))), 806, walkOff);
    const flapOpen = 1 - C.ease(C.clamp((lt - 2.08) / 0.28));
    const liftK = C.ease(C.clamp((lt - 2.46) / 0.16));

    // the stride belongs to the crossing; standing at the table he only shifts
    // his weight, which is small on purpose
    const phase = lt * TAU * 1.45;
    const amp = C.ease(C.clamp(lt / 0.28)) * (1 - C.ease(C.clamp((lt - (WALK_END - 0.18)) / 0.18))) + walkOff;
    const stride = Math.sin(phase) * (0.08 + 0.54 * amp);
    const liftL = Math.max(0, -stride), liftR = Math.max(0, stride);
    const mp = {
      bounce: -Math.abs(stride) * 3.2 + Math.sin(t * 5.6) * 0.7 - 1.4 * amp * 0.6,
      sway: 3.0 + 2.2 * amp, lean: 0.03 + 0.03 * amp, yaw: 0.08, headTilt: 0.02, headTurn: 0.05,
      armL: [0.0, 0.0], armR: [0.0, 0.0],
      footL: [-34 + 58 * stride, -8 - 26 * liftL],
      footR: [34 - 58 * stride, -8 - 26 * liftR],
    };

    // the left arm hangs until the cap; it reaches to 760,574, closes on the
    // brim and lifts it to his head, then lowers so the last frame is a man
    // wearing a hat, not holding one
    const hangArmL = [0.26, -0.30];
    const grabArmL = [0.80, -1.50];   // hand at 757,569 — on the cap at 760,574
    const capArmL = [2.95, 0.10];
    mp.armL = C.kf(lt, [
      [0, hangArmL],
      [3.02, [hangArmL[0] - 0.10 * Math.sin(phase), hangArmL[1]]],
      [3.15, grabArmL],
      [3.48, capArmL],
      [3.66, [0.15, -0.15]],
      [dur, [0.10, -0.05]],
    ]);

    // the right arm: the page (the calendar is to his right), then the bag;
    // it lifts the bag at 2.46 and carries it low at his side
    const pageArmR = [-2.90, 0.10];
    const bagArm = [-0.85, 1.60];     // elbow out, hand on the handle at 940,558
    const liftArm = [-1.30, 1.00];
    const carryArm = [0.05, 0.05];
    mp.armR = C.kf(lt, [
      [0, [-2.20, 0.30]],
      [pageT - 0.02, pageArmR],
      [1.52, pageArmR],
      [1.74, [-0.30, 0.25]],
      [1.85, bagArm],
      [2.42, bagArm],
      [2.62, liftArm],
      [2.92, carryArm],
      [3.20, carryArm],
    ]);

    // head: calendar, money, bag, cap
    mp.headTilt = C.kf(lt, [
      [0, -0.05], [turnedT, -0.04], [2.10, 0.02], [hoursT, 0.02], [3.20, 0.04], [3.55, 0.01],
    ]);
    mp.headTurn = C.kf(lt, [
      [0, 0.10], [turnedT, 0.14], [2.30, 0.18], [hoursT, 0.26], [3.20, -0.18], [3.55, -0.10], [dur, -0.10],
    ]);
    mp.lean = C.kf(lt, [
      [0, 0.01], [turnedT, 0.02], [2.30, 0.04], [2.60, 0.06], [3.20, 0.04], [3.50, 0.02],
    ]);
    mp.yaw = 0.08;

    // the man
    man(ctx, x, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, -1] } },
        { t: pageT - 0.08, f: { eyes: "wide", mouth: "flat", look: [1, -1] } },
        { t: turnedT + 0.18, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
        { t: hoursT, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        { t: notT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: 3.10, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
        { t: 3.50, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
        { t: moneyT, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
      ]),
      role: "thief", hat: lt >= LAND_T ? "flatcap" : null, costume: "coat", hair: "#1E1610",
    });
    // the head rig's own hair is a ragged fringe now; no overlay needed.

    // the bag waits at the table's right edge; it is drawn after the man so
    // his coat does not swallow it, with his hand over the handle
    const rHandNow = armHandAt(x, 900, 1.0, mp, "R");
    if (liftK >= 0.01) {
      bagProp(ctx, C.lerp(940, rHandNow[0], liftK), C.lerp(636, rHandNow[1] + 102, liftK), 0.8, -0.03, {
        open: flapOpen * (1 - liftK),
      });
      ctx.save(); ctx.translate(rHandNow[0], rHandNow[1] + 1); ctx.rotate(0.22);
      hand(ctx, 1, false, "#C98A5A");
      ctx.restore();
    } else {
      bagProp(ctx, 940, 636, 0.8, -0.03, { open: flapOpen });
      if (lt > 1.42) {
        ctx.save(); ctx.translate(rHandNow[0], rHandNow[1] + 1); ctx.rotate(0.22);
        hand(ctx, 1, false, "#C98A5A");
        ctx.restore();
      }
    }

    // the cap: on the chair until the left hand closes on it at 3.15, then it
    // rides the hand up onto his head and is left there at 3.48 while the arm
    // comes down. The resting cap was already drawn behind him, on the rail;
    // after 3.48 the rig's worn hat draws it, so the landing and the worn cap
    // are the same shape in the same place.
    const capU = C.ease(C.clamp((lt - 3.15) / (LAND_T - 3.15)));
    if (lt >= 3.15 && lt < LAND_T) {
      const lh = armHandAt(x, 900, 1.0, mp, "L");
      // the end offsets put the cap at 851,220 — the exact brim of the rig's
      // worn hat — so the hand-off at LAND_T does not jump
      flatCapProp(
        ctx,
        lh[0] + C.lerp(3, 109, capU),
        lh[1] + C.lerp(4, 10, capU),
        C.lerp(0.82, 1.0, capU),
        C.lerp(-0.06, 0.10, capU)
      );
    }

    // a small lift of light when the cap lands, so the beat reads
    if (capU > 0.86) {
      const k = C.clamp((capU - 0.86) / 0.14);
      ctx.fillStyle = C.rgba("#FFF2C8", 0.10 * k);
      ctx.beginPath(); ctx.ellipse(x, 236, 150, 24, 0, 0, TAU); ctx.fill();
    }

    endCam(ctx);

    // No DAY n heading: the torn calendar page is the only day counter.
    TY.type(ctx, "THE HIDEOUT", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 32,
      perChar: (i) => C.clamp((t - 22.42 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "HE COUNTED THE HOURS", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    // the sticker points at the money it names, not at the chair
    TY.sticker(ctx, "NOT THE MONEY", 470, 720, 22, { fill: MUSTARD, text: INK, seed: 32, rot: 0.035, time: t });
  },
});
