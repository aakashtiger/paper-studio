import { readFileSync, writeFileSync } from "node:fs";

const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const startMarker = "  /* ---------- 1. 0.00–3.68 — every night the cue lamp calls one name ---------- */";
const endMarker = "  /* ---------- 3. 6.42–10.44 — the wings were empty ---------- */";
const a = s.indexOf(startMarker);
const b = s.indexOf(endMarker);
if (a < 0 || b < 0 || b <= a) throw new Error(`markers not found: ${a} ${b}`);

const opening = `  /* ---------- 1. 0.00–3.68 — every night the cue lamp calls one name ---------- */
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
      const camX = C.lerp(330, 960, pull);
      const camY = C.lerp(690, 540, pull);
      const camZ = C.lerp(1.65, 1.0, pull);
      setCam(camX, camY, camZ, C.lerp(-0.012, 0.004, pull), 1.5, t);
      beginCam(ctx);
      kpopStage(ctx, t, {
        starGlow: 0.06, confetti: 18, crowd: true,
        crowdY: 1120 - 10 * C.easeOut(C.clamp((lt - crowdSettle) / 0.6)),
      });
      // the stage is dark until the lamp clicks on
      const lampK = C.easeOut(C.clamp((lt - lampOn) / 0.35));
      if (lampK < 1) {
        ctx.fillStyle = C.rgba(INK, 0.62 * (1 - lampK));
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }
      // the cue lamp is the subject of the first half
      const headTurn = C.kf(lt, [[0, -0.25], [lampTurn, 0.08], [beamSweep, 0.52], [dur, 0.6]]);
      cueLamp(ctx, 330, 900, 1.3, t, {
        rot: headTurn,
        glow: 0.12 + 0.88 * lampK,
        card: 'NOVA',
        cardOut: C.easeOut(C.clamp((lt - cardDrop) / 0.38)),
      });
      // the beam finds Nova on "one"
      const spotK = C.easeOut(C.clamp((lt - spotNova) / 0.22));
      if (spotK > 0) {
        ctx.save(); ctx.globalAlpha = spotK;
        spotlight(ctx, 1500, -40, 1100, 26, 320, '#FFF6DC', 0.3, 0);
        ctx.restore();
      }
      // Nova waits in the right wing, then steps into the light on "name"
      const stepK = C.easeOut(C.clamp((lt - novaStep) / 0.45));
      const nx = 1500 - 160 * stepK;
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
      contactShadow(ctx, 1600, GROUND, 0.9, 50);
      mira(ctx, 1600, GROUND, 0.9, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: spotNova, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 2) }));
      const mh = miraHand(1600, GROUND, 0.9, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 72, 0.62, -0.08, t);
      dust(ctx, t, 36, 3);
      endCam(ctx);

      TY.type(ctx, 'EVERY NIGHT', 120, 230, 140, {
        color: CREAM, edge: TEAL, edgeW: 9, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.025, jitter: 1, seed: 5,
        perChar: (i) => C.clamp((t - lampOn - i * 0.035) / 0.4),
      });
      TY.text(ctx, 'A CUE-LAMP STORY', 126, 292, 20, { family: 'DMMono', color: MUSTARD, letter: 4 });
      TY.text(ctx, 'CUE 01', 126, 324, 14, { family: 'DMMono', color: C.rgba(CREAM, 0.6), letter: 2 });
    },
  });

  /* ---------- 2. 3.68–6.42 — the stage holds its breath ---------- */
  scene({
    id: 's2', start: 3.68, end: 6.42, line: 1, cast: 'NOVA',
    draw(t, lt, dur) {
      const step2 = syncLocal('s2', 'novaStep2');
      const starPulse = syncLocal('s2', 'starPulse');
      const miraLook = syncLocal('s2', 'miraLook');
      const stageReveal = syncLocal('s2', 'stageReveal');
      const crowdInhale = syncLocal('s2', 'crowdInhale');
      const novaBreath = syncLocal('s2', 'novaBreath');

      const inhale = C.easeOut(C.clamp((lt - crowdInhale) / 0.5));
      const push = C.ease(C.clamp((lt - stageReveal) / (dur - stageReveal)));
      setCam(960, C.lerp(560, 500, push), C.lerp(1.08, 1.0, push), 0, 1.5, t);
      beginCam(ctx);
      kpopStage(ctx, t, {
        starGlow: 0.1 + 0.08 * C.bpmPulse(t, 4),
        confetti: 16, crowd: true,
        crowdY: 1120 - 14 * inhale,
      });
      // the lamp holds on Nova
      const lampRot = C.kf(lt, [[0, 0.5], [miraLook, 0.42], [crowdInhale, 0.35], [dur, 0.3]]);
      cueLamp(ctx, 330, 900, 1.05, t, {
        rot: lampRot, glow: 0.8 + 0.2 * C.bpmPulse(t, 3),
        card: 'NOVA', cardOut: 1,
      });
      // Nova walks from 1340 to 1180 on "every", stops on "stage"
      const walkK = C.easeOut(C.clamp((lt - step2) / (stageReveal - step2)));
      const nx = 1340 - 160 * walkK;
      const walk = walkPose(IDLE_NOVA, lt, 8.5, 1, 0);
      const np = P(walk, {
        bounce: -Math.abs(Math.sin(C.beat(t) * Math.PI)) * 7,
        sway: 3, lean: -0.02, headTilt: 0.04, headTurn: 0.1, hairSwing: 8,
        armL: C.kf(lt, [[0, [0.3, 0.1]], [novaBreath, [0.9, 0.8]], [dur, [0.95, 1.0]]]),
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [novaBreath, [-0.9, -0.8]], [dur, [-0.95, -1.0]]]),
        footL: [-36, -39], footR: [36, -39],
      });
      contactShadow(ctx, nx, GROUND, 1.05, 58);
      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [1, -0.1] } },
        { t: stageReveal, f: { eyes: 'normal', mouth: 'flat', blush: 0.35, look: [1, 0] } },
        { t: novaBreath, f: { eyes: 'closed', mouth: 'flat', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 3) }));
      // Mira looks up on "the"
      const mp = P(IDLE_MIRA, {
        armL: [0.5, 0.8], armR: [-0.6, -0.9],
        headTilt: C.kf(lt, [[0, -0.03], [miraLook, 0.05]]),
        headTurn: C.kf(lt, [[0, -0.1], [miraLook, 0.12]]),
        hairSwing: 2,
      });
      contactShadow(ctx, 1500, GROUND, 0.95, 54);
      mira(ctx, 1500, GROUND, 0.95, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: miraLook, f: { eyes: 'wide', mouth: 'o', blush: 0.35, look: [1, 0] } },
      ], { blink: blinkAt(t, 4) }));
      const mh = miraHand(1500, GROUND, 0.95, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 78, 0.7, -0.08, t);
      // the stage star pulses on "night"
      if (lt > starPulse) {
        const pulse = Math.max(0, Math.sin((lt - starPulse) * 8));
        ctx.save(); ctx.globalAlpha = 0.16 * pulse;
        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(960, 470, 430 + 10 * pulse, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      dust(ctx, t, 42, 5);
      endCam(ctx);

      TY.type(ctx, 'THE STAGE', 120, 190, 110, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 9,
        perChar: (i) => C.clamp((t - (3.68 + stageReveal) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'HOLDS ITS BREATH', 120, 310, 90, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 11,
        perChar: (i) => C.clamp((t - (3.68 + crowdInhale) - i * 0.03) / 0.4),
      });
      if (t > 3.68 + crowdInhale) {
        TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 126, 370, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });
      }
    },
  });

`;

s = s.slice(0, a) + opening + s.slice(b);
writeFileSync(p, s);
console.log("opening rewritten", a, b, "->", opening.length);
