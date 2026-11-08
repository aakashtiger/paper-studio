/**
 * `hands-sheet` — every hand, three times per shot, on one review sheet.
 *
 * The gate cannot see a hand. This tool paints three frames per shot through
 * the film's own page (`?review`), maps each cast member's wrists with the same
 * arm solve `quality-check` uses, and tiles a 260 x 260 crop around every hand.
 *
 * The cast comes from measured.json when that file is fresh. If the film was
 * edited after the measurement, the tool measures each sampled frame live,
 * in the same render that paints the still, and says so.
 *
 * usage:
 *   node scripts/hands-sheet.mjs --score proofs/kpop-crime-60
 *   node scripts/hands-sheet.mjs --score proofs/kpop-crime-60 --live --per-page=40
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import puppeteer from "puppeteer-core";
import {
  ROOT, die, loadScore, parseArgs, relToRoot, resetDir, sha256, tileCrops, writeJson,
} from "./review-util.mjs";

const { args, rest } = parseArgs(process.argv.slice(2));
const score = loadScore(args.score || rest[0]);
const CHROME = args.chrome || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = +(args.port || 8131);
const CELL = 260;
const COLS = +(args.cols || 5);
const PER_PAGE = +(args["per-page"] || 40);
const STALE = String(args.stale || "live");
const OUT = resolve(score.root, "out/hands");

if (PER_PAGE > 60) die("hands-sheet: --per-page must be <= 60 (one ffmpeg command line)");
if (!existsSync(CHROME)) die(`hands-sheet: chrome not found at ${CHROME} (pass --chrome=...)`);
if (!score.shots || !score.shots.length) die(`hands-sheet: missing ${score.shotsPath}`);
if (!score.measured && args.live !== true) die(`hands-sheet: missing ${score.measuredPath} — run the harness --measure first, or pass --live`);
const fps = +((score.measured && score.measured.fps) || 30);
const frames = (score.measured && score.measured.frames) || [];

/* measured.json is only trusted while it is newer than the picture code. */
function newestSource() {
  const files = new Set();
  const add = (p) => { try { if (statSync(p).isFile()) files.add(resolve(p)); } catch { /* not present */ } };
  const addDir = (dir, re = /\.(js|json|html)$/i) => {
    try { for (const f of readdirSync(dir)) if (re.test(f)) add(join(dir, f)); } catch { /* not present */ }
  };
  for (const f of ["film.json", "shots.json", "test-scenes.js", "index.html", "sync.js", "sync.json", "rig.json"]) add(join(score.root, f));
  addDir(join(score.root, "shots"));
  addDir(join(score.root, "characters"));
  for (const f of ["sets.js", "sets-bridge.js", "sets-60.js", "props.js"]) {
    add(join(score.root, f));
    add(join(score.root, "..", "kpop-crime", f));
  }
  add(join(score.root, "..", "kpop-crime", "characters", "man.js"));
  for (const f of ["src/core.js", "src/type.js", "src/props.js", "src/scene_kit.js", "src/timeline.js"]) add(join(ROOT, f));
  let newest = 0, which = "";
  for (const f of files) {
    const m = statSync(f).mtimeMs;
    if (m > newest) { newest = m; which = f; }
  }
  return { newest, which };
}

const source = newestSource();
const measuredFresh = !!score.measured && statSync(score.measuredPath).mtimeMs >= source.newest - 1000;
const live = args.live === true || !measuredFresh;
if (!measuredFresh && STALE === "fail") {
  die(`hands-sheet: measured.json is stale (${relToRoot(source.which)} is newer) — re-run the harness --measure, or pass --live`);
}
if (!measuredFresh) {
  console.warn(`hands-sheet: measured.json is stale (${relToRoot(source.which)} is newer) — measuring every sample live`);
}

function nearestFrame(t) {
  if (!frames.length) return null;
  const i = Math.max(0, Math.min(frames.length - 1, Math.round(t * fps)));
  let best = i;
  for (let k = Math.max(0, i - 2); k <= Math.min(frames.length - 1, i + 2); k++) {
    if (Math.abs(frames[k].t - t) < Math.abs(frames[best].t - t)) best = k;
  }
  return frames[best];
}

function castEntries(cast) {
  const seen = new Map();
  return (cast || []).map((c) => {
    const n = (seen.get(c.who) || 0) + 1;
    seen.set(c.who, n);
    return { entry: c, instance: n, count: cast.filter((x) => x.who === c.who).length };
  });
}

/* The same solve quality-check uses: shoulder [80,-500], arm [104,88],
   pose.armL / pose.armR, and the instance's x, y, s. */
function handWorldPositions(entry) {
  const cfg = (score.film.cast && score.film.cast[entry.who]) || { shoulder: [80, -500], arm: [104, 88] };
  const [l1, l2] = cfg.arm || [104, 88];
  const sx = Math.abs((cfg.shoulder && cfg.shoulder[0]) || 80);
  const sy = (cfg.shoulder && cfg.shoulder[1]) ?? -500;
  const p = entry.pose || {};
  const hand = (ang, side) => {
    const a1 = ang[0], a2 = ang[0] + ang[1];
    return [
      entry.x + (side - Math.sin(a1) * l1 - Math.sin(a2) * l2) * entry.s,
      entry.y + (sy + Math.cos(a1) * l1 + Math.cos(a2) * l2) * entry.s,
    ];
  };
  return [
    { hand: "L", world: hand(p.armL || [0.28, -0.35], -sx) },
    { hand: "R", world: hand(p.armR || [-0.32, 0.45], sx) },
  ];
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf",
  ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".mp3": "audio/mpeg",
  ".json": "application/json", ".wav": "audio/wav",
};
function serve() {
  return new Promise((ok, bad) => {
    const server = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/studio.html";
      const f = join(ROOT, p);
      if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) {
        res.statusCode = 404; res.end("no"); return;
      }
      res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
      res.setHeader("Cache-Control", "no-store");
      res.end(readFileSync(f));
    });
    server.on("error", bad);
    server.listen(PORT, "127.0.0.1", () => ok(server));
  });
}

const samples = [];
for (const shot of score.shots) {
  for (const f of [0.25, 0.55, 0.85]) {
    samples.push({ shot: shot.id, time: shot.start + (shot.end - shot.start) * f });
  }
}

resetDir(OUT);
mkdirSync(join(OUT, "stills"), { recursive: true });

const server = await serve();
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ["--allow-file-access-from-files", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11",
    "--window-size=1920,1080", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--force-device-scale-factor=1"],
});

const CROPS = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("[page error]", e.message));
  page.setDefaultNavigationTimeout(120000);
  await page.goto(`http://127.0.0.1:${PORT}/${score.rel}/index.html?review`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction("window.ready === true", { timeout: 120000 });
  if (!(await page.evaluate(() => typeof window.renderTestAt === "function"))) {
    await browser.close();
    await new Promise((ok) => server.close(ok));
    die("hands-sheet: the page has no renderTestAt");
  }
  if (live && !(await page.evaluate(() => typeof window.reviewShotAt === "function"))) {
    await browser.close();
    await new Promise((ok) => server.close(ok));
    die("hands-sheet: live measurement needs window.reviewShotAt (update test-scenes.js)");
  }

  for (let n = 0; n < samples.length; n++) {
    const sample = samples[n];
    let res, entries, measuredT = null;
    if (live) {
      res = await page.evaluate((t) => window.reviewShotAt(t), sample.time);
      entries = castEntries(res.cast);
    } else {
      const frame = nearestFrame(sample.time);
      entries = castEntries(frame.cast);
      measuredT = frame.t;
      res = await page.evaluate((t) => {
        const url = window.renderTestAt(t, "image/png");
        const cv = document.getElementById("out");
        return { url, cam: window.reviewCam(), w: cv.width, h: cv.height };
      }, sample.time);
    }
    const hands = entries.flatMap((e) =>
      handWorldPositions(e.entry).map((h) => ({ ...h, who: e.entry.who, instance: e.instance, count: e.count })));
    res.screen = await page.evaluate((pts) => window.handToScreen(pts), hands.map((h) => h.world));

    const stillName = `${sample.shot}_t${sample.time.toFixed(2).replace(".", "_")}.png`;
    const stillAbs = join(OUT, "stills", stillName);
    writeFileSync(stillAbs, Buffer.from(res.url.slice(res.url.indexOf(",") + 1), "base64"));

    hands.forEach((h, i) => {
      const [x, y] = res.screen[i];
      const bx = Math.round(x - CELL / 2), by = Math.round(y - CELL / 2);
      const box = {
        x: Math.max(0, Math.min(res.w - CELL, bx)),
        y: Math.max(0, Math.min(res.h - CELL, by)),
        w: CELL,
        h: CELL,
      };
      const inside = x >= 0 && x <= res.w && y >= 0 && y <= res.h;
      const clipped = box.x !== bx || box.y !== by;
      const who = String(h.who).toUpperCase();
      const instance = h.count > 1 ? `#${h.instance}` : "";
      const label = `${sample.shot} ${Number(sample.time.toFixed(2))} ${who}${instance} ${h.hand}${inside ? "" : " OUT"}`;
      CROPS.push({
        shot: sample.shot,
        time: Number(sample.time.toFixed(2)),
        measuredT,
        source: live ? "live" : "measured",
        who: h.who,
        instance: h.instance,
        hand: h.hand,
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        box,
        inside,
        clipped,
        still: `out/hands/stills/${stillName}`,
        stillAbs,
        cam: res.cam,
        label,
      });
    });
    if ((n + 1) % 9 === 0) console.log(`hands-sheet: ${n + 1}/${samples.length} frames sampled`);
  }
} finally {
  await browser.close();
  await new Promise((ok) => server.close(ok));
}

const pages = [];
for (let i = 0; i < CROPS.length; i += PER_PAGE) pages.push(CROPS.slice(i, i + PER_PAGE));
const pageFiles = pages.length === 1
  ? [join(OUT, "hands-sheet.png")]
  : pages.map((_, i) => join(OUT, `hands-${i + 1}.png`));
pages.forEach((crops, i) => {
  const page = pageFiles[i];
  const size = tileCrops({
    out: page,
    items: crops.map((c) => ({ file: relToRoot(c.stillAbs), box: c.box, label: c.label })),
    cols: COLS,
    cell: CELL,
  });
  crops.forEach((c) => { c.page = i + 1; });
  pages[i] = { size, crops };
});

const pageManifest = pages.map((p, i) => ({
  path: `out/hands/${pageFiles[i].split(/[\\/]/).pop()}`,
  sha256: sha256(pageFiles[i]),
  cols: p.size.cols,
  rows: p.size.rows,
  width: p.size.width,
  height: p.size.height,
  crops: p.crops.length,
}));
const crops = CROPS.map(({ stillAbs, ...c }) => c);

const readme = [
  "HANDS - one crop per hand, three times per shot.",
  "",
  "Look for: a hand not on its arm, a hand with no sleeve, a cuff/floating prop,",
  "a hand out of the frame, a hand crossing the body, a hand at the wrong scale.",
  "",
  "An OUT tag means the measured wrist was outside the 1920x1080 frame.",
  "",
].join("\n");
writeFileSync(join(OUT, "README.txt"), readme);

writeJson(join(OUT, "hands.json"), {
  score: score.rel,
  source: live ? "live" : "measured",
  cell: CELL,
  cols: COLS,
  perPage: PER_PAGE,
  shots: score.shots.length,
  stills: samples.length,
  crops: crops.length,
  outOfFrame: crops.filter((c) => !c.inside).length,
  pages: pageManifest,
  crops,
});

const outCount = crops.filter((c) => !c.inside).length;
console.log(`hands-sheet: ${samples.length} stills, ${crops.length} hand crops (${outCount} out of frame), ${pageManifest.length} page(s), source ${live ? "live" : "measured"}`);
for (const p of pageManifest) console.log(`  ${p.path}  ${p.width}x${p.height}  ${p.crops} crops  sha256:${p.sha256.slice(0, 12)}…`);
console.log(`  ${relToRoot(join(OUT, "hands.json"))}`);
