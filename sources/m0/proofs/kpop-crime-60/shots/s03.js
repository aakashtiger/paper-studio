/* THE RUN — s03. Day 1, the alley at dawn.
   The detective kneels with the case file open at the killer's name row (a
   redaction, never a name) and the bagged knife in his other hand; the tape is
   up behind him. The file and the bag are both held: no floating insert hand.
   The man is gone, so no dark silhouette is left at the alley mouth. */

/* The killer's name row inside the open file. Local file space, so it sits on
   the page instead of floating beside it. The value is a name we cannot read:
   cursive ink inside the ruled field, not a black bar. The bar read as an
   erasure, so the line "his name was in it" landed on a hole in the page. */
function nameRow03(ctx, x, y, s, rot, markK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  TY.text(ctx, "NAME", 14, 20, 11, { family: "DMMono", color: C.rgba(INK, 0.8), letter: 1 });
  // one continuous hand: loops, a dot and a crossing tail, legible as writing
  ctx.strokeStyle = C.rgba("#241C14", 0.9);
  ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(17, 34);
  ctx.bezierCurveTo(21, 27, 27, 27, 29, 33);
  ctx.bezierCurveTo(31, 39, 25, 38, 29, 33);
  ctx.bezierCurveTo(34, 27, 39, 40, 44, 33);
  ctx.bezierCurveTo(48, 27, 50, 27, 53, 32);
  ctx.bezierCurveTo(56, 37, 52, 40, 57, 34);
  ctx.bezierCurveTo(61, 29, 66, 28, 69, 32);
  ctx.bezierCurveTo(72, 36, 67, 39, 72, 34);
  ctx.bezierCurveTo(77, 29, 82, 30, 86, 33);
  ctx.stroke();
  ctx.fillStyle = C.rgba("#241C14", 0.9);
  ctx.beginPath(); ctx.arc(35.5, 26.6, 1.3, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(49, 25.4); ctx.lineTo(51.6, 30.6); ctx.stroke();
  ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1;
  ctx.strokeRect(14, 25, 76, 10);
  if (markK > 0) {
    ctx.save(); ctx.globalAlpha = markK;
    ctx.strokeStyle = "#B8382A"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(10, 42); ctx.quadraticCurveTo(52, 38, 94, 42); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(52, 28, 44, 15, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

scene({
  id: "s03", start: 4.88, end: 8.7, line: 2, cast: "MAN",
  draw(t, lt, dur) {
    const fileT = syncLocal("s03", "e2"); // 0.86 — "file"
    const nameT = syncLocal("s03", "e4"); // 2.40 — "name"
    const dawn = C.clamp(lt / dur);

    setCam(C.kf(lt, [[0, 968], [dur, 1008]]), C.kf(lt, [[0, 544], [dur, 550]]), C.kf(lt, [[0, 1.04], [dur, 1.11]]), C.kf(lt, [[0, 0.008], [dur, -0.006]]), 1.1, t);
    beginCam(ctx);
    alleySet(ctx, t, { flicker: 0.62 + 0.38 * dawn, tape: true, poster: false });

    // the covered body, right of the detective
    const settle = Math.sin(lt * 1.2) * 1.4;
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(1436, 938);
      ctx.quadraticCurveTo(1446, 888, 1470, 860 + settle);      // the neck cloth
      ctx.quadraticCurveTo(1484, 834 + settle, 1510, 828 + settle); // the head
      ctx.quadraticCurveTo(1544, 820 + settle, 1566, 838 + settle);
      ctx.quadraticCurveTo(1578, 852 + settle, 1596, 856 + settle); // the neck dip
      ctx.quadraticCurveTo(1640, 816 + settle, 1712, 812 + settle); // shoulders
      ctx.quadraticCurveTo(1800, 810 + settle, 1870, 836 + settle); // chest
      ctx.quadraticCurveTo(1920, 852 + settle, 1962, 882 + settle);
      ctx.quadraticCurveTo(1988, 904 + settle, 1996, 938);
      ctx.closePath();
    }, { fill: "#E4D8C0", edge: C.rgba(INK, 0.55), edgeW: 2.6, shadow: C.rgba(INK, 0.38), sx: 4, sy: 7 });
    ctx.save();
    ctx.strokeStyle = C.rgba(INK, 0.24); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1502, 840 + settle); ctx.quadraticCurveTo(1524, 878, 1538, 912); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1608, 848 + settle); ctx.quadraticCurveTo(1640, 890, 1656, 934); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1770, 816 + settle); ctx.quadraticCurveTo(1802, 872, 1820, 936); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.30); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(1452, 922); ctx.quadraticCurveTo(1720, 894, 1978, 922); ctx.stroke();
    ctx.fillStyle = C.rgba("#F4EBD8", 0.8);
    ctx.beginPath(); ctx.moveTo(1912, 884); ctx.lineTo(1966, 896); ctx.lineTo(1936, 934); ctx.closePath(); ctx.fill();
    ctx.restore();

    // the detective: kneeling, file up in the left hand, bagged knife in the right.
    // The left arm is bent at the elbow: the upper arm comes down from the
    // shoulder, the forearm rises to the file's underside at chest height.
    // On "name" the right hand lifts the bagged knife to the light beside the
    // file, so the weapon and the name row share the frame — a 213 px lift, and
    // the settle between it keeps the longest still under half a second.
    const dp = poseAt(lt, [
      [0, { ...MAN_POSES.kneel, bounce: 178, footL: [-62, -194], footR: [52, -34], lean: 0.16, armL: [0.30, 1.80], armR: [-0.9, 0.3], headTilt: 0.18, headTurn: -0.28 }],
      [fileT - 0.12, { ...MAN_POSES.kneel, bounce: 178, footL: [-62, -194], footR: [52, -34], lean: 0.16, armL: [0.30, 1.80], armR: [-0.9, 0.3], headTilt: 0.18, headTurn: -0.28 }],
      [fileT + 0.24, { ...MAN_POSES.kneel, bounce: 178, footL: [-62, -194], footR: [52, -34], lean: 0.24, armL: [0.44, 1.54], armR: [-0.92, 0.30], headTilt: 0.24, headTurn: -0.34 }],
      [1.62, { ...MAN_POSES.kneel, bounce: 176, footL: [-62, -194], footR: [52, -34], lean: 0.20, armL: [0.36, 1.74], armR: [-0.95, 0.34], headTilt: 0.20, headTurn: -0.33 }],
      // he leans in over the file to read the row, then rocks back
      [1.86, { ...MAN_POSES.kneel, bounce: 174, footL: [-62, -194], footR: [52, -34], lean: 0.31, armL: [0.42, 1.62], armR: [-0.92, 0.30], headTilt: 0.26, headTurn: -0.38 }],
      [2.10, { ...MAN_POSES.kneel, bounce: 180, footL: [-62, -194], footR: [52, -34], lean: 0.15, armL: [0.30, 1.84], armR: [-0.88, 0.26], headTilt: 0.18, headTurn: -0.26 }],
      [nameT - 0.10, { ...MAN_POSES.kneel, bounce: 180, footL: [-62, -194], footR: [52, -34], lean: 0.15, armL: [0.30, 1.84], armR: [-0.88, 0.26], headTilt: 0.18, headTurn: -0.26 }],
      [nameT + 0.16, { ...MAN_POSES.kneel, bounce: 178, footL: [-62, -194], footR: [52, -34], lean: 0.21, armL: [0.36, 1.76], armR: [-1.46, -1.49], headTilt: 0.26, headTurn: -0.34 }],
      [3.12, { ...MAN_POSES.kneel, bounce: 177, footL: [-62, -194], footR: [52, -34], lean: 0.16, armL: [0.40, 1.68], armR: [-1.56, -1.30], headTilt: 0.24, headTurn: -0.27 }],
      [dur, { ...MAN_POSES.kneel, bounce: 179, footL: [-62, -194], footR: [52, -34], lean: 0.22, armL: [0.36, 1.72], armR: [-1.42, -1.56], headTilt: 0.27, headTurn: -0.35 }],
    ]);
    dp.headTurn += 0.045 * Math.sin(t * 6.4);
    dp.lean += 0.035 * Math.sin(t * 5.1);
    dp.armL[0] += 0.030 * Math.sin(t * 8.3);
    dp.bounce += Math.sin(t * 5.4) * 0.7;

    const DET_X = 1150, DET_Y = 905, DET_S = 1.02;
    const lh = castHand(DET_X, DET_Y, DET_S, dp, "L");
    const rh = castHand(DET_X, DET_Y, DET_S, dp, "R");

    // the evidence bag under his right hand: knife first, then a translucent
    // bag over it, so the weapon is sealed inside rather than laid on top
    ctx.save();
    knifeProp(ctx, rh[0] + 2, rh[1] + 40, 1.14, 2.98, 0);
    ctx.fillStyle = C.rgba("#D8E8F0", 0.30);
    ctx.fillRect(rh[0] - 74, rh[1] - 10, 148, 152);
    ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 2.2;
    ctx.strokeRect(rh[0] - 74, rh[1] - 10, 148, 152);
    ctx.strokeStyle = C.rgba("#FFFFFF", 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rh[0] - 60, rh[1] + 4); ctx.lineTo(rh[0] - 46, rh[1] + 124); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rh[0] + 52, rh[1] + 2); ctx.lineTo(rh[0] + 40, rh[1] + 124); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.3); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rh[0] - 70, rh[1] + 12); ctx.lineTo(rh[0] + 70, rh[1] + 12); ctx.stroke();
    paper(ctx, () => roundRectPath(ctx, rh[0] - 60, rh[1] + 84, 120, 30, 3), { fill: "#E8DCC4", edge: C.rgba(INK, 0.45), edgeW: 1.4 });
    TY.text(ctx, "EVIDENCE", rh[0], rh[1] + 104, 12, { family: "DMMono", color: "#8E2430", align: "center", letter: 1 });
    ctx.restore();

    detective(ctx, DET_X, DET_Y, DET_S, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: fileT, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: nameT, f: { eyes: "wide", mouth: "flat", look: [-1, 1] } },
      { t: nameT + 0.5, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
    ]));

    // the file: closed in his hand until "file", then open with the name row up.
    // The file's lower-left corner sits in the bent left hand, at chest height;
    // the thumb and two fingers curl over the near page.
    const openK = C.clamp((lt - fileT) / 0.34);
    const fileX = lh[0] + 40, fileY = lh[1] - 58;
    if (openK < 1) {
      ctx.save(); ctx.globalAlpha = 1 - openK;
      caseFile(ctx, lh[0] + 18, lh[1] - 44, 0.9, -0.05, t);
      ctx.fillStyle = "#C98A5A";
      ctx.beginPath(); ctx.ellipse(lh[0] - 2, lh[1] - 20, 5, 12, 0.42, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
    }
    if (openK > 0) {
      ctx.save(); ctx.globalAlpha = openK;
      caseFile(ctx, fileX, fileY, 1.0, -0.04, t, { open: true });
      const markK = C.clamp((lt - nameT) / 0.22);
      nameRow03(ctx, fileX, fileY, 1.0, -0.04, markK);
      ctx.restore();
    }
    // the thumb over the page and two fingertips on it: the file is held
    if (openK > 0.35) {
      ctx.save(); ctx.globalAlpha = openK;
      ctx.translate(lh[0] - 6, lh[1] - 12); ctx.rotate(0.55);
      paper(ctx, () => roundRectPath(ctx, -5.5, 0, 11, 26, 5.5), { fill: "#C98A5A", edge: C.rgba(INK, 0.55), edgeW: 1.3 });
      ctx.strokeStyle = C.rgba(INK, 0.25); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-3, 15); ctx.lineTo(3, 15); ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.globalAlpha = openK;
      ctx.fillStyle = "#C98A5A";
      for (let i = 0; i < 2; i++) {
        ctx.beginPath(); ctx.ellipse(lh[0] + 16 + i * 18, lh[1] - 4 + i * 5, 6.4, 8.4, 0.18, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(INK, 0.4); ctx.lineWidth = 1.1; ctx.stroke();
      }
      ctx.restore();
    }

    // the knee that carries his weight
    const knee = solveLeg(DET_X - 24, DET_Y - 280 + 178, DET_X - 22, DET_Y - 2, 158, 118, -1);
    ctx.save(); ctx.fillStyle = "#20262E";
    ctx.beginPath(); ctx.ellipse(knee.kneeX, knee.kneeY + 8, 27, 16, 0.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();

    rainStreaks(ctx, t, 42, "#D8E8F8", 0.19, 1.5);
    endCam(ctx);

    // the corner page: day 1
    calendarProp(ctx, 1786, 990, 0.32, 1, t, 0, { oldDay: 1 });

    TY.type(ctx, "BY DAWN", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 15,
      perChar: (i) => C.clamp((t - 5.0 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE ALLEY", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE DETECTIVE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "CASE 044", 1600, 770, 24, { fill: MUSTARD, text: INK, seed: 7, rot: 0.04, time: t });
  },
});
