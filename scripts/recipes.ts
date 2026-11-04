/**
 * `recipes:list` — the visual vocabulary of a pack, in plain words.
 *
 * A director writes the scene's visual idea first, then asks which recipe can
 * draw it. This prints each recipe's `subjects`, slots and duration; `--subject`
 * narrows the list to recipes that can draw a named thing. It is a read-only
 * menu, not an auto-picker: the shot still names the recipe and says why.
 *
 * usage: npm run recipes:list -- [--style paper-kpop] [--subject "phone route"]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const style = flag("style") ?? "paper-kpop";
const subject = flag("subject")?.toLowerCase();
const root = process.cwd();
const dir = resolve(root, "styles", style, "recipes");
const rows = readdirSync(dir)
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")) as {
    id: string;
    subjects?: string[];
    slots?: string[];
    duration?: { min?: number; max?: number };
    openingDefault?: boolean;
  })
  .filter((recipe) => !subject || (recipe.subjects ?? []).some((s) => s.toLowerCase().includes(subject)))
  .sort((a, b) => a.id.localeCompare(b.id));

for (const recipe of rows) {
  const duration = recipe.duration ? `${recipe.duration.min}–${recipe.duration.max}s` : "—";
  console.log(
    `${recipe.id.padEnd(16)} ${duration.padEnd(9)} ${(recipe.slots ?? []).join(", ").padEnd(26)} ` +
      `${(recipe.subjects ?? []).join(", ")}${recipe.openingDefault ? "  [default opening]" : ""}`,
  );
}
console.log(`recipes: ${rows.length} in styles/${style}/recipes`);
