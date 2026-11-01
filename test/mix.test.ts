import assert from "node:assert/strict";
import { test } from "node:test";
import { bandEdges, duckKey, freeverb, highpassCoeffs, applyBiquad, mixFilm, PREMASTER_CEILING } from "../src/engine/mix.js";

const SR = 48_000;

function sine(freq: number, seconds: number, amplitude = 0.5): Float32Array {
  const out = new Float32Array(Math.round(seconds * SR));
  for (let i = 0; i < out.length; i++) out[i] = amplitude * Math.sin((2 * Math.PI * freq * i) / SR);
  return out;
}

function rms(signal: Float32Array): number {
  let sum = 0;
  for (const value of signal) sum += value * value;
  return Math.sqrt(sum / Math.max(1, signal.length));
}

function difference(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = (a[i] ?? 0) - (b[i] ?? 0);
  return out;
}

test("the mix never writes a premaster above full scale", () => {
  // A bus that peaks over 0 dBFS is a badly staged mix whatever the float
  // arithmetic allows: the master's gain would then be a repair, and the file
  // would not survive being written as 16-bit. Three cues stacked on the same
  // frame is what actually pushes it there.
  const hot = { id: "hot", kind: "slam", at: 0, samples: sine(300, 1, 1.4), send: 0, duckDb: 0 };
  const mix = mixFilm({ sampleRate: SR, duration: 1, voice: null, cues: [hot, { ...hot, id: "hot2" }, { ...hot, id: "hot3" }] });
  const peak = Math.max(...Array.from(mix.left, Math.abs), ...Array.from(mix.right, Math.abs));
  assert.ok(peak <= PREMASTER_CEILING + 1e-6, `the premaster peaks at ${peak}, over ${PREMASTER_CEILING}`);
  assert.ok(mix.busGainDb < 0, "the headroom stage should report the gain it took");
});

test("a mix inside the ceiling is not touched by the headroom stage", () => {
  const quiet = { id: "q", kind: "lamp", at: 0, samples: sine(300, 1, 0.2), send: 0, duckDb: 0 };
  const mix = mixFilm({ sampleRate: SR, duration: 1, voice: sine(220, 1, 0.2), cues: [quiet] });
  assert.equal(mix.busGainDb, 0);
});

test("the mix is deterministic", () => {
  const voice = sine(220, 1);
  const cue = { id: "c", kind: "slam", at: 0.1, samples: sine(900, 0.3), send: 0.2, duckDb: 4, band: [80, 3000] as [number, number] };
  const input = { sampleRate: SR, duration: 1, voice, cues: [cue] };
  const a = mixFilm(input);
  const b = mixFilm(input);
  assert.deepEqual(Array.from(a.left), Array.from(b.left));
  assert.deepEqual(Array.from(a.right), Array.from(b.right));
});

test("the voice is highpassed above 75 Hz", () => {
  const low = mixFilm({ sampleRate: SR, duration: 1, voice: sine(40, 1), cues: [] });
  const mid = mixFilm({ sampleRate: SR, duration: 1, voice: sine(1000, 1), cues: [] });
  assert.ok(rms(mid.left) > rms(low.left) * 3, "40 Hz should be well below 1 kHz after the highpass");
});

test("the voice ducks a cue in the 1-4 kHz band", () => {
  const cue = { id: "c", kind: "snap", at: 0, samples: sine(2000, 0.8), send: 0, duckDb: 8, band: [1000, 4000] as [number, number] };
  const voice = sine(2000, 0.8, 0.6);
  const cueAlone = mixFilm({ sampleRate: SR, duration: 0.8, voice: null, cues: [cue] });
  const both = mixFilm({ sampleRate: SR, duration: 0.8, voice, cues: [cue] });
  const voiceOnly = mixFilm({ sampleRate: SR, duration: 0.8, voice, cues: [] });
  const cueUnderVoice = difference(both.left, voiceOnly.left);
  assert.ok(
    rms(cueUnderVoice) < rms(cueAlone.left) * 0.8,
    "the cue should lose level under the voice",
  );
});

test("a cue with a send leaves a reverb tail after it ends", () => {
  const cue = { id: "c", kind: "slam", at: 0, samples: sine(400, 0.05, 0.9), send: 0.5, duckDb: 0 };
  const mix = mixFilm({ sampleRate: SR, duration: 0.6, voice: null, cues: [cue] });
  const tail = mix.left.subarray(Math.round(0.12 * SR), Math.round(0.4 * SR));
  assert.ok(rms(tail) > 1e-4, "the shared reverb return should still be ringing");
});

test("a declared duck is the duck the cue gets, wherever the word sits", () => {
  // The bug this catches: the sidechain used to be normalised by the film's one
  // loudest sample, so a hit that shared a frame with a quiet word got a
  // fraction of its 8 dB. A voice that is loud at the top and ordinary at the
  // hit is exactly that case.
  const voice = new Float32Array(SR);
  const loud = sine(2000, 0.1, 0.9);
  for (let i = 0; i < loud.length; i++) voice[i] = loud[i] ?? 0;
  const speech = sine(2000, 0.9, 0.25);
  for (let i = 0; i < speech.length; i++) voice[Math.round(0.1 * SR) + i] = speech[i] ?? 0;
  const cue = {
    id: "c",
    kind: "snap",
    at: 0.3,
    samples: sine(2000, 0.5, 0.4),
    send: 0,
    duckDb: 8,
    band: [1000, 4000] as [number, number],
  };
  const mix = mixFilm({ sampleRate: SR, duration: 1, voice, cues: [cue] });
  const report = mix.cues[0];
  assert.ok(report, "the mix should report its cues");
  assert.equal(report.declaredDb, 8);
  assert.ok(report.appliedDb >= 7, `a declared 8 dB duck applied ${report.appliedDb} dB`);
});

test("a cue's band placement leaves its level where the score put it", () => {
  // A resonant bandpass used to cost 1-3.4 dB at the loudest moment, so `gain`
  // stopped being the level the cue reached. The bus now re-levels after the
  // band, and reports what it got.
  const cue = {
    id: "c",
    kind: "snap",
    at: 0,
    samples: sine(2000, 0.4, 0.3),
    send: 0,
    duckDb: 0,
    band: [200, 9000] as [number, number],
    levelDb: -20,
  };
  const mix = mixFilm({ sampleRate: SR, duration: 0.4, voice: null, cues: [cue] });
  const report = mix.cues[0];
  assert.ok(report);
  assert.ok(Math.abs(report.busPeakDb - -20) < 0.6, `the cue reached ${report.busPeakDb} dBFS, not -20`);
});

test("the duck key is a presence gate, and a silence is not a word", () => {
  // Without a floor, a silent stretch is "-12 dB under its own silence" and the
  // key reads as a full duck in every gap after narration stops — the opposite
  // of what a duck is for.
  const voice = new Float32Array(SR);
  const speech = sine(2000, 0.5, 0.4);
  for (let i = 0; i < speech.length; i++) voice[i] = speech[i] ?? 0;
  const key = duckKey(voice, SR);
  const during = key[Math.round(0.25 * SR)] ?? 0;
  const after = key[Math.round(0.8 * SR)] ?? 0;
  assert.ok(during > 0.8, `the key should be open under a word, got ${during}`);
  assert.ok(after < 0.2, `the key should be closed in the gap, got ${after}`);
});

test("band edges pass a signal inside the band unchanged", () => {
  const tone = sine(2000, 0.2, 0.4);
  const edges = bandEdges(tone, [200, 9000], SR);
  assert.ok(rms(edges) > rms(tone) * 0.95, "a 2 kHz tone is inside [200, 9000] and should pass");
});

test("the tail fades out to silence and never swells back", () => {
  // A sustained cue filling the whole film: with the fade inside the last
  // 0.5 s, block level must fall to zero and never rise again. A sign error
  // here muted the start of the window and swelled the last breath — a 42 dB
  // hole at 29.5 s in the first film that used it.
  const cue = { id: "bed", kind: "room", at: 0, samples: sine(500, 2, 0.4), send: 0, duckDb: 0 };
  const mix = mixFilm({ sampleRate: SR, duration: 2, voice: null, cues: [cue], tailFade: 0.5 });
  const block = Math.round(0.05 * SR);
  const lastSample = mix.left[mix.left.length - 1] ?? 1;
  assert.ok(Math.abs(lastSample) < 1e-6, `the last sample must be silent, got ${lastSample}`);
  const mid = rms(mix.left.subarray(Math.round(0.75 * SR), Math.round(0.8 * SR)));
  const windowStart = mix.left.length - Math.round(0.5 * SR);
  let previous = Number.POSITIVE_INFINITY;
  for (let start = windowStart; start + block <= mix.left.length; start += block) {
    const level = rms(mix.left.subarray(start, start + block));
    assert.ok(level <= previous + 1e-6, `the fade must not rise again at ${((start / SR)).toFixed(2)}s`);
    previous = level;
  }
  assert.ok(previous < mid * 0.02, "the fade reaches near silence");
});

test("the freeverb return and the highpass coefficients are stable shapes", () => {
  const return_ = freeverb(sine(300, 0.2, 0.5), SR, { room: 0.8, damp: 0.2, wet: 0.3 });
  assert.equal(return_.left.length, 0.2 * SR);
  const filtered = applyBiquad(sine(40, 0.2), highpassCoeffs(75, SR));
  assert.ok(rms(filtered) < 0.15, "a 40 Hz tone should be cut hard by a 75 Hz highpass");
});
