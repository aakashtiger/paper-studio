import fs from 'node:fs';

// 1. the court and the yard move to s6/s7
fs.copyFileSync('proofs/kpop-crime/shots/s03.js', 'proofs/kpop-crime/shots/s06.js');
fs.copyFileSync('proofs/kpop-crime/shots/s04.js', 'proofs/kpop-crime/shots/s07.js');
let s6 = fs.readFileSync('proofs/kpop-crime/shots/s06.js', 'utf8');
s6 = s6.replace('id: "s3", start: 6.0, end: 9.0, line: 2', 'id: "s6", start: 15.0, end: 18.0, line: 5')
       .replace('t - 6.2 - i * 0.03', 't - 15.2 - i * 0.03');
fs.writeFileSync('proofs/kpop-crime/shots/s06.js', s6);
let s7 = fs.readFileSync('proofs/kpop-crime/shots/s07.js', 'utf8');
s7 = s7.replace('id: "s4", start: 9.0, end: 12.0, line: 3', 'id: "s7", start: 18.0, end: 21.0, line: 6')
       .replace('t - 9.2 - i * 0.03', 't - 18.2 - i * 0.03');
fs.writeFileSync('proofs/kpop-crime/shots/s07.js', s7);

// 2. s3 hideout
fs.writeFileSync('proofs/kpop-crime/shots/s03.js', `/* THE RUN — s3. Day 6, the hideout. */
scene({
  id: "s3", start: 6.0, end: 9.0, line: 2, cast: "MAN",
  draw(t, lt, dur) {
    setCam(C.kf(lt, [[0, 960], [dur, 940]]), C.kf(lt, [[0, 540], [dur, 520]]), C.kf(lt, [[0, 1.02], [dur, 1.08]]), C.kf(lt, [[0, 0.01], [dur, -0.01]]), 1.2, t);
    beginCam(ctx);
    hideoutSet(ctx, t);

    const mp = {
      bounce: 0, sway: 1, lean: 0.05, yaw: 0.25, headTilt: 0.02, headTurn: -0.1,
      armL: [0.6, 0.8], armR: [-0.3, 0.4],
      footL: [-34, -39], footR: [34, -39],
    };
    man(ctx, 760, 900, 1.0, {
      t, pose: mp,
      face: { eyes: "narrow", mouth: "flat", look: [1, 0] },
      costume: "shirt", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });
    paper(ctx, () => roundRectPath(ctx, 520, 636, 180, 40, 3), { fill: "#D9C9A8", edge: PAL.ink, edgeW: 2 });
    TY.text(ctx, "THE RUN", 760, 640, 10, { family: "DMMono", color: PAL.ink, align: "center", letter: 1 });

    TY.type(ctx, "DAY 6", 120, 140, 100, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 19,
      perChar: (i) => C.clamp((t - 6.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE HIDEOUT", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CALENDAR TURNS", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
`);

// 3. s4 arrest
fs.writeFileSync('proofs/kpop-crime/shots/s04.js', `/* THE RUN — s4. Day 9, the bridge. */
scene({
  id: "s4", start: 9.0, end: 12.0, line: 3, cast: "MAN",
  draw(t, lt, dur) {
    setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.04], [dur, 1.0]]), C.kf(lt, [[0, -0.01], [dur, 0.01]]), 1.2, t);
    beginCam(ctx);
    bridgeSet(ctx, t);

    const mp = {
      bounce: 0, sway: 1, lean: 0.02, yaw: 0.1, headTilt: 0.02, headTurn: 0.1,
      armL: [0.2, -0.3], armR: [-0.2, 0.3],
      footL: [-34, -39], footR: [34, -39],
    };
    man(ctx, 720, 900, 1.0, {
      t, pose: mp,
      face: { eyes: "narrow", mouth: "flat", look: [1, 0] },
      costume: "coat", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#D9D2C3", jacket: "#2F3B4A", trouser: "#1B2230", shoe: "#171310", hair: "#171310" },
    });
    const dp = {
      bounce: 0, sway: 1, lean: -0.02, yaw: -0.15, headTilt: 0.02, headTurn: -0.1,
      armL: [0.6, 1.0], armR: [-0.35, 0.6],
      footL: [-32, -39], footR: [32, -39],
    };
    detective(ctx, 1080, 900, 1.0, t, dp, { eyes: "narrow", mouth: "flat", look: [-1, 0] });
    const mh = manHand(720, 900, 1.0, mp, "R");
    handcuffs(ctx, mh[0], mh[1] + 8, 0.9, 0.2);

    TY.type(ctx, "DAY 9", 120, 140, 100, {
      color: CREAM, edge: MUSTARD, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 21,
      perChar: (i) => C.clamp((t - 9.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "THE BRIDGE", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE CUFFS CLOSE", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
`);

// 4. s5 cell
fs.writeFileSync('proofs/kpop-crime/shots/s05.js', `/* THE RUN — s5. Day 10, the cell. */
scene({
  id: "s5", start: 12.0, end: 15.0, line: 4, cast: "MAN",
  draw(t, lt, dur) {
    setCam(C.kf(lt, [[0, 960], [dur, 980]]), C.kf(lt, [[0, 540], [dur, 530]]), C.kf(lt, [[0, 1.0], [dur, 1.05]]), 0, 1.2, t);
    beginCam(ctx);
    cellSet(ctx, t);

    const mp = {
      bounce: 0, sway: 0, lean: 0.02, yaw: 0.1, headTilt: 0.02, headTurn: 0.05,
      armL: [0.2, 0.1], armR: [-0.2, -0.1],
      footL: [-34, -39], footR: [34, -39],
    };
    man(ctx, 760, 900, 1.0, {
      t, pose: mp,
      face: { eyes: "closed", mouth: "flat", look: [0, 0] },
      costume: "prison", stubble: true,
      colors: { skin: "#C98A5A", shirt: "#C9C2B4", jacket: "#2F3B4A", trouser: "#6E6A60", shoe: "#171310", hair: "#171310" },
    });
    const wp = {
      bounce: 0, sway: 1, lean: -0.02, yaw: 0.1, headTilt: 0.02, headTurn: 0.1,
      armL: [0.2, -0.2], armR: [-0.2, 0.2],
      footL: [-34, -39], footR: [34, -39],
    };
    warder(ctx, 1200, 900, 1.0, t, wp, { eyes: "narrow", mouth: "flat", look: [1, 0] });

    TY.type(ctx, "THE CELL", 120, 140, 96, {
      color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3), time: t, charRot: 0.02, jitter: 1, seed: 25,
      perChar: (i) => C.clamp((t - 12.2 - i * 0.03) / 0.3),
    });
    TY.text(ctx, "DAY 10", 124, 192, 18, { family: "DMMono", color: C.rgba(CREAM, 0.75), letter: 3 });
    TY.text(ctx, "THE DAYS ARE LONG", 124, 220, 14, { family: "DMMono", color: C.rgba(CREAM, 0.55), letter: 2 });
    endCam(ctx);
  },
});
`);

console.log('7-shot files written');
