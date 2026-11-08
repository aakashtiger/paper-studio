/* THE RUN — s6. Day 10, the court. The gavel is on the bench, handle up; the
   file is open; the verdict lands on the word. */
scene({
  id: "s6", start: 15.0, end: 18.0, line: 5, cast: "MAN",
  draw(t, lt, dur) {
    const sentenceT = syncLocal("s6", "e4"); // 2.7 — the sentence
    setCam(C.kf(lt, [[0, 960], [dur, 940]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.0], [dur, 1.05]]), C.kf(lt, [[0, 0.01], [dur, -0.01]]), 1.2, t);
    beginCam(ctx);
    courtSet(ctx, t);

    // the left arm stays down; the sentence is a shoulder/head flinch with
    // both elbows bending, not two arms thrown out
    const mp = poseAt(lt, [[0, MAN_POSES.stand], [1.2, { ...MAN_POSES.stand, headTurn: -0.15 }], [2.4, MAN_POSES.stand]]);
    const flinch = Math.exp(-Math.pow((lt - sentenceT) / 0.12, 2));
    mp.armL[0] += flinch * 0.08;
    mp.armL[1] += flinch * 0.9;
    mp.armR[0] -= flinch * 0.08;
    mp.armR[1] += flinch * 0.9;
    mp.headTilt += flinch * 0.08;
    mp.lean += flinch * 0.03;
    mp.bounce -= flinch * 5;
    man(ctx, 560, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: 1.2, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: sentenceT, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: sentenceT + 0.4, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#C9C2B4", jacket: "#2F3B4A", trouser: "#6E6A60", shoe: "#171310", hair: "#171310" },
    });

    const jp = {
      bounce: 0, sway: 1, lean: 0.03, yaw: 0.0, headTilt: 0.04, headTurn: -0.05,
      armL: [0.2, 0.1], armR: [-0.2, -0.1],
      footL: [-32, -39], footR: [32, -39],
    };
    judge(ctx, 960, 760, 1.0, t, jp, faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }, { t: sentenceT - 0.2, f: { eyes: "wide", mouth: "o", look: [-1, 0] } }, { t: sentenceT + 0.5, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }]));

    const wp = {
      bounce: 0, sway: 1, lean: -0.02, yaw: 0.15, headTilt: 0.02, headTurn: 0.1,
      armL: [0.12, 0.18], armR: [-0.12, 0.18],
      footL: [-34, -39], footR: [34, -39],
    };
    warder(ctx, 1420, 900, 0.98, t, wp, { eyes: "narrow", mouth: "flat", look: [-1, 0] });

    // the bench, after the cast, so the judge sits behind it. It has a real
    // top surface: the gavel, the file and the placard stand on it.
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
    // the judge's arm comes over the bench and grips the gavel. The gavel is
    // drawn first, then the hand, so the hand is never hidden behind it. The
    // grip follows the same lift and turn the prop uses.
    const strike = C.clamp((lt - (sentenceT - 0.35)) / 0.35);
    const lift = Math.sin(strike * Math.PI) * 34;
    const gavelRot = -0.35 - strike * 0.35;
    gavelProp(ctx, 1100, 480, 1.0, -0.35, strike);

    const gripX = 1100 + 72 * Math.cos(gavelRot);
    const gripY = 480 - 22 - lift + 72 * Math.sin(gavelRot);
    const wristX = gripX - 26 * Math.cos(gavelRot);
    const wristY = gripY - 26 * Math.sin(gavelRot);
    ctx.save();
    ctx.strokeStyle = "#171310"; ctx.lineWidth = 36; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(1010, 300); ctx.quadraticCurveTo(1050, 360, wristX, wristY); ctx.stroke();
    ctx.strokeStyle = C.rgba("#3A3430", 0.8); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1010, 300); ctx.quadraticCurveTo(1050, 360, wristX, wristY); ctx.stroke();
    // the hand, wrapped around the handle
    ctx.translate(gripX, gripY); ctx.rotate(gavelRot);
    ctx.fillStyle = "#D9A06A"; ctx.beginPath(); ctx.ellipse(0, 0, 19, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.65); ctx.lineWidth = 2; ctx.stroke();
    // fingertips over the far side of the handle, thumb on the near side
    ctx.fillStyle = "#C98A5A";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.ellipse(i * 7, -12, 4.5, 6, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.45); ctx.lineWidth = 1.2; ctx.stroke();
    }
    ctx.fillStyle = "#D9A06A"; ctx.beginPath(); ctx.ellipse(-10, 10, 8, 4.5, -0.55, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore();

    // the case file, open on the bench top, with the sentence stamp
    caseFile(ctx, 840, 438, 0.72, -0.04, t, { open: true, stamp: C.clamp((lt - sentenceT) / 0.2) });

    // the verdict slams down on the bench top
    const slam = C.clamp((lt - sentenceT + 0.08) / 0.26);
    if (slam > 0) {
      ctx.save();
      ctx.translate(780, 440);
      const sc = 1 + 0.25 * (1 - slam);
      ctx.rotate(-0.06 - 0.2 * (1 - slam));
      ctx.scale(sc, sc);
      TY.sticker(ctx, "GUILTY", 0, 0, 28, { fill: CORAL, text: CREAM, seed: 7, rot: 0, time: t });
      ctx.restore();
    }
    // the court's seal on the wall
    ctx.save(); ctx.translate(330, 330); ctx.globalAlpha = 0.5;
    ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 66, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.stroke();
    TY.text(ctx, "THE RUN", 0, 8, 13, { family: "Archivo Black", color: PAL.gold, align: "center", letter: 2 });
    ctx.restore();

    // foreground gallery rail, for depth and edge
    ctx.fillStyle = "#3A2A1E"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#6A4A30"; ctx.fillRect(0, 980, W, 14);
    ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 6;
    for (let x = 40; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 994); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#E8B84A", 0.2); ctx.fillRect(0, 980, W, 4);

    TY.type(ctx, "THE VERDICT", 120, 140, 92, {
      color: CREAM, edge: MUSTARD, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 23,
      perChar: (i) => C.clamp((t - 15.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "DAY 10 · THE COURT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE FILE NAMED THE SENTENCE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
