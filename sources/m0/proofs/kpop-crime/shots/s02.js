/* THE RUN — s2. Day 3, the city chase. One stride, one planted foot, arms
   pumping opposite the legs, the detective reaching for the coat. */
scene({
  id: "s2", start: 3.0, end: 6.0, line: 1, cast: "MAN",
  draw(t, lt, dur) {
    const runT = syncLocal("s2", "e2"); // 1.2 — the run
    const u = C.clamp(lt / dur);
    const manX = 640 + 260 * u;
    const phase = (lt * 2.1) * TAU;
    const stride = Math.sin(phase);
    const bounce = -Math.abs(Math.sin(phase)) * 6;
    const plantL = Math.max(0, stride), plantR = Math.max(0, -stride);
    setCam(C.kf(lt, [[0, 780], [dur, 980]]), 540, C.kf(lt, [[0, 1.02], [dur, 1.08]]), C.kf(lt, [[0, -0.02], [dur, 0.02]]), 1.2, t);
    beginCam(ctx);
    chaseSet(ctx, t);

    // sweeping searchlights, warmer than the base set
    ctx.save(); ctx.globalAlpha = 0.30;
    spotlight(ctx, 420 + 150 * Math.sin(t * 1.3), -80, 980, 30, 320, "#DFF0FF", 0.8, 0.1 * Math.sin(t * 0.9));
    spotlight(ctx, 1460 + 150 * Math.cos(t * 1.1), -80, 980, 30, 320, "#FFE2A0", 0.7, -0.1 * Math.cos(t * 1.1));
    ctx.restore();

    // speed lines behind the runner
    speedLines(ctx, manX + 60, 560, 260, 980, 26, "#FFF2C8", 0.16, t, 5);

    // the man's coat tail, behind him and waving
    ctx.save();
    ctx.fillStyle = "#24344A";
    ctx.beginPath();
    ctx.moveTo(manX - 48, 420);
    ctx.quadraticCurveTo(manX - 136 - 18 * Math.sin(t * 8), 520, manX - 108 - 26 * Math.sin(t * 7), 660);
    ctx.lineTo(manX - 42, 620);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 2.4; ctx.stroke();
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(manX - 54, 450); ctx.quadraticCurveTo(manX - 100, 540, manX - 88, 610); ctx.stroke();
    ctx.restore();

    const mp = {
      bounce, sway: 6, lean: 0.42 + 0.03 * Math.sin(phase * 2), yaw: 0.25, headTilt: 0.08, headTurn: 0.02,
      // The trailing arm folds at the elbow so the hand drops behind the hip,
      // instead of swinging straight back at shoulder height. The leading arm
      // keeps its forward pump.
      armL: [0.50 * stride, 0.75 - 1.25 * Math.max(stride, 0)],
      armR: [-0.50 * stride, 0.75 - 1.25 * Math.max(-stride, 0)],
      footL: [-34 + 160 * stride - 30 * plantL, -20 - 80 * Math.max(0, -stride)],
      footR: [34 - 160 * stride - 30 * plantR, -20 - 80 * Math.max(0, stride)],
    };
    const planted = stride > 0 ? mp.footL : mp.footR;
    shadowEllipse(ctx, manX + planted[0], 900 + planted[1] + 28, 34, 8, 0.3);
    man(ctx, manX, 900, 1.05, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: 2.2, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: 2.6, f: { eyes: "wide", mouth: "o", look: [1, 0] } }]),
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });

    // the detective behind, one bent arm thrown forward for the coat, the other
    // a bent back-swing; legs in a different phase. He runs 70 px further back
    // than the first pass, so the runner's trailing hand never reaches his face.
    const detX = manX - 420;
    const detPhase = phase + Math.PI * 0.9;
    const detStride = Math.sin(detPhase);
    const dp = {
      bounce: -Math.abs(Math.sin(detPhase)) * 6, sway: 4, lean: 0.38, yaw: 0.2, headTilt: 0.06, headTurn: 0.08,
      armL: [0.55, -0.45], armR: [-1.35 - 0.08 * Math.sin(t * 5.3), 0.75],
      footL: [-34 + 140 * detStride, -20 - 80 * Math.max(0, -detStride)],
      footR: [34 - 140 * detStride, -20 - 80 * Math.max(0, detStride)],
    };
    const dPlanted = detStride > 0 ? dp.footL : dp.footR;
    shadowEllipse(ctx, detX + dPlanted[0], 900 + dPlanted[1] + 28, 30, 7, 0.28);
    detective(ctx, detX, 900, 0.9, t, dp, faceAt(lt, [{ t: 0, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: 1.4, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: 2.5, f: { eyes: "wide", mouth: "o", look: [1, 0] } }]));
    // the reaching hand, over the coat back
    const dh = manHand(detX, 900, 0.9, dp, "R");
    ctx.save(); ctx.fillStyle = "#C98A5A";
    ctx.beginPath(); ctx.ellipse(dh[0], dh[1] + (dp.bounce || 0) - 2, 12, 8, -0.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    // the run burst lands on the word
    const burst = C.clamp((lt - runT) / 0.18) * (1 - C.clamp((lt - runT - 0.2) / 0.35));
    if (burst > 0) {
      ctx.save(); ctx.globalAlpha = burst * 0.7;
      speedLines(ctx, manX + 30, 560, 220, 760, 18, "#FFD27A", 0.5, t, 9);
      ctx.restore();
    }

    rainStreaks(ctx, t, 34, "#D8E8F8", 0.20, 1.5);

    TY.type(ctx, "THE RUN", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 17,
      perChar: (i) => C.clamp((t - 3.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "DAY 3 · THE CITY", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "NINE DAYS HE RAN", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
