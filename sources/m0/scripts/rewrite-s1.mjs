import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const a = s.indexOf("  /* ---------- 1. 0.00–3.68");
const b = s.indexOf("  /* ---------- 2. 3.68–6.42");
if (a < 0 || b < 0) throw new Error(`markers ${a} ${b}`);
const block = `  /* ---------- 1. 0.00–3.68 — every night the cue lamp calls one name ---------- */
  scene({
    id: 's1', start: 0, end: 3.68, line: 0, cast: 'NOVA',
    draw(t, lt, dur) {
      const lampOn = syncLocal('s1', 'lampOn');
      const crowdSettle = syncLocal('s1', 'crowdSettle');
      const lampTurn = syncLocal('s1', 'lampTurn');
      const beamSweep = syncLocal('s1', 'beamSweep');
      const cardDrop = syncLocal('s1', 'cardDrop');
      const spotNova = syncLocal('s1', 'spotNova');
      const novaStep = syncLocal('s1', 'novaStep');

      // close on the lamp, then pull back to the stage; the pull starts on "cue"
      const pull = C.ease(C.clamp((lt - lampTurn) / 1.2));
      const camX = C.lerp(500, 960, pull);
      const camY = C.lerp(760, 540, pull);
      const camZ = C.lerp(2.2, 1.0, pull);
      setCam(camX, camY, camZ, C.lerp(-0.012, 0.004, pull), 1.5, t);
      beginCam(ctx);
      kpopStage(ctx, t, {
        starGlow: 0.06, confetti: 18, crowd: true,
        crowdY: 1120 - 10 * C.easeOut(C.clamp((lt - crowdSettle) / 0.6)),
      });

      const stepK = C.easeOut(C.clamp((lt - novaStep) / 0.45));
      const nx = 1350 - 150 * stepK;
      const spotK = C.easeOut(C.clamp((lt - spotNova) / 0.22));

      // the stage is dark until the lamp clicks on; then a pool around Nova
      const lampK = C.easeOut(C.clamp((lt - lampOn) / 0.35));
      if (lampK < 1) {
        ctx.fillStyle = C.rgba(INK, 0.62 * (1 - lampK));
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }
      if (spotK > 0) {
        const pool = ctx.createRadialGradient(nx, GROUND - 260, 140, nx, GROUND - 260, 760);
        pool.addColorStop(0, C.rgba(INK, 0));
        pool.addColorStop(0.55, C.rgba(INK, 0.1 * spotK));
        pool.addColorStop(1, C.rgba(INK, 0.62 * spotK));
        ctx.fillStyle = pool;
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }

      // the cue lamp is the subject of the first half
      const headTurn = C.kf(lt, [[0, -0.25], [lampTurn, 0.08], [beamSweep, 0.52], [dur, 0.6]]);
      cueLamp(ctx, 500, 900, 1.8, t, {
        rot: headTurn,
        glow: 0.12 + 0.88 * lampK,
        card: 'NOVA',
        cardOut: C.easeOut(C.clamp((lt - cardDrop) / 0.38)),
      });
      // the beam finds Nova on "one"
      if (spotK > 0) {
        ctx.save(); ctx.globalAlpha = spotK;
        spotlight(ctx, nx, -40, 1200, 24, 300, '#FFF6DC', 0.35, 0);
        ctx.restore();
      }
      // Nova waits in the right wing, then steps into the light on "name"
      const walk = walkPose(IDLE_NOVA, lt, 8.5, 1, 0);
      const np = P(walk, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 8,
        sway: 3, lean: -0.02, headTilt: 0.05, headTurn: 0.12, hairSwing: 8,
        armL: [0.3, 0.1], armR: [-0.35, -0.1],
        footL: [-36, -39], footR: [36, -39],
      });
      contactShadow(ctx, nx, GROUND, 1.05, 58);
      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'narrow', mouth: 'flat', blush: 0.35, look: [1, -0.1] } },
        { t: spotNova, f: { eyes: 'wide', mouth: 'o', blush: 0.45, look: [1, -0.1] } },
        { t: novaStep, f: { eyes: 'happy', mouth: 'sing', blush: 0.55, look: [0, 0], sing: 0.5 } },
      ], { blink: blinkAt(t, 1) }));
      // Mira at the desk; she looks up when the beam finds Nova
      const mp = P(IDLE_MIRA, {
        armL: [0.5, 0.8], armR: [-0.6, -0.9],
        headTilt: C.kf(lt, [[0, -0.03], [spotNova, 0.04]]),
        headTurn: C.kf(lt, [[0, -0.1], [spotNova, 0.08]]),
        hairSwing: 2,
      });
      contactShadow(ctx, 1550, GROUND, 0.9, 50);
      mira(ctx, 1550, GROUND, 0.9, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: spotNova, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 2) }));
      const mh = miraHand(1550, GROUND, 0.9, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 72, 0.62, -0.08, t);
      dust(ctx, t, 36, 3);
      endCam(ctx);

      TY.type(ctx, 'EVERY NIGHT', 120, 230, 140, {
        color: CREAM, edge: CORAL, edgeW: 7, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 5,
        perChar: (i) => C.clamp((t - lampOn - i * 0.03) / 0.28),
      });
      TY.text(ctx, 'A CUE-LAMP STORY', 126, 292, 20, { family: 'DMMono', color: MUSTARD, letter: 4 });
      TY.text(ctx, 'CUE 01', 126, 324, 14, { family: 'DMMono', color: C.rgba(CREAM, 0.6), letter: 2 });
    },
  });

`;
s = s.slice(0, a) + block + s.slice(b);
writeFileSync(p, s);
console.log("s1 rewritten");
