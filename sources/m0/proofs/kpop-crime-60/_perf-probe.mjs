/**
 * Fast performance probe: measure only the named shots and print the same
 * pose/gesture/face numbers quality-check computes. This is the iteration
 * instrument; the gate still reads the full measured.json.
 *
 * usage: node proofs/kpop-crime-60/_perf-probe.mjs s03 s17
 */
import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const want = new Set(process.argv.slice(2));
const film = JSON.parse(readFileSync("proofs/kpop-crime-60/film.json", "utf8"));
const shots = JSON.parse(readFileSync("proofs/kpop-crime-60/shots.json", "utf8"));
const cast = film.cast || {};
const FPS = 30, PORT = 8127, ROOT = process.cwd();
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".wav": "audio/wav", ".json": "application/json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/studio.html";
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.statusCode = 404; res.end("no"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store");
  res.end(readFileSync(f));
}).listen(PORT, "127.0.0.1");

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
function metrics(rows, who) {
  if (rows.length < 2) return null;
  const at = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((u) => rows[Math.min(rows.length - 1, Math.round(u * (rows.length - 1)))]);
  const buckets = at.map((r) => poseKey(r.pose).map((v) => Math.round(v / 0.2)).join(","));
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
  return { poses, changes, gestures, faces: faces.size, facePx: Math.round(head * Math.max(...rows.map((r) => r.s))), tPose, staticRun };
}

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, protocolTimeout: 0,
  args: ["--allow-file-access-from-files", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11", "--window-size=1920,1080", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--force-device-scale-factor=1"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/proofs/kpop-crime-60/index.html?render`, { waitUntil: "networkidle0" });
await page.waitForFunction("window.ready === true", { timeout: 120000 });

for (const shot of film.shots.filter((s) => !want.size || want.has(s.id))) {
  const meta = shots.find((s) => s.id === shot.id);
  const frames = [];
  for (let i = Math.round(meta.start * FPS); i < Math.round(meta.end * FPS); i++) {
    frames.push(await page.evaluate((t) => window.measureAt(t), i / FPS));
  }
  console.log(`\n=== ${shot.id} ${meta.start}-${meta.end} ===`);
  for (const who of Object.keys(cast)) {
    const rows = frames.map((f) => {
      const all = f.cast.filter((c) => c.who === who);
      return all.length ? all.reduce((a, b) => (b.s > a.s ? b : a)) : null;
    }).filter(Boolean);
    const m = metrics(rows, who);
    if (!m) continue;
    const ok = m.poses >= 3 && m.changes >= 2 && m.gestures >= 1 && m.faces >= 2 && m.staticRun <= 1.2 && !m.tPose && m.facePx >= 90;
    console.log(` ${who} ${ok ? "ok " : "BAD"} ${m.poses}P/${m.changes}C/${m.gestures}G/${m.faces}F/${m.facePx}px/${m.staticRun.toFixed(2)}s${m.tPose ? " TPOSE" : ""}`);
  }
}
await browser.close();
server.close();
