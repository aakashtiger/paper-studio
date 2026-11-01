/**
 * The render manifest: **what a picture was made from**.
 *
 * The renderer is the only step that knows the inputs it painted with, so the
 * renderer writes this file — and nothing else rewrites it. (`deliver` records
 * the delivered audio in `deliver.json`; a second writer here would make the
 * render's own hashes describe files as they are after delivery, which is what
 * `videoFileHash` would then be lying about.)
 *
 * So the writer is `scripts/render-film.ts`, the readers are
 * `scripts/frame-audit.ts` (which refuses a video the manifest does not
 * describe) and `scripts/gate-7.ts` (which re-hashes every path named here), so
 * "the code that painted this frame is still the code on disk" is a checked
 * statement rather than a note.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

export type ManifestScore = {
  id: string;
  style?: string;
  duration: number;
  cast?: { character: string; poses?: string }[];
};

/**
 * One input, with the path that was hashed beside the hash. The path travels
 * because a hash alone cannot be re-checked later, and the list is flat so the
 * gate can walk **every** entry instead of a hand-picked few.
 */
export type InputFile = { path: string; hash: string | null };

export type RenderInputs = {
  files: InputFile[];
};

export type RenderManifest = {
  film: string;
  renderer: string;
  command: string;
  duration: number;
  fps: number;
  frames: number;
  video: string;
  /** The picture: sha256 over the video stream. Survives an audio re-cut. */
  videoHash: string;
  /** The container the render wrote: sha256 over the whole file, audio included. */
  videoFileHash: string;
  /** The audio the render muxed in, if it muxed one. */
  audio: { path: string; hash: string | null } | null;
  inputs: RenderInputs;
};

/** The vendor scripts the film page loads. Missing ones hash to null. */
const VENDOR_FILES = [
  "characters.js",
  "core.js",
  "props.js",
  "scene_kit.js",
  "type.js",
  "gsap.min.js",
];

export async function hashFile(path: string): Promise<string | null> {
  if (!existsSync(path)) return null;
  return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}`;
}

/**
 * The faces a page declares, as `{ family, url }` in page order. Read from the
 * page rather than a list here, so a font the page starts using is pinned the
 * day it is used — and the renderer waits for the family names the page can
 * actually resolve.
 */
export function fontFaces(indexHtml: string): { family: string; url: string }[] {
  const faces = indexHtml.match(/@font-face\s*{[^}]*}/g) ?? [];
  return faces
    .map((face) => ({
      family: /font-family\s*:\s*["']?([^"';]+)["']?/.exec(face)?.[1]?.trim() ?? "",
      url: /url\(\s*["']?([^"')]+)["']?\s*\)/.exec(face)?.[1] ?? "",
    }))
    .filter((face) => face.family !== "" && face.url !== "")
    .map((face) => ({ family: face.family, url: face.url.replace(/^\.?\//, "") }));
}

/** The files a page loads for itself: every `url(...)` inside a `@font-face`. */
export function fontUrls(indexHtml: string): string[] {
  return fontFaces(indexHtml).map((face) => face.url);
}

/**
 * Every file whose contents can change a frame, hashed **now**, with the path
 * that was hashed beside it. The order is fixed, so the manifest is a pure
 * function of the inputs.
 */
export async function renderInputs(
  root: string,
  score: ManifestScore,
  scorePath: string,
): Promise<RenderInputs> {
  const filmDir = resolve(root, "films", score.id);
  const style = score.style ?? "";
  const indexHtml = existsSync(join(filmDir, "index.html"))
    ? await readFile(join(filmDir, "index.html"), "utf8")
    : "";
  const rel = (path: string): string => relative(root, path).replace(/\\/g, "/");

  const named: { path: string; absolute: string }[] = [
    { path: scorePath.replace(/\\/g, "/"), absolute: resolve(root, scorePath) },
    { path: rel(join(filmDir, "score-data.js")), absolute: join(filmDir, "score-data.js") },
    { path: `styles/${style}/canvas/recipes.js`, absolute: resolve(root, `styles/${style}/canvas/recipes.js`) },
    { path: rel(join(filmDir, "painter.js")), absolute: join(filmDir, "painter.js") },
    { path: rel(join(filmDir, "index.html")), absolute: join(filmDir, "index.html") },
    { path: rel(join(filmDir, "captions.srt")), absolute: join(filmDir, "captions.srt") },
    // The vendor scripts are the painter's own library: `type.js` draws every
    // word, `characters.js` every body. They are code that changes frames.
    ...VENDOR_FILES.map((name) => ({
      path: rel(join(filmDir, "vendor", name)),
      absolute: join(filmDir, "vendor", name),
    })),
    // The fonts shape every glyph, and the page names them in one place.
    ...fontUrls(indexHtml).map((url) => ({
      path: rel(join(filmDir, url)),
      absolute: join(filmDir, url),
    })),
    // Pose libraries are cast data, not engine data: a pose edit changes frames
    // without touching code, so each file is hashed here too.
    ...(score.cast ?? [])
      .filter((entry): entry is { character: string; poses: string } => Boolean(entry.poses))
      .map((entry) => ({ path: entry.poses.replace(/\\/g, "/"), absolute: resolve(root, entry.poses) })),
  ];

  return {
    files: await Promise.all(
      named.map(async (file) => ({ path: file.path, hash: await hashFile(file.absolute) })),
    ),
  };
}

/**
 * The inputs that no longer match the files on disk, by path. Pure over a hash
 * function so the gate and its test run the same rule.
 */
export function inputMismatches(
  inputs: RenderInputs | undefined,
  hash: (path: string) => string | null,
): string[] {
  if (!inputs?.files?.length) return ["no inputs recorded"];
  // A recorded `null` is a fact too: the page does not load that file. If it is
  // still absent, nothing moved. The comparison is therefore plain equality —
  // `null !== hash(path)` already catches a file that has since appeared.
  // Treating `null` as a mismatch made every film fail on its own optional
  // vendor scripts.
  if (!inputs.files.some((file) => file.hash !== null)) return ["no inputs recorded"];
  return inputs.files
    .filter((file) => file.hash !== hash(file.path))
    .map((file) => file.path);
}

export function manifestPath(root: string, film: string): string {
  return resolve(root, "build", film, "render-manifest.json");
}

export async function readRenderManifest(
  root: string,
  film: string,
): Promise<RenderManifest | null> {
  const path = manifestPath(root, film);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, "utf8")) as RenderManifest;
  } catch {
    return null;
  }
}
