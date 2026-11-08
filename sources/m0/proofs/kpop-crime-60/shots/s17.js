/* THE RUN — s17. Day 10, the court. The judge reads the verdict card without
   hurry; the file is open at the knife drawing; the gavel waits and the docket
   calendar says ten. Slow track across the bench. The card is in his own hand,
   and the cuffs stay on the warder's belt. */

/* The judge's bench, drawn after the judge so it hides his legs. Same shape as
   the 21 s proof's court, so the two courts are one room. */
function courtBench(ctx) {
  const benchTop = () => { ctx.beginPath(); ctx.moveTo(640, 490); ctx.lineTo(700, 400); ctx.lineTo(1220, 400); ctx.lineTo(1280, 490); ctx.closePath(); };
  paper(ctx, benchTop, { fill: "#8A6440", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 8 });
  ctx.save(); benchTop(); ctx.clip();
  ctx.strokeStyle = C.rgba("#5A3A22", 0.35); ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = 408 + i * 10;
    const left = 700 - (y - 400) * (60 / 90), right = 1220 + (y - 400) * (60 / 90);
    ctx.beginPath(); ctx.moveTo(left + 8, y); ctx.lineTo(right - 8, y); ctx.stroke();
  }
  ctx.restore();
  paper(ctx, () => roundRectPath(ctx, 640, 490, 640, 410, 4), { fill: "#6A4A30", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 0, sy: 8 });
  ctx.fillStyle = PAL.gold; ctx.fillRect(640, 490, 640, 8);
  ctx.strokeStyle = C.rgba("#3A2418", 0.55); ctx.lineWidth = 3;
  ctx.strokeRect(676, 530, 568, 340);
  ctx.strokeRect(710, 570, 500, 270);
}

/* A belt-hung pair of cuffs, so the same props read in every court shot. */
function beltCuffs(ctx, x, beltY, s = 0.56) {
  ctx.save();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.6); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + 6, beltY); ctx.lineTo(x + 6, beltY + 14); ctx.stroke();
  ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(x + 6, beltY + 4, 4, 0, TAU); ctx.fill();
  handcuffs(ctx, x, beltY + 24, s, 0.16, 1);
  ctx.restore();
}

scene({
  id: "s17", start: 45.18, end: 47.8, line: 16, cast: "MAN / JUDGE / WARDER",
  draw(t, lt, dur) {
    const judgeT = syncLocal("s17", "e1"); // 1.06 — "sentence"
    const readT = syncLocal("s17", "e2");  // 1.38 — "read"

    setCam(
      C.kf(lt, [[0, 880], [dur, 1020]]),
      C.kf(lt, [[0, 540], [dur, 528]]),
      C.kf(lt, [[0, 1.03], [dur, 1.07]]),
      C.kf(lt, [[0, 0.004], [dur, -0.004]]),
      1.0, t
    );
    beginCam(ctx);
    courtSet(ctx, t);

    // the docket calendar, pinned to the left wall: day ten
    paper(ctx, () => roundRectPath(ctx, 230, 240, 180, 260, 6), { fill: "#3A2E24", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
    ctx.fillStyle = "#5A4636"; ctx.fillRect(240, 250, 160, 8);
    TY.text(ctx, "DOCKET", 320, 276, 11, { family: "DMMono", color: C.rgba(CREAM, 0.6), align: "center", letter: 3 });
    ctx.fillStyle = "#B8382A";
    ctx.beginPath(); ctx.arc(282, 262, 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(358, 262, 4, 0, TAU); ctx.fill();
    calendarProp(ctx, 320, 372, 0.75, 10, t, 0, { oldDay: 10 });

    // the judge, upright behind the bench. His right arm is his own rig arm,
    // bent at the elbow, and the card will sit in that hand.
    const jp = {
      bounce: Math.sin(t * 3.8) * 0.7, sway: 1, lean: 0.02, yaw: 0.0, headTilt: 0.03, headTurn: -0.06,
      armL: [0.12, 0.55], armR: [-1.10, 1.33],
      footL: [-32, -39], footR: [32, -39],
    };
    judge(ctx, 960, 760, 1.0, t, jp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
      { t: judgeT - 0.15, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
      { t: judgeT, f: { eyes: "closed", mouth: "flat", look: [1, 1] } },
      { t: judgeT + 0.25, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: readT + 0.30, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
    ]), { mustache: true, stubble: true, hair: "#4A423C" });

    courtBench(ctx);

    // the case file, open at the knife drawing
    caseFile(ctx, 900, 438, 0.72, -0.04, t, { open: true });
    ctx.save();
    ctx.translate(872, 442); ctx.rotate(-0.52);
    // an exhibit photo with a caption bar, not a loose knife lying on the
    // bench beside the file. The blade is a printed silhouette inside a frame.
    ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1.4;
    ctx.strokeRect(-18, -30, 36, 48);
    ctx.fillStyle = C.rgba(PAL.ink, 0.06); ctx.fillRect(-18, -30, 36, 48);
    ctx.strokeStyle = C.rgba(PAL.ink, 0.8); ctx.lineWidth = 1.8; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-2, -22); ctx.lineTo(7, -8); ctx.lineTo(-6, -8); ctx.closePath(); ctx.stroke();
    ctx.strokeRect(-6, -8, 12, 16);
    ctx.fillStyle = C.rgba(PAL.ink, 0.6); ctx.fillRect(-14, 12, 28, 3);
    ctx.restore();
    TY.text(ctx, "EXHIBIT A", 872, 478, 9, { family: "DMMono", color: C.rgba(PAL.ink, 0.65), align: "center", letter: 1 });

    // the gavel at rest
    gavelProp(ctx, 1120, 480, 1.0, -0.35, 0);

    // the verdict card, held at reading height in the judge's right hand.
    // It hangs off his fingers on its right edge, so the arm and hand stay
    // visible beside the paper instead of hiding behind it.
    const cardX = 1055 + Math.sin(lt * 1.4) * 2;
    const cardY = 360 + Math.sin(lt * 1.1) * 2;
    ctx.save();
    ctx.translate(cardX, cardY); ctx.rotate(-0.06 + Math.sin(lt * 1.1) * 0.01);
    paper(ctx, () => tornRectPath(ctx, -52, -64, 104, 128, 3, 7), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-52, -64, 104, 22);
    TY.text(ctx, "VERDICT", 0, -48, 13, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 2 });
    TY.text(ctx, "THE PEOPLE", 0, -26, 9, { family: "DMMono", color: PAL.ink, align: "center", letter: 1 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-38, -8 + i * 16); ctx.lineTo(38, -8 + i * 16); ctx.stroke(); }
    ctx.strokeStyle = "#B8382A"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(30, 40, 16, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(30, 40, 6, 0, TAU); ctx.stroke();
    ctx.restore();
    // the cuff of his sleeve, painted over the card's edge so the arm reaches
    // the paper instead of stopping behind it
    ctx.save();
    ctx.strokeStyle = "#141210"; ctx.lineWidth = 30; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cardX + 74, cardY + 30);
    ctx.lineTo(cardX + 48, cardY + 14);
    ctx.stroke();
    ctx.strokeStyle = C.rgba("#3A342C", 0.6); ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 62, cardY + 20);
    ctx.lineTo(cardX + 54, cardY + 16);
    ctx.stroke();
    ctx.restore();
    // the fingers over the card's right edge, and the thumb on its face, so
    // the hand holds the paper rather than the paper floating
    ctx.save();
    ctx.fillStyle = "#D9A06A";
    ctx.beginPath(); ctx.ellipse(cardX + 50, 372, 6, 11, -0.06, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cardX + 51, 390, 6, 11, 0.04, 0, TAU); ctx.fill();
    ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cardX + 44, cardY + 48, 13, 7, -0.28, 0, TAU); ctx.fill();
    ctx.stroke();
    ctx.restore();

    // the accused, in the suit he was given for the day: hands low in front,
    // then on "read" he lifts his head and brings his hands together at his
    // belt, and holds them there. No cuffs in the court.
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, armL: [0.30, -0.50], armR: [-0.30, 0.50], headTilt: 0.10, headTurn: 0.05, lean: 0.03 }],
      [0.45, { ...MAN_POSES.stand, armL: [0.30, -0.50], armR: [-0.30, 0.50], headTilt: 0.08, headTurn: 0.03, lean: 0.03 }],
      [judgeT - 0.10, { ...MAN_POSES.stand, armL: [0.30, -0.50], armR: [-0.30, 0.50], headTilt: 0.08, headTurn: 0.03, lean: 0.03 }],
      [readT + 0.30, { ...MAN_POSES.stand, armL: [-0.30, -0.10], armR: [0.30, 0.10], headTilt: -0.04, headTurn: -0.14, lean: 0.05 }],
      [readT + 0.75, { ...MAN_POSES.stand, armL: [-0.28, -0.12], armR: [0.28, 0.12], headTilt: 0.0, headTurn: -0.10, lean: 0.04 }],
      [dur, { ...MAN_POSES.stand, armL: [-0.26, -0.14], armR: [0.26, 0.14], headTilt: 0.01, headTurn: -0.10, lean: 0.02 }],
    ]);
    mp.bounce += Math.sin(t * 4.8) * 1.0;
    mp.sway = 1.4;
    mp.headTurn += 0.05 * Math.sin(t * 4.6);
    plantFeet(mp);
    man(ctx, 560, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
        { t: judgeT, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
        { t: readT, f: { eyes: "wide", mouth: "o", look: [1, -1] } },
        { t: readT + 0.40, f: { eyes: "normal", mouth: "flat", look: [1, -1] } },
      ]),
      costume: "suit", stubble: true, tie: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310", accent: "#8E2430" },
    });

    // the warder at the edge of the bench, still, the cuffs on his belt
    const wp = { bounce: Math.sin(t * 4.1 + 1) * 0.8, sway: 1, lean: -0.02, yaw: 0.15, headTilt: 0.02, headTurn: 0.10, armL: [0.12, 0.18], armR: [-0.12, 0.18], footL: [-34, -8], footR: [34, -8] };
    warder(ctx, 1420, 900, 0.98, t, wp, { eyes: "normal", mouth: "flat", look: [-1, 0] });
    // the cuffs hang on the warder's LEFT hip, the same side he hooks them on
    // in the cell (s16): he is left-handed with them, and the loadout never
    // mirrors between shots.
    beltCuffs(ctx, 1420 - 52, 604, 0.54);

    // the dock: a rail in front of the accused, at his shins
    ctx.fillStyle = "#2A1A12"; ctx.fillRect(360, 888, 420, 40);
    ctx.fillStyle = "#4A2E1C"; ctx.fillRect(360, 870, 420, 18);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
    ctx.strokeRect(360, 870, 420, 58);
    ctx.fillStyle = C.rgba("#C8A86A", 0.4); ctx.fillRect(360, 870, 420, 3);
    ctx.fillStyle = "#3A2418"; ctx.fillRect(368, 842, 16, 46); ctx.fillRect(756, 842, 16, 46);

    // the gallery rail, empty, for depth
    ctx.fillStyle = "#3A2A1E"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#6A4A30"; ctx.fillRect(0, 980, W, 14);
    ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 6;
    for (let x = 40; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 994); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#E8B84A", 0.2); ctx.fillRect(0, 980, W, 4);

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "THE SENTENCE", 120, 140, 88, {
      color: CREAM, edge: MUSTARD, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 43,
      perChar: (i) => C.clamp((t - 45.6 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE COURT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE FILE NAMED THE KNIFE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "CASE 044", 1680, 760, 24, { fill: MUSTARD, text: INK, seed: 43, rot: 0.04, time: t });
    TY.sticker(ctx, "THE JUDGE", 1650, 1024, 18, { fill: INK, text: CREAM, edge: null, seed: 65, rot: -0.02, time: t });
  },
});
