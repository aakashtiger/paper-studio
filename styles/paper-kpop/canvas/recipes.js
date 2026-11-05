/* Paper K-pop canvas recipes — owned by the style pack, not by a film.
 *
 * Each entry draws one recipe from the score: the shot supplies the slots, the
 * style supplies the look. `painter.js` in the film maps `shot.recipe` here, so
 * a second paper film reuses this file unchanged.
 */



function bgPaper(shot) {
  // A film may declare a full-bleed stage field. With no declaration the pack
  // keeps its warm paper card, so every existing recipe is unchanged.
  if (shot && shot.slots && shot.slots["stage.field"]) {
    stageField(shot, 0);
    return;
  }
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(0, 0, W, H);
}

const STAGE_FIELDS = {
  paper: PAL.paper,
  cream: PAL.cream,
  kraft: PAL.paper3,
  marigold: PAL.gold,
  gold: PAL.gold,
  tomato: PAL.red,
  oxblood: PAL.redD,
  ink: PAL.ink,
  black: PAL.black,
  blue: PAL.blueD,
  cobalt: PAL.blue,
  teal: PAL.teal,
  acid: PAL.acid,
  pink: PAL.pink,
  orange: PAL.orange,
};

/**
 * A full-bleed stage: one field colour, a floor, a torn lip and a practical.
 * The field reaches every edge; the diagram or prop lives inside the world.
 */
function stageField(shot, t) {
  const role = shot.slots["stage.field"] || "paper";
  const field = STAGE_FIELDS[role] || PAL.paper;
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, W, H);

  const floorY = Number(shot.slots["stage.floorY"] || 840);
  const floor = C.shade(field, role === "ink" || role === "black" ? 14 : -18);
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = floor;
  ctx.beginPath();
  ctx.moveTo(-60, floorY);
  ctx.lineTo(W + 60, floorY);
  ctx.lineTo(W + 160, H + 80);
  ctx.lineTo(-160, H + 80);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = C.rgba(PAL.cream, 0.28);
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-60, floorY); ctx.lineTo(W + 60, floorY); ctx.stroke();

  const device = shot.slots["stage.device"] || "none";
  if (device === "sunburst") {
    sunburst(ctx, W / 2, floorY - 40, 110, 920, 32, C.rgba(PAL.cream, 0.08), C.rgba(PAL.gold, 0.08), t * 0.04);
  }
  if (device === "ring") {
    ctx.strokeStyle = C.rgba(PAL.gold, 0.7);
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(W / 2, 480, 360, 0, TAU); ctx.stroke();
  }
  if (shot.slots["stage.spot"] !== "0") {
    spotlight(ctx, W * 0.5, -100, 1180, 36, 620, PAL.cream, 0.12);
    spotlight(ctx, W * 0.2, -100, 880, 26, 380, PAL.gold, 0.08, 0.12);
  }
  halftone(ctx, 0, 0, W, H, PAL.ink, 22, 0.32, 0.045);
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
  // A recipe that names no entry pose gets the character's own first pose. That
  // is the *library's* default, not a pack-wide `idle`: the office rig has no
  // `idle` at all, and hardcoding one made every office shot throw. A pose that
  // is named but not in the library is still an error — that is a typo or a
  // score that drifted from the cast file, and both should be loud.
  const wanted = poseName === null || poseName === undefined ? lib.poses[0]?.name : poseName;
  const pose = lib.poses.find((p) => p.name === wanted);
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
 * The film's cast, in the order the score declares it: the people the pack may
 * draw at all. A recipe's *staging* is its own (who stands left, who is flipped,
 * who the solo figure is), so it needs the film's cast as an ordered list, not
 * just the names this shot happens to contain.
 */
function filmCast() {
  const cast = (window.SCORE && window.SCORE.cast) || [];
  return cast.map((item) => item.character).filter(Boolean);
}

/** Where a name sits in the film's cast: 0 = the lead's staging, -1 = unknown. */
function castIndex(name) {
  return filmCast().findIndex(
    (who) => String(who).toLowerCase() === String(name || "").toLowerCase(),
  );
}

/** The film's lead (`index` 0) or supporting player (`index` 1), if this shot has them. */
function castIn(shot, index) {
  const film = filmCast();
  const who = film[index];
  if (!who) return null;
  return shotCast(shot, film).includes(String(who).toLowerCase()) ? who : null;
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
  // `entry` is a pose name, or null for "the character's own first pose".
  const start = entry ?? null;
  const keys = [];
  for (const event of mine) {
    if (event.breakdown) keys.push({ t: Math.max(0, event.t - 0.08), pose: event.breakdown });
    keys.push({ t: event.t, pose: event.pose });
  }
  if (!keys.length) return [{ t: 0, pose: start }, { t: d, pose: start }];
  if (keys[0].t > 0) keys.unshift({ t: 0, pose: start });
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
 *
 * The ease used to be ignored: every move took the pack's smoothstep whatever
 * the shot asked for, so `camera.ease` was a note a film could write and not
 * hear. It is honoured now, by name, from the same six the contract allows; an
 * easing the contract does not name is a resolver error, not a silent default.
 */
const CAMERA_EASE = {
  linear: (k) => k,
  ease: (k) => C.ease(k),
  easeIn: (k) => C.easeIn(k),
  easeOut: (k) => C.easeOut(k),
  easeInOut: (k) => C.smooth(k),
  backOut: (k) => C.backOut(k),
};

function shotCam(shot, lt, d, x, y, tilt, t) {
  const cam = (shot && shot.camera) || {};
  const from = Number.isFinite(cam.from) ? cam.from : 1;
  const still = cam.move === "hold" || cam.move === "static";
  const to = still ? from : Number.isFinite(cam.to) ? cam.to : from;
  const ease = CAMERA_EASE[cam.ease] || CAMERA_EASE.easeInOut;
  const k = ease(C.clamp(lt / Math.max(1e-4, d)));
  const drift = cam.move === "orbit" ? Math.sin(lt * 0.55) * 14 : cam.move === "pan" ? (k - 0.5) * 46 : 0;
  const rot = cam.move === "orbit" ? Math.sin(lt * 0.45) * 0.006 : still ? 0 : Math.sin(lt * 0.5) * 0.004;
  setCam(x + drift, y, from + (to - from) * k, rot, tilt, t);
}

function colorsFor(name) {
  const lib = libFor(name);
  if (!lib) return {};
  const colors = {};
  for (const [key, value] of Object.entries(lib.colors)) colors[key] = PAL[value] || value;
  return colors;
}

/**
 * Which rig draws this name. The score's cast entry says so (`cast[].rig`), and
 * that is the only thing that decides: the painter used to test the name with a
 * regex, so a film could not cast a character the pack had never heard of, and a
 * renamed character silently became the idol.
 */
function rigFor(name) {
  const cast = (window.SCORE && window.SCORE.cast) || [];
  const entry = cast.find(
    (item) => String(item.character || "").toLowerCase() === String(name).toLowerCase(),
  );
  if (!entry) {
    throw new Error(
      `"${name}" is not in this film's cast (${cast.map((item) => item.character).join(", ") || "empty"})`,
    );
  }
  if (!entry.rig) {
    throw new Error(`cast entry "${name}" has no rig; a character needs one in score.cast[].rig`);
  }
  return entry.rig;
}

/* A focus box is a painter's claim, not a pixel guess. The probe wraps this
 * no-op and records the box in device space; a recipe passes the solid object,
 * never its glow or shadow. */
function focusAnchor(ctx, name, x, y, w, h) {
  return name;
}

function drawCharacter(name, x, y, scale, poseName, flip, poseOverride, time, extra = {}) {
  const rig = rigFor(name);
  const draw = window.CHARACTERS && window.CHARACTERS[rig];
  if (typeof draw !== "function") {
    const have = Object.keys(window.CHARACTERS || {});
    throw new Error(
      `no character rig "${rig}" for "${name}"; window.CHARACTERS has ${have.length ? have.join(", ") : "nothing"}`,
    );
  }
  const pose = livingPose(poseOverride || poseFor(name, poseName), time || 0, 1);
  // One colour convention for every rig: `colors` is an object keyed by garment
  // role, already mapped through the pack palette. A rig reads `o.colors.shirt`,
  // never a dozen loose keys, so a new rig cannot invent a second spelling.
  //
  // `poseKey` is the pose's *name*, which `pose` cannot carry because blending
  // produces a body in neither pose. A rig needs it for anything it cannot
  // average — a face, a held prop — and the pack takes no view on what that rig
  // then draws, the same way it takes no view on what a pair of trousers looks
  // like.
  draw(ctx, x, y, scale, {
    pose,
    poseKey: extra.poseKey || poseName,
    face: extra.face,
    held: extra.held,
    colors: colorsFor(name),
    flip: flip || 1,
    shadow: 1,
    t: time || 0,
  });
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

/**
 * The pose a body is *in* at time `lt`, as a name.
 *
 * `poseAt` blends parameters, so a body mid-blend is in neither pose — which is
 * right for a spine and wrong for a face. Anything discrete needs the name, and
 * takes the target once the blend is past half, the same rule `blendValue`
 * already uses for values that cannot be averaged.
 */
function poseNameAt(name, keys, lt) {
  const first = keys.length ? keys[0].pose : null;
  if (!keys.length) return "idle";
  if (lt <= keys[0].t) return first || "idle";
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (lt >= a.t && lt <= b.t) {
      if (!b.pose) return a.pose || "idle";
      const k = C.smooth(C.clamp((lt - a.t) / Math.max(1e-4, b.t - a.t)));
      return k < 0.5 ? a.pose || b.pose : b.pose;
    }
  }
  return keys[keys.length - 1].pose || "idle";
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
  bgPaper(shot);
  const d = shot.duration;
  shotCam(shot, lt, d, W / 2, 500, 0.6, t);
  beginCam(ctx);
  sunburst(ctx, W / 2, 470, 120, 630, 30, PAL.gold, PAL.paper2, lt * 0.32, 0.95);
  const coreIn = C.backOut(C.clamp(lt / 0.55));
  paper(ctx, () => blobPath(ctx, W / 2, 500, 172 * coreIn, 172 * coreIn, 64, 0.008, 8), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.35), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 7, sy: 10,
  });

  paper(ctx, () => tornRectPath(ctx, 1450, 356, 320, 18, 4, 19), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
    shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 10,
  });
  cueLamp(W - 330, 250, 1, t);

  // The words are the film's, never the pack's: a missing slot prints nothing.
  const title = shot.slots["content.title"] || "";
  const titleIn = C.clamp((lt - 0.2) / 0.4);
  ctx.save();
  ctx.translate(0, (1 - C.backOut(titleIn)) * -60);
  TY.type(ctx, title, W / 2, 360, fitSize(title, W - 380, TS(64)), {
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

  endCam(ctx);
  if (lt > 1.5) paperShards(ctx, W / 2, 500, lt, 24, [PAL.cream, PAL.gold, PAL.red], 520, C.clamp(1 - (lt - 1.5) / 0.7), 8);
  if (lt > 1.8) {
    const iris = Math.max(1, (1 - C.inv(1.8, d, lt)) * 1300);
    irisOverlay(ctx, W / 2, 500, iris, PAL.red, 80);
  }
}

function portrait(shot, lt, t) {
  bgPaper(shot);
  const d = shot.duration;
  // Who the portrait is of comes from the score: the shot's cast, or the film's
  // lead. The `content.names` slot is the *label* the film prints, so a renamed
  // card does not silently re-cast the shot.
  const people = shotCast(shot, filmCast().slice(0, 1));
  const index = people.length ? castIndex(people[0]) : -1;
  const who = index >= 0 ? filmCast()[index] : null;
  const name = shot.slots["content.names"] || (who || "").toUpperCase();
  const caption = shot.slots["content.caption"] || "";
  // The staging is the cast slot's: the film's first character faces right, the
  // second is mirrored, and the second is lit by a follow spot rather than the
  // cue lamp (a supporting player has no lamp of her own).
  const support = index > 0;
  // The performance comes from the score's pose events. A portrait with no pose
  // events is a held portrait — not the two-shot the recipe used to invent.
  const pose = who ? poseAt(who, scoreKeys(shot, who, d, "idle"), lt) : null;
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

  if (support) {
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

  // Every portrait is framed the same way: the figure is cut at the hem by the
  // bottom of the frame, so the film never shows a rig's knees, and the pair's
  // second frame is the first's mirrored so the two faces do not read as one.
  if (who && hasCast(shot, [who], who)) {
    drawCharacter(who, 1000, 1160, 1.30, "idle", support ? -1 : 1, pose, t);
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
  // renaming a card silently re-cast the shot. The two staging slots are the
  // film's cast order, not two named characters.
  const film = filmCast();
  const people = shotCast(shot, film.slice(0, 2));
  const lead = film.length > 0 && people.includes(film[0].toLowerCase());
  const second = film.length > 1 && people.includes(film[1].toLowerCase());
  const solo = lead !== second;
  const both = lead && second;
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

  let poseA = lead ? poseAt(film[0], scoreKeys(shot, film[0], d, "idle"), lt) : null;
  let poseB = second ? poseAt(film[1], scoreKeys(shot, film[1], d, "idle"), lt) : null;
  // A beat pulse is a knee-driven sink, not a body lift; it is added to every
  // pose so the feet stay planted on their own shadows.
  const bob = Math.abs(Math.sin(C.frac(C.beat(t)) * Math.PI)) * 10;

  // Composition follows the cast: a solo figure owns the left of the stage and
  // the title card the right, a pair stands as a pair on the left. The cast has
  // to clear the card: a full-body performer is 800 px tall in a 1080 frame, so
  // a card in the top corner is over a head unless the body is composed left.
  const formation = both ? C.smooth(C.clamp((lt - Math.max(0.2, d * 0.55)) / 0.5)) : 0;
  const leadX = solo ? 560 : 300 + 220 * C.smooth(C.clamp((lt - 0.3) / 0.9)) + formation * 55;
  const secondX = solo ? 560 : 800 - formation * 35;
  const leadScale = both ? 1.1 : 1.18;
  const secondScale = both ? 1.1 : 1.18;
  // One shadow per performer, drawn by the character rig itself.
  if (lead) drawCharacter(film[0], leadX, 960, leadScale, "idle", 1, { ...poseA, bounce: (poseA.bounce || 0) + bob }, t);
  if (second) drawCharacter(film[1], secondX, 985, secondScale, "idle", -1, { ...poseB, bounce: (poseB.bounce || 0) + bob }, t);
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
  bgPaper(shot);
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
  // The sticker's words are the film's (`content.body` is a required slot); the
  // pack does not print a slogan of its own into a film it has never seen.
  const slam = shot.slots["content.body"] || "";
  TY.sticker(ctx, slam, 0, 0, fitSize(slam, 1240, TS(64), "Archivo Black"), {
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
  bgPaper(shot);
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
  const film = filmCast();
  const cast = shotCast(shot, film.slice(0, 2));
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
  const leadPose = film.length > 0 && cast.includes(film[0].toLowerCase())
    ? poseAt(film[0], scoreKeys(shot, film[0], d, "idle"), lt)
    : null;
  const secondPose = film.length > 1 && cast.includes(film[1].toLowerCase())
    ? poseAt(film[1], scoreKeys(shot, film[1], d, "idle"), lt)
    : null;
  // The pair stands as a pair, with room between them: at 280 px apart the two
  // cut-outs overlapped, and the second character's head sat on the lead's
  // shoulder in the last shot of the film. 400 px puts a gap between the bodies
  // and still leaves the right half clear for the end card.
  if (leadPose) drawCharacter(film[0], 460, 960, 1.04, "idle", 1, leadPose, t);
  if (secondPose) drawCharacter(film[1], 860, 985, 1.04, "idle", -1, secondPose, t);
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
      const body = shot.slots["content.body"] || "";
      const bodySize = fitSize(body, innerW, TS(18), "DMMono", 2);
      ctx.save();
      ctx.globalAlpha = land;
      ctx.translate(0, (1 - land) * 40);
      paper(ctx, () => tornRectPath(ctx, boxX, boxY, boxW, boxH, 6, 23), {
        fill: PAL.paper, edge: C.rgba(PAL.ink, 0.4), edgeW: 2,
        shadow: C.rgba(PAL.ink, 0.28), sx: 8, sy: 12,
      });
      TY.type(ctx, shot.slots["content.monogram"] || "", midX, boxY + 128, TS(30), {
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

/* ---- the office set (pack 0.2.0) ---------------------------------------
 *
 * An office film needs a room, a desk and a light, and the K-pop recipes are a
 * stage: sunbursts, a cue lamp, a sticker meter. These recipes are the same
 * paper language over an office: flat cut plates, one hard shadow, halftone as
 * grime, a fluorescent bar as the only light, and no music-video furniture.
 *
 * The score still directs: who is in the frame (`direction.cast`), what they do
 * (`pose` events), how the camera moves (`shot.camera`), and when a thing
 * happens (event times). The recipe owns where the furniture stands.
 *
 * The hour is not drawn by these recipes. It arrives in `content.caption`, so
 * the clock on screen is the film's, never the style's.
 */

const OFFICE = {
  ceiling: 96,
  desk: 772,
  /**
   * Where a seated figure's feet are, so his hands land **on** the desk.
   *
   * Measured from the rig, not guessed: the wrist sits 279 rig units above the
   * feet, and the figure is drawn at 1.5, so the hands hang 418.5 px above his
   * feet. At `figureFloor` (1180) the hands were at 762 — 10 px above the desk
   * line, over nothing, which is why a man at a desk read as a man standing
   * behind one. 772 + 418.5 = 1190.5.
   */
  seated: 1191,
  figureFloor: 1180,
  scale: 1.35,
  /** How tall the whole day of paper stands once the last row lands. */
  stackHeight: 700,
};

/** The room: wall, ceiling plate, skirting, and grime. Flat plates, no gradient. */
function officeRoom(t, o = {}) {
  const night = o.night === true;
  ctx.fillStyle = night ? PAL.ink2 : PAL.paper2;
  ctx.fillRect(-300, -300, W + 600, H + 600);
  // ceiling: a plate that ends in a torn lip, so the top of the frame is paper
  paper(ctx, () => tornRectPath(ctx, -300, -60, W + 600, OFFICE.ceiling + 60, 6, 17), {
    fill: night ? PAL.ink : PAL.paper3,
    edge: C.rgba(PAL.ink, 0.45), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.22), sx: 0, sy: 9,
  });
  // a stain, a seam and a skirting board: enough for the wall to read as a wall
  ctx.save();
  ctx.globalAlpha = night ? 0.1 : 0.16;
  paper(ctx, () => blobPath(ctx, 420, 470, 190, 120, 13, 0.06, 5), { fill: PAL.paper3, edge: null });
  ctx.restore();
  paper(ctx, () => tornRectPath(ctx, 1180, -20, 300, 900, 5, 29), {
    fill: C.shade(night ? PAL.ink2 : PAL.paper2, night ? 6 : -4), edge: C.rgba(PAL.ink, 0.16), edgeW: 2, shadow: null,
  });
  paper(ctx, () => tornRectPath(ctx, -300, 700, W + 600, 90, 5, 11), {
    fill: night ? C.shade(PAL.ink, 8) : PAL.paper3,
    edge: C.rgba(PAL.ink, 0.4), edgeW: 2.5,
    shadow: C.rgba(PAL.ink, 0.16), sx: 0, sy: 6,
  });
  halftone(ctx, -200, 120, W + 400, 620, C.rgba(PAL.ink, 0.5), 27, 0.5, night ? 0.05 : 0.09, 0.18);
}

/**
 * A fluorescent bar. `level` 0 is off; 1 is on. It flickers by a deterministic
 * function of the film time — never a random number — and the film can drive a
 * flicker by passing a level the score chose.
 */
function officeFluor(x, y, w, level, t) {
  const flicker = level > 0 ? level * (0.94 + 0.06 * Math.sin(t * 13.1) * Math.sin(t * 2.7)) : 0;
  if (flicker > 0.02) {
    const g = ctx.createRadialGradient(x, y + 20, 10, x, y + 20, w * 0.85);
    g.addColorStop(0, C.rgba(PAL.acid, 0.3 * flicker));
    g.addColorStop(0.45, C.rgba(PAL.goldL, 0.12 * flicker));
    g.addColorStop(1, C.rgba(PAL.goldL, 0));
    ctx.save(); ctx.fillStyle = g;
    ctx.fillRect(x - w, y - 220, w * 2, 620);
    ctx.restore();
    spotlight(ctx, x, y + 26, 560, 46, 300, "#FFFBE8", 0.1 * flicker, 0);
  }
  // housing
  paper(ctx, () => roundRectPath(ctx, x - w / 2, y, w, 22, 6), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.7), edgeW: 2, shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: 7,
  });
  // tube
  paper(ctx, () => roundRectPath(ctx, x - w / 2 + 14, y + 7, w - 28, 10, 5), {
    fill: flicker > 0.5 ? PAL.cream : C.shade(PAL.silver, -30), edge: null,
  });
  if (flicker > 0.5) {
    ctx.save(); ctx.globalAlpha = 0.5 * flicker; ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - w / 2 + 30, y + 9, w - 60, 3);
    ctx.restore();
  }
}

/** The desk: a torn plate across the lower frame, one inlay, one drawer. */
function officeDesk(o = {}) {
  const y = OFFICE.desk;
  // Day and night are two values of the same desk, not two desks. At night the
  // front falls to ink2; by day it is a lit brown, because a third of the frame
  // in near-black reads as a hole, not as furniture.
  const top = o.desk || (o.night ? PAL.ink2 : PAL.ink3);
  paper(ctx, () => tornRectPath(ctx, -260, y, W + 520, H - y + 260, 8, 23), {
    fill: top, edge: C.rgba(PAL.ink, 0.55), edgeW: 3, shadow: C.rgba(PAL.ink, 0.26), sx: 0, sy: 12,
  });
  // the light lands on the near edge of the desk and nowhere else
  ctx.save();
  ctx.globalAlpha = o.night ? 0.1 : 0.2;
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(-260, y + 4, W + 520, 20);
  ctx.restore();
  // a seam down the front, so the plate is a face and not a band
  ctx.save();
  ctx.globalAlpha = o.night ? 0.12 : 0.16;
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(-260, y + 168, W + 520, 7);
  ctx.restore();
  // drawer
  paper(ctx, () => tornRectPath(ctx, 1180, y + 96, 460, 150, 4, 31), {
    fill: C.shade(top, o.night ? -8 : -10), edge: C.rgba(PAL.ink, 0.4), edgeW: 2, shadow: C.rgba(PAL.ink, 0.2), sx: 0, sy: 6,
  });
  paper(ctx, () => roundRectPath(ctx, 1352, y + 158, 116, 14, 7), {
    fill: C.shade(PAL.silver, -34), edge: C.rgba(PAL.ink, 0.5), edgeW: 1.6,
  });
}

/**
 * The sky a day shot's window shows, from the hour the shot prints. The hour is
 * the film's own `content.caption`; the window is not allowed to invent a time.
 */
function officeDaySky(caption) {
  const hour = Number(String(caption || "").split(":")[0]);
  if (!Number.isFinite(hour)) return 0.2;
  return C.clamp((hour - 6) / 24 + 0.05);
}

/** The monitor, seen from behind: the person is looking at it, we are not. */
function officeMonitor(x, y, s, o = {}) {
  const glow = o.glow === undefined ? 1 : o.glow;
  if (glow > 0.02) {
    const g = ctx.createRadialGradient(x, y - 150 * s, 10, x, y - 150 * s, 340 * s);
    g.addColorStop(0, C.rgba(PAL.blueL, 0.22 * glow));
    g.addColorStop(1, C.rgba(PAL.blueL, 0));
    ctx.save(); ctx.fillStyle = g;
    ctx.fillRect(x - 380 * s, y - 460 * s, 760 * s, 620 * s);
    ctx.restore();
  }
  paper(ctx, () => roundRectPath(ctx, x - 34 * s, y - 26 * s, 68 * s, 30 * s, 6 * s), {
    fill: C.shade(PAL.ink3, 10), edge: C.rgba(PAL.ink, 0.55), edgeW: 2, shadow: C.rgba(PAL.ink, 0.22), sx: 0, sy: 6,
  });
  paper(ctx, () => roundRectPath(ctx, x - 150 * s, y - 208 * s, 300 * s, 190 * s, 12 * s), {
    fill: C.shade(PAL.paper3, -20), edge: C.rgba(PAL.ink, 0.62), edgeW: 3, shadow: C.rgba(PAL.ink, 0.24), sx: 9, sy: 13,
  });
  // vents and a plain plate: a brand would be an invented fact
  ctx.save();
  ctx.globalAlpha = 0.3; ctx.fillStyle = PAL.ink;
  for (let i = 0; i < 5; i++) ctx.fillRect(x - 96 * s, y - 44 * s + i * 7 * s, 192 * s, 2.6 * s);
  ctx.restore();
  ctx.strokeStyle = C.rgba(PAL.ink, 0.3); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 130 * s, y - 186 * s); ctx.lineTo(x + 130 * s, y - 186 * s); ctx.stroke();
}

/** A mug, a pencil pot, a phone: three small plates that make a desk lived in. */
function officeDeskThings(x, y, s, o = {}) {
  // mug
  paper(ctx, () => roundRectPath(ctx, x - 26 * s, y - 52 * s, 52 * s, 52 * s, 8 * s), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 7,
  });
  ctx.strokeStyle = PAL.red; ctx.lineWidth = 7 * s;
  ctx.beginPath(); ctx.arc(x + 26 * s, y - 26 * s, 15 * s, -0.9, 0.9); ctx.stroke();
  paper(ctx, () => blobPath(ctx, x, y - 52 * s, 26 * s, 8 * s, 11, 0.05, 3), {
    fill: C.shade(PAL.ink, 6), edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
  });
  // pencil pot
  paper(ctx, () => roundRectPath(ctx, x + 92 * s, y - 64 * s, 44 * s, 64 * s, 6 * s), {
    fill: PAL.blueD, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.18), sx: 4, sy: 6,
  });
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(x + 102 * s + i * 13 * s, y - 64 * s);
    ctx.rotate(-0.12 + i * 0.12);
    ctx.fillStyle = i === 1 ? PAL.gold : PAL.ink;
    ctx.fillRect(-4 * s, -46 * s, 8 * s, 46 * s);
    ctx.restore();
  }
  // phone, face down: the film's whole villain, flat on the desk
  paper(ctx, () => roundRectPath(ctx, x - 190 * s, y - 30 * s, 84 * s, o.phoneH || 22 * s, 6 * s), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.7), edgeW: 2, shadow: C.rgba(PAL.ink, 0.24), sx: 5, sy: 8,
  });
}

/**
 * The work: one form, lying flat on the desk, under his hands.
 *
 * The desk was empty in front of him, which is why `type` and `slump` read as a
 * man standing behind furniture — his hands had nothing to be over. This film's
 * work is paper (the stack on the desk's right is the whole day of it), so the
 * form he is filling in is paper too: ruled, boxed, and half ticked.
 *
 * The plate itself is `PROPS.form`, so its footprint is declared with the other
 * props and it is marked `flat`: a plate lying on a surface casts no lift
 * shadow, and the first version — drawn here with the same shadow as a cut-out
 * standing up — read as an envelope pasted on the front of the desk. `y` is the
 * sheet's centre, which is where the recipes already put it.
 */
function officeSheet(x, y, s = 1, o = {}) {
  return placeProp("form", x, y - (PROPS.form.h * s) / 2, s, o);
}

/**
 * The stack. It is the film's clock, so the score builds it: every `build`
 * event in the film, in order, is one more row of paper, and a row lands on the
 * frame its event names. No recipe invents a count.
 *
 * The recipe does own how tall the finished stack stands — that is
 * composition, not story. It is one constant (`OFFICE.stackHeight`, just under
 * a standing figure), shared by all the rows, so the last row lands at the
 * height the film promised and no row is taller than the day after it.
 */
function officeStack(x, baseY, rows, t, o = {}) {
  const total = officeBuildTotal();
  const h = total > 0 ? Math.max(18, OFFICE.stackHeight / total) : 0;
  for (let i = 0; i < rows; i++) {
    const w = 208 + (C.hash(i * 7.31 + 2) - 0.5) * 72;
    const y = baseY - (i + 1) * h - i * 1.2;
    const rot = (C.hash(i * 3.77 + 1) - 0.5) * 0.1 + Math.sin(t * 0.7 + i * 0.6) * 0.003;
    ctx.save();
    ctx.translate(x + (C.hash(i * 5.13 + 3) - 0.5) * 34, y);
    ctx.rotate(rot);
    paper(ctx, () => tornRectPath(ctx, -w / 2, 0, w, h, 3, 9 + i * 3), {
      fill: i % 2 ? PAL.cream : PAL.paper,
      edge: C.rgba(PAL.ink, 0.5), edgeW: 1.6,
      shadow: C.rgba(PAL.ink, 0.15), sx: 3, sy: 5,
    });
    // a printed rule on the top sheet, so the rows read as paper and not as a bar
    if (i % 2 === 0) {
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = PAL.ink;
      ctx.fillRect(-w / 2 + 18, h * 0.45, w - 40, 2);
      ctx.restore();
    }
    ctx.restore();
  }
  if (o.clip) {
    // the tower passes the top of the frame: a cut edge, not a fade
  }
}

/**
 * Props are declared assets: one draw, one footprint, one anchor, written once.
 *
 * The office set used to draw its furniture from the call site — the chair was
 * `192 * s` inside a function and `1.95`, then `1.6`, then `1.45` at four places
 * that called it. A number repeated four times cannot be corrected once, and it
 * cannot be checked: at 1.45 the chair back was **278 px** wide behind a man
 * whose shoulders are **108 px**, two and a half men wide, which is why it read
 * as a slab. It also drifted the moment the man moved, because nothing connected
 * the two.
 *
 * `w`/`h` are pack units at scale 1, and `anchor` says which point of the box
 * `(x, y)` names. `flat` says the plate lies on a surface: a flat prop casts no
 * lift shadow, and asking for one is an error rather than a drawing that reads
 * as an envelope pasted on the front of a desk.
 */
const PROPS = {
  chair: {
    w: 84,
    h: 152,
    anchor: "bottom-center",
    flat: false,
    /**
     * `box` is the declared footprint, and it is one object rather than three
     * positional numbers: the first version took `(left, bottom, s)` while
     * `placeProp` passed the box's *top*, so the chair was drawn a full height
     * too high — a rounded slab floating at his shoulder, which read as a rock
     * behind him and took two frames to notice. A named box cannot be
     * mis-ordered.
     */
    draw(box, s) {
      const { left, top, w, h } = box;
      paper(ctx, () => roundRectPath(ctx, left, top, w, h, 26 * s), {
        fill: PAL.ink3, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.4,
        shadow: C.rgba(PAL.ink, 0.24), sx: 7, sy: 10,
      });
      // The upholstered panel, inset, so the back reads as a chair and not a box.
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = PAL.ink;
      roundRectPath(ctx, left + w * 0.14, top + h * 0.1, w * 0.72, h * 0.78, 18 * s);
      ctx.fill();
      ctx.restore();
    },
  },
  /** The form he fills in: a flat plate, so it must not cast a lift shadow. */
  form: {
    w: 340,
    h: 84,
    anchor: "top-center",
    flat: true,
    draw(box, s, o = {}) {
      const { left, top, w, h } = box;
      paper(ctx, () => tornRectPath(ctx, left, top, w, h, 3, 11), {
        fill: PAL.cream, edge: C.rgba(PAL.ink, 0.45), edgeW: 2, shadow: null,
      });
      // the lines he has written on, unevenly
      ctx.save();
      ctx.globalAlpha = o.night ? 0.28 : 0.4;
      ctx.fillStyle = PAL.ink;
      for (let i = 0; i < 2; i++) {
        ctx.fillRect(left + 22 * s, top + (22 + i * 22) * s, (w - 120 * s) * (0.75 + C.hash(i + 3) * 0.25), 2.2 * s);
      }
      ctx.restore();
      // the box he is meant to tick, and the tick
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = PAL.ink;
      ctx.lineWidth = 2 * s;
      ctx.strokeRect(left + w - 84 * s, top + 14 * s, 24 * s, 24 * s);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = PAL.red;
      ctx.fillRect(left + w - 80 * s, top + 24 * s, 16 * s, 5 * s);
      ctx.restore();
    },
  },
};

const PROP_ANCHORS = {
  "bottom-center": (x, y, w, h) => [x - w / 2, y - h],
  "top-center": (x, y, w) => [x - w / 2, y],
};

/** Place a prop by name. An id the table does not have is an error, never a skip. */
function placeProp(id, x, y, s = 1, o = {}) {
  const prop = PROPS[id];
  if (!prop) throw new Error(`unknown prop "${id}" — a prop is declared in PROPS, not drawn at the call site`);
  if (prop.flat && o.shadow) throw new Error(`prop "${id}" lies flat and cannot cast a lift shadow`);
  const anchor = PROP_ANCHORS[prop.anchor];
  if (!anchor) throw new Error(`prop "${id}" has an anchor "${prop.anchor}" the pack does not place`);
  const [left, top] = anchor(x, y, prop.w * s, prop.h * s);
  const box = { left, top, w: prop.w * s, h: prop.h * s };
  prop.draw(box, s, o);
  return { id, ...box };
}

/** A cut-paper hand, palm and five digits, drawn as a prop. */
function officeHand(x, y, s, rot, o = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot || 0);
  const skin = o.skin || "#F0C9A4";
  paper(ctx, () => blobPath(ctx, 0, 0, 84 * s, 62 * s, 13, 0.05, 7), {
    fill: skin, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.22), sx: 7, sy: 11,
  });
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.translate(28 * s, (-34 + i * 24) * s);
    ctx.rotate(0.08 - i * 0.05);
    paper(ctx, () => roundRectPath(ctx, 0, -10 * s, (92 - i * 6) * s, 20 * s, 9 * s), {
      fill: skin, edge: C.rgba(PAL.ink, 0.5), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.16), sx: 4, sy: 7,
    });
    ctx.restore();
  }
  ctx.save();
  ctx.translate(-26 * s, 38 * s);
  ctx.rotate(0.7);
  paper(ctx, () => roundRectPath(ctx, -8 * s, -10 * s, 74 * s, 21 * s, 10 * s), {
    fill: skin, edge: C.rgba(PAL.ink, 0.5), edgeW: 2.2, shadow: C.rgba(PAL.ink, 0.16), sx: 4, sy: 7,
  });
  ctx.restore();
  ctx.restore();
}

/**
 * A window: a frame, four panes, a street, and a sky whose colour is the shot's.
 * `k` runs 0 (flat grey morning) → 0.5 (dusk orange) → 1 (grey night).
 *
 * The sky, the sun and the street are painted once behind the whole window and
 * then mullioned: drawn per pane, the sun came out four times, which read as
 * four moons rather than one evening.
 */
function officeWindow(x, y, w, h, k, t) {
  const glass = k < 0.5
    ? C.mix("#A8C6D6", "#F0A24E", C.clamp((k - 0.25) / 0.25))
    : C.mix("#F0A24E", "#1B2330", C.clamp((k - 0.5) * 2));
  const pad = 26;
  paper(ctx, () => tornRectPath(ctx, x, y, w, h, 5, 41), {
    fill: PAL.paper, edge: C.rgba(PAL.ink, 0.6), edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 12, sy: 18,
  });
  // glass, once
  ctx.save();
  ctx.beginPath(); ctx.rect(x + pad, y + pad, w - pad * 2, h - pad * 2); ctx.clip();
  ctx.fillStyle = glass;
  ctx.fillRect(x + pad, y + pad, w - pad * 2, h - pad * 2);
  // the sun, low, only while the light is warm
  const warm = k > 0.15 && k < 0.85 ? 1 - Math.abs(k - 0.5) * 2.4 : 0;
  if (warm > 0.02) {
    ctx.save();
    ctx.globalAlpha = C.clamp(warm);
    paper(ctx, () => blobPath(ctx, x + w * 0.6, y + h * (0.62 - k * 0.2), 96, 96, 16, 0.02, 4), {
      fill: PAL.goldL, edge: null,
    });
    ctx.restore();
  }
  // a street of flat buildings, darker than the sky, always
  const baseY = y + h - pad;
  for (let b = 0; b < 11; b++) {
    const bw = (w - pad * 2) * (0.05 + C.hash(b * 3.1 + 7) * 0.055);
    const bh = (h - pad * 2) * (0.2 + C.hash(b * 5.7 + 3) * 0.32);
    const bx = x + pad + b * ((w - pad * 2) / 11) * 1.02;
    ctx.fillStyle = k > 0.7 ? C.shade(PAL.ink, 6) : C.rgba(PAL.ink, 0.55);
    ctx.fillRect(bx, baseY - bh, bw, bh);
    if (k > 0.55) {
      ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = PAL.goldL;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          if (C.hash(b * 11 + row * 3 + col) > 0.42) {
            ctx.fillRect(bx + 8 + col * 15, baseY - bh + 12 + row * 17, 6, 8);
          }
        }
      }
      ctx.restore();
    }
  }
  // a paper glint on the glass
  ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = PAL.cream;
  const gx = x + pad, gy = y + pad, gw = (w - pad * 2) / 2, gh = (h - pad * 2) / 2;
  ctx.beginPath();
  ctx.moveTo(gx, gy + gh * 1.7); ctx.lineTo(gx + gw * 0.7, gy); ctx.lineTo(gx + gw * 0.92, gy);
  ctx.lineTo(gx, gy + gh * 1.84); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.restore();
  // the mullions: one horizontal and one vertical bar, then the pane edges
  const mx = x + pad + (w - pad * 3) / 2 + pad / 2;
  const my = y + pad + (h - pad * 3) / 2 + pad / 2;
  for (const bar of [
    [x + pad, my - 7, w - pad * 2, 14],
    [mx - 7, y + pad, 14, h - pad * 2],
  ]) {
    paper(ctx, () => roundRectPath(ctx, bar[0], bar[1], bar[2], bar[3], 5), {
      fill: PAL.paper, edge: C.rgba(PAL.ink, 0.5), edgeW: 2,
    });
  }
}

/**
 * The hour, printed on a torn tab in the top-left margin. It is the score's
 * `content.caption`, so the film's clock is authored, never assumed; `copy`
 * makes `audit:type` hold it inside the safe area.
 *
 * The tab is a **zone**, not a string. Every office recipe declares the box the
 * label may occupy (`hour-label`: x 0.062, y 0.078, w 0.34, h 0.27 — in pixels,
 * 120,84 by 653,291), and the label is set inside it: an hour is one line, and
 * a caption that is a whole line of lyric wraps to three or four at the pack's
 * 14 px floor. Shrinking the type to fit a longer string is the one thing the
 * floor forbids, so the tab grows downward instead — and the zone is clipped, so
 * no label can ever leave the box its recipe promised.
 */
const HOUR_TAB = { x: 120, y: 84, w: 653, h: 291 };

function officeHourTab(text, t) {
  const label = String(text || "").trim();
  if (!label) return;
  const padX = 46;
  const wrap = (value, size) => {
    const lines = [];
    let line = "";
    for (const word of value.split(/\s+/).filter(Boolean)) {
      const next = line ? line + " " + word : word;
      if (line && TY.width(ctx, next, size, "DMMono", "400", 2) > HOUR_TAB.w - padX) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  // 16 at phone scale (79 px here) while it still fits in three lines; down to
  // the 14 px floor, and never below it.
  let size = TS(16);
  let lines = wrap(label, size);
  while (lines.length > 3 && size > TS(14)) {
    size = Math.max(TS(14), size - 6);
    lines = wrap(label, size);
  }
  const lineH = Math.round(size * 1.2);
  const w = Math.max(112, Math.min(
    HOUR_TAB.w,
    Math.max(...lines.map((line) => TY.width(ctx, line, size, "DMMono", "400", 2))) + padX,
  ));
  const h = size + 34 + (lines.length - 1) * lineH;
  ctx.save();
  // the zone, clipped before the tab is placed in it
  ctx.beginPath();
  ctx.rect(HOUR_TAB.x, HOUR_TAB.y, HOUR_TAB.w, HOUR_TAB.h);
  ctx.clip();
  ctx.translate(HOUR_TAB.x, HOUR_TAB.y);
  ctx.rotate(-0.018);
  paper(ctx, () => tornRectPath(ctx, 0, 0, w, h, 4, 7), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.4, shadow: C.rgba(PAL.ink, 0.26), sx: 5, sy: 9,
  });
  ctx.fillStyle = PAL.red;
  ctx.fillRect(18, 10, 24, 4);
  lines.forEach((line, i) => TY.type(ctx, line, 18, size + 18 + i * lineH, size, {
    copy: true,
    family: "DMMono", color: PAL.ink, letter: 2, edge: null, edgeW: 0,
    shadow: C.rgba(PAL.ink, 0.2), shadowOff: 3, time: t, seed: 3, jitter: 0.4,
  }));
  ctx.restore();
}

/**
 * A shot's actor: pose keys from the score, and the pack's living hold applied
 * once inside `drawCharacter`. `extra` is motion the recipe owns (a step bob),
 * added to the scored pose before the hold breathes over it.
 */
/** The expression the shot is holding at local time `lt`, from the score's events. */
function expressionNameAt(shot, lt, who) {
  let found = null;
  for (const event of (shot.direction && shot.direction.events) || []) {
    if (event.kind === "pose" && event.expression && event.t <= lt && (!event.who || event.who === who)) {
      found = event.expression;
    }
  }
  return found;
}

/**
 * The library's expression vocabulary is open/brow/lookX/lookY; the office rig
 * draws eyes/browLift/look/mouth. This is the adapter, so the 14 named
 * expressions actually reach the face instead of being stored data.
 */
function faceFromExpression(name, expression) {
  if (!expression) return undefined;
  const library = libFor(name);
  const entry = library && (library.expressions || []).find((item) => item.name === expression);
  if (!entry) return undefined;
  const p = entry.params || {};
  const open = typeof p.open === "number" ? p.open : 0.85;
  const brow = typeof p.brow === "number" ? p.brow : 0;
  // An explicit `eyes`/`mouth` is the library's newer vocabulary: 14 names can
  // be 14 shapes. The fallback keeps an older three-number expression legal.
  const legacy = (typeof p.eyes === "string" || typeof p.mouth === "string")
    ? {
        eyes: typeof p.eyes === "string" ? p.eyes : open > 1.12 ? "wide" : open < 0.62 ? "closed" : "dot",
        mouth: typeof p.mouth === "string" ? p.mouth : open > 1.3 ? "o" : brow > 0.25 ? "smile" : "flat",
        browLift: typeof p.browLift === "number" ? p.browLift : brow * 4,
        browTilt: typeof p.browTilt === "number" ? p.browTilt : 0,
        look: [typeof p.lookX === "number" ? p.lookX : 0, typeof p.lookY === "number" ? p.lookY : 0],
        tear: p.tear === true,
      }
    : {
        eyes: open > 1.12 ? "wide" : open < 0.62 ? "closed" : "dot",
        browLift: brow * 4,
        look: [typeof p.lookX === "number" ? p.lookX : 0, typeof p.lookY === "number" ? p.lookY : 0],
        mouth: open > 1.3 ? "o" : brow > 0.25 ? "smile" : brow < -0.35 ? "wobble" : "flat",
      };
  // A rig that can interpolate publishes `faceFields`; its numeric vector is
  // merged over the legacy names so old rigs keep the exact old drawing.
  const rig = rigFor(name);
  const draw = window.CHARACTERS && window.CHARACTERS[rig];
  const numeric = draw && typeof draw.faceFields === "function" ? draw.faceFields(p) : {};
  return { ...legacy, ...numeric };
}

/**
 * The face at local time `lt`, between the previous and next expression event.
 * The opening expression is in force at the cut; later changes ease in over a
 * 0.25-0.4 s window. This is the face counterpart of `poseAt`.
 */
function faceAt(shot, lt, who) {
  const events = ((shot && shot.direction && shot.direction.events) || [])
    .filter((event) => event.kind === "pose" && event.expression && (!event.who || String(event.who).toLowerCase() === String(who).toLowerCase()))
    .sort((a, b) => a.t - b.t);
  if (events.length === 0) return undefined;
  // The opening expression is in force at the cut, even if its event lands a
  // few frames in; there is no earlier face to blend from.
  if (lt <= events[0].t) return faceFromExpression(who, events[0].expression);
  let previous = events[0];
  for (let index = 1; index < events.length; index += 1) {
    const next = events[index];
    const blend = Math.min(0.4, Math.max(0.25, next.t - previous.t));
    const start = Math.max(previous.t, next.t - blend);
    if (lt < start) return faceFromExpression(who, previous.expression);
    if (lt <= next.t) {
      const k = C.smooth(C.clamp((lt - start) / Math.max(1e-4, next.t - start)));
      return blendPose(
        faceFromExpression(who, previous.expression),
        faceFromExpression(who, next.expression),
        k,
      );
    }
    previous = next;
  }
  return faceFromExpression(who, previous.expression);
}

function officeActor(shot, lt, t, name, x, y, scale, entry, flip, extra = {}) {
  const d = shot.duration;
  const keys = scoreKeys(shot, name, d, entry ?? null);
  const pose = { ...poseAt(name, keys, lt) };
  for (const [key, value] of Object.entries(extra)) {
    pose[key] = typeof value === "function" ? value(pose[key]) : (typeof pose[key] === "number" ? pose[key] + value : value);
  }
  // The pose's name as well as its numbers: the rig chooses a face from the name,
  // because an open eye cannot be blended into a closed one. A named expression
  // from the score overrides it, through the library's face adapter.
  drawCharacter(name, x, y, scale, "idle", flip || 1, pose, t, {
    poseKey: poseNameAt(name, keys, lt),
    face: faceAt(shot, lt, name),
  });
  return pose;
}

/**
 * A man in his chair, placed as one unit.
 *
 * The chair exists only to sit behind him, so it is placed **from him**: the
 * same anchor, its back's base at his seat. When `OFFICE.seated` moved him 11 px
 * down, the four recipes that placed a chair and a man on separate lines left
 * the chair where the old floor was — that is the drift this function removes,
 * not a better drawing of a chair.
 */
function officeSeated(shot, lt, t, name, x, extra = {}, o = {}) {
  const scale = o.actorScale === undefined ? 1.5 : o.actorScale;
  const chairScale = o.chairScale === undefined ? scale : o.chairScale;
  // His hip, in frame px, from the rig's own proportion (the hip sits 258 units
  // above his feet), so the seat follows the man rather than a typed number.
  const hip = OFFICE.seated - 258 * scale;
  placeProp("chair", x + 18, hip + 30 * chairScale, chairScale);
  return officeActor(shot, lt, t, name, x, OFFICE.seated, scale, null, o.flip === undefined ? 1 : o.flip, extra);
}

/** A step cycle: the pose keeps its shape, the weight moves. */
function stepBob(steps, t, amp = 5) {
  return Math.abs(Math.sin(t * Math.PI * steps)) * amp;
}

/** Every `build` event in the film: the stack's full height is divided by it. */
function officeBuildTotal() {
  const score = window.SCORE;
  if (!score || !Array.isArray(score.shots)) return 0;
  let total = 0;
  for (const shot of score.shots) {
    for (const event of (shot.direction && shot.direction.events) || []) {
      if (event.kind === "build") total += 1;
    }
  }
  return total;
}

/** One row of paper per `build` event in the film up to this frame. */
function officeBuildRows(shot, lt) {
  const score = window.SCORE;
  if (!score || !Array.isArray(score.shots)) return 0;
  let rows = 0;
  for (const other of score.shots) {
    for (const event of (other.direction && other.direction.events) || []) {
      if (event.kind !== "build") continue;
      if (other === shot) {
        if (event.t <= lt + 1e-6) rows += 1;
      } else if (other.start < shot.start - 1e-6) {
        rows += 1;
      }
    }
  }
  return rows;
}

/* ---- the eight office recipes ------------------------------------------ */

/**
 * 06:00 — a phone on a nightstand, and a hand that ends the noise.
 *
 * The frame is a bedroom before dawn: a bed at the left, the stand under the
 * phone, one lamp. The hand comes in as an arm, because a hand with nothing
 * behind it reads as a sticker; and the hand's path is the score's, so the
 * version that lands on the phone and the version that stops above it are the
 * same recipe with a different event list.
 */
function nightstandScene(shot, lt, t, o) {
  const d = shot.duration;
  const events = (shot.direction && shot.direction.events) || [];
  const at = (kind) => {
    const event = events.find((e) => e.kind === kind);
    return event ? event.t : null;
  };
  const ringAt = at("prop") ?? 0.3;
  const slamAt = at("slam");
  const handAt = at("hand");
  const slap = slamAt !== null && lt >= slamAt;
  const ringing = lt >= ringAt && !slap;
  const PHONE = { x: 700, y: 776 };
  const LX = 236;
  shotCam(shot, lt, d, W / 2, 560, 0.4, t);
  beginCam(ctx);
  officeRoom(t, { night: true });

  // The window, and the city that is still dark in it. It sits left of the bed
  // and above the stand, so the only bright shape behind the hand is the sky.
  officeWindow(400, 100, 620, 430, 1, t);

  // The bed he is still in: a pillow behind, a duvet in front, both cut by the
  // frame edge so the mass reads as a bed and not as a block.
  paper(ctx, () => tornRectPath(ctx, 1470, 408, 640, 260, 8, 31), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.5), edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 8, sy: 12,
  });
  paper(ctx, () => tornRectPath(ctx, 1450, 636, 820, 500, 8, 19), {
    fill: PAL.paper2, edge: C.rgba(PAL.ink, 0.55), edgeW: 3, shadow: C.rgba(PAL.ink, 0.28), sx: 0, sy: -10,
  });
  paper(ctx, () => tornRectPath(ctx, 1450, 676, 820, 56, 4, 13), {
    fill: PAL.paper3, edge: C.rgba(PAL.ink, 0.3), edgeW: 2, shadow: null,
  });

  // The nightstand: a top plate with a lit lip, a front that falls out of the
  // frame, one drawer, one knob. No more furniture than the story needs.
  paper(ctx, () => tornRectPath(ctx, -260, 690, 1800, 172, 8, 13), {
    fill: PAL.ink3, edge: C.rgba(PAL.ink, 0.6), edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 0, sy: 12,
  });
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = PAL.cream;
  ctx.fillRect(-260, 694, 1800, 12);
  ctx.restore();
  paper(ctx, () => tornRectPath(ctx, -260, 862, 1800, 340, 6, 23), {
    fill: C.shade(PAL.ink3, -22), edge: C.rgba(PAL.ink, 0.55), edgeW: 3, shadow: null,
  });
  paper(ctx, () => roundRectPath(ctx, 60, 916, 420, 128, 8), {
    fill: C.shade(PAL.ink3, -10), edge: C.rgba(PAL.ink, 0.5), edgeW: 2.4, shadow: null,
  });
  paper(ctx, () => blobPath(ctx, 270, 980, 16, 16, 9, 0.03, 4), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.6), edgeW: 2, shadow: null,
  });

  // The lamp: the one light in the film's first frame, and the reason the phone
  // has a shadow to its right.
  paper(ctx, () => roundRectPath(ctx, LX - 96, 836, 192, 26, 9), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.8), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.3), sx: 4, sy: 8,
  });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.8); ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(LX, 836); ctx.lineTo(LX, 790); ctx.stroke();
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(LX - 58, 700); ctx.lineTo(LX + 58, 700); ctx.lineTo(LX + 96, 792); ctx.lineTo(LX - 96, 792); ctx.closePath();
  }, { fill: PAL.gold, edge: C.rgba(PAL.ink, 0.65), edgeW: 3, shadow: C.rgba(PAL.ink, 0.3), sx: 6, sy: 10 });
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = PAL.goldL;
  ctx.beginPath(); ctx.ellipse(LX, 790, 92, 15, 0, 0, TAU); ctx.fill(); ctx.restore();

  // Night: the room falls away from the lamp. One radial of ink over the room
  // plates, so the frame has a lit side and a dark side without putting a
  // gradient on any object.
  const dark = ctx.createRadialGradient(LX, 800, 140, LX, 800, 1450);
  dark.addColorStop(0, C.rgba(PAL.ink, 0));
  dark.addColorStop(0.55, C.rgba(PAL.ink, 0.22));
  dark.addColorStop(1, C.rgba(PAL.ink, 0.44));
  ctx.save(); ctx.fillStyle = dark; ctx.fillRect(0, 0, W, H); ctx.restore();

  // The lamp's pool: one flat wash, so the whole frame is lit by one thing.
  const lamp = o.lamp ?? 0.5;
  const g = ctx.createRadialGradient(LX, 800, 40, LX, 800, lamp * 2200);
  g.addColorStop(0, C.rgba(PAL.goldL, 0.34));
  g.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();

  // The phone, lying flat and tilted: a slab, a screen, one printed band. Its
  // proportions are a phone's, not a remote's: 380 x 196 on the frame.
  ctx.save();
  ctx.translate(PHONE.x, PHONE.y);
  ctx.rotate(-0.075);
  const glow = ringing ? 0.55 + 0.45 * Math.abs(Math.sin(t * 14)) : 0.12;
  paper(ctx, () => roundRectPath(ctx, -190, -98, 380, 196, 26), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.85), edgeW: 4, shadow: C.rgba(PAL.ink, 0.36), sx: 14, sy: 22,
  });
  paper(ctx, () => roundRectPath(ctx, -164, -76, 328, 152, 12), {
    fill: ringing ? C.mix(PAL.ink, PAL.acid, glow * 0.5) : C.shade(PAL.ink, 14),
    edge: C.rgba(PAL.ink, 0.65), edgeW: 2, shadow: null,
  });
  // The hour on the phone is the film's own hour, printed from the shot's
  // caption: a 06:00 alarm can say 06:00 without inventing a single digit.
  const hour = String(shot.slots["content.caption"] || "").trim();
  if (hour) {
    TY.type(ctx, hour, -14, 24, fitSize(hour, 290, TS(14), "DMMono"), {
      copy: true,
      family: "DMMono", color: ringing ? PAL.acid : C.rgba(PAL.silver, 0.7), align: "center",
      edge: null, edgeW: 0, shadow: null, time: t, seed: 6, letter: 3,
    });
    ctx.fillStyle = ringing ? C.rgba(PAL.acid, 0.55) : C.rgba(PAL.silver, 0.3);
    ctx.fillRect(-60, 44, 92, 7);
  }
  ctx.beginPath(); ctx.arc(134, -40, 13, 0, TAU);
  ctx.fillStyle = ringing ? PAL.acid : C.rgba(PAL.silver, 0.5);
  ctx.fill();
  ctx.restore();

  if (ringing) {
    // The ripples keep coming for as long as the phone is ringing: they used to
    // run out one second after the ring began, which left a ringing phone with
    // a still frame around it.
    for (let i = 0; i < 3; i++) {
      const phase = (lt - ringAt) / 0.72 + i / 3;
      if (phase < 0) continue;
      const k = phase % 1;
      ctx.save();
      ctx.globalAlpha = (1 - k) * 0.42;
      ctx.strokeStyle = PAL.acid; ctx.lineWidth = 8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(PHONE.x + side * 250, PHONE.y, 60 + k * 150, -0.9 + (side < 0 ? Math.PI / 2 : 0), 0.9 + (side < 0 ? Math.PI / 2 : 0));
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // The hand. It enters on the score's own hand event, or 0.55 s before the slam
  // it is about to land; the version that stops above the phone stops short of
  // it and trembles there, because that is what the score says it does.
  //
  // It arrives as an arm with a sleeve, from the bed on the right, because that
  // is where the body is. A hand on its own reads as a sticker on the frame.
  if (o.hand !== false) {
    const REST = { x: 762, y: o.hover ? 596 : 676 };
    const enterFrom = handAt !== null ? handAt : slamAt !== null ? Math.max(0, slamAt - 0.55) : null;
    const inK = enterFrom === null ? 0 : C.clamp((lt - enterFrom) / 0.4);
    const outK = o.hover ? 0 : C.clamp((lt - (slamAt ?? Number.POSITIVE_INFINITY) - 0.16) / 0.34);
    const x = 2280 - C.easeOut(inK) * (2280 - REST.x) + C.easeIn(outK) * 1700;
    const y = 470 + C.easeOut(inK) * (REST.y - 470) - C.easeIn(outK) * 900;
    const rot = Math.PI - 0.55 + C.easeOut(inK) * 0.25;
    if (inK > 0 && lt < d) {
      const squash = slap ? 0.88 : 1;
      const tremble = o.hover ? Math.sin(t * 7) * 4 : 0;
      const S = 1.7;
      // The wrist is the palm's far edge, opposite the fingers, so the sleeve
      // starts where the hand ends instead of behind it.
      const wrist = { x: x - Math.cos(rot) * 58 * S, y: y - Math.sin(rot) * 58 * S };
      // the sleeve, then its cuff, then the hand on the end of both
      limb(ctx, wrist.x, wrist.y, 1600, 76, 104, -1.78, C.shade(PAL.blueD, -10));
      ctx.save();
      ctx.translate(wrist.x, wrist.y);
      ctx.rotate(-1.78);
      paper(ctx, () => roundRectPath(ctx, -50, 4, 100, 30, 9), {
        fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5,
      });
      ctx.restore();
      ctx.save();
      ctx.translate(x, y + tremble);
      // -1 on y puts the thumb on the near edge of the palm, where a hand that
      // is pressing something down has it; without the flip the thumb sits on
      // top of the hand like a mitten.
      ctx.scale(1, -squash);
      officeHand(0, 0, S, rot, {});
      ctx.restore();
    }
  }
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** The two versions of the same morning: the hand lands, or it does not. */
function alarmClose(shot, lt, t) {
  nightstandScene(shot, lt, t, { lamp: 0.5, hand: true });
}

/** 06:00 again — the same ring, and a hand that does not come down. */
function loopClose(shot, lt, t) {
  nightstandScene(shot, lt, t, { lamp: 0.46, hand: true, hover: true });
}

/** 07:20 — doors passing, and a figure who never arrives. */
function corridorWalk(shot, lt, t) {
  const d = shot.duration;
  shotCam(shot, lt, d, W / 2, 520, 0.16, t);
  beginCam(ctx);
  // wall, floor and ceiling: three flat plates
  ctx.fillStyle = PAL.paper2;
  ctx.fillRect(-300, -300, W + 600, H + 600);
  paper(ctx, () => tornRectPath(ctx, -300, 880, W + 600, 320, 6, 19), {
    fill: PAL.ink3, edge: C.rgba(PAL.ink, 0.55), edgeW: 3, shadow: C.rgba(PAL.ink, 0.2), sx: 0, sy: -10,
  });
  paper(ctx, () => tornRectPath(ctx, -300, -60, W + 600, 210, 6, 23), {
    fill: PAL.paper3, edge: C.rgba(PAL.ink, 0.4), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.2), sx: 0, sy: 8,
  });
  halftone(ctx, -200, 150, W + 400, 700, C.rgba(PAL.ink, 0.5), 26, 0.5, 0.08, 0.16);

  // floor seams, closer to the camera and faster than the doors
  const seamScroll = (lt * 170) % 240;
  ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = PAL.ink;
  for (let i = -1; i < 10; i++) {
    ctx.fillRect(60 + i * 240 - seamScroll, 884, 6, 196);
  }
  ctx.restore();

  // identical doors on one wall, scrolling left: the corridor is a loop
  const period = 430;
  const scroll = (lt * 96) % period;
  for (let i = -1; i < 6; i++) {
    const dx = 40 + i * period - scroll;
    paper(ctx, () => tornRectPath(ctx, dx, 236, 268, 660, 4, 11 + i * 7), {
      fill: C.shade(PAL.paper, 8), edge: C.rgba(PAL.ink, 0.55), edgeW: 3,
      shadow: C.rgba(PAL.ink, 0.22), sx: 8, sy: 12,
    });
    paper(ctx, () => roundRectPath(ctx, dx + 62, 300, 150, 156, 6), {
      fill: C.mix(PAL.sky, PAL.ink, 0.62), edge: C.rgba(PAL.ink, 0.55), edgeW: 2.6,
    });
    ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = PAL.cream;
    ctx.fillRect(dx + 68, 306, 46, 144);
    ctx.restore();
    paper(ctx, () => blobPath(ctx, dx + 226, 620, 12, 12, 9, 0.06, 4), {
      fill: PAL.gold, edge: C.rgba(PAL.ink, 0.5), edgeW: 1.6,
    });
    paper(ctx, () => tornRectPath(ctx, dx + 250, 236, 18, 660, 3, 3 + i), {
      fill: C.shade(PAL.paper2, -6), edge: C.rgba(PAL.ink, 0.25), edgeW: 1.5, shadow: null,
    });
  }
  // the far end of the corridor: darker, and never reached
  ctx.save();
  ctx.globalAlpha = 0.5; ctx.fillStyle = PAL.ink;
  ctx.fillRect(W - 150, 150, 210, 760);
  ctx.restore();

  const lead = castIn(shot, 0);
  if (lead) {
    // A step cycle, not a step pose: the feet trade places and the body bobs on
    // the beat. A walk that holds both legs in the same straddle is a statue
    // sliding along a corridor, which is what this shot used to be.
    const stride = Math.sin(t * 5.4);
    officeActor(shot, lt, t, lead, 900, 1030, 1.12, null, 1, {
      bounce: (value) => value || 0,
      footL: () => [-24 - 16 * stride, -8 - 14 * Math.max(0, stride)],
      footR: () => [26 + 16 * stride, -8 - 14 * Math.max(0, -stride)],
    });
  }
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** 09:00 and 13:00 — the desk under a light that does not change. */
function deskWide(shot, lt, t) {
  const d = shot.duration;
  const rows = officeBuildRows(shot, lt);
  const landing = ((shot.direction && shot.direction.events) || []).filter(
    (event) => event.kind === "build" && Math.abs(event.t - lt) < 0.12,
  );
  shotCam(shot, lt, d, W / 2, 540, 0.28, t);
  beginCam(ctx);
  officeRoom(t);
  officeFluor(W / 2 + 40, 30, 1000, 1, t);
  // The room has a window, and it is the same window in every shot of it: what
  // changes is the sky, and the sky is the hour the shot prints.
  officeWindow(1210, 146, 600, 430, officeDaySky(shot.slots["content.caption"]), t);
  const lead = castIn(shot, 0);
  if (lead) {
    officeSeated(shot, lt, t, lead, 860);
  }
  officeMonitor(1190, OFFICE.desk + 4, 1.1, { glow: 0.7 });
  officeDesk();
  officeSheet(860, OFFICE.desk + 28, 1);
  officeDeskThings(430, OFFICE.desk + 40, 1.0, {});
  officeStack(1560, OFFICE.desk + 6, rows, t);
  if (landing.length) {
    const k = C.clamp((lt - landing[0].t) / 0.3);
    ctx.save(); ctx.globalAlpha = (1 - k) * 0.4; ctx.fillStyle = PAL.cream;
    ctx.fillRect(1460, OFFICE.desk - rows * 24 - 80, 280, 10);
    ctx.restore();
  }
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** 18:00 — nine hours, and the window does the telling. */
function windowDusk(shot, lt, t) {
  const d = shot.duration;
  const rows = officeBuildRows(shot, lt);
  const k = C.clamp(lt / d);
  const sky = k < 0.55 ? C.clamp(k / 0.55) * 0.5 : 0.5 + C.clamp((k - 0.55) / 0.45) * 0.5;
  shotCam(shot, lt, d, W / 2 - 60, 520, 0.14, t);
  beginCam(ctx);
  officeRoom(t);
  officeWindow(1080, 176, 640, 540, sky, t);
  const lead = castIn(shot, 0);
  if (lead) {
    officeSeated(shot, lt, t, lead, 830);
  }
  officeMonitor(1160, OFFICE.desk + 4, 1.05, { glow: 0.35 });
  officeDesk({ night: sky > 0.7 });
  officeSheet(830, OFFICE.desk + 28, 1, { night: sky > 0.7 });
  officeDeskThings(400, OFFICE.desk + 40, 1.0, {});
  officeStack(1520, OFFICE.desk + 6, rows, t);
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** 16:00 - a supervisor arrives, points at the stack, and leaves. */
function supervisorPoint(shot, lt, t) {
  const d = shot.duration;
  const rows = officeBuildRows(shot, lt);
  const enter = C.clamp((lt - 0.15) / 1.3);
  const leave = C.clamp((lt - (d - 1.5)) / 1.3);
  // He arrives along the desk and stops between Kiran and the stack.
  //
  // He used to be drawn AFTER the desk, at a smaller scale than the man behind
  // it — a figure in front of the furniture, the wrong size for the depth he
  // was standing at, walking on a floor he was a hundred pixels below, with the
  // paper stack behind his coat. One ground plane and one scale: he stands where
  // his colleague sits, behind the same desk. The power in the shot is his
  // posture, not a faked perspective.
  const vx = 1980 - C.easeOut(enter) * 800 + C.easeIn(leave) * 900;
  shotCam(shot, lt, d, W / 2 + 40, 540, 0.2, t);
  beginCam(ctx);
  officeRoom(t);
  officeFluor(W / 2, 30, 1100, 1, t);
  const boss = castIn(shot, 1);
  const lead = castIn(shot, 0);
  // Both men look at the stack — the thing the scene is about. A shared eyeline
  // on the object of the film, not two cut-outs facing the lens.
  const stack = C.clamp((lt - 0.9) / 0.8);
  if (lead) {
    officeSeated(shot, lt, t, lead, 680, {
      headTurn: 0.34 * stack,
      headTilt: 0.1 * stack,
    });
  }
  if (boss) {
    officeActor(shot, lt, t, boss, vx, OFFICE.seated, 1.5, null, -1, {
      bounce: (value) => value || 0,
      headTurn: 0.3 * C.clamp((lt - 1.4) / 0.7),
      headTilt: -0.06 * C.clamp((lt - 1.4) / 0.7),
    });
  }
  officeMonitor(1000, OFFICE.desk + 4, 1.05, { glow: 0.6 });
  officeDesk();
  officeSheet(680, OFFICE.desk + 28, 1);
  officeStack(1500, OFFICE.desk + 6, rows, t);
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** 21:00 — the light is off, one lamp is on, and the stack is as tall as he is. */
function deskNight(shot, lt, t) {
  const d = shot.duration;
  const rows = officeBuildRows(shot, lt);
  shotCam(shot, lt, d, W / 2 - 40, 540, 0.22, t);
  beginCam(ctx);
  officeRoom(t, { night: true });
  officeFluor(W / 2 + 40, 30, 1000, 0, t);
  // The same window, at the hour it has nothing to say: the city is lit and the
  // room is not.
  officeWindow(1210, 146, 600, 430, 1, t);
  // the one lamp: a paper shade and a flat pool
  const g = ctx.createRadialGradient(560, 640, 30, 560, 640, 560);
  g.addColorStop(0, C.rgba(PAL.goldL, 0.3));
  g.addColorStop(1, C.rgba(PAL.goldL, 0));
  ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  // and the room falls away from it, the same way the bedroom does
  const dark = ctx.createRadialGradient(560, 640, 160, 560, 640, 1400);
  dark.addColorStop(0, C.rgba(PAL.ink, 0));
  dark.addColorStop(0.6, C.rgba(PAL.ink, 0.24));
  dark.addColorStop(1, C.rgba(PAL.ink, 0.46));
  ctx.save(); ctx.fillStyle = dark; ctx.fillRect(0, 0, W, H); ctx.restore();
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(520, 470); ctx.lineTo(620, 470); ctx.lineTo(652, 560); ctx.lineTo(488, 560); ctx.closePath();
  }, { fill: PAL.gold, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.6, shadow: C.rgba(PAL.ink, 0.3), sx: 5, sy: 9 });
  ctx.strokeStyle = C.rgba(PAL.ink, 0.7); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(570, 560); ctx.lineTo(570, 780); ctx.stroke();
  const lead = castIn(shot, 0);
  if (lead) {
    officeSeated(shot, lt, t, lead, 930);
  }
  officeMonitor(1250, OFFICE.desk + 4, 1.15, { glow: 1 });
  officeDesk({ night: true });
  officeSheet(930, OFFICE.desk + 28, 1, { night: true });
  officeStack(1660, OFFICE.desk + 6, rows, t);
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/** The end card: the title, one line, and nothing else. */
function loopCard(shot, lt, t) {
  const d = shot.duration;
  const land = C.clamp(lt / 0.6);
  shotCam(shot, lt, d, W / 2, 520, 0, t);
  beginCam(ctx);
  ctx.fillStyle = PAL.paper;
  ctx.fillRect(-300, -300, W + 600, H + 600);
  paper(ctx, () => tornRectPath(ctx, 150, 120, W - 300, H - 240, 9, 37), {
    fill: PAL.cream, edge: C.rgba(PAL.ink, 0.5), edgeW: 3, shadow: C.rgba(PAL.ink, 0.24), sx: 10, sy: 16,
  });
  halftone(ctx, 170, 140, W - 340, H - 280, C.rgba(PAL.ink, 0.5), 22, 0.5, 0.1, 0.2);
  // a paper alarm bell, drawn flat, top right of the card
  ctx.save();
  ctx.translate(W - 500, 340);
  ctx.rotate(-0.04);
  // handle
  ctx.strokeStyle = C.rgba(PAL.ink, 0.8); ctx.lineWidth = 13;
  ctx.beginPath(); ctx.arc(0, -104, 26, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
  // body: a dome that flares to a lip
  paper(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(-118, 44);
    ctx.bezierCurveTo(-104, -46, -66, -96, 0, -96);
    ctx.bezierCurveTo(66, -96, 104, -46, 118, 44);
    ctx.quadraticCurveTo(60, 58, 0, 58);
    ctx.quadraticCurveTo(-60, 58, -118, 44);
    ctx.closePath();
  }, { fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 3, shadow: C.rgba(PAL.ink, 0.26), sx: 6, sy: 10 });
  // a lit side, so the paper has a light direction like everything else
  ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = PAL.redL;
  ctx.beginPath();
  ctx.ellipse(-46, -26, 26, 62, 0.18, 0, TAU); ctx.fill();
  ctx.restore();
  // lip
  paper(ctx, () => roundRectPath(ctx, -130, 50, 260, 22, 9), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.7), edgeW: 2,
  });
  // clapper
  ctx.strokeStyle = C.rgba(PAL.ink, 0.7); ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, 72); ctx.lineTo(0, 92); ctx.stroke();
  paper(ctx, () => blobPath(ctx, 0, 104, 17, 17, 9, 0.05, 6), { fill: PAL.gold, edge: C.rgba(PAL.ink, 0.6), edgeW: 2 });
  ctx.restore();
  // The type is drawn inside the camera with the card it is printed on. A card
  // that moves while its title does not reads as a compositing mistake, which is
  // what it is; the camera is a slow push, so card and type push together.
  // Sizes are phone-scale, like every other recipe: TS(32) is 158 px at 1920.
  const title = shot.slots["content.title"] || "";
  if (title) {
    const titleIn = C.clamp((lt - 0.4) / 0.4);
    ctx.save();
    ctx.globalAlpha = titleIn;
    ctx.translate(0, (1 - C.backOut(titleIn)) * 40);
    TY.type(ctx, title, 250, 560, fitSize(title, 1000, TS(32)), {
      copy: true,
      family: "Anton", color: PAL.ink, edge: PAL.cream, edgeW: 10,
      shadow: C.rgba(PAL.ink, 0.28), shadowOff: 9, time: t, seed: 5,
    });
    ctx.restore();
  }
  const body = shot.slots["content.body"] || "";
  if (body) {
    ctx.save();
    ctx.globalAlpha = C.clamp((lt - 1.1) / 0.5);
    ctx.fillStyle = PAL.red;
    ctx.fillRect(252, 620, 220, 12);
    const size = fitSize(body, 900, TS(14), "Archivo Black");
    TY.type(ctx, body, 252, 700, size, {
      copy: true,
      family: "Archivo Black", color: PAL.ink, align: "left",
      edge: null, edgeW: 0, shadow: C.rgba(PAL.ink, 0.18), shadowOff: 4, time: t, seed: 11,
    });
    ctx.restore();
  }
  endCam(ctx);
  officeHourTab(shot.slots["content.caption"], t);
}

/* The registry the painter reads: a recipe id, and the function that draws it. */
/* ---- the explainer set (paper-kpop 0.2.1) --------------------------------
 *
 * A business explainer needs a phone, a map, a fare, an app menu, a network and
 * money — not a bedroom lamp. These recipes draw those subjects on the same
 * paper stage, so a shot can choose the image the line actually needs. The
 * visual brief names the subject; `visual:check` matches it to `subjects`.
 */

function explainerCaption(shot, t) {
  officeHourTab(shot.slots["content.caption"], t);
}

function explainerBody(shot, t, x = 120, y = 930, width = 1600) {
  const body = shot.slots["content.body"] || "";
  if (!body) return;
  TY.type(ctx, body, x, y, fitSize(body, width, TS(32)), {
    copy: true, align: "left", color: PAL.ink, edge: PAL.cream, edgeW: 10,
    shadow: C.rgba(PAL.ink, 0.24), shadowOff: 5, time: t, seed: 11,
  });
}

/** Stage a film character in an explainer recipe. New character, same rig. */
function explainerActor(shot, lt, t, index, x, y, scale) {
  const who = (shot.direction?.cast ?? [])[index];
  if (!who) return null;
  const slot = (key, fallback) => {
    const value = Number(shot.slots?.[`stage.${key}${index}`] ?? shot.slots?.[`stage.${key}`]);
    return Number.isFinite(value) ? value : fallback;
  };
  return officeActor(shot, lt, t, who, slot("x", x), slot("y", y), slot("scale", scale), null, 1, {});
}

/**
 * The paper wings: a bright cobalt field and a tomato-red field, torn, with a
 * halftone screen. They are the channel's colour on every explainer shot; the
 * diagram or prop lives on the cream centre between them.
 */
function explainerWings(shot) {
  // Off by default. A film may re-enable the wings only by declaring them; the
  // reference stage is full-bleed, not a cream plate framed by two bars.
  if (!shot || shot.slots?.["stage.wings"] !== "1") return;
  paper(ctx, () => tornRectPath(ctx, -140, -90, 580, H + 180, 30, 17), {
    fill: PAL.blue, edge: C.rgba(PAL.ink, 0.6), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.24), sx: 10, sy: 14,
  });
  paper(ctx, () => tornRectPath(ctx, W - 430, -90, 580, H + 180, 26, 31), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.24), sx: -10, sy: 14,
  });
  // The gold seam is the pack's accent: a thin torn strip where the colour
  // field meets the cream stage, present in every explainer frame.
  paper(ctx, () => tornRectPath(ctx, 408, -90, 54, H + 180, 10, 23), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.55), edgeW: 2, shadow: null,
  });
  paper(ctx, () => tornRectPath(ctx, W - 462, -90, 54, H + 180, 10, 29), {
    fill: PAL.gold, edge: C.rgba(PAL.ink, 0.55), edgeW: 2, shadow: null,
  });
  halftone(ctx, -100, -60, 500, H + 120, PAL.ink, 22, 0.5, 0.1);
  halftone(ctx, W - 400, -60, 500, H + 120, PAL.ink, 22, 0.5, 0.1);
}

function paperPhone(x, y, w, h) {
  paper(ctx, () => roundRectPath(ctx, x, y, w, h, 46), {
    fill: PAL.ink, edge: C.rgba(PAL.ink, 0.8), edgeW: 4,
    shadow: C.rgba(PAL.ink, 0.28), sx: 14, sy: 22,
  });
  paper(ctx, () => roundRectPath(ctx, x + 26, y + 34, w - 52, h - 68, 26), {
    fill: PAL.paper2, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
  });
  ctx.save();
  ctx.fillStyle = C.rgba(PAL.ink, 0.55);
  ctx.beginPath(); ctx.ellipse(x + w / 2, y + 18, 34, 5, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

function routePoints(k, points) {
  // Draw a partial polyline through the points; k in 0..1.
  const total = points.length - 1;
  const upto = k * total;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const t = Math.min(1, Math.max(0, upto - (i - 1)));
    if (t <= 0) break;
    const a = points[i - 1], b = points[i];
    ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
    if (t < 1) break;
  }
  ctx.stroke();
}

function routeAt(k, points) {
  const total = points.length - 1;
  const upto = Math.min(total, Math.max(0, k * total));
  const i = Math.min(total - 1, Math.floor(upto));
  const t = upto - i;
  const a = points[i], b = points[i + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function phoneRoute(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2, 520, 0.18, t);
  beginCam(ctx);
  ctx.save();
  ctx.translate(Math.sin(t * 1.35) * 10, Math.cos(t * 1.15) * 8);
  explainerWings(shot);
  explainerActor(shot, lt, t, 0, 270, 1015, 1.25);
  // The phone is a prop beside the performer, not the stage. Shift it right so
  // the star keeps a clean field around them.
  ctx.save();
  ctx.translate(430, 0);
  paper(ctx, () => tornRectPath(ctx, 430, 70, 1060, 940, 22, 19), {
    fill: PAL.ink3, edge: C.rgba(PAL.ink, 0.4), edgeW: 3,
    shadow: C.rgba(PAL.ink, 0.2), sx: 12, sy: 16,
  });
  paperPhone(610, 120, 700, 850);
  const sx = 636, sy = 154, sw = 648, sh = 782;
  ctx.save();
  ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  ctx.fillStyle = PAL.cream; ctx.fillRect(sx, sy, sw, sh);
  // paper city blocks
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const bx = sx + 26 + col * 156 + (row % 2) * 22;
      const by = sy + 30 + row * 146;
      paper(ctx, () => roundRectPath(ctx, bx, by, 112, 92, 8), {
        fill: C.rgba(PAL.blueL, 0.16 + (row + col) % 3 * 0.05), edge: C.rgba(PAL.ink, 0.14), edgeW: 1,
      });
    }
  }
  ctx.strokeStyle = C.rgba(PAL.ink, 0.12); ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(sx + i * 156, sy); ctx.lineTo(sx + i * 156, sy + sh); ctx.stroke();
  }
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(sx, sy + i * 146); ctx.lineTo(sx + sw, sy + i * 146); ctx.stroke();
  }
  const points = [[700, 780], [780, 640], [940, 610], [980, 430], [1180, 380], [1230, 250]];
  const k = C.smooth(C.clamp((lt - 0.35) / 1.6));
  ctx.strokeStyle = PAL.red; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.lineJoin = "round";
  routePoints(k, points);
  const pin = (x, y, fill, label) => {
    paper(ctx, () => blobPath(ctx, x, y - 20, 18, 22, 6, 0.02, 4), { fill, edge: PAL.ink, edgeW: 3 });
    ctx.fillStyle = PAL.cream; ctx.beginPath(); ctx.arc(x, y - 22, 6, 0, TAU); ctx.fill();
    TY.text(ctx, label, x, y + 14, 18, { family: "DMMono", color: PAL.ink, align: "center" });
  };
  pin(700, 790, PAL.blueL, "RIDER");
  pin(1230, 260, PAL.gold, "DRIVER");
  const at = routeAt(k, points);
  ctx.save();
  ctx.translate(at[0] - 22, at[1] - 12);
  ctx.rotate(-0.2);
  paper(ctx, () => roundRectPath(ctx, 0, 0, 44, 22, 5), { fill: PAL.red, edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = PAL.ink;
  ctx.beginPath(); ctx.arc(10, 24, 5, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(34, 24, 5, 0, TAU); ctx.fill();
  ctx.restore();
  // the thumb taps the route
  const tap = C.clamp((lt - 0.15) / 0.25);
  ctx.save();
  ctx.globalAlpha = tap;
  paper(ctx, () => blobPath(ctx, 760, 800 - tap * 26, 26, 34, 12, 0.04, 5), { fill: PAL.cream, edge: PAL.ink, edgeW: 3 });
  ctx.restore();
  ctx.restore();
  ctx.restore();
  ctx.restore();
  endCam(ctx);
  explainerCaption(shot, t);
}

function cityRoute(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2 + 30, 520, 0.16, t);
  beginCam(ctx);
  // paper city: blocks and streets
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const bx = 60 + col * 270 + (row % 2) * 40;
      const by = 100 + row * 220;
      paper(ctx, () => tornRectPath(ctx, bx, by, 210, 150, 8, 13 + col), {
        fill: C.rgba(PAL.blueL, 0.12 + (row + col) % 3 * 0.05),
        edge: C.rgba(PAL.ink, 0.18), edgeW: 1.5,
      });
    }
  }
  explainerWings(shot);
  const points = [[260, 820], [460, 760], [520, 560], [860, 520], [1040, 360], [1440, 300], [1760, 420]];
  const k = C.smooth(C.clamp((lt - 0.2) / 1.8));
  ctx.strokeStyle = PAL.red; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round";
  routePoints(k, points);
  const at = routeAt(k, points);
  ctx.save();
  ctx.translate(at[0], at[1] - 16);
  ctx.rotate(-0.16);
  paper(ctx, () => roundRectPath(ctx, -60, -26, 120, 52, 12), { fill: PAL.red, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.28), sx: 6, sy: 10 });
  paper(ctx, () => roundRectPath(ctx, -38, -48, 76, 28, 8), { fill: PAL.cream, edge: PAL.ink, edgeW: 2 });
  ctx.fillStyle = PAL.ink;
  for (const wx of [-38, 38]) { ctx.beginPath(); ctx.arc(wx, 30, 13, 0, TAU); ctx.fill(); }
  ctx.fillStyle = PAL.cream;
  for (const wx of [-38, 38]) { ctx.beginPath(); ctx.arc(wx, 30, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = PAL.ink;
  for (const [px, py, label] of [[260, 850, "RIDER"], [1760, 450, "DRIVER"]]) {
    paper(ctx, () => blobPath(ctx, px, py - 24, 18, 22, 6, 0.02, 4), { fill: PAL.gold, edge: PAL.ink, edgeW: 3 });
    TY.text(ctx, label, px, py + 16, 18, { family: "DMMono", color: PAL.ink, align: "center" });
  }
  // The performer stands in the city, not behind it: a figure the blocks hide
  // is not on stage.
  explainerActor(shot, lt, t, 0, 300, 1035, 1.2);
  endCam(ctx);
  explainerCaption(shot, t);
}

function fareSplit(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2, 520, 0.12, t);
  beginCam(ctx);
  ctx.save();
  ctx.translate(Math.sin(t * 1.2) * 36, Math.cos(t * 1.4) * 20);
  explainerWings(shot);
  explainerActor(shot, lt, t, 0, 170, 1015, 1.1);
  explainerActor(shot, lt, t, 1, 1750, 1015, 1.1);
  const x = 500, y = 120, w = 920, h = 210;
  const split = 0.72 + Math.sin(lt * 2.1) * 0.006;
  paper(ctx, () => roundRectPath(ctx, x, y, w, h, 26), {
    fill: PAL.blueL, edge: C.rgba(PAL.ink, 0.6), edgeW: 4, shadow: C.rgba(PAL.ink, 0.24), sx: 10, sy: 14,
  });
  paper(ctx, () => roundRectPath(ctx, x + w * split, y, w * (1 - split), h, 26), {
    fill: PAL.red, edge: C.rgba(PAL.ink, 0.6), edgeW: 4, shadow: C.rgba(PAL.ink, 0.24), sx: 10, sy: 14,
  });
  ctx.save();
  ctx.strokeStyle = PAL.cream; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x + w * split, y - 18); ctx.lineTo(x + w * split, y + h + 18); ctx.stroke();
  ctx.restore();
  TY.text(ctx, "DRIVER", x + 80, y + 92, 52, { family: "Archivo Black", color: PAL.ink });
  TY.text(ctx, "KEEPS THE REST", x + 80, y + 148, 26, { family: "DMMono", color: PAL.ink });
  TY.text(ctx, "UBER", x + w * split + 34, y + 92, 46, { family: "Archivo Black", color: PAL.cream });
  TY.text(ctx, "SERVICE FEE", x + w * split + 34, y + 148, 24, { family: "DMMono", color: PAL.cream });
  // one coin is the thing being divided
  const sweep = (lt * 300) % w;
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = PAL.cream;
  ctx.fillRect(x + sweep, y, 54, h);
  ctx.restore();
  paper(ctx, () => blobPath(ctx, 960, 760, 56, 56, 28, 0.02, 7), { fill: PAL.gold, edge: PAL.ink, edgeW: 3, shadow: C.rgba(PAL.ink, 0.24), sx: 5, sy: 8 });
  TY.text(ctx, "$", 960, 778, 40, { family: "Archivo Black", color: PAL.ink, align: "center" });
  ctx.restore();
  endCam(ctx);
  explainerCaption(shot, t);
  explainerBody(shot, t, 260, 940, 1400);
}

function appMenu(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2, 520, 0.12, t);
  beginCam(ctx);
  ctx.save();
  ctx.translate(Math.sin(t * 1.45) * 30, Math.cos(t * 1.2) * 20);
  explainerWings(shot);
  explainerActor(shot, lt, t, 0, 260, 1030, 1.3);
  // The app is a prop, not a wall. The phone moves right so the performer's
  // aperture ring is field, not cream screen.
  ctx.save();
  ctx.translate(320, 0);
  paperPhone(760, 90, 400, 820);
  const sx = 786, sy = 124, sw = 348, sh = 752;
  ctx.save();
  ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip();
  ctx.fillStyle = PAL.cream; ctx.fillRect(sx, sy, sw, sh);
  TY.text(ctx, "UBER", sx + 28, sy + 54, 34, { family: "Archivo Black", color: PAL.ink });
  const tiles = [
    ["RIDES", PAL.blueL, "car"],
    ["DELIVERY", PAL.gold, "bag"],
    ["FREIGHT", PAL.red, "crate"],
    ["UBER ONE", PAL.ink, "card"],
  ];
  tiles.forEach(([label, fill, icon], index) => {
    const col = index % 2, row = Math.floor(index / 2);
    const tx = sx + 22 + col * 158, ty = sy + 90 + row * 190;
    const appear = C.clamp((lt - 0.2 - index * 0.18) / 0.35);
    ctx.save();
    ctx.globalAlpha = appear;
    ctx.translate(tx + 68, ty + 74 + Math.sin(t * 2.6 + index) * 5);
    ctx.scale(0.8 + 0.2 * C.backOut(appear), 0.8 + 0.2 * C.backOut(appear));
    paper(ctx, () => roundRectPath(ctx, -68, -74, 136, 148, 16), {
      fill, edge: C.rgba(PAL.ink, 0.6), edgeW: 3, shadow: C.rgba(PAL.ink, 0.2), sx: 5, sy: 8,
    });
    ctx.fillStyle = fill === PAL.ink ? PAL.cream : PAL.ink;
    if (icon === "car") {
      ctx.fillRect(-30, -10, 60, 24);
      ctx.beginPath(); ctx.arc(-18, 18, 8, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(18, 18, 8, 0, TAU); ctx.fill();
    } else if (icon === "bag") {
      ctx.fillRect(-26, -4, 52, 44);
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, -4, 18, Math.PI, TAU); ctx.stroke();
    } else if (icon === "crate") {
      ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 6;
      ctx.strokeRect(-28, -22, 56, 48);
      ctx.beginPath(); ctx.moveTo(-28, -22); ctx.lineTo(28, 26); ctx.moveTo(28, -22); ctx.lineTo(-28, 26); ctx.stroke();
    } else {
      ctx.fillRect(-34, -18, 68, 44);
      ctx.fillStyle = fill === PAL.ink ? PAL.gold : PAL.cream;
      ctx.fillRect(-34, -4, 68, 8);
    }
    ctx.fillStyle = fill === PAL.ink ? PAL.cream : PAL.ink;
    ctx.font = "600 26px DMMono";
    ctx.textAlign = "center";
    ctx.fillText(label, 0, 58);
    ctx.textAlign = "left";
    ctx.restore();
  });
  ctx.restore();
  ctx.restore();
  ctx.restore();
  endCam(ctx);
  explainerCaption(shot, t);
  explainerBody(shot, t, 560, 940, 800);
}

function networkWeb(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2, 520, 0.14, t);
  beginCam(ctx);
  ctx.save();
  ctx.translate(Math.sin(t * 1.25) * 32, Math.cos(t * 1.1) * 22);
  explainerWings(shot);
  explainerActor(shot, lt, t, 0, 250, 1035, 1.05);
  explainerActor(shot, lt, t, 1, 1660, 1035, 1.05);
  const nodes = [
    [360, 300, 0], [600, 210, 1], [820, 330, 0], [1060, 220, 1], [1260, 360, 0],
    [500, 520, 1], [760, 560, 0], [1020, 520, 1], [1240, 600, 0], [620, 740, 1], [960, 760, 0],
  ];
  const live = nodes.map(([x, y, kind], index) => [
    x + Math.sin(t * 2.1 + index * 0.9) * 38,
    y + Math.cos(t * 1.7 + index * 0.7) * 28,
    kind,
  ]);
  const grow = C.smooth(C.clamp(lt / Math.max(1, d * 0.7)));
  const links = [[0,1],[1,2],[2,3],[3,4],[0,5],[2,6],[5,6],[6,7],[7,8],[5,9],[7,9],[9,10],[6,10],[8,10],[1,6],[3,7]];
  ctx.strokeStyle = C.rgba(PAL.ink, 0.28); ctx.lineWidth = 3;
  for (const [a, b] of links) {
    const pa = live[a], pb = live[b];
    const k = C.clamp(grow * 1.2 - (a + b) * 0.02);
    if (k <= 0) continue;
    ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pa[0] + (pb[0] - pa[0]) * k, pa[1] + (pb[1] - pa[1]) * k); ctx.stroke();
  }
  live.forEach(([x, y, kind], index) => {
    const k = C.clamp((grow - index * 0.035) / 0.2);
    if (k <= 0) return;
    const r = (20 + 8 * C.backOut(k)) * (1 + 0.12 * Math.sin(t * 3 + index));
    paper(ctx, () => blobPath(ctx, x, y, r, r, 9, 0.02, 5), {
      fill: kind === 0 ? PAL.blueL : PAL.gold, edge: C.rgba(PAL.ink, 0.55), edgeW: 2.5,
      shadow: C.rgba(PAL.ink, 0.16), sx: 3, sy: 5,
    });
  });
  // the wait meter: a paper bar that shrinks as the network fills
  const wait = 0.82 - grow * 0.46;
  paper(ctx, () => roundRectPath(ctx, 520, 860, 880, 46, 22), { fill: PAL.paper2, edge: C.rgba(PAL.ink, 0.45), edgeW: 2 });
  paper(ctx, () => roundRectPath(ctx, 524, 864, 872 * wait, 38, 19), { fill: PAL.red, edge: C.rgba(PAL.ink, 0.4), edgeW: 1.5 });
  TY.text(ctx, "WAIT", 520, 936, 20, { family: "DMMono", color: PAL.ink });
  TY.text(ctx, "RIDERS", 360, 260, 18, { family: "DMMono", color: PAL.ink, align: "center" });
  TY.text(ctx, "DRIVERS", 1260, 320, 18, { family: "DMMono", color: PAL.ink, align: "center" });
  ctx.restore();
  endCam(ctx);
  explainerCaption(shot, t);
  explainerBody(shot, t, 500, 980, 920);
}

function moneyFlow(shot, lt, t) {
  const d = shot.duration;
  bgPaper(shot);
  shotCam(shot, lt, d, W / 2, 520, 0.12, t);
  beginCam(ctx);
  explainerWings(shot);
  explainerActor(shot, lt, t, 0, 420, 1030, 1.0);
  explainerActor(shot, lt, t, 1, 1500, 1030, 0.95);
  const labels = [
    [300, "RIDER", PAL.blueL],
    [960, "DRIVER", PAL.cream],
    [1580, "UBER", PAL.red],
  ];
  for (const [x, label, fill] of labels) {
    paper(ctx, () => tornRectPath(ctx, x - 150, 470, 300, 200, 16, 13), {
      fill, edge: C.rgba(PAL.ink, 0.55), edgeW: 3, shadow: C.rgba(PAL.ink, 0.2), sx: 6, sy: 10,
    });
    TY.text(ctx, label, x, 570, 34, { family: "Archivo Black", color: fill === PAL.red ? PAL.cream : PAL.ink, align: "center" });
  }
  // coins leaving the rider, most stopping at the driver, a small one at Uber
  const k = C.smooth(C.clamp((lt - 0.2) / 1.8));
  for (let i = 0; i < 5; i++) {
    const phase = C.clamp(k * 1.35 - i * 0.08);
    if (phase <= 0) continue;
    const from = 300, to = i < 4 ? 960 : 1580;
    const x = from + (to - from) * phase;
    const y = 360 - Math.sin(phase * Math.PI) * 120;
    paper(ctx, () => blobPath(ctx, x, y, 34, 34, 17, 0.02, 5), {
      fill: PAL.gold, edge: PAL.ink, edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.2), sx: 3, sy: 5,
    });
    // The coin shape is the symbol; a `$` on every coin is a label wall and
    // can land on a face.
  }
  ctx.strokeStyle = C.rgba(PAL.ink, 0.42); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(450, 730); ctx.lineTo(810, 730); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1110, 730); ctx.lineTo(1430, 730); ctx.stroke();
  endCam(ctx);
  explainerCaption(shot, t);
  explainerBody(shot, t, 500, 980, 920);
}

Object.assign(window.PAPER_BACKEND.shots, {
  phone_route: phoneRoute,
  city_route: cityRoute,
  fare_split: fareSplit,
  app_menu: appMenu,
  network_web: networkWeb,
  money_flow: moneyFlow,
});

Object.assign(window.PAPER_BACKEND.shots, {
  alarm_close: alarmClose,
  corridor_walk: corridorWalk,
  desk_wide: deskWide,
  desk_night: deskNight,
  supervisor_point: supervisorPoint,
  window_dusk: windowDusk,
  loop_close: loopClose,
  loop_card: loopCard,
});

