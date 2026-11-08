/* CPOP proof overrides — new lead and colourway on the source scene code.
 * The source scenes, rig, type and paper physics are kept. Only the lead and
 * the palette change. This is a proof, not a new engine.
 */
(() => {
  const INK = '#171310';
  const CREAM = '#F2E8D5';
  const COBALT = '#203FD8';
  const MAGENTA = '#E23A8A';
  const ACID = '#D9F24B';

  // A new paper stock, not the source's tomato/butter. The source scenes read
  // PAL roles, so the whole segment changes together.
  PAL.red = COBALT;
  PAL.redD = '#0B1B3A';
  PAL.redL = '#6F86FF';
  PAL.blue = MAGENTA;
  PAL.blueD = '#7A1450';
  PAL.blueL = '#FF8FC0';
  PAL.gold = ACID;
  PAL.goldD = '#A8C400';
  PAL.goldL = '#F2FF9A';
  PAL.acid = '#F2FF9A';
  PAL.pink = '#FF8FC0';
  PAL.orange = '#FFB347';
  PAL.green = '#4FD18B';

  const REAL_IDOL = idol;

  function crownAndSash(ctx, x, y, s, pose, halo) {
    const hy = y + (pose.bounce || 0) - 536 * s;
    ctx.save();
    ctx.translate(x, hy);
    ctx.scale(s, s);
    if (halo) {
      ctx.strokeStyle = C.rgba(ACID, .5); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 118, 0, TAU); ctx.stroke();
    }
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-46, -34); ctx.lineTo(-28, -86); ctx.lineTo(-6, -48);
      ctx.lineTo(14, -92); ctx.lineTo(36, -44); ctx.lineTo(50, -82);
      ctx.lineTo(56, -30); ctx.closePath();
    }, { fill: ACID, edge: C.rgba(INK, .65), edgeW: 2.4, shadow: C.rgba(INK, .18), sx: 3, sy: 5 });
    paper(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(-38, -444); ctx.lineTo(-16, -458); ctx.lineTo(46, -246);
      ctx.lineTo(22, -232); ctx.closePath();
    }, { fill: MAGENTA, edge: C.rgba(INK, .5), edgeW: 2, shadow: C.rgba(INK, .15), sx: 2, sy: 4 });
    // replace the source's MIRA badge with VEE
    paper(ctx, () => roundRectPath(ctx, -48, 96, 34, 20, 2), {
      fill: CREAM, edge: C.rgba(INK, .55), edgeW: 1.5,
    });
    TY.text(ctx, 'VEE', -31, 110, 8, { family: 'Archivo Black', color: INK, align: 'center' });
    ctx.restore();
  }

  idol = function vee(ctx, x, y, s, o = {}) {
    // Backing Petals keep their source flowers and colours.
    if (o.flower) return REAL_IDOL(ctx, x, y, s, o);
    const pose = o.pose || {};
    mira(ctx, x, y, s, {
      t: o.t,
      pose,
      face: o.face,
      flip: o.flip,
      coatCol: COBALT,
      trouser: MAGENTA,
      hair: INK,
      glasses: false,
      skin: '#D9A06A',
    });
    crownAndSash(ctx, x, y, s, pose, o.halo);
  };

  const REAL_STAGE = stageSet;
  stageSet = function proofStage(ctx, t, o = {}) {
    return REAL_STAGE(ctx, t, {
      ...o,
      sky: '#0B1B3A',
      sky2: '#170C2C',
      sun: CREAM,
      rayA: COBALT,
      rayB: MAGENTA,
      floor: MAGENTA,
      accent: ACID,
      confettiCols: [CREAM, ACID, MAGENTA, COBALT],
    });
  };

  const REAL_KIT = kitBg;
  kitBg = function proofKit(ctx, top, bot, rays) {
    return REAL_KIT(ctx, '#0B1B3A', '#170C2C', {
      ...(rays || {}),
      c1: ACID,
      c2: COBALT,
    });
  };
})();
