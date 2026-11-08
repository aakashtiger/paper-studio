/* THE RUN — s11. Day 8, the checkpoint.

   Match cut from s10: the camera starts exactly where s10 ended and the man
   stays at the same world position, so nothing jumps across the cut. The lamp
   finds his face on "face."; the detective looks up from the open file at the
   man's hat. Push in. */

scene({
  id: "s11", start: 28.72, end: 30.9, line: 10, cast: "MAN / DETECTIVE",
  draw(t, lt, dur) {
    const lampT = syncLocal("s11", "e0");  // 0.68 — "lamp"
    const foundT = syncLocal("s11", "e1"); // 0.90 — "found"
    const faceT = syncLocal("s11", "e2");  // 1.44 — "face."

    const lit = C.ease(C.clamp((lt - lampT) / 0.55));
    // same swing as s10, so the hanging shade does not jump across the cut
    const swing = 0.055 * Math.sin(t * 1.75) + 0.02 * Math.sin(t * 3.1);

    // s10 ended at (1080, 530, 1.04, -0.008). Start there.
    setCam(
      C.kf(lt, [[0, 1080], [dur, 1010]]),
      C.kf(lt, [[0, 530], [dur, 515]]),
      C.kf(lt, [[0, 1.04], [dur, 1.08]]),
      C.kf(lt, [[0, -0.008], [dur, 0.004]]),
      1.0, t
    );
    ctx.fillStyle = "#141C24"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    checkpointSet(ctx, t, { lampSwing: swing });

    // the queue from s10 stays in frame: same three backs, no faces
    queueBack(ctx, 300, 900, 0.92, "#22282E", "#3A2E22", "fedora", t, 0);
    queueBack(ctx, 440, 900, 0.90, "#2A2A24", "#241F1A", "cap", t, 1);
    queueBack(ctx, 580, 900, 0.88, "#1E242E", "#2E251C", "fedora", t, 2);

    // the right side of the frame falls back, so the lamp has one subject
    const veil = ctx.createLinearGradient(1060, 0, 1780, 0);
    veil.addColorStop(0, C.rgba("#0E1218", 0));
    veil.addColorStop(1, C.rgba("#0E1218", 0.34));
    ctx.fillStyle = veil; ctx.fillRect(1060, 0, 860, H);

    // the lamp beam, tightening on him
    ctx.save();
    ctx.globalAlpha = 0.10 + 0.16 * lit;
    spotlight(ctx, 840, 350, 640, 48, 300, "#FFE2A0", 0.8, -0.20 + swing * 0.8);
    ctx.restore();

    // the man: s10 ended with the right hand at the collar and the bag in the
    // left. The lamp hits: the right hand comes off the collar onto the chest
    // — close to the body, which reads as caught, never as a wave (the old
    // raised open hand did). At "face." it drops, and the bag is let go.
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: -0.04, headTurn: 0.55, yaw: 0.22, armL: [0.28, -0.36], armR: [-0.05, 2.40] }],
      [lampT - 0.10, { ...MAN_POSES.stand, headTilt: -0.03, headTurn: 0.62, yaw: 0.20, armL: [0.28, -0.36], armR: [-0.05, 2.40] }],
      [lampT + 0.14, { ...MAN_POSES.stand, headTilt: -0.12, headTurn: 1.05, yaw: 0.14, lean: -0.05, armL: [0.28, -0.36], armR: [-0.15, 2.30] }],
      [foundT + 0.30, { ...MAN_POSES.stand, headTilt: -0.10, headTurn: 1.18, yaw: 0.14, lean: -0.04, armL: [0.28, -0.36], armR: [-0.15, 2.30] }],
      [faceT + 0.10, { ...MAN_POSES.stand, headTilt: -0.01, headTurn: 1.22, yaw: 0.12, armL: [0.26, -0.30], armR: [0.34, -0.60] }],
      [dur, { ...MAN_POSES.stand, headTilt: -0.02, headTurn: 1.22, yaw: 0.12, armL: [0.24, -0.28], armR: [0.28, -0.42] }],
    ]);
    mp.bounce += Math.sin(t * 4.2) * 0.9;
    mp.sway = 1.0;
    // a held body is not a dead one: a slow tremor under the lamp
    mp.armL[0] += 0.03 * Math.sin(t * 7.0);
    // The bag is in his left hand until "face."; then he lets go of it and it
    // stays on the wet ground into s12. The loot does not evaporate at a cut.
    const bagHand = armHandAt(700, 900, 1.0, mp, "L");
    const releaseK = C.clamp((lt - faceT - 0.10) / 0.26);
    const dropY = C.lerp(bagHand[1] + 102, 884, C.ease(releaseK));
    const bagBounce = releaseK >= 1 ? Math.abs(Math.sin((lt - faceT) * 13)) * Math.exp(-(lt - faceT) * 6) * 7 : 0;
    if (releaseK > 0) shadowEllipse(ctx, bagHand[0] - 4, 892, 46, 8, 0.26 * releaseK);
    bagProp(ctx, bagHand[0] - 4, dropY - bagBounce, 0.78, -0.02 + 0.10 * releaseK);
    man(ctx, 700, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: lampT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: foundT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: faceT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      ]),
      role: "thief", costume: "coat",
    });
    // his collar, up
    const cx = 700 + 250 * Math.sin(mp.lean);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * 23, 452);
      ctx.lineTo(cx + sx * 64, 444);
      ctx.lineTo(cx + sx * 38, 376);
      ctx.closePath();
      ctx.fillStyle = C.shade("#6B5A3E", -10); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 1.6; ctx.stroke();
    }

    // the light lands on his face on "face."
    if (lit > 0) {
      const g = ctx.createRadialGradient(700, 300, 8, 700, 300, 190);
      g.addColorStop(0, C.rgba("#FFF2C8", 0.46 * lit));
      g.addColorStop(0.55, C.rgba("#FFE2A0", 0.14 * lit));
      g.addColorStop(1, C.rgba("#FFE2A0", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(700, 300, 190, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFE2A0", 0.12 * lit);
      ctx.beginPath(); ctx.ellipse(700, 902, 150, 20, 0, 0, TAU); ctx.fill();
    }

    // the detective: s10 ended reading the file (headTurn -0.30); on "found"
    // his head comes round to the man — a real turn, 1.35 rad of head, not the
    // 4 degrees the old -0.52 gave — and their eyes meet across the barrier.
    const dp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: 0.03, headTurn: -0.30, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
      [foundT - 0.12, { ...MAN_POSES.stand, headTilt: 0.03, headTurn: -0.34, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
      [foundT + 0.24, { ...MAN_POSES.stand, headTilt: -0.06, headTurn: -1.30, yaw: -0.14, armL: [0.52, 0.80], armR: [-0.20, 0.25] }],
      [dur, { ...MAN_POSES.stand, headTilt: -0.07, headTurn: -1.35, yaw: -0.14, armL: [0.52, 0.80], armR: [-0.20, 0.25] }],
    ]);
    dp.bounce += Math.sin(t * 3.6) * 0.9;
    detective(ctx, 1380, 900, 1.0, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: foundT + 0.18, f: { eyes: "wide", mouth: "flat", look: [-1, -1] } },
      { t: faceT, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
    ]));
    const dh = armHandAt(1380, 900, 1.0, dp, "L");
    caseFile(ctx, dh[0], dh[1] - 20, 0.60, -0.08, t, { open: true });
    ctx.save(); ctx.translate(dh[0], dh[1] - 4); ctx.rotate(-0.5);
    hand(ctx, -1, false, "#C98A5A");
    ctx.restore();

    endCam(ctx);

    TY.type(ctx, "THE LAMP", 120, 140, 92, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 34,
      perChar: (i) => C.clamp((t - 28.9 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE CHECKPOINT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "HIS EYES DID NOT MOVE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "FOUND", 1640, 250, 27, { fill: MUSTARD, text: INK, seed: 34, rot: 0.04, time: t });
  },
});
