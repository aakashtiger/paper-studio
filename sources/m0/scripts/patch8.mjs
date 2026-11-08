import fs from "node:fs";
let p="src/characters.js", s=fs.readFileSync(p,"utf8");
s=s.replace("  // held props are drawn by scenes using returned hand positions, keep simple handles:\n  ctx.restore();\n}", "  // held props are drawn by scenes using returned hand positions, keep simple handles:\n  ctx.restore(); // torso\n  ctx.restore(); // outer\n}");
fs.writeFileSync(p,s);
console.log("patched mira");
