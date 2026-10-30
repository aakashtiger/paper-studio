/**
 * Type audit: is every word inside the safe area?
 *
 * Paints sampled times through the real renderer with the paint probe attached,
 * reads the box of every text run the frame drew, and asserts each box sits
 * inside the style's title-safe rectangle. Rotation is handled: the probe maps
 * each box through the canvas transform, so a label on a rotated sticker is
 * measured as the rectangle it actually covers.
 *
 * The safe margin comes from the style pack (`tokens.json` safeZones) so a film
 * inherits it instead of hardcoding a number.
 *
 * usage: npm run audit:type -- films/understudy/score.json [--step 0.5] [--margin 0.06]
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

type TextBox = { text: string; x: number; y: number; w: number; h: number };
type ProbeFile = { frames: { time: number; textBoxes: TextBox[] }[] };
type Score = {
  id: string;
  style?: string;
  duration: number;
  fps?: number;
  aspect?: string;
};

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function run(binary: string, args: string[], cwd: string): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(binary, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stdout.on("data", () => {});
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) done();
      else fail(new Error(`${binary} ${args.join(" ")} exited ${code}\n${err.slice(-1500)}`));
    });
  });
}

function frameSize(aspect: string | undefined): { width: number; height: number } {
  if (aspect === "9:16") return { width: 1080, height: 1920 };
  if (aspect === "1:1") return { width: 1080, height: 1080 };
  return { width: 1920, height: 1080 };
}

/** `title-safe 6 percent` in the style tokens, or 6% when the style is silent. */
async function safeMargin(root: string, style: string): Promise<{ margin: number; source: string }> {
  const tokensPath = resolve(root, "styles", style, "tokens.json");
  if (existsSync(tokensPath)) {
    const tokens = JSON.parse(await readFile(tokensPath, "utf8")) as {
      layout?: { safeZones?: string[] };
    };
    for (const zone of tokens.layout?.safeZones ?? []) {
      const match = /title-safe\s+([\d.]+)\s*percent/i.exec(zone);
      if (match) return { margin: Number(match[1]) / 100, source: `styles/${style}/tokens.json` };
    }
  }
  return { margin: 0.06, source: "default 6%" };
}

async function main(): Promise<void> {
  const scorePath = process.argv[2];
  if (!scorePath || scorePath.startsWith("--")) {
    console.error("usage: npm run audit:type -- <score.json> [--step 0.5] [--margin 0.06]");
    process.exit(2);
  }

  const root = process.cwd();
  const score = JSON.parse(await readFile(resolve(root, scorePath), "utf8")) as Score;
  const fps = Number(score.fps ?? 30);
  const step = Number(arg("step") ?? 0.5);
  const style = score.style ?? "";
  const resolved = arg("margin") === undefined ? await safeMargin(root, style) : { margin: Number(arg("margin")), source: "--margin" };
  const margin = resolved.margin;

  const { width, height } = frameSize(score.aspect);
  const safe = {
    x0: Math.round(width * margin * 10) / 10,
    y0: Math.round(height * margin * 10) / 10,
    x1: Math.round(width * (1 - margin) * 10) / 10,
    y1: Math.round(height * (1 - margin) * 10) / 10,
  };

  const work = resolve(root, "build", score.id, "type-probe");
  await mkdir(work, { recursive: true });
  const probeFile = join(work, "probe.json");
  const times: number[] = [];
  for (let time = 0; time < score.duration; time += step) times.push(Math.round(time * 100) / 100);

  console.log(`type: painting ${times.length} frames at ${step}s steps`);
  await run(
    process.execPath,
    [
      "--import",
      "tsx",
      "scripts/render-film.ts",
      scorePath,
      "--stills",
      times.map((time) => time.toFixed(2)).join(","),
      "--out-dir",
      join("build", score.id, "type-probe", "stills"),
      "--probe",
      join("build", score.id, "type-probe", "probe.json"),
    ],
    root,
  );

  const data = JSON.parse(await readFile(probeFile, "utf8")) as ProbeFile;
  if (data.frames.length === 0) throw new Error("the paint probe returned no frames");

  const outside: { time: number; text: string; box: TextBox; over: number }[] = [];
  let boxes = 0;
  for (const frame of data.frames) {
    for (const box of frame.textBoxes) {
      boxes++;
      const over = Math.max(
        safe.x0 - box.x,
        safe.y0 - box.y,
        box.x + box.w - safe.x1,
        box.y + box.h - safe.y1,
      );
      // 1 px of tolerance: antialiasing and glyph side bearings are not layout.
      if (over > 1) outside.push({ time: frame.time, text: box.text, box, over: Math.round(over * 10) / 10 });
    }
  }

  const pass = outside.length === 0;
  const report = {
    film: score.id,
    pass,
    frame: { width, height },
    safe,
    margin: { value: margin, source: resolved.source },
    sampled: data.frames.length,
    step,
    boxes,
    outside,
    probe: `sha256:${createHash("sha256")
      .update(await readFile(resolve(root, "src/engine/paint-probe.js")))
      .digest("hex")}`,
  };
  const reportPath = resolve(root, "build", score.id, "type-audit.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  if (!pass) {
    for (const item of outside.slice(0, 12)) {
      console.log(
        `  OUT ${item.time.toFixed(2)}s "${item.text}" x${Math.round(item.box.x)} y${Math.round(item.box.y)} w${Math.round(item.box.w)} h${Math.round(item.box.h)} · ${item.over}px past the safe area`,
      );
    }
    if (outside.length > 12) console.log(`  ... ${outside.length - 12} more`);
  }
  console.log(
    `type: ${data.frames.length} frames · ${boxes} text boxes · safe ${safe.x0},${safe.y0}–${safe.x1},${safe.y1} (${Math.round(margin * 100)}% from ${resolved.source}) · ${pass ? "pass" : `FAIL ${outside.length} outside`}`,
  );
  console.log(`report: ${reportPath}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
