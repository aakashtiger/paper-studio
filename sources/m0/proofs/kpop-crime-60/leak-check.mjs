/**
 * Find the shots whose draw() leaks a canvas save().
 *
 * endCam() is a single ctx.restore(): if anything inside a scene calls save()
 * and never restores, endCam pops the wrong state, the camera transform stays
 * on the context, and every piece of screen-space type after it is drawn inside
 * the camera — which is why s18's title sat off the left edge.
 *
 * usage: node proofs/kpop-crime-60/leak-check.mjs
 *        node proofs/kpop-crime-60/leak-check.mjs --at=48.5,46.6
 */
import puppeteer from "puppeteer-core";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const CHROME = args.chrome || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = +(args.port || 8131);
const ROOT = process.cwd();
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".wav": "audio/wav" };

const server = await new Promise(ok => {
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

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ["--allow-file-access-from-files", "--window-size=1920,1080", "--disable-renderer-backgrounding", "--force-device-scale-factor=1"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
page.on("pageerror", e => console.log("[page error]", e.message));
await page.goto(`http://127.0.0.1:${PORT}/proofs/kpop-crime-60/index.html?render`, { waitUntil: "domcontentloaded" });
await page.waitForFunction("window.ready === true", { timeout: 120000 });

const at = args.at ? String(args.at).split(",").map(Number) : null;
const report = await page.evaluate((at) => {
  const proto = CanvasRenderingContext2D.prototype;
  if (!proto.__savePatched) {
    const os = proto.save, or = proto.restore;
    proto.__depth = 0; proto.__max = 0;
    proto.save = function () { proto.__depth++; if (proto.__depth > proto.__max) proto.__max = proto.__depth; return os.apply(this, arguments); };
    proto.restore = function () { proto.__depth--; return or.apply(this, arguments); };
    proto.__savePatched = true;
  }
  const shotAt = (t) => window.KPOP_SHOTS.find((s) => t >= s.start && t < s.end);
  const times = at || window.KPOP_SHOTS.map((s) => s.start + (s.end - s.start) * 0.5);
  const rows = [];
  for (const t of times) {
    const s = shotAt(t);
    if (!s) { rows.push({ t, id: "?", leak: "no shot" }); continue; }
    proto.__depth = 0; proto.__max = 0;
    window.renderTestAt(t);
    rows.push({ t: +t.toFixed(2), id: s.id, depth: proto.__depth, max: proto.__max });
  }
  return rows;
}, at);

let bad = 0;
for (const r of report) {
  const flag = r.depth === 0 ? "ok  " : "LEAK";
  if (r.depth !== 0) bad++;
  console.log(`${flag} ${String(r.id).padEnd(4)} t=${String(r.t).padEnd(6)} depth=${r.depth} max=${r.max}`);
}
console.log(bad ? `\n${bad} shot(s) leak a save()` : "\nno leaks");

await browser.close();
server.close();
process.exit(bad ? 1 : 0);
