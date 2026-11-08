/* THE RUN — s20. Day 10, dawn in the yard. The warder brings him in from the
   yard door, walking, and cuffs him on the way: the near gate shuts at 0.58,
   the far gate at 1.0, and the chain runs between two wrists from then on. The
   noose is only a shadow on the bricks, hanging left of the man, never on him.
   Pull out. */

/* The noose as a shadow on the yard wall: an empty loop and its standing part,
   never around a body. The standing part leaves the beam's own shadow, so the
   shadow is one piece: beam, rope, loop. Thin, flat and non-graphic. */
function nooseShadow(ctx, x, beamY, endX, endY, sway, s = 1, alpha = 0.5, taut = 0) {
  ctx.save(); ctx.translate(x, 0); ctx.scale(s, s);
  const sx = endX - x;
  // the beam's shadow, matching the width between the gallows posts
  ctx.strokeStyle = C.rgba("#14100C", alpha * 0.70);
  ctx.lineWidth = 14; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-222, beamY + 10); ctx.lineTo(222, beamY + 10); ctx.stroke();
  // The standing part runs from the beam to the KNOT at the top of the loop,
  // not through the loop's centre. That was the pendulum read.
  const loopY = endY + 12 * taut;
  const topY = loopY - 44;
  ctx.strokeStyle = C.rgba("#14100C", alpha);
  ctx.lineWidth = 2.8; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, beamY + 7);
  ctx.quadraticCurveTo(sx + sway * 12 * (1 - taut), (beamY + topY) / 2, sx + sway * 7 * (1 - taut), topY);
  ctx.stroke();
  // the loop: a vertical oval hanging from the knot, one piece with the rope.
  // taut = 1 pulls it out of the loop into a taut standing part (s21's drop).
  ctx.save(); ctx.translate(sx + sway * 7 * (1 - taut), loopY); ctx.rotate(0.04 + sway * 0.4 * (1 - taut));
  ctx.strokeStyle = C.rgba("#14100C", alpha); ctx.lineWidth = 2.8;
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 44 * (1 - 0.90 * taut), 0, 0, TAU); ctx.stroke();
  // the knot at the top, where the standing part meets the loop
  ctx.fillStyle = C.rgba("#14100C", alpha * 0.85);
  ctx.beginPath(); ctx.ellipse(0, -44, 9, 7, 0, 0, TAU); ctx.fill();
  // the short tail below the knot
  ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(0, -58); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

/* The yard door they came through: a stone lintel, a dark opening, a sliver of
   dawn. Drawn after the yard set, before the cast, so the men can stand at it. */
function yardDoor60(ctx) {
  ctx.save();
  // the opening cut into the wall
  ctx.fillStyle = "#14100C"; ctx.fillRect(52, 326, 178, 574);
  const g = ctx.createLinearGradient(52, 0, 230, 0);
  g.addColorStop(0, C.rgba("#FFD27A", 0.20));
  g.addColorStop(0.30, C.rgba("#2A2018", 0.30));
  g.addColorStop(1, C.rgba("#0A0806", 0.55));
  ctx.fillStyle = g; ctx.fillRect(52, 326, 178, 574);
  // the long bar of dawn on the near jamb
  ctx.fillStyle = C.rgba("#FFD27A", 0.30); ctx.fillRect(56, 330, 10, 566);
  ctx.fillStyle = C.rgba("#FFE2A0", 0.12); ctx.fillRect(66, 330, 22, 566);
  // stone jambs and lintel
  paper(ctx, () => roundRectPath(ctx, 30, 310, 220, 26, 4), { fill: "#5A4E42", edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.35), sx: 3, sy: 6 });
  paper(ctx, () => roundRectPath(ctx, 34, 330, 22, 574, 3), { fill: "#4A4036", edge: PAL.ink, edgeW: 2.4 });
  paper(ctx, () => roundRectPath(ctx, 226, 330, 22, 574, 3), { fill: "#4A4036", edge: PAL.ink, edgeW: 2.4 });
  // a small stencilled plate
  TY.text(ctx, "YARD", 140, 356, 12, { family: "DMMono", color: C.rgba("#E8DCC4", 0.55), align: "center", letter: 3 });
  ctx.restore();
}

scene({
  id: "s20", start: 56.02, end: 58.14, line: 19, cast: "MAN / WARDER",
  draw(t, lt, dur) {
    const dawnT = syncLocal("s20", "e0"); // 0.24 — "dawn"
    const yardT = syncLocal("s20", "e3"); // 1.52 — "yard,"
    const cuffT = 0.58;                   // the near gate shuts

    setCam(
      C.kf(lt, [[0, 700], [dur, 960]]),
      C.kf(lt, [[0, 540], [dur, 535]]),
      C.kf(lt, [[0, 1.12], [dur, 0.98]]),
      C.kf(lt, [[0, 0.004], [dur, -0.004]]),
      1.0, t
    );
    beginCam(ctx);
    // the bell hangs still: no swing is passed
    yardSet(ctx, t, { bellSwing: 0, sunLift: 18 + 12 * C.clamp(lt / dur) });
    yardDoor60(ctx);

    // one day counter, on the wall and inside the frame for the whole pan. The
    // corner page used to slide in from off-frame halfway through the shot,
    // which made the countdown blink. This is the yard's own wall page; the
    // cell's page is a different wall in a different set.
    calendarProp(ctx, 1450, 620, 0.50, 10, t, 0, { oldDay: 10 });

    // the noose is a flat shadow on the bricks, LEFT of the man: 120 px clear of
    // his head, so it can never read as a halo. The standing part leaves the
    // beam shadow, one piece.
    const sway = 0.018 * Math.sin(lt * 1.4);
    nooseShadow(ctx, 1215, 300, 1215, 500, sway, 0.90, 0.45);

    // The walk. The feet are driven by the DISTANCE travelled, not by a clock,
    // so the stride cannot skate: half a cycle per 150 px of ground. The pair
    // arrives on "yard,".
    const walkK = C.ease(C.clamp((lt - 0.10) / 1.42));
    const manX = C.lerp(520, 1318, walkK);
    const wx = manX - 160;
    const dist = manX - 520;
    const ph = dist / 150 * Math.PI;
    const s = Math.sin(ph), c = Math.cos(ph);
    const stopK = C.easeOut(C.clamp((lt - 1.38) / 0.16));
    const strideK = 1 - stopK;

    // The thief: hands held out together in front, wrists bare until the warder
    // reaches them. The wrists are the SAME two points in s21, so the cut lands
    // on a cuffed pair, not on a second pose.
    const mp = { ...MAN_POSES.stand, headTilt: 0.03, headTurn: 0.10 };
    const WL = [manX - 25, 512], WR = [manX + 20, 486];
    mp.armL = solveArm(manX, 900, 1, "L", WL[0], WL[1]);
    mp.armR = solveArm(manX, 900, 1, "R", WR[0], WR[1]);
    mp.bounce = -Math.abs(s) * 5 * strideK + Math.sin(t * 5.1) * 0.9;
    mp.sway = 2;
    mp.lean = 0.06 * walkK + 0.02 * Math.sin(t * 4.4);
    // on "yard," he looks up at the beam and the loop on the wall
    mp.headTurn += -1.05 * C.ease(C.clamp((lt - yardT) / 0.30));
    mp.footL = [80 * s * strideK, -8 - 44 * Math.max(0, c) * strideK];
    mp.footR = [-80 * s * strideK, -8 - 44 * Math.max(0, -c) * strideK];
    // the hands never stop testing the steel, once it is on
    if (lt > cuffT) {
      mp.armL[1] += 0.04 * Math.sin(lt * 6.2);
      mp.armR[1] -= 0.04 * Math.sin(lt * 6.2);
    }
    man(ctx, manX, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: cuffT, f: { eyes: "wide", mouth: "o", look: [-1, 0] } },
        { t: yardT, f: { eyes: "wide", mouth: "o", look: [-1, -1] } },
        { t: yardT + 0.34, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
      ]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D8D5CC", jacket: "#2F3B4A", trouser: "#6A6E72", shoe: "#171310", hair: "#171310" },
    });

    // The warder: his right hand carries the cuffs from the frame's first
    // instant (the belt is empty — the pair came off it in the cell) and puts
    // them on. The near gate at 0.58, the far gate at 1.0.
    const reach1 = C.easeOut(C.clamp((lt - 0.30) / 0.28));
    const reach2 = C.easeOut(C.clamp((lt - 0.66) / 0.30));
    const release = C.easeOut(C.clamp((lt - 1.02) / 0.33));
    const rest = [-0.32, 0.45];
    const a1 = solveArm(wx, 900, 0.98, "R", WL[0], WL[1]);
    const a2 = solveArm(wx, 900, 0.98, "R", WR[0], WR[1]);
    let armR = [C.lerp(rest[0], a1[0], reach1), C.lerp(rest[1], a1[1], reach1)];
    armR = [C.lerp(armR[0], a2[0], reach2), C.lerp(armR[1], a2[1], reach2)];
    armR = [C.lerp(armR[0], rest[0], release), C.lerp(armR[1], rest[1], release)];
    const wp = {
      bounce: -Math.abs(s) * 4.5 * strideK + Math.sin(t * 4.5 + 1) * 0.7,
      sway: 2.5, lean: 0.06 * walkK, yaw: 0.10, headTilt: 0.02, headTurn: 1.05,
      armL: [0.10 + 0.26 * s * strideK, -0.20],
      armR,
      footL: [80 * s * strideK, -8 - 44 * Math.max(0, -c) * strideK],
      footR: [-80 * s * strideK, -8, -8 - 44 * Math.max(0, c) * strideK],
    };
    // the warder's stride is the man's, half a beat behind
    wp.footL = [80 * -s * strideK, -8 - 44 * Math.max(0, c) * strideK];
    wp.footR = [-80 * -s * strideK, -8 - 44 * Math.max(0, -c) * strideK];
    wp.bounce += 0.6;
    warder(ctx, wx, 900, 0.98, t, wp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: cuffT, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
      { t: cuffT + 0.35, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: yardT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
    ]));

    // The steel. Before 0.34 it is in his hand; from the moment his hand reaches
    // the near wrist it is drawn on the wrists themselves, so the rings never
    // float and never duplicate.
    const rh = manHand(wx, 900, 0.98, wp, "R"); rh[1] += wp.bounce || 0;
    const close1 = C.ease(C.clamp((lt - cuffT + 0.04) / 0.12));
    const close2 = C.ease(C.clamp((lt - 0.96) / 0.16));
    if (lt < 0.34) {
      handcuffs(ctx, rh[0], rh[1] + 10, 0.55, 0.18, 0);
    } else {
      const WLc = [WL[0], WL[1] + mp.bounce];
      const WRc = [WR[0], WR[1] + mp.bounce];
      handcuffChain(ctx, WLc[0], WLc[1], WRc[0], WRc[1], 0.50);
      cuffRing(ctx, WLc[0], WLc[1], 0.60, 0.10, close1);
      cuffRing(ctx, WRc[0], WRc[1], 0.60, -0.08, close2);
      // his hand again, over the ring it is closing
      const raW = wp.armR[0] + wp.armR[1];
      ctx.save(); ctx.translate(rh[0], rh[1]); ctx.rotate(raW);
      manMitten(ctx, 1, false, "#B87A4E", "#9AA0A6");
      ctx.restore();
    }

    // dawn gathers on the wall on its word
    if (lt > dawnT) {
      const k = C.clamp((lt - dawnT) / 0.7);
      ctx.save(); ctx.globalAlpha = 0.18 * k;
      spotlight(ctx, 1520, 120, 780, 30, 300, "#FFD27A", 0.8, 0.12);
      ctx.restore();
    }

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "AT DAWN", 120, 140, 100, {
      color: CREAM, edge: MUSTARD, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 49,
      perChar: (i) => C.clamp((t - 56.4 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE YARD", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE WALL AND THE BELL", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
  },
});
