/* THE RUN — s4. Day 9, the bridge. The cuffs close on the wrist under a
   sweeping searchlight. */
scene({
  id: "s4", start: 9.0, end: 12.0, line: 3, cast: "MAN",
  draw(t, lt, dur) {
    const cuffT = syncLocal("s4", "e3"); // 2.54 — the cuffs
    setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.04], [dur, 1.0]]), C.kf(lt, [[0, -0.01], [dur, 0.01]]), 1.2, t);
    beginCam(ctx);
    bridgeSet(ctx, t);

    // a searchlight sweeps the deck from the far bank
    ctx.save(); ctx.globalAlpha = 0.32;
    spotlight(ctx, 1500 + 220 * Math.sin(t * 0.9), -80, 1100, 34, 360, "#DFF0FF", 0.8, 0.18 * Math.sin(t * 0.9));
    ctx.restore();
    // the helicopter that carries it
    ctx.save(); ctx.translate(1540 + 60 * Math.sin(t * 0.6), 150 + 10 * Math.sin(t * 1.7));
    ctx.fillStyle = "#1E2A36"; ctx.beginPath(); ctx.ellipse(0, 0, 48, 16, 0, 0, TAU); ctx.fill();
    ctx.fillRect(-64, -3, 128, 5);
    ctx.beginPath(); ctx.moveTo(34, -2); ctx.lineTo(78, 4); ctx.lineTo(34, 9); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.rgba("#8AA0B8", 0.5); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-8, -2, 12, 0, TAU); ctx.stroke();
    ctx.restore();

    // the free left arm stays in `stand`; only the cuffed right arm reacts
    const mp = poseAt(lt, [[0, MAN_POSES.stand], [1.2, { ...MAN_POSES.turn, armL: MAN_POSES.stand.armL }], [2.4, { ...MAN_POSES.hand, armL: MAN_POSES.stand.armL }]]);
    const pull = Math.exp(-Math.pow((lt - cuffT) / 0.09, 2));
    mp.armR[0] += pull * 0.9;
    mp.armR[1] += pull * 0.2;
    man(ctx, 720, 900, 1.0, {
      t, pose: mp,
      face: faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [1, 0] } }, { t: 1.2, f: { eyes: "wide", mouth: "o", look: [1, 0] } }, { t: cuffT, f: { eyes: "wide", mouth: "o", look: [0, 0] } }, { t: cuffT + 0.5, f: { eyes: "closed", mouth: "flat", look: [0, 0] } }]),
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });

    // the detective has him by the wrist
    const dp = {
      bounce: 0, sway: 1, lean: -0.02, yaw: -0.15, headTilt: 0.02, headTurn: -0.1,
      armL: [0.25, 0.1], armR: [-0.35, 0.6],
      footL: [-32, -39], footR: [32, -39],
    };
    detective(ctx, 950, 900, 1.0, t, dp, faceAt(lt, [{ t: 0, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }, { t: cuffT - 0.3, f: { eyes: "wide", mouth: "o", look: [-1, 0] } }, { t: cuffT + 0.4, f: { eyes: "narrow", mouth: "flat", look: [-1, 0] } }]));

    // the cuff ring sits on the man's right wrist; the second ring is on the
    // detective's wrist, and the chain connects the two wrists
    const mh = manHand(720, 900, 1.0, mp, "R");
    const dw = [mh[0] + 92, mh[1] - 18];
    // the detective's near sleeve: a bent arm from the shoulder to his wrist
    ctx.save();
    ctx.strokeStyle = "#5A4632"; ctx.lineWidth = 30; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(870, 400); ctx.quadraticCurveTo(882, 492, dw[0], dw[1]); ctx.stroke();
    ctx.strokeStyle = C.rgba(INK, 0.35); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(870, 400); ctx.quadraticCurveTo(882, 492, dw[0], dw[1]); ctx.stroke();
    // his hand closes on the man's forearm, below the wrist cuff
    ctx.save(); ctx.translate(dw[0] - 6, dw[1] + 6); ctx.rotate(1.38);
    hand(ctx, -1, false, "#C98A5A");
    ctx.restore();
    ctx.restore();
    const close = C.ease(C.clamp((lt - cuffT) / 0.28));
    handcuffsPair(ctx, mh[0], mh[1] + 2, dw[0], dw[1] + 2, 0.95, close);
    if (close > 0.9) {
      ctx.save(); ctx.globalAlpha = C.clamp((lt - cuffT) / 0.1) * (1 - C.clamp((lt - cuffT - 0.15) / 0.3));
      ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU;
        ctx.beginPath(); ctx.moveTo(mh[0] + Math.cos(a) * 32, mh[1] + Math.sin(a) * 32);
        ctx.lineTo(mh[0] + Math.cos(a) * 52, mh[1] + Math.sin(a) * 52); ctx.stroke();
      }
      ctx.restore();
    }

    rainStreaks(ctx, t, 40, "#D8E8F8", 0.22, 1.4);

    // foreground bridge rail, for depth and edge
    ctx.fillStyle = "#2A2A32"; ctx.fillRect(0, 980, W, 100);
    ctx.fillStyle = "#4A4A54"; ctx.fillRect(0, 980, W, 12);
    ctx.strokeStyle = "#14141A"; ctx.lineWidth = 8;
    for (let x = 40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 980); ctx.lineTo(x, 1080); ctx.stroke(); }
    ctx.strokeStyle = "#8A8A94"; ctx.lineWidth = 3;
    for (let x = 40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 1006); ctx.quadraticCurveTo(x + 60, 1042, x + 120, 1006); ctx.stroke(); }
    ctx.fillStyle = C.rgba("#FFD27A", 0.14); ctx.fillRect(0, 980, W, 5);

    TY.type(ctx, "DAY 9", 120, 140, 100, {
      color: CREAM, edge: MUSTARD, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 21,
      perChar: (i) => C.clamp((t - 9.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE BRIDGE", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CUFFS CLOSE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
