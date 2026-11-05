/* Film-local divine rigs for Lakshmi and Vishnu.
 *
 * They are built from the same paper-puppet construction as the Paper K-pop
 * cast: paper, torn/cut edges, brads, one hard key. The only new thing is the
 * silhouette: a halo, a crown, two upper arms and the god's attributes. The
 * film owns these characters; the style owns how they are made.
 */
(function () {
  const performer = () => window.CHARACTERS && window.CHARACTERS["performer@0.1.0"];

  function lotus(ctx, x, y, r, fill) {
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU;
      paper(ctx, () => {
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52, r * 0.4, r * 0.18, a, 0, TAU);
        ctx.closePath();
      }, { fill, edge: C.rgba(PAL.ink, 0.45), edgeW: 1.4 });
    }
    paper(ctx, () => blobPath(ctx, x, y, r * 0.34, r * 0.34, 12, 0.03, 3), {
      fill: PAL.gold, edge: C.rgba(PAL.ink, 0.5), edgeW: 1.5,
    });
  }

  function upperArm(ctx, side, o, attribute) {
    const sx = side * 40;
    const sy = -466 + 4;
    const elbow = limb(ctx, sx, sy, 96, 18, 15, side * -0.9, o.sleeve, C.rgba(PAL.ink, 0.45), true);
    const wrist = limb(ctx, elbow[0], elbow[1], 82, 14, 12, side * -0.55, o.sleeve, C.rgba(PAL.ink, 0.45), true);
    paper(ctx, () => blobPath(ctx, wrist[0], wrist[1], 13, 16, 12, 0.05, 8), {
      fill: o.skin, edge: C.rgba(PAL.ink, 0.45), edgeW: 1.4,
    });
    rigAnchor(ctx, side < 0 ? "hand-upper-left" : "hand-upper-right", wrist[0], wrist[1], 18, 26);
    if (attribute === "lotus") lotus(ctx, wrist[0], wrist[1] - 34, 34, o.attribute);
    if (attribute === "conch") {
      paper(ctx, () => blobPath(ctx, wrist[0], wrist[1] - 28, 22, 30, 14, 0.04, 4), {
        fill: PAL.cream, edge: C.rgba(PAL.ink, 0.55), edgeW: 2,
      });
    }
    if (attribute === "chakra") {
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(wrist[0], wrist[1] - 30, 24, 0, TAU); ctx.stroke();
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * TAU;
        ctx.beginPath();
        ctx.moveTo(wrist[0] + Math.cos(a) * 8, wrist[1] - 30 + Math.sin(a) * 8);
        ctx.lineTo(wrist[0] + Math.cos(a) * 32, wrist[1] - 30 + Math.sin(a) * 32);
        ctx.stroke();
      }
    }
  }

  function divine(ctx, x, y, s, o, kind) {
    const base = performer();
    if (!base) throw new Error("the performer rig is not registered");
    const colors = o.colors || {};
    const skin = colors.skin || (kind === "vishnu" ? "#7FA8C9" : "#E8B98F");
    const sleeve = colors.jacket || (kind === "vishnu" ? "#D9A441" : PAL.gold);
    const halo = kind === "vishnu" ? PAL.blueL : PAL.gold;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale((o.flip || 1) * s, s);
    // Halo and crown sit behind the head.
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = halo; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -530, 152, 0, TAU); ctx.stroke();
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 160, -530 + Math.sin(a) * 160);
      ctx.lineTo(Math.cos(a) * 184, -530 + Math.sin(a) * 184);
      ctx.stroke();
    }
    ctx.restore();
    // Crown: three paper points and a band.
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-46, -604);
      ctx.lineTo(-30, -664); ctx.lineTo(-10, -616);
      ctx.lineTo(0, -676); ctx.lineTo(12, -616);
      ctx.lineTo(30, -664); ctx.lineTo(46, -604);
      ctx.lineTo(36, -584); ctx.lineTo(-36, -584); ctx.closePath();
    }, { fill: PAL.gold, edge: C.rgba(PAL.ink, 0.6), edgeW: 2.5, shadow: C.rgba(PAL.ink, 0.2), sx: 4, sy: 6 });
    // Upper arms and attributes.
    upperArm(ctx, -1, { sleeve, skin, attribute: kind === "vishnu" ? PAL.cream : PAL.red }, kind === "vishnu" ? "conch" : "lotus");
    upperArm(ctx, 1, { sleeve, skin, attribute: kind === "vishnu" ? PAL.gold : PAL.gold }, kind === "vishnu" ? "chakra" : "lotus");
    // The base figure carries the paper body, sari/skirt, face and two lower hands.
    base(ctx, 0, 0, 1, { ...o, colors: { ...colors, skin } });
    ctx.restore();
  }

  window.CHARACTERS = window.CHARACTERS || {};
  window.CHARACTERS["lakshmi@0.1.0"] = function (ctx, x, y, s, o = {}) {
    return divine(ctx, x, y, s, o, "lakshmi");
  };
  window.CHARACTERS["vishnu@0.1.0"] = function (ctx, x, y, s, o = {}) {
    return divine(ctx, x, y, s, o, "vishnu");
  };
})();
