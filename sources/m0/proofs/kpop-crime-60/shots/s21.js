/* THE RUN — s21. Day 10, the yard. The bell swings once on "noose"; the noose
   on the wall is only a shadow, and it is never on the man. On "shadow." the
   platform opens and he goes down through it, behind the boards, and the shadow
   on the bricks goes taut. No body is shown: the platform is the last thing that
   touches him. The last 0.4 s go to black. Match cut: this opens on s20's end. */
scene({
  id: "s21", start: 58.14, end: 60, line: 20, cast: "MAN / WARDER", fade: { start: 59.6, dur: 0.4 },
  draw(t, lt, dur) {
    const bellT = syncLocal("s21", "e1");   // 0.40 — "noose"
    const shadowT = syncLocal("s21", "e2"); // 1.14 — "shadow."

    const swing = lt < bellT
      ? 0
      : 0.42 * Math.exp(-(lt - bellT) * 1.5) * Math.sin((lt - bellT) * 7.2);

    // s20 ended at 960 / 535 / 0.98 / -0.004; the pull starts there.
    setCam(
      C.kf(lt, [[0, 960], [dur, 1010]]),
      C.kf(lt, [[0, 535], [dur, 540]]),
      C.kf(lt, [[0, 0.98], [dur, 0.94]]),
      C.kf(lt, [[0, -0.004], [dur, 0.004]]),
      0.8, t
    );
    beginCam(ctx);
    yardSet(ctx, t, { bellSwing: swing, sunLift: 42 });
    yardDoor60(ctx);

    // One day counter, on the wall where s20 put it, inside the frame for the
    // whole pull-out. It has to be the same page in the same place: the cut
    // from s20 lands on it, and a page that moves would read as a second day.
    calendarProp(ctx, 1450, 620, 0.50, 10, t, 0, { oldDay: 10 });

    // The noose is a flat shadow on the bricks at x 1215, a clear 50 px left of
    // his shoulder and never across his face. It is one piece with the beam's
    // shadow. On the drop it goes taut: the loop is pulled out of the loop.
    const openT = shadowT;
    const dropT = shadowT + 0.08;
    const taut = C.ease(C.clamp((lt - dropT) / 0.20));
    const pulse = 1 + 0.04 * Math.exp(-Math.pow((lt - shadowT) / 0.20, 2));
    const hold = lt > bellT ? Math.exp(-(lt - bellT) * 1.7) * Math.sin((lt - bellT) * 3.4) : 0;
    const sway = 0.012 * Math.sin(lt * 1.3) + 0.06 * hold;
    nooseShadow(ctx, 1215, 300, 1215, 500, sway, pulse * 0.92, 0.42, taut);

    // THE DROP. He stands on the hatch; it opens, and the body goes down behind
    // the boards under the platform edge. The clip is the platform's top line,
    // so the picture never lifts him out of frame: the platform does the work.
    const fall = 540 * Math.pow(C.clamp((lt - dropT) / 0.20), 2);
    const down = lt > dropT;

    const mp = { ...MAN_POSES.stand, headTilt: 0.10, headTurn: 0.05 };
    // wrists: the same two points s20 ended on, so the cut is one continuous
    // pair of hands in one pair of cuffs
    const WL = [1293, 512], WR = [1338, 486];
    mp.armL = solveArm(1318, 900, 1, "L", WL[0], WL[1]);
    mp.armR = solveArm(1318, 900, 1, "R", WR[0], WR[1]);
    mp.bounce = Math.sin(t * 5.1) * 1.0;
    mp.sway = 1;
    // the bell lands: the shoulders square, then the body eases
    const bellK = C.ease(C.clamp((lt - bellT + 0.04) / 0.18));
    mp.lean = -0.05 * C.ease(C.clamp((lt - 0.30) / 0.55)) * (1 - bellK);
    mp.headTilt += -0.10 * bellK;
    // before the drop he reads the wall and lifts his chin to it
    mp.headTurn += -0.30 * C.ease(C.clamp((lt - 0.55) / 0.45));
    plantFeet(mp);

    ctx.save();
    if (down) { ctx.beginPath(); ctx.rect(0, 0, W, 900); ctx.clip(); }
    man(ctx, 1318, 900 + fall, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [0, -1] } },
        { t: bellT, f: { eyes: "wide", mouth: "flat", look: [0, -1] } },
        { t: bellT + 0.35, f: { eyes: "normal", mouth: "flat", look: [0, -1] } },
        { t: shadowT - 0.10, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      ]),
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D8D5CC", jacket: "#2F3B4A", trouser: "#6A6E72", shoe: "#171310", hair: "#171310" },
    });
    // the cuffs at the drawn wrists, riding the body down
    if (fall < 300) {
      const eL = armHandAt(1318, 900 + fall, 1.0, mp, "L");
      const eR = armHandAt(1318, 900 + fall, 1.0, mp, "R");
      handcuffChain(ctx, eL[0], eL[1], eR[0], eR[1], 0.56);
      cuffRing(ctx, eL[0], eL[1], 0.58, 0.18, 1);
      cuffRing(ctx, eR[0], eR[1], 0.58, -0.18, 1);
    }
    ctx.restore();

    // The hatch, opened: the hole goes black, the two leaves swing down out of
    // the boards. Drawn after the body so his legs vanish into it, before the
    // warder so he is never behind the platform.
    const hatchK = C.easeOut(C.clamp((lt - openT) / 0.14));
    if (hatchK > 0.01) {
      ctx.save();
      ctx.fillStyle = "#070605";
      ctx.fillRect(1260, 900, 120, 40);
      // the underside of the far lip, lit a hair by the dawn
      ctx.fillStyle = C.rgba("#6A5240", 0.35 * hatchK);
      ctx.fillRect(1260, 900, 120, 4);
      for (const [hx, dir] of [[1260, 1], [1380, -1]]) {
        ctx.save();
        ctx.translate(hx, 903);
        ctx.rotate(dir * (0.06 + 0.34 * hatchK) * Math.sin(Math.min(1, hatchK) * Math.PI * 0.5));
        ctx.fillStyle = "#2E2118";
        ctx.fillRect(dir > 0 ? 0 : -12, 0, 12, 74 * hatchK);
        ctx.strokeStyle = C.rgba("#1A1410", 0.7); ctx.lineWidth = 2;
        ctx.strokeRect(dir > 0 ? 0 : -12, 0, 12, 74 * hatchK);
        ctx.restore();
      }
      ctx.restore();
    }

    // The warder steps off the platform to the left and walks out of the frame's
    // centre, so nothing stands between us and the boards. His feet are driven
    // by the distance he covers, so the stride cannot skate. No cuffs on his
    // belt: the pair is on the man, where the film put them in s15.
    const leaveK = C.ease(C.clamp((lt - 0.22) / 1.16));
    const wx = C.lerp(1158, 812, leaveK);
    const wph = (1158 - wx) / 150 * Math.PI;
    const ws = Math.sin(wph);
    const wstop = 1 - C.easeOut(C.clamp((lt - 1.38) / 0.20));
    const wp = {
      bounce: -Math.abs(ws) * 4.5 * wstop + Math.sin(t * 4.5 + 1) * 0.7,
      sway: 2.5, lean: 0.05 * leaveK * wstop, yaw: 0.06, headTilt: 0.02,
      headTurn: 1.55 - 1.30 * leaveK,
      armL: [0.10 + 0.26 * ws * wstop, -0.20],
      armR: [-0.32 - 0.20 * ws * wstop, 0.45],
      footL: [80 * ws * wstop, -8 - 44 * Math.max(0, Math.cos(wph)) * wstop],
      footR: [-80 * ws * wstop, -8 - 44 * Math.max(0, -Math.cos(wph)) * wstop],
    };
    if (leaveK < 0.12) {
      // he was holding the steel a moment ago; the hand comes off the chain
      const k = 1 - C.clamp(leaveK / 0.12);
      wp.armR[0] = C.lerp(wp.armR[0], -0.95, k);
      wp.armR[1] = C.lerp(wp.armR[1], 0.55, k);
    }
    warder(ctx, wx, 900, 0.98, t, wp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: bellT, f: { eyes: "normal", mouth: "flat", look: [1, 1] } },
      { t: bellT + 0.35, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      { t: shadowT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
    ]));

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "THE SHADOW", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 51,
      perChar: (i) => C.clamp((t - 58.5 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE YARD", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE BELL · THE WALL", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    // the last 0.4 s go to black (the scene fade is the page's, at 59.6)
  },
});
