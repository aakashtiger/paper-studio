/**
 * Headless Chrome, in one place.
 *
 * Three callers used to carry their own copy of the candidate list and the png
 * header reader. They import it from here instead.
 *
 * A page that needs a full-height screenshot cannot rely on `--screenshot`
 * alone: new headless captures the window, not the page. Such a page sets
 * `document.documentElement.dataset.sheetHeight = scrollHeight` on load;
 * `pageHeight` reads it back with `--dump-dom`, and `shootHtml` then screenshots
 * at exactly that height. The height is measured, never guessed.
 */
import { existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

export function findChrome(): string | undefined {
  return CHROME_CANDIDATES.filter((value): value is string => Boolean(value)).find((candidate) =>
    existsSync(candidate),
  );
}

export function pngSize(path: string): { width: number; height: number } | null {
  if (!existsSync(path)) return null;
  const header = readFileSync(path).subarray(0, 24);
  if (header.length < 24 || header.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

export function fileUrl(path: string): string {
  return `file:///${path.replace(/\\/g, "/")}`;
}

const BASE_ARGS = ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars"];

/** Measured full-page height in px, or null if the page did not report one. */
export function pageHeight(chrome: string, url: string, width: number, timeoutMs = 20_000): number | null {
  const result = spawnSync(
    chrome,
    [...BASE_ARGS, `--window-size=${width},1000`, "--virtual-time-budget=10000", "--dump-dom", url],
    { encoding: "utf8", timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 },
  );
  const match = (result.stdout ?? "").match(/data-sheet-height="(\d+)"/);
  return match ? Number(match[1]) : null;
}

export function shootHtml(
  chrome: string,
  options: { url: string; out: string; width: number; height: number; timeoutMs?: number },
): { ok: boolean; width: number; height: number } {
  // Clear any previous file first: a stale image must never be read as a fresh one.
  if (existsSync(options.out)) rmSync(options.out);
  const result = spawnSync(
    chrome,
    [
      ...BASE_ARGS,
      "--allow-file-access-from-files",
      "--virtual-time-budget=10000",
      `--window-size=${options.width},${options.height}`,
      `--screenshot=${options.out}`,
      options.url,
    ],
    { stdio: "ignore", timeout: options.timeoutMs ?? 40_000 },
  );
  const size = pngSize(options.out);
  return {
    ok: result.status === 0 && Boolean(size),
    width: size?.width ?? 0,
    height: size?.height ?? 0,
  };
}
