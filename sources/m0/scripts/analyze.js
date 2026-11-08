const fs = require('fs');
const buf = fs.readFileSync('assets/song.wav');
// parse WAV
let p = 12, fmt, data;
while (p < buf.length) {
  const id = buf.toString('ascii', p, p + 4), size = buf.readUInt32LE(p + 4);
  if (id === 'fmt ') fmt = { channels: buf.readUInt16LE(p + 10), rate: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22) };
  if (id === 'data') { data = buf.subarray(p + 8, p + 8 + size); break; }
  p += 8 + size + (size & 1);
}
const ch = fmt.channels, sr = fmt.rate, n = data.length / 2 / ch;
const mono = new Float32Array(n);
for (let i = 0; i < n; i++) { let s = 0; for (let c = 0; c < ch; c++) s += data.readInt16LE((i * ch + c) * 2) / 32768; mono[i] = s / ch; }
console.log('sr', sr, 'dur', n / sr, 'ch', ch, 'bits', fmt.bits);

// energy envelope at 100 fps (10ms)
const fps = 100, step = Math.round(sr / fps), frames = Math.floor(n / step);
const rms = new Float32Array(frames);
for (let f = 0; f < frames; f++) { let s = 0; for (let i = 0; i < step; i++) { const v = mono[f * step + i]; s += v * v; } rms[f] = Math.sqrt(s / step); }
// onset = positive log-energy difference with short-term adaptive threshold
const onset = new Float32Array(frames);
for (let f = 2; f < frames; f++) onset[f] = Math.max(0, Math.log(rms[f] + 1e-5) - Math.log(rms[f - 2] + 1e-5));
// smooth
const sm = new Float32Array(frames);
for (let f = 0; f < frames; f++) { let s = 0, c = 0; for (let k = -3; k <= 3; k++) { const j = f + k; if (j >= 0 && j < frames) { s += onset[j]; c++; } } sm[f] = s / c; }
// autocorrelation for BPM 60..180
const results = [];
for (let bpm = 60; bpm <= 180; bpm += 0.05) {
  const lag = Math.round(60 / bpm * fps); if (lag < 25 || lag > 200) continue;
  let corr = 0, norm = 0;
  for (let f = lag; f < frames; f++) { corr += sm[f] * sm[f - lag]; norm += sm[f] * sm[f]; }
  results.push([bpm, corr / (norm || 1)]);
}
results.sort((a, b) => b[1] - a[1]);
console.log('top bpm:', results.slice(0, 12).map(r => r[0].toFixed(2) + ':' + r[1].toFixed(3)).join(' '));

// per-second RMS and spectral centroid-ish (zero crossing)
console.log('--- sec rms (dB) ---');
let line = '';
for (let s = 0; s < Math.ceil(n / sr); s++) {
  let sum = 0, c = 0, zc = 0;
  for (let i = s * sr; i < Math.min(n, (s + 1) * sr); i++) { sum += mono[i] * mono[i]; c++; if (i > s * sr && (mono[i - 1] <= 0) !== (mono[i] <= 0)) zc++; }
  const db = 20 * Math.log10(Math.sqrt(sum / c) + 1e-9);
  line += `${s}:${db.toFixed(0)}/${(zc / sr * 1000).toFixed(1)} `;
  if (s % 10 === 9) { console.log(line); line = ''; }
}
console.log(line);

// find peaks of smoothed onset for beat phase
const peaks = [];
for (let f = 10; f < frames - 10; f++) if (sm[f] > sm[f - 1] && sm[f] >= sm[f + 1] && sm[f] > 0.12) peaks.push(f);
console.log('peaks first 40:', peaks.slice(0, 40).map(f => (f / fps).toFixed(2)).join(' '));
// histogram of peak phases for 88 BPM
for (const bpm of [88, 88.5, 87.5, 89]) {
  const per = 60 / bpm; const hist = new Array(20).fill(0);
  for (const f of peaks) { const ph = ((f / fps) % per) / per; hist[Math.floor(ph * 20)]++; }
  console.log('phase hist', bpm, hist.join(','));
}
