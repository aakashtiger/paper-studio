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

const pose = (keys) => `pose: poseAt(lt, [${keys}]),`;
const face = (keys) => `face: faceAt(lt, [${keys}]),`;

patch('proofs/kpop-crime/shots/s01.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.hand], [2.4, MAN_POSES.turn]')],
  ['face: { eyes: "narrow", mouth: "flat", look: [1, 0] },', face('{t:0,f:{eyes:"narrow",mouth:"flat",look:[1,0]}},{t:1.4,f:{eyes:"wide",mouth:"o",look:[1,0]}},{t:2.6,f:{eyes:"closed",mouth:"flat",look:[0,0]}}')],
]);
patch('proofs/kpop-crime/shots/s02.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [0.8, MAN_POSES.point], [2.0, MAN_POSES.turn]')],
  ['face: { eyes: "wide", mouth: "o", look: [-1, 0] },', face('{t:0,f:{eyes:"wide",mouth:"o",look:[-1,0]}},{t:1.2,f:{eyes:"narrow",mouth:"flat",look:[-1,0]}},{t:2.4,f:{eyes:"wide",mouth:"o",look:[-1,0]}}')],
]);
patch('proofs/kpop-crime/shots/s03.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.hand], [2.4, MAN_POSES.turn]')],
  ['face: { eyes: "narrow", mouth: "flat", look: [1, 0] },', face('{t:0,f:{eyes:"narrow",mouth:"flat",look:[1,0]}},{t:1.2,f:{eyes:"closed",mouth:"flat",look:[0,0]}},{t:2.4,f:{eyes:"narrow",mouth:"flat",look:[1,0]}}')],
]);
patch('proofs/kpop-crime/shots/s04.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.turn], [2.4, MAN_POSES.hand]')],
  ['face: { eyes: "narrow", mouth: "flat", look: [1, 0] },', face('{t:0,f:{eyes:"narrow",mouth:"flat",look:[1,0]}},{t:1.2,f:{eyes:"wide",mouth:"o",look:[1,0]}},{t:2.4,f:{eyes:"closed",mouth:"flat",look:[0,0]}}')],
]);
patch('proofs/kpop-crime/shots/s05.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.hand], [2.4, MAN_POSES.stand]')],
  ['face: { eyes: "closed", mouth: "flat", look: [0, 0] },', face('{t:0,f:{eyes:"closed",mouth:"flat",look:[0,0]}},{t:1.2,f:{eyes:"narrow",mouth:"flat",look:[0,0]}},{t:2.4,f:{eyes:"closed",mouth:"flat",look:[0,0]}}')],
]);
patch('proofs/kpop-crime/shots/s06.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.turn], [2.4, MAN_POSES.stand]')],
  ['face: { eyes: "narrow", mouth: "flat", look: [1, 0] },', face('{t:0,f:{eyes:"narrow",mouth:"flat",look:[1,0]}},{t:1.2,f:{eyes:"wide",mouth:"o",look:[1,0]}},{t:2.4,f:{eyes:"closed",mouth:"flat",look:[0,0]}}')],
]);
patch('proofs/kpop-crime/shots/s07.js', [
  ['pose: mp,', pose('[0, MAN_POSES.stand], [1.2, MAN_POSES.hand], [2.4, MAN_POSES.stand]')],
  ['face: { eyes: "closed", mouth: "flat", look: [0, 0] },', face('{t:0,f:{eyes:"closed",mouth:"flat",look:[0,0]}},{t:1.2,f:{eyes:"narrow",mouth:"flat",look:[0,0]}},{t:2.4,f:{eyes:"closed",mouth:"flat",look:[0,0]}}')],
]);

console.log('applied', n);
