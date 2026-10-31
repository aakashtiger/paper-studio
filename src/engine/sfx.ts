/**
 * The SFX kit.
 *
 * Foley is generated in code, deterministically, and the *generator* is the
 * point: a cue is built from named layers over a **material**, so a paper snap
 * has paper's modes and a wood knock has wood's. Nothing here samples a library
 * and nothing here is random — a cue's samples are a pure function of its kind,
 * its length and its id, so two runs are byte-identical.
 *
 * A cue is rendered **dry**. The mix owns the one shared reverb return and the
 * ducking; a cue's `send` decides how much of it reaches the room.
 *
 * The material modes are the difference between "a beep" and "a thing". A phone
 * speaker is the target: every kind keeps its energy under 9 kHz, lasts longer
 * than a single sample, and fades out clean, because a tick, a click, a hat, a
 * glitch or a beep is not a sound in this style.
 */

export type Rng = () => number;

/** FNV-1a over the cue's text, fed to mulberry32. Same rule as the painter. */
export function seeded(seedText: string): Rng {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SfxLayerName = "transient" | "body" | "tail";
export const SFX_LAYERS: SfxLayerName[] = ["transient", "body", "tail"];

/**
 * A material is a bank of modes: where a struck object rings, and how fast it
 * dies.
 *
 * Every mode sits above ~180 Hz on purpose: below that a phone speaker simply
 * cannot move, and the film is mixed for a phone. A stone that only rings at
 * 85 Hz is a thud nobody hears, so it rings at 190 Hz and up and reads as heavy
 * from the spectrum above it, not from sub-bass the device cannot play.
 */
export type Material = { modes: number[]; decay: number; bright: number };

export const MATERIALS = {
  paper: { modes: [210, 430, 880, 1650], decay: 26, bright: 0.5 },
  wood: { modes: [185, 350, 720, 1480], decay: 16, bright: 0.35 },
  glass: { modes: [880, 1850, 3300, 5200], decay: 30, bright: 0.8 },
  metal: { modes: [320, 860, 1480, 2700], decay: 22, bright: 0.7 },
  stone: { modes: [190, 390, 790, 1580], decay: 12, bright: 0.15 },
  cloth: { modes: [195, 360, 760, 1500], decay: 40, bright: 0.2 },
} as const;

export type MaterialName = keyof typeof MATERIALS;

/** How a kind is built, in the kit's own vocabulary. */
export type SfxShape = "impact" | "whoosh" | "hum" | "ambience" | "creak" | "sparkle" | "sweep" | "settle";

export type SfxKindSpec = {
  shape: SfxShape;
  material: MaterialName;
  /** Seconds the cue needs when the score does not say. */
  length: number;
  /** Default mix gain. */
  gain: number;
  /** Frequency band the kind is designed to sit in, [lo, hi] Hz. */
  band: [number, number];
  layers: SfxLayerName[];
  /** Reverb send for the shared return, 0–1. */
  send: number;
  /** Sidechain duck depth in dB against the voice. */
  duckDb: number;
};

export const SFX_KINDS: Record<string, SfxKindSpec> = {
  // The fixture's kinds.
  lamp: { shape: "hum", material: "paper", length: 0.6, gain: 0.5, band: [80, 6000], layers: ["transient", "body", "tail"], send: 0.12, duckDb: 2 },
  snap: { shape: "impact", material: "paper", length: 0.14, gain: 0.7, band: [500, 8000], layers: ["transient", "body", "tail"], send: 0.08, duckDb: 4 },
  whoosh: { shape: "whoosh", material: "paper", length: 0.5, gain: 0.6, band: [200, 5000], layers: ["body", "tail"], send: 0.18, duckDb: 3 },
  slam: { shape: "impact", material: "stone", length: 0.4, gain: 0.9, band: [60, 4000], layers: ["transient", "body", "tail"], send: 0.06, duckDb: 4 },
  step: { shape: "impact", material: "wood", length: 0.18, gain: 0.55, band: [70, 3000], layers: ["transient", "body"], send: 0.05, duckDb: 3 },
  swing: { shape: "whoosh", material: "metal", length: 0.6, gain: 0.5, band: [180, 6000], layers: ["body", "tail"], send: 0.14, duckDb: 2 },
  crowd: { shape: "ambience", material: "cloth", length: 1.4, gain: 0.55, band: [120, 7000], layers: ["body", "tail"], send: 0.22, duckDb: 4 },
  confetti: { shape: "sparkle", material: "paper", length: 0.8, gain: 0.6, band: [500, 9000], layers: ["transient", "tail"], send: 0.16, duckDb: 3 },
  iris: { shape: "sweep", material: "glass", length: 0.9, gain: 0.55, band: [200, 5000], layers: ["body", "tail"], send: 0.28, duckDb: 2 },
  room: { shape: "ambience", material: "stone", length: 30, gain: 0.1, band: [200, 4000], layers: ["tail"], send: 0, duckDb: 0 },
  // The kit's own material kinds.
  knock: { shape: "impact", material: "wood", length: 0.28, gain: 0.65, band: [90, 3500], layers: ["transient", "body", "tail"], send: 0.1, duckDb: 3 },
  door: { shape: "impact", material: "wood", length: 0.9, gain: 0.8, band: [60, 2500], layers: ["transient", "body", "tail"], send: 0.2, duckDb: 4 },
  glass: { shape: "sparkle", material: "glass", length: 0.7, gain: 0.6, band: [900, 9000], layers: ["transient", "body", "tail"], send: 0.24, duckDb: 3 },
  wood: { shape: "impact", material: "wood", length: 0.24, gain: 0.6, band: [80, 3000], layers: ["transient", "body", "tail"], send: 0.1, duckDb: 3 },
  stone: { shape: "impact", material: "stone", length: 0.5, gain: 0.7, band: [50, 2500], layers: ["transient", "body", "tail"], send: 0.14, duckDb: 3 },
  creak: { shape: "creak", material: "wood", length: 0.9, gain: 0.5, band: [150, 4000], layers: ["body", "tail"], send: 0.16, duckDb: 3 },
  cloth: { shape: "settle", material: "cloth", length: 0.5, gain: 0.5, band: [300, 6000], layers: ["transient", "tail"], send: 0.12, duckDb: 2 },
  paper: { shape: "settle", material: "paper", length: 0.8, gain: 0.5, band: [400, 8000], layers: ["transient", "body", "tail"], send: 0.14, duckDb: 2 },
  wind: { shape: "ambience", material: "cloth", length: 4, gain: 0.4, band: [60, 3000], layers: ["body", "tail"], send: 0.2, duckDb: 2 },
  rain: { shape: "ambience", material: "cloth", length: 4, gain: 0.4, band: [300, 9000], layers: ["body", "tail"], send: 0.18, duckDb: 2 },
  water: { shape: "ambience", material: "glass", length: 4, gain: 0.4, band: [200, 7000], layers: ["body", "tail"], send: 0.2, duckDb: 2 },
  hum: { shape: "hum", material: "metal", length: 3, gain: 0.3, band: [50, 2000], layers: ["body", "tail"], send: 0.1, duckDb: 1 },
  quiet: { shape: "ambience", material: "cloth", length: 2, gain: 0.3, band: [100, 3000], layers: ["body", "tail"], send: 0.1, duckDb: 1 },
};

/** Kinds that must never be used: a phone speaker turns them into noise, not sound. */
export const BANNED_KINDS = ["tick", "click", "hat", "glitch", "beep", "blip", "buzz"];

/** The kit's own name and version, recorded in a promoted cue's provenance. */
export const SFX_GENERATOR = "paper-studio/sfx 2.0";

/** The sample rate every generated cue is written at. */
export const SFX_SAMPLE_RATE = 48_000;

/** True when the kit knows this kind. An unknown kind is never rendered. */
export function isKnownKind(kind: string): boolean {
  return Object.hasOwn(SFX_KINDS, kind);
}

/**
 * The kind's spec. A kind that is not in the kit is a contract error, not a
 * fallback: a typo must fail loudly instead of quietly sounding like paper.
 */
export function kindSpec(kind: string): SfxKindSpec {
  const spec = SFX_KINDS[kind];
  if (!spec) throw new Error(`unknown sfx kind "${kind}"; known: ${Object.keys(SFX_KINDS).join(", ")}`);
  return spec;
}

export const kindLength = (kind: string): number => kindSpec(kind).length;
export const kindGain = (kind: string): number => kindSpec(kind).gain;
export const kindBand = (kind: string): [number, number] => kindSpec(kind).band;
export const kindLayers = (kind: string): SfxLayerName[] => kindSpec(kind).layers;

/**
 * The canonical description of what a cue renders from: kind, time, length,
 * layers, gain, pan and band after the kit's defaults are applied. The rendered
 * cue records it; the mix recomputes it. If they differ, the WAV on disk was
 * made from something else and the mix refuses it.
 */
export function cueSpec(cue: {
  kind: string;
  at: number;
  duration?: number;
  layers?: string[];
  gain?: number;
  pan?: number;
  band?: [number, number];
}): string {
  return JSON.stringify({
    kind: cue.kind,
    at: Number(cue.at.toFixed(6)),
    seconds: Number((cue.duration ?? kindLength(cue.kind)).toFixed(3)),
    layers: effectiveLayers(cue.kind, cue.layers),
    gain: cue.gain ?? kindGain(cue.kind),
    pan: cue.pan ?? 0,
    band: cue.band ?? kindBand(cue.kind),
  });
}

/** The part of a rendered-cue record that decides what the mix is listening to. */
export type SfxRecordLike = { id: string; spec: string; wav: string; ok: boolean };

/**
 * A stable text for a whole rendered cue set: ids sorted, no timestamps. Two
 * runs that produced the same WAVs from the same specs have the same text, and
 * a mix that names this fingerprint can be checked against the current set.
 */
export function cueSetText(records: SfxRecordLike[]): string {
  return JSON.stringify(
    [...records]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((record) => ({ id: record.id, spec: record.spec, wav: record.wav, ok: record.ok })),
  );
}

/* --------------------------------------------------------------- primitives */

/** A bank of decaying sinusoids at a material's modes, struck by a short burst. */
function modalBody(len: number, sr: number, material: MaterialName, rng: Rng, strike = 0.006): Float32Array {
  const { modes, decay, bright } = MATERIALS[material];
  const out = new Float32Array(len);
  const strikeLen = Math.max(2, Math.round(strike * sr));
  const detune = modes.map(() => 1 + (rng() - 0.5) * 0.012);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    let value = 0;
    for (let m = 0; m < modes.length; m++) {
      const freq = (modes[m] ?? 200) * (detune[m] ?? 1);
      value += Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * decay * (1 + m * 0.4));
    }
    const excite = i < strikeLen ? 1 - i / strikeLen : 0.35 * Math.exp(-t * decay * 0.6);
    out[i] = (value / modes.length) * (excite + (1 - bright) * 0.15);
  }
  return out;
}

/** A short noise burst with a bright edge: the first 20 ms of a hit. */
function noiseTransient(len: number, sr: number, rng: Rng, decay = 90, tone = 1): Float32Array {
  const out = new Float32Array(len);
  let lp = 0;
  const k = 0.35 * tone;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const noise = rng() * 2 - 1;
    lp += k * (noise - lp);
    out[i] = lp * Math.exp(-t * decay);
  }
  return out;
}

/** Filtered noise with a slow envelope: air, rain, crowd, a room. */
function air(len: number, sr: number, rng: Rng, options: { lp: number; env: number; colour: number }): Float32Array {
  const out = new Float32Array(len);
  const k = Math.min(0.9, options.colour);
  let low = 0;
  let slow = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const noise = rng() * 2 - 1;
    low += k * (noise - low);
    slow += 0.0008 * (rng() * 2 - 1 - slow);
    const attack = Math.min(1, t / 0.05);
    const release = Math.min(1, (len / sr - t) / Math.max(0.1, options.env));
    out[i] = low * attack * Math.max(0, release) * (0.7 + 0.3 * (1 + slow));
  }
  return out;
}

/** Stick-slip: an irregular grind with a rising and falling tension. */
function friction(len: number, sr: number, rng: Rng, options: { rate: number; decay: number }): Float32Array {
  const out = new Float32Array(len);
  let lp = 0;
  let slip = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const noise = rng() * 2 - 1;
    // A stick-slip sawtooth whose rate wanders: the creak of a hinge.
    const rate = options.rate * (1 + 0.25 * Math.sin(2 * Math.PI * 0.7 * t));
    slip = (slip + rate / sr) % 1;
    const edge = Math.pow(1 - slip, 6);
    lp += 0.12 * (noise * edge - lp);
    const tension = Math.sin(Math.PI * Math.min(1, t / (len / sr))) * Math.exp(-t * options.decay);
    out[i] = (lp * 2.2 + edge * 0.15) * tension;
  }
  return out;
}

/** A tone whose frequency falls: the closing iris, a settle. */
function sweep(len: number, sr: number, rng: Rng, material: MaterialName): Float32Array {
  const { modes } = MATERIALS[material];
  const out = new Float32Array(len);
  const top = modes[modes.length - 1] ?? 2000;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const phase = 2 * Math.PI * (top * t - (top * 0.55 * t * t) / (2 * (len / sr)));
    out[i] = Math.sin(phase) * 0.25 * Math.exp(-t * 2) + (rng() * 2 - 1) * 0.03 * Math.exp(-t * 3);
  }
  return out;
}

/** Many tiny hits of the same material: paper confetti, breaking glass. */
function sparkle(len: number, sr: number, rng: Rng, material: MaterialName): Float32Array {
  const out = new Float32Array(len);
  const hits = 10 + Math.floor(rng() * 8);
  for (let h = 0; h < hits; h++) {
    const at = Math.floor(rng() * len * 0.6);
    const body = modalBody(Math.min(len - at, Math.round(0.12 * sr)), sr, material, rng, 0.002);
    const gain = 0.5 + rng() * 0.5;
    const spread = (rng() * 2 - 1) * 0.002;
    for (let i = 0; i < body.length && at + i < len; i++) {
      const t = i / sr;
      out[at + i] = (out[at + i] ?? 0) + (body[i] ?? 0) * gain * Math.exp(-t * (1 + spread * 100));
    }
  }
  return out;
}

/** Several soft, overlapping hits: paper settling, cloth moving. */
function settle(len: number, sr: number, rng: Rng, material: MaterialName): Float32Array {
  const out = new Float32Array(len);
  const hits = 4 + Math.floor(rng() * 3);
  for (let h = 0; h < hits; h++) {
    const at = Math.floor((rng() * len) / (h + 1.4));
    const body = modalBody(Math.min(len - at, Math.round(0.2 * sr)), sr, material, rng, 0.004);
    const transfer = modalBody(Math.min(len - at, Math.round(0.2 * sr)), sr, material, rng, 0.004);
    for (let i = 0; i < body.length && at + i < len; i++) {
      const t = i / sr;
      const bright = i < sr * 0.02 ? (transfer[i] ?? 0) * 0.4 : 0;
      out[at + i] = (out[at + i] ?? 0) + ((body[i] ?? 0) + bright) * Math.exp(-t * 1.6) * 0.6;
    }
  }
  return out;
}

/** A low tone with its harmonics and a slow tremble: a lamp, a motor, mains hum. */
function humTone(len: number, sr: number, rng: Rng, material: MaterialName): Float32Array {
  const { modes } = MATERIALS[material];
  // The second mode, not the first: a hum whose fundamental sits under 200 Hz is
  // inaudible on the device this film is watched on.
  const base = (modes[1] ?? 380) * 0.9;
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const tremble = 0.6 + 0.4 * Math.sin(2 * Math.PI * 7 * t + rng() * 0.1);
    const attack = Math.min(1, t * 12);
    const release = Math.max(0, 1 - t / (len / sr)) ** 2;
    out[i] =
      (Math.sin(2 * Math.PI * base * t) * 0.7 + Math.sin(2 * Math.PI * base * 2 * t) * 0.2 + Math.sin(2 * Math.PI * base * 3 * t) * 0.1) *
      tremble *
      attack *
      release;
  }
  return out;
}

/** A band of noise that opens and closes: a whoosh, a swing, a stage build. */
function whoosh(len: number, sr: number, rng: Rng): Float32Array {
  const out = new Float32Array(len);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const u = t / (len / sr);
    const noise = rng() * 2 - 1;
    const cut = 0.05 + 0.35 * Math.sin(Math.PI * u);
    lp += cut * (noise - lp);
    out[i] = lp * Math.sin(Math.PI * u) * 1.2;
  }
  return out;
}

/* ----------------------------------------------------------------- assembly */

const add = (into: Float32Array, layer: Float32Array, gain = 1): void => {
  for (let i = 0; i < into.length && i < layer.length; i++) into[i] = (into[i] ?? 0) + (layer[i] ?? 0) * gain;
};

/** Fade the last `seconds` on a raised cosine, so a cue never ends on a click. */
export function fadeOut(samples: Float32Array, sr: number, seconds = 0.02): void {
  const count = Math.min(samples.length, Math.round(seconds * sr));
  for (let i = 0; i < count; i++) {
    const at = samples.length - count + i;
    const gain = 0.5 + 0.5 * Math.cos((Math.PI * i) / count);
    samples[at] = (samples[at] ?? 0) * gain;
  }
}

/** The layers a cue of this kind is actually built from. */
export function effectiveLayers(kind: string, layers?: string[]): SfxLayerName[] {
  const spec = kindSpec(kind);
  if (!layers || layers.length === 0) return spec.layers;
  const known = layers.filter((name): name is SfxLayerName => (SFX_LAYERS as string[]).includes(name));
  return known.length > 0 ? known : spec.layers;
}

/**
 * Render one cue: a pure function of kind, length and seed text.
 *
 * Normalised to a fixed **root mean square**, then peak-limited below 1. Peak
 * normalisation made a 30 ms snap and a 900 ms sweep both touch ±1, which is how
 * the softest cue in the film (a glass iris) ended up 13 dB louder than the
 * footstep it shares a gain with. With a fixed RMS, the cue's `gain` — the only
 * level a score sets — is the only level that matters, and two cues at the same
 * gain are within a few dB of each other however long they are.
 */
export function renderSfx(kind: string, len: number, sr: number, seedText: string, layers?: string[]): Float32Array {
  const spec = kindSpec(kind);
  const rng = seeded(`${seedText}:${kind}`);
  const out = new Float32Array(Math.max(1, len));
  const wanted = effectiveLayers(kind, layers);

  if (wanted.includes("transient")) {
    switch (spec.shape) {
      case "impact":
      case "settle":
      case "sparkle":
        add(out, noiseTransient(len, sr, rng, spec.shape === "impact" ? 90 : 140, spec.material === "paper" ? 1.4 : 1), 0.7);
        break;
      case "creak":
        add(out, noiseTransient(len, sr, rng, 60, 0.6), 0.3);
        break;
      default:
        break;
    }
  }
  if (wanted.includes("body")) {
    switch (spec.shape) {
      case "impact": add(out, modalBody(len, sr, spec.material, rng), 1); break;
      case "whoosh": add(out, whoosh(len, sr, rng), 1); break;
      case "hum": add(out, humTone(len, sr, rng, spec.material), 1); break;
      case "ambience": add(out, air(len, sr, rng, { lp: 0.03, env: 0.4, colour: spec.material === "stone" ? 0.12 : 0.09 }), 1); break;
      case "creak": add(out, friction(len, sr, rng, { rate: 26, decay: 1.4 }), 1); break;
      case "sweep": add(out, sweep(len, sr, rng, spec.material), 1); break;
      case "sparkle": add(out, sparkle(len, sr, rng, spec.material), 1); break;
      case "settle": add(out, settle(len, sr, rng, spec.material), 1); break;
    }
  }
  if (wanted.includes("tail")) {
    switch (spec.shape) {
      case "impact":
      case "settle":
      case "sparkle":
        add(out, modalBody(len, sr, spec.material, rng, 0.01), spec.shape === "impact" ? 0.35 : 0.25);
        add(out, air(len, sr, rng, { lp: 0.05, env: 0.5, colour: 0.05 }), 0.12);
        break;
      case "whoosh":
      case "sweep":
        add(out, air(len, sr, rng, { lp: 0.04, env: 0.6, colour: 0.04 }), 0.2);
        break;
      case "ambience":
      case "hum":
        add(out, air(len, sr, rng, { lp: 0.02, env: 0.8, colour: 0.08 }), 0.4);
        break;
      case "creak":
        add(out, air(len, sr, rng, { lp: 0.05, env: 0.4, colour: 0.05 }), 0.15);
        break;
    }
  }

  // One loudness rule for every cue, then a peak limit that keeps the loudest
  // transient sample under 1 without the low end of the mix clipping.
  const level = rms(out);
  let scale = level > 0 ? CUE_RMS / level : 1;
  let peak = 0;
  for (const value of out) peak = Math.max(peak, Math.abs(value * scale));
  if (peak > 0.98) scale *= 0.98 / peak;
  for (let i = 0; i < out.length; i++) out[i] = (out[i] ?? 0) * scale;
  fadeOut(out, sr);
  return out;
}

/**
 * The RMS every rendered cue is normalised to before the score's gain. Chosen
 * so a cue at gain 1 sits under the narration without the mix having to rescue
 * it.
 */
export const CUE_RMS = 0.12;

/* ------------------------------------------------------------------- review */

/** RMS after a gentle highpass at `lo` and lowpass at `hi`. Boring on purpose. */
export function bandRms(samples: Float32Array, sr: number, lo: number, hi: number): number {
  const kLow = 1 - Math.exp((-2 * Math.PI * lo) / sr);
  const kHigh = 1 - Math.exp((-2 * Math.PI * hi) / sr);
  let lowState = 0;
  let highState = 0;
  let sum = 0;
  for (const value of samples) {
    lowState += kLow * (value - lowState);
    const above = value - lowState;
    highState += kHigh * (above - highState);
    sum += highState * highState;
  }
  return Math.sqrt(sum / Math.max(1, samples.length));
}

export function rms(samples: Float32Array): number {
  let sum = 0;
  for (const value of samples) sum += value * value;
  return Math.sqrt(sum / Math.max(1, samples.length));
}

/** The fraction of a cue's energy inside its declared band, 0–1. */
export function bandFraction(samples: Float32Array, sr: number, band: [number, number]): number {
  const whole = rms(samples);
  if (whole === 0) return 1;
  return Number(Math.min(1, bandRms(samples, sr, band[0], band[1]) / whole).toFixed(3));
}

/** True when the cue ends cleanly (its last millisecond is near silent). */
export function fadesClean(samples: Float32Array, sr: number, window = 0.001): boolean {
  const count = Math.min(samples.length, Math.round(window * sr));
  if (count === 0) return true;
  let peak = 0;
  for (let i = samples.length - count; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i] ?? 0));
  return peak <= 0.05;
}

/** True when a cue's kind is one the phone-speaker rule bans. */
export function isBannedKind(kind: string): boolean {
  return BANNED_KINDS.includes(kind.toLowerCase());
}

/**
 * Where a phone speaker actually lives. Below this a cue can carry the whole
 * film on a pair of headphones and nothing on the device it is watched on, so a
 * rendered cue must keep most of its energy above it.
 */
export const PHONE_FLOOR: [number, number] = [200, 9000];

/**
 * The share of a cue's energy a phone speaker can move.
 *
 * A single one-pole highpass is too gentle to answer this: at 200 Hz it still
 * passes most of an 80 Hz tone, which would let a sub-bass thud through the one
 * check written to stop it. Four stages in series is a real 24 dB/octave slope.
 */
export function phoneAudible(samples: Float32Array, sr: number): number {
  const kLow = 1 - Math.exp((-2 * Math.PI * PHONE_FLOOR[0]) / sr);
  const kHigh = 1 - Math.exp((-2 * Math.PI * PHONE_FLOOR[1]) / sr);
  let sum = 0;
  let total = 0;
  let x1 = 0, x2 = 0, x3 = 0, x4 = 0;
  let high = 0;
  for (const value of samples) {
    x1 += kLow * (value - x1);
    const a1 = value - x1;
    x2 += kLow * (a1 - x2);
    const a2 = a1 - x2;
    x3 += kLow * (a2 - x3);
    const a3 = a2 - x3;
    x4 += kLow * (a3 - x4);
    const a4 = a3 - x4;
    high += kHigh * (a4 - high);
    sum += high * high;
    total += value * value;
  }
  if (total === 0) return 1;
  return Number(Math.min(1, Math.sqrt(sum / total)).toFixed(3));
}

export type CueCheck = { id: string; kind: string; ok: boolean; detail: string };

/** The part of a cue the mechanical checks read. */
export type CueLike = {
  id: string;
  kind: string;
  at: number;
  layers?: string[];
  band?: [number, number];
};

/**
 * The mechanical checks a generated cue must pass. They are the part of G6 that
 * does not need an ear: the cue is on a frame, its energy is where the kind says,
 * most of it above the phone floor, it fades out clean, it is long enough to be a
 * sound rather than a click, and its kind is neither banned nor unknown.
 */
export function checkCue(
  cue: CueLike,
  samples: Float32Array,
  sr: number,
  aligned: (time: number) => boolean,
): CueCheck {
  const seconds = samples.length / sr;
  const reasons: string[] = [];
  if (!aligned(cue.at)) reasons.push(`at ${cue.at}s is not on a frame`);
  if (isBannedKind(cue.kind)) reasons.push(`"${cue.kind}" is banned on phone speakers`);
  if (!isKnownKind(cue.kind)) {
    reasons.push(`"${cue.kind}" is not a kind in the kit`);
    return { id: cue.id, kind: cue.kind, ok: false, detail: reasons.join("; ") };
  }

  const spec = kindSpec(cue.kind);
  const layers = effectiveLayers(cue.kind, cue.layers);
  const band = cue.band ?? spec.band;
  const fraction = bandFraction(samples, sr, band);
  const audible = phoneAudible(samples, sr);
  const level = 20 * Math.log10(rms(samples) + 1e-9);
  if (band[1] > 9000) reasons.push(`band top ${band[1]} Hz is above the 9 kHz phone limit`);
  if (seconds < 0.05) reasons.push(`only ${seconds.toFixed(3)}s long`);
  if (!fadesClean(samples, sr)) reasons.push("does not fade out clean");
  if (layers.length === 0) reasons.push("no layers");
  if (fraction < 0.5) reasons.push(`only ${(fraction * 100).toFixed(0)}% of its energy is in ${band.join("–")} Hz`);
  if (audible < 0.6) {
    reasons.push(
      `only ${(audible * 100).toFixed(0)}% of its energy is at or above ${PHONE_FLOOR[0]} Hz, where a phone speaker lives`,
    );
  }
  return {
    id: cue.id,
    kind: cue.kind,
    ok: reasons.length === 0,
    detail:
      reasons.length === 0
        ? `${Math.round(seconds * 1000)}ms · ${layers.join("+")} · ${(fraction * 100).toFixed(0)}% in band · ${audible >= 0.99 ? 100 : (audible * 100).toFixed(0)}% audible · ${level.toFixed(0)} dBFS`
        : reasons.join("; "),
  };
}

/**
 * The cue **set** check: one kind may not machine-gun.
 *
 * Two cues of the same kind that overlap, or that start within 300 ms of each
 * other ending, read as a stutter on the third repeat — the G6 row that asked
 * for it had no command behind it. This is that command's rule.
 */
export type CueSetIssue = { code: string; message: string };

export function checkCueSet(
  cues: Array<{ id: string; kind: string; at: number; duration?: number }>,
): CueSetIssue[] {
  const issues: CueSetIssue[] = [];
  const spans = cues
    .map((cue) => ({
      id: cue.id,
      kind: cue.kind,
      start: cue.at,
      end: cue.at + (cue.duration ?? kindLength(cue.kind)),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i = 1; i < spans.length; i += 1) {
    const previous = spans[i - 1];
    const current = spans[i];
    if (!previous || !current || previous.kind !== current.kind) continue;
    const gap = current.start - previous.end;
    if (gap < 0.3) {
      issues.push({
        code: "sfx_repeat",
        message: `"${current.id}" repeats "${previous.id}" (${current.kind}) ${gap <= 0 ? "overlapping" : `${gap.toFixed(2)}s later`} at ${current.start.toFixed(2)}s`,
      });
    }
  }
  return issues;
}
