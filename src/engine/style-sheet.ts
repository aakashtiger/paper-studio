/**
 * Derived style sheet.
 *
 * One image that shows what a style pack is: its fonts, its palette, its safe
 * zones, its recipes and one real frame from its painter. It is computed from
 * the pack, never authored, and written under `build/<pack>/`. A creative owner
 * approves a style by looking at this, not by reading a spec.
 *
 * Pure string builder; the CLI measures the page and screenshots it.
 */
import type { LoadedStylePack } from "../core/style.js";
import { REVIEW_CHROME } from "./grid.js";

/** The subset of a loaded pack this sheet reads. Loose on purpose. */
type PackView = {
  capabilities: {
    identity: { id: string; name: string; version: string; status: string; licence: string };
    limits: { aspects: string[]; durations: number[]; maxCast: number; maxWords: number };
    governance: Record<string, unknown>;
  };
  tokens: {
    medium: Record<string, unknown>;
    color: {
      palettes: Record<string, Record<string, string>>;
      roles: string[];
      default: string;
      maxColours: number;
    };
    type: {
      families: Array<{ role: string; name: string; file: string; licence: string }>;
      scale: Record<string, number>;
    };
    layout: {
      safeZones: Array<string | Record<string, unknown>>;
      margins: { top: number; right: number; bottom: number; left: number };
      maxWords: number;
      aspectBoxes?: Record<string, Record<string, { x: number; y: number; w: number; h: number }>>;
    };
    motion: {
      timing: { bpm: number };
      camera: { moves: string[]; default?: string } | { notApplicable: true; reason: string };
      transitions: string[];
      easings: string[];
      minShot: number;
    };
    sound: Record<string, unknown> | { notApplicable: true; reason: string };
    seed: { seeded: string[]; fixed: string[] };
  };
  recipes: Array<{
    id: string;
    beatRoles: string[];
    duration: { min: number; max: number; default: number };
    camera: { move: string };
    slots: string[];
    transitionOut: string;
  }>;
  packHash: string;
};

export type StyleSheetOptions = {
  root: string;
  /** Absolute path of the pack directory (for the font URLs). */
  packPath: string;
  /** Relative href of the hero frame image inside the sheet's folder, if any. */
  hero?: string;
  /** The film's cast, when a film on this pack is supplied. Names only. */
  cast?: Array<{ character: string; poses: string; rig?: string }>;
};

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function fontFace(root: string, packPath: string, id: string, file: string): string {
  const from = `${root}/build/${id}`;
  const to = `${packPath}/${file}`;
  const href = relativePath(from, to);
  const family = file.replace(/^.*\//, "").replace(/\.(ttf|woff2?)$/i, "");
  return `@font-face { font-family: "${family}"; src: url("${href}"); font-display: block; }`;
}

/** Forward-slashed path from one absolute dir to another, for a URL. */
function relativePath(from: string, to: string): string {
  const fromParts = from.replace(/\\/g, "/").split("/");
  const toParts = to.replace(/\\/g, "/").split("/");
  let shared = 0;
  while (shared < fromParts.length && fromParts[shared] === toParts[shared]) shared += 1;
  const up = fromParts.length - shared;
  return [...Array.from({ length: up }, () => ".."), ...toParts.slice(shared)].join("/");
}

export function styleSheetHtml(pack: LoadedStylePack, options: StyleSheetOptions): string {
  const view = pack as unknown as PackView;
  const { identity, limits, governance } = view.capabilities;
  const { color, type, layout, motion, sound, seed } = view.tokens;
  const id = identity.id;
  const root = options.root.replace(/\\/g, "/");
  const packPath = options.packPath.replace(/\\/g, "/");

  const faces = type.families
    .map((family) => fontFace(root, packPath, id, family.file))
    .join("\n");

  const fontRows = type.families
    .map((family) => {
      const familyName = family.file.replace(/^.*\//, "").replace(/\.(ttf|woff2?)$/i, "");
      const size = type.scale[family.role] ?? 24;
      return `<div class="fontrow">
  <div class="fontmeta"><b>${esc(family.role)}</b><span>${esc(family.name)}</span><span>${esc(family.licence)}</span><span>${esc(family.file)}</span></div>
  <div class="specimen" style="font-family:'${esc(familyName)}';font-size:${size}px">Aa Bb Cc 0123 — ${esc(identity.name)}</div>
</div>`;
    })
    .join("\n");

  const paletteBlocks = Object.entries(color.palettes)
    .map(([name, palette]) => {
      const swatches = color.roles
        .map((role) => {
          const hex = palette[role] ?? REVIEW_CHROME.line;
          const ink = luminance(hex) > 0.55 ? REVIEW_CHROME.onLight : REVIEW_CHROME.onDark;
          return `<div class="swatch" style="background:${esc(hex)};color:${ink}"><b>${esc(role)}</b><span>${esc(hex)}</span></div>`;
        })
        .join("");
      const label = name === color.default ? `${name} · default` : name;
      return `<div class="palette"><div class="palettelabel">${esc(label)}</div><div class="swatches">${swatches}</div></div>`;
    })
    .join("\n");

  const safeList = layout.safeZones
    .map((zone) => `<li>${esc(typeof zone === "string" ? zone : JSON.stringify(zone))}</li>`)
    .join("");

  const vertical = layout.aspectBoxes?.["9:16"];
  const anchorNames = vertical ? Object.keys(vertical) : [];
  const anchorBoxes = vertical
    ? Object.entries(vertical)
        .map(([, box], index) => {
          const hue = (index * 47) % 360;
          return `<i style="left:${box.x * 100}%;top:${box.y * 100}%;width:${box.w * 100}%;height:${box.h * 100}%;border-color:hsla(${hue},85%,62%,.85);color:hsla(${hue},85%,72%,.95)">${index + 1}</i>`;
        })
        .join("")
    : "";
  const anchorList = anchorNames
    .map((name, index) => `<span>${index + 1} ${esc(name)}</span>`)
    .join("");

  const recipeRows = view.recipes
    .map(
      (recipe) =>
        `<tr><td>${esc(recipe.id)}</td><td>${recipe.duration.min}–${recipe.duration.max}s <i>(${recipe.duration.default})</i></td><td>${esc(recipe.slots.join(", "))}</td><td>${esc(recipe.camera.move)}</td><td>${esc(recipe.transitionOut)}</td></tr>`,
    )
    .join("");

  const choices = Array.isArray((governance as { choices?: unknown }).choices)
    ? ((governance as { choices: Array<{ id: string; question: string; options: string[]; where: string }> })
        .choices)
        .map(
          (choice) =>
            `<li><b>${esc(choice.id)}</b> — ${esc(choice.question)} <em>(${esc(choice.options.join(" / "))}) · ${esc(choice.where)}</em></li>`,
        )
        .join("")
    : "";

  const camera = "notApplicable" in motion.camera ? null : motion.camera;
  const cameraLabel = camera
    ? camera.moves.join(", ") + (camera.default ? ` (default ${camera.default})` : "")
    : "not applicable";

  const soundRows =
    sound.notApplicable === true
      ? `<li><b>not applicable</b> ${esc(String(sound.reason ?? ""))}</li>`
      : Object.entries(sound)
          .map(
            ([key, value]) =>
              `<li><b>${esc(key)}</b> ${esc(typeof value === "string" ? value : JSON.stringify(value))}</li>`,
          )
          .join("");

  const hero = options.hero
    ? `<img class="hero" src="${esc(options.hero)}" alt="a frame from the pack painter">`
    : `<div class="hero empty">no film on this pack yet — the hero frame is a real painted frame, added when a film exists</div>`;

  const cast = options.cast?.length
    ? `<h2>Cast</h2>
  <p class="mono">Names come from the film, never the pack. The pose lineup image is derived by <code>npm run sheet -- &lt;score&gt;</code>.</p>
  <table><thead><tr><th>character</th><th>poses</th><th>rig</th></tr></thead><tbody>${options.cast
    .map(
      (entry) =>
        `<tr><td>${esc(entry.character)}</td><td>${esc(entry.poses)}</td><td>${esc(entry.rig ?? "pack default")}</td></tr>`,
    )
    .join("")}</tbody></table>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(id)} — style sheet</title>
<style>
${faces}
  * { box-sizing: border-box; }
  body { margin: 0; background: ${REVIEW_CHROME.bg}; color: ${REVIEW_CHROME.text}; font: 15px/1.5 system-ui, sans-serif; padding: 40px; }
  h1 { font-size: 30px; margin: 0; letter-spacing: .06em; }
  h2 { font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: ${REVIEW_CHROME.accent}; margin: 44px 0 14px; }
  .sub { color: ${REVIEW_CHROME.muted}; font: 12px/1.5 ui-monospace, monospace; margin-top: 6px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
  .panel { background: ${REVIEW_CHROME.panel}; border: 1px solid ${REVIEW_CHROME.line}; padding: 18px; }
  .fontrow { border-bottom: 1px solid ${REVIEW_CHROME.line}; padding: 12px 0; }
  .fontrow:last-child { border-bottom: 0; }
  .fontmeta { display: flex; gap: 16px; font: 11px/1.4 ui-monospace, monospace; color: ${REVIEW_CHROME.muted}; }
  .fontmeta b { color: ${REVIEW_CHROME.text}; min-width: 78px; }
  .specimen { margin-top: 8px; }
  .swatches { display: flex; flex-wrap: wrap; gap: 8px; }
  .swatch { width: 116px; height: 78px; padding: 8px; display: flex; flex-direction: column; justify-content: space-between; font: 11px/1.3 ui-monospace, monospace; }
  .palettelabel { font: 12px/1.4 ui-monospace, monospace; margin-bottom: 8px; color: ${REVIEW_CHROME.muted}; }
  .palette { margin-bottom: 16px; }
  .frame16 { position: relative; width: 100%; aspect-ratio: 16 / 9; background: ${REVIEW_CHROME.bg}; border: 1px solid ${REVIEW_CHROME.line}; }
  .frame16 .safe { position: absolute; border: 1px dashed ${REVIEW_CHROME.accent}; opacity: .8; }
  .frame16 .lyric { position: absolute; left: 0; right: 0; bottom: 0; height: 14%; background: rgba(255,255,255,.06); border-top: 1px dashed ${REVIEW_CHROME.accent}; }
  .frame16 .meter { position: absolute; right: 0; top: 0; width: 26%; height: 14%; background: rgba(255,255,255,.06); }
  .frame916 { position: relative; width: 260px; aspect-ratio: 9 / 16; background: ${REVIEW_CHROME.bg}; border: 1px solid ${REVIEW_CHROME.line}; margin: 0 auto; }
  .frame916 i { position: absolute; border: 1px solid ${REVIEW_CHROME.accent}; display: flex; align-items: flex-start; justify-content: flex-end; padding: 1px 2px; font: 9px/1 ui-monospace, monospace; font-style: normal; }
  .anchors { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 12px; }
  .anchors span { font: 10px/1 ui-monospace, monospace; color: ${REVIEW_CHROME.muted}; border: 1px solid ${REVIEW_CHROME.line}; padding: 3px 5px; }
  table { width: 100%; border-collapse: collapse; font: 12px/1.4 ui-monospace, monospace; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid ${REVIEW_CHROME.line}; vertical-align: top; }
  th { color: ${REVIEW_CHROME.muted}; font-weight: 600; }
  ul { margin: 0; padding-left: 18px; font: 12px/1.6 ui-monospace, monospace; color: ${REVIEW_CHROME.text}; }
  .hero { display: block; width: 100%; border: 1px solid ${REVIEW_CHROME.line}; }
  .hero.empty { aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; color: ${REVIEW_CHROME.muted}; font: 12px/1.5 ui-monospace, monospace; text-align: center; padding: 24px; }
  .mono { font: 12px/1.6 ui-monospace, monospace; color: ${REVIEW_CHROME.muted}; }
</style></head>
<body>
  <h1>${esc(identity.name)} <span class="sub">${esc(id)} · ${esc(identity.version)} · ${esc(identity.status)}</span></h1>
  <div class="sub">pack ${esc(view.packHash.slice(0, 24))}… · ${view.recipes.length} recipes · ${esc(limits.aspects.join(" / "))} · ${limits.durations.join(" / ")}s · maxCast ${limits.maxCast} · maxWords ${Math.min(limits.maxWords, layout.maxWords)}</div>

  <h2>Fonts</h2>
  <div class="panel">${fontRows}</div>

  <h2>Palette</h2>
  <div class="panel">${paletteBlocks}</div>

  <div class="cols">
    <div>
      <h2>16:9 safe zones</h2>
      <div class="frame16">
        <div class="safe" style="left:${layout.margins.left * 100}%;top:${layout.margins.top * 100}%;right:${layout.margins.right * 100}%;bottom:${layout.margins.bottom * 100}%"></div>
        <div class="lyric"></div>
        <div class="meter"></div>
      </div>
      <ul>${safeList}</ul>
    </div>
    <div>
      <h2>9:16 anchors</h2>
      ${vertical ? `<div class="frame916">${anchorBoxes}</div><div class="anchors">${anchorList}</div>` : `<div class="mono">no 9:16 map in this pack</div>`}
    </div>
  </div>

  <h2>Recipes</h2>
  <table><thead><tr><th>id</th><th>duration</th><th>slots</th><th>camera</th><th>out</th></tr></thead><tbody>${recipeRows}</tbody></table>

  <div class="cols">
    <div>
      <h2>Motion</h2>
      <ul>
        <li><b>${motion.timing.bpm} BPM</b> · min shot ${motion.minShot}s</li>
        <li><b>moves</b> ${esc(cameraLabel)}</li>
        <li><b>transitions</b> ${esc(motion.transitions.join(", "))}</li>
        <li><b>easings</b> ${esc(motion.easings.join(", "))}</li>
      </ul>
      <h2>Seed</h2>
      <ul>
        <li><b>seeded</b> ${esc(seed.seeded.join(", "))}</li>
        <li><b>fixed</b> ${esc(seed.fixed.join(", "))}</li>
      </ul>
    </div>
    <div>
      <h2>Sound</h2>
      <ul>${soundRows}</ul>
      <h2>Open choices</h2>
      <ul>${choices || "<li>none</li>"}</ul>
    </div>
  </div>

  ${cast}
  <h2>Hero frame</h2>
  ${hero}
  <script>addEventListener('load',function(){document.documentElement.setAttribute('data-sheet-height',String(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)))})</script>
</body></html>
`;
}

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  if (value.length !== 6) return 1;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
