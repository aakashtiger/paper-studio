/* THE RUN — s12. Day 8, the checkpoint.

   Match cut from s11: same camera, same man, same pose at the cut. He turns his
   collar up, lifts the grey flat cap off his head with his right hand, bends to
   set it on the boom barrier as he walks past, and keeps walking. The cap never
   falls: it stays in the hand until the hand puts it down, then it stays on the
   barrier while the detective's eyes follow it. Track right. */

scene({
  id: "s12", start: 30.9, end: 34.6, line: 11, cast: "MAN / DETECTIVE",
  draw(t, lt, dur) {
    const turnedT = syncLocal("s12", "e0");  // 0.22 — "turned"
    const collarT = syncLocal("s12", "e1");  // 0.66 — "collar"
    const upT = syncLocal("s12", "e2");      // 0.88 — "up"
    const walkedT = syncLocal("s12", "e3");  // 1.62 — "walked"
    const throughT = syncLocal("s12", "e4"); // 1.78 — "through"
    const lightT = syncLocal("s12", "e5");   // 2.26 — "light"
    const stoppingT = syncLocal("s12", "e7");// 2.84 — "stopping."

    const WALK_START = 0.98;
    const TAKE_T = 1.22;
    const RELEASE_T = 2.20;
    const walkAt = (l) => {
      const u = C.clamp((l - WALK_START) / (3.42 - WALK_START));
      return 700 + 470 * (0.72 * u + 0.28 * C.ease(u));
    };
    const camAt = (l) => {
      const u = C.clamp((l - WALK_START) / (dur - WALK_START));
      return 1010 + 190 * (0.72 * u + 0.28 * C.ease(u));
    };

    const x = walkAt(lt);
    const camX = camAt(lt);
    const walkK = C.ease(C.clamp((lt - WALK_START) / 0.26));
    const phase = lt * TAU * 1.55;
    const stride = Math.sin(phase) * walkK;
    const liftL = Math.max(0, -stride), liftR = Math.max(0, stride);

    // The bend that sets the cap down. 0.66 rad puts the right hand on the
    // barrier top; the cap rides the hand the whole way.
    const bendK = C.kf(lt, [
      [1.95, 0.05], [RELEASE_T, 0.69], [2.36, 0.69], [2.70, 0.06],
    ]);

    // s11 ended at (1010, 515, 1.08, 0.004). Start there.
    setCam(
      camX,
      C.kf(lt, [[0, 515], [dur, 522]]),
      C.kf(lt, [[0, 1.08], [dur, 1.06]]),
      C.kf(lt, [[0, 0.004], [dur, -0.004]]),
      1.1, t
    );
    ctx.fillStyle = "#141C24"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    checkpointSet(ctx, t, { lampSwing: 0.055 * Math.sin(t * 1.75) + 0.02 * Math.sin(t * 3.1) });

    // the bag he let go of in s11, still on the wet ground by the barrier.
    // It stays here: the loot is left behind, and it does not evaporate at a cut.
    // Drawn AFTER the queue, exactly as s11 draws it: the queue is further back,
    // and drawing it over the bag hid the one object the film is about.

    // the queue from s10/s11 stays in frame; it slides out left as we track
    queueBack(ctx, 300, 900, 0.92, "#22282E", "#3A2E22", "fedora", t, 0);
    queueBack(ctx, 440, 900, 0.90, "#2A2A24", "#241F1A", "cap", t, 1);
    queueBack(ctx, 580, 900, 0.88, "#1E242E", "#2E251C", "fedora", t, 2);

    shadowEllipse(ctx, 595, 892, 46, 8, 0.28);
    bagProp(ctx, 595, 884, 0.78, 0.10);

    // the lamp beam over the crossing point
    ctx.save();
    ctx.globalAlpha = 0.18;
    spotlight(ctx, 840, 350, 620, 50, 320, "#FFE2A0", 0.7, -0.06);
    ctx.restore();

    // The pose: starts exactly where s11 ended (headTilt -0.02, headTurn 0.12,
    // yaw 0.12, lean -0.02, armL [0.28,-0.36], armR [-0.24,0.20]).
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: -0.02, headTurn: 0.12, yaw: 0.12, lean: -0.02, armL: [0.28, -0.36], armR: [-0.24, 0.20] }],
      [turnedT + 0.10, { ...MAN_POSES.stand, headTilt: 0.01, headTurn: 0.02, yaw: 0.10, lean: 0.02, armL: [0.26, -0.30], armR: [-0.24, 0.20] }],
      [collarT, { ...MAN_POSES.stand, headTilt: 0.06, headTurn: -0.04, yaw: 0.08, lean: 0.04, armL: [0.30, -0.34], armR: [-0.05, 2.40] }],
      [upT + 0.04, { ...MAN_POSES.stand, headTilt: 0.07, headTurn: -0.06, yaw: 0.08, lean: 0.05, armL: [0.32, -0.38], armR: [-0.05, 2.40] }],
      [TAKE_T, { ...MAN_POSES.stand, headTilt: 0.02, headTurn: 0.08, yaw: 0.12, lean: 0.05, armL: [0.30, -0.40], armR: [-3.14, 0.06] }],
      [1.45, { ...MAN_POSES.stand, headTilt: 0.05, headTurn: 0.10, yaw: 0.12, lean: 0.06, armL: [0.30, -0.40], armR: [-1.15, 0.55] }],
      [1.78, { ...MAN_POSES.stand, headTilt: 0.03, headTurn: 0.10, yaw: 0.12, lean: 0.05, armL: [0.28, -0.34], armR: [-0.60, 0.30] }],
      [2.05, { ...MAN_POSES.stand, headTilt: 0.12, headTurn: 0.10, yaw: 0.12, lean: 0.34, armL: [0.26, -0.30], armR: [-0.95, 0.35] }],
      [RELEASE_T, { ...MAN_POSES.stand, headTilt: 0.14, headTurn: 0.08, yaw: 0.12, lean: 0.69, armL: [0.22, -0.24], armR: [-0.45, 0.25] }],
      [2.52, { ...MAN_POSES.stand, headTilt: 0.08, headTurn: 0.04, yaw: 0.12, lean: 0.40, armL: [0.24, -0.26], armR: [-0.30, 0.24] }],
      [2.85, { ...MAN_POSES.stand, headTilt: 0.03, headTurn: 0.06, yaw: 0.12, lean: 0.08, armL: [0.26, -0.32], armR: [-0.26, 0.22] }],
      [dur, { ...MAN_POSES.stand, headTilt: 0.02, headTurn: 0.08, yaw: 0.12, lean: 0.07, armL: [0.28, -0.34], armR: [-0.26, 0.22] }],
    ]);
    // walking legs and the step under the arm beats
    mp.bounce = -Math.abs(stride) * 3.4 + Math.sin(t * 5.1) * 0.7;
    mp.sway = 3.2 * walkK + 0.6;
    mp.lean = C.lerp(mp.lean, mp.lean + 0.015 * Math.sin(t * 5.0), walkK * 0.4);
    mp.footL = [-30 + 58 * stride, -8 - 26 * liftL];
    mp.footR = [30 - 58 * stride, -8 - 26 * liftR];
    // the arm swing is only in the free hand; the right hand owns the cap
    mp.armL[0] += 0.16 * stride * walkK;

    man(ctx, x, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: collarT, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
        { t: 1.12, f: { eyes: "normal", mouth: "flat", look: [0, 0] } },
        // the lamp beam crosses his eyes on "through"/"light": the eyes widen
        // on the flare and settle again once he is out of it. It is the shot's
        // second face state, and it is the light's doing, not a mood swing.
        { t: throughT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: lightT + 0.14, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: stoppingT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      ]),
      role: "thief", costume: "coat", hair: "#1E1610",
      // the rig's grey flat cap is on until the hand takes it at TAKE_T
      hat: lt < TAKE_T ? undefined : null,
    });

    // the collar, turned up higher on "collar"/"up"; it rides the leaned neck
    const collar = C.ease(C.clamp((lt - (collarT - 0.05)) / 0.30));
    const cx = x + 250 * Math.sin(mp.lean);
    const collarTop = 452 - 76 - 22 * collar;
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * 23, 452);
      ctx.lineTo(cx + sx * 64, 444);
      ctx.lineTo(cx + sx * (38 + 2 * collar), collarTop);
      ctx.closePath();
      ctx.fillStyle = C.shade("#6B5A3E", -10); ctx.fill();
      ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 1.6; ctx.stroke();
    }

    // The cap: exactly the rig's cap at TAKE_T, then it rides the right hand
    // down to the barrier and is left there. It never leaves the hand early.
    const takePose = { bounce: 0, sway: 0, lean: 0.05, yaw: 0.12, headTilt: 0.02, headTurn: 0.08, armL: [0.30, -0.40], armR: [-3.14, 0.06], footL: [-34, -8], footR: [34, -8] };
    const takeRoot = walkAt(TAKE_T);
    const takeHand = armHandAt(takeRoot, 900, 1.0, takePose, "R");
    const takeCap = flatCapRig(takePose);
    const capOff = [takeCap.dx - (takeHand[0] - takeRoot), takeCap.dy - (takeHand[1] - 900)];
    // the release: the same solve, read at the barrier top
    const relPose = { bounce: 0, sway: 0, lean: 0.69, yaw: 0.12, headTilt: 0.14, headTurn: 0.08, armL: [0.22, -0.24], armR: [-0.45, 0.25], footL: [-34, -8], footR: [34, -8] };
    const relHand = armHandAt(walkAt(RELEASE_T), 900, 1.0, relPose, "R");
    const capRest = [relHand[0] + capOff[0] + 26, 682];
    const capY = 682; // the barrier's top edge at the cap

    let capX = null;
    if (lt >= TAKE_T) {
      const carryK = C.ease(C.clamp((lt - TAKE_T) / 0.22));
      if (lt < RELEASE_T) {
        const h = armHandAt(x, 900, 1.0, mp, "R");
        capX = h[0] + capOff[0] + 26 * carryK;
      } else {
        capX = capRest[0];
      }
      const capYNow = lt < RELEASE_T ? Math.min(armHandAt(x, 900, 1.0, mp, "R")[1] + capOff[1], capY) : capY;
      if (lt >= RELEASE_T) {
        // the brim sits on the barrier: a contact shadow keeps it there
        shadowEllipse(ctx, capX, capY + 6, 64, 6, 0.30);
      }
      const capRot = lt < RELEASE_T ? C.lerp(takeCap.rot, -0.40, carryK) : -0.18;
      // 0.85: the cap in the hand and on the barrier is the same cap, at the
      // same size the worn one reads at 480 px
      flatCapProp(ctx, capX, capYNow, 0.85, capRot);
      // the fingers stay on the brim while he carries it and lets go
      if (lt < RELEASE_T + 0.22) {
        const h = armHandAt(x, 900, 1.0, mp, "R");
        ctx.save(); ctx.translate(h[0], h[1] + 2); ctx.rotate(-0.9 + 0.4 * C.clamp((lt - RELEASE_T) / 0.22));
        hand(ctx, 1, false, "#C98A5A");
        ctx.restore();
      }
    }

    // the lamp is still on him at the cut; he walks out of it as he goes
    const lampK = 1 - C.ease(C.clamp((lt - 0.15) / 0.95));
    if (lampK > 0.01) {
      const g = ctx.createRadialGradient(x, 300, 8, x, 300, 185);
      g.addColorStop(0, C.rgba("#FFF2C8", 0.44 * lampK));
      g.addColorStop(0.55, C.rgba("#FFE2A0", 0.14 * lampK));
      g.addColorStop(1, C.rgba("#FFE2A0", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 300, 185, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFE2A0", 0.10 * lampK);
      ctx.beginPath(); ctx.ellipse(x, 902, 140, 18, 0, 0, TAU); ctx.fill();
    }

    // he walks through the lamp on "through"/"light"
    const pass = Math.exp(-Math.pow((lt - throughT) / 0.34, 2)) * 0.8 + Math.exp(-Math.pow((lt - lightT) / 0.30, 2)) * 0.6;
    if (pass > 0.01) {
      const g = ctx.createRadialGradient(x, 300, 8, x, 300, 170);
      g.addColorStop(0, C.rgba("#FFF2C8", 0.22 * pass));
      g.addColorStop(1, C.rgba("#FFF2C8", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 300, 170, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFE2A0", 0.10 * pass);
      ctx.beginPath(); ctx.ellipse(x, 902, 120, 16, 0, 0, TAU); ctx.fill();
    }

    // the detective: he holds at the barrier and looks down at the cap for a
    // beat, then follows the man. The old head turn was toward the thief, so
    // "the eyes followed the hat" was never staged.
    const capT = RELEASE_T + 0.35;
    const dp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: -0.07, headTurn: -1.10, yaw: -0.12, armL: [0.52, 0.80], armR: [-0.16, 0.18] }],
      [1.15, { ...MAN_POSES.stand, headTilt: 0.06, headTurn: -1.05, yaw: -0.12, armL: [0.40, 0.60], armR: [-0.16, 0.18] }],
      [walkedT, { ...MAN_POSES.stand, headTilt: 0.14, headTurn: -0.98, yaw: -0.12, armL: [0.18, 0.26], armR: [-0.16, 0.18] }],
      [RELEASE_T, { ...MAN_POSES.stand, headTilt: 0.24, headTurn: -0.92, yaw: -0.14, armL: [0.04, 0.05], armR: [-0.16, 0.18] }],
      [capT, { ...MAN_POSES.stand, headTilt: 0.52, headTurn: -0.86, yaw: -0.16, armL: [0.04, 0.05], armR: [-0.16, 0.18] }],
      [capT + 0.45, { ...MAN_POSES.stand, headTilt: 0.52, headTurn: -0.86, yaw: -0.16, armL: [0.04, 0.05], armR: [-0.16, 0.18] }],
      [dur, { ...MAN_POSES.stand, headTilt: 0.22, headTurn: -0.70, yaw: -0.14, armL: [0.03, 0.04], armR: [-0.16, 0.18] }],
    ]);
    dp.bounce += Math.sin(t * 3.8) * 0.9;
    detective(ctx, 1380, 900, 1.0, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: RELEASE_T, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
      { t: capT, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
      { t: capT + 0.45, f: { eyes: "normal", mouth: "flat", look: [-1, -1] } },
      { t: dur, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]));
    // the file stays open in his left hand
    const dh = armHandAt(1380, 900, 1.0, dp, "L");
    caseFile(ctx, dh[0], dh[1] - 18, 0.56, -0.06, t, { open: true });
    ctx.save(); ctx.translate(dh[0], dh[1] - 2); ctx.rotate(-0.5);
    hand(ctx, -1, false, "#C98A5A");
    ctx.restore();

    endCam(ctx);

    TY.type(ctx, "THROUGH", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 35,
      perChar: (i) => C.clamp((t - 31.1 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE CHECKPOINT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE EYES FOLLOWED THE HAT", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "NO STOPPING", 1640, 900, 25, { fill: MUSTARD, text: INK, seed: 35, rot: -0.04, time: t });
  },
});
