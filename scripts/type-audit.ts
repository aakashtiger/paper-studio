/**
 * Type audit: is every word inside the safe area, and is the film's copy at the
 * size the pack says it must be?
 *
 * Paints sampled times through the real renderer with the paint probe attached,
 * reads the box of every text run the frame drew, and asserts each box sits
 * inside the style's title-safe rectangle. Rotation is handled: the probe maps
 * each box through the canvas transform, so a label on a rotated sticker is
 * measured as the rectangle it actually covers.
 *
 * The safe margin comes from the style pack (`tokens.json` safeZones) and the
 * size floor from its own type scale (`type.scale.label`, authored at the 390 px
 * review width), so a film inherits both instead of hardcoding a number.
 *
 * "At the floor" applies to **the film's copy** — the strings the score puts in
 * a shot's slots. A costume badge or a hud label is set dressing drawn by the
 * rig; it is not a sentence the viewer has to read, and holding it to the copy
 * floor would fail every character with a name tag. The probe box height is the
 * em size the frame drew, so the check is on the drawn size, not on a number the
 * painter reported.
 *
 * usage: npm run audit:type -- films/understudy/score.json [--step 0.5] [--margin 0.06]
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { faceBoxes, textOnFace, type FaceBox, type TextOnFace } from "../src/engine/text-face.js";
import { VISUAL_CONTRACT_VERSION } from "../src/engine/visual.js";

type TextBox = { text: string; x: number; y: number; w: number; h: number; copy?: boolean };
type ProbeFile = {
  frames: { time: number; textBoxes: TextBox[]; rigRecords?: unknown[] }[];
};
type Score = {
  id: string;
  style?: string;
  duration: number;
  fps?: number;
  aspect?: string;
  shots?: {
    duration: number;
    slots?: Record<string, string>;
    direction?: { cast?: string[] };
    visual?: { phrase?: string };
  }[];
};

const AUTHORED_WIDTH = 390;
const DEFAULT_FLOOR = 14;

/** `type.scale.label` from the pack: the smallest size the pack sets copy in. */
async function copyFloor(root: string, style: string): Promise<{ px: number; source: string }> {
  const tokensPath = resolve(root, "styles", style, "tokens.json");
  if (existsSync(tokensPath)) {
    const tokens = JSON.parse(await readFile(tokensPath, "utf8")) as {
      type?: { scale?: Record<string, number> };
    };
    const label = tokens.type?.scale?.label;
    if (Number.isFinite(label) && (label as number) > 0) {
      return { px: label as number, source: `styles/${style}/tokens.json type.scale.label` };
    }
  }
  return { px: DEFAULT_FLOOR, source: `default ${DEFAULT_FLOOR}` };
}

/** Letters and digits only, so a wrapped caption still matches its slot line. */
function normalise(text: string): string {
  return String(text).toLowerCase().replace(/[^a-z0-9]/g, "");
}

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
  const floor = await copyFloor(root, style);

  const { width, height } = frameSize(score.aspect);
  const floorPx = Math.round((floor.px * width) / AUTHORED_WIDTH);
  const safe = {
    x0: Math.round(width * margin * 10) / 10,
    y0: Math.round(height * margin * 10) / 10,
    x1: Math.round(width * (1 - margin) * 10) / 10,
    y1: Math.round(height * (1 - margin) * 10) / 10,
  };

  const work = resolve(root, "build", score.id, "type-probe");
  await mkdir(work, { recursive: true });
  let probeFile = join(work, "probe.json");
  const times: number[] = [];
  for (let time = 0; time < score.duration; time += step) times.push(Math.round(time * 100) / 100);

  // `--probe <file>` reads a probe another pass already painted. One inspection
  // pass can carry text, joints and movement at once; the audit then keeps only
  // the frames on its own grid, so its verdict is the one it would have reached
  // by painting them itself (decision 0029).
  const shared = arg("probe");
  if (shared) {
    probeFile = resolve(root, shared);
    console.log(`type: reading ${shared} (no paint)`);
  } else {
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
        // Text boxes, not pictures: the audit reads the probe and never opens a PNG.
        "--no-png",
        "--probe",
        join("build", score.id, "type-probe", "probe.json"),
      ],
      root,
    );
  }

  const raw = JSON.parse(await readFile(probeFile, "utf8")) as ProbeFile;
  const onGrid = (time: number) => {
    const steps = time / step;
    return Math.abs(steps - Math.round(steps)) < 1e-6;
  };
  const data: ProbeFile = { frames: raw.frames.filter((frame) => onGrid(frame.time)) };
  if (data.frames.length === 0) throw new Error("the paint probe returned no frames");

  const outside: { time: number; text: string; box: TextBox; over: number }[] = [];
  const belowFloor: { time: number; text: string; box: TextBox; px: number }[] = [];
  const misMarked: { time: number; text: string; shot: string }[] = [];
  const onFace: Array<TextOnFace & { time: number; shot: string }> = [];
  const facesByShot = new Map<string, Set<string>>();
  // The score stores each shot's duration, not its start: the start is the sum
  // of the durations before it. One place computes it, so the sample and the
  // shot can never disagree about where a shot begins.
  let clock = 0;
  const shots = (score.shots ?? []).map((shot, index) => {
    const entry = {
      index,
      start: clock,
      duration: shot.duration,
      slots: shot.slots ?? {},
      cast: shot.direction?.cast ?? [],
    };
    clock += shot.duration;
    return entry;
  });
  const shotAt = (time: number) =>
    shots.find((entry) => time >= entry.start && time < entry.start + entry.duration) ??
    // The sample at exactly the film's duration is the last shot's last frame,
    // not a frame outside the film.
    (time >= clock - 1e-9 ? shots[shots.length - 1] : undefined);
  const label = (entry: { index: number; start: number }) => `s${String(entry.index + 1).padStart(2, "0")}@${entry.start.toFixed(2)}s`;
  const copyAt = (time: number): string[] =>
    Object.values(shotAt(time)?.slots ?? {}).map(normalise).filter(Boolean);
  // Which shots showed their copy: a shot that has a slot and never reports a
  // copy box is a painter that stopped marking, not a film with no words.
  const shotsWithCopy = new Set<string>();
  const shotsWithSlots = new Set<string>();
  for (const shot of shots) {
    if (Object.values(shot.slots).some((value) => normalise(value).length > 0)) {
      shotsWithSlots.add(label(shot));
    }
  }
  let boxes = 0;
  let copyBoxes = 0;
  for (const frame of data.frames) {
    const copy = copyAt(frame.time);
    const shot = shotAt(frame.time);
    const shotLabel = shot ? label(shot) : "?";
    const faces = faceBoxes((frame.rigRecords ?? []) as Parameters<typeof faceBoxes>[0]);
    for (const face of faces) {
      if (!shot) continue;
      const set = facesByShot.get(shotLabel) ?? new Set<string>();
      set.add(face.character);
      facesByShot.set(shotLabel, set);
    }
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
      for (const hit of textOnFace([box], faces)) {
        onFace.push({ ...hit, time: frame.time, shot: shotLabel });
      }
      if (box.copy !== true) continue;
      copyBoxes++;
      if (shot) shotsWithCopy.add(label(shot));
      // A marked run must be a piece of *this* shot's copy: the mark says "this
      // is the film's words", and the score says which words those are.
      const run = normalise(box.text);
      if (!copy.some((line) => line.includes(run) || run.includes(line))) {
        misMarked.push({ time: frame.time, text: box.text, shot: shot ? label(shot) : "?" });
      }
      // The probe records the drawn em size; the box can be scaled by a camera,
      // and a camera that shrinks copy below the floor is still a defect.
      const px = Math.round(box.h);
      if (px + 0.5 < floorPx) belowFloor.push({ time: frame.time, text: box.text, box, px });
    }
  }
  const unmarked = [...shotsWithSlots].filter((shot) => !shotsWithCopy.has(shot));
  const requiresFaces = (score.shots ?? []).some(
    (shot) => typeof shot.visual?.phrase === "string" && shot.visual.phrase.length > 0,
  );
  const unmeasuredFaces = shots.flatMap((shot) => {
    const labelText = label(shot);
    const seen = facesByShot.get(labelText) ?? new Set<string>();
    return shot.cast.filter((character) => !seen.has(character)).map((character) => `${labelText}:${character}`);
  });

  const pass =
    outside.length === 0 &&
    belowFloor.length === 0 &&
    misMarked.length === 0 &&
    (copyBoxes > 0 || shotsWithSlots.size === 0) &&
    unmarked.length === 0 &&
    onFace.length === 0 &&
    (!requiresFaces || unmeasuredFaces.length === 0);
  // The tie that lets a review reuse this report (decision 0033): the score it
  // measured, so a report about a different edit cannot be mistaken for fresh.
  const scoreHash = `sha256:${createHash("sha256").update(await readFile(resolve(root, scorePath), "utf8")).digest("hex")}`;
  const report = {
    film: score.id,
    contract: VISUAL_CONTRACT_VERSION,
    score: scoreHash,
    pass,
    frame: { width, height },
    safe,
    margin: { value: margin, source: resolved.source },
    floor: { px: floorPx, authored: floor.px, authoredWidth: AUTHORED_WIDTH, source: floor.source },
    sampled: data.frames.length,
    step,
    boxes,
    copyBoxes,
    outside,
    belowFloor,
    misMarked,
    unmarked,
    faces: {
      boxes: [...facesByShot.values()].reduce((sum, set) => sum + set.size, 0),
      characters: [...new Set([...facesByShot.values()].flatMap((set) => [...set]))],
      shots: [...facesByShot.keys()],
      unmeasured: unmeasuredFaces,
      required: requiresFaces,
    },
    textOnFace: onFace,
    checks: {
      insideSafe: outside.length === 0,
      copyMarked: (copyBoxes > 0 || shotsWithSlots.size === 0) && unmarked.length === 0,
      copyAtFloor: belowFloor.length === 0,
      copyMatchesScore: misMarked.length === 0,
      faceClear: onFace.length === 0,
      faceMeasured: !requiresFaces || unmeasuredFaces.length === 0,
    },
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
    for (const item of belowFloor.slice(0, 12)) {
      console.log(
        `  SMALL ${item.time.toFixed(2)}s "${item.text}" ${item.px}px · the pack's floor is ${floorPx}px`,
      );
    }
    if (belowFloor.length > 12) console.log(`  ... ${belowFloor.length - 12} more`);
    for (const item of misMarked.slice(0, 12)) {
      console.log(`  MARKED-BUT-NOT-COPY ${item.time.toFixed(2)}s "${item.text}" (${item.shot})`);
    }
    for (const shot of unmarked.slice(0, 12)) {
      console.log(`  NO-COPY-MARKED ${shot}: the shot has a slot and no marked copy box`);
    }
  }
  console.log(
    `face: ${report.faces.boxes} box(es) on ${report.faces.characters.length} character(s) · ` +
      `${report.faces.shots.length} shot(s) measured · ${unmeasuredFaces.length} unmeasured · ${onFace.length} text-on-face`,
  );
  for (const item of onFace.slice(0, 12)) {
    console.log(
      `  TEXT-ON-FACE ${item.time.toFixed(2)}s "${item.text}" over ${item.face.character} (${Math.round(item.share * 100)}% of face)`,
    );
  }
  for (const item of unmeasuredFaces.slice(0, 12)) {
    if (requiresFaces) console.log(`  NO-FACE ${item}: a staged character with no face anchor`);
  }
  if (!requiresFaces && unmeasuredFaces.length > 0) {
    console.log(`face: ${unmeasuredFaces.length} unmeasured on a pre-contract rig; no face box to check`);
  }
  console.log(
    `type: ${data.frames.length} frames · ${boxes} text boxes (${copyBoxes} copy) · safe ${safe.x0},${safe.y0}–${safe.x1},${safe.y1} (${Math.round(margin * 100)}% from ${resolved.source}) · copy floor ${floorPx}px (${floor.px} at ${AUTHORED_WIDTH}px, ${floor.source}) · ${pass ? "pass" : `FAIL ${outside.length} outside, ${belowFloor.length} under the floor, ${misMarked.length} mis-marked, ${unmarked.length} shots unmarked`}`,
  );
  console.log(`report: ${reportPath}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
