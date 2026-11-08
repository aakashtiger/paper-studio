/* THE RUN — s02. Day 1, the alley, on the knife.
   His hand opens over the blade and leaves it in the rain, then the sleeve
   withdraws out of frame left; the blade takes the lamp once on "sheet."
   The arm is a forearm at the man's scale: it enters at waist height close to
   the frame edge and ends in a mitten, so it never becomes a boom across the
   screen. The body sheet sits at the right edge. */

scene({
  id: "s02", start: 3.38, end: 4.88, line: 1, cast: "MAN",
  draw(t, lt, dur) {
    const bodyT = syncLocal("s02", "e0");  // 0.20 — "body"
    const sheetT = syncLocal("s02", "e2"); // 0.86 — "sheet."

    setCam(C.kf(lt, [[0, 800], [dur, 820]]), C.kf(lt, [[0, 630], [dur, 636]]), C.kf(lt, [[0, 1.25], [dur, 1.33]]), C.kf(lt, [[0, -0.008], [dur, 0.008]]), 1.0, t);
    beginCam(ctx);
    alleySet(ctx, t, { flicker: 0.80 + 0.20 * Math.abs(Math.sin(t * 12.7)), tape: false, poster: false });

    // the body sheet at the frame edge: head and shoulders, the rest cropped
    const settle = Math.sin(lt * 1.3) * 1.2;
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(884, 940);
      ctx.quadraticCurveTo(894, 890, 916, 862 + settle);
      ctx.quadraticCurveTo(930, 830 + settle, 962, 820 + settle);
      ctx.quadraticCurveTo(996, 812 + settle, 1022, 830 + settle);
      ctx.quadraticCurveTo(1038, 844 + settle, 1058, 846 + settle);
      ctx.quadraticCurveTo(1100, 816 + settle, 1170, 812 + settle);
      ctx.quadraticCurveTo(1260, 810 + settle, 1330, 834 + settle);
      ctx.quadraticCurveTo(1420, 860 + settle, 1520, 894 + settle);
      ctx.quadraticCurveTo(1550, 914 + settle, 1568, 940);
      ctx.closePath();
    }, { fill: "#E4D8C0", edge: C.rgba(INK, 0.55), edgeW: 2.6, shadow: C.rgba(INK, 0.38), sx: 4, sy: 7 });
    ctx.save();
    ctx.strokeStyle = C.rgba(INK, 0.24); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(952, 828 + settle); ctx.quadraticCurveTo(976, 870, 990, 936); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1066, 846 + settle); ctx.quadraticCurveTo(1100, 888, 1116, 936); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1230, 816 + settle); ctx.quadraticCurveTo(1262, 874, 1280, 936); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1390, 850 + settle); ctx.quadraticCurveTo(1420, 894, 1436, 936); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.30); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(896, 922); ctx.quadraticCurveTo(1200, 890, 1556, 922); ctx.stroke();
    ctx.fillStyle = C.rgba("#F4EBD8", 0.8);
    ctx.beginPath(); ctx.moveTo(1512, 898); ctx.lineTo(1558, 908); ctx.lineTo(1534, 938); ctx.closePath(); ctx.fill();
    ctx.restore();

    // the lamp's warm pool on the wet ground, and the knife in it
    const pool = ctx.createRadialGradient(310, 906, 20, 310, 906, 330);
    pool.addColorStop(0, C.rgba("#FFE2A0", 0.18));
    pool.addColorStop(1, C.rgba("#FFE2A0", 0));
    ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(310, 906, 330, 0, TAU); ctx.fill();

    const glint = C.clamp((lt - sheetT) / 0.10) * (1 - C.clamp((lt - sheetT - 0.24) / 0.42));
    knifeProp(ctx, 306, 908, 0.90, -1.48, glint);

    // the arm: a forearm from the left edge at waist height; the hand lifts off
    // the knife on "sheet." and withdraws left
    const openK = C.easeOut(C.clamp((lt - bodyT) / 0.26));
    const leaveK = C.easeOut(C.clamp((lt - (sheetT - 0.10)) / 0.62));
    const handX = C.lerp(252, 108, leaveK);
    const handY = C.lerp(856, 728, leaveK) - 10 * openK;
    const sleeveCol = "#20262E", skin = "#C98A5A";
    const wristX = handX - 22, wristY = handY - 10;

    // the sleeve: 46 px at the frame edge, 40 at the cuff, at the cast's scale
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-40, 640);
    ctx.quadraticCurveTo(80, 690, wristX - 8, wristY - 24);
    ctx.lineTo(wristX + 20, wristY + 12);
    ctx.quadraticCurveTo(80, 736, -40, 692);
    ctx.closePath();
    ctx.fillStyle = sleeveCol; ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.72); ctx.lineWidth = 2.6; ctx.stroke();
    // a forearm fold and the wet edge
    ctx.strokeStyle = C.rgba(INK, 0.28); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, 680); ctx.quadraticCurveTo(wristX * 0.5, 706, wristX - 14, wristY + 2); ctx.stroke();
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.24); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, 652); ctx.quadraticCurveTo(90, 692, wristX - 12, wristY - 16); ctx.stroke();
    // the cuff sits over the wrist seam
    ctx.save(); ctx.translate(wristX, wristY); ctx.rotate(0.44);
    paper(ctx, () => roundRectPath(ctx, -28, -22, 56, 25, 5), { fill: C.shade(sleeveCol, -8), edge: C.rgba(INK, 0.7), edgeW: 1.8, shadow: C.rgba(INK, 0.22), sx: 2, sy: 4 });
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-26, -11); ctx.lineTo(26, -11); ctx.stroke();
    ctx.restore();
    ctx.restore();

    // the hand, at the same scale as the rest of the cast
    ctx.save(); ctx.translate(handX + 4, handY + 2); ctx.rotate(0.5); ctx.scale(1.3, 1.3);
    manMitten(ctx, 1, openK > 0.4, skin, sleeveCol);
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-2, 20); ctx.lineTo(-2, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5, 19); ctx.lineTo(5, 28); ctx.stroke();
    ctx.restore();

    rainStreaks(ctx, t, 54, "#D8E8F8", 0.26, 1.7);
    endCam(ctx);

    // the corner page: day 1
    calendarProp(ctx, 1786, 990, 0.32, 1, t, 0, { oldDay: 1 });

    TY.type(ctx, "THE KNIFE", 120, 140, 92, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 13,
      perChar: (i) => C.clamp((t - 3.24 - i * 0.02) / 0.3),
    });
    TY.text(ctx, "THE ALLEY", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "HE LEFT IT IN THE RAIN", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "LEFT IN THE RAIN", 1120, 610, 24, { fill: CORAL, text: CREAM, seed: 9, rot: -0.05, time: t });
  },
});
