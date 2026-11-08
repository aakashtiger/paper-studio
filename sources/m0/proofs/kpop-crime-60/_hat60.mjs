import fs from 'node:fs';
let n = 0;
function patch(file, pairs) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log('MISS', file, a.slice(0, 60)); continue; }
    s = s.split(a).join(b); n++;
  }
  fs.writeFileSync(file, s);
}

// the man's hat is the gray one the film follows from the station to the
// checkpoint; the detective keeps his dark fedora
patch('proofs/kpop-crime-60/shots/s02.js', [
  ['costume: "coat", stubble: true, hat: "fedora",', 'costume: "coat", stubble: true, hat: "fedora", hatColor: "#5F5B54",'],
]);
patch('proofs/kpop-crime-60/shots/s04.js', [
  ['costume: "coat", stubble: true, hat: "fedora",', 'costume: "coat", stubble: true, hat: "fedora", hatColor: "#5F5B54",'],
]);
patch('proofs/kpop-crime-60/shots/s05.js', [
  ['costume: "coat", stubble: true, hat: "fedora",', 'costume: "coat", stubble: true, hat: "fedora", hatColor: "#5F5B54",'],
]);
patch('proofs/kpop-crime-60/shots/s06.js', [
  ['costume: "coat", stubble: true, hat: "fedora",', 'costume: "coat", stubble: true, hat: "fedora", hatColor: "#5F5B54",'],
]);
patch('proofs/kpop-crime-60/shots/s07.js', [
  ['costume: "coat", stubble: true, hat: hatOn ? "fedora" : undefined,', 'costume: "coat", stubble: true, hat: hatOn ? "fedora" : undefined, hatColor: "#5F5B54",'],
  ['      ctx.fillStyle = "#22201E"; ctx.beginPath(); ctx.ellipse(1175, 540, 58, 11, 0, 0, TAU); ctx.fill();\n      paper(ctx, () => roundRectPath(ctx, 1141, 494, 68, 44, 10), { fill: "#2B2926", edge: C.rgba(INK, 0.7), edgeW: 2 });',
   '      ctx.fillStyle = "#5F5B54"; ctx.beginPath(); ctx.ellipse(1175, 540, 58, 11, 0, 0, TAU); ctx.fill();\n      paper(ctx, () => roundRectPath(ctx, 1141, 494, 68, 44, 10), { fill: "#6A665E", edge: C.rgba(INK, 0.7), edgeW: 2 });'],
  ['      ctx.fillStyle = "#22201E"; ctx.beginPath(); ctx.ellipse(0, 0, 48, 9, 0, 0, TAU); ctx.fill();\n      paper(ctx, () => roundRectPath(ctx, -28, -40, 56, 38, 8), { fill: "#2B2926", edge: C.rgba(INK, 0.7), edgeW: 2 });',
   '      ctx.fillStyle = "#5F5B54"; ctx.beginPath(); ctx.ellipse(0, 0, 48, 9, 0, 0, TAU); ctx.fill();\n      paper(ctx, () => roundRectPath(ctx, -28, -40, 56, 38, 8), { fill: "#6A665E", edge: C.rgba(INK, 0.7), edgeW: 2 });'],
]);
console.log('applied', n);
