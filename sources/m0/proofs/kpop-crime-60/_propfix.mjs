import fs from 'node:fs';
const p = 'proofs/kpop-crime-60/make-score-60.mjs';
let s = fs.readFileSync(p, 'utf8');
let n = 0;
function rep(a, b) {
  if (!s.includes(a)) { console.log('MISS', a.slice(0, 80)); return; }
  s = s.split(a).join(b); n++;
}

// the coat is the man's costume, not a separately drawn prop in these shots
rep('    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],\n    sameDay: true,\n  },\n  {\n    id: "s03"',
    '    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar"],\n    sameDay: true,\n  },\n  {\n    id: "s03"');
rep('    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "caseFile", "rain", "calendar", "coat"],',
    '    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "caseFile", "rain", "calendar"],');
rep('    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat"],',
    '    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag"],');

// the story's gray hat is the thief's grey flat cap
rep('    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "grayHat", "handcuffs"],\n    sameDay: true,\n    stateEvent: "hat: left at the checkpoint -> in the detective\'s hand",',
    '    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "flatCap", "handcuffs"],\n    sameDay: true,\n    stateEvent: "hat: left at the checkpoint -> in the detective\'s hand",');
rep('    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "grayHat", "handcuffs"],\n    sameDay: true,\n    stateEvent: "cuffs: not yet -> closed on his wrist",',
    '    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "flatCap", "handcuffs"],\n    sameDay: true,\n    stateEvent: "cuffs: not yet -> closed on his wrist",');

fs.writeFileSync(p, s);
console.log('applied', n);
