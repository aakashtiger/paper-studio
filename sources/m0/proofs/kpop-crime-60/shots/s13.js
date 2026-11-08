/* THE RUN — s13. Day 9, the bridge.

   Rain, the searchlight watching the only way out, and a distant detective
   silhouette waiting under the far lamp — the line names him. The man walks
   toward the far end with no cap: the grey cap is still at the checkpoint. The
   corner page reads nine. Push toward the far end. */

/* A distant detective, read as a silhouette: long trench, fedora, a badge
   glint. No face — at this distance he is a shape under the lamp. */
function farDetective(ctx, x, y, s, t, rim) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadowEllipse(ctx, 0, 0, 74, 11, 0.34);
  // legs and shoes, so the silhouette is a man and not a bell
  ctx.fillStyle = "#0B131E";
  ctx.fillRect(-38, -170, 30, 170);
  ctx.fillRect(8, -170, 30, 170);
  ctx.fillStyle = "#05070A";
  ctx.fillRect(-46, -9, 40, 9);
  ctx.fillRect(6, -9, 38, 9);
  // the trench reaches the knee
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-76, -160); ctx.lineTo(-68, -280);
    ctx.quadraticCurveTo(-64, -410, 0, -426);
    ctx.quadraticCurveTo(64, -410, 68, -280);
    ctx.lineTo(76, -160); ctx.closePath();
  }, { fill: "#16202E", edge: "#070B10", edgeW: 3, shadow: C.rgba(PAL.ink, 0.4), sx: 5, sy: 8 });
  // shoulder caps, belt and the open coat: the trench reads in silhouette
  ctx.fillStyle = "#0B131E";
  ctx.beginPath(); ctx.ellipse(-57, -406, 26, 16, -0.24, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(57, -406, 26, 16, 0.24, 0, TAU); ctx.fill();
  ctx.fillStyle = "#1C2836"; ctx.fillRect(-66, -250, 132, 12);
  ctx.strokeStyle = C.rgba("#2C3A4E", 0.8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -396); ctx.lineTo(0, -18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-34, -330); ctx.lineTo(-40, -40); ctx.stroke();
  // the near arm, hanging with a hand, and the far arm holding the file
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * 58, -398); ctx.rotate(side * 0.05);
    paper(ctx, () => roundRectPath(ctx, -11, 0, 22, 176, 10), { fill: "#1A2432", edge: "#070B10", edgeW: 2.4 });
    ctx.fillStyle = "#B87A4E"; ctx.beginPath(); ctx.arc(0, 180, 10, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.rgba(PAL.ink, 0.5); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.restore();
  }
  // the white shirt V and the red tie: the detective at a glance
  ctx.fillStyle = C.rgba("#F2E8D5", 0.30);
  ctx.beginPath(); ctx.moveTo(-16, -420); ctx.lineTo(0, -386); ctx.lineTo(16, -420); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.rgba("#7A1F26", 0.85);
  ctx.beginPath(); ctx.moveTo(-5, -412); ctx.lineTo(0, -396); ctx.lineTo(5, -412); ctx.lineTo(4, -374); ctx.lineTo(0, -366); ctx.lineTo(-4, -374); ctx.closePath(); ctx.fill();
  // the case file tucked under his left arm, a pale note in the dark
  ctx.fillStyle = C.rgba("#E0D2B4", 0.55);
  ctx.fillRect(-98, -330, 30, 42);
  // head: a dark paper oval; a fedora with a wide brim and a pinched crown
  ctx.fillStyle = "#0B1018"; ctx.beginPath(); ctx.ellipse(0, -470, 44, 44, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#080C12"; ctx.beginPath(); ctx.ellipse(0, -520, 74, 13, 0, 0, TAU); ctx.fill();
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-40, -522);
    ctx.quadraticCurveTo(-44, -550, -20, -558);
    ctx.quadraticCurveTo(-8, -562, 0, -554);
    ctx.quadraticCurveTo(8, -562, 20, -558);
    ctx.quadraticCurveTo(44, -550, 40, -522);
    ctx.closePath();
  }, { fill: "#0D1118", edge: "#05080C", edgeW: 2 });
  ctx.fillStyle = C.rgba("#C8A86A", 0.28); ctx.fillRect(-40, -530, 80, 4);
  // the badge catches the lamp once
  if (rim > 0.02) {
    ctx.fillStyle = C.rgba("#E8B84A", 0.65 * rim);
    ctx.beginPath();
    ctx.moveTo(42, -394); ctx.lineTo(50, -394); ctx.lineTo(50, -384);
    ctx.quadraticCurveTo(50, -378, 46, -376);
    ctx.quadraticCurveTo(42, -378, 42, -384);
    ctx.closePath(); ctx.fill();
  }
  // the lamp's rim down both edges of the coat and the hat
  ctx.strokeStyle = C.rgba("#D8E8F8", 0.26 + 0.34 * rim); ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(-68, -300); ctx.quadraticCurveTo(-64, -410, -4, -426); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-62, -520); ctx.quadraticCurveTo(-34, -526, -8, -528); ctx.stroke();
  ctx.strokeStyle = C.rgba("#FFE2A0", 0.16 + 0.20 * rim); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(68, -300); ctx.quadraticCurveTo(64, -410, 4, -426); ctx.stroke();
  // a breath, so he is waiting and not painted on the wall
  ctx.fillStyle = C.rgba("#0A0E14", 0.28);
  ctx.beginPath(); ctx.ellipse(0, -428, 34, 6, 0, 0, TAU * Math.abs(Math.sin(t * 1.6))); ctx.fill();
  ctx.restore();
}

scene({
  id: "s13", start: 34.6, end: 37.42, line: 12, cast: "MAN",
  draw(t, lt, dur) {
    const dayT = syncLocal("s13", "e0");       // 0.10 — "Day"
    const nineT = syncLocal("s13", "e1");      // 0.32 — "nine."
    const bridgeT = syncLocal("s13", "e2");    // 1.14 — "bridge"
    const wetT = syncLocal("s13", "e3");       // 1.66 — "wet,"
    const detectiveT = syncLocal("s13", "e4"); // 2.48 — "detective"

    const u = C.clamp(lt / dur);
    const x = 680 + 180 * u;
    const phase = lt * TAU * 1.22;
    const stride = Math.sin(phase);
    const liftL = Math.max(0, -stride), liftR = Math.max(0, stride);

    // the searchlight swings in, then locks on the far end on "bridge"
    const lock = C.ease(C.clamp((lt - (bridgeT - 0.35)) / 0.45));
    const sweep = C.kf(lt, [[0, 0.30], [bridgeT - 0.30, 0.20], [bridgeT, 0.055], [dur, 0.045]]);
    const reveal = C.ease(C.clamp((lt - (detectiveT - 0.10)) / 0.28));

    setCam(
      C.kf(lt, [[0, 900], [dur, 940]]),
      C.kf(lt, [[0, 540], [dur, 525]]),
      C.kf(lt, [[0, 1.0], [dur, 1.09]]),
      C.kf(lt, [[0, 0.008], [dur, -0.006]]),
      1.2, t
    );
    ctx.fillStyle = "#1C2834"; ctx.fillRect(0, 0, W, H);
    beginCam(ctx);
    bridgeSet(ctx, t);
    // the barrier that ends the walkway: the only way out, watched
    bridgeEndGate(ctx, t, { lit: 0.45 + 0.55 * lock });

    // the cold searchlight from the far bank
    ctx.save();
    ctx.globalAlpha = 0.28 + 0.22 * lock;
    spotlight(ctx, 1700, -90, 1120, 40, 300, "#DFF0FF", 0.9, sweep);
    ctx.restore();
    ctx.save();
    ctx.translate(1660, 900); ctx.scale(1, 0.2);
    const pool = ctx.createRadialGradient(0, 0, 10, 0, 0, 240);
    pool.addColorStop(0, C.rgba("#DFF0FF", 0.30 + 0.22 * lock));
    pool.addColorStop(1, C.rgba("#DFF0FF", 0));
    ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(0, 0, 240, 0, TAU); ctx.fill();
    ctx.restore();

    // the far lamp's pool, and the detective already waiting under it
    const lampG = ctx.createRadialGradient(1600, 406, 10, 1600, 406, 330);
    lampG.addColorStop(0, C.rgba("#FFE2A0", 0.36));
    lampG.addColorStop(1, C.rgba("#FFE2A0", 0));
    ctx.fillStyle = lampG; ctx.beginPath(); ctx.arc(1600, 406, 330, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalAlpha = 0.92;
    farDetective(ctx, 1660, 900, 0.86, t, 0.35 + 0.65 * reveal);
    ctx.restore();
    if (reveal > 0) {
      const g = ctx.createRadialGradient(1660, 430, 20, 1660, 430, 260);
      g.addColorStop(0, C.rgba("#DFF0FF", 0.30 * reveal));
      g.addColorStop(1, C.rgba("#DFF0FF", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(1660, 430, 260, 0, TAU); ctx.fill();
    }

    // the coat tail, olive like the work coat, swinging from the hem
    ctx.save();
    ctx.fillStyle = "#4A3E2C";
    ctx.beginPath();
    ctx.moveTo(x - 44, 612);
    ctx.quadraticCurveTo(x - 78 - 8 * Math.sin(t * 7), 652, x - 66 - 12 * Math.sin(t * 6.2), 702);
    ctx.lineTo(x - 38, 684);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba(INK, 0.55); ctx.lineWidth = 2.4; ctx.stroke();
    ctx.restore();
    const mp = {
      bounce: -Math.abs(stride) * 4.2 + Math.sin(t * 5.3) * 0.8,
      sway: 5, lean: 0.08, yaw: 0.16, headTilt: 0.02, headTurn: 0.16,
      armL: [0.28 + 0.20 * stride, -0.22],
      armR: [-0.30 - 0.20 * stride, 0.34],
      footL: [-30 + 54 * stride, -8 - 24 * liftL],
      footR: [30 - 54 * stride, -8 - 24 * liftR],
    };
    man(ctx, x, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [
        { t: 0, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: bridgeT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
        { t: wetT, f: { eyes: "normal", mouth: "flat", look: [1, 0] } },
        { t: detectiveT, f: { eyes: "wide", mouth: "flat", look: [1, 0] } },
      ]),
      role: "thief", hat: null, costume: "coat", hair: "#1E1610",
    });

    // the corner page: day 9
    ctx.save();
    ctx.translate(150, 878); ctx.rotate(-0.05);
    paper(ctx, () => roundRectPath(ctx, -64, -94, 128, 188, 5), { fill: "#E8DCC4", edge: PAL.ink, edgeW: 2, shadow: C.rgba(PAL.ink, 0.3), sx: 3, sy: 6 });
    ctx.fillStyle = "#8E2430"; ctx.fillRect(-64, -94, 128, 28);
    TY.text(ctx, "THE RUN", 0, -74, 12, { family: "Archivo Black", color: PAL.cream, align: "center", letter: 1 });
    TY.text(ctx, "9", 0, 40, 78, { family: "Archivo Black", color: PAL.ink, align: "center" });
    TY.text(ctx, "DAY", 0, 72, 13, { family: "DMMono", color: C.rgba(PAL.ink, 0.6), align: "center", letter: 4 });
    ctx.restore();

    // extra rain in front of the far lamp, so the silhouette sits in weather
    rainStreaks(ctx, t, 46, "#D8E8F8", 0.20, 1.35);

    endCam(ctx);

    TY.type(ctx, "THE BRIDGE", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 36,
      perChar: (i) => C.clamp((t - 34.86 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE BRIDGE", 124, 236, 18, { family: "DMMono", color: C.rgba(CREAM, 0.82), letter: 3, stroke: C.rgba(INK, 0.55), strokeW: 3 });
    TY.text(ctx, "THE ONLY WAY OUT", 124, 264, 14, { family: "DMMono", color: C.rgba(CREAM, 0.62), letter: 2, stroke: C.rgba(INK, 0.5), strokeW: 3 });
    TY.sticker(ctx, "SEARCHLIGHT", 360, 760, 24, { fill: MUSTARD, text: INK, seed: 36, rot: 0.03, time: t });
  },
});
