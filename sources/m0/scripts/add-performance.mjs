import { readFileSync, writeFileSync } from "node:fs";
const p = "proofs/kpop-test/sync.json";
const j = JSON.parse(readFileSync(p, "utf8"));
const by = Object.fromEntries(j.shots.map((s) => [s.id, s]));
const kind = {
  s1: { novaStep: "root" },
  s2: { novaStep2: "root", novaBreath: "pose", miraLook: "face" },
  s3: { miraLook: "face" },
  s4: { miraEnter: "root", miraReach: "pose" },
  s5: { miraExtend: "pose", novaOpen: "pose" },
  s6: { novaLight: "root" },
  s7: { novaSing: "face" },
  s8: { miraPoint: "pose" },
  s9: { novaBow: "pose" },
};
for (const [id, m] of Object.entries(kind)) {
  for (const [eid, k] of Object.entries(m)) {
    const ev = by[id].events.find((e) => e.id === eid);
    if (ev) ev.kind = k;
  }
}
const add = (id, ev) => {
  const s = by[id];
  if (!s.events.some((e) => e.id === ev.id)) s.events.push(ev);
};
add("s1", { id: "novaFace", word: "one", offset: 0, layer: "cast", kind: "face", what: "Nova's eyes go wide" });
add("s1", { id: "miraLook1", word: "one", offset: 0, layer: "cast", kind: "face", what: "Mira looks up" });
add("s2", { id: "novaFace2", word: "breath", offset: 0, layer: "cast", kind: "face", what: "Nova closes her eyes" });
add("s3", { id: "miraWalk", word: "tonight", offset: 0, layer: "cast", kind: "root", what: "Mira walks to the mark" });
add("s3", { id: "miraReact", word: "empty", offset: 0, layer: "cast", kind: "face", what: "Mira sees the empty mark" });
add("s4", { id: "novaLift", word: "star", offset: 0, layer: "cast", kind: "face", what: "Nova lifts her head" });
add("s5", { id: "novaGrip", word: "hand", offset: 0, layer: "cast", kind: "face", what: "Nova looks at the star" });
add("s5", { id: "miraGive", word: "hand", offset: 0, layer: "cast", kind: "face", what: "Mira smiles as she lets go" });
add("s6", { id: "novaSing6", word: "list", offset: 0, layer: "cast", kind: "face", what: "Nova sings to the crowd" });
add("s6", { id: "miraList", word: "list", offset: 0, layer: "cast", kind: "pose", what: "Mira holds the list up" });
add("s7", { id: "novaArm", word: "found", offset: 0, layer: "cast", kind: "pose", what: "Nova raises her arm" });
add("s7", { id: "miraCheer", word: "her", offset: 0, layer: "cast", kind: "pose", what: "Mira cheers" });
add("s8", { id: "novaTurn", word: "called", offset: 0, layer: "cast", kind: "face", what: "Nova turns to Mira" });
add("s8", { id: "miraLook8", word: "lamp", offset: 0, layer: "cast", kind: "face", what: "Mira looks up at the lamp" });
add("s9", { id: "miraBow", word: "waiting", offset: 0, layer: "cast", kind: "pose", what: "Mira bows" });
add("s9", { id: "novaSmile", word: "all", offset: 0, layer: "cast", kind: "face", what: "Nova smiles" });
add("s9", { id: "miraSmile", word: "night", offset: 0, layer: "cast", kind: "face", what: "Mira smiles" });
add("s9", { id: "novaStep9", word: "stage", offset: 0, layer: "cast", kind: "root", what: "Nova steps forward" });
writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
console.log("performance events added");
