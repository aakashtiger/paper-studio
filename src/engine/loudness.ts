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

/** The level the film is mastered to, and the true peak it is held under. */
export const TARGET_LUFS = -14;
export const TARGET_TP = -1.5;
/**
 * The master's contract, in one place because two copies drifted.
 *
 * `MASTER_MAX_GAIN` is how far the master may lift or cut the whole film before
 * the answer is "the mix is wrong, not the level". `LIMITER_MAX_REDUCTION` is
 * how much the limiter may take off the loudest sample before the master is
 * compressing the programme rather than catching peaks.
 *
 * `scripts/mix.ts` refuses a film past either bound; `scripts/gate-7.ts` refuses
 * a report that claims to be inside them. They used to restate the numbers, and
 * when the narration began obeying the clock the mix needed 9.1 dB — the mix
 * accepted it and the gate still held the old 8. One constant, two readers.
 */
export const MASTER_MAX_GAIN = 12;
export const LIMITER_MAX_REDUCTION = 8;

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
  return measureWithFilters(binary, input, []);
}

/**
 * The same measurement with filters in front of the meter — the mix uses it to
 * read the premaster *after* the gain it applied, which is the only honest
 * input to a limiter reduction.
 */
export function measureWithFilters(binary: string, input: string, filters: string[]): Loudness {
  const chain = [...filters, "ebur128=peak=true"].join(",");
  const output = runFfmpeg(binary, ["-hide_banner", "-i", input, "-af", chain, "-f", "null", "-"]);
  const summary = output.slice(output.lastIndexOf("Summary:"));
  return {
    // No default: a summary the meter did not print is a measurement that did
    // not happen, and `NaN` fails every bound it is compared against.
    lufs: Number(summary.match(/I:\s*(-?[\d.]+)\s*LUFS/)?.[1] ?? "NaN"),
    lra: Number(summary.match(/LRA:\s*(-?[\d.]+)\s*LU/)?.[1] ?? "NaN"),
    truePeak: Number(summary.match(/Peak:\s*(-?[\d.]+)\s*dBFS/)?.[1] ?? "NaN"),
  };
}
