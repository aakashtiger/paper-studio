/* THE RUN — s18. Day 10, the court. The gavel falls on "fell."; the judge
   closes the file, the warder crosses the empty court and takes his arm on
   "arm,". Push in on the two men and the empty bench.
   Match cut: this opens on s17's end camera. */
scene({
  id: "s18", start: 47.8, end: 51.52, line: 17, cast: "MAN / JUDGE / WARDER",
  draw(t, lt, dur) {
    const gavelT = syncLocal("s18", "e1"); // 0.62 — "fell."
    const warderT = syncLocal("s18", "e2"); // 1.48 — "warder"
    const armT = syncLocal("s18", "e4");    // 2.10 — "arm,"

    // s17 ended at 1020 / 528 / 1.07 / -0.004; the push starts there.
    setCam(
      C.kf(lt, [[0, 1020], [dur, 980]]),
      C.kf(lt, [[0, 528], [dur, 540]]),
      C.kf(lt, [[0, 1.07], [dur, 1.10]]),
      C.kf(lt, [[0, -0.004], [dur, 0.004]]),
      1.0, t
    );
    beginCam(ctx);
    courtSet(ctx, t);

    // the public gallery: two tiers of empty benches across the well, drawn
    // before the cast so the two men stand in front of empty seats. The line
    // "THE COURT IS EMPTY" needs something empty in the room, not only a title.
    for (let row = 0; row < 2; row++) {
      const by = 800 + row * 44;
      for (let i = -1; i < 9; i++) {
        const bx = i * 236;
        ctx.fillStyle = row ? "#3E2A1C" : "#4A3222";
        ctx.fillRect(bx, by, 208, 15);
        ctx.fillStyle = "#2A1A12"; ctx.fillRect(bx, by + 15, 208, 8);
        ctx.fillStyle = "#241610";
        ctx.fillRect(bx + 12, by + 23, 10, 22); ctx.fillRect(bx + 186, by + 23, 10, 22);
        ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, 208, 23);
      }
    }

    // the docket calendar, still day ten
    paper(ctx, () => roundRectPath(ctx, 230, 240, 180, 260, 6), { fill: "#3A2E24", edge: PAL.ink, edgeW: 4, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
    ctx.fillStyle = "#5A4636"; ctx.fillRect(240, 250, 160, 8);
    TY.text(ctx, "DOCKET", 320, 276, 11, { family: "DMMono", color: C.rgba(CREAM, 0.6), align: "center", letter: 3 });
    calendarProp(ctx, 320, 372, 0.75, 10, t, 0, { oldDay: 10 });

    // the judge: the gavel hand rises before the word and falls on it
    const strike = C.clamp((lt - (gavelT - 0.45)) / 0.45);
    const lift = Math.sin(strike * Math.PI) * 34;
    const jp = {
      bounce: Math.sin(t * 3.6) * 0.6, sway: 1, lean: 0.02, yaw: 0.0, headTilt: 0.03, headTurn: -0.04,
      armL: [0.12, 0.55], armR: [-0.15, -0.05],
      footL: [-32, -39], footR: [32, -39],
    };
    judge(ctx, 960, 760, 1.0, t, jp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: gavelT, f: { eyes: "closed", mouth: "flat", look: [-1, 0] } },
      { t: gavelT + 0.35, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]), { mustache: true, stubble: true, hair: "#4A423C" });

    courtBench(ctx);

    // the file closes ON the gavel beat; after that the cover reads CASE 044
    // and the knife drawing is gone
    const closeK = C.ease(C.clamp((lt - (gavelT - 0.20)) / 0.20));
    if (closeK < 0.999) {
      ctx.save(); ctx.globalAlpha = 1 - closeK;
      caseFile(ctx, 950, 438, 0.72, -0.04, t, { open: true });
      ctx.save();
      ctx.translate(922, 442); ctx.rotate(-0.52);
      // the same exhibit photo as s17, closing with the file
      ctx.strokeStyle = C.rgba(PAL.ink, 0.55); ctx.lineWidth = 1.4;
      ctx.strokeRect(-18, -30, 36, 48);
      ctx.fillStyle = C.rgba(PAL.ink, 0.06); ctx.fillRect(-18, -30, 36, 48);
      ctx.strokeStyle = C.rgba(PAL.ink, 0.8); ctx.lineWidth = 1.8; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(-2, -22); ctx.lineTo(7, -8); ctx.lineTo(-6, -8); ctx.closePath(); ctx.stroke();
      ctx.strokeRect(-6, -8, 12, 16);
      ctx.fillStyle = C.rgba(PAL.ink, 0.6); ctx.fillRect(-14, 12, 28, 3);
      ctx.restore();
      ctx.restore();
    }
    if (closeK > 0.001) {
      ctx.save(); ctx.globalAlpha = closeK;
      caseFile(ctx, 950, 438, 0.72, -0.04, t);
      ctx.restore();
    }

    // the gavel, then the judge's own forearm over the bench to its handle.
    // The upper arm is the rig's: the elbow is common, so this is one arm.
    // The hand tracks the handle's actual grip point as the gavel lifts.
    gavelProp(ctx, 1000, 480, 1.0, -0.35, strike);
    const elbow = [1055, 363];
    const tha = -0.35 - strike * 0.35;
    const gl = [1000 + Math.cos(tha) * 58, 480 - 22 - Math.sin(strike * Math.PI) * 34 + Math.sin(tha) * 58];
    const handX = gl[0] + 3, handY = gl[1] - 8;
    const fa = Math.atan2(-(handX - elbow[0]), handY - elbow[1]);
    ctx.save();
    ctx.strokeStyle = "#1E1A16"; ctx.lineWidth = 36; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(elbow[0], elbow[1]);
    ctx.quadraticCurveTo((elbow[0] + handX) / 2 + 4, (elbow[1] + handY) / 2, handX - 6, handY - 10); ctx.stroke();
    ctx.strokeStyle = C.rgba("#5A5048", 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(elbow[0], elbow[1]);
    ctx.quadraticCurveTo((elbow[0] + handX) / 2 + 4, (elbow[1] + handY) / 2, handX - 6, handY - 10); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.6); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(elbow[0] - 17, elbow[1] + 2);
    ctx.quadraticCurveTo((elbow[0] + handX) / 2 - 12, (elbow[1] + handY) / 2, handX - 21, handY - 6); ctx.stroke();
    ctx.restore();
    // the hand wrapped on the handle
    ctx.save();
    ctx.translate(handX, handY); ctx.rotate(fa);
    manMitten(ctx, 1, false, "#D9A06A", "#1E1A16");
    ctx.restore();

    // the verdict card on the bench, stamped after the gavel
    const stampK = C.clamp((lt - gavelT - 0.15) / 0.30);
    ctx.save();
    ctx.translate(1230, 455); ctx.rotate(-0.07);
    paper(ctx, () => tornRectPath(ctx, -46, -58, 92, 116, 3, 13), { fill: "#F2E8D5", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 7 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-46, -58, 92, 20);
    TY.text(ctx, "VERDICT", 0, -44, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 2 });
    ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-34, -22 + i * 14); ctx.lineTo(34, -22 + i * 14); ctx.stroke(); }
    if (stampK > 0) {
      ctx.save(); ctx.globalAlpha = stampK;
      ctx.translate(0, 22); ctx.rotate(-0.12);
      ctx.strokeStyle = "#B8382A"; ctx.lineWidth = 3; ctx.strokeRect(-36, -13, 72, 26);
      TY.text(ctx, "GUILTY", 0, 5, 13, { family: "Archivo Black", color: "#B8382A", align: "center", letter: 1 });
      ctx.restore();
    }
    ctx.restore();

    // the gavel's impact
    if (lt > gavelT) {
      ctx.save();
      ctx.globalAlpha = C.clamp((lt - gavelT) / 0.06) * (1 - C.clamp((lt - gavelT - 0.12) / 0.30));
      ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 3;
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU;
        ctx.beginPath();
        ctx.moveTo(1000 + Math.cos(a) * 34, 486 + Math.sin(a) * 34);
        ctx.lineTo(1000 + Math.cos(a) * 60, 486 + Math.sin(a) * 60);
        ctx.stroke();
      }
      ctx.restore();
    }

    // the accused, hands low in front; the gavel lands in his shoulders.
    // No cuffs in the court: they stay on the warder's belt.
    const low = { ...MAN_POSES.stand, armL: [0.30, -0.50], armR: [-0.30, 0.50], headTilt: 0.03, headTurn: -0.06 };
    const mp = poseAt(lt, [
      [0, low],
      [gavelT - 0.08, low],
      [gavelT + 0.12, { ...low, headTilt: 0.10, lean: -0.04 }],
      [armT, { ...low, headTilt: 0.06, lean: -0.02, headTurn: 0.10 }],
      [dur, { ...low, headTilt: 0.05, lean: -0.02, headTurn: 0.12 }],
    ]);
    const flinch = Math.exp(-Math.pow((lt - gavelT) / 0.12, 2));
    mp.armL[1] -= flinch * 0.30;
    mp.armR[1] += flinch * 0.30;
    mp.bounce -= flinch * 5;
    mp.bounce += Math.sin(t * 5.1) * 1.0;
    plantFeet(mp);
    man(ctx, 560, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [0, 1] } },
        { t: gavelT, f: { eyes: "wide", mouth: "o", look: [0, 1] } },
        { t: gavelT + 0.45, f: { eyes: "closed", mouth: "flat", look: [0, 0] } },
        { t: gavelT + 0.72, f: { eyes: "wide", mouth: "flat", look: [0, 1] } },
        { t: armT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
      ]),
      costume: "suit", stubble: true, tie: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310", accent: "#8E2430" },
    });

    // the warder crosses the empty court and takes his arm on "arm," with his
    // own bent left arm. He starts at the far side of the court, so the gavel
    // and the judge are never hidden behind him.
    const walkK = C.easeOut(C.clamp((lt - (gavelT + 0.22)) / 1.10));
    const wx = C.lerp(1380, 800, walkK);
    const stride = Math.sin(lt * 9) * (1 - walkK * 0.85);
    const reach = C.easeOut(C.clamp((lt - (gavelT + 0.30)) / 1.00));
    const wp = {
      bounce: -Math.abs(stride) * 4 * (1 - walkK * 0.7), sway: 3 * (1 - walkK), lean: 0.10 * (1 - walkK),
      yaw: 0.10, headTilt: 0.02, headTurn: -0.10,
      armL: [C.lerp(0.10, 0.23, reach), C.lerp(-0.20, 2.28, reach)],
      armR: [-0.25 - 0.30 * stride, 0.40],
      footL: [-34 + 25 * stride, -8 - 40 * Math.max(0, -stride)],
      footR: [34 - 25 * stride, -8 - 40 * Math.max(0, stride)],
    };
    warder(ctx, wx, 900, 0.98, t, wp, faceAt(lt, [
      { t: 0, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
      { t: gavelT, f: { eyes: "wide", mouth: "o", look: [-1, 0] } },
      { t: warderT, f: { eyes: "normal", mouth: "flat", look: [-1, 0] } },
    ]));
    // the cuffs ride on his belt, where s16 hooked them
    beltCuffs(ctx, wx - 52, 606, 0.52);

    // the empty court: dust in the light shaft
    ctx.save();
    for (let i = 0; i < 16; i++) {
      const x = 700 + C.hash(i * 3.1) * 640 + Math.sin(t * 0.7 + i) * 14;
      const y = 120 + C.hash(i * 7.7) * 720 - C.frac(t * 0.05 + C.hash(i * 5.3)) * 80;
      ctx.fillStyle = C.rgba("#FFE2A0", 0.18 + C.hash(i * 9.1) * 0.2);
      ctx.beginPath(); ctx.arc(x, y, 1.4 + C.hash(i * 11.3) * 2, 0, TAU); ctx.fill();
    }
    ctx.restore();

    // the dock: a rail in front of the accused, at his shins
    ctx.fillStyle = "#2A1A12"; ctx.fillRect(360, 888, 420, 40);
    ctx.fillStyle = "#4A2E1C"; ctx.fillRect(360, 870, 420, 18);
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3;
    ctx.strokeRect(360, 870, 420, 58);
    ctx.fillStyle = C.rgba("#C8A86A", 0.4); ctx.fillRect(360, 870, 420, 3);
    ctx.fillStyle = "#3A2418"; ctx.fillRect(368, 842, 16, 46); ctx.fillRect(756, 842, 16, 46);

    // foreground gallery rail
    ctx.fillStyle = "#3A2A1E"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#6A4A30"; ctx.fillRect(0, 980, W, 14);
    ctx.strokeStyle = "#1A1410"; ctx.lineWidth = 6;
    for (let x = 40; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 994); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#E8B84A", 0.2); ctx.fillRect(0, 980, W, 4);

    // type is screen space, never in the camera
    endCam(ctx);

    TY.type(ctx, "THE GAVEL", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 45,
      perChar: (i) => C.clamp((t - 48.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE COURT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE GALLERY WAS EMPTY", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    // the verdict sits on the empty gallery bench, not in the air: a slip left
    // where a spectator would have been, which is what the line says the court
    // is missing.
    TY.sticker(ctx, "GUILTY", 1636, 856, 26, { fill: CORAL, text: CREAM, seed: 45, rot: -0.035, time: t });
  },
});
