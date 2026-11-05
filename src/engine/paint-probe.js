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
  window.__focusBoxes = [];

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

  /**
   * Sample the face box in face-local space. A head turn or camera move is
   * removed by the inverse matrix; what remains is the expression (plus a hand
   * that crosses the window, which the audit reports rather than hides).
   */
  function sampleFace(ctx, character, anchor) {
    const grid = 8;
    const m = anchor.m;
    const size = anchor.size;
    const local = anchor.local;
    const [ma, mb, mc, md, me, mf] = m;
    const det = ma * md - mb * mc;
    if (!(Math.abs(det) > 1e-9) || !(size[0] > 4) || !(size[1] > 4)) {
      return { kind: "faceSample", character, reason: "bad-anchor", grid, cells: [], validCells: 0 };
    }
    const hw = size[0] / 2;
    const hh = size[1] / 2;
    const window = { x0: -0.85, x1: 0.85, y0: -0.72, y1: 0.95 };
    const corners = [
      [local[0] + window.x0 * hw, local[1] + window.y0 * hh],
      [local[0] + window.x1 * hw, local[1] + window.y0 * hh],
      [local[0] + window.x1 * hw, local[1] + window.y1 * hh],
      [local[0] + window.x0 * hw, local[1] + window.y1 * hh],
    ].map(([x, y]) => [ma * x + mc * y + me, mb * x + md * y + mf]);
    const xs = corners.map(([x]) => x);
    const ys = corners.map(([, y]) => y);
    const canvas = ctx.canvas;
    const left = Math.max(0, Math.floor(Math.min(...xs)));
    const top = Math.max(0, Math.floor(Math.min(...ys)));
    const right = Math.min(canvas.width, Math.ceil(Math.max(...xs)));
    const bottom = Math.min(canvas.height, Math.ceil(Math.max(...ys)));
    if (!(right > left) || !(bottom > top)) {
      return {
        kind: "faceSample",
        character,
        reason: "bad-bounds",
        grid,
        cells: [],
        validCells: 0,
        deviceBox: { x: left, y: top, w: right - left, h: bottom - top },
        canvas: [canvas.width, canvas.height],
      };
    }
    let image;
    try {
      image = ctx.getImageData(left, top, right - left, bottom - top);
    } catch {
      return { kind: "faceSample", character, reason: "tainted", grid, cells: [], validCells: 0 };
    }
    const sums = Array.from({ length: grid * grid * 3 }, () => 0);
    const counts = new Array(grid * grid).fill(0);
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const lx = (md * (x + 0.5 - me) - mc * (y + 0.5 - mf)) / det;
        const ly = (-mb * (x + 0.5 - me) + ma * (y + 0.5 - mf)) / det;
        const u = (lx - local[0]) / hw;
        const v = (ly - local[1]) / hh;
        if (u < window.x0 || u > window.x1 || v < window.y0 || v > window.y1) continue;
        const gx = Math.max(0, Math.min(grid - 1, Math.floor(((u - window.x0) / (window.x1 - window.x0)) * grid)));
        const gy = Math.max(0, Math.min(grid - 1, Math.floor(((v - window.y0) / (window.y1 - window.y0)) * grid)));
        const cell = gy * grid + gx;
        const at = ((y - top) * (right - left) + (x - left)) * 4;
        sums[cell * 3] += image.data[at] ?? 0;
        sums[cell * 3 + 1] += image.data[at + 1] ?? 0;
        sums[cell * 3 + 2] += image.data[at + 2] ?? 0;
        counts[cell] += 1;
      }
    }
    const cells = new Array(grid * grid * 3).fill(-1);
    let validCells = 0;
    for (let cell = 0; cell < grid * grid; cell += 1) {
      if ((counts[cell] ?? 0) < 2) continue;
      validCells += 1;
      for (let c = 0; c < 3; c += 1) {
        cells[cell * 3 + c] = Math.round((sums[cell * 3 + c] ?? 0) / (counts[cell] ?? 1));
      }
    }
    return {
      kind: "faceSample",
      character,
      grid,
      cells,
      validCells,
      deviceBox: { x: left, y: top, w: right - left, h: bottom - top },
    };
  }

  function record(box, text, alpha, copy) {
    // Text that is not yet visible has not been painted; it cannot leave the
    // safe area either, so it is not a finding.
    if (!(alpha > 0.05)) return;
    if (!(box.w > 0) || !(box.h > 0)) return;
    // `copy` marks the film's own words: a string the score put in a slot. The
    // painter says which runs those are, so a costume name tag drawn by the rig
    // is not held to the copy floor. `audit:type` cross-checks the mark against
    // the score, so marking arbitrary text does not buy a pass.
    window.__textBoxes.push({ text: String(text).slice(0, 48), copy: copy === true, ...box });
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
      record(toDevice(m, left, y - size * 0.78, left + total, y + size * 0.22), str, alpha, options.copy);
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
        options.copy,
      );
    };
  }

  // ---- focus ---------------------------------------------------------------
  // A recipe says where the solid focus object was drawn. The probe records the
  // device-space box; it never infers it from a glow.
  const focusAnchor = window.focusAnchor;
  if (typeof focusAnchor === "function") {
    window.focusAnchor = function (ctx, name, x, y, w, h) {
      const alpha = typeof ctx.globalAlpha === "number" ? ctx.globalAlpha : 1;
      if (alpha > 0.05 && w > 0 && h > 0) {
        window.__focusBoxes.push({
          kind: "focus",
          name: String(name || ""),
          ...toDevice(transform(ctx), x, y, x + w, y + h),
          order: window.__focusBoxes.length + 1,
          alpha: Number(alpha.toFixed(3)),
        });
      }
      return focusAnchor.apply(this, arguments);
    };
  }

  // ---- rig -----------------------------------------------------------------
  // A character is tagged for the duration of its draw so a joint can be
  // attributed. Nothing is recorded unless drawCharacter is actually called.
  let character = "";
  let lastFace = null;
  const drawCharacter = window.drawCharacter;
  if (typeof drawCharacter === "function") {
    window.drawCharacter = function (name) {
      const previous = character;
      const previousFace = lastFace;
      character = String(name || "");
      lastFace = null;
      try {
        const result = drawCharacter.apply(this, arguments);
        if (lastFace) {
          const sample = sampleFace(lastFace.ctx, character, lastFace);
          window.__rigRecords.push(
            sample ?? {
              kind: "faceSample",
              character,
              grid: 8,
              cells: [],
              validCells: 0,
              reason: "no-face-box",
              deviceBox: { x: 0, y: 0, w: 0, h: 0 },
            },
          );
        }
        return result;
      } finally {
        character = previous;
        lastFace = previousFace;
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

  // A rig publishes where it hangs the chest and the head, together with the
  // transform in force at that point. Both are device-space matrices, so the
  // head's position *in chest space* is M_chest⁻¹ · head_origin: a rig that
  // draws the head outside the torso's lean gives a different value on every
  // lean and the audit sees it. Nothing is invented if a rig publishes no
  // anchors; the audit reports the character as unmeasured instead.
  const rigAnchor = window.rigAnchor;
  if (typeof rigAnchor === "function") {
    window.rigAnchor = function (ctx, part, x, y, w, h) {
      const m = transform(ctx);
      if (part === "face") {
        lastFace = {
          ctx,
          local: [Number(x) || 0, Number(y) || 0],
          size: [Number(w) || 0, Number(h) || 0],
          m: [m.a, m.b, m.c, m.d, m.e, m.f],
        };
      }
      window.__rigRecords.push({
        kind: "anchor",
        character,
        part: String(part || ""),
        local: [Number(x) || 0, Number(y) || 0],
        size: [Number(w) || 0, Number(h) || 0],
        m: [m.a, m.b, m.c, m.d, m.e, m.f],
      });
      return rigAnchor.apply(this, arguments);
    };
  }
})();
