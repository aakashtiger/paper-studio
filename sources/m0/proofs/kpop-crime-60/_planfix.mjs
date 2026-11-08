import fs from 'node:fs';
const p = 'proofs/kpop-crime-60/make-score-60.mjs';
let s = fs.readFileSync(p, 'utf8');
let n = 0;
function rep(a, b, all = false) {
  if (!s.includes(a)) { console.log('MISS', a.slice(0, 90)); return; }
  s = all ? s.split(a).join(b) : s.replace(a, b);
  n++;
}

// 1. s01 = the act, knife still in his hand; s02 is the drop
rep('    state: { lamp: "lit", body: "under a clean sheet", knife: "in the gutter", file: "closed", tape: "not yet" },\n    summary: "Rain on the bricks; the man kneels over the covered body with the knife, then lays it in the gutter and steps back.",',
    '    state: { lamp: "lit", body: "under a clean sheet", knife: "in his hand", file: "closed", tape: "not yet" },\n    summary: "Rain on the bricks; the man kneels over the covered body with the knife in his hand, then steps back.",');
rep('    action: "He kneels over the covered body with the knife in his hand, lays the blade in the gutter, and steps back into the rain; his coat is black with rain.",',
    '    action: "He kneels over the covered body with the knife in his hand and steps back into the rain; his coat is black with rain.",');
rep('    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],\n    sameDay: true,',
    '    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],\n    stateEvent: "knife: in his hand -> in the gutter",\n    sameDay: true,');

// 2. s03 opens the file at the name in it (the killer's), not the dead man's
rep('    state: { lamp: "lit", body: "under a clean sheet", knife: "bagged", file: "open at the dead man\'s name", tape: "up" },',
    '    state: { lamp: "lit", body: "under a clean sheet", knife: "bagged", file: "open at the name in it", tape: "up" },');
rep('    summary: "The detective kneels, opens the case file at the dead man\'s name and bags the knife; police tape goes up behind him.",',
    '    summary: "The detective kneels, opens the case file at the name in it and bags the knife; police tape goes up behind him.",');
rep('    action: "The detective kneels, opens the file at the dead man\'s name, bags the knife, and the police tape goes up behind him.",',
    '    action: "The detective kneels, opens the file at the name in it, bags the knife, and the police tape goes up behind him.",');

// 3. s04 the ticket, then the run starts (the line "He ran" gets its image)
rep('    summary: "At the wet station window he buys a ticket, newspaper under his arm, hat down, collar up; a distant silhouette crosses the glass.",',
    '    summary: "At the wet station window he buys a ticket, newspaper under his arm, hat down, collar up; then he turns and runs for the platform.",');
rep('    action: "He pushes a note through the ticket slot; the ticket and the newspaper come back through it.",',
    '    action: "He pushes a note through the ticket slot; the ticket and the newspaper come back through it; then he turns and runs for the platform.",');

// 4. s05 the detective's hand; s10 the queue, not faces
rep('    summary: "He runs through the rain; a hand catches the coat tail and it slips free; a searchlight sweeps the street.",',
    '    summary: "He runs through the rain; the detective\'s hand catches the coat tail and it slips free; a searchlight sweeps the street.",');
rep('    action: "He runs through the rain; a hand catches his coat tail, the coat tears free, and a searchlight sweeps across the street.",',
    '    action: "He runs through the rain; the detective\'s hand catches his coat tail, the coat tears free, and a searchlight sweeps across the street.",');
rep('    action: "He joins the queue at the barrier; the lamp swings across the faces and stops on his.",',
    '    action: "He joins the queue at the barrier; the lamp swings across the queue and stops on his face.",');

// 5. s07 the script action: paper the window, turn the page, hang the cap. The knife is evidence, not here.
rep('    state: { calendar: "5", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn", floorboard: "knife hidden under it" },',
    '    state: { calendar: "5", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn" },');
rep('    summary: "He papers the window, hides the knife under the floorboard, turns the wall calendar to five and hangs his hat on the chair.",',
    '    summary: "He papers the window, turns the wall calendar to five and hangs his flat cap on the chair.",');
rep('    action: "He pins newspaper over the window, lifts the floorboard and hides the knife under it, then turns the calendar page to five.",',
    '    action: "He pins newspaper over the window, turns the calendar page to five and hangs the flat cap on the chair.",');
rep('    handProps: [{ who: "man", hand: "R", prop: "knife" }, { who: "man", hand: "L", prop: "floorboard" }],',
    '    handProps: [{ who: "man", hand: "R", prop: "hat" }],');
rep('    layers: ["wall", "window", "table", "calendar", "bulb", "door", "chair", "floorboard", "cast", "newspaper", "type", "hud"],',
    '    layers: ["wall", "window", "table", "calendar", "bulb", "door", "chair", "cast", "newspaper", "type", "hud"],');
rep('    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat", "knife", "floorboard"],\n  },\n  {\n    id: "s08"',
    '    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat"],\n  },\n  {\n    id: "s08"');

// 6. s08 no knife/floorboard
rep('    state: { calendar: "6", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn", floorboard: "knife hidden under it" },',
    '    state: { calendar: "6", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn" },');
rep('    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "floorboard", "cast", "type", "hud"],',
    '    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "cast", "type", "hud"],');
rep('    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat", "knife", "floorboard"],\n    stateEvent: "calendar: 5 -> 6",',
    '    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat"],\n    stateEvent: "calendar: 5 -> 6",');

// 7. s09 tears the page to seven, leaves the money, packs, cap. No counting, no knife.
rep('    state: { calendar: "7", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes left on the table", bag: "packed", hat: "worn", coat: "on", floorboard: "knife hidden under it" },',
    '    state: { calendar: "7", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes left on the table", bag: "packed", hat: "worn", coat: "on" },');
rep('    summary: "He tears the page to seven, counts the money into a banded stack, leaves it on the table, packs the bag and puts on the flat cap.",',
    '    summary: "He tears the page to seven, leaves the banded stack on the table, packs the bag and puts on the flat cap.",');
rep('    action: "He counts the money into a banded stack, leaves the stack on the table, packs the bag and puts the flat cap on his head.",',
    '    action: "He tears the calendar page to seven, leaves the banded stack on the table, packs the bag and puts the flat cap on his head.",');
rep('    handProps: [{ who: "man", hand: "R", prop: "money" }, { who: "man", hand: "L", prop: "hat" }],',
    '    handProps: [{ who: "man", hand: "L", prop: "hat" }],');
rep('    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "floorboard", "money", "bag", "cast", "coat", "type", "hud"],',
    '    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "money", "bag", "cast", "coat", "type", "hud"],');
rep('    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat", "knife", "floorboard"],\n    stateEvent: "calendar: 6 -> 7',
    '    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag", "coat"],\n    stateEvent: "calendar: 6 -> 7');

// 8. s13 the detective is at the far end, not just in the intent
rep('    action: "He walks onto the bridge through the rain; the searchlight sweeps the far end and pins the exit.",',
    '    action: "He walks onto the bridge through the rain; a distant detective silhouette waits under the far lamp, and the searchlight sweeps the far end.",');

// 9. s19 the warder closes the door; s20 the re-cuff is an action
rep('    summary: "The door closes on the same cell; he carries in the court jacket, folds it on the bench and looks at the calendar still reading ten.",',
    '    summary: "The warder closes the door on the same cell; he carries in the court jacket, folds it on the bench and looks at the calendar still reading ten.",');
rep('    action: "He carries the court jacket in, folds it on the bench, and looks at the calendar still reading ten; the door closes behind him.",',
    '    action: "He carries the court jacket in, folds it on the bench, and looks at the calendar still reading ten; the warder closes the door behind him.",');
rep('    summary: "At dawn the yard holds only the wall, the bell and the noose\'s shadow; the warder walks him in.",',
    '    summary: "At dawn the yard holds only the wall, the bell and the noose\'s shadow; the warder re-cuffs him at the yard door and walks him in.",');
rep('    action: "The warder walks him into the yard; the noose\'s shadow lies across the wall and the bell hangs still.",',
    '    action: "The warder re-cuffs his wrists at the yard door and walks him in; the noose\'s shadow lies across the wall and the bell hangs still.",');

// 10. the noose is a shadow, and the hideout has no floorboard signature
rep('  hideout:     { intent: "a rented room with a calendar", signature: ["window", "newspaper", "table", "calendar", "bulb", "door", "chair", "floorboard"] },',
    '  hideout:     { intent: "a rented room with a calendar", signature: ["window", "newspaper", "table", "calendar", "bulb", "door", "chair"] },');
rep('  yard:        { intent: "a prison yard at dawn", signature: ["wall", "gallows", "bell", "platform", "noose", "dawn"] },',
    '  yard:        { intent: "a prison yard at dawn", signature: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn"] },');
rep('    layers: ["wall", "gallows", "bell", "platform", "noose", "dawn", "cast", "type", "hud"],\n    props: ["wall", "gallows", "bell", "platform", "noose", "calendar", "dawn", "handcuffs"],\n    sameDay: true,\n    stateEvent: "cuffs: on the warder\'s belt -> on his wrists",',
    '    layers: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn", "cast", "type", "hud"],\n    props: ["wall", "gallows", "bell", "platform", "nooseShadow", "calendar", "dawn", "handcuffs"],\n    sameDay: true,\n    stateEvent: "cuffs: on the warder\'s belt -> on his wrists",');
rep('    layers: ["wall", "gallows", "bell", "platform", "noose", "dawn", "cast", "type", "hud"],\n    props: ["wall", "gallows", "bell", "platform", "noose", "calendar", "dawn", "handcuffs"],\n    sameDay: true,\n    stateEvent: "bell: still -> swung once; dawn: rising -> held",',
    '    layers: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn", "cast", "type", "hud"],\n    props: ["wall", "gallows", "bell", "platform", "nooseShadow", "calendar", "dawn", "handcuffs"],\n    sameDay: true,\n    stateEvent: "bell: still -> swung once; dawn: rising -> held",');

fs.writeFileSync(p, s);
console.log('make-score applied', n);
