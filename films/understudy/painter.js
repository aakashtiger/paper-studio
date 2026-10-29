/* Score-driven painter for The Understudy. Data is embedded by `npm run embed`. */



function drawFilmAt(t) {
  window.__drawnAt = t;
  try {
    ctx.clearRect(0, 0, W, H);
    const score = window.SCORE;
    if (!score) return;
    const shot = score.shots.find((s) => t >= s.start && t < s.start + s.duration) || score.shots[score.shots.length - 1];
    if (!shot) return;
    const fn = window.PAPER_BACKEND.shots[shot.recipe];
    if (!fn) throw new Error(`no backend for recipe "${shot.recipe}"`);
    fn(shot, t - shot.start, t);
    paperOverlay(ctx, t, 0.5);
    grainOverlay(ctx, t, 0.42);
    vignette(ctx, 0.12);
    window.__lastDrawError = null;
  } catch (error) {
    window.__lastDrawError = String(error && error.message ? error.message : error);
    console.error(error);
    ctx.fillStyle = "#0e0b09";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f3ead9";
    ctx.font = "28px monospace";
    ctx.fillText(String(error && error.message ? error.message : error), 60, 100);
    ctx.fillText(String(error && error.stack ? error.stack.split("\n")[1] : ""), 60, 150);
  }
}

function startPainter() {
  if (!window.SCORE) throw new Error("score-data.js did not load");
  initTextures();
  const state = { t: 0 };
  const timeline = gsap.timeline({ paused: true });
  timeline.to(state, {
    t: window.SCORE.duration,
    duration: window.SCORE.duration,
    ease: "none",
    onUpdate: () => drawFilmAt(state.t),
  });
  window.__timeline = timeline;
  window.__player = {
    renderSeek: (time) => drawFilmAt(Math.max(0, Number(time) || 0)),
    seek: (time) => drawFilmAt(Math.max(0, Number(time) || 0)),
  };
  window.__state = state;
  window.__draw = drawFilmAt;
  window.__timelines = window.__timelines || {};
  window.__timelines["understudy"] = timeline;
  drawFilmAt(0);
  timeline.seek(0);
  window.__renderReady = true;
  // Fonts may arrive after boot. Never redraw at the old timeline time here:
  // a late redraw would overwrite the frame that a renderer just requested.
  document.fonts.ready.then(() => {
    TY.ready = true;
    window.__fontsReady = true;
  });
}

try {
  startPainter();
} catch (error) {
  console.error(error);
  ctx.fillStyle = "#0e0b09";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ff3b30";
  ctx.font = "28px monospace";
  ctx.fillText("boot failed: " + String(error), 60, 100);
  window.__bootError = String(error);
}
