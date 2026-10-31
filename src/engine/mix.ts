/**
 * Film mix bus.
 *
 * Pure, deterministic DSP: no RNG, no clock, no I/O. The CLI reads the voice
 * and the generated SFX, calls `mixFilm`, and masters the result.
 *
 * What the bus does:
 *   - highpasses the voice at 75 Hz so the narration sits above the rumble;
 *   - places each cue in its declared band;
 *   - ducks the 1-4 kHz band of every cue against the voice envelope;
 *   - sends each cue to one shared reverb return (Freeverb tuning);
 *   - fades the tail so the film ends on silence.
 *
 * The cue defaults are the SFX kit's own (`src/engine/sfx.ts`): one table for
 * how a kind sounds, how loud it is, where it sits and how much of it reaches
 * the room.
 */
import { kindSpec } from "./sfx.js";

export type MixCueInput = {
  id: string;
  kind: string;
  at: number;
  /** Mono cue audio at the mix sample rate. */
  samples: Float32Array;
  send: number;
  duckDb: number;
  band?: [number, number];
  pan?: number;
};

export type MixOptions = {
  sampleRate: number;
  duration: number;
  voice?: Float32Array | null;
  cues: MixCueInput[];
  voiceHpfHz?: number;
  tailFade?: number;
  reverb?: { room?: number; damp?: number; wet?: number };
};

/**
 * Send, duck and band come from the SFX kit — one table, not two. A cue that
 * sets them explicitly still wins; everything else is the kind's own design.
 */
export function cueSend(cue: { kind: string; send?: number }): number {
  return cue.send ?? kindSpec(cue.kind).send;
}

export function cueDuckDb(cue: { kind: string; duckDb?: number }): number {
  return cue.duckDb ?? kindSpec(cue.kind).duckDb;
}

export function cueBand(cue: { kind: string; band?: [number, number] }): [number, number] | undefined {
  return cue.band ?? kindSpec(cue.kind).band;
}

type Biquad = { b0: number; b1: number; b2: number; a1: number; a2: number };

export function highpassCoeffs(fc: number, sampleRate: number, q = 0.707): Biquad {
  const w0 = (2 * Math.PI * fc) / sampleRate;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  return {
    b0: ((1 + cos) / 2) / a0,
    b1: (-(1 + cos)) / a0,
    b2: ((1 + cos) / 2) / a0,
    a1: (-2 * cos) / a0,
    a2: (1 - alpha) / a0,
  };
}

export function bandpassCoeffs(lo: number, hi: number, sampleRate: number): Biquad {
  const center = Math.sqrt(lo * hi);
  const q = Math.min(6, Math.max(0.15, center / Math.max(1, hi - lo)));
  const w0 = (2 * Math.PI * center) / sampleRate;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  return {
    b0: alpha / a0,
    b1: 0,
    b2: -alpha / a0,
    a1: (-2 * cos) / a0,
    a2: (1 - alpha) / a0,
  };
}

/** Forward a signal through a biquad. Returns a new array; input is untouched. */
export function applyBiquad(input: Float32Array, coeffs: Biquad): Float32Array {
  const out = new Float32Array(input.length);
  const { b0, b1, b2, a1, a2 } = coeffs;
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x0 = input[i] ?? 0;
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    out[i] = y0;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
  }
  return out;
}

/**
 * Envelope of a signal, normalised to 0-1, with a fast attack and a slower
 * release. Used as the sidechain key so the ducking does not chatter.
 */
export function envelope(
  signal: Float32Array,
  sampleRate: number,
  attack = 0.005,
  release = 0.15,
): Float32Array {
  const out = new Float32Array(signal.length);
  const attackCoef = Math.exp(-1 / (sampleRate * attack));
  const releaseCoef = Math.exp(-1 / (sampleRate * release));
  let env = 0;
  let peak = 1e-9;
  for (let i = 0; i < signal.length; i++) {
    const x = Math.abs(signal[i] ?? 0);
    const coef = x > env ? attackCoef : releaseCoef;
    env = x + coef * (env - x);
    out[i] = env;
    if (env > peak) peak = env;
  }
  for (let i = 0; i < out.length; i++) out[i] = (out[i] ?? 0) / peak;
  return out;
}

function comb(signal: Float32Array, length: number, feedback: number, damp: number): Float32Array {
  const out = new Float32Array(signal.length);
  const buffer = new Float32Array(length);
  let index = 0;
  let store = 0;
  for (let i = 0; i < signal.length; i++) {
    const value = buffer[index] ?? 0;
    store = value * (1 - damp) + store * damp;
    buffer[index] = (signal[i] ?? 0) + store * feedback;
    out[i] = value;
    index = (index + 1) % length;
  }
  return out;
}

function allpass(signal: Float32Array, length: number): Float32Array {
  const out = new Float32Array(signal.length);
  const buffer = new Float32Array(length);
  let index = 0;
  for (let i = 0; i < signal.length; i++) {
    const value = buffer[index] ?? 0;
    const input = signal[i] ?? 0;
    buffer[index] = input + value * 0.5;
    out[i] = value - input;
    index = (index + 1) % length;
  }
  return out;
}

/** Freeverb-style shared reverb return. Deterministic; no randomness. */
export function freeverb(
  input: Float32Array,
  sampleRate: number,
  options: { room?: number; damp?: number; wet?: number } = {},
): { left: Float32Array; right: Float32Array } {
  const room = options.room ?? 0.82;
  const damp = options.damp ?? 0.2;
  const wet = options.wet ?? 0.32;
  const scale = sampleRate / 44100;
  const combTuning = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const allpassTuning = [556, 441, 341, 225];
  const spread = 23;

  const run = (offset: number): Float32Array => {
    const out = new Float32Array(input.length);
    const combs = combTuning.map((tuning) =>
      comb(input, Math.max(2, Math.round((tuning + offset) * scale)), room, damp),
    );
    for (const line of combs) {
      for (let i = 0; i < out.length; i++) out[i] = (out[i] ?? 0) + (line[i] ?? 0);
    }
    for (let i = 0; i < out.length; i++) out[i] = (out[i] ?? 0) / combs.length;
    let series: Float32Array = out;
    for (const tuning of allpassTuning) {
      series = allpass(series, Math.max(2, Math.round((tuning + offset) * scale)));
    }
    for (let i = 0; i < series.length; i++) series[i] = (series[i] ?? 0) * wet;
    return series;
  };

  return { left: run(0), right: run(spread) };
}

export function mixFilm(options: MixOptions): { left: Float32Array; right: Float32Array } {
  const sr = options.sampleRate;
  const total = Math.max(1, Math.ceil(options.duration * sr));
  const dryL = new Float32Array(total);
  const dryR = new Float32Array(total);
  const sendBus = new Float32Array(total);

  const voice = options.voice ?? null;
  const key = voice ? envelope(applyBiquad(voice, bandpassCoeffs(1000, 4000, sr)), sr) : null;

  for (const cue of options.cues) {
    let signal = cue.samples;
    if (cue.band) {
      signal = applyBiquad(signal, bandpassCoeffs(cue.band[0], cue.band[1], sr));
    }
    const presence = applyBiquad(signal, bandpassCoeffs(1000, 4000, sr));
    const duckGain = 10 ** (-cue.duckDb / 20);
    const pan = cue.pan ?? 0;
    const gainL = Math.sqrt(0.5 * (1 - pan));
    const gainR = Math.sqrt(0.5 * (1 + pan));
    const start = Math.round(cue.at * sr);
    for (let i = 0; i < signal.length; i++) {
      const at = start + i;
      if (at >= total) break;
      const rest = (signal[i] ?? 0) - (presence[i] ?? 0);
      const key01 = key ? (key[at] ?? 0) : 0;
      const gain = 1 + (duckGain - 1) * key01;
      const value = rest + (presence[i] ?? 0) * gain;
      dryL[at] = (dryL[at] ?? 0) + value * gainL;
      dryR[at] = (dryR[at] ?? 0) + value * gainR;
      sendBus[at] = (sendBus[at] ?? 0) + value * cue.send * 0.7;
    }
  }

  const reverb = freeverb(sendBus, sr, options.reverb);
  const voiced = voice ? applyBiquad(voice, highpassCoeffs(options.voiceHpfHz ?? 75, sr)) : null;

  const left = new Float32Array(total);
  const right = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const v = voiced ? (voiced[i] ?? 0) : 0;
    left[i] = v + (dryL[i] ?? 0) + (reverb.left[i] ?? 0);
    right[i] = v + (dryR[i] ?? 0) + (reverb.right[i] ?? 0);
  }

  const fadeSamples = Math.min(total, Math.round((options.tailFade ?? 0.5) * sr));
  for (let i = 0; i < fadeSamples; i++) {
    const index = total - fadeSamples + i;
    // 1 at the start of the window, 0 at the last sample: the film ends in
    // silence. The cosine half-wave is the shape; the sign is what makes it a
    // fade out instead of a swell.
    const g = 0.5 + 0.5 * Math.cos((Math.PI * i) / fadeSamples);
    left[index] = (left[index] ?? 0) * g;
    right[index] = (right[index] ?? 0) * g;
  }

  return { left, right };
}
