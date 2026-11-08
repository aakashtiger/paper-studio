import fs from 'node:fs';
const shots = JSON.parse(fs.readFileSync('proofs/kpop-crime-60/shots.json', 'utf8'));
let n = 0;
for (const sh of shots) {
  const p = `proofs/kpop-crime-60/shots/${sh.id}.js`;
  let s = fs.readFileSync(p, 'utf8');
  const re = new RegExp(`id: "${sh.id}", start: [0-9.]+, end: [0-9.]+`);
  if (!re.test(s)) { console.log('MISS', sh.id); continue; }
  s = s.replace(re, `id: "${sh.id}", start: ${sh.start}, end: ${sh.end}`);
  fs.writeFileSync(p, s);
  n++;
}
console.log('bounds updated', n);
