import fs from 'node:fs';
let n = 0;
function patch(file, pairs) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISS', file, a.slice(0, 70)); continue; }
    s = s.split(a).join(b); n++;
  }
  fs.writeFileSync(file, s);
}

patch('proofs/kpop-crime-60/shots/s01.js', [
  ['footL: [-74, -39], footR: [40, -39]', 'footL: [-74, -39], footR: [40, -8]'],
]);
patch('proofs/kpop-crime-60/shots/s04.js', [
  ['footL: [-32, -39], footR: [32, -39]', 'footL: [-32, -8], footR: [32, -8]'],
]);
patch('proofs/kpop-crime-60/test-scenes.js', [
  ['  vignette(ctx, 0.34);\n  return cv.toDataURL(type, q);', '  vignette(ctx, 0.34);\n  if (s.fade && t >= s.fade.start) {\n    const k = C.clamp((t - s.fade.start) / s.fade.dur);\n    ctx.fillStyle = "rgba(8,8,10," + k + ")";\n    ctx.fillRect(0, 0, W, H);\n  }\n  return cv.toDataURL(type, q);'],
]);
patch('proofs/kpop-crime-60/shots/s21.js', [
  ['id: "s21", start: 58.34, end: 60.0, line: 20, cast: "MAN",', 'id: "s21", start: 58.34, end: 60.0, line: 20, cast: "MAN", fade: { start: 59.6, dur: 0.4 },'],
]);
console.log('applied', n);
