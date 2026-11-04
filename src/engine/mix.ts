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
import { kindSpec, loudMoment } from "./sfx.js";

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
  /**
   * Where the cue's loudest 50 ms should land on the bus, in dBFS: the level
   * the score's `gain` asks for. The bus re-levels to it *after* placing the
   * cue in its band, because a band edge removes real energy from a broadband
   * hit — 3 dB of a snap, in this film — and a cue whose `gain` is its level in
   * the file but not in the mix is a level the score does not control.
   */
  levelDb?: number;
};

export type VoiceGain = {
  start: number;
  duration: number;
  gainDb: number;
};

export type MixOptions = {
  sampleRate: number;
  duration: number;
  voice?: Float32Array | null;
  /**
   * A line may be deliberately quieter than the film around it. The gain is
   * applied to the voice before the highpass and the duck key, so the sidechain
   * follows the room's attention rather than the file's level.
   */
  voiceGains?: VoiceGain[];
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

/**
 * Where a mix bus may peak. Below full scale, so the master's gain is a gain and
 * not a repair, and so the premaster would still be legal if it were written as
 * 16-bit.
 */
export const PREMASTER_CEILING = 0.891; // -1 dBFS

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

export function lowpassCoeffs(fc: number, sampleRate: number, q = 0.707): Biquad {
  const w0 = (2 * Math.PI * fc) / sampleRate;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  return {
    b0: ((1 - cos) / 2) / a0,
    b1: ((1 - cos) / a0),
    b2: ((1 - cos) / 2) / a0,
    a1: (-2 * cos) / a0,
    a2: (1 - alpha) / a0,
  };
}

/**
 * Place a cue in its declared band: a highpass at `lo` and a lowpass at `hi`,
 * both at unity gain inside the band.
 *
 * This was one resonant bandpass centred on `sqrt(lo*hi)` with a Q wide enough
 * to look harmless — it was not. A `[200, 9000]` cue lost 1-3.4 dB at its own
 * loudest moment, so a cue's `gain` in the score stopped being the level it
 * reached in the mix, and the film's bright cues were quietly the ones losing
 * the most. Two shelf-free edges pass the band and change nothing inside it.
 */
export function bandEdges(signal: Float32Array, band: [number, number], sampleRate: number): Float32Array {
  const highpassed = applyBiquad(signal, highpassCoeffs(band[0], sampleRate));
  // A lowpass at or above Nyquist is the identity; skip it rather than compute it.
  if (band[1] >= sampleRate / 2) return highpassed;
  return applyBiquad(highpassed, lowpassCoeffs(band[1], sampleRate));
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
  const out = envelopeRaw(signal, sampleRate, attack, release);
  let peak = 1e-9;
  for (const value of out) if (value > peak) peak = value;
  for (let i = 0; i < out.length; i++) out[i] = (out[i] ?? 0) / peak;
  return out;
}

/** The same follower, not normalised: the caller decides what to divide it by. */
export function envelopeRaw(
  signal: Float32Array,
  sampleRate: number,
  attack = 0.005,
  release = 0.15,
): Float32Array {
  const out = new Float32Array(signal.length);
  const attackCoef = Math.exp(-1 / (sampleRate * attack));
  const releaseCoef = Math.exp(-1 / (sampleRate * release));
  let env = 0;
  for (let i = 0; i < signal.length; i++) {
    const x = Math.abs(signal[i] ?? 0);
    const coef = x > env ? attackCoef : releaseCoef;
    env = x + coef * (env - x);
    out[i] = env;
  }
  return out;
}

/** The largest value in `values` within +/- `half` samples, in O(n). */
export function localMax(values: Float32Array, half: number): Float32Array {
  const n = values.length;
  const w = Math.min(n, Math.max(1, 2 * half + 1));
  const out = new Float32Array(n);
  // Two arrays, the standard trick: a suffix max inside each block of `w` and a
  // prefix max from the block start. A window of `w` never spans more than two
  // adjacent blocks, so the answer is the max of the two.
  const prefix = new Float32Array(n);
  const suffix = new Float32Array(n);
  for (let start = 0; start < n; start += w) {
    const end = Math.min(n, start + w);
    let run = 0;
    for (let i = start; i < end; i++) {
      run = Math.max(run, values[i] ?? 0);
      prefix[i] = run;
    }
    run = 0;
    for (let i = end - 1; i >= start; i--) {
      run = Math.max(run, values[i] ?? 0);
      suffix[i] = run;
    }
  }
  for (let i = 0; i < n; i++) {
    const from = Math.max(0, i - half);
    const to = Math.min(n - 1, i + half);
    out[i] = Math.max(suffix[from] ?? 0, prefix[to] ?? 0);
  }
  return out;
}

/**
 * How deep a cue should duck, as a 0-1 key.
 *
 * Normalising the sidechain by the film's single loudest moment — what this did
 * before — made a declared duck a fraction of itself: only 257 ms of a 29.5 s
 * take reach the take's peak, so an 8 dB declaration arrived as ~2.6 dB at the
 * hit it was written for, and at 9.0 s the slam sat 2.3 dB above the word it
 * was supposed to make room for.
 *
 * The key is a **presence gate on a local reference**: 1 where the voice's
 * presence is within `rangeDb` of its own loudest moment in the surrounding
 * `hold` seconds, ramping to 0 over `kneeDb`. It follows the line, not the
 * film, so `duckDb` is the depth the cue actually gets whenever a word is in
 * the air — which is what the score says it means.
 */
export function duckKey(
  signal: Float32Array,
  sampleRate: number,
  options: { hold?: number; rangeDb?: number; kneeDb?: number } = {},
): Float32Array {
  const hold = options.hold ?? 1;
  /**
   * How far below the local peak still counts as a word. Speech is not flat:
   * a fricative sits 10-15 dB under a stressed vowel, and a loud burst a second
   * earlier must not make the following line read as "not talking". 18 dB with
   * a 6 dB knee opens the key fully for anything within 12 dB of the local
   * peak, and closes it in a real gap.
   */
  const rangeDb = options.rangeDb ?? 18;
  const kneeDb = options.kneeDb ?? 6;
  /**
   * The floor of the local reference. Without it a silent stretch is "12 dB
   * over its own silence" — 0 divided by 0 in dB — and the key reads as a full
   * duck in every gap after the narration stops, which is the opposite of what
   * a duck is for.
   */
  const MIN_LEVEL = 1e-4; // -80 dBFS in the presence band

  const env = envelopeRaw(signal, sampleRate);
  const local = localMax(env, Math.round(hold * sampleRate));
  const out = new Float32Array(env.length);
  for (let i = 0; i < env.length; i++) {
    const level = 20 * Math.log10((env[i] ?? 0) + 1e-9);
    const reference = Math.max(local[i] ?? 0, MIN_LEVEL);
    const floor = 20 * Math.log10(reference) - rangeDb;
    out[i] = Math.min(1, Math.max(0, (level - floor) / kneeDb));
  }
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

export type MixCueReport = {
  id: string;
  /** What the score (or the kind) asked for. */
  declaredDb: number;
  /** The deepest duck it actually received inside its own span, in dB. */
  appliedDb: number;
  /** When that deepest duck happened, in film seconds. */
  at: number | null;
  /** Cue presence minus voice presence in 1-4 kHz, averaged over the words it shares, in dB. */
  overVoiceDb: number | null;
  /** How many seconds of the cue sat under a word. */
  overlap: number;
  /** The cue's loudest 50 ms after the bus placed it in its band, in dBFS. */
  busPeakDb: number;
};

export type MixResult = {
  left: Float32Array;
  right: Float32Array;
  busGainDb: number;
  cues: MixCueReport[];
};

/**
 * Apply the score's per-line gains to the voice, with a short fade at each
 * edge so a quiet line cannot click. A gain of 0 dB returns the input array
 * itself; the mix never mutates the caller's samples.
 */
export function applyVoiceGains(
  voice: Float32Array,
  sampleRate: number,
  gains: readonly VoiceGain[],
): Float32Array {
  if (gains.length === 0) return voice;
  const out = new Float32Array(voice);
  for (const gain of gains) {
    if (!Number.isFinite(gain.gainDb) || gain.gainDb === 0) continue;
    const from = Math.max(0, Math.floor(gain.start * sampleRate));
    const to = Math.min(out.length, Math.ceil((gain.start + gain.duration) * sampleRate));
    if (to <= from) continue;
    const target = 10 ** (gain.gainDb / 20);
    const fade = Math.max(1, Math.round(0.04 * sampleRate));
    for (let i = from; i < to; i += 1) {
      const edge = Math.min(1, (i - from) / fade, (to - i) / fade);
      out[i] = (out[i] ?? 0) * (1 + (target - 1) * edge);
    }
  }
  return out;
}

export function mixFilm(options: MixOptions): MixResult {
  const sr = options.sampleRate;
  const total = Math.max(1, Math.ceil(options.duration * sr));
  const dryL = new Float32Array(total);
  const dryR = new Float32Array(total);
  const sendBus = new Float32Array(total);

  const voice = options.voice
    ? applyVoiceGains(options.voice, sr, options.voiceGains ?? [])
    : null;
  const voiced = voice ? applyBiquad(voice, highpassCoeffs(options.voiceHpfHz ?? 75, sr)) : null;
  const presence = voiced ? applyBiquad(voiced, bandpassCoeffs(1000, 4000, sr)) : null;
  // The sidechain is the voice's own presence, gated against its local level,
  // so a declared duck is the duck the cue gets. See `duckKey`.
  const key = presence ? duckKey(presence, sr) : null;
  // Balance is judged on 100 ms of energy, not on a sample: two sounds cross
  // zero at different moments, and a sample-by-sample comparison reads a cue
  // +100 dB over a voice at every zero crossing.
  const reports: MixCueReport[] = [];

  for (const cue of options.cues) {
    if (!Number.isFinite(cue.at)) {
      throw new Error(`sfx "${cue.id}" has no time: a cue needs a resolved \`at\` before the mix`);
    }
    let signal = cue.samples;
    if (cue.band) {
      signal = bandEdges(signal, cue.band, sr);
    }
    // Put the cue back on its declared level after the band placement, then
    // keep it under full scale: the band is the timbre, not the level.
    if (cue.levelDb !== undefined) {
      const here = 20 * Math.log10(loudMoment(signal, sr) + 1e-9);
      let scale = 10 ** ((cue.levelDb - here) / 20);
      let peak = 0;
      for (let i = 0; i < signal.length; i++) peak = Math.max(peak, Math.abs(signal[i] ?? 0));
      if (peak * scale > 0.98) scale = 0.98 / peak;
      const relit = new Float32Array(signal.length);
      for (let i = 0; i < signal.length; i++) relit[i] = (signal[i] ?? 0) * scale;
      signal = relit;
    }
    const cuePresence = applyBiquad(signal, bandpassCoeffs(1000, 4000, sr));
    const duckGain = 10 ** (-cue.duckDb / 20);
    const pan = cue.pan ?? 0;
    const gainL = Math.sqrt(0.5 * (1 - pan));
    const gainR = Math.sqrt(0.5 * (1 + pan));
    const start = Math.round(cue.at * sr);
    let deepest = 0;
    let deepestAt: number | null = null;
    let cueEnergy = 0;
    let voiceEnergy = 0;
    let overlapSamples = 0;
    for (let i = 0; i < signal.length; i++) {
      const at = start + i;
      if (at >= total) break;
      const rest = (signal[i] ?? 0) - (cuePresence[i] ?? 0);
      const key01 = key ? (key[at] ?? 0) : 0;
      const gain = 1 + (duckGain - 1) * key01;
      const value = rest + (cuePresence[i] ?? 0) * gain;
      dryL[at] = (dryL[at] ?? 0) + value * gainL;
      dryR[at] = (dryR[at] ?? 0) + value * gainR;
      sendBus[at] = (sendBus[at] ?? 0) + value * cue.send * 0.7;
      // What the cue gave up, and where.
      const reduction = -20 * Math.log10(gain);
      if (reduction > deepest) {
        deepest = reduction;
        deepestAt = at / sr;
      }
      // Balance, averaged over the words the cue actually shares time with: a
      // strike may be loud for a 20 ms edge, but the voice has to own the band
      // across the line it is speaking. A single window is not the question.
      if (key01 > 0.5 && presence) {
        cueEnergy += ((cuePresence[i] ?? 0) * gain) ** 2;
        voiceEnergy += (presence[at] ?? 0) ** 2;
        overlapSamples += 1;
      }
    }
    reports.push({
      id: cue.id,
      declaredDb: cue.duckDb,
      appliedDb: Number(deepest.toFixed(2)),
      at: deepestAt === null ? null : Number(deepestAt.toFixed(2)),
      overVoiceDb:
        overlapSamples > 0 && voiceEnergy > 0 && cueEnergy > 0
          ? Number((10 * Math.log10(cueEnergy / voiceEnergy)).toFixed(1))
          : null,
      overlap: Number((overlapSamples / sr).toFixed(2)),
      busPeakDb: Number((20 * Math.log10(loudMoment(signal, sr) + 1e-9)).toFixed(1)),
    });
  }

  const reverb = freeverb(sendBus, sr, options.reverb);

  const left = new Float32Array(total);
  const right = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const v = voiced ? (voiced[i] ?? 0) : 0;
    left[i] = v + (dryL[i] ?? 0) + (reverb.left[i] ?? 0);
    right[i] = v + (dryR[i] ?? 0) + (reverb.right[i] ?? 0);
  }

  // The mix leaves the master a file that is in range. A bus that peaks over
  // full scale is a badly staged mix whatever the float arithmetic allows, and
  // the gain the master then needs would be a lie about the mix's level. Only
  // ever turned down: a quiet mix is not rescued here.
  let busPeak = 0;
  for (let i = 0; i < total; i++) busPeak = Math.max(busPeak, Math.abs(left[i] ?? 0), Math.abs(right[i] ?? 0));
  const headroom = busPeak > PREMASTER_CEILING ? PREMASTER_CEILING / busPeak : 1;
  if (headroom < 1) {
    for (let i = 0; i < total; i++) {
      left[i] = (left[i] ?? 0) * headroom;
      right[i] = (right[i] ?? 0) * headroom;
    }
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

  return { left, right, busGainDb: Number((20 * Math.log10(headroom)).toFixed(2)), cues: reports };
}
