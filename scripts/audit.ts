import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { auditFilm } from "../src/engine/audit.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run audit -- <score.json>");
  process.exit(2);
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const { plan, errors, warnings } = resolveFilm(score, resolve(root, `styles/${score.style}`), root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}
for (const warning of warnings) console.error(`warning: ${warning.message}`);

const report = auditFilm(plan, { root });
const out = resolve(root, "build", score.id);
mkdirSync(out, { recursive: true });
// Which score was audited. Without it `gate:7` cannot tell today's audit from one
// written before the score changed, and a gate that cannot tell is a gate that
// passes on a stale file.
const scoreHash = `sha256:${createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex")}`;
const written = { ...report, score: scoreHash };
writeFileSync(resolve(out, "audit.json"), `${JSON.stringify(written, null, 2)}\n`, "utf8");
console.log(JSON.stringify(written, null, 2));
process.exit(report.ok ? 0 : 1);
