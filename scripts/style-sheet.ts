/**
 * Style sheet (decision 0017, step 3).
 *
 * One picture that shows what a style pack is: its fonts, its palettes, its
 * safe zones, its recipes, its sound and seed rules, its open choices and, when
 * a film on the pack exists, one real frame the pack's painter drew. The sheet
 * is derived from the pack, never authored, and written under `build/<pack>/` so
 * it never enters the pack hash or the style contract.
 *
 * A creative owner approves a style by looking at this one image.
 *
 * usage: npm run style:sheet -- styles/paper-kpop [--film films/understudy/score.json] [--width 1100]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { loadStylePack } from "../src/core/style.js";
import { FilmScoreSchema } from "../src/engine/treatment.js";
import { styleSheetHtml } from "../src/engine/style-sheet.js";
import { findChrome, fileUrl, pageHeight, shootHtml, pngSize } from "../src/engine/chrome.js";

const args = process.argv.slice(2);
const packArg = args.find((arg) => !arg.startsWith("--"));
if (!packArg) {
  console.error("usage: npm run style:sheet -- <packDir> [--film <score.json>] [--width 1100]");
  process.exit(2);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function renderHero(
  root: string,
  scorePath: string,
  time: number,
  outDir: string,
): Promise<string> {
  await new Promise<void>((done, fail) => {
    const child = spawn(
      process.execPath,
      [
        "--import", "tsx", "scripts/render-film.ts", scorePath,
        "--stills", String(time),
        "--out-dir", outDir,
      ],
      { stdio: ["ignore", "inherit", "inherit"], cwd: root },
    );
    child.on("close", (code) => (code === 0 ? done() : fail(new Error(`render-film exited ${code}`))));
  });
  const frame = join(outDir, `t-${time.toFixed(2).padStart(5, "0")}.png`);
  if (!existsSync(frame)) throw new Error(`hero frame was not painted: ${frame}`);
  return frame;
}

async function main(): Promise<void> {
  const root = process.cwd();
  const packPath = resolve(root, packArg as string);
  const pack = loadStylePack(packPath);
  const id = pack.capabilities.identity.id;
  const outDir = resolve(root, "build", id);
  mkdirSync(outDir, { recursive: true });

  const filmArg = arg("film");
  let hero: string | undefined;
  let cast: Array<{ character: string; poses: string; rig?: string }> | undefined;
  if (filmArg) {
    const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, filmArg), "utf8")));
    if (score.style !== id) {
      console.error(`error: ${filmArg} is a "${score.style}" film, not "${id}"`);
      process.exit(1);
    }
    cast = score.cast;
    // One representative moment, mid-film, deterministic.
    const time = Number((score.duration / 2).toFixed(2));
    const heroPath = await renderHero(root, filmArg, time, outDir);
    hero = "hero.png";
    writeFileSync(resolve(outDir, "hero.png"), readFileSync(heroPath));
  }

  const html = styleSheetHtml(pack, { root, packPath, hero, cast });
  const htmlPath = resolve(outDir, "style-sheet.html");
  writeFileSync(htmlPath, html, "utf8");

  const width = Number(arg("width") ?? 1100);
  const sheetPath = resolve(outDir, "style-sheet.png");
  const chrome = findChrome();
  let rendered: { width: number; height: number } | null = null;
  if (!chrome) {
    console.error("error: Chrome not found; cannot render the style sheet");
    process.exit(1);
  }
  const url = fileUrl(htmlPath);
  const height = pageHeight(chrome, url, width);
  if (!height) {
    console.error("error: style sheet page did not report a height");
    process.exit(1);
  }
  const shot = shootHtml(chrome, { url, out: sheetPath, width, height });
  if (!shot.ok || shot.width !== width) {
    console.error("error: style sheet render failed");
    process.exit(1);
  }
  rendered = { width: shot.width, height: shot.height };

  const size = pngSize(sheetPath);
  const checks = {
    packLoaded: pack.recipes.length > 0 && pack.tokens.type.families.length > 0,
    htmlWritten: existsSync(htmlPath),
    sheetWritten: existsSync(sheetPath) && Boolean(size),
    everyRecipeShown: pack.recipes.every((recipe) => html.includes(recipe.id)),
    everyPaletteShown: Object.keys(pack.tokens.color.palettes).every((name) => html.includes(name)),
    heroOnSheet: filmArg ? Boolean(hero) && existsSync(resolve(outDir, "hero.png")) : true,
  };
  const pass = Object.values(checks).every(Boolean);

  writeFileSync(
    resolve(outDir, "style-sheet.json"),
    `${JSON.stringify(
      {
        pack: id,
        version: pack.capabilities.identity.version,
        packHash: pack.packHash,
        pass,
        film: filmArg ?? null,
        cast: cast?.map((entry) => entry.character) ?? [],
        recipes: pack.recipes.length,
        palettes: Object.keys(pack.tokens.color.palettes),
        fonts: pack.tokens.type.families.map((family) => family.file),
        sheet: rendered ? { path: `build/${id}/style-sheet.png`, ...rendered } : null,
        hero: hero ? `build/${id}/hero.png` : null,
        checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`style-sheet: ${id} ${pack.capabilities.identity.version} · ${pack.recipes.length} recipes`);
  if (rendered) console.log(`style-sheet: ${rendered.width}×${rendered.height} → build/${id}/style-sheet.png`);
  if (hero) console.log(`style-sheet: hero frame → build/${id}/hero.png`);
  if (!pass) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
