/**
 * Deterministic film renderer.
 *
 * Drives the composition in headless Chrome and reads each frame from the
 * canvas backing store, so a frame always matches its requested time. Then
 * encodes the PNG sequence with ffmpeg.
 *
 * usage: npm run render:film -- films/understudy/score.json [--out film.mp4]
 *        [--audio mix.wav] [--crf 18] [--keep-frames <dir>]
 */
import { createServer } from "node:http";
import { createServer as createNetServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, resolve, sep, dirname } from "node:path";
import type { AddressInfo } from "node:net";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function has(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function findChrome(): string {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  throw new Error("Chrome not found. Set CHROME_PATH.");
}

function findFfmpeg(): string {
  const names = ["ffmpeg.exe", "ffmpeg"];
  const roots = [
    process.env.FFMPEG_PATH,
    join(process.cwd(), "node_modules", "ffmpeg-static"),
    join(process.cwd(), "..", "node_modules", "ffmpeg-static"),
  ];
  for (const root of roots) {
    if (!root) continue;
    if (existsSync(root) && /ffmpeg(\.exe)?$/i.test(root)) return root;
    for (const name of names) {
      const candidate = join(root, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  throw new Error("ffmpeg not found. Set FFMPEG_PATH or install it on PATH.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((done) => setTimeout(done, ms));
}

type Pending = { resolve: (value: unknown) => void; reject: (reason: Error) => void };

class Cdp {
  private nextId = 0;
  private readonly pending = new Map<number, Pending>();

  private constructor(private readonly socket: WebSocket) {
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data)) as {
        id?: number;
        result?: unknown;
        error?: { message?: string };
      };
      if (message.id === undefined) return;
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message ?? "CDP error"));
      else entry.resolve(message.result);
    });
  }

  static async connect(url: string): Promise<Cdp> {
    const socket = new WebSocket(url);
    await new Promise<void>((done, fail) => {
      socket.addEventListener("open", () => done(), { once: true });
      socket.addEventListener("error", () => fail(new Error(`cannot connect to ${url}`)), {
        once: true,
      });
    });
    return new Cdp(socket);
  }

  send<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = ++this.nextId;
    return new Promise<T>((resolvePromise, reject) => {
      this.pending.set(id, {
        resolve: (value) => resolvePromise(value as T),
        reject,
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close(): void {
    this.socket.close();
  }
}

async function freePort(): Promise<number> {
  const server = createNetServer();
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const port = (server.address() as AddressInfo).port;
  await new Promise<void>((done) => server.close(() => done()));
  return port;
}

async function serve(root: string): Promise<{ url: string; close: () => Promise<void> }> {
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent((request.url ?? "/").split("?")[0] ?? "/");
    const file = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + sep) && file !== root) {
      response.statusCode = 403;
      response.end();
      return;
    }
    try {
      const body = await readFile(file);
      response.setHeader("Content-Type", MIME[extname(file).toLowerCase()] ?? "application/octet-stream");
      response.end(body);
    } catch {
      response.statusCode = 404;
      response.end();
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const port = (server.address() as AddressInfo).port;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((done) => server.close(() => done())),
  };
}

async function waitForReady(cdp: Cdp, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const probe = await cdp.send<{ result: { value?: unknown } }>("Runtime.evaluate", {
      expression: "Boolean(window.__renderReady && window.__draw && window.SCORE)",
      returnByValue: true,
    });
    if (probe.result.value === true) return;
    await sleep(100);
  }
  throw new Error("composition did not become render-ready");
}

async function stopChrome(child: ReturnType<typeof spawn>): Promise<void> {
  if (child.exitCode !== null || child.pid === undefined) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGKILL");
  }
  await Promise.race([
    new Promise<void>((done) => child.once("exit", () => done())),
    sleep(3000),
  ]);
}

async function quietly(task: () => Promise<unknown>): Promise<void> {
  try {
    await task();
  } catch {
    // Best-effort cleanup must never hide the render result.
  }
}

type TextBox = { text: string; x: number; y: number; w: number; h: number };
type RigRecord = Record<string, unknown>;

async function drawFrame(
  cdp: Cdp,
  time: number,
): Promise<{ data: string; drawnAt: number; textBoxes?: TextBox[]; rigRecords?: RigRecord[] }> {
  const probe = await cdp.send<{
    result: {
      value?: { data?: string; error?: string; drawnAt?: number; textBoxes?: TextBox[]; rigRecords?: RigRecord[] };
    };
    exceptionDetails?: { text?: string };
  }>("Runtime.evaluate", {
    expression: `(() => {
      if (window.__paintProbe) { window.__textBoxes = []; window.__rigRecords = []; }
      window.__draw(${time});
      if (window.__lastDrawError) return { error: String(window.__lastDrawError) };
      return {
        data: document.getElementById("out").toDataURL("image/png"),
        drawnAt: window.__drawnAt,
        textBoxes: window.__paintProbe ? window.__textBoxes.slice() : undefined,
        rigRecords: window.__paintProbe ? window.__rigRecords.slice() : undefined,
      };
    })()`,
    returnByValue: true,
  });
  if (probe.exceptionDetails) {
    throw new Error(`frame ${time}s: ${probe.exceptionDetails.text ?? "evaluate failed"}`);
  }
  const value = probe.result.value;
  if (!value?.data) throw new Error(`frame ${time}s: no canvas data (${value?.error ?? "blank"})`);
  if (Math.abs(Number(value.drawnAt) - time) > 1e-6) {
    throw new Error(`frame ${time}s: drew ${String(value.drawnAt)}s instead`);
  }
  return {
    data: value.data,
    drawnAt: Number(value.drawnAt),
    textBoxes: value.textBoxes,
    rigRecords: value.rigRecords,
  };
}

async function encode(input: {
  ffmpeg: string;
  framesDir: string;
  fps: number;
  crf: number;
  audio?: string;
  output: string;
}): Promise<void> {
  const args = [
    "-y",
    "-framerate",
    String(input.fps),
    "-i",
    join(input.framesDir, "frame-%04d.png"),
  ];
  if (input.audio) args.push("-i", input.audio);
  args.push(
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    String(input.crf),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
  );
  if (input.audio) args.push("-c:a", "aac", "-b:a", "192k", "-shortest");
  args.push(input.output);

  const child = spawn(input.ffmpeg, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });
  const code = await new Promise<number>((done) => child.on("close", (value) => done(value ?? 1)));
  if (code !== 0) throw new Error(`ffmpeg failed (${code})\n${stderr.slice(-2000)}`);
}

async function main(): Promise<void> {
  const scorePath = process.argv[2];
  if (!scorePath || scorePath.startsWith("--")) {
    console.error("usage: npm run render:film -- <score.json> [--out film.mp4] [--audio mix.wav]");
    process.exit(2);
  }

  const cwd = process.cwd();
  const scoreFile = resolve(cwd, scorePath);
  const score = JSON.parse(await readFile(scoreFile, "utf8")) as {
    id: string;
    duration: number;
    fps?: number;
  };
  const fps = Number(arg("fps") ?? score.fps ?? 30);
  const duration = Number(score.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("score has no duration");
  const frameCount = Math.round(duration * fps);

  const filmDir = resolve(cwd, "films", score.id);
  if (!existsSync(join(filmDir, "index.html"))) throw new Error(`no composition at ${filmDir}`);
  if (!existsSync(join(filmDir, "score-data.js"))) {
    throw new Error("score-data.js missing; run `npm run embed -- " + scorePath + "`");
  }

  const output = resolve(cwd, arg("out") ?? join("films", score.id, `${score.id}.mp4`));
  const audioArg = arg("audio");
  const audio = audioArg ? resolve(cwd, audioArg) : undefined;
  if (audio && !existsSync(audio)) throw new Error(`audio not found: ${audio}`);
  const crf = Number(arg("crf") ?? 18);
  const stillsArg = arg("stills");
  const stills = stillsArg
    ? stillsArg
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value >= 0 && value <= duration)
    : undefined;
  const stillsDir = resolve(cwd, arg("out-dir") ?? join("build", score.id, "stills"));
  const keepDir = arg("keep-frames");
  const framesDir = keepDir ? resolve(cwd, keepDir) : await mkdtemp(join(tmpdir(), "paper-film-"));
  await mkdir(framesDir, { recursive: true });

  const server = await serve(cwd);
  const debugPort = await freePort();
  const profile = await mkdtemp(join(tmpdir(), "paper-chrome-"));
  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--mute-audio",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profile}`,
      "--window-size=1920,1080",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let cdp: Cdp | undefined;
  try {
    let target: { webSocketDebuggerUrl?: string } | undefined;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const list = (await (
          await fetch(`http://127.0.0.1:${debugPort}/json/list`)
        ).json()) as { type: string; webSocketDebuggerUrl?: string }[];
        target = list.find((entry) => entry.type === "page");
        if (target?.webSocketDebuggerUrl) break;
      } catch {
        // Chrome is still starting.
      }
      await sleep(100);
    }
    if (!target?.webSocketDebuggerUrl) throw new Error("Chrome debugging endpoint did not start");
    cdp = await Cdp.connect(target.webSocketDebuggerUrl);

    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url: `${server.url}/films/${score.id}/index.html` });
    await waitForReady(cdp, 60_000);
    await cdp.send("Runtime.evaluate", {
      expression: `Promise.all([
        document.fonts.load('16px "Anton"'),
        document.fonts.load('16px "Archivo Black"'),
        document.fonts.load('16px "DMMono"'),
        document.fonts.load('16px "Permanent Marker"'),
      ]).then(() => document.fonts.ready).then(() => {
        if (window.TY) window.TY.ready = true;
        window.__fontsReady = true;
        return true;
      })`,
      awaitPromise: true,
      returnByValue: true,
    });

    const probePath = arg("probe");
    if (probePath) {
      // Instrument the page's text and rig helpers, then read what each still
      // actually drew. The probe is engine-owned so every film gets the same one.
      const probeSource = await readFile(resolve(cwd, "src/engine/paint-probe.js"), "utf8");
      const injected = await cdp.send<{
        result: { value?: unknown };
        exceptionDetails?: { text?: string };
      }>("Runtime.evaluate", { expression: probeSource, returnByValue: true });
      if (injected.exceptionDetails) {
        throw new Error(`paint probe failed: ${injected.exceptionDetails.text ?? "evaluate failed"}`);
      }
      const check = await cdp.send<{ result: { value?: unknown } }>("Runtime.evaluate", {
        expression: "Boolean(window.__paintProbe)",
        returnByValue: true,
      });
      if (check.result.value !== true) {
        throw new Error("paint probe did not attach (no TY text helpers on the page)");
      }
    }

    if (stills) {
      await mkdir(stillsDir, { recursive: true });
      const probeFrames: { time: number; textBoxes: TextBox[]; rigRecords: RigRecord[] }[] = [];
      for (const time of stills) {
        const frame = await drawFrame(cdp, time);
        const base64 = frame.data.slice(frame.data.indexOf(",") + 1);
        const name = `t-${time.toFixed(2).padStart(5, "0")}.png`;
        await writeFile(join(stillsDir, name), Buffer.from(base64, "base64"));
        if (frame.textBoxes || frame.rigRecords) {
          probeFrames.push({
            time,
            textBoxes: frame.textBoxes ?? [],
            rigRecords: frame.rigRecords ?? [],
          });
        }
        console.log(`still ${name}`);
      }
      console.log(`stills: ${stillsDir}`);
      if (probePath) {
        const probeFile = resolve(cwd, probePath);
        await mkdir(dirname(probeFile), { recursive: true });
        await writeFile(probeFile, JSON.stringify({ frames: probeFrames }, null, 2) + "\n", "utf8");
        const boxes = probeFrames.reduce((sum, frame) => sum + frame.textBoxes.length, 0);
        const joints = probeFrames.reduce((sum, frame) => sum + frame.rigRecords.length, 0);
        console.log(
          `probe: ${boxes} text boxes, ${joints} rig records across ${probeFrames.length} frames · ${probeFile}`,
        );
      }
      return;
    }

    const started = Date.now();
    const limit = arg("limit");
    const total = limit === undefined ? frameCount : Math.min(frameCount, Math.max(0, Number(limit)));
    for (let index = 0; index < total; index++) {
      const time = index / fps;
      const frame = await drawFrame(cdp, time);
      const base64 = frame.data.slice(frame.data.indexOf(",") + 1);
      await writeFile(
        join(framesDir, `frame-${String(index + 1).padStart(4, "0")}.png`),
        Buffer.from(base64, "base64"),
      );
      if (index === 0 || (index + 1) % 60 === 0 || index === total - 1) {
        const seconds = (Date.now() - started) / 1000;
        const rate = (index + 1) / seconds;
        console.log(
          `frame ${String(index + 1).padStart(4, "0")}/${total} · ${time.toFixed(2)}s · ${rate.toFixed(1)} fps`,
        );
      }
    }

    await encode({ ffmpeg: findFfmpeg(), framesDir, fps, crf, audio, output });
    console.log(`render: ${output}`);
  } finally {
    cdp?.close();
    await stopChrome(chrome);
    await quietly(() => server.close());
    if (!has("keep-frames")) await quietly(() => rm(framesDir, { recursive: true, force: true }));
    await quietly(() => rm(profile, { recursive: true, force: true }));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
