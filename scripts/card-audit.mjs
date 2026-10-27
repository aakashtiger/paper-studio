#!/usr/bin/env node
/**
 * Measure a self-contained style card in headless Chrome.
 *
 * Usage:
 *   node scripts/card-audit.mjs <card.html> [width] [height]
 *
 * Output is JSON: viewport, document size, horizontal overflow, section
 * heights, and (when present) the .phone / .phone-screen boxes. This is a
 * measurement command, not a renderer and not a test dependency.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [cardPath, widthArg = "900", heightArg = "700"] = process.argv.slice(2);
if (!cardPath) {
  console.error("usage: node scripts/card-audit.mjs <card.html> [width] [height]");
  process.exit(2);
}
const width = Number(widthArg);
const height = Number(heightArg);
const file = resolve(cardPath);
if (!existsSync(file)) {
  console.error(`card not found: ${file}`);
  process.exit(2);
}

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chromePath = candidates.find((path) => existsSync(path)) ??
  (spawnSync("which", ["google-chrome"], { encoding: "utf8" }).stdout?.trim() || null);
if (!chromePath) {
  console.error("Chrome/Edge not found; set CHROME_PATH.");
  process.exit(2);
}

const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "card-audit-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--window-size=1000,800",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
let targets = [];
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    if (targets.some((target) => target.type === "page")) break;
  } catch {
    // Chrome is still starting.
  }
  await sleep(100);
}
const page = targets.find((target) => target.type === "page");
if (!page) {
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
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
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.enable");
await send("Page.navigate", { url: pathToFileURL(file).href });
await sleep(1000);

const expression = `(() => {
  const rect = (element) => {
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { x: +box.x.toFixed(1), y: +box.y.toFixed(1), w: +box.width.toFixed(1), h: +box.height.toFixed(1) };
  };
  const sections = {};
  for (const section of document.querySelectorAll("[data-section]")) {
    sections[section.getAttribute("data-section")] = +section.getBoundingClientRect().height.toFixed(1);
  }
  const overflow = [...document.querySelectorAll("body *")]
    .filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && (box.right > document.documentElement.clientWidth + 1 || box.left < -1);
    })
    .slice(0, 12)
    .map((element) => element.tagName + "." + element.className);
  const fontChecks = {};
  for (const family of ["Cormorant", "Caveat", "Plex Mono", "Anton", "Archivo", "DM Mono"]) {
    if (document.fonts.check("16px " + family)) fontChecks[family] = true;
  }
  return JSON.stringify({
    viewport: { w: innerWidth, h: innerHeight },
    document: {
      w: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    },
    sections,
    phone: rect(document.querySelector(".phone")),
    phoneScreen: rect(document.querySelector(".phone-screen")),
    overflow,
    fonts: fontChecks,
  });
})()`;
const evaluation = await send("Runtime.evaluate", {
  expression,
  returnByValue: true,
  awaitPromise: true,
});
console.log(JSON.stringify(JSON.parse(evaluation.result.value), null, 2));
socket.close();
chrome.kill();
await sleep(200);
try { rmSync(profile, { recursive: true, force: true }); } catch {}
