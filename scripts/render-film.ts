/**
 * Deterministic film renderer.
 *
 * Drives the composition in headless Chrome and reads each frame from the
 * canvas backing store, so a frame always matches its requested time. Then
 * encodes the PNG sequence with ffmpeg.
 *
 * usage: npm run render:film -- films/understudy/score.json [--out film.mp4]
 *        [--audio mix.wav] [--crf 18] [--keep-frames <dir>] [--workers 4]
 *        [--from <s> --to <s>]   a probe slice of one shot; writes no manifest
 *
 * A frame is a pure function of `(time, score, assets)`, so `--workers N` paints
 * N contiguous frame ranges in N browsers and encodes the result through exactly
 * the same ffmpeg call (decision 0023). One worker is the default, because a
 * machine that cannot afford N browsers must still render correctly.
 */
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { createServer as createNetServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { availableParallelism } from "node:os";
import { extname, join, relative, resolve, sep, dirname } from "node:path";
import type { AddressInfo } from "node:net";
import { findChrome as findChromePath } from "../src/engine/chrome.js";
import { hashFile, fontFaces, manifestPath, renderInputs } from "../src/engine/manifest.js";
import type { RenderManifest } from "../src/engine/manifest.js";
import { FilmScoreSchema } from "../src/engine/treatment.js";
import { scoreDataText } from "../src/engine/score-data.js";
import { fileHash, videoStreamHash } from "../src/engine/video.js";
import { VISUAL_CONTRACT_VERSION } from "../src/engine/visual.js";

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

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function has(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

/**
 * Refuse to paint a whole film without a passing collage for **this** score.
 *
 * The collage is stage 5 of decision 0025 and the user's one hard rule about it
 * is that nobody approves it by hand: the tool paints one frame per shot, checks
 * the frames it painted (every shot present, none blank, none a duplicate,
 * every staged character drawn, no word off the edge) and either goes on or says
 * what is broken. A person still looks at the page — the sheet is written beside
 * the report — but a pass is the tool's claim, not a signature.
 */
function requireCollage(cwd: string, id: string, scoreFile: string): void {
  const reportPath = join(cwd, "build", id, "collage.json");
  const run = `npm run collage -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(
      `refusing to paint ${id}: no collage. Run \`${run}\` first — one frame per shot, checked before the film`,
    );
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    ok?: boolean;
    score?: string;
    errors?: { code: string; message: string }[];
  };
  if (written.score !== fileHash(scoreFile)) {
    throw new Error(`refusing to paint ${id}: build/${id}/collage.json is a collage of a different score. Run \`${run}\` again`);
  }
  if (!written.ok) {
    const errors = written.errors ?? [];
    throw new Error(
      `refusing to paint ${id}: the collage refused ${errors.length} shot(s):\n` +
        errors.map((error) => `  ${error.code}  ${error.message}`).join("\n") +
        `\n  see build/${id}/collage.json · build/${id}/collage/collage.png`,
    );
  }
}

/**
 * Refuse to paint a whole film while any shot in it is a still photograph.
 *
 * *Scene 6 is a still photograph* cost a 70-minute render, and scene 7 another
 * 72 — and both were answerable from twelve frames of the shot. The movement
 * probe paints a short window inside every shot through the real painter, reads
 * the 48×27 sample the probe already had, and asks one question per shot: does
 * it travel from its first frame to its last? A shot that does not is refused
 * here, before the browser starts a film.
 *
 * This is not `audit:motion`, which measures the delivered picture frame by
 * frame. This one is cheap enough to run before every paint, which is the only
 * place it can save a render.
 */
function requireMotion(cwd: string, id: string, scoreFile: string): void {
  const reportPath = join(cwd, "build", id, "motion-probe", "motion-probe.json");
  const run = `npm run probe:motion -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(`refusing to paint ${id}: no movement probe. Run \`${run}\` first`);
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    score?: string;
    errors?: { code: string; message: string }[];
  };
  if (written.score !== fileHash(scoreFile)) {
    throw new Error(`refusing to paint ${id}: build/${id}/motion-probe/motion-probe.json measured a different score. Run \`${run}\` again`);
  }
  const errors = written.errors ?? [];
  if (errors.length > 0) {
    throw new Error(
      `refusing to paint ${id}: ${errors.length} shot(s) do not move:\n` +
        errors.map((error) => `  ${error.code}  ${error.message}`).join("\n") +
        `\n  see build/${id}/motion-probe/motion-probe.json`,
    );
  }
}

/**
 * Refuse to paint a whole film without a fresh, passing preflight report.
 *
 * This is the ordering fix from the sixteen-hour day, enforced where it cannot
 * be skipped: nine full renders produced seven cuts a one-second check had
 * already rejected, and every one of those checks ran *after* the expensive
 * step. A probe (`--stills`, `--from/--to`) is not a film, so it is not gated;
 * a whole-film paint is, and it needs the report to describe **this** score —
 * a pass written before the cut changed proves nothing.
 */
function requireVisuals(cwd: string, id: string, scoreFile: string): void {
  const reportPath = join(cwd, "build", id, "visual-check.json");
  const run = `npm run visual:check -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(`refusing to paint ${id}: no visual check. Run \`${run}\` first`);
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    contract?: number;
    pass?: boolean;
    score?: string;
    findings?: { code: string; message: string }[];
  };
  const hash = fileHash(scoreFile);
  if (written.score !== hash) {
    throw new Error(`refusing to paint ${id}: build/${id}/visual-check.json describes a different score. Run \`${run}\` again`);
  }
  if (written.contract !== VISUAL_CONTRACT_VERSION) {
    throw new Error(`refusing to paint ${id}: build/${id}/visual-check.json predates the phrase/device/performer rules. Run \`${run}\` again`);
  }
  if (!written.pass) {
    const findings = written.findings ?? [];
    throw new Error(
      `refusing to paint ${id}: ${findings.length} visual finding(s):\n` +
        findings.map((finding) => `  ${finding.code}  ${finding.message}`).join("\n") +
        `\n  see build/${id}/visual-check.json`,
    );
  }
}

function requireStyleIdentity(
  cwd: string,
  id: string,
  scoreFile: string,
  style: string,
): void {
  const reportPath = join(cwd, "build", id, "style-identity", "style-identity.json");
  const run = `npm run style:identity -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(`refusing to paint ${id}: no style-identity report. Run \`${run}\` first`);
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    pass?: boolean;
    score?: string;
    identityHash?: string;
    frameReportHash?: string | null;
    stage?: string;
    findings?: { code: string; message: string }[];
  };
  const hash = fileHash(scoreFile);
  if (written.score !== hash) {
    throw new Error(`refusing to paint ${id}: build/${id}/style-identity/style-identity.json describes a different score. Run \`${run}\` again`);
  }
  const tokensPath = join(cwd, "styles", style, "tokens.json");
  const tokens = existsSync(tokensPath)
    ? (JSON.parse(readFileSync(tokensPath, "utf8")) as { identity?: unknown })
    : {};
  const identityHash = `sha256:${createHash("sha256")
    .update(JSON.stringify(tokens.identity ?? null))
    .digest("hex")}`;
  if (written.identityHash !== identityHash) {
    throw new Error(
      `refusing to paint ${id}: the identity report was measured against a different identity block. Run \`${run}\` again`,
    );
  }
  if (!written.frameReportHash) {
    throw new Error(`refusing to paint ${id}: the identity report has no frame-report hash. Run \`${run}\` again`);
  }
  if (!written.pass) {
    const findings = written.findings ?? [];
    throw new Error(
      `refusing to paint ${id}: ${findings.length} style-identity finding(s):\n` +
        findings.map((finding) => `  ${finding.code}  ${finding.message}`).join("\n") +
        `\n  see build/${id}/style-identity/style-identity.json`,
    );
  }
}

function requireDeterminism(cwd: string, id: string, scoreFile: string): void {
  const reportPath = join(cwd, "build", id, "determinism.json");
  const run = `npm run determinism -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(`refusing to paint ${id}: no determinism report. Run \`${run}\` first`);
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    pass?: boolean;
    score?: string;
  };
  if (written.score !== fileHash(scoreFile)) {
    throw new Error(`refusing to paint ${id}: determinism measured a different score. Run \`${run}\` again`);
  }
  if (written.pass !== true) {
    throw new Error(`refusing to paint ${id}: the determinism twin sample failed. Run \`${run}\` again`);
  }
}

function requireTypeRig(cwd: string, id: string, scoreFile: string): void {
  const hash = fileHash(scoreFile);
  for (const [file, command] of [
    ["type-audit.json", "audit:type"],
    ["rig-audit.json", "audit:rig"],
  ] as const) {
    const reportPath = join(cwd, "build", id, file);
    if (!existsSync(reportPath)) {
      throw new Error(`refusing to paint ${id}: no ${file}. Run \`npm run ${command} -- <score>\` first`);
    }
    const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
      pass?: boolean;
      score?: string;
    };
    if (written.score !== hash) {
      throw new Error(`refusing to paint ${id}: ${file} describes a different score. Run \`npm run ${command} -- <score>\` again`);
    }
    if (written.pass !== true) {
      throw new Error(`refusing to paint ${id}: ${command} failed. Run \`npm run ${command} -- <score>\` again`);
    }
  }
}

function requireSfxMix(cwd: string, id: string, scoreFile: string): void {
  const hash = fileHash(scoreFile);
  const sfxPath = join(cwd, "build", id, "sfx", "sfx.json");
  const mixPath = join(cwd, "build", id, "mix", "mix-report.json");
  if (!existsSync(sfxPath)) {
    throw new Error(`refusing to paint ${id}: no sfx report. Run \`npm run sfx -- <score>\` first`);
  }
  if (!existsSync(mixPath)) {
    throw new Error(`refusing to paint ${id}: no mix report. Run \`npm run mix -- <score>\` first`);
  }
  const sfx = JSON.parse(readFileSync(sfxPath, "utf8")) as {
    pass?: boolean;
    inputs?: { score?: string };
  };
  const mix = JSON.parse(readFileSync(mixPath, "utf8")) as {
    passes?: boolean;
    inputs?: { score?: string };
  };
  if (sfx.inputs?.score !== hash || sfx.pass !== true) {
    throw new Error(`refusing to paint ${id}: the sfx report is not for this score or did not pass`);
  }
  if (mix.inputs?.score !== hash || mix.passes !== true) {
    throw new Error(`refusing to paint ${id}: the mix report is not for this score or did not pass`);
  }
}

function requirePreflight(cwd: string, id: string, scoreFile: string, scorePath: string): void {
  const reportPath = join(cwd, "build", id, "preflight.json");
  const run = `npm run preflight -- ${relative(cwd, scoreFile).replace(/\\/g, "/")}`;
  if (!existsSync(reportPath)) {
    throw new Error(`refusing to paint ${id}: no preflight report. Run \`${run}\` first`);
  }
  const written = JSON.parse(readFileSync(reportPath, "utf8")) as {
    ok?: boolean;
    score?: string;
    reproduce?: boolean;
    errors?: { code: string; message: string }[];
    identity?: { pass?: boolean; findings?: { code: string; message: string }[] };
  };
  const hash = fileHash(scoreFile);
  if (written.score !== hash) {
    throw new Error(
      `refusing to paint ${id}: build/${id}/preflight.json describes a different score ` +
        `(${written.score ?? "no hash"} ≠ ${hash}). Run \`${run}\` again`,
    );
  }
  if (!written.identity) {
    throw new Error(
      `refusing to paint ${id}: preflight has no identity section. Run \`${run}\` again`,
    );
  }
  const scoreDoc = JSON.parse(readFileSync(scoreFile, "utf8")) as { legacy?: unknown };
  if (written.reproduce === true && scoreDoc.legacy === undefined) {
    throw new Error(
      `refusing to paint ${id}: this is a reproduction of a delivered film with no legacy marker; ` +
        "a legacy film may be reproduced, never re-rendered as a new film",
    );
  }
  if (written.identity.pass !== true) {
    const findings = written.identity.findings ?? [];
    throw new Error(
      `refusing to paint ${id}: preflight identity has ${findings.length} finding(s):\n` +
        findings.map((finding) => `  ${finding.code}  ${finding.message}`).join("\n") +
        `\n  see build/${id}/preflight.json`,
    );
  }
  if (!written.ok) {
    const errors = written.errors ?? [];
    throw new Error(
      `refusing to paint ${id}: preflight has ${errors.length} refusal(s):\n` +
        errors.map((error) => `  ${error.code}  ${error.message}`).join("\n") +
        `\n  see build/${id}/preflight.json · ${scorePath}`,
    );
  }
}

/**
 * How many browsers may paint at once. One is the default: a machine with less
 * memory than this one must still render correctly, and slower is correct while
 * a second browser it cannot afford is a crash. The cap is a memory budget, not
 * a correctness one — an eighth Chrome buys nothing on a 20-thread laptop.
 */
const WORKER_CAP = 8;

function workerCount(): number {
  const raw = arg("workers");
  if (raw === undefined) return 1;
  const count = Number(raw);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`--workers must be a whole number >= 1 (got "${raw}")`);
  }
  return Math.min(count, WORKER_CAP);
}

/**
 * How many browsers paint a **stills** pass.
 *
 * A still is a pure function of time, painted from a fresh page, so a hundred
 * independent pictures are exactly the workload N browsers are for — the same
 * argument as decision 0023, which took a film from 33 minutes to ~10. The
 * stills passes are where the review time actually went: `audit:rig` paints 600
 * frames at 0.1 s steps, which was a ten-minute serial pass inside a gate that
 * reports in seconds. An explicit `--workers` still wins; otherwise four, which
 * is the memory budget of a laptop that is also running the film.
 */
function stillWorkers(): number {
  const raw = arg("workers");
  if (raw !== undefined) return workerCount();
  const cores = availableParallelism();
  return Math.max(1, Math.min(4, Math.floor(cores / 2)));
}

/** Split a list into `parts` contiguous runs, as evenly as possible. */
function splitEven<T>(items: T[], parts: number): T[][] {
  const out: T[][] = Array.from({ length: parts }, () => []);
  items.forEach((item, index) => out[index % parts]?.push(item));
  return out.filter((chunk) => chunk.length > 0);
}

function findChrome(): string {
  const found = findChromePath();
  if (!found) throw new Error("Chrome not found. Set CHROME_PATH.");
  return found;
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

/**
 * One browser, ready to paint.
 *
 * A frame is a pure function of `(time, score, assets)`, so a worker is not a
 * thread of a shared renderer — it is a second, identical renderer that happens
 * to be given a shorter list of times (decision 0023). Nothing is shared but the
 * page it loads and the directory it writes into, which is why this is a whole
 * function with its own Chrome, profile and port, and not a flag in a loop.
 */
type Worker = { cdp: Cdp; close: () => Promise<void> };

async function openWorker(serverUrl: string, filmDir: string, filmId: string): Promise<Worker> {
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

  const close = async (): Promise<void> => {
    await quietly(() => stopChrome(chrome));
    await quietly(() => rm(profile, { recursive: true, force: true }));
  };

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
    const cdp = await Cdp.connect(target.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url: `${serverUrl}/films/${filmId}/index.html` });
    await waitForReady(cdp, 60_000);
    // The families waited on are the ones the **page** declares, read from its
    // `@font-face` rules: those are the only names `document.fonts.load` can
    // resolve, so a list kept here would either be a second copy of style data
    // or — on a pack whose page names other faces — a wait that proves nothing.
    const faces = fontFaces(await readFile(join(filmDir, "index.html"), "utf8"));
    const familyNames = [...new Set(faces.map((face) => face.family))];
    if (familyNames.length === 0) {
      throw new Error(`films/${filmId}/index.html declares no @font-face, so no font can be waited for`);
    }
    await cdp.send("Runtime.evaluate", {
      expression: `Promise.all(${JSON.stringify(familyNames)}.map((name) => document.fonts.load('16px "' + name + '"'))).then(() => document.fonts.ready).then(() => {
        if (window.TY) window.TY.ready = true;
        window.__fontsReady = true;
        return true;
      })`,
      awaitPromise: true,
      returnByValue: true,
    });
    return { cdp, close: async () => { cdp.close(); await close(); } };
  } catch (error) {
    await close();
    throw error;
  }
}

type TextBox = { text: string; x: number; y: number; w: number; h: number };
type RigRecord = Record<string, unknown>;

/**
 * Instrument the page's text and rig helpers, then read what each still
 * actually drew. The probe is engine-owned so every film gets the same one.
 */
async function attachProbe(cdp: Cdp, cwd: string): Promise<void> {
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

async function drawFrame(
  cdp: Cdp,
  time: number,
  /** Encode the frame as a PNG. False for a probe-only pass: the audits read numbers only. */
  png = true,
): Promise<{ data: string; drawnAt: number; textBoxes?: TextBox[]; rigRecords?: RigRecord[]; sample?: number[] }> {
  const probe = await cdp.send<{
    result: {
      value?: {
        data?: string;
        error?: string;
        drawnAt?: number;
        textBoxes?: TextBox[];
        rigRecords?: RigRecord[];
        sample?: number[];
      };
    };
    exceptionDetails?: { text?: string };
  }>("Runtime.evaluate", {
    expression: `(() => {
      if (window.__paintProbe) { window.__textBoxes = []; window.__rigRecords = []; }
      window.__draw(${time});
      if (window.__lastDrawError) return { error: String(window.__lastDrawError) };
      return {
        data: ${png ? 'document.getElementById("out").toDataURL("image/png")' : '"probe-only"'},
        drawnAt: window.__drawnAt,
        textBoxes: window.__paintProbe ? window.__textBoxes.slice() : undefined,
        rigRecords: window.__paintProbe ? window.__rigRecords.slice() : undefined,
        /* A coarse 48x27 sample of the frame, so a movement pass can measure
           "did this shot change at all?" without decoding a PNG. Only while the
           probe is attached: the film render pays nothing for it. */
        sample: window.__paintProbe ? (() => {
          const src = document.getElementById("out");
          const small = document.createElement("canvas");
          small.width = 48; small.height = 27;
          const ctx = small.getContext("2d");
          ctx.drawImage(src, 0, 0, 48, 27);
          const px = ctx.getImageData(0, 0, 48, 27).data;
          const out = [];
          for (let i = 0; i < px.length; i += 4) out.push(px[i], px[i + 1], px[i + 2]);
          return out;
        })() : undefined,
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
    sample: value.sample,
  };
}

/**
 * Frames are named by their **absolute** index in the film, not by their place
 * in a worker's chunk, so a parallel render writes the same file names a serial
 * render writes and the encoder reads the film in order either way (decision
 * 0023). Six digits, because four caps a film at 9999 frames = 5.5 minutes.
 */
function frameName(absolute: number): string {
  return `frame-${String(absolute).padStart(6, "0")}.png`;
}

/**
 * Paint `total` frames across the workers and return how many landed.
 *
 * Worker `w` takes the contiguous range `[first + w·chunk, first + (w+1)·chunk)`.
 * Contiguous so the frame names are the film in order with no gaps; absolute so
 * worker 3 painting frame 903 draws the same picture as one worker painting it
 * (decision 0023). Ranges are indices, never seconds, so no worker can drift.
 */
async function paintFrames(input: {
  workers: Worker[];
  framesDir: string;
  firstFrame: number;
  total: number;
  fps: number;
}): Promise<number> {
  const count = Math.max(1, Math.min(input.workers.length, input.total));
  const chunk = Math.ceil(input.total / count);
  const ranges: { worker: Worker; from: number; to: number }[] = [];
  for (let w = 0; w < count; w++) {
    const worker = input.workers[w];
    if (!worker) break;
    const from = input.firstFrame + w * chunk;
    const to = Math.min(input.firstFrame + input.total, input.firstFrame + (w + 1) * chunk);
    if (to > from) ranges.push({ worker, from, to });
  }

  const started = Date.now();
  let painted = 0;
  let reported = 0;
  await Promise.all(
    ranges.map(async ({ worker, from, to }) => {
      for (let index = from; index < to; index++) {
        const time = index / input.fps;
        const frame = await drawFrame(worker.cdp, time);
        const base64 = frame.data.slice(frame.data.indexOf(",") + 1);
        await writeFile(join(input.framesDir, frameName(index + 1)), Buffer.from(base64, "base64"));
        painted += 1;
        if (painted === 1 || painted - reported >= 60 || painted === input.total) {
          reported = painted;
          const rate = painted / ((Date.now() - started) / 1000);
          const left = Math.round((input.total - painted) / Math.max(rate, 0.001));
          console.log(
            `frame ${String(painted).padStart(4, "0")}/${input.total} · ${rate.toFixed(1)} fps` +
              (count > 1 ? ` · ${count} workers` : "") +
              (painted === input.total ? "" : ` · ~${left}s left`),
          );
        }
      }
    }),
  );
  return painted;
}

async function encode(input: {
  ffmpeg: string;
  framesDir: string;
  fps: number;
  crf: number;
  firstFrame: number;
  audio?: string;
  output: string;
}): Promise<void> {
  const args = [
    "-y",
    "-framerate",
    String(input.fps),
    "-start_number",
    String(input.firstFrame + 1),
    "-i",
    join(input.framesDir, "frame-%06d.png"),
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
  // The renderer paints what the score says, so it validates the score first:
  // an invalid score should not reach a 900-frame draw loop.
  const score = FilmScoreSchema.parse(JSON.parse(await readFile(scoreFile, "utf8")));
  const fps = Number(arg("fps") ?? score.fps ?? 30);
  const duration = Number(score.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("score has no duration");
  const frameCount = Math.round(duration * fps);

  const filmDir = resolve(cwd, "films", score.id);
  if (!existsSync(join(filmDir, "index.html"))) throw new Error(`no composition at ${filmDir}`);
  if (!existsSync(join(filmDir, "score-data.js"))) {
    throw new Error("score-data.js missing; run `npm run embed -- " + scorePath + "`");
  }
  // The renderer paints from `score-data.js`, not from the score. A file left
  // over from before `voice --apply` moved a line is a picture of a different
  // film, and the gate only catches it after the paint. Refuse it here.
  const expectedData = scoreDataText(cwd, scorePath);
  const actualData = readFileSync(join(filmDir, "score-data.js"), "utf8");
  if (actualData !== expectedData) {
    throw new Error(`score-data.js is stale; run \`npm run embed -- ${scorePath}\``);
  }

  const output = (() => {
    const deliverable = resolve(cwd, "films", score.id, `${score.id}.mp4`);
    const fromArg = arg("from");
    const toArg = arg("to");
    const isProbe = fromArg !== undefined || toArg !== undefined;
    const isDraft = has("draft");
    if ((isProbe || isDraft) && arg("out") === undefined) {
      const name = isProbe
        ? `probe-${fromArg ?? 0}-${toArg ?? duration}.mp4`
        : "draft.mp4";
      return resolve(cwd, "build", score.id, name);
    }
    const requested = resolve(cwd, arg("out") ?? join("films", score.id, `${score.id}.mp4`));
    if ((isProbe || isDraft) && requested === deliverable) {
      throw new Error(
        "a probe or draft may not write the deliverable; pass --out <build path> or omit it",
      );
    }
    return requested;
  })();
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

  // The gate comes before the browser, not after the film.
  const fullRange = Number(arg("from") ?? 0) <= 0 && Number(arg("to") ?? duration) >= duration;
  const checkOnly = has("check");
  // A draft is an instrument, like a stills pass: it exists so a person can judge
  // the film before it is painted, so it is not gated by the checks that exist to
  // stop a *film* being painted. It writes no manifest, so it can never be
  // mistaken for the deliverable.
  if (!stills && (fullRange || checkOnly) && !has("draft")) {
    requireVisuals(cwd, score.id, scoreFile);
    requireStyleIdentity(cwd, score.id, scoreFile, score.style);
    requirePreflight(cwd, score.id, scoreFile, scorePath);
    requireCollage(cwd, score.id, scoreFile);
    requireMotion(cwd, score.id, scoreFile);
    requireDeterminism(cwd, score.id, scoreFile);
    requireTypeRig(cwd, score.id, scoreFile);
    requireSfxMix(cwd, score.id, scoreFile);
    if (checkOnly) {
      console.log("render --check: visual, identity, preflight, collage, movement, determinism, type/rig and sfx/mix all pass; no browser opened");
      return;
    }
  }

  const server = await serve(cwd);
  // One browser paints one frame at a time; N browsers paint N contiguous
  // ranges (decision 0023). A stills pass is N independent pictures, so it takes
  // the same parallelism: each worker paints its own subset of the requested
  // times into the same directory, and the probe frames are merged in time order.
  const workerTotal = stills ? stillWorkers() : workerCount();
  const workers: Worker[] = [];
  try {
    for (let index = 0; index < workerTotal; index++) {
      workers.push(await openWorker(server.url, filmDir, score.id));
    }
    if (workerTotal > 1) console.log(`workers: ${workerTotal}`);
    const first = workers[0];
    if (!first) throw new Error("no browser started");
    const cdp = first.cdp;

    const probePath = arg("probe");
    if (probePath && !stills) await attachProbe(cdp, cwd);

    if (stills) {
      // `--no-png` is the probe-only pass: the frame is drawn and measured but
      // never encoded. The audits (rig, type, movement) read numbers, and a rig
      // pass used to write 2 GB of PNGs that nothing opened.
      const wantPng = !has("no-png");
      await mkdir(stillsDir, { recursive: true });
      const chunks = splitEven(stills, Math.min(workerTotal, stills.length));
      const painted = await Promise.all(
        chunks.map(async (times, index) => {
          const worker = workers[index] ?? first;
          if (probePath) await attachProbe(worker.cdp, cwd);
          const out: { time: number; textBoxes: TextBox[]; rigRecords: RigRecord[]; sample?: number[] }[] = [];
          for (const time of times) {
            const frame = await drawFrame(worker.cdp, time, wantPng);
            const name = `t-${time.toFixed(2).padStart(5, "0")}.png`;
            if (wantPng) {
              const base64 = frame.data.slice(frame.data.indexOf(",") + 1);
              await writeFile(join(stillsDir, name), Buffer.from(base64, "base64"));
            }
            if (frame.textBoxes || frame.rigRecords) {
              out.push({
                time,
                textBoxes: frame.textBoxes ?? [],
                rigRecords: frame.rigRecords ?? [],
                sample: frame.sample,
              });
            }
            console.log(wantPng ? `still ${name}` : `probe ${time.toFixed(2)}s`);
          }
          return out;
        }),
      );
      const probeFrames = painted.flat().sort((a, b) => a.time - b.time);
      console.log(wantPng ? `stills: ${stillsDir}` : `probe: ${probeFrames.length} frames drawn, no PNG written`);
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

    // A **slice** renders a window of the film so one shot can be measured
    // without a full pass. It is a probe, not a deliverable: it writes no
    // manifest, because the manifest is the claim that a picture is the film,
    // and a slice is not. The picture is identical either way — the painter is
    // a pure function of the film's absolute time — so a shot measured here
    // measures the same thing the full render will.
    const fromSec = Number(arg("from") ?? 0);
    const toSec = Number(arg("to") ?? duration);
    const slice = fromSec > 0 || toSec < duration;
    // A **draft** is the whole film at a lower frame rate, with its sound, so a
    // director can watch and listen before paying for the film. It is not the
    // film: the manifest is the claim that a picture *is* the deliverable, and
    // 10 fps is not 30. Same painter, same absolute times — every frame it does
    // paint is the frame the film will have (decision 0023).
    const draft = has("draft");
    const firstFrame = slice ? Math.round(fromSec * fps) : 0;
    const lastFrame = slice ? Math.min(frameCount, Math.round(toSec * fps)) : frameCount;
    if (slice && !(lastFrame > firstFrame)) {
      throw new Error(`--from ${fromSec} --to ${toSec} selects no frames`);
    }

    const limit = arg("limit");
    const sliceTotal = lastFrame - firstFrame;
    const total = limit === undefined ? sliceTotal : Math.min(sliceTotal, Math.max(0, Number(limit)));
    const painted = await paintFrames({ workers, framesDir, firstFrame, total, fps });
    // Contiguous ranges cannot leave a hole, but a hole is the one failure that
    // would reach the encoder silently, so it is checked rather than assumed.
    if (painted !== total) {
      throw new Error(`painted ${painted} of ${total} frames; refusing to encode a picture with a hole`);
    }

    await encode({ ffmpeg: findFfmpeg(), framesDir, fps, crf, firstFrame, audio, output });
    console.log(`render: ${output}`);

    if (slice) {
      console.log(`slice: ${fromSec}s–${toSec}s of ${score.id} · a probe, not a deliverable · no manifest written`);
      return;
    }
    if (draft) {
      console.log(
        `draft: ${output} · ${fps} fps (the film is ${score.fps ?? 30}) · a preview, not the deliverable · no manifest written`,
      );
      return;
    }

    // The manifest is written **here**, by the step that painted the frames,
    // because this is the only step that knows what it painted from. Hashing the
    // inputs in the audit instead would record the files as they are after the
    // render, so a painter edited afterwards would be described beside a picture
    // it never touched.
    const picture = videoStreamHash(findFfmpeg(), output);
    const manifest: RenderManifest = {
      film: score.id,
      renderer: "scripts/render-film.ts",
      command: `npm run render:film -- ${scorePath}`,
      duration,
      fps,
      frames: frameCount,
      video: relative(cwd, output).replace(/\\/g, "/"),
      videoHash: picture,
      videoFileHash: fileHash(output),
      audio: audio ? { path: relative(cwd, audio).replace(/\\/g, "/"), hash: await hashFile(audio) } : null,
      inputs: await renderInputs(cwd, score, scorePath),
    };
    const out = manifestPath(cwd, score.id);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, JSON.stringify(manifest, null, 2) + "\n", "utf8");
    console.log(`manifest: build/${score.id}/render-manifest.json · picture ${picture.slice(0, 19)}...`);
  } finally {
    await Promise.all(workers.map((worker) => worker.close()));
    await quietly(() => server.close());
    if (!has("keep-frames")) await quietly(() => rm(framesDir, { recursive: true, force: true }));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
