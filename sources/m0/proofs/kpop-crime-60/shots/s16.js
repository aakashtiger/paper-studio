/* THE RUN — s16. Day 10, the cell. The door opens on "cell,"; the warder
   unlocks the cuffs from the man's wrists and hooks them on his belt; the
   court jacket and the case file wait on the bench, and the calendar is
   already at ten. The whole room is behind the foreground bars. Push in. */

/* A court jacket, folded once: the dark navy stack the film carries from the
   cell to the court and back. (x,y) is the bottom centre on the bench. */
function foldedCourtJacket(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, -86, -64, 172, 64, 8), { fill: "#2F3B4A", edge: PAL.ink, edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
  paper(ctx, () => { ctx.beginPath(); ctx.moveTo(-86, -64); ctx.lineTo(-40, -72); ctx.lineTo(0, -60); ctx.lineTo(40, -72); ctx.lineTo(86, -64); ctx.lineTo(78, -36); ctx.lineTo(-78, -36); ctx.closePath(); }, { fill: "#3A4A5C", edge: C.rgba(PAL.ink, 0.6), edgeW: 1.6 });
  // The collar is navy, not a white paper wedge: the folded jacket must read
  // as a jacket on the bench, not as the CASE 044 file left in the cell.
  ctx.fillStyle = "#3A4A5C";
  ctx.beginPath(); ctx.moveTo(-26, -68); ctx.lineTo(0, -50); ctx.lineTo(26, -68); ctx.lineTo(14, -74); ctx.lineTo(0, -64); ctx.lineTo(-14, -74); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = C.rgba("#D9D2C3", 0.55); ctx.lineWidth = 1.2; ctx.stroke();
  // the same red tie the accused wears in court
  ctx.fillStyle = "#8E2430";
  ctx.beginPath(); ctx.moveTo(-6, -66); ctx.lineTo(6, -66); ctx.lineTo(4, -50); ctx.lineTo(-4, -50); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#26323E"; ctx.lineWidth = 12; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-64, -50); ctx.lineTo(58, -26); ctx.stroke();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.45); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-64, -50); ctx.lineTo(58, -26); ctx.stroke();
  ctx.fillStyle = PAL.gold;
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(-8 + i * 16, -42, 3, 0, TAU); ctx.fill(); }
  // the hem, two lapel creases and a second sleeve fold: a folded garment,
  // not a navy rectangle with a yellow label
  ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-78, -20); ctx.lineTo(78, -20); ctx.stroke();
  ctx.strokeStyle = C.rgba("#D9D2C3", 0.30); ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-42, -58); ctx.lineTo(-26, -36); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(42, -58); ctx.lineTo(26, -36); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-54, -10); ctx.lineTo(38, -38); ctx.stroke();
  ctx.restore();
}

scene({
  id: "s16", start: 43.06, end: 45.18, line: 15, cast: "MAN / WARDER",
  draw(t, lt, dur) {
    const tenT = syncLocal("s16", "e1");    // 0.28 — "ten."
    const cellT = syncLocal("s16", "e2");   // 0.98 — "cell,"
    // the unlock is staged early, so the belt cuffs are already hooked by 44.2
    const unlockT = 0.42;   // his hand reaches the near cuff
    const hookT = 0.92;     // the cuffs are on the belt strap
    const takeT = 1.28;     // the man lifts the court jacket off the bench
    const wearT = 1.86;     // the folded jacket is in both hands

    setCam(
      C.kf(lt, [[0, 960], [dur, 980]]),
      C.kf(lt, [[0, 540], [dur, 530]]),
      C.kf(lt, [[0, 1.00], [dur, 1.06]]),
      C.kf(lt, [[0, -0.004], [dur, 0.004]]),
      1.0, t
    );
    beginCam(ctx);
    cellSet(ctx, t);

    // the calendar on the wall, still the last page; the wall bars sit over it
    const pop = 1 + 0.035 * Math.exp(-Math.pow((lt - tenT) / 0.18, 2));
    calendarProp(ctx, 560, 260, 0.95 * pop, 10, t, 0, { oldDay: 10 });
    ctx.save();
    ctx.beginPath(); ctx.rect(490, 158, 140, 202); ctx.clip();
    cellBars(ctx);
    ctx.restore();
    // a warm ring on the page when the word says ten
    ctx.save();
    ctx.globalAlpha = 0.30 * (1 - C.clamp((lt - tenT - 0.1) / 0.6));
    ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(560, 260, 72 + 40 * C.clamp((lt - tenT) / 0.6), 0, TAU); ctx.stroke();
    ctx.restore();

    // the case file sits in the gap between the two men, cover readable; the
    // folded court jacket waits on the right of the bench for the man at the end
    caseFile(ctx, 880, 718, 0.62, -0.08, t);

    // the cell door opens on "cell," and spills the corridor light in
    const doorK = C.easeOut(C.clamp((lt - cellT) / 0.55));
    if (doorK > 0.01) {
      const light = ctx.createLinearGradient(1560, 0, 1920, 0);
      light.addColorStop(0, C.rgba("#FFD27A", 0.55 * doorK));
      light.addColorStop(1, C.rgba("#FFD27A", 0));
      ctx.fillStyle = light;
      ctx.beginPath(); ctx.moveTo(1560, 120); ctx.lineTo(1860, 120); ctx.lineTo(1920, 900); ctx.lineTo(1560, 900); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 18; i++) {
        const x = 1580 + C.hash(i * 3.1) * 320 + Math.sin(t * 1.3 + i) * 8;
        const y = 180 + C.hash(i * 7.7) * 680 - C.frac(t * 0.1 + C.hash(i * 5.3)) * 80;
        ctx.fillStyle = C.rgba("#FFE2A0", 0.35 * doorK);
        ctx.beginPath(); ctx.arc(x, y, 1.5 + C.hash(i * 9.1) * 2, 0, TAU); ctx.fill();
      }
    }
    ctx.save();
    ctx.translate(1860, 0);
    ctx.transform(1 - 0.62 * doorK, 0, -0.22 * doorK, 1, 0, 0);
    ctx.translate(-1860, 0);
    ctx.fillStyle = "#2A2E34"; ctx.fillRect(1580, 120, 280, 780);
    ctx.strokeStyle = "#6A7078"; ctx.lineWidth = 11; ctx.lineCap = "round";
    for (let x = 1600; x <= 1840; x += 60) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke(); }
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(1580, 400); ctx.lineTo(1860, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1580, 680); ctx.lineTo(1860, 680); ctx.stroke();
    ctx.strokeStyle = C.rgba("#9AA0A8", 0.5); ctx.lineWidth = 2;
    for (let x = 1597; x <= 1837; x += 60) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 890); ctx.stroke(); }
    ctx.restore();

    // the man holds both wrists out; after the early unlock he lowers them,
    // works the stiffness out, then takes the folded court jacket in both hands
    const present = { ...MAN_POSES.stand, armL: [-0.35, 0.55], armR: [0.35, -0.55], headTilt: 0.04, headTurn: 0.02 };
    const relax = { ...MAN_POSES.stand, armL: [0.14, -0.34], armR: [-0.14, 0.34], headTilt: 0.02, headTurn: 0.06 };
    const carry = { ...MAN_POSES.stand, armL: [-0.30, -0.32], armR: [0.50, -0.86], headTilt: 0.04, headTurn: -0.04 };
    const mp = poseAt(lt, [
      [0, present],
      [unlockT + 0.04, present],
      [unlockT + 0.40, relax],
      [takeT - 0.15, relax],
      [wearT, carry],
      [dur, carry],
    ]);
    mp.bounce = Math.sin(t * 5.7) * 1.1;
    mp.sway = 1.2;
    // waiting for the key: the head turns to the door and back
    mp.headTurn += 0.06 * Math.sin(t * 4.0);
    mp.lean += 0.03 * Math.sin(t * 5.3);
    // the right wrist flexes once the steel is off, until the jacket arrives
    if (lt > unlockT + 0.28 && lt < takeT) {
      const rubK = C.clamp((lt - unlockT - 0.28) / 0.55);
      const rub = Math.sin(lt * 10.5) * 0.10 * rubK;
      mp.armR[1] -= rub;
    }
    plantFeet(mp);
    man(ctx, 760, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
        { t: unlockT - 0.08, f: { eyes: "wide", mouth: "o", look: [0, 0] } },
        { t: unlockT + 0.35, f: { eyes: "closed", mouth: "flat", look: [0, 0] } },
        { t: takeT, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
        { t: dur, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
      ]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D8D5CC", jacket: "#2F3B4A", trouser: "#6A6E72", shoe: "#171310", hair: "#171310" },
    });

    // the folded court jacket: on the bench right of the warder, then lifted
    // into both of the man's hands at the end, so the court layer is a visible
    // hand-off and not an off-screen costume change. The shirt stays prison white.
    const takeK = C.easeOut(C.clamp((lt - takeT) / (wearT - takeT)));
    const jx = C.lerp(1170, 760, takeK);
    const jy = C.lerp(758, 600, takeK) - Math.sin(takeK * Math.PI) * 34;
    if (takeK < 0.18) {
      ctx.save();
      ctx.fillStyle = C.rgba(PAL.ink, 0.18);
      ctx.beginPath(); ctx.ellipse(jx, jy + 4, 80, 9, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    foldedCourtJacket(ctx, jx, jy, C.lerp(0.90, 0.92, takeK), C.lerp(-0.03, 0.02, takeK));
    // the man's own mittens over the fold, so the hands are on arms, not blobs
    if (takeK > 0.45) {
      const handK = C.clamp((takeK - 0.45) / 0.35);
      const lw = manHand(760, 900, 1.0, mp, "L"); lw[1] += mp.bounce || 0;
      const rw = manHand(760, 900, 1.0, mp, "R"); rw[1] += mp.bounce || 0;
      const la = mp.armL[0] + mp.armL[1];
      const rb = mp.armR[0] + mp.armR[1];
      ctx.save(); ctx.globalAlpha = handK;
      ctx.save(); ctx.translate(lw[0], lw[1]); ctx.rotate(la);
      manMitten(ctx, -1, false, "#B87A4E", "#BEB9B0");
      ctx.restore();
      ctx.save(); ctx.translate(rw[0], rw[1]); ctx.rotate(rb);
      manMitten(ctx, 1, false, "#C98A5A", "#DCD9D0");
      ctx.restore();
      ctx.restore();
    }
    // the warder leans in early, then stands back with the cuffs on his belt
    // strap; his own bent left arm, light grey uniform and all
    const wp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, armL: [0.38, -0.60], armR: [-0.16, 0.30], lean: 0.03, headTurn: -0.12 }],
      [unlockT - 0.15, { ...MAN_POSES.stand, armL: [0.55, -0.10], armR: [-0.16, 0.30], lean: 0.05, headTurn: -0.16 }],
      [unlockT + 0.16, { ...MAN_POSES.stand, armL: [0.55, -0.10], armR: [-0.16, 0.30], lean: 0.05, headTurn: -0.16 }],
      [hookT - 0.05, { ...MAN_POSES.stand, armL: [-0.10, 0.02], armR: [-0.16, 0.30], lean: 0.01, headTurn: -0.02 }],
      [1.10, { ...MAN_POSES.stand, armL: [-0.25, 0.05], armR: [-0.16, 0.30], lean: 0.0, headTurn: 0.02 }],
      [dur, { ...MAN_POSES.stand, armL: [-0.25, 0.05], armR: [-0.16, 0.30], lean: 0.0, headTurn: 0.04 }],
    ]);
    wp.bounce = Math.sin(t * 4.6 + 1) * 1.0;
    plantFeet(wp);
    warder(ctx, 1000, 900, 1.0, t, wp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: unlockT, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: unlockT + 0.45, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: takeT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
    ]));
    const wh = manHand(1000, 900, 1.0, wp, "L"); wh[1] += wp.bounce || 0;

    // the key, between his fingers and the near cuff, gone once the cuffs hang
    const keyK = 1 - C.clamp((lt - unlockT - 0.10) / 0.24);
    if (keyK > 0) {
      ctx.save();
      ctx.globalAlpha = keyK;
      ctx.translate(wh[0], wh[1] - 2); ctx.rotate(0.75);
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -5, 8, 0, TAU); ctx.stroke();
      ctx.fillStyle = PAL.gold; ctx.fillRect(2, 18, 8, 4);
      ctx.restore();
    }

    // the cuffs: on both wrists, lifted in the warder's hand, hooked on a belt
    // loop. They never travel without the hand.
    const mhL = manHand(760, 900, 1.0, mp, "L"); mhL[1] += mp.bounce || 0;
    const mhR = manHand(760, 900, 1.0, mp, "R"); mhR[1] += mp.bounce || 0;
    if (lt < unlockT + 0.08) {
      handcuffsPair(ctx, mhL[0], mhL[1] + 2, mhR[0], mhR[1] + 2, 0.82, 1);
    } else {
      const hook = C.easeOut(C.clamp((lt - unlockT - 0.04) / 0.40));
      const cx = C.lerp(wh[0], 952, hook);
      const cy = C.lerp(wh[1] + 8, 622, hook) - Math.sin(hook * Math.PI) * 18;
      // the belt strap is revealed as the cuffs settle onto it
      if (hook > 0.72) {
        ctx.save();
        ctx.globalAlpha = C.clamp((hook - 0.72) / 0.28);
        ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(958, 600); ctx.lineTo(958, 614); ctx.stroke();
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(958, 604, 4, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = C.clamp((lt - unlockT - 0.04) / 0.08);
      handcuffs(ctx, cx, cy, C.lerp(0.72, 0.56, hook), 0.16, 1);
      ctx.restore();
    }

    // THE FOREGROUND BARS: after the cast, bench and props, before the title,
    // so every figure in the cell stands behind the grille.
    cellBarsFront(ctx);

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "THE CELL", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 41,
      perChar: (i) => C.clamp((t - 43.5 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE CELL · THE CUFFS", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE LAST PAGE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "THE WARDER", 1655, 1024, 18, { fill: INK, text: CREAM, edge: null, seed: 63, rot: -0.02, time: t });
  },
});
