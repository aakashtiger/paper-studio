/* THE RUN — s01. Day 1, the alley.
   The murder: the man kneels over the sheeted body with the knife in his right
   hand, holds it there while the rain takes the lamp, then stands and steps
   back. No police tape, no case file: the sheet and the knife are the shot.
   He is the killer in a dark civilian coat; the thief's olive work coat does
   not exist until s04. */

/* The hand at the end of a rig arm, with the torso's lean and bounce applied.
   manHand() ignores both, so a bent-over pose would leave a prop floating. */
function castHand(x, y, s, p, side) {
  const hip = -280, bounce = p.bounce || 0, lean = p.lean || 0;
  const arm = side === "L" ? (p.armL || [0.28, -0.35]) : (p.armR || [-0.32, 0.45]);
  const sx = side === "L" ? -80 : 80;
  const a1 = arm[0], a2 = arm[0] + arm[1];
  const hx = sx - Math.sin(a1) * 104 - Math.sin(a2) * 88;
  const hy = -500 + Math.cos(a1) * 104 + Math.cos(a2) * 88;
  const c = Math.cos(lean), sn = Math.sin(lean);
  const lx = hx * c - (hy + 280) * sn;
  const ly = hx * sn + (hy + 280) * c - 280 + bounce;
  return [x + lx * s, y + ly * s];
}

/* The elbow of the same arm, plus its screen angle from vertical. Used to
   crease a sleeve where it bends, so a back-swing is not read as a bar. */
function castElbow(x, y, s, p, side) {
  const bounce = p.bounce || 0, lean = p.lean || 0;
  const arm = side === "L" ? (p.armL || [0.28, -0.35]) : (p.armR || [-0.32, 0.45]);
  const sx = side === "L" ? -80 : 80;
  const a1 = arm[0];
  const ex = sx - Math.sin(a1) * 104, ey = -500 + Math.cos(a1) * 104;
  const c = Math.cos(lean), sn = Math.sin(lean);
  const lx = ex * c - (ey + 280) * sn;
  const ly = ex * sn + (ey + 280) * c - 280 + bounce;
  return [x + lx * s, y + ly * s, a1 + lean];
}

scene({
  id: "s01", start: 0, end: 3.38, line: 0, cast: "MAN",
  draw(t, lt, dur) {
    const knifeT = syncLocal("s01", "e4"); // 2.28 — "knife,"
    const flick = 0.78 + 0.22 * Math.abs(Math.sin(t * 11.7)) * (0.8 + 0.2 * Math.sin(t * 3.3));

    setCam(C.kf(lt, [[0, 1060], [dur, 1086]]), C.kf(lt, [[0, 640], [dur, 575]]), C.kf(lt, [[0, 1.12], [dur, 1.20]]), C.kf(lt, [[0, 0.010], [dur, -0.005]]), 1.1, t);
    beginCam(ctx);
    // the alley wall continues past the set's right edge, so the zoomed frame
    // never shows the page's paper margin at the side
    ctx.fillStyle = "#36302A"; ctx.fillRect(1900, 0, 220, 900);
    ctx.fillStyle = "#2A2620"; ctx.fillRect(1900, 900, 220, 180);
    ctx.strokeStyle = C.rgba("#0A0806", 0.9); ctx.lineWidth = 3;
    for (let y = 0; y < 900; y += 44) { ctx.beginPath(); ctx.moveTo(1920, y); ctx.lineTo(2120, y); ctx.stroke(); }
    alleySet(ctx, t, { flicker: flick, tape: false, poster: false });
    // the set's coral neon slash reads as a red tape strip at the wall's right;
    // it is neither police tape nor the poster, so cover it with matching brick
    ctx.save();
    ctx.fillStyle = "#36302A"; ctx.fillRect(1330, 676, 274, 62);
    ctx.strokeStyle = C.rgba("#0A0806", 0.9); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(1330, 704); ctx.lineTo(1604, 704); ctx.stroke();
    ctx.strokeStyle = C.rgba("#C8B8A0", 0.5); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(1331, 705); ctx.lineTo(1603, 705); ctx.stroke();
    ctx.strokeStyle = C.rgba("#0A0806", 0.9); ctx.lineWidth = 3;
    for (const x of [1380, 1500]) { ctx.beginPath(); ctx.moveTo(x, 676); ctx.lineTo(x, 704); ctx.stroke(); }
    for (const x of [1440, 1560]) { ctx.beginPath(); ctx.moveTo(x, 704); ctx.lineTo(x, 738); ctx.stroke(); }
    ctx.restore();
    // The body under a clean sheet. A sheeted body is a long, low mound, not a
    // tent: 1.9 m long and about 0.35 m high, so the silhouette runs head ->
    // chest -> waist dip -> knees -> feet and never rises above the kneeling
    // man's shoulder. The head is a wrapped bump at the near end, the chest is
    // the highest point, and the feet make two points at the far end.
    const settle = Math.sin(lt * 1.15) * 1.4;
    ctx.save();
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(688, 936);
      ctx.quadraticCurveTo(700, 862, 736, 810 + settle);   // the wrapped head
      ctx.quadraticCurveTo(790, 790 + settle, 846, 822 + settle);
      ctx.quadraticCurveTo(886, 842 + settle, 928, 786 + settle); // neck into the shoulders
      ctx.quadraticCurveTo(1010, 756 + settle, 1096, 768 + settle); // the chest
      ctx.quadraticCurveTo(1200, 792 + settle, 1266, 826 + settle); // the waist dip
      ctx.quadraticCurveTo(1350, 786 + settle, 1440, 806 + settle); // the knees
      ctx.quadraticCurveTo(1530, 826 + settle, 1568, 848 + settle);
      ctx.quadraticCurveTo(1588, 818 + settle, 1610, 844 + settle); // the feet, two points
      ctx.quadraticCurveTo(1640, 884, 1642, 936);
      ctx.closePath();
    }, { fill: "#DFD2B8", edge: C.rgba(INK, 0.55), edgeW: 2.6, shadow: C.rgba(INK, 0.38), sx: 4, sy: 7 });
    ctx.save();
    // the folds follow the form: the head wrap, the shoulder, the ribs, the
    // waist, the knee. They are curves, never vertical bars, so the cloth reads
    // as cloth and not as a cone with seams.
    ctx.strokeStyle = C.rgba(INK, 0.24); ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(742, 812 + settle); ctx.quadraticCurveTo(806, 828, 852, 818 + settle); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(900, 800 + settle); ctx.quadraticCurveTo(960, 830, 1010, 838 + settle); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1080, 772 + settle); ctx.quadraticCurveTo(1130, 812, 1180, 830 + settle); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1290, 826 + settle); ctx.quadraticCurveTo(1340, 812, 1392, 812 + settle); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1490, 818 + settle); ctx.quadraticCurveTo(1540, 838, 1584, 848 + settle); ctx.stroke();
    // the hem line along the ground, and the folded edge at the foot
    ctx.strokeStyle = C.rgba(INK, 0.3); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(694, 928); ctx.quadraticCurveTo(1180, 906, 1636, 928); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1568, 848 + settle); ctx.quadraticCurveTo(1596, 888, 1600, 930); ctx.stroke();
    // a corner lifted by the rain, at the foot end
    ctx.fillStyle = C.rgba("#EFE3CB", 0.85);
    ctx.beginPath(); ctx.moveTo(1600, 878); ctx.lineTo(1648, 890); ctx.lineTo(1622, 930); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.restore();
    ctx.restore();

    // the lit window's warm lift, so the sheet and the blade read at night
    const lift = ctx.createRadialGradient(1560, 430, 40, 1560, 430, 640);
    lift.addColorStop(0, C.rgba("#FFE2A0", 0.20));
    lift.addColorStop(1, C.rgba("#FFE2A0", 0));
    ctx.fillStyle = lift; ctx.beginPath(); ctx.arc(1560, 430, 640, 0, TAU); ctx.fill();

    // the man: down over the sheet, the knife held in the right hand; then up
    // The left hand stays down at his side, behind the coat: the far arm is
    // painted before the torso, so any left-hand gesture reads as a severed
    // hand floating over the wall. The knife hand is the gesture.
    const kneel = {
      ...MAN_POSES.kneel, bounce: 178, footL: [-62, -194], footR: [52, -34],
      lean: 0.40, armL: [0.22, -0.30], armR: [-0.55, 0.25], headTilt: 0.30, headTurn: 0.20,
    };
    const press = {
      ...kneel, lean: 0.44, armR: [-0.62, 0.22], headTilt: 0.34, headTurn: 0.22,
    };
    const rise = {
      ...MAN_POSES.stand, bounce: 44, lean: 0.16, armL: [0.36, -0.12], armR: [-0.46, 0.60],
      footL: [-30, -10], footR: [30, -8], headTilt: 0.04, headTurn: 0.04,
    };
    const stood = {
      ...MAN_POSES.stand, bounce: 0, lean: 0.04, armL: [0.32, -0.28], armR: [-0.34, 0.46],
      headTilt: 0.02, headTurn: -0.10,
    };
    // The press is not a freeze: his weight shifts on the knee and the blade
    // grinds a little, so the longest still in the shot stays under 1.2 s.
    const pressB = { ...press, armR: [-0.74, 0.30], lean: 0.47, headTilt: 0.37 };
    const pressC = { ...press, armR: [-0.58, 0.16], lean: 0.42, headTilt: 0.31 };
    const pressD = { ...press, armR: [-0.70, 0.26], lean: 0.46, headTilt: 0.36 };
    const mp = poseAt(lt, [
      [0, kneel], [0.85, press], [1.28, pressB], [1.72, pressC], [2.18, pressD],
      [2.58, rise], [3.08, stood], [dur, stood],
    ]);
    // breathing and rain shiver keep the body alive; the weight stays on the knee
    mp.bounce += Math.sin(t * 5.6) * 1.3;
    mp.sway = 1.4;

    const manX = 900 - 210 * C.ease(C.clamp((lt - 2.35) / 0.75));
    const manY = 905;
    const h = castHand(manX, manY, 1.02, mp, "R");

    man(ctx, manX, manY, 1.02, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        { t: 0.85, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        { t: knifeT - 0.10, f: { eyes: "wide", mouth: "flat", look: [1, 1] } },
        { t: knifeT + 0.40, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: 2.65, f: { eyes: "normal", mouth: "flat", look: [0, -1] } },
        { t: 3.1, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      ]),
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#6E6A60", jacket: "#20262E", trouser: "#141A22", shoe: "#12100E", hair: "#241D18" },
    });

    // the knife: held up in the right hand, blade clear of the sheet against
    // his dark coat; the thumb closes over the handle. A dark rim and a shadow
    // keep the pale steel readable on the pale sheet.
    const bladeA = -0.16, bladeS = 1.52;
    const knifeX = h[0] + 2, knifeY = h[1] + 2;
    ctx.save();
    ctx.translate(knifeX, knifeY); ctx.rotate(bladeA); ctx.scale(bladeS, bladeS);
    ctx.fillStyle = "#171310";
    ctx.beginPath(); ctx.moveTo(-8.6, 2.2); ctx.lineTo(12.6, 2.2); ctx.lineTo(5.2, -60.8); ctx.lineTo(-8.6, -44.2); ctx.closePath(); ctx.fill();
    roundRectPath(ctx, -8.2, -1.4, 20.4, 41.6, 4); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.shadowColor = C.rgba(INK, 0.85); ctx.shadowBlur = 7; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 5;
    knifeProp(ctx, knifeX, knifeY, bladeS, bladeA, 0);
    ctx.restore();
    ctx.save();
    const kTipX = knifeX + Math.sin(bladeA) * 58 * bladeS;
    const kTipY = knifeY - Math.cos(bladeA) * 58 * bladeS;
    ctx.strokeStyle = C.rgba("#FFF6DA", 0.55); ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(knifeX + Math.sin(bladeA) * 10, knifeY - Math.cos(bladeA) * 10);
    ctx.lineTo(kTipX + Math.sin(bladeA) * 10, kTipY + 9); ctx.stroke();
    ctx.restore();

    // the thumb over the handle: the knife is held, not balanced on the palm
    ctx.save(); ctx.translate(knifeX + 9, knifeY + 8); ctx.rotate(-0.22);
    paper(ctx, () => roundRectPath(ctx, -4.5, 0, 9, 19, 4.5), { fill: "#C98A5A", edge: C.rgba(INK, 0.55), edgeW: 1.3 });
    ctx.strokeStyle = C.rgba(INK, 0.25); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-2, 11); ctx.lineTo(2, 11); ctx.stroke();
    ctx.restore();

    // the blade takes the lamp once on "knife,"
    const glintK = C.clamp((lt - knifeT) / 0.10) * (1 - C.clamp((lt - knifeT - 0.30) / 0.40));
    if (glintK > 0.01) {
      const tipX = knifeX + Math.sin(bladeA) * 58 * bladeS;
      const tipY = knifeY - Math.cos(bladeA) * 58 * bladeS;
      ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(0.2);
      ctx.fillStyle = C.rgba("#FFF6DA", 0.92 * glintK);
      sparkPath(ctx, 0, 0, 13 + 17 * glintK); ctx.fill();
      ctx.strokeStyle = C.rgba("#FFD27A", 0.7 * glintK); ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }

    // rain sheen down the black coat, and a warm rim off the window
    ctx.save();
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.28); ctx.lineWidth = 2.2; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(manX - 52 + i * 36, 474 + i * 12);
      ctx.quadraticCurveTo(manX - 58 + i * 36, 560, manX - 46 + i * 36, 616 + i * 8);
      ctx.stroke();
    }
    ctx.strokeStyle = C.rgba("#FFD27A", 0.24); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(manX + 62, 410); ctx.quadraticCurveTo(manX + 80, 520, manX + 66, 626); ctx.stroke();
    ctx.restore();

    rainStreaks(ctx, t, 44, "#D8E8F8", 0.20, 1.6);
    endCam(ctx);

    // the corner page: day 1
    calendarProp(ctx, 1786, 990, 0.32, 1, t, 0, { oldDay: 1 });

    TY.type(ctx, "THE ALLEY", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 11,
      perChar: (i) => C.clamp((t - 0.15 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "RAIN ON THE BRICKS", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE THIEF", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    // No case number in the murder shot: the detective has not opened the
    // file yet. The sticker belongs to s03, after the body is found.
  },
});
