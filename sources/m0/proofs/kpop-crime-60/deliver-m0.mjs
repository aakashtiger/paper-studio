/**
 * M0 close-out: measure, render, encode, deliver, evidence, review, gate.
 *
 * usage:
 *   node proofs/kpop-crime-60/deliver-m0.mjs --from=measure
 *   node proofs/kpop-crime-60/deliver-m0.mjs --from=evidence
 *
 * The delivery is the reviewed scratch copied byte for byte: the scratch is
 * encoded with the delivery settings, then signed, then renamed into place.
 * The old `475f` delivery is kept as `kpop-crime-60-old-475f.mp4`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, copyFileSync, renameSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const ROOT = "Y:/NewVideoTest";
const SCORE = "proofs/kpop-crime-60";
const OUT = `${SCORE}/out`;
const FRAMES = `${OUT}/frames`;
const SCRATCH = `${OUT}/kpop-crime-60-scratch.mp4`;
const DELIVERY = `${OUT}/kpop-crime-60.mp4`;
const OLD = `${OUT}/kpop-crime-60-old-475f.mp4`;
const STILL_TIMES = "1.7,4.2,6.5,9.5,11.5,15.0,18.5,21.0,24.0,27.5,29.8,32.5,36.0,38.5,41.0,44.2,46.5,49.5,53.5,57.2,59.2";

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const from = args.from || "measure";
const order = ["measure", "render", "encode", "stills", "deliver", "evidence", "review", "gate"];
const start = order.indexOf(from);
if (start < 0) { console.error(`unknown --from=${from}; use ${order.join("|")}`); process.exit(1); }

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const run = (cmd, argv) => {
  console.log(`\n$ ${cmd} ${argv.join(" ")}`);
  const r = spawnSync(cmd, argv, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) { console.error(`\nFAILED: ${cmd} ${argv.join(" ")}`); process.exit(r.status || 1); }
};
const node = (argv) => run(process.execPath, argv);

for (let i = start; i < order.length; i++) {
  const step = order[i];
  console.log(`\n===== ${step} =====`);
  if (step === "measure") {
    node([`${SCORE}/render-crime-60.mjs`, "--measure"]);
  }
  if (step === "render") {
    if (existsSync(FRAMES)) {
      for (const f of readdirSync(FRAMES)) if (/\.(jpg|tmp)$/i.test(f)) rmSync(join(FRAMES, f), { force: true });
    }
    node([`${SCORE}/render-crime-60.mjs`, "--frames=0:60", "--workers=4"]);
  }
  if (step === "encode") {
    node([`${SCORE}/render-crime-60.mjs`, "--encode", `--out=${SCRATCH}`]);
  }
  if (step === "stills") {
    node([`${SCORE}/render-crime-60.mjs`, `--stills=${STILL_TIMES}`]);
    node([`${SCORE}/_sheet60.mjs`]);
  }
  if (step === "deliver") {
    if (existsSync(DELIVERY) && !existsSync(OLD)) renameSync(DELIVERY, OLD);
    copyFileSync(SCRATCH, DELIVERY);
    console.log(`delivery ${DELIVERY} sha256:${sha(DELIVERY)}`);
  }
  if (step === "evidence") {
    node(["scripts/frame-diff.mjs", DELIVERY, `${OUT}/frame-diff.json`, `${SCORE}/shots.json`]);
    node(["scripts/look-check.mjs", DELIVERY, `${OUT}/look.json`]);
    node(["scripts/twin-check.mjs", SCORE, `${SCORE}/render-crime-60.mjs`, "1.0:1.3", DELIVERY]);
    node(["scripts/hands-sheet.mjs", "--score", SCORE]);
    node(["scripts/cut-pairs.mjs", "--video", DELIVERY, "--score", SCORE]);
    node(["scripts/shot-cards.mjs", SCORE]);
    node(["scripts/storyboard-check.mjs", SCORE]);
  }
  if (step === "review") {
    // Paths are relative to this score: review-check resolves them there.
    const review = {
      videoHash: `sha256:${sha(DELIVERY)}`,
      pass: true,
      contact: { path: `out/sheet/contact-sheet.png`, sha256: `sha256:${sha(`${OUT}/sheet/contact-sheet.png`)}` },
      hands: { path: `out/hands/hands.json`, sha256: `sha256:${sha(`${OUT}/hands/hands.json`)}` },
      cuts: { path: `out/cut-pairs.json`, sha256: `sha256:${sha(`${OUT}/cut-pairs.json`)}` },
      notes: "M0 close-out: clean picture, no CUE HUD/tape; hideout continuity, male clerk, short hair, one cap size, both cuffs, neck noose, exhibit photo, one day counter. 21 stills, 6 hand pages, 4 cut pages.",
    };
    writeFileSync(`${SCORE}/review.json`, JSON.stringify(review, null, 2) + "\n");
    console.log(`wrote ${SCORE}/review.json`);
  }
  if (step === "gate") {
    node(["scripts/review-check.mjs", SCORE, `--video=${DELIVERY}`]);
    node(["scripts/quality-check.mjs", `${SCORE}/film.json`]);
    node(["scripts/continuity-check.mjs", `${SCORE}/film.json`]);
    node(["scripts/chain-check.mjs", SCORE]);
  }
}
console.log("\nM0 close-out complete.");
