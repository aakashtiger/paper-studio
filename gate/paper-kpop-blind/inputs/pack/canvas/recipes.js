/* Paper K-pop canvas recipes — owned by the style pack, not by a film.
 *
 * Each entry draws one recipe from the score: the shot supplies the slots, the
 * style supplies the look. `painter.js` in the film maps `shot.recipe` here, so
 * a second paper film reuses this file unchanged.
 */



function bgPaper() {
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(0, 0, W, H);
}

/* ---- type on a 1920 frame ------------------------------------------------
 *
 * `tokens.type.scale` is authored for a 390 px frame, and STYLE.md says larger
 * frames scale proportionally ("the 14 px floor holds"). The recipes used to set
 * a 1920 frame at the 390 px numbers, so every caption and label landed at 3-5
 * px at phone scale — below the pack's own floor — and the film's two must-say
 * lines were its smallest type. `TS` is that proportional step; `fitSize` keeps
 * a line inside its paper.
 */
function TS(px) {
  return Math.round(px * (W / 390));
}

/**
 * The size that puts a string inside `maxW` at the pack's own type scale.
 *
 * It measures with `TY.width`, the same per-character measure the draw uses. A
 * whole-string `measureText` ignores the tracking and the measured fallback
 * metrics, which is how a caption was drawn ~100 px wider than the card it sat
 * on. A string that cannot be set at the pack's floor inside the box is not
 * drawn smaller than the floor: the floor holds and `wrapLines` breaks it.
 */
function fitSize(str, maxW, size, family, track = 0) {
  const width = TY.width(ctx, str, size, family || "Anton", "400", track);
  if (width <= maxW) return size;
  return Math.max(TS(14), Math.floor((size * maxW) / Math.max(1, width)));
}

/** Greedy word wrap against the same measure `fitSize` used. */
function wrapLines(str, maxW, size, family, track = 0) {
  const words = String(str || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const measure = (line) => TY.width(ctx, line, size, family || "Anton", "400", track);
  const widthOf = (slice) => measure(slice.join(" "));
  if (widthOf(words) <= maxW) return [words.join(" ")];
  // Two balanced lines read better than a greedy break that leaves one word
  // alone on the second line, which is what a caption should never do.
  let best = null;
  for (let k = 1; k < words.length; k += 1) {
    const left = widthOf(words.slice(0, k));
    const right = widthOf(words.slice(k));
    if (left > maxW || right > maxW) continue;
    const balance = Math.abs(left - right);
    if (best === null || balance < best.balance) best = { k, balance };
  }
  if (best !== null) {
    return [words.slice(0, best.k).join(" "), words.slice(best.k).join(" ")];
  }
  const fits = (line) => measure(line) <= maxW;
  const lines = [];
  let line = words[0];
  for (const word of words.slice(1)) {
    const next = `${line} ${word}`;
    if (fits(next)) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  return lines;
}

function libFor(name) {
  if (!window.POSES) return null;
  const key = Object.keys(window.POSES).find((k) => name.toLowerCase().includes(k.toLowerCase().split(" ")[0]));
  return key ? window.POSES[key] : null;
}

function clonePose(params) {
  const out = {};
  for (const [key, value] of Object.entries(params || {})) {
    out[key] = Array.isArray(value) ? value.slice() : value;
  }
  return out;
}

function poseFor(name, poseName) {
  const lib = libFor(name);
  if (!lib) return {};
  const pose = lib.poses.find((p) => p.name === poseName);
  // No silent fallback to the first pose: a misspelled or missing pose used to
  // leave a character standing in `idle` for a whole shot, which looks like a
  // directorial choice and is not one. The resolver rejects an unknown pose
  // before the render; this makes a hand-edited score loud too.
  if (!pose) {
    throw new Error(
      `pose "${poseName}" is not in ${lib.character || name}'s library (has: ${lib.poses.map((p) => p.name).join(", ")})`,
    );
  }
  // Always a copy: callers adjust poses (headTurn, sway). Returning the live
  // library object let those adjustments accumulate across frames, so the same
  // time painted differently depending on how many frames came before it.
  return clonePose(pose.params);
}

/* ---- what the score directs ------------------------------------------
 *
 * The score owns *who* is in a frame, *what they do* and *how the camera
 * moves*; the pack owns the composition and the look. Before this, every
 * recipe hardcoded its cast, its poses and its camera, so the score's
 * `direction` and `camera` were prose that nothing honoured — a film could not
 * be re-directed without editing the style pack.
 */

/** The people this shot contains. No `cast` on the shot = the recipe's own. */
function shotCast(shot, fallback) {
  const cast = shot && shot.direction && shot.direction.cast;
  if (!Array.isArray(cast)) return fallback.slice();
  return cast.map((who) => String(who).toLowerCase());
}

function hasCast(shot, fallback, name) {
  return shotCast(shot, fallback).includes(String(name).toLowerCase());
}

/**
 * A character's performance for this shot, from the score's pose events: each
 * one is a keyframe, `breakdown` is the pose it comes *from* (the anticipation
 * before the change). No events = no invented performance; the character holds
 * `entry` and the living hold does the breathing.
 */
function scoreKeys(shot, name, d, entry) {
  const events = (shot && shot.direction && shot.direction.events) || [];
  const mine = events
    .filter((e) => e.kind === "pose" && String(e.who || "").toLowerCase() === String(name).toLowerCase())
    .sort((a, b) => a.t - b.t);
  const keys = [];
  for (const event of mine) {
    if (event.breakdown) keys.push({ t: Math.max(0, event.t - 0.08), pose: event.breakdown });
    keys.push({ t: event.t, pose: event.pose });
  }
  if (!keys.length) return [{ t: 0, pose: entry || "idle" }, { t: d, pose: entry || "idle" }];
  if (keys[0].t > 0) keys.unshift({ t: 0, pose: entry || "idle" });
  return keys;
}

/** The time the score gives an event of `kind`, or null if it does not. */
function eventTime(shot, kind) {
  const event = ((shot && shot.direction && shot.direction.events) || []).find((e) => e.kind === kind);
  return event ? event.t : null;
}

/**
 * The shot's camera, from the score: `from`/`to` are zoom multipliers, `move`
 * is the path (push, pull, orbit, pan, hold), `ease` is the shape. `x`/`y` and
 * `tilt` are the recipe's own composition.
 */
function shotCam(shot, lt, d, x, y, tilt, t) {
  const cam = (shot && shot.camera) || {};
  const from = Number.isFinite(cam.from) ? cam.from : 1;
  const to = cam.move === "hold" ? from : Number.isFinite(cam.to) ? cam.to : from;
  const k = C.smooth(C.clamp(lt / Math.max(1e-4, d)));
  const drift = cam.move === "orbit" ? Math.sin(lt * 0.55) * 14 : cam.move === "pan" ? (k - 0.5) * 46 : 0;
  const rot = cam.move === "orbit" ? Math.sin(lt * 0.45) * 0.006 : cam.move === "hold" ? 0 : Math.sin(lt * 0.5) * 0.004;
  setCam(x + drift, y, from + (to - from) * k, rot, tilt, t);
}

function colorsFor(name) {
  const lib = libFor(name);
  if (!lib) return {};
  const colors = {};
  for (const [key, value] of Object.entries(lib.colors)) colors[key] = PAL[value] || value;
  return colors;
}

function drawCharacter(name, x, y, scale, poseName, flip, poseOverride, time) {
  const pose = livingPose(poseOverride || poseFor(name, poseName), time || 0, 1);
  const colors = colorsFor(name);
  const t = time || 0;
  if (/mira/i.test(name)) {
    mira(ctx, x, y, scale, { pose, ...colors, flip: flip || 1, shadow: 1, t });
  } else {
    idol(ctx, x, y, scale, {
      pose, outfit: "stage", colors, flip: flip || 1,
      t, petals: 0, earrings: true, shadow: 1,
    });
  }
}

function blendValue(a, b, k) {
  if (typeof a === "number" && typeof b === "number") return a + (b - a) * k;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((value, index) =>
      typeof value === "number" && typeof b[index] === "number"
        ? value + (b[index] - value) * k
        : k < 0.5 ? value : b[index],
    );
  }
  return k < 0.5 ? a : b;
}

function blendPose(a, b, k) {
  const out = {};
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const key of keys) out[key] = blendValue(a ? a[key] : undefined, b ? b[key] : undefined, k);
  return out;
}

function poseAt(name, keys, lt) {
  if (!keys.length) return poseFor(name, "idle");
  if (lt <= keys[0].t) return poseFor(name, keys[0].pose);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (lt >= a.t && lt <= b.t) {
      const k = C.smooth(C.clamp((lt - a.t) / Math.max(1e-4, b.t - a.t)));
      return blendPose(poseFor(name, a.pose), poseFor(name, b.pose), k);
    }
  }
  return poseFor(name, keys[keys.length - 1].pose);
}

/**
 * Living hold: a pose is never frozen. The hips breathe and shift, the head
 * leads, the hair follows. Feet stay on their IK targets, so the knees take
 * the weight change.
 */
function livingPose(pose, t, amp = 1) {
  const p = { ...pose };
  p.sway = (p.sway || 0) + Math.sin(t * 1.25) * 2.6 * amp;
  p.bounce = (p.bounce || 0) + Math.sin(t * 2.1 + 0.7) * 2.2 * amp;
  p.headTurn = (p.headTurn || 0) + Math.sin(t * 0.85) * 0.018 * amp;
  p.headTilt = (p.headTilt || 0) + Math.sin(t * 1.7 + 1.2) * 0.012 * amp;
  p.hairSwing = (p.hairSwing || 0) + Math.sin(t * 1.05) * 2.2 * amp;
  return p;
}

function cueLamp(x, y, scale, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const g = ctx.createRadialGradient(0, 10, 0, 0, 10, 210);
  g.addColorStop(0, C.rgba(PAL.goldL, 0.55));
  g.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-280, -280, 560, 560);
  spotlight(ctx, 0, 4, 540, 30, 260, "#FFF4D8", 0.22, -0.12);
  // torn paper shade, narrow at the top and wide at the lip
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-54, -96);
    ctx.lineTo(52, -92);
    ctx.lineTo(76, -12);
    ctx.lineTo(-72, -16);
    ctx.closePath();
  }, {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.5,
    shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 9,
  });
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(-46, -80, 32, 15);
  ctx.fillStyle = PAL.ink;
  ctx.font = "10px DMMono";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CUE", -30, -72);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  // bulb under the shade
  ctx.save();
  const halo = ctx.createRadialGradient(0, 18, 0, 0, 18, 190);
  const flick = 0.55 + 0.08 * Math.sin(t * 9.1) + 0.04 * Math.sin(t * 23.7);
  halo.addColorStop(0, C.rgba(PAL.goldL, flick));
  halo.addColorStop(0.45, C.rgba(PAL.goldL, 0.22));
  halo.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(-200, -180, 400, 400);
  ctx.restore();
  paper(ctx, () => blobPath(ctx, 0, 18, 33, 33, 17, 0.02, 4), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.2), sx: 2, sy: 4,
  });
  ctx.fillStyle = C.rgba("#FFF7E4", 0.7);
  ctx.beginPath();
  ctx.arc(-10, 8, 9, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(0, 44);
  ctx.stroke();
  // stem and base
  ctx.fillStyle = C.rgba(PAL.ink, 0.8);
  ctx.fillRect(-4, 44, 8, 60);
  paper(ctx, () => roundRectPath(ctx, -46, 100, 92, 12, 5), {
    fill: PAL.ink, edge: null, shadow: C.rgba(PAL.ink, 0.24), sx: 2, sy: 4,
  });
  ctx.restore();
}

function paperOpen(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  shotCam(shot, lt, d, W / 2, 500, 0.6, t);
  beginCam(ctx);
  sunburst(ctx, W / 2, 470, 120, 630, 30, PAL.gold, PAL.paper2, lt * 0.32, 0.95);
  const coreIn = C.backOut(C.clamp(lt / 0.55));
  paper(ctx, () => blobPath(ctx, W / 2, 500, 172 * coreIn, 172 * coreIn, 64, 0.008, 8), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.35), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 7, sy: 10,
  });

  const title = shot.slots["content.title"] || "THE UNDERSTUDY";
  const titleIn = C.clamp((lt - 0.2) / 0.4);
  ctx.save();
  ctx.translate(0, (1 - C.backOut(titleIn)) * -60);
  TY.type(ctx, title, W / 2, 300, fitSize(title, W - 380, TS(64)), {
    copy: true,
    align: "center", color: PAL.ink, edge: PAL.cream, edgeW: 14,
    shadow: C.rgba(PAL.ink, 0.3), shadowOff: 9, time: t, seed: 7,
    charRot: 0.02,
    perChar: (i) => C.backOut(C.clamp((lt - 0.2 - i * 0.03) / 0.34)),
  });
  ctx.restore();

  const subtitle = shot.slots["content.subtitle"] || "";
  const tab = C.seg(lt, 0.7, 1.1);
  if (subtitle && tab > 0) {
    ctx.save();
    ctx.globalAlpha = tab;
    paper(ctx, () => tornRectPath(ctx, W / 2 - 560, 770, 1120, 130, 3, 23), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.22), sx: 5, sy: 8,
    });
    TY.text(ctx, subtitle, W / 2, 856, fitSize(subtitle, 1040, TS(18), "DMMono", 3), {
      copy: true,
      family: "DMMono", color: PAL.ink, align: "center", letter: 3,
    });
    ctx.restore();
  }

  paper(ctx, () => tornRectPath(ctx, 1450, 356, 320, 18, 4, 19), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 10,
  });
  cueLamp(W - 330, 250, 1, t);
  endCam(ctx);
  if (lt > 1.5) paperShards(ctx, W / 2, 500, lt, 24, [PAL.cream, PAL.gold, PAL.red], 520, C.clamp(1 - (lt - 1.5) / 0.7), 8);
  if (lt > 1.8) {
    const iris = Math.max(1, (1 - C.inv(1.8, d, lt)) * 1300);
    irisOverlay(ctx, W / 2, 500, iris, PAL.red, 80);
  }
}

function portrait(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  const name = shot.slots["content.names"] || "NOVA";
  const caption = shot.slots["content.caption"] || "THE STAR";
  const miraShot = /mira/i.test(name);
  // The performance comes from the score's pose events. A portrait with no pose
  // events is a held portrait — not the two-shot the recipe used to invent.
  const pose = poseAt(name, scoreKeys(shot, name, d, "idle"), lt);
  shotCam(shot, lt, d, W / 2, 520, 0.5, t);
  beginCam(ctx);
  sunburst(ctx, W / 2, 480, 180, 700, 28, PAL.gold, PAL.paper2, lt * 0.18, 0.85);

  paper(ctx, () => tornRectPath(ctx, 620, 110, 880, 860, 10, 11), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.5), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
  });
  paper(ctx, () => tornRectPath(ctx, 650, 140, 820, 800, 7, 21), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.35), edgeW: 2,
  });
  halftone(ctx, 680, 170, 760, 740, PAL.ink, 22, 0.5, 0.13);

  if (miraShot) {
    spotlight(ctx, 1120, -90, 1060, 90, 640, "#F2B33A", 0.16, 0.16);
    spotlight(ctx, 1120, -70, 1040, 40, 520, "#F2B33A", 0.38, 0.16);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = C.rgba(PAL.gold, 0.9);
    ctx.beginPath();
    ctx.ellipse(W / 2, 900, 260, 32, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  } else {
    cueLamp(1320, 488, 1.15, t);
  }

  // Both portraits are framed the same way: the figure is cut at the hem by the
  // bottom of the frame, so the film never shows a rig's knees. Mira's face was
  // 25 px nearer the camera and 12.5 % smaller than Nova's.
  if (hasCast(shot, [name], name)) {
    drawCharacter(name, 1000, 1160, 1.30, "idle", miraShot ? -1 : 1, pose, t);
  }
  endCam(ctx);

  paper(ctx, () => tornRectPath(ctx, 56, 120, 780, 380, 6, 17), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
  });
  TY.type(ctx, name, 116, 316, fitSize(name, 680, TS(64)), {
    copy: true,
    align: "left", color: PAL.ink, edge: PAL.cream, edgeW: 8,
    shadow: null, time: t, seed: 5,
    charRot: 0.02,
  });
  TY.text(ctx, caption, 120, 428, fitSize(caption, 680, TS(18), "DMMono", 3), {
    copy: true,
    family: "DMMono", color: PAL.red, letter: 3,
  });
  if (lt > d - 0.4) paperShards(ctx, W / 2, 700, lt, 18, [PAL.cream, PAL.gold, PAL.red], 480, C.clamp(1 - (lt - (d - 0.4)) / 0.4), 5);
}

function stage(shot, lt, t) {
  const d = shot.duration;
  const body = shot.slots["content.body"] || "";
  // Who is on stage, and what they do, is the score's decision — not the caption
  // text's. This used to branch on /TWO/ and /LIGHT/ inside the body line, so
  // renaming a card silently re-cast the shot.
  const cast = shotCast(shot, ["Nova", "Mira"]);
  const nova = hasCast(shot, ["Nova", "Mira"], "Nova");
  const mira = hasCast(shot, ["Nova", "Mira"], "Mira");
  const solo = nova !== mira;
  const both = nova && mira;
  const confettiAt = eventTime(shot, "confetti");
  const crowdRise = both ? 0 : 1 - C.smooth(C.clamp((lt - Math.max(0.2, (confettiAt ?? 1.4) - 0.6)) / 0.6));
  const pulse = Math.exp(-C.frac(C.beat(t)) * 6);
  shotCam(shot, lt, d, W / 2, 520, 0.7, t);
  beginCam(ctx);
  stageSet(ctx, t, {
    sky: PAL.redD, sun: PAL.gold, floor: PAL.blue, accent: PAL.cream,
    crowd: true, crowdY: 1052 + crowdRise * 220,
    // The confetti starts when the score says it starts. A shot that never
    // declares confetti gets none, instead of a paper storm from frame one.
    confetti: 0, rot: lt * 0.03,
  });
  if (confettiAt !== null) {
    const fall = C.smooth(C.clamp((lt - confettiAt) / 0.3));
    if (fall > 0) {
      ctx.save();
      confetti(ctx, Math.max(0, lt - confettiAt), 40, [PAL.cream, PAL.gold, PAL.blue, PAL.red], fall);
      ctx.restore();
    }
  }

  let poseA = nova ? poseAt("Nova", scoreKeys(shot, "Nova", d, "idle"), lt) : null;
  let poseB = mira ? poseAt("Mira", scoreKeys(shot, "Mira", d, "idle"), lt) : null;
  // A beat pulse is a knee-driven sink, not a body lift; it is added to every
  // pose so the feet stay planted on their own shadows.
  const bob = Math.abs(Math.sin(C.frac(C.beat(t)) * Math.PI)) * 10;

  // Composition follows the cast: a solo figure owns the left of the stage and
  // the title card the right, a pair stands as a pair on the left. The cast has
  // to clear the card: a full-body performer is 800 px tall in a 1080 frame, so
  // a card in the top corner is over a head unless the body is composed left.
  const formation = both ? C.smooth(C.clamp((lt - Math.max(0.2, d * 0.55)) / 0.5)) : 0;
  const novaX = solo ? 560 : 300 + 220 * C.smooth(C.clamp((lt - 0.3) / 0.9)) + formation * 55;
  const miraX = solo ? 560 : 800 - formation * 35;
  const novaScale = both ? 1.1 : 1.18;
  const miraScale = both ? 1.1 : 1.18;
  // One shadow per performer, drawn by the character rig itself.
  if (nova) drawCharacter("Nova", novaX, 960, novaScale, "idle", 1, { ...poseA, bounce: (poseA.bounce || 0) + bob }, t);
  if (mira) drawCharacter("Mira", miraX, 985, miraScale, "idle", -1, { ...poseB, bounce: (poseB.bounce || 0) + bob }, t);
  endCam(ctx);

  // The body card lands as soon as the shot has room for it, not only in its
  // last 1.8 s: on a 5 s wide that left the top third empty for two thirds of
  // the shot.
  //
  // It is a **screen-space layer**, drawn after the camera closes. Inside the
  // camera a 16% orbit scaled the card past the top edge and dragged the
  // caption off the right one; a title is read at the frame, so it is laid out
  // at the frame. The box sits inside the pack's 64 px margin and the type is
  // measured against it, so nothing can run off the paper.
  if (shot.slots["content.body"] && d >= 1.2) {
    const landAt = Math.min(d - 1.0, Math.max(0.4, d * 0.35));
    const land = C.clamp(C.backOut(C.clamp((lt - landAt) / 0.5)));
    if (land > 0) {
      const boxX = 880;
      const boxY = 64;
      const boxW = 940;
      const boxH = 344;
      const pad = 44;
      const innerW = boxW - pad * 2;
      const body = shot.slots["content.body"];
      const caption = shot.slots["content.caption"] || "";
      const bodySize = fitSize(body, innerW, TS(26));
      const capSize = fitSize(caption, innerW, TS(18), "DMMono", 3);
      const capLines = wrapLines(caption, innerW, capSize, "DMMono", 3);
      ctx.save();
      ctx.globalAlpha = land;
      ctx.translate((1 - land) * 90, 0);
      paper(ctx, () => tornRectPath(ctx, boxX, boxY, boxW, boxH, 6, 9), {
        fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.22), sx: 4, sy: 8,
      });
      TY.type(ctx, body, boxX + pad + 16, boxY + 104, bodySize, {
        copy: true,
        align: "left", color: PAL.ink, edge: null, edgeW: 0, shadow: null, time: t, seed: 3,
        alpha: land,
      });
      // The caption is information, so it is set at the pack's floor for a
      // 1920 frame (69 px = the 14 px floor at 390), not at 14 px.
      capLines.forEach((line, index) =>
        TY.text(ctx, line, boxX + pad + 18, boxY + 214 + index * Math.round(capSize * 1.35), capSize, {
          copy: true,
          family: "DMMono", color: C.rgba(PAL.ink, 0.78), letter: 3, alpha: land,
        }),
      );
      ctx.restore();
    }
  }
  if (pulse > 0.7) {
    ctx.save(); ctx.globalAlpha = (pulse - 0.7) * 0.12; ctx.fillStyle = PAL.gold; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
}
function sticker(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  shotCam(shot, lt, d, W / 2, 500, 0, t);
  beginCam(ctx);
  paper(ctx, () => tornRectPath(ctx, 90, 78, W - 180, H - 156, 12, 31), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.45), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.25), sx: 0, sy: 0,
  });
  halftone(ctx, 120, 110, W - 240, H - 220, PAL.ink, 20, 0.5, 0.2);
  comicBurst(ctx, "", W / 2, 470, 340, PAL.gold, PAL.ink, -0.05, { n: 20, squash: 0.72, edgeW: 0 });
  if (lt > 0.2) paperShards(ctx, W / 2, 500, lt, 30, [PAL.cream, PAL.gold, PAL.red], 720, C.clamp(1 - (lt - 0.2) / 1.2), 9);
  const settle = C.clamp((lt - 0.03) / 0.42);
  const hit = C.backOut(settle);
  // The slam overshoots, and the overshoot is bounded by the safe area: at the
  // largest scale the label was 2,080 px wide in a 1,920 px frame, so the film's
  // own words ran off both edges for the first third of a second. The punch is
  // the speed of the settle, not the size of the first frame.
  const scale = 1.24 - 0.24 * hit;
  const wobble = Math.sin(settle * Math.PI * 3) * 0.05 * (1 - settle);
  ctx.save();
  ctx.translate(W / 2, 500);
  ctx.rotate(-0.045 + 0.015 * Math.sin(lt * 1.8) + 0.03 * (1 - settle));
  ctx.scale(scale * (1 + wobble), scale * (1 - wobble));
  TY.sticker(ctx, shot.slots["content.body"] || "NO NOVA", 0, 0, fitSize(shot.slots["content.body"] || "NO NOVA", 1240, TS(64), "Archivo Black"), {
    copy: true,
    fill: PAL.cream, text: PAL.ink, rot: 0, seed: 5, barcode: true, tape: true,
    textShadow: C.rgba(PAL.ink, 0.18),
  });
  ctx.restore();
  endCam(ctx);
  if (lt > 0.2 && lt < 0.45) flash(ctx, (lt - 0.2) * 4, "#FFF7E4");
}

function paperHand(x, y, s, rot, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  paper(ctx, () => roundRectPath(ctx, 30, -42, 820, 84, 22), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 6, sy: 10,
  });
  paper(ctx, () => roundRectPath(ctx, 0, -50, 38, 100, 8), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5,
  });
  // palm
  paper(ctx, () => roundRectPath(ctx, -14, -38, 66, 76, 24), {
    fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.5), edgeW: 2.5,
    shadow: C.rgba(PAL.ink, 0.18), sx: 3, sy: 6,
  });
  // four fingers fan toward the lamp
  for (let i = 0; i < 4; i++) {
    const fy = -30 + i * 20;
    const len = 46 - Math.abs(i - 1.5) * 6;
    paper(ctx, () => roundRectPath(ctx, -12 - len, fy - 8, len + 18, 16, 8), {
      fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.45), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.14), sx: 2, sy: 4,
    });
  }
  // thumb
  ctx.save();
  ctx.translate(-4, 34);
  ctx.rotate(0.5);
  paper(ctx, () => roundRectPath(ctx, -48, -9, 58, 18, 9), {
    fill: "#F0C9A4", edge: C.rgba(PAL.ink, 0.45), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.14), sx: 2, sy: 4,
  });
  ctx.restore();
  ctx.restore();
}

function macro(shot, lt, t) {
  bgPaper();
  const d = shot.duration;
  // The hand enters and misses on the score's own events, not on a constant
  // typed into the recipe.
  const handAt = eventTime(shot, "hand") ?? 0.7;
  const missAt = eventTime(shot, "miss") ?? handAt + 0.85;
  shotCam(shot, lt, d, W / 2 + 30, 520, 0.4, t);
  beginCam(ctx);
  paper(ctx, () => tornRectPath(ctx, 60, 60, W - 120, H - 120, 16, 17), {
    fill: PAL.paper2, edge: C.rgba(PAL.ink, 0.35), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.2), sx: 10, sy: 14,
  });
  halftone(ctx, 90, 90, 560, 520, PAL.ink, 26, 0.5, 0.09);
  halftone(ctx, 1270, 90, 560, 520, PAL.ink, 26, 0.5, 0.07);
  paper(ctx, () => tornRectPath(ctx, 120, 896, 1680, 28, 5, 13), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 12,
  });

  const swing = -0.05 + Math.sin(lt * 4.2) * 0.12 * Math.exp(-lt * 0.55) + Math.sin(lt * 1.3) * 0.018;
  ctx.save();
  ctx.translate(W / 2 + 20, 560);
  ctx.rotate(swing);
  ctx.scale(3.2, 3.2);
  cueLamp(0, 0, 1, t);
  ctx.restore();

  const enter = C.smooth(C.clamp((lt - handAt) / 0.35));
  if (enter > 0) {
    const retreat = C.smooth(C.clamp((lt - (missAt + 0.5)) / 0.5));
    const handIn = enter * (1 - 0.55 * retreat);
    paperHand(1140 + (1 - handIn) * 260, 604, 1.4, -0.12, enter);
  }

  if (lt > 1.5) {
    const tear = C.smooth(C.clamp((lt - 1.5) / 0.4));
    ctx.save();
    ctx.translate(W / 2 + 200 + tear * 170, 430 - tear * 70);
    ctx.rotate(-0.18 + tear * 0.8);
    paper(ctx, () => tornRectPath(ctx, 0, 0, 150 * (0.6 + 0.4 * tear), 34, 4, 7), {
      fill: PAL.cream, edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 8,
    });
    ctx.restore();
    paperShards(ctx, 1050, 460, lt, 18, [PAL.cream, PAL.red, PAL.gold], 460, C.clamp(1 - (lt - 1.5) / 0.6), 6);
  }

  // The title is a screen-space layer: drawn after the camera closes so the
  // zoom cannot push it toward the frame edge, and it holds still while the
  // lamp breathes.
  endCam(ctx);
  TY.type(ctx, shot.slots["content.caption"] || "THE CUE LAMP", 132, 838, fitSize(shot.slots["content.caption"] || "THE CUE LAMP", 900, TS(26)), {
    copy: true,
    align: "left", color: PAL.ink, edge: PAL.cream, edgeW: 7,
    shadow: C.rgba(PAL.ink, 0.2), shadowOff: 5, time: t, seed: 9,
  });
  if (lt > d - 0.3) paperShards(ctx, W / 2, 500, lt, 16, [PAL.cream, PAL.gold], 420, C.clamp(1 - (lt - (d - 0.3)) / 0.3), 4);
}

function pullback(shot, lt, t) {
  const d = shot.duration;
  const cast = shotCast(shot, ["Nova", "Mira"]);
  shotCam(shot, lt, d, W / 2, 540, 0.6, t);
  beginCam(ctx);
  stageSet(ctx, t, {
    sky: PAL.redD, sun: PAL.gold, floor: PAL.blue, accent: PAL.cream,
    crowd: true, confetti: 44, confettiCols: [PAL.cream, PAL.gold, PAL.blue, PAL.red],
    rot: lt * 0.02,
  });
  // The bow is a pose the score asks for, and it is drawn by the rig that owns
  // the spine: leaning, with the knees taking the weight. It used to be a
  // vertical squash of the cut-outs with the lean overridden to 1 degree, which
  // PRODUCTION-PLAN bans by name ("do not fake them with a squash").
  const novaPose = poseAt("Nova", scoreKeys(shot, "Nova", d, "idle"), lt);
  const miraPose = poseAt("Mira", scoreKeys(shot, "Mira", d, "idle"), lt);
  // The pair stands as a pair, with room between them: at 280 px apart the two
  // cut-outs overlapped, and Mira's head sat on Nova's shoulder in the last shot
  // of the film. 400 px puts a gap between the bodies and still leaves the right
  // half clear for the end card.
  if (cast.includes("nova")) drawCharacter("Nova", 460, 960, 1.04, "idle", 1, novaPose, t);
  if (cast.includes("mira")) drawCharacter("Mira", 860, 985, 1.04, "idle", -1, miraPose, t);
  endCam(ctx);

  // The end card is a screen-space layer: drawn after the camera closes, inside
  // the 16:9 safe margin (x <= 1804, y >= 64), so the pull-back cannot drag it
  // off the top-right corner. Its body line is measured against the card, not
  // against a guessed fraction of it.
  if (lt > 1.2) {
    const land = C.clamp(C.backOut(C.clamp((lt - 1.2) / 0.5)));
    if (land > 0) {
      const boxX = 1000;
      const boxY = 64;
      const boxW = 830;
      const boxH = 300;
      const midX = boxX + boxW / 2;
      const innerW = boxW - 90;
      const body = shot.slots["content.body"] || "THE UNDERSTUDY";
      const bodySize = fitSize(body, innerW, TS(18), "DMMono", 2);
      ctx.save();
      ctx.globalAlpha = land;
      ctx.translate(0, (1 - land) * 40);
      paper(ctx, () => tornRectPath(ctx, boxX, boxY, boxW, boxH, 6, 23), {
        fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
      });
      TY.type(ctx, shot.slots["content.monogram"] || "N", midX, boxY + 128, TS(30), {
        copy: true,
        align: "center", color: PAL.ink, edge: null, edgeW: 0,
        shadow: C.rgba(PAL.ink, 0.18), shadowOff: 4, time: t, seed: 4,
        family: "Permanent Marker",
      });
      TY.text(ctx, body, midX, boxY + 232, bodySize, {
        copy: true,
        family: "DMMono", color: PAL.ink, align: "center", letter: 2, alpha: land,
      });
      ctx.restore();
    }
  }
  if (lt > 3.6) {
    // Close the iris into paper. It already pinches to ~1 px by the last frame,
    // so no extra fill: a hard fill here flashed the frame beige.
    const iris = Math.max(1, (1 - C.inv(3.6, d, lt)) * 1400);
    irisOverlay(ctx, W / 2, 470, iris, PAL.paper, 70);
  }
}
window.PAPER_BACKEND = {
  shots: { paper_open: paperOpen, portrait_iris: portrait, stage_wide: stage, sticker_slam: sticker, macro_prop_beat: macro, pullback_close: pullback },
};
