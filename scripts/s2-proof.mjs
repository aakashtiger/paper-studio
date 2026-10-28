#!/usr/bin/env node
/**
 * Render the S2 motion proof from proofs/s2/proof.html.
 *
 * This is a deterministic 15 s, three-shot-per-style proof built from the
 * packs' tokens and composition grammar. It is not the full plan renderer.
 *
 * Output:
 *   proofs/s2/s2-motion-proof.mp4
 *   proofs/s2/paper-kpop-still-{1,2,3}.png
 *   proofs/s2/watercolor-still-{1,2,3}.png
 *
 * Requires Chrome/Edge and ffmpeg-static (or FFMPEG). No new npm dependency.
 */
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, "proofs", "s2");
const FRAMES = join(OUT, "frames");
const FPS = 30;
const SECONDS = 15;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) {
  console.error("Chrome/Edge not found; set CHROME_PATH.");
  process.exit(2);
}
const ffmpegCandidates = [
  process.env.FFMPEG,
  join(ROOT, "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
  join(ROOT, "..", "node_modules", "ffmpeg-static", "ffmpeg"),
  join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
  join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg"),
].filter(Boolean);
const ffmpeg = ffmpegCandidates.find((path) => existsSync(path));
if (!ffmpeg) {
  console.error("ffmpeg-static not found; set FFMPEG.");
  process.exit(2);
}

mkdirSync(OUT, { recursive: true });
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
};
const port = 8700 + Math.floor(Math.random() * 300);
const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (path === "/") path = "/proofs/s2/proof.html";
  const file = join(ROOT, path);
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.statusCode = 404;
    res.end("not found");
    return;
  }
  res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
  res.setHeader("Cache-Control", "no-store");
  res.end(readFileSync(file));
});
await new Promise((done) => server.listen(port, "127.0.0.1", done));

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const profile = join(OUT, ".chrome-profile");
rmSync(profile, { recursive: true, force: true });
const child = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${port + 1000}`,
  `--user-data-dir=${profile}`,
  "--window-size=1920,1080",
  "about:blank",
], { stdio: "ignore" });

let targets = [];
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port + 1000}/json/list`)).json();
    if (targets.some((target) => target.type === "page")) break;
  } catch {
    // starting
  }
  await sleep(100);
}
const page = targets.find((target) => target.type === "page");
if (!page) {
  child.kill();
  server.close();
  console.error("Chrome did not expose a page target.");
  process.exit(1);
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { done, fail } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) fail(new Error(JSON.stringify(message.error)));
  else done(message.result);
});
await new Promise((done, fail) => {
  socket.addEventListener("open", done);
  socket.addEventListener("error", fail);
});
const send = (method, params = {}) =>
  new Promise((done, fail) => {
    const id = ++nextId;
    pending.set(id, { done, fail });
    socket.send(JSON.stringify({ id, method, params }));
  });

await send("Emulation.setDeviceMetricsOverride", {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.enable");
await send("Page.navigate", { url: `http://127.0.0.1:${port}/proofs/s2/proof.html` });
for (let attempt = 0; attempt < 100; attempt += 1) {
  const ready = await send("Runtime.evaluate", { expression: "window.ready === true", returnByValue: true });
  if (ready.result.value === true) break;
  await sleep(100);
}

const renderAt = async (t) => {
  await send("Runtime.evaluate", { expression: `window.renderAt(${t})`, returnByValue: true });
};
const shot = async (format = "png", quality) => {
  const result = await send("Page.captureScreenshot", {
    format,
    ...(quality ? { quality } : {}),
    captureBeyondViewport: false,
  });
  return Buffer.from(result.data, "base64");
};

// Stills: 2.5 s, 7.5 s, 12.5 s.
for (const t of [2.5, 7.5, 12.5]) {
  await renderAt(t);
  writeFileSync(join(FRAMES, `still-${t}.png`), await shot("png"));
}

// Determinism check: the same t twice must be byte-identical.
await renderAt(7.5);
const first = await shot("png");
await renderAt(7.5);
const second = await shot("png");
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
if (digest(first) !== digest(second)) {
  console.error("determinism check failed: the same t produced different pixels");
  process.exit(1);
}

// Motion: 15 s at 30 fps.
const total = FPS * SECONDS;
for (let frame = 0; frame < total; frame += 1) {
  await renderAt(frame / FPS);
  const buffer = await shot("jpeg", 92);
  writeFileSync(join(FRAMES, `f${String(frame).padStart(5, "0")}.jpg`), buffer);
  if (frame % 60 === 0) console.log(`frame ${frame}/${total}`);
}

const run = (command, args) =>
  new Promise((done, fail) => {
    const process = spawn(command, args, { stdio: "inherit" });
    process.on("close", (code) => (code ? fail(new Error(`${command} exited ${code}`)) : done()));
  });

await run(ffmpeg, [
  "-y",
  "-loglevel", "error",
  "-framerate", String(FPS),
  "-i", join(FRAMES, "f%05d.jpg"),
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "20",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  join(OUT, "s2-motion-proof.mp4"),
]);

for (const [index, t] of [2.5, 7.5, 12.5].entries()) {
  const still = join(FRAMES, `still-${t}.png`);
  await run(ffmpeg, ["-y", "-loglevel", "error", "-i", still, "-vf", "crop=960:540:0:270", join(OUT, `paper-kpop-still-${index + 1}.png`)]);
  await run(ffmpeg, ["-y", "-loglevel", "error", "-i", still, "-vf", "crop=960:540:960:270", join(OUT, `watercolor-still-${index + 1}.png`)]);
}

const contact = `<!doctype html><meta charset="utf-8"><title>S2 contact sheet</title>
<style>
  body { margin: 0; padding: 24px; background: #1a1512; color: #f3ead9; font: 13px/1.4 "Plex", monospace; }
  h1 { font: 500 28px/1.1 "Cormorant", serif; font-style: italic; margin: 0 0 6px; }
  p { margin: 0 0 18px; opacity: .72; max-width: 70ch; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  figure { margin: 0; background: #0e0b09; border: 1px solid #3a2f27; }
  img { display: block; width: 100%; height: auto; }
  figcaption { padding: 6px 8px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
</style>
<h1>S2 motion proof — stills</h1>
<p>Three shots per style, 15 s total, authored from the packs' tokens and composition grammar. Not a plan render and not a renderer gate.</p>
<div class="grid">
${[1, 2, 3].map((n) => `<figure><img src="paper-kpop-still-${n}.png"><figcaption>Paper K-pop · shot ${n}</figcaption></figure>`).join("")}
${[1, 2, 3].map((n) => `<figure><img src="watercolor-still-${n}.png"><figcaption>Watercolor 0.2.0 · shot ${n}</figcaption></figure>`).join("")}
</div>`;
writeFileSync(join(OUT, "contact-sheet.html"), contact, "utf8");

console.log(`wrote ${join(OUT, "s2-motion-proof.mp4")}`);
console.log(`wrote ${join(OUT, "contact-sheet.html")}`);
socket.close();
child.kill();
await sleep(200);
server.close();
rmSync(FRAMES, { recursive: true, force: true });
rmSync(profile, { recursive: true, force: true });
