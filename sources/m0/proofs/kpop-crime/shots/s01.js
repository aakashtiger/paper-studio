/* THE RUN — s1. Day 1, the alley. The detective kneels; the knife catches the lamp. */
scene({
  id: "s1", start: 0, end: 3.0, line: 0, cast: "MAN",
  draw(t, lt, dur) {
    const knifeT = syncLocal("s1", "e2"); // 1.8 — the knife
    const flick = 0.70 + 0.30 * Math.abs(Math.sin(t * 12.7)) * (0.75 + 0.25 * Math.sin(t * 3.3));
    setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.0], [dur, 1.06]]), C.kf(lt, [[0, 0.01], [dur, -0.01]]), 1.2, t);
    beginCam(ctx);
    alleySet(ctx, t, { flicker: flick });

    // the victim: a covered body on the wet ground, no gore
    const settle = Math.sin(lt * 1.3) * 2;
    ctx.save();
    paper(ctx, () => { ctx.beginPath(); ctx.moveTo(940, 914); ctx.quadraticCurveTo(960, 848 + settle, 1014, 850 + settle); ctx.quadraticCurveTo(1048, 848, 1072, 868); ctx.quadraticCurveTo(1140, 858, 1206, 870 + settle); ctx.quadraticCurveTo(1250, 888, 1272, 914); ctx.closePath(); }, { fill: "#E0D4BC", edge: C.rgba(INK, 0.5), edgeW: 2.4, shadow: C.rgba(INK, 0.35), sx: 3, sy: 5 });
    ctx.fillStyle = C.rgba("#8E2430", 0.4); ctx.beginPath(); ctx.ellipse(1008, 906, 44, 11, 0.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.22); ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(980 + i * 62, 860 + settle + i * 4); ctx.lineTo(1010 + i * 62, 908); ctx.stroke(); }
    ctx.restore();
    const glint = C.clamp((lt - knifeT) / 0.12) * (1 - C.clamp((lt - knifeT - 0.18) / 0.3));
    knifeProp(ctx, 1040, 915, 0.9, 1.4, glint);

    // the man, breathing, then turning from the body. The left arm stays in
    // `stand`; the startle is a bent-elbow flinch, both hands toward the chest.
    const mp = poseAt(lt, [[0, MAN_POSES.stand], [1.2, { ...MAN_POSES.stand, headTurn: 0.12, headTilt: 0.04 }], [knifeT, { ...MAN_POSES.stand, headTurn: -0.2, lean: 0.06 }]]);
    mp.bounce = -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 3 + Math.sin(t * 7.1) * 1.2;
    mp.sway = 2;
    const startle = lt < knifeT ? 0 : Math.exp(-Math.pow((lt - knifeT) / 0.28, 2));
    mp.armR[0] += startle * 0.15;
    mp.armR[1] += startle * 0.9;
    man(ctx, 760, 900, 1.15, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: 1.4, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: knifeT, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: 2.6, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]),
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });

    // the detective kneels over the body; the case file is under his hand
    const dPose = poseAt(lt, [[0, { ...MAN_POSES.kneel, bounce: 120, footL: [-120, 0], footR: [50, 0] }], [0.9, { ...MAN_POSES.kneel, bounce: 120, footL: [-120, 0], footR: [50, 0], armL: [0.9, 0.5], headTurn: -0.2 }], [knifeT, { ...MAN_POSES.kneel, bounce: 120, footL: [-120, 0], footR: [50, 0], armL: [1.0, 0.4], headTurn: -0.25 }]]);
    const dh = manHand(1280, 900, 1.0, dPose, "L");
    dh[1] += dPose.bounce || 0;
    caseFile(ctx, dh[0], dh[1] - 46, 0.72, -0.08, t);
    detective(ctx, 1280, 900, 1.0, t, dPose, faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }, { t: knifeT - 0.1, f: { eyes: "wide", mouth: "o", look: [-1, 0] } }, { t: knifeT + 0.5, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }]));
    // the knee that carries his weight, drawn over the folded leg
    const knee = solveLeg(1256, 900 - 280 + 120, 1160, 900, 158, 118, -1);
    ctx.save(); ctx.fillStyle = "#5A4632"; ctx.beginPath(); ctx.ellipse(knee.kneeX, knee.kneeY + 8, 28, 17, 0.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();

    // foreground rain for depth
    rainStreaks(ctx, t, 34, "#D8E8F8", 0.18, 1.5);

    TY.type(ctx, "DAY 1", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 11,
      perChar: (i) => C.clamp((t - 0.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE ALLEY", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "A KNIFE IN THE RAIN", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "044", 1600, 760, 28, { fill: MUSTARD, text: INK, seed: 7, rot: 0.04, time: t });
    endCam(ctx);
  },
});
