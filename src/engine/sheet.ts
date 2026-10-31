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
};

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

export function sheetHeight(library: PoseLibrary): number {
  const poseRows = Math.ceil(library.poses.length / COLS);
  const exprRows = Math.ceil(library.expressions.length / COLS);
  return (
    HEADER +
    poseRows * (POSE_H + GAP) +
    GAP +
    RIG_H +
    GAP +
    VIEW_H +
    GAP +
    DETAIL_H +
    GAP +
    exprRows * (EXPR_H + GAP) +
    40
  );
}

export function sheetHtml(library: PoseLibrary, options: SheetOptions): { html: string; height: number } {
  const height = sheetHeight(library);
  const kind = rigKind(options.rig);
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
<script>
  const POSES = ${poses};
  const EXPRS = ${expressions};
  const FACE = ${face};
  const RAW_COLORS = ${colors};
  const ANCHORS = ${anchors};
  const KIND = ${JSON.stringify(kind)};
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

  const ROLES = {
    paper: PAL.paper, cream: PAL.cream, ink: PAL.ink, red: PAL.red,
    blue: PAL.blue, acid: PAL.acid, gold: PAL.gold, pink: PAL.pink,
    mint: PAL.mint, violet: PAL.violet, sky: PAL.sky, green: PAL.green,
  };
  const COLORS = {};
  for (const [key, value] of Object.entries(RAW_COLORS)) COLORS[key] = ROLES[value] || value;

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
    } else {
      idol(ctx, x, y, scale, {
        pose: pose || {}, outfit: "stage", colors: COLORS, face: expr || {},
        t: 0, petals: 0, earrings: true, shadow: noShadow ? 0 : 1,
      });
    }
  }

  function grounded(pose, x, ground, scale) {
    const ch = chain(pose);
    const support = ch.legL.ankle.y >= ch.legR.ankle.y ? ch.legL : ch.legR;
    const sole = support.ankle.y + (KIND === "mira" ? 8 : 39);
    ctx.fillStyle = C.rgba(PAL.ink, 0.3);
    ctx.beginPath();
    ctx.ellipse(x + support.ankle.x * scale, ground + 2, 52 * scale, 8 * scale, 0, 0, TAU);
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
    const scale = KIND === "mira" ? 0.68 : 0.6;
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
    const tx = x + 460;
    TY.text(ctx, "ANCHORS", tx, y + 78, 14, { family: FONT_MONO, color: PAL.ink, letter: 2 });
    TY.text(ctx, ANCHORS.join("  ·  "), tx, y + 104, 15, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.7) });
    TY.text(ctx, "11 joints  ·  brass brads  ·  seam gap 0 (rig test)", tx, y + 140, 15, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.7) });
    TY.text(ctx, "red: limb joints    blue: face / chest / waist", tx, y + 166, 13, { family: FONT_MONO, color: C.rgba(PAL.ink, 0.55) });
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
    const mapped = FACE[expr.name] || FACE.neutral;
    const headY = KIND === "mira" ? -536 : -604;
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 8, y + 44, POSE_W - 16, EXPR_H - 52); ctx.clip();
    ctx.translate(x + POSE_W / 2, y + 150);
    ctx.scale(2.2, 2.2);
    ctx.translate(0, -headY);
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
    const leftPose = (POSES.find((p) => /point|duet-left/i.test(p.name)) || POSES[0]).params;
    const rightPose = (POSES.find((p) => /duet-right|turn/i.test(p.name)) || POSES[0]).params;
    const rightChain = chain(rightPose);
    detailCard(X0, y, "HAND LEFT", leftPose, chain(leftPose).armL.wrist);
    detailCard(X0 + POSE_W + GAP, y, "HAND RIGHT", rightPose, rightChain.armR.wrist);
    detailCard(X0 + 2 * (POSE_W + GAP), y, "BOOT", idle, chain(idle).legL.ankle);
    detailCard(X0 + 3 * (POSE_W + GAP), y, "COAT / TORSO", idle, { x: 0, y: -430 });
    y += DETAIL_H + GAP;

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

function rigKind(rig: string): "idol" | "mira" {
  if (rig.startsWith("idol@")) return "idol";
  if (rig.startsWith("mira@")) return "mira";
  throw new Error(`unknown paper rig "${rig}" (expected idol@… or mira@…)`);
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
