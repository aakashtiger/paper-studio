/* THE RUN — s05. Day 3, the city chase.
   The thief runs in the olive work coat, flat cap and red scarf; the detective
   runs navy behind him. The detective's right hand catches the coat tail on
   "rain;" and the tail tears free on "city" — a scrap stays in his fist. The
   reaching hand comes around the thief's back, never through it. */

/* A short crease across a bent sleeve at the elbow. */
function elbowCrease05(ctx, e) {
  ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(e[2] + Math.PI / 2);
  ctx.strokeStyle = C.rgba(INK, 0.5); ctx.lineWidth = 2.4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.stroke();
  ctx.strokeStyle = C.rgba("#F2E8D5", 0.18); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-9, -3); ctx.lineTo(9, -3); ctx.stroke();
  ctx.restore();
}

scene({
  id: "s05", start: 10.3, end: 13.04, line: 4, cast: "MAN",
  draw(t, lt, dur) {
    const rainT = syncLocal("s05", "e1"); // 0.42 — "rain;"
    const cityT = syncLocal("s05", "e2"); // 1.20 — "city"
    const faceT = syncLocal("s05", "e4"); // 1.96 — "face."

    const u = C.clamp(lt / dur);
    const thiefX = 700 + 500 * u;
    const phase = lt * 2.35 * TAU;
    const stride = Math.sin(phase);
    const plantL = Math.max(0, stride), plantR = Math.max(0, -stride);

    setCam(C.kf(lt, [[0, 740], [dur, 980]]), C.kf(lt, [[0, 546], [dur, 536]]), C.kf(lt, [[0, 1.0], [dur, 1.06]]), C.kf(lt, [[0, -0.008], [dur, 0.008]]), 1.5, t);
    beginCam(ctx);
    // the night keeps going past the set's left edge, so the camera's zoom never
    // shows the page's paper margin beside the chase
    ctx.fillStyle = "#1E2A36"; ctx.fillRect(-260, 0, 260, 900);
    ctx.fillStyle = "#1A222A"; ctx.fillRect(-260, 900, 260, 180);
    chaseSet(ctx, t);

    // the searchlight sweeps; it finds his face on "face."
    const sweep = 1260 + 360 * Math.sin(t * 0.85);
    ctx.save(); ctx.globalAlpha = 0.24;
    spotlight(ctx, sweep, -80, 1000, 30, 330, "#DFF0FF", 0.9, -0.12 + 0.1 * Math.sin(t * 0.85));
    ctx.restore();
    const faceGlow = C.clamp((lt - faceT) / 0.12) * (1 - C.clamp((lt - faceT - 0.45) / 0.5));
    if (faceGlow > 0) {
      ctx.save(); ctx.globalAlpha = faceGlow * 0.6;
      const g = ctx.createRadialGradient(thiefX + 10, 420, 8, thiefX + 10, 420, 170);
      g.addColorStop(0, C.rgba("#FFF2C8", 0.9)); g.addColorStop(1, C.rgba("#FFF2C8", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(thiefX + 10, 420, 170, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // speed lines behind the pair
    speedLines(ctx, thiefX + 40, 560, 250, 980, 24, "#FFF2C8", 0.15, t, 5);

    // the thief: arms pump opposite the legs, legs stride under the body
    const mp = {
      bounce: -Math.abs(Math.sin(phase)) * 6, sway: 5, lean: 0.40 + 0.03 * Math.sin(phase * 2), yaw: 0.22, headTilt: 0.02, headTurn: 0.02,
      // the near arm pumps forward (bent), the far arm hangs lower/back at the
      // thigh; neither is at the tail, so the detective's hand has it alone
      armL: [0.70, -0.75],
      armR: [0.95 * stride, -0.45],
      footL: [-36 + 118 * stride - 18 * plantL, -8 - 78 * Math.max(0, -stride)],
      footR: [36 - 118 * stride - 18 * plantR, -8 - 78 * Math.max(0, stride)],
    };
    const planted = stride > 0 ? mp.footL : mp.footR;
    shadowEllipse(ctx, thiefX + planted[0], 900 + planted[1] + 24, 34, 8, 0.30);
    // the planted boot kicks water off the street
    if (Math.abs(stride) > 0.55) {
      const side = stride > 0 ? -1 : 1;
      for (let i = 0; i < 4; i++) {
        const k = C.frac(t * 6 + i * 0.25);
        ctx.fillStyle = C.rgba("#C8D8E8", (1 - k) * 0.4);
        ctx.beginPath(); ctx.arc(thiefX + planted[0] + side * (10 + k * 60), 900 - k * 34 + i * 4, 1.6 + k * 2, 0, TAU); ctx.fill();
      }
    }
    man(ctx, thiefX, 900, 1.05, {
      t, pose: mp, role: "thief",
      face: faceAt(lt, [
        { t: 0, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
        { t: rainT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: cityT, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
        { t: faceT, f: { eyes: "wide", mouth: "flat", look: [0, -1] } },
        { t: faceT + 0.4, f: { eyes: "normal", mouth: "flat", look: [0, -1] } },
      ]),
    });

    // the detective: navy trench, fedora, badge; right arm thrown at the tail
    const detX = thiefX - 340;
    const detPhase = phase + Math.PI * 0.9;
    const detStride = Math.sin(detPhase);
    const catchK = Math.exp(-Math.pow((lt - rainT) / 0.16, 2));
    const tearK = C.easeOut(C.clamp((lt - cityT) / 0.30));
    const dp = {
      bounce: -Math.abs(Math.sin(detPhase)) * 6, sway: 4, lean: 0.34 + 0.05 * tearK, yaw: 0.18, headTilt: 0.02, headTurn: 0.08,
      // the far arm folds at the elbow: upper arm out of the trench, forearm
      // down, hand at the hip; the near right stays on the coat tail
      armL: [0.60 + 0.15 * detStride, -1.00],
      armR: [-1.00 - 0.10 * catchK + 0.30 * tearK, 0.25],
      footL: [-34 + 112 * detStride, -8 - 74 * Math.max(0, -detStride)],
      footR: [34 - 112 * detStride, -8 - 74 * Math.max(0, detStride)],
    };
    const dPlanted = detStride > 0 ? dp.footL : dp.footR;
    shadowEllipse(ctx, detX + dPlanted[0], 900 + dPlanted[1] + 24, 30, 7, 0.28);

    // the coat tail: from the thief's hem to the detective's near hand. It is
    // drawn after the thief and before the detective, so the fist closes on it.
    const dh = castHand(detX, 900, 0.94, dp, "R");
    const tailTipX = C.lerp(dh[0] + 9, thiefX - 66, tearK);
    const tailTipY = C.lerp(dh[1] + 11, 646, tearK);
    const rootX = thiefX - 52;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(rootX + 6, 584);
    ctx.quadraticCurveTo(rootX - 40, 596 + 22 * Math.sin(t * 9), tailTipX, tailTipY - 18);
    ctx.lineTo(tailTipX + 16, tailTipY + 8);
    ctx.quadraticCurveTo(rootX - 34, 638 + 14 * Math.sin(t * 8 + 1), rootX + 14, 650);
    ctx.closePath();
    ctx.fillStyle = "#7C6A4A"; ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.72); ctx.lineWidth = 2.8; ctx.stroke();
    ctx.strokeStyle = C.rgba("#C8B48A", 0.30); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rootX + 2, 610); ctx.quadraticCurveTo(rootX - 36, 618, tailTipX + 6, tailTipY - 8); ctx.stroke();
    // the seam that attaches the tail to the coat hem
    ctx.strokeStyle = C.rgba(INK, 0.45); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rootX + 8, 588); ctx.lineTo(rootX + 16, 648); ctx.stroke();
    ctx.restore();

    // the torn hem, and the scrap left in the detective's fist
    if (tearK > 0.02) {
      ctx.save(); ctx.globalAlpha = 0.9;
      ctx.fillStyle = C.rgba(INK, 0.55);
      ctx.beginPath(); ctx.moveTo(thiefX - 52, 594); ctx.lineTo(thiefX - 40, 612); ctx.lineTo(thiefX - 52, 624); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    detective(ctx, detX, 900, 0.94, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
      { t: rainT, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
      { t: rainT + 0.35, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: cityT + 0.42, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
    ]));

    // crease the bent elbows, so the sleeves read as folded
    elbowCrease05(ctx, castElbow(thiefX, 900, 1.05, mp, "R"));
    elbowCrease05(ctx, castElbow(thiefX, 900, 1.05, mp, "L"));
    elbowCrease05(ctx, castElbow(detX, 900, 0.94, dp, "L"));

    // the coat tail is visibly in the detective's fist: a gathered olive fold
    // across the hand, with two of his fingers over it
    if (tearK < 0.6) {
      ctx.save(); ctx.translate(dh[0] + 6, dh[1] + 3); ctx.rotate(-0.35 + 0.10 * Math.sin(t * 5));
      paper(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-16, -11); ctx.quadraticCurveTo(4, -16, 19, -5);
        ctx.quadraticCurveTo(26, 5, 12, 12); ctx.quadraticCurveTo(-6, 16, -18, 5);
        ctx.closePath();
      }, { fill: "#7C6A4A", edge: C.rgba(INK, 0.72), edgeW: 2.2, shadow: C.rgba(INK, 0.28), sx: 2, sy: 4 });
      ctx.strokeStyle = C.rgba("#C8B48A", 0.35); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(4, -6, 17, 2); ctx.stroke();
      ctx.fillStyle = "#C98A5A";
      for (let i = 0; i < 2; i++) {
        ctx.beginPath(); ctx.ellipse(-3 + i * 14, -7 + i * 9, 4.4, 7.5, 0.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = C.rgba(INK, 0.4); ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    }

    if (tearK > 0.05) {
      ctx.save(); ctx.globalAlpha = C.clamp(tearK * 1.4);
      ctx.translate(dh[0] + 4, dh[1] + 2); ctx.rotate(-0.55 + 0.2 * Math.sin(t * 5));
      paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-9, -18); ctx.lineTo(11, -14); ctx.lineTo(16, 14); ctx.lineTo(-4, 20); ctx.lineTo(-12, 2); ctx.closePath(); }, { fill: "#6B5A3E", edge: C.rgba(INK, 0.72), edgeW: 2.3, shadow: C.rgba(INK, 0.3), sx: 2, sy: 4 });
      ctx.strokeStyle = C.rgba("#C8B48A", 0.3); ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(10, -6); ctx.stroke();
      // two fingers over the scrap
      ctx.fillStyle = "#C98A5A";
      ctx.beginPath(); ctx.ellipse(-2, 8, 3.4, 8, 0.1, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    rainStreaks(ctx, t, 44, "#D8E8F8", 0.24, 1.6);
    endCam(ctx);

    // the corner page: day 3
    calendarProp(ctx, 1786, 990, 0.32, 3, t, 0, { oldDay: 3 });

    TY.type(ctx, "THE RUN", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 19,
      perChar: (i) => C.clamp((t - 10.45 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE CITY", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CITY KEPT HIS FACE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "KEEP RUNNING", 1600, 760, 24, { fill: CORAL, text: CREAM, seed: 13, rot: -0.05, time: t });
  },
});
