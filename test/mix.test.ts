import assert from "node:assert/strict";
import { test } from "node:test";
import { freeverb, highpassCoeffs, applyBiquad, mixFilm } from "../src/engine/mix.js";

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

test("the freeverb return and the highpass coefficients are stable shapes", () => {
  const return_ = freeverb(sine(300, 0.2, 0.5), SR, { room: 0.8, damp: 0.2, wet: 0.3 });
  assert.equal(return_.left.length, 0.2 * SR);
  const filtered = applyBiquad(sine(40, 0.2), highpassCoeffs(75, SR));
  assert.ok(rms(filtered) < 0.15, "a 40 Hz tone should be cut hard by a 75 Hz highpass");
});
