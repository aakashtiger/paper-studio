/**
 * The one place loudness is measured.
 *
 * Every number the mix and the deliverable report — integrated loudness, true
 * peak, loudness range — comes from `ebur128=peak=true`, read from its own
 * summary. Two scripts that each parsed the output would eventually disagree;
 * this module is so they cannot.
 *
 * `volumedetect` is deliberately absent: it clamps its samples to 16-bit and
 * reports a signal lifted over full scale as 0 dB, which made a 7.5 dB limiter
 * reduction read as 2.0 dB.
 */
import { spawnSync } from "node:child_process";

export type Loudness = { lufs: number; truePeak: number; lra: number };

export function runFfmpeg(binary: string, args: string[]): string {
  const result = spawnSync(binary, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    console.error(result.stderr?.slice(-1500) ?? "");
    throw new Error(`${binary} exited ${result.status}`);
  }
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
}

export function measureLoudness(binary: string, input: string): Loudness {
  const output = runFfmpeg(binary, ["-hide_banner", "-i", input, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const summary = output.slice(output.lastIndexOf("Summary:"));
  return {
    lufs: Number(summary.match(/I:\s*(-?[\d.]+)\s*LUFS/)?.[1] ?? "NaN"),
    lra: Number(summary.match(/LRA:\s*(-?[\d.]+)\s*LU/)?.[1] ?? "NaN"),
    truePeak: Number(summary.match(/Peak:\s*(-?[\d.]+)\s*dBFS/)?.[1] ?? "NaN"),
  };
}
