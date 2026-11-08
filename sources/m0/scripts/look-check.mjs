/**
 * `look-check` — measure the delivered picture in the same units as the
 * reference: mean luma, mean saturation, edge density.
 *
 * A missing input or a measurement that produced no samples is a failure, not
 * a null report: the gate must not pass on a file nobody measured. The report
 * also carries the MP4's sha256, so it is tied to the picture it describes.
 *
 * usage: node scripts/look-check.mjs [video] [out.json]
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const video = process.argv[2] || "proofs/kpop-test/out/kpop-test.mp4";
const outPath = process.argv[3] || "proofs/kpop-test/out/look.json";

if (!existsSync(video)) {
  console.error(`look-check: missing input ${video}`);
  process.exit(1);
}

function measure(vf) {
  const r = spawnSync(ffmpegPath, ["-hide_banner", "-i", video, "-vf", vf, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 30 });
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").trim().split("\n").slice(-4).join("\n");
    console.error(`look-check: ffmpeg exited ${r.status} on ${vf}\n${err}`);
    process.exit(1);
  }
  const grab = (key) => {
    const vals = [...text.matchAll(new RegExp(`lavfi\\.signalstats\\.${key}=([0-9.]+)`, "g"))].map((m) => Number(m[1]));
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };
  return { y: grab("YAVG"), sat: grab("SATAVG") };
}

const base = measure("signalstats,metadata=print:file=-");
const edge = measure("edgedetect=low=0.1:high=0.3,signalstats,metadata=print:file=-");
if (base.y === null || base.sat === null || edge.y === null) {
  console.error(`look-check: no measurement for ${video} (luma ${base.y}, saturation ${base.sat}, edges ${edge.y})`);
  process.exit(1);
}
const videoHash = createHash("sha256").update(readFileSync(video)).digest("hex");
const out = {
  video,
  videoHash,
  luma: +base.y.toFixed(2),
  saturation: +base.sat.toFixed(2),
  edges: +edge.y.toFixed(2),
};
writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log(`look-check: ${video}`);
console.log(`luma ${out.luma}  saturation ${out.saturation}  edges ${out.edges}  sha256:${videoHash.slice(0, 12)}… -> ${outPath}`);
