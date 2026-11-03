import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { FilmScoreSchema, resolveFilm } from "../src/engine/treatment.js";
import { PoseLibrarySchema, resolvePoseLibrary } from "../src/engine/pose.js";
import { sheetHtml, sheetSlug, type SheetFonts } from "../src/engine/sheet.js";
import { findChrome, fileUrl, shootHtml } from "../src/engine/chrome.js";

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  console.error("usage: npm run sheet -- <score.json> [--out <dir>] [--vendor <dir>] [--no-render]");
  process.exit(2);
}
function arg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}

const root = process.cwd();
const score = FilmScoreSchema.parse(JSON.parse(readFileSync(resolve(root, file), "utf8")));
const styleDir = resolve(root, `styles/${score.style}`);
const { plan, errors } = resolveFilm(score, styleDir, root);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error.message}`);
  process.exit(1);
}

const outDir = resolve(root, arg("out") ?? resolve(root, "build", score.id, "sheets"));
mkdirSync(outDir, { recursive: true });
const usedSlugs = new Set<string>();
const chrome = findChrome();
const render = !args.includes("--no-render") && Boolean(chrome);

const tokens = JSON.parse(readFileSync(resolve(styleDir, "tokens.json"), "utf8")) as {
  type?: { families?: Array<{ role?: string; name?: string; file?: string }> };
};
const families = tokens.type?.families ?? [];
const face = (role: string) => {
  const family = families.find((entry) => entry.role === role) ?? families[0];
  if (!family?.name || !family?.file) throw new Error(`style "${score.style}" has no font for role "${role}"`);
  return { family: family.name, file: family.file };
};
// Paths are relative to the sheet's output folder, so --out and --vendor can
// move the sheet without breaking the fonts or the vendor scripts it loads.
const fonts: SheetFonts = {
  dir: relative(outDir, styleDir).split(sep).join("/"),
  display: face("display"),
  body: face("body"),
  mono: face("caption"),
};
const vendorDir = resolve(root, arg("vendor") ?? resolve(root, "films", score.id, "vendor"));
const vendor = relative(outDir, vendorDir).split(sep).join("/");
if (!existsSync(vendorDir)) {
  console.error(`error: ${vendorDir} is missing; the sheet draws with a film's pinned renderer (pass --vendor)`);
  process.exit(1);
}

/**
 * The sheet draws a character through `window.CHARACTERS[rig]` in the film's own
 * vendor, so the rig id has to be one that vendor registers. Asking the files —
 * the ones the film will actually draw with — catches a typo at the top of the
 * command instead of at the bottom of a blank sheet.
 */
function registeredRigs(dir: string): string[] {
  const rigs = new Set<string>();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".js")) continue;
    const text = readFileSync(resolve(dir, name), "utf8");
    for (const match of text.matchAll(/CHARACTERS\[["']([^"']+)["']\]\s*=/g)) {
      if (match[1]) rigs.add(match[1]);
    }
  }
  return [...rigs].sort();
}
const rigs = registeredRigs(vendorDir);
// The five the pack always has; anything else in the vendor is the film's own
// cast, props or scene code and has to be loaded too or its rigs do not exist.
const PACK_SCRIPTS = ["core.js", "type.js", "characters.js", "props.js", "scene_kit.js"];
const extra = readdirSync(vendorDir)
  .filter((name) => name.endsWith(".js") && !PACK_SCRIPTS.includes(name) && name !== "gsap.min.js")
  .sort();

if (!render && !args.includes("--no-render")) {
  console.error("warning: Chrome not found; writing HTML sheets only");
}

for (const entry of plan.cast) {
  const library = PoseLibrarySchema.parse(
    JSON.parse(readFileSync(resolve(root, entry.poses), "utf8")),
  );
  const poseErrors = resolvePoseLibrary(library);
  if (poseErrors.errors.length > 0) {
    for (const issue of poseErrors.errors) console.error(`error: ${issue.message}`);
    process.exit(1);
  }

  const slug = sheetSlug(library.character);
  if (!slug) {
    console.error(`error: character "${library.character}" has no usable file slug`);
    process.exit(1);
  }
  if (!rigs.includes(library.rig)) {
    console.error(
      `error: films/${score.id}/vendor does not register the rig "${library.rig}"` +
        (rigs.length > 0 ? `; it registers ${rigs.join(", ")}` : "; it registers nothing"),
    );
    process.exit(1);
  }
  if (usedSlugs.has(slug)) {
    console.error(`error: two characters map to the same sheet "${slug}"`);
    process.exit(1);
  }
  usedSlugs.add(slug);

  let html: string;
  let height: number;
  try {
    const sheet = sheetHtml(library, {
      character: library.character,
      rig: library.rig,
      anchors: library.anchors,
      library,
      vendor,
      fonts,
      extra,
    });
    html = sheet.html;
    height = sheet.height;
  } catch (error) {
    console.error(`error: ${error instanceof Error ? error.message : "sheet failed"}`);
    process.exit(1);
  }

  const htmlPath = resolve(outDir, `${slug}.html`);
  writeFileSync(htmlPath, html, "utf8");

  if (render && chrome) {
    const pngPath = resolve(outDir, `${slug}.png`);
    if (existsSync(pngPath)) rmSync(pngPath);
    const shot = shootHtml(chrome, {
      url: fileUrl(htmlPath),
      out: pngPath,
      width: 1920,
      height,
    });
    if (!shot.ok || shot.width !== 1920 || Math.abs(shot.height - height) > 2) {
      console.error(`error: sheet render failed for ${library.character}`);
      process.exit(1);
    }
    console.log(`sheet: ${library.character} → ${relative(root, pngPath).split(sep).join("/")} (${shot.width}×${shot.height})`);
    continue;
  }
  console.log(`sheet: ${library.character} → ${relative(root, htmlPath).split(sep).join("/")}`);
}
