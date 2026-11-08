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

patch('proofs/kpop-crime-60/shots/s12.js', [
  ['footL: [-30 + 58 * stride, -39 - 26 * liftL],', 'footL: [-30 + 58 * stride, -8 - 26 * liftL],'],
  ['footR: [30 - 58 * stride, -39 - 26 * liftR],', 'footR: [30 - 58 * stride, -8 - 26 * liftR],'],
]);
patch('proofs/kpop-crime-60/shots/s13.js', [
  ['footL: [-34 - 12 * stepK, -39], footR: [34 - 12 * stepK, -39],', 'footL: [-34 - 12 * stepK, -8], footR: [34 - 12 * stepK, -8],'],
  ['footL: [-30 + 54 * stride, -39 - 24 * liftL],', 'footL: [-30 + 54 * stride, -8 - 24 * liftL],'],
  ['footR: [30 - 54 * stride, -39 - 24 * liftR],', 'footR: [30 - 54 * stride, -8 - 24 * liftR],'],
]);
patch('proofs/kpop-crime-60/shots/s14.js', [
  ['footL: [-30 + 44 * dStride * (1 - C.clamp((lt - farT) / 0.2)), -39],', 'footL: [-30 + 44 * dStride * (1 - C.clamp((lt - farT) / 0.2)), -8],'],
  ['footR: [30 - 44 * dStride * (1 - C.clamp((lt - farT) / 0.2)), -39],', 'footR: [30 - 44 * dStride * (1 - C.clamp((lt - farT) / 0.2)), -8],'],
  ['footL: [C.lerp(-30 + 54 * stride, -40, stop), C.lerp(-39 - 24 * liftL, -39, stop)],', 'footL: [C.lerp(-30 + 54 * stride, -40, stop), C.lerp(-8 - 24 * liftL, -8, stop)],'],
  ['footR: [C.lerp(30 - 54 * stride, 40, stop), C.lerp(-39 - 24 * liftR, -39, stop)],', 'footR: [C.lerp(30 - 54 * stride, 40, stop), C.lerp(-8 - 24 * liftR, -8, stop)],'],
]);
console.log('applied', n);
