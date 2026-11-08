import fs from 'node:fs';
const p = 'proofs/kpop-crime-60/make-score-60.mjs';
let s = fs.readFileSync(p, 'utf8');
let n = 0;
function rep(a, b, all = false) {
  if (!s.includes(a)) { console.log('MISS', a.slice(0, 70)); return; }
  s = all ? s.split(a).join(b) : s.replace(a, b);
  n++;
}

// the tape and the case file arrive with the detective; they are not alley set dressing
rep('alley:      { intent: "a wet brick alley at night", signature: ["brickWall", "lamp", "policeTape", "floor"] },',
    'alley:      { intent: "a wet brick alley at night", signature: ["brickWall", "lamp", "floor"] },');
rep('props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "caseFile", "rain", "calendar", "coat"],\n  },\n  {\n    id: "s02"',
    'props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],\n  },\n  {\n    id: "s02"');
rep('props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "caseFile", "rain", "calendar", "coat"],\n    sameDay: true,',
    'props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],\n    sameDay: true,');
rep('propEvent: "policeTape: absent -> up",',
    'propEvent: "caseFile: absent -> in the detective\'s hand; policeTape: absent -> up",');
rep('action: "He pushes a note through the ticket slot; the ticket and the newspaper come back, and a distant detective silhouette crosses the window.",',
    'action: "He pushes a note through the ticket slot; the ticket and the newspaper come back through it.",');

// money is notes, not a white bundle
rep('money: "a white bundle on the table"', 'money: "a banded stack of notes on the table"', true);
rep('money: "a white bundle left on the table"', 'money: "a banded stack of notes left on the table"');
rep('counts the money into a white bundle, leaves it on the table', 'counts the money into a banded stack, leaves it on the table', true);
rep('counts the money into a white bundle, leaves the bundle on the table', 'counts the money into a banded stack, leaves the stack on the table');
rep('money: a white bundle on the table -> a white bundle left on the table', 'money: a banded stack of notes on the table -> a banded stack of notes left on the table');

fs.writeFileSync(p, s);
console.log('applied', n);
