import fs from 'node:fs';
const root = 'proofs/kpop-crime-60';
const film = JSON.parse(fs.readFileSync(`${root}/film.json`, 'utf8'));
const shots = JSON.parse(fs.readFileSync(`${root}/shots.json`, 'utf8'));
const measured = JSON.parse(fs.readFileSync(`${root}/measured.json`, 'utf8'));
const cast = film.cast || {};
const poseKey = (p) => [p.armL[0], p.armL[1], p.armR[0], p.armR[1], p.lean || 0, p.headTurn || 0];
const handAt = (who, p, x, y, s) => {
  const c = cast[who] || { shoulder: [80, -500], arm: [104, 88] };
  const [l1, l2] = c.arm;
  const sx = Math.abs(c.shoulder[0]) || 80, sy = c.shoulder[1];
  const hand = (ang, side) => {
    const a1 = ang[0], a2 = ang[0] + ang[1];
    return [x + (side - Math.sin(a1) * l1 - Math.sin(a2) * l2) * s,
            y + (sy + Math.cos(a1) * l1 + Math.cos(a2) * l2) * s];
  };
  return [hand(p.armL || [0.28, -0.35], -sx), hand(p.armR || [-0.32, 0.45], sx)];
};
function metrics(frames, who) {
  const rows = frames.map((f) => f.cast.find((c) => c.who === who)).filter(Boolean);
  if (rows.length < 2) return null;
  const at = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((u) => rows[Math.min(rows.length - 1, Math.round(u * (rows.length - 1)))]);
  const buckets = at.map((r) => poseKey(r.pose).map((v) => Math.round(v / 0.2)).join(','));
  const poses = new Set(buckets).size;
  let changes = 0;
  for (let i = 1; i < buckets.length; i++) if (buckets[i] !== buckets[i - 1]) changes++;
  let staticRun = 0, stillSince = rows[0].t;
  for (let i = 1; i < rows.length; i++) {
    const prev = poseKey(rows[i - 1].pose), cur = poseKey(rows[i].pose);
    const d = Math.max(...cur.map((v, j) => Math.abs(v - prev[j])));
    const dt = Math.max(1 / 30, rows[i].t - rows[i - 1].t);
    staticRun = Math.max(staticRun, rows[i].t - stillSince);
    if (d / dt > 0.2) stillSince = rows[i].t;
  }
  const faces = new Set();
  let tPose = false, gestures = 0, lastG = -9;
  const hist = [];
  for (const r of rows) {
    faces.add(JSON.stringify([r.face.eyes, r.face.mouth]));
    const aL = r.pose.armL, aR = r.pose.armR;
    if (Math.abs(aL[0]) > 1.25 && Math.abs(aL[0]) < 1.95 && Math.abs(aL[1]) < 0.35 &&
        Math.abs(aR[0]) > 1.25 && Math.abs(aR[0]) < 1.95 && Math.abs(aR[1]) < 0.35) tPose = true;
    const h = handAt(who, r.pose, r.x, r.y, r.s);
    hist.push({ t: r.t, h });
    while (hist.length && r.t - hist[0].t > 0.16) hist.shift();
    if (hist.length && r.t - lastG > 0.35) {
      const travel = Math.max(
        Math.hypot(h[0][0] - hist[0].h[0][0], h[0][1] - hist[0].h[0][1]),
        Math.hypot(h[1][0] - hist[0].h[1][0], h[1][1] - hist[0].h[1][1]),
      );
      if (travel > 28) { gestures++; lastG = r.t; }
    }
  }
  const head = (cast[who] && cast[who].head) || 120;
  const facePx = Math.round(head * Math.max(...rows.map((r) => r.s)));
  return { poses, changes, gestures, faces: faces.size, facePx, tPose, staticRun, buckets, rows };
}
for (const shot of film.shots) {
  const meta = shots.find((s) => s.id === shot.id);
  const fr = measured.frames.filter((f) => f.t >= meta.start - 1e-6 && f.t < meta.end - 1e-6);
  const out = [];
  for (const who of Object.keys(cast)) {
    const m = metrics(fr, who);
    if (!m) continue;
    const ok = m.poses >= 3 && m.changes >= 2 && m.gestures >= 1 && m.faces >= 2 && m.staticRun <= 1.2 && !m.tPose && m.facePx >= 90;
    out.push({ who, ok, poses: m.poses, changes: m.changes, gestures: m.gestures, faces: m.faces, facePx: m.facePx, tPose: m.tPose, staticRun: +m.staticRun.toFixed(2), buckets: m.buckets });
  }
  const bad = out.filter((o) => !o.ok);
  if (bad.length) {
    console.log(`\n=== ${shot.id} ${meta.start}-${meta.end} set=${shot.set} ===`);
    for (const b of out) console.log(` ${b.who} ${b.ok ? 'ok ' : 'BAD'} ${b.poses}P/${b.changes}C/${b.gestures}G/${b.faces}F/${b.facePx}px/${b.staticRun}s${b.tPose ? ' TPOSE' : ''}`);
  }
}
