import { readFileSync, writeFileSync } from "node:fs";
const p = "proofs/kpop-test/test-scenes.js";
let s = readFileSync(p, "utf8");
const a = s.indexOf("  /* ---------- 2. 3.68–6.42");
const b = s.indexOf("  /* ---------- 3. 6.42–10.44");
if (a < 0 || b < 0) throw new Error(`markers ${a} ${b}`);
const block = `  /* ---------- 2. 3.68–6.42 — the stage holds its breath, from the audience ---------- */
  scene({
    id: 's2', start: 3.68, end: 6.42, line: 1, cast: 'NOVA',
    draw(t, lt, dur) {
      const step2 = syncLocal('s2', 'novaStep2');
      const starPulse = syncLocal('s2', 'starPulse');
      const miraLook = syncLocal('s2', 'miraLook');
      const stageReveal = syncLocal('s2', 'stageReveal');
      const crowdInhale = syncLocal('s2', 'crowdInhale');
      const novaBreath = syncLocal('s2', 'novaBreath');

      const push = C.ease(C.clamp(lt / dur));
      setCam(960, 540, C.lerp(1.0, 1.06, push), 0, 1.2, t);
      beginCam(ctx);

      // the stage, far away, seen from the audience
      ctx.save();
      ctx.translate(960, 560);
      ctx.scale(0.58, 0.58);
      ctx.translate(-960, -540);
      kpopStage(ctx, t, { starGlow: 0.1 + 0.08 * C.bpmPulse(t, 4), confetti: 10, crowd: false });
      if (lt > starPulse) {
        const p = Math.max(0, Math.sin((lt - starPulse) * 8));
        ctx.save(); ctx.globalAlpha = 0.16 * p;
        ctx.strokeStyle = MUSTARD; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(960, 470, 430 + 10 * p, 0, TAU); ctx.stroke();
        ctx.restore();
      }
      const holdK = C.easeOut(C.clamp((lt - crowdInhale) / 0.5));
      if (holdK > 0) {
        ctx.fillStyle = C.rgba(INK, 0.16 * holdK);
        ctx.fillRect(-300, -300, W + 600, H + 600);
      }
      const lampRot = C.kf(lt, [[0, 0.5], [miraLook, 0.42], [crowdInhale, 0.35], [dur, 0.3]]);
      cueLamp(ctx, 500, 900, 1.8, t, {
        rot: lampRot, glow: 0.8 + 0.2 * C.bpmPulse(t, 3),
        card: 'NOVA', cardOut: 1,
      });
      const nx = 1350 - 60 * C.easeOut(C.clamp(lt / stageReveal));
      const walk = walkPose(IDLE_NOVA, lt, 8.5, 1, 0);
      const np = P(walk, {
        headTilt: 0.04, headTurn: 0.1, hairSwing: 8,
        armL: C.kf(lt, [[0, [0.3, 0.1]], [crowdInhale, [0.3, 0.1]], [novaBreath, [0.25, 0.05]], [dur, [0.25, 0.05]]]),
        armR: C.kf(lt, [[0, [-0.3, -0.1]], [crowdInhale, [-0.3, -0.1]], [novaBreath, [0.25, 1.0]], [dur, [0.25, 1.0]]]),
        footL: [-36, -39], footR: [36, -39],
      });
      contactShadow(ctx, nx, GROUND, 1.05, 58);
      nova(ctx, nx, GROUND, 1.05, t, np, faceAt(lt, [
        { t: 0, f: { eyes: 'wide', mouth: 'o', blush: 0.4, look: [1, -0.1] } },
        { t: stageReveal, f: { eyes: 'normal', mouth: 'flat', blush: 0.35, look: [1, 0] } },
        { t: novaBreath, f: { eyes: 'closed', mouth: 'flat', blush: 0.4, look: [0, 0] } },
      ], { blink: blinkAt(t, 3) }));
      const mp = P(IDLE_MIRA, {
        armL: [-0.1, 0.1], armR: [-0.6, -0.9],
        headTilt: C.kf(lt, [[0, -0.03], [miraLook, 0.05]]),
        headTurn: C.kf(lt, [[0, -0.1], [miraLook, 0.12]]),
        hairSwing: 2,
      });
      contactShadow(ctx, 1550, GROUND, 0.9, 50);
      mira(ctx, 1550, GROUND, 0.9, t, mp, faceAt(lt, [
        { t: 0, f: { eyes: 'normal', mouth: 'flat', blush: 0.3, look: [-1, 0] } },
        { t: miraLook, f: { eyes: 'wide', mouth: 'o', blush: 0.35, look: [1, 0] } },
      ], { blink: blinkAt(t, 4) }));
      const mh = miraHand(1550, GROUND, 0.9, mp, 'R');
      clipboardProp(ctx, mh[0], mh[1] + 72, 0.62, -0.08, t);
      ctx.restore();

      // the audience, in front of the stage
      const rise = 10 * C.easeOut(C.clamp((lt - crowdInhale) / 0.5));
      audienceHead(ctx, 250, 1180 - rise, 1.0, 1, t);
      audienceHead(ctx, 1670, 1180 - rise, 1.0, -1, t);
      audienceHead(ctx, 960, 1220 - rise, 1.1, 1, t);
      playbill(ctx, 250, 920 - rise, 0.9, -0.08, t);
      phoneProp(ctx, 1670, 920 - rise, 0.9, 0.06, t);
      endCam(ctx);

      TY.type(ctx, 'THE STAGE', 150, 190, 110, {
        color: CREAM, edge: TEAL, edgeW: 8, shadow: C.rgba(INK, 0.3),
        time: t, charRot: 0.022, jitter: 1, seed: 9,
        perChar: (i) => C.clamp((t - (3.68 + stageReveal) - i * 0.03) / 0.4),
      });
      TY.type(ctx, 'HOLDS ITS BREATH', 150, 310, 90, {
        color: MUSTARD, edge: INK, edgeW: 7, shadow: C.rgba(INK, 0.25),
        time: t, charRot: 0.022, jitter: 1, seed: 11,
        perChar: (i) => C.clamp((t - (3.68 + crowdInhale) - i * 0.03) / 0.4),
      });
      if (t > 3.68 + crowdInhale) {
        TY.text(ctx, 'THE WHOLE ROOM LEANS IN', 156, 370, 18, { family: 'DMMono', color: C.rgba(CREAM, 0.7), letter: 3 });
      }
    },
  });

`;
s = s.slice(0, a) + block + s.slice(b);
writeFileSync(p, s);
console.log("s2 audience POV rewritten");
