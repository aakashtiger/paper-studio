/* Engine-owned paint probe.
 *
 * Injected by the renderer (never loaded by a composition) so audits can read
 * what a frame actually drew. Two things are recorded:
 *
 *   window.__textBoxes  — the device-space box of every text run  → audit:type
 *   window.__rigRecords — every leg IK solve and the limb it drew → audit:rig
 *
 * It wraps the page's helpers instead of changing them. Helper functions are
 * declared with `function`, so they are properties of window and can be
 * wrapped from outside; `const` bindings (like TY) are not, and are read by
 * name. Wrapping keeps the painter untouched: a film cannot tell the probe is
 * attached.
 */
(function attachPaintProbe() {
  if (window.__paintProbe) return;
  window.__paintProbe = true;
  window.__textBoxes = [];
  window.__rigRecords = [];

  function transform(ctx) {
    const m = ctx.getTransform ? ctx.getTransform() : null;
    return m && typeof m.a === "number" ? m : { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }

  function toDevice(m, x0, y0, x1, y1) {
    const corners = [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
    const xs = corners.map((p) => p[0]);
    const ys = corners.map((p) => p[1]);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return {
      x: Math.round(left * 10) / 10,
      y: Math.round(top * 10) / 10,
      w: Math.round((Math.max(...xs) - left) * 10) / 10,
      h: Math.round((Math.max(...ys) - top) * 10) / 10,
    };
  }

  function record(box, text, alpha) {
    // Text that is not yet visible has not been painted; it cannot leave the
    // safe area either, so it is not a finding.
    if (!(alpha > 0.05)) return;
    if (!(box.w > 0) || !(box.h > 0)) return;
    window.__textBoxes.push({ text: String(text).slice(0, 48), ...box });
  }

  // `const TY` at the top level of a classic script is a global lexical
  // binding, not a property of window, so it must be read by name.
  const helpers = typeof TY === "undefined" ? window.TY : TY;

  const type = helpers && helpers.type;
  if (type) {
    helpers.type = function (ctx, str, x, y, size, o) {
      const options = o || {};
      const m = transform(ctx);
      const total = type.apply(this, arguments);
      const appear = options.appear === undefined ? 1 : Math.max(0, Math.min(1, options.appear));
      const alpha = appear * (options.alpha === undefined ? 1 : options.alpha);
      let left = x;
      if (options.align === "center") left = x - total / 2;
      else if (options.align === "right") left = x - total;
      record(toDevice(m, left, y - size * 0.78, left + total, y + size * 0.22), str, alpha);
      return total;
    };
  }

  const text = helpers && helpers.text;
  if (text) {
    helpers.text = function (ctx, str, x, y, size, o) {
      const options = o || {};
      const m = transform(ctx);
      const align = options.align || "left";
      const baseline = options.baseline || "alphabetic";
      const previous = ctx.font;
      if (helpers.set) helpers.set(ctx, size, options.family || "DMMono", options.weight || "400");
      const track = options.letter ? options.letter * [...String(str)].length : 0;
      const width = ctx.measureText(str).width + track;
      ctx.font = previous;
      let left = x;
      if (align === "center") left = x - width / 2;
      else if (align === "right" || align === "end") left = x - width;
      let top = y - size * 0.78;
      if (baseline === "top" || baseline === "hanging") top = y;
      else if (baseline === "middle") top = y - size / 2;
      else if (baseline === "bottom" || baseline === "ideographic") top = y - size;
      text.apply(this, arguments);
      record(
        toDevice(m, left, top, left + width, top + size * (baseline === "alphabetic" ? 1 : 1.02)),
        str,
        options.alpha === undefined ? 1 : options.alpha,
      );
    };
  }

  // ---- rig -----------------------------------------------------------------
  // A character is tagged for the duration of its draw so a joint can be
  // attributed. Nothing is recorded unless drawCharacter is actually called.
  let character = "";
  const drawCharacter = window.drawCharacter;
  if (typeof drawCharacter === "function") {
    window.drawCharacter = function (name) {
      const previous = character;
      character = String(name || "");
      try {
        return drawCharacter.apply(this, arguments);
      } finally {
        character = previous;
      }
    };
  }

  // The IK solve is the intent (where the pose wants the foot); the limb call
  // is the truth (where the leg is actually drawn). The audit compares them.
  const solveLeg = window.solveLeg;
  if (typeof solveLeg === "function") {
    window.solveLeg = function (hipX, hipY, targetX, targetY, l1, l2, side) {
      const solution = solveLeg.apply(this, arguments);
      window.__rigRecords.push({
        kind: "solve",
        character,
        side,
        hip: [hipX, hipY],
        target: [targetX, targetY],
        l1,
        l2,
        reach: Math.hypot(targetX - hipX, targetY - hipY),
        hipAngle: solution.hipAngle,
        kneeBend: solution.kneeBend,
        shinAngle: solution.shinAngle,
      });
      return solution;
    };
  }

  const limb = window.limb;
  if (typeof limb === "function") {
    window.limb = function (ctx, x, y, len, w1, w2, ang) {
      const end = limb.apply(this, arguments);
      window.__rigRecords.push({
        kind: "limb",
        character,
        len,
        from: [x, y],
        to: [end[0], end[1]],
      });
      return end;
    };
  }
})();
