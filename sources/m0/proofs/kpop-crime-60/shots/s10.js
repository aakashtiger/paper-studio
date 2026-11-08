/* THE RUN — s10. Day 8, the checkpoint.

   The lamp swings over the queue and finds his face on "checkpoint"; the
   detective reads the open file at the hut. Olive work coat and grey flat cap
   against navy trench and fedora, so the two men read apart at 1x. The queue is
   male backs and hats only — no faces. Camera pans from the queue to the hut. */

/* A man in the queue, seen from behind: coat, shoulders, the back of a head,
   a hat. No face is ever drawn. */
function queueBack(ctx, x, y, s, coat, hair, hatKind, t, i, stride = 0) {
  const bob = Math.sin(t * 1.9 + i * 1.7) * 1.4 - Math.abs(stride) * 5;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 0, 64, 10, 0.30);
  // the coat, from the shoulders to the hem
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-62, 0); ctx.lineTo(-54, -330);
    ctx.quadraticCurveTo(-44, -418, 0, -430);
    ctx.quadraticCurveTo(44, -418, 54, -330);
    ctx.lineTo(62, 0); ctx.closePath();
  }, { fill: coat, edge: C.rgba(PAL.ink, 0.7), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.28), sx: 4, sy: 7 });
  // A walker's legs, painted OVER the coat hem: the long coat hides the legs,
  // so the only honest way to show locomotion from behind is to shorten the
  // silhouette and let the legs stride. stride = one sine of the walk cycle.
  if (stride !== 0) {
    for (const [ph, shade] of [[stride, -14], [-stride, 0]]) {
      const lx = ph * 44;
      const lift = Math.max(0, ph) * 9;
      ctx.fillStyle = C.shade("#171310", shade);
      ctx.beginPath();
      ctx.moveTo(lx - 15, -150); ctx.lineTo(lx + 15, -150);
      ctx.lineTo(lx + 17, 2 - lift); ctx.lineTo(lx - 17, 2 - lift);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 2; ctx.stroke();
      // the boot, toe forward
      ctx.beginPath(); ctx.ellipse(lx + 8, 4 - lift, 22, 8, 0, 0, TAU); ctx.fill();
      ctx.stroke();
    }
  }
  // belt, centre seam and collar
  ctx.fillStyle = C.rgba(PAL.ink, 0.55); ctx.fillRect(-52, -262, 104, 10);
  ctx.strokeStyle = C.rgba(PAL.ink, 0.4); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(0, -420); ctx.lineTo(0, -10); ctx.stroke();
  ctx.fillStyle = C.rgba(PAL.ink, 0.35); ctx.beginPath(); ctx.moveTo(-40, -426); ctx.lineTo(0, -400); ctx.lineTo(40, -426); ctx.closePath(); ctx.fill();
  // the neck and the back of the head, hair only
  ctx.fillStyle = C.shade(hair, -4); ctx.fillRect(-13, -456, 26, 30);
  paper(ctx, () => { ctx.beginPath(); ctx.ellipse(0, -492, 48, 56, 0, 0, TAU); }, { fill: hair, edge: C.rgba(PAL.ink, 0.6), edgeW: 2 });
  // the hat
  if (hatKind === "fedora") {
    ctx.fillStyle = "#171A1E"; ctx.beginPath(); ctx.ellipse(0, -530, 74, 14, 0, 0, TAU); ctx.fill();
    paper(ctx, () => roundRectPath(ctx, -46, -574, 92, 48, 10), { fill: "#1E2226", edge: C.rgba(PAL.ink, 0.75), edgeW: 2 });
    // one hat band for the film: dark, with no gold flash on the background
    // fedoras. The only gold on a hat is a uniform badge.
    ctx.fillStyle = C.rgba(PAL.ink, 0.55); ctx.fillRect(-46, -540, 92, 5);
  } else {
    // a flat cap, the same low crown as the thief's
    ctx.fillStyle = "#23262A"; ctx.beginPath(); ctx.ellipse(0, -534, 66, 12, 0, 0, TAU); ctx.fill();
    paper(ctx, () => roundRectPath(ctx, -52, -570, 104, 38, 9), { fill: "#2A2D31", edge: C.rgba(PAL.ink, 0.7), edgeW: 2 });
    ctx.fillStyle = C.rgba(PAL.ink, 0.3); ctx.fillRect(-52, -544, 104, 4);
  }
  // the near arm, hanging; a bitten mitten at the end
  const arm = [0.16 + 0.05 * Math.sin(t * 1.7 + i) + 0.26 * stride, 0.18 + 0.18 * Math.abs(stride)];
  const wrist = bentLimb(ctx, 62, -420, 104, 88, 50, 42, 32, arm[0], arm[1], C.shade(coat, -8), C.rgba(PAL.ink, 0.6));
  ctx.save(); ctx.translate(wrist[0], wrist[1]); ctx.rotate(arm[0] + arm[1]);
  paper(ctx, () => roundRectPath(ctx, -9, 0, 18, 26, 8), { fill: "#B87A4E", edge: C.rgba(PAL.ink, 0.55), edgeW: 1.4 });
  ctx.restore();
  // the rain rim on the shoulder nearest the lamp
  ctx.strokeStyle = C.rgba("#FFE2A0", 0.18); ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(-50, -360); ctx.quadraticCurveTo(-42, -412, -8, -428); ctx.stroke();
  ctx.restore();
}

scene({
  id: "s10", start: 26.06, end: 28.72, line: 9, cast: "MAN / DETECTIVE / QUEUE",
  draw(t, lt, dur) {
    const dayT = syncLocal("s10", "e0");        // 0.10 — "Day"
    const eightT = syncLocal("s10", "e1");      // 0.74 — "eight."
    const checkpointT = syncLocal("s10", "e2"); // 1.34 — "checkpoint"
    const edgeT = syncLocal("s10", "e4");       // 2.46 — "edge,"

    const swing = 0.055 * Math.sin(t * 1.75) + 0.02 * Math.sin(t * 3.1);
    const find = C.ease(C.clamp((lt - checkpointT) / 0.75));

    setCam(
      C.kf(lt, [[0, 800], [dur, 1080]]),
      C.kf(lt, [[0, 545], [dur, 530]]),
      C.kf(lt, [[0, 1.0], [dur, 1.04]]),
      C.kf(lt, [[0, 0.006], [dur, -0.008]]),
      1.1, t
    );
    ctx.fillStyle = "#141C24"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    checkpointSet(ctx, t, { lampSwing: swing });

    // the queue: three male backs and hats in the foreground, no faces
    queueBack(ctx, 300, 900, 0.92, "#22282E", "#3A2E22", "fedora", t, 0);
    queueBack(ctx, 440, 900, 0.90, "#2A2A24", "#241F1A", "cap", t, 1);
    queueBack(ctx, 580, 900, 0.88, "#1E242E", "#2E251C", "fedora", t, 2);

    // the lamp's beam, swinging over the queue
    ctx.save();
    ctx.globalAlpha = 0.22 + 0.12 * find;
    spotlight(ctx, 840, 350, 620, 54, 340, "#FFE2A0", 0.7, swing * 0.9);
    ctx.restore();

    // the man at the barrier end of the queue: flat cap, collar up, facing right
    const mp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: 0.07, headTurn: 0.20, yaw: 0.18, armL: [0.16, -0.10], armR: [-0.16, 0.12] }],
      [eightT, { ...MAN_POSES.stand, headTilt: 0.04, headTurn: 0.24, yaw: 0.20, armL: [0.18, -0.12], armR: [-0.18, 0.14] }],
      [checkpointT, { ...MAN_POSES.stand, headTilt: -0.02, headTurn: 0.24, yaw: 0.22, armL: [0.22, -0.18], armR: [-0.20, 0.16] }],
      // the lamp swings over him: the right hand comes up to the collar, elbow
      // down at his side, and holds it through "edge,". The near arm is painted
      // last, so this hand is visible against the coat — the far hand is not.
      [checkpointT + 0.20, { ...MAN_POSES.stand, headTilt: 0.02, headTurn: 0.32, yaw: 0.22, armL: [0.18, -0.12], armR: [-0.05, 2.40] }],
      [edgeT, { ...MAN_POSES.stand, headTilt: -0.04, headTurn: 0.46, yaw: 0.22, armL: [0.18, -0.14], armR: [-0.05, 2.40] }],
      [dur, { ...MAN_POSES.stand, headTilt: -0.04, headTurn: 0.55, yaw: 0.22, armL: [0.18, -0.16], armR: [-0.05, 2.40] }],
    ]);
    mp.bounce += Math.sin(t * 4.7) * 1.1;
    mp.sway = 1.6;
    // he keeps his eyes on the barrier: the head sweeps, the body never locks
    mp.headTurn += 0.045 * Math.sin(t * 5.4);
    mp.lean += 0.035 * Math.sin(t * 5.0);
    // the packed bag hangs from his left hand at the checkpoint
    const bagHand = armHandAt(700, 900, 1.0, mp, "L");
    bagProp(ctx, bagHand[0] - 4, bagHand[1] + 102, 0.78, -0.02);

    man(ctx, 700, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: eightT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: checkpointT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: edgeT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      ]),
      role: "thief", costume: "coat",
    });
    // his collar, up against the rain
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

    // the detective at the hut, the open file in his left hand. He reads it:
    // the head is down over the page, the eyes are down-left on the paper, and
    // he stays there until the cut. s11 is the shot where he looks up.
    const dp = poseAt(lt, [
      [0, { ...MAN_POSES.stand, headTilt: 0.24, headTurn: -0.34, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
      [checkpointT, { ...MAN_POSES.stand, headTilt: 0.26, headTurn: -0.40, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
      [edgeT, { ...MAN_POSES.stand, headTilt: 0.22, headTurn: -0.46, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
      [dur, { ...MAN_POSES.stand, headTilt: 0.20, headTurn: -0.48, yaw: -0.10, armL: [0.55, 0.85], armR: [-0.20, 0.25] }],
    ]);
    dp.bounce += Math.sin(t * 3.9) * 1.0;
    detective(ctx, 1380, 900, 1.0, t, dp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
      { t: edgeT, f: { eyes: "normal", mouth: "flat", look: [-1, 1] } },
    ]));
    const dh = armHandAt(1380, 900, 1.0, dp, "L");
    caseFile(ctx, dh[0], dh[1] - 22, 0.62, -0.10, t, { open: true });
    // the hand closes on the spine, so the file is held and not floating
    ctx.save(); ctx.translate(dh[0], dh[1] - 6); ctx.rotate(-0.5);
    hand(ctx, -1, false, "#C98A5A");
    ctx.restore();

    // the lamp finds his face on "checkpoint"
    if (find > 0) {
      const g = ctx.createRadialGradient(700, 300, 10, 700, 300, 170);
      g.addColorStop(0, C.rgba("#FFF2C8", 0.30 * find));
      g.addColorStop(1, C.rgba("#FFF2C8", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(700, 300, 170, 0, TAU); ctx.fill();
      ctx.fillStyle = C.rgba("#FFE2A0", 0.10 * find);
      ctx.beginPath(); ctx.ellipse(700, 902, 120, 16, 0, 0, TAU); ctx.fill();
    }

    // a glint on the wet barrier on the pan
    const glint = Math.exp(-Math.pow((lt - checkpointT) / 0.16, 2));
    if (glint > 0.02) {
      ctx.save(); ctx.globalAlpha = glint * 0.7;
      ctx.strokeStyle = "#FFE2A0"; ctx.lineWidth = 2.4;
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * TAU;
        ctx.beginPath(); ctx.moveTo(1130 + Math.cos(a) * 16, 688 + Math.sin(a) * 10);
        ctx.lineTo(1130 + Math.cos(a) * 34, 688 + Math.sin(a) * 22); ctx.stroke();
      }
      ctx.restore();
    }

    endCam(ctx);

    TY.type(ctx, "THE CHECKPOINT", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 33,
      perChar: (i) => C.clamp((t - 26.26 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE CHECKPOINT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "A LAMP OVER THE QUEUE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    TY.sticker(ctx, "QUEUE", 280, 270, 26, { fill: MUSTARD, text: INK, seed: 33, rot: -0.03, time: t });
  },
});
