import { readFileSync, writeFileSync } from "node:fs";
const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const a = s.indexOf("  /* ---------- 8. 18.86–20.52");
const b = s.indexOf("  /* ---------- 9. 20.52–24.90");
if (a < 0 || b < 0) throw new Error(`markers ${a} ${b}`);
const block = `  /* ---------- 8. 18.86–20.52 — the lamp called again, in the cue booth ---------- */
  scene({
    id: 's8', start: 18.86, end: 20.52, line: 7, cast: 'MIRA',
    draw(t, lt, dur) {
      const lampTurn2 = syncLocal('s8', 'lampTurn2');
      const miraCard = syncLocal('s8', 'miraCard');
      const miraPoint = syncLocal('s8', 'miraPoint');
      const pan = C.easeOut(C.clamp((lt - lampTurn2) / 0.35));
      setCam(900 + 480 * pan, 540, C.kf(lt, [[0, 1.06], [dur, 1.02]]), 0, 2.2, t);
      beginCam(ctx);
      cueBooth(ctx, t);
      const lampRot = C.kf(lt, [[0, -0.1], [lampTurn2, 0.35], [dur, 0.55]]);
      cueLamp(ctx, 1250, 880, 1.0, t, {
        rot: lampRot, glow: 0.7 + 0.3 * C.bpmPulse(t, 3),
        card: 'MIRA', cardOut: C.easeOut(C.clamp((lt - miraCard) / 0.5)),
      });
      // Nova in the doorway, turning to Mira
      const np = P(IDLE_NOVA, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 8,
        sway: 2, lean: C.kf(lt, [[0, 0.02], [miraCard, -0.04]]),
        headTilt: C.kf(lt, [[0, 0.02], [miraCard, -0.08]]),
        headTurn: C.kf(lt, [[0, 0.12], [miraCard, 0.42]]),
        hairSwing: 7,
        armL: [0.3, 0.2], armR: [-0.4, -0.2],
        footL: [-34, -39], footR: [34, -39],
      });
      contactShadow(ctx, 900, GROUND, 1.1, 58);
      nova(ctx, 900, GROUND, 1.1, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'happy', mouth: 'sing', blush: 0.5, look: [1, 0], sing: 0.5 } },
        { t: miraCard, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [1, 0] } },
      ]));
      // Mira at the desk, looking up and pointing at herself
      const mp = P(IDLE_MIRA, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI + 0.7)) * 8,
        sway: 3, lean: C.kf(lt, [[0, 0.02], [miraCard, -0.03]]),
        headTilt: C.kf(lt, [[0, 0.02], [miraCard, -0.06]]),
        headTurn: C.kf(lt, [[0, -0.12], [miraCard, -0.35]]),
        hairSwing: 4,
        armL: [0.3, 0.1],
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [miraCard, [0.2, 0.8]], [miraPoint, [0.5, 1.4]]]),
        footL: [-28, -8], footR: [29, -8],
      });
      contactShadow(ctx, 1420, GROUND, 1.05, 56);
      mira(ctx, 1420, GROUND, 1.05, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.35, look: [-1, 0] } },
        { t: miraCard, f: { eyes: 'wide', mouth: 'o', blush: 0.5, look: [0, 0] } },
        { t: miraPoint, f: { eyes: 'wide', mouth: 'o', blush: 0.55, look: [0, 0] } },
      ]));
      dust(ctx, t, 26, 25, 0.14);
      endCam(ctx);

      TY.type(ctx, 'THE LAMP', 150, 120, 120, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 47,
        perChar: (i) => C.clamp((t - (18.86 + lampTurn2) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'CALLED AGAIN', 150, 220, 120, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 53,
        perChar: (i) => C.clamp((t - (18.86 + miraCard) - i * 0.03) / 0.4),
      });
      if (lt > miraPoint) {
        const k = C.easeOut(C.clamp((lt - miraPoint) / 0.35));
        ctx.save();
        ctx.translate(1100, 620);
        ctx.rotate(0.06);
        ctx.scale(0.7 + 0.3 * C.backOut(k), 0.7 + 0.3 * C.backOut(k));
        TY.sticker(ctx, 'MIRA', 0, 0, 54, { fill: MUSTARD, text: INK, seed: 9, rot: 0, time: t });
        ctx.restore();
      }
    },
  });

`;
s = s.slice(0, a) + block + s.slice(b);
writeFileSync(p, s);
console.log("s8 cue booth rewritten");
