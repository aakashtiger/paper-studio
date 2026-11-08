/* THE RUN — s15. Day 9, the bridge. The near cuff shuts on his wrist; the
   detective holds the far ring open in his fingers and the case file is under
   his arm. The city keeps walking behind them, indifferent. Pull out.
   Match cut: this opens on s14's end camera. */

/* The rig draws the shoe sole 8 local units below the ankle target. The shared
   poses carry -39, which leaves the figure 31 px above the floor; plant the
   feet where the floor is. */
function plantFeet(pose, liftL = 0, liftR = 0) {
  if (Array.isArray(pose.footL)) pose.footL = [pose.footL[0], -8 - liftL];
  if (Array.isArray(pose.footR)) pose.footR = [pose.footR[0], -8 - liftR];
  return pose;
}

scene({
  id: "s15", start: 39.2, end: 43.06, line: 14, cast: "MAN / DETECTIVE",
  draw(t, lt, dur) {
    const cuffT = syncLocal("s15", "e1"); // 0.48 — "closed."
    const cityT = syncLocal("s15", "e2"); // 1.58 — "city"

    // s14 ended at 880 / 545 / 1.00 / -0.005; the pull starts there.
    setCam(
      C.kf(lt, [[0, 880], [dur, 930]]),
      C.kf(lt, [[0, 545], [dur, 530]]),
      C.kf(lt, [[0, 1.00], [dur, 0.95]]),
      C.kf(lt, [[0, -0.005], [dur, -0.014]]),
      1.0, t
    );
    beginCam(ctx);
    bridgeSet(ctx, t);
    // the same barrier is still behind them: the arrest happens at the end of
    // the walk, so the gate does not vanish at the cut
    bridgeEndGate(ctx, t, { lit: 0.7 });

    // a plain bridge notice, not a named city and not a closure: he is walking
    // the bridge, so "BRIDGE CLOSED" contradicted the action.
    paper(ctx, () => roundRectPath(ctx, 1580, 238, 220, 252, 6), { fill: "#3A2E24", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
    ctx.fillStyle = "#5A4636"; ctx.fillRect(1590, 248, 200, 8);
    ctx.fillStyle = C.rgba("#8A6A4A", 0.6); ctx.fillRect(1590, 248, 200, 2);
    TY.text(ctx, "THE BRIDGE", 1690, 276, 11, { family: "DMMono", color: C.rgba(CREAM, 0.6), align: "center", letter: 2 });
    ctx.fillStyle = "#B8382A";
    ctx.beginPath(); ctx.arc(1638, 260, 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(1742, 260, 4, 0, TAU); ctx.fill();
    paper(ctx, () => tornRectPath(ctx, 1608, 300, 164, 150, 3, 17), { fill: "#E8DCC4", edge: C.rgba(PAL.ink, 0.55), edgeW: 2 });
    TY.text(ctx, "CROSS WITH CARE", 1690, 330, 11, { family: "Archivo Black", color: "#8E2430", align: "center", letter: 1 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(1626, 350 + i * 16); ctx.lineTo(1754, 350 + i * 16); ctx.stroke(); }
    ctx.fillStyle = "#B8382A"; ctx.beginPath(); ctx.arc(1690, 300, 4, 0, TAU); ctx.fill();

    // The city goes on behind them: three walkers cross the far end of the
    // pavement with their backs to us. No face, and no coat from the cast —
    // the crowd is weather. They must be seen to walk: boots under the hem,
    // an arm that swings, and 400 px of travel across the shot.
    const walkPhi = lt * 7.2;
    const cross = C.ease(C.clamp(lt / dur));
    queueBack(ctx, 760 - 470 * cross, 826, 0.50, "#20262C", "#241E18", "fedora", t, 0, Math.sin(walkPhi));
    queueBack(ctx, 700 - 470 * cross, 818, 0.46, "#26241E", "#2E251C", "cap", t, 1, Math.sin(walkPhi + 2.1));
    queueBack(ctx, 830 - 450 * cross, 832, 0.54, "#1C2226", "#2A221A", "fedora", t, 2, Math.sin(walkPhi + 4.2));
    // a warm light sliding along the river
    const lx = 1900 - 760 * C.ease(C.clamp((lt - 0.3) / dur));
    ctx.fillStyle = C.rgba("#FFD27A", 0.55); ctx.beginPath(); ctx.ellipse(lx, 634, 24, 5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C.rgba("#FFD27A", 0.12); ctx.beginPath(); ctx.ellipse(lx - 44, 634, 96, 6, 0, 0, TAU); ctx.fill();

    // The file is clamped under the detective's RIGHT arm, drawn BEFORE him, so
    // his sleeve covers the near half and the cover + corner still read. The
    // left arm is busy with the steel, so it cannot also carry the file.
    caseFile(ctx, 1240, 468, 0.80, 0.10, t);

    // The thief holds both wrists out together in front of his chest, palms in.
    // The wrists are SOLVED positions, not hand-tuned angles: the cuffs are
    // drawn at the same two points the rig paints the hands at.
    const WR = [992, 500], WL = [890, 524];
    const thiefArmR = solveArm(880, 900, 1, "R", WR[0], WR[1]);
    const thiefArmL = solveArm(880, 900, 1, "L", WL[0], WL[1]);
    const present = {
      ...MAN_POSES.stand, armR: thiefArmR, armL: thiefArmL,
      yaw: 0.12, headTurn: 0.95, headTilt: 0.03, lean: 0.0,
    };
    // lean stays at zero while the steel is on: lean swings the shoulder, and
    // a swinging shoulder would walk the wrist out of the cuff. The sag is
    // carried by bounce, knees and head, which do not move the shoulder.
    const mp = poseAt(lt, [
      [0, present],
      [cuffT - 0.06, present],
      [cuffT + 0.22, { ...present, headTurn: 0.82, headTilt: -0.05 }],
      [cuffT + 0.80, { ...present, headTurn: 0.90 }],
      [cuffT + 1.30, { ...present, headTurn: 0.78, headTilt: 0.08 }],
      [cuffT + 1.70, { ...present, headTurn: 0.86, headTilt: 0.02 }],
      [dur, { ...present, headTurn: 0.92 }],
    ]);
    const flinch = Math.exp(-Math.pow((lt - cuffT) / 0.10, 2));
    const sag = Math.exp(-Math.pow((lt - cuffT - 0.85) / 0.55, 2));
    mp.bounce = Math.sin(t * 6.2) * 1.2 - flinch * 4 - sag * 7;
    mp.bounce += 2 * C.clamp((lt - 1.9) / 1.5); // he straightens at the end
    plantFeet(mp);
    man(ctx, 880, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: cuffT - 0.05, f: { eyes: "wide", mouth: "o", look: [1, 0] } },
        { t: cuffT + 0.30, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        { t: cuffT + 1.16, f: { eyes: "closed", mouth: "flat", look: [1, 1] } },
        { t: cuffT + 1.28, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
        // the second gate: the flinch again, smaller
        { t: 0.90, f: { eyes: "wide", mouth: "flat", look: [0, 1] } },
        { t: 1.14, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
        { t: dur, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
      ]),
      costume: "fugitive", stubble: true, role: "thief", hat: null,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });

    // The detective stands square to him and his LEFT hand takes the chain at
    // its midpoint. The hand is solved onto that point, so the steel is held
    // by a body: one palm on the chain, one ring on each wrist.
    const detX = 1120;
    const CHAIN = [941, 512];
    const detArmL = solveArm(detX, 900, 1, "L", CHAIN[0], CHAIN[1]);
    const dp = {
      bounce: Math.sin(t * 5.4 + 1) * 0.8, sway: 1, lean: 0, yaw: -0.12,
      headTilt: 0.02, headTurn: -0.72,
      armL: detArmL, armR: [-0.32, 0.45],
      footL: [-34, -8], footR: [34, -8],
    };

    // the detective himself: eyes open and level on the steel, widening on both
    // gates. No closed-eye pose: a blink read as a man asleep at the hinge.
    detective(ctx, detX, 900, 1.0, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: cuffT - 0.04, f: { eyes: "wide", mouth: "flat", look: [-1, 1] } },
      { t: cuffT + 0.26, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: 0.94, f: { eyes: "wide", mouth: "flat", look: [-1, 1] } },
      { t: 1.16, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: dur, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]));

    // The steel. Both rings are ON the thief's wrists the whole shot; the gates
    // swing shut — the near one on "closed." (0.48), the far one by 1.9 — and
    // the chain runs between them under the detective's palm.
    const cuffDY = mp.bounce;
    const WRc = [WR[0], WR[1] + cuffDY];
    const WLc = [WL[0], WL[1] + cuffDY];
    const close1 = C.ease(C.clamp((lt - cuffT + 0.05) / 0.14));
    const close2 = C.ease(C.clamp((lt - 0.74) / 0.20));
    handcuffChain(ctx, WRc[0], WRc[1], WLc[0], WLc[1], 0.62);
    cuffRing(ctx, WRc[0], WRc[1], 0.82, 0.12, close1);
    cuffRing(ctx, WLc[0], WLc[1], 0.82, -0.10, close2);

    // the detective's palm again, over the chain: the sleeve was drawn behind
    // his coat, but the hand that holds the steel must be in front of it
    const dh = manHand(detX, 900, 1.0, dp, "L"); dh[1] += dp.bounce || 0;
    const da = dp.armL[0] + dp.armL[1];
    ctx.save(); ctx.translate(dh[0], dh[1]); ctx.rotate(da);
    manMitten(ctx, -1, false, "#C98A5A", "#27313E");
    ctx.restore();

    // a gate snapping shut: eight short rays at the ring, gone in a third of a
    // second, one per close
    for (const [ring, k] of [[WRc, cuffT], [WLc, 1.86]]) {
      const a = C.clamp((lt - k) / 0.06) * (1 - C.clamp((lt - k - 0.10) / 0.24));
      if (a <= 0) continue;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const ang = i / 8 * TAU;
        ctx.beginPath();
        ctx.moveTo(ring[0] + Math.cos(ang) * 26, ring[1] + Math.sin(ang) * 26);
        ctx.lineTo(ring[0] + Math.cos(ang) * 44, ring[1] + Math.sin(ang) * 44);
        ctx.stroke();
      }
      ctx.restore();
    }

    // the grey flat cap from s14, held at the detective's right side: the same
    // flatCapProp the rig draws, so it is the cap the thief wore, not a second
    // hat. One cap size everywhere.
    const capX = detX + 96, capY = 606;
    flatCapProp(ctx, capX, capY, 0.85, 0.10, { color: "#6E6A62" });
    ctx.save(); ctx.translate(capX + 2, capY - 26); ctx.rotate(-0.35); ctx.scale(0.82, 0.82);
    paper(ctx, () => roundRectPath(ctx, -5, -2, 10, 22, 5), { fill: "#C98A5A", edge: C.rgba(INK, 0.55), edgeW: 1.3 });
    ctx.restore();

    // the city takes the light back on its word
    if (lt > cityT) {
      ctx.save();
      ctx.globalAlpha = 0.10 * C.clamp((lt - cityT) / 0.6);
      spotlight(ctx, 1690, -80, 980, 26, 320, "#DFF0FF", 0.8, -0.12);
      ctx.restore();
    }

    // foreground rail
    ctx.fillStyle = "#2A2A32"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#4A4A54"; ctx.fillRect(0, 980, W, 12);
    ctx.strokeStyle = "#14141A"; ctx.lineWidth = 8;
    for (let x = 40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 980); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.strokeStyle = "#8A8A94"; ctx.lineWidth = 3;
    for (let x = 40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 1006); ctx.quadraticCurveTo(x + 60, 1042, x + 120, 1006); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#FFD27A", 0.14); ctx.fillRect(0, 980, W, 5);

    rainStreaks(ctx, t, 44, "#D8E8F8", 0.22, 1.4);

    // the corner page still reads nine, as it has since the checkpoint
    ctx.save();
    ctx.translate(150, 878); ctx.rotate(-0.05);
    paper(ctx, () => roundRectPath(ctx, -64, -94, 128, 188, 5), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-64, -94, 128, 28);
    TY.text(ctx, "THE RUN", 0, -74, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 1 });
    TY.text(ctx, "9", 0, 40, 78, { family: "Archivo Black", color: PAL.ink, align: "center" });
    TY.text(ctx, "DAY", 0, 72, 13, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 4 });
    ctx.restore();

    // type is screen space, never in the camera
    endCam(ctx);

    // a soft dark bed, so the type survives the moon behind it
    const tg = ctx.createLinearGradient(80, 60, 900, 260);
    tg.addColorStop(0, C.rgba("#0E1418", 0.34));
    tg.addColorStop(1, C.rgba("#0E1418", 0));
    ctx.fillStyle = tg; ctx.fillRect(80, 60, 840, 210);

    TY.type(ctx, "THE CUFFS", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 31,
      perChar: (i) => C.clamp((t - 39.4 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE BRIDGE", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CITY GOES ON", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "CASE 044", 1600, 760, 24, { fill: MUSTARD, text: INK, seed: 12, rot: 0.04, time: t });
  },
});
