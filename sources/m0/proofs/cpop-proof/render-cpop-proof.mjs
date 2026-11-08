import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync, readdirSync, renameSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const CHROME = args.chrome || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FPS = +(args.fps || 30);
const DURATION = 156.62;
const PORT = +(args.port || 8123);
const ROOT = process.cwd();
const FRAMES_DIR = args.framesDir || 'out/frames';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.json': 'application/json' };
function serve() {
  return new Promise(ok => {
    const s = createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/studio.html';
      const f = join(ROOT, p);
      if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.statusCode = 404; res.end('no'); return; }
      res.setHeader('Content-Type', MIME[extname(f)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.end(readFileSync(f));
    }).listen(PORT, '127.0.0.1', () => ok(s));
  });
}
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });

if (args.encode) {
  const out = args.out || 'out/claude-pop.mp4';
  const files = readdirSync(FRAMES_DIR).filter(f => /^f\d+\.jpg$/.test(f)).sort();
  console.log(`encoding ${files.length} frames → ${out}`);
  await run(ffmpegPath, ['-y', '-loglevel', 'error', '-stats', '-framerate', String(FPS), '-i', `${FRAMES_DIR}/f%05d.jpg`,
    '-i', 'assets/song.wav',
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-tune', 'film',
    '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', '-shortest', out]);
  console.log('wrote ' + out);
  process.exit(0);
}

await serve();
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=d3d11',
    '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--force-device-scale-factor=1']
});
async function openPage(tag = '') {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(`http://127.0.0.1:${PORT}/proofs/cpop-proof/index.html?render`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.ready === true', { timeout: 120000 });
  return page;
}
const frameOf = async (page, t, type = 'image/jpeg', q = .95) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
const times = s => String(s).split(',').map(Number);

if (args.sheet) {
  const page = await openPage(), out = args.out || 'out/check/sheet.jpg';
  mkdirSync(resolve(out, '..'), { recursive: true });
  const { url, ms } = await page.evaluate((ts, c, w) => window.renderSheet(ts, c, w), times(args.sheet), +(args.cols || 4), +(args.w || 480));
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out} ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills';
  mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png');
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`;
    writeFileSync(f, buf);
    console.log(`${f} ${Date.now() - t0}ms`);
  }
} else if (args.frames) {
  const [a, b] = String(args.frames).split(':').map(Number), workers = +(args.workers || 4);
  mkdirSync(FRAMES_DIR, { recursive: true });
  const first = Math.round(a * FPS), last = Math.min(Math.ceil((b || DURATION) * FPS) - 1, Math.round(DURATION * FPS) - 1);
  const todo = [];
  for (let i = first; i <= last; i++) {
    const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
    if (!existsSync(f) || statSync(f).size < 1000) todo.push(i);
  }
  console.log(`${todo.length} frames to render, ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  const work = async w => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
      const buf = await frameOf(page, i / FPS, 'image/jpeg', .95);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length} ${(el / done * 1000).toFixed(0)}ms/frame eta ${((todo.length - done) * el / done / 60).toFixed(1)}min`);
      }
    }
  };
  await Promise.all(Array.from({ length: workers }, (_, w) => work(w)));
} else if (args.clip) {
  const page = await openPage(), out = args.out || 'out/clip.mp4';
  mkdirSync(resolve(out, '..'), { recursive: true });
  const [a, b] = String(args.clip).split(':').map(Number);
  const ff = spawn(ffmpegPath, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-ss', String(a), '-t', String(b - a), '-i', 'assets/song.wav',
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '256k', '-shortest', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((b - a) * FPS);
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / FPS, 'image/jpeg', .94);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) console.log(`frame ${i + 1}/${n}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('wrote ' + out);
} else {
  const page = await openPage();
  const buf = await frameOf(page, +(args.t || 2), 'image/png');
  writeFileSync(args.out || 'out/preview.png', buf);
  console.log('wrote preview');
}
await browser.close();
process.exit(0);
