import fs from "node:fs";
let p="src/scenes/act1.js", s=fs.readFileSync(p,"utf8");
s=s.replace("      beginCam(ctx);\n      // petal ring unfolds one per beat", "      beginCam(ctx);\n      ctx.translate(cx, cy);\n      // petal ring unfolds one per beat");
fs.writeFileSync(p,s);
console.log("patched cold open");
