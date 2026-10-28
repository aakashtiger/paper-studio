import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TreatmentSchema, resolveTreatment } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run treatment -- <treatment.json> [--style <dir>]");
  process.exit(2);
}

const styleFlag = args.indexOf("--style");
const treatment = TreatmentSchema.parse(
  JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8")),
);
const styleDir = resolve(
  process.cwd(),
  styleFlag >= 0 ? (args[styleFlag + 1] ?? `styles/${treatment.style}`) : `styles/${treatment.style}`,
);

const { plan, errors, warnings } = resolveTreatment(treatment, styleDir);

for (const warning of warnings) {
  console.error(`warning: ${warning.shot ? `${warning.shot}: ` : ""}${warning.message}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error.shot ? `${error.shot}: ` : ""}${error.message}`);
  }
  process.exit(1);
}

console.log(JSON.stringify(plan, null, 2));
