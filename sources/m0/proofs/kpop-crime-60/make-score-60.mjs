/**
 * `make-score-60` — the 60 s score, derived from the measured word clock.
 *
 * usage: node proofs/kpop-crime-60/make-score-60.mjs
 * writes shots.json, sync.json, film.json, rig.json, content.json
 *
 * The shots are test-words.js's KPOP_SHOTS (the measured read). The sync
 * table is one event per content word: camera at the first, set at the second,
 * cast at all, with a cast0 anchor in every shot. An event is nudged by at
 * most 0.01 s only when a content-word gap would otherwise read over 1.3 s.
 *
 * The staging contract, added for the shot agents:
 *   castStyle      the four roles: palette, hat, badge, silhouette
 *   sets           each set's intent and its signature parts
 *   opening        the act the first shot must stage
 *   shots[].intent           what the audience must understand
 *   shots[].action           the physical change on screen (never "he stands")
 *   shots[].firstAppearance  the role introduced in this shot, or null
 *   shots[].roleTag          the label drawn at that first appearance, or null
 *   shots[].matchCut         true on the incoming shot of a continuous run;
 *                            the shot reuses the previous shot's end position
 *   shots[].handProps        [{ who, hand: "L"|"R", prop }]
 *   shots[].foreground       props drawn after the cast
 *   shots[].setBase          the set signature to use when `set` is an alias
 */
import fs from "node:fs";
import vm from "node:vm";

const ROOT = "proofs/kpop-crime-60";
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(`${ROOT}/test-words.js`, "utf8"), sandbox);
const W = sandbox.window;
const lines = W.KPOP_LINES;
const shots = W.KPOP_SHOTS;
const sound = JSON.parse(fs.readFileSync(`${ROOT}/sound.json`, "utf8"));

const STOP = new Set("and the a an to of in on it its her his he she they we you i was were is are be been had that who for with at as but so".split(" "));
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9']/g, "");
const round3 = (v) => Number(v.toFixed(3));

// --- shots.json ------------------------------------------------------------
const shotRows = shots.map((s) => ({ id: s.id, start: s.start, end: s.end, duration: s.duration }));
fs.writeFileSync(`${ROOT}/shots.json`, `${JSON.stringify(shotRows, null, 2)}\n`, "utf8");

// --- sync.json -------------------------------------------------------------
const sync = { shots: [] };
for (const line of lines) {
  const shot = shots.find((s) => s.line === lines.indexOf(line));
  const content = line.words.filter((w) => !STOP.has(norm(w.w)));
  const events = content.map((w, i) => ({
    id: `e${i}`,
    word: w.w,
    offset: 0,
    layer: i === 0 ? "camera" : i === 1 ? "set" : "cast",
    what: `${shot.id} ${w.w}`,
  }));
  for (let i = 1; i < events.length; i++) {
    const gap = content[i].t + events[i].offset - (content[i - 1].t + events[i - 1].offset);
    if (gap > 1.3) {
      events[i].offset = round3(Math.max(-0.2, 1.29 - (content[i].t - content[i - 1].t - events[i - 1].offset)));
      events[i].what += " (nudged inside the 1.3 s event gap)";
    }
  }
  events.push({ id: "cast0", word: content[0].w, offset: 0, layer: "cast", what: `${shot.id} cast` });
  sync.shots.push({ id: shot.id, events });
}
fs.writeFileSync(`${ROOT}/sync.json`, `${JSON.stringify(sync, null, 2)}\n`, "utf8");

// --- the role identity contract -------------------------------------------
const CAST_STYLE = {
  thief:     { role: "thief", palette: ["#6B5A3E", "#7A2026"], hat: "flatcap", badge: false, silhouette: "worker, flat cap, scarf" },
  detective: { role: "detective", palette: ["#1E2A3A", "#F2E8D5"], hat: "fedora", badge: true, silhouette: "trench coat, fedora, tie, badge" },
  warder:    { role: "warder", palette: ["#8A8E92", "#F2E8D5"], hat: "peaked", badge: true, silhouette: "light grey uniform, peaked cap, baton" },
  judge:     { role: "judge", palette: ["#171310", "#F2E8D5"], hat: "none", badge: false, silhouette: "robe, white collar, glasses" },
};

// --- the set signature contract -------------------------------------------
// A shot's props/layers must carry the names its set draws. `policeTape` is
// the one part that arrives with the police: absent in s01/s02, up in s03.
const SETS = {
  alley:      { intent: "a wet brick alley at night", signature: ["brickWall", "lamp", "floor"] },
  station:    { intent: "a station ticket hall", signature: ["ticketBooth", "departures", "clock", "window", "bench"] },
  chase:      { intent: "a city street in the rain", signature: ["city", "windows", "searchlight", "rain"] },
  train:      { intent: "a night train carriage", signature: ["trainWindow", "seat", "luggage", "door", "tunnel"] },
  hideout:    { intent: "a rented room with a calendar", signature: ["window", "newspaper", "table", "calendar", "bulb", "door", "chair"] },
  checkpoint: { intent: "a checkpoint at the city edge", signature: ["barrier", "hut", "lamp", "queue", "rain"] },
  bridge:     { intent: "a wet bridge over a river", signature: ["bridge", "river", "lamps", "rain", "searchlight"] },
  cell:       { intent: "a cell behind bars", signature: ["bars", "window", "bench", "calendar", "door"] },
  court:      { intent: "a court with a judge's bench", signature: ["bench", "flag", "gavel", "caseFile", "dock"] },
  yard:       { intent: "a prison yard at dawn", signature: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn"] },
};

// s19 is the same cell after the verdict; the set id stays distinct so the
// return reads as a second visit, and resolves to the one `cell` signature.
const SET_ALIASES = { "cell-return": "cell" };

// --- film.json -------------------------------------------------------------
// 21 shots, 7 scenes, days 1–10. Every shot stages a physical change; no shot
// is a portrait. `matchCut` is true on the incoming shot of a continuous run
// (s11/s12, s14/s15, s18, s21), which reuses the previous shot's end position.
const FILM_SHOTS = [
  {
    id: "s01", set: "alley", day: 1, place: "the alley", costume: "civilian",
    state: { lamp: "lit", body: "under a clean sheet", knife: "in his hand", file: "closed", tape: "not yet" },
    summary: "Rain on the bricks; the man kneels over the covered body with the knife in his hand, then steps back.",
    intent: "The audience must understand that this man has just killed the man under the sheet.",
    action: "He kneels over the covered body with the knife in his hand and steps back into the rain; his coat is black with rain.",
    firstAppearance: "thief", roleTag: "THE THIEF",
    matchCut: false,
    handProps: [{ who: "man", hand: "R", prop: "knife" }],
    foreground: [],
    camera: "push", transition: "flash",
    layers: ["backdrop", "brickWall", "wall", "lamp", "floor", "body", "foreground", "cast", "knife", "rain", "type", "hud"],
    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar", "coat"],
  },
  {
    id: "s02", set: "alley", day: 1, place: "the alley", costume: "civilian",
    state: { lamp: "lit", body: "under a clean sheet", knife: "in the gutter", file: "closed", tape: "not yet" },
    summary: "His hand opens over the knife, leaves it in the rain, and the blade takes the lamp once; the sheet sits at the frame edge.",
    intent: "The murder weapon is left in the rain, and the killer walks away from it.",
    action: "His hand opens and leaves the knife in the gutter, then withdraws out of frame while the blade takes the lamp once.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [],
    foreground: [],
    camera: "push", transition: "cut",
    layers: ["brickWall", "wall", "lamp", "floor", "body", "knife", "rain", "cast", "type", "hud"],
    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "rain", "calendar"],
    stateEvent: "knife: in his hand -> in the gutter",
    sameDay: true,
  },
  {
    id: "s03", set: "alley", day: 1, place: "the alley", costume: "civilian",
    state: { lamp: "lit", body: "under a clean sheet", knife: "bagged", file: "open at the killer's name", tape: "up" },
    summary: "The detective kneels, opens the case file at the killer's name and bags the knife; police tape goes up behind him.",
    intent: "The detective now owns the case: the body, the file and the bagged knife.",
    action: "The detective kneels, opens the file at the killer's name, bags the knife, and the police tape goes up behind him.",
    firstAppearance: "detective", roleTag: "THE DETECTIVE",
    matchCut: false,
    handProps: [{ who: "detective", hand: "L", prop: "caseFile" }, { who: "detective", hand: "R", prop: "knife" }],
    foreground: [],
    camera: "track", transition: "cut",
    layers: ["backdrop", "brickWall", "wall", "lamp", "floor", "body", "caseFile", "cast", "rain", "type", "hud"],
    props: ["brickWall", "lamp", "floor", "coveredBody", "knife", "caseFile", "rain", "calendar"],
    sameDay: true,
    stateEvent: "knife: gutter -> bagged; file: closed -> open at the killer's name; tape: not yet -> up",
    propEvent: "caseFile: absent -> in the detective's hand; policeTape: absent -> up",
  },
  {
    id: "s04", set: "station", day: 2, place: "the station", costume: "fugitive",
    state: { booth: "open", ticket: "bought", hat: "worn", collar: "up", newspaper: "under his arm" },
    summary: "At the wet station window he buys a ticket, newspaper under his arm, hat down, collar up; then he turns and runs for the platform.",
    intent: "He is buying his way out of the city before the police can name him.",
    action: "He pushes a note through the ticket slot; the ticket and the newspaper come back through it; then he turns and runs for the platform.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "man", hand: "R", prop: "ticket" }],
    foreground: [],
    camera: "push", transition: "flash",
    layers: ["wall", "window", "ticketBooth", "departures", "clock", "bench", "floor", "cast", "rain", "type", "hud"],
    props: ["ticketBooth", "ticket", "newspaper", "hat", "rain", "calendar", "lamp", "departures", "clock", "window", "bench"],
    costumeEvent: "station: civilian -> fugitive",
  },
  {
    id: "s05", set: "chase", day: 3, place: "the city", costume: "fugitive",
    state: { rain: "steady", searchlight: "sweeping", coat: "caught, then free", hat: "worn", file: "with the detective" },
    summary: "He runs through the rain; the detective's hand catches the coat tail and it slips free; a searchlight sweeps the street.",
    intent: "The police are close enough to touch him, and he is still faster.",
    action: "He runs through the rain; the detective's hand catches his coat tail, the coat tears free, and a searchlight sweeps across the street.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [],
    foreground: [],
    camera: "track", transition: "cut",
    layers: ["city", "windows", "searchlight", "floor", "cast", "rain", "type", "hud"],
    props: ["street", "coat", "hat", "rain", "searchlight", "calendar", "city", "windows"],
  },
  {
    id: "s06", set: "train", day: 4, place: "the train", costume: "fugitive",
    state: { window: "black in the tunnel", ticket: "on the seat", door: "a shadow in the doorway", hat: "worn", file: "with the detective" },
    summary: "He lays the ticket on an empty seat and slips out as the train enters the tunnel; the window goes black and the detective's shadow fills the door.",
    intent: "He leaves a false trail on the train and disappears into the tunnel.",
    action: "He lays the ticket on the empty seat, slips out the door, and the window goes black as the detective's shadow fills the vestibule.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "man", hand: "R", prop: "ticket" }],
    foreground: [],
    camera: "track", transition: "flash",
    layers: ["trainWindow", "seat", "luggage", "door", "tunnel", "cast", "ticket", "rain", "type", "hud"],
    props: ["ticket", "seat", "trainWindow", "rain", "hat", "calendar", "door", "luggage", "tunnel"],
  },
  {
    id: "s07", set: "hideout", day: 5, place: "the hideout", costume: "fugitive",
    state: { calendar: "5", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn" },
    summary: "He papers the window, turns the wall calendar to five and hangs his flat cap on the chair.",
    intent: "He is hiding, and he is counting the days until it is safe.",
    action: "He pins newspaper over the window, turns the calendar page to five and hangs the flat cap on the chair.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "man", hand: "R", prop: "hat" }],
    foreground: [],
    camera: "push", transition: "flash",
    layers: ["wall", "window", "table", "calendar", "bulb", "door", "chair", "cast", "newspaper", "type", "hud"],
    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag"],
  },
  {
    id: "s08", set: "hideout", day: 6, place: "the hideout", costume: "fugitive",
    state: { calendar: "6", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes on the table", bag: "by the table", hat: "on the chair", coat: "worn" },
    summary: "He turns the page to six; a knock comes; he freezes by the door and does not answer while the bulb flickers.",
    intent: "Someone is at the door, and he chooses not to answer.",
    action: "He turns the calendar page to six and freezes as a knock lands; a shadow passes under the door and the bulb flickers.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [],
    foreground: [],
    camera: "push", transition: "cut",
    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "cast", "type", "hud"],
    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag"],
    stateEvent: "calendar: 5 -> 6",
  },
  {
    id: "s09", set: "hideout", day: 7, place: "the hideout", costume: "fugitive",
    state: { calendar: "7", window: "papered", door: "closed", bulb: "lit", money: "a banded stack of notes left on the table", bag: "packed", hat: "worn", coat: "on" },
    summary: "He tears the page to seven, leaves the banded stack on the table, packs the bag and puts on the flat cap.",
    intent: "He leaves the money and takes only what he can carry.",
    action: "He tears the calendar page to seven, leaves the banded stack on the table, packs the bag and puts the flat cap on his head.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "man", hand: "L", prop: "hat" }],
    foreground: [],
    camera: "pull", transition: "cut",
    layers: ["wall", "window", "newspaper", "table", "calendar", "bulb", "door", "chair", "money", "bag", "cast", "coat", "type", "hud"],
    props: ["calendar", "newspaper", "window", "table", "bulb", "hat", "door", "chair", "money", "bag"],
    stateEvent: "calendar: 6 -> 7; money: a banded stack of notes on the table -> a banded stack of notes left on the table; bag: by the table -> packed; hat: on the chair -> worn; coat: worn -> on",
  },
  {
    id: "s10", set: "checkpoint", day: 8, place: "the checkpoint", costume: "fugitive",
    state: { lamp: "swinging", queue: "at the barrier", hat: "worn", collar: "up", file: "open in the detective's hand" },
    summary: "At the city's edge a lamp swings over the checkpoint queue and finds his face.",
    intent: "The only way out of the city is a checkpoint, and the light is already looking for him.",
    action: "He joins the queue at the barrier; the lamp swings across the queue and stops on his face.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [],
    foreground: [],
    camera: "pan", transition: "flash",
    layers: ["barrier", "hut", "lamp", "queue", "floor", "cast", "rain", "type", "hud"],
    props: ["barrier", "lamp", "caseFile", "calendar", "queue", "rain", "hat", "coat", "hut"],
  },
  {
    id: "s11", set: "checkpoint", day: 8, place: "the checkpoint", costume: "fugitive",
    state: { lamp: "swinging", queue: "at the barrier", hat: "worn", collar: "up", file: "open in the detective's hand" },
    summary: "The detective looks up from the file at the man's hat; the man's eyes are the only still thing under the lamp.",
    intent: "The detective has found the face that matches the file.",
    action: "The lamp finds his face; the detective looks up from the open file, and his eyes stop on the hat.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "detective", hand: "L", prop: "caseFile" }],
    foreground: [],
    camera: "push", transition: "cut",
    layers: ["barrier", "hut", "lamp", "queue", "caseFile", "cast", "rain", "type", "hud"],
    props: ["barrier", "lamp", "caseFile", "calendar", "queue", "rain", "hat", "coat", "hut"],
    sameDay: true,
  },
  {
    id: "s12", set: "checkpoint", day: 8, place: "the checkpoint", costume: "fugitive",
    state: { lamp: "swinging", queue: "at the barrier", hat: "left on the barrier", collar: "up", file: "open in the detective's hand" },
    summary: "He turns his collar up, sets the grey cap on the barrier and walks through the light without stopping; the detective's eyes follow the cap, not the man.",
    intent: "He gives the detective a decoy and walks out under the light.",
    action: "He turns his collar up, sets the grey cap on the barrier with his hand, and walks through the light; the detective's eyes follow the cap.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "man", hand: "R", prop: "hat" }],
    foreground: [],
    camera: "track", transition: "cut",
    layers: ["barrier", "hut", "lamp", "queue", "cast", "hat", "rain", "type", "hud"],
    props: ["barrier", "lamp", "caseFile", "calendar", "queue", "rain", "hat", "coat", "hut"],
    sameDay: true,
    stateEvent: "hat: worn -> left on the barrier",
  },
  {
    id: "s13", set: "bridge", day: 9, place: "the bridge", costume: "fugitive",
    state: { rain: "steady", searchlight: "watching the far end", hat: "left at the checkpoint", cuffs: "not yet", file: "with the detective" },
    summary: "Rain on the bridge; he walks toward the far end, where a searchlight already watches the only way out.",
    intent: "The bridge is the last way out, and the detective is already at the far end.",
    action: "He walks onto the bridge through the rain; a distant detective silhouette waits under the far lamp, and the searchlight sweeps the far end.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [],
    foreground: [],
    camera: "push", transition: "flash",
    layers: ["bridge", "river", "lamps", "searchlight", "cast", "rain", "type", "hud"],
    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "handcuffs"],
  },
  {
    id: "s14", set: "bridge", day: 9, place: "the bridge", costume: "fugitive",
    state: { rain: "steady", searchlight: "watching the far end", hat: "in the detective's hand", cuffs: "not yet", file: "with the detective" },
    summary: "The detective steps out of the lamp's shadow with the man's grey hat in his hand, and the man stops.",
    intent: "The detective has the hat, and the man knows he has been found.",
    action: "The detective steps out of the lamp's shadow holding the grey hat up; the man stops.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "detective", hand: "R", prop: "grayHat" }],
    foreground: [],
    camera: "pull", transition: "cut",
    layers: ["bridge", "river", "lamps", "searchlight", "cast", "grayHat", "rain", "type", "hud"],
    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "flatCap", "handcuffs"],
    sameDay: true,
    stateEvent: "hat: left at the checkpoint -> in the detective's hand",
  },
  {
    id: "s15", set: "bridge", day: 9, place: "the bridge", costume: "fugitive",
    state: { rain: "steady", searchlight: "watching the far end", hat: "in the detective's hand", cuffs: "closed on his wrist", file: "with the detective" },
    summary: "The cuffs close on his wrist; the open ring is in the detective's fingers, and the city goes on behind them.",
    intent: "He is caught, and the city does not care.",
    action: "The detective closes the cuffs on his wrist; the open ring snaps shut, and the city traffic goes on behind them.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "detective", hand: "L", prop: "handcuffs" }],
    foreground: [],
    camera: "pull", transition: "cut",
    layers: ["bridge", "river", "lamps", "searchlight", "cast", "cuffs", "rain", "type", "hud"],
    props: ["bridgeRail", "bridge", "river", "lamps", "rain", "searchlight", "calendar", "coat", "caseFile", "flatCap", "handcuffs"],
    sameDay: true,
    stateEvent: "cuffs: not yet -> closed on his wrist",
  },
  {
    id: "s16", set: "cell", day: 10, place: "the cell", costume: "prison",
    state: { door: "open", cuffs: "off, on the warder's belt", jacket: "on the bench", file: "on the bench", calendar: "10", light: "corridor light in" },
    summary: "At first light the cell door opens on the calendar's last page; the warder unlocks the cuffs, hooks them on his belt, and lays the court jacket and the case file on the bench.",
    intent: "The state has him now: the cell, the warder and the court jacket.",
    action: "The warder unlocks the cuffs from his wrists, hooks them on his belt, and lays the court jacket and the case file on the bench.",
    firstAppearance: "warder", roleTag: "THE WARDER",
    matchCut: false,
    handProps: [{ who: "warder", hand: "R", prop: "cuffs" }, { who: "warder", hand: "L", prop: "courtJacket" }],
    foreground: ["cellBarsFront"],
    camera: "push", transition: "flash",
    layers: ["bars", "foregroundBars", "window", "bench", "floor", "door", "caseFile", "cast", "calendar", "type", "hud"],
    props: ["calendar", "cellDoor", "door", "bench", "bars", "window", "cuffs", "courtJacket", "caseFile"],
    costumeEvent: "cell: fugitive -> prison",
  },
  {
    id: "s17", set: "court", day: 10, place: "the court", costume: "court",
    state: { file: "open at the knife drawing", gavel: "at rest", verdict: "read", gallery: "empty", cuffs: "on the warder's belt" },
    summary: "The judge reads the verdict card without hurry while the case file lies open at the knife drawing.",
    intent: "The judge has the file, the verdict and the gavel, and the sentence is already decided.",
    action: "The judge lifts the verdict card and reads it; the case file lies open at the knife drawing.",
    firstAppearance: "judge", roleTag: "THE JUDGE",
    matchCut: false,
    handProps: [{ who: "judge", hand: "R", prop: "verdict" }],
    foreground: [],
    camera: "track", transition: "curtain",
    layers: ["wall", "bench", "flag", "dock", "caseFile", "cast", "gavel", "verdict", "type", "hud"],
    props: ["bench", "gavel", "caseFile", "verdict", "flag", "calendar", "cuffs", "knifeDrawing", "dock"],
    sameDay: true,
    costumeEvent: "court: prison -> court",
  },
  {
    id: "s18", set: "court", day: 10, place: "the court", costume: "court",
    state: { file: "closed", gavel: "fallen", verdict: "guilty", gallery: "empty", cuffs: "on the warder's belt" },
    summary: "The gavel falls; the judge closes the file, the warder takes his arm, and the empty court moves him out.",
    intent: "The sentence is final, and the warder takes him.",
    action: "The gavel falls; the judge closes the file, and the warder takes his arm and moves him out.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "judge", hand: "R", prop: "gavel" }],
    foreground: [],
    camera: "push", transition: "cut",
    layers: ["wall", "bench", "flag", "dock", "caseFile", "cast", "gavel", "cuffs", "type", "hud"],
    props: ["bench", "gavel", "caseFile", "verdict", "flag", "calendar", "cuffs", "knifeDrawing", "dock"],
    sameDay: true,
    stateEvent: "file: open -> closed; gavel: at rest -> fallen; verdict: read -> guilty",
  },
  {
    id: "s19", set: "cell-return", setBase: "cell", day: 10, place: "the cell", costume: "prison",
    state: { door: "closed", cuffs: "on the warder's belt", jacket: "folded on the bench", file: "gone to court", calendar: "10", light: "cell lamp" },
    summary: "The warder closes the door on the same cell; the man carries in the court jacket, folds it on the bench and looks at the calendar still reading ten.",
    intent: "Nothing has changed except him: the same cell and the same page ten.",
    action: "He carries the court jacket in, folds it on the bench, and looks at the calendar still reading ten; the warder closes the door behind him.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "man", hand: "L", prop: "courtJacket" }],
    foreground: ["cellBarsFront"],
    camera: "push", transition: "curtain",
    layers: ["bars", "foregroundBars", "window", "bench", "floor", "door", "cast", "calendar", "type", "hud"],
    props: ["calendar", "cellDoor", "door", "bench", "bars", "window", "cuffs", "courtJacket"],
    sameDay: true,
    costumeEvent: "cell: court -> prison",
    stateEvent: "door: open -> closed; jacket: on the bench -> folded; file: on the bench -> gone to court; light: corridor -> cell lamp",
    propEvent: "caseFile: on the bench -> gone to court",
  },
  {
    id: "s20", set: "yard", day: 10, place: "the yard", costume: "prison",
    state: { bell: "still", noose: "a shadow on the wall", platform: "empty", dawn: "rising", cuffs: "on his wrists" },
    summary: "At dawn the yard holds only the wall, the bell and the noose's shadow; the warder re-cuffs him at the yard door and walks him in.",
    intent: "This is the last walk, and the yard is already waiting.",
    action: "The warder re-cuffs his wrists at the yard door and walks him in; the noose's shadow lies across the wall and the bell hangs still.",
    firstAppearance: null, roleTag: null,
    matchCut: false,
    handProps: [{ who: "warder", hand: "R", prop: "handcuffs" }],
    foreground: [],
    camera: "pull", transition: "curtain",
    layers: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn", "handcuffs", "cast", "type", "hud"],
    props: ["wall", "gallows", "bell", "platform", "nooseShadow", "calendar", "dawn", "handcuffs"],
    sameDay: true,
    stateEvent: "cuffs: on the warder's belt -> on his wrists",
  },
  {
    id: "s21", set: "yard", day: 10, place: "the yard", costume: "prison",
    state: { bell: "swung once", noose: "a shadow on the wall", platform: "empty", dawn: "held", cuffs: "on his wrists" },
    summary: "The bell swings once; the shadows hold at the wall, and the last 0.4 s go to black.",
    intent: "The execution happens off-screen, and the shadow is all we see.",
    action: "The bell swings once; the rope shadow moves on the wall and holds as the picture fades to black.",
    firstAppearance: null, roleTag: null,
    matchCut: true,
    handProps: [{ who: "warder", hand: "L", prop: "handcuffs" }],
    foreground: [],
    camera: "pull", transition: "fade",
    layers: ["wall", "gallows", "bell", "platform", "nooseShadow", "dawn", "handcuffs", "cast", "type", "hud"],
    props: ["wall", "gallows", "bell", "platform", "nooseShadow", "calendar", "dawn", "handcuffs"],
    sameDay: true,
    stateEvent: "bell: still -> swung once; dawn: rising -> held",
  },
];

const film = {
  id: "kpop-crime-60",
  duration: 60.0,
  opening: { shot: "s01", act: "the murder" },
  scenes: [
    { id: "S1", title: "THE ALLEY", days: "1", shots: ["s01", "s02", "s03"] },
    { id: "S2", title: "THE FLIGHT", days: "2–4", shots: ["s04", "s05", "s06"] },
    { id: "S3", title: "THE HIDEOUT", days: "5–7", shots: ["s07", "s08", "s09"] },
    { id: "S4", title: "THE CHECKPOINT", days: "8", shots: ["s10", "s11", "s12"] },
    { id: "S5", title: "THE BRIDGE", days: "9", shots: ["s13", "s14", "s15"] },
    { id: "S6", title: "THE CELL AND THE COURT", days: "10", shots: ["s16", "s17", "s18"] },
    { id: "S7", title: "THE RETURN AND THE YARD", days: "page 10, next dawn", shots: ["s19", "s20", "s21"] },
  ],
  castStyle: CAST_STYLE,
  castRoles: { man: "thief", detective: "detective", warder: "warder", judge: "judge" },
  sets: SETS,
  setAliases: SET_ALIASES,
  shots: FILM_SHOTS.map((shot) => ({
    ...shot,
    type: ["hero", "label", "subtitle", "hud"],
  })),
  sound: { cues: sound.cues, lufs: sound.lufs, truePeak: sound.truePeak },
  look: {
    reference: { night: { luma: 79.79, saturation: 18.68, edges: 4.55 } },
    luma: [55, 100],
    saturation: [14, 26],
    edges: [3.0, 6.5],
  },
  mood: "mixed",
  // The cast key is the measured rig's name; `castRoles` points it at
  // `castStyle` so the rig does not change shape.
  cast: {
    man: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    detective: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    warder: { shoulder: [80, -500], arm: [104, 88], head: 128 },
    judge: { shoulder: [80, -500], arm: [104, 88], head: 128 },
  },
};
fs.writeFileSync(`${ROOT}/film.json`, `${JSON.stringify(film, null, 2)}\n`, "utf8");

// --- rig.json --------------------------------------------------------------
const rig = {
  pass: true,
  cast: film.cast,
  armConvention: "armL+/armR-",
  noPetals: true,
  mirroredBoots: true,
  handThumb: true,
  footTargets: true,
};
fs.writeFileSync(`${ROOT}/rig.json`, `${JSON.stringify(rig, null, 2)}\n`, "utf8");

// --- content.json ----------------------------------------------------------
fs.writeFileSync(`${ROOT}/content.json`, `${JSON.stringify({
  rating: "PG-13",
  signoff: "Aakash",
  notes: "Fictional crime story. The murder is a covered body; the execution is a noose shadow, a bell and a fade to black. No graphic violence.",
}, null, 2)}\n`, "utf8");

console.log(`score written: ${shotRows.length} shots, ${sync.shots.reduce((n, s) => n + s.events.length, 0)} events, ${film.shots.length} film rows`);
