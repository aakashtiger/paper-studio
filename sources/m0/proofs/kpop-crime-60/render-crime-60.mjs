/**
 * Render the 60 s KPOP crime proof from the source page.
 *
 * usage:
 *   node proofs/kpop-crime-60/render-crime-60.mjs --stills=0.5,2.5,4.2
 *   node proofs/kpop-crime-60/render-crime-60.mjs --frames=0:59.9 --workers=4
 *   node proofs/kpop-crime-60/render-crime-60.mjs --encode
 *   node proofs/kpop-crime-60/render-crime-60.mjs --clip=12.26:13.9 --out=proofs/kpop-crime-60/out/handoff.mp4
 *   node proofs/kpop-crime-60/render-crime-60.mjs --t=2 --review
 *   node proofs/kpop-crime-60/render-crime-60.mjs --measure [--from=4.88 --to=8.72] [--out=...]
 *
 * ?review draws the review HUD; ?render (--frames, --encode's frames) does not.
 * --encode to the delivery path refuses without a passing review.json.
 * The paint is pure, so --measure on a range is the same reading as a whole-film
 * measure for those frames: that is how a one-shot fix stays a 30 s probe.
 */
import puppeteer from "puppeteer-core";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync, readdirSync, renameSync, rmSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import ffmpegPath from "ffmpeg-static";

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const CHROME = args.chrome || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FPS = +(args.fps || 30);
const DURATION = 60.0;
const PORT = +(args.port || 8126);
const ROOT = process.cwd();
const FRAMES_DIR = args.framesDir || "proofs/kpop-crime-60/out/frames";
const AUDIO = "proofs/kpop-crime-60/mix.wav";
const SCORE = "proofs/kpop-crime-60";
const DELIVERY = "proofs/kpop-crime-60/out/kpop-crime-60.mp4";
const INDEX = "/proofs/kpop-crime-60/index.html";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".mp3": "audio/mpeg", ".json": "application/json", ".wav": "audio/wav" };
function serve() {
  return new Promise(ok => {
    const s = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/studio.html";
      const f = join(ROOT, p);
      if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.statusCode = 404; res.end("no"); return; }
      res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
      res.setHeader("Cache-Control", "no-store");
      res.end(readFileSync(f));
    }).listen(PORT, "127.0.0.1", () => ok(s));
  });
}
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: "inherit" }); p.on("close", c => c ? bad(new Error(cmd + " exited " + c)) : ok()); });

if (args.encode) {
  const out = args.out || DELIVERY;
  const isDelivery = resolve(out) === resolve(DELIVERY);
  if (isDelivery) {
    // The review is about the picture. A delivery encode refuses to run unless
    // review.json passes and is tied to the MP4 it is about.
    const gate = spawnSync(process.execPath, ["scripts/review-check.mjs", SCORE, `--video=${out}`], { encoding: "utf8" });
    if (gate.status !== 0) {
      console.error("\nencode refused: review.json missing/stale/failed — run hands/cut-pairs and sign the review\n");
      console.error((gate.stdout || "").trim());
      console.error((gate.stderr || "").trim());
      process.exit(1);
    }
    console.log((gate.stdout || "").trim());
  } else {
    console.warn(`encode: non-delivery output (${out}); review gate skipped`);
  }
  const files = readdirSync(FRAMES_DIR).filter(f => /^f\d+\.jpg$/.test(f)).sort();
  if (!files.length) { console.error("no frames to encode"); process.exit(1); }
  // A delivery is encoded to a scratch file and only moved into place after its
  // own hash matches the signed review. A stale frame cannot ship under an old
  // signature.
  const scratch = isDelivery ? out.replace(/\.mp4$/i, "") + ".tmp.mp4" : out;
  console.log(`encoding ${files.length} frames → ${scratch}`);
  mkdirSync(resolve(scratch, ".."), { recursive: true });
  await run(ffmpegPath, ["-y", "-loglevel", "error", "-stats", "-framerate", String(FPS), "-i", `${FRAMES_DIR}/f%05d.jpg`,
    "-i", AUDIO, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-tune", "film",
    "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-af", "apad=pad_dur=0.6", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-t", String(DURATION), scratch]);
  if (isDelivery) {
    const verify = spawnSync(process.execPath, ["scripts/review-check.mjs", SCORE, `--video=${scratch}`], { encoding: "utf8" });
    if (verify.status !== 0) {
      console.error("\nencode refused: the encoded picture does not match the signed review — the frames changed after review\n");
      console.error((verify.stdout || "").trim());
      console.error((verify.stderr || "").trim());
      rmSync(scratch, { force: true });
      process.exit(1);
    }
    renameSync(scratch, out);
    console.log("review verified: the delivered picture matches review.json");
  }
  console.log("wrote " + out);
  process.exit(0);
}

await serve();
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ["--allow-file-access-from-files", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--use-angle=d3d11",
    "--window-size=1920,1080", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--force-device-scale-factor=1"],
});
async function openPage(tag = "", mode = "render") {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on("console", m => { if (["error", "warn"].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on("pageerror", e => console.log(`[page error${tag}]`, e.message));
  await page.goto(`http://127.0.0.1:${PORT}${INDEX}?${mode}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction("window.ready === true", { timeout: 120000 });
  return page;
}
const frameOf = async (page, t, type = "image/jpeg", q = 0.95) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(",") + 1), "base64");
};
const times = s => String(s).split(",").map(Number);

if (args.stills) {
  const page = await openPage("", "render"), out = args.out || "proofs/kpop-crime-60/out/stills";
  mkdirSync(out, { recursive: true });
  const gpu = await page.evaluate(() => (typeof window.gpuInfo === "function" ? window.gpuInfo() : "review page"));
  console.log("GPU:", gpu);
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, "image/png");
    const f = `${out}/t${s.toFixed(2).replace(".", "_")}.png`;
    writeFileSync(f, buf);
    console.log(`${f} ${Date.now() - t0}ms`);
  }
} else if (args.frames) {
  const [a, b] = String(args.frames).split(":").map(Number), workers = +(args.workers || 4);
  mkdirSync(FRAMES_DIR, { recursive: true });
  const first = Math.round(a * FPS), last = Math.min(Math.ceil((b || DURATION) * FPS) - 1, Math.round(DURATION * FPS) - 1);
  const todo = [];
  for (let i = first; i <= last; i++) {
    const f = `${FRAMES_DIR}/f${String(i).padStart(5, "0")}.jpg`;
    if (!existsSync(f) || statSync(f).size < 1000) todo.push(i);
  }
  console.log(`${todo.length} frames to render, ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  const work = async w => {
    const page = await openPage("#" + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, "0")}.jpg`;
      const buf = await frameOf(page, i / FPS, "image/jpeg", 0.95);
      writeFileSync(f + ".tmp", buf); renameSync(f + ".tmp", f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length} ${(el / done * 1000).toFixed(0)}ms/frame eta ${((todo.length - done) * el / done / 60).toFixed(1)}min`);
      }
    }
  };
  await Promise.all(Array.from({ length: workers }, (_, w) => work(w)));
} else if (args.measure) {
  const page = await openPage(), out = args.out || "proofs/kpop-crime-60/measured.json";
  const last = Math.round(DURATION * FPS) - 1;
  // A range is how a probe stays cheap: the paint is pure, so measuring one
  // shot again is the same reading as measuring the whole film again.
  const from = args.from ? Math.round(Number(args.from) * FPS) : 0;
  const to = args.to ? Math.round(Number(args.to) * FPS) : last;
  const frames = [], start = Date.now();
  for (let i = from; i <= to; i++) {
    const rec = await page.evaluate((t) => window.measureAt(t), i / FPS);
    frames.push(rec);
    if ((i - from) % 60 === 0) console.log(`measure ${i + 1}/${last + 1}`);
  }
  writeFileSync(out, JSON.stringify({ fps: FPS, duration: DURATION, frames }));
  console.log(`measured ${frames.length} frames (${from}-${to}) in ${((Date.now() - start) / 1000).toFixed(1)}s -> ${out}`);
} else if (args.clip) {
  const page = await openPage(), out = args.out || "proofs/kpop-crime-60/out/clip.mp4";
  mkdirSync(resolve(out, ".."), { recursive: true });
  const [a, b] = String(args.clip).split(":").map(Number);
  const ff = spawn(ffmpegPath, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-ss", String(a), "-t", String(b - a), "-i", AUDIO,
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "256k", "-shortest", out], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round((b - a) * FPS);
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / FPS, "image/jpeg", 0.94);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 30 === 0) console.log(`frame ${i + 1}/${n}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on("close", r));
  console.log("wrote " + out);
} else {
  const page = await openPage("", args.review ? "review" : "render");
  const buf = await frameOf(page, +(args.t || 2), "image/png");
  writeFileSync(args.out || "proofs/kpop-crime-60/out/preview.png", buf);
  console.log("wrote preview");
}
await browser.close();
process.exit(0);
