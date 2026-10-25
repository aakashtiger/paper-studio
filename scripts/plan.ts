import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { WeddingBriefSchema } from "../src/core/brief.js";
import { planWedding } from "../src/engine/plan.js";

const briefFile = process.argv[2] ?? "fixtures/wedding-min/brief.json";
const styleDir = process.argv[3] ?? "styles/paper-vows";

const raw: unknown = JSON.parse(
  readFileSync(resolve(process.cwd(), briefFile), "utf8"),
);

const parsed = WeddingBriefSchema.safeParse(raw);
if (!parsed.success) {
  console.error(`Invalid brief: ${briefFile}\n`);
  for (const issue of parsed.error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    console.error(`  ${path}: ${issue.message}`);
  }
  process.exit(1);
}

const plan = planWedding(parsed.data, resolve(process.cwd(), styleDir));

console.log(JSON.stringify(plan, null, 2));

console.error(
  `\n${plan.shots.length} shots · ${plan.duration}s · ${plan.frames} frames · ${plan.style}@${plan.styleVersion}`,
);
for (const warning of plan.warnings) {
  console.error(`warning: ${warning}`);
}
