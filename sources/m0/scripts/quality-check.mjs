/**
 * `quality-check` — the 9/10 gate for a short film.
 *
 * Ten checks, one point each. 9/10 is the shipping floor; 10/10 is the target.
 * The gate is deliberately blunt: a failed check is 0, not a nice number.
 *
 * usage: node scripts/quality-check.mjs [film.json]
 */
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const filmPath = process.argv[2] || "proofs/kpop-test/film.json";
const film = JSON.parse(readFileSync(filmPath, "utf8"));
const root = dirname(filmPath);
const shots = JSON.parse(readFileSync(`${root}/shots.json`, "utf8"));
const sync = JSON.parse(readFileSync(`${root}/sync.json`, "utf8"));
const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const rows = [];
const add = (id, name, pass, detail) => rows.push({ id, name, pass, detail });
const run = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8" });

// The delivered picture every report must describe. A report is not trusted by
// presence: twin.json, frame-diff.json and look.json each carry the sha256 of
// the MP4 they measured, and a stale hash fails the row.
const videoPath = film.video
  ? (isAbsolute(film.video) ? film.video : `${root}/${film.video}`)
  : `${root}/out/${film.id}.mp4`;
const videoHash = existsSync(videoPath)
  ? createHash("sha256").update(readFileSync(videoPath)).digest("hex")
  : null;
const normHash = (h) => String(h || "").replace(/^sha256:/i, "").toLowerCase();
const tied = (report) => !!(report && videoHash && normHash(report.videoHash) === videoHash);
const tieDetail = (report) => {
  if (!videoHash) return `missing ${videoPath}`;
  if (!report) return "missing report";
  if (!report.videoHash) return `report has no videoHash (want ${videoHash.slice(0, 12)}…)`;
  return `report videoHash ${normHash(report.videoHash).slice(0, 12)}… does not match ${videoPath} (${videoHash.slice(0, 12)}…)`;
};
const measureLoudness = (file) => {
  if (!existsSync(file)) return { lufs: null, truePeak: null, error: `missing ${file}` };
  const r = run(ffmpegPath, ["-hide_banner", "-i", file, "-af", "ebur128=peak=true",
    "-f", "null", process.platform === "win32" ? "NUL" : "/dev/null"]);
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  const lufsM = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)];
  const tpM = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)];
  return {
    lufs: lufsM.length ? Number(lufsM[lufsM.length - 1][1]) : null,
    truePeak: tpM.length ? Number(tpM[tpM.length - 1][1]) : null,
    error: r.status === 0 ? null : `ffmpeg exited ${r.status}`,
  };
};

// 1. sync
const syncRun = run("node", ["scripts/sync-check.mjs", root]);
add("1", "sync", syncRun.status === 0, syncRun.status === 0 ? "every content word has a picture event, and every shot reads it" : (syncRun.stderr || syncRun.stdout).trim().split("\n").slice(-3).join(" "));

// 2. motion
const diff = read(`${root}/out/frame-diff.json`);
const motionRun = run("node", ["scripts/motion-check.mjs", `${root}/out/frame-diff.json`, `${root}/shots.json`]);
const motionDetail = motionRun.status === 0
  ? (tied(diff) ? "no shot freezes; the cut moves; report tied to the MP4" : `motion report is not tied to the video (${tieDetail(diff)})`)
  : `${(motionRun.stderr || motionRun.stdout).trim().split("\n").slice(-3).join(" ")}${tied(diff) ? "; report tied to the MP4" : `; ${tieDetail(diff)}`}`;
add("2", "motion", motionRun.status === 0 && tied(diff), motionDetail);

// 3. determinism
const twin = read(`${root}/out/twin.json`);
const twinPass = !!(twin && twin.same && tied(twin));
add("3", "determinism", twinPass, twin
  ? `${twin.frames} frames 1-vs-4 workers same=${twin.same}${tied(twin) ? "; report tied to the MP4" : `; ${tieDetail(twin)}`}`
  : "missing out/twin.json");

// 4. rig
const rig = read(`${root}/rig.json`);
const rigCast = rig && rig.cast ? Object.keys(rig.cast).length : 0;
const rigPass = !!(rig && rig.pass && rig.armConvention === "armL+/armR-" && rig.noPetals && rig.mirroredBoots && rig.handThumb && rig.footTargets && (rig.cast ? rigCast >= 2 : rig.idolHip === -315 && rig.miraHip === -281));
add("4", "rig", rigPass, rig ? (rig.cast ? `${rigCast} cast rigs, ${rig.armConvention}` : `idol ${rig.idolHip}, mira ${rig.miraHip}, ${rig.armConvention}`) : "missing rig.json");

// 5. performance — measured from the paint path, not a hand-written table
const measured = read(`${root}/measured.json`);
const cast = film.cast || {};
const poseKey = (p) => [p.armL[0], p.armL[1], p.armR[0], p.armR[1], p.lean || 0, p.headTurn || 0];
// Both hands, the same solve the rig uses: armL is rooted at -80, armR at +80,
// both on the shoulder line at -500, with a 104 + 88 arm. A gesture is the
// larger of the two hands' travel over the 0.16 s window.
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
function leadMetrics(frames, who) {
  // A background extra can share the cast name ("man" in the checkpoint queue).
  // The lead is the largest instance drawn in each frame; measuring the first
  // match would read the extra's 0.32 scale as a 41 px face.
  const rows = frames.map((f) => {
    const all = f.cast.filter((c) => c.who === who);
    if (!all.length) return null;
    return all.reduce((a, b) => (b.s > a.s ? b : a));
  }).filter(Boolean);
  if (rows.length < 2) return null;
  // Distinct poses: five samples across the shot, bucketed at 0.2 rad. A smooth
  // interpolation is one move, not thirty "poses".
  const at = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((u) => rows[Math.min(rows.length - 1, Math.round(u * (rows.length - 1)))]);
  const buckets = at.map((r) => poseKey(r.pose).map((v) => Math.round(v / 0.2)).join(","));
  const poses = new Set(buckets).size;
  let changes = 0;
  for (let i = 1; i < buckets.length; i++) if (buckets[i] !== buckets[i - 1]) changes++;
  // Static run: longest span where the body is not moving faster than 0.2 rad/s.
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
  return { poses, changes, gestures, faces: faces.size, facePx, tPose, staticRun };
}
const perfRows = film.shots.map((shot) => {
  const meta = shots.find((s) => s.id === shot.id);
  const fr = measured ? measured.frames.filter((f) => f.t >= meta.start - 1e-6 && f.t < meta.end - 1e-6) : [];
  const leads = Object.keys(cast).map((w) => leadMetrics(fr, w)).filter(Boolean);
  if (!leads.length) {
    // A macro shot is a hand and a prop, not a puppet. "macro" is one of the
    // style's performance modes and the shot declares it; the shot is still
    // held to the motion floor by row 2.
    if (shot.performance === "macro") return { id: shot.id, ok: true, detail: "macro (hand + prop, no rig)" };
    return { id: shot.id, ok: false, detail: "no cast registry" };
  }
  const audience = shot.set === "audience-pov";
  const passes = (l) => l.poses >= 3 && l.changes >= 2 && l.gestures >= 1 && l.faces >= 2 &&
    l.staticRun <= 1.2 && !l.tPose && (l.facePx >= 90 || audience);
  const best = leads.find(passes) || leads.reduce((a, b) => (b.changes > a.changes ? b : a));
  const ok = leads.some(passes);
  return { id: shot.id, ok, detail: `${best.poses}P/${best.changes}C/${best.gestures}G/${best.faces}F/${best.facePx}px/${best.staticRun.toFixed(2)}s${best.tPose ? "/TPOSE" : ""}` };
});
const angleShots = film.shots.filter((s) => s.camera && s.camera !== "static").length;
const perfPass = perfRows.every((r) => r.ok) && angleShots >= 3;
add("5", "performance", perfPass, perfRows.map((r) => `${r.ok ? "" : "!"}${r.id}:${r.detail}`).join(" ") + ` angles:${angleShots}`);

// 6. set variety
const sets = film.shots.map((s) => s.set);
const distinct = new Set(sets);
let longestRun = 1, runLen = 1;
for (let i = 1; i < sets.length; i++) {
  runLen = sets[i] === sets[i - 1] ? runLen + 1 : 1;
  longestRun = Math.max(longestRun, runLen);
}
const layersOk = film.shots.every((s) => s.layers.length >= 6);
const propsOk = film.shots.every((s) => s.props.length >= 3);
const foreground = film.shots.some((s) => s.set === "audience-pov" || s.layers.includes("audience") || s.layers.includes("foreground"));
const setPass = distinct.size >= 7 && longestRun <= 3 && layersOk && propsOk && foreground;
add("6", "set", setPass, `${distinct.size} sets, longest run ${longestRun}, layers ${Math.min(...film.shots.map((s) => s.layers.length))}+, props ${Math.min(...film.shots.map((s) => s.props.length))}+`);

// 7. type — the delivered picture needs hero + label + subtitle; the HUD is a
// review-only surface now, so it is optional (and unused by the render path).
const typeNeeded = ["hero", "label", "subtitle"];
const missingType = film.shots.filter((s) => !typeNeeded.every((t) => s.type.includes(t)));
const hudShots = film.shots.filter((s) => s.type.includes("hud")).length;
const typePass = missingType.length === 0;
add("7", "type", typePass, typePass
  ? `hero + label + subtitle in every shot${hudShots ? `; HUD listed in ${hudShots}/${film.shots.length} (not required)` : ""}`
  : `${missingType.map((s) => s.id).join(", ")} missing a required type role`);

// 8. edit
const lens = shots.map((s) => s.end - s.start);
const sorted = [...lens].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const cameraTypes = new Set(film.shots.map((s) => s.camera));
const transitionTypes = new Set(film.shots.map((s) => s.transition));
const cameraEvent = film.shots.every((s) => {
  const line = sync.shots.find((x) => x.id === s.id);
  return line && line.events.some((e) => e.layer === "camera");
});
const editPass = lens.every((d) => d >= 1.0 && d <= 4.5) && median >= 2.5 && median <= 3.0 && cameraEvent && cameraTypes.size >= 3 && transitionTypes.size >= 2;
add("8", "edit", editPass, `median ${median.toFixed(2)}s, cameras ${[...cameraTypes].join("/")}, transitions ${[...transitionTypes].join("/")}`);

// 9. sound — the delivered file is the evidence, not sound.json
const sound = read(`${root}/sound.json`);
const delivered = measureLoudness(videoPath);
const lufsOk = delivered.lufs !== null && Math.abs(delivered.lufs - -14) <= 1;
const peakOk = delivered.truePeak !== null && Math.abs(delivered.truePeak - -1.5) <= 0.5;
const soundPass = !!(sound && sound.cues >= 10 && lufsOk && peakOk);
add("9", "sound", soundPass, sound
  ? `${sound.cues} cues; sound.json ${sound.lufs}/${sound.truePeak}; delivered ${delivered.lufs ?? "null"} LUFS / ${delivered.truePeak ?? "null"} dBTP (need -14±1 / -1.5±0.5)${delivered.error ? `; ${delivered.error}` : ""}`
  : "missing sound.json");

// 10. look
const look = read(`${root}/out/look.json`);
const bands = film.look;
const inBand = (v, b) => v >= b[0] && v <= b[1];
const lookPass = !!(look && tied(look) && inBand(look.luma, bands.luma) && inBand(look.saturation, bands.saturation) && inBand(look.edges, bands.edges));
add("10", "look", lookPass, look
  ? `luma ${look.luma}, sat ${look.saturation}, edges ${look.edges}${tied(look) ? "; report tied to the MP4" : `; ${tieDetail(look)}`}`
  : "missing look.json");

const score = rows.filter((r) => r.pass).length;
console.log(`quality-check: ${film.id}  ${score}/10`);
for (const r of rows) console.log(`[${r.id}] ${r.name.padEnd(13)} ${r.pass ? "PASS" : "FAIL"}  ${r.detail}`);
if (score === 10) {
  console.log("\n10/10: all ten checks pass.");
  process.exit(0);
}
console.error(`\n${score}/10: below 10/10. Name the failing row and fix it.`);
process.exit(1);
