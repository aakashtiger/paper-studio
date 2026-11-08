/* THE RUN — s14. Day 9, the bridge.

   Match cut from s13: the camera starts where s13 ended, the man starts at the
   same world position and continues his stride. The detective steps out of the
   lamp's shadow with the man's grey flat cap held up in his right hand — the
   same flat cap left on the checkpoint barrier, not a fedora. The man stops. */

scene({
  id: "s14", start: 37.42, end: 39.2, line: 13, cast: "MAN / DETECTIVE",
  draw(t, lt, dur) {
    const waitedT = syncLocal("s14", "e0"); // 0.10 — "waited"
    const farT = syncLocal("s14", "e1");    // 0.90 — "far"
    const endT = syncLocal("s14", "e2");    // 1.12 — "end."

    // s13 ended with the man at x=860, stride sin(2.767)=0.366. Continue it.
    const PHASE0 = 2.7669;
    const stopK = C.ease(C.clamp(lt / 1.18));
    const x = 860 + 40 * stopK;
    const phase = PHASE0 + lt * TAU * 1.22;
    const stride = Math.sin(phase) * (1 - stopK);
    const liftL = Math.max(0, -stride), liftR = Math.max(0, stride);

    // s13 ended at (940, 525, 1.09, -0.006). Start there.
    setCam(
      C.kf(lt, [[0, 940], [dur, 880]]),
      C.kf(lt, [[0, 525], [dur, 545]]),
      C.kf(lt, [[0, 1.09], [dur, 1.0]]),
      C.kf(lt, [[0, -0.006], [dur, 0.004]]),
      1.2, t
    );
    ctx.fillStyle = "#1C2834"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    bridgeSet(ctx, t);
    // The far end is a place: a police barrier and its booth close the walkway,
    // under the searchlight. It is what "the only way out" looks like.
    bridgeEndGate(ctx, t, { lit: 0.55 });

    // the far lamp and the dark wedge it throws to its right
    ctx.save();
    ctx.globalAlpha = 0.20;
    spotlight(ctx, 1600, 406, 560, 40, 300, "#FFE2A0", 0.8, 0.10);
    ctx.restore();
    ctx.fillStyle = C.rgba("#080C12", 0.38);
    ctx.beginPath(); ctx.moveTo(1600, 406); ctx.lineTo(1626, 1080); ctx.lineTo(1920, 1080); ctx.lineTo(1920, 406); ctx.closePath(); ctx.fill();

    // The detective leaves the barrier and comes down the deck to him. He WAITS
    // at the gate through "waited at the far end." (the line names the place he
    // is standing in), then walks down and is beside the man at the cut, so
    // "at the far end" is answered by the picture in both halves.
    const WALK0 = farT;          // he holds at the far end until "far"
    const WALK1 = farT + 0.88;   // then comes down the deck to the man
    const step = C.ease(C.clamp((lt - WALK0) / (WALK1 - WALK0)));
    const detX = C.lerp(1620, 1120, step);
    const detS = C.lerp(0.86, 0.98, step);
    const raise = C.ease(C.clamp((lt - waitedT) / (farT - waitedT)));
    const detPhase = lt * TAU * 1.7;
    // the stride runs while he is actually travelling, so he walks the deck
    // instead of sliding across it with planted feet.
    const walking = lt > WALK0 && lt < WALK1;
    const dStride = Math.sin(detPhase) * (walking ? 1 : 0);
    const dp = {
      bounce: -Math.abs(dStride) * 2.6 + Math.sin(t * 4.4) * 0.8,
      sway: 3, lean: 0.03, yaw: -0.12, headTilt: 0.02, headTurn: -0.30,
      armL: [0.18, 0.25],
      armR: [C.lerp(-0.30, -2.05, raise), C.lerp(0.35, 0.30, raise)],
      footL: [-30 + 44 * dStride, -8],
      footR: [30 - 44 * dStride, -8],
    };
    // the cap beats the hand: compute the holding hand, then draw the cap
    // before the detective so his mitten closes over the brim
    const dhR = armHandAt(detX, 900, detS, dp, "R");
    flatCapProp(ctx, dhR[0] + 12, dhR[1] - 4, detS * 0.85, C.lerp(-0.06, 0.02, raise));

    // the case file tucked under his left arm: the outer half sits outside the
    // coat silhouette, so the cover and label read instead of a white wedge
    caseFile(ctx, detX - 150 * detS, 900 - 300 * detS, 0.38 * detS, 0.55, t);

    detective(ctx, detX, 900, detS, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: farT, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: endT, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]));
    // his fingers on the brim, so the cap is held and not floating
    ctx.save(); ctx.translate(dhR[0] + 4, dhR[1] + 2); ctx.rotate(-1.2);
    hand(ctx, 1, false, "#C98A5A");
    ctx.restore();

    // the man walks the last half step, then stops on "end."
    const mp = {
      bounce: -Math.abs(stride) * 4.0 * (1 - stopK) + Math.sin(t * 5.7) * 0.8 * (1 - stopK),
      sway: C.lerp(4, 1, stopK), lean: C.lerp(0.08, -0.03, stopK), yaw: 0.16,
      headTilt: C.lerp(0.02, -0.02, stopK), headTurn: C.lerp(0.16, 0.26, stopK),
      armL: [C.lerp(0.28 + 0.20 * stride, 0.22, stopK), C.lerp(-0.22, -0.16, stopK)],
      armR: [C.lerp(-0.30 - 0.20 * stride, -0.28, stopK), C.lerp(0.34, 0.30, stopK)],
      footL: [C.lerp(-30 + 54 * stride, -36, stopK), C.lerp(-8 - 24 * liftL, -8, stopK)],
      footR: [C.lerp(30 - 54 * stride, 36, stopK), C.lerp(-8 - 24 * liftR, -8, stopK)],
    };
    man(ctx, x, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: farT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: endT, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
      ]),
      role: "thief", hat: null, costume: "coat", hair: "#1E1610",
    });

    // the stop: a small skid of the planted boot and a rain splash
    if (stopK > 0.30) {
      const k = (stopK - 0.30) / 0.70;
      ctx.fillStyle = C.rgba("#C8D8E8", 0.22 * k);
      ctx.beginPath(); ctx.ellipse(x - 40, 906, 42 + 16 * k, 6, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 40, 906, 42 + 16 * k, 6, 0, 0, TAU); ctx.fill();
    }

    // the corner page still reads nine
    ctx.save();
    ctx.translate(150, 878); ctx.rotate(-0.05);
    paper(ctx, () => roundRectPath(ctx, -64, -94, 128, 188, 5), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-64, -94, 128, 28);
    TY.text(ctx, "THE RUN", 0, -74, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 1 });
    TY.text(ctx, "9", 0, 40, 78, { family: "Archivo Black", color: PAL.ink, align: "center" });
    TY.text(ctx, "DAY", 0, 72, 13, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 4 });
    ctx.restore();

    endCam(ctx);

    TY.type(ctx, "THE FAR END", 120, 140, 88, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 37,
      perChar: (i) => C.clamp((t - 37.6 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE BRIDGE", 124, 236, 18, { family: "DMMono", color: C.rgba(CREAM, 0.82), letter: 3, stroke: C.rgba(INK, 0.55), strokeW: 3 });
    TY.text(ctx, "THE GREY CAP", 124, 264, 14, { family: "DMMono", color: C.rgba(CREAM, 0.62), letter: 2, stroke: C.rgba(INK, 0.5), strokeW: 3 });
    TY.sticker(ctx, "HE STOPPED", 1640, 900, 25, { fill: MUSTARD, text: INK, seed: 37, rot: 0.04, time: t });
  },
});
