import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveFilm } from "../src/engine/treatment.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run film -- <score.json> [--style <dir>]");
  process.exit(2);
}

const styleFlag = args.indexOf("--style");
const score = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8")) as {
  style?: string;
};
const styleDir = resolve(
  process.cwd(),
  styleFlag >= 0
    ? (args[styleFlag + 1] ?? `styles/${score.style ?? "paper-kpop"}`)
    : `styles/${score.style ?? "paper-kpop"}`,
);

try {
  const { plan, errors, warnings } = resolveFilm(score, styleDir);
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
} catch (error) {
  if (error instanceof Error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
