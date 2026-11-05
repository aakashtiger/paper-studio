import type { PoseLibrary } from "./pose.js";
import { REVIEW_CHROME } from "./grid.js";

export type SheetFont = { family: string; file: string };

/**
 * The three faces the sheet draws with, taken from the pack's `tokens.json`.
 * The sheet never hardcodes a typeface: a watercolor pack draws in its own.
 */
export type SheetFonts = { dir: string; display: SheetFont; body: SheetFont; mono: SheetFont };

export type SheetOptions = {
  character: string;
  rig: string;
  anchors: string[];
  library: PoseLibrary;
  vendor: string;
  fonts: SheetFonts;
  /**
   * Scripts beside the five the pack always has, in load order.
   *
   * A film registers its own rigs in its own vendor file (`office.js` registers
   * `worker@0.1.0` and `supervisor@0.1.0`), and a sheet that draws those rigs has
   * to load the file that defines them. They are passed in rather than assumed,
   * because the sheet must not care which file a film put its cast in.
   */
  extra: string[];
};

/**
 * Which rig the sheet is drawing, from the rig id alone.
 *
 * The pack ships two rigs and the sheet knows their joint numbers, so it can
 * draw a joint map, four detail zooms and a face crop without measuring
 * anything. A **film** brings its own cast, drawn by the film's pinned vendor
 * under a rig id the pack has never seen (`worker@0.1.0`); the sheet draws it
 * through `window.CHARACTERS[rig]` and asks the rig where its parts are, because
 * an assumption about someone else's rig is how a sheet ends up showing a
 * character that the film does not draw.
 */
export type SheetKind = "idol" | "mira" | "film";

/**
 * The pack's two rigs by id; anything else is a film-local rig.
 *
 * This no longer throws on an unknown rig. It did, and the first real film —
 * whose cast is `worker@0.1.0` and `supervisor@0.1.0` — could not produce a pose
 * sheet at all, so the review surface refused a legitimate film. Whether the
 * film's vendor actually registers the rig is checked by `scripts/sheet.ts`
 * against the vendor it pins, which is a better place for it: that is the file
 * the film will draw with.
 */
export function sheetRigKind(rig: string): SheetKind {
  if (rig.startsWith("idol@")) return "idol";
  if (rig.startsWith("mira@")) return "mira";
  return "film";
}

const FACE: Record<string, Record<string, unknown>> = {
  neutral: { eyes: "normal", mouth: "smile", blush: 0.35 },
  smile: { eyes: "happy", mouth: "grin", blush: 0.6 },
  surprise: { eyes: "normal", mouth: "o", blush: 0.4, look: [0, -0.1] },
  tender: { eyes: "happy", mouth: "smile", blush: 0.5, look: [0.2, 0.2] },
  alarm: { eyes: "normal", mouth: "o", blush: 0.2, look: [0, 0.1] },
};

const HEADER = 180;
const POSE_W = 440;
const POSE_H = 470;
const GAP = 20;
const RIG_H = 240;
const VIEW_H = 300;
const DETAIL_H = 240;
const EXPR_H = 260;
const X0 = 64;
const COLS = 4;

export function sheetHeight(library: PoseLibrary, kind: SheetKind = "idol"): number {
  const poseRows = Math.ceil(library.poses.length / COLS);
  const exprRows = Math.ceil(library.expressions.length / COLS);
  // The detail row zooms on joints the sheet can only place for the pack's own
  // rigs. A film-local rig gets the space back rather than an empty band.
  const details = kind === "film" ? 0 : DETAIL_H + GAP;
  return (
    HEADER +
    poseRows * (POSE_H + GAP) +
    GAP +
    RIG_H +
    GAP +
    VIEW_H +
    GAP +
    details +
    exprRows * (EXPR_H + GAP) +
    40
  );
}

export function sheetHtml(library: PoseLibrary, options: SheetOptions): { html: string; height: number } {
  const kind = sheetRigKind(options.rig);
  const height = sheetHeight(library, kind);
  const poses = safeJson(library.poses);
  const expressions = safeJson(library.expressions);
  const face = safeJson(FACE);
  const colors = safeJson(library.colors);
  const anchors = safeJson(options.anchors);

  return {
    height,
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(options.character)} — pose sheet</title>
<style>
  @font-face { font-family: "${options.fonts.display.family}"; src: url("${options.fonts.dir}/${options.fonts.display.file}"); font-display: block; }
  @font-face { font-family: "${options.fonts.body.family}"; src: url("${options.fonts.dir}/${options.fonts.body.file}"); font-display: block; }
  @font-face { font-family: "${options.fonts.mono.family}"; src: url("${options.fonts.dir}/${options.fonts.mono.file}"); font-display: block; }
  html, body { margin: 0; width: 1920px; height: ${height}px; overflow: hidden; background: ${REVIEW_CHROME.bg}; }
  canvas { display: block; }
</style></head>
<body>
<canvas id="sheet" width="1920" height="${height}"></canvas>
<script src="${options.vendor}/core.js"></script>
<script src="${options.vendor}/type.js"></script>
<script src="${options.vendor}/characters.js"></script>
<script src="${options.vendor}/props.js"></script>
<script src="${options.vendor}/scene_kit.js"></script>
${options.extra.map((name) => `<script src="${options.vendor}/${name}"></script>`).join("\n")}
<script>
  const POSES = ${poses};
  const EXPRS = ${expressions};
  const FACE = ${face};
  const RAW_COLORS = ${colors};
  const ANCHORS = ${anchors};
  const KIND = ${JSON.stringify(kind)};
  const PACK = KIND !== "film";
  const CHARACTER = ${JSON.stringify(options.character)};
  const RIG = ${JSON.stringify(options.rig)};
  const HEIGHT = ${height};
  const LAYOUT = ${safeJson({ HEADER, POSE_W, POSE_H, GAP, RIG_H, VIEW_H, DETAIL_H, EXPR_H, X0, COLS })};
  const FONT_DISPLAY = ${JSON.stringify(options.fonts.display.family)};
  const FONT_BODY = ${JSON.stringify(options.fonts.body.family)};
  const FONT_MONO = ${JSON.stringify(options.fonts.mono.family)};
  const { HEADER, POSE_W, POSE_H, GAP, RIG_H, VIEW_H, DETAIL_H, EXPR_H, X0, COLS } = LAYOUT;
  const c = document.getElementById("sheet");
  const ctx = c.getContext("2d", { alpha: false });

  const COLORS = {};
  for (const [key, value] of Object.entries(RAW_COLORS)) {
    // A pose library names palette *roles* ("blueL"), not colours, and every
    // pack names its own. Resolving against the vendor's own PAL is the only
    // mapping that cannot drift from the film: a hardcoded list of pack role
    // names drew this film's worker in a cream shirt because "blueL" was not on
    // it, which is a sheet showing a character the film does not draw.
    COLORS[key] = typeof PAL[value] === "string" ? PAL[value] : value;
  }

  function elbow(x, y, len, ang) {
    return { x: x - Math.sin(ang) * len, y: y + Math.cos(ang) * len };
  }

  function chain(pose) {
    const p = pose || {};
    const lean = p.lean || 0;
    const C = KIND === "mira"
      ? { sx: 38, sy: -448, upper: 92, fore: 78, hx: 14, hy: -270, thigh: 140, shin: 104, pivot: -270 }
      : { sx: 45, sy: -516, upper: 104, fore: 88, hx: 16, hy: -300, thigh: 158, shin: 118, pivot: -334 };
    const shoulder = (side) => {
      const x = side * C.sx, y = C.sy, cy = C.pivot;
      return {
        x: x * Math.cos(lean) - (y - cy) * Math.sin(lean),
        y: cy + x * Math.sin(lean) + (y - cy) * Math.cos(lean),
      };
    };
    const arm = (side, angles) => {
      const root = shoulder(side);
      const a1 = ((angles && angles[0]) || 0) + lean, a2 = (angles && angles[1]) || 0;
      const e = elbow(root.x, root.y, C.upper, a1);
      const w = elbow(e.x, e.y, C.fore, a1 + a2);
      return { sx: root.x, sy: root.y, elbow: e, wrist: w };
    };
    const leg = (side, angles) => {
      const hx = side * C.hx, hy = C.hy + (p.bounce || 0);
      const target = side < 0 ? p.footL : p.footR;
      if (Array.isArray(target)) {
        const sol = solveLeg(hx, hy, target[0], target[1], C.thigh, C.shin, side);
        return {
          hip: { x: hx, y: hy },
          knee: { x: sol.kneeX, y: sol.kneeY },
          ankle: { x: target[0], y: target[1] },
        };
      }
      const a1 = (angles && angles[0]) || 0, a2 = (angles && angles[1]) || 0;
      const k = elbow(hx, hy, C.thigh, a1);
      const a = elbow(k.x, k.y, C.shin, a1 + a2);
      return { hip: { x: hx, y: hy }, knee: k, ankle: a };
    };
    return {
      armL: arm(-1, p.armL), armR: arm(1, p.armR),
      legL: leg(-1, p.legL), legR: leg(1, p.legR),
    };
  }

  function figure(pose, x, y, scale, expr, noShadow) {
    if (!noShadow) shadowEllipse(ctx, x, y, 58 * scale, 13 * scale, 0.34);
    if (KIND === "mira") {
      mira(ctx, x, y, scale, { pose: pose || {}, ...COLORS, face: expr || {}, shadow: noShadow ? 0 : 1 });
    } else if (KIND === "idol") {
      idol(ctx, x, y, scale, {
        pose: pose || {}, outfit: "stage", colors: COLORS, face: expr || {},
        t: 0, petals: 0, earrings: true, shadow: noShadow ? 0 : 1,
      });
    } else {
      // A film-local rig: draw it with the film's own vendor, at the film's own
      // convention — the origin is the feet, so the sheet grounds it by putting
      // that origin on the floor line. The sheet drew its own shadow above, so
      // the rig is asked for none.
      DRAW(ctx, x, y, scale, { pose: pose || {}, colors: COLORS, face: expr || {}, t: 0, shadow: 0 });
    }
  }

  const DRAW = (window.CHARACTERS || {})[RIG];
  if (typeof DRAW !== "function") {
    throw new Error('this vendor does not register CHARACTERS["' + RIG + '"]; it has ' +
      (Object.keys(window.CHARACTERS || {}).join(", ") || "nothing"));
  }

  /**
   * Where a film-local rig puts the parts it publishes, for one pose.
   *
   * The pack's rigs have their joints written into this file; someone else's rig
   * does not, and guessing them is how a sheet shows a figure the film never
   * draws. So the sheet asks the rig: rigAnchor is called with the point each
   * part hangs from and the transform in force there, exactly as the rig audit
   * reads it off a rendered frame. Wrapping it for one scratch draw collects
   * those points in rig units with the origin at the feet, and every mark on the
   * sheet is then a place the rig actually drew — no file is edited, no number
   * is assumed, and this works for a cast the pack has never seen.
   */
  function parts(pose) {
    const at = {};
    const original = window.rigAnchor;
    window.rigAnchor = function (c, part, ax, ay) {
      const m = c.getTransform();
      at[part] = { x: m.a * ax + m.c * ay + m.e, y: m.b * ax + m.d * ay + m.f };
      return part;
    };
    try {
      DRAW(document.createElement("canvas").getContext("2d"), 0, 0, 1, { pose: pose || {}, colors: COLORS, t: 0, shadow: 0 });
    } finally {
      window.rigAnchor = original;
    }
    return at;
  }

  function grounded(pose, x, ground, scale) {
    // The pack's rigs draw from a hip, so the sheet has to find the sole and the
    // support foot from the leg chain. A film-local rig draws from the feet —
    // the way the film's painter places it — so its origin *is* the sole, and the
    // cast shadow sits under both feet rather than under the planted one.
    let sole = 0;
    let supportX = 0;
    if (PACK) {
      const ch = chain(pose);
      const support = ch.legL.ankle.y >= ch.legR.ankle.y ? ch.legL : ch.legR;
      sole = support.ankle.y + (KIND === "mira" ? 8 : 39);
      supportX = support.ankle.x;
    }
    ctx.fillStyle = C.rgba(PAL.ink, 0.3);
    ctx.beginPath();
    ctx.ellipse(x + supportX * scale, ground + 2, 52 * scale, 8 * scale, 0, 0, TAU);
    ctx.fill();
    figure(pose, x, ground - sole * scale, scale, null, true);
  }

  function card(x, y, w, h) {
    paper(ctx, () => roundRectPath(ctx, x + 8, y + 8, w - 16, h - 16, 8), {
      fill: PAL.paper, edge: C.rgba(PAL.ink, 0.35), edgeW: 2,
      shadow: C.rgba(PAL.ink, 0.22), sx: 4, sy: 8,
    });
  }

  function label(text, x, y, color) {
    TY.text(ctx, text, x, y, 17, { family: FONT_MONO, color: color || C.rgba(PAL.ink, 0.75), letter: 1.5 });
  }

  function poseCard(x, y, labelText, pose) {
    card(x, y, POSE_W, POSE_H);
    label(labelText, x + 24, y + 38);
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 8, y + 44, POSE_W - 16, POSE_H - 52); ctx.clip();
    const scale = KIND === "mira" ? 0.68 : PACK ? 0.6 : 0.62;
    const ground = y + POSE_H - 24;
    ctx.fillStyle = C.rgba(PAL.ink, 0.16);
    ctx.fillRect(x + 40, ground + 1, POSE_W - 80, 1);
    grounded(pose.params, x + POSE_W / 2, ground, scale);
    ctx.restore();
  }

  function rigMap(x, y, w, h) {
    card(x, y, w, h);
    label("RIG MAP  /  JOINTS + ANCHORS", x + 24, y + 38);
    const pose = POSES[0].params;
    const s = 0.28;
    const fx = x + 230, fy = y + h - 12;
    ctx.fillStyle = C.rgba(PAL.ink, 0.18);
    ctx.fillRect(x + 60, fy + 1, 340, 1);
    shadowEllipse(ctx, fx, fy, 40 * s, 8 * s, 0.25);
    figure(pose, fx, fy, s, null);
    const tx = x + 460;
    TY.text(ctx, "ANCHORS", tx, y + 78, 14, { family: FONT_MONO, color: PAL.ink, letter: 2 });
    TY.text(ctx, ANCHORS.join("  ·  "), tx, y + 104, 15, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.7) });

    if (PACK) {
      const ch = chain(pose);
      const P = (p) => [fx + p.x * s, fy + p.y * s];
      const dot = (p, col) => {
        const [dx, dy] = P(p);
        ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(dx - 5, dy); ctx.lineTo(dx + 5, dy); ctx.moveTo(dx, dy - 5); ctx.lineTo(dx, dy + 5); ctx.stroke();
      };
      const line = (a, b) => {
        const [ax, ay] = P(a), [bx, by] = P(b);
        ctx.strokeStyle = C.rgba(PAL.ink, 0.35); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      };
      line({ x: ch.armL.sx, y: ch.armL.sy }, ch.armL.elbow); line(ch.armL.elbow, ch.armL.wrist);
      line({ x: ch.armR.sx, y: ch.armR.sy }, ch.armR.elbow); line(ch.armR.elbow, ch.armR.wrist);
      line(ch.legL.hip, ch.legL.knee); line(ch.legL.knee, ch.legL.ankle);
      line(ch.legR.hip, ch.legR.knee); line(ch.legR.knee, ch.legR.ankle);
      for (const p of [ch.armL.elbow, ch.armL.wrist, ch.armR.elbow, ch.armR.wrist, ch.legL.knee, ch.legL.ankle, ch.legR.knee, ch.legR.ankle]) dot(p, PAL.red);
      for (const p of [{ x: 0, y: -604 }, { x: 0, y: -450 }, { x: 0, y: -334 }]) dot(p, PAL.blue);
      TY.text(ctx, "11 joints  ·  brass brads  ·  seam gap 0 (rig test)", tx, y + 140, 15, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.7) });
      TY.text(ctx, "red: limb joints    blue: face / chest / waist", tx, y + 166, 13, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.55) });
    } else {
      // The rig publishes the points it hangs its parts from; these marks are
      // where it actually drew them, in the same pose above.
      const at = parts(pose);
      for (const [part, point] of Object.entries(at)) {
        const dx = fx + point.x * s, dy = fy + point.y * s;
        ctx.strokeStyle = PAL.blue; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(dx - 5, dy); ctx.lineTo(dx + 5, dy); ctx.moveTo(dx, dy - 5); ctx.lineTo(dx, dy + 5); ctx.stroke();
        TY.text(ctx, part, dx + 8, dy - 6, 11, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.6) });
      }
      TY.text(ctx, RIG + "  ·  drawn by the film's vendor  ·  origin at the feet", tx, y + 140, 15, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.7) });
      TY.text(ctx, "blue: the parts this rig publishes  ·  legs measured by the rig audit", tx, y + 166, 13, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.55) });
    }
  }

  function viewCard(x, y, w, h, labelText, turn) {
    card(x, y, w, h);
    label(labelText, x + 24, y + 38);
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 8, y + 44, w - 16, h - 52); ctx.clip();
    ctx.fillStyle = C.rgba(PAL.ink, 0.18);
    ctx.fillRect(x + 60, y + h - 29, w - 120, 1);
    ctx.translate(x + w / 2, y + h - 30);
    if (turn) ctx.transform(0.82, 0, -0.1, 1, 0, 0);
    grounded(POSES[0].params, 0, 0, 0.36);
    ctx.restore();
  }

  function detailCard(x, y, labelText, pose, target) {
    card(x, y, POSE_W, DETAIL_H);
    label(labelText, x + 24, y + 38);
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 8, y + 44, POSE_W - 16, DETAIL_H - 52); ctx.clip();
    const scale = 2.4;
    const cx = x + POSE_W / 2, cy = y + DETAIL_H / 2 + 12;
    ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-target.x, -target.y);
    figure(pose, 0, 0, 1, null, true);
    ctx.restore();
  }

  function expressionCard(x, y, labelText, expr) {
    card(x, y, POSE_W, EXPR_H);
    label(labelText, x + 24, y + 38);
    // A film-local rig reads eyes/browLift/look/mouth, not the library's
    // open/brow/lookX/lookY. Map it here too, or every expression card draws the
    // same default face and the sheet proves nothing.
    const filmFace = (params) => {
      const p = params || {};
      const open = typeof p.open === "number" ? p.open : 0.85;
      const brow = typeof p.brow === "number" ? p.brow : 0;
      if (typeof p.eyes === "string" || typeof p.mouth === "string") {
        return {
          eyes: typeof p.eyes === "string" ? p.eyes : open > 1.12 ? "wide" : open < 0.62 ? "closed" : "dot",
          mouth: typeof p.mouth === "string" ? p.mouth : open > 1.3 ? "o" : brow > 0.25 ? "smile" : "flat",
          browLift: typeof p.browLift === "number" ? p.browLift : brow * 4,
          browTilt: typeof p.browTilt === "number" ? p.browTilt : 0,
          look: [typeof p.lookX === "number" ? p.lookX : 0, typeof p.lookY === "number" ? p.lookY : 0],
          tear: p.tear === true,
        };
      }
      return {
        eyes: open > 1.12 ? "wide" : open < 0.62 ? "closed" : "dot",
        browLift: brow * 4,
        look: [typeof p.lookX === "number" ? p.lookX : 0, typeof p.lookY === "number" ? p.lookY : 0],
        mouth: open > 1.3 ? "o" : brow > 0.25 ? "smile" : brow < -0.35 ? "wobble" : "flat",
      };
    };
    const mapped = PACK ? (FACE[expr.name] || FACE.neutral) : filmFace(expr.params);
    const headY = KIND === "mira" ? -536 : -604;
    // A film-local rig does not say where its face is, so the face crop is
    // centred on the part it publishes highest on the figure — the head anchor,
    // or the hair when the rig draws its hair at the face, which the office rig
    // does. Both are measured from the draw, so the crop cannot miss.
    const at = PACK ? null : parts(POSES[0].params);
    const face = at ? (at.hair || at.head || at.face) : null;
    const zoomY = face ? face.y : headY;
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 8, y + 44, POSE_W - 16, EXPR_H - 52); ctx.clip();
    ctx.translate(x + POSE_W / 2, y + 150);
    // The mortals now draw a 2× head; the old 2.2 zoom put the eyes above the
    // card's clip and cropped the only evidence the sheet exists to show.
    ctx.scale(PACK ? 2.2 : 1.3, PACK ? 2.2 : 1.3);
    // The pack's crop puts the head on the card's centre line; a measured crop
    // leaves room for the chin, so the face sits a little above it.
    ctx.translate(0, -zoomY - (PACK ? 0 : 20));
    figure(POSES[0].params, 0, 0, 1, mapped, true);
    ctx.restore();
  }

  function draw() {
    try {
    initTextures();
    ctx.fillStyle = PAL.ink; ctx.fillRect(0, 0, 1920, HEIGHT);
    TY.text(ctx, "PAPER ASSET SHEET", 64, 62, 22, { family: FONT_MONO, color: PAL.acid, letter: 4 });
    TY.text(ctx, CHARACTER, 64, 112, 52, { family: FONT_DISPLAY, color: PAL.paper });
    TY.text(ctx, RIG + "  /  " + POSES.length + " poses  /  " + EXPRS.length + " expressions", 66, 146, 18, { family: FONT_MONO, color: C.rgba(PAL.paper, 0.7), letter: 2 });
    TY.text(ctx, "GATE 4  /  contact shadow  /  joint map  /  seam gap 0 (rig test)", 66, 174, 14, { family: FONT_MONO, color: C.rgba(PAL.paper, 0.45), letter: 1 });

    let y = HEADER;
    POSES.forEach((pose, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      poseCard(X0 + col * (POSE_W + GAP), y + row * (POSE_H + GAP), pose.name.toUpperCase(), pose);
    });
    y += Math.ceil(POSES.length / COLS) * (POSE_H + GAP) + GAP;

    rigMap(X0, y, 1920 - 2 * X0, RIG_H);
    y += RIG_H + GAP;

    viewCard(X0, y, 900, VIEW_H, "FRONT", false);
    viewCard(X0 + 920, y, 872, VIEW_H, "3/4 — PAPER PLATE TURN", true);
    y += VIEW_H + GAP;

    const idle = POSES[0].params;
    if (PACK) {
      const leftPose = (POSES.find((p) => /point|duet-left/i.test(p.name)) || POSES[0]).params;
      const rightPose = (POSES.find((p) => /duet-right|turn/i.test(p.name)) || POSES[0]).params;
      const rightChain = chain(rightPose);
      detailCard(X0, y, "HAND LEFT", leftPose, chain(leftPose).armL.wrist);
      detailCard(X0 + POSE_W + GAP, y, "HAND RIGHT", rightPose, rightChain.armR.wrist);
      detailCard(X0 + 2 * (POSE_W + GAP), y, "BOOT", idle, chain(idle).legL.ankle);
      detailCard(X0 + 3 * (POSE_W + GAP), y, "COAT / TORSO", idle, { x: 0, y: -430 });
      y += DETAIL_H + GAP;
    }

    TY.text(ctx, "EXPRESSIONS", X0, y - 8, 18, { family: FONT_MONO, color: PAL.acid, letter: 3 });
    EXPRS.forEach((expr, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      expressionCard(X0 + col * (POSE_W + GAP), y + row * (EXPR_H + GAP), expr.name.toUpperCase(), expr);
    });

    window.__sheetReady = true;
    } catch (error) {
      ctx.fillStyle = ${JSON.stringify(REVIEW_CHROME.error)};
      ctx.font = "26px monospace";
      const text = String(error && error.stack ? error.stack : error);
      text.split("\\n").slice(0, 8).forEach((line, i) => ctx.fillText(line, 64, 300 + i * 34));
    }
  }

  Promise.all([
    document.fonts.load("52px '" + FONT_DISPLAY + "'"),
    document.fonts.load("17px '" + FONT_MONO + "'"),
    document.fonts.load("52px '" + FONT_BODY + "'"),
  ]).then(() => document.fonts.ready).then(draw);
</script>
</body></html>`,
  };
}

export function sheetSlug(character: string): string {
  return character.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
