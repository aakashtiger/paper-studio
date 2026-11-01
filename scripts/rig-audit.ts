/**
 * Rig audit: does the leg that is drawn match the leg that was solved?
 *
 * A two-bone leg is solved from a hip and an ankle target (the intent) and then
 * drawn as two limbs (the truth). Three things can go wrong and none of them
 * show up in a still:
 *
 *   1. the drawn segments use different lengths than the solver — the knee
 *      detaches from the shin (the classic "rig seam");
 *   2. the target is out of reach, so the solver clamps and the drawn ankle
 *      never arrives — a floating foot;
 *   3. the knee folds the wrong way, or the leg locks straight.
 *
 * The probe records every solve and every limb; this audit pairs them per frame
 * and checks all three. Pairing is positional (solve → thigh → shin), so if the
 * pairing ever stops matching the check fails loudly instead of passing empty.
 *
 * The fourth failure is not the leg: a body part drawn outside the transform it
 * hangs from. The long hair was drawn at the rig root, so it kept the upright
 * head's place and read as a second, detached head the moment a character bowed;
 * every still that checked the head alone passed. Each rig now publishes the
 * chest, the head pivot and the hair, and this audit holds each one still **in
 * the space of the part it hangs from** — the head pivot against the chest, the
 * hair against the head. Measured against the chest instead, the hair moves
 * through an arc whenever the head turns, which is a head turning rather than a
 * rig coming apart (decision 0024).
 *
 * usage: npm run audit:rig -- films/understudy/score.json [--step 0.1]
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { anchorsInSpace } from "../src/engine/rig.js";

type Solve = {
  kind: "solve";
  character: string;
  side: number;
  hip: [number, number];
  target: [number, number];
  l1: number;
  l2: number;
  reach: number;
  hipAngle: number;
  kneeBend: number;
  shinAngle: number;
};
type Limb = {
  kind: "limb";
  character: string;
  len: number;
  from: [number, number];
  to: [number, number];
};
/** A point a rig hangs a body part from, plus the transform in force there. */
type Anchor = {
  kind: "anchor";
  character: string;
  part: string;
  local: [number, number];
  m: [number, number, number, number, number, number];
};
type Record = Solve | Limb | Anchor;
type ProbeFile = { frames: { time: number; rigRecords: Record[] }[] };
type Score = {
  id: string;
  duration: number;
  fps?: number;
  shots?: {
    duration: number;
    direction?: { events?: { t: number; kind: string; who?: string }[] };
  }[];
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

const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const finite = (value: number) => Number.isFinite(value);

async function main(): Promise<void> {
  const scorePath = process.argv[2];
  if (!scorePath || scorePath.startsWith("--")) {
    console.error("usage: npm run audit:rig -- <score.json> [--step 0.1]");
    process.exit(2);
  }

  const root = process.cwd();
  const score = JSON.parse(await readFile(resolve(root, scorePath), "utf8")) as Score;
  const step = Number(arg("step") ?? 0.1);
  const lengthTolerance = Number(arg("length-tolerance") ?? 0.5);
  // A few pixels of clamp are a heel lifting under a small bounce, not a
  // defect; the class this catches is the 15–28 px miss that locked every knee.
  const landingTolerance = Number(arg("landing-tolerance") ?? 3);
  const minBend = Number(arg("min-bend") ?? 0.03);
  const maxBend = Number(arg("max-bend") ?? 2.6);
  // Where a body part hangs from its parent is a fixed point of the rig, so the
  // allowed drift is small: pose blending moves the anchor not at all, and a
  // part outside its parent's transform moves it by tens of units.
  const seamTolerance = Number(arg("seam-tolerance") ?? 1.5);

  /**
   * The times the score itself asks the rig to jump.
   *
   * A cut re-stages the frame, and a pose event is a keyframe the film asked
   * for — the painter snaps to it in 0.08 s, and its breakdown lands there. A
   * part that moves at a cut or a key is the film cutting, not the rig coming
   * apart. A dropped transform is the other thing entirely: it is continuous in
   * the pose, so it shows between two neighbouring frames with no event to
   * explain it, which is what the row is for (decision 0011).
   */
  const cuts: number[] = [0];
  const poseKeys = new Map<string, number[]>();
  {
    let start = 0;
    for (const shot of score.shots ?? []) {
      for (const event of shot.direction?.events ?? []) {
        if (event.kind !== "pose" || !event.who) continue;
        const list = poseKeys.get(event.who) ?? [];
        list.push(start + event.t, start + Math.max(0, event.t - 0.08));
        poseKeys.set(event.who, list);
      }
      start += shot.duration;
      cuts.push(start);
    }
  }
  const near = (times: number[] | undefined, time: number) =>
    (times ?? []).some((t) => Math.abs(time - t) <= step + 0.02);
  const declaredJump = (character: string, time: number) =>
    near(cuts, time) || near(poseKeys.get(character), time);

  const work = resolve(root, "build", score.id, "rig-probe");
  await mkdir(work, { recursive: true });
  const probeFile = join(work, "probe.json");

  const times: number[] = [];
  for (let time = 0; time < score.duration; time += step) times.push(Math.round(time * 1000) / 1000);

  console.log(`rig: painting ${times.length} frames at ${step}s steps`);
  await run(
    process.execPath,
    [
      "--import",
      "tsx",
      "scripts/render-film.ts",
      scorePath,
      "--stills",
      times.map((time) => time.toFixed(3)).join(","),
      "--out-dir",
      join("build", score.id, "rig-probe", "stills"),
      "--probe",
      join("build", score.id, "rig-probe", "probe.json"),
    ],
    root,
  );

  const data = JSON.parse(await readFile(probeFile, "utf8")) as ProbeFile;
  if (data.frames.length === 0) throw new Error("the paint probe returned no frames");

  const findings: { time: number; character: string; side: number; part?: string; check: string; detail: string }[] = [];
  const ankles = new Map<string, { time: number; at: [number, number] }[]>();
  // Where a part sits in its parent's space, per frame: `character|part`.
  const seams = new Map<string, { time: number; at: [number, number] }[]>();
  let legs = 0;
  let unpaired = 0;
  let characters = 0;
  let anchors = 0;
  const anchored = new Set<string>();

  for (const frame of data.frames) {
    const records = frame.rigRecords;
    let frameCharacters = 0;

    // 5 — a body part stays where it hangs from. Each rig publishes the point
    // it hangs the chest, the head and the hair from, together with the
    // transform in force there; the point must not move **in the space of the
    // part it hangs from** (decision 0024). A part drawn outside its parent's
    // transform drifts with every lean, and this is the only check that sees it.
    const groups = new Map<string, Anchor[]>();
    for (const record of records) {
      if (!record || record.kind !== "anchor") continue;
      const list = groups.get(record.character) ?? [];
      list.push(record);
      groups.set(record.character, list);
    }
    for (const [name, list] of groups) {
      const chest = list.find((item) => item.part === "chest");
      if (!chest) continue;
      anchored.add(name);
      for (const { part, at } of anchorsInSpace(list)) {
        anchors++;
        const key = `${name}|${part}`;
        const samples = seams.get(key) ?? [];
        samples.push({ time: frame.time, at: [at.x, at.y] });
        seams.set(key, samples);
      }
    }

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (!record || record.kind !== "solve") continue;
      const thigh = records[index + 1];
      const shin = records[index + 2];
      const paired =
        thigh?.kind === "limb" &&
        shin?.kind === "limb" &&
        Math.abs(thigh.len - record.l1) < 1e-6 &&
        Math.abs(shin.len - record.l2) < 1e-6;
      if (!paired) {
        unpaired++;
        continue;
      }
      legs++;
      frameCharacters++;
      const where = { time: frame.time, character: record.character || "?", side: record.side };

      // 1 — the drawn segments are the solved segments.
      const thighLength = dist(thigh.from, thigh.to);
      const shinLength = dist(shin.from, shin.to);
      if (Math.abs(thighLength - record.l1) > lengthTolerance) {
        findings.push({
          ...where,
          check: "thigh-length",
          detail: `drawn ${thighLength.toFixed(2)} vs solved ${record.l1}`,
        });
      }
      if (Math.abs(shinLength - record.l2) > lengthTolerance) {
        findings.push({
          ...where,
          check: "shin-length",
          detail: `drawn ${shinLength.toFixed(2)} vs solved ${record.l2}`,
        });
      }
      const kneeGap = dist(thigh.to, shin.from);
      if (kneeGap > 0.01) {
        findings.push({ ...where, check: "knee-seam", detail: `thigh ends ${kneeGap.toFixed(2)} px from the shin start` });
      }

      // 2 — the drawn ankle arrives where the pose asked for it.
      const landing = dist(shin.to, record.target);
      if (!finite(landing) || landing > landingTolerance) {
        findings.push({
          ...where,
          check: "foot-landing",
          detail: `ankle ${landing.toFixed(2)} px from its target (reach ${record.reach.toFixed(1)} of ${(record.l1 + record.l2).toFixed(1)})`,
        });
      }

      // 3 — the knee bends (never locks), does not fold through, and bends to
      // the side its leg owns. The solver's sign convention is geometric: the
      // left leg (side < 0) carries a negative bend, the right a positive one.
      // A knee whose sign flips is pointing backwards.
      const bend = record.kneeBend;
      const expectedSign = record.side < 0 ? -1 : 1;
      if (!finite(bend) || Math.abs(bend) < minBend || Math.abs(bend) > maxBend) {
        findings.push({
          ...where,
          check: "knee-bend",
          detail: `${Number(bend).toFixed(3)} rad, |bend| outside ${minBend}–${maxBend}`,
        });
      } else if (Math.sign(bend) !== expectedSign) {
        findings.push({
          ...where,
          check: "knee-direction",
          detail: `${Number(bend).toFixed(3)} rad bends the wrong way for side ${record.side}`,
        });
      }

      const key = `${record.character}|${record.side}`;
      const list = ankles.get(key) ?? [];
      list.push({ time: frame.time, at: shin.to });
      ankles.set(key, list);
    }
    if (frameCharacters > 0) characters++;
  }

  // 4 — no pops: an ankle that teleports between samples is a broken chain even
  // when every individual frame is self-consistent.
  const jumpLimit = Number(arg("max-jump") ?? 60);
  let worstJump = { character: "", time: 0, distance: 0 };
  for (const [key, list] of ankles) {
    const [character, side] = key.split("|");
    for (let index = 1; index < list.length; index++) {
      const current = list[index];
      const previous = list[index - 1];
      if (!current || !previous) continue;
      // Only compare adjacent samples: a cut re-stages the character.
      if (Math.abs(current.time - previous.time - step) > 1e-6) continue;
      const jump = dist(current.at, previous.at);
      if (jump > worstJump.distance) worstJump = { character: key, time: current.time, distance: jump };
      if (jump > jumpLimit) {
        findings.push({
          time: current.time,
          character: character ?? "?",
          side: Number(side),
          check: "ankle-pop",
          detail: `${jump.toFixed(1)} px in ${step}s`,
        });
      }
    }
  }

  // 5 — a part that drifts inside its parent. Adjacent samples only, for the
  // same reason as the ankle: a cut re-stages the character, and a rig defect
  // is continuous in the pose, so it shows up between two neighbouring frames.
  let worstSeam = { character: "", part: "", time: 0, distance: 0 };
  let worstAttributed = { character: "", part: "", time: 0, distance: 0 };
  let attributed = 0;
  let seamPairs = 0;
  for (const [key, list] of seams) {
    const [character, part] = key.split("|");
    for (let index = 1; index < list.length; index++) {
      const current = list[index];
      const previous = list[index - 1];
      if (!current || !previous) continue;
      if (Math.abs(current.time - previous.time - step) > 1e-6) continue;
      seamPairs++;
      const shift = dist(current.at, previous.at);
      if (!finite(shift)) {
        findings.push({
          time: current.time,
          character: character ?? "?",
          side: 0,
          part,
          check: "head-seam",
          detail: `${part} anchor is not invertible (degenerate chest transform)`,
        });
        continue;
      }
      if (shift > seamTolerance) {
        if (declaredJump(character ?? "?", current.time)) {
          // The film cut, or asked for this pose. Counted, and reported, but it
          // is not the rig failing to inherit a transform.
          attributed++;
          if (shift > worstAttributed.distance) {
            worstAttributed = { character: character ?? "", part: part ?? "", time: current.time, distance: shift };
          }
          continue;
        }
        if (shift > worstSeam.distance) {
          worstSeam = { character: character ?? "", part: part ?? "", time: current.time, distance: shift };
        }
        findings.push({
          time: current.time,
          character: character ?? "?",
          side: 0,
          part,
          check: "head-seam",
          detail: `${part} moved ${shift.toFixed(1)} units in its parent's space in ${step}s`,
        });
      }
    }
  }


  // Instrumentation must have caught something; an empty pass is a silent lie.
  // `seamPairs` is the number of adjacent comparisons actually made: a rig that
  // published one anchor each would otherwise pass by having nothing to compare.
  const instrumented = legs > 0 && characters > 0 && anchored.size > 0 && seamPairs > 0;
  const pass = instrumented && findings.length === 0;

  const report = {
    film: score.id,
    pass,
    instrumented,
    sampled: data.frames.length,
    step,
    framesWithCharacters: characters,
    legs,
    unpairedSolves: unpaired,
    worstAnkleJump: {
      character: worstJump.character,
      time: worstJump.time,
      distance: Math.round(worstJump.distance * 10) / 10,
      limit: jumpLimit,
    },
    anchors,
    anchorPairs: seamPairs,
    anchoredCharacters: [...anchored].sort(),
    worstSeamShift: {
      character: worstSeam.character,
      part: worstSeam.part,
      time: worstSeam.time,
      units: Math.round(worstSeam.distance * 100) / 100,
      limit: seamTolerance,
    },
    // Shifts across a cut or a declared pose key: the film asking for a jump,
    // counted so the row cannot quietly ignore everything it sees.
    declaredSeamShifts: {
      count: attributed,
      worst: Math.round(worstAttributed.distance * 100) / 100,
      at: worstAttributed.time,
      part: worstAttributed.part,
    },
    thresholds: { lengthTolerance, landingTolerance, minBend, maxBend, jumpLimit, seamTolerance },
    findings,
    probe: `sha256:${createHash("sha256")
      .update(await readFile(resolve(root, "src/engine/paint-probe.js")))
      .digest("hex")}`,
  };
  const reportPath = resolve(root, "build", score.id, "rig-audit.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  for (const item of findings.slice(0, 12)) {
    const who = item.part ? `${item.character}/${item.part}` : `${item.character}/${item.side}`;
    console.log(`  FAIL ${item.time.toFixed(2)}s ${who} ${item.check}: ${item.detail}`);
  }
  if (findings.length > 12) console.log(`  ... ${findings.length - 12} more`);
  console.log(
    `rig: ${legs} legs from ${characters} character frames · worst ankle jump ${worstJump.distance.toFixed(1)}px at ${worstJump.time.toFixed(2)}s · ${unpaired} unpaired solves · ${pass ? "pass" : instrumented ? `FAIL ${findings.length}` : "FAIL not instrumented"}`,
  );
  console.log(
    `rig: ${anchors} anchor samples on ${anchored.size} character(s) (${[...anchored].sort().join(", ") || "none"}) · ${seamPairs} adjacent pairs · worst in-parent shift ${worstSeam.distance.toFixed(2)} units (${worstSeam.part || "n/a"} at ${worstSeam.time.toFixed(2)}s, limit ${seamTolerance}) · ${attributed} shift(s) at a declared cut or pose key (worst ${worstAttributed.distance.toFixed(2)} units at ${worstAttributed.time.toFixed(2)}s)`,
  );
  console.log(`report: ${reportPath}`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
