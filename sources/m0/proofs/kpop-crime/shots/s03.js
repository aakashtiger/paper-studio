/* THE RUN — s3. Day 6, the hideout. The calendar turns on its word; the bulb
   flickers; he reaches up to the clear wall. */
scene({
  id: "s3", start: 6.0, end: 9.0, line: 2, cast: "MAN",
  draw(t, lt, dur) {
    const calT = syncLocal("s3", "e3"); // 2.4 — the calendar
    const flick = 0.55 + 0.45 * Math.abs(Math.sin(t * 11.3)) * (0.8 + 0.2 * Math.sin(t * 4.7));
    setCam(C.kf(lt, [[0, 960], [dur, 940]]), C.kf(lt, [[0, 540], [dur, 520]]), C.kf(lt, [[0, 1.02], [dur, 1.08]]), C.kf(lt, [[0, 0.01], [dur, -0.01]]), 1.2, t);
    beginCam(ctx);
    hideoutSet(ctx, t, { flicker: flick });

    // the calendar on the clear wall, big enough to read; the page turns on the word
    const turn = C.ease(C.clamp((lt - calT) / 0.5));
    calendarProp(ctx, 980, 330, 1.15, 7, t, turn, { oldDay: 6 });

    // a chair, so the room is lived in
    paper(ctx, () => roundRectPath(ctx, 1080, 690, 150, 22, 3), { fill: "#6A4A32", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 6 });
    ctx.fillStyle = "#4A3428"; ctx.fillRect(1092, 712, 16, 188); ctx.fillRect(1202, 712, 16, 188);
    ctx.fillStyle = "#5A4030"; ctx.fillRect(1080, 600, 20, 110);

    const mp = poseAt(lt, [[0, MAN_POSES.stand], [0.7, MAN_POSES.pace], [1.2, MAN_POSES.stand], [calT - 0.25, MAN_POSES.reach], [calT + 0.35, MAN_POSES.reachHigh], [calT + 0.9, MAN_POSES.turn]]);
    man(ctx, 760, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: calT - 0.2, f: { eyes: "wide", mouth: "o", look: [1, -1] } }, { t: calT + 0.4, f: { eyes: "narrow", mouth: "flat", look: [1, -1] } }, { t: calT + 0.9, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }]),
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });

    // the torn page falls away after the turn
    if (turn > 0.55) {
      const k = C.clamp((lt - calT - 0.35) / 0.6);
      ctx.save(); ctx.globalAlpha = 1 - k;
      ctx.translate(980 + 60 * k, 330 + 210 * k); ctx.rotate(0.9 * k + 0.2);
      paper(ctx, () => roundRectPath(ctx, -30, -42, 60, 84, 3), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 1.6, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 5 });
      TY.text(ctx, "6", 0, 16, 40, { family: "Archivo Black", color: PAL.ink, align: "center" });
      ctx.restore();
    }

    TY.type(ctx, "DAY 6", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 19,
      perChar: (i) => C.clamp((t - 6.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE HIDEOUT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CALENDAR TURNS", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
