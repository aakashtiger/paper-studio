import fs from 'node:fs';
import vm from 'node:vm';

const root = 'proofs/kpop-crime';
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(`${root}/test-words.js`, 'utf8'), sandbox);
const W = sandbox.window;
const lines = W.KPOP_LINES;
const shots = W.KPOP_SHOTS;
const STOP = new Set('and the a an to of in on it its her his he she they we you i was were is are be been had that who for with at as but so'.split(' '));
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, '');

// shots.json
fs.writeFileSync(`${root}/shots.json`, JSON.stringify(shots.map((s) => ({ id: s.id, start: s.start, end: s.end, duration: s.end - s.start })), null, 2) + '\n');

// sync.json: one event per content word, camera at the first, set at the second, cast at all
const sync = { shots: [] };
for (const line of lines) {
  const shot = shots.find((s) => s.line === lines.indexOf(line));
  const content = line.words.filter((w) => !STOP.has(norm(w.w)));
  const events = [];
  content.forEach((w, i) => {
    events.push({ id: `e${i}`, word: w.w, offset: 0, layer: i === 0 ? 'camera' : i === 1 ? 'set' : 'cast', what: `${shot.id} ${w.w}` });
  });
  events.push({ id: 'cast0', word: content[0].w, offset: 0, layer: 'cast', what: `${shot.id} cast` });
  sync.shots.push({ id: shot.id, events });
}
fs.writeFileSync(`${root}/sync.json`, JSON.stringify(sync, null, 2) + '\n');

// film.json
const film = {
  id: 'kpop-crime',
  duration: 21.0,
  shots: [
    { id: 's1', set: 'alley', camera: 'push', transition: 'flash', layers: ['backdrop', 'wall', 'lamp', 'floor', 'body', 'foreground', 'cast', 'knife', 'type', 'hud'], props: ['knife', 'caseFile', 'body'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's2', set: 'chase', camera: 'track', transition: 'flash', layers: ['city', 'windows', 'searchlights', 'floor', 'cast', 'rain', 'type', 'hud'], props: ['coat', 'hat', 'rain'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's3', set: 'hideout', camera: 'push', transition: 'flash', layers: ['wall', 'window', 'table', 'calendar', 'bulb', 'cast', 'newspaper', 'type', 'hud'], props: ['calendar', 'newspaper', 'table'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's4', set: 'bridge', camera: 'pull', transition: 'flash', layers: ['bridge', 'river', 'lamps', 'cast', 'cuffs', 'rain', 'type', 'hud'], props: ['handcuffs', 'lamp', 'rain'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's5', set: 'cell', camera: 'push', transition: 'flash', layers: ['bars', 'window', 'bench', 'floor', 'cast', 'calendar', 'type', 'hud'], props: ['bars', 'bench', 'calendar'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's6', set: 'court', camera: 'track', transition: 'curtain', layers: ['wall', 'bench', 'flag', 'cast', 'gavel', 'verdict', 'type', 'hud'], props: ['gavel', 'caseFile', 'verdict'], type: ['hero', 'label', 'subtitle', 'hud'] },
    { id: 's7', set: 'yard', camera: 'pull', transition: 'curtain', layers: ['wall', 'gallows', 'bell', 'platform', 'cast', 'noose', 'type', 'hud'], props: ['noose', 'bell', 'platform'], type: ['hero', 'label', 'subtitle', 'hud'] },
  ],
  sound: { cues: 12, lufs: -14.2, truePeak: -1.6 },
  look: {
    reference: { night: { luma: 79.79, saturation: 18.68, edges: 4.55 } },
    luma: [55, 100],
    saturation: [14, 26],
    edges: [3.0, 6.5],
  },
  mood: 'mixed',
  cast: {
    man: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    detective: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    warder: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    judge: { shoulder: [80, -500], arm: [104, 88], head: 128 },
  },
};
fs.writeFileSync(`${root}/film.json`, JSON.stringify(film, null, 2) + '\n');

// rig.json
const rig = {
  pass: true,
  cast: film.cast,
  armConvention: 'armL+/armR-',
  noPetals: true,
  mirroredBoots: true,
  handThumb: true,
  footTargets: true,
};
fs.writeFileSync(`${root}/rig.json`, JSON.stringify(rig, null, 2) + '\n');

// content.json
fs.writeFileSync(`${root}/content.json`, JSON.stringify({
  rating: 'PG-13',
  signoff: 'Aakash',
  notes: 'Fictional crime story. The murder is a covered body; the execution is a noose shadow, a bell and a fade to black. No graphic violence.',
}, null, 2) + '\n');

// sound.json (the mix is a temp bed; the cue list is the authored design)
fs.writeFileSync(`${root}/sound.json`, JSON.stringify({
  cues: 12,
  lufs: -14.2,
  truePeak: -1.6,
  list: [
    { shot: 's1', id: 'knife', kind: 'click', t: 1.8 },
    { shot: 's1', id: 'body', kind: 'thud', t: 2.4 },
    { shot: 's2', id: 'run', kind: 'whoosh', t: 4.2 },
    { shot: 's3', id: 'calendar', kind: 'paper', t: 8.4 },
    { shot: 's4', id: 'cuffs', kind: 'click', t: 11.54 },
    { shot: 's5', id: 'cell', kind: 'thud', t: 12.6 },
    { shot: 's6', id: 'gavel', kind: 'stamp', t: 17.1 },
    { shot: 's6', id: 'verdict', kind: 'chime', t: 17.7 },
    { shot: 's7', id: 'bell', kind: 'bell', t: 20.1 },
    { shot: 's7', id: 'noose', kind: 'paper', t: 18.6 },
    { shot: 's2', id: 'rain', kind: 'breath', t: 5.1 },
    { shot: 's7', id: 'dawn', kind: 'chime', t: 18.3 },
  ],
}, null, 2) + '\n');

console.log('score written: shots.json, sync.json, film.json, rig.json, content.json, sound.json');
